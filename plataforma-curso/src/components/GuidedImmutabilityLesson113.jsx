import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy,
  FileCode2, Fingerprint, Layers3, ListChecks, LockKeyhole, Play, RotateCcw,
  ShieldCheck, Sparkles, StepForward,
} from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedImmutabilityLesson.css';

const STORAGE_KEY = 'guided-immutability-lesson-113-progress';

const BAD_CLIENT_SOURCE = `public class ClienteMutavelProblematico {
    public static void main(String[] args) {
        ClienteMutavel cliente = new ClienteMutavel();
        cliente.setNome("Ana Silva"); cliente.setEmail("ana@email.com");
        System.out.println("Inicial: " + cliente.resumo());
        cliente.setNome(""); cliente.setEmail(null);
        System.out.println("Inválido: " + cliente.resumo());
    }
}
class ClienteMutavel {
    private String nome; private String email;
    void setNome(String nome) { this.nome = nome; }
    void setEmail(String email) { this.email = email; }
    String resumo() { return "Nome: " + nome + " | E-mail: " + email; }
}`;

const IMMUTABLE_CLIENT_SOURCE = `public class ClienteImutavel {
    public static void main(String[] args) {
        ClienteValor original = new ClienteValor("Ana Silva", "ana@email.com");
        ClienteValor atualizado = original.comEmail("ana.novo@email.com");
        System.out.println("Original: " + original.resumo());
        System.out.println("Atualizado: " + atualizado.resumo());
        try { original.comEmail(""); }
        catch (IllegalArgumentException erro) { System.out.println("Falha esperada: " + erro.getMessage()); }
    }
}
class ClienteValor {
    private final String nome; private final String email;
    ClienteValor(String nome, String email) {
        if (!textoInformado(nome) || !textoInformado(email))
            throw new IllegalArgumentException("Nome e e-mail obrigatórios.");
        this.nome = nome; this.email = email;
    }
    String nome() { return nome; } String email() { return email; }
    ClienteValor comEmail(String novoEmail) { return new ClienteValor(nome, novoEmail); }
    String resumo() { return nome + " | " + email; }
    private static boolean textoInformado(String valor) { return valor != null && !valor.isBlank(); }
}`;

const LOCALDATE_SOURCE = `import java.time.LocalDate;
public class LocalDateImutavel {
    public static void main(String[] args) {
        LocalDate hoje = LocalDate.of(2026, 7, 18);
        LocalDate amanha = hoje.plusDays(1);
        String nome = "ana";
        String maiusculo = nome.toUpperCase();
        System.out.println("Hoje: " + hoje);
        System.out.println("Amanhã: " + amanha);
        System.out.println("Hoje continua: " + hoje);
        System.out.println("String original: " + nome + " | Nova: " + maiusculo);
    }
}`;

const MONEY_SOURCE = `import java.math.BigDecimal;
import java.math.RoundingMode;
public class DinheiroImutavel {
    public static void main(String[] args) {
        Dinheiro valorProduto = new Dinheiro(new BigDecimal("199.90"));
        Dinheiro frete = new Dinheiro(new BigDecimal("20.00"));
        Dinheiro total = valorProduto.somar(frete);
        Dinheiro desconto = total.aplicarDescontoPercentual(new BigDecimal("10"));
        System.out.println("Produto: " + valorProduto.formatado());
        System.out.println("Total: " + total.formatado());
        System.out.println("Com desconto: " + desconto.formatado());
        System.out.println("Produto continua: " + valorProduto.formatado());
    }
}
class Dinheiro {
    private final BigDecimal valor;
    Dinheiro(BigDecimal valor) {
        if (valor == null) throw new IllegalArgumentException("Valor obrigatório.");
        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }
    BigDecimal valor() { return valor; }
    boolean positivo() { return valor.compareTo(BigDecimal.ZERO) > 0; }
    boolean zero() { return valor.compareTo(BigDecimal.ZERO) == 0; }
    Dinheiro somar(Dinheiro outro) {
        if (outro == null) throw new IllegalArgumentException("Outro valor obrigatório.");
        return new Dinheiro(valor.add(outro.valor));
    }
    Dinheiro subtrair(Dinheiro outro) {
        if (outro == null) throw new IllegalArgumentException("Outro valor obrigatório.");
        return new Dinheiro(valor.subtract(outro.valor));
    }
    Dinheiro aplicarDescontoPercentual(BigDecimal percentual) {
        if (percentual == null || percentual.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("Percentual inválido.");
        BigDecimal fator = percentual.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        return new Dinheiro(valor.subtract(valor.multiply(fator)));
    }
    String formatado() { return "R$ " + valor; }
}`;

