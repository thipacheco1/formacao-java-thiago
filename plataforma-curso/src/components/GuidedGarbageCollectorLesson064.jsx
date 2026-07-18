import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  FileCode2,
  Gauge,
  GitBranch,
  HardDrive,
  Lightbulb,
  Link2,
  ListChecks,
  Recycle,
  RotateCcw,
  Server,
  Sparkles,
  Terminal,
  TimerReset,
  Trash2,
  Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedGarbageCollectorLesson.css';

const STORAGE_KEY = 'guided-garbage-collector-lesson-064-progress';

const MAIN_PROGRAM = `import java.util.Arrays;

public class LaboratorioGcConceitual {
    static OrdemServico ultimaOs;

    public static void main(String[] args) {
        processarTemporario("Ana");

        Pedido retornado = criarPedido("Bruno");
        System.out.println("retornado: " + retornado.cliente);

        processarOs("OS-001");
        processarOs("OS-002");
        System.out.println("ultima OS: " + ultimaOs.certificado);

        Pedido[] fila = {criarPedido("Carla"), criarPedido("Diego")};
        fila[0] = null;
        System.out.println("fila[0] removida: " + (fila[0] == null));

        CacheLimitado cache = new CacheLimitado(3);
        cache.adicionar("P1");
        cache.adicionar("P2");
        cache.adicionar("P3");
        cache.adicionar("P4");
        System.out.println("cache: " + cache);

        System.gc();
        System.out.println("System.gc solicitado; coleta nao garantida");
    }

    static void processarTemporario(String cliente) {
        Pedido pedido = criarPedido(cliente);
        System.out.println("temporario: " + pedido.cliente);
    }

    static Pedido criarPedido(String cliente) {
        Pedido pedido = new Pedido();
        pedido.cliente = cliente;
        return pedido;
    }

    static void processarOs(String certificado) {
        OrdemServico os = new OrdemServico();
        os.certificado = certificado;
        ultimaOs = os;
    }
}

class Pedido {
    String cliente;
}

class OrdemServico {
    String certificado;
}

class CacheLimitado {
    private final String[] itens;
    private int quantidade;

    CacheLimitado(int capacidade) {
        itens = new String[capacidade];
    }

    void adicionar(String item) {
        if (quantidade == itens.length) {
            for (int i = 1; i < itens.length; i++) itens[i - 1] = itens[i];
            quantidade--;
        }
        itens[quantidade++] = item;
    }

    public String toString() {
        return Arrays.toString(itens);
    }
}`;

const EXPECTED_OUTPUT = `temporario: Ana
retornado: Bruno
ultima OS: OS-002
fila[0] removida: true
cache: [P2, P3, P4]
System.gc solicitado; coleta nao garantida`;

const EVIDENCE = `# Aula 064 — Garbage Collector Conceitual

- [ ] Desenhei raízes, referências e objetos alcançáveis
- [ ] Diferenciei elegível de coletado imediatamente
- [ ] Provei escopo, retorno, sobrescrita e null
- [ ] Expliquei por que campo estático retém objeto
- [ ] Comparei cache sem limite e cache limitado
- [ ] Removi referência de array/fila reaproveitada
- [ ] Diferenciei objetos temporários de objetos retidos
- [ ] Expliquei por que System.gc é apenas solicitação
- [ ] Separei memória do heap e recurso externo
- [ ] Listei sintomas sem diagnosticar por chute
- [ ] Executei o programa e conferi seis saídas
- [ ] Revisei .gitignore, diff staged e commit`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="gc64-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java' }) {
  return <section className="guided-file gc64-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

