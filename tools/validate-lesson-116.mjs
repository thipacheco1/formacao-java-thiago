import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('plataforma-curso/src/components/GuidedValueObjectsLesson116.jsx', root), 'utf8');
const css = readFileSync(new URL('plataforma-curso/src/components/guidedValueObjectsLesson.css', root), 'utf8');
const viewer = readFileSync(new URL('plataforma-curso/src/components/MarkdownViewer.jsx', root), 'utf8');
const source = readFileSync(new URL('docs/aulas/116_M4_12_OBJETOS_DE_VALOR_OFICIAL.md', root), 'utf8');
const matrix = readFileSync(new URL('docs/revisao-aulas/matrizes/116_OBJETOS_DE_VALOR.md', root), 'utf8');
const has = (text, value, label = value) => assert.ok(text.includes(value), label);
for (const value of ["import GuidedValueObjectsLesson116 from './GuidedValueObjectsLesson116';", "startsWith('116_')", '<GuidedValueObjectsLesson116 {...props} />']) has(viewer, value);
for (const value of ['guided-value-objects-lesson-116-progress', 'validIds.has(id)', 'inline:', '.guided-layout', 'disabled={!stepDone}', 'disabled={!hasNextLesson || !lessonComplete}', 'guided-error-label']) has(component, value);
const steps = component.slice(component.indexOf('const steps = ['), component.indexOf('function ContentBlock'));
assert.equal((steps.match(/id: ["']/g) || []).length, 11, 'onze etapas');
const errors = component.slice(component.indexOf('const ERRORS = ['), component.indexOf('const EVIDENCE'));
assert.equal((errors.match(/^  \[/gm) || []).length, 8, 'oito erros');
for (const value of ['.guided-value-objects-lesson', 'max-width: 100%', '.vo116-errors nav button > span:first-child', '900px', '680px', '520px', '380px', '320px']) has(css, value, `CSS ${value}`);
for (const concept of ['objeto de valor', 'entidade', 'Email', 'Dinheiro', 'Telefone', 'Período', 'imutabilidade', 'BigDecimal', 'LocalDate', 'record', 'Ordem de Serviço']) for (const [label, text] of [['fonte', source], ['experiência', component], ['matriz', matrix]]) assert.ok(text.toLocaleLowerCase('pt-BR').includes(concept.toLocaleLowerCase('pt-BR')), `${label}: ${concept}`);
function extract(name) { const marker = `const ${name} = ` + '`'; const start = component.indexOf(marker); assert.notEqual(start, -1, name); const begin = start + marker.length; const end = component.indexOf('`;', begin); return component.slice(begin, end); }
const files = [['LOOSE_SOURCE','PedidoComDadosSoltos.java'],['VALUES_SOURCE','OficinaObjetosValor.java'],['PEDIDO_SOURCE','PedidoComObjetosDeValor.java'],['OS_SOURCE','ObjetosValorOrdemServico.java'],['TEST_SOURCE','TesteObjetosValor.java']];
const temp = mkdtempSync(join(tmpdir(), 'lesson-116-'));
try {
  for (const [constant,file] of files) writeFileSync(join(temp,file), extract(constant), 'utf8');
  execFileSync('javac', ['-encoding','UTF-8',...files.map(([,file]) => file)], { cwd: temp, stdio: 'pipe' });
  const runs = [['PedidoComDadosSoltos',['anaemail.com','-150.00']],['OficinaObjetosValor',['ana.silva@empresa.com','R$ 197.91','(11) 999999999','dias=3']],['PedidoComObjetosDeValor',['Pedido 1001','R$ 399.80']],['ObjetosValorOrdemServico',['OS-2026-0001','Pode reagendar: true']],['TesteObjetosValor',['8 testes passaram']]];
  for (const [main,expected] of runs) { const output = execFileSync('java',['-cp',temp,main],{cwd:temp,encoding:'utf8'}); for (const value of expected) has(output,value,`${main}: ${value}`); }
} finally { rmSync(temp,{recursive:true,force:true}); }
console.log('Aula 116 validada: onze etapas, cinco fontes, objetos de valor, imutabilidade, composição, OS e testes conferidos.');
