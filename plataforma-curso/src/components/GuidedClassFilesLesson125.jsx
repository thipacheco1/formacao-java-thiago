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
  FileCode2,
  Files,
  FolderTree,
  ListChecks,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  StepForward,
  TerminalSquare,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedClassFilesLesson.css";

const STORAGE_KEY = "guided-class-files-lesson-125-progress";

const SINGLE_SOURCE = `public class ClienteArquivo125 {
    public static void main(String[] args) {
        ClienteAuxiliar125 cliente = new ClienteAuxiliar125(10, "Ana Silva");
        System.out.println(cliente.resumo());
    }
}
class ClienteAuxiliar125 {
    private final int id; private final String nome;
    ClienteAuxiliar125(int id, String nome) {
        if (id <= 0 || nome == null || nome.isBlank()) throw new IllegalArgumentException("Cliente inválido.");
        this.id = id; this.nome = nome;
    }
    String resumo() { return "Cliente " + id + " | " + nome; }
}`;

const INVALID_TWO_PUBLIC = `public class ClientePublico125 { }
public class PedidoPublico125 { }
// ERRO: cada classe public de topo exige seu próprio arquivo.`;

const INVALID_FILENAME = `public class PedidoNome125 { }
// Salvo como ClienteNome125.java: o arquivo não corresponde à classe public.`;

const ONE_FILE_SOURCE = `import java.math.BigDecimal;
public class PedidoEmUmArquivo125 {
    public static void main(String[] args) {
        ClienteUmArquivo125 cliente = new ClienteUmArquivo125(10, "Ana Silva");
        PedidoUmArquivo125 pedido = new PedidoUmArquivo125(1001, cliente, new DinheiroUmArquivo125(new BigDecimal("399.80")));
        System.out.println(pedido.resumo());
    }
}
class PedidoUmArquivo125 {
    private final int numero; private final ClienteUmArquivo125 cliente; private final DinheiroUmArquivo125 total;
    PedidoUmArquivo125(int numero, ClienteUmArquivo125 cliente, DinheiroUmArquivo125 total) { this.numero=numero; this.cliente=cliente; this.total=total; }
    String resumo() { return "Pedido " + numero + " | " + cliente.nome() + " | " + total; }
}
record ClienteUmArquivo125(int id, String nome) { }
record DinheiroUmArquivo125(BigDecimal valor) { @Override public String toString() { return "R$ " + valor; } }
enum StatusUmArquivo125 { CRIADO, PAGO, CANCELADO }`;

const PEDIDO_APP = `public class PedidoSeparadoApp125 {
    public static void main(String[] args) {
        ClienteSeparado125 cliente = new ClienteSeparado125(10, "Ana Silva");
        PedidoSeparado125 pedido = new PedidoSeparado125(1001, cliente, DinheiroSeparado125.de("399.80"));
        pedido.confirmarPagamento();
        System.out.println(pedido.resumo());
    }
}`;
const PEDIDO_ENTITY = `public class PedidoSeparado125 {
    private final int numero; private final ClienteSeparado125 cliente; private final DinheiroSeparado125 total;
    private StatusPedidoSeparado125 status = StatusPedidoSeparado125.CRIADO;
    public PedidoSeparado125(int numero, ClienteSeparado125 cliente, DinheiroSeparado125 total) {
        if (numero <= 0 || cliente == null || total == null || !total.positivo()) throw new IllegalArgumentException("Pedido inválido.");
        this.numero=numero; this.cliente=cliente; this.total=total;
    }
    public void confirmarPagamento() { if (status != StatusPedidoSeparado125.CRIADO) throw new IllegalStateException(); status=StatusPedidoSeparado125.PAGO; }
    public String resumo() { return "Pedido " + numero + " | " + cliente.resumo() + " | " + total + " | " + status; }
}`;
const PEDIDO_CLIENT = `public class ClienteSeparado125 {
    private final int id; private final String nome;
    public ClienteSeparado125(int id, String nome) {
        if (id <= 0 || nome == null || nome.isBlank()) throw new IllegalArgumentException("Cliente inválido.");
        this.id=id; this.nome=nome;
    }
    public String resumo() { return "Cliente " + id + " - " + nome; }
}`;
const PEDIDO_MONEY = `import java.math.BigDecimal;
import java.math.RoundingMode;
public final class DinheiroSeparado125 {
    private final BigDecimal valor;
    private DinheiroSeparado125(BigDecimal valor) { this.valor=valor.setScale(2, RoundingMode.HALF_UP); }
    public static DinheiroSeparado125 de(String valor) { return new DinheiroSeparado125(new BigDecimal(valor)); }
    public boolean positivo() { return valor.signum() > 0; }
    @Override public String toString() { return "R$ " + valor; }
}`;
const PEDIDO_STATUS = `public enum StatusPedidoSeparado125 { CRIADO, PAGO, CANCELADO }`;

