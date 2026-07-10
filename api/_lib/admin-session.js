const crypto = require('crypto');

const ADMIN_SESSION_COOKIE = 'course_admin_session';
const ADMIN_SESSION_TTL_SECONDS = 8 * 60 * 60;
const DEFAULT_ADMIN_EMAIL = 'thipacheco1@gmail.com';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getAdminEmails() {
  const configured = [process.env.ADMIN_EMAILS, process.env.ADMIN_EMAIL]
    .filter(Boolean)
    .join(',');
  const source = configured || DEFAULT_ADMIN_EMAIL;

  return new Set(
    source
      .split(/[;,\s]+/)
      .map(normalizeEmail)
      .filter(Boolean)
  );
}

function isAdminEmail(email) {
  return getAdminEmails().has(normalizeEmail(email));
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.KV_REST_API_TOKEN;

  if (!secret) {
    throw new Error('Admin session secret is not configured');
  }

  return secret;
}

function encodeBase64Url(value) {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, 'base64').toString('utf8');
}

function signPayload(encodedPayload) {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signaturesMatch(expected, received) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(String(received || ''));

  return expectedBuffer.length === receivedBuffer.length
    && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

function createAdminSessionToken(email, now = Date.now()) {
  const normalizedEmail = normalizeEmail(email);

  if (!isAdminEmail(normalizedEmail)) {
    throw new Error('Email is not authorized as administrator');
  }

  const issuedAt = Math.floor(now / 1000);
  const payload = {
    v: 1,
    email: normalizedEmail,
    iat: issuedAt,
    exp: issuedAt + ADMIN_SESSION_TTL_SECONDS
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${signPayload(encodedPayload)}`;
}

function parseCookies(req) {
  const cookieHeader = req?.headers?.cookie || '';
  const cookies = {};

  for (const part of cookieHeader.split(';')) {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) continue;

    const name = part.slice(0, separatorIndex).trim();
    const rawValue = part.slice(separatorIndex + 1).trim();
    if (!name) continue;

    try {
      cookies[name] = decodeURIComponent(rawValue);
    } catch {
      cookies[name] = rawValue;
    }
  }

  return cookies;
}

function readAdminSession(req, now = Date.now()) {
  const token = parseCookies(req)[ADMIN_SESSION_COOKIE];
  if (!token) return null;

  const separatorIndex = token.lastIndexOf('.');
  if (separatorIndex <= 0 || separatorIndex === token.length - 1) return null;

  const encodedPayload = token.slice(0, separatorIndex);
  const receivedSignature = token.slice(separatorIndex + 1);
  const expectedSignature = signPayload(encodedPayload);

  if (!signaturesMatch(expectedSignature, receivedSignature)) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload));
    const normalizedEmail = normalizeEmail(payload.email);
    const currentTime = Math.floor(now / 1000);

    if (
      payload.v !== 1
      || !Number.isInteger(payload.iat)
      || !Number.isInteger(payload.exp)
      || payload.exp <= currentTime
      || payload.iat > currentTime + 60
      || !isAdminEmail(normalizedEmail)
    ) {
      return null;
    }

    return { ...payload, email: normalizedEmail, role: 'admin' };
  } catch {
    return null;
  }
}

function isHttpsRequest(req) {
  const forwardedProto = String(req?.headers?.['x-forwarded-proto'] || '')
    .split(',')[0]
    .trim()
    .toLowerCase();

  return forwardedProto === 'https'
    || (process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'development');
}

function setNoStoreHeaders(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Cookie');
}

function setAdminSessionCookie(req, res, email) {
  const token = createAdminSessionToken(email);
  const secureFlag = isHttpsRequest(req) ? '; Secure' : '';

  setNoStoreHeaders(res);
  res.setHeader(
    'Set-Cookie',
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ADMIN_SESSION_TTL_SECONDS}${secureFlag}`
  );
}

function clearAdminSessionCookie(req, res) {
  const secureFlag = isHttpsRequest(req) ? '; Secure' : '';

  setNoStoreHeaders(res);
  res.setHeader(
    'Set-Cookie',
    `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`
  );
}

function requireAdminSession(req, res) {
  try {
    const session = readAdminSession(req);
    if (session) {
      setNoStoreHeaders(res);
      return session;
    }
  } catch (error) {
    console.error('Admin session configuration error:', error.message);
    res.status(500).json({ error: 'Admin session is not configured' });
    return null;
  }

  clearAdminSessionCookie(req, res);
  res.status(401).json({ error: 'Admin authentication required' });
  return null;
}

module.exports = {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  clearAdminSessionCookie,
  createAdminSessionToken,
  isAdminEmail,
  readAdminSession,
  requireAdminSession,
  setAdminSessionCookie
};
