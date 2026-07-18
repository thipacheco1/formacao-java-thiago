import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Boxes, Check, CheckCircle2, Clock3,
  Copy, FileCode2, GitBranch, Lightbulb, ListChecks, PackageCheck, Play,
  RotateCcw, Sparkles, Terminal, Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedDefaultValuesInitializationLesson.css';

const STORAGE_KEY = 'guided-default-values-initialization-lesson-065-progress';

const MAIN_PROGRAM = `public class LaboratorioInicializacao {
    static int execucoes;
    static String ambiente;

    public static void main(String[] args) {
        Cliente vazio = new Cliente();
        System.out.println("campo: " + vazio.nome + " | " + vazio.pontos + " | " + vazio.ativo);
        System.out.println("static: " + execucoes + " | " + ambiente);

        int[] notas = new int[3];
        Cliente[] fila = new Cliente[2];
        System.out.println("arrays: " + notas[0] + " | " + fila[0]);

        fila[0] = criarCliente("Ana");
        System.out.println("cliente: " + fila[0].nome + " | " + fila[0].ativo);

        Pedido pedido = new Pedido("Bruno", 1500L);
        System.out.println("pedido: " + pedido.status + " | " + pedido.valorCentavos);

        Configuracao config = new Configuracao();
        System.out.println("config: " + config.limiteTentativas + " | " + config.ambiente);
    }

    static Cliente criarCliente(String nome) {
        Cliente cliente = new Cliente();
        cliente.nome = nome;
        cliente.ativo = true;
        return cliente;
    }
}

class Cliente {
    String nome;
    int pontos;
    boolean ativo;
}

class Pedido {
    String cliente;
    long valorCentavos;
    String status;

    Pedido(String cliente, long valorCentavos) {
        this.cliente = cliente;
        this.valorCentavos = valorCentavos;
        this.status = "PENDENTE";
    }
}

class Configuracao {
    int limiteTentativas = 3;
    String ambiente = "LOCAL";
}`;

const EXPECTED_OUTPUT = `campo: null | 0 | false
static: 0 | null
arrays: 0 | null
cliente: Ana | true
pedido: PENDENTE | 1500
config: 3 | LOCAL`;

const LOCAL_ERROR = `public static void main(String[] args) {
    String status;
    System.out.println(status);
    // error: variable status might not have been initialized
}`;

const PATH_ERROR = `String status;

if (aprovado) {
    status = "APROVADO";
}

System.out.println(status); // existe um caminho sem atribuição`;

const EVIDENCE = `# Aula 065 — Default values e inicialização

- [ ] Recitei os defaults dos tipos principais
- [ ] Separei campo, static, elemento de array e variável local
- [ ] Provoquei e expliquei o erro de inicialização local
- [ ] Completei todos os caminhos de atribuição
- [ ] Provei que array de referências nasce com slots null
- [ ] Criei cada objeto antes de acessar seus campos
- [ ] Diferenciei objeto criado de objeto válido
- [ ] Diferenciei default técnico de default de negócio
- [ ] Comparei fábrica, construtor e inicializador de campo
- [ ] Revisei boolean, zero e null como estados ambíguos
- [ ] Executei o programa e conferi seis linhas
- [ ] Revisei .gitignore, diff staged e commit`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="dv65-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java' }) {
  return <section className="guided-file dv65-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

const TYPES = [
  ['byte / short / int', '0', 'número inteiro'], ['long', '0L', 'inteiro longo'],
  ['float', '0.0f', 'decimal simples'], ['double', '0.0d', 'decimal duplo'],
  ['boolean', 'false', 'estado lógico'], ['char', "'\\u0000'", 'caractere nulo'],
  ['String / objeto / array', 'null', 'referência ausente'],
];

const LOCATIONS = {
  instance: ['Campo de instância', 'Sim', 'A JVM inicializa quando o objeto é criado.'],
  static: ['Campo static', 'Sim', 'A JVM inicializa quando a classe é preparada.'],
  array: ['Elemento de array', 'Sim', 'Cada posição nasce com o default do tipo do array.'],
  local: ['Variável local', 'Não para leitura', 'O compilador exige atribuição definida antes de qualquer uso.'],
};

