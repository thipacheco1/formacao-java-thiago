import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Boxes, Check, CheckCircle2, Clock3, Copy, Eye, FileCode2, KeyRound, Lightbulb, ListChecks, Play, RotateCcw, Search, ShieldAlert, Sparkles, Terminal, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedConceptualReflectionLesson.css';

const STORAGE_KEY = 'guided-conceptual-reflection-lesson-081-progress';
const MAIN_PROGRAM = [
  'import java.lang.annotation.ElementType;',
  'import java.lang.annotation.Retention;',
  'import java.lang.annotation.RetentionPolicy;',
  'import java.lang.annotation.Target;',
  'import java.lang.reflect.Constructor;',
  'import java.lang.reflect.Field;',
  'import java.lang.reflect.Method;',
  'import java.util.ArrayList;',
  'import java.util.Arrays;',
  'import java.util.List;',
  '',
  'public class LaboratorioReflection {',
  '    public static void main(String[] args) throws Exception {',
  '        ClienteTabela cliente = new ClienteTabela("Ana", "");',
  '        Class<ClienteTabela> literal = ClienteTabela.class;',
  '        Class<?> peloObjeto = cliente.getClass();',
  '        Class<?> peloNome = Class.forName("ClienteTabela");',
  '',
  '        System.out.println("classe: " + literal.getSimpleName());',
  '        System.out.println("mesma classe: "',
  '                + (literal == peloObjeto && literal == peloNome));',
  '',
  '        String campos = Arrays.stream(literal.getDeclaredFields())',
  '                .map(Field::getName).sorted().toList().toString();',
  '        System.out.println("campos: " + campos);',
  '',
  '        Method resumo = literal.getDeclaredMethod("resumo");',
  '        System.out.println("metodo: " + resumo.getName()',
  '                + " -> " + resumo.getReturnType().getSimpleName());',
  '        System.out.println("construtores: "',
  '                + literal.getDeclaredConstructors().length);',
  '',
  '        Tabela tabela = literal.getAnnotation(Tabela.class);',
  '        System.out.println("tabela: " + tabela.nome());',
  '        System.out.println("obrigatorios: " + camposObrigatorios(literal));',
  '        System.out.println("erros: " + validar(cliente));',
  '',
  '        Constructor<ClienteTabela> construtor = literal',
  '                .getDeclaredConstructor(String.class, String.class);',
  '        ClienteTabela criada = construtor.newInstance(',
  '                "Bia", "bia@email.com");',
  '        System.out.println("invoke: " + resumo.invoke(criada));',
  '',
  '        Field nome = literal.getDeclaredField("nome");',
  '        try {',
  '            nome.get(criada);',
  '        } catch (IllegalAccessException erro) {',
  '            System.out.println("privado: bloqueado");',
  '        }',
  '        nome.setAccessible(true);',
  '        System.out.println("campo privado: " + nome.get(criada));',
  '',
  '        try {',
  '            Class.forName("ClasseInexistente");',
  '        } catch (ClassNotFoundException erro) {',
  '            System.out.println("classe ausente: diagnosticada");',
  '        }',
  '    }',
  '',
  '    static List<String> camposObrigatorios(Class<?> tipo) {',
  '        return Arrays.stream(tipo.getDeclaredFields())',
  '                .filter(campo -> campo.isAnnotationPresent(',
  '                        CampoObrigatorio.class))',
  '                .map(Field::getName).sorted().toList();',
  '    }',
  '',
  '    static List<String> validar(Object objeto) {',
  '        List<String> erros = new ArrayList<>();',
  '        for (Field campo : objeto.getClass().getDeclaredFields()) {',
  '            CampoObrigatorio regra = campo.getAnnotation(',
  '                    CampoObrigatorio.class);',
  '            if (regra == null) continue;',
  '            try {',
  '                campo.setAccessible(true);',
  '                Object valor = campo.get(objeto);',
  '                if (valor == null',
  '                        || valor instanceof String texto && texto.isBlank()) {',
  '                    erros.add(campo.getName() + ": " + regra.mensagem());',
  '                }',
  '            } catch (IllegalAccessException erro) {',
  '                throw new IllegalStateException(',
  '                        "Falha ao ler " + campo.getName(), erro);',
  '            }',
  '        }',
  '        return erros;',
  '    }',
  '}',
  '',
  '@Tabela(nome = "clientes")',
  'class ClienteTabela {',
  '    @CampoObrigatorio(mensagem = "Nome obrigatorio.")',
  '    private final String nome;',
  '    @CampoObrigatorio(mensagem = "Email obrigatorio.")',
  '    private final String email;',
  '',
  '    ClienteTabela() { this("", ""); }',
  '    ClienteTabela(String nome, String email) {',
  '        this.nome = nome;',
  '        this.email = email;',
  '    }',
  '    public String resumo() { return nome + " <" + email + ">"; }',
  '    private boolean nomeValido() { return !nome.isBlank(); }',
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
  'classe: ClienteTabela',
  'mesma classe: true',
  'campos: [email, nome]',
  'metodo: resumo -> String',
  'construtores: 2',
  'tabela: clientes',
  'obrigatorios: [email, nome]',
  'erros: [email: Email obrigatorio.]',
  'invoke: Bia <bia@email.com>',
  'privado: bloqueado',
  'campo privado: Bia',
  'classe ausente: diagnosticada',
].join('\n');