const EMAIL_SOURCE = `public class EmailImutavel {
    public static void main(String[] args) {
        EmailValor ana = new EmailValor(" ANA@EMAIL.COM ");
        EmailValor carlos = new EmailValor("carlos@empresa.com");
        System.out.println("Valor: " + ana.valor());
        System.out.println("Domínio: " + ana.dominio());
        System.out.println("Mesmo domínio: " + ana.mesmoDominio(carlos));
        try { new EmailValor("sem-arroba"); }
        catch (IllegalArgumentException erro) { System.out.println("Falha esperada: " + erro.getMessage()); }
    }
}
class EmailValor {
    private final String valor;
    EmailValor(String valor) {
        if (!emailValido(valor)) throw new IllegalArgumentException("E-mail inválido.");
        this.valor = valor.trim().toLowerCase();
    }
    String valor() { return valor; }
    String dominio() { return valor.substring(valor.indexOf('@') + 1); }
    boolean mesmoDominio(EmailValor outro) { return outro != null && dominio().equals(outro.dominio()); }
    private static boolean emailValido(String valor) {
        if (valor == null) return false; String texto = valor.trim(); int arroba = texto.indexOf('@');
        return !texto.isBlank() && arroba > 0 && arroba < texto.length() - 1;
    }
}`;

const PAYMENT_SOURCE = `import java.math.BigDecimal;
public class PagamentoImutavel {
    public static void main(String[] args) {
        PagamentoValor original = new PagamentoValor("PAG-001", new BigDecimal("150.00"), StatusPagamentoImutavel.PENDENTE);
        original.aprovar();
        System.out.println("Retorno ignorado: " + original.status());
        PagamentoValor aprovado = original.aprovar();
        PagamentoValor confirmado = aprovado.confirmar();
        System.out.println("Original: " + original.resumo());
        System.out.println("Aprovado: " + aprovado.resumo());
        System.out.println("Confirmado: " + confirmado.resumo());
    }
}
enum StatusPagamentoImutavel { PENDENTE, APROVADO, CONFIRMADO, CANCELADO }
class PagamentoValor {
    private final String codigo; private final BigDecimal valor; private final StatusPagamentoImutavel status;
    PagamentoValor(String codigo, BigDecimal valor, StatusPagamentoImutavel status) {
        if (codigo == null || codigo.isBlank() || valor == null || valor.compareTo(BigDecimal.ZERO) <= 0 || status == null)
            throw new IllegalArgumentException("Dados obrigatórios.");
        this.codigo = codigo; this.valor = valor; this.status = status;
    }
    StatusPagamentoImutavel status() { return status; }
    boolean pendente() { return status == StatusPagamentoImutavel.PENDENTE; }
    boolean aprovado() { return status == StatusPagamentoImutavel.APROVADO; }
    boolean confirmado() { return status == StatusPagamentoImutavel.CONFIRMADO; }
    PagamentoValor aprovar() {
        if (!pendente()) throw new IllegalStateException("Somente PENDENTE aprova.");
        return new PagamentoValor(codigo, valor, StatusPagamentoImutavel.APROVADO);
    }
    PagamentoValor confirmar() {
        if (!aprovado()) throw new IllegalStateException("Somente APROVADO confirma.");
        return new PagamentoValor(codigo, valor, StatusPagamentoImutavel.CONFIRMADO);
    }
    PagamentoValor cancelar(String motivo) {
        if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo obrigatório.");
        if (confirmado()) throw new IllegalStateException("CONFIRMADO não cancela.");
        return new PagamentoValor(codigo, valor, StatusPagamentoImutavel.CANCELADO);
    }
    String resumo() { return codigo + " | " + valor + " | " + status; }
}`;

