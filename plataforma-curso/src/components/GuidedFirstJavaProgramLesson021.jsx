import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Box,
  Braces,
  Bug,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  Compass,
  Copy,
  FileCode2,
  FileText,
  Folder,
  GitBranch,
  Lightbulb,
  ListChecks,
  MonitorPlay,
  PackageCheck,
  Play,
  RotateCcw,
  Search,
  Terminal,
  TriangleAlert,
  Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedFirstJavaProgramLesson.css';

const LESSON_STORAGE_KEY = 'guided-first-java-program-lesson-021-progress';

const HELLO_CODE = [
  'public class Main {',
  '    public static void main(String[] args) {',
  '        System.out.println("Olá, Java!");',
  '    }',
  '}'
].join('\n');

const ORDER_CODE = [
  'public class ResumoOrdemServico {',
  '    public static void main(String[] args) {',
  '        System.out.println("Ordem de Serviço");',
  '        System.out.println("Número: OS-1001");',
  '        System.out.println("Status: ABERTA");',
  '        System.out.println("Responsável: Backoffice");',
  '    }',
  '}'
].join('\n');

const ORDER_OUTPUT = [
  'Ordem de Serviço',
  'Número: OS-1001',
  'Status: ABERTA',
  'Responsável: Backoffice'
].join('\n');

const PEDIDO_CODE = [
  'public class ResumoPedido {',
  '    public static void main(String[] args) {',
  '        System.out.println("Pedido");',
  '        System.out.println("Código: PED-2026-001");',
  '        System.out.println("Cliente: Cliente Exemplo");',
  '        System.out.println("Valor: 150.00");',
  '        System.out.println("Status: PENDENTE");',
  '    }',
  '}'
].join('\n');

const PEDIDO_OUTPUT = [
  'Pedido',
  'Código: PED-2026-001',
  'Cliente: Cliente Exemplo',
  'Valor: 150.00',
  'Status: PENDENTE'
].join('\n');

const XRAY_PARTS = [
  { id: 'public-class', token: 'public', role: 'Visibilidade da classe', meaning: 'A classe pública pode ser referenciada conforme as regras de acesso. Neste momento, guarde o contrato entre classe pública e arquivo.' },
  { id: 'class', token: 'class', role: 'Declaração de classe', meaning: 'Informa ao compilador que você está declarando uma classe. O programa inteiro precisa viver dentro dela.' },
  { id: 'Main', token: 'Main', role: 'Nome da classe', meaning: 'Usa PascalCase e precisa coincidir exatamente com Main.java, inclusive maiúsculas e minúsculas.' },
  { id: 'class-brace', token: '{ ... }', role: 'Bloco da classe', meaning: 'As chaves delimitam o que pertence à classe. Na Aula 022 você aprofundará blocos, aninhamento e leitura estrutural.' },
  { id: 'main-line', token: 'main(...)', role: 'Ponto de entrada', meaning: 'O launcher java procura esta assinatura para iniciar o programa.' },
  { id: 'println-line', token: 'println(...)', role: 'Instrução', meaning: 'Envia o texto para a saída padrão e termina a linha no console.' }
];

const MAIN_PARTS = [
  { token: 'public', title: 'Acessível ao launcher', text: 'O ponto de entrada padrão precisa estar publicamente acessível. Modificadores de acesso serão aprofundados depois.' },
  { token: 'static', title: 'Chamado sem criar objeto', text: 'Ao iniciar, a JVM consegue chamar main pela classe. Você ainda não precisa dominar objetos nem todos os usos de static.' },
  { token: 'void', title: 'Sem valor de retorno', text: 'O método executa instruções e não devolve um valor a outro método Java.' },
  { token: 'main', title: 'Nome reconhecido', text: 'main é minúsculo e especial nesta assinatura. Main ou principal não são o ponto de entrada padrão.' },
  { token: 'String[]', title: 'Array de textos', text: 'Pode receber argumentos da linha de comando. String é classe e começa com S maiúsculo; arrays virão em aula própria.' },
  { token: 'args', title: 'Nome do parâmetro', text: 'Pode se chamar argumentos, mas args é a convenção. O tipo String[] e o restante da assinatura é que importam ao launcher.' }
];

