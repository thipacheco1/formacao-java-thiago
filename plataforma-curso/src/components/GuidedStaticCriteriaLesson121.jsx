import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Boxes, Check, CheckCircle2, Clock3,
  Copy, FileCode2, Factory, Fingerprint, ListChecks, Play, RotateCcw,
  ShieldCheck, Sparkles, StepForward, TerminalSquare, Users,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedStaticCriteriaLesson.css";

const STORAGE_KEY = "guided-static-criteria-lesson-121-progress";

const OWNERSHIP_SOURCE = `public class StaticPertencimento121 {
    public static void main(String[] args) {
        ClienteContado121 ana = new ClienteContado121("Ana Silva");
        ClienteContado121 bia = new ClienteContado121("Bia Souza");

        System.out.println("Cliente #" + ana.getId() + ": " + ana.getNome());
        System.out.println("Cliente #" + bia.getId() + ": " + bia.getNome());
        System.out.println("Total da classe: " + ClienteContado121.getTotalCriados());
    }
}

class ClienteContado121 {
    private static int totalCriados;
    private final int id;
    private final String nome;

    ClienteContado121(String nome) {
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome obrigatório.");
        this.id = ++totalCriados;
        this.nome = nome.trim();
    }
    int getId() { return id; }
    String getNome() { return nome; }
    static int getTotalCriados() { return totalCriados; }
}`;

const CONSTANT_SOURCE = `public class StaticConstante121 {
    public static void main(String[] args) {
        System.out.println("Dias: " + PoliticaPrazo121.PRAZO_PADRAO_DIAS);
        System.out.println("Crítica: " + PoliticaPrazo121.prazoCritico(1));
    }
}

final class PoliticaPrazo121 {
    static final int PRAZO_PADRAO_DIAS = 5;
    private PoliticaPrazo121() { throw new AssertionError("Não instancie."); }
    static boolean prazoCritico(int dias) { return dias <= 1; }
}`;

const UTILITY_SOURCE = `public class StaticUtilitario121 {
    public static void main(String[] args) {
        System.out.println(TextoUtil121.normalizarNome("  ANA   SILVA  "));
        System.out.println(TextoUtil121.iniciais("Ana Silva"));
    }
}

final class TextoUtil121 {
    private TextoUtil121() { throw new AssertionError("Não instancie."); }
    static String normalizarNome(String valor) {
        if (valor == null || valor.isBlank()) throw new IllegalArgumentException("Nome obrigatório.");
        String[] partes = valor.trim().toLowerCase().split("\\s+");
        StringBuilder resultado = new StringBuilder();
        for (String parte : partes) {
            if (!resultado.isEmpty()) resultado.append(' ');
            resultado.append(Character.toUpperCase(parte.charAt(0))).append(parte.substring(1));
        }
        return resultado.toString();
    }
    static String iniciais(String valor) {
        String nome = normalizarNome(valor);
        StringBuilder resultado = new StringBuilder();
        for (String parte : nome.split(" ")) resultado.append(parte.charAt(0));
        return resultado.toString();
    }
}`;

const CONTEXT_SOURCE = `public class StaticContexto121 {
    public static void main(String[] args) {
        ClienteContexto121 cliente = new ClienteContexto121("Ana Silva");
        System.out.println("Cliente: " + cliente.getNome());
        System.out.println(ClienteContexto121.tipo());
    }
}

class ClienteContexto121 {
    private final String nome;
    ClienteContexto121(String nome) { this.nome = nome; }
    String getNome() { return nome; }
    static String tipo() { return "CLIENTE"; }
}`;

const INVALID_CONTEXT_SOURCE = `class ContextoInvalido121 {
    private String nome = "Ana Silva";
    static void imprimir() {
        System.out.println(nome); // ERRO: qual objeto forneceria nome?
    }
}`;

