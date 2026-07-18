import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy,
  FileCode2, KeyRound, ListChecks, LockKeyhole, Play, RotateCcw, ShieldCheck,
  Sparkles, StepForward, Terminal, Workflow,
} from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedTrueEncapsulationLesson.css';

const STORAGE_KEY = 'guided-true-encapsulation-lesson-111-progress';

const BAD_SOURCE = `import java.math.BigDecimal;
public class ContaSemEncapsulamento {
    public static void main(String[] args) {
        ContaAberta conta = new ContaAberta();
        conta.numero = "0001"; conta.titular = "Ana Silva";
        conta.saldo = new BigDecimal("100.00");
        System.out.println("Saldo inicial: " + conta.saldo);
        conta.saldo = new BigDecimal("-500.00");
        System.out.println("Saldo depois da alteração indevida: " + conta.saldo);
    }
}
class ContaAberta {
    public String numero;
    public String titular;
    public BigDecimal saldo;
}`;

const PRIVATE_SOURCE = `import java.math.BigDecimal;
public class ContaComAtributosPrivados {
    public static void main(String[] args) {
        ContaSomenteLeitura conta = new ContaSomenteLeitura(
                "0001", "Ana Silva", new BigDecimal("100.00"));
        System.out.println("Número: " + conta.numero());
        System.out.println("Titular: " + conta.titular());
        System.out.println("Saldo: " + conta.saldo());
    }
}
class ContaSomenteLeitura {
    private final String numero;
    private final String titular;
    private final BigDecimal saldo;
    ContaSomenteLeitura(String numero, String titular, BigDecimal saldo) {
        this.numero = numero; this.titular = titular; this.saldo = saldo;
    }
    String numero() { return numero; }
    String titular() { return titular; }
    BigDecimal saldo() { return saldo; }
}`;

const ACCOUNT_SOURCE = `import java.math.BigDecimal;
public class ContaEncapsulada {
    public static void main(String[] args) {
        ContaBancaria conta = new ContaBancaria("0001", "Ana Silva", new BigDecimal("100.00"));
        System.out.println(conta.resumo());
        conta.depositar(new BigDecimal("50.00"));
        System.out.println("Depois do depósito: " + conta.resumo());
        System.out.println("Saque realizado: " + conta.sacar(new BigDecimal("30.00")));
        System.out.println("Saque grande realizado: " + conta.sacar(new BigDecimal("1000.00")));
        System.out.println("Saldo final: " + conta.saldo());
    }
}
class ContaBancaria {
    private final String numero;
    private final String titular;
    private BigDecimal saldo;
    ContaBancaria(String numero, String titular, BigDecimal saldoInicial) {
        if (numero == null || numero.isBlank()) throw new IllegalArgumentException("Número obrigatório.");
        if (titular == null || titular.isBlank()) throw new IllegalArgumentException("Titular obrigatório.");
        if (saldoInicial == null || saldoInicial.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("Saldo inicial não pode ser negativo.");
        this.numero = numero; this.titular = titular; this.saldo = saldoInicial;
    }
    String numero() { return numero; }
    String titular() { return titular; }
    BigDecimal saldo() { return saldo; }
    void depositar(BigDecimal valor) {
        if (valorInvalido(valor)) throw new IllegalArgumentException("Depósito deve ser maior que zero.");
        saldo = saldo.add(valor);
    }
    boolean sacar(BigDecimal valor) {
        if (valorInvalido(valor)) throw new IllegalArgumentException("Saque deve ser maior que zero.");
        if (!saldoSuficiente(valor)) return false;
        saldo = saldo.subtract(valor); return true;
    }
    boolean saldoSuficiente(BigDecimal valor) { return saldo.compareTo(valor) >= 0; }
    String resumo() { return "Conta " + numero + " | Titular: " + titular + " | Saldo: " + saldo; }
    private boolean valorInvalido(BigDecimal valor) {
        return valor == null || valor.compareTo(BigDecimal.ZERO) <= 0;
    }
}`;

