import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy,
  FileCode2, KeyRound, Lightbulb, ListChecks, Menu, Play, RefreshCw,
  RotateCcw, Search, Sparkles, Terminal, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedDoWhileLesson.css';

const STORAGE_KEY = 'guided-do-while-lesson-040-progress';

const FIRST_RUN_CODE = `public class PrimeiraExecucao {
    public static void main(String[] args) {
        int contador = 10;

        do {
            System.out.println("Executou com contador: " + contador);
            contador++;
        } while (contador <= 5);

        System.out.println("Fim");
    }
}`;

const MENU_CODE = `import java.util.Scanner;

public class MenuDoWhile {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int opcao;

        do {
            System.out.println("1 - Cadastrar");
            System.out.println("2 - Consultar");
            System.out.println("0 - Sair");
            opcao = scanner.nextInt();

            String mensagem = switch (opcao) {
                case 1 -> "Cadastrar";
                case 2 -> "Consultar";
                case 0 -> "Saindo";
                default -> "Opção inválida";
            };
            System.out.println(mensagem);
        } while (opcao != 0);

        scanner.close();
    }
}`;

const PATTERNS = [
  {
    label: 'Quantidade', file: 'ValidacaoQuantidadeDoWhile.java',
    code: `int quantidade;
do {
    System.out.println("Digite uma quantidade maior que zero:");
    quantidade = scanner.nextInt();
    if (quantidade <= 0) {
        System.out.println("Quantidade inválida");
    }
} while (quantidade <= 0);
System.out.println("Quantidade válida: " + quantidade);`,
    input: '-2, depois 4', output: 'Quantidade inválida\nQuantidade válida: 4',
    lesson: 'Primeiro coleta, depois valida. A condição descreve o estado inválido que exige nova tentativa.'
  },
  {
    label: 'Nome e confirmação', file: 'ConfirmacaoDoWhile.java',
    code: `String continuar;
do {
    System.out.println("Executando operação");
    System.out.println("Deseja executar novamente? S/N");
    continuar = scanner.nextLine().trim().toUpperCase();
} while ("S".equals(continuar));
System.out.println("Fim");`,
    input: '" s ", depois "n"', output: 'Executando operação\nExecutando operação\nFim',
    lesson: 'trim() remove espaços nas pontas; toUpperCase() normaliza a resposta. "S".equals(...) faz a comparação textual.'
  },
  {
    label: 'Senha limitada', file: 'SenhaDoWhile.java',
    code: `String senhaCorreta = "java123";
String senhaInformada;
int tentativas = 0;
int limiteTentativas = 3;
do {
    System.out.println("Digite a senha:");
    senhaInformada = scanner.nextLine();
    tentativas++;
} while (!senhaCorreta.equals(senhaInformada)
        && tentativas < limiteTentativas);
System.out.println(senhaCorreta.equals(senhaInformada)
        ? "Acesso autorizado" : "Acesso bloqueado");`,
    input: 'errada, errada, java123', output: 'Digite a senha: (3 vezes)\nAcesso autorizado',
    lesson: 'A repetição só continua quando as duas regras são verdadeiras: senha errada E ainda há tentativa disponível.'
  },
  {
    label: 'Pedido e produto', file: 'ValidacoesDeDominio.java',
    code: `int quantidadeItens;
do {
    quantidadeItens = scanner.nextInt();
} while (quantidadeItens <= 0);

long valorTotalCentavos;
do {
    valorTotalCentavos = scanner.nextLong();
} while (valorTotalCentavos <= 0);

System.out.println("Pedido válido");`,
    input: '0, 3, -500, 7500', output: 'Pedido válido\nQuantidade: 3\nValor: 7500 centavos',
    lesson: 'Pedido, produto, cliente e OS mudam o domínio, mas reutilizam o mesmo padrão: coletar, explicar a falha e repetir enquanto inválido.'
  },
  {
    label: 'nextInt + nextLine', file: 'MenuCadastroClienteDoWhile.java',
    code: `opcao = scanner.nextInt();
scanner.nextLine(); // consome o fim da linha do número

System.out.println("Digite o nome do cliente:");
String nome = scanner.nextLine();`,
    input: '1↵, depois Ana↵', output: 'Digite o nome do cliente:\nCliente cadastrado: Ana',
    lesson: 'nextInt() deixa o separador de linha pendente. O nextLine() intermediário o consome antes da leitura do nome.'
  },
  {
    label: 'break e continue', file: 'ControleDoWhile.java',
    code: `int contador = 0;
do {
    contador++;
    if (contador == 3) continue;
    if (contador == 5) break;
    System.out.println(contador);
} while (contador < 10);`,
    input: 'sem entrada', output: '1\n2\n4',
    lesson: 'continue vai ao teste final do do while; break encerra o laço. Para o fluxo principal, uma condição clara costuma comunicar melhor.'
  }
];

