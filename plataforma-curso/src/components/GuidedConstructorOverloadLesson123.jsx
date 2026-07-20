import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Check, CheckCircle2,
  Clock3, Copy, FileCode2, Fingerprint, ListChecks, Play,
  RotateCcw, Route, ShieldCheck, Sparkles, StepForward, TerminalSquare,
  Waypoints,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedConstructorOverloadLesson.css";

const STORAGE_KEY = "guided-constructor-overload-lesson-123-progress";

const SIGNATURE_SOURCE = `public class AssinaturasConstrutor123 {
    public static void main(String[] args) {
        ClienteAssinatura123 a = new ClienteAssinatura123("Ana Silva");
        ClienteAssinatura123 b = new ClienteAssinatura123("Bia Souza", "bia@email.com");
        ClienteAssinatura123 c = new ClienteAssinatura123(10, "Caio Lima");
        System.out.println(a.resumo());
        System.out.println(b.resumo());
        System.out.println(c.resumo());
    }
}
class ClienteAssinatura123 {
    private final int id;
    private final String nome;
    private final String email;
    ClienteAssinatura123(String nome) { this(0, nome, null); }
    ClienteAssinatura123(String nome, String email) { this(0, nome, email); }
    ClienteAssinatura123(int id, String nome) { this(id, nome, null); }
    private ClienteAssinatura123(int id, String nome, String email) {
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome obrigatório.");
        this.id = id; this.nome = nome.trim(); this.email = email;
    }
    String resumo() { return "Cliente " + id + " | " + nome + " | " + (email == null ? "sem e-mail" : email); }
}`;

const INVALID_SIGNATURE_SOURCE = `class AssinaturaDuplicada123 {
    AssinaturaDuplicada123(String nome, String email) { }
    AssinaturaDuplicada123(String email, String nome) { }
    // ERRO: nomes dos parâmetros não fazem parte da assinatura.
}`;

const CHAIN_SOURCE = `import java.math.BigDecimal;

public class EncadeamentoConstrutor123 {
    public static void main(String[] args) {
        ProdutoEncadeado123 a = new ProdutoEncadeado123("PROD-001", "Cadeira", new BigDecimal("199.90"));
        ProdutoEncadeado123 b = new ProdutoEncadeado123("PROD-002", "Mesa", new BigDecimal("499.90"), 10);
        ProdutoEncadeado123 c = new ProdutoEncadeado123("PROD-003", "Armário", new BigDecimal("899.90"), 0, StatusProduto123.INATIVO);
        System.out.println(a.resumo());
        System.out.println(b.resumo());
        System.out.println(c.resumo());
    }
}
enum StatusProduto123 { ATIVO, INATIVO }
class ProdutoEncadeado123 {
    private final String codigo;
    private final String nome;
    private final BigDecimal preco;
    private final int estoque;
    private final StatusProduto123 status;
    ProdutoEncadeado123(String codigo, String nome, BigDecimal preco) {
        this(codigo, nome, preco, 0);
    }
    ProdutoEncadeado123(String codigo, String nome, BigDecimal preco, int estoque) {
        this(codigo, nome, preco, estoque, StatusProduto123.ATIVO);
    }
    ProdutoEncadeado123(String codigo, String nome, BigDecimal preco, int estoque, StatusProduto123 status) {
        if (codigo == null || !codigo.startsWith("PROD-") || nome == null || nome.isBlank()) throw new IllegalArgumentException("Identificação inválida.");
        if (preco == null || preco.signum() <= 0 || estoque < 0 || status == null) throw new IllegalArgumentException("Estado inicial inválido.");
        this.codigo = codigo; this.nome = nome; this.preco = preco; this.estoque = estoque; this.status = status;
    }
    String resumo() { return codigo + " | " + nome + " | R$ " + preco + " | estoque=" + estoque + " | " + status; }
}`;

const INVALID_THIS_SOURCE = `class ThisForaDePosicao123 {
    ThisForaDePosicao123(String codigo) {
        System.out.println("Criando " + codigo);
        this(codigo, 0); // ERRO: this(...) precisa ser a primeira instrução
    }
    ThisForaDePosicao123(String codigo, int estoque) { }
}`;

const DEFAULT_SOURCE = `public class PadraoDominio123 {
    public static void main(String[] args) {
        ClientePedido123 cliente = new ClientePedido123(10, "Ana Silva", true);
        PedidoPadrao123 novo = new PedidoPadrao123(1001, cliente, 39980);
        PedidoPadrao123 reconstituido = new PedidoPadrao123(1002, cliente, 39980, StatusPedido123.PAGO);
        System.out.println(novo.resumo());
        System.out.println(reconstituido.resumo());
    }
}
enum StatusPedido123 { CRIADO, PAGO, CANCELADO }
record ClientePedido123(int id, String nome, boolean ativo) { }
class PedidoPadrao123 {
    private final int numero;
    private final ClientePedido123 cliente;
    private final int totalCentavos;
    private final StatusPedido123 status;
    PedidoPadrao123(int numero, ClientePedido123 cliente, int totalCentavos) {
        this(numero, cliente, totalCentavos, StatusPedido123.CRIADO);
    }
    PedidoPadrao123(int numero, ClientePedido123 cliente, int totalCentavos, StatusPedido123 status) {
        if (numero <= 0 || cliente == null || !cliente.ativo() || totalCentavos <= 0 || status == null)
            throw new IllegalArgumentException("Pedido inválido.");
        this.numero = numero; this.cliente = cliente; this.totalCentavos = totalCentavos; this.status = status;
    }
    String resumo() { return "Pedido " + numero + " | " + cliente.nome() + " | centavos=" + totalCentavos + " | " + status; }
}`;