const OS_APP = `import java.time.LocalDate;
public class OrdemServicoApp125 {
    public static void main(String[] args) {
        OrdemServicoSeparada125 os = new OrdemServicoSeparada125(new CodigoOsSeparado125("OS-2026-0001"), "Ana Silva", new PeriodoSeparado125(LocalDate.of(2026,7,20), TurnoSeparado125.MANHA));
        os.reagendar(new PeriodoSeparado125(LocalDate.of(2026,7,22), TurnoSeparado125.TARDE));
        System.out.println(os.resumo());
    }
}`;
const OS_ENTITY = `public class OrdemServicoSeparada125 {
    private final CodigoOsSeparado125 codigo; private final String cliente; private PeriodoSeparado125 periodo;
    private StatusOsSeparado125 status=StatusOsSeparado125.AGENDADA; private int reagendamentos;
    public OrdemServicoSeparada125(CodigoOsSeparado125 codigo,String cliente,PeriodoSeparado125 periodo) {
        if(codigo==null||cliente==null||cliente.isBlank()||periodo==null) throw new IllegalArgumentException("OS inválida.");
        this.codigo=codigo;this.cliente=cliente;this.periodo=periodo;
    }
    public void reagendar(PeriodoSeparado125 novo) { if(novo==null) throw new IllegalArgumentException(); periodo=novo;status=StatusOsSeparado125.REAGENDADA;reagendamentos++; }
    public String resumo(){return codigo+" | "+cliente+" | "+periodo+" | "+status+" | reagendamentos="+reagendamentos;}
}`;
const OS_CODE = `public final class CodigoOsSeparado125 {
    private final String valor;
    public CodigoOsSeparado125(String valor){if(valor==null||!valor.startsWith("OS-"))throw new IllegalArgumentException("Código inválido.");this.valor=valor;}
    @Override public String toString(){return valor;}
}`;
const OS_PERIOD = `import java.time.LocalDate;
public record PeriodoSeparado125(LocalDate data, TurnoSeparado125 turno) {
    public PeriodoSeparado125 { if(data==null||turno==null)throw new IllegalArgumentException("Período inválido."); }
    @Override public String toString(){return data+" "+turno;}
}`;
const OS_STATUS = `public enum StatusOsSeparado125 { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }`;
const OS_SHIFT = `public enum TurnoSeparado125 { MANHA, TARDE }`;

const CONTRACT_APP = `import java.math.BigDecimal; import java.time.LocalDate;
public class ContratoApp125 {
    public static void main(String[] args){
        ContratoSeparado125 contrato=new ContratoSeparado125("CONT-001",new ClienteCorporativo125(10,"Acme",true),new ServicoContratado125("Suporte",new DinheiroContrato125(new BigDecimal("200.00"))),new PeriodoContrato125(LocalDate.of(2026,7,1),LocalDate.of(2026,9,30)));
        contrato.ativar(); System.out.println(contrato.resumo());
    }
}`;
const CONTRACT_ENTITY = `import java.math.BigDecimal;
public class ContratoSeparado125 {
    private final String codigo;private final ClienteCorporativo125 cliente;private final ServicoContratado125 servico;private final PeriodoContrato125 periodo;
    private StatusContratoSeparado125 status=StatusContratoSeparado125.RASCUNHO;
    public ContratoSeparado125(String codigo,ClienteCorporativo125 cliente,ServicoContratado125 servico,PeriodoContrato125 periodo){if(codigo==null||codigo.isBlank()||cliente==null||servico==null||periodo==null)throw new IllegalArgumentException("Contrato inválido.");this.codigo=codigo;this.cliente=cliente;this.servico=servico;this.periodo=periodo;}
    public void ativar(){if(!cliente.ativo())throw new IllegalStateException("Cliente inativo.");status=StatusContratoSeparado125.ATIVO;}
    public void cancelar(){if(status==StatusContratoSeparado125.CANCELADO)throw new IllegalStateException("Já cancelado.");status=StatusContratoSeparado125.CANCELADO;}
    public BigDecimal valorTotal(){return servico.valorMensal().valor().multiply(BigDecimal.valueOf(periodo.meses()));}
    public StatusContratoSeparado125 status(){return status;}
    public String resumo(){return codigo+" | "+cliente.razaoSocial()+" | "+status+" | total=R$ "+valorTotal();}
}`;
const CONTRACT_CLIENT = `public record ClienteCorporativo125(int id,String razaoSocial,boolean ativo){public ClienteCorporativo125{if(id<=0||razaoSocial==null||razaoSocial.isBlank())throw new IllegalArgumentException("Cliente inválido.");}}`;
const CONTRACT_SERVICE = `public record ServicoContratado125(String nome,DinheiroContrato125 valorMensal){public ServicoContratado125{if(nome==null||nome.isBlank()||valorMensal==null||!valorMensal.positivo())throw new IllegalArgumentException("Serviço inválido.");}}`;
const CONTRACT_MONEY = `import java.math.BigDecimal;import java.math.RoundingMode;
public record DinheiroContrato125(BigDecimal valor){public DinheiroContrato125{if(valor==null||valor.signum()<=0)throw new IllegalArgumentException("Valor inválido.");valor=valor.setScale(2,RoundingMode.HALF_UP);}public boolean positivo(){return valor.signum()>0;}}`;
const CONTRACT_PERIOD = `import java.time.LocalDate;import java.time.temporal.ChronoUnit;
public record PeriodoContrato125(LocalDate inicio,LocalDate fim){public PeriodoContrato125{if(inicio==null||fim==null||fim.isBefore(inicio))throw new IllegalArgumentException("Período inválido.");}public long meses(){return ChronoUnit.MONTHS.between(inicio.withDayOfMonth(1),fim.withDayOfMonth(1))+1;}}`;
const CONTRACT_STATUS = `public enum StatusContratoSeparado125 { RASCUNHO, ATIVO, CANCELADO }`;
const CONTRACT_TEST = `import java.math.BigDecimal;import java.time.LocalDate;
public class TesteArquivos125{private static int testes;public static void main(String[]args){ClienteCorporativo125 c=new ClienteCorporativo125(10,"Acme",true);ServicoContratado125 s=new ServicoContratado125("Suporte",new DinheiroContrato125(new BigDecimal("200")));PeriodoContrato125 p=new PeriodoContrato125(LocalDate.of(2026,7,1),LocalDate.of(2026,9,30));ContratoSeparado125 x=new ContratoSeparado125("CONT-001",c,s,p);check(x.status()==StatusContratoSeparado125.RASCUNHO);check(x.valorTotal().compareTo(new BigDecimal("600.00"))==0);x.ativar();check(x.status()==StatusContratoSeparado125.ATIVO);x.cancelar();check(x.status()==StatusContratoSeparado125.CANCELADO);expectState(x::cancelar);expectArgument(()->new PeriodoContrato125(LocalDate.of(2026,9,1),LocalDate.of(2026,8,1)));expectArgument(()->new DinheiroContrato125(BigDecimal.ZERO));expectState(()->new ContratoSeparado125("C",new ClienteCorporativo125(11,"Inativa",false),s,p).ativar());System.out.println(testes+" testes passaram");}private static void check(boolean c){testes++;if(!c)throw new AssertionError();}private static void expectState(Runnable a){try{a.run();throw new AssertionError();}catch(IllegalStateException e){testes++;}}private static void expectArgument(Runnable a){try{a.run();throw new AssertionError();}catch(IllegalArgumentException e){testes++;}}}`;

