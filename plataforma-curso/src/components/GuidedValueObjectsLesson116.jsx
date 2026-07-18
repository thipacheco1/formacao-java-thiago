import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  FileCode2,
  Fingerprint,
  Gem,
  ListChecks,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  StepForward,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedValueObjectsLesson.css";

const STORAGE_KEY = "guided-value-objects-lesson-116-progress";

const LOOSE_SOURCE = `import java.math.BigDecimal;
public class PedidoComDadosSoltos {
    public static void main(String[] args) {
        PedidoSolto pedido = new PedidoSolto("Ana", "anaemail.com", "11999999999", new BigDecimal("-150.00"));
        System.out.println(pedido.resumo());
    }
}
record PedidoSolto(String cliente, String email, String telefone, BigDecimal total) {
    String resumo() { return cliente + " | " + email + " | " + telefone + " | R$ " + total; }
}`;

const VALUES_SOURCE = `import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OficinaObjetosValor {
    public static void main(String[] args) {
        EmailValor email = new EmailValor(" Ana.Silva@Empresa.com ");
        DinheiroValor preco = new DinheiroValor(new BigDecimal("199.90"));
        DinheiroValor frete = new DinheiroValor(new BigDecimal("20.00"));
        TelefoneValor telefone = new TelefoneValor("11", "999999999");
        PeriodoValor periodo = new PeriodoValor(LocalDate.of(2026, 7, 18), LocalDate.of(2026, 7, 20));
        System.out.println(email.valor() + " | " + email.dominio() + " | corporativo=" + email.corporativo());
        System.out.println(preco.somar(frete).aplicarDesconto(new BigDecimal("10")).formatado());
        System.out.println(telefone.formatado());
        System.out.println(periodo.resumo() + " | dias=" + periodo.duracaoEmDias());
    }
}

record EmailValor(String valor) {
    EmailValor {
        if (valor == null || valor.isBlank()) throw new IllegalArgumentException("E-mail obrigatório.");
        valor = valor.trim().toLowerCase();
        int arroba = valor.indexOf('@');
        if (arroba <= 0 || arroba != valor.lastIndexOf('@') || arroba == valor.length() - 1)
            throw new IllegalArgumentException("E-mail inválido.");
    }
    String dominio() { return valor.substring(valor.indexOf('@') + 1); }
    boolean corporativo() { return !dominio().matches("gmail\\.com|hotmail\\.com|outlook\\.com"); }
    boolean mesmoDominio(EmailValor outro) { return outro != null && dominio().equals(outro.dominio()); }
}

record DinheiroValor(BigDecimal valor) {
    DinheiroValor {
        if (valor == null) throw new IllegalArgumentException("Valor obrigatório.");
        valor = valor.setScale(2, RoundingMode.HALF_UP);
    }
    static DinheiroValor zero() { return new DinheiroValor(BigDecimal.ZERO); }
    boolean positivo() { return valor.signum() > 0; }
    DinheiroValor somar(DinheiroValor outro) {
        if (outro == null) throw new IllegalArgumentException("Outro valor obrigatório.");
        return new DinheiroValor(valor.add(outro.valor));
    }
    DinheiroValor multiplicar(int quantidade) {
        if (quantidade < 0) throw new IllegalArgumentException("Quantidade negativa.");
        return new DinheiroValor(valor.multiply(BigDecimal.valueOf(quantidade)));
    }
    DinheiroValor aplicarDesconto(BigDecimal percentual) {
        if (percentual == null || percentual.signum() < 0 || percentual.compareTo(new BigDecimal("100")) > 0)
            throw new IllegalArgumentException("Percentual inválido.");
        BigDecimal fator = percentual.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        return new DinheiroValor(valor.subtract(valor.multiply(fator)));
    }
    String formatado() { return "R$ " + valor; }
}

record TelefoneValor(String ddd, String numero) {
    TelefoneValor {
        if (ddd == null || !ddd.matches("\\d{2}")) throw new IllegalArgumentException("DDD inválido.");
        if (numero == null || !numero.matches("\\d{8,9}")) throw new IllegalArgumentException("Número inválido.");
    }
    String formatado() { return "(" + ddd + ") " + numero; }
    boolean mesmoDdd(TelefoneValor outro) { return outro != null && ddd.equals(outro.ddd); }
    TelefoneValor comNumero(String novo) { return new TelefoneValor(ddd, novo); }
}

record PeriodoValor(LocalDate inicio, LocalDate fim) {
    PeriodoValor {
        if (inicio == null || fim == null || fim.isBefore(inicio)) throw new IllegalArgumentException("Período inválido.");
    }
    long duracaoEmDias() { return ChronoUnit.DAYS.between(inicio, fim) + 1; }
    boolean contem(LocalDate data) { return data != null && !data.isBefore(inicio) && !data.isAfter(fim); }
    boolean encerradoEm(LocalDate referencia) { return referencia != null && fim.isBefore(referencia); }
    String resumo() { return inicio + " até " + fim; }
}`;

