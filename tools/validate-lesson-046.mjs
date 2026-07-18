#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] || process.cwd();
const components = join(root, 'plataforma-curso', 'src', 'components');
const paths = {
  lesson: join(components, 'GuidedUserSizedArraysLesson046.jsx'),
  css: join(components, 'guidedUserSizedArraysLesson.css'),
  route: join(components, 'MarkdownViewer.jsx'),
  matrix: join(root, 'docs', 'revisao-aulas', 'matrizes', '046_ARRAYS_TAMANHO_USUARIO.md')
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

const ERROR_TITLES = [
  'Criar antes de validar', 'Aceitar tamanho negativo',
  'Acessar índice zero de array vazio', 'Usar <= length',
  'Percorrer pela variável alterada', 'Validar o tamanho, mas não a nota',
  'Não impor limite máximo', 'Mostrar índice técnico ao usuário',
  'Boolean não atualizado', 'Tentar adicionar além do tamanho'
];

for (const id of ['mapa', 'validacao', 'programa', 'preenchimento', 'processamento', 'dominios', 'clinica', 'entrega']) {
  const matches = source.lesson?.match(new RegExp(`id: ['"]${id}['"]`, 'g')) || [];
  if (matches.length !== 1) errors.push(`lesson: ID ${id} aparece ${matches.length} vez(es)`);
}

for (const marker of [
  'Prism as SyntaxHighlighter', 'guided-user-sized-arrays-lesson-046-progress',
  'saved.filter', 'completionNormalizedRef', 'GuidedLessonFacts',
  "document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' })",
  'disabled={!hasNextLesson || !lessonComplete}', 'NegativeArraySizeException',
  'InputMismatchException', 'new double[quantidade]', 'notas.length', '(indice + 1)',
  "label: 'Pedidos'", "label: 'Estoque'", "label: 'Atividades por OS'",
  "label: 'Mensageria'", "label: 'Auditoria diária'", "label: 'Pagamentos'", "label: 'SLA'",
  'bug do boolean', 'ArrayList', 'git diff --staged', 'ErroTamanhoNegativo'
]) requireText('lesson', marker);

for (const value of ['-3', '1000000000', "value=\"double\"", "value=\"int\"", "value=\"long\""]) requireText('lesson', value);
for (const title of ERROR_TITLES) requireText('lesson', `title: '${title}'`, `diagnóstico ${title}`);

requireText('route', "startsWith('046_')", 'rota da Aula 046');
requireText('route', 'GuidedUserSizedArraysLesson046');
requireText('matrix', 'Inventário integral e destino didático');

for (const width of ['1050', '760', '560']) requireText('css', `@media (max-width: ${width}px)`);
if (/\:root\s*\{/.test(source.css || '')) errors.push('css: não pode definir :root');
if (/position\s*:\s*fixed/.test(source.css || '')) errors.push('css: não pode usar position fixed');
if (/\.guided-step-nav(?:\s|\{|:|\.)/.test(source.css || '')) errors.push('css: não pode sobrescrever .guided-step-nav');
if (!/\.guided-user-sized-arrays-lesson\s*\{[^}]*overflow\s*:\s*visible/s.test(source.css || '')) errors.push('css: raiz precisa manter overflow visible');

if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('LESSON_046_STATIC_OK');