const ERRORS = [
  [
    "Arquivo ≠ classe public",
    "Pedido está declarado dentro de Cliente.java.",
    "Renomeie o arquivo ou a classe com refatoração segura.",
  ],
  [
    "Duas classes public",
    "Um único .java tenta expor Cliente e Pedido no topo.",
    "Crie Cliente.java e Pedido.java, uma pública em cada.",
  ],
  [
    "Arquivo gigante",
    "Main, entidades, valores e enums crescem na mesma rolagem.",
    "Extraia conceitos importantes para arquivos próprios.",
  ],
  [
    "Nomes genéricos",
    "Classe1.java e Dados.java não ajudam navegação.",
    "Nomeie pelo conceito: Pedido, Dinheiro, PeriodoAtendimento.",
  ],
  [
    "Classe duplicada",
    "Dois arquivos do diretório declaram PedidoSeparado125.",
    "Mantenha nomes únicos no mesmo pacote e remova cópias antigas.",
  ],
  [
    "Regra dentro de App",
    "ContratoApp calcula preço e decide status.",
    "App monta e executa; o domínio protege suas próprias regras.",
  ],
  [
    "Separar cedo demais",
    "Cada detalhe descartável vira arquivo sem autonomia.",
    "Mantenha auxiliar mínimo junto até ganhar significado ou evolução.",
  ],
  [
    "Arquivo = arquitetura",
    "Tudo foi separado, mas responsabilidades continuam misturadas.",
    "Organização física deve acompanhar modelagem conceitual.",
  ],
];

const PEDIDO_FILES = [
  ["PedidoSeparadoApp125.java", PEDIDO_APP],
  ["PedidoSeparado125.java", PEDIDO_ENTITY],
  ["ClienteSeparado125.java", PEDIDO_CLIENT],
  ["DinheiroSeparado125.java", PEDIDO_MONEY],
  ["StatusPedidoSeparado125.java", PEDIDO_STATUS],
];
const OS_FILES = [
  ["OrdemServicoApp125.java", OS_APP],
  ["OrdemServicoSeparada125.java", OS_ENTITY],
  ["CodigoOsSeparado125.java", OS_CODE],
  ["PeriodoSeparado125.java", OS_PERIOD],
  ["StatusOsSeparado125.java", OS_STATUS],
  ["TurnoSeparado125.java", OS_SHIFT],
];
const CONTRACT_FILES = [
  ["ContratoApp125.java", CONTRACT_APP],
  ["ContratoSeparado125.java", CONTRACT_ENTITY],
  ["ClienteCorporativo125.java", CONTRACT_CLIENT],
  ["ServicoContratado125.java", CONTRACT_SERVICE],
  ["DinheiroContrato125.java", CONTRACT_MONEY],
  ["PeriodoContrato125.java", CONTRACT_PERIOD],
  ["StatusContratoSeparado125.java", CONTRACT_STATUS],
  ["TesteArquivos125.java", CONTRACT_TEST],
];
const EVIDENCE = `# Aula 125 — classes em arquivos
- [ ] Relacionei classe public e nome do arquivo
- [ ] Reproduzi dois erros do compilador
- [ ] Diferenciei public e package-private
- [ ] Comparei arquivo didático e domínio separado
- [ ] Compilei múltiplos arquivos com javac *.java
- [ ] Naveguei pelo mock do IntelliJ
- [ ] Separei App de regra de domínio
- [ ] Entreguei Contrato em 8 arquivos e 8 testes`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button type="button" className="guided-copy" onClick={copy}>
      <Copy size={14} />
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
function CodePanel({ name, code }) {
  return (
    <section className="guided-file">
      <div className="guided-file-title">
        <FileCode2 size={16} />
        {name}
        <CopyButton value={code} />
      </div>
      <SyntaxHighlighter
        language="java"
        style={vscDarkPlus}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: "18px",
          background: "#0f172a",
          fontSize: ".78rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </section>
  );
}
function FileExplorer({ files, active, onSelect }) {
  return (
    <aside className="cf125-tree">
      <div>
        <FolderTree size={16} />
        Project
      </div>
      {files.map(([name], i) => (
        <button
          type="button"
          className={i === active ? "active" : ""}
          onClick={() => onSelect(i)}
          key={name}
        >
          <FileCode2 size={14} />
          {name}
        </button>
      ))}
    </aside>
  );
}
function FileWorkspace({ files, title }) {
  const [active, setActive] = useState(0);
  return (
    <section className="cf125-workspace">
      <header>
        <span>{title}</span>
        <small>
          {files.length} arquivos · um conceito importante por arquivo
        </small>
      </header>
      <div>
        <FileExplorer files={files} active={active} onSelect={setActive} />
        <CodePanel name={files[active][0]} code={files[active][1]} />
      </div>
    </section>
  );
}

