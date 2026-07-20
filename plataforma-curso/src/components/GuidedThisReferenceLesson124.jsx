import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy,
  Eye, FileCode2, Fingerprint, Link2, ListChecks, Play, RotateCcw,
  ShieldCheck, Sparkles, StepForward, TerminalSquare,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedThisReferenceLesson.css";

const STORAGE_KEY = "guided-this-reference-lesson-124-progress";

const CURRENT_SOURCE = `public class ThisObjetoAtual124 {
    public static void main(String[] args) {
        ClienteAtual124 ana = new ClienteAtual124(10, "Ana Silva", "ana@email.com");
        ClienteAtual124 bia = new ClienteAtual124(20, "Bia Souza", "bia@email.com");
        ana.alterarEmail("ana.novo@email.com");
        System.out.println(ana.resumo());
        System.out.println(bia.resumo());
    }
}
class ClienteAtual124 {
    private final int id;
    private final String nome;
    private String email;
    ClienteAtual124(int id, String nome, String email) {
        if (id <= 0 || nome == null || nome.isBlank() || email == null || !email.contains("@"))
            throw new IllegalArgumentException("Cliente inválido.");
        this.id = id; this.nome = nome; this.email = email.toLowerCase();
    }
    void alterarEmail(String email) {
        if (email == null || !email.contains("@")) throw new IllegalArgumentException("E-mail inválido.");
        this.email = email.toLowerCase();
    }
    String resumo() { return "Cliente " + this.id + " | " + this.nome + " | " + this.email; }
}`;

const SHADOW_SOURCE = `public class ThisSombra124 {
    public static void main(String[] args) {
        ClienteSombra124 errado = new ClienteSombra124("Ana Silva", false);
        ClienteSombra124 certo = new ClienteSombra124("Bia Souza", true);
        System.out.println("Sem this: " + errado.nome());
        System.out.println("Com this: " + certo.nome());
    }
}
class ClienteSombra124 {
    private String nome;
    ClienteSombra124(String nome, boolean corrigir) {
        if (corrigir) this.nome = nome;
        else nome = nome; // parâmetro recebe ele mesmo; o atributo continua null
    }
    String nome() { return nome; }
}`;

const OPTIONAL_SOURCE = `public class ThisOpcional124 {
    public static void main(String[] args) {
        ProdutoOpcional124 produto = new ProdutoOpcional124("PROD-001", "Cadeira", 10);
        System.out.println(produto.comThis());
        System.out.println(produto.semThis());
    }
}
class ProdutoOpcional124 {
    private final String codigo;
    private final String nome;
    private final int estoque;
    ProdutoOpcional124(String codigo, String nome, int estoque) {
        this.codigo = codigo; this.nome = nome; this.estoque = estoque;
    }
    String comThis() { return this.codigo + " | " + this.nome + " | " + this.estoque; }
    String semThis() { return codigo + " | " + nome + " | " + estoque; }
}`;

const CONSTRUCTOR_SOURCE = `public class ThisConstrutores124 {
    public static void main(String[] args) {
        System.out.println(new ClienteConstrutor124(10, "Ana Silva").resumo());
        System.out.println(new ClienteConstrutor124(20, "Carlos Lima", StatusCliente124.INATIVO).resumo());
    }
}
enum StatusCliente124 { ATIVO, INATIVO, BLOQUEADO }
class ClienteConstrutor124 {
    private final int id;
    private final String nome;
    private final StatusCliente124 status;
    ClienteConstrutor124(int id, String nome) { this(id, nome, StatusCliente124.ATIVO); }
    ClienteConstrutor124(int id, String nome, StatusCliente124 status) {
        if (id <= 0 || nome == null || nome.isBlank() || status == null) throw new IllegalArgumentException("Cliente inválido.");
        this.id = id; this.nome = nome; this.status = status;
    }
    String resumo() { return "Cliente " + this.id + " | " + this.nome + " | " + this.status; }
}`;

const INVALID_FIRST_SOURCE = `class ThisDepoisDeCodigo124 {
    ThisDepoisDeCodigo124(int id, String nome) {
        System.out.println("Criando cliente");
        this(id, nome, true); // ERRO: this(...) deve ser a primeira instrução
    }
    ThisDepoisDeCodigo124(int id, String nome, boolean ativo) { }
}`;

