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
  Fingerprint,
  ListChecks,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  StepForward,
  Workflow,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedEntitiesLesson.css";

const STORAGE_KEY = "guided-entities-lesson-117-progress";

const ANEMIC_SOURCE = `public class ClienteAnemico {
    public static void main(String[] args) {
        ClienteAnemicoModelo cliente = new ClienteAnemicoModelo();
        cliente.setId(10); cliente.setNome("Ana"); cliente.setEmail("anaemail.com"); cliente.setAtivo(true);
        cliente.setEmail(""); cliente.setAtivo(false);
        System.out.println(cliente.resumo());
    }
}
class ClienteAnemicoModelo {
    private int id; private String nome; private String email; private boolean ativo;
    void setId(int id) { this.id = id; } void setNome(String nome) { this.nome = nome; }
    void setEmail(String email) { this.email = email; } void setAtivo(boolean ativo) { this.ativo = ativo; }
    String resumo() { return id + " | " + nome + " | " + email + " | ativo=" + ativo; }
}`;

const CLIENT_SOURCE = `public class ClienteEntidade {
    public static void main(String[] args) {
        ClienteModelo cliente = new ClienteModelo(10, "Ana Silva", new EmailCliente("ana@email.com"));
        System.out.println(cliente.resumo());
        cliente.alterarEmail(new EmailCliente("ana.novo@email.com"));
        cliente.inativar("Solicitação do cliente");
        System.out.println(cliente.resumo() + " | pode comprar=" + cliente.podeComprar());
        cliente.reativar();
        System.out.println(cliente.resumo());
    }
}
enum StatusCliente { ATIVO, INATIVO, BLOQUEADO }
record EmailCliente(String valor) {
    EmailCliente { if (valor == null || valor.isBlank() || !valor.contains("@")) throw new IllegalArgumentException("E-mail inválido."); valor = valor.trim().toLowerCase(); }
}
class ClienteModelo {
    private final int id; private final String nome; private EmailCliente email;
    private StatusCliente status = StatusCliente.ATIVO; private String motivo = "";
    ClienteModelo(int id, String nome, EmailCliente email) {
        if (id <= 0 || nome == null || nome.isBlank() || email == null) throw new IllegalArgumentException("Cliente inválido.");
        this.id = id; this.nome = nome; this.email = email;
    }
    boolean podeComprar() { return status == StatusCliente.ATIVO; }
    void alterarEmail(EmailCliente novo) { if (!podeComprar()) throw new IllegalStateException("Cliente inativo."); if (novo == null) throw new IllegalArgumentException(); email = novo; }
    void inativar(String motivo) { if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException(); if (status == StatusCliente.BLOQUEADO) throw new IllegalStateException(); status = StatusCliente.INATIVO; this.motivo = motivo; }
    void bloquear(String motivo) { if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException(); status = StatusCliente.BLOQUEADO; this.motivo = motivo; }
    void reativar() { if (status == StatusCliente.BLOQUEADO) throw new IllegalStateException("Exige análise."); status = StatusCliente.ATIVO; motivo = ""; }
    String resumo() { return "Cliente " + id + " | " + nome + " | " + email.valor() + " | " + status + " | " + motivo; }
}`;

const ORDER_SOURCE = `import java.math.BigDecimal;
public class PedidoEntidade {
    public static void main(String[] args) {
        PedidoModelo pedido = new PedidoModelo(1001, new DinheiroPedido(new BigDecimal("399.80")));
        pedido.confirmarPagamento(new PagamentoPedido(new DinheiroPedido(new BigDecimal("399.80")), StatusPagamento.APROVADO));
        pedido.enviar(); pedido.entregar();
        System.out.println("Pedido " + pedido.numero() + " | " + pedido.status());
    }
}
enum StatusPedido { CRIADO, PAGO, ENVIADO, ENTREGUE, CANCELADO }
enum StatusPagamento { PENDENTE, APROVADO, CONFIRMADO, CANCELADO }
record DinheiroPedido(BigDecimal valor) {
    DinheiroPedido { if (valor == null || valor.signum() <= 0) throw new IllegalArgumentException(); }
    boolean maiorOuIgual(DinheiroPedido outro) { return outro != null && valor.compareTo(outro.valor) >= 0; }
}
record PagamentoPedido(DinheiroPedido valor, StatusPagamento status) {
    PagamentoPedido { if (valor == null || status == null) throw new IllegalArgumentException(); }
    boolean aprovado() { return status == StatusPagamento.APROVADO || status == StatusPagamento.CONFIRMADO; }
    boolean cobre(DinheiroPedido total) { return valor.maiorOuIgual(total); }
}
class PedidoModelo {
    private final int numero; private final DinheiroPedido total; private StatusPedido status = StatusPedido.CRIADO;
    PedidoModelo(int numero, DinheiroPedido total) { if (numero <= 0 || total == null) throw new IllegalArgumentException(); this.numero = numero; this.total = total; }
    int numero() { return numero; } StatusPedido status() { return status; }
    void confirmarPagamento(PagamentoPedido pagamento) { if (status != StatusPedido.CRIADO) throw new IllegalStateException(); if (pagamento == null || !pagamento.aprovado() || !pagamento.cobre(total)) throw new IllegalStateException("Pagamento inválido."); status = StatusPedido.PAGO; }
    void enviar() { if (status != StatusPedido.PAGO) throw new IllegalStateException("Somente pago envia."); status = StatusPedido.ENVIADO; }
    void entregar() { if (status != StatusPedido.ENVIADO) throw new IllegalStateException("Somente enviado entrega."); status = StatusPedido.ENTREGUE; }
    void cancelar(String motivo) { if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException(); if (status == StatusPedido.ENTREGUE || status == StatusPedido.CANCELADO) throw new IllegalStateException(); status = StatusPedido.CANCELADO; }
}`;

