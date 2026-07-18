import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Boxes, Check, CheckCircle2, Clock3,
  Copy, FileCode2, ListChecks, LockKeyhole, Play, RotateCcw, ShieldCheck,
  Sparkles, StepForward, Terminal, Workflow,
} from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedGettersSettersLesson.css';

const STORAGE_KEY = 'guided-getters-setters-lesson-112-progress';

const BAD_PAYMENT_SOURCE = `import java.math.BigDecimal;
public class PagamentoComSettersLivres {
    public static void main(String[] args) {
        PagamentoLivre pagamento = new PagamentoLivre();
        pagamento.setCodigo("PAG-001");
        pagamento.setValor(new BigDecimal("150.00"));
        pagamento.setStatus(StatusPagamentoLivre.PENDENTE);
        System.out.println("Inicial: " + pagamento.resumo());
        pagamento.setValor(new BigDecimal("-500.00"));
        pagamento.setStatus(StatusPagamentoLivre.CONFIRMADO);
        System.out.println("Indevido: " + pagamento.resumo());
    }
}
enum StatusPagamentoLivre { PENDENTE, APROVADO, CONFIRMADO, CANCELADO }
class PagamentoLivre {
    private String codigo;
    private BigDecimal valor;
    private StatusPagamentoLivre status;
    void setCodigo(String codigo) { this.codigo = codigo; }
    void setValor(BigDecimal valor) { this.valor = valor; }
    void setStatus(StatusPagamentoLivre status) { this.status = status; }
    String resumo() { return codigo + " | " + valor + " | " + status; }
}`;

const GOOD_PAYMENT_SOURCE = `import java.math.BigDecimal;
public class PagamentoComCriterio {
    public static void main(String[] args) {
        PagamentoSeguro pagamento = new PagamentoSeguro("PAG-001", new BigDecimal("150.00"));
        System.out.println(pagamento.resumo());
        pagamento.aprovar();
        System.out.println(pagamento.resumo());
        pagamento.confirmar();
        System.out.println(pagamento.resumo());
        try { pagamento.cancelar("duplicidade"); }
        catch (IllegalStateException erro) { System.out.println("Falha esperada: " + erro.getMessage()); }
    }
}
enum StatusPagamentoSeguro { PENDENTE, APROVADO, CONFIRMADO, CANCELADO }
class PagamentoSeguro {
    private final String codigo;
    private final BigDecimal valor;
    private StatusPagamentoSeguro status;
    PagamentoSeguro(String codigo, BigDecimal valor) {
        if (!textoInformado(codigo)) throw new IllegalArgumentException("Código obrigatório.");
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Valor deve ser positivo.");
        this.codigo = codigo; this.valor = valor; this.status = StatusPagamentoSeguro.PENDENTE;
    }
    String codigo() { return codigo; }
    BigDecimal valor() { return valor; }
    StatusPagamentoSeguro status() { return status; }
    boolean pendente() { return status == StatusPagamentoSeguro.PENDENTE; }
    boolean aprovado() { return status == StatusPagamentoSeguro.APROVADO; }
    boolean confirmado() { return status == StatusPagamentoSeguro.CONFIRMADO; }
    void aprovar() {
        if (!pendente()) throw new IllegalStateException("Somente PENDENTE pode ser aprovado.");
        status = StatusPagamentoSeguro.APROVADO;
    }
    void confirmar() {
        if (!aprovado()) throw new IllegalStateException("Somente APROVADO pode ser confirmado.");
        status = StatusPagamentoSeguro.CONFIRMADO;
    }
    void cancelar(String motivo) {
        if (!textoInformado(motivo)) throw new IllegalArgumentException("Motivo obrigatório.");
        if (confirmado()) throw new IllegalStateException("CONFIRMADO não pode ser cancelado.");
        status = StatusPagamentoSeguro.CANCELADO;
    }
    String resumo() { return codigo + " | " + valor + " | " + status; }
    private static boolean textoInformado(String texto) { return texto != null && !texto.isBlank(); }
}`;