const MONEY_SOURCE = `import java.math.BigDecimal;
import java.math.RoundingMode;

public class DinheiroConstrutores123 {
    public static void main(String[] args) {
        System.out.println(new DinheiroSobrecarga123("199.90"));
        System.out.println(new DinheiroSobrecarga123(new BigDecimal("199.90")));
        System.out.println(new DinheiroSobrecarga123(199));
    }
}
final class DinheiroSobrecarga123 {
    private final BigDecimal valor;
    DinheiroSobrecarga123(String valor) { this(converterTexto(valor)); }
    DinheiroSobrecarga123(int valor) { this(BigDecimal.valueOf(valor)); }
    DinheiroSobrecarga123(BigDecimal valor) {
        if (valor == null) throw new IllegalArgumentException("Valor obrigatório.");
        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }
    private static BigDecimal converterTexto(String valor) {
        if (valor == null || valor.isBlank()) throw new IllegalArgumentException("Texto obrigatório.");
        return new BigDecimal(valor);
    }
    @Override public String toString() { return "R$ " + valor; }
}`;

const INVALID_AMBIGUITY_SOURCE = `class EmailAmbiguo123 { }
class NotificacaoAmbigua123 {
    NotificacaoAmbigua123(String texto) { }
    NotificacaoAmbigua123(EmailAmbiguo123 email) { }
}
class AmbiguidadeNull123 {
    public static void main(String[] args) {
        new NotificacaoAmbigua123(null); // ERRO: qual construtor?
    }
}`;

const FACTORY_SOURCE = `public class FactoryNomeada123 {
    public static void main(String[] args) {
        PedidoFactory123 novo = PedidoFactory123.novo(1001, "Ana Silva");
        PedidoFactory123 salvo = PedidoFactory123.reconstituido(1002, "Ana Silva", StatusFactory123.PAGO);
        System.out.println(novo.resumo());
        System.out.println(salvo.resumo());
    }
}
enum StatusFactory123 { CRIADO, PAGO, CANCELADO }
final class PedidoFactory123 {
    private final int numero;
    private final String cliente;
    private final StatusFactory123 status;
    private PedidoFactory123(int numero, String cliente, StatusFactory123 status) {
        if (numero <= 0 || cliente == null || cliente.isBlank() || status == null) throw new IllegalArgumentException("Pedido inválido.");
        this.numero = numero; this.cliente = cliente; this.status = status;
    }
    static PedidoFactory123 novo(int numero, String cliente) {
        return new PedidoFactory123(numero, cliente, StatusFactory123.CRIADO);
    }
    static PedidoFactory123 reconstituido(int numero, String cliente, StatusFactory123 status) {
        return new PedidoFactory123(numero, cliente, status);
    }
    String resumo() { return "Pedido " + numero + " | " + cliente + " | " + status; }
}`;

const OS_SOURCE = `import java.time.LocalDate;

public class OrdemServicoConstrutores123 {
    public static void main(String[] args) {
        ClienteOs123 cliente = new ClienteOs123(10, "Carlos Lima");
        OrdemServico123 a = new OrdemServico123(new CodigoOs123("OS-2026-0001"), cliente, new PeriodoOs123(LocalDate.of(2026, 7, 20), TurnoOs123.MANHA));
        OrdemServico123 b = new OrdemServico123("OS-2026-0002", cliente, LocalDate.of(2026, 7, 21), TurnoOs123.TARDE);
        System.out.println(a.resumo());
        System.out.println(b.resumo());
    }
}
enum TurnoOs123 { MANHA, TARDE }
record CodigoOs123(String valor) {
    CodigoOs123 { if (valor == null || !valor.startsWith("OS-")) throw new IllegalArgumentException("Código inválido."); }
    @Override public String toString() { return valor; }
}
record ClienteOs123(int id, String nome) {
    ClienteOs123 { if (id <= 0 || nome == null || nome.isBlank()) throw new IllegalArgumentException("Cliente inválido."); }
}
record PeriodoOs123(LocalDate data, TurnoOs123 turno) {
    PeriodoOs123 { if (data == null || turno == null) throw new IllegalArgumentException("Período inválido."); }
}
class OrdemServico123 {
    private final CodigoOs123 codigo;
    private final ClienteOs123 cliente;
    private final PeriodoOs123 periodo;
    OrdemServico123(CodigoOs123 codigo, ClienteOs123 cliente, PeriodoOs123 periodo) {
        if (codigo == null || cliente == null || periodo == null) throw new IllegalArgumentException("OS inválida.");
        this.codigo = codigo; this.cliente = cliente; this.periodo = periodo;
    }
    OrdemServico123(String codigo, ClienteOs123 cliente, LocalDate data, TurnoOs123 turno) {
        this(new CodigoOs123(codigo), cliente, new PeriodoOs123(data, turno));
    }
    String resumo() { return codigo + " | " + cliente.nome() + " | " + periodo.data() + " " + periodo.turno(); }
}`;

