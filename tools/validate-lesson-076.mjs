import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();
const component = readFileSync(resolve(root, 'plataforma-curso/src/components/GuidedProfessionalEnumLesson076.jsx'), 'utf8');
const css = readFileSync(resolve(root, 'plataforma-curso/src/components/guidedProfessionalEnumLesson.css'), 'utf8');
const viewer = readFileSync(resolve(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const matrix = readFileSync(resolve(root, 'docs/revisao-aulas/matrizes/076_ENUM_PROFISSIONAL.md'), 'utf8');
const must = (condition, message) => { if (!condition) throw new Error('Aula 076: ' + message); };

must(viewer.includes("startsWith('076_')") && viewer.includes('GuidedProfessionalEnumLesson076'), 'integração ausente');
must(component.includes('saved.filter(id => validIds.has(id))'), 'progresso não filtrado');
must(component.includes('completionNormalizedRef') && component.includes("inline: 'center'"), 'normalização ou foco móvel ausente');
must(component.includes('disabled={!hasNextLesson||!lessonComplete}'), 'portão curricular ausente');
must(component.includes('enum StatusPedido') && component.includes('private final String codigo'), 'anatomia do enum incompleta');
must(component.includes('switch (status)') && component.includes('StatusPedido.values()'), 'switch ou values ausente');
must(component.includes('valueOf') && component.includes('fromCode'), 'conversões ausentes');
must(component.includes('ordinal()') && component.includes('toString()') && component.includes('name()'), 'API nativa incompleta');
must((component.slice(component.indexOf('const steps = ['), component.indexOf('export default function')).match(/\bid: '/g) || []).length === 9, 'roteiro não contém nove etapas');
must((component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic')).match(/^  \['/gm) || []).length === 10, 'Clínica não contém dez casos');
must((component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function DomainLab')).match(/^  \['/gm) || []).length === 7, 'galeria não contém sete domínios');
must(css.includes('@media(max-width:380px)'), 'responsividade estreita ausente');
must(matrix.includes('Cobertura: 100%'), 'matriz incompleta');

const programBody = component.match(/const MAIN_PROGRAM = \[([\s\S]*?)\]\.join\('\\n'\);/)?.[1];
const expectedBody = component.match(/const EXPECTED_OUTPUT = \[([\s\S]*?)\]\.join\('\\n'\);/)?.[1];
const extract = body => [...body.matchAll(/^\s*'((?:\\.|[^'])*)',?$/gm)]
  .map(match => match[1].replaceAll("\\'", "'").replaceAll('\\\\', '\\'))
  .join('\n');
const program = programBody && extract(programBody);
const expected = expectedBody && extract(expectedBody);
must(program && expected, 'programa ou saída ausente');

const temp = mkdtempSync(join(tmpdir(), 'java-lesson-076-'));
try {
  const file = join(temp, 'LaboratorioEnum.java');
  writeFileSync(file, program, 'utf8');
  const compile = spawnSync('javac', [file], { encoding: 'utf8' });
  must(compile.status === 0, 'Java não compila:\n' + (compile.stderr || compile.stdout));
  const run = spawnSync('java', ['-cp', temp, 'LaboratorioEnum'], { encoding: 'utf8' });
  const normalize = value => value.replace(/\r\n/g, '\n').trim();
  must(run.status === 0 && normalize(run.stdout) === normalize(expected), 'saída divergente:\n' + (run.stderr || run.stdout));
} finally {
  if (resolve(temp).startsWith(resolve(tmpdir()))) rmSync(temp, { recursive: true, force: true });
}
console.log('LESSON_076_STATIC_JAVA_AND_OUTPUT_OK');
