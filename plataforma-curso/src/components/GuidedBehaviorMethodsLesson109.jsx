import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2,
  Clock3, Copy, FileCode2, GitBranch, ListChecks, Network, Play,
  RotateCcw, Route, Sparkles, StepForward, Terminal, Workflow,
} from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedBehaviorMethodsLesson.css';

const STORAGE_KEY = 'guided-behavior-methods-lesson-109-progress';

const ANEMIC_SOURCE = `import java.math.BigDecimal;

public class PedidoAnemico {
    public static void main(String[] args) {
        PedidoDados pedido = new PedidoDados("Ana", new BigDecimal("199.90"), 2);
        BigDecimal total = pedido.precoUnitario()
                .multiply(BigDecimal.valueOf(pedido.quantidade()));
        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Total calculado fora: " + total);
    }
}

class PedidoDados {
    private final String cliente;
    private final BigDecimal precoUnitario;
    private final int quantidade;

    PedidoDados(String cliente, BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    String cliente() { return cliente; }
    BigDecimal precoUnitario() { return precoUnitario; }
    int quantidade() { return quantidade; }
}`;

const ORDER_SOURCE = `import java.math.BigDecimal;

public class PedidoComComportamento {
    public static void main(String[] args) {
        PedidoComRegra pedido = new PedidoComRegra(
                "Ana Silva", "Cadeira", new BigDecimal("199.90"), 2);
        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Válido: " + pedido.valido());
        System.out.println("Total bruto: " + pedido.totalBruto());
        System.out.println("Desconto: " + pedido.desconto());
        System.out.println("Total final: " + pedido.totalFinal());
        System.out.println("Pedido com desconto: " + pedido.temDesconto());
    }
}

class PedidoComRegra {
    private final String cliente;
    private final String produto;
    private final BigDecimal precoUnitario;
    private final int quantidade;

    PedidoComRegra(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente; this.produto = produto;
        this.precoUnitario = precoUnitario; this.quantidade = quantidade;
    }

    String cliente() { return cliente; }
    String produto() { return produto; }
    boolean valido() {
        return textoInformado(cliente) && textoInformado(produto)
                && precoUnitario != null
                && precoUnitario.compareTo(BigDecimal.ZERO) > 0
                && quantidade > 0;
    }
    BigDecimal totalBruto() {
        if (!valido()) return BigDecimal.ZERO;
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }
    boolean temDesconto() {
        return totalBruto().compareTo(new BigDecimal("300.00")) >= 0;
    }
    BigDecimal desconto() {
        return temDesconto() ? totalBruto().multiply(new BigDecimal("0.10")) : BigDecimal.ZERO;
    }
    BigDecimal totalFinal() { return totalBruto().subtract(desconto()); }
    private boolean textoInformado(String valor) { return valor != null && !valor.isBlank(); }
}`;

