import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Calculator, Check, CheckCircle2,
  Clock3, Copy, Dice5, FileCode2, Gauge, Lightbulb, ListChecks, LockKeyhole,
  Play, RotateCcw, ShieldCheck, Sparkles, Terminal, Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedMathRandomLesson.css';

const STORAGE_KEY = 'guided-math-random-lesson-071-progress';

const MAIN_PROGRAM = `import java.util.Random;

public class LaboratorioMathRandom {
    public static void main(String[] args) {
        double valor = 10.75;
        System.out.println("round: " + Math.round(valor));
        System.out.println("floor: " + Math.floor(valor));
        System.out.println("ceil: " + Math.ceil(valor));

        System.out.println("paginas ceil: " + paginasComCeil(23, 10));
        System.out.println("paginas inteiras: " + paginasComInteiros(23, 10));
        System.out.println("abs: " + Math.abs(-15));
        System.out.println("limite: " + limitar(120, 0, 100));
        System.out.println("potencia: " + Math.pow(2, 3));
        System.out.println("raiz: " + Math.sqrt(25));

        Random primeiro = new Random(123);
        Random segundo = new Random(123);
        int sorteioA = gerarEntre(primeiro, 1, 10);
        int sorteioB = gerarEntre(segundo, 1, 10);
        System.out.println("sorteio com seed: " + sorteioA);
        System.out.println("sequencias iguais: " + (sorteioA == sorteioB));

        int maximo = Integer.MAX_VALUE;
        System.out.println("overflow silencioso: " + (maximo + 1));
        try {
            Math.addExact(maximo, 1);
        } catch (ArithmeticException erro) {
            System.out.println("addExact: overflow detectado");
        }
        try {
            Math.toIntExact(3_000_000_000L);
        } catch (ArithmeticException erro) {
            System.out.println("toIntExact: fora da faixa de int");
        }
    }

    static int paginasComCeil(int total, int tamanho) {
        validarPagina(tamanho);
        return total <= 0 ? 0 : (int) Math.ceil((double) total / tamanho);
    }

    static int paginasComInteiros(int total, int tamanho) {
        validarPagina(tamanho);
        return total <= 0 ? 0 : (total + tamanho - 1) / tamanho;
    }

    static void validarPagina(int tamanho) {
        if (tamanho <= 0) throw new IllegalArgumentException("Tamanho deve ser positivo");
    }

    static int limitar(int valor, int minimo, int maximo) {
        return Math.min(Math.max(valor, minimo), maximo);
    }

    static int gerarEntre(Random random, int minimo, int maximo) {
        if (random == null) throw new IllegalArgumentException("Random e obrigatorio");
        if (minimo > maximo) throw new IllegalArgumentException("Faixa invalida");
        return random.nextInt(maximo - minimo + 1) + minimo;
    }
}`;

const EXPECTED_OUTPUT = `round: 11
floor: 10.0
ceil: 11.0
paginas ceil: 3
paginas inteiras: 3
abs: 15
limite: 100
potencia: 8.0
raiz: 5.0
sorteio com seed: 3
sequencias iguais: true
overflow silencioso: -2147483648
addExact: overflow detectado
toIntExact: fora da faixa de int`;

const EVIDENCE = `# Aula 071 — Math, Random e números utilitários

- [ ] Diferenciei cast, round, floor e ceil
- [ ] Expliquei os tipos retornados pelos arredondamentos
- [ ] Calculei páginas com ceil e com fórmula inteira
- [ ] Usei abs, min, max, pow e sqrt com regra
- [ ] Limitei um valor dentro de uma faixa
- [ ] Expliquei 0.0 inclusivo e 1.0 exclusivo em Math.random
- [ ] Gerei faixa inclusiva com Random.nextInt
- [ ] Reproduzi uma sequência com seed
- [ ] Separei massa de teste de geração segura
- [ ] Provoquei overflow e usei métodos Exact
- [ ] Modelei sete cenários de backend
- [ ] Compilei, executei, depurei e revisei o diff`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="mr71-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java' }) {
  return <section className="guided-file mr71-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

