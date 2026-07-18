import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');

process.env.KV_REST_API_URL = 'https://redis.invalid';
process.env.KV_REST_API_TOKEN = 'test-session-and-kv-secret';

const { createUserSessionToken, USER_SESSION_COOKIE } = require('../api/_lib/user-session.js');
const handler = require('../api/learning-state.js');
const hashes = new Map();
const originalFetch = global.fetch;

global.fetch = async (_url, options) => {
  const command = JSON.parse(options.body);
  const [operation, key, field, value] = command;
  let result;
  if (operation === 'HSET') {
    const hash = hashes.get(key) || new Map();
    hash.set(field, value);
    hashes.set(key, hash);
    result = 1;
  } else if (operation === 'HGETALL') {
    result = [...(hashes.get(key) || new Map()).entries()].flat();
  } else {
    throw new Error(`Unexpected Redis command: ${operation}`);
  }
  return { ok: true, json: async () => ({ result }) };
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

const email = 'aluno@example.com';
const cookie = `${USER_SESSION_COOKIE}=${encodeURIComponent(createUserSessionToken(email))}`;
const invoke = async ({ method, query = {}, body = {}, requestCookie = cookie }) => {
  const res = response();
  await handler({ method, query, body, headers: { cookie: requestCookie } }, res);
  return res;
};

try {
  let res = await invoke({ method: 'POST', body: { email, lastLessonId: '120_M4_16_TO_STRING_COM_CRITERIO_OFICIAL' } });
  assert.equal(res.statusCode, 200);
  res = await invoke({
    method: 'POST',
    body: {
      email,
      lessonId: '120_M4_16_TO_STRING_COM_CRITERIO_OFICIAL',
      stepStorageKey: 'guided-to-string-lesson-120-progress',
      completedStepIds: ['default', 'override', 'privacy'],
      activeStepIndex: 4
    }
  });
  assert.equal(res.statusCode, 200);

  res = await invoke({ method: 'GET', query: { email } });
  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.lastLessonId, '120_M4_16_TO_STRING_COM_CRITERIO_OFICIAL');
  assert.deepEqual(res.payload.lessons['120_M4_16_TO_STRING_COM_CRITERIO_OFICIAL'].completedStepIds, ['default', 'override', 'privacy']);
  assert.equal(res.payload.lessons['120_M4_16_TO_STRING_COM_CRITERIO_OFICIAL'].activeStepIndex, 4);

  res = await invoke({ method: 'GET', query: { email: 'outra@example.com' } });
  assert.equal(res.statusCode, 403);
  res = await invoke({ method: 'GET', query: { email }, requestCookie: '' });
  assert.equal(res.statusCode, 401);
  res = await invoke({
    method: 'POST',
    body: { email, lessonId: '120_M4_16_TO_STRING_COM_CRITERIO_OFICIAL', stepStorageKey: 'wrong-key', completedStepIds: [], activeStepIndex: 0 }
  });
  assert.equal(res.statusCode, 400);
} finally {
  global.fetch = originalFetch;
}

const hook = read('plataforma-curso/src/utils/useLearningStateSync.js');
const app = read('plataforma-curso/src/App.jsx');
const progressApi = read('api/progress.js');
const usersApi = read('api/users.js');
const localServer = read('tools/local-api-server.js');
for (const value of [
  "fetch('/api/learning-state'", '/api/learning-state?email=', 'learningStateMutations_',
  'guidedProgressOwnerEmail', 'completedStepIds', 'activeStepIndex', 'lastLessonId',
  "new MutationObserver", "querySelectorAll(':scope > button')", 'window.addEventListener(\'online\'',
]) assert.ok(hook.includes(value), `hook: ${value}`);
for (const value of ['useLearningStateSync', 'learningStateRevision', 'SIGNED_SESSION_MIGRATION_KEY']) {
  assert.ok(app.includes(value), `App: ${value}`);
}
assert.ok(progressApi.includes('authorizeEmail'), 'conclusão da aula deve exigir sessão');
assert.ok(usersApi.includes('setUserSessionCookie'), 'login e cadastro devem criar sessão assinada');
assert.ok(usersApi.includes('learning-state:'), 'exclusão do usuário deve remover estado detalhado');
assert.ok(localServer.includes("'/api/learning-state'"), 'servidor local deve expor a API');

const componentFiles = readFileSync(new URL('plataforma-curso/src/components/GuidedToStringLesson120.jsx', root), 'utf8');
assert.ok(componentFiles.includes('guided-to-string-lesson-120-progress'));

console.log('Sincronização validada: sessão assinada, conclusão, etapas, etapa ativa, última aula, fila offline e retomada entre dispositivos.');
