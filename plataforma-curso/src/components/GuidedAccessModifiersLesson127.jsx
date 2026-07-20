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
  DoorOpen,
  Eye,
  EyeOff,
  FileCode2,
  FolderTree,
  KeyRound,
  ListChecks,
  Lock,
  Package,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  StepForward,
  Unlock,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedAccessModifiersLesson.css";

const STORAGE_KEY = "guided-access-modifiers-lesson-127-progress";

const CLIENTE = `package br.com.curso.aula127.dominio.cliente;

public class Cliente {
    private final int id;
    private final String nome;
    private final boolean ativo;

    public Cliente(int id, String nome) { this(id, nome, true); }
    public Cliente(int id, String nome, boolean ativo) {
        if (id <= 0 || nome == null || nome.isBlank())
            throw new IllegalArgumentException("Cliente inválido.");
        this.id = id; this.nome = nome; this.ativo = ativo;
    }
    public int id() { return id; }
    public boolean ativo() { return ativo; }
    public String resumo() { return "Cliente " + id + " - " + nome + " | Ativo: " + ativo; }
}`;
const CLIENTE_APP = `package br.com.curso.aula127.app;
import br.com.curso.aula127.dominio.cliente.Cliente;

public class ClienteApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(10, "Ana Silva");
        System.out.println(cliente.resumo());
        System.out.println("Id: " + cliente.id());
        System.out.println("Ativo: " + cliente.ativo());
    }
}`;
const DINHEIRO = `package br.com.curso.aula127.dominio.valor;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public final class Dinheiro {
    private final BigDecimal valor;
    private Dinheiro(BigDecimal valor) {
        if (valor == null) throw new IllegalArgumentException("Valor obrigatório.");
        this.valor = normalizar(valor);
    }
    public static Dinheiro de(String valor) {
        if (valor == null || valor.isBlank()) throw new IllegalArgumentException("Valor obrigatório.");
        return new Dinheiro(new BigDecimal(valor));
    }
    public static Dinheiro zero() { return new Dinheiro(BigDecimal.ZERO); }
    public boolean positivo() { return valor.signum() > 0; }
    public boolean maiorOuIgual(Dinheiro outro) { return outro != null && valor.compareTo(outro.valor) >= 0; }
    public Dinheiro somar(Dinheiro outro) {
        if (outro == null) throw new IllegalArgumentException("Outro valor obrigatório.");
        return new Dinheiro(valor.add(outro.valor));
    }
    private BigDecimal normalizar(BigDecimal valor) { return valor.setScale(2, RoundingMode.HALF_UP); }
    @Override public boolean equals(Object outro) { return this == outro || outro instanceof Dinheiro d && Objects.equals(valor, d.valor); }
    @Override public int hashCode() { return Objects.hash(valor); }
    @Override public String toString() { return "R$ " + valor; }
}`;
const DINHEIRO_APP = `package br.com.curso.aula127.app;
import br.com.curso.aula127.dominio.valor.Dinheiro;

public class DinheiroApp {
    public static void main(String[] args) {
        Dinheiro preco = Dinheiro.de("199.90");
        Dinheiro frete = Dinheiro.de("20.00");
        System.out.println("Preço: " + preco);
        System.out.println("Frete: " + frete);
        System.out.println("Total: " + preco.somar(frete));
    }
}`;
const STATUS_PEDIDO = `package br.com.curso.aula127.dominio.pedido;
public enum StatusPedido { CRIADO, PAGO, CANCELADO }`;
const PEDIDO = `package br.com.curso.aula127.dominio.pedido;
import br.com.curso.aula127.dominio.cliente.Cliente;
import br.com.curso.aula127.dominio.valor.Dinheiro;

public class Pedido {
    private final int numero; private final Cliente cliente; private final Dinheiro total;
    private StatusPedido status = StatusPedido.CRIADO; private String motivoCancelamento = "";
    public Pedido(int numero, Cliente cliente, Dinheiro total) {
        if (numero <= 0 || cliente == null || total == null || !total.positivo())
            throw new IllegalArgumentException("Pedido inválido.");
        if (!cliente.ativo()) throw new IllegalStateException("Cliente inativo.");
        this.numero = numero; this.cliente = cliente; this.total = total;
    }
    public boolean criado() { return status == StatusPedido.CRIADO; }
    public boolean pago() { return status == StatusPedido.PAGO; }
    public boolean cancelado() { return status == StatusPedido.CANCELADO; }
    public void confirmarPagamento(Dinheiro valorPago) { validarPodeConfirmarPagamento(valorPago); status = StatusPedido.PAGO; }
    public void cancelar(String motivo) { validarPodeCancelar(motivo); status = StatusPedido.CANCELADO; motivoCancelamento = motivo; }
    public String resumo() { return "Pedido " + numero + " | " + cliente.resumo() + " | Total: " + total + " | Status: " + status + " | Motivo: " + motivoCancelamento; }
    private void validarPodeConfirmarPagamento(Dinheiro valorPago) {
        if (!criado()) throw new IllegalStateException("Somente pedido criado recebe pagamento.");
        if (valorPago == null || !valorPago.maiorOuIgual(total)) throw new IllegalArgumentException("Pagamento insuficiente.");
    }
    private void validarPodeCancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo obrigatório.");
        if (cancelado()) throw new IllegalStateException("Pedido já cancelado.");
        if (pago()) throw new IllegalStateException("Pedido pago.");
    }
}`;
const PEDIDO_APP = `package br.com.curso.aula127.app;
import br.com.curso.aula127.dominio.cliente.Cliente;
import br.com.curso.aula127.dominio.pedido.Pedido;
import br.com.curso.aula127.dominio.valor.Dinheiro;

public class PedidoApp {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(1001, new Cliente(10, "Ana Silva"), Dinheiro.de("399.80"));
        System.out.println(pedido.resumo());
        pedido.confirmarPagamento(Dinheiro.de("399.80"));
        System.out.println(pedido.resumo());
    }
}`;
const CALCULADORA = `package br.com.curso.aula127.dominio.pedido;

class CalculadoraResumoPedido {
    String linha(String titulo, String valor) {
        if (titulo == null || titulo.isBlank()) throw new IllegalArgumentException("Título obrigatório.");
        return titulo + ": " + (valor == null ? "" : valor);
    }
}`;
const PEDIDO_RESUMO = `package br.com.curso.aula127.dominio.pedido;

public class PedidoComResumoInterno {
    private final int numero; private final StatusPedido status;
    public PedidoComResumoInterno(int numero, StatusPedido status) {
        if (numero <= 0 || status == null) throw new IllegalArgumentException("Dados inválidos.");
        this.numero = numero; this.status = status;
    }
    public String resumo() {
        CalculadoraResumoPedido calculadora = new CalculadoraResumoPedido();
        return calculadora.linha("Pedido", String.valueOf(numero)) + " | " + calculadora.linha("Status", status.name());
    }
}`;
const RESUMO_APP = `package br.com.curso.aula127.app;
import br.com.curso.aula127.dominio.pedido.PedidoComResumoInterno;
import br.com.curso.aula127.dominio.pedido.StatusPedido;

public class ResumoInternoApp {
    public static void main(String[] args) {
        System.out.println(new PedidoComResumoInterno(1001, StatusPedido.CRIADO).resumo());
    }
}`;
const BASE_CADASTRO = `package br.com.curso.aula127.dominio.cliente;
public class BaseCadastro {
    protected String origemCadastro() { return "SISTEMA_INTERNO"; }
}`;
const CLIENTE_ORIGEM = `package br.com.curso.aula127.dominio.cliente;
public class ClienteComOrigem extends BaseCadastro {
    private final int id; private final String nome;
    public ClienteComOrigem(int id, String nome) {
        if (id <= 0 || nome == null || nome.isBlank()) throw new IllegalArgumentException("Cliente inválido.");
        this.id = id; this.nome = nome;
    }
    public String resumo() { return "Cliente " + id + " - " + nome + " | Origem: " + origemCadastro(); }
}`;
const ORIGEM_APP = `package br.com.curso.aula127.app;
import br.com.curso.aula127.dominio.cliente.ClienteComOrigem;
public class ClienteComOrigemApp {
    public static void main(String[] args) { System.out.println(new ClienteComOrigem(10, "Ana Silva").resumo()); }
}`;
const STATUS_CONTRATO = `package br.com.curso.aula127.dominio.contrato;
public enum StatusContrato { RASCUNHO, ATIVO, CANCELADO }`;
const PERIODO_CONTRATO = `package br.com.curso.aula127.dominio.contrato;
import java.time.LocalDate;
public final class PeriodoContrato {
    private final LocalDate inicio; private final LocalDate fim;
    public PeriodoContrato(LocalDate inicio, LocalDate fim) { ValidadorContrato.validarPeriodo(inicio, fim); this.inicio = inicio; this.fim = fim; }
    public LocalDate inicio() { return inicio; } public LocalDate fim() { return fim; }
}`;
const VALIDADOR_CONTRATO = `package br.com.curso.aula127.dominio.contrato;
import java.time.LocalDate;
final class ValidadorContrato {
    private ValidadorContrato() { }
    static void validarPeriodo(LocalDate inicio, LocalDate fim) {
        if (inicio == null || fim == null || fim.isBefore(inicio)) throw new IllegalArgumentException("Período inválido.");
    }
}`;
const SERVICO = `package br.com.curso.aula127.dominio.servico;
import br.com.curso.aula127.dominio.valor.Dinheiro;
public final class ServicoContratado {
    private final String nome; private final Dinheiro valorMensal;
    public ServicoContratado(String nome, Dinheiro valorMensal) {
        if (nome == null || nome.isBlank() || valorMensal == null || !valorMensal.positivo()) throw new IllegalArgumentException("Serviço inválido.");
        this.nome = nome; this.valorMensal = valorMensal;
    }
    public String nome() { return nome; } public Dinheiro valorMensal() { return valorMensal; }
}`;
const CONTRATO = `package br.com.curso.aula127.dominio.contrato;
import br.com.curso.aula127.dominio.servico.ServicoContratado;
public class Contrato {
    private final String codigo; private final ServicoContratado servico; private final PeriodoContrato periodo;
    private StatusContrato status = StatusContrato.RASCUNHO; private String motivoCancelamento = "";
    public Contrato(String codigo, ServicoContratado servico, PeriodoContrato periodo) {
        if (codigo == null || codigo.isBlank() || servico == null || periodo == null) throw new IllegalArgumentException("Contrato inválido.");
        this.codigo = codigo; this.servico = servico; this.periodo = periodo;
    }
    public void ativar() { validarPodeAtivar(); status = StatusContrato.ATIVO; }
    public void cancelar(String motivo) { validarPodeCancelar(motivo); status = StatusContrato.CANCELADO; motivoCancelamento = motivo; }
    public boolean ativo() { return status == StatusContrato.ATIVO; }
    public String resumo() { return codigo + " | " + servico.nome() + " | " + servico.valorMensal() + " | " + periodo.inicio() + " a " + periodo.fim() + " | " + status + " | " + motivoCancelamento; }
    private void validarPodeAtivar() { if (status != StatusContrato.RASCUNHO) throw new IllegalStateException("Contrato não está em rascunho."); }
    private void validarPodeCancelar(String motivo) { if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo obrigatório."); if (status == StatusContrato.CANCELADO) throw new IllegalStateException("Contrato já cancelado."); }
}`;
const CONTRATO_APP = `package br.com.curso.aula127.appcontrato;
import br.com.curso.aula127.dominio.contrato.*;
import br.com.curso.aula127.dominio.servico.ServicoContratado;
import br.com.curso.aula127.dominio.valor.Dinheiro;
import java.time.LocalDate;
public class ContratoApp {
    public static void main(String[] args) {
        Contrato contrato = new Contrato("CONT-127", new ServicoContratado("Suporte", Dinheiro.de("200")), new PeriodoContrato(LocalDate.of(2026,7,1), LocalDate.of(2026,9,30)));
        contrato.ativar(); System.out.println(contrato.resumo());
    }
}`;
const TESTE = `package br.com.curso.aula127.appcontrato;
import br.com.curso.aula127.dominio.contrato.*; import br.com.curso.aula127.dominio.servico.ServicoContratado; import br.com.curso.aula127.dominio.valor.Dinheiro; import java.time.LocalDate;
public class TesteAcesso127 {
    private static int n;
    public static void main(String[] args) {
        ServicoContratado s = new ServicoContratado("Suporte", Dinheiro.de("200")); PeriodoContrato p = new PeriodoContrato(LocalDate.of(2026,7,1), LocalDate.of(2026,9,30)); Contrato c = new Contrato("C",s,p);
        check(!c.ativo()); c.ativar(); check(c.ativo()); c.cancelar("fim"); check(!c.ativo()); expect(()->c.cancelar("")); expect(()->new PeriodoContrato(LocalDate.of(2026,8,1),LocalDate.of(2026,7,1))); expect(()->new ServicoContratado("",Dinheiro.de("1"))); expect(()->new Contrato("",s,p)); check(Dinheiro.de("2").maiorOuIgual(Dinheiro.de("1"))); System.out.println(n+" testes passaram");
    }
    private static void check(boolean ok){n++;if(!ok)throw new AssertionError();} private static void expect(Runnable r){try{r.run();throw new AssertionError();}catch(IllegalArgumentException e){n++;}}
}`;

