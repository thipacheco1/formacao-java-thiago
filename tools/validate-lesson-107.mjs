import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('plataforma-curso/src/components/GuidedClassObjectLesson107.jsx', root), 'utf8');
const css = readFileSync(new URL('plataforma-curso/src/components/guidedClassObjectLesson.css', root), 'utf8');
const viewer = readFileSync(new URL('plataforma-curso/src/components/MarkdownViewer.jsx', root), 'utf8');
const source = readFileSync(new URL('docs/aulas/107_M4_03_CLASSE_E_OBJETO_EM_JAVA_OFICIAL.md', root), 'utf8');
const matrix = readFileSync(new URL('docs/revisao-aulas/matrizes/107_CLASSE_E_OBJETO_EM_JAVA.md', root), 'utf8');

const expectText = (text, needle, label = needle) => assert.ok(text.includes(needle), label);

expectText(viewer, "import GuidedClassObjectLesson107 from './GuidedClassObjectLesson107';", 'importação da aula 107');
expectText(viewer, "startsWith('107_')", 'rota da aula 107');
expectText(viewer, '<GuidedClassObjectLesson107 {...props} />', 'renderização da aula 107');
expectText(component, "guided-class-object-lesson-107-progress", 'chave de progresso exclusiva');
expectText(component, "saved.filter(id => validIds.has(id))", 'normalização do progresso salvo');
expectText(component, "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", 'foco móvel da etapa ativa');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora do roteiro');
expectText(component, "disabled={!hasNextLesson || !lessonComplete}", 'bloqueio da aula seguinte');
expectText(component, "disabled={!stepDone}", 'bloqueio da próxima etapa');
expectText(component, 'Clínica de Erros', 'clínica distinta');
expectText(component, 'Entrega & Pagamento', 'entrega distinta');
expectText(component, 'guided-error-label', 'rótulo íntegro da clínica');
assert.equal((component.match(/id: '/g) || []).length, 11, 'a aula deve ter onze etapas');
assert.equal((component.match(/\['Confundir classe e objeto'|\['Ignorar o efeito de new'|\['Construtor não inicializa estado'|\['Classe sem comportamento'|\['Responsabilidade estrangeira'|\['Atributos públicos'|\['Static para tudo'|\['Referência confundida com objeto'/g) || []).length, 8, 'oito diagnósticos');
for (const breakpoint of ['900px', '680px', '520px', '380px', '320px']) expectText(css, breakpoint, `breakpoint ${breakpoint}`);
expectText(css, '.guided-class-object-lesson{max-width:100%;overflow:visible}', 'raiz responsiva sem recorte');
expectText(css, '.co107-errors button>span:first-child', 'círculo restrito da clínica');

for (const concept of ['classe', 'objeto', 'new', 'instância', 'atributos', 'métodos', 'construtor', 'this', 'private', 'final', 'static', 'encapsulamento', 'variável local', 'Pagamento']) {
  assert.ok(source.toLocaleLowerCase('pt-BR').includes(concept.toLocaleLowerCase('pt-BR')), `fonte: ${concept}`);
  assert.ok(component.toLocaleLowerCase('pt-BR').includes(concept.toLocaleLowerCase('pt-BR')), `experiência: ${concept}`);
  assert.ok(matrix.toLocaleLowerCase('pt-BR').includes(concept.toLocaleLowerCase('pt-BR')), `matriz: ${concept}`);
}

function extract(name) {
  const marker = `const ${name} = ` + '`';
  const start = component.indexOf(marker);
  assert.notEqual(start, -1, `fonte ${name}`);
  const contentStart = start + marker.length;
  const end = component.indexOf('`;', contentStart);
  assert.notEqual(end, -1, `fim da fonte ${name}`);
  return component.slice(contentStart, end);
}

const programs = [
  ['CLIENT_SOURCE', 'ClientePrimeiroObjeto.java', 'ClientePrimeiroObjeto', ['Nome: Ana Silva', 'Contato completo: true', 'Pode receber mensagem: true']],
  ['TWO_CLIENTS_SOURCE', 'DoisClientes.java', 'DoisClientes', ['Nome: Ana Silva', 'Nome: Carlos Souza', 'Contato completo: false', 'Pode receber mensagem: false']],
  ['OS_SOURCE', 'OrdemServicoObjeto.java', 'OrdemServicoObjeto', ['Dias em aberto: 6', 'Atrasada: true', 'Encerrada: false', 'Fila: CASOS_CRITICOS']],
  ['ORDER_SOURCE', 'PedidoObjeto.java', 'PedidoObjeto', ['Cliente: Ana Silva', 'Total bruto: 399.80', 'Desconto: 39.9800', 'Total final: 359.8200']],
  ['PAYMENT_SOURCE', 'PagamentoObjeto.java', 'PagamentoObjeto', ['PAG-001 | PIX | R$ 250.00', 'PAG-002 | BOLETO | R$ -10.00', 'Pode confirmar: true', 'Pode confirmar: false']],
  ['TEST_SOURCE', 'TesteClasseObjeto.java', 'TesteClasseObjeto', ['7 testes passaram']],
];

const temp = mkdtempSync(join(tmpdir(), 'lesson-107-'));
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

console.log('Aula 107 validada: estrutura, seis fontes, objetos independentes, regras e testes conferidos.');
