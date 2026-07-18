import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Boxes, Check, CheckCircle2, Clock3,
  Copy, FileCode2, GitBranch, Layers3, ListChecks, Play, RotateCcw, ShieldCheck,
  Sparkles, StepForward,
} from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedCompositionLesson.css';

const STORAGE_KEY = 'guided-composition-lesson-114-progress';

const BAD_SOURCE = `import java.math.BigDecimal;
public class PedidoGiganteProblematico {
    public static void main(String[] args) {
        PedidoGigante pedido = new PedidoGigante(1001, "Ana", "ana@email.com",
                "Rua A", "123", "Barueri", "SP", "Notebook", 2,
                new BigDecimal("3500.00"), "PIX", "APROVADO");
        System.out.println(pedido.resumo());
    }
}
class PedidoGigante {
    private final int numero;
    private final String clienteNome, clienteEmail;
    private final String enderecoRua, enderecoNumero, enderecoCidade, enderecoEstado;
    private final String produtoNome; private final int produtoQuantidade;
    private final BigDecimal produtoValor; private final String pagamentoForma, pagamentoStatus;
    PedidoGigante(int numero, String clienteNome, String clienteEmail, String rua, String numeroEndereco,
            String cidade, String estado, String produto, int quantidade, BigDecimal valor,
            String forma, String status) {
        this.numero = numero; this.clienteNome = clienteNome; this.clienteEmail = clienteEmail;
        this.enderecoRua = rua; this.enderecoNumero = numeroEndereco; this.enderecoCidade = cidade;
        this.enderecoEstado = estado; this.produtoNome = produto; this.produtoQuantidade = quantidade;
        this.produtoValor = valor; this.pagamentoForma = forma; this.pagamentoStatus = status;
    }
    String resumo() { return "Pedido " + numero + " | " + clienteNome + " | " + enderecoRua
            + " | " + produtoNome + " x " + produtoQuantidade + " | " + pagamentoForma + "/" + pagamentoStatus; }
}`;

const ORDER_SOURCE = `import java.math.BigDecimal;
import java.math.RoundingMode;
public class ComposicaoPedidoCompleto {
    public static void main(String[] args) {
        EnderecoEntrega endereco = new EnderecoEntrega("Rua das Flores", "123", "Barueri", "SP", "06400-000");
        ClienteDoPedido cliente = new ClienteDoPedido("Ana Silva", "ana@email.com", "11999999999", endereco);
        ProdutoDoPedido produto = new ProdutoDoPedido("NOTE-001", "Notebook", new BigDecimal("3500.00"));
        ItemPedidoComposto item = new ItemPedidoComposto(produto, 2);
        PagamentoDoPedido pagamento = new PagamentoDoPedido(FormaPagamento.PIX, StatusPagamento.APROVADO, item.subtotal());
        PedidoComposto pedido = new PedidoComposto(1001, cliente, item, pagamento);
        System.out.println(pedido.resumo());
        System.out.println("Pedido pago: " + pedido.pago());
        System.out.println("Total do pedido: " + pedido.totalFormatado());
    }
}
enum FormaPagamento { PIX, CARTAO, BOLETO }
enum StatusPagamento { PENDENTE, APROVADO, CONFIRMADO, CANCELADO }
class PedidoComposto {
    private final int numero; private final ClienteDoPedido cliente;
    private final ItemPedidoComposto item; private final PagamentoDoPedido pagamento;
    PedidoComposto(int numero, ClienteDoPedido cliente, ItemPedidoComposto item, PagamentoDoPedido pagamento) {
        if (numero <= 0 || cliente == null || item == null || pagamento == null)
            throw new IllegalArgumentException("Número e partes do pedido são obrigatórios.");
        this.numero = numero; this.cliente = cliente; this.item = item; this.pagamento = pagamento;
    }
    BigDecimal total() { return item.subtotal(); }
    String totalFormatado() { return "R$ " + total().setScale(2, RoundingMode.HALF_UP); }
    boolean pago() { return pagamento.aprovado() || pagamento.confirmado(); }
    String resumo() { return "Pedido: " + numero + "\nCliente: " + cliente.resumo()
            + "\nItem: " + item.resumo() + "\nPagamento: " + pagamento.resumo(); }
}
class ClienteDoPedido {
    private final String nome, email, telefone; private final EnderecoEntrega endereco;
    ClienteDoPedido(String nome, String email, String telefone, EnderecoEntrega endereco) {
        if (nome == null || nome.isBlank() || email == null || !email.contains("@")
                || telefone == null || telefone.isBlank() || endereco == null)
            throw new IllegalArgumentException("Cliente inválido.");
        this.nome = nome; this.email = email; this.telefone = telefone; this.endereco = endereco;
    }
    String resumo() { return nome + " <" + email + "> | " + telefone + " | " + endereco.formatado(); }
}
class EnderecoEntrega {
    private final String rua, numero, cidade, estado, cep;
    EnderecoEntrega(String rua, String numero, String cidade, String estado, String cep) {
        if (rua == null || rua.isBlank() || numero == null || numero.isBlank() || cidade == null
                || cidade.isBlank() || estado == null || estado.length() != 2 || cep == null || cep.isBlank())
            throw new IllegalArgumentException("Endereço inválido.");
        this.rua = rua; this.numero = numero; this.cidade = cidade; this.estado = estado.toUpperCase(); this.cep = cep;
    }
    String formatado() { return rua + ", " + numero + " - " + cidade + "/" + estado + " - CEP " + cep; }
}
class ProdutoDoPedido {
    private final String codigo, nome; private final BigDecimal valorUnitario;
    ProdutoDoPedido(String codigo, String nome, BigDecimal valor) {
        if (codigo == null || codigo.isBlank() || nome == null || nome.isBlank()
                || valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Produto inválido.");
        this.codigo = codigo; this.nome = nome; this.valorUnitario = valor.setScale(2, RoundingMode.HALF_UP);
    }
    BigDecimal valorUnitario() { return valorUnitario; }
    String resumo() { return codigo + " - " + nome + " | R$ " + valorUnitario; }
}
class ItemPedidoComposto {
    private final ProdutoDoPedido produto; private final int quantidade;
    ItemPedidoComposto(ProdutoDoPedido produto, int quantidade) {
        if (produto == null || quantidade <= 0) throw new IllegalArgumentException("Item inválido.");
        this.produto = produto; this.quantidade = quantidade;
    }
    BigDecimal subtotal() { return produto.valorUnitario().multiply(BigDecimal.valueOf(quantidade)); }
    String resumo() { return produto.resumo() + " | Quantidade: " + quantidade + " | Subtotal: R$ " + subtotal(); }
}
class PagamentoDoPedido {
    private final FormaPagamento forma; private final StatusPagamento status; private final BigDecimal valor;
    PagamentoDoPedido(FormaPagamento forma, StatusPagamento status, BigDecimal valor) {
        if (forma == null || status == null || valor == null || valor.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Pagamento inválido.");
        this.forma = forma; this.status = status; this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }
    boolean aprovado() { return status == StatusPagamento.APROVADO; }
    boolean confirmado() { return status == StatusPagamento.CONFIRMADO; }
    String resumo() { return forma + " | " + status + " | R$ " + valor; }
}`;

