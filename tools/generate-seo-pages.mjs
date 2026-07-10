import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COURSE_MODULES, COURSE_PHASES } from '../plataforma-curso/src/data/coursePlan.js';
import { MODULE_SEO, PHASE_SEO } from '../plataforma-curso/src/data/seoCatalog.js';

const SITE_URL = 'https://formacao-java-thiago.vercel.app';
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lessonsDir = join(rootDir, 'docs', 'aulas');
const publicDir = join(rootDir, 'plataforma-curso', 'public');
const trailsDir = join(publicDir, 'trilhas');
const modulesDir = join(publicDir, 'modulos');

const assertGeneratedPath = (target) => {
  const resolved = resolve(target);
  const publicRoot = `${resolve(publicDir)}${sep}`;
  if (!resolved.startsWith(publicRoot)) {
    throw new Error(`Refusing to write outside the public directory: ${resolved}`);
  }
  return resolved;
};

const resetGeneratedDirectory = (target) => {
  const safeTarget = assertGeneratedPath(target);
  if (existsSync(safeTarget)) rmSync(safeTarget, { recursive: true, force: true });
  mkdirSync(safeTarget, { recursive: true });
};

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const formatLessonTitle = (fileName) => {
  const filePath = join(lessonsDir, fileName);
  const content = readFileSync(filePath, 'utf8');
  const markdownTitle = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (markdownTitle) return markdownTitle;

  return fileName
    .replace(/\.md$/i, '')
    .replace(/^\d{3}_M\d+_\d+_/, '')
    .replace(/_OFICIAL$/i, '')
    .replace(/_/g, ' ');
};

const lessonFiles = readdirSync(lessonsDir)
  .filter(file => /^\d{3}_M\d+_\d+_.+\.md$/i.test(file))
  .sort((a, b) => a.localeCompare(b, 'pt-BR'));

const lessonsByModule = lessonFiles.reduce((map, fileName) => {
  const moduleId = fileName.match(/^\d{3}_(M\d+)_/i)?.[1]?.toUpperCase();
  if (!moduleId) return map;
  if (!map.has(moduleId)) map.set(moduleId, []);
  map.get(moduleId).push({ fileName, title: formatLessonTitle(fileName) });
  return map;
}, new Map());

const publishedModules = COURSE_MODULES
  .filter(module => module.id !== 'P0' && MODULE_SEO[module.id])
  .map(module => ({
    ...module,
    ...MODULE_SEO[module.id],
    publishedLessons: lessonsByModule.get(module.id) || []
  }))
  .filter(module => module.publishedLessons.length > 0);

const publishedPhases = COURSE_PHASES
  .map(phase => ({
    ...phase,
    ...PHASE_SEO[phase.id],
    publishedModules: publishedModules.filter(module => phase.modules.includes(module.id))
  }))
  .filter(phase => phase.publishedModules.length > 0);

