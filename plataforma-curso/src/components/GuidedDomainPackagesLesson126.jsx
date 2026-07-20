import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  FileCode2,
  FolderTree,
  ListChecks,
  Package,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  StepForward,
  TerminalSquare,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedDomainPackagesLesson.css";

const STORAGE_KEY = "guided-domain-packages-lesson-126-progress";
const CLIENTE = `package br.com.curso.aula126.dominio.cliente;
public class Cliente {
    private final int id; private final String nome; private final boolean ativo;
    public Cliente(int id,String nome){this(id,nome,true);}
    public Cliente(int id,String nome,boolean ativo){
        if(id<=0||nome==null||nome.isBlank()) throw new IllegalArgumentException("Cliente inválido.");
        this.id=id;this.nome=nome;this.ativo=ativo;
    }
    public boolean ativo(){return ativo;}
    public String resumo(){return "Cliente "+id+" - "+nome+" | Ativo: "+ativo;}
}`;
const DINHEIRO = `package br.com.curso.aula126.dominio.valor;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;
public final class Dinheiro {
    private final BigDecimal valor;
    private Dinheiro(BigDecimal valor){if(valor==null)throw new IllegalArgumentException("Valor obrigatório.");this.valor=valor.setScale(2,RoundingMode.HALF_UP);}
    public static Dinheiro de(String valor){if(valor==null||valor.isBlank())throw new IllegalArgumentException("Valor obrigatório.");return new Dinheiro(new BigDecimal(valor));}
    public static Dinheiro zero(){return new Dinheiro(BigDecimal.ZERO);}
    public boolean positivo(){return valor.signum()>0;}
    public boolean maiorOuIgual(Dinheiro outro){return outro!=null&&valor.compareTo(outro.valor)>=0;}
    public Dinheiro somar(Dinheiro outro){if(outro==null)throw new IllegalArgumentException("Outro valor obrigatório.");return new Dinheiro(valor.add(outro.valor));}
    @Override public boolean equals(Object outro){return this==outro||(outro!=null&&getClass()==outro.getClass()&&Objects.equals(valor,((Dinheiro)outro).valor));}
    @Override public int hashCode(){return Objects.hash(valor);}
    @Override public String toString(){return "R$ "+valor;}
}`;
const STATUS_PEDIDO = `package br.com.curso.aula126.dominio.pedido;
public enum StatusPedido { CRIADO, PAGO, CANCELADO }`;
const PEDIDO = `package br.com.curso.aula126.dominio.pedido;
import br.com.curso.aula126.dominio.cliente.Cliente;
import br.com.curso.aula126.dominio.valor.Dinheiro;
public class Pedido {
    private final int numero;private final Cliente cliente;private final Dinheiro total;private StatusPedido status=StatusPedido.CRIADO;
    public Pedido(int numero,Cliente cliente,Dinheiro total){if(numero<=0||cliente==null||total==null||!total.positivo())throw new IllegalArgumentException("Pedido inválido.");if(!cliente.ativo())throw new IllegalStateException("Cliente inativo.");this.numero=numero;this.cliente=cliente;this.total=total;}
    public void confirmarPagamento(Dinheiro pago){if(status!=StatusPedido.CRIADO)throw new IllegalStateException("Pedido não está criado.");if(!pago.maiorOuIgual(total))throw new IllegalArgumentException("Pagamento insuficiente.");status=StatusPedido.PAGO;}
    public void cancelar(String motivo){if(motivo==null||motivo.isBlank())throw new IllegalArgumentException("Motivo obrigatório.");if(status==StatusPedido.PAGO)throw new IllegalStateException("Pedido pago.");status=StatusPedido.CANCELADO;}
    public String resumo(){return "Pedido "+numero+" | "+cliente.resumo()+" | Total: "+total+" | Status: "+status;}
}`;
const PEDIDO_APP = `package br.com.curso.aula126.app;
import br.com.curso.aula126.dominio.cliente.Cliente;
import br.com.curso.aula126.dominio.pedido.Pedido;
import br.com.curso.aula126.dominio.valor.Dinheiro;
public class PedidoApp {
    public static void main(String[]args){Cliente cliente=new Cliente(10,"Ana Silva");Pedido pedido=new Pedido(1001,cliente,Dinheiro.de("399.80"));System.out.println(pedido.resumo());pedido.confirmarPagamento(Dinheiro.de("399.80"));System.out.println(pedido.resumo());}
}`;
const CODIGO_OS = `package br.com.curso.aula126.dominio.os;
public record CodigoOs(String valor){public CodigoOs{if(valor==null||!valor.startsWith("OS-"))throw new IllegalArgumentException("Código inválido.");}@Override public String toString(){return valor;}}`;
const TURNO = `package br.com.curso.aula126.dominio.os;
public enum TurnoAtendimento { MANHA, TARDE }`;
const STATUS_OS = `package br.com.curso.aula126.dominio.os;
public enum StatusOs { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }`;
const PERIODO_OS = `package br.com.curso.aula126.dominio.os;
import java.time.LocalDate;
public record PeriodoAtendimento(LocalDate data,TurnoAtendimento turno){public PeriodoAtendimento{if(data==null||turno==null)throw new IllegalArgumentException("Período inválido.");}@Override public String toString(){return data+" - "+turno;}}`;
const ORDEM_SERVICO = `package br.com.curso.aula126.dominio.os;
public class OrdemServico {
    private final CodigoOs codigo;private final String cliente;private PeriodoAtendimento periodo;private StatusOs status=StatusOs.AGENDADA;private int reagendamentos;
    public OrdemServico(CodigoOs codigo,String cliente,PeriodoAtendimento periodo){if(codigo==null||cliente==null||cliente.isBlank()||periodo==null)throw new IllegalArgumentException("OS inválida.");this.codigo=codigo;this.cliente=cliente;this.periodo=periodo;}
    public void reagendar(PeriodoAtendimento novo){if(status==StatusOs.CONCLUIDA||status==StatusOs.CANCELADA)throw new IllegalStateException("OS encerrada.");if(novo==null)throw new IllegalArgumentException("Período obrigatório.");periodo=novo;status=StatusOs.REAGENDADA;reagendamentos++;}
    public void concluir(){if(status==StatusOs.CANCELADA)throw new IllegalStateException("OS cancelada.");status=StatusOs.CONCLUIDA;}
    public String resumo(){return "OS: "+codigo+" | Cliente: "+cliente+" | Período: "+periodo+" | Status: "+status+" | Reagendamentos: "+reagendamentos;}
}`;
const OS_APP = `package br.com.curso.aula126.appos;
import br.com.curso.aula126.dominio.os.*;
import java.time.LocalDate;
public class OrdemServicoApp {public static void main(String[]args){OrdemServico os=new OrdemServico(new CodigoOs("OS-2026-0001"),"Ana Silva",new PeriodoAtendimento(LocalDate.of(2026,7,20),TurnoAtendimento.MANHA));System.out.println(os.resumo());os.reagendar(new PeriodoAtendimento(LocalDate.of(2026,7,22),TurnoAtendimento.TARDE));System.out.println(os.resumo());}}`;
const PERIODO_CONTRATO = `package br.com.curso.aula126.dominio.contrato;
import java.time.LocalDate;
public record PeriodoContrato(LocalDate inicio,LocalDate fim){public PeriodoContrato{if(inicio==null||fim==null||fim.isBefore(inicio))throw new IllegalArgumentException("Período inválido.");}}`;
const STATUS_CONTRATO = `package br.com.curso.aula126.dominio.contrato;
public enum StatusContrato { RASCUNHO, ATIVO, CANCELADO }`;
const SERVICO = `package br.com.curso.aula126.dominio.servico;
import br.com.curso.aula126.dominio.valor.Dinheiro;
public record ServicoContratado(String nome,Dinheiro valorMensal){public ServicoContratado{if(nome==null||nome.isBlank()||valorMensal==null||!valorMensal.positivo())throw new IllegalArgumentException("Serviço inválido.");}}`;
const CONTRATO = `package br.com.curso.aula126.dominio.contrato;
import br.com.curso.aula126.dominio.servico.ServicoContratado;
public class Contrato {private final String codigo;private final ServicoContratado servico;private final PeriodoContrato periodo;private StatusContrato status=StatusContrato.RASCUNHO;public Contrato(String codigo,ServicoContratado servico,PeriodoContrato periodo){if(codigo==null||codigo.isBlank()||servico==null||periodo==null)throw new IllegalArgumentException("Contrato inválido.");this.codigo=codigo;this.servico=servico;this.periodo=periodo;}public void ativar(){if(status!=StatusContrato.RASCUNHO)throw new IllegalStateException("Contrato não está em rascunho.");status=StatusContrato.ATIVO;}public void cancelar(String motivo){if(motivo==null||motivo.isBlank())throw new IllegalArgumentException("Motivo obrigatório.");status=StatusContrato.CANCELADO;}public boolean ativo(){return status==StatusContrato.ATIVO;}public String resumo(){return codigo+" | "+servico.nome()+" | "+servico.valorMensal()+" | "+periodo.inicio()+" a "+periodo.fim()+" | "+status;}}`;
const CONTRATO_APP = `package br.com.curso.aula126.appcontrato;
import br.com.curso.aula126.dominio.contrato.*;
import br.com.curso.aula126.dominio.servico.ServicoContratado;
import br.com.curso.aula126.dominio.valor.Dinheiro;
import java.time.LocalDate;
public class ContratoApp {public static void main(String[]args){Contrato contrato=new Contrato("CONT-126",new ServicoContratado("Suporte",Dinheiro.de("200")),new PeriodoContrato(LocalDate.of(2026,7,1),LocalDate.of(2026,9,30)));contrato.ativar();System.out.println(contrato.resumo());}}`;
const TESTE = `package br.com.curso.aula126.appcontrato;
import br.com.curso.aula126.dominio.contrato.*;import br.com.curso.aula126.dominio.servico.ServicoContratado;import br.com.curso.aula126.dominio.valor.Dinheiro;import java.time.LocalDate;
public class TestePacotes126{private static int n;public static void main(String[]a){ServicoContratado s=new ServicoContratado("Suporte",Dinheiro.de("200"));PeriodoContrato p=new PeriodoContrato(LocalDate.of(2026,7,1),LocalDate.of(2026,9,30));Contrato c=new Contrato("C",s,p);check(!c.ativo());c.ativar();check(c.ativo());c.cancelar("fim");check(!c.ativo());expect(()->new PeriodoContrato(LocalDate.of(2026,8,1),LocalDate.of(2026,7,1)));expect(()->new ServicoContratado("",Dinheiro.de("1")));expect(()->new Contrato("",s,p));expect(()->c.cancelar(""));check(Dinheiro.de("2").maiorOuIgual(Dinheiro.de("1")));System.out.println(n+" testes passaram");}static void check(boolean ok){n++;if(!ok)throw new AssertionError();}static void expect(Runnable r){try{r.run();throw new AssertionError();}catch(IllegalArgumentException e){n++;}}}`;