const TERMINAL_STEPS = [
  { command: 'cd C:\\dev\\formacao-java-thiago', output: 'PS C:\\dev\\formacao-java-thiago>', note: 'Entre na raiz Git que você validou na Aula 020. Adapte somente o trecho anterior ao nome do repositório.', files: ['docs/', 'labs/', 'src/'] },
  { command: 'New-Item -ItemType Directory -Force labs\\m1\\aula-021-primeiro-programa-java', output: 'Directory: ...\\labs\\m1\nMode   Name\nd----  aula-021-primeiro-programa-java', note: 'O alvo é uma pasta nominal dentro do repositório, não uma pasta global solta.', files: ['docs/', 'labs/', 'labs/m1/aula-021-primeiro-programa-java/'] },
  { command: 'cd labs\\m1\\aula-021-primeiro-programa-java\nNew-Item Main.java', output: 'Directory: ...\\aula-021-primeiro-programa-java\nMode   Name\n-a---  Main.java', note: 'Abra Main.java e digite o programa. Não cole sem ler cada token.', files: ['Main.java'] },
  { command: 'javac Main.java', output: '[nenhuma mensagem]', note: 'Silêncio normalmente significa compilação aceita. Prove o resultado inspecionando Main.class.', files: ['Main.java', 'Main.class'] },
  { command: 'Get-ChildItem Main.*', output: 'Mode   Name\n-a---  Main.class\n-a---  Main.java', note: 'Agora existe fonte e bytecode. O .class foi gerado pelo compilador.', files: ['Main.java', 'Main.class'] },
  { command: 'java Main', output: 'Olá, Java!', note: 'Use o nome da classe, sem .java e sem .class. O launcher encontrou main e a JVM executou println.', files: ['Main.java', 'Main.class'] }
];

const PROGRAMS = [
  { name: 'Main', file: 'Main.java', code: HELLO_CODE, compile: 'javac Main.java', run: 'java Main', output: 'Olá, Java!', purpose: 'Provar a estrutura mínima e o ponto de entrada.' },
  { name: 'ResumoOrdemServico', file: 'ResumoOrdemServico.java', code: ORDER_CODE, compile: 'javac ResumoOrdemServico.java', run: 'java ResumoOrdemServico', output: ORDER_OUTPUT, purpose: 'Representar uma saída de domínio antes de variáveis, objetos, banco ou API.' },
  { name: 'ResumoPedido', file: 'ResumoPedido.java', code: PEDIDO_CODE, compile: 'javac ResumoPedido.java', run: 'java ResumoPedido', output: PEDIDO_OUTPUT, purpose: 'Treinar classe, nome, compilação e saída com outro contexto de backend.' }
];

