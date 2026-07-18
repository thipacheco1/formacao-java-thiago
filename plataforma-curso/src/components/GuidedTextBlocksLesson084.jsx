import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Braces, Check, CheckCircle2, Clock3, Copy, FileCode2, FileJson, IndentIncrease, Lightbulb, ListChecks, Play, RotateCcw, Sparkles, Terminal, TextQuote, Wrench, XCircle } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedTextBlocksLesson.css';

const STORAGE_KEY = 'guided-text-blocks-lesson-084-progress';
const MAIN_PROGRAM = [
  'public class LaboratorioTextBlocks {',
  '    public static void main(String[] args) {',
  '        String texto = """',
  '                Java',
  '                Backend',
  '                Profissional',
  '                """;',
  '        System.out.println("tipo: " + texto.getClass().getSimpleName());',
  '        System.out.println("linhas: " + texto.lines().count());',
  '        System.out.println("quebra final: " + texto.endsWith("\\n"));',
  '        System.out.println("strip: "',
  '                + texto.strip().replace("\\n", " | "));',
  '',
  '        String json = """',
  '                {',
  '                  "nome": "%s",',
  '                  "ativo": true',
  '                }',
  '                """.formatted("Ana");',
  '        System.out.println("json nome: " + json.contains("\\"Ana\\""));',
  '',
  '        String sql = """',
  '                select p.id, p.nome',
  '                from produto p',
  '                where p.status = ?',
  '                order by p.nome',
  '                """;',
  '        System.out.println("sql parametrizado: "',
  '                + sql.contains("status = ?"));',
  '',
  '        String mensagem = """',
  '                Ola, %s.',
  '',
  '                Seu pedido %s foi aprovado.',
  '                """.formatted("Ana", "PED-001");',
  '        System.out.println("mensagem: "',
  '                + mensagem.strip().replace("\\n", " | "));',
  '',
  '        String deslocado = "linha 1\\nlinha 2".indent(2);',
  '        System.out.println("indent: "',
  '                + deslocado.stripTrailing().replace("\\n", " | "));',
  '        System.out.println("stripIndent: "',
  '                + "  A\\n  B".stripIndent().replace("\\n", " | "));',
  '    }',
  '}',
].join('\n');

const EXPECTED_OUTPUT = [
  'tipo: String',
  'linhas: 3',
  'quebra final: true',
  'strip: Java | Backend | Profissional',
  'json nome: true',
  'sql parametrizado: true',
  'mensagem: Ola, Ana. |  | Seu pedido PED-001 foi aprovado.',
  'indent:   linha 1 |   linha 2',
  'stripIndent: A | B',
].join('\n');

