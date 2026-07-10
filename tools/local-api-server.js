const http = require('http');
const path = require('path');
const fs = require('fs');
const { URL } = require('url');

const rootDir = path.resolve(__dirname, '..');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(rootDir, '.env.local'));
loadEnvFile(path.join(rootDir, 'plataforma-curso', '.env.local'));

const routes = {
  '/api/users': require(path.join(rootDir, 'api', 'users.js')),
  '/api/progress': require(path.join(rootDir, 'api', 'progress.js')),
  '/api/analytics': require(path.join(rootDir, 'api', 'analytics.js')),
  '/api/send-email': require(path.join(rootDir, 'api', 'send-email.js'))
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) {
        resolve(undefined);
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function createResponse(res) {
  return {
    statusCode: 200,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    get headersSent() {
      return res.headersSent;
    },
    get writableEnded() {
      return res.writableEnded;
    },
    json(payload) {
      const body = JSON.stringify(payload);
      res.writeHead(this.statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        ...this.headers
      });
      res.end(body);
      return this;
    },
    send(payload) {
      const body = typeof payload === 'string' ? payload : String(payload);
      res.writeHead(this.statusCode, this.headers);
      res.end(body);
      return this;
    },
    end(payload) {
      if (!res.headersSent) res.writeHead(this.statusCode, this.headers);
      res.end(payload);
      return this;
    }
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const handler = routes[url.pathname];

  if (!handler) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    req.query = Object.fromEntries(url.searchParams.entries());
    req.body = await readBody(req);
    await handler(req, createResponse(res));
  } catch (error) {
    console.error('Local API Error:', error);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: error.message }));
    }
  }
});

const port = Number(process.env.LOCAL_API_PORT || 5174);
server.listen(port, '127.0.0.1', () => {
  console.log(`Local API server listening on http://127.0.0.1:${port}`);
});
