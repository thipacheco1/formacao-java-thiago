import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();
const component = readFileSync(resolve(root, 'plataforma-curso/src/components/GuidedStringBuilderLesson068.jsx'), 'utf8');
const css = readFileSync(resolve(root, 'plataforma-curso/src/components/guidedStringBuilderLesson.css'), 'utf8');
const viewer = readFileSync(resolve(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const matrix = readFileSync(resolve(root, 'docs/revisao-aulas/matrizes/068_STRINGBUILDER_STRINGBUFFER.md'), 'utf8');
const must = (condition, message) => { if (!condition) throw new Error(`Aula 068: ${message}`); };

must(viewer.includes("startsWith('068_')") && viewer.includes('GuidedStringBuilderLesson068'), 'integração ausente');
must(component.includes('saved.filter(id => validIds.has(id))'), 'progresso não filtrado');
must(component.includes('completionNormalizedRef') && component.includes("inline: 'center'"), 'normalização ou foco móvel ausente');
must(component.includes('disabled={!hasNextLesson || !lessonComplete}'), 'portão curricular ausente');
must(component.includes('StringBuilder mantém conteúdo mutável') && component.includes('StringBuffer'), 'contrato central ausente');
must(component.includes('insert(0') && component.includes('setLength(0)') && component.includes('capacity()'), 'operações incompletas');
must(component.includes('className="guided-error-label"'), 'Clínica fora do padrão');
must((component.slice(component.indexOf('const steps = ['), component.indexOf('export default function')).match(/\bid: '/g) || []).length === 9, 'roteiro não contém nove etapas');
must((component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic')).match(/^  \['/gm) || []).length === 10, 'Clínica não contém dez casos');
must((component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function DomainsLab')).match(/^  \['/gm) || []).length === 6, 'galeria não contém seis domínios');
must(css.includes('.sb68-errors button>span:first-child') && css.includes('.sb68-errors button>span:last-child'), 'seletores da Clínica incorretos');
must(css.includes('@media(max-width:380px)'), 'responsividade estreita ausente');
must(matrix.includes('Cobertura: 100%'), 'matriz incompleta');

const program = component.match(/const MAIN_PROGRAM = `([\s\S]*?)`;/)?.[1];
const expected = component.match(/const EXPECTED_OUTPUT = `([\s\S]*?)`;/)?.[1];
must(program && expected, 'programa ou saída esperada ausente');
const temp = mkdtempSync(join(tmpdir(), 'java-lesson-068-'));
try {
  const file = join(temp, 'LaboratorioStringBuilder.java');
  writeFileSync(file, program, 'utf8');
  const compile = spawnSync('javac', [file], { encoding: 'utf8' });
  must(compile.status === 0, `Java não compila:\n${compile.stderr || compile.stdout}`);
  const run = spawnSync('java', ['-cp', temp, 'LaboratorioStringBuilder'], { encoding: 'utf8' });
  const normalize = value => value.replace(/\r\n/g, '\n').trim();
  must(run.status === 0 && normalize(run.stdout) === normalize(expected), `saída divergente:\n${run.stderr || run.stdout}`);
} finally {
  if (resolve(temp).startsWith(resolve(tmpdir()))) rmSync(temp, { recursive: true, force: true });
}

console.log('LESSON_068_STATIC_JAVA_AND_OUTPUT_OK');