const OS_SOURCE = `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OrdemServicoComComportamento {
    public static void main(String[] args) {
        OrdemServicoComRegra os = new OrdemServicoComRegra(
                "OS-001", "Ana Silva", StatusOs.ABERTA,
                LocalDate.now().minusDays(6), 1);
        LocalDate hoje = LocalDate.now();
        System.out.println("Certificado: " + os.certificado());
        System.out.println("Cliente: " + os.cliente());
        System.out.println("Status: " + os.status());
        System.out.println("Dias em aberto: " + os.diasEmAberto(hoje));
        System.out.println("Encerrada: " + os.encerrada());
        System.out.println("Atrasada: " + os.atrasada(hoje));
        System.out.println("Precisa reagendamento: " + os.precisaReagendamento());
        System.out.println("Precisa atenção: " + os.precisaAtencao(hoje));
        System.out.println("Fila sugerida: " + os.filaSugerida(hoje));
    }
}

enum StatusOs { ABERTA, AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
enum FilaAtendimento { ENTRADA, REAGENDAMENTO, CASOS_CRITICOS, SEM_FILA }

class OrdemServicoComRegra {
    private final String certificado;
    private final String cliente;
    private final StatusOs status;
    private final LocalDate dataAbertura;
    private final int quantidadeReagendamentos;

    OrdemServicoComRegra(String certificado, String cliente, StatusOs status,
            LocalDate dataAbertura, int quantidadeReagendamentos) {
        this.certificado = certificado; this.cliente = cliente; this.status = status;
        this.dataAbertura = dataAbertura; this.quantidadeReagendamentos = quantidadeReagendamentos;
    }
    String certificado() { return certificado; }
    String cliente() { return cliente; }
    StatusOs status() { return status; }
    long diasEmAberto(LocalDate referencia) {
        return Math.max(ChronoUnit.DAYS.between(dataAbertura, referencia), 0);
    }
    boolean encerrada() { return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA; }
    boolean atrasada(LocalDate referencia) { return diasEmAberto(referencia) > 3; }
    boolean precisaReagendamento() { return quantidadeReagendamentos >= 2; }
    boolean precisaAtencao(LocalDate referencia) {
        return atrasada(referencia) || precisaReagendamento();
    }
    FilaAtendimento filaSugerida(LocalDate referencia) {
        if (encerrada()) return FilaAtendimento.SEM_FILA;
        if (atrasada(referencia)) return FilaAtendimento.CASOS_CRITICOS;
        if (precisaReagendamento()) return FilaAtendimento.REAGENDAMENTO;
        return FilaAtendimento.ENTRADA;
    }
}`;

const PAYMENT_SOURCE = `import java.math.BigDecimal;

public class PagamentoComComportamento {
    public static void main(String[] args) {
        PagamentoComRegra aprovado = new PagamentoComRegra(
                "PAG-001", new BigDecimal("150.00"), FormaPagamento.PIX, true);
        PagamentoComRegra pendente = new PagamentoComRegra(
                "PAG-002", new BigDecimal("80.00"), FormaPagamento.BOLETO, false);
        imprimir(aprovado);
        imprimir(pendente);
    }
    static void imprimir(PagamentoComRegra pagamento) {
        System.out.println("Código: " + pagamento.codigo());
        System.out.println("Valor válido: " + pagamento.valorValido());
        System.out.println("Aprovado: " + pagamento.aprovado());
        System.out.println("Pode confirmar: " + pagamento.podeConfirmar());
        System.out.println("Descrição: " + pagamento.descricao());
        System.out.println("---");
    }
}

enum FormaPagamento { PIX, CARTAO, BOLETO }

class PagamentoComRegra {
    private final String codigo;
    private final BigDecimal valor;
    private final FormaPagamento formaPagamento;
    private final boolean aprovado;
    PagamentoComRegra(String codigo, BigDecimal valor,
            FormaPagamento formaPagamento, boolean aprovado) {
        this.codigo = codigo; this.valor = valor;
        this.formaPagamento = formaPagamento; this.aprovado = aprovado;
    }
    String codigo() { return codigo; }
    boolean aprovado() { return aprovado; }
    boolean valorValido() { return valor != null && valor.compareTo(BigDecimal.ZERO) > 0; }
    boolean formaInformada() { return formaPagamento != null; }
    boolean podeConfirmar() {
        return codigo != null && !codigo.isBlank()
                && valorValido() && formaInformada() && aprovado;
    }
    String descricao() {
        return "Pagamento " + codigo + " | Forma: " + formaPagamento + " | Valor: " + valor;
    }
}`;

