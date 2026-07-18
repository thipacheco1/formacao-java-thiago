import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Database,
  FileCode2,
  Fingerprint,
  GitCompareArrows,
  ListChecks,
  Play,
  RotateCcw,
  ScanSearch,
  Sparkles,
  StepForward,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedObjectIdentityLesson.css";

const STORAGE_KEY = "guided-object-identity-lesson-118-progress";

const SAME_REFERENCE_SOURCE = `public class MesmaReferencia {
    public static void main(String[] args) {
        ClienteMesmaReferencia original = new ClienteMesmaReferencia(10, "Ana Silva", "ana@email.com");
        ClienteMesmaReferencia apelido = original;

        System.out.println("Antes: " + original.resumo());
        apelido.alterarEmail("ana.novo@email.com");
        System.out.println("Original: " + original.resumo());
        System.out.println("Apelido:  " + apelido.resumo());
        System.out.println("original == apelido: " + (original == apelido));
    }
}
class ClienteMesmaReferencia {
    private final int id; private final String nome; private String email;
    ClienteMesmaReferencia(int id, String nome, String email) {
        if (id <= 0 || nome == null || nome.isBlank() || email == null || !email.contains("@"))
            throw new IllegalArgumentException("Cliente inválido.");
        this.id = id; this.nome = nome; this.email = email;
    }
    void alterarEmail(String novo) {
        if (novo == null || !novo.contains("@")) throw new IllegalArgumentException("E-mail inválido.");
        email = novo;
    }
    String resumo() { return "Cliente " + id + " | " + nome + " | " + email; }
}`;

const DIFFERENT_OBJECTS_SOURCE = `public class ObjetosDiferentesMesmoDados {
    public static void main(String[] args) {
        ClienteMesmoDados cliente1 = new ClienteMesmoDados(10, "Ana Silva", "ana@email.com");
        ClienteMesmoDados cliente2 = new ClienteMesmoDados(10, "Ana Silva", "ana@email.com");
        ClienteMesmoDados cliente3 = new ClienteMesmoDados(25, "Ana Silva", "ana@email.com");

        System.out.println("cliente1 == cliente2: " + (cliente1 == cliente2));
        System.out.println("cliente1.mesmaIdentidade(cliente2): " + cliente1.mesmaIdentidade(cliente2));
        System.out.println("cliente1.mesmaIdentidade(cliente3): " + cliente1.mesmaIdentidade(cliente3));
    }
}
class ClienteMesmoDados {
    private final int id; private final String nome; private final String email;
    ClienteMesmoDados(int id, String nome, String email) {
        if (id <= 0 || nome == null || nome.isBlank() || email == null || !email.contains("@"))
            throw new IllegalArgumentException("Cliente inválido.");
        this.id = id; this.nome = nome; this.email = email;
    }
    boolean mesmaIdentidade(ClienteMesmoDados outro) { return outro != null && id == outro.id; }
}`;

const ORDER_SOURCE = `public class EntidadeMesmaIdentidade {
    public static void main(String[] args) {
        PedidoIdentidade pedido = new PedidoIdentidade(1001, "Ana Silva");
        System.out.println(pedido.resumo());
        pedido.confirmarPagamento(); System.out.println(pedido.resumo());
        pedido.enviar(); System.out.println(pedido.resumo());
        System.out.println("Identidade: " + pedido.numero());
    }
}
enum StatusPedidoIdentidade { CRIADO, PAGO, ENVIADO, CANCELADO }
class PedidoIdentidade {
    private final int numero; private final String cliente; private StatusPedidoIdentidade status;
    PedidoIdentidade(int numero, String cliente) {
        if (numero <= 0 || cliente == null || cliente.isBlank()) throw new IllegalArgumentException();
        this.numero = numero; this.cliente = cliente; status = StatusPedidoIdentidade.CRIADO;
    }
    int numero() { return numero; }
    void confirmarPagamento() {
        if (status != StatusPedidoIdentidade.CRIADO) throw new IllegalStateException("Somente criado pode ser pago.");
        status = StatusPedidoIdentidade.PAGO;
    }
    void enviar() {
        if (status != StatusPedidoIdentidade.PAGO) throw new IllegalStateException("Somente pago pode ser enviado.");
        status = StatusPedidoIdentidade.ENVIADO;
    }
    String resumo() { return "Pedido " + numero + " | " + cliente + " | " + status; }
}`;

