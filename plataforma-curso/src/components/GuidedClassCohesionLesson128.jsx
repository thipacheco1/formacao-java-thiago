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
  Focus,
  GitBranch,
  Layers3,
  ListChecks,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Split,
  StepForward,
  Target,
} from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedClassCohesionLesson.css";

const STORAGE_KEY = "guided-class-cohesion-lesson-128-progress";
const BAD_PEDIDO = `package br.com.curso.aula128.exemplo.ruim;
import java.math.BigDecimal;import java.math.RoundingMode;
public class PedidoBaixaCoesaoApp {public static void main(String[]a){PedidoBaixaCoesao p=new PedidoBaixaCoesao(1001,"Ana Silva","ana@email.com",new BigDecimal("399.80"));p.confirmarPagamento(new BigDecimal("399.80"));p.enviarEmailConfirmacao();p.gerarTextoParaTela();System.out.println(p.resumo());}}
class PedidoBaixaCoesao {
 private final int numero;private final String nomeCliente;private final String emailCliente;private final BigDecimal total;private String status="CRIADO";private String ultimoEmailEnviado="";private String textoTela="";
 PedidoBaixaCoesao(int numero,String nome,String email,BigDecimal total){if(numero<=0||nome==null||nome.isBlank()||email==null||!email.contains("@")||total==null||total.signum()<=0)throw new IllegalArgumentException("Dados inválidos.");this.numero=numero;this.nomeCliente=nome;this.emailCliente=email.trim().toLowerCase();this.total=total.setScale(2,RoundingMode.HALF_UP);}
 void confirmarPagamento(BigDecimal pago){if(!"CRIADO".equals(status)||pago==null||pago.compareTo(total)<0)throw new IllegalStateException("Pagamento inválido.");status="PAGO";}
 void enviarEmailConfirmacao(){if(!"PAGO".equals(status))throw new IllegalStateException();ultimoEmailEnviado="Para: "+emailCliente+" | Olá "+nomeCliente+", pedido "+numero+" confirmado por R$ "+total;}
 void gerarTextoParaTela(){textoTela="Pedido #"+numero+" - "+nomeCliente+" - R$ "+total+" - "+status;}
 String resumo(){return numero+" | "+status+" | "+ultimoEmailEnviado+" | "+textoTela;}
}`;
const EMAIL = `package br.com.curso.aula128.dominio.valor;
public record Email(String valor){public Email{if(valor==null||valor.isBlank()||!valor.contains("@"))throw new IllegalArgumentException("E-mail inválido.");valor=valor.trim().toLowerCase();}public String dominio(){return valor.substring(valor.indexOf('@')+1);}@Override public String toString(){return valor;}}`;
const MONEY = `package br.com.curso.aula128.dominio.valor;
import java.math.BigDecimal;import java.math.RoundingMode;
public record Dinheiro(BigDecimal valor){public Dinheiro{if(valor==null)throw new IllegalArgumentException("Valor obrigatório.");valor=valor.setScale(2,RoundingMode.HALF_UP);}public static Dinheiro de(String valor){return new Dinheiro(new BigDecimal(valor));}public static Dinheiro zero(){return de("0");}public boolean positivo(){return valor.signum()>0;}public boolean maiorOuIgual(Dinheiro outro){return outro!=null&&valor.compareTo(outro.valor)>=0;}public Dinheiro somar(Dinheiro outro){if(outro==null)throw new IllegalArgumentException();return new Dinheiro(valor.add(outro.valor));}@Override public String toString(){return "R$ "+valor;}}`;
const CLIENT = `package br.com.curso.aula128.dominio.cliente;
import br.com.curso.aula128.dominio.valor.Email;
public record Cliente(int id,String nome,Email email,boolean ativo){public Cliente(int id,String nome,Email email){this(id,nome,email,true);}public Cliente{if(id<=0||nome==null||nome.isBlank()||email==null)throw new IllegalArgumentException("Cliente inválido.");}public String resumo(){return "Cliente "+id+" - "+nome;}}`;
const ORDER_STATUS = `package br.com.curso.aula128.dominio.pedido;
public enum StatusPedido { CRIADO, PAGO, CANCELADO }`;
const ORDER = `package br.com.curso.aula128.dominio.pedido;
import br.com.curso.aula128.dominio.cliente.Cliente;import br.com.curso.aula128.dominio.valor.Dinheiro;
public class Pedido {private final int numero;private final Cliente cliente;private final Dinheiro total;private StatusPedido status=StatusPedido.CRIADO;private String motivo="";public Pedido(int numero,Cliente cliente,Dinheiro total){if(numero<=0||cliente==null||total==null||!total.positivo())throw new IllegalArgumentException("Pedido inválido.");if(!cliente.ativo())throw new IllegalStateException("Cliente inativo.");this.numero=numero;this.cliente=cliente;this.total=total;}public int numero(){return numero;}public Cliente cliente(){return cliente;}public Dinheiro total(){return total;}public boolean pago(){return status==StatusPedido.PAGO;}public void confirmarPagamento(Dinheiro valor){if(status!=StatusPedido.CRIADO||!valor.maiorOuIgual(total))throw new IllegalStateException("Pagamento inválido.");status=StatusPedido.PAGO;}public void cancelar(String motivo){if(motivo==null||motivo.isBlank()||pago())throw new IllegalStateException("Cancelamento inválido.");status=StatusPedido.CANCELADO;this.motivo=motivo;}public String resumo(){return "Pedido "+numero+" | "+cliente.resumo()+" | "+total+" | "+status+" | "+motivo;}}`;
const MESSAGE_ORDER = `package br.com.curso.aula128.dominio.notificacao;
import br.com.curso.aula128.dominio.pedido.Pedido;
public class MensagemPedido {public String confirmacaoPagamento(Pedido pedido){if(pedido==null||!pedido.pago())throw new IllegalStateException("Pedido pago obrigatório.");return "Para: "+pedido.cliente().email()+" | Olá "+pedido.cliente().nome()+", pedido "+pedido.numero()+" confirmado por "+pedido.total();}}`;
const ORDER_APP = `package br.com.curso.aula128.app;
import br.com.curso.aula128.dominio.cliente.Cliente;import br.com.curso.aula128.dominio.notificacao.MensagemPedido;import br.com.curso.aula128.dominio.pedido.Pedido;import br.com.curso.aula128.dominio.valor.*;
public class PedidoCoesoApp {public static void main(String[]a){Cliente c=new Cliente(10,"Ana Silva",new Email("ana@email.com"));Pedido p=new Pedido(1001,c,Dinheiro.de("399.80"));p.confirmarPagamento(Dinheiro.de("399.80"));System.out.println(p.resumo());System.out.println(new MensagemPedido().confirmacaoPagamento(p));}}`;
const BAD_CONTRACT = `package br.com.curso.aula128.exemplo.ruim;
import java.math.*;import java.time.*;import java.time.temporal.ChronoUnit;
public class ContratoBaixaCoesaoApp {public static void main(String[]a){ContratoBaixaCoesao c=new ContratoBaixaCoesao("CONT-001","Cliente A","Instalação",new BigDecimal("150"),LocalDate.of(2026,1,1),LocalDate.of(2026,12,31));c.ativar();c.gerarMensagemComercial();c.calcularValorTotal();System.out.println(c.resumo());}}
class ContratoBaixaCoesao {private final String codigo,cliente,servico;private final BigDecimal mensal;private final LocalDate inicio,fim;private String status="RASCUNHO",mensagem="";private BigDecimal total=BigDecimal.ZERO;ContratoBaixaCoesao(String codigo,String cliente,String servico,BigDecimal mensal,LocalDate inicio,LocalDate fim){if(codigo==null||cliente==null||servico==null||mensal==null||mensal.signum()<=0||inicio==null||fim==null||fim.isBefore(inicio))throw new IllegalArgumentException();this.codigo=codigo;this.cliente=cliente;this.servico=servico;this.mensal=mensal.setScale(2,RoundingMode.HALF_UP);this.inicio=inicio;this.fim=fim;}void ativar(){status="ATIVO";}void calcularValorTotal(){long m=Math.max(1,ChronoUnit.MONTHS.between(inicio,fim.plusDays(1)));total=mensal.multiply(BigDecimal.valueOf(m));}void gerarMensagemComercial(){mensagem="Contrato "+codigo+" de "+cliente+" para "+servico+" está "+status;}String resumo(){return codigo+" | "+cliente+" | "+servico+" | R$ "+total+" | "+status+" | "+mensagem;}}`;
const CONTRACT_STATUS = `package br.com.curso.aula128.dominio.contrato; public enum StatusContrato { RASCUNHO, ATIVO, CANCELADO }`;
const CONTRACT_PERIOD = `package br.com.curso.aula128.dominio.contrato;
import java.time.LocalDate;import java.time.temporal.ChronoUnit;
public record PeriodoContrato(LocalDate inicio,LocalDate fim){public PeriodoContrato{if(inicio==null||fim==null||fim.isBefore(inicio))throw new IllegalArgumentException("Período inválido.");}public long quantidadeMeses(){return Math.max(1,ChronoUnit.MONTHS.between(inicio,fim.plusDays(1)));}@Override public String toString(){return inicio+" até "+fim;}}`;
const SERVICE = `package br.com.curso.aula128.dominio.servico;
import br.com.curso.aula128.dominio.valor.Dinheiro;
public record ServicoContratado(String nome,Dinheiro valorMensal){public ServicoContratado{if(nome==null||nome.isBlank()||valorMensal==null||!valorMensal.positivo())throw new IllegalArgumentException("Serviço inválido.");}public String resumo(){return nome+" | Valor mensal: "+valorMensal;}}`;
const CONTRACT = `package br.com.curso.aula128.dominio.contrato;
import br.com.curso.aula128.dominio.cliente.Cliente;import br.com.curso.aula128.dominio.servico.ServicoContratado;import br.com.curso.aula128.dominio.valor.Dinheiro;
public class Contrato {private final String codigo;private final Cliente cliente;private final ServicoContratado servico;private final PeriodoContrato periodo;private StatusContrato status=StatusContrato.RASCUNHO;private String motivo="";public Contrato(String codigo,Cliente cliente,ServicoContratado servico,PeriodoContrato periodo){if(codigo==null||!codigo.startsWith("CONT-")||cliente==null||servico==null||periodo==null)throw new IllegalArgumentException("Contrato inválido.");if(!cliente.ativo())throw new IllegalStateException("Cliente inativo.");this.codigo=codigo;this.cliente=cliente;this.servico=servico;this.periodo=periodo;}public void ativar(){if(status!=StatusContrato.RASCUNHO)throw new IllegalStateException();status=StatusContrato.ATIVO;}public void cancelar(String motivo){if(motivo==null||motivo.isBlank()||status==StatusContrato.CANCELADO)throw new IllegalStateException();status=StatusContrato.CANCELADO;this.motivo=motivo;}public Dinheiro valorTotal(){Dinheiro t=Dinheiro.zero();for(int m=0;m<periodo.quantidadeMeses();m++)t=t.somar(servico.valorMensal());return t;}public String resumo(){return "Contrato "+codigo+" | "+cliente.resumo()+" | "+servico.resumo()+" | "+periodo+" | Total: "+valorTotal()+" | "+status+" | "+motivo;}}`;
const CONTRACT_APP = `package br.com.curso.aula128.app;
import br.com.curso.aula128.dominio.cliente.Cliente;import br.com.curso.aula128.dominio.contrato.*;import br.com.curso.aula128.dominio.servico.ServicoContratado;import br.com.curso.aula128.dominio.valor.*;import java.time.LocalDate;
public class ContratoCoesoApp {public static void main(String[]a){Cliente c=new Cliente(20,"Cliente A",new Email("contratos@cliente.com"));Contrato x=new Contrato("CONT-001",c,new ServicoContratado("Instalação",Dinheiro.de("150")),new PeriodoContrato(LocalDate.of(2026,1,1),LocalDate.of(2026,12,31)));x.ativar();System.out.println(x.resumo());}}`;