const OS_SOURCE = `import java.time.LocalDate;
public class ComposicaoOrdemServico {
    public static void main(String[] args) {
        ClienteAtendimento cliente = new ClienteAtendimento("Carlos Lima", "carlos@email.com", "11988887777");
        EnderecoAtendimento endereco = new EnderecoAtendimento("Avenida Central", "500", "Osasco", "SP");
        PeriodoAtendimento periodo = new PeriodoAtendimento(LocalDate.of(2026, 7, 20), TurnoAtendimento.MANHA);
        AtividadeOs atividade = new AtividadeOs("Montagem de móvel", periodo);
        OrdemServicoComposta os = new OrdemServicoComposta("OS-2026-0001", cliente, endereco, atividade, StatusOs.AGENDADA);
        System.out.println(os.resumo());
        System.out.println("Pode reagendar: " + os.podeReagendar());
    }
}
enum StatusOs { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
enum TurnoAtendimento { MANHA, TARDE }
class OrdemServicoComposta {
    private final String codigo; private final ClienteAtendimento cliente;
    private final EnderecoAtendimento endereco; private final AtividadeOs atividade; private final StatusOs status;
    OrdemServicoComposta(String codigo, ClienteAtendimento cliente, EnderecoAtendimento endereco,
            AtividadeOs atividade, StatusOs status) {
        if (codigo == null || codigo.isBlank() || cliente == null || endereco == null || atividade == null || status == null)
            throw new IllegalArgumentException("Partes obrigatórias da OS ausentes.");
        this.codigo = codigo; this.cliente = cliente; this.endereco = endereco; this.atividade = atividade; this.status = status;
    }
    boolean encerrada() { return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA; }
    boolean podeReagendar() { return !encerrada(); }
    String resumo() { return "OS: " + codigo + "\nCliente: " + cliente.resumo() + "\nEndereço: "
            + endereco.formatado() + "\nAtividade: " + atividade.resumo() + "\nStatus: " + status; }
}
class ClienteAtendimento {
    private final String nome, email, telefone;
    ClienteAtendimento(String nome, String email, String telefone) {
        if (nome == null || nome.isBlank() || email == null || !email.contains("@") || telefone == null || telefone.isBlank())
            throw new IllegalArgumentException("Cliente inválido.");
        this.nome = nome; this.email = email; this.telefone = telefone;
    }
    String resumo() { return nome + " <" + email + "> | " + telefone; }
}
class EnderecoAtendimento {
    private final String rua, numero, cidade, estado;
    EnderecoAtendimento(String rua, String numero, String cidade, String estado) {
        if (rua == null || rua.isBlank() || numero == null || numero.isBlank() || cidade == null
                || cidade.isBlank() || estado == null || estado.length() != 2) throw new IllegalArgumentException("Endereço inválido.");
        this.rua = rua; this.numero = numero; this.cidade = cidade; this.estado = estado.toUpperCase();
    }
    String formatado() { return rua + ", " + numero + " - " + cidade + "/" + estado; }
}
class AtividadeOs {
    private final String descricao; private final PeriodoAtendimento periodo;
    AtividadeOs(String descricao, PeriodoAtendimento periodo) {
        if (descricao == null || descricao.isBlank() || periodo == null) throw new IllegalArgumentException("Atividade inválida.");
        this.descricao = descricao; this.periodo = periodo;
    }
    String resumo() { return descricao + " | " + periodo.resumo(); }
}
class PeriodoAtendimento {
    private final LocalDate data; private final TurnoAtendimento turno;
    PeriodoAtendimento(LocalDate data, TurnoAtendimento turno) {
        if (data == null || turno == null) throw new IllegalArgumentException("Período inválido.");
        this.data = data; this.turno = turno;
    }
    boolean futuroOuHoje(LocalDate referencia) { return !data.isBefore(referencia); }
    String resumo() { return data + " - " + turno; }
}`;