const FACTORY_SOURCE = `import java.time.LocalDate;

public class StaticFactory121 {
    public static void main(String[] args) {
        OrdemFactory121 ordem = OrdemFactory121.agendada(1001, LocalDate.of(2026, 7, 20));
        System.out.println(ordem.resumo());
    }
}

record OrdemFactory121(int numero, LocalDate data, String status) {
    OrdemFactory121 {
        if (numero <= 0 || data == null || status == null) throw new IllegalArgumentException("OS inválida.");
    }
    static OrdemFactory121 agendada(int numero, LocalDate data) {
        return new OrdemFactory121(numero, data, "AGENDADA");
    }
    String resumo() { return "OS " + numero + " em " + data + " — " + status; }
}`;

const GLOBAL_SOURCE = `public class StaticGlobalRuim121 {
    public static void main(String[] args) {
        RepositorioGlobal121.salvar("OS-1");
        System.out.println("Teste A encontrou: " + RepositorioGlobal121.quantidade());
        // O teste B começou sem reiniciar o processo.
        System.out.println("Teste B esperava 0 e encontrou: " + RepositorioGlobal121.quantidade());
    }
}

class RepositorioGlobal121 {
    private static final java.util.List<String> ORDENS = new java.util.ArrayList<>();
    static void salvar(String ordem) { ORDENS.add(ordem); }
    static int quantidade() { return ORDENS.size(); }
}`;

const DEPENDENCY_SOURCE = `public class StaticDependenciaExplicita121 {
    public static void main(String[] args) {
        ServicoOrdem121 testeA = new ServicoOrdem121(new RepositorioMemoria121());
        testeA.abrir("OS-1");
        System.out.println("Teste A encontrou: " + testeA.quantidade());

        ServicoOrdem121 testeB = new ServicoOrdem121(new RepositorioMemoria121());
        System.out.println("Teste B encontrou: " + testeB.quantidade());
    }
}
class RepositorioMemoria121 {
    private final java.util.List<String> ordens = new java.util.ArrayList<>();
    void salvar(String ordem) { ordens.add(ordem); }
    int quantidade() { return ordens.size(); }
}
class ServicoOrdem121 {
    private final RepositorioMemoria121 repositorio;
    ServicoOrdem121(RepositorioMemoria121 repositorio) { this.repositorio = repositorio; }
    void abrir(String ordem) { repositorio.salvar(ordem); }
    int quantidade() { return repositorio.quantidade(); }
}`;

const OS_SOURCE = `import java.time.LocalDate;

public class StaticOrdemServico121 {
    public static void main(String[] args) {
        OrdemServico121 ordem = OrdemServico121.agendar(1001, "Ana Silva", LocalDate.of(2026, 7, 20));
        System.out.println(ordem.resumo());
        ordem.reagendar(LocalDate.of(2026, 7, 22));
        System.out.println(ordem.resumo());
    }
}
enum StatusOs121 { AGENDADA, REAGENDADA }
class OrdemServico121 {
    static final int DIAS_MAXIMOS_REAGENDAMENTO = 30;
    private final int numero;
    private final String cliente;
    private LocalDate data;
    private StatusOs121 status;

    private OrdemServico121(int numero, String cliente, LocalDate data, StatusOs121 status) {
        if (numero <= 0 || cliente == null || cliente.isBlank() || data == null) throw new IllegalArgumentException("OS inválida.");
        this.numero = numero; this.cliente = TextoOs121.normalizar(cliente); this.data = data; this.status = status;
    }
    static OrdemServico121 agendar(int numero, String cliente, LocalDate data) {
        return new OrdemServico121(numero, cliente, data, StatusOs121.AGENDADA);
    }
    void reagendar(LocalDate novaData) {
        if (novaData == null || novaData.isBefore(data) || novaData.isAfter(data.plusDays(DIAS_MAXIMOS_REAGENDAMENTO)))
            throw new IllegalArgumentException("Nova data fora do prazo.");
        data = novaData; status = StatusOs121.REAGENDADA;
    }
    String resumo() { return "OS " + numero + " — " + cliente + " — " + data + " — " + status; }
    StatusOs121 getStatus() { return status; }
    LocalDate getData() { return data; }
}
final class TextoOs121 {
    private TextoOs121() { throw new AssertionError("Não instancie."); }
    static String normalizar(String texto) { return texto.trim().replaceAll("\\s+", " "); }
}`;

