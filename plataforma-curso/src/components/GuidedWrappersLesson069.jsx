import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Box, Check, CheckCircle2, Clock3,
  Copy, FileCode2, Gauge, Lightbulb, ListChecks, PackageOpen, Play,
  RotateCcw, Sparkles, Terminal, Unplug, Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedWrappersLesson.css';

const STORAGE_KEY = 'guided-wrappers-lesson-069-progress';

const MAIN_PROGRAM = `import java.util.Objects;

public class LaboratorioWrappers {
    public static void main(String[] args) {
        int quantidade = 10;
        Integer boxed = quantidade;
        int unboxed = boxed;
        System.out.println("boxing: " + quantidade + " -> " + boxed + " -> " + unboxed);

        Integer ausente = null;
        System.out.println("ausente: " + valorOuPadrao(ausente, -1));

        int parseado = Integer.parseInt("30");
        Integer objeto = Integer.valueOf("30");
        System.out.println("parseInt: " + parseado);
        System.out.println("valueOf: " + objeto);

        System.out.println("boolean true: " + Boolean.parseBoolean("true"));
        System.out.println("boolean abc: " + Boolean.parseBoolean("abc"));

        Integer idA = 1000;
        Integer idB = 1000;
        System.out.println("ids iguais: " + Objects.equals(idA, idB));
        System.out.println("nulls iguais: " + Objects.equals(null, null));

        Boolean ativo = null;
        System.out.println("ativo: " + Boolean.TRUE.equals(ativo));

        Cliente cliente = new Cliente();
        cliente.idade = null;
        System.out.println("idade: " + (cliente.idade == null ? "NAO_INFORMADA" : cliente.idade));

        Produto produto = new Produto();
        produto.estoque = 0;
        System.out.println("estoque: " + produto.estoque);

        System.out.println("int max: " + Integer.MAX_VALUE);
    }

    static int valorOuPadrao(Integer valor, int padrao) {
        return valor == null ? padrao : valor;
    }
}

class Cliente { Integer idade; }
class Produto { int estoque; }`;

const EXPECTED_OUTPUT = `boxing: 10 -> 10 -> 10
ausente: -1
parseInt: 30
valueOf: 30
boolean true: true
boolean abc: false
ids iguais: true
nulls iguais: true
ativo: false
idade: NAO_INFORMADA
estoque: 0
int max: 2147483647`;

const EVIDENCE = `# Aula 069 — Wrappers e autoboxing

- [ ] Mapeei os oito primitivos para wrappers
- [ ] Expliquei autoboxing e unboxing
- [ ] Provoquei unboxing de null conscientemente
- [ ] Escolhi um fallback por regra, não por medo
- [ ] Diferenciei parseInt de valueOf
- [ ] Tratei NumberFormatException no limite certo
- [ ] Expliquei o comportamento de parseBoolean
- [ ] Comparei wrappers com Objects.equals
- [ ] Usei Boolean.TRUE.equals em estado opcional
- [ ] Escolhi primitivo ou wrapper pelo domínio
- [ ] Executei o programa e conferi doze linhas
- [ ] Revisei .gitignore, diff staged e commit`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="wr69-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java' }) {
  return <section className="guided-file wr69-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

const PAIRS = [
  ['byte', 'Byte'], ['short', 'Short'], ['int', 'Integer'], ['long', 'Long'],
  ['float', 'Float'], ['double', 'Double'], ['boolean', 'Boolean'], ['char', 'Character'],
];