const PEDIDO_SOURCE = `import java.math.BigDecimal;
public class PedidoComObjetosDeValor {
    public static void main(String[] args) {
        ClienteVo cliente = new ClienteVo("Ana", new EmailValor("ana@email.com"), new TelefoneValor("11", "999999999"));
        ProdutoVo produto = new ProdutoVo("PROD-001", "Cadeira", new DinheiroValor(new BigDecimal("199.90")));
        PedidoVo pedido = new PedidoVo(1001, cliente, new ItemVo(produto, 2));
        System.out.println(pedido.resumo());
    }
}
record ClienteVo(String nome, EmailValor email, TelefoneValor telefone) {
    ClienteVo { if (nome == null || nome.isBlank() || email == null || telefone == null) throw new IllegalArgumentException(); }
}
record ProdutoVo(String codigo, String nome, DinheiroValor preco) {
    ProdutoVo { if (codigo == null || codigo.isBlank() || nome == null || nome.isBlank() || preco == null || !preco.positivo()) throw new IllegalArgumentException(); }
}
record ItemVo(ProdutoVo produto, int quantidade) {
    ItemVo { if (produto == null || quantidade <= 0) throw new IllegalArgumentException(); }
    DinheiroValor subtotal() { return produto.preco().multiplicar(quantidade); }
}
record PedidoVo(int numero, ClienteVo cliente, ItemVo item) {
    PedidoVo { if (numero <= 0 || cliente == null || item == null) throw new IllegalArgumentException(); }
    DinheiroValor total() { return item.subtotal(); }
    String resumo() { return "Pedido " + numero + " | " + cliente.email().valor() + " | " + total().formatado(); }
}`;

const OS_SOURCE = `import java.time.LocalDate;
public class ObjetosValorOrdemServico {
    public static void main(String[] args) {
        OrdemServicoComValores os = new OrdemServicoComValores(new CodigoOsValor("OS-2026-0001"),
                new TelefoneValor("11", "988887777"),
                new PeriodoAtendimentoValor(LocalDate.of(2026, 7, 20), TurnoValor.MANHA),
                new EnderecoValor("Rua A", "123", "Barueri", "SP"), StatusOsValor.AGENDADA);
        System.out.println(os.resumo());
        System.out.println("Pode reagendar: " + os.podeReagendar());
    }
}
enum TurnoValor { MANHA, TARDE }
enum StatusOsValor { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
record CodigoOsValor(String valor) {
    CodigoOsValor { if (valor == null || !valor.matches("OS-\\d{4}-\\d{4}")) throw new IllegalArgumentException("Código inválido."); }
}
record PeriodoAtendimentoValor(LocalDate data, TurnoValor turno) {
    PeriodoAtendimentoValor { if (data == null || turno == null) throw new IllegalArgumentException("Período inválido."); }
    String resumo() { return data + " - " + turno; }
}
record EnderecoValor(String rua, String numero, String cidade, String estado) {
    EnderecoValor { if (rua == null || rua.isBlank() || numero == null || numero.isBlank() || cidade == null || cidade.isBlank() || estado == null || !estado.matches("[A-Za-z]{2}")) throw new IllegalArgumentException("Endereço inválido."); estado = estado.toUpperCase(); }
    String formatado() { return rua + ", " + numero + " - " + cidade + "/" + estado; }
}
record OrdemServicoComValores(CodigoOsValor codigo, TelefoneValor telefone, PeriodoAtendimentoValor periodo, EnderecoValor endereco, StatusOsValor status) {
    OrdemServicoComValores { if (codigo == null || telefone == null || periodo == null || endereco == null || status == null) throw new IllegalArgumentException(); }
    boolean podeReagendar() { return status != StatusOsValor.CONCLUIDA && status != StatusOsValor.CANCELADA; }
    String resumo() { return codigo.valor() + " | " + telefone.formatado() + " | " + periodo.resumo() + " | " + endereco.formatado(); }
}`;

