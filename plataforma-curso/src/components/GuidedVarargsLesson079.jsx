import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Braces, Check, CheckCircle2, Clock3, Copy, FileCode2, Lightbulb, ListChecks, Play, RotateCcw, Sparkles, Terminal, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedVarargsLesson.css';

const STORAGE_KEY = 'guided-varargs-lesson-079-progress';
const MAIN_PROGRAM = [
  'import java.math.BigDecimal;',
  'import java.math.RoundingMode;',
  'import java.util.List;',
  '',
  'public class LaboratorioVarargs {',
  '    public static void main(String[] args) {',
  '        System.out.println("zero: " + quantidade());',
  '        System.out.println("tres: " + quantidade("Ana", "Bruno", "Carla"));',
  '        String[] array = {"Davi", "Eva"};',
  '        System.out.println("array: " + quantidade(array));',
  '        System.out.println("soma: " + somar(1, 2, 3, 4));',
  '        System.out.println("media: " + media(10, 8, 9));',
  '        System.out.println("juntar: " + juntar(", ", "Ana", "Bruno", "Carla"));',
  '        System.out.println("dinheiro: " + somarValores(',
  '                new BigDecimal("10.00"),',
  '                new BigDecimal("5.50"),',
  '                new BigDecimal("2.25")));',
  '        System.out.println("fixo+varargs: "',
  '                + registrar("Pedido criado", "cliente=Ana", "valor=100.00"));',
  '        imprimir((String[]) null);',
  '        testarElementoNull();',
  '        System.out.println("api format: "',
  '                + String.format("%s:%d", "itens", 3));',
  '        System.out.println("api list: " + List.of("A", "B", "C").size());',
  '    }',
  '',
  '    static int quantidade(String... nomes) {',
  '        return nomes.length;',
  '    }',
  '',
  '    static int somar(int... numeros) {',
  '        int total = 0;',
  '        for (int numero : numeros) total += numero;',
  '        return total;',
  '    }',
  '',
  '    static double media(int... numeros) {',
  '        if (numeros == null || numeros.length == 0)',
  '            throw new IllegalArgumentException("Informe numeros.");',
  '        return (double) somar(numeros) / numeros.length;',
  '    }',
  '',
  '    static String juntar(String separador, String... textos) {',
  '        return String.join(separador, textos);',
  '    }',
  '',
  '    static BigDecimal somarValores(BigDecimal... valores) {',
  '        if (valores == null) throw new IllegalArgumentException("Array null.");',
  '        BigDecimal total = BigDecimal.ZERO;',
  '        for (BigDecimal valor : valores) {',
  '            if (valor == null) throw new IllegalArgumentException("Elemento null.");',
  '            total = total.add(valor);',
  '        }',
  '        return total.setScale(2, RoundingMode.HALF_UP);',
  '    }',
  '',
  '    static String registrar(String titulo, String... detalhes) {',
  '        return titulo + " | " + String.join(" | ", detalhes);',
  '    }',
  '',
  '    static void imprimir(String... nomes) {',
  '        System.out.println(nomes == null ? "array null" : "length " + nomes.length);',
  '    }',
  '',
  '    static void testarElementoNull() {',
  '        try { somarValores(BigDecimal.ONE, null); }',
  '        catch (IllegalArgumentException erro) {',
  '            System.out.println("elemento: " + erro.getMessage());',
  '        }',
  '    }',
  '}',
].join('\n');
const EXPECTED_OUTPUT = [
  'zero: 0',
  'tres: 3',
  'array: 2',
  'soma: 10',
  'media: 9.0',
  'juntar: Ana, Bruno, Carla',
  'dinheiro: 17.75',
  'fixo+varargs: Pedido criado | cliente=Ana | valor=100.00',
  'array null',
  'elemento: Elemento null.',
  'api format: itens:3',
  'api list: 3',
].join('\n');
const EVIDENCE = [
  '# Aula 079 — Varargs', '',
  '- [ ] Expliquei que varargs vira array',
  '- [ ] Chamei com zero, um, muitos e array explícito',
  '- [ ] Validei tamanho mínimo quando necessário',
  '- [ ] Mantive o varargs como último parâmetro',
  '- [ ] Usei apenas um varargs por método',
  '- [ ] Pratiquei int, String e BigDecimal',
  '- [ ] Diferenciei array vazio, elemento null e array null',
  '- [ ] Evitei sobrecargas ambíguas',
  '- [ ] Rejeitei Object... como atalho de modelagem',
  '- [ ] Escolhi request para argumentos de naturezas diferentes',
  '- [ ] Apliquei varargs em sete domínios',
  '- [ ] Compilei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

const CALLS = [[], ['Ana'], ['Ana', 'Bruno'], ['Ana', 'Bruno', 'Carla']];
function ArrayLab() {
  const [selected, setSelected] = useState(3); const args = CALLS[selected];
  const call = 'imprimir(' + args.map(item => '"' + item + '"').join(', ') + ');';
  return <section className="va79-stack"><div className="va79-call-tabs">{CALLS.map((items, index) => <button type="button" key={index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{items.length} argumento{items.length === 1 ? '' : 's'}</button>)}</div><div className="va79-transform"><article><small>CHAMADA CONVENIENTE</small><code>{call}</code></article><ArrowRight /><article className="compiler"><small>COMPILADOR EMPACOTA</small><strong>new String[{args.length}]</strong></article><ArrowRight /><article className="array"><small>DENTRO DO MÉTODO</small><div>{args.length ? args.map((item,index) => <span key={item}><b>{index}</b>{item}</span>) : <em>array existente · length 0</em>}</div></article></div><CodePanel name="Varargs é açúcar sintático para array" code={'static void imprimir(String... nomes) {\n    System.out.println(nomes.length);\n    for (String nome : nomes) System.out.println(nome);\n}\n\nString[] array = {"Davi", "Eva"};\nimprimir(array);'} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>A diferença está principalmente na chamada</strong><p>Dentro do método você percorre, mede e acessa índices como em qualquer array.</p></div></aside></section>;
}

function ArityLab() {
  const [count, setCount] = useState(0); const needsOne = true; const valid = !needsOne || count > 0;
  return <section className="va79-stack"><div className="va79-arity"><button type="button" disabled={count === 0} onClick={() => setCount(value => value - 1)}>−</button><strong>{count}</strong><button type="button" disabled={count === 6} onClick={() => setCount(value => value + 1)}>+</button><span>números na chamada</span></div><div className={'va79-validation '+(valid ? 'safe' : 'danger')}><small>{valid ? 'CONTRATO ATENDIDO' : 'VALIDAÇÃO NECESSÁRIA'}</small><strong>{valid ? 'media(' + Array.from({length:count},(_,i)=>i+1).join(', ') + ')' : 'media() é sintaticamente válida, mas não tem média'}</strong><span>{valid ? 'array length = ' + count : 'lance IllegalArgumentException com mensagem clara'}</span></div><CodePanel name="Zero argumentos versus requisito do domínio" code={'static double media(int... numeros) {\n    if (numeros == null || numeros.length == 0) {\n        throw new IllegalArgumentException("Informe pelo menos um número.");\n    }\n    return (double) somar(numeros) / numeros.length;\n}'} /></section>;
}

const SIGNATURES = [
  ['registrar(String titulo, String... detalhes)', true, 'fixos primeiro; varargs no final'],
  ['registrar(String... detalhes, String titulo)', false, 'o compilador não sabe onde termina o grupo'],
  ['metodo(String... nomes, int... numeros)', false, 'só pode existir um varargs'],
  ['juntar(String separador, String... textos)', true, 'assinatura clara e mesma natureza variável'],
];
function SignatureLab() { const [selected, setSelected] = useState(0); const item = SIGNATURES[selected]; return <section className="va79-stack"><div className="va79-signatures">{SIGNATURES.map((signature,index) => <button type="button" key={signature[0]} className={(selected === index ? 'active ' : '')+(signature[1] ? 'safe' : 'danger')} onClick={() => setSelected(index)}><span>{signature[1] ? <Check size={14} /> : '×'}</span><code>{signature[0]}</code></button>)}</div><div className={'va79-rule '+(item[1] ? 'safe' : 'danger')}><strong>{item[1] ? 'COMPILA' : 'NÃO COMPILA'}</strong><span>{item[2]}</span></div><p className="ln73-format-proof">Reticências pertencem ao tipo do último e único parâmetro variável. Parâmetros fixos continuam explícitos antes dele.</p></section>; }

const UTILITIES = [
  ['int...', 'somar(1, 2, 3, 4)', '10'],
  ['String...', 'juntar(" ", "Java", "Backend")', 'Java Backend'],
  ['separador + String...', 'juntar(", ", "A", "B", "C")', 'A, B, C'],
  ['BigDecimal...', 'somarValores(10.00, 5.50, 2.25)', '17.75'],
];
function UtilityLab() {
  const [selected, setSelected] = useState(0); const item = UTILITIES[selected];
  const code = selected === 3 ? ['static BigDecimal somar(BigDecimal... valores) {', '    if (valores == null) throw new IllegalArgumentException();', '    var total = BigDecimal.ZERO;', '    for (var valor : valores) {', '        if (valor == null) throw new IllegalArgumentException();', '        total = total.add(valor);', '    }', '    return total.setScale(2, RoundingMode.HALF_UP);', '}'].join('\n') : ['static String juntar(String separador, String... textos) {', '    return String.join(separador, textos);', '}', '', 'static int somar(int... numeros) {', '    int total = 0;', '    for (int numero : numeros) total += numero;', '    return total;', '}'].join('\n');
  return <section className="va79-stack"><div className="va79-utilities">{UTILITIES.map((utility,index) => <button type="button" key={utility[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{utility[0]}</strong><small>{utility[1]}</small></button>)}</div><div className="va79-output"><small>RESULTADO</small><strong>{item[2]}</strong><span>argumentos possuem o mesmo tipo e a mesma natureza</span></div><CodePanel name="Utilitários tipados" code={code} /></section>;
}

const NULL_CASES = [
  ['sem argumentos', 'somar()', 'array não null · length 0', 'valide quantidade se zero não fizer sentido'],
  ['elemento null', 'somar(BigDecimal.TEN, null)', 'array length 2 · índice 1 null', 'valide cada elemento'],
  ['array null', 'BigDecimal[] valores = null; somar(valores)', 'referência do array é null', 'valide o próprio parâmetro'],
];
function NullLab() { const [selected, setSelected] = useState(0); const item = NULL_CASES[selected]; return <section className="va79-stack"><div className="va79-null-cases">{NULL_CASES.map((entry,index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{entry[0]}</strong><code>{entry[1]}</code></button>)}</div><div className="va79-null-flow"><article><small>MEMÓRIA RECEBIDA</small><strong>{item[2]}</strong></article><ArrowRight /><article><small>DEFESA</small><strong>{item[3]}</strong></article></div><CodePanel name="Duas camadas de validação" code={'if (valores == null) {\n    throw new IllegalArgumentException("Array obrigatório.");\n}\nfor (BigDecimal valor : valores) {\n    if (valor == null) {\n        throw new IllegalArgumentException("Elemento não pode ser null.");\n    }\n}'} /></section>; }

const DESIGN_CASES = [
  ['somar(1, 2, 3)', 'varargs', 'mesma natureza, quantidade variável'],
  ['String.format("%s:%d", "itens", 3)', 'varargs especial', 'API de formatação justifica Object...'],
  ['processar(String...) + processar(String,String...)', 'evitar', 'sobrecargas confundem leitor'],
  ['registrar(Object... valores)', 'evitar', 'tipagem fraca esconde modelo'],
  ['criarCliente(nome,email,telefone,status)', 'request', 'cada campo tem significado próprio'],
  ['caminho crítico chamado milhões de vezes', 'medir', 'varargs cria array por chamada'],
];
function DesignLab() { const [selected, setSelected] = useState(0); const item = DESIGN_CASES[selected]; return <section className="va79-stack"><div className="va79-design">{DESIGN_CASES.map((entry,index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{entry[0]}</code></button>)}</div><div className={'va79-verdict '+item[1].replace(' ','-')}><Braces size={30} /><div><small>DECISÃO</small><strong>{item[1]}</strong><span>{item[2]}</span></div></div><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Varargs complementa a modelagem</strong><p>Não use uma sequência de argumentos para evitar criar um record/request quando cada valor tem papel diferente.</p></div></aside></section>; }

const DOMAINS = [
  ['Cliente', 'criarCliente(nome, String... tags)', 'tags opcionais e homogêneas; coleção pode ser melhor no domínio'],
  ['Produto', 'somarPrecos(BigDecimal... preços)', 'valida null, negativo e escala'],
  ['Pedido', 'calcularTotal(ItemPedido... itens)', 'exige pelo menos um item tipado'],
  ['Pagamento', 'somarPagamentos(Pagamento... pagamentos)', 'quantidade variável da mesma natureza'],
  ['Ordem de serviço', 'criarOs(certificado, String... ocorrências)', 'didático; ocorrências reais pedem objetos'],
  ['Mensageria', 'cliente, texto, String... metadados', 'fixos explícitos e extras homogêneos'],
  ['Auditoria', 'usuário, operação, String... detalhes', 'detalhes opcionais junto de Instant fixo'],
];
function DomainLab() { const [selected, setSelected] = useState(0); const item = DOMAINS[selected]; return <section className="ln73-domains"><div>{DOMAINS.map((domain,index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index+1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>VARARGS NO BACKEND</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Teste do mentor</strong><span>Todos os argumentos variáveis têm o mesmo tipo, a mesma natureza e uma ordem fácil de entender?</span></div></article></section>; }

const ERRORS = [
  ['Esquecer o array', 'Código trata varargs como coleção mágica.', 'Use length, índices e for-each como array.'],
  ['Ignorar zero', 'Média divide por zero ou pedido aceita nenhum item.', 'Valide length quando houver mínimo.'],
  ['Não validar null', 'Array explícito ou elemento quebra no loop.', 'Valide referência e elementos.'],
  ['Varargs antes do fim', 'Assinatura não compila.', 'Mova-o para o último parâmetro.'],
  ['Dois varargs', 'Compilador não separa os grupos.', 'Use arrays/objetos explícitos.'],
  ['Object... sem motivo', 'API aceita qualquer mistura.', 'Use tipo forte ou request.'],
  ['Sobrecarga ambígua', 'Chamadas parecem pertencer a vários métodos.', 'Simplifique nomes e assinaturas.'],
  ['Naturezas diferentes', 'Posição passa a explicar cada argumento.', 'Modele campos num record.'],
  ['Ignorar alocação', 'Caminho crítico cria arrays repetidamente.', 'Meça antes de escolher alternativa.'],
  ['Request evitado', 'Varargs vira construtor sem nomes.', 'Use objeto quando campos têm papéis próprios.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors va79-errors"><div>{ERRORS.map((error,index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index+1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20}/><div><small>CASO {selected+1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16}/><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['varargs virou array visível','zero um muitos e array foram chamados','media validou tamanho mínimo','assinatura manteve varargs no fim','um único grupo variável foi usado','String int e BigDecimal foram praticados','três formas de null foram separadas','Object varargs foi restringido','request substituiu naturezas diferentes','sete domínios foram julgados'];
function DeliveryLab() { const [checked,setChecked]=useState([]); const toggle=index=>setChecked(current=>current.includes(index)?current.filter(item=>item!==index):[...current,index]); const commands=['mkdir labs\\m2\\aula-079-varargs','cd labs\\m2\\aula-079-varargs','javac LaboratorioVarargs.java','java LaboratorioVarargs'].join('\n'); return <section className="ln73-delivery"><CodePanel name="LaboratorioVarargs.java" code={MAIN_PROGRAM}/><div className="ln73-terminal"><header><Terminal size={15}/>Compilar e executar<CopyButton value={commands}/></header><pre><b>PS&gt;</b> {commands.replaceAll('\n','\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18}/><strong>Debug: reticências viram String[]</strong></header><div><article><span>1</span><strong>Breakpoint</strong><p>Pare dentro de quantidade.</p></article><article><span>2</span><strong>Tipo real</strong><p>nomes é String[].</p></article><article><span>3</span><strong>Três itens</strong><p>length 3; índices 0, 1 e 2.</p></article><article><span>4</span><strong>Zero itens</strong><p>array existe com length 0.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item,index)=><button type="button" key={item} className={checked.includes(index)?'done':''} onClick={()=>toggle(index)}><span>{checked.includes(index)?<Check size={14}/>:index+1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22}/><h3>Desafio: API de itens e pagamentos</h3></div><p>Crie métodos tipados para totalizar itens e pagamentos variáveis, com contratos de zero e null documentados.</p><ul><li>Aceite array explícito e chamada conveniente.</li><li>Provoque array null e elemento null separadamente.</li><li>Crie dois arquivos que não compilam: varargs fora do fim e dois varargs.</li><li>Refatore uma assinatura Object... para record/request.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16}/>README.md · evidências<CopyButton value={EVIDENCE}/></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{margin:0,padding:'18px',background:'#0f172a',fontSize:'.78rem'}}>{EVIDENCE}</SyntaxHighlighter></section></section>; }

function ContentBlock({block}) { if(block.type==='lead')return <p className="guided-lead">{block.text}</p>; const map={array:ArrayLab,arity:ArityLab,signature:SignatureLab,utility:UtilityLab,nulls:NullLab,design:DesignLab,domains:DomainLab,errors:ErrorsClinic,delivery:DeliveryLab}; const Component=map[block.type]; return Component?<Component/>:null; }
const steps=[
  {id:'array',label:'Varargs vira Array',duration:'11 min',eyebrow:'AÇÚCAR SINTÁTICO',title:'Veja a chamada ser empacotada em índices',blocks:[{type:'lead',text:'Reticências facilitam a chamada, mas dentro do método o parâmetro tem length, índices e elementos como qualquer array.'},{type:'array'}]},
  {id:'arity',label:'Zero a Muitos',duration:'10 min',eyebrow:'QUANTIDADE VARIÁVEL',title:'Separe permissão sintática de regra do domínio',blocks:[{type:'lead',text:'Zero argumentos cria array vazio. Se média, pedido ou pagamento exigem pelo menos um elemento, o método precisa validar.'},{type:'arity'}]},
  {id:'signature',label:'Regra da Assinatura',duration:'10 min',eyebrow:'ÚLTIMO E ÚNICO',title:'Coloque parâmetros fixos antes do grupo variável',blocks:[{type:'lead',text:'Só pode haver um varargs e ele deve ser o último parâmetro para o compilador separar os argumentos.'},{type:'signature'}]},
  {id:'utility',label:'Utilitários Tipados',duration:'12 min',eyebrow:'INT, STRING E BIGDECIMAL',title:'Use argumentos homogêneos com validação adequada',blocks:[{type:'lead',text:'Soma, média e junção são bons exemplos. Objetos exigem validação de array, elementos e regras como escala ou negativo.'},{type:'utility'}]},
  {id:'nulls',label:'Três Formas de Null',duration:'12 min',eyebrow:'VAZIO, ELEMENTO OU ARRAY',title:'Diagnostique a memória recebida antes do loop',blocks:[{type:'lead',text:'Chamada vazia, elemento null e array null explícito são estados diferentes e pedem defesas diferentes.'},{type:'nulls'}]},
  {id:'design',label:'Sobrecarga e Design',duration:'13 min',eyebrow:'CONVENIÊNCIA SEM BAGUNÇA',title:'Escolha varargs, tipo forte ou request pela natureza',blocks:[{type:'lead',text:'Sobrecarga complexa e Object... escondem contratos. Varargs cria array; use quando a conveniência compensa e os valores são homogêneos.'},{type:'design'}]},
  {id:'domains',label:'Varargs no Backend',duration:'13 min',eyebrow:'SETE DOMÍNIOS',title:'Aplique quantidade variável com senso crítico',blocks:[{type:'lead',text:'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria revelam quando varargs ajuda e quando uma coleção ou objeto é melhor.'},{type:'domains'}]},
  {id:'errors',label:'Clínica de Erros',duration:'12 min',eyebrow:'DEZ DIAGNÓSTICOS',title:'Corrija assinatura, null ou modelagem',blocks:[{type:'lead',text:'Array, zero, null, posição, Object, sobrecarga, performance e request falham por razões distintas.'},{type:'errors'}]},
  {id:'delivery',label:'Entrega & Desafio',duration:'27 min',eyebrow:'CÓDIGO, DEBUG E GIT',title:'Prove o array interno e os limites da API',blocks:[{type:'lead',text:'Compile, confira doze saídas, depure length e índices e entregue utilitários tipados com erros separados.'},{type:'delivery'}]},
];
export default function GuidedVarargsLesson079({isCompleted,onToggleCompleted,onNextLesson,onPrevLesson,hasNextLesson,hasPrevLesson}) { const[activeIndex,setActiveIndex]=useState(0);const navRef=useRef(null);const completionNormalizedRef=useRef(false);const[completedSteps,setCompletedSteps]=useState(()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');const validIds=new Set(steps.map(step=>step.id));return new Set(Array.isArray(saved)?saved.filter(id=>validIds.has(id)):[])}catch{return new Set()}});useEffect(()=>localStorage.setItem(STORAGE_KEY,JSON.stringify([...completedSteps])),[completedSteps]);useEffect(()=>{if(!completionNormalizedRef.current&&isCompleted&&completedSteps.size!==steps.length){completionNormalizedRef.current=true;onToggleCompleted()}},[completedSteps.size,isCompleted,onToggleCompleted]);useEffect(()=>{const button=navRef.current?.querySelector('button.active');if(button&&window.matchMedia('(max-width: 900px)').matches)button.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})},[activeIndex]);const step=steps[activeIndex];const stepDone=completedSteps.has(step.id);const allStepsDone=completedSteps.size===steps.length;const lessonComplete=isCompleted&&allStepsDone;const selectStep=index=>{setActiveIndex(index);document.querySelector('.guided-layout')?.scrollIntoView({behavior:'smooth',block:'start'})};const toggleStep=()=>{if(stepDone&&isCompleted)onToggleCompleted();setCompletedSteps(current=>{const next=new Set(current);if(next.has(step.id))next.delete(step.id);else next.add(step.id);return next})};return <article className="guided-git-lesson guided-varargs-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Braces size={17}/>Laboratório de argumentos variáveis</span><p className="guided-sequence">079 · M2.18</p><h1>Varargs</h1><p>Crie chamadas flexíveis para valores homogêneos, enxergue o array interno e proteja a modelagem.</p></div><div className="guided-hero-status"><Clock3 size={42}/><strong>{Math.round((completedSteps.size/steps.length)*100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 079" items={[{value:'0..N itens',label:'Empacotados em array'},{value:'7 domínios',label:'Com contratos tipados'},{value:'10 falhas',label:'Diagnosticadas pela causa'}]}/><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 079"><div className="guided-step-nav-title"><ListChecks size={18}/>Roteiro prático</div>{steps.map((item,index)=><button type="button" key={item.id} className={(index===activeIndex?'active ':'')+(completedSteps.has(item.id)?'done':'')} onClick={()=>selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id)?<Check size={14}/>:String(index+1).padStart(2,'0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block,index)=><ContentBlock key={block.type+'-'+index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex===0} onClick={()=>selectStep(activeIndex-1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle '+(stepDone?'undo':'complete')} onClick={toggleStep}>{stepDone?<><RotateCcw size={16}/>Desmarcar etapa</>:<><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex<steps.length-1&&<button type="button" className="primary" disabled={!stepDone} onClick={()=>selectStep(activeIndex+1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone&&<section className="guided-finish"><CheckCircle2 size={30}/><div><h3>API variável e tipada</h3><p>{lessonComplete?'Aula concluída e pronta para annotations básicas.':'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete?'Reabrir aula':'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 078</button><div className={'guided-course-status '+(lessonComplete?'completed':allStepsDone?'ready':'')}><Clock3 size={18}/><span><strong>{lessonComplete?'Aula concluída':completedSteps.size+' de '+steps.length+' etapas'}</strong><small>arrays, validação e design</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson||!lessonComplete}>Aula 080<ArrowRight size={17}/></button></footer></article>; }
