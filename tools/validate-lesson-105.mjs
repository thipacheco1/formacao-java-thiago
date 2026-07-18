import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedObjectThinkingLesson105.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedObjectThinkingLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/105_PENSAMENTO_ORIENTADO_A_OBJETOS.md', 'utf8');
const source = readFileSync('docs/aulas/105_M4_01_PENSAMENTO_ORIENTADO_A_OBJETOS_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedObjectThinkingLesson105 from './GuidedObjectThinkingLesson105';", 'import');
expectText(viewer, "startsWith('105_')", 'rota');
for (const needle of ['guided-object-thinking-lesson-105-progress', 'saved.filter(id => validIds.has(id))', 'completionNormalizedRef', "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", "document.querySelector('.guided-layout')?.scrollIntoView", 'disabled={!stepDone}', 'disabled={!hasNextLesson || !lessonComplete}', "stepDone ? 'undo' : 'complete'"]) expectText(component, needle, 'estrutura');
const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal(count(steps, /{ id: '/g), 11, 'etapas');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal(count(errors, /^  \['/gm), 8, 'erros');
expectText(component, 'guided-error-label', 'clínica');
expectText(css, '.oo105-errors button>span:first-child', 'círculo');
expectText(css, '.guided-object-thinking-lesson{max-width:100%;overflow:visible}', 'raiz');
for (const width of ['900', '680', '520', '380', '320']) expectText(css, `@media(max-width:${width}px)`, `breakpoint ${width}`);
for (const concept of ['classe', 'objeto', 'estado', 'comportamento', 'identidade', 'OsProcedural', 'OsOrientadaAObjetos', 'OrdemServico', 'encerrada()', 'deus objeto', 'substantivos', 'verbos', 'PedidoOoExemplo', 'ClienteOoExemplo', 'podeReceberMensagem', 'debug', 'git status', '.class']) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
for (const phrase of ['O aluno muda o centro', 'Cinco fontes Java completas', 'A Aula 106']) expectText(matrix, phrase, 'matriz');

function extract(name) {
  const marker = `const ${name} = \``;
  const start = component.indexOf(marker);
  assert.ok(start >= 0, name);
  const end = component.indexOf('`;', start + marker.length);
  assert.ok(end >= 0, `${name} fim`);
  return component.slice(start + marker.length, end);
}

const files = [
  ['OsProcedural.java', 'PROCEDURAL_SOURCE'],
  ['OsOrientadaAObjetos.java', 'OBJECT_SOURCE'],
  ['PedidoOoExemplo.java', 'ORDER_SOURCE'],
  ['ClienteOoExemplo.java', 'CLIENT_SOURCE'],
  ['TestePensamentoOo.java', 'TEST_SOURCE'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-105-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = name => execFileSync('java', [name], { cwd: temp, encoding: 'utf8' }).replace(/\r\n/g, '\n').trimEnd();
  const procedural = run('OsProcedural');
  for (const needle of ['OS-001', 'Ana', 'ABERTA', 'true', 'Casos Cr']) expectText(procedural, needle, 'procedural');
  const object = run('OsOrientadaAObjetos');
  for (const needle of ['OS-001', 'OS-002', 'Ana', 'Carlos', 'Encerrada: true', 'Sem fila']) expectText(object, needle, 'OO');
  const order = run('PedidoOoExemplo');
  for (const needle of ['399.80', '39.9800', '359.8200']) expectText(order, needle, 'Pedido');
  const client = run('ClienteOoExemplo');
  for (const needle of ['Ana | ativo=true | contato=true | mensagem=true', 'Bruno | ativo=false | contato=false | mensagem=false']) expectText(client, needle, 'Cliente');
  const test = run('TestePensamentoOo');
  expectText(test, 'TESTES OK: 12', 'testes');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
console.log('Aula 105 validada: estrutura, cinco fontes, OS procedural/OO, Pedido, Cliente e testes conferidos.');
