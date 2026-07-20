import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AlertTriangle, ArrowLeft, ArrowRight, Ban, Check, CheckCircle2, Clock3, Copy, FileCode2, Fingerprint, Gauge, Layers3, ListChecks, LockKeyhole, Play, RotateCcw, Search, ShieldCheck, StepForward, TestTube2 } from "lucide-react";
import GuidedLessonFacts from "./GuidedLessonFacts";
import "./guidedLesson.css";
import "./guidedObjectCollaborationLesson.css";
import "./guidedDomainInvariantsLesson.css";

const STORAGE_KEY="guided-domain-invariants-lesson-133-progress";

const BAD_ORDER=`package br.com.curso.aula133.exemplo.ruim;
import java.math.BigDecimal;
public class PedidoInvarianteQuebradaApp {
  public static void main(String[] args) {
    PedidoQuebrado pedido = new PedidoQuebrado();
    pedido.setNumero(0);
    pedido.setTotal(new BigDecimal("-150.00"));
    pedido.setStatus(null);
    System.out.println(pedido.resumo());
  }
}
class PedidoQuebrado {
  private int numero; private BigDecimal total; private String status;
  void setNumero(int valor){ numero=valor; }
  void setTotal(BigDecimal valor){ total=valor; }
  void setStatus(String valor){ status=valor; }
  String resumo(){ return "numero="+numero+" | total="+total+" | status="+status; }
}`;
const BAD_PRODUCT=`package br.com.curso.aula133.exemplo.ruim;
public class ProdutoEstoqueNegativoApp {
  public static void main(String[] args){
    ProdutoQuebrado produto=new ProdutoQuebrado(10);
    produto.setEstoque(-50);
    System.out.println("Estoque aceito: "+produto.estoque());
  }
}
class ProdutoQuebrado { private int estoque; ProdutoQuebrado(int e){estoque=e;} void setEstoque(int e){estoque=e;} int estoque(){return estoque;} }`;
const BAD_CONTRACT=`package br.com.curso.aula133.exemplo.ruim;
import java.time.LocalDate;
public class ContratoPeriodoInvalidoApp {
  public static void main(String[] args){
    LocalDate inicio=LocalDate.of(2026,12,31);
    LocalDate fim=LocalDate.of(2026,1,1);
    System.out.println("Contrato aceitou: "+inicio+" -> "+fim);
  }
}`;
const MONEY=`package br.com.curso.aula133.dominio.valor;
import java.math.BigDecimal; import java.math.RoundingMode;
public record Dinheiro(BigDecimal valor){
  public Dinheiro { if(valor==null) throw new IllegalArgumentException("Valor é obrigatório."); valor=valor.setScale(2,RoundingMode.HALF_UP); }
  public static Dinheiro de(String valor){ return new Dinheiro(new BigDecimal(valor)); }
  public boolean positivo(){ return valor.signum()>0; }
  public boolean maiorOuIgual(Dinheiro outro){ return outro!=null&&valor.compareTo(outro.valor)>=0; }
  @Override public String toString(){ return "R$ "+valor; }
}`;
const ORDER_STATUS=`package br.com.curso.aula133.dominio.pedido;
public enum StatusPedido { CRIADO, PAGO, CANCELADO }`;
const ORDER=`package br.com.curso.aula133.dominio.pedido;
import br.com.curso.aula133.dominio.valor.Dinheiro;
public class Pedido {
  private final int numero; private final Dinheiro total;
  private StatusPedido status=StatusPedido.CRIADO; private String motivo="";
  public Pedido(int numero,Dinheiro total){
    if(numero<=0) throw new IllegalArgumentException("Número deve ser positivo.");
    if(total==null||!total.positivo()) throw new IllegalArgumentException("Total deve ser positivo.");
    this.numero=numero; this.total=total;
  }
  public boolean criado(){return status==StatusPedido.CRIADO;} public boolean pago(){return status==StatusPedido.PAGO;} public boolean cancelado(){return status==StatusPedido.CANCELADO;}
  public void confirmarPagamento(Dinheiro valorPago){
    if(!criado()) throw new IllegalStateException("Somente pedido criado pode ser pago.");
    if(valorPago==null||!valorPago.maiorOuIgual(total)) throw new IllegalArgumentException("Pagamento insuficiente.");
    status=StatusPedido.PAGO;
  }
  public void cancelar(String motivo){
    if(motivo==null||motivo.isBlank()) throw new IllegalArgumentException("Motivo é obrigatório.");
    if(pago()||cancelado()) throw new IllegalStateException("Estado não permite cancelamento.");
    status=StatusPedido.CANCELADO; this.motivo=motivo;
  }
  public StatusPedido status(){return status;}
  public String resumo(){return "Pedido "+numero+" | "+total+" | "+status+" | "+motivo;}
}`;
const ORDER_APP=`package br.com.curso.aula133.app;
import br.com.curso.aula133.dominio.pedido.Pedido; import br.com.curso.aula133.dominio.valor.Dinheiro;
public class PedidoInvarianteApp {
  public static void main(String[] args){
    Pedido pedido=new Pedido(1001,Dinheiro.de("399.80"));
    pedido.confirmarPagamento(Dinheiro.de("399.80"));
    System.out.println(pedido.resumo());
  }
}`;
const PRODUCT=`package br.com.curso.aula133.dominio.produto;
import br.com.curso.aula133.dominio.valor.Dinheiro;
public class Produto {
  private final String codigo,nome; private final Dinheiro preco; private int estoque;
  public Produto(String codigo,String nome,Dinheiro preco,int estoqueInicial){
    if(codigo==null||!codigo.startsWith("PROD-")) throw new IllegalArgumentException("Código inválido.");
    if(nome==null||nome.isBlank()) throw new IllegalArgumentException("Nome obrigatório.");
    if(preco==null||!preco.positivo()) throw new IllegalArgumentException("Preço deve ser positivo.");
    if(estoqueInicial<0) throw new IllegalArgumentException("Estoque não pode ser negativo.");
    this.codigo=codigo;this.nome=nome;this.preco=preco;estoque=estoqueInicial;
  }
  public boolean disponivel(int quantidade){return quantidade>0&&estoque>=quantidade;}
  public void reservarEstoque(int quantidade){if(quantidade<=0)throw new IllegalArgumentException("Quantidade deve ser positiva.");if(!disponivel(quantidade))throw new IllegalStateException("Estoque insuficiente.");estoque-=quantidade;}
  public void reporEstoque(int quantidade){if(quantidade<=0)throw new IllegalArgumentException("Reposição deve ser positiva.");estoque+=quantidade;}
  public int estoque(){return estoque;} public String resumo(){return codigo+" - "+nome+" | "+preco+" | Estoque: "+estoque;}
}`;
const PRODUCT_APP=`package br.com.curso.aula133.app;
import br.com.curso.aula133.dominio.produto.Produto; import br.com.curso.aula133.dominio.valor.Dinheiro;
public class ProdutoInvarianteApp { public static void main(String[] args){Produto p=new Produto("PROD-001","Cadeira",Dinheiro.de("199.90"),10);p.reservarEstoque(3);p.reporEstoque(2);System.out.println(p.resumo());} }`;
const CONTRACT_PERIOD=`package br.com.curso.aula133.dominio.contrato;
import java.time.LocalDate; import java.time.temporal.ChronoUnit;
public record PeriodoContrato(LocalDate inicio,LocalDate fim){
  public PeriodoContrato {if(inicio==null||fim==null)throw new IllegalArgumentException("Datas obrigatórias.");if(fim.isBefore(inicio))throw new IllegalArgumentException("Fim não pode ser anterior ao início.");}
  public long quantidadeMeses(){return ChronoUnit.MONTHS.between(inicio,fim);}
}`;
const CONTRACT_STATUS=`package br.com.curso.aula133.dominio.contrato;
public enum StatusContrato { RASCUNHO, ATIVO, CANCELADO }`;
const CONTRACT=`package br.com.curso.aula133.dominio.contrato;
public class Contrato {
  private final String codigo; private final PeriodoContrato periodo; private StatusContrato status=StatusContrato.RASCUNHO; private String motivo="";
  public Contrato(String codigo,PeriodoContrato periodo){if(codigo==null||!codigo.startsWith("CONT-"))throw new IllegalArgumentException("Código inválido.");if(periodo==null)throw new IllegalArgumentException("Período obrigatório.");this.codigo=codigo;this.periodo=periodo;}
  public boolean rascunho(){return status==StatusContrato.RASCUNHO;} public boolean ativo(){return status==StatusContrato.ATIVO;} public boolean cancelado(){return status==StatusContrato.CANCELADO;}
  public void ativar(){if(!rascunho())throw new IllegalStateException("Somente rascunho pode ser ativado.");status=StatusContrato.ATIVO;}
  public void cancelar(String motivo){if(motivo==null||motivo.isBlank())throw new IllegalArgumentException("Motivo obrigatório.");if(cancelado())throw new IllegalStateException("Contrato já cancelado.");status=StatusContrato.CANCELADO;this.motivo=motivo;}
  public String resumo(){return "Contrato "+codigo+" | "+periodo+" | "+periodo.quantidadeMeses()+" meses | "+status+" | "+motivo;}
}`;
const CONTRACT_APP=`package br.com.curso.aula133.app;
import br.com.curso.aula133.dominio.contrato.*; import java.time.LocalDate;
public class ContratoInvarianteApp {public static void main(String[] args){Contrato c=new Contrato("CONT-001",new PeriodoContrato(LocalDate.of(2026,1,1),LocalDate.of(2026,12,31)));c.ativar();System.out.println(c.resumo());}}`;
const OS_CODE=`package br.com.curso.aula133.dominio.ordemservico;
public record CodigoOs(String valor){public CodigoOs{if(valor==null||!valor.startsWith("OS-"))throw new IllegalArgumentException("Código da OS inválido.");}@Override public String toString(){return valor;}}`;
const OS_SHIFT=`package br.com.curso.aula133.dominio.ordemservico;
public enum TurnoAtendimento { MANHA, TARDE }`;
const OS_STATUS=`package br.com.curso.aula133.dominio.ordemservico;
public enum StatusOs { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }`;
const OS_PERIOD=`package br.com.curso.aula133.dominio.ordemservico;
import java.time.LocalDate;
public record PeriodoAtendimento(LocalDate data,TurnoAtendimento turno){public PeriodoAtendimento{if(data==null||turno==null)throw new IllegalArgumentException("Data e turno obrigatórios.");}}`;
const OS=`package br.com.curso.aula133.dominio.ordemservico;
public class OrdemServico {
  private final CodigoOs codigo; private final String cliente; private PeriodoAtendimento periodo; private StatusOs status=StatusOs.AGENDADA; private int reagendamentos; private String motivo="";
  public OrdemServico(CodigoOs codigo,String cliente,PeriodoAtendimento periodo){if(codigo==null)throw new IllegalArgumentException("Código obrigatório.");if(cliente==null||cliente.isBlank())throw new IllegalArgumentException("Cliente obrigatório.");if(periodo==null)throw new IllegalArgumentException("Período obrigatório.");this.codigo=codigo;this.cliente=cliente;this.periodo=periodo;}
  public boolean encerrada(){return status==StatusOs.CONCLUIDA||status==StatusOs.CANCELADA;}
  public void reagendar(PeriodoAtendimento novo){if(encerrada())throw new IllegalStateException("OS encerrada não pode ser reagendada.");if(novo==null)throw new IllegalArgumentException("Novo período obrigatório.");if(periodo.equals(novo))throw new IllegalArgumentException("Novo período deve ser diferente.");periodo=novo;status=StatusOs.REAGENDADA;reagendamentos++;}
  public void concluir(){if(status==StatusOs.CANCELADA)throw new IllegalStateException("OS cancelada não pode ser concluída.");status=StatusOs.CONCLUIDA;}
  public void cancelar(String motivo){if(motivo==null||motivo.isBlank())throw new IllegalArgumentException("Motivo obrigatório.");if(status==StatusOs.CONCLUIDA||status==StatusOs.CANCELADA)throw new IllegalStateException("OS encerrada não pode ser cancelada.");status=StatusOs.CANCELADA;this.motivo=motivo;}
  public StatusOs status(){return status;} public int reagendamentos(){return reagendamentos;} public String resumo(){return "OS "+codigo+" | "+cliente+" | "+periodo+" | "+status+" | Reagendamentos: "+reagendamentos+" | "+motivo;}
}`;
const OS_APP=`package br.com.curso.aula133.app;
import br.com.curso.aula133.dominio.ordemservico.*; import java.time.LocalDate;
public class OrdemServicoInvarianteApp {public static void main(String[] args){OrdemServico os=new OrdemServico(new CodigoOs("OS-2026-0001"),"Ana Silva",new PeriodoAtendimento(LocalDate.of(2026,7,20),TurnoAtendimento.MANHA));os.reagendar(new PeriodoAtendimento(LocalDate.of(2026,7,22),TurnoAtendimento.TARDE));os.concluir();System.out.println(os.resumo());}}`;
const PAY_CODE=`package br.com.curso.aula133.dominio.pagamento;
public record CodigoPagamento(String valor){public CodigoPagamento{if(valor==null||!valor.startsWith("PAG-"))throw new IllegalArgumentException("Código deve iniciar com PAG-.");}@Override public String toString(){return valor;}}`;
const PAY_STATUS=`package br.com.curso.aula133.dominio.pagamento;
public enum StatusPagamento { PENDENTE, CONFIRMADO, ESTORNADO }`;
const PAYMENT=`package br.com.curso.aula133.dominio.pagamento;
import br.com.curso.aula133.dominio.valor.Dinheiro;
public class Pagamento {
  private final CodigoPagamento codigo; private final Dinheiro valor; private StatusPagamento status=StatusPagamento.PENDENTE; private String motivo="";
  public Pagamento(CodigoPagamento codigo,Dinheiro valor){if(codigo==null)throw new IllegalArgumentException("Código obrigatório.");if(valor==null||!valor.positivo())throw new IllegalArgumentException("Valor deve ser positivo.");this.codigo=codigo;this.valor=valor;}
  public boolean pendente(){return status==StatusPagamento.PENDENTE;} public boolean confirmado(){return status==StatusPagamento.CONFIRMADO;} public boolean estornado(){return status==StatusPagamento.ESTORNADO;}
  public void confirmar(){if(!pendente())throw new IllegalStateException("Somente pagamento pendente pode confirmar.");status=StatusPagamento.CONFIRMADO;}
  public void estornar(String motivo){if(!confirmado())throw new IllegalStateException("Somente pagamento confirmado pode estornar.");if(motivo==null||motivo.isBlank())throw new IllegalArgumentException("Motivo obrigatório.");status=StatusPagamento.ESTORNADO;this.motivo=motivo;}
  public StatusPagamento status(){return status;} public String resumo(){return codigo+" | "+valor+" | "+status+" | "+motivo;}
}`;
const PAYMENT_APP=`package br.com.curso.aula133.apppagamento;
import br.com.curso.aula133.dominio.pagamento.*; import br.com.curso.aula133.dominio.valor.Dinheiro;
public class PagamentoInvarianteApp {public static void main(String[] args){Pagamento p=new Pagamento(new CodigoPagamento("PAG-133"),Dinheiro.de("850"));p.confirmar();p.estornar("Cobrança duplicada");System.out.println(p.resumo());}}`;
const TESTS=`package br.com.curso.aula133.apppagamento;
import br.com.curso.aula133.dominio.contrato.*; import br.com.curso.aula133.dominio.ordemservico.*; import br.com.curso.aula133.dominio.pagamento.*; import br.com.curso.aula133.dominio.pedido.*; import br.com.curso.aula133.dominio.produto.*; import br.com.curso.aula133.dominio.valor.Dinheiro; import java.time.LocalDate;
public class TesteInvariantes133 {
  static int testes;
  public static void main(String[] args){
    expect(IllegalArgumentException.class,()->new Pedido(0,Dinheiro.de("10"))); Pedido pedido=new Pedido(1,Dinheiro.de("100")); expect(IllegalArgumentException.class,()->pedido.confirmarPagamento(Dinheiro.de("99"))); check(pedido.criado()); pedido.confirmarPagamento(Dinheiro.de("100")); expect(IllegalStateException.class,()->pedido.cancelar("tarde"));
    Produto produto=new Produto("PROD-1","Teclado",Dinheiro.de("50"),2); expect(IllegalStateException.class,()->produto.reservarEstoque(3)); check(produto.estoque()==2);
    expect(IllegalArgumentException.class,()->new PeriodoContrato(LocalDate.of(2026,2,1),LocalDate.of(2026,1,1)));
    OrdemServico os=new OrdemServico(new CodigoOs("OS-1"),"Ana",new PeriodoAtendimento(LocalDate.of(2026,7,20),TurnoAtendimento.MANHA)); os.concluir(); expect(IllegalStateException.class,()->os.reagendar(new PeriodoAtendimento(LocalDate.of(2026,7,21),TurnoAtendimento.TARDE)));
    expect(IllegalArgumentException.class,()->new CodigoPagamento("X-1")); Pagamento pg=new Pagamento(new CodigoPagamento("PAG-1"),Dinheiro.de("100")); expect(IllegalStateException.class,()->pg.estornar("antes")); pg.confirmar(); expect(IllegalArgumentException.class,()->pg.estornar(" ")); pg.estornar("duplicado"); check(pg.estornado());
    System.out.println(testes+" testes passaram");
  }
  static void check(boolean condicao){testes++;if(!condicao)throw new AssertionError();}
  static void expect(Class<? extends RuntimeException> tipo,Runnable acao){try{acao.run();throw new AssertionError("Exceção esperada");}catch(RuntimeException erro){if(!tipo.isInstance(erro))throw erro;testes++;}}
}`;

