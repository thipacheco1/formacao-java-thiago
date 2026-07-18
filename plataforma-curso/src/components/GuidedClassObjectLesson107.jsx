import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Box, Boxes, Check, CheckCircle2,
  CircleDot, Clock3, Code2, Copy, Database, FileCode2, GitBranch, ListChecks,
  MemoryStick, PackageCheck, Play, RotateCcw, Sparkles,
  StepForward, Terminal, Workflow,
} from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedClassObjectLesson.css';

const STORAGE_KEY = 'guided-class-object-lesson-107-progress';

const CLIENT_SOURCE = `public class ClientePrimeiroObjeto {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                "Ana Silva",
                "ana@email.com",
                "11999999999",
                true
        );

        System.out.println("Nome: " + cliente.nome());
        System.out.println("E-mail: " + cliente.email());
        System.out.println("Telefone: " + cliente.telefone());
        System.out.println("Ativo: " + cliente.ativo());
        System.out.println("Contato completo: " + cliente.contatoCompleto());
        System.out.println("Pode receber mensagem: " + cliente.podeReceberMensagem());
    }
}

class Cliente {
    private final String nome;
    private final String email;
    private final String telefone;
    private final boolean ativo;

    Cliente(String nome, String email, String telefone, boolean ativo) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.ativo = ativo;
    }

    String nome() { return nome; }
    String email() { return email; }
    String telefone() { return telefone; }
    boolean ativo() { return ativo; }

    boolean contatoCompleto() {
        return textoInformado(email) && textoInformado(telefone);
    }

    boolean podeReceberMensagem() {
        return ativo && textoInformado(telefone);
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}`;

const TWO_CLIENTS_SOURCE = `public class DoisClientes {
    public static void main(String[] args) {
        ClienteDois clienteAna = new ClienteDois(
                "Ana Silva", "ana@email.com", "11999999999", true);
        ClienteDois clienteCarlos = new ClienteDois(
                "Carlos Souza", "carlos@email.com", "", true);

        imprimirCliente(clienteAna);
        imprimirCliente(clienteCarlos);
    }

    static void imprimirCliente(ClienteDois cliente) {
        System.out.println("Nome: " + cliente.nome());
        System.out.println("Contato completo: " + cliente.contatoCompleto());
        System.out.println("Pode receber mensagem: " + cliente.podeReceberMensagem());
        System.out.println("------------------------------------");
    }
}

class ClienteDois {
    private final String nome;
    private final String email;
    private final String telefone;
    private final boolean ativo;

    ClienteDois(String nome, String email, String telefone, boolean ativo) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.ativo = ativo;
    }

    String nome() { return nome; }

    boolean contatoCompleto() {
        return textoInformado(email) && textoInformado(telefone);
    }

    boolean podeReceberMensagem() {
        return ativo && textoInformado(telefone);
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}`;

const OS_SOURCE = `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OrdemServicoObjeto {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                "OS-001", "Ana Silva", StatusOs.ABERTA,
                LocalDate.now().minusDays(6), 1);
        LocalDate hoje = LocalDate.now();

        System.out.println("Certificado: " + os.certificado());
        System.out.println("Cliente: " + os.cliente());
        System.out.println("Status: " + os.status());
        System.out.println("Dias em aberto: " + os.diasEmAberto(hoje));
        System.out.println("Atrasada: " + os.atrasada(hoje));
        System.out.println("Encerrada: " + os.encerrada());
        System.out.println("Fila: " + os.filaSugerida(hoje));
    }
}

enum StatusOs { ABERTA, AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
enum FilaAtendimento { ENTRADA, REAGENDAMENTO, CASOS_CRITICOS, SEM_FILA }

class OrdemServico {
    private final String certificado;
    private final String cliente;
    private final StatusOs status;
    private final LocalDate dataAbertura;
    private final int quantidadeReagendamentos;

    OrdemServico(String certificado, String cliente, StatusOs status,
            LocalDate dataAbertura, int quantidadeReagendamentos) {
        this.certificado = certificado;
        this.cliente = cliente;
        this.status = status;
        this.dataAbertura = dataAbertura;
        this.quantidadeReagendamentos = quantidadeReagendamentos;
    }

    String certificado() { return certificado; }
    String cliente() { return cliente; }
    StatusOs status() { return status; }

    long diasEmAberto(LocalDate dataReferencia) {
        long dias = ChronoUnit.DAYS.between(dataAbertura, dataReferencia);
        return Math.max(dias, 0);
    }

    boolean atrasada(LocalDate dataReferencia) {
        return diasEmAberto(dataReferencia) > 3;
    }

    boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
    }

    boolean precisaReagendamento() { return quantidadeReagendamentos >= 2; }

    FilaAtendimento filaSugerida(LocalDate dataReferencia) {
        if (encerrada()) return FilaAtendimento.SEM_FILA;
        if (atrasada(dataReferencia)) return FilaAtendimento.CASOS_CRITICOS;
        if (precisaReagendamento()) return FilaAtendimento.REAGENDAMENTO;
        return FilaAtendimento.ENTRADA;
    }
}`;

