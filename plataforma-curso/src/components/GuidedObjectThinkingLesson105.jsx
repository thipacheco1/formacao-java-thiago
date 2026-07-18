import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Boxes, Brain, Check, CheckCircle2, Clock3, Copy, FileCode2, GitCompareArrows, ListChecks, Play, RotateCcw, Sparkles, StepForward, UserRound, Workflow } from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedObjectThinkingLesson.css';

const STORAGE_KEY = 'guided-object-thinking-lesson-105-progress';
const PROCEDURAL_SOURCE = `public class OsProcedural {
    public static void main(String[] args) {
        String certificado = "OS-001";
        String cliente = "Ana";
        String status = "ABERTA";
        int diasEmAberto = 6;
        int reagendamentos = 2;

        boolean atrasada = diasEmAberto > 3;
        boolean precisaAtencao = atrasada || reagendamentos >= 2;
        String fila = definirFila(status, atrasada, precisaAtencao);

        System.out.println("Certificado: " + certificado);
        System.out.println("Cliente: " + cliente);
        System.out.println("Status: " + status);
        System.out.println("Atrasada: " + atrasada);
        System.out.println("Precisa atenção: " + precisaAtencao);
        System.out.println("Fila: " + fila);
    }

    public static String definirFila(
            String status, boolean atrasada, boolean precisaAtencao) {
        if (status.equals("CONCLUIDA") || status.equals("CANCELADA")) {
            return "Sem fila";
        }
        if (atrasada) return "Casos Críticos";
        if (precisaAtencao) return "Reagendamento";
        return "Entrada";
    }
}`;

const OBJECT_SOURCE = `public class OsOrientadaAObjetos {
    public static void main(String[] args) {
        OrdemServico primeira = new OrdemServico(
                "OS-001", "Ana", StatusOs.ABERTA, 6, 2);
        OrdemServico segunda = new OrdemServico(
                "OS-002", "Carlos", StatusOs.CONCLUIDA, 1, 0);

        imprimirResumo(primeira);
        imprimirResumo(segunda);
    }

    public static void imprimirResumo(OrdemServico os) {
        System.out.println("Certificado: " + os.certificado());
        System.out.println("Cliente: " + os.cliente());
        System.out.println("Status: " + os.status());
        System.out.println("Atrasada: " + os.atrasada());
        System.out.println("Precisa atenção: " + os.precisaAtencao());
        System.out.println("Encerrada: " + os.encerrada());
        System.out.println("Fila: " + os.filaSugerida());
        System.out.println("---");
    }
}

enum StatusOs { ABERTA, AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }

class OrdemServico {
    private final String certificado;
    private final String cliente;
    private final StatusOs status;
    private final int diasEmAberto;
    private final int reagendamentos;

    OrdemServico(
            String certificado, String cliente, StatusOs status,
            int diasEmAberto, int reagendamentos) {
        this.certificado = certificado;
        this.cliente = cliente;
        this.status = status;
        this.diasEmAberto = diasEmAberto;
        this.reagendamentos = reagendamentos;
    }

    String certificado() { return certificado; }
    String cliente() { return cliente; }
    StatusOs status() { return status; }

    boolean atrasada() {
        return diasEmAberto > 3;
    }

    boolean precisaAtencao() {
        return atrasada() || reagendamentos >= 2;
    }

    boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
    }

    String filaSugerida() {
        if (encerrada()) return "Sem fila";
        if (atrasada()) return "Casos Críticos";
        if (precisaAtencao()) return "Reagendamento";
        return "Entrada";
    }
}`;

const ORDER_SOURCE = `import java.math.BigDecimal;

public class PedidoOoExemplo {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "Ana", "Cadeira", new BigDecimal("199.90"), 2);
        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
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

    Pedido(String cliente, String produto,
            BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente;
        this.produto = produto;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    String cliente() { return cliente; }
    String produto() { return produto; }

    BigDecimal totalBruto() {
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    BigDecimal desconto() {
        BigDecimal bruto = totalBruto();
        if (bruto.compareTo(new BigDecimal("300.00")) >= 0) {
            return bruto.multiply(new BigDecimal("0.10"));
        }
        return BigDecimal.ZERO;
    }

    BigDecimal totalFinal() {
        return totalBruto().subtract(desconto());
    }
}`;