const css = `
  :root{color-scheme:light;--ink:#172238;--copy:#4f5d72;--muted:#78859a;--line:#dde3ed;--blue:#315bb9;--soft:#edf2ff;--dark:#111b2e}
  *{box-sizing:border-box}html{background:#eef2f7}body{margin:0;color:var(--copy);background:radial-gradient(circle at 90% 0,rgba(71,108,201,.12),transparent 28rem),#eef2f7;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.65}
  a{color:var(--blue)}.top{background:var(--dark);border-bottom:1px solid rgba(255,255,255,.09)}.top-inner{width:min(1100px,calc(100% - 32px));margin:auto;padding:15px 0;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{display:flex;align-items:center;gap:10px;color:#f3f6fc;text-decoration:none;font-weight:800}.brand img{width:38px;height:38px}.top small{color:#91a2bf}
  .page{width:min(1100px,calc(100% - 32px));margin:28px auto 64px}.crumbs{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px;color:var(--muted);font-size:.78rem}.crumbs a{text-decoration:none}.hero{padding:clamp(26px,5vw,56px);background:#fff;border:1px solid var(--line);border-radius:24px;box-shadow:0 22px 56px rgba(39,52,80,.08)}.eyebrow{display:inline-flex;padding:5px 9px;color:#31549e;background:var(--soft);border-radius:999px;font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.hero h1{max-width:850px;margin:17px 0 14px;color:var(--ink);font-size:clamp(2rem,6vw,4rem);line-height:1.05;letter-spacing:-.05em}.lead{max-width:790px;margin:0;color:var(--copy);font-size:clamp(1rem,2vw,1.2rem)}.facts{display:flex;flex-wrap:wrap;gap:9px;margin:24px 0 0;padding:0;list-style:none}.facts li{padding:8px 11px;color:#536176;background:#f5f7fb;border:1px solid #e1e6ee;border-radius:10px;font-size:.78rem}.cta-row,.share{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}.cta,.share a{display:inline-flex;min-height:42px;padding:9px 14px;align-items:center;justify-content:center;border-radius:10px;font-size:.78rem;font-weight:750;text-decoration:none}.cta{color:#fff;background:#365fbe;border:1px solid #416ac5}.cta.secondary{color:#43516a;background:#f4f6fa;border:1px solid #dde3ec}.share a{min-height:36px;padding:7px 11px;color:#5a6880;background:#f7f9fc;border:1px solid #e1e6ee}
  .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:18px}.panel{padding:24px;background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 12px 34px rgba(39,52,80,.055)}.panel.wide{grid-column:1/-1}.panel h2{margin:0 0 12px;color:var(--ink);font-size:1.25rem;letter-spacing:-.025em}.panel p{margin:0}.topic-list,.lesson-list,.card-list{margin:0;padding-left:21px}.topic-list li,.lesson-list li{padding:5px 0}.lesson-list{columns:2;column-gap:34px}.lesson-list li{break-inside:avoid;font-size:.82rem}.card-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));padding:0;gap:10px;list-style:none}.card{display:block;height:100%;padding:17px;color:inherit;background:#f8f9fc;border:1px solid #e2e7ef;border-radius:13px;text-decoration:none}.card:hover{border-color:#bfcbe3;background:#f3f6fd}.card strong{display:block;color:var(--ink);font-size:.9rem}.card span{display:block;margin-top:5px;color:var(--muted);font-size:.72rem}.card.disabled{opacity:.66}.nav-next{display:flex;justify-content:space-between;gap:12px;margin-top:18px}.nav-next a{max-width:48%;padding:11px 13px;background:#fff;border:1px solid var(--line);border-radius:11px;text-decoration:none;font-size:.75rem}.footer{margin-top:28px;color:#8793a5;font-size:.72rem;text-align:center}
  @media(max-width:720px){.grid,.card-list{grid-template-columns:1fr}.lesson-list{columns:1}.panel.wide{grid-column:auto}.top small{display:none}.hero{border-radius:18px}.nav-next{flex-direction:column}.nav-next a{max-width:100%}}
`;

const analyticsScript = (pageId) => `<script src="/seo-analytics.js" data-page="${escapeHtml(pageId)}" defer></script>`;

const shareLinks = (canonical, content) => {
  const makeUrl = source => {
    const url = new URL(canonical);
    url.searchParams.set('utm_source', source);
    url.searchParams.set('utm_medium', 'organic_social');
    url.searchParams.set('utm_campaign', 'formacao_java_backend');
    url.searchParams.set('utm_content', content);
    return url.toString();
  };
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`Veja este conteúdo gratuito de Java Backend: ${canonical}\n${makeUrl('whatsapp')}`)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(makeUrl('linkedin'))}`;
  return `<div class="share" aria-label="Compartilhar"><a href="${escapeHtml(whatsapp)}" rel="noreferrer">WhatsApp</a><a href="${escapeHtml(linkedin)}" rel="noreferrer">LinkedIn</a><a href="${escapeHtml(makeUrl('copy_link'))}">Link rastreável</a></div>`;
};

const renderDocument = ({ title, description, canonical, pageId, breadcrumbs, body, structuredData }) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${canonical}"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Formação Java Backend"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${SITE_URL}/social-card.png"><meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#111827">
<script type="application/ld+json">${safeJson(structuredData)}</script><style>${css}</style></head><body>
<header class="top"><div class="top-inner"><a class="brand" href="/"><img src="/favicon.svg" alt=""><span>Java Backend</span></a><small>Formação gratuita e progressiva</small></div></header>
<main class="page"><nav class="crumbs" aria-label="Breadcrumb">${breadcrumbs}</nav>${body}<p class="footer">Formação Java Backend · conteúdo gratuito · estudo no seu ritmo</p></main>${analyticsScript(pageId)}</body></html>`;

const breadcrumbJson = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
});

const writePage = (directory, html) => {
  const target = assertGeneratedPath(directory);
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'index.html'), html, 'utf8');
};

resetGeneratedDirectory(trailsDir);
resetGeneratedDirectory(modulesDir);

const sitemapUrls = [`${SITE_URL}/`];

