import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();
const component = readFileSync(resolve(root, 'plataforma-curso/src/components/GuidedMathRandomLesson071.jsx'), 'utf8');
const css = readFileSync(resolve(root, 'plataforma-curso/src/components/guidedMathRandomLesson.css'), 'utf8');
const viewer = readFileSync(resolve(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const matrix = readFileSync(resolve(root, 'docs/revisao-aulas/matrizes/071_MATH_RANDOM_NUMEROS_UTILITARIOS.md'), 'utf8');
const must = (condition, message) => { if (!condition) throw new Error(`Aula 071: ${message}`); };

must(viewer.includes("startsWith('071_')") && viewer.includes('GuidedMathRandomLesson071'), 'integração ausente');
must(component.includes('saved.filter(id => validIds.has(id))'), 'progresso não filtrado');
must(component.includes('completionNormalizedRef') && component.includes("inline: 'center'"), 'normalização ou foco móvel ausente');
must(component.includes('disabled={!hasNextLesson || !lessonComplete}'), 'portão curricular ausente');
must(component.includes('Math.round') && component.includes('Math.floor') && component.includes('Math.ceil'), 'arredondamentos incompletos');
must(component.includes('random.nextInt(maximo - minimo + 1) + minimo'), 'faixa inclusiva ausente');
must(component.includes('Math.addExact') && component.includes('Math.toIntExact'), 'detecção de overflow ausente');
must(component.includes('SecureRandom') && component.includes('className="guided-error-label"'), 'segurança ou Clínica ausente');
must((component.slice(component.indexOf('const steps = ['), component.indexOf('export default function')).match(/\bid: '/g) || []).length === 9, 'roteiro não contém nove etapas');
must((component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic')).match(/^  \['/gm) || []).length === 10, 'Clínica não contém dez casos');
must((component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function DomainLab')).match(/^  \['/gm) || []).length === 7, 'galeria não contém sete domínios');
must(css.includes('.mr71-errors button>span:first-child') && css.includes('.mr71-errors button>span:last-child'), 'seletores da Clínica incorretos');
must(css.includes('@media(max-width:380px)'), 'responsividade estreita ausente');
must(matrix.includes('Cobertura: 100%'), 'matriz incompleta');

const program = component.match(/const MAIN_PROGRAM = `([\s\S]*?)`;/)?.[1];
const expected = component.match(/const EXPECTED_OUTPUT = `([\s\S]*?)`;/)?.[1];
must(program && expected, 'programa ou saída esperada ausente');
const temp = mkdtempSync(join(tmpdir(), 'java-lesson-071-'));
try {
  const file = join(temp, 'LaboratorioMathRandom.java');
  writeFileSync(file, program, 'utf8');
  const compile = spawnSync('javac', [file], { encoding: 'utf8' });
  must(compile.status === 0, `Java não compila:\n${compile.stderr || compile.stdout}`);
  const run = spawnSync('java', ['-cp', temp, 'LaboratorioMathRandom'], { encoding: 'utf8' });
  const normalize = value => value.replace(/\r\n/g, '\n').trim();
  must(run.status === 0 && normalize(run.stdout) === normalize(expected), `saída divergente:\n${run.stderr || run.stdout}`);
} finally {
  if (resolve(temp).startsWith(resolve(tmpdir()))) rmSync(temp, { recursive: true, force: true });
}

console.log('LESSON_071_STATIC_JAVA_AND_OUTPUT_OK');
