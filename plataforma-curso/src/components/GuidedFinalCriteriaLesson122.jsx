import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Ban, Boxes, Check, CheckCircle2,
  Clock3, Copy, FileCode2, Fingerprint, GitBranch, Layers3, ListChecks,
  LockKeyhole, Play, RotateCcw, ShieldCheck, Sparkles, StepForward,
  TerminalSquare,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedFinalCriteriaLesson.css";

const STORAGE_KEY = "guided-final-criteria-lesson-122-progress";

const SCOPE_SOURCE = `public class FinalEscopos122 {
    public static void main(String[] args) {
        final int quantidade = 2;
        final int valorUnitario = 150;
        System.out.println("Total: " + quantidade * valorUnitario);
        System.out.println(normalizar("  ana silva  "));
    }
    static String normalizar(final String valor) {
        if (valor == null) return "";
        return valor.trim().toUpperCase();
    }
}`;

const INVALID_LOCAL_SOURCE = `class FinalReatribuicaoInvalida122 {
    static void processar(final String nome) {
        final int quantidade = 2;
        quantidade = 3; // ERRO: variável final já recebeu valor
        nome = "Outro"; // ERRO: parâmetro final não pode ser reatribuído
    }
}`;

const ATTRIBUTE_SOURCE = `public class FinalAtributo122 {
    public static void main(String[] args) {
        CodigoPedido122 codigo = new CodigoPedido122("PED-1001");
        System.out.println(codigo);
    }
}
final class CodigoPedido122 {
    private final String valor;
    CodigoPedido122(String valor) {
        if (valor == null || !valor.startsWith("PED-"))
            throw new IllegalArgumentException("Código deve iniciar com PED-.");
        this.valor = valor;
    }
    @Override public String toString() { return valor; }
}`;

const INVALID_FIELD_SOURCE = `class FinalSemInicializar122 {
    private final String codigo;
    FinalSemInicializar122(boolean importar) {
        if (importar) codigo = "PED-IMPORTADO";
        // ERRO: quando importar é false, codigo não recebe valor
    }
}`;

const ENTITY_SOURCE = `public class FinalEntidade122 {
    public static void main(String[] args) {
        ProdutoFinal122 produto = new ProdutoFinal122("PROD-001", "Cadeira", 10);
        System.out.println(produto.resumo());
        produto.vender(2);
        produto.inativar("Fora de linha");
        System.out.println(produto.resumo());
    }
}
enum StatusProduto122 { ATIVO, INATIVO }
class ProdutoFinal122 {
    private final String codigo;
    private final String nome;
    private int estoque;
    private StatusProduto122 status = StatusProduto122.ATIVO;
    private String motivoInativacao = "";
    ProdutoFinal122(String codigo, String nome, int estoque) {
        if (codigo == null || !codigo.startsWith("PROD-") || nome == null || nome.isBlank() || estoque < 0)
            throw new IllegalArgumentException("Produto inválido.");
        this.codigo = codigo; this.nome = nome; this.estoque = estoque;
    }
    boolean vender(int quantidade) {
        if (quantidade <= 0) throw new IllegalArgumentException("Quantidade inválida.");
        if (status != StatusProduto122.ATIVO || quantidade > estoque) return false;
        estoque -= quantidade; return true;
    }
    void inativar(String motivo) {
        if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo obrigatório.");
        status = StatusProduto122.INATIVO; motivoInativacao = motivo;
    }
    String resumo() { return codigo + " | " + nome + " | estoque=" + estoque + " | " + status + " | " + motivoInativacao; }
}`;

const REFERENCE_SOURCE = `public class FinalReferencia122 {
    public static void main(String[] args) {
        final ContaFinal122 conta = new ContaFinal122("Ana Silva", 100);
        conta.depositar(50); // o objeto pode mudar
        System.out.println(conta.resumo());
        // conta = new ContaFinal122("Bia", 200); // a referência não pode mudar
    }
}
class ContaFinal122 {
    private final String titular;
    private int saldo;
    ContaFinal122(String titular, int saldo) {
        if (titular == null || titular.isBlank() || saldo < 0) throw new IllegalArgumentException("Conta inválida.");
        this.titular = titular; this.saldo = saldo;
    }
    void depositar(int valor) {
        if (valor <= 0) throw new IllegalArgumentException("Depósito inválido.");
        saldo += valor;
    }
    String resumo() { return titular + " | saldo=" + saldo; }
}`;

