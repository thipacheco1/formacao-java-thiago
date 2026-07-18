import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, AtSign, Check, CheckCircle2, Clock3, Copy, FileCode2, Lightbulb, ListChecks, Play, RotateCcw, Sparkles, Terminal, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedBasicAnnotationsLesson.css';

const STORAGE_KEY = 'guided-basic-annotations-lesson-080-progress';
const MAIN_PROGRAM = [
  'import java.lang.annotation.ElementType;',
  'import java.lang.annotation.Retention;',
  'import java.lang.annotation.RetentionPolicy;',
  'import java.lang.annotation.Target;',
  'import java.lang.reflect.Field;',
  '',
  'public class LaboratorioAnnotations {',
  '    public static void main(String[] args) {',
  '        ClienteTabela cliente = new ClienteTabela("Ana");',
  '        System.out.println("override: " + cliente);',
  '',
  '        Notificador notificador = new NotificadorConsole();',
  '        notificador.enviar("Pedido aprovado");',
  '',
  '        executarCompatibilidade();',
  '        System.out.println("novo: " + ServicoLegado.executarNovo());',
  '',
  '        Tabela tabela = ClienteTabela.class.getAnnotation(Tabela.class);',
  '        System.out.println("tabela: " + tabela.nome());',
  '        System.out.println("runtime: "',
  '                + ClienteTabela.class.isAnnotationPresent(Tabela.class));',
  '',
  '        for (Field campo : ClienteTabela.class.getDeclaredFields()) {',
  '            CampoObrigatorio regra = campo.getAnnotation(CampoObrigatorio.class);',
  '            if (regra != null) {',
  '                System.out.println("campo: " + campo.getName());',
  '                System.out.println("mensagem: " + regra.mensagem());',
  '            }',
  '        }',
  '    }',
  '',
  '    @SuppressWarnings("deprecation")',
  '    static void executarCompatibilidade() {',
  '        System.out.println("legado: " + ServicoLegado.executarAntigo());',
  '    }',
  '}',
  '',
  'interface Notificador { void enviar(String mensagem); }',
  '',
  'class NotificadorConsole implements Notificador {',
  '    @Override',
  '    public void enviar(String mensagem) {',
  '        System.out.println("interface: " + mensagem);',
  '    }',
  '}',
  '',
  '@Tabela(nome = "clientes")',
  'class ClienteTabela {',
  '    @CampoObrigatorio(mensagem = "Nome obrigatorio.")',
  '    private final String nome;',
  '',
  '    ClienteTabela(String nome) { this.nome = nome; }',
  '',
  '    @Override',
  '    public String toString() {',
  '        return "Cliente{nome=\'" + nome + "\'}";',
  '    }',
  '}',
  '',
  'class ServicoLegado {',
  '    @Deprecated(since = "2.0", forRemoval = false)',
  '    static String executarAntigo() { return "execucao antiga"; }',
  '    static String executarNovo() { return "execucao nova"; }',
  '}',
  '',
  '@Retention(RetentionPolicy.RUNTIME)',
  '@Target(ElementType.TYPE)',
  '@interface Tabela { String nome(); }',
  '',
  '@Retention(RetentionPolicy.RUNTIME)',
  '@Target(ElementType.FIELD)',
  '@interface CampoObrigatorio {',
  '    String mensagem() default "Campo obrigatorio.";',
  '}',
].join('\n');
const EXPECTED_OUTPUT = [
  'override: Cliente{nome=\'Ana\'}',
  'interface: Pedido aprovado',
  'legado: execucao antiga',
  'novo: execucao nova',
  'tabela: clientes',
  'runtime: true',
  'campo: nome',
  'mensagem: Nome obrigatorio.',
].join('\n');
const EVIDENCE = [
  '# Aula 080 — Annotations básicas', '',
  '- [ ] Diferenciei annotation de comentário',
  '- [ ] Usei @Override em classe e interface',
  '- [ ] Provoquei assinatura errada protegida pelo compilador',
  '- [ ] Deprequei com since, forRemoval e alternativa',
  '- [ ] Limitei @SuppressWarnings a warning e escopo específicos',
  '- [ ] Criei annotation com @interface',
  '- [ ] Diferenciei SOURCE, CLASS e RUNTIME',
  '- [ ] Restrigi uso com @Target',
  '- [ ] Li annotation de classe e campo em runtime',
  '- [ ] Expliquei que metadado exige intérprete',
  '- [ ] Apliquei annotations em sete domínios',
  '- [ ] Compilei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label='Copiar' }) { const [copied,setCopied]=useState(false); const copy=async()=>{await navigator.clipboard.writeText(value);setCopied(true);window.setTimeout(()=>setCopied(false),1400)}; return <button type="button" className="ln73-copy" onClick={copy}>{copied?<Check size={14}/>:<Copy size={14}/>} {copied?'Copiado':label}</button>; }
function CodePanel({name,code,language='java'}) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16}/>{name}<CopyButton value={code}/></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language==='java'} wrapLongLines customStyle={{margin:0,padding:'18px',background:'#0f172a',fontSize:'.78rem'}}>{code}</SyntaxHighlighter></section>; }

