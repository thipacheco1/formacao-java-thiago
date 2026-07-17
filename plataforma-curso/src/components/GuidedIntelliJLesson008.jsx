import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bug,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Copy,
  Eye,
  FileCode2,
  Footprints,
  Lightbulb,
  ListChecks,
  MonitorPlay,
  Play,
  RotateCcw,
  ShieldAlert,
  StepForward,
  TerminalSquare
} from 'lucide-react';
import './guidedLesson.css';
import './guidedIntelliJLesson.css';

const LESSON_STORAGE_KEY = 'guided-intellij-lesson-008-progress';

const javaSource = `public class DebugAtividade {
    public static void main(String[] args) {
        String status = "AGENDADO";
        boolean possuiDataValida = true;
        boolean clienteBloqueado = false;

        boolean podeReagendar = podeReagendar(
                status, possuiDataValida, clienteBloqueado);

        if (podeReagendar) {
            System.out.println("Atividade pode ser reagendada.");
        } else {
            System.out.println("Atividade não pode ser reagendada.");
        }
    }

    static boolean podeReagendar(String status,
            boolean possuiDataValida, boolean clienteBloqueado) {
        boolean statusPermitido = status.equals("AGENDADO")
                || status.equals("REAGENDADO");
        return statusPermitido && possuiDataValida && !clienteBloqueado;
    }
}`;

const sourceLines = javaSource.split('\n');

const javaKeywords = new Set([
  'abstract', 'break', 'case', 'catch', 'class', 'continue', 'default', 'do',
  'else', 'extends', 'final', 'finally', 'for', 'if', 'implements', 'import',
  'instanceof', 'interface', 'new', 'package', 'private', 'protected', 'public',
  'return', 'static', 'super', 'switch', 'this', 'throw', 'throws', 'try', 'while'
]);
const javaTypes = new Set(['boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short', 'void', 'String', 'System', 'DebugAtividade']);
const javaLiterals = new Set(['true', 'false', 'null']);

function highlightJavaLine(line) {
  const tokens = line.match(/\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b|&&|\|\||==|!=|>=|<=|./g) || [];

  return tokens.map((token, index) => {
    let className = '';
    if (token.startsWith('//')) className = 'idea-token-comment';
    else if (token.startsWith('"') || token.startsWith("'")) className = 'idea-token-string';
    else if (/^\d/.test(token)) className = 'idea-token-number';
    else if (javaKeywords.has(token)) className = 'idea-token-keyword';
    else if (javaTypes.has(token)) className = 'idea-token-type';
    else if (javaLiterals.has(token)) className = 'idea-token-literal';
    else if (/^[A-Za-z_$]/.test(token) && tokens.slice(index + 1).join('').trimStart().startsWith('(')) className = 'idea-token-method';
    else if (/^(?:&&|\|\||==|!=|>=|<=|[=+!*-])$/.test(token)) className = 'idea-token-operator';

    return className ? <span className={className} key={`${index}-${token}`}>{token}</span> : token;
  });
}