const MESSAGE_SOURCE = `public class ComposicaoMensageria {
    public static void main(String[] args) {
        Destinatario destinatario = new Destinatario("Ana Silva", "11999999999");
        ConteudoMensagem conteudo = new ConteudoMensagem("boas_vindas", "Olá, Ana! Seja bem-vinda.");
        Mensagem mensagem = new Mensagem(destinatario, conteudo, TipoCanal.WHATSAPP, StatusMensagem.PENDENTE);
        System.out.println(mensagem.resumo());
        System.out.println("Pode enviar: " + mensagem.podeEnviar());
        mensagem.enviar();
        System.out.println(mensagem.resumo());
        try { mensagem.cancelar("duplicidade"); }
        catch (IllegalStateException erro) { System.out.println("Falha esperada: " + erro.getMessage()); }
    }
}
enum TipoCanal { WHATSAPP, EMAIL, SMS }
enum StatusMensagem { PENDENTE, ENVIADA, ERRO, CANCELADA }
class Mensagem {
    private final Destinatario destinatario; private final ConteudoMensagem conteudo;
    private final TipoCanal canal; private StatusMensagem status; private String motivoCancelamento = "";
    Mensagem(Destinatario destinatario, ConteudoMensagem conteudo, TipoCanal canal, StatusMensagem status) {
        if (destinatario == null || conteudo == null || canal == null || status == null)
            throw new IllegalArgumentException("Partes da mensagem são obrigatórias.");
        this.destinatario = destinatario; this.conteudo = conteudo; this.canal = canal; this.status = status;
    }
    boolean podeEnviar() { return status == StatusMensagem.PENDENTE; }
    void enviar() { if (!podeEnviar()) throw new IllegalStateException("Somente PENDENTE pode enviar."); status = StatusMensagem.ENVIADA; }
    void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo obrigatório.");
        if (status == StatusMensagem.ENVIADA) throw new IllegalStateException("Mensagem enviada não pode ser cancelada.");
        status = StatusMensagem.CANCELADA; motivoCancelamento = motivo;
    }
    String resumo() { return destinatario.resumo() + " | " + conteudo.resumo() + " | " + canal + " | " + status
            + (motivoCancelamento.isBlank() ? "" : " | " + motivoCancelamento); }
}
class Destinatario {
    private final String nome, contato;
    Destinatario(String nome, String contato) {
        if (nome == null || nome.isBlank() || contato == null || contato.isBlank()) throw new IllegalArgumentException("Destinatário inválido.");
        this.nome = nome; this.contato = contato;
    }
    String resumo() { return nome + " <" + contato + ">"; }
}
class ConteudoMensagem {
    private final String modelo, texto;
    ConteudoMensagem(String modelo, String texto) {
        if (modelo == null || modelo.isBlank() || texto == null || texto.isBlank()) throw new IllegalArgumentException("Conteúdo inválido.");
        this.modelo = modelo; this.texto = texto;
    }
    String resumo() { return modelo + ": " + texto; }
}`;

