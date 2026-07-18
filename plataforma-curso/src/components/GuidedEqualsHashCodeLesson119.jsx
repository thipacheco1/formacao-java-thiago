import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertTriangle, ArrowLeft, ArrowRight, Braces, Check, CheckCircle2, Clock3,
  Copy, Database, FileCode2, Fingerprint, GitCompareArrows, Hash, ListChecks,
  Play, RotateCcw, Sparkles, StepForward,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedEqualsHashCodeLesson.css";

const STORAGE_KEY = "guided-equals-hashcode-lesson-119-progress";

const NO_EQUALS_SOURCE = `public class ComparacaoSemEquals119 {
    public static void main(String[] args) {
        EmailSemEquals119 a = new EmailSemEquals119("ana@email.com");
        EmailSemEquals119 b = new EmailSemEquals119("ana@email.com");
        System.out.println("a == b: " + (a == b));
        System.out.println("a.equals(b): " + a.equals(b));
    }
}
class EmailSemEquals119 {
    private final String valor;
    EmailSemEquals119(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@"))
            throw new IllegalArgumentException("E-mail inválido.");
        this.valor = valor.trim().toLowerCase();
    }
}`;

const EMAIL_SOURCE = `import java.util.Objects;

public class EmailComEquals119 {
    public static void main(String[] args) {
        EmailValor119 a = new EmailValor119("Ana@Email.com ");
        EmailValor119 b = new EmailValor119("ana@email.com");
        EmailValor119 c = new EmailValor119("carlos@email.com");
        System.out.println("a == b: " + (a == b));
        System.out.println("a.equals(b): " + a.equals(b));
        System.out.println("a.equals(c): " + a.equals(c));
        System.out.println("hash igual: " + (a.hashCode() == b.hashCode()));
    }
}
class EmailValor119 {
    private final String valor;
    EmailValor119(String valor) {
        if (valor == null || valor.isBlank() || !valor.contains("@"))
            throw new IllegalArgumentException("E-mail inválido.");
        this.valor = valor.trim().toLowerCase();
    }
    String valor() { return valor; }
    @Override public boolean equals(Object outro) {
        if (this == outro) return true;
        if (outro == null || getClass() != outro.getClass()) return false;
        EmailValor119 email = (EmailValor119) outro;
        return Objects.equals(valor, email.valor);
    }
    @Override public int hashCode() { return Objects.hash(valor); }
    @Override public String toString() { return valor; }
}`;

const PHONE_SOURCE = `import java.util.Objects;

public class TelefoneComEquals119 {
    public static void main(String[] args) {
        TelefoneValor119 a = new TelefoneValor119("11", "999999999");
        TelefoneValor119 b = new TelefoneValor119("11", "999999999");
        TelefoneValor119 c = new TelefoneValor119("21", "999999999");
        System.out.println("a.equals(b): " + a.equals(b));
        System.out.println("a.equals(c): " + a.equals(c));
        System.out.println("hash igual: " + (a.hashCode() == b.hashCode()));
    }
}
class TelefoneValor119 {
    private final String ddd;
    private final String numero;
    TelefoneValor119(String ddd, String numero) {
        if (ddd == null || !ddd.matches("\\d{2}")) throw new IllegalArgumentException("DDD inválido.");
        if (numero == null || !numero.matches("\\d{8,9}")) throw new IllegalArgumentException("Número inválido.");
        this.ddd = ddd; this.numero = numero;
    }
    @Override public boolean equals(Object outro) {
        if (this == outro) return true;
        if (outro == null || getClass() != outro.getClass()) return false;
        TelefoneValor119 telefone = (TelefoneValor119) outro;
        return Objects.equals(ddd, telefone.ddd) && Objects.equals(numero, telefone.numero);
    }
    @Override public int hashCode() { return Objects.hash(ddd, numero); }
}`;

