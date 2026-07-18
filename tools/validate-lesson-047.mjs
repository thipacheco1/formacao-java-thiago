#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] || process.cwd();
const components = join(root, 'plataforma-curso', 'src', 'components');
const paths = {
  lesson: join(components, 'GuidedArrayModificationLesson047.jsx'),
  css: join(components, 'guidedArrayModificationLesson.css'),
  route: join(components, 'MarkdownViewer.jsx'),
  matrix: join(root, 'docs', 'revisao-aulas', 'matrizes', '047_ALTERACAO_POSICOES_ARRAY.md')
};

const errors = [];
const source = {};
for (const [name, path] of Object.entries(paths)) {
  if (!existsSync(path)) errors.push(`arquivo ausente: ${name} -> ${path}`);
  else source[name] = readFileSync(path, 'utf8');
}

const requireText = (file, text, label = text) => {
  if (!source[file]?.includes(text)) errors.push(`${file}: falta ${label}`);
};

for (const id of ['mutabilidade', 'mapeamento', 'seguranca', 'auditoria', 'recalculo', 'dominios', 'clinica', 'entrega']) {
  const matches = source.lesson?.match(new RegExp(`id: ['"]${id}['"]`, 'g')) || [];
  if (matches.length !== 1) errors.push(`lesson: ID ${id} aparece ${matches.length} vez(es)`);
}

for (const marker of [
  'Prism as SyntaxHighlighter', 'guided-array-modification-lesson-047-progress',
  'saved.filter', 'completionNormalizedRef', 'GuidedLessonFacts',
  "document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' })",
  'disabled={!hasNextLesson || !lessonComplete}', 'ArrayIndexOutOfBoundsException',
  'posicaoUsuario - 1', 'valorAntigo', 'total = total - valorAntigo + valorNovo',
  "label: 'Ajuste de Estoque'", "label: 'Pedido (Centavos)'", "label: 'Atividades por OS'",
  "label: 'Mensageria'", "label: 'Ajuste SLA (double)'", "label: 'Normalização em Lote'",
  "label: 'Teto de Valores (Clipping)'", "label: 'Auditoria por Dia'",
  "label: 'Aumento em Lote'", "label: 'Substituir Zeros'",
  'Total atualizado: 140', 'Total ajustado: 6000', 'dados diferentes',
  'ErroIndiceInvalido.java', 'git diff --staged'
]) requireText('lesson', marker);

const errorTitles = [
  'Achar que atribuição muda o tamanho', 'Usar posição amigável como índice direto',
  'Não validar o índice antes de alterar', 'Deixar de validar limites do novo valor',
  'Esquecer de salvar o valor anterior', 'Manter acumuladores desatualizados',
  'Confundir valor padrão com entrada', 'Usar <= no limite do loop de percurso',
  'Substituir todos quando queria um só', 'Mudar e não inspecionar o resultado'
];
for (const title of errorTitles) requireText('lesson', `title: '${title}'`, `diagnóstico ${title}`);

requireText('route', "startsWith('047_')", 'rota da Aula 047');
requireText('route', 'GuidedArrayModificationLesson047');
requireText('matrix', 'Inventário integral e destino didático');

for (const width of ['1024', '768', '520']) requireText('css', `@media (max-width: ${width}px)`);
if (/\:root\s*\{/.test(source.css || '')) errors.push('css: não pode definir :root');
if (/position\s*:\s*fixed/.test(source.css || '')) errors.push('css: não pode usar position fixed');
if (/\.guided-step-nav(?:\s|\{|:|\.)/.test(source.css || '')) errors.push('css: não pode sobrescrever .guided-step-nav');
if (!/\.guided-array-modification-lesson\s*\{[^}]*overflow\s*:\s*visible/s.test(source.css || '')) errors.push('css: raiz precisa manter overflow visible');

if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('LESSON_047_STATIC_OK');