const IMMUTABLE_SOURCE = `import java.util.List;

public class ImutabilidadeProfunda122 {
    public static void main(String[] args) {
        java.util.ArrayList<String> origem = new java.util.ArrayList<>(List.of("A", "B"));
        AgendaFinal122 agenda = new AgendaFinal122(origem);
        origem.add("C");
        System.out.println("Agenda: " + agenda.compromissos());
        System.out.println("Origem: " + origem.size() + " itens; agenda: " + agenda.compromissos().size());
    }
}
final class AgendaFinal122 {
    private final List<String> compromissos;
    AgendaFinal122(List<String> compromissos) {
        if (compromissos == null) throw new IllegalArgumentException("Lista obrigatória.");
        this.compromissos = List.copyOf(compromissos);
    }
    List<String> compromissos() { return compromissos; }
}`;

const INHERITANCE_SOURCE = `public class FinalHeranca122 {
    public static void main(String[] args) {
        DocumentoEspecial122 documento = new DocumentoEspecial122("DOC-001");
        System.out.println(documento.codigo());
        System.out.println(documento.resumo());
    }
}
class DocumentoBase122 {
    private final String codigo;
    DocumentoBase122(String codigo) { this.codigo = codigo; }
    final String codigo() { return codigo; }
    String resumo() { return "Documento: " + codigo; }
}
class DocumentoEspecial122 extends DocumentoBase122 {
    DocumentoEspecial122(String codigo) { super(codigo); }
    @Override String resumo() { return "Documento especial: " + codigo(); }
}`;

const INVALID_INHERITANCE_SOURCE = `final class DinheiroFechado122 { }
class DinheiroPromocional122 extends DinheiroFechado122 {
    // ERRO: não é possível herdar de uma classe final
}`;

const VALUE_SOURCE = `import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public class ObjetosValorFinal122 {
    public static void main(String[] args) {
        EmailFinal122 a = new EmailFinal122("Ana@Email.com");
        EmailFinal122 b = new EmailFinal122("ana@email.com");
        DinheiroFinal122 total = DinheiroFinal122.de("199.90").somar(DinheiroFinal122.de("20.00"));
        System.out.println(a + " | mesmo valor: " + a.equals(b));
        System.out.println("Total: " + total);
    }
}
final class EmailFinal122 {
    private final String valor;
    EmailFinal122(String valor) {
        if (valor == null || !valor.contains("@")) throw new IllegalArgumentException("E-mail inválido.");
        this.valor = valor.trim().toLowerCase();
    }
    @Override public boolean equals(Object outro) { return outro instanceof EmailFinal122 email && valor.equals(email.valor); }
    @Override public int hashCode() { return Objects.hash(valor); }
    @Override public String toString() { return valor; }
}
final class DinheiroFinal122 {
    private final BigDecimal valor;
    private DinheiroFinal122(BigDecimal valor) { this.valor = valor.setScale(2, RoundingMode.HALF_UP); }
    static DinheiroFinal122 de(String valor) { return new DinheiroFinal122(new BigDecimal(valor)); }
    DinheiroFinal122 somar(DinheiroFinal122 outro) { return new DinheiroFinal122(valor.add(outro.valor)); }
    @Override public String toString() { return "R$ " + valor; }
}`;

const CONSTANT_SOURCE = `public class ConstanteFinal122 {
    public static void main(String[] args) {
        System.out.println(new CodigoOsConstante122("OS-2026-0001"));
    }
}
final class CodigoOsConstante122 {
    private static final String PREFIXO = "OS-";
    private final String valor;
    CodigoOsConstante122(String valor) {
        if (valor == null || !valor.startsWith(PREFIXO))
            throw new IllegalArgumentException("Código deve iniciar com " + PREFIXO);
        this.valor = valor;
    }
    @Override public String toString() { return valor; }
}`;

