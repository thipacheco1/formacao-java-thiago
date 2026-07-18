import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Boxes, Check, CheckCircle2, Clock3, Copy, FileCode2, GitCompareArrows, Layers3, ListChecks, RotateCcw, Route, Sparkles, StepForward, Terminal, Workflow } from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedProceduralArchitectureLesson.css';

const STORAGE_KEY = 'guided-procedural-architecture-lesson-101-progress';
const LARGE_MAIN = [
  'import java.math.BigDecimal;',
  'import java.util.Scanner;', '',
  'public class PedidoMainGrande {',
  '    public static void main(String[] args) {',
  '        Scanner scanner = new Scanner(System.in);', '',
  '        System.out.print("Cliente: ");',
  '        String cliente = scanner.nextLine().trim();',
  '        while (cliente.isBlank()) {',
  '            System.out.println("Cliente obrigatório.");',
  '            System.out.print("Cliente: ");',
  '            cliente = scanner.nextLine().trim();',
  '        }', '',
  '        System.out.print("Produto: ");',
  '        String produto = scanner.nextLine().trim();',
  '        while (produto.isBlank()) {',
  '            System.out.println("Produto obrigatório.");',
  '            System.out.print("Produto: ");',
  '            produto = scanner.nextLine().trim();',
  '        }', '',
  '        System.out.print("Preço unitário: ");',
  '        BigDecimal precoUnitario = new BigDecimal(',
  '                scanner.nextLine().trim().replace(",", "."));', '',
  '        System.out.print("Quantidade: ");',
  '        int quantidade = Integer.parseInt(scanner.nextLine().trim());', '',
  '        if (precoUnitario.compareTo(BigDecimal.ZERO) <= 0',
  '                || quantidade <= 0) {',
  '            System.out.println("Preço e quantidade devem ser maiores que zero.");',
  '            return;',
  '        }', '',
  '        BigDecimal totalBruto = precoUnitario.multiply(',
  '                BigDecimal.valueOf(quantidade));',
  '        BigDecimal desconto = BigDecimal.ZERO;',
  '        if (totalBruto.compareTo(new BigDecimal("300.00")) >= 0) {',
  '            desconto = totalBruto.multiply(new BigDecimal("0.10"));',
  '        }',
  '        BigDecimal totalFinal = totalBruto.subtract(desconto);', '',
  '        System.out.println("====================================");',
  '        System.out.println("RESUMO DO PEDIDO");',
  '        System.out.println("====================================");',
  '        System.out.println("Cliente: " + cliente);',
  '        System.out.println("Produto: " + produto);',
  '        System.out.println("Preço unitário: " + precoUnitario);',
  '        System.out.println("Quantidade: " + quantidade);',
  '        System.out.println("Total bruto: " + totalBruto);',
  '        System.out.println("Desconto: " + desconto);',
  '        System.out.println("Total final: " + totalFinal);',
  '        System.out.println("------------------------------------");',
  '    }',
  '}',
].join('\n');
const ORGANIZED = [
  'import java.math.BigDecimal;',
  'import java.util.Scanner;', '',
  'public class PedidoMiniArquiteturaProcedural {',
  '    public static void main(String[] args) {',
  '        Scanner scanner = new Scanner(System.in);',
  '        PedidoEntrada pedido = lerPedido(scanner);', '',
  '        if (!pedidoValido(pedido)) {',
  '            imprimirErro("Pedido inválido. Verifique os dados.");',
  '            return;',
  '        }', '',
  '        ResumoPedido resumo = gerarResumoPedido(pedido);',
  '        imprimirResumoPedido(resumo);',
  '    }', '',
  '    public static PedidoEntrada lerPedido(Scanner scanner) {',
  '        String cliente = lerTextoObrigatorio(scanner, "Cliente: ");',
  '        String produto = lerTextoObrigatorio(scanner, "Produto: ");',
  '        BigDecimal preco = lerBigDecimal(scanner, "Preço unitário: ");',
  '        int quantidade = lerInteiro(scanner, "Quantidade: ");',
  '        return new PedidoEntrada(cliente, produto, preco, quantidade);',
  '    }', '',
  '    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            String valor = scanner.nextLine().trim();',
  '            if (!valor.isBlank()) return valor;',
  '            System.out.println("Valor obrigatório.");',
  '        }',
  '    }', '',
  '    public static BigDecimal lerBigDecimal(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            String linha = scanner.nextLine().trim().replace(",", ".");',
  '            try {',
  '                return new BigDecimal(linha);',
  '            } catch (NumberFormatException erro) {',
  '                System.out.println("Digite um valor monetário válido.");',
  '            }',
  '        }',
  '    }', '',
  '    public static int lerInteiro(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            try {',
  '                return Integer.parseInt(scanner.nextLine().trim());',
  '            } catch (NumberFormatException erro) {',
  '                System.out.println("Digite um número inteiro válido.");',
  '            }',
  '        }',
  '    }', '',
  '    public static boolean pedidoValido(PedidoEntrada pedido) {',
  '        return pedido != null',
  '                && textoInformado(pedido.cliente())',
  '                && textoInformado(pedido.produto())',
  '                && valorPositivo(pedido.precoUnitario())',
  '                && pedido.quantidade() > 0;',
  '    }', '',
  '    public static boolean textoInformado(String valor) {',
  '        return valor != null && !valor.isBlank();',
  '    }', '',
  '    public static boolean valorPositivo(BigDecimal valor) {',
  '        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;',
  '    }', '',
  '    public static ResumoPedido gerarResumoPedido(PedidoEntrada pedido) {',
  '        BigDecimal bruto = calcularTotalBruto(',
  '                pedido.precoUnitario(), pedido.quantidade());',
  '        BigDecimal desconto = calcularDesconto(bruto);',
  '        BigDecimal finalPedido = calcularTotalFinal(bruto, desconto);',
  '        return new ResumoPedido(pedido.cliente(), pedido.produto(),',
  '                pedido.precoUnitario(), pedido.quantidade(),',
  '                bruto, desconto, finalPedido);',
  '    }', '',
  '    public static BigDecimal calcularTotalBruto(',
  '            BigDecimal precoUnitario, int quantidade) {',
  '        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));',
  '    }', '',
  '    public static BigDecimal calcularDesconto(BigDecimal totalBruto) {',
  '        if (totalBruto.compareTo(new BigDecimal("300.00")) >= 0) {',
  '            return totalBruto.multiply(new BigDecimal("0.10"));',
  '        }',
  '        return BigDecimal.ZERO;',
  '    }', '',
  '    public static BigDecimal calcularTotalFinal(',
  '            BigDecimal totalBruto, BigDecimal desconto) {',
  '        return totalBruto.subtract(desconto);',
  '    }', '',
  '    public static void imprimirResumoPedido(ResumoPedido resumo) {',
  '        imprimirCabecalho("RESUMO DO PEDIDO");',
  '        System.out.println("Cliente: " + resumo.cliente());',
  '        System.out.println("Produto: " + resumo.produto());',
  '        System.out.println("Preço unitário: " + resumo.precoUnitario());',
  '        System.out.println("Quantidade: " + resumo.quantidade());',
  '        System.out.println("Total bruto: " + resumo.totalBruto());',
  '        System.out.println("Desconto: " + resumo.desconto());',
  '        System.out.println("Total final: " + resumo.totalFinal());',
  '        imprimirSeparador();',
  '    }', '',
  '    public static void imprimirCabecalho(String titulo) {',
  '        System.out.println("====================================");',
  '        System.out.println(titulo);',
  '        System.out.println("====================================");',
  '    }', '',
  '    public static void imprimirSeparador() {',
  '        System.out.println("------------------------------------");',
  '    }', '',
  '    public static void imprimirErro(String mensagem) {',
  '        System.out.println("[ERRO] " + mensagem);',
  '    }',
  '}', '',
  'record PedidoEntrada(String cliente, String produto,',
  '        BigDecimal precoUnitario, int quantidade) {}', '',
  'record ResumoPedido(String cliente, String produto,',
  '        BigDecimal precoUnitario, int quantidade,',
  '        BigDecimal totalBruto, BigDecimal desconto,',
  '        BigDecimal totalFinal) {}',
].join('\n');
const OS_PROJECT = [
  'import java.time.LocalDate;',
  'import java.time.temporal.ChronoUnit;',
  'import java.util.Scanner;', '',
  'public class OsMiniArquiteturaProcedural {',
  '    public static void main(String[] args) {',
  '        Scanner scanner = new Scanner(System.in);',
  '        OrdemServicoEntrada os = lerOrdemServico(scanner);', '',
  '        if (!ordemServicoValida(os)) {',
  '            imprimirErro("OS inválida.");',
  '            return;',
  '        }', '',
  '        ResumoOs resumo = gerarResumoOs(os);',
  '        imprimirResumoOs(resumo);',
  '    }', '',
  '    public static OrdemServicoEntrada lerOrdemServico(Scanner scanner) {',
  '        System.out.print("Certificado: ");',
  '        String certificado = scanner.nextLine().trim();',
  '        System.out.print("Status: ");',
  '        String status = scanner.nextLine().trim();',
  '        System.out.print("Data de abertura (AAAA-MM-DD): ");',
  '        LocalDate data = LocalDate.parse(scanner.nextLine().trim());',
  '        return new OrdemServicoEntrada(certificado, status, data);',
  '    }', '',
  '    public static boolean ordemServicoValida(OrdemServicoEntrada os) {',
  '        return os != null',
  '                && os.certificado() != null && !os.certificado().isBlank()',
  '                && os.status() != null && !os.status().isBlank()',
  '                && os.dataAbertura() != null;',
  '    }', '',
  '    public static long calcularDiasEmAberto(LocalDate dataAbertura) {',
  '        return ChronoUnit.DAYS.between(dataAbertura, LocalDate.now());',
  '    }', '',
  '    public static ResumoOs gerarResumoOs(OrdemServicoEntrada os) {',
  '        long dias = calcularDiasEmAberto(os.dataAbertura());',
  '        return new ResumoOs(os.certificado(), os.status(), dias);',
  '    }', '',
  '    public static void imprimirResumoOs(ResumoOs resumo) {',
  '        System.out.println("--- RESUMO DA OS ---");',
  '        System.out.println("Certificado: " + resumo.certificado());',
  '        System.out.println("Status: " + resumo.status());',
  '        System.out.println("Dias em aberto: " + resumo.diasEmAberto());',
  '    }', '',
  '    public static void imprimirErro(String mensagem) {',
  '        System.out.println("[ERRO] " + mensagem);',
  '    }',
  '}', '',
  'record OrdemServicoEntrada(String certificado, String status,',
  '        LocalDate dataAbertura) {}', '',
  'record ResumoOs(String certificado, String status, long diasEmAberto) {}',
].join('\n');
const EVIDENCE = [
  '# Aula 101 — Mini arquitetura procedural', '',
  '- [ ] Rodei PedidoMainGrande com entrada conhecida',
  '- [ ] Marquei leitura, validação, cálculo e exibição',
  '- [ ] Expliquei por que main deve coordenar',
  '- [ ] Criei PedidoMiniArquiteturaProcedural',
  '- [ ] Agrupei entrada em PedidoEntrada',
  '- [ ] Agrupei saída em ResumoPedido',
  '- [ ] Comparei a saída das duas versões',
  '- [ ] Usei F7 no fluxo principal',
  '- [ ] Expliquei os limites da solução procedural',
  '- [ ] Completei OsMiniArquiteturaProcedural',
  '- [ ] Respondi as três perguntas',
  '- [ ] Revisei git diff e artefatos .class',
].join('\n');
const ERRORS = [
  ['Nome genérico', 'processar ou executar não revela a etapa do fluxo.', 'Use lerPedido, pedidoValido, gerarResumoPedido e imprimirResumoPedido.'],
  ['Método faz tudo', 'lerCalcularEImprimirPedido apenas esconde o main gigante.', 'Separe por uma responsabilidade observável de cada vez.'],
  ['Main ainda detalhado', 'Loops, fórmulas e prints continuam misturados no coordenador.', 'Deixe o main mostrar apenas ordem, decisão e encerramento.'],
  ['Extração sem intenção', 'O método tem poucas linhas, mas não forma uma operação nomeável.', 'Extraia pela pergunta que o bloco responde, não pelo tamanho.'],
  ['Parâmetros demais', 'Dados do mesmo conceito viajam como argumentos soltos.', 'Agrupe a entrada ou o resultado em record quando houver coesão.'],
  ['Código ruim escondido', 'A complexidade continua dentro de um método com nome bonito.', 'Revise coesão, fluxo e dependências internas após extrair.'],
  ['Arquitetura antecipada', 'Controller, service e repository aparecem sem necessidade real.', 'Mantenha uma classe procedural enquanto treina responsabilidades.'],
  ['Equivalência não provada', 'A versão organizada usa outra entrada ou outra regra.', 'Execute ambas com os mesmos dados e compare o resultado.'],
];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return <button type="button" className="guided-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}
function ArchitectureMapLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['Preparar', 'Scanner', 'recurso'],
    ['Ler', 'lerPedido', 'entrada'],
    ['Validar', 'pedidoValido', 'decisão'],
    ['Processar', 'gerarResumoPedido', 'resultado'],
    ['Exibir', 'imprimirResumoPedido', 'saída'],
  ];
  const current = stages[stage];
  return <section className="pa101-stack"><div className="pa101-pipeline">{stages.map((item, index) => <button type="button" key={item[0]} className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}><span>{index < stage ? <Check size={14} /> : index + 1}</span><strong>{item[0]}</strong><small>{item[1]}</small></button>)}</div><div className="pa101-main-role"><Route /><div><small>{current[2].toUpperCase()}</small><strong>{current[1]}</strong><span>O main decide quando a etapa acontece; o método sabe como realizá-la.</span></div></div><article className="pa101-rule"><Workflow /><div><strong>Main é o índice da história</strong><span>Se você entende o fluxo lendo somente o main, o nível de abstração está adequado.</span></div></article></section>;
}
function SmellMapLab() {
  const [selected, setSelected] = useState(0);
  const responsibilities = [
    ['Leitura', 'Scanner, prompts, trim e repetição', '8–29'],
    ['Validação', 'preço e quantidade positivos', '31–36'],
    ['Cálculo', 'bruto, desconto e total final', '38–45'],
    ['Exibição', 'cabeçalho e sete linhas do resumo', '47–57'],
  ];
  const current = responsibilities[selected];
  return <section className="pa101-stack"><div className="pa101-smell"><aside>{responsibilities.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{item[0]}</strong><small>linhas {item[2]}</small></button>)}</aside><main><small>RESPONSABILIDADE MISTURADA NO MAIN</small><strong>{current[0]}</strong><p>{current[1]}</p><div><AlertTriangle />Uma mudança nesta área obriga a editar o mesmo método das outras três.</div></main></div><article className="pa101-warning"><AlertTriangle /><div><strong>Procedural não significa bagunçado</strong><span>O problema é misturar motivos de mudança, não usar métodos estáticos em uma classe pequena.</span></div></article></section>;
}
function BaselineLab() {
  const input = ['Ana', 'Cadeira', '199,90', '2'].join('\n');
  return <section className="pa101-stack"><CodePanel name="PedidoMainGrande.java" code={LARGE_MAIN} /><div className="pa101-terminal"><header><Terminal size={16} />Executar a baseline<CopyButton value={'javac PedidoMainGrande.java\njava PedidoMainGrande'} /></header><pre><b>ENTRADA</b>{`\n`}{input}{`\n\n`}<b>RESULTADO-CHAVE</b>{`\n`}Total bruto: 399.80{`\n`}Desconto: 39.9800{`\n`}Total final: 359.8200</pre></div><article className="pa101-rule"><GitCompareArrows /><div><strong>Guarde os mesmos quatro dados</strong><span>A versão organizada deve produzir os mesmos valores; mudar estrutura não autoriza alterar a regra de 10%.</span></div></article></section>;
}
function OrchestratorLab() {
  const [step, setStep] = useState(0);
  const trace = [
    ['lerPedido(scanner)', 'PedidoEntrada', 'Ana · Cadeira · 199.90 · 2'],
    ['pedidoValido(pedido)', 'boolean', 'true'],
    ['gerarResumoPedido(pedido)', 'ResumoPedido', '399.80 · 39.9800 · 359.8200'],
    ['imprimirResumoPedido(resumo)', 'void', 'console com o resumo'],
  ];
  const current = trace[step];
  return <section className="pa101-stack"><div className="pa101-orchestrator"><header><span>main · coordenador procedural</span><span>Step Into · F7</span></header><div className="pa101-orchestrator-body"><aside>{trace.map((item, index) => <button type="button" key={item[0]} className={step === index ? 'active' : ''} onClick={() => setStep(index)}><span>{index + 1}</span><code>{item[0]}</code></button>)}</aside><main><small>CONTRATO DA ETAPA</small><strong>{current[0]}</strong><code>retorno: {current[1]}</code><p>{current[2]}</p><button type="button" onClick={() => setStep(value => Math.min(value + 1, trace.length - 1))} disabled={step === trace.length - 1}><StepForward size={15} />Próxima chamada</button></main></div><footer>O main conhece a ordem; cada método encapsula o detalhe da própria responsabilidade.</footer></div></section>;
}
function ResponsibilityLab() {
  const [group, setGroup] = useState(0);
  const groups = [
    ['Leitura', ['lerPedido', 'lerTextoObrigatorio', 'lerBigDecimal', 'lerInteiro'], 'adapta texto do console para dados'],
    ['Validação', ['pedidoValido', 'textoInformado', 'valorPositivo'], 'responde se os dados mínimos são aceitos'],
    ['Processamento', ['gerarResumoPedido', 'calcularTotalBruto', 'calcularDesconto', 'calcularTotalFinal'], 'transforma entrada válida em resultado'],
    ['Exibição', ['imprimirResumoPedido', 'imprimirCabecalho', 'imprimirSeparador', 'imprimirErro'], 'converte resultado em saída de console'],
  ];
  const current = groups[group];
  return <section className="pa101-stack"><div className="pa101-responsibilities"><nav>{groups.map((item, index) => <button type="button" key={item[0]} className={group === index ? 'active' : ''} onClick={() => setGroup(index)}><span>{index + 1}</span>{item[0]}</button>)}</nav><main><small>{current[0].toUpperCase()}</small><p>{current[2]}</p><div>{current[1].map(method => <code key={method}>{method}()</code>)}</div></main></div><article className="pa101-rule"><Layers3 /><div><strong>Agrupe por motivo de mudança</strong><span>Um novo formato de console afeta exibição; uma nova regra de desconto afeta processamento, sem atravessar o fluxo inteiro.</span></div></article></section>;
}
function OrganizedCodeLab() {
  const [view, setView] = useState('code');
  return <section className="pa101-stack"><div className="pa101-toggle"><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código completo</button><button type="button" className={view === 'proof' ? 'active' : ''} onClick={() => setView('proof')}>Prova de equivalência</button></div>{view === 'code' ? <CodePanel name="PedidoMiniArquiteturaProcedural.java" code={ORGANIZED} /> : <div className="pa101-compare"><section><small>MAIN GRANDE</small><strong>399.80</strong><span>desconto 39.9800</span><span>final 359.8200</span></section><GitCompareArrows /><section><small>MINI ARQUITETURA</small><strong>399.80</strong><span>desconto 39.9800</span><span>final 359.8200</span></section></div>}<article className="pa101-rule"><CheckCircle2 /><div><strong>Records nomeiam as fronteiras</strong><span><code>PedidoEntrada</code> reúne o que chega; <code>ResumoPedido</code> reúne o que o processamento entrega à exibição.</span></div></article></section>;
}
function MethodOrderLab() {
  const [section, setSection] = useState(0);
  const sections = [
    ['1', 'main', 'coordenador do fluxo'],
    ['2', 'fluxo principal', 'operações que contam a história'],
    ['3', 'leitura', 'entrada e conversão'],
    ['4', 'validação', 'perguntas e guard clauses'],
    ['5', 'processamento', 'cálculo e montagem'],
    ['6', 'exibição', 'console e mensagens'],
    ['7', 'records / enums', 'tipos auxiliares'],
  ];
  const current = sections[section];
  return <section className="pa101-stack"><div className="pa101-order">{sections.map((item, index) => <button type="button" key={item[1]} className={section === index ? 'active' : ''} onClick={() => setSection(index)}><span>{item[0]}</span><strong>{item[1]}</strong></button>)}</div><div className="pa101-main-role"><ArrowDown /><div><small>ORDEM DE NAVEGAÇÃO SUGERIDA</small><strong>{current[1]}</strong><span>{current[2]}. É uma convenção local de leitura, não uma regra da linguagem Java.</span></div></div></section>;
}
function LimitsLab() {
  const [selected, setSelected] = useState(0);
  const limits = [
    ['Uma classe', 'todos os métodos ainda vivem juntos', 'esperado agora'],
    ['Sem camadas', 'não há controller, service ou repository', 'não antecipe'],
    ['Sem persistência', 'o programa termina e os dados desaparecem', 'será estudado depois'],
    ['Sem DI', 'o main cria o Scanner diretamente', 'adequado ao laboratório'],
    ['Sem testes automáticos', 'a equivalência ainda é executada manualmente', 'próxima evolução'],
  ];
  const current = limits[selected];
  return <section className="pa101-stack"><div className="pa101-limits">{limits.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{item[0]}</strong><small>{item[2]}</small></button>)}</div><article className="pa101-warning"><AlertTriangle /><div><strong>{current[0]}: {current[1]}</strong><span>Mini arquitetura procedural treina separação de responsabilidades; ela prepara o raciocínio, mas não finge ser a arquitetura final.</span></div></article></section>;
}
function OsChallengeLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['ler OS', 'lerOrdemServico(scanner)', 'OrdemServicoEntrada'],
    ['validar', 'ordemServicoValida(os)', 'boolean'],
    ['calcular', 'calcularDiasEmAberto(data)', 'long'],
    ['montar', 'gerarResumoOs(os)', 'ResumoOs'],
    ['exibir', 'imprimirResumoOs(resumo)', 'void'],
  ];
  const current = stages[stage];
  return <section className="pa101-stack"><div className="pa101-pipeline">{stages.map((item, index) => <button type="button" key={item[0]} className={stage === index ? 'active' : ''} onClick={() => setStage(index)}><span>{index + 1}</span><strong>{item[0]}</strong><small>{item[2]}</small></button>)}</div><div className="pa101-main-role"><Boxes /><div><small>NOVO DOMÍNIO</small><strong>{current[1]}</strong><span>Transfira a organização do pedido sem copiar nomes nem regras que pertencem ao primeiro exemplo.</span></div></div><CodePanel name="OsMiniArquiteturaProcedural.java" code={OS_PROJECT} /><div className="pa101-terminal"><pre><b>ENTRADA</b>{`\n`}CERT-101{`\n`}ABERTA{`\n`}2026-07-10{`\n\n`}<b>SAÍDA</b>{`\n`}--- RESUMO DA OS ---{`\n`}Certificado: CERT-101{`\n`}Status: ABERTA{`\n`}Dias em aberto: calculado com LocalDate.now()</pre></div></section>;
}
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors pa101-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}
function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const checks = ['três fontes criadas', 'main grande executado', 'quatro responsabilidades marcadas', 'main coordenador explicado', 'PedidoEntrada usado', 'ResumoPedido usado', 'leitura isolada', 'validação isolada', 'processamento isolado', 'exibição isolada', 'saídas do pedido comparadas', 'F7 usado no fluxo', 'OS organizada executada', 'limites explicados', 'três respostas registradas', 'diff e .class revisados'];
  const commands = ['javac *.java', 'java PedidoMainGrande', 'java PedidoMiniArquiteturaProcedural', 'java OsMiniArquiteturaProcedural', 'git diff'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  return <section className="pa101-delivery"><div className="pa101-terminal"><header><Terminal size={15} />Compilar, executar e comparar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}</pre></div><div className="pa101-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: conte a história de uma OS pelo main</h3></div><p>Implemente primeiro sem consultar a solução. Olhando apenas para o seu <code>main</code>, outra pessoa deve enxergar ler, validar, calcular, montar e exibir.</p><ul><li>Use <code>OrdemServicoEntrada</code> para os dados recebidos.</li><li>Calcule dias em aberto com <code>LocalDate</code>.</li><li>Use <code>ResumoOs</code> como fronteira da exibição.</li><li>Faça Step Into nas cinco responsabilidades.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'map', label: 'Mapa da Arquitetura', duration: '10 min', eyebrow: 'MAIN COORDENA, MÉTODOS EXECUTAM', title: 'Veja o programa como um fluxo de cinco responsabilidades', blocks: [{ type: 'lead', text: 'Mini arquitetura procedural organiza leitura, validação, processamento e saída antes de existirem camadas ou objetos ricos.' }, { type: 'map' }] },
  { id: 'smell', label: 'Diagnóstico do Main', duration: '11 min', eyebrow: 'QUATRO MOTIVOS DE MUDANÇA MISTURADOS', title: 'Marque onde o main grande troca de responsabilidade', blocks: [{ type: 'lead', text: 'O problema não é a quantidade de linhas isoladamente, mas um único método conhecer detalhes de entrada, regra, cálculo e apresentação.' }, { type: 'smell' }] },
  { id: 'baseline', label: 'Rodar o Main Grande', duration: '14 min', eyebrow: 'MESMA ENTRADA, RESULTADO CONHECIDO', title: 'Execute a versão inicial antes de reorganizar', blocks: [{ type: 'lead', text: 'Ana compra duas cadeiras por 199,90. Esses dados e resultados serão o contrato de comparação da refatoração.' }, { type: 'baseline' }] },
  { id: 'orchestrator', label: 'Main como Roteiro', duration: '12 min', eyebrow: 'QUATRO CHAMADAS EM ALTO NÍVEL', title: 'Acompanhe o coordenador sem esconder decisões importantes', blocks: [{ type: 'lead', text: 'O main prepara o recurso, ordena o fluxo, interrompe uma entrada inválida e delega cada detalhe ao método responsável.' }, { type: 'orchestrator' }] },
  { id: 'responsibilities', label: 'Separar Responsabilidades', duration: '14 min', eyebrow: 'LEITURA, VALIDAÇÃO, PROCESSAMENTO E EXIBIÇÃO', title: 'Agrupe métodos pelo motivo que os faria mudar', blocks: [{ type: 'lead', text: 'A separação útil reduz o raio de cada mudança e cria nomes que orientam a navegação pelo arquivo.' }, { type: 'responsibilities' }] },
  { id: 'organized', label: 'Código Organizado', duration: '18 min', eyebrow: 'FONTE COMPLETA E EQUIVALÊNCIA', title: 'Leia a mini arquitetura inteira sem perder nenhum detalhe', blocks: [{ type: 'lead', text: 'A versão completa mantém leitura robusta, validação, BigDecimal, regra de desconto, saída e records de entrada e resumo.' }, { type: 'organized' }] },
  { id: 'order', label: 'Ordem de Navegação', duration: '8 min', eyebrow: 'CONVENÇÃO PARA UM ARQUIVO PROCEDURAL', title: 'Organize os métodos para o leitor descer do fluxo ao detalhe', blocks: [{ type: 'lead', text: 'Uma ordem previsível ajuda a encontrar responsabilidades, embora não seja uma exigência do compilador.' }, { type: 'order' }] },
  { id: 'limits', label: 'Limites sem Antecipação', duration: '9 min', eyebrow: 'O QUE ESTA ARQUITETURA AINDA NÃO É', title: 'Reconheça os limites sem desvalorizar a etapa atual', blocks: [{ type: 'lead', text: 'Ainda não há controller, service, repository, persistência, injeção ou classes de domínio — e isso é intencional.' }, { type: 'limits' }] },
  { id: 'os', label: 'Projeto de OS', duration: '18 min', eyebrow: 'TRANSFERÊNCIA PARA UM NOVO DOMÍNIO', title: 'Construa uma segunda mini arquitetura com LocalDate', blocks: [{ type: 'lead', text: 'A ordem de serviço prova que você aprendeu o raciocínio: certificado, status e data exigem nomes e regras próprios.' }, { type: 'os' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'NOME, COESÃO, FRONTEIRA E EQUIVALÊNCIA', title: 'Diagnostique oito formas de produzir organização apenas aparente', blocks: [{ type: 'lead', text: 'Cada caso diferencia método pequeno de responsabilidade clara e organização procedural de arquitetura antecipada.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '12 min', eyebrow: 'CÓDIGO, DEBUG, REGISTRO E GIT', title: 'Entregue três programas e uma história legível pelo main', blocks: [{ type: 'lead', text: 'A conclusão exige fontes executáveis, equivalência do pedido, transferência para OS e justificativas de responsabilidade.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'map') return <ArchitectureMapLab />;
  if (block.type === 'smell') return <SmellMapLab />;
  if (block.type === 'baseline') return <BaselineLab />;
  if (block.type === 'orchestrator') return <OrchestratorLab />;
  if (block.type === 'responsibilities') return <ResponsibilityLab />;
  if (block.type === 'organized') return <OrganizedCodeLab />;
  if (block.type === 'order') return <MethodOrderLab />;
  if (block.type === 'limits') return <LimitsLab />;
  if (block.type === 'os') return <OsChallengeLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedProceduralArchitectureLesson101({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const validIds = new Set(steps.map(step => step.id));
      return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []);
    } catch { return new Set(); }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => {
    if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) {
      completionNormalizedRef.current = true;
      onToggleCompleted();
    }
  }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => {
    const active = navRef.current?.querySelector('button.active');
    if (active && window.matchMedia('(max-width: 900px)').matches) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);
  const step = steps[activeIndex];
  const stepDone = completedSteps.has(step.id);
  const allStepsDone = completedSteps.size === steps.length;
  const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const toggleStep = () => {
    if (stepDone && isCompleted) onToggleCompleted();
    setCompletedSteps(current => {
      const next = new Set(current);
      if (next.has(step.id)) next.delete(step.id); else next.add(step.id);
      return next;
    });
  };
  return <article className="guided-git-lesson guided-procedural-architecture-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Workflow size={17} />Oficina de arquitetura procedural</span><p className="guided-sequence">101 · M3.12</p><h1>Faça o main contar a história do programa</h1><p>Separe leitura, validação, processamento e exibição; agrupe dados com records e transfira o desenho de pedido para ordem de serviço.</p></div><div className="guided-hero-status"><Layers3 size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 101" items={[{ value: '3 fontes', label: 'Compiladas e executadas' }, { value: '5 papéis', label: 'No fluxo coordenado' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 101"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Fluxo organizado e transferido para outro domínio</h3><p>{lessonComplete ? 'Aula concluída e pronta para a calculadora revisitada.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 100</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Main coordenador e responsabilidades</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 102<ArrowRight size={17} /></button></footer></article>;
}