const PRODUCT_SOURCE = `import java.math.BigDecimal;

public class ProdutoComComportamento {
    public static void main(String[] args) {
        ProdutoAtivo cadeira = new ProdutoAtivo(
                "PRD-1", "Cadeira", new BigDecimal("499.90"), 8, true);
        ProdutoAtivo luminaria = new ProdutoAtivo(
                "PRD-2", "Luminária", new BigDecimal("89.90"), 0, true);
        imprimir(cadeira);
        imprimir(luminaria);
    }
    static void imprimir(ProdutoAtivo produto) {
        System.out.println(produto.descricao());
        System.out.println("Preço válido: " + produto.precoValido());
        System.out.println("Tem estoque: " + produto.temEstoque());
        System.out.println("Disponível: " + produto.disponivelParaVenda());
        System.out.println("Valor em estoque: " + produto.valorTotalEmEstoque());
        System.out.println("---");
    }
}

class ProdutoAtivo {
    private final String codigo;
    private final String nome;
    private final BigDecimal preco;
    private final int estoque;
    private final boolean ativo;
    ProdutoAtivo(String codigo, String nome, BigDecimal preco, int estoque, boolean ativo) {
        this.codigo = codigo; this.nome = nome; this.preco = preco;
        this.estoque = estoque; this.ativo = ativo;
    }
    boolean precoValido() { return preco != null && preco.compareTo(BigDecimal.ZERO) > 0; }
    boolean temEstoque() { return estoque > 0; }
    boolean disponivelParaVenda() { return ativo && precoValido() && temEstoque(); }
    BigDecimal valorTotalEmEstoque() {
        return precoValido() && temEstoque()
                ? preco.multiply(BigDecimal.valueOf(estoque)) : BigDecimal.ZERO;
    }
    String descricao() { return codigo + " | " + nome; }
}`;

const TEST_SOURCE = `import java.math.BigDecimal;

public class TesteMetodosComportamento {
    public static void main(String[] args) {
        PedidoTeste pedido = new PedidoTeste(new BigDecimal("200.00"), 2);
        assertEquals("400.00", pedido.totalBruto().toPlainString(), "total");
        assertTrue(pedido.temDesconto(), "tem desconto");
        assertEquals("40.0000", pedido.desconto().toPlainString(), "desconto");
        assertEquals("360.0000", pedido.totalFinal().toPlainString(), "final");
        PedidoTeste pequeno = new PedidoTeste(new BigDecimal("20.00"), 2);
        assertFalse(pequeno.temDesconto(), "sem desconto");
        assertEquals("0", pequeno.desconto().toPlainString(), "desconto zero");
        assertEquals("40.00", pequeno.totalFinal().toPlainString(), "final pequeno");
        System.out.println("7 testes passaram");
    }
    static void assertTrue(boolean atual, String caso) { if (!atual) throw new AssertionError(caso); }
    static void assertFalse(boolean atual, String caso) { assertTrue(!atual, caso); }
    static void assertEquals(Object esperado, Object atual, String caso) {
        if (!esperado.equals(atual)) throw new AssertionError(caso + ": " + atual);
    }
}

class PedidoTeste {
    private final BigDecimal preco;
    private final int quantidade;
    PedidoTeste(BigDecimal preco, int quantidade) { this.preco = preco; this.quantidade = quantidade; }
    BigDecimal totalBruto() { return preco.multiply(BigDecimal.valueOf(quantidade)); }
    boolean temDesconto() { return totalBruto().compareTo(new BigDecimal("300.00")) >= 0; }
    BigDecimal desconto() { return temDesconto() ? totalBruto().multiply(new BigDecimal("0.10")) : BigDecimal.ZERO; }
    BigDecimal totalFinal() { return totalBruto().subtract(desconto()); }
}`;

const ERRORS = [
  ['Classe só com getters', 'O objeto expõe dados e obriga todo consumidor a interpretar as regras.', 'Mova perguntas e cálculos que pertencem ao estado para métodos de comportamento.'],
  ['Regra espalhada fora', 'Desconto é copiado em main, relatório e serviço com percentuais diferentes.', 'Centralize a regra no Pedido e faça consumidores chamarem desconto().'],
  ['Infraestrutura no domínio', 'OrdemServico salva banco, envia WhatsApp e imprime relatório.', 'Mantenha no objeto regras próprias; deixe I/O, integração e persistência fora.'],
  ['Nome genérico', 'processar(), executar() e validar() não revelam a intenção.', 'Prefira totalFinal(), podeConfirmar(), encerrada() ou outro termo do domínio.'],
  ['Método grande demais', 'processarTudo valida, calcula, imprime, salva e notifica.', 'Divida decisões pequenas e retire responsabilidades externas.'],
  ['Static usa estado do objeto', 'Método recebe Pedido inteiro para calcular uma regra exclusiva dele.', 'Transforme a operação em método de instância.'],
  ['Regra ruim apenas escondida', 'Pedido inválido vira total zero e passa despercebido.', 'Documente a limitação didática e evolua depois para objeto sempre válido.'],
  ['Cadeia difícil de seguir', 'Um método abre dez outros sem revelar a decisão principal.', 'Componha métodos pequenos, mas preserve um fluxo de leitura direto.'],
];

