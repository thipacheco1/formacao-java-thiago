import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck,
  Check, CheckCircle2, ChevronRight, Clock3, Copy, FileCode2,
  Lightbulb, ListChecks, RotateCcw, Sparkles, Terminal, Play, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedScopeLesson.css';

const STORAGE_KEY = 'guided-scope-lesson-057-progress';

const EVIDENCE = [
  '# Aula 057 — Escopo de Variáveis', '',
  '## Conceitos Base', '- [ ] Compreendi que escopo é a região delimitada de código onde uma variável existe', '- [ ] Entendi que variáveis locais são criadas no interior de métodos ou blocos específicos', '- [ ] Diferenciei visibilidade (onde é vista) de tempo de vida (quanto dura na Stack)', '',
  '## Regras de Blocos', '- [ ] Notei que blocos internos enxergam variáveis de blocos externos', '- [ ] Fixei que blocos externos não enxergam variáveis declaradas em blocos internos', '- [ ] Reconheci que variáveis de loops (ex: for) deixam de existir imediatamente após a execução', '- [ ] Entendi que variáveis criadas em ramos separados (if / else) são isoladas entre si', '',
  '## Inicialização e Shadowing', '- [ ] Aprendi que variáveis locais precisam ser explicitamente inicializadas antes do primeiro uso', '- [ ] Compreendi a sombra de variáveis (shadowing) mascarando campos globais da classe', '- [ ] Usei a desambiguação explícita de campos da classe usando ClassName.campo', '- [ ] Evitei declarar acumuladores lógicos dentro do corpo do loop de iteração', '',
  '## Evidências Locais', '- [ ] Criei, compilei e executei os 27 arquivos locais de laboratórios', '- [ ] Vivenciei o erro de compilação por uso ilegal fora do if em `ErroVariavelForaBloco.java`', '- [ ] Inspecionei a falha por leitura sem valor padrão em `ErroVariavelSemInicializar.java`', '- [ ] Refatorei o uso indesejado de variáveis de classe em `ErroCampoEstaticoDesnecessario.java`',
  '',
  '## Decisão de Projeto', '- Por que prefiro declarar uma variável temporária de apoio no menor escopo físico viável?', '- Qual o impacto arquitetural de usar campos estáticos da classe no lugar de passagem explícita por parâmetros?'
].join('\n');

