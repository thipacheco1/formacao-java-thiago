import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedCalculatorRevisitedLesson102.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedCalculatorRevisitedLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/102_CALCULADORA_CONSOLE_REVISITADA.md', 'utf8');
const source = readFileSync('docs/aulas/102_M3_13_PROJETO_CALCULADORA_CONSOLE_REVISITADA_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedCalculatorRevisitedLesson102 from './GuidedCalculatorRevisitedLesson102';", 'import');
expectText(viewer, "startsWith('102_')", 'rota');
for (const needle of ['guided-calculator-revisited-lesson-102-progress', 'saved.filter(id => validIds.has(id))', 'completionNormalizedRef', "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", "document.querySelector('.guided-layout')?.scrollIntoView", 'disabled={!stepDone}', 'disabled={!hasNextLesson || !lessonComplete}', "stepDone ? 'undo' : 'complete'"]) expectText(component, needle, 'estrutura');
const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal(count(steps, /{ id: '/g), 11, 'etapas');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function CopyButton'));
assert.equal(count(errors, /^  \['/gm), 8, 'erros');
expectText(component, 'guided-error-label', 'clínica');
expectText(css, '.cr102-errors button>span:first-child', 'círculo');
expectText(css, '.guided-calculator-revisited-lesson{max-width:100%;overflow:visible}', 'raiz');
for (const width of ['900', '680', '520', '380', '320']) expectText(css, `@media(max-width:${width}px)`, `breakpoint ${width}`);
for (const concept of ['CalculadoraConsoleRevisitada', 'LIMITE_HISTORICO', 'ResultadoOperacao', 'registrarNoHistorico', 'calcularMediaResultados', 'divisão por zero', 'opcaoValidaDeOperacao', 'imprimirRelatorio', 'debug', 'Extract Method', 'switch moderno', 'enum', 'positivos', 'negativos']) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
for (const phrase of ['O aluno constrói uma calculadora', 'Três fontes Java completas', 'A Aula 103']) expectText(matrix, phrase, 'matriz');

function extract(name) {
  const marker = `const ${name} = [`;
  const start = component.indexOf(marker);
  assert.ok(start >= 0, name);
  const end = component.indexOf("].join('\\n')", start);
  assert.ok(end >= 0, `${name} fim`);
  const values = [];
  for (const match of component.slice(start + marker.length, end).matchAll(/'((?:\\.|[^'])*)'/g)) values.push(JSON.parse(`"${match[1].replaceAll('"', '\\"')}"`));
  return values.join('\n');
}

const files = [['CalculadoraConsoleRevisitada.java', 'CALCULATOR_SOURCE'], ['TesteCalculadoraConsole.java', 'TEST_SOURCE'], ['CalculadoraConsoleRevisitadaV2.java', 'V2_SOURCE']];
const temp = mkdtempSync(join(tmpdir(), 'lesson-102-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = (name, input = '') => execFileSync('java', [name], { cwd: temp, encoding: 'utf8', input }).replace(/\r\n/g, '\n').trimEnd();
  const flow = run('CalculadoraConsoleRevisitada', '1\n10\n5\n2\n20\n3\n3\n4\n2\n4\n10\n0\n5\n6\n0\n');
  for (const needle of ['10.0 + 5.0 = 15.0', '20.0 - 3.0 = 17.0', '4.0 * 2.0 = 8.0', 'dividir por zero', 'Total de opera', 'Somas: 1', 'es: 0', 'resultados: 13.333333333333334']) expectText(flow, needle, 'fluxo');
  const invalid = run('CalculadoraConsoleRevisitada', 'abc\n9\n0\n');
  expectText(invalid, 'inteiro v', 'retry');
  expectText(invalid, 'inv', 'opção');
  const test = run('TesteCalculadoraConsole');
  expectText(test, 'TESTES OK: 8', 'testes');
  expectText(test, 'cheio.', 'limite');
  const v2 = run('CalculadoraConsoleRevisitadaV2');
  for (const needle of ['Maior: 17.0', 'Menor: -5.0', 'Positivos: 3', 'Negativos: 1', 'Zerados: 1']) expectText(v2, needle, 'V2');
} finally { rmSync(temp, { recursive: true, force: true }); }
console.log('Aula 102 validada: estrutura, três fontes, fluxo, rejeições, limite e V2 conferidos.');
