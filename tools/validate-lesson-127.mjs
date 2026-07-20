import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..');
const component=fs.readFileSync(path.join(root,'plataforma-curso/src/components/GuidedAccessModifiersLesson127.jsx'),'utf8');
const viewer=fs.readFileSync(path.join(root,'plataforma-curso/src/components/MarkdownViewer.jsx'),'utf8');
const css=fs.readFileSync(path.join(root,'plataforma-curso/src/components/guidedAccessModifiersLesson.css'),'utf8');
const need=(text,value,label)=>{if(!text.includes(value))throw new Error(`Ausente: ${label}`)};
need(viewer,"import('./GuidedAccessModifiersLesson127')",'lazy import');need(viewer,"startsWith('127_')",'roteamento');need(component,'guided-access-modifiers-lesson-127-progress','persistência');if(!/completedSteps\.size\s*===\s*steps\.length/.test(component))throw new Error('Ausente: gate de etapas');if(!/scrollIntoView\([\s\S]*?inline:\s*["']center["']/.test(component))throw new Error('Ausente: foco móvel');need(css,'.ac127-errors nav button>span:first-child','números da clínica');need(css,'@media(max-width:520px)','mobile');
const stepsBlock=component.match(/const steps\s*=\s*\[([\s\S]*?)\];\s*function Block/);const steps=stepsBlock?[...stepsBlock[1].matchAll(/\{\s*id:\s*"/g)].length:0;const errorsBlock=component.match(/const ERRORS\s*=\s*\[([\s\S]*?)\];/);const errors=errorsBlock?[...errorsBlock[1].matchAll(/\[\s*"/g)].length:0;if(steps!==11)throw new Error(`Etapas: ${steps}`);if(errors!==8)throw new Error(`Erros: ${errors}`);
const constants={};for(const m of component.matchAll(/const ([A-Z_]+)\s*=\s*`([\s\S]*?)`;/g))constants[m[1]]=m[2];
const files={
 'src/br/com/curso/aula127/app/ClienteApp.java':'CLIENTE_APP','src/br/com/curso/aula127/app/DinheiroApp.java':'DINHEIRO_APP','src/br/com/curso/aula127/app/PedidoApp.java':'PEDIDO_APP','src/br/com/curso/aula127/app/ResumoInternoApp.java':'RESUMO_APP','src/br/com/curso/aula127/app/ClienteComOrigemApp.java':'ORIGEM_APP',
 'src/br/com/curso/aula127/dominio/cliente/Cliente.java':'CLIENTE','src/br/com/curso/aula127/dominio/cliente/BaseCadastro.java':'BASE_CADASTRO','src/br/com/curso/aula127/dominio/cliente/ClienteComOrigem.java':'CLIENTE_ORIGEM','src/br/com/curso/aula127/dominio/valor/Dinheiro.java':'DINHEIRO',
 'src/br/com/curso/aula127/dominio/pedido/StatusPedido.java':'STATUS_PEDIDO','src/br/com/curso/aula127/dominio/pedido/Pedido.java':'PEDIDO','src/br/com/curso/aula127/dominio/pedido/CalculadoraResumoPedido.java':'CALCULADORA','src/br/com/curso/aula127/dominio/pedido/PedidoComResumoInterno.java':'PEDIDO_RESUMO',
 'src/br/com/curso/aula127/appcontrato/ContratoApp.java':'CONTRATO_APP','src/br/com/curso/aula127/appcontrato/TesteAcesso127.java':'TESTE','src/br/com/curso/aula127/dominio/contrato/StatusContrato.java':'STATUS_CONTRATO','src/br/com/curso/aula127/dominio/contrato/PeriodoContrato.java':'PERIODO_CONTRATO','src/br/com/curso/aula127/dominio/contrato/ValidadorContrato.java':'VALIDADOR_CONTRATO','src/br/com/curso/aula127/dominio/contrato/Contrato.java':'CONTRATO','src/br/com/curso/aula127/dominio/servico/ServicoContratado.java':'SERVICO'
};
const invalids={
 'AcessoCampo127.java':'INVALID_PRIVATE_FIELD','AcessoConstrutor127.java':'INVALID_PRIVATE_CTOR','AcessoMetodo127.java':'INVALID_PRIVATE_METHOD','AcessoPacote127.java':'INVALID_PACKAGE_CLASS','AcessoProtected127.java':'INVALID_PROTECTED','ClasseTopoPrivada127.java':'INVALID_TOP_PRIVATE'
};
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'lesson-127-'));try{for(const[file,key]of Object.entries(files)){if(!constants[key])throw new Error(`Fonte ausente: ${key}`);const target=path.join(temp,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,constants[key])}const out=path.join(temp,'out');fs.mkdirSync(out);execFileSync('javac',['-d',out,...Object.keys(files)],{cwd:temp,stdio:'pipe'});const runs={
 'br.com.curso.aula127.app.ClienteApp':['Cliente 10','Ativo: true'],
 'br.com.curso.aula127.app.DinheiroApp':['R$ 199.90','Total: R$ 219.90'],
 'br.com.curso.aula127.app.PedidoApp':['Pedido 1001','CRIADO','PAGO'],
 'br.com.curso.aula127.app.ResumoInternoApp':['Pedido: 1001','Status: CRIADO'],
 'br.com.curso.aula127.app.ClienteComOrigemApp':['SISTEMA_INTERNO'],
 'br.com.curso.aula127.appcontrato.ContratoApp':['CONT-127','ATIVO','R$ 200.00'],
 'br.com.curso.aula127.appcontrato.TesteAcesso127':['8 testes passaram']
};for(const[main,expected]of Object.entries(runs)){const output=execFileSync('java',['-cp',out,main],{cwd:temp,encoding:'utf8'});for(const part of expected)need(output,part,`${main}: ${part}`)}for(const[file,key]of Object.entries(invalids)){const dir=fs.mkdtempSync(path.join(temp,'invalid-'));const target=path.join(dir,file);fs.writeFileSync(target,constants[key]);const result=spawnSync('javac',['-cp',out,'-d',dir,target],{cwd:temp,encoding:'utf8'});if(result.status===0)throw new Error(`${key} deveria falhar`)}console.log('Aula 127 validada: UI, 11 etapas, 8 erros, 20 fontes válidas, 6 bloqueios e 7 execuções.')}finally{fs.rmSync(temp,{recursive:true,force:true})}
