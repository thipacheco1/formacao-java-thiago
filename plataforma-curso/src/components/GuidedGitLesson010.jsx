import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Copy,
  FileCode2,
  FolderGit2,
  Lightbulb,
  ListChecks,
  MonitorPlay,
  RotateCcw,
  ShieldAlert,
  TerminalSquare
} from 'lucide-react';
import './guidedLesson.css';

const LESSON_STORAGE_KEY = 'guided-git-lesson-010-progress';

const steps = [
  {
    id: 'mapa',
    label: 'Mapa da aula',
    eyebrow: 'Comece aqui',
    title: 'Você vai criar um histórico real, não apenas ler comandos',
    duration: '4 min',
    blocks: [
      {
        type: 'lead',
        text: 'Ao final, uma pasta comum terá quatro commits, um README versionado, um .gitignore funcional e um arquivo compilado que existe no computador sem entrar no histórico.'
      },
      {
        type: 'result',
        title: 'Resultado que você vai alcançar',
        items: [
          'Inicializar um repositório na pasta correta',
          'Distinguir working tree, staging area e repository',
          'Interpretar untracked, staged, modified e clean',
          'Ler diff antes de registrar ou descartar mudanças',
          'Criar commits pequenos com mensagens compreensíveis',
          'Ignorar artefatos Java sem apagá-los do computador'
        ]
      },
      {
        type: 'image',
        src: '/lesson-assets/010-git-local/01-tres-areas-git.svg',
        alt: 'Diagrama das três áreas do Git',
        caption: 'Use este mapa durante a aula: add prepara, commit registra, restore --staged devolve e restore descarta.'
      },
      {
        type: 'note',
        tone: 'info',
        title: 'Como estudar esta aula',
        text: 'Digite um bloco por vez, compare a sua saída com o exemplo e só então avance. Caminhos, versões e hashes podem mudar; os estados do Git precisam ser equivalentes.'
      }
    ]
  },
  {
    id: 'ambiente',
    label: 'Validar ambiente',
    eyebrow: 'Etapa 1',
    title: 'Confirme o Git, sua identidade e a branch padrão',
    duration: '6 min',
    blocks: [
      {
        type: 'command',
        label: 'PowerShell — execute uma linha por vez',
        code: 'git --version\ngit config --global user.name\ngit config --global user.email\ngit config --global init.defaultBranch',
        output: 'git version 2.50.1.windows.1\nThiago Silva\nthiago@example.com\nmain',
        explanation: 'A versão e os dados serão os seus. A última linha deve ser main.'
      },
      {
        type: 'note',
        tone: 'warning',
        title: 'Se “git não é reconhecido” aparecer',
        text: 'Feche o PowerShell, abra novamente e teste. Se persistir, volte à aula 009: o executável não está disponível no PATH desse terminal.'
      },
      {
        type: 'command',
        label: 'Somente se nome, e-mail ou branch estiverem vazios',
        code: 'git config --global user.name "Seu Nome"\ngit config --global user.email "seu-email@example.com"\ngit config --global init.defaultBranch main',
        output: '',
        explanation: 'Esses comandos normalmente terminam em silêncio. Repita as consultas anteriores para confirmar.'
      }
    ]
  },
  {
    id: 'pasta',
    label: 'Criar laboratório',
    eyebrow: 'Etapa 2',
    title: 'Comece em uma pasta vazia e saiba exatamente onde está',
    duration: '5 min',
    blocks: [
      {
        type: 'command',
        label: 'Criar a estrutura da aula',
        code: 'New-Item -ItemType Directory -Path C:\\dev\\labs -Force | Out-Null\nSet-Location C:\\dev\\labs\nNew-Item -ItemType Directory -Path git-local-do-zero | Out-Null\nSet-Location git-local-do-zero\nGet-Location\nGet-ChildItem',
        output: 'Path\n----\nC:\\dev\\labs\\git-local-do-zero',
        explanation: 'Get-ChildItem não deve listar arquivos porque o laboratório acabou de ser criado.'
      },
      {
        type: 'note',
        tone: 'warning',
        title: 'A pasta já existe?',
        text: 'Não apague nem sobrescreva no impulso. Use git-local-do-zero-2 e entre nessa nova pasta. Assim você não corre o risco de destruir um laboratório anterior.'
      }
    ]
  },
  {
    id: 'init',
    label: 'Inicializar Git',
    eyebrow: 'Etapa 3',
    title: 'Transforme a pasta em repositório e encontre a estrutura interna',
    duration: '6 min',
    blocks: [
      {
        type: 'command',
        label: 'Inicializar o repositório',
        code: 'git init',
        output: 'Initialized empty Git repository in C:/dev/labs/git-local-do-zero/.git/',
        explanation: 'A mensagem confirma que o Git criou sua estrutura interna em .git.'
      },
      {
        type: 'command',
        label: 'Mostrar inclusive pastas ocultas',
        code: 'Get-ChildItem -Force',
        output: 'Mode   Name\n----   ----\nd--h-  .git',
        explanation: 'Sem .git, existe apenas uma pasta comum. Não edite nem apague essa pasta interna.'
      },
      {
        type: 'note',
        tone: 'danger',
        title: 'Pare se o caminho estiver errado',
        text: 'Rodar git init em C:\\dev ou em uma pasta com vários projetos faz o Git observar arquivos demais. Confira Get-Location antes de continuar.'
      }
    ]
  },
  {
    id: 'status',
    label: 'Primeiro status',
    eyebrow: 'Etapa 4',
    title: 'Leia o estado inicial linha por linha',
    duration: '5 min',
    blocks: [
      {
        type: 'command',
        label: 'Consultar sem modificar',
        code: 'git status',
        output: 'On branch main\n\nNo commits yet\n\nnothing to commit (create/copy files and use "git add" to track)',
        explanation: 'Você está na main, ainda não há commits e nenhuma mudança precisa ser registrada.'
      },
      {
        type: 'result',
        title: 'Três perguntas que o status responde',
        items: [
          'Em qual branch estou?',
          'Quais arquivos mudaram e em que estado estão?',
          'Existe algo pronto para o próximo commit?'
        ]
      }
    ]
  },
  {
    id: 'readme',
    label: 'Criar README',
    eyebrow: 'Etapa 5',
    title: 'Crie, edite, salve e confirme o primeiro arquivo',
    duration: '9 min',
    blocks: [
      {
        type: 'command',
        label: 'Criar e abrir no Bloco de Notas',
        code: 'New-Item -ItemType File -Path README.md | Out-Null\nnotepad README.md',
        output: '',
        explanation: 'Quando o Bloco de Notas abrir, cole o conteúdo abaixo, salve com Ctrl+S e feche a janela.'
      },
      {
        type: 'file',
        name: 'README.md',
        content: '# Git Local do Zero\n\nLaboratório para aprender Git local.'
      },
      {
        type: 'command',
        label: 'Confirmar o conteúdo e perguntar ao Git',
        code: 'Get-Content README.md\ngit status\ngit status --short',
        output: '# Git Local do Zero\n\nLaboratório para aprender Git local.\n\nUntracked files:\n        README.md\n\n?? README.md',
        explanation: '?? significa untracked: o arquivo existe, mas o Git ainda não o incluiu no histórico.'
      }
    ]
  },
  {
    id: 'staging',
    label: 'Staging e diff',
    eyebrow: 'Etapa 6',
    title: 'Escolha o que entrará no commit e revise antes de registrar',
    duration: '8 min',
    blocks: [
      {
        type: 'command',
        label: 'Preparar somente o README',
        code: 'git add README.md\ngit status --short',
        output: 'A  README.md',
        explanation: 'A na primeira coluna indica uma adição preparada na staging area. git add não cria commit.'
      },
      {
        type: 'command',
        label: 'Revisar o que está preparado',
        code: 'git diff --staged',
        output: 'diff --git a/README.md b/README.md\nnew file mode 100644\n--- /dev/null\n+++ b/README.md\n@@ -0,0 +1,3 @@\n+# Git Local do Zero\n+\n+Laboratório para aprender Git local.',
        explanation: 'As linhas iniciadas por + serão adicionadas. O cabeçalho +++ b/README.md é metadado do diff, não conteúdo.'
      },
      {
        type: 'note',
        tone: 'info',
        title: 'Por que não usar git add . agora?',
        text: 'Ele adicionaria tudo que não estivesse ignorado. Aprender com o nome explícito do arquivo ajuda você a montar commits intencionais.'
      }
    ]
  },
  {
    id: 'commit',
    label: 'Primeiro commit',
    eyebrow: 'Etapa 7',
    title: 'Registre o primeiro ponto do histórico e confirme o estado limpo',
    duration: '8 min',
    blocks: [
      {
        type: 'command',
        label: 'Criar e consultar o commit',
        code: 'git commit -m "Adiciona README inicial"\ngit log --oneline\ngit status',
        output: '[main (root-commit) 4f2c8a1] Adiciona README inicial\n 1 file changed, 3 insertions(+)\n create mode 100644 README.md\n\n4f2c8a1 (HEAD -> main) Adiciona README inicial\n\nOn branch main\nnothing to commit, working tree clean',
        explanation: 'O hash será diferente. root-commit identifica o primeiro commit; working tree clean confirma que nada ficou pendente.'
      },
      {
        type: 'image',
        src: '/lesson-assets/010-git-local/02-primeiro-commit-terminal.svg',
        alt: 'Terminal com o primeiro ciclo completo de commit',
        caption: 'A saída faz parte da aula: ela confirma cada transição de estado.'
      }
    ]
  },
  {
    id: 'segundo-ciclo',
    label: 'Alterar e revisar',
    eyebrow: 'Etapa 8',
    title: 'Faça uma alteração real e aprenda a ler o diff',
    duration: '10 min',
    blocks: [
      {
        type: 'command',
        label: 'Abrir o arquivo novamente',
        code: 'notepad README.md',
        output: '',
        explanation: 'Acrescente o bloco abaixo no final, salve e feche.'
      },
      {
        type: 'file',
        name: 'Trecho novo em README.md',
        content: '## Objetivo\n\nPraticar o ciclo básico do Git.'
      },
      {
        type: 'command',
        label: 'Ver a alteração antes de preparar',
        code: 'git status --short\ngit diff',
        output: ' M README.md\n\n@@ -1,3 +1,7 @@\n # Git Local do Zero\n \n Laboratório para aprender Git local.\n+\n+## Objetivo\n+\n+Praticar o ciclo básico do Git.',
        explanation: 'M na segunda coluna significa modificado apenas no working tree. Um aviso LF/CRLF no Windows não significa perda de conteúdo.'
      },
      {
        type: 'command',
        label: 'Preparar, revisar e registrar',
        code: 'git add README.md\ngit diff --staged\ngit commit -m "Documenta objetivo do laboratorio"\ngit log --oneline',
        output: '91ac730 (HEAD -> main) Documenta objetivo do laboratorio\n4f2c8a1 Adiciona README inicial',
        explanation: 'O commit mais recente aparece em cima. Os hashes da sua máquina serão diferentes.'
      }
    ]
  },
  {
    id: 'gitignore',
    label: '.gitignore',
    eyebrow: 'Etapa 9',
    title: 'Ignore um artefato Java e prove qual regra foi aplicada',
    duration: '12 min',
    blocks: [
      {
        type: 'command',
        label: 'Criar um arquivo compilado de teste',
        code: 'New-Item -ItemType File -Path Main.class | Out-Null\ngit status --short',
        output: '?? Main.class',
        explanation: 'O arquivo existe e ainda aparece como candidato ao versionamento.'
      },
      {
        type: 'command',
        label: 'Criar e abrir o arquivo de regras',
        code: 'New-Item -ItemType File -Path .gitignore | Out-Null\nnotepad .gitignore',
        output: '',
        explanation: 'Cole o conteúdo abaixo, salve e feche.'
      },
      {
        type: 'file',
        name: '.gitignore',
        content: '# Java e ferramentas de build\n*.class\nout/\ntarget/\n\n# IntelliJ IDEA\n.idea/\n*.iml\n\n# Sistema operacional\n.DS_Store\nThumbs.db\n\n# Temporários\n*.tmp\n*.log'
      },
      {
        type: 'command',
        label: 'Confirmar que Main.class existe, mas está ignorado',
        code: 'git status --short\nTest-Path Main.class\ngit check-ignore -v Main.class',
        output: '?? .gitignore\nTrue\n.gitignore:2:*.class    Main.class',
        explanation: 'O arquivo não foi apagado. A última linha mostra exatamente a regra responsável.'
      },
      {
        type: 'command',
        label: 'Versionar a regra',
        code: 'git add .gitignore\ngit diff --staged\ngit commit -m "Configura arquivos ignorados do projeto"',
        output: '[main bd8c104] Configura arquivos ignorados do projeto',
        explanation: 'Se um arquivo já tiver sido commitado, o .gitignore não o remove sozinho. Essa correção precisa ser intencional com git rm --cached.'
      }
    ]
  },
  {
    id: 'restore',
    label: 'Restore seguro',
    eyebrow: 'Etapa 10',
    title: 'Pratique descartar e retirar da staging sem confundir os comandos',
    duration: '14 min',
    blocks: [
      {
        type: 'image',
        src: '/lesson-assets/010-git-local/03-restore-com-seguranca.svg',
        alt: 'Fluxo de decisão para usar add e restore com segurança',
        caption: 'A decisão vem depois da leitura do diff, nunca antes.'
      },
      {
        type: 'command',
        label: 'Experimento 1 — descartar uma linha criada de propósito',
        code: 'notepad README.md\n# acrescente: linha errada qualquer\ngit diff\ngit restore README.md\ngit status --short\nGet-Content README.md',
        output: '+linha errada qualquer\n\n# git restore não imprime nada quando funciona\n# git status --short também fica sem saída',
        explanation: 'A linha errada deve desaparecer. Antes de git restore, leia sempre o diff: mudanças não commitadas podem ser perdidas.'
      },
      {
        type: 'file',
        name: 'Trecho correto para o segundo experimento',
        content: '## Observação\n\nGit local registra histórico sem depender de remoto.'
      },
      {
        type: 'command',
        label: 'Experimento 2 — desfazer apenas o git add',
        code: 'notepad README.md\n# acrescente o trecho correto acima e salve\ngit add README.md\ngit status --short\ngit restore --staged README.md\ngit status --short\nGet-Content README.md',
        output: 'M  README.md\n M README.md\n\n# o texto continua dentro do README.md',
        explanation: 'M na primeira coluna estava staged. Depois de --staged, M volta à segunda coluna e o conteúdo é preservado.'
      },
      {
        type: 'command',
        label: 'Registrar a alteração preservada',
        code: 'git add README.md\ngit diff --staged\ngit commit -m "Explica que Git local não depende de remoto"',
        output: '[main e12ba77] Explica que Git local não depende de remoto',
        explanation: 'Agora a intenção correta virou histórico.'
      }
    ]
  },
  {
    id: 'conclusao',
    label: 'Projeto e diagnóstico',
    eyebrow: 'Etapa 11',
    title: 'Inspecione o resultado, resolva erros e faça sozinho',
    duration: '18 min',
    blocks: [
      {
        type: 'command',
        label: 'Inspeção final',
        code: 'git status\ngit log --oneline\nGet-ChildItem -Force',
        output: 'On branch main\nnothing to commit, working tree clean\n\ne12ba77 (HEAD -> main) Explica que Git local não depende de remoto\nbd8c104 Configura arquivos ignorados do projeto\n91ac730 Documenta objetivo do laboratorio\n4f2c8a1 Adiciona README inicial',
        explanation: 'Você deve encontrar .git, .gitignore, Main.class e README.md. Main.class existe, mas permanece fora do status.'
      },
      {
        type: 'compare',
        title: 'Mensagens que contam uma história',
        good: ['Adiciona primeiro programa Java', 'Configura gitignore para Maven', 'Corrige validação de entrada'],
        bad: ['ajuste', 'teste', 'coisas', 'final']
      },
      {
        type: 'result',
        title: 'Normalmente não entram no Git',
        items: [
          '.class, out/ e target/',
          'configurações pessoais da IDE',
          'logs e temporários gerados',
          'senhas, tokens, chaves privadas e .env real',
          'dados reais de clientes',
          'cópias manuais do mesmo projeto'
        ]
      },
      {
        type: 'errors'
      },
      {
        type: 'challenge',
        title: 'Desafio sem copiar o roteiro',
        text: 'Crie anotacoes-git.md com seções para working tree, staging area e repository. Faça um commit com a estrutura, explique cada seção em uma segunda alteração e termine com working tree clean.',
        acceptance: [
          'O arquivo apareceu primeiro como ??',
          'Você revisou o conteúdo com diff ou diff --staged',
          'Existem dois commits pequenos e claros',
          'git status termina limpo'
        ]
      }
    ]
  }
];