const VALUE_SOURCE = `public class ValorMesmosDados {
    public static void main(String[] args) {
        EmailIdentidadeValor email1 = new EmailIdentidadeValor("Ana@Email.com");
        EmailIdentidadeValor email2 = new EmailIdentidadeValor("ana@email.com");
        System.out.println("email1 == email2: " + (email1 == email2));
        System.out.println("email1.mesmoValor(email2): " + email1.mesmoValor(email2));
        System.out.println(email1.valor() + " | " + email2.valor());
    }
}
class EmailIdentidadeValor {
    private final String valor;
    EmailIdentidadeValor(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@")) throw new IllegalArgumentException("E-mail inválido.");
        this.valor = valor.trim().toLowerCase();
    }
    String valor() { return valor; }
    boolean mesmoValor(EmailIdentidadeValor outro) { return outro != null && valor.equals(outro.valor); }
}`;

const STRING_SOURCE = `public class StringReferencia {
    public static void main(String[] args) {
        String texto1 = new String("java");
        String texto2 = new String("java");
        String texto3 = "java";
        String texto4 = "java";

        System.out.println("new: == " + (texto1 == texto2));
        System.out.println("new: equals " + texto1.equals(texto2));
        System.out.println("pool: == " + (texto3 == texto4));
        System.out.println("pool: equals " + texto3.equals(texto4));
    }
}`;

const OS_SOURCE = `import java.time.LocalDate;
public class IdentidadeOrdemServico {
    public static void main(String[] args) {
        OrdemServicoIdentidade os1 = new OrdemServicoIdentidade(new CodigoOsIdentidade("OS-2026-0001"), "Ana", LocalDate.of(2026, 7, 20));
        OrdemServicoIdentidade os2 = new OrdemServicoIdentidade(new CodigoOsIdentidade("OS-2026-0001"), "Ana", LocalDate.of(2026, 7, 22));
        System.out.println("os1 == os2: " + (os1 == os2));
        System.out.println("os1.mesmaIdentidade(os2): " + os1.mesmaIdentidade(os2));
        System.out.println(os1.resumo()); System.out.println(os2.resumo());
    }
}
class OrdemServicoIdentidade {
    private final CodigoOsIdentidade codigo; private final String cliente; private final LocalDate data;
    OrdemServicoIdentidade(CodigoOsIdentidade codigo, String cliente, LocalDate data) {
        if (codigo == null || cliente == null || cliente.isBlank() || data == null) throw new IllegalArgumentException();
        this.codigo = codigo; this.cliente = cliente; this.data = data;
    }
    boolean mesmaIdentidade(OrdemServicoIdentidade outra) { return outra != null && codigo.mesmoValor(outra.codigo); }
    String resumo() { return codigo.valor() + " | " + cliente + " | " + data; }
}
class CodigoOsIdentidade {
    private final String valor;
    CodigoOsIdentidade(String valor) {
        if (valor == null || !valor.startsWith("OS-")) throw new IllegalArgumentException("Código deve iniciar com OS-.");
        this.valor = valor;
    }
    String valor() { return valor; }
    boolean mesmoValor(CodigoOsIdentidade outro) { return outro != null && valor.equals(outro.valor); }
}`;