const CLIENT_SOURCE = `public class ClienteGetSetComCriterio {
    public static void main(String[] args) {
        ClienteComAcoes cliente = new ClienteComAcoes("Ana Silva", "ana@email.com", "11999999999");
        System.out.println(cliente.resumo());
        cliente.alterarEmail("ana.novo@email.com");
        cliente.alterarTelefone("11888888888");
        cliente.inativar("Solicitação do cliente");
        System.out.println(cliente.resumo());
        cliente.reativar();
        System.out.println("Reativado: " + cliente.ativo());
    }
}
class ClienteComAcoes {
    private final String nome;
    private String email;
    private String telefone;
    private boolean ativo;
    private String motivoInativacao;
    ClienteComAcoes(String nome, String email, String telefone) {
        if (!textoInformado(nome) || !textoInformado(email))
            throw new IllegalArgumentException("Nome e e-mail são obrigatórios.");
        this.nome = nome; this.email = email; this.telefone = telefone;
        this.ativo = true; this.motivoInativacao = "";
    }
    String nome() { return nome; }
    String email() { return email; }
    String telefone() { return telefone; }
    boolean ativo() { return ativo; }
    boolean contatoCompleto() { return textoInformado(email) && textoInformado(telefone); }
    boolean podeReceberMensagem() { return ativo && textoInformado(telefone); }
    void alterarEmail(String novoEmail) {
        if (!textoInformado(novoEmail)) throw new IllegalArgumentException("Novo e-mail obrigatório.");
        email = novoEmail;
    }
    void alterarTelefone(String novoTelefone) {
        if (!textoInformado(novoTelefone)) throw new IllegalArgumentException("Novo telefone obrigatório.");
        telefone = novoTelefone;
    }
    void inativar(String motivo) {
        if (!textoInformado(motivo)) throw new IllegalArgumentException("Motivo obrigatório.");
        ativo = false; motivoInativacao = motivo;
    }
    void reativar() { ativo = true; motivoInativacao = ""; }
    String resumo() { return nome + " | " + email + " | " + telefone + " | " + ativo + " | " + motivoInativacao; }
    private static boolean textoInformado(String texto) { return texto != null && !texto.isBlank(); }
}`;

const PRODUCT_SOURCE = `import java.math.BigDecimal;
public class ProdutoSemSettersLivres {
    public static void main(String[] args) {
        ProdutoProtegido produto = new ProdutoProtegido("PROD-001", "Cadeira", new BigDecimal("199.90"), 10);
        produto.reporEstoque(5);
        System.out.println("Venda: " + produto.vender(3));
        produto.inativar("Produto fora de linha");
        System.out.println("Venda inativo: " + produto.vender(1));
        System.out.println(produto.resumo());
    }
}
class ProdutoProtegido {
    private final String codigo;
    private final String nome;
    private final BigDecimal preco;
    private int estoque;
    private boolean ativo;
    private String motivoInativacao;
    ProdutoProtegido(String codigo, String nome, BigDecimal preco, int estoque) {
        if (codigo == null || codigo.isBlank() || nome == null || nome.isBlank())
            throw new IllegalArgumentException("Código e nome obrigatórios.");
        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0 || estoque < 0)
            throw new IllegalArgumentException("Preço ou estoque inválido.");
        this.codigo = codigo; this.nome = nome; this.preco = preco; this.estoque = estoque;
        this.ativo = true; this.motivoInativacao = "";
    }
    String codigo() { return codigo; }
    String nome() { return nome; }
    BigDecimal preco() { return preco; }
    int estoque() { return estoque; }
    boolean ativo() { return ativo; }
    boolean temEstoque() { return estoque > 0; }
    boolean disponivelParaVenda() { return ativo && temEstoque(); }
    void reporEstoque(int quantidade) {
        if (quantidade <= 0) throw new IllegalArgumentException("Reposição deve ser positiva.");
        estoque += quantidade;
    }
    boolean vender(int quantidade) {
        if (quantidade <= 0) throw new IllegalArgumentException("Venda deve ser positiva.");
        if (!disponivelParaVenda() || quantidade > estoque) return false;
        estoque -= quantidade; return true;
    }
    void inativar(String motivo) {
        if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo obrigatório.");
        ativo = false; motivoInativacao = motivo;
    }
    void reativar() { ativo = true; motivoInativacao = ""; }
    String resumo() { return codigo + " | " + nome + " | " + preco + " | Estoque: " + estoque + " | Ativo: " + ativo; }
}`;

const DTO_SOURCE = `public class DtoVersusDominio {
    public static void main(String[] args) {
        ClienteRequest request = new ClienteRequest();
        request.setNome("Ana Silva"); request.setEmail("ana@email.com");
        ClienteDominio cliente = ClienteDominio.criar(request.getNome(), request.getEmail());
        System.out.println("DTO recebido: " + request.getNome());
        System.out.println("Domínio válido: " + cliente.resumo());
        try { ClienteDominio.criar("", request.getEmail()); }
        catch (IllegalArgumentException erro) { System.out.println("Falha esperada: " + erro.getMessage()); }
    }
}
class ClienteRequest {
    private String nome; private String email;
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
class ClienteDominio {
    private final String nome; private final String email;
    private ClienteDominio(String nome, String email) { this.nome = nome; this.email = email; }
    static ClienteDominio criar(String nome, String email) {
        if (nome == null || nome.isBlank() || email == null || email.isBlank())
            throw new IllegalArgumentException("Dados obrigatórios.");
        return new ClienteDominio(nome, email);
    }
    String resumo() { return nome + " | " + email; }
}`;

