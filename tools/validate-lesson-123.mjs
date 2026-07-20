import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const component = read('plataforma-curso/src/components/GuidedConstructorOverloadLesson123.jsx');
const css = read('plataforma-curso/src/components/guidedConstructorOverloadLesson.css');
const viewer = read('plataforma-curso/src/components/MarkdownViewer.jsx');
const source = read('docs/aulas/123_M4_19_SOBRECARGA_DE_CONSTRUTORES_OFICIAL.md');
const matrix = read('docs/revisao-aulas/matrizes/123_SOBRECARGA_DE_CONSTRUTORES.md');
const has = (text, value, label = value) => assert.ok(text.includes(value), label);

for (const value of [
  "const GuidedConstructorOverloadLesson123 = lazy(() => import('./GuidedConstructorOverloadLesson123'));",
  "startsWith('123_')",
  '<GuidedConstructorOverloadLesson123 {...props} />',
]) has(viewer, value);

for (const value of [
  'guided-constructor-overload-lesson-123-progress', 'ids.has(id)', 'inline: "center"',
  '.guided-layout', 'disabled={!stepDone}', 'hasNextLesson || !lessonComplete',
  'guided-error-label', 'this(codigo, nome, preco, 0)', 'primeira instrução',
  'construtor principal', 'converterTexto', 'AmbiguidadeNull123',
  'reconstituido', 'ContratoSobrecarga123', 'valorTotal()',
]) has(component, value);

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal((steps.match(/id: "/g) || []).length, 11, 'a aula deve ter onze etapas autorais');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errors.match(/^  \["/gm) || []).length, 8, 'a clínica deve ter oito casos');

for (const value of [
  '.guided-constructor-overload-lesson', 'max-width: 100%',
  '.ov123-errors nav button > span:first-child', '.ov123-errors nav .guided-error-label',
  '900px', '680px', '520px', '380px', '320px',
]) has(css, value);

for (const concept of ['sobrecarga', 'assinatura', 'quantidade', 'tipos', 'ordem', 'this(...)', 'duplicação', 'construtor principal', 'valor padrão', 'entidade', 'objeto de valor', 'static factory', 'ambiguidade', 'null', 'sobrescrita', 'debug', 'Contrato']) {
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
  ['SIGNATURE_SOURCE', 'AssinaturasConstrutor123.java'],
  ['CHAIN_SOURCE', 'EncadeamentoConstrutor123.java'],
  ['DEFAULT_SOURCE', 'PadraoDominio123.java'],
  ['MONEY_SOURCE', 'DinheiroConstrutores123.java'],
  ['FACTORY_SOURCE', 'FactoryNomeada123.java'],
  ['OS_SOURCE', 'OrdemServicoConstrutores123.java'],
  ['CONTRACT_SOURCE', 'SobrecargaConstrutoresContrato123.java'],
  ['TEST_SOURCE', 'TesteSobrecarga123.java'],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-123-'));
try {
  for (const [name, file] of files) writeFileSync(join(temp, file), extract(name), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([, file]) => file)], { cwd: temp, stdio: 'pipe' });

  const runs = [
    ['AssinaturasConstrutor123', ['Cliente 0 | Ana Silva | sem e-mail', 'Bia Souza | bia@email.com', 'Cliente 10 | Caio Lima']],
    ['EncadeamentoConstrutor123', ['PROD-001', 'estoque=0 | ATIVO', 'estoque=10 | ATIVO', 'PROD-003', 'INATIVO']],
    ['PadraoDominio123', ['Pedido 1001', 'CRIADO', 'Pedido 1002', 'PAGO']],
    ['DinheiroConstrutores123', ['R$ 199.90']],
    ['FactoryNomeada123', ['Pedido 1001', 'CRIADO', 'Pedido 1002', 'PAGO']],
    ['OrdemServicoConstrutores123', ['OS-2026-0001', '2026-07-20 MANHA', 'OS-2026-0002', '2026-07-21 TARDE']],
    ['SobrecargaConstrutoresContrato123', ['CONT-001', 'RASCUNHO', 'CONT-003', 'ATIVO', 'total=R$ 600.00']],
    ['TesteSobrecarga123', ['8 testes passaram']],
  ];
  for (const [main, expected] of runs) {
    const output = execFileSync('java', ['-cp', temp, main], { cwd: temp, encoding: 'utf8' });
    for (const value of expected) has(output, value, `${main}: ${value}`);
  }

  const invalid = [
    ['INVALID_SIGNATURE_SOURCE', 'AssinaturaDuplicada123.java'],
    ['INVALID_THIS_SOURCE', 'ThisForaDePosicao123.java'],
    ['INVALID_AMBIGUITY_SOURCE', 'AmbiguidadeNull123.java'],
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

console.log('Aula 123 validada: onze etapas, onze fontes, encadeamento, Contrato e oito testes conferidos.');