const PRODUCT_SOURCE = `public class IdentidadeProduto {
    public static void main(String[] args) {
        ProdutoIdentidade p1 = new ProdutoIdentidade(new CodigoProdutoIdentidade("PROD-001"), "Cadeira", 10);
        ProdutoIdentidade p2 = new ProdutoIdentidade(new CodigoProdutoIdentidade("PROD-001"), "Cadeira premium", 4);
        ProdutoIdentidade p3 = new ProdutoIdentidade(new CodigoProdutoIdentidade("PROD-002"), "Mesa", 2);
        System.out.println("p1 == p2: " + (p1 == p2));
        System.out.println("p1 mesma identidade p2: " + p1.mesmaIdentidade(p2));
        System.out.println("p1 mesma identidade p3: " + p1.mesmaIdentidade(p3));
        p1.vender(3); p1.inativar("Catálogo"); p1.reativar(); System.out.println(p1.resumo());
    }
}
enum StatusProdutoIdentidade { ATIVO, INATIVO }
record CodigoProdutoIdentidade(String valor) {
    CodigoProdutoIdentidade {
        if (valor == null || valor.isBlank() || !valor.startsWith("PROD-"))
            throw new IllegalArgumentException("Código deve iniciar com PROD-.");
    }
    boolean mesmoValor(CodigoProdutoIdentidade outro) { return outro != null && valor.equals(outro.valor); }
}
class ProdutoIdentidade {
    private final CodigoProdutoIdentidade codigo; private final String nome; private int estoque;
    private StatusProdutoIdentidade status = StatusProdutoIdentidade.ATIVO; private String motivo = "";
    ProdutoIdentidade(CodigoProdutoIdentidade codigo, String nome, int estoque) {
        if (codigo == null || nome == null || nome.isBlank() || estoque < 0) throw new IllegalArgumentException();
        this.codigo = codigo; this.nome = nome; this.estoque = estoque;
    }
    boolean mesmaIdentidade(ProdutoIdentidade outro) { return outro != null && codigo.mesmoValor(outro.codigo); }
    void vender(int quantidade) {
        if (status != StatusProdutoIdentidade.ATIVO || quantidade <= 0 || quantidade > estoque)
            throw new IllegalStateException("Venda inválida.");
        estoque -= quantidade;
    }
    void inativar(String motivo) { if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException(); status = StatusProdutoIdentidade.INATIVO; this.motivo = motivo; }
    void reativar() { status = StatusProdutoIdentidade.ATIVO; motivo = ""; }
    String resumo() { return codigo.valor() + " | " + nome + " | estoque=" + estoque + " | " + status + " | " + motivo; }
}`;

const TEST_SOURCE = `public class TesteIdentidadeObjetos {
    public static void main(String[] args) {
        ClienteMesmoDados a = new ClienteMesmoDados(10, "Ana", "ana@email.com");
        ClienteMesmoDados b = new ClienteMesmoDados(10, "Ana Souza", "novo@email.com");
        assertFalse(a == b, "referências distintas"); assertTrue(a.mesmaIdentidade(b), "mesmo id");
        EmailIdentidadeValor e1 = new EmailIdentidadeValor("ANA@EMAIL.COM");
        EmailIdentidadeValor e2 = new EmailIdentidadeValor("ana@email.com");
        assertFalse(e1 == e2, "valores são objetos distintos"); assertTrue(e1.mesmoValor(e2), "valor normalizado");
        ProdutoIdentidade p1 = new ProdutoIdentidade(new CodigoProdutoIdentidade("PROD-001"), "A", 2);
        ProdutoIdentidade p2 = new ProdutoIdentidade(new CodigoProdutoIdentidade("PROD-001"), "B", 0);
        ProdutoIdentidade p3 = new ProdutoIdentidade(new CodigoProdutoIdentidade("PROD-002"), "C", 1);
        assertTrue(p1.mesmaIdentidade(p2), "mesmo código"); assertFalse(p1.mesmaIdentidade(p3), "código diferente");
        p1.vender(2); expectState(() -> p1.vender(1), "estoque protegido");
        p1.inativar("fim"); expectState(() -> p1.vender(1), "inativo não vende");
        System.out.println("8 testes passaram");
    }
    static void assertTrue(boolean v, String c) { if (!v) throw new AssertionError(c); }
    static void assertFalse(boolean v, String c) { assertTrue(!v, c); }
    static void expectState(Runnable r, String c) { try { r.run(); throw new AssertionError(c); } catch (IllegalStateException ok) {} }
}`;

const ERRORS = [
  ["Usar == como conteúdo", "Dois objetos com os mesmos dados retornam false.", "Leia == como: apontam para a mesma instância?"],
  ["Confundir alias com cópia", "Alterar a segunda variável surpreende a primeira.", "Conte os new: uma atribuição só copia a referência."],
  ["Mesmos dados = mesma entidade", "Duas Anas viram uma pessoa só.", "Compare a identidade estável, não a aparência."],
  ["Entidade como valor", "A troca de estado parece criar outro Pedido.", "Mantenha número/id e acompanhe seu ciclo."],
  ["Valor como entidade", "Email recebe id artificial e setter.", "Compare o conteúdo normalizado e substitua o valor inteiro."],
  ["Identidade mutável", "setCodigo transforma uma OS em outra.", "Torne id/código final e não exponha setter."],
  ["String com ==", "O teste passa com literal e falha com new String.", "Compare conteúdo com equals; o pool é detalhe de implementação."],
  ["Novo objeto sem id", "Dois cadastros ainda não salvos parecem iguais por null.", "Sem identidade atribuída, não os trate como a mesma entidade."],
];