const TEST_SOURCE = `import java.math.BigDecimal;
import java.time.LocalDate;
public class TesteObjetosValor {
    public static void main(String[] args) {
        assertEquals("ana@empresa.com", new EmailValor(" ANA@EMPRESA.COM ").valor(), "normalização");
        assertEquals("empresa.com", new EmailValor("ana@empresa.com").dominio(), "domínio");
        expectArgument(() -> new EmailValor("anaemail.com"), "e-mail inválido");
        DinheiroValor original = new DinheiroValor(new BigDecimal("100"));
        assertEquals("R$ 90.00", original.aplicarDesconto(new BigDecimal("10")).formatado(), "desconto");
        assertEquals("R$ 100.00", original.formatado(), "imutabilidade");
        assertEquals("(11) 999999999", new TelefoneValor("11", "999999999").formatado(), "telefone");
        assertEquals(3L, new PeriodoValor(LocalDate.of(2026, 7, 18), LocalDate.of(2026, 7, 20)).duracaoEmDias(), "período inclusivo");
        expectArgument(() -> new CodigoOsValor("2026-1"), "código inválido");
        System.out.println("8 testes passaram");
    }
    static void assertEquals(Object esperado, Object atual, String caso) { if (!esperado.equals(atual)) throw new AssertionError(caso); }
    static void expectArgument(Runnable acao, String caso) { try { acao.run(); throw new AssertionError(caso); } catch (IllegalArgumentException esperado) { } }
}`;

const ERRORS = [
  [
    "Embrulho sem regra",
    "Classe apenas guarda String e aceita qualquer valor.",
    "Adicione invariantes, normalização ou comportamento que justifique o tipo.",
  ],
  [
    "Setter em valor",
    "O mesmo Email muda depois de ser compartilhado.",
    "Mantenha final e devolva outro objeto para representar outro valor.",
  ],
  [
    "Infraestrutura dentro",
    "EmailValor tenta enviar mensagem ou consultar API.",
    "Valor representa conceito e regra local; serviço executa infraestrutura.",
  ],
  [
    "Classe para tudo",
    "Cada texto livre ganha um tipo sem melhorar leitura.",
    "Extraia somente conceitos recorrentes, importantes ou invariantes.",
  ],
  [
    "BigDecimal espalhado",
    "Escala, arredondamento e desconto se repetem.",
    "Centralize operações monetárias em DinheiroValor.",
  ],
  [
    "Nascer inválido",
    "Validação acontece muito depois do construtor.",
    "Recuse o dado na fronteira de criação.",
  ],
  [
    "Valor como entidade",
    "Email recebe ID artificial e ciclo de vida próprio.",
    "Compare pelo conteúdo; identidade pertence a Cliente ou Pedido.",
  ],
  [
    "Mutação escondida",
    "somar altera o objeto original e surpreende referências.",
    "Retorne novo DinheiroValor e preserve o anterior.",
  ],
];

