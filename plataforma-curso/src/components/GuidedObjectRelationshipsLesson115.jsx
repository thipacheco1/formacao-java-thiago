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
  GitBranch,
  Link2,
  ListChecks,
  Network,
  Play,
  RotateCcw,
  Route,
  ShieldCheck,
  Sparkles,
  StepForward,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedObjectRelationshipsLesson.css";

const STORAGE_KEY = "guided-object-relationships-lesson-115-progress";

const PEDIDO_SOURCE = `import java.math.BigDecimal;
import java.math.RoundingMode;

public class RelacionamentoPedido {
    public static void main(String[] args) {
        ClienteRel cliente = new ClienteRel("Ana Silva", "ana@email.com", true);
        ProdutoRel produto = new ProdutoRel("PROD-001", "Cadeira", new BigDecimal("199.90"));
        ItemRel item = new ItemRel(produto, 2);
        PagamentoRel pagamento = new PagamentoRel(StatusPagamentoRel.APROVADO, item.subtotal());
        PedidoRel pedido = new PedidoRel(1001, cliente, item, pagamento);
        CupomRel cupom = new CupomRel("PROMO10", new BigDecimal("10"));

        System.out.println("Total: R$ " + pedido.total());
        System.out.println("Pode finalizar: " + pedido.podeFinalizar());
        System.out.println("Com cupom: R$ " + pedido.totalComDesconto(cupom));
    }
}

enum StatusPagamentoRel { PENDENTE, APROVADO, CONFIRMADO, CANCELADO }

class PedidoRel {
    private final int numero;
    private final ClienteRel cliente;
    private final ItemRel item;
    private final PagamentoRel pagamento;

    PedidoRel(int numero, ClienteRel cliente, ItemRel item, PagamentoRel pagamento) {
        if (numero <= 0 || cliente == null || item == null || pagamento == null) {
            throw new IllegalArgumentException("Pedido incompleto.");
        }
        this.numero = numero;
        this.cliente = cliente;
        this.item = item;
        this.pagamento = pagamento;
    }

    BigDecimal total() { return item.subtotal(); }

    BigDecimal totalComDesconto(CupomRel cupom) {
        return cupom == null ? total() : cupom.aplicarSobre(total());
    }

    boolean podeFinalizar() {
        return cliente.aptoParaComprar()
                && item.valido()
                && pagamento.aprovadoOuConfirmado()
                && pagamento.valorCobre(total());
    }
}

record ClienteRel(String nome, String email, boolean ativo) {
    ClienteRel {
        if (nome == null || nome.isBlank() || email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Cliente inválido.");
        }
    }
    boolean aptoParaComprar() { return ativo; }
}

record ProdutoRel(String codigo, String nome, BigDecimal valorUnitario) {
    ProdutoRel {
        if (codigo == null || codigo.isBlank() || nome == null || nome.isBlank()
                || valorUnitario == null || valorUnitario.signum() <= 0) {
            throw new IllegalArgumentException("Produto inválido.");
        }
        valorUnitario = valorUnitario.setScale(2, RoundingMode.HALF_UP);
    }
}

record ItemRel(ProdutoRel produto, int quantidade) {
    ItemRel {
        if (produto == null || quantidade <= 0) throw new IllegalArgumentException("Item inválido.");
    }
    boolean valido() { return quantidade > 0 && produto.valorUnitario().signum() > 0; }
    BigDecimal subtotal() { return produto.valorUnitario().multiply(BigDecimal.valueOf(quantidade)); }
}

record PagamentoRel(StatusPagamentoRel status, BigDecimal valor) {
    PagamentoRel {
        if (status == null || valor == null || valor.signum() <= 0) {
            throw new IllegalArgumentException("Pagamento inválido.");
        }
        valor = valor.setScale(2, RoundingMode.HALF_UP);
    }
    boolean aprovadoOuConfirmado() {
        return status == StatusPagamentoRel.APROVADO || status == StatusPagamentoRel.CONFIRMADO;
    }
    boolean valorCobre(BigDecimal total) { return total != null && valor.compareTo(total) >= 0; }
}

record CupomRel(String codigo, BigDecimal percentual) {
    CupomRel {
        if (codigo == null || codigo.isBlank() || percentual == null
                || percentual.signum() < 0 || percentual.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("Cupom inválido.");
        }
    }
    BigDecimal aplicarSobre(BigDecimal original) {
        BigDecimal fator = percentual.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        return original.subtract(original.multiply(fator)).setScale(2, RoundingMode.HALF_UP);
    }
}`;