const INVALID_PRIVATE_FIELD = `package br.com.curso.aula127.app;
import br.com.curso.aula127.dominio.cliente.Cliente;
class AcessoCampo127 { void alterar(Cliente cliente) { System.out.println(cliente.nome); } }`;
const INVALID_PRIVATE_CTOR = `package br.com.curso.aula127.app;
import br.com.curso.aula127.dominio.valor.Dinheiro;
import java.math.BigDecimal;
class AcessoConstrutor127 { Dinheiro criar() { return new Dinheiro(new BigDecimal("10")); } }`;
const INVALID_PRIVATE_METHOD = `package br.com.curso.aula127.app;
import br.com.curso.aula127.dominio.pedido.Pedido;
class AcessoMetodo127 { void validar(Pedido pedido) { pedido.validarPodeCancelar("teste"); } }`;
const INVALID_PACKAGE_CLASS = `package br.com.curso.aula127.app;
import br.com.curso.aula127.dominio.pedido.CalculadoraResumoPedido;
class AcessoPacote127 { CalculadoraResumoPedido calculadora; }`;
const INVALID_PROTECTED = `package br.com.curso.aula127.app;
import br.com.curso.aula127.dominio.cliente.ClienteComOrigem;
class AcessoProtected127 { String origem(ClienteComOrigem c) { return c.origemCadastro(); } }`;
const INVALID_TOP_PRIVATE = `package br.com.curso.aula127.dominio.cliente;
private class ClasseTopoPrivada127 { }`;

