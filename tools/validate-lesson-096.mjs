import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedDisplayMethodsLesson096.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedDisplayMethodsLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/096_METODOS_DE_EXIBICAO.md', 'utf8');
const source = readFileSync('docs/aulas/096_M3_07_METODOS_DE_EXIBICAO_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedDisplayMethodsLesson096 from './GuidedDisplayMethodsLesson096';", 'import');
expectText(viewer, "startsWith('096_')", 'rota');
for (const needle of [
  'guided-display-methods-lesson-096-progress',
  'saved.filter(id => validIds.has(id))',
  'completionNormalizedRef',
  "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })",
  "document.querySelector('.guided-layout')?.scrollIntoView",
  'disabled={!stepDone}',
  'disabled={!hasNextLesson || !lessonComplete}',
  "stepDone ? 'undo' : 'complete'",
]) expectText(component, needle, 'estrutura');

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal(count(steps, /{ id: '/g), 9, 'etapas');
for (const [start, end, total, label] of [
  ['const ERRORS = [', 'const RESPONSIBILITIES', 8, 'erros'],
  ['const RESPONSIBILITIES = [', 'function CopyButton', 3, 'fronteiras'],
]) {
  const part = component.slice(component.indexOf(start), component.indexOf(end));
  assert.equal(count(part, /^  \['/gm), total, label);
}

expectText(component, 'guided-error-label', 'clínica');
expectText(css, '.dm96-errors button>span:first-child', 'círculo');
expectText(css, '.guided-display-methods-lesson{max-width:100%;overflow:visible}', 'raiz');
for (const width of ['900', '680', '520', '380', '320']) expectText(css, `@media(max-width:${width}px)`, `breakpoint ${width}`);
for (const concept of [
  'exibição', 'void', 'Text Block', 'System.out.println', 'ConsoleView',
  'construtor privado', 'Scanner', 'NullPointer', 'Spring Boot', 'Step Over',
  'F8', 'record', 'static', 'sucesso', 'erro', 'OrdemServico',
]) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
for (const phrase of ['O aluno compila seis fontes', 'Seis fontes Java completas', 'A Aula 097']) expectText(matrix, phrase, 'matriz');

function extract(name) {
  const marker = `const ${name} = [`;
  const start = component.indexOf(marker);
  assert.ok(start >= 0, name);
  const end = component.indexOf("].join('\\n')", start);
  assert.ok(end >= 0, `${name} fim`);
  const values = [];
  for (const match of component.slice(start + marker.length, end).matchAll(/'((?:\\.|[^'])*)'/g)) {
    values.push(JSON.parse(`"${match[1].replaceAll('"', '\\"')}"`));
  }
  return values.join('\n');
}

const files = [
  ['ExibicaoBasica.java', 'BASIC'],
  ['MenuComTextBlock.java', 'MENU'],
  ['ResumoPedidoConsole.java', 'SUMMARY'],
  ['ConsoleView.java', 'VIEW'],
  ['TesteConsoleView.java', 'VIEW_TEST'],
  ['OrdemServicoExibicao.java', 'SERVICE_ORDER'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-096-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = className => execFileSync('java', [className], { cwd: temp, encoding: process.platform === 'win32' ? 'latin1' : 'utf8' })
    .replace(/\r\n/g, '\n').trimEnd();
  const basic = run('ExibicaoBasica');
  assert.ok(basic.includes('Sistema de Pedidos\n====================================\nBem-vindo ao sistema.'), 'exibição básica');
  assert.ok(basic.endsWith('Fim da execuÃ§Ã£o.') || basic.endsWith('Fim da execução.'), 'fim da exibição básica');
  const menu = run('MenuComTextBlock');
  assert.ok(menu.startsWith('====================================\nMENU PRINCIPAL'), 'menu alinhado');
  assert.ok(menu.endsWith('Escolha uma opÃ§Ã£o:') || menu.endsWith('Escolha uma opção:'), 'prompt do menu');
  const summary = run('ResumoPedidoConsole');
  assert.ok(summary.includes('Cliente:      Ana Silva'), 'cliente do resumo');
  assert.ok(summary.includes('Total Final:  R$ 4500.00'), 'total final do resumo');
  const viewTest = run('TesteConsoleView');
  assert.ok(viewTest.includes('[SUCESSO] OperaÃ§Ã£o executada') || viewTest.includes('[SUCESSO] Operação executada'), 'sucesso prefixado');
  assert.ok(viewTest.includes('[ERRO] Falha catastrÃ³fica') || viewTest.includes('[ERRO] Falha catastrófica'), 'erro prefixado');
  const serviceOrder = run('OrdemServicoExibicao');
  assert.ok(serviceOrder.includes('ID:        OS-1042'), 'OS preenchida');
  assert.ok(serviceOrder.includes('R$ 350,00') || serviceOrder.includes('R$ 350.00'), 'preço da OS');
  assert.ok(serviceOrder.includes('[ERRO] A ordem de serviÃ§o nÃ£o existe.') || serviceOrder.includes('[ERRO] A ordem de serviço não existe.'), 'OS nula');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 096 validada: estrutura, seis fontes e cinco execuções conferidas.');