const CLIENT_SOURCE = `import java.util.Objects;

public class ClienteEntidade119 {
    public static void main(String[] args) {
        Cliente119 a = new Cliente119(10, "Ana", "antigo@email.com");
        Cliente119 b = new Cliente119(10, "Ana", "novo@email.com");
        Cliente119 c = new Cliente119(25, "Ana", "antigo@email.com");
        System.out.println("a == b: " + (a == b));
        System.out.println("a.equals(b): " + a.equals(b));
        System.out.println("a.equals(c): " + a.equals(c));
        System.out.println("hash igual: " + (a.hashCode() == b.hashCode()));
    }
}
class Cliente119 {
    private final int id;
    private final String nome;
    private String email;
    Cliente119(int id, String nome, String email) {
        if (id <= 0) throw new IllegalArgumentException("Id obrigatório.");
        this.id = id; this.nome = Objects.requireNonNull(nome); this.email = Objects.requireNonNull(email);
    }
    void alterarEmail(String novo) { email = Objects.requireNonNull(novo); }
    @Override public boolean equals(Object outro) {
        if (this == outro) return true;
        if (outro == null || getClass() != outro.getClass()) return false;
        Cliente119 cliente = (Cliente119) outro;
        return id == cliente.id;
    }
    @Override public int hashCode() { return Objects.hash(id); }
}`;

const COLLECTIONS_SOURCE = `import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public class ColecoesHash119 {
    public static void main(String[] args) {
        Set<ChaveEmail119> emails = new HashSet<>();
        emails.add(new ChaveEmail119("ana@email.com"));
        emails.add(new ChaveEmail119("ANA@EMAIL.COM"));
        emails.add(new ChaveEmail119("carlos@email.com"));
        System.out.println("HashSet: " + emails.size());

        Map<ChaveEmail119, String> clientes = new HashMap<>();
        clientes.put(new ChaveEmail119("ana@email.com"), "Ana Silva");
        System.out.println("HashMap: " + clientes.get(new ChaveEmail119("ANA@EMAIL.COM")));
    }
}
class ChaveEmail119 {
    private final String valor;
    ChaveEmail119(String valor) { this.valor = Objects.requireNonNull(valor).trim().toLowerCase(); }
    @Override public boolean equals(Object outro) {
        if (this == outro) return true;
        if (outro == null || getClass() != outro.getClass()) return false;
        return Objects.equals(valor, ((ChaveEmail119) outro).valor);
    }
    @Override public int hashCode() { return Objects.hash(valor); }
}`;

const RECORD_SOURCE = `public class RecordEquals119 {
    public static void main(String[] args) {
        CodigoPedido119 a = new CodigoPedido119("PED-1001");
        CodigoPedido119 b = new CodigoPedido119("PED-1001");
        CodigoPedido119 c = new CodigoPedido119("PED-2002");
        System.out.println("a == b: " + (a == b));
        System.out.println("a.equals(b): " + a.equals(b));
        System.out.println("a.equals(c): " + a.equals(c));
        System.out.println("hash igual: " + (a.hashCode() == b.hashCode()));
        System.out.println(a);
    }
}
record CodigoPedido119(String valor) {
    CodigoPedido119 {
        if (valor == null || !valor.startsWith("PED-"))
            throw new IllegalArgumentException("Código deve iniciar com PED-.");
    }
}`;

const MUTABLE_SOURCE = `import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class CampoMutavelHash119 {
    public static void main(String[] args) {
        ClienteMutavel119 cliente = new ClienteMutavel119("ana@email.com");
        Set<ClienteMutavel119> clientes = new HashSet<>();
        clientes.add(cliente);
        System.out.println("antes: " + clientes.contains(cliente));
        cliente.alterarEmail("novo@email.com");
        System.out.println("depois: " + clientes.contains(cliente));
    }
}
class ClienteMutavel119 {
    private String email;
    ClienteMutavel119(String email) { this.email = email; }
    void alterarEmail(String novo) { email = novo; }
    @Override public boolean equals(Object outro) {
        return outro instanceof ClienteMutavel119 c && Objects.equals(email, c.email);
    }
    @Override public int hashCode() { return Objects.hash(email); }
}`;

