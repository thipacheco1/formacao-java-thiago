import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy, FileCode2, Globe2, Lightbulb, ListChecks, Play, RotateCcw, Server, Sparkles, Terminal, Timer, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedTimezoneInstantLesson.css';

const STORAGE_KEY = 'guided-timezone-instant-lesson-075-progress';
const MAIN_PROGRAM = [
  'import java.time.*;',
  'import java.time.format.DateTimeFormatter;',
  '',
  'public class LaboratorioTimezone {',
  '    static final ZoneId SP = ZoneId.of("America/Sao_Paulo");',
  '    static final ZoneId NY = ZoneId.of("America/New_York");',
  '    static final ZoneId TOKYO = ZoneId.of("Asia/Tokyo");',
  '    static final DateTimeFormatter VISOR =',
  '            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm XXX VV");',
  '',
  '    public static void main(String[] args) {',
  '        Instant evento = Instant.parse("2026-07-07T17:30:00Z");',
  '        System.out.println("instant: " + evento);',
  '        System.out.println("sao paulo: " + VISOR.format(evento.atZone(SP)));',
  '        System.out.println("nova york: " + VISOR.format(evento.atZone(NY)));',
  '        System.out.println("toquio: " + VISOR.format(evento.atZone(TOKYO)));',
  '',
  '        LocalDateTime local = LocalDateTime.of(2026, 7, 7, 14, 30);',
  '        ZonedDateTime agendaSp = local.atZone(SP);',
  '        System.out.println("agenda local: " + local);',
  '        System.out.println("agenda instant: " + agendaSp.toInstant());',
  '        System.out.println("mesmo instant NY: "',
  '                + VISOR.format(agendaSp.withZoneSameInstant(NY)));',
  '',
  '        OffsetDateTime payload = evento.atOffset(ZoneOffset.of("-03:00"));',
  '        System.out.println("payload offset: " + payload);',
  '        System.out.println("payload instant: " + payload.toInstant());',
  '        Instant fim = evento.plus(Duration.ofMinutes(150));',
  '        System.out.println("duracao minutos: "',
  '                + Duration.between(evento, fim).toMinutes());',
  '',
  '        Instant expiraEm = evento.plus(Duration.ofHours(1));',
  '        Clock noPrazo = Clock.fixed(evento, ZoneOffset.UTC);',
  '        Clock atrasado = Clock.fixed(',
  '                evento.plus(Duration.ofHours(2)), ZoneOffset.UTC);',
  '        System.out.println("agora fixo: " + Instant.now(noPrazo));',
  '        System.out.println("expirado agora: " + expirou(expiraEm, noPrazo));',
  '        System.out.println("expirado depois: " + expirou(expiraEm, atrasado));',
  '    }',
  '',
  '    static boolean expirou(Instant expiraEm, Clock clock) {',
  '        if (expiraEm == null || clock == null) {',
  '            throw new IllegalArgumentException(',
  '                    "Expiração e relógio são obrigatórios.");',
  '        }',
  '        return Instant.now(clock).isAfter(expiraEm);',
  '    }',
  '}',
].join('\n');
const EXPECTED_OUTPUT = [
  'instant: 2026-07-07T17:30:00Z',
  'sao paulo: 2026-07-07 14:30 -03:00 America/Sao_Paulo',
  'nova york: 2026-07-07 13:30 -04:00 America/New_York',
  'toquio: 2026-07-08 02:30 +09:00 Asia/Tokyo',
  'agenda local: 2026-07-07T14:30',
  'agenda instant: 2026-07-07T17:30:00Z',
  'mesmo instant NY: 2026-07-07 13:30 -04:00 America/New_York',
  'payload offset: 2026-07-07T14:30-03:00',
  'payload instant: 2026-07-07T17:30:00Z',
  'duracao minutos: 150',
  'agora fixo: 2026-07-07T17:30:00Z',
  'expirado agora: false',
  'expirado depois: true',
].join('\n');
const EVIDENCE = [
  '# Aula 075 — Timezone e Instant', '',
  '- [ ] Diferenciei horário local de instante global',
  '- [ ] Interpretei UTC e o sufixo Z',
  '- [ ] Converti um Instant para três ZoneId',
  '- [ ] Diferenciei ZoneId de ZoneOffset',
  '- [ ] Expliquei atribuir zona versus converter visão',
  '- [ ] Escolhi Instant, ZonedDateTime ou OffsetDateTime',
  '- [ ] Armazenei auditoria em UTC e formatei na exibição',
  '- [ ] Calculei Duration entre instantes',
  '- [ ] Testei expiração com Clock.fixed',
  '- [ ] Apliquei o modelo em sete domínios',
  '- [ ] Compilei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

const ZONES = [
  ['America/Sao_Paulo', '07 JUL · 14:30', '-03:00'],
  ['America/New_York', '07 JUL · 13:30', '-04:00'],
  ['UTC', '07 JUL · 17:30', 'Z'],
  ['Asia/Tokyo', '08 JUL · 02:30', '+09:00'],
];
function TimelineLab() {
  const [selected, setSelected] = useState(0);
  const code = ['Instant evento = Instant.parse("2026-07-07T17:30:00Z");', 'ZonedDateTime local = evento.atZone(', '        ZoneId.of("' + ZONES[selected][0] + '"));', 'System.out.println(local);'].join('\n');
  return <section className="tz75-stack"><div className="tz75-question"><strong>07/07/2026 10:00</strong><span>10:00 onde?</span><AlertTriangle size={22} /></div><div className="tz75-timeline"><div className="tz75-line"><span /><b>2026-07-07T17:30:00Z</b><span /></div><p>um ponto único na linha do tempo</p><div className="tz75-zone-grid">{ZONES.map((zone, index) => <button type="button" key={zone[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><small>{zone[0]}</small><strong>{zone[1]}</strong><span>{zone[2]}</span></button>)}</div></div><CodePanel name="Mesmo instante, relógios diferentes" code={code} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>O relógio muda; o evento não</strong><p><code>Instant</code> guarda o ponto global. <code>ZoneId</code> decide como ele aparece numa região.</p></div></aside></section>;
}
function ZoneRulesLab() {
  const [region, setRegion] = useState(true);
  const code = region ? ['ZoneId zona = ZoneId.of("America/Sao_Paulo");', 'ZonedDateTime local = instante.atZone(zona);'].join('\n') : ['ZoneOffset offset = ZoneOffset.of("-03:00");', 'OffsetDateTime payload = instante.atOffset(offset);'].join('\n');
  return <section className="tz75-stack"><div className="tz75-switch"><button type="button" className={region ? 'active' : ''} onClick={() => setRegion(true)}>ZoneId de região</button><button type="button" className={!region ? 'active' : ''} onClick={() => setRegion(false)}>ZoneOffset fixo</button></div><div className="tz75-rules"><Globe2 size={42} /><div><small>{region ? 'REGRA REGIONAL' : 'DIFERENÇA FIXA'}</small><strong>{region ? 'America/Sao_Paulo' : '-03:00'}</strong><p>{region ? 'Nome, regras históricas e futuras, inclusive mudanças legais.' : 'Apenas três horas atrás do UTC; não identifica país nem histórico.'}</p></div></div><CodePanel name="Região ou offset" code={code} /><p className="ln73-format-proof"><strong>Escolha profissional:</strong> região quando a regra local importa; offset quando esse é o contrato da API; Instant para o evento global.</p></section>;
}
function ConversionLab() {
  const [assign, setAssign] = useState(true);
  const assignCode = ['LocalDateTime local = LocalDateTime.of(2026, 7, 7, 14, 30);', 'ZonedDateTime emSp = local.atZone(', '        ZoneId.of("America/Sao_Paulo"));', 'Instant global = emSp.toInstant();'].join('\n');
  const convertCode = ['ZonedDateTime emNy = emSp.withZoneSameInstant(', '        ZoneId.of("America/New_York"));', '// 14:30 SP e 13:30 NY são os mesmos 17:30Z'].join('\n');
  return <section className="tz75-stack"><div className="tz75-switch"><button type="button" className={assign ? 'active' : ''} onClick={() => setAssign(true)}>LocalDateTime.atZone</button><button type="button" className={!assign ? 'active' : ''} onClick={() => setAssign(false)}>withZoneSameInstant</button></div><div className="tz75-flow">{assign ? <><article><small>SEM ZONA</small><strong>07 JUL · 14:30</strong><code>LocalDateTime</code></article><ArrowRight /><article className="decision"><small>ASSUMA A REGIÃO</small><strong>São Paulo</strong><code>atZone</code></article><ArrowRight /><article className="safe"><small>INSTANTE</small><strong>17:30Z</strong><code>toInstant</code></article></> : <><article><small>VISÃO EM SP</small><strong>14:30 -03:00</strong><code>17:30Z</code></article><ArrowRight /><article className="decision"><small>PRESERVE</small><strong>17:30Z</strong><code>withZoneSameInstant</code></article><ArrowRight /><article className="safe"><small>VISÃO EM NY</small><strong>13:30 -04:00</strong><code>17:30Z</code></article></>}</div><CodePanel name="Atribuir contexto versus converter visão" code={assign ? assignCode : convertCode} /><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Atribuir zona não é converter</strong><p><code>LocalDateTime.atZone</code> afirma onde a hora local aconteceu. Só depois existe um instante global.</p></div></aside></section>;
}

const TYPES = [
  ['Instant', '2026-07-07T17:30:00Z', 'evento, log, auditoria e ordem global'],
  ['ZonedDateTime', '14:30-03:00[America/Sao_Paulo]', 'agenda cuja região deve permanecer'],
  ['OffsetDateTime', '14:30-03:00', 'payload com offset explícito'],
  ['LocalDateTime', '2026-07-07T14:30', 'hora local ainda sem região'],
];
function ContractsLab() {
  const [selected, setSelected] = useState(0); const item = TYPES[selected];
  const code = ['Instant global = Instant.parse("2026-07-07T17:30:00Z");', 'ZonedDateTime regional = global.atZone(ZoneId.of("America/Sao_Paulo"));', 'OffsetDateTime payload = global.atOffset(ZoneOffset.of("-03:00"));', 'LocalDateTime parede = regional.toLocalDateTime();'].join('\n');
  return <section className="tz75-stack"><div className="tz75-contracts">{TYPES.map((row, index) => <button type="button" key={row[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{row[0]}</strong><code>{row[1]}</code></button>)}</div><div className="ln73-showroom"><article><small>TIPO</small><strong>{item[0]}</strong><span>{item[1]}</span></article><ArrowRight /><article className="active"><small>COMUNICA</small><strong>{item[2]}</strong><span>String é representação, não modelo</span></article></div><CodePanel name="Quatro contratos temporais" code={code} /></section>;
}
function StorageLab() {
  const [zone, setZone] = useState('America/Sao_Paulo'); const view = zone === 'UTC' ? '07/07/2026 17:30:00 UTC' : zone === 'Europe/London' ? '07/07/2026 18:30:00 BST' : '07/07/2026 14:30:00 BRT';
  const code = ['DateTimeFormatter visor = DateTimeFormatter', '        .ofPattern("dd/MM/yyyy HH:mm:ss z")', '        .withZone(zonaDoUsuario);', 'String texto = visor.format(registro.criadoEm);', '// criadoEm continua sendo Instant'].join('\n');
  return <section className="tz75-stack"><div className="tz75-pipeline"><article><Server size={24} /><small>BACKEND / BANCO</small><strong>2026-07-07T17:30:00Z</strong><span>Instant preservado em UTC</span></article><ArrowRight /><article><Globe2 size={24} /><small>APRESENTAÇÃO</small><select value={zone} onChange={event => setZone(event.target.value)}><option>America/Sao_Paulo</option><option>Europe/London</option><option>UTC</option></select><strong>{view}</strong></article></div><CodePanel name="Armazenar uma vez, apresentar por zona" code={code} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Persistência e exibição são responsabilidades distintas</strong><p>O registro permanece comparável globalmente; só a apresentação recebe a zona do usuário.</p></div></aside></section>;
}
function ClockLab() {
  const [minutes, setMinutes] = useState(0); const total = 30 + minutes; const expired = minutes > 60;
  const code = ['Clock producao = Clock.systemUTC();', 'Instant agoraReal = Instant.now(producao);', '', 'Clock clock = Clock.fixed(', '        Instant.parse("2026-07-07T17:30:00Z"), ZoneOffset.UTC);', 'Instant agoraDoTeste = Instant.now(clock);', 'boolean expirado = agoraDoTeste.isAfter(expiraEm);', 'Duration fila = Duration.between(inicio, fim);'].join('\n');
  return <section className="tz75-stack"><div className="tz75-clock"><Timer size={34} /><div><small>CRIADO 17:30Z · VALIDADE 60 MIN</small><strong>agora = {String(17 + Math.floor(total / 60)).padStart(2, '0')}:{String(total % 60).padStart(2, '0')}Z</strong><span className={expired ? 'expired' : 'valid'}>{expired ? 'EXPIRADO' : 'VÁLIDO'}</span></div></div><label className="tz75-range">Avance o relógio: <strong>{minutes} min</strong><input type="range" min="0" max="120" value={minutes} onChange={event => setMinutes(Number(event.target.value))} /></label><CodePanel name="Clock fixo torna o agora controlável" code={code} /><p className="ln73-format-proof"><strong>Duration</strong> mede fila e SLA. <strong>Clock.fixed</strong> elimina testes que mudam conforme o relógio real.</p></section>;
}

const DOMAINS = [
  ['Cliente', 'último acesso', 'Instant armazenado; ZoneId só na exibição'],
  ['Produto', 'criadoEm / atualizadoEm', 'timestamps técnicos globais'],
  ['Pedido', 'criação UTC', 'ordenação segura entre serviços'],
  ['Pagamento', 'expiração', 'Instant + Duration + Clock'],
  ['Ordem de serviço', '10:00 em São Paulo', 'LocalDateTime + ZoneId viram Instant'],
  ['Mensageria', 'janela 08:00–20:00', 'Instant convertido para hora local'],
  ['Auditoria', 'aprovação global', 'um Instant, várias apresentações'],
];
function DomainLab() { const [selected, setSelected] = useState(0); const item = DOMAINS[selected]; return <section className="ln73-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>TEMPO NO DOMÍNIO</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Pergunta do mentor</strong><span>É uma hora de parede, evento global, região ou apenas forma de exibição?</span></div></article></section>; }

const ERRORS = [
  ['LocalDateTime como UTC', 'O tipo não informa fuso nem instante.', 'Modele evento global com Instant.'],
  ['Auditoria local sem zona', 'Serviços ordenam eventos ambiguamente.', 'Persista Instant em UTC.'],
  ['atZone sempre converte', 'Hora sem zona ganha contexto incorreto.', 'Distinga LocalDateTime.atZone de Instant.atZone.'],
  ['Offset no lugar da região', 'Regras históricas são perdidas.', 'Use ZoneId quando o negócio depende do local.'],
  ['systemDefault escondido', 'Ambientes exibem horas diferentes.', 'Receba ZoneId explicitamente.'],
  ['Instant.now espalhado', 'Teste depende do relógio real.', 'Injete Clock ou receba o agora.'],
  ['UTC cru para usuário', 'A pessoa interpreta na região errada.', 'Formate com a zona adequada.'],
  ['Timestamp em String', 'Comparação vira manipulação textual.', 'Converta na fronteira.'],
  ['Ignorar DST e histórico', 'Offset falha quando regras mudam.', 'Use ZoneId de região.'],
  ['Misturar banco e tela', 'Camadas alteram o valor armazenado.', 'Guarde Instant; localize na tela.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors tz75-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label" style={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, whiteSpace: 'normal' }}>{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['Instant igual em três zonas','Z interpretado como UTC','ZoneId diferente de ZoneOffset','atZone atribuiu contexto local','withZoneSameInstant preservou evento','offset voltou ao mesmo Instant','auditoria armazenada em UTC','Duration calculou 150 minutos','Clock controlou expiração','sete domínios justificados'];
function DeliveryLab() {
  const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = ['mkdir labs\\m2\\aula-075-timezone-instant', 'cd labs\\m2\\aula-075-timezone-instant', 'javac LaboratorioTimezone.java', 'java LaboratorioTimezone'].join('\n');
  return <section className="ln73-delivery"><CodePanel name="LaboratorioTimezone.java" code={MAIN_PROGRAM} /><div className="ln73-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18} /><strong>Debug: siga o mesmo evento pelo mundo</strong></header><div><article><span>1</span><strong>Instant</strong><p>evento = 2026-07-07T17:30:00Z.</p></article><article><span>2</span><strong>ZoneId</strong><p>SP contém regras regionais.</p></article><article><span>3</span><strong>atZone</strong><p>Produz 14:30 -03:00 sem alterar o evento.</p></article><article><span>4</span><strong>Clock</strong><p>Troque o relógio fixo e observe expiração.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: agendamento internacional de OS</h3></div><p>Receba “10/07/2026 14:30” e “America/Sao_Paulo”, converta para Instant e mostre a mesma visita em Nova York e Tóquio.</p><ul><li>Recuse zona ausente ou inválida.</li><li>Preserve a ZoneId original quando a intenção local importar.</li><li>Calcule expiração com Duration e Clock.</li><li>Provoque zona errada, offset indevido e systemDefault.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { timeline: TimelineLab, zones: ZoneRulesLab, conversion: ConversionLab, contracts: ContractsLab, storage: StorageLab, clock: ClockLab, domains: DomainLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component /> : null; }
const steps = [
  { id: 'timeline', label: 'Instante Global', duration: '11 min', eyebrow: 'UTC, Z E LINHA DO TEMPO', title: 'Separe o evento global da hora do relógio', blocks: [{ type: 'lead', text: '“07/07/2026 10:00” é ambíguo sem região. Instant representa um ponto global; UTC e Z dão a referência.' }, { type: 'timeline' }] },
  { id: 'zones', label: 'Região e Offset', duration: '10 min', eyebrow: 'ZONEID NÃO É SÓ -03:00', title: 'Escolha regras regionais ou diferença fixa', blocks: [{ type: 'lead', text: 'ZoneId carrega identidade e regras históricas. ZoneOffset informa apenas uma diferença fixa do UTC.' }, { type: 'zones' }] },
  { id: 'conversion', label: 'Atribuir ou Converter', duration: '13 min', eyebrow: 'ATZONE EM CONTEXTO', title: 'Descubra o instante antes de mudar sua visão', blocks: [{ type: 'lead', text: 'LocalDateTime.atZone atribui contexto; Instant.atZone exibe um evento conhecido em outra região.' }, { type: 'conversion' }] },
  { id: 'contracts', label: 'Tipos na API', duration: '10 min', eyebrow: 'QUATRO CONTRATOS', title: 'Faça o tipo comunicar o que o payload sabe', blocks: [{ type: 'lead', text: 'Instant, ZonedDateTime, OffsetDateTime e LocalDateTime transportam informações diferentes.' }, { type: 'contracts' }] },
  { id: 'storage', label: 'UTC e Apresentação', duration: '11 min', eyebrow: 'PERSISTÊNCIA VERSUS TELA', title: 'Armazene uma vez e localize só a exibição', blocks: [{ type: 'lead', text: 'Logs e auditoria precisam ser comparáveis entre serviços. Guarde Instant e aplique ZoneId na saída.' }, { type: 'storage' }] },
  { id: 'clock', label: 'Duration e Clock', duration: '12 min', eyebrow: 'TEMPO TESTÁVEL', title: 'Meça o intervalo e controle o agora', blocks: [{ type: 'lead', text: 'Duration mede intervalos. Clock.fixed cria testes de expiração reproduzíveis.' }, { type: 'clock' }] },
  { id: 'domains', label: 'Timezone no Backend', duration: '12 min', eyebrow: 'SETE DOMÍNIOS', title: 'Aplique instante, região e duração pela regra', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria usam tempo global e local por motivos diferentes.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Encontre a informação temporal perdida', blocks: [{ type: 'lead', text: 'Defeitos parecem horários válidos, mas escondem região, offset, relógio ou conversão.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '26 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove o mesmo evento em três regiões', blocks: [{ type: 'lead', text: 'Compile, confira treze saídas, depure conversão e teste expiração com relógio fixo.' }, { type: 'delivery' }] },
];
export default function GuidedTimezoneInstantLesson075({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]);
  const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); };
  return <article className="guided-git-lesson guided-timezone-instant-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Globe2 size={17} />Laboratório de tempo global</span><p className="guided-sequence">075 · M2.14</p><h1>Timezone e Instant</h1><p>Fixe eventos na linha do tempo, converta a visão por região e teste expiração sem depender do relógio real.</p></div><div className="guided-hero-status"><Clock3 size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 075" items={[{ value: '1 instante', label: 'Visto em quatro regiões' }, { value: '4 tipos', label: 'Com contratos distintos' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 075"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item,index)=><button type="button" key={item.id} className={(index===activeIndex?'active ':'')+(completedSteps.has(item.id)?'done':'')} onClick={()=>selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id)?<Check size={14}/>:String(index+1).padStart(2,'0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block,index)=><ContentBlock key={block.type+'-'+index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex===0} onClick={()=>selectStep(activeIndex-1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle '+(stepDone?'undo':'complete')} onClick={toggleStep}>{stepDone?<><RotateCcw size={16}/>Desmarcar etapa</>:<><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex<steps.length-1&&<button type="button" className="primary" disabled={!stepDone} onClick={()=>selectStep(activeIndex+1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone&&<section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Tempo global sob controle</h3><p>{lessonComplete?'Aula concluída e pronta para Enum profissional.':'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete?'Reabrir aula':'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 074</button><div className={'guided-course-status '+(lessonComplete?'completed':allStepsDone?'ready':'')}><Clock3 size={18}/><span><strong>{lessonComplete?'Aula concluída':completedSteps.size+' de '+steps.length+' etapas'}</strong><small>UTC, zonas, Duration e Clock</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson||!lessonComplete}>Aula 076<ArrowRight size={17}/></button></footer></article>;
}