const TEST_SOURCE = `public class TesteComposicao {
    public static void main(String[] args) {
        DestinatarioTeste destinatario = new DestinatarioTeste("Ana", "11999999999");
        ConteudoTeste conteudo = new ConteudoTeste("boas_vindas", "Olá");
        MensagemTeste mensagem = new MensagemTeste(destinatario, conteudo);
        assertTrue(mensagem.podeEnviar(), "pendente envia");
        mensagem.enviar(); assertFalse(mensagem.podeEnviar(), "enviada não envia");
        assertEquals("ENVIADA", mensagem.status(), "status enviado");
        expectState(() -> mensagem.cancelar("x"), "enviada não cancela");
        expectArgument(() -> new MensagemTeste(null, conteudo), "destinatário obrigatório");
        expectArgument(() -> new ConteudoTeste("", "Olá"), "modelo obrigatório");
        assertTrue(mensagem.resumo().contains("Ana"), "colaboração no resumo");
        System.out.println("7 testes passaram");
    }
    static void expectState(Runnable a, String c) { try { a.run(); throw new AssertionError(c); } catch (IllegalStateException e) { } }
    static void expectArgument(Runnable a, String c) { try { a.run(); throw new AssertionError(c); } catch (IllegalArgumentException e) { } }
    static void assertTrue(boolean a, String c) { if (!a) throw new AssertionError(c); }
    static void assertFalse(boolean a, String c) { assertTrue(!a, c); }
    static void assertEquals(Object e, Object a, String c) { if (!e.equals(a)) throw new AssertionError(c); }
}
record DestinatarioTeste(String nome, String contato) { DestinatarioTeste { if (nome == null || nome.isBlank() || contato == null || contato.isBlank()) throw new IllegalArgumentException(); } }
record ConteudoTeste(String modelo, String texto) { ConteudoTeste { if (modelo == null || modelo.isBlank() || texto == null || texto.isBlank()) throw new IllegalArgumentException(); } }
class MensagemTeste {
    private final DestinatarioTeste destinatario; private final ConteudoTeste conteudo; private String status = "PENDENTE";
    MensagemTeste(DestinatarioTeste d, ConteudoTeste c) { if (d == null || c == null) throw new IllegalArgumentException(); destinatario = d; conteudo = c; }
    boolean podeEnviar() { return status.equals("PENDENTE"); }
    void enviar() { if (!podeEnviar()) throw new IllegalStateException(); status = "ENVIADA"; }
    void cancelar(String motivo) { if (status.equals("ENVIADA")) throw new IllegalStateException(); status = "CANCELADA"; }
    String status() { return status; } String resumo() { return destinatario.nome() + " | " + conteudo.texto(); }
}`;

const ERRORS = [
  ['Criar classe gigante', 'Pedido mistura cliente, endereço, produto, item e pagamento.', 'Extraia objetos que tenham conceito, regra ou comportamento próprio.'],
  ['Usar String para tudo', 'Status, turno, data e dinheiro perdem tipo e validação.', 'Use enum, LocalDate, BigDecimal e objetos do domínio.'],
  ['Centralizar todas as validações', 'Pedido conhece regras internas de todas as partes.', 'Cada objeto valida sua própria consistência.'],
  ['Aceitar null sem decisão', 'A composição nasce incompleta e falha depois com NPE.', 'Valide dependências obrigatórias no construtor.'],
  ['Criar classe para qualquer texto', 'O modelo ganha abstrações sem regra nem ganho de leitura.', 'Extraia somente conceitos que merecem teste ou evolução.'],
  ['Conhecer detalhes demais', 'pedido navega cliente.endereco().cidade() e manipula formato.', 'Peça comportamento ao objeto composto.'],
  ['Confundir tem um com é um', 'Composição e herança passam a representar a mesma ideia.', 'Use composição para tem um; herança será relação é um.'],
];

const EVIDENCE = `# Aula 114 — Composição
- [ ] Identifiquei relações tem um
- [ ] Encontrei objetos escondidos no Pedido gigante
- [ ] Montei a árvore Pedido composta
- [ ] Executei subtotal, total e pago
- [ ] Testei validações no objeto responsável
- [ ] Comparei construtores grande e composto
- [ ] Montei a árvore da Ordem de Serviço
- [ ] Evitei navegação e acoplamento excessivos
- [ ] Depurei oito chamadas colaborativas
- [ ] Diagnostiquei sete erros comuns
- [ ] Entreguei Mensageria, sete testes e Git`;

