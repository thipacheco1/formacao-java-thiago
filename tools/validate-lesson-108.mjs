import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('plataforma-curso/src/components/GuidedMeaningfulAttributesLesson108.jsx', root), 'utf8');
const css = readFileSync(new URL('plataforma-curso/src/components/guidedMeaningfulAttributesLesson.css', root), 'utf8');
const viewer = readFileSync(new URL('plataforma-curso/src/components/MarkdownViewer.jsx', root), 'utf8');
const source = readFileSync(new URL('docs/aulas/108_M4_04_ATRIBUTOS_COM_SIGNIFICADO_OFICIAL.md', root), 'utf8');
const matrix = readFileSync(new URL('docs/revisao-aulas/matrizes/108_ATRIBUTOS_COM_SIGNIFICADO.md', root), 'utf8');
const expectText = (text, needle, label = needle) => assert.ok(text.includes(needle), label);

expectText(viewer, "import GuidedMeaningfulAttributesLesson108 from './GuidedMeaningfulAttributesLesson108';", 'importação 108');
expectText(viewer, "startsWith('108_')", 'rota 108');
expectText(viewer, '<GuidedMeaningfulAttributesLesson108 {...props} />', 'renderização 108');
expectText(component, 'guided-meaningful-attributes-lesson-108-progress', 'progresso exclusivo');
expectText(component, 'saved.filter(id => validIds.has(id))', 'normalização do progresso');
expectText(component, "block: 'nearest', inline: 'center'", 'foco móvel');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora do roteiro');
expectText(component, 'disabled={!stepDone}', 'portão entre etapas');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'portão da aula 109');
expectText(component, 'guided-error-label', 'rótulo da clínica');
assert.equal((component.match(/id: '/g) || []).length, 11, 'onze etapas');
assert.equal((component.match(/\['Nome genérico'|\['Dado calculado armazenado'|\['String para tudo'|\['Atributo não pertence ao objeto'|\['Obrigatório ignorado'|\['Classe inchada'|\['Boolean ambíguo'|\['Nome sem contexto suficiente'/g) || []).length, 8, 'oito erros');
expectText(css, '.guided-meaningful-attributes-lesson{max-width:100%;overflow:visible}', 'raiz sem recorte');
expectText(css, '.ma108-errors button>span:first-child', 'círculo restrito da clínica');
for (const bp of ['680px', '520px', '380px', '320px']) expectText(css, bp, `breakpoint ${bp}`);

for (const concept of ['atributo', 'significado', 'dado calculado', 'estado mínimo', 'enum', 'LocalDate', 'BigDecimal', 'obrigatórios', 'invariante', 'boolean', 'classe inchada', 'Produto']) {
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
  ['BAD_SOURCE', 'ClienteAtributosRuins.java', 'ClienteAtributosRuins', ['Ana Silva', 'ana@email.com', 'true']],
  ['GOOD_SOURCE', 'ClienteAtributosBons.java', 'ClienteAtributosBons', ['Nome: Ana Silva', 'Contato completo: true', 'Pode receber mensagem: true']],
  ['ORDER_SOURCE', 'PedidoEstadoMinimo.java', 'PedidoEstadoMinimo', ['Quantidade: 2', 'Total calculado: 200.00']],
  ['OS_SOURCE', 'OrdemServicoAtributos.java', 'OrdemServicoAtributos', ['Dias em aberto: 4', 'Atrasada: true', 'Fila: CASOS_CRITICOS']],
  ['PAYMENT_SOURCE', 'PagamentoAtributos.java', 'PagamentoAtributos', ['PAG-001', 'Forma: PIX', 'Pode confirmar: true']],
  ['PRODUCT_SOURCE', 'ProdutoAtributos.java', 'ProdutoAtributos', ['PRD-1 | Cadeira | MOVEL', 'PRD-2', 'Tem estoque: true', 'Tem estoque: false']],
  ['TEST_SOURCE', 'TesteAtributosSignificativos.java', 'TesteAtributosSignificativos', ['7 testes passaram']],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-108-'));
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

console.log('Aula 108 validada: estrutura, sete fontes, estado mínimo, tipos, invariantes e testes conferidos.');