const PRODUCT_SOURCE = `import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class EqualsHashCodeProduto119 {
    public static void main(String[] args) {
        ProdutoEquals119 p1 = new ProdutoEquals119("PROD-001", "Cadeira", "399.90");
        ProdutoEquals119 p2 = new ProdutoEquals119("PROD-001", "Cadeira Escritório", "429.90");
        ProdutoEquals119 p3 = new ProdutoEquals119("PROD-002", "Mesa", "799.90");
        System.out.println("p1 == p2: " + (p1 == p2));
        System.out.println("p1.equals(p2): " + p1.equals(p2));
        System.out.println("p1.equals(p3): " + p1.equals(p3));
        System.out.println("hash p1 == p2: " + (p1.hashCode() == p2.hashCode()));
        Set<ProdutoEquals119> produtos = new HashSet<>();
        produtos.add(p1); produtos.add(p2); produtos.add(p3);
        System.out.println("Quantidade no HashSet: " + produtos.size());
    }
}
record CodigoProduto119(String valor) {
    CodigoProduto119 {
        if (valor == null || !valor.startsWith("PROD-"))
            throw new IllegalArgumentException("Código deve iniciar com PROD-.");
    }
}
enum StatusProduto119 { ATIVO, INATIVO }
class ProdutoEquals119 {
    private final CodigoProduto119 codigo;
    private final String nome;
    private final BigDecimal preco;
    private StatusProduto119 status = StatusProduto119.ATIVO;
    ProdutoEquals119(String codigo, String nome, String preco) {
        this.codigo = new CodigoProduto119(codigo);
        this.nome = Objects.requireNonNull(nome);
        this.preco = new BigDecimal(preco);
        if (this.preco.signum() <= 0) throw new IllegalArgumentException("Preço deve ser positivo.");
    }
    CodigoProduto119 codigo() { return codigo; }
    StatusProduto119 status() { return status; }
    @Override public boolean equals(Object outro) {
        if (this == outro) return true;
        if (outro == null || getClass() != outro.getClass()) return false;
        ProdutoEquals119 produto = (ProdutoEquals119) outro;
        return Objects.equals(codigo, produto.codigo);
    }
    @Override public int hashCode() { return Objects.hash(codigo); }
}`;

const TEST_SOURCE = `public class TesteEqualsHashCode119 {
    private static int testes;
    public static void main(String[] args) {
        EmailValor119 e1 = new EmailValor119("ANA@EMAIL.COM");
        EmailValor119 e2 = new EmailValor119("ana@email.com");
        check(e1.equals(e2));
        check(e1.hashCode() == e2.hashCode());
        check(!e1.equals(null));
        check(!e1.equals("ana@email.com"));
        Cliente119 c1 = new Cliente119(10, "Ana", "a@email.com");
        Cliente119 c2 = new Cliente119(10, "Ana", "b@email.com");
        check(c1.equals(c2));
        ProdutoEquals119 p1 = new ProdutoEquals119("PROD-001", "A", "10.00");
        ProdutoEquals119 p2 = new ProdutoEquals119("PROD-001", "B", "20.00");
        check(p1.equals(p2));
        check(p1.hashCode() == p2.hashCode());
        java.util.Set<ProdutoEquals119> set = new java.util.HashSet<>();
        set.add(p1); set.add(p2); set.add(new ProdutoEquals119("PROD-002", "C", "30.00"));
        check(set.size() == 2);
        System.out.println(testes + " testes passaram");
    }
    private static void check(boolean condicao) {
        testes++; if (!condicao) throw new AssertionError("Falhou teste " + testes);
    }
}`;

const ERRORS = [
  ["equals sem hashCode", "Objetos iguais caem em hashes incompatíveis e a coleção não encontra a equivalência.", "Use no hashCode exatamente os dados usados pelo equals."],
  ["Comparar objeto com ==", "Duas instâncias com o mesmo valor retornam false.", "Reserve == para referência; use equals para igualdade lógica."],
  ["Entidade por todos os campos", "Mudar nome ou e-mail faz a mesma entidade parecer outra.", "Compare pela identidade estável do domínio."],
  ["Valor por referência", "Dois Emails normalizados continuam diferentes.", "Implemente equals com todos os componentes que definem o valor."],
  ["Campo mutável no hash", "Depois da alteração, contains ou remove pode falhar.", "Prefira dados imutáveis e estáveis no contrato de hash."],
  ["Sem @Override", "Uma assinatura errada passa despercebida.", "Use @Override para o compilador verificar a sobrescrita."],
  ["equals(Tipo outro)", "Você criou sobrecarga; Object.equals continua ativo.", "A assinatura é public boolean equals(Object outro)."],
  ["Record usado como entidade", "Todos os componentes entram automaticamente na igualdade.", "Use record para valor; em entidade, modele identidade e ciclo de vida conscientemente."],
];