const OS_SOURCE = `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
public class OrdemServicoEncapsulada {
    public static void main(String[] args) {
        OrdemServicoMutavel os = new OrdemServicoMutavel(
                "OS-001", "Ana Silva", LocalDate.now().plusDays(1));
        LocalDate hoje = LocalDate.now();
        System.out.println(os.resumo(hoje));
        os.reagendar(LocalDate.now().plusDays(3));
        os.concluir();
        System.out.println(os.resumo(hoje));
        try { os.reagendar(LocalDate.now().plusDays(5)); }
        catch (IllegalStateException erro) { System.out.println("Erro ao reagendar: " + erro.getMessage()); }
    }
}
enum StatusOs { AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
class OrdemServicoMutavel {
    private final String certificado;
    private final String cliente;
    private StatusOs status;
    private LocalDate dataAgendamento;
    private int quantidadeReagendamentos;
    OrdemServicoMutavel(String certificado, String cliente, LocalDate data) {
        if (certificado == null || certificado.isBlank()) throw new IllegalArgumentException("Certificado obrigatório.");
        if (cliente == null || cliente.isBlank()) throw new IllegalArgumentException("Cliente obrigatório.");
        if (data == null) throw new IllegalArgumentException("Data obrigatória.");
        this.certificado = certificado; this.cliente = cliente; this.dataAgendamento = data;
        this.status = StatusOs.AGENDADA; this.quantidadeReagendamentos = 0;
    }
    boolean encerrada() { return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA; }
    boolean atrasada(LocalDate referencia) { return !encerrada() && dataAgendamento.isBefore(referencia); }
    long diasDeAtraso(LocalDate referencia) {
        return atrasada(referencia) ? ChronoUnit.DAYS.between(dataAgendamento, referencia) : 0;
    }
    void reagendar(LocalDate novaData) {
        if (encerrada()) throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        if (novaData == null || novaData.isBefore(LocalDate.now()))
            throw new IllegalArgumentException("Nova data deve ser atual ou futura.");
        dataAgendamento = novaData; quantidadeReagendamentos++; status = StatusOs.REAGENDADA;
    }
    void concluir() {
        if (status == StatusOs.CANCELADA) throw new IllegalStateException("OS cancelada não pode ser concluída.");
        status = StatusOs.CONCLUIDA;
    }
    void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo obrigatório.");
        if (status == StatusOs.CONCLUIDA) throw new IllegalStateException("OS concluída não pode ser cancelada.");
        status = StatusOs.CANCELADA;
    }
    String resumo(LocalDate referencia) {
        return "OS " + certificado + " | Cliente: " + cliente + " | Status: " + status
                + " | Data: " + dataAgendamento + " | Reagendamentos: "
                + quantidadeReagendamentos + " | Dias de atraso: " + diasDeAtraso(referencia);
    }
}`;

const PAYMENT_SOURCE = `import java.math.BigDecimal;
public class PagamentoEncapsulado {
    public static void main(String[] args) {
        PagamentoComEstado pagamento = new PagamentoComEstado(
                "PAG-001", new BigDecimal("250.00"), FormaPagamento.PIX);
        System.out.println(pagamento.resumo());
        pagamento.aprovar();
        System.out.println(pagamento.resumo());
        pagamento.confirmar();
        System.out.println(pagamento.resumo());
    }
}
enum FormaPagamento { PIX, CARTAO, BOLETO }
enum StatusPagamento { PENDENTE, APROVADO, CONFIRMADO, CANCELADO }
class PagamentoComEstado {
    private final String codigo;
    private final BigDecimal valor;
    private final FormaPagamento formaPagamento;
    private StatusPagamento status;
    PagamentoComEstado(String codigo, BigDecimal valor, FormaPagamento forma) {
        if (codigo == null || codigo.isBlank()) throw new IllegalArgumentException("Código obrigatório.");
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Valor inválido.");
        if (forma == null) throw new IllegalArgumentException("Forma obrigatória.");
        this.codigo = codigo; this.valor = valor; this.formaPagamento = forma;
        this.status = StatusPagamento.PENDENTE;
    }
    boolean pendente() { return status == StatusPagamento.PENDENTE; }
    boolean aprovado() { return status == StatusPagamento.APROVADO; }
    boolean confirmado() { return status == StatusPagamento.CONFIRMADO; }
    void aprovar() {
        if (!pendente()) throw new IllegalStateException("Somente pendente pode ser aprovado.");
        status = StatusPagamento.APROVADO;
    }
    void confirmar() {
        if (!aprovado()) throw new IllegalStateException("Somente aprovado pode ser confirmado.");
        status = StatusPagamento.CONFIRMADO;
    }
    void cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo obrigatório.");
        if (confirmado()) throw new IllegalStateException("Confirmado não pode ser cancelado.");
        status = StatusPagamento.CANCELADO;
    }
    String resumo() { return "Pagamento " + codigo + " | Valor: " + valor
            + " | Forma: " + formaPagamento + " | Status: " + status; }
}`;