const TEST_SOURCE = `import java.time.LocalDate;

public class TesteStatic121 {
    private static int testes;
    public static void main(String[] args) {
        OrdemServico121 ordem = OrdemServico121.agendar(1001, "  Ana   Silva ", LocalDate.of(2026, 7, 20));
        check(ordem.resumo().contains("Ana Silva"));
        check(ordem.getStatus() == StatusOs121.AGENDADA);
        check(OrdemServico121.DIAS_MAXIMOS_REAGENDAMENTO == 30);
        ordem.reagendar(LocalDate.of(2026, 7, 22));
        check(ordem.getStatus() == StatusOs121.REAGENDADA);
        check(ordem.getData().equals(LocalDate.of(2026, 7, 22)));
        check(TextoOs121.normalizar(" A   B ").equals("A B"));
        expectError(() -> OrdemServico121.agendar(0, "Ana", LocalDate.now()));
        expectError(() -> ordem.reagendar(LocalDate.of(2027, 1, 1)));
        System.out.println(testes + " testes passaram");
    }
    private static void expectError(Runnable acao) {
        try { acao.run(); throw new AssertionError("Erro esperado."); }
        catch (IllegalArgumentException esperado) { testes++; }
    }
    private static void check(boolean condicao) { testes++; if (!condicao) throw new AssertionError("Falhou teste " + testes); }
}`;

const ERRORS = [
  ["Tudo vira static", "O código parece fácil de chamar, mas perde dono, estado e polimorfismo.", "Comece perguntando quem possui o dado ou comportamento: objeto ou classe."],
  ["Chamar static pela instância", "cliente.getTotalCriados() sugere que o total pertence àquele cliente.", "Use ClienteContado121.getTotalCriados() para tornar o dono visível."],
  ["Estado global mutável", "Um teste deixa dados que alteram o teste seguinte.", "Crie a dependência por instância e injete-a no serviço."],
  ["Regra de domínio em Utils", "Uma classe genérica acumula decisões sobre cliente, pedido e pagamento.", "Mantenha comportamento junto do tipo que protege a regra."],
  ["static final = imutável", "A referência não muda, mas uma List continua aceitando add e remove.", "Use valor realmente imutável ou exponha cópia/visão não modificável."],
  ["Contexto static lê this", "O compilador não sabe qual objeto forneceria o atributo.", "Receba o objeto como parâmetro ou use um método de instância."],
  ["Factory sem intenção", "criar(..., null, false, true) continua ambíguo.", "Dê nome ao cenário: agendada(...), cancelada(...), deRascunho(...)."],
  ["Dependência escondida", "Serviço chama repositório global sem declarar que depende dele.", "Receba a colaboração no construtor para testar e substituir conscientemente."],
];

const EVIDENCE = `# Aula 121 — static com critério
- [ ] Provei a diferença entre memória da classe e do objeto
- [ ] Expliquei por que main é static
- [ ] Modelei contador compartilhado e constante
- [ ] Diferenciei referência final de objeto imutável
- [ ] Criei utilitário puro com construtor privado
- [ ] Li o erro de contexto static
- [ ] Usei factory nomeada
- [ ] Reproduzi contaminação entre testes
- [ ] Substituí estado global por dependência explícita
- [ ] Entreguei Ordem de Serviço e 8 testes`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? "Copiado" : "Copiar"}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{code}</SyntaxHighlighter></section>;
}

function OwnershipLab() {
  const [objects, setObjects] = useState(["Ana Silva"]);
  const add = () => setObjects((current) => current.length >= 3 ? current : [...current, current.length === 1 ? "Bia Souza" : "Caio Lima"]);
  return <section className="st121-stack"><div className="st121-memory"><section><span>HEAP · OBJETOS</span><div>{objects.map((name, index) => <article key={name}><Fingerprint /><b>cliente{index + 1}</b><small>id = {index + 1}</small><small>nome = {name}</small></article>)}</div><button type="button" onClick={add} disabled={objects.length >= 3}>new Cliente(...)</button></section><ArrowRight /><section className="class-area"><span>ÁREA DA CLASSE</span><article><Users /><b>ClienteContado121</b><small>static totalCriados = {objects.length}</small></article><p>Há um <strong>id/nome por objeto</strong> e um único contador compartilhado.</p></section></div><CodePanel name="StaticPertencimento121.java" code={OWNERSHIP_SOURCE} /></section>;
}