const RECORD_SOURCE = `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
public class PeriodoAgendamentoRecord {
    public static void main(String[] args) {
        PeriodoAgendamento periodo = new PeriodoAgendamento(
                LocalDate.of(2026, 7, 18), LocalDate.of(2026, 7, 23));
        System.out.println("Início: " + periodo.inicio());
        System.out.println("Fim: " + periodo.fim());
        System.out.println("Duração: " + periodo.duracaoEmDias());
        try { new PeriodoAgendamento(periodo.fim(), periodo.inicio()); }
        catch (IllegalArgumentException erro) { System.out.println("Falha esperada: " + erro.getMessage()); }
    }
}
record PeriodoAgendamento(LocalDate inicio, LocalDate fim) {
    PeriodoAgendamento {
        if (inicio == null || fim == null) throw new IllegalArgumentException("Datas obrigatórias.");
        if (fim.isBefore(inicio)) throw new IllegalArgumentException("Fim anterior ao início.");
    }
    long duracaoEmDias() { return ChronoUnit.DAYS.between(inicio, fim); }
}`;

const PHONE_SOURCE = `public class TelefoneImutavel {
    public static void main(String[] args) {
        Telefone original = new Telefone("11", "999999999");
        Telefone alterado = original.comNumero("888888888");
        Telefone mesmoDdd = new Telefone("11", "777777777");
        System.out.println("Original: " + original.formatado());
        System.out.println("Alterado: " + alterado.formatado());
        System.out.println("Original continua: " + original.formatado());
        System.out.println("Mesmo DDD: " + original.mesmoDdd(mesmoDdd));
        try { original.comNumero("123"); }
        catch (IllegalArgumentException erro) { System.out.println("Falha esperada: " + erro.getMessage()); }
    }
}
final class Telefone {
    private final String ddd; private final String numero;
    Telefone(String ddd, String numero) {
        if (ddd == null || ddd.length() != 2) throw new IllegalArgumentException("DDD deve ter 2 caracteres.");
        if (numero == null || numero.length() < 8) throw new IllegalArgumentException("Número deve ter ao menos 8 caracteres.");
        this.ddd = ddd; this.numero = numero;
    }
    String formatado() { return "(" + ddd + ") " + numero; }
    boolean mesmoDdd(Telefone outro) { return outro != null && ddd.equals(outro.ddd); }
    Telefone comNumero(String novoNumero) { return new Telefone(ddd, novoNumero); }
}`;

const TEST_SOURCE = `public class TesteImutabilidade {
    public static void main(String[] args) {
        TelefoneTeste original = new TelefoneTeste("11", "999999999");
        TelefoneTeste novo = original.comNumero("888888888");
        assertEquals("999999999", original.numero(), "original preservado");
        assertEquals("888888888", novo.numero(), "novo estado");
        assertTrue(original != novo, "referências distintas");
        assertTrue(original.mesmoDdd(novo), "mesmo ddd");
        expectError(() -> original.comNumero("123"), "número curto");
        expectError(() -> new TelefoneTeste("1", "999999999"), "ddd curto");
        assertEquals("(11) 999999999", original.formatado(), "formatação");
        System.out.println("7 testes passaram");
    }
    static void expectError(Runnable acao, String caso) { try { acao.run(); throw new AssertionError(caso); } catch (IllegalArgumentException esperado) { } }
    static void assertTrue(boolean atual, String caso) { if (!atual) throw new AssertionError(caso); }
    static void assertEquals(Object esperado, Object atual, String caso) { if (!esperado.equals(atual)) throw new AssertionError(caso); }
}
final class TelefoneTeste {
    private final String ddd; private final String numero;
    TelefoneTeste(String ddd, String numero) {
        if (ddd == null || ddd.length() != 2 || numero == null || numero.length() < 8) throw new IllegalArgumentException();
        this.ddd = ddd; this.numero = numero;
    }
    String numero() { return numero; }
    String formatado() { return "(" + ddd + ") " + numero; }
    boolean mesmoDdd(TelefoneTeste outro) { return outro != null && ddd.equals(outro.ddd); }
    TelefoneTeste comNumero(String novo) { return new TelefoneTeste(ddd, novo); }
}`;

