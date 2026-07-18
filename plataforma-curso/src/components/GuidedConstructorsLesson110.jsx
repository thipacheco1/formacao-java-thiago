import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, Box, Check, CheckCircle2,
  Clock3, Copy, DoorOpen, FileCode2, GitBranch, ListChecks, Play, RotateCcw,
  ShieldCheck, Sparkles, StepForward, Terminal,
} from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedConstructorsLesson.css';

const STORAGE_KEY = 'guided-constructors-lesson-110-progress';

const CLIENT_SOURCE = `public class ClienteConstrutorParametrizado {
    public static void main(String[] args) {
        ClienteParam cliente = new ClienteParam(
                "Ana Silva", "ana@email.com", "11999999999", true);
        System.out.println("Nome: " + cliente.nome());
        System.out.println("E-mail: " + cliente.email());
        System.out.println("Telefone: " + cliente.telefone());
        System.out.println("Ativo: " + cliente.ativo());
        System.out.println("Pode receber mensagem: " + cliente.podeReceberMensagem());
    }
}

class ClienteParam {
    private final String nome;
    private final String email;
    private final String telefone;
    private final boolean ativo;
    ClienteParam(String nome, String email, String telefone, boolean ativo) {
        this.nome = nome; this.email = email;
        this.telefone = telefone; this.ativo = ativo;
    }
    String nome() { return nome; }
    String email() { return email; }
    String telefone() { return telefone; }
    boolean ativo() { return ativo; }
    boolean podeReceberMensagem() { return ativo && telefone != null && !telefone.isBlank(); }
}`;

const DEFAULT_SOURCE = `public class ProdutoConstrutorPadrao {
    public static void main(String[] args) {
        ProdutoPadrao produto = new ProdutoPadrao();
        System.out.println("Produto criado.");
        System.out.println("Nome: " + produto.nome());
        System.out.println("Ativo: " + produto.ativo());
    }
}

class ProdutoPadrao {
    private String nome;
    private boolean ativo;
    ProdutoPadrao() {
        this.nome = "Produto sem nome";
        this.ativo = true;
    }
    String nome() { return nome; }
    boolean ativo() { return ativo; }
}`;

const ORDER_PARAM_SOURCE = `import java.math.BigDecimal;

public class PedidoConstrutorParametrizado {
    public static void main(String[] args) {
        PedidoParam pedido = new PedidoParam(
                "Ana Silva", "Cadeira", new BigDecimal("199.90"), 2);
        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Total bruto: " + pedido.totalBruto());
        System.out.println("Total final: " + pedido.totalFinal());
    }
}

class PedidoParam {
    private final String cliente;
    private final String produto;
    private final BigDecimal precoUnitario;
    private final int quantidade;
    PedidoParam(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente; this.produto = produto;
        this.precoUnitario = precoUnitario; this.quantidade = quantidade;
    }
    String cliente() { return cliente; }
    String produto() { return produto; }
    BigDecimal totalBruto() { return precoUnitario.multiply(BigDecimal.valueOf(quantidade)); }
    BigDecimal desconto() {
        return totalBruto().compareTo(new BigDecimal("300.00")) >= 0
                ? totalBruto().multiply(new BigDecimal("0.10")) : BigDecimal.ZERO;
    }
    BigDecimal totalFinal() { return totalBruto().subtract(desconto()); }
}`;

const ORDER_VALID_SOURCE = `import java.math.BigDecimal;

public class PedidoConstrutorComValidacao {
    public static void main(String[] args) {
        PedidoValidado pedido = new PedidoValidado(
                "Ana Silva", "Cadeira", new BigDecimal("199.90"), 2);
        System.out.println("Pedido criado.");
        System.out.println("Total final: " + pedido.totalFinal());
        try {
            new PedidoValidado("", "Cadeira", new BigDecimal("199.90"), 2);
        } catch (IllegalArgumentException erro) {
            System.out.println("Falha esperada: " + erro.getMessage());
        }
    }
}

class PedidoValidado {
    private final String cliente;
    private final String produto;
    private final BigDecimal precoUnitario;
    private final int quantidade;
    PedidoValidado(String cliente, String produto, BigDecimal precoUnitario, int quantidade) {
        if (!textoInformado(cliente)) throw new IllegalArgumentException("Cliente é obrigatório.");
        if (!textoInformado(produto)) throw new IllegalArgumentException("Produto é obrigatório.");
        if (precoUnitario == null || precoUnitario.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Preço unitário deve ser maior que zero.");
        if (quantidade <= 0) throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        this.cliente = cliente; this.produto = produto;
        this.precoUnitario = precoUnitario; this.quantidade = quantidade;
    }
    BigDecimal totalBruto() { return precoUnitario.multiply(BigDecimal.valueOf(quantidade)); }
    BigDecimal desconto() {
        return totalBruto().compareTo(new BigDecimal("300.00")) >= 0
                ? totalBruto().multiply(new BigDecimal("0.10")) : BigDecimal.ZERO;
    }
    BigDecimal totalFinal() { return totalBruto().subtract(desconto()); }
    private static boolean textoInformado(String valor) { return valor != null && !valor.isBlank(); }
}`;

