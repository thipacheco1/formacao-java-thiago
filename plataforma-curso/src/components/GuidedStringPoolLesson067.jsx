import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Braces, Check, CheckCircle2, Clock3,
  Copy, FileCode2, Layers3, Lightbulb, ListChecks, Play, RotateCcw, Sparkles,
  Terminal, TextCursorInput, Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedStringPoolLesson.css';

const STORAGE_KEY = 'guided-string-pool-lesson-067-progress';

const MAIN_PROGRAM = `public class LaboratorioStringPool {
    public static void main(String[] args) {
        String literalA = "Java";
        String literalB = "Java";
        String novo = new String("Java");
        String runtime = "Ja" + args.length + "va";

        System.out.println("literais ==: " + (literalA == literalB));
        System.out.println("new ==: " + (literalA == novo));
        System.out.println("new equals: " + literalA.equals(novo));
        System.out.println("intern ==: " + (literalA == novo.intern()));

        String original = " aprovado ";
        original.trim().toUpperCase();
        System.out.println("original: [" + original + "]");
        String normalizado = normalizarStatus(original);
        System.out.println("normalizado: [" + normalizado + "]");

        System.out.println("runtime equals: " + "Ja0va".equals(runtime));
        System.out.println("blank: " + "   ".isBlank() + " | empty: " + "   ".isEmpty());

        String[] itens = {"Pedido", "Produto", "OS"};
        System.out.println("relatorio: " + montarRelatorio(itens));
        System.out.println("status seguro: " + "APROVADO".equals(null));
    }

    static String normalizarStatus(String status) {
        if (status == null || status.isBlank()) return "NAO_INFORMADO";
        return status.trim().toUpperCase();
    }

    static String montarRelatorio(String[] itens) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < itens.length; i++) {
            if (i > 0) builder.append(" | ");
            builder.append(itens[i]);
        }
        return builder.toString();
    }
}`;

const EXPECTED_OUTPUT = `literais ==: true
new ==: false
new equals: true
intern ==: true
original: [ aprovado ]
normalizado: [APROVADO]
runtime equals: true
blank: true | empty: false
relatorio: Pedido | Produto | OS
status seguro: false`;

const EVIDENCE = `# Aula 067 — String pool e imutabilidade

- [ ] Diferenciei referência e conteúdo
- [ ] Desenhei literais compartilhando o pool
- [ ] Provei que new String cria outro objeto
- [ ] Usei equals em toda regra textual
- [ ] Expliquei intern sem adotá-lo como regra
- [ ] Capturei retornos de trim e toUpperCase
- [ ] Diferenciei isBlank de isEmpty
- [ ] Fiz método transformador retornar String
- [ ] Usei + em mensagem simples
- [ ] Usei StringBuilder em montagem repetida
- [ ] Executei o programa e conferi dez linhas
- [ ] Revisei .gitignore, diff staged e commit`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="sp67-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java' }) {
  return <section className="guided-file sp67-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

const POOL_CASES = {
  literals: { label: 'Dois literais', refs: [['a', 'P1'], ['b', 'P1']], heap: [], result: 'a == b → true', explanation: 'A JVM reutiliza a representação canônica do literal "Java" no pool.' },
  newString: { label: 'Literal + new', refs: [['a', 'P1'], ['b', 'H1']], heap: [['H1', 'Java']], result: 'a == b → false', explanation: 'new String pede outro objeto, mesmo com conteúdo idêntico.' },
  runtime: { label: 'Criada em runtime', refs: [['a', 'P1'], ['b', 'H2']], heap: [['H2', 'Java']], result: 'a.equals(b) → true', explanation: 'Texto montado em execução pode ter outra identidade; equals continua comparando conteúdo.' },
  intern: { label: 'Depois de intern', refs: [['a', 'P1'], ['b.intern()', 'P1']], heap: [['H1', 'Java']], result: 'a == b.intern() → true', explanation: 'intern devolve a versão canônica do pool, mas não deve substituir equals em regra de negócio.' },
};

