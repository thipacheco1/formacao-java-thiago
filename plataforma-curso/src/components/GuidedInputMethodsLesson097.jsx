import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Braces, Bug, Check, CheckCircle2, Clock3, Copy, FileCode2, Keyboard, ListChecks, PackageCheck, Play, RotateCcw, ScanLine, Sparkles, Terminal } from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedInputMethodsLesson.css';

const STORAGE_KEY = 'guided-input-methods-lesson-097-progress';
const TEXT_INPUT = [
  'import java.util.Scanner;', '',
  'public class LeituraTextoObrigatorio {',
  '    public static void main(String[] args) {',
  '        Scanner scanner = new Scanner(System.in);',
  '        String nome = lerTextoObrigatorio(scanner, "Digite seu nome completo: ");',
  '        System.out.println("Nome armazenado com sucesso: " + nome);',
  '    }', '',
  '    public static String lerTextoObrigatorio(Scanner scanner, String instrucao) {',
  '        while (true) {',
  '            System.out.print(instrucao);',
  '            String entrada = scanner.nextLine();',
  '            if (entrada != null && !entrada.trim().isEmpty()) {',
  '                return entrada.trim();',
  '            }',
  '            System.out.println("[ERRO] Este campo é obrigatório. Tente novamente.");',
  '        }',
  '    }',
  '}',
].join('\n');
const INTEGER_INPUT = [
  'import java.util.Scanner;', '',
  'public class LeituraInteiro {',
  '    public static void main(String[] args) {',
  '        Scanner scanner = new Scanner(System.in);',
  '        int idade = lerInteiro(scanner, "Digite sua idade: ");',
  '        System.out.println("Idade registrada: " + idade + " anos.");',
  '    }', '',
  '    public static int lerInteiro(Scanner scanner, String instrucao) {',
  '        while (true) {',
  '            System.out.print(instrucao);',
  '            String entrada = scanner.nextLine();',
  '            try {',
  '                return Integer.parseInt(entrada.trim());',
  '            } catch (NumberFormatException e) {',
  '                System.out.println("[ERRO] Valor numérico inválido. Por favor, digite um número inteiro.");',
  '            }',
  '        }',
  '    }',
  '}',
].join('\n');
const CONSOLE_INPUT = [
  'import java.math.BigDecimal;',
  'import java.util.Scanner;', '',
  'public final class ConsoleInput {',
  '    private ConsoleInput() {',
  '    }', '',
  '    public static String lerTexto(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            String entrada = scanner.nextLine();',
  '            if (entrada != null && !entrada.trim().isEmpty()) {',
  '                return entrada.trim();',
  '            }',
  '            System.out.println("[ERRO] Texto inválido.");',
  '        }',
  '    }', '',
  '    public static int lerInteiroPositivo(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            String entrada = scanner.nextLine();',
  '            try {',
  '                int valor = Integer.parseInt(entrada.trim());',
  '                if (valor > 0) {',
  '                    return valor;',
  '                }',
  '                System.out.println("[ERRO] Digite um valor maior que zero.");',
  '            } catch (NumberFormatException e) {',
  '                System.out.println("[ERRO] Digite um número inteiro válido.");',
  '            }',
  '        }',
  '    }', '',
  '    public static BigDecimal lerBigDecimal(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            String entrada = scanner.nextLine();',
  '            try {',
  '                BigDecimal valor = new BigDecimal(entrada.trim());',
  '                if (valor.compareTo(BigDecimal.ZERO) > 0) {',
  '                    return valor;',
  '                }',
  '                System.out.println("[ERRO] Digite um valor decimal positivo.");',
  '            } catch (NumberFormatException e) {',
  '                System.out.println("[ERRO] Formato decimal inválido (use ponto como separador).");',
  '            }',
  '        }',
  '    }',
  '}',
].join('\n');
const PRODUCT = [
  'import java.math.BigDecimal;',
  'import java.util.Scanner;', '',
  'public class CadastroProdutoConsole {',
  '    public static void main(String[] args) {',
  '        Scanner scanner = new Scanner(System.in);',
  '        String nome = ConsoleInput.lerTexto(scanner, "Nome do produto: ");',
  '        int quantidade = ConsoleInput.lerInteiroPositivo(scanner, "Quantidade em estoque: ");',
  '        BigDecimal preco = ConsoleInput.lerBigDecimal(scanner, "Preço do produto: ");', '',
  '        System.out.println("====================================");',
  '        System.out.println("PRODUTO CADASTRADO");',
  '        System.out.println("====================================");',
  '        System.out.println("Nome: " + nome);',
  '        System.out.println("Quantidade: " + quantidade);',
  '        System.out.println("Preço: R$ " + preco);',
  '    }',
  '}',
].join('\n');
const EVIDENCE = [
  '# Aula 097 — Métodos de leitura', '',
  '- [ ] Expliquei o adaptador de entrada',
  '- [ ] Reproduzi o Enter residual do nextInt',
  '- [ ] Preferi nextLine + parse manual',
  '- [ ] Repeti texto obrigatório até validar',
  '- [ ] Tratei NumberFormatException',
  '- [ ] Diferenciei InputMismatchException',
  '- [ ] Passei um único Scanner por parâmetro',
  '- [ ] Não fechei System.in',
  '- [ ] Validei inteiro e BigDecimal positivos',
  '- [ ] Entreguei CadastroProdutoConsole',
  '- [ ] Depurei lerBigDecimal no IntelliJ',
  '- [ ] Revisei respostas, diff e .class',
].join('\n');
const ERRORS = [
  ['InputMismatchException', 'nextInt() recebe "abc" e o programa aborta.', 'Prefira nextLine + parse ou trate e descarte a entrada inválida.'],
  ['Menu pulado', 'nextLine() consome o Enter deixado por nextInt().', 'Consuma a quebra residual ou leia tudo com nextLine().'],
  ['Regra na leitura', 'O adaptador calcula desconto ou comissão.', 'Retorne o dado convertido; a regra pertence ao cálculo.'],
  ['Vários Scanners', 'Métodos disputam o mesmo System.in e o buffer fica imprevisível.', 'Crie um Scanner no main e passe-o por parâmetro.'],
  ['System.in fechado', 'scanner.close() impede toda leitura posterior.', 'Não feche o Scanner compartilhado durante a aplicação.'],
  ['Loop sem saída', 'while(true) nunca retorna nem muda a condição.', 'Retorne somente no caminho válido e teste uma sequência completa.'],
  ['Espaços aceitos', '"   " atravessa como texto obrigatório.', 'Aplique trim antes de isEmpty e antes de retornar.'],
  ['Vírgula decimal', 'new BigDecimal("19,90") lança NumberFormatException.', 'Nesta oficina, explique e exija ponto: 19.90.'],
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
function AdapterLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['teclado', '"  25  "', 'dado externo ainda bruto'],
    ['captura', 'nextLine()', 'uma String completa chega ao programa'],
    ['higiene', 'trim()', 'espaços laterais deixam de importar'],
    ['conversão', 'Integer.parseInt()', 'texto vira int ou lança erro controlável'],
    ['contrato', 'valor > 0', 'a borda libera somente um valor válido'],
  ];
  const current = stages[stage];
  return <section className="im97-stack"><div className="im97-pipeline">{stages.map((item, index) => <button type="button" key={item[0]} className={(stage === index ? 'active ' : '') + (stage > index ? 'done' : '')} onClick={() => setStage(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</div><div className="im97-adapter"><Keyboard /><ArrowRight /><strong>{current[1]}</strong><ArrowRight /><PackageCheck /><span>{current[2]}</span></div><article className="im97-rule"><CheckCircle2 /><div><strong>Entrada é uma fronteira</strong><span>No console ela recebe teclado; em uma API, a mesma ideia protege o JSON HTTP Request antes do domínio.</span></div></article></section>;
}
function BufferLab() {
  const [strategy, setStrategy] = useState('mixed');
  const [step, setStep] = useState(0);
  const mixed = [
    ['buffer', '25⏎', 'dígitos e Enter aguardam consumo'],
    ['nextInt()', '⏎', '25 foi lido; a quebra permaneceu'],
    ['nextLine()', 'vazio', 'a pergunta seguinte consome o Enter imediatamente'],
  ];
  const safe = [
    ['buffer', '25⏎', 'a linha completa aguarda consumo'],
    ['nextLine()', '"25"', 'dígitos e Enter são consumidos juntos'],
    ['parseInt()', '25', 'a conversão ocorre em um try-catch observável'],
  ];
  const states = strategy === 'mixed' ? mixed : safe;
  const current = states[step];
  const choose = value => { setStrategy(value); setStep(0); };
  return <section className="im97-stack"><div className="im97-toggle"><button type="button" className={strategy === 'mixed' ? 'active danger' : ''} onClick={() => choose('mixed')}>nextInt + nextLine</button><button type="button" className={strategy === 'safe' ? 'active' : ''} onClick={() => choose('safe')}>nextLine + parse</button></div><div className="im97-buffer"><header><ScanLine size={17} />Buffer do Scanner · passo {step + 1} de 3</header><div><span>{current[0]}</span><strong>{current[1]}</strong><small>{current[2]}</small></div><button type="button" onClick={() => setStep(value => Math.min(value + 1, 2))} disabled={step === 2}><Play size={15} />Consumir próxima operação</button></div><article className={strategy === 'mixed' ? 'im97-warning' : 'im97-rule'}><AlertTriangle /><div><strong>{strategy === 'mixed' ? 'Menu pulado reproduzido' : 'Estratégia preferida nesta aula'}</strong><span>{strategy === 'mixed' ? 'Também seria possível chamar um nextLine fantasma após nextInt, mas misturar APIs exige disciplina constante.' : 'Capturar String primeiro permite validar, explicar a falha e repetir a pergunta sem perder o buffer.'}</span></div></article></section>;
}
function TextLab() {
  const [attempt, setAttempt] = useState(0);
  const attempts = [['"   "', 'inválido', '[ERRO] Este campo é obrigatório. Tente novamente.'], ['" Ana Silva "', 'válido', 'Nome armazenado com sucesso: Ana Silva']];
  const current = attempts[attempt];
  return <section className="im97-stack"><div className="im97-attempts">{attempts.map((item, index) => <button type="button" key={item[0]} className={attempt === index ? 'active' : ''} onClick={() => setAttempt(index)}><span>{index + 1}</span><code>{item[0]}</code><small>{item[1]}</small></button>)}</div><div className="im97-console"><header><Terminal size={15} />java LeituraTextoObrigatorio</header><pre>Digite seu nome completo: <b>{current[0]}</b>{'\n'}<span>{current[2]}</span>{attempt === 0 && '\nDigite seu nome completo: '}</pre></div><div className="im97-loop"><span>nextLine</span><ArrowRight /><span>trim</span><ArrowRight /><span>isEmpty?</span><ArrowRight /><strong>{attempt === 0 ? 'repete' : 'return'}</strong></div><CodePanel name="LeituraTextoObrigatorio.java" code={TEXT_INPUT} /></section>;
}
function IntegerLab() {
  const [attempt, setAttempt] = useState(0);
  const attempts = [['abc', 'NumberFormatException', 'repete a pergunta'], ['25', 'parse concluído', 'retorna 25']];
  const current = attempts[attempt];
  return <section className="im97-stack"><div className="im97-attempts">{attempts.map((item, index) => <button type="button" key={item[0]} className={attempt === index ? 'active' : ''} onClick={() => setAttempt(index)}><span>{index + 1}</span><code>{item[0]}</code><small>{item[1]}</small></button>)}</div><div className="im97-try"><div><small>TRY</small><code>Integer.parseInt("{current[0]}")</code></div><ArrowDown /><strong>{current[1]}</strong><ArrowDown /><span>{current[2]}</span></div><div className="im97-console"><header><Terminal size={15} />sequência guiada: abc → 25</header><pre>{'Digite sua idade: '}<b>abc</b>{'\n'}<span>[ERRO] Valor numérico inválido. Por favor, digite um número inteiro.</span>{'\nDigite sua idade: '}<b>25</b>{'\nIdade registrada: 25 anos.'}</pre></div><CodePanel name="LeituraInteiro.java" code={INTEGER_INPUT} /></section>;
}
function UtilityLab() {
  const [method, setMethod] = useState(0);
  const methods = [
    ['lerTexto', '"  Teclado  "', 'Teclado', 'trim + não vazio'],
    ['lerInteiroPositivo', '"0" → "3"', '3', 'parse + valor > 0'],
    ['lerBigDecimal', '"abc" → "199.90"', '199.90', 'construtor + compareTo ZERO'],
  ];
  const current = methods[method];
  return <section className="im97-stack"><div className="im97-methods">{methods.map((item, index) => <button type="button" key={item[0]} className={method === index ? 'active' : ''} onClick={() => setMethod(index)}><Braces /><strong>{item[0]}</strong><small>{item[3]}</small></button>)}</div><div className="im97-contract"><span>tentativas <code>{current[1]}</code></span><ArrowRight /><strong>{current[0]}</strong><ArrowRight /><span>retorno <code>{current[2]}</code></span></div><CodePanel name="ConsoleInput.java" code={CONSOLE_INPUT} /></section>;
}
function ScannerLifecycleLab() {
  const [selected, setSelected] = useState(1);
  const rules = [
    ['criar', 'main', 'Scanner scanner = new Scanner(System.in);'],
    ['passar', 'parâmetro', 'ConsoleInput.lerTexto(scanner, prompt);'],
    ['reusar', 'fluxo inteiro', 'o mesmo objeto conserva o buffer'],
    ['não fechar', 'durante a aplicação', 'scanner.close() fecharia System.in'],
  ];
  const current = rules[selected];
  return <section className="im97-stack"><div className="im97-lifecycle">{rules.map((rule, index) => <button type="button" key={rule[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{rule[0]}</strong><small>{rule[1]}</small></button>)}</div><div className="im97-scanner"><Keyboard /><div><small>UM ÚNICO SCANNER</small><strong>main → ConsoleInput → retorno ao main</strong><code>{current[2]}</code></div></div><article className="im97-warning"><AlertTriangle /><div><strong>System.in é compartilhado pelo processo</strong><span>Fechar o Scanner fecha o stream padrão; outros métodos não conseguem reabri-lo como se fosse apenas uma variável local.</span></div></article></section>;
}
function ProductLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['nome', '"   " → "Notebook Pro"', 'texto obrigatório validado'],
    ['quantidade', '0 → 3', 'inteiro estritamente positivo'],
    ['preço', 'abc → 199.90', 'BigDecimal positivo com ponto'],
    ['saída', 'Produto cadastrado', 'dados prontos apresentados sem cálculo'],
  ];
  const current = stages[stage];
  return <section className="im97-stack"><div className="im97-debug"><header><span>ConsoleInput.java · simulação didática do IntelliJ</span><span>Breakpoint em lerBigDecimal</span></header><div className="im97-debug-body"><aside>{stages.map((item, index) => <button type="button" key={item[0]} className={stage === index ? 'active' : ''} onClick={() => setStage(index)}>{index + 1}<span>{item[0]}</span></button>)}</aside><main><small>Variables</small><strong>{current[1]}</strong><p>{current[2]}</p><button type="button" onClick={() => setStage(value => Math.min(value + 1, stages.length - 1))} disabled={stage === stages.length - 1}><Bug size={15} />Avançar observação</button></main></div><footer>Acompanhe a String de entrada virar BigDecimal somente depois da tentativa válida.</footer></div><CodePanel name="CadastroProdutoConsole.java" code={PRODUCT} /></section>;
}
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors im97-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}
function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const checks = ['quatro fontes criadas', 'buffer explicado', 'nextLine como padrão', 'texto vazio repetido', 'abc tratado sem crash', 'inteiro positivo validado', 'BigDecimal positivo validado', 'um Scanner reutilizado', 'System.in mantido aberto', 'produto cadastrado', 'três respostas registradas', 'diff e .class revisados'];
  const commands = ['javac *.java', 'java LeituraTextoObrigatorio', 'java LeituraInteiro', 'java CadastroProdutoConsole'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  return <section className="im97-delivery"><div className="im97-console"><header><Terminal size={15} />Compilar e testar com entradas reais<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{'\n\n'}<span>Teste nesta ordem: espaços, texto válido, abc, zero, inteiro positivo e decimal com ponto.</span></pre></div><div className="im97-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: cadastro resiliente na borda</h3></div><p>Cadastre nome, estoque e preço sem permitir que espaços, letras, zero ou decimal inválido derrubem o fluxo.</p><ul><li>Use o mesmo <code>Scanner</code> nas três perguntas.</li><li>Repita somente a pergunta inválida.</li><li>Retorne dados já convertidos e positivos.</li><li>Apresente o produto sem calcular regra de negócio.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'adapter', label: 'Adaptador de Entrada', duration: '9 min', eyebrow: 'TECLADO, TEXTO E DADO VÁLIDO', title: 'Transforme entrada externa antes que ela alcance o domínio', blocks: [{ type: 'lead', text: 'Métodos de leitura isolam captura, higiene, conversão e validação na borda da aplicação.' }, { type: 'adapter' }] },
  { id: 'buffer', label: 'Bug do Buffer', duration: '13 min', eyebrow: 'NEXTINT, ENTER RESIDUAL E NEXTLINE', title: 'Veja exatamente por que a próxima pergunta é pulada', blocks: [{ type: 'lead', text: 'O problema não é aleatório: nextInt consome os dígitos, mas deixa a quebra de linha para a chamada seguinte.' }, { type: 'buffer' }] },
  { id: 'text', label: 'Texto Obrigatório', duration: '13 min', eyebrow: 'TRIM, ISEMPTY E REPETIÇÃO', title: 'Rejeite espaços e devolva somente texto higienizado', blocks: [{ type: 'lead', text: 'A primeira tentativa falha de propósito; a segunda prova que o while termina apenas com uma entrada útil.' }, { type: 'text' }] },
  { id: 'integer', label: 'Inteiro sem Travar', duration: '14 min', eyebrow: 'NEXTLINE, PARSE E TRY-CATCH', title: 'Converta abc em recuperação, não em encerramento', blocks: [{ type: 'lead', text: 'A exceção de formato é interceptada dentro do loop e a mesma pergunta reaparece antes de aceitar 25.' }, { type: 'integer' }] },
  { id: 'utility', label: 'ConsoleInput Coeso', duration: '16 min', eyebrow: 'STRING, INT E BIGDECIMAL', title: 'Centralize três contratos de leitura sem misturar regra de negócio', blocks: [{ type: 'lead', text: 'Cada método repete apenas a infraestrutura necessária e só retorna um valor convertido que respeita seu contrato.' }, { type: 'utility' }] },
  { id: 'lifecycle', label: 'Um Scanner, Um Buffer', duration: '10 min', eyebrow: 'CRIAÇÃO, REUSO E SYSTEM.IN', title: 'Passe o Scanner por parâmetro e preserve o stream compartilhado', blocks: [{ type: 'lead', text: 'Múltiplos Scanners disputam a mesma entrada; fechar qualquer wrapper pode encerrar System.in para todo o processo.' }, { type: 'lifecycle' }] },
  { id: 'product', label: 'Cadastro e Debug', duration: '17 min', eyebrow: 'PRODUTO, BIGDECIMAL E INTELLIJ', title: 'Conduza três entradas inválidas até um cadastro completo', blocks: [{ type: 'lead', text: 'A simulação didática mostra o breakpoint em lerBigDecimal e a passagem de String inválida para objeto monetário válido.' }, { type: 'product' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'BUFFER, STREAM E FRONTEIRA', title: 'Diagnostique oito maneiras de tornar a leitura frágil', blocks: [{ type: 'lead', text: 'Use sintoma, causa e correção para distinguir erro de formato, ciclo de vida e responsabilidade indevida.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '11 min', eyebrow: 'ENTRADAS REAIS, EVIDÊNCIA E GIT', title: 'Prove o fluxo com tentativas inválidas antes do caminho feliz', blocks: [{ type: 'lead', text: 'A oficina só termina quando o console resiste a espaços, letras, zero e formato decimal inválido.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'adapter') return <AdapterLab />;
  if (block.type === 'buffer') return <BufferLab />;
  if (block.type === 'text') return <TextLab />;
  if (block.type === 'integer') return <IntegerLab />;
  if (block.type === 'utility') return <UtilityLab />;
  if (block.type === 'lifecycle') return <ScannerLifecycleLab />;
  if (block.type === 'product') return <ProductLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedInputMethodsLesson097({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-input-methods-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Keyboard size={17} />Laboratório de entrada defensiva</span><p className="guided-sequence">097 · M3.08</p><h1>Faça a pergunta repetir, não o programa quebrar</h1><p>Domine o buffer do Scanner, converta texto com segurança e devolva dados válidos para o restante do backend.</p></div><div className="guided-hero-status"><ScanLine size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 097" items={[{ value: '4 fontes', label: 'Compiladas e alimentadas' }, { value: '5 estágios', label: 'No adaptador de entrada' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 097"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Entradas inválidas contidas na borda</h3><p>{lessonComplete ? 'Aula concluída e pronta para reuso sem duplicação.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 096</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Scanner, buffer, parse e retry</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 098<ArrowRight size={17} /></button></footer></article>;
}