const OVERLOAD_SOURCE = `public class ClienteConstrutoresSobrecarregados {
    public static void main(String[] args) {
        ClienteSobrecarregado ana = new ClienteSobrecarregado("Ana Silva", "ana@email.com");
        ClienteSobrecarregado carlos = new ClienteSobrecarregado(
                "Carlos Souza", "carlos@email.com", "11999999999", true);
        imprimir(ana);
        imprimir(carlos);
    }
    static void imprimir(ClienteSobrecarregado cliente) {
        System.out.println("Nome: " + cliente.nome());
        System.out.println("Telefone: " + cliente.telefone());
        System.out.println("Ativo: " + cliente.ativo());
        System.out.println("Pode receber mensagem: " + cliente.podeReceberMensagem());
        System.out.println("---");
    }
}

class ClienteSobrecarregado {
    private final String nome;
    private final String email;
    private final String telefone;
    private final boolean ativo;
    ClienteSobrecarregado(String nome, String email) {
        this(nome, email, "", true);
    }
    ClienteSobrecarregado(String nome, String email, String telefone, boolean ativo) {
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome é obrigatório.");
        if (email == null || email.isBlank()) throw new IllegalArgumentException("E-mail é obrigatório.");
        this.nome = nome; this.email = email; this.telefone = telefone; this.ativo = ativo;
    }
    String nome() { return nome; }
    String telefone() { return telefone; }
    boolean ativo() { return ativo; }
    boolean podeReceberMensagem() { return ativo && telefone != null && !telefone.isBlank(); }
}`;

const OS_SOURCE = `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OrdemServicoConstrutor {
    public static void main(String[] args) {
        OrdemServicoProtegida os = new OrdemServicoProtegida(
                "OS-001", "Ana Silva", StatusOs.ABERTA,
                LocalDate.now().minusDays(4), 1);
        LocalDate hoje = LocalDate.now();
        System.out.println("Certificado: " + os.certificado());
        System.out.println("Cliente: " + os.cliente());
        System.out.println("Status: " + os.status());
        System.out.println("Dias em aberto: " + os.diasEmAberto(hoje));
        System.out.println("Fila: " + os.filaSugerida(hoje));
    }
}

enum StatusOs { ABERTA, AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
enum FilaAtendimento { ENTRADA, REAGENDAMENTO, CASOS_CRITICOS, SEM_FILA }

class OrdemServicoProtegida {
    private final String certificado;
    private final String cliente;
    private final StatusOs status;
    private final LocalDate dataAbertura;
    private final int quantidadeReagendamentos;
    OrdemServicoProtegida(String certificado, String cliente, StatusOs status,
            LocalDate dataAbertura, int quantidadeReagendamentos) {
        if (!textoInformado(certificado)) throw new IllegalArgumentException("Certificado é obrigatório.");
        if (!textoInformado(cliente)) throw new IllegalArgumentException("Cliente é obrigatório.");
        if (status == null) throw new IllegalArgumentException("Status é obrigatório.");
        if (dataAbertura == null) throw new IllegalArgumentException("Data de abertura é obrigatória.");
        if (quantidadeReagendamentos < 0)
            throw new IllegalArgumentException("Quantidade de reagendamentos não pode ser negativa.");
        this.certificado = certificado; this.cliente = cliente; this.status = status;
        this.dataAbertura = dataAbertura; this.quantidadeReagendamentos = quantidadeReagendamentos;
    }
    String certificado() { return certificado; }
    String cliente() { return cliente; }
    StatusOs status() { return status; }
    long diasEmAberto(LocalDate referencia) {
        return Math.max(ChronoUnit.DAYS.between(dataAbertura, referencia), 0);
    }
    boolean encerrada() { return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA; }
    boolean atrasada(LocalDate referencia) { return diasEmAberto(referencia) > 3; }
    boolean precisaReagendamento() { return quantidadeReagendamentos >= 2; }
    FilaAtendimento filaSugerida(LocalDate referencia) {
        if (encerrada()) return FilaAtendimento.SEM_FILA;
        if (atrasada(referencia)) return FilaAtendimento.CASOS_CRITICOS;
        if (precisaReagendamento()) return FilaAtendimento.REAGENDAMENTO;
        return FilaAtendimento.ENTRADA;
    }
    private static boolean textoInformado(String valor) { return valor != null && !valor.isBlank(); }
}`;