const EVIDENCE = `# Aula 116 — Objetos de valor
- [ ] Diferenciei valor e entidade
- [ ] Provei que tipos soltos aceitam estados ruins
- [ ] Validei e normalizei Email
- [ ] Operei Dinheiro sem alterar o original
- [ ] Validei DDD e número do Telefone
- [ ] Modelei Período inclusivo com LocalDate
- [ ] Usei valores dentro de Pedido
- [ ] Apliquei critério antes de criar um tipo e usei record
- [ ] Depurei criação, normalização e retorno de novos valores
- [ ] Diagnostiquei oito erros comuns
- [ ] Entreguei OS com valores, oito testes e Git`;

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
    [
      "Email",
      "ana@email.com",
      "Mesmo conteúdo significa o mesmo valor.",
      "VALOR",
    ],
    [
      "Dinheiro",
      "R$ 100,00",
      "Não existe ID para distinguir duas notas conceituais.",
      "VALOR",
    ],
    [
      "Cliente",
      "id 10 · Ana",
      "Outra Ana com id 25 continua sendo outra pessoa.",
      "ENTIDADE",
    ],
    [
      "Pedido",
      "número 1001",
      "Mantém continuidade mesmo se status e itens mudarem.",
      "ENTIDADE",
    ],
  ];
  const current = cases[selected];
  return (
    <section className="vo116-stack">
      <div className="vo116-identity">
        <nav>
          {cases.map((item, index) => (
            <button
              type="button"
              className={index === selected ? "active" : ""}
              onClick={() => setSelected(index)}
              key={item[0]}
            >
              <span>{index + 1}</span>
              {item[0]}
            </button>
          ))}
        </nav>
        <main>
          <Fingerprint size={34} />
          <span>{current[3]}</span>
          <h3>{current[1]}</h3>
          <p>{current[2]}</p>
        </main>
      </div>
      <div className="vo116-rule">
        <strong>Entidade</strong>
        <span>continuidade por identidade</span>
        <b>Objeto de valor</b>
        <span>igualdade pelo conteúdo</span>
      </div>
    </section>
  );
}

function LooseLab() {
  const [typed, setTyped] = useState(false);
  return (
    <section className="vo116-stack">
      <div className="vo116-toggle">
        <button
          type="button"
          className={!typed ? "active" : ""}
          onClick={() => setTyped(false)}
        >
          Dados soltos
        </button>
        <button
          type="button"
          className={typed ? "active" : ""}
          onClick={() => setTyped(true)}
        >
          Tipos do domínio
        </button>
      </div>
      <div className={"vo116-loose " + (typed ? "safe" : "unsafe")}>
        <section>
          <span>{typed ? "BLOQUEADO NA CRIAÇÃO" : "COMPILA E EXECUTA"}</span>
          <strong>
            {typed
              ? 'new EmailValor("anaemail.com")'
              : 'email = "anaemail.com"'}
          </strong>
          <strong>
            {typed ? "new DinheiroValor(null)" : "total = -150.00"}
          </strong>
        </section>
        <article>
          <AlertTriangle size={25} />
          <h3>
            {typed ? "Estado inválido não nasce" : "Estado inválido circula"}
          </h3>
          <p>
            {typed
              ? "O construtor é a fronteira que protege o restante do sistema."
              : "String e BigDecimal conhecem sintaxe, não a regra do domínio."}
          </p>
        </article>
      </div>
      <CodePanel name="PedidoComDadosSoltos.java" code={LOOSE_SOURCE} />
    </section>
  );
}

function EmailLab() {
  const [input, setInput] = useState(" Ana.Silva@Empresa.com ");
  const normalized = input.trim().toLowerCase();
  const first = normalized.indexOf("@");
  const valid =
    first > 0 &&
    first === normalized.lastIndexOf("@") &&
    first < normalized.length - 1;
  const domain = valid ? normalized.slice(first + 1) : "—";
  const corporate =
    valid && !["gmail.com", "hotmail.com", "outlook.com"].includes(domain);
  return (
    <section className="vo116-stack">
      <div className="vo116-form">
        <label>
          Valor recebido
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </label>
        <div className={valid ? "valid" : "invalid"}>
          <span>
            {valid ? <BadgeCheck size={22} /> : <AlertTriangle size={22} />}
            {valid ? "Email válido" : "Email recusado"}
          </span>
          <strong>{valid ? normalized : "IllegalArgumentException"}</strong>
          <small>
            domínio: {domain} · corporativo: {String(corporate)}
          </small>
        </div>
      </div>
      <div className="vo116-pipeline">
        <span>entrada</span>
        <ArrowRight size={18} />
        <span>trim()</span>
        <ArrowRight size={18} />
        <span>lowercase()</span>
        <ArrowRight size={18} />
        <span>invariantes</span>
        <ArrowRight size={18} />
        <b>EmailValor</b>
      </div>
      <CodePanel
        name="OficinaObjetosValor.java · EmailValor"
        code={VALUES_SOURCE}
      />
    </section>
  );
}

