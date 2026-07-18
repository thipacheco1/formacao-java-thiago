import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Bug, Check, CheckCircle2, Clock3, Copy, FileCode2, Lightbulb, ListChecks, Play, RotateCcw, ShieldAlert, Sparkles, Terminal, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedExceptionsInternalsLesson.css';

const STORAGE_KEY = 'guided-exceptions-internals-lesson-085-progress';
const MAIN_PROGRAM = [
  'import java.io.IOException;',
  '',
  'public class LaboratorioExceptions {',
  '    public static void main(String[] args) {',
  '        try {',
  '            dividir(10, 0);',
  '        } catch (ArithmeticException erro) {',
  '            System.out.println("divisao: " + erro.getMessage());',
  '        } finally {',
  '            System.out.println("finally: executado");',
  '        }',
  '',
  '        try {',
  '            criarCliente("");',
  '        } catch (RegraNegocioException erro) {',
  '            System.out.println("negocio: " + erro.getMessage());',
  '        }',
  '',
  '        try {',
  '            processarPedido();',
  '        } catch (RuntimeException erro) {',
  '            System.out.println("contexto: " + erro.getMessage());',
  '            System.out.println("causa: "',
  '                    + erro.getCause().getClass().getSimpleName()',
  '                    + " - " + erro.getCause().getMessage());',
  '        }',
  '',
  '        try {',
  '            lerArquivo();',
  '        } catch (IOException erro) {',
  '            System.out.println("checked: " + erro.getMessage());',
  '        }',
  '',
  '        try {',
  '            int numero = Integer.parseInt("abc");',
  '            System.out.println(10 / numero);',
  '        } catch (NumberFormatException | ArithmeticException erro) {',
  '            System.out.println("numerico: "',
  '                    + erro.getClass().getSimpleName());',
  '        }',
  '',
  '        try {',
  '            new Pedido(StatusPedido.CANCELADO).aprovar();',
  '        } catch (IllegalStateException erro) {',
  '            System.out.println("estado: " + erro.getMessage());',
  '        }',
  '    }',
  '',
  '    static int dividir(int a, int b) { return a / b; }',
  '',
  '    static void criarCliente(String nome) {',
  '        if (nome == null || nome.isBlank()) {',
  '            throw new RegraNegocioException(',
  '                    "Nome do cliente e obrigatorio.");',
  '        }',
  '    }',
  '',
  '    static void processarPedido() {',
  '        try {',
  '            lerConfiguracao();',
  '        } catch (IOException erro) {',
  '            throw new RuntimeException(',
  '                    "Falha ao processar pedido.", erro);',
  '        }',
  '    }',
  '',
  '    static void lerConfiguracao() throws IOException {',
  '        throw new IOException("configuracao.properties ausente");',
  '    }',
  '',
  '    static void lerArquivo() throws IOException {',
  '        throw new IOException("Arquivo nao encontrado.");',
  '    }',
  '}',
  '',
  'class RegraNegocioException extends RuntimeException {',
  '    RegraNegocioException(String mensagem) { super(mensagem); }',
  '    RegraNegocioException(String mensagem, Throwable causa) {',
  '        super(mensagem, causa);',
  '    }',
  '}',
  '',
  'class Pedido {',
  '    private StatusPedido status;',
  '    Pedido(StatusPedido status) { this.status = status; }',
  '    void aprovar() {',
  '        if (status != StatusPedido.PENDENTE) {',
  '            throw new IllegalStateException(',
  '                    "Esperado PENDENTE; atual " + status);',
  '        }',
  '        status = StatusPedido.APROVADO;',
  '    }',
  '}',
  'enum StatusPedido { PENDENTE, APROVADO, CANCELADO }',
].join('\n');