const OS_CODE = `package br.com.curso.aula128.dominio.ordemservico; public record CodigoOs(String valor){public CodigoOs{if(valor==null||!valor.startsWith("OS-"))throw new IllegalArgumentException("Código inválido.");}@Override public String toString(){return valor;}}`;
const OS_SHIFT = `package br.com.curso.aula128.dominio.ordemservico; public enum TurnoAtendimento { MANHA, TARDE }`;
const OS_STATUS = `package br.com.curso.aula128.dominio.ordemservico; public enum StatusOs { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }`;
const OS_PERIOD = `package br.com.curso.aula128.dominio.ordemservico; import java.time.LocalDate; public record PeriodoAtendimento(LocalDate data,TurnoAtendimento turno){public PeriodoAtendimento{if(data==null||turno==null)throw new IllegalArgumentException("Período inválido.");}@Override public String toString(){return data+" "+turno;}}`;
const TECHNICIAN = `package br.com.curso.aula128.dominio.tecnico; public record Tecnico(int id,String nome,boolean ativo){public Tecnico{if(id<=0||nome==null||nome.isBlank())throw new IllegalArgumentException("Técnico inválido.");}}`;
const OS = `package br.com.curso.aula128.dominio.ordemservico;
import br.com.curso.aula128.dominio.tecnico.Tecnico;
public class OrdemServico {private final CodigoOs codigo;private PeriodoAtendimento periodo;private Tecnico tecnico;private StatusOs status=StatusOs.AGENDADA;private String motivo="";public OrdemServico(CodigoOs codigo,PeriodoAtendimento periodo){if(codigo==null||periodo==null)throw new IllegalArgumentException("OS inválida.");this.codigo=codigo;this.periodo=periodo;}public void reagendar(PeriodoAtendimento novo){if(encerrada()||novo==null)throw new IllegalStateException("Reagendamento inválido.");periodo=novo;status=StatusOs.REAGENDADA;}public void atribuirTecnico(Tecnico tecnico){if(tecnico==null||!tecnico.ativo())throw new IllegalStateException("Técnico inválido.");this.tecnico=tecnico;}public void concluir(){if(encerrada()||tecnico==null)throw new IllegalStateException("Conclusão inválida.");status=StatusOs.CONCLUIDA;}public void cancelar(String motivo){if(encerrada()||motivo==null||motivo.isBlank())throw new IllegalStateException("Cancelamento inválido.");status=StatusOs.CANCELADA;this.motivo=motivo;}public boolean encerrada(){return status==StatusOs.CONCLUIDA||status==StatusOs.CANCELADA;}public CodigoOs codigo(){return codigo;}public PeriodoAtendimento periodo(){return periodo;}public Tecnico tecnico(){return tecnico;}public StatusOs status(){return status;}public String resumo(){return codigo+" | "+periodo+" | técnico="+(tecnico==null?"não atribuído":tecnico.nome())+" | "+status+" | "+motivo;}}`;
const OS_MESSAGE = `package br.com.curso.aula128.dominio.ordemservico; public class MensagemOs {public String atualizacao(OrdemServico os){if(os==null)throw new IllegalArgumentException();return "OS "+os.codigo()+" está "+os.status()+" em "+os.periodo();}}`;
const OS_APP = `package br.com.curso.aula128.appos;
import br.com.curso.aula128.dominio.ordemservico.*;import br.com.curso.aula128.dominio.tecnico.Tecnico;import java.time.LocalDate;
public class OrdemServicoCoesaoApp {public static void main(String[]a){OrdemServico os=new OrdemServico(new CodigoOs("OS-128-001"),new PeriodoAtendimento(LocalDate.of(2026,7,20),TurnoAtendimento.MANHA));os.atribuirTecnico(new Tecnico(10,"Carlos",true));os.reagendar(new PeriodoAtendimento(LocalDate.of(2026,7,22),TurnoAtendimento.TARDE));System.out.println(os.resumo());System.out.println(new MensagemOs().atualizacao(os));}}`;
const OS_TEST = `package br.com.curso.aula128.appos;
import br.com.curso.aula128.dominio.ordemservico.*;import br.com.curso.aula128.dominio.tecnico.Tecnico;import java.time.LocalDate;
public class TesteCoesao128 {static int n;public static void main(String[]a){OrdemServico os=new OrdemServico(new CodigoOs("OS-1"),new PeriodoAtendimento(LocalDate.of(2026,7,20),TurnoAtendimento.MANHA));check(os.status()==StatusOs.AGENDADA);expect(()->os.atribuirTecnico(new Tecnico(2,"Inativo",false)));os.atribuirTecnico(new Tecnico(1,"Carlos",true));os.reagendar(new PeriodoAtendimento(LocalDate.of(2026,7,22),TurnoAtendimento.TARDE));check(os.status()==StatusOs.REAGENDADA);os.concluir();check(os.encerrada());expect(()->os.reagendar(new PeriodoAtendimento(LocalDate.now(),TurnoAtendimento.MANHA)));expect(()->new CodigoOs("X"));expect(()->new PeriodoAtendimento(null,TurnoAtendimento.MANHA));check(new MensagemOs().atualizacao(os).contains("CONCLUIDA"));System.out.println(n+" testes passaram");}static void check(boolean c){n++;if(!c)throw new AssertionError();}static void expect(Runnable r){try{r.run();throw new AssertionError();}catch(RuntimeException e){n++;}}}`;