function MoneyLab() {
  const [price, setPrice] = useState(199.9);
  const [shipping, setShipping] = useState(20);
  const [discount, setDiscount] = useState(10);
  const total = price + shipping;
  const final = total * (1 - discount / 100);
  return (
    <section className="vo116-stack">
      <div className="vo116-money">
        <section>
          <label>
            Preço
            <input
              type="number"
              step="10"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>
          <label>
            Frete
            <input
              type="number"
              step="5"
              value={shipping}
              onChange={(e) => setShipping(Number(e.target.value))}
            />
          </label>
          <label>
            Desconto
            <input
              type="range"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
            <b>{discount}%</b>
          </label>
        </section>
        <article>
          <span>preço original</span>
          <strong>R$ {price.toFixed(2)}</strong>
          <ArrowRight size={19} />
          <span>somar(frete)</span>
          <strong>R$ {total.toFixed(2)}</strong>
          <ArrowRight size={19} />
          <span>aplicarDesconto()</span>
          <strong>R$ {final.toFixed(2)}</strong>
        </article>
      </div>
      <p className="guided-note">
        <ShieldCheck size={18} />
        <span>
          <strong>Imutabilidade observável:</strong> preço continua R${" "}
          {price.toFixed(2)}; cada operação devolve outro DinheiroValor.
        </span>
      </p>
    </section>
  );
}

function PhoneLab() {
  const [ddd, setDdd] = useState("11");
  const [number, setNumber] = useState("999999999");
  const dddOk = /^\d{2}$/.test(ddd);
  const numberOk = /^\d{8,9}$/.test(number);
  const valid = dddOk && numberOk;
  return (
    <section className="vo116-stack">
      <div className="vo116-phone">
        <label>
          DDD
          <input
            value={ddd}
            maxLength={3}
            onChange={(e) => setDdd(e.target.value)}
          />
          <span className={dddOk ? "ok" : "fail"}>
            {dddOk ? "2 dígitos" : "inválido"}
          </span>
        </label>
        <label>
          Número
          <input
            value={number}
            maxLength={10}
            onChange={(e) => setNumber(e.target.value)}
          />
          <span className={numberOk ? "ok" : "fail"}>
            {numberOk ? "8 ou 9 dígitos" : "inválido"}
          </span>
        </label>
        <article>
          <strong>
            {valid ? `(${ddd}) ${number}` : "TelefoneValor não criado"}
          </strong>
          <small>
            mesmoDdd(outro) compara o conceito; comNumero(novo) cria outro
            telefone.
          </small>
        </article>
      </div>
    </section>
  );
}

function PeriodLab() {
  const [start, setStart] = useState("2026-07-18");
  const [end, setEnd] = useState("2026-07-20");
  const [query, setQuery] = useState("2026-07-19");
  const valid = end >= start;
  const days = valid
    ? Math.round(
        (new Date(end + "T00:00:00") - new Date(start + "T00:00:00")) /
          86400000,
      ) + 1
    : 0;
  const contains = valid && query >= start && query <= end;
  return (
    <section className="vo116-stack">
      <div className="vo116-period">
        <section>
          <label>
            Início
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </label>
          <label>
            Fim
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
          <label>
            Consultar
            <input
              type="date"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </section>
        <article>
          <div className="vo116-timeline">
            <span>
              início
              <br />
              {start}
            </span>
            <i />
            <b className={contains ? "inside" : ""}>
              consulta
              <br />
              {query}
            </b>
            <i />
            <span>
              fim
              <br />
              {end}
            </span>
          </div>
          <strong className={valid ? "ok" : "fail"}>
            {valid
              ? `${days} dias inclusivos · contém consulta: ${String(contains)}`
              : "Fim anterior ao início: construtor recusa"}
          </strong>
        </article>
      </div>
    </section>
  );
}

function CompositionLab() {
  const [quantity, setQuantity] = useState(2);
  const subtotal = 199.9 * quantity;
  return (
    <section className="vo116-stack">
      <div className="vo116-tree">
        <div className="root">PedidoVo #1001</div>
        <div className="level">
          <span>ClienteVo</span>
          <span>ItemVo</span>
        </div>
        <div className="level leaves">
          <span>EmailValor</span>
          <span>TelefoneValor</span>
          <span>ProdutoVo</span>
        </div>
        <div className="level leaves">
          <i />
          <i />
          <span>DinheiroValor</span>
        </div>
      </div>
      <div className="vo116-calc">
        <label>
          Quantidade
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          />
        </label>
        <code>produto.preco().multiplicar({quantity})</code>
        <strong>R$ {subtotal.toFixed(2)}</strong>
      </div>
      <CodePanel name="PedidoComObjetosDeValor.java" code={PEDIDO_SOURCE} />
    </section>
  );
}