const commonErrors = [
  {
    title: 'fatal: not a git repository',
    fix: 'Use Get-Location e Get-ChildItem -Force. Entre na pasta que contém .git.'
  },
  {
    title: 'Author identity unknown',
    fix: 'Configure user.name e user.email; depois repita o commit.'
  },
  {
    title: 'pathspec did not match any files',
    fix: 'Use Get-ChildItem e git status para conferir o nome real do arquivo.'
  },
  {
    title: 'nothing to commit, working tree clean',
    fix: 'Não é erro: nenhuma mudança está pendente.'
  },
  {
    title: 'Arquivo ignorado não aparece',
    fix: 'Confirme a regra com git check-ignore -v NOME_DO_ARQUIVO.'
  },
  {
    title: 'git init na pasta errada',
    fix: 'Pare. Não apague .git no impulso; confirme o caminho e o conteúdo antes de remover qualquer histórico.'
  }
];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button type="button" className="guided-copy" onClick={copy} aria-label="Copiar comandos">
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

function CommandBlock({ block }) {
  return (
    <div className="guided-terminal">
      <div className="guided-terminal-bar">
        <span><TerminalSquare size={17} /> {block.label}</span>
        <CopyButton value={block.code.replace(/^#.*$/gm, '').replace(/\n{2,}/g, '\n').trim()} />
      </div>
      <pre className="guided-command"><code>{block.code}</code></pre>
      {block.output && (
        <div className="guided-output">
          <div className="guided-output-label">Saída esperada ou trecho importante</div>
          <pre><code>{block.output}</code></pre>
        </div>
      )}
      {block.explanation && <p className="guided-terminal-explanation">{block.explanation}</p>}
    </div>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;

  if (block.type === 'command') return <CommandBlock block={block} />;

  if (block.type === 'image') {
    return (
      <figure className="guided-figure">
        <img src={block.src} alt={block.alt} />
        <figcaption>{block.caption}</figcaption>
      </figure>
    );
  }

  if (block.type === 'file') {
    return (
      <div className="guided-file">
        <div className="guided-file-title"><FileCode2 size={17} /> {block.name}</div>
        <pre><code>{block.content}</code></pre>
      </div>
    );
  }

  if (block.type === 'note') {
    const Icon = block.tone === 'danger' ? ShieldAlert : block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return (
      <aside className={`guided-note ${block.tone || 'info'}`}>
        <Icon size={21} />
        <div><strong>{block.title}</strong><p>{block.text}</p></div>
      </aside>
    );
  }

  if (block.type === 'result') {
    return (
      <section className="guided-result">
        <h3><ClipboardCheck size={20} /> {block.title}</h3>
        <ul>{block.items.map(item => <li key={item}><CheckCircle2 size={16} /> {item}</li>)}</ul>
      </section>
    );
  }

  if (block.type === 'compare') {
    return (
      <section className="guided-compare">
        <h3>{block.title}</h3>
        <div className="guided-compare-grid">
          <div className="good"><strong>Boas</strong>{block.good.map(item => <code key={item}>{item}</code>)}</div>
          <div className="bad"><strong>Ruins</strong>{block.bad.map(item => <code key={item}>{item}</code>)}</div>
        </div>
      </section>
    );
  }

  if (block.type === 'errors') {
    return (
      <section className="guided-errors">
        <h3><RotateCcw size={20} /> Diagnóstico de erros comuns</h3>
        <div className="guided-error-grid">
          {commonErrors.map(error => (
            <article key={error.title}>
              <code>{error.title}</code>
              <p>{error.fix}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === 'challenge') {
    return (
      <section className="guided-challenge">
        <div className="guided-challenge-title"><Code2 size={22} /><h3>{block.title}</h3></div>
        <p>{block.text}</p>
        <h4>Critérios de aceite</h4>
        <ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul>
      </section>
    );
  }

  return null;
}

export default function GuidedGitLesson010({
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

  const completedLabel = useMemo(
    () => `${completedStepIds.size} de ${steps.length} etapas concluídas`,
    [completedStepIds]
  );

  useEffect(() => {
    if (completionNormalizedRef.current) return;
    completionNormalizedRef.current = true;
    if (isCompleted && !allStepsComplete) onToggleCompleted();
  }, [allStepsComplete, isCompleted, onToggleCompleted]);

  const selectStep = (index) => {
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
    <article className="guided-git-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><MonitorPlay size={17} /> Aula visual guiada</span>
          <p className="guided-sequence">010 · M0.10</p>
          <h1>Git local do zero</h1>
          <p>Crie seu primeiro repositório acompanhando comandos, saídas, estados, erros e confirmações.</p>
        </div>
        <div className="guided-hero-status">
          <FolderGit2 size={42} />
          <strong>{progress}%</strong>
          <span>{completedLabel}</span>
        </div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="guided-layout">
        <nav className="guided-step-nav" aria-label="Etapas da aula">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
          {steps.map((step, index) => (
            <button
              type="button"
              key={step.id}
              className={`${index === activeIndex ? 'active' : ''} ${completedStepIds.has(step.id) ? 'done' : ''}`}
              onClick={() => selectStep(index)}
            >
              <span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span>
              <span><strong>{step.label}</strong><small>{step.duration}</small></span>
            </button>
          ))}
        </nav>

        <main className="guided-step-content">
          <div className="guided-step-heading">
            <span>{activeStep.eyebrow} · {activeStep.duration}</span>
            <h2>{activeStep.title}</h2>
          </div>

          <div className="guided-blocks">
            {activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}
          </div>

          <div className="guided-step-actions">
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}>
              <ArrowLeft size={17} /> Etapa anterior
            </button>
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

          {allStepsComplete && (
            <section className="guided-finish">
              <CheckCircle2 size={30} />
              <div>
                <h3>{lessonComplete ? 'Aula concluída' : 'Laboratório completo'}</h3>
                <p>{lessonComplete ? 'Todas as etapas e a conclusão da aula estão registradas.' : 'Revise o resultado e conclua a aula para liberar a próxima.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
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