const EVIDENCE = `# Aula 119 — equals e hashCode
- [ ] Expliquei == versus equals
- [ ] Tracei as quatro guardas do equals
- [ ] Provei o contrato equals/hashCode
- [ ] Comparei valor e entidade
- [ ] Testei HashSet e HashMap
- [ ] Reproduzi o perigo do hash mutável
- [ ] Executei o Produto e 8 testes
- [ ] Registrei respostas e commit limpo`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? "Copiado" : "Copiar"}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{code}</SyntaxHighlighter></section>;
}

function ComparisonLab() {
  const [method, setMethod] = useState("equals");
  const result = method === "reference" ? ["false", "@A1 é diferente de @B7"] : ["false", "Object.equals ainda compara referência porque a classe não sobrescreveu equals"];
  return <section className="eq119-stack"><div className="eq119-reference"><div><span>@A1</span><b>Email</b><code>ana@email.com</code></div><div><span>@B7</span><b>Email</b><code>ana@email.com</code></div></div><div className="eq119-switch"><div><button type="button" className={method === "reference" ? "active" : ""} onClick={() => setMethod("reference")}>a == b</button><button type="button" className={method === "equals" ? "active" : ""} onClick={() => setMethod("equals")}>a.equals(b)</button></div><strong>{result[0]}</strong><p>{result[1]}</p></div><CodePanel name="ComparacaoSemEquals119.java" code={NO_EQUALS_SOURCE} /></section>;
}

function EqualsAnatomyLab() {
  const [index, setIndex] = useState(0);
  const parts = [
    ["Atalho de referência", "if (this == outro) return true;", "O mesmo objeto é igual a si mesmo."],
    ["Barreira de tipo", "if (outro == null || getClass() != outro.getClass()) return false;", "Nulo e outra classe são rejeitados antes do cast."],
    ["Cast seguro", "EmailValor119 email = (EmailValor119) outro;", "A verificação anterior torna a conversão segura."],
    ["Regra lógica", "return Objects.equals(valor, email.valor);", "Só os atributos que definem o valor entram aqui."],
  ];
  const part = parts[index];
  return <section className="eq119-stack"><div className="eq119-anatomy"><nav>{parts.map((item, i) => <button type="button" className={i === index ? "active" : i < index ? "done" : ""} onClick={() => setIndex(i)} key={item[0]}><span>{i + 1}</span>{item[0]}</button>)}</nav><main><span>PASSO {index + 1} DE 4</span><h3>{part[0]}</h3><code>{part[1]}</code><p>{part[2]}</p><button type="button" disabled={index === parts.length - 1} onClick={() => setIndex((x) => Math.min(parts.length - 1, x + 1))}>Executar próxima guarda<ArrowRight size={16} /></button></main></div><p className="guided-note"><Braces size={18} /><span>A assinatura correta recebe <code>Object</code>. Escrever <code>equals(Email outro)</code> cria sobrecarga; <code>@Override</code> impede esse engano.</span></p><CodePanel name="EmailComEquals119.java" code={EMAIL_SOURCE} /></section>;
}

function HashContractLab() {
  const [broken, setBroken] = useState(false);
  return <section className="eq119-stack"><div className="eq119-contract"><header><button type="button" className={!broken ? "active" : ""} onClick={() => setBroken(false)}>Contrato correto</button><button type="button" className={broken ? "danger" : ""} onClick={() => setBroken(true)}>Quebrar contrato</button></header><div className="eq119-contract-flow"><div><span>Email A</span><strong>equals → true</strong><code>ana@email.com</code></div><ArrowRight /><div className={broken ? "bad" : "good"}><span>hashCode</span><strong>{broken ? "101 ≠ 709" : "709 = 709"}</strong><small>{broken ? "coleção procura no lugar errado" : "mesmo bucket; equals confirma"}</small></div><ArrowRight /><div><Hash size={28} /><strong>{broken ? "falha lógica" : "equivalência"}</strong></div></div></div><div className="eq119-rules"><div><b>Obrigatório</b><p>Se <code>a.equals(b)</code> é true, os hashes devem ser iguais.</p></div><div><b>Não obrigatório</b><p>Hashes iguais não provam igualdade: colisões existem.</p></div></div></section>;
}

