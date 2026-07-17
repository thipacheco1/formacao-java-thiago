import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const lessonsDirectory = path.join(repositoryRoot, 'docs', 'aulas');
const reviewDirectory = path.join(repositoryRoot, 'docs', 'revisao-aulas');
const statusPath = path.join(reviewDirectory, 'STATUS_REVISAO.json');
const outputPath = path.join(reviewDirectory, 'CRONOGRAMA_COMPLETO.md');

const statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
const knownStatuses = new Set(Object.keys(statusData.statusDefinitions));

const cleanHeading = (line, fallback) => {
  const title = line?.replace(/^(?:\s*#\s*)+/, '').trim();
  return title || fallback.replaceAll('_', ' ');
};

const moduleOf = (lessonId) => {
  if (lessonId.startsWith('000_')) return 'P0';
  return lessonId.match(/^\d+_(M\d+)_/)?.[1] || 'Outros';
};

const moduleOrder = (module) => {
  if (module === 'P0') return -1;
  return Number(module.match(/^M(\d+)$/)?.[1] ?? 999);
};

const statusLabel = {
  pendente: 'Pendente',
  em_revisao: 'Em revisão',
  refeita: 'Refeita e aprovada',
  bloqueada: 'Bloqueada'
};

const lessons = fs.readdirSync(lessonsDirectory)
  .filter(fileName => fileName.endsWith('.md'))
  .sort((a, b) => a.localeCompare(b, 'en'))
  .map(fileName => {
    const id = fileName.slice(0, -3);
    const firstLine = fs.readFileSync(path.join(lessonsDirectory, fileName), 'utf8').split(/\r?\n/, 1)[0];
    const review = statusData.lessons[id] || { status: 'pendente' };

    if (!knownStatuses.has(review.status)) {
      throw new Error(`Status desconhecido em ${id}: ${review.status}`);
    }

    return {
      id,
      fileName,
      title: cleanHeading(firstLine, id),
      module: moduleOf(id),
      review
    };
  });

for (const lessonId of Object.keys(statusData.lessons)) {
  if (!lessons.some(lesson => lesson.id === lessonId)) {
    throw new Error(`STATUS_REVISAO.json referencia uma aula inexistente: ${lessonId}`);
  }
}

const grouped = Map.groupBy(lessons, lesson => lesson.module);
const modules = [...grouped.keys()].sort((a, b) => moduleOrder(a) - moduleOrder(b));
const countStatus = (items, status) => items.filter(item => item.review.status === status).length;
const totals = Object.fromEntries([...knownStatuses].map(status => [status, countStatus(lessons, status)]));
const numberedLessons = lessons.filter(lesson => !lesson.id.startsWith('000_')).length;

const lines = [
  '# Cronograma completo de reconstrução das aulas',
  '',
  '> Este arquivo é gerado por `node tools/update-lesson-review-schedule.mjs`. Não altere as marcações manualmente; atualize `STATUS_REVISAO.json` e gere novamente.',
  '',
  `Última atualização declarada: **${statusData.updatedAt}**.`,
  '',
  '## Resumo geral',
  '',
  `- Arquivos de aula encontrados: **${lessons.length}**.`,
  `- Aulas numeradas de 001 a 720: **${numberedLessons}**.`,
  '- Aula de abertura 000: **1**.',
  `- Refeitas e aprovadas: **${totals.refeita || 0}**.`,
  `- Em revisão: **${totals.em_revisao || 0}**.`,
  `- Pendentes: **${totals.pendente || 0}**.`,
  `- Bloqueadas: **${totals.bloqueada || 0}**.`,
  '',
  '## Resumo por módulo',
  '',
  '| Módulo | Total | Refeitas | Em revisão | Pendentes | Bloqueadas | Progresso |',
  '|---|---:|---:|---:|---:|---:|---:|'
];

for (const module of modules) {
  const items = grouped.get(module);
  const rebuilt = countStatus(items, 'refeita');
  const percentage = Math.round((rebuilt / items.length) * 100);
  lines.push(`| ${module} | ${items.length} | ${rebuilt} | ${countStatus(items, 'em_revisao')} | ${countStatus(items, 'pendente')} | ${countStatus(items, 'bloqueada')} | ${percentage}% |`);
}

lines.push(
  '',
  '## Legenda',
  '',
  '- `[x] Refeita e aprovada`: nova experiência implementada, validada e aprovada.',
  '- `[ ] Em revisão`: trabalho iniciado, ainda sem aprovação final.',
  '- `[ ] Pendente`: ainda não reconstruída.',
  '- `[ ] Bloqueada`: existe uma dependência registrada no estado.',
  '',
  '## Ordem de trabalho',
  '',
  'A ordem padrão é numérica, preservando pré-requisitos. Uma aula pode ser antecipada para criar ou validar um arquétipo visual, desde que isso seja registrado no estado e não seja confundido com conclusão das aulas anteriores.',
  ''
);

for (const module of modules) {
  const items = grouped.get(module);
  lines.push(`## ${module} — ${items.length} ${items.length === 1 ? 'aula' : 'aulas'}`, '');

  for (const lesson of items) {
    const checked = lesson.review.status === 'refeita' ? 'x' : ' ';
    const relativeLessonPath = `../aulas/${encodeURI(lesson.fileName)}`;
    const approval = lesson.review.approvedByUser ? ' · aprovada pelo responsável' : '';
    lines.push(`- [${checked}] **${statusLabel[lesson.review.status]}** — [${lesson.title}](${relativeLessonPath})${approval}`);
    if (lesson.review.summary) lines.push(`  - ${lesson.review.summary}`);
    if (lesson.review.referenceFiles?.length) {
      lines.push('  - Referências:');
      for (const reference of lesson.review.referenceFiles) {
        const relativeReference = path.relative(reviewDirectory, path.join(repositoryRoot, reference)).replaceAll('\\', '/');
        lines.push(`    - [\`${reference}\`](${encodeURI(relativeReference)})`);
      }
    }
  }

  lines.push('');
}

fs.mkdirSync(reviewDirectory, { recursive: true });
fs.writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
console.log(`Cronograma gerado: ${path.relative(repositoryRoot, outputPath)} (${lessons.length} aulas).`);
