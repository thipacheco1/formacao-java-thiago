import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Bug, Check, CheckCircle2, ChevronDown, ChevronUp, Clock3, Copy, FileCode2, FlaskConical, ListChecks, Play, RotateCcw, Sparkles, StepForward, Terminal, Variable } from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedMethodDebugLesson.css';

const STORAGE_KEY = 'guided-method-debug-lesson-099-progress';
const CALL_STACK = [
  'public class DebugCallStack {',
  '    public static void main(String[] args) {',
  '        System.out.println("Iniciando main...");',
  '        executarPrimeiroNivel();',
  '        System.out.println("Finalizando main...");',
  '    }', '',
  '    public static void executarPrimeiroNivel() {',
  '        System.out.println("Entrou no Primeiro Nível");',
  '        executarSegundoNivel();',
  '        System.out.println("Saiu do Primeiro Nível");',
  '    }', '',
  '    public static void executarSegundoNivel() {',
  '        System.out.println("Entrou no Segundo Nível (Topo da Pilha)");',
  '        // Breakpoint na linha abaixo',
  '        System.out.println("Executando lógica no topo...");',
  '    }',
  '}',
].join('\n');
const BUGGY = [
  'import java.math.BigDecimal;', '',
  'public class DebugCalculoComBug {',
  '    public static void main(String[] args) {',
  '        BigDecimal precoProduto = new BigDecimal("100.00");',
  '        int quantidade = 3;',
  '        BigDecimal totalCalculado = processarCompra(precoProduto, quantidade);',
  '        System.out.println("Total Calculado Final: R$ " + totalCalculado);',
  '    }', '',
  '    public static BigDecimal processarCompra(BigDecimal preco, int qtde) {',
  '        BigDecimal totalBruto = preco.multiply(BigDecimal.valueOf(qtde));',
  '        BigDecimal comImposto = aplicarImposto(totalBruto);',
  '        // BUG: totalBruto descarta o imposto já calculado',
  '        BigDecimal comFrete = aplicarFrete(totalBruto);',
  '        return comFrete;',
  '    }', '',
  '    public static BigDecimal aplicarImposto(BigDecimal valor) {',
  '        BigDecimal taxa = new BigDecimal("0.05");',
  '        return valor.add(valor.multiply(taxa));',
  '    }', '',
  '    public static BigDecimal aplicarFrete(BigDecimal valor) {',
  '        BigDecimal freteFixo = new BigDecimal("15.00");',
  '        return valor.add(freteFixo);',
  '    }',
  '}',
].join('\n');
const FIXED = [
  'import java.math.BigDecimal;', '',
  'public class DebugCalculoCorrigido {',
  '    public static void main(String[] args) {',
  '        BigDecimal precoProduto = new BigDecimal("100.00");',
  '        int quantidade = 3;',
  '        BigDecimal totalCalculado = processarCompra(precoProduto, quantidade);',
  '        System.out.println("Total Calculado Final: R$ " + totalCalculado);',
  '    }', '',
  '    public static BigDecimal processarCompra(BigDecimal preco, int qtde) {',
  '        BigDecimal totalBruto = preco.multiply(BigDecimal.valueOf(qtde));',
  '        BigDecimal comImposto = aplicarImposto(totalBruto);',
  '        BigDecimal comFrete = aplicarFrete(comImposto);',
  '        return comFrete;',
  '    }', '',
  '    public static BigDecimal aplicarImposto(BigDecimal valor) {',
  '        BigDecimal taxa = new BigDecimal("0.05");',
  '        return valor.add(valor.multiply(taxa));',
  '    }', '',
  '    public static BigDecimal aplicarFrete(BigDecimal valor) {',
  '        BigDecimal freteFixo = new BigDecimal("15.00");',
  '        return valor.add(freteFixo);',
  '    }',
  '}',
].join('\n');
const STACK_TRACE = [
  'public class DebugStackTrace {',
  '    public static void main(String[] args) {',
  '        processarPedido();',
  '    }', '',
  '    static void processarPedido() {',
  '        validarQuantidade(0);',
  '    }', '',
  '    static void validarQuantidade(int quantidade) {',
  '        if (quantidade <= 0) {',
  '            throw new IllegalArgumentException("Quantidade deve ser positiva");',
  '        }',
  '    }',
  '}',
].join('\n');
const EVIDENCE = [
  '# Aula 099 — Debug entrando em métodos', '',
  '- [ ] Expliquei Call Stack e frames',
  '- [ ] Diferenciei F8, F7 e Shift+F8',
  '- [ ] Criei breakpoint na calha',
  '- [ ] Naveguei main → nível 1 → nível 2',
  '- [ ] Inspecionei Frames e Variables',
  '- [ ] Reproduzi o total incorreto 315.00',
  '- [ ] Entrei em aplicarImposto e aplicarFrete',
  '- [ ] Corrigi totalBruto para comImposto',
  '- [ ] Confirmei a saída 330.00',
  '- [ ] Li StackTrace do topo para baixo',
  '- [ ] Usei Evaluate Expression Alt+F8',
  '- [ ] Respondi as três perguntas',
  '- [ ] Revisei diff e .class',
].join('\n');
const ERRORS = [
  ['F8 em tudo', 'Step Over passa pelo método que continha o defeito.', 'Reinicie no ponto conhecido e use F7 na chamada suspeita.'],
  ['F7 em biblioteca', 'Você entra em System.out ou BigDecimal sem precisar.', 'Use F8 em APIs do JDK, salvo hipótese específica.'],
  ['Frame errado', 'Variables parece não conter o valor esperado.', 'Confira o frame selecionado e volte ao topo da pilha.'],
  ['Breakpoint tarde demais', 'A variável já recebeu o valor incorreto.', 'Pare antes da chamada que transforma o estado.'],
  ['Step Into acidental', 'Você entrou em um método longo irrelevante.', 'Use Step Out com Shift+F8 para voltar ao chamador.'],
  ['StackTrace invertida', 'A investigação começa pelo último frame genérico.', 'Leia a exceção e o primeiro frame do seu código no topo.'],
  ['Sintoma confundido com causa', '315.00 é corrigido diretamente no print.', 'Rastreie a origem do argumento passado a aplicarFrete.'],
  ['Correção sem nova prova', 'A linha muda, mas o fluxo não é executado novamente.', 'Compile, rode e confirme exatamente R$ 330.00.'],
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
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}
function StackModelLab() {
  const [depth, setDepth] = useState(2);
  const frames = [
    ['executarSegundoNivel()', 'topo · executando agora'],
    ['executarPrimeiroNivel()', 'pausado esperando retorno'],
    ['main()', 'base · pausado esperando retorno'],
  ];
  return <section className="md99-stack"><div className="md99-stack-model">{frames.slice(2 - depth).map((frame, index) => <div key={frame[0]} className={index === 0 ? 'top' : ''}><strong>{frame[0]}</strong><small>{frame[1]}</small></div>)}</div><div className="md99-depth"><button type="button" onClick={() => setDepth(value => Math.max(0, value - 1))} disabled={depth === 0}><ChevronDown />retornar método</button><span>{depth + 1} frames ativos</span><button type="button" onClick={() => setDepth(value => Math.min(2, value + 1))} disabled={depth === 2}><ChevronUp />entrar em método</button></div><article className="md99-rule"><CheckCircle2 /><div><strong>Call Stack é histórico vivo de chamadas ativas</strong><span>Quando o topo termina, ele é desempilhado e a JVM retoma a instrução seguinte no chamador logo abaixo.</span></div></article></section>;
}
function ControlsLab() {
  const [selected, setSelected] = useState(1);
  const controls = [
    ['Step Over', 'F8', 'executa a chamada inteira e para na próxima linha do arquivo atual', 'System.out.println e APIs nativas'],
    ['Step Into', 'F7', 'entra no método chamado na linha atual', 'cálculo ou validação sob investigação'],
    ['Step Out', 'Shift + F8', 'termina o método atual e volta ao chamador', 'método longo ou irrelevante acessado por engano'],
  ];
  const current = controls[selected];
  return <section className="md99-stack"><div className="md99-controls">{controls.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{item[1]}</span><strong>{item[0]}</strong></button>)}</div><div className="md99-control-flow"><span>linha com chamada</span><ArrowRight /><strong>{current[2]}</strong><ArrowRight /><span>{current[3]}</span></div><article className="md99-rule"><Play /><div><strong>Escolha o comando pela hipótese</strong><span>F7 investiga uma implementação; F8 preserva o nível atual; Shift+F8 recupera o contexto do chamador.</span></div></article></section>;
}
function CallStackCodeLab() {
  const [event, setEvent] = useState(0);
  const output = ['Iniciando main...', 'Entrou no Primeiro Nível', 'Entrou no Segundo Nível (Topo da Pilha)', 'Executando lógica no topo...', 'Saiu do Primeiro Nível', 'Finalizando main...'];
  return <section className="md99-stack"><div className="md99-timeline">{output.map((line, index) => <button type="button" key={line} className={(event === index ? 'active ' : '') + (event > index ? 'done' : '')} onClick={() => setEvent(index)}><span>{index + 1}</span><strong>{line}</strong></button>)}</div><div className="md99-console"><header><Terminal size={15} />Console até o ponto selecionado</header><pre>{output.slice(0, event + 1).join('\n')}</pre></div><CodePanel name="DebugCallStack.java" code={CALL_STACK} /></section>;
}
function IntelliJFramesLab() {
  const [frame, setFrame] = useState(0);
  const frames = [
    ['executarSegundoNivel:17', 'DebugCallStack.java', 'linhaAtual = "Executando lógica no topo..."'],
    ['executarPrimeiroNivel:10', 'DebugCallStack.java', 'aguarda executarSegundoNivel()'],
    ['main:4', 'DebugCallStack.java', 'aguarda executarPrimeiroNivel()'],
  ];
  const current = frames[frame];
  return <section className="md99-stack"><div className="md99-ide"><header><span>DebugCallStack.java · simulação didática do IntelliJ</span><span>Debug · Frames · Variables</span></header><div className="md99-ide-body"><aside><small>FRAMES</small>{frames.map((item, index) => <button type="button" key={item[0]} className={frame === index ? 'active' : ''} onClick={() => setFrame(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>EDITOR / ESCOPO SELECIONADO</small><strong>{current[1]}</strong><code>{current[0]}</code><p>{current[2]}</p><div className="md99-variables"><Variable /><span>O escopo muda ao clicar em cada frame; a execução continua pausada no topo.</span></div></main></div><footer>Breakpoint: clique na calha ao lado da linha 17 · Iniciar Debug: Shift + F9</footer></div></section>;
}
function BugMapLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['totalBruto', '100.00 × 3', '300.00'],
    ['comImposto', '300.00 + 5%', '315.0000'],
    ['argumento do frete', 'totalBruto', '300.00'],
    ['comFrete', '300.00 + 15.00', '315.00'],
  ];
  const current = stages[stage];
  return <section className="md99-stack"><div className="md99-values">{stages.map((item, index) => <button type="button" key={item[0]} className={(stage === index ? 'active ' : '') + (index === 2 ? 'danger' : '')} onClick={() => setStage(index)}><span>{index + 1}</span><strong>{item[0]}</strong><small>{item[2]}</small></button>)}</div><div className="md99-calculation"><span>{current[1]}</span><ArrowRight /><strong>{current[2]}</strong></div><article className="md99-warning"><AlertTriangle /><div><strong>O valor não “cai”; o argumento volta ao bruto</strong><span><code>comImposto</code> contém 315.00, mas <code>aplicarFrete(totalBruto)</code> recebe 300.00 e descarta a composição anterior.</span></div></article><CodePanel name="DebugCalculoComBug.java" code={BUGGY} /></section>;
}
function TraceLab() {
  const [step, setStep] = useState(0);
  const trace = [
    ['processarCompra', 'totalBruto = 300.00', ['processarCompra', 'main']],
    ['aplicarImposto', 'valor = 300.00 · taxa = 0.05', ['aplicarImposto', 'processarCompra', 'main']],
    ['processarCompra', 'comImposto = 315.0000', ['processarCompra', 'main']],
    ['aplicarFrete', 'valor = 300.00 · frete = 15.00', ['aplicarFrete', 'processarCompra', 'main']],
    ['processarCompra', 'comFrete = 315.00', ['processarCompra', 'main']],
  ];
  const current = trace[step];
  return <section className="md99-stack"><div className="md99-debugger"><header><span>DebugCalculoComBug.java · sessão guiada</span><span>F7 · F8 · Shift+F8</span></header><div className="md99-debugger-body"><main><small>VARIABLES</small><strong>{current[0]}</strong><code>{current[1]}</code><button type="button" onClick={() => setStep(value => Math.min(value + 1, trace.length - 1))} disabled={step === trace.length - 1}><StepForward size={15} />Próximo passo de debug</button></main><aside><small>FRAMES</small>{current[2].map((frame, index) => <span key={frame} className={index === 0 ? 'top' : ''}>{frame}</span>)}</aside></div><footer>Na quarta pausa, Variables prova que aplicarFrete recebeu 300.00, não 315.00.</footer></div></section>;
}
function FixLab() {
  const [version, setVersion] = useState('fixed');
  return <section className="md99-stack"><div className="md99-toggle"><button type="button" className={version === 'bug' ? 'active danger' : ''} onClick={() => setVersion('bug')}>aplicarFrete(totalBruto)</button><button type="button" className={version === 'fixed' ? 'active' : ''} onClick={() => setVersion('fixed')}>aplicarFrete(comImposto)</button></div><div className="md99-comparison"><div><small>ENTRADA DO FRETE</small><strong>{version === 'bug' ? '300.00' : '315.0000'}</strong></div><ArrowRight /><div><small>TOTAL FINAL</small><strong>{version === 'bug' ? '315.00 incorreto' : '330.0000 correto'}</strong></div></div><CodePanel name="DebugCalculoCorrigido.java" code={FIXED} /><div className="md99-console"><pre>Total Calculado Final: R$ 330.0000</pre></div></section>;
}
function StackTraceLab() {
  const [line, setLine] = useState(0);
  const lines = [
    ['Exceção', 'IllegalArgumentException: Quantidade deve ser positiva', 'tipo e mensagem da falha'],
    ['Topo', 'DebugStackTrace.validarQuantidade(DebugStackTrace.java:12)', 'linha que lançou diretamente'],
    ['Chamador', 'DebugStackTrace.processarPedido(DebugStackTrace.java:7)', 'quem pediu a validação'],
    ['Base', 'DebugStackTrace.main(DebugStackTrace.java:3)', 'entrada do programa'],
  ];
  const current = lines[line];
  return <section className="md99-stack"><div className="md99-trace-lines">{lines.map((item, index) => <button type="button" key={item[0]} className={line === index ? 'active' : ''} onClick={() => setLine(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</div><div className="md99-stacktrace"><small>{current[2]}</small><strong>{current[1]}</strong></div><article className="md99-rule"><ArrowDown /><div><strong>Leia de cima para baixo</strong><span>A Call Stack existe durante a execução; a StackTrace registra essa cadeia no momento em que a exceção atravessa os frames.</span></div></article><CodePanel name="DebugStackTrace.java" code={STACK_TRACE} /></section>;
}
function EvaluateLab() {
  const [expression, setExpression] = useState('comImposto.add(new BigDecimal("15.00"))');
  const results = {
    'comImposto.add(new BigDecimal("15.00"))': '330.0000',
    'totalBruto.add(new BigDecimal("15.00"))': '315.00',
    'comImposto.compareTo(totalBruto)': '1',
  };
  return <section className="md99-stack"><div className="md99-evaluate"><header><FlaskConical />Evaluate Expression · Alt + F8</header><label>Expressão<select value={expression} onChange={event => setExpression(event.target.value)}>{Object.keys(results).map(item => <option key={item}>{item}</option>)}</select></label><div><small>RESULT</small><strong>{results[expression]}</strong></div></div><article className="md99-warning"><AlertTriangle /><div><strong>Avaliar não altera o arquivo</strong><span>Use a janela para testar uma hipótese no contexto pausado; depois faça a correção nominal no código e execute novamente.</span></div></article></section>;
}
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors md99-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}
function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const checks = ['quatro fontes criadas', 'breakpoint na calha', 'Frames inspecionados', 'Variables comparadas', 'F8 explicado', 'F7 usado nas funções próprias', 'Shift+F8 praticado', 'bug 315.00 reproduzido', 'argumento incorreto localizado', 'saída 330.00 confirmada', 'StackTrace lida do topo', 'Alt+F8 usado', 'três respostas registradas', 'diff e .class revisados'];
  const commands = ['javac *.java', 'java DebugCallStack', 'java DebugCalculoComBug', 'java DebugCalculoCorrigido', 'java DebugStackTrace'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  return <section className="md99-delivery"><div className="md99-terminal"><header><Terminal size={15} />Compilar, comparar e provocar a exceção<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{'\n\n'}<span>DebugStackTrace termina com erro de propósito; os outros três programas devem completar.</span></pre></div><div className="md99-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: prove a causa antes de corrigir</h3></div><p>Pare em <code>processarCompra</code>, entre apenas nos métodos próprios, registre o valor recebido por <code>aplicarFrete</code> e altere somente o argumento incorreto.</p><ul><li>Reproduza R$ 315.00 primeiro.</li><li>Use Frames para manter o caminho visível.</li><li>Confirme <code>comImposto = 315.00</code>.</li><li>Execute novamente até R$ 330.00.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'stack-model', label: 'Modelo da Call Stack', duration: '10 min', eyebrow: 'FRAME, TOPO E RETORNO', title: 'Veja quem chamou quem e onde a execução retomará', blocks: [{ type: 'lead', text: 'A pilha mantém métodos ativos: o topo executa; os chamadores abaixo aguardam o retorno.' }, { type: 'stack-model' }] },
  { id: 'controls', label: 'F8, F7 e Shift+F8', duration: '9 min', eyebrow: 'OVER, INTO E OUT', title: 'Escolha o movimento de debug pela sua hipótese', blocks: [{ type: 'lead', text: 'Os três comandos não são velocidades diferentes: cada um preserva ou muda o nível observado.' }, { type: 'controls' }] },
  { id: 'call-code', label: 'Programa em Camadas', duration: '12 min', eyebrow: 'MAIN, NÍVEL 1 E NÍVEL 2', title: 'Relacione ordem do console com entrada e retorno de métodos', blocks: [{ type: 'lead', text: 'O programa completo deixa visível a ordem de empilhamento e desempilhamento antes de abrir o debugger.' }, { type: 'call-code' }] },
  { id: 'frames', label: 'IntelliJ: Frames', duration: '14 min', eyebrow: 'BREAKPOINT, ESCOPO E PILHA', title: 'Clique nos frames sem mover o ponto de execução', blocks: [{ type: 'lead', text: 'A simulação didática localiza calha, Frames e escopo; no IntelliJ, pare na linha indicada com Shift+F9.' }, { type: 'frames' }] },
  { id: 'bug-map', label: 'Mapa do Bug', duration: '13 min', eyebrow: 'BRUTO, IMPOSTO E FRETE', title: 'Acompanhe o argumento que descarta R$ 15 de imposto', blocks: [{ type: 'lead', text: 'O erro está na composição: comImposto é calculado, mas aplicarFrete recebe totalBruto.' }, { type: 'bug-map' }] },
  { id: 'trace', label: 'Step Into no Fluxo', duration: '15 min', eyebrow: 'VARIABLES E FRAMES EM CINCO PAUSAS', title: 'Entre nos métodos e prove a origem do valor 315.00', blocks: [{ type: 'lead', text: 'Use F7 nas funções próprias, F8 em APIs nativas e Shift+F8 se entrar em um trecho irrelevante.' }, { type: 'trace' }] },
  { id: 'fix', label: 'Correção Comprovada', duration: '11 min', eyebrow: 'UM ARGUMENTO, NOVA EVIDÊNCIA', title: 'Passe comImposto ao frete e confirme R$ 330.00', blocks: [{ type: 'lead', text: 'A correção altera somente a entrada do frete; a execução posterior precisa provar o comportamento esperado.' }, { type: 'fix' }] },
  { id: 'stacktrace', label: 'Ler StackTrace', duration: '12 min', eyebrow: 'EXCEÇÃO E CADEIA DE CHAMADAS', title: 'Comece no topo e reencontre o caminho até main', blocks: [{ type: 'lead', text: 'A mensagem explica a falha; o primeiro frame do seu código mostra onde ela nasceu; os seguintes mostram os chamadores.' }, { type: 'stacktrace' }] },
  { id: 'evaluate', label: 'Evaluate Expression', duration: '8 min', eyebrow: 'ALT+F8 E HIPÓTESE TEMPORÁRIA', title: 'Teste a composição correta sem editar o arquivo', blocks: [{ type: 'lead', text: 'Evaluate Expression usa as variáveis do frame selecionado para confirmar uma hipótese durante a pausa.' }, { type: 'evaluate' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'COMANDO, FRAME E CAUSA', title: 'Diagnostique oito hábitos que fazem o debug virar adivinhação', blocks: [{ type: 'lead', text: 'Cada caso começa pelo sintoma observado e termina com uma nova evidência, não com cliques aleatórios.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '11 min', eyebrow: 'PROVA, REGISTRO E GIT', title: 'Entregue o bug, a investigação e a correção como uma cadeia explicável', blocks: [{ type: 'lead', text: 'A aula termina com quatro fontes, dois resultados comparáveis, uma exceção intencional e decisões de debug defendidas.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'stack-model') return <StackModelLab />;
  if (block.type === 'controls') return <ControlsLab />;
  if (block.type === 'call-code') return <CallStackCodeLab />;
  if (block.type === 'frames') return <IntelliJFramesLab />;
  if (block.type === 'bug-map') return <BugMapLab />;
  if (block.type === 'trace') return <TraceLab />;
  if (block.type === 'fix') return <FixLab />;
  if (block.type === 'stacktrace') return <StackTraceLab />;
  if (block.type === 'evaluate') return <EvaluateLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedMethodDebugLesson099({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-method-debug-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Bug size={17} />Laboratório de navegação no debugger</span><p className="guided-sequence">099 · M3.10</p><h1>Entre no método, leia a pilha e prove a causa</h1><p>Navegue com F8, F7 e Shift+F8, inspecione Frames e Variables e corrija um cálculo encadeado sem adivinhar.</p></div><div className="guided-hero-status"><Bug size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 099" items={[{ value: '4 fontes', label: 'Compiladas e executadas' }, { value: '5 pausas', label: 'No rastreamento do bug' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 099"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Fluxo rastreado, causa provada, correção executada</h3><p>{lessonComplete ? 'Aula concluída e pronta para Extract Method.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 098</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Call Stack, Frames e navegação</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 100<ArrowRight size={17} /></button></footer></article>;
}