function CriteriaLab() {
  const [selected, setSelected] = useState(0);
  const candidates = [
    ["Email", 4, "regra, normalização, recorrência e comportamento"],
    ["Observação livre", 0, "texto sem regra; String comunica o suficiente"],
    ["Código da OS", 4, "formato obrigatório, uso recorrente e nome forte"],
    ["Nome da rua", 1, "normalmente faz mais sentido dentro de Endereco"],
    ["Dinheiro", 4, "escala, arredondamento, operações e comparação"],
    [
      "Quantidade local",
      1,
      "int pode bastar enquanto não houver regra recorrente",
    ],
  ];
  const current = candidates[selected];
  return (
    <section className="vo116-stack">
      <div className="vo116-criteria">
        <nav>
          {candidates.map((item, index) => (
            <button
              type="button"
              className={index === selected ? "active" : ""}
              onClick={() => setSelected(index)}
              key={item[0]}
            >
              {item[0]}
            </button>
          ))}
        </nav>
        <main>
          <span>{current[1] >= 3 ? "BOM CANDIDATO" : "PROVÁVEL EXAGERO"}</span>
          <h3>{current[0]}</h3>
          <p>{current[2]}</p>
          <strong>
            {"●".repeat(current[1])}
            {"○".repeat(4 - current[1])}
          </strong>
        </main>
      </div>
      <div className="vo116-record">
        <code>{`record CodigoOs(String valor) {\n  CodigoOs {\n    if (!valor.startsWith("OS-")) throw new IllegalArgumentException();\n  }\n}`}</code>
        <p>
          <b>record ajuda</b> na estrutura imutável; não substitui critério,
          validação nem bons nomes.
        </p>
      </div>
    </section>
  );
}

