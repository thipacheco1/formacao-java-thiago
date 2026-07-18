import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const component = read('plataforma-curso/src/components/GuidedObjectIdentityLesson118.jsx');
const css = read('plataforma-curso/src/components/guidedObjectIdentityLesson.css');
const viewer = read('plataforma-curso/src/components/MarkdownViewer.jsx');
const source = read('docs/aulas/118_M4_14_IDENTIDADE_DE_OBJETOS_OFICIAL.md');
const matrix = read('docs/revisao-aulas/matrizes/118_IDENTIDADE_DE_OBJETOS.md');
const has = (text, value, label = value) => assert.ok(text.includes(value), label);

for (const value of [
  "import GuidedObjectIdentityLesson118 from './GuidedObjectIdentityLesson118';",
  "startsWith('118_')",
  '<GuidedObjectIdentityLesson118 {...props} />',
]) has(viewer, value);
for (const value of [
  'guided-object-identity-lesson-118-progress',
  'ids.has(id)',
  'inline: "center"',
  '.guided-layout',
  'disabled={!stepDone}',
  'hasNextLesson || !lessonComplete',
  'guided-error-label',
]) has(component, value);

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal((steps.match(/id: ["']/g) || []).length, 11);
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errors.match(/^  \[/gm) || []).length, 8);
for (const value of [
  '.guided-object-identity-lesson',
  'max-width: 100%',
  '.oi118-errors nav button > span:first-child',
  '900px', '680px', '520px', '380px', '320px',
]) has(css, value);

for (const concept of ['referência', 'objeto', 'identidade', 'valor', 'mesma identidade', 'String', 'Pedido', 'Ordem de Serviço', 'Produto']) {
  for (const [label, text] of [['fonte', source], ['experiência', component], ['matriz', matrix]]) {
    assert.ok(text.toLocaleLowerCase('pt-BR').includes(concept.toLocaleLowerCase('pt-BR')), `${label}: ${concept}`);
  }
}
has(component, 'Heap', 'experiência: Heap');
has(matrix, 'Heap', 'matriz: Heap');

function extract(name) {
  const marker = `const ${name} = ` + '`';
  const start = component.indexOf(marker);
  const body = start + marker.length;
  const end = component.indexOf('`;', body);
  assert.notEqual(start, -1, name);
  return component.slice(body, end);
}
const files = [
  ['SAME_REFERENCE_SOURCE', 'MesmaReferencia.java'],
  ['DIFFERENT_OBJECTS_SOURCE', 'ObjetosDiferentesMesmoDados.java'],
  ['ORDER_SOURCE', 'EntidadeMesmaIdentidade.java'],
  ['VALUE_SOURCE', 'ValorMesmosDados.java'],
  ['STRING_SOURCE', 'StringReferencia.java'],
  ['OS_SOURCE', 'IdentidadeOrdemServico.java'],
  ['PRODUCT_SOURCE', 'IdentidadeProduto.java'],
  ['TEST_SOURCE', 'TesteIdentidadeObjetos.java'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-118-'));
try {
  for (const [name, file] of files) writeFileSync(join(temp, file), extract(name), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([, file]) => file)], { cwd: temp, stdio: 'pipe' });
  const runs = [
    ['MesmaReferencia', ['Original: Cliente 10', 'ana.novo@email.com', 'original == apelido: true']],
    ['ObjetosDiferentesMesmoDados', ['cliente1 == cliente2: false', 'mesmaIdentidade(cliente2): true', 'mesmaIdentidade(cliente3): false']],
    ['EntidadeMesmaIdentidade', ['Pedido 1001', 'PAGO', 'ENVIADO', 'Identidade: 1001']],
    ['ValorMesmosDados', ['email1 == email2: false', 'mesmoValor(email2): true', 'ana@email.com']],
    ['StringReferencia', ['new: == false', 'new: equals true', 'pool: == true']],
    ['IdentidadeOrdemServico', ['os1 == os2: false', 'mesmaIdentidade(os2): true', 'OS-2026-0001']],
    ['IdentidadeProduto', ['p1 == p2: false', 'p1 mesma identidade p2: true', 'p1 mesma identidade p3: false', 'estoque=7']],
    ['TesteIdentidadeObjetos', ['8 testes passaram']],
  ];
  for (const [main, expected] of runs) {
    const output = execFileSync('java', ['-cp', temp, main], { cwd: temp, encoding: 'utf8' });
    for (const value of expected) has(output, value, `${main}: ${value}`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
console.log('Aula 118 validada: onze etapas, oito fontes, referências, identidade, valor, String, OS, Produto e testes conferidos.');
