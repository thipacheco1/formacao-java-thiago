import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('plataforma-curso/src/components/GuidedCompositionLesson114.jsx', root), 'utf8');
const css = readFileSync(new URL('plataforma-curso/src/components/guidedCompositionLesson.css', root), 'utf8');
const viewer = readFileSync(new URL('plataforma-curso/src/components/MarkdownViewer.jsx', root), 'utf8');
const source = readFileSync(new URL('docs/aulas/114_M4_10_COMPOSICAO_OFICIAL.md', root), 'utf8');
const matrix = readFileSync(new URL('docs/revisao-aulas/matrizes/114_COMPOSICAO.md', root), 'utf8');
const expectText = (text, needle, label = needle) => assert.ok(text.includes(needle), label);
for (const needle of ["import GuidedCompositionLesson114 from './GuidedCompositionLesson114';", "startsWith('114_')", '<GuidedCompositionLesson114 {...props} />']) expectText(viewer, needle);
for (const needle of ['guided-composition-lesson-114-progress', 'saved.filter(id => validIds.has(id))', "block: 'nearest', inline: 'center'", "document.querySelector('.guided-layout')?.scrollIntoView", 'disabled={!stepDone}', 'disabled={!hasNextLesson || !lessonComplete}', 'guided-error-label']) expectText(component, needle);
const stepsBlock = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal((stepsBlock.match(/id: '/g) || []).length, 11, 'onze etapas');
const errorsBlock = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errorsBlock.match(/^  \['/gm) || []).length, 7, 'sete diagnósticos');
for (const needle of ['.guided-composition-lesson', 'max-width: 100%', '.cp114-errors button > span:first-child', '900px', '680px', '520px', '380px', '320px']) expectText(css, needle, `CSS ${needle}`);
for (const concept of ['composição', 'tem um', 'classe gigante', 'PedidoComposto', 'BigDecimal', 'LocalDate', 'null', 'responsabilidade', 'acoplamento', 'OrdemServicoComposta', 'Mensageria']) {
  for (const [label, text] of [['fonte', source], ['experiência', component], ['matriz', matrix]]) assert.ok(text.toLocaleLowerCase('pt-BR').includes(concept.toLocaleLowerCase('pt-BR')), `${label}: ${concept}`);
}
function extract(name) { const marker = `const ${name} = ` + '`'; const start = component.indexOf(marker); assert.notEqual(start, -1, name); const contentStart = start + marker.length; const end = component.indexOf('`;', contentStart); return component.slice(contentStart, end); }
const programs = [
  ['BAD_SOURCE', 'PedidoGiganteProblematico.java', 'PedidoGiganteProblematico', ['Pedido 1001', 'Ana', 'Notebook x 2', 'PIX/APROVADO']],
  ['ORDER_SOURCE', 'ComposicaoPedidoCompleto.java', 'ComposicaoPedidoCompleto', ['Pedido: 1001', 'NOTE-001', 'Pedido pago: true', 'Total do pedido: R$ 7000.00']],
  ['OS_SOURCE', 'ComposicaoOrdemServico.java', 'ComposicaoOrdemServico', ['OS: OS-2026-0001', 'Carlos Lima', '2026-07-20 - MANHA', 'Pode reagendar: true']],
  ['MESSAGE_SOURCE', 'ComposicaoMensageria.java', 'ComposicaoMensageria', ['Ana Silva', 'WHATSAPP | PENDENTE', 'Pode enviar: true', 'WHATSAPP | ENVIADA', 'Falha esperada:']],
  ['TEST_SOURCE', 'TesteComposicao.java', 'TesteComposicao', ['7 testes passaram']],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-114-'));
try { for (const [constant, file, main, outputs] of programs) { const dir = join(temp, constant.toLowerCase()); mkdirSync(dir); writeFileSync(join(dir, file), extract(constant), 'utf8'); execFileSync('javac', ['-encoding', 'UTF-8', file], { cwd: dir, stdio: 'pipe' }); const output = execFileSync('java', ['-cp', dir, main], { cwd: dir, encoding: 'utf8' }); for (const expected of outputs) expectText(output, expected, `${main}: ${expected}`); } } finally { rmSync(temp, { recursive: true, force: true }); }
console.log('Aula 114 validada: estrutura, cinco fontes, composição, validações, colaboração e testes conferidos.');
