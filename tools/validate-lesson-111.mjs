import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('plataforma-curso/src/components/GuidedTrueEncapsulationLesson111.jsx', root), 'utf8');
const css = readFileSync(new URL('plataforma-curso/src/components/guidedTrueEncapsulationLesson.css', root), 'utf8');
const viewer = readFileSync(new URL('plataforma-curso/src/components/MarkdownViewer.jsx', root), 'utf8');
const source = readFileSync(new URL('docs/aulas/111_M4_07_ENCAPSULAMENTO_DE_VERDADE_OFICIAL.md', root), 'utf8');
const matrix = readFileSync(new URL('docs/revisao-aulas/matrizes/111_ENCAPSULAMENTO_DE_VERDADE.md', root), 'utf8');
const expectText = (text, needle, label = needle) => assert.ok(text.includes(needle), label);

expectText(viewer, "import GuidedTrueEncapsulationLesson111 from './GuidedTrueEncapsulationLesson111';", 'importação 111');
expectText(viewer, "startsWith('111_')", 'rota 111');
expectText(viewer, '<GuidedTrueEncapsulationLesson111 {...props} />', 'renderização 111');
expectText(component, 'guided-true-encapsulation-lesson-111-progress', 'progresso exclusivo');
expectText(component, 'saved.filter(id => validIds.has(id))', 'normalização');
expectText(component, "block: 'nearest', inline: 'center'", 'foco móvel');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora do roteiro');
expectText(component, 'disabled={!stepDone}', 'portão de etapa');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'portão da aula 112');
expectText(component, 'guided-error-label', 'clínica legível');
assert.equal((component.match(/id: '/g) || []).length, 11, 'onze etapas');
assert.equal((component.match(/^  \['.*', '.*', '.*'\],$/gm) || []).filter(line => component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE')).includes(line)).length, 8, 'oito diagnósticos');
expectText(css, '.guided-true-encapsulation-lesson', 'raiz responsiva');
expectText(css, 'max-width: 100%', 'largura fluida');
expectText(css, '.ec111-errors button > span:first-child', 'círculo restrito da clínica');
for (const bp of ['900px', '680px', '520px', '380px', '320px']) expectText(css, bp, `breakpoint ${bp}`);

for (const concept of ['encapsulamento', 'private', 'getter', 'setter', 'saldo', 'ordem de serviço', 'pagamento', 'final', 'método privado', 'centralizada', 'Produto']) {
  for (const [label, text] of [['fonte', source], ['experiência', component], ['matriz', matrix]]) {
    assert.ok(text.toLocaleLowerCase('pt-BR').includes(concept.toLocaleLowerCase('pt-BR')), `${label}: ${concept}`);
  }
}

function extract(name) {
  const marker = `const ${name} = ` + '`';
  const start = component.indexOf(marker);
  assert.notEqual(start, -1, `fonte ${name}`);
  const contentStart = start + marker.length;
  const end = component.indexOf('`;', contentStart);
  assert.notEqual(end, -1, `fim ${name}`);
  return component.slice(contentStart, end);
}

const programs = [
  ['BAD_SOURCE', 'ContaSemEncapsulamento.java', 'ContaSemEncapsulamento', ['Saldo inicial: 100.00', '-500.00']],
  ['PRIVATE_SOURCE', 'ContaComAtributosPrivados.java', 'ContaComAtributosPrivados', ['0001', 'Ana Silva', 'Saldo: 100.00']],
  ['ACCOUNT_SOURCE', 'ContaEncapsulada.java', 'ContaEncapsulada', ['Saque realizado: true', 'Saque grande realizado: false', 'Saldo final: 120.00']],
  ['OS_SOURCE', 'OrdemServicoEncapsulada.java', 'OrdemServicoEncapsulada', ['CONCLUIDA', 'Reagendamentos: 1', 'Erro ao reagendar:']],
  ['PAYMENT_SOURCE', 'PagamentoEncapsulado.java', 'PagamentoEncapsulado', ['PENDENTE', 'APROVADO', 'CONFIRMADO']],
  ['PRODUCT_SOURCE', 'ProdutoEncapsulado.java', 'ProdutoEncapsulado', ['Venda: true', 'Venda inativo: false', 'Estoque: 6', 'Ativo: true']],
  ['TEST_SOURCE', 'TesteEncapsulamento.java', 'TesteEncapsulamento', ['7 testes passaram']],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-111-'));
try {
  for (const [constant, file, main, outputs] of programs) {
    const dir = join(temp, constant.toLowerCase());
    mkdirSync(dir);
    writeFileSync(join(dir, file), extract(constant), 'utf8');
    execFileSync('javac', ['-encoding', 'UTF-8', file], { cwd: dir, stdio: 'pipe' });
    const output = execFileSync('java', ['-cp', dir, main], { cwd: dir, encoding: 'utf8' });
    for (const expected of outputs) expectText(output, expected, `${main}: ${expected}`);
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 111 validada: estrutura, sete fontes, invariantes, transições, API intencional e testes conferidos.');
