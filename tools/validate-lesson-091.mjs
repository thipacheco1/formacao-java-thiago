import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedProfessionalSignatureLesson091.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedProfessionalSignatureLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/091_ASSINATURA_METODO_PROFISSIONAL.md', 'utf8');
const source = readFileSync('docs/aulas/091_M3_02_ASSINATURA_DE_METODO_PROFISSIONAL_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), label + ': ' + needle);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedProfessionalSignatureLesson091 from './GuidedProfessionalSignatureLesson091';", 'importação');
expectText(viewer, "startsWith('091_')", 'rota');
expectText(component, 'guided-professional-signature-lesson-091-progress', 'persistência');
expectText(component, 'saved.filter(id => validIds.has(id))', 'IDs filtrados');
expectText(component, 'completionNormalizedRef', 'normalização');
expectText(component, "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })", 'foco mobile');
expectText(component, "document.querySelector('.guided-layout')?.scrollIntoView", 'âncora');
expectText(component, 'disabled={!stepDone}', 'portão de etapa');
expectText(component, 'disabled={!hasNextLesson || !lessonComplete}', 'portão curricular');
expectText(component, "stepDone ? 'undo' : 'complete'", 'concluir e desmarcar');

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('export default function'));
assert.equal(count(steps, /\{ id: '/g), 9, 'nove etapas');
const signatureParts = component.slice(component.indexOf('const SIGNATURE_PARTS = ['), component.indexOf('function AnatomyLab'));
assert.equal(count(signatureParts, /\['/g), 7, 'sete partes da assinatura');
const verbs = component.slice(component.indexOf('const VERBS = ['), component.indexOf('function VerbLab'));
assert.equal(count(verbs, /\['/g), 7, 'sete verbos');
const topics = component.slice(component.indexOf('const PARAMETER_TOPICS = ['), component.indexOf('function ParameterLab'));
assert.equal(count(topics, /\['/g), 5, 'cinco tópicos de parâmetro');
const refactors = component.slice(component.indexOf('const REFACTORS = ['), component.indexOf('function RefactorLab'));
assert.equal(count(refactors, /\['/g), 4, 'quatro refatorações');
const domains = component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function DomainsLab'));
assert.equal(count(domains, /\['/g), 7, 'sete domínios');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic'));
assert.equal(count(errors, /\['/g), 10, 'dez erros');
expectText(component, 'guided-error-label', 'rótulo da clínica');
expectText(css, '.sg91-errors button>span:first-child', 'círculo restrito');
expectText(css, '.guided-professional-signature-lesson{max-width:100%;overflow:visible}', 'raiz sem recorte');
expectText(css, '@media(max-width:380px)', 'responsividade 380');
expectText(css, '@media(max-width:320px)', 'responsividade 320');

for (const concept of ['assinatura como contrato', 'visibilidade', 'static', 'retorno', 'ordem natural', 'boolean misterioso', 'TipoNormalizacao', 'null', 'void', 'throws IOException', 'IllegalArgumentException', 'BigDecimal', 'LocalDate', 'Instant', 'record', 'debug']) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'conceito na fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'conceito na experiência');
}
for (const phrase of ['Todo conteúdo original foi preservado', 'sete programas', 'nove arquivos', 'A Aula 092']) expectText(matrix, phrase, 'matriz');

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
  ['AssinaturaRuim.java', 'BAD_PROGRAM'], ['AssinaturaBoa.java', 'GOOD_PROGRAM'],
  ['PedidoAssinaturaProfissional.java', 'ORDER_PROGRAM'], ['ClienteAssinaturaProfissional.java', 'CLIENT_PROGRAM'],
  ['ProdutoAssinaturaProfissional.java', 'PRODUCT_PROGRAM'], ['PagamentoAssinaturaProfissional.java', 'PAYMENT_PROGRAM'],
  ['OrdemServicoAssinaturaProfissional.java', 'SERVICE_ORDER_PROGRAM'], ['MensageriaAssinaturaProfissional.java', 'MESSAGING_PROGRAM'],
  ['AuditoriaAssinaturaProfissional.java', 'AUDIT_PROGRAM'],
];
const expectedGood = component.match(/const EXPECTED_GOOD = '([^']+)'/)[1];
const expectedOrder = extractJoinedArray('EXPECTED_ORDER');
const temp = mkdtempSync(join(tmpdir(), 'lesson-091-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extractJoinedArray(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const encoding = process.platform === 'win32' ? 'latin1' : 'utf8';
  const run = className => execFileSync('java', [className], { cwd: temp, encoding }).replace(/\r\n/g, '\n').trimEnd();
  assert.equal(run('AssinaturaRuim'), expectedGood, 'saída da assinatura ruim divergente');
  assert.equal(run('AssinaturaBoa'), expectedGood, 'saída da assinatura boa divergente');
  assert.equal(run('PedidoAssinaturaProfissional'), expectedOrder, 'saída de pedido divergente');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 091 validada: estrutura, nove fontes e contratos executáveis conferidos.');
