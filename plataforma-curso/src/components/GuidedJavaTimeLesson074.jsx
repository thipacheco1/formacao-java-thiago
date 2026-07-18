import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, Copy, FileCode2, Lightbulb, ListChecks, Play, RotateCcw, Sparkles, Terminal, Timer, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedJavaTimeLesson.css';

const STORAGE_KEY = 'guided-java-time-lesson-074-progress';
const MAIN_PROGRAM = `import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;

public class LaboratorioJavaTime {
    static final DateTimeFormatter DATA_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    static final DateTimeFormatter DATA_HORA_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public static void main(String[] args) {
        LocalDate data = LocalDate.of(2026, 7, 7);
        LocalTime hora = LocalTime.of(14, 30);
        LocalDateTime dataHora = LocalDateTime.of(data, hora);
        System.out.println("data: " + data);
        System.out.println("hora: " + hora);
        System.out.println("dataHora: " + dataHora);

        data.plusDays(3);
        System.out.println("sem capturar: " + data);
        System.out.println("capturando: " + data.plusDays(3));
        System.out.println("amanha: " + data.plusDays(1));
        System.out.println("semana: " + data.plusWeeks(1));
        System.out.println("mes: " + data.plusMonths(1));
        System.out.println("ontem: " + data.minusDays(1));
        System.out.println("hora mais 1: " + hora.plusHours(1));
        System.out.println("hora menos 15: " + hora.minusMinutes(15));

        LocalDate vencimento = LocalDate.of(2026, 7, 6);
        System.out.println("vencido: " + vencimento.isBefore(data));
        System.out.println("depois: " + data.plusDays(3).isAfter(data));
        System.out.println("igual: " + data.isEqual(LocalDate.of(2026, 7, 7)));

        Period idade = Period.between(LocalDate.of(1990, 5, 20), data);
        System.out.println("period: " + idade.getYears() + "a " + idade.getMonths() + "m " + idade.getDays() + "d");
        Duration duracao = Duration.between(LocalDateTime.of(2026, 7, 7, 10, 0), LocalDateTime.of(2026, 7, 7, 12, 30));
        System.out.println("duration minutos: " + duracao.toMinutes());
        System.out.println("duration horas: " + duracao.toHours());

        System.out.println("format data: " + data.format(DATA_BR));
        System.out.println("parse data: " + LocalDate.parse("07/07/2026", DATA_BR));
        System.out.println("format dataHora: " + dataHora.withSecond(15).format(DATA_HORA_BR));
        System.out.println("partes: " + data.getYear() + " | " + data.getMonth() + " | " + data.getDayOfWeek() + " | " + data.getDayOfYear());
        System.out.println("pedido entrega: " + data.plusDays(5).format(DATA_BR));
        System.out.println("pagamento vence: " + data.plusDays(30).format(DATA_BR));
        System.out.println("janela envio: " + podeEnviar(LocalTime.of(10, 30)));
    }

    static boolean podeEnviar(LocalTime horario) {
        LocalTime inicio = LocalTime.of(8, 0);
        LocalTime fim = LocalTime.of(20, 0);
        return !horario.isBefore(inicio) && !horario.isAfter(fim);
    }
}`;
const EXPECTED_OUTPUT = `data: 2026-07-07
hora: 14:30
dataHora: 2026-07-07T14:30
sem capturar: 2026-07-07
capturando: 2026-07-10
amanha: 2026-07-08
semana: 2026-07-14
mes: 2026-08-07
ontem: 2026-07-06
hora mais 1: 15:30
hora menos 15: 14:15
vencido: true
depois: true
igual: true
period: 36a 1m 17d
duration minutos: 150
duration horas: 2
format data: 07/07/2026
parse data: 2026-07-07
format dataHora: 07/07/2026 14:30:15
partes: 2026 | JULY | TUESDAY | 188
pedido entrega: 12/07/2026
pagamento vence: 06/08/2026
janela envio: true`;
const EVIDENCE = `# Aula 074 — java.time básico

- [ ] Escolhi LocalDate, LocalTime ou LocalDateTime pela regra
- [ ] Expliquei ausência de timezone nos três tipos
- [ ] Capturei o retorno das operações imutáveis
- [ ] Somei e subtraí datas e horários
- [ ] Comparei com isBefore, isAfter e isEqual
- [ ] Validei vencimento com data de referência recebida
- [ ] Diferenciei Period de Duration
- [ ] Formatei e fiz parse com DateTimeFormatter
- [ ] Tratei DateTimeParseException na fronteira
- [ ] Extraí partes da data
- [ ] Apliquei em sete domínios
- [ ] Compilei, depurei, documentei e revisei o diff`;

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

