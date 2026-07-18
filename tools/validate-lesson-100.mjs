import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedExtractMethodLesson100.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedExtractMethodLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/100_EXTRACT_METHOD_INTELLIJ.md', 'utf8');
const source = readFileSync('docs/aulas/100_M3_11_REFATORACAO_EXTRACT_METHOD_NO_INTELLIJ_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedExtractMethodLesson100 from './GuidedExtractMethodLesson100';", 'import');
expectText(viewer, "startsWith('100_')", 'rota');
for (const needle of [
  'guided-extract-method-lesson-100-progress',
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
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function CopyButton'));
assert.equal(count(errors, /^  \['/gm), 8, 'erros');
expectText(component, 'guided-error-label', 'clínica');
expectText(css, '.em100-errors button>span:first-child', 'círculo');
expectText(css, '.guided-extract-method-lesson{max-width:100%;overflow:visible}', 'raiz');
for (const width of ['900', '680', '520', '380', '320']) expectText(css, `@media(max-width:${width}px)`, `breakpoint ${width}`);

for (const concept of [
  'refatoração', 'Extract Method', 'Ctrl + Alt + M', 'Cmd + Option + M',
  'parâmetros', 'retorno', 'PedidoExtractAntes', 'PedidoExtractDepois',
  'calcularTotalBruto', 'calcularFrete', 'imprimirResumo', 'Shift + F6',
  'OsExtract', 'calcularPrecoOS', 'verificarSLA', 'exibirFichaOS', 'F7',
]) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
for (const phrase of ['O aluno cria uma baseline', 'Quatro fontes Java completas', 'A Aula 101']) expectText(matrix, phrase, 'matriz');

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
  ['PedidoExtractAntes.java', 'BEFORE'],
  ['PedidoExtractDepois.java', 'AFTER'],
  ['OsExtractAntes.java', 'OS_BEFORE'],
  ['OsExtractDepois.java', 'OS_AFTER'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-100-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = className => execFileSync('java', [className], { cwd: temp, encoding: 'utf8' }).replace(/\r\n/g, '\n').trimEnd();
  const orderBefore = run('PedidoExtractAntes');
  const orderAfter = run('PedidoExtractDepois');
  assert.equal(orderAfter, orderBefore, 'pedido equivalente');
  assert.ok(orderBefore.includes('Bruto: R$ 360.00'), 'bruto');
  assert.ok(orderBefore.includes('Frete: R$ 0'), 'frete');
  assert.ok(orderBefore.endsWith('Final: R$ 360.00'), 'total final');
  const osBefore = run('OsExtractAntes');
  const osAfter = run('OsExtractDepois');
  assert.equal(osAfter, osBefore, 'OS equivalente');
  assert.ok(osBefore.includes('Total: R$ 320.00'), 'preço OS');
  assert.ok(osBefore.endsWith('SLA: ATRASADA'), 'SLA');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 100 validada: estrutura, quatro fontes e duas equivalências exatas conferidas.');