const OS_SOURCE = `import java.time.LocalDate;
public class OrdemServicoSemSettersLivres {
    public static void main(String[] args) {
        OrdemServicoComAcoes os = new OrdemServicoComAcoes("OS-001", "Ana", LocalDate.now().plusDays(1));
        os.reagendar(LocalDate.now().plusDays(3));
        System.out.println(os.resumo());
        os.concluir();
        System.out.println(os.resumo());
        try { os.reagendar(LocalDate.now().plusDays(4)); }
        catch (IllegalStateException erro) { System.out.println("Falha esperada: " + erro.getMessage()); }
        try { new OrdemServicoComAcoes("OS-002", "Bia", LocalDate.now()).cancelar(""); }
        catch (IllegalArgumentException erro) { System.out.println("Motivo recusado: " + erro.getMessage()); }
    }
}
enum StatusOsCriterio { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
class OrdemServicoComAcoes {
    private final String certificado;
    private final String cliente;
    private StatusOsCriterio status;
    private LocalDate dataAgendamento;
    private int quantidadeReagendamentos;
    private String motivoCancelamento;
    OrdemServicoComAcoes(String certificado, String cliente, LocalDate data) {
        if (certificado == null || certificado.isBlank() || cliente == null || cliente.isBlank() || data == null)
            throw new IllegalArgumentException("Dados obrigatórios.");
        this.certificado = certificado; this.cliente = cliente; this.dataAgendamento = data;
        this.status = StatusOsCriterio.AGENDADA; this.motivoCancelamento = "";
    }
    boolean encerrada() { return status == StatusOsCriterio.CONCLUIDA || status == StatusOsCriterio.CANCELADA; }
    void reagendar(LocalDate novaData) {
        if (encerrada()) throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        if (novaData == null) throw new IllegalArgumentException("Nova data obrigatória.");
        dataAgendamento = novaData; quantidadeReagendamentos++; status = StatusOsCriterio.REAGENDADA;
    }
    void concluir() {
        if (status == StatusOsCriterio.CANCELADA) throw new IllegalStateException("OS cancelada não conclui.");
        status = StatusOsCriterio.CONCLUIDA;
    }
    void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo obrigatório.");
        if (status == StatusOsCriterio.CONCLUIDA) throw new IllegalStateException("OS concluída não cancela.");
        status = StatusOsCriterio.CANCELADA; motivoCancelamento = motivo;
    }
    String resumo() { return certificado + " | " + cliente + " | " + status + " | " + dataAgendamento
            + " | Reagendamentos: " + quantidadeReagendamentos + " | Motivo: " + motivoCancelamento; }
}`;

const TEST_SOURCE = `import java.time.LocalDate;
public class TesteGettersSettersCriterio {
    public static void main(String[] args) {
        OsTeste os = new OsTeste(LocalDate.now());
        os.reagendar(LocalDate.now().plusDays(1));
        assertEquals("REAGENDADA", os.status(), "reagenda");
        assertEquals(1, os.quantidade(), "incrementa");
        os.concluir();
        assertTrue(os.encerrada(), "encerra");
        expectState(() -> os.reagendar(LocalDate.now()), "não reagenda concluída");
        OsTeste outra = new OsTeste(LocalDate.now());
        expectArgument(() -> outra.cancelar(""), "motivo vazio");
        outra.cancelar("duplicidade");
        assertEquals("CANCELADA", outra.status(), "cancela");
        assertTrue(outra.encerrada(), "cancelada encerra");
        System.out.println("7 testes passaram");
    }
    static void expectState(Runnable acao, String caso) { try { acao.run(); throw new AssertionError(caso); } catch (IllegalStateException esperado) { } }
    static void expectArgument(Runnable acao, String caso) { try { acao.run(); throw new AssertionError(caso); } catch (IllegalArgumentException esperado) { } }
    static void assertTrue(boolean atual, String caso) { if (!atual) throw new AssertionError(caso); }
    static void assertEquals(Object esperado, Object atual, String caso) { if (!esperado.equals(atual)) throw new AssertionError(caso); }
}
class OsTeste {
    private String status = "AGENDADA"; private LocalDate data; private int quantidade;
    OsTeste(LocalDate data) { this.data = data; }
    void reagendar(LocalDate novaData) { if (encerrada()) throw new IllegalStateException(); if (novaData == null) throw new IllegalArgumentException(); data = novaData; quantidade++; status = "REAGENDADA"; }
    void concluir() { if (status.equals("CANCELADA")) throw new IllegalStateException(); status = "CONCLUIDA"; }
    void cancelar(String motivo) { if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException(); if (status.equals("CONCLUIDA")) throw new IllegalStateException(); status = "CANCELADA"; }
    boolean encerrada() { return status.equals("CONCLUIDA") || status.equals("CANCELADA"); }
    String status() { return status; } int quantidade() { return quantidade; }
}`;