const BAD_FILES=[["PedidoInvarianteQuebradaApp.java",BAD_ORDER],["ProdutoEstoqueNegativoApp.java",BAD_PRODUCT],["ContratoPeriodoInvalidoApp.java",BAD_CONTRACT]];
const ORDER_FILES=[["Dinheiro.java",MONEY],["StatusPedido.java",ORDER_STATUS],["Pedido.java",ORDER],["PedidoInvarianteApp.java",ORDER_APP]];
const PRODUCT_FILES=[["Produto.java",PRODUCT],["ProdutoInvarianteApp.java",PRODUCT_APP]];
const CONTRACT_FILES=[["PeriodoContrato.java",CONTRACT_PERIOD],["StatusContrato.java",CONTRACT_STATUS],["Contrato.java",CONTRACT],["ContratoInvarianteApp.java",CONTRACT_APP]];
const OS_FILES=[["CodigoOs.java",OS_CODE],["TurnoAtendimento.java",OS_SHIFT],["StatusOs.java",OS_STATUS],["PeriodoAtendimento.java",OS_PERIOD],["OrdemServico.java",OS],["OrdemServicoInvarianteApp.java",OS_APP]];
const PAYMENT_FILES=[["CodigoPagamento.java",PAY_CODE],["StatusPagamento.java",PAY_STATUS],["Pagamento.java",PAYMENT],["PagamentoInvarianteApp.java",PAYMENT_APP],["TesteInvariantes133.java",TESTS]];
const ERRORS=[["Validar só no App","Outro chamador atravessa a regra e entrega valores impossíveis.","A última barreira da condição essencial deve estar no objeto."],["Validar só no construtor","O objeto nasce válido, mas um método o corrompe depois.","Audite toda operação pública que modifica estado."],["Setter genérico","Uma parte do estado muda sem realizar a operação completa.","Exponha reservar, cancelar, reagendar e confirmar."],["Status como String","Grafias livres criam estados que o domínio não reconhece.","Feche o vocabulário com enum."],["Valor espalhado","Código, dinheiro e período são revalidados em muitos lugares.","Concentre a regra em um value object."],["Tela virou autoridade","A regra desaparece em jobs, testes ou outra interface.","Tela valida experiência; domínio protege consistência."],["Contador público","O chamador altera o número sem realizar o evento correspondente.","Atualize o contador dentro da operação de domínio."],["Combinação impossível","Cancelado sem motivo, fim antes do início ou estoque negativo.","Modele a combinação e rejeite a transição antes de gravar."]];
const EVIDENCE=`# Aula 133 — invariantes de domínio
- [ ] Provei nascimento válido e mutações seguras
- [ ] Diferenciei validação de entrada de invariante
- [ ] Executei os três exemplos quebrados
- [ ] Protegi Pedido, Produto, Contrato e OrdemServico
- [ ] Usei argumento inválido versus estado incompatível
- [ ] Fechei vocabulários com enum e value objects
- [ ] Entreguei Pagamento sem setters genéricos
- [ ] Tentei doze violações e confirmei estado preservado`;