const ERRORS = [
  ['Achar que final resolve tudo', 'A referência não muda, mas uma lista interna ainda pode sofrer clear().', 'Combine final com tipos imutáveis e cópia defensiva.'],
  ['Criar setter no imutável', 'O objeto passa a trocar de estado depois de nascer.', 'Remova setter e retorne um novo objeto validado.'],
  ['Ignorar o retorno', 'comEmail ou aprovar cria outro objeto, mas o chamador o descarta.', 'Guarde o retorno em nova referência ou reatribua a variável.'],
  ['Tornar tudo imutável', 'Entidade com ciclo de vida pode ficar artificial e verbosa.', 'Escolha por valor, identidade, ciclo de vida e clareza.'],
  ['Confundir valor e entidade', 'A decisão usa moda técnica em vez da semântica do domínio.', 'Valores representam informação; entidades mantêm identidade.'],
  ['Expor mutável interno', 'Um getter devolve a coleção original apesar do campo final.', 'Retorne cópia/visão segura ou operações controladas.'],
  ['Congelar estado inválido', 'Sem validação, o erro passa a durar por toda a vida do objeto.', 'Valide todas as invariantes na criação e nas cópias.'],
];

const EVIDENCE = `# Aula 113 — Imutabilidade aplicada
- [ ] Comparei objeto mutável e imutável
- [ ] Executei o cliente que se torna inválido
- [ ] Preservei o Cliente original com comEmail
- [ ] Expliquei o limite de final
- [ ] Testei String e LocalDate
- [ ] Somei e descontei com Dinheiro
- [ ] Validei Email como objeto de valor
- [ ] Preservei três estados do Pagamento
- [ ] Validei PeriodoAgendamento record
- [ ] Depurei oito momentos de criação
- [ ] Entreguei Telefone, sete testes e Git`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="guided-copy" onClick={copy}><Copy size={14} />{copied ? 'Copiado' : 'Copiar'}</button>;
}
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

function MapLab() {
  const [selected, setSelected] = useState(0);
  const items = [
    ['Mutável livre', 'o mesmo objeto aceita qualquer escrita', 'surpresa e estado inválido'],
    ['Mutável encapsulado', 'o mesmo objeto muda por operação', 'bom para ciclo de vida'],
    ['Imutável', 'a operação devolve outro objeto', 'bom para valores e previsibilidade'],
    ['Decisão', 'valor, identidade e ciclo de vida', 'imutabilidade é ferramenta, não religião'],
  ];
  const current = items[selected];
  return <section className="im113-stack"><div className="im113-map"><nav>{items.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span>{item[0]}</button>)}</nav><main><small>MODELO {selected + 1}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}.</p></main></div><div className="im113-benefits">{['debug simples', 'menos efeitos colaterais', 'testes previsíveis', 'segurança e concorrência'].map(item => <span key={item}><CheckCircle2 size={16} />{item}</span>)}</div></section>;
}

function BadClientLab() {
  const [name, setName] = useState('Ana Silva');
  const [email, setEmail] = useState('ana@email.com');
  const invalid = !name.trim() || !email?.trim();
  return <section className="im113-stack"><div className="im113-bad"><div><label>setNome<input value={name} onChange={event => setName(event.target.value)} /></label><label>setEmail<input value={email ?? ''} onChange={event => setEmail(event.target.value)} /></label><button type="button" onClick={() => { setName(''); setEmail(''); }}>Aplicar alterações ruins</button></div><article className={invalid ? 'invalid' : ''}><small>MESMA REFERÊNCIA</small><strong>cliente@1</strong><code>nome = {name || '""'}</code><code>email = {email || 'null'}</code><span>{invalid ? 'Objeto ficou inválido depois de nascer.' : 'Estado inicial válido.'}</span></article></div><CodePanel name="ClienteMutavelProblematico.java" code={BAD_CLIENT_SOURCE} /></section>;
}