function PublicRuleLab() {
  const [valid, setValid] = useState(true);
  return (
    <section className="cf125-stack">
      <div className="cf125-rule">
        <header>
          <button
            type="button"
            className={valid ? "active" : ""}
            onClick={() => setValid(true)}
          >
            ClienteArquivo125.java
          </button>
          <button
            type="button"
            className={!valid ? "danger" : ""}
            onClick={() => setValid(false)}
          >
            Cliente.java
          </button>
        </header>
        <main className={valid ? "safe" : "danger"}>
          <section>
            <FileCode2 />
            <b>{valid ? "ClienteArquivo125.java" : "Cliente.java"}</b>
          </section>
          <ArrowRight />
          <section>
            <span>public class</span>
            <b>{valid ? "ClienteArquivo125" : "PedidoNome125"}</b>
          </section>
          <strong>{valid ? "NOMES COINCIDEM" : "NÃO COMPILA"}</strong>
        </main>
      </div>
      <CodePanel
        name={valid ? "ClienteArquivo125.java" : "Cliente.java"}
        code={valid ? SINGLE_SOURCE : INVALID_FILENAME}
      />
    </section>
  );
}
function CompilerErrorsLab() {
  const [caseName, setCaseName] = useState("two");
  return (
    <section className="cf125-stack">
      <div className="cf125-errors-terminal">
        <nav>
          <button
            type="button"
            className={caseName === "two" ? "active" : ""}
            onClick={() => setCaseName("two")}
          >
            Duas public
          </button>
          <button
            type="button"
            className={caseName === "name" ? "active" : ""}
            onClick={() => setCaseName("name")}
          >
            Nome diferente
          </button>
        </nav>
        <main>
          <TerminalSquare />
          <span>
            javac{" "}
            {caseName === "two" ? "DuasPublic125.java" : "ClienteNome125.java"}
          </span>
          <pre>
            {caseName === "two"
              ? "class ClientePublico125 is public, should be declared in ClientePublico125.java\nclass PedidoPublico125 is public, should be declared in PedidoPublico125.java"
              : "class PedidoNome125 is public, should be declared in a file named PedidoNome125.java"}
          </pre>
        </main>
      </div>
      <CodePanel
        name={caseName === "two" ? "DuasPublic125.java" : "ClienteNome125.java"}
        code={caseName === "two" ? INVALID_TWO_PUBLIC : INVALID_FILENAME}
      />
    </section>
  );
}
function VisibilityLab() {
  const [choice, setChoice] = useState("public");
  return (
    <section className="cf125-stack">
      <div className="cf125-visibility">
        <nav>
          <button
            type="button"
            className={choice === "public" ? "active" : ""}
            onClick={() => setChoice("public")}
          >
            public class
          </button>
          <button
            type="button"
            className={choice === "aux" ? "active" : ""}
            onClick={() => setChoice("aux")}
          >
            class auxiliar
          </button>
        </nav>
        <main>
          <section>
            <b>
              {choice === "public" ? "ClienteArquivo125" : "ClienteAuxiliar125"}
            </b>
            <code>
              {choice === "public" ? "public class" : "class (package-private)"}
            </code>
          </section>
          <ArrowRight />
          <section>
            <b>
              {choice === "public"
                ? "exposta pelo arquivo"
                : "visível no mesmo pacote"}
            </b>
            <p>
              {choice === "public"
                ? "Exige arquivo com o mesmo nome e pode ser usada como API pública."
                : "Pode coexistir no arquivo para exemplo pequeno, mas deve ser extraída se ganhar importância."}
            </p>
          </section>
        </main>
      </div>
    </section>
  );
}
function GrowthLab() {
  const [count, setCount] = useState(4);
  const concepts = [
    "App",
    "Pedido",
    "Cliente",
    "Dinheiro",
    "Status",
    "Pagamento",
    "Produto",
    "Auditoria",
  ];
  return (
    <section className="cf125-stack">
      <div className="cf125-growth">
        <header>
          <span>PedidoEmUmArquivo125.java</span>
          <strong>{count} classes/conceitos</strong>
        </header>
        <main>
          {concepts.slice(0, count).map((item, i) => (
            <button type="button" key={item}>
              <span>{i + 1}</span>
              {item}
            </button>
          ))}
        </main>
        <footer>
          <button
            type="button"
            disabled={count === concepts.length}
            onClick={() => setCount((v) => v + 1)}
          >
            Simular crescimento
          </button>
          <p>
            {count < 6
              ? "Didático e linear; ainda cabe na tela."
              : "Rolagem, conflitos, reuso e testes começam a sofrer."}
          </p>
        </footer>
      </div>
      <CodePanel name="PedidoEmUmArquivo125.java" code={ONE_FILE_SOURCE} />
    </section>
  );
}
function CompileLab() {
  const [command, setCommand] = useState("all");
  return (
    <section className="cf125-stack">
      <div className="cf125-compile">
        <nav>
          <button
            type="button"
            className={command === "one" ? "active" : ""}
            onClick={() => setCommand("one")}
          >
            arquivo único
          </button>
          <button
            type="button"
            className={command === "all" ? "active" : ""}
            onClick={() => setCommand("all")}
          >
            múltiplos
          </button>
        </nav>
        <main>
          <TerminalSquare />
          <pre>
            {command === "one"
              ? "> javac PedidoEmUmArquivo125.java\n> java PedidoEmUmArquivo125\nPedido 1001 | Ana Silva | R$ 399.80"
              : "> javac *.java\n> java PedidoSeparadoApp125\nPedido 1001 | Cliente 10 - Ana Silva | R$ 399.80 | PAGO"}
          </pre>
          <p>
            {command === "all"
              ? "O curinga entrega todos os .java da pasta ao compilador; a classe App continua sendo o ponto de execução."
              : "Um arquivo contém todas as classes auxiliares e gera vários .class."}
          </p>
        </main>
      </div>
    </section>
  );
}
function IntelliJLab() {
  const [active, setActive] = useState(1);
  const actions = [
    "New Java Class",
    "Rename",
    "Move",
    "Find Usages",
    "Navigate to Class",
  ];
  return (
    <section className="cf125-stack">
      <div className="cf125-ide">
        <header>
          <span>IntelliJ IDEA · Project</span>
          <div>
            <Search size={14} />
            Search Everywhere
          </div>
        </header>
        <section>
          <FileExplorer
            files={PEDIDO_FILES}
            active={active}
            onSelect={setActive}
          />
          <main>
            <div className="cf125-tabs">
              <span>{PEDIDO_FILES[active][0]}</span>
            </div>
            <pre>{`public class ${PEDIDO_FILES[active][0].replace(".java", "")} {\n    // Ctrl + clique navega para a declaração\n}`}</pre>
            <footer>
              {actions.map((action) => (
                <button type="button" key={action}>
                  {action}
                </button>
              ))}
            </footer>
          </main>
        </section>
      </div>
      <p className="guided-note">
        <ShieldCheck size={18} />
        <span>
          Use Rename e Move da IDE para atualizar referências; renomear só o
          arquivo pode quebrar a classe public.
        </span>
      </p>
    </section>
  );
}
function DecisionLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    ["Entidade Pedido", true, "identidade, ciclo, regras e testes"],
    ["Objeto de valor Dinheiro", true, "reuso e invariantes próprias"],
    ["Enum StatusPedido", true, "vocabulário usado por várias classes"],
    [
      "Auxiliar de 5 linhas do exemplo",
      false,
      "sem identidade nem evolução independente",
    ],
    ["Classe App", true, "ponto de execução separado do domínio"],
  ];
  const c = cases[selected];
  return (
    <section className="cf125-stack">
      <div className="cf125-decision">
        <nav>
          {cases.map((x, i) => (
            <button
              type="button"
              className={i === selected ? "active" : ""}
              onClick={() => setSelected(i)}
              key={x[0]}
            >
              <span>{i + 1}</span>
              {x[0]}
            </button>
          ))}
        </nav>
        <main>
          <Files />
          <span>DECISÃO FÍSICA</span>
          <h3>{c[0]}</h3>
          <strong>{c[1] ? "ARQUIVO PRÓPRIO" : "PODE FICAR JUNTO"}</strong>
          <p>{c[2]}</p>
        </main>
      </div>
      <section className="guided-challenge">
        <div className="guided-challenge-title">
          <Sparkles size={22} />
          <h3>Arquivo não substitui arquitetura</h3>
        </div>
        <p>
          Separar fisicamente ajuda navegação; responsabilidade, encapsulamento
          e bons nomes continuam sendo decisões conceituais.
        </p>
      </section>
    </section>
  );
}
function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    [
      "PedidoSeparadoApp125.java",
      "new ClienteSeparado125",
      "Ctrl+clique abre ClienteSeparado125.java",
    ],
    [
      "ClienteSeparado125.java",
      "construtor",
      "o arquivo contém a responsabilidade do cliente",
    ],
    [
      "DinheiroSeparado125.java",
      'de("399.80")',
      "Navigate to Declaration chega ao valor",
    ],
    [
      "PedidoSeparado125.java",
      "new PedidoSeparado125",
      "a entidade recebe seus colaboradores",
    ],
    [
      "StatusPedidoSeparado125.java",
      "Status.CRIADO",
      "Find Usages mostra quem usa o enum",
    ],
    [
      "OrdemServicoSeparada125.java",
      "reagendar",
      "a regra da OS não está no App",
    ],
  ];
  const f = frames[step];
  return (
    <section className="cf125-stack">
      <div className="cf125-debug">
        <div>
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((v) => v - 1)}
          >
            <ArrowLeft size={15} />
            Voltar
          </button>
          <button
            type="button"
            disabled={step === frames.length - 1}
            onClick={() => setStep((v) => v + 1)}
          >
            <StepForward size={15} />
            Navegar
          </button>
          <span>
            {step + 1}/{frames.length}
          </span>
        </div>
        <section>
          <aside>
            {frames.map((x, i) => (
              <button
                type="button"
                className={i === step ? "active" : ""}
                onClick={() => setStep(i)}
                key={x[0]}
              >
                <span>{i + 1}</span>
                {x[0]}
              </button>
            ))}
          </aside>
          <main>
            <span>IDE · DECLARAÇÃO E USOS</span>
            <h3>{f[0]}</h3>
            <code>{f[1]}</code>
            <p>{f[2]}</p>
          </main>
        </section>
      </div>
    </section>
  );
}
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const c = ERRORS[selected];
  return (
    <section className="cf125-stack">
      <div className="cf125-errors">
        <nav>
          {ERRORS.map((x, i) => (
            <button
              type="button"
              className={i === selected ? "active" : ""}
              onClick={() => setSelected(i)}
              key={x[0]}
            >
              <span>{i + 1}</span>
              <span className="guided-error-label">{x[0]}</span>
            </button>
          ))}
        </nav>
        <main>
          <span>
            <AlertTriangle size={16} />
            CASO {selected + 1} DE 8
          </span>
          <h3>{c[0]}</h3>
          <section>
            <div>
              <b>Sintoma</b>
              <p>{c[1]}</p>
            </div>
            <ArrowRight />
            <div>
              <b>Como corrigir</b>
              <p>{c[2]}</p>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}
