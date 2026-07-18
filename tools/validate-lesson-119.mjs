import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const component = read('plataforma-curso/src/components/GuidedEqualsHashCodeLesson119.jsx');
const css = read('plataforma-curso/src/components/guidedEqualsHashCodeLesson.css');
const viewer = read('plataforma-curso/src/components/MarkdownViewer.jsx');
const source = read('docs/aulas/119_M4_15_EQUALS_HASHCODE_OFICIAL.md');
const matrix = read('docs/revisao-aulas/matrizes/119_EQUALS_HASHCODE.md');
const has = (text, value, label = value) => assert.ok(text.includes(value), label);

for (const value of [
  "import GuidedEqualsHashCodeLesson119 from './GuidedEqualsHashCodeLesson119';",
  "startsWith('119_')",
  '<GuidedEqualsHashCodeLesson119 {...props} />',
]) has(viewer, value);

for (const value of [
  'guided-equals-hashcode-lesson-119-progress',
  'ids.has(id)',
  'inline: "center"',
  '.guided-layout',
  'disabled={!stepDone}',
  'hasNextLesson || !lessonComplete',
  'guided-error-label',
  'Object outro',
  'Objects.equals',
  'Objects.hash',
]) has(component, value);

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal((steps.match(/id: "/g) || []).length, 11);
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errors.match(/^  \["/gm) || []).length, 8);

for (const value of [
  '.guided-equals-hashcode-lesson',
  'max-width: 100%',
  '.eq119-errors nav button > span:first-child',
  '.eq119-errors nav .guided-error-label',
  '900px', '680px', '520px', '380px', '320px',
]) has(css, value);

for (const concept of ['equals', 'hashCode', 'HashSet', 'HashMap', 'record', 'getClass', 'instanceof', 'campo mutável', 'entidade', 'objeto de valor', 'Produto']) {
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
  ['NO_EQUALS_SOURCE', 'ComparacaoSemEquals119.java'],
  ['EMAIL_SOURCE', 'EmailComEquals119.java'],
  ['PHONE_SOURCE', 'TelefoneComEquals119.java'],
  ['CLIENT_SOURCE', 'ClienteEntidade119.java'],
  ['COLLECTIONS_SOURCE', 'ColecoesHash119.java'],
  ['RECORD_SOURCE', 'RecordEquals119.java'],
  ['MUTABLE_SOURCE', 'CampoMutavelHash119.java'],
  ['PRODUCT_SOURCE', 'EqualsHashCodeProduto119.java'],
  ['TEST_SOURCE', 'TesteEqualsHashCode119.java'],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-119-'));
try {
  for (const [name, file] of files) writeFileSync(join(temp, file), extract(name), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([, file]) => file)], { cwd: temp, stdio: 'pipe' });
  const runs = [
    ['ComparacaoSemEquals119', ['a == b: false', 'a.equals(b): false']],
    ['EmailComEquals119', ['a == b: false', 'a.equals(b): true', 'a.equals(c): false', 'hash igual: true']],
    ['TelefoneComEquals119', ['a.equals(b): true', 'a.equals(c): false', 'hash igual: true']],
    ['ClienteEntidade119', ['a == b: false', 'a.equals(b): true', 'a.equals(c): false', 'hash igual: true']],
    ['ColecoesHash119', ['HashSet: 2', 'HashMap: Ana Silva']],
    ['RecordEquals119', ['a == b: false', 'a.equals(b): true', 'a.equals(c): false', 'hash igual: true', 'CodigoPedido119[valor=PED-1001]']],
    ['CampoMutavelHash119', ['antes: true', 'depois: false']],
    ['EqualsHashCodeProduto119', ['p1 == p2: false', 'p1.equals(p2): true', 'p1.equals(p3): false', 'hash p1 == p2: true', 'Quantidade no HashSet: 2']],
    ['TesteEqualsHashCode119', ['8 testes passaram']],
  ];
  for (const [main, expected] of runs) {
    const output = execFileSync('java', ['-cp', temp, main], { cwd: temp, encoding: 'utf8' });
    for (const value of expected) has(output, value, `${main}: ${value}`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 119 validada: onze etapas, nove fontes, contrato equals/hashCode, coleções, Produto e oito testes conferidos.');