function ImmutableClientLab() {
  const [newEmail, setNewEmail] = useState('ana.novo@email.com');
  const [created, setCreated] = useState(false);
  const valid = newEmail.trim().length > 0;
  return <section className="im113-stack"><div className="im113-copy"><article><small>cliente@A · ORIGINAL</small><strong>Ana Silva</strong><code>ana@email.com</code><span>permanece igual</span></article><ArrowRight /><div><label>comEmail<input value={newEmail} onChange={event => { setNewEmail(event.target.value); setCreated(false); }} /></label><button type="button" onClick={() => valid && setCreated(true)}>Criar novo Cliente</button></div><ArrowRight /><article className={created ? 'created' : ''}><small>cliente@B · NOVO</small><strong>{created ? 'Ana Silva' : 'aguardando retorno'}</strong><code>{created ? newEmail : 'new Cliente(...)'}</code><span>{valid ? 'construtor valida a cópia' : 'IllegalArgumentException'}</span></article></div><CodePanel name="ClienteImutavel.java" code={IMMUTABLE_CLIENT_SOURCE} /><div className="im113-principle"><LockKeyhole /><div><strong>private + final + construtor válido + nenhum setter</strong><span>O método comEmail não altera A: ele usa os dados aceitos para construir B.</span></div></div></section>;
}

function FinalLab() {
  const [deep, setDeep] = useState(false);
  const [items, setItems] = useState(['Teclado', 'Mouse']);
  return <section className="im113-stack"><div className="im113-final"><article><small>REFERÊNCIA FINAL</small><code>private final List&lt;String&gt; itens;</code><strong>itens = outraLista → não compila</strong></article><ArrowRight /><article className={items.length === 0 ? 'leaked' : ''}><small>CONTEÚDO MUTÁVEL</small><strong>[{items.join(', ')}]</strong><button type="button" onClick={() => setItems([])}>itens.clear()</button><span>{items.length ? 'final não bloqueou a operação' : 'conteúdo alterado'}</span></article></div><div className="im113-toggle"><button type="button" className={!deep ? 'active' : ''} onClick={() => setDeep(false)}>Imutabilidade rasa</button><button type="button" className={deep ? 'active' : ''} onClick={() => setDeep(true)}>Proteção defensiva</button></div><div className="im113-principle"><ShieldCheck /><div><strong>{deep ? 'Tipos imutáveis, cópia e visão segura completam a proteção' : 'final impede reatribuição; não congela o objeto apontado'}</strong><span>Ausência de setter ajuda, mas objetos mutáveis internos também precisam de fronteira.</span></div></div></section>;
}

function JdkTypesLab() {
  const [selected, setSelected] = useState(0);
  const types = [
    ['String', '"ana"', 'toUpperCase()', '"ANA"'],
    ['LocalDate', '2026-07-18', 'plusDays(1)', '2026-07-19'],
    ['BigDecimal', '199.90', 'add(20.00)', '219.90'],
    ['Instant', '2026-07-18T10:00Z', 'plusSeconds(60)', '2026-07-18T10:01Z'],
  ];
  const current = types[selected];
  return <section className="im113-stack"><div className="im113-jdk"><nav>{types.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{item[0]}</button>)}</nav><main><section><small>ORIGINAL</small><strong>{current[1]}</strong></section><div><code>{current[2]}</code><ArrowRight /></div><section><small>NOVO VALOR</small><strong>{current[3]}</strong></section><footer>O original continua {current[1]}.</footer></main></div><CodePanel name="LocalDateImutavel.java" code={LOCALDATE_SOURCE} /></section>;
}

function ValueObjectsLab() {
  const [kind, setKind] = useState('money');
  const [amount, setAmount] = useState(199.9);
  const [email, setEmail] = useState(' ANA@EMAIL.COM ');
  return <section className="im113-stack"><div className="im113-toggle"><button type="button" className={kind === 'money' ? 'active' : ''} onClick={() => setKind('money')}>Dinheiro</button><button type="button" className={kind === 'email' ? 'active' : ''} onClick={() => setKind('email')}>Email</button></div>{kind === 'money' ? <><div className="im113-money"><article><small>ORIGINAL</small><strong>R$ {amount.toFixed(2)}</strong></article><div><button type="button" onClick={() => setAmount(199.9)}>somar frete</button><code>novo Dinheiro: R$ {(amount + 20).toFixed(2)}</code><button type="button" onClick={() => setAmount(199.9)}>aplicar 10%</button><code>novo Dinheiro: R$ {((amount + 20) * .9).toFixed(2)}</code></div></div><CodePanel name="DinheiroImutavel.java" code={MONEY_SOURCE} /></> : <><div className="im113-email"><label>Valor de entrada<input value={email} onChange={event => setEmail(event.target.value)} /></label><article><small>NORMALIZADO NO CONSTRUTOR</small><strong>{email.trim().toLowerCase()}</strong><code>domínio = {email.includes('@') ? email.trim().split('@')[1] : 'inválido'}</code></article></div><CodePanel name="EmailImutavel.java" code={EMAIL_SOURCE} /></>}</section>;
}