const hubCanonical = `${SITE_URL}/trilhas`;
const hubCards = COURSE_PHASES.map(phase => {
  const seo = PHASE_SEO[phase.id];
  const published = publishedPhases.find(item => item.id === phase.id);
  const publishedCount = published?.publishedModules.reduce((sum, module) => sum + module.publishedLessons.length, 0) || 0;
  const content = `<strong>${escapeHtml(seo.name)}</strong><span>${publishedCount} aulas publicadas · ${escapeHtml(seo.description)}</span>`;
  return published
    ? `<li><a class="card" href="/trilhas/${seo.slug}">${content}</a></li>`
    : `<li><span class="card disabled">${content}<span>Em preparação</span></span></li>`;
}).join('');

writePage(trailsDir, renderDocument({
  title: 'Trilhas do Curso Gratuito de Java Backend',
  description: 'Explore o programa público da formação gratuita em Java Backend: fundamentos, Java moderno, Spring Boot, dados, produção e arquitetura.',
  canonical: hubCanonical,
  pageId: 'public:trilhas',
  breadcrumbs: `<a href="/">Início</a><span>/</span><span>Trilhas</span>`,
  body: `<section class="hero"><span class="eyebrow">Currículo público</span><h1>Trilhas da Formação Java Backend</h1><p class="lead">Uma jornada gratuita e progressiva, organizada do primeiro contato com Java às decisões de arquitetura de sistemas.</p><ul class="facts"><li>${publishedModules.reduce((sum, module) => sum + module.publishedLessons.length, 0)} aulas publicadas</li><li>${publishedModules.length} módulos disponíveis</li><li>Estudo online e gratuito</li></ul><div class="cta-row"><a class="cta" href="/?utm_source=seo_page&amp;utm_medium=organic_search&amp;utm_campaign=formacao_java_backend&amp;utm_content=trilhas">Acessar plataforma</a></div>${shareLinks(hubCanonical, 'trilhas')}</section><section class="panel" style="margin-top:18px"><h2>Escolha uma trilha</h2><ul class="card-list">${hubCards}</ul></section>`,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      breadcrumbJson([{ name: 'Início', url: `${SITE_URL}/` }, { name: 'Trilhas', url: hubCanonical }]),
      { '@type': 'Course', name: 'Formação Java Backend', description: 'Formação gratuita e progressiva do Java básico à arquitetura.', url: hubCanonical, inLanguage: 'pt-BR', isAccessibleForFree: true, provider: { '@type': 'Organization', name: 'Formação Java Backend', url: `${SITE_URL}/` } }
    ]
  }
}));
sitemapUrls.push(hubCanonical);

for (const phase of publishedPhases) {
  const canonical = `${SITE_URL}/trilhas/${phase.slug}`;
  const lessonCount = phase.publishedModules.reduce((sum, module) => sum + module.publishedLessons.length, 0);
  const cards = phase.publishedModules.map(module => `<li><a class="card" href="/modulos/${module.slug}"><strong>${escapeHtml(module.name)}</strong><span>${module.publishedLessons.length} de ${module.lessons} aulas publicadas · ${escapeHtml(module.focus)}</span></a></li>`).join('');
  const topics = [...new Set(phase.publishedModules.flatMap(module => module.highlights))].map(topic => `<li>${escapeHtml(topic)}</li>`).join('');
  const items = [{ name: 'Início', url: `${SITE_URL}/` }, { name: 'Trilhas', url: hubCanonical }, { name: phase.name, url: canonical }];

  writePage(join(trailsDir, phase.slug), renderDocument({
    title: `${phase.name} | Curso Gratuito de Java`,
    description: phase.description,
    canonical,
    pageId: `public:trilha:${phase.slug}`,
    breadcrumbs: `<a href="/">Início</a><span>/</span><a href="/trilhas">Trilhas</a><span>/</span><span>${escapeHtml(phase.name)}</span>`,
    body: `<section class="hero"><span class="eyebrow">Trilha gratuita</span><h1>${escapeHtml(phase.name)}</h1><p class="lead">${escapeHtml(phase.description)}</p><ul class="facts"><li>${lessonCount} aulas publicadas</li><li>${phase.publishedModules.length} módulos disponíveis</li><li>Do seu ritmo, sem custo</li></ul><div class="cta-row"><a class="cta" href="/?utm_source=seo_page&amp;utm_medium=organic_search&amp;utm_campaign=formacao_java_backend&amp;utm_content=trilha_${phase.slug}">Começar a estudar</a><a class="cta secondary" href="/trilhas">Ver todas as trilhas</a></div>${shareLinks(canonical, `trilha_${phase.slug}`)}</section><div class="grid"><section class="panel"><h2>O que você vai aprender</h2><ul class="topic-list">${topics}</ul></section><section class="panel"><h2>Módulos publicados</h2><ul class="card-list">${cards}</ul></section></div>`,
    structuredData: { '@context': 'https://schema.org', '@graph': [breadcrumbJson(items), { '@type': 'Course', name: phase.name, description: phase.description, url: canonical, inLanguage: 'pt-BR', isAccessibleForFree: true, provider: { '@type': 'Organization', name: 'Formação Java Backend', url: `${SITE_URL}/` } }] }
  }));
  sitemapUrls.push(canonical);
}