function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    [
      "EmailValor()",
      'entrada = " Ana@EMPRESA.com "',
      "Construtor recebe dado ainda bruto.",
    ],
    [
      "trim().toLowerCase()",
      'valor = "ana@empresa.com"',
      "Normalização ocorre antes de guardar.",
    ],
    [
      "invariantes",
      "arroba = 3 · domínio presente",
      "Objeto só nasce depois das verificações.",
    ],
    ["DinheiroValor()", "199.9 → 199.90", "Escala é centralizada."],
    [
      "somar(frete)",
      "199.90 + 20.00",
      "BigDecimal produz valor para um novo objeto.",
    ],
    ["new DinheiroValor()", "total = 219.90", "O original continua 199.90."],
    ["PedidoVo.total()", "item = ItemVo#01", "Pedido delega subtotal."],
    [
      "ItemVo.subtotal()",
      "quantidade = 2",
      "Item pede multiplicação ao preço.",
    ],
    [
      "DinheiroValor.multiplicar()",
      "199.90 × 2 = 399.80",
      "Retorna outro valor tipado.",
    ],
  ];
  const current = frames[step];
  return (
    <section className="vo116-stack">
      <div className="vo116-debug">
        <div>
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
            {step + 1}/{frames.length}
          </span>
        </div>
        <section>
          <aside>
            {frames.map((item, index) => (
              <button
                type="button"
                className={index === step ? "active" : ""}
                onClick={() => setStep(index)}
                key={item[0]}
              >
                <span>{index + 1}</span>
                {item[0]}
              </button>
            ))}
          </aside>
          <main>
            <span>DEBUGGER</span>
            <h3>{current[0]}</h3>
            <code>{current[1]}</code>
            <p>{current[2]}</p>
          </main>
        </section>
      </div>
    </section>
  );
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return (
    <section className="vo116-stack">
      <div className="vo116-errors">
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
    "Código OS",
    "Telefone",
    "Período",
    "Endereço",
    "8 testes",
    "Git limpo",
  ];
  const toggle = (index) =>
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  return (
    <section className="vo116-stack">
      <CodePanel name="ObjetosValorOrdemServico.java" code={OS_SOURCE} />
      <CodePanel name="TesteObjetosValor.java" code={TEST_SOURCE} />
      <div className="guided-console">
        <div className="guided-console-title">
          <Play size={15} />
          Terminal
        </div>
        <pre>{`> javac -encoding UTF-8 PedidoComDadosSoltos.java OficinaObjetosValor.java PedidoComObjetosDeValor.java ObjetosValorOrdemServico.java TesteObjetosValor.java\n> java ObjetosValorOrdemServico\nOS-2026-0001 | (11) 988887777 | 2026-07-20 - MANHA | Rua A, 123 - Barueri/SP\nPode reagendar: true\n> java TesteObjetosValor\n8 testes passaram\n> git add labs/m4/aula-116-objetos-de-valor\n> git commit -m "Aula 116: pratica objetos de valor"`}</pre>
      </div>
      <div className="vo116-checklist">
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
          <h3>Defesa oral da Ordem de Serviço</h3>
        </div>
        <ul>
          <li>Qual valor impede um código fora do padrão?</li>
          <li>Por que Endereco é um valor e OS é entidade?</li>
          <li>Onde LocalDate e enum substituem String fraca?</li>
          <li>Qual operação retorna outro objeto sem mutar o original?</li>
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
    label: "Valor ou Entidade",
    duration: "10 min",
    eyebrow: "CONTEÚDO VERSUS IDENTIDADE",
    title: "Descubra o que torna dois objetos conceitualmente iguais",
    blocks: [
      {
        type: "lead",
        text: "Email e Dinheiro são definidos pelo conteúdo; Cliente e Pedido mantêm continuidade por identidade.",
      },
      { type: "identity" },
    ],
  },
  {
    id: "loose",
    label: "Dados Soltos",
    duration: "12 min",
    eyebrow: "STRING E BIGDECIMAL SEM REGRA",
    title: "Prove por que compilar não significa nascer válido",
    blocks: [
      {
        type: "lead",
        text: "O Java aceita e-mail sem @ e total negativo porque os tipos genéricos não conhecem a regra do domínio.",
      },
      { type: "loose" },
    ],
  },
  {
    id: "email",
    label: "EmailValor",
    duration: "17 min",
    eyebrow: "VALIDAÇÃO, NORMALIZAÇÃO E DOMÍNIO",
    title: "Transforme texto bruto em um valor confiável",
    blocks: [
      {
        type: "lead",
        text: "Digite entradas válidas e inválidas; acompanhe trim, lowercase, invariantes, domínio e decisão corporativa.",
      },
      { type: "email" },
    ],
  },
  {
    id: "money",
    label: "DinheiroValor",
    duration: "18 min",
    eyebrow: "ESCALA, OPERAÇÕES E IMUTABILIDADE",
    title: "Some e aplique desconto sem alterar o preço original",
    blocks: [
      {
        type: "lead",
        text: "Dinheiro centraliza BigDecimal, arredondamento e operações que sempre retornam outro valor.",
      },
      { type: "money" },
    ],
  },
  {
    id: "phone",
    label: "TelefoneValor",
    duration: "12 min",
    eyebrow: "DDD, NÚMERO E FORMATAÇÃO",
    title: "Faça DDD e número assinarem um contrato",
    blocks: [
      {
        type: "lead",
        text: "O construtor recusa letras e comprimentos errados; mesmoDdd e comNumero mantêm o comportamento no conceito.",
      },
      { type: "phone" },
    ],
  },
  {
    id: "period",
    label: "PeriodoValor",
    duration: "14 min",
    eyebrow: "INTERVALO, DURAÇÃO E CONTENÇÃO",
    title: "Modele datas que só existem em uma ordem válida",
    blocks: [
      {
        type: "lead",
        text: "LocalDate ganha semântica de período inclusivo, contém e encerrado, sem repetir comparações pelo sistema.",
      },
      { type: "period" },
    ],
  },
  {
    id: "composition",
    label: "Valores no Pedido",
    duration: "18 min",
    eyebrow: "COMPOSIÇÃO COM TIPOS EXPRESSIVOS",
    title: "Siga Pedido até Email, Telefone e Dinheiro",
    blocks: [
      {
        type: "lead",
        text: "A árvore mostra valores pequenos protegendo os objetos maiores; o subtotal continua tipado do início ao fim.",
      },
      { type: "composition" },
    ],
  },
  {
    id: "criteria",
    label: "Critério e Record",
    duration: "13 min",
    eyebrow: "EXTRAIR SEM EXAGERAR",
    title: "Crie um tipo somente quando ele compra clareza e segurança",
    blocks: [
      {
        type: "lead",
        text: "Regra, recorrência, formatação e comportamento justificam o valor; record ajuda na estrutura, não na decisão.",
      },
      { type: "criteria" },
    ],
  },
  {
    id: "debug",
    label: "Debug da Imutabilidade",
    duration: "14 min",
    eyebrow: "CONSTRUTOR, NORMALIZAÇÃO E NOVAS REFERÊNCIAS",
    title: "Entre em nove pontos e observe o original sobreviver",
    blocks: [
      {
        type: "lead",
        text: "O debugger revela o dado bruto sendo validado e operações monetárias criando novas instâncias.",
      },
      { type: "debug" },
    ],
  },
  {
    id: "errors",
    label: "Clínica de Erros",
    duration: "12 min",
    eyebrow: "EMBRULHO, SETTER, INFRAESTRUTURA E EXCESSO",
    title: "Diagnostique oito maneiras de criar um valor fraco",
    blocks: [
      {
        type: "lead",
        text: "Um bom objeto nasce válido, permanece imutável, representa conteúdo e não executa infraestrutura.",
      },
      { type: "errors" },
    ],
  },
  {
    id: "delivery",
    label: "Entrega & OS",
    duration: "22 min",
    eyebrow: "CÓDIGO, TELEFONE, PERÍODO, ENDEREÇO E GIT",
    title: "Entregue uma Ordem de Serviço protegida por valores",
    blocks: [
      {
        type: "lead",
        text: "A OS coordena quatro valores validados, usa enum para estados e prova o modelo com oito testes.",
      },
      { type: "delivery" },
    ],
  },
];