const ROUND_CASES = ['10.1', '10.4', '10.5', '10.75', '10.9', '-10.75'];
function RoundingLab() {
  const [raw, setRaw] = useState('10.75');
  const value = Number(raw);
  const safeValue = Number.isFinite(value) ? value : 0;
  const javaRound = Math.floor(safeValue + 0.5);
  return <section className="mr71-stack"><div className="mr71-round-controls">{ROUND_CASES.map(item => <button type="button" key={item} className={raw === item ? 'active' : ''} onClick={() => setRaw(item)}>{item}</button>)}</div><div className="mr71-round-board"><article><small>CAST PARA INT</small><strong>{Math.trunc(safeValue)}</strong><span>trunca em direção a zero</span></article><article className="selected"><small>MATH.ROUND</small><strong>{javaRound}</strong><span>mais próximo · retorna long para double</span></article><article><small>MATH.FLOOR</small><strong>{Math.floor(safeValue).toFixed(1)}</strong><span>vai para o inteiro inferior</span></article><article><small>MATH.CEIL</small><strong>{Math.ceil(safeValue).toFixed(1)}</strong><span>vai para o inteiro superior</span></article></div><CodePanel name="Main.java · quatro decisões diferentes" code={`double valor = ${raw};\n\nSystem.out.println((int) valor);       // ${Math.trunc(safeValue)}\nSystem.out.println(Math.round(valor)); // ${javaRound}\nSystem.out.println(Math.floor(valor)); // ${Math.floor(safeValue).toFixed(1)}\nSystem.out.println(Math.ceil(valor));  // ${Math.ceil(safeValue).toFixed(1)}`} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>O método vem depois da regra</strong><p><code>round</code> aproxima, <code>floor</code> desce e <code>ceil</code> sobe. Nenhum deles é “o arredondamento certo” sem conhecer o domínio.</p></div></aside></section>;
}

function PaginationLab() {
  const [total, setTotal] = useState(23);
  const [size, setSize] = useState(10);
  const valid = size > 0;
  const pages = valid && total > 0 ? Math.ceil(total / size) : 0;
  const remainder = valid && total > 0 ? total % size : 0;
  return <section className="mr71-stack"><div className="mr71-page-controls"><label>Total de itens: <strong>{total}</strong><input type="range" min="0" max="50" value={total} onChange={event => setTotal(Number(event.target.value))} /></label><label>Tamanho da página: <strong>{size}</strong><input type="range" min="1" max="15" value={size} onChange={event => setSize(Number(event.target.value))} /></label></div><div className="mr71-pages" aria-label={`${pages} páginas para ${total} itens`}>{Array.from({ length: pages }, (_, page) => { const count = Math.min(size, Math.max(0, total - page * size)); return <article key={page}><header>Página {page + 1}</header><div>{Array.from({ length: count }, (_, item) => <i key={item} />)}</div><small>{count} item(ns)</small></article>; })}</div><div className="mr71-formulas"><article><small>COM CEIL</small><code>(int) Math.ceil((double) {total} / {size})</code><strong>{pages}</strong></article><article><small>SÓ COM INTEIROS</small><code>({total} + {size} - 1) / {size}</code><strong>{pages}</strong></article></div><p className="mr71-proof"><CheckCircle2 size={18} />{total === 0 ? 'Nenhum item exige zero páginas.' : remainder === 0 ? 'A última página ficou completa.' : `O resto ${remainder} ainda exige uma página adicional.`}</p></section>;
}