const OS_SOURCE = `import java.time.LocalDate;

public class RelacionamentoOrdemServico {
    public static void main(String[] args) {
        ClienteOsRel cliente = new ClienteOsRel("Carlos Lima", "11988887777");
        TecnicoRel tecnico = new TecnicoRel("Marcos Técnico", true);
        PeriodoRel periodo = new PeriodoRel(LocalDate.of(2026, 7, 20), TurnoRel.MANHA);
        AtividadeRel atividade = new AtividadeRel("Montagem", tecnico, periodo, StatusAtividadeRel.AGENDADA);
        OrdemServicoRel os = new OrdemServicoRel("OS-2026-0001", cliente, atividade, StatusOsRel.AGENDADA);

        System.out.println("Pode executar: " + os.podeExecutar(LocalDate.of(2026, 7, 18)));
        System.out.println("Pode reagendar: " + os.podeReagendar());
        OrdemServicoRel nova = os.reagendar(new PeriodoRel(LocalDate.of(2026, 7, 22), TurnoRel.TARDE));
        System.out.println("Original: " + os.periodo());
        System.out.println("Reagendada: " + nova.periodo());
    }
}

enum StatusOsRel { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
enum StatusAtividadeRel { AGENDADA, EM_EXECUCAO, CONCLUIDA, CANCELADA }
enum TurnoRel { MANHA, TARDE }

record ClienteOsRel(String nome, String telefone) {
    ClienteOsRel {
        if (nome == null || nome.isBlank() || telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Cliente inválido.");
        }
    }
    boolean contatoValido() { return telefone.length() >= 8; }
}

record TecnicoRel(String nome, boolean ativo) {
    TecnicoRel {
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Técnico inválido.");
    }
    boolean disponivelParaAtendimento() { return ativo; }
}

record PeriodoRel(LocalDate data, TurnoRel turno) {
    PeriodoRel {
        if (data == null || turno == null) throw new IllegalArgumentException("Período inválido.");
    }
    boolean futuroOuHoje(LocalDate referencia) { return referencia != null && !data.isBefore(referencia); }
}

record AtividadeRel(String descricao, TecnicoRel tecnico, PeriodoRel periodo, StatusAtividadeRel status) {
    AtividadeRel {
        if (descricao == null || descricao.isBlank() || tecnico == null || periodo == null || status == null) {
            throw new IllegalArgumentException("Atividade inválida.");
        }
    }
    boolean encerrada() { return status == StatusAtividadeRel.CONCLUIDA || status == StatusAtividadeRel.CANCELADA; }
    boolean podeExecutar(LocalDate referencia) {
        return !encerrada() && tecnico.disponivelParaAtendimento() && periodo.futuroOuHoje(referencia);
    }
    boolean podeReagendar() { return !encerrada(); }
    AtividadeRel reagendar(PeriodoRel novo) {
        if (!podeReagendar() || novo == null) throw new IllegalStateException("Atividade não reagendável.");
        return new AtividadeRel(descricao, tecnico, novo, StatusAtividadeRel.AGENDADA);
    }
}

record OrdemServicoRel(String codigo, ClienteOsRel cliente, AtividadeRel atividade, StatusOsRel status) {
    OrdemServicoRel {
        if (codigo == null || codigo.isBlank() || cliente == null || atividade == null || status == null) {
            throw new IllegalArgumentException("OS inválida.");
        }
    }
    boolean encerrada() { return status == StatusOsRel.CONCLUIDA || status == StatusOsRel.CANCELADA; }
    boolean podeReagendar() { return !encerrada() && atividade.podeReagendar(); }
    boolean podeExecutar(LocalDate referencia) {
        return !encerrada() && cliente.contatoValido() && atividade.podeExecutar(referencia);
    }
    OrdemServicoRel reagendar(PeriodoRel novo) {
        if (!podeReagendar()) throw new IllegalStateException("OS não reagendável.");
        return new OrdemServicoRel(codigo, cliente, atividade.reagendar(novo), StatusOsRel.REAGENDADA);
    }
    PeriodoRel periodo() { return atividade.periodo(); }
}`;

const MESSAGE_SOURCE = `public class RelacionamentoMensagem {
    public static void main(String[] args) {
        DestinatarioRel destinatario = new DestinatarioRel("Ana", "11999999999");
        ConteudoRel conteudo = new ConteudoRel("boas_vindas", "Olá, Ana!");
        MensagemRel mensagem = new MensagemRel(destinatario, conteudo, CanalRel.WHATSAPP, StatusMensagemRel.PENDENTE);
        System.out.println("Pode enviar: " + mensagem.podeEnviar());
        System.out.println("Antes: " + mensagem.status());
        MensagemRel enviada = mensagem.enviar();
        System.out.println("Depois: " + enviada.status());
    }
}

enum CanalRel { WHATSAPP, EMAIL, SMS }
enum StatusMensagemRel { PENDENTE, ENVIADA, ERRO, CANCELADA }

record DestinatarioRel(String nome, String contato) {
    DestinatarioRel {
        if (nome == null || nome.isBlank() || contato == null || contato.isBlank()) {
            throw new IllegalArgumentException("Destinatário inválido.");
        }
    }
    boolean contatoValido() { return contato.length() >= 8; }
}

record ConteudoRel(String modelo, String texto) {
    ConteudoRel {
        if (modelo == null || modelo.isBlank() || texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Conteúdo inválido.");
        }
    }
    boolean prontoParaEnvio() { return texto.length() <= 500; }
}

record MensagemRel(DestinatarioRel destinatario, ConteudoRel conteudo, CanalRel canal, StatusMensagemRel status) {
    MensagemRel {
        if (destinatario == null || conteudo == null || canal == null || status == null) {
            throw new IllegalArgumentException("Mensagem inválida.");
        }
    }
    boolean podeEnviar() {
        return status == StatusMensagemRel.PENDENTE
                && destinatario.contatoValido()
                && conteudo.prontoParaEnvio();
    }
    MensagemRel enviar() {
        if (!podeEnviar()) throw new IllegalStateException("Mensagem não pode ser enviada.");
        return new MensagemRel(destinatario, conteudo, canal, StatusMensagemRel.ENVIADA);
    }
}`;