// ── Utilidades ──────────────────────────────────────
function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  };
  return <button type="button" className="v57-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file v57-code">
      <div className="guided-file-title">
        <FileCode2 size={16} /> {name}
        <CopyButton value={code} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={lines}
        wrapLongLines
        customStyle={{ margin: 0, padding: '16px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// ── 1. Simulador de Escopo & Tempo de Vida ──────────
function ScopeSimulator() {
  const [lineIdx, setLineIdx] = useState(-1);

  const lines = [
    { text: 'public static void main(String[] args) {', vars: [] },
    { text: '    int valor = 10;', vars: ['valor'] },
    { text: '    if (valor > 0) {', vars: ['valor'] },
    { text: '        String msg = "Aprovado";', vars: ['valor', 'msg'] },
    { text: '        System.out.println(msg);', vars: ['valor', 'msg'] },
    { text: '    } // Fim do bloco do if', vars: ['valor'] },
    { text: '    System.out.println(valor);', vars: ['valor'] },
    { text: '} // Fim do main', vars: [] }
  ];

  const advance = () => {
    setLineIdx(i => i < lines.length - 1 ? i + 1 : -1);
  };

  const currentVars = lineIdx !== -1 ? lines[lineIdx].vars : [];

  return (
    <div className="v57-scope-visual">
      <div>
        {lines.map((l, i) => (
          <div key={i} className={`v57-code-line ${lineIdx === i ? 'active' : ''}`}>
            {l.text}
          </div>
        ))}
      </div>

      <div className="v57-sim-controls" style={{ margin: '8px 0 0' }}>
        <button type="button" className="v57-sim-action" onClick={advance}>
          {lineIdx === -1 ? '▶ Iniciar Execução' : lineIdx === lines.length - 1 ? 'Reiniciar' : 'Avançar Linha ➔'}
        </button>
      </div>

      <div className="v57-scope-vars">
        <span style={{ fontSize: '.75rem', color: '#64748b', fontWeight: 'bold', alignSelf: 'center', marginRight: '6px' }}>
          Variáveis na Stack:
        </span>
        <span className={`v57-var-tag ${currentVars.includes('valor') ? '' : 'dead'}`}>valor (int)</span>
        <span className={`v57-var-tag ${currentVars.includes('msg') ? '' : 'dead'}`}>msg (String)</span>
      </div>
    </div>
  );
}

// ── 2. Painel de Inicialização Local ─────────────────
function InitializationPanel() {
  const [init, setInit] = useState(false);

  const codeUninit = `public static void main(String[] args) {\n    int quantidade;\n    // ERRO DE COMPILAÇÃO: quantidade pode não estar inicializada!\n    System.out.println(quantidade);\n}`;
  const codeInit = `public static void main(String[] args) {\n    int quantidade = 0; // Garantindo inicialização!\n    System.out.println(quantidade); // Compila perfeitamente.\n}`;

  return (
    <div className="v57-sim-box">
      <div className="v57-sim-controls">
        <label>Estado da Variável Local:</label>
        <button type="button" className="v57-sim-action" style={{ background: !init ? '#ef4444' : '#334155' }} onClick={() => setInit(false)}>Sem Inicialização</button>
        <button type="button" className="v57-sim-action" style={{ background: init ? '#10b981' : '#334155' }} onClick={() => setInit(true)}>Inicializada Corretamente</button>
      </div>

      <div className="v57-sim-grid">
        <CodePanel name="VerificacaoInicial.java" code={init ? codeInit : codeUninit} lines={false} />
        <div className={`v57-console ${init ? 'success' : 'error'}`}>
          <header><Terminal size={14} /> Console do javac</header>
          <pre>{init
            ? 'Compilado com sucesso.\nResultado: 0'
            : 'Erro de compilação:\nvariable quantidade might not have been initialized\nSystem.out.println(quantidade);'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 3. Lab de Shadowing (Sombra) ────────────────────
function ShadowingLab() {
  const [shadow, setShadow] = useState(true);

  const codeShadow = `public class Main {\n    static String status = "GLOBAL"; // campo da classe\n\n    public static void main(String[] args) {\n        String status = "LOCAL"; // faz sombra (shadowing) no campo!\n        System.out.println(status); // imprime LOCAL\n    }\n}`;
  const codeExplicit = `public class Main {\n    static String status = "GLOBAL"; // campo da classe\n\n    public static void main(String[] args) {\n        String status = "LOCAL";\n        // Desambiguação usando o ClassName.campo:\n        System.out.println(Main.status); // imprime GLOBAL\n    }\n}`;

  return (
    <div className="v57-sim-box">
      <div className="v57-sim-controls">
        <label>Forma de Acesso ao Dado:</label>
        <button type="button" className="v57-sim-action" style={{ background: shadow ? '#4f46e5' : '#334155' }} onClick={() => setShadow(true)}>Acesso com Sombra (Shadow)</button>
        <button type="button" className="v57-sim-action" style={{ background: !shadow ? '#4f46e5' : '#334155' }} onClick={() => setShadow(false)}>Acesso Explícito Desambiguado</button>
      </div>

      <div className="v57-sim-grid">
        <CodePanel name="ExemploShadowing.java" code={shadow ? codeShadow : codeExplicit} lines={false} />
        <div className="v57-console success">
          <header><Terminal size={14} /> Console</header>
          <pre>{shadow
            ? 'Valor Impresso: LOCAL\n\n[Nota]: O escopo local escondeu a variável estática global.'
            : 'Valor Impresso: GLOBAL\n\n[Nota]: O uso do nome da classe (Main.status) garantiu o acesso ao campo.'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 4. Lab de Loops e Acumuladores ──────────────────
function LoopsLab() {
  const [scopeOut, setScopeOut] = useState(true);

  const codeIn = `public static void main(String[] args) {\n    int[] valores = {10, 20, 30};\n    for (int i = 0; i < valores.length; i++) {\n        int total = 0; // recria e zera a cada volta!\n        total += valores[i];\n    }\n    // ERRO: total não existe no escopo externo da main!\n    System.out.println(total);\n}`;
  const codeOut = `public static void main(String[] args) {\n    int[] valores = {10, 20, 30};\n    int total = 0; // declarada no escopo externo\n    for (int i = 0; i < valores.length; i++) {\n        total += valores[i]; // acumula normalmente\n    }\n    System.out.println(total); // imprime 60\n}`;

  return (
    <div className="v57-sim-box">
      <div className="v57-sim-controls">
        <label>Declaração do Acumulador:</label>
        <button type="button" className="v57-sim-action" style={{ background: !scopeOut ? '#ef4444' : '#334155' }} onClick={() => setScopeOut(false)}>Declarado dentro do Loop</button>
        <button type="button" className="v57-sim-action" style={{ background: scopeOut ? '#10b981' : '#334155' }} onClick={() => setScopeOut(true)}>Declarado fora do Loop</button>
      </div>

      <div className="v57-sim-grid">
        <CodePanel name="SomaValores.java" code={scopeOut ? codeOut : codeIn} lines={false} />
        <div className={`v57-console ${scopeOut ? 'success' : 'error'}`}>
          <header><Terminal size={14} /> Console de Compilação</header>
          <pre>{scopeOut
            ? 'Resultado: 60\n\n[Análise]: A variável total sobreviveu ao loop do for porque nasceu no escopo da main.'
            : 'Erro de compilação:\ncannot find symbol\nSystem.out.println(total);'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 5. Galeria de Domínios ──────────────────────────
const DOMAINS = [
  {
    id: 'pedido', label: 'Pedido', file: 'PedidoEscopoCorreto.java',
    code: `public static void main(String[] args) {\n    String cliente = "Ana";\n    long valor = 1000L;\n    exibirPedido(cliente, valor);\n}\npublic static void exibirPedido(String cliente, long valor) {\n    // parâmetros locais isolados do main\n    System.out.println(cliente + " : " + valor);\n}`,
    output: 'Ana : 1000',
    insight: 'Passagem explícita de dados através de parâmetros sem vazar o escopo do main.'
  },
  {
    id: 'produto', label: 'Produto', file: 'ProdutoEscopoBloco.java',
    code: `public static void exibirProduto(String nome, int estoque, String status) {\n    System.out.println(nome + " | " + status);\n    if (estoque == 0 && "ATIVO".equals(status)) {\n        String alerta = "Sem estoque"; // morre no if!\n        System.out.println(alerta);\n    }\n}`,
    output: 'Cadeira | ATIVO\nSem estoque',
    insight: 'A variável "alerta" nasce e morre no bloco if, preservando a memória.'
  },
  {
    id: 'pagamento', label: 'Pagamento', file: 'PagamentoEscopo.java',
    code: `public static void processar(long valor, int parcelas) {\n    if (parcelas <= 0) {\n        String erro = "Inválido";\n        System.out.println(erro);\n        return;\n    }\n    long valorParcela = valor / parcelas;\n    System.out.println(valorParcela);\n}`,
    output: 'Inválido',
    insight: 'Isola as variáveis de erro no bloco inicial e o cálculo em escopo limpo.'
  },
  {
    id: 'os', label: 'Ordem de Serviço', file: 'OsEscopoDecisao.java',
    code: `if (podeConcluir) {\n    String mensagem = "OS Concluída";\n    System.out.println(mensagem);\n} else {\n    String mensagem = "Pendente";\n    System.out.println(mensagem);\n}`,
    output: 'OS Concluída',
    insight: 'Duas variáveis mensagem isoladas em ramos independentes do if/else.'
  },
  {
    id: 'auditoria', label: 'Auditoria', file: 'AuditoriaEscopo.java',
    code: `public static void registrar(String user, String op) {\n    String linha = user + " realizou " + op; // temporária\n    System.out.println(linha);\n}`,
    output: 'aline realizou CRIACAO',
    insight: 'Uso de variável temporária com ciclo de vida limitado ao método.'
  },
  {
    id: 'mensageria', label: 'Mensageria', file: 'MensageriaEscopo.java',
    code: `if (tentativas > 3) {\n    String alerta = "Mensagem bloqueada";\n    System.out.println(alerta);\n}`,
    output: 'Alerta: Mensagem bloqueada',
    insight: 'O alerta de bloqueio de envio fica restrito à barreira de segurança.'
  },
  {
    id: 'loop', label: 'Loop de Pedidos', file: 'PedidosLoopEscopo.java',
    code: `for (int i = 0; i < clientes.length; i++) {\n    String clienteAtual = clientes[i]; // recriada a cada volta!\n    System.out.println(clienteAtual);\n}`,
    output: 'Ana\nBruno\nCarla',
    insight: 'O loop recria clienteAtual a cada iteração, limpando a Stack anterior.'
  }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return (
    <section className="v57-domains-gallery">
      <div className="v57-domains-sidebar">
        {DOMAINS.map((d, i) => (
          <button key={d.id} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>{d.label}</button>
        ))}
      </div>
      <div className="v57-domains-content">
        <CodePanel name={item.file} code={item.code} lines={false} />
        <div className="v57-console">
          <header><Terminal size={14} /> Console</header>
          <pre>{item.output}</pre>
          <p><Sparkles size={14} /> {item.insight}</p>
        </div>
      </div>
    </section>
  );
}

// ── 6. Clínica de Erros ─────────────────────────────
const ERRORS = [
  {
    title: 'Usar variável fora do bloco chaves',
    code: `if (true) {\n    String msg = "Sucesso";\n}\nSystem.out.println(msg); // erro!`,
    symptom: 'Compilation error: cannot find symbol: variable msg',
    cause: 'Msg foi declarada dentro das chaves do if e o escopo externo do método não a enxerga.',
    fix: 'Declare a variável no escopo externo (antes do if) e atribua o valor no bloco interno.'
  },
  {
    title: 'Acessar índice do for fora do loop',
    code: `for (int i = 0; i < 3; i++) { }\nSystem.out.println(i); // erro!`,
    symptom: 'Compilation error: cannot find symbol: variable i',
    cause: 'A variável de controle do for (i) morre fisicamente no término do loop.',
    fix: 'Se precisar do último índice, declare a variável de controle antes do for.'
  },
  {
    title: 'Chamar variável de outro método diretamente',
    code: `public static void main(String[] args) {\n    int valor = 10;\n    exibir();\n}\npublic static void exibir() { System.out.println(valor); } // erro!`,
    symptom: 'Compilation error: cannot find symbol: variable valor',
    cause: 'A variável "valor" pertence ao escopo local do método main e não de exibir().',
    fix: 'Passe a informação de forma explícita através de um parâmetro de método.'
  },
  {
    title: 'Declarar variável local sem inicialização',
    code: `int total;\nSystem.out.println(total); // erro!`,
    symptom: 'Compilation error: variable total might not have been initialized',
    cause: 'Ao contrário de arrays e campos, variáveis locais não recebem valores padrão automaticamente em Java.',
    fix: 'Sempre atribua um valor inicial à variável local ao declará-la: `int total = 0;`.'
  },
  {
    title: 'Inicializar apenas em if sem cobertura else',
    code: `int desconto;\nif (clienteEspecial) {\n    desconto = 15;\n}\nSystem.out.println(desconto); // erro!`,
    symptom: 'Compilation error: variable desconto might not have been initialized',
    cause: 'O compilador nota que se clienteEspecial for falso, a variável desconto continuará sem valor na exibição.',
    fix: 'Adicione um ramo else com inicialização ou declare valor padrão na declaração: `int desconto = 0;`.'
  },
  {
    title: 'Declarar acumulador dentro do loop',
    code: `for (int i = 0; i < valores.length; i++) {\n    long soma = 0; // reinicia a cada volta!\n    soma += valores[i];\n}`,
    symptom: 'Erro lógico: A variável soma reinicia em 0 a cada iteração, e não acumula o total.',
    cause: 'Declarar a variável acumuladora no interior das chaves do loop.',
    fix: 'Declare e inicialize o acumulador fora/antes das chaves do loop.'
  },
  {
    title: 'Criar variável local com escopo excessivamente grande',
    code: `// Declara todas as variáveis possíveis na linha 1 do main, mesmo as usadas apenas no fim do código.`,
    symptom: 'Código confuso e propenso a vazamento acidental de dados.',
    cause: 'Falta de boas práticas de escopo mínimo e legibilidade.',
    fix: 'Declare as variáveis apenas no momento e no menor escopo físico em que elas forem necessárias.'
  },
  {
    title: 'Uso de campos estáticos para fugir de parâmetros',
    code: `static String cliente;\npublic static void main(String[] args) {\n    cliente = "Ana";\n    exibir();\n}`,
    symptom: 'Alto acoplamento, dependências ocultas e vulnerabilidade a bugs concorrentes.',
    cause: 'Preguiça de formular as assinaturas dos métodos passando os argumentos adequados.',
    fix: 'Remova os campos estáticos e faça a transferência através de parâmetros tipados.'
  },
  {
    title: 'Sombra (shadowing) de variáveis de forma confusa',
    code: `static String status = "GLOBAL";\npublic static void main(String[] args) {\n    String status = "LOCAL";\n}`,
    symptom: 'Dificuldade de deduzir qual variável está ativa em determinado bloco do código.',
    cause: 'Coincidência de nomes entre escopos locais/parâmetros e campos globais da classe.',
    fix: 'Use nomes distintos ou refira-se ao campo explicitamente usando `ClassName.campo`.'
  },
  {
    title: 'Confundir o escopo da variável com seu valor físico',
    code: `// Acreditar que mudar o valor da variável apaga ela do escopo Stack.`,
    symptom: 'Confusão teórica na depuração de códigos e fluxos do sistema.',
    cause: 'Falta de entendimento conceitual: o escopo é espacial (onde existe no texto), o valor é físico (o que guarda).',
    fix: 'Revise os diagramas de memória: o escopo define a visibilidade na escrita, o valor vive na memória.'
  }
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="v57-errors-clinic">
      <nav className="v57-errors-nav">
        {ERRORS.map((e, i) => (
          <button key={i} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>
            <span>{i + 1}</span>
            <span className="guided-error-label">{e.title}</span>
          </button>
        ))}
      </nav>
      <div className="v57-error-card">
        <header>
          <AlertTriangle size={20} />
          <div>
            <small>Caso {selected + 1} de {ERRORS.length}</small>
            <h3>{item.title}</h3>
          </div>
        </header>
        <div style={{ padding: '0 14px' }}>
          <CodePanel name="Código Problemático" code={item.code} lines={false} />
        </div>
        <section style={{ margin: '12px 14px' }}>
          <small style={{ display: 'block', marginBottom: '4px', fontSize: '.65rem', color: '#475569', fontWeight: 'bold' }}>Sintoma no console</small>
          <code style={{ display: 'block', padding: '10px', color: '#fecdd3', background: '#0f172a', borderRadius: '8px', fontSize: '.72rem', fontFamily: 'Consolas, monospace', whiteSpace: 'pre-wrap' }}>{item.symptom}</code>
        </section>
        <div className="v57-error-flow">
          <span>
            <AlertTriangle size={16} />
            <div><strong>Causa raiz</strong><p>{item.cause}</p></div>
          </span>
          <ChevronRight size={18} />
          <span>
            <Wrench size={16} />
            <div><strong>Como corrigir</strong><p>{item.fix}</p></div>
          </span>
        </div>
      </div>
    </section>
  );
}

const GUIDED_PROGRAM_057 = `public class OficinaEscopo {
    static String status = "GLOBAL";

    public static void main(String[] args) {
        int quantidade = 3;
        String mensagem;

        if (quantidade > 0) {
            mensagem = "Há itens";
        } else {
            mensagem = "Sem itens";
        }
        System.out.println(mensagem);

        int total = 0;
        for (int i = 1; i <= quantidade; i++) {
            int valorAtual = i * 10;
            total += valorAtual;
        }
        System.out.println("Total: " + total);

        int contador = 0;
        while (contador < 2) {
            String evento = "Evento " + contador;
            System.out.println(evento);
            contador++;
        }

        exibirStatus("LOCAL");
    }

    static void exibirStatus(String status) {
        System.out.println("Parâmetro: " + status);
        System.out.println("Campo: " + OficinaEscopo.status);
    }
}`;

// ── 7. Entrega & Desafio ────────────────────────────
function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Criar Diretório',
      cmd: `New-Item -ItemType Directory -Force labs\\m1\\aula-057-escopo-de-variaveis\ncd labs\\m1\\aula-057-escopo-de-variaveis\nNew-Item Main.java, EscopoIf.java, ErroVariavelForaDoIf.java, VariavelLocalNaoInicializada.java, EscopoFor.java, ErroIndiceForaDoFor.java, EscopoWhile.java, EscopoIfElse.java, EscopoMetodos.java, ErroVariavelDeOutroMetodo.java, EscopoParametroPrimitivo.java, EscopoArray.java, SombraVariavel.java, SombraParametroCampo.java, PedidoEscopoCorreto.java, ProdutoEscopoBloco.java, PagamentoEscopo.java, OsEscopoDecisao.java, AuditoriaEscopo.java, MensageriaEscopo.java, PedidosLoopEscopo.java, TotalForaDoLoop.java, ErroAcumuladorDentroDoLoop.java, ErroVariavelForaBloco.java, ErroVariavelSemInicializar.java, ErroCampoEstaticoDesnecessario.java`,
      out: 'Criado com sucesso — 27 arquivos de laboratório para a Aula 057.',
      tip: 'Verifique se os nomes dos arquivos coincidem exatamente com o roteiro.'
    },
    {
      title: 'Validar Erros na Compilação',
      cmd: `javac ErroVariavelForaBloco.java\njavac ErroVariavelSemInicializar.java`,
      out: `ErroVariavelForaBloco:\ncannot find symbol: variable mensagem\n\nErroVariavelSemInicializar:\nvariable quantidade might not have been initialized`,
      tip: 'Observe como as barreiras de escopo do Java barram a compilação por segurança.'
    },
    {
      title: 'Testar Sombra de Variáveis',
      cmd: `javac SombraVariavel.java SombraParametroCampo.java\njava SombraVariavel\njava SombraParametroCampo`,
      out: `SombraVariavel:\nLOCAL\nGLOBAL\n\nSombraParametroCampo:\nParâmetro: LOCAL\nCampo da classe: GLOBAL`,
      tip: 'Confirme como a chamada ao campo estático via ClassName desvia da sombra local.'
    },
    {
      title: 'Commit de Fechamento',
      cmd: `git status\ngit add labs/m1/aula-057-escopo-de-variaveis docs/diario-de-bordo.md\ngit commit -m "Aula 057: pratica escopo de variaveis"\ngit status`,
      out: 'working tree clean',
      tip: 'Confirme com git status se nenhum binário .class escapou pelo ignore.'
    }
  ];
  const current = steps[stage];

  return (
    <section>
      <div className="v57-delivery-nav">
        {steps.map((s, i) => (
          <button key={s.title} type="button" className={stage === i ? 'active' : ''} onClick={() => setStage(i)}>
            <span>{i < stage ? <Check size={11} /> : i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="v57-terminal">
        <header><Terminal size={14} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={14} /> {current.tip}</p>
      </div>
      <div className="v57-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button>
      </div>

      <aside className="guided-note info" style={{ marginTop: '20px' }}>
        <Lightbulb size={20} />
        <div><strong>Exemplo guiado antes do desafio</strong><p>Use esta classe para marcar onde cada variável nasce e deixa de existir: ramos do <code>if/else</code>, índice e temporária do <code>for</code>, variável do <code>while</code>, parâmetro e campo sombreado.</p></div>
      </aside>
      <CodePanel name="OficinaEscopo.java" code={GUIDED_PROGRAM_057} />
      <div className="v57-console success">
        <header><Terminal size={14} /> Saída esperada</header>
        <pre>{'Há itens\nTotal: 60\nEvento 0\nEvento 1\nParâmetro: LOCAL\nCampo: GLOBAL'}</pre>
      </div>

      <section className="guided-challenge" style={{ marginTop: '20px' }}>
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: CalculoFreteEscopo.java</h3></div>
        <p>Crie <code>CalculoFreteEscopo.java</code> na pasta da aula. Declare um campo de classe global: <code>static long taxaFretePadraoCentavos = 1500L; // R$ 15,00</code>. Implemente métodos estáticos com controle rígido de escopo:</p>
        <ul>
          <li><strong>calcularFrete(long valorPedidoCentavos)</strong>: Devolve o custo do frete (long centavos). Se o valor do pedido for acima de R$ 100,00 (10000L centavos), o frete é gratuito. Use uma variável local <code>freteFinalCentavos</code> para acumular a resposta. Caso contrário, atribua a <code>taxaFretePadraoCentavos</code> do campo da classe (demonstrando shadowing se declarar parâmetro de mesmo nome, mas prefira o acesso limpo).</li>
          <li><strong>processarEntregas(long[] pedidosCentavos)</strong>: Calcula e exibe o frete individual de cada pedido. Use acumuladores declarados fora do loop para somar o frete total e o faturamento total acumulado. As variáveis do loop (ex: <code>pedidoAtual</code>, <code>freteAtual</code>) devem nascer e morrer obrigatoriamente dentro das chaves do loop.</li>
        </ul>
      </section>

      <div className="guided-file v57-code" style={{ marginTop: '16px' }}>
        <div className="guided-file-title">
          <BookOpenCheck size={16} /> docs/diario-de-bordo.md
          <CopyButton value={EVIDENCE} label="Copiar evidências" />
        </div>
        <SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '16px', background: '#0f172a', fontSize: '.76rem', lineHeight: 1.65 }}>
          {EVIDENCE}
        </SyntaxHighlighter>
      </div>
    </section>
  );
}

// ── Bloco Condicional ───────────────────────────────
function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'scope_sim') return <ScopeSimulator />;
  if (block.type === 'init') return <InitializationPanel />;
  if (block.type === 'shadow') return <ShadowingLab />;
  if (block.type === 'loops') return <LoopsLab />;
  if (block.type === 'domains') return <DomainsGallery />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  return null;
}

// ── Roteiro ──────────────────────────────────────────
const steps = [
  {
    id: 'scope', eyebrow: 'Visibilidade Espacial', label: 'Escopo & Tempo de Vida',
    title: 'Visibilidade da variável e ciclo Stack em blocos de chaves', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Avance passo a passo para verificar a criação e destruição física de variáveis locais na Stack:' }, { type: 'scope_sim' }]
  },
  {
    id: 'init', eyebrow: 'Contrato de Compilação', label: 'Lab de Inicialização',
    title: 'A obrigação de inicializar variáveis locais no Java', duration: '5 min',
    blocks: [{ type: 'lead', text: 'Veja por que variáveis locais não inicializadas bloqueiam a geração de binários pelo compilador:' }, { type: 'init' }]
  },
  {
    id: 'shadow', eyebrow: 'Conflito de Nomes', label: 'Lab de Shadowing',
    title: 'Mascarando variáveis de classe com nomes locais equivalentes', duration: '5 min',
    blocks: [{ type: 'lead', text: 'Entenda como o Java gerencia a prioridade de nomes em escopos aninhados e como contorná-la:' }, { type: 'shadow' }]
  },
  {
    id: 'loops', eyebrow: 'Ciclos de Repetição', label: ' loops e Acumuladores',
    title: 'A posição declarativa correta para totalizadores e contadores', duration: '5 min',
    blocks: [{ type: 'lead', text: 'Descubra o erro estrutural de tentar acumular dados declarando variáveis no bloco interno do loop:' }, { type: 'loops' }]
  },
  {
    id: 'dominios', eyebrow: 'Arquitetura Aplicada', label: 'Galeria de Domínios',
    title: 'Aplicação prática do controle de escopo em 7 cenários', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Explore como o isolamento de escopo previne falhas de vazamento de dados lógicos:' }, { type: 'domains' }]
  },
  {
    id: 'clinica', eyebrow: 'Depuração', label: 'Clínica de Erros',
    title: 'Estudo e correção das 10 falhas clássicas de escopo', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Analise o comportamento e aprenda a corrigir erros de visibilidade e tempo de vida:' }, { type: 'errors' }]
  },
  {
    id: 'entrega', eyebrow: 'Prática no Terminal', label: 'Entrega & Desafio',
    title: 'Compilação física das classes e cálculo de fretes', duration: '10 min',
    blocks: [{ type: 'lead', text: 'Realize o roteiro de PowerShell para compilar e certificar a entrega do laboratório local:' }, { type: 'delivery' }]
  }
];

// ── Componente Principal ─────────────────────────────
export default function GuidedScopeLesson057({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepNavRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const validIds = new Set(steps.map(step => step.id));
      return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []);
    } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds]));
  }, [completedStepIds]);

  useEffect(() => {
    if (!completionNormalizedRef.current && isCompleted && completedStepIds.size !== steps.length) {
      completionNormalizedRef.current = true;
      onToggleCompleted();
    }
  }, [completedStepIds.size, isCompleted, onToggleCompleted]);

  useEffect(() => {
    const activeButton = stepNavRef.current?.querySelector('button.active');
    if (activeButton && window.matchMedia('(max-width: 900px)').matches) {
      activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const completedLabel = `${completedStepIds.size} de ${steps.length} etapas concluídas`;

  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleActiveStep = () => {
    if (activeStepComplete && isCompleted) onToggleCompleted();
    setCompletedStepIds(prev => {
      const next = new Set(prev);
      if (next.has(activeStep.id)) next.delete(activeStep.id);
      else next.add(activeStep.id);
      return next;
    });
  };

  return (
    <article className="guided-git-lesson guided-scope-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Play size={17} /> Métodos</span>
          <p className="guided-sequence">057 · M1.37</p>
          <h1>Escopo de Variáveis</h1>
          <p>Compreenda onde as variáveis nascem, vivem e morrem em Java. Domine a visibilidade e tempo de vida local, loop e método. Evite vazamento de dados lógicos, gerencie inicializações locais obrigatórias e domine a sombra de variáveis (shadowing).</p>
        </div>
        <div className="guided-hero-status">
          <Play size={42} />
          <strong>{progress}%</strong>
          <span>{completedLabel}</span>
        </div>
        <div className="guided-hero-status-track" aria-label={`Progresso: ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula 057" items={[
        { value: 'Chaves {}', label: 'Isolamento Stack' },
        { value: 'Inicialização', label: 'Local obrigatória' },
        { value: 'Shadowing', label: 'Prioridade local' }
      ]} />

      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 057">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
          {steps.map((step, index) => (
            <button type="button" key={step.id}
              className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')}
              onClick={() => selectStep(index)}>
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
            {activeStep.blocks.map((block, index) => (
              <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />
            ))}
          </div>

          <div className="guided-step-actions">
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}>
              <ArrowLeft size={17} /> Etapa anterior
            </button>
            <div className="guided-step-actions-main">
              <button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>
                {activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}
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
                <h3>Escopo de Variáveis dominado!</h3>
                <p>{lessonComplete ? 'Conceitos de Stack, visibilidade, inicialização e shadowing consolidados.' : 'Conclua a aula para registrar seu progresso no cronograma.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 056</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Escopo de variáveis dominado' : allStepsComplete ? 'Use o botão acima' : 'Pratique limites de visibilidade, chaves de blocos, inicializações e sombra'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Próxima Aula'}>
          Aula 058 <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
