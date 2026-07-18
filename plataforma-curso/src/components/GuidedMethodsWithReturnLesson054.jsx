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
import './guidedMethodsWithReturnLesson.css';

const STORAGE_KEY = 'guided-methods-with-return-lesson-054-progress';

const EVIDENCE = [
  '# Aula 054 — Métodos com Retorno', '',
  '## Conceitos Base', '- [ ] Entendi que métodos com retorno devolvem dados que podem ser reutilizados', '- [ ] Compreendi a diferença entre imprimir na tela (void) e retornar (tipo definido)', '- [ ] Declarei tipos de retorno compatíveis na assinatura do método', '',
  '## Tipagem de Retorno', '- [ ] Usei int para contadores e long centavos para modelagem financeira segura', '- [ ] Realizei cast explícito (double) na divisão para obter médias decimais exatas', '- [ ] Desenvolvi métodos booleanos expressos como perguntas (ex: statusValido)', '- [ ] Retornei String e tratei referências nulas de entrada', '',
  '## Fluxo de Retorno', '- [ ] Garanti que todo caminho lógico (if/else) possui um return compatível', '- [ ] Implementei guard clauses com return antecipado para entradas inválidas', '- [ ] Conheci a sentinela -1 em métodos de busca linear', '- [ ] Compreendi que a instrução return encerra o fluxo do método e impede linhas inacessíveis', '',
  '## Evidências Locais', '- [ ] Criei, compilei e executei os 29 arquivos locais de laboratórios', '- [ ] Diagnostiquei a falta de retorno na compilação de `ErroSemReturn.java`', '- [ ] Resolvi o erro de caminho sem retorno em `ErroCaminhoSemRetorno.java`', '- [ ] Tratei o erro de variável que ignora o retorno em `ErroIgnorarRetorno.java`',
  '',
  '## Decisão de Projeto', '- Por que prefiro guardar o retorno de um método em uma variável intermediária na main?', '- Qual a vantagem de projetar métodos puros de cálculo sem chamadas de impressão?'
].join('\n');

// ── Utilidades ──────────────────────────────────────
function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  };
  return <button type="button" className="r54-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file r54-code">
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

