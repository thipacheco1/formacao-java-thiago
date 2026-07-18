import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
process.env.KV_REST_API_URL = 'https://redis.invalid';
process.env.KV_REST_API_TOKEN = 'progress-compatibility-test-secret';

const {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken
} = require('../api/_lib/admin-session.js');
const {
  USER_SESSION_COOKIE,
  createUserSessionToken
} = require('../api/_lib/user-session.js');
const handler = require('../api/progress.js');
const originalFetch = global.fetch;
let storedProgress = JSON.stringify(['001_TEST', '002_TEST']);

global.fetch = async (_url, options) => {
  const [operation] = JSON.parse(options.body);
  if (operation !== 'GET') throw new Error(`Unexpected Redis operation: ${operation}`);
  return {
    ok: true,
    text: async () => JSON.stringify({ result: storedProgress })
  };
};

function response() {
  return {
    statusCode: 200,
    headers: {},
    payload: null,
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; return this; },
    getHeader(name) { return this.headers[name]; },
    json(payload) { this.payload = payload; return this; }
  };
}

const adminEmail = 'thipacheco1@gmail.com';
const adminCookie = `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(createAdminSessionToken(adminEmail))}`;
const userEmail = 'aluno@example.com';
const userCookie = `${USER_SESSION_COOKIE}=${encodeURIComponent(createUserSessionToken(userEmail))}`;

async function invoke(email, cookie) {
  const res = response();
  await handler({ method: 'GET', query: { email }, headers: { cookie } }, res);
  return res;
}

try {
  let res = await invoke(userEmail, userCookie);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload, { '001_TEST': true, '002_TEST': true });

  res = await invoke(userEmail, adminCookie);
  assert.equal(res.statusCode, 200, 'administrador deve consultar o progresso de qualquer aluno');

  res = await invoke('outro@example.com', userCookie);
  assert.equal(res.statusCode, 403, 'aluno não deve consultar outra conta');

  storedProgress = '[]';
  res = await invoke(adminEmail, adminCookie);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload, {});

  storedProgress = '"invalid"';
  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    res = await invoke(adminEmail, adminCookie);
  } finally {
    console.error = originalConsoleError;
  }
  assert.equal(res.statusCode, 409, 'formato realmente inválido continua protegido');
} finally {
  global.fetch = originalFetch;
}

const progressApi = readFileSync(new URL('../api/progress.js', import.meta.url), 'utf8');
const app = readFileSync(new URL('../plataforma-curso/src/App.jsx', import.meta.url), 'utf8');
for (const marker of ["firstCharacter == '['", 'ipairs(decoded)', 'Array.isArray(progress)']) {
  assert.ok(progressApi.includes(marker), `compatibilidade ausente: ${marker}`);
}
assert.ok(app.includes('progressCentralMigrationV3_'), 'migração aditiva V3 deve ser executada uma vez');

console.log('Compatibilidade validada: array legado, mapa atual, painel administrativo, isolamento por conta e migração V3.');