const PAYMENT_SOURCE = `import java.math.BigDecimal;

public class PagamentoConstrutor {
    public static void main(String[] args) {
        PagamentoProtegido pagamento = new PagamentoProtegido(
                "PAG-001", new BigDecimal("150.00"), FormaPagamento.PIX, true);
        System.out.println(pagamento.descricao());
        System.out.println("Pode confirmar: " + pagamento.podeConfirmar());
        try {
            new PagamentoProtegido("", BigDecimal.ZERO, null, false);
        } catch (IllegalArgumentException erro) {
            System.out.println("Falha esperada: " + erro.getMessage());
        }
    }
}

enum FormaPagamento { PIX, CARTAO, BOLETO }

class PagamentoProtegido {
    private final String codigo;
    private final BigDecimal valor;
    private final FormaPagamento formaPagamento;
    private final boolean aprovado;
    PagamentoProtegido(String codigo, BigDecimal valor,
            FormaPagamento formaPagamento, boolean aprovado) {
        if (codigo == null || codigo.isBlank()) throw new IllegalArgumentException("Código é obrigatório.");
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0)
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        if (formaPagamento == null) throw new IllegalArgumentException("Forma de pagamento é obrigatória.");
        this.codigo = codigo; this.valor = valor;
        this.formaPagamento = formaPagamento; this.aprovado = aprovado;
    }
    boolean podeConfirmar() { return aprovado; }
    String descricao() { return codigo + " | " + formaPagamento + " | R$ " + valor; }
}`;

const TEST_SOURCE = `import java.math.BigDecimal;

public class TesteConstrutores {
    public static void main(String[] args) {
        PagamentoTeste valido = new PagamentoTeste("P-1", new BigDecimal("10.00"), "PIX");
        assertEquals("P-1", valido.codigo(), "objeto válido");
        expectError(() -> new PagamentoTeste("", BigDecimal.ONE, "PIX"), "código");
        expectError(() -> new PagamentoTeste("P-2", null, "PIX"), "valor nulo");
        expectError(() -> new PagamentoTeste("P-2", BigDecimal.ZERO, "PIX"), "valor zero");
        expectError(() -> new PagamentoTeste("P-2", BigDecimal.ONE, null), "forma");
        ClienteTeste cliente = new ClienteTeste("Ana");
        assertTrue(cliente.ativo(), "padrão ativo");
        assertEquals("", cliente.telefone(), "padrão telefone");
        System.out.println("7 testes passaram");
    }
    static void expectError(Runnable acao, String caso) {
        try { acao.run(); throw new AssertionError(caso); }
        catch (IllegalArgumentException esperado) { }
    }
    static void assertTrue(boolean atual, String caso) { if (!atual) throw new AssertionError(caso); }
    static void assertEquals(Object esperado, Object atual, String caso) {
        if (!esperado.equals(atual)) throw new AssertionError(caso);
    }
}

class PagamentoTeste {
    private final String codigo;
    PagamentoTeste(String codigo, BigDecimal valor, String forma) {
        if (codigo == null || codigo.isBlank()) throw new IllegalArgumentException();
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException();
        if (forma == null) throw new IllegalArgumentException();
        this.codigo = codigo;
    }
    String codigo() { return codigo; }
}
class ClienteTeste {
    private final String telefone;
    private final boolean ativo;
    ClienteTeste(String nome) { this(nome, "", true); }
    ClienteTeste(String nome, String telefone, boolean ativo) {
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException();
        this.telefone = telefone; this.ativo = ativo;
    }
    String telefone() { return telefone; }
    boolean ativo() { return ativo; }
}`;