const steps = [
  {
    id: 'mapa',
    label: 'Mapa da aula',
    eyebrow: 'Comece aqui',
    title: 'Você vai investigar uma regra dentro do IntelliJ',
    duration: '4 min',
    blocks: [
      {
        type: 'lead',
        text: 'Nesta aula, debug deixa de ser uma lista de definições. Você vai criar um breakpoint, iniciar o programa pelo ícone correto, acompanhar uma chamada de método e descobrir por evidência por que uma regra permitiu ou bloqueou o reagendamento.'
      },
      {
        type: 'result',
        title: 'Ao final, você conseguirá',
        items: [
          'Distinguir Run de Debug sem depender do formato do ícone',
          'Criar e remover um breakpoint no gutter do editor',
          'Entender que a linha destacada ainda será executada',
          'Usar Step Over, Step Into, Step Out e Resume com intenção',
          'Ler Variables, Watches, Call Stack e Console',
          'Investigar if, laço, método e regra de negócio com uma hipótese'
        ]
      },
      { type: 'simulator', initialStage: 0, caption: 'Esta é uma simulação didática da interface. Os nomes e as áreas correspondem ao IntelliJ; pequenos detalhes visuais podem variar conforme a versão e o tema.' },
      {
        type: 'note',
        tone: 'info',
        title: 'Como acompanhar',
        text: 'Mantenha o IntelliJ aberto ao lado. Em cada etapa, repita o clique indicado e compare a linha destacada, os valores e a saída — não apenas o resultado final.'
      }
    ]
  },
  {
    id: 'preparar',
    label: 'Preparar o código',
    eyebrow: 'Etapa 1',
    title: 'Crie uma classe e confirme que a IDE reconheceu o programa',
    duration: '8 min',
    blocks: [
      {
        type: 'actions',
        title: 'Na janela Project, faça exatamente isto',
        items: [
          'Abra o projeto usado nas aulas anteriores.',
          'À esquerda, expanda src.',
          'Clique com o botão direito em src e escolha New → Java Class.',
          'Digite DebugAtividade e pressione Enter.',
          'Substitua o conteúdo pelo código abaixo e salve com Ctrl+S.'
        ]
      },
      { type: 'code', name: 'src/DebugAtividade.java', content: javaSource },
      {
        type: 'note',
        tone: 'warning',
        title: 'Não apareceu o triângulo verde perto de main?',
        text: 'Confira se o arquivo está dentro de uma pasta marcada como Sources Root e se o projeto possui um JDK configurado. A aula 007 prepara esse ambiente; não prossiga com erros vermelhos no editor.'
      },
      { type: 'simulator', initialStage: 0, caption: 'Antes do debug, identifique quatro regiões: Project à esquerda, editor no centro, gutter junto aos números de linha e ferramentas na parte inferior.' }
    ]
  },
  {
    id: 'run',
    label: 'Executar com Run',
    eyebrow: 'Etapa 2',
    title: 'Primeiro obtenha o resultado normal para ter uma referência',
    duration: '5 min',
    blocks: [
      {
        type: 'actions',
        title: 'Execute sem pausa',
        items: [
          'Clique no triângulo verde ao lado do método main.',
          'No menu que abrir, escolha Run \'DebugAtividade.main()\'.',
          'Olhe a janela Run na parte inferior e compare a saída.'
        ]
      },
      {
        type: 'console',
        label: 'Run — saída esperada',
        output: 'Atividade pode ser reagendada.\n\nProcess finished with exit code 0',
        explanation: 'Run responde “qual foi o resultado?”. Ainda não vimos como status, data e bloqueio produziram esse resultado.'
      },
      {
        type: 'compare',
        title: 'Escolha pelo objetivo',
        goodTitle: 'Run',
        good: ['Executa normalmente', 'Mostra saída e erros', 'Bom para confirmar o resultado'],
        badTitle: 'Debug',
        bad: ['Pode pausar em breakpoints', 'Expõe valores e chamadas', 'Bom para investigar o caminho']
      }
    ]
  },
  {
    id: 'breakpoint',
    label: 'Criar breakpoint',
    eyebrow: 'Etapa 3',
    title: 'Marque a linha onde a pergunta começa',
    duration: '6 min',
    blocks: [
      {
        type: 'lead',
        text: 'Nossa hipótese é: “o resultado depende dos três argumentos enviados a podeReagendar”. Por isso, vamos pausar antes da chamada, não dentro de um bloco que talvez nem seja executado.'
      },
      {
        type: 'actions',
        title: 'Clique no lugar certo',
        items: [
          'Localize a linha 7: boolean podeReagendar = podeReagendar(...).',
          'Leve o ponteiro à faixa estreita entre o número da linha e o código: esse é o gutter.',
          'Clique uma vez. Uma bolinha vermelha indica o breakpoint ativo.',
          'Clique novamente apenas se quiser removê-lo.'
        ]
      },
      { type: 'simulator', initialStage: 1, caption: 'Experimente no simulador: clique no gutter da linha 7. O marcador vermelho é a ordem “pare quando chegar aqui”.' },
      {
        type: 'note',
        tone: 'warning',
        title: 'Breakpoint cinza ou com aviso',
        text: 'A IDE ainda não conseguiu associá-lo a código executável. Salve o arquivo, corrija erros de compilação e confirme que você está executando esta classe.'
      }
    ]
  },
  {
    id: 'pausar',
    label: 'Iniciar o Debug',
    eyebrow: 'Etapa 4',
    title: 'Abra o programa pelo inseto e leia a primeira pausa',
    duration: '7 min',
    blocks: [
      {
        type: 'actions',
        title: 'Inicie pelo modo correto',
        items: [
          'Clique outra vez no triângulo verde perto de main.',
          'Escolha Debug \'DebugAtividade.main()\' — a opção traz o ícone de inseto.',
          'Espere a janela Debug abrir na parte inferior.',
          'Confirme que a linha 7 está destacada e que a execução está Suspended.'
        ]
      },
      { type: 'simulator', initialStage: 2, caption: 'A linha azul é a próxima instrução. Nesse instante, podeReagendar ainda não recebeu o resultado do método.' },
      {
        type: 'note',
        tone: 'danger',
        title: 'Detalhe que evita muita confusão',
        text: 'Quando o debugger para sobre uma linha, normalmente ela ainda não foi executada. Compare Variables antes e depois de avançar; o valor novo só aparece após a instrução terminar.'
      }
    ]
  },
  {
    id: 'navegar',
    label: 'Navegar no código',
    eyebrow: 'Etapa 5',
    title: 'Use cada botão para responder uma pergunta diferente',
    duration: '12 min',
    blocks: [
      { type: 'simulator', initialStage: 2, interactive: true, caption: 'Laboratório interativo: use Step Into para entrar no método, Step Over para executar a linha, Step Out para voltar e Resume para terminar.' },
      {
        type: 'controlGuide',
        items: [
          { name: 'Step Over', shortcut: 'F8', text: 'Executa a linha atual sem abrir o método chamado. Use para seguir o fluxo principal.' },
          { name: 'Step Into', shortcut: 'F7', text: 'Entra em um método seu. Use para conferir argumentos, cálculo e retorno.' },
          { name: 'Step Out', shortcut: 'Shift+F8', text: 'Termina o método atual e volta para quem o chamou.' },
          { name: 'Resume', shortcut: 'F9', text: 'Continua até o próximo breakpoint ou até o fim.' }
        ]
      },
      {
        type: 'note',
        tone: 'info',
        title: 'Regra prática para não se perder',
        text: 'Comece com Step Over. Use Step Into somente quando sua hipótese estiver dentro de um método seu. Se cair em código interno ou já viu o necessário, use Step Out.'
      }
    ]
  },
  {
    id: 'evidencias',
    label: 'Ler evidências',
    eyebrow: 'Etapa 6',
    title: 'Variables, Watches e Call Stack contam histórias diferentes',
    duration: '10 min',
    blocks: [
      { type: 'simulator', initialStage: 3, interactive: true, caption: 'Dentro de podeReagendar, Variables mostra os dados locais; Watches calcula uma expressão escolhida; Frames mostra que main chamou o método atual.' },
      {
        type: 'actions',
        title: 'Faça a inspeção no IntelliJ real',
        items: [
          'Em Variables, confirme status = "AGENDADO", possuiDataValida = true e clienteBloqueado = false.',
          'Na área Watches, clique em + e adicione: status.equals("AGENDADO") || status.equals("REAGENDADO").',
          'Use Step Over para criar statusPermitido e confira que ele vale true.',
          'Em Frames/Call Stack, selecione podeReagendar e depois main para observar o caminho da chamada.'
        ]
      },
      {
        type: 'result',
        title: 'O que cada área responde',
        items: [
          'Variables: quais valores existem neste ponto?',
          'Watches: quanto vale a expressão que estou investigando?',
          'Call Stack/Frames: quem chamou este método e por qual caminho cheguei aqui?',
          'Console: o que o programa imprimiu ou qual erro foi lançado?'
        ]
      }
    ]
  },
  {
    id: 'decisoes',
    label: 'if, laço e método',
    eyebrow: 'Etapa 7',
    title: 'A técnica é a mesma; muda a pergunta',
    duration: '11 min',
    blocks: [
      {
        type: 'scenarioTable',
        rows: [
          ['if', 'Qual ramo foi escolhido?', 'Pare antes da condição e confira cada parte booleana.'],
          ['laço', 'Como i e total mudam a cada volta?', 'Pare dentro do corpo e use Step Over por algumas iterações.'],
          ['método', 'O erro nasce nos argumentos ou no cálculo?', 'Pare na chamada; use Step Into e compare parâmetros e retorno.'],
          ['NullPointerException', 'Qual referência está null antes da falha?', 'Pare na linha anterior e descubra quem deveria ter preenchido o valor.']
        ]
      },
      {
        type: 'code',
        name: 'Experimento rápido com laço',
        content: `int total = 0;\nfor (int i = 1; i <= 5; i++) {\n    total = total + i; // breakpoint aqui\n}\nSystem.out.println(total); // 15`
      },
      {
        type: 'note',
        tone: 'info',
        title: 'Não avance mecanicamente',
        text: 'Antes de cada Step Over, diga qual valor você espera ver depois. O debugger passa a validar seu raciocínio, em vez de virar apenas uma animação de linhas.'
      }
    ]
  },
  {
    id: 'investigar',
    label: 'Encontrar o defeito',
    eyebrow: 'Etapa 8',
    title: 'Mude um dado e descubra por que a decisão mudou',
    duration: '12 min',
    blocks: [
      {
        type: 'lead',
        text: 'Troque status para "CONCLUIDO" e mantenha os outros dois valores como true e false. Esperado: o reagendamento deve ser bloqueado. Agora investigue a causa em vez de apenas olhar a mensagem final.'
      },
      {
        type: 'code',
        name: 'Altere somente esta linha',
        content: 'String status = "CONCLUIDO";'
      },
      {
        type: 'diagnosis',
        items: [
          ['1. Esperado', 'Atividade não pode ser reagendada.'],
          ['2. Hipótese', 'statusPermitido ficará false.'],
          ['3. Ponto de parada', 'Antes da chamada de podeReagendar.'],
          ['4. Evidência', 'A Watch da expressão de status resulta em false.'],
          ['5. Caminho', 'O return combina false && true && true, portanto retorna false.'],
          ['6. Conclusão', 'O bloqueio é uma regra correta, não um defeito do Java.']
        ]
      },
      {
        type: 'note',
        tone: 'warning',
        title: 'Corrija a causa, não o sintoma',
        text: 'Nunca force podeReagendar = true só para “funcionar”. Se o resultado estiver errado, descubra se a entrada veio errada ou se a regra de negócio precisa ser alterada.'
      }
    ]
  },
  {
    id: 'fechamento',
    label: 'Diagnóstico real',
    eyebrow: 'Etapa 9',
    title: 'Leve o método para testes e backend sem transformá-lo em bengala',
    duration: '15 min',
    blocks: [
      {
        type: 'flow',
        items: ['requisição', 'controller', 'service', 'domínio', 'repository', 'banco']
      },
      {
        type: 'lead',
        text: 'Em Spring, a mesma Call Stack pode atravessar controller, service e domínio. Em testes, você pode acompanhar dados preparados, chamada e assertiva. Entre apenas em código relevante: framework e bibliotecas têm muitos detalhes internos.'
      },
      { type: 'errors' },
      {
        type: 'compare',
        title: 'Escolha a ferramenta pela pergunta',
        goodTitle: 'Debug ajuda quando…',
        good: ['o fluxo ou o valor é inesperado', 'você consegue reproduzir localmente', 'há uma hipótese concreta para verificar'],
        badTitle: 'Prefira outra ferramenta quando…',
        bad: ['um teste automatizado prova melhor a regra', 'logs são a evidência disponível', 'a mensagem de erro já explica a causa']
      },
      {
        type: 'challenge',
        title: 'Desafio final sem roteiro de cliques',
        text: 'Execute três cenários: data inválida, cliente bloqueado e status REAGENDADO. Antes de cada execução, escreva o retorno esperado. Use um breakpoint, uma Watch e a Call Stack para confirmar a decisão.',
        acceptance: [
          'Você iniciou pelo Debug e o breakpoint foi atingido',
          'Explicou por que a linha destacada ainda não alterou o valor',
          'Usou Step Into e retornou com Step Out ou Step Over',
          'Identificou qual condição decidiu cada cenário',
          'Terminou a execução com Resume e conferiu o Console'
        ]
      }
    ]
  }
];

