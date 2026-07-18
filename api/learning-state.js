const MAX_EMAIL_LENGTH = 254;
const { readAdminSession } = require('./_lib/admin-session');
const { readUserSession } = require('./_lib/user-session');
const MAX_LESSON_ID_LENGTH = 220;
const MAX_STEP_STORAGE_KEY_LENGTH = 180;
const MAX_COMPLETED_STEPS = 64;
const MAX_ACTIVE_STEP_INDEX = 63;

const LESSON_ID_PATTERN = /^[A-Za-z0-9_.-]+$/;
const STEP_ID_PATTERN = /^[A-Za-z0-9_.-]{1,100}$/;
const STEP_STORAGE_KEY_PATTERN = /^guided-[a-z0-9-]+-lesson-\d{3}-progress$/;

function normalizeEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  const hasControlCharacter = [...email].some(character => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127;
  });
  if (email.length < 3 || email.length > MAX_EMAIL_LENGTH || /\s/.test(email) || hasControlCharacter) return null;
  const at = email.indexOf('@');
  if (at < 1 || at !== email.lastIndexOf('@') || at > 64 || at === email.length - 1) return null;
  return email;
}

function normalizeLessonId(value) {
  if (typeof value !== 'string') return null;
  const lessonId = value.trim();
  if (lessonId.length < 1 || lessonId.length > MAX_LESSON_ID_LENGTH || !LESSON_ID_PATTERN.test(lessonId)) return null;
  return lessonId;
}

function authorizeEmail(req, res, requestedEmail) {
  const email = normalizeEmail(requestedEmail);
  if (!email) {
    res.status(400).json({ error: 'Valid email is required' });
    return null;
  }
  try {
    const adminSession = readAdminSession(req);
    if (adminSession) return email;
    const userSession = readUserSession(req);
    if (!userSession) {
      res.status(401).json({ error: 'User authentication required' });
      return null;
    }
    if (userSession.email !== email) {
      res.status(403).json({ error: 'Learning state belongs to another user' });
      return null;
    }
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vary', 'Cookie');
    return userSession.email;
  } catch (error) {
    console.error('Learning state session error:', error.message);
    res.status(500).json({ error: 'User session is not configured' });
    return null;
  }
}

function normalizeStepStorageKey(value, lessonId) {
  if (typeof value !== 'string') return null;
  const key = value.trim();
  const lessonNumber = lessonId?.match(/^(\d{3})_/)?.[1];
  if (!lessonNumber || key.length > MAX_STEP_STORAGE_KEY_LENGTH || !STEP_STORAGE_KEY_PATTERN.test(key)) return null;
  return key.includes(`-lesson-${lessonNumber}-`) ? key : null;
}

function normalizeCompletedStepIds(value) {
  if (!Array.isArray(value) || value.length > MAX_COMPLETED_STEPS) return null;
  const unique = [];
  const seen = new Set();
  for (const item of value) {
    if (typeof item !== 'string' || !STEP_ID_PATTERN.test(item) || seen.has(item)) continue;
    seen.add(item);
    unique.push(item);
  }
  return unique;
}

function normalizeActiveStepIndex(value) {
  return Number.isInteger(value) && value >= 0 && value <= MAX_ACTIVE_STEP_INDEX ? value : null;
}

function parseHashResult(result) {
  if (!Array.isArray(result)) throw new Error('INVALID_LEARNING_STATE');
  const state = { version: 1, lastLessonId: null, lessons: {} };
  for (let index = 0; index < result.length; index += 2) {
    const field = result[index];
    const rawValue = result[index + 1];
    if (field === '__lastLessonId') {
      state.lastLessonId = normalizeLessonId(rawValue);
      continue;
    }
    if (typeof field !== 'string' || !field.startsWith('lesson:')) continue;
    const lessonId = normalizeLessonId(field.slice(7));
    if (!lessonId || typeof rawValue !== 'string') continue;
    try {
      const parsed = JSON.parse(rawValue);
      const stepStorageKey = normalizeStepStorageKey(parsed?.stepStorageKey, lessonId);
      const completedStepIds = normalizeCompletedStepIds(parsed?.completedStepIds);
      const activeStepIndex = normalizeActiveStepIndex(parsed?.activeStepIndex);
      if (!stepStorageKey || !completedStepIds || activeStepIndex === null) continue;
      state.lessons[lessonId] = {
        stepStorageKey,
        completedStepIds,
        activeStepIndex,
        updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null
      };
    } catch {
      // One malformed lesson must not prevent recovery of the remaining state.
    }
  }
  return state;
}

module.exports = async function handler(req, res) {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) {
    return res.status(500).json({ error: 'Database environment variables not configured (Vercel KV not connected)' });
  }

  async function runKvCommand(command) {
    const response = await fetch(kvUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command)
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.error || !payload || !Object.prototype.hasOwnProperty.call(payload, 'result')) {
      throw new Error('KV command failed');
    }
    return payload.result;
  }

  try {
    if (req.method === 'GET') {
      const email = authorizeEmail(req, res, req.query?.email);
      if (!email) return;
      const result = await runKvCommand(['HGETALL', `learning-state:${email}`]);
      return res.status(200).json(parseHashResult(result || []));
    }

    if (req.method === 'POST') {
      const email = authorizeEmail(req, res, req.body?.email);
      if (!email) return;
      const key = `learning-state:${email}`;

      if (req.body?.lastLessonId !== undefined) {
        const lastLessonId = normalizeLessonId(req.body.lastLessonId);
        if (!lastLessonId) return res.status(400).json({ error: 'Valid lastLessonId is required' });
        await runKvCommand(['HSET', key, '__lastLessonId', lastLessonId]);
        return res.status(200).json({ success: true });
      }

      const lessonId = normalizeLessonId(req.body?.lessonId);
      const stepStorageKey = normalizeStepStorageKey(req.body?.stepStorageKey, lessonId);
      const completedStepIds = normalizeCompletedStepIds(req.body?.completedStepIds);
      const activeStepIndex = normalizeActiveStepIndex(req.body?.activeStepIndex);
      if (!lessonId || !stepStorageKey || !completedStepIds || activeStepIndex === null) {
        return res.status(400).json({ error: 'Valid lesson progress is required' });
      }

      const snapshot = JSON.stringify({
        stepStorageKey,
        completedStepIds,
        activeStepIndex,
        updatedAt: new Date().toISOString()
      });
      await runKvCommand(['HSET', key, `lesson:${lessonId}`, snapshot]);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Learning State Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