function PaymentLab() {
  const [states, setStates] = useState([{ id: 'A', status: 'PENDENTE' }]);
  const [message, setMessage] = useState('Pagamento original criado');
  const current = states[states.length - 1];
  const advance = () => {
    if (current.status === 'PENDENTE') { setStates(value => [...value, { id: 'B', status: 'APROVADO' }]); setMessage('aprovar() retornou pagamento@B'); return; }
    if (current.status === 'APROVADO') { setStates(value => [...value, { id: 'C', status: 'CONFIRMADO' }]); setMessage('confirmar() retornou pagamento@C'); return; }
    setMessage('CONFIRMADO não possui próxima transição');
  };
  const ignore = () => setMessage(`${current.status === 'PENDENTE' ? 'aprovar' : 'confirmar'}() executou, mas o retorno foi ignorado; ${current.id} continua ${current.status}`);
  return <section className="im113-stack"><div className="im113-payment"><div>{states.map((item, index) => <article key={item.id}><small>pagamento@{item.id}</small><strong>{item.status}</strong>{index < states.length - 1 && <ArrowRight />}</article>)}</div><aside><code>{message}</code><button type="button" onClick={ignore}>Ignorar retorno</button><button type="button" onClick={advance}>Guardar novo objeto</button></aside></div><CodePanel name="PagamentoImutavel.java" code={PAYMENT_SOURCE} /><div className="im113-tradeoffs"><span><CheckCircle2 />previsível e fácil de debugar</span><span><CheckCircle2 />ótimo para valor e evento</span><span><AlertTriangle />mais objetos e referências</span><span><AlertTriangle />retorno não pode ser perdido</span></div></section>;
}