function DefaultsLab() {
  const [location, setLocation] = useState('instance');
  const selected = LOCATIONS[location];
  return <section className="dv65-defaults"><div className="dv65-location-tabs">{Object.entries(LOCATIONS).map(([key, item]) => <button type="button" key={key} className={location === key ? 'active' : ''} onClick={() => setLocation(key)}><strong>{item[0]}</strong><small>default automático: {item[1]}</small></button>)}</div><div className="dv65-scope-answer"><span>{selected[0]}</span><strong>{selected[1]}</strong><p>{selected[2]}</p></div><div className={`dv65-type-grid ${location === 'local' ? 'blocked' : ''}`}>{TYPES.map(type => <article key={type[0]}><span>{type[0]}</span><strong>{location === 'local' ? 'atribua antes' : type[1]}</strong><small>{type[2]}</small></article>)}</div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>A tabela não declara valores de negócio</strong><p><code>false</code>, <code>0</code> e <code>null</code> descrevem o estado técnico inicial. Só a regra do sistema decide se esse estado é aceitável.</p></div></aside></section>;
}

function LocalPathsLab() {
  const [complete, setComplete] = useState(false);
  const code = complete ? `String status;\n\nif (aprovado) {\n    status = "APROVADO";\n} else {\n    status = "RECUSADO";\n}\n\nSystem.out.println(status);` : PATH_ERROR;
  return <section className="dv65-paths"><div className="dv65-path-toolbar"><button type="button" className={!complete ? 'active danger' : ''} onClick={() => setComplete(false)}>Caminho incompleto</button><button type="button" className={complete ? 'active' : ''} onClick={() => setComplete(true)}>Todos os caminhos atribuem</button></div><div className="dv65-flow" role="img" aria-label={complete ? 'Os caminhos verdadeiro e falso atribuem status antes da leitura' : 'O caminho falso chega à leitura sem atribuir status'}><article><span>1</span><strong>declara</strong><code>String status;</code></article><GitBranch /><section><article className="ok"><span>TRUE</span><code>status = "APROVADO"</code></article><article className={complete ? 'ok' : 'bad'}><span>FALSE</span><code>{complete ? 'status = "RECUSADO"' : 'sem atribuição'}</code></article></section><ArrowRight /><article className={complete ? 'ok' : 'bad'}><span>2</span><strong>lê</strong><code>println(status)</code></article></div><CodePanel name={complete ? 'CaminhosCompletos.java · trecho' : 'ErroCaminhoIncompleto.java · não compila'} code={code} /><p className={`dv65-verdict ${complete ? 'ok' : 'bad'}`}>{complete ? 'Compila: qualquer caminho que alcança o println já atribuiu status.' : 'Não compila: Java prova que aprovado == false alcança o println sem valor.'}</p><CodePanel name="ErroVariavelLocalSemInicializar.java · menor reprodução" code={LOCAL_ERROR} /></section>;
}

function ArraysLab() {
  const [kind, setKind] = useState('primitive');
  const [created, setCreated] = useState([false, false, false]);
  const reset = next => { setKind(next); setCreated([false, false, false]); };
  const create = index => setCreated(current => current.map((value, itemIndex) => itemIndex === index ? true : value));
  return <section className="dv65-arrays"><div className="dv65-array-tabs"><button type="button" className={kind === 'primitive' ? 'active' : ''} onClick={() => reset('primitive')}>int[3]</button><button type="button" className={kind === 'reference' ? 'active' : ''} onClick={() => reset('reference')}>Cliente[3]</button></div><div className="dv65-array-stage"><section><header>{kind === 'primitive' ? 'int[] notas = new int[3]' : 'Cliente[] clientes = new Cliente[3]'}</header><div>{[0, 1, 2].map(index => <button type="button" key={index} disabled={kind === 'primitive' || created[index]} onClick={() => create(index)}><small>slot {index}</small><strong>{kind === 'primitive' ? '0' : created[index] ? `ref → C${index}` : 'null'}</strong>{kind === 'reference' && !created[index] && <span>criar Cliente</span>}</button>)}</div></section>{kind === 'reference' && <><ArrowRight /><section className="dv65-heap"><header>objetos realmente criados</header><div>{created.some(Boolean) ? created.map((value, index) => value && <article key={index}><Boxes size={18} /><strong>Cliente C{index}</strong><span>nome = null</span><span>pontos = 0</span><span>ativo = false</span></article>) : <p>O array existe, mas ainda não existe nenhum Cliente.</p>}</div></section></>}</div>{kind === 'reference' && <aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Dois níveis de inicialização</strong><p><code>new Cliente[3]</code> cria o array e três slots <code>null</code>. Cada <code>new Cliente()</code> cria um objeto; seus próprios campos ainda começam nos defaults.</p></div></aside>}</section>;
}

