import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const component = read('plataforma-curso/src/components/GuidedThisReferenceLesson124.jsx');
const css = read('plataforma-curso/src/components/guidedThisReferenceLesson.css');
const viewer = read('plataforma-curso/src/components/MarkdownViewer.jsx');
const source = read('docs/aulas/124_M4_20_THIS_E_SELF_REFERENCE_OFICIAL.md');
const matrix = read('docs/revisao-aulas/matrizes/124_THIS_E_AUTORREFERENCIA.md');
const has = (text, value, label = value) => assert.ok(text.includes(value), label);

for (const value of [
  "const GuidedThisReferenceLesson124 = lazy(() => import('./GuidedThisReferenceLesson124'));",
  "startsWith('124_')",
  '<GuidedThisReferenceLesson124 {...props} />',
]) has(viewer, value);

for (const value of [
  'guided-this-reference-lesson-124-progress', 'ids.has(id)', 'inline: "center"',
  '.guided-layout', 'disabled={!stepDone}', 'hasNextLesson || !lessonComplete',
  'guided-error-label', 'this.nome = nome', 'nome = nome', 'this(id, nome, StatusCliente124.ATIVO)',
  'this.criado()', 'this não existe em static', 'return this', 'this == outro',
  'registrarCancelamento(this', 'OBJETO INCOMPLETO', 'PedidoDominio124',
]) has(component, value);

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal((steps.match(/id: "/g) || []).length, 11, 'a aula deve ter onze etapas autorais');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errors.match(/^  \["/gm) || []).length, 8, 'a clínica deve ter oito casos');

for (const value of [
  '.guided-this-reference-lesson', 'max-width: 100%',
  '.th124-errors nav button > span:first-child', '.th124-errors nav .guided-error-label',
  '900px', '680px', '520px', '380px', '320px',
]) has(css, value);

for (const concept of ['this', 'objeto atual', 'atributo', 'parâmetro', 'sombra', 'obrigatório', 'opcional', 'construtor', 'static', 'retorno', 'fluent interface', 'objeto de valor', 'equals', 'entidade', 'auditoria', 'acoplamento', 'null', 'debug', 'Pedido']) {
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
  ['CURRENT_SOURCE', 'ThisObjetoAtual124.java'],
  ['SHADOW_SOURCE', 'ThisSombra124.java'],
  ['OPTIONAL_SOURCE', 'ThisOpcional124.java'],
  ['CONSTRUCTOR_SOURCE', 'ThisConstrutores124.java'],
  ['METHOD_SOURCE', 'ThisMetodo124.java'],
  ['FLUENT_SOURCE', 'ThisFluente124.java'],
  ['VALUE_SOURCE', 'ThisValorImutavel124.java'],
  ['AUDIT_SOURCE', 'ThisComoParametro124.java'],
  ['ENTITY_SOURCE', 'ThisEntidade124.java'],
  ['CHALLENGE_SOURCE', 'ThisPedidoDominio124.java'],
  ['TEST_SOURCE', 'TesteThis124.java'],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-124-'));
try {
  for (const [name, file] of files) writeFileSync(join(temp, file), extract(name), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([, file]) => file)], { cwd: temp, stdio: 'pipe' });

  const runs = [
    ['ThisObjetoAtual124', ['Cliente 10 | Ana Silva | ana.novo@email.com', 'Cliente 20 | Bia Souza']],
    ['ThisSombra124', ['Sem this: null', 'Com this: Bia Souza']],
    ['ThisOpcional124', ['PROD-001 | Cadeira | 10']],
    ['ThisConstrutores124', ['Cliente 10 | Ana Silva | ATIVO', 'Cliente 20 | Carlos Lima | INATIVO']],
    ['ThisMetodo124', ['CRIADO | pago=false', 'PAGO | pago=true']],
    ['ThisFluente124', ['Mesma', 'true', 'Ligar antes']],
    ['ThisValorImutavel124', ['R$ 199.90', 'R$ 219.90', 'Novo objeto: true', 'Igual a si: true']],
    ['ThisComoParametro124', ['Auditoria: pedido=1001', 'CANCELADO', 'Cliente desistiu']],
    ['ThisEntidade124', ['OS-2026-0001', '2026-07-22 TARDE', 'CONCLUIDA', 'reagendamentos=1']],
    ['ThisPedidoDominio124', ['Auditoria: pedido=1001', 'CANCELADO', 'Pedido 1001', 'R$ 399.80']],
    ['TesteThis124', ['8 testes passaram']],
  ];
  for (const [main, expected] of runs) {
    const output = execFileSync('java', ['-cp', temp, main], { cwd: temp, encoding: 'utf8' });
    for (const value of expected) has(output, value, `${main}: ${value}`);
  }

  const invalid = [
    ['INVALID_FIRST_SOURCE', 'ThisDepoisDeCodigo124.java'],
    ['INVALID_STATIC_SOURCE', 'ThisEmStatic124.java'],
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

console.log('Aula 124 validada: onze etapas, treze fontes, autorreferência, Pedido e oito testes conferidos.');