const PRODUCT_SOURCE = `import java.math.BigDecimal;
public class ProdutoEncapsulado {
    public static void main(String[] args) {
        ProdutoSeguro produto = new ProdutoSeguro("PRD-1", "Cadeira", new BigDecimal("100.00"), 5);
        System.out.println(produto.resumo());
        System.out.println("Venda: " + produto.vender(2));
        produto.reporEstoque(3);
        produto.inativar("Catálogo suspenso");
        System.out.println("Venda inativo: " + produto.vender(1));
        produto.ativar();
        System.out.println(produto.resumo());
    }
}
class ProdutoSeguro {
    private final String codigo;
    private final String nome;
    private final BigDecimal preco;
    private int estoque;
    private boolean ativo;
    ProdutoSeguro(String codigo, String nome, BigDecimal preco, int estoque) {
        if (codigo == null || codigo.isBlank()) throw new IllegalArgumentException("Código obrigatório.");
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome obrigatório.");
        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Preço inválido.");
        if (estoque < 0) throw new IllegalArgumentException("Estoque negativo.");
        this.codigo = codigo; this.nome = nome; this.preco = preco;
        this.estoque = estoque; this.ativo = true;
    }
    boolean vender(int quantidade) {
        validarQuantidade(quantidade);
        if (!ativo || estoque < quantidade) return false;
        estoque -= quantidade; return true;
    }
    void reporEstoque(int quantidade) { validarQuantidade(quantidade); estoque += quantidade; }
    void inativar(String motivo) {
        if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo obrigatório.");
        ativo = false;
    }
    void ativar() { ativo = true; }
    boolean disponivelParaVenda() { return ativo && estoque > 0; }
    BigDecimal valorTotalEmEstoque() { return preco.multiply(BigDecimal.valueOf(estoque)); }
    String resumo() { return codigo + " | " + nome + " | Estoque: " + estoque + " | Ativo: " + ativo; }
    private void validarQuantidade(int quantidade) {
        if (quantidade <= 0) throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
    }
}`;

const TEST_SOURCE = `import java.math.BigDecimal;
public class TesteEncapsulamento {
    public static void main(String[] args) {
        ProdutoTeste produto = new ProdutoTeste(5, true);
        assertTrue(produto.vender(2), "vende");
        assertEquals(3, produto.estoque(), "reduz estoque");
        assertFalse(produto.vender(4), "saldo insuficiente");
        produto.repor(2);
        assertEquals(5, produto.estoque(), "reposição");
        produto.inativar();
        assertFalse(produto.vender(1), "inativo");
        expectError(() -> produto.repor(0), "quantidade zero");
        assertEquals("500.00", produto.valor(new BigDecimal("100.00")).toPlainString(), "valor");
        System.out.println("7 testes passaram");
    }
    static void expectError(Runnable acao, String caso) {
        try { acao.run(); throw new AssertionError(caso); } catch (IllegalArgumentException esperado) { }
    }
    static void assertTrue(boolean atual, String caso) { if (!atual) throw new AssertionError(caso); }
    static void assertFalse(boolean atual, String caso) { assertTrue(!atual, caso); }
    static void assertEquals(Object esperado, Object atual, String caso) {
        if (!esperado.equals(atual)) throw new AssertionError(caso);
    }
}
class ProdutoTeste {
    private int estoque; private boolean ativo;
    ProdutoTeste(int estoque, boolean ativo) { this.estoque = estoque; this.ativo = ativo; }
    boolean vender(int quantidade) {
        if (quantidade <= 0) throw new IllegalArgumentException();
        if (!ativo || estoque < quantidade) return false;
        estoque -= quantidade; return true;
    }
    void repor(int quantidade) { if (quantidade <= 0) throw new IllegalArgumentException(); estoque += quantidade; }
    void inativar() { ativo = false; }
    int estoque() { return estoque; }
    BigDecimal valor(BigDecimal preco) { return preco.multiply(BigDecimal.valueOf(estoque)); }
}`;