const ERRORS = [
  { title: 'Sem ponto e vírgula final', code: `do {\n    System.out.println("Olá");\n} while (continuar)`, symptom: "';' expected", cause: 'No do while, o ponto e vírgula encerra a instrução while final.', fix: 'Use } while (continuar);' },
  { title: 'Variável nunca muda', code: `int opcao = 1;\ndo {\n    System.out.println("Menu");\n} while (opcao != 0);`, symptom: 'O menu é impresso sem parar.', cause: 'opcao continua valendo 1; portanto opcao != 0 nunca fica false.', fix: 'Leia ou atualize opcao dentro do bloco e mantenha uma saída observável.' },
  { title: 'Condição invertida', code: `do {\n    opcao = scanner.nextInt();\n} while (opcao == 0);`, symptom: 'Digitar 1 encerra; digitar 0 repete.', cause: 'A condição descreve quando repetir, não quando sair.', fix: 'Para 0 significar sair, use while (opcao != 0);' },
  { title: 'Processa dado inválido uma vez', code: `int quantidade = -10;\ndo {\n    processar(quantidade);\n} while (quantidade > 0);`, symptom: 'processar(-10) é chamado uma vez.', cause: 'do while executa antes do primeiro teste.', fix: 'Valide antes com while, ou use o do apenas para coletar uma nova quantidade.' },
  { title: 'Direção errada', code: `int contador = 5;\ndo {\n    contador++;\n} while (contador >= 1);`, symptom: 'Loop infinito crescente.', cause: 'O incremento afasta o valor da condição de término.', fix: 'Para contar de 5 até 1, use contador--.' },
  { title: 'Quebra de linha pendente', code: `opcao = scanner.nextInt();\nString nome = scanner.nextLine();`, symptom: 'nome recebe texto vazio imediatamente.', cause: 'nextInt() não consome o fim da linha digitada.', fix: 'Chame scanner.nextLine() uma vez antes de ler o nome.' },
  { title: 'Menu sem saída ou default', code: `do {\n    opcao = scanner.nextInt();\n    switch (opcao) { case 1 -> cadastrar(); }\n} while (true);`, symptom: 'Não há caminho claro para encerrar e opções desconhecidas parecem ignoradas.', cause: 'O contrato do menu não definiu sentinela nem resposta para opção inválida.', fix: 'Exiba 0 - Sair, use while (opcao != 0) e trate default.' },
  { title: 'do while escolhido por hábito', code: `int pendentes = 0;\ndo {\n    enviarMensagem();\n} while (pendentes > 0);`, symptom: 'Uma mensagem é enviada mesmo sem pendências.', cause: 'Este trabalho pode legitimamente executar zero vezes.', fix: 'Use while (pendentes > 0) quando a pré-condição precisa ser confirmada antes.' }
];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); }
  };
  return <button type="button" className="dw40-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file dw40-code">
    <div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div>
    <SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter>
  </div>;
}

function LoopComparisonLab() {
  const [initial, setInitial] = useState(10);
  const whileRuns = initial <= 5 ? 6 - initial : 0;
  const doRuns = Math.max(1, whileRuns);
  return <section className="dw40-comparison" aria-label="Comparação interativa entre while e do while">
    <div className="dw40-controls">
      <span>contador inicial</span>
      {[1, 5, 10].map(value => <button type="button" key={value} className={initial === value ? 'active' : ''} onClick={() => setInitial(value)}>{value}</button>)}
    </div>
    <div className="dw40-lanes">
      <div className="dw40-lane">
        <header><span>while</span><strong>{whileRuns} execução{whileRuns === 1 ? '' : 'ões'}</strong></header>
        <div className="dw40-flow"><b>testa</b><i>contador ≤ 5 → {initial <= 5 ? 'true' : 'false'}</i><b className={whileRuns ? 'yes' : 'no'}>{whileRuns ? 'executa' : 'não entra'}</b></div>
        <p>Testa antes. Com contador 10, protege o bloco e executa zero vezes.</p>
      </div>
      <div className="dw40-lane emphasis">
        <header><span>do while</span><strong>{doRuns} execução{doRuns === 1 ? '' : 'ões'}</strong></header>
        <div className="dw40-flow"><b className="yes">executa</b><i>contador vira {initial + 1}</i><b>testa: {initial + 1} ≤ 5 → {initial + 1 <= 5 ? 'true' : 'false'}</b></div>
        <p>Executa antes. Mesmo começando em 10, produz uma evidência e só então decide se repete.</p>
      </div>
    </div>
  </section>;
}

