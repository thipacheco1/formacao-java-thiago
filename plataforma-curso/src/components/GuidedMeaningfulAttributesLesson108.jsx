import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, Boxes, Check, CheckCircle2,
  Clock3, Copy, Database, FileCode2, Fingerprint, ListChecks,
  Play, RotateCcw, ScanSearch, Sparkles, StepForward, Tags, Terminal,
} from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedMeaningfulAttributesLesson.css';

const STORAGE_KEY = 'guided-meaningful-attributes-lesson-108-progress';

const BAD_SOURCE = `public class ClienteAtributosRuins {
    public static void main(String[] args) {
        ClienteRuim cliente = new ClienteRuim(
                "Ana Silva", "ana@email.com", "11999999999", true);
        System.out.println(cliente.dado1());
        System.out.println(cliente.dado2());
        System.out.println(cliente.dado3());
        System.out.println(cliente.marcado());
    }
}

class ClienteRuim {
    private final String dado1;
    private final String dado2;
    private final String dado3;
    private final boolean marcado;

    ClienteRuim(String dado1, String dado2, String dado3, boolean marcado) {
        this.dado1 = dado1;
        this.dado2 = dado2;
        this.dado3 = dado3;
        this.marcado = marcado;
    }

    String dado1() { return dado1; }
    String dado2() { return dado2; }
    String dado3() { return dado3; }
    boolean marcado() { return marcado; }
}`;

const GOOD_SOURCE = `public class ClienteAtributosBons {
    public static void main(String[] args) {
        ClienteBom cliente = new ClienteBom(
                "Ana Silva", "ana@email.com", "11999999999", true);
        System.out.println("Nome: " + cliente.nome());
        System.out.println("E-mail: " + cliente.email());
        System.out.println("Telefone: " + cliente.telefone());
        System.out.println("Ativo: " + cliente.ativo());
        System.out.println("Contato completo: " + cliente.contatoCompleto());
        System.out.println("Pode receber mensagem: " + cliente.podeReceberMensagem());
    }
}

class ClienteBom {
    private final String nome;
    private final String email;
    private final String telefone;
    private final boolean ativo;

    ClienteBom(String nome, String email, String telefone, boolean ativo) {
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

const ORDER_SOURCE = `import java.math.BigDecimal;

public class PedidoEstadoMinimo {
    public static void main(String[] args) {
        PedidoMinimo pedido = new PedidoMinimo(new BigDecimal("100.00"), 2);
        System.out.println("Preço: " + pedido.precoUnitario());
        System.out.println("Quantidade: " + pedido.quantidade());
        System.out.println("Total calculado: " + pedido.totalBruto());
    }
}

class PedidoMinimo {
    private final BigDecimal precoUnitario;
    private final int quantidade;

    PedidoMinimo(BigDecimal precoUnitario, int quantidade) {
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    BigDecimal precoUnitario() { return precoUnitario; }
    int quantidade() { return quantidade; }

    BigDecimal totalBruto() {
        if (precoUnitario == null || quantidade <= 0) return BigDecimal.ZERO;
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }
}`;

const OS_SOURCE = `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class OrdemServicoAtributos {
    public static void main(String[] args) {
        OrdemServicoTipada os = new OrdemServicoTipada(
                "OS-001", "Ana Silva", StatusOs.ABERTA,
                LocalDate.now().minusDays(4), 1);
        LocalDate hoje = LocalDate.now();
        System.out.println("Certificado: " + os.certificado());
        System.out.println("Cliente: " + os.cliente());
        System.out.println("Status: " + os.status());
        System.out.println("Dias em aberto: " + os.diasEmAberto(hoje));
        System.out.println("Atrasada: " + os.atrasada(hoje));
        System.out.println("Fila: " + os.filaSugerida(hoje));
    }
}

enum StatusOs { ABERTA, AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
enum FilaAtendimento { ENTRADA, REAGENDAMENTO, CASOS_CRITICOS, SEM_FILA }

class OrdemServicoTipada {
    private final String certificado;
    private final String cliente;
    private final StatusOs status;
    private final LocalDate dataAbertura;
    private final int quantidadeReagendamentos;

