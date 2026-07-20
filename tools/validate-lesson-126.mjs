import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..');
const component=fs.readFileSync(path.join(root,'plataforma-curso/src/components/GuidedDomainPackagesLesson126.jsx'),'utf8');
const viewer=fs.readFileSync(path.join(root,'plataforma-curso/src/components/MarkdownViewer.jsx'),'utf8');
const css=fs.readFileSync(path.join(root,'plataforma-curso/src/components/guidedDomainPackagesLesson.css'),'utf8');
const need=(text,value,label)=>{if(!text.includes(value))throw new Error(`Ausente: ${label}`)};
need(viewer,"import('./GuidedDomainPackagesLesson126')",'lazy import');need(viewer,"startsWith('126_')",'roteamento');need(component,'guided-domain-packages-lesson-126-progress','persistência');if(!/completedSteps\.size\s*===\s*steps\.length/.test(component))throw new Error('Ausente: conclusão por etapas');if(!/scrollIntoView\([\s\S]*?inline:\s*["']center["']/.test(component))throw new Error('Ausente: foco móvel');need(css,'.pk126-errors nav button>span:first-child','números da clínica');need(css,'@media(max-width:520px)','mobile');
const steps=[...component.matchAll(/\{\s*id:\s*"[^"]+",\s*label:/g)].length;const errorsBlock=component.match(/const ERRORS\s*=\s*\[([\s\S]*?)\];/);const errors=errorsBlock?[...errorsBlock[1].matchAll(/\[\s*"/g)].length:0;if(steps!==11)throw new Error(`Etapas: ${steps}`);if(errors!==8)throw new Error(`Erros: ${errors}`);
const constants={};for(const m of component.matchAll(/const ([A-Z_]+)\s*=\s*`([\s\S]*?)`;/g))constants[m[1]]=m[2];
const files={
 'src/br/com/curso/aula126/app/PedidoApp.java':'PEDIDO_APP','src/br/com/curso/aula126/dominio/cliente/Cliente.java':'CLIENTE','src/br/com/curso/aula126/dominio/pedido/Pedido.java':'PEDIDO','src/br/com/curso/aula126/dominio/pedido/StatusPedido.java':'STATUS_PEDIDO','src/br/com/curso/aula126/dominio/valor/Dinheiro.java':'DINHEIRO',
 'src/br/com/curso/aula126/appos/OrdemServicoApp.java':'OS_APP','src/br/com/curso/aula126/dominio/os/CodigoOs.java':'CODIGO_OS','src/br/com/curso/aula126/dominio/os/TurnoAtendimento.java':'TURNO','src/br/com/curso/aula126/dominio/os/StatusOs.java':'STATUS_OS','src/br/com/curso/aula126/dominio/os/PeriodoAtendimento.java':'PERIODO_OS','src/br/com/curso/aula126/dominio/os/OrdemServico.java':'ORDEM_SERVICO',
 'src/br/com/curso/aula126/appcontrato/ContratoApp.java':'CONTRATO_APP','src/br/com/curso/aula126/appcontrato/TestePacotes126.java':'TESTE','src/br/com/curso/aula126/dominio/contrato/Contrato.java':'CONTRATO','src/br/com/curso/aula126/dominio/contrato/PeriodoContrato.java':'PERIODO_CONTRATO','src/br/com/curso/aula126/dominio/contrato/StatusContrato.java':'STATUS_CONTRATO','src/br/com/curso/aula126/dominio/servico/ServicoContratado.java':'SERVICO'
};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'lesson-126-'));try{for(const[file,key]of Object.entries(files)){if(!constants[key])throw new Error(`Fonte ausente: ${key}`);const target=path.join(temp,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,constants[key])}const out=path.join(temp,'out');fs.mkdirSync(out);execFileSync('javac',['-d',out,...Object.keys(files)],{cwd:temp,stdio:'pipe'});const runs={
 'br.com.curso.aula126.app.PedidoApp':['Pedido 1001','CRIADO','PAGO'],
 'br.com.curso.aula126.appos.OrdemServicoApp':['OS-2026-0001','REAGENDADA','2026-07-22'],
 'br.com.curso.aula126.appcontrato.ContratoApp':['CONT-126','ATIVO','R$ 200.00'],
 'br.com.curso.aula126.appcontrato.TestePacotes126':['8 testes passaram']
};for(const[main,expected]of Object.entries(runs)){const output=execFileSync('java',['-cp',out,main],{cwd:temp,encoding:'utf8'});for(const part of expected)need(output,part,`${main}: ${part}`)}console.log('Aula 126 validada: UI, 11 etapas, 8 erros, 17 fontes em pacotes e 4 execuções qualificadas.')}finally{fs.rmSync(temp,{recursive:true,force:true})}