function RecordChoiceLab() {
  const [selected, setSelected] = useState(0);
  const choices = [
    ['Email', 'valor', 'imutável', 'sem identidade; outro texto é outro valor'],
    ['PeriodoAgendamento', 'valor', 'record imutável', 'duas datas validadas e comportamento pequeno'],
    ['Produto com estoque', 'entidade', 'mutável encapsulado', 'identidade e ciclo de vida operacional'],
    ['EventoPagamento', 'evento', 'imutável', 'fato passado não deve ser reescrito'],
    ['OrdemServico', 'entidade', 'depende do modelo', 'pode mutar por operações ou produzir versões'],
  ];
  const current = choices[selected];
  return <section className="im113-stack"><div className="im113-choice"><nav>{choices.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{item[0]}</button>)}</nav><main><small>{current[1].toUpperCase()}</small><strong>{current[2]}</strong><p>{current[3]}.</p><div>{['tem identidade?', 'tem ciclo de vida?', 'a mudança é novo valor?', 'fica mais claro?'].map(item => <span key={item}>{item}</span>)}</div></main></div><CodePanel name="PeriodoAgendamentoRecord.java" code={RECORD_SOURCE} /></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [
    ['main', 'original = cliente@A', 'Ana | ana@email.com'],
    ['comEmail', 'novoEmail validado', 'ana.novo@email.com'],
    ['construtor', 'new Cliente(...)', 'nasce cliente@B'],
    ['retorno', 'atualizado = cliente@B', 'A continua intacto'],
    ['somar', 'valorProduto@A + frete@B', 'cria total@C'],
    ['aprovar', 'pagamento@A PENDENTE', 'cria pagamento@B APROVADO'],
    ['confirmar', 'pagamento@B APROVADO', 'cria pagamento@C CONFIRMADO'],
    ['comparar', 'A != B != C', 'estados coexistem e são rastreáveis'],
  ];
  const current = trace[pause];
  return <section className="im113-stack"><div className="im113-debug"><header><span>ClienteImutavel.java · Debug</span><span>Variables · Frames · F7</span></header><div><aside>{trace.map((item, index) => <button type="button" key={index} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>PAUSA {pause + 1} DE {trace.length}</small><strong>{current[0]}</strong><code>{current[1]}</code><p>{current[2]}.</p><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => value + 1)}><StepForward size={15} />Próxima pausa</button></main></div><footer>Observe referências e valores: uma “mudança” é criação, retorno e escolha explícita da nova referência.</footer></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors im113-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [view, setView] = useState('contract');
  const [checked, setChecked] = useState([]);
  const checks = ['três modelos comparados', 'cliente mutável executado', 'cliente imutável preservado', 'limite de final explicado', 'tipos JDK comparados', 'Dinheiro e Email testados', 'Pagamento versionado', 'record validado', 'oito pausas depuradas', 'sete erros diagnosticados', 'Telefone e 7 testes concluídos'];
  const commands = ['javac TelefoneImutavel.java', 'java TelefoneImutavel', 'javac TesteImutabilidade.java', 'java TesteImutabilidade', 'git status', 'git add labs/m4/aula-113-imutabilidade-aplicada', 'git commit -m "Aula 113: aplica imutabilidade em objetos"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="im113-stack"><div className="im113-toggle im113-three"><button type="button" className={view === 'contract' ? 'active' : ''} onClick={() => setView('contract')}>Contrato Telefone</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código</button><button type="button" className={view === 'tests' ? 'active' : ''} onClick={() => setView('tests')}>Testes</button></div>{view === 'code' ? <CodePanel name="TelefoneImutavel.java" code={PHONE_SOURCE} /> : view === 'tests' ? <CodePanel name="TesteImutabilidade.java" code={TEST_SOURCE} /> : <div className="im113-contract"><section><small>FINAL</small><strong>ddd · numero · classe Telefone</strong></section><section><small>VALIDAÇÃO</small><strong>DDD = 2 · número ≥ 8</strong></section><section><small>LEITURA</small><strong>formatado · mesmoDdd</strong></section><section><small>NOVA VERSÃO</small><strong>comNumero retorna Telefone</strong></section></div>}<div className="im113-terminal"><header><Play size={15} />Compilar, testar e versionar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}7 testes passaram</pre></div><div className="im113-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Defesa oral da escolha</h3></div><ul><li>Por que Telefone é valor e não entidade?</li><li>Qual prova mostra que o original não mudou?</li><li>Por que final sozinho não bastaria para uma lista?</li><li>Quando você aceitaria mutabilidade encapsulada?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'map', label: 'Mapa da Imutabilidade', duration: '11 min', eyebrow: 'MUTÁVEL LIVRE, PROTEGIDO E IMUTÁVEL', title: 'Escolha o modelo pela semântica, não pela moda', blocks: [{ type: 'lead', text: 'Compare três formas de representar mudança e ligue imutabilidade a debug, previsibilidade, testes e efeitos colaterais.' }, { type: 'map' }] },
  { id: 'bad-client', label: 'Cliente que se Quebra', duration: '14 min', eyebrow: 'MESMA REFERÊNCIA, ESTADO INVÁLIDO', title: 'Faça um objeto válido perder suas próprias garantias', blocks: [{ type: 'lead', text: 'Setters livres deixam nome vazio e e-mail nulo depois que o Cliente já havia nascido válido.' }, { type: 'bad-client' }] },
  { id: 'immutable-client', label: 'Cliente Imutável', duration: '18 min', eyebrow: 'FINAL, CONSTRUTOR E COMEMAIL', title: 'Crie B sem alterar o Cliente A', blocks: [{ type: 'lead', text: 'O simulador separa referência original, validação, construtor da cópia e novo retorno.' }, { type: 'immutable-client' }] },
  { id: 'final', label: 'final Não Basta', duration: '13 min', eyebrow: 'REFERÊNCIA FIXA, CONTEÚDO MUTÁVEL', title: 'Veja a diferença entre final e imutabilidade profunda', blocks: [{ type: 'lead', text: 'Uma lista final não pode ser reatribuída, mas ainda pode sofrer clear se a fronteira expuser o mesmo objeto.' }, { type: 'final' }] },
  { id: 'jdk-types', label: 'Tipos Imutáveis do JDK', duration: '13 min', eyebrow: 'STRING, LOCALDATE, BIGDECIMAL E INSTANT', title: 'Acompanhe operações que retornam novos valores', blocks: [{ type: 'lead', text: 'toUpperCase, plusDays e add parecem mudanças, porém deixam o valor original observável e intacto.' }, { type: 'jdk-types' }] },
  { id: 'values', label: 'Dinheiro e Email', duration: '21 min', eyebrow: 'OBJETOS DE VALOR COM REGRA', title: 'Dê nome, validação e comportamento a conceitos importantes', blocks: [{ type: 'lead', text: 'Dinheiro centraliza escala e cálculo; Email normaliza e valida, sem permitir que o valor interno seja trocado.' }, { type: 'values' }] },
  { id: 'payment', label: 'Pagamento Versionado', duration: '18 min', eyebrow: 'PENDENTE, APROVADO E CONFIRMADO COEXISTEM', title: 'Guarde o retorno ou permaneça no estado anterior', blocks: [{ type: 'lead', text: 'A linha do tempo mostra três objetos diferentes e torna visível o erro clássico de ignorar aprovar().' }, { type: 'payment' }] },
  { id: 'record-choice', label: 'Record e Critério', duration: '16 min', eyebrow: 'VALOR, ENTIDADE, EVENTO E CICLO DE VIDA', title: 'Use record com validação e decida quando aceitar mutabilidade', blocks: [{ type: 'lead', text: 'PeriodoAgendamento demonstra record seguro; o classificador evita transformar imutabilidade em regra universal.' }, { type: 'record-choice' }] },
  { id: 'debug', label: 'Debug de Novos Objetos', duration: '14 min', eyebrow: 'ORIGINAL, CONSTRUTOR, RETORNO E REFERÊNCIA', title: 'Observe oito momentos em que criar substitui alterar', blocks: [{ type: 'lead', text: 'O mock de IDE acompanha Cliente, Dinheiro e Pagamento sem confundir valor novo com mutação do original.' }, { type: 'debug' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '11 min', eyebrow: 'FINAL, SETTER, RETORNO, IDENTIDADE E VALIDAÇÃO', title: 'Diagnostique os sete erros da aula sem decorar slogans', blocks: [{ type: 'lead', text: 'Cada caso volta à pergunta central: o objeto representa valor, entidade ou estrutura mutável interna?' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Telefone', duration: '20 min', eyebrow: 'DDD, NÚMERO, NOVA CÓPIA, TESTES E GIT', title: 'Entregue um objeto de valor imutável e prove o original', blocks: [{ type: 'lead', text: 'Telefone valida no nascimento, compara DDD, formata e usa comNumero para produzir outro objeto.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  const map = { map: MapLab, 'bad-client': BadClientLab, 'immutable-client': ImmutableClientLab, final: FinalLab, 'jdk-types': JdkTypesLab, values: ValueObjectsLab, payment: PaymentLab, 'record-choice': RecordChoiceLab, debug: DebugLab, errors: ErrorsClinic, delivery: DeliveryLab };
  const Component = map[block.type];
  return Component ? <Component /> : null;
}

export default function GuidedImmutabilityLesson113({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-immutability-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Fingerprint size={17} />Oficina de objetos previsíveis</span><p className="guided-sequence">113 · M4.09</p><h1>Quando mudar significa criar outro objeto</h1><p>Compare mutabilidade, preserve referências originais, entenda o limite de final, modele Dinheiro e Email, versione Pagamento, valide record e entregue Telefone.</p></div><div className="guided-hero-status"><Layers3 size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 113" items={[{ value: '9 fontes', label: 'Compiladas e executadas' }, { value: '8 pausas', label: 'No debug das referências' }, { value: '7 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 113"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Objetos novos, originais preservados</h3><p>{lessonComplete ? 'Aula concluída: agora você pode avançar para composição.' : 'Execute Telefone e os testes antes de concluir.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 112</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Final, valor, cópia, record e trade-offs</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 114<ArrowRight size={17} /></button></footer></article>;
}