function PoolLab() {
  const [mode, setMode] = useState('newString');
  const item = POOL_CASES[mode];
  return <section className="sp67-pool"><div className="sp67-tabs">{Object.entries(POOL_CASES).map(([key, value]) => <button type="button" key={key} className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>{value.label}</button>)}</div><div className="sp67-memory" role="img" aria-label={item.explanation}><section><header>Referências locais</header>{item.refs.map(ref => <article key={ref[0]}><strong>{ref[0]}</strong><ArrowRight size={15} /><code>{ref[1]}</code></article>)}</section><section className="pool"><header>String pool</header><article><span>P1</span><strong>"Java"</strong></article></section><section><header>Outros objetos</header>{item.heap.length ? item.heap.map(object => <article key={object[0]}><span>{object[0]}</span><strong>"{object[1]}"</strong></article>) : <p>nenhum objeto extra</p>}</section></div><div className="sp67-result"><code>{item.result}</code><p>{item.explanation}</p></div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Pool explica um resultado; não define a regra</strong><p>Mesmo quando <code>==</code> imprime true, comparar conteúdo textual continua sendo responsabilidade de <code>equals</code>.</p></div></aside></section>;
}

const COMPARE_CASES = [
  ['literal', '"APROVADO"', 'mesma referência possível'],
  ['new', 'new String("APROVADO")', 'outra referência'],
  ['runtime', 'entrada.trim().toUpperCase()', 'conteúdo produzido em execução'],
  ['null', 'null', 'referência ausente'],
];

function ComparisonLab() {
  const [selected, setSelected] = useState(1);
  const [operator, setOperator] = useState('equals');
  const item = COMPARE_CASES[selected];
  const outcomes = { literal: { identity: true, equals: true, ignore: true }, new: { identity: false, equals: true, ignore: true }, runtime: { identity: false, equals: true, ignore: true }, null: { identity: false, equals: false, ignore: false } };
  const outcome = outcomes[item[0]][operator];
  return <section className="sp67-comparison"><div className="sp67-choices">{COMPARE_CASES.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{entry[1]}</strong><small>{entry[2]}</small></button>)}</div><div className="sp67-operator"><button type="button" className={operator === 'identity' ? 'active danger' : ''} onClick={() => setOperator('identity')}>status == "APROVADO"</button><button type="button" className={operator === 'equals' ? 'active' : ''} onClick={() => setOperator('equals')}>"APROVADO".equals(status)</button><button type="button" className={operator === 'ignore' ? 'active' : ''} onClick={() => setOperator('ignore')}>equalsIgnoreCase</button></div><div className={outcome ? 'sp67-verdict ok' : 'sp67-verdict bad'}><strong>{String(outcome)}</strong><span>{operator === 'identity' ? 'Comparou identidade — inadequado para conteúdo.' : operator === 'ignore' ? 'Comparou conteúdo ignorando caixa.' : 'Comparou conteúdo e permaneceu seguro com null.'}</span></div></section>;
}

const IMMUTABLE_STEPS = [
  { line: 'String status = " aprovado ";', original: ' aprovado ', result: '—', binding: 'status → S1' },
  { line: 'status.trim();', original: ' aprovado ', result: 'aprovado', binding: 'status ainda → S1; retorno ignorado' },
  { line: 'status.toUpperCase();', original: ' aprovado ', result: ' APROVADO ', binding: 'status ainda → S1; retorno ignorado' },
  { line: 'status = status.trim().toUpperCase();', original: ' aprovado ', result: 'APROVADO', binding: 'status → S4; S1 nunca foi alterada' },
];

function ImmutabilityLab() {
  const [index, setIndex] = useState(0);
  const item = IMMUTABLE_STEPS[index];
  return <section className="sp67-immutability"><div className="sp67-stepper">{IMMUTABLE_STEPS.map((step, stepIndex) => <button type="button" key={step.line} className={index === stepIndex ? 'active' : stepIndex < index ? 'visited' : ''} onClick={() => setIndex(stepIndex)}><span>{stepIndex + 1}</span><strong>{stepIndex === 0 ? 'Criar' : stepIndex === 1 ? 'trim' : stepIndex === 2 ? 'upper' : 'capturar retorno'}</strong></button>)}</div><CodePanel name="StringImutavel.java · linha atual" code={item.line} /><div className="sp67-objects"><article><small>OBJETO ORIGINAL S1</small><strong>[{item.original}]</strong><span>conteúdo nunca muda</span></article><ArrowRight /><article className={item.result === '—' ? 'empty' : 'new'}><small>NOVO RESULTADO</small><strong>[{item.result}]</strong><span>{item.binding}</span></article></div><p className="sp67-proof"><Braces size={18} />Métodos de transformação retornam outra String. A variável só passa a apontar para ela quando você captura ou retorna o resultado.</p></section>;
}

