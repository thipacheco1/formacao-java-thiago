import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('plataforma-curso/src/components/GuidedGettersSettersLesson112.jsx', root), 'utf8');
const css = readFileSync(new URL('plataforma-curso/src/components/guidedGettersSettersLesson.css', root), 'utf8');
const viewer = readFileSync(new URL('plataforma-curso/src/components/MarkdownViewer.jsx', root), 'utf8');
const source = readFileSync(new URL('docs/aulas/112_M4_08_GETTERS_SETTERS_E_CRITERIO_OFICIAL.md', root), 'utf8');
const matrix = readFileSync(new URL('docs/revisao-aulas/matrizes/112_GETTERS_SETTERS_E_CRITERIO.md', root), 'utf8');
const expectText = (text, needle, label = needle) => assert.ok(text.includes(needle), label);

expectText(viewer, "import GuidedGettersSettersLesson112 from './GuidedGettersSettersLesson112';", 'importação 112');
expectText(viewer, "startsWith('112_')", 'rota 112');
expectText(viewer, '<GuidedGettersSettersLesson112 {...props} />', 'renderização 112');
expectText(component, 'guided-getters-setters-lesson-112-progress', 'progresso exclusivo');
expectText(component, 'saved.filter(id => validIds.has(id))', 'normalização do progresso');
expectText(component, "block: 'nearest', inline: 'center'", 'foco móvel');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora do roteiro');
expectText(component, 'disabled={!stepDone}', 'portão da etapa');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'portão da aula 113');
expectText(component, 'guided-error-label', 'clínica legível');
assert.equal((component.match(/id: '/g) || []).length, 11, 'onze etapas');
const errorsBlock = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errorsBlock.match(/^  \['/gm) || []).length, 8, 'oito diagnósticos');
expectText(css, '.guided-getters-setters-lesson', 'raiz responsiva');
expectText(css, 'max-width: 100%', 'largura fluida');
expectText(css, '.gs112-errors button > span:first-child', 'círculo restrito da clínica');
for (const bp of ['900px', '680px', '520px', '380px', '320px']) expectText(css, bp, `breakpoint ${bp}`);

for (const concept of ['getter', 'setter', 'JavaBean', 'domínio', 'DTO', 'setStatus', 'alterarEmail', 'coleção', 'Produto', 'OrdemServico']) {
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
  ['BAD_PAYMENT_SOURCE', 'PagamentoComSettersLivres.java', 'PagamentoComSettersLivres', ['Inicial: PAG-001 | 150.00 | PENDENTE', 'Indevido: PAG-001 | -500.00 | CONFIRMADO']],
  ['GOOD_PAYMENT_SOURCE', 'PagamentoComCriterio.java', 'PagamentoComCriterio', ['PAG-001 | 150.00 | PENDENTE', 'APROVADO', 'CONFIRMADO', 'Falha esperada:']],
  ['CLIENT_SOURCE', 'ClienteGetSetComCriterio.java', 'ClienteGetSetComCriterio', ['Ana Silva', 'ana.novo@email.com', 'false', 'Reativado: true']],
  ['PRODUCT_SOURCE', 'ProdutoSemSettersLivres.java', 'ProdutoSemSettersLivres', ['Venda: true', 'Venda inativo: false', 'Estoque: 12', 'Ativo: false']],
  ['DTO_SOURCE', 'DtoVersusDominio.java', 'DtoVersusDominio', ['DTO recebido: Ana Silva', 'Ana Silva | ana@email.com', 'Falha esperada:']],
  ['OS_SOURCE', 'OrdemServicoSemSettersLivres.java', 'OrdemServicoSemSettersLivres', ['REAGENDADA', 'CONCLUIDA', 'Reagendamentos: 1', 'Falha esperada:', 'Motivo recusado:']],
  ['TEST_SOURCE', 'TesteGettersSettersCriterio.java', 'TesteGettersSettersCriterio', ['7 testes passaram']],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-112-'));
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

console.log('Aula 112 validada: estrutura, sete fontes, critérios de acesso, DTO, domínio, transições e testes conferidos.');
