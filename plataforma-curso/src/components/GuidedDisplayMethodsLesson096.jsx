import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Code2, Copy, Eye, FileCode2, LayoutTemplate, ListChecks, Monitor, RotateCcw, Sparkles, StepForward, Terminal } from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedDisplayMethodsLesson.css';

const STORAGE_KEY = 'guided-display-methods-lesson-096-progress';
const BASIC = [
  'public class ExibicaoBasica {',
  '    public static void main(String[] args) {',
  '        imprimirCabecalho("Sistema de Pedidos");',
  '        imprimirMensagem("Bem-vindo ao sistema.");',
  '        imprimirLinhaSeparadora();',
  '        imprimirMensagem("Fim da execução.");',
  '    }',
  '',
  '    public static void imprimirCabecalho(String titulo) {',
  '        System.out.println("====================================");',
  '        System.out.println(titulo);',
  '        System.out.println("====================================");',
  '    }',
  '',
  '    public static void imprimirMensagem(String mensagem) {',
  '        System.out.println(mensagem);',
  '    }',
  '',
  '    public static void imprimirLinhaSeparadora() {',
  '        System.out.println("------------------------------------");',
  '    }',
  '}',
].join('\n');
const MENU = [
  'public class MenuComTextBlock {',
  '    public static void main(String[] args) {',
  '        imprimirMenu();',
  '    }',
  '',
  '    public static void imprimirMenu() {',
  '        String menu = """',
  '                ====================================',
  '                MENU PRINCIPAL',
  '                ====================================',
  '                1 - Cadastrar cliente',
  '                2 - Cadastrar produto',
  '                3 - Criar pedido',
  '                0 - Sair',
  '                ------------------------------------',
  '                Escolha uma opção:',
  '                """;',
  '        System.out.print(menu);',
  '    }',
  '}',
].join('\n');
const SUMMARY = [
  'import java.math.BigDecimal;',
  '',
  'public class ResumoPedidoConsole {',
  '    public static void main(String[] args) {',
  '        ResumoPedido resumo = new ResumoPedido(',
  '                "Ana Silva", "Notebook Pro",',
  '                new BigDecimal("5000.00"),',
  '                new BigDecimal("500.00"),',
  '                new BigDecimal("4500.00")',
  '        );',
  '        imprimirResumoPedido(resumo);',
  '    }',
  '',
  '    public static void imprimirResumoPedido(ResumoPedido resumo) {',
  '        if (resumo == null) {',
  '            System.out.println("[ERRO] Resumo do pedido é obrigatório.");',
  '            return;',
  '        }',
  '        System.out.println("====================================");',
  '        System.out.println("          RESUMO DO PEDIDO          ");',
  '        System.out.println("====================================");',
  '        System.out.println("Cliente:      " + resumo.cliente());',
  '        System.out.println("Produto:      " + resumo.produto());',
  '        System.out.println("Total Bruto:  R$ " + resumo.totalBruto());',
  '        System.out.println("Desconto:     R$ " + resumo.desconto());',
  '        System.out.println("Total Final:  R$ " + resumo.totalFinal());',
  '        System.out.println("------------------------------------");',
  '    }',
  '}',
  '',
  'record ResumoPedido(String cliente, String produto, BigDecimal totalBruto,',
  '                     BigDecimal desconto, BigDecimal totalFinal) {}',
].join('\n');
const VIEW = [
  'public final class ConsoleView {',
  '    private ConsoleView() {',
  '        // Construtor privado previne instanciação',
  '    }',
  '',
  '    public static void imprimirCabecalho(String titulo) {',
  '        System.out.println("====================================");',
  '        System.out.println(" " + titulo.toUpperCase());',
  '        System.out.println("====================================");',
  '    }',
  '',
  '    public static void imprimirLinha() {',
  '        System.out.println("------------------------------------");',
  '    }',
  '',
  '    public static void imprimirSucesso(String mensagem) {',
  '        System.out.println("[SUCESSO] " + mensagem);',
  '    }',
  '',
  '    public static void imprimirErro(String mensagem) {',
  '        System.out.println("[ERRO] " + mensagem);',
  '    }',
  '}',
].join('\n');
const VIEW_TEST = [
  'public class TesteConsoleView {',
  '    public static void main(String[] args) {',
  '        ConsoleView.imprimirCabecalho("Teste da view");',
  '        ConsoleView.imprimirSucesso("Operação executada");',
  '        ConsoleView.imprimirErro("Falha catastrófica");',
  '        ConsoleView.imprimirLinha();',
  '    }',
  '}',
].join('\n');
const SERVICE_ORDER = [
  'public class OrdemServicoExibicao {',
  '    public static void main(String[] args) {',
  '        OrdemServico preenchida = new OrdemServico(',
  '                "OS-1042", "Ana Silva", "Troca de memória", 350.00);',
  '        exibirOS(preenchida);',
  '        exibirOS(null);',
  '    }',
  '',
  '    public static void exibirOS(OrdemServico os) {',
  '        if (os == null) {',
  '            ConsoleView.imprimirErro("A ordem de serviço não existe.");',
  '            return;',
  '        }',
  '        ConsoleView.imprimirCabecalho("Ordem de Serviço");',
  '        System.out.println("ID:        " + os.id());',
  '        System.out.println("Cliente:   " + os.cliente());',
  '        System.out.println("Descrição: " + os.descricao());',
  '        System.out.printf("Preço:     R$ %.2f%n", os.preco());',
  '        ConsoleView.imprimirLinha();',
  '    }',
  '}',
  '',
  'record OrdemServico(String id, String cliente, String descricao, double preco) {}',
].join('\n');
const EVIDENCE = [
  '# Aula 096 — Métodos de exibição', '',
  '- [ ] Separei cálculo, leitura e exibição',
  '- [ ] Expliquei o contrato de void',
  '- [ ] Executei ExibicaoBasica',
  '- [ ] Comparei Text Block e saída',
  '- [ ] Protegi resumo nulo',
  '- [ ] Centralizei ConsoleView',
  '- [ ] Impedi instanciação do utilitário',
  '- [ ] Testei [SUCESSO] e [ERRO]',
  '- [ ] Entreguei OrdemServicoExibicao',
  '- [ ] Usei Step Over no IntelliJ',
  '- [ ] Respondi as três perguntas',
  '- [ ] Revisei diff e .class',
].join('\n');