const FILES = [
  ["src/br/com/curso/aula126/app/PedidoApp.java", PEDIDO_APP],
  ["src/br/com/curso/aula126/dominio/cliente/Cliente.java", CLIENTE],
  ["src/br/com/curso/aula126/dominio/pedido/Pedido.java", PEDIDO],
  ["src/br/com/curso/aula126/dominio/pedido/StatusPedido.java", STATUS_PEDIDO],
  ["src/br/com/curso/aula126/dominio/valor/Dinheiro.java", DINHEIRO],
  ["src/br/com/curso/aula126/appos/OrdemServicoApp.java", OS_APP],
  ["src/br/com/curso/aula126/dominio/os/CodigoOs.java", CODIGO_OS],
  ["src/br/com/curso/aula126/dominio/os/TurnoAtendimento.java", TURNO],
  ["src/br/com/curso/aula126/dominio/os/StatusOs.java", STATUS_OS],
  ["src/br/com/curso/aula126/dominio/os/PeriodoAtendimento.java", PERIODO_OS],
  ["src/br/com/curso/aula126/dominio/os/OrdemServico.java", ORDEM_SERVICO],
  ["src/br/com/curso/aula126/appcontrato/ContratoApp.java", CONTRATO_APP],
  ["src/br/com/curso/aula126/appcontrato/TestePacotes126.java", TESTE],
  ["src/br/com/curso/aula126/dominio/contrato/Contrato.java", CONTRATO],
  [
    "src/br/com/curso/aula126/dominio/contrato/PeriodoContrato.java",
    PERIODO_CONTRATO,
  ],
  [
    "src/br/com/curso/aula126/dominio/contrato/StatusContrato.java",
    STATUS_CONTRATO,
  ],
  ["src/br/com/curso/aula126/dominio/servico/ServicoContratado.java", SERVICO],
];
const ERRORS = [
  [
    "Package ≠ pasta",
    "Cliente.java declara dominio.pedido, mas mora em dominio.cliente.",
    "Mova pela IDE ou corrija package e caminho juntos.",
  ],
  [
    "Sem package",
    "A classe cai no pacote default e deixa de ser importável pelo projeto organizado.",
    "Declare package como primeira instrução útil.",
  ],
  [
    "Import ausente",
    "Pedido não encontra Cliente de outro pacote.",
    "Importe o nome qualificado ou use Alt+Enter.",
  ],
  [
    "Pai com estrela",
    "dominio.* não inclui dominio.cliente nem dominio.pedido.",
    "Importe cada tipo do subpacote necessário.",
  ],
  [
    "Execução curta",
    "java PedidoApp resulta em ClassNotFoundException.",
    "Use -cp out e br.com.curso.aula126.app.PedidoApp.",
  ],
  [
    "Maiúsculas ou hífen",
    "Dominio.Pedido e ordem-servico quebram convenção ou sintaxe.",
    "Use minúsculas, sem acento, espaço ou hífen.",
  ],
  [
    "Regra em app",
    "PedidoApp decide pagamento e altera status.",
    "App monta; Pedido protege a transição.",
  ],
  [
    "Pacote sem significado",
    "util, misc e coisas escondem o vocabulário do negócio.",
    "Agrupe por domínio com nomes que explicam o sistema.",
  ],
];
const EVIDENCE = `# Aula 126 — pacotes de domínio
- [ ] Relacionei package, namespace e pasta
- [ ] Mantive package, imports e classe na ordem
- [ ] Evitei pacote default
- [ ] Expliquei imports do mesmo pacote, outro pacote e java.lang
- [ ] Compilei com javac -d out
- [ ] Executei pelo classpath e nome qualificado
- [ ] Comparei organização técnica e por domínio
- [ ] Naveguei no mock do IntelliJ
- [ ] Executei Pedido, OS, Contrato e oito testes`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="pk126-copy"
      onClick={async () => {
        await navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      <Copy size={14} />
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
function CodePanel({ name, code }) {
  return (
    <section className="pk126-code">
      <header>
        <span>
          <FileCode2 size={15} />
          {name}
        </span>
        <CopyButton value={code} />
      </header>
      <SyntaxHighlighter
        language="java"
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{ margin: 0, padding: "18px", background: "#0f172a" }}
      >
        {code}
      </SyntaxHighlighter>
    </section>
  );
}
function NamespaceLab() {
  const [piece, setPiece] = useState(4);
  const parts = ["br", "com", "curso", "aula126", "dominio", "pedido"];
  return (
    <section className="pk126-stack">
      <div className="pk126-namespace">
        {parts.map((x, i) => (
          <button
            type="button"
            className={i <= piece ? "active" : ""}
            onClick={() => setPiece(i)}
            key={x}
          >
            <span>{x}</span>
            <small>
              {
                [
                  "país",
                  "tipo",
                  "organização",
                  "projeto/aula",
                  "área",
                  "contexto",
                ][i]
              }
            </small>
          </button>
        ))}
      </div>
      <div className="pk126-path">
        <Package />
        <code>{parts.slice(0, piece + 1).join(".")}</code>
        <ArrowDown />
        <code>{parts.slice(0, piece + 1).join("/")}/</code>
      </div>
    </section>
  );
}
function OrderLab() {
  const [mode, setMode] = useState("right");
  const right = `// comentários podem vir antes
package br.com.curso.aula126.dominio.pedido;

import br.com.curso.aula126.dominio.cliente.Cliente;

public class Pedido { }`;
  const wrong = `import br.com.curso.aula126.dominio.cliente.Cliente;
package br.com.curso.aula126.dominio.pedido;
public class Pedido { }`;
  return (
    <section className="pk126-stack">
      <div className="pk126-switch">
        <button
          type="button"
          className={mode === "right" ? "active" : ""}
          onClick={() => setMode("right")}
        >
          ordem correta
        </button>
        <button
          type="button"
          className={mode === "wrong" ? "active" : ""}
          onClick={() => setMode("wrong")}
        >
          erro controlado
        </button>
      </div>
      <CodePanel name="Pedido.java" code={mode === "right" ? right : wrong} />
      <p className={mode === "right" ? "guided-note" : "guided-warning"}>
        <ShieldCheck size={18} />
        <span>
          <b>
            {mode === "right"
              ? "package → imports → tipo"
              : "class, interface, enum, or record expected"}
          </b>
          <br />
          {mode === "right"
            ? "Package é a primeira instrução útil; somente comentários e espaços podem antecedê-lo."
            : "Um import não pode aparecer antes da declaração package."}
        </span>
      </p>
    </section>
  );
}
function DefaultLab() {
  const [organized, setOrganized] = useState(false);
  return (
    <section className="pk126-stack">
      <div className="pk126-default">
        <button
          type="button"
          onClick={() => setOrganized(false)}
          className={!organized ? "active" : ""}
        >
          pacote default
        </button>
        <button
          type="button"
          onClick={() => setOrganized(true)}
          className={organized ? "active" : ""}
        >
          pacote profissional
        </button>
        <main>
          <FolderTree size={34} />
          <h3>
            {organized
              ? "br.com.curso.aula126.dominio.cliente.Cliente"
              : "Cliente"}
          </h3>
          <p>
            {organized
              ? "Namespace único, importável e encontrável na árvore."
              : "Serve para exemplo mínimo; não comunica arquitetura e não escala."}
          </p>
        </main>
      </div>
    </section>
  );
}
function Workspace({ filter = "pedido" }) {
  const selectedFiles =
    filter === "pedido"
      ? FILES.slice(0, 5)
      : filter === "os"
        ? FILES.slice(5, 11)
        : FILES.slice(11);
  const [active, setActive] = useState(0);
  return (
    <section className="pk126-workspace">
      <header>
        <span>Project · aula-126-pacotes-de-dominio</span>
        <small>{selectedFiles.length} fontes</small>
      </header>
      <div>
        <nav>
          {selectedFiles.map((f, i) => (
            <button
              type="button"
              className={i === active ? "active" : ""}
              onClick={() => setActive(i)}
              key={f[0]}
            >
              <FileCode2 size={14} />
              <span>{f[0]}</span>
            </button>
          ))}
        </nav>
        <CodePanel
          name={selectedFiles[active][0]}
          code={selectedFiles[active][1]}
        />
      </div>
    </section>
  );
}
function ImportsLab() {
  const [choice, setChoice] = useState(0);
  const cases = [
    [
      "Cliente",
      "outro pacote",
      "import obrigatório",
      "br.com.curso.aula126.dominio.cliente.Cliente",
    ],
    [
      "Dinheiro",
      "outro pacote",
      "import obrigatório",
      "br.com.curso.aula126.dominio.valor.Dinheiro",
    ],
    [
      "StatusPedido",
      "mesmo pacote",
      "sem import",
      "br.com.curso.aula126.dominio.pedido",
    ],
    ["String", "java.lang", "sem import", "java.lang.String"],
    [
      "dominio.*",
      "pacote pai",
      "não alcança subpacote",
      "subpacotes são namespaces independentes",
    ],
  ];
  const c = cases[choice];
  return (
    <section className="pk126-stack">
      <div className="pk126-imports">
        <nav>
          {cases.map((x, i) => (
            <button
              type="button"
              className={i === choice ? "active" : ""}
              onClick={() => setChoice(i)}
              key={x[0]}
            >
              {x[0]}
            </button>
          ))}
        </nav>
        <main>
          <span>{c[1]}</span>
          <h3>{c[0]}</h3>
          <strong>{c[2]}</strong>
          <code>{c[3]}</code>
        </main>
      </div>
      <CodePanel name="Pedido.java · imports explícitos" code={PEDIDO} />
    </section>
  );
}
function CompileLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    [
      "fontes",
      "src/br/com/curso/aula126/.../*.java",
      "Package identifica cada fonte.",
    ],
    [
      "javac -d out",
      "javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName",
      "-d materializa a árvore de pacotes em out.",
    ],
    [
      "bytecode",
      "out/br/com/curso/aula126/app/PedidoApp.class",
      "O .class conserva o namespace.",
    ],
    [
      "java -cp out",
      "java -cp out br.com.curso.aula126.app.PedidoApp",
      "Classpath aponta a raiz; o nome qualificado encontra a classe.",
    ],
  ];
  const s = stages[stage];
  return (
    <section className="pk126-stack">
      <div className="pk126-pipeline">
        {stages.map((x, i) => (
          <button
            type="button"
            className={i === stage ? "active" : i < stage ? "done" : ""}
            onClick={() => setStage(i)}
            key={x[0]}
          >
            <span>{i + 1}</span>
            {x[0]}
          </button>
        ))}
      </div>
      <div className="guided-console">
        <div className="guided-console-title">
          <TerminalSquare size={15} />
          {s[0]}
        </div>
        <pre>{s[1]}</pre>
        <p>{s[2]}</p>
      </div>
      <div className="pk126-out">
        <FolderTree />
        <code>out/br/com/curso/aula126/</code>
        <span>app/PedidoApp.class</span>
        <span>dominio/pedido/Pedido.class</span>
        <span>dominio/cliente/Cliente.class</span>
        <span>dominio/valor/Dinheiro.class</span>
      </div>
    </section>
  );
}
function QualifiedLab() {
  const [qualified, setQualified] = useState(false);
  return (
    <section className="pk126-stack">
      <div className="pk126-run">
        <button
          type="button"
          onClick={() => setQualified(false)}
          className={!qualified ? "active" : ""}
        >
          java PedidoApp
        </button>
        <button
          type="button"
          onClick={() => setQualified(true)}
          className={qualified ? "active" : ""}
        >
          java -cp out nome.qualificado
        </button>
        <pre>
          {qualified
            ? "> java -cp out br.com.curso.aula126.app.PedidoApp\nPedido 1001 | Cliente 10 - Ana Silva | Ativo: true | Total: R$ 399.80 | Status: CRIADO\nPedido 1001 | Cliente 10 - Ana Silva | Ativo: true | Total: R$ 399.80 | Status: PAGO"
            : "> java PedidoApp\nError: Could not find or load main class PedidoApp\nCaused by: java.lang.ClassNotFoundException: PedidoApp"}
        </pre>
      </div>
      <p className="guided-note">
        <Boxes size={18} />
        <span>
          Duas classes podem compartilhar o nome simples se os pacotes
          diferirem. O nome qualificado — pacote + classe — é a identidade
          completa.
        </span>
      </p>
    </section>
  );
}
function ArchitectureLab() {
  const [mode, setMode] = useState("domain");
  const tech = ["controller/", "service/", "repository/", "model/", "dto/"];
  const domain = [
    "pedido/",
    "cliente/",
    "ordemservico/",
    "contrato/",
    "valor/",
  ];
  return (
    <section className="pk126-stack">
      <div className="pk126-architecture">
        <nav>
          <button
            type="button"
            className={mode === "tech" ? "active" : ""}
            onClick={() => setMode("tech")}
          >
            por tipo técnico
          </button>
          <button
            type="button"
            className={mode === "domain" ? "active" : ""}
            onClick={() => setMode("domain")}
          >
            por domínio
          </button>
        </nav>
        <main>
          {(mode === "tech" ? tech : domain).map((x) => (
            <span key={x}>
              <Package size={16} />
              {x}
            </span>
          ))}
        </main>
        <p>
          {mode === "domain"
            ? "Nesta fase, o vocabulário do negócio reforça Orientação a Objetos. Depois ele poderá conviver com aplicação, API e infraestrutura."
            : "É uma organização comum, mas ainda não é o foco desta etapa da formação."}
        </p>
      </div>
      <div className="pk126-names">
        <b>Convenção profissional</b>
        <code>br.com.empresa.projeto.dominio.pedido</code>
        <span>minúsculas · sem acento · sem espaço · sem hífen</span>
      </div>
    </section>
  );
}
function IntelliJLab() {
  const [step, setStep] = useState(0);
  const actions = [
    ["src", "New → Package", "br.com.curso.aula126.dominio.pedido"],
    ["pedido", "New → Java Class", "Pedido"],
    ["Pedido.java", "Alt + Enter", "Import class Cliente"],
    ["imports", "Code → Optimize Imports", "remove e ordena imports"],
    ["Pedido", "Refactor → Move", "atualiza package, pasta e referências"],
  ];
  const a = actions[step];
  return (
    <section className="pk126-stack">
      <div className="pk126-ide">
        <header>
          <span>IntelliJ IDEA · Project</span>
          <div>
            <Search size={14} />
            Search Everywhere
          </div>
        </header>
        <main>
          <aside>
            {actions.map((x, i) => (
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
          <section>
            <span>
              PASSO {step + 1} DE {actions.length}
            </span>
            <h3>{a[1]}</h3>
            <code>{a[2]}</code>
            <p>
              A IDE altera a estrutura visível, mas por baixo mantém diretórios,
              declaração package, imports e classpath coerentes.
            </p>
          </section>
        </main>
      </div>
    </section>
  );
}
function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    ["PedidoApp", "new Cliente", "app importa dominio.cliente"],
    ["PedidoApp", "Dinheiro.de", "app importa dominio.valor"],
    [
      "Pedido",
      "cliente.ativo()",
      "dominio.pedido atravessa um import explícito",
    ],
    ["Pedido", "StatusPedido.CRIADO", "mesmo pacote: nenhum import"],
    ["OrdemServicoApp", "new CodigoOs", "appos importa dominio.os"],
    ["OrdemServico", "status = REAGENDADA", "regra permanece no domínio"],
  ];
  const f = frames[step];
  return (
    <section className="pk126-stack">
      <div className="pk126-debug">
        <header>
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((v) => v - 1)}
          >
            <ArrowLeft size={14} />
            Voltar
          </button>
          <button
            type="button"
            disabled={step === frames.length - 1}
            onClick={() => setStep((v) => v + 1)}
          >
            <StepForward size={14} />
            Entrar
          </button>
          <span>
            {step + 1}/{frames.length}
          </span>
        </header>
        <main>
          <span>NAVEGAÇÃO ENTRE PACOTES</span>
          <h3>{f[0]}</h3>
          <code>{f[1]}</code>
          <p>{f[2]}</p>
        </main>
      </div>
    </section>
  );
}
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const c = ERRORS[selected];
  return (
    <section className="pk126-errors">
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
    </section>
  );
}
function DeliveryLab() {
  const [checked, setChecked] = useState(() => new Set());
  const tasks = [
    "appcontrato",
    "dominio.contrato",
    "dominio.servico",
    "Dinheiro reutilizado",
    "App sem regra",
    "8 testes",
  ];
  return (
    <section className="pk126-stack">
      <Workspace filter="contract" />
      <div className="guided-console">
        <div className="guided-console-title">
          <Play size={15} />
          Terminal
        </div>
        <pre>{`> javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
> java -cp out br.com.curso.aula126.appcontrato.ContratoApp
CONT-126 | Suporte | R$ 200.00 | 2026-07-01 a 2026-09-30 | ATIVO
> java -cp out br.com.curso.aula126.appcontrato.TestePacotes126
8 testes passaram
> git add labs/m4/aula-126-pacotes-de-dominio
> git commit -m "Aula 126: organiza dominio Java em pacotes"`}</pre>
      </div>
      <div className="pk126-checklist">
        {tasks.map((x, i) => (
          <button
            type="button"
            className={checked.has(i) ? "done" : ""}
            onClick={() =>
              setChecked((c) => {
                const n = new Set(c);
                if (n.has(i)) n.delete(i);
                else n.add(i);
                return n;
              })
            }
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
    id: "namespace",
    label: "Package e Namespace",
    duration: "12 min",
    eyebrow: "IDENTIDADE COMPLETA",
    title: "Transforme pontos do package em um endereço navegável",
    blocks: [
      {
        type: "lead",
        text: "Package cria um namespace. Cada ponto separa uma parte lógica e corresponde a um diretório abaixo da raiz de fontes.",
      },
      { type: "namespace" },
    ],
  },
  {
    id: "order",
    label: "Ordem do Arquivo",
    duration: "10 min",
    eyebrow: "PACKAGE, IMPORTS, TIPO",
    title: "Coloque cada declaração na posição aceita pelo compilador",
    blocks: [
      {
        type: "lead",
        text: "A declaração package é a primeira instrução útil. Imports vêm depois; classe, record ou enum vêm por último.",
      },
      { type: "order" },
    ],
  },
  {
    id: "default",
    label: "Adeus Pacote Default",
    duration: "10 min",
    eyebrow: "DO EXEMPLO AO PROJETO",
    title: "Entenda por que o pacote default não atravessa esta fase",
    blocks: [
      {
        type: "lead",
        text: "Ele reduziu ruído nas primeiras aulas, mas não escala, não representa arquitetura e cria conflitos de nomes.",
      },
      { type: "default" },
    ],
  },
  {
    id: "pedido",
    label: "Pedido em Pacotes",
    duration: "22 min",
    eyebrow: "APP, CLIENTE, PEDIDO E VALOR",
    title: "Construa a árvore e confira package em cada arquivo",
    blocks: [
      {
        type: "lead",
        text: "App depende do domínio; domínio não depende de App. A árvore torna essa direção visível.",
      },
      { type: "pedido" },
    ],
  },
  {
    id: "imports",
    label: "Mapa de Imports",
    duration: "16 min",
    eyebrow: "MESMO, OUTRO E JAVA.LANG",
    title: "Decida quando importar sem decorar por tentativa",
    blocks: [
      {
        type: "lead",
        text: "Mesmo pacote e java.lang dispensam import. Outro pacote exige import explícito; pacote pai não inclui subpacotes.",
      },
      { type: "imports" },
    ],
  },
  {
    id: "compile",
    label: "javac -d out",
    duration: "17 min",
    eyebrow: "FONTE PARA BYTECODE",
    title: "Veja o compilador reconstruir os pacotes dentro de out",
    blocks: [
      {
        type: "lead",
        text: "-d define a raiz da saída. O compilador usa as declarações package para criar a árvore dos arquivos .class.",
      },
      { type: "compile" },
    ],
  },
  {
    id: "run",
    label: "Classpath e Execução",
    duration: "14 min",
    eyebrow: "-CP E NOME QUALIFICADO",
    title: "Execute pela identidade completa da classe",
    blocks: [
      {
        type: "lead",
        text: "Classpath aponta a raiz onde a árvore começa; o nome qualificado conduz até a classe com main.",
      },
      { type: "run" },
    ],
  },
  {
    id: "os",
    label: "OS no Mesmo Domínio",
    duration: "20 min",
    eyebrow: "SEIS FONTES, UM PACOTE",
    title: "Perceba quando classes colaboradoras não precisam de imports",
    blocks: [
      {
        type: "lead",
        text: "Código, período, turno, status e entidade compartilham dominio.os; somente a App externa importa esses tipos.",
      },
      { type: "os" },
    ],
  },
  {
    id: "architecture",
    label: "Pacotes com Significado",
    duration: "15 min",
    eyebrow: "DOMÍNIO VERSUS TIPO TÉCNICO",
    title:
      "Organize pelo vocabulário sem confundir pacote com arquitetura pronta",
    blocks: [
      {
        type: "lead",
        text: "Pacotes comunicam agrupamentos. Nesta fase, pedido, cliente, OS e contrato reforçam o modelo de negócio.",
      },
      { type: "architecture" },
      { type: "ide" },
    ],
  },
  {
    id: "debug-errors",
    label: "Debug e Clínica",
    duration: "20 min",
    eyebrow: "SEIS SALTOS E OITO FALHAS",
    title: "Diagnostique imports, caminhos, execução e fronteiras",
    blocks: [
      {
        type: "lead",
        text: "Navegue entre pacotes no mock da IDE e trate o sintoma certo: compilação, classpath, convenção ou modelagem.",
      },
      { type: "debug" },
      { type: "errors" },
    ],
  },
  {
    id: "delivery",
    label: "Entrega & Contrato",
    duration: "30 min",
    eyebrow: "TRÊS PACOTES E OITO TESTES",
    title: "Entregue Contrato reutilizando o valor compartilhado",
    blocks: [
      {
        type: "lead",
        text: "A App apenas monta. Contrato, período, status, serviço e Dinheiro protegem as regras em seus pacotes.",
      },
      { type: "delivery" },
    ],
  },
];
function Block({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = {
    namespace: NamespaceLab,
    order: OrderLab,
    default: DefaultLab,
    pedido: () => <Workspace filter="pedido" />,
    imports: ImportsLab,
    compile: CompileLab,
    run: QualifiedLab,
    os: () => <Workspace filter="os" />,
    architecture: ArchitectureLab,
    ide: IntelliJLab,
    debug: DebugLab,
    errors: ErrorsClinic,
    delivery: DeliveryLab,
  };
  const C = map[block.type];
  return C ? <C /> : null;
}
export default function GuidedDomainPackagesLesson126({
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
        Array.isArray(saved) ? saved.filter((x) => ids.has(x)) : [],
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
  const step = steps[activeIndex];
  const done = completedSteps.has(step.id);
  const allDone = completedSteps.size === steps.length;
  const lessonComplete = isCompleted && allDone;
  const select = (i) => {
    setActiveIndex(i);
    document
      .querySelector(".guided-layout")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const toggle = () => {
    if (done && isCompleted) onToggleCompleted();
    setCompletedSteps((c) => {
      const n = new Set(c);
      if (n.has(step.id)) n.delete(step.id);
      else n.add(step.id);
      return n;
    });
  };
  return (
    <article className="guided-git-lesson guided-domain-packages-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker">
            <Package size={17} />
            Laboratório de namespaces Java
          </span>
          <p className="guided-sequence">126 · M4.22</p>
          <h1>Dê endereço, nome completo e fronteira às classes do domínio</h1>
          <p>
            Monte pacotes reais, domine imports, compile para out, execute pelo
            classpath e navegue pelo IntelliJ sem transformar a App em domínio.
          </p>
        </div>
        <div className="guided-hero-status">
          <Boxes size={42} />
          <strong>
            {Math.round((completedSteps.size / steps.length) * 100)}%
          </strong>
          <span>
            {completedSteps.size} de {steps.length} etapas concluídas
          </span>
        </div>
      </header>
      <GuidedLessonFacts
        ariaLabel="Resumo da aula 126"
        items={[
          { value: "17 fontes", label: "Em 9 pacotes" },
          { value: "4 execuções", label: "Pedido, OS, Contrato e testes" },
          { value: "8 casos", label: "Na clínica de erros" },
        ]}
      />
      <div className="guided-layout">
        <nav
          ref={navRef}
          className="guided-step-nav"
          aria-label="Roteiro prático da aula 126"
        >
          <div className="guided-step-nav-title">
            <ListChecks size={18} />
            Roteiro prático
          </div>
          {steps.map((x, i) => (
            <button
              type="button"
              key={x.id}
              className={
                (i === activeIndex ? "active " : "") +
                (completedSteps.has(x.id) ? "done" : "")
              }
              onClick={() => select(i)}
            >
              <span className="guided-step-number">
                {completedSteps.has(x.id) ? (
                  <Check size={14} />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <span>
                <strong>{x.label}</strong>
                <small>{x.duration}</small>
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
          {step.blocks.map((b, i) => (
            <Block block={b} key={b.type + i} />
          ))}
          <div className="guided-step-actions">
            <button
              type="button"
              className="secondary"
              disabled={activeIndex === 0}
              onClick={() => select(activeIndex - 1)}
            >
              <ArrowLeft size={17} />
              Etapa anterior
            </button>
            <div className="guided-step-actions-main">
              <button
                type="button"
                className={"step-toggle " + (done ? "undo" : "complete")}
                onClick={toggle}
              >
                {done ? (
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
                  disabled={!done}
                  onClick={() => select(activeIndex + 1)}
                >
                  Próxima etapa
                  <ArrowRight size={17} />
                </button>
              )}
            </div>
          </div>
          {allDone && (
            <section className="guided-finish">
              <CheckCircle2 size={30} />
              <div>
                <h3>Namespaces comprovados</h3>
                <p>
                  {lessonComplete
                    ? "Aula concluída: avance para dependências entre pacotes."
                    : "Execute Contrato e os oito testes antes de concluir."}
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
          Aula 125
        </button>
        <div
          className={
            "guided-course-status " +
            (lessonComplete ? "completed" : allDone ? "ready" : "")
          }
        >
          <Clock3 size={18} />
          <span>
            <strong>
              {lessonComplete
                ? "Aula concluída"
                : completedSteps.size + " de " + steps.length + " etapas"}
            </strong>
            <small>package, imports, javac, classpath, domínio e IDE</small>
          </span>
        </div>
        <button
          type="button"
          onClick={onNextLesson}
          disabled={!hasNextLesson || !lessonComplete}
        >
          Aula 127
          <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