// ── 1. Simulador de Fluxo Matemático ────────────────
function MathFlowSimulator() {
  const [step, setStep] = useState(-1);
  const [a, setA] = useState(10);
  const [b, setB] = useState(20);

  const steps = [
    { label: 'Argumentos Prontos', desc: `Valores a = ${a} e b = ${b} serão passados na chamada do método.` },
    { label: 'Chamada do Método', desc: `O controle passa para o método: somar(int a, int b).\nVariáveis locais recebem os argumentos.` },
    { label: 'Cálculo Interno', desc: `O frame do método calcula a soma com suas variáveis locais: a + b = ${a + b}.` },
    { label: 'Retorno de Valor', desc: `O comando "return" devolve o valor calculado (${a + b}) para o chamador.` },
    { label: 'Atribuição na Main', desc: `O main recebe o valor retornado e o armazena na variável 'resultado' (${a + b}).` }
  ];

  const current = steps[step] || { label: 'Pronto.', desc: 'Pressione "Avançar" para iniciar.' };

  return (
    <div className="r54-sim-box">
      <div className="r54-return-visual">
        <div className={`r54-box-node ${step === 0 ? 'active' : ''}`}>
          <small>1. Main (Argumentos)</small>
          a={a} | b={b}
        </div>
        <div className="r54-flow-arrow">➔</div>
        <div className={`r54-box-node ${step === 1 || step === 2 ? 'active' : ''}`}>
          <small>2. somar(int, int)</small>
          {step >= 2 ? `${a} + ${b}` : 'Processando...'}
        </div>
        <div className="r54-flow-arrow">➔</div>
        <div className={`r54-box-node ${step === 3 ? 'active' : ''}`}>
          <small>3. return ({a+b})</small>
          Entregando...
        </div>
        <div className="r54-flow-arrow">➔</div>
        <div className={`r54-box-node output ${step === 4 ? 'active' : ''}`}>
          <small>4. main (Variável)</small>
          resultado = {step === 4 ? a + b : '—'}
        </div>
      </div>

      <div className="r54-sim-controls">
        <label>Alterar a:</label>
        <input
          type="number"
          style={{ width: '60px', padding: '6px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={a}
          onChange={e => setA(parseInt(e.target.value, 10) || 0)}
        />
        <label style={{ marginLeft: '12px' }}>Alterar b:</label>
        <input
          type="number"
          style={{ width: '60px', padding: '6px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={b}
          onChange={e => setB(parseInt(e.target.value, 10) || 0)}
        />
        <button type="button" className="r54-sim-action" style={{ marginLeft: 'auto' }} onClick={() => setStep(s => s < 4 ? s + 1 : -1)}>
          {step === -1 ? '▶ Iniciar Fluxo' : step === 4 ? 'Finalizar' : 'Próximo passo →'}
        </button>
      </div>

      <div className="r54-sim-grid">
        <CodePanel name="SomaComRetorno.java" code={`public class Main {\n    public static void main(String[] args) {\n        int resultado = somar(${a}, ${b});\n        System.out.println(resultado);\n    }\n\n    public static int somar(int a, int b) {\n        return a + b;\n    }\n}`} lines={false} />
        <div className="r54-console success">
          <header><Terminal size={14} /> Inspecionador de Fluxo</header>
          <pre>{`Etapa: ${current.label}\n\n${current.desc}`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 2. Painel de Anatomia do Método ──────────────────
function AnatomiaPanel() {
  return (
    <div className="r54-sim-box">
      <div className="r54-anatomy-box">
        <div className="r54-anatomy-line">
          <span className="r54-anatomy-part access" data-tooltip="Modificador de Acesso: Permite visibilidade pública">public</span>{' '}
          <span className="r54-anatomy-part static" data-tooltip="Modificador Estático: Permite chamada direta a partir do main">static</span>{' '}
          <span className="r54-anatomy-part type" data-tooltip="Tipo de Retorno (int): Promete devolver um valor inteiro">int</span>{' '}
          <span className="r54-anatomy-part name" data-tooltip="Nome do Método: Expressa o cálculo em camelCase">somar</span>(
          <span className="r54-anatomy-part param" data-tooltip="Parâmetros: Definição dos valores recebidos pelo método">int a, int b</span>
          ) &#123;
        </div>
        <div className="r54-anatomy-line">    <span className="r54-anatomy-part return" data-tooltip="Comando return: Devolve o resultado da expressão e encerra a execução">return a + b;</span></div>
        <div className="r54-anatomy-line">&#125;</div>
      </div>
      <aside className="guided-note info">
        <Lightbulb size={20} />
        <div>
          <strong>Compromisso de Compilação</strong>
          <p>
            O tipo de retorno definido (ex: <code>int</code>) funciona como um contrato. Se você declarar que o método retorna <code>int</code> e tentar retornar <code>String</code>, ou simplesmente esquecer o comando <code>return</code>, o compilador do Java abortará o processo imediatamente.
          </p>
        </div>
      </aside>
    </div>
  );
}

// ── 3. Lab Comparativo: Imprimir vs Retornar ─────────
function ComparativoLab() {
  const codeVoid = `// Menos flexível: imprime diretamente\npublic static void exibirSoma(int a, int b) {\n    System.out.println("Soma: " + (a + b));\n}\n// Chamada:\nexibirSoma(10, 20); // imprime, mas não guarda o valor`;
  const codeReturn = `// Mais flexível: retorna o cálculo\npublic static int somar(int a, int b) {\n    return a + b;\n}\n// Chamada:\nint resultado = somar(10, 20);\nif (resultado > 25) { ... } // reutiliza o valor em regras`;

  return (
    <div className="r54-sim-box">
      <div className="r54-compare-grid">
        <div className="r54-compare-card">
          <div className="r54-compare-header" style={{ color: '#ef4444' }}>Exibir no Console (void)</div>
          <CodePanel name="ExibirVoid.java" code={codeVoid} lines={false} />
          <p style={{ fontSize: '.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
            O método realiza a impressão na saída padrão. O valor calculado morre imediatamente no terminal, impossibilitando sua reutilização em lógicas de negócio subsequentes.
          </p>
        </div>
        <div className="r54-compare-card">
          <div className="r54-compare-header" style={{ color: '#10b981' }}>Retornar Valor (int)</div>
          <CodePanel name="SomarRetorno.java" code={codeReturn} lines={false} />
          <p style={{ fontSize: '.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
            O método calcula e devolve o valor. O chamador (como o main) tem total autonomia para decidir se irá armazenar, comparar, exibir ou injetar o resultado em outro fluxo.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 4. Lab de Tipos de Retorno ──────────────────────
const TYPES = [
  {
    type: 'int', title: 'Inteiro (int)',
    code: `public static int somarQuantidades(int a, int b) {\n    return a + b;\n}`,
    desc: 'Usado para quantidades físicas, índices, contadores e IDs numéricos simples.'
  },
  {
    type: 'long', title: 'Inteiro Longo (long centavos)',
    code: `public static long somarValores(long centavosA, long centavosB) {\n    return centavosA + centavosB;\n}`,
    desc: 'Seguindo as boas práticas da formação, usamos long centavos para modelagem monetária segura no backend, evitando as imprecisões do double.'
  },
  {
    type: 'double', title: 'Ponto Flutuante (double)',
    code: `public static double calcularMedia(int soma, int quantidade) {\n    return (double) soma / quantidade; // cast explícito\n}`,
    desc: 'Usado para médias decimais, percentuais, notas acadêmicas ou cálculos científicos. Exige cast explícito para garantir a precisão decimal da divisão.'
  },
  {
    type: 'boolean', title: 'Decisão Lógica (boolean)',
    code: `public static boolean pagamentoValido(long valorCentavos) {\n    return valorCentavos > 0; // avalia expressão booleana\n}`,
    desc: 'Retorna verdadeiro ou falso. Ideal para validações expressas como perguntas (ex: isValido, temEstoque).'
  },
  {
    type: 'string', title: 'Texto (String)',
    code: `public static String obterMensagemStatus(String status) {\n    if ("APROVADO".equals(status)) {\n        return "Pedido aprovado com sucesso.";\n    }\n    return "Status desconhecido.";\n}`,
    desc: 'Retorna referências textuais. Útil para formatar rótulos ou descrições corporativas. Permite múltiplos return condicionais.'
  }
];

function TypesLab() {
  const [selected, setSelected] = useState(0);
  const item = TYPES[selected];
  return (
    <div className="r54-sim-box">
      <div className="r54-sim-controls">
        <label>Selecionar Tipo:</label>
        {TYPES.map((t, idx) => (
          <button key={t.type} type="button" className="r54-sim-action" style={{ background: selected === idx ? '#4f46e5' : '#334155' }} onClick={() => setSelected(idx)}>
            {t.title}
          </button>
        ))}
      </div>

      <div className="r54-sim-grid">
        <CodePanel name={`Retorno${item.title.split(' ')[0]}.java`} code={item.code} lines={false} />
        <div className="r54-console success" style={{ justifyContent: 'center' }}>
          <header><Terminal size={14} /> Descrição Lógica</header>
          <pre>{`Tipo de Retorno: ${item.type.toUpperCase()}\n\nDiretriz:\n${item.desc}`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 5. Lab de Operações com Arrays ──────────────────
function ArraysOperationsLab() {
  const [op, setOp] = useState('total');
  const array = [15, 40, 7, 99, 23];

  let res = '';
  if (op === 'total') {
    res = `Total: ${array.reduce((acc, v) => acc + v, 0)}`;
  } else if (op === 'media') {
    res = `Média: ${(array.reduce((acc, v) => acc + v, 0) / array.length).toFixed(1)}`;
  } else if (op === 'maior') {
    res = `Maior: ${Math.max(...array)}`;
  } else if (op === 'busca') {
    res = `Busca 99 -> Encontrado no índice [3]\nBusca 50 -> Não encontrado, retorna -1 (sentinela)`;
  }

  const codeTotal = `public static int calcularTotal(int[] valores) {\n    int total = 0;\n    for (int i = 0; i < valores.length; i++) {\n        total += valores[i];\n    }\n    return total;\n}`;
  const codeMedia = `public static double calcularMedia(int[] valores) {\n    if (valores.length == 0) return 0.0;\n    int total = calcularTotal(valores);\n    return (double) total / valores.length;\n}`;
  const codeMaior = `public static int calcularMaior(int[] valores) {\n    if (valores.length == 0) return 0;\n    int maior = valores[0];\n    for (int i = 1; i < valores.length; i++) {\n        if (valores[i] > maior) maior = valores[i];\n    }\n    return maior;\n}`;
  const codeBusca = `public static int buscarIndice(int[] valores, int procurado) {\n    for (int i = 0; i < valores.length; i++) {\n        if (valores[i] == procurado) return i; // return imediato\n    }\n    return -1; // sentinela de erro/ausência\n}`;

  const getCode = () => {
    if (op === 'total') return codeTotal;
    if (op === 'media') return codeMedia;
    if (op === 'maior') return codeMaior;
    return codeBusca;
  };

  return (
    <div className="r54-sim-box">
      <div className="p51-dashboard" style={{ gridTemplateColumns: 'repeat(5, 1fr)', margin: '0 0 14px' }}>
        {array.map((val, idx) => (
          <div className="p51-var-card" key={idx}>
            <small>[{idx}]</small>
            <strong>{val}</strong>
          </div>
        ))}
      </div>

      <div className="r54-sim-controls">
        <label>Operação no Array:</label>
        <button type="button" className="r54-sim-action" style={{ background: op === 'total' ? '#4f46e5' : '#334155' }} onClick={() => setOp('total')}>Calcular Total</button>
        <button type="button" className="r54-sim-action" style={{ background: op === 'media' ? '#4f46e5' : '#334155' }} onClick={() => setOp('media')}>Calcular Média</button>
        <button type="button" className="r54-sim-action" style={{ background: op === 'maior' ? '#4f46e5' : '#334155' }} onClick={() => setOp('maior')}>Calcular Maior</button>
        <button type="button" className="r54-sim-action" style={{ background: op === 'busca' ? '#4f46e5' : '#334155' }} onClick={() => setOp('busca')}>Buscar Índice (-1)</button>
      </div>

      <div className="r54-sim-grid">
        <CodePanel name={`${op.toUpperCase()}.java`} code={getCode()} lines={false} />
        <div className="r54-console success">
          <header><Terminal size={14} /> Console de Cálculo</header>
          <pre>{`Resultado de Execução:\n${res}\n\n[Depuração]: O main recebe o retorno limpo e formata a exibição.`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 6. Lab de Validador de Regras & Normalização ────
function ValidadorRegrasLab() {
  const [statusInput, setStatusInput] = useState(' aprovado ');

  const normalizado = statusInput === null ? '' : statusInput.trim().toUpperCase();
  const isValid = ['PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO'].includes(normalizado);

  const code = `public static boolean statusValido(String status) {\n    if (status == null || status.isBlank()) {\n        return false;\n    }\n    String normalizado = status.trim().toUpperCase();\n    return "PENDENTE".equals(normalizado) || "APROVADO".equals(normalizado);\n}`;

  return (
    <div className="r54-sim-box">
      <div className="r54-sim-controls">
        <label>Entrada de Status (String):</label>
        <input
          style={{ padding: '6px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={statusInput}
          onChange={e => setStatusInput(e.target.value)}
          placeholder="Ex: aprovado"
        />
      </div>

      <div className="p51-dashboard" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="p51-var-card"><small>Entrada física</small><strong>"{statusInput}"</strong></div>
        <div className="p51-var-card"><small>Normalizado</small><strong>"{normalizado}"</strong></div>
        <div className={`p51-var-card ${isValid ? 'count' : 'error'}`}><small>statusValido()</small><strong>{isValid ? 'TRUE' : 'FALSE'}</strong></div>
      </div>

      <div className="r54-sim-grid">
        <CodePanel name="ValidarStatusMetodo.java" code={code} lines={false} />
        <div className={`r54-console ${isValid ? 'success' : 'error'}`}>
          <header><Terminal size={14} /> Console</header>
          <pre>{`Resultado: ${isValid ? 'Status aprovado e dentro das regras de negócio.' : 'Status inválido! Operação bloqueada preventivamente.'}`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 7. Galeria de Domínios ──────────────────────────
const DOMAINS = [
  {
    id: 'pedido', label: 'Pedido', file: 'PedidoMetodosRetorno.java',
    code: `public static long calcularTotalPedidos(long[] valoresCentavos) {\n    long total = 0L;\n    for (int i = 0; i < valoresCentavos.length; i++) {\n        total += valoresCentavos[i];\n    }\n    return total;\n}`,
    output: 'Total em centavos: 8500',
    insight: 'Devolve a soma do array de pedidos sem imprimir na tela.'
  },
  {
    id: 'pagamento', label: 'Pagamento', file: 'PagamentoMetodosRetorno.java',
    code: `public static boolean pagamentoValido(long valor, int parcelas) {\n    return valor > 0 && parcelas > 0;\n}\npublic static long calcularParcela(long valor, int parcelas) {\n    return valor / parcelas;\n}`,
    output: 'Valor da parcela: 2500 c',
    insight: 'Valida as regras no boolean antes de processar e retornar a divisão financeira.'
  },
  {
    id: 'estoque', label: 'Estoque', file: 'ProdutoEstoqueMetodoRetorno.java',
    code: `public static boolean temEstoque(int atual, int solicitado) {\n    return solicitado > 0 && solicitado <= atual;\n}\npublic static int calcularBaixa(int atual, int solicitado) {\n    return atual - solicitado;\n}`,
    output: 'Estoque final após baixa: 7',
    insight: 'Isola a validação lógica do cálculo matemático de baixa no estoque.'
  },
  {
    id: 'os', label: 'OS', file: 'OrdemServicoMetodoRetorno.java',
    code: `public static boolean podeConcluirOs(String status, int atividades) {\n    if (status == null) return false;\n    return "ABERTA".equals(status.trim().toUpperCase()) && atividades == 0;\n}`,
    output: 'OS pode ser concluída: TRUE',
    insight: 'Retorna a decisão de negócio encapsulada em uma rotina booleana limpa.'
  },
  {
    id: 'mensageria', label: 'Mensageria', file: 'MensageriaMetodoRetorno.java',
    code: `public static boolean deveEnviar(int tentativas, boolean telefoneValido) {\n    return telefoneValido && tentativas < 3;\n}`,
    output: 'Envio autorizado: TRUE',
    insight: 'Determina a autorização de envio com base nos parâmetros operacionais.'
  },
  {
    id: 'auditoria', label: 'Auditoria', file: 'AuditoriaMetodoRetorno.java',
    code: `public static String obterDescricao(String operacao) {\n    if ("EDICAO".equals(operacao)) return "Edição de registro";\n    return "Operação desconhecida";\n}`,
    output: 'Operação: Edição de registro',
    insight: 'Retorna a descrição de negócio mapeada a partir de status textuais.'
  },
  {
    id: 'paralelos', label: 'Arrays Paralelos', file: 'TotalAprovadoMetodoRetorno.java',
    code: `public static long totalAprovado(long[] valores, String[] status) {\n    long total = 0;\n    for (int i = 0; i < valores.length; i++) {\n        if ("APROVADO".equals(status[i])) total += valores[i];\n    }\n    return total;\n}`,
    output: 'Total aprovado acumulado: 5500 c',
    insight: 'Valida e acumula dados baseando-se no alinhamento de índices de arrays paralelos.'
  },
  {
    id: 'cliente', label: 'Buscar Cliente', file: 'BuscarClienteMetodoRetorno.java',
    code: `public static int buscarCliente(String[] clientes, String consulta) {\n    if (clientes == null || consulta == null) return -1;\n    String alvo = consulta.trim();\n    for (int i = 0; i < clientes.length; i++) {\n        if (clientes[i] != null && clientes[i].trim().equalsIgnoreCase(alvo)) {\n            return i;\n        }\n    }\n    return -1;\n}`,
    output: 'Cliente encontrado no índice: 1',
    insight: 'Combina validação defensiva, normalização textual e a sentinela -1 em uma busca reutilizável.'
  },
  {
    id: 'matriz', label: 'Matrizes', file: 'TotalMatrizMetodoRetorno.java',
    code: `public static int totalMatriz(int[][] m) {\n    int total = 0;\n    for (int l = 0; l < m.length; l++) {\n        for (int c = 0; c < m[l].length; c++) total += m[l][c];\n    }\n    return total;\n}`,
    output: 'Total acumulado da matriz: 210',
    insight: 'Calcula o somatório total da matriz bidimensional e retorna.'
  }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return (
    <section className="r54-domains-gallery">
      <div className="r54-domains-sidebar">
        {DOMAINS.map((d, i) => (
          <button key={d.id} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>{d.label}</button>
        ))}
      </div>
      <div className="r54-domains-content">
        <CodePanel name={item.file} code={item.code} lines={false} />
        <div className="r54-console">
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
    title: 'Esquecer o comando return',
    code: `public static int somar(int a, int b) {\n    int resultado = a + b;\n    // Esquceu o return!\n}`,
    symptom: 'Compilation error: missing return statement',
    cause: 'O método promete devolver int na assinatura, mas encerra sem nenhuma instrução return.',
    fix: 'Adicione a instrução `return resultado;` no fim do escopo.'
  },
  {
    title: 'Retornar tipo de dado incompatível',
    code: `public static int obterCodigo() {\n    return "123"; // tenta devolver String!\n}`,
    symptom: 'Compilation error: incompatible types: String cannot be converted to int',
    cause: 'O valor da expressão no return difere do tipo assinado no cabeçalho do método.',
    fix: 'Mude a expressão para retornar um inteiro (`return 123;`) ou altere a assinatura para String.'
  },
  {
    title: 'Nem todo caminho lógico retorna valor',
    code: `public static String obterMensagem(boolean sucesso) {\n    if (sucesso) {\n        return "OK";\n    }\n    // Se sucesso for falso, o método termina sem retornar nada!\n}`,
    symptom: 'Compilation error: missing return statement',
    cause: 'O compilador identifica caminhos (como o else implícito) que não terminam em return.',
    fix: 'Insira um `return "ERRO";` fora do bloco if para servir de retorno padrão.'
  },
  {
    title: 'Tentar retornar valor em rotina void',
    code: `public static void processar(int a) {\n    return a * 10; // ERRADO: void não retorna!\n}`,
    symptom: 'Compilation error: cannot return a value from method whose result type is void',
    cause: 'Tentar enviar um argumento de retorno em método assinado como void.',
    fix: 'Mude o void da assinatura para int ou remova a expressão do return (deixando apenas return; para escape).'
  },
  {
    title: 'Ignorar o retorno na chamada do main',
    code: `public static void main(String[] args) {\n    calcularTotal(valores); // valor ignorado!\n}`,
    symptom: 'O programa roda, mas o resultado do cálculo é descartado da memória.',
    cause: 'Chamar o método puro sem atribuir seu valor de retorno a nenhuma variável.',
    fix: 'Atribua a chamada a uma variável local: `int total = calcularTotal(valores);`.'
  },
  {
    title: 'Misturar cálculo de dados com exibição',
    code: `public static int calcularTotal(int[] valores) {\n    int total = 0;\n    // ... loops\n    System.out.println("Total: " + total); // Ruim!\n    return total;\n}`,
    symptom: 'Dificuldade de reutilizar o método em outras partes do sistema que não exigem exibição.',
    cause: 'Mistura de responsabilidades (cálculo + exibição) no mesmo método.',
    fix: 'Remova o println. Deixe o método puro retornando o valor e faça a exibição na main.'
  },
  {
    title: 'Nomes booleanos confusos',
    code: `public static boolean processarStatus(String status)`,
    symptom: 'Dificuldade de ler o if: `if (processarStatus(status))` não soa natural.',
    cause: 'Uso de verbos de ação para rotinas booleanas que apenas respondem perguntas.',
    fix: 'Nomeie expressando perguntas lógicas: `public static boolean statusValido(String status)`.'
  },
  {
    title: 'Retornar zero silencioso para erros estruturais',
    code: `if (valores.length != status.length) {\n    return 0; // Mas a soma não era zero! Era um erro!\n}`,
    symptom: 'Bugs lógicos difíceis de rastrear onde o sistema assume valor zero mascarando a falha física.',
    cause: 'Uso de valores padrão numéricos normais como sinalizadores de erro.',
    fix: 'Utilize valores sentinelas negativos (como -1 para busca) ou comente a simplificação para futura O.O./exceções.'
  },
  {
    title: 'Confundir parâmetros de entrada com retorno',
    code: `public static int somar(int a, int b) {\n    a = 10; b = 20; // Alterando parâmetros!\n    return a + b;\n}`,
    symptom: 'Valores passados como argumentos na chamada são ignorados ou sobrescritos.',
    cause: 'Sobrescrever as variáveis de entrada no corpo do método.',
    fix: 'Use os parâmetros recebidos diretamente sem reatribuí-los.'
  },
  {
    title: 'Inserir código após a instrução return',
    code: `public static int obterNumero() {\n    return 10;\n    System.out.println("Inacessível!"); // Erro!\n}`,
    symptom: 'Compilation error: unreachable statement',
    cause: 'O return encerra o método imediatamente, tornando qualquer código posterior inacessível.',
    fix: 'Mova ou remova qualquer instrução localizada abaixo do return principal.'
  }
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="r54-errors-clinic">
      <nav className="r54-errors-nav">
        {ERRORS.map((e, i) => (
          <button key={i} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>
            <span>{i + 1}</span>
            <span className="guided-error-label">{e.title}</span>
          </button>
        ))}
      </nav>
      <div className="r54-error-card">
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
        <div className="r54-error-flow">
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

const GUIDED_PROGRAM_054 = `public class OficinaMetodosRetorno {
    public static void main(String[] args) {
        long[] valores = {2500L, 3200L, 1800L};
        String[] clientes = {"Ana", "Bruno", "Carla"};

        long total = calcularTotal(valores);
        double media = calcularMedia(valores);
        int indice = buscarCliente(clientes, " bruno ");

        System.out.println("Total: " + total);
        System.out.println("Média: " + media);
        System.out.println("Índice de Bruno: " + indice);
        System.out.println("Status: " + normalizarStatus(" aprovado "));
    }

    static long calcularTotal(long[] valores) {
        long total = 0L;
        for (long valor : valores) total += valor;
        return total;
    }

    static double calcularMedia(long[] valores) {
        if (valores == null || valores.length == 0) return 0.0;
        return (double) calcularTotal(valores) / valores.length;
    }

    static int buscarCliente(String[] clientes, String consulta) {
        if (clientes == null || consulta == null) return -1;
        String alvo = consulta.trim();
        for (int i = 0; i < clientes.length; i++) {
            if (clientes[i] != null && clientes[i].equalsIgnoreCase(alvo)) return i;
        }
        return -1;
    }

    static String normalizarStatus(String status) {
        if (status == null) return "SEM_STATUS";
        return status.trim().toUpperCase();
    }
}`;

// ── 9. Entrega & Desafio ────────────────────────────
function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Criar Diretório',
      cmd: `New-Item -ItemType Directory -Force labs\\m1\\aula-054-metodos-com-retorno\ncd labs\\m1\\aula-054-metodos-com-retorno\nNew-Item Main.java, ImprimirVsRetornar.java, RetornoInt.java, RetornoLong.java, RetornoDouble.java, RetornoBoolean.java, RetornoString.java, ReturnIfElse.java, CalcularTotalArray.java, CalcularMediaArray.java, CalcularMaiorValor.java, BuscarIndiceArray.java, ValidarStatusMetodo.java, NormalizarStatusRetorno.java, PedidoMetodosRetorno.java, PagamentoMetodosRetorno.java, ProdutoEstoqueMetodoRetorno.java, OrdemServicoMetodoRetorno.java, MensageriaMetodoRetorno.java, AuditoriaMetodoRetorno.java, TotalAprovadoMetodoRetorno.java, BuscarClienteMetodoRetorno.java, TotalMatrizMetodoRetorno.java, ErroSemReturn.java, ErroTipoRetornoErrado.java, ErroCaminhoSemRetorno.java, ErroVoidRetornandoValor.java, ErroIgnorarRetorno.java, ErroCodigoAposReturn.java`,
      out: 'Criado com sucesso — 29 arquivos de laboratório para a Aula 054.',
      tip: 'Cada arquivo deve ser preenchido com as rotinas de cálculo correspondentes.'
    },
    {
      title: 'Compilar e Validar Erros',
      cmd: `javac ErroSemReturn.java\njavac ErroCaminhoSemRetorno.java\njavac ErroCodigoAposReturn.java`,
      out: `ErroSemReturn:\nmissing return statement\n\nErroCaminhoSemRetorno:\nmissing return statement\n\nErroCodigoAposReturn:\nunreachable statement`,
      tip: 'Observe as falhas estruturais indicadas pelo compilador Java impedindo a geração dos binários.'
    },
    {
      title: 'Executar Métodos de Sucesso',
      cmd: `javac RetornoDouble.java RetornoBoolean.java CalcularMaiorValor.java ValidarStatusMetodo.java\njava RetornoDouble\njava CalcularMaiorValor`,
      out: `RetornoDouble:\nMédia: 8.333333333333334\n\nCalcularMaiorValor:\nMaior: 99`,
      tip: 'Verifique se a saída no terminal reflete a exatidão das contas matemáticas dos métodos puros.'
    },
    {
      title: 'Commit de Fechamento',
      cmd: `git status\ngit add labs/m1/aula-054-metodos-com-retorno docs/diario-de-bordo.md\ngit commit -m "Aula 054: pratica metodos com retorno"\ngit status`,
      out: 'working tree clean',
      tip: 'Verifique se a staging area está livre de arquivos .class indesejados.'
    }
  ];
  const current = steps[stage];

  return (
    <section>
      <div className="r54-delivery-nav">
        {steps.map((s, i) => (
          <button key={s.title} type="button" className={stage === i ? 'active' : ''} onClick={() => setStage(i)}>
            <span>{i < stage ? <Check size={11} /> : i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="r54-terminal">
        <header><Terminal size={14} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={14} /> {current.tip}</p>
      </div>
      <div className="r54-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button>
      </div>

      <aside className="guided-note info" style={{ marginTop: '20px' }}>
        <Lightbulb size={20} />
        <div><strong>Exemplo guiado antes do desafio</strong><p>Compile e execute esta classe completa. Siga cada valor desde a chamada, passe pelo <code>return</code> e identifique onde o resultado é guardado ou reutilizado.</p></div>
      </aside>
      <CodePanel name="OficinaMetodosRetorno.java" code={GUIDED_PROGRAM_054} />
      <div className="r54-console success">
        <header><Terminal size={14} /> Saída esperada</header>
        <pre>{'Total: 7500\nMédia: 2500.0\nÍndice de Bruno: 1\nStatus: APROVADO'}</pre>
      </div>

      <section className="guided-challenge" style={{ marginTop: '20px' }}>
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: RelatorioVendasComMetodos.java</h3></div>
        <p>Crie <code>RelatorioVendasComMetodos.java</code> na pasta da aula. Declare arrays paralelos de produtos (String[]), quantidadesVendidas (int[]) e precosCentavos (long[]). Implemente os seguintes métodos puros com retorno:</p>
        <ul>
          <li><strong>calcularTotalVendido(int[] quantidades, long[] precos)</strong>: Retorna o faturamento total em centavos (long), multiplicando quantidade * preço de cada índice alinhado.</li>
          <li><strong>buscarProduto(String[] produtos, String query)</strong>: Retorna o índice (int) do produto correspondente à busca ignorando caixa e espaços, ou retorna a sentinela -1.</li>
          <li><strong>calcularTicketMedio(long totalFaturamento, int totalItens)</strong>: Retorna o ticket médio (double) fazendo cast apropriado. Proteja contra divisão por zero.</li>
          <li><strong>Exibição no main</strong>: Use métodos auxiliares void da aula anterior para formatar as molduras de tabelas e resultados.</li>
        </ul>
      </section>

      <div className="guided-file r54-code" style={{ marginTop: '16px' }}>
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
  if (block.type === 'math_sim') return <MathFlowSimulator />;
  if (block.type === 'anatomy') return <AnatomiaPanel />;
  if (block.type === 'compare') return <ComparativoLab />;
  if (block.type === 'types') return <TypesLab />;
  if (block.type === 'arrays') return <ArraysOperationsLab />;
  if (block.type === 'valid') return <ValidadorRegrasLab />;
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
    id: 'math', eyebrow: 'Fluxo Básico', label: 'Simulador Matemático',
    title: 'Visualizando a passagem de parâmetros e devolução do retorno', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Altere os inputs de soma e acompanhe a mecânica de empilhamento e atribuição do resultado:' }, { type: 'math_sim' }]
  },
  {
    id: 'anatomia', eyebrow: 'Estrutura Técnica', label: 'Anatomia do Retorno',
    title: 'Assinaturas não-void e a instrução técnica return', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Passe o mouse pelos componentes da assinatura do método com retorno:' }, { type: 'anatomy' }]
  },
  {
    id: 'compare', eyebrow: 'Conceito e Boas Práticas', label: 'Imprimir vs Retornar',
    title: 'Diferenciando a exibição no terminal da devolução de valor', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Examine por que retornar valores torna seu código muito mais flexível e profissional:' }, { type: 'compare' }]
  },
  {
    id: 'types', eyebrow: 'Tipagem de Dados', label: 'Tipos de Retorno',
    title: 'Mapeando os retornos às regras e tipos lógicos do backend', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Navegue pelos tipos primitivos e de referência, observando as peculiaridades de cada return:' }, { type: 'types' }]
  },
  {
    id: 'arrays', eyebrow: 'Coleções de Dados', label: 'Operações com Arrays',
    title: 'Varreduras, cálculos e buscas lineares com valor sentinela', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Selecione a operação para verificar o código em Java e o resultado da execução:' }, { type: 'arrays' }]
  },
  {
    id: 'validacao', eyebrow: 'Auditoria de Entrada', label: 'Validador e Normalização',
    title: 'Criação de rotinas defensivas contra nulos e formatação textual', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Modifique o texto para testar a higienização de dados e validações booleanas:' }, { type: 'valid' }]
  },
  {
    id: 'dominios', eyebrow: 'Arquitetura Aplicada', label: 'Galeria de Domínios',
    title: 'Cálculos de negócios encapsulados em 9 domínios práticos', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Veja como o return simplifica a arquitetura interna do backend em vários cenários:' }, { type: 'domains' }]
  },
  {
    id: 'clinica', eyebrow: 'Depuração', label: 'Clínica de Erros',
    title: 'Estudo e correção das 10 falhas comuns na compilação do return', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Examine cada armadilha do return, os sintomas mostrados pelo javac e a correção:' }, { type: 'errors' }]
  },
  {
    id: 'entrega', eyebrow: 'Prática no Terminal', label: 'Entrega & Desafio',
    title: 'Compilação dos 29 arquivos locais e desafio RelatorioVendasComMetodos', duration: '10 min',
    blocks: [{ type: 'lead', text: 'Execute os comandos guiados no PowerShell e implemente a consolidação anual de vendas:' }, { type: 'delivery' }]
  }
];

// ── Componente Principal ─────────────────────────────
export default function GuidedMethodsWithReturnLesson054({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
    <article className="guided-git-lesson guided-methods-with-return-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Play size={17} /> Métodos</span>
          <p className="guided-sequence">054 · M1.34</p>
          <h1>Métodos com Retorno</h1>
          <p>Domine a arte de devolver resultados em Java. Compreenda o comando <code>return</code>, a separação essencial entre cálculo e exibição, a verificação de caminhos lógicos de retorno, o return antecipado e a higienização defensiva de dados.</p>
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

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula 054" items={[
        { value: 'return', label: 'Devolve e encerra' },
        { value: 'Não-Void', label: 'Contrato de compilação' },
        { value: 'Puro', label: 'Isolamento de cálculo' }
      ]} />

      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 054">
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
                <h3>Métodos com Retorno dominados!</h3>
                <p>{lessonComplete ? 'Assinaturas tipadas, múltiplos returns e algoritmos puros consolidados.' : 'Conclua a aula para registrar seu progresso.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 053</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Métodos com retorno consolidados' : allStepsComplete ? 'Use o botão acima' : 'Pratique tipagem, múltiplos returns, pureza e higienização'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Próxima Aula'}>
          Aula 055 <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
