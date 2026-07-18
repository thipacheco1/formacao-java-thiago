import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(rootDir, 'plataforma-curso', 'public');
const read = relativePath => readFileSync(join(rootDir, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Public discovery validation failed: ${message}`);
};

const index = JSON.parse(read('plataforma-curso/public/course-index.json'));
assert(index.course.lessonCount === 721, 'course-index.json must declare 721 lessons');
assert(index.course.moduleCount === 21, 'course-index.json must distinguish the 21 modules from the opening unit');
assert(index.lessons.length === 721, 'course-index.json must contain exactly 721 catalog entries');
assert(new Set(index.lessons.map(lesson => lesson.id)).size === 721, 'lesson ids must be unique');
assert(index.lessons.every(lesson => lesson.access === 'free-account-required'), 'every full lesson must require a free account');
assert(index.lessons.every(lesson => lesson.summary.length <= 260), 'catalog summaries must remain short');
assert(index.lessons.every(lesson => lesson.topics.length <= 8), 'catalog topics must remain concise');

const forbiddenKeys = new Set(['body', 'content', 'code', 'solution', 'steps', 'exercise']);
const inspectKeys = value => {
  if (Array.isArray(value)) return value.forEach(inspectKeys);
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    assert(!forbiddenKeys.has(key.toLowerCase()), `course-index.json exposes forbidden field "${key}"`);
    inspectKeys(child);
  }
};
inspectKeys(index);

const lessonsDir = join(publicDir, 'aulas');
const lessonDirectories = readdirSync(lessonsDir, { withFileTypes: true }).filter(entry => entry.isDirectory());
assert(lessonDirectories.length === 721, '721 static lesson catalog pages must be generated');

const titles = new Set();
for (const directory of lessonDirectories) {
  const pagePath = join(lessonsDir, directory.name, 'index.html');
  const page = readFileSync(pagePath, 'utf8');
  const title = page.match(/<h1>(.*?)<\/h1>/s)?.[1];
  assert(title && title.length > 3, `${directory.name} needs an editorial title`);
  titles.add(title);
  assert(page.includes('A aula completa continua protegida'), `${directory.name} needs the protected-access notice`);
  assert(!page.includes('Prévia do conteúdo escrito'), `${directory.name} must not expose the old written preview`);
  assert(!page.includes('áudio-aula em MP3') && !page.includes('reprodutor de vídeo'), `${directory.name} contains an unsupported media claim`);
  assert(statSync(pagePath).size < 32_000, `${directory.name} is too large for a metadata-only page`);
}
assert(titles.size >= 700, 'lesson titles are unexpectedly repetitive');

const lesson014 = read('plataforma-curso/public/aulas/014-m0-14-codex-ia-no-intellij-com-etica-e-metodo/index.html');
assert(!lesson014.includes('<h1>AGENTS.md</h1>'), 'guided lesson title must override an internal Markdown heading');

const sitemap = read('plataforma-curso/public/sitemap.xml');
assert((sitemap.match(/<url>/g) || []).length === 750, 'sitemap must contain root, hub, 5 trails, 22 learning units and 721 lessons');
assert((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length === 750, 'every sitemap entry needs lastmod');
assert((sitemap.match(/\/aulas\//g) || []).length === 721, 'sitemap must contain all lesson catalog URLs');

const robots = read('plataforma-curso/public/robots.txt');
for (const agent of ['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User']) {
  assert(robots.includes(`User-agent: ${agent}`), `${agent} discovery rule is missing`);
}
for (const agent of ['GPTBot', 'ClaudeBot']) {
  assert(new RegExp(`User-agent: ${agent}\\s+Disallow: /`).test(robots), `${agent} training block is missing`);
}
assert(robots.includes('Sitemap: https://formacao-java.vercel.app/sitemap.xml'), 'robots.txt needs the canonical sitemap');

const llms = read('plataforma-curso/public/llms.txt');
assert(llms.includes('/course-index.json') && llms.includes('conteúdo integral'), 'llms.txt must describe discovery and protected access');
assert(existsSync(join(publicDir, '404.html')) && read('plataforma-curso/public/404.html').includes('noindex, follow'), 'a noindex 404 page is required');
assert(read('plataforma-curso/index.html').includes('<noscript>') && read('plataforma-curso/index.html').includes('href="/trilhas"'), 'the home page needs a no-JavaScript curriculum path');

const vercel = JSON.parse(read('vercel.json'));
assert(!vercel.rewrites.some(rewrite => rewrite.source === '/(.*)'), 'the SPA catch-all would create soft 404 responses');

console.log(`Public discovery validated: ${lessonDirectories.length} lessons, ${titles.size} unique titles, 750 sitemap URLs, protected lesson bodies.`);