function TypeMapLab() {
  const [selected, setSelected] = useState(2);
  const pair = PAIRS[selected];
  return <section className="wr69-types"><div className="wr69-pairs">{PAIRS.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{item[0]}</code><ArrowRight size={15} /><strong>{item[1]}</strong></button>)}</div><div className="wr69-type-compare"><article><small>PRIMITIVO</small><h3>{pair[0]}</h3><ul><li>valor obrigatório</li><li>não aceita null</li><li>== compara valor</li><li>sem métodos</li><li>mais simples para cálculo</li></ul></article><ArrowRight /><article><small>WRAPPER</small><h3>{pair[1]}</h3><ul><li>objeto e referência</li><li>pode aceitar null</li><li>== pode comparar identidade</li><li>métodos e constantes</li><li>APIs e ausência opcional</li></ul></article></div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Wrapper precisa de motivo</strong><p>Use primitivo quando o valor sempre existe. Use wrapper quando uma API exige objeto ou quando ausência é um estado legítimo e documentado.</p></div></aside></section>;
}

const BOXING_STEPS = [
  ['Primitivo', 'int quantidade = 10;', 'stack: valor 10', 'nenhum objeto wrapper'],
  ['Autoboxing', 'Integer caixa = quantidade;', 'stack: referência → I1', 'heap: Integer I1 contém 10'],
  ['Unboxing', 'int copia = caixa;', 'stack: copia recebe 10', 'conceitualmente caixa.intValue()'],
  ['Cálculo', 'int total = caixa + 5;', 'unbox 10; soma 5', 'resultado primitivo 15'],
];

function BoxingLab() {
  const [index, setIndex] = useState(0);
  const item = BOXING_STEPS[index];
  return <section className="wr69-boxing"><div className="wr69-stepper">{BOXING_STEPS.map((step, stepIndex) => <button type="button" key={step[0]} className={index === stepIndex ? 'active' : stepIndex < index ? 'visited' : ''} onClick={() => setIndex(stepIndex)}><span>{stepIndex + 1}</span><strong>{step[0]}</strong></button>)}</div><CodePanel name="Conversão automática · linha atual" code={item[1]} /><div className="wr69-boxing-map"><section><header>Stack / operação</header><strong>{item[2]}</strong></section><ArrowRight /><section className={index === 0 ? 'empty' : ''}><header>Wrapper / conversão</header><strong>{item[3]}</strong></section></div><p className="wr69-proof"><Box size={18} />Autoboxing esconde <code>valueOf</code>; unboxing esconde um método como <code>intValue</code>. A conveniência não elimina custo nem risco de null.</p></section>;
}

const NULL_SCENARIOS = {
  unsafe: ['Integer quantidade = null;\nint valor = quantidade;', 'NPE durante unboxing', 'Java tenta extrair um int de uma referência sem objeto.'],
  validate: ['if (quantidade != null) {\n    int valor = quantidade;\n}', 'Sem conversão quando ausente', 'O fluxo só faz unboxing depois de provar presença.'],
  fallback: ['int valor = valorOuPadrao(quantidade, 0);', '0 escolhido explicitamente', 'Só é correto se zero representar a ausência naquele domínio.'],
  required: ['if (quantidade == null) {\n    throw new IllegalArgumentException("Quantidade obrigatória");\n}', 'Falha cedo', 'Ausência não é convertida em dado falso quando o valor é obrigatório.'],
};

function NullUnboxingLab() {
  const [mode, setMode] = useState('unsafe');
  const item = NULL_SCENARIOS[mode];
  return <section className="wr69-null"><div className="wr69-tabs">{Object.keys(NULL_SCENARIOS).map(key => <button type="button" key={key} className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>{key === 'unsafe' ? 'Unboxing direto' : key === 'validate' ? 'Validar presença' : key === 'fallback' ? 'Fallback de negócio' : 'Valor obrigatório'}</button>)}</div><CodePanel name={mode === 'unsafe' ? 'ErroUnboxingNull.java · falha proposital' : 'Tratamento consciente · trecho'} code={item[0]} /><div className={mode === 'unsafe' ? 'wr69-null-verdict bad' : 'wr69-null-verdict ok'}><Unplug size={25} /><div><strong>{item[1]}</strong><p>{item[2]}</p></div></div><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Boolean também sofre unboxing</strong><p><code>Boolean ativo = null; if (ativo)</code> tenta converter null para boolean e quebra. Use <code>Boolean.TRUE.equals(ativo)</code> quando o terceiro estado fizer sentido.</p></div></aside></section>;
}