function ConsoleRunLab() {
  const [ran, setRan] = useState(false);
  return <section className="dw40-build-lab">
    <CodePanel name="PrimeiraExecucao.java" code={FIRST_RUN_CODE} />
    <div className="dw40-terminal">
      <header><Terminal size={15} /> PowerShell <button type="button" onClick={() => setRan(false)}><RefreshCw size={13} /> Limpar</button></header>
      <pre><strong>PS&gt; javac PrimeiraExecucao.java</strong>{ran ? '\nPS&gt; java PrimeiraExecucao\nExecutou com contador: 10\nFim' : '\n(compilação sem mensagens = sucesso)'}</pre>
      <button type="button" className="dw40-run" onClick={() => setRan(true)}><Play size={15} /> Executar programa</button>
    </div>
  </section>;
}

function MenuSimulator() {
  const [history, setHistory] = useState(['Menu aberto — escolha uma opção.']);
  const [closed, setClosed] = useState(false);
  const choose = value => {
    const result = value === 1 ? 'Cadastrar' : value === 2 ? 'Consultar' : value === 0 ? 'Saindo' : 'Opção inválida';
    setHistory(previous => [...previous, `> ${value}`, result, ...(value === 0 ? [] : ['Menu exibido novamente.'])]);
    if (value === 0) setClosed(true);
  };
  const reset = () => { setHistory(['Menu aberto — escolha uma opção.']); setClosed(false); };
  return <section className="dw40-menu-lab">
    <div className="dw40-menu-mock">
      <header><Menu size={17} /> Menu do sistema <span>{closed ? 'encerrado' : 'aguardando entrada'}</span></header>
      <div className="dw40-menu-actions">
        {[['1', 'Cadastrar'], ['2', 'Consultar'], ['9', 'Inválida'], ['0', 'Sair']].map(([value, label]) => <button type="button" key={value} disabled={closed} onClick={() => choose(Number(value))}><b>{value}</b>{label}</button>)}
      </div>
      <button type="button" className="dw40-reset" onClick={reset}><RefreshCw size={14} /> Reiniciar menu</button>
    </div>
    <div className="dw40-terminal">
      <header><Terminal size={15} /> Console da simulação</header>
      <pre>{history.join('\n')}</pre>
      <p><Lightbulb size={16} /> O menu aparece antes de existir uma opção. Depois da leitura, 0 transforma <code>opcao != 0</code> em false.</p>
    </div>
  </section>;
}

function PatternGallery() {
  const [selected, setSelected] = useState(0);
  const item = PATTERNS[selected];
  return <section className="dw40-gallery">
    <nav>{PATTERNS.map((entry, index) => <button type="button" key={entry.label} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>{entry.label}</button>)}</nav>
    <div className="dw40-gallery-content">
      <CodePanel name={item.file} code={item.code} />
      <div className="dw40-evidence"><span><strong>Entrada de teste</strong>{item.input}</span><span><strong>Saída observável</strong><pre>{item.output}</pre></span><p><Sparkles size={16} /> {item.lesson}</p></div>
    </div>
  </section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="dw40-clinic">
    <nav>{ERRORS.map((entry, index) => <button type="button" key={entry.title} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span>{entry.title}</button>)}</nav>
    <div className="dw40-diagnosis">
      <header><AlertTriangle size={20} /><div><small>Caso {selected + 1} de {ERRORS.length}</small><h3>{item.title}</h3></div></header>
      <CodePanel name="Código sob investigação" code={item.code} />
      <div className="dw40-symptom"><strong>Sintoma</strong><code>{item.symptom}</code></div>
      <div className="dw40-recovery"><span><Search size={16} /><div><strong>Causa</strong><p>{item.cause}</p></div></span><span><Wrench size={16} /><div><strong>Correção</strong><p>{item.fix}</p></div></span></div>
    </div>
  </section>;
}

