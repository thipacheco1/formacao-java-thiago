import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..');
const component=fs.readFileSync(path.join(root,'plataforma-curso/src/components/GuidedCollectionsInsideObjectsLesson137.jsx'),'utf8');
const viewer=fs.readFileSync(path.join(root,'plataforma-curso/src/components/MarkdownViewer.jsx'),'utf8');
const css=fs.readFileSync(path.join(root,'plataforma-curso/src/components/guidedCollectionsInsideObjectsLesson.css'),'utf8');
const need=(text,value,label)=>{if(!text.includes(value))throw new Error(`Ausente: ${label}`)};
need(viewer,"import('./GuidedCollectionsInsideObjectsLesson137')",'lazy import');need(viewer,"startsWith('137_')",'rota');
need(component,'guided-collections-inside-objects-lesson-137-progress','progresso');need(component,'guided-error-label','clínica');
need(css,'@media(max-width:900px)','tablet');need(css,'@media(max-width:560px)','celular');
if(!/completedSteps\.size\s*===\s*steps\.length/.test(component))throw new Error('Gate de conclusão ausente.');
if(!/scrollIntoView\([\s\S]*?inline:\s*["']center["']/.test(component))throw new Error('Foco móvel ausente.');
const sb=component.match(/const steps\s*=\s*\[([\s\S]*?)\];\s*function Block/),eb=component.match(/const ERRORS\s*=\s*\[([\s\S]*?)\];/);
if((sb?[...sb[1].matchAll(/\{id:/g)].length:0)!==11)throw new Error('Esperadas 11 etapas.');
if((eb?[...eb[1].matchAll(/\["/g)].length:0)!==8)throw new Error('Esperados 8 erros.');
const sources={};for(const m of component.matchAll(/const ([A-Z_]+)\s*=\s*`([\s\S]*?)`;/g))sources[m[1]]=m[2];
const files={
 'src/br/com/curso/aula137/exemplo/ruim/PedidoListaExpostaApp.java':'BAD_LIST',
 'src/br/com/curso/aula137/dominio/valor/Dinheiro.java':'MONEY','src/br/com/curso/aula137/dominio/cliente/Cliente.java':'CLIENT',
 'src/br/com/curso/aula137/dominio/pedido/StatusPedido.java':'ORDER_STATUS','src/br/com/curso/aula137/dominio/pedido/ItemPedido.java':'ITEM','src/br/com/curso/aula137/dominio/pedido/Pedido.java':'ORDER',
 'src/br/com/curso/aula137/app/PedidoColecaoProtegidaApp.java':'ORDER_APP','src/br/com/curso/aula137/app/PedidoTentativaAlteracaoExternaApp.java':'ATTEMPT_APP',
 'src/br/com/curso/aula137/dominio/contrato/StatusContrato.java':'CONTRACT_STATUS','src/br/com/curso/aula137/dominio/contrato/ServicoContrato.java':'SERVICE','src/br/com/curso/aula137/dominio/contrato/Contrato.java':'CONTRACT','src/br/com/curso/aula137/app/ContratoColecaoApp.java':'CONTRACT_APP',
 'src/br/com/curso/aula137/dominio/ordemservico/CodigoOs.java':'OS_CODE','src/br/com/curso/aula137/dominio/ordemservico/TurnoAtendimento.java':'TURN','src/br/com/curso/aula137/dominio/ordemservico/StatusOs.java':'OS_STATUS','src/br/com/curso/aula137/dominio/ordemservico/PeriodoAtendimento.java':'PERIOD','src/br/com/curso/aula137/dominio/ordemservico/OcorrenciaOs.java':'OCCURRENCE','src/br/com/curso/aula137/dominio/ordemservico/OrdemServico.java':'OS','src/br/com/curso/aula137/app/OrdemServicoOcorrenciasApp.java':'OS_APP',
 'src/br/com/curso/aula137/dominio/checklist/StatusChecklist.java':'CHECK_STATUS','src/br/com/curso/aula137/dominio/checklist/PerguntaChecklist.java':'QUESTION','src/br/com/curso/aula137/dominio/checklist/Checklist.java':'CHECKLIST','src/br/com/curso/aula137/appchecklist/ChecklistColecaoApp.java':'CHECK_APP','src/br/com/curso/aula137/appchecklist/TesteColecoes137.java':'TESTS'};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'lesson-137-'));try{for(const[file,key]of Object.entries(files)){if(!sources[key])throw new Error(`Fonte ausente: ${key}`);const target=path.join(temp,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,sources[key])}const out=path.join(temp,'out');fs.mkdirSync(out);execFileSync('javac',['-encoding','UTF-8','-d',out,...Object.keys(files)],{cwd:temp,stdio:'pipe'});const runs={
 'br.com.curso.aula137.exemplo.ruim.PedidoListaExpostaApp':['Antes:','itens=2','Depois:','itens=0'],
 'br.com.curso.aula137.app.PedidoColecaoProtegidaApp':['799.70','CRIADO','PAGO'],
 'br.com.curso.aula137.app.PedidoTentativaAlteracaoExternaApp':['externa bloqueada','Itens preservados: 1'],
 'br.com.curso.aula137.app.ContratoColecaoApp':['230.00','RASCUNHO','ATIVO'],
 'br.com.curso.aula137.app.OrdemServicoOcorrenciasApp':['OS-2026-0001','CONCLUIDA','Total de'],
 'br.com.curso.aula137.appchecklist.ChecklistColecaoApp':['CHK-001','FINALIZADO','Perguntas protegidas'],
 'br.com.curso.aula137.appchecklist.TesteColecoes137':['12 testes passaram']};
for(const[main,expected]of Object.entries(runs)){const output=execFileSync('java',['-Dfile.encoding=UTF-8','-cp',out,main],{cwd:temp,encoding:'utf8'});for(const fragment of expected)need(output,fragment,`${main}: ${fragment}`)}console.log('Aula 137 validada: UI, 11 etapas, 8 erros, 24 fontes, 7 execuções e 12 testes.')}finally{fs.rmSync(temp,{recursive:true,force:true})}