const STATE_CASES = {
  produto: { label: 'Produto', fields: [['nome', 'null', 'obrigatório'], ['estoque', '0', 'decisão explícita'], ['ativo', 'false', 'deveria nascer true']], valid: ['Cadeira', '10', 'true'], rule: 'Produto novo precisa de nome, estoque não negativo e ativo = true.' },
  pagamento: { label: 'Pagamento', fields: [['valorCentavos', '0', 'inválido'], ['parcelas', '0', 'divisão por zero']], valid: ['10000', '4'], rule: 'Valor deve ser positivo e parcelas deve ser maior que zero.' },
  contrato: { label: 'Contrato', fields: [['aprovado', 'false', 'ambíguo']], valid: ['status = PENDENTE'], rule: 'false não distingue “recusado”, “não analisado” e “esquecido”.' },
};

function ValidityLab() {
  const [mode, setMode] = useState('produto');
  const [initialized, setInitialized] = useState(false);
  const item = STATE_CASES[mode];
  const choose = key => { setMode(key); setInitialized(false); };
  return <section className="dv65-validity"><div className="dv65-tabs">{Object.entries(STATE_CASES).map(([key, value]) => <button type="button" key={key} className={mode === key ? 'active' : ''} onClick={() => choose(key)}>{value.label}</button>)}</div><div className="dv65-validity-board"><section className={initialized ? 'valid' : 'technical'}><small>{initialized ? 'ESTADO DE NEGÓCIO EXPLÍCITO' : 'OBJETO TECNICAMENTE CRIADO'}</small><h3>new {item.label}()</h3><div>{item.fields.map((field, index) => <article key={field[0]}><code>{field[0]}</code><strong>{initialized ? item.valid[index] : field[1]}</strong><span>{initialized ? 'intenção registrada' : field[2]}</span></article>)}</div><button type="button" onClick={() => setInitialized(value => !value)}>{initialized ? <RotateCcw size={15} /> : <PackageCheck size={15} />}{initialized ? 'Voltar aos defaults' : 'Inicializar com intenção'}</button></section><aside><strong>Regra que Java não conhece</strong><p>{item.rule}</p><div><span>objeto criado</span><ArrowRight size={16} /><span>validado e preenchido</span><ArrowRight size={16} /><span>objeto válido</span></div></aside></div></section>;
}

const STRATEGIES = [
  { name: 'Preenchimento manual', code: 'Pedido p = new Pedido();\np.cliente = "Ana";\np.status = "PENDENTE";', use: 'Bom para enxergar o mecanismo; espalha esquecimentos quando repetido.' },
  { name: 'Método fábrica simples', code: 'Pedido p = criarPedido("Ana", 1000L);', use: 'Centraliza validação e estado inicial em um ponto nomeado.' },
  { name: 'Construtor', code: 'Pedido p = new Pedido("Ana", 1000L);', use: 'Faz dados obrigatórios participarem do nascimento do objeto; this será aprofundado depois.' },
  { name: 'Inicializador de campo', code: 'int limiteTentativas = 3;\nString ambiente = "LOCAL";', use: 'Expressa um default de negócio comum a toda instância.' },
];

function StrategiesLab() {
  const [selected, setSelected] = useState(1);
  const item = STRATEGIES[selected];
  return <section className="dv65-strategies"><div>{STRATEGIES.map((strategy, index) => <button type="button" key={strategy.name} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{strategy.name}</strong></button>)}</div><article><small>ESTRATÉGIA {selected + 1}</small><h3>{item.name}</h3><SyntaxHighlighter language="java" style={vscDarkPlus} customStyle={{ margin: '12px 0', padding: '16px', background: '#0f172a', fontSize: '.8rem' }}>{item.code}</SyntaxHighlighter><p>{item.use}</p><aside><strong>Pergunta de projeto</strong><span>É melhor aceitar <code>null</code>, escolher um valor padrão ou impedir a criação? A regra do domínio decide.</span></aside></article></section>;
}