const CONTRACT_SOURCE = `import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class RelacionamentoContrato {
    public static void main(String[] args) {
        ClienteCorporativoRel cliente = new ClienteCorporativoRel("ACME", true);
        ServicoRel servico = new ServicoRel("Suporte Java", new BigDecimal("1200.00"));
        VigenciaRel vigencia = new VigenciaRel(LocalDate.of(2026, 1, 1), LocalDate.of(2026, 7, 1));
        PagamentoContratoRel pagamento = new PagamentoContratoRel(StatusPagamentoContratoRel.CONFIRMADO);
        ContratoRel contrato = new ContratoRel(cliente, servico, vigencia, pagamento);
        System.out.println("Pode ativar: " + contrato.podeAtivar());
        System.out.println("Meses: " + vigencia.quantidadeMeses());
        System.out.println("Valor total: R$ " + contrato.valorTotal());
    }
}

enum StatusPagamentoContratoRel { PENDENTE, APROVADO, CONFIRMADO, CANCELADO }
record ClienteCorporativoRel(String razaoSocial, boolean ativo) {
    ClienteCorporativoRel { if (razaoSocial == null || razaoSocial.isBlank()) throw new IllegalArgumentException(); }
}
record ServicoRel(String nome, BigDecimal valorMensal) {
    ServicoRel { if (nome == null || nome.isBlank() || valorMensal == null || valorMensal.signum() <= 0) throw new IllegalArgumentException(); }
}
record VigenciaRel(LocalDate inicio, LocalDate fim) {
    VigenciaRel { if (inicio == null || fim == null || !fim.isAfter(inicio)) throw new IllegalArgumentException(); }
    boolean valida() { return fim.isAfter(inicio); }
    long quantidadeMeses() { return ChronoUnit.MONTHS.between(inicio, fim); }
}
record PagamentoContratoRel(StatusPagamentoContratoRel status) {
    PagamentoContratoRel { if (status == null) throw new IllegalArgumentException(); }
    boolean aprovadoOuConfirmado() {
        return status == StatusPagamentoContratoRel.APROVADO || status == StatusPagamentoContratoRel.CONFIRMADO;
    }
}
record ContratoRel(ClienteCorporativoRel cliente, ServicoRel servico, VigenciaRel vigencia, PagamentoContratoRel pagamento) {
    ContratoRel { if (cliente == null || servico == null || vigencia == null || pagamento == null) throw new IllegalArgumentException(); }
    boolean podeAtivar() { return cliente.ativo() && vigencia.valida() && pagamento.aprovadoOuConfirmado(); }
    BigDecimal valorTotal() { return servico.valorMensal().multiply(BigDecimal.valueOf(vigencia.quantidadeMeses())); }
}`;

const TEST_SOURCE = `public class TesteRelacionamentos {
    public static void main(String[] args) {
        assertTrue(new ClienteRel("Ana", "ana@email.com", true).aptoParaComprar(), "cliente ativo");
        assertFalse(new ClienteRel("Ana", "ana@email.com", false).aptoParaComprar(), "cliente inativo");
        assertTrue(new DestinatarioRel("Ana", "11999999999").contatoValido(), "contato");
        assertTrue(new ConteudoRel("boas_vindas", "Olá").prontoParaEnvio(), "conteúdo");
        MensagemRel mensagem = new MensagemRel(new DestinatarioRel("Ana", "11999999999"),
                new ConteudoRel("boas_vindas", "Olá"), CanalRel.SMS, StatusMensagemRel.PENDENTE);
        assertTrue(mensagem.podeEnviar(), "mensagem pendente");
        assertEquals(StatusMensagemRel.ENVIADA, mensagem.enviar().status(), "mensagem enviada");
        expectArgument(() -> new DestinatarioRel("Ana", ""), "contato obrigatório");
        assertEquals(StatusMensagemRel.PENDENTE, mensagem.status(), "original imutável");
        System.out.println("8 testes passaram");
    }
    static void assertTrue(boolean atual, String caso) { if (!atual) throw new AssertionError(caso); }
    static void assertFalse(boolean atual, String caso) { assertTrue(!atual, caso); }
    static void assertEquals(Object esperado, Object atual, String caso) { if (!esperado.equals(atual)) throw new AssertionError(caso); }
    static void expectArgument(Runnable acao, String caso) {
        try { acao.run(); throw new AssertionError(caso); } catch (IllegalArgumentException esperado) { }
    }
}`;

const ERRORS = [
  [
    "Objeto centralizador",
    "Pedido valida e-mail, produto e status por conta própria.",
    "Delegue cada decisão ao objeto que possui os dados.",
  ],
  [
    "Cadeia de navegação",
    "pedido.cliente().endereco().cidade() revela toda a estrutura.",
    "Ofereça cidadeDeEntrega() ou resumoEntrega() na fronteira certa.",
  ],
  [
    "Tudo vira atributo",
    "Cupom temporário fica preso ao estado do Pedido.",
    "Receba o colaborador como parâmetro quando só participa de uma operação.",
  ],
  [
    "Tudo vira parâmetro",
    "Cliente e Pagamento precisam reaparecer em toda chamada.",
    "Guarde como atributo o que compõe o estado e a identidade operacional.",
  ],
  [
    "Dependência nula",
    "A colaboração quebra longe do construtor com NullPointerException.",
    "Recuse colaboradores obrigatórios ao criar o objeto.",
  ],
  [
    "String sem contrato",
    "Status, canal e turno aceitam grafias que o domínio não conhece.",
    "Use enum para conjuntos fechados e tipos do JDK para data e dinheiro.",
  ],
  [
    "Regra externa duplicada",
    "Várias classes repetem APROVADO ou CONFIRMADO.",
    "Pagamento oferece aprovadoOuConfirmado() como decisão de alto nível.",
  ],
  [
    "Acoplamento a detalhe",
    "Código externo interpreta name(), caixa e fragmentos do status.",
    "Colabore por comportamento; não decodifique representação interna.",
  ],
];

const EVIDENCE = `# Aula 115 — Relacionamento entre objetos
- [ ] Classifiquei composição, parâmetro e colaboração
- [ ] Troquei uma classe centralizadora por delegação
- [ ] Executei Pedido e apliquei Cupom temporário
- [ ] Decidi quando guardar atributo e quando receber parâmetro
- [ ] Refatorei uma cadeia longa pela Lei de Demeter
- [ ] Executei e reagendei a Ordem de Serviço sem alterar a original
- [ ] Enviei Mensagem por colaboração entre três objetos
- [ ] Provoquei cenários de cliente, pagamento, período e contato
- [ ] Depurei nove chamadas entre objetos
- [ ] Diagnostiquei oito erros de relacionamento
- [ ] Entreguei Contrato, oito testes e commit limpo`;

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