const OS_SOURCE = `import java.time.LocalDate;

public class FinalOrdemServico122 {
    public static void main(String[] args) {
        OrdemServicoFinal122 ordem = OrdemServicoFinal122.agendar("OS-2026-0001", "Ana Silva", LocalDate.of(2026, 7, 20), TurnoFinal122.MANHA);
        System.out.println(ordem.resumo());
        ordem.reagendar(LocalDate.of(2026, 7, 22), TurnoFinal122.TARDE);
        System.out.println(ordem.resumo());
        ordem.concluir();
        System.out.println(ordem.resumo());
        try { ordem.reagendar(LocalDate.of(2026, 7, 23), TurnoFinal122.MANHA); }
        catch (IllegalStateException erro) { System.out.println("Erro esperado: " + erro.getMessage()); }
    }
}
enum StatusFinal122 { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
enum TurnoFinal122 { MANHA, TARDE }
final class CodigoOsFinal122 {
    private static final String PREFIXO = "OS-";
    private final String valor;
    CodigoOsFinal122(String valor) {
        if (valor == null || !valor.startsWith(PREFIXO)) throw new IllegalArgumentException("Código inválido.");
        this.valor = valor;
    }
    @Override public String toString() { return valor; }
}
final class PeriodoFinal122 {
    private final LocalDate data;
    private final TurnoFinal122 turno;
    PeriodoFinal122(LocalDate data, TurnoFinal122 turno) {
        if (data == null || turno == null) throw new IllegalArgumentException("Período obrigatório.");
        this.data = data; this.turno = turno;
    }
    LocalDate data() { return data; }
    @Override public String toString() { return data + " " + turno; }
}
class OrdemServicoFinal122 {
    private final CodigoOsFinal122 codigo;
    private final String cliente;
    private PeriodoFinal122 periodo;
    private StatusFinal122 status;
    private int quantidadeReagendamentos;
    private String motivoCancelamento = "";
    private OrdemServicoFinal122(CodigoOsFinal122 codigo, String cliente, PeriodoFinal122 periodo) {
        if (cliente == null || cliente.isBlank()) throw new IllegalArgumentException("Cliente obrigatório.");
        this.codigo = codigo; this.cliente = cliente.trim(); this.periodo = periodo; this.status = StatusFinal122.AGENDADA;
    }
    static OrdemServicoFinal122 agendar(String codigo, String cliente, LocalDate data, TurnoFinal122 turno) {
        return new OrdemServicoFinal122(new CodigoOsFinal122(codigo), cliente, new PeriodoFinal122(data, turno));
    }
    void reagendar(LocalDate data, TurnoFinal122 turno) {
        if (status == StatusFinal122.CONCLUIDA || status == StatusFinal122.CANCELADA) throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        periodo = new PeriodoFinal122(data, turno); quantidadeReagendamentos++; status = StatusFinal122.REAGENDADA;
    }
    void concluir() {
        if (status == StatusFinal122.CANCELADA) throw new IllegalStateException("OS cancelada não pode ser concluída.");
        status = StatusFinal122.CONCLUIDA;
    }
    void cancelar(String motivo) {
        if (status == StatusFinal122.CONCLUIDA) throw new IllegalStateException("OS concluída não pode ser cancelada.");
        if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo obrigatório.");
        motivoCancelamento = motivo; status = StatusFinal122.CANCELADA;
    }
    String resumo() { return codigo + " | " + cliente + " | " + periodo + " | " + status + " | reagendamentos=" + quantidadeReagendamentos + (motivoCancelamento.isBlank() ? "" : " | " + motivoCancelamento); }
    StatusFinal122 status() { return status; }
    PeriodoFinal122 periodo() { return periodo; }
    int quantidadeReagendamentos() { return quantidadeReagendamentos; }
}`;

const TEST_SOURCE = `import java.time.LocalDate;

public class TesteFinal122 {
    private static int testes;
    public static void main(String[] args) {
        OrdemServicoFinal122 os = OrdemServicoFinal122.agendar("OS-2026-0001", "Ana", LocalDate.of(2026, 7, 20), TurnoFinal122.MANHA);
        check(os.status() == StatusFinal122.AGENDADA);
        check(os.periodo().data().equals(LocalDate.of(2026, 7, 20)));
        os.reagendar(LocalDate.of(2026, 7, 22), TurnoFinal122.TARDE);
        check(os.status() == StatusFinal122.REAGENDADA);
        check(os.quantidadeReagendamentos() == 1);
        check(os.periodo().data().equals(LocalDate.of(2026, 7, 22)));
        os.concluir();
        check(os.status() == StatusFinal122.CONCLUIDA);
        expectState(() -> os.reagendar(LocalDate.now(), TurnoFinal122.MANHA));
        expectState(() -> os.cancelar("Cliente desistiu"));
        System.out.println(testes + " testes passaram");
    }
    private static void expectState(Runnable acao) {
        try { acao.run(); throw new AssertionError("Erro esperado."); }
        catch (IllegalStateException esperado) { testes++; }
    }
    private static void check(boolean condicao) { testes++; if (!condicao) throw new AssertionError("Falhou teste " + testes); }
}`;

