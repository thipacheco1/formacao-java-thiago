import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('plataforma-curso/src/components/GuidedImmutabilityLesson113.jsx', root), 'utf8');
const css = readFileSync(new URL('plataforma-curso/src/components/guidedImmutabilityLesson.css', root), 'utf8');
const viewer = readFileSync(new URL('plataforma-curso/src/components/MarkdownViewer.jsx', root), 'utf8');
const source = readFileSync(new URL('docs/aulas/113_M4_09_IMUTABILIDADE_APLICADA_OFICIAL.md', root), 'utf8');
const matrix = readFileSync(new URL('docs/revisao-aulas/matrizes/113_IMUTABILIDADE_APLICADA.md', root), 'utf8');
const expectText = (text, needle, label = needle) => assert.ok(text.includes(needle), label);

expectText(viewer, "import GuidedImmutabilityLesson113 from './GuidedImmutabilityLesson113';", 'importação 113');
expectText(viewer, "startsWith('113_')", 'rota 113');
expectText(viewer, '<GuidedImmutabilityLesson113 {...props} />', 'renderização 113');
for (const needle of ['guided-immutability-lesson-113-progress', 'saved.filter(id => validIds.has(id))', "block: 'nearest', inline: 'center'", "document.querySelector('.guided-layout')?.scrollIntoView", 'disabled={!stepDone}', 'disabled={!hasNextLesson || !lessonComplete}', 'guided-error-label']) expectText(component, needle);
const stepsBlock = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal((stepsBlock.match(/id: '/g) || []).length, 11, 'onze etapas');
const errorsBlock = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errorsBlock.match(/^  \['/gm) || []).length, 7, 'sete diagnósticos');
for (const needle of ['.guided-immutability-lesson', 'max-width: 100%', '.im113-errors button > span:first-child', '900px', '680px', '520px', '380px', '320px']) expectText(css, needle, `CSS ${needle}`);

for (const concept of ['imutabilidade', 'final', 'comEmail', 'LocalDate', 'Dinheiro', 'Email', 'objeto de valor', 'Pagamento', 'trade-offs', 'record', 'Telefone']) {
  for (const [label, text] of [['fonte', source], ['experiência', component], ['matriz', matrix]]) assert.ok(text.toLocaleLowerCase('pt-BR').includes(concept.toLocaleLowerCase('pt-BR')), `${label}: ${concept}`);
}

function extract(name) {
  const marker = `const ${name} = ` + '`'; const start = component.indexOf(marker);
  assert.notEqual(start, -1, `fonte ${name}`); const contentStart = start + marker.length;
  const end = component.indexOf('`;', contentStart); assert.notEqual(end, -1, `fim ${name}`);
  return component.slice(contentStart, end);
}

const programs = [
  ['BAD_CLIENT_SOURCE', 'ClienteMutavelProblematico.java', 'ClienteMutavelProblematico', ['Inicial:', 'Inv', 'null']],
  ['IMMUTABLE_CLIENT_SOURCE', 'ClienteImutavel.java', 'ClienteImutavel', ['Original: Ana Silva | ana@email.com', 'Atualizado: Ana Silva | ana.novo@email.com', 'Falha esperada:']],
  ['LOCALDATE_SOURCE', 'LocalDateImutavel.java', 'LocalDateImutavel', ['Hoje: 2026-07-18', '2026-07-19', 'String original: ana | Nova: ANA']],
  ['MONEY_SOURCE', 'DinheiroImutavel.java', 'DinheiroImutavel', ['Produto: R$ 199.90', 'Total: R$ 219.90', 'Com desconto: R$ 197.91', 'Produto continua: R$ 199.90']],
  ['EMAIL_SOURCE', 'EmailImutavel.java', 'EmailImutavel', ['ana@email.com', 'email.com', 'Mesmo dom', 'false', 'Falha esperada:']],
  ['PAYMENT_SOURCE', 'PagamentoImutavel.java', 'PagamentoImutavel', ['Retorno ignorado: PENDENTE', 'Original: PAG-001 | 150.00 | PENDENTE', 'APROVADO', 'CONFIRMADO']],
  ['RECORD_SOURCE', 'PeriodoAgendamentoRecord.java', 'PeriodoAgendamentoRecord', ['2026-07-18', '2026-07-23', 'Dura', '5', 'Falha esperada:']],
  ['PHONE_SOURCE', 'TelefoneImutavel.java', 'TelefoneImutavel', ['Original: (11) 999999999', 'Alterado: (11) 888888888', 'Original continua: (11) 999999999', 'Mesmo DDD: true', 'Falha esperada:']],
  ['TEST_SOURCE', 'TesteImutabilidade.java', 'TesteImutabilidade', ['7 testes passaram']],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-113-'));
try {
  for (const [constant, file, main, outputs] of programs) {
    const dir = join(temp, constant.toLowerCase()); mkdirSync(dir);
    writeFileSync(join(dir, file), extract(constant), 'utf8');
    execFileSync('javac', ['-encoding', 'UTF-8', file], { cwd: dir, stdio: 'pipe' });
    const output = execFileSync('java', ['-cp', dir, main], { cwd: dir, encoding: 'utf8' });
    for (const expected of outputs) expectText(output, expected, `${main}: ${expected}`);
  }
} finally { rmSync(temp, { recursive: true, force: true }); }

console.log('Aula 113 validada: estrutura, nove fontes, imutabilidade, valores, record, referências e testes conferidos.');
