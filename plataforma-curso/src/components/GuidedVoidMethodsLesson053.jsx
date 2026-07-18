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
import './guidedVoidMethodsLesson.css';

const STORAGE_KEY = 'guided-void-methods-lesson-053-progress';

const EVIDENCE = [
  '# Aula 053 — Métodos sem Retorno', '',
  '## Conceitos Base', '- [ ] Compreendi que métodos void executam ações sem retornar valores', '- [ ] Entendi a diferença crucial entre parâmetros e argumentos', '- [ ] Declarei métodos estáticos no escopo da classe e fora do main', '',
  '## Fluxo de Execução', '- [ ] Acompanhei o percurso da execução passo a passo usando pilha (Stack)', '- [ ] Entendi que declarar não executa, exigindo a chamada do método', '- [ ] Realizei chamadas encadeadas (método chamando outro método)', '',
  '## Efeitos e Paradas', '- [ ] Compreendi a mutabilidade de referências (efeitos colaterais em arrays/matrizes)', '- [ ] Usei return vazio para sair preventivamente do método sem retorno', '- [ ] Nomeei métodos de ação utilizando camelCase e verbos de ação', '',
  '## Evidências Locais', '- [ ] Criei e organizei 21 arquivos de laboratório locais em subpasta', '- [ ] Diagnostiquei a quebra de compilação em `ErroGuardarRetornoVoid.java` e corrigi', '- [ ] Corrigi a tentativa de retornar valor em `ErroReturnValorEmVoid.java`', '- [ ] Analisei e evitei a recursão infinita em `ErroChamadaRecursiva.java`',
  '',
  '## Decisão de Projeto', '- Por que prefiro return vazio a colocar todo o fluxo principal dentro de um bloco else?', '- Qual a diferença entre parâmetro na assinatura e argumento na chamada?'
].join('\n');

// ── Utilidades ──────────────────────────────────────
function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  };
  return <button type="button" className="v53-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file v53-code">
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