const ORDER_SOURCE = `import java.math.BigDecimal;

public class PedidoObjeto {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "Ana Silva", "Cadeira", new BigDecimal("199.90"), 2);

        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Válido: " + pedido.valido());
        System.out.println("Total bruto: " + pedido.totalBruto());
        System.out.println("Desconto: " + pedido.desconto());
        System.out.println("Total final: " + pedido.totalFinal());
    }
}

class Pedido {
    private final String cliente;
    private final String produto;
    private final BigDecimal precoUnitario;
    private final int quantidade;

    Pedido(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente;
        this.produto = produto;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    String cliente() { return cliente; }
    String produto() { return produto; }

    boolean valido() {
        return textoInformado(cliente) && textoInformado(produto)
                && precoUnitario != null
                && precoUnitario.compareTo(BigDecimal.ZERO) > 0
                && quantidade > 0;
    }

    BigDecimal totalBruto() {
        if (!valido()) return BigDecimal.ZERO;
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    BigDecimal desconto() {
        BigDecimal total = totalBruto();
        return total.compareTo(new BigDecimal("300.00")) >= 0
                ? total.multiply(new BigDecimal("0.10"))
                : BigDecimal.ZERO;
    }

    BigDecimal totalFinal() { return totalBruto().subtract(desconto()); }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}`;

const PAYMENT_SOURCE = `import java.math.BigDecimal;

public class PagamentoObjeto {
    public static void main(String[] args) {
        Pagamento pix = new Pagamento(
                "PAG-001", new BigDecimal("250.00"), FormaPagamento.PIX, true);
        Pagamento boleto = new Pagamento(
                "PAG-002", new BigDecimal("-10.00"), FormaPagamento.BOLETO, true);

        imprimir(pix);
        imprimir(boleto);
    }

    static void imprimir(Pagamento pagamento) {
        System.out.println(pagamento.descricao());
        System.out.println("Valor válido: " + pagamento.valorValido());
        System.out.println("Pode confirmar: " + pagamento.podeSerConfirmado());
        System.out.println("---");
    }
}

enum FormaPagamento { PIX, CARTAO, BOLETO }

class Pagamento {
    private final String codigo;
    private final BigDecimal valor;
    private final FormaPagamento formaPagamento;
    private final boolean aprovado;

    Pagamento(String codigo, BigDecimal valor,
            FormaPagamento formaPagamento, boolean aprovado) {
        this.codigo = codigo;
        this.valor = valor;
        this.formaPagamento = formaPagamento;
        this.aprovado = aprovado;
    }

    boolean valorValido() {
        return valor != null && valor.compareTo(BigDecimal.ZERO) > 0;
    }

    boolean podeSerConfirmado() { return aprovado && valorValido(); }

    String descricao() {
        return codigo + " | " + formaPagamento + " | R$ " + valor;
    }
}`;