const PARSERS = {
  int: { label: 'Integer.parseInt', input: '30', type: 'int', result: '30', code: 'int idade = Integer.parseInt("30");' },
  integer: { label: 'Integer.valueOf', input: '30', type: 'Integer', result: '30', code: 'Integer idade = Integer.valueOf("30");' },
  long: { label: 'Long.parseLong', input: '1000', type: 'long', result: '1000', code: 'long valor = Long.parseLong("1000");' },
  double: { label: 'Double.parseDouble', input: '9.5', type: 'double', result: '9.5', code: 'double nota = Double.parseDouble("9.5");' },
  invalid: { label: 'Número inválido', input: 'abc', type: 'erro', result: 'NumberFormatException', code: 'int valor = Integer.parseInt("abc");' },
  bool: { label: 'Boolean.parseBoolean', input: 'abc', type: 'boolean', result: 'false', code: 'boolean ativo = Boolean.parseBoolean("abc");' },
};

function ParsingLab() {
  const [mode, setMode] = useState('int');
  const item = PARSERS[mode];
  return <section className="wr69-parsing"><div className="wr69-parser-grid">{Object.entries(PARSERS).map(([key, value]) => <button type="button" key={key} className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>{value.label}</button>)}</div><div className="wr69-parser-flow"><article><small>STRING DE ENTRADA</small><strong>"{item.input}"</strong></article><ArrowRight /><article><small>OPERAÇÃO</small><code>{item.label}</code></article><ArrowRight /><article className={mode === 'invalid' ? 'bad' : ''}><small>{item.type}</small><strong>{item.result}</strong></article></div><CodePanel name="Conversão selecionada" code={item.code} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>parseBoolean não valida vocabulário</strong><p>Qualquer texto diferente de <code>true</code>, ignorando caixa, vira false. Se “abc” deve ser rejeitado, valide as opções aceitas antes de converter.</p></div></aside></section>;
}

const COMPARE_CASES = [
  ['100 e 100', 'Integer pequenoA = 100; Integer pequenoB = 100;', '== pode imprimir true por cache', 'equals → true'],
  ['1000 e 1000', 'Integer grandeA = 1000; Integer grandeB = 1000;', '== tipicamente false; não dependa disso', 'equals → true'],
  ['null e 10', 'Integer a = null; Integer b = 10;', 'a.equals(b) causa NPE', 'Objects.equals → false'],
  ['null e null', 'Integer a = null; Integer b = null;', '== true compara ausência de referência', 'Objects.equals → true'],
];

function ComparisonLab() {
  const [selected, setSelected] = useState(1);
  const item = COMPARE_CASES[selected];
  return <section className="wr69-comparison"><div className="wr69-compare-cases">{COMPARE_CASES.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{entry[0]}</button>)}</div><CodePanel name="Cenário de comparação" code={item[1]} /><div className="wr69-comparison-board"><article className="danger"><small>IDENTIDADE / CHAMADA INSEGURA</small><strong>{item[2]}</strong><code>a == b / a.equals(b)</code></article><article className="safe"><small>VALOR COM NULL-SAFETY</small><strong>{item[3]}</strong><code>Objects.equals(a, b)</code></article></div><p className="wr69-proof"><CheckCircle2 size={18} />Cache explica por que <code>==</code> parece funcionar em alguns valores. A regra profissional continua sendo comparar valor com <code>equals</code> ou <code>Objects.equals</code>.</p></section>;
}

