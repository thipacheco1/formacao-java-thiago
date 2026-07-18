const MAX_EMAIL_LENGTH = 254;
const { readAdminSession } = require('./_lib/admin-session');
const { readUserSession } = require('./_lib/user-session');
const MAX_LESSON_ID_LENGTH = 220;
const MAX_COMPLETED_LESSONS = 1000;
const CORRUPT_PROGRESS_ERROR = 'CORRUPT_PROGRESS_DATA';
const PROGRESS_LIMIT_ERROR = 'PROGRESS_LIMIT_EXCEEDED';

const LESSON_ID_PATTERN = /^[A-Za-z0-9_.-]+$/;

// A lesson update is a single Redis operation. Reading, changing one lesson
// and saving the result therefore cannot overwrite an update from another
// device between those steps.
const UPDATE_LESSON_SCRIPT = `
  local data = {}
  local completedCount = 0
  local stored = redis.call('GET', KEYS[1])

  if stored then
    local trimmed = string.match(stored, '^%s*(.-)%s*$')
    local firstCharacter = string.sub(trimmed, 1, 1)
    local lastCharacter = string.sub(trimmed, -1)
    local ok, decoded = pcall(cjson.decode, stored)
    if not ok or type(decoded) ~= 'table' then
      return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
    end

    if firstCharacter == '[' and lastCharacter == ']' then
      for _, storedLessonId in ipairs(decoded) do
        if type(storedLessonId) ~= 'string'
          or string.len(storedLessonId) < 1
          or string.len(storedLessonId) > 220
          or string.find(storedLessonId, '[^A-Za-z0-9_.%-]') then
          return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
        end

        if data[storedLessonId] == nil then
          completedCount = completedCount + 1
        end
        if completedCount > tonumber(ARGV[3]) then
          return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
        end
        data[storedLessonId] = true
      end
    elseif firstCharacter == '{' and lastCharacter == '}' then
      for storedLessonId, isCompleted in pairs(decoded) do
        if type(storedLessonId) ~= 'string'
          or string.len(storedLessonId) < 1
          or string.len(storedLessonId) > 220
          or string.find(storedLessonId, '[^A-Za-z0-9_.%-]')
          or (isCompleted ~= true and isCompleted ~= false) then
          return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
        end

        completedCount = completedCount + 1
        if completedCount > tonumber(ARGV[3]) then
          return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
        end
        if isCompleted == true then
          data[storedLessonId] = true
        end
      end
    else
        return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
    end
  end

  if ARGV[2] == '1' then
    if data[ARGV[1]] == nil and completedCount >= tonumber(ARGV[3]) then
      return redis.error_reply('${PROGRESS_LIMIT_ERROR}')
    end
    data[ARGV[1]] = true
  else
    data[ARGV[1]] = nil
  end

  local encoded = cjson.encode(data)
  redis.call('SET', KEYS[1], encoded)
  return encoded
`;