const TEST_SOURCE = `import java.math.BigDecimal;

public class TesteClasseObjeto {
    public static void main(String[] args) {
        PagamentoTeste valido = new PagamentoTeste(
                "P-1", new BigDecimal("80.00"), true);
        PagamentoTeste invalido = new PagamentoTeste(
                "P-2", BigDecimal.ZERO, true);
        PagamentoTeste pendente = new PagamentoTeste(
                "P-3", new BigDecimal("30.00"), false);

        assertTrue(valido.valorValido(), "valor positivo");
        assertTrue(valido.podeSerConfirmado(), "aprovado e válido");
        assertFalse(invalido.valorValido(), "zero inválido");
        assertFalse(invalido.podeSerConfirmado(), "inválido não confirma");
        assertFalse(pendente.podeSerConfirmado(), "não aprovado não confirma");
        assertEquals("P-1", valido.codigo(), "estado do primeiro objeto");
        assertEquals("P-2", invalido.codigo(), "estado independente");
        System.out.println("7 testes passaram");
    }

    static void assertTrue(boolean atual, String caso) {
        if (!atual) throw new AssertionError(caso);
    }

    static void assertFalse(boolean atual, String caso) {
        assertTrue(!atual, caso);
    }

    static void assertEquals(Object esperado, Object atual, String caso) {
        if (!esperado.equals(atual)) throw new AssertionError(caso);
    }
}

class PagamentoTeste {
    private final String codigo;
    private final BigDecimal valor;
    private final boolean aprovado;

    PagamentoTeste(String codigo, BigDecimal valor, boolean aprovado) {
        this.codigo = codigo;
        this.valor = valor;
        this.aprovado = aprovado;
    }

    String codigo() { return codigo; }
    boolean valorValido() { return valor.compareTo(BigDecimal.ZERO) > 0; }
    boolean podeSerConfirmado() { return aprovado && valorValido(); }
}`;

const ERRORS = [
  ['Confundir classe e objeto', 'Tratar Cliente como se já fosse Ana, sem criar instância.', 'Classe define o molde; new Cliente(...) cria um objeto concreto.'],
  ['Ignorar o efeito de new', 'Dizer que new é apenas pontuação da linguagem.', 'Acompanhe alocação, construtor e referência até o objeto na memória.'],
  ['Construtor não inicializa estado', 'Parâmetros chegam, mas atributos continuam null ou zero.', 'Atribua cada parâmetro ao atributo correspondente com this.'],
  ['Classe sem comportamento', 'Dados ficam agrupados, mas regras continuam espalhadas no main.', 'Mova para o objeto as perguntas que dependem do próprio estado.'],
  ['Responsabilidade estrangeira', 'Cliente lê Scanner, salva banco ou imprime relatório.', 'Mantenha no objeto apenas estado e comportamento do seu conceito.'],
  ['Atributos públicos', 'Qualquer trecho altera nome, preço ou status sem controle.', 'Comece com private e exponha consultas ou operações intencionais.'],
  ['Static para tudo', 'O método recebe o objeto inteiro embora só use o estado dele.', 'Transforme em método de instância quando a resposta pertence àquele objeto.'],
  ['Referência confundida com objeto', 'Achar que clienteAna contém fisicamente todos os campos.', 'A variável guarda uma referência; o objeto e seu estado vivem na memória.'],
];

const EVIDENCE = `# Aula 107 — Classe e objeto em Java

- [ ] Expliquei classe, objeto, instância, new e referência
- [ ] Executei ClientePrimeiroObjeto.java
- [ ] Acompanhei construtor e this campo a campo
- [ ] Comparei atributo, parâmetro e variável local
- [ ] Provei que dois objetos têm estados independentes
- [ ] Executei OrdemServicoObjeto.java
- [ ] Executei PedidoObjeto.java
- [ ] Depurei construtor e métodos de instância
- [ ] Modelei e executei PagamentoObjeto.java
- [ ] Executei TesteClasseObjeto.java
- [ ] Revisei git status e arquivos .class`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