function MetadataLab() {
  const [annotation,setAnnotation]=useState(true);
  return <section className="an80-stack"><div className="an80-mode"><button type="button" className={!annotation?'active':''} onClick={()=>setAnnotation(false)}>Comentário</button><button type="button" className={annotation?'active':''} onClick={()=>setAnnotation(true)}>Annotation</button></div><div className="an80-pipeline"><article><small>CÓDIGO</small><code>{annotation?'@Override':'// sobrescreve toString'}</code></article><ArrowRight/><article className={annotation?'active':'muted'}><small>{annotation?'METADADO ESTRUTURADO':'TEXTO LIVRE'}</small><strong>{annotation?'compilador · IDE · ferramenta · runtime':'apenas leitura humana'}</strong></article><ArrowRight/><article className={annotation?'safe':'danger'}><small>ASSINATURA tostring()</small><strong>{annotation?'erro de compilação':'método novo passa despercebido'}</strong></article></div><CodePanel name="Metadado verificável" code={annotation?'@Override\npublic String toString() {\n    return "Cliente";\n}':'// Este método sobrescreve toString\npublic String tostring() {\n    return "Cliente";\n}'}/><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Annotation descreve o código para outro mecanismo</strong><p>Ela pode orientar compilador, IDE, análise, biblioteca, framework ou runtime. Não substitui regra de negócio.</p></div></aside></section>;
}

function OverrideLab() {
  const [spelling,setSpelling]=useState('toString');
  const valid=spelling==='toString';
  return <section className="an80-stack"><div className="an80-override"><label>Método após @Override<select value={spelling} onChange={event=>setSpelling(event.target.value)}><option>toString</option><option>tostring</option><option>toStrings</option></select></label><article className={valid?'safe':'danger'}><small>COMPILADOR</small><strong>{valid?'sobrescrita confirmada':'method does not override'}</strong><span>{valid?'assinatura coincide com Object.toString()':'maiúsculas, nome ou parâmetros não coincidem'}</span></article></div><CodePanel name="Classe e contrato de interface" code={'interface Notificador {\n    void enviar(String mensagem);\n}\n\nclass NotificadorConsole implements Notificador {\n    @Override\n    public void enviar(String mensagem) {\n        System.out.println(mensagem);\n    }\n}'}/><p className="ln73-format-proof">Use <strong>@Override sempre</strong> que sobrescrever método de superclasse ou implementar contrato de interface.</p></section>;
}

const VERSIONS=[['1.0','API principal'],['2.0','deprecated · alternativa disponível'],['3.0','migração em andamento'],['4.0','remoção possível']];
function DeprecatedLab() {
  const [selected,setSelected]=useState(1); const item=VERSIONS[selected];
  return <section className="an80-stack"><div className="an80-timeline">{VERSIONS.map((version,index)=><button type="button" key={version[0]} className={selected===index?'active':''} onClick={()=>setSelected(index)}><strong>v{version[0]}</strong><small>{version[1]}</small></button>)}</div><div className="an80-deprecated"><AtSign size={31}/><div><small>ESTADO EM v{item[0]}</small><strong>{selected===0?'usar normalmente':selected===3?'compatibilidade pode terminar':'evitar em código novo e migrar'}</strong><span>@Deprecated mantém o método; não o remove automaticamente</span></div></div><CodePanel name="Depreciação responsável" code={'/**\n * @deprecated Use {@link #executarNovo()}.\n */\n@Deprecated(since = "2.0", forRemoval = false)\nvoid executarAntigo() { }\n\nvoid executarNovo() { }'}/></section>;
}