function DeliveryLab() {
  const [active, setActive] = useState(0);
  const [checked, setChecked] = useState(() => new Set());
  const tasks = [
    "8 arquivos",
    "1 public/arquivo",
    "App sem regra",
    "Entidade",
    "Valores",
    "8 testes",
  ];
  const toggle = (i) =>
    setChecked((c) => {
      const n = new Set(c);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  return (
    <section className="cf125-stack">
      <div className="cf125-workspace">
        <header>
          <span>contrato-separado/</span>
          <small>desafio final</small>
        </header>
        <div>
          <FileExplorer
            files={CONTRACT_FILES}
            active={active}
            onSelect={setActive}
          />
          <CodePanel
            name={CONTRACT_FILES[active][0]}
            code={CONTRACT_FILES[active][1]}
          />
        </div>
      </div>
      <div className="guided-console">
        <div className="guided-console-title">
          <Play size={15} />
          Terminal
        </div>
        <pre>{`> javac *.java
> java ContratoApp125
CONT-001 | Acme | ATIVO | total=R$ 600.00
> java TesteArquivos125
8 testes passaram
> git add labs/m4/aula-125-organizacao-classes-arquivos
> git commit -m "Aula 125: organiza classes Java em arquivos"`}</pre>
      </div>
      <div className="cf125-checklist">
        {tasks.map((x, i) => (
          <button
            type="button"
            className={checked.has(i) ? "done" : ""}
            onClick={() => toggle(i)}
            key={x}
          >
            <span>{checked.has(i) ? <Check size={14} /> : i + 1}</span>
            {x}
          </button>
        ))}
      </div>
      <section className="guided-file">
        <div className="guided-file-title">
          <FileCode2 size={16} />
          README.md · evidências
          <CopyButton value={EVIDENCE} />
        </div>
        <SyntaxHighlighter
          language="markdown"
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: "18px", background: "#0f172a" }}
        >
          {EVIDENCE}
        </SyntaxHighlighter>
      </section>
    </section>
  );
}