function ClassObjectMap() {
  const [selected, setSelected] = useState('ana');
  const objects = {
    ana: { ref: 'clienteAna', address: '@1a2b', nome: 'Ana Silva', email: 'ana@email.com', telefone: '11999999999', ativo: 'true' },
    carlos: { ref: 'clienteCarlos', address: '@7c9d', nome: 'Carlos Souza', email: 'carlos@email.com', telefone: '""', ativo: 'true' },
  };
  const current = objects[selected];
  return <section className="co107-stack"><div className="co107-memory-map"><article className="co107-blueprint"><header><Code2 />CLASSE · MOLDE</header><strong>Cliente</strong><div><small>ESTADO DEFINIDO</small><code>nome · email · telefone · ativo</code></div><div><small>COMPORTAMENTO DEFINIDO</small><code>contatoCompleto() · podeReceberMensagem()</code></div></article><div className="co107-new-arrow"><span>new Cliente(...)</span><ArrowRight /></div><article className="co107-heap"><header><MemoryStick />HEAP · OBJETOS REAIS</header><nav>{Object.entries(objects).map(([key, item]) => <button type="button" key={key} className={selected === key ? 'active' : ''} onClick={() => setSelected(key)}><span>{item.ref}</span><code>{item.address}</code></button>)}</nav><main><strong>{current.ref} → Cliente {current.address}</strong>{['nome', 'email', 'telefone', 'ativo'].map(field => <p key={field}><span>{field}</span><code>{current[field]}</code></p>)}</main></article></div><div className="co107-principle"><CircleDot /><div><strong>Uma classe; dois objetos; dois estados independentes</strong><span>A variável guarda a referência. Trocar a seleção mostra outro objeto criado pelo mesmo molde.</span></div></div></section>;
}

function FirstObjectLab() {
  const commands = ['mkdir labs\\m4\\aula-107-classe-e-objeto-em-java', 'cd labs\\m4\\aula-107-classe-e-objeto-em-java', 'javac ClientePrimeiroObjeto.java', 'java ClientePrimeiroObjeto'].join('\n');
  return <section className="co107-stack"><CodePanel name="ClientePrimeiroObjeto.java" code={CLIENT_SOURCE} /><div className="co107-terminal"><header><Terminal size={16} />PowerShell · primeira execução<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}Nome: Ana Silva{`\n`}E-mail: ana@email.com{`\n`}Telefone: 11999999999{`\n`}Ativo: true{`\n`}Contato completo: true{`\n`}Pode receber mensagem: true</pre></div><div className="co107-principle"><PackageCheck /><div><strong>Leia a expressão inteira da direita para a esquerda</strong><span>O construtor recebe quatro valores, new cria a instância e cliente passa a apontar para ela.</span></div></div></section>;
}

function ConstructionLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['1. Argumentos', '"Ana", "ana@email.com", "119...", true', 'Valores preparados no ponto da chamada.'],
    ['2. new', 'new Cliente(...)', 'Reserva memória para uma nova instância.'],
    ['3. Construtor', 'Cliente(String nome, ...)', 'Parâmetros locais recebem os argumentos.'],
    ['4. this', 'this.nome = nome', 'O campo deste objeto recebe o parâmetro nome.'],
    ['5. Referência', 'Cliente cliente = @1a2b', 'A variável passa a apontar para o objeto pronto.'],
  ];
  const current = stages[stage];
  return <section className="co107-stack"><div className="co107-construction"><nav>{stages.map((item, index) => <button type="button" key={item[0]} className={stage === index ? 'active' : stage > index ? 'done' : ''} onClick={() => setStage(index)}><span>{stage > index ? <Check size={13} /> : index + 1}</span>{item[0].replace(/^\d\. /, '')}</button>)}</nav><main><small>PASSO {stage + 1} DE {stages.length}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}</p><button type="button" disabled={stage === stages.length - 1} onClick={() => setStage(value => value + 1)}><StepForward size={15} />Avançar construção</button></main></div><div className="co107-this"><section><small>ATRIBUTO DO OBJETO</small><strong>this.nome</strong><span>vive enquanto o objeto existir</span></section><ArrowLeft /><section><small>PARÂMETRO DO CONSTRUTOR</small><strong>nome</strong><span>existe durante a chamada</span></section></div></section>;
}