const ERRORS = [
  { title: 'Arquivo e classe divergem', phase: 'Compilação', bad: 'public class Main {\n}', command: 'javac Programa.java', diagnostic: 'Programa.java:1: error: class Main is public, should be declared in a file named Main.java\npublic class Main {\n       ^', cause: 'A classe pública Main está em Programa.java.', fix: 'Renomeie o arquivo para Main.java ou a classe para Programa; depois compile novamente.' },
  { title: 'Main com M maiúsculo', phase: 'Inicialização', bad: 'public static void Main(String[] args) {\n}', command: 'java Main', diagnostic: 'Error: Main method not found in class Main, please define the main method as:\n   public static void main(String[] args)', cause: 'O código pode compilar, mas Main não é o nome especial main.', fix: 'Troque apenas Main por main, recompile e execute outra vez.' },
  { title: 'static ausente', phase: 'Inicialização', bad: 'public void main(String[] args) {\n}', command: 'java Main', diagnostic: 'Error: Main method is not static in class Main, please define the main method as:\n   public static void main(String[] args)', cause: 'Existe um método de instância, não o ponto de entrada estático.', fix: 'Inclua static, recompile e repita java Main.' },
  { title: 'void ausente', phase: 'Compilação', bad: 'public static main(String[] args) {\n}', command: 'javac Main.java', diagnostic: 'Main.java:2: error: invalid method declaration; return type required\n    public static main(String[] args) {\n                  ^', cause: 'Todo método precisa declarar um tipo de retorno; o main padrão usa void.', fix: 'Insira void entre static e main.' },
  { title: 'string minúsculo', phase: 'Compilação', bad: 'public static void main(string[] args) {\n}', command: 'javac Main.java', diagnostic: 'Main.java:2: error: cannot find symbol\n    public static void main(string[] args) {\n                            ^\n  symbol:   class string', cause: 'Java diferencia maiúsculas. A classe de texto é String.', fix: 'Troque string por String.' },
  { title: 'Ponto e vírgula ausente', phase: 'Compilação', bad: 'System.out.println("Olá")', command: 'javac Main.java', diagnostic: 'Main.java:3: error: \';\' expected\n        System.out.println("Olá")\n                                   ^', cause: 'A instrução não foi encerrada.', fix: 'Adicione ; ao final. A seta mostra onde o compilador percebeu a falta.' },
  { title: 'Aspas simples em texto', phase: 'Compilação', bad: "System.out.println('Olá, Java!');", command: 'javac Main.java', diagnostic: "Main.java:3: error: unclosed character literal\n        System.out.println('Olá, Java!');\n                           ^", cause: 'Aspas simples delimitam um caractere, não uma sequência de texto.', fix: 'Use aspas duplas: "Olá, Java!". Para um caractere isolado, \'A\' seria válido.' },
  { title: 'Chave de classe ausente', phase: 'Compilação', bad: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Olá");\n    }', command: 'javac Main.java', diagnostic: 'Main.java:4: error: reached end of file while parsing\n    }\n     ^', cause: 'O método fechou, mas a classe continuou aberta.', fix: 'Feche a classe com outra }. Na Aula 022 você aprofundará o pareamento de blocos.' },
  { title: 'Executar Main.class', phase: 'Inicialização', bad: 'java Main.class', command: 'java Main.class', diagnostic: 'Error: Could not find or load main class Main.class\nCaused by: java.lang.ClassNotFoundException: Main.class', cause: 'java espera o nome binário da classe, não o nome do arquivo.', fix: 'Execute java Main.' },
  { title: 'Executar sem recompilar', phase: 'Build / inicialização', bad: '// Main.java foi alterado\njava Main', command: 'java Main', diagnostic: 'Sem Main.class: Could not find or load main class Main\nCom Main.class antigo: a saída anterior ainda pode aparecer.', cause: 'A JVM executa bytecode. Alterar Main.java não atualiza Main.class.', fix: 'Rode javac Main.java, confirme o horário/arquivo gerado e então java Main.' }
];

const EVIDENCE_DOC = [
  '# Aula 021 — primeiro programa Java',
  '',
  '## Programa mínimo',
  '- [ ] Digitei Main.java e consigo explicar cada parte',
  '- [ ] `javac Main.java` foi aceito',
  '- [ ] Confirmei Main.class no disco',
  '- [ ] `java Main` exibiu `Olá, Java!`',
  '- [ ] Comparei Run e Debug no IntelliJ',
  '',
  '## Programas de domínio',
  '- [ ] Executei ResumoOrdemServico',
  '- [ ] Executei ResumoPedido',
  '',
  '## Diagnóstico',
  '- [ ] Provoquei pelo menos um erro de compilação',
  '- [ ] Li arquivo, linha, mensagem e marcador `^`',
  '- [ ] Corrigi e repeti a prova',
  '',
  '## Git',
  '- [ ] `.java` está no staged diff',
  '- [ ] `.class` está ignorado',
  '- [ ] Revisei `git diff --staged` antes do commit',
  '',
  '## Explicação com minhas palavras',
  '- `public class Main`:',
  '- `public static void main(String[] args)`:',
  '- `System.out.println`:',
  '- fonte, bytecode e JVM:',
  '',
  '## Dúvida que ficou',
  '-'
].join('\n');

const steps = [
  { id: 'mapa', label: 'Mapa do programa', duration: '10 min', eyebrow: 'Comece aqui', title: 'Pare de copiar: enxergue as três camadas do primeiro programa', blocks: [{ type: 'lead', text: 'Hoje eu vou tratar este pequeno arquivo como um sistema completo. Primeiro localizamos classe, ponto de entrada e instrução. Depois cada palavra ganhará uma responsabilidade observável.' }, { type: 'xray' }, { type: 'note', tone: 'info', title: 'Seu objetivo não é decorar uma frase mágica', text: 'Ao final, você precisa reconstruir o programa e explicar por que cada parte existe. Clique nos seis pontos do raio X antes de praticar.' }] },
  { id: 'classe', label: 'Classe e arquivo', duration: '13 min', eyebrow: 'Etapa 1', title: 'Faça Main.java e public class Main assinarem o mesmo contrato', blocks: [{ type: 'lead', text: 'O compilador compara nomes com precisão. Vamos separar a extensão do arquivo, o nome da classe, PascalCase e os dois blocos mínimos sem antecipar a aula profunda de chaves.' }, { type: 'classShell' }, { type: 'note', tone: 'warning', title: 'Maiúsculas fazem parte do nome', text: 'Main e main são identificadores diferentes. Para uma classe pública Main, o arquivo é Main.java.' }] },
  { id: 'main', label: 'Anatomia do main', duration: '17 min', eyebrow: 'Etapa 2', title: 'Desmonte o ponto de entrada palavra por palavra', blocks: [{ type: 'lead', text: 'Imagine o comando java Main chegando à classe. Ele não procura qualquer método: procura uma assinatura específica. Selecione cada token e explique o contrato em voz alta.' }, { type: 'mainAnatomy' }, { type: 'note', tone: 'info', title: 'Profundidade calibrada', text: 'String, arrays, objetos, visibilidade e static terão aulas próprias. Aqui você precisa reconhecer o papel inicial de cada parte e diagnosticar a assinatura.' }] },
  { id: 'saida', label: 'println e literais', duration: '14 min', eyebrow: 'Etapa 3', title: 'Preveja o console antes de executar', blocks: [{ type: 'lead', text: 'System.out.println parece uma palavra só, mas descreve uma rota: classe do sistema, saída padrão e operação de imprimir uma linha. Compare println, print, aspas e ponto e vírgula.' }, { type: 'outputLab' }] },
  { id: 'terminal', label: 'Primeiro build', duration: '22 min', eyebrow: 'Etapa 4', title: 'Crie, compile, inspecione e execute sem pular evidências', blocks: [{ type: 'lead', text: 'Agora trabalhe no seu computador ao lado desta simulação. O painel não executa comandos reais: ele mostra a forma e a saída esperada para você comparar com o que observar.' }, { type: 'terminalLab' }, { type: 'note', tone: 'warning', title: 'Silêncio do javac não é adivinhação', text: 'Depois de javac Main.java, confirme Main.class. Depois de java Main, confirme a mensagem. Cada comando produz um tipo diferente de evidência.' }] },
  { id: 'ide', label: 'Run e Debug', duration: '18 min', eyebrow: 'Etapa 5', title: 'Veja o IntelliJ executar a mesma classe e pare antes do println', blocks: [{ type: 'lead', text: 'A IDE automatiza build e launcher, mas não muda o modelo. Abra Main.java, use o ícone ao lado de main e compare Run com Debug. No breakpoint, observe o console antes e depois da instrução.' }, { type: 'ideaLab' }] },
  { id: 'ordem', label: 'Fluxo sequencial', duration: '12 min', eyebrow: 'Etapa 6', title: 'Acompanhe o console crescer de cima para baixo', blocks: [{ type: 'lead', text: 'Sem desvios, a JVM executa as instruções na ordem em que aparecem dentro de main. Avance uma linha de cada vez e antecipe o próximo estado do console.' }, { type: 'sequenceLab' }, { type: 'note', tone: 'info', title: 'A base do fluxo', text: 'if, for, while e chamadas de método alterarão o caminho em aulas futuras. A referência inicial é uma sequência previsível.' }] },
  { id: 'dominio', label: 'Três programas', duration: '24 min', eyebrow: 'Etapa 7', title: 'Repita a estrutura em dois pequenos contextos de backend', blocks: [{ type: 'lead', text: 'Não fique preso ao nome Main. Compile e execute os três arquivos. Ordem de serviço e pedido ainda usam textos fixos, mas já representam uma saída de domínio que depois receberá variáveis, objetos, banco e API.' }, { type: 'programWorkbench' }] },
  { id: 'erros', label: 'Clínica de erros', duration: '28 min', eyebrow: 'Etapa 8', title: 'Descubra em qual fase cada erro nasce e repita a prova certa', blocks: [{ type: 'lead', text: 'Nem toda falha nasce no compilador. Alguns códigos geram .class, mas o launcher rejeita o ponto de entrada. Explore os dez casos e leia a mensagem antes de olhar a correção.' }, { type: 'errorClinic' }, { type: 'note', tone: 'warning', title: 'A seta não é uma sentença absoluta', text: 'O marcador ^ aponta onde o compilador perdeu o entendimento. Uma chave ausente antes pode fazer o erro aparecer no fim do arquivo.' }] },
  { id: 'entrega', label: 'Evidências e Git', duration: '18 min', eyebrow: 'Etapa final', title: 'Entregue fonte explicável, bytecode ignorado e um diagnóstico reproduzível', blocks: [{ type: 'lead', text: 'Finalize como profissional: inspecione o que existe, mantenha *.class fora do histórico, adicione apenas caminhos nominais, revise o staged diff e registre o que você realmente observou.' }, { type: 'gitDelivery' }, { type: 'challenge', title: 'Defesa oral do primeiro programa', text: 'Sem consultar o texto, digite Main.java, execute e explique classe, main, println, fonte, bytecode e JVM. Depois provoque um erro, leia o diagnóstico, corrija e repita a prova.', acceptance: ['Main.java compila e java Main exibe a mensagem prevista.', 'ResumoOrdemServico e ResumoPedido compilam e executam.', 'Você explica a assinatura sem dizer apenas “é assim porque sim”.', 'O staged diff contém fontes e registro; nenhum .class.', 'A transição correta é para a Aula 022: blocos, chaves, indentação e leitura.'] }] }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return <button type="button" className="fp21-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java' }) {
  return <div className="guided-file fp21-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.82rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function CodeXray() {
  const [selected, setSelected] = useState(0);
  const item = XRAY_PARTS[selected];
  return <section className="fp21-xray"><CodePanel name="Main.java" code={HELLO_CODE} /><div className="fp21-xray-controls" role="tablist" aria-label="Partes do primeiro programa">{XRAY_PARTS.map((part, index) => <button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={part.id}><span>{String(index + 1).padStart(2, '0')}</span><strong>{part.token}</strong></button>)}</div><article role="tabpanel"><Code2 size={22} /><div><small>{item.role}</small><h3>{item.token}</h3><p>{item.meaning}</p></div></article></section>;
}

function ClassShell() {
  const [choice, setChoice] = useState('Main.java');
  const ok = choice === 'Main.java';
  return <section className="fp21-class-shell"><div className="fp21-name-contract"><div><FileText size={26} /><small>Arquivo</small><strong>{choice}</strong></div><ChevronRight size={22} /><div className={ok ? 'ok' : 'bad'}><Braces size={26} /><small>Classe pública</small><strong>public class Main</strong></div></div><div className="fp21-name-choices" role="group" aria-label="Escolha o arquivo da classe Main">{['Main.java', 'main.java', 'Programa.java'].map(name => <button type="button" className={choice === name ? 'active' : ''} onClick={() => setChoice(name)} key={name}>{name}</button>)}</div><p className={ok ? 'fp21-feedback ok' : 'fp21-feedback bad'}>{ok ? <CheckCircle2 size={17} /> : <TriangleAlert size={17} />}{ok ? 'Contrato coerente: nome público e nome do arquivo coincidem.' : 'O compilador rejeitará: Main é case-sensitive e a classe pública exige Main.java.'}</p><div className="fp21-nesting" aria-label="Mapa inicial de pertencimento"><span><Box size={18} /><strong>classe Main</strong><small>bloco externo</small></span><ArrowDown size={18} /><span><Code2 size={18} /><strong>método main</strong><small>dentro da classe</small></span><ArrowDown size={18} /><span><Terminal size={18} /><strong>println</strong><small>dentro do método</small></span></div></section>;
}

function MainAnatomy() {
  const [selected, setSelected] = useState(0);
  const item = MAIN_PARTS[selected];
  return <section className="fp21-main-anatomy"><div className="fp21-signature" role="tablist">{MAIN_PARTS.map((part, index) => <button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={part.token}>{part.token}</button>)}<span>{'{'}</span></div><article role="tabpanel"><span className="fp21-launcher"><Terminal size={18} /> java Main</span><ChevronRight size={20} /><div><small>O launcher verifica</small><h3>{item.token} · {item.title}</h3><p>{item.text}</p></div></article><div className="fp21-main-proof"><span>Também válido como nome do parâmetro</span><code>public static void main(String[] argumentos)</code></div></section>;
}

function OutputLab() {
  const [mode, setMode] = useState('println');
  const [literal, setLiteral] = useState('text');
  const code = mode === 'println' ? 'System.out.println("Linha 1");\nSystem.out.println("Linha 2");' : 'System.out.print("Linha 1");\nSystem.out.print("Linha 2");';
  const output = mode === 'println' ? 'Linha 1\nLinha 2' : 'Linha 1Linha 2';
  const literalCode = literal === 'text' ? '"Olá, Java!"' : literal === 'char' ? "'A'" : "'Olá, Java!'";
  const literalOk = literal !== 'wrong';
  return <section className="fp21-output-lab"><div className="fp21-route"><span><strong>System</strong><small>classe</small></span><ChevronRight size={18} /><span><strong>out</strong><small>saída padrão</small></span><ChevronRight size={18} /><span><strong>println</strong><small>imprime + nova linha</small></span></div><div className="fp21-output-tabs"><button type="button" className={mode === 'println' ? 'active' : ''} onClick={() => setMode('println')}>println</button><button type="button" className={mode === 'print' ? 'active' : ''} onClick={() => setMode('print')}>print</button></div><div className="fp21-code-console"><CodePanel name="Main.java · trecho" code={code} /><div className="fp21-console"><header><Terminal size={16} /> Console</header><pre>{output}</pre></div></div><div className="fp21-literals"><div><strong>Escolha um literal</strong>{[['text', 'texto'], ['char', 'caractere'], ['wrong', 'erro proposital']].map(([id, label]) => <button type="button" className={literal === id ? 'active' : ''} onClick={() => setLiteral(id)} key={id}>{label}</button>)}</div><code>{literalCode}</code><p className={literalOk ? 'ok' : 'bad'}>{literal === 'text' ? 'Aspas duplas delimitam uma String.' : literal === 'char' ? 'Aspas simples delimitam um único char.' : 'Vários caracteres não cabem em um literal char. Use aspas duplas.'}</p></div><aside><CircleDot size={18} /><span><strong>O ponto e vírgula encerra a instrução.</strong> Sem <code>;</code>, javac interrompe a compilação e aponta <code>';' expected</code>.</span></aside></section>;
}

function TerminalLab() {
  const [step, setStep] = useState(0);
  const current = TERMINAL_STEPS[step];
  return <section className="fp21-terminal-lab"><nav aria-label="Passos do primeiro build">{TERMINAL_STEPS.map((item, index) => <button type="button" className={(step === index ? 'active ' : '') + (index < step ? 'done' : '')} onClick={() => setStep(index)} key={item.command}><span>{index < step ? <Check size={13} /> : index + 1}</span><strong>{['Raiz', 'Pasta', 'Fonte', 'Compilar', 'Inspecionar', 'Executar'][index]}</strong></button>)}</nav><div className="fp21-terminal-window"><header><Terminal size={16} /> PowerShell <small>saída didática esperada</small></header><pre><span>PS&gt; {current.command}</span>{'\n'}{current.output}</pre></div><div className="fp21-terminal-state"><article><Folder size={20} /><div><small>Estado relevante do disco</small>{current.files.map(file => <code key={file}>{file}</code>)}</div></article><p><Lightbulb size={18} />{current.note}</p></div><div className="fp21-lab-actions"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Voltar</button><span>{step + 1} de {TERMINAL_STEPS.length}</span><button type="button" disabled={step === TERMINAL_STEPS.length - 1} onClick={() => setStep(step + 1)}>Executar próximo passo <ArrowRight size={16} /></button></div></section>;
}

function IdeaLab() {
  const [mode, setMode] = useState('run');
  const [debugPhase, setDebugPhase] = useState('before');
  const output = mode === 'run' || debugPhase === 'after' ? 'Olá, Java!\n\nProcess finished with exit code 0' : 'Programa pausado na linha 3.\nA instrução ainda não executou.';
  return <section className="fp21-idea"><header><span><Code2 size={16} /> aula-021-primeiro-programa-java</span><div><button type="button" className={mode === 'run' ? 'active' : ''} onClick={() => setMode('run')}><Play size={14} /> Run</button><button type="button" className={mode === 'debug' ? 'active' : ''} onClick={() => { setMode('debug'); setDebugPhase('before'); }}><Bug size={14} /> Debug</button></div></header><main><aside><strong>Project</strong><span><Folder size={15} /> aula-021...</span><span className="selected"><FileCode2 size={15} /> Main.java</span></aside><section><div className="fp21-editor-tab">Main.java</div><pre><span>1  <b>public class</b> Main {'{'}</span>{'\n'}<span>2      <b>public static void</b> main(String[] args) {'{'}</span>{'\n'}<span className={mode === 'debug' ? 'debug-line' : ''}>3  <i />        System.out.println(<em>"Olá, Java!"</em>);</span>{'\n'}<span>4      {'}'}</span>{'\n'}<span>5  {'}'}</span></pre>{mode === 'debug' && <div className="fp21-debug-controls"><button type="button" className={debugPhase === 'before' ? 'active' : ''} onClick={() => setDebugPhase('before')}>1 · Breakpoint</button><ChevronRight size={17} /><button type="button" className={debugPhase === 'after' ? 'active' : ''} onClick={() => setDebugPhase('after')}>2 · Step Over (F8)</button></div>}</section></main><footer><nav><button type="button" className="active">{mode === 'debug' ? 'Debug' : 'Run'}</button><button type="button">Console</button></nav><pre>{output}</pre></footer><p><MonitorPlay size={18} /><span><strong>{mode === 'run' ? 'Run executa até o fim.' : debugPhase === 'before' ? 'O breakpoint para antes da linha.' : 'Step Over executou println e o console mudou.'}</strong>{mode === 'debug' ? ' Shift+F9 inicia Debug, F8 avança e F9 continua; se o keymap variar, use Ctrl+Shift+A e procure a ação.' : ' Confirme também pelo terminal para manter o modelo visível.'}</span></p></section>;
}

function SequenceLab() {
  const lines = ['Passo 1', 'Passo 2', 'Passo 3'];
  const [executed, setExecuted] = useState(0);
  const code = ['public class Main {', '    public static void main(String[] args) {', ...lines.map(line => `        System.out.println("${line}");`), '    }', '}'].join('\n');
  return <section className="fp21-sequence"><div className="fp21-code-console"><CodePanel name="Main.java" code={code} /><div className="fp21-console"><header><Terminal size={16} /> Console · {executed}/3 instruções</header><pre>{lines.slice(0, executed).join('\n') || '[ainda vazio]'}</pre></div></div><div className="fp21-sequence-track">{lines.map((line, index) => <React.Fragment key={line}><button type="button" className={executed === index + 1 ? 'active' : executed > index + 1 ? 'done' : ''} onClick={() => setExecuted(index + 1)}><span>{executed > index ? <Check size={14} /> : index + 1}</span><strong>{line}</strong></button>{index < lines.length - 1 && <ChevronRight size={18} />}</React.Fragment>)}</div><button type="button" className="fp21-reset" onClick={() => setExecuted(0)}><RotateCcw size={15} /> Reiniciar console</button></section>;
}

function ProgramWorkbench() {
  const [selected, setSelected] = useState(0);
  const program = PROGRAMS[selected];
  return <section className="fp21-workbench"><nav role="tablist">{PROGRAMS.map((item, index) => <button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={item.file}><FileCode2 size={16} /><span><strong>{item.name}</strong><small>{item.file}</small></span></button>)}</nav><p><Compass size={18} />{program.purpose}</p><div className="fp21-workbench-grid"><CodePanel name={program.file} code={program.code} /><div><section><small>1 · Compilar</small><code>{program.compile}</code></section><section><small>2 · Executar</small><code>{program.run}</code></section><div className="fp21-console"><header><Terminal size={16} /> Saída esperada</header><pre>{program.output}</pre></div></div></div><aside><CheckCircle2 size={18} /><span><strong>Contrato de nome:</strong> {program.name} usa PascalCase e coincide exatamente com {program.file}. O bytecode gerado será {program.name}.class.</span></aside></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="fp21-errors"><nav aria-label="Dez erros do primeiro programa">{ERRORS.map((error, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={error.title}><span>{index + 1}</span>{error.title}</button>)}</nav><article><header><AlertTriangle size={23} /><div><small>{item.phase}</small><h3>{item.title}</h3></div></header><div className="fp21-error-grid"><section><small>Código ou comando problemático</small><pre>{item.bad}</pre><code>PS&gt; {item.command}</code></section><section><small>Diagnóstico representativo</small><pre className="diagnostic">{item.diagnostic}</pre></section></div><div className="fp21-diagnosis"><section><Search size={18} /><span><strong>Causa</strong>{item.cause}</span></section><ChevronRight size={18} /><section><Wrench size={18} /><span><strong>Correção e nova prova</strong>{item.fix}</span></section></div></article></section>;
}

function GitDelivery() {
  const files = [
    ['Main.java', 'versionar', true],
    ['ResumoOrdemServico.java', 'versionar', true],
    ['ResumoPedido.java', 'versionar', true],
    ['docs/diario-de-bordo.md', 'versionar', true],
    ['Main.class', 'gerado · ignorar', false],
    ['ResumoPedido.class', 'gerado · ignorar', false]
  ];
  return <section className="fp21-delivery"><div className="fp21-stage"><header><GitBranch size={20} /><div><small>Mesa de preparação</small><h3>Fonte conta a história; bytecode pode ser recriado</h3></div></header><div>{files.map(([name, role, stage]) => <article className={stage ? 'source' : 'generated'} key={name}>{stage ? <FileCode2 size={17} /> : <PackageCheck size={17} />}<span><strong>{name}</strong><small>{role}</small></span><b>{stage ? 'stage' : '*.class'}</b></article>)}</div></div><div className="fp21-git-command"><CodePanel name="PowerShell · inspeção e entrega nominal" language="powershell" code={'git status\ngit diff\n\n# confirme que .gitignore contém *.class\ngit add labs/m1/aula-021-primeiro-programa-java docs/diario-de-bordo.md .gitignore\ngit diff --staged\ngit commit -m "Aula 021: cria primeiro programa Java"\ngit status'} /><aside><TriangleAlert size={19} /><span><strong>Não copie o commit antes de revisar.</strong> Se um .class aparecer no staged diff, pare, corrija o ignore e retire somente o arquivo gerado do stage. Preserve outras mudanças existentes.</span></aside></div><div className="guided-file fp21-evidence"><div className="guided-file-title"><BookOpenCheck size={17} /> docs/primeiro-programa-java.md <CopyButton value={EVIDENCE_DOC} label="Copiar modelo" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.8rem', lineHeight: 1.65 }}>{EVIDENCE_DOC}</SyntaxHighlighter></div></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'xray') return <CodeXray />;
  if (block.type === 'classShell') return <ClassShell />;
  if (block.type === 'mainAnatomy') return <MainAnatomy />;
  if (block.type === 'outputLab') return <OutputLab />;
  if (block.type === 'terminalLab') return <TerminalLab />;
  if (block.type === 'ideaLab') return <IdeaLab />;
  if (block.type === 'sequenceLab') return <SequenceLab />;
  if (block.type === 'programWorkbench') return <ProgramWorkbench />;
  if (block.type === 'errorClinic') return <ErrorClinic />;
  if (block.type === 'gitDelivery') return <GitDelivery />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Compass size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedFirstJavaProgramLesson021({
  isCompleted,
  onToggleCompleted,
  onNextLesson,
  onPrevLesson,
  hasNextLesson,
  hasPrevLesson
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LESSON_STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify([...completedStepIds])), [completedStepIds]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const completedLabel = useMemo(() => completedStepIds.size + ' de ' + steps.length + ' etapas concluídas', [completedStepIds]);

  useEffect(() => {
    if (completionNormalizedRef.current) return;
    completionNormalizedRef.current = true;
    if (isCompleted && !allStepsComplete) onToggleCompleted();
  }, [allStepsComplete, isCompleted, onToggleCompleted]);

  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleActiveStep = () => {
    if (activeStepComplete && isCompleted) onToggleCompleted();
    setCompletedStepIds(previous => {
      const next = new Set(previous);
      if (next.has(activeStep.id)) next.delete(activeStep.id);
      else next.add(activeStep.id);
      return next;
    });
  };

  return <article className="guided-git-lesson guided-first-java-program-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy"><span className="guided-kicker"><Braces size={17} /> Oficina de fundamentos Java</span><p className="guided-sequence">021 · M1.01</p><h1>Seu primeiro programa, sem nenhuma palavra mágica</h1><p>Desmonte classe, ponto de entrada e saída; depois compile, execute, depure, provoque erros e defenda cada evidência.</p></div>
      <div className="guided-hero-status"><Code2 size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
      <div className="guided-progress-track" aria-label={'Progresso: ' + progress + '%'}><span style={{ width: progress + '%' }} /></div>
    </header>

    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 3, label: 'camadas explicáveis' }, { value: 3, label: 'programas executados' }, { value: 10, label: 'falhas diagnosticáveis' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 021"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={activeStep.id + '-' + block.type + '-' + index} />)}</div>
        <div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (activeStepComplete ? 'undo' : 'complete')} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>
        {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Primeiro programa registrado' : 'Oficina concluída'}</h3><p>{lessonComplete ? 'Etapas, práticas e conclusão geral estão registradas.' : 'Conclua a aula para liberar a leitura profunda de blocos e chaves.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
      </main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 020</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsComplete ? 'ready' : '')}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : completedStepIds.size + ' de ' + steps.length + ' etapas'}</strong><small>{lessonComplete ? 'Programa explicado e provado' : allStepsComplete ? 'Use o botão acima' : 'Leia, execute e diagnostique'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir blocos, chaves e indentação'}>Aula 022 <ArrowRight size={17} /></button></footer>
  </article>;
}