const ERRORS = [
  ["final torna tudo imutável", "A referência não muda, mas conta.depositar ainda altera o saldo.", "Separe reatribuição, mutação interna e imutabilidade profunda."],
  ["Confundir static e final", "O código mistura pertencimento à classe com restrição de mudança.", "Pergunte primeiro quem é o dono; depois qual mudança precisa ser proibida."],
  ["Atributo sem inicialização", "Existe um caminho do construtor que termina sem atribuir o campo final.", "Inicialize na declaração ou em todos os caminhos de todos os construtores."],
  ["Estado do ciclo vira final", "Estoque, período ou status deixam de acompanhar transições legítimas.", "Use final para identidade e dados estáveis; controle o restante por métodos."],
  ["Identidade reatribuível", "Código ou id pode ser trocado depois que a entidade nasce.", "Marque a referência da identidade como private final e valide no nascimento."],
  ["Toda classe é final", "Pontos de extensão planejados são fechados por hábito.", "Feche apenas quando o design pede previsibilidade ou proíbe herança."],
  ["final mascara modelo ruim", "Responsabilidades continuam misturadas, apenas com mais palavras-chave.", "Corrija fronteiras e invariantes; final comunica a decisão, não cria o modelo."],
  ["static final List é segura", "A referência fica fixa, mas add e remove mudam o conteúdo global.", "Use coleção imutável, cópia defensiva e evite estado global mutável."],
];

const EVIDENCE = `# Aula 122 — final com critério
- [ ] Diferenciei os cinco contextos de final
- [ ] Separei final de static
- [ ] Reproduzi erros de variável, parâmetro e atributo
- [ ] Modelei identidade estável e ciclo mutável
- [ ] Expliquei referência fixa versus objeto mutável
- [ ] Construí imutabilidade profunda com cópia defensiva
- [ ] Testei final em método e classe
- [ ] Modelei Email, Dinheiro e constante
- [ ] Entreguei a OS e 8 testes`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? "Copiado" : "Copiar"}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{code}</SyntaxHighlighter></section>;
}

function ContextMapLab() {
  const [selected, setSelected] = useState(0);
  const contexts = [
    ["Variável local", "final int quantidade", "não pode receber outro valor", "reatribuição"],
    ["Parâmetro", "final String nome", "não pode apontar para outro valor dentro do método", "reatribuição local"],
    ["Atributo", "private final String codigo", "recebe valor uma vez por objeto", "reatribuição do campo"],
    ["Método", "final void cancelar()", "subclasse não pode substituir a implementação", "sobrescrita"],
    ["Classe", "final class Dinheiro", "nenhuma classe pode estendê-la", "herança"],
  ];
  const current = contexts[selected];
  return <section className="fn122-stack"><div className="fn122-context-map"><nav>{contexts.map((item, index) => <button type="button" className={selected === index ? "active" : ""} onClick={() => setSelected(index)} key={item[0]}><span>{index + 1}</span>{item[0]}</button>)}</nav><main><LockKeyhole /><span>MESMA PALAVRA · EFEITO PELO CONTEXTO</span><h3>{current[0]}</h3><code>{current[1]}</code><p>{current[2]}</p><strong>Bloqueia: {current[3]}</strong></main></div><p className="guided-note"><ShieldCheck size={18} /><span><code>final</code> limita uma forma específica de mudança. Ele não “congela tudo”.</span></p></section>;
}

function OwnershipLab() {
  const [focus, setFocus] = useState("final");
  return <section className="fn122-stack"><div className="fn122-ownership"><header><button type="button" className={focus === "static" ? "active" : ""} onClick={() => setFocus("static")}>static</button><button type="button" className={focus === "final" ? "active" : ""} onClick={() => setFocus("final")}>final</button><button type="button" className={focus === "both" ? "active" : ""} onClick={() => setFocus("both")}>static final</button></header><main><section className={focus === "static" || focus === "both" ? "lit" : ""}><Boxes /><b>Quem possui?</b><p>{focus === "static" || focus === "both" ? "A classe possui uma única cópia." : "final sozinho não muda o dono."}</p></section><ArrowRight /><section className={focus === "final" || focus === "both" ? "lit" : ""}><Ban /><b>Que mudança é proibida?</b><p>{focus === "final" || focus === "both" ? "A referência ou valor não pode ser reatribuído." : "static sozinho não impede mudança."}</p></section></main><pre>{focus === "static" ? "static int totalCriados;" : focus === "final" ? "private final String codigo;" : "private static final String PREFIXO = \"OS-\";"}</pre></div></section>;
}

function CompileLab() {
  const [invalid, setInvalid] = useState(false);
  return <section className="fn122-stack"><div className="fn122-compile"><header><button type="button" className={!invalid ? "active" : ""} onClick={() => setInvalid(false)}>Executar versão válida</button><button type="button" className={invalid ? "danger" : ""} onClick={() => setInvalid(true)}>Descomentar reatribuições</button></header><main className={invalid ? "danger" : "safe"}><TerminalSquare /><span>{invalid ? "javac FinalReatribuicaoInvalida122.java" : "java FinalEscopos122"}</span><pre>{invalid ? "error: cannot assign a value to final variable quantidade\nerror: final parameter nome may not be assigned" : "Total: 300\nANA SILVA"}</pre><p>{invalid ? "O compilador aponta a variável exata. Nenhum objeto foi congelado; duas variáveis locais tentaram receber nova referência/valor." : "O cálculo e a transformação usam os valores sem reatribuí-los."}</p></main></div><CodePanel name={invalid ? "FinalReatribuicaoInvalida122.java" : "FinalEscopos122.java"} code={invalid ? INVALID_LOCAL_SOURCE : SCOPE_SOURCE} /></section>;
}

