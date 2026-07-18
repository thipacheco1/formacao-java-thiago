import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy,
  Eye, EyeOff, FileCode2, Fingerprint, ListChecks, Play, RotateCcw,
  ShieldCheck, Sparkles, StepForward, TerminalSquare,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedToStringLesson.css";

const STORAGE_KEY = "guided-to-string-lesson-120-progress";

const DEFAULT_SOURCE = `public class ToStringPadrao120 {
    public static void main(String[] args) {
        ClientePadrao120 cliente = new ClientePadrao120(10, "Ana Silva", "ana@email.com");
        System.out.println(cliente);
        System.out.println(cliente.toString());
    }
}
class ClientePadrao120 {
    private final int id;
    private final String nome;
    private final String email;
    ClientePadrao120(int id, String nome, String email) {
        this.id = id; this.nome = nome; this.email = email;
    }
}`;

const OVERRIDE_SOURCE = `public class ToStringSobrescrito120 {
    public static void main(String[] args) {
        ClienteTexto120 cliente = new ClienteTexto120(10, "Ana Silva", "Ana@Email.com");
        System.out.println(cliente);
        System.out.println(cliente.toString());
    }
}
class ClienteTexto120 {
    private final int id;
    private final String nome;
    private final String email;
    ClienteTexto120(int id, String nome, String email) {
        if (id <= 0) throw new IllegalArgumentException("Id inválido.");
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome obrigatório.");
        if (email == null || !email.contains("@")) throw new IllegalArgumentException("E-mail inválido.");
        this.id = id; this.nome = nome; this.email = email.trim().toLowerCase();
    }
    @Override public String toString() {
        return "ClienteTexto120{id=" + id + ", nome='" + nome + "', email='" + email + "'}";
    }
}`;

const VALUE_SOURCE = `import java.math.BigDecimal;
import java.math.RoundingMode;

public class ToStringValores120 {
    public static void main(String[] args) {
        EmailTexto120 email = new EmailTexto120("Ana@Email.com");
        DinheiroTexto120 dinheiro = new DinheiroTexto120(new BigDecimal("199.9"));
        System.out.println("E-mail: " + email);
        System.out.println("Dinheiro: " + dinheiro);
    }
}
record EmailTexto120(String valor) {
    EmailTexto120 {
        if (valor == null || !valor.contains("@")) throw new IllegalArgumentException("E-mail inválido.");
        valor = valor.trim().toLowerCase();
    }
    @Override public String toString() { return valor; }
}
record DinheiroTexto120(BigDecimal valor) {
    DinheiroTexto120 {
        if (valor == null) throw new IllegalArgumentException("Valor obrigatório.");
        valor = valor.setScale(2, RoundingMode.HALF_UP);
    }
    @Override public String toString() { return "R$ " + valor; }
}`;

const SENSITIVE_SOURCE = `public class ToStringSensivel120 {
    public static void main(String[] args) {
        UsuarioTexto120 usuario = new UsuarioTexto120(10, "ana@email.com", "SenhaMuitoSecreta123");
        System.out.println(usuario);
    }
}
class UsuarioTexto120 {
    private final int id;
    private final String email;
    private final String senha;
    UsuarioTexto120(int id, String email, String senha) {
        if (id <= 0 || email == null || !email.contains("@") || senha == null || senha.isBlank())
            throw new IllegalArgumentException("Dados inválidos.");
        this.id = id; this.email = email.trim().toLowerCase(); this.senha = senha;
    }
    @Override public String toString() {
        return "UsuarioTexto120{id=" + id + ", email='" + email + "', senha='***'}";
    }
}`;

const DOCUMENT_SOURCE = `public class ToStringDocumento120 {
    public static void main(String[] args) {
        ClienteDocumento120 cliente = new ClienteDocumento120(10, "Ana Silva", "12345678901");
        System.out.println(cliente);
    }
}
class ClienteDocumento120 {
    private final int id;
    private final String nome;
    private final String cpf;
    ClienteDocumento120(int id, String nome, String cpf) {
        if (id <= 0 || nome == null || nome.isBlank() || cpf == null || !cpf.matches("\\d{11}"))
            throw new IllegalArgumentException("Dados inválidos.");
        this.id = id; this.nome = nome; this.cpf = cpf;
    }
    private String cpfMascarado() { return "***.***.***-" + cpf.substring(9); }
    @Override public String toString() {
        return "ClienteDocumento120{id=" + id + ", nome='" + nome + "', cpf='" + cpfMascarado() + "'}";
    }
}`;