    OrdemServicoTipada(String certificado, String cliente, StatusOs status,
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
    long diasEmAberto(LocalDate referencia) {
        return Math.max(ChronoUnit.DAYS.between(dataAbertura, referencia), 0);
    }
    boolean atrasada(LocalDate referencia) { return diasEmAberto(referencia) > 3; }
    boolean encerrada() { return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA; }
    boolean precisaReagendamento() { return quantidadeReagendamentos >= 2; }
    FilaAtendimento filaSugerida(LocalDate referencia) {
        if (encerrada()) return FilaAtendimento.SEM_FILA;
        if (atrasada(referencia)) return FilaAtendimento.CASOS_CRITICOS;
        if (precisaReagendamento()) return FilaAtendimento.REAGENDAMENTO;
        return FilaAtendimento.ENTRADA;
    }
}`;

const PAYMENT_SOURCE = `import java.math.BigDecimal;

public class PagamentoAtributos {
    public static void main(String[] args) {
        PagamentoSignificativo pagamento = new PagamentoSignificativo(
                "PAG-001", new BigDecimal("150.00"), FormaPagamento.PIX, true);
        System.out.println("Código: " + pagamento.codigo());
        System.out.println("Valor: " + pagamento.valor());
        System.out.println("Forma: " + pagamento.formaPagamento());
        System.out.println("Aprovado: " + pagamento.aprovado());
        System.out.println("Valor válido: " + pagamento.valorValido());
        System.out.println("Pode confirmar: " + pagamento.podeConfirmar());
    }
}

enum FormaPagamento { PIX, CARTAO, BOLETO }

class PagamentoSignificativo {
    private final String codigo;
    private final BigDecimal valor;
    private final FormaPagamento formaPagamento;
    private final boolean aprovado;

    PagamentoSignificativo(String codigo, BigDecimal valor,
            FormaPagamento formaPagamento, boolean aprovado) {
        this.codigo = codigo;
        this.valor = valor;
        this.formaPagamento = formaPagamento;
        this.aprovado = aprovado;
    }

    String codigo() { return codigo; }
    BigDecimal valor() { return valor; }
    FormaPagamento formaPagamento() { return formaPagamento; }
    boolean aprovado() { return aprovado; }
    boolean valorValido() { return valor != null && valor.compareTo(BigDecimal.ZERO) > 0; }
    boolean podeConfirmar() {
        return codigo != null && !codigo.isBlank()
                && valorValido() && formaPagamento != null && aprovado;
    }
}`;

const PRODUCT_SOURCE = `import java.math.BigDecimal;

public class ProdutoAtributos {
    public static void main(String[] args) {
        Produto cadeira = new Produto("PRD-1", "Cadeira", CategoriaProduto.MOVEL,
                new BigDecimal("499.90"), true, 8);
        Produto luminaria = new Produto("PRD-2", "Luminária", CategoriaProduto.DECORACAO,
                new BigDecimal("89.90"), true, 0);
        imprimir(cadeira);
        imprimir(luminaria);
    }

    static void imprimir(Produto produto) {
        System.out.println(produto.descricao());
        System.out.println("Preço válido: " + produto.precoValido());
        System.out.println("Tem estoque: " + produto.temEstoque());
        System.out.println("Disponível: " + produto.disponivelParaVenda());
        System.out.println("---");
    }
}

enum CategoriaProduto { MOVEL, ELETRODOMESTICO, DECORACAO, OUTRO }

class Produto {
    private final String codigo;
    private final String nome;
    private final CategoriaProduto categoria;
    private final BigDecimal preco;
    private final boolean ativo;
    private final int estoque;

    Produto(String codigo, String nome, CategoriaProduto categoria,
            BigDecimal preco, boolean ativo, int estoque) {
        this.codigo = codigo;
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
        this.ativo = ativo;
        this.estoque = estoque;
    }