const ERRORS = [
  ['Gerar getter e setter automaticamente', 'A ferramenta decide a superfície pública sem conhecer o domínio.', 'Audite cada campo e exponha somente uma necessidade real.'],
  ['Confundir private + setter com proteção', 'A escrita indireta ainda aceita estado inválido.', 'Substitua a mutação livre por operação que preserve regra.'],
  ['Usar setStatus', 'O consumidor pode pular etapas da máquina de estado.', 'Nomeie aprovar, confirmar, concluir ou cancelar.'],
  ['Usar setAtivo', 'Um boolean não registra motivo nem efeitos relacionados.', 'Use inativar(motivo) e reativar().'],
  ['Usar setEstoque', 'A quantidade muda sem explicar entrada ou saída.', 'Use vender e reporEstoque com validação.'],
  ['Confundir DTO e domínio', 'A conveniência do framework enfraquece a entidade.', 'Converta transporte simples em domínio protegido na fronteira.'],
  ['Expor detalhe interno', 'Getter público aumenta acoplamento sem consumidor legítimo.', 'Mantenha o dado privado ou exponha uma pergunta de negócio.'],
  ['Retornar mutável interno', 'A coleção original pode ser alterada por fora.', 'Devolva visão segura ou ofereça adicionar/remover com regra.'],
];

const EVIDENCE = `# Aula 112 — Getters, setters e critério
- [ ] Classifiquei leitura, escrita e operação de domínio
- [ ] Executei o Pagamento com setters livres
- [ ] Protegi as transições do Pagamento
- [ ] Comparei JavaBean e nomes diretos
- [ ] Testei ações do Cliente
- [ ] Identifiquei vazamento por getter mutável
- [ ] Executei o Produto sem setters livres
- [ ] Separei DTO e domínio
- [ ] Refatorei cinco setters mentalmente
- [ ] Depurei oito pontos da mudança
- [ ] Entreguei a OS, sete testes e commit limpo`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? 'Copiado' : 'Copiar'}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

function DecisionLab() {
  const [selected, setSelected] = useState(0);
  const members = [
    ['codigo', 'Leitura', 'codigo()', 'outras camadas precisam identificar'],
    ['tentativasInternas', 'Esconder', 'nenhum método público', 'é detalhe de implementação'],
    ['status', 'Pergunta', 'status() / confirmado()', 'consulta sem permitir transição'],
    ['saldo', 'Operações', 'depositar() / sacar()', 'mudança tem invariantes'],
    ['ativo', 'Operações', 'inativar(motivo) / reativar()', 'mudança expressa um evento'],
  ];
  const current = members[selected];
  return <section className="gs112-stack"><div className="gs112-audit"><nav>{members.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]}</code></button>)}</nav><main><small>DECISÃO {selected + 1} DE {members.length}</small><strong>{current[1]}</strong><code>{current[2]}</code><p>{current[3]}.</p></main></div><div className="gs112-principle"><ShieldCheck /><div><strong>Getter e setter são ferramentas, não obrigação</strong><span>Comece pela necessidade do consumidor e pela regra da mudança — nunca pelo botão “Generate”.</span></div></div></section>;
}

function BadPaymentLab() {
  const [value, setValue] = useState(150);
  const [status, setStatus] = useState('PENDENTE');
  const invalid = value <= 0 || status === 'CONFIRMADO';
  return <section className="gs112-stack"><div className="gs112-bad-payment"><div><label>setValor<input type="number" value={value} onChange={event => setValue(Number(event.target.value))} /></label><label>setStatus<select value={status} onChange={event => setStatus(event.target.value)}><option>PENDENTE</option><option>APROVADO</option><option>CONFIRMADO</option><option>CANCELADO</option></select></label></div><article className={invalid ? 'invalid' : ''}><small>O COMPILADOR ACEITOU</small><strong>PAG-001 · {value.toFixed(2)} · {status}</strong><span>{invalid ? 'O domínio ficou inconsistente.' : 'Estado tecnicamente possível.'}</span></article></div><CodePanel name="PagamentoComSettersLivres.java" code={BAD_PAYMENT_SOURCE} /><div className="gs112-terminal"><header><Terminal size={15} />Saída que prova o defeito</header><pre>Inicial: PAG-001 | 150.00 | PENDENTE{`\n`}Indevido: PAG-001 | -500.00 | CONFIRMADO</pre></div></section>;
}