const EVIDENCE = [
  '# Aula 081 — Reflection conceitual', '',
  '- [ ] Expliquei Class, Field, Method e Constructor',
  '- [ ] Obtive Class por .class, getClass e Class.forName',
  '- [ ] Comparei getDeclared* com membros públicos herdados',
  '- [ ] Listei campos, métodos, parâmetros e construtores sem depender da ordem',
  '- [ ] Li annotations RUNTIME em classe e campo',
  '- [ ] Implementei validador genérico didático',
  '- [ ] Criei objeto e invoquei método dinamicamente',
  '- [ ] Observei o bloqueio de acesso a campo privado',
  '- [ ] Justifiquei ou removi setAccessible',
  '- [ ] Diagnostiquei strings mágicas e exceções',
  '- [ ] Decidi quando usar chamada direta',
  '- [ ] Compilei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16}/>{name}<CopyButton value={code}/></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

function MirrorLab() {
  const [mode, setMode] = useState('inspect');
  const inspect = mode === 'inspect';
  return <section className="rf81-stack"><div className="rf81-mode"><button type="button" className={inspect ? 'active' : ''} onClick={() => setMode('inspect')}>Inspeção</button><button type="button" className={!inspect ? 'active danger' : ''} onClick={() => setMode('manipulate')}>Manipulação</button></div><div className="rf81-mirror"><article><small>CÓDIGO EM RUNTIME</small><strong>ClienteTabela</strong><span>objeto ou tipo conhecido</span></article><ArrowRight/><article className="active"><Eye size={26}/><small>ESPELHO</small><strong>Class&lt;?&gt;</strong><span>metadados estruturais</span></article><ArrowRight/><div>{['Field · campos', 'Method · métodos', 'Constructor · criação', 'annotations · marcas'].map(item => <span key={item}>{item}</span>)}</div></div><div className={'rf81-verdict ' + (inspect ? 'safe' : 'warning')}><strong>{inspect ? 'Ler a estrutura não é ler o valor privado' : 'Invocar, criar ou liberar acesso aumenta o risco'}</strong><span>{inspect ? 'Frameworks descobrem contratos sem conhecer o tipo em compilação.' : 'Erros migram para runtime, encapsulamento enfraquece e exceções precisam de contexto.'}</span></div><div className="rf81-chip-list" aria-label="Tecnologias que usam ideias de reflection">{['Spring / DI', 'JPA / Hibernate', 'Jackson', 'JUnit / Mockito', 'Bean Validation', 'ORM e scanners'].map(item => <span key={item}>{item}</span>)}</div><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Regra do mentor</strong><p>Tipo conhecido e chamada direta clara? Use a API normal. Reflection é ferramenta de infraestrutura para código genuinamente genérico.</p></div></aside></section>;
}

const ENTRY_MODES = [
  ['literal', 'ClienteTabela.class', 'tipo conhecido no código', 'sem busca e com tipo genérico preciso'],
  ['object', 'cliente.getClass()', 'objeto já existe', 'resultado representa o tipo real do objeto'],
  ['name', 'Class.forName("ClienteTabela")', 'nome chega em runtime', 'pode lançar ClassNotFoundException'],
];
function ClassEntryLab() { const [selected, setSelected] = useState(0); const item = ENTRY_MODES[selected]; return <section className="rf81-stack"><div className="rf81-entry">{ENTRY_MODES.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><code>{entry[1]}</code><small>{entry[2]}</small></button>)}</div><div className="rf81-class-card"><Boxes size={28}/><div><small>OBJETO CLASS OBTIDO</small><strong>ClienteTabela</strong><span>{item[3]}</span></div></div><CodePanel name="Três entradas, uma identidade" code={'Class<ClienteTabela> literal = ClienteTabela.class;\nClass<?> peloObjeto = cliente.getClass();\nClass<?> peloNome = Class.forName("ClienteTabela");\n\nSystem.out.println(literal == peloObjeto); // true\nSystem.out.println(literal == peloNome);   // true\nSystem.out.println(literal.getName());\nSystem.out.println(literal.getSimpleName());\nSystem.out.println(literal.getPackageName());'}/><p className="ln73-format-proof">Em pacote real, <strong>Class.forName exige o nome qualificado</strong>, como br.com.exemplo.Cliente. Sem pacote, getPackageName retorna vazio.</p></section>; }