for (const [index, module] of publishedModules.entries()) {
  const phase = publishedPhases.find(item => item.modules.includes(module.id));
  const canonical = `${SITE_URL}/modulos/${module.slug}`;
  const previous = publishedModules[index - 1];
  const next = publishedModules[index + 1];
  const topics = module.highlights.map(topic => `<li>${escapeHtml(topic)}</li>`).join('');
  const lessons = module.publishedLessons.map(lesson => `<li>${escapeHtml(lesson.title)}</li>`).join('');
  const items = [{ name: 'Início', url: `${SITE_URL}/` }, { name: 'Trilhas', url: hubCanonical }, { name: phase.name, url: `${SITE_URL}/trilhas/${phase.slug}` }, { name: module.name, url: canonical }];
  const navigation = `<nav class="nav-next" aria-label="Módulos próximos">${previous ? `<a href="/modulos/${previous.slug}">← ${escapeHtml(previous.name)}</a>` : '<span></span>'}${next ? `<a href="/modulos/${next.slug}">${escapeHtml(next.name)} →</a>` : ''}</nav>`;

  writePage(join(modulesDir, module.slug), renderDocument({
    title: `${module.name} | Curso Gratuito`,
    description: `Aprenda ${module.name} gratuitamente. ${module.focus}`.slice(0, 158),
    canonical,
    pageId: `public:modulo:${module.slug}`,
    breadcrumbs: `<a href="/">Início</a><span>/</span><a href="/trilhas">Trilhas</a><span>/</span><a href="/trilhas/${phase.slug}">${escapeHtml(phase.shortName)}</a><span>/</span><span>${escapeHtml(module.id)}</span>`,
    body: `<section class="hero"><span class="eyebrow">${escapeHtml(module.label)} · módulo gratuito</span><h1>${escapeHtml(module.name)}</h1><p class="lead">${escapeHtml(module.focus)}</p><ul class="facts"><li>${module.publishedLessons.length} de ${module.lessons} aulas publicadas</li><li>Aulas ${escapeHtml(module.range)}</li><li>Incluído na formação gratuita</li></ul><div class="cta-row"><a class="cta" href="/?utm_source=seo_page&amp;utm_medium=organic_search&amp;utm_campaign=formacao_java_backend&amp;utm_content=modulo_${module.slug}">Acessar as aulas</a><a class="cta secondary" href="/trilhas/${phase.slug}">Ver trilha completa</a></div>${shareLinks(canonical, `modulo_${module.slug}`)}</section><div class="grid"><section class="panel"><h2>Principais assuntos</h2><ul class="topic-list">${topics}</ul></section><section class="panel"><h2>Sobre este módulo</h2><p>Este módulo faz parte da trilha <a href="/trilhas/${phase.slug}">${escapeHtml(phase.name)}</a> e conecta teoria, prática e decisões profissionais de backend.</p></section><section class="panel wide"><h2>Conteúdo já publicado</h2><ol class="lesson-list">${lessons}</ol></section></div>${navigation}`,
    structuredData: { '@context': 'https://schema.org', '@graph': [breadcrumbJson(items), { '@type': 'LearningResource', name: module.name, description: module.focus, url: canonical, inLanguage: 'pt-BR', isAccessibleForFree: true, learningResourceType: 'Módulo de curso', teaches: module.highlights, isPartOf: { '@type': 'Course', name: 'Formação Java Backend', url: `${SITE_URL}/` } }] }
  }));
  sitemapUrls.push(canonical);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map(url => `  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf8');

console.log(`SEO pages generated: ${publishedPhases.length} trails, ${publishedModules.length} modules, ${sitemapUrls.length} sitemap URLs.`);