const EVIDENCE = `# Aula 118 — Identidade de objetos
- [ ] Desenhei referência, objeto e Heap
- [ ] Provei um new com duas referências
- [ ] Provei dois new com o mesmo id
- [ ] Separei referência, entidade e valor
- [ ] Mantive Pedido 1001 durante o ciclo
- [ ] Normalizei e comparei Email por valor
- [ ] Expliquei a armadilha do pool de String
- [ ] Tratei entidade ainda sem id
- [ ] Depurei dez decisões de identidade
- [ ] Diagnostiquei oito erros
- [ ] Entreguei Produto, oito testes e Git limpo`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? "Copiado" : "Copiar"}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{code}</SyntaxHighlighter></section>;
}

function ReferenceLab() {
  const [changed, setChanged] = useState(false);
  return <section className="oi118-stack">
    <div className="oi118-memory">
      <div className="oi118-vars"><h3>Stack · variáveis</h3><button type="button" className="active"><span>original</span><b>@Cliente10</b></button><button type="button" className="active"><span>apelido</span><b>@Cliente10</b></button></div>
      <div className="oi118-arrows"><ArrowRight /><ArrowRight /></div>
      <div className="oi118-heap"><span>Heap · 1 objeto</span><Fingerprint size={30} /><strong>Cliente #10</strong><small>Ana Silva</small><code>{changed ? "ana.novo@email.com" : "ana@email.com"}</code></div>
    </div>
    <div className="oi118-actions"><button type="button" onClick={() => setChanged(true)}>Alterar pelo apelido</button><button type="button" onClick={() => setChanged(false)}>Reiniciar</button><p><b>original == apelido → true</b><br />Não houve cópia do Cliente: duas referências alcançam a mesma instância.</p></div>
    <CodePanel name="MesmaReferencia.java" code={SAME_REFERENCE_SOURCE} />
  </section>;
}

function TwoObjectsLab() {
  const [selected, setSelected] = useState("reference");
  const result = selected === "reference" ? ["false", "Dois new criaram duas instâncias."] : ["true", "Os dois ids 10 representam o mesmo Cliente no domínio."];
  return <section className="oi118-stack">
    <div className="oi118-two-objects"><div><span>@A1</span><strong>Cliente #10</strong><small>Ana · ana@email.com</small></div><div><span>@B7</span><strong>Cliente #10</strong><small>Ana · ana@email.com</small></div></div>
    <div className="oi118-compare"><div><button type="button" className={selected === "reference" ? "active" : ""} onClick={() => setSelected("reference")}>cliente1 == cliente2</button><button type="button" className={selected === "identity" ? "active" : ""} onClick={() => setSelected("identity")}>mesmaIdentidade</button></div><strong>{result[0]}</strong><p>{result[1]}</p></div>
    <CodePanel name="ObjetosDiferentesMesmoDados.java" code={DIFFERENT_OBJECTS_SOURCE} />
  </section>;
}

function ComparisonLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    ["Referência", "mesma instância?", "a == b", "Endereço conceitual na memória", "@A1 = @A1"],
    ["Entidade", "mesma coisa no domínio?", "a.mesmaIdentidade(b)", "id, código, número ou UUID", "Cliente #10 = Cliente #10"],
    ["Valor", "mesmo significado?", "a.mesmoValor(b)", "todos os dados normalizados", "ANA@EMAIL = ana@email"],
  ];
  const c = cases[selected];
  return <section className="oi118-stack"><div className="oi118-triangle"><div className="oi118-triangle-map">{cases.map((x, i) => <button type="button" className={i === selected ? "active" : ""} onClick={() => setSelected(i)} key={x[0]}><span>{i + 1}</span>{x[0]}</button>)}<svg viewBox="0 0 320 190" role="img" aria-label="Triângulo entre referência, entidade e valor"><path d="M160 22 29 165h262Z" /><circle cx="160" cy="22" r="10" /><circle cx="29" cy="165" r="10" /><circle cx="291" cy="165" r="10" /></svg></div><main><span>PERGUNTA</span><h3>{c[1]}</h3><code>{c[2]}</code><dl><div><dt>Critério</dt><dd>{c[3]}</dd></div><div><dt>Exemplo</dt><dd>{c[4]}</dd></div></dl></main></div><p className="guided-note"><GitCompareArrows size={18} /><span>Os três resultados são legítimos porque respondem perguntas diferentes. Primeiro nomeie a pergunta; depois escolha a comparação.</span></p></section>;
}

