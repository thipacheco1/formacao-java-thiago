import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const componentPath = 'plataforma-curso/src/components/GuidedRobustConsoleLesson086.jsx';
const cssPath = 'plataforma-curso/src/components/guidedRobustConsoleLesson.css';
const viewerPath = 'plataforma-curso/src/components/MarkdownViewer.jsx';
const matrixPath = 'docs/revisao-aulas/matrizes/086_CONSOLE_ROBUSTO.md';
const sourcePath = 'docs/aulas/086_M2_25_ENTRADA_SAIDA_BASICA_COM_CONSOLE_ROBUSTO_OFICIAL.md';

const component = readFileSync(componentPath, 'utf8');
const css = readFileSync(cssPath, 'utf8');
const viewer = readFileSync(viewerPath, 'utf8');
const matrix = readFileSync(matrixPath, 'utf8');
const source = readFileSync(sourcePath, 'utf8');

const expectText = (text, needle, label) => assert.ok(text.includes(needle), label + ': ' + needle);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedRobustConsoleLesson086 from './GuidedRobustConsoleLesson086';", 'importação dedicada');
expectText(viewer, "startsWith('086_')", 'rota dedicada');
expectText(component, "guided-robust-console-lesson-086-progress", 'persistência');
expectText(component, 'saved.filter(id => validIds.has(id))', 'IDs antigos filtrados');
expectText(component, 'completionNormalizedRef', 'normalização de conclusão antiga');
expectText(component, "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", 'foco do roteiro mobile');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora no roteiro');
expectText(component, 'disabled={!stepDone}', 'bloqueio da próxima etapa');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'bloqueio da próxima aula');
expectText(component, "stepDone ? 'undo' : 'complete'", 'concluir e desmarcar etapa');
assert.equal(count(component, /\{ id: '/g), 9, 'a aula deve ter nove etapas');
const errorsSection = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic'));
assert.equal(count(errorsSection, /^  \['[^\n]+', '[^\n]+', '[^\n]+'\],?$/gm), 10, 'a clínica deve ter dez casos');
const domainsSection = component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function ReuseLab'));
assert.equal(count(domainsSection, /\['(?:Cliente|Produto|Pedido|Pagamento|Ordem de serviço|Mensageria|Auditoria)'/g), 7, 'a galeria deve ter sete domínios');
expectText(component, 'guided-error-label', 'rótulo íntegro da clínica');
expectText(css, '.co86-errors button>span:first-child', 'círculo numérico restrito');
expectText(css, '@media(max-width:380px)', 'responsividade 380 px');
expectText(css, '@media(max-width:320px)', 'responsividade 320 px');
expectText(css, '.guided-robust-console-lesson{max-width:100%;overflow:visible}', 'raiz sem recorte');

for (const concept of ['System.out.print', 'System.out.println', 'nextInt', 'nextLine', 'trim', 'strip', 'isBlank', 'NumberFormatException', 'BigDecimal', 'LocalDate', 'Scanner', 'cliente', 'produto', 'pedido', 'pagamento', 'mensageria', 'auditoria']) {
  expectText(source, concept, 'conceito preservado na fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'conceito representado na experiência');
}
for (const phrase of ['nove etapas', 'dez erros', 'sete aplicações', 'compilação real']) expectText(matrix.toLowerCase(), phrase, 'matriz auditável');

function extractJoinedArray(name) {
  const start = component.indexOf('const ' + name + ' = [');
  assert.ok(start >= 0, name + ' não encontrado');
  const end = component.indexOf("].join('\\n');", start);
  assert.ok(end >= 0, 'fim de ' + name + ' não encontrado');
  const body = component.slice(start + ('const ' + name + ' = [').length, end);
  const values = [];
  for (const match of body.matchAll(/^\s*'((?:\\.|[^'])*)',?\s*$/gm)) values.push(JSON.parse('"' + match[1].replaceAll('"', '\\"') + '"'));
  return values.join('\n');
}

const java = extractJoinedArray('MAIN_PROGRAM');
const expected = extractJoinedArray('EXPECTED_OUTPUT');
const temp = mkdtempSync(join(tmpdir(), 'lesson-086-'));
try {
  const javaPath = join(temp, 'CadastroConsole.java');
  writeFileSync(javaPath, java, 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', javaPath], { cwd: temp, stdio: 'pipe' });
  const output = execFileSync('java', ['-cp', temp, 'CadastroConsole'], { cwd: temp, encoding: process.platform === 'win32' ? 'latin1' : 'utf8' });
  const normalize = value => value.replace(/\r\n/g, '\n').trimEnd();
  assert.equal(normalize(output), normalize(expected), 'saída Java deve coincidir exatamente');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 086 validada: estrutura, conteúdo, responsividade e execução Java conferidos.');