function AnatomyLab() {
  const [selected, setSelected] = useState(0);
  const parts = [
    ['Atributo', 'private final String nome;', 'Estado que pertence a cada objeto.'],
    ['Construtor', 'Cliente(String nome) { ... }', 'Cria um objeto em estado inicial definido.'],
    ['this', 'this.nome = nome;', 'Diferencia o atributo do parâmetro de mesmo nome.'],
    ['Consulta', 'String nome() { return nome; }', 'Expõe uma informação sem abrir o campo.'],
    ['Comportamento', 'boolean podeReceberMensagem()', 'Responde usando o estado do próprio cliente.'],
  ];
  const current = parts[selected];
  return <section className="co107-stack"><div className="co107-anatomy"><nav>{parts.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{String(index + 1).padStart(2, '0')}</span>{item[0]}</button>)}</nav><main><small>{current[0].toUpperCase()}</small><code>{current[1]}</code><p>{current[2]}</p></main></div><div className="co107-behavior"><article><Database /><strong>Estado</strong><span>nome · email · telefone · ativo</span></article><ArrowRight /><article><Workflow /><strong>Comportamento</strong><span>contatoCompleto · podeReceberMensagem</span></article><ArrowRight /><article><CheckCircle2 /><strong>Resposta</strong><span>calculada para este objeto</span></article></div></section>;
}

function TwoObjectsLab() {
  const [view, setView] = useState('memory');
  return <section className="co107-stack"><div className="co107-toggle"><button type="button" className={view === 'memory' ? 'active' : ''} onClick={() => setView('memory')}>Memória e resultados</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>DoisClientes.java</button></div>{view === 'code' ? <CodePanel name="DoisClientes.java" code={TWO_CLIENTS_SOURCE} /> : <div className="co107-object-compare"><article><header>clienteAna · @1a2b</header><p><span>telefone</span><code>11999999999</code></p><p><span>contatoCompleto()</span><b>true</b></p><p><span>podeReceberMensagem()</span><b>true</b></p></article><article><header>clienteCarlos · @7c9d</header><p><span>telefone</span><code>""</code></p><p><span>contatoCompleto()</span><b>false</b></p><p><span>podeReceberMensagem()</span><b>false</b></p></article></div>}<div className="co107-principle"><Boxes /><div><strong>Mesmo código, respostas diferentes</strong><span>Cada chamada usa o estado alcançado por sua própria referência; um objeto não altera o outro.</span></div></div></section>;
}

function OsLab() {
  const [status, setStatus] = useState('ABERTA');
  const [days, setDays] = useState(6);
  const [reschedules, setReschedules] = useState(1);
  const closed = status === 'CONCLUIDA' || status === 'CANCELADA';
  const queue = closed ? 'SEM_FILA' : days > 3 ? 'CASOS_CRITICOS' : reschedules >= 2 ? 'REAGENDAMENTO' : 'ENTRADA';
  return <section className="co107-stack"><div className="co107-os-simulator"><div className="co107-controls"><label>Status<select value={status} onChange={event => setStatus(event.target.value)}><option>ABERTA</option><option>AGENDADA</option><option>REAGENDADA</option><option>CONCLUIDA</option><option>CANCELADA</option></select></label><label>Dias em aberto <b>{days}</b><input type="range" min="0" max="10" value={days} onChange={event => setDays(Number(event.target.value))} /></label><label>Reagendamentos <b>{reschedules}</b><input type="range" min="0" max="4" value={reschedules} onChange={event => setReschedules(Number(event.target.value))} /></label></div><div className="co107-os-object"><header><Box />OrdemServico · @0f31</header><p><span>status</span><code>{status}</code></p><p><span>diasEmAberto(hoje)</span><code>{days}</code></p><p><span>encerrada()</span><code>{String(closed)}</code></p><p><span>filaSugerida(hoje)</span><strong>{queue}</strong></p></div></div><CodePanel name="OrdemServicoObjeto.java" code={OS_SOURCE} /></section>;
}

function BoundariesLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    ['private final String nome', 'Atributo', 'pertence ao objeto e conserva estado'],
    ['String nome', 'Parâmetro', 'existe durante a chamada do construtor'],
    ['String convertido', 'Variável local', 'apoia temporariamente nomeMaiusculo()'],
    ['cliente.podeReceberMensagem()', 'Método de instância', 'depende de ativo e telefone daquele cliente'],
    ['static void imprimirMenu()', 'Método static', 'não depende do estado de uma instância'],
    ['private final', 'Encapsulamento + estabilidade', 'restringe acesso e impede reatribuição após o construtor'],
  ];
  const current = cases[selected];
  return <section className="co107-stack"><div className="co107-classifier"><nav>{cases.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]}</code></button>)}</nav><main><small>CLASSIFICAÇÃO</small><strong>{current[1]}</strong><p>{current[2]}.</p></main></div><div className="co107-principle"><GitBranch /><div><strong>Regra de decisão para static</strong><span>Se a resposta depende do estado de um objeto específico, o comportamento provavelmente pertence à instância.</span></div></div><div className="co107-not-yet"><strong>Agora não misture a base com:</strong>{['herança', 'interface', 'polimorfismo', 'Spring', 'JPA', 'repository', 'controller', 'service', 'Lombok'].map(item => <span key={item}>{item}</span>)}</div></section>;
}