function EntityCycleLab() {
  const states = ["CRIADO", "PAGO", "ENVIADO"];
  const [index, setIndex] = useState(0);
  return <section className="oi118-stack"><div className="oi118-cycle"><div className="oi118-id-card"><Fingerprint size={28} /><span>IDENTIDADE FINAL</span><strong>Pedido #1001</strong><small>não muda</small></div><div><div className="oi118-state-line">{states.map((s, i) => <span className={i === index ? "active" : i < index ? "done" : ""} key={s}>{s}</span>)}</div><p>Estado observado: <b>{states[index]}</b></p><button type="button" disabled={index === states.length - 1} onClick={() => setIndex((x) => Math.min(states.length - 1, x + 1))}>Executar próxima transição</button><button type="button" onClick={() => setIndex(0)}>Reiniciar</button></div></div><CodePanel name="EntidadeMesmaIdentidade.java" code={ORDER_SOURCE} /></section>;
}

function ValueLab() {
  const [raw, setRaw] = useState("Ana@Email.com ");
  const normalized = raw.trim().toLowerCase();
  const valid = normalized.includes("@") && normalized.length > 3;
  return <section className="oi118-stack"><div className="oi118-normalizer"><label>Valor recebido<input value={raw} onChange={(e) => setRaw(e.target.value)} /></label><ArrowRight /><div><span>normalizar</span><code>{valid ? normalized : "e-mail inválido"}</code></div><ArrowRight /><div><span>comparar com</span><code>ana@email.com</code><b>{valid && normalized === "ana@email.com" ? "mesmo valor" : "valor diferente"}</b></div></div><p className="guided-note"><ScanSearch size={18} /><span><strong>Duas instâncias, um significado:</strong> <code>email1 == email2</code> é false; <code>mesmoValor</code> é true após normalizar.</span></p><CodePanel name="ValorMesmosDados.java" code={VALUE_SOURCE} /></section>;
}

function StringLab() {
  const [mode, setMode] = useState("new");
  const literal = mode === "literal";
  return <section className="oi118-stack"><div className="oi118-string"><nav><button type="button" className={!literal ? "active" : ""} onClick={() => setMode("new")}>new String("java")</button><button type="button" className={literal ? "active" : ""} onClick={() => setMode("literal")}>literal "java"</button></nav><main><div className="oi118-string-objects"><span>{literal ? "pool @P1" : "Heap @A1"}</span><span>{literal ? "pool @P1" : "Heap @B7"}</span></div><dl><div><dt>==</dt><dd>{String(literal)}</dd></div><div><dt>equals</dt><dd>true</dd></div></dl><p>{literal ? "O pool pode reutilizar a instância. Isso não transforma == em comparação de conteúdo." : "Cada new cria outra instância; o conteúdo continua equivalente."}</p></main></div><CodePanel name="StringReferencia.java" code={STRING_SOURCE} /></section>;
}

function PersistenceLab() {
  const [saved, setSaved] = useState(false);
  return <section className="oi118-stack"><div className="oi118-persistence"><div className={!saved ? "active" : ""}><span>1 · memória</span><Fingerprint /><strong>Cliente</strong><code>id = null</code><small>não presuma igualdade por null</small></div><ArrowRight /><div className={saved ? "active" : ""}><span>2 · persistência</span><Database /><strong>Cliente #10</strong><code>id = 10</code><small>identidade atribuída e estável</small></div></div><button type="button" className="oi118-save" onClick={() => setSaved((x) => !x)}>{saved ? "Voltar ao objeto novo" : "Simular persistência"}</button><p className="guided-note"><AlertTriangle size={18} /><span>Esta é uma regra inicial. JPA e persistência exigirão critérios mais detalhados; por enquanto, dois ids nulos não provam mesma entidade.</span></p><CodePanel name="IdentidadeOrdemServico.java" code={OS_SOURCE} /></section>;
}

