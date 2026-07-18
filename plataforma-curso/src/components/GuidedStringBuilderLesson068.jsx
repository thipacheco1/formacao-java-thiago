import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Braces, Check, CheckCircle2, Clock3,
  Copy, FileCode2, Gauge, Lightbulb, ListChecks, MessageSquareText, Play,
  Network, RotateCcw, Sparkles, Terminal, Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedStringBuilderLesson.css';

const STORAGE_KEY = 'guided-string-builder-lesson-068-progress';

const MAIN_PROGRAM = `public class LaboratorioStringBuilder {
    public static void main(String[] args) {
        StringBuilder builder = new StringBuilder();
        builder.append("Java").append(' ').append("Backend");
        System.out.println("texto: " + builder);
        System.out.println("length: " + builder.length());

        builder.insert(0, "Curso ");
        System.out.println("insert: " + builder);
        builder.replace(0, 5, "Trilha");
        System.out.println("replace: " + builder);
        builder.delete(0, 7);
        System.out.println("delete: " + builder);

        StringBuilder temporario = new StringBuilder("rascunho");
        temporario.setLength(0);
        temporario.append("pronto");
        System.out.println("reuso: " + temporario);

        String[] itens = {"Pedido", "Produto", "OS"};
        System.out.println("relatorio:");
        System.out.print(montarRelatorio(itens));

        StringBuffer buffer = new StringBuffer();
        buffer.append("buffer sincronizado");
        System.out.println("buffer: " + buffer);
    }

    static String montarRelatorio(String[] itens) {
        StringBuilder relatorio = new StringBuilder(64);
        for (int i = 0; i < itens.length; i++) {
            adicionarLinha(relatorio, i + 1, itens[i]);
        }
        return relatorio.toString();
    }

    static void adicionarLinha(StringBuilder builder, int numero, String item) {
        builder.append(numero).append(" - ").append(item).append('\n');
    }
}`;

const EXPECTED_OUTPUT = `texto: Java Backend
length: 12
insert: Curso Java Backend
replace: Trilha Java Backend
delete: Java Backend
reuso: pronto
relatorio:
1 - Pedido
2 - Produto
3 - OS
buffer: buffer sincronizado`;

const EVIDENCE = `# Aula 068 — StringBuilder e StringBuffer

- [ ] Diferenciei String imutável de builder mutável
- [ ] Observei o mesmo builder crescer
- [ ] Usei append com texto, número, boolean e char
- [ ] Encadeei append sem perder legibilidade
- [ ] Testei insert, delete, replace e reverse
- [ ] Expliquei length e capacity
- [ ] Limpei conscientemente com setLength(0)
- [ ] Diferenciei StringBuilder e StringBuffer
- [ ] Mantive o builder local ao método
- [ ] Separei relatório em métodos auxiliares claros
- [ ] Executei o programa e conferi onze linhas
- [ ] Revisei .gitignore, diff staged e commit`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="sb68-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java' }) {
  return <section className="guided-file sb68-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

const APPEND_PARTS = [
  ['"Cliente: "', 'Cliente: '], ['"Ana"', 'Ana'], ['" | Pedido: "', ' | Pedido: '], ['42', '42'], ['" | Ativo: "', ' | Ativo: '], ['true', 'true'],
];

function MutationLab() {
  const [parts, setParts] = useState([]);
  const value = parts.map(index => APPEND_PARTS[index][1]).join('');
  const append = index => setParts(current => [...current, index]);
  return <section className="sb68-mutation"><div className="sb68-append-buttons">{APPEND_PARTS.map((part, index) => <button type="button" key={`${part[0]}-${index}`} onClick={() => append(index)}><code>append({part[0]})</code></button>)}<button type="button" className="reset" onClick={() => setParts([])}><RotateCcw size={15} />Reiniciar</button></div><div className="sb68-object" role="img" aria-label={`Um único StringBuilder contém ${value || 'texto vazio'}`}><header><Braces size={19} /><strong>StringBuilder B1</strong><span>mesma identidade em todos os append</span></header><div>{value || 'vazio'}</div><footer><span>length = {value.length}</span><span>{parts.length} mutações</span></footer></div><div className="sb68-history">{parts.length ? parts.map((partIndex, index) => <article key={`${partIndex}-${index}`}><span>{index + 1}</span><code>{APPEND_PARTS[partIndex][0]}</code><strong>B1</strong></article>) : <p>Clique nos append na ordem desejada e acompanhe o mesmo objeto crescer.</p>}</div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>append devolve o próprio builder</strong><p>Por isso é possível encadear chamadas. O encadeamento é útil enquanto a leitura continuar clara.</p></div></aside></section>;
}

