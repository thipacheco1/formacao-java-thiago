import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();
const component = readFileSync(resolve(root, 'plataforma-curso/src/components/GuidedInputErrorsLesson059.jsx'), 'utf8');
const css = readFileSync(resolve(root, 'plataforma-curso/src/components/guidedInputErrorsLesson.css'), 'utf8');
const viewer = readFileSync(resolve(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const matrix = readFileSync(resolve(root, 'docs/revisao-aulas/matrizes/059_TRATAMENTO_INICIAL_ERROS_ENTRADA.md'), 'utf8');

function must(condition, message) {
  if (!condition) throw new Error(`Aula 059: ${message}`);
}

must(viewer.includes("startsWith('059_')") && viewer.includes('GuidedInputErrorsLesson059'), 'integração ausente no MarkdownViewer');
must(component.includes('saved.filter(id => validIds.has(id))'), 'progresso persistido não filtrado');
must(component.includes('completionNormalizedRef'), 'conclusão antiga não normalizada');
must(component.includes("inline: 'center'"), 'etapa ativa não centralizada no celular');
must(component.includes('disabled={!hasNextLesson || !lessonComplete}'), 'avanço entre aulas sem portão');
must(component.includes('className="guided-error-label"'), 'Clínica de Erros sem rótulo padronizado');
must((component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic')).match(/title:/g) || []).length === 10, 'Clínica de Erros não contém dez casos');
must((component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function DomainsGallery')).match(/id:/g) || []).length === 6, 'Galeria de Domínios não contém seis cenários');

const stepSection = component.slice(component.lastIndexOf('const steps = ['), component.indexOf('export default function'));
must((stepSection.match(/\bid:/g) || []).length === 8, 'roteiro não contém oito etapas');
const handled = new Set([...component.matchAll(/block\.type\s*===\s*'([^']+)'/g)].map(match => match[1]));
const used = [...stepSection.matchAll(/blocks:\s*\[([^\]]*)\]/g)].flatMap(group => [...group[1].matchAll(/type:\s*'([^']+)'/g)].map(match => match[1]));
for (const type of used) must(handled.has(type), `bloco "${type}" sem renderizador`);

must(css.includes('.ie59-errors-nav button > span:first-child'), 'índice da clínica sem seletor restrito');
must(css.includes('.ie59-errors-nav button > span:last-child'), 'rótulo da clínica pode ser esmagado');
must(css.includes('@media (max-width:380px)'), 'responsividade mínima de 320–380px não contemplada');
must(matrix.includes('Cobertura: 100%'), 'matriz sem cobertura consolidada');

const program = component.match(/const GUIDED_PROGRAM_059 = `([\s\S]*?)`;/);
must(program, 'programa Java guiado ausente');
const temp = mkdtempSync(join(tmpdir(), 'java-lesson-059-'));
try {
  const file = join(temp, 'CadastroPedidoResiliente.java');
  writeFileSync(file, program[1], 'utf8');
  const compiled = spawnSync('javac', [file], { encoding: 'utf8' });
  must(compiled.status === 0, `programa guiado não compila:\n${compiled.stderr || compiled.stdout}`);
} finally {
  if (resolve(temp).startsWith(resolve(tmpdir()))) rmSync(temp, { recursive: true, force: true });
}

console.log('LESSON_059_STATIC_AND_JAVA_OK');
