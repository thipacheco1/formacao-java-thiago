import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const component = read('plataforma-curso/src/components/GuidedStaticCriteriaLesson121.jsx');
const css = read('plataforma-curso/src/components/guidedStaticCriteriaLesson.css');
const viewer = read('plataforma-curso/src/components/MarkdownViewer.jsx');
const source = read('docs/aulas/121_M4_17_STATIC_COM_CRITERIO_OFICIAL.md');
const matrix = read('docs/revisao-aulas/matrizes/121_STATIC_COM_CRITERIO.md');
const has = (text, value, label = value) => assert.ok(text.includes(value), label);

for (const value of [
  "const GuidedStaticCriteriaLesson121 = lazy(() => import('./GuidedStaticCriteriaLesson121'));",
  "startsWith('121_')",
  '<GuidedStaticCriteriaLesson121 {...props} />',
]) has(viewer, value);

for (const value of [
  'guided-static-criteria-lesson-121-progress', 'ids.has(id)', 'inline: "center"',
  '.guided-layout', 'disabled={!stepDone}', 'hasNextLesson || !lessonComplete',
  'guided-error-label', 'private static int totalCriados', 'static final int',
  'private TextoUtil121()', 'ContextoInvalido121', 'static OrdemFactory121 agendada',
  'RepositorioGlobal121', 'RepositorioMemoria121', 'DIAS_MAXIMOS_REAGENDAMENTO',
]) has(component, value);

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal((steps.match(/id: "/g) || []).length, 11, 'a aula deve ter onze etapas autorais');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errors.match(/^  \["/gm) || []).length, 8, 'a clínica deve ter oito casos');

for (const value of [
  '.guided-static-criteria-lesson', 'max-width: 100%',
  '.st121-errors nav button > span:first-child', '.st121-errors nav .guided-error-label',
  '900px', '680px', '520px', '380px', '320px',
]) has(css, value);

for (const concept of ['static', 'instância', 'main', 'constante', 'final', 'objeto mutável', 'utilitário', 'construtor', 'privado', 'factory', 'estado global', 'dependência explícita', 'testes', 'Orientação a Objetos', 'debug', 'Ordem']) {
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
  ['OWNERSHIP_SOURCE', 'StaticPertencimento121.java'],
  ['CONSTANT_SOURCE', 'StaticConstante121.java'],
  ['UTILITY_SOURCE', 'StaticUtilitario121.java'],
  ['CONTEXT_SOURCE', 'StaticContexto121.java'],
  ['FACTORY_SOURCE', 'StaticFactory121.java'],
  ['GLOBAL_SOURCE', 'StaticGlobalRuim121.java'],
  ['DEPENDENCY_SOURCE', 'StaticDependenciaExplicita121.java'],
  ['OS_SOURCE', 'StaticOrdemServico121.java'],
  ['TEST_SOURCE', 'TesteStatic121.java'],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-121-'));
try {
  for (const [name, file] of files) writeFileSync(join(temp, file), extract(name), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([, file]) => file)], { cwd: temp, stdio: 'pipe' });

  const runs = [
    ['StaticPertencimento121', ['Cliente #1: Ana Silva', 'Cliente #2: Bia Souza', 'Total da classe: 2']],
    ['StaticConstante121', ['Dias: 5', 'true']],
    ['StaticUtilitario121', ['Ana Silva', 'AS']],
    ['StaticContexto121', ['Cliente: Ana Silva', 'CLIENTE']],
    ['StaticFactory121', ['OS 1001 em 2026-07-20', 'AGENDADA']],
    ['StaticGlobalRuim121', ['Teste A encontrou: 1', 'Teste B esperava 0 e encontrou: 1']],
    ['StaticDependenciaExplicita121', ['Teste A encontrou: 1', 'Teste B encontrou: 0']],
    ['StaticOrdemServico121', ['2026-07-20', 'AGENDADA', '2026-07-22', 'REAGENDADA']],
    ['TesteStatic121', ['8 testes passaram']],
  ];
  for (const [main, expected] of runs) {
    const output = execFileSync('java', ['-cp', temp, main], { cwd: temp, encoding: 'utf8' });
    for (const value of expected) has(output, value, `${main}: ${value}`);
  }

  const invalidFile = join(temp, 'ContextoInvalido121.java');
  writeFileSync(invalidFile, extract('INVALID_CONTEXT_SOURCE'), 'utf8');
  const invalid = spawnSync('javac', ['-encoding', 'UTF-8', invalidFile], { cwd: temp, encoding: 'utf8' });
  assert.notEqual(invalid.status, 0, 'o exemplo de contexto static deve falhar na compilação');
  assert.match(invalid.stderr, /non-static|não.estático|est.tico/i, 'a falha deve explicar o acesso de instância');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 121 validada: onze etapas, dez fontes, propriedade, estado global, OS e oito testes conferidos.');