function ValueObjectsLab() {
  const [kind, setKind] = useState("email");
  return <section className="eq119-stack"><div className="eq119-values"><nav><button type="button" className={kind === "email" ? "active" : ""} onClick={() => setKind("email")}>Email · 1 atributo</button><button type="button" className={kind === "phone" ? "active" : ""} onClick={() => setKind("phone")}>Telefone · 2 atributos</button></nav>{kind === "email" ? <main><div><code>Ana@Email.com </code><ArrowRight /><code>ana@email.com</code></div><div><code>ana@email.com</code><ArrowRight /><code>ana@email.com</code></div><strong>equals true · hash igual</strong><p><code>Objects.equals(valor, outro.valor)</code><br /><code>Objects.hash(valor)</code></p></main> : <main><div><code>ddd = 11</code><span>+</span><code>numero = 999999999</code></div><strong>os dois campos definem o valor</strong><p><code>Objects.equals(ddd, outro.ddd) &amp;&amp; Objects.equals(numero, outro.numero)</code><br /><code>Objects.hash(ddd, numero)</code></p></main>}</div><CodePanel name={kind === "email" ? "EmailComEquals119.java" : "TelefoneComEquals119.java"} code={kind === "email" ? EMAIL_SOURCE : PHONE_SOURCE} /></section>;
}

function EntityLab() {
  const [saved, setSaved] = useState(true);
  return <section className="eq119-stack"><div className="eq119-entity"><div><Fingerprint /><span>Cliente A</span><strong>{saved ? "id 10" : "id null"}</strong><small>email antigo</small></div><div className="eq119-entity-rule"><b>{saved ? "mesma entidade" : "não conclua igualdade"}</b><code>{saved ? "id 10 == id 10" : "null não é identidade"}</code><button type="button" onClick={() => setSaved((x) => !x)}>{saved ? "Simular antes de salvar" : "Atribuir id persistido"}</button></div><div><Fingerprint /><span>Cliente B</span><strong>{saved ? "id 10" : "id null"}</strong><small>email novo</small></div></div><p className="guided-note"><Database size={18} /><span>Entidade compara continuidade pela identidade estável. Esta aula exige id positivo; quando JPA gerar id, o ciclo de vida pedirá uma estratégia própria.</span></p><CodePanel name="ClienteEntidade119.java" code={CLIENT_SOURCE} /></section>;
}

function CollectionsLab() {
  const [mode, setMode] = useState("set");
  const [step, setStep] = useState(0);
  const setRows = [["add ana", "bucket 709", "tamanho 1"], ["add ANA", "hash 709 + equals true", "tamanho 1"], ["add carlos", "outro hash", "tamanho 2"]];
  const mapRows = [["put Email(ana)", "hash 709", "Ana Silva"], ["get Email(ANA)", "hash 709 + equals true", "Ana Silva encontrada"]];
  const rows = mode === "set" ? setRows : mapRows;
  const change = (next) => { setMode(next); setStep(0); };
  return <section className="eq119-stack"><div className="eq119-collections"><header><button type="button" className={mode === "set" ? "active" : ""} onClick={() => change("set")}>HashSet</button><button type="button" className={mode === "map" ? "active" : ""} onClick={() => change("map")}>HashMap</button></header><div className="eq119-hash-lane">{rows.map((row, i) => <button type="button" className={i === step ? "active" : i < step ? "done" : ""} onClick={() => setStep(i)} key={row[0]}><span>{i + 1}</span><b>{row[0]}</b><code>{row[1]}</code><small>{row[2]}</small></button>)}</div><footer><span>{mode === "set" ? "HashSet elimina duplicata lógica" : "HashMap encontra outra instância equivalente"}</span><button type="button" disabled={step === rows.length - 1} onClick={() => setStep((x) => Math.min(rows.length - 1, x + 1))}>Próxima operação</button></footer></div><CodePanel name="ColecoesHash119.java" code={COLLECTIONS_SOURCE} /></section>;
}