function GoodPaymentLab() {
  const [status, setStatus] = useState('PENDENTE');
  const [message, setMessage] = useState('Pagamento criado pelo construtor');
  const act = action => {
    if (action === 'aprovar') { if (status !== 'PENDENTE') return setMessage('IllegalStateException: somente PENDENTE aprova'); setStatus('APROVADO'); setMessage('aprovar() preservou a transição'); }
    if (action === 'confirmar') { if (status !== 'APROVADO') return setMessage('IllegalStateException: somente APROVADO confirma'); setStatus('CONFIRMADO'); setMessage('confirmar() preservou a transição'); }
    if (action === 'cancelar') { if (status === 'CONFIRMADO') return setMessage('IllegalStateException: CONFIRMADO não cancela'); setStatus('CANCELADO'); setMessage('cancelar(motivo) aceito'); }
  };
  return <section className="gs112-stack"><div className="gs112-machine"><div><span className={status === 'PENDENTE' ? 'active' : ''}>PENDENTE</span><ArrowRight /><span className={status === 'APROVADO' ? 'active' : ''}>APROVADO</span><ArrowRight /><span className={status === 'CONFIRMADO' ? 'active' : ''}>CONFIRMADO</span><span className={status === 'CANCELADO' ? 'active' : ''}>CANCELADO</span></div><article><small>ESTADO PROTEGIDO</small><strong>{status}</strong><code>{message}</code><div><button type="button" onClick={() => act('aprovar')}>aprovar()</button><button type="button" onClick={() => act('confirmar')}>confirmar()</button><button type="button" onClick={() => act('cancelar')}>cancelar(motivo)</button></div></article></div><CodePanel name="PagamentoComCriterio.java" code={GOOD_PAYMENT_SOURCE} /></section>;
}

function NamingLab() {
  const [style, setStyle] = useState('bean');
  const [setter, setSetter] = useState(0);
  const setterCases = [
    ['setEmail(novo)', 'valida formato, mas ainda descreve mecanismo'],
    ['alterarEmail(novo)', 'expressa ação e abre espaço para auditoria'],
    ['setAtivo(false)', 'perde motivo e intenção'],
    ['inativar(motivo)', 'registra o evento e protege efeitos relacionados'],
  ];
  return <section className="gs112-stack"><div className="gs112-toggle"><button type="button" className={style === 'bean' ? 'active' : ''} onClick={() => setStyle('bean')}>Estilo JavaBean</button><button type="button" className={style === 'direct' ? 'active' : ''} onClick={() => setStyle('direct')}>Estilo direto</button></div><div className="gs112-names"><section><small>LEITURA DE TEXTO</small><code>{style === 'bean' ? 'String getNome()' : 'String nome()'}</code></section><section><small>LEITURA BOOLEANA</small><code>{style === 'bean' ? 'boolean isAtivo()' : 'boolean ativo()'}</code></section><section><small>PERGUNTA DE DOMÍNIO</small><code>boolean podeConfirmar()</code></section></div><div className="gs112-setter-compare"><nav>{setterCases.map((item, index) => <button type="button" key={item[0]} className={setter === index ? 'active' : ''} onClick={() => setSetter(index)}><code>{item[0]}</code></button>)}</nav><main><strong>{setterCases[setter][0]}</strong><p>{setterCases[setter][1]}.</p></main></div><div className="gs112-principle"><Workflow /><div><strong>Conheça a convenção; siga o contrato do projeto</strong><span>JavaBean é comum em frameworks e DTOs. No domínio, nomes diretos e ações expressivas podem comunicar melhor.</span></div></div></section>;
}

function ClientLab() {
  const [email, setEmail] = useState('ana@email.com');
  const [phone, setPhone] = useState('11999999999');
  const [active, setActive] = useState(true);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('Cliente criado');
  const alterEmail = () => { if (!email.trim()) return setMessage('IllegalArgumentException: novo e-mail obrigatório'); setMessage('alterarEmail() aceito'); };
  const inactivate = () => { const next = reason.trim() || 'Solicitação do cliente'; setReason(next); setActive(false); setMessage('inativar(motivo) atualizou dois campos juntos'); };
  const reactivate = () => { setActive(true); setReason(''); setMessage('reativar() limpou o motivo'); };
  return <section className="gs112-stack"><div className="gs112-client"><div><label>Novo e-mail<input value={email} onChange={event => setEmail(event.target.value)} /></label><label>Telefone<input value={phone} onChange={event => setPhone(event.target.value)} /></label><div><button type="button" onClick={alterEmail}>alterarEmail</button><button type="button" onClick={inactivate}>inativar</button><button type="button" onClick={reactivate}>reativar</button></div></div><article><small>ANA SILVA</small><strong>{active ? 'ATIVA' : 'INATIVA'}</strong><code>{email} · {phone}</code><span>motivo: {reason || '—'}</span><p>{message}</p></article></div><CodePanel name="ClienteGetSetComCriterio.java" code={CLIENT_SOURCE} /></section>;
}