const EVIDENCE = `# Aula 109 — Métodos de comportamento

- [ ] Diferenciei acesso de comportamento
- [ ] Identifiquei e refatorei objeto anêmico
- [ ] Apliquei as cinco perguntas de pertencimento
- [ ] Executei PedidoComComportamento.java
- [ ] Expliquei a limitação do total zero para pedido inválido
- [ ] Executei OrdemServicoComComportamento.java
- [ ] Executei PagamentoComComportamento.java
- [ ] Classifiquei domínio, infraestrutura e apresentação
- [ ] Depurei a composição entre métodos
- [ ] Modelei ProdutoComComportamento.java
- [ ] Executei 7 testes e revisei git status`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

function AccessBehaviorLab() {
  const [selected, setSelected] = useState(0);
  const methods = [
    ['nome()', 'Acesso', 'devolve diretamente um atributo'], ['precoUnitario()', 'Acesso', 'expõe um dado sem regra'], ['contatoCompleto()', 'Comportamento', 'combina email e telefone'], ['podeReceberMensagem()', 'Comportamento', 'responde com ativo e telefone'], ['totalFinal()', 'Comportamento', 'compõe total bruto e desconto'], ['filaSugerida(data)', 'Comportamento', 'aplica prioridade entre regras'],
  ];
  const current = methods[selected];
  return <section className="bm109-stack"><div className="bm109-classifier"><nav>{methods.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]}</code></button>)}</nav><main><small>CLASSIFICAÇÃO</small><strong>{current[1]}</strong><p>{current[2]}.</p></main></div><div className="bm109-principle"><Activity /><div><strong>Estado dá contexto; comportamento dá linguagem</strong><span>Um getter pode ser útil, mas a orientação a objetos começa a aparecer quando o objeto responde perguntas do domínio.</span></div></div></section>;
}

function AnemicLab() {
  const [view, setView] = useState('visual');
  return <section className="bm109-stack"><div className="bm109-toggle"><button type="button" className={view === 'visual' ? 'active' : ''} onClick={() => setView('visual')}>Antes e depois</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>PedidoAnemico.java</button></div>{view === 'code' ? <CodePanel name="PedidoAnemico.java" code={ANEMIC_SOURCE} /> : <div className="bm109-refactor"><article><header>Objeto anêmico</header><code>pedido.precoUnitario()</code><code>pedido.quantidade()</code><ArrowRight /><strong>consumidor conhece multiplicação</strong></article><ArrowRight /><article><header>Objeto com comportamento</header><code>pedido.totalBruto()</code><ArrowRight /><strong>Pedido protege a regra</strong></article></div>}<div className="bm109-principle"><GitBranch /><div><strong>Não mova código por estética</strong><span>A regra pertence ao Pedido porque usa principalmente o estado do Pedido e descreve uma pergunta natural sobre ele.</span></div></div></section>;
}

function OwnershipLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    ['Pedido calcula total bruto?', 'Dentro', 'usa preço e quantidade do próprio pedido'], ['Pedido imprime relatório?', 'Fora', 'formato de saída pertence à apresentação'], ['Cliente pode receber mensagem?', 'Dentro', 'depende de ativo e telefone'], ['Cliente envia WhatsApp?', 'Fora', 'depende de integração externa'], ['OS está atrasada?', 'Dentro', 'depende da data de abertura'], ['OS salva no banco?', 'Fora', 'persistência é infraestrutura'],
  ];
  const current = cases[selected];
  return <section className="bm109-stack"><div className="bm109-ownership"><nav>{cases.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{item[0]}</button>)}</nav><main><small>FRONTEIRA</small><strong>{current[1]} do objeto</strong><p>{current[2]}.</p></main></div><div className="bm109-questions">{['usa principalmente este estado?', 'é pergunta natural ao objeto?', 'descreve o próprio conceito?', 'deixa a chamada mais clara?', 'mantém responsabilidade pequena?'].map((item, index) => <span key={item}><b>{index + 1}</b>{item}</span>)}</div></section>;
}