function CopyButton({ value }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? 'Copiado' : 'Copiar'}</button>; }
function CodePanel({ name, code }) { return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

function HasALab() {
  const [selected, setSelected] = useState(0);
  const relations = [['Cliente', 'tem um', 'Endereco'], ['Pedido', 'tem um', 'Cliente'], ['ItemPedido', 'tem um', 'Produto'], ['Atividade', 'tem um', 'Periodo'], ['Gerente', 'é um', 'Funcionario']];
  const current = relations[selected];
  return <section className="cp114-stack"><div className="cp114-relation"><nav>{relations.map((item, index) => <button type="button" key={item.join('-')} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{item[0]} → {item[2]}</button>)}</nav><main><strong>{current[0]}</strong><span className={current[1] === 'tem um' ? '' : 'future'}>{current[1]}</span><strong>{current[2]}</strong><p>{current[1] === 'tem um' ? 'Composição: um objeto faz parte do estado do outro.' : 'Herança: relação futura, não é composição.'}</p></main></div><div className="cp114-principle"><Boxes /><div><strong>Composição transforma dados soltos em colaboradores nomeados</strong><span>O objeto maior coordena; cada parte mantém sua própria responsabilidade.</span></div></div></section>;
}

function GiantLab() {
  const [view, setView] = useState('signals');
  const signals = ['12+ atributos', 'prefixos cliente*', 'prefixos endereco*', 'construtor enorme', 'validações misturadas', 'teste difícil'];
  return <section className="cp114-stack"><div className="cp114-toggle"><button type="button" className={view === 'signals' ? 'active' : ''} onClick={() => setView('signals')}>Sinais</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código executável</button></div>{view === 'signals' ? <div className="cp114-signals">{signals.map((item, index) => <span key={item}><b>{index + 1}</b>{item}</span>)}</div> : <CodePanel name="PedidoGiganteProblematico.java" code={BAD_SOURCE} />}<div className="cp114-hidden"><section><small>clienteNome · clienteEmail</small><strong>Cliente</strong></section><section><small>enderecoRua · enderecoCidade</small><strong>Endereco</strong></section><section><small>produtoNome · produtoValor</small><strong>Produto</strong></section><section><small>pagamentoForma · pagamentoStatus</small><strong>Pagamento</strong></section></div></section>;
}

function TreeLab() {
  const [selected, setSelected] = useState('pedido');
  const trees = {
    pedido: [['PedidoComposto', 'coordena total e pago'], ['ClienteDoPedido', 'nome, contato e endereço'], ['EnderecoEntrega', 'formata e valida localização'], ['ItemPedido', 'produto × quantidade'], ['Produto', 'código, nome e valor'], ['Pagamento', 'forma, status e valor']],
    os: [['OrdemServico', 'coordena atendimento'], ['ClienteAtendimento', 'contato do cliente'], ['EnderecoAtendimento', 'local da execução'], ['AtividadeOs', 'descrição e período'], ['PeriodoAtendimento', 'data e turno'], ['StatusOs', 'estado do ciclo']],
  };
  return <section className="cp114-stack"><div className="cp114-toggle"><button type="button" className={selected === 'pedido' ? 'active' : ''} onClick={() => setSelected('pedido')}>Árvore Pedido</button><button type="button" className={selected === 'os' ? 'active' : ''} onClick={() => setSelected('os')}>Árvore OS</button></div><div className="cp114-tree" role="img" aria-label={`Árvore de composição de ${selected}`}>{trees[selected].map((item, index) => <article key={item[0]} className={`level-${index === 0 ? 0 : item[0].includes('Produto') || item[0].includes('Periodo') ? 2 : 1}`}><span>{index === 0 ? 'RAIZ' : 'TEM UM'}</span><strong>{item[0]}</strong><small>{item[1]}</small></article>)}</div></section>;
}

function OrderLab() {
  const [quantity, setQuantity] = useState(2);
  const [price, setPrice] = useState(3500);
  const [status, setStatus] = useState('APROVADO');
  const total = Math.max(0, quantity) * Math.max(0, price);
  return <section className="cp114-stack"><div className="cp114-order"><div><label>Quantidade<input type="number" value={quantity} onChange={event => setQuantity(Number(event.target.value))} /></label><label>Valor unitário<input type="number" value={price} onChange={event => setPrice(Number(event.target.value))} /></label><label>Status<select value={status} onChange={event => setStatus(event.target.value)}><option>PENDENTE</option><option>APROVADO</option><option>CONFIRMADO</option><option>CANCELADO</option></select></label></div><article><small>PEDIDO 1001</small><strong>R$ {total.toFixed(2)}</strong><code>item.subtotal() → pedido.total()</code><span>pago = {['APROVADO', 'CONFIRMADO'].includes(status) ? 'true' : 'false'}</span></article></div><CodePanel name="ComposicaoPedidoCompleto.java" code={ORDER_SOURCE} /></section>;
}

function ValidationLab() {
  const [selected, setSelected] = useState(0);
  const cases = [['cliente = null', 'PedidoComposto', 'Cliente obrigatório'], ['quantidade = 0', 'ItemPedidoComposto', 'Quantidade positiva'], ['valor = 0', 'ProdutoDoPedido', 'Valor unitário positivo'], ['email sem @', 'ClienteDoPedido', 'Formato do contato'], ['estado = "SPO"', 'EnderecoEntrega', 'UF com 2 caracteres'], ['pagamento = null', 'PedidoComposto', 'Pagamento obrigatório']];
  const current = cases[selected];
  return <section className="cp114-stack"><div className="cp114-validation"><nav>{cases.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]}</code></button>)}</nav><main><small>FALHA NO NASCIMENTO</small><strong>{current[1]}</strong><code>{current[2]}</code><p>A regra falha perto dos dados que conhece, antes de montar o objeto maior.</p></main></div><div className="cp114-principle"><ShieldCheck /><div><strong>Composição obrigatória não aceita null por acidente</strong><span>Cada construtor protege sua parte; o objeto raiz valida apenas a presença de colaboradores.</span></div></div></section>;
}