function SharedCounterLab() {
  const [web, setWeb] = useState(1);
  const [imported, setImported] = useState(1);
  const total = web + imported;
  return <section className="st121-stack"><div className="st121-counter"><header><Users /><div><span>ClienteContado121</span><strong>static totalCriados = {total}</strong></div></header><main><section><b>Fluxo Cadastro</b><code>new Cliente("Ana")</code><strong>{web} objeto{web !== 1 ? "s" : ""}</strong><button type="button" onClick={() => setWeb((value) => value + 1)}>Criar no cadastro</button></section><span>mesma classe<br />mesmo processo</span><section><b>Fluxo Importação</b><code>new Cliente("Bia")</code><strong>{imported} objeto{imported !== 1 ? "s" : ""}</strong><button type="button" onClick={() => setImported((value) => value + 1)}>Criar na importação</button></section></main><footer><article><b>Serve para</b><p>Telemetria simples ou numeração didática dentro de um único processo.</p></article><article><b>Não substitui</b><p>Banco de dados, sequência distribuída ou estado que precisa sobreviver ao reinício.</p></article><article><b>Exige cuidado</b><p>Duas threads podem atualizar o contador ao mesmo tempo; concorrência será estudada mais adiante.</p></article></footer></div><CodePanel name="StaticPertencimento121.java" code={OWNERSHIP_SOURCE} /></section>;
}

function BootstrapLab() {
  const [step, setStep] = useState(0);
  const frames = [
    ["java Aplicacao", "A JVM recebe o nome da classe; ainda não existe objeto Aplicacao."],
    ["Carregar a classe", "O class loader encontra o bytecode e prepara membros static."],
    ["Localizar main", "A JVM procura public static void main(String[] args)."],
    ["Invocar sem new", "static permite iniciar o programa antes de qualquer instância."],
  ];
  return <section className="st121-stack"><div className="st121-bootstrap"><nav>{frames.map((frame, index) => <button type="button" className={step === index ? "active" : ""} onClick={() => setStep(index)} key={frame[0]}><span>{index + 1}</span>{frame[0]}</button>)}</nav><main><TerminalSquare /><span>BOOTSTRAP {step + 1}/4</span><h3>{frames[step][0]}</h3><p>{frames[step][1]}</p><code>{step < 2 ? "java Aplicacao" : "public static void main(String[] args)"}</code><button type="button" disabled={step === 3} onClick={() => setStep((value) => Math.min(3, value + 1))}>Avançar na JVM<StepForward size={16} /></button></main></div><p className="guided-note"><ShieldCheck size={18} /><span><code>main</code> ser static resolve a inicialização da aplicação; isso não transforma todos os outros métodos em static.</span></p></section>;
}

function ConstantLab() {
  const [mode, setMode] = useState("value");
  return <section className="st121-stack"><div className="st121-constant"><nav><button type="button" className={mode === "value" ? "active" : ""} onClick={() => setMode("value")}>Valor imutável</button><button type="button" className={mode === "list" ? "danger" : ""} onClick={() => setMode("list")}>Referência final</button></nav><main className={mode === "list" ? "danger" : "safe"}><span>{mode === "value" ? "CONSTANTE REAL" : "ARMADILHA"}</span><code>{mode === "value" ? "static final int PRAZO_PADRAO_DIAS = 5;" : "static final List<String> NOMES = new ArrayList<>();"}</code><p>{mode === "value" ? "O valor primitivo não pode ser trocado. O nome em UPPER_SNAKE_CASE anuncia a constante." : "NOMES não pode apontar para outra lista, mas NOMES.add(...) ainda altera o conteúdo."}</p></main></div><CodePanel name="StaticConstante121.java" code={CONSTANT_SOURCE} /></section>;
}

