const crypto = require('crypto');
const adminSession = require('./_lib/admin-session.js');
const requireAdminRequest = adminSession.requireAdminRequest || adminSession.requireAdminSession;

const BASE_NAMESPACE = 'analytics:v1';
const ANALYTICS_TIME_ZONE = 'America/Sao_Paulo';
const AGGREGATE_TTL_SECONDS = 400 * 24 * 60 * 60;
const DEDUPE_TTL_SECONDS = 10 * 60;
const SESSION_TTL_SECONDS = 30 * 60;
const ONLINE_KEY_TTL_SECONDS = 10 * 60;
const ONLINE_WINDOW_SECONDS = 130;
const TEMP_KEY_TTL_SECONDS = 60;
const RATE_LIMIT_TTL_SECONDS = 2 * 60;
const RATE_LIMIT_PER_MINUTE = 120;
const MAX_BODY_BYTES = 4096;
const PIPELINE_BATCH_SIZE = 100;
const ALLOWED_RANGES = new Set([7, 30, 90, 365]);
const ALLOWED_SOURCES = new Set([
  'direct',
  'google',
  'bing',
  'github',
  'linkedin',
  'facebook',
  'instagram',
  'whatsapp',
  'internal',
  'email',
  'other'
]);

function getAnalyticsNamespace() {
  const configuredNamespace = String(process.env.ANALYTICS_NAMESPACE || '').trim();
  if (configuredNamespace && /^[a-z0-9][a-z0-9:_-]{0,63}$/i.test(configuredNamespace)) {
    return configuredNamespace;
  }

  // Vercel sets VERCEL=1 in deployments. Local builds therefore remain isolated
  // even when NODE_ENV happens to be "production" (for example, `vite preview`).
  const rawEnvironment = process.env.ANALYTICS_ENV
    || (process.env.VERCEL === '1' ? process.env.VERCEL_ENV : 'development')
    || 'development';
  const environment = String(rawEnvironment)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24) || 'development';

  return environment === 'production'
    ? BASE_NAMESPACE
    : `${BASE_NAMESPACE}:${environment}`;
}

const NAMESPACE = getAnalyticsNamespace();

const UPDATE_DAILY_UNIQUES_LUA = `
redis.call('PFADD', KEYS[1], ARGV[1])
local unique_count = redis.call('PFCOUNT', KEYS[1])
redis.call('HSET', KEYS[2], 'visitors', unique_count)
redis.call('EXPIRE', KEYS[1], ARGV[2])
redis.call('EXPIRE', KEYS[2], ARGV[2])
return unique_count
`;

const PAGEVIEW_GATE_LUA = `
local rate = redis.call('INCR', KEYS[1])
redis.call('EXPIRE', KEYS[1], ARGV[1])

if rate > tonumber(ARGV[2]) then
  return { rate, 0, 0 }
end

local is_new_event = redis.call('SET', KEYS[2], '1', 'NX', 'EX', ARGV[3])
if not is_new_event then
  redis.call('EXPIRE', KEYS[3], ARGV[4])
  return { rate, 0, 0 }
end

local is_new_session = redis.call('SET', KEYS[3], '1', 'NX', 'EX', ARGV[4])
redis.call('EXPIRE', KEYS[3], ARGV[4])

return { rate, 1, is_new_session and 1 or 0 }
`;

const dayFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: ANALYTICS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

function getRedisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const hashSecret = process.env.ANALYTICS_HASH_SECRET || token;

  if (!url || !token || !hashSecret) return null;

  return {
    url: url.replace(/\/+$/, ''),
    token,
    hashSecret
  };
}