function OrderLab() {
  const [price, setPrice] = useState('199.90');
  const [quantity, setQuantity] = useState(2);
  const numeric = Number(price) || 0;
  const valid = numeric > 0 && quantity > 0;
  const gross = valid ? numeric * quantity : 0;
  const discount = gross >= 300 ? gross * .1 : 0;
  return <section className="co107-stack"><div className="co107-order-lab"><div><label>Preço unitário<input value={price} onChange={event => setPrice(event.target.value)} inputMode="decimal" /></label><label>Quantidade<input type="number" min="0" value={quantity} onChange={event => setQuantity(Number(event.target.value))} /></label></div><article><small>PEDIDO · ESTADO → COMPORTAMENTO</small><p><span>valido()</span><code>{String(valid)}</code></p><p><span>totalBruto()</span><code>{gross.toFixed(2)}</code></p><p><span>desconto()</span><code>{discount.toFixed(2)}</code></p><p><span>totalFinal()</span><strong>{(gross - discount).toFixed(2)}</strong></p></article></div><CodePanel name="PedidoObjeto.java" code={ORDER_SOURCE} /></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [
    ['main', 'cliente = ainda sem referência', 'new Cliente(...)'],
    ['Cliente.<init>', 'nome = "Ana Silva"', 'parâmetros recebidos'],
    ['Cliente.<init>', 'this.nome = null', 'antes da atribuição'],
    ['Cliente.<init>', 'this.nome = "Ana Silva"', 'depois da atribuição'],
    ['Cliente.<init>', 'this.ativo = true', 'objeto inicializado'],
    ['main', 'cliente = Cliente@1a2b', 'referência devolvida'],
    ['podeReceberMensagem', 'this = Cliente@1a2b', 'ativo && telefone informado'],
    ['textoInformado', 'valor = "11999999999"', 'true'],
  ];
  const current = trace[pause];
  return <section className="co107-stack"><div className="co107-debug"><header><span>ClientePrimeiroObjeto.java · Debug</span><span>Variables · Frames · F7</span></header><div><aside>{trace.map((item, index) => <button type="button" key={index} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>PAUSA {pause + 1} DE {trace.length}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}</p><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => value + 1)}><StepForward size={15} />Próxima pausa</button></main></div><footer>Procure a mudança real: argumentos → parâmetros → this.campo → referência → método do objeto.</footer></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors co107-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [view, setView] = useState('contract');
  const [checked, setChecked] = useState([]);
  const checks = ['classe e objeto explicados', 'new e referência acompanhados', 'construtor e this depurados', 'atributos privados e final defendidos', 'dois estados independentes provados', 'OS executada em cenários distintos', 'Pedido recalculado', 'Pagamento modelado', 'PagamentoObjeto executado', '7 testes executados', 'git status e .class revisados'];
  const commands = ['javac PagamentoObjeto.java', 'java PagamentoObjeto', 'javac TesteClasseObjeto.java', 'java TesteClasseObjeto', 'git status', 'git add labs/m4/aula-107-classe-e-objeto-em-java', 'git commit -m "Aula 107: pratica classe e objeto em Java"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="co107-stack"><div className="co107-toggle"><button type="button" className={view === 'contract' ? 'active' : ''} onClick={() => setView('contract')}>Contrato do desafio</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código de referência</button></div>{view === 'code' ? <CodePanel name="PagamentoObjeto.java" code={PAYMENT_SOURCE} /> : <div className="co107-contract"><section><small>ATRIBUTOS</small><strong>codigo · valor · formaPagamento · aprovado</strong></section><section><small>COMPORTAMENTOS</small><strong>valorValido · podeSerConfirmado · descricao</strong></section><section><small>ENUM</small><strong>PIX · CARTAO · BOLETO</strong></section><section><small>CENÁRIOS</small><strong>válido e aprovado · inválido ou não aprovado</strong></section></div>}<CodePanel name="TesteClasseObjeto.java" code={TEST_SOURCE} /><div className="co107-terminal"><header><Play size={15} />Compilar, testar e versionar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}7 testes passaram</pre></div><div className="co107-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral do modelo</h3></div><ul><li>Qual é a diferença entre classe, objeto, instância e referência?</li><li>Em que ordem new, construtor e this participam da criação?</li><li>Por que dois objetos da mesma classe respondem de forma diferente?</li><li>Qual comportamento do Pagamento depende do próprio estado?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'map', label: 'Classe, Objeto e Memória', duration: '11 min', eyebrow: 'MOLDE, INSTÂNCIA, REFERÊNCIA E HEAP', title: 'Veja a classe produzir objetos com estados independentes', blocks: [{ type: 'lead', text: 'Classe define estrutura e comportamento; cada execução de new cria uma instância, e a variável guarda uma referência para ela.' }, { type: 'map' }] },
  { id: 'first', label: 'Primeiro Objeto', duration: '19 min', eyebrow: 'ARQUIVO COMPLETO, COMPILAÇÃO E SAÍDA', title: 'Digite, compile e leia o primeiro Cliente do início ao fim', blocks: [{ type: 'lead', text: 'Você não vai apenas copiar: localize classe, objeto, atributos, métodos, construtor, this e o resultado de cada chamada.' }, { type: 'first' }] },
  { id: 'construction', label: 'new, Construtor e this', duration: '14 min', eyebrow: 'DA CHAMADA AO OBJETO PRONTO', title: 'Acompanhe a criação campo por campo', blocks: [{ type: 'lead', text: 'Argumento, parâmetro e atributo podem ter o mesmo valor, mas ocupam papéis e tempos de vida diferentes.' }, { type: 'construction' }] },
  { id: 'anatomy', label: 'Estado e Comportamento', duration: '12 min', eyebrow: 'ATRIBUTO, CONSULTA E REGRA DO OBJETO', title: 'Faça cada parte da classe responder por uma ideia', blocks: [{ type: 'lead', text: 'O objeto não é apenas uma sacola de dados: comportamentos relacionados usam seu estado e devolvem respostas coerentes.' }, { type: 'anatomy' }] },
  { id: 'two', label: 'Duas Instâncias', duration: '14 min', eyebrow: 'MESMO MOLDE, ESTADOS E RESPOSTAS DIFERENTES', title: 'Prove que Ana e Carlos não compartilham atributos', blocks: [{ type: 'lead', text: 'As duas referências têm o mesmo tipo, mas apontam para objetos diferentes; cada chamada consulta o estado correto.' }, { type: 'two' }] },
  { id: 'os', label: 'Objeto com Regra', duration: '20 min', eyebrow: 'ORDEM DE SERVIÇO, TEMPO, STATUS E FILA', title: 'Coloque a regra perto do conceito que ela descreve', blocks: [{ type: 'lead', text: 'Altere estado e observe os métodos da mesma OrdemServico produzirem atraso, encerramento e fila sugerida.' }, { type: 'os' }] },
  { id: 'boundaries', label: 'Limites da Classe', duration: '13 min', eyebrow: 'ATRIBUTO, LOCAL, STATIC, PRIVATE E FINAL', title: 'Separe estado duradouro de detalhes temporários', blocks: [{ type: 'lead', text: 'Encapsulamento protege o estado; final evita reatribuição; método de instância usa aquele objeto; static não depende dele.' }, { type: 'boundaries' }] },
  { id: 'order', label: 'Pedido como Objeto', duration: '16 min', eyebrow: 'BIGDECIMAL, VALIDADE, DESCONTO E TOTAL', title: 'Recalcule um Pedido mudando apenas o estado de entrada', blocks: [{ type: 'lead', text: 'O mesmo padrão reaparece: construtor fixa o estado inicial e os métodos calculam respostas a partir dele.' }, { type: 'order' }] },
  { id: 'debug', label: 'Debug da Instância', duration: '14 min', eyebrow: 'ARGUMENTOS, THIS, FRAMES E REFERÊNCIA', title: 'Entre no construtor e veja o objeto nascer', blocks: [{ type: 'lead', text: 'A depuração torna concreto o caminho que costuma ficar invisível: valores chegam, campos mudam e a referência retorna ao main.' }, { type: 'debug' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'MOLDE, MEMÓRIA, RESPONSABILIDADE E ENCAPSULAMENTO', title: 'Diagnostique oito confusões antes de avançar', blocks: [{ type: 'lead', text: 'Use sintoma, causa e correção para distinguir falhas de sintaxe de falhas no modelo mental.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Pagamento', duration: '19 min', eyebrow: 'MODELO, IMPLEMENTAÇÃO, TESTES E GIT', title: 'Crie dois pagamentos e defenda cada decisão', blocks: [{ type: 'lead', text: 'A entrega confirma que você consegue transferir classe, objeto, new, estado, comportamento, construtor e this para um domínio novo.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'map') return <ClassObjectMap />;
  if (block.type === 'first') return <FirstObjectLab />;
  if (block.type === 'construction') return <ConstructionLab />;
  if (block.type === 'anatomy') return <AnatomyLab />;
  if (block.type === 'two') return <TwoObjectsLab />;
  if (block.type === 'os') return <OsLab />;
  if (block.type === 'boundaries') return <BoundariesLab />;
  if (block.type === 'order') return <OrderLab />;
  if (block.type === 'debug') return <DebugLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedClassObjectLesson107({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const validIds = new Set(steps.map(step => step.id));
      return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []);
    } catch { return new Set(); }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => {
    if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) {
      completionNormalizedRef.current = true;
      onToggleCompleted();
    }
  }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => {
    const active = navRef.current?.querySelector('button.active');
    if (active && window.matchMedia('(max-width: 900px)').matches) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);
  const step = steps[activeIndex];
  const stepDone = completedSteps.has(step.id);
  const allStepsDone = completedSteps.size === steps.length;
  const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const toggleStep = () => {
    if (stepDone && isCompleted) onToggleCompleted();
    setCompletedSteps(current => {
      const next = new Set(current);
      if (next.has(step.id)) next.delete(step.id); else next.add(step.id);
      return next;
    });
  };
  return <article className="guided-git-lesson guided-class-object-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Boxes size={17} />Laboratório de objetos em memória</span><p className="guided-sequence">107 · M4.03</p><h1>Uma classe define; cada new cria uma história própria</h1><p>Transforme o modelo em objetos reais, acompanhe construtor e this, compare estados independentes e coloque comportamento junto aos dados que ele interpreta.</p></div><div className="guided-hero-status"><MemoryStick size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 107" items={[{ value: '6 fontes', label: 'Executáveis e testadas' }, { value: '8 pausas', label: 'No debug da instância' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 107"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Objetos criados, observados e defendidos</h3><p>{lessonComplete ? 'Aula concluída: agora você pode aprofundar atributos com significado.' : 'Revise evidências e conclua a aula somente após executar os programas.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 106</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Classe, objeto, estado e comportamento</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 108<ArrowRight size={17} /></button></footer></article>;
}