function UtilityLab() {
  const [input, setInput] = useState("  ANA   SILVA  ");
  const normalize = (value) => value.trim().toLowerCase().split(/\s+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  const result = normalize(input);
  return <section className="st121-stack"><div className="st121-utility"><section><span>ENTRADA</span><input value={input} onChange={(event) => setInput(event.target.value)} aria-label="Nome para normalizar" /></section><ArrowRight /><section><span>FUNÇÃO PURA</span><code>TextoUtil121.normalizarNome(...)</code><small>mesma entrada → mesma saída · sem estado</small></section><ArrowRight /><section><span>SAÍDA</span><strong>{result || "—"}</strong><small>{result ? result.split(" ").map((part) => part[0]).join("") : "—"}</small></section></div><div className="st121-criteria"><article><CheckCircle2 /><b>Bom utilitário</b><p>Operação pequena, genérica, determinística e sem dependência do domínio.</p></article><article><AlertTriangle /><b>Sinal de alerta</b><p>Se calcula desconto, aprova pedido ou muda cliente, provavelmente pertence ao domínio — não a uma Utils gigante.</p></article></div><CodePanel name="StaticUtilitario121.java" code={UTILITY_SOURCE} /></section>;
}

function ContextLab() {
  const [valid, setValid] = useState(false);
  return <section className="st121-stack"><div className="st121-context"><nav><button type="button" className={!valid ? "danger" : ""} onClick={() => setValid(false)}>static tenta ler nome</button><button type="button" className={valid ? "active" : ""} onClick={() => setValid(true)}>objeto fornece nome</button></nav><main className={valid ? "safe" : "danger"}><span>{valid ? "COMPILA" : "NÃO COMPILA"}</span><pre>{valid ? "ClienteContexto121 cliente = new ClienteContexto121(\"Ana Silva\");\nSystem.out.println(cliente.getNome());" : "static void imprimir() {\n    System.out.println(nome);\n}\n// non-static variable nome cannot be referenced..."}</pre><p>{valid ? "A referência cliente determina exatamente de qual instância o nome será lido." : "Não existe this em um contexto de classe. O compilador não escolhe Ana, Bia ou qualquer outro objeto."}</p></main></div><CodePanel name={valid ? "StaticContexto121.java" : "ContextoInvalido121.java"} code={valid ? CONTEXT_SOURCE : INVALID_CONTEXT_SOURCE} /></section>;
}

function FactoryLab() {
  const [choice, setChoice] = useState("factory");
  return <section className="st121-stack"><div className="st121-factory"><Factory /><section><button type="button" className={choice === "constructor" ? "active" : ""} onClick={() => setChoice("constructor")}>new Ordem(1001, data, "AGENDADA")</button><button type="button" className={choice === "factory" ? "active" : ""} onClick={() => setChoice("factory")}>Ordem.agendada(1001, data)</button></section><ArrowRight /><article><span>{choice === "factory" ? "INTENÇÃO VISÍVEL" : "DETALHES EXPOSTOS"}</span><b>OS 1001</b><small>2026-07-20 · AGENDADA</small><p>{choice === "factory" ? "A factory escolhe estado inicial válido e dá nome ao cenário." : "Quem chama precisa conhecer representação e combinação interna."}</p></article></div><CodePanel name="StaticFactory121.java" code={FACTORY_SOURCE} /></section>;
}

function GlobalLab() {
  const [count, setCount] = useState(0);
  const [isolated, setIsolated] = useState(false);
  const runA = () => setCount(1);
  return <section className="st121-stack"><div className="st121-global"><header><button type="button" className={!isolated ? "danger" : ""} onClick={() => { setIsolated(false); setCount(0); }}>Repositório static</button><button type="button" className={isolated ? "active" : ""} onClick={() => { setIsolated(true); setCount(0); }}>Dependência por instância</button></header><main><section><b>Teste A</b><button type="button" onClick={runA}><Play size={14} />salvar OS-1</button><code>encontrou: {count}</code></section><ArrowRight /><section className={!isolated && count ? "danger" : "safe"}><b>Teste B</b><small>esperava: 0</small><code>encontrou: {isolated ? 0 : count}</code><strong>{!isolated && count ? "CONTAMINADO" : "ISOLADO"}</strong></section></main><p>{isolated ? "Cada serviço recebeu um repositório novo. A dependência é visível, substituível e testável." : "Os dois testes compartilham o mesmo processo e a mesma lista global."}</p></div><CodePanel name={isolated ? "StaticDependenciaExplicita121.java" : "StaticGlobalRuim121.java"} code={isolated ? DEPENDENCY_SOURCE : GLOBAL_SOURCE} /></section>;
}

function DecisionLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    ["saldo do cliente", "INSTÂNCIA", "Cada cliente tem seu próprio saldo."],
    ["prazo máximo", "STATIC FINAL", "Uma política constante pertence à classe."],
    ["normalizar espaços", "STATIC PURO", "Não depende de estado nem identidade."],
    ["aprovar pedido", "INSTÂNCIA", "Usa e protege o estado daquele pedido."],
    ["Pedido.rascunho()", "FACTORY STATIC", "Nomeia uma criação válida do tipo."],
    ["repositório da aplicação", "DEPENDÊNCIA", "Estado mutável não deve ficar global e oculto."],
  ];
  const current = cases[selected];
  return <section className="st121-stack"><div className="st121-decision"><nav>{cases.map((item, index) => <button type="button" className={index === selected ? "active" : ""} onClick={() => setSelected(index)} key={item[0]}><span>{index + 1}</span>{item[0]}</button>)}</nav><main><Boxes /><span>PERGUNTA DE PROJETO</span><h3>Quem é o dono?</h3><code>{current[0]}</code><strong>{current[1]}</strong><p>{current[2]}</p></main></div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Regra de bolso</h3></div><p>Use static somente quando você consegue explicar por que o comportamento pertence à classe e não precisa da identidade, do estado nem de uma colaboração variável de um objeto.</p></section></section>;
}