const CONTRACT_SOURCE = `import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class SobrecargaConstrutoresContrato123 {
    public static void main(String[] args) {
        ClienteContrato123 cliente = new ClienteContrato123(10, "Ana Silva", true);
        ServicoContrato123 servico = new ServicoContrato123("Suporte", new BigDecimal("200.00"));
        PeriodoContrato123 periodo = new PeriodoContrato123(LocalDate.of(2026, 7, 1), LocalDate.of(2026, 9, 30));
        ContratoSobrecarga123 a = new ContratoSobrecarga123("CONT-001", cliente, servico, periodo);
        ContratoSobrecarga123 b = new ContratoSobrecarga123("CONT-002", cliente, servico, LocalDate.of(2026, 8, 1), LocalDate.of(2026, 10, 31));
        ContratoSobrecarga123 c = ContratoSobrecarga123.reconstituido("CONT-003", cliente, servico, periodo, StatusContrato123.ATIVO);
        System.out.println(a.resumo());
        System.out.println(b.resumo());
        System.out.println(c.resumo());
    }
}
enum StatusContrato123 { RASCUNHO, ATIVO, CANCELADO }
record ClienteContrato123(int id, String nome, boolean ativo) {
    ClienteContrato123 { if (id <= 0 || nome == null || nome.isBlank()) throw new IllegalArgumentException("Cliente inválido."); }
}
record ServicoContrato123(String nome, BigDecimal valorMensal) {
    ServicoContrato123 {
        if (nome == null || nome.isBlank() || valorMensal == null || valorMensal.signum() <= 0)
            throw new IllegalArgumentException("Serviço inválido.");
    }
}
record PeriodoContrato123(LocalDate inicio, LocalDate fim) {
    PeriodoContrato123 {
        if (inicio == null || fim == null || fim.isBefore(inicio)) throw new IllegalArgumentException("Período inválido.");
    }
    long meses() { return ChronoUnit.MONTHS.between(inicio.withDayOfMonth(1), fim.withDayOfMonth(1)) + 1; }
}
class ContratoSobrecarga123 {
    private final String codigo;
    private final ClienteContrato123 cliente;
    private final ServicoContrato123 servico;
    private final PeriodoContrato123 periodo;
    private final StatusContrato123 status;
    ContratoSobrecarga123(String codigo, ClienteContrato123 cliente, ServicoContrato123 servico, PeriodoContrato123 periodo) {
        this(codigo, cliente, servico, periodo, StatusContrato123.RASCUNHO);
    }
    ContratoSobrecarga123(String codigo, ClienteContrato123 cliente, ServicoContrato123 servico, LocalDate inicio, LocalDate fim) {
        this(codigo, cliente, servico, new PeriodoContrato123(inicio, fim));
    }
    private ContratoSobrecarga123(String codigo, ClienteContrato123 cliente, ServicoContrato123 servico, PeriodoContrato123 periodo, StatusContrato123 status) {
        if (codigo == null || codigo.isBlank() || cliente == null || !cliente.ativo() || servico == null || periodo == null || status == null)
            throw new IllegalArgumentException("Contrato inválido.");
        this.codigo = codigo; this.cliente = cliente; this.servico = servico; this.periodo = periodo; this.status = status;
    }
    static ContratoSobrecarga123 reconstituido(String codigo, ClienteContrato123 cliente, ServicoContrato123 servico, PeriodoContrato123 periodo, StatusContrato123 status) {
        return new ContratoSobrecarga123(codigo, cliente, servico, periodo, status);
    }
    BigDecimal valorTotal() { return servico.valorMensal().multiply(BigDecimal.valueOf(periodo.meses())); }
    boolean ativo() { return status == StatusContrato123.ATIVO; }
    String resumo() { return codigo + " | " + cliente.nome() + " | " + status + " | meses=" + periodo.meses() + " | total=R$ " + valorTotal(); }
}`;

const TEST_SOURCE = `import java.math.BigDecimal;
import java.time.LocalDate;

public class TesteSobrecarga123 {
    private static int testes;
    public static void main(String[] args) {
        ClienteContrato123 cliente = new ClienteContrato123(10, "Ana", true);
        ServicoContrato123 servico = new ServicoContrato123("Suporte", new BigDecimal("200.00"));
        PeriodoContrato123 periodo = new PeriodoContrato123(LocalDate.of(2026, 7, 1), LocalDate.of(2026, 9, 30));
        ContratoSobrecarga123 a = new ContratoSobrecarga123("CONT-001", cliente, servico, periodo);
        check(!a.ativo());
        check(a.valorTotal().compareTo(new BigDecimal("600.00")) == 0);
        ContratoSobrecarga123 b = new ContratoSobrecarga123("CONT-002", cliente, servico, LocalDate.of(2026, 8, 1), LocalDate.of(2026, 10, 31));
        check(b.valorTotal().compareTo(new BigDecimal("600.00")) == 0);
        ContratoSobrecarga123 c = ContratoSobrecarga123.reconstituido("CONT-003", cliente, servico, periodo, StatusContrato123.ATIVO);
        check(c.ativo());
        expectError(() -> new PeriodoContrato123(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 8, 1)));
        expectError(() -> new ServicoContrato123("Suporte", BigDecimal.ZERO));
        expectError(() -> new ContratoSobrecarga123("CONT-004", new ClienteContrato123(11, "Bia", false), servico, periodo));
        expectError(() -> ContratoSobrecarga123.reconstituido("CONT-005", cliente, servico, periodo, null));
        System.out.println(testes + " testes passaram");
    }
    private static void expectError(Runnable acao) {
        try { acao.run(); throw new AssertionError("Erro esperado."); }
        catch (IllegalArgumentException esperado) { testes++; }
    }
    private static void check(boolean condicao) { testes++; if (!condicao) throw new AssertionError("Falhou teste " + testes); }
}`;