const ERRORS = [
  ['Cálculo dentro do print', 'O desconto nasce em uma linha de apresentação.', 'Calcule antes e entregue o dado pronto à view.'],
  ['Retorno sem utilidade', 'O método imprime e devolve a mesma String.', 'Se o contrato é só apresentar, use void.'],
  ['Prints espalhados', 'Cada arquivo inventa divisórias e prefixos.', 'Centralize a identidade em ConsoleView.'],
  ['Scanner na exibição', 'A view também decide quando e como ler.', 'Deixe leitura para o adaptador da próxima aula.'],
  ['Objeto nulo', 'Acesso a resumo.cliente() lança NullPointerException.', 'Use guard clause antes de acessar o record.'],
  ['Utilitário instanciável', 'new ConsoleView() cria objetos sem estado nem propósito.', 'Classe final, construtor private e métodos static.'],
  ['Estado oculto', 'Um void altera dados enquanto parece apenas imprimir.', 'Restrinja o efeito colateral à saída observável.'],
  ['Layout sem prova', 'O código parece alinhado, mas a saída nunca foi conferida.', 'Compile, execute e compare o console real.'],
];
const RESPONSIBILITIES = [
  ['calcular', 'dados brutos', 'valor retornado', 'sem System.out'],
  ['exibir', 'dado pronto', 'console renderizado', 'sem regra de negócio'],
  ['ler', 'teclado', 'dado convertido', 'sem cálculo'],
];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return <button type="button" className="guided-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}
function CodePanel({ name, code, language = 'java' }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}
function ResponsibilityLab() {
  const [selected, setSelected] = useState(1);
  const item = RESPONSIBILITIES[selected];
  return <section className="dm96-stack"><div className="dm96-responsibilities">{RESPONSIBILITIES.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{entry[0]}</strong><small>{entry[1]} → {entry[2]}</small></button>)}</div><div className="dm96-boundary" role="img" aria-label="Fronteira entre cálculo, exibição e leitura"><span>{item[1]}</span><ArrowRight /><strong>{item[0]}()</strong><ArrowRight /><span>{item[2]}</span></div><article className="dm96-rule"><CheckCircle2 /><div><strong>Fronteira desta aula</strong><span>{item[3]}. Hoje o efeito permitido é escrever no console; amanhã a interface pode virar JSON em um controlador Spring Boot.</span></div></article></section>;
}
function VoidLab() {
  const [mode, setMode] = useState('void');
  return <section className="dm96-stack"><div className="dm96-toggle"><button type="button" className={mode === 'value' ? 'active' : ''} onClick={() => setMode('value')}>retorna valor</button><button type="button" className={mode === 'void' ? 'active' : ''} onClick={() => setMode('void')}>produz exibição</button></div><div className="dm96-signature"><Code2 /><code>{mode === 'void' ? 'static void imprimirErro(String mensagem)' : 'static BigDecimal calcularTotal(Pedido pedido)'}</code></div><div className="dm96-call"><span>chamador</span><ArrowRight /><strong>{mode === 'void' ? 'chama e continua' : 'recebe e decide'}</strong><ArrowRight /><span>{mode === 'void' ? 'console muda' : 'variável recebe valor'}</span></div><article className="dm96-warning"><AlertTriangle /><div><strong>void não significa “sem responsabilidade”</strong><span>Ele não devolve valor, mas ainda precisa ter uma intenção única e não pode esconder cálculo ou mutação de domínio.</span></div></article></section>;
}
function BasicLab() {
  const [action, setAction] = useState('all');
  const outputs = { header: ['====================================', 'Sistema de Pedidos', '===================================='], message: ['Bem-vindo ao sistema.'], line: ['------------------------------------'], all: ['====================================', 'Sistema de Pedidos', '====================================', 'Bem-vindo ao sistema.', '------------------------------------', 'Fim da execução.'] };
  return <section className="dm96-stack"><div className="dm96-toggle dm96-four">{[['header', 'cabeçalho'], ['message', 'mensagem'], ['line', 'separador'], ['all', 'main completo']].map(([id, label]) => <button type="button" key={id} className={action === id ? 'active' : ''} onClick={() => setAction(id)}>{label}</button>)}</div><div className="dm96-console"><header><Terminal size={15} />Console observado</header><pre>{outputs[action].join('\n')}</pre></div><CodePanel name="ExibicaoBasica.java" code={BASIC} /></section>;
}
function TextBlockLab() {
  const [tab, setTab] = useState('output');
  const output = ['====================================', 'MENU PRINCIPAL', '====================================', '1 - Cadastrar cliente', '2 - Cadastrar produto', '3 - Criar pedido', '0 - Sair', '------------------------------------', 'Escolha uma opção:'].join('\n');
  return <section className="dm96-stack"><div className="dm96-toggle"><button type="button" className={tab === 'source' ? 'active' : ''} onClick={() => setTab('source')}>código com """</button><button type="button" className={tab === 'output' ? 'active' : ''} onClick={() => setTab('output')}>saída real</button></div>{tab === 'source' ? <CodePanel name="MenuComTextBlock.java" code={MENU} /> : <div className="dm96-console"><header><Monitor size={15} />java MenuComTextBlock</header><pre>{output}</pre></div>}<div className="dm96-incidental"><span>indentação do código</span><ArrowRight /><strong>recuo incidental removido</strong><ArrowRight /><span>menu alinhado à esquerda</span></div><article className="dm96-rule"><LayoutTemplate /><div><strong>Text Block organiza fonte multilinha</strong><span>As três aspas pertencem à String; <code>System.out.print</code> preserva o layout e evita uma coleção de concatenações.</span></div></article></section>;
}
function SummaryLab() {
  const [isNull, setIsNull] = useState(false);
  return <section className="dm96-stack"><div className="dm96-toggle"><button type="button" className={!isNull ? 'active' : ''} onClick={() => setIsNull(false)}>record preenchido</button><button type="button" className={isNull ? 'active danger' : ''} onClick={() => setIsNull(true)}>resumo null</button></div><div className={'dm96-receipt ' + (isNull ? 'error' : '')}>{isNull ? <><strong>[ERRO] Resumo do pedido é obrigatório.</strong><small>guard clause encerrou antes de resumo.cliente()</small></> : <><h3>RESUMO DO PEDIDO</h3><span>Cliente <b>Ana Silva</b></span><span>Produto <b>Notebook Pro</b></span><span>Total Bruto <b>R$ 5000.00</b></span><span>Desconto <b>R$ 500.00</b></span><span>Total Final <b>R$ 4500.00</b></span></>}</div><CodePanel name="ResumoPedidoConsole.java" code={SUMMARY} /></section>;
}
function UtilityLab() {
  const [tab, setTab] = useState('view');
  return <section className="dm96-stack"><div className="dm96-anatomy"><span><b>final</b> não herdar</span><span><b>private</b> não instanciar</span><span><b>static</b> chamar pela classe</span><span><b>um padrão</b> manter num lugar</span></div><div className="dm96-toggle"><button type="button" className={tab === 'view' ? 'active' : ''} onClick={() => setTab('view')}>ConsoleView.java</button><button type="button" className={tab === 'test' ? 'active' : ''} onClick={() => setTab('test')}>TesteConsoleView.java</button></div><CodePanel name={tab === 'view' ? 'ConsoleView.java' : 'TesteConsoleView.java'} code={tab === 'view' ? VIEW : VIEW_TEST} /><div className="dm96-console compact"><pre>{'====================================\n TESTE DA VIEW\n====================================\n[SUCESSO] Operação executada\n[ERRO] Falha catastrófica\n------------------------------------'}</pre></div></section>;
}
function ServiceOrderLab() {
  const [line, setLine] = useState(1);
  const states = [
    ['entrada', 'os = OrdemServico[OS-1042]', 'o parâmetro chegou preenchido'],
    ['guard clause', 'os == null → false', 'a renderização pode continuar'],
    ['cabeçalho', 'ConsoleView.imprimirCabecalho', 'o padrão compartilhado foi reutilizado'],
    ['campos', 'id, cliente, descrição, preço', 'a view apenas lê dados prontos'],
    ['segunda chamada', 'os = null', 'a guard clause delega imprimirErro'],
  ];
  const active = states[line];
  return <section className="dm96-stack"><div className="dm96-debug"><header><span>OrdemServicoExibicao.java · simulação didática do IntelliJ</span><span>Step Over · F8</span></header><div className="dm96-debug-body"><aside>{states.map((state, index) => <button type="button" key={state[0]} className={line === index ? 'active' : ''} onClick={() => setLine(index)}>{index + 1}<span>{state[0]}</span></button>)}</aside><main><small>Variables</small><strong>{active[1]}</strong><p>{active[2]}</p><button type="button" onClick={() => setLine(current => Math.min(current + 1, states.length - 1))} disabled={line === states.length - 1}><StepForward size={15} />Executar Step Over</button></main></div><footer>Observe a sequência das linhas; F8 não entra em ConsoleView.</footer></div><CodePanel name="OrdemServicoExibicao.java" code={SERVICE_ORDER} /></section>;
}
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors cm95-errors dm96-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}
function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const checks = ['seis fontes criadas', 'cálculo fora da view', 'void justificado', 'Text Block executado', 'null protegido', 'ConsoleView não instanciável', 'prefixos testados', 'OS preenchida e nula', 'Step Over observado', 'três respostas registradas', 'saídas comparadas', 'diff e .class revisados'];
  const commands = ['javac *.java', 'java ExibicaoBasica', 'java MenuComTextBlock', 'java ResumoPedidoConsole', 'java TesteConsoleView', 'java OrdemServicoExibicao'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  return <section className="dm96-delivery"><div className="dm96-console"><header><Terminal size={15} />Compilar e provar a oficina<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{'\n\n'}<span>Confirme: menus alinhados, prefixos consistentes, OS preenchida e erro da OS nula.</span></pre></div><div className="dm96-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: uma view trocável sem reescrever a regra</h3></div><p>Entregue <code>OrdemServicoExibicao.java</code> com um record pronto, uma OS nula e toda identidade visual delegada à <code>ConsoleView</code>.</p><ul><li>O método <code>exibirOS</code> retorna void.</li><li>Não calcula preço, desconto ou imposto.</li><li>Null usa <code>ConsoleView.imprimirErro</code>.</li><li>A saída das duas chamadas é observável.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'boundaries', label: 'Mapa de Responsabilidades', duration: '9 min', eyebrow: 'CÁLCULO, EXIBIÇÃO E LEITURA', title: 'Dê uma fronteira explícita para cada tipo de método', blocks: [{ type: 'lead', text: 'A view recebe dados já prontos e transforma esses dados em uma saída observável. Ela não calcula e não lê teclado.' }, { type: 'responsibility' }] },
  { id: 'void', label: 'Contrato do void', duration: '8 min', eyebrow: 'EFEITO VISÍVEL, RETORNO AUSENTE', title: 'Use void quando o resultado é a própria apresentação', blocks: [{ type: 'lead', text: 'Ausência de retorno não autoriza ausência de critério: o método ainda precisa ter nome, entrada e responsabilidade claros.' }, { type: 'void' }] },
  { id: 'basic', label: 'Exibição Básica', duration: '14 min', eyebrow: 'CABEÇALHO, MENSAGEM E LINHA', title: 'Monte peças pequenas e veja cada uma no console', blocks: [{ type: 'lead', text: 'Execute as rotinas separadamente e depois acompanhe a ordem completa do main.' }, { type: 'basic' }] },
  { id: 'text-block', label: 'Menu com Text Block', duration: '13 min', eyebrow: 'FONTE MULTILINHA, SAÍDA ALINHADA', title: 'Compare as três aspas com o menu que realmente aparece', blocks: [{ type: 'lead', text: 'Text Blocks, disponíveis desde Java 15, deixam o layout legível no código sem exigir concatenação linha a linha.' }, { type: 'text-block' }] },
  { id: 'summary', label: 'Resumo com record', duration: '14 min', eyebrow: 'DADO PRONTO, GUARD CLAUSE', title: 'Apresente um record sem transformar a view em regra de negócio', blocks: [{ type: 'lead', text: 'O record transporta os valores; o método apenas organiza rótulos, alinhamento e resposta para null.' }, { type: 'summary' }] },
  { id: 'utility', label: 'ConsoleView Utilitária', duration: '13 min', eyebrow: 'FINAL, PRIVATE E STATIC', title: 'Centralize a identidade visual e prove a classe com uma chamada real', blocks: [{ type: 'lead', text: 'Uma classe sem estado compartilhado não precisa ser instanciada: o construtor privado protege esse contrato.' }, { type: 'utility' }] },
  { id: 'challenge', label: 'OS e Step Over', duration: '16 min', eyebrow: 'TRANSFERÊNCIA E INTELLIJ', title: 'Exiba uma ordem de serviço e acompanhe cada linha com F8', blocks: [{ type: 'lead', text: 'A simulação didática mostra o que observar no IntelliJ: parâmetro, guard clause, delegação e segunda chamada nula.' }, { type: 'service-order' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'SINTOMA, FRONTEIRA E CORREÇÃO', title: 'Diagnostique views que escondem trabalho demais', blocks: [{ type: 'lead', text: 'Leia cada caso pelo efeito observado e recoloque cálculo, leitura, estado e apresentação em seus lugares.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '11 min', eyebrow: 'BUILD, SAÍDA E EVIDÊNCIA', title: 'Compile seis fontes e defenda a separação da interface', blocks: [{ type: 'lead', text: 'A entrega termina quando código, console, respostas de estudo e Git contam a mesma história.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'responsibility') return <ResponsibilityLab />;
  if (block.type === 'void') return <VoidLab />;
  if (block.type === 'basic') return <BasicLab />;
  if (block.type === 'text-block') return <TextBlockLab />;
  if (block.type === 'summary') return <SummaryLab />;
  if (block.type === 'utility') return <UtilityLab />;
  if (block.type === 'service-order') return <ServiceOrderLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedDisplayMethodsLesson096({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-display-methods-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Eye size={17} />Oficina de apresentação no console</span><p className="guided-sequence">096 · M3.07</p><h1>Faça a interface mudar sem reescrever a regra</h1><p>Separe cálculo, leitura e exibição; depois padronize menus, mensagens e resumos com métodos void verificáveis.</p></div><div className="guided-hero-status"><Monitor size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 096" items={[{ value: '6 fontes', label: 'Compiladas de verdade' }, { value: '3 fronteiras', label: 'Cálculo, view e leitura' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 096"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Views pequenas, consistentes e trocáveis</h3><p>{lessonComplete ? 'Aula concluída e pronta para métodos de leitura.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 095</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>void, Text Block e ConsoleView</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 097<ArrowRight size={17} /></button></footer></article>;
}