function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    ["main", "JVM → StaticOrdemServico121.main", "Entrada static: ainda não existe OS."],
    ["factory", "OrdemServico121.agendar(...)", "A classe nomeia a construção."],
    ["constructor", "this = OrdemServico121 #1001", "Agora existe uma instância e this é válido."],
    ["normalizer", "TextoOs121.normalizar(cliente)", "Utilitário puro recebe tudo por parâmetro."],
    ["summary", "ordem.resumo()", "Método de instância lê número, cliente, data e status."],
  ];
  const current = frames[step];
  return <section className="st121-stack"><div className="st121-debug"><div><button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}><ArrowLeft size={15} />Voltar</button><button type="button" disabled={step === frames.length - 1} onClick={() => setStep((value) => Math.min(frames.length - 1, value + 1))}><StepForward size={15} />Step Into</button><span>{step + 1}/{frames.length}</span></div><section><aside>{frames.map((item, index) => <button type="button" className={index === step ? "active" : ""} onClick={() => setStep(index)} key={item[0]}><span>{index + 1}</span>{item[0]}</button>)}</aside><main><span>DEBUGGER · FRAMES E THIS</span><h3>{current[0]}</h3><code>{current[1]}</code><p>{current[2]}</p><div><b>{step < 2 || step === 3 ? "this = indisponível" : "this = OS #1001"}</b><small>Observe a mudança entre contexto da classe e contexto do objeto.</small></div></main></section></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="st121-stack"><div className="st121-errors"><nav>{ERRORS.map((item, index) => <button type="button" className={index === selected ? "active" : ""} onClick={() => setSelected(index)} key={item[0]}><span>{index + 1}</span><span className="guided-error-label">{item[0]}</span></button>)}</nav><main><span><AlertTriangle size={16} />CASO {selected + 1} DE {ERRORS.length}</span><h3>{current[0]}</h3><section><div><b>Sintoma</b><p>{current[1]}</p></div><ArrowRight size={18} /><div><b>Como corrigir</b><p>{current[2]}</p></div></section></main></div></section>;
}

