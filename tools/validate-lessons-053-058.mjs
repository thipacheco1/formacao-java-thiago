import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = process.cwd();

const lessons = [
  {
    id: '053', steps: 9, domains: 7, prefix: 'v53',
    component: 'plataforma-curso/src/components/GuidedVoidMethodsLesson053.jsx',
    css: 'plataforma-curso/src/components/guidedVoidMethodsLesson.css',
    matrix: 'docs/revisao-aulas/matrizes/053_METODOS_SEM_RETORNO.md',
    required: ['normalizarStatus', 'int[][]', 'GUIDED_PROGRAM_053', 'Exemplo guiado antes do desafio']
  },
  {
    id: '054', steps: 9, domains: 9, prefix: 'r54',
    component: 'plataforma-curso/src/components/GuidedMethodsWithReturnLesson054.jsx',
    css: 'plataforma-curso/src/components/guidedMethodsWithReturnLesson.css',
    matrix: 'docs/revisao-aulas/matrizes/054_METODOS_COM_RETORNO.md',
    required: ['buscarCliente', 'calcularMedia', 'GUIDED_PROGRAM_054', 'Exemplo guiado antes do desafio']
  },
  {
    id: '055', steps: 8, domains: 7, prefix: 'p55',
    component: 'plataforma-curso/src/components/GuidedMethodsWithParamsLesson055.jsx',
    css: 'plataforma-curso/src/components/guidedMethodsWithParamsLesson.css',
    matrix: 'docs/revisao-aulas/matrizes/055_METODOS_COM_PARAMETROS.md',
    required: ['static double calcularMedia', 'static boolean podeProcessar', 'int[][]', 'GUIDED_PROGRAM_055']
  },
  {
    id: '056', steps: 7, domains: 7, prefix: 'v56',
    component: 'plataforma-curso/src/components/GuidedOverloadLesson056.jsx',
    css: 'plataforma-curso/src/components/guidedOverloadLesson.css',
    matrix: 'docs/revisao-aulas/matrizes/056_SOBRECARGA_METODOS.md',
    required: ['static int somar(int[]', 'statusValido', 'GUIDED_PROGRAM_056', 'Exemplo guiado antes do desafio']
  },
  {
    id: '057', steps: 7, domains: 7, prefix: 'v57',
    component: 'plataforma-curso/src/components/GuidedScopeLesson057.jsx',
    css: 'plataforma-curso/src/components/guidedScopeLesson.css',
    matrix: 'docs/revisao-aulas/matrizes/057_ESCOPO_DE_VARIAVEIS.md',
    required: ['while (', 'OficinaEscopo.status', 'GUIDED_PROGRAM_057', 'Exemplo guiado antes do desafio']
  },
  {
    id: '058', steps: 7, domains: 10, prefix: 'v58',
    component: 'plataforma-curso/src/components/GuidedValueRefPassingLesson058.jsx',
    css: 'plataforma-curso/src/components/guidedValueRefPassingLesson.css',
    matrix: 'docs/revisao-aulas/matrizes/058_PASSAGEM_DE_VALORES_E_REFERENCIAS.md',
    required: ['alterarLong', 'alterarDouble', 'alterarBoolean', 'trocarArray', 'GUIDED_PROGRAM_058']
  }
];

const clinicCss = [
  ['049', 'as49', 'plataforma-curso/src/components/guidedArrayStatsLesson.css'],
  ['050', 'str50', 'plataforma-curso/src/components/guidedStringArrayLesson.css'],
  ['051', 'p51', 'plataforma-curso/src/components/guidedArrayParallelLesson.css'],
  ['052', 'm52', 'plataforma-curso/src/components/guidedMatrixInitialLesson.css'],
  ...lessons.map(lesson => [lesson.id, lesson.prefix, lesson.css])
];

function must(condition, message) {
  if (!condition) throw new Error(message);
}

function sectionCount(source, startMarker, endMarker, token) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  must(start >= 0 && end > start, `Seção ausente: ${startMarker}`);
  return (source.slice(start, end).match(token) || []).length;
}

const compilationDir = mkdtempSync(join(tmpdir(), 'java-lessons-053-058-'));