const ERRORS = [
  ['Tratar construtor como método comum', 'Declara retorno ou tenta chamar como operação normal.', 'Construtor tem o nome da classe, não declara retorno e participa do new.'],
  ['Esquecer que new chama construtor', 'A criação parece mágica e os valores iniciais não são rastreados.', 'Acompanhe argumentos, parâmetros, validações, this e referência.'],
  ['Padrão sem pensar', 'Pedido nasce sem cliente, produto, preço ou quantidade.', 'Exija obrigatórios ou defina padrões que tenham significado real.'],
  ['Obrigatórios sem validação', 'Objeto inválido nasce e falha longe da origem.', 'Valide antes de atribuir e lance IllegalArgumentException com mensagem clara.'],
  ['Trabalho pesado no construtor', 'new salva banco, chama API, envia mensagem e imprime.', 'Construtor valida e inicializa; efeitos externos ficam fora.'],
  ['Confundir atributo e parâmetro', 'nome = nome não altera o campo.', 'Use this.nome = nome para deixar os papéis explícitos.'],
  ['Sobrecarga excessiva', 'Cinco assinaturas parecidas tornam a criação ambígua.', 'Mantenha somente formas legítimas e considere outro padrão no futuro.'],
  ['Padrão escondido', 'Telefone vazio e ativo true aparecem sem justificativa.', 'Delegue com this(...) e documente a decisão de domínio.'],
];

const EVIDENCE = `# Aula 110 — Construtor padrão e parametrizado

- [ ] Acompanhei new até a referência pronta
- [ ] Executei ClienteConstrutorParametrizado.java
- [ ] Expliquei construtor implícito e explícito
- [ ] Executei ProdutoConstrutorPadrao.java
- [ ] Executei PedidoConstrutorParametrizado.java
- [ ] Provoquei quatro IllegalArgumentException no Pedido
- [ ] Expliquei this.campo e this(...)
- [ ] Executei ClienteConstrutoresSobrecarregados.java
- [ ] Testei cinco invariantes da OS
- [ ] Depurei sucesso e exceção no construtor
- [ ] Modelei PagamentoConstrutor.java e executei 7 testes`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? 'Copiado' : 'Copiar'}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

function BirthLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['Argumentos', '"Ana", "ana@email.com"', 'dados preparados pela chamada'], ['new', 'new Cliente(...)', 'memória reservada para a instância'], ['Construtor', 'Cliente(String nome, String email)', 'parâmetros recebem argumentos'], ['Validação', 'nome informado?', 'invariantes aceitam ou interrompem'], ['this', 'this.nome = nome', 'atributos recebem valores aceitos'], ['Referência', 'cliente → Cliente@71aa', 'objeto pronto volta ao chamador'],
  ];
  const current = stages[stage];
  return <section className="ct110-stack"><div className="ct110-birth"><nav>{stages.map((item, index) => <button type="button" key={item[0]} className={stage === index ? 'active' : stage > index ? 'done' : ''} onClick={() => setStage(index)}><span>{stage > index ? <Check size={13} /> : index + 1}</span>{item[0]}</button>)}</nav><main><small>ETAPA {stage + 1} DE {stages.length}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}.</p><button type="button" disabled={stage === stages.length - 1} onClick={() => setStage(value => value + 1)}><StepForward size={15} />Avançar nascimento</button></main></div><div className="ct110-principle"><DoorOpen /><div><strong>Construtor é a porta de entrada do objeto</strong><span>Ele define dados necessários, rejeita argumentos inválidos e monta um estado inicial confiável.</span></div></div></section>;
}