// This endpoint form exists only to bring pre-sync local progress into Redis.
// It is deliberately additive: an old device snapshot may add completed
// lessons, but can never erase newer progress saved by another device.
const MERGE_PROGRESS_SCRIPT = `
  local data = {}
  local completedCount = 0
  local stored = redis.call('GET', KEYS[1])

  if stored then
    local trimmed = string.match(stored, '^%s*(.-)%s*$')
    local firstCharacter = string.sub(trimmed, 1, 1)
    local lastCharacter = string.sub(trimmed, -1)
    local ok, decoded = pcall(cjson.decode, stored)
    if not ok or type(decoded) ~= 'table' then
      return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
    end

    if firstCharacter == '[' and lastCharacter == ']' then
      for _, storedLessonId in ipairs(decoded) do
        if type(storedLessonId) ~= 'string'
          or string.len(storedLessonId) < 1
          or string.len(storedLessonId) > 220
          or string.find(storedLessonId, '[^A-Za-z0-9_.%-]') then
          return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
        end

        if data[storedLessonId] == nil then
          completedCount = completedCount + 1
        end
        if completedCount > tonumber(ARGV[2]) then
          return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
        end
        data[storedLessonId] = true
      end
    elseif firstCharacter == '{' and lastCharacter == '}' then
      for storedLessonId, isCompleted in pairs(decoded) do
        if type(storedLessonId) ~= 'string'
          or string.len(storedLessonId) < 1
          or string.len(storedLessonId) > 220
          or string.find(storedLessonId, '[^A-Za-z0-9_.%-]')
          or (isCompleted ~= true and isCompleted ~= false) then
          return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
        end

        completedCount = completedCount + 1
        if completedCount > tonumber(ARGV[2]) then
          return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
        end
        if isCompleted == true then
          data[storedLessonId] = true
        end
      end
    else
        return redis.error_reply('${CORRUPT_PROGRESS_ERROR}')
    end
  end

  local incomingOk, incoming = pcall(cjson.decode, ARGV[1])
  if not incomingOk or type(incoming) ~= 'table' then
    return redis.error_reply('INVALID_MIGRATION_DATA')
  end

  for lessonId, isCompleted in pairs(incoming) do
    if type(lessonId) ~= 'string'
      or string.len(lessonId) < 1
      or string.len(lessonId) > 220
      or string.find(lessonId, '[^A-Za-z0-9_.%-]')
      or isCompleted ~= true then
      return redis.error_reply('INVALID_MIGRATION_DATA')
    end

    if data[lessonId] == nil then
      completedCount = completedCount + 1
      if completedCount > tonumber(ARGV[2]) then
        return redis.error_reply('${PROGRESS_LIMIT_ERROR}')
      end
    end
    data[lessonId] = true
  end

  local encoded = cjson.encode(data)
  redis.call('SET', KEYS[1], encoded)
  return encoded
`;