const ERRORS = [
  ["Validação duplicada", "Cada construtor repete nome, código e estoque.", "Faça os menores delegarem para um construtor principal."],
  ["Código antes de this(...) ", "A compilação falha mesmo que a lógica anterior pareça inocente.", "this(...) deve ser literalmente a primeira instrução."],
  ["Construtores demais", "A IDE mostra um labirinto de combinações parecidas.", "Mantenha poucos caminhos legítimos ou use factory/builder."],
  ["Padrão perigoso", "Um e-mail fictício esconde que o domínio exige contato real.", "Use apenas padrões semanticamente válidos; modele ausência explicitamente."],
  ["Muitos parâmetros iguais", "String nome e String email podem ser invertidos sem o compilador perceber.", "Crie tipos fortes ou factory com nome quando a intenção não estiver clara."],
  ["Ignorar factory", "novo e reconstituído parecem apenas variações posicionais.", "Use métodos nomeados quando os cenários carregam significados diferentes."],
  ["Atalho cria inválido", "Um construtor alternativo pula validações do principal.", "Todos os caminhos públicos devem terminar na mesma barreira de invariantes."],
  ["Sobrecarga = sobrescrita", "Os conceitos são confundidos por terem nomes próximos.", "Sobrecarga muda parâmetros na mesma classe; sobrescrita redefine método herdado."],
];

const EVIDENCE = `# Aula 123 — sobrecarga de construtores
- [ ] Resolvi assinaturas por quantidade, tipo e ordem
- [ ] Provei que nomes de parâmetros não diferenciam assinatura
- [ ] Usei this(...) como primeira instrução
- [ ] Centralizei validação no construtor principal
- [ ] Classifiquei valores padrão seguros e perigosos
- [ ] Apliquei sobrecarga em entidade e objeto de valor
- [ ] Reproduzi ambiguidade com null
- [ ] Escolhi factory quando o nome melhora a intenção
- [ ] Entreguei Contrato e 8 testes`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? "Copiado" : "Copiar"}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{code}</SyntaxHighlighter></section>;
}

function SignatureLab() {
  const [call, setCall] = useState(0);
  const [collision, setCollision] = useState(false);
  const calls = [
    ["new Cliente(\"Ana\")", "Cliente(String)", "1 argumento · String"],
    ["new Cliente(\"Bia\", \"bia@email.com\")", "Cliente(String, String)", "2 argumentos · String, String"],
    ["new Cliente(10, \"Caio\")", "Cliente(int, String)", "2 argumentos · int, String"],
  ];
  const current = calls[call];
  return <section className="ov123-stack"><div className="ov123-signature"><nav>{calls.map((item, index) => <button type="button" className={call === index ? "active" : ""} onClick={() => { setCall(index); setCollision(false); }} key={item[0]}><span>{index + 1}</span>{item[0]}</button>)}<button type="button" className={collision ? "collision" : ""} onClick={() => setCollision(true)}><span>!</span>Trocar apenas os nomes</button></nav><main className={collision ? "collision" : ""}><Route /><span>{collision ? "ASSINATURA DUPLICADA" : "RESOLUÇÃO DO COMPILADOR"}</span><code>{collision ? "Cliente(String nome, String email)\nCliente(String email, String nome)" : current[0]}</code><ArrowDown /><strong>{collision ? "erro: constructor is already defined" : current[1]}</strong><p>{collision ? "Os dois continuam sendo Cliente(String, String). Nome de parâmetro documenta; não diferencia assinatura." : <>O Java compara {current[2]}. Nomes como <code>nome</code> e <code>email</code> não participam da assinatura.</>}</p></main></div><CodePanel name={collision ? "AssinaturaDuplicada123.java" : "AssinaturasConstrutor123.java"} code={collision ? INVALID_SIGNATURE_SOURCE : SIGNATURE_SOURCE} /></section>;
}