function ClientLab() {
  const commands = ['mkdir labs\\m4\\aula-110-construtor-padrao-e-parametrizado', 'cd labs\\m4\\aula-110-construtor-padrao-e-parametrizado', 'javac ClienteConstrutorParametrizado.java', 'java ClienteConstrutorParametrizado'].join('\n');
  return <section className="ct110-stack"><CodePanel name="ClienteConstrutorParametrizado.java" code={CLIENT_SOURCE} /><div className="ct110-this"><section><small>ATRIBUTO</small><strong>this.nome</strong><span>pertence ao objeto atual</span></section><ArrowLeft /><section><small>PARÂMETRO</small><strong>nome</strong><span>existe durante a chamada</span></section></div><div className="ct110-terminal"><header><Terminal size={15} />Primeira execução<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}Nome: Ana Silva{`\n`}Ativo: true{`\n`}Pode receber mensagem: true</pre></div></section>;
}

function DefaultRulesLab() {
  const [declared, setDeclared] = useState('none');
  const cases = {
    none: ['Nenhum construtor declarado', 'Java fornece Classe()', 'new Classe() compila'],
    param: ['Um construtor parametrizado declarado', 'Java não fornece Classe()', 'new Classe() falha; use os argumentos'],
    both: ['Sem parâmetros e parametrizado declarados', 'As duas assinaturas existem', 'as duas formas compilam'],
  };
  const current = cases[declared];
  return <section className="ct110-stack"><div className="ct110-default"><nav>{[['none', 'Nenhum declarado'], ['param', 'Só parametrizado'], ['both', 'Ambos explícitos']].map(item => <button type="button" key={item[0]} className={declared === item[0] ? 'active' : ''} onClick={() => setDeclared(item[0])}>{item[1]}</button>)}</nav><main><small>REGRA DO COMPILADOR</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}.</p></main></div><div className="ct110-warning"><AlertTriangle /><div><strong>“Construtor padrão” pode significar duas coisas na conversa</strong><span>Aqui distinguimos o construtor sem parâmetros escrito por você daquele gerado automaticamente somente quando nenhum construtor foi declarado.</span></div></div></section>;
}

function ProductDefaultLab() {
  return <section className="ct110-stack"><CodePanel name="ProdutoConstrutorPadrao.java" code={DEFAULT_SOURCE} /><div className="ct110-default-state"><article><small>SEM DECISÃO</small><code>nome = null</code><code>ativo = false</code><strong>estado técnico, talvez sem sentido</strong></article><ArrowRight /><article><small>PADRÃO EXPLÍCITO</small><code>nome = "Produto sem nome"</code><code>ativo = true</code><strong>decisão visível — ainda deve ser questionada</strong></article></div><div className="ct110-principle"><Box /><div><strong>Sem parâmetros não significa sem intenção</strong><span>Valores padrão precisam fazer sentido no domínio; caso contrário, exija os dados no construtor.</span></div></div></section>;
}

function RequiredLab() {
  const [view, setView] = useState('doors');
  return <section className="ct110-stack"><div className="ct110-toggle"><button type="button" className={view === 'doors' ? 'active' : ''} onClick={() => setView('doors')}>Comparar portas</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Pedido parametrizado</button></div>{view === 'code' ? <CodePanel name="PedidoConstrutorParametrizado.java" code={ORDER_PARAM_SOURCE} /> : <div className="ct110-doors"><article><header>Pedido()</header><span>cliente?</span><span>produto?</span><span>preço?</span><span>quantidade?</span><strong>objeto incompleto permitido</strong></article><ArrowRight /><article><header>Pedido(cliente, produto, preço, quantidade)</header><span>Ana Silva</span><span>Cadeira</span><span>199.90</span><span>2</span><strong>obrigatórios visíveis na chamada</strong></article></div>}<div className="ct110-principle"><BadgeCheck /><div><strong>Assinatura comunica o mínimo para nascer</strong><span>O chamador não consegue esquecer silenciosamente cliente, produto, preço ou quantidade.</span></div></div></section>;
}