const FAILURE_SOURCES = [
  [
    "AcessoCampo127.java",
    INVALID_PRIVATE_FIELD,
    "nome has private access in Cliente",
  ],
  [
    "AcessoConstrutor127.java",
    INVALID_PRIVATE_CTOR,
    "Dinheiro(BigDecimal) has private access",
  ],
  [
    "AcessoMetodo127.java",
    INVALID_PRIVATE_METHOD,
    "validarPodeCancelar(String) has private access",
  ],
  [
    "AcessoPacote127.java",
    INVALID_PACKAGE_CLASS,
    "CalculadoraResumoPedido is not public",
  ],
  [
    "AcessoProtected127.java",
    INVALID_PROTECTED,
    "origemCadastro() has protected access",
  ],
  [
    "ClasseTopoPrivada127.java",
    INVALID_TOP_PRIVATE,
    "modifier private not allowed here",
  ],
];

const FILES = [
  ["src/br/com/curso/aula127/app/ClienteApp.java", CLIENTE_APP],
  ["src/br/com/curso/aula127/app/DinheiroApp.java", DINHEIRO_APP],
  ["src/br/com/curso/aula127/app/PedidoApp.java", PEDIDO_APP],
  ["src/br/com/curso/aula127/app/ResumoInternoApp.java", RESUMO_APP],
  ["src/br/com/curso/aula127/app/ClienteComOrigemApp.java", ORIGEM_APP],
  ["src/br/com/curso/aula127/dominio/cliente/Cliente.java", CLIENTE],
  ["src/br/com/curso/aula127/dominio/cliente/BaseCadastro.java", BASE_CADASTRO],
  [
    "src/br/com/curso/aula127/dominio/cliente/ClienteComOrigem.java",
    CLIENTE_ORIGEM,
  ],
  ["src/br/com/curso/aula127/dominio/valor/Dinheiro.java", DINHEIRO],
  ["src/br/com/curso/aula127/dominio/pedido/StatusPedido.java", STATUS_PEDIDO],
  ["src/br/com/curso/aula127/dominio/pedido/Pedido.java", PEDIDO],
  [
    "src/br/com/curso/aula127/dominio/pedido/CalculadoraResumoPedido.java",
    CALCULADORA,
  ],
  [
    "src/br/com/curso/aula127/dominio/pedido/PedidoComResumoInterno.java",
    PEDIDO_RESUMO,
  ],
  ["src/br/com/curso/aula127/appcontrato/ContratoApp.java", CONTRATO_APP],
  ["src/br/com/curso/aula127/appcontrato/TesteAcesso127.java", TESTE],
  [
    "src/br/com/curso/aula127/dominio/contrato/StatusContrato.java",
    STATUS_CONTRATO,
  ],
  [
    "src/br/com/curso/aula127/dominio/contrato/PeriodoContrato.java",
    PERIODO_CONTRATO,
  ],
  [
    "src/br/com/curso/aula127/dominio/contrato/ValidadorContrato.java",
    VALIDADOR_CONTRATO,
  ],
  ["src/br/com/curso/aula127/dominio/contrato/Contrato.java", CONTRATO],
  ["src/br/com/curso/aula127/dominio/servico/ServicoContratado.java", SERVICO],
];
const ERRORS = [
  [
    "public em tudo",
    "Cada detalhe vira dependência possível para outros pacotes.",
    "Comece restrito e publique somente a API necessária.",
  ],
  [
    "Atributo public",
    "A App altera status, total ou identidade sem regra.",
    "Mantenha estado private e exponha comportamentos intencionais.",
  ],
  [
    "Getter e setter automáticos",
    "A classe oferece leitura e escrita só porque possui campos.",
    "Trate cada método público como compromisso de API.",
  ],
  [
    "Validação pública",
    "A App chama validar e depois esquece de executar a mudança.",
    "Deixe validação private e dentro da operação pública.",
  ],
  [
    "Auxiliar public",
    "Outros pacotes passam a depender de CalculadoraResumoPedido.",
    "Se só o pacote usa, deixe a classe package-private.",
  ],
  [
    "protected como padrão",
    "Detalhes são expostos a pacote e herança sem necessidade.",
    "Use-o apenas em uma extensão deliberada; aprofunde com herança.",
  ],
  [
    "private sem bom modelo",
    "Campos estão ocultos, mas setStatus ainda permite qualquer transição.",
    "Encapsulamento exige uma API pública que represente regras.",
  ],
  [
    "Regra na App",
    "ContratoApp decide status e valida período.",
    "A App monta; o domínio protege decisões e invariantes.",
  ],
];
const EVIDENCE = `# Aula 127 — modificadores de acesso
- [ ] Expliquei public, private, package-private e protected
- [ ] Mantive atributos de domínio privados
- [ ] Controlei Dinheiro por factory e construtor private
- [ ] Separei API pública e validações internas de Pedido
- [ ] Testei auxiliar package-private
- [ ] Reproduzi seis falhas reais de acesso
- [ ] Usei getters e setters com critério
- [ ] Executei Cliente, Dinheiro, Pedido, Resumo, Origem e Contrato
- [ ] Executei oito testes do desafio`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="ac127-copy"
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
    <section className="ac127-code">
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
function AccessMatrix() {
  const [selected, setSelected] = useState("private");
  const rows = [
    {
      id: "private",
      label: "private",
      access: [1, 0, 0, 0],
      meaning: "Detalhe da própria classe",
    },
    {
      id: "package",
      label: "sem modificador",
      access: [1, 1, 0, 0],
      meaning: "Colaboração interna do pacote",
    },
    {
      id: "protected",
      label: "protected",
      access: [1, 1, 1, 0],
      meaning: "Mesmo pacote + subclasses",
    },
    {
      id: "public",
      label: "public",
      access: [1, 1, 1, 1],
      meaning: "API acessível em qualquer pacote",
    },
  ];
  const row = rows.find((x) => x.id === selected);
  const places = [
    "própria classe",
    "mesmo pacote",
    "subclasse externa",
    "outro pacote",
  ];
  return (
    <section className="ac127-stack">
      <div className="ac127-matrix">
        <nav>
          {rows.map((x) => (
            <button
              type="button"
              className={selected === x.id ? "active" : ""}
              onClick={() => setSelected(x.id)}
              key={x.id}
            >
              <KeyRound size={15} />
              {x.label}
            </button>
          ))}
        </nav>
        <main>
          {places.map((x, i) => (
            <article className={row.access[i] ? "open" : "closed"} key={x}>
              {row.access[i] ? <Unlock /> : <Lock />}
              <b>{x}</b>
              <span>{row.access[i] ? "acessa" : "não acessa"}</span>
            </article>
          ))}
        </main>
        <footer>
          <strong>{row.label}</strong>
          <span>{row.meaning}</span>
        </footer>
      </div>
      <p className="guided-note">
        <ShieldCheck size={18} />
        <span>
          <b>Regra de projeto:</b> comece mais restrito e abra somente quando um
          consumidor real precisar.
        </span>
      </p>
    </section>
  );
}
function ApiBoundary() {
  const [unsafe, setUnsafe] = useState(false);
  const safe = ["confirmarPagamento(valor)", "cancelar(motivo)", "resumo()"],
    bad = ["status = PAGO", "total = zero()", "numero = 0"];
  return (
    <section className="ac127-stack">
      <div className="ac127-boundary">
        <aside>
          <span>OUTRO PACOTE</span>
          <h3>PedidoApp</h3>
          {(unsafe ? bad : safe).map((x) => (
            <code key={x}>{x}</code>
          ))}
        </aside>
        <div className={unsafe ? "broken" : "safe"}>
          {unsafe ? <DoorOpen /> : <ShieldCheck />}
          <b>{unsafe ? "ESTADO EXPOSTO" : "API INTENCIONAL"}</b>
        </div>
        <main>
          <span>DOMÍNIO</span>
          <h3>Pedido</h3>
          <code>private StatusPedido status</code>
          <code>private Dinheiro total</code>
          <code>private int numero</code>
        </main>
      </div>
      <button
        type="button"
        className="ac127-toggle"
        onClick={() => setUnsafe((v) => !v)}
      >
        {unsafe ? <ShieldCheck /> : <AlertTriangle />}
        {unsafe ? "Restaurar encapsulamento" : "Simular atributos public"}
      </button>
    </section>
  );
}
function PrivateFieldsLab() {
  const [mode, setMode] = useState("valid");
  return (
    <section className="ac127-stack">
      <div className="ac127-tabs">
        <button
          type="button"
          className={mode === "valid" ? "active" : ""}
          onClick={() => setMode("valid")}
        >
          API pública
        </button>
        <button
          type="button"
          className={mode === "invalid" ? "active" : ""}
          onClick={() => setMode("invalid")}
        >
          campo privado
        </button>
      </div>
      <CodePanel
        name={mode === "valid" ? "Cliente.java" : "AcessoCampo127.java"}
        code={mode === "valid" ? CLIENTE : INVALID_PRIVATE_FIELD}
      />
      <div className="guided-console">
        <div className="guided-console-title">
          <Play size={15} />
          Compilador
        </div>
        <pre>
          {mode === "valid"
            ? "> java -cp out br.com.curso.aula127.app.ClienteApp\nCliente 10 - Ana Silva | Ativo: true\nId: 10\nAtivo: true"
            : "> javac ... AcessoCampo127.java\nnome has private access in Cliente"}
        </pre>
      </div>
    </section>
  );
}
function FactoryLab() {
  const [mode, setMode] = useState("factory");
  return (
    <section className="ac127-stack">
      <div className="ac127-factory">
        <nav>
          <button
            type="button"
            className={mode === "factory" ? "active" : ""}
            onClick={() => setMode("factory")}
          >
            Dinheiro.de
          </button>
          <button
            type="button"
            className={mode === "constructor" ? "active" : ""}
            onClick={() => setMode("constructor")}
          >
            new Dinheiro
          </button>
          <button
            type="button"
            className={mode === "helper" ? "active" : ""}
            onClick={() => setMode("helper")}
          >
            normalizar
          </button>
        </nav>
        <main>
          <span>{mode === "factory" ? <Unlock /> : <Lock />}</span>
          <h3>
            {mode === "factory"
              ? "Porta pública controlada"
              : "Detalhe privado protegido"}
          </h3>
          <code>
            {mode === "factory"
              ? 'Dinheiro.de("199.90")'
              : mode === "constructor"
                ? "new Dinheiro(BigDecimal.TEN)"
                : "dinheiro.normalizar(BigDecimal.TEN)"}
          </code>
          <p>
            {mode === "factory"
              ? "A factory valida texto e conduz ao único nascimento válido."
              : mode === "constructor"
                ? "O construtor centraliza invariantes, mas só a própria classe o chama."
                : "Normalização é implementação; consumidores não precisam conhecê-la."}
          </p>
        </main>
      </div>
      <CodePanel name="Dinheiro.java" code={DINHEIRO} />
    </section>
  );
}
function SmallApiLab() {
  const [call, setCall] = useState(0);
  const calls = [
    [
      "PedidoApp",
      "confirmarPagamento(valor)",
      "public: intenção do consumidor",
    ],
    [
      "Pedido",
      "validarPodeConfirmarPagamento(valor)",
      "private: protege a operação completa",
    ],
    ["Pedido", "status = PAGO", "private: mutação ocorre após validar"],
  ];
  const c = calls[call];
  return (
    <section className="ac127-stack">
      <div className="ac127-call">
        <nav>
          {calls.map((x, i) => (
            <button
              type="button"
              className={i === call ? "active" : ""}
              onClick={() => setCall(i)}
              key={x[1]}
            >
              <span>{i + 1}</span>
              {x[0]}
            </button>
          ))}
        </nav>
        <main>
          <span>FLUXO {call + 1} DE 3</span>
          <h3>{c[0]}</h3>
          <code>{c[1]}</code>
          <p>{c[2]}</p>
        </main>
      </div>
      <CodePanel name="Pedido.java" code={PEDIDO} />
      <p className="guided-note">
        <Eye size={18} />
        <span>
          O método público mostra o caso de uso; os métodos privados deixam o
          fluxo interno legível sem virar API separada.
        </span>
      </p>
    </section>
  );
}
function PackageLab() {
  const [viewer, setViewer] = useState("same");
  return (
    <section className="ac127-stack">
      <div className="ac127-package">
        <header>
          <button
            type="button"
            className={viewer === "same" ? "active" : ""}
            onClick={() => setViewer("same")}
          >
            mesmo pacote
          </button>
          <button
            type="button"
            className={viewer === "app" ? "active" : ""}
            onClick={() => setViewer("app")}
          >
            pacote app
          </button>
        </header>
        <main>
          <aside>
            <Package />
            <b>dominio.pedido</b>
            <code>CalculadoraResumoPedido</code>
            <code>PedidoComResumoInterno</code>
          </aside>
          <div className={viewer === "same" ? "allowed" : "blocked"}>
            {viewer === "same" ? <Unlock /> : <EyeOff />}
            <strong>
              {viewer === "same" ? "ACESSO PERMITIDO" : "ACESSO NEGADO"}
            </strong>
            <p>
              {viewer === "same"
                ? "PedidoComResumoInterno usa a auxiliar sem import."
                : "App usa somente PedidoComResumoInterno; a auxiliar não é public."}
            </p>
          </div>
        </main>
      </div>
      <CodePanel name="CalculadoraResumoPedido.java" code={CALCULADORA} />
    </section>
  );
}
function TopLevelLab() {
  const [selected, setSelected] = useState("public");
  const cases = {
    public: ["public class Cliente", "válida", "visível em qualquer pacote"],
    package: ["class ValidadorPedido", "válida", "visível somente no pacote"],
    private: [
      "private class Cliente",
      "inválida",
      "modifier private not allowed here",
    ],
    protected: [
      "protected class Cliente",
      "inválida",
      "modifier protected not allowed here",
    ],
  };
  const c = cases[selected];
  return (
    <section className="ac127-stack">
      <div className="ac127-top">
        <nav>
          {Object.keys(cases).map((x) => (
            <button
              type="button"
              className={x === selected ? "active" : ""}
              onClick={() => setSelected(x)}
              key={x}
            >
              {x}
            </button>
          ))}
        </nav>
        <main className={c[1] === "válida" ? "valid" : "invalid"}>
          <FolderTree />
          <code>{c[0]}</code>
          <strong>{c[1]}</strong>
          <p>{c[2]}</p>
        </main>
      </div>
      <p className="guided-warning">
        <AlertTriangle size={18} />
        <span>
          Uma classe de topo pode ser `public` ou package-private. `private` e
          `protected` só poderão aparecer em classes aninhadas, assunto
          posterior.
        </span>
      </p>
    </section>
  );
}
function ProtectedLab() {
  const [selected, setSelected] = useState(1);
  const viewers = [
    ["BaseCadastro", "própria classe", true],
    ["ClienteComOrigem", "subclasse no mesmo pacote", true],
    ["Outra classe de dominio.cliente", "mesmo pacote", true],
    ["ClienteComOrigemApp", "outro pacote, não subclasse", false],
    ["Subclasse em outro pacote", "pela herança", true],
  ];
  const v = viewers[selected];
  return (
    <section className="ac127-stack">
      <div className="ac127-protected">
        <nav>
          {viewers.map((x, i) => (
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
        <main className={v[2] ? "open" : "closed"}>
          {v[2] ? <Unlock /> : <Lock />}
          <span>protected String origemCadastro()</span>
          <h3>{v[0]}</h3>
          <strong>{v[2] ? "PODE ACESSAR" : "NÃO PODE ACESSAR"}</strong>
          <p>{v[1]}</p>
        </main>
      </div>
      <p className="guided-note">
        <ShieldCheck size={18} />
        <span>
          `protected` não é “quase public”. Em outro pacote, o acesso vem da
          relação de herança e possui regras adicionais; a aula de herança
          aprofundará isso.
        </span>
      </p>
      <CodePanel name="ClienteComOrigem.java" code={CLIENTE_ORIGEM} />
    </section>
  );
}
function ApiDecisionLab() {
  const [selected, setSelected] = useState(0);
  const decisions = [
    ["id()", "public", "Consumidor precisa identificar o cliente."],
    [
      "motivoCancelamento()",
      "depende",
      "Só abra se existir um caso de uso real; resumo pode bastar.",
    ],
    [
      "setStatus(status)",
      "não expor",
      "Permite pular confirmarPagamento e cancelar.",
    ],
    [
      "cancelar(motivo)",
      "public",
      "Expressa uma ação permitida e protege suas regras.",
    ],
    [
      "validarPodeCancelar(motivo)",
      "private",
      "É uma etapa da operação, não um caso de uso independente.",
    ],
    [
      "setNome(nome)",
      "depende",
      "Em DTO pode fazer sentido; em entidade requer regra e intenção.",
    ],
  ];
  const d = decisions[selected];
  return (
    <section className="ac127-stack">
      <div className="ac127-decisions">
        <nav>
          {decisions.map((x, i) => (
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
          <span>DECISÃO DE API</span>
          <h3>{d[0]}</h3>
          <strong>{d[1]}</strong>
          <p>{d[2]}</p>
        </main>
      </div>
      <section className="guided-challenge">
        <div className="guided-challenge-title">
          <KeyRound size={22} />
          <h3>Getter e setter também são compromissos</h3>
        </div>
        <p>
          Campo `private` não exige getter. Getter abre leitura; setter abre
          mutação. Em domínio, prefira métodos que revelem intenção e preservem
          invariantes.
        </p>
      </section>
    </section>
  );
}
function IntelliJDebug() {
  const [step, setStep] = useState(0);
  const frames = [
    [
      "PedidoApp",
      "pedido.confirmarPagamento",
      "única porta pública do caso de uso",
    ],
    [
      "Pedido",
      "validarPodeConfirmarPagamento",
      "Step Into entra no método private",
    ],
    ["Dinheiro", "maiorOuIgual", "objetos colaboram por API pública"],
    ["Pedido", "status = PAGO", "campo private muda dentro da própria classe"],
    [
      "PedidoComResumoInterno",
      "new CalculadoraResumoPedido",
      "classe package-private visível no pacote",
    ],
    [
      "ClienteComOrigem",
      "origemCadastro()",
      "subclasse chama método protected",
    ],
  ];
  const f = frames[step];
  return (
    <section className="ac127-stack">
      <div className="ac127-ide">
        <header>
          <span>IntelliJ IDEA · Debug</span>
          <div>
            <Search size={14} />
            Find Usages
          </div>
        </header>
        <section>
          <aside>
            {frames.map((x, i) => (
              <button
                type="button"
                className={i === step ? "active" : ""}
                onClick={() => setStep(i)}
                key={x[1]}
              >
                <span>{i + 1}</span>
                {x[0]}
              </button>
            ))}
          </aside>
          <main>
            <div>
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
                Step Into
              </button>
            </div>
            <span>
              FRAME {step + 1} DE {frames.length}
            </span>
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
  const failure = FAILURE_SOURCES[selected];
  return (
    <section className="ac127-stack">
      <div className="ac127-errors">
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
      {failure && (
        <>
          <CodePanel name={failure[0]} code={failure[1]} />
          <div className="guided-console">
            <div className="guided-console-title">
              <Play size={15} />
              Falha reproduzida pelo javac
            </div>
            <pre>{failure[2]}</pre>
          </div>
        </>
      )}
    </section>
  );
}
function Workspace() {
  const files = FILES.slice(13);
  const [active, setActive] = useState(0);
  return (
    <section className="ac127-workspace">
      <header>
        <span>contrato-com-acesso/</span>
        <small>{files.length} fontes</small>
      </header>
      <div>
        <nav>
          {files.map((f, i) => (
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
        <CodePanel name={files[active][0]} code={files[active][1]} />
      </div>
    </section>
  );
}
function DeliveryLab() {
  const [checked, setChecked] = useState(() => new Set());
  const tasks = [
    "Contrato public",
    "campos private",
    "Validador package-private",
    "auxiliares private",
    "App só usa API",
    "8 testes",
  ];
  return (
    <section className="ac127-stack">
      <Workspace />
      <div className="guided-console">
        <div className="guided-console-title">
          <Play size={15} />
          Terminal
        </div>
        <pre>{`> javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
> java -cp out br.com.curso.aula127.appcontrato.ContratoApp
CONT-127 | Suporte | R$ 200.00 | 2026-07-01 a 2026-09-30 | ATIVO
> java -cp out br.com.curso.aula127.appcontrato.TesteAcesso127
8 testes passaram
> git add labs/m4/aula-127-modificadores-de-acesso
> git commit -m "Aula 127: pratica modificadores de acesso"`}</pre>
      </div>
      <div className="ac127-checklist">
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
    id: "map",
    label: "Mapa de Acesso",
    duration: "13 min",
    eyebrow: "QUEM PODE ACESSAR?",
    title: "Enxergue as quatro fronteiras antes de escolher a palavra-chave",
    blocks: [
      {
        type: "lead",
        text: "Modificador de acesso define consumidores permitidos. A decisão vai da própria classe até qualquer pacote.",
      },
      { type: "map" },
    ],
  },
  {
    id: "boundary",
    label: "API versus Estado",
    duration: "13 min",
    eyebrow: "EXPONHA O MÍNIMO",
    title: "Troque campos mutáveis por ações que protegem o domínio",
    blocks: [
      {
        type: "lead",
        text: "Se status, total e número forem públicos, qualquer consumidor pula regras. Uma API pequena revela o que é permitido.",
      },
      { type: "boundary" },
    ],
  },
  {
    id: "private",
    label: "Cliente e private",
    duration: "16 min",
    eyebrow: "CAMPOS PROTEGIDOS",
    title: "Comprove no compilador que a App só atravessa métodos públicos",
    blocks: [
      {
        type: "lead",
        text: "Cliente é uma classe pública com estado privado. id(), ativo() e resumo() formam sua API externa.",
      },
      { type: "private" },
    ],
  },
  {
    id: "factory",
    label: "Construtor private",
    duration: "17 min",
    eyebrow: "NASCIMENTO CONTROLADO",
    title: "Faça Dinheiro nascer pela factory sem expor normalização",
    blocks: [
      {
        type: "lead",
        text: "Construtor e método auxiliar privados centralizam invariantes; de() e zero() oferecem entradas públicas expressivas.",
      },
      { type: "factory" },
    ],
  },
  {
    id: "pedido",
    label: "API Pequena do Pedido",
    duration: "20 min",
    eyebrow: "PUBLIC POR FORA, PRIVATE POR DENTRO",
    title: "Siga a chamada pública até a validação e a mutação privadas",
    blocks: [
      {
        type: "lead",
        text: "Confirmar e cancelar são casos de uso. Validar cada operação é detalhe interno inseparável da mudança.",
      },
      { type: "pedido" },
    ],
  },
  {
    id: "package",
    label: "Visibilidade de Pacote",
    duration: "17 min",
    eyebrow: "DETALHE COMPARTILHADO",
    title: "Deixe a calculadora visível para Pedido e invisível para App",
    blocks: [
      {
        type: "lead",
        text: "Sem modificador, classe e método pertencem à colaboração interna do pacote — não à API de todo o sistema.",
      },
      { type: "package" },
    ],
  },
  {
    id: "top-protected",
    label: "Topo e protected",
    duration: "18 min",
    eyebrow: "LIMITES DA LINGUAGEM",
    title: "Separe regras de classe de topo das regras de herança",
    blocks: [
      {
        type: "lead",
        text: "Classe de topo aceita public ou package-private. Protected combina pacote e subclasses e não deve virar padrão prematuro.",
      },
      { type: "top" },
      { type: "protected" },
    ],
  },
  {
    id: "getters",
    label: "Getters e Setters",
    duration: "15 min",
    eyebrow: "API COM CRITÉRIO",
    title: "Decida método por método em vez de gerar acesso automático",
    blocks: [
      {
        type: "lead",
        text: "Ocultar o campo e publicar getter e setter para tudo apenas desloca o problema. Cada método público cria dependência.",
      },
      { type: "decisions" },
    ],
  },
  {
    id: "debug",
    label: "IntelliJ e Debug",
    duration: "16 min",
    eyebrow: "STEP INTO NAS FRONTEIRAS",
    title: "Observe quem chama cada detalhe durante o fluxo real",
    blocks: [
      {
        type: "lead",
        text: "O debugger atravessa public, private, package-private e protected; o compilador decide quais chamadas podem existir.",
      },
      { type: "debug" },
    ],
  },
  {
    id: "errors",
    label: "Clínica de Erros",
    duration: "16 min",
    eyebrow: "OITO ANTIPADRÕES",
    title: "Diagnostique exposição excessiva sem confundir sintaxe e modelagem",
    blocks: [
      {
        type: "lead",
        text: "Nem todo erro de acesso é problema; frequentemente é o compilador protegendo a fronteira que você desenhou.",
      },
      { type: "errors" },
    ],
  },
  {
    id: "delivery",
    label: "Entrega & Contrato",
    duration: "31 min",
    eyebrow: "API PÚBLICA, DETALHES OCULTOS",
    title: "Entregue um Contrato que a App usa sem enxergar suas engrenagens",
    blocks: [
      {
        type: "lead",
        text: "Contrato e tipos de entrada são públicos; campos e validações internas são privados; ValidadorContrato fica restrito ao pacote.",
      },
      { type: "delivery" },
    ],
  },
];
function Block({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = {
    map: AccessMatrix,
    boundary: ApiBoundary,
    private: PrivateFieldsLab,
    factory: FactoryLab,
    pedido: SmallApiLab,
    package: PackageLab,
    top: TopLevelLab,
    protected: ProtectedLab,
    decisions: ApiDecisionLab,
    debug: IntelliJDebug,
    errors: ErrorsClinic,
    delivery: DeliveryLab,
  };
  const C = map[block.type];
  return C ? <C /> : null;
}
export default function GuidedAccessModifiersLesson127({
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
  const step = steps[activeIndex],
    done = completedSteps.has(step.id),
    allDone = completedSteps.size === steps.length,
    lessonComplete = isCompleted && allDone;
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
    <article className="guided-git-lesson guided-access-modifiers-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker">
            <KeyRound size={17} />
            Oficina de fronteiras Java
          </span>
          <p className="guided-sequence">127 · M4.23</p>
          <h1>Abra somente as portas que o domínio realmente promete</h1>
          <p>
            Domine public, private, package-private e protected com código
            compilado, falhas reais, mock do IntelliJ e uma API de Contrato
            pequena e segura.
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
        ariaLabel="Resumo da aula 127"
        items={[
          { value: "20 fontes", label: "Domínio e aplicações" },
          { value: "6 bloqueios", label: "Provados pelo javac" },
          { value: "8 casos", label: "Na clínica de erros" },
        ]}
      />
      <div className="guided-layout">
        <nav
          ref={navRef}
          className="guided-step-nav"
          aria-label="Roteiro prático da aula 127"
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
                <h3>Fronteiras comprovadas</h3>
                <p>
                  {lessonComplete
                    ? "Aula concluída: avance para coesão em classes."
                    : "Execute o Contrato e os oito testes antes de concluir."}
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
          Aula 126
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
            <small>public, private, pacote, protected, API e Contrato</small>
          </span>
        </div>
        <button
          type="button"
          onClick={onNextLesson}
          disabled={!hasNextLesson || !lessonComplete}
        >
          Aula 128
          <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