const EVIDENCE = [
  '# Aula 084 — Text blocks', '',
  '- [ ] Confirmei Java 17 ou superior',
  '- [ ] Abri o text block com quebra após três aspas',
  '- [ ] Provei que o resultado é String',
  '- [ ] Inspecionei a quebra de linha final',
  '- [ ] Comparei o valor original com strip',
  '- [ ] Expliquei indentação incidental e fechamento',
  '- [ ] Usei aspas internas sem ruído',
  '- [ ] Usei formatted com poucos placeholders nomeados',
  '- [ ] Mantive SQL com ? em vez de concatenar entrada',
  '- [ ] Separei text block de serializador/template engine',
  '- [ ] Apliquei em sete domínios',
  '- [ ] Compilei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16}/>{name}<CopyButton value={code}/></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

function SyntaxLab() { const [valid, setValid] = useState(true); return <section className="tb84-stack"><div className="tb84-mode"><button type="button" className={valid ? 'active' : ''} onClick={() => setValid(true)}>Abertura válida</button><button type="button" className={!valid ? 'active danger' : ''} onClick={() => setValid(false)}>Mesma linha</button></div><div className="tb84-delimiter"><article><small>ABERTURA</small><code>{valid ? 'String texto = """ ↵' : 'String texto = """conteúdo""";'}</code></article><ArrowRight/><article className={valid ? 'valid' : 'invalid'}>{valid ? <CheckCircle2 size={22}/> : <XCircle size={22}/>}<div><strong>{valid ? 'conteúdo começa na linha seguinte' : 'illegal text block open delimiter sequence'}</strong><span>{valid ? 'o delimitador final fecha a String multilinha' : 'três aspas exigem quebra de linha após a abertura'}</span></div></article></div><CodePanel name="Primeiro text block" code={'String texto = """\n        Java\n        Backend\n        Profissional\n        """;\n\nSystem.out.println(texto.getClass().getSimpleName());\nSystem.out.println(texto.toUpperCase());'}/><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Text block não cria um novo tipo</strong><p>Ele produz String e aceita length, contains, replace, formatted, strip e os demais métodos normais.</p></div></aside></section>; }

function NewlineLab() { const [strip, setStrip] = useState(false); const raw = 'Ana\n'; const shown = strip ? raw.trim() : raw; return <section className="tb84-stack"><div className="tb84-newline"><article><small>VALOR NA MEMÓRIA</small><code>{strip ? '"Ana"' : '"Ana\\n"'}</code><strong>length = {shown.length}</strong></article><div className="tb84-chars">{[...'Ana'].map((char, index) => <span key={index}>{char}</span>)}{!strip && <span className="newline">↵</span>}</div><button type="button" className={strip ? 'active' : ''} onClick={() => setStrip(current => !current)}>{strip ? 'Repor quebra final' : 'Aplicar strip()'}</button></div><div className="tb84-console"><strong>System.out.println("[" + texto + "]")</strong><pre>{strip ? '[Ana]' : '[Ana\n]'}</pre></div><CodePanel name="Quebra final observável" code={'String texto = """\n        Ana\n        """;\n\nSystem.out.println("[" + texto + "]");\nSystem.out.println(texto.length()); // 4\nSystem.out.println("[" + texto.strip() + "]");'}/><p className="ln73-format-proof">A quebra final faz parte do conteúdo. Remova-a <strong>somente quando o contrato pedir</strong>, não por reflexo.</p></section>; }

const INDENT_CASES = [
  ['incidental', 'Incidental', 'o compilador remove a margem comum', '{\n  "nome": "Ana"\n}'],
  ['strip', 'stripIndent()', 'remove a indentação incidental de uma String multilinha', 'linha 1\nlinha 2'],
  ['add', 'indent(4)', 'adiciona quatro espaços a cada linha', '    linha 1\n    linha 2'],
];
function IndentationLab() { const [selected, setSelected] = useState(0); const item = INDENT_CASES[selected]; return <section className="tb84-stack"><div className="tb84-indent-tabs">{INDENT_CASES.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{entry[1]}</button>)}</div><div className="tb84-indent"><article><IndentIncrease size={25}/><div><small>REGRA</small><strong>{item[2]}</strong></div></article><pre>{item[3]}</pre></div><CodePanel name="Indentação do código versus conteúdo" code={'String json = """\n        {\n          "nome": "Ana"\n        }\n        """;\n\nString recebido = "  linha 1\\n  linha 2";\nSystem.out.println(recebido.stripIndent());\nSystem.out.println(recebido.indent(4));'}/><aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>A posição do delimitador final participa da margem</strong><p>Mantenha alinhamento previsível e não misture tabs com espaços. Inspecione o valor real quando o formato for contrato.</p></div></aside></section>; }

const ESCAPES = [
  ['quotes', 'Aspas comuns', '"nome": "Ana"', 'não precisam de barra em JSON normal'],
  ['newline', '\\n explícito', 'Linha 1\\nLinha 2', 'ainda cria uma quebra adicional'],
  ['tab', '\\t', 'coluna 1\\tcoluna 2', 'escape continua funcionando'],
  ['slash', '\\\\', 'C:\\\\dados', 'barra invertida ainda exige atenção'],
];
function EscapeLab() { const [selected, setSelected] = useState(0); const item = ESCAPES[selected]; return <section className="tb84-stack"><div className="tb84-escapes">{ESCAPES.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{entry[1]}</code></button>)}</div><div className="tb84-escape-view"><TextQuote size={27}/><div><code>{item[2]}</code><strong>{item[3]}</strong></div></div><CodePanel name="Aspas internas ficam naturais" code={'String json = """\n        {\n          "mensagem": "Olá, Ana!",\n          "caminho": "C:\\\\dados"\n        }\n        """;\n\n// Escapes como \\n, \\t, \\" e \\\\ continuam existindo.'}/></section>; }

