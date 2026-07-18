import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedSmallMethodsLesson090.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedSmallMethodsLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/090_MAIN_GIGANTE_METODOS_PEQUENOS.md', 'utf8');
const source = readFileSync('docs/aulas/090_M3_01_DE_MAIN_GIGANTE_PARA_METODOS_PEQUENOS_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), label + ': ' + needle);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedSmallMethodsLesson090 from './GuidedSmallMethodsLesson090';", 'importação');
expectText(viewer, "startsWith('090_')", 'rota');
expectText(component, 'guided-small-methods-lesson-090-progress', 'persistência');
expectText(component, 'saved.filter(id => validIds.has(id))', 'IDs filtrados');
expectText(component, 'completionNormalizedRef', 'normalização');
expectText(component, "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", 'foco mobile');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora');
expectText(component, 'disabled={!stepDone}', 'portão de etapa');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'portão curricular');
expectText(component, "stepDone ? 'undo' : 'complete'", 'concluir e desmarcar');

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('export default function'));
assert.equal(count(steps, /\{ id: '/g), 9, 'nove etapas');
const extractions = component.slice(component.indexOf('const EXTRACTIONS = ['), component.indexOf('function ExtractionLab'));
assert.equal(count(extractions, /\['/g), 7, 'sete extrações');
const domains = component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function DomainsLab'));
assert.equal(count(domains, /\['/g), 7, 'sete domínios');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic'));
assert.equal(count(errors, /\['/g), 10, 'dez erros');
expectText(component, 'guided-error-label', 'rótulo da clínica');
expectText(css, '.sm90-errors button>span:first-child', 'círculo restrito');
expectText(css, '.guided-small-methods-lesson{max-width:100%;overflow:visible}', 'raiz sem recorte');
expectText(css, '@media(max-width:380px)', 'responsividade 380');
expectText(css, '@media(max-width:320px)', 'responsividade 320');

for (const concept of ['main gigante', 'métodos pequenos', 'responsabilidade', 'parâmetros', 'retorno', 'void', 'BigDecimal', 'calcularTotal', 'calcularDesconto', 'imprimirResumo', 'Extract Method', 'console robusto', 'arquitetura em camadas', 'debug']) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'conceito na fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'conceito na experiência');
}
expectText(component, 'IntelliJ', 'mock visual da IDE');
for (const phrase of ['Todo conteúdo original foi preservado', 'sete extrações', 'sete domínios', 'dez erros', 'A Aula 091']) expectText(matrix, phrase, 'matriz');

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

const giant = extractJoinedArray('GIANT_PROGRAM');
const refactored = extractJoinedArray('REFACTORED_PROGRAM');
const expected = extractJoinedArray('EXPECTED_OUTPUT');
const temp = mkdtempSync(join(tmpdir(), 'lesson-090-'));
try {
  writeFileSync(join(temp, 'MainGigante.java'), giant, 'utf8');
  writeFileSync(join(temp, 'PedidoRefatorado.java'), refactored, 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', 'MainGigante.java', 'PedidoRefatorado.java'], { cwd: temp, stdio: 'pipe' });
  const encoding = process.platform === 'win32' ? 'latin1' : 'utf8';
  const giantOutput = execFileSync('java', ['MainGigante'], { cwd: temp, encoding });
  const refactoredOutput = execFileSync('java', ['PedidoRefatorado'], { cwd: temp, encoding });
  const normalize = value => value.replace(/\r\n/g, '\n').trimEnd();
  assert.equal(normalize(giantOutput), normalize(expected), 'saída do main gigante divergente');
  assert.equal(normalize(refactoredOutput), normalize(expected), 'saída refatorada divergente');
  assert.equal(normalize(giantOutput), normalize(refactoredOutput), 'comportamento antes/depois divergente');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 090 validada: estrutura, sete extrações e equivalência executável conferidas.');