const METHOD_SOURCE = `public class ThisMetodo124 {
    public static void main(String[] args) {
        PedidoMetodo124 pedido = new PedidoMetodo124(1001);
        System.out.println(pedido.resumo());
        pedido.confirmarPagamento();
        System.out.println(pedido.resumo());
    }
}
enum StatusPedidoMetodo124 { CRIADO, PAGO, CANCELADO }
class PedidoMetodo124 {
    private final int numero;
    private StatusPedidoMetodo124 status = StatusPedidoMetodo124.CRIADO;
    PedidoMetodo124(int numero) { if (numero <= 0) throw new IllegalArgumentException("Número inválido."); this.numero = numero; }
    boolean criado() { return this.status == StatusPedidoMetodo124.CRIADO; }
    boolean pago() { return this.status == StatusPedidoMetodo124.PAGO; }
    void confirmarPagamento() {
        if (!this.criado()) throw new IllegalStateException("Somente pedido criado pode ser pago.");
        this.status = StatusPedidoMetodo124.PAGO;
    }
    String resumo() { return "Pedido " + this.numero + " | " + this.status + " | pago=" + this.pago(); }
}`;

const INVALID_STATIC_SOURCE = `class ThisEmStatic124 {
    private String nome = "Ana";
    static void imprimir() {
        System.out.println(this.nome); // ERRO: this não existe em static
    }
}`;

const FLUENT_SOURCE = `public class ThisFluente124 {
    public static void main(String[] args) {
        OrdemFluente124 os = new OrdemFluente124("OS-2026-0001");
        OrdemFluente124 retorno = os.adicionarObservacao("Ligar antes").adicionarObservacao("Manhã").marcarCritica();
        System.out.println("Mesma referência: " + (os == retorno));
        System.out.println(os.resumo());
    }
}
class OrdemFluente124 {
    private final String codigo;
    private String observacoes = "";
    private boolean critica;
    OrdemFluente124(String codigo) { this.codigo = codigo; }
    OrdemFluente124 adicionarObservacao(String observacao) {
        if (observacao == null || observacao.isBlank()) throw new IllegalArgumentException("Observação obrigatória.");
        this.observacoes = this.observacoes.isBlank() ? observacao : this.observacoes + " | " + observacao;
        return this;
    }
    OrdemFluente124 marcarCritica() { this.critica = true; return this; }
    String resumo() { return this.codigo + " | crítica=" + this.critica + " | " + this.observacoes; }
}`;

const VALUE_SOURCE = `import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public class ThisValorImutavel124 {
    public static void main(String[] args) {
        DinheiroThis124 preco = DinheiroThis124.de("199.90");
        DinheiroThis124 frete = DinheiroThis124.de("20.00");
        DinheiroThis124 total = preco.somar(frete);
        System.out.println("Preço: " + preco + " | Total: " + total);
        System.out.println("Novo objeto: " + (preco != total));
        System.out.println("Igual a si: " + preco.equals(preco));
    }
}
final class DinheiroThis124 {
    private final BigDecimal valor;
    private DinheiroThis124(BigDecimal valor) { this.valor = valor.setScale(2, RoundingMode.HALF_UP); }
    static DinheiroThis124 de(String valor) { return new DinheiroThis124(new BigDecimal(valor)); }
    DinheiroThis124 somar(DinheiroThis124 outro) { return new DinheiroThis124(this.valor.add(outro.valor)); }
    @Override public boolean equals(Object outro) {
        if (this == outro) return true;
        return outro instanceof DinheiroThis124 dinheiro && Objects.equals(this.valor, dinheiro.valor);
    }
    @Override public int hashCode() { return Objects.hash(this.valor); }
    @Override public String toString() { return "R$ " + this.valor; }
}`;

const AUDIT_SOURCE = `public class ThisComoParametro124 {
    public static void main(String[] args) {
        PedidoAuditavel124 pedido = new PedidoAuditavel124(1001, "Ana Silva");
        pedido.cancelar("Cliente desistiu", new Auditoria124());
    }
}
enum StatusAuditavel124 { CRIADO, CANCELADO }
class PedidoAuditavel124 {
    private final int numero;
    private final String cliente;
    private StatusAuditavel124 status = StatusAuditavel124.CRIADO;
    PedidoAuditavel124(int numero, String cliente) { this.numero = numero; this.cliente = cliente; }
    void cancelar(String motivo, Auditoria124 auditoria) {
        if (motivo == null || motivo.isBlank() || auditoria == null) throw new IllegalArgumentException("Cancelamento inválido.");
        this.status = StatusAuditavel124.CANCELADO;
        auditoria.registrarCancelamento(this, motivo);
    }
    int numero() { return this.numero; }
    String cliente() { return this.cliente; }
    StatusAuditavel124 status() { return this.status; }
}
class Auditoria124 {
    void registrarCancelamento(PedidoAuditavel124 pedido, String motivo) {
        System.out.println("Auditoria: pedido=" + pedido.numero() + " | cliente=" + pedido.cliente() + " | " + pedido.status() + " | " + motivo);
    }
}`;