const DOMAIN_FIELDS = [
  ['Cliente.idade', 'Integer', 'opcional', 'null diferencia “não informada” de idade 0'],
  ['Produto.estoque', 'int', 'obrigatório', 'zero é um estoque real e válido'],
  ['Produto.ativo', 'boolean ou Boolean', 'depende', 'use Boolean apenas se “não informado” for terceiro estado'],
  ['Pedido.id', 'Long', 'antes de persistir', 'objeto novo pode ainda não ter identificador'],
  ['Pedido.valorCentavos', 'long', 'obrigatório', 'todo pedido válido precisa de valor'],
  ['Pagamento.parcelas', 'Integer ou int', 'depende', 'opcional exige validação; obrigatório favorece int'],
  ['OS.tentativas', 'Integer', 'integração opcional', 'fallback zero precisa ser decisão explícita'],
  ['Mensagem.enviada', 'Boolean', 'três estados', 'Boolean.TRUE.equals evita unboxing de null'],
  ['Auditoria.id', 'Long', 'identidade persistida', 'Objects.equals compara IDs com segurança'],
];

function DomainChoiceLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_FIELDS[selected];
  return <section className="wr69-domains"><div>{DOMAIN_FIELDS.map((field, index) => <button type="button" key={field[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{field[0]}</strong></button>)}</div><article><small>DECISÃO DE MODELO</small><h3>{item[0]}</h3><code>{item[1]}</code><p><strong>{item[2]}:</strong> {item[3]}.</p><div><strong>Pergunta antes do tipo</strong><span>O valor sempre existe? Zero/false é dado real? Ausência é permitida? Uma API exige objeto? Quem valida antes do unboxing?</span></div></article></section>;
}

function OverheadLab() {
  const [wrapper, setWrapper] = useState(false);
  const [iterations, setIterations] = useState(5);
  return <section className="wr69-overhead"><div className="wr69-overhead-controls"><label htmlFor="wr69-loop">Iterações: <strong>{iterations}</strong></label><input id="wr69-loop" type="range" min="1" max="20" value={iterations} onChange={event => setIterations(Number(event.target.value))} /><button type="button" className={!wrapper ? 'active' : ''} onClick={() => setWrapper(false)}>int total</button><button type="button" className={wrapper ? 'active' : ''} onClick={() => setWrapper(true)}>Integer total</button></div><div className="wr69-overhead-map"><section><small>OPERAÇÕES CONCEITUAIS</small><h3>{wrapper ? `${iterations} unboxings + ${iterations} boxings` : `${iterations} somas primitivas`}</h3><div>{Array.from({ length: Math.min(iterations, 10) }, (_, index) => <i key={index} className={wrapper ? 'wrapped' : ''} />)}</div></section><article><Gauge size={30} /><strong>{wrapper ? 'Wrapper sem necessidade' : 'Primitivo adequado'}</strong><span>{wrapper ? 'Cada total + índice lê o wrapper, soma e volta a empacotar.' : 'Valor obrigatório permanece simples, sem null nem conversão automática.'}</span></article></div><div className="wr69-constants"><code>Integer.MIN_VALUE</code><code>Integer.MAX_VALUE</code><code>Long.MIN_VALUE</code><code>Long.MAX_VALUE</code><code>Boolean.TRUE</code><code>Boolean.FALSE</code></div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Não transforme isso em microbenchmark</strong><p>O objetivo é reconhecer conversões ocultas e evitar wrapper gratuito em cálculo. Medições profissionais e detalhes da JVM virão depois.</p></div></aside></section>;
}

const ERRORS = [
  ['Wrapper sem necessidade', 'Cálculo obrigatório ganha null e boxing gratuitos.', 'Use primitivo quando o valor sempre existe.'],
  ['Unboxing de null', 'Integer null é atribuído a int.', 'Valide, falhe cedo ou aplique fallback de negócio.'],
  ['Boolean direto no if', 'if(ativo) tenta unboxing quando ativo é null.', 'Use Boolean.TRUE.equals ou boolean obrigatório.'],
  ['Wrapper com ==', 'Cache faz alguns testes passarem e outros falharem.', 'Use Objects.equals quando null é possível.'],
  ['parseInt inválido', 'Texto abc lança NumberFormatException.', 'Valide/trate na borda da entrada.'],
  ['parseBoolean como validador', 'Texto abc vira false silenciosamente.', 'Restrinja o vocabulário aceito.'],
  ['Null sem contrato', 'Ausência circula até quebrar em cálculo.', 'Documente significado e ponto de validação.'],
  ['equals sobre null', 'id.equals(outro) lança NPE.', 'Use Objects.equals(id, outro).'],
  ['Boxing invisível no loop', 'Integer total alterna objeto e valor a cada soma.', 'Use int em acumulador obrigatório.'],
  ['Null convertido em zero', 'Dado ausente vira valor real sem decisão.', 'Escolha fallback apenas quando a regra autorizar.'],
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="wr69-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>;
}

const CHECKS = ['int vira Integer por autoboxing','Integer volta a int por unboxing','null recebe fallback -1 por regra explícita','parseInt retorna primitivo','valueOf retorna wrapper','parseBoolean abc retorna false','Objects.equals compara IDs grandes','Objects.equals trata dois null','Boolean.TRUE.equals evita unboxing','Idade opcional difere de estoque obrigatório'];

function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = 'mkdir labs\\m2\\aula-069-wrappers-autoboxing\ncd labs\\m2\\aula-069-wrappers-autoboxing\njavac LaboratorioWrappers.java\njava LaboratorioWrappers';
  return <section className="wr69-delivery"><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Marque toda conversão automática</strong><p>Antes de executar, circule autoboxing, unboxing, parsing e comparação. Em cada null, declare quem decide o que a ausência significa.</p></div></aside><CodePanel name="LaboratorioWrappers.java" code={MAIN_PROGRAM} /><div className="wr69-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="wr69-debug"><header><Play size={18} /><strong>Debug: a linha que parece simples faz unboxing</strong></header><div><article><span>1</span><strong>Breakpoint antes</strong><p><code>Integer quantidade = null</code>.</p></article><article><span>2</span><strong>Evaluate</strong><p>Confirme que a referência não aponta para objeto.</p></article><article><span>3</span><strong>Step Over inseguro</strong><p><code>int valor = quantidade</code> tenta extrair int e causa NPE.</p></article><article><span>4</span><strong>Compare IDs</strong><p>Observe conteúdo igual e use Objects.equals.</p></article></div></section><div className="wr69-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: importação com presença, parsing e domínio</h3></div><p>Receba ID, idade, estoque e ativo como textos. Converta com mensagens claras, preserve idade ausente, mantenha estoque obrigatório e rejeite boolean fora do vocabulário.</p><ul><li>Não compare wrappers com ==.</li><li>Não faça unboxing antes de validar.</li><li>Justifique cada primitivo e wrapper escolhido.</li></ul></section><section className="guided-file wr69-code"><div className="guided-file-title"><PackageOpen size={16} />docs/diario-de-bordo.md<CopyButton value={EVIDENCE} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'types') return <TypeMapLab />;
  if (block.type === 'boxing') return <BoxingLab />;
  if (block.type === 'null') return <NullUnboxingLab />;
  if (block.type === 'parsing') return <ParsingLab />;
  if (block.type === 'comparison') return <ComparisonLab />;
  if (block.type === 'domains') return <DomainChoiceLab />;
  if (block.type === 'overhead') return <OverheadLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'types', label: 'Mapa Primitivo–Wrapper', duration: '11 min', eyebrow: 'VALOR OU OBJETO', title: 'Escolha o tipo pelo contrato, não pela aparência', blocks: [{ type: 'lead', text: 'Wrappers são classes que representam primitivos como objetos. Ganham métodos, integração com APIs e null — junto com overhead e novos riscos.' }, { type: 'types' }] },
  { id: 'boxing', label: 'Boxing por Dentro', duration: '10 min', eyebrow: 'CONVERSÕES AUTOMÁTICAS', title: 'Enxergue valueOf e intValue escondidos pelo compilador', blocks: [{ type: 'lead', text: 'Autoboxing vai de primitivo para wrapper; unboxing volta ao valor. A sintaxe curta continua executando uma conversão real.' }, { type: 'boxing' }] },
  { id: 'null', label: 'Unboxing de Null', duration: '11 min', eyebrow: 'AUSÊNCIA SEM VALOR', title: 'Decida entre validar, usar fallback ou falhar cedo', blocks: [{ type: 'lead', text: 'Wrapper null não contém um primitivo para extrair. Converter automaticamente essa ausência causa NPE; a regra define a resposta correta.' }, { type: 'null' }] },
  { id: 'parsing', label: 'Texto para Número', duration: '11 min', eyebrow: 'PARSE E VALUEOF', title: 'Diferencie valor primitivo, wrapper e entrada inválida', blocks: [{ type: 'lead', text: 'parseInt devolve int; valueOf devolve Integer. Texto numérico inválido lança NumberFormatException, enquanto parseBoolean desconhecido retorna false.' }, { type: 'parsing' }] },
  { id: 'comparison', label: 'Comparação sem Armadilha', duration: '11 min', eyebrow: 'CACHE, IDENTIDADE E VALOR', title: 'Pare de deixar o cache decidir o resultado do negócio', blocks: [{ type: 'lead', text: '== em wrappers pode observar referências reutilizadas. Objects.equals compara valor e permanece seguro quando uma ou ambas as referências são null.' }, { type: 'comparison' }] },
  { id: 'domains', label: 'Tipos no Domínio', duration: '12 min', eyebrow: 'NOVE DECISÕES', title: 'Diferencie ausência legítima de zero ou false reais', blocks: [{ type: 'lead', text: 'Idade, estoque, ativo, ID, valor, parcelas e tentativas não têm o mesmo contrato. O tipo deve tornar essa diferença visível.' }, { type: 'domains' }] },
  { id: 'overhead', label: 'Overhead com Critério', duration: '9 min', eyebrow: 'LOOPS E CONSTANTES', title: 'Remova boxing gratuito sem inventar microbenchmark', blocks: [{ type: 'lead', text: 'Wrappers trazem objeto, null e conversões. Cálculo obrigatório favorece primitivo; constantes dos wrappers ajudam a expressar limites.' }, { type: 'overhead' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Corrija contrato, conversão e comparação pela causa', blocks: [{ type: 'lead', text: 'Unboxing de null, cache de Integer e parseBoolean permissivo produzem falhas diferentes. Um if genérico não resolve todas.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '22 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove boxing, parsing e escolhas de domínio em uma execução', blocks: [{ type: 'lead', text: 'Compile, confira doze linhas, depure o unboxing de null e desenhe uma importação que distingue ausência de valor real.' }, { type: 'delivery' }] },
];

export default function GuidedWrappersLesson069({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-wrappers-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><PackageOpen size={17} />Laboratório de valores empacotados</span><p className="guided-sequence">069 · M2.08</p><h1>Wrappers e autoboxing</h1><p>Veja o compilador empacotar e extrair valores, proteja null, compare objetos pelo conteúdo e escolha primitivo ou wrapper conforme o contrato.</p></div><div className="guided-hero-status"><PackageOpen size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 069" items={[{ value: '8 pares', label: 'Primitivo e wrapper' }, { value: '9 decisões', label: 'Modeladas pelo domínio' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 069"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Tipos escolhidos pelo contrato</h3><p>{lessonComplete ? 'Aula concluída e pronta para casting.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 068</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>boxing, null e comparação</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 070<ArrowRight size={17} /></button></footer></article>;
}