function OrderLab() {
  const [price, setPrice] = useState(199.9);
  const [quantity, setQuantity] = useState(2);
  const gross = price > 0 && quantity > 0 ? price * quantity : 0;
  const hasDiscount = gross >= 300;
  const discount = hasDiscount ? gross * .1 : 0;
  const commands = ['javac PedidoComComportamento.java', 'java PedidoComComportamento'].join('\n');
  return <section className="bm109-stack"><div className="bm109-behavior-sim"><div><label>Preço unitário <b>{price.toFixed(2)}</b><input type="range" min="20" max="300" step="10" value={price} onChange={event => setPrice(Number(event.target.value))} /></label><label>Quantidade <b>{quantity}</b><input type="range" min="1" max="8" value={quantity} onChange={event => setQuantity(Number(event.target.value))} /></label></div><article><p><span>valido()</span><code>true</code></p><p><span>totalBruto()</span><code>{gross.toFixed(2)}</code></p><p><span>temDesconto()</span><code>{String(hasDiscount)}</code></p><p><span>desconto()</span><code>{discount.toFixed(2)}</code></p><p><span>totalFinal()</span><strong>{(gross - discount).toFixed(2)}</strong></p></article></div><CodePanel name="PedidoComComportamento.java" code={ORDER_SOURCE} /><div className="bm109-terminal"><header><Terminal size={15} />Compilar e observar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}Total bruto: 399.80{`\n`}Desconto: 39.9800{`\n`}Total final: 359.8200{`\n`}Pedido com desconto: true</pre></div><div className="bm109-warning"><AlertTriangle /><div><strong>Total zero pode esconder pedido inválido</strong><span>É uma simplificação didática desta fase. Depois vamos validar no construtor, lançar exceções e impedir objetos inválidos.</span></div></div></section>;
}

function OsLab() {
  const [status, setStatus] = useState('ABERTA');
  const [days, setDays] = useState(6);
  const [reschedules, setReschedules] = useState(1);
  const closed = ['CONCLUIDA', 'CANCELADA'].includes(status);
  const late = days > 3;
  const needsReschedule = reschedules >= 2;
  const attention = late || needsReschedule;
  const queue = closed ? 'SEM_FILA' : late ? 'CASOS_CRITICOS' : needsReschedule ? 'REAGENDAMENTO' : 'ENTRADA';
  return <section className="bm109-stack"><div className="bm109-os"><div><label>Status<select value={status} onChange={event => setStatus(event.target.value)}>{['ABERTA', 'AGENDADA', 'REAGENDADA', 'CONCLUIDA', 'CANCELADA'].map(item => <option key={item}>{item}</option>)}</select></label><label>Dias <b>{days}</b><input type="range" min="0" max="10" value={days} onChange={event => setDays(Number(event.target.value))} /></label><label>Reagendamentos <b>{reschedules}</b><input type="range" min="0" max="4" value={reschedules} onChange={event => setReschedules(Number(event.target.value))} /></label></div><div className="bm109-callgraph"><article><strong>filaSugerida(hoje)</strong><span>{queue}</span></article><div><code>encerrada() → {String(closed)}</code><code>atrasada() → {String(late)}</code><code>precisaReagendamento() → {String(needsReschedule)}</code><code>precisaAtencao() → {String(attention)}</code></div></div></div><CodePanel name="OrdemServicoComComportamento.java" code={OS_SOURCE} /><div className="bm109-principle"><Network /><div><strong>Métodos pequenos podem formar uma decisão maior</strong><span>precisaAtencao combina duas perguntas; filaSugerida preserva a prioridade sem espalhar condições pelo main.</span></div></div></section>;
}