function ValidationLab() {
  const [field, setField] = useState('valid');
  const scenarios = {
    valid: ['Ana Silva', 'Cadeira', '199.90', '2', 'Objeto criado'],
    client: ['', 'Cadeira', '199.90', '2', 'Cliente é obrigatório.'],
    product: ['Ana', '', '199.90', '2', 'Produto é obrigatório.'],
    price: ['Ana', 'Cadeira', '0.00', '2', 'Preço unitário deve ser maior que zero.'],
    quantity: ['Ana', 'Cadeira', '199.90', '0', 'Quantidade deve ser maior que zero.'],
  };
  const current = scenarios[field];
  return <section className="ct110-stack"><div className="ct110-validation"><nav>{[['valid', 'Válido'], ['client', 'Cliente vazio'], ['product', 'Produto vazio'], ['price', 'Preço zero'], ['quantity', 'Quantidade zero']].map(item => <button type="button" key={item[0]} className={field === item[0] ? 'active' : ''} onClick={() => setField(item[0])}>{item[1]}</button>)}</nav><main><small>CHAMADA</small><code>new Pedido("{current[0]}", "{current[1]}", {current[2]}, {current[3]})</code><div className={field === 'valid' ? 'success' : 'failure'}>{field === 'valid' ? <CheckCircle2 /> : <AlertTriangle />}<strong>{current[4]}</strong></div></main></div><CodePanel name="PedidoConstrutorComValidacao.java" code={ORDER_VALID_SOURCE} /><div className="ct110-order"><span>1 · obrigatórios</span><ArrowRight /><span>2 · faixas numéricas</span><ArrowRight /><span>3 · combinações simples</span><ArrowRight /><span>4 · atribuir com this</span></div></section>;
}

function OverloadLab() {
  const [path, setPath] = useState('short');
  return <section className="ct110-stack"><div className="ct110-overload"><nav><button type="button" className={path === 'short' ? 'active' : ''} onClick={() => setPath('short')}>new Cliente(nome, email)</button><button type="button" className={path === 'full' ? 'active' : ''} onClick={() => setPath('full')}>new Cliente(nome, email, telefone, ativo)</button></nav><main>{path === 'short' ? <><section><small>CONSTRUTOR CURTO</small><code>this(nome, email, "", true)</code></section><ArrowRight /><section><small>CONSTRUTOR PRINCIPAL</small><code>valida → atribui quatro campos</code></section><p>Padrões aplicados: telefone vazio e ativo true.</p></> : <><section><small>CONSTRUTOR COMPLETO</small><code>valida → atribui quatro argumentos</code></section><p>Nenhum valor padrão é aplicado.</p></>}</main></div><CodePanel name="ClienteConstrutoresSobrecarregados.java" code={OVERLOAD_SOURCE} /><div className="ct110-principle"><GitBranch /><div><strong>this(...) chama outro construtor da mesma classe</strong><span>Use sobrecarga apenas para formas legítimas; muitas assinaturas parecidas tornam a criação difícil de entender.</span></div></div></section>;
}

