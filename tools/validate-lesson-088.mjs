import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedOfficialDocsLesson088.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedOfficialDocsLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/088_DOCUMENTACAO_OFICIAL.md', 'utf8');
const source = readFileSync('docs/aulas/088_M2_27_LEITURA_DE_DOCUMENTACAO_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), label + ': ' + needle);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedOfficialDocsLesson088 from './GuidedOfficialDocsLesson088';", 'importação dedicada');
expectText(viewer, "startsWith('088_')", 'rota dedicada');
expectText(component, 'guided-official-docs-lesson-088-progress', 'persistência');
expectText(component, 'saved.filter(id => validIds.has(id))', 'IDs filtrados');
expectText(component, 'completionNormalizedRef', 'normalização de conclusão');
expectText(component, "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", 'foco mobile');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora no roteiro');
expectText(component, 'disabled={!stepDone}', 'portão de etapa');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'portão de aula');
expectText(component, "stepDone ? 'undo' : 'complete'", 'concluir e desmarcar');
const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('export default function'));
assert.equal(count(steps, /\{ id: '/g), 9, 'nove etapas');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic'));
assert.equal(count(errors, /^  \['/gm), 10, 'dez diagnósticos');
const apis = component.slice(component.indexOf('const APIS = ['), component.indexOf('function ApiGalleryLab'));
assert.equal(count(apis, /^  \['/gm), 6, 'seis APIs');
const domains = component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function PracticeLab'));
assert.equal(count(domains, /\['(?:Cliente|Produto|Pedido|Pagamento|Ordem de serviço|Mensageria|Auditoria)'/g), 7, 'sete domínios');
expectText(component, 'guided-error-label', 'rótulo da clínica');
expectText(css, '.dc88-errors button>span:first-child', 'círculo restrito');
expectText(css, '.guided-official-docs-lesson{max-width:100%;overflow:visible}', 'raiz sem recorte');
expectText(css, '@media(max-width:380px)', 'responsividade 380');
expectText(css, '@media(max-width:320px)', 'responsividade 320');

for (const concept of ['JavaDoc', 'assinatura', 'parâmetros', 'retorno', 'Throws', 'Deprecated', 'Since', 'static', 'instância', 'overload', 'String.isBlank', 'String.substring', 'BigDecimal.compareTo', 'LocalDate.parse', 'Scanner.nextLine', 'Integer.parseInt', 'Math.max', 'StringBuilder.append', 'String.formatted', 'Quick Documentation']) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'conceito na fonte');
  const represented = concept.includes('.') ? concept.split('.').at(-1) : concept;
  expectText(component.toLowerCase(), represented.toLowerCase(), 'conceito na experiência');
}
for (const phrase of ['Todo conteúdo original foi preservado', 'doze provas', 'sete domínios', 'Aula 089']) expectText(matrix, phrase, 'matriz auditável');

function extractJoinedArray(name) {
  const marker = 'const ' + name + ' = [';
  const start = component.indexOf(marker);
  assert.ok(start >= 0, name + ' ausente');
  const end = component.indexOf("].join('\\n')", start);
  assert.ok(end >= 0, 'fim de ' + name + ' ausente');
  const body = component.slice(start + marker.length, end);
  const values = [];
  for (const match of body.matchAll(/'((?:\\.|[^'])*)'/g)) values.push(JSON.parse('"' + match[1].replaceAll('"', '\\"') + '"'));
  return values.join('\n');
}

const program = extractJoinedArray('MAIN_PROGRAM');
const expected = extractJoinedArray('EXPECTED_OUTPUT');
const temp = mkdtempSync(join(tmpdir(), 'lesson-088-'));
try {
  const file = join(temp, 'LaboratorioDocumentacao.java');
  writeFileSync(file, program, 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', file], { cwd: temp, stdio: 'pipe' });
  const output = execFileSync('java', ['-cp', temp, 'LaboratorioDocumentacao'], { cwd: temp, encoding: process.platform === 'win32' ? 'latin1' : 'utf8' });
  const normalize = value => value.replace(/\r\n/g, '\n').trimEnd();
  assert.equal(normalize(output), normalize(expected), 'saída Java divergente');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 088 validada: estrutura, contratos, responsividade e execução Java conferidos.');