const REACH_CASES = {
  local: { label: 'Escopo termina', roots: [], frames: [], objects: [{ id: 'A', text: 'Pedido Ana', state: 'eligible' }], action: 'processarPedido() terminou', explanation: 'A referência local desapareceu com o frame. Sem outro caminho até A, o objeto ficou elegível.' },
  returned: { label: 'Objeto retornado', roots: [], frames: ['main.pedido → B'], objects: [{ id: 'B', text: 'Pedido Bruno', state: 'reachable' }], action: 'Pedido pedido = criarPedido()', explanation: 'O frame criador terminou, mas main recebeu a referência. B continua alcançável.' },
  overwritten: { label: 'Sobrescrita', roots: [], frames: ['main.cliente → D'], objects: [{ id: 'C', text: 'Cliente Ana', state: 'eligible' }, { id: 'D', text: 'Cliente Bruno', state: 'reachable' }], action: 'cliente = new Cliente("Bruno")', explanation: 'A variável passou de C para D. Sem outra referência, C ficou elegível.' },
  null: { label: 'Referência null', roots: [], frames: ['main.cliente = null'], objects: [{ id: 'E', text: 'Cliente antes apontado', state: 'eligible' }], action: 'cliente = null', explanation: 'null removeu este caminho. Não é necessário anular toda variável: um escopo curto normalmente basta.' },
  static: { label: 'Campo estático', roots: ['Main.ultimoPedido → F'], frames: [], objects: [{ id: 'F', text: 'Pedido ainda retido', state: 'reachable' }], action: 'static Pedido ultimoPedido', explanation: 'Uma raiz estática mantém F alcançável pelo tempo em que o campo apontar para ele, mesmo sem utilidade de negócio.' },
};

function ReachabilityLab() {
  const [mode, setMode] = useState('returned');
  const item = REACH_CASES[mode];
  return <section className="gc64-reach-lab"><div className="gc64-tabs">{Object.entries(REACH_CASES).map(([key, value]) => <button type="button" key={key} className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>{value.label}</button>)}</div><div className="gc64-reach-board" role="img" aria-label={`Grafo conceitual de alcançabilidade: ${item.explanation}`}><section><header><GitBranch size={17} /><strong>Raízes e frames vivos</strong></header>{item.roots.map(root => <code key={root}>{root}</code>)}{item.frames.map(frame => <code key={frame}>{frame}</code>)}{item.roots.length + item.frames.length === 0 && <span className="gc64-empty">nenhum caminho vivo até o objeto</span>}</section><ArrowRight /><section><header><Boxes size={17} /><strong>Heap conceitual</strong></header>{item.objects.map(object => <article key={object.id} className={object.state}><span>objeto {object.id}</span><strong>{object.text}</strong><small>{object.state === 'reachable' ? 'alcançável — GC não coleta' : 'não alcançável — elegível'}</small></article>)}</section></div><div className="gc64-current"><code>{item.action}</code><p>{item.explanation}</p></div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>GC entende alcançabilidade, não utilidade</strong><p>As letras são identidades simbólicas. Um objeto ainda referenciado não será considerado lixo apenas porque a regra de negócio já terminou com ele.</p></div></aside></section>;
}

const COLLECTION_STATES = [
  ['Alcançável', 'objeto A recebe caminhos vivos', 'Não pode ser coletado'],
  ['Referência removida', 'o último caminho até A desaparece', 'Estado controlado pelo código'],
  ['Elegível', 'A não é mais alcançável', 'Pode ser coletado futuramente'],
  ['GC decide', 'runtime avalia necessidade e estratégia', 'Momento não é garantido'],
  ['Memória reutilizável', 'se A for coletado, espaço pode ser recuperado', 'Não observável pela simples atribuição null'],
];

function CollectionLab() {
  const [index, setIndex] = useState(0);
  const item = COLLECTION_STATES[index];
  return <section className="gc64-collection-lab"><div className="gc64-collection-track">{COLLECTION_STATES.map((state, stateIndex) => <button type="button" key={state[0]} className={stateIndex === index ? 'active' : stateIndex < index ? 'visited' : ''} onClick={() => setIndex(stateIndex)}><span>{stateIndex + 1}</span><strong>{state[0]}</strong></button>)}</div><div className="gc64-collector-stage"><Recycle size={42} /><div><small>{item[0]}</small><h3>{item[1]}</h3><p>{item[2]}</p></div></div><div className="gc64-system-gc"><article><code>System.gc();</code><strong>solicitação</strong><span>A JVM pode considerar a sugestão; sua lógica não pode depender de coleta imediata.</span></article><article><code>objeto = null;</code><strong>remove uma referência</strong><span>Não executa o coletor e só torna elegível se era o último caminho.</span></article></div></section>;
}

