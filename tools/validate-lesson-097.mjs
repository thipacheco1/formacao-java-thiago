import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const component = readFileSync('plataforma-curso/src/components/GuidedInputMethodsLesson097.jsx', 'utf8');
const css = readFileSync('plataforma-curso/src/components/guidedInputMethodsLesson.css', 'utf8');
const viewer = readFileSync('plataforma-curso/src/components/MarkdownViewer.jsx', 'utf8');
const matrix = readFileSync('docs/revisao-aulas/matrizes/097_METODOS_DE_LEITURA.md', 'utf8');
const source = readFileSync('docs/aulas/097_M3_08_METODOS_DE_LEITURA_OFICIAL.md', 'utf8');
const expectText = (text, needle, label) => assert.ok(text.includes(needle), `${label}: ${needle}`);
const count = (text, pattern) => [...text.matchAll(pattern)].length;

expectText(viewer, "import GuidedInputMethodsLesson097 from './GuidedInputMethodsLesson097';", 'import');
expectText(viewer, "startsWith('097_')", 'rota');
for (const needle of [
  'guided-input-methods-lesson-097-progress',
  'saved.filter(id => validIds.has(id))',
  'completionNormalizedRef',
  "scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })",
  "document.querySelector('.guided-layout')?.scrollIntoView",
  'disabled={!stepDone}',
  'disabled={!hasNextLesson || !lessonComplete}',
  "stepDone ? 'undo' : 'complete'",
]) expectText(component, needle, 'estrutura');

const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal(count(steps, /{ id: '/g), 9, 'etapas');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function CopyButton'));
assert.equal(count(errors, /^  \['/gm), 8, 'erros');
expectText(component, 'guided-error-label', 'clínica');
expectText(css, '.im97-errors button>span:first-child', 'círculo');
expectText(css, '.guided-input-methods-lesson{max-width:100%;overflow:visible}', 'raiz');
for (const width of ['900', '680', '520', '380', '320']) expectText(css, `@media(max-width:${width}px)`, `breakpoint ${width}`);

for (const concept of [
  'Scanner', 'nextInt', 'nextLine', 'NumberFormatException', 'InputMismatchException',
  'while (true)', 'try', 'catch', 'Integer.parseInt', 'BigDecimal', 'System.in',
  'close', 'JSON HTTP Request', 'IntelliJ', 'trim', 'isEmpty',
]) {
  expectText(source.toLowerCase(), concept.toLowerCase(), 'fonte');
  expectText(component.toLowerCase(), concept.toLowerCase(), 'experiência');
}
for (const phrase of ['O aluno reproduz o Enter residual', 'Quatro fontes Java completas', 'A Aula 098']) expectText(matrix, phrase, 'matriz');

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
  ['LeituraTextoObrigatorio.java', 'TEXT_INPUT'],
  ['LeituraInteiro.java', 'INTEGER_INPUT'],
  ['ConsoleInput.java', 'CONSOLE_INPUT'],
  ['CadastroProdutoConsole.java', 'PRODUCT'],
];
const temp = mkdtempSync(join(tmpdir(), 'lesson-097-'));
try {
  for (const [file, constant] of files) writeFileSync(join(temp, file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding', 'UTF-8', ...files.map(([file]) => file)], { cwd: temp, stdio: 'pipe' });
  const run = (className, input) => execFileSync('java', [className], {
    cwd: temp,
    input,
    encoding: process.platform === 'win32' ? 'latin1' : 'utf8',
  }).replace(/\r\n/g, '\n').trimEnd();
  const textOutput = run('LeituraTextoObrigatorio', '   \nAna Silva\n');
  assert.equal(count(textOutput, /Digite seu nome completo:/g), 2, 'texto repetiu prompt');
  assert.ok(textOutput.endsWith('Ana Silva'), 'texto higienizado');
  const integerOutput = run('LeituraInteiro', 'abc\n25\n');
  assert.equal(count(integerOutput, /Digite sua idade:/g), 2, 'inteiro repetiu prompt');
  assert.ok(integerOutput.endsWith('25 anos.'), 'inteiro convertido');
  const productOutput = run('CadastroProdutoConsole', '   \nNotebook Pro\n0\n3\nabc\n199.90\n');
  assert.equal(count(productOutput, /Nome do produto:/g), 2, 'nome repetido');
  assert.equal(count(productOutput, /Quantidade em estoque:/g), 2, 'quantidade repetida');
  assert.equal(count(productOutput, /do produto:/g), 4, 'nome e preço repetiram seus prompts');
  assert.ok(productOutput.includes('Nome: Notebook Pro'), 'produto nome');
  assert.ok(productOutput.includes('Quantidade: 3'), 'produto quantidade');
  assert.ok(productOutput.includes('R$ 199.90'), 'produto preço');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('Aula 097 validada: estrutura, quatro fontes e entradas inválidas/válidas conferidas.');