function PaymentLab() {
  const [approved, setApproved] = useState(true);
  const [value, setValue] = useState(150);
  const [method, setMethod] = useState('PIX');
  const confirm = value > 0 && method !== 'NENHUMA' && approved;
  return <section className="bm109-stack"><div className="bm109-payment"><div><label>Valor<input type="number" value={value} onChange={event => setValue(Number(event.target.value))} /></label><label>Forma<select value={method} onChange={event => setMethod(event.target.value)}><option>PIX</option><option>CARTAO</option><option>BOLETO</option><option>NENHUMA</option></select></label><label className="bm109-check"><input type="checkbox" checked={approved} onChange={event => setApproved(event.target.checked)} />aprovado</label></div><article><small>COMPOSIÇÃO</small><code>codigo informado</code><code>valorValido() → {String(value > 0)}</code><code>formaInformada() → {String(method !== 'NENHUMA')}</code><code>aprovado() → {String(approved)}</code><strong>podeConfirmar() → {String(confirm)}</strong></article></div><CodePanel name="PagamentoComComportamento.java" code={PAYMENT_SOURCE} /></section>;
}

function NamingLab() {
  const [selected, setSelected] = useState(0);
  const names = [
    ['validar()', 'valido()', 'pergunta sobre validade'], ['calcular()', 'totalFinal()', 'valor derivado específico'], ['verificar()', 'temDesconto()', 'boolean lido naturalmente'], ['processar()', 'filaSugerida(data)', 'decisão operacional explícita'], ['executar()', 'podeConfirmar()', 'permissão do domínio'], ['fazer()', 'precisaAtencao(data)', 'necessidade observável'],
  ];
  const current = names[selected];
  return <section className="bm109-stack"><div className="bm109-naming"><nav>{names.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]}</code></button>)}</nav><main><small>GENÉRICO → DOMÍNIO</small><div><code>{current[0]}</code><ArrowRight /><code>{current[1]}</code></div><p>{current[2]}.</p></main></div><div className="bm109-returns"><article><strong>boolean</strong><span>tem · pode · deve · está · possui · permite · precisa</span></article><article><strong>valor</strong><span>totalBruto · desconto · diasEmAberto · filaSugerida · descricao</span></article></div></section>;
}