function RetentionLab() {
  const [bounded, setBounded] = useState(true);
  const [items, setItems] = useState(['P1', 'P2']);
  const add = () => setItems(current => {
    const next = [...current, `P${Number(current.at(-1)?.slice(1) || 0) + 1}`];
    return bounded ? next.slice(-5) : next;
  });
  const consume = () => setItems(current => current.slice(1));
  const reset = () => setItems(['P1', 'P2']);
  return <section className="gc64-retention-lab"><div className="gc64-retention-controls"><button type="button" className={bounded ? 'active' : ''} onClick={() => setBounded(true)}>Histórico limitado a 5</button><button type="button" className={!bounded ? 'danger active' : ''} onClick={() => setBounded(false)}>Cache sem limite</button><button type="button" onClick={add}>Adicionar objeto</button><button type="button" onClick={consume} disabled={!items.length}>Consumir e remover ref</button><button type="button" onClick={reset}><RotateCcw size={15} />Reiniciar</button></div><div className="gc64-retention-map"><section><header><Server size={17} />{bounded ? 'Estrutura com política' : 'static cache sem expiração'}</header><div>{items.length ? items.map((item, index) => <article key={`${item}-${index}`}><Link2 size={14} /><strong>{item}</strong><small>ref mantida</small></article>) : <span>estrutura vazia</span>}</div></section><section className={bounded ? 'healthy' : 'risk'}><Gauge size={31} /><strong>{items.length} objetos alcançáveis</strong><span>{bounded ? 'Ao exceder 5, a referência mais antiga é removida.' : 'O GC não pode liberar nenhum item enquanto o cache mantiver as referências.'}</span></section></div><p className="gc64-proof"><CheckCircle2 size={18} />Limite por tamanho, tempo, expiração, remoção manual ou persistência externa é decisão de design — não trabalho automático do GC.</p></section>;
}

const PRESSURE_CASES = {
  temporary: { label: 'Objetos temporários', retained: 1, allocated: 8, gc: 'muitos podem se tornar elegíveis', symptom: 'alocação e trabalho de GC, sem retenção crescente por si só' },
  retained: { label: 'Fila acumulando', retained: 8, allocated: 8, gc: 'nenhum item da fila é elegível', symptom: 'memória cresce porque referências continuam vivas' },
  smallHeap: { label: 'Heap insuficiente', retained: 5, allocated: 8, gc: 'coleta não libera o necessário', symptom: 'alocação pode terminar em OutOfMemoryError' },
};

function PressureLab() {
  const [mode, setMode] = useState('temporary');
  const item = PRESSURE_CASES[mode];
  return <section className="gc64-pressure-lab"><div className="gc64-tabs">{Object.entries(PRESSURE_CASES).map(([key, value]) => <button type="button" key={key} className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>{value.label}</button>)}</div><div className="gc64-pressure-meter"><header><span>Objetos criados: {item.allocated}</span><span>Objetos retidos: {item.retained}</span></header><div>{Array.from({ length: item.allocated }, (_, index) => <i key={index} className={index < item.retained ? 'retained' : 'eligible'} aria-label={index < item.retained ? 'objeto retido' : 'objeto elegível'} />)}</div></div><div className="gc64-pressure-detail"><article><small>O que o GC enxerga</small><strong>{item.gc}</strong></article><article><small>Sintoma possível</small><strong>{item.symptom}</strong></article></div><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Não provoque OutOfMemoryError nesta prática</strong><p>Memória crescendo, GC mais frequente, pausas, degradação após horas e reinício de container são sinais para investigar com métricas, logs e profiler — não prova isolada nem motivo automático para apenas aumentar o heap.</p></div></aside></section>;
}