function PurposeLab() {
  const [path, setPath] = useState("minimal");
  const data = {
    minimal: ["Produto mínimo", "codigo · nome · preço", "estoque=0 · status=ATIVO"],
    stock: ["Produto com estoque", "codigo · nome · preço · estoque", "status=ATIVO"],
    complete: ["Produto completo", "codigo · nome · preço · estoque · status", "nenhum padrão oculto"],
  }[path];
  return <section className="ov123-stack"><div className="ov123-purpose"><header><button type="button" className={path === "minimal" ? "active" : ""} onClick={() => setPath("minimal")}>3 parâmetros</button><button type="button" className={path === "stock" ? "active" : ""} onClick={() => setPath("stock")}>4 parâmetros</button><button type="button" className={path === "complete" ? "active" : ""} onClick={() => setPath("complete")}>5 parâmetros</button></header><main><Fingerprint /><div><span>FORMA LEGÍTIMA DE NASCIMENTO</span><h3>{data[0]}</h3><code>{data[1]}</code><p>Padrões aplicados: <strong>{data[2]}</strong></p></div></main></div><p className="guided-note"><ShieldCheck size={18} /><span>Sobrecarga só é útil quando cada assinatura representa um nascimento válido e compreensível.</span></p></section>;
}

function DuplicationLab() {
  const [centralized, setCentralized] = useState(false);
  return <section className="ov123-stack"><div className="ov123-duplication"><header><button type="button" className={!centralized ? "danger" : ""} onClick={() => setCentralized(false)}>Validação copiada</button><button type="button" className={centralized ? "active" : ""} onClick={() => setCentralized(true)}>Construtor principal</button></header><main>{centralized ? <><section><code>Produto(codigo, nome)</code><ArrowDown /><span>this(codigo, nome, 0)</span></section><section><code>Produto(codigo, nome, estoque)</code><ArrowDown /><span>validar uma vez</span></section><strong>1 barreira de invariantes</strong></> : <><section><code>Produto(codigo, nome)</code><ArrowDown /><span>validar codigo + nome</span></section><section><code>Produto(codigo, nome, estoque)</code><ArrowDown /><span>validar codigo + nome + estoque</span></section><strong className="danger">Regra pode divergir em 2 lugares</strong></>}</main><p>{centralized ? "Se a regra do código mudar, existe um único ponto para corrigir e testar." : "Copiar validação cria versões diferentes do que significa Produto válido."}</p></div></section>;
}

function ChainLab() {
  const [entry, setEntry] = useState(0);
  const entries = ["3 parâmetros", "4 parâmetros", "5 parâmetros"];
  return <section className="ov123-stack"><div className="ov123-chain"><header>{entries.map((item, index) => <button type="button" className={entry === index ? "active" : ""} onClick={() => setEntry(index)} key={item}>{item}</button>)}</header><main><section className={entry === 0 ? "active" : ""}><span>Produto(c, n, p)</span><small>aplica estoque 0</small></section><ArrowRight /><section className={entry <= 1 ? "active" : ""}><span>Produto(c, n, p, e)</span><small>aplica status ATIVO</small></section><ArrowRight /><section className="active principal"><span>Produto(c, n, p, e, s)</span><small>valida e atribui tudo</small></section></main><p><code>this(...)</code> precisa ser a primeira instrução porque a construção deve seguir diretamente para outro construtor antes de usar o objeto.</p></div><CodePanel name="EncadeamentoConstrutor123.java" code={CHAIN_SOURCE} /></section>;
}

function ThisErrorLab() {
  const [valid, setValid] = useState(true);
  return <section className="ov123-stack"><div className="ov123-this-error"><header><button type="button" className={valid ? "active" : ""} onClick={() => setValid(true)}>this(...) primeiro</button><button type="button" className={!valid ? "danger" : ""} onClick={() => setValid(false)}>println antes</button></header><main className={valid ? "safe" : "danger"}><TerminalSquare /><pre>{valid ? "Produto(codigo, nome) {\n    this(codigo, nome, 0);\n}\n✓ compila" : "Produto(codigo, nome) {\n    System.out.println(codigo);\n    this(codigo, nome, 0);\n}\nerror: call to this must be first statement"}</pre><p>{valid ? "A delegação acontece antes de qualquer outra ação daquele construtor." : "Mova preparação para os argumentos ou para uma função static pura chamada dentro de this(...)."}</p></main></div><CodePanel name={valid ? "EncadeamentoConstrutor123.java" : "ThisForaDePosicao123.java"} code={valid ? CHAIN_SOURCE : INVALID_THIS_SOURCE} /></section>;
}

function DefaultsLab() {
  const [choice, setChoice] = useState("order");
  const data = {
    order: ["Pedido sem status", "CRIAÇÃO NORMAL", "status = CRIADO", true, "Todo pedido novo realmente começa CRIADO."],
    product: ["Produto sem estoque", "AUSÊNCIA LEGÍTIMA", "estoque = 0", true, "Zero representa exatamente nenhum item disponível."],
    email: ["Cliente sem e-mail", "DADO OBRIGATÓRIO?", "nao-informado@email.com", false, "O texto parece válido, mas pode esconder uma ausência importante."],
  }[choice];
  return <section className="ov123-stack"><div className="ov123-defaults"><nav><button type="button" className={choice === "order" ? "active" : ""} onClick={() => setChoice("order")}>Pedido</button><button type="button" className={choice === "product" ? "active" : ""} onClick={() => setChoice("product")}>Produto</button><button type="button" className={choice === "email" ? "danger" : ""} onClick={() => setChoice("email")}>E-mail fictício</button></nav><main className={data[3] ? "safe" : "danger"}><span>{data[1]}</span><h3>{data[0]}</h3><code>{data[2]}</code><strong>{data[3] ? "PADRÃO SEGURO" : "PADRÃO PERIGOSO"}</strong><p>{data[4]}</p></main></div><CodePanel name="PadraoDominio123.java" code={DEFAULT_SOURCE} /></section>;
}

