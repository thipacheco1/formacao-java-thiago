import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedMethodDebugLesson099.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedMethodDebugLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/099_DEBUG_ENTRANDO_EM_METODOS.md', 'utf8');
const source = readFileSync('docs/aulas/099_M3_10_DEBUG_ENTRANDO_EM_METODOS_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedMethodDebugLesson099 from './GuidedMethodDebugLesson099';", 'import');
expectText(viewer, "startsWith('099_')", 'rota');
for (const needle of [
  'guided-method-debug-lesson-099-progress',
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
expectText(css, '.md99-errors button>span:first-child', 'círculo');
expectText(css, '.guided-method-debug-lesson{max-width:100%;overflow:visible}', 'raiz');
for (const width of ['900', '680', '520', '380', '320']) expectText(css, `@media(max-width:${width}px)`, `breakpoint ${width}`);

for (const concept of [
  'Call Stack', 'Frames', 'Step Over', 'F8', 'Step Into', 'F7', 'Step Out',
  'Shift + F8', 'StackTrace', 'Evaluate Expression', 'Alt + F8', 'BigDecimal',
  'breakpoint', 'aplicarImposto', 'aplicarFrete', '330.00',
]) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
expectText(source.toLowerCase(), 'variáveis', 'fonte');
expectText(component, 'Variables', 'experiência');
for (const phrase of ['O aluno explica Call Stack', 'Quatro fontes Java completas', 'A Aula 100']) expectText(matrix, phrase, 'matriz');

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
  ['DebugCallStack.java', 'CALL_STACK'],
  ['DebugCalculoComBug.java', 'BUGGY'],
  ['DebugCalculoCorrigido.java', 'FIXED'],
  ['DebugStackTrace.java', 'STACK_TRACE'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-099-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = className => execFileSync('java', [className], { cwd: temp, encoding: 'utf8' }).replace(/\r\n/g, '\n').trimEnd();
  const stack = run('DebugCallStack').split('\n');
  assert.equal(stack.length, 6, 'seis eventos de Call Stack');
  assert.equal(stack[0], 'Iniciando main...', 'início da pilha');
  assert.equal(stack.at(-1), 'Finalizando main...', 'fim da pilha');
  assert.ok(run('DebugCalculoComBug').endsWith('Total Calculado Final: R$ 315.00'), 'resultado com bug');
  assert.ok(run('DebugCalculoCorrigido').endsWith('Total Calculado Final: R$ 330.0000'), 'resultado corrigido');
  const failed = spawnSync('java', ['DebugStackTrace'], { cwd: temp, encoding: 'utf8' });
  assert.notEqual(failed.status, 0, 'exceção intencional');
  const trace = `${failed.stdout}\n${failed.stderr}`;
  for (const needle of ['IllegalArgumentException', 'validarQuantidade', 'processarPedido', 'main']) expectText(trace, needle, 'stack trace');
  assert.ok(trace.indexOf('validarQuantidade') < trace.indexOf('processarPedido'), 'origem antes do chamador');
  assert.ok(trace.indexOf('processarPedido') < trace.lastIndexOf('main'), 'chamador antes da base');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 099 validada: estrutura, quatro fontes, três execuções e StackTrace conferidas.');