function DeliveryLab() {
  const [checked, setChecked] = useState(() => new Set());
  const tasks = ["Factory agendar", "Constante", "Estado por OS", "Utilitário puro", "Reagendar", "8 testes"];
  const toggle = (index) => setChecked((current) => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next; });
  return <section className="st121-stack"><CodePanel name="StaticOrdemServico121.java" code={OS_SOURCE} /><CodePanel name="TesteStatic121.java" code={TEST_SOURCE} /><div className="guided-console"><div className="guided-console-title"><Play size={15} />Terminal</div><pre>{`> javac -encoding UTF-8 StaticOrdemServico121.java TesteStatic121.java
> java StaticOrdemServico121
OS 1001 — Ana Silva — 2026-07-20 — AGENDADA
OS 1001 — Ana Silva — 2026-07-22 — REAGENDADA
> java TesteStatic121
8 testes passaram
> git add labs/m4/aula-121-static-com-criterio
> git commit -m "Aula 121: usa static com criterio"`}</pre></div><div className="st121-checklist">{tasks.map((item, index) => <button type="button" className={checked.has(index) ? "done" : ""} onClick={() => toggle(index)} key={item}><span>{checked.has(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral da solução</h3></div><ul><li>Por que <code>agendar</code> é static e <code>reagendar</code> é de instância?</li><li>Por que a constante pertence à classe?</li><li>Por que o repositório não foi escondido em static?</li><li>O que continuaria correto com duas OS simultâneas?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: "ownership", label: "Classe ou Objeto", duration: "15 min", eyebrow: "MEMÓRIA, IDENTIDADE E PROPRIEDADE", title: "Veja quem realmente possui cada dado", blocks: [{ type: "lead", text: "Antes de escrever static, desenhe o dono. Nome e id pertencem a cada Cliente; o total criado é uma informação única da classe." }, { type: "ownership" }] },
  { id: "bootstrap", label: "main e a JVM", duration: "12 min", eyebrow: "BOOTSTRAP SEM INSTÂNCIA", title: "Acompanhe a JVM chegar ao main sem usar new", blocks: [{ type: "lead", text: "main é static porque a JVM precisa de um ponto de entrada antes de existir um objeto da aplicação. É uma necessidade de inicialização, não uma regra para o restante do sistema." }, { type: "bootstrap" }] },
  { id: "shared", label: "Contador Compartilhado", duration: "14 min", eyebrow: "UM CAMPO DA CLASSE, VÁRIAS INSTÂNCIAS", title: "Conte objetos sem fingir que o contador é individual", blocks: [{ type: "lead", text: "O contador prova o compartilhamento, mas também mostra o limite: estado static dura no processo, exige cuidado com concorrência e não deve virar banco de dados improvisado." }, { type: "counter" }] },
  { id: "constants", label: "Constantes e final", duration: "14 min", eyebrow: "VALOR FIXO, REFERÊNCIA FIXA E CONVENÇÃO", title: "Não confunda static final com imutabilidade profunda", blocks: [{ type: "lead", text: "Constantes dão nome a valores estáveis. Quando o campo aponta para um objeto mutável, como uma coleção, final fixa apenas a referência — não o conteúdo." }, { type: "constant" }] },
  { id: "utility", label: "Utilitário Pequeno", duration: "15 min", eyebrow: "FUNÇÃO PURA E CONSTRUTOR PRIVADO", title: "Use static para uma transformação que não tem dono individual", blocks: [{ type: "lead", text: "Normalizar texto pode ser static: recebe tudo por parâmetro, não usa estado e não precisa de identidade. O construtor privado impede instâncias sem sentido." }, { type: "utility" }] },
  { id: "context", label: "Contexto static", duration: "14 min", eyebrow: "THIS, ATRIBUTO DE INSTÂNCIA E COMPILADOR", title: "Leia o erro que impede a classe de adivinhar um objeto", blocks: [{ type: "lead", text: "Um método static não possui this. Para ler nome, informe explicitamente um Cliente ou execute um método na própria instância." }, { type: "context" }] },
  { id: "factory", label: "Factory Nomeada", duration: "14 min", eyebrow: "CRIAÇÃO COM INTENÇÃO", title: "Deixe a classe oferecer uma porta de entrada válida", blocks: [{ type: "lead", text: "Uma factory static é apropriada quando nomeia a criação, protege invariantes e devolve uma nova instância; o objeto continua dono de seu estado e comportamento." }, { type: "factory" }] },
  { id: "global", label: "Estado Global", duration: "16 min", eyebrow: "CONTAMINAÇÃO E DEPENDÊNCIA ESCONDIDA", title: "Faça o segundo teste falhar por causa do primeiro", blocks: [{ type: "lead", text: "Estado global mutável conecta partes distantes pelo processo inteiro. Reproduza a contaminação e depois troque por uma dependência explícita criada por cenário." }, { type: "global" }] },
  { id: "decision", label: "Decisão de Design", duration: "14 min", eyebrow: "CRITÉRIO ANTES DA CONVENIÊNCIA", title: "Classifique seis casos pelo verdadeiro dono", blocks: [{ type: "lead", text: "static não significa mais rápido nem obrigatório para chamar métodos. Em Orientação a Objetos, a decisão nasce de propriedade, estado, identidade e dependências." }, { type: "decision" }] },
  { id: "debug-errors", label: "Debug e Clínica", duration: "17 min", eyebrow: "FRAMES, THIS E OITO DIAGNÓSTICOS", title: "Observe a fronteira entre classe e instância", blocks: [{ type: "lead", text: "No debugger, procure this e as dependências disponíveis em cada frame; em seguida, diagnostique oito usos que tornam o código global, ambíguo ou difícil de testar." }, { type: "debug" }, { type: "errors" }] },
  { id: "delivery", label: "Entrega & OS", duration: "25 min", eyebrow: "FACTORY, CONSTANTE, ESTADO E OITO TESTES", title: "Entregue uma Ordem de Serviço com static sob controle", blocks: [{ type: "lead", text: "A solução final combina factory e utilitário static, constante da classe e comportamento de instância, sem esconder estado global mutável." }, { type: "delivery" }] },
];

function ContentBlock({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = { ownership: OwnershipLab, counter: SharedCounterLab, bootstrap: BootstrapLab, constant: ConstantLab, utility: UtilityLab, context: ContextLab, factory: FactoryLab, global: GlobalLab, decision: DecisionLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = map[block.type]; return Component ? <Component /> : null;
}

export default function GuidedStaticCriteriaLesson121({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-static-criteria-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Boxes size={17} />Laboratório de propriedade e estado</span><p className="guided-sequence">121 · M4.17</p><h1>Use static quando a classe — e não um objeto — for a dona</h1><p>Enxergue memória, bootstrap, constantes, utilitários, factories e estado global; depois defenda cada escolha em uma Ordem de Serviço testável.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header>
    <GuidedLessonFacts ariaLabel="Resumo da aula 121" items={[{ value: "10 fontes", label: "9 executáveis + 1 erro deliberado" }, { value: "5 pausas", label: "Entre classe e objeto" }, { value: "8 casos", label: "Na clínica de erros" }]} />
    <div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 121"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? "active " : "") + (completedSteps.has(item.id) ? "done" : "")} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + "-" + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={"step-toggle " + (stepDone ? "undo" : "complete")} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>
        {allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Critério de propriedade comprovado</h3><p>{lessonComplete ? "Aula concluída: avance para final em classes, métodos e atributos." : "Execute a OS e os oito testes antes de concluir."}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? "Reabrir aula" : "Concluir aula"}</button></section>}
      </main></div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 120</button><div className={"guided-course-status " + (lessonComplete ? "completed" : allStepsDone ? "ready" : "")}><Clock3 size={18} /><span><strong>{lessonComplete ? "Aula concluída" : completedSteps.size + " de " + steps.length + " etapas"}</strong><small>classe, instância, constante, factory e dependência</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 122<ArrowRight size={17} /></button></footer>
  </article>;
}