// ── 1. Simulador de Fluxo de Execução ────────────────
function ExecutionFlowSimulator() {
  const [step, setStep] = useState(-1);

  const steps = [
    {
      action: 'O programa inicia no main.',
      code: 'main(String[] args) {\n    System.out.println("Início");',
      stack: ['main'],
      console: 'Início'
    },
    {
      action: 'Chama exibirCabecalho(). Empilha na Stack.',
      code: '    exibirCabecalho();',
      stack: ['main', 'exibirCabecalho'],
      console: 'Início\n==== SISTEMA ===='
    },
    {
      action: 'Método exibirCabecalho() conclui e desempilha.',
      code: '}',
      stack: ['main'],
      console: 'Início\n==== SISTEMA ===='
    },
    {
      action: 'Chama exibirPedido("Ana", 1000L). Empilha com argumentos.',
      code: '    exibirPedido("Ana", 1000L);',
      stack: ['main', 'exibirPedido(cliente="Ana", valor=1000)'],
      console: 'Início\n==== SISTEMA ====\nCliente: Ana | Valor: 1000'
    },
    {
      action: 'Método exibirPedido() conclui e desempilha.',
      code: '}',
      stack: ['main'],
      console: 'Início\n==== SISTEMA ====\nCliente: Ana | Valor: 1000'
    },
    {
      action: 'Chama exibirRodape(). Empilha na Stack.',
      code: '    exibirRodape();',
      stack: ['main', 'exibirRodape'],
      console: 'Início\n==== SISTEMA ====\nCliente: Ana | Valor: 1000\n==== FIM ===='
    },
    {
      action: 'Conclui exibirRodape() e desempilha. O programa finaliza.',
      code: '}',
      stack: [],
      console: 'Início\n==== SISTEMA ====\nCliente: Ana | Valor: 1000\n==== FIM ====\n[Processo Finalizado]'
    }
  ];

  const current = steps[step] || { action: 'Pronto.', code: 'Aguardando...', stack: [], console: '' };

  const advance = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setStep(-1);
    }
  };

  const reset = () => {
    setStep(-1);
  };

  return (
    <div className="v53-sim-box">
      <div className="v53-execution-flow">
        <div className="v53-code-flow">
          <CodePanel name="OrdemExecucao.java" code={`public class Main {\n    public static void main(String[] args) {\n        System.out.println("Início");\n        exibirCabecalho();\n        exibirPedido("Ana", 1000L);\n        exibirRodape();\n    }\n}`} lines={false} />
        </div>
        <div className="v53-stack-panel">
          <div className="v53-stack-title">Stack de Execução (Pilha)</div>
          <div className="v53-stack-frames">
            {current.stack.length === 0 ? (
              <div style={{ color: '#475569', fontSize: '.75rem', textAlign: 'center', margin: 'auto' }}>Pilha Vazia</div>
            ) : (
              current.stack.map((frame, idx) => (
                <div key={idx} className={`v53-stack-frame ${idx === current.stack.length - 1 ? 'active' : ''}`}>
                  {frame}
                  {idx === current.stack.length - 1 && <small>Executando agora</small>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="v53-sim-controls">
        <button type="button" className="v53-sim-action" onClick={advance}>
          {step === -1 ? '▶ Iniciar Fluxo' : step === steps.length - 1 ? 'Finalizar' : 'Próximo passo →'}
        </button>
        <button type="button" className="v53-sim-action" style={{ background: '#334155' }} onClick={reset}>↺ Reiniciar</button>
      </div>

      <div className="v53-sim-grid">
        <div className="v53-console success">
          <header><Terminal size={14} /> Console</header>
          <pre>{current.console || 'Aguardando saída...'}</pre>
        </div>
        <div className="v53-console warning">
          <header><Play size={14} /> Ação Atual</header>
          <pre>{step === -1 ? 'Processo parado. Inicie o fluxo.' : `Ação: ${current.action}\nLinha: ${current.code}`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 2. Painel de Anatomia do Método ──────────────────
function AnatomiaPanel() {
  return (
    <div className="v53-sim-box">
      <div className="v53-anatomy-box">
        <div className="v53-anatomy-line">
          <span className="v53-anatomy-part access" data-tooltip="Modificador de Acesso: Permite visibilidade externa (pública)">public</span>{' '}
          <span className="v53-anatomy-part static" data-tooltip="Modificador Estático: Permite chamada direta sem instanciar objeto da classe">static</span>{' '}
          <span className="v53-anatomy-part void" data-tooltip="Tipo de Retorno void: Executa ação, mas NÃO devolve dados">void</span>{' '}
          <span className="v53-anatomy-part name" data-tooltip="Nome do Método: camelCase curto e descritivo com verbo de ação">exibirPedido</span>(
          <span className="v53-anatomy-part param" data-tooltip="Parâmetro 1 (String): Declaração da variável interna do método">String cliente</span>,{' '}
          <span className="v53-anatomy-part param" data-tooltip="Parâmetro 2 (long): Declaração da variável interna do método">long valor</span>
          ) &#123;
        </div>
        <div className="v53-anatomy-line">    System.out.println("Cliente: " + cliente);</div>
        <div className="v53-anatomy-line">    System.out.println("Valor: " + valor);</div>
        <div className="v53-anatomy-line">&#125;</div>
      </div>
      <aside className="guided-note info">
        <Lightbulb size={20} />
        <div>
          <strong>Parâmetro vs Argumento</strong>
          <p>
            Na assinatura do método, <code>String cliente</code> e <code>long valor</code> são <strong>parâmetros</strong> (definições de variáveis). Na chamada do método, os dados reais enviados (<code>exibirPedido("Ana", 1000L)</code>) são os <strong>argumentos</strong>.
          </p>
        </div>
      </aside>
    </div>
  );
}

// ── 3. Lab de Extração e Refatoração ─────────────────
function ExtracaoLab() {
  const [refactored, setRefactored] = useState(false);

  const before = `public class Main {\n    public static void main(String[] args) {\n        // Código misturado e difícil de escalar:\n        System.out.println("====== SISTEMA ======");\n        System.out.println("Cliente: Ana");\n        System.out.println("Valor: R$ 10.00");\n        System.out.println("=====================");\n        System.out.println("Cliente: Bruno");\n        System.out.println("Valor: R$ 25.00");\n        System.out.println("=====================");\n    }\n}`;
  const after = `public class Main {\n    public static void main(String[] args) {\n        // Main como roteiro limpo:\n        exibirCabecalho();\n        exibirPedido("Ana", 1000L);\n        exibirPedido("Bruno", 2500L);\n    }\n\n    public static void exibirCabecalho() {\n        System.out.println("====== SISTEMA ======");\n    }\n\n    public static void exibirPedido(String cliente, long valor) {\n        System.out.println("Cliente: " + cliente);\n        System.out.println("Valor: R$ " + (valor/100.0));\n        System.out.println("=====================");\n    }\n}`;

  return (
    <div className="v53-sim-box">
      <div className="v53-sim-controls">
        <label>Visualização do Código:</label>
        <button type="button" className="v53-sim-action" style={{ background: !refactored ? '#dc2626' : '#475569' }} onClick={() => setRefactored(false)}>Antes (Bloco Gigante)</button>
        <button type="button" className="v53-sim-action" style={{ background: refactored ? '#16a34a' : '#475569' }} onClick={() => setRefactored(true)}>Depois (Refatorado)</button>
      </div>

      <div style={{ marginTop: '12px' }}>
        {refactored ? (
          <CodePanel name="Refatorado.java" code={after} lines={true} />
        ) : (
          <CodePanel name="Legado.java" code={before} lines={true} />
        )}
      </div>

      <aside className="guided-note info" style={{ marginTop: '12px' }}>
        <Sparkles size={20} />
        <div>
          <strong>Roteiro legível</strong>
          <p>
            A extração de método reduz a complexidade ciclomática do método <code>main</code>, transformando-o num sumário executivo. O leitor entende a ordem lógica sem precisar processar detalhes repetitivos de escrita em console.
          </p>
        </div>
      </aside>
    </div>
  );
}

// ── 4. Lab de Arrays e Matrizes ──────────────────────
function ArraysMatrizesLab() {
  const codeArray = `public static void exibirClientes(String[] clientes) {\n    for (int i = 0; i < clientes.length; i++) {\n        System.out.println("Cliente " + (i + 1) + ": " + clientes[i]);\n    }\n}`;
  const codeMatriz = `public static void exibirMatriz(int[][] matriz) {\n    for (int l = 0; l < matriz.length; l++) {\n        for (int c = 0; c < matriz[l].length; c++) {\n            System.out.print(matriz[l][c] + " ");\n        }\n        System.out.println();\n    }\n}`;

  return (
    <div className="v53-sim-box">
      <div className="v53-sim-grid">
        <CodePanel name="ExibirArrayClientes.java" code={codeArray} lines={false} />
        <CodePanel name="ExibirMatrizComMetodo.java" code={codeMatriz} lines={false} />
      </div>
      <aside className="guided-note info" style={{ marginTop: '12px' }}>
        <Lightbulb size={20} />
        <div>
          <strong>A referência também é copiada por valor</strong>
          <p>
            Arrays e matrizes são objetos em Java. O método recebe uma cópia do valor da referência; como as duas referências apontam para o mesmo objeto, ele pode percorrer ou alterar seu conteúdo. Java continua sendo sempre pass-by-value.
          </p>
        </div>
      </aside>
    </div>
  );
}

// ── 5. Lab de Efeitos Colaterais ─────────────────────
function EfeitoColateralLab() {
  const [status, setStatus] = useState([' pendente ', 'aprovado ', ' RECUSADO ']);
  const [applied, setApplied] = useState(false);

  const apply = () => {
    const next = status.map(s => s.trim().toUpperCase());
    setStatus(next);
    setApplied(true);
  };

  const reset = () => {
    setStatus([' pendente ', 'aprovado ', ' RECUSADO ']);
    setApplied(false);
  };

  const code = `public static void normalizarStatus(String[] statusPedidos) {\n    for (int i = 0; i < statusPedidos.length; i++) {\n        statusPedidos[i] = statusPedidos[i].trim().toUpperCase();\n    }\n}`;

  return (
    <div className="v53-sim-box">
      <div className="v53-sim-controls">
        <label>Ação no Array:</label>
        <button type="button" className="p51-sim-action" disabled={applied} onClick={apply}>Normalizar Status (Efeito Colateral)</button>
        <button type="button" className="p51-sim-action" style={{ background: '#334155' }} onClick={reset}>↺ Reiniciar</button>
      </div>

      <div className="p51-dashboard" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {status.map((st, i) => (
          <div key={i} className="p51-var-card">
            <small>Índice [{i}]</small>
            <strong style={{ fontSize: '.9rem' }}>"{st}"</strong>
          </div>
        ))}
      </div>

      <div className="v53-sim-grid">
        <CodePanel name="NormalizarStatusComMetodo.java" code={code} lines={false} />
        <div className="v53-console success">
          <header><Terminal size={14} /> Estado do Array na Memória</header>
          <pre>{`applied = ${applied}\nArray na heap: [${status.map(s => `"${s}"`).join(', ')}]\n\n${applied ? '✓ Efeito colateral aplicado. O array original fora do método foi modificado.' : 'Aguardando modificação...'}`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 6. Lab de Return Vazio ──────────────────────────
function ReturnVazioLab() {
  const [val, setVal] = useState(-50);

  const code = `public static void exibirPagamento(long valorCentavos) {\n    if (valorCentavos <= 0) {\n        System.out.println("Valor inválido.");\n        return; // interrupção antecipada\n    }\n    System.out.println("Processando valor: " + valorCentavos);\n}`;

  return (
    <div className="v53-sim-box">
      <div className="v53-sim-controls">
        <label>Simular Valor em Centavos:</label>
        <input
          type="number"
          style={{ width: '80px', padding: '6px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={val}
          onChange={e => setVal(parseInt(e.target.value, 10))}
        />
      </div>

      <div className="v53-sim-grid">
        <CodePanel name="ReturnVazioEmVoid.java" code={code} lines={false} />
        <div className={`v53-console ${val <= 0 ? 'error' : 'success'}`}>
          <header><Terminal size={14} /> Console</header>
          <pre>{val <= 0 ? 'Console:\nValor inválido.\n\n[Depuração]: O método encontrou return e saiu antecipadamente, pulando o restante do código.' : `Console:\nProcessando valor: ${val}\n\n[Depuração]: O valor passou pela barreira e seguiu até o fim.`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 7. Galeria de Domínios ──────────────────────────
const DOMAINS = [
  {
    id: 'cabecalho', label: 'Cabeçalho', file: 'CabecalhoRodape.java',
    code: `public static void exibirCabecalho() {\n    System.out.println("====================");\n    System.out.println("SISTEMA DE PEDIDOS");\n    System.out.println("====================");\n}`,
    output: `====================\nSISTEMA DE PEDIDOS\n====================`,
    insight: 'Didaticamente separa as molduras visuais de console de modo estático.'
  },
  {
    id: 'pedido', label: 'Exibir Pedido', file: 'ExibirPedido.java',
    code: `public static void exibirPedido(String cliente, long valorCentavos, String status) {\n    System.out.println("Cliente: " + cliente);\n    System.out.println("Valor: " + valorCentavos);\n    System.out.println("Status: " + status);\n    System.out.println("--------------------");\n}`,
    output: 'Cliente: Ana\nValor: 1000\nStatus: PENDENTE\n--------------------',
    insight: 'Passagem organizada de múltiplos parâmetros preservando a assinatura.'
  },
  {
    id: 'normalizar', label: 'Normalizar Status', file: 'NormalizarStatusComMetodo.java',
    code: `public static void normalizarStatus(String[] statusPedidos) {\n    for (int i = 0; i < statusPedidos.length; i++) {\n        if (statusPedidos[i] != null) {\n            statusPedidos[i] = statusPedidos[i].trim().toUpperCase();\n        }\n    }\n}`,
    output: 'PENDENTE\nAPROVADO\nRECUSADO',
    insight: 'Expõe no próprio nome que o método altera o array compartilhado e protege posições nulas.'
  },
  {
    id: 'auditoria', label: 'Auditoria', file: 'AuditoriaComMetodos.java',
    code: `public static void registrarAuditoria(String usuario, String operacao, String status) {\n    System.out.println("AUDITORIA - Operação: " + operacao);\n    System.out.println("Usuário: " + usuario + " | Status: " + status);\n    System.out.println("--------------------");\n}`,
    output: 'AUDITORIA - Operação: CRIACAO\nUsuário: aline | Status: SUCESSO\n--------------------',
    insight: 'Centraliza a moldura de auditoria em lote facilitando futuras manutenções.'
  },
  {
    id: 'os', label: 'Ordens de Serviço', file: 'OrdemServicoComMetodos.java',
    code: `public static void exibirOrdemServico(String certificado, String status, int atividades) {\n    System.out.println("Ordem: " + certificado);\n    System.out.println("Status: " + status + " | Atividades: " + atividades);\n    System.out.println("--------------------");\n}`,
    output: 'Ordem: OS-001\nStatus: ABERTA | Atividades: 3\n--------------------',
    insight: 'Facilita a exibição do resumo operacional de OS sem poluir a main.'
  },
  {
    id: 'produto', label: 'Produtos', file: 'ProdutoComMetodos.java',
    code: `public static void exibirProduto(String nome, int estoque, String status) {\n    System.out.println("Produto: " + nome + " | Estoque: " + estoque);\n    if (estoque == 0 && "ATIVO".equals(status)) {\n        System.out.println("Atenção: produto ativo sem estoque.");\n    }\n    System.out.println("--------------------");\n}`,
    output: 'Produto: Cadeira | Estoque: 0\nAtenção: produto ativo sem estoque.\n--------------------',
    insight: 'O método void realiza verificações e condicionais visuais baseadas no estado dos parâmetros.'
  },
  {
    id: 'pagamento', label: 'Pagamentos', file: 'PagamentoComMetodos.java',
    code: `public static void exibirPagamento(long valorCentavos, int parcelas) {\n    System.out.println("Valor: " + valorCentavos);\n    if (parcelas <= 0) {\n        System.out.println("Parcelas inválidas.");\n        return;\n    }\n    System.out.println("Parcelado em " + parcelas + "x de " + (valorCentavos / parcelas));\n}`,
    output: 'Valor: 10000\nParcelado em 4x de 2500',
    insight: 'Associa barreira de segurança com cálculo e exibição na tela.'
  }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return (
    <section className="v53-domains-gallery">
      <div className="v53-domains-sidebar">
        {DOMAINS.map((d, i) => (
          <button key={d.id} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>{d.label}</button>
        ))}
      </div>
      <div className="v53-domains-content">
        <CodePanel name={item.file} code={item.code} lines={false} />
        <div className="v53-console">
          <header><Terminal size={14} /> Console</header>
          <pre>{item.output}</pre>
          <p><Sparkles size={14} /> {item.insight}</p>
        </div>
      </div>
    </section>
  );
}

// ── 8. Clínica de Erros ─────────────────────────────
const ERRORS = [
  {
    title: 'Declarar Método dentro de outro Método',
    code: `public static void main(String[] args) {\n    // ERRADO: método interno!\n    public static void exibir() {\n        System.out.println("Erro!");\n    }\n}`,
    symptom: 'Compilation error: illegal start of expression / not a statement',
    cause: 'Em Java, as rotinas (métodos) devem ser declaradas no escopo da classe, não sendo suportada a declaração aninhada interna.',
    fix: 'Mova a declaração do método para fora do main, fechando as chaves deste antes.'
  },
  {
    title: 'Esquecer de chamar o método no fluxo principal',
    code: `public class Main {\n    public static void main(String[] args) {\n        // Nada foi chamado aqui!\n    }\n    public static void exibir() {\n        System.out.println("Olá!");\n    }\n}`,
    symptom: 'O programa finaliza sem exibir nenhuma saída.',
    cause: 'Declarar o método apenas o armazena na memória. Para executar, ele precisa ser invocado explicitamente.',
    fix: 'Adicione `exibir();` dentro do bloco do main.'
  },
  {
    title: 'Tentar armazenar retorno de método void',
    code: `public static void registrarLog() { ... }\n\n// ERRADO: tenta atribuir void a uma variável!\nString retorno = registrarLog();`,
    symptom: 'Compilation error: incompatible types: void cannot be converted to String',
    cause: 'Métodos void não devolvem dados para quem chamou, impedindo a atribuição a tipos de variáveis.',
    fix: 'Chame o método de forma isolada: `registrarLog();`.'
  },
  {
    title: 'Retornar valor em método assinado como void',
    code: `public static void somar(int a, int b) {\n    return a + b; // ERRADO: void não retorna valor!\n}`,
    symptom: 'Compilation error: cannot return a value from method whose result type is void',
    cause: 'Instrução return com expressão em método void.',
    fix: 'Use apenas `return;` para escape sem expressão, ou mude a assinatura para retornar o tipo correto (ex: int).'
  },
  {
    title: 'Esquecer modificador static na declaração',
    code: `public class Main {\n    public static void main(String[] args) {\n        exibir(); // Erro!\n    }\n    public void exibir() { ... } // Esquceu static!\n}`,
    symptom: 'Compilation error: non-static method exibir() cannot be referenced from a static context',
    cause: 'O main opera em escopo estático, impedindo a chamada direta de métodos não estáticos da mesma classe.',
    fix: 'Adicione a palavra-chave `static` na declaração do método: `public static void exibir()`.'
  },
  {
    title: 'Passar argumentos na ordem incorreta',
    code: `// Assinatura: exibirPedido(String cliente, long valor)\nexibirPedido(1000L, "Ana"); // Errado!`,
    symptom: 'Compilation error: incompatible types: long cannot be converted to String',
    cause: 'A ordem dos tipos e parâmetros passados na chamada não corresponde à assinatura declarada.',
    fix: 'Reordene os argumentos para coincidir com a assinatura: `exibirPedido("Ana", 1000L);`.'
  },
  {
    title: 'Nome de método genérico e não descritivo',
    code: `public static void fazer() { ... }`,
    symptom: 'Código ilegível, gerando dúvidas no leitor sobre qual a responsabilidade da rotina.',
    cause: 'Ausência de semântica na nomeação dos métodos.',
    fix: 'Use camelCase contendo verbo de ação descritivo, ex: `exibirPedido()`.'
  },
  {
    title: 'Método com responsabilidade excessiva',
    code: `public static void processarTudo() {\n    // lê dados, valida, calcula parcelas, exibe, grava no BD...\n}`,
    symptom: 'Dificuldade de manutenção, testes complexos e impossibilidade de reutilização parcial.',
    cause: 'Falta de separação de conceitos no código.',
    fix: 'Divida o código em blocos menores com responsabilidades únicas (Single Responsibility Principle).'
  },
  {
    title: 'Método com nome de exibição que causa alteração',
    code: `public static void exibirStatus(String[] status) {\n    status[0] = "ALTERADO"; // Efeito colateral inesperado!\n    System.out.println(status[0]);\n}`,
    symptom: 'Bugs lógicos silenciosos onde os dados são corrompidos após a chamada de exibição.',
    cause: 'Nomear rotinas de forma incoerente com o seu real comportamento interno.',
    fix: 'Separe as rotinas ou use nomes condizentes com o efeito colateral, ex: `normalizarEExibirStatus()`.'
  },
  {
    title: 'Chamada recursiva acidental infinita',
    code: `public static void exibir() {\n    exibir(); // chama a si mesmo!\n}`,
    symptom: 'Exception in thread "main" java.lang.StackOverflowError',
    cause: 'Chamar o próprio método recursivamente sem uma condição de parada, estourando a pilha de execução.',
    fix: 'Remova a chamada recursiva acidental ou implemente um critério lógico de parada.'
  }
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="v53-errors-clinic">
      <nav className="v53-errors-nav">
        {ERRORS.map((e, i) => (
          <button key={i} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>
            <span>{i + 1}</span>
            <span className="guided-error-label">{e.title}</span>
          </button>
        ))}
      </nav>
      <div className="v53-error-card">
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
        <div className="v53-error-flow">
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

const GUIDED_PROGRAM_053 = `public class OficinaMetodosVoid {
    public static void main(String[] args) {
        String[] clientes = {"Ana", "Bruno"};
        long[] valoresCentavos = {3500L, 7200L};
        String[] status = {" pendente ", "aprovado"};

        exibirCabecalho();
        normalizarStatus(status);

        for (int i = 0; i < clientes.length; i++) {
            exibirPedido(clientes[i], valoresCentavos[i], status[i]);
        }
    }

    static void exibirCabecalho() {
        System.out.println("=== PEDIDOS ===");
    }

    static void normalizarStatus(String[] status) {
        if (status == null) return;
        for (int i = 0; i < status.length; i++) {
            if (status[i] != null) {
                status[i] = status[i].trim().toUpperCase();
            }
        }
    }

    static void exibirPedido(String cliente, long valorCentavos, String status) {
        if (cliente == null || cliente.isBlank()) {
            System.out.println("Cliente inválido.");
            return;
        }
        System.out.println(cliente + " | " + valorCentavos + " | " + status);
    }
}`;

// ── 9. Entrega & Desafio ────────────────────────────
function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Criar Diretório',
      cmd: `New-Item -ItemType Directory -Force labs\\m1\\aula-053-metodos-sem-retorno\ncd labs\\m1\\aula-053-metodos-sem-retorno\nNew-Item Main.java, CabecalhoRodape.java, MensagemComParametro.java, ExibirPedido.java, RelatorioPedidosComMetodos.java, ExibirArrayClientes.java, ExibirMatrizComMetodo.java, NormalizarStatusComMetodo.java, IncrementarTentativaComMetodo.java, AuditoriaComMetodos.java, OrdemServicoComMetodos.java, ProdutoComMetodos.java, PagamentoComMetodos.java, ReturnVazioEmVoid.java, MetodoChamandoMetodo.java, ErroMetodoDentroMain.java, ErroMetodoNaoChamado.java, ErroGuardarRetornoVoid.java, ErroReturnValorEmVoid.java, ErroSemStatic.java, ErroChamadaRecursiva.java`,
      out: 'Criado com sucesso — 21 arquivos de laboratório para a Aula 053.',
      tip: 'Cada arquivo deve conter a respectiva classe Java declarada nesta lição.'
    },
    {
      title: 'Compilar e Observar Falhas',
      cmd: `javac ErroGuardarRetornoVoid.java\njavac ErroReturnValorEmVoid.java\njavac ErroChamadaRecursiva.java\nif ($LASTEXITCODE -eq 0) { java ErroChamadaRecursiva }`,
      out: `ErroGuardarRetornoVoid:\nincompatible types: void cannot be converted to String\n\nErroReturnValorEmVoid:\ncannot return a value from method whose result type is void\n\nErroChamadaRecursiva:\njava.lang.StackOverflowError`,
      tip: 'Observe os erros de compilação relacionados ao retorno e o estouro de pilha no runtime.'
    },
    {
      title: 'Validar Métodos com Sucesso',
      cmd: `javac CabecalhoRodape.java RelatorioPedidosComMetodos.java NormalizarStatusComMetodo.java ReturnVazioEmVoid.java\njava CabecalhoRodape\njava NormalizarStatusComMetodo`,
      out: `CabecalhoRodape:\n====================\nSISTEMA DE PEDIDOS\n\nNormalizarStatusComMetodo:\nPENDENTE\nAPROVADO`,
      tip: 'Confirme o correto alinhamento dos métodos estáticos em console.'
    },
    {
      title: 'Commit de Fechamento',
      cmd: `git status\ngit add labs/m1/aula-053-metodos-sem-retorno docs/diario-de-bordo.md\ngit commit -m "Aula 053: pratica metodos sem retorno em Java"\ngit status`,
      out: 'working tree clean',
      tip: 'Assegure-se de que os arquivos .class compilados estão descartados via gitignore.'
    }
  ];
  const current = steps[stage];

  return (
    <section>
      <div className="v53-delivery-nav">
        {steps.map((s, i) => (
          <button key={s.title} type="button" className={stage === i ? 'active' : ''} onClick={() => setStage(i)}>
            <span>{i < stage ? <Check size={11} /> : i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="v53-terminal">
        <header><Terminal size={14} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={14} /> {current.tip}</p>
      </div>
      <div className="v53-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button>
      </div>

      <aside className="guided-note info" style={{ marginTop: '20px' }}>
        <Lightbulb size={20} />
        <div><strong>Exemplo guiado antes do desafio</strong><p>Copie o programa completo, compile com <code>javac OficinaMetodosVoid.java</code> e execute com <code>java OficinaMetodosVoid</code>. Localize a declaração, cada chamada, o efeito no array e o <code>return;</code> de proteção.</p></div>
      </aside>
      <CodePanel name="OficinaMetodosVoid.java" code={GUIDED_PROGRAM_053} />
      <div className="v53-console success">
        <header><Terminal size={14} /> Saída esperada</header>
        <pre>{'=== PEDIDOS ===\nAna | 3500 | PENDENTE\nBruno | 7200 | APROVADO'}</pre>
      </div>

      <section className="guided-challenge" style={{ marginTop: '20px' }}>
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: CadastroPedidosComMetodos.java</h3></div>
        <p>Crie <code>CadastroPedidosComMetodos.java</code> na pasta da aula. Leia pedidos contendo cliente (String), valor (long centavos) e status (String). Implemente as responsabilidades dividindo o código nos seguintes métodos void:</p>
        <ul>
          <li><strong>exibirMenu()</strong>: Exibe as opções de console.</li>
          <li><strong>cadastrarPedido(...)</strong>: Recebe os arrays paralelos e o índice a preencher. Lê as entradas com Scanner, aplica validação do/while e `trim()`.</li>
          <li><strong>normalizarDados(...)</strong>: Recebe os arrays e aplica `trim().toUpperCase()` nos status correspondentes.</li>
          <li><strong>exibirRelatorio(...)</strong>: Exibe os cabeçalhos, a lista de pedidos, calcula e imprime a soma total dos valores e exibe a mensagem de rodapé chamando outros sub-métodos.</li>
          <li><strong>Buffer do Scanner</strong>: Certifique-se de tratar a quebra de linha após ler o long de valor no cadastro.</li>
        </ul>
      </section>

      <div className="guided-file v53-code" style={{ marginTop: '16px' }}>
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
  if (block.type === 'exec_sim') return <ExecutionFlowSimulator />;
  if (block.type === 'anatomy') return <AnatomiaPanel />;
  if (block.type === 'extracao') return <ExtracaoLab />;
  if (block.type === 'arrays') return <ArraysMatrizesLab />;
  if (block.type === 'efeito') return <EfeitoColateralLab />;
  if (block.type === 'return') return <ReturnVazioLab />;
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
    id: 'fluxo', eyebrow: 'Conceito Central', label: 'Fluxo de Execução',
    title: 'Acompanhando a pilha de execução (Stack) passo a passo', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Veja como a chamada de métodos empilha e desempilha frames de execução na Stack:' }, { type: 'exec_sim' }]
  },
  {
    id: 'anatomia', eyebrow: 'Definição Técnica', label: 'Anatomia do Método',
    title: 'Estrutura técnica da assinatura e escopo de métodos estáticos', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Passe o mouse sobre cada parte do cabeçalho do método para entender sua responsabilidade:' }, { type: 'anatomy' }]
  },
  {
    id: 'extracao', eyebrow: 'Refatoração', label: 'Extração de Método',
    title: 'Organizando e simplificando blocos gigantes em rotinas nomeadas', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Compare a organização estrutural do código antes e depois da refatoração em métodos:' }, { type: 'extracao' }]
  },
  {
    id: 'arrays', eyebrow: 'Passagem de Dados', label: 'Arrays & Matrizes',
    title: 'Passando estruturas de dados dimensionais como parâmetros', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Examine como métodos sem retorno processam dados de arrays e matrizes:' }, { type: 'arrays' }]
  },
  {
    id: 'efeito', eyebrow: 'Modificações', label: 'Efeito Colateral',
    title: 'Métodos void que alteram referências na memória Heap', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Aplique a normalização nos status e observe a alteração física do array original:' }, { type: 'efeito' }]
  },
  {
    id: 'return', eyebrow: 'Controle de Fluxo', label: 'Return Vazio em Void',
    title: 'Interrupção antecipada do processamento com return seguro', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Digite valores negativos ou positivos e observe se o método atinge o return de escape:' }, { type: 'return' }]
  },
  {
    id: 'dominios', eyebrow: 'Aplicações Práticas', label: 'Galeria de Domínios',
    title: 'Rotinas sem retorno aplicadas em 7 regras de negócio de backend', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Navegue pelas regras de exibição e controle em domínios reais de negócios:' }, { type: 'domains' }]
  },
  {
    id: 'clinica', eyebrow: 'Depuração', label: 'Clínica de Erros',
    title: 'Diagnóstico e resolução das 10 falhas comuns com métodos sem retorno', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Estude as armadilhas comuns em tempo de compilação ou execução e aprenda a corrigi-las:' }, { type: 'errors' }]
  },
  {
    id: 'entrega', eyebrow: 'Prática Local', label: 'Entrega & Desafio',
    title: 'Execução dos 21 laboratórios e o desafio CadastroPedidosComMetodos', duration: '10 min',
    blocks: [{ type: 'lead', text: 'Siga o fluxo do PowerShell local para compilar com segurança e crie a solução do desafio:' }, { type: 'delivery' }]
  }
];

// ── Componente Principal ─────────────────────────────
export default function GuidedVoidMethodsLesson053({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
    <article className="guided-git-lesson guided-void-methods-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Play size={17} /> Métodos</span>
          <p className="guided-sequence">053 · M1.33</p>
          <h1>Métodos sem Retorno</h1>
          <p>Aprenda a estruturar responsabilidades em blocos de código reaproveitáveis. Domine a declaração de métodos <code>void</code> estáticos, a pilha de execução (Stack), parâmetros e argumentos, efeitos colaterais na memória e o uso de return vazio.</p>
        </div>
        <div className="guided-hero-status">
          <Play size={42} />
          <strong>{progress}%</strong>
          <span>{completedLabel}</span>
        </div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula 053" items={[
        { value: 'void', label: 'Sem retorno de valor' },
        { value: 'Pilha (Stack)', label: 'Fluxo de chamadas' },
        { value: 'Referência', label: 'Efeito colateral' }
      ]} />

      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 053">
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
                <h3>Métodos sem Retorno dominados!</h3>
                <p>{lessonComplete ? 'Assinatura, chamadas, fluxo, efeitos e return vazio consolidados.' : 'Conclua a aula para registrar seu progresso.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 052</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Métodos void consolidados' : allStepsComplete ? 'Use o botão acima' : 'Pratique assinaturas, parâmetros, efeitos e barreira de retorno'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Próxima Aula'}>
          Aula 054 <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
