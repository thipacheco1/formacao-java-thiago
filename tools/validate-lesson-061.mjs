import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();
const component = readFileSync(resolve(root, 'plataforma-curso/src/components/GuidedCalculatorProjectLesson061.jsx'), 'utf8');
const css = readFileSync(resolve(root, 'plataforma-curso/src/components/guidedCalculatorProjectLesson.css'), 'utf8');
const viewer = readFileSync(resolve(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const matrix = readFileSync(resolve(root, 'docs/revisao-aulas/matrizes/061_CALCULADORA_PROFISSIONAL_CONSOLE.md'), 'utf8');
const must = (condition, message) => { if (!condition) throw new Error(`Aula 061: ${message}`); };

must(viewer.includes("startsWith('061_')") && viewer.includes('GuidedCalculatorProjectLesson061'), 'integração ausente');
must(component.includes('saved.filter(id=>valid.has(id))'), 'progresso persistido não filtrado');
must(component.includes('normalized=useRef(false)') && component.includes('normalized.current=true'), 'conclusão antiga não normalizada');
must(component.includes("inline:'center'"), 'foco móvel da etapa ativa ausente');
must(component.includes('disabled={!hasNextLesson||!complete}'), 'avanço curricular sem portão');
must(component.includes("slice(-10)"), 'histórico do simulador não limitado a dez resultados');
must(component.includes('result%1===0&&result%2===0'), 'regra de paridade do simulador ausente');
must(component.includes('className="guided-error-label"'), 'rótulo da Clínica de Erros fora do padrão');
must((component.slice(component.indexOf('const TESTS='), component.indexOf('function TestsLab')).match(/\['/g) || []).length === 10, 'roteiro não contém dez testes');
must((component.slice(component.indexOf('const ERRORS='), component.indexOf('function ErrorsClinic')).match(/\['/g) || []).length === 10, 'clínica não contém dez diagnósticos');
const stepSection = component.slice(component.lastIndexOf('const steps='), component.indexOf('export default function'));
must((stepSection.match(/\['/g) || []).length === 9, 'roteiro não contém nove etapas');
for (const type of ['lead', 'sim', 'architecture', 'history', 'tests', 'errors', 'delivery']) {
  must(component.includes(`block.type==='${type}'`), `bloco ${type} sem renderizador`);
}
must(css.includes('.cp61-errors button>span:first-child') && css.includes('.cp61-errors button>span:last-child'), 'seletores da Clínica de Erros incorretos');
must(css.includes('@media(max-width:380px)'), 'responsividade estreita ausente');
must(matrix.includes('Cobertura: 100%'), 'matriz incompleta');

const program = component.match(/const PROGRAM=`([\s\S]*?)`;/);
must(program, 'programa Java guiado ausente');
const temp = mkdtempSync(join(tmpdir(), 'java-lesson-061-'));
try {
  const file = join(temp, 'CalculadoraProfissionalConsole.java');
  writeFileSync(file, program[1], 'utf8');
  const result = spawnSync('javac', [file], { encoding: 'utf8' });
  must(result.status === 0, `programa não compila:\n${result.stderr || result.stdout}`);
} finally {
  if (resolve(temp).startsWith(resolve(tmpdir()))) rmSync(temp, { recursive: true, force: true });
}

console.log('LESSON_061_STATIC_AND_JAVA_OK');