const ORDER_SOURCE = `import java.math.BigDecimal;
import java.math.RoundingMode;

public class ToStringPedido120 {
    public static void main(String[] args) {
        PedidoTexto120 pedido = new PedidoTexto120(1001, "Ana Silva", new BigDecimal("399.8"));
        System.out.println(pedido);
        pedido.confirmarPagamento();
        System.out.println(pedido);
        System.out.println(pedido.resumo());
    }
}
enum StatusPedido120 { CRIADO, PAGO }
class PedidoTexto120 {
    private final int numero;
    private final String cliente;
    private final BigDecimal total;
    private StatusPedido120 status = StatusPedido120.CRIADO;
    PedidoTexto120(int numero, String cliente, BigDecimal total) {
        if (numero <= 0 || cliente == null || cliente.isBlank() || total == null || total.signum() <= 0)
            throw new IllegalArgumentException("Pedido inválido.");
        this.numero = numero; this.cliente = cliente; this.total = total.setScale(2, RoundingMode.HALF_UP);
    }
    void confirmarPagamento() {
        if (status != StatusPedido120.CRIADO) throw new IllegalStateException("Pedido já processado.");
        status = StatusPedido120.PAGO;
    }
    String resumo() { return "Pedido " + numero + " de " + cliente + " está " + status + " — total R$ " + total; }
    @Override public String toString() {
        return "PedidoTexto120{numero=" + numero + ", status=" + status + ", total=R$ " + total + "}";
    }
}`;

const COMPOSITION_SOURCE = `import java.math.BigDecimal;

public class ToStringComposicao120 {
    public static void main(String[] args) {
        ClienteComposto120 cliente = new ClienteComposto120(10, "Ana Silva", "ana@email.com");
        PagamentoComposto120 pagamento = new PagamentoComposto120("PAG-001", new BigDecimal("399.80"));
        System.out.println(new PedidoComposto120(1001, cliente, pagamento));
    }
}
class PedidoComposto120 {
    private final int numero; private final ClienteComposto120 cliente; private final PagamentoComposto120 pagamento;
    PedidoComposto120(int numero, ClienteComposto120 cliente, PagamentoComposto120 pagamento) {
        this.numero = numero; this.cliente = cliente; this.pagamento = pagamento;
    }
    @Override public String toString() {
        return "PedidoComposto120{numero=" + numero + ", clienteId=" + cliente.id() + ", pagamento=" + pagamento + "}";
    }
}
class ClienteComposto120 {
    private final int id; private final String nome; private final String email;
    ClienteComposto120(int id, String nome, String email) { this.id = id; this.nome = nome; this.email = email; }
    int id() { return id; }
}
class PagamentoComposto120 {
    private final String codigo; private final BigDecimal valor;
    PagamentoComposto120(String codigo, BigDecimal valor) { this.codigo = codigo; this.valor = valor; }
    @Override public String toString() { return "Pagamento{codigo='" + codigo + "', valor=R$ " + valor + "}"; }
}`;

const ECOSYSTEM_SOURCE = `import java.time.LocalDate;
import java.util.List;

public class ToStringEcossistema120 {
    public static void main(String[] args) {
        List<ProdutoTexto120> produtos = List.of(
                new ProdutoTexto120("PROD-001", "Cadeira"),
                new ProdutoTexto120("PROD-002", "Mesa"));
        System.out.println(produtos);
        System.out.println(new PeriodoTexto120(LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31)));
    }
}
record ProdutoTexto120(String codigo, String nome) {
    @Override public String toString() { return "Produto{codigo='" + codigo + "', nome='" + nome + "'}"; }
}
record PeriodoTexto120(LocalDate inicio, LocalDate fim) {
    PeriodoTexto120 {
        if (inicio == null || fim == null || fim.isBefore(inicio))
            throw new IllegalArgumentException("Período inválido.");
    }
}`;

