import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COURSE_MODULES, COURSE_PHASES, COURSE_TOTAL_LESSONS } from '../plataforma-curso/src/data/coursePlan.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reviewDir = path.join(root, 'docs', 'revisao-aulas');
const lessonsDir = path.join(root, 'docs', 'aulas');
const componentsDir = path.join(root, 'plataforma-curso', 'src', 'components');
const status = JSON.parse(fs.readFileSync(path.join(reviewDir, 'STATUS_REVISAO.json'), 'utf8'));
const continuation = status.continuation;
const fail = message => { throw new Error(`Continuidade editorial inválida: ${message}`); };
const requireCondition = (condition, message) => { if (!condition) fail(message); };
const lessonNumber = value => String(value).padStart(3, '0');

requireCondition(continuation, 'STATUS_REVISAO.json não possui o objeto continuation');
requireCondition(Number.isInteger(continuation.lastImplementedLesson), 'lastImplementedLesson precisa ser inteiro');
requireCondition(continuation.nextAuthorizedLesson === continuation.lastImplementedLesson + 1, 'nextAuthorizedLesson precisa ser a aula imediatamente seguinte');
requireCondition(continuation.milestoneTargetLesson >= continuation.lastImplementedLesson, 'o alvo do marco não pode ficar antes da última aula implementada');

const lessonFiles = fs.readdirSync(lessonsDir).filter(file => file.endsWith('.md')).sort();
requireCondition(lessonFiles.length === COURSE_TOTAL_LESSONS, `esperadas ${COURSE_TOTAL_LESSONS} aulas, encontradas ${lessonFiles.length}`);
const lessonByNumber = new Map(lessonFiles.map(file => [Number(file.slice(0, 3)), file]));
for (let number = 0; number < COURSE_TOTAL_LESSONS; number += 1) {
  requireCondition(lessonByNumber.has(number), `arquivo da Aula ${lessonNumber(number)} ausente`);
}

const guidedNumbers = [...new Set(fs.readdirSync(componentsDir)
  .map(file => file.match(/^Guided.+Lesson(\d{3})\.jsx$/)?.[1])
  .filter(Boolean)
  .map(Number))].sort((a, b) => a - b);
requireCondition(guidedNumbers.length > 0, 'nenhum componente guiado encontrado');
requireCondition(guidedNumbers.at(-1) === continuation.lastImplementedLesson, `último componente guiado é ${guidedNumbers.at(-1)}, mas o estado declara ${continuation.lastImplementedLesson}`);
for (let number = 0; number <= continuation.lastImplementedLesson; number += 1) {
  requireCondition(guidedNumbers.includes(number), `componente guiado da Aula ${lessonNumber(number)} ausente antes do marco`);
}
requireCondition(!guidedNumbers.includes(continuation.nextAuthorizedLesson), `Aula ${lessonNumber(continuation.nextAuthorizedLesson)} já possui componente, mas não foi promovida a lastImplementedLesson`);

const trackedKeys = Object.keys(status.lessons);
const lastPrefix = `${lessonNumber(continuation.lastImplementedLesson)}_`;
const lastKey = trackedKeys.find(key => key.startsWith(lastPrefix));
requireCondition(lastKey === continuation.lastImplementedLessonId, 'lastImplementedLessonId não corresponde à entrada rastreada');
requireCondition(status.lessons[lastKey]?.status === continuation.lastImplementedStatus, 'lastImplementedStatus diverge do estado real da aula');
for (let number = 0; number <= continuation.lastImplementedLesson; number += 1) {
  requireCondition(trackedKeys.some(key => key.startsWith(`${lessonNumber(number)}_`)), `Aula ${lessonNumber(number)} implementada sem entrada em STATUS_REVISAO.json`);
}

const nextFile = lessonByNumber.get(continuation.nextAuthorizedLesson);
requireCondition(nextFile?.replace(/\.md$/, '') === continuation.nextAuthorizedLessonId, 'nextAuthorizedLessonId não corresponde ao arquivo curricular');
const targetFile = lessonByNumber.get(continuation.milestoneTargetLesson);
requireCondition(Boolean(targetFile), `arquivo da meta ${continuation.milestoneTargetLesson} ausente`);

const lastReview = status.lessons[lastKey];
for (const reference of lastReview.referenceFiles || []) {
  requireCondition(fs.existsSync(path.join(root, reference)), `referência da última aula não existe: ${reference}`);
}

const viewer = fs.readFileSync(path.join(componentsDir, 'MarkdownViewer.jsx'), 'utf8');
const lastNumber = lessonNumber(continuation.lastImplementedLesson);
requireCondition(new RegExp(`Lesson${lastNumber}\\s*=\\s*lazy\\(`).test(viewer), `Aula ${lastNumber} não está importada com React.lazy`);
requireCondition(viewer.includes(`startsWith('${lastNumber}_')`), `MarkdownViewer não seleciona a Aula ${lastNumber} pelo prefixo exato`);

const basePhase = COURSE_PHASES.find(phase => phase.id === 'base');
requireCondition(basePhase?.modules.join(',') === 'P0,M0,M1,M2,M3,M4', 'a Fase 1 não contém a sequência oficial P0–M4');
const m4 = COURSE_MODULES.find(module => module.id === 'M4');
requireCondition(m4?.range === '105-145', 'o M4 não termina oficialmente na Aula 145');

const planPath = path.join(root, continuation.continuationPlan);
requireCondition(fs.existsSync(planPath), `plano de continuação ausente: ${continuation.continuationPlan}`);
const plan = fs.readFileSync(planPath, 'utf8');
requireCondition(plan.includes(`Próxima aula autorizada: **${continuation.nextAuthorizedLesson}`), 'plano não declara a próxima aula autorizada');
requireCondition(plan.includes(`Aula **146** inicia a Fase 2`), 'plano atual não preserva a fronteira entre as fases 1 e 2');

const readme = fs.readFileSync(path.join(reviewDir, 'README.md'), 'utf8');
requireCondition(readme.includes(continuation.continuationPlan.split('/').at(-1)), 'README não aponta para o plano de continuação');
requireCondition(readme.includes(`Próxima aula autorizada: **${continuation.nextAuthorizedLesson}`), 'README não declara a próxima aula autorizada');

console.log(`Continuidade validada: aulas 000–${lastNumber} implementadas; próxima ${lessonNumber(continuation.nextAuthorizedLesson)}; marco até ${lessonNumber(continuation.milestoneTargetLesson)}.`);