function BoundariesLab() {
  const [selected, setSelected] = useState(0);
  const actions = [
    ['calcular total do Pedido', 'Domínio', 'usa estado e regra do pedido'], ['salvar Pedido no banco', 'Infraestrutura', 'depende de persistência'], ['ler pedido do Scanner', 'Entrada', 'depende da interface'], ['exibir relatório da OS', 'Apresentação', 'depende do formato de saída'], ['chamar API de pagamento', 'Integração', 'depende de sistema externo'], ['publicar evento em fila', 'Mensageria', 'depende de broker'],
  ];
  const current = actions[selected];
  return <section className="bm109-stack"><div className="bm109-boundaries"><nav>{actions.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{item[0]}</button>)}</nav><main><small>RESPONSABILIDADE</small><strong>{current[1]}</strong><p>{current[2]}.</p></main></div><div className="bm109-principle"><Route /><div><strong>Objeto de domínio não é dono do sistema inteiro</strong><span>Colocar tudo dentro da classe não torna o código mais OO; só mistura regras, I/O, infraestrutura e orquestração.</span></div></div></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [
    ['main', 'pedido.totalFinal()', 'entra no comportamento'], ['totalFinal', 'this = Pedido@2f4a', 'chama totalBruto()'], ['totalBruto', '199.90 × 2', '399.80'], ['totalFinal', 'chama desconto()', 'segunda parte'], ['desconto', 'chama temDesconto()', 'regra booleana'], ['temDesconto', 'totalBruto() >= 300', 'true'], ['desconto', '399.80 × 0.10', '39.9800'], ['totalFinal', '399.80 - 39.9800', '359.8200'],
  ];
  const current = trace[pause];
  return <section className="bm109-stack"><div className="bm109-debug"><header><span>PedidoComComportamento.java · Debug</span><span>Call Stack · Variables · F7</span></header><div><aside>{trace.map((item, index) => <button type="button" key={index} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>PAUSA {pause + 1} DE {trace.length}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}</p><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => value + 1)}><StepForward size={15} />Próxima chamada</button></main></div><footer>Observe quais atributos entram em cada método, quem chama quem e onde a decisão altera o retorno.</footer></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors bm109-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [view, setView] = useState('contract');
  const [checked, setChecked] = useState([]);
  const checks = ['acesso e comportamento classificados', 'objeto anêmico refatorado', 'cinco perguntas aplicadas', 'Pedido executado', 'limitação do total zero explicada', 'OS executada', 'Pagamento executado', 'fronteiras classificadas', 'oito chamadas depuradas', 'Produto executado', '7 testes e Git concluídos'];
  const commands = ['javac ProdutoComComportamento.java', 'java ProdutoComComportamento', 'javac TesteMetodosComportamento.java', 'java TesteMetodosComportamento', 'git status', 'git add labs/m4/aula-109-metodos-de-comportamento', 'git commit -m "Aula 109: cria metodos de comportamento"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="bm109-stack"><div className="bm109-toggle"><button type="button" className={view === 'contract' ? 'active' : ''} onClick={() => setView('contract')}>Contrato do Produto</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código</button><button type="button" className={view === 'tests' ? 'active' : ''} onClick={() => setView('tests')}>Testes</button></div>{view === 'code' ? <CodePanel name="ProdutoComComportamento.java" code={PRODUCT_SOURCE} /> : view === 'tests' ? <CodePanel name="TesteMetodosComportamento.java" code={TEST_SOURCE} /> : <div className="bm109-contract"><section><small>ESTADO</small><strong>codigo · nome · preco · estoque · ativo</strong></section><section><small>PERGUNTAS</small><strong>precoValido · temEstoque · disponivelParaVenda</strong></section><section><small>VALORES DERIVADOS</small><strong>valorTotalEmEstoque · descricao</strong></section><section><small>FORA DO PRODUTO</small><strong>console · banco · API · relatório</strong></section></div>}<div className="bm109-terminal"><header><Play size={15} />Compilar, testar e versionar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}7 testes passaram</pre></div><div className="bm109-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral do comportamento</h3></div><ul><li>Qual é a diferença entre getter e método de comportamento?</li><li>Qual regra saiu do código procedural e passou ao objeto?</li><li>Qual ação ficou fora por depender de infraestrutura?</li><li>Como os métodos menores compõem valorTotalEmEstoque ou totalFinal?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'access', label: 'Acesso vs Comportamento', duration: '10 min', eyebrow: 'GETTER, PERGUNTA E REGRA', title: 'Distinga devolver um dado de interpretar o estado', blocks: [{ type: 'lead', text: 'Um método de acesso expõe um atributo; um método de comportamento responde pergunta, executa ação ou calcula valor do domínio.' }, { type: 'access' }] },
  { id: 'anemic', label: 'Objeto Anêmico', duration: '13 min', eyebrow: 'DADOS DENTRO, REGRA FORA', title: 'Veja por que uma classe de getters ainda pode ser procedural', blocks: [{ type: 'lead', text: 'Quando o consumidor busca preço e quantidade para multiplicar, ele conhece uma regra que o Pedido deveria oferecer.' }, { type: 'anemic' }] },
  { id: 'ownership', label: 'Quem é Dono da Regra?', duration: '12 min', eyebrow: 'CINCO PERGUNTAS E SEIS DECISÕES', title: 'Coloque o comportamento no objeto certo — e somente nele', blocks: [{ type: 'lead', text: 'Dependência principal do estado, linguagem natural e responsabilidade pequena ajudam a decidir pertencimento.' }, { type: 'ownership' }] },
  { id: 'order', label: 'Pedido com Comportamento', duration: '20 min', eyebrow: 'VALIDADE, TOTAL, DESCONTO E COMPOSIÇÃO', title: 'Faça o Pedido centralizar cálculos e perguntas', blocks: [{ type: 'lead', text: 'Altere preço e quantidade, acompanhe os cinco comportamentos e depois execute o programa completo.' }, { type: 'order' }] },
  { id: 'os', label: 'OS com Comportamento', duration: '20 min', eyebrow: 'TEMPO, STATUS, ATENÇÃO E FILA', title: 'Componha perguntas pequenas em uma decisão operacional', blocks: [{ type: 'lead', text: 'A OS sabe se está encerrada, atrasada ou precisa reagendamento; o main apenas pede a resposta.' }, { type: 'os' }] },
  { id: 'payment', label: 'Pagamento com Regra', duration: '17 min', eyebrow: 'MÉTODOS BOOLEANOS E DESCRIÇÃO', title: 'Faça podeConfirmar explicar quatro condições', blocks: [{ type: 'lead', text: 'O comportamento composto deixa o código externo limpo e permite comparar pagamento aprovado e pendente.' }, { type: 'payment' }] },
  { id: 'naming', label: 'Nome e Tipo de Retorno', duration: '12 min', eyebrow: 'LINGUAGEM DO DOMÍNIO', title: 'Troque verbos vagos por perguntas e valores específicos', blocks: [{ type: 'lead', text: 'Bons nomes revelam o que boolean significa e qual valor o cálculo devolve.' }, { type: 'naming' }] },
  { id: 'boundaries', label: 'Domínio vs Infraestrutura', duration: '13 min', eyebrow: 'REGRA, I/O, BANCO, API E MENSAGERIA', title: 'Evite transformar o objeto no sistema inteiro', blocks: [{ type: 'lead', text: 'Comportamento que interpreta o próprio estado pode ficar dentro; integração, persistência e apresentação geralmente ficam fora.' }, { type: 'boundaries' }] },
  { id: 'debug', label: 'Debug da Composição', duration: '14 min', eyebrow: 'CALL STACK, THIS E RETORNOS', title: 'Entre em totalFinal e acompanhe quatro métodos cooperando', blocks: [{ type: 'lead', text: 'O mock de IDE mostra chamadas, atributos, retornos intermediários e a decisão que ativa o desconto.' }, { type: 'debug' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'ANEMIA, DUPLICAÇÃO, INFRAESTRUTURA E TAMANHO', title: 'Diagnostique oito falhas de comportamento', blocks: [{ type: 'lead', text: 'Mover a regra para a classe só ajuda quando pertencimento, nome, tamanho e lógica também estão corretos.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Produto', duration: '19 min', eyebrow: 'PERGUNTAS, VALORES, TESTES E GIT', title: 'Modele um Produto que faz mais do que informar', blocks: [{ type: 'lead', text: 'A entrega reúne booleanos legíveis, valor derivado, descrição, duas instâncias e a separação explícita de infraestrutura.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const map = { access: AccessBehaviorLab, anemic: AnemicLab, ownership: OwnershipLab, order: OrderLab, os: OsLab, payment: PaymentLab, naming: NamingLab, boundaries: BoundariesLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = map[block.type];
  return Component ? <Component /> : null;
}

export default function GuidedBehaviorMethodsLesson109({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => { const active = navRef.current?.querySelector('button.active'); if (active && window.matchMedia('(max-width: 900px)').matches) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]);
  const step = steps[activeIndex];
  const stepDone = completedSteps.has(step.id);
  const allStepsDone = completedSteps.size === steps.length;
  const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); };
  return <article className="guided-git-lesson guided-behavior-methods-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Workflow size={17} />Laboratório de comportamento de domínio</span><p className="guided-sequence">109 · M4.05</p><h1>O objeto não apenas guarda; ele responde pelo próprio estado</h1><p>Saia de classes anêmicas, centralize regras simples, componha perguntas e cálculos pequenos e mantenha banco, console, API e mensageria fora do domínio.</p></div><div className="guided-hero-status"><Activity size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 109" items={[{ value: '6 fontes', label: 'Compiladas e testadas' }, { value: '8 chamadas', label: 'No debug da composição' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 109"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Estado e comportamento agora falam a mesma linguagem</h3><p>{lessonComplete ? 'Aula concluída: agora você pode aprofundar construtores.' : 'Execute os programas e defenda as fronteiras antes de concluir.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 108</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Acesso, regra, composição e fronteira</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 110<ArrowRight size={17} /></button></footer></article>;
}