const ORDER_FILES = [
  ["Email.java", EMAIL],
  ["Dinheiro.java", MONEY],
  ["Cliente.java", CLIENT],
  ["StatusPedido.java", ORDER_STATUS],
  ["Pedido.java", ORDER],
  ["MensagemPedido.java", MESSAGE_ORDER],
  ["PedidoCoesoApp.java", ORDER_APP],
];
const CONTRACT_FILES = [
  ["StatusContrato.java", CONTRACT_STATUS],
  ["PeriodoContrato.java", CONTRACT_PERIOD],
  ["ServicoContratado.java", SERVICE],
  ["Contrato.java", CONTRACT],
  ["ContratoCoesoApp.java", CONTRACT_APP],
];
const OS_FILES = [
  ["CodigoOs.java", OS_CODE],
  ["PeriodoAtendimento.java", OS_PERIOD],
  ["TurnoAtendimento.java", OS_SHIFT],
  ["StatusOs.java", OS_STATUS],
  ["Tecnico.java", TECHNICIAN],
  ["OrdemServico.java", OS],
  ["MensagemOs.java", OS_MESSAGE],
  ["OrdemServicoCoesaoApp.java", OS_APP],
  ["TesteCoesao128.java", OS_TEST],
];
const ERRORS = [
  [
    "Classe faz tudo",
    "Pedido concentra negócio, comunicação, tela e persistência.",
    "Separe por responsabilidades e motivos de mudança.",
  ],
  [
    "Utils genérica",
    "SistemaUtils vira destino de regras sem dono.",
    "Modele Email, Dinheiro, Período e políticas pelo significado.",
  ],
  [
    "Apresentação na entidade",
    "Pedido monta HTML, PDF ou texto de interface.",
    "Mantenha ciclo do pedido na entidade e apresentação fora.",
  ],
  [
    "Infraestrutura no domínio",
    "Contrato abre banco ou chama API externa.",
    "Domínio expressa regras; adaptadores lidam com tecnologia.",
  ],
  [
    "Divisão excessiva",
    "Uma alteração simples atravessa dez microclasses artificiais.",
    "Separe apenas quando clareza, teste, reuso ou evolução melhorarem.",
  ],
  [
    "Nome genérico",
    "Manager, Helper e Geral escondem o assunto real.",
    "Complete 'responsável por...' e nomeie pelo conceito.",
  ],
  [
    "Status em String",
    "Qualquer texto vira estado e espalha comparações.",
    "Use enum para vocabulário fechado.",
  ],
  [
    "Dinheiro em double",
    "Precisão e arredondamento ficam dispersos.",
    "Use BigDecimal encapsulado em Dinheiro.",
  ],
];
const EVIDENCE = `# Aula 128 — coesão em classes
- [ ] Expliquei alta e baixa coesão
- [ ] Diagnostiquei Pedido e Contrato que fazem demais
- [ ] Refatorei Email, Dinheiro, Cliente, Pedido e Mensagem
- [ ] Relacionei nomes, atributos, métodos, pacotes e motivos de mudança
- [ ] Diferenciei classe grande coesa de classe pequena dispersa
- [ ] Evitei Utils e divisão exagerada
- [ ] Entreguei Ordem de Serviço com responsabilidades claras
- [ ] Executei seis programas e oito testes`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="co128-copy"
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
    <section className="co128-code">
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
function CohesionMap() {
  const [mode, setMode] = useState("high");
  const high = [
    "número",
    "cliente",
    "total",
    "status",
    "confirmar",
    "cancelar",
    "pago?",
  ];
  const low = [
    "pedido",
    "email SMTP",
    "HTML",
    "Oracle",
    "token API",
    "Excel",
    "imposto global",
  ];
  return (
    <section className="co128-stack">
      <div className="co128-map">
        <header>
          <button
            type="button"
            className={mode === "high" ? "active" : ""}
            onClick={() => setMode("high")}
          >
            alta coesão
          </button>
          <button
            type="button"
            className={mode === "low" ? "active" : ""}
            onClick={() => setMode("low")}
          >
            baixa coesão
          </button>
        </header>
        <main className={mode}>
          {(mode === "high" ? high : low).map((x, i) => (
            <span key={x} style={{ "--i": i }}>
              {x}
            </span>
          ))}
          <Target />
          <b>
            {mode === "high"
              ? "ciclo do Pedido"
              : "assuntos sem um único centro"}
          </b>
        </main>
        <footer>
          <strong>
            {mode === "high"
              ? "Poucos motivos para mudar"
              : "Muitos motivos para mudar"}
          </strong>
          <span>
            {mode === "high"
              ? "Dados e comportamentos pertencem ao mesmo conceito."
              : "Cada necessidade empurra um assunto novo para a classe."}
          </span>
        </footer>
      </div>
    </section>
  );
}
function SizeMyth() {
  const [count, setCount] = useState(15);
  const cohesive = [
    "adicionarItem",
    "removerItem",
    "total",
    "quantidadeItens",
    "confirmarPagamento",
    "cancelar",
    "pago",
    "cancelado",
    "reabrir",
    "reservarEstoque",
    "liberarEstoque",
    "aplicarCupom",
    "removerCupom",
    "resumo",
    "status",
  ];
  const mixed = [
    "validarEmail",
    "calcularFrete",
    "salvarPedido",
    "enviarSms",
    "gerarToken",
  ];
  return (
    <section className="co128-stack">
      <div className="co128-size">
        <article>
          <b>Pedido · {count} métodos</b>
          <div>
            {cohesive.slice(0, count).map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCount((v) => (v === 15 ? 8 : 15))}
          >
            Alternar quantidade
          </button>
          <strong>COESA: todos giram em torno do pedido</strong>
        </article>
        <article className="mixed">
          <b>SistemaUtils · 5 métodos</b>
          <div>
            {mixed.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <strong>DISPERSA: cinco assuntos sem relação</strong>
        </article>
      </div>
      <p className="guided-note">
        <ShieldCheck size={18} />
        <span>
          Contagem de linhas ou métodos é pista, não sentença. Coesão mede
          pertencimento ao mesmo assunto.
        </span>
      </p>
    </section>
  );
}
function HotspotLab({ kind = "pedido" }) {
  const isPedido = kind === "pedido";
  const topics = isPedido
    ? [
        "pedido",
        "cliente",
        "e-mail",
        "dinheiro",
        "pagamento",
        "mensagem",
        "tela",
      ]
    : [
        "contrato",
        "cliente",
        "serviço",
        "dinheiro",
        "período",
        "meses",
        "mensagem",
        "status String",
      ];
  const [selected, setSelected] = useState(0);
  return (
    <section className="co128-stack">
      <div className="co128-hotspot">
        <nav>
          {topics.map((x, i) => (
            <button
              type="button"
              className={i === selected ? "active" : ""}
              onClick={() => setSelected(i)}
              key={x}
            >
              <span>{i + 1}</span>
              {x}
            </button>
          ))}
        </nav>
        <main>
          <Layers3 />
          <span>RESPONSABILIDADE {selected + 1}</span>
          <h3>{topics[selected]}</h3>
          <p>
            {selected === 0
              ? "Pertence ao ciclo da entidade."
              : "Tem regra, formato ou motivo de mudança próprio e merece ser questionada."}
          </p>
        </main>
      </div>
      <CodePanel
        name={
          isPedido ? "PedidoBaixaCoesaoApp.java" : "ContratoBaixaCoesaoApp.java"
        }
        code={isPedido ? BAD_PEDIDO : BAD_CONTRACT}
      />
    </section>
  );
}
function ResponsibilitySplit() {
  const [stage, setStage] = useState(0);
  const parts = [
    ["PedidoBaixaCoesao", "7 assuntos", "uma classe muda por tudo"],
    ["Email + Dinheiro", "valores próprios", "validam formato e precisão"],
    ["Cliente + Pedido", "entidades focadas", "cada ciclo fica no seu objeto"],
    [
      "MensagemPedido + App",
      "mensagem e montagem",
      "orquestração deixa a entidade",
    ],
  ];
  return (
    <section className="co128-stack">
      <div className="co128-split">
        {parts.map((x, i) => (
          <button
            type="button"
            className={i === stage ? "active" : i < stage ? "done" : ""}
            onClick={() => setStage(i)}
            key={x[0]}
          >
            <span>{i + 1}</span>
            <b>{x[0]}</b>
            <small>{x[1]}</small>
          </button>
        ))}
      </div>
      <div className="co128-verdict">
        <Split />
        <div>
          <span>REFATORAÇÃO {stage + 1} DE 4</span>
          <h3>{parts[stage][0]}</h3>
          <p>{parts[stage][2]}</p>
        </div>
      </div>
    </section>
  );
}
function Workspace({ files, title }) {
  const [active, setActive] = useState(0);
  return (
    <section className="co128-workspace">
      <header>
        <span>{title}</span>
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
function CohesionAudit() {
  const [selected, setSelected] = useState(0);
  const cases = [
    [
      "Frase de responsabilidade",
      "Pedido protege o ciclo de vida do pedido.",
      "Uma frase sem muitos 'e'.",
    ],
    ["Nome", "MensagemPedido", "Diz qual mensagem e de qual conceito."],
    [
      "Atributos",
      "PeriodoContrato: início + fim",
      "Campos formam um único valor.",
    ],
    [
      "Métodos",
      "confirmar, cancelar, pago?",
      "Operações giram sobre o mesmo estado.",
    ],
    [
      "Método private",
      "validarPodeCancelar",
      "Ainda pertence à operação da entidade.",
    ],
    ["Pacote", "dominio.pedido", "Contém vocabulário relacionado a pedido."],
  ];
  const c = cases[selected];
  return (
    <section className="co128-stack">
      <div className="co128-audit">
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
          <Focus />
          <span>LENTE DE COESÃO</span>
          <h3>{c[1]}</h3>
          <p>{c[2]}</p>
        </main>
      </div>
      <div className="co128-names">
        <b>Desconfie</b>
        {[
          "SistemaUtils",
          "PedidoManager",
          "GeralService",
          "Helper",
          "Coisas",
          "Operacoes",
        ].map((x) => (
          <code key={x}>{x}</code>
        ))}
      </div>
    </section>
  );
}
function BalanceLab() {
  const [pieces, setPieces] = useState(5);
  const states =
    pieces < 4
      ? ["gigante", "Poucas classes acumulam muitos motivos para mudar."]
      : pieces > 7
        ? ["fragmentado", "A regra vira uma peregrinação por microclasses."]
        : [
            "equilibrado",
            "Conceitos com significado ficam juntos; motivos distintos ficam separados.",
          ];
  return (
    <section className="co128-stack">
      <div className="co128-balance">
        <header>
          <span>1 classe gigante</span>
          <strong>{pieces} classes</strong>
          <span>10 microclasses</span>
        </header>
        <input
          type="range"
          min="1"
          max="10"
          value={pieces}
          onChange={(e) => setPieces(Number(e.target.value))}
        />
        <main className={states[0]}>
          <GitBranch />
          <h3>{states[0]}</h3>
          <p>{states[1]}</p>
        </main>
        <footer>
          {Array.from({ length: pieces }, (_, i) => (
            <span
              key={i}
              style={{ width: `${Math.max(30, 120 - pieces * 7)}px` }}
            >
              C{i + 1}
            </span>
          ))}
        </footer>
      </div>
      <p className="guided-note">
        <Target size={18} />
        <span>
          Pergunta correta: separar melhora clareza, reuso, teste ou manutenção?
          Se não, a divisão pode ser apenas ruído.
        </span>
      </p>
    </section>
  );
}
function DebugLab() {
  const [step, setStep] = useState(0);
  const frames = [
    ["PedidoBaixaCoesao", "confirmarPagamento", "negócio"],
    [
      "PedidoBaixaCoesao",
      "enviarEmailConfirmacao",
      "comunicação na mesma classe",
    ],
    ["PedidoBaixaCoesao", "gerarTextoParaTela", "apresentação na mesma classe"],
    ["Email", "new Email", "regra do valor no próprio objeto"],
    ["Pedido", "confirmarPagamento", "entidade protege seu ciclo"],
    [
      "MensagemPedido",
      "confirmacaoPagamento",
      "mensagem usa Pedido sem alterá-lo",
    ],
    ["PeriodoContrato", "quantidadeMeses", "cálculo pertence ao período"],
    ["Contrato", "valorTotal", "coordena objetos coesos"],
  ];
  const f = frames[step];
  return (
    <section className="co128-stack">
      <div className="co128-ide">
        <header>
          <span>IntelliJ IDEA · Debug</span>
          <div>
            <Search size={14} />
            Navigate to Class
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
              REGRA {step + 1} DE {frames.length}
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
  return (
    <section className="co128-errors">
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
    "Código próprio",
    "Período próprio",
    "Técnico focado",
    "OS coordena ciclo",
    "Mensagem não altera",
    "8 testes",
  ];
  return (
    <section className="co128-stack">
      <Workspace files={OS_FILES} title="ordem-servico-coesa/" />
      <div className="guided-console">
        <div className="guided-console-title">
          <Play size={15} />
          Terminal
        </div>
        <pre>{`> javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
> java -cp out br.com.curso.aula128.appos.OrdemServicoCoesaoApp
OS-128-001 | 2026-07-22 TARDE | técnico=Carlos | REAGENDADA
OS OS-128-001 está REAGENDADA em 2026-07-22 TARDE
> java -cp out br.com.curso.aula128.appos.TesteCoesao128
8 testes passaram
> git commit -m "Aula 128: pratica coesao em classes"`}</pre>
      </div>
      <div className="co128-checklist">
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
    label: "Mapa da Coesão",
    duration: "13 min",
    eyebrow: "UM CENTRO OU MUITOS ASSUNTOS",
    title:
      "Veja dados e comportamentos orbitarem — ou abandonarem — o conceito",
    blocks: [
      {
        type: "lead",
        text: "Coesão mede quanto os elementos de uma classe pertencem ao mesmo assunto e compartilham motivos de mudança.",
      },
      { type: "map" },
    ],
  },
  {
    id: "size",
    label: "Tamanho não Decide",
    duration: "12 min",
    eyebrow: "15 COESOS VERSUS 5 DISPERSOS",
    title: "Pare de medir design apenas pela quantidade de métodos",
    blocks: [
      {
        type: "lead",
        text: "Uma classe grande pode ser focada; uma classe pequena pode misturar cinco responsabilidades sem relação.",
      },
      { type: "size" },
    ],
  },
  {
    id: "bad-order",
    label: "Pedido que Faz Tudo",
    duration: "18 min",
    eyebrow: "SETE RESPONSABILIDADES",
    title: "Inspecione uma classe funcional que muda por motivos demais",
    blocks: [
      {
        type: "lead",
        text: "PedidoBaixaCoesao mistura pedido, cliente, e-mail, dinheiro, pagamento, mensagem e tela. Compilar não prova bom desenho.",
      },
      { type: "bad-order" },
    ],
  },
  {
    id: "split",
    label: "Refatoração Guiada",
    duration: "16 min",
    eyebrow: "MOTIVOS DE MUDANÇA",
    title: "Separe conceitos, não linhas de código",
    blocks: [
      {
        type: "lead",
        text: "Email, Dinheiro, Cliente, Pedido e Mensagem surgem porque carregam significado e regras próprias.",
      },
      { type: "split" },
    ],
  },
  {
    id: "good-order",
    label: "Pedido Coeso",
    duration: "23 min",
    eyebrow: "SETE FONTES COM FOCO",
    title: "Navegue pelo domínio e explique uma responsabilidade por classe",
    blocks: [
      {
        type: "lead",
        text: "A entidade protege o ciclo do pedido; valores protegem formato; mensagem apenas apresenta; App monta o cenário.",
      },
      { type: "good-order" },
    ],
  },
  {
    id: "audit",
    label: "Auditoria de Foco",
    duration: "16 min",
    eyebrow: "NOME, CAMPOS, MÉTODOS E PACOTE",
    title: "Use seis lentes para localizar responsabilidades escondidas",
    blocks: [
      {
        type: "lead",
        text: "Uma boa frase de responsabilidade, nomes específicos e estado relacionado tornam o foco verificável.",
      },
      { type: "audit" },
    ],
  },
  {
    id: "contracts",
    label: "Contrato Ruim → Coeso",
    duration: "25 min",
    eyebrow: "DOIS DESENHOS EXECUTÁVEIS",
    title: "Retire período, serviço e dinheiro sem esvaziar a entidade",
    blocks: [
      {
        type: "lead",
        text: "Contrato continua coordenando seu ciclo e valor total; colaboradores assumem regras que pertencem aos próprios conceitos.",
      },
      { type: "bad-contract" },
      { type: "good-contract" },
    ],
  },
  {
    id: "balance",
    label: "Evite Dividir Demais",
    duration: "15 min",
    eyebrow: "GIGANTE, EQUILÍBRIO E FRAGMENTAÇÃO",
    title: "Encontre o ponto onde separar melhora o entendimento",
    blocks: [
      {
        type: "lead",
        text: "Coesão não manda criar uma classe para cada linha. Separação precisa melhorar clareza, teste, reuso ou evolução.",
      },
      { type: "balance" },
    ],
  },
  {
    id: "debug",
    label: "IntelliJ e Debug",
    duration: "17 min",
    eyebrow: "ONDE CADA REGRA VIVE",
    title: "Compare oito paradas antes e depois da refatoração",
    blocks: [
      {
        type: "lead",
        text: "Na versão ruim, o debugger volta sempre à mesma classe; na coesa, cada objeto valida o que lhe pertence.",
      },
      { type: "debug" },
    ],
  },
  {
    id: "errors",
    label: "Clínica de Erros",
    duration: "16 min",
    eyebrow: "OITO DESVIOS DE MODELAGEM",
    title: "Diferencie classe Deus, Utils e fragmentação excessiva",
    blocks: [
      {
        type: "lead",
        text: "A clínica conecta sintomas a decisões: apresentação, infraestrutura, nomes, estado e precisão monetária.",
      },
      { type: "errors" },
    ],
  },
  {
    id: "delivery",
    label: "Entrega & OS",
    duration: "32 min",
    eyebrow: "NOVE FONTES E OITO TESTES",
    title:
      "Entregue uma Ordem de Serviço em que cada classe consegue dizer por que existe",
    blocks: [
      {
        type: "lead",
        text: "Código, período, técnico, ciclo e mensagem têm focos distintos; a OS coordena sem absorver todas as regras.",
      },
      { type: "delivery" },
    ],
  },
];
function Block({ block }) {
  if (block.type === "lead") return <p className="guided-lead">{block.text}</p>;
  const map = {
    map: CohesionMap,
    size: SizeMyth,
    "bad-order": () => <HotspotLab kind="pedido" />,
    split: ResponsibilitySplit,
    "good-order": () => <Workspace files={ORDER_FILES} title="pedido-coeso/" />,
    audit: CohesionAudit,
    "bad-contract": () => <HotspotLab kind="contrato" />,
    "good-contract": () => (
      <Workspace files={CONTRACT_FILES} title="contrato-coeso/" />
    ),
    balance: BalanceLab,
    debug: DebugLab,
    errors: ErrorsClinic,
    delivery: DeliveryLab,
  };
  const C = map[block.type];
  return C ? <C /> : null;
}
export default function GuidedClassCohesionLesson128({
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
    <article className="guided-git-lesson guided-class-cohesion-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker">
            <Focus size={17} />
            Laboratório de foco das classes
          </span>
          <p className="guided-sequence">128 · M4.24</p>
          <h1>Faça cada classe conseguir explicar claramente por que existe</h1>
          <p>
            Diagnostique classes que fazem tudo, refatore Pedido e Contrato,
            evite fragmentação e entregue uma Ordem de Serviço com
            responsabilidades verificáveis.
          </p>
        </div>
        <div className="guided-hero-status">
          <Target size={42} />
          <strong>
            {Math.round((completedSteps.size / steps.length) * 100)}%
          </strong>
          <span>
            {completedSteps.size} de {steps.length} etapas concluídas
          </span>
        </div>
      </header>
      <GuidedLessonFacts
        ariaLabel="Resumo da aula 128"
        items={[
          { value: "23 fontes", label: "Ruins e coesas" },
          { value: "6 execuções", label: "Comparações e testes" },
          { value: "8 casos", label: "Na clínica de erros" },
        ]}
      />
      <div className="guided-layout">
        <nav
          ref={navRef}
          className="guided-step-nav"
          aria-label="Roteiro prático da aula 128"
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
                <h3>Responsabilidades comprovadas</h3>
                <p>
                  {lessonComplete
                    ? "Aula concluída: avance para acoplamento entre classes."
                    : "Execute a OS e os oito testes antes de concluir."}
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
          Aula 127
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
            <small>foco, responsabilidades, refatoração, equilíbrio e OS</small>
          </span>
        </div>
        <button
          type="button"
          onClick={onNextLesson}
          disabled={!hasNextLesson || !lessonComplete}
        >
          Aula 129
          <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