const OS_SOURCE = `import java.time.LocalDate;

public class ToStringOrdemServico120 {
    public static void main(String[] args) {
        OrdemServico120 os = new OrdemServico120(
                new CodigoOs120("OS-2026-0001"),
                new ClienteOs120(10, "Ana Silva", "11999998888"),
                new PeriodoOs120(LocalDate.of(2026, 7, 20), TurnoOs120.MANHA));
        System.out.println(os);
        System.out.println(os.resumo());
    }
}
record CodigoOs120(String valor) {
    CodigoOs120 {
        if (valor == null || !valor.startsWith("OS-")) throw new IllegalArgumentException("Código deve iniciar com OS-.");
    }
    @Override public String toString() { return valor; }
}
record ClienteOs120(int id, String nome, String telefone) {
    ClienteOs120 {
        if (id <= 0 || nome == null || nome.isBlank() || telefone == null || !telefone.matches("\\d{10,11}"))
            throw new IllegalArgumentException("Cliente inválido.");
    }
    String telefoneMascarado() { return "(**) *****-" + telefone.substring(telefone.length() - 4); }
    @Override public String toString() { return "ClienteOs120{id=" + id + ", nome='" + nome + "', telefone='" + telefoneMascarado() + "'}"; }
}
enum TurnoOs120 { MANHA, TARDE, NOITE }
record PeriodoOs120(LocalDate data, TurnoOs120 turno) {
    PeriodoOs120 { if (data == null || turno == null) throw new IllegalArgumentException("Período inválido."); }
}
enum StatusOs120 { AGENDADA, CONCLUIDA, CANCELADA }
class OrdemServico120 {
    private final CodigoOs120 codigo; private final ClienteOs120 cliente; private final PeriodoOs120 periodo;
    private StatusOs120 status = StatusOs120.AGENDADA;
    OrdemServico120(CodigoOs120 codigo, ClienteOs120 cliente, PeriodoOs120 periodo) {
        if (codigo == null || cliente == null || periodo == null) throw new IllegalArgumentException("OS inválida.");
        this.codigo = codigo; this.cliente = cliente; this.periodo = periodo;
    }
    @Override public String toString() {
        return "OrdemServico120{codigo=" + codigo + ", clienteId=" + cliente.id() + ", periodo=" + periodo + ", status=" + status + "}";
    }
    String resumo() { return "OS " + codigo + " para " + cliente.nome() + " em " + periodo.data() + " no turno " + periodo.turno() + "."; }
}`;

const TEST_SOURCE = `public class TesteToString120 {
    private static int testes;
    public static void main(String[] args) {
        String cliente = new ClienteTexto120(10, "Ana", "ANA@EMAIL.COM").toString();
        check(cliente.contains("id=10"));
        check(cliente.contains("ana@email.com"));
        String usuario = new UsuarioTexto120(10, "ana@email.com", "segredo").toString();
        check(usuario.contains("senha='***'"));
        check(!usuario.contains("segredo"));
        String documento = new ClienteDocumento120(10, "Ana", "12345678901").toString();
        check(documento.contains("***.***.***-01"));
        String os = new OrdemServico120(new CodigoOs120("OS-1"), new ClienteOs120(10, "Ana", "11999998888"), new PeriodoOs120(java.time.LocalDate.of(2026, 7, 20), TurnoOs120.MANHA)).toString();
        check(os.contains("clienteId=10"));
        check(!os.contains("11999998888"));
        check(new DinheiroTexto120(new java.math.BigDecimal("10")).toString().equals("R$ 10.00"));
        System.out.println(testes + " testes passaram");
    }
    private static void check(boolean condicao) { testes++; if (!condicao) throw new AssertionError("Falhou teste " + testes); }
}`;

const ERRORS = [
  ["Não sobrescrever", "A saída Classe@hex não revela estado útil.", "Crie uma representação curta e técnica para classes relevantes."],
  ["Expor senha ou token", "Logs passam a armazenar credenciais.", "Omita o campo ou mostre apenas um marcador como ***."],
  ["Regra dentro do texto", "Uma mudança de formato quebra comportamento do sistema.", "Consulte métodos de domínio; nunca analise toString para decidir."],
  ["Texto gigantesco", "Debug e logs viram relatórios difíceis de ler.", "Mostre identidade e estado principal; deixe detalhes para métodos próprios."],
  ["Composição automática", "Objetos internos vazam dados ou geram recursão.", "Inclua ids ou subobjetos pequenos cujo texto seja seguro."],
  ["Confundir com resumo", "Texto técnico aparece para o usuário ou vice-versa.", "Separe toString técnico de resumo voltado à apresentação."],
  ["Esquecer @Override", "Assinatura errada não substitui Object.toString.", "Use public String toString() com @Override."],
  ["Record sensível", "Todos os componentes aparecem automaticamente.", "Revise os componentes ou sobrescreva toString conscientemente."],
];