function JsonLab() { const [name, setName] = useState('Ana'); const unsafe = name.includes('"') || name.includes('\\'); const preview = '{\n  "nome": "' + name + '",\n  "ativo": true\n}'; return <section className="tb84-stack"><div className="tb84-json"><label>Nome inserido com %s<input value={name} onChange={event => setName(event.target.value)}/></label><pre>{preview}</pre><article className={unsafe ? 'unsafe' : 'safe'}>{unsafe ? <AlertTriangle size={22}/> : <CheckCircle2 size={22}/>}<div><strong>{unsafe ? 'JSON pode ficar inválido' : 'exemplo didático válido'}</strong><span>{unsafe ? 'formatted não escapa aspas ou barras' : 'bom para payload fixo, mock e teste controlado'}</span></div></article></div><CodePanel name="JSON fixo com poucos valores" code={'String json = """\n        {\n          "nome": "%s",\n          "email": "%s",\n          "ativo": true\n        }\n        """.formatted(nome, email);'}/><aside className="guided-note warning"><FileJson size={20}/><div><strong>formatted substitui; não serializa</strong><p>Para dados dinâmicos reais, use DTO e biblioteca JSON como Jackson. Muitos %s também pedem outro modelo ou template.</p></div></aside></section>; }

const DOCUMENTS = [
  ['sql', 'SQL', 'where p.status = ?', 'PreparedStatement recebe o valor; text block só melhora a leitura'],
  ['html', 'HTML', '<h1>Olá, Ana</h1>', 'bom para mock simples; template complexo pede engine'],
  ['message', 'Mensagem', 'Olá, %s.\n\nPedido %s aprovado.', 'poucos placeholders e ordem clara'],
];
function DocumentLab() { const [selected, setSelected] = useState(0); const item = DOCUMENTS[selected]; return <section className="tb84-stack"><div className="tb84-doc-tabs">{DOCUMENTS.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{entry[1]}</button>)}</div><div className="tb84-document"><Braces size={25}/><div><code>{item[2]}</code><strong>{item[3]}</strong></div></div><CodePanel name="SQL legível e parametrizado" code={'String sql = """\n        select\n            p.id,\n            p.nome,\n            p.preco\n        from produto p\n        where p.status = ?\n        order by p.nome\n        """;\n\n// O valor entra depois com parâmetro preparado, não com formatted.'}/><aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>Legibilidade não é segurança</strong><p>Text block não previne SQL injection, não escapa HTML, não internacionaliza mensagens e não substitui template engine.</p></div></aside></section>; }

