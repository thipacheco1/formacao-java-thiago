import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const component = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/GuidedDomainInvariantsLesson133.jsx'), 'utf8');
const viewer = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/MarkdownViewer.jsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'plataforma-curso/src/components/guidedDomainInvariantsLesson.css'), 'utf8');
const need = (text, value, label) => { if (!text.includes(value)) throw new Error(`Ausente: ${label}`); };

need(viewer, "import('./GuidedDomainInvariantsLesson133')", 'lazy import');
need(viewer, "startsWith('133_')", 'roteamento');
need(component, 'guided-domain-invariants-lesson-133-progress', 'persistência');
if (!/completedSteps\.size\s*===\s*steps\.length/.test(component)) throw new Error('gate ausente');
if (!/scrollIntoView\([\s\S]*?inline:\s*["']center["']/.test(component)) throw new Error('foco mobile ausente');
need(css, '@media(max-width:900px)', 'mobile');
need(component, 'guided-error-label', 'clínica estável');
need(component, 'estado original preservado', 'prova pós-falha');

const stepsBlock = component.match(/const steps\s*=\s*\[([\s\S]*?)\];\s*function Block/);
const steps = stepsBlock ? [...stepsBlock[1].matchAll(/\{id:/g)].length : 0;
const errorsBlock = component.match(/const ERRORS\s*=\s*\[([\s\S]*?)\];/);
const errors = errorsBlock ? [...errorsBlock[1].matchAll(/\["/g)].length : 0;
if (steps !== 11) throw new Error(`Etapas: ${steps}`);
if (errors !== 8) throw new Error(`Erros: ${errors}`);

const constants = {};
for (const match of component.matchAll(/const ([A-Z_]+)\s*=\s*`([\s\S]*?)`;/g)) constants[match[1]] = match[2];
const files = {
  'src/br/com/curso/aula133/exemplo/ruim/PedidoInvarianteQuebradaApp.java': 'BAD_ORDER',
  'src/br/com/curso/aula133/exemplo/ruim/ProdutoEstoqueNegativoApp.java': 'BAD_PRODUCT',
  'src/br/com/curso/aula133/exemplo/ruim/ContratoPeriodoInvalidoApp.java': 'BAD_CONTRACT',
  'src/br/com/curso/aula133/dominio/valor/Dinheiro.java': 'MONEY',
  'src/br/com/curso/aula133/dominio/pedido/StatusPedido.java': 'ORDER_STATUS',
  'src/br/com/curso/aula133/dominio/pedido/Pedido.java': 'ORDER',
  'src/br/com/curso/aula133/app/PedidoInvarianteApp.java': 'ORDER_APP',
  'src/br/com/curso/aula133/dominio/produto/Produto.java': 'PRODUCT',
  'src/br/com/curso/aula133/app/ProdutoInvarianteApp.java': 'PRODUCT_APP',
  'src/br/com/curso/aula133/dominio/contrato/PeriodoContrato.java': 'CONTRACT_PERIOD',
  'src/br/com/curso/aula133/dominio/contrato/StatusContrato.java': 'CONTRACT_STATUS',
  'src/br/com/curso/aula133/dominio/contrato/Contrato.java': 'CONTRACT',
  'src/br/com/curso/aula133/app/ContratoInvarianteApp.java': 'CONTRACT_APP',
  'src/br/com/curso/aula133/dominio/ordemservico/CodigoOs.java': 'OS_CODE',
  'src/br/com/curso/aula133/dominio/ordemservico/TurnoAtendimento.java': 'OS_SHIFT',
  'src/br/com/curso/aula133/dominio/ordemservico/StatusOs.java': 'OS_STATUS',
  'src/br/com/curso/aula133/dominio/ordemservico/PeriodoAtendimento.java': 'OS_PERIOD',
  'src/br/com/curso/aula133/dominio/ordemservico/OrdemServico.java': 'OS',
  'src/br/com/curso/aula133/app/OrdemServicoInvarianteApp.java': 'OS_APP',
  'src/br/com/curso/aula133/dominio/pagamento/CodigoPagamento.java': 'PAY_CODE',
  'src/br/com/curso/aula133/dominio/pagamento/StatusPagamento.java': 'PAY_STATUS',
  'src/br/com/curso/aula133/dominio/pagamento/Pagamento.java': 'PAYMENT',
  'src/br/com/curso/aula133/apppagamento/PagamentoInvarianteApp.java': 'PAYMENT_APP',
  'src/br/com/curso/aula133/apppagamento/TesteInvariantes133.java': 'TESTS',
};

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'lesson-133-'));
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
    'br.com.curso.aula133.exemplo.ruim.PedidoInvarianteQuebradaApp': ['numero=0', 'total=-150.00', 'status=null'],
    'br.com.curso.aula133.exemplo.ruim.ProdutoEstoqueNegativoApp': ['Estoque aceito: -50'],
    'br.com.curso.aula133.exemplo.ruim.ContratoPeriodoInvalidoApp': ['2026-12-31', '2026-01-01'],
    'br.com.curso.aula133.app.PedidoInvarianteApp': ['Pedido 1001', 'R$ 399.80', 'PAGO'],
    'br.com.curso.aula133.app.ProdutoInvarianteApp': ['PROD-001', 'Estoque: 9'],
    'br.com.curso.aula133.app.ContratoInvarianteApp': ['CONT-001', 'ATIVO'],
    'br.com.curso.aula133.app.OrdemServicoInvarianteApp': ['OS-2026-0001', 'CONCLUIDA', 'Reagendamentos: 1'],
    'br.com.curso.aula133.apppagamento.PagamentoInvarianteApp': ['PAG-133', 'ESTORNADO', 'duplicada'],
    'br.com.curso.aula133.apppagamento.TesteInvariantes133': ['12 testes passaram'],
  };
  for (const [main, expected] of Object.entries(runs)) {
    const output = execFileSync('java', ['-cp', out, main], { cwd: temp, encoding: 'utf8' });
    for (const part of expected) need(output, part, `${main}: ${part}`);
  }
  console.log('Aula 133 validada: UI, 11 etapas, 8 erros, 24 fontes, 9 execuções e 12 ataques.');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