function RecordLab() {
  const [view, setView] = useState("record");
  const data = view === "record" ? ["record CodigoPedido(String valor)", "Todos os componentes", "Ótimo para valor simples", "equals, hashCode, toString e accessors"] : ["class Cliente", "Somente id estável", "Entidade tem ciclo de vida", "equals/hashCode deliberados"];
  return <section className="eq119-stack"><div className="eq119-record"><nav><button type="button" className={view === "record" ? "active" : ""} onClick={() => setView("record")}>Objeto de valor</button><button type="button" className={view === "entity" ? "active" : ""} onClick={() => setView("entity")}>Entidade</button></nav><main><Braces size={34} /><code>{data[0]}</code><dl><div><dt>Igualdade</dt><dd>{data[1]}</dd></div><div><dt>Decisão</dt><dd>{data[2]}</dd></div><div><dt>Geração</dt><dd>{data[3]}</dd></div></dl></main></div><div className="eq119-type-check"><div><b>getClass()</b><p>Exige exatamente a mesma classe. É o padrão didático desta aula.</p></div><div><b>instanceof</b><p>Aceita relação de tipo; com herança, simetria e substituição exigem cuidado.</p></div></div><CodePanel name="RecordEquals119.java" code={RECORD_SOURCE} /></section>;
}

function MutableHashLab() {
  const [step, setStep] = useState(0);
  const states = [
    ["1 · adicionar", "ana@email.com", "bucket 7", "contains → true"],
    ["2 · alterar e-mail", "novo@email.com", "objeto continua fisicamente no bucket 7", "hash agora aponta para outro bucket"],
    ["3 · procurar", "novo@email.com", "busca começa no bucket novo", "contains → false"],
  ];
  const current = states[step];
  return <section className="eq119-stack"><div className="eq119-mutable"><header><AlertTriangle /><strong>{current[0]}</strong></header><div><span>campo usado no hash</span><code>{current[1]}</code><ArrowRight /><span>{current[2]}</span><ArrowRight /><b>{current[3]}</b></div><footer>{states.map((item, i) => <button type="button" className={i === step ? "active" : ""} onClick={() => setStep(i)} key={item[0]}>{i + 1}</button>)}</footer></div><p className="guided-note"><Hash size={18} /><span>Uma coleção hash registra o objeto conforme o hash do momento da inserção. Mudar esse dado quebra o caminho de localização.</span></p><CodePanel name="CampoMutavelHash119.java" code={MUTABLE_SOURCE} /></section>;
}

function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    ["a.equals(b)", "this=@A1 · outro=@B7", "Instâncias diferentes entram na implementação lógica."],
    ["this == outro", "@A1 == @B7 → false", "O atalho não encerra a comparação."],
    ["barreira de tipo", "EmailValor119 == EmailValor119", "Nulo e classe foram validados."],
    ["cast", "email = (EmailValor119) outro", "Agora os atributos podem ser lidos."],
    ["Objects.equals", "ana@email.com == ana@email.com", "equals retorna true pelo valor."],
    ["hashCode de a", "Objects.hash(valor) → 709", "A coleção escolhe um bucket."],
    ["hashCode de b", "Objects.hash(valor) → 709", "Objetos iguais chegam ao mesmo bucket."],
    ["HashSet.add(b)", "bucket 709 → equals(a,b)", "A duplicata lógica é recusada."],
    ["HashMap.get(chave)", "hash → bucket → equals", "Outra instância encontra a chave equivalente."],
    ["campo mutável", "hash antes ≠ hash depois", "O objeto pode ficar inalcançável na coleção."],
  ];
  const current = frames[step];
  return <section className="eq119-stack"><div className="eq119-debug"><div><button type="button" disabled={step === 0} onClick={() => setStep((x) => Math.max(0, x - 1))}><ArrowLeft size={15} />Voltar</button><button type="button" disabled={step === frames.length - 1} onClick={() => setStep((x) => Math.min(frames.length - 1, x + 1))}><StepForward size={15} />Step Into</button><span>{step + 1}/{frames.length}</span></div><section><aside>{frames.map((item, i) => <button type="button" className={i === step ? "active" : ""} onClick={() => setStep(i)} key={item[0] + i}><span>{i + 1}</span>{item[0]}</button>)}</aside><main><span>DEBUGGER · CALL STACK + VARIABLES</span><h3>{current[0]}</h3><code>{current[1]}</code><p>{current[2]}</p><div><b>Pergunte em cada pausa</b><small>Qual método chamou? Qual dado decide igualdade? O hash permanece estável?</small></div></main></section></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="eq119-stack"><div className="eq119-errors"><nav>{ERRORS.map((item, i) => <button type="button" className={i === selected ? "active" : ""} onClick={() => setSelected(i)} key={item[0]}><span>{i + 1}</span><span className="guided-error-label">{item[0]}</span></button>)}</nav><main><span><AlertTriangle size={16} />CASO {selected + 1} DE {ERRORS.length}</span><h3>{current[0]}</h3><section><div><b>Sintoma</b><p>{current[1]}</p></div><ArrowRight size={18} /><div><b>Como corrigir</b><p>{current[2]}</p></div></section></main></div></section>;
}

