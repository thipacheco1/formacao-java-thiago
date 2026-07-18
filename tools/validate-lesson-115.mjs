import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('plataforma-curso/src/components/GuidedObjectRelationshipsLesson115.jsx', root), 'utf8');
const css = readFileSync(new URL('plataforma-curso/src/components/guidedObjectRelationshipsLesson.css', root), 'utf8');
const viewer = readFileSync(new URL('plataforma-curso/src/components/MarkdownViewer.jsx', root), 'utf8');
const source = readFileSync(new URL('docs/aulas/115_M4_11_RELACIONAMENTO_ENTRE_OBJETOS_OFICIAL.md', root), 'utf8');
const matrix = readFileSync(new URL('docs/revisao-aulas/matrizes/115_RELACIONAMENTO_ENTRE_OBJETOS.md', root), 'utf8');

const expectText = (text, needle, label = needle) => assert.ok(text.includes(needle), label);

for (const needle of [
  "import GuidedObjectRelationshipsLesson115 from './GuidedObjectRelationshipsLesson115';",
  "startsWith('115_')",
  '<GuidedObjectRelationshipsLesson115 {...props} />',
]) expectText(viewer, needle);

for (const needle of [
  'guided-object-relationships-lesson-115-progress',
  'saved.filter',
  'validIds.has(id)',
  'block: "nearest"',
  'inline: "center"',
  '.querySelector(".guided-layout")',
  'disabled={!stepDone}',
  'disabled={!hasNextLesson || !lessonComplete}',
  'guided-error-label',
]) expectText(component, needle);

const stepsBlock = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal((stepsBlock.match(/id: "/g) || []).length, 11, 'onze etapas');
const errorsBlock = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errorsBlock.match(/^  \[$/gm) || []).length, 8, 'oito diagnósticos');

for (const needle of [
  '.guided-object-relationships-lesson',
  'max-width: 100%',
  '.or115-errors nav button > span:first-child',
  '900px',
  '680px',
  '520px',
  '380px',
  '320px',
]) expectText(css, needle, `CSS ${needle}`);

for (const concept of [
  'relacionamento',
  'composição',
  'parâmetro',
  'colaboração',
  'acoplamento',
  'Lei de Demeter',
  'BigDecimal',
  'LocalDate',
  'Mensagem',
  'Contrato',
]) {
  for (const [label, text] of [['fonte', source], ['experiência', component], ['matriz', matrix]]) {
    assert.ok(text.toLocaleLowerCase('pt-BR').includes(concept.toLocaleLowerCase('pt-BR')), `${label}: ${concept}`);
  }
}

expectText(source.toLocaleLowerCase('pt-BR'), 'delegar', 'fonte: delegar');
expectText(component.toLocaleLowerCase('pt-BR'), 'delegação', 'experiência: delegação');
expectText(matrix.toLocaleLowerCase('pt-BR'), 'delegação', 'matriz: delegação');

function extract(name) {
  const marker = `const ${name} = ` + '`';
  const start = component.indexOf(marker);
  assert.notEqual(start, -1, name);
  const contentStart = start + marker.length;
  const end = component.indexOf('`;', contentStart);
  assert.notEqual(end, -1, `${name} final`);
  return component.slice(contentStart, end);
}

const files = [
  ['PEDIDO_SOURCE', 'RelacionamentoPedido.java'],
  ['OS_SOURCE', 'RelacionamentoOrdemServico.java'],
  ['MESSAGE_SOURCE', 'RelacionamentoMensagem.java'],
  ['CONTRACT_SOURCE', 'RelacionamentoContrato.java'],
  ['TEST_SOURCE', 'TesteRelacionamentos.java'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-115-'));

try {
  for (const [constant, file] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([, file]) => file)], { cwd: temp, stdio: 'pipe' });

  const executions = [
    ['RelacionamentoPedido', ['Total: R$ 399.80', 'Pode finalizar: true', 'Com cupom: R$ 359.82']],
    ['RelacionamentoOrdemServico', ['Pode executar: true', 'Pode reagendar: true', 'Original: PeriodoRel[data=2026-07-20, turno=MANHA]', 'Reagendada: PeriodoRel[data=2026-07-22, turno=TARDE]']],
    ['RelacionamentoMensagem', ['Pode enviar: true', 'Antes: PENDENTE', 'Depois: ENVIADA']],
    ['RelacionamentoContrato', ['Pode ativar: true', 'Meses: 6', 'Valor total: R$ 7200.00']],
    ['TesteRelacionamentos', ['8 testes passaram']],
  ];

  for (const [main, outputs] of executions) {
    const output = execFileSync('java', ['-cp', temp, main], { cwd: temp, encoding: 'utf8' });
    for (const expected of outputs) expectText(output, expected, `${main}: ${expected}`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 115 validada: onze etapas, cinco fontes, relações, delegação, acoplamento, cenários, debug e testes conferidos.');