const SUPPRESS_CASES=[
  ['classe inteira','@SuppressWarnings("all")',false,'silencia problemas sem distinção'],
  ['método de compatibilidade','@SuppressWarnings("deprecation")',true,'motivo e dívida ficam localizados'],
  ['cast legado isolado','@SuppressWarnings("unchecked")',true,'escopo mínimo para integração conhecida'],
];
function SuppressLab(){const[selected,setSelected]=useState(1);const item=SUPPRESS_CASES[selected];return <section className="an80-stack"><div className="an80-suppress">{SUPPRESS_CASES.map((entry,index)=><button type="button" key={entry[0]} className={(selected===index?'active ':'')+(entry[2]?'safe':'danger')} onClick={()=>setSelected(index)}><strong>{entry[0]}</strong><code>{entry[1]}</code></button>)}</div><div className={'an80-scope '+(item[2]?'safe':'danger')}><small>{item[2]?'SUPRESSÃO JUSTIFICÁVEL':'SUPRESSÃO PERIGOSA'}</small><strong>{item[3]}</strong><span>silenciar warning não corrige a causa</span></div><aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>O menor escopo é o melhor ponto de dívida</strong><p>Prefira corrigir. Quando compatibilidade exigir suppress, nomeie o warning exato e deixe o plano de migração compreensível.</p></div></aside></section>;}

function CustomLab(){
  const [element,setElement]=useState('nome'); const [value,setValue]=useState('clientes');
  const code=['@Retention(RetentionPolicy.RUNTIME)','@Target(ElementType.TYPE)','public @interface Tabela {','    String nome();','    String schema() default "public";','}','','@Tabela(nome = "'+value+'")','class ClienteTabela { }'].join('\n');
  return <section className="an80-stack"><div className="an80-anatomy"><article><small>NOME</small><strong>@Tabela</strong><span>declarada com @interface</span></article><article><small>ELEMENTO OBRIGATÓRIO</small><strong>String nome()</strong><input value={value} onChange={event=>setValue(event.target.value)}/></article><article><small>ELEMENTO COM DEFAULT</small><strong>schema = public</strong><span>pode ser omitido no uso</span></article></div><label className="an80-select">Metadado lido: <select value={element} onChange={event=>setElement(event.target.value)}><option value="nome">nome</option><option value="schema">schema</option></select><strong>{element==='nome'?(value||'(vazio)'):'public'}</strong></label><CodePanel name="Tabela.java e uso" code={code}/></section>;
}

const RETENTIONS=[
  ['SOURCE','fonte','descartada após compilação','ferramenta/compilador'],
  ['CLASS','.class','permanece no bytecode','não necessariamente via reflection'],
  ['RUNTIME','execução','visível no bytecode e runtime','getAnnotation funciona'],
];
function RetentionLab(){const[selected,setSelected]=useState(2);const item=RETENTIONS[selected];const runtime=selected===2;return <section className="an80-stack"><div className="an80-retention">{RETENTIONS.map((entry,index)=><button type="button" key={entry[0]} className={selected===index?'active':''} onClick={()=>setSelected(index)}><strong>{entry[0]}</strong><small>{entry[1]}</small></button>)}</div><div className="an80-retention-flow"><span>source</span><ArrowRight/><span className={selected>=1?'kept':''}>bytecode</span><ArrowRight/><span className={runtime?'kept':''}>runtime</span><strong>{item[2]} · {item[3]}</strong></div><CodePanel name="@Target e leitura inicial" code={'@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.FIELD)\n@interface CampoObrigatorio {\n    String mensagem() default "Campo obrigatório.";\n}\n\nfor (Field campo : classe.getDeclaredFields()) {\n    CampoObrigatorio regra = campo.getAnnotation(CampoObrigatorio.class);\n    if (regra != null) System.out.println(regra.mensagem());\n}'}/><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Annotation marca; intérprete executa</strong><p>@CampoObrigatorio não valida sozinho. Reflection, framework ou outro código precisa localizar o metadado e aplicar uma regra.</p></div></aside></section>;}

