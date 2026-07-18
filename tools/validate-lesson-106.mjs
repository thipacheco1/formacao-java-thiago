import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedPaperModelingLesson106.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedPaperModelingLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/106_MODELAGEM_NO_PAPEL.md', 'utf8');
const source = readFileSync('docs/aulas/106_M4_02_MODELAGEM_NO_PAPEL_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedPaperModelingLesson106 from './GuidedPaperModelingLesson106';", 'import');
expectText(viewer, "startsWith('106_')", 'rota');
for (const needle of ['guided-paper-modeling-lesson-106-progress', 'saved.filter(id => validIds.has(id))', 'completionNormalizedRef', "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", "document.querySelector('.guided-layout')?.scrollIntoView", 'disabled={!stepDone}', 'disabled={!hasNextLesson || !lessonComplete}', "stepDone ? 'undo' : 'complete'"]) expectText(component, needle, 'estrutura');
const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal(count(steps, /{ id: '/g), 11, 'etapas');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal(count(errors, /^  \['/gm), 8, 'erros');
expectText(component, 'guided-error-label', 'clínica');
expectText(css, '.pm106-errors button>span:first-child', 'círculo');
expectText(css, '.guided-paper-modeling-lesson{max-width:100%;overflow:visible}', 'raiz');
for (const width of ['900', '680', '520', '380', '320']) expectText(css, `@media(max-width:${width}px)`, `breakpoint ${width}`);
for (const concept of ['substantivos', 'verbos', 'regras do domínio', 'responsabilidades', 'OrdemServico', 'StatusOs', 'FilaAtendimento', 'ModelagemOs', 'ModelagemPedido', 'BigDecimal', 'entidade', 'valor', 'serviço', 'Manager', 'Processor', 'ModelagemCliente', 'debug', 'git status', '.class']) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
for (const phrase of ['O aluno transforma descrições', 'Quatro fontes Java completas', 'A Aula 107']) expectText(matrix, phrase, 'matriz');

function extract(name) {
  const marker = `const ${name} = \``;
  const start = component.indexOf(marker);
  assert.ok(start >= 0, name);
  const end = component.indexOf('`;', start + marker.length);
  assert.ok(end >= 0, `${name} fim`);
  return component.slice(start + marker.length, end);
}

const files = [
  ['ModelagemOs.java', 'OS_SOURCE'],
  ['ModelagemPedido.java', 'ORDER_SOURCE'],
  ['ModelagemCliente.java', 'CLIENT_SOURCE'],
  ['TesteModelagemNoPapel.java', 'TEST_SOURCE'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-106-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = name => execFileSync('java', [name], { cwd: temp, encoding: 'utf8' }).replace(/\r\n/g, '\n').trimEnd();
  const os = run('ModelagemOs');
  for (const needle of ['OS-001', 'Ana Silva', 'Dias em aberto: 5', 'Atrasada: true', 'CASOS_CRITICOS']) expectText(os, needle, 'OS');
  const order = run('ModelagemPedido');
  for (const needle of ['V', 'true', '399.80', '39.9800', '359.8200']) expectText(order, needle, 'Pedido');
  const client = run('ModelagemCliente');
  for (const needle of ['Ana | completo=true | mensagem=true', 'Bia | completo=false | mensagem=false']) expectText(client, needle, 'Cliente');
  const test = run('TesteModelagemNoPapel');
  expectText(test, 'TESTES OK: 11', 'testes');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
console.log('Aula 106 validada: estrutura, quatro fontes, OS, Pedido, Cliente e testes conferidos.');