function RelationMap() {
  const [selected, setSelected] = useState(0);
  const relations = [
    {
      label: "Composição",
      owner: "Pedido",
      edge: "tem",
      target: "Pagamento",
      time: "Permanece no estado",
      question: "O pedido continua completo sem ele?",
      answer: "Não: é parte obrigatória.",
    },
    {
      label: "Parâmetro",
      owner: "Pedido",
      edge: "usa",
      target: "Cupom",
      time: "Só durante o cálculo",
      question: "Precisa ser lembrado depois?",
      answer: "Não: é dependência temporária.",
    },
    {
      label: "Colaboração",
      owner: "Pedido",
      edge: "pergunta",
      target: "Pagamento",
      time: "Durante uma decisão",
      question: "Quem conhece a regra do status?",
      answer: "Pagamento responde por comportamento.",
    },
  ];
  const relation = relations[selected];
  return (
    <section className="or115-stack">
      <div className="or115-principle">
        <Network size={25} />
        <div>
          <strong>Objetos não apenas existem: eles colaboram.</strong>
          <span>
            Possuir, receber e perguntar produzem relações diferentes.
          </span>
        </div>
      </div>
      <div className="or115-relation">
        <nav>
          {relations.map((item, index) => (
            <button
              type="button"
              className={index === selected ? "active" : ""}
              onClick={() => setSelected(index)}
              key={item.label}
            >
              <span>{index + 1}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <main>
          <div className="or115-nodes">
            <strong>{relation.owner}</strong>
            <span>{relation.edge}</span>
            <strong>{relation.target}</strong>
          </div>
          <p>
            <b>Ciclo:</b> {relation.time}
          </p>
          <p>
            <b>Pergunta:</b> {relation.question}
          </p>
          <p className="result">
            <CheckCircle2 size={16} />
            {relation.answer}
          </p>
        </main>
      </div>
    </section>
  );
}

function DelegationLab() {
  const [delegated, setDelegated] = useState(false);
  const raw = `return clienteEmail.contains("@")\n    && quantidade > 0\n    && pagamentoStatus.equals("APROVADO");`;
  const good = `return cliente.aptoParaComprar()\n    && item.valido()\n    && pagamento.aprovadoOuConfirmado();`;
  return (
    <section className="or115-stack">
      <div className="or115-toggle">
        <button
          type="button"
          className={!delegated ? "active" : ""}
          onClick={() => setDelegated(false)}
        >
          Pedido faz tudo
        </button>
        <button
          type="button"
          className={delegated ? "active" : ""}
          onClick={() => setDelegated(true)}
        >
          Pedido coordena
        </button>
      </div>
      <div
        className={
          "or115-delegation " + (delegated ? "healthy" : "centralized")
        }
      >
        <section>
          <span>{delegated ? "COORDENADOR" : "CENTRALIZADOR"}</span>
          <strong>Pedido.podeFinalizar()</strong>
          <pre>{delegated ? good : raw}</pre>
        </section>
        <div className="or115-call-list">
          {(delegated
            ? [
                ["Cliente", "aptoParaComprar()"],
                ["Item", "valido()"],
                ["Pagamento", "aprovadoOuConfirmado()"],
              ]
            : [
                ["Pedido", "valida e-mail"],
                ["Pedido", "valida quantidade"],
                ["Pedido", "interpreta status"],
              ]
          ).map(([object, action]) => (
            <article key={action}>
              <b>{object}</b>
              <span>{action}</span>
            </article>
          ))}
        </div>
      </div>
      <p className="guided-note">
        <ShieldCheck size={18} />
        <span>
          <strong>Delegar não é abandonar a regra.</strong> Pedido ainda
          coordena a decisão geral; cada colaborador responde apenas pelo que
          conhece.
        </span>
      </p>
    </section>
  );
}

function PedidoLab() {
  const [active, setActive] = useState(true);
  const [status, setStatus] = useState("APROVADO");
  const [paid, setPaid] = useState(399.8);
  const [coupon, setCoupon] = useState(10);
  const total = 399.8;
  const clientOk = active;
  const itemOk = true;
  const statusOk = status === "APROVADO" || status === "CONFIRMADO";
  const valueOk = paid >= total;
  const finalizes = clientOk && itemOk && statusOk && valueOk;
  const discounted = total * (1 - coupon / 100);
  return (
    <section className="or115-stack">
      <div className="or115-order">
        <div>
          <label>
            <span>Cliente ativo</span>
            <input
              type="checkbox"
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
            />
          </label>
          <label>
            <span>Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option>PENDENTE</option>
              <option>APROVADO</option>
              <option>CONFIRMADO</option>
              <option>CANCELADO</option>
            </select>
          </label>
          <label>
            <span>Valor pago</span>
            <input
              type="number"
              step="10"
              value={paid}
              onChange={(event) => setPaid(Number(event.target.value))}
            />
          </label>
          <label>
            <span>Cupom (%)</span>
            <input
              type="range"
              min="0"
              max="30"
              value={coupon}
              onChange={(event) => setCoupon(Number(event.target.value))}
            />
            <b>{coupon}%</b>
          </label>
        </div>
        <article>
          <h3>podeFinalizar()</h3>
          {[
            ["cliente.aptoParaComprar()", clientOk],
            ["item.valido()", itemOk],
            ["pagamento.aprovadoOuConfirmado()", statusOk],
            ["pagamento.valorCobre(total())", valueOk],
          ].map(([call, ok]) => (
            <p key={call} className={ok ? "ok" : "fail"}>
              <span>{ok ? "✓" : "✕"}</span>
              <code>{call}</code>
              <b>{String(ok)}</b>
            </p>
          ))}
          <strong className={finalizes ? "ok" : "fail"}>
            Resultado: {String(finalizes)}
          </strong>
          <small>
            Total R$ {total.toFixed(2)} · com cupom R$ {discounted.toFixed(2)}
          </small>
        </article>
      </div>
      <CodePanel name="RelacionamentoPedido.java" code={PEDIDO_SOURCE} />
      <div className="guided-console">
        <div className="guided-console-title">
          <Play size={15} />
          Terminal
        </div>
        <pre>{`> javac RelacionamentoPedido.java\n> java RelacionamentoPedido\nTotal: R$ 399.80\nPode finalizar: true\nCom cupom: R$ 359.82`}</pre>
      </div>
    </section>
  );
}

function AttributeParameterLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    [
      "Cliente do Pedido",
      "ATRIBUTO",
      "Faz parte do estado principal e será consultado depois.",
    ],
    [
      "Cupom no cálculo",
      "PARÂMETRO",
      "Participa de uma operação e não precisa ser guardado.",
    ],
    [
      "Pagamento do Pedido",
      "ATRIBUTO",
      "Compõe a decisão de finalização ao longo do ciclo.",
    ],
    [
      "Novo período ao reagendar",
      "PARÂMETRO",
      "É a entrada de uma transformação específica.",
    ],
    ["Atividade da OS", "ATRIBUTO", "É parte estrutural da Ordem de Serviço."],
    [
      "Data de referência",
      "PARÂMETRO",
      "Serve apenas para a comparação atual.",
    ],
  ];
  const current = cases[selected];
  return (
    <section className="or115-stack">
      <div className="or115-decision-grid">
        {cases.map((item, index) => (
          <button
            type="button"
            className={selected === index ? "active" : ""}
            onClick={() => setSelected(index)}
            key={item[0]}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item[0]}</strong>
          </button>
        ))}
      </div>
      <div className="or115-decision">
        <Route size={26} />
        <div>
          <span>{current[1]}</span>
          <h3>{current[0]}</h3>
          <p>{current[2]}</p>
        </div>
      </div>
      <div className="or115-question">
        <strong>Pergunta de projeto</strong>
        <span>
          “Este objeto precisa permanecer guardado depois da operação?”
        </span>
        <b>Sim → atributo · Não → provavelmente parâmetro</b>
      </div>
    </section>
  );
}

