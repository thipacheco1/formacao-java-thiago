import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { runInNewContext } from 'node:vm';

const root = process.cwd();
const component = readFileSync(resolve(root, 'plataforma-curso/src/components/GuidedTimezoneInstantLesson075.jsx'), 'utf8');
const css = readFileSync(resolve(root, 'plataforma-curso/src/components/guidedTimezoneInstantLesson.css'), 'utf8');
const viewer = readFileSync(resolve(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const matrix = readFileSync(resolve(root, 'docs/revisao-aulas/matrizes/075_TIMEZONE_INSTANT.md'), 'utf8');
const must = (condition, message) => { if (!condition) throw new Error(`Aula 075: ${message}`); };

must(viewer.includes("startsWith('075_')") && viewer.includes('GuidedTimezoneInstantLesson075'), 'integração ausente');
must(component.includes('saved.filter(id => validIds.has(id))'), 'progresso não filtrado');
must(component.includes('completionNormalizedRef') && component.includes("inline: 'center'"), 'normalização ou foco móvel ausente');
must(component.includes('disabled={!hasNextLesson||!lessonComplete}'), 'portão curricular ausente');
must(component.includes('Instant') && component.includes('ZoneId') && component.includes('ZoneOffset'), 'tipos globais incompletos');
must(component.includes('ZonedDateTime') && component.includes('OffsetDateTime') && component.includes('LocalDateTime'), 'contratos temporais incompletos');
must(component.includes('withZoneSameInstant') && component.includes('toInstant'), 'conversões de zona incompletas');
must(component.includes('Duration.between') && component.includes('Clock.fixed') && component.includes('Clock.systemUTC'), 'duração ou relógio testável ausente');
must(component.includes('className="guided-error-label"'), 'Clínica fora do padrão');
must((component.slice(component.indexOf('const steps = ['), component.indexOf('export default function')).match(/\bid: '/g) || []).length === 9, 'roteiro não contém nove etapas');
must((component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic')).match(/^  \['/gm) || []).length === 10, 'Clínica não contém dez casos');
must((component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function DomainLab')).match(/^  \['/gm) || []).length === 7, 'galeria não contém sete domínios');
must(css.includes('.tz75-errors button>span:first-child') && css.includes('.tz75-errors button>span:last-child'), 'seletores da Clínica incorretos');
must(css.includes('@media(max-width:380px)'), 'responsividade estreita ausente');
must(matrix.includes('Cobertura: 100%'), 'matriz incompleta');

function extractJoinedArray(name) {
  const declaration = component.indexOf(`const ${name} = [`);
  const expressionStart = component.indexOf('[', declaration);
  const marker = "].join('\\n')";
  const expressionEnd = component.indexOf(marker, expressionStart);
  must(declaration >= 0 && expressionStart >= 0 && expressionEnd >= 0, `${name} ausente`);
  return runInNewContext(component.slice(expressionStart, expressionEnd + marker.length));
}

const program = extractJoinedArray('MAIN_PROGRAM');
const expected = extractJoinedArray('EXPECTED_OUTPUT');
const temp = mkdtempSync(join(tmpdir(), 'java-lesson-075-'));
try {
  const file = join(temp, 'LaboratorioTimezone.java');
  writeFileSync(file, program, 'utf8');
  const compile = spawnSync('javac', [file], { encoding: 'utf8' });
  must(compile.status === 0, `Java não compila:\n${compile.stderr || compile.stdout}`);
  const run = spawnSync('java', ['-cp', temp, 'LaboratorioTimezone'], { encoding: 'utf8' });
  const normalize = value => value.replace(/\r\n/g, '\n').trim();
  must(run.status === 0 && normalize(run.stdout) === normalize(expected), `saída divergente:\n${run.stderr || run.stdout}`);
} finally {
  if (resolve(temp).startsWith(resolve(tmpdir()))) rmSync(temp, { recursive: true, force: true });
}

console.log('LESSON_075_STATIC_JAVA_AND_OUTPUT_OK');