const OS_SOURCE = `import java.time.LocalDate;
public class OrdemServicoEntidade {
    public static void main(String[] args) {
        OrdemServicoModelo os = new OrdemServicoModelo(new CodigoOs("OS-2026-0001"), new PeriodoOs(LocalDate.of(2026,7,20), TurnoOs.MANHA));
        os.reagendar(new PeriodoOs(LocalDate.of(2026,7,22), TurnoOs.TARDE)); os.concluir();
        System.out.println(os.resumo());
        try { os.reagendar(new PeriodoOs(LocalDate.of(2026,7,25), TurnoOs.MANHA)); }
        catch (IllegalStateException erro) { System.out.println("Erro esperado: " + erro.getMessage()); }
    }
}
enum StatusOs { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA } enum TurnoOs { MANHA, TARDE }
record CodigoOs(String valor) { CodigoOs { if (valor == null || !valor.startsWith("OS-")) throw new IllegalArgumentException(); } }
record PeriodoOs(LocalDate data, TurnoOs turno) { PeriodoOs { if (data == null || turno == null) throw new IllegalArgumentException(); } }
class OrdemServicoModelo {
    private final CodigoOs codigo; private PeriodoOs periodo; private StatusOs status = StatusOs.AGENDADA;
    private int reagendamentos; private String motivoCancelamento = "";
    OrdemServicoModelo(CodigoOs codigo, PeriodoOs periodo) { if (codigo == null || periodo == null) throw new IllegalArgumentException(); this.codigo = codigo; this.periodo = periodo; }
    void reagendar(PeriodoOs novo) { if (status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA) throw new IllegalStateException("OS encerrada."); if (novo == null) throw new IllegalArgumentException(); periodo = novo; reagendamentos++; status = StatusOs.REAGENDADA; }
    void concluir() { if (status == StatusOs.CANCELADA) throw new IllegalStateException(); status = StatusOs.CONCLUIDA; }
    void cancelar(String motivo) { if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException(); if (status == StatusOs.CONCLUIDA) throw new IllegalStateException(); status = StatusOs.CANCELADA; motivoCancelamento = motivo; }
    String resumo() { return codigo.valor() + " | " + periodo + " | " + status + " | reagendamentos=" + reagendamentos + " | " + motivoCancelamento; }
}`;