function CopyButton({value}){const[copied,setCopied]=useState(false);return <button type="button" className="oc130-copy" onClick={async()=>{await navigator.clipboard?.writeText(value);setCopied(true);setTimeout(()=>setCopied(false),1200)}}><Copy size={14}/>{copied?"Copiado":"Copiar"}</button>}
function CodePanel({name,code}){return <section className="oc130-code"><header><span><FileCode2 size={15}/>{name}</span><CopyButton value={code}/></header><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers customStyle={{margin:0,padding:"18px",background:"#0b1326"}}>{code}</SyntaxHighlighter></section>}
function Workspace({files,title}){const[active,setActive]=useState(0);return <section className="oc130-workspace"><header><span>{title}</span><small>{files.length} fontes</small></header><div><nav>{files.map((file,index)=><button type="button" className={index===active?"active":""} onClick={()=>setActive(index)} key={file[0]}><FileCode2 size={14}/><span>{file[0]}</span></button>)}</nav><CodePanel name={files[active][0]} code={files[active][1]}/></div></section>}
function InvariantTimeline(){const[attempt,setAttempt]=useState(0);const cases=[["Pedido","CRIADO · total R$ 399,80","confirmarPagamento(399,80)","PAGO · total preservado",true],["Produto","estoque = 10","reservarEstoque(12)","estoque = 10 · tentativa rejeitada",false],["Contrato","RASCUNHO · período válido","cancelar(\"\")","RASCUNHO · sem motivo fantasma",false]],item=cases[attempt];return <section className="di133-stack"><div className="di133-timeline"><nav>{cases.map((x,i)=><button type="button" className={i===attempt?"active":""} onClick={()=>setAttempt(i)} key={x[0]}>{x[0]}</button>)}</nav><main><div><span>ANTES</span><strong>{item[1]}</strong></div><ArrowRight/><div className="attempt"><span>TENTATIVA</span><code>{item[2]}</code></div><ArrowRight/><div className={item[4]?"allowed":"blocked"}><span>{item[4]?"ACEITA":"BLOQUEIA"}</span><strong>{item[3]}</strong></div></main></div><p className="guided-note"><ShieldCheck size={18}/><span><b>Invariante:</b> condição verdadeira no nascimento e depois de toda operação pública — inclusive quando a operação falha.</span></p></section>}
function ValidationClassifier(){const rows=[["E-mail da tela está vazio","Validação de entrada","A interface pode orientar antes do envio."],["Código da OS não começa com OS-","Invariante","Nenhuma interface pode criar esse código."],["Fim do contrato vem antes do início","Invariante","A combinação de datas não representa um período válido."],["CEP tem máscara visual incorreta","Validação de apresentação","É uma preocupação do canal de entrada."],["Estoque ficaria negativo","Invariante","A operação deve ser recusada pelo Produto."]];const[selected,setSelected]=useState(0),row=rows[selected];return <section className="di133-classifier"><nav>{rows.map((x,i)=><button type="button" className={i===selected?"active":""} onClick={()=>setSelected(i)} key={x[0]}>{x[0]}</button>)}</nav><main><Layers3/><span>CLASSIFICAÇÃO</span><h3>{row[1]}</h3><p>{row[2]}</p><div><b>Pergunta decisiva</b><span>Se outro App, job ou teste chamar o objeto diretamente, esta regra ainda precisa valer?</span></div></main></section>}
function BirthLab(){const[mode,setMode]=useState("broken");return <section className="di133-stack"><div className="di133-birth"><header><button type="button" className={mode==="broken"?"active danger":""} onClick={()=>setMode("broken")}>Nascimento quebrado</button><button type="button" className={mode==="guarded"?"active":""} onClick={()=>setMode("guarded")}>Construtor guardião</button></header><main><div><Fingerprint/><span>OBJETO RECÉM-CRIADO</span><h3>{mode==="broken"?"numero=0 · total=-150 · status=null":"numero=1001 · total=399,80 · status=CRIADO"}</h3><strong>{mode==="broken"?"Compilou, mas nunca deveria existir":"Toda instância já satisfaz as regras mínimas"}</strong></div><div className={mode==="broken"?"door open":"door closed"}>{mode==="broken"?<Ban/>:<LockKeyhole/>}<b>{mode==="broken"?"SETTERS ABERTOS":"CONSTRUTOR PROTEGIDO"}</b></div></main></div>{mode==="broken"?<Workspace files={BAD_FILES} title="estados-impossiveis/"/>:<Workspace files={ORDER_FILES} title="pedido-protegido/"/>}</section>}
function OrderMutationLab(){const[scenario,setScenario]=useState(0);const rows=[["Pagar o total","CRIADO","confirmarPagamento(399,80)","PAGO","aceita"],["Pagar menos","CRIADO","confirmarPagamento(100,00)","CRIADO","IllegalArgumentException"],["Cancelar pago","PAGO","cancelar(\"desisti\")","PAGO","IllegalStateException"],["Cancelar sem motivo","CRIADO","cancelar(\"\")","CRIADO","IllegalArgumentException"]],r=rows[scenario];return <section className="di133-stack"><div className="di133-mutation"><nav>{rows.map((x,i)=><button type="button" className={i===scenario?"active":""} onClick={()=>setScenario(i)} key={x[0]}>{x[0]}</button>)}</nav><main><div><span>ESTADO ANTES</span><strong>{r[1]}</strong></div><code>{r[2]}</code><div className={r[4]==="aceita"?"pass":"reject"}><span>{r[4]}</span><strong>{r[3]}</strong><small>{r[4]==="aceita"?"mudança completa":"estado original preservado"}</small></div></main></div><div className="guided-console"><div className="guided-console-title"><Play size={15}/>Saída real do caminho feliz</div><pre>{`> java -cp out br.com.curso.aula133.app.PedidoInvarianteApp\nPedido 1001 | R$ 399.80 | PAGO |`}</pre></div></section>}
function ProductStockLab(){const[stock,setStock]=useState(10);const[message,setMessage]=useState("Produto nasceu com 10 unidades.");const act=(kind,quantity)=>{if(quantity<=0){setMessage("IllegalArgumentException · quantidade precisa ser positiva");return}if(kind==="reserve"&&quantity>stock){setMessage(`IllegalStateException · faltam ${quantity-stock} unidades; estoque continua ${stock}`);return}setStock(value=>kind==="reserve"?value-quantity:value+quantity);setMessage(kind==="reserve"?`Reserva de ${quantity} concluída.`:`Reposição de ${quantity} concluída.`)};return <section className="di133-stack"><div className="di133-stock"><div><Gauge/><span>ESTOQUE PROTEGIDO</span><strong>{stock}</strong><small>nunca negativo</small></div><main><button type="button" onClick={()=>act("reserve",3)}>reservar 3</button><button type="button" onClick={()=>act("reserve",12)}>reservar 12</button><button type="button" onClick={()=>act("reserve",-1)}>reservar -1</button><button type="button" onClick={()=>act("restock",5)}>repor 5</button><button type="button" className="reset" onClick={()=>{setStock(10);setMessage("Estado reiniciado.")}}>reiniciar</button><p>{message}</p></main></div><Workspace files={PRODUCT_FILES} title="produto-com-invariantes/"/></section>}
function ContractLab(){const[scenario,setScenario]=useState(0);const rows=[["Período inválido","31/12/2026","01/01/2026","bloqueado no value object"],["Ativar rascunho","RASCUNHO","ATIVO","transição aceita"],["Ativar ativo","ATIVO","ATIVO","IllegalStateException"],["Cancelar sem motivo","ATIVO","ATIVO","argumento recusado"],["Cancelar ativo","ATIVO","CANCELADO","motivo preservado"]],r=rows[scenario];return <section className="di133-stack"><div className="di133-contract"><nav>{rows.map((x,i)=><button type="button" className={i===scenario?"active":""} onClick={()=>setScenario(i)} key={x[0]}>{x[0]}</button>)}</nav><main><div><span>ANTES</span><strong>{r[1]}</strong></div><ArrowRight/><div><span>DEPOIS</span><strong>{r[2]}</strong></div><p>{r[3]}</p></main></div><Workspace files={CONTRACT_FILES} title="contrato-e-periodo/"/></section>}
function OsLab(){const[focus,setFocus]=useState(0);const rules=[["CodigoOs","OS- é obrigatório","value object"],["PeriodoAtendimento","data + turno existem juntos","value object"],["reagendar","não encerrada + período novo","método"],["contador","incrementa só ao reagendar","encapsulado"],["concluir","cancelada não conclui","estado"],["cancelar","motivo + não encerrada","operação"]],rule=rules[focus];return <section className="di133-stack"><div className="di133-os"><nav>{rules.map((x,i)=><button type="button" className={i===focus?"active":""} onClick={()=>setFocus(i)} key={x[0]}>{i+1}. {x[0]}</button>)}</nav><main><ShieldCheck/><span>BARREIRA {focus+1}/6</span><h3>{rule[0]}</h3><code>{rule[1]}</code><p>{rule[2]} impede que uma parte isolada deixe a OS impossível.</p><div><span>AGENDADA</span><ArrowRight/><span>REAGENDADA</span><ArrowRight/><span>CONCLUÍDA</span></div></main></div><Workspace files={OS_FILES} title="ordem-servico-protegida/"/></section>}
function DiscoveryLab(){const questions=["Este objeto pode existir sem este dado?","Este número pode ser negativo?","Este texto pode ser vazio?","O status aceita qualquer palavra?","Qual é o estado inicial correto?","Quais transições são proibidas?","O que nunca pode acontecer?","Qual combinação de campos é impossível?","O que deve continuar verdadeiro após qualquer método?"];const[active,setActive]=useState(0);const answers=[["Pedido","número e total são essenciais"],["Produto","preço e estoque não podem ser negativos"],["Contrato","cancelado exige motivo"],["OrdemServico","encerrada não reagenda"]];return <section className="di133-stack"><div className="di133-discovery"><nav>{questions.map((question,i)=><button type="button" className={i===active?"active":""} onClick={()=>setActive(i)} key={question}><span>{i+1}</span>{question}</button>)}</nav><main><Search/><span>ENTREVISTA DO DOMÍNIO</span><h3>{questions[active]}</h3><p>Escreva a resposta como uma frase que possa ser provada antes e depois de uma operação.</p>{answers.map(x=><div key={x[0]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</main></div><div className="di133-shields"><div><b>Interface / App</b><span>antecipa mensagem e fluxo</span></div><ArrowRight/><div><b>Entidade</b><span>última barreira da regra</span></div><ArrowRight/><div><b>Exceção</b><span>argumento ou estado</span></div></div><p className="guided-note"><LockKeyhole size={18}/><span><b>Tipos trabalham juntos:</b> enum fecha estados, value object fecha valores e o método de domínio fecha transições.</span></p></section>}
function DebugLab(){const frames=[["PedidoQuebrado","setNumero(0)","numero","0","nenhuma barreira"],["PedidoQuebrado","setTotal(-150)","total","-150.00","objeto corrompido"],["Pedido","new Pedido(0, total)","status","não criado","IllegalArgumentException"],["Pedido","confirmarPagamento(100)","status","CRIADO","pagamento insuficiente"],["Pedido","confirmarPagamento(399.80)","status","PAGO","transição aceita"],["Produto","reservarEstoque(12)","estoque","10","IllegalStateException"],["Produto","reservarEstoque(3)","estoque","7","saldo preservado"],["PeriodoContrato","new Periodo(fim,início)","instância","não criada","datas recusadas"],["Contrato","cancelar(\"\")","status","ATIVO","motivo obrigatório"],["OrdemServico","reagendar(mesmo)","reagendamentos","0","período deve mudar"],["OrdemServico","reagendar(novo)","reagendamentos","1","efeitos atômicos"],["Pagamento","estornar antes de confirmar","status","PENDENTE","estado preservado"]];const[step,setStep]=useState(0),frame=frames[step];return <section className="oc130-ide"><header><span>IntelliJ IDEA · Invariant Debug</span><div><Search size={14}/>Variables</div></header><section><aside>{frames.map((x,i)=><button type="button" className={i===step?"active":""} onClick={()=>setStep(i)} key={x[1]+i}><span>{i+1}</span>{x[0]}</button>)}</aside><main><div><button type="button" disabled={step===0} onClick={()=>setStep(value=>value-1)}><ArrowLeft size={14}/>Voltar</button><button type="button" disabled={step===frames.length-1} onClick={()=>setStep(value=>value+1)}><StepForward size={14}/>Step Into</button></div><span>PARADA {step+1} DE {frames.length}</span><h3>{frame[0]}</h3><code>{frame[1]}</code><dl><div><dt>{frame[2]}</dt><dd>{frame[3]}</dd></div><div><dt>resultado</dt><dd>{frame[4]}</dd></div></dl><footer><b>Observe:</b> a linha que impede a escrita e confirme que os campos anteriores não mudaram.</footer></main></section></section>}
function ErrorsClinic(){const[selected,setSelected]=useState(0),error=ERRORS[selected];return <section className="oc130-errors"><nav>{ERRORS.map((item,index)=><button type="button" className={index===selected?"active":""} onClick={()=>setSelected(index)} key={item[0]}><span>{index+1}</span><span className="guided-error-label">{item[0]}</span></button>)}</nav><main><span><AlertTriangle size={16}/>CASO {selected+1} DE 8</span><h3>{error[0]}</h3><section><div><b>Sintoma</b><p>{error[1]}</p></div><ArrowRight/><div><b>Como corrigir</b><p>{error[2]}</p></div></section></main></section>}
function DeliveryLab(){const transitions=[["PENDENTE","confirmar()","CONFIRMADO","permitida"],["PENDENTE","estornar(motivo)","PENDENTE","bloqueada"],["CONFIRMADO","estornar(motivo)","ESTORNADO","permitida"],["ESTORNADO","confirmar()","ESTORNADO","bloqueada"]];const[selected,setSelected]=useState(0),row=transitions[selected];const tasks=["código PAG-","valor positivo","nasce PENDENTE","confirma uma vez","estorna com motivo","sem setters","12 testes"];const[checked,setChecked]=useState(()=>new Set());return <section className="di133-stack"><div className="di133-payment"><nav>{transitions.map((x,i)=><button type="button" className={i===selected?"active":""} onClick={()=>setSelected(i)} key={x.join()}>{x[0]} → {x[2]}</button>)}</nav><main><span className="state">{row[0]}</span><code>{row[1]}</code><span className={row[3]}>{row[2]}</span><strong>{row[3]}</strong></main></div><Workspace files={PAYMENT_FILES} title="desafio-pagamento/"/><div className="guided-console"><div className="guided-console-title"><TestTube2 size={15}/>Compilação e bateria de violações</div><pre>{`> javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName\n> java -cp out br.com.curso.aula133.apppagamento.PagamentoInvarianteApp\nPAG-133 | R$ 850.00 | ESTORNADO | Cobrança duplicada\n> java -cp out br.com.curso.aula133.apppagamento.TesteInvariantes133\n12 testes passaram\n> git commit -m "Aula 133: pratica invariantes de dominio"`}</pre></div><div className="oc130-checklist">{tasks.map((task,index)=><button type="button" className={checked.has(index)?"done":""} onClick={()=>setChecked(current=>{const next=new Set(current);if(next.has(index))next.delete(index);else next.add(index);return next})} key={task}><span>{checked.has(index)?<Check size={14}/>:index+1}</span>{task}</button>)}</div><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16}/>README.md · evidências<CopyButton value={EVIDENCE}/></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} customStyle={{margin:0,padding:"18px",background:"#0b1326"}}>{EVIDENCE}</SyntaxHighlighter></section></section>}

const steps=[
 {id:"map",label:"Regra que Sobrevive",duration:"14 min",eyebrow:"ANTES, TENTATIVA E DEPOIS",title:"Enxergue a invariante ao longo de toda a vida do objeto",blocks:[{type:"lead",text:"Não basta um estado parecer correto agora: ele precisa nascer válido e continuar válido depois de toda operação pública."},{type:"timeline"}]},
 {id:"classifier",label:"Validação ou Invariante",duration:"14 min",eyebrow:"FRONTEIRA DA REGRA",title:"Separe conveniência da interface de consistência do domínio",blocks:[{type:"lead",text:"A interface pode antecipar um erro; a regra essencial continua no objeto para sobreviver a qualquer chamador."},{type:"classifier"}]},
 {id:"birth",label:"Nascimento Protegido",duration:"23 min",eyebrow:"CONSTRUTOR COMO PRIMEIRA BARREIRA",title:"Compare objetos montados por setters com instâncias que já nascem válidas",blocks:[{type:"lead",text:"Número zero, total negativo e status nulo não são estados intermediários: são objetos que nunca deveriam existir."},{type:"birth"}]},
 {id:"order",label:"Pedido em Movimento",duration:"22 min",eyebrow:"MÉTODOS PRESERVAM REGRAS",title:"Teste pagamento e cancelamento sem perder o estado anterior",blocks:[{type:"lead",text:"Uma tentativa recusada precisa terminar com exceção e com o Pedido exatamente como estava antes."},{type:"order"}]},
 {id:"product",label:"Estoque Nunca Negativo",duration:"20 min",eyebrow:"PRODUTO GUARDA O SALDO",title:"Reserve e reponha por operações que não aceitam quantidade impossível",blocks:[{type:"lead",text:"O App pode consultar disponibilidade, mas reservarEstoque repete a proteção porque é a última barreira."},{type:"product"}]},
 {id:"contract",label:"Período e Contrato",duration:"22 min",eyebrow:"COMBINAÇÕES E CICLO",title:"Proteja datas juntas e transições com intenção",blocks:[{type:"lead",text:"PeriodoContrato impede uma combinação inválida; Contrato impede ativação e cancelamento incompatíveis."},{type:"contract"}]},
 {id:"os",label:"OS em Estado Consistente",duration:"25 min",eyebrow:"VALUE OBJECT, ENUM E OPERAÇÃO",title:"Faça reagendamento, contador e status mudarem como uma unidade",blocks:[{type:"lead",text:"Nenhum setter isolado pode criar uma OS concluída com novo período ou alterar o contador sem reagendar."},{type:"os"}]},
 {id:"discovery",label:"Descobrir e Posicionar",duration:"18 min",eyebrow:"NOVE PERGUNTAS DE DOMÍNIO",title:"Transforme frases de negócio em barreiras verificáveis",blocks:[{type:"lead",text:"Pergunte o que nunca pode acontecer, escolha o dono natural e diferencie argumento inválido de estado incompatível."},{type:"discovery"}]},
 {id:"debug",label:"IntelliJ e Debug",duration:"20 min",eyebrow:"DOZE PARADAS COM EVIDÊNCIA",title:"Observe exatamente onde a tentativa é bloqueada",blocks:[{type:"lead",text:"Acompanhe Variables e exceções para provar que uma operação inválida não chegou a escrever o novo estado."},{type:"debug"}]},
 {id:"errors",label:"Clínica de Erros",duration:"16 min",eyebrow:"OITO FORMAS DE QUEBRAR A REGRA",title:"Corrija validação externa, setters, Strings e combinações impossíveis",blocks:[{type:"lead",text:"Cada diagnóstico liga um sintoma visível à barreira que falta no modelo."},{type:"errors"}]},
 {id:"delivery",label:"Entrega & Pagamento",duration:"32 min",eyebrow:"DESAFIO SOB ATAQUE",title:"Entregue Pagamento que continua válido até quando tentam quebrá-lo",blocks:[{type:"lead",text:"O caminho feliz não encerra o exercício: confirme as transições proibidas, o tipo da exceção e o estado preservado."},{type:"delivery"}]},
];
function Block({block}){if(block.type==="lead")return <p className="guided-lead">{block.text}</p>;const map={timeline:InvariantTimeline,classifier:ValidationClassifier,birth:BirthLab,order:OrderMutationLab,product:ProductStockLab,contract:ContractLab,os:OsLab,discovery:DiscoveryLab,debug:DebugLab,errors:ErrorsClinic,delivery:DeliveryLab};const Component=map[block.type];return Component?<Component/>:null}
export default function GuidedDomainInvariantsLesson133({isCompleted,onToggleCompleted,onNextLesson,onPrevLesson,hasNextLesson,hasPrevLesson}){const[activeIndex,setActiveIndex]=useState(0);const navRef=useRef(null),normalized=useRef(false);const[completedSteps,setCompletedSteps]=useState(()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]"),ids=new Set(steps.map(step=>step.id));return new Set(Array.isArray(saved)?saved.filter(id=>ids.has(id)):[])}catch{return new Set()}});useEffect(()=>localStorage.setItem(STORAGE_KEY,JSON.stringify([...completedSteps])),[completedSteps]);useEffect(()=>{if(!normalized.current&&isCompleted&&completedSteps.size!==steps.length){normalized.current=true;onToggleCompleted()}},[completedSteps.size,isCompleted,onToggleCompleted]);useEffect(()=>{const active=navRef.current?.querySelector("button.active");if(active&&window.matchMedia("(max-width: 900px)").matches)active.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},[activeIndex]);const step=steps[activeIndex],done=completedSteps.has(step.id),allDone=completedSteps.size===steps.length,lessonComplete=isCompleted&&allDone;const select=index=>{setActiveIndex(index);document.querySelector(".guided-layout")?.scrollIntoView({behavior:"smooth",block:"start"})};const toggle=()=>{if(done&&isCompleted)onToggleCompleted();setCompletedSteps(current=>{const next=new Set(current);if(next.has(step.id))next.delete(step.id);else next.add(step.id);return next})};return <article className="guided-git-lesson guided-domain-invariants-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><ShieldCheck size={17}/>Laboratório de consistência Java</span><p className="guided-sequence">133 · M4.29</p><h1>Faça cada regra sobreviver ao nascimento e a todas as mudanças do objeto</h1><p>Construa, ataque e depure Pedido, Produto, Contrato, OS e Pagamento até provar que nenhum caminho deixa o domínio em estado impossível.</p></div><div className="guided-hero-status"><LockKeyhole size={42}/><strong>{Math.round(completedSteps.size/steps.length*100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 133" items={[{value:"24 fontes",label:"Quebradas e protegidas"},{value:"9 execuções",label:"Saídas realmente verificadas"},{value:"12 ataques",label:"Na suíte de invariantes"}]}/><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 133"><div className="guided-step-nav-title"><ListChecks size={18}/>Roteiro prático</div>{steps.map((item,index)=><button type="button" key={item.id} className={(index===activeIndex?"active ":"")+(completedSteps.has(item.id)?"done":"")} onClick={()=>select(index)}><span className="guided-step-number">{completedSteps.has(item.id)?<Check size={14}/>:String(index+1).padStart(2,"0")}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block,index)=><Block block={block} key={block.type+index}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex===0} onClick={()=>select(activeIndex-1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={"step-toggle "+(done?"undo":"complete")} onClick={toggle}>{done?<><RotateCcw size={16}/>Desmarcar etapa</>:<><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex<steps.length-1&&<button type="button" className="primary" disabled={!done} onClick={()=>select(activeIndex+1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allDone&&<section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Domínio permaneceu íntegro</h3><p>{lessonComplete?"Aula concluída: avance para serviços de domínio iniciais.":"Execute Pagamento e os doze ataques antes de concluir."}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete?"Reabrir aula":"Concluir aula"}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 132</button><div className={"guided-course-status "+(lessonComplete?"completed":allDone?"ready":"")}><Clock3 size={18}/><span><strong>{lessonComplete?"Aula concluída":completedSteps.size+" de "+steps.length+" etapas"}</strong><small>nascimento, mutações, exceções, debug e Pagamento</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson||!lessonComplete}>Aula 134<ArrowRight size={17}/></button></footer></article>}