    boolean precoValido() { return preco != null && preco.compareTo(BigDecimal.ZERO) > 0; }
    boolean temEstoque() { return estoque > 0; }
    boolean disponivelParaVenda() { return ativo && precoValido() && temEstoque(); }
    String descricao() { return codigo + " | " + nome + " | " + categoria; }
}`;

const TEST_SOURCE = `import java.math.BigDecimal;

public class TesteAtributosSignificativos {
    public static void main(String[] args) {
        ProdutoTeste disponivel = new ProdutoTeste(new BigDecimal("10.00"), true, 2);
        ProdutoTeste semEstoque = new ProdutoTeste(new BigDecimal("10.00"), true, 0);
        ProdutoTeste inativo = new ProdutoTeste(new BigDecimal("10.00"), false, 2);
        ProdutoTeste semPreco = new ProdutoTeste(BigDecimal.ZERO, true, 2);
        assertTrue(disponivel.precoValido(), "preço positivo");
        assertTrue(disponivel.temEstoque(), "estoque positivo");
        assertTrue(disponivel.disponivel(), "produto disponível");
        assertFalse(semEstoque.disponivel(), "sem estoque");
        assertFalse(inativo.disponivel(), "inativo");
        assertFalse(semPreco.precoValido(), "preço zero");
        assertFalse(semPreco.disponivel(), "preço inválido");
        System.out.println("7 testes passaram");
    }
    static void assertTrue(boolean atual, String caso) { if (!atual) throw new AssertionError(caso); }
    static void assertFalse(boolean atual, String caso) { assertTrue(!atual, caso); }
}

class ProdutoTeste {
    private final BigDecimal preco;
    private final boolean ativo;
    private final int estoque;
    ProdutoTeste(BigDecimal preco, boolean ativo, int estoque) {
        this.preco = preco; this.ativo = ativo; this.estoque = estoque;
    }
    boolean precoValido() { return preco.compareTo(BigDecimal.ZERO) > 0; }
    boolean temEstoque() { return estoque > 0; }
    boolean disponivel() { return ativo && precoValido() && temEstoque(); }
}`;

const ERRORS = [
  ['Nome genérico', 'valor1, texto2, flag ou dados obrigam o leitor a adivinhar.', 'Use o vocabulário do domínio e deixe claro o significado de true.'],
  ['Dado calculado armazenado', 'Preço e quantidade indicam 200, mas totalBruto guarda 500.', 'Guarde a fonte da verdade e calcule o valor derivado.'],
  ['String para tudo', 'Status aceita x, data aceita qualquer texto e dinheiro usa aproximação.', 'Prefira enum, LocalDate e BigDecimal conforme o significado.'],
  ['Atributo não pertence ao objeto', 'Pedido passa a guardar cor da tela ou mensagem do relatório.', 'Pergunte qual regra do próprio objeto usa a informação.'],
  ['Obrigatório ignorado', 'Cliente sem nome ou pagamento sem valor existe sem sentido.', 'Registre invariantes e valide os dados essenciais.'],
  ['Classe inchada', 'OS carrega contato, endereço, produto, técnico e pagamento inteiros.', 'Procure conceitos e responsabilidades escondidos antes de adicionar campos.'],
  ['Boolean ambíguo', 'marcado = true não revela ativo, aprovado, bloqueado ou cancelado.', 'Nomeie o estado para que a condição seja lida naturalmente.'],
  ['Nome sem contexto suficiente', 'codigo em uma classe genérica não diz o que identifica.', 'Use o contexto da classe; se ainda houver dúvida, especialize o nome.'],
];

const EVIDENCE = `# Aula 108 — Atributos com significado

- [ ] Apliquei as cinco perguntas de pertencimento
- [ ] Comparei ClienteAtributosRuins e ClienteAtributosBons
- [ ] Removi totalBruto do estado de Pedido
- [ ] Justifiquei enum, LocalDate e BigDecimal
- [ ] Executei OrdemServicoAtributos.java
- [ ] Identifiquei estado mínimo e sinais de classe inchada
- [ ] Marquei obrigatórios e primeiras invariantes
- [ ] Executei PagamentoAtributos.java
- [ ] Depurei this e métodos derivados
- [ ] Modelei ProdutoAtributos.java
- [ ] Executei 7 testes e revisei git status`;

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
  const questions = [
    ['Pertence?', 'A informação descreve este objeto, e não tela, banco ou relatório?', 'certificado pertence à OS'],
    ['Representa estado?', 'Ela diferencia uma instância de outra ao longo do domínio?', 'status diferencia duas OS'],
    ['Participa de regra?', 'Algum comportamento real consulta essa informação?', 'ativo participa de podeReceberMensagem'],
    ['Precisa armazenar?', 'É fonte da verdade ou pode ser derivada de outros campos?', 'totalBruto pode ser calculado'],
    ['Comunica?', 'Nome e tipo revelam significado sem comentário?', 'dataAbertura: LocalDate'],
  ];
  const current = questions[selected];
  return <section className="ma108-stack"><div className="ma108-gate"><nav>{questions.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span>{item[0]}</button>)}</nav><main><small>PERGUNTA {selected + 1} DE 5</small><strong>{current[0]}</strong><p>{current[1]}</p><code>{current[2]}</code></main></div><div className="ma108-principle"><Fingerprint /><div><strong>Atributo é uma decisão de domínio</strong><span>Ele precisa justificar por que existe, a quem pertence e qual verdade preserva.</span></div></div></section>;
}

function NamingLab() {
  const [view, setView] = useState('compare');
  return <section className="ma108-stack"><div className="ma108-toggle"><button type="button" className={view === 'compare' ? 'active' : ''} onClick={() => setView('compare')}>Comparar significado</button><button type="button" className={view === 'bad' ? 'active' : ''} onClick={() => setView('bad')}>Código ruim</button><button type="button" className={view === 'good' ? 'active' : ''} onClick={() => setView('good')}>Código bom</button></div>{view === 'bad' ? <CodePanel name="ClienteAtributosRuins.java" code={BAD_SOURCE} /> : view === 'good' ? <CodePanel name="ClienteAtributosBons.java" code={GOOD_SOURCE} /> : <div className="ma108-compare"><article><header>Compila, mas esconde</header>{[['dado1', '?'], ['dado2', '?'], ['dado3', '?'], ['marcado', 'true de quê?']].map(item => <p key={item[0]}><code>{item[0]}</code><span>{item[1]}</span></p>)}</article><ArrowRight /><article><header>Conta a história</header>{[['nome', 'identidade'], ['email', 'contato'], ['telefone', 'contato'], ['ativo', 'situação cadastral']].map(item => <p key={item[0]}><code>{item[0]}</code><span>{item[1]}</span></p>)}</article></div>}<div className="ma108-terminal"><header><Terminal size={16} />Execução comparável<CopyButton value={'javac ClienteAtributosRuins.java ClienteAtributosBons.java\njava ClienteAtributosRuins\njava ClienteAtributosBons'} /></header><pre>Os dois programas imprimem os mesmos valores.{`\n`}Somente o segundo explica o que cada valor significa.</pre></div></section>;
}

function DerivedLab() {
  const [price, setPrice] = useState(100);
  const [quantity, setQuantity] = useState(2);
  const [stored, setStored] = useState(500);
  const calculated = price * quantity;
  return <section className="ma108-stack"><div className="ma108-derived"><div><label>precoUnitario <b>{price}</b><input type="range" min="10" max="300" step="10" value={price} onChange={event => setPrice(Number(event.target.value))} /></label><label>quantidade <b>{quantity}</b><input type="range" min="1" max="8" value={quantity} onChange={event => setQuantity(Number(event.target.value))} /></label><label>totalBruto armazenado <b>{stored}</b><input type="range" min="0" max="1000" step="10" value={stored} onChange={event => setStored(Number(event.target.value))} /></label></div><article className={stored === calculated ? 'ok' : 'danger'}><small>DUAS VERDADES CONCORRENTES</small><p><span>armazenado</span><code>{stored.toFixed(2)}</code></p><p><span>calculado</span><code>{calculated.toFixed(2)}</code></p><strong>{stored === calculated ? 'Coerente agora — ainda pode divergir depois' : `Inconsistência de ${(stored - calculated).toFixed(2)}`}</strong></article></div><CodePanel name="PedidoEstadoMinimo.java" code={ORDER_SOURCE} /><div className="ma108-principle"><Database /><div><strong>Estado mínimo: uma fonte de verdade</strong><span>Guarde preço e quantidade; faça totalBruto() derivar sempre deles.</span></div></div></section>;
}

function TypeLab() {
  const [selected, setSelected] = useState(0);
  const types = [
    ['status: String', 'status: StatusOs', 'enum limita valores e habilita comparação segura'],
    ['dataAbertura: String', 'dataAbertura: LocalDate', 'tipo temporal valida e oferece operações de data'],
    ['valor: double', 'valor: BigDecimal', 'decimal exato evita aproximação binária para dinheiro'],
    ['categoria: String', 'categoria: CategoriaProduto', 'enum documenta o conjunto permitido'],
  ];
  const current = types[selected];
  return <section className="ma108-stack"><div className="ma108-types"><nav>{types.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]}</code></button>)}</nav><main><small>TIPO FRACO → TIPO SEMÂNTICO</small><div><code>{current[0]}</code><ArrowRight /><code>{current[1]}</code></div><p>{current[2]}.</p></main></div><div className="ma108-principle"><Tags /><div><strong>Tipo é uma restrição executável</strong><span>Nome diz o que o campo representa; tipo limita quais operações e valores fazem sentido.</span></div></div></section>;
}

function OsLab() {
  const [view, setView] = useState('state');
  const commands = ['javac OrdemServicoAtributos.java', 'java OrdemServicoAtributos'].join('\n');
  return <section className="ma108-stack"><div className="ma108-toggle"><button type="button" className={view === 'state' ? 'active' : ''} onClick={() => setView('state')}>Estado mínimo</button><button type="button" className={view === 'derived' ? 'active' : ''} onClick={() => setView('derived')}>Dados derivados</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código completo</button></div>{view === 'code' ? <CodePanel name="OrdemServicoAtributos.java" code={OS_SOURCE} /> : <div className="ma108-os-map">{view === 'state' ? [['certificado', 'String'], ['cliente', 'String'], ['status', 'StatusOs'], ['dataAbertura', 'LocalDate'], ['quantidadeReagendamentos', 'int']].map(item => <article key={item[0]}><strong>{item[0]}</strong><code>{item[1]}</code><span>armazenado</span></article>) : [['diasEmAberto(data)', 'dataAbertura + referência'], ['atrasada(data)', 'diasEmAberto > 3'], ['encerrada()', 'status'], ['filaSugerida(data)', 'status + atraso + reagendamentos']].map(item => <article key={item[0]}><strong>{item[0]}</strong><code>{item[1]}</code><span>calculado</span></article>)}</div>}<div className="ma108-terminal"><header><Play size={15} />Compilar e observar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}Dias em aberto: 4{`\n`}Atrasada: true{`\n`}Fila: CASOS_CRITICOS</pre></div></section>;
}

function ScopeLab() {
  const [selected, setSelected] = useState(0);
  const candidates = [
    ['certificado da OS', 'Guardar', 'identifica a própria OS'], ['diasEmAberto', 'Calcular', 'muda conforme a data de referência'], ['atrasada', 'Calcular', 'deriva dos dias em aberto'], ['cor do botão', 'Fora da classe', 'pertence à apresentação'], ['emailCliente inteiro', 'Reavaliar conceito', 'pode revelar Cliente escondido'], ['enderecoRua + cidade + número', 'Sinal de inchaço', 'pode revelar Endereco'],
  ];
  const current = candidates[selected];
  return <section className="ma108-stack"><div className="ma108-scope"><nav>{candidates.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{item[0]}</button>)}</nav><main><small>DECISÃO</small><strong>{current[1]}</strong><p>{current[2]}.</p></main></div><div className="ma108-bloated"><header><Boxes />OrdemServico inchada?</header>{['Cliente: nome, email, telefone', 'Produto: nome, valor', 'Técnico: nome, telefone', 'Endereço: rua, número, cidade', 'Pagamento: valor, forma'].map(item => <span key={item}>{item}</span>)}<p>Não separe mecanicamente; reconheça conceitos escondidos e investigue responsabilidades.</p></div></section>;
}

function InvariantLab() {
  const [checked, setChecked] = useState([]);
  const rules = [
    ['Cliente', 'nome informado'], ['OrdemServico', 'certificado informado'], ['Pedido', 'produto informado e quantidade > 0'], ['Pagamento', 'código, valor > 0 e forma presentes'], ['Produto', 'código, nome, categoria e preço presentes'],
  ];
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="ma108-stack"><div className="ma108-invariants"><header><BadgeCheck /><div><strong>{checked.length} de {rules.length} invariantes justificadas</strong><span>Marque somente depois de explicar por que o objeto perde sentido sem a regra.</span></div></header>{rules.map((item, index) => <button type="button" key={item[0]} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span><b>{item[0]}</b><code>{item[1]}</code></button>)}</div><div className="ma108-principle"><BadgeCheck /><div><strong>Primeira definição de invariante</strong><span>Regra que precisa permanecer verdadeira para o objeto conservar significado; hoje podemos expor valido(), depois aprenderemos a impedir estados inválidos.</span></div></div></section>;
}

function PaymentLab() {
  const commands = ['javac PagamentoAtributos.java', 'java PagamentoAtributos'].join('\n');
  return <section className="ma108-stack"><div className="ma108-payment-story"><article><small>IDENTIDADE</small><strong>codigo: String</strong><span>identifica o pagamento no contexto</span></article><article><small>DINHEIRO</small><strong>valor: BigDecimal</strong><span>precisão e regra valorValido()</span></article><article><small>CONJUNTO FECHADO</small><strong>formaPagamento: enum</strong><span>PIX, CARTAO ou BOLETO</span></article><article><small>ESTADO OPERACIONAL</small><strong>aprovado: boolean</strong><span>true tem leitura natural</span></article></div><CodePanel name="PagamentoAtributos.java" code={PAYMENT_SOURCE} /><div className="ma108-terminal"><header><Terminal size={15} />Execução do pagamento<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}Código: PAG-001{`\n`}Valor: 150.00{`\n`}Forma: PIX{`\n`}Aprovado: true{`\n`}Valor válido: true{`\n`}Pode confirmar: true</pre></div></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [
    ['Pagamento.<init>', 'codigo = "PAG-001"', 'parâmetro recebido'], ['Pagamento.<init>', 'this.codigo = null', 'antes da atribuição'], ['Pagamento.<init>', 'this.codigo = "PAG-001"', 'atributo preenchido'], ['Pagamento.<init>', 'this.valor = 150.00', 'BigDecimal preservado'], ['Pagamento.<init>', 'this.formaPagamento = PIX', 'enum controlado'], ['valorValido', 'valor.compareTo(ZERO) = 1', 'true'], ['podeConfirmar', 'codigo + valor + forma + aprovado', 'true'], ['main', 'pagamento = Pagamento@4e21', 'saída impressa'],
  ];
  const current = trace[pause];
  return <section className="ma108-stack"><div className="ma108-debug"><header><span>PagamentoAtributos.java · Debug</span><span>Variables · this · Frames</span></header><div><aside>{trace.map((item, index) => <button type="button" key={index} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>PAUSA {pause + 1} DE {trace.length}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}</p><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => value + 1)}><StepForward size={15} />Próxima pausa</button></main></div><footer>Confirme no debug: cada método derivado consulta os atributos e não uma cópia desatualizada.</footer></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors ma108-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [view, setView] = useState('contract');
  const [checked, setChecked] = useState([]);
  const checks = ['cinco perguntas aplicadas', 'nomes ruins e bons comparados', 'dado derivado removido', 'tipos semânticos defendidos', 'OS executada', 'estado mínimo auditado', 'cinco invariantes justificadas', 'Pagamento executado', 'oito frames depurados', 'Produto modelado e executado', '7 testes e Git concluídos'];
  const commands = ['javac ProdutoAtributos.java', 'java ProdutoAtributos', 'javac TesteAtributosSignificativos.java', 'java TesteAtributosSignificativos', 'git status', 'git add labs/m4/aula-108-atributos-com-significado', 'git commit -m "Aula 108: escolhe atributos com significado"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="ma108-stack"><div className="ma108-toggle"><button type="button" className={view === 'contract' ? 'active' : ''} onClick={() => setView('contract')}>Contrato do Produto</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código de referência</button><button type="button" className={view === 'tests' ? 'active' : ''} onClick={() => setView('tests')}>Testes</button></div>{view === 'code' ? <CodePanel name="ProdutoAtributos.java" code={PRODUCT_SOURCE} /> : view === 'tests' ? <CodePanel name="TesteAtributosSignificativos.java" code={TEST_SOURCE} /> : <div className="ma108-contract"><section><small>ESTADO</small><strong>codigo · nome · categoria · preco · ativo · estoque</strong></section><section><small>TIPOS</small><strong>String · CategoriaProduto · BigDecimal · boolean · int</strong></section><section><small>COMPORTAMENTOS</small><strong>precoValido · temEstoque · disponivelParaVenda</strong></section><section><small>INVARIANTE OPERACIONAL</small><strong>ativo && precoValido() && temEstoque()</strong></section></div>}<div className="ma108-terminal"><header><Play size={15} />Compilar, testar e versionar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}7 testes passaram</pre></div><div className="ma108-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral do estado</h3></div><ul><li>Qual atributo renomeado revelou melhor o domínio?</li><li>Qual dado deixou de ser armazenado porque é derivado?</li><li>Qual tipo impede valores inválidos antes de qualquer if?</li><li>Qual invariante protege o significado do Produto?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'decision', label: 'As 5 Perguntas', duration: '10 min', eyebrow: 'PERTENCIMENTO, REGRA, ARMAZENAMENTO, NOME E TIPO', title: 'Exija uma justificativa antes de criar o atributo', blocks: [{ type: 'lead', text: 'Estado não é uma lista de variáveis: cada campo precisa representar uma verdade necessária do objeto.' }, { type: 'decision' }] },
  { id: 'naming', label: 'Nomes Ruins e Bons', duration: '18 min', eyebrow: 'MESMOS VALORES, COMUNICAÇÃO OPOSTA', title: 'Compare código que compila com código que conta a história', blocks: [{ type: 'lead', text: 'dado1 e marcado escondem intenção; nome, email, telefone e ativo permitem compreender regras sem adivinhação.' }, { type: 'naming' }] },
  { id: 'derived', label: 'Armazenar ou Calcular', duration: '16 min', eyebrow: 'FONTE DE VERDADE E ESTADO MÍNIMO', title: 'Provoque uma inconsistência e elimine a segunda verdade', blocks: [{ type: 'lead', text: 'Um valor derivado armazenado pode contradizer os dados que deveriam determiná-lo.' }, { type: 'derived' }] },
  { id: 'types', label: 'Tipos com Significado', duration: '12 min', eyebrow: 'ENUM, LOCALDATE E BIGDECIMAL', title: 'Faça o tipo restringir o que o domínio permite', blocks: [{ type: 'lead', text: 'String para tudo transfere validação para o futuro; tipos semânticos documentam e reduzem estados inválidos.' }, { type: 'types' }] },
  { id: 'os', label: 'OS Tipada e Mínima', duration: '19 min', eyebrow: 'ESTADO ARMAZENADO VERSUS RESPOSTAS DERIVADAS', title: 'Deixe a Ordem de Serviço guardar somente a fonte da verdade', blocks: [{ type: 'lead', text: 'StatusOs e LocalDate comunicam mais que texto; atraso, dias e fila continuam métodos porque variam ou derivam do estado.' }, { type: 'os' }] },
  { id: 'scope', label: 'Pertencimento e Inchaço', duration: '13 min', eyebrow: 'GUARDAR, CALCULAR, EXCLUIR OU REAVALIAR', title: 'Perceba quando um campo revela outra responsabilidade', blocks: [{ type: 'lead', text: 'Atributos demais podem esconder Cliente, Endereco, Produto, Tecnico e Pagamento dentro de uma única classe.' }, { type: 'scope' }] },
  { id: 'invariants', label: 'Obrigatórios e Invariantes', duration: '12 min', eyebrow: 'OBJETO COM SENTIDO DESDE A ORIGEM', title: 'Defina o que precisa ser verdadeiro para cada conceito existir', blocks: [{ type: 'lead', text: 'A primeira ideia de invariante conecta atributos obrigatórios ao significado do objeto, antes de aprofundarmos validação no construtor.' }, { type: 'invariants' }] },
  { id: 'payment', label: 'Pagamento Significativo', duration: '17 min', eyebrow: 'IDENTIDADE, DINHEIRO, ENUM E BOOLEAN', title: 'Faça quatro atributos sustentarem uma regra completa', blocks: [{ type: 'lead', text: 'codigo, valor, formaPagamento e aprovado explicam o estado; podeConfirmar reúne as invariantes operacionais.' }, { type: 'payment' }] },
  { id: 'debug', label: 'Debug do Estado', duration: '14 min', eyebrow: 'PARÂMETROS, THIS, ATRIBUTOS E DERIVAÇÕES', title: 'Observe o estado nascer e alimentar comportamentos', blocks: [{ type: 'lead', text: 'O debug conecta cada argumento ao atributo e cada método à fonte de verdade que ele consulta.' }, { type: 'debug' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'NOME, TIPO, DERIVAÇÃO, PERTENCIMENTO E TAMANHO', title: 'Diagnostique oito formas de enfraquecer o estado', blocks: [{ type: 'lead', text: 'Corrija primeiro o significado; sintaxe organizada não salva um modelo que armazena a verdade errada.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Produto', duration: '19 min', eyebrow: 'ESTADO, TIPOS, INVARIANTES, TESTES E GIT', title: 'Modele Produto sem recorrer a nomes ou tipos genéricos', blocks: [{ type: 'lead', text: 'A entrega exige atributos intencionais, enum, BigDecimal, boolean legível, estoque e comportamentos derivados.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const blocks = { decision: DecisionLab, naming: NamingLab, derived: DerivedLab, types: TypeLab, os: OsLab, scope: ScopeLab, invariants: InvariantLab, payment: PaymentLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = blocks[block.type];
  return Component ? <Component /> : null;
}

export default function GuidedMeaningfulAttributesLesson108({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-meaningful-attributes-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><ScanSearch size={17} />Oficina de estado com significado</span><p className="guided-sequence">108 · M4.04</p><h1>Cada atributo deve proteger uma verdade do objeto</h1><p>Escolha nomes e tipos que expliquem o domínio, guarde apenas a fonte da verdade, calcule dados derivados e reconheça obrigatórios, invariantes e sinais de classe inchada.</p></div><div className="guided-hero-status"><Database size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 108" items={[{ value: '7 fontes', label: 'Compiladas e testadas' }, { value: '5 perguntas', label: 'Antes de criar um campo' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 108"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Estado mínimo, expressivo e verificável</h3><p>{lessonComplete ? 'Aula concluída: agora você pode aprofundar métodos com comportamento.' : 'Execute os programas e defenda as invariantes antes de concluir.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 107</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Nome, tipo, estado mínimo e invariante</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 109<ArrowRight size={17} /></button></footer></article>;
}