const CLIENT_SOURCE = `public class ClienteOoExemplo {
    public static void main(String[] args) {
        Cliente primeiro = new Cliente(
                "Ana", "ana@email.com", "11999990000", true);
        Cliente segundo = new Cliente(
                "Bruno", "bruno@email.com", "", false);
        imprimir(primeiro);
        imprimir(segundo);
    }

    static void imprimir(Cliente cliente) {
        System.out.println(cliente.nome()
                + " | ativo=" + cliente.ativo()
                + " | contato=" + cliente.contatoValido()
                + " | mensagem=" + cliente.podeReceberMensagem());
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
    boolean ativo() { return ativo; }

    boolean contatoValido() {
        return email != null && !email.isBlank()
                && telefone != null && !telefone.isBlank();
    }

    boolean podeReceberMensagem() {
        return ativo && contatoValido();
    }
}`;

const TEST_SOURCE = `import java.math.BigDecimal;

public class TestePensamentoOo {
    public static void main(String[] args) {
        OrdemServico aberta = new OrdemServico(
                "OS-1", "Ana", StatusOs.ABERTA, 6, 2);
        OrdemServico concluida = new OrdemServico(
                "OS-2", "Ana", StatusOs.CONCLUIDA, 1, 0);
        exigir(aberta.atrasada(), "atraso");
        exigir(aberta.precisaAtencao(), "atenção");
        exigir(!aberta.encerrada(), "aberta");
        exigir(aberta.filaSugerida().equals("Casos Críticos"), "críticos");
        exigir(concluida.encerrada(), "encerrada");
        exigir(concluida.filaSugerida().equals("Sem fila"), "sem fila");
        exigir(!aberta.certificado().equals(concluida.certificado()), "identidade");

        Pedido pedido = new Pedido(
                "Ana", "Cadeira", new BigDecimal("199.90"), 2);
        exigir(pedido.totalBruto().equals(new BigDecimal("399.80")), "bruto");
        exigir(pedido.desconto().equals(new BigDecimal("39.9800")), "desconto");
        exigir(pedido.totalFinal().equals(new BigDecimal("359.8200")), "final");

        Cliente cliente = new Cliente(
                "Ana", "ana@email.com", "11999990000", true);
        exigir(cliente.contatoValido(), "contato");
        exigir(cliente.podeReceberMensagem(), "mensagem");
        System.out.println("TESTES OK: 12 evidências");
    }

    static void exigir(boolean condicao, String evidencia) {
        if (!condicao) throw new AssertionError(evidencia);
    }
}`;

const ERRORS = [
  ['Classe é só arquivo', 'O aluno fala apenas em .java e não consegue descrever o conceito modelado.', 'Defina a classe como molde de estado e comportamento; o arquivo é apenas suporte físico.'],
  ['Objeto é variável comum', 'os é tratado como cinco valores soltos sem estado próprio.', 'Leia os como referência para uma instância concreta criada com new.'],
  ['Classe sem comportamento', 'A OS vira um saco público de campos e todas as regras continuam fora.', 'Mova perguntas coerentes sobre o próprio estado, como atrasada e encerrada.'],
  ['Deus objeto', 'OrdemServico lê console, imprime, salva, chama HTTP e gera relatório.', 'Mantenha nela somente comportamento pertencente ao conceito da OS.'],
  ['Classe e objeto confundidos', 'OrdemServico e os são descritos como a mesma coisa.', 'OrdemServico define o tipo; os referencia uma ocorrência concreta em memória.'],
  ['Identidade ignorada', 'OS-001 e OS-002 são consideradas iguais porque cliente e status coincidem.', 'Use certificado como chave de negócio que distingue ocorrências.'],
  ['Método sem usar estado', 'atrasada recebe todos os campos da própria OS como parâmetros.', 'O método de instância consulta diasEmAberto diretamente no objeto.'],
  ['OO apaga o procedural', 'O aluno evita if, método e laço porque agora tudo “é objeto”.', 'Objetos organizam conceitos; fundamentos procedurais continuam implementando o comportamento.'],
];