const commonErrors = [
  ['Breakpoint não para', 'Confirme que iniciou com Debug, executou a classe certa e marcou uma linha realmente alcançada.'],
  ['Linha nunca é atingida', 'Coloque o breakpoint antes do if; o fluxo talvez não entre no bloco escolhido.'],
  ['Variável ainda não aparece', 'A linha destacada ainda será executada. Avance com Step Over e observe novamente.'],
  ['Step Into entrou em biblioteca', 'Use Step Out e volte. Entre apenas em métodos seus quando isso responder à hipótese.'],
  ['Muitos breakpoints', 'Desative ou remova os que não participam da investigação atual.'],
  ['Valores parecem antigos', 'Salve o arquivo e reinicie a sessão de Debug para executar o código recompilado.']
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button type="button" className="guided-copy" onClick={copy} aria-label={`${label} código`}>
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? 'Copiado' : label}
    </button>
  );
}

function IntelliJSimulator({ initialStage = 0, interactive = false, caption }) {
  const [stage, setStage] = useState(initialStage);
  const [hasBreakpoint, setHasBreakpoint] = useState(initialStage >= 1);
  const [watchEnabled, setWatchEnabled] = useState(initialStage >= 3);

  useEffect(() => {
    setStage(initialStage);
    setHasBreakpoint(initialStage >= 1);
    setWatchEnabled(initialStage >= 3);
  }, [initialStage]);

  const paused = stage >= 2 && stage < 6;
  const currentLine = stage === 2 ? 7 : stage === 3 ? 19 : stage === 4 ? 21 : stage === 5 ? 10 : null;
  const insideMethod = stage === 3 || stage === 4;
  const variables = insideMethod
    ? [
        ['status', '"AGENDADO"'],
        ['possuiDataValida', 'true'],
        ['clienteBloqueado', 'false'],
        ...(stage >= 4 ? [['statusPermitido', 'true']] : [])
      ]
    : stage >= 2
      ? [
          ['status', '"AGENDADO"'],
          ['possuiDataValida', 'true'],
          ['clienteBloqueado', 'false'],
          ...(stage >= 5 ? [['podeReagendar', 'true']] : [])
        ]
      : [];

  const startDebug = () => {
    if (!hasBreakpoint) {
      setStage(6);
      return;
    }
    setStage(2);
  };

  const stepOver = () => {
    if (stage === 2) setStage(5);
    else if (stage === 3) setStage(4);
    else if (stage === 4) setStage(5);
    else if (stage === 5) setStage(6);
  };

  const stepInto = () => {
    if (stage === 2) setStage(3);
  };

  const stepOut = () => {
    if (insideMethod) setStage(5);
  };

  return (
    <figure className="idea-figure">
      <div className="idea-window" aria-label="Simulação interativa do debugger do IntelliJ IDEA">
        <div className="idea-titlebar">
          <span className="idea-app-mark">IJ</span>
          <span>DebugAtividade — laboratório-java</span>
          <span className="idea-window-controls" aria-hidden="true">─ □ ×</span>
        </div>
        <div className="idea-toolbar">
          <button type="button" onClick={() => setStage(6)} aria-label="Executar normalmente"><Play size={15} /> Run</button>
          <button type="button" onClick={startDebug} aria-label="Iniciar debug"><Bug size={15} /> Debug</button>
          <span className={`idea-status ${paused ? 'paused' : ''}`}>{paused ? 'Suspended' : stage === 6 ? 'Finished' : 'Ready'}</span>
        </div>
        <div className="idea-workspace">
          <aside className="idea-project">
            <strong>Project</strong>
            <div>⌄ laboratório-java</div>
            <div className="indent">⌄ src</div>
            <div className="indent2 active">☕ DebugAtividade</div>
          </aside>
          <section className="idea-editor" aria-label="Editor de código">
            <div className="idea-tab">☕ DebugAtividade.java <span>×</span></div>
            <div className="idea-code">
              {sourceLines.map((line, index) => {
                const lineNumber = index + 1;
                const breakpointLine = lineNumber === 7;
                return (
                  <div className={`idea-code-line ${currentLine === lineNumber ? 'current' : ''}`} key={`${lineNumber}-${line}`}>
                    <button
                      type="button"
                      className={`idea-gutter ${breakpointLine && hasBreakpoint ? 'breakpoint' : ''}`}
                      onClick={() => breakpointLine && setHasBreakpoint(value => !value)}
                      disabled={!breakpointLine}
                      aria-label={breakpointLine ? `${hasBreakpoint ? 'Remover' : 'Adicionar'} breakpoint na linha 7` : `Linha ${lineNumber}`}
                    >
                      {currentLine === lineNumber && <span className="idea-arrow">▶</span>}
                      {breakpointLine && hasBreakpoint && <span className="idea-breakpoint-dot" />}
                      <span>{lineNumber}</span>
                    </button>
                    <code>{line ? highlightJavaLine(line) : ' '}</code>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section className={`idea-debugger ${paused || stage === 6 ? 'open' : ''}`}>
          <div className="idea-debug-tabs"><strong>Debug</strong><span>Console</span></div>
          <div className="idea-debug-toolbar" aria-label="Controles do debugger">
            <button type="button" onClick={() => setStage(6)} disabled={!paused}><Play size={14} /> Resume <kbd>F9</kbd></button>
            <button type="button" onClick={stepOver} disabled={!paused}><StepForward size={14} /> Step Over <kbd>F8</kbd></button>
            <button type="button" onClick={stepInto} disabled={stage !== 2}><ArrowDownToLine size={14} /> Step Into <kbd>F7</kbd></button>
            <button type="button" onClick={stepOut} disabled={!insideMethod}><ArrowRight size={14} /> Step Out <kbd>⇧F8</kbd></button>
            <button type="button" onClick={() => { setStage(1); setHasBreakpoint(true); }}><RotateCcw size={14} /> Reiniciar</button>
          </div>
          {paused ? (
            <div className="idea-debug-grid">
              <div className="idea-frames">
                <strong>Frames / Call Stack</strong>
                {insideMethod && <div className="selected">podeReagendar: {currentLine}</div>}
                <div className={!insideMethod ? 'selected' : ''}>main: {insideMethod ? 7 : currentLine}</div>
              </div>
              <div className="idea-variables">
                <strong>Variables</strong>
                {variables.map(([name, value]) => <div key={name}><span>{name}</span><code>= {value}</code></div>)}
                {!variables.some(([name]) => name === 'podeReagendar') && !insideMethod && <div className="idea-unavailable">podeReagendar — ainda não criado</div>}
              </div>
              <div className="idea-watches">
                <div><strong>Watches</strong><button type="button" onClick={() => setWatchEnabled(true)} aria-label="Adicionar expressão à área Watches">＋</button></div>
                {watchEnabled ? <><code>status.equals("AGENDADO") ||</code><code>status.equals("REAGENDADO") = true</code></> : <span>Clique em + para observar uma expressão</span>}
              </div>
            </div>
          ) : stage === 6 ? (
            <div className="idea-console">Atividade pode ser reagendada.<br /><br /><span>Process finished with exit code 0</span></div>
          ) : (
            <div className="idea-debug-empty">Inicie com <strong>Debug</strong> para abrir Variables, Watches e Frames.</div>
          )}
        </section>
      </div>
      {interactive && <div className="idea-try"><Footprints size={17} /> Os controles desta tela funcionam. Tente entrar no método e voltar.</div>}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'simulator') return <IntelliJSimulator {...block} />;

  if (block.type === 'code') {
    return (
      <div className="guided-file idea-code-file">
        <div className="guided-file-title"><FileCode2 size={17} /> {block.name}<CopyButton value={block.content} /></div>
        <SyntaxHighlighter
          language="java"
          style={oneLight}
          showLineNumbers={block.content.split('\n').length > 4}
          wrapLongLines
          customStyle={{ margin: 0, padding: '20px', background: '#f8fafc', fontSize: '.84rem', lineHeight: 1.7 }}
          codeTagProps={{ style: { fontFamily: '"Cascadia Code", Consolas, monospace' } }}
        >
          {block.content}
        </SyntaxHighlighter>
      </div>
    );
  }

  if (block.type === 'console') {
    return (
      <div className="guided-terminal">
        <div className="guided-terminal-bar"><span><TerminalSquare size={17} /> {block.label}</span></div>
        <div className="guided-output idea-console-output"><pre><code>{block.output}</code></pre></div>
        <p className="guided-terminal-explanation">{block.explanation}</p>
      </div>
    );
  }

  if (block.type === 'note') {
    const Icon = block.tone === 'danger' ? ShieldAlert : block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }

  if (block.type === 'result') {
    return <section className="guided-result"><h3><ClipboardCheck size={20} /> {block.title}</h3><ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul></section>;
  }

  if (block.type === 'actions') {
    return (
      <section className="idea-actions">
        <h3><MonitorPlay size={20} /> {block.title}</h3>
        <ol>{block.items.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol>
      </section>
    );
  }

  if (block.type === 'compare') {
    return (
      <section className="guided-compare">
        <h3>{block.title}</h3>
        <div className="guided-compare-grid">
          <div className="good"><strong>{block.goodTitle}</strong>{block.good.map(item => <code key={item}>{item}</code>)}</div>
          <div className="bad idea-neutral"><strong>{block.badTitle}</strong>{block.bad.map(item => <code key={item}>{item}</code>)}</div>
        </div>
      </section>
    );
  }

  if (block.type === 'controlGuide') {
    return (
      <section className="idea-control-guide">
        {block.items.map(item => <article key={item.name}><div><strong>{item.name}</strong><kbd>{item.shortcut}</kbd></div><p>{item.text}</p></article>)}
      </section>
    );
  }

  if (block.type === 'scenarioTable') {
    return (
      <div className="idea-table-wrap">
        <table className="idea-table">
          <thead><tr><th>Situação</th><th>Pergunta</th><th>Estratégia</th></tr></thead>
          <tbody>{block.rows.map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  }

  if (block.type === 'diagnosis') {
    return <section className="idea-diagnosis">{block.items.map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}</section>;
  }

  if (block.type === 'flow') {
    return <div className="idea-flow" aria-label="Fluxo comum de uma requisição backend">{block.items.map((item, index) => <React.Fragment key={item}><span>{item}</span>{index < block.items.length - 1 && <ArrowRight size={16} />}</React.Fragment>)}</div>;
  }

  if (block.type === 'errors') {
    return (
      <section className="guided-errors">
        <h3><RotateCcw size={20} /> Se a tela não se comportar como o exemplo</h3>
        <div className="guided-error-grid">{commonErrors.map(([title, fix]) => <article key={title}><code>{title}</code><p>{fix}</p></article>)}</div>
      </section>
    );
  }

  if (block.type === 'challenge') {
    return (
      <section className="guided-challenge">
        <div className="guided-challenge-title"><Code2 size={22} /><h3>{block.title}</h3></div>
        <p>{block.text}</p><h4>Critérios de aceite</h4>
        <ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul>
      </section>
    );
  }

  return null;
}

export default function GuidedIntelliJLesson008({
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

  useEffect(() => {
    localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify([...completedStepIds]));
  }, [completedStepIds]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const completedLabel = useMemo(() => `${completedStepIds.size} de ${steps.length} etapas concluídas`, [completedStepIds]);

  useEffect(() => {
    if (completionNormalizedRef.current) return;
    completionNormalizedRef.current = true;
    if (isCompleted && !allStepsComplete) onToggleCompleted();
  }, [allStepsComplete, isCompleted, onToggleCompleted]);

  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.content-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <article className="guided-git-lesson guided-idea-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Eye size={17} /> Aula visual guiada</span>
          <p className="guided-sequence">008 · M0.08</p>
          <h1>Debug no IntelliJ</h1>
          <p>Pare o programa, navegue entre métodos e transforme suspeitas em evidências visíveis.</p>
        </div>
        <div className="guided-hero-status"><Bug size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      </header>

      <div className="guided-layout">
        <nav className="guided-step-nav" aria-label="Etapas da aula">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
          {steps.map((step, index) => (
            <button type="button" key={step.id} className={`${index === activeIndex ? 'active' : ''} ${completedStepIds.has(step.id) ? 'done' : ''}`} onClick={() => selectStep(index)}>
              <span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span>
              <span><strong>{step.label}</strong><small>{step.duration}</small></span>
            </button>
          ))}
        </nav>

        <main className="guided-step-content">
          <div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div>
          <div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div>
          <div className="guided-step-actions">
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button>
            <div className="guided-step-actions-main">
              <button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>
                {activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}
              </button>
              {activeIndex < steps.length - 1 && (
                <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>
                  Próxima etapa <ArrowRight size={17} />
                </button>
              )}
            </div>
          </div>
          {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Aula concluída' : 'Laboratório completo'}</h3><p>{lessonComplete ? 'Todas as etapas e a conclusão da aula estão registradas.' : 'Você já consegue investigar uma regra com uma hipótese, um breakpoint e evidências.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula anterior</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <ListChecks size={18} />}
          <span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Progresso registrado' : allStepsComplete ? 'Use o botão acima' : 'Conclua o roteiro prático'}</small></span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Próxima aula'}>Próxima aula <ArrowRight size={17} /></button>
      </footer>
    </article>
  );
}