function InitializationLab() {
  const [path, setPath] = useState("valid");
  return <section className="fn122-stack"><div className="fn122-init"><nav><button type="button" className={path === "declaration" ? "active" : ""} onClick={() => setPath("declaration")}>Na declaração</button><button type="button" className={path === "valid" ? "active" : ""} onClick={() => setPath("valid")}>No construtor</button><button type="button" className={path === "invalid" ? "danger" : ""} onClick={() => setPath("invalid")}>Caminho incompleto</button></nav><main className={path === "invalid" ? "danger" : "safe"}><div className="fn122-path"><span>início</span><ArrowRight /><span>{path === "declaration" ? "status = ATIVO" : path === "valid" ? "this.valor = valor" : "if (importar) atribui"}</span><ArrowRight /><span>{path === "invalid" ? "false → sem valor" : "objeto válido"}</span></div><h3>{path === "invalid" ? "variable codigo might not have been initialized" : "Todo caminho termina com o campo inicializado"}</h3><p>{path === "invalid" ? "O compilador analisa todos os caminhos possíveis, não apenas o cenário que você pretende executar." : "Um atributo final pode receber valor na declaração ou exatamente uma vez durante a construção."}</p></main></div><CodePanel name={path === "invalid" ? "FinalSemInicializar122.java" : "FinalAtributo122.java"} code={path === "invalid" ? INVALID_FIELD_SOURCE : ATTRIBUTE_SOURCE} /></section>;
}

function EntityLab() {
  const [stock, setStock] = useState(10);
  const [active, setActive] = useState(true);
  return <section className="fn122-stack"><div className="fn122-entity"><header><Fingerprint /><div><span>IDENTIDADE ESTÁVEL</span><strong>PROD-001 · Cadeira</strong><small>private final codigo · private final nome</small></div></header><main><section><span>CICLO DE VIDA CONTROLADO</span><b>Estoque: {stock}</b><b>Status: {active ? "ATIVO" : "INATIVO"}</b><div><button type="button" disabled={!active || stock < 2} onClick={() => setStock((value) => value - 2)}>Vender 2</button><button type="button" disabled={!active} onClick={() => setActive(false)}>Inativar</button><button type="button" onClick={() => { setStock(10); setActive(true); }}>Reiniciar</button></div></section><aside><article><CheckCircle2 /><b>final</b><p>O produto continua sendo PROD-001 durante toda a vida.</p></article><article><RotateCcw /><b>mutável</b><p>Estoque e status mudam somente por comportamentos válidos.</p></article></aside></main></div><CodePanel name="FinalEntidade122.java" code={ENTITY_SOURCE} /></section>;
}

function ReferenceLab() {
  const [balance, setBalance] = useState(100);
  const [attempt, setAttempt] = useState(false);
  return <section className="fn122-stack"><div className="fn122-reference"><section><span>STACK</span><article><b>final conta</b><code>ref #A1</code></article><button type="button" className={attempt ? "danger" : ""} onClick={() => setAttempt((value) => !value)}>{attempt ? "Reatribuição bloqueada" : "Tentar conta = #B2"}</button></section><ArrowRight /><section><span>HEAP · #A1</span><article><b>Ana Silva</b><code>saldo = {balance}</code></article><button type="button" onClick={() => setBalance((value) => value + 50)}>conta.depositar(50)</button></section></div><div className="fn122-reference-result"><strong>{attempt ? "NÃO COMPILA" : "COMPILA"}</strong><p>{attempt ? "A seta final não pode apontar para #B2." : "O objeto em #A1 continua mutável; o depósito muda seu estado interno."}</p></div><CodePanel name="FinalReferencia122.java" code={REFERENCE_SOURCE} /></section>;
}

