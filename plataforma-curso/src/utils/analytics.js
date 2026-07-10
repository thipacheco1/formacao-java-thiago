const VISITOR_KEY = 'course_analytics_visitor_v1';
const SESSION_KEY = 'course_analytics_session_v1';
const ATTRIBUTION_KEY = 'course_analytics_attribution_v1';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

let memoryVisitorId = null;
let memorySession = null;
let lastPageEvent = null;

const createId = (prefix) => {
  const randomPart = globalThis.crypto?.randomUUID?.()
    || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}_${randomPart}`;
};

const readJson = (storage, key) => {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const writeJson = (storage, key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Analytics must never interfere with the course experience.
  }
};

const getVisitorId = () => {
  try {
    const stored = localStorage.getItem(VISITOR_KEY);
    if (stored) return stored;

    const visitorId = createId('v');
    localStorage.setItem(VISITOR_KEY, visitorId);
    return visitorId;
  } catch {
    if (!memoryVisitorId) memoryVisitorId = createId('v');
    return memoryVisitorId;
  }
};

const getSessionId = () => {
  const now = Date.now();

  try {
    const stored = readJson(sessionStorage, SESSION_KEY);
    const isActive = stored?.id && now - Number(stored.lastSeen || 0) < SESSION_TIMEOUT_MS;
    const session = isActive ? stored : { id: createId('s'), lastSeen: now };
    session.lastSeen = now;
    writeJson(sessionStorage, SESSION_KEY, session);
    return session.id;
  } catch {
    const isActive = memorySession && now - memorySession.lastSeen < SESSION_TIMEOUT_MS;
    if (!isActive) memorySession = { id: createId('s'), lastSeen: now };
    memorySession.lastSeen = now;
    return memorySession.id;
  }
};

const normalizeSlug = (value, fallback = '') => String(value || fallback)
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9._-]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 64);

const getSourceBucket = (utmSource, referrerHost) => {
  const source = normalizeSlug(utmSource);
  const host = String(referrerHost || '').toLowerCase();

  if (source) {
    if (source.includes('google')) return 'google';
    if (source.includes('bing')) return 'bing';
    if (source.includes('github')) return 'github';
    if (source.includes('linkedin')) return 'linkedin';
    if (source.includes('whatsapp')) return 'whatsapp';
    if (source.includes('instagram')) return 'instagram';
    if (source.includes('facebook')) return 'facebook';
    if (source.includes('email') || source.includes('newsletter')) return 'email';
    return 'other';
  }

  if (!host) return 'direct';
  if (host === window.location.hostname) return 'internal';
  if (host.includes('google.')) return 'google';
  if (host.includes('bing.com')) return 'bing';
  if (host.includes('github.com')) return 'github';
  if (host.includes('linkedin.com') || host.includes('lnkd.in')) return 'linkedin';
  if (host.includes('whatsapp.com') || host.includes('wa.me')) return 'whatsapp';
  if (host.includes('instagram.com')) return 'instagram';
  if (host.includes('facebook.com') || host.includes('fb.com')) return 'facebook';
  return 'other';
};

const getAttribution = () => {
  const stored = readJson(localStorage, ATTRIBUTION_KEY);
  if (stored?.source) {
    return {
      source: stored.source,
      campaign: stored.campaign && stored.campaign !== 'none' ? stored.campaign : null
    };
  }

  const params = new URLSearchParams(window.location.search);
  let referrerHost = '';
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : '';
  } catch {
    referrerHost = '';
  }

  const attribution = {
    source: getSourceBucket(params.get('utm_source'), referrerHost),
    campaign: normalizeSlug(params.get('utm_campaign')) || null
  };
  writeJson(localStorage, ATTRIBUTION_KEY, attribution);
  return attribution;
};

const shouldTrack = () => (
  navigator.doNotTrack !== '1'
  && navigator.globalPrivacyControl !== true
);

const postEvent = async (payload) => {
  if (!shouldTrack()) return;

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      credentials: 'same-origin',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch {
    // Metrics degrade silently when the analytics service is unavailable.
  }
};

const buildBasePayload = (pageId) => {
  const attribution = getAttribution();
  return {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    pageId,
    source: attribution.source,
    campaign: attribution.campaign
  };
};

export const trackPageView = (pageId) => {
  const now = Date.now();
  const canReuseEvent = lastPageEvent?.pageId === pageId && now - lastPageEvent.createdAt < 1500;
  const eventId = canReuseEvent ? lastPageEvent.eventId : createId('e');

  lastPageEvent = { pageId, eventId, createdAt: now };
  return postEvent({
    ...buildBasePayload(pageId),
    type: 'pageview',
    eventId
  });
};

export const trackPresence = (pageId) => postEvent({
  ...buildBasePayload(pageId),
  type: 'heartbeat',
  eventId: createId('h')
});