const EVIDENCE = `# Aula 105 — Pensamento orientado a objetos

- [ ] Expliquei a mudança de passos para conceitos
- [ ] Diferenciei classe e objeto com exemplo próprio
- [ ] Localizei estado, comportamento e identidade
- [ ] Executei OsProcedural e OsOrientadaAObjetos
- [ ] Comparei as saídas equivalentes
- [ ] Criei duas OS com estado independente
- [ ] Alterei o limite de atraso nos dois modelos
- [ ] Implementei encerrada() e reutilizei na fila
- [ ] Separei comportamento de domínio e infraestrutura
- [ ] Identifiquei substantivos e verbos no enunciado
- [ ] Executei PedidoOoExemplo
- [ ] Depurei quatro chamadas no objeto
- [ ] Modelei e executei ClienteOoExemplo
- [ ] Executei TestePensamentoOo
- [ ] Revisei git status, .class e commit`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return <button type="button" className="guided-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

function MindsetLab() {
  const [mode, setMode] = useState('procedural');
  const procedural = [['Entrada', 'cinco valores'], ['Validar', 'função recebe dados'], ['Calcular', 'função aplica regra'], ['Exibir', 'função imprime resultado']];
  const objects = [['OrdemServico', 'conceito do problema'], ['Estado', 'dados pertencem à OS'], ['Comportamento', 'a OS responde perguntas'], ['Identidade', 'certificado distingue objetos']];
  const items = mode === 'procedural' ? procedural : objects;
  return <section className="oo105-stack"><div className="oo105-toggle"><button type="button" className={mode === 'procedural' ? 'active' : ''} onClick={() => setMode('procedural')}>Pensar em passos</button><button type="button" className={mode === 'objects' ? 'active' : ''} onClick={() => setMode('objects')}>Pensar em objetos</button></div><div className="oo105-mindset">{items.map((item, index) => <article key={item[0]}><span>{index + 1}</span><strong>{item[0]}</strong><small>{item[1]}</small></article>)}</div><div className="oo105-focus"><Brain /><div><strong>{mode === 'procedural' ? 'Quais passos o programa executa?' : 'Quais coisas existem no problema?'}</strong><span>{mode === 'procedural' ? 'Continua útil: métodos e condições implementam o fluxo.' : 'O centro muda: dados e comportamentos coerentes passam a representar um conceito.'}</span></div></div></section>;
}

function AnatomyLab() {
  const [selected, setSelected] = useState('class');
  const concepts = {
    class: ['Classe', 'Molde OrdemServico', 'define os dados e comportamentos disponíveis'], object: ['Objeto', 'OS-001 da Ana', 'ocorrência concreta criada em memória'], state: ['Estado', 'ABERTA · 6 dias · 2 reagendamentos', 'valores atuais daquela ocorrência'], behavior: ['Comportamento', 'atrasada() · precisaAtencao()', 'perguntas respondidas usando o próprio estado'], identity: ['Identidade', 'certificado OS-001', 'distingue esta OS de outra com dados parecidos'],
  };
  const current = concepts[selected];
  return <section className="oo105-stack"><div className="oo105-anatomy"><nav>{Object.entries(concepts).map(([key, value], index) => <button type="button" key={key} className={selected === key ? 'active' : ''} onClick={() => setSelected(key)}><span>{index + 1}</span>{value[0]}</button>)}</nav><main><Boxes /><div><small>{current[0].toUpperCase()}</small><strong>{current[1]}</strong><p>{current[2]}.</p></div></main></div><article className="oo105-rule"><CheckCircle2 /><div><strong>Mesma classe, objetos diferentes</strong><span>OS-001 e OS-002 obedecem ao molde OrdemServico, mas cada uma preserva identidade e estado próprios.</span></div></article></section>;
}