function MutableGetterLab() {
  const [items, setItems] = useState(['Teclado', 'Mouse']);
  const [stock, setStock] = useState(10);
  const [active, setActive] = useState(true);
  const leak = () => setItems([]);
  const sell = quantity => { if (!active || quantity <= 0 || quantity > stock) return; setStock(value => value - quantity); };
  return <section className="gs112-stack"><div className="gs112-leak"><article><small>GETTER QUE VAZA A LISTA ORIGINAL</small><strong>pedido.itens() → [{items.join(', ')}]</strong><button type="button" onClick={leak}>pedido.itens().clear()</button><span>{items.length ? 'O estado ainda existe.' : 'O consumidor apagou tudo sem regra.'}</span></article><ArrowRight /><article className="safe"><small>FRONTEIRA SEGURA</small><strong>adicionarItem / removerItem</strong><span>cópia, visão imutável ou operação controlada</span></article></div><div className="gs112-product"><article><small>PROD-001 · CADEIRA</small><strong>Estoque: {stock}</strong><span>{active ? 'ATIVO' : 'INATIVO'}</span></article><div><button type="button" onClick={() => setStock(value => value + 5)}>reporEstoque(5)</button><button type="button" onClick={() => sell(3)}>vender(3)</button><button type="button" onClick={() => setActive(false)}>inativar(motivo)</button><button type="button" onClick={() => setActive(true)}>reativar()</button></div></div><CodePanel name="ProdutoSemSettersLivres.java" code={PRODUCT_SOURCE} /></section>;
}

function BoundaryLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['JSON / formulário', 'nome e email chegam como dados'],
    ['ClienteRequest DTO', 'JavaBean pode facilitar transporte e framework'],
    ['Fronteira de conversão', 'validação chama ClienteDominio.criar(...)'],
    ['ClienteDominio', 'final, sem setters e sempre consistente'],
  ];
  const current = stages[stage];
  return <section className="gs112-stack"><div className="gs112-boundary"><nav>{stages.map((item, index) => <button type="button" key={item[0]} className={stage === index ? 'active' : ''} onClick={() => setStage(index)}><span>{index + 1}</span>{item[0]}</button>)}</nav><main><small>CAMADA {stage + 1}</small><strong>{current[0]}</strong><p>{current[1]}.</p><button type="button" disabled={stage === stages.length - 1} onClick={() => setStage(value => value + 1)}>Atravessar fronteira<ArrowRight size={15} /></button></main></div><CodePanel name="DtoVersusDominio.java" code={DTO_SOURCE} /><div className="gs112-principle"><Boxes /><div><strong>DTO e domínio têm responsabilidades diferentes</strong><span>A conveniência de entrada não precisa contaminar o modelo que protege regras.</span></div></div></section>;
}