const TYPES = [
  ['LocalDate', '2026-07-07', 'data sem hora e sem timezone', 'nascimento, vencimento, entrega'],
  ['LocalTime', '14:30', 'hora sem data e sem timezone', 'abertura, turno, janela diária'],
  ['LocalDateTime', '2026-07-07T14:30', 'data e hora locais, sem timezone', 'agendamento local, registro local'],
];
function TypeLab() { const [selected, setSelected] = useState(0); const item = TYPES[selected]; return <section className="ln73-stack"><div className="jt74-types">{TYPES.map((type, index) => <button type="button" key={type[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{type[0]}</strong><code>{type[1]}</code></button>)}</div><div className="ln73-showroom"><article><small>TIPO ESCOLHIDO</small><strong>{item[0]}</strong><span>{item[2]}</span></article><ArrowRight /><article className="active"><small>USO ADEQUADO</small><strong>{item[3]}</strong><span>String fica na entrada e saída</span></article></div><CodePanel name="Criação explícita" code={selected === 0 ? 'LocalDate data = LocalDate.of(2026, 7, 7);\nLocalDate hoje = LocalDate.now();' : selected === 1 ? 'LocalTime hora = LocalTime.of(14, 30);\nLocalTime agora = LocalTime.now();' : 'LocalDateTime agenda = LocalDateTime.of(2026, 7, 7, 14, 30);\nLocalDateTime agora = LocalDateTime.now();'} /><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>LocalDateTime não é instante global</strong><p>Ele não carrega fuso ou offset. UTC, Instant e ZoneId chegam na próxima aula.</p></div></aside></section>; }

function ArithmeticLab() { const [days, setDays] = useState(3); const [captured, setCaptured] = useState(true); const day = 7 + days; return <section className="ln73-stack"><div className="jt74-date-line"><article><small>ORIGINAL</small><strong>07/07/2026</strong></article><ArrowRight /><article><code>plusDays({days})</code><span>novo objeto</span></article><ArrowRight /><article className={captured ? 'safe' : 'danger'}><small>{captured ? 'RETORNO CAPTURADO' : 'RETORNO IGNORADO'}</small><strong>{captured ? String(day).padStart(2, '0') : '07'}/07/2026</strong></article></div><label className="jt74-range">Dias: <strong>{days}</strong><input type="range" min="-5" max="10" value={days} onChange={event => setDays(Number(event.target.value))} /></label><button type="button" className="ln73-toggle" onClick={() => setCaptured(value => !value)}>{captured ? 'Ignorar retorno' : 'Capturar nova data'}</button><div className="jt74-compare"><article><code>vencimento.isBefore(referência)</code><strong>true → vencido</strong></article><article><code>novaData.isAfter(data)</code><strong>true → futuro</strong></article><article><code>data.isEqual(outra)</code><strong>true → mesma data</strong></article></div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Receba a referência</strong><p>Uma regra testável usa <code>estaVencido(vencimento, hoje)</code> em vez de espalhar <code>LocalDate.now()</code> internamente.</p></div></aside></section>; }

function DifferenceLab() { const [mode, setMode] = useState('period'); return <section className="ln73-stack"><div className="jt74-mode"><button type="button" className={mode === 'period' ? 'active' : ''} onClick={() => setMode('period')}>Period</button><button type="button" className={mode === 'duration' ? 'active' : ''} onClick={() => setMode('duration')}>Duration</button></div>{mode === 'period' ? <div className="jt74-difference"><CalendarDays size={34} /><small>1990-05-20 → 2026-07-07</small><strong>36 anos · 1 mês · 17 dias</strong><span>calendário: idade, datas e prazos</span></div> : <div className="jt74-difference"><Timer size={34} /><small>10:00 → 12:30</small><strong>150 minutos · 2 horas completas</strong><span>linha de tempo local: SLA, execução e atendimento</span></div>}<CodePanel name={mode === 'period' ? 'Period para idade' : 'Duration para tempo'} code={mode === 'period' ? 'Period idade = Period.between(nascimento, referencia);\nint anos = idade.getYears();' : 'Duration duracao = Duration.between(inicio, fim);\nlong minutos = duracao.toMinutes();'} /><p className="ln73-format-proof"><strong>Period</strong> mede anos/meses/dias do calendário; <strong>Duration</strong> mede horas/minutos/segundos/nanos. Um não é atalho do outro.</p></section>; }

const PARSE_CASES = ['07/07/2026', '2026-07-07', '31/02/2026', '', '07-07-2026'];
function FormatParseLab() { const [input, setInput] = useState(PARSE_CASES[0]); const valid = /^\d{2}\/\d{2}\/\d{4}$/.test(input) && input !== '31/02/2026'; return <section className="ln73-stack"><div className="ln73-parse-cases">{PARSE_CASES.map(value => <button type="button" key={value || 'blank'} className={input === value ? 'active' : ''} onClick={() => setInput(value)}>{value || '(vazio)'}</button>)}</div><div className="ln73-parse-flow"><article><small>STRING</small><strong>"{input}"</strong></article><ArrowRight /><article><small>FORMATTER</small><code>dd/MM/yyyy</code></article><ArrowRight /><article className={valid ? 'safe' : 'danger'}><small>LOCALDATE</small><strong>{valid ? input.split('/').reverse().join('-') : 'DateTimeParseException'}</strong></article></div><CodePanel name="Parse obrigatório e formatação" code={`static final DateTimeFormatter DATA_BR = DateTimeFormatter.ofPattern("dd/MM/yyyy");\n\nstatic LocalDate lerObrigatoria(String texto, String campo) {\n    if (texto == null || texto.isBlank()) throw new IllegalArgumentException(campo + " é obrigatória.");\n    try { return LocalDate.parse(texto.trim(), DATA_BR); }\n    catch (DateTimeParseException erro) {\n        throw new IllegalArgumentException(campo + " deve estar em dd/MM/yyyy.");\n    }\n}\n\nString exibida = data.format(DATA_BR);`} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>DateTimeFormatter pode ser centralizado</strong><p>Ele é imutável e seguro para reuso, diferente do NumberFormat mutável da aula anterior.</p></div></aside></section>; }

const DOMAINS = [
  ['Cliente', '20/05/1990 → 36 anos', 'LocalDate + Period; nascimento futuro é inválido'],
  ['Produto', 'validade 10/07/2026', 'isBefore decide vencimento pela referência'],
  ['Pedido', '07/07 + 5 dias → 12/07', 'prazo não negativo e plusDays capturado'],
  ['Pagamento', '07/07 + 30 dias → 06/08', 'vencimento é LocalDate'],
  ['Ordem de serviço', '10/07/2026 às 14:30', 'LocalDate e LocalTime separados ou LocalDateTime'],
  ['Mensageria', 'janela 08:00..20:00', 'LocalTime e limites inclusivos'],
  ['Auditoria', '07/07/2026 14:30:15', 'didático local; produção distribuída pede Instant'],
];
function DomainLab() { const [selected, setSelected] = useState(0); const item = DOMAINS[selected]; return <section className="ln73-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>TIPO TEMPORAL NO DOMÍNIO</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Partes disponíveis</strong><span>getYear, getMonth, getMonthValue, getDayOfMonth, getDayOfWeek e getDayOfYear ajudam relatórios sem converter a data em String.</span></div></article></section>; }

const ERRORS = [
  ['String como data', 'Comparação, soma e validação ficam espalhadas.', 'Use o tipo java.time correspondente no domínio.'],
  ['Retorno de plusDays ignorado', 'A data parece não avançar.', 'Capture o novo objeto imutável.'],
  ['LocalDateTime como instante', 'O mesmo horário é interpretado globalmente sem fuso.', 'Use Instant/ZoneId quando a regra for global.'],
  ['Period para horas', 'Unidade de calendário mede SLA temporal.', 'Use Duration.'],
  ['Duration para idade', 'Horas não representam anos de calendário.', 'Use Period entre datas.'],
  ['Formatter incompatível', 'yyyy-MM-dd entra em dd/MM/yyyy.', 'Alinhe contrato do texto e padrão.'],
  ['ParseException solta', 'Entrada externa quebra sem mensagem útil.', 'Traduza DateTimeParseException na fronteira.'],
  ['now espalhado', 'Teste muda conforme o relógio real.', 'Receba a data de referência por parâmetro.'],
  ['Regra temporal ausente', 'Nascimento futuro ou prazo negativo passa.', 'Valide o domínio depois do parse.'],
  ['Hora dentro de LocalDate', 'Código procura informação que o tipo não contém.', 'Escolha LocalTime ou LocalDateTime.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['três tipos temporais foram diferenciados','plusDays preservou o original','datas e horários foram deslocados','comparações expressaram a regra','Period calculou idade','Duration calculou 150 minutos','parse e format foram inversos','formatter foi centralizado','sete domínios usaram tipos corretos','now foi substituído por referência fixa'];
function DeliveryLab() { const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]); const commands = 'mkdir labs\\m2\\aula-074-java-time\ncd labs\\m2\\aula-074-java-time\njavac LaboratorioJavaTime.java\njava LaboratorioJavaTime'; return <section className="ln73-delivery"><CodePanel name="LaboratorioJavaTime.java" code={MAIN_PROGRAM} /><div className="ln73-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18} /><strong>Debug: texto, objeto e nova data</strong></header><div><article><span>1</span><strong>Antes do parse</strong><p>texto = 07/07/2026 e formatter dd/MM/yyyy.</p></article><article><span>2</span><strong>Depois do parse</strong><p>LocalDate = 2026-07-07.</p></article><article><span>3</span><strong>plusDays</strong><p>Original não muda; retorno vira 2026-07-10.</p></article><article><span>4</span><strong>Compare unidades</strong><p>Period usa calendário; Duration usa tempo.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: agenda de OS testável</h3></div><p>Receba data, hora e prazo como texto, converta na fronteira, valide futuro e janela de envio e calcule duração do atendimento sem chamar now dentro da regra.</p><ul><li>Use LocalDate, LocalTime e LocalDateTime com responsabilidade explícita.</li><li>Calcule prazo com data de referência injetada.</li><li>Provoque formatos inválidos e retorno ignorado.</li><li>Documente por que auditoria global ainda pede Instant.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>; }

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; if (block.type === 'types') return <TypeLab />; if (block.type === 'arithmetic') return <ArithmeticLab />; if (block.type === 'difference') return <DifferenceLab />; if (block.type === 'format') return <FormatParseLab />; if (block.type === 'domains') return <DomainLab />; if (block.type === 'errors') return <ErrorsClinic />; if (block.type === 'delivery') return <DeliveryLab />; return null; }
const steps = [
  { id: 'types', label: 'Mapa dos Tipos Temporais', duration: '12 min', eyebrow: 'DATA, HORA OU AMBOS', title: 'Escolha um tipo que contenha exatamente a regra', blocks: [{ type: 'lead', text: 'LocalDate, LocalTime e LocalDateTime representam valores locais diferentes. Nenhum carrega timezone; String fica apenas na entrada e saída.' }, { type: 'types' }] },
  { id: 'arithmetic', label: 'Imutabilidade e Comparação', duration: '13 min', eyebrow: 'NOVO OBJETO E REFERÊNCIA FIXA', title: 'Capture o prazo e compare com intenção legível', blocks: [{ type: 'lead', text: 'plus e minus retornam novos objetos. isBefore, isAfter e isEqual transformam datas em regras claras e testáveis.' }, { type: 'arithmetic' }] },
  { id: 'difference', label: 'Period versus Duration', duration: '11 min', eyebrow: 'CALENDÁRIO OU TEMPO', title: 'Meça idade e SLA com unidades diferentes', blocks: [{ type: 'lead', text: 'Period descreve anos, meses e dias de calendário. Duration descreve horas, minutos, segundos e nanos entre valores temporais.' }, { type: 'difference' }] },
  { id: 'format', label: 'Format e Parse', duration: '13 min', eyebrow: 'STRING NA FRONTEIRA', title: 'Faça texto e formatter assinarem o mesmo contrato', blocks: [{ type: 'lead', text: 'DateTimeFormatter transforma tipos temporais em texto e lê texto de volta. Formato incompatível ou data impossível gera DateTimeParseException.' }, { type: 'format' }] },
  { id: 'domains', label: 'Tempo no Backend', duration: '13 min', eyebrow: 'SETE DOMÍNIOS', title: 'Aplique prazo, validade, janela e idade sem Strings soltas', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria exigem tipos e validações temporais próprios.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Corrija tipo, unidade, relógio ou fronteira', blocks: [{ type: 'lead', text: 'String, imutabilidade, timezone, Period, Duration, parse e now espalhado falham por causas diferentes.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '25 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove datas e durações com um relógio determinístico', blocks: [{ type: 'lead', text: 'Compile o laboratório, confira vinte e quatro saídas, depure parse e imutabilidade e entregue uma agenda testável.' }, { type: 'delivery' }] },
];
export default function GuidedJavaTimeLesson074({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) { const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false); const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } }); useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]); useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]); useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]); const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone; const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); }; return <article className="guided-git-lesson guided-java-time-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><CalendarDays size={17} />Laboratório de tipos temporais</span><p className="guided-sequence">074 · M2.13</p><h1>java.time básico</h1><p>Modele datas e horas com tipos próprios, calcule prazos sem mutação e deixe String apenas nas fronteiras.</p></div><div className="guided-hero-status"><Clock3 size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 074" items={[{ value: '5 tipos', label: 'Temporais diferenciados' }, { value: '7 domínios', label: 'Com regras de tempo' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 074"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item,index)=><button type="button" key={item.id} className={`${index===activeIndex?'active ':''}${completedSteps.has(item.id)?'done':''}`} onClick={()=>selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id)?<Check size={14}/>:String(index+1).padStart(2,'0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block,index)=><ContentBlock key={`${block.type}-${index}`} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex===0} onClick={()=>selectStep(activeIndex-1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone?'undo':'complete'}`} onClick={toggleStep}>{stepDone?<><RotateCcw size={16}/>Desmarcar etapa</>:<><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex<steps.length-1&&<button type="button" className="primary" disabled={!stepDone} onClick={()=>selectStep(activeIndex+1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone&&<section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Tempo modelado por tipos</h3><p>{lessonComplete?'Aula concluída e pronta para timezone e Instant.':'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete?'Reabrir aula':'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 073</button><div className={`guided-course-status ${lessonComplete?'completed':allStepsDone?'ready':''}`}><Clock3 size={18}/><span><strong>{lessonComplete?'Aula concluída':`${completedSteps.size} de ${steps.length} etapas`}</strong><small>datas, horas, Period e Duration</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson||!lessonComplete}>Aula 075<ArrowRight size={17}/></button></footer></article>; }