const ENTITY_SOURCE = `import java.time.LocalDate;

public class ThisEntidade124 {
    public static void main(String[] args) {
        OrdemServicoThis124 os = new OrdemServicoThis124("OS-2026-0001", "Ana Silva", new PeriodoThis124(LocalDate.of(2026, 7, 20), TurnoThis124.MANHA));
        os.reagendar(new PeriodoThis124(LocalDate.of(2026, 7, 22), TurnoThis124.TARDE));
        os.concluir();
        System.out.println(os.resumo());
    }
}
enum StatusThis124 { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
enum TurnoThis124 { MANHA, TARDE }
record PeriodoThis124(LocalDate data, TurnoThis124 turno) {
    PeriodoThis124 { if (data == null || turno == null) throw new IllegalArgumentException("Período inválido."); }
}
class OrdemServicoThis124 {
    private final String codigo;
    private final String cliente;
    private PeriodoThis124 periodo;
    private StatusThis124 status;
    private int reagendamentos;
    OrdemServicoThis124(String codigo, String cliente, PeriodoThis124 periodo) {
        if (codigo == null || !codigo.startsWith("OS-") || cliente == null || cliente.isBlank() || periodo == null) throw new IllegalArgumentException("OS inválida.");
        this.codigo = codigo; this.cliente = cliente; this.periodo = periodo; this.status = StatusThis124.AGENDADA;
    }
    boolean encerrada() { return this.status == StatusThis124.CONCLUIDA || this.status == StatusThis124.CANCELADA; }
    void reagendar(PeriodoThis124 periodo) {
        if (this.encerrada() || periodo == null) throw new IllegalStateException("Reagendamento inválido.");
        this.periodo = periodo; this.status = StatusThis124.REAGENDADA; this.reagendamentos++;
    }
    void concluir() { if (this.status == StatusThis124.CANCELADA) throw new IllegalStateException("OS cancelada."); this.status = StatusThis124.CONCLUIDA; }
    String resumo() { return this.codigo + " | " + this.cliente + " | " + this.periodo.data() + " " + this.periodo.turno() + " | " + this.status + " | reagendamentos=" + this.reagendamentos; }
}`;

const CHALLENGE_SOURCE = `import java.math.BigDecimal;
import java.math.RoundingMode;

public class ThisPedidoDominio124 {
    public static void main(String[] args) {
        ClienteDominio124 cliente = new ClienteDominio124(10, "Ana Silva");
        PedidoDominio124 pedido = new PedidoDominio124(1001, cliente, DinheiroDominio124.de("399.80"));
        pedido.confirmarPagamento();
        pedido.cancelar("Cliente desistiu", new AuditoriaPedido124());
        System.out.println(pedido.resumo());
    }
}
enum StatusDominio124 { CRIADO, PAGO, CANCELADO }
record ClienteDominio124(int id, String nome) {
    ClienteDominio124 { if (id <= 0 || nome == null || nome.isBlank()) throw new IllegalArgumentException("Cliente inválido."); }
}
final class DinheiroDominio124 {
    private final BigDecimal valor;
    private DinheiroDominio124(BigDecimal valor) { if (valor == null || valor.signum() <= 0) throw new IllegalArgumentException("Valor inválido."); this.valor = valor.setScale(2, RoundingMode.HALF_UP); }
    static DinheiroDominio124 de(String valor) { return new DinheiroDominio124(new BigDecimal(valor)); }
    @Override public String toString() { return "R$ " + this.valor; }
}
class PedidoDominio124 {
    private final int numero;
    private final ClienteDominio124 cliente;
    private final DinheiroDominio124 total;
    private StatusDominio124 status;
    private String motivoCancelamento;
    PedidoDominio124(int numero, ClienteDominio124 cliente, DinheiroDominio124 total) {
        this(numero, cliente, total, StatusDominio124.CRIADO);
    }
    private PedidoDominio124(int numero, ClienteDominio124 cliente, DinheiroDominio124 total, StatusDominio124 status) {
        if (numero <= 0 || cliente == null || total == null || status == null) throw new IllegalArgumentException("Pedido inválido.");
        this.numero = numero; this.cliente = cliente; this.total = total; this.status = status; this.motivoCancelamento = "";
    }
    boolean criado() { return this.status == StatusDominio124.CRIADO; }
    void confirmarPagamento() {
        if (!this.criado()) throw new IllegalStateException("Somente pedido criado pode ser pago.");
        this.status = StatusDominio124.PAGO;
    }
    void cancelar(String motivo, AuditoriaPedido124 auditoria) {
        if (this.status == StatusDominio124.CANCELADO) throw new IllegalStateException("Pedido já cancelado.");
        if (motivo == null || motivo.isBlank() || auditoria == null) throw new IllegalArgumentException("Cancelamento inválido.");
        this.status = StatusDominio124.CANCELADO; this.motivoCancelamento = motivo;
        auditoria.registrar(this, motivo);
    }
    String resumo() { return "Pedido " + this.numero + " | " + this.cliente.nome() + " | " + this.total + " | " + this.status + " | " + this.motivoCancelamento; }
    int numero() { return this.numero; }
    StatusDominio124 status() { return this.status; }
}
class AuditoriaPedido124 {
    void registrar(PedidoDominio124 pedido, String motivo) { System.out.println("Auditoria: pedido=" + pedido.numero() + " | " + pedido.status() + " | " + motivo); }
}`;

