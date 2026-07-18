import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedJavaPackagesLesson087.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedJavaPackagesLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/087_ORGANIZACAO_PACOTES.md', 'utf8');
const source = readFileSync('docs/aulas/087_M2_26_ORGANIZACAO_DE_PACOTES_DESDE_CEDO_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), label + ': ' + needle);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedJavaPackagesLesson087 from './GuidedJavaPackagesLesson087';", 'importação dedicada');
expectText(viewer, "startsWith('087_')", 'rota dedicada');
expectText(component, 'guided-java-packages-lesson-087-progress', 'persistência');
expectText(component, 'saved.filter(id => validIds.has(id))', 'IDs antigos filtrados');
expectText(component, 'completionNormalizedRef', 'normalização de conclusão antiga');
expectText(component, "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", 'foco mobile');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora no roteiro');
expectText(component, 'disabled={!stepDone}', 'portão de etapa');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'portão curricular');
expectText(component, "stepDone ? 'undo' : 'complete'", 'concluir e desmarcar');
const stepSection = component.slice(component.indexOf('const steps = ['), component.indexOf('export default function'));
assert.equal(count(stepSection, /\{ id: '/g), 9, 'nove etapas');
const errorSection = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic'));
assert.equal(count(errorSection, /^  \['/gm), 10, 'dez casos da clínica');
const packageSection = component.slice(component.indexOf('const PACKAGES = ['), component.indexOf('function ResponsibilityLab'));
assert.equal(count(packageSection, /^  \['/gm), 4, 'quatro pacotes iniciais');
const importSection = component.slice(component.indexOf('const IMPORT_CASES = ['), component.indexOf('function ImportLab'));
assert.equal(count(importSection, /^  \['/gm), 5, 'cinco casos de import');
expectText(component, 'guided-error-label', 'rótulo da clínica');
expectText(css, '.pk87-errors button>span:first-child', 'círculo numérico restrito');
expectText(css, '.guided-java-packages-lesson{max-width:100%;overflow:visible}', 'raiz sem recorte');
expectText(css, '@media(max-width:380px)', 'responsividade 380');
expectText(css, '@media(max-width:320px)', 'responsividade 320');

for (const concept of ['package', 'import', 'default package', 'br.com.formacao.app', 'br.com.formacao.dominio', 'br.com.formacao.console', 'br.com.formacao.util', 'javac -d out', 'java -cp out', 'java.util.*', 'static import', 'IntelliJ', 'Cliente', 'Produto', 'Pedido', 'Pagamento', 'OrdemServico', 'Mensagem', 'RegistroAuditoria']) {
  expectText(source, concept, 'conceito na fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'conceito na experiência');
}
for (const phrase of ['Todo conteúdo original foi preservado', 'oito arquivos reais', 'dez casos íntegros', 'Aula 088']) expectText(matrix, phrase, 'matriz auditável');

function extractJoinedArray(name) {
  const startMarker = 'const ' + name + ' = [';
  const start = component.indexOf(startMarker);
  assert.ok(start >= 0, name + ' ausente');
  const end = component.indexOf("].join('\\n')", start);
  assert.ok(end >= 0, 'fim de ' + name + ' ausente');
  const body = component.slice(start + startMarker.length, end);
  const values = [];
  for (const match of body.matchAll(/'((?:\\.|[^'])*)'/g)) values.push(JSON.parse('"' + match[1].replaceAll('"', '\\"') + '"'));
  return values.join('\n');
}

const sources = [
  ['src/br/com/formacao/app/Main.java', 'MAIN_JAVA'],
  ['src/br/com/formacao/dominio/Cliente.java', 'CLIENTE_JAVA'],
  ['src/br/com/formacao/dominio/Produto.java', 'PRODUTO_JAVA'],
  ['src/br/com/formacao/dominio/Pedido.java', 'PEDIDO_JAVA'],
  ['src/br/com/formacao/dominio/FormaPagamento.java', 'FORMA_JAVA'],
  ['src/br/com/formacao/dominio/Pagamento.java', 'PAGAMENTO_JAVA'],
  ['src/br/com/formacao/util/TextoUtils.java', 'TEXTO_JAVA'],
  ['src/br/com/formacao/console/ConsoleInput.java', 'CONSOLE_JAVA'],
];
const expected = extractJoinedArray('EXPECTED_OUTPUT');
const temp = mkdtempSync(join(tmpdir(), 'lesson-087-'));
try {
  const sourcePaths = sources.map(([relative, constant]) => {
    const path = join(temp, relative);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, extractJoinedArray(constant), 'utf8');
    return path;
  });
  const out = join(temp, 'out');
  mkdirSync(out);
  execFileSync('javac', ['-encoding', 'UTF-8', '-d', out, ...sourcePaths], { cwd: temp, stdio: 'pipe' });
  const output = execFileSync('java', ['-cp', out, 'br.com.formacao.app.Main'], { cwd: temp, encoding: process.platform === 'win32' ? 'latin1' : 'utf8' });
  const normalize = value => value.replace(/\r\n/g, '\n').trimEnd();
  assert.equal(normalize(output), normalize(expected), 'saída multiarquivo divergente');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 087 validada: estrutura, pacotes, responsividade e execução multiarquivo conferidos.');