const RUNTIME_CODE = `Runtime runtime = Runtime.getRuntime();
long total = runtime.totalMemory();
long livre = runtime.freeMemory();
long usada = total - livre;

System.out.println("Memória usada: " + usada);

byte[] dados = new byte[10_000_000];
dados = null;
System.gc(); // solicitação, não prova de coleta`;

function ObservationLab() {
  return <section className="gc64-observation"><CodePanel name="ObservacaoMemoria.java · trecho didático" code={RUNTIME_CODE} /><div className="gc64-observation-rules"><article><Gauge size={22} /><strong>Números variam</strong><p>Heap total, livre e usado dependem do runtime, carga e momento.</p></article><article><TimerReset size={22} /><strong>Uma leitura não é tendência</strong><p>Compare séries ao longo do tempo; não conclua vazamento por uma oscilação.</p></article><article><Recycle size={22} /><strong>System.gc não comprova</strong><p>A leitura posterior não revela sozinha quando ou como o coletor atuou.</p></article></div></section>;
}

const RESOURCES = [
  ['Objeto Pedido', 'memória do heap', 'GC pode recuperar quando não alcançável', 'nenhum close manual de memória'],
  ['Arquivo/Stream', 'handle do sistema operacional', 'GC não substitui fechamento determinístico', 'try-with-resources / close'],
  ['Conexão de banco', 'sessão e socket externos', 'objeto Java elegível não devolve corretamente a conexão ao pool', 'fechar/devolver ao pool'],
  ['Socket HTTP', 'conexão de rede', 'memória e transporte têm ciclos de vida diferentes', 'API/biblioteca de fechamento'],
];

function ResourceLab() {
  const [selected, setSelected] = useState(0);
  const item = RESOURCES[selected];
  return <section className="gc64-resource-lab"><div>{RESOURCES.map((resource, index) => <button type="button" key={resource[0]} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>{resource[0]}</button>)}</div><article><HardDrive size={35} /><small>{item[1]}</small><h3>{item[0]}</h3><p>{item[2]}.</p><div><strong>Responsabilidade do desenvolvedor</strong><span>{item[3]}</span></div></article></section>;
}

const DOMAINS = [
  ['Pedido temporário', 'processarPedido()', 'O frame termina e o pedido não é retornado: fica elegível.'],
  ['Produto em cache', 'produtoEmCache = null', 'A referência estática é removida quando a política decide invalidar o cache.'],
  ['Pagamento', 'calcularParcela(valor, parcelas)', 'Evita criar objeto temporário quando parâmetros e retorno expressam toda a regra.'],
  ['Ordem de serviço', 'ultimaOs = os', 'Sobrescrever a referência global pode tornar a OS anterior elegível.'],
  ['Mensageria', 'fila[indice] = null', 'Consumir inclui remover a referência da estrutura reaproveitada.'],
  ['Auditoria', 'persistir e liberar', 'Guardar tudo em memória indefinidamente é retenção; auditoria real pede armazenamento apropriado.'],
];

function DomainsLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return <section className="gc64-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>DECISÃO DE RETENÇÃO</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}</p><div><strong>Pergunta profissional</strong><span>Qual referência mantém este objeto vivo, por quanto tempo e por qual regra observável?</span></div></article></section>;
}

const ERRORS = [
  ['GC entende utilidade', 'O objeto não é mais útil, mas continua em lista estática.', 'GC entende caminhos de referência; remova a retenção pela regra correta.'],
  ['Elegível é igual a coletado', 'O código espera memória liberada imediatamente.', 'Trate elegibilidade como permissão futura, sem depender do momento.'],
  ['System.gc como solução', 'A aplicação chama GC após cada operação.', 'Corrija alocação/retenção e use observabilidade; a chamada é só sugestão.'],
  ['Cache sem limite', 'Cada chave nova permanece alcançável indefinidamente.', 'Defina capacidade, expiração, remoção e métricas.'],
  ['Campo estático desnecessário', 'Um objeto temporário vive durante toda a aplicação.', 'Mantenha no menor escopo ou elimine o campo.'],
  ['GC fecha recurso externo', 'Arquivo, socket ou conexão permanece aberto.', 'Use fechamento determinístico; memória e recurso externo são ciclos distintos.'],
  ['Objeto sem necessidade', 'Uma classe temporária existe apenas para dividir dois números.', 'Prefira parâmetros e retorno quando expressam melhor o cálculo.'],
  ['Slot antigo não limpo', 'Array/fila reutilizada ainda aponta para item consumido.', 'Remova a referência ao retirar o elemento.'],
  ['Sintoma ignorado', 'Memória, pausas e latência crescem por horas.', 'Colete tendência, logs, métricas e heap dump/profiler quando chegar a hora.'],
  ['Diagnóstico no chute', 'A primeira ação é aumentar heap ou trocar coletor.', 'Identifique quem aloca, quem retém e qual caminho mantém o objeto alcançável.'],
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="gc64-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>;
}

