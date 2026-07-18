import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedJavaCoreLibraryLesson089.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedJavaCoreLibraryLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/089_MINI_PROJETO_JAVA_CORE.md', 'utf8');
const source = readFileSync('docs/aulas/089_M2_28_MINI_PROJETO_BIBLIOTECA_JAVA_CORE_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), label + ': ' + needle);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedJavaCoreLibraryLesson089 from './GuidedJavaCoreLibraryLesson089';", 'importação');
expectText(viewer, "startsWith('089_')", 'rota');
expectText(component, 'guided-java-core-library-lesson-089-progress', 'persistência');
expectText(component, 'saved.filter(id => validIds.has(id))', 'IDs filtrados');
expectText(component, 'completionNormalizedRef', 'normalização');
expectText(component, "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", 'foco mobile');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora');
expectText(component, 'disabled={!stepDone}', 'portão de etapa');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'portão curricular');
expectText(component, "stepDone ? 'undo' : 'complete'", 'concluir e desmarcar');
const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('export default function'));
assert.equal(count(steps, /\{ id: '/g), 9, 'nove etapas');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic'));
assert.equal(count(errors, /\['/g), 10, 'dez erros');
const review = component.slice(component.indexOf('const REVIEW = ['), component.indexOf('function IntegrationLab'));
assert.equal(count(review, /\['/g), 8, 'oito perguntas de revisão');
const asserts = component.slice(component.indexOf('const ASSERTS = ['), component.indexOf('function TestsLab'));
assert.equal(count(asserts, /\['/g), 4, 'quatro asserts');
expectText(component, 'guided-error-label', 'rótulo da clínica');
expectText(css, '.jc89-errors button>span:first-child', 'círculo restrito');
expectText(css, '.guided-java-core-library-lesson{max-width:100%;overflow:visible}', 'raiz sem recorte');
expectText(css, '@media(max-width:380px)', 'responsividade 380');
expectText(css, '@media(max-width:320px)', 'responsividade 320');

for (const concept of ['TextoUtils', 'DinheiroUtils', 'DataUtils', 'ResultadoValidacao', 'TipoNormalizacao', 'AssertManual', 'TesteBibliotecaJavaCore', 'BigDecimal', 'RoundingMode', 'compareTo', 'DateTimeFormatter', 'ChronoUnit', 'record', 'enum', 'IllegalArgumentException', 'Runnable', 'javac -d out', 'java -cp out', '.gitignore']) {
  expectText(source, concept, 'conceito na fonte');
  expectText(component, concept, 'conceito na experiência');
}
for (const phrase of ['Todo conteúdo original foi preservado', 'dezoito verificações', 'oito fontes', 'A Aula 090']) expectText(matrix, phrase, 'matriz');

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

const files = [
  ['src/br/com/formacao/core/ResultadoValidacao.java', 'RESULTADO_JAVA'],
  ['src/br/com/formacao/core/TipoNormalizacao.java', 'TIPO_JAVA'],
  ['src/br/com/formacao/core/TextoUtils.java', 'TEXTO_JAVA'],
  ['src/br/com/formacao/core/DinheiroUtils.java', 'DINHEIRO_JAVA'],
  ['src/br/com/formacao/core/DataUtils.java', 'DATA_JAVA'],
  ['src/br/com/formacao/teste/AssertManual.java', 'ASSERT_JAVA'],
  ['src/br/com/formacao/teste/TesteBibliotecaJavaCore.java', 'TESTE_JAVA'],
  ['src/br/com/formacao/app/Main.java', 'MAIN_JAVA'],
];
const expectedMain = extractJoinedArray('EXPECTED_MAIN');
const temp = mkdtempSync(join(tmpdir(), 'lesson-089-'));
try {
  const paths = files.map(([relative, constant]) => {
    const path = join(temp, relative);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, extractJoinedArray(constant), 'utf8');
    return path;
  });
  const out = join(temp, 'out');
  mkdirSync(out);
  execFileSync('javac', ['-encoding', 'UTF-8', '-d', out, ...paths], { cwd: temp, stdio: 'pipe' });
  const encoding = process.platform === 'win32' ? 'latin1' : 'utf8';
  const mainOutput = execFileSync('java', ['-cp', out, 'br.com.formacao.app.Main'], { cwd: temp, encoding });
  const testOutput = execFileSync('java', ['-cp', out, 'br.com.formacao.teste.TesteBibliotecaJavaCore'], { cwd: temp, encoding });
  const normalize = value => value.replace(/\r\n/g, '\n').trimEnd();
  assert.equal(normalize(mainOutput), normalize(expectedMain), 'saída do Main divergente');
  assert.equal(normalize(testOutput), 'Todos os testes manuais passaram.', 'suíte manual divergente');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 089 validada: estrutura, oito fontes, aplicação e suíte manual conferidos.');
