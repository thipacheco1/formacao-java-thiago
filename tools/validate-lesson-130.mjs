import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const component = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/GuidedObjectCollaborationLesson130.jsx'), 'utf8');
const viewer = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/guidedObjectCollaborationLesson.css'), 'utf8');
const need = (text, value, label) => { if (!text.includes(value)) throw new Error(`Ausente: ${label}`); };

need(viewer, "import('./GuidedObjectCollaborationLesson130')", 'lazy import');
need(viewer, "startsWith('130_')", 'roteamento');
need(component, 'guided-object-collaboration-lesson-130-progress', 'persistência');
if (!/completedSteps\.size\s*===\s*steps\.length/.test(component)) throw new Error('gate ausente');
if (!/scrollIntoView\([\s\S]*?inline:\s*["']center["']/.test(component)) throw new Error('foco mobile ausente');
need(css, '.oc130-errors>nav button>span:first-child', 'clínica estável');
need(css, '@media(max-width:900px)', 'mobile');

const stepsBlock = component.match(/const steps\s*=\s*\[([\s\S]*?)\];\s*function Block/);
const steps = stepsBlock ? [...stepsBlock[1].matchAll(/\{id:/g)].length : 0;
const errorsBlock = component.match(/const ERRORS\s*=\s*\[([\s\S]*?)\];/);
const errors = errorsBlock ? [...errorsBlock[1].matchAll(/\["/g)].length : 0;
if (steps !== 11) throw new Error(`Etapas: ${steps}`);
if (errors !== 8) throw new Error(`Erros: ${errors}`);

const constants = {};
for (const match of component.matchAll(/const ([A-Z_]+)\s*=\s*`([\s\S]*?)`;/g)) constants[match[1]] = match[2];
const files = {
  'src/br/com/curso/aula130/exemplo/ruim/PedidoProceduralApp.java': 'BAD_FLOW',
  'src/br/com/curso/aula130/dominio/valor/Dinheiro.java': 'MONEY',
  'src/br/com/curso/aula130/dominio/cliente/Cliente.java': 'CLIENT',
  'src/br/com/curso/aula130/dominio/produto/Produto.java': 'PRODUCT',
  'src/br/com/curso/aula130/dominio/pedido/StatusPedido.java': 'ORDER_STATUS',
  'src/br/com/curso/aula130/dominio/pedido/ItemPedido.java': 'ORDER_ITEM',
  'src/br/com/curso/aula130/dominio/pedido/Pedido.java': 'ORDER',
  'src/br/com/curso/aula130/app/PedidoColaboracaoApp.java': 'ORDER_APP',
  'src/br/com/curso/aula130/dominio/os/CodigoOs.java': 'OS_CODE',
  'src/br/com/curso/aula130/dominio/os/TurnoAtendimento.java': 'OS_SHIFT',
  'src/br/com/curso/aula130/dominio/os/StatusOs.java': 'OS_STATUS',
  'src/br/com/curso/aula130/dominio/os/PeriodoAtendimento.java': 'OS_PERIOD',
  'src/br/com/curso/aula130/dominio/tecnico/Tecnico.java': 'TECHNICIAN',
  'src/br/com/curso/aula130/dominio/os/OrdemServico.java': 'OS',
  'src/br/com/curso/aula130/app/OrdemServicoColaboracaoApp.java': 'OS_APP',
  'src/br/com/curso/aula130/dominio/contrato/ClienteCorporativo.java': 'CORP_CLIENT',
  'src/br/com/curso/aula130/dominio/contrato/ServicoContratado.java': 'SERVICE',
  'src/br/com/curso/aula130/dominio/contrato/PeriodoContrato.java': 'CONTRACT_PERIOD',
  'src/br/com/curso/aula130/dominio/contrato/StatusContrato.java': 'CONTRACT_STATUS',
  'src/br/com/curso/aula130/dominio/contrato/Contrato.java': 'CONTRACT',
  'src/br/com/curso/aula130/appcontrato/ContratoColaboracaoApp.java': 'CONTRACT_APP',
  'src/br/com/curso/aula130/appcontrato/TesteColaboracao130.java': 'TESTS',
};

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-130-'));
try {
  for (const [file, key] of Object.entries(files)) {
    if (!constants[key]) throw new Error(`Fonte ausente: ${key}`);
    const target = path.join(temp, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, constants[key]);
  }
  const out = path.join(temp, 'out');
  fs.mkdirSync(out);
  execFileSync('javac', ['-d', out, ...Object.keys(files)], { cwd: temp, stdio: 'pipe' });
  const runs = {
    'br.com.curso.aula130.exemplo.ruim.PedidoProceduralApp': ['Pedido: PAGO', '399.80', 'Estoque: 8'],
    'br.com.curso.aula130.app.PedidoColaboracaoApp': ['Pedido 1001', '799.70', 'cadeira: 8', 'mesa: 4'],
    'br.com.curso.aula130.app.OrdemServicoColaboracaoApp': ['OS-130-001', 'Carlos', 'CONCLUIDA'],
    'br.com.curso.aula130.appcontrato.ContratoColaboracaoApp': ['10200.00', 'CANCELADO'],
    'br.com.curso.aula130.appcontrato.TesteColaboracao130': ['8 testes passaram'],
  };
  for (const [main, expected] of Object.entries(runs)) {
    const output = execFileSync('java', ['-cp', out, main], { cwd: temp, encoding: 'utf8' });
    for (const part of expected) need(output, part, `${main}: ${part}`);
  }
  console.log('Aula 130 validada: UI, 11 etapas, 8 erros, 22 fontes e 5 execuções.');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