const ERRORS = [
  ['private + getter/setter como fim', 'Campos estão privados, mas setters ainda aceitam qualquer estado.', 'Proteja regras e exponha operações com intenção.'],
  ['Setter para tudo', 'setSaldo, setStatus e setEstoque permitem pular transições.', 'Prefira sacar, concluir, reagendar, vender e reporEstoque.'],
  ['Estado mutável sem controle', 'Qualquer consumidor muda saldo ou status diretamente.', 'Mantenha o campo private e centralize a mudança.'],
  ['Regra pertencente fica fora', 'Saldo é subtraído em vários serviços diferentes.', 'Faça conta.sacar(valor) ser a única porta da regra.'],
  ['Infraestrutura dentro do objeto', 'Entidade salva banco ou chama API.', 'Encapsule domínio sem absorver persistência e integração.'],
  ['Método genérico', 'alterarStatus não revela concluir, cancelar ou reagendar.', 'Nomeie a transição que o domínio reconhece.'],
  ['Transição inválida permitida', 'Pagamento pula de PENDENTE para CONFIRMADO.', 'Cada operação valida o estado anterior permitido.'],
  ['Erro silencioso', 'Operação inválida não informa se falhou.', 'Retorne resultado claro ou lance exceção coerente.'],
];

const EVIDENCE = `# Aula 111 — Encapsulamento de verdade
- [ ] Comparei campo público, private e operação intencional
- [ ] Executei ContaSemEncapsulamento.java
- [ ] Executei ContaComAtributosPrivados.java
- [ ] Testei depósito, saque inválido e saldo insuficiente
- [ ] Auditei getters e setters necessários
- [ ] Testei transições da OS
- [ ] Testei transições do Pagamento
- [ ] Diferenciei final de mutável protegido
- [ ] Depurei estado antes/depois e exceção
- [ ] Modelei ProdutoEncapsulado.java
- [ ] Executei 7 testes e revisei git status`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? 'Copiado' : 'Copiar'}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

function LayersLab() {
  const [selected, setSelected] = useState(0);
  const layers = [
    ['Campo public', 'conta.saldo = -500', 'qualquer mudança entra'],
    ['private + setSaldo', 'conta.setSaldo(-500)', 'sintaxe mudou; regra continua aberta'],
    ['private + operação', 'conta.sacar(50)', 'objeto valida intenção e consistência'],
    ['API mínima', 'saldo(), depositar(), sacar()', 'expõe uso, esconde detalhes'],
  ];
  const current = layers[selected];
  return <section className="ec111-stack"><div className="ec111-layers"><nav>{layers.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span>{item[0]}</button>)}</nav><main><small>NÍVEL {selected + 1}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}.</p></main></div><div className="ec111-principle"><ShieldCheck /><div><strong>Encapsular é controlar mudança, não esconder por esconder</strong><span>O objeto preserva sua consistência e oferece uma API pública com operações reconhecíveis.</span></div></div></section>;
}

function BadAccountLab() {
  const [view, setView] = useState('bad');
  return <section className="ec111-stack"><div className="ec111-toggle"><button type="button" className={view === 'bad' ? 'active' : ''} onClick={() => setView('bad')}>Campo público</button><button type="button" className={view === 'private' ? 'active' : ''} onClick={() => setView('private')}>Primeiro passo: private</button></div>{view === 'bad' ? <CodePanel name="ContaSemEncapsulamento.java" code={BAD_SOURCE} /> : <CodePanel name="ContaComAtributosPrivados.java" code={PRIVATE_SOURCE} />}<div className="ec111-terminal"><header><Terminal size={15} />Evidência comparável</header><pre>{view === 'bad' ? 'Saldo inicial: 100.00\nSaldo depois da alteração indevida: -500.00' : 'Número: 0001\nTitular: Ana Silva\nSaldo: 100.00\n\nconta.saldo = ... → erro de compilação'}</pre></div></section>;
}

