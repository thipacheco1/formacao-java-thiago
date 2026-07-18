import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedDryReuseLesson098.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedDryReuseLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/098_REUSO_SEM_DUPLICACAO.md', 'utf8');
const source = readFileSync('docs/aulas/098_M3_09_REUSO_SEM_DUPLICACAO_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedDryReuseLesson098 from './GuidedDryReuseLesson098';", 'import');
expectText(viewer, "startsWith('098_')", 'rota');
for (const needle of [
  'guided-dry-reuse-lesson-098-progress',
  'saved.filter(id => validIds.has(id))',
  'completionNormalizedRef',
  "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })",
  "document.querySelector('.guided-layout')?.scrollIntoView",
  'disabled={!stepDone}',
  'disabled={!hasNextLesson || !lessonComplete}',
  "stepDone ? 'undo' : 'complete'",
]) expectText(component, needle, 'estrutura');

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal(count(steps, /{ id: '/g), 10, 'etapas');
for (const [start, end, total, label] of [
  ['const DUPLICATIONS = [', 'const ERRORS', 6, 'cenários'],
  ['const ERRORS = [', 'function CopyButton', 8, 'erros'],
]) {
  const part = component.slice(component.indexOf(start), component.indexOf(end));
  assert.equal(count(part, /^  \['/gm), total, label);
}
expectText(component, 'guided-error-label', 'clínica');
expectText(css, '.dr98-errors button>span:first-child', 'círculo');
expectText(css, '.guided-dry-reuse-lesson{max-width:100%;overflow:visible}', 'raiz');
for (const width of ['900', '680', '520', '380', '320']) expectText(css, `@media(max-width:${width}px)`, `breakpoint ${width}`);

for (const concept of [
  'DRY', "Don't Repeat Yourself", 'duplicação acidental', 'semântica',
  'ValidacoesBasicas', 'CalculosPedido', 'Utils', 'Helper', 'BigDecimal',
  'RoundingMode.HALF_UP', 'nomeCampo', 'construtor', 'static',
  'Step Into', 'F7', 'banco', 'API',
]) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
for (const phrase of ['O aluno classifica duplicações', 'Cinco fontes Java finais', 'A Aula 099']) expectText(matrix, phrase, 'matriz');

function extract(name) {
  const marker = `const ${name} = [`;
  const start = component.indexOf(marker);
  assert.ok(start >= 0, name);
  const end = component.indexOf("].join('\\n')", start);
  assert.ok(end >= 0, `${name} fim`);
  const values = [];
  for (const match of component.slice(start + marker.length, end).matchAll(/'((?:\\.|[^'])*)'/g)) {
    values.push(JSON.parse(`"${match[1].replaceAll('"', '\\"')}"`));
  }
  return values.join('\n');
}

const files = [
  ['ValidacoesBasicas.java', 'VALIDATIONS'],
  ['CalculosPedido.java', 'CALCULATIONS'],
  ['TesteManualReuso.java', 'MANUAL_TEST'],
  ['CalculosEstoque.java', 'STOCK_CALC'],
  ['TesteEstoque.java', 'STOCK_TEST'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-098-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = className => execFileSync('java', [className], {
    cwd: temp,
    encoding: process.platform === 'win32' ? 'latin1' : 'utf8',
  }).replace(/\r\n/g, '\n').trimEnd();
  const manual = run('TesteManualReuso');
  assert.ok(manual.includes('Nome do Cliente'), 'mensagem parametrizada');
  assert.ok(manual.includes('Total Bruto: 149.70'), 'total bruto');
  assert.ok(manual.includes('Desconto Aplicado: 14.97'), 'desconto');
  const stock = run('TesteEstoque');
  assert.ok(stock.includes('Produto: Teclado'), 'produto');
  assert.ok(stock.endsWith('Valor em estoque: R$ 1497.00'), 'valor de estoque');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 098 validada: estrutura, cinco fontes e duas execuções conferidas.');