function StableIdentityLab() {
  const [status, setStatus] = useState("AGENDADA");
  const [message, setMessage] = useState("A OS nasceu com código estável.");
  const act = (next) => {
    if (["CONCLUIDA", "CANCELADA"].includes(status)) setMessage("Bloqueado: a OS já encerrou seu ciclo.");
    else { setStatus(next); setMessage(`Estado mudou para ${next}; código permaneceu OS-2026-0001.`); }
  };
  return <section className="oi118-stack"><div className="oi118-os"><header><Fingerprint /><div><span>IDENTIDADE</span><strong>OS-2026-0001</strong></div></header><main><span>ESTADO MUTÁVEL</span><strong>{status}</strong><div><button type="button" onClick={() => act("REAGENDADA")}>Reagendar</button><button type="button" onClick={() => act("CONCLUIDA")}>Concluir</button><button type="button" onClick={() => act("CANCELADA")}>Cancelar</button><button type="button" onClick={() => { setStatus("AGENDADA"); setMessage("Reiniciada."); }}>Reiniciar</button></div><p>{message}</p></main></div><div className="oi118-code-contrast"><div><span>PROTEGIDO</span><code>private final CodigoOs codigo;</code></div><div><span>PERIGOSO</span><code>void setCodigo(String novo)</code></div></div></section>;
}

function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    ["new Cliente(...)", "cliente1 = @A1", "Um new cria a primeira instância."],
    ["cliente2 = cliente1", "cliente2 = @A1", "Atribuição copia a referência, não o objeto."],
    ["cliente1 == cliente2", "@A1 == @A1 → true", "As variáveis alcançam a mesma instância."],
    ["new Cliente(10,...)", "cliente3 = @B7", "Outro new cria outro objeto."],
    ["cliente1 == cliente3", "@A1 == @B7 → false", "Referências são diferentes."],
    ["mesmaIdentidade", "10 == 10 → true", "As instâncias representam a mesma entidade."],
    ["new Email(ANA@...)", "email1 = @E2", "O valor será normalizado."],
    ["new Email(ana@...)", "email2 = @E9", "Instância distinta, conteúdo equivalente."],
    ["email1.mesmoValor", "ana@email == ana@email", "Valor é comparado pelo significado."],
    ["OS persistida", "codigo final = OS-2026-0001", "Estado muda; identidade não recebe setter."],
  ];
  const c = frames[step];
  return <section className="oi118-stack"><div className="oi118-debug"><div><button type="button" disabled={step === 0} onClick={() => setStep((x) => Math.max(0, x - 1))}><ArrowLeft size={15} />Voltar</button><button type="button" disabled={step === frames.length - 1} onClick={() => setStep((x) => Math.min(frames.length - 1, x + 1))}><StepForward size={15} />Step Into</button><span>{step + 1}/{frames.length}</span></div><section><aside>{frames.map((x, i) => <button type="button" className={i === step ? "active" : ""} onClick={() => setStep(i)} key={x[0] + i}><span>{i + 1}</span>{x[0]}</button>)}</aside><main><span>DEBUGGER · VARIABLES + HEAP</span><h3>{c[0]}</h3><code>{c[1]}</code><p>{c[2]}</p><div className="oi118-debug-question"><b>Pergunte em cada pausa</b><small>Mesma referência? Mesmo valor? Mesma identidade de domínio?</small></div></main></section></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const c = ERRORS[selected];
  return <section className="oi118-stack"><div className="oi118-errors"><nav>{ERRORS.map((x, i) => <button type="button" className={i === selected ? "active" : ""} onClick={() => setSelected(i)} key={x[0]}><span>{i + 1}</span><span className="guided-error-label">{x[0]}</span></button>)}</nav><main><span><AlertTriangle size={16} />CASO {selected + 1} DE {ERRORS.length}</span><h3>{c[0]}</h3><section><div><b>Sintoma</b><p>{c[1]}</p></div><ArrowRight size={18} /><div><b>Como corrigir</b><p>{c[2]}</p></div></section></main></div></section>;
}