function CouplingLab() {
  const [selected, setSelected] = useState(0);
  const levels = [
    {
      label: "Cadeia longa",
      code: "pedido.cliente().endereco().cidade().trim().toUpperCase()",
      risk: "Quatro estruturas internas viram contrato externo.",
      impact: "Qualquer mudança de navegação quebra o consumidor.",
    },
    {
      label: "Detalhe decodificado",
      code: 'pagamento.status().name().toLowerCase().contains("aprov")',
      risk: "Representação textual substitui regra de domínio.",
      impact: "Novo status exige alterar todos os consumidores.",
    },
    {
      label: "Comportamento",
      code: "pedido.resumoEntrega()\npagamento.aprovadoOuConfirmado()",
      risk: "O consumidor conhece somente a intenção.",
      impact: "Detalhes internos podem evoluir localmente.",
    },
  ];
  const current = levels[selected];
  return (
    <section className="or115-stack">
      <div className="or115-coupling">
        <nav>
          {levels.map((item, index) => (
            <button
              type="button"
              className={selected === index ? "active" : ""}
              onClick={() => setSelected(index)}
              key={item.label}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <main>
          <span>
            {selected === 2
              ? "ACOPLAMENTO CONTROLADO"
              : "ACOPLAMENTO EXCESSIVO"}
          </span>
          <pre>{current.code}</pre>
          <p>
            <b>Leitura:</b> {current.risk}
          </p>
          <p>
            <b>Efeito:</b> {current.impact}
          </p>
        </main>
      </div>
      <div className="or115-demeter">
        <GitBranch size={24} />
        <div>
          <strong>Lei de Demeter, sem decorar</strong>
          <p>
            Converse com objetos próximos. Peça uma resposta útil em vez de
            atravessar uma cadeia de conhecidos.
          </p>
        </div>
      </div>
    </section>
  );
}

function OsLab() {
  const [status, setStatus] = useState("AGENDADA");
  const [tech, setTech] = useState(true);
  const [date, setDate] = useState("2026-07-20");
  const ended = status === "CONCLUIDA" || status === "CANCELADA";
  const future = date >= "2026-07-18";
  const execute = !ended && tech && future;
  const reschedule = !ended;
  return (
    <section className="or115-stack">
      <div className="or115-os">
        <section>
          <div className="root">OrdemServico</div>
          <div className="branch">
            <span>Cliente</span>
            <span>Atividade</span>
          </div>
          <div className="leaf">
            <span>contatoValido()</span>
            <span>Tecnico</span>
            <span>Periodo</span>
          </div>
          <div className="leaf">
            <i />
            <span>disponivel()</span>
            <span>futuroOuHoje()</span>
          </div>
        </section>
        <article>
          <label>
            Status da OS
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option>AGENDADA</option>
              <option>REAGENDADA</option>
              <option>CONCLUIDA</option>
              <option>CANCELADA</option>
            </select>
          </label>
          <label>
            Técnico ativo
            <input
              type="checkbox"
              checked={tech}
              onChange={(event) => setTech(event.target.checked)}
            />
          </label>
          <label>
            Data do período
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <p className={execute ? "ok" : "fail"}>
            podeExecutar → <b>{String(execute)}</b>
          </p>
          <p className={reschedule ? "ok" : "fail"}>
            podeReagendar → <b>{String(reschedule)}</b>
          </p>
        </article>
      </div>
      <div className="or115-version">
        <section>
          <span>os original</span>
          <strong>2026-07-20 · MANHÃ</strong>
          <small>Permanece igual</small>
        </section>
        <ArrowRight size={22} />
        <section>
          <span>os.reagendar(novoPeriodo)</span>
          <strong>2026-07-22 · TARDE</strong>
          <small>Nova referência</small>
        </section>
      </div>
      <CodePanel name="RelacionamentoOrdemServico.java" code={OS_SOURCE} />
    </section>
  );
}

function MessageLab() {
  const [contact, setContact] = useState("11999999999");
  const [text, setText] = useState("Olá, Ana!");
  const [status, setStatus] = useState("PENDENTE");
  const canSend =
    status === "PENDENTE" &&
    contact.length >= 8 &&
    text.length > 0 &&
    text.length <= 500;
  const send = () => {
    if (canSend) setStatus("ENVIADA");
  };
  return (
    <section className="or115-stack">
      <div className="or115-message">
        <div className="or115-message-flow">
          <section>
            <strong>Destinatario</strong>
            <span>
              {contact.length >= 8 ? "contato válido" : "contato curto"}
            </span>
          </section>
          <ArrowRight size={19} />
          <section>
            <strong>Conteudo</strong>
            <span>
              {text.length > 0 && text.length <= 500 ? "pronto" : "inválido"}
            </span>
          </section>
          <ArrowRight size={19} />
          <section>
            <strong>Mensagem</strong>
            <span>{status}</span>
          </section>
        </div>
        <div className="or115-message-controls">
          <label>
            Contato
            <input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
            />
          </label>
          <label>
            Texto
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </label>
          <button type="button" onClick={send} disabled={!canSend}>
            <Play size={16} />
            Enviar
          </button>
          <button type="button" onClick={() => setStatus("PENDENTE")}>
            <RotateCcw size={16} />
            Reiniciar
          </button>
        </div>
        <p className={canSend ? "ok" : "fail"}>
          <code>mensagem.podeEnviar()</code> → <b>{String(canSend)}</b>
        </p>
      </div>
      <CodePanel name="RelacionamentoMensagem.java" code={MESSAGE_SOURCE} />
    </section>
  );
}

function ScenarioLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    [
      "Pedido",
      "cliente ativo = false",
      "cliente.aptoParaComprar()",
      false,
      "Pedido coordena, Cliente decide.",
    ],
    [
      "Pedido",
      "pagamento = PENDENTE",
      "pagamento.aprovadoOuConfirmado()",
      false,
      "Nenhuma String é interpretada fora de Pagamento.",
    ],
    [
      "Pedido",
      "cupom = 20%",
      "cupom.aplicarSobre(total())",
      true,
      "A dependência temporária muda o cálculo, não o estado.",
    ],
    [
      "OS",
      "técnico ativo = false",
      "tecnico.disponivelParaAtendimento()",
      false,
      "Atividade consulta Técnico; OS não conhece o campo ativo.",
    ],
    [
      "OS",
      "data = ontem",
      "periodo.futuroOuHoje(referencia)",
      false,
      "Periodo possui a comparação temporal.",
    ],
    [
      "Mensagem",
      "contato curto",
      "destinatario.contatoValido()",
      false,
      "Mensagem apenas combina as respostas.",
    ],
    [
      "Mensagem",
      "status = ENVIADA",
      "status == PENDENTE",
      false,
      "O estado bloqueia um segundo envio.",
    ],
  ];
  const current = cases[selected];
  return (
    <section className="or115-stack">
      <div className="or115-scenarios">
        <nav>
          {cases.map((item, index) => (
            <button
              type="button"
              className={index === selected ? "active" : ""}
              onClick={() => setSelected(index)}
              key={item[1]}
            >
              <span>{index + 1}</span>
              <b>{item[0]}</b>
              <small>{item[1]}</small>
            </button>
          ))}
        </nav>
        <main>
          <span>SINTOMA PROVOCADO</span>
          <h3>{current[1]}</h3>
          <code>{current[2]}</code>
          <strong className={current[3] ? "ok" : "fail"}>
            Resultado observado: {String(current[3])}
          </strong>
          <p>{current[4]}</p>
        </main>
      </div>
      <p className="guided-note">
        <AlertTriangle size={18} />
        <span>
          <strong>Mude uma variável por vez.</strong> Antes de executar, escreva
          qual colaborador deve responder e qual saída você espera.
        </span>
      </p>
    </section>
  );
}

function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    [
      "1",
      "Pedido.podeFinalizar()",
      "this = Pedido#1001",
      "Coordena quatro respostas sem abrir os objetos.",
    ],
    [
      "2",
      "Cliente.aptoParaComprar()",
      "ativo = true",
      "Cliente responde apenas sobre sua aptidão.",
    ],
    [
      "3",
      "Item.valido()",
      "quantidade = 2",
      "Item consulta o Produto que já foi validado.",
    ],
    [
      "4",
      "Pagamento.aprovadoOuConfirmado()",
      "status = APROVADO",
      "Pagamento traduz o enum em decisão de domínio.",
    ],
    ["5", "Pedido.total()", "item = Item#01", "Pedido pede subtotal ao Item."],
    [
      "6",
      "Item.subtotal()",
      "199.90 × 2",
      "O cálculo vive perto de preço e quantidade.",
    ],
    [
      "7",
      "Pagamento.valorCobre(total)",
      "399.80 >= 399.80",
      "A comparação de pagamento permanece no Pagamento.",
    ],
    [
      "8",
      "Pedido.totalComDesconto(cupom)",
      "cupom = PROMO10",
      "Cupom chega como parâmetro temporário.",
    ],
    [
      "9",
      "Cupom.aplicarSobre(total)",
      "10% de 399.80",
      "O colaborador devolve 359.82 sem virar atributo.",
    ],
  ];
  const current = frames[step];
  return (
    <section className="or115-stack">
      <div className="or115-debug">
        <div className="or115-debug-toolbar">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft size={15} />
            Voltar
          </button>
          <button
            type="button"
            onClick={() => setStep(Math.min(frames.length - 1, step + 1))}
            disabled={step === frames.length - 1}
          >
            <StepForward size={15} />
            Step Into
          </button>
          <span>
            {step + 1} / {frames.length}
          </span>
        </div>
        <div className="or115-debug-body">
          <aside>
            {frames.map((item, index) => (
              <button
                type="button"
                className={index === step ? "active" : ""}
                onClick={() => setStep(index)}
                key={item[1]}
              >
                <span>{item[0]}</span>
                {item[1]}
              </button>
            ))}
          </aside>
          <main>
            <span>CALL STACK</span>
            <strong>{current[1]}</strong>
            <code>{current[2]}</code>
            <p>{current[3]}</p>
          </main>
        </div>
      </div>
      <p className="guided-note">
        <Network size={18} />
        <span>
          <strong>Observe as referências.</strong> Step Into mostra o Pedido
          passando a decisão ao colaborador certo, e a pilha registra o caminho
          de volta.
        </span>
      </p>
    </section>
  );
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return (
    <section className="or115-stack">
      <div className="or115-errors">
        <nav>
          {ERRORS.map((item, index) => (
            <button
              type="button"
              className={index === selected ? "active" : ""}
              onClick={() => setSelected(index)}
              key={item[0]}
            >
              <span>{index + 1}</span>
              <strong>{item[0]}</strong>
            </button>
          ))}
        </nav>
        <main>
          <span className="guided-error-label">
            <AlertTriangle size={16} />
            CASO {selected + 1} DE {ERRORS.length}
          </span>
          <h3>{current[0]}</h3>
          <section>
            <div>
              <b>Sintoma</b>
              <p>{current[1]}</p>
            </div>
            <ArrowRight size={18} />
            <div>
              <b>Como corrigir</b>
              <p>{current[2]}</p>
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
    "Contrato compila",
    "Cinco cenários executados",
    "Oito testes passam",
    ".class ignorado",
    "Commit limpo",
  ];
  const toggle = (index) =>
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  return (
    <section className="or115-stack">
      <CodePanel name="RelacionamentoContrato.java" code={CONTRACT_SOURCE} />
      <CodePanel name="TesteRelacionamentos.java" code={TEST_SOURCE} />
      <div className="guided-console">
        <div className="guided-console-title">
          <Play size={15} />
          Terminal · compile o conjunto
        </div>
        <pre>{`> javac -encoding UTF-8 RelacionamentoPedido.java RelacionamentoOrdemServico.java RelacionamentoMensagem.java RelacionamentoContrato.java TesteRelacionamentos.java\n> java RelacionamentoContrato\nPode ativar: true\nMeses: 6\nValor total: R$ 7200.00\n> java TesteRelacionamentos\n8 testes passaram\n> git status\n> git add labs/m4/aula-115-relacionamento-entre-objetos\n> git commit -m "Aula 115: pratica relacionamento entre objetos"`}</pre>
      </div>
      <div className="or115-checklist">
        {tasks.map((item, index) => (
          <button
            type="button"
            className={checked.has(index) ? "done" : ""}
            onClick={() => toggle(index)}
            key={item}
          >
            <span>{checked.has(index) ? <Check size={14} /> : index + 1}</span>
            {item}
          </button>
        ))}
      </div>
      <section className="guided-challenge">
        <div className="guided-challenge-title">
          <Sparkles size={22} />
          <h3>Defesa oral do Contrato</h3>
        </div>
        <ul>
          <li>Quais quatro objetos compõem o contrato?</li>
          <li>Quem decide se a vigência é válida?</li>
          <li>Por que Pagamento oferece aprovadoOuConfirmado()?</li>
          <li>Onde BigDecimal e LocalDate evitam tipos fracos?</li>
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
    id: "map",
    label: "Mapa das Relações",
    duration: "10 min",
    eyebrow: "POSSUIR, RECEBER E CONSULTAR",
    title: "Dê nome ao vínculo antes de escrever o código",
    blocks: [
      {
        type: "lead",
        text: "Composição permanece no estado, parâmetro participa de uma operação e colaboração pede comportamento a outro objeto.",
      },
      { type: "map" },
    ],
  },
  {
    id: "delegation",
    label: "Delegação com Critério",
    duration: "13 min",
    eyebrow: "COORDENAR SEM CENTRALIZAR",
    title: "Deixe Pedido compor a decisão sem roubar regras",
    blocks: [
      {
        type: "lead",
        text: "O coordenador conhece a pergunta geral; Cliente, Item e Pagamento respondem as partes que dominam.",
      },
      { type: "delegation" },
    ],
  },
  {
    id: "pedido",
    label: "Pedido Colaborativo",
    duration: "22 min",
    eyebrow: "CLIENTE, ITEM, PAGAMENTO E CUPOM",
    title: "Execute quatro respostas e uma dependência temporária",
    blocks: [
      {
        type: "lead",
        text: "Altere cliente, status, valor e cupom; acompanhe qual chamada muda e por que o resultado geral muda.",
      },
      { type: "pedido" },
    ],
  },
  {
    id: "attribute",
    label: "Atributo ou Parâmetro",
    duration: "11 min",
    eyebrow: "ESTADO PERMANENTE VERSUS USO LOCAL",
    title: "Guarde apenas o que precisa continuar existindo",
    blocks: [
      {
        type: "lead",
        text: "Cliente e Pagamento compõem Pedido; Cupom e data de referência entram somente na operação que os utiliza.",
      },
      { type: "attribute" },
    ],
  },
  {
    id: "coupling",
    label: "Acoplamento e Demeter",
    duration: "14 min",
    eyebrow: "COMPORTAMENTO EM VEZ DE NAVEGAÇÃO",
    title: "Corte cadeias longas e detalhes decodificados",
    blocks: [
      {
        type: "lead",
        text: "Um método de intenção protege o consumidor das mudanças internas e mantém a regra em um único lugar.",
      },
      { type: "coupling" },
    ],
  },
  {
    id: "os",
    label: "OS em Colaboração",
    duration: "20 min",
    eyebrow: "CLIENTE, ATIVIDADE, TÉCNICO E PERÍODO",
    title: "Distribua podeExecutar e preserve a OS original",
    blocks: [
      {
        type: "lead",
        text: "A chamada atravessa colaboradores por comportamento; reagendar devolve uma nova árvore de objetos.",
      },
      { type: "os" },
    ],
  },
  {
    id: "message",
    label: "Mensagem Coordenada",
    duration: "16 min",
    eyebrow: "DESTINATÁRIO, CONTEÚDO, CANAL E ESTADO",
    title: "Envie apenas quando três respostas concordarem",
    blocks: [
      {
        type: "lead",
        text: "Contato e conteúdo validam seus próprios dados; Mensagem combina as decisões e produz a versão ENVIADA.",
      },
      { type: "message" },
    ],
  },
  {
    id: "scenarios",
    label: "Laboratório de Cenários",
    duration: "14 min",
    eyebrow: "UMA MUDANÇA, UMA HIPÓTESE, UMA EVIDÊNCIA",
    title: "Provoque sete condições e encontre o dono da resposta",
    blocks: [
      {
        type: "lead",
        text: "Não aceite apenas true ou false: explique qual chamada decidiu e por que ela pertence àquele objeto.",
      },
      { type: "scenarios" },
    ],
  },
  {
    id: "debug",
    label: "Debug das Chamadas",
    duration: "14 min",
    eyebrow: "CALL STACK E STEP INTO",
    title: "Siga nove passos de Pedido até Cupom",
    blocks: [
      {
        type: "lead",
        text: "A pilha torna visível o coordenador chamando colaboradores e recebendo respostas de volta.",
      },
      { type: "debug" },
    ],
  },
  {
    id: "errors",
    label: "Clínica de Erros",
    duration: "12 min",
    eyebrow: "CENTRALIZAÇÃO, CADEIAS, NULL E TIPOS FRACOS",
    title: "Diagnostique oito relações que viraram dependência excessiva",
    blocks: [
      {
        type: "lead",
        text: "A correção distingue estado, parâmetro e comportamento sem tentar eliminar todo acoplamento.",
      },
      { type: "errors" },
    ],
  },
  {
    id: "delivery",
    label: "Entrega & Contrato",
    duration: "24 min",
    eyebrow: "BIGDECIMAL, LOCALDATE, TESTES E GIT",
    title: "Modele um Contrato que ativa por colaboração",
    blocks: [
      {
        type: "lead",
        text: "Cliente, Serviço, Vigência e Pagamento mantêm suas regras; Contrato coordena ativação e valor total.",
      },
      { type: "delivery" },
    ],
  },
];