const PRODUCT_SOURCE = `import java.math.BigDecimal;
public class ProdutoEntidade {
    public static void main(String[] args) {
        ProdutoModelo produto = new ProdutoModelo(new CodigoProduto("PROD-001"), "Cadeira", new DinheiroProduto(new BigDecimal("199.90")), 10);
        produto.vender(3); produto.reporEstoque(5); produto.inativar("Catálogo renovado"); produto.reativar();
        System.out.println(produto.resumo());
        System.out.println("Valor em estoque: " + produto.valorTotalEmEstoque().valor());
    }
}
enum StatusProduto { ATIVO, INATIVO }
record CodigoProduto(String valor) { CodigoProduto { if (valor == null || valor.isBlank()) throw new IllegalArgumentException(); } }
record DinheiroProduto(BigDecimal valor) { DinheiroProduto { if (valor == null || valor.signum() <= 0) throw new IllegalArgumentException(); } DinheiroProduto multiplicar(int quantidade) { return new DinheiroProduto(valor.multiply(BigDecimal.valueOf(quantidade))); } }
class ProdutoModelo {
    private final CodigoProduto codigo; private final String nome; private final DinheiroProduto preco;
    private int estoque; private StatusProduto status = StatusProduto.ATIVO; private String motivo = "";
    ProdutoModelo(CodigoProduto codigo, String nome, DinheiroProduto preco, int estoque) { if (codigo == null || nome == null || nome.isBlank() || preco == null || estoque < 0) throw new IllegalArgumentException(); this.codigo = codigo; this.nome = nome; this.preco = preco; this.estoque = estoque; }
    boolean disponivelParaVenda() { return status == StatusProduto.ATIVO && estoque > 0; }
    void vender(int quantidade) { if (quantidade <= 0 || !disponivelParaVenda() || quantidade > estoque) throw new IllegalStateException("Venda inválida."); estoque -= quantidade; }
    void reporEstoque(int quantidade) { if (quantidade <= 0) throw new IllegalArgumentException(); estoque += quantidade; }
    void inativar(String motivo) { if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException(); status = StatusProduto.INATIVO; this.motivo = motivo; }
    void reativar() { status = StatusProduto.ATIVO; motivo = ""; }
    DinheiroProduto valorTotalEmEstoque() { return preco.multiplicar(estoque); }
    String resumo() { return codigo.valor() + " | " + nome + " | estoque=" + estoque + " | " + status + " | " + motivo; }
}`;

const TEST_SOURCE = `import java.math.BigDecimal;
public class TesteEntidades {
    public static void main(String[] args) {
        ClienteModelo cliente = new ClienteModelo(10,"Ana",new EmailCliente("ana@email.com"));
        assertTrue(cliente.podeComprar(),"cliente ativo"); cliente.inativar("pedido"); assertFalse(cliente.podeComprar(),"cliente inativo");
        expectState(() -> cliente.alterarEmail(new EmailCliente("novo@email.com")),"inativo não altera");
        PedidoModelo pedido = new PedidoModelo(1001,new DinheiroPedido(new BigDecimal("100")));
        expectState(pedido::enviar,"criado não envia");
        pedido.confirmarPagamento(new PagamentoPedido(new DinheiroPedido(new BigDecimal("100")),StatusPagamento.APROVADO)); pedido.enviar(); pedido.entregar();
        assertEquals(StatusPedido.ENTREGUE,pedido.status(),"ciclo completo");
        ProdutoModelo produto = new ProdutoModelo(new CodigoProduto("P1"),"Cadeira",new DinheiroProduto(new BigDecimal("10")),2); produto.vender(2); assertFalse(produto.disponivelParaVenda(),"sem estoque");
        expectState(() -> produto.vender(1),"estoque insuficiente");
        System.out.println("8 testes passaram");
    }
    static void assertTrue(boolean valor,String caso){if(!valor)throw new AssertionError(caso);} static void assertFalse(boolean valor,String caso){assertTrue(!valor,caso);} static void assertEquals(Object e,Object a,String c){if(!e.equals(a))throw new AssertionError(c);} static void expectState(Runnable r,String c){try{r.run();throw new AssertionError(c);}catch(IllegalStateException e){}}
}`;

const ERRORS = [
  [
    "Entidade como valor",
    "Dados iguais fazem dois Clientes parecerem o mesmo.",
    "Defina a identidade que sustenta a continuidade.",
  ],
  [
    "Entidade anêmica",
    "A classe só expõe campos, getters e setters.",
    "Ofereça ações e perguntas do domínio.",
  ],
  [
    "Setter de status",
    "Qualquer consumidor pula etapas do ciclo.",
    "Troque setStatus por pagar, enviar, concluir ou cancelar.",
  ],
  [
    "Infraestrutura dentro",
    "Pedido salva banco e chama API.",
    "Mantenha regra central; outras camadas integram infraestrutura.",
  ],
  [
    "Transição sem guarda",
    "Pedido cancelado ainda pode ser enviado.",
    "Valide o estado atual antes de cada mudança.",
  ],
  [
    "Ignorar valores",
    "Email, Dinheiro e Período viram primitivos frágeis.",
    "Componha a entidade com objetos de valor válidos.",
  ],
  [
    "Identidade confusa",
    "Nome ou e-mail mutável é tratado como id.",
    "Escolha id, código, matrícula ou número estável.",
  ],
  [
    "Entidade gigante",
    "Um objeto absorve contato, crédito, histórico e integração.",
    "Extraia valores, colaboradores e serviços com responsabilidade própria.",
  ],
];
const EVIDENCE = `# Aula 117 — Entidades
- [ ] Diferenciei identidade e valor
- [ ] Provei o risco da entidade anêmica
- [ ] Controlei o ciclo do Cliente
- [ ] Modelei mudanças por ações, não setters
- [ ] Executei a máquina de estados do Pedido
- [ ] Comparei igualdade por identidade
- [ ] Reagendei e concluí a OS com guardas
- [ ] Depurei nove transições
- [ ] Diagnostiquei oito erros
- [ ] Entreguei Produto, oito testes e Git`;

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

function IdentityLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    ["Cliente #10", "email antigo → email novo", "A identidade permanece 10."],
    [
      "Pedido #1001",
      "CRIADO → PAGO → ENVIADO",
      "O mesmo pedido acumula história.",
    ],
    [
      "Email",
      "ana@a.com → ana@b.com",
      "Mudou o conteúdo: agora é outro valor.",
    ],
    ["Dinheiro", "R$ 100 → R$ 90", "A operação devolve outro valor."],
  ];
  const c = cases[selected];
  return (
    <section className="en117-stack">
      <div className="en117-identity">
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
          <Fingerprint size={34} />
          <h3>{c[0]}</h3>
          <strong>{c[1]}</strong>
          <p>{c[2]}</p>
        </main>
      </div>
      <div className="en117-continuity">
        <span>t0</span>
        <b>mesma identidade</b>
        <span>t1</span>
        <b>mesma identidade</b>
        <span>t2</span>
      </div>
    </section>
  );
}
function ClassifierLab() {
  const [selected, setSelected] = useState(0);
  const items = [
    ["Cliente", "ENTIDADE", "id e ciclo de ativação"],
    ["Email", "VALOR", "conteúdo e normalização"],
    ["Pedido", "ENTIDADE", "número e transições"],
    ["Dinheiro", "VALOR", "quantia e operações"],
    ["OrdemServico", "ENTIDADE", "código e histórico"],
    ["Periodo", "VALOR", "datas que definem o intervalo"],
    ["Produto", "ENTIDADE", "SKU, estoque e status"],
    ["Telefone", "VALOR", "DDD e número"],
  ];
  const c = items[selected];
  return (
    <section className="en117-stack">
      <div className="en117-grid">
        {items.map((x, i) => (
          <button
            type="button"
            className={i === selected ? "active" : ""}
            onClick={() => setSelected(i)}
            key={x[0]}
          >
            {x[0]}
          </button>
        ))}
      </div>
      <div className="en117-answer">
        <Workflow size={26} />
        <div>
          <span>{c[1]}</span>
          <h3>{c[0]}</h3>
          <p>{c[2]}</p>
        </div>
      </div>
    </section>
  );
}
function AnemiaLab() {
  const [rich, setRich] = useState(false);
  return (
    <section className="en117-stack">
      <div className="en117-toggle">
        <button
          type="button"
          className={!rich ? "active" : ""}
          onClick={() => setRich(false)}
        >
          Setters livres
        </button>
        <button
          type="button"
          className={rich ? "active" : ""}
          onClick={() => setRich(true)}
        >
          Ações do domínio
        </button>
      </div>
      <div className={"en117-anemia " + (rich ? "rich" : "poor")}>
        <pre>
          {rich
            ? "cliente.alterarEmail(novo)\ncliente.inativar(motivo)\ncliente.reativar()"
            : 'cliente.setEmail("")\ncliente.setAtivo(false)\ncliente.setId(0)'}
        </pre>
        <section>
          <AlertTriangle size={25} />
          <h3>{rich ? "Mudança protegida" : "Dados sem comportamento"}</h3>
          <p>
            {rich
              ? "A intenção nomeada verifica estado e invariantes."
              : "O consumidor decide qualquer estado e pula regras."}
          </p>
        </section>
      </div>
      <CodePanel name="ClienteAnemico.java" code={ANEMIC_SOURCE} />
    </section>
  );
}
function ClientLab() {
  const [status, setStatus] = useState("ATIVO");
  const [email, setEmail] = useState("ana@email.com");
  const [message, setMessage] = useState("Cliente criado ativo.");
  const act = (action) => {
    if (action === "inativar") {
      if (status === "BLOQUEADO")
        setMessage("Erro: bloqueado não usa este fluxo.");
      else {
        setStatus("INATIVO");
        setMessage("Inativado com motivo.");
      }
    }
    if (action === "bloquear") {
      setStatus("BLOQUEADO");
      setMessage("Bloqueado para análise.");
    }
    if (action === "reativar") {
      if (status === "BLOQUEADO") setMessage("Erro: bloqueado exige análise.");
      else {
        setStatus("ATIVO");
        setMessage("Reativado.");
      }
    }
  };
  return (
    <section className="en117-stack">
      <div className="en117-client">
        <div>
          <span>Cliente #10</span>
          <strong>{status}</strong>
          <small>{email}</small>
        </div>
        <section>
          <label>
            Novo e-mail
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status !== "ATIVO"}
            />
          </label>
          <div>
            <button type="button" onClick={() => act("inativar")}>
              Inativar
            </button>
            <button type="button" onClick={() => act("bloquear")}>
              Bloquear
            </button>
            <button type="button" onClick={() => act("reativar")}>
              Reativar
            </button>
          </div>
          <p>{message}</p>
        </section>
      </div>
      <CodePanel name="ClienteEntidade.java" code={CLIENT_SOURCE} />
    </section>
  );
}
function TransitionLab() {
  const [selected, setSelected] = useState(0);
  const rules = [
    ["setStatus(PAGO)", "fraco", "Permite pagar sem validar pagamento."],
    [
      "confirmarPagamento(pagamento)",
      "forte",
      "Valida origem, aprovação e cobertura.",
    ],
    [
      "setPeriodo(novo)",
      "fraco",
      "Não registra reagendamento nem verifica encerramento.",
    ],
    [
      "reagendar(novoPeriodo)",
      "forte",
      "Guarda estado, conta mudança e nomeia intenção.",
    ],
  ];
  const c = rules[selected];
  return (
    <section className="en117-stack">
      <div className="en117-rules">
        <nav>
          {rules.map((x, i) => (
            <button
              type="button"
              className={i === selected ? "active" : ""}
              onClick={() => setSelected(i)}
              key={x[0]}
            >
              {x[0]}
            </button>
          ))}
        </nav>
        <main>
          <span>{c[1].toUpperCase()}</span>
          <code>{c[0]}</code>
          <p>{c[2]}</p>
        </main>
      </div>
      <p className="guided-note">
        <ShieldCheck size={18} />
        <span>
          <strong>Entidade pode mudar.</strong> O problema não é mutabilidade; é
          mudar sem regra, contexto e intenção.
        </span>
      </p>
    </section>
  );
}
function OrderLab() {
  const [status, setStatus] = useState("CRIADO");
  const [message, setMessage] = useState("Aguardando pagamento.");
  const transition = (action) => {
    const allowed = {
      pagar: ["CRIADO", "PAGO"],
      enviar: ["PAGO", "ENVIADO"],
      entregar: ["ENVIADO", "ENTREGUE"],
      cancelar: ["CRIADO", "CANCELADO"],
    }[action];
    if (status !== allowed[0])
      setMessage(`Bloqueado: ${action} exige ${allowed[0]}.`);
    else {
      setStatus(allowed[1]);
      setMessage(`Transição aceita: ${allowed[0]} → ${allowed[1]}.`);
    }
  };
  return (
    <section className="en117-stack">
      <div className="en117-machine">
        <div className="en117-states">
          {["CRIADO", "PAGO", "ENVIADO", "ENTREGUE", "CANCELADO"].map((x) => (
            <span className={x === status ? "active" : ""} key={x}>
              {x}
            </span>
          ))}
        </div>
        <div className="en117-actions">
          <button type="button" onClick={() => transition("pagar")}>
            Confirmar pagamento
          </button>
          <button type="button" onClick={() => transition("enviar")}>
            Enviar
          </button>
          <button type="button" onClick={() => transition("entregar")}>
            Entregar
          </button>
          <button type="button" onClick={() => transition("cancelar")}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus("CRIADO");
              setMessage("Reiniciado.");
            }}
          >
            Reiniciar
          </button>
        </div>
        <p>{message}</p>
      </div>
      <CodePanel name="PedidoEntidade.java" code={ORDER_SOURCE} />
    </section>
  );
}
function EqualityLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    ["#10 Ana / #25 Ana", false, "Mesmo nome, identidades diferentes."],
    ["#10 Ana / #10 Ana Souza", true, "Dados mudaram, identidade continua."],
    ["email A / email A", true, "Valores iguais pelo conteúdo."],
    [
      "duas referências ao #10",
      true,
      "Mesma entidade observada por referências diferentes.",
    ],
  ];
  const c = cases[selected];
  return (
    <section className="en117-stack">
      <div className="en117-equality">
        <nav>
          {cases.map((x, i) => (
            <button
              type="button"
              className={i === selected ? "active" : ""}
              onClick={() => setSelected(i)}
              key={x[0]}
            >
              {x[0]}
            </button>
          ))}
        </nav>
        <main>
          <strong>{String(c[1])}</strong>
          <p>{c[2]}</p>
          <small>
            Entidade compara identidade; valor compara conteúdo. equals/hashCode
            será aprofundado depois.
          </small>
        </main>
      </div>
    </section>
  );
}
function OsLab() {
  const [status, setStatus] = useState("AGENDADA");
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("OS criada.");
  const act = (action) => {
    if (action === "reagendar") {
      if (["CONCLUIDA", "CANCELADA"].includes(status))
        setMessage("Erro: OS encerrada.");
      else {
        setStatus("REAGENDADA");
        setCount((x) => x + 1);
        setMessage("Novo período aceito.");
      }
    }
    if (action === "concluir") {
      if (status === "CANCELADA") setMessage("Erro: cancelada não conclui.");
      else {
        setStatus("CONCLUIDA");
        setMessage("OS concluída.");
      }
    }
    if (action === "cancelar") {
      if (status === "CONCLUIDA") setMessage("Erro: concluída não cancela.");
      else {
        setStatus("CANCELADA");
        setMessage("Cancelada com motivo.");
      }
    }
  };
  return (
    <section className="en117-stack">
      <div className="en117-os">
        <div>
          <span>OS-2026-0001</span>
          <strong>{status}</strong>
          <b>{count} reagendamento(s)</b>
        </div>
        <section>
          <button type="button" onClick={() => act("reagendar")}>
            Reagendar
          </button>
          <button type="button" onClick={() => act("concluir")}>
            Concluir
          </button>
          <button type="button" onClick={() => act("cancelar")}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              setStatus("AGENDADA");
              setCount(0);
              setMessage("Reiniciada.");
            }}
          >
            Reiniciar
          </button>
          <p>{message}</p>
        </section>
      </div>
      <CodePanel name="OrdemServicoEntidade.java" code={OS_SOURCE} />
    </section>
  );
}
function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    [
      "new PedidoModelo()",
      "status = CRIADO",
      "Identidade e estado inicial nascem juntos.",
    ],
    [
      "confirmarPagamento()",
      "status atual = CRIADO",
      "Guarda verifica a origem.",
    ],
    [
      "pagamento.aprovado()",
      "APROVADO = true",
      "Colaborador responde sua regra.",
    ],
    [
      "pagamento.cobre(total)",
      "399.80 >= 399.80",
      "Valor protege comparação monetária.",
    ],
    [
      "status = PAGO",
      "mesmo pedido #1001",
      "Estado muda; identidade permanece.",
    ],
    ["enviar()", "PAGO → ENVIADO", "A transição válida avança."],
    ["entregar()", "ENVIADO → ENTREGUE", "Ciclo alcança estado final."],
    ["cancelar()", "status = ENTREGUE", "Guarda recusa entidade encerrada."],
    [
      "IllegalStateException",
      "Pedido continua ENTREGUE",
      "Falha preserva o estado válido.",
    ],
  ];
  const c = frames[step];
  return (
    <section className="en117-stack">
      <div className="en117-debug">
        <div>
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep(Math.max(0, step - 1))}
          >
            <ArrowLeft size={15} />
            Voltar
          </button>
          <button
            type="button"
            disabled={step === frames.length - 1}
            onClick={() => setStep(Math.min(frames.length - 1, step + 1))}
          >
            <StepForward size={15} />
            Step Into
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
            <span>DEBUGGER</span>
            <h3>{c[0]}</h3>
            <code>{c[1]}</code>
            <p>{c[2]}</p>
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
    <section className="en117-stack">
      <div className="en117-errors">
        <nav>
          {ERRORS.map((x, i) => (
            <button
              type="button"
              className={i === selected ? "active" : ""}
              onClick={() => setSelected(i)}
              key={x[0]}
            >
              <span>{i + 1}</span>
              <strong>{x[0]}</strong>
            </button>
          ))}
        </nav>
        <main>
          <span className="guided-error-label">
            <AlertTriangle size={16} />
            CASO {selected + 1} DE {ERRORS.length}
          </span>
          <h3>{c[0]}</h3>
          <section>
            <div>
              <b>Sintoma</b>
              <p>{c[1]}</p>
            </div>
            <ArrowRight size={18} />
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
  const [checked, setChecked] = useState(() => new Set());
  const tasks = [
    "Código e preço",
    "Venda protegida",
    "Reposição",
    "Inativação",
    "8 testes",
    "Git limpo",
  ];
  const toggle = (i) =>
    setChecked((c) => {
      const n = new Set(c);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  return (
    <section className="en117-stack">
      <CodePanel name="ProdutoEntidade.java" code={PRODUCT_SOURCE} />
      <CodePanel name="TesteEntidades.java" code={TEST_SOURCE} />
      <div className="guided-console">
        <div className="guided-console-title">
          <Play size={15} />
          Terminal
        </div>
        <pre>{`> javac -encoding UTF-8 ClienteAnemico.java ClienteEntidade.java PedidoEntidade.java OrdemServicoEntidade.java ProdutoEntidade.java TesteEntidades.java\n> java ProdutoEntidade\nPROD-001 | Cadeira | estoque=12 | ATIVO\nValor em estoque: 2398.80\n> java TesteEntidades\n8 testes passaram\n> git add labs/m4/aula-117-entidades\n> git commit -m "Aula 117: pratica entidades em orientacao a objetos"`}</pre>
      </div>
      <div className="en117-checklist">
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
      <section className="guided-challenge">
        <div className="guided-challenge-title">
          <Sparkles size={22} />
          <h3>Defesa oral do Produto</h3>
        </div>
        <ul>
          <li>Qual dado mantém a identidade?</li>
          <li>Por que vender é melhor que setEstoque?</li>
          <li>Quais guardas protegem a venda?</li>
          <li>O que pertence a valores e o que pertence à entidade?</li>
        </ul>
      </section>
      <section className="guided-file">
        <div className="guided-file-title">
          <FileCode2 size={16} />
          README.md · evidências
          <CopyButton value={EVIDENCE} />
        </div>
        <SyntaxHighlighter
          language="markdown"
          style={vscDarkPlus}
          wrapLongLines
          customStyle={{
            margin: 0,
            padding: "18px",
            background: "#0f172a",
            fontSize: ".78rem",
          }}
        >
          {EVIDENCE}
        </SyntaxHighlighter>
      </section>
    </section>
  );
}

const steps = [
  {
    id: "identity",
    label: "Identidade e Continuidade",
    duration: "10 min",
    eyebrow: "MESMO OBJETO AO LONGO DO TEMPO",
    title: "Mude dados sem perder quem a entidade é",
    blocks: [
      {
        type: "lead",
        text: "Cliente, Pedido e OS acumulam história porque uma identidade estável conecta seus estados.",
      },
      { type: "identity" },
    ],
  },
  {
    id: "classifier",
    label: "Entidade ou Valor",
    duration: "11 min",
    eyebrow: "IDENTIDADE VERSUS CONTEÚDO",
    title: "Classifique oito conceitos pelo motivo correto",
    blocks: [
      {
        type: "lead",
        text: "Entidade mantém continuidade; objeto de valor é substituído quando o conteúdo muda.",
      },
      { type: "classifier" },
    ],
  },
  {
    id: "anemia",
    label: "Entidade Anêmica",
    duration: "13 min",
    eyebrow: "DADOS, SETTERS E AUSÊNCIA DE REGRA",
    title: "Veja setters fabricarem estados que o domínio recusaria",
    blocks: [
      {
        type: "lead",
        text: "Uma classe que espelha tabela sem comportamento ainda não protege o ciclo do negócio.",
      },
      { type: "anemia" },
    ],
  },
  {
    id: "client",
    label: "Cliente com Ciclo",
    duration: "18 min",
    eyebrow: "EMAIL, ATIVAÇÃO, BLOQUEIO E MOTIVO",
    title: "Altere o mesmo Cliente por ações controladas",
    blocks: [
      {
        type: "lead",
        text: "A identidade 10 permanece enquanto e-mail e status mudam sob guardas explícitas.",
      },
      { type: "client" },
    ],
  },
  {
    id: "transitions",
    label: "Ações e Guardas",
    duration: "12 min",
    eyebrow: "MÉTODO DE DOMÍNIO VERSUS SETTER",
    title: "Nomeie a intenção e valide a origem da mudança",
    blocks: [
      {
        type: "lead",
        text: "confirmarPagamento e reagendar carregam contexto que setStatus e setPeriodo não conseguem expressar.",
      },
      { type: "transitions" },
    ],
  },
  {
    id: "order",
    label: "Pedido como Máquina",
    duration: "20 min",
    eyebrow: "CRIADO, PAGO, ENVIADO E ENTREGUE",
    title: "Percorra o ciclo sem pular uma única etapa",
    blocks: [
      {
        type: "lead",
        text: "Provoque transições fora de ordem e observe a entidade preservar o último estado válido.",
      },
      { type: "order" },
    ],
  },
  {
    id: "equality",
    label: "Igualdade Conceitual",
    duration: "11 min",
    eyebrow: "DADOS IGUAIS, IDS DIFERENTES",
    title: "Separe aparência, referência, valor e identidade",
    blocks: [
      {
        type: "lead",
        text: "Duas Anas podem ser entidades distintas; o mesmo id pode atravessar mudanças de dados.",
      },
      { type: "equality" },
    ],
  },
  {
    id: "os",
    label: "OS com História",
    duration: "17 min",
    eyebrow: "PERÍODO, CONTADOR E ESTADO",
    title: "Reagende, conclua e tente violar o encerramento",
    blocks: [
      {
        type: "lead",
        text: "A OS mantém código, registra quantas vezes mudou e bloqueia operações incompatíveis.",
      },
      { type: "os" },
    ],
  },
  {
    id: "debug",
    label: "Debug do Ciclo",
    duration: "14 min",
    eyebrow: "GUARDAS, MUTAÇÃO E EXCEÇÃO",
    title: "Entre em nove pontos do Pedido #1001",
    blocks: [
      {
        type: "lead",
        text: "Acompanhe a identidade estável enquanto o estado avança e uma transição inválida é recusada.",
      },
      { type: "debug" },
    ],
  },
  {
    id: "errors",
    label: "Clínica de Erros",
    duration: "12 min",
    eyebrow: "ANEMIA, SETTERS, INFRAESTRUTURA E CONFUSÃO",
    title: "Diagnostique oito entidades que perderam o domínio",
    blocks: [
      {
        type: "lead",
        text: "A correção preserva identidade, protege transições e distribui valores, serviços e infraestrutura.",
      },
      { type: "errors" },
    ],
  },
  {
    id: "delivery",
    label: "Entrega & Produto",
    duration: "22 min",
    eyebrow: "ESTOQUE, VENDA, STATUS, TESTES E GIT",
    title: "Entregue uma entidade Produto com comportamento real",
    blocks: [
      {
        type: "lead",
        text: "Venda e reposição alteram estoque por regras; inativar e reativar controlam o ciclo sem setters.",
      },
      { type: "delivery" },
    ],
  },
];
function ContentBlock({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = {
    identity: IdentityLab,
    classifier: ClassifierLab,
    anemia: AnemiaLab,
    client: ClientLab,
    transitions: TransitionLab,
    order: OrderLab,
    equality: EqualityLab,
    os: OsLab,
    debug: DebugLab,
    errors: ErrorsClinic,
    delivery: DeliveryLab,
  };
  const C = map[block.type];
  return C ? <C /> : null;
}
export default function GuidedEntitiesLesson117({
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
    setCompletedSteps((current) => {
      const next = new Set(current);
      if (next.has(step.id)) next.delete(step.id);
      else next.add(step.id);
      return next;
    });
  };
  return (
    <article className="guided-git-lesson guided-entities-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker">
            <Fingerprint size={17} />
            Oficina de ciclo de vida
          </span>
          <p className="guided-sequence">117 · M4.13</p>
          <h1>Identidade conecta todas as versões da entidade</h1>
          <p>
          Troque setters por ações, proteja transições e acompanhe Cliente,
          Pedido, Ordem de Serviço e Produto mudarem sem perder quem são.
          </p>
        </div>
        <div className="guided-hero-status">
          <Workflow size={42} />
          <strong>
            {Math.round((completedSteps.size / steps.length) * 100)}%
          </strong>
          <span>
            {completedSteps.size} de {steps.length} etapas concluídas
          </span>
        </div>
      </header>
      <GuidedLessonFacts
        ariaLabel="Resumo da aula 117"
        items={[
          { value: "6 fontes", label: "Compiladas em conjunto" },
          { value: "9 passos", label: "No debug do ciclo" },
          { value: "8 casos", label: "Na clínica de erros" },
        ]}
      />
      <div className="guided-layout">
        <nav
          ref={navRef}
          className="guided-step-nav"
          aria-label="Roteiro prático da aula 117"
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
            <ContentBlock key={block.type + "-" + index} block={block} />
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
                <h3>Identidade preservada, mudanças protegidas</h3>
                <p>
                  {lessonComplete
                    ? "Aula concluída: avance para identidade de objetos."
                    : "Execute Produto e os testes antes de concluir."}
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
          Aula 116
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
            <small>
              Identidade, ciclo, transições, valores e comportamento
            </small>
          </span>
        </div>
        <button
          type="button"
          onClick={onNextLesson}
          disabled={!hasNextLesson || !lessonComplete}
        >
          Aula 118
          <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
