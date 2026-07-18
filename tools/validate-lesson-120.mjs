import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const component = read('plataforma-curso/src/components/GuidedToStringLesson120.jsx');
const css = read('plataforma-curso/src/components/guidedToStringLesson.css');
const viewer = read('plataforma-curso/src/components/MarkdownViewer.jsx');
const source = read('docs/aulas/120_M4_16_TO_STRING_COM_CRITERIO_OFICIAL.md');
const matrix = read('docs/revisao-aulas/matrizes/120_TO_STRING_COM_CRITERIO.md');
const has = (text, value, label = value) => assert.ok(text.includes(value), label);

for (const value of [
  "import GuidedToStringLesson120 from './GuidedToStringLesson120';",
  "startsWith('120_')",
  '<GuidedToStringLesson120 {...props} />',
]) has(viewer, value);

for (const value of [
  'guided-to-string-lesson-120-progress', 'ids.has(id)', 'inline: "center"',
  '.guided-layout', 'disabled={!stepDone}', 'hasNextLesson || !lessonComplete',
  'guided-error-label', '@Override public String toString()', 'resumo()',
  'senha', 'cpfMascarado', 'clienteId', 'Alt + Insert',
]) has(component, value);

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal((steps.match(/id: "/g) || []).length, 11);
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errors.match(/^  \["/gm) || []).length, 8);

for (const value of [
  '.guided-to-string-lesson', 'max-width: 100%',
  '.ts120-errors nav button > span:first-child', '.ts120-errors nav .guided-error-label',
  '900px', '680px', '520px', '380px', '320px',
]) has(css, value);

for (const concept of ['toString', '@Override', 'regra de negócio', 'resumo', 'objeto de valor', 'senha', 'documento', 'entidade', 'composição', 'coleção', 'record', 'IntelliJ', 'Ordem']) {
  for (const [label, text] of [['fonte', source], ['experiência', component], ['matriz', matrix]]) {
    assert.ok(text.toLocaleLowerCase('pt-BR').includes(concept.toLocaleLowerCase('pt-BR')), `${label}: ${concept}`);
  }
}

function extract(name) {
  const marker = `const ${name} = ` + '`';
  const start = component.indexOf(marker);
  assert.notEqual(start, -1, name);
  const body = start + marker.length;
  const end = component.indexOf('`;', body);
  assert.notEqual(end, -1, `${name}: fechamento`);
  return component.slice(body, end);
}

const files = [
  ['DEFAULT_SOURCE', 'ToStringPadrao120.java'],
  ['OVERRIDE_SOURCE', 'ToStringSobrescrito120.java'],
  ['VALUE_SOURCE', 'ToStringValores120.java'],
  ['SENSITIVE_SOURCE', 'ToStringSensivel120.java'],
  ['DOCUMENT_SOURCE', 'ToStringDocumento120.java'],
  ['ORDER_SOURCE', 'ToStringPedido120.java'],
  ['COMPOSITION_SOURCE', 'ToStringComposicao120.java'],
  ['ECOSYSTEM_SOURCE', 'ToStringEcossistema120.java'],
  ['OS_SOURCE', 'ToStringOrdemServico120.java'],
  ['TEST_SOURCE', 'TesteToString120.java'],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-120-'));
try {
  for (const [name, file] of files) writeFileSync(join(temp, file), extract(name), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([, file]) => file)], { cwd: temp, stdio: 'pipe' });
  const defaultOutput = execFileSync('java', ['-cp', temp, 'ToStringPadrao120'], { cwd: temp, encoding: 'utf8' });
  assert.match(defaultOutput, /ClientePadrao120@[0-9a-f]+/i);
  const runs = [
    ['ToStringSobrescrito120', ["ClienteTexto120{id=10, nome='Ana Silva', email='ana@email.com'}"]],
    ['ToStringValores120', ['E-mail: ana@email.com', 'Dinheiro: R$ 199.90']],
    ['ToStringSensivel120', ["senha='***'"]],
    ['ToStringDocumento120', ["cpf='***.***.***-01'"]],
    ['ToStringPedido120', ['status=CRIADO', 'status=PAGO', 'Pedido 1001 de Ana Silva', 'PAGO']],
    ['ToStringComposicao120', ['numero=1001', 'clienteId=10', "Pagamento{codigo='PAG-001', valor=R$ 399.80}"]],
    ['ToStringEcossistema120', ["Produto{codigo='PROD-001', nome='Cadeira'}", 'PeriodoTexto120[inicio=2026-01-01, fim=2026-12-31]']],
    ['ToStringOrdemServico120', ['codigo=OS-2026-0001', 'clienteId=10', 'status=AGENDADA', 'OS OS-2026-0001 para Ana Silva']],
    ['TesteToString120', ['8 testes passaram']],
  ];
  for (const [main, expected] of runs) {
    const output = execFileSync('java', ['-cp', temp, main], { cwd: temp, encoding: 'utf8' });
    for (const value of expected) has(output, value, `${main}: ${value}`);
  }
  const sensitive = execFileSync('java', ['-cp', temp, 'ToStringSensivel120'], { cwd: temp, encoding: 'utf8' });
  assert.ok(!sensitive.includes('SenhaMuitoSecreta123'), 'senha não pode aparecer na saída');
  const osOutput = execFileSync('java', ['-cp', temp, 'ToStringOrdemServico120'], { cwd: temp, encoding: 'utf8' });
  assert.ok(!osOutput.includes('11999998888'), 'telefone não pode aparecer na saída da OS');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 120 validada: onze etapas, dez fontes, representação segura, OS e oito testes conferidos.');
