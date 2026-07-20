import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const component = read('plataforma-curso/src/components/GuidedFinalCriteriaLesson122.jsx');
const css = read('plataforma-curso/src/components/guidedFinalCriteriaLesson.css');
const viewer = read('plataforma-curso/src/components/MarkdownViewer.jsx');
const source = read('docs/aulas/122_M4_18_FINAL_EM_CLASSES_METODOS_E_ATRIBUTOS_OFICIAL.md');
const matrix = read('docs/revisao-aulas/matrizes/122_FINAL_COM_CRITERIO.md');
const has = (text, value, label = value) => assert.ok(text.includes(value), label);

for (const value of [
  "const GuidedFinalCriteriaLesson122 = lazy(() => import('./GuidedFinalCriteriaLesson122'));",
  "startsWith('122_')",
  '<GuidedFinalCriteriaLesson122 {...props} />',
]) has(viewer, value);

for (const value of [
  'guided-final-criteria-lesson-122-progress', 'ids.has(id)', 'inline: "center"',
  '.guided-layout', 'disabled={!stepDone}', 'hasNextLesson || !lessonComplete',
  'guided-error-label', 'final int quantidade', 'final String valor',
  'private final String codigo', 'final String codigo()', 'final class',
  'List.copyOf', 'private static final String PREFIXO', 'quantidadeReagendamentos',
]) has(component, value);

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal((steps.match(/id: "/g) || []).length, 11, 'a aula deve ter onze etapas autorais');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errors.match(/^  \["/gm) || []).length, 8, 'a clínica deve ter oito casos');

for (const value of [
  '.guided-final-criteria-lesson', 'max-width: 100%',
  '.fn122-errors nav button > span:first-child', '.fn122-errors nav .guided-error-label',
  '900px', '680px', '520px', '380px', '320px',
]) has(css, value);

for (const concept of ['final', 'variável local', 'parâmetro', 'atributo', 'método', 'classe', 'static', 'reatribuição', 'entidade', 'referência', 'imutabilidade', 'objeto de valor', 'herança', 'constante', 'autom', 'debug', 'Ordem']) {
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
  ['SCOPE_SOURCE', 'FinalEscopos122.java'],
  ['ATTRIBUTE_SOURCE', 'FinalAtributo122.java'],
  ['ENTITY_SOURCE', 'FinalEntidade122.java'],
  ['REFERENCE_SOURCE', 'FinalReferencia122.java'],
  ['IMMUTABLE_SOURCE', 'ImutabilidadeProfunda122.java'],
  ['INHERITANCE_SOURCE', 'FinalHeranca122.java'],
  ['VALUE_SOURCE', 'ObjetosValorFinal122.java'],
  ['CONSTANT_SOURCE', 'ConstanteFinal122.java'],
  ['OS_SOURCE', 'FinalOrdemServico122.java'],
  ['TEST_SOURCE', 'TesteFinal122.java'],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-122-'));
try {
  for (const [name, file] of files) writeFileSync(join(temp, file), extract(name), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([, file]) => file)], { cwd: temp, stdio: 'pipe' });

  const runs = [
    ['FinalEscopos122', ['Total: 300', 'ANA SILVA']],
    ['FinalAtributo122', ['PED-1001']],
    ['FinalEntidade122', ['PROD-001', 'estoque=8', 'INATIVO']],
    ['FinalReferencia122', ['Ana Silva', 'saldo=150']],
    ['ImutabilidadeProfunda122', ['Agenda: [A, B]', 'Origem: 3 itens; agenda: 2']],
    ['FinalHeranca122', ['DOC-001', 'Documento especial']],
    ['ObjetosValorFinal122', ['ana@email.com', 'mesmo valor: true', 'R$ 219.90']],
    ['ConstanteFinal122', ['OS-2026-0001']],
    ['FinalOrdemServico122', ['AGENDADA', 'REAGENDADA', 'CONCLUIDA', 'Erro esperado:']],
    ['TesteFinal122', ['8 testes passaram']],
  ];
  for (const [main, expected] of runs) {
    const output = execFileSync('java', ['-cp', temp, main], { cwd: temp, encoding: 'utf8' });
    for (const value of expected) has(output, value, `${main}: ${value}`);
  }

  const invalid = [
    ['INVALID_LOCAL_SOURCE', 'FinalReatribuicaoInvalida122.java'],
    ['INVALID_FIELD_SOURCE', 'FinalSemInicializar122.java'],
    ['INVALID_INHERITANCE_SOURCE', 'FinalHerancaInvalida122.java'],
  ];
  for (const [name, file] of invalid) {
    const path = join(temp, file);
    writeFileSync(path, extract(name), 'utf8');
    const compilation = spawnSync('javac', ['-encoding', 'UTF-8', path], { cwd: temp, encoding: 'utf8' });
    assert.notEqual(compilation.status, 0, `${name} deve falhar na compilação`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 122 validada: onze etapas, treze fontes, cinco contextos de final, OS e oito testes conferidos.');