function DeliveryLab() {
  const [checked, setChecked] = useState(() => new Set());
  const tasks = ["Código PROD-", "Valor imutável", "Entidade por código", "HashSet = 2", "8 testes", "Git limpo"];
  const toggle = (i) => setChecked((current) => { const next = new Set(current); if (next.has(i)) next.delete(i); else next.add(i); return next; });
  return <section className="eq119-stack"><CodePanel name="EqualsHashCodeProduto119.java" code={PRODUCT_SOURCE} /><CodePanel name="TesteEqualsHashCode119.java" code={TEST_SOURCE} /><div className="guided-console"><div className="guided-console-title"><Play size={15} />Terminal</div><pre>{`> javac -encoding UTF-8 *.java
> java EqualsHashCodeProduto119
p1 == p2: false
p1.equals(p2): true
p1.equals(p3): false
hash p1 == p2: true
Quantidade no HashSet: 2
> java TesteEqualsHashCode119
8 testes passaram
> git add labs/m4/aula-119-equals-hashcode
> git commit -m "Aula 119: pratica equals e hashCode"`}</pre></div><div className="eq119-checklist">{tasks.map((item, i) => <button type="button" className={checked.has(i) ? "done" : ""} onClick={() => toggle(i)} key={item}><span>{checked.has(i) ? <Check size={14} /> : i + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral do contrato</h3></div><ul><li>Por que dois Produtos com nomes diferentes são iguais?</li><li>Por que CodigoProduto entra nos dois métodos?</li><li>Como o HashSet chega ao tamanho 2?</li><li>Por que preço e status não participam da identidade?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: "18px", background: "#0f172a", fontSize: ".78rem" }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: "comparison", label: "== versus equals", duration: "14 min", eyebrow: "REFERÊNCIA NÃO É IGUALDADE LÓGICA", title: "Veja dois Emails iguais falharem nas duas comparações", blocks: [{ type: "lead", text: "Sem sobrescrita, tanto == quanto Object.equals respondem à pergunta de referência. O valor interno ainda não participa." }, { type: "comparison" }] },
  { id: "anatomy", label: "Anatomia do equals", duration: "16 min", eyebrow: "QUATRO GUARDAS, UMA REGRA", title: "Entre no método equals linha por linha", blocks: [{ type: "lead", text: "O método seguro trata autorreferência, nulo, classe, cast e só então aplica a igualdade lógica." }, { type: "anatomy" }] },
  { id: "contract", label: "Contrato de hash", duration: "13 min", eyebrow: "EQUALS TRUE EXIGE HASH IGUAL", title: "Faça igualdade e localização apontarem para o mesmo lugar", blocks: [{ type: "lead", text: "hashCode não prova igualdade; ele reduz a área de busca. equals confirma a equivalência dentro do bucket candidato." }, { type: "contract" }] },
  { id: "values", label: "Email e Telefone", duration: "16 min", eyebrow: "OBJETOS DE VALOR POR COMPONENTES", title: "Use um ou vários atributos sem quebrar o contrato", blocks: [{ type: "lead", text: "Objetos de valor comparam todos os componentes que definem seu significado, preferencialmente imutáveis e normalizados." }, { type: "values" }] },
  { id: "entity", label: "Entidade Cliente", duration: "15 min", eyebrow: "IDENTIDADE ESTÁVEL, ESTADO MUTÁVEL", title: "Compare Cliente pelo id, não pela fotografia atual", blocks: [{ type: "lead", text: "E-mails diferentes podem retratar a mesma entidade em momentos distintos. O id estável preserva a continuidade." }, { type: "entity" }] },
  { id: "collections", label: "HashSet e HashMap", duration: "17 min", eyebrow: "HASH LOCALIZA; EQUALS CONFIRMA", title: "Acompanhe cada chamada feita pela coleção", blocks: [{ type: "lead", text: "HashSet usa o contrato para impedir duplicatas; HashMap usa o mesmo caminho para localizar uma chave equivalente criada em outra instância." }, { type: "collections" }] },
  { id: "record", label: "Record e Tipo", duration: "13 min", eyebrow: "GERAÇÃO AUTOMÁTICA COM CRITÉRIO", title: "Decida quando record ajuda e quando esconde a regra", blocks: [{ type: "lead", text: "Record compara todos os componentes automaticamente, excelente para valores simples; entidade normalmente exige igualdade deliberada por identidade." }, { type: "record" }] },
  { id: "mutable", label: "Armadilha Mutável", duration: "13 min", eyebrow: "O OBJETO MUDA DE ENDEREÇO LÓGICO", title: "Veja um Cliente desaparecer dentro do HashSet", blocks: [{ type: "lead", text: "Se um campo usado no hash muda após a inserção, a coleção procura com um hash diferente daquele registrado." }, { type: "mutable" }] },
  { id: "debug", label: "Debug do Contrato", duration: "15 min", eyebrow: "DEZ PAUSAS ENTRE MÉTODO E BUCKET", title: "Siga equals e hashCode chamados pelas coleções", blocks: [{ type: "lead", text: "Entre em cada método e observe referência, tipo, campos comparados, hash calculado e decisão da coleção." }, { type: "debug" }] },
  { id: "errors", label: "Clínica de Erros", duration: "12 min", eyebrow: "OITO FALHAS PROFISSIONAIS", title: "Diagnostique contratos quebrados antes da produção", blocks: [{ type: "lead", text: "Cada caso conecta um sintoma observável à decisão de modelagem que o causou." }, { type: "errors" }] },
  { id: "delivery", label: "Entrega & Produto", duration: "25 min", eyebrow: "BIGDECIMAL, ENUM, SET, TESTES E GIT", title: "Entregue Produto com igualdade de entidade comprovada", blocks: [{ type: "lead", text: "CodigoProduto é valor; Produto é entidade. O programa, o HashSet e oito testes defendem o contrato inteiro." }, { type: "delivery" }] },
];

function ContentBlock({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = { comparison: ComparisonLab, anatomy: EqualsAnatomyLab, contract: HashContractLab, values: ValueObjectsLab, entity: EntityLab, collections: CollectionsLab, record: RecordLab, mutable: MutableHashLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = map[block.type]; return Component ? <Component /> : null;
}

export default function GuidedEqualsHashCodeLesson119({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-equals-hashcode-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Hash size={17} />Oficina do contrato de igualdade</span><p className="guided-sequence">119 · M4.15</p><h1>equals define igualdade; hashCode encontra o caminho</h1><p>Entre nos métodos, acompanhe buckets, compare valor e entidade e prove o comportamento real de HashSet, HashMap, record e Produto.</p></div><div className="guided-hero-status"><GitCompareArrows size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header>
    <GuidedLessonFacts ariaLabel="Resumo da aula 119" items={[{ value: "9 fontes", label: "Compiladas em conjunto" }, { value: "10 pausas", label: "No debug do contrato" }, { value: "8 casos", label: "Na clínica de erros" }]} />
    <div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 119"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? "active " : "") + (completedSteps.has(item.id) ? "done" : "")} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, "0")}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + "-" + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={"step-toggle " + (stepDone ? "undo" : "complete")} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>
        {allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Contrato de igualdade comprovado</h3><p>{lessonComplete ? "Aula concluída: avance para toString com critério." : "Execute Produto e os oito testes antes de concluir."}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? "Reabrir aula" : "Concluir aula"}</button></section>}
      </main></div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 118</button><div className={"guided-course-status " + (lessonComplete ? "completed" : allStepsDone ? "ready" : "")}><Clock3 size={18} /><span><strong>{lessonComplete ? "Aula concluída" : completedSteps.size + " de " + steps.length + " etapas"}</strong><small>equals, hashCode, valor, entidade e coleções</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 120<ArrowRight size={17} /></button></footer>
  </article>;
}