function ValueLab() {
  const [type, setType] = useState("string");
  const data = { string: ["String", "\"199.90\"", "converterTexto → BigDecimal"], decimal: ["BigDecimal", "199.90", "vai direto ao principal"], integer: ["int", "199", "BigDecimal.valueOf → principal"] }[type];
  return <section className="ov123-stack"><div className="ov123-value"><nav><button type="button" className={type === "string" ? "active" : ""} onClick={() => setType("string")}>String</button><button type="button" className={type === "decimal" ? "active" : ""} onClick={() => setType("decimal")}>BigDecimal</button><button type="button" className={type === "integer" ? "active" : ""} onClick={() => setType("integer")}>int</button></nav><main><span>ENTRADA {data[0]}</span><code>{data[1]}</code><ArrowRight /><b>{data[2]}</b><ArrowRight /><strong>R$ 199.90</strong></main></div><p className="guided-note"><Waypoints size={18} /><span>Em objeto de valor, sobrecargas podem adaptar representações diferentes para um único formato canônico.</span></p><CodePanel name="DinheiroConstrutores123.java" code={MONEY_SOURCE} /></section>;
}

function FactoryLab() {
  const [mode, setMode] = useState("factory");
  const [ambiguous, setAmbiguous] = useState(false);
  return <section className="ov123-stack"><div className="ov123-factory"><header><button type="button" className={mode === "overload" ? "active" : ""} onClick={() => setMode("overload")}>Construtores</button><button type="button" className={mode === "factory" ? "active" : ""} onClick={() => setMode("factory")}>Factory nomeada</button><button type="button" className={ambiguous ? "danger" : ""} onClick={() => setAmbiguous((value) => !value)}>Testar null</button></header><main className={ambiguous ? "danger" : "safe"}>{ambiguous ? <><span>AMBIGUIDADE</span><code>new NotificacaoAmbigua123(null)</code><p>String e Email são referências; <code>null</code> serve para ambas e o compilador não escolhe.</p></> : <><span>{mode === "factory" ? "INTENÇÃO NOMEADA" : "POSIÇÃO E TIPOS"}</span><code>{mode === "factory" ? "PedidoFactory123.reconstituido(1002, cliente, PAGO)" : "new Pedido(1002, cliente, PAGO)"}</code><p>{mode === "factory" ? "O nome explica que o estado veio de persistência, não do fluxo normal." : "É compacto, mas o cenário só aparece depois de interpretar os argumentos."}</p></>}</main></div><CodePanel name={ambiguous ? "AmbiguidadeNull123.java" : "FactoryNomeada123.java"} code={ambiguous ? INVALID_AMBIGUITY_SOURCE : FACTORY_SOURCE} /></section>;
}

function OsFlowLab() {
  const [mode, setMode] = useState("ready");
  const nodes = mode === "ready" ? ["CodigoOs", "Cliente", "Periodo", "principal"] : ["String", "Cliente", "LocalDate + Turno", "criar tipos", "principal"];
  return <section className="ov123-stack"><div className="ov123-os-flow"><header><button type="button" className={mode === "ready" ? "active" : ""} onClick={() => setMode("ready")}>Tipos prontos</button><button type="button" className={mode === "convenience" ? "active" : ""} onClick={() => setMode("convenience")}>Conveniência</button></header><main>{nodes.map((node, index) => <div key={node + index}><span className={index === nodes.length - 1 ? "principal" : ""}>{node}</span>{index < nodes.length - 1 && <ArrowRight />}</div>)}</main><p>{mode === "ready" ? "Quem já possui objetos do domínio usa o caminho direto." : "O atalho converte dados simples em CodigoOs e Periodo, mas termina na mesma validação principal."}</p></div><CodePanel name="OrdemServicoConstrutores123.java" code={OS_SOURCE} /></section>;
}