const CHECKS = ['Objeto local fica elegível ao fim do frame sem retorno','Objeto retornado continua alcançável no main','OS-001 perde a raiz quando ultimaOs recebe OS-002','Fila remove referência do item consumido','Cache mantém somente os três itens mais recentes','System.gc é descrito como solicitação','Runtime é usado apenas como observação didática','Recurso externo possui fechamento independente','Debug prova a remoção da referência, não a coleta','Git não inclui arquivos .class'];

function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = 'mkdir labs\\m2\\aula-064-garbage-collector-conceitual\ncd labs\\m2\\aula-064-garbage-collector-conceitual\njavac LaboratorioGcConceitual.java\njava LaboratorioGcConceitual';
  return <section className="gc64-delivery"><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Preveja o grafo antes da saída</strong><p>Em cada exemplo, marque raízes, estrutura que retém, referência removida e objeto que apenas se tornou elegível. Não tente observar uma coleta exata.</p></div></aside><CodePanel name="LaboratorioGcConceitual.java" code={MAIN_PROGRAM} /><div className="gc64-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="gc64-debug"><header><Trash2 size={18} /><strong>Debug: a parte que você controla</strong></header><div><article><span>1</span><strong>Breakpoint antes</strong><p><code>fila[0]</code> aponta para Pedido Ana.</p></article><article><span>2</span><strong>Step Over</strong><p>Execute <code>fila[0] = null</code>.</p></article><article><span>3</span><strong>Variável removida</strong><p>O slot não oferece mais caminho para Ana.</p></article><article><span>4</span><strong>Limite da prova</strong><p>O debugger prova elegibilidade, não o instante da coleta.</p></article></div></section><div className="gc64-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: fila de notificações com retenção controlada</h3></div><p>Construa uma fila fixa de quatro notificações. Ao consumir uma posição, remova a referência. Quando estiver cheia, substitua a mais antiga. Explique quais objetos permanecem alcançáveis e por que o GC não corrige uma fila que nunca remove itens.</p><ul><li>Não use System.gc como critério de aceite.</li><li>Mostre estados antes e depois de consumir.</li><li>Inclua uma política explícita de capacidade.</li></ul></section><section className="guided-file gc64-code"><div className="guided-file-title"><Recycle size={16} />docs/diario-de-bordo.md<CopyButton value={EVIDENCE} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'reach') return <ReachabilityLab />;
  if (block.type === 'collection') return <CollectionLab />;
  if (block.type === 'retention') return <RetentionLab />;
  if (block.type === 'pressure') return <PressureLab />;
  if (block.type === 'observation') return <ObservationLab />;
  if (block.type === 'resource') return <ResourceLab />;
  if (block.type === 'domains') return <DomainsLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'reach', label: 'Mapa de Alcançabilidade', duration: '12 min', eyebrow: 'O QUE O GC ENXERGA', title: 'Siga caminhos vivos em vez de adivinhar utilidade', blocks: [{ type: 'lead', text: 'O coletor não entende Pedido, cache ou regra de negócio. Ele parte de referências vivas e identifica quais objetos ainda podem ser alcançados.' }, { type: 'reach' }] },
  { id: 'collection', label: 'Elegível ≠ Coletado', duration: '9 min', eyebrow: 'CONTRATO DO RUNTIME', title: 'Separe remoção de referência, elegibilidade e coleta', blocks: [{ type: 'lead', text: 'Seu código controla referências. O runtime decide quando coletar; System.gc não transforma essa decisão em garantia.' }, { type: 'collection' }] },
  { id: 'retention', label: 'Retenção e Limites', duration: '13 min', eyebrow: 'MEMORY LEAK EM JAVA', title: 'Veja uma estrutura útil virar vazamento por falta de política', blocks: [{ type: 'lead', text: 'Objetos ainda alcançáveis não são lixo para a JVM, mesmo quando já perderam valor para o negócio. Cache, fila e histórico precisam de limite e remoção.' }, { type: 'retention' }] },
  { id: 'pressure', label: 'Pressão e Sintomas', duration: '11 min', eyebrow: 'ALOCAR ≠ RETER', title: 'Diferencie objetos temporários de crescimento sustentado', blocks: [{ type: 'lead', text: 'Criar muitos objetos gera trabalho; manter referências faz o conjunto vivo crescer. Sintomas orientam investigação, mas não substituem evidências.' }, { type: 'pressure' }] },
  { id: 'observation', label: 'Runtime Didático', duration: '8 min', eyebrow: 'OBSERVAR SEM PROMETER', title: 'Leia memória total, livre e usada com limites claros', blocks: [{ type: 'lead', text: 'Runtime permite uma fotografia didática, não um benchmark nem uma prova de que o GC rodou naquele instante.' }, { type: 'observation' }] },
  { id: 'resources', label: 'Memória e Recursos', duration: '9 min', eyebrow: 'FRONTEIRAS DIFERENTES', title: 'Não espere o GC fechar arquivo, socket ou conexão', blocks: [{ type: 'lead', text: 'Recuperar memória do objeto Java e liberar um recurso externo são responsabilidades distintas; fechamento precisa ser determinístico.' }, { type: 'resource' }] },
  { id: 'domains', label: 'Ciclo de Vida Backend', duration: '11 min', eyebrow: 'SEIS APLICAÇÕES', title: 'Defina quem retém, por quanto tempo e por quê', blocks: [{ type: 'lead', text: 'Pedido, produto, pagamento, OS, mensageria e auditoria revelam diferentes políticas de criação, retenção, substituição e remoção.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Corrija retenção e expectativas antes de trocar o coletor', blocks: [{ type: 'lead', text: 'Aumentar heap ou chamar System.gc sem localizar o caminho de retenção apenas adia ou mascara o problema.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '20 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove referências removidas sem fingir observar a coleta', blocks: [{ type: 'lead', text: 'Compile um laboratório determinístico, use debug no slot da fila e transfira o modelo para uma estrutura limitada.' }, { type: 'delivery' }] },
];

export default function GuidedGarbageCollectorLesson064({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
    const activeButton = navRef.current?.querySelector('button.active');
    if (activeButton && window.matchMedia('(max-width: 900px)').matches) activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);
  const step = steps[activeIndex];
  const stepDone = completedSteps.has(step.id);
  const allStepsDone = completedSteps.size === steps.length;
  const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleStep = () => {
    if (stepDone && isCompleted) onToggleCompleted();
    setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; });
  };
  return <article className="guided-git-lesson guided-garbage-collector-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Recycle size={17} />Laboratório de ciclo de vida</span><p className="guided-sequence">064 · M2.03</p><h1>Garbage Collector conceitual</h1><p>Enxergue alcançabilidade, elegibilidade e retenção; depois limite caches, remova referências e diagnostique pressão sem depender de System.gc.</p></div><div className="guided-hero-status"><Recycle size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 064" items={[{ value: '5 cenários', label: 'Alcançabilidade comparada' }, { value: '6 domínios', label: 'Retenção com propósito' }, { value: '10 falhas', label: 'Diagnosticadas pela raiz' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 064"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Ciclo de vida defendível</h3><p>{lessonComplete ? 'Aula concluída e pronta para inicialização.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 063</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>Alcançabilidade, retenção e pressão</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 065<ArrowRight size={17} /></button></footer></article>;
}