const TEST_SOURCE = `public class TesteThis124 {
    private static int testes;
    public static void main(String[] args) {
        ClienteDominio124 cliente = new ClienteDominio124(10, "Ana");
        PedidoDominio124 pedido = new PedidoDominio124(1001, cliente, DinheiroDominio124.de("399.80"));
        check(pedido.criado());
        pedido.confirmarPagamento();
        check(pedido.status() == StatusDominio124.PAGO);
        pedido.cancelar("Desistência", new AuditoriaPedido124());
        check(pedido.status() == StatusDominio124.CANCELADO);
        check(pedido.resumo().contains("Desistência"));
        expectState(() -> pedido.cancelar("Outra", new AuditoriaPedido124()));
        expectState(pedido::confirmarPagamento);
        expectArgument(() -> new PedidoDominio124(0, cliente, DinheiroDominio124.de("1")));
        expectArgument(() -> new PedidoDominio124(2, null, DinheiroDominio124.de("1")));
        System.out.println(testes + " testes passaram");
    }
    private static void expectState(Runnable acao) { try { acao.run(); throw new AssertionError(); } catch (IllegalStateException esperado) { testes++; } }
    private static void expectArgument(Runnable acao) { try { acao.run(); throw new AssertionError(); } catch (IllegalArgumentException esperado) { testes++; } }
    private static void check(boolean condicao) { testes++; if (!condicao) throw new AssertionError("Falhou " + testes); }
}`;

const ERRORS = [
  ["Esquecer no sombreamento", "nome = nome atribui o parâmetro nele mesmo e o atributo permanece vazio.", "Use this.nome = nome quando os nomes coincidirem."],
  ["Usar em toda linha", "Métodos simples ficam visualmente carregados sem ganhar clareza.", "Use quando obrigatório ou quando explicita o objeto atual."],
  ["this dentro de static", "A classe não possui um objeto atual para a palavra representar.", "Receba uma instância ou use somente dados da classe."],
  ["Código antes de this(...) ", "O construtor não compila porque a delegação veio tarde.", "Faça this(...) ser a primeira instrução."],
  ["Fluent sem avisar mutação", "A cadeia parece criar valores, mas altera sempre o mesmo objeto.", "Deixe a mutação clara ou retorne novos objetos imutáveis."],
  ["Passar objeto inteiro", "Outro componente recebe mais acesso e acoplamento do que precisa.", "Passe this apenas com intenção; prefira dados/evento quando bastarem."],
  ["Confundir objeto e classe", "this é tratado como se significasse o tipo Cliente.", "this é uma instância específica; static pertence à classe."],
  ["Compensar nomes ruins", "this.processarCoisa() continua sem explicar a responsabilidade.", "Mantenha atributos e métodos nomeados pelo domínio."],
];

const EVIDENCE = `# Aula 124 — this e autorreferência
- [ ] Acompanhei this em dois objetos diferentes
- [ ] Corrigi o bug nome = nome
- [ ] Diferenciei uso obrigatório e opcional
- [ ] Usei this(...) como primeira instrução
- [ ] Separei instância de static
- [ ] Comparei retorno this e novo valor imutável
- [ ] Interpretei this == outro em equals
- [ ] Avaliei o acoplamento ao passar this
- [ ] Evitei escapar this durante a construção
- [ ] Entreguei Pedido e 8 testes`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? "Copiado" : "Copiar"}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{code}</SyntaxHighlighter></section>;
}

function CurrentObjectLab() {
  const [active, setActive] = useState("ana");
  const objects = { ana: ["clienteAna", "#A1", "Ana Silva", "ana.novo@email.com"], bia: ["clienteBia", "#B2", "Bia Souza", "bia@email.com"] };
  const current = objects[active];
  return <section className="th124-stack"><div className="th124-current"><nav><button type="button" className={active === "ana" ? "active" : ""} onClick={() => setActive("ana")}>clienteAna.alterarEmail(...)</button><button type="button" className={active === "bia" ? "active" : ""} onClick={() => setActive("bia")}>clienteBia.resumo()</button></nav><main><section><span>VARIÁVEL EXTERNA</span><b>{current[0]}</b><code>ref {current[1]}</code></section><ArrowRight /><section className="this-node"><Fingerprint /><span>DENTRO DO MÉTODO</span><b>this = {current[1]}</b></section><ArrowRight /><section><span>OBJETO NO HEAP</span><b>{current[2]}</b><code>{current[3]}</code></section></main><p>A palavra é a mesma; o objeto representado depende de quem recebeu a chamada.</p></div><CodePanel name="ThisObjetoAtual124.java" code={CURRENT_SOURCE} /></section>;
}