const EVIDENCE = `# Aula 120 — toString com critério
- [ ] Expliquei Classe@hash hexadecimal
- [ ] Provei a chamada automática pelo println
- [ ] Separei toString, resumo e regra de negócio
- [ ] Modelei Email e Dinheiro
- [ ] Mascarei senha, CPF e telefone
- [ ] Controlei entidade, composição, coleção e record
- [ ] Executei a OS e 8 testes
- [ ] Registrei respostas e commit limpo`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? "Copiado" : "Copiar"}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{code}</SyntaxHighlighter></section>;
}

function DefaultLab() {
  const [overridden, setOverridden] = useState(false);
  return <section className="ts120-stack"><div className="ts120-object"><div><Fingerprint size={30} /><strong>Cliente</strong><span>id 10 · Ana Silva</span><code>@5f184fc6</code></div><ArrowRight /><main><div><button type="button" className={!overridden ? "active" : ""} onClick={() => setOverridden(false)}>Object.toString</button><button type="button" className={overridden ? "active" : ""} onClick={() => setOverridden(true)}>Sobrescrito</button></div><span>System.out.println(cliente)</span><pre>{overridden ? "Cliente{id=10, nome='Ana Silva', email='ana@email.com'}" : "ClientePadrao120@5f184fc6"}</pre><p>{overridden ? "Agora identidade e estado selecionado ajudam no debug." : "Classe + @ + hash hexadecimal confirma a instância, mas esconde os dados."}</p></main></div><CodePanel name="ToStringPadrao120.java" code={DEFAULT_SOURCE} /></section>;
}

function OverrideLab() {
  const [step, setStep] = useState(0);
  const parts = [["Chamada automática", "System.out.println(cliente)", "println chama String.valueOf, que chama cliente.toString()."], ["Contrato", "@Override public String toString()", "O compilador confirma nome, retorno, visibilidade e parâmetros."], ["Seleção", "id + nome + email", "Só campos úteis e seguros entram na representação."], ["Saída", "ClienteTexto120{id=10, ...}", "Formato consistente em uma linha facilita log e debug."]];
  const current = parts[step];
  return <section className="ts120-stack"><div className="ts120-anatomy"><nav>{parts.map((item, i) => <button type="button" className={i === step ? "active" : i < step ? "done" : ""} onClick={() => setStep(i)} key={item[0]}><span>{i + 1}</span>{item[0]}</button>)}</nav><main><span>PASSO {step + 1} DE 4</span><h3>{current[0]}</h3><code>{current[1]}</code><p>{current[2]}</p><button type="button" disabled={step === parts.length - 1} onClick={() => setStep((x) => Math.min(parts.length - 1, x + 1))}>Próximo passo<ArrowRight size={16} /></button></main></div><CodePanel name="ToStringSobrescrito120.java" code={OVERRIDE_SOURCE} /></section>;
}

function IntentionLab() {
  const [choice, setChoice] = useState("technical");
  const data = {
    technical: ["toString", "Pedido{numero=1001, status=PAGO, total=R$ 399.80}", "Debug, log e inspeção técnica"],
    summary: ["resumo()", "Pedido 1001 de Ana está PAGO — total R$ 399.80", "Tela, relatório ou mensagem amigável"],
    rule: ["aprovado()", "if (pedido.aprovado()) enviar();", "Decisão de negócio tipada e estável"],
  }[choice];
  return <section className="ts120-stack"><div className="ts120-intent"><nav><button type="button" className={choice === "technical" ? "active" : ""} onClick={() => setChoice("technical")}>Técnico</button><button type="button" className={choice === "summary" ? "active" : ""} onClick={() => setChoice("summary")}>Apresentação</button><button type="button" className={choice === "rule" ? "active" : ""} onClick={() => setChoice("rule")}>Regra</button></nav><main><span>{data[0]}</span><pre>{data[1]}</pre><p>{data[2]}</p></main></div><p className="guided-note"><AlertTriangle size={18} /><span>Nunca faça <code>pedido.toString().contains("PAGO")</code>. Formatação pode mudar; comportamento deve consultar o domínio.</span></p></section>;
}