const MEMBER_GROUPS = [
  ['fields', 'Campos', 'getDeclaredFields()', ['nome · String · private', 'email · String · private'], 'getFields() vê públicos acessíveis e herdados'],
  ['methods', 'Métodos', 'getDeclaredMethods()', ['resumo() · String · public', 'nomeValido() · boolean · private'], 'getMethods() também inclui métodos públicos herdados'],
  ['parameters', 'Parâmetros', 'Method.getParameters()', ['atualizarContato(String, String)', 'tipos: String · String'], 'nomes podem exigir compilação com -parameters'],
  ['constructors', 'Construtores', 'getDeclaredConstructors()', ['ClienteTabela()', 'ClienteTabela(String, String)'], 'getConstructors() retorna construtores públicos'],
];
function MemberExplorer() { const [selected, setSelected] = useState(0); const item = MEMBER_GROUPS[selected]; return <section className="rf81-stack"><div className="rf81-member-tabs">{MEMBER_GROUPS.map((group, index) => <button type="button" key={group[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{group[1]}</button>)}</div><div className="rf81-explorer"><header><Search size={18}/><code>{item[2]}</code></header><div>{item[3].map((member, index) => <article key={member}><span>{String(index + 1).padStart(2, '0')}</span><strong>{member}</strong></article>)}</div><footer>{item[4]}</footer></div><CodePanel name="Inventário determinístico" code={'Arrays.stream(ClienteTabela.class.getDeclaredFields())\n        .map(Field::getName)\n        .sorted()\n        .forEach(System.out::println);\n\nMethod metodo = ClienteTabela.class\n        .getDeclaredMethod("resumo");\nSystem.out.println(metodo.getReturnType().getSimpleName());\n\nfor (Parameter p : metodo.getParameters()) {\n    System.out.println(p.getType().getSimpleName());\n}'}/><aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>A ordem de reflection não é contrato</strong><p>Ordene explicitamente quando a apresentação ou o teste precisar ser determinístico. Record também é classe e pode expor métodos gerados.</p></div></aside></section>; }

function AnnotationScannerLab() { const [runtime, setRuntime] = useState(true); const [scope, setScope] = useState('class'); const classScope = scope === 'class'; return <section className="rf81-stack"><div className="rf81-controls"><label><input type="checkbox" checked={runtime} onChange={event => setRuntime(event.target.checked)}/> RetentionPolicy.RUNTIME</label><select value={scope} onChange={event => setScope(event.target.value)}><option value="class">Annotation da classe</option><option value="field">Annotations dos campos</option></select></div><div className="rf81-scan"><article><small>SCANNER</small><strong>{classScope ? 'ClienteTabela.class' : 'getDeclaredFields()'}</strong></article><ArrowRight/><article className={runtime ? 'found' : 'missing'}><small>{runtime ? 'METADADO ENCONTRADO' : 'METADADO AUSENTE'}</small><strong>{runtime ? (classScope ? '@Tabela(nome="clientes")' : '@CampoObrigatorio × 2') : 'getAnnotation → null'}</strong></article></div><CodePanel name={classScope ? 'Annotation de classe' : 'Annotation de campo'} code={classScope ? '@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.TYPE)\n@interface Tabela { String nome(); }\n\nTabela tabela = ClienteTabela.class\n        .getAnnotation(Tabela.class);\nboolean marcada = ClienteTabela.class\n        .isAnnotationPresent(Tabela.class);' : 'for (Field campo : classe.getDeclaredFields()) {\n    CampoObrigatorio regra = campo\n            .getAnnotation(CampoObrigatorio.class);\n    if (regra != null) {\n        System.out.println(campo.getName());\n        System.out.println(regra.mensagem());\n    }\n}'}/><p className="ln73-format-proof"><strong>Annotation só descreve.</strong> Scanner, validador, framework ou ferramenta é quem interpreta e produz comportamento.</p></section>; }

function ValidatorLab() { const [name, setName] = useState('Ana'); const [email, setEmail] = useState(''); const errors = [!name.trim() && 'nome: Nome obrigatorio.', !email.trim() && 'email: Email obrigatorio.'].filter(Boolean); return <section className="rf81-stack"><div className="rf81-validator"><div><label>nome<input value={name} onChange={event => setName(event.target.value)}/></label><label>email<input value={email} onChange={event => setEmail(event.target.value)}/></label></div><ArrowRight/><article className={errors.length ? 'invalid' : 'valid'}><small>VALIDADOR GENÉRICO</small><strong>{errors.length ? errors.join(' · ') : 'objeto válido'}</strong><span>campos anotados são lidos em runtime</span></article></div><div className="rf81-validation-flow">{['Object', 'getClass()', 'getDeclaredFields()', 'getAnnotation()', 'Field.get()', 'regra'].map((item, index) => <React.Fragment key={item}><span>{item}</span>{index < 5 && <ArrowRight/>}</React.Fragment>)}</div><CodePanel name="Núcleo do validador didático" code={'for (Field campo : objeto.getClass().getDeclaredFields()) {\n    CampoObrigatorio regra = campo\n            .getAnnotation(CampoObrigatorio.class);\n    if (regra == null) continue;\n\n    campo.setAccessible(true);\n    Object valor = campo.get(objeto);\n    if (valor == null\n            || valor instanceof String texto && texto.isBlank()) {\n        erros.add(campo.getName() + ": " + regra.mensagem());\n    }\n}'}/><aside className="guided-note warning"><ShieldAlert size={20}/><div><strong>Didático não significa pronto para produção</strong><p>Framework real trata herança, módulos, cache, tipos, coleções, mensagens, segurança e acesso sem espalhar setAccessible.</p></div></aside></section>; }

const DYNAMIC_ACTIONS = [
  ['construct', 'Criar objeto', 'getDeclaredConstructor(String.class, String.class)', 'construtor.newInstance("Bia", "bia@email.com")', 'ClienteTabela criado'],
  ['invoke', 'Invocar método', 'getDeclaredMethod("resumo")', 'metodo.invoke(cliente)', 'Bia <bia@email.com>'],
  ['field', 'Ler campo', 'getDeclaredField("nome")', 'campo.get(cliente)', 'IllegalAccessException se privado'],
];
function DynamicLab() { const [selected, setSelected] = useState(0); const [accessible, setAccessible] = useState(false); const item = DYNAMIC_ACTIONS[selected]; const blocked = selected === 2 && !accessible; return <section className="rf81-stack"><div className="rf81-dynamic-tabs">{DYNAMIC_ACTIONS.map((action, index) => <button type="button" key={action[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{action[1]}</button>)}</div><div className="rf81-dynamic"><article><small>DESCOBRIR</small><code>{item[2]}</code></article><ArrowRight/><article><small>EXECUTAR</small><code>{item[3]}</code></article><ArrowRight/><article className={blocked ? 'blocked' : 'result'}><small>{blocked ? 'ACESSO NEGADO' : 'RESULTADO'}</small><strong>{blocked ? 'membro private' : item[4]}</strong></article></div>{selected === 2 && <label className="rf81-access"><input type="checkbox" checked={accessible} onChange={event => setAccessible(event.target.checked)}/> Aplicar setAccessible(true) neste laboratório</label>}<CodePanel name="Criação, invocação e acesso" code={'Constructor<ClienteTabela> construtor = classe\n        .getDeclaredConstructor(String.class, String.class);\nClienteTabela cliente = construtor\n        .newInstance("Bia", "bia@email.com");\n\nMethod metodo = classe.getDeclaredMethod("resumo");\nObject resultado = metodo.invoke(cliente);\n\nField campo = classe.getDeclaredField("nome");\ncampo.setAccessible(true);\nObject valor = campo.get(cliente);'}/><div className="rf81-chip-list" aria-label="Exceções comuns em reflection">{['ClassNotFoundException', 'NoSuchMethodException', 'NoSuchFieldException', 'IllegalAccessException', 'InvocationTargetException', 'InstantiationException', 'SecurityException'].map(error => <code key={error}>{error}</code>)}</div><aside className="guided-note warning"><KeyRound size={20}/><div><strong>setAccessible tenta suspender a checagem de acesso</strong><p>Pode falhar por módulos ou segurança, quebra encapsulamento e acopla a detalhes internos. Não é atalho para regra de negócio.</p></div></aside></section>; }

const DOMAINS = [
  ['Cliente', 'inventário de campos', 'ferramenta de diagnóstico'],
  ['Produto', 'tipos e status', 'mapeador genérico'],
  ['Pedido', 'métodos de record', 'documentação/teste'],
  ['Pagamento', 'valores privados', 'auditoria justificada'],
  ['Ordem de serviço', 'estrutura e LocalDate', 'inspeção de schema'],
  ['Mensageria', '@CanalMensagem', 'roteamento por metadado'],
  ['Auditoria', '@Auditavel', 'scanner de entidades'],
];
const DECISIONS = [
  ['cliente.getNome()', true, 'tipo conhecido e API explícita'],
  ['scanner de @Tabela', false, 'tipos descobertos em runtime'],
  ['getDeclaredMethod("getNome")', true, 'reflection desnecessária e String mágica'],
  ['executor de métodos @Test', false, 'ferramenta genérica procura metadados'],
  ['mapeador objeto/JSON', false, 'infraestrutura trabalha com tipos variados'],
];
function DecisionLab() { const [domain, setDomain] = useState(0); const [decision, setDecision] = useState(0); const item = DOMAINS[domain]; const choice = DECISIONS[decision]; return <section className="rf81-stack"><div className="ln73-domains rf81-domains"><div>{DOMAINS.map((entry, index) => <button type="button" key={entry[0]} className={domain === index ? 'active' : ''} onClick={() => setDomain(index)}><span>{index + 1}</span><strong>{entry[0]}</strong></button>)}</div><article><small>REFLECTION NO BACKEND</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Teste do mentor</strong><span>O mecanismo é infraestrutura genérica ou regra de negócio conhecida?</span></div></article></div><div className="rf81-decision">{DECISIONS.map((entry, index) => <button type="button" key={entry[0]} className={decision === index ? 'active' : ''} onClick={() => setDecision(index)}><code>{entry[0]}</code></button>)}<article className={choice[1] ? 'direct' : 'reflection'}><strong>{choice[1] ? 'Prefira chamada direta' : 'Reflection tem justificativa'}</strong><span>{choice[2]}</span></article></div><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Strings mágicas exigem testes</strong><p>Renomear nome, saudacao ou o nome qualificado da classe pode quebrar apenas em runtime. Constante reduz repetição, mas uma API explícita é melhor quando possível.</p></div></aside></section>; }

const ERRORS = [
  ['Reflection sem necessidade', 'Código genérico substitui chamada direta conhecida.', 'Volte à API tipada e explícita.'],
  ['Erro só em runtime', 'Nome errado passa pela compilação.', 'Teste descoberta e falhas de configuração.'],
  ['Depender da ordem', 'Campo muda de posição entre ambientes.', 'Ordene por critério explícito.'],
  ['setAccessible automático', 'Encapsulamento e módulos são ignorados.', 'Justifique, isole e prefira API pública.'],
  ['Exceção sem contexto', 'Falha reflexiva perde classe e membro.', 'Encapsule preservando a causa.'],
  ['Sem RUNTIME', 'getAnnotation devolve null.', 'Use RetentionPolicy.RUNTIME.'],
  ['String mágica', 'Renomeação quebra em execução.', 'Centralize ou elimine a dependência.'],
  ['Culpar só performance', 'Discussão ignora legibilidade e segurança.', 'Avalie custo total e meça gargalo real.'],
  ['Framework em toda regra', 'Código de domínio imita infraestrutura.', 'Deixe reflection na borda genérica.'],
  ['Magia sem documentação', 'Equipe não sabe como o mecanismo descobre tipos.', 'Documente contrato, escopo e testes.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors rf81-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20}/><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16}/><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['Class obtida por três caminhos', 'nomes e pacote explicados', 'campos, métodos e parâmetros inventariados', 'construtores lidos sem depender da ordem', 'annotation de classe encontrada', 'annotations de campo encontradas', 'validador rejeitou String em branco', 'constructor e invoke executados', 'campo privado bloqueou antes do acesso', 'uso direto versus genérico defendido'];
function DeliveryLab() { const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]); const commands = ['mkdir labs\\m2\\aula-081-reflection-conceitual', 'cd labs\\m2\\aula-081-reflection-conceitual', 'javac LaboratorioReflection.java', 'java LaboratorioReflection'].join('\n'); return <section className="ln73-delivery"><CodePanel name="LaboratorioReflection.java" code={MAIN_PROGRAM}/><div className="ln73-terminal"><header><Terminal size={15}/>Compilar e executar<CopyButton value={commands}/></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{ '\n\n' }<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18}/><strong>Debug: do Class ao membro</strong></header><div><article><span>1</span><strong>Breakpoint</strong><p>Pare no laço de getDeclaredFields.</p></article><article><span>2</span><strong>Class</strong><p>Confirme nome, pacote e tipo real.</p></article><article><span>3</span><strong>Field</strong><p>Observe nome, tipo e modifiers.</p></article><article><span>4</span><strong>Annotation</strong><p>Compare regra null e presente.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14}/> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22}/><h3>Desafio: mini scanner de mensageria</h3></div><p>Crie @CanalMensagem em TYPE, descubra o canal em runtime e valide campos @CampoObrigatorio antes do envio.</p><ul><li>Teste classe anotada e não anotada.</li><li>Ordene campos antes de imprimir.</li><li>Encapsule ClassNotFoundException com contexto.</li><li>Explique por que chamada direta não resolve um scanner genérico.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16}/>README.md · evidências<CopyButton value={EVIDENCE}/></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>; }

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { mirror: MirrorLab, entries: ClassEntryLab, members: MemberExplorer, annotations: AnnotationScannerLab, validator: ValidatorLab, dynamic: DynamicLab, decisions: DecisionLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component/> : null; }
const steps = [
  { id: 'mirror', label: 'O Espelho Class', duration: '11 min', eyebrow: 'RUNTIME E METADADOS', title: 'Enxergue a estrutura sem confundir inspeção com regra', blocks: [{ type: 'lead', text: 'Class representa um tipo em execução; Field, Method e Constructor descrevem seus membros. Esse espelho sustenta frameworks e ferramentas.' }, { type: 'mirror' }] },
  { id: 'entries', label: 'Três Entradas', duration: '11 min', eyebrow: '.CLASS, OBJETO OU NOME', title: 'Obtenha Class pelo contexto que você realmente possui', blocks: [{ type: 'lead', text: '.class é explícito, getClass parte de um objeto e Class.forName descobre pelo nome — com risco de falha em runtime.' }, { type: 'entries' }] },
  { id: 'members', label: 'Inventário de Membros', duration: '16 min', eyebrow: 'FIELD, METHOD E CONSTRUCTOR', title: 'Leia campos, métodos, parâmetros e construtores com precisão', blocks: [{ type: 'lead', text: 'Declared olha a própria classe e inclui privados; as variantes públicas incluem membros acessíveis e herdados. Ordem nunca é contrato.' }, { type: 'members' }] },
  { id: 'annotations', label: 'Scanner de Annotations', duration: '14 min', eyebrow: 'METADADO EM RUNTIME', title: 'Descubra marcas de classe e campo sem inventar comportamento', blocks: [{ type: 'lead', text: 'getAnnotation e isAnnotationPresent só encontram o que chegou ao runtime. A annotation informa; outro mecanismo interpreta.' }, { type: 'annotations' }] },
  { id: 'validator', label: 'Validador Genérico', duration: '17 min', eyebrow: 'CAMPO, REGRA E VALOR', title: 'Conecte metadado a uma validação didática completa', blocks: [{ type: 'lead', text: 'Percorra campos anotados, leia cada valor e transforme null ou String em branco em evidência — sem fingir que o exemplo substitui um framework.' }, { type: 'validator' }] },
  { id: 'dynamic', label: 'Criar, Invocar e Ler', duration: '16 min', eyebrow: 'OPERAÇÕES DINÂMICAS', title: 'Veja exatamente onde poder vira fragilidade', blocks: [{ type: 'lead', text: 'Constructor.newInstance, Method.invoke e Field.get executam decisões descobertas em runtime e deslocam várias falhas para exceções reflexivas.' }, { type: 'dynamic' }] },
  { id: 'decisions', label: 'Critério no Backend', duration: '14 min', eyebrow: 'SETE DOMÍNIOS E TRADE-OFFS', title: 'Escolha reflection apenas quando a genericidade pagar a conta', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria ajudam a separar infraestrutura legítima de mágica desnecessária.' }, { type: 'decisions' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Diagnostique runtime, acesso, ordem e strings mágicas', blocks: [{ type: 'lead', text: 'Reflection falha menos por sintaxe e mais por contratos implícitos. O diagnóstico deve preservar classe, membro, operação e causa.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '30 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove inspeção, annotations e execução dinâmica', blocks: [{ type: 'lead', text: 'Compile um laboratório determinístico, confira doze saídas, depure Field e entregue evidências que defendam cada escolha.' }, { type: 'delivery' }] },
];

export default function GuidedConceptualReflectionLesson081({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) { const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false); const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } }); useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]); useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]); useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]); const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone; const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); }; return <article className="guided-git-lesson guided-conceptual-reflection-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Eye size={17}/>Oficina de introspecção Java</span><p className="guided-sequence">081 · M2.20</p><h1>Reflection conceitual</h1><p>Inspecione tipos em runtime, leia metadados e use operações dinâmicas sem transformar o domínio em magia.</p></div><div className="guided-hero-status"><Clock3 size={42}/><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 081" items={[{ value: '4 espelhos', label: 'Class, Field, Method e Constructor' }, { value: '3 entradas', label: '.class, objeto e nome' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]}/><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 081"><div className="guided-step-nav-title"><ListChecks size={18}/>Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14}/> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16}/>Desmarcar etapa</> : <><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Reflection com critério, não por hábito</h3><p>{lessonComplete ? 'Aula concluída e pronta para hierarquias sealed.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 080</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18}/><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>inspeção, metadados e runtime</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 082<ArrowRight size={17}/></button></footer></article>; }
