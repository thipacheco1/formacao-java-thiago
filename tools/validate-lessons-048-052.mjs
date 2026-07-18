import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const lessons = [
  { number: '048', component: 'GuidedArraySearchLesson048.jsx', css: 'guidedArraySearchLesson.css', matrix: '048_BUSCA_ARRAY.md', steps: 7, domains: 10, domainConst: 'DOMAIN_PROGRAMS', scannerFile: 'BuscaComScanner.java' },
  { number: '049', component: 'GuidedArrayStatsLesson049.jsx', css: 'guidedArrayStatsLesson.css', matrix: '049_MAIOR_MENOR_SOMA_MEDIA_ARRAY.md', steps: 9, domains: 6, domainConst: 'DOMAIN_PROGRAMS', scannerFile: 'RelatorioValoresUsuario.java' },
  { number: '050', component: 'GuidedStringArrayLesson050.jsx', css: 'guidedStringArrayLesson.css', matrix: '050_ARRAYS_DE_STRING.md', steps: 9, domains: 6, domainConst: 'DOMAINS', scannerFile: 'PreencherNomesConsole.java' },
  { number: '051', component: 'GuidedArrayParallelLesson051.jsx', css: 'guidedArrayParallelLesson.css', matrix: '051_ARRAYS_PARALELOS.md', steps: 9, domains: 4, domainConst: 'DOMAINS', scannerFile: 'PreencherPedidosParalelos.java' },
  { number: '052', component: 'GuidedMatrixInitialLesson052.jsx', css: 'guidedMatrixInitialLesson.css', matrix: '052_MATRIZ_BIDIMENSIONAL_INICIAL.md', steps: 8, domains: 7, domainConst: 'DOMAINS', scannerFile: 'LerMatrizConsole.java' }
];

const failures = [];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    failures.push(`arquivo ausente: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function requireText(source, token, lesson, reason) {
  if (!source.includes(token)) failures.push(`aula ${lesson}: ${reason} (${token})`);
}

function countObjects(source, startToken, endToken, marker) {
  const start = source.indexOf(startToken);
  if (start === -1) return 0;
  const end = source.indexOf(endToken, start + startToken.length);
  const slice = source.slice(start, end === -1 ? source.length : end);
  return (slice.match(marker) || []).length;
}

for (const lesson of lessons) {
  const componentPath = `plataforma-curso/src/components/${lesson.component}`;
  const cssPath = `plataforma-curso/src/components/${lesson.css}`;
  const matrixPath = `docs/revisao-aulas/matrizes/${lesson.matrix}`;
  const component = read(componentPath);
  const css = read(cssPath);
  read(matrixPath);

  requireText(component, 'GuidedLessonFacts', lesson.number, 'resumo técnico ausente');
  requireText(component, 'useEffect, useRef, useState', lesson.number, 'hooks de foco e normalização não importados');
  requireText(component, 'SyntaxHighlighter', lesson.number, 'destaque de sintaxe ausente');
  requireText(component, "label: 'Clínica de Erros'", lesson.number, 'clínica de erros ausente');
  requireText(component, "label: 'Entrega & Desafio'", lesson.number, 'entrega final ausente');
  requireText(component, 'const ERRORS = [', lesson.number, 'coleção de erros não definida');
  requireText(component, `const ${lesson.domainConst} = [`, lesson.number, 'coleção de domínios não definida');
  requireText(component, lesson.scannerFile, lesson.number, 'exemplo guiado com Scanner ausente');
  requireText(component, "saved.filter(id => steps.some(step => step.id === id))", lesson.number, 'progresso salvo não filtrado');
  requireText(component, 'completionNormalizedRef', lesson.number, 'conclusão antiga não normalizada');
  requireText(component, "inline: 'center'", lesson.number, 'etapa ativa não centralizada no roteiro mobile');
  requireText(component, 'disabled={!hasNextLesson || !lessonComplete}', lesson.number, 'avanço sem gate pedagógico');
  requireText(css, '.guided-step-heading h2', lesson.number, 'título de etapa sem limite local');
  requireText(css, '@media (max-width:', lesson.number, 'CSS responsivo ausente');
  requireText(css, 'overflow-x: auto', lesson.number, 'navegação interna mobile sem rolagem horizontal');

  if (lesson.number !== '048') {
    requireText(component, 'className="guided-error-label"', lesson.number, 'título legível da clínica ausente');
    requireText(css, 'errors-nav button > span:first-child', lesson.number, 'círculo da clínica sem seletor restrito');
    if (css.includes('errors-nav button span {')) failures.push(`aula ${lesson.number}: seletor amplo esmaga o título da clínica`);
  }

  const stepsStart = component.lastIndexOf('const steps = [');
  const stepsSlice = stepsStart === -1 ? '' : component.slice(stepsStart, component.indexOf('export default function', stepsStart));
  const stepCount = (stepsSlice.match(/\n\s+id:\s*'/g) || []).length;
  if (stepCount !== lesson.steps) failures.push(`aula ${lesson.number}: esperadas ${lesson.steps} etapas, encontradas ${stepCount}`);

  const errorCount = (component.match(/\n\s+symptom:\s*'/g) || []).length;
  if (errorCount !== 10) failures.push(`aula ${lesson.number}: esperados 10 diagnósticos, encontrados ${errorCount}`);

  const domainCount = countObjects(component, `const ${lesson.domainConst} = [`, 'const ERRORS = [', /\n\s+id:\s*'/g);
  if (domainCount < lesson.domains) failures.push(`aula ${lesson.number}: esperados ao menos ${lesson.domains} domínios, encontrados ${domainCount}`);
}

if (failures.length > 0) {
  console.error('LESSONS_048_052_STATIC_FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('LESSONS_048_052_STATIC_OK');