function ComparisonLab() {
  const [mode, setMode] = useState('procedural');
  const source = mode === 'procedural' ? PROCEDURAL_SOURCE : OBJECT_SOURCE;
  return <section className="oo105-stack"><div className="oo105-toggle"><button type="button" className={mode === 'procedural' ? 'active' : ''} onClick={() => setMode('procedural')}>Antes · dados por funções</button><button type="button" className={mode === 'object' ? 'active' : ''} onClick={() => setMode('object')}>Depois · objeto com regras</button></div><CodePanel name={mode === 'procedural' ? 'OsProcedural.java' : 'OsOrientadaAObjetos.java'} code={source} /><article className="oo105-rule"><GitCompareArrows /><div><strong>A saída não é o principal contraste</strong><span>Ambos funcionam; compare onde os dados vivem, quem conhece a regra e como dez OS seriam representadas.</span></div></article></section>;
}

function ObjectMemoryLab() {
  const [selected, setSelected] = useState(0);
  const objects = [
    { ref: 'primeira', id: 'OS-001', client: 'Ana', status: 'ABERTA', days: 6, reschedules: 2 }, { ref: 'segunda', id: 'OS-002', client: 'Carlos', status: 'CONCLUIDA', days: 1, reschedules: 0 },
  ];
  const current = objects[selected];
  const closed = current.status === 'CONCLUIDA' || current.status === 'CANCELADA';
  const delayed = current.days > 3;
  const attention = delayed || current.reschedules >= 2;
  const queue = closed ? 'Sem fila' : delayed ? 'Casos Críticos' : attention ? 'Reagendamento' : 'Entrada';
  return <section className="oo105-stack"><div className="oo105-memory"><aside>{objects.map((item, index) => <button type="button" key={item.id} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{item.ref}</span><strong>{item.id}</strong><small>referência → objeto #{index + 1}</small></button>)}</aside><main><header><Boxes /><strong>Heap · OrdemServico #{selected + 1}</strong></header><dl><dt>certificado</dt><dd>{current.id}</dd><dt>cliente</dt><dd>{current.client}</dd><dt>status</dt><dd>{current.status}</dd><dt>diasEmAberto</dt><dd>{current.days}</dd><dt>reagendamentos</dt><dd>{current.reschedules}</dd></dl><footer>atrasada() → {String(delayed)} · precisaAtencao() → {String(attention)} · filaSugerida() → <b>{queue}</b></footer></main></div><article className="oo105-rule"><Boxes /><div><strong>A variável guarda uma referência</strong><span>Trocar de primeira para segunda seleciona outro objeto; o estado da primeira não é sobrescrito.</span></div></article></section>;
}

function BoundaryLab() {
  const [selected, setSelected] = useState(0);
  const items = [
    ['atrasada()', 'Dentro', 'responde sobre dias da própria OS'], ['precisaAtencao()', 'Dentro', 'combina o próprio atraso e reagendamentos'], ['filaSugerida()', 'Dentro', 'decisão operacional diretamente derivada do estado'], ['ler do console', 'Fora', 'depende da forma de entrada'], ['System.out', 'Fora', 'é apresentação'], ['salvar no banco', 'Fora', 'é infraestrutura/persistência'], ['enviar WhatsApp', 'Fora', 'é integração externa'], ['abrir HTTP', 'Fora', 'é comunicação de rede'],
  ];
  const current = items[selected];
  return <section className="oo105-stack"><div className="oo105-boundary"><nav>{items.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{item[1]}</span>{item[0]}</button>)}</nav><main><small>{current[1] === 'Dentro' ? 'PERTENCE AO CONCEITO' : 'DEPENDE DE UMA BORDA'}</small><strong>{current[0]}</strong><p>{current[2]}.</p></main></div><article className="oo105-rule"><Workflow /><div><strong>Objeto rico não é objeto que faz tudo</strong><span>Comportamento de domínio fica perto do estado; entrada, saída e infraestrutura ganham outras responsabilidades.</span></div></article></section>;
}

function DiscoveryLab() {
  const [selected, setSelected] = useState('nouns');
  const nouns = [['OrdemServico', 'forte candidato'], ['Cliente', 'conceito relacionado'], ['FilaAtendimento', 'destino operacional'], ['ResumoAtendimento', 'resultado consolidado']];
  const verbs = [['estar atrasada', 'OrdemServico'], ['precisar de atenção', 'OrdemServico'], ['ler do console', 'borda de entrada'], ['imprimir resumo', 'apresentação'], ['salvar OS', 'persistência']];
  const items = selected === 'nouns' ? nouns : verbs;
  return <section className="oo105-stack"><blockquote className="oo105-statement">“O sistema recebe uma ordem de serviço de um cliente, calcula sua fila e gera um resumo de atendimento.”</blockquote><div className="oo105-toggle"><button type="button" className={selected === 'nouns' ? 'active' : ''} onClick={() => setSelected('nouns')}>Substantivos · candidatos</button><button type="button" className={selected === 'verbs' ? 'active' : ''} onClick={() => setSelected('verbs')}>Verbos · responsabilidades</button></div><div className="oo105-discovery">{items.map((item, index) => <article key={item[0]}><span>{index + 1}</span><strong>{item[0]}</strong><small>{item[1]}</small></article>)}</div><article className="oo105-rule"><AlertTriangle /><div><strong>Nem todo substantivo vira classe</strong><span>O texto produz candidatos; regras, identidade e responsabilidade decidem se o conceito merece um tipo próprio.</span></div></article></section>;
}

function OrderLab() {
  const [quantity, setQuantity] = useState(2);
  const [price, setPrice] = useState('199.90');
  const gross = Number(price) * Number(quantity);
  const discount = gross >= 300 ? gross * .1 : 0;
  return <section className="oo105-stack"><div className="oo105-order"><header><strong>Pedido · estado e informações derivadas</strong><span>O objeto não armazena total, desconto ou final: ele calcula quando perguntado.</span></header><div><label>Preço unitário<input type="number" step="0.01" value={price} onChange={event => setPrice(event.target.value)} /></label><label>Quantidade<input type="number" min="1" value={quantity} onChange={event => setQuantity(event.target.value)} /></label><output><span>totalBruto()</span><b>{gross.toFixed(2)}</b><span>desconto()</span><b>{discount.toFixed(2)}</b><span>totalFinal()</span><b>{(gross - discount).toFixed(2)}</b></output></div></div><CodePanel name="PedidoOoExemplo.java" code={ORDER_SOURCE} /></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [
    ['imprimirResumo', 'os → OrdemServico@1 · OS-001', 'main'], ['atrasada', 'diasEmAberto = 6 → true', 'imprimirResumo'], ['precisaAtencao', 'atrasada() || 2 >= 2 → true', 'imprimirResumo'], ['filaSugerida', 'encerrada false · atrasada true → Casos Críticos', 'imprimirResumo'], ['imprimirResumo', 'os → OrdemServico@2 · OS-002', 'main'],
  ];
  const current = trace[pause];
  return <section className="oo105-stack"><div className="oo105-debug"><header><span>OsOrientadaAObjetos.java · Debug</span><span>Step Into · F7</span></header><div><aside>{trace.map((item, index) => <button type="button" key={index} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>VARIABLES / THIS / FRAMES</small><strong>{current[0]}</strong><code>{current[1]}</code><span>chamador: {current[2]}</span><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => Math.min(value + 1, trace.length - 1))}><StepForward size={15} />Próxima pausa</button></main></div><footer>Na segunda chamada, confirme que `os` referencia outra instância com estado independente.</footer></div></section>;
}

function ClientChallengeLab() {
  const [view, setView] = useState('contract');
  return <section className="oo105-stack"><div className="oo105-toggle"><button type="button" className={view === 'contract' ? 'active' : ''} onClick={() => setView('contract')}>Modele antes de abrir</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Modelo após tentar</button></div>{view === 'code' ? <CodePanel name="ClienteOoExemplo.java" code={CLIENT_SOURCE} /> : <div className="oo105-client"><UserRound /><section><small>ESTADO</small><strong>nome · email · telefone · ativo</strong></section><section><small>COMPORTAMENTO</small><strong>ativo() · contatoValido() · podeReceberMensagem()</strong></section><section><small>DOIS OBJETOS</small><strong>ativo e completo · inativo ou sem telefone</strong></section></div>}<article className="oo105-rule"><Sparkles /><div><strong>A regra usa o estado do próprio cliente</strong><span>podeReceberMensagem combina ativo e contatoValido sem receber novamente email, telefone ou flag como parâmetros.</span></div></article></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors oo105-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const checks = ['mudança mental explicada', 'cinco conceitos diferenciados', 'quatro fontes criadas', 'saídas comparadas', 'duas OS independentes', 'limite alterado em dois modelos', 'encerrada() reutilizado', 'fronteiras classificadas', 'substantivos e verbos analisados', 'Pedido executado', 'cinco frames depurados', 'Cliente modelado', '12 testes executados', 'três respostas registradas', 'Git e .class revisados'];
  const commands = ['javac OsProcedural.java OsOrientadaAObjetos.java', 'javac PedidoOoExemplo.java ClienteOoExemplo.java', 'javac TestePensamentoOo.java', 'java OsProcedural', 'java OsOrientadaAObjetos', 'java PedidoOoExemplo', 'java ClienteOoExemplo', 'java TestePensamentoOo', 'git status', 'git add labs/m4/aula-105-pensamento-orientado-a-objetos', 'git commit -m "Aula 105: inicia pensamento orientado a objetos"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="oo105-delivery"><div className="oo105-terminal"><header><Play size={15} />Compilar quatro exemplos, testes e Git<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}</pre></div><CodePanel name="TestePensamentoOo.java" code={TEST_SOURCE} /><div className="oo105-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Registro: diga com suas palavras</h3></div><ul><li>Qual é a diferença entre classe e objeto?</li><li>Qual estado uma OrdemServico possui?</li><li>Qual comportamento pertence naturalmente a uma OrdemServico?</li><li>Por que ler, imprimir e salvar não pertencem automaticamente ao objeto?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'mindset', label: 'Mudança de Mentalidade', duration: '10 min', eyebrow: 'DE PASSOS SOLTOS A CONCEITOS', title: 'Mude a pergunta central sem abandonar os fundamentos', blocks: [{ type: 'lead', text: 'Pensamento procedural pergunta pelo fluxo; pensamento OO procura as coisas do problema e as responsabilidades que realmente lhes pertencem.' }, { type: 'mindset' }] },
  { id: 'anatomy', label: 'Anatomia de um Objeto', duration: '13 min', eyebrow: 'CLASSE, OBJETO, ESTADO, COMPORTAMENTO E IDENTIDADE', title: 'Diferencie os cinco conceitos em uma única Ordem de Serviço', blocks: [{ type: 'lead', text: 'Cada palavra descreve uma parte distinta do modelo; trocar os termos impede entender o desenho do sistema.' }, { type: 'anatomy' }] },
  { id: 'comparison', label: 'Procedural × OO', duration: '20 min', eyebrow: 'DOIS PROGRAMAS, UMA REGRA', title: 'Compare organização e intenção com código executável', blocks: [{ type: 'lead', text: 'A saída pode ser semelhante enquanto o centro do raciocínio muda de variáveis separadas para OrdemServico.' }, { type: 'comparison' }] },
  { id: 'memory', label: 'Dois Objetos em Memória', duration: '12 min', eyebrow: 'REFERÊNCIA, INSTÂNCIA E ESTADO INDEPENDENTE', title: 'Veja duas ocorrências obedecerem ao mesmo molde', blocks: [{ type: 'lead', text: 'A classe é única, mas primeira e segunda apontam para instâncias com identidade e valores próprios.' }, { type: 'memory' }] },
  { id: 'boundary', label: 'O que Pertence ao Objeto', duration: '12 min', eyebrow: 'DOMÍNIO VERSUS BORDA E INFRAESTRUTURA', title: 'Evite tanto o saco de dados quanto o deus objeto', blocks: [{ type: 'lead', text: 'Comportamentos sobre o próprio estado podem pertencer à OS; console, banco e HTTP possuem outros motivos de mudança.' }, { type: 'boundary' }] },
  { id: 'discovery', label: 'Descobrir Candidatos', duration: '11 min', eyebrow: 'SUBSTANTIVOS, VERBOS E RESPONSABILIDADES', title: 'Extraia candidatos do enunciado sem transformar cada palavra em classe', blocks: [{ type: 'lead', text: 'Substantivos sugerem conceitos; verbos ajudam a perguntar quem deveria conhecer ou executar cada decisão.' }, { type: 'discovery' }] },
  { id: 'order', label: 'Pedido com Comportamento', duration: '14 min', eyebrow: 'BIGDECIMAL E VALORES DERIVADOS', title: 'Transfira a mesma forma de pensar para outro domínio', blocks: [{ type: 'lead', text: 'Pedido conhece preço e quantidade e sabe derivar bruto, desconto e total final sem armazenar valores redundantes.' }, { type: 'order' }] },
  { id: 'debug', label: 'Debug de Objetos', duration: '13 min', eyebrow: 'THIS, ESTADO E CALL STACK', title: 'Entre nos métodos e confirme qual instância está respondendo', blocks: [{ type: 'lead', text: 'O mesmo código de atrasada executa para objetos diferentes; o estado selecionado muda o resultado.' }, { type: 'debug' }] },
  { id: 'client', label: 'Desafio Cliente', duration: '15 min', eyebrow: 'MODELAGEM, DOIS OBJETOS E TRÊS COMPORTAMENTOS', title: 'Modele um novo conceito sem copiar a Ordem de Serviço', blocks: [{ type: 'lead', text: 'O desafio comprova que você consegue identificar estado e escrever comportamento coerente em outro problema.' }, { type: 'client' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'MODELO ANÊMICO, DEUS OBJETO E IDENTIDADE', title: 'Diagnostique oito confusões comuns na entrada em OO', blocks: [{ type: 'lead', text: 'Cada caso separa erro de sintaxe de erro de modelagem e mostra a pergunta correta de recuperação.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Ponte', duration: '17 min', eyebrow: 'EXEMPLOS, TESTES, REFLEXÃO E GIT', title: 'Entregue evidências de que o olhar mudou', blocks: [{ type: 'lead', text: 'A conclusão exige explicar, comparar, criar objetos independentes, classificar fronteiras e aplicar a ideia em Cliente.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'mindset') return <MindsetLab />;
  if (block.type === 'anatomy') return <AnatomyLab />;
  if (block.type === 'comparison') return <ComparisonLab />;
  if (block.type === 'memory') return <ObjectMemoryLab />;
  if (block.type === 'boundary') return <BoundaryLab />;
  if (block.type === 'discovery') return <DiscoveryLab />;
  if (block.type === 'order') return <OrderLab />;
  if (block.type === 'debug') return <DebugLab />;
  if (block.type === 'client') return <ClientChallengeLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedObjectThinkingLesson105({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-object-thinking-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Boxes size={17} />Entrada em Orientação a Objetos</span><p className="guided-sequence">105 · M4.01</p><h1>Pare de enxergar apenas passos; comece a enxergar conceitos</h1><p>Transforme Ordem de Serviço em classe e objetos com estado, comportamento e identidade, sem cair no saco de dados nem no objeto que faz tudo.</p></div><div className="guided-hero-status"><Boxes size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 105" items={[{ value: '5 conceitos', label: 'Separados visualmente' }, { value: '5 fontes', label: 'Compiladas e verificadas' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 105"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>O olhar orientado a objetos começou</h3><p>{lessonComplete ? 'Aula concluída: agora você pode modelar substantivos, verbos e regras no papel.' : 'Confira exemplos e evidências antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 104</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Classe, objeto, estado, comportamento e identidade</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 106<ArrowRight size={17} /></button></footer></article>;
}
