import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();
const component = readFileSync(resolve(root, 'plataforma-curso/src/components/GuidedJvmBytecodeLesson062.jsx'), 'utf8');
const css = readFileSync(resolve(root, 'plataforma-curso/src/components/guidedJvmBytecodeLesson.css'), 'utf8');
const viewer = readFileSync(resolve(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const matrix = readFileSync(resolve(root, 'docs/revisao-aulas/matrizes/062_JVM_BYTECODE_EXECUCAO.md'), 'utf8');
const must = (condition, message) => { if (!condition) throw new Error(`Aula 062: ${message}`); };

must(viewer.includes("startsWith('062_')") && viewer.includes('GuidedJvmBytecodeLesson062'), 'integração ausente');
must(component.includes('saved.filter(id => validIds.has(id))'), 'progresso persistido não filtrado');
must(component.includes('completionNormalizedRef'), 'conclusão antiga não normalizada');
must(component.includes("inline: 'center'"), 'foco móvel da etapa ativa ausente');
must(component.includes('disabled={!hasNextLesson || !lessonComplete}'), 'avanço curricular sem portão');
must(component.includes("document.querySelector('.guided-layout')?.scrollIntoView"), 'troca de etapa não ancora no roteiro');
must(component.includes('className="guided-error-label"'), 'rótulo da Clínica de Erros fora do padrão');
must(component.includes('java Main.java') && component.includes('fluxo clássico'), 'nuance do modo source-file ausente');
must(component.includes('UnsupportedClassVersionError'), 'compatibilidade de bytecode ausente');
must(component.includes('java -cp . ProgramaComDuasClasses'), 'classpath prático ausente');
must(component.includes('System.currentTimeMillis()'), 'alerta sobre benchmark ingênuo ausente');
must(component.includes('java -jar minha-api.jar'), 'ponte para JAR e Spring Boot ausente');

const stepSection = component.slice(component.indexOf('const steps = ['), component.indexOf('export default function'));
must((stepSection.match(/\bid: '/g) || []).length === 10, 'roteiro não contém dez etapas');
for (const type of ['lead', 'pipeline', 'toolkit', 'terminal', 'bytecode', 'loading', 'failures', 'runtime', 'backend', 'errors', 'delivery']) {
  must(component.includes(`block.type === '${type}'`), `bloco ${type} sem renderizador`);
}
const errorSection = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic'));
must((errorSection.match(/^  \['/gm) || []).length === 10, 'Clínica de Erros não contém dez casos');
const checkSection = component.slice(component.indexOf('const CHECKS = ['), component.indexOf('function DeliveryLab'));
must((checkSection.match(/^  '/gm) || []).length === 10, 'entrega não contém dez evidências');
must((component.slice(component.indexOf('const BYTECODE_ROWS = ['), component.indexOf('function BytecodeLab')).match(/^  \['/gm) || []).length === 7, 'leitura guiada não contém sete grupos de bytecode');
must(css.includes('.jvm62-errors button > span:first-child') && css.includes('.jvm62-errors button > span:last-child'), 'seletores da Clínica de Erros incorretos');
must(css.includes('@media (max-width: 380px)') && css.includes('@media (max-width: 560px)'), 'responsividade estreita ausente');
must(matrix.includes('Cobertura: 100%'), 'matriz incompleta');

const program = component.match(/const MAIN_PROGRAM = `([\s\S]*?)`;/);
must(program, 'programa Java principal ausente');
const temp = mkdtempSync(join(tmpdir(), 'java-lesson-062-'));
try {
  const file = join(temp, 'CalculadoraBytecode.java');
  writeFileSync(file, program[1], 'utf8');
  const result = spawnSync('javac', [file], { encoding: 'utf8' });
  must(result.status === 0, `programa principal não compila:\n${result.stderr || result.stdout}`);
  const execution = spawnSync('java', ['-cp', temp, 'CalculadoraBytecode'], { encoding: 'utf8' });
  must(execution.status === 0 && execution.stdout.trim() === 'Resultado: 30', `execução divergente:\n${execution.stderr || execution.stdout}`);
  const disassembly = spawnSync('javap', ['-c', '-classpath', temp, 'CalculadoraBytecode'], { encoding: 'utf8' });
  must(disassembly.status === 0 && disassembly.stdout.includes('invokestatic') && disassembly.stdout.includes('ireturn'), 'javap não confirmou chamada e retorno');
} finally {
  if (resolve(temp).startsWith(resolve(tmpdir()))) rmSync(temp, { recursive: true, force: true });
}

console.log('LESSON_062_STATIC_JAVA_EXECUTION_AND_JAVAP_OK');
