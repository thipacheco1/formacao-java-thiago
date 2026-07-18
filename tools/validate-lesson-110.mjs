import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('plataforma-curso/src/components/GuidedConstructorsLesson110.jsx', root), 'utf8');
const css = readFileSync(new URL('plataforma-curso/src/components/guidedConstructorsLesson.css', root), 'utf8');
const viewer = readFileSync(new URL('plataforma-curso/src/components/MarkdownViewer.jsx', root), 'utf8');
const source = readFileSync(new URL('docs/aulas/110_M4_06_CONSTRUTOR_PADRAO_E_PARAMETRIZADO_OFICIAL.md', root), 'utf8');
const matrix = readFileSync(new URL('docs/revisao-aulas/matrizes/110_CONSTRUTOR_PADRAO_E_PARAMETRIZADO.md', root), 'utf8');
const expectText = (text, needle, label = needle) => assert.ok(text.includes(needle), label);

expectText(viewer, "import GuidedConstructorsLesson110 from './GuidedConstructorsLesson110';", 'importação 110');
expectText(viewer, "startsWith('110_')", 'rota 110');
expectText(viewer, '<GuidedConstructorsLesson110 {...props} />', 'renderização 110');
expectText(component, 'guided-constructors-lesson-110-progress', 'progresso exclusivo');
expectText(component, 'saved.filter(id => validIds.has(id))', 'normalização');
expectText(component, "block: 'nearest', inline: 'center'", 'foco móvel');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora');
expectText(component, 'disabled={!stepDone}', 'portão de etapa');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'portão da aula 111');
expectText(component, 'guided-error-label', 'clínica legível');
assert.equal((component.match(/id: '/g) || []).length, 11, 'onze etapas');
assert.equal((component.match(/\['Tratar construtor como método comum'|\['Esquecer que new chama construtor'|\['Padrão sem pensar'|\['Obrigatórios sem validação'|\['Trabalho pesado no construtor'|\['Confundir atributo e parâmetro'|\['Sobrecarga excessiva'|\['Padrão escondido'/g) || []).length, 8, 'oito diagnósticos');
expectText(css, '.guided-constructors-lesson{max-width:100%;overflow:visible}', 'raiz responsiva');
expectText(css, '.ct110-errors button>span:first-child', 'círculo restrito');
for (const bp of ['680px', '520px', '380px', '320px']) expectText(css, bp, `breakpoint ${bp}`);

for (const concept of ['construtor padrão', 'construtor parametrizado', 'new', 'atributo e parâmetro', 'this', 'IllegalArgumentException', 'invariantes', 'sobrecarga', 'this(...)', 'valor padrão', 'trabalho pesado', 'Pagamento']) {
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
  ['CLIENT_SOURCE', 'ClienteConstrutorParametrizado.java', 'ClienteConstrutorParametrizado', ['Nome: Ana Silva', 'Ativo: true', 'Pode receber mensagem: true']],
  ['DEFAULT_SOURCE', 'ProdutoConstrutorPadrao.java', 'ProdutoConstrutorPadrao', ['Produto criado.', 'Nome: Produto sem nome', 'Ativo: true']],
  ['ORDER_PARAM_SOURCE', 'PedidoConstrutorParametrizado.java', 'PedidoConstrutorParametrizado', ['Cliente: Ana Silva', 'Total bruto: 399.80', 'Total final: 359.8200']],
  ['ORDER_VALID_SOURCE', 'PedidoConstrutorComValidacao.java', 'PedidoConstrutorComValidacao', ['Pedido criado.', 'Total final: 359.8200', 'Falha esperada:']],
  ['OVERLOAD_SOURCE', 'ClienteConstrutoresSobrecarregados.java', 'ClienteConstrutoresSobrecarregados', ['Nome: Ana Silva', 'Nome: Carlos Souza', 'Pode receber mensagem: false', 'Pode receber mensagem: true']],
  ['OS_SOURCE', 'OrdemServicoConstrutor.java', 'OrdemServicoConstrutor', ['Certificado: OS-001', 'Dias em aberto: 4', 'Fila: CASOS_CRITICOS']],
  ['PAYMENT_SOURCE', 'PagamentoConstrutor.java', 'PagamentoConstrutor', ['PAG-001 | PIX | R$ 150.00', 'Pode confirmar: true', 'Falha esperada:']],
  ['TEST_SOURCE', 'TesteConstrutores.java', 'TesteConstrutores', ['7 testes passaram']],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-110-'));
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

console.log('Aula 110 validada: estrutura, oito fontes, construtores, invariantes, sobrecarga e testes conferidos.');
