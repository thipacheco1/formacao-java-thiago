import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();
const component = readFileSync(resolve(root, 'plataforma-curso/src/components/GuidedLocaleNumberFormatLesson073.jsx'), 'utf8');
const css = readFileSync(resolve(root, 'plataforma-curso/src/components/guidedLocaleNumberFormatLesson.css'), 'utf8');
const viewer = readFileSync(resolve(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const matrix = readFileSync(resolve(root, 'docs/revisao-aulas/matrizes/073_LOCALE_NUMBERFORMAT_FORMATACAO.md'), 'utf8');
const must = (condition, message) => { if (!condition) throw new Error(`Aula 073: ${message}`); };

must(viewer.includes("startsWith('073_')") && viewer.includes('GuidedLocaleNumberFormatLesson073'), 'integração ausente');
must(component.includes('saved.filter(id => validIds.has(id))'), 'progresso não filtrado');
must(component.includes('completionNormalizedRef') && component.includes("inline: 'center'"), 'normalização ou foco móvel ausente');
must(component.includes('disabled={!hasNextLesson || !lessonComplete}'), 'portão curricular ausente');
must(component.includes('getCurrencyInstance') && component.includes('getNumberInstance') && component.includes('getPercentInstance'), 'formatadores incompletos');
must(component.includes('ParseException') && component.includes('NumberFormat.parse retorna Number'), 'parsing incompleto');
must(component.includes('NumberFormat é mutável') || component.includes('NumberFormat global'), 'mutabilidade ausente');
must(component.includes('className="guided-error-label"'), 'Clínica fora do padrão');
must((component.slice(component.indexOf('const steps = ['), component.indexOf('export default function')).match(/\bid: '/g) || []).length === 8, 'roteiro não contém oito etapas');
must((component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic')).match(/^  \['/gm) || []).length === 10, 'Clínica não contém dez casos');
must((component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function DomainLab')).match(/^  \['/gm) || []).length === 6, 'galeria não contém seis domínios');
must(css.includes('.ln73-errors button>span:first-child') && css.includes('.ln73-errors button>span:last-child'), 'seletores da Clínica incorretos');
must(css.includes('@media(max-width:380px)'), 'responsividade estreita ausente');
must(matrix.includes('Cobertura: 100%'), 'matriz incompleta');

const program = component.match(/const MAIN_PROGRAM = `([\s\S]*?)`;/)?.[1];
const expected = component.match(/const EXPECTED_OUTPUT = `([\s\S]*?)`;/)?.[1];
must(program && expected, 'programa ou saída esperada ausente');
const temp = mkdtempSync(join(tmpdir(), 'java-lesson-073-'));
try {
  const file = join(temp, 'LaboratorioFormatacao.java');
  writeFileSync(file, program, 'utf8');
  const compile = spawnSync('javac', [file], { encoding: 'utf8' });
  must(compile.status === 0, `Java não compila:\n${compile.stderr || compile.stdout}`);
  const run = spawnSync('java', ['-cp', temp, 'LaboratorioFormatacao'], { encoding: 'utf8' });
  const normalize = value => value.replace(/\r\n/g, '\n').trim();
  must(run.status === 0 && normalize(run.stdout) === normalize(expected), `saída divergente:\n${run.stderr || run.stdout}`);
} finally {
  if (resolve(temp).startsWith(resolve(tmpdir()))) rmSync(temp, { recursive: true, force: true });
}
console.log('LESSON_073_STATIC_JAVA_AND_OUTPUT_OK');