function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    ["new Produto(c,n,p)", "entrada de 3 parâmetros", "Escolha da assinatura ocorre na compilação."],
    ["this(c,n,p,0)", "estoque padrão = 0", "Delegação segue antes de qualquer instrução."],
    ["this(c,n,p,0,ATIVO)", "status padrão = ATIVO", "Outro construtor completa o estado inicial."],
    ["construtor principal", "validar código, nome, preço, estoque, status", "Todas as invariantes passam por um único lugar."],
    ["atribuições", "this.codigo · this.nome · this.preco", "O objeto só emerge depois da validação."],
    ["factory reconstituido", "status recebido = PAGO", "O nome diferencia restauração de criação nova."],
  ];
  const current = frames[step];
  return <section className="ov123-stack"><div className="ov123-debug"><div><button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft size={15} />Voltar</button><button type="button" disabled={step === frames.length - 1} onClick={() => setStep((value) => Math.min(frames.length - 1, value + 1))}><StepForward size={15} />Step Into</button><span>{step + 1}/{frames.length}</span></div><section><aside>{frames.map((item, index) => <button type="button" className={index === step ? "active" : ""} onClick={() => setStep(index)} key={item[0]}><span>{index + 1}</span>{item[0]}</button>)}</aside><main><span>DEBUGGER · FLUXO DE NASCIMENTO</span><h3>{current[0]}</h3><code>{current[1]}</code><p>{current[2]}</p><div><b>Pergunta do mentor</b><small>Qual assinatura abriu o fluxo, que padrão entrou e em qual frame a validação realmente ocorreu?</small></div></main></section></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="ov123-stack"><div className="ov123-errors"><nav>{ERRORS.map((item, index) => <button type="button" className={index === selected ? "active" : ""} onClick={() => setSelected(index)} key={item[0]}><span>{index + 1}</span><span className="guided-error-label">{item[0]}</span></button>)}</nav><main><span><AlertTriangle size={16} />CASO {selected + 1} DE {ERRORS.length}</span><h3>{current[0]}</h3><section><div><b>Sintoma</b><p>{current[1]}</p></div><ArrowRight size={18} /><div><b>Como corrigir</b><p>{current[2]}</p></div></section></main></div></section>;
}