function ShadowLab() {
  const [fixed, setFixed] = useState(false);
  return <section className="th124-stack"><div className="th124-shadow"><header><button type="button" className={!fixed ? "danger" : ""} onClick={() => setFixed(false)}>nome = nome</button><button type="button" className={fixed ? "active" : ""} onClick={() => setFixed(true)}>this.nome = nome</button></header><main><section><span>PARÂMETRO · mais próximo</span><code>nome = "Ana Silva"</code></section><ArrowRight /><section className={fixed ? "safe" : "danger"}><span>{fixed ? "ATRIBUTO DO OBJETO" : "ATRIBUIÇÃO EM SI MESMO"}</span><code>{fixed ? "this.nome ← nome" : "nome ← nome"}</code><strong>{fixed ? "campo = Ana Silva" : "campo = null"}</strong></section></main><p>{fixed ? "this atravessa o sombreamento e seleciona o campo do objeto atual." : "O código compila, mas só copia o parâmetro para ele mesmo — um bug silencioso."}</p></div><CodePanel name="ThisSombra124.java" code={SHADOW_SOURCE} /></section>;
}

function OptionalLab() {
  const [style, setStyle] = useState("balanced");
  const lines = style === "explicit" ? "return this.codigo + this.nome + this.estoque;" : style === "implicit" ? "return codigo + nome + estoque;" : "this.email = email;\nreturn codigo + nome + estoque;";
  return <section className="th124-stack"><div className="th124-optional"><nav><button type="button" className={style === "explicit" ? "active" : ""} onClick={() => setStyle("explicit")}>Sempre explícito</button><button type="button" className={style === "implicit" ? "active" : ""} onClick={() => setStyle("implicit")}>Sempre implícito</button><button type="button" className={style === "balanced" ? "active" : ""} onClick={() => setStyle("balanced")}>Critério</button></nav><main><pre>{lines}</pre><p>{style === "explicit" ? "Funciona, mas pode poluir métodos simples." : style === "implicit" ? "Funciona sem conflito, mas falha quando parâmetro sombreia campo." : "Explícito na atribuição ambígua; implícito na leitura simples. Clareza decide."}</p></main></div><CodePanel name="ThisOpcional124.java" code={OPTIONAL_SOURCE} /></section>;
}

function ConstructorLab() {
  const [invalid, setInvalid] = useState(false);
  return <section className="th124-stack"><div className="th124-constructor"><header><button type="button" className={!invalid ? "active" : ""} onClick={() => setInvalid(false)}>Delegar primeiro</button><button type="button" className={invalid ? "danger" : ""} onClick={() => setInvalid(true)}>Executar antes</button></header><main className={invalid ? "danger" : "safe"}>{invalid ? <><TerminalSquare /><pre>println("Criando");{`\n`}this(id, nome, ATIVO);{`\n\n`}error: call to this must be first statement</pre></> : <><section><code>Cliente(id, nome)</code><ArrowRight /><code>this(id, nome, ATIVO)</code><ArrowRight /><strong>validar e atribuir</strong></section><p>O objeto escolhe imediatamente qual construtor completará seu nascimento.</p></>}</main></div><CodePanel name={invalid ? "ThisDepoisDeCodigo124.java" : "ThisConstrutores124.java"} code={invalid ? INVALID_FIRST_SOURCE : CONSTRUCTOR_SOURCE} /></section>;
}

function MethodStaticLab() {
  const [context, setContext] = useState("instance");
  return <section className="th124-stack"><div className="th124-method"><header><button type="button" className={context === "instance" ? "active" : ""} onClick={() => setContext("instance")}>Pedido #1001</button><button type="button" className={context === "static" ? "danger" : ""} onClick={() => setContext("static")}>Método static</button></header><main className={context === "static" ? "danger" : "safe"}><span>{context === "static" ? "SEM OBJETO ATUAL" : "CONTEXTO DE INSTÂNCIA"}</span><code>{context === "static" ? "static void imprimir() { this.nome; }" : "if (!this.criado()) ...\nthis.status = PAGO;\nthis.pago()"}</code><p>{context === "static" ? "A classe não sabe qual instância seria este objeto. Por isso this não existe." : "this.criado(), this.status e this.pago() trabalham sobre o mesmo Pedido #1001."}</p></main></div><CodePanel name={context === "static" ? "ThisEmStatic124.java" : "ThisMetodo124.java"} code={context === "static" ? INVALID_STATIC_SOURCE : METHOD_SOURCE} /></section>;
}

