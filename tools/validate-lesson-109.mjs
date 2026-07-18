import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('plataforma-curso/src/components/GuidedBehaviorMethodsLesson109.jsx', root), 'utf8');
const css = readFileSync(new URL('plataforma-curso/src/components/guidedBehaviorMethodsLesson.css', root), 'utf8');
const viewer = readFileSync(new URL('plataforma-curso/src/components/MarkdownViewer.jsx', root), 'utf8');
const source = readFileSync(new URL('docs/aulas/109_M4_05_METODOS_DE_COMPORTAMENTO_OFICIAL.md', root), 'utf8');
const matrix = readFileSync(new URL('docs/revisao-aulas/matrizes/109_METODOS_DE_COMPORTAMENTO.md', root), 'utf8');
const expectText = (text, needle, label = needle) => assert.ok(text.includes(needle), label);

expectText(viewer, "import GuidedBehaviorMethodsLesson109 from './GuidedBehaviorMethodsLesson109';", 'importação 109');
expectText(viewer, "startsWith('109_')", 'rota 109');
expectText(viewer, '<GuidedBehaviorMethodsLesson109 {...props} />', 'renderização 109');
expectText(component, 'guided-behavior-methods-lesson-109-progress', 'progresso exclusivo');
expectText(component, 'saved.filter(id => validIds.has(id))', 'normalização');
expectText(component, "block: 'nearest', inline: 'center'", 'foco móvel');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora');
expectText(component, 'disabled={!stepDone}', 'portão de etapa');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'portão da aula 110');
expectText(component, 'guided-error-label', 'clínica legível');
assert.equal((component.match(/id: '/g) || []).length, 11, 'onze etapas');
assert.equal((component.match(/\['Classe só com getters'|\['Regra espalhada fora'|\['Infraestrutura no domínio'|\['Nome genérico'|\['Método grande demais'|\['Static usa estado do objeto'|\['Regra ruim apenas escondida'|\['Cadeia difícil de seguir'/g) || []).length, 8, 'oito diagnósticos');
expectText(css, '.guided-behavior-methods-lesson{max-width:100%;overflow:visible}', 'raiz responsiva');
expectText(css, '.bm109-errors button>span:first-child', 'círculo restrito');
for (const bp of ['900px', '680px', '520px', '380px', '320px']) expectText(css, bp, `breakpoint ${bp}`);

for (const concept of ['método de acesso', 'método de comportamento', 'objeto anêmico', 'estado do objeto', 'linguagem do domínio', 'infraestrutura', 'static', 'boolean', 'totalFinal', 'filaSugerida', 'Produto']) {
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
  ['ANEMIC_SOURCE', 'PedidoAnemico.java', 'PedidoAnemico', ['Cliente: Ana', 'Total calculado fora: 399.80']],
  ['ORDER_SOURCE', 'PedidoComComportamento.java', 'PedidoComComportamento', ['Total bruto: 399.80', 'Desconto: 39.9800', 'Total final: 359.8200', 'Pedido com desconto: true']],
  ['OS_SOURCE', 'OrdemServicoComComportamento.java', 'OrdemServicoComComportamento', ['Dias em aberto: 6', 'Encerrada: false', 'Atrasada: true', 'Fila sugerida: CASOS_CRITICOS']],
  ['PAYMENT_SOURCE', 'PagamentoComComportamento.java', 'PagamentoComComportamento', ['PAG-001', 'PAG-002', 'Pode confirmar: true', 'Pode confirmar: false']],
  ['PRODUCT_SOURCE', 'ProdutoComComportamento.java', 'ProdutoComComportamento', ['PRD-1 | Cadeira', 'PRD-2', 'Tem estoque: true', 'Tem estoque: false', 'Valor em estoque: 3999.20']],
  ['TEST_SOURCE', 'TesteMetodosComportamento.java', 'TesteMetodosComportamento', ['7 testes passaram']],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-109-'));
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

console.log('Aula 109 validada: estrutura, seis fontes, comportamento, fronteiras, composição e testes conferidos.');
