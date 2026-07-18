import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();
const component = readFileSync(resolve(root, 'plataforma-curso/src/components/GuidedDefaultValuesInitializationLesson065.jsx'), 'utf8');
const css = readFileSync(resolve(root, 'plataforma-curso/src/components/guidedDefaultValuesInitializationLesson.css'), 'utf8');
const viewer = readFileSync(resolve(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const matrix = readFileSync(resolve(root, 'docs/revisao-aulas/matrizes/065_DEFAULT_VALUES_INICIALIZACAO.md'), 'utf8');
const must = (condition, message) => { if (!condition) throw new Error(`Aula 065: ${message}`); };

must(viewer.includes("startsWith('065_')") && viewer.includes('GuidedDefaultValuesInitializationLesson065'), 'integração ausente');
must(component.includes('saved.filter(id => validIds.has(id))'), 'progresso não filtrado');
must(component.includes('completionNormalizedRef') && component.includes("inline: 'center'"), 'normalização ou foco móvel ausente');
must(component.includes('disabled={!hasNextLesson || !lessonComplete}'), 'portão curricular ausente');
must(component.includes('Campos de instância, campos static e elementos de array recebem defaults'), 'contrato central ausente');
must(component.includes('\\\\u0000'), 'default de char ausente');
must(component.includes('className="guided-error-label"'), 'Clínica fora do padrão');
must((component.slice(component.indexOf('const steps = ['), component.indexOf('export default function')).match(/\bid: '/g) || []).length === 8, 'roteiro não contém oito etapas');
must((component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic')).match(/^  \['/gm) || []).length === 10, 'Clínica não contém dez casos');
must((component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function DomainsLab')).match(/^  \['/gm) || []).length === 6, 'galeria não contém seis domínios');
must(css.includes('.dv65-errors button>span:first-child') && css.includes('.dv65-errors button>span:last-child'), 'seletores da Clínica incorretos');
must(css.includes('@media(max-width:380px)'), 'responsividade estreita ausente');
must(matrix.includes('Cobertura: 100%'), 'matriz incompleta');

const program = component.match(/const MAIN_PROGRAM = `([\s\S]*?)`;/)?.[1];
const expected = component.match(/const EXPECTED_OUTPUT = `([\s\S]*?)`;/)?.[1];
must(program && expected, 'programa ou saída esperada ausente');
const temp = mkdtempSync(join(tmpdir(), 'java-lesson-065-'));
try {
  const file = join(temp, 'LaboratorioInicializacao.java');
  writeFileSync(file, program, 'utf8');
  const compile = spawnSync('javac', [file], { encoding: 'utf8' });
  must(compile.status === 0, `Java não compila:\n${compile.stderr || compile.stdout}`);
  const run = spawnSync('java', ['-cp', temp, 'LaboratorioInicializacao'], { encoding: 'utf8' });
  const normalize = value => value.replace(/\r\n/g, '\n').trim();
  must(run.status === 0 && normalize(run.stdout) === normalize(expected), `saída divergente:\n${run.stderr || run.stdout}`);
} finally {
  if (resolve(temp).startsWith(resolve(tmpdir()))) rmSync(temp, { recursive: true, force: true });
}

console.log('LESSON_065_STATIC_JAVA_AND_OUTPUT_OK');