const EVIDENCE = `# Aula 040 — Do While

- [ ] Provei a diferença entre testar antes e executar antes
- [ ] Compilei e executei PrimeiraExecucao.java
- [ ] Expliquei por que o ponto e vírgula final é obrigatório
- [ ] Criei menu com sentinela 0 e opção inválida
- [ ] Validei número e texto até ficarem válidos
- [ ] Limitei senha com condição composta
- [ ] Corrigi nextInt() seguido de nextLine()
- [ ] Testei primeira saída, entrada inválida e saída imediata
- [ ] Diagnostiquei loop infinito e condição invertida
- [ ] Comparei quando usar while e do while

## Decisão
O bloco precisa executar antes do primeiro teste porque:
O estado que garante o término é atualizado em:`;

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: 'Criar o laboratório', command: 'New-Item -ItemType Directory -Force labs\\m1\\aula-040-do-while\ncd labs\\m1\\aula-040-do-while', output: 'Directory: ...\\labs\\m1\\aula-040-do-while', note: 'Crie os arquivos conforme praticá-los; não é necessário digitar dezenove programas repetitivos de uma vez.' },
    { title: 'Compilar e executar', command: 'javac PrimeiraExecucao.java MenuDoWhile.java SenhaDoWhile.java\njava PrimeiraExecucao\njava MenuDoWhile', output: 'Executou com contador: 10\nFim\n... menu interativo ...', note: 'javac sem mensagem indica sucesso. Compare sua saída linha a linha com a evidência da aula.' },
    { title: 'Testar fronteiras', command: 'java MenuDoWhile\n# teste: 0 logo de primeira\n# teste: 9 e depois 0\n# teste: 1 e depois 0', output: 'Saindo\nOpção inválida ... Saindo\nCadastrar ... Saindo', note: 'A primeira execução, a entrada inválida e o sentinela imediato são testes obrigatórios.' },
    { title: 'Registrar e versionar', command: 'git status\ngit diff\ngit add labs/m1/aula-040-do-while docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 040: pratica do while em Java"\ngit status', output: 'nothing to commit, working tree clean', note: 'Se arquivos .class aparecerem, não os adicione; confirme a regra *.class no .gitignore.' }
  ];
  const current = stages[stage];
  return <section>
    <div className="dw40-delivery-nav">{stages.map((entry, index) => <button type="button" key={entry.title} className={index === stage ? 'active' : ''} onClick={() => setStage(index)}><span>{index + 1}</span>{entry.title}</button>)}</div>
    <div className="dw40-terminal"><header><Terminal size={15} /> PowerShell <small>passo {stage + 1} de {stages.length}</small></header><pre><strong>PS&gt; {current.command}</strong>{'\n\n'}{current.output}</pre><p><Lightbulb size={16} /> {current.note}</p></div>
    <div className="guided-file dw40-code dw40-diary"><div className="guided-file-title"><KeyRound size={16} /> docs/diario-de-bordo.md<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>{EVIDENCE}</SyntaxHighlighter></div>
  </section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'comparison') return <LoopComparisonLab />;
  if (block.type === 'run') return <ConsoleRunLab />;
  if (block.type === 'menu') return <><MenuSimulator /><CodePanel name="MenuDoWhile.java" code={MENU_CODE} /></>;
  if (block.type === 'patterns') return <PatternGallery />;
  if (block.type === 'errors') return <ErrorClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

