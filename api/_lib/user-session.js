const crypto = require('crypto');

const USER_SESSION_COOKIE = 'course_user_session';
const USER_SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function getSecret() {
  const secret = process.env.USER_SESSION_SECRET
    || process.env.ADMIN_SESSION_SECRET
    || process.env.KV_REST_API_TOKEN;
  if (!secret) throw new Error('User session secret is not configured');
  return secret;
}

function encode(value) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decode(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(encodedPayload) {
  return crypto.createHmac('sha256', getSecret()).update(encodedPayload).digest('base64url');
}

function signaturesMatch(expected, received) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(String(received || ''));
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

function parseCookies(req) {
  const cookies = {};
  for (const part of String(req?.headers?.cookie || '').split(';')) {
    const separator = part.indexOf('=');
    if (separator < 1) continue;
    const name = part.slice(0, separator).trim();
    const rawValue = part.slice(separator + 1).trim();
    try { cookies[name] = decodeURIComponent(rawValue); } catch { cookies[name] = rawValue; }
  }
  return cookies;
}

function appendCookie(res, cookie) {
  const existing = typeof res.getHeader === 'function'
    ? res.getHeader('Set-Cookie')
    : res.headers?.['Set-Cookie'];
  const values = existing ? (Array.isArray(existing) ? existing : [existing]) : [];
  res.setHeader('Set-Cookie', [...values, cookie]);
}

function isHttps(req) {
  const protocol = String(req?.headers?.['x-forwarded-proto'] || '').split(',')[0].trim().toLowerCase();
  return protocol === 'https' || (process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'development');
}

function setNoStore(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Vary', 'Cookie');
}

function createUserSessionToken(email, now = Date.now()) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !cleanEmail.includes('@')) throw new Error('Valid user email is required');
  const issuedAt = Math.floor(now / 1000);
  const payload = { v: 1, email: cleanEmail, iat: issuedAt, exp: issuedAt + USER_SESSION_TTL_SECONDS };
  const encoded = encode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

function readUserSession(req, now = Date.now()) {
  const token = parseCookies(req)[USER_SESSION_COOKIE];
  if (!token) return null;
  const separator = token.lastIndexOf('.');
  if (separator <= 0 || separator === token.length - 1) return null;
  const encoded = token.slice(0, separator);
  if (!signaturesMatch(sign(encoded), token.slice(separator + 1))) return null;
  try {
    const payload = JSON.parse(decode(encoded));
    const email = normalizeEmail(payload.email);
    const nowSeconds = Math.floor(now / 1000);
    if (payload.v !== 1 || !email.includes('@') || !Number.isInteger(payload.iat) || !Number.isInteger(payload.exp)
      || payload.exp <= nowSeconds || payload.iat > nowSeconds + 60) return null;
    return { ...payload, email, role: 'user' };
  } catch {
    return null;
  }
}

function setUserSessionCookie(req, res, email) {
  const secure = isHttps(req) ? '; Secure' : '';
  setNoStore(res);
  appendCookie(res, `${USER_SESSION_COOKIE}=${encodeURIComponent(createUserSessionToken(email))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${USER_SESSION_TTL_SECONDS}${secure}`);
}

function clearUserSessionCookie(req, res) {
  const secure = isHttps(req) ? '; Secure' : '';
  setNoStore(res);
  appendCookie(res, `${USER_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secure}`);
}

function requireUserSession(req, res) {
  try {
    const session = readUserSession(req);
    if (session) { setNoStore(res); return session; }
  } catch (error) {
    console.error('User session configuration error:', error.message);
    res.status(500).json({ error: 'User session is not configured' });
    return null;
  }
  clearUserSessionCookie(req, res);
  res.status(401).json({ error: 'User authentication required' });
  return null;
}

module.exports = {
  USER_SESSION_COOKIE,
  USER_SESSION_TTL_SECONDS,
  clearUserSessionCookie,
  createUserSessionToken,
  readUserSession,
  requireUserSession,
  setUserSessionCookie
};