const steps = [
  {
    id: "rule",
    label: "Classe e Arquivo",
    duration: "13 min",
    eyebrow: "REGRA DA CLASSE PUBLIC",
    title: "Faça o nome do arquivo assinar o mesmo contrato da classe",
    blocks: [
      {
        type: "lead",
        text: "Uma classe public de topo precisa morar no arquivo de mesmo nome. Essa previsibilidade permite ao compilador, à IDE e ao time localizar o conceito.",
      },
      { type: "rule" },
    ],
  },
  {
    id: "compiler",
    label: "Erros do Compilador",
    duration: "13 min",
    eyebrow: "DUAS PUBLIC E NOME INCORRETO",
    title: "Provoque as duas violações fundamentais",
    blocks: [
      {
        type: "lead",
        text: "O javac não negocia: duas classes públicas exigem dois arquivos; uma classe pública exige o arquivo que carrega seu nome.",
      },
      { type: "compiler" },
    ],
  },
  {
    id: "visibility",
    label: "public ou Auxiliar",
    duration: "12 min",
    eyebrow: "TOPO PÚBLICO E PACKAGE-PRIVATE",
    title: "Entenda por que uma auxiliar pode coexistir no exemplo",
    blocks: [
      {
        type: "lead",
        text: "Classe sem public pode ficar no mesmo arquivo e é visível no pacote. Poder fazer isso ajuda exemplos pequenos, mas não torna a decisão ideal quando o conceito cresce.",
      },
      { type: "visibility" },
    ],
  },
  {
    id: "growth",
    label: "Quando o Arquivo Cresce",
    duration: "14 min",
    eyebrow: "DIDÁTICA VERSUS ESCALA",
    title: "Faça quatro conceitos virarem oito na mesma rolagem",
    blocks: [
      {
        type: "lead",
        text: "Um arquivo completo facilita a aula. Conforme regras, testes e colaborações surgem, o mesmo formato prejudica navegação, reuso e manutenção.",
      },
      { type: "growth" },
    ],
  },
  {
    id: "pedido",
    label: "Pedido Separado",
    duration: "18 min",
    eyebrow: "APP, ENTIDADE, CLIENTE, VALOR E ENUM",
    title: "Navegue por um domínio com um conceito por arquivo",
    blocks: [
      {
        type: "lead",
        text: "A separação física dá endereço previsível a cada responsabilidade e começa a explicitar a API pública usada entre classes.",
      },
      { type: "pedido" },
    ],
  },
  {
    id: "compile",
    label: "Compilar Múltiplos",
    duration: "13 min",
    eyebrow: "JAVAC CURINGA E CLASSE MAIN",
    title: "Compile todos os arquivos e execute somente a App",
    blocks: [
      {
        type: "lead",
        text: "javac *.java compila as fontes da pasta; java PedidoSeparadoApp125 executa a classe que contém main. Os arquivos separados colaboram no mesmo programa.",
      },
      { type: "compile" },
    ],
  },
  {
    id: "ide",
    label: "IntelliJ Guiado",
    duration: "16 min",
    eyebrow: "PROJECT, RENAME, MOVE E FIND USAGES",
    title: "Use a IDE para navegar e refatorar com segurança",
    blocks: [
      {
        type: "lead",
        text: "Quando nome e arquivo coincidem, Ctrl+clique, Navigate to Class e Find Usages viram ferramentas confiáveis. Rename deve alterar classe e referências juntas.",
      },
      { type: "ide" },
    ],
  },
  {
    id: "os",
    label: "OS em Arquivos",
    duration: "17 min",
    eyebrow: "ENTIDADE, CÓDIGO, PERÍODO E ENUMS",
    title: "Separe a OS por conceitos que evoluem de forma independente",
    blocks: [
      {
        type: "lead",
        text: "Código e período carregam invariantes próprias; status e turno são vocabulário; a entidade coordena o ciclo. Cada um ganha um arquivo encontrável.",
      },
      { type: "os" },
    ],
  },
  {
    id: "decision",
    label: "Critério de Separação",
    duration: "14 min",
    eyebrow: "IMPORTÂNCIA, REUSO, REGRA E TESTE",
    title: "Decida o que merece arquivo próprio sem fragmentar por hábito",
    blocks: [
      {
        type: "lead",
        text: "Conceitos fortes, reutilizados, testáveis e evolutivos merecem endereço próprio. Auxiliar mínimo pode permanecer junto até adquirir significado.",
      },
      { type: "decision" },
    ],
  },
  {
    id: "debug-errors",
    label: "Navegação e Clínica",
    duration: "18 min",
    eyebrow: "SEIS SALTOS E OITO DIAGNÓSTICOS",
    title: "Use organização como ferramenta de investigação",
    blocks: [
      {
        type: "lead",
        text: "O debug agora inclui navegar entre declarações e usos; a clínica separa erros de linguagem, decisões físicas e problemas de modelagem.",
      },
      { type: "debug" },
      { type: "errors" },
    ],
  },
  {
    id: "delivery",
    label: "Entrega & Contrato",
    duration: "29 min",
    eyebrow: "OITO ARQUIVOS E OITO TESTES",
    title: "Entregue um domínio separado sem empurrar regra para a App",
    blocks: [
      {
        type: "lead",
        text: "Contrato, cliente, serviço, dinheiro, período, status, App e teste formam uma entrega compilável com uma classe pública por arquivo.",
      },
      { type: "delivery" },
    ],
  },
];
function ContentBlock({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = {
    rule: PublicRuleLab,
    compiler: CompilerErrorsLab,
    visibility: VisibilityLab,
    growth: GrowthLab,
    pedido: () => (
      <FileWorkspace files={PEDIDO_FILES} title="pedido-separado/" />
    ),
    compile: CompileLab,
    ide: IntelliJLab,
    os: () => <FileWorkspace files={OS_FILES} title="os-separada/" />,
    decision: DecisionLab,
    debug: DebugLab,
    errors: ErrorsClinic,
    delivery: DeliveryLab,
  };
  const C = map[block.type];
  return C ? <C /> : null;
}

export default function GuidedClassFilesLesson125({
  isCompleted,
  onToggleCompleted,
  onNextLesson,
  onPrevLesson,
  hasNextLesson,
  hasPrevLesson,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const normalized = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const ids = new Set(steps.map((x) => x.id));
      return new Set(
        Array.isArray(saved) ? saved.filter((id) => ids.has(id)) : [],
      );
    } catch {
      return new Set();
    }
  });
  useEffect(
    () =>
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])),
    [completedSteps],
  );
  useEffect(() => {
    if (
      !normalized.current &&
      isCompleted &&
      completedSteps.size !== steps.length
    ) {
      normalized.current = true;
      onToggleCompleted();
    }
  }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => {
    const active = navRef.current?.querySelector("button.active");
    if (active && window.matchMedia("(max-width: 900px)").matches)
      active.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
  }, [activeIndex]);
  const step = steps[activeIndex],
    stepDone = completedSteps.has(step.id),
    allStepsDone = completedSteps.size === steps.length,
    lessonComplete = isCompleted && allStepsDone;
  const selectStep = (index) => {
    setActiveIndex(index);
    document
      .querySelector(".guided-layout")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const toggleStep = () => {
    if (stepDone && isCompleted) onToggleCompleted();
    setCompletedSteps((c) => {
      const n = new Set(c);
      if (n.has(step.id)) n.delete(step.id);
      else n.add(step.id);
      return n;
    });
  };
  return (
    <article className="guided-git-lesson guided-class-files-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker">
            <FolderTree size={17} />
            Oficina de organização física
          </span>
          <p className="guided-sequence">125 · M4.21</p>
          <h1>Dê a cada conceito importante um arquivo fácil de encontrar</h1>
          <p>
            Aprenda as regras de classe pública, provoque erros do compilador,
            refatore no mock do IntelliJ e entregue Pedido, OS e Contrato em
            múltiplos arquivos.
          </p>
        </div>
        <div className="guided-hero-status">
          <ShieldCheck size={42} />
          <strong>
            {Math.round((completedSteps.size / steps.length) * 100)}%
          </strong>
          <span>
            {completedSteps.size} de {steps.length} etapas concluídas
          </span>
        </div>
      </header>
      <GuidedLessonFacts
        ariaLabel="Resumo da aula 125"
        items={[
          { value: "23 fontes", label: "21 válidas + 2 erros" },
          { value: "3 árvores", label: "Pedido, OS e Contrato" },
          { value: "8 casos", label: "Na clínica de erros" },
        ]}
      />
      <div className="guided-layout">
        <nav
          ref={navRef}
          className="guided-step-nav"
          aria-label="Roteiro prático da aula 125"
        >
          <div className="guided-step-nav-title">
            <ListChecks size={18} />
            Roteiro prático
          </div>
          {steps.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={
                (index === activeIndex ? "active " : "") +
                (completedSteps.has(item.id) ? "done" : "")
              }
              onClick={() => selectStep(index)}
            >
              <span className="guided-step-number">
                {completedSteps.has(item.id) ? (
                  <Check size={14} />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.duration}</small>
              </span>
            </button>
          ))}
        </nav>
        <main className="guided-step-content">
          <div className="guided-step-heading">
            <span>
              {step.eyebrow} · {step.duration}
            </span>
            <h2>{step.title}</h2>
          </div>
          {step.blocks.map((block, index) => (
            <ContentBlock key={block.type + index} block={block} />
          ))}
          <div className="guided-step-actions">
            <button
              type="button"
              className="secondary"
              disabled={activeIndex === 0}
              onClick={() => selectStep(activeIndex - 1)}
            >
              <ArrowLeft size={17} />
              Etapa anterior
            </button>
            <div className="guided-step-actions-main">
              <button
                type="button"
                className={"step-toggle " + (stepDone ? "undo" : "complete")}
                onClick={toggleStep}
              >
                {stepDone ? (
                  <>
                    <RotateCcw size={16} />
                    Desmarcar etapa
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Concluir etapa
                  </>
                )}
              </button>
              {activeIndex < steps.length - 1 && (
                <button
                  type="button"
                  className="primary"
                  disabled={!stepDone}
                  onClick={() => selectStep(activeIndex + 1)}
                >
                  Próxima etapa
                  <ArrowRight size={17} />
                </button>
              )}
            </div>
          </div>
          {allStepsDone && (
            <section className="guided-finish">
              <CheckCircle2 size={30} />
              <div>
                <h3>Organização física comprovada</h3>
                <p>
                  {lessonComplete
                    ? "Aula concluída: avance para pacotes de domínio."
                    : "Compile o Contrato e os oito testes antes de concluir."}
                </p>
              </div>
              <button type="button" onClick={onToggleCompleted}>
                {lessonComplete ? "Reabrir aula" : "Concluir aula"}
              </button>
            </section>
          )}
        </main>
      </div>
      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}>
          <ArrowLeft size={17} />
          Aula 124
        </button>
        <div
          className={
            "guided-course-status " +
            (lessonComplete ? "completed" : allStepsDone ? "ready" : "")
          }
        >
          <Clock3 size={18} />
          <span>
            <strong>
              {lessonComplete
                ? "Aula concluída"
                : completedSteps.size + " de " + steps.length + " etapas"}
            </strong>
            <small>public, arquivos, IDE, compilação, domínio e App</small>
          </span>
        </div>
        <button
          type="button"
          onClick={onNextLesson}
          disabled={!hasNextLesson || !lessonComplete}
        >
          Aula 126
          <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