try {
  for (const lesson of lessons) {
    for (const file of [lesson.component, lesson.css, lesson.matrix]) {
      must(existsSync(resolve(root, file)), `Aula ${lesson.id}: arquivo ausente: ${file}`);
    }

    const component = readFileSync(resolve(root, lesson.component), 'utf8');
    const css = readFileSync(resolve(root, lesson.css), 'utf8');
    const matrix = readFileSync(resolve(root, lesson.matrix), 'utf8');

    must(component.includes('import React, { useEffect, useRef, useState }'), `Aula ${lesson.id}: hooks fora do padrão`);
    must(component.includes('saved.filter(id => validIds.has(id))'), `Aula ${lesson.id}: progresso persistido não filtrado`);
    must(component.includes('completionNormalizedRef'), `Aula ${lesson.id}: conclusão inconsistente não normalizada`);
    must(component.includes("inline: 'center'"), `Aula ${lesson.id}: etapa ativa não centralizada no celular`);
    must(component.includes('className="guided-error-label"'), `Aula ${lesson.id}: título da clínica não usa o padrão legível`);
    must(component.includes('disabled={!hasNextLesson || !lessonComplete}'), `Aula ${lesson.id}: avanço entre aulas sem portão`);
    must(!component.includes('jacac '), `Aula ${lesson.id}: comando jacac inválido`);
    must(!/javac [^`\n]*\.java,/.test(component), `Aula ${lesson.id}: javac usa vírgula entre arquivos`);
    must(sectionCount(component, 'const ERRORS = [', 'function ErrorsClinic', /\btitle:/g) === 10, `Aula ${lesson.id}: clínica não contém 10 erros`);
    must(sectionCount(component, 'const DOMAINS = [', 'function DomainsGallery', /\bid:/g) === lesson.domains, `Aula ${lesson.id}: quantidade de domínios divergente`);

    const mainSteps = component.slice(component.lastIndexOf('const steps = ['), component.indexOf('// ── Componente Principal'));
    must((mainSteps.match(/\bid:/g) || []).length === lesson.steps, `Aula ${lesson.id}: quantidade de etapas divergente`);

    const handledBlockTypes = new Set(
      [...component.matchAll(/block\.type\s*===\s*'([^']+)'/g)].map(match => match[1])
    );
    const usedBlockTypes = [...mainSteps.matchAll(/blocks:\s*\[([^\]]*)\]/g)]
      .flatMap(blocks => [...blocks[1].matchAll(/type:\s*'([^']+)'/g)].map(match => match[1]));
    for (const blockType of usedBlockTypes) {
      must(handledBlockTypes.has(blockType), `Aula ${lesson.id}: bloco "${blockType}" não possui renderizador`);
    }

    for (const term of lesson.required) {
      must(component.includes(term), `Aula ${lesson.id}: cobertura ausente: ${term}`);
    }

    must(matrix.includes('Cobertura: 100%'), `Aula ${lesson.id}: matriz sem cobertura consolidada`);
    must(css.includes(`.${lesson.prefix}-errors-nav button > span:first-child`), `Aula ${lesson.id}: índice da clínica sem seletor restrito`);
    must(css.includes(`.${lesson.prefix}-errors-nav button > span:last-child { min-width: 0; }`), `Aula ${lesson.id}: rótulo da clínica pode ser esmagado`);
    must(css.lastIndexOf(`.${lesson.prefix}-errors-nav { flex-direction: row`) > css.indexOf(`.${lesson.prefix}-errors-nav {`), `Aula ${lesson.id}: override móvel da clínica não está no final da cascata`);
    must(css.lastIndexOf(`.${lesson.prefix}-domains-sidebar, .${lesson.prefix}-errors-nav`) >= 0, `Aula ${lesson.id}: galerias não usam trilho móvel responsivo`);

    const programMatch = component.match(new RegExp('const GUIDED_PROGRAM_' + lesson.id + ' = `([\\s\\S]*?)`;'));
    must(programMatch, `Aula ${lesson.id}: programa guiado completo não encontrado`);
    const classMatch = programMatch[1].match(/public class\s+(\w+)/);
    must(classMatch, `Aula ${lesson.id}: classe pública do programa guiado não encontrada`);
    const javaFile = join(compilationDir, `${classMatch[1]}.java`);
    writeFileSync(javaFile, programMatch[1], 'utf8');
    const compiled = spawnSync('javac', [javaFile], { encoding: 'utf8' });
    must(compiled.status === 0, `Aula ${lesson.id}: programa guiado não compila:\n${compiled.stderr || compiled.stdout}`);
  }

  for (const [id, prefix, file] of clinicCss) {
    const css = readFileSync(resolve(root, file), 'utf8');
    must(css.includes(`.${prefix}-errors-nav button > span:first-child`), `Aula ${id}: menu da clínica ainda estiliza o rótulo como círculo`);
    must(!css.includes(`.${prefix}-errors-nav button span {`), `Aula ${id}: seletor amplo da clínica voltou ao CSS`);
  }

  console.log('LESSONS_053_058_STATIC_AND_JAVA_OK');
} finally {
  const safeTempRoot = resolve(tmpdir());
  const resolvedCompilationDir = resolve(compilationDir);
  if (resolvedCompilationDir.startsWith(safeTempRoot)) {
    rmSync(resolvedCompilationDir, { recursive: true, force: true });
  }
}
