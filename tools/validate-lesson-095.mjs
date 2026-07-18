import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedCalculationMethodsLesson095.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedCalculationMethodsLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/095_METODOS_DE_CALCULO.md', 'utf8');
const source = readFileSync('docs/aulas/095_M3_06_METODOS_DE_CALCULO_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedCalculationMethodsLesson095 from './GuidedCalculationMethodsLesson095';", 'import');
expectText(viewer, "startsWith('095_')", 'rota');
for (const needle of [
  'guided-calculation-methods-lesson-095-progress',
  'saved.filter(id=>validIds.has(id))',
  'completionNormalizedRef',
  "scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})",
  "document.querySelector('.guided-layout')?.scrollIntoView",
  'disabled={!stepDone}',
  'disabled={!hasNextLesson||!lessonComplete}',
  "stepDone?'undo':'complete'",
]) expectText(component, needle, 'estrutura');

const steps = component.slice(component.indexOf('const steps=['), component.indexOf('export default function'));
assert.equal(count(steps, /{id:'/g), 9, 'etapas');
for (const [start, end, total, label] of [
  ['const MONEY_STEPS=', 'function MoneyLab', 5, 'pipeline monetário'],
  ['const CONTRACTS=', 'function PreconditionsLab', 5, 'contratos'],
  ['const ERRORS=', 'function ErrorsClinic', 8, 'erros'],
]) {
  const part = component.slice(component.indexOf(start), component.indexOf(end));
  assert.equal(count(part, /\['/g), total, label);
}

expectText(component, 'guided-error-label', 'clínica');
expectText(css, '.cm95-errors button>span:first-child', 'círculo');
expectText(css, '.guided-calculation-methods-lesson{max-width:100%;overflow:visible}', 'raiz');
expectText(css, '@media(max-width:380px)', '380');
expectText(css, '@media(max-width:320px)', '320');
for (const concept of [
  'método de cálculo', 'BigDecimal', 'RoundingMode.HALF_UP', 'divisão inteira',
  'efeitos colaterais', 'IllegalArgumentException', 'compareTo', 'imutável',
  'arredond', 'Step Into', 'Variables', 'comissão', 'debug',
]) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
for (const phrase of ['Todo conteúdo original foi preservado', 'Quatro programas Java completos', 'A Aula 096']) {
  expectText(matrix, phrase, 'matriz');
}

function extract(name) {
  const marker = `const ${name}=[`;
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
  ['CalculoBasico.java', 'BASIC'],
  ['CalculoPedido.java', 'ORDER'],
  ['TestesManuaisCalculo.java', 'TESTS'],
  ['CalculoComissao.java', 'COMMISSION'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-095-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = className => execFileSync('java', ['-Dfile.encoding=UTF-8', className], { cwd: temp, encoding: 'utf8' })
    .replace(/\r\n/g, '\n').trimEnd();
  const basicOutput = run('CalculoBasico').split('\n');
  assert.deepEqual(basicOutput.slice(0, 2), ['Soma: 30', 'Maior: 20']);
  assert.ok(basicOutput[2].endsWith(': 15.0'), 'média calculada');
  assert.equal(run('CalculoPedido'), 'Total bruto: 399.80\nDesconto: 39.98\nTotal final: 359.82');
  assert.equal(run('TestesManuaisCalculo'), 'Todos os testes manuais passaram!');
  assert.ok(run('CalculoComissao').endsWith(': 600.00'), 'comissão calculada');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 095 validada: estrutura, quatro fontes e resultados de cálculo conferidos.');
