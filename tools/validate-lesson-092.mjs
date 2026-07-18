import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedMethodCohesionLesson092.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedMethodCohesionLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/092_COESAO_EM_METODOS.md', 'utf8');
const source = readFileSync('docs/aulas/092_M3_03_COESAO_EM_METODOS_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), label + ': ' + needle);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedMethodCohesionLesson092 from './GuidedMethodCohesionLesson092';", 'importação');
expectText(viewer, "startsWith('092_')", 'rota');
expectText(component, 'guided-method-cohesion-lesson-092-progress', 'persistência');
expectText(component, 'saved.filter(id => validIds.has(id))', 'IDs filtrados');
expectText(component, 'completionNormalizedRef', 'normalização');
expectText(component, "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", 'foco mobile');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora');
expectText(component, 'disabled={!stepDone}', 'portão de etapa');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'portão curricular');
expectText(component, "stepDone ? 'undo' : 'complete'", 'concluir e desmarcar');

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('export default function'));
assert.equal(count(steps, /\{ id: '/g), 9, 'nove etapas');
const purposes = component.slice(component.indexOf('const PURPOSES = ['), component.indexOf('function IntentLab'));
assert.equal(count(purposes, /\['/g), 6, 'seis propósitos');
const symptoms = component.slice(component.indexOf('const SYMPTOMS = ['), component.indexOf('function SymptomsLab'));
assert.equal(count(symptoms, /\['/g), 8, 'oito sintomas');
const extractions = component.slice(component.indexOf('const EXTRACTIONS = ['), component.indexOf('function DecompositionLab'));
assert.equal(count(extractions, /\['/g), 7, 'sete extrações');
const domains = component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function DomainsLab'));
assert.equal(count(domains, /\['/g), 6, 'seis domínios');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic'));
assert.equal(count(errors, /\['/g), 10, 'dez erros');
expectText(component, 'guided-error-label', 'rótulo da clínica');
expectText(css, '.ch92-errors button>span:first-child', 'círculo restrito');
expectText(css, '.guided-method-cohesion-lesson{max-width:100%;overflow:visible}', 'raiz sem recorte');
expectText(css, '@media(max-width:380px)', 'responsividade 380');
expectText(css, '@media(max-width:320px)', 'responsividade 320');

for (const concept of ['coesão', 'uma intenção principal', 'nível de abstração', 'efeito colateral', 'comentários', 'duplicação', 'método de coordenação', 'BigDecimal', 'LocalDate', 'Instant', 'record', 'debug']) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'conceito na fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'conceito na experiência');
}
for (const phrase of ['Todo conteúdo original foi preservado', 'dez fontes', 'seis programas', 'A Aula 093']) expectText(matrix, phrase, 'matriz');

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
  ['MetodoPoucoCoeso.java', 'LOW_COHESION'], ['MetodoCoeso.java', 'COHESIVE'],
  ['ClienteCoesao.java', 'CLIENT'], ['ProdutoCoesao.java', 'PRODUCT'], ['PagamentoCoesao.java', 'PAYMENT'],
  ['OrdemServicoCoesao.java', 'SERVICE_ORDER'], ['MensageriaCoesao.java', 'MESSAGING'], ['AuditoriaCoesao.java', 'AUDIT'],
  ['MetodoCurtoPoucoCoeso.java', 'SHORT_BAD'], ['MetodoMaiorCoeso.java', 'LONG_GOOD'],
];
const expected = extractJoinedArray('EXPECTED');
const temp = mkdtempSync(join(tmpdir(), 'lesson-092-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extractJoinedArray(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const encoding = process.platform === 'win32' ? 'latin1' : 'utf8';
  const run = className => execFileSync('java', [className], { cwd: temp, encoding }).replace(/\r\n/g, '\n').trimEnd();
  assert.equal(run('MetodoPoucoCoeso'), expected, 'saída pouco coesa divergente');
  assert.equal(run('MetodoCoeso'), expected, 'saída coesa divergente');
  assert.equal(run('MetodoPoucoCoeso'), run('MetodoCoeso'), 'comportamento antes/depois divergente');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 092 validada: estrutura, dez fontes e equivalência de comportamento conferidas.');