function AccountLab() {
  const [balance, setBalance] = useState(100);
  const [value, setValue] = useState(30);
  const [message, setMessage] = useState('Conta pronta');
  const deposit = () => { if (value <= 0) return setMessage('IllegalArgumentException: depósito deve ser positivo'); setBalance(b => b + value); setMessage('Depósito realizado'); };
  const withdraw = () => { if (value <= 0) return setMessage('IllegalArgumentException: saque deve ser positivo'); if (value > balance) return setMessage('false: saldo insuficiente'); setBalance(b => b - value); setMessage('true: saque realizado'); };
  return <section className="ec111-stack"><div className="ec111-account"><div><label>Valor da operação<input type="number" value={value} onChange={event => setValue(Number(event.target.value))} /></label><div><button type="button" onClick={deposit}>depositar</button><button type="button" onClick={withdraw}>sacar</button></div></div><article><small>CONTA 0001</small><strong>Saldo: {balance.toFixed(2)}</strong><code>{message}</code><span>não existe setSaldo</span></article></div><CodePanel name="ContaEncapsulada.java" code={ACCOUNT_SOURCE} /><div className="ec111-principle"><LockKeyhole /><div><strong>Três regras permanecem juntas</strong><span>Valor positivo, saldo suficiente e saldo nunca negativo são protegidos pelas únicas operações que alteram o campo.</span></div></div></section>;
}

function ApiLab() {
  const [selected, setSelected] = useState(0);
  const api = [
    ['saldo()', 'Expor', 'consulta necessária sem permitir alteração'], ['quantidadeTentativas()', 'Esconder', 'detalhe interno sem consumidor legítimo'], ['setSaldo(valor)', 'Recusar', 'abre uma mudança sem intenção'], ['depositar(valor)', 'Expor', 'operação real com regra'], ['setAtivo(false)', 'Substituir', 'prefira inativar(motivo)'], ['salvarNoBanco()', 'Fora', 'infraestrutura não pertence à entidade'],
  ];
  const current = api[selected];
  return <section className="ec111-stack"><div className="ec111-api"><nav>{api.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]}</code></button>)}</nav><main><small>DECISÃO DE API</small><strong>{current[1]}</strong><p>{current[2]}.</p></main></div><div className="ec111-questions">{['alteração é livre?', 'há regra?', 'setX expressa intenção?', 'deve ser getter?', 'detalhe pode ficar private?'].map((item, index) => <span key={item}><b>{index + 1}</b>{item}</span>)}</div></section>;
}

function OsLab() {
  const [status, setStatus] = useState('AGENDADA');
  const [reschedules, setReschedules] = useState(0);
  const [message, setMessage] = useState('OS criada');
  const act = action => {
    if (action === 'reagendar') { if (['CONCLUIDA', 'CANCELADA'].includes(status)) return setMessage('IllegalStateException: OS encerrada'); setStatus('REAGENDADA'); setReschedules(v => v + 1); setMessage('data + contador + status mudaram juntos'); }
    if (action === 'concluir') { if (status === 'CANCELADA') return setMessage('IllegalStateException: cancelada não conclui'); setStatus('CONCLUIDA'); setMessage('OS concluída'); }
    if (action === 'cancelar') { if (status === 'CONCLUIDA') return setMessage('IllegalStateException: concluída não cancela'); setStatus('CANCELADA'); setMessage('OS cancelada com motivo'); }
  };
  return <section className="ec111-stack"><div className="ec111-machine"><div><span>AGENDADA</span><ArrowRight /><span>REAGENDADA</span><ArrowRight /><span>CONCLUIDA</span><span>CANCELADA</span></div><article><small>ESTADO ATUAL</small><strong>{status}</strong><code>reagendamentos = {reschedules}</code><p>{message}</p><div><button type="button" onClick={() => act('reagendar')}>reagendar</button><button type="button" onClick={() => act('concluir')}>concluir</button><button type="button" onClick={() => act('cancelar')}>cancelar</button></div></article></div><CodePanel name="OrdemServicoEncapsulada.java" code={OS_SOURCE} /><div className="ec111-principle"><Workflow /><div><strong>Uma operação mantém atributos relacionados sincronizados</strong><span>reagendar altera data, contador e status; três setters separados permitiriam esquecer uma parte.</span></div></div></section>;
}