function ContentBlock({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = {
    identity: IdentityLab,
    loose: LooseLab,
    email: EmailLab,
    money: MoneyLab,
    phone: PhoneLab,
    period: PeriodLab,
    composition: CompositionLab,
    criteria: CriteriaLab,
    debug: DebugLab,
    errors: ErrorsClinic,
    delivery: DeliveryLab,
  };
  const Component = map[block.type];
  return Component ? <Component /> : null;
}

export default function GuidedValueObjectsLesson116({
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
    <article className="guided-git-lesson guided-value-objects-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker">
            <Gem size={17} />
            Oficina de tipos do domínio
          </span>
          <p className="guided-sequence">116 · M4.12</p>
          <h1>Conceitos importantes merecem tipos confiáveis</h1>
          <p>
            Troque dados soltos por Email, Dinheiro, Telefone e Período; valide
            na criação, preserve imutabilidade, use record com critério e
            entregue uma OS tipada.
          </p>
        </div>
        <div className="guided-hero-status">
          <Gem size={42} />
          <strong>
            {Math.round((completedSteps.size / steps.length) * 100)}%
          </strong>
          <span>
            {completedSteps.size} de {steps.length} etapas concluídas
          </span>
        </div>
      </header>
      <GuidedLessonFacts
        ariaLabel="Resumo da aula 116"
        items={[
          { value: "5 fontes", label: "Compiladas em conjunto" },
          { value: "9 passos", label: "No debug dos valores" },
          { value: "8 casos", label: "Na clínica de erros" },
        ]}
      />
      <div className="guided-layout">
        <nav
          ref={navRef}
          className="guided-step-nav"
          aria-label="Roteiro prático da aula 116"
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
                <h3>Valores válidos do nascimento ao uso</h3>
                <p>
                  {lessonComplete
                    ? "Aula concluída: avance para entidades."
                    : "Execute a OS e os testes antes de concluir."}
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
          Aula 115
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
              Valor, identidade, invariantes, imutabilidade e critério
            </small>
          </span>
        </div>
        <button
          type="button"
          onClick={onNextLesson}
          disabled={!hasNextLesson || !lessonComplete}
        >
          Aula 117
          <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