function ContentBlock({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = {
    map: RelationMap,
    delegation: DelegationLab,
    pedido: PedidoLab,
    attribute: AttributeParameterLab,
    coupling: CouplingLab,
    os: OsLab,
    message: MessageLab,
    scenarios: ScenarioLab,
    debug: DebugLab,
    errors: ErrorsClinic,
    delivery: DeliveryLab,
  };
  const Component = map[block.type];
  return Component ? <Component /> : null;
}

export default function GuidedObjectRelationshipsLesson115({
  isCompleted,
  onToggleCompleted,
  onNextLesson,
  onPrevLesson,
  hasNextLesson,
  hasPrevLesson,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const validIds = new Set(steps.map((step) => step.id));
      return new Set(
        Array.isArray(saved) ? saved.filter((id) => validIds.has(id)) : [],
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
      !completionNormalizedRef.current &&
      isCompleted &&
      completedSteps.size !== steps.length
    ) {
      completionNormalizedRef.current = true;
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
  const stepDone = completedSteps.has(step.id);
  const allStepsDone = completedSteps.size === steps.length;
  const lessonComplete = isCompleted && allStepsDone;
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
    <article className="guided-git-lesson guided-object-relationships-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker">
            <Link2 size={17} />
            Oficina de objetos colaboradores
          </span>
          <p className="guided-sequence">115 · M4.11</p>
          <h1>Objetos profissionais conversam por intenção</h1>
          <p>
            Diferencie estado e dependência temporária, distribua decisões,
            reduza acoplamento e acompanhe Pedido, OS, Mensagem e Contrato
            colaborando.
          </p>
        </div>
        <div className="guided-hero-status">
          <Network size={42} />
          <strong>
            {Math.round((completedSteps.size / steps.length) * 100)}%
          </strong>
          <span>
            {completedSteps.size} de {steps.length} etapas concluídas
          </span>
        </div>
      </header>
      <GuidedLessonFacts
        ariaLabel="Resumo da aula 115"
        items={[
          { value: "5 fontes", label: "Compiladas em conjunto" },
          { value: "9 passos", label: "No debug das chamadas" },
          { value: "8 casos", label: "Na clínica de erros" },
        ]}
      />
      <div className="guided-layout">
        <nav
          ref={navRef}
          className="guided-step-nav"
          aria-label="Roteiro prático da aula 115"
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
                <h3>Objetos colaborando sem invadir detalhes</h3>
                <p>
                  {lessonComplete
                    ? "Aula concluída: avance para objetos de valor."
                    : "Execute Contrato e os testes antes de concluir."}
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
          Aula 114
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
            <small>Composição, parâmetro, colaboração e acoplamento</small>
          </span>
        </div>
        <button
          type="button"
          onClick={onNextLesson}
          disabled={!hasNextLesson || !lessonComplete}
        >
          Aula 116
          <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