function normalizeEmail(value) {
  if (typeof value !== 'string') return null;

  const email = value.trim().toLowerCase();
  if (email.length < 3 || email.length > MAX_EMAIL_LENGTH) return null;
  const hasControlCharacter = [...email].some(character => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
  if (/\s/.test(email) || hasControlCharacter) return null;

  const firstAt = email.indexOf('@');
  if (
    firstAt < 1
    || firstAt !== email.lastIndexOf('@')
    || firstAt > 64
    || firstAt === email.length - 1
  ) {
    return null;
  }

  return email;
}

function normalizeLessonId(value) {
  if (typeof value !== 'string') return null;

  const lessonId = value.trim();
  if (
    lessonId.length < 1
    || lessonId.length > MAX_LESSON_ID_LENGTH
    || !LESSON_ID_PATTERN.test(lessonId)
  ) {
    return null;
  }

  return lessonId;
}

function authorizeEmail(req, res, requestedEmail) {
  const cleanEmail = normalizeEmail(requestedEmail);
  if (!cleanEmail) {
    res.status(400).json({ error: 'Valid email is required' });
    return null;
  }
  try {
    const adminSession = readAdminSession(req);
    if (adminSession) return cleanEmail;
    const userSession = readUserSession(req);
    if (!userSession) {
      res.status(401).json({ error: 'User authentication required' });
      return null;
    }
    if (userSession.email !== cleanEmail) {
      res.status(403).json({ error: 'Progress belongs to another user' });
      return null;
    }
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vary', 'Cookie');
    return userSession.email;
  } catch (error) {
    console.error('Progress session error:', error.message);
    res.status(500).json({ error: 'User session is not configured' });
    return null;
  }
}

function parseStoredProgress(rawProgress) {
  if (typeof rawProgress !== 'string') {
    throw new Error(CORRUPT_PROGRESS_ERROR);
  }

  let progress;
  try {
    progress = JSON.parse(rawProgress);
  } catch {
    throw new Error(CORRUPT_PROGRESS_ERROR);
  }

  if (!progress || typeof progress !== 'object') {
    throw new Error(CORRUPT_PROGRESS_ERROR);
  }

  const entries = Array.isArray(progress)
    ? progress.map(lessonId => [lessonId, true])
    : Object.entries(progress);
  if (entries.length > MAX_COMPLETED_LESSONS) {
    throw new Error(CORRUPT_PROGRESS_ERROR);
  }

  const completedLessons = {};
  for (const [rawLessonId, completed] of entries) {
    const lessonId = normalizeLessonId(rawLessonId);
    if (!lessonId || lessonId !== rawLessonId || typeof completed !== 'boolean') {
      throw new Error(CORRUPT_PROGRESS_ERROR);
    }
    if (completed) completedLessons[lessonId] = true;
  }

  return completedLessons;
}

function sanitizeMigrationProgress(progress) {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return null;

  const entries = Object.entries(progress);
  if (entries.length > MAX_COMPLETED_LESSONS) return null;

  const completedLessons = {};
  for (const [rawLessonId, completed] of entries) {
    const lessonId = normalizeLessonId(rawLessonId);
    if (!lessonId || typeof completed !== 'boolean') return null;
    if (completed) completedLessons[lessonId] = true;
  }

  return completedLessons;
}

function isRedisError(error, marker) {
  return typeof error?.message === 'string' && error.message.includes(marker);
}

module.exports = async function handler(req, res) {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    return res.status(500).json({ error: 'Database environment variables not configured (Vercel KV not connected)' });
  }

  const headers = {
    'Authorization': `Bearer ${kvToken}`,
    'Content-Type': 'application/json'
  };

  async function runKvCommand(command) {
    const response = await fetch(kvUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(command)
    });

    const responseText = await response.text();
    let payload = null;
    try {
      payload = responseText ? JSON.parse(responseText) : null;
    } catch {
      // The generic error below intentionally avoids exposing Redis internals.
    }

    if (!response.ok || payload?.error) {
      const redisMessage = typeof payload?.error === 'string'
        ? payload.error.slice(0, 500)
        : `Redis HTTP ${response.status}`;
      throw new Error(`KV command failed: ${redisMessage}`);
    }

    if (!payload || !Object.prototype.hasOwnProperty.call(payload, 'result')) {
      throw new Error('KV command failed: invalid response');
    }

    return payload;
  }

  try {
    // GET keeps the existing AdminReport contract: the JSON response is the
    // completed-lessons map itself, not a wrapper object.
    if (req.method === 'GET') {
      const cleanEmail = authorizeEmail(req, res, req.query?.email);
      if (!cleanEmail) return;

      const data = await runKvCommand(['GET', `progress:${cleanEmail}`]);
      if (data.result === null) {
        return res.status(200).json({});
      }

      return res.status(200).json(parseStoredProgress(data.result));
    }

    if (req.method === 'POST') {
      const { email, completedLessons, lessonId: rawLessonId, completed } = req.body || {};
      const cleanEmail = authorizeEmail(req, res, email);
      if (!cleanEmail) return;

      const progressKey = `progress:${cleanEmail}`;

      if (rawLessonId !== undefined) {
        const lessonId = normalizeLessonId(rawLessonId);
        if (!lessonId || typeof completed !== 'boolean') {
          return res.status(400).json({ error: 'Valid lessonId and completed are required' });
        }

        const result = await runKvCommand([
          'EVAL',
          UPDATE_LESSON_SCRIPT,
          '1',
          progressKey,
          lessonId,
          completed ? '1' : '0',
          String(MAX_COMPLETED_LESSONS)
        ]);

        return res.status(200).json({
          success: true,
          message: 'Progress saved successfully',
          completedLessons: parseStoredProgress(result.result)
        });
      }

      const sanitizedProgress = sanitizeMigrationProgress(completedLessons);
      if (!sanitizedProgress) {
        return res.status(400).json({ error: 'Valid completedLessons are required' });
      }

      const result = await runKvCommand([
        'EVAL',
        MERGE_PROGRESS_SCRIPT,
        '1',
        progressKey,
        JSON.stringify(sanitizedProgress),
        String(MAX_COMPLETED_LESSONS)
      ]);

      return res.status(200).json({
        success: true,
        message: 'Progress saved successfully',
        completedLessons: parseStoredProgress(result.result)
      });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    if (isRedisError(error, CORRUPT_PROGRESS_ERROR)) {
      console.error('Stored progress is invalid; refusing to overwrite it.');
      return res.status(409).json({
        error: 'Stored progress data is invalid; no changes were saved.'
      });
    }

    if (isRedisError(error, PROGRESS_LIMIT_ERROR)) {
      return res.status(409).json({
        error: `Progress cannot contain more than ${MAX_COMPLETED_LESSONS} lessons.`
      });
    }

    console.error('API Progress Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
