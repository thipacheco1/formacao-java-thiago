import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedFundamentalsReviewLesson104.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedFundamentalsReviewLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/104_REVISAO_FINAL_FUNDAMENTOS_ANTES_OO.md', 'utf8');
const source = readFileSync('docs/aulas/104_M3_15_REVISAO_FINAL_DE_FUNDAMENTOS_ANTES_DE_OO_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedFundamentalsReviewLesson104 from './GuidedFundamentalsReviewLesson104';", 'import');
expectText(viewer, "startsWith('104_')", 'rota');
for (const needle of ['guided-fundamentals-review-lesson-104-progress', 'saved.filter(id => validIds.has(id))', 'completionNormalizedRef', "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", "document.querySelector('.guided-layout')?.scrollIntoView", 'disabled={!stepDone}', 'disabled={!hasNextLesson || !lessonComplete}', "stepDone ? 'undo' : 'complete'"]) expectText(component, needle, 'estrutura');
const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal(count(steps, /{ id: '/g), 11, 'etapas');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal(count(errors, /^  \['/gm), 8, 'erros');
const fundamentals = component.slice(component.indexOf('const FUNDAMENTALS = ['), component.indexOf('const ORAL_QUESTIONS'));
assert.equal(count(fundamentals, /\['/g), 25, 'conceitos');
const oral = component.slice(component.indexOf('const ORAL_QUESTIONS = ['), component.indexOf('const ERRORS'));
assert.equal(count(oral, /^  \['/gm), 10, 'perguntas orais');
expectText(component, 'guided-error-label', 'clínica');
expectText(css, '.fr104-errors button > span:first-child', 'círculo');
expectText(css, '.guided-fundamentals-review-lesson', 'raiz');
expectText(css, 'overflow: visible', 'overflow raiz');
for (const width of ['900', '680', '520', '380', '320']) expectText(css, `max-width: ${width}px`, `breakpoint ${width}`);
for (const concept of ['RevisaoFundamentosAntesDeOo', 'SolicitacaoEntrada', 'ResumoSolicitacao', 'Prioridade', 'quantidadeHistorico', 'calcularMediaDiasEmAberto', 'estaAtrasada', 'ehCritica', 'Extract Method', 'call stack', 'Fraude', 'maior número de dias', 'git status', '.class']) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
for (const phrase of ['O aluno comprova', 'Três fontes Java completas', 'A Aula 105']) expectText(matrix, phrase, 'matriz');

function extract(name) {
  const marker = `const ${name} = \``;
  const start = component.indexOf(marker);
  assert.ok(start >= 0, name);
  const end = component.indexOf('`;', start + marker.length);
  assert.ok(end >= 0, `${name} fim`);
  return component.slice(start + marker.length, end);
}

const files = [
  ['RevisaoFundamentosAntesDeOo.java', 'REVIEW_SOURCE'],
  ['TesteRevisaoFundamentos.java', 'TEST_SOURCE'],
  ['RevisaoFundamentosAntesDeOoV2.java', 'V2_SOURCE'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-104-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = (name, input = '') => execFileSync('java', [name], { cwd: temp, encoding: 'utf8', input }).replace(/\r\n/g, '\n').trimEnd();
  const flow = run('RevisaoFundamentosAntesDeOo', '1\nPROT-001\nAna\nEntrega\n1\n2\n1\nPROT-002\nCarlos\nReagendamento\n3\n1\n1\nPROT-003\nMaria\nSuporte\n2\n8\n2\n3\n0\n');
  for (const needle of ['PROT-001', 'BAIXA', 'Entrada', 'PROT-002', 'ALTA', 'PROT-003', 'MEDIA', 'Total de solicita', 'Atrasadas: 1', 'ticas: 2', 'M', '3.6666666666666665']) expectText(flow, needle, 'fluxo');
  const invalid = run('RevisaoFundamentosAntesDeOo', 'abc\n9\n0\n');
  expectText(invalid, 'inteiro v', 'retry');
  expectText(invalid, 'inv', 'opção');
  const test = run('TesteRevisaoFundamentos');
  expectText(test, 'TESTES OK: 12', 'testes');
  expectText(test, 'cheio.', 'limite');
  const v2 = run('RevisaoFundamentosAntesDeOoV2');
  for (const needle of ['Fraude cr', 'true', 'Altas: 1', 'Fraudes: 2', 'dias: 8']) expectText(v2, needle, 'V2');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
console.log('Aula 104 validada: estrutura, prontidão, três fontes, fluxos, falhas, relatório, limite e V2 conferidos.');