function ValueLab() {
  const [kind, setKind] = useState("email");
  return <section className="ts120-stack"><div className="ts120-values"><nav><button type="button" className={kind === "email" ? "active" : ""} onClick={() => setKind("email")}>Email</button><button type="button" className={kind === "money" ? "active" : ""} onClick={() => setKind("money")}>Dinheiro</button></nav><main>{kind === "email" ? <><span>entrada</span><code>Ana@Email.com</code><ArrowRight /><span>normalizar</span><code>ana@email.com</code><ArrowRight /><b>toString direto</b></> : <><span>entrada</span><code>199.9</code><ArrowRight /><span>escala 2</span><code>199.90</code><ArrowRight /><b>R$ 199.90</b></>}</main></div><p className="guided-note"><Eye size={18} /><span>Objeto de valor pequeno pode retornar o próprio valor legível. A regra muda se esse valor for sensível.</span></p><CodePanel name="ToStringValores120.java" code={VALUE_SOURCE} /></section>;
}

function PrivacyLab() {
  const [mode, setMode] = useState("password");
  const [reveal, setReveal] = useState(false);
  const secret = mode === "password" ? "SenhaMuitoSecreta123" : "12345678901";
  const safe = mode === "password" ? "***" : "***.***.***-01";
  return <section className="ts120-stack"><div className="ts120-privacy"><header><button type="button" className={mode === "password" ? "active" : ""} onClick={() => { setMode("password"); setReveal(false); }}>Senha</button><button type="button" className={mode === "cpf" ? "active" : ""} onClick={() => { setMode("cpf"); setReveal(false); }}>CPF</button></header><div><section><span>DADO EM MEMÓRIA</span><code>{secret}</code></section><ArrowRight /><section className={reveal ? "danger" : "safe"}><span>SAÍDA DO toString / LOG</span><code>{reveal ? secret : safe}</code><b>{reveal ? "VAZAMENTO" : "PROTEGIDO"}</b></section></div><button type="button" onClick={() => setReveal((x) => !x)}>{reveal ? <EyeOff size={16} /> : <Eye size={16} />}{reveal ? "Aplicar proteção" : "Simular vazamento"}</button></div><CodePanel name={mode === "password" ? "ToStringSensivel120.java" : "ToStringDocumento120.java"} code={mode === "password" ? SENSITIVE_SOURCE : DOCUMENT_SOURCE} /></section>;
}

function EntityLab() {
  const [paid, setPaid] = useState(false);
  const [view, setView] = useState("technical");
  return <section className="ts120-stack"><div className="ts120-entity"><header><div><Fingerprint /><span>Pedido #1001</span><strong>{paid ? "PAGO" : "CRIADO"}</strong></div><button type="button" disabled={paid} onClick={() => setPaid(true)}>Confirmar pagamento</button><button type="button" onClick={() => setPaid(false)}>Reiniciar</button></header><nav><button type="button" className={view === "technical" ? "active" : ""} onClick={() => setView("technical")}>toString técnico</button><button type="button" className={view === "summary" ? "active" : ""} onClick={() => setView("summary")}>resumo amigável</button></nav><pre>{view === "technical" ? `PedidoTexto120{numero=1001, status=${paid ? "PAGO" : "CRIADO"}, total=R$ 399.80}` : `Pedido 1001 de Ana Silva está ${paid ? "PAGO" : "CRIADO"} — total R$ 399.80`}</pre><p>Cliente foi omitido do texto técnico; identidade, status e total bastam para esta investigação.</p></div><CodePanel name="ToStringPedido120.java" code={ORDER_SOURCE} /></section>;
}