const APPEND_TYPES = [
  ['String', '"Cliente: Ana"', 'Cliente: Ana'], ['int', '10', '10'], ['long', '1000L', '1000'],
  ['double', '9.5', '9.5'], ['boolean', 'true', 'true'], ['char', "'A'", 'A'],
];

function AppendLab() {
  const [selected, setSelected] = useState(0);
  const item = APPEND_TYPES[selected];
  return <section className="sb68-append"><div className="sb68-type-grid">{APPEND_TYPES.map((type, index) => <button type="button" key={type[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{type[0]}</strong><code>{type[1]}</code></button>)}</div><div className="sb68-conversion"><article><small>VALOR RECEBIDO</small><strong>{item[1]}</strong></article><ArrowRight /><article><small>REPRESENTAÇÃO ADICIONADA</small><strong>"{item[2]}"</strong></article></div><CodePanel name="Append encadeado · vários tipos" code={`StringBuilder builder = new StringBuilder();\n\nbuilder.append("Cliente: ")\n       .append("Ana")\n       .append(" | Valor: ")\n       .append(1000L)\n       .append(" | Ativo: ")\n       .append(true);\n\nString texto = builder.toString();`} /><p className="sb68-proof"><CheckCircle2 size={18} /><span><code>toString()</code> entrega uma String final para APIs e regras que não devem receber o buffer mutável.</span></p></section>;
}

const OPERATIONS = {
  insert: { label: 'insert', start: 'Backend', code: 'insert(0, "Java ")', apply: value => `Java ${value}`, note: 'Insere antes do índice informado.' },
  delete: { label: 'delete', start: 'Java Backend!!!', code: 'delete(12, 15)', apply: value => value.slice(0, 12), note: 'Remove do início inclusivo ao fim exclusivo.' },
  replace: { label: 'replace', start: 'Status: PENDENTE', code: 'replace(8, 16, "APROVADO")', apply: value => `${value.slice(0, 8)}APROVADO`, note: 'Substitui o intervalo pelo novo texto.' },
  reverse: { label: 'reverse', start: 'Java', code: 'reverse()', apply: value => [...value].reverse().join(''), note: 'Inverte o próprio conteúdo.' },
  clear: { label: 'setLength', start: 'Texto temporário', code: 'setLength(0)', apply: () => '', note: 'Zera o comprimento; muitas vezes criar outro builder é mais simples.' },
};

function OperationsLab() {
  const [mode, setMode] = useState('replace');
  const [applied, setApplied] = useState(false);
  const item = OPERATIONS[mode];
  const choose = key => { setMode(key); setApplied(false); };
  const visible = applied ? item.apply(item.start) : item.start;
  return <section className="sb68-operations"><div className="sb68-tabs">{Object.entries(OPERATIONS).map(([key, operation]) => <button type="button" key={key} className={mode === key ? 'active' : ''} onClick={() => choose(key)}>{operation.label}</button>)}</div><div className="sb68-index-board"><header>{[...visible].map((character, index) => <span key={`${character}-${index}`}>{index}</span>)}</header><div>{[...visible].map((character, index) => <strong key={`${character}-${index}`}>{character === ' ' ? '·' : character}</strong>)}{!visible && <em>builder vazio</em>}</div></div><div className="sb68-operation-action"><code>builder.{item.code};</code><button type="button" onClick={() => setApplied(value => !value)}>{applied ? 'Desfazer demonstração' : 'Aplicar no mesmo builder'}</button></div><p className={applied ? 'sb68-result changed' : 'sb68-result'}><strong>[{visible}]</strong><span>{item.note}</span></p><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Índice errado é erro de execução</strong><p>Começa em zero e, em <code>delete</code>/<code>replace</code>, o final é exclusivo. Para regra simples, remontar o texto pode ser mais claro que editar posições.</p></div></aside></section>;
}

function CapacityLab() {
  const [capacity, setCapacity] = useState(16);
  const [length, setLength] = useState(0);
  const append = amount => {
    const nextLength = length + amount;
    let nextCapacity = capacity;
    while (nextLength > nextCapacity) nextCapacity = nextCapacity * 2 + 2;
    setLength(nextLength);
    setCapacity(nextCapacity);
  };
  const reset = initial => { setCapacity(initial); setLength(0); };
  const percent = Math.min(100, (length / capacity) * 100);
  return <section className="sb68-capacity"><div className="sb68-capacity-controls"><button type="button" onClick={() => append(5)}>append 5 caracteres</button><button type="button" onClick={() => append(20)}>append 20 caracteres</button><button type="button" onClick={() => reset(16)}>new StringBuilder()</button><button type="button" onClick={() => reset(64)}>new StringBuilder(64)</button></div><div className="sb68-meter"><header><span>length: <strong>{length}</strong></span><span>capacity conceitual: <strong>{capacity}</strong></span></header><div><i style={{ width: `${percent}%` }} /></div><p>{length <= capacity ? `${capacity - length} posições disponíveis antes de precisar crescer.` : 'A estrutura aumentou a capacidade interna.'}</p></div><div className="sb68-capacity-rules"><article><Gauge size={22} /><strong>length()</strong><span>Quantidade de caracteres atualmente usados.</span></article><article><Braces size={22} /><strong>capacity()</strong><span>Espaço interno disponível; pode ser maior que length.</span></article><article><MessageSquareText size={22} /><strong>Capacidade inicial</strong><span>Use estimativa apenas quando o tamanho grande for previsível.</span></article></div></section>;
}

const BUFFER_MODES = {
  local: ['StringBuilder local', 'não compartilhado', 'Cada chamada cria B1 próprio; não há duas threads alterando o mesmo objeto.', 'Escolha comum'],
  global: ['StringBuilder static', 'compartilhado e não sincronizado', 'Chamadas podem misturar texto, acumular estado e disputar a mesma estrutura.', 'Evite'],
  buffer: ['StringBuffer compartilhado', 'métodos sincronizados', 'Há proteção por método, mas o desenho concorrente completo ainda precisa ser analisado.', 'Uso específico'],
};

function ThreadLab() {
  const [mode, setMode] = useState('local');
  const item = BUFFER_MODES[mode];
  return <section className="sb68-thread"><div className="sb68-tabs">{Object.entries(BUFFER_MODES).map(([key, value]) => <button type="button" key={key} className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>{value[0]}</button>)}</div><div className="sb68-thread-map"><section><article><Network size={18} /><strong>Thread A</strong></article><article><Network size={18} /><strong>Thread B</strong></article></section><ArrowRight /><article className={mode}><small>{item[1]}</small><h3>{item[0]}</h3><strong>{item[3]}</strong><p>{item[2]}</p></article></div><div className="sb68-compare"><article><strong>StringBuilder</strong><span>Mutável, não sincronizado e normalmente mais leve para uso local.</span></article><article><strong>StringBuffer</strong><span>Mutável, métodos sincronizados e mais comum em legado ou necessidade específica.</span></article></div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Thread-safe não significa “sempre melhor”</strong><p>Se o builder nasce e morre dentro do método, não há compartilhamento. Sincronização sem necessidade adiciona custo e não corrige estado global mal desenhado.</p></div></aside></section>;
}

const REPORT_STEPS = [
  ['Cabeçalho', 'adicionarCabecalho(builder, "RELATÓRIO DE PEDIDOS")', 'RELATÓRIO DE PEDIDOS\n====================\n'],
  ['Pedido Ana', 'adicionarPedido(builder, ana)', 'Cliente: Ana\nValor: 1000\nStatus: PENDENTE\n--------------------\n'],
  ['Slot null', 'if (pedido != null)', '', 'posição ignorada com segurança'],
  ['Pedido Bruno', 'adicionarPedido(builder, bruno)', 'Cliente: Bruno\nValor: 2500\nStatus: APROVADO\n--------------------\n'],
  ['Finalizar', 'return builder.toString()', '', 'String final entregue ao chamador'],
];

function ReportLab() {
  const [index, setIndex] = useState(0);
  const text = REPORT_STEPS.slice(0, index + 1).map(step => step[2]).join('');
  const item = REPORT_STEPS[index];
  return <section className="sb68-report"><div className="sb68-report-steps">{REPORT_STEPS.map((step, stepIndex) => <button type="button" key={step[0]} className={index === stepIndex ? 'active' : stepIndex < index ? 'visited' : ''} onClick={() => setIndex(stepIndex)}><span>{stepIndex + 1}</span><strong>{step[0]}</strong></button>)}</div><div className="sb68-report-workbench"><section><small>MÉTODO ATUAL</small><code>{item[1]}</code><p>{item[3] || 'método nomeado deixa a mutação intencional'}</p></section><pre>{text || 'builder vazio'}</pre></div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Responsabilidade explícita</strong><p><code>adicionarCabecalho</code> e <code>adicionarPedido</code> anunciam que vão mutar o builder recebido. O método principal controla ordem, valida slots e converte no final.</p></div></aside></section>;
}

const DOMAINS = [
  ['Pedidos', 'relatório de vários pedidos', 'Loop, separadores e objetos possivelmente null justificam builder local.'],
  ['Produtos', 'nome + estoque + ativo por linha', 'Append aceita texto, número e boolean sem conversão manual.'],
  ['Pagamento', 'resumo de poucas linhas', 'Builder deixa espaço para crescer, mas + também seria aceitável hoje.'],
  ['Ordem de serviço', 'certificado + status + atividades', 'Valide a OS antes de montar para evitar NPE.'],
  ['Mensageria', 'mensagem de jornada em parágrafos', 'Montagem em etapas favorece leitura e condicionais.'],
  ['Auditoria', 'muitas linhas de usuário | operação | status', 'Builder local evita estado global e mistura entre requisições.'],
];

function DomainsLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return <section className="sb68-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>MONTAGEM TEXTUAL</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}</p><div><strong>Critério do mentor</strong><span>Existe loop, muitas partes, condição, relatório ou crescimento progressivo? Use builder. Para uma linha simples, preserve o +.</span></div></article></section>;
}

const ERRORS = [
  ['Builder em texto trivial', 'Uma linha simples vira código longo e cerimonial.', 'Use + quando a mensagem curta permanece clara.'],
  ['String + em loop grande', 'Cada iteração produz outro resultado imutável.', 'Use StringBuilder local e toString ao final.'],
  ['Esquecer toString', 'A API espera String, mas recebe StringBuilder.', 'Converta na fronteira final.'],
  ['Builder global', 'Dados de chamadas se misturam e disputam estado.', 'Crie o builder dentro do método.'],
  ['Buffer sempre melhor', 'Sincronização é paga sem compartilhamento real.', 'Prefira builder local; avalie buffer só por necessidade.'],
  ['Índice incorreto', 'insert/delete/replace falha ou edita trecho errado.', 'Desenhe índices e lembre do fim exclusivo.'],
  ['Sem quebra de linha', 'Relatório vira um bloco ilegível.', 'Modele separadores e linhas como parte do formato.'],
  ['Objeto null', 'Montagem acessa campo de pedido ausente.', 'Valide objeto e campos conforme o contrato.'],
  ['Auxiliar com nome opaco', 'Método altera builder sem comunicar intenção.', 'Use adicionarCabecalho, adicionarLinha ou montarResumo.'],
  ['Micro-otimização precoce', 'Tudo vira builder sem medição nem ganho.', 'Priorize clareza e use no cenário adequado.'],
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="sb68-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>;
}

const CHECKS = ['O mesmo builder recebe três append','length acompanha caracteres usados','insert adiciona prefixo no índice zero','replace usa fim exclusivo','delete remove o prefixo correto','setLength(0) limpa antes do reuso','Relatório usa capacidade inicial coerente','Método auxiliar anuncia mutação','toString finaliza a montagem','StringBuffer aparece apenas como comparação sincronizada'];

function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = 'mkdir labs\\m2\\aula-068-stringbuilder-stringbuffer\ncd labs\\m2\\aula-068-stringbuilder-stringbuffer\njavac LaboratorioStringBuilder.java\njava LaboratorioStringBuilder';
  return <section className="sb68-delivery"><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Observe identidade, conteúdo e fronteira</strong><p>No debug, confirme que B1 é o mesmo durante append e que apenas <code>toString()</code> produz o valor final entregue.</p></div></aside><CodePanel name="LaboratorioStringBuilder.java" code={MAIN_PROGRAM} /><div className="sb68-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="sb68-debug"><header><Play size={18} /><strong>Debug: o mesmo objeto cresce</strong></header><div><article><span>1</span><strong>Breakpoint no primeiro append</strong><p><code>builder.length() == 0</code>.</p></article><article><span>2</span><strong>Step Over</strong><p>Conteúdo vira Java; identidade permanece B1.</p></article><article><span>3</span><strong>Continue os append</strong><p>length cresce sem reatribuir builder.</p></article><article><span>4</span><strong>Execute toString</strong><p>resultado é uma String final separada.</p></article></div></section><div className="sb68-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: relatório condicional de ordens de serviço</h3></div><p>Monte cabeçalho, linhas válidas, total e observação final. Ignore slots null, destaque apenas OS abertas e separe a mutação em métodos auxiliares nomeados.</p><ul><li>Builder deve ser local.</li><li>Inclua quebra de linha e separadores legíveis.</li><li>Retorne String apenas ao terminar.</li></ul></section><section className="guided-file sb68-code"><div className="guided-file-title"><MessageSquareText size={16} />docs/diario-de-bordo.md<CopyButton value={EVIDENCE} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'mutation') return <MutationLab />;
  if (block.type === 'append') return <AppendLab />;
  if (block.type === 'operations') return <OperationsLab />;
  if (block.type === 'capacity') return <CapacityLab />;
  if (block.type === 'thread') return <ThreadLab />;
  if (block.type === 'report') return <ReportLab />;
  if (block.type === 'domains') return <DomainsLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'mutation', label: 'Builder Mutável', duration: '11 min', eyebrow: 'UM OBJETO QUE CRESCE', title: 'Aplique append e acompanhe o mesmo builder mudar', blocks: [{ type: 'lead', text: 'StringBuilder mantém conteúdo mutável. Cada append altera B1 e devolve o próprio objeto, enquanto String produziria novos resultados imutáveis.' }, { type: 'mutation' }] },
  { id: 'append', label: 'Append e toString', duration: '10 min', eyebrow: 'VÁRIOS TIPOS', title: 'Monte texto legível e finalize na fronteira correta', blocks: [{ type: 'lead', text: 'append aceita texto, números, boolean e char. Encadeie com moderação e converta para String quando a montagem estiver pronta.' }, { type: 'append' }] },
  { id: 'operations', label: 'Edição por Índices', duration: '12 min', eyebrow: 'INSERT, DELETE E REPLACE', title: 'Edite o conteúdo interno sem perder o controle dos intervalos', blocks: [{ type: 'lead', text: 'insert, delete, replace, reverse e setLength mutam o builder. Índices começam em zero e o fim de intervalos é exclusivo.' }, { type: 'operations' }] },
  { id: 'capacity', label: 'Length e Capacity', duration: '9 min', eyebrow: 'CRESCIMENTO INTERNO', title: 'Separe caracteres usados de espaço reservado', blocks: [{ type: 'lead', text: 'length mede o conteúdo; capacity representa espaço interno. Uma estimativa inicial só vale quando o texto grande é previsível.' }, { type: 'capacity' }] },
  { id: 'threads', label: 'Builder ou Buffer', duration: '11 min', eyebrow: 'ESCOPO E CONCORRÊNCIA', title: 'Prefira o builder local antes de pagar sincronização', blocks: [{ type: 'lead', text: 'StringBuilder não é sincronizado; StringBuffer é. Se cada método cria seu próprio builder, não existe compartilhamento e builder é a escolha comum.' }, { type: 'thread' }] },
  { id: 'report', label: 'Relatório por Partes', duration: '12 min', eyebrow: 'MUTAÇÃO INTENCIONAL', title: 'Organize cabeçalho, linhas e finalização em métodos claros', blocks: [{ type: 'lead', text: 'O método principal controla ordem e validações; auxiliares com nomes como adicionarPedido tornam explícito que vão alterar o builder recebido.' }, { type: 'report' }] },
  { id: 'domains', label: 'Montagem no Backend', duration: '11 min', eyebrow: 'SEIS APLICAÇÕES', title: 'Escolha builder pelo formato e pela repetição, não por reflexo', blocks: [{ type: 'lead', text: 'Relatórios, mensagens e auditoria crescem de formas diferentes. Uma linha curta ainda pode usar + sem culpa.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Corrija escopo, índices e exageros de otimização', blocks: [{ type: 'lead', text: 'Builder global, intervalo incorreto e ausência de toString são problemas distintos. O diagnóstico começa pela responsabilidade da montagem.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '22 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove mutabilidade, edição e relatório em uma execução', blocks: [{ type: 'lead', text: 'Compile, confira onze linhas, observe B1 crescer no debugger e transfira o desenho para um relatório condicional de OS.' }, { type: 'delivery' }] },
];

export default function GuidedStringBuilderLesson068({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-string-builder-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><MessageSquareText size={17} />Oficina de montagem textual</span><p className="guided-sequence">068 · M2.07</p><h1>StringBuilder e StringBuffer</h1><p>Veja o mesmo buffer crescer, edite por índices, dimensione capacidade e monte relatórios locais sem transformar toda String simples em micro-otimização.</p></div><div className="guided-hero-status"><MessageSquareText size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 068" items={[{ value: '6 operações', label: 'Mutabilidade praticada' }, { value: '3 escopos', label: 'Concorrência comparada' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 068"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Montagem textual defendível</h3><p>{lessonComplete ? 'Aula concluída e pronta para wrappers.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 067</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>mutabilidade, escopo e relatórios</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 069<ArrowRight size={17} /></button></footer></article>;
}