async function runRedisPipeline(config, commands) {
  if (!commands.length) return [];

  const response = await fetch(`${config.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commands),
    signal: typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(8000)
      : undefined
  });

  if (!response.ok) {
    throw new Error(`Redis pipeline failed with status ${response.status}`);
  }

  const payload = await response.json();
  const entries = Array.isArray(payload) ? payload : payload && payload.result;

  if (!Array.isArray(entries) || entries.length !== commands.length) {
    throw new Error('Redis pipeline returned an invalid response');
  }

  return entries.map((entry) => {
    if (entry && entry.error) {
      throw new Error(`Redis command failed: ${entry.error}`);
    }
    return entry ? entry.result : null;
  });
}

function hmacIdentifier(config, kind, value) {
  return crypto
    .createHmac('sha256', config.hashSecret)
    .update(`${kind}:${value}`)
    .digest('base64url')
    .slice(0, 22);
}

function getHeader(req, name) {
  const value = req.headers && req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function getClientAddress(req) {
  const forwarded = getHeader(req, 'x-forwarded-for');
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim().slice(0, 96);
  }

  const realIp = getHeader(req, 'x-real-ip');
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim().slice(0, 96);
  }

  return 'unknown';
}

function isBotUserAgent(userAgent) {
  return /bot|crawler|spider|slurp|lighthouse|headlesschrome|facebookexternalhit|facebot/i.test(userAgent || '');
}

function getDeviceBucket(userAgent) {
  const value = String(userAgent || '').toLowerCase();
  if (!value) return 'other';
  if (/ipad|tablet|kindle|silk|android(?!.*mobile)/i.test(value)) return 'tablet';
  if (/mobi|iphone|ipod|android/i.test(value)) return 'mobile';
  return 'desktop';
}

function isOpaqueId(value) {
  return typeof value === 'string'
    && value.length >= 16
    && value.length <= 128
    && /^[A-Za-z0-9_-]+$/.test(value);
}

function normalizePageId(value) {
  if (value === 'home') return 'home';
  if (value === 'public:trilhas') return value;
  if (typeof value !== 'string' || value.length > 230) return null;
  if (/^public:(?:trilha|modulo):[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 130) {
    return value;
  }
  if (!/^lesson:[0-9]{3}_[A-Za-z0-9_.-]{1,210}\.md$/.test(value)) return null;
  return value;
}

function normalizeSource(value) {
  if (typeof value !== 'string' || !value.trim()) return 'direct';
  const normalized = value.trim().toLowerCase();
  return ALLOWED_SOURCES.has(normalized) ? normalized : 'other';
}

function normalizeCampaign(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized.length > 48) return null;
  return /^[a-z0-9][a-z0-9_-]*$/.test(normalized) ? normalized : null;
}

function parseRequestBody(req) {
  let body = req.body;

  if (Buffer.isBuffer(body)) body = body.toString('utf8');
  if (typeof body === 'string') {
    if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) return null;
    try {
      body = JSON.parse(body);
    } catch (_error) {
      return null;
    }
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  if (Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) return null;
  return body;
}

function formatDay(date) {
  const parts = dayFormatter.formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getDayRange(rangeDays, now = new Date()) {
  const today = formatDay(now);
  const [year, month, day] = today.split('-').map(Number);
  const anchor = Date.UTC(year, month - 1, day, 12);
  const result = [];

  for (let offset = rangeDays - 1; offset >= 0; offset -= 1) {
    result.push(new Date(anchor - offset * 86400000).toISOString().slice(0, 10));
  }

  return result;
}

function parseHashResult(result) {
  if (!result) return {};
  if (!Array.isArray(result) && typeof result === 'object') return result;

  const parsed = {};
  for (let index = 0; index < result.length; index += 2) {
    parsed[String(result[index])] = result[index + 1];
  }
  return parsed;
}

function toCount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

function addCount(map, name, value) {
  const count = toCount(value);
  if (!name || count <= 0) return;
  map.set(name, (map.get(name) || 0) + count);
}

function toRanking(map, limit) {
  return Array.from(map, ([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
    .slice(0, limit);
}

function chunk(items, size) {
  const result = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function getRequestedRange(req) {
  let rawDays = req.query && req.query.days;

  if (Array.isArray(rawDays)) rawDays = rawDays[0];
  if (rawDays === undefined && req.url) {
    rawDays = new URL(req.url, 'http://localhost').searchParams.get('days');
  }

  if (rawDays === undefined || rawDays === null || rawDays === '') return 30;
  const parsed = Number(rawDays);
  return Number.isInteger(parsed) && ALLOWED_RANGES.has(parsed) ? parsed : null;
}

function setCommonHeaders(res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Vary', 'Cookie');
}

function sendJson(res, status, payload) {
  return res.status(status).json(payload);
}

function buildPresenceCommands(pageId, presenceHash, nowSeconds) {
  const cutoff = nowSeconds - ONLINE_WINDOW_SECONDS;
  const onlineKey = `${NAMESPACE}:online`;
  const onlinePagesKey = `${NAMESPACE}:online:pages`;
  const pageOnlineKey = `${NAMESPACE}:online:page:${pageId}`;

  return [
    ['ZADD', onlineKey, nowSeconds, presenceHash],
    ['ZADD', onlinePagesKey, nowSeconds, pageId],
    ['ZADD', pageOnlineKey, nowSeconds, presenceHash],
    ['ZREMRANGEBYSCORE', onlineKey, '-inf', cutoff],
    ['ZREMRANGEBYSCORE', onlinePagesKey, '-inf', cutoff],
    ['ZREMRANGEBYSCORE', pageOnlineKey, '-inf', cutoff],
    ['EXPIRE', onlineKey, ONLINE_KEY_TTL_SECONDS],
    ['EXPIRE', onlinePagesKey, ONLINE_KEY_TTL_SECONDS],
    ['EXPIRE', pageOnlineKey, ONLINE_KEY_TTL_SECONDS]
  ];
}

async function handleHeartbeat(req, res, config, event) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const minuteBucket = Math.floor(nowSeconds / 60);
  const presenceHash = hmacIdentifier(config, 'presence', event.visitorId);
  const sessionHash = hmacIdentifier(config, 'session', event.sessionId);
  const rateHash = hmacIdentifier(
    config,
    'rate',
    `${getClientAddress(req)}:${event.visitorId}`
  );
  const rateKey = `${NAMESPACE}:rate:${minuteBucket}:${rateHash}`;
  const sessionKey = `${NAMESPACE}:session:${sessionHash}`;

  const gateResults = await runRedisPipeline(config, [
    ['INCR', rateKey],
    ['EXPIRE', rateKey, RATE_LIMIT_TTL_SECONDS],
    ['EXPIRE', sessionKey, SESSION_TTL_SECONDS]
  ]);
  const rate = toCount(gateResults[0]);

  if (rate > RATE_LIMIT_PER_MINUTE) {
    res.setHeader('Retry-After', '60');
    return sendJson(res, 429, { error: 'Too many analytics events' });
  }

  await runRedisPipeline(
    config,
    buildPresenceCommands(event.pageId, presenceHash, nowSeconds)
  );
  return res.status(204).end();
}

async function handlePageview(req, res, config, event, device) {
  const now = new Date();
  const nowSeconds = Math.floor(now.getTime() / 1000);
  const day = formatDay(now);
  const minuteBucket = Math.floor(nowSeconds / 60);
  const visitorHash = hmacIdentifier(config, 'visitor', event.visitorId);
  const sessionHash = hmacIdentifier(config, 'session', event.sessionId);
  const presenceHash = hmacIdentifier(config, 'presence', event.visitorId);
  const eventHash = hmacIdentifier(config, 'event', event.eventId);
  const rateHash = hmacIdentifier(
    config,
    'rate',
    `${getClientAddress(req)}:${event.visitorId}`
  );

  const dedupeKey = `${NAMESPACE}:dedupe:${eventHash}`;
  const sessionKey = `${NAMESPACE}:session:${sessionHash}`;
  const rateKey = `${NAMESPACE}:rate:${minuteBucket}:${rateHash}`;
  const dayKey = `${NAMESPACE}:day:${day}`;
  const uniqueKey = `${NAMESPACE}:unique:${day}`;

  const gateResults = await runRedisPipeline(config, [[
    'EVAL',
    PAGEVIEW_GATE_LUA,
    3,
    rateKey,
    dedupeKey,
    sessionKey,
    RATE_LIMIT_TTL_SECONDS,
    RATE_LIMIT_PER_MINUTE,
    DEDUPE_TTL_SECONDS,
    SESSION_TTL_SECONDS
  ]]);
  const gate = Array.isArray(gateResults[0]) ? gateResults[0] : [];

  const rate = toCount(gate[0]);
  if (rate > RATE_LIMIT_PER_MINUTE) {
    res.setHeader('Retry-After', '60');
    return sendJson(res, 429, { error: 'Too many analytics events' });
  }

  if (toCount(gate[1]) !== 1) {
    return res.status(204).end();
  }

  const isNewSession = toCount(gate[2]) === 1;
  const commands = [
    ['HINCRBY', dayKey, 'pageviews', 1],
    ['HINCRBY', dayKey, `page:${event.pageId}`, 1],
    ['HINCRBY', dayKey, `device:${device}`, 1],
    [
      'EVAL',
      UPDATE_DAILY_UNIQUES_LUA,
      2,
      uniqueKey,
      dayKey,
      visitorHash,
      AGGREGATE_TTL_SECONDS
    ],
    ...buildPresenceCommands(event.pageId, presenceHash, nowSeconds)
  ];

  if (isNewSession) {
    commands.push(
      ['HINCRBY', dayKey, 'sessions', 1],
      ['HINCRBY', dayKey, `source:${event.source}`, 1]
    );

    if (event.campaign) {
      commands.push(['HINCRBY', dayKey, `campaign:${event.campaign}`, 1]);
    }
  }

  await runRedisPipeline(config, commands);
  return res.status(204).end();
}

async function handlePost(req, res, config) {
  const body = parseRequestBody(req);
  if (!body) return sendJson(res, 400, { error: 'Invalid analytics payload' });

  const type = body.type;
  const pageId = normalizePageId(body.pageId);
  const eventIdValid = isOpaqueId(body.eventId);
  const visitorIdValid = isOpaqueId(body.visitorId);
  const sessionIdValid = isOpaqueId(body.sessionId);

  if (
    (type !== 'pageview' && type !== 'heartbeat')
    || !pageId
    || !eventIdValid
    || !visitorIdValid
    || !sessionIdValid
  ) {
    return sendJson(res, 400, { error: 'Invalid analytics event' });
  }

  const userAgent = getHeader(req, 'user-agent') || '';
  if (isBotUserAgent(userAgent)) return res.status(204).end();

  const event = {
    type,
    eventId: body.eventId,
    visitorId: body.visitorId,
    sessionId: body.sessionId,
    pageId,
    source: normalizeSource(body.source),
    campaign: normalizeCampaign(body.campaign)
  };

  if (type === 'heartbeat') {
    return handleHeartbeat(req, res, config, event);
  }

  return handlePageview(req, res, config, event, getDeviceBucket(userAgent));
}

async function readDailyHashes(config, days) {
  const commands = days.map(day => ['HGETALL', `${NAMESPACE}:day:${day}`]);
  const batches = chunk(commands, PIPELINE_BATCH_SIZE);
  const results = [];

  for (const batch of batches) {
    results.push(...await runRedisPipeline(config, batch));
  }

  return results.map(parseHashResult);
}

async function readRangeUniqueAndOnline(config, days) {
  const tempKey = `${NAMESPACE}:temp:unique:${crypto.randomBytes(8).toString('hex')}`;
  const uniqueKeys = days.map(day => `${NAMESPACE}:unique:${day}`);
  const nowSeconds = Math.floor(Date.now() / 1000);
  const cutoff = nowSeconds - ONLINE_WINDOW_SECONDS;
  const onlineKey = `${NAMESPACE}:online`;

  const results = await runRedisPipeline(config, [
    ['PFMERGE', tempKey, ...uniqueKeys],
    ['PFCOUNT', tempKey],
    ['EXPIRE', tempKey, TEMP_KEY_TTL_SECONDS],
    ['ZREMRANGEBYSCORE', onlineKey, '-inf', cutoff],
    ['ZCOUNT', onlineKey, cutoff + 1, '+inf']
  ]);

  return {
    uniqueVisitors: toCount(results[1]),
    online: toCount(results[4])
  };
}

function buildDashboardPayload(rangeDays, days, hashes, liveSummary) {
  const sourceCounts = new Map();
  const pageCounts = new Map();
  const deviceCounts = new Map();
  const campaignCounts = new Map();
  let totalPageviews = 0;
  let totalSessions = 0;

  const series = hashes.map((hash, index) => {
    const pageviews = toCount(hash.pageviews);
    const sessions = toCount(hash.sessions);
    const visitors = toCount(hash.visitors);
    totalPageviews += pageviews;
    totalSessions += sessions;

    for (const [field, value] of Object.entries(hash)) {
      if (field.startsWith('source:')) addCount(sourceCounts, field.slice(7), value);
      else if (field.startsWith('page:')) addCount(pageCounts, field.slice(5), value);
      else if (field.startsWith('device:')) addCount(deviceCounts, field.slice(7), value);
      else if (field.startsWith('campaign:')) addCount(campaignCounts, field.slice(9), value);
    }

    return {
      date: days[index],
      pageviews,
      sessions,
      visitors
    };
  });

  const today = series[series.length - 1] || {
    pageviews: 0,
    sessions: 0,
    visitors: 0
  };

  return {
    rangeDays,
    summary: {
      pageviews: totalPageviews,
      sessions: totalSessions,
      uniqueVisitors: liveSummary.uniqueVisitors,
      online: liveSummary.online,
      today: {
        pageviews: today.pageviews,
        sessions: today.sessions,
        visitors: today.visitors
      }
    },
    series,
    sources: toRanking(sourceCounts, ALLOWED_SOURCES.size),
    pages: toRanking(pageCounts, 50),
    devices: toRanking(deviceCounts, 10),
    campaigns: toRanking(campaignCounts, 25),
    generatedAt: new Date().toISOString(),
    onlineWindowSeconds: ONLINE_WINDOW_SECONDS
  };
}

async function handleGet(req, res, config) {
  const admin = await requireAdminRequest(req, res);
  if (!admin) return undefined;

  if (!config) {
    return sendJson(res, 500, { error: 'Analytics storage is not configured' });
  }

  const rangeDays = getRequestedRange(req);
  if (!rangeDays) {
    return sendJson(res, 400, { error: 'days must be one of 7, 30, 90 or 365' });
  }

  const days = getDayRange(rangeDays);
  const [hashes, liveSummary] = await Promise.all([
    readDailyHashes(config, days),
    readRangeUniqueAndOnline(config, days)
  ]);

  return sendJson(res, 200, buildDashboardPayload(rangeDays, days, hashes, liveSummary));
}

module.exports = async function handler(req, res) {
  setCommonHeaders(res);
  res.setHeader('Allow', 'GET, POST');

  try {
    if (req.method === 'POST') {
      const config = getRedisConfig();
      if (!config) return sendJson(res, 500, { error: 'Analytics storage is not configured' });
      return await handlePost(req, res, config);
    }

    if (req.method === 'GET') return await handleGet(req, res, getRedisConfig());
    return sendJson(res, 405, { error: 'Method not allowed' });
  } catch (error) {
    console.error('Analytics API error:', error && error.message ? error.message : error);
    if (res.headersSent || res.writableEnded) return undefined;
    return sendJson(res, 500, { error: 'Analytics service is temporarily unavailable' });
  }
};