function ConstructorLab() {
  const [mode, setMode] = useState('giant');
  return <section className="cp114-stack"><div className="cp114-toggle"><button type="button" className={mode === 'giant' ? 'active' : ''} onClick={() => setMode('giant')}>15 parâmetros</button><button type="button" className={mode === 'composed' ? 'active' : ''} onClick={() => setMode('composed')}>4 conceitos</button></div><div className="cp114-constructor"><small>{mode === 'giant' ? 'RISCO: STRINGS INVERTIDAS E INTENÇÃO ESCONDIDA' : 'CONTRATO: PARTES NOMEADAS E JÁ VÁLIDAS'}</small><code>{mode === 'giant' ? 'new Pedido(1001, nome, email, telefone, rua, numero, cidade, estado, cep, codigo, produto, valor, qtd, forma, status)' : 'new PedidoComposto(1001, cliente, item, pagamento)'}</code><div>{(mode === 'giant' ? ['cliente*', 'endereco*', 'produto*', 'pagamento*'] : ['ClienteDoPedido', 'ItemPedidoComposto', 'PagamentoDoPedido', 'PedidoComposto']).map(item => <span key={item}>{item}</span>)}</div></div><div className="cp114-locality"><span>Item calcula subtotal</span><ArrowRight /><span>Pagamento responde pago</span><ArrowRight /><span>Pedido coordena total</span></div></section>;
}

function OsLab() {
  const [status, setStatus] = useState('AGENDADA');
  const [turn, setTurn] = useState('MANHA');
  return <section className="cp114-stack"><div className="cp114-os"><div><span>OrdemServicoComposta</span><ArrowRight /><span>AtividadeOs</span><ArrowRight /><span>PeriodoAtendimento</span></div><article><small>OS-2026-0001</small><strong>{status}</strong><code>2026-07-20 · {turn}</code><span>podeReagendar = {['CONCLUIDA', 'CANCELADA'].includes(status) ? 'false' : 'true'}</span><div><select value={status} onChange={event => setStatus(event.target.value)}><option>AGENDADA</option><option>REAGENDADA</option><option>CONCLUIDA</option><option>CANCELADA</option></select><select value={turn} onChange={event => setTurn(event.target.value)}><option>MANHA</option><option>TARDE</option></select></div></article></div><CodePanel name="ComposicaoOrdemServico.java" code={OS_SOURCE} /></section>;
}