function OsLab() {
  const [selected, setSelected] = useState(0);
  const rules = [
    ['certificado', '""', 'Certificado é obrigatório.'], ['cliente', '""', 'Cliente é obrigatório.'], ['status', 'null', 'Status é obrigatório.'], ['dataAbertura', 'null', 'Data de abertura é obrigatória.'], ['reagendamentos', '-1', 'Quantidade de reagendamentos não pode ser negativa.'],
  ];
  const current = rules[selected];
  return <section className="ct110-stack"><div className="ct110-os"><nav>{rules.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]} = {item[1]}</code></button>)}</nav><main><small>INVARIANTE {selected + 1} DE {rules.length}</small><strong>{current[2]}</strong><p>A atribuição aos campos ainda não aconteceu; o objeto não chega a nascer.</p></main></div><CodePanel name="OrdemServicoConstrutor.java" code={OS_SOURCE} /><div className="ct110-boundary"><strong>Construtor pode:</strong>{['validar obrigatórios', 'validar faixas', 'definir padrões claros', 'atribuir estado'].map(item => <span key={item}>{item}</span>)}<strong>Construtor não deve:</strong>{['salvar banco', 'chamar API', 'enviar mensagem', 'ler Scanner', 'abrir arquivo'].map(item => <span className="outside" key={item}>{item}</span>)}</div></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [
    ['main', 'new Pedido("Ana", ...)', 'argumentos prontos'], ['Pedido.<init>', 'cliente = "Ana"', 'parâmetros recebidos'], ['textoInformado', 'cliente → true', 'primeira validação'], ['Pedido.<init>', 'preco.compareTo(ZERO) = 1', 'faixa aceita'], ['Pedido.<init>', 'this.cliente = "Ana"', 'atribuição após validação'], ['main', 'pedido = Pedido@19d3', 'objeto devolvido'], ['Pedido.<init>', 'cliente = ""', 'segunda tentativa'], ['IllegalArgumentException', 'Cliente é obrigatório.', 'objeto não criado'],
  ];
  const current = trace[pause];
  return <section className="ct110-stack"><div className="ct110-debug"><header><span>PedidoConstrutorComValidacao.java · Debug</span><span>Frames · Variables · Breakpoints</span></header><div><aside>{trace.map((item, index) => <button type="button" key={index} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>PAUSA {pause + 1} DE {trace.length}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}</p><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => value + 1)}><StepForward size={15} />Próxima pausa</button></main></div><footer>Compare o caminho de sucesso com a exceção: validar antes de atribuir impede estado parcial observável.</footer></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors ct110-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [view, setView] = useState('contract');
  const [checked, setChecked] = useState([]);
  const checks = ['seis etapas do nascimento explicadas', 'Cliente parametrizado executado', 'regra de construtor implícito defendida', 'Produto padrão executado', 'Pedido parametrizado executado', 'quatro exceções provocadas', 'sobrecarga e this(...) explicados', 'cinco invariantes da OS testadas', 'oito pausas depuradas', 'Pagamento válido e inválido executados', '7 testes e Git concluídos'];
  const commands = ['javac PagamentoConstrutor.java', 'java PagamentoConstrutor', 'javac TesteConstrutores.java', 'java TesteConstrutores', 'git status', 'git add labs/m4/aula-110-construtor-padrao-e-parametrizado', 'git commit -m "Aula 110: pratica construtores em Java"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="ct110-stack"><div className="ct110-toggle"><button type="button" className={view === 'contract' ? 'active' : ''} onClick={() => setView('contract')}>Contrato do Pagamento</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código</button><button type="button" className={view === 'tests' ? 'active' : ''} onClick={() => setView('tests')}>Testes</button></div>{view === 'code' ? <CodePanel name="PagamentoConstrutor.java" code={PAYMENT_SOURCE} /> : view === 'tests' ? <CodePanel name="TesteConstrutores.java" code={TEST_SOURCE} /> : <div className="ct110-contract"><section><small>OBRIGATÓRIOS</small><strong>codigo · valor maior que zero · formaPagamento</strong></section><section><small>RECEBIDO</small><strong>aprovado</strong></section><section><small>COMPORTAMENTOS</small><strong>podeConfirmar · descricao</strong></section><section><small>PROVA</small><strong>uma criação válida · uma IllegalArgumentException</strong></section></div>}<div className="ct110-terminal"><header><Play size={15} />Compilar, testar e versionar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}7 testes passaram</pre></div><div className="ct110-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral do nascimento</h3></div><ul><li>Quando o Java gera o construtor sem parâmetros automaticamente?</li><li>Qual é a diferença entre this.campo e this(...) no construtor?</li><li>Qual invariante interrompeu uma criação antes da atribuição?</li><li>Qual trabalho você manteria explicitamente fora do construtor?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'birth', label: 'Como o Objeto Nasce', duration: '11 min', eyebrow: 'NEW, CONSTRUTOR, VALIDAÇÃO, THIS E REFERÊNCIA', title: 'Acompanhe seis movimentos da chamada ao objeto pronto', blocks: [{ type: 'lead', text: 'Construtor não é um método comum: ele é chamado pelo new, não declara retorno e monta o estado inicial da instância.' }, { type: 'birth' }] },
  { id: 'client', label: 'Cliente Parametrizado', duration: '17 min', eyebrow: 'ARGUMENTO, PARÂMETRO E ATRIBUTO', title: 'Digite o primeiro construtor e leia cada atribuição', blocks: [{ type: 'lead', text: 'Usar o mesmo nome no parâmetro e no atributo é comum; this deixa explícito qual lado pertence ao objeto.' }, { type: 'client' }] },
  { id: 'default-rule', label: 'Regra do Construtor Padrão', duration: '12 min', eyebrow: 'IMPLÍCITO, EXPLÍCITO E AUSENTE', title: 'Descubra quando o compilador fornece Classe()', blocks: [{ type: 'lead', text: 'O Java só gera o construtor sem parâmetros quando você não declarou construtor algum.' }, { type: 'default-rule' }] },
  { id: 'product-default', label: 'Produto com Padrões', duration: '14 min', eyebrow: 'SEM PARÂMETROS, MAS COM DECISÕES', title: 'Defina valores iniciais e questione se fazem sentido', blocks: [{ type: 'lead', text: 'Um construtor vazio pode criar null e false sem intenção; um construtor explícito revela a decisão, que ainda precisa ser válida.' }, { type: 'product-default' }] },
  { id: 'required', label: 'Obrigatórios do Pedido', duration: '15 min', eyebrow: 'ASSINATURA COMO CONTRATO DE NASCIMENTO', title: 'Compare uma porta vazia com um construtor parametrizado', blocks: [{ type: 'lead', text: 'Cliente, produto, preço e quantidade aparecem na chamada e deixam o estado mínimo visível.' }, { type: 'required' }] },
  { id: 'validation', label: 'Validar Antes de Atribuir', duration: '20 min', eyebrow: 'ILLEGALARGUMENTEXCEPTION E INVARIANTES', title: 'Provoque quatro falhas e impeça objetos inválidos', blocks: [{ type: 'lead', text: 'Valide obrigatórios, faixas e combinações simples; somente depois grave valores em this.' }, { type: 'validation' }] },
  { id: 'overload', label: 'Sobrecarga e this(...)', duration: '17 min', eyebrow: 'DUAS FORMAS LEGÍTIMAS DE CRIAÇÃO', title: 'Delegue do construtor curto para o principal', blocks: [{ type: 'lead', text: 'A sobrecarga aplica telefone vazio e ativo true de forma explícita, sem duplicar validação e atribuição.' }, { type: 'overload' }] },
  { id: 'os', label: 'OS Protegida', duration: '20 min', eyebrow: 'CINCO INVARIANTES E LIMITE DO CONSTRUTOR', title: 'Proteja o estado inicial sem executar o sistema inteiro', blocks: [{ type: 'lead', text: 'A OS não nasce sem identidade, cliente, status ou data; banco, API e mensagens continuam fora.' }, { type: 'os' }] },
  { id: 'debug', label: 'Debug do Construtor', duration: '14 min', eyebrow: 'SUCESSO, ATRIBUIÇÃO E EXCEÇÃO', title: 'Compare um objeto pronto com uma criação interrompida', blocks: [{ type: 'lead', text: 'O mock de IDE revela parâmetros, validações, this, retorno da referência e o frame da exceção.' }, { type: 'debug' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'PADRÕES, OBRIGATÓRIOS, EFEITOS E SOBRECARGA', title: 'Diagnostique oito falhas na porta de entrada', blocks: [{ type: 'lead', text: 'Construtor confiável exige intenção clara, validação antes da atribuição e ausência de efeitos externos pesados.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Pagamento', duration: '19 min', eyebrow: 'CONTRATO, EXCEÇÃO, TESTES E GIT', title: 'Modele um Pagamento que não consegue nascer incompleto', blocks: [{ type: 'lead', text: 'A entrega exige obrigatórios, BigDecimal positivo, enum presente, comportamento e uma falha intencional observável.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const map = { birth: BirthLab, client: ClientLab, 'default-rule': DefaultRulesLab, 'product-default': ProductDefaultLab, required: RequiredLab, validation: ValidationLab, overload: OverloadLab, os: OsLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = map[block.type];
  return Component ? <Component /> : null;
}

export default function GuidedConstructorsLesson110({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-constructors-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><DoorOpen size={17} />Laboratório do nascimento do objeto</span><p className="guided-sequence">110 · M4.06</p><h1>O construtor decide quais objetos podem nascer</h1><p>Acompanhe new, parâmetros, validações, this e referência; compare construtor implícito, sem parâmetros e parametrizado, pratique sobrecarga e impeça estados inválidos.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 110" items={[{ value: '8 fontes', label: 'Compiladas e testadas' }, { value: '8 pausas', label: 'No debug do construtor' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 110"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Objetos agora nascem por contratos explícitos</h3><p>{lessonComplete ? 'Aula concluída: agora você pode aprofundar encapsulamento.' : 'Execute as fontes e prove os caminhos de exceção antes de concluir.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 109</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>New, validação, this e sobrecarga</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 111<ArrowRight size={17} /></button></footer></article>;
}