const MATH_TOOLS = [
  ['abs', 'Math.abs(-15)', '15', 'magnitude da diferença; não conserta entrada inválida'],
  ['max', 'Math.max(10, 20)', '20', 'seleciona o maior valor'],
  ['min', 'Math.min(10, 20)', '10', 'seleciona o menor valor'],
  ['clamp', 'Math.min(Math.max(120, 0), 100)', '100', 'limita um valor entre mínimo e máximo'],
  ['pow', 'Math.pow(2, 3)', '8.0', 'potência; o retorno é double'],
  ['sqrt', 'Math.sqrt(25)', '5.0', 'raiz quadrada e fórmulas específicas'],
];
function MathToolkitLab() {
  const [selected, setSelected] = useState(3);
  const item = MATH_TOOLS[selected];
  return <section className="mr71-stack"><div className="mr71-tool-grid">{MATH_TOOLS.map((tool, index) => <button type="button" key={tool[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{tool[0]}</code><strong>{tool[2]}</strong></button>)}</div><div className="mr71-tool-focus"><Calculator size={32} /><div><small>OPERAÇÃO SELECIONADA</small><h3>{item[1]} → {item[2]}</h3><p>{item[3]}.</p></div></div><CodePanel name="UtilitariosNumericos.java · trecho" code={`int diferenca = Math.abs(-15);\nint maior = Math.max(10, 20);\nint menor = Math.min(10, 20);\nint percentual = Math.min(Math.max(120, 0), 100);\ndouble potencia = Math.pow(2, 3);\ndouble raiz = Math.sqrt(25);`} /><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Math.abs não valida idade</strong><p>Transformar idade −30 em 30 pode esconder um dado inválido. Operação matemática e correção de entrada são responsabilidades diferentes.</p></div></aside></section>;
}

function RandomRangeLab() {
  const [min, setMin] = useState(5);
  const [max, setMax] = useState(15);
  const [seed, setSeed] = useState(123);
  const values = useMemo(() => {
    let state = (seed >>> 0) || 1;
    return Array.from({ length: 8 }, () => {
      state = (1664525 * state + 1013904223) >>> 0;
      return min + (state % (max - min + 1));
    });
  }, [min, max, seed]);
  const count = max - min + 1;
  return <section className="mr71-stack"><div className="mr71-random-controls"><label>Mínimo <input type="number" value={min} onChange={event => setMin(Math.min(Number(event.target.value), max))} /></label><label>Máximo <input type="number" value={max} onChange={event => setMax(Math.max(Number(event.target.value), min))} /></label><label>Seed didática <input type="number" value={seed} onChange={event => setSeed(Number(event.target.value))} /></label></div><div className="mr71-range-line"><span>{min}<small>inclusivo</small></span><div>{Array.from({ length: Math.min(count, 24) }, (_, index) => <i key={index} />)}</div><span>{max}<small>inclusivo</small></span></div><div className="mr71-dice">{values.map((value, index) => <span key={`${seed}-${index}`}>{value}</span>)}</div><CodePanel name="RandomFaixa.java · fórmula inclusiva" code={`static int gerarEntre(Random random, int minimo, int maximo) {\n    if (random == null) throw new IllegalArgumentException("Random é obrigatório.");\n    if (minimo > maximo) throw new IllegalArgumentException("Faixa inválida.");\n\n    int possibilidades = maximo - minimo + 1;\n    return random.nextInt(possibilidades) + minimo;\n}`} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Leia a faixa antes do código</strong><p><code>nextInt(bound)</code> gera de zero até <code>bound - 1</code>. Para 5 a 15 há 11 possibilidades; somar 5 desloca 0…10 para 5…15.</p></div></aside></section>;
}

const RANDOM_USES = [
  ['Math.random', '0.0 inclusivo → 1.0 exclusivo', 'Base didática; retorna double e exige cálculo para inteiros.'],
  ['Random sem seed', 'sequência varia entre execuções', 'Simulação e teste exploratório; registre dados quando precisar investigar.'],
  ['Random com seed', 'mesma seed → mesma sequência', 'Teste reprodutível e massa determinística.'],
  ['SecureRandom', 'segurança e imprevisibilidade', 'Senha, token e criptografia; assunto futuro, nunca substituído por Random.'],
];
function ReproducibilityLab() {
  const [selected, setSelected] = useState(2);
  const item = RANDOM_USES[selected];
  return <section className="mr71-stack"><div className="mr71-use-tabs">{RANDOM_USES.map((use, index) => <button type="button" key={use[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{use[0]}</button>)}</div><div className="mr71-seed-board"><article><Dice5 size={30} /><small>CONTRATO</small><strong>{item[1]}</strong><p>{item[2]}</p></article><div><section><span>seed 123</span><code>82 · 50 · 76</code></section><section><span>seed 123</span><code>82 · 50 · 76</code></section><section className="different"><span>seed 321</span><code>79 · 92 · 57</code></section></div></div><div className="mr71-security"><LockKeyhole size={26} /><div><strong>Random não protege segredo</strong><p>Pseudoaleatório reproduzível é útil em teste, mas inadequado para token, senha ou criptografia. A escolha muda para <code>SecureRandom</code> quando o requisito é segurança.</p></div></div><CodePanel name="RandomComSeed.java" code={`Random primeiro = new Random(123);\nRandom segundo = new Random(123);\n\nfor (int i = 0; i < 3; i++) {\n    System.out.println(primeiro.nextInt(100) + " | " + segundo.nextInt(100));\n}`} /></section>;
}

const EXACT_METHODS = [
  ['addExact', '2_147_483_647 + 1', 'ArithmeticException'],
  ['subtractExact', '-2_147_483_648 - 1', 'ArithmeticException'],
  ['multiplyExact', '1_500_000_000 × 2', 'ArithmeticException'],
  ['incrementExact', '2_147_483_647 + 1', 'ArithmeticException'],
  ['decrementExact', '-2_147_483_648 - 1', 'ArithmeticException'],
  ['toIntExact', '3_000_000_000L → int', 'ArithmeticException'],
];
function LimitsLab() {
  const [selected, setSelected] = useState(0);
  const item = EXACT_METHODS[selected];
  return <section className="mr71-stack"><div className="mr71-limits"><article><small>INTEGER.MIN_VALUE</small><strong>−2.147.483.648</strong></article><div><span>faixa válida de int</span></div><article><small>INTEGER.MAX_VALUE</small><strong>2.147.483.647</strong></article></div><div className="mr71-overflow-flow"><article className="danger"><small>SOMA COMUM</small><strong>MAX_VALUE + 1</strong><code>−2.147.483.648</code><span>overflow silencioso</span></article><ArrowRight /><article className="safe"><small>MATH.ADDEXACT</small><strong>MAX_VALUE + 1</strong><code>ArithmeticException</code><span>falha observável</span></article></div><div className="mr71-exact-grid">{EXACT_METHODS.map((method, index) => <button type="button" key={method[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>Math.{method[0]}</strong><span>{method[1]}</span></button>)}</div><p className="mr71-proof"><ShieldCheck size={18} /><code>Math.{item[0]}</code> transforma <strong>{item[1]}</strong> em <strong>{item[2]}</strong>, evitando que um resultado corrompido continue no fluxo.</p><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Wrappers expõem os limites</strong><p><code>Integer</code>, <code>Long</code> e <code>Double</code> fornecem MIN_VALUE e MAX_VALUE. Em <code>Double</code>, MIN_VALUE é o menor positivo diferente de zero, não o número mais negativo.</p></div></aside></section>;
}

const DOMAINS = [
  ['Cliente', 'Math.abs(-30)', 'Demonstra magnitude, mas idade negativa real deve ser rejeitada.'],
  ['Produto', 'limitarPercentual(150) → 100', 'min e max aplicam uma política explícita de desconto.'],
  ['Pedido', 'PED- + gerarEntre(1000, 9999)', 'Massa de teste simples, nunca identificador de segurança.'],
  ['Pagamento', 'Math.round(1000.0 / 3)', 'Exemplo didático; dinheiro real seguirá com BigDecimal.'],
  ['Ordem de serviço', 'ceil(47 / 10.0) → 5', 'Paginação precisa de teto, não de cast.'],
  ['Mensageria', 'tentativas entre 0 e 3', 'Cenários variáveis com faixa inclusiva validada.'],
  ['Auditoria', 'new Random(123)', 'Código e usuário de teste reproduzíveis pela seed.'],
];
function DomainLab() {
  const [selected, setSelected] = useState(1);
  const item = DOMAINS[selected];
  return <section className="mr71-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>REGRA NUMÉRICA APLICADA</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}</p><div><Gauge size={24} /><span><strong>Pergunte antes de chamar Math ou Random</strong>Qual direção de arredondamento? A faixa inclui os extremos? A falha precisa ser reproduzida? Overflow pode ser aceito? O valor envolve dinheiro ou segurança?</span></div></article></section>;
}

const ERRORS = [
  ['Cast como arredondamento', '10.75 vira 10 sem aplicar regra numérica.', 'Escolha round, floor ou ceil pelo domínio.'],
  ['Floor e ceil trocados', 'Paginação desce e perde a última página parcial.', 'Use ceil quando qualquer resto exige novo grupo.'],
  ['Bound inclusivo imaginário', 'nextInt(10) nunca devolve 10.', 'Leia o limite superior como exclusivo.'],
  ['Faixa deslocada errada', '1 a 10 ganha quantidade ou deslocamento incorretos.', 'Use nextInt(max - min + 1) + min.'],
  ['Random em segurança', 'Token passa a ser previsível por algoritmo/seed.', 'Use SecureRandom quando o requisito for segurança.'],
  ['Teste sem reprodução', 'Uma falha aleatória desaparece na execução seguinte.', 'Use seed ou dados determinísticos e registre a entrada.'],
  ['Overflow ignorado', 'MAX_VALUE + 1 continua como número negativo.', 'Use métodos Exact quando a falha precisa ser detectada.'],
  ['abs escondendo entrada', 'Idade −30 vira 30 e parece válida.', 'Rejeite o dado quando a regra não autoriza correção.'],
  ['double para dinheiro', 'Representação binária e regra de escala ficam implícitas.', 'Use BigDecimal, tema da próxima aula.'],
  ['pow tratado como int', 'A potência retorna double mesmo com entradas inteiras.', 'Valide tipo, faixa e conversão do resultado.'],
];
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="mr71-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>;
}

const CHECKS = ['round, floor e ceil divergem com intenção','paginação preserva a página parcial','fórmula inteira confirma o mesmo total','abs não virou validação de entrada','clamp respeita mínimo e máximo','pow e sqrt retornam double','faixa inclusiva conta max - min + 1','seed reproduz a sequência','Random foi excluído de segurança','métodos Exact tornam overflow visível'];
function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = 'mkdir labs\\m2\\aula-071-math-random-numeros-utilitarios\ncd labs\\m2\\aula-071-math-random-numeros-utilitarios\njavac LaboratorioMathRandom.java\njava LaboratorioMathRandom';
  return <section className="mr71-delivery"><CodePanel name="LaboratorioMathRandom.java" code={MAIN_PROGRAM} /><div className="mr71-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="mr71-debug"><header><Play size={18} /><strong>Debug: siga regra, faixa, seed e overflow</strong></header><div><article><span>1</span><strong>Arredondamentos</strong><p>Observe o mesmo 10.75 produzir três destinos diferentes.</p></article><article><span>2</span><strong>nextInt</strong><p>Separe o resultado base 0…bound−1 do deslocamento mínimo.</p></article><article><span>3</span><strong>Duas seeds</strong><p>Confirme estado inicial igual e sequência reproduzida.</p></article><article><span>4</span><strong>Exact</strong><p>Entre na chamada e capture ArithmeticException no limite.</p></article></div></section><div className="mr71-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: gerador reprodutível de pedidos de teste</h3></div><p>Crie uma massa de pedidos com código, valor em centavos, desconto limitado, quantidade de páginas e status sorteado de um array. Receba um único <code>Random</code> por parâmetro e fixe a seed no teste.</p><ul><li>Gere códigos de 1000 a 9999 com extremos inclusivos.</li><li>Use <code>ceil</code> ou fórmula inteira para lotes parciais.</li><li>Detecte overflow na soma de centavos com <code>addExact</code>.</li><li>Explique no README por que nenhum código gerado serve como token.</li></ul></section><section className="guided-file mr71-evidence"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'rounding') return <RoundingLab />;
  if (block.type === 'pagination') return <PaginationLab />;
  if (block.type === 'toolkit') return <MathToolkitLab />;
  if (block.type === 'range') return <RandomRangeLab />;
  if (block.type === 'seed') return <ReproducibilityLab />;
  if (block.type === 'limits') return <LimitsLab />;
  if (block.type === 'domains') return <DomainLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'rounding', label: 'Mesa de Arredondamento', duration: '12 min', eyebrow: 'ROUND, FLOOR E CEIL', title: 'Faça a direção do arredondamento obedecer à regra', blocks: [{ type: 'lead', text: 'Math é uma classe utilitária de métodos estáticos: não existe new Math. Cast trunca; round aproxima; floor desce; ceil sobe e os tipos de retorno também importam.' }, { type: 'rounding' }] },
  { id: 'pagination', label: 'Paginação sem Perda', duration: '11 min', eyebrow: 'TETO E FÓRMULA INTEIRA', title: 'Transforme qualquer resto em uma página visível', blocks: [{ type: 'lead', text: 'Vinte e três itens em páginas de dez exigem três páginas. Compare ceil com promoção para double e a fórmula inteira usada em paginação.' }, { type: 'pagination' }] },
  { id: 'toolkit', label: 'Caixa de Ferramentas Math', duration: '12 min', eyebrow: 'ABS, MIN, MAX, POW E SQRT', title: 'Use utilitários matemáticos sem esconder a regra do domínio', blocks: [{ type: 'lead', text: 'Valor absoluto, extremos, limitação, potência e raiz resolvem operações específicas. Eles não validam entrada nem transformam automaticamente double em inteiro seguro.' }, { type: 'toolkit' }] },
  { id: 'range', label: 'Faixas com Random', duration: '12 min', eyebrow: 'INCLUSIVO E EXCLUSIVO', title: 'Conte possibilidades antes de deslocar o sorteio', blocks: [{ type: 'lead', text: 'Math.random produz double de 0.0 inclusivo a 1.0 exclusivo. Random torna faixas inteiras mais legíveis, mas nextInt exclui o bound.' }, { type: 'range' }] },
  { id: 'seed', label: 'Seed, Teste e Segurança', duration: '11 min', eyebrow: 'PSEUDOALEATÓRIO COM PROPÓSITO', title: 'Reproduza falhas e mantenha Random longe de segredos', blocks: [{ type: 'lead', text: 'Random usa algoritmo: a mesma seed reproduz a sequência. Isso é ótimo para testes e inadequado para senha, token ou criptografia.' }, { type: 'seed' }] },
  { id: 'limits', label: 'Limites e Métodos Exact', duration: '12 min', eyebrow: 'OVERFLOW OBSERVÁVEL', title: 'Troque resultados corrompidos por falhas controladas', blocks: [{ type: 'lead', text: 'Aritmética inteira comum pode transbordar silenciosamente. Limites dos wrappers e métodos Exact permitem detectar soma, multiplicação e conversão fora da faixa.' }, { type: 'limits' }] },
  { id: 'domains', label: 'Math no Backend', duration: '12 min', eyebrow: 'SETE DOMÍNIOS', title: 'Escolha utilitário, faixa e seed pelo cenário real', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria mostram onde Math e Random ajudam — e onde apenas mascarariam um erro.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Encontre a decisão errada antes de trocar o método', blocks: [{ type: 'lead', text: 'Arredondamento, faixa, aleatoriedade, overflow, dinheiro e segurança têm sintomas diferentes. Cada correção começa pelo requisito violado.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '22 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove cálculos determinísticos e falhas numéricas controladas', blocks: [{ type: 'lead', text: 'Compile, confira catorze linhas, depure arredondamento, seed e overflow, depois construa uma massa de pedidos reprodutível.' }, { type: 'delivery' }] },
];

export default function GuidedMathRandomLesson071({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-math-random-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Calculator size={17} />Oficina de regras numéricas</span><p className="guided-sequence">071 · M2.10</p><h1>Math, Random e números utilitários</h1><p>Escolha arredondamento, paginação e limites pela regra; gere faixas reproduzíveis e detecte overflow antes que o número errado siga no backend.</p></div><div className="guided-hero-status"><Dice5 size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 071" items={[{ value: '6 utilitários', label: 'Explorados com retorno visível' }, { value: '7 domínios', label: 'Guiados pela regra' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 071"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Regras numéricas comprovadas</h3><p>{lessonComplete ? 'Aula concluída e pronta para BigDecimal.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 070</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>Math, faixas, seed e overflow</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 072<ArrowRight size={17} /></button></footer></article>;
}
