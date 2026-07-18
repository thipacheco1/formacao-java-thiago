import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedOrderServiceProcessingLesson103.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedOrderServiceProcessingLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/103_PROCESSAMENTO_OS_CONSOLE.md', 'utf8');
const source = readFileSync('docs/aulas/103_M3_14_PROJETO_PROCESSAMENTO_DE_OS_CONSOLE_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedOrderServiceProcessingLesson103 from './GuidedOrderServiceProcessingLesson103';", 'import');
expectText(viewer, "startsWith('103_')", 'rota');
for (const needle of ['guided-order-service-processing-lesson-103-progress', 'saved.filter(id => validIds.has(id))', 'completionNormalizedRef', "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", "document.querySelector('.guided-layout')?.scrollIntoView", 'disabled={!stepDone}', 'disabled={!hasNextLesson || !lessonComplete}', "stepDone ? 'undo' : 'complete'"]) expectText(component, needle, 'estrutura');
const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal(count(steps, /{ id: '/g), 10, 'etapas');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function CopyButton'));
assert.equal(count(errors, /^  \['/gm), 8, 'erros');
expectText(component, 'guided-error-label', 'clínica');
expectText(css, '.os103-errors button>span:first-child', 'círculo');
expectText(css, '.guided-order-service-processing-lesson{max-width:100%;overflow:visible}', 'raiz');
for (const width of ['900', '680', '520', '380', '320']) expectText(css, `@media(max-width:${width}px)`, `breakpoint ${width}`);
for (const concept of ['ProcessamentoOsConsole', 'StatusOs', 'OrdemServicoEntrada', 'ResumoOs', 'calcularDiasEmAberto', 'definirFilaSugerida', 'Casos Críticos', 'registrarNoHistorico', 'contarPorFila', 'DateTimeParseException', 'debug', 'contarPorStatus', 'calcularMediaDiasEmAberto', 'git status']) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
for (const phrase of ['O aluno constrói um processador', 'Três fontes Java completas', 'A Aula 104']) expectText(matrix, phrase, 'matriz');

function extract(name) {
  const marker = `const ${name} = \``;
  const start = component.indexOf(marker);
  assert.ok(start >= 0, name);
  const end = component.indexOf('`;', start + marker.length);
  assert.ok(end >= 0, `${name} fim`);
  return component.slice(start + marker.length, end);
}

const files = [
  ['ProcessamentoOsConsole.java', 'PROCESSING_SOURCE'],
  ['TesteProcessamentoOsConsole.java', 'TEST_SOURCE'],
  ['ProcessamentoOsConsoleV2.java', 'V2_SOURCE'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-103-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = (name, input = '') => execFileSync('java', [name], { cwd: temp, encoding: 'utf8', input }).replace(/\r\n/g, '\n').trimEnd();
  const flow = run('ProcessamentoOsConsole', '1\nOS-001\nAna\n1\n2020-01-01\n0\n2\n3\n0\n');
  for (const needle of ['RESUMO DA OS', 'OS-001', 'ABERTA', 'true', 'HIST', 'RELAT', 'Total de OS processadas: 1', 'OS atrasadas: 1', 'Fila Casos Cr']) expectText(flow, needle, 'fluxo');
  const invalid = run('ProcessamentoOsConsole', 'abc\n9\n0\n');
  expectText(invalid, 'inteiro v', 'retry');
  expectText(invalid, 'inv', 'opção');
  const test = run('TesteProcessamentoOsConsole');
  expectText(test, 'TESTES OK: 10', 'testes');
  expectText(test, 'cheio.', 'limite');
  const v2 = run('ProcessamentoOsConsoleV2');
  for (const needle of ['Fila V2: Reagendamento', 'REAGENDADA: 1', 'dias: 4.0']) expectText(v2, needle, 'V2');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
console.log('Aula 103 validada: estrutura, três fontes, fluxo de OS, filas, limite, relatório e V2 conferidos.');