function FluentLab() {
  const [steps, setSteps] = useState(0);
  const actions = ["adicionarObservacao(\"Ligar antes\")", "adicionarObservacao(\"Manhã\")", "marcarCritica()"];
  return <section className="th124-stack"><div className="th124-fluent"><header><div><span>os → #F1</span><strong>{steps}/3 mutações aplicadas</strong></div><button type="button" disabled={steps === actions.length} onClick={() => setSteps((value) => value + 1)}><Link2 size={15} />Executar próximo elo</button><button type="button" onClick={() => setSteps(0)}>Reiniciar</button></header><main>{actions.map((action, index) => <section className={index < steps ? "done" : index === steps ? "active" : ""} key={action}><code>{action}</code><ArrowRight /><b>return this → #F1</b></section>)}</main><p>A cadeia inteira devolve a mesma referência. A leitura fluente não deve esconder que #F1 foi mutado três vezes.</p></div><CodePanel name="ThisFluente124.java" code={FLUENT_SOURCE} /></section>;
}

function ValueLab() {
  const [view, setView] = useState("sum");
  return <section className="th124-stack"><div className="th124-value"><nav><button type="button" className={view === "sum" ? "active" : ""} onClick={() => setView("sum")}>somar</button><button type="button" className={view === "equals" ? "active" : ""} onClick={() => setView("equals")}>equals</button></nav><main>{view === "sum" ? <><section><span>this · #D1</span><b>R$ 199.90</b></section><span>+</span><section><span>outro · #D2</span><b>R$ 20.00</b></section><ArrowRight /><section className="new"><span>new · #D3</span><b>R$ 219.90</b></section></> : <><section><span>this</span><b>#D1</b></section><span>==</span><section><span>outro</span><b>#D1</b></section><ArrowRight /><section className="new"><span>atalho</span><b>true</b></section></>}</main><p>{view === "sum" ? "this é lido, não alterado; o resultado nasce em outro objeto." : "this == outro detecta imediatamente a mesma referência em equals."}</p></div><CodePanel name="ThisValorImutavel124.java" code={VALUE_SOURCE} /></section>;
}

function PassingLab() {
  const [payload, setPayload] = useState("object");
  return <section className="th124-stack"><div className="th124-passing"><header><button type="button" className={payload === "object" ? "active" : ""} onClick={() => setPayload("object")}>Passar this</button><button type="button" className={payload === "data" ? "active" : ""} onClick={() => setPayload("data")}>Passar evento/dados</button></header><main><section><Fingerprint /><b>Pedido #1001</b><small>cliente · status · comportamentos</small></section><ArrowRight /><section className={payload === "object" ? "wide" : "narrow"}><Eye /><b>Auditoria recebe</b><code>{payload === "object" ? "this (Pedido inteiro)" : "numero, status, motivo"}</code><p>{payload === "object" ? "Útil quando o contrato realmente precisa consultar o Pedido; aumenta o conhecimento entre objetos." : "Fronteira menor quando a auditoria precisa apenas registrar fatos."}</p></section></main></div><CodePanel name="ThisComoParametro124.java" code={AUDIT_SOURCE} /></section>;
}

function SafetyLab() {
  const [caseName, setCaseName] = useState("null");
  const data = {
    null: ["this == null", "IMPOSSÍVEL", "Se o método de instância está executando, existe um objeto atual."],
    constructor: ["servico.registrar(this) no construtor", "OBJETO INCOMPLETO", "this já existe, mas alguns campos podem não ter sido inicializados."],
    names: ["this.processarCoisa()", "NOME RUIM CONTINUA RUIM", "Autorreferência não corrige método sem intenção de domínio."],
  }[caseName];
  return <section className="th124-stack"><div className="th124-safety"><nav><button type="button" className={caseName === "null" ? "active" : ""} onClick={() => setCaseName("null")}>this e null</button><button type="button" className={caseName === "constructor" ? "danger" : ""} onClick={() => setCaseName("constructor")}>Escapar no construtor</button><button type="button" className={caseName === "names" ? "active" : ""} onClick={() => setCaseName("names")}>Nomes ruins</button></nav><main className={caseName === "constructor" ? "danger" : "safe"}><AlertTriangle /><span>{data[1]}</span><code>{data[0]}</code><p>{data[2]}</p></main></div></section>;
}

function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    ["construtor Cliente", "this = Cliente #A1", "id, nome e email são atribuídos ao objeto que nasce."],
    ["this(id,nome,ATIVO)", "this = objeto em construção", "Delegação escolhe o construtor principal."],
    ["confirmarPagamento", "this = Pedido #1001", "this.criado() consulta o mesmo pedido."],
    ["return this", "retorno = #F1", "A fluent interface devolve a instância mutada."],
    ["Dinheiro.somar", "this=#D1 · outro=#D2 · retorno=#D3", "Objeto de valor cria outro resultado."],
    ["auditoria.registrar(this)", "Pedido #1001 atravessa a fronteira", "Outro objeto recebe a referência inteira."],
    ["OS.reagendar", "this = OS-2026-0001", "Período e status deste agregado mudam juntos."],
    ["equals", "this == outro", "A mesma referência encerra a comparação."],
  ];
  const current = frames[step];
  return <section className="th124-stack"><div className="th124-debug"><div><button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft size={15} />Voltar</button><button type="button" disabled={step === frames.length - 1} onClick={() => setStep((value) => Math.min(frames.length - 1, value + 1))}><StepForward size={15} />Step Into</button><span>{step + 1}/{frames.length}</span></div><section><aside>{frames.map((item, index) => <button type="button" className={index === step ? "active" : ""} onClick={() => setStep(index)} key={item[0]}><span>{index + 1}</span>{item[0]}</button>)}</aside><main><span>DEBUGGER · OBJETO ATUAL</span><h3>{current[0]}</h3><code>{current[1]}</code><p>{current[2]}</p><div><b>Pergunta do mentor</b><small>Qual objeto this representa agora? Ele foi alterado, devolvido, comparado ou entregue a outro objeto?</small></div></main></section></div><CodePanel name="ThisEntidade124.java" code={ENTITY_SOURCE} /></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="th124-stack"><div className="th124-errors"><nav>{ERRORS.map((item, index) => <button type="button" className={index === selected ? "active" : ""} onClick={() => setSelected(index)} key={item[0]}><span>{index + 1}</span><span className="guided-error-label">{item[0]}</span></button>)}</nav><main><span><AlertTriangle size={16} />CASO {selected + 1} DE {ERRORS.length}</span><h3>{current[0]}</h3><section><div><b>Sintoma</b><p>{current[1]}</p></div><ArrowRight size={18} /><div><b>Como corrigir</b><p>{current[2]}</p></div></section></main></div></section>;
}