const DOMAINS = [
  ['Produto', 'nome + estoque + ativo', 'Novo produto nasce ativo por decisão explícita.'],
  ['Pedido', 'cliente + valor + status', 'Novo pedido começa PENDENTE; null não é um status.'],
  ['Pagamento', 'valor + parcelas', 'Ambos positivos antes de calcular a parcela.'],
  ['Ordem de serviço', 'certificado + atividades + urgente', 'ABERTA é regra; false para urgente é decisão documentada.'],
  ['Mensagem', 'cliente + tipo + tentativas + enviada', 'Zero tentativas e não enviada fazem sentido; cliente e tipo null não.'],
  ['Auditoria', 'usuário + operação + status + tentativa', 'Registro começa PENDENTE e na tentativa 1.'],
];

function DomainsLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return <section className="dv65-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>DEFAULT DE NEGÓCIO</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}</p><div><strong>Checklist do mentor</strong><span>Quais campos são obrigatórios? Quais zeros e falses são reais? Qual estado precisa ser nomeado? Onde a inicialização ficará centralizada?</span></div></article></section>;
}

const ERRORS = [
  ['Esperar default local', 'A leitura ocorre antes de atribuição e o código não compila.', 'Atribua antes do uso e cubra todos os caminhos.'],
  ['Array cria os objetos', 'Cliente[3] contém três slots null.', 'Execute new Cliente() em cada posição necessária.'],
  ['Acessar slot null', 'clientes[0].nome lança NullPointerException.', 'Crie o objeto antes de acessar seu campo.'],
  ['Default virou regra', 'false, 0 ou null entram no fluxo sem decisão.', 'Defina e escreva o estado inicial do domínio.'],
  ['Boolean esconde estados', 'false mistura pendente, recusado e não preenchido.', 'Use status explícito quando houver mais de dois estados.'],
  ['Zeros vazios viram dados', 'Slots 0 de array entram em média ou contagem.', 'Mantenha a quantidade de posições realmente preenchidas.'],
  ['Objeto incompleto', 'O new funcionou, mas campos obrigatórios ficaram vazios.', 'Centralize criação e valide invariantes.'],
  ['Fábrica retorna null', 'O chamador acessa o retorno sem conferir.', 'Valide o retorno; null será aprofundado na próxima aula.'],
  ['Valor qualquer só para compilar', 'O erro some, mas nasce um estado mentiroso.', 'Inicialize com significado, não com conveniência.'],
  ['String começa vazia', 'O código espera "", mas o campo contém null.', 'Lembre: referência não inicializada recebe null.'],
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="dv65-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>;
}

const CHECKS = ['Campos de instância exibem null, 0 e false','Campos static exibem 0 e null','Array int nasce com zero','Array Cliente nasce com null','Cliente é criado antes do acesso','Fábrica define ativo = true','Construtor define PENDENTE','Inicializador de campo define 3 e LOCAL','Debug separa new de preenchimento','Git não inclui arquivos .class'];

