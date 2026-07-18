import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedParameterObjectsLesson093.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedParameterObjectsLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/093_PARAMETROS_DEMAIS_ALTERNATIVAS.md', 'utf8');
const source = readFileSync('docs/aulas/093_M3_04_PARAMETROS_DEMAIS_E_ALTERNATIVAS_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), label + ': ' + needle);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedParameterObjectsLesson093 from './GuidedParameterObjectsLesson093';", 'importação');
expectText(viewer, "startsWith('093_')", 'rota');
for (const needle of ['guided-parameter-objects-lesson-093-progress', 'saved.filter(id => validIds.has(id))', 'completionNormalizedRef', "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", "document.querySelector('.guided-layout')?.scrollIntoView", 'disabled={!stepDone}', 'disabled={!hasNextLesson || !lessonComplete}', "stepDone ? 'undo' : 'complete'"]) expectText(component, needle, 'estrutura');
const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('export default function'));
assert.equal(count(steps, /\{ id: '/g), 9, 'nove etapas');
for (const [start, end, expected, label] of [['const PARAMETER_SCALE = [', 'function SmellLab', 6, 'faixas'], ['const ALTERNATIVES = [', 'function AlternativesLab', 7, 'alternativas'], ['const DOMAINS = [', 'function DomainsLab', 6, 'domínios'], ['const ERRORS = [', 'function ErrorsClinic', 8, 'erros']]) {
  const part = component.slice(component.indexOf(start), component.indexOf(end)); assert.equal(count(part, /\['/g), expected, label);
}
expectText(component, 'guided-error-label', 'rótulo da clínica');
expectText(css, '.po93-errors button>span:first-child', 'círculo restrito');
expectText(css, '.guided-parameter-objects-lesson{max-width:100%;overflow:visible}', 'raiz sem recorte');
expectText(css, '@media(max-width:380px)', 'responsividade 380'); expectText(css, '@media(max-width:320px)', 'responsividade 320');
for (const concept of ['parâmetros demais', 'cheiro', 'ordem', 'variáveis intermediárias', 'record', 'enum', 'boolean misterioso', 'coesão', 'BigDecimal', 'LocalDate', 'Instant', 'debug']) { expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte'); expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência'); }
for (const phrase of ['Todo conteúdo original foi preservado', 'nove fontes', 'seis domínios', 'A Aula 094']) expectText(matrix, phrase, 'matriz');

function extractJoinedArray(name) { const marker = 'const ' + name + ' = ['; const start = component.indexOf(marker); assert.ok(start >= 0, name); const end = component.indexOf("].join('\\n')", start); assert.ok(end >= 0, name + ' fim'); const body = component.slice(start + marker.length, end); const values = []; for (const match of body.matchAll(/'((?:\\.|[^'])*)'/g)) values.push(JSON.parse('"' + match[1].replaceAll('"', '\\"') + '"')); return values.join('\n'); }
const files = [['ParametrosDemaisRuim.java', 'BAD_PROGRAM'], ['PedidoComRecordEntrada.java', 'INPUT_RECORD_PROGRAM'], ['PedidoComResumo.java', 'SUMMARY_PROGRAM'], ['ClienteParametros.java', 'CLIENT'], ['ProdutoParametros.java', 'PRODUCT'], ['PagamentoParametros.java', 'PAYMENT'], ['OsParametros.java', 'SERVICE_ORDER'], ['MensageriaParametros.java', 'MESSAGING'], ['AuditoriaParametros.java', 'AUDIT']];
const expected = extractJoinedArray('EXPECTED'); const temp = mkdtempSync(join(tmpdir(), 'lesson-093-'));
try { for (const [file, constant] of files) writeFileSync(join(temp, file), extractJoinedArray(constant), 'utf8'); execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' }); const encoding = process.platform === 'win32' ? 'latin1' : 'utf8'; const run = className => execFileSync('java', [className], { cwd: temp, encoding }).replace(/\r\n/g, '\n').trimEnd(); assert.equal(run('ParametrosDemaisRuim'), expected, 'saída ruim'); assert.equal(run('PedidoComResumo'), expected, 'saída final'); assert.equal(run('ParametrosDemaisRuim'), run('PedidoComResumo'), 'equivalência'); } finally { rmSync(temp, { recursive: true, force: true }); }
console.log('Aula 093 validada: estrutura, nove fontes e equivalência com records conferidas.');
