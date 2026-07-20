import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const component = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/GuidedDomainServicesLesson134.jsx'), 'utf8');
const viewer = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/guidedDomainServicesLesson.css'), 'utf8');
const need = (text, value, label) => { if (!text.includes(value)) throw new Error(`Ausente: ${label}`); };

need(viewer, "import('./GuidedDomainServicesLesson134')", 'lazy import');
need(viewer, "startsWith('134_')", 'roteamento');
need(component, 'guided-domain-services-lesson-134-progress', 'persistência');
if (!/completedSteps\.size\s*===\s*steps\.length/.test(component)) throw new Error('gate ausente');
if (!/scrollIntoView\([\s\S]*?inline:\s*["']center["']/.test(component)) throw new Error('foco mobile ausente');
need(css, '@media(max-width:900px)', 'mobile');
need(component, 'guided-error-label', 'clínica estável');
need(component, 'Aplicação coordena; serviço de domínio decide.', 'fronteira de aplicação');

const stepsBlock = component.match(/const steps\s*=\s*\[([\s\S]*?)\];\s*function Block/);
const steps = stepsBlock ? [...stepsBlock[1].matchAll(/\{id:/g)].length : 0;
const errorsBlock = component.match(/const ERRORS\s*=\s*\[([\s\S]*?)\];/);
const errors = errorsBlock ? [...errorsBlock[1].matchAll(/\["/g)].length : 0;
if (steps !== 11) throw new Error(`Etapas: ${steps}`);
if (errors !== 8) throw new Error(`Erros: ${errors}`);

const constants = {};
for (const match of component.matchAll(/const ([A-Z_]+)\s*=\s*`([\s\S]*?)`;/g)) constants[match[1]] = match[2];
const files = {
  'src/br/com/curso/aula134/exemplo/ruim/PedidoServiceRuimApp.java': 'BAD_SERVICE',
  'src/br/com/curso/aula134/dominio/valor/Dinheiro.java': 'MONEY',
  'src/br/com/curso/aula134/dominio/pedido/StatusPedido.java': 'ORDER_STATUS',
  'src/br/com/curso/aula134/dominio/pedido/Pedido.java': 'ORDER',
  'src/br/com/curso/aula134/dominio/cliente/TipoCliente.java': 'CLIENT_TYPE',
  'src/br/com/curso/aula134/dominio/cliente/Cliente.java': 'CLIENT',
  'src/br/com/curso/aula134/dominio/desconto/PoliticaDescontoPedido.java': 'DISCOUNT_POLICY',
  'src/br/com/curso/aula134/app/PedidoComportamentoApp.java': 'ORDER_APP',
  'src/br/com/curso/aula134/app/DescontoDominioApp.java': 'DISCOUNT_APP',
  'src/br/com/curso/aula134/dominio/ordemservico/CodigoOs.java': 'OS_CODE',
  'src/br/com/curso/aula134/dominio/ordemservico/TurnoAtendimento.java': 'OS_SHIFT',
  'src/br/com/curso/aula134/dominio/ordemservico/StatusOs.java': 'OS_STATUS',
  'src/br/com/curso/aula134/dominio/ordemservico/PeriodoAtendimento.java': 'OS_PERIOD',
  'src/br/com/curso/aula134/dominio/tecnico/Tecnico.java': 'TECHNICIAN',
  'src/br/com/curso/aula134/dominio/ordemservico/OrdemServico.java': 'OS',
  'src/br/com/curso/aula134/dominio/alocacao/PoliticaAlocacaoTecnico.java': 'ALLOCATION_POLICY',
  'src/br/com/curso/aula134/app/AlocacaoTecnicoDominioApp.java': 'ALLOCATION_APP',
  'src/br/com/curso/aula134/dominio/reagendamento/ResultadoElegibilidade.java': 'ELIGIBILITY_RESULT',
  'src/br/com/curso/aula134/dominio/reagendamento/ElegibilidadeReagendamentoOs.java': 'ELIGIBILITY',
  'src/br/com/curso/aula134/appreagendamento/ReagendamentoDominioApp.java': 'REAPPOINTMENT_APP',
  'src/br/com/curso/aula134/appreagendamento/TesteServicosDominio134.java': 'TESTS',
};

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-134-'));
try {
  for (const [file, key] of Object.entries(files)) {
    if (!constants[key]) throw new Error(`Fonte ausente: ${key}`);
    const target = path.join(temp, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, constants[key]);
  }
  const out = path.join(temp, 'out');
  fs.mkdirSync(out);
  execFileSync('javac', ['-encoding', 'UTF-8', '-d', out, ...Object.keys(files)], { cwd: temp, stdio: 'pipe' });
  const runs = {
    'br.com.curso.aula134.exemplo.ruim.PedidoServiceRuimApp': ['Pedido 1001', '399.80', 'PAGO'],
    'br.com.curso.aula134.app.PedidoComportamentoApp': ['Pedido 1001', 'R$ 399.80', 'PAGO'],
    'br.com.curso.aula134.app.DescontoDominioApp': ['VIP', 'R$ 59.97', 'R$ 339.83', 'PAGO'],
    'br.com.curso.aula134.app.AlocacaoTecnicoDominioApp': ['OS-2026-0001', 'OS-2026-0002', 'Carlos', 'AGENDADA'],
    'br.com.curso.aula134.appreagendamento.ReagendamentoDominioApp': ['true', 'permitido', 'REAGENDADA'],
    'br.com.curso.aula134.appreagendamento.TesteServicosDominio134': ['10 testes passaram'],
  };
  for (const [main, expected] of Object.entries(runs)) {
    const output = execFileSync('java', ['-Dfile.encoding=UTF-8', '-cp', out, main], { cwd: temp, encoding: 'utf8' });
    for (const part of expected) need(output, part, `${main}: ${part}`);
  }
  console.log('Aula 134 validada: UI, 11 etapas, 8 erros, 21 fontes, 6 execuções e 10 testes.');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