function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = 'mkdir labs\\m2\\aula-065-default-values-inicializacao\ncd labs\\m2\\aula-065-default-values-inicializacao\njavac LaboratorioInicializacao.java\njava LaboratorioInicializacao';
  return <section className="dv65-delivery"><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Preveja cada linha antes de executar</strong><p>Para cada valor, diga quem o escreveu: a JVM, a fábrica, o construtor ou o inicializador de campo. Depois compare sua hipótese com o terminal.</p></div></aside><CodePanel name="LaboratorioInicializacao.java" code={MAIN_PROGRAM} /><div className="dv65-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="dv65-debug"><header><Play size={18} /><strong>Debug: veja o objeto ficar completo</strong></header><div><article><span>1</span><strong>Breakpoint após new</strong><p><code>nome=null</code>, <code>pontos=0</code>, <code>ativo=false</code>.</p></article><article><span>2</span><strong>Step Over no nome</strong><p>Apenas <code>nome</code> muda para Ana.</p></article><article><span>3</span><strong>Step Over no ativo</strong><p><code>ativo</code> muda por regra explícita.</p></article><article><span>4</span><strong>Prova</strong><p>new criou o objeto; as atribuições criaram o estado de negócio.</p></article></div></section><div className="dv65-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: pedido que não nasce pela metade</h3></div><p>Crie uma fábrica <code>criarPedido</code> que rejeite cliente vazio e valor não positivo, defina status PENDENTE e devolva um pedido pronto para uso.</p><ul><li>Mostre o caso válido e pelo menos dois inválidos.</li><li>Explique cada default técnico que seria perigoso.</li><li>Não aprofunde enum, Optional ou Bean Validation ainda.</li></ul></section><section className="guided-file dv65-code"><div className="guided-file-title"><PackageCheck size={16} />docs/diario-de-bordo.md<CopyButton value={EVIDENCE} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'defaults') return <DefaultsLab />;
  if (block.type === 'paths') return <LocalPathsLab />;
  if (block.type === 'arrays') return <ArraysLab />;
  if (block.type === 'validity') return <ValidityLab />;
  if (block.type === 'strategies') return <StrategiesLab />;
  if (block.type === 'domains') return <DomainsLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'defaults', label: 'Mapa dos Defaults', duration: '11 min', eyebrow: 'REGRA DA LINGUAGEM', title: 'Descubra onde a JVM escreve um valor e onde o compilador exige você', blocks: [{ type: 'lead', text: 'Campos de instância, campos static e elementos de array recebem defaults. Variáveis locais só podem ser lidas depois de uma atribuição comprovada.' }, { type: 'defaults' }] },
  { id: 'paths', label: 'Locais e Caminhos', duration: '12 min', eyebrow: 'ATRIBUIÇÃO DEFINIDA', title: 'Faça todos os caminhos chegarem à leitura com um valor', blocks: [{ type: 'lead', text: 'Java não pergunta se o if provavelmente será verdadeiro. O compilador analisa cada caminho capaz de alcançar a leitura da variável local.' }, { type: 'paths' }] },
  { id: 'arrays', label: 'Arrays por Dentro', duration: '12 min', eyebrow: 'SLOTS E OBJETOS', title: 'Separe a criação do array da criação dos objetos', blocks: [{ type: 'lead', text: 'Arrays de primitivos nascem preenchidos com o default do tipo. Arrays de referências nascem com null — e nenhum objeto é criado por posição.' }, { type: 'arrays' }] },
  { id: 'validity', label: 'Criado ≠ Válido', duration: '11 min', eyebrow: 'ESTADO TÉCNICO E DOMÍNIO', title: 'Não confunda um new bem-sucedido com um objeto pronto', blocks: [{ type: 'lead', text: 'A JVM garante um estado técnico consistente. Nome obrigatório, parcelas positivas e status PENDENTE pertencem ao seu domínio.' }, { type: 'validity' }] },
  { id: 'strategies', label: 'Inicialização Explícita', duration: '10 min', eyebrow: 'INTENÇÃO NO CÓDIGO', title: 'Escolha onde o estado inicial ficará impossível de esquecer', blocks: [{ type: 'lead', text: 'Preenchimento manual explica o mecanismo; fábrica, construtor e inicializador de campo centralizam decisões recorrentes com diferentes compromissos.' }, { type: 'strategies' }] },
  { id: 'domains', label: 'Defaults no Backend', duration: '11 min', eyebrow: 'SEIS APLICAÇÕES', title: 'Interrogue false, zero e null em cada domínio', blocks: [{ type: 'lead', text: 'O mesmo valor técnico pode ser seguro em um campo e defeituoso em outro. Leia cada objeto pelas regras que precisa sustentar.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Corrija a origem do estado incompleto', blocks: [{ type: 'lead', text: 'Inicializar com qualquer valor apenas silencia o compilador. O diagnóstico correto localiza o slot, o caminho e a regra que ficaram sem intenção.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '22 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove quem escreveu cada valor antes de criar sua regra', blocks: [{ type: 'lead', text: 'Compile um programa integrado, confira seis linhas determinísticas, observe o objeto no debug e entregue um pedido que não nasce pela metade.' }, { type: 'delivery' }] },
];

export default function GuidedDefaultValuesInitializationLesson065({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-default-values-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><PackageCheck size={17} />Laboratório de estados iniciais</span><p className="guided-sequence">065 · M2.04</p><h1>Default values e inicialização</h1><p>Veja quem escreve 0, false e null; prove por que locais são diferentes e transforme objetos apenas criados em estados válidos para o negócio.</p></div><div className="guided-hero-status"><PackageCheck size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 065" items={[{ value: '4 locais', label: 'Regras comparadas' }, { value: '7 tipos', label: 'Defaults explicados' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 065"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Inicialização defendível</h3><p>{lessonComplete ? 'Aula concluída e pronta para aprofundar null.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 064</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>Defaults, intenção e validade</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 066<ArrowRight size={17} /></button></footer></article>;
}
