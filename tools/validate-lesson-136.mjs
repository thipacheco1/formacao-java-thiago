import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const component = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/GuidedBuilderLesson136.jsx'), 'utf8');
const viewer = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/guidedBuilderLesson.css'), 'utf8');
const need = (text, value, label) => {
  if (!text.includes(value)) throw new Error(`Ausente: ${label}`);
};

need(viewer, "import('./GuidedBuilderLesson136')", 'lazy import');
need(viewer, "startsWith('136_')", 'rota da aula');
need(component, 'guided-builder-lesson-136-progress', 'progresso por etapa');
need(component, 'guided-error-label', 'rótulo legível da clínica');
need(css, '@media(max-width:900px)', 'responsividade tablet');
need(css, '@media(max-width:560px)', 'responsividade celular');
if (!/completedSteps\.size\s*===\s*steps\.length/.test(component)) throw new Error('Bloqueio de conclusão ausente.');
if (!/scrollIntoView\([\s\S]*?inline:\s*["']center["']/.test(component)) throw new Error('Foco móvel do roteiro ausente.');

const stepsBlock = component.match(/const steps\s*=\s*\[([\s\S]*?)\];\s*function Block/);
const errorsBlock = component.match(/const ERRORS\s*=\s*\[([\s\S]*?)\];/);
if ((stepsBlock ? [...stepsBlock[1].matchAll(/\{id:/g)].length : 0) !== 11) throw new Error('A aula deve ter 11 etapas.');
if ((errorsBlock ? [...errorsBlock[1].matchAll(/\["/g)].length : 0) !== 8) throw new Error('A clínica deve ter 8 diagnósticos.');

const sources = {};
for (const match of component.matchAll(/const ([A-Z_]+)\s*=\s*`([\s\S]*?)`;/g)) sources[match[1]] = match[2];
const files = {
  'src/br/com/curso/aula136/exemplo/ruim/ContratoConstrutorConfusoApp.java': 'BAD_CONTRACT',
  'src/br/com/curso/aula136/dominio/valor/Dinheiro.java': 'MONEY',
  'src/br/com/curso/aula136/dominio/cliente/Cliente.java': 'CLIENT',
  'src/br/com/curso/aula136/dominio/servico/ServicoContratado.java': 'SERVICE',
  'src/br/com/curso/aula136/dominio/contrato/StatusContrato.java': 'CONTRACT_STATUS',
  'src/br/com/curso/aula136/dominio/contrato/PeriodoContrato.java': 'CONTRACT_PERIOD',
  'src/br/com/curso/aula136/dominio/contrato/Contrato.java': 'CONTRACT',
  'src/br/com/curso/aula136/dominio/contrato/ContratoBuilder.java': 'CONTRACT_BUILDER',
  'src/br/com/curso/aula136/app/ContratoBuilderApp.java': 'CONTRACT_APP',
  'src/br/com/curso/aula136/dominio/ordemservico/CodigoOs.java': 'OS_CODE',
  'src/br/com/curso/aula136/dominio/ordemservico/TurnoAtendimento.java': 'OS_SHIFT',
  'src/br/com/curso/aula136/dominio/ordemservico/PrioridadeOs.java': 'OS_PRIORITY',
  'src/br/com/curso/aula136/dominio/ordemservico/StatusOs.java': 'OS_STATUS',
  'src/br/com/curso/aula136/dominio/ordemservico/PeriodoAtendimento.java': 'OS_PERIOD',
  'src/br/com/curso/aula136/dominio/ordemservico/OrdemServico.java': 'OS',
  'src/br/com/curso/aula136/dominio/ordemservico/OrdemServicoBuilder.java': 'OS_BUILDER',
  'src/br/com/curso/aula136/app/OrdemServicoBuilderApp.java': 'OS_APP',
  'src/br/com/curso/aula136/dominio/pedido/StatusPedido.java': 'ORDER_STATUS',
  'src/br/com/curso/aula136/dominio/pedido/ItemPedido.java': 'ITEM',
  'src/br/com/curso/aula136/dominio/pedido/Pedido.java': 'ORDER',
  'src/br/com/curso/aula136/dominio/pedido/PedidoBuilder.java': 'ORDER_BUILDER',
  'src/br/com/curso/aula136/app/PedidoBuilderApp.java': 'ORDER_APP',
  'src/br/com/curso/aula136/dominio/pagamento/CodigoPagamento.java': 'PAY_CODE',
  'src/br/com/curso/aula136/dominio/pagamento/StatusPagamento.java': 'PAY_STATUS',
  'src/br/com/curso/aula136/dominio/pagamento/Pagamento.java': 'PAYMENT',
  'src/br/com/curso/aula136/dominio/pagamento/PagamentoBuilder.java': 'PAYMENT_BUILDER',
  'src/br/com/curso/aula136/apppagamento/PagamentoBuilderApp.java': 'PAYMENT_APP',
  'src/br/com/curso/aula136/apppagamento/TesteBuilders136.java': 'TESTS',
};

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-136-'));
try {
  for (const [file, key] of Object.entries(files)) {
    if (!sources[key]) throw new Error(`Fonte ausente: ${key}`);
    const target = path.join(temp, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, sources[key]);
  }
  const out = path.join(temp, 'out');
  fs.mkdirSync(out);
  execFileSync('javac', ['-encoding', 'UTF-8', '-d', out, ...Object.keys(files)], { cwd: temp, stdio: 'pipe' });
  const runs = {
    'br.com.curso.aula136.exemplo.ruim.ContratoConstrutorConfusoApp': ['CONT-001', 'PORTAL', 'true'],
    'br.com.curso.aula136.app.ContratoBuilderApp': ['CONT-001', '1800.00', 'PORTAL', 'ATIVO'],
    'br.com.curso.aula136.app.OrdemServicoBuilderApp': ['OS-2026-0001', 'ALTA', 'PORTAL_CLIENTE', 'AGENDADA'],
    'br.com.curso.aula136.app.PedidoBuilderApp': ['Pedido 1001', '799.70', 'PAGO'],
    'br.com.curso.aula136.apppagamento.PagamentoBuilderApp': ['PAG-0001', 'PORTAL', 'ESTORNADO'],
    'br.com.curso.aula136.apppagamento.TesteBuilders136': ['10 testes passaram'],
  };
  for (const [main, expected] of Object.entries(runs)) {
    const output = execFileSync('java', ['-Dfile.encoding=UTF-8', '-cp', out, main], { cwd: temp, encoding: 'utf8' });
    for (const fragment of expected) need(output, fragment, `${main}: ${fragment}`);
  }
  console.log('Aula 136 validada: UI, 11 etapas, 8 erros, 28 fontes, 6 execuções e 10 testes.');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