function PaymentLab() {
  const [status, setStatus] = useState('PENDENTE');
  const [message, setMessage] = useState('Pagamento criado');
  const transition = action => {
    if (action === 'aprovar') { if (status !== 'PENDENTE') return setMessage('Somente PENDENTE pode ser aprovado'); setStatus('APROVADO'); setMessage('Transição aceita'); }
    if (action === 'confirmar') { if (status !== 'APROVADO') return setMessage('Somente APROVADO pode ser confirmado'); setStatus('CONFIRMADO'); setMessage('Transição aceita'); }
    if (action === 'cancelar') { if (status === 'CONFIRMADO') return setMessage('CONFIRMADO não pode ser cancelado'); setStatus('CANCELADO'); setMessage('Cancelado com motivo'); }
  };
  return <section className="ec111-stack"><div className="ec111-payment"><article><small>PAG-001</small><strong>{status}</strong><code>{message}</code></article><div><button type="button" onClick={() => transition('aprovar')}>aprovar()</button><button type="button" onClick={() => transition('confirmar')}>confirmar()</button><button type="button" onClick={() => transition('cancelar')}>cancelar("motivo")</button></div></div><CodePanel name="PagamentoEncapsulado.java" code={PAYMENT_SOURCE} /></section>;
}

function MutabilityLab() {
  const [selected, setSelected] = useState(0);
  const items = [
    ['codigo', 'final', 'identidade não muda após criação'], ['valor', 'final', 'valor contratado permanece'], ['status', 'mutável protegido', 'muda apenas por aprovar, confirmar ou cancelar'], ['estoque', 'mutável protegido', 'muda apenas por vender ou repor'], ['textoInformado', 'método privado', 'detalhe interno não faz parte da API'], ['sacar', 'API intencional', 'centraliza regra e facilita teste'],
  ];
  const current = items[selected];
  return <section className="ec111-stack"><div className="ec111-mutability"><nav>{items.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]}</code></button>)}</nav><main><small>POLÍTICA</small><strong>{current[1]}</strong><p>{current[2]}.</p></main></div><div className="ec111-benefits"><span><ShieldCheck />consistência</span><span><KeyRound />API mínima</span><span><Workflow />regra centralizada</span><span><CheckCircle2 />teste direto</span></div></section>;
}