const EXPECTED_OUTPUT = [
  'divisao: / by zero',
  'finally: executado',
  'negocio: Nome do cliente e obrigatorio.',
  'contexto: Falha ao processar pedido.',
  'causa: IOException - configuracao.properties ausente',
  'checked: Arquivo nao encontrado.',
  'numerico: NumberFormatException',
  'estado: Esperado PENDENTE; atual CANCELADO',
].join('\n');

const EVIDENCE = [
  '# Aula 085 — Exceptions por baixo', '',
  '- [ ] Mapeei Throwable, Error, Exception e RuntimeException',
  '- [ ] Diferenciei checked e unchecked',
  '- [ ] Li tipo, mensagem, primeiro frame e chamadores',
  '- [ ] Diagnostiquei NPE, argumento, estado e número inválido',
  '- [ ] Usei try/catch/finally sem esconder falha',
  '- [ ] Diferenciei throw de throws',
  '- [ ] Acompanhei propagação por camadas',
  '- [ ] Preservei a causa ao encapsular',
  '- [ ] Criei exception de domínio com critério',
  '- [ ] Ordenei catches e usei multi-catch',
  '- [ ] Apliquei lançar/capturar/propagar em sete domínios',
  '- [ ] Compilei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16}/>{name}<CopyButton value={code}/></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

function HierarchyLab() { const [selected, setSelected] = useState('runtime'); const details = { error: ['Error', 'falha grave da JVM/ambiente', 'normalmente não é recuperação da aplicação'], checked: ['Checked exception', 'IOException · SQLException · ClassNotFoundException', 'capturar ou declarar throws'], runtime: ['RuntimeException', 'NPE · IllegalArgument · IllegalState · Arithmetic', 'compilador não obriga captura'] }; const item = details[selected]; return <section className="ex85-stack"><div className="ex85-tree"><strong>Throwable</strong><ArrowDown/><div><button type="button" className={selected === 'error' ? 'active error' : ''} onClick={() => setSelected('error')}>Error</button><button type="button" className={selected !== 'error' ? 'active exception' : ''} onClick={() => setSelected('checked')}>Exception</button></div><ArrowDown/><div><button type="button" className={selected === 'runtime' ? 'active runtime' : ''} onClick={() => setSelected('runtime')}>RuntimeException</button><button type="button" className={selected === 'checked' ? 'active checked' : ''} onClick={() => setSelected('checked')}>checked</button></div></div><div className={'ex85-verdict ' + selected}><small>{item[0]}</small><strong>{item[1]}</strong><span>{item[2]}</span></div><CodePanel name="Checked versus unchecked" code={'void lerArquivo() throws IOException {\n    throw new IOException("Arquivo não encontrado.");\n}\n\nvoid validarNome(String nome) {\n    if (nome == null || nome.isBlank()) {\n        throw new IllegalArgumentException("Nome é obrigatório.");\n    }\n}'}/><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Checked pergunta se o chamador deve decidir</strong><p>Unchecked costuma representar argumento, estado, programação ou regra quebrada. Em backend moderno, frameworks também convertem muitas checked em unchecked.</p></div></aside></section>; }

const TRACE = [
  ['type', 'java.lang.NullPointerException', 'qual família de falha ocorreu'],
  ['message', 'Cannot invoke length() because valor is null', 'o que a JVM conseguiu explicar'],
  ['origin', 'at Repository.buscar(StackTraceCamadas.java:31)', 'primeiro frame do seu código: comece aqui'],
  ['caller1', 'at Service.processar(StackTraceCamadas.java:23)', 'quem chamou o ponto que falhou'],
  ['caller2', 'at Controller.executar(StackTraceCamadas.java:15)', 'caminho até a entrada do fluxo'],
];
function TraceLab() { const [selected, setSelected] = useState(2); const item = TRACE[selected]; return <section className="ex85-stack"><div className="ex85-trace"><div>{TRACE.map((line, index) => <button type="button" key={line[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{line[1]}</button>)}</div><article><Bug size={24}/><div><small>{item[0].toUpperCase()}</small><strong>{item[2]}</strong></div></article></div><div className="ex85-layers">{['main', 'Controller.executar', 'Service.processar', 'Repository.buscar', 'NullPointerException'].map((layer, index) => <React.Fragment key={layer}><span className={index === 4 ? 'failure' : ''}>{layer}</span>{index < 4 && <ArrowRight/>}</React.Fragment>)}</div><aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>Leia como mapa, não como parede de texto</strong><p>Tipo, mensagem, primeiro at do seu código e chamadores contam onde a falha nasceu e como o fluxo chegou ali.</p></div></aside></section>; }

const TYPES = [
  ['null', 'NullPointerException', 'uma referência null foi usada', 'descubra origem e contrato de ausência'],
  ['argument', 'IllegalArgumentException', 'o argumento recebido é inválido', 'falhe cedo e nomeie o campo/operação'],
  ['state', 'IllegalStateException', 'o estado atual proíbe a operação', 'inclua esperado e atual'],
  ['number', 'NumberFormatException', 'texto não representa o número esperado', 'registre o valor e a origem com cuidado'],
];
function TypesLab() { const [selected, setSelected] = useState(1); const item = TYPES[selected]; return <section className="ex85-stack"><div className="ex85-type-tabs">{TYPES.map((type, index) => <button type="button" key={type[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{type[1]}</button>)}</div><div className="ex85-type"><ShieldAlert size={27}/><div><small>SIGNIFICADO</small><strong>{item[2]}</strong><span>{item[3]}</span></div></div><CodePanel name="Mensagem que ajuda a corrigir" code={'if (nome == null || nome.isBlank()) {\n    throw new IllegalArgumentException(\n            "Nome do cliente é obrigatório para criar cadastro.");\n}\n\nif (status != StatusPedido.PENDENTE) {\n    throw new IllegalStateException(\n            "Esperado PENDENTE. Status atual: " + status);\n}'}/><p className="ln73-format-proof"><strong>Erro.</strong> não é uma mensagem útil. Inclua operação, entidade, identificador e estado relevante sem expor segredo.</p></section>; }

function CatchLab() { const [fail, setFail] = useState(true); const lines = fail ? ['Abrindo recurso.', 'Erro: / by zero', 'Fechando recurso.'] : ['Abrindo recurso.', 'Resultado: 5', 'Fechando recurso.']; return <section className="ex85-stack"><label className="ex85-switch"><input type="checkbox" checked={fail} onChange={event => setFail(event.target.checked)}/> provocar divisão por zero</label><div className="ex85-tryflow"><span>try</span><ArrowRight/><span className={fail ? 'error' : 'success'}>{fail ? 'throw ArithmeticException' : 'resultado'}</span><ArrowRight/><span className={fail ? 'active' : ''}>catch específico</span><ArrowRight/><span className="finally">finally</span></div><div className="ex85-console">{lines.map(line => <span key={line}>{line}</span>)}</div><CodePanel name="Captura específica sem engolir" code={'try {\n    System.out.println("Abrindo recurso.");\n    System.out.println(dividir(10, divisor));\n} catch (ArithmeticException erro) {\n    System.out.println("Erro: " + erro.getMessage());\n} finally {\n    System.out.println("Fechando recurso.");\n}'}/><aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>printStackTrace é didático; backend usa logging</strong><p>Catch vazio ou catch Exception genérico sem ação destrói diagnóstico. Capture para tratar, contextualizar, responder, limpar ou executar fallback real.</p></div></aside></section>; }

function PropagationLab() { const [capture, setCapture] = useState('main'); const layers = ['Repository', 'Service', 'Controller', 'main']; return <section className="ex85-stack"><div className="ex85-propagation">{layers.map((layer, index) => <React.Fragment key={layer}><button type="button" className={capture === layer.toLowerCase() ? 'active' : ''} onClick={() => setCapture(layer.toLowerCase())}>{layer}<small>{capture === layer.toLowerCase() ? 'captura aqui' : index === 0 ? 'lança' : 'propaga'}</small></button>{index < 3 && <ArrowRight/>}</React.Fragment>)}</div><CodePanel name="throw, throws e propagação" code={'static void lerArquivo() throws IOException {\n    throw new IOException("Arquivo não encontrado.");\n}\n\nstatic void service() throws IOException {\n    lerArquivo();\n}\n\ntry {\n    service();\n} catch (IOException erro) {\n    System.out.println(erro.getMessage());\n}'}/><p className="ln73-format-proof"><strong>throw</strong> cria/dispara a ocorrência; <strong>throws</strong> declara no contrato. Se a camada não sabe recuperar, propagar é mais honesto.</p></section>; }

function CauseLab() { const [preserve, setPreserve] = useState(true); return <section className="ex85-stack"><div className="ex85-cause"><article><small>CONTEXTO DA APLICAÇÃO</small><strong>RuntimeException</strong><span>Falha ao processar pedido.</span></article><ArrowDown/><article className={preserve ? 'preserved' : 'lost'}><small>{preserve ? 'CAUSED BY' : 'CAUSA PERDIDA'}</small><strong>{preserve ? 'IOException' : 'null'}</strong><span>{preserve ? 'configuracao.properties ausente' : 'origem e stack trace foram descartados'}</span></article></div><button type="button" className={'ex85-preserve ' + (preserve ? 'active' : '')} onClick={() => setPreserve(current => !current)}>{preserve ? 'Preservando erro original' : 'Simulando relançamento ruim'}</button><CodePanel name="Adicionar contexto sem apagar a raiz" code={'try {\n    lerArquivoConfiguracao();\n} catch (IOException erro) {\n    throw new RuntimeException(\n            "Falha ao processar pedido por configuração.", erro);\n}\n\nclass RegraNegocioException extends RuntimeException {\n    RegraNegocioException(String mensagem, Throwable causa) {\n        super(mensagem, causa);\n    }\n}'}/><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Caused by é a trilha até a primeira falha real</strong><p>Exception própria diferencia erros de domínio quando isso ajuda o tratamento. Não crie uma classe nova para cada frase.</p></div></aside><CodePanel name="Ordem e multi-catch" code={'try {\n    executar();\n} catch (IllegalArgumentException erro) {\n    // específico antes do genérico\n} catch (Exception erro) {\n    // último recurso justificado\n}\n\ncatch (NumberFormatException | ArithmeticException erro) {\n    System.out.println("Erro numérico: " + erro.getMessage());\n}'}/></section>; }

const DOMAINS = [
  ['Cliente', 'argumento/regra', 'nome e e-mail obrigatórios com campo explícito'],
  ['Produto', 'regra', 'preço deve ser maior que zero'],
  ['Pedido', 'estado', 'código, esperado PENDENTE e status atual'],
  ['Pagamento', 'regra', 'valor positivo e código do pagamento'],
  ['Ordem de serviço', 'estado', 'certificado, operação e status que bloqueou'],
  ['Mensageria', 'argumento', 'cliente, certificado e tipo obrigatórios'],
  ['Auditoria', 'argumento', 'usuário, operação, entidade e ID'],
];
const ACTIONS = [['Lançar', 'método não cumpre contrato'], ['Capturar', 'há tratamento, resposta ou fallback real'], ['Propagar', 'camada atual não sabe decidir']];
function DomainLab() { const [selected, setSelected] = useState(0); const [action, setAction] = useState(0); const item = DOMAINS[selected]; return <section className="ex85-stack"><div className="ln73-domains ex85-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>FALHA COM CONTEXTO</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Teste do mentor</strong><span>A camada consegue corrigir, traduzir ou apenas deve deixar subir?</span></div></article></div><div className="ex85-actions">{ACTIONS.map((entry, index) => <button type="button" key={entry[0]} className={action === index ? 'active' : ''} onClick={() => setAction(index)}><strong>{entry[0]}</strong><small>{entry[1]}</small></button>)}</div><p className="ln73-format-proof">Repository pode lançar erro técnico; service adiciona contexto; controller/handler converte para resposta. <strong>Não exponha stack trace cru ao usuário.</strong></p></section>; }

const ERRORS = [
  ['Engolir exceção', 'catch vazio apaga o sinal da falha.', 'Trate, registre com contexto ou propague.'],
  ['Mensagem genérica', '“Erro” não orienta investigação.', 'Inclua operação, entidade e estado relevante.'],
  ['Perder causa raiz', 'Wrapper não recebe erro original.', 'Passe a causa no construtor.'],
  ['Catch Exception', 'Falhas diferentes recebem a mesma resposta.', 'Capture o tipo específico necessário.'],
  ['Fluxo normal por exception', 'Caso esperado vira custo e ruído.', 'Use condição/retorno quando não é excepcional.'],
  ['Stack trace ao usuário', 'Detalhes internos e sensíveis vazam.', 'Logue internamente e responda de forma segura.'],
  ['Validação tardia', 'Erro aparece longe da entrada inválida.', 'Falhe cedo no limite do contrato.'],
  ['Classe para tudo', 'Hierarquia cresce sem ganho de tratamento.', 'Crie tipo próprio só quando diferencia política.'],
  ['Técnico no domínio', 'SQLException cru atravessa regras.', 'Converta com contexto e preserve a causa.'],
  ['Ignorar stack trace', 'Investigação começa por suposição.', 'Leia tipo, mensagem, primeiro frame e causa.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors ex85-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20}/><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16}/><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['Throwable e ramos mapeados', 'checked versus unchecked explicado', 'primeiro frame encontrado', 'NPE, argumento, estado e número diferenciados', 'catch específico e finally executados', 'throw e throws separados', 'propagação por quatro camadas acompanhada', 'causa raiz preservada', 'exception de domínio justificada', 'catch order e multi-catch praticados'];
function DeliveryLab() { const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]); const commands = ['mkdir labs\\m2\\aula-085-exceptions-por-baixo', 'cd labs\\m2\\aula-085-exceptions-por-baixo', 'javac LaboratorioExceptions.java', 'java LaboratorioExceptions'].join('\n'); return <section className="ln73-delivery"><CodePanel name="LaboratorioExceptions.java" code={MAIN_PROGRAM}/><div className="ln73-terminal"><header><Terminal size={15}/>Compilar e executar<CopyButton value={commands}/></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{ '\n\n' }<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18}/><strong>Debug: pause no momento do throw</strong></header><div><article><span>1</span><strong>Breakpoint</strong><p>Pare na validação.</p></article><article><span>2</span><strong>Valor</strong><p>nome está vazio.</p></article><article><span>3</span><strong>Call stack</strong><p>veja quem chamou.</p></article><article><span>4</span><strong>Exception</strong><p>confira message e cause.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14}/> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22}/><h3>Desafio: cadeia de falha de uma OS</h3></div><p>Faça repository lançar IOException, service encapsular com contexto da OS e a borda capturar sem perder a causa.</p><ul><li>Inclua certificado, operação e status na mensagem.</li><li>Mostre o Caused by original.</li><li>Compare catch específico com catch Exception.</li><li>Registre stack trace, causa raiz e decisão de camada.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16}/>README.md · evidências<CopyButton value={EVIDENCE}/></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>; }

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { hierarchy: HierarchyLab, trace: TraceLab, types: TypesLab, catch: CatchLab, propagation: PropagationLab, cause: CauseLab, domains: DomainLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component/> : null; }
const steps = [
  { id: 'hierarchy', label: 'Hierarquia e Contrato', duration: '13 min', eyebrow: 'THROWABLE POR BAIXO', title: 'Separe falha de ambiente, checked e runtime', blocks: [{ type: 'lead', text: 'Exception é objeto estruturado. A posição na hierarquia define se o compilador obriga captura ou declaração.' }, { type: 'hierarchy' }] },
  { id: 'trace', label: 'Ler o Stack Trace', duration: '15 min', eyebrow: 'MAPA DE INVESTIGAÇÃO', title: 'Encontre origem, mensagem e caminho da chamada', blocks: [{ type: 'lead', text: 'Comece pelo tipo, leia a mensagem e encontre o primeiro frame do seu código; os frames seguintes explicam quem chamou.' }, { type: 'trace' }] },
  { id: 'types', label: 'Exceptions com Significado', duration: '13 min', eyebrow: 'NPE, ARGUMENTO, ESTADO E NÚMERO', title: 'Escolha o tipo que descreve a falha real', blocks: [{ type: 'lead', text: 'Null, argumento inválido, estado proibido e conversão numérica falham por razões diferentes e pedem mensagens específicas.' }, { type: 'types' }] },
  { id: 'catch', label: 'Try, Catch e Finally', duration: '14 min', eyebrow: 'CAPTURA SEM SILÊNCIO', title: 'Trate a falha e execute limpeza previsível', blocks: [{ type: 'lead', text: 'Catch específico recupera ou traduz; finally executa ao final. Catch vazio não é tratamento.' }, { type: 'catch' }] },
  { id: 'propagation', label: 'Throw, Throws e Camadas', duration: '13 min', eyebrow: 'PROPAGAÇÃO', title: 'Deixe a decisão subir até quem sabe tratar', blocks: [{ type: 'lead', text: 'throw dispara, throws declara e a exceção sobe enquanto nenhuma camada a captura.' }, { type: 'propagation' }] },
  { id: 'cause', label: 'Causa Raiz e Wrapping', duration: '16 min', eyebrow: 'CONTEXTO SEM APAGAR ORIGEM', title: 'Acrescente linguagem da aplicação e preserve Caused by', blocks: [{ type: 'lead', text: 'Uma exceção externa pode ganhar contexto do pedido sem perder IOException, stack trace e mensagem originais.' }, { type: 'cause' }] },
  { id: 'domains', label: 'Exceptions no Backend', duration: '15 min', eyebrow: 'SETE DOMÍNIOS E TRÊS DECISÕES', title: 'Lance, capture ou propague conforme a responsabilidade', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria exigem contexto útil e fronteira clara entre negócio e técnica.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Encontre causa perdida, catch vazio e vazamento técnico', blocks: [{ type: 'lead', text: 'Tratamento ruim torna a falha mais difícil de corrigir do que a exceção original.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '32 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove mensagens, propagação e causa raiz', blocks: [{ type: 'lead', text: 'Compile, confira oito saídas, depure no throw e entregue uma cadeia repository-service-borda rastreável.' }, { type: 'delivery' }] },
];

export default function GuidedExceptionsInternalsLesson085({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) { const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false); const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } }); useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]); useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]); useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]); const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone; const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); }; return <article className="guided-git-lesson guided-exceptions-internals-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Bug size={17}/>Clínica de falhas Java</span><p className="guided-sequence">085 · M2.24</p><h1>Exceptions por baixo</h1><p>Leia stack traces como mapas, preserve causas e decida onde lançar, capturar ou propagar em um backend.</p></div><div className="guided-hero-status"><Clock3 size={42}/><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 085" items={[{ value: '4 pistas', label: 'Tipo, mensagem, origem e chamador' }, { value: '3 decisões', label: 'Lançar, capturar ou propagar' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]}/><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 085"><div className="guided-step-nav-title"><ListChecks size={18}/>Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14}/> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16}/>Desmarcar etapa</> : <><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Falhas rastreáveis e causas preservadas</h3><p>{lessonComplete ? 'Aula concluída e pronta para console robusto.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 084</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18}/><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>stack trace, causa e propagação</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 086<ArrowRight size={17}/></button></footer></article>; }
