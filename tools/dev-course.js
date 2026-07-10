const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const appDir = path.join(rootDir, 'plataforma-curso');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const viteArgs = ['run', 'dev:web', '--', ...process.argv.slice(2)];
const npmExecPath = process.env.npm_execpath;
const webCommand = npmExecPath ? process.execPath : npmCommand;
const webArgs = npmExecPath ? [npmExecPath, ...viteArgs] : viteArgs;

const api = spawn(process.execPath, [path.join(rootDir, 'tools', 'local-api-server.js')], {
  cwd: rootDir,
  env: process.env,
  stdio: 'inherit'
});

const web = spawn(webCommand, webArgs, {
  cwd: appDir,
  env: process.env,
  stdio: 'inherit',
  shell: process.platform === 'win32' && !npmExecPath
});

let shuttingDown = false;

function stopChild(child) {
  if (child && !child.killed) {
    child.kill();
  }
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  stopChild(web);
  stopChild(api);
  setTimeout(() => process.exit(exitCode), 100);
}

api.on('error', error => {
  console.error('Não foi possível iniciar a API local:', error.message);
  shutdown(1);
});

web.on('error', error => {
  console.error('Não foi possível iniciar o Vite:', error.message);
  shutdown(1);
});

api.on('exit', code => {
  if (!shuttingDown && code !== 0) {
    console.error(`A API local foi encerrada com código ${code}.`);
    shutdown(code || 1);
  }
});

web.on('exit', code => shutdown(code || 0));

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('exit', () => {
  stopChild(web);
  stopChild(api);
});