function RefactorLab() {
  const [selected, setSelected] = useState(0);
  const mappings = [
    ['setStatus(CONCLUIDA)', 'concluir()', 'valida o estado anterior'],
    ['setStatus(CANCELADA)', 'cancelar(motivo)', 'exige motivo e bloqueia concluída'],
    ['setSaldo(valor)', 'depositar(valor) / sacar(valor)', 'preserva saldo não negativo'],
    ['setEstoque(valor)', 'reporEstoque(qtd) / vender(qtd)', 'explica entrada e saída'],
    ['setAtivo(false)', 'inativar(motivo)', 'registra por que mudou'],
    ['setDataAgendamento(data)', 'reagendar(novaData)', 'incrementa contador e muda status'],
  ];
  const current = mappings[selected];
  return <section className="gs112-stack"><div className="gs112-refactor"><nav>{mappings.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]}</code></button>)}</nav><main><section><small>MECANISMO GENÉRICO</small><code>{current[0]}</code></section><ArrowRight /><section><small>AÇÃO DO DOMÍNIO</small><strong>{current[1]}</strong><span>{current[2]}.</span></section></main></div><div className="gs112-questions">{['qual ação real?', 'qual regra?', 'quais campos mudam juntos?', 'qual falha informar?', 'setter é realmente livre?'].map((item, index) => <span key={item}><b>{index + 1}</b>{item}</span>)}</div></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [
    ['main', 'status = PENDENTE', 'antes de qualquer chamada'],
    ['aprovar', 'pendente() = true', 'pré-condição aceita'],
    ['aprovar', 'status = APROVADO', 'mudança protegida'],
    ['confirmar', 'aprovado() = true', 'pré-condição aceita'],
    ['confirmar', 'status = CONFIRMADO', 'segunda transição'],
    ['cancelar', 'confirmado() = true', 'regra bloqueia cancelamento'],
    ['cancelar', 'IllegalStateException', 'status permanece CONFIRMADO'],
    ['comparação', 'setStatus não existe', 'consumidor não consegue pular a regra'],
  ];
  const current = trace[pause];
  return <section className="gs112-stack"><div className="gs112-debug"><header><span>PagamentoComCriterio.java · Debug</span><span>Variables · Frames · F7</span></header><div><aside>{trace.map((item, index) => <button type="button" key={index} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>PAUSA {pause + 1} DE {trace.length}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}.</p><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => value + 1)}><StepForward size={15} />Próxima pausa</button></main></div><footer>Compare o estado antes, a validação, a atribuição e a exceção — não apenas a saída final.</footer></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors gs112-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [view, setView] = useState('contract');
  const [checked, setChecked] = useState([]);
  const checks = ['getter e setter classificados', 'pagamento ruim executado', 'pagamento protegido testado', 'estilos de leitura comparados', 'cliente alterado por ações', 'getter mutável diagnosticado', 'produto executado', 'DTO separado do domínio', 'seis setters refatorados', 'oito pausas depuradas', 'OS e 7 testes concluídos'];
  const commands = ['javac OrdemServicoSemSettersLivres.java', 'java OrdemServicoSemSettersLivres', 'javac TesteGettersSettersCriterio.java', 'java TesteGettersSettersCriterio', 'git status', 'git add labs/m4/aula-112-getters-setters-e-criterio', 'git commit -m "Aula 112: usa getters e setters com criterio"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="gs112-stack"><div className="gs112-toggle gs112-three"><button type="button" className={view === 'contract' ? 'active' : ''} onClick={() => setView('contract')}>Contrato da OS</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código</button><button type="button" className={view === 'tests' ? 'active' : ''} onClick={() => setView('tests')}>Testes</button></div>{view === 'code' ? <CodePanel name="OrdemServicoSemSettersLivres.java" code={OS_SOURCE} /> : view === 'tests' ? <CodePanel name="TesteGettersSettersCriterio.java" code={TEST_SOURCE} /> : <div className="gs112-contract"><section><small>PROIBIDOS</small><strong>setStatus · setData · setQuantidade · setMotivo</strong></section><section><small>OPERAÇÕES</small><strong>reagendar · concluir · cancelar</strong></section><section><small>CONSULTA</small><strong>encerrada · resumo</strong></section><section><small>INVARIANTES</small><strong>estado anterior · nova data · motivo obrigatório</strong></section></div>}<div className="gs112-terminal"><header><Play size={15} />Compilar, testar e versionar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}7 testes passaram</pre></div><div className="gs112-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral da modelagem</h3></div><ul><li>Qual getter tem consumidor legítimo?</li><li>Qual setter foi substituído por uma ação real?</li><li>Qual diferença justificou DTO simples e domínio protegido?</li><li>Qual estado inválido os testes tentaram produzir?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'decision', label: 'Auditoria da API', duration: '11 min', eyebrow: 'LER, ESCONDER OU PROTEGER', title: 'Decida a superfície pública antes de gerar métodos', blocks: [{ type: 'lead', text: 'Classifique cada campo pela necessidade externa e pela regra da mudança; getter e setter deixam de ser automáticos.' }, { type: 'decision' }] },
  { id: 'bad-payment', label: 'Setters Livres', duration: '16 min', eyebrow: 'JAVA COMPILA, DOMÍNIO QUEBRA', title: 'Produza valor negativo e confirmação sem aprovação', blocks: [{ type: 'lead', text: 'O laboratório mostra que private com setValor e setStatus apenas adiciona uma etapa sintática à escrita pública.' }, { type: 'bad-payment' }] },
  { id: 'good-payment', label: 'Pagamento Protegido', duration: '19 min', eyebrow: 'CONSTRUTOR, LEITURA E TRANSIÇÕES', title: 'Troque setters por aprovar, confirmar e cancelar', blocks: [{ type: 'lead', text: 'A máquina de estados diferencia consulta, operação aceita e exceção sem permitir que o consumidor pule etapas.' }, { type: 'good-payment' }] },
  { id: 'naming', label: 'JavaBean e Intenção', duration: '14 min', eyebrow: 'GET, IS, NOMES DIRETOS E AÇÕES', title: 'Conheça os dois estilos e escolha nomes que expliquem o uso', blocks: [{ type: 'lead', text: 'Convenção de framework e clareza de domínio podem coexistir quando a equipe entende o contrato de cada camada.' }, { type: 'naming' }] },
  { id: 'client', label: 'Cliente com Ações', duration: '17 min', eyebrow: 'ALTERAR, INATIVAR E REATIVAR', title: 'Faça o nome do método carregar regra e intenção', blocks: [{ type: 'lead', text: 'Alterar contato valida o novo dado; inativar exige motivo; reativar limpa o motivo relacionado.' }, { type: 'client' }] },
  { id: 'mutable-getter', label: 'Getter Mutável e Produto', duration: '18 min', eyebrow: 'VAZAMENTO DE CONTROLE E ESTOQUE', title: 'Perceba que até um getter pode furar o encapsulamento', blocks: [{ type: 'lead', text: 'Uma coleção original permite clear() por fora; o Produto demonstra consultas seguras e mudanças por vender, repor e inativar.' }, { type: 'mutable-getter' }] },
  { id: 'boundary', label: 'DTO vs Domínio', duration: '15 min', eyebrow: 'TRANSPORTE, CONVERSÃO E REGRA', title: 'Isole a conveniência do framework na fronteira', blocks: [{ type: 'lead', text: 'O DTO JavaBean transporta dados; a conversão constrói um domínio validado, final e sem setters livres.' }, { type: 'boundary' }] },
  { id: 'refactor', label: 'Refatorar Setters', duration: '13 min', eyebrow: 'MECANISMO GENÉRICO PARA AÇÃO REAL', title: 'Transforme seis setters em operações que contam a história', blocks: [{ type: 'lead', text: 'Status, saldo, estoque, atividade e agenda mudam por eventos reconhecíveis, não por atribuições genéricas.' }, { type: 'refactor' }] },
  { id: 'debug', label: 'Debug da Transição', duration: '14 min', eyebrow: 'ANTES, REGRA, ATRIBUIÇÃO E FALHA', title: 'Acompanhe oito pausas e prove que a exceção preserva o estado', blocks: [{ type: 'lead', text: 'O mock de IDE segue PENDENTE, APROVADO e CONFIRMADO, depois observa a tentativa de cancelamento recusada.' }, { type: 'debug' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'GERAÇÃO, SETTERS, DTO E VAZAMENTO', title: 'Diagnostique oito decisões que enfraquecem o modelo', blocks: [{ type: 'lead', text: 'Cada correção começa perguntando quem deve ler, quem pode mudar e qual operação preserva a consistência.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & OS', duration: '21 min', eyebrow: 'REAGENDAR, CONCLUIR, CANCELAR, TESTAR E GIT', title: 'Entregue uma ordem de serviço sem nenhum setter livre', blocks: [{ type: 'lead', text: 'A OS controla status, agenda, contador e motivo; sete testes tentam tanto o fluxo correto quanto as transições proibidas.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const map = { decision: DecisionLab, 'bad-payment': BadPaymentLab, 'good-payment': GoodPaymentLab, naming: NamingLab, client: ClientLab, 'mutable-getter': MutableGetterLab, boundary: BoundaryLab, refactor: RefactorLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = map[block.type];
  return Component ? <Component /> : null;
}

export default function GuidedGettersSettersLesson112({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => { const active = navRef.current?.querySelector('button.active'); if (active && window.matchMedia('(max-width: 900px)').matches) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]);
  const step = steps[activeIndex];
  const stepDone = completedSteps.has(step.id);
  const allStepsDone = completedSteps.size === steps.length;
  const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); };
  return <article className="guided-git-lesson guided-getters-setters-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><LockKeyhole size={17} />Oficina de desenho da API</span><p className="guided-sequence">112 · M4.08</p><h1>Não gere acesso automático; projete leitura e mudança com critério</h1><p>Quebre setters livres, compare JavaBean e nomes diretos, proteja Pagamento, Cliente, Produto e OS, identifique getters mutáveis e separe DTO de domínio.</p></div><div className="guided-hero-status"><Workflow size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 112" items={[{ value: '7 fontes', label: 'Compiladas e executadas' }, { value: '8 pausas', label: 'No debug da transição' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 112"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>API auditada e mudanças protegidas</h3><p>{lessonComplete ? 'Aula concluída: agora você pode avançar para imutabilidade aplicada.' : 'Execute a OS e os testes antes de concluir a aula.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 111</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Leitura, alteração, DTO, domínio e transições</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 113<ArrowRight size={17} /></button></footer></article>;
}