const METHODS = [
  ['trim()', ' Pedido aprovado ', 'Pedido aprovado'], ['toUpperCase()', ' Pedido aprovado ', ' PEDIDO APROVADO '],
  ['toLowerCase()', ' Pedido APROVADO ', ' pedido aprovado '], ['contains("aprovado")', ' Pedido aprovado ', 'true'],
  ['startsWith("Pedido")', 'Pedido aprovado', 'true'], ['endsWith("aprovado")', 'Pedido aprovado', 'true'],
  ['replace("aprovado", "pendente")', 'Pedido aprovado', 'Pedido pendente'], ['substring(0, 6)', 'Pedido aprovado', 'Pedido'],
];

function MethodsLab() {
  const [selected, setSelected] = useState(0);
  const [text, setText] = useState('  aprovado  ');
  const item = METHODS[selected];
  return <section className="sp67-methods"><label htmlFor="sp67-input">Entrada para normalização</label><input id="sp67-input" value={text} onChange={event => setText(event.target.value)} /><div className="sp67-normalize"><article><small>ORIGINAL</small><strong>[{text}]</strong></article><ArrowRight /><article><small>NORMALIZADA</small><strong>[{text.trim() ? text.trim().toUpperCase() : 'NAO_INFORMADO'}]</strong></article></div><div className="sp67-method-grid">{METHODS.map((method, index) => <button type="button" key={method[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{method[0]}</button>)}</div><div className="sp67-method-result"><code>{item[0]}</code><span>[{item[1]}]</span><ArrowRight size={16} /><strong>[{item[2]}]</strong></div><div className="sp67-blank"><article><code>"   ".isEmpty()</code><strong>false</strong><span>tamanho é 3</span></article><article><code>"   ".isBlank()</code><strong>true</strong><span>só há espaços</span></article></div></section>;
}

function MethodFramesLab() {
  const [returns, setReturns] = useState(false);
  return <section className="sp67-frames"><div className="sp67-tabs"><button type="button" className={!returns ? 'active danger' : ''} onClick={() => setReturns(false)}>void e retorno ignorado</button><button type="button" className={returns ? 'active' : ''} onClick={() => setReturns(true)}>retorna e reatribui</button></div><div className="sp67-frame-map"><section><header>frame main</header><code>status → S1 " aprovado "</code>{returns && <code className="changed">status → S2 "APROVADO"</code>}</section><ArrowRight /><section><header>frame normalizar</header><code>parâmetro status → S1</code><code>local status → S2 "APROVADO"</code><strong>{returns ? 'return S2' : 'frame termina; S2 é perdido'}</strong></section></div><CodePanel name={returns ? 'Método transformador correto' : 'Método sem efeito no chamador'} code={returns ? `status = normalizar(status);\n\nstatic String normalizar(String status) {\n    return status.trim().toUpperCase();\n}` : `normalizar(status);\n\nstatic void normalizar(String status) {\n    status = status.trim().toUpperCase();\n}`} /><p className="sp67-proof"><Braces size={18} />O parâmetro recebe uma cópia da referência. Reatribuir o parâmetro não reatribui a variável do main.</p></section>;
}

function ConcatenationLab() {
  const [count, setCount] = useState(5);
  const [builder, setBuilder] = useState(true);
  const intermediates = builder ? 1 : Math.max(1, count);
  return <section className="sp67-concat"><div className="sp67-concat-controls"><label htmlFor="sp67-count">Itens: <strong>{count}</strong></label><input id="sp67-count" type="range" min="1" max="20" value={count} onChange={event => setCount(Number(event.target.value))} /><button type="button" className={!builder ? 'active' : ''} onClick={() => setBuilder(false)}>String + em loop</button><button type="button" className={builder ? 'active' : ''} onClick={() => setBuilder(true)}>StringBuilder</button></div><div className="sp67-concat-stage"><section><small>ESTRUTURA DE MONTAGEM</small><h3>{builder ? 'um builder mutável' : `${intermediates} resultados sucessivos`}</h3><div>{Array.from({ length: Math.min(intermediates, 10) }, (_, index) => <i key={index} />)}</div></section><article><strong>{count <= 5 ? 'Ambas são aceitáveis nesta escala' : builder ? 'Escolha adequada para repetição' : 'Funciona, mas cria resultados intermediários'}</strong><span>Concatenação simples com <code>+</code> permanece legível. Em loop grande, StringBuilder expressa melhor a montagem mutável.</span></article></div><CodePanel name={builder ? 'Montagem repetida · visão inicial' : 'Concatenação repetida · funciona'} code={builder ? `StringBuilder builder = new StringBuilder();\nfor (String item : itens) {\n    builder.append(item).append("\\n");\n}\nString resultado = builder.toString();` : `String resultado = "";\nfor (String item : itens) {\n    resultado = resultado + item + "\\n";\n}`} /></section>;
}

const DOMAINS = [
  ['Pedido', 'cliente.trim(); status.trim().toUpperCase()', 'Compare o status persistido com "APROVADO".equals(status).'],
  ['Produto', 'nome.trim(); status → ATIVO/INATIVO', 'Texto cru de entrada não deve definir disponibilidade.'],
  ['Ordem de serviço', 'certificado → OS-001; status → ABERTA', 'Identificadores textuais recebem caixa e espaços padronizados.'],
  ['Mensageria', 'cliente + tipo em mensagem curta', 'Concatenação simples com + é clara e apropriada.'],
  ['Auditoria', 'usuário minúsculo; códigos maiúsculos', 'Normalizações diferentes precisam de regra documentada.'],
  ['Relatório', 'muitos itens em StringBuilder', 'Montagem repetida pede estrutura mutável e toString ao final.'],
];

function DomainsLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return <section className="sp67-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>POLÍTICA TEXTUAL</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}</p><div><strong>Contrato profissional</strong><span>Valide null, normalize uma vez na borda, persista o formato acordado e compare conteúdo — nunca a coincidência de referências.</span></div></article></section>;
}

const ERRORS = [
  ['String com ==', 'O resultado muda conforme identidade e origem do texto.', 'Use equals; literal à esquerda também protege null.'],
  ['Achar que String muda', 'trim é chamado, mas a variável preserva espaços.', 'Capture ou retorne a nova String.'],
  ['Ignorar toUpperCase', 'O status continua minúsculo.', 'Reatribua o retorno da transformação.'],
  ['new String desnecessário', 'Outro objeto é criado sem benefício.', 'Use o literal na maioria dos casos.'],
  ['Pool como regra', 'Teste passa com literais e falha com entrada real.', 'Pool é detalhe de identidade; negócio usa equals.'],
  ['Concatenação grande', 'Cada iteração produz novo resultado imutável.', 'Use StringBuilder para montagem repetida.'],
  ['Método sobre null', 'status.trim lança NPE.', 'Valide null antes de transformar.'],
  ['isEmpty para espaços', '"   " passa como não vazio.', 'Use isBlank para entrada textual.'],
  ['Normalização sem regra', 'Caixa e espaços mudam sem contrato.', 'Documente o formato canônico por campo.'],
  ['equalsIgnoreCase em persistência', 'Cada comparação compensa dado inconsistente.', 'Normalize na borda quando o domínio exigir padrão.'],
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="sp67-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>;
}

const CHECKS = ['Literais iguais compartilham referência nesta prova','new String preserva conteúdo e muda identidade','equals decide toda regra textual','intern é demonstração, não solução de negócio','String original não muda após trim','Retorno normalizado é capturado','Parâmetro local não reatribui variável do main','isBlank detecta somente espaços','+ permanece em mensagem simples','StringBuilder monta o relatório repetido'];

function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = 'mkdir labs\\m2\\aula-067-string-pool-imutabilidade\ncd labs\\m2\\aula-067-string-pool-imutabilidade\njavac LaboratorioStringPool.java\njava LaboratorioStringPool';
  return <section className="sp67-delivery"><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Preveja identidade e conteúdo separadamente</strong><p>Antes de executar, desenhe para onde cada referência aponta e escreva o resultado esperado de <code>==</code> e <code>equals</code>.</p></div></aside><CodePanel name="LaboratorioStringPool.java" code={MAIN_PROGRAM} /><div className="sp67-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="sp67-debug"><header><Play size={18} /><strong>Debug: conteúdo igual não garante identidade</strong></header><div><article><span>1</span><strong>Breakpoint após new</strong><p>Veja literalA e novo exibindo Java.</p></article><article><span>2</span><strong>Evaluate ==</strong><p>As referências diferentes produzem false.</p></article><article><span>3</span><strong>Evaluate equals</strong><p>O mesmo conteúdo produz true.</p></article><article><span>4</span><strong>Observe trim</strong><p>O original mantém espaços até capturar o retorno.</p></article></div></section><div className="sp67-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: importação textual com contrato único</h3></div><p>Receba cliente, certificado e status com espaços e caixas inconsistentes. Normalize cada campo por uma regra nomeada, compare status com equals e monte um resumo.</p><ul><li>Inclua null, blank e entrada válida.</li><li>Não use new String nem intern.</li><li>Use StringBuilder apenas se montar várias linhas em loop.</li></ul></section><section className="guided-file sp67-code"><div className="guided-file-title"><TextCursorInput size={16} />docs/diario-de-bordo.md<CopyButton value={EVIDENCE} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'pool') return <PoolLab />;
  if (block.type === 'comparison') return <ComparisonLab />;
  if (block.type === 'immutability') return <ImmutabilityLab />;
  if (block.type === 'methods') return <MethodsLab />;
  if (block.type === 'frames') return <MethodFramesLab />;
  if (block.type === 'concat') return <ConcatenationLab />;
  if (block.type === 'domains') return <DomainsLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'pool', label: 'Mapa do String Pool', duration: '12 min', eyebrow: 'IDENTIDADE DE OBJETOS', title: 'Veja literais compartilhados e objetos criados fora do pool', blocks: [{ type: 'lead', text: 'String é objeto. Literais iguais podem reutilizar a representação canônica do pool; new String e textos produzidos em execução podem ter outra identidade.' }, { type: 'pool' }] },
  { id: 'comparison', label: 'Referência ou Conteúdo', duration: '10 min', eyebrow: '==, EQUALS E CAIXA', title: 'Escolha a comparação pela pergunta que realmente importa', blocks: [{ type: 'lead', text: '== pergunta se as referências são a mesma. equals pergunta se o conteúdo é igual. Regra de negócio textual quase sempre quer a segunda pergunta.' }, { type: 'comparison' }] },
  { id: 'immutability', label: 'Imutabilidade em Cena', duration: '12 min', eyebrow: 'NOVO RESULTADO', title: 'Acompanhe trim e toUpperCase sem alterar a String original', blocks: [{ type: 'lead', text: 'Cada transformação produz um valor novo. Ignorar o retorno não muda a variável; capturá-lo apenas faz a referência apontar para outro objeto.' }, { type: 'immutability' }] },
  { id: 'methods', label: 'Normalização e Métodos', duration: '11 min', eyebrow: 'FORMATO CANÔNICO', title: 'Transforme entrada crua uma vez e preserve a intenção', blocks: [{ type: 'lead', text: 'trim, caixa, buscas e recortes retornam valores. isBlank e isEmpty respondem perguntas diferentes; normalização precisa de regra documentada.' }, { type: 'methods' }] },
  { id: 'frames', label: 'String em Métodos', duration: '10 min', eyebrow: 'CÓPIA DA REFERÊNCIA', title: 'Retorne a transformação para que o chamador consiga usá-la', blocks: [{ type: 'lead', text: 'O parâmetro local pode ser reatribuído sem tocar na variável do main. Método que transforma String deve devolver o novo valor.' }, { type: 'frames' }] },
  { id: 'concat', label: 'Concatenação com Critério', duration: '10 min', eyebrow: 'SIMPLES OU REPETIDA', title: 'Mantenha + no texto curto e use builder na montagem em loop', blocks: [{ type: 'lead', text: 'Concatenação simples é normal. O custo conceitual aparece quando cada iteração precisa criar outro resultado imutável; StringBuilder será aprofundado na próxima aula.' }, { type: 'concat' }] },
  { id: 'domains', label: 'Strings no Backend', duration: '11 min', eyebrow: 'SEIS APLICAÇÕES', title: 'Defina formato, comparação e montagem por domínio', blocks: [{ type: 'lead', text: 'Pedido, produto, OS, mensageria, auditoria e relatório pedem normalizações e estratégias de montagem diferentes.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Corrija identidade acidental, retornos perdidos e formatos inconsistentes', blocks: [{ type: 'lead', text: 'O código pode parecer correto quando o pool mascara == ou quando o console esconde espaços. Diagnostique referência, conteúdo e contrato separadamente.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '22 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove pool, imutabilidade e normalização em uma execução', blocks: [{ type: 'lead', text: 'Compile, confira dez linhas, depure identidade e transforme entradas textuais por regras que você consegue defender.' }, { type: 'delivery' }] },
];

export default function GuidedStringPoolLesson067({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-string-pool-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Layers3 size={17} />Laboratório de identidade textual</span><p className="guided-sequence">067 · M2.06</p><h1>String pool e imutabilidade</h1><p>Separe referência de conteúdo, acompanhe os novos objetos produzidos por transformações e normalize texto sem depender de coincidências do pool.</p></div><div className="guided-hero-status"><Layers3 size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 067" items={[{ value: '4 cenários', label: 'Identidade desenhada' }, { value: '8 métodos', label: 'Resultados observáveis' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 067"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Texto comparado com intenção</h3><p>{lessonComplete ? 'Aula concluída e pronta para StringBuilder.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 066</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>pool, conteúdo e imutabilidade</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 068<ArrowRight size={17} /></button></footer></article>;
}