function CompositionLab() {
  const [strategy, setStrategy] = useState("controlled");
  return <section className="ts120-stack"><div className="ts120-composition"><div className="ts120-graph"><div>Pedido #1001</div><ArrowRight /><div>Cliente #10<br /><small>nome · e-mail</small></div><ArrowRight /><div>Lista&lt;Pedido&gt;</div></div><nav><button type="button" className={strategy === "controlled" ? "active" : ""} onClick={() => setStrategy("controlled")}>Composição controlada</button><button type="button" className={strategy === "recursive" ? "danger" : ""} onClick={() => setStrategy("recursive")}>Incluir tudo</button></nav><main className={strategy === "recursive" ? "danger" : ""}><span>{strategy === "controlled" ? "SEGURO E CURTO" : "RISCO DE RECURSÃO"}</span><pre>{strategy === "controlled" ? "Pedido{numero=1001, clienteId=10, pagamento=Pagamento{codigo='PAG-001', valor=R$ 399.80}}" : "Pedido{cliente=Cliente{pedidos=[Pedido{cliente=Cliente{pedidos=[...]}}]}}"}</pre><p>{strategy === "controlled" ? "Cliente entra só pelo id; Pagamento entra porque seu texto é pequeno e seguro." : "Objetos bidirecionais podem chamar toString uns dos outros sem fim."}</p></main></div><CodePanel name="ToStringComposicao120.java" code={COMPOSITION_SOURCE} /></section>;
}

function EcosystemLab() {
  const [tab, setTab] = useState("collection");
  const content = {
    collection: ["Coleção", "[Produto{codigo='PROD-001', nome='Cadeira'}, Produto{codigo='PROD-002', nome='Mesa'}]", "A lista chama toString de cada elemento."],
    record: ["Record", "PeriodoTexto120[inicio=2026-01-01, fim=2026-12-31]", "Todos os componentes aparecem automaticamente."],
    ide: ["IntelliJ · Alt + Insert", "Generate → toString → selecionar campos → OK", "A IDE gera sintaxe; você decide utilidade, tamanho, sigilo e recursão."],
  }[tab];
  return <section className="ts120-stack"><div className="ts120-ecosystem"><nav><button type="button" className={tab === "collection" ? "active" : ""} onClick={() => setTab("collection")}>Coleção</button><button type="button" className={tab === "record" ? "active" : ""} onClick={() => setTab("record")}>Record</button><button type="button" className={tab === "ide" ? "active" : ""} onClick={() => setTab("ide")}>IntelliJ</button></nav><main><TerminalSquare size={30} /><span>{content[0]}</span><pre>{content[1]}</pre><p>{content[2]}</p>{tab === "ide" && <div className="ts120-ide-fields"><label><input type="checkbox" defaultChecked /> id</label><label><input type="checkbox" defaultChecked /> nome</label><label><input type="checkbox" /> senha</label><label><input type="checkbox" /> pedidos</label></div>}</main></div><CodePanel name="ToStringEcossistema120.java" code={ECOSYSTEM_SOURCE} /></section>;
}

function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [["println(cliente)", "String.valueOf(cliente)", "A chamada automática começa antes de aparecer no console."], ["cliente.toString()", "this = Cliente #10", "A IDE entra no método sobrescrito."], ["selecionar campos", "id · nome · email", "Só os campos escolhidos compõem o texto."], ["println(pedido)", "numero · status · total", "Cliente é omitido da visão técnica."], ["pedido.resumo()", "numero · cliente · status · total", "Outra intenção produz outro texto."], ["println(composto)", "cliente.id()", "O agregado evita incluir o Cliente inteiro."], ["pagamento.toString()", "codigo · valor", "Subobjeto curto participa com segurança."], ["println(lista)", "elemento[0].toString()", "Coleção delega a representação."], ["record.toString()", "todos os componentes", "Geração automática também exige revisão."], ["log seguro", "senha=*** · cpf=***-01", "A evidência ajuda sem vazar o segredo."]];
  const current = frames[step];
  return <section className="ts120-stack"><div className="ts120-debug"><div><button type="button" disabled={step === 0} onClick={() => setStep((x) => Math.max(0, x - 1))}><ArrowLeft size={15} />Voltar</button><button type="button" disabled={step === frames.length - 1} onClick={() => setStep((x) => Math.min(frames.length - 1, x + 1))}><StepForward size={15} />Step Into</button><span>{step + 1}/{frames.length}</span></div><section><aside>{frames.map((item, i) => <button type="button" className={i === step ? "active" : ""} onClick={() => setStep(i)} key={item[0] + i}><span>{i + 1}</span>{item[0]}</button>)}</aside><main><span>DEBUGGER · CALL STACK + CONSOLE</span><h3>{current[0]}</h3><code>{current[1]}</code><p>{current[2]}</p><div><b>Pergunte em cada pausa</b><small>Quem chamou? Quais campos entram? Algum dado deveria ser omitido ou mascarado?</small></div></main></section></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="ts120-stack"><div className="ts120-errors"><nav>{ERRORS.map((item, i) => <button type="button" className={i === selected ? "active" : ""} onClick={() => setSelected(i)} key={item[0]}><span>{i + 1}</span><span className="guided-error-label">{item[0]}</span></button>)}</nav><main><span><AlertTriangle size={16} />CASO {selected + 1} DE {ERRORS.length}</span><h3>{current[0]}</h3><section><div><b>Sintoma</b><p>{current[1]}</p></div><ArrowRight size={18} /><div><b>Como corrigir</b><p>{current[2]}</p></div></section></main></div></section>;
}