function CouplingLab() {
  const [selected, setSelected] = useState(0);
  const calls = [['cliente.endereco().cidade().toUpperCase()', 'forte', 'Pedido conhece navegação, formato e detalhes internos'], ['cliente.enderecoFormatado()', 'moderado', 'Cliente oferece o comportamento necessário'], ['item.subtotal()', 'adequado', 'Item usa produto e quantidade que possui'], ['pagamento.aprovado()', 'adequado', 'Pagamento responde sobre seu próprio status'], ['List<ItemPedido>', 'futuro', 'um versus vários preserva a mesma relação tem um']];
  const current = calls[selected];
  return <section className="cp114-stack"><div className="cp114-coupling"><nav>{calls.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]}</code></button>)}</nav><main><small>ACOPLAMENTO {current[1].toUpperCase()}</small><strong>{current[0]}</strong><p>{current[2]}.</p></main></div><div className="cp114-principle"><GitBranch /><div><strong>Converse com o colaborador pelo comportamento que ele oferece</strong><span>Composição cria dependência legítima; navegação e manipulação de detalhes demais criam fragilidade.</span></div></div></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [['EnderecoEntrega', 'new EnderecoEntrega(...)', 'valida localização'], ['ClienteDoPedido', 'new ClienteDoPedido(..., endereco)', 'guarda referência válida'], ['ProdutoDoPedido', 'valorUnitario = 3500.00', 'protege preço'], ['ItemPedido', 'produto × 2', 'subtotal = 7000.00'], ['Pagamento', 'PIX · APROVADO · 7000.00', 'responde aprovado'], ['PedidoComposto', 'cliente + item + pagamento', 'coordena partes'], ['pedido.resumo', 'cliente.resumo → endereco.formatado', 'colaboração'], ['pedido.total/pago', 'item.subtotal + pagamento.aprovado', 'resultado sem invadir detalhes']];
  const current = trace[pause];
  return <section className="cp114-stack"><div className="cp114-debug"><header><span>ComposicaoPedidoCompleto.java · Debug</span><span>Variables · Frames · F7</span></header><div><aside>{trace.map((item, index) => <button type="button" key={index} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>PAUSA {pause + 1} DE {trace.length}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}.</p><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => value + 1)}><StepForward size={15} />Próxima pausa</button></main></div><footer>Entre nos métodos: a composição aparece na cadeia de chamadas, não apenas no diagrama de classes.</footer></div></section>;
}