function ImmutabilityLab() {
  const [layers, setLayers] = useState(() => new Set([0]));
  const items = ["classe final", "atributos private final", "sem setters", "cópia defensiva", "métodos retornam novo objeto"];
  const toggle = (index) => setLayers((current) => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next; });
  return <section className="fn122-stack"><div className="fn122-layers"><header><Layers3 /><div><span>IMUTABILIDADE PROFUNDA</span><strong>{layers.size} de {items.length} camadas aplicadas</strong></div></header><main>{items.map((item, index) => <button type="button" className={layers.has(index) ? "done" : ""} onClick={() => toggle(index)} key={item}><span>{layers.has(index) ? <Check size={15} /> : index + 1}</span>{item}</button>)}</main><footer className={layers.size === items.length ? "safe" : "warning"}>{layers.size === items.length ? "O contrato está completo: nem referência interna nem estado escapam para mutação." : "final sozinho é apenas uma camada. Complete o desenho antes de chamar o objeto de imutável."}</footer></div><CodePanel name="ImutabilidadeProfunda122.java" code={IMMUTABLE_SOURCE} /></section>;
}

function InheritanceLab() {
  const [mode, setMode] = useState("method");
  return <section className="fn122-stack"><div className="fn122-inheritance"><header><button type="button" className={mode === "method" ? "active" : ""} onClick={() => setMode("method")}>Método final</button><button type="button" className={mode === "class" ? "danger" : ""} onClick={() => setMode("class")}>Classe final</button></header><main><div><span>TIPO BASE</span><b>{mode === "method" ? "DocumentoBase122" : "DinheiroFechado122"}</b><code>{mode === "method" ? "final codigo() · resumo() aberto" : "final class"}</code></div><GitBranch /><div className={mode === "class" ? "blocked" : "open"}><span>SUBCLASSE</span><b>{mode === "method" ? "DocumentoEspecial122" : "DinheiroPromocional122"}</b><code>{mode === "method" ? "sobrescreve resumo; preserva codigo" : "extends bloqueado"}</code></div></main><p>{mode === "method" ? "A classe continua extensível; somente o ponto de identidade codigo() fica protegido contra sobrescrita." : "A classe inteira fecha a herança. Use quando extensão não faz parte do contrato, não por hábito."}</p></div><CodePanel name={mode === "method" ? "FinalHeranca122.java" : "FinalHerancaInvalida122.java"} code={mode === "method" ? INHERITANCE_SOURCE : INVALID_INHERITANCE_SOURCE} /></section>;
}

function ValueLab() {
  const [tab, setTab] = useState("email");
  const content = {
    email: ["EmailFinal122", "Ana@Email.com", "ana@email.com", "classe final · valor final · igualdade pelo valor"],
    money: ["DinheiroFinal122", "R$ 199.90 + R$ 20.00", "R$ 219.90", "somar devolve um novo objeto; o original permanece"],
    constant: ["CodigoOsConstante122", "PREFIXO = OS-", "OS-2026-0001", "private + static + final + String imutável"],
  }[tab];
  return <section className="fn122-stack"><div className="fn122-values"><nav><button type="button" className={tab === "email" ? "active" : ""} onClick={() => setTab("email")}>Email</button><button type="button" className={tab === "money" ? "active" : ""} onClick={() => setTab("money")}>Dinheiro</button><button type="button" className={tab === "constant" ? "active" : ""} onClick={() => setTab("constant")}>Constante</button></nav><main><ShieldCheck /><span>{content[0]}</span><code>{content[1]}</code><ArrowRight /><strong>{content[2]}</strong><p>{content[3]}</p></main></div><CodePanel name={tab === "constant" ? "ConstanteFinal122.java" : "ObjetosValorFinal122.java"} code={tab === "constant" ? CONSTANT_SOURCE : VALUE_SOURCE} /></section>;
}

function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    ["construtor Produto", "this.codigo = codigo", "Campo final recebe sua única atribuição."],
    ["vender", "estoque: 10 → 8", "Estado de ciclo muda sem trocar a identidade."],
    ["referência final", "conta → #A1", "A seta permanece apontando para o mesmo objeto."],
    ["depositar", "#A1.saldo: 100 → 150", "O interior do objeto mutável muda."],
    ["Dinheiro.somar", "this=199.90 · retorno=#D2 219.90", "Novo valor nasce; o original não é alterado."],
    ["validar código", "PREFIXO = OS-", "A constante da classe participa da invariante."],
  ];
  const current = frames[step];
  return <section className="fn122-stack"><div className="fn122-debug"><div><button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft size={15} />Voltar</button><button type="button" disabled={step === frames.length - 1} onClick={() => setStep((value) => Math.min(frames.length - 1, value + 1))}><StepForward size={15} />Step Into</button><span>{step + 1}/{frames.length}</span></div><section><aside>{frames.map((item, index) => <button type="button" className={index === step ? "active" : ""} onClick={() => setStep(index)} key={item[0]}><span>{index + 1}</span>{item[0]}</button>)}</aside><main><span>DEBUGGER · REFERÊNCIA E ESTADO</span><h3>{current[0]}</h3><code>{current[1]}</code><p>{current[2]}</p><div><b>Pergunta do mentor</b><small>Nesta linha houve atribuição, reatribuição, mutação interna, sobrescrita ou criação de outro objeto?</small></div></main></section></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="fn122-stack"><div className="fn122-errors"><nav>{ERRORS.map((item, index) => <button type="button" className={index === selected ? "active" : ""} onClick={() => setSelected(index)} key={item[0]}><span>{index + 1}</span><span className="guided-error-label">{item[0]}</span></button>)}</nav><main><span><AlertTriangle size={16} />CASO {selected + 1} DE {ERRORS.length}</span><h3>{current[0]}</h3><section><div><b>Sintoma</b><p>{current[1]}</p></div><ArrowRight size={18} /><div><b>Como corrigir</b><p>{current[2]}</p></div></section></main></div></section>;
}