const DOMAINS=[
  ['Cliente','@Override em toString','compilador protege assinatura de debug'],
  ['Produto','@Deprecated com alternativa','migração preserva compatibilidade'],
  ['Pedido','@Override em representação','status aparece com contrato verificável'],
  ['Pagamento','@SuppressWarnings("deprecation")','integração legada isolada no menor método'],
  ['Ordem de serviço','@Override em toString','certificado e status ajudam diagnóstico'],
  ['Mensageria','@CanalMensagem("whatsapp")','classe carrega metadado lido em runtime'],
  ['Auditoria','@Override + Instant','representação técnica explícita e protegida'],
];
function DomainLab(){const[selected,setSelected]=useState(0);const item=DOMAINS[selected];return <section className="ln73-domains"><div>{DOMAINS.map((domain,index)=><button type="button" key={domain[0]} className={selected===index?'active':''} onClick={()=>setSelected(index)}><span>{index+1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>ANNOTATION NO BACKEND</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Teste do mentor</strong><span>Quem interpreta esse metadado, em qual fase e qual comportamento fica explícito para o leitor?</span></div></article></section>;}

const ERRORS=[
  ['Sem @Override','Erro de assinatura cria método novo silencioso.','Marque toda sobrescrita/implementação.'],
  ['Annotation como comentário','Código espera efeito de uma marca sem leitor.','Identifique compilador, ferramenta ou runtime intérprete.'],
  ['Suppress esconde problema','Warning desaparece, defeito permanece.','Corrija a causa ou documente compatibilidade.'],
  ['Suppress all','Avisos importantes somem juntos.','Use chave específica no menor escopo.'],
  ['Deprecated sem alternativa','Chamador não sabe para onde migrar.','Documente link e versão substituta.'],
  ['Warning ignorado','Código novo aumenta dívida legada.','Planeje migração antes da remoção.'],
  ['Retention incorreto','getAnnotation retorna null.','Use RUNTIME para leitura em execução.'],
  ['Target ausente/inadequado','Annotation aparece onde não faz sentido.','Restrinja TYPE, METHOD, FIELD etc.'],
  ['Metadado sem mecanismo','@CampoObrigatorio não valida valor.','Implemente leitor/validador ou use framework.'],
  ['Regra invisível demais','Annotation esconde fluxo essencial.','Prefira método explícito para comportamento central.'],
];
function ErrorsClinic(){const[selected,setSelected]=useState(0);const item=ERRORS[selected];return <section className="ln73-errors an80-errors"><div>{ERRORS.map((error,index)=><button type="button" key={error[0]} className={selected===index?'active':''} onClick={()=>setSelected(index)}><span>{index+1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20}/><div><small>CASO {selected+1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16}/><strong>Correção:</strong> {item[2]}</p></article></section>;}

const CHECKS=['annotation foi diferente de comentário','Override protegeu classe e interface','assinatura errada foi diagnosticada','Deprecated indicou versão e alternativa','Suppress ficou específico e local','annotation customizada ganhou elementos','SOURCE CLASS RUNTIME foram separados','Target restringiu TYPE e FIELD','getAnnotation encontrou classe e campo','sete domínios foram explicados'];
function DeliveryLab(){const[checked,setChecked]=useState([]);const toggle=index=>setChecked(current=>current.includes(index)?current.filter(item=>item!==index):[...current,index]);const commands=['mkdir labs\\m2\\aula-080-annotations-basicas','cd labs\\m2\\aula-080-annotations-basicas','javac LaboratorioAnnotations.java','java LaboratorioAnnotations'].join('\n');return <section className="ln73-delivery"><CodePanel name="LaboratorioAnnotations.java" code={MAIN_PROGRAM}/><div className="ln73-terminal"><header><Terminal size={15}/>Compilar e executar<CopyButton value={commands}/></header><pre><b>PS&gt;</b> {commands.replaceAll('\n','\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18}/><strong>Debug: da classe ao metadado</strong></header><div><article><span>1</span><strong>Breakpoint</strong><p>Pare em getAnnotation.</p></article><article><span>2</span><strong>Class</strong><p>ClienteTabela é o tipo inspecionado.</p></article><article><span>3</span><strong>Annotation</strong><p>Tabela não é null em RUNTIME.</p></article><article><span>4</span><strong>Elemento</strong><p>nome() devolve clientes.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item,index)=><button type="button" key={item} className={checked.includes(index)?'done':''} onClick={()=>toggle(index)}><span>{checked.includes(index)?<Check size={14}/>:index+1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22}/><h3>Desafio: metadado de mensageria</h3></div><p>Crie @CanalMensagem em TYPE e @CampoObrigatorio em FIELD, leia ambas em runtime e explique quem aplica a regra.</p><ul><li>Demonstre SOURCE versus RUNTIME em arquivos separados.</li><li>Depreque um canal antigo com alternativa.</li><li>Restrinja suppress deprecation ao método de compatibilidade.</li><li>Provoque @Override com assinatura errada.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16}/>README.md · evidências<CopyButton value={EVIDENCE}/></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{margin:0,padding:'18px',background:'#0f172a',fontSize:'.78rem'}}>{EVIDENCE}</SyntaxHighlighter></section></section>;}

function ContentBlock({block}){if(block.type==='lead')return <p className="guided-lead">{block.text}</p>;const map={metadata:MetadataLab,override:OverrideLab,deprecated:DeprecatedLab,suppress:SuppressLab,custom:CustomLab,retention:RetentionLab,domains:DomainLab,errors:ErrorsClinic,delivery:DeliveryLab};const Component=map[block.type];return Component?<Component/>:null;}
const steps=[
  {id:'metadata',label:'Metadado, não Comentário',duration:'11 min',eyebrow:'INFORMAÇÃO PROCESSÁVEL',title:'Mostre quem consegue interpretar a marca',blocks:[{type:'lead',text:'Comentário orienta humanos. Annotation é metadado estruturado para compilador, IDE, ferramenta, framework ou runtime.'},{type:'metadata'}]},
  {id:'override',label:'@Override',duration:'11 min',eyebrow:'ASSINATURA VERIFICADA',title:'Faça o compilador proteger sobrescritas e contratos',blocks:[{type:'lead',text:'@Override detecta nome, caixa, parâmetros e retorno incompatíveis em superclasse ou interface.'},{type:'override'}]},
  {id:'deprecated',label:'@Deprecated',duration:'11 min',eyebrow:'MIGRAÇÃO DE API',title:'Mantenha compatibilidade sem incentivar uso novo',blocks:[{type:'lead',text:'since e forRemoval registram o ciclo; documentação curta aponta a alternativa. Deprecar não remove imediatamente.'},{type:'deprecated'}]},
  {id:'suppress',label:'@SuppressWarnings',duration:'11 min',eyebrow:'WARNING E ESCOPO',title:'Silencie apenas a dívida conhecida',blocks:[{type:'lead',text:'deprecation e unchecked podem aparecer em integração legada. all e escopo de classe escondem informação demais.'},{type:'suppress'}]},
  {id:'custom',label:'Annotation Customizada',duration:'12 min',eyebrow:'@INTERFACE E ELEMENTOS',title:'Declare metadados obrigatórios e defaults',blocks:[{type:'lead',text:'Uma annotation tem nome e elementos. O uso fornece valores, mas a classe anotada não ganha comportamento por isso.'},{type:'custom'}]},
  {id:'retention',label:'Retention, Target e Leitura',duration:'14 min',eyebrow:'FONTE, BYTECODE OU RUNTIME',title:'Mantenha a annotation até a fase que precisa dela',blocks:[{type:'lead',text:'Retention define duração; Target define locais de uso. getAnnotation só encontra metadado disponível em runtime.'},{type:'retention'}]},
  {id:'domains',label:'Annotations no Backend',duration:'13 min',eyebrow:'SETE DOMÍNIOS',title:'Aplique intenção, migração e configuração declarativa',blocks:[{type:'lead',text:'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria mostram annotations nativas e customizadas.'},{type:'domains'}]},
  {id:'errors',label:'Clínica de Erros',duration:'12 min',eyebrow:'DEZ DIAGNÓSTICOS',title:'Encontre metadado inútil, amplo ou invisível',blocks:[{type:'lead',text:'Override, suppress, deprecated, retention, target e mecanismo de leitura falham por causas diferentes.'},{type:'errors'}]},
  {id:'delivery',label:'Entrega & Desafio',duration:'28 min',eyebrow:'CÓDIGO, DEBUG E GIT',title:'Prove compilador, migração e leitura em runtime',blocks:[{type:'lead',text:'Compile, confira oito saídas, depure getAnnotation e entregue annotations com intérprete explícito.'},{type:'delivery'}]},
];
export default function GuidedBasicAnnotationsLesson080({isCompleted,onToggleCompleted,onNextLesson,onPrevLesson,hasNextLesson,hasPrevLesson}){const[activeIndex,setActiveIndex]=useState(0);const navRef=useRef(null);const completionNormalizedRef=useRef(false);const[completedSteps,setCompletedSteps]=useState(()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');const validIds=new Set(steps.map(step=>step.id));return new Set(Array.isArray(saved)?saved.filter(id=>validIds.has(id)):[])}catch{return new Set()}});useEffect(()=>localStorage.setItem(STORAGE_KEY,JSON.stringify([...completedSteps])),[completedSteps]);useEffect(()=>{if(!completionNormalizedRef.current&&isCompleted&&completedSteps.size!==steps.length){completionNormalizedRef.current=true;onToggleCompleted()}},[completedSteps.size,isCompleted,onToggleCompleted]);useEffect(()=>{const button=navRef.current?.querySelector('button.active');if(button&&window.matchMedia('(max-width: 900px)').matches)button.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})},[activeIndex]);const step=steps[activeIndex];const stepDone=completedSteps.has(step.id);const allStepsDone=completedSteps.size===steps.length;const lessonComplete=isCompleted&&allStepsDone;const selectStep=index=>{setActiveIndex(index);document.querySelector('.guided-layout')?.scrollIntoView({behavior:'smooth',block:'start'})};const toggleStep=()=>{if(stepDone&&isCompleted)onToggleCompleted();setCompletedSteps(current=>{const next=new Set(current);if(next.has(step.id))next.delete(step.id);else next.add(step.id);return next})};return <article className="guided-git-lesson guided-basic-annotations-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><AtSign size={17}/>Laboratório de metadados Java</span><p className="guided-sequence">080 · M2.19</p><h1>Annotations básicas</h1><p>Transforme intenção em metadado verificável, migre APIs com clareza e leia marcas em runtime.</p></div><div className="guided-hero-status"><Clock3 size={42}/><strong>{Math.round((completedSteps.size/steps.length)*100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 080" items={[{value:'3 nativas',label:'Override, Deprecated e Suppress'},{value:'3 retenções',label:'SOURCE, CLASS e RUNTIME'},{value:'10 falhas',label:'Diagnosticadas pela causa'}]}/><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 080"><div className="guided-step-nav-title"><ListChecks size={18}/>Roteiro prático</div>{steps.map((item,index)=><button type="button" key={item.id} className={(index===activeIndex?'active ':'')+(completedSteps.has(item.id)?'done':'')} onClick={()=>selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id)?<Check size={14}/>:String(index+1).padStart(2,'0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block,index)=><ContentBlock key={block.type+'-'+index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex===0} onClick={()=>selectStep(activeIndex-1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle '+(stepDone?'undo':'complete')} onClick={toggleStep}>{stepDone?<><RotateCcw size={16}/>Desmarcar etapa</>:<><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex<steps.length-1&&<button type="button" className="primary" disabled={!stepDone} onClick={()=>selectStep(activeIndex+1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone&&<section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Metadado com intérprete explícito</h3><p>{lessonComplete?'Aula concluída e pronta para reflection conceitual.':'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete?'Reabrir aula':'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 079</button><div className={'guided-course-status '+(lessonComplete?'completed':allStepsDone?'ready':'')}><Clock3 size={18}/><span><strong>{lessonComplete?'Aula concluída':completedSteps.size+' de '+steps.length+' etapas'}</strong><small>metadados, retenção e runtime</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson||!lessonComplete}>Aula 081<ArrowRight size={17}/></button></footer></article>;}