const steps = [
  { id: 'ordem', label: 'Executar antes', eyebrow: 'Mapa mental', title: 'Veja a ordem mudar o comportamento do programa', duration: '8 min', blocks: [
    { type: 'lead', text: 'Troque o valor inicial e leia os dois fluxos. A pergunta não é qual laço é melhor, mas em qual momento a condição precisa proteger o bloco.' },
    { type: 'comparison' },
    { type: 'note', title: 'Contrato do do while', text: 'A ordem é sempre: executar o bloco, testar a condição e repetir somente se ela for true. Por isso há de 1 a N execuções.' }
  ] },
  { id: 'primeiro-programa', label: 'Primeiro programa', eyebrow: 'Código e evidência', title: 'Compile a prova de que a primeira execução é garantida', duration: '12 min', blocks: [
    { type: 'lead', text: 'Digite o arquivo exatamente como está, compile e execute. A saída com contador 10 é a prova observável; não memorize apenas a definição.' },
    { type: 'run' },
    { type: 'note', tone: 'warning', title: 'O ; final faz parte da sintaxe', text: 'A forma completa termina em } while (condicao);. Sem esse ponto e vírgula, javac informa que esperava ";".' }
  ] },
  { id: 'menu', label: 'Menu e sentinela', eyebrow: 'Simulação de console', title: 'Mantenha um menu vivo até o usuário escolher sair', duration: '16 min', blocks: [
    { type: 'lead', text: 'Use os botões como se fossem entradas do Scanner. Observe quando o menu reaparece, como default trata 9 e como 0 encerra a repetição.' },
    { type: 'menu' },
    { type: 'note', title: 'Por que fica natural', text: 'No do while, opcao pode ser declarada sem um valor artificial: o menu aparece, a opção é lida e só depois opcao != 0 é testado.' }
  ] },
  { id: 'validacoes', label: 'Validações e controle', eyebrow: 'Padrões profissionais', title: 'Colete, normalize, limite e prove a saída', duration: '20 min', blocks: [
    { type: 'lead', text: 'Explore cada padrão, leia a entrada de teste e confira a saída. Os domínios originais foram consolidados sem apagar suas regras únicas.' },
    { type: 'patterns' },
    { type: 'note', tone: 'warning', title: 'Validação real tem limites', text: 'contains("@") serve apenas para praticar repetição; não é uma validação completa de e-mail. Em produção, a regra depende do contrato do sistema.' }
  ] },
  { id: 'diagnostico', label: 'Clínica de erros', eyebrow: 'Diagnóstico', title: 'Encontre a causa antes de alterar o código', duration: '16 min', blocks: [
    { type: 'lead', text: 'Percorra os oito casos. Em cada um, compare sintoma, causa e correção; depois reproduza pelo menos o erro do ponto e vírgula e a condição invertida.' },
    { type: 'errors' }
  ] },
  { id: 'entrega', label: 'Entrega e desafio', eyebrow: 'Prática autônoma', title: 'Teste fronteiras, registre evidências e transfira o conceito', duration: '18 min', blocks: [
    { type: 'lead', text: 'Finalize o laboratório com saídas verificáveis e um commit limpo. Depois resolva o desafio sem copiar o menu pronto.' },
    { type: 'delivery' },
    { type: 'challenge', title: 'Desafio: terminal de triagem de chamados', text: 'Crie TriagemChamados.java. O terminal deve aparecer pelo menos uma vez e aceitar: 1 para registrar um chamado, 2 para mostrar o total registrado e 0 para encerrar. Qualquer outro número deve produzir uma mensagem clara. Ao sair, imprima o total final.', acceptance: [
      'Use do while com a sentinela 0 e ponto e vírgula final.',
      'Use switch tradicional ou moderno com tratamento default.',
      'Incremente o total somente na opção 1.',
      'Teste 0 como primeira entrada, uma opção inválida e dois registros antes da saída.',
      'Compile sem erros, registre as saídas no diário e não versione arquivos .class.'
    ] }
  ] }
];

export default function GuidedDoWhileLesson040({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(saved) ? saved : []); } catch { return new Set(); }
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds])); }, [completedStepIds]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;

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
      if (next.has(activeStep.id)) next.delete(activeStep.id); else next.add(activeStep.id);
      return next;
    });
  };

  return <article className="guided-git-lesson guided-do-while-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy"><span className="guided-kicker"><RefreshCw size={17} /> Repetição pós-teste</span><p className="guided-sequence">040 · M1.20</p><h1>Do While — Execute Primeiro, Decida Depois</h1><p>Faça a primeira tentativa, observe o resultado e só então decida se repete. Você vai provar a diferença para o while, construir menus e validações, testar falhas e entregar um laboratório verificável.</p></div>
      <div className="guided-hero-status"><RefreshCw size={42} /><strong>{progress}%</strong><span>{completedStepIds.size} de {steps.length} etapas concluídas</span></div>
      <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
    </header>

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: '1..N', label: 'execuções' }, { value: '0', label: 'sentinela do menu' }, { value: '8', label: 'diagnósticos praticáveis' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 040">
        <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
        {steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}
      </nav>

      <main className="guided-step-content">
        <div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div>
        <div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div>
        <div className="guided-step-actions">
          <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button>
          <div className="guided-step-actions-main">
            <button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}</button>
            {activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}
          </div>
        </div>
        {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Do while dominado!</h3><p>{lessonComplete ? 'Primeira execução, sentinelas, validação e diagnóstico consolidados.' : 'Conclua a aula para consolidar a entrega.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
      </main>
    </div>

    <footer className="guided-course-nav">
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 039</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Do while consolidado' : allStepsComplete ? 'Use o botão acima' : 'Execute, observe e diagnostique'}</small></span></div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir For clássico'}>Aula 041 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