function DeliveryLab() {
  const [checked, setChecked] = useState(() => new Set());
  const tasks = ["Código final", "Período final", "Identidade final", "Estado controlado", "Erro esperado", "8 testes"];
  const toggle = (index) => setChecked((current) => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next; });
  return <section className="fn122-stack"><CodePanel name="FinalOrdemServico122.java" code={OS_SOURCE} /><CodePanel name="TesteFinal122.java" code={TEST_SOURCE} /><div className="guided-console"><div className="guided-console-title"><Play size={15} />Terminal</div><pre>{`> javac -encoding UTF-8 FinalOrdemServico122.java TesteFinal122.java
> java FinalOrdemServico122
OS-2026-0001 | Ana Silva | 2026-07-20 MANHA | AGENDADA | reagendamentos=0
OS-2026-0001 | Ana Silva | 2026-07-22 TARDE | REAGENDADA | reagendamentos=1
OS-2026-0001 | Ana Silva | 2026-07-22 TARDE | CONCLUIDA | reagendamentos=1
Erro esperado: OS encerrada não pode ser reagendada.
> java TesteFinal122
8 testes passaram
> git add labs/m4/aula-122-final
> git commit -m "Aula 122: pratica final com criterio"`}</pre></div><div className="fn122-checklist">{tasks.map((item, index) => <button type="button" className={checked.has(index) ? "done" : ""} onClick={() => toggle(index)} key={item}><span>{checked.has(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral da modelagem</h3></div><ul><li>Por que código e cliente são finais, mas período e status não?</li><li>Por que trocar o período cria outro <code>PeriodoFinal122</code>?</li><li>Qual diferença entre a constante <code>PREFIXO</code> e o atributo <code>codigo</code>?</li><li>O que `final` não protege sozinho nesta solução?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: "contexts", label: "Cinco Contextos", duration: "13 min", eyebrow: "LOCAL, PARÂMETRO, ATRIBUTO, MÉTODO E CLASSE", title: "Descubra qual mudança cada final realmente bloqueia", blocks: [{ type: "lead", text: "A palavra é a mesma, mas o efeito depende do lugar: reatribuição, sobrescrita ou herança. Comece pelo contexto antes de repetir definições." }, { type: "contexts" }] },
  { id: "ownership", label: "final ≠ static", duration: "12 min", eyebrow: "PERTENCIMENTO VERSUS RESTRIÇÃO", title: "Separe quem possui de qual mudança é proibida", blocks: [{ type: "lead", text: "static responde quem possui o membro; final restringe uma mudança. Juntos, podem formar uma constante de classe, mas continuam comunicando decisões diferentes." }, { type: "ownership" }] },
  { id: "local-param", label: "Local e Parâmetro", duration: "15 min", eyebrow: "ERROS REAIS DE REATRIBUIÇÃO", title: "Descomente duas linhas e leia o compilador", blocks: [{ type: "lead", text: "final em variável ou parâmetro fixa aquela variável no escopo. O objeto recebido ainda pode ser mutável; apenas a variável não pode apontar para outro." }, { type: "compile" }] },
  { id: "attribute", label: "Atributo e Construção", duration: "16 min", eyebrow: "ATRIBUIÇÃO ÚNICA EM TODOS OS CAMINHOS", title: "Faça o compilador auditar o nascimento do objeto", blocks: [{ type: "lead", text: "Um campo final precisa ser inicializado na declaração ou em todo caminho de construção. Isso protege estabilidade após o nascimento, não substitui validação." }, { type: "initialization" }] },
  { id: "entity", label: "Identidade e Ciclo", duration: "16 min", eyebrow: "ESTÁVEL NÃO SIGNIFICA PARADO", title: "Mantenha o Produto reconhecível enquanto seu estado evolui", blocks: [{ type: "lead", text: "Entidade combina identidade estável com ciclo de vida. Código e nome não mudam; estoque e status mudam por comportamentos que preservam regras." }, { type: "entity" }] },
  { id: "reference", label: "Referência e Objeto", duration: "15 min", eyebrow: "SETA FIXA, INTERIOR MUTÁVEL", title: "Veja conta permanecer em #A1 enquanto o saldo muda", blocks: [{ type: "lead", text: "final na referência impede apontar para outro objeto. Se o objeto for mutável, chamadas como depositar continuam alterando seu estado interno." }, { type: "reference" }] },
  { id: "immutability", label: "Imutabilidade Profunda", duration: "17 min", eyebrow: "CINCO CAMADAS E CÓPIA DEFENSIVA", title: "Não chame o objeto de imutável antes de fechar todas as saídas", blocks: [{ type: "lead", text: "Imutabilidade exige mais que final: classe controlada, campos finais, ausência de setters, tipos internos seguros, cópias defensivas e operações que retornam novos valores." }, { type: "immutability" }] },
  { id: "inheritance", label: "Método e Classe", duration: "15 min", eyebrow: "SOBRESCRITA E HERANÇA", title: "Feche somente o ponto de extensão que o design proíbe", blocks: [{ type: "lead", text: "Método final bloqueia sua sobrescrita; classe final bloqueia toda herança. Ambos são decisões de contrato e podem atrapalhar quando aplicados automaticamente." }, { type: "inheritance" }] },
  { id: "values", label: "Valores e Constante", duration: "17 min", eyebrow: "EMAIL, DINHEIRO E STATIC FINAL", title: "Combine final com um desenho realmente previsível", blocks: [{ type: "lead", text: "Cada objeto de valor usa final para sustentar estabilidade, igualdade e operações que criam novos valores. Constantes somam pertencimento da classe, referência fixa e tipo imutável." }, { type: "values" }] },
  { id: "debug-errors", label: "Debug e Clínica", duration: "18 min", eyebrow: "SEIS PAUSAS E OITO DIAGNÓSTICOS", title: "Nomeie exatamente a mudança que ocorreu", blocks: [{ type: "lead", text: "No debugger, diferencie atribuição inicial, reatribuição, mutação interna e criação de novo objeto; depois recupere oito modelagens que usam final como atalho." }, { type: "debug" }, { type: "errors" }] },
  { id: "delivery", label: "Entrega & OS", duration: "27 min", eyebrow: "IDENTIDADE, PERÍODO, TRANSIÇÕES E TESTES", title: "Entregue uma OS estável sem impedir seu ciclo de vida", blocks: [{ type: "lead", text: "A OS final usa tipos de valor fechados, identidade final e estado mutável controlado. Reagendar, concluir e cancelar continuam possíveis apenas nos estados permitidos." }, { type: "delivery" }] },
];

function ContentBlock({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = { contexts: ContextMapLab, ownership: OwnershipLab, compile: CompileLab, initialization: InitializationLab, entity: EntityLab, reference: ReferenceLab, immutability: ImmutabilityLab, inheritance: InheritanceLab, values: ValueLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = map[block.type]; return Component ? <Component /> : null;
}

export default function GuidedFinalCriteriaLesson122({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-final-criteria-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><LockKeyhole size={17} />Laboratório de estabilidade e mudança</span><p className="guided-sequence">122 · M4.18</p><h1>Restrinja a mudança certa sem paralisar o objeto</h1><p>Experimente `final` em cinco contextos, acompanhe erros do compilador e modele identidade, imutabilidade, herança, valores e ciclo de vida com critério.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header>
    <GuidedLessonFacts ariaLabel="Resumo da aula 122" items={[{ value: "13 fontes", label: "10 válidas + 3 erros deliberados" }, { value: "6 pausas", label: "Entre referência e estado" }, { value: "8 casos", label: "Na clínica de erros" }]} />
    <div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 122"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? "active " : "") + (completedSteps.has(item.id) ? "done" : "")} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + "-" + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={"step-toggle " + (stepDone ? "undo" : "complete")} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>
        {allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Estabilidade com ciclo de vida comprovada</h3><p>{lessonComplete ? "Aula concluída: avance para sobrecarga de construtores." : "Execute a OS e os oito testes antes de concluir."}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? "Reabrir aula" : "Concluir aula"}</button></section>}
      </main></div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 121</button><div className={"guided-course-status " + (lessonComplete ? "completed" : allStepsDone ? "ready" : "")}><Clock3 size={18} /><span><strong>{lessonComplete ? "Aula concluída" : completedSteps.size + " de " + steps.length + " etapas"}</strong><small>final, identidade, referência, imutabilidade e ciclo</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 123<ArrowRight size={17} /></button></footer>
  </article>;
}