function CentralizationLab() {
  const [selected, setSelected] = useState(0);
  const doors = [
    ['Conta', 'sacar(valor)', 'valor positivo + saldo suficiente', 'saldo'],
    ['Ordem de serviço', 'reagendar(data)', 'estado aberto + data válida', 'data, contador e status'],
    ['Pagamento', 'confirmar()', 'status anterior = APROVADO', 'status'],
  ];
  const current = doors[selected];
  return <section className="ec111-stack"><div className="ec111-centralization"><nav>{doors.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{item[0]}</button>)}</nav><main><small>ÚNICA PORTA DE MUDANÇA</small><strong>{current[1]}</strong><div><span>Valida</span><code>{current[2]}</code></div><ArrowRight /><div><span>Altera junto</span><code>{current[3]}</code></div></main></div><div className="ec111-principle"><CheckCircle2 /><div><strong>Uma regra centralizada tem um ponto de manutenção e um teste direto</strong><span>O consumidor pede a operação; o objeto decide se a mudança preserva sua invariante.</span></div></div></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [
    ['main', 'saldo = 100.00', 'antes de depositar'], ['depositar', 'valor = 50.00', 'validação positiva'], ['depositar', 'saldo = saldo.add(valor)', '150.00'], ['sacar', 'valor = 30.00', 'saldo suficiente'], ['sacar', 'saldo = saldo.subtract(valor)', '120.00'], ['sacar', 'valor = 1000.00', 'saldo insuficiente'], ['sacar', 'return false', 'saldo continua 120.00'], ['depositar', 'valor = 0', 'IllegalArgumentException; saldo intacto'],
  ];
  const current = trace[pause];
  return <section className="ec111-stack"><div className="ec111-debug"><header><span>ContaEncapsulada.java · Debug</span><span>Variables · Frames · F7</span></header><div><aside>{trace.map((item, index) => <button type="button" key={index} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>PAUSA {pause + 1} DE {trace.length}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}</p><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => value + 1)}><StepForward size={15} />Próxima pausa</button></main></div><footer>Compare estado antes/depois, retorno false e exceção: todas as saídas preservam a invariante.</footer></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors ec111-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [view, setView] = useState('contract');
  const [checked, setChecked] = useState([]);
  const checks = ['quatro níveis comparados', 'conta pública executada', 'private sem setter explicado', 'depósito e saques testados', 'API auditada', 'transições da OS testadas', 'transições do Pagamento testadas', 'final e mutável protegidos classificados', 'oito pausas depuradas', 'Produto executado', '7 testes e Git concluídos'];
  const commands = ['javac ProdutoEncapsulado.java', 'java ProdutoEncapsulado', 'javac TesteEncapsulamento.java', 'java TesteEncapsulamento', 'git status', 'git add labs/m4/aula-111-encapsulamento-de-verdade', 'git commit -m "Aula 111: pratica encapsulamento de verdade"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="ec111-stack"><div className="ec111-toggle"><button type="button" className={view === 'contract' ? 'active' : ''} onClick={() => setView('contract')}>Contrato do Produto</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código</button><button type="button" className={view === 'tests' ? 'active' : ''} onClick={() => setView('tests')}>Testes</button></div>{view === 'code' ? <CodePanel name="ProdutoEncapsulado.java" code={PRODUCT_SOURCE} /> : view === 'tests' ? <CodePanel name="TesteEncapsulamento.java" code={TEST_SOURCE} /> : <div className="ec111-contract"><section><small>SEM SETTERS</small><strong>setEstoque · setAtivo · setPreco</strong></section><section><small>OPERAÇÕES</small><strong>vender · reporEstoque · inativar · ativar</strong></section><section><small>REGRAS</small><strong>quantidade positiva · ativo · estoque suficiente</strong></section><section><small>CONSULTAS</small><strong>disponivelParaVenda · valorTotalEmEstoque · resumo</strong></section></div>}<div className="ec111-terminal"><header><Play size={15} />Compilar, testar e versionar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}7 testes passaram</pre></div><div className="ec111-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral da API</h3></div><ul><li>Por que private com setter livre ainda é fraco?</li><li>Qual operação substitui setSaldo, setStatus e setEstoque?</li><li>Qual transição inválida o objeto impediu?</li><li>Qual detalhe permaneceu private porque não interessa ao consumidor?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'layers', label: 'Quatro Níveis de Proteção', duration: '10 min', eyebrow: 'PUBLIC, PRIVATE, SETTER E OPERAÇÃO', title: 'Veja por que esconder o campo é apenas o começo', blocks: [{ type: 'lead', text: 'Encapsulamento de verdade controla como o estado muda, protege regras e expõe somente operações com intenção.' }, { type: 'layers' }] },
  { id: 'bad-account', label: 'Conta Aberta vs Private', duration: '17 min', eyebrow: 'EVIDÊNCIA DE SALDO INVÁLIDO', title: 'Execute a quebra e depois bloqueie o acesso direto', blocks: [{ type: 'lead', text: 'Campo público aceita saldo negativo; private impede a escrita externa, mas ainda precisamos de uma forma correta de mudar.' }, { type: 'bad-account' }] },
  { id: 'account', label: 'Conta com Operações', duration: '20 min', eyebrow: 'DEPOSITAR, SACAR E SALDO SUFICIENTE', title: 'Faça a Conta controlar cada alteração do saldo', blocks: [{ type: 'lead', text: 'A simulação distingue exceção para valor inválido, false para saldo insuficiente e mutação segura para operação válida.' }, { type: 'account' }] },
  { id: 'api', label: 'Getters, Setters e API', duration: '13 min', eyebrow: 'EXPOR, ESCONDER, RECUSAR OU SUBSTITUIR', title: 'Projete a interface de uso em vez de gerar métodos automaticamente', blocks: [{ type: 'lead', text: 'Nem todo campo precisa de getter e quase nenhuma regra importante deveria virar setter livre.' }, { type: 'api' }] },
  { id: 'os', label: 'Transições da OS', duration: '20 min', eyebrow: 'REAGENDAR, CONCLUIR E CANCELAR', title: 'Mude três atributos juntos e bloqueie estados encerrados', blocks: [{ type: 'lead', text: 'A operação reagendar centraliza data, contador e status; concluir e cancelar protegem transições incompatíveis.' }, { type: 'os' }] },
  { id: 'payment', label: 'Transições do Pagamento', duration: '18 min', eyebrow: 'PENDENTE, APROVADO, CONFIRMADO E CANCELADO', title: 'Impeça que o status pule etapas', blocks: [{ type: 'lead', text: 'O status é mutável, mas só aprovar, confirmar e cancelar conseguem alterá-lo sob regras explícitas.' }, { type: 'payment' }] },
  { id: 'mutability', label: 'final, Mutável e private', duration: '12 min', eyebrow: 'POLÍTICA DE MUDANÇA E DETALHES INTERNOS', title: 'Diferencie imutabilidade de mutação protegida', blocks: [{ type: 'lead', text: 'Identidade e valor podem ser final; status e estoque mudam por operações; auxiliares permanecem private.' }, { type: 'mutability' }] },
  { id: 'debug', label: 'Debug da Mudança', duration: '14 min', eyebrow: 'ANTES, VALIDAÇÃO, DEPOIS, FALSE E EXCEÇÃO', title: 'Acompanhe quatro saídas sem quebrar a invariante', blocks: [{ type: 'lead', text: 'O mock mostra depósito, saque aceito, saque recusado e argumento inválido preservando o saldo.' }, { type: 'debug' }] },
  { id: 'centralization', label: 'Regra Centralizada', duration: '10 min', eyebrow: 'DUPLICAÇÃO, MANUTENÇÃO E TESTE', title: 'Use uma única porta para cada regra de mudança', blocks: [{ type: 'lead', text: 'conta.sacar(valor), os.reagendar(data) e pagamento.confirmar() reduzem duplicação e oferecem comportamentos diretos para teste.' }, { type: 'centralization' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'SETTERS, TRANSIÇÕES, REGRA E FRONTEIRA', title: 'Diagnostique oito formas de furar a proteção', blocks: [{ type: 'lead', text: 'Cada correção transforma acesso genérico em uma API menor, intencional e consistente.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Produto', duration: '20 min', eyebrow: 'VENDA, REPOSIÇÃO, ATIVAÇÃO, TESTES E GIT', title: 'Faça o Produto ser o único dono de estoque e disponibilidade', blocks: [{ type: 'lead', text: 'A entrega proíbe setters, valida quantidades e protege venda, reposição e ciclo ativo/inativo.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const map = { layers: LayersLab, 'bad-account': BadAccountLab, account: AccountLab, api: ApiLab, os: OsLab, payment: PaymentLab, mutability: MutabilityLab, debug: DebugLab, centralization: CentralizationLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = map[block.type];
  return Component ? <Component /> : null;
}

export default function GuidedTrueEncapsulationLesson111({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-true-encapsulation-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><LockKeyhole size={17} />Oficina de proteção do estado</span><p className="guided-sequence">111 · M4.07</p><h1>Não exponha campos; exponha operações que preservam regras</h1><p>Compare public, private e setters, controle saldo e estoque, proteja transições de OS e Pagamento e desenhe uma API mínima com intenção de domínio.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 111" items={[{ value: '7 fontes', label: 'Compiladas e testadas' }, { value: '8 pausas', label: 'No debug da mudança' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 111"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Estado protegido por uma API intencional</h3><p>{lessonComplete ? 'Aula concluída: agora você pode aprofundar getters e setters com critério.' : 'Execute as transições e prove as falhas antes de concluir.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 110</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>API, mudança, transição e consistência</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 112<ArrowRight size={17} /></button></footer></article>;
}