function DeliveryLab() {
  const [checked, setChecked] = useState(() => new Set());
  const tasks = ["Sombreamento", "this(...) ", "Método interno", "Valor imutável", "Auditoria", "8 testes"];
  const toggle = (index) => setChecked((current) => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next; });
  return <section className="th124-stack"><CodePanel name="ThisPedidoDominio124.java" code={CHALLENGE_SOURCE} /><CodePanel name="TesteThis124.java" code={TEST_SOURCE} /><div className="guided-console"><div className="guided-console-title"><Play size={15} />Terminal</div><pre>{`> javac -encoding UTF-8 ThisPedidoDominio124.java TesteThis124.java
> java ThisPedidoDominio124
Auditoria: pedido=1001 | CANCELADO | Cliente desistiu
Pedido 1001 | Ana Silva | R$ 399.80 | CANCELADO | Cliente desistiu
> java TesteThis124
8 testes passaram
> git add labs/m4/aula-124-this-e-self-reference
> git commit -m "Aula 124: pratica this e autorreferencia"`}</pre></div><div className="th124-checklist">{tasks.map((item, index) => <button type="button" className={checked.has(index) ? "done" : ""} onClick={() => toggle(index)} key={item}><span>{checked.has(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral da autorreferência</h3></div><ul><li>Qual objeto cada uso de <code>this</code> representa?</li><li>Onde `this` é obrigatório e onde é apenas estilo?</li><li>Por que Dinheiro retorna novo objeto e a fluent interface retorna `this`?</li><li>A auditoria precisa mesmo do Pedido inteiro?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: "current", label: "Objeto Atual", duration: "14 min", eyebrow: "UMA REFERÊNCIA, OBJETOS DIFERENTES", title: "Veja this mudar de #A1 para #B2 conforme a chamada", blocks: [{ type: "lead", text: "this significa este objeto em execução. A mesma linha de método atua sobre Ana ou Bia conforme a instância que recebeu a chamada." }, { type: "current" }] },
  { id: "shadow", label: "Atributo e Parâmetro", duration: "15 min", eyebrow: "SOMBREAMENTO E BUG SILENCIOSO", title: "Faça nome = nome compilar e deixar o campo nulo", blocks: [{ type: "lead", text: "Quando o parâmetro sombreia o atributo, o nome simples seleciona o parâmetro. this.nome atravessa a sombra e aponta para o campo do objeto." }, { type: "shadow" }] },
  { id: "optional", label: "Obrigatório ou Opcional", duration: "13 min", eyebrow: "CLAREZA SEM POLUIÇÃO", title: "Use this onde resolve ambiguidade ou melhora leitura", blocks: [{ type: "lead", text: "Em atribuições com nomes iguais, this é necessário. Em leituras simples de campo ou método, ele costuma estar implícito e pode ser omitido." }, { type: "optional" }] },
  { id: "constructors", label: "this(...) e Nascimento", duration: "15 min", eyebrow: "AUTORREFERÊNCIA ENTRE CONSTRUTORES", title: "Delegue antes de executar qualquer outra instrução", blocks: [{ type: "lead", text: "this(...) chama outro construtor da mesma classe e precisa vir primeiro. O objeto atual já existe como construção em andamento, ainda não como instância pronta." }, { type: "constructor" }] },
  { id: "method-static", label: "Método e static", duration: "15 min", eyebrow: "COMPORTAMENTO DO OBJETO VERSUS CLASSE", title: "Chame this.criado() e depois remova o objeto atual", blocks: [{ type: "lead", text: "Métodos de instância podem acessar campos e comportamentos do próprio objeto. Um método static pertence à classe e não possui this." }, { type: "method-static" }] },
  { id: "fluent", label: "Retornar this", duration: "15 min", eyebrow: "MESMA REFERÊNCIA, MUTAÇÕES ENCADEADAS", title: "Siga três chamadas voltarem sempre para #F1", blocks: [{ type: "lead", text: "Retornar this permite fluent interface, mas normalmente devolve o mesmo objeto depois de mutá-lo. A fluência precisa deixar esse efeito claro." }, { type: "fluent" }] },
  { id: "value", label: "Valor e equals", duration: "16 min", eyebrow: "LER THIS, CRIAR OUTRO, COMPARAR REFERÊNCIA", title: "Some sem alterar this e reconheça this == outro", blocks: [{ type: "lead", text: "No objeto de valor imutável, this oferece o valor atual, outro oferece o operando e new cria o resultado. Em equals, this == outro reconhece a mesma referência." }, { type: "value" }] },
  { id: "passing", label: "Passar this", duration: "15 min", eyebrow: "AUDITORIA, FRONTEIRA E ACOPLAMENTO", title: "Decida se o outro objeto precisa da referência inteira", blocks: [{ type: "lead", text: "auditoria.registrar(this) entrega o Pedido atual para outra colaboração. Pode ser legítimo, mas aumenta conhecimento e deve ser comparado com passar somente dados ou evento." }, { type: "passing" }] },
  { id: "safety", label: "Limites de Segurança", duration: "13 min", eyebrow: "NULL, ESCAPE PRECOCE E NOMES", title: "Não exponha um this que ainda está sendo construído", blocks: [{ type: "lead", text: "this nunca é null em método de instância. No construtor ele já existe, porém pode estar incompleto; evite entregá-lo para fora antes de terminar a inicialização." }, { type: "safety" }] },
  { id: "debug-errors", label: "Debug e Clínica", duration: "19 min", eyebrow: "OITO PAUSAS E OITO DIAGNÓSTICOS", title: "Identifique o objeto atual em cada fronteira", blocks: [{ type: "lead", text: "Acompanhe this em Cliente, construtor, Pedido, fluent, Dinheiro, auditoria, OS e equals; depois recupere oito abusos frequentes." }, { type: "debug" }, { type: "errors" }] },
  { id: "delivery", label: "Entrega & Pedido", duration: "28 min", eyebrow: "DOMÍNIO, AUDITORIA E OITO TESTES", title: "Entregue um Pedido que usa this somente com intenção", blocks: [{ type: "lead", text: "O desafio combina sombreamento, construtor sobrecarregado, método interno, valor imutável, mudança de estado e passagem consciente para auditoria." }, { type: "delivery" }] },
];

function ContentBlock({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = { current: CurrentObjectLab, shadow: ShadowLab, optional: OptionalLab, constructor: ConstructorLab, "method-static": MethodStaticLab, fluent: FluentLab, value: ValueLab, passing: PassingLab, safety: SafetyLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = map[block.type]; return Component ? <Component /> : null;
}

export default function GuidedThisReferenceLesson124({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-this-reference-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Fingerprint size={17} />Laboratório do objeto atual</span><p className="guided-sequence">124 · M4.20</p><h1>Descubra qual objeto está falando quando o código diz this</h1><p>Acompanhe a autorreferência em memória, construtores, métodos, fluent interface, valores imutáveis, equals, auditoria e um Pedido completo.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header>
    <GuidedLessonFacts ariaLabel="Resumo da aula 124" items={[{ value: "13 fontes", label: "11 válidas + 2 erros deliberados" }, { value: "8 pausas", label: "No objeto atual" }, { value: "8 casos", label: "Na clínica de erros" }]} />
    <div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 124"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? "active " : "") + (completedSteps.has(item.id) ? "done" : "")} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + "-" + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={"step-toggle " + (stepDone ? "undo" : "complete")} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>
        {allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Autorreferência explicada e controlada</h3><p>{lessonComplete ? "Aula concluída: avance para organização de classes em arquivos." : "Execute o Pedido e os oito testes antes de concluir."}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? "Reabrir aula" : "Concluir aula"}</button></section>}
      </main></div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 123</button><div className={"guided-course-status " + (lessonComplete ? "completed" : allStepsDone ? "ready" : "")}><Clock3 size={18} /><span><strong>{lessonComplete ? "Aula concluída" : completedSteps.size + " de " + steps.length + " etapas"}</strong><small>objeto atual, sombra, construtor, fluent, valor e auditoria</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 125<ArrowRight size={17} /></button></footer>
  </article>;
}