function DeliveryLab() {
  const [checked, setChecked] = useState(() => new Set());
  const tasks = ["Período pronto", "Datas separadas", "Factory restore", "Padrão RASCUNHO", "Invariantes", "8 testes"];
  const toggle = (index) => setChecked((current) => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next; });
  return <section className="ov123-stack"><CodePanel name="SobrecargaConstrutoresContrato123.java" code={CONTRACT_SOURCE} /><CodePanel name="TesteSobrecarga123.java" code={TEST_SOURCE} /><div className="guided-console"><div className="guided-console-title"><Play size={15} />Terminal</div><pre>{`> javac -encoding UTF-8 SobrecargaConstrutoresContrato123.java TesteSobrecarga123.java
> java SobrecargaConstrutoresContrato123
CONT-001 | Ana Silva | RASCUNHO | meses=3 | total=R$ 600.00
CONT-002 | Ana Silva | RASCUNHO | meses=3 | total=R$ 600.00
CONT-003 | Ana Silva | ATIVO | meses=3 | total=R$ 600.00
> java TesteSobrecarga123
8 testes passaram
> git add labs/m4/aula-123-sobrecarga-de-construtores
> git commit -m "Aula 123: pratica sobrecarga de construtores"`}</pre></div><div className="ov123-checklist">{tasks.map((item, index) => <button type="button" className={checked.has(index) ? "done" : ""} onClick={() => toggle(index)} key={item}><span>{checked.has(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral dos caminhos de criação</h3></div><ul><li>Qual é o construtor principal e por quê?</li><li>Por que RASCUNHO é um padrão seguro para contrato novo?</li><li>Por que reconstituído é factory em vez de outro construtor?</li><li>Como provar que nenhum atalho pula as invariantes?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: "signature", label: "Resolver Assinaturas", duration: "15 min", eyebrow: "QUANTIDADE, TIPO E ORDEM", title: "Faça o compilador escolher entre três construtores", blocks: [{ type: "lead", text: "Sobrecarga existe quando a mesma classe oferece construtores com assinaturas diferentes. O compilador usa quantidade, tipos e ordem — nunca os nomes dos parâmetros." }, { type: "signature" }] },
  { id: "purpose", label: "Por que Sobrecarregar", duration: "12 min", eyebrow: "FORMAS LEGÍTIMAS DE NASCIMENTO", title: "Ofereça somente atalhos que expressem estados válidos", blocks: [{ type: "lead", text: "Produto sem estoque, Pedido CRIADO e OS com período pronto podem ser variações legítimas. Cada atalho precisa melhorar leitura sem esconder uma obrigação real." }, { type: "purpose" }] },
  { id: "duplication", label: "Eliminar Duplicação", duration: "14 min", eyebrow: "UMA BARREIRA DE INVARIANTES", title: "Veja duas validações divergirem e volte a uma fonte de verdade", blocks: [{ type: "lead", text: "Copiar validação entre construtores cria definições concorrentes de objeto válido. A delegação mantém todos os caminhos sob a mesma regra." }, { type: "duplication" }] },
  { id: "chain", label: "this(...) e Principal", duration: "17 min", eyebrow: "ENCADEAMENTO DE CONSTRUTORES", title: "Acompanhe três entradas convergirem para um construtor", blocks: [{ type: "lead", text: "Construtores menores completam padrões e chamam o principal. Somente ele valida e atribui o estado inteiro do objeto." }, { type: "chain" }] },
  { id: "this-first", label: "Primeira Instrução", duration: "13 min", eyebrow: "REGRA DO COMPILADOR E FUNÇÃO AUXILIAR", title: "Coloque uma linha antes de this(...) e leia a falha", blocks: [{ type: "lead", text: "A delegação deve ser a primeira instrução. Preparações necessárias entram nos argumentos ou em funções static puras, como a conversão de texto para BigDecimal." }, { type: "this-error" }] },
  { id: "defaults", label: "Padrões de Domínio", duration: "15 min", eyebrow: "SEGURO, LEGÍTIMO OU ENGANOSO", title: "Não transforme ausência obrigatória em dado fictício", blocks: [{ type: "lead", text: "Um valor padrão só é seguro quando representa uma verdade do domínio. CRIADO e estoque zero podem ser legítimos; um e-mail inventado pode mascarar dado ausente." }, { type: "defaults" }] },
  { id: "value", label: "Objeto de Valor", duration: "15 min", eyebrow: "STRING, BIGDECIMAL E INT", title: "Converta três entradas para uma representação canônica", blocks: [{ type: "lead", text: "Dinheiro aceita representações claramente diferentes e as encaminha para BigDecimal. O construtor principal preserva escala e validação." }, { type: "value" }] },
  { id: "factory", label: "Factory e Ambiguidade", duration: "17 min", eyebrow: "NOME, NULL E INTENÇÃO", title: "Troque posição por linguagem quando o construtor não explica o cenário", blocks: [{ type: "lead", text: "Uma static factory nomeada é melhor quando novo e reconstituído têm significados diferentes. Sobrecargas de referências também podem disputar null e deixar o compilador sem escolha." }, { type: "factory" }] },
  { id: "os", label: "OS de Conveniência", duration: "16 min", eyebrow: "TIPOS PRONTOS OU DADOS SIMPLES", title: "Facilite a chamada sem quebrar a modelagem", blocks: [{ type: "lead", text: "A OS aceita CodigoOs e Periodo prontos ou cria esses valores a partir de String, LocalDate e Turno. Os dois caminhos terminam na mesma validação." }, { type: "os" }] },
  { id: "debug-errors", label: "Debug e Clínica", duration: "18 min", eyebrow: "SEIS FRAMES E OITO DIAGNÓSTICOS", title: "Siga o nascimento até a única barreira de invariantes", blocks: [{ type: "lead", text: "O debugger torna visíveis assinatura escolhida, padrões aplicados, delegações e construtor principal; a clínica recupera os atalhos que geram ambiguidade ou estado inválido." }, { type: "debug" }, { type: "errors" }] },
  { id: "delivery", label: "Entrega & Contrato", duration: "28 min", eyebrow: "TRÊS CRIAÇÕES, FACTORY E OITO TESTES", title: "Entregue um Contrato com caminhos claros e seguros", blocks: [{ type: "lead", text: "O desafio combina período pronto, datas separadas e reconstituição nomeada. Cliente ativo, serviço positivo e período válido passam pela mesma barreira." }, { type: "delivery" }] },
];

function ContentBlock({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = { signature: SignatureLab, purpose: PurposeLab, duplication: DuplicationLab, chain: ChainLab, "this-error": ThisErrorLab, defaults: DefaultsLab, value: ValueLab, factory: FactoryLab, os: OsFlowLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = map[block.type]; return Component ? <Component /> : null;
}

export default function GuidedConstructorOverloadLesson123({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const normalized = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); const ids = new Set(steps.map((item) => item.id)); return new Set(Array.isArray(saved) ? saved.filter((id) => ids.has(id)) : []); }
    catch { return new Set(); }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => { if (!normalized.current && isCompleted && completedSteps.size !== steps.length) { normalized.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => { const active = navRef.current?.querySelector("button.active"); if (active && window.matchMedia("(max-width: 900px)").matches) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); }, [activeIndex]);
  const step = steps[activeIndex], stepDone = completedSteps.has(step.id), allStepsDone = completedSteps.size === steps.length, lessonComplete = isCompleted && allStepsDone;
  const selectStep = (index) => { setActiveIndex(index); document.querySelector(".guided-layout")?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps((current) => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); };
  return <article className="guided-git-lesson guided-constructor-overload-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Waypoints size={17} />Oficina de caminhos de criação</span><p className="guided-sequence">123 · M4.19</p><h1>Ofereça várias entradas, mas uma única definição de objeto válido</h1><p>Resolva assinaturas, encadeie com `this(...)`, aplique padrões seguros e saiba quando um nome de factory ensina mais que outro construtor.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header>
    <GuidedLessonFacts ariaLabel="Resumo da aula 123" items={[{ value: "11 fontes", label: "8 válidas + 3 erros deliberados" }, { value: "6 frames", label: "No fluxo de nascimento" }, { value: "8 casos", label: "Na clínica de erros" }]} />
    <div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 123"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? "active " : "") + (completedSteps.has(item.id) ? "done" : "")} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + "-" + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={"step-toggle " + (stepDone ? "undo" : "complete")} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>
        {allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Caminhos de criação convergentes comprovados</h3><p>{lessonComplete ? "Aula concluída: avance para this e autorreferência." : "Execute o Contrato e os oito testes antes de concluir."}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? "Reabrir aula" : "Concluir aula"}</button></section>}
      </main></div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 122</button><div className={"guided-course-status " + (lessonComplete ? "completed" : allStepsDone ? "ready" : "")}><Clock3 size={18} /><span><strong>{lessonComplete ? "Aula concluída" : completedSteps.size + " de " + steps.length + " etapas"}</strong><small>assinatura, this, principal, padrões, factory e invariantes</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 124<ArrowRight size={17} /></button></footer>
  </article>;
}