const DOMAINS = [
  ['Cliente', 'JSON didático', 'payload fixo de teste; produção usa serializador'],
  ['Produto', 'SQL de consulta', 'query multiline com parâmetro ?'],
  ['Pedido', 'Resumo multilinha', 'código, cliente e total com poucos placeholders'],
  ['Pagamento', 'Evento JSON', 'payload controlado com valor e Instant'],
  ['Ordem de serviço', 'Relatório simples', 'certificado, status, data e hora'],
  ['Mensageria', 'Mensagem longa', 'linhas em branco preservadas'],
  ['Auditoria', 'Linha detalhada', 'usuário, operação, entidade, ID e Instant'],
];
function DomainLab() { const [selected, setSelected] = useState(0); const item = DOMAINS[selected]; return <section className="tb84-stack"><div className="ln73-domains tb84-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>TEXTO MULTILINHA NO BACKEND</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Teste do mentor</strong><span>O texto é fixo, curto o bastante e seguro para permanecer no código?</span></div></article></div><div className="tb84-refactor"><article><small>ANTES</small><strong>concatenação + escapes + espaços manuais</strong><span>difícil revisar e fácil quebrar formato</span></article><ArrowRight/><article className="after"><small>DEPOIS</small><strong>text block parecido com o documento real</strong><span>formato visível no código e no diff</span></article></div></section>; }

const ERRORS = [
  ['Abertura na mesma linha', 'Três aspas e conteúdo aparecem juntos.', 'Quebre a linha logo após o delimitador.'],
  ['Quebra final esquecida', 'Comparação ou tamanho ganha um caractere.', 'Inspecione e use strip quando o contrato exigir.'],
  ['JSON dinâmico manual', 'Aspas do valor quebram o payload.', 'Use biblioteca de serialização.'],
  ['SQL inseguro', 'Entrada do usuário entra por formatted.', 'Use parâmetros preparados.'],
  ['Placeholders demais', 'A ordem dos %s fica indecifrável.', 'Use DTO, template ou método menor.'],
  ['Indentação confundida', 'Espaços do código viram surpresa no texto.', 'Entenda margem incidental e delimitador final.'],
  ['String curta', 'Três aspas aumentam ruído.', 'Mantenha literal simples.'],
  ['Template gigante', 'Conteúdo domina a classe Java.', 'Mova para arquivo ou template engine.'],
  ['Tabs e espaços', 'Alinhamento varia entre ferramentas.', 'Padronize espaços e valide o valor.'],
  ['Biblioteca substituída', 'Text block tenta serializar, escapar ou traduzir.', 'Use ferramenta especializada.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors tb84-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20}/><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16}/><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['abertura após quebra de linha', 'tipo String confirmado', 'quebra final observada', 'strip aplicado com intenção', 'indentação incidental explicada', 'aspas internas preservadas', 'formatted limitado e ordenado', 'JSON dinâmico delegado', 'SQL manteve parâmetro ?', 'sete domínios comparados'];
function DeliveryLab() { const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]); const commands = ['mkdir labs\\m2\\aula-084-text-blocks', 'cd labs\\m2\\aula-084-text-blocks', 'java -version', 'javac -version', 'javac LaboratorioTextBlocks.java', 'java LaboratorioTextBlocks'].join('\n'); return <section className="ln73-delivery"><CodePanel name="LaboratorioTextBlocks.java" code={MAIN_PROGRAM}/><div className="ln73-terminal"><header><Terminal size={15}/>Verificar, compilar e executar<CopyButton value={commands}/></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{ '\n\n' }<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18}/><strong>Debug: veja caracteres, não só aparência</strong></header><div><article><span>1</span><strong>Breakpoint</strong><p>Pare antes do println.</p></article><article><span>2</span><strong>Conteúdo</strong><p>Expanda json na IDE.</p></article><article><span>3</span><strong>Quebras</strong><p>Observe cada \n e espaços.</p></article><article><span>4</span><strong>Comparação</strong><p>Confira length e strip.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14}/> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22}/><h3>Desafio: kit de evidências de uma OS</h3></div><p>Crie um SQL parametrizado, um JSON fixo de teste e uma mensagem multiline para a mesma ordem de serviço.</p><ul><li>Mostre a quebra final antes e depois de strip.</li><li>Use formatted apenas na mensagem controlada.</li><li>Provoque um nome com aspas e explique por que Jackson seria necessário.</li><li>Registre indentação, saída e limites no README.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16}/>README.md · evidências<CopyButton value={EVIDENCE}/></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>; }

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { syntax: SyntaxLab, newline: NewlineLab, indentation: IndentationLab, escapes: EscapeLab, json: JsonLab, documents: DocumentLab, domains: DomainLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component/> : null; }
const steps = [
  { id: 'syntax', label: 'Três Aspas, uma String', duration: '11 min', eyebrow: 'SINTAXE E TIPO', title: 'Abra o bloco corretamente e mantenha a API de String', blocks: [{ type: 'lead', text: 'Text block é um literal multilinha de String. A abertura exige três aspas seguidas de quebra de linha.' }, { type: 'syntax' }] },
  { id: 'newline', label: 'Quebra Final e Strip', duration: '12 min', eyebrow: 'CARACTERE INVISÍVEL', title: 'Enxergue o \n que participa do valor', blocks: [{ type: 'lead', text: 'O delimitador em uma nova linha normalmente deixa uma quebra final. Tamanho, comparação e protocolo podem percebê-la.' }, { type: 'newline' }] },
  { id: 'indentation', label: 'Indentação Incidental', duration: '14 min', eyebrow: 'MARGEM E CONTEÚDO', title: 'Alinhe o Java sem vazar espaços para o documento', blocks: [{ type: 'lead', text: 'O compilador remove a margem comum. stripIndent ajusta texto recebido; indent adiciona deslocamento deliberado.' }, { type: 'indentation' }] },
  { id: 'escapes', label: 'Aspas e Escapes', duration: '11 min', eyebrow: 'CONTEÚDO LITERAL', title: 'Simplifique aspas sem esquecer barras e escapes', blocks: [{ type: 'lead', text: 'Aspas comuns ficam naturais dentro do bloco, mas \n, \t, barra invertida e outros escapes continuam ativos.' }, { type: 'escapes' }] },
  { id: 'json', label: 'JSON e Formatted', duration: '15 min', eyebrow: 'PLACEHOLDERS SEM SERIALIZAÇÃO', title: 'Use payload fixo em testes sem fingir que formatted escapa dados', blocks: [{ type: 'lead', text: 'Text block melhora a forma; formatted só substitui. Valores reais com aspas, barras e Unicode pedem biblioteca JSON.' }, { type: 'json' }] },
  { id: 'documents', label: 'SQL, HTML e Mensagens', duration: '14 min', eyebrow: 'DOCUMENTOS MULTILINHA', title: 'Melhore leitura sem substituir segurança e templates', blocks: [{ type: 'lead', text: 'SQL deve manter parâmetros, HTML complexo pede engine e mensagens traduzidas pedem i18n. O bloco não fornece essas garantias.' }, { type: 'documents' }] },
  { id: 'domains', label: 'Text Blocks no Backend', duration: '15 min', eyebrow: 'SETE DOMÍNIOS', title: 'Refatore concatenação onde o formato realmente importa', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria mostram JSON de teste, SQL e relatórios simples.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Encontre quebra invisível, injection e templates fora de lugar', blocks: [{ type: 'lead', text: 'Legibilidade não é serialização, segurança, escaping, tradução ou modelagem. Cada falha pede uma ferramenta diferente.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '30 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove conteúdo, caracteres e limites profissionais', blocks: [{ type: 'lead', text: 'Compile, confira nove saídas, inspecione os caracteres e entregue JSON de teste, SQL parametrizado e mensagem controlada.' }, { type: 'delivery' }] },
];

export default function GuidedTextBlocksLesson084({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) { const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false); const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } }); useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]); useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]); useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]); const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone; const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); }; return <article className="guided-git-lesson guided-text-blocks-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><TextQuote size={17}/>Oficina de textos Java</span><p className="guided-sequence">084 · M2.23</p><h1>Text blocks</h1><p>Escreva documentos multilinha legíveis, enxergue indentação e quebras, e preserve as fronteiras de segurança.</p></div><div className="guided-hero-status"><Clock3 size={42}/><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 084" items={[{ value: '3 aspas', label: 'Uma String multilinha' }, { value: '4 formatos', label: 'JSON, SQL, HTML e mensagem' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]}/><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 084"><div className="guided-step-nav-title"><ListChecks size={18}/>Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14}/> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16}/>Desmarcar etapa</> : <><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Texto legível com limites profissionais</h3><p>{lessonComplete ? 'Aula concluída e pronta para exceptions por baixo.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 083</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18}/><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>multilinha, indentação e segurança</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 085<ArrowRight size={17}/></button></footer></article>; }