function ErrorsClinic() { const [selected, setSelected] = useState(0); const current = ERRORS[selected]; return <section className="guided-errors cp114-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>; }

function DeliveryLab() {
  const [view, setView] = useState('contract'); const [checked, setChecked] = useState([]);
  const checks = ['tem um classificado', 'Pedido gigante auditado', 'objetos escondidos extraídos', 'Pedido composto executado', 'seis falhas localizadas', 'construtores comparados', 'OS composta executada', 'acoplamento revisado', 'oito chamadas depuradas', 'sete erros diagnosticados', 'Mensageria e 7 testes concluídos'];
  const commands = ['javac ComposicaoMensageria.java', 'java ComposicaoMensageria', 'javac TesteComposicao.java', 'java TesteComposicao', 'git status', 'git add labs/m4/aula-114-composicao', 'git commit -m "Aula 114: pratica composicao em orientacao a objetos"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="cp114-stack"><div className="cp114-toggle cp114-three"><button type="button" className={view === 'contract' ? 'active' : ''} onClick={() => setView('contract')}>Contrato Mensagem</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código</button><button type="button" className={view === 'tests' ? 'active' : ''} onClick={() => setView('tests')}>Testes</button></div>{view === 'code' ? <CodePanel name="ComposicaoMensageria.java" code={MESSAGE_SOURCE} /> : view === 'tests' ? <CodePanel name="TesteComposicao.java" code={TEST_SOURCE} /> : <div className="cp114-contract"><section><small>MENSAGEM TEM</small><strong>Destinatario · Conteudo · TipoCanal · Status</strong></section><section><small>PARTES VALIDAM</small><strong>nome/contato · modelo/texto</strong></section><section><small>CICLO</small><strong>PENDENTE → ENVIADA ou CANCELADA</strong></section><section><small>COLABORAÇÃO</small><strong>resumos das partes formam o todo</strong></section></div>}<div className="cp114-terminal"><header><Play size={15} />Compilar, testar e versionar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}7 testes passaram</pre></div><div className="cp114-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral da composição</h3></div><ul><li>Qual parte valida cada informação?</li><li>Onde a relação tem um aparece no código?</li><li>Qual método evita conhecer detalhes internos?</li><li>Por que Mensagem não deveria aceitar destinatário nulo?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'has-a', label: 'Relação tem um', duration: '10 min', eyebrow: 'COMPOSIÇÃO VERSUS HERANÇA', title: 'Leia o modelo como objetos que têm outros objetos', blocks: [{ type: 'lead', text: 'Cliente tem Endereco, Pedido tem Item e Atividade tem Periodo; “é um” pertence a outra relação.' }, { type: 'has-a' }] },
  { id: 'giant', label: 'Classe Gigante', duration: '15 min', eyebrow: 'PREFIXOS, PARÂMETROS E RESPONSABILIDADES', title: 'Encontre os objetos escondidos dentro de Pedido', blocks: [{ type: 'lead', text: 'Prefixos repetidos, construtor enorme e validações misturadas revelam Cliente, Endereco, Produto e Pagamento.' }, { type: 'giant' }] },
  { id: 'tree', label: 'Árvores do Domínio', duration: '12 min', eyebrow: 'RAIZ, PARTES E PARTES DAS PARTES', title: 'Visualize Pedido e Ordem de Serviço como árvores', blocks: [{ type: 'lead', text: 'A hierarquia mostra colaboração estrutural sem transformar cada campo simples em uma classe.' }, { type: 'tree' }] },
  { id: 'order', label: 'Pedido Composto', duration: '22 min', eyebrow: 'CLIENTE, ITEM, PRODUTO E PAGAMENTO', title: 'Monte o pedido e observe subtotal, total e pago', blocks: [{ type: 'lead', text: 'Altere quantidade, preço e status: cada resultado nasce do comportamento do objeto que possui os dados.' }, { type: 'order' }] },
  { id: 'validation', label: 'Validação Distribuída', duration: '14 min', eyebrow: 'NULL E REGRA NO DONO CERTO', title: 'Provoque seis falhas e localize quem deve recusá-las', blocks: [{ type: 'lead', text: 'O Pedido valida colaboradores obrigatórios; Item, Produto, Cliente e Endereco validam seus próprios dados.' }, { type: 'validation' }] },
  { id: 'constructor', label: 'Construtor e Comportamento', duration: '13 min', eyebrow: '15 PARÂMETROS PARA 4 CONCEITOS', title: 'Troque uma lista frágil por um contrato legível', blocks: [{ type: 'lead', text: 'Composição reduz inversões de parâmetros e posiciona subtotal, pagamento e total perto dos dados usados.' }, { type: 'constructor' }] },
  { id: 'os', label: 'OS Composta', duration: '18 min', eyebrow: 'CLIENTE, ENDEREÇO, ATIVIDADE E PERÍODO', title: 'Acompanhe uma composição aninhada até data e turno', blocks: [{ type: 'lead', text: 'Atividade tem Periodo; a OS coordena partes e decide podeReagendar pelo próprio status.' }, { type: 'os' }] },
  { id: 'coupling', label: 'Encapsulamento e Acoplamento', duration: '13 min', eyebrow: 'PEÇA COMPORTAMENTO, NÃO NAVEGUE DETALHES', title: 'Use colaboradores sem atravessar sua estrutura interna', blocks: [{ type: 'lead', text: 'Compare navegação longa, método formatado, comportamento local e a evolução futura de um item para vários.' }, { type: 'coupling' }] },
  { id: 'debug', label: 'Debug da Colaboração', duration: '14 min', eyebrow: 'CRIAÇÃO, REFERÊNCIAS E CADEIA DE CHAMADAS', title: 'Entre em oito pontos do objeto composto', blocks: [{ type: 'lead', text: 'O mock segue construção das partes, montagem da raiz e chamadas distribuídas de resumo, total e pago.' }, { type: 'debug' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '11 min', eyebrow: 'CLASSE GIGANTE, TIPOS FRACOS, NULL E ACOPLAMENTO', title: 'Diagnostique sete desvios sem criar classes demais', blocks: [{ type: 'lead', text: 'A correção equilibra conceitos próprios, validação local e dependência explícita.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Mensageria', duration: '20 min', eyebrow: 'DESTINATÁRIO, CONTEÚDO, CANAL, ESTADO E GIT', title: 'Entregue uma Mensagem composta e teste suas partes', blocks: [{ type: 'lead', text: 'Destinatario e Conteudo validam seus dados; Mensagem coordena envio, cancelamento e resumo.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { 'has-a': HasALab, giant: GiantLab, tree: TreeLab, order: OrderLab, validation: ValidationLab, constructor: ConstructorLab, os: OsLab, coupling: CouplingLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component /> : null; }

export default function GuidedCompositionLesson114({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => { const active = navRef.current?.querySelector('button.active'); if (active && window.matchMedia('(max-width: 900px)').matches) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]);
  const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); };
  return <article className="guided-git-lesson guided-composition-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Boxes size={17} />Oficina de objetos colaboradores</span><p className="guided-sequence">114 · M4.10</p><h1>Objetos grandes são formados por objetos menores</h1><p>Extraia conceitos escondidos, monte Pedido e OS, distribua validações, compare construtores, controle acoplamento e entregue Mensageria composta.</p></div><div className="guided-hero-status"><Layers3 size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 114" items={[{ value: '5 fontes', label: 'Compiladas e executadas' }, { value: '8 pausas', label: 'No debug da colaboração' }, { value: '7 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 114"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Partes válidas colaborando em um todo</h3><p>{lessonComplete ? 'Aula concluída: avance para relacionamento entre objetos.' : 'Execute Mensageria e os testes antes de concluir.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 113</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Tem um, responsabilidades, null e acoplamento</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 115<ArrowRight size={17} /></button></footer></article>;
}
