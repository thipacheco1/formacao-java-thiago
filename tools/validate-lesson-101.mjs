import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedProceduralArchitectureLesson101.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedProceduralArchitectureLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/101_MINI_ARQUITETURA_PROCEDURAL.md', 'utf8');
const source = readFileSync('docs/aulas/101_M3_12_MINI_ARQUITETURA_PROCEDURAL_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedProceduralArchitectureLesson101 from './GuidedProceduralArchitectureLesson101';", 'import');
expectText(viewer, "startsWith('101_')", 'rota');
for (const needle of [
  'guided-procedural-architecture-lesson-101-progress',
  'saved.filter(id => validIds.has(id))',
  'completionNormalizedRef',
  "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })",
  "document.querySelector('.guided-layout')?.scrollIntoView",
  'disabled={!stepDone}',
  'disabled={!hasNextLesson || !lessonComplete}',
  "stepDone ? 'undo' : 'complete'",
]) expectText(component, needle, 'estrutura');

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal(count(steps, /{ id: '/g), 11, 'etapas');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function CopyButton'));
assert.equal(count(errors, /^  \['/gm), 8, 'erros');
expectText(component, 'guided-error-label', 'clínica');
expectText(css, '.pa101-errors button>span:first-child', 'círculo');
expectText(css, '.guided-procedural-architecture-lesson{max-width:100%;overflow:visible}', 'raiz');
for (const width of ['900', '680', '520', '380', '320']) expectText(css, `@media(max-width:${width}px)`, `breakpoint ${width}`);

for (const concept of [
  'mini arquitetura procedural', 'main', 'lerPedido', 'pedidoValido',
  'gerarResumoPedido', 'imprimirResumoPedido', 'PedidoEntrada', 'ResumoPedido',
  'lerTextoObrigatorio', 'calcularDesconto', 'record', 'Step Into', 'git diff',
  'controller', 'service', 'repository', 'LocalDate', 'calcularDiasEmAberto',
]) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
for (const phrase of ['O aluno transforma um `main`', 'Três fontes Java completas', 'A Aula 102']) expectText(matrix, phrase, 'matriz');

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
  ['PedidoMainGrande.java', 'LARGE_MAIN'],
  ['PedidoMiniArquiteturaProcedural.java', 'ORGANIZED'],
  ['OsMiniArquiteturaProcedural.java', 'OS_PROJECT'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-101-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = (className, input) => execFileSync('java', [className], {
    cwd: temp,
    encoding: 'utf8',
    input,
  }).replace(/\r\n/g, '\n').trimEnd();
  const input = 'Ana\nCadeira\n199,90\n2\n';
  const large = run('PedidoMainGrande', input);
  const organized = run('PedidoMiniArquiteturaProcedural', input);
  assert.equal(organized, large, 'pedido exatamente equivalente');
  assert.ok(large.includes('Total bruto: 399.80'), 'bruto');
  assert.ok(large.includes('Desconto: 39.9800'), 'desconto');
  assert.ok(large.includes('Total final: 359.8200'), 'total final');
  const os = run('OsMiniArquiteturaProcedural', 'CERT-101\nABERTA\n2026-07-10\n');
  assert.ok(os.includes('Certificado: CERT-101'), 'certificado');
  assert.ok(os.includes('Status: ABERTA'), 'status');
  assert.match(os, /Dias em aberto: \d+/, 'dias calculados');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 101 validada: estrutura, três fontes, equivalência do pedido e OS conferidas.');