function DeliveryLab() {
  const [checked, setChecked] = useState(() => new Set());
  const tasks = ["Código OS-", "Telefone mascarado", "Período", "Texto técnico", "8 testes", "Git limpo"];
  const toggle = (i) => setChecked((current) => { const next = new Set(current); if (next.has(i)) next.delete(i); else next.add(i); return next; });
  return <section className="ts120-stack"><CodePanel name="ToStringOrdemServico120.java" code={OS_SOURCE} /><CodePanel name="TesteToString120.java" code={TEST_SOURCE} /><div className="guided-console"><div className="guided-console-title"><Play size={15} />Terminal</div><pre>{`> javac -encoding UTF-8 *.java
> java ToStringOrdemServico120
OrdemServico120{codigo=OS-2026-0001, clienteId=10, periodo=PeriodoOs120[data=2026-07-20, turno=MANHA], status=AGENDADA}
OS OS-2026-0001 para Ana Silva em 2026-07-20 no turno MANHA.
> java TesteToString120
8 testes passaram
> git add labs/m4/aula-120-to-string-com-criterio
> git commit -m "Aula 120: pratica toString com criterio"`}</pre></div><div className="ts120-checklist">{tasks.map((item, i) => <button type="button" className={checked.has(i) ? "done" : ""} onClick={() => toggle(i)} key={item}><span>{checked.has(i) ? <Check size={14} /> : i + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral da representação</h3></div><ul><li>Por que a OS mostra clienteId e não o Cliente inteiro?</li><li>Por que o telefone é mascarado no Cliente?</li><li>Qual diferença entre toString e resumo?</li><li>Quais mudanças de formato não podem afetar regras de negócio?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: "default", label: "Texto Padrão", duration: "13 min", eyebrow: "OBJECT, CLASSE E HASH HEXADECIMAL", title: "Transforme Cliente@5f184fc6 em evidência útil", blocks: [{ type: "lead", text: "Todo objeto já possui toString. Sem sobrescrita, a saída confirma a instância, mas quase nada diz sobre o estado que você investiga." }, { type: "default" }] },
  { id: "override", label: "Sobrescrita Guiada", duration: "15 min", eyebrow: "CHAMADA AUTOMÁTICA, ASSINATURA E CAMPOS", title: "Acompanhe println entrar no seu toString", blocks: [{ type: "lead", text: "@Override transforma um detalhe fácil de errar em contrato verificado pelo compilador: public String toString(), sem parâmetros." }, { type: "override" }] },
  { id: "intention", label: "Três Intenções", duration: "13 min", eyebrow: "TÉCNICO, APRESENTAÇÃO E REGRA", title: "Separe toString, resumo e comportamento", blocks: [{ type: "lead", text: "Textos parecidos podem servir a públicos diferentes; regra de negócio não pode depender de uma representação mutável." }, { type: "intention" }] },
  { id: "values", label: "Email e Dinheiro", duration: "14 min", eyebrow: "OBJETO DE VALOR CURTO E LEGÍVEL", title: "Represente valores sem carregar ruído estrutural", blocks: [{ type: "lead", text: "Email normalizado e Dinheiro com escala definida podem oferecer textos diretos porque o próprio valor já comunica o significado." }, { type: "values" }] },
  { id: "privacy", label: "Barreira de Sigilo", duration: "16 min", eyebrow: "SENHA, CPF, TOKEN E LOG", title: "Veja um dado existir sem aparecer na saída", blocks: [{ type: "lead", text: "toString costuma chegar a logs, monitoramento e suporte. O objeto pode armazenar um segredo sem reproduzi-lo na representação." }, { type: "privacy" }] },
  { id: "entity", label: "Entidade e Resumo", duration: "15 min", eyebrow: "IDENTIDADE, ESTADO PRINCIPAL E PÚBLICO", title: "Mantenha o Pedido curto sem empobrecer o domínio", blocks: [{ type: "lead", text: "A visão técnica prioriza número, status e total; a visão amigável acrescenta o cliente. Nenhuma delas decide se o pedido pode ser pago." }, { type: "entity" }] },
  { id: "composition", label: "Composição Segura", duration: "16 min", eyebrow: "SUBOBJETO, ID E REFERÊNCIA CIRCULAR", title: "Escolha até onde o texto atravessa o grafo", blocks: [{ type: "lead", text: "Incluir um subobjeto chama o toString dele. Prefira ids e representações pequenas para evitar vazamento, ruído e recursão infinita." }, { type: "composition" }] },
  { id: "ecosystem", label: "Coleção, Record e IDE", duration: "15 min", eyebrow: "DELEGAÇÃO E GERAÇÃO AUTOMÁTICA", title: "Revise tudo o que o Java e a IDE imprimem por você", blocks: [{ type: "lead", text: "Coleções delegam aos elementos; records expõem componentes; o IntelliJ gera código. Em todos os casos, o critério continua sendo seu." }, { type: "ecosystem" }] },
  { id: "debug", label: "Debug da Representação", duration: "15 min", eyebrow: "DEZ PAUSAS ENTRE OBJETO E CONSOLE", title: "Entre em cada chamada automática de toString", blocks: [{ type: "lead", text: "Siga println, entidade, resumo, composição, coleção e record, conferindo campos incluídos, omitidos e mascarados." }, { type: "debug" }] },
  { id: "errors", label: "Clínica de Erros", duration: "12 min", eyebrow: "OITO VAZAMENTOS E CONFUSÕES", title: "Diagnostique representações perigosas", blocks: [{ type: "lead", text: "Cada caso conecta uma saída ruim ao problema de intenção, segurança, assinatura, tamanho ou composição." }, { type: "errors" }] },
  { id: "delivery", label: "Entrega & OS", duration: "25 min", eyebrow: "LOCALDATE, ENUMS, MÁSCARA, TESTES E GIT", title: "Entregue uma Ordem de Serviço útil e segura", blocks: [{ type: "lead", text: "A OS final separa texto técnico e resumo amigável, expõe somente clienteId e prova a máscara de telefone com oito testes." }, { type: "delivery" }] },
];

function ContentBlock({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = { default: DefaultLab, override: OverrideLab, intention: IntentionLab, values: ValueLab, privacy: PrivacyLab, entity: EntityLab, composition: CompositionLab, ecosystem: EcosystemLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = map[block.type]; return Component ? <Component /> : null;
}

export default function GuidedToStringLesson120({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-to-string-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Eye size={17} />Laboratório de representação segura</span><p className="guided-sequence">120 · M4.16</p><h1>Mostre o que ajuda; esconda o que não pode vazar</h1><p>Acompanhe o Java chamar toString, separe texto técnico de resumo, masque segredos e controle entidade, composição, coleção, record e Ordem de Serviço.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header>
    <GuidedLessonFacts ariaLabel="Resumo da aula 120" items={[{ value: "10 fontes", label: "Compiladas em conjunto" }, { value: "10 pausas", label: "No debug da representação" }, { value: "8 casos", label: "Na clínica de erros" }]} />
    <div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 120"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? "active " : "") + (completedSteps.has(item.id) ? "done" : "")} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + "-" + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={"step-toggle " + (stepDone ? "undo" : "complete")} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>
        {allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Representação útil e segura comprovada</h3><p>{lessonComplete ? "Aula concluída: avance para static com critério." : "Execute a OS e os oito testes antes de concluir."}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? "Reabrir aula" : "Concluir aula"}</button></section>}
      </main></div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 119</button><div className={"guided-course-status " + (lessonComplete ? "completed" : allStepsDone ? "ready" : "")}><Clock3 size={18} /><span><strong>{lessonComplete ? "Aula concluída" : completedSteps.size + " de " + steps.length + " etapas"}</strong><small>toString, resumo, sigilo, composição e logs</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 121<ArrowRight size={17} /></button></footer>
  </article>;
}