function DeliveryLab() {
  const [checked, setChecked] = useState(() => new Set());
  const tasks = ["Código PROD-", "Mesma identidade", "Venda protegida", "Status", "8 testes", "Git limpo"];
  const toggle = (i) => setChecked((c) => { const n = new Set(c); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  return <section className="oi118-stack"><CodePanel name="IdentidadeProduto.java" code={PRODUCT_SOURCE} /><CodePanel name="TesteIdentidadeObjetos.java" code={TEST_SOURCE} /><div className="guided-console"><div className="guided-console-title"><Play size={15} />Terminal</div><pre>{`> javac -encoding UTF-8 MesmaReferencia.java ObjetosDiferentesMesmoDados.java EntidadeMesmaIdentidade.java ValorMesmosDados.java StringReferencia.java IdentidadeOrdemServico.java IdentidadeProduto.java TesteIdentidadeObjetos.java
> java IdentidadeProduto
p1 == p2: false
p1 mesma identidade p2: true
p1 mesma identidade p3: false
PROD-001 | Cadeira | estoque=7 | ATIVO
> java TesteIdentidadeObjetos
8 testes passaram
> git add labs/m4/aula-118-identidade-de-objetos
> git commit -m "Aula 118: pratica identidade de objetos"`}</pre></div><div className="oi118-checklist">{tasks.map((x, i) => <button type="button" className={checked.has(i) ? "done" : ""} onClick={() => toggle(i)} key={x}><span>{checked.has(i) ? <Check size={14} /> : i + 1}</span>{x}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral do Produto</h3></div><ul><li>Por que p1 e p2 não são a mesma referência?</li><li>Por que representam a mesma entidade?</li><li>Por que código é final e encapsulado em um valor?</li><li>O que acontece com a identidade quando estoque e status mudam?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: "reference", label: "Referência e Objeto", duration: "15 min", eyebrow: "STACK, HEAP, VARIÁVEL E INSTÂNCIA", title: "Veja duas variáveis alcançarem o mesmo Cliente", blocks: [{ type: "lead", text: "A variável guarda uma referência. Uma atribuição cria outro caminho para a mesma instância; somente new cria outro objeto." }, { type: "reference" }] },
  { id: "two-objects", label: "Dois new", duration: "14 min", eyebrow: "MESMOS DADOS, OBJETOS DIFERENTES", title: "Separe endereço de memória e identidade de domínio", blocks: [{ type: "lead", text: "Dois new produzem referências diferentes mesmo quando todos os dados e o id parecem iguais." }, { type: "two-objects" }] },
  { id: "comparison", label: "Três Comparações", duration: "13 min", eyebrow: "REFERÊNCIA, ENTIDADE E VALOR", title: "Faça a pergunta certa antes de escolher o operador", blocks: [{ type: "lead", text: "==, mesmaIdentidade e mesmoValor não competem: cada um responde uma pergunta diferente." }, { type: "comparison" }] },
  { id: "entity-cycle", label: "Pedido e Continuidade", duration: "14 min", eyebrow: "ESTADO MUDA; NÚMERO PERMANECE", title: "Acompanhe o Pedido 1001 atravessar três estados", blocks: [{ type: "lead", text: "A continuidade de uma entidade vem da identidade estável, não da imobilidade de seus atributos." }, { type: "entity-cycle" }] },
  { id: "value", label: "Igualdade de Valor", duration: "13 min", eyebrow: "NORMALIZAÇÃO E SIGNIFICADO", title: "Compare dois Emails pelo valor que carregam", blocks: [{ type: "lead", text: "Objetos de valor distintos podem ser equivalentes quando sua representação normalizada é a mesma." }, { type: "value" }] },
  { id: "string", label: "String sem Armadilha", duration: "12 min", eyebrow: "NEW, POOL, == E EQUALS", title: "Não deixe o pool de String ensinar a regra errada", blocks: [{ type: "lead", text: "Um literal pode compartilhar instância e mascarar o problema. Conteúdo de String não deve depender de ==." }, { type: "string" }] },
  { id: "persistence", label: "Antes e Depois do Id", duration: "15 min", eyebrow: "OBJETO NOVO E IDENTIDADE PERSISTIDA", title: "Trate com cuidado a entidade que ainda não recebeu id", blocks: [{ type: "lead", text: "Dois objetos com id null não se tornam a mesma entidade. A persistência atribui a identidade que depois deve permanecer estável." }, { type: "persistence" }] },
  { id: "stable", label: "Identidade Estável", duration: "13 min", eyebrow: "CÓDIGO FINAL, ESTADO MUTÁVEL", title: "Mude a OS sem permitir que ela vire outra OS", blocks: [{ type: "lead", text: "CodigoOs é um objeto de valor usado pela OrdemServico como identidade; status e data podem mudar sem trocar o código." }, { type: "stable" }] },
  { id: "debug", label: "Debug de Referências", duration: "15 min", eyebrow: "DEZ PAUSAS ENTRE STACK E HEAP", title: "Siga cada new, atribuição e comparação", blocks: [{ type: "lead", text: "Observe endereços conceituais, ids e valores lado a lado para nunca mais confundir as três igualdades." }, { type: "debug" }] },
  { id: "errors", label: "Clínica de Erros", duration: "12 min", eyebrow: "ALIASES, IDS, VALORES E STRING", title: "Diagnostique oito confusões de identidade", blocks: [{ type: "lead", text: "Cada correção começa nomeando se o problema é referência, identidade de domínio ou valor." }, { type: "errors" }] },
  { id: "delivery", label: "Entrega & Produto", duration: "24 min", eyebrow: "CÓDIGO, ESTOQUE, STATUS, TESTES E GIT", title: "Entregue Produto com identidade estável e comportamento", blocks: [{ type: "lead", text: "Três produtos provam referência, identidade e diferença; venda e status mudam sem alterar CodigoProduto." }, { type: "delivery" }] },
];

function ContentBlock({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = { reference: ReferenceLab, "two-objects": TwoObjectsLab, comparison: ComparisonLab, "entity-cycle": EntityCycleLab, value: ValueLab, string: StringLab, persistence: PersistenceLab, stable: StableIdentityLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const C = map[block.type]; return C ? <C /> : null;
}

export default function GuidedObjectIdentityLesson118({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const normalized = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); const ids = new Set(steps.map((x) => x.id)); return new Set(Array.isArray(saved) ? saved.filter((id) => ids.has(id)) : []); }
    catch { return new Set(); }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => { if (!normalized.current && isCompleted && completedSteps.size !== steps.length) { normalized.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => { const active = navRef.current?.querySelector("button.active"); if (active && window.matchMedia("(max-width: 900px)").matches) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); }, [activeIndex]);
  const step = steps[activeIndex], stepDone = completedSteps.has(step.id), allStepsDone = completedSteps.size === steps.length, lessonComplete = isCompleted && allStepsDone;
  const selectStep = (index) => { setActiveIndex(index); document.querySelector(".guided-layout")?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps((current) => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); };
  return <article className="guided-git-lesson guided-object-identity-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Fingerprint size={17} />Laboratório de identidade</span><p className="guided-sequence">118 · M4.14</p><h1>Referência, identidade e valor não são a mesma coisa</h1><p>Desenhe Stack e Heap, conte cada <code>new</code>, compare Cliente, Email, String, Pedido, Ordem de Serviço e Produto e prove exatamente o que permanece igual.</p></div><div className="guided-hero-status"><GitCompareArrows size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header>
    <GuidedLessonFacts ariaLabel="Resumo da aula 118" items={[{ value: "8 fontes", label: "Compiladas em conjunto" }, { value: "10 pausas", label: "No debug de referências" }, { value: "8 casos", label: "Na clínica de erros" }]} />
    <div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 118"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? "active " : "") + (completedSteps.has(item.id) ? "done" : "")} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + "-" + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={"step-toggle " + (stepDone ? "undo" : "complete")} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>
        {allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>As três igualdades estão separadas</h3><p>{lessonComplete ? "Aula concluída: avance para equals e hashCode." : "Execute Produto e os testes antes de concluir."}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? "Reabrir aula" : "Concluir aula"}</button></section>}
      </main></div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 117</button><div className={"guided-course-status " + (lessonComplete ? "completed" : allStepsDone ? "ready" : "")}><Clock3 size={18} /><span><strong>{lessonComplete ? "Aula concluída" : completedSteps.size + " de " + steps.length + " etapas"}</strong><small>Referência, identidade, valor, Heap e persistência</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 119<ArrowRight size={17} /></button></footer>
  </article>;
}
