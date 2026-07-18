import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();
const component = readFileSync(resolve(root, 'plataforma-curso/src/components/GuidedFundamentalsDebugLesson060.jsx'), 'utf8');
const css = readFileSync(resolve(root, 'plataforma-curso/src/components/guidedFundamentalsDebugLesson.css'), 'utf8');
const viewer = readFileSync(resolve(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const matrix = readFileSync(resolve(root, 'docs/revisao-aulas/matrizes/060_DEBUG_APLICADO_FUNDAMENTOS.md'), 'utf8');
const must = (condition, message) => { if (!condition) throw new Error(`Aula 060: ${message}`); };

must(viewer.includes("startsWith('060_')") && viewer.includes('GuidedFundamentalsDebugLesson060'), 'integração ausente');
must(component.includes('saved.filter(id => validIds.has(id))'), 'progresso não filtrado');
must(component.includes('completionNormalizedRef'), 'conclusão não normalizada');
must(component.includes("inline: 'center'"), 'foco móvel ausente');
must(component.includes('disabled={!hasNextLesson || !lessonComplete}'), 'avanço sem portão');
must(component.includes('Simulação didática'), 'mock da IDE não identificado');
must(component.includes('className="guided-error-label"'), 'rótulo da clínica fora do padrão');
must((component.slice(component.indexOf('const ERRORS = ['), component.indexOf('function ErrorsClinic')).match(/^  \[/gm) || []).length === 10, 'clínica não contém dez erros');
must((component.slice(component.indexOf('const DOMAINS = ['), component.indexOf('function DomainsGallery')).match(/label:/g) || []).length === 6, 'galeria não contém seis domínios');
const stepSection = component.slice(component.lastIndexOf('const steps = ['), component.indexOf('export default function'));
must((stepSection.match(/\bid:/g) || []).length === 9, 'roteiro não contém nove etapas');
const handled = new Set([...component.matchAll(/block\.type\s*===\s*'([^']+)'/g)].map(match => match[1]));
for (const group of stepSection.matchAll(/blocks:\s*\[([^\]]*)\]/g)) for (const match of group[1].matchAll(/type:\s*'([^']+)'/g)) must(handled.has(match[1]), `bloco ${match[1]} sem renderizador`);
must(css.includes('.db60-errors-nav button > span:first-child') && css.includes('.db60-errors-nav button > span:last-child'), 'clínica com seletores incorretos');
must(css.includes('@media (max-width:380px)'), 'responsividade estreita ausente');
must(matrix.includes('Cobertura: 100%'), 'matriz incompleta');

const program = component.match(/const GUIDED_PROGRAM_060 = `([\s\S]*?)`;/);
must(program, 'programa guiado ausente');
const temp = mkdtempSync(join(tmpdir(), 'java-lesson-060-'));
try {
  const file = join(temp, 'OficinaDebugFundamentos.java');
  writeFileSync(file, program[1], 'utf8');
  const result = spawnSync('javac', [file], { encoding: 'utf8' });
  must(result.status === 0, `programa não compila:\n${result.stderr || result.stdout}`);
} finally {
  if (resolve(temp).startsWith(resolve(tmpdir()))) rmSync(temp, { recursive: true, force: true });
}
console.log('LESSON_060_STATIC_AND_JAVA_OK');
