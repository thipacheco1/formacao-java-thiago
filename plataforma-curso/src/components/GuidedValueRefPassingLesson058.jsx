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
import './guidedValueRefPassingLesson.css';

const STORAGE_KEY = 'guided-value-ref-passing-lesson-058-progress';

const EVIDENCE = [
  '# Aula 058 — Passagem de Valores e Referências', '',
  '## Conceitos Base', '- [ ] Entendi que o Java é sempre pass-by-value (passa por valor)', '- [ ] Compreendi que para primitivos o Java copia o valor real da variável', '- [ ] Compreendi que para objetos e arrays o Java copia o valor da referência (endereço da Heap)', '- [ ] Aprendi a frase técnica correta: "Java passa a referência por valor"', '',
  '## Mutações vs Reatribuições', '- [ ] Diferenciei mutação (alterar o conteúdo do objeto na Heap) de reatribuição (apontar variável local para outro endereço)', '- [ ] Verifiquei que mutações de arrays dentro de métodos afetam a variável original do chamador', '- [ ] Verifiquei que reatribuir o parâmetro de array/objeto não altera o apontador original da main', '- [ ] Compreendi a imutabilidade da String no pool de literais e a exigência de usar retorno para alterá-la', '',
  '## Efeitos Colaterais e Retornos', '- [ ] Identifiquei o risco de alterar coleções compartilhadas silenciosamente', '- [ ] Desenhei métodos de cálculo puros livres de mutações na Heap', '- [ ] Apliquei a validação defensiva contra referências nulas antes do uso do trim/isBlank', '',
  '## Evidências Locais', '- [ ] Criei, compilei e executei os 29 arquivos locais de laboratórios', '- [ ] Registrei a imobilidade de variáveis primitivas na main em `ErroPrimitivoNaoMudaFora.java`', '- [ ] Diagnostiquei a falha silenciosa de mutação em método de cálculo em `ErroArrayAlteradoSemPerceber.java`', '- [ ] Corrigi a ausência de atribuição com retorno de Strings em `ErroStringSemRetorno.java`',
  '',
  '## Decisão de Projeto', '- Por que rotinas puras de cálculo (como calcularTotal) não devem provocar efeitos colaterais nos arrays recebidos?', '- Qual o impacto semântico de reatribuir um parâmetro de referência dentro de uma sub-rotina Java?'
].join('\n');

// ── Utilidades ──────────────────────────────────────
function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  };
  return <button type="button" className="v58-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file v58-code">
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

// ── 1. Simulador Físico de Memória (Stack & Heap) ───
function MemorySimulator() {
  const [stage, setStage] = useState(-1);

  // Etapas
  // 0: Declarar int estoque = 10
  // 1: Chamar e Alterar Primitivo (Estoque método = 99)
  // 2: Retornar (Estoque continua 10)
  // 3: Declarar int[] valores = {10, 20}
  // 4: Chamar Método (Cópia Referência ➔ 0x7fa)
  // 5: Mudar valores[0] = 99 (Heap muda)
  // 6: Reatribuir valores = {5, 6} (Muda método para 0x8ef)

  const steps = [
    { label: 'Declarar int estoque', desc: 'Na Stack do main, a variável primitiva "estoque" recebe o valor físico 10.' },
    { label: 'Passar Primitivo', desc: 'O método é acionado. Na Stack do método, uma nova variável local "estoque" é criada com uma cópia do valor 10. Alteramos para 99.' },
    { label: 'Escopo destruído', desc: 'O método finaliza. O escopo local do método é limpo da Stack. O main continua com estoque = 10.' },
    { label: 'Declarar int[] valores', desc: 'No main, declaramos o array. A Stack do main recebe o ponteiro "valores = 0x7fa", apontando para [10, 20] na Heap.' },
    { label: 'Passar Array (Cópia)', desc: 'Chamamos o método. A Stack do método recebe uma CÓPIA do endereço físico da referência (0x7fa).' },
    { label: 'Mudar na Heap (Mutação)', desc: 'valores[0] = 99 é executado. Como o método tem a referência 0x7fa, ele altera o dado físico na Heap. O main vê a mudança.' },
    { label: 'Reatribuir local', desc: 'valores = new int[]{5,6} (0x8ef). O método aponta para outro array na Heap. O main continua intacto apontando para 0x7fa.' }
  ];

  const current = steps[stage] || { label: 'Aguardando...', desc: 'Use os botões para controlar os frames da JVM.' };

  return (
    <div className="v58-memory-simulator">
      <div className="v58-mem-grid">
        <div className="v58-mem-col">
          <h4>Stack (Memória de Execução)</h4>
          <div className={`v58-mem-item ${(stage === 0 || stage === 1 || stage === 2) ? 'active' : ''}`}>
            <small>main (Stack Frame)</small>
            {(stage === 0 || stage === 1 || stage === 2) && 'estoque = 10'}
            {(stage >= 3) && 'valores = 0x7fa'}
          </div>
          <div className={`v58-mem-item ${(stage === 1 || stage === 4 || stage === 5 || stage === 6) ? 'active' : ''}`}>
            <small>método (Stack Frame)</small>
            {stage === 1 && 'estoque = 99 (cópia)'}
            {stage === 4 && 'valores = 0x7fa (cópia)'}
            {stage === 5 && 'valores = 0x7fa (cópia)'}
            {stage === 6 && 'valores = 0x8ef (reatribuído)'}
            {stage !== 1 && stage !== 4 && stage !== 5 && stage !== 6 && '—'}
          </div>
        </div>

        <div className="v58-mem-arrow-col">
          <div className="v58-mem-arrow-item">
            {(stage === 4 || stage === 5) && (
              <>
                Ponteiro comum<br />
                <ArrowRight size={18} />
              </>
            )}
            {stage === 6 && (
              <>
                Desalinhado!<br />
                <ArrowRight size={18} style={{ color: '#ef4444' }} />
              </>
            )}
          </div>
        </div>

        <div className="v58-mem-col">
          <h4>Heap (Objetos Compartilhados)</h4>
          <div className={`v58-mem-item ${(stage >= 3) ? 'highlight' : ''}`}>
            <small>Endereço: 0x7fa (Array original)</small>
            {stage >= 3 && stage < 5 && '[10, 20]'}
            {stage >= 5 && '[99, 20]'}
            {stage < 3 && '—'}
          </div>
          <div className={`v58-mem-item ${stage === 6 ? 'highlight' : ''}`}>
            <small>Endereço: 0x8ef (Array local)</small>
            {stage === 6 ? '[5, 6]' : '—'}
          </div>
        </div>
      </div>

      <div style={{ height: '60px', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
        <p style={{ fontSize: '.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
          <strong>Etapa {stage + 1}: {current.label}</strong><br />
          {current.desc}
        </p>
      </div>

      <div className="v58-sim-controls" style={{ margin: 0 }}>
        <button type="button" className="v58-sim-action" onClick={() => setStage(s => s > 0 ? s - 1 : -1)}>Anterior</button>
        <button type="button" className="v58-sim-action" style={{ background: '#10b981' }} onClick={() => setStage(s => s < 6 ? s + 1 : -1)}>
          {stage === 6 ? 'Reiniciar' : 'Avançar'}
        </button>
      </div>
    </div>
  );
}

// ── 2. Painel Mutação vs Reatribuição ────────────────
function CompareLab() {
  const [mutate, setMutate] = useState(true);

  const codeMutate = `public static void main(String[] args) {\n    int[] valores = {10, 20};\n    alterarConteudo(valores);\n    System.out.println(valores[0]); // imprime 99!\n}\npublic static void alterarConteudo(int[] valores) {\n    valores[0] = 99; // mutação física na Heap\n}`;
  const codeReassign = `public static void main(String[] args) {\n    int[] valores = {10, 20};\n    trocarReferencia(valores);\n    System.out.println(valores[0]); // continua 10!\n}\npublic static void trocarReferencia(int[] valores) {\n    valores = new int[]{99, 88}; // reatribuição local na Stack\n}`;

  return (
    <div className="v58-sim-box">
      <div className="v58-sim-controls">
        <label>Modificação de Referência:</label>
        <button type="button" className="v58-sim-action" style={{ background: mutate ? '#4f46e5' : '#334155' }} onClick={() => setMutate(true)}>Mutação de Conteúdo (valores[0] = 99)</button>
        <button type="button" className="v58-sim-action" style={{ background: !mutate ? '#4f46e5' : '#334155' }} onClick={() => setMutate(false)}>Reatribuição de Referência (valores = new...)</button>
      </div>

      <div className="v58-sim-grid">
        <CodePanel name="MutacaoVsReatribuição.java" code={mutate ? codeMutate : codeReassign} lines={false} />
        <div className="v58-console success" style={{ justifyContent: 'center' }}>
          <header><Terminal size={14} /> Análise de Mutabilidade</header>
          <pre>{mutate
            ? 'Cenário: Mutação\n\n- O método acessa o endereço compartilhado.\n- O valor da Heap é modificado diretamente.\n- A main enxerga a alteração na primeira célula do array.'
            : 'Cenário: Reatribuição\n\n- O método aponta o parâmetro local para um novo array na Heap.\n- A referência guardada na Stack da main permanece apontando para o array original.'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 3. Lab de Strings Imutáveis ─────────────────────
function StringLab() {
  const [useReturn, setUseReturn] = useState(false);
  const status = ' aprovado ';
  const result = useReturn ? status.trim().toUpperCase() : status;

  const codeFail = `public static void main(String[] args) {\n    String status = " aprovado ";\n    normalizar(status); // tenta mudar sem retorno!\n    System.out.println("Status: '" + status + "'");\n}\npublic static void normalizar(String status) {\n    status = status.trim().toUpperCase(); // reatribuição local!\n}`;
  const codeSuccess = `public static void main(String[] args) {\n    String status = " aprovado ";\n    status = normalizar(status); // captura e reatribui na main!\n    System.out.println("Status: '" + status + "'");\n}\npublic static String normalizar(String status) {\n    return status.trim().toUpperCase(); // devolve a nova String\n}`;

  return (
    <div className="v58-sim-box">
      <div className="v58-sim-controls">
        <label>Arquitetura com String:</label>
        <button type="button" className="v58-sim-action" style={{ background: !useReturn ? '#ef4444' : '#334155' }} onClick={() => setUseReturn(false)}>Sem retorno (Muda local)</button>
        <button type="button" className="v58-sim-action" style={{ background: useReturn ? '#10b981' : '#334155' }} onClick={() => setUseReturn(true)}>Com retorno e atribuição</button>
      </div>

      <div className="v58-sim-grid">
        <CodePanel name="NormalizarStatus.java" code={useReturn ? codeSuccess : codeFail} lines={false} />
        <div className={`v58-console ${useReturn ? 'success' : 'error'}`}>
          <header><Terminal size={14} /> Console</header>
          <pre>{`Status no main: '${result}'`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 4. Lab de StringBuilder Mutável ─────────────────
function StringBuilderLab() {
  const [mutate, setMutate] = useState(true);

  const codeMutate = `public static void main(String[] args) {\n    StringBuilder txt = new StringBuilder("Pedido");\n    alterarTexto(txt);\n    System.out.println(txt); // imprime "Pedido aprovado"\n}\npublic static void alterarTexto(StringBuilder txt) {\n    txt.append(" aprovado"); // mutação interna\n}`;
  const codeReassign = `public static void main(String[] args) {\n    StringBuilder txt = new StringBuilder("Pedido");\n    trocarTexto(txt);\n    System.out.println(txt); // continua "Pedido"!\n}\npublic static void trocarTexto(StringBuilder txt) {\n    txt = new StringBuilder("Outro texto"); // reatribuição local\n}`;

  return (
    <div className="v58-sim-box">
      <div className="v58-sim-controls">
        <label>Comportamento do StringBuilder:</label>
        <button type="button" className="v58-sim-action" style={{ background: mutate ? '#4f46e5' : '#334155' }} onClick={() => setMutate(true)}>Mutação (.append())</button>
        <button type="button" className="v58-sim-action" style={{ background: !mutate ? '#4f46e5' : '#334155' }} onClick={() => setMutate(false)}>Reatribuição (= new)</button>
      </div>

      <div className="v58-sim-grid">
        <CodePanel name="TesteStringBuilder.java" code={mutate ? codeMutate : codeReassign} lines={false} />
        <div className="v58-console success">
          <header><Terminal size={14} /> Console</header>
          <pre>{mutate
            ? 'Valor Impresso: Pedido aprovado\n\n[Análise]: O StringBuilder é mutável. O append alterou o objeto na Heap apontado pelo main.'
            : 'Valor Impresso: Pedido\n\n[Análise]: O método reatribuiu o parâmetro local. A main continuou apontando para o StringBuilder original.'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 5. Galeria de Domínios ──────────────────────────
const DOMAINS = [
  {
    id: 'estoque_primitivo', label: 'Estoque Primitivo', file: 'ProdutoEstoquePrimitivo.java',
    code: `public static void baixarEstoque(int estoque, int baixa) {\n    estoque = estoque - baixa; // altera cópia Stack local\n}`,
    output: 'Estoque no main após chamada void: 10 (Não alterou!)',
    insight: 'Demonstra a imobilidade de primitivos passados por valor.'
  },
  {
    id: 'estoque_retorno', label: 'Estoque com Retorno', file: 'ProdutoEstoqueComRetorno.java',
    code: `public static int baixarEstoque(int estoque, int baixa) {\n    return estoque - baixa; // devolve novo valor\n}`,
    output: 'Estoque no main capturando retorno: 7',
    insight: 'Para atualizar um primitivo do main, capture o retorno da função e reatribua.'
  },
  {
    id: 'mensageria', label: 'Mensageria Array', file: 'MensageriaTentativasArray.java',
    code: `public static void incrementarTentativa(int[] tentativas, int index) {\n    tentativas[index]++; // mutação na Heap\n}`,
    output: 'Tentativas da mensagem 3 no main: 1',
    insight: 'Alterar o conteúdo do array recebido afeta as referências associadas.'
  },
  {
    id: 'normalizar_array', label: 'Normalizar Array', file: 'NormalizarStatusArrayReferencia.java',
    code: `public static void normalizar(String[] status) {\n    if (status == null) return;\n    for (int i = 0; i < status.length; i++) {\n        if (status[i] != null) {\n            status[i] = status[i].trim().toUpperCase();\n        }\n    }\n}`,
    output: 'Status: PENDENTE, APROVADO, RECUSADO',
    insight: 'Limpa as strings e substitui os apontadores internos do array compartilhado.'
  },
  {
    id: 'pedidos_paralelos', label: 'Pedidos Paralelos', file: 'PedidosParalelosReferencia.java',
    code: `public static void aprovarPedido(String[] status, int index) {\n    status[index] = "APROVADO"; // mutação\n}`,
    output: 'Bruno | 2500 | APROVADO',
    insight: 'Aprova o pedido alterando diretamente a posição no array compartilhado.'
  },
  {
    id: 'pagamento', label: 'Pagamento Parcela', file: 'PagamentoValorParcelaRetorno.java',
    code: `public static long calcularParcela(long valor, int parcelas) {\n    return valor / parcelas; // produz novo valor\n}`,
    output: 'Valor da parcela calculada: 2500 c',
    insight: 'Métodos puros de cálculo produzem retorno, sem provocar efeitos na Heap/Stack.'
  },
  {
    id: 'os_indireta', label: 'OS String Indireta', file: 'OsStatusStringReferencia.java',
    code: `public static void normalizar(String status) {\n    status = status.trim().toUpperCase(); // reatribuição local\n}`,
    output: 'Status no main continua contendo espaços: " aberta "',
    insight: 'A imutabilidade da String impede modificações na referência do main sem retorno.'
  },
  {
    id: 'os_corrigida', label: 'OS String Corrigida', file: 'OsStatusStringCorrigido.java',
    code: `public static String normalizar(String status) {\n    return status.trim().toUpperCase();\n}`,
    output: 'Status no main corrigido: ABERTA',
    insight: 'Sempre devolva referências de strings formatadas e atribua no chamador.'
  },
  {
    id: 'auditoria', label: 'Auditoria String', file: 'AuditoriaMensagemString.java',
    code: `public static String formatar(String msg) {\n    return msg.trim().toUpperCase();\n}`,
    output: 'Log: CRIACAO DE PEDIDO',
    insight: 'Formata mensagens gerando novas instâncias textuais e retornando.'
  },
  {
    id: 'matrizes', label: 'Matriz Compartilhada', file: 'MatrizReferencia.java',
    code: `public static void zerarPrimeira(int[][] matriz) {\n    matriz[0][0] = 0; // mutação no objeto compartilhado\n}\n\npublic static void trocarMatriz(int[][] matriz) {\n    matriz = new int[][] {{9, 9}}; // só reatribui a cópia local\n}`,
    output: 'Após zerarPrimeira: matriz[0][0] = 0\nApós trocarMatriz: a referência do main continua a mesma',
    insight: 'A mutação chega ao objeto compartilhado; reatribuir o parâmetro muda apenas a cópia local da referência.'
  }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return (
    <section className="v58-domains-gallery">
      <div className="v58-domains-sidebar">
        {DOMAINS.map((d, i) => (
          <button key={d.id} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>{d.label}</button>
        ))}
      </div>
      <div className="v58-domains-content">
        <CodePanel name={item.file} code={item.code} lines={false} />
        <div className="v58-console">
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
    title: 'Dizer que Java passa objetos por referência',
    code: `// Conceituação errada:\n"Java passa objetos por referência, por isso o array muda no método."`,
    symptom: 'Falta de precisão técnica em avaliações ou entrevistas de backend.',
    cause: 'Confusão conceitual: Java passa a REFERÊNCIA por VALOR (cópia do ponteiro).',
    fix: 'Entenda que a referência é copiada. A cópia aponta para o mesmo objeto Heap.'
  },
  {
    title: 'Achar que alterar primitivo altera fora',
    code: `public static void baixar(int estoque, int qtd) { estoque = estoque - qtd; }\n// Chamada:\nbaixar(estoque, 3); // O estoque original continua igual!`,
    symptom: 'Bug lógico: estoques e saldos não mudam na main após chamadas void.',
    cause: 'Primitivos são passados por valor (recebem cópias locais na Stack).',
    fix: 'Use retorno e capture o valor no main: `estoque = baixar(estoque, 3);`.'
  },
  {
    title: 'Achar que alterar array não altera a main',
    code: `public static void formatar(int[] valores) { valores[0] = 99; } // altera a main!`,
    symptom: 'Efeitos colaterais indesejados e contaminação de arrays de dados.',
    cause: 'Como as referências na Stack apontam para o mesmo array Heap, mutações afetam o original.',
    fix: 'Crie um novo array se precisar realizar cálculos sem alterar o array do chamador.'
  },
  {
    title: 'Achar que reatribuir array troca a main',
    code: `public static void trocar(int[] valores) { valores = new int[]{1, 2}; }`,
    symptom: 'O array original na main não reflete o novo array criado na rotina.',
    cause: 'A reatribuição altera apenas a variável do parâmetro local na Stack.',
    fix: 'Para retornar um novo array, assine o método como int[] e retorne o novo objeto.'
  },
  {
    title: 'Tentar normalizar String sem o comando de retorno',
    code: `public static void normalizar(String status) { status = status.trim(); }`,
    symptom: 'A String original continua contendo espaços externos após a chamada.',
    cause: 'Strings são imutáveis e o trim() gera nova String, apenas reatribuindo o parâmetro local.',
    fix: 'Altere a assinatura para String e capture: `status = normalizar(status);`.'
  },
  {
    title: 'Método que altera dados com nome neutro',
    code: `public static void obterDados(String[] status) { status[0] = "PENDENTE"; }`,
    symptom: 'Dificuldade de rastrear mútura acidental de arrays compartilhados.',
    cause: 'Uso de nomes de métodos que implicam leitura (obter) mas realizam escrita/mutação.',
    fix: 'Escolha nomes descritivos de alteração física: `normalizarStatus` ou `limparArray`.'
  },
  {
    title: 'Modificar array em rotinas puras de cálculo',
    code: `public static int calcularTotal(int[] valores) {\n    valores[0] = 0; // zera dado na Heap!\n    return total;\n}`,
    symptom: 'Bugs secundários causados por contaminação de dados após chamadas de cálculo.',
    cause: 'Mistura de mutações com processamentos puramente aritméticos.',
    fix: 'Remova qualquer mutação física no array original em métodos de cálculo.'
  },
  {
    title: 'Não validar referências nulas',
    code: `public static void normalizar(String status) {\n    System.out.println(status.trim()); // Se for null, quebra!\n}`,
    symptom: 'Runtime Exception: java.lang.NullPointerException',
    cause: 'Tentar acessar métodos de instância em variáveis de referência que guardam null.',
    fix: 'Sempre inclua guard clauses iniciais no método: `if (status == null) return;`.'
  },
  {
    title: 'Confundir a referência Stack com o objeto na Heap',
    code: `// Acreditar que "valores" é o array de inteiros em si.`,
    symptom: 'Dificuldades lógicas de abstração de diagramas de memória JVM.',
    cause: 'Desconhecimento de que a variável é apenas um endereço/ponteiro para o objeto físico Heap.',
    fix: 'Esboce diagramas: Stack guarda o endereço hexadecimal (0xabc), Heap guarda os dados.'
  },
  {
    title: 'Esquecer que o parâmetro local é isolado',
    code: `public static void processar(int item) { item = 10; }`,
    symptom: 'Bugs causados por tentativa de modificar variáveis do chamador reatribuindo parâmetros.',
    cause: 'Falta de entendimento sobre o ciclo e escopo das Stack Frames.',
    fix: 'Utilize retornos explícitos ou altere objetos compartilhados via referências Heap.'
  }
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="v58-errors-clinic">
      <nav className="v58-errors-nav">
        {ERRORS.map((e, i) => (
          <button key={i} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>
            <span>{i + 1}</span>
            <span className="guided-error-label">{e.title}</span>
          </button>
        ))}
      </nav>
      <div className="v58-error-card">
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
        <div className="v58-error-flow">
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

const GUIDED_PROGRAM_058 = `public class OficinaPassagemValores {
    public static void main(String[] args) {
        int estoque = 10;
        long saldoCentavos = 5000L;
        double taxa = 1.5;
        boolean ativo = true;
        int[] valores = {10, 20};
        String status = " pendente ";
        StringBuilder log = new StringBuilder("Pedido");

        alterarPrimitivo(estoque);
        alterarLong(saldoCentavos);
        alterarDouble(taxa);
        alterarBoolean(ativo);
        alterarConteudo(valores);
        trocarArray(valores);
        status = normalizar(status);
        acrescentarLog(log);

        System.out.println("Estoque: " + estoque);
        System.out.println("Saldo: " + saldoCentavos);
        System.out.println("Taxa: " + taxa);
        System.out.println("Ativo: " + ativo);
        System.out.println("Array: [" + valores[0] + ", " + valores[1] + "]");
        System.out.println("Status: " + status);
        System.out.println("Log: " + log);
    }

    static void alterarPrimitivo(int estoque) {
        estoque = 99;
    }

    static void alterarLong(long saldoCentavos) {
        saldoCentavos = 0L;
    }

    static void alterarDouble(double taxa) {
        taxa = 9.9;
    }

    static void alterarBoolean(boolean ativo) {
        ativo = false;
    }

    static void alterarConteudo(int[] valores) {
        valores[0] = 99;
    }

    static void trocarArray(int[] valores) {
        valores = new int[] {5, 6};
    }

    static String normalizar(String status) {
        if (status == null) return "SEM_STATUS";
        return status.trim().toUpperCase();
    }

    static void acrescentarLog(StringBuilder log) {
        if (log != null) log.append(" aprovado");
    }
}`;

// ── 7. Entrega & Desafio ────────────────────────────
function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Criar Diretório',
      cmd: `New-Item -ItemType Directory -Force labs\\m1\\aula-058-passagem-valores-referencias\ncd labs\\m1\\aula-058-passagem-valores-referencias\nNew-Item Main.java, PassagemLong.java, PassagemBoolean.java, PassagemDouble.java, AlterarPrimitivoComRetorno.java, IncrementarPrimitivoComRetorno.java, PassagemArray.java, ReatribuirArray.java, MutacaoVsReatribuicaoArray.java, PassagemString.java, NormalizarStringComRetorno.java, PassagemObjetoMutavel.java, ReatribuirObjetoMutavel.java, ProdutoEstoquePrimitivo.java, ProdutoEstoqueComRetorno.java, MensageriaTentativasArray.java, NormalizarStatusArrayReferencia.java, PedidosParalelosReferencia.java, PagamentoValorParcelaRetorno.java, OsStatusStringReferencia.java, OsStatusStringCorrigido.java, AuditoriaMensagemString.java, MatrizReferencia.java, ReatribuirMatriz.java, ErroPrimitivoNaoMudaFora.java, ErroArrayAlteradoSemPerceber.java, ErroReatribuirArray.java, ErroStringSemRetorno.java, ErroMetodoCalculoAlterandoArray.java`,
      out: 'Criado com sucesso — 29 arquivos de laboratório para a Aula 058.',
      tip: 'Cada arquivo deve conter as lógicas de testes de primitivos e ponteiros de referência.'
    },
    {
      title: 'Validar Imutabilidade Primitiva',
      cmd: `javac ErroPrimitivoNaoMudaFora.java ErroStringSemRetorno.java\njava ErroPrimitivoNaoMudaFora\njava ErroStringSemRetorno`,
      out: `ErroPrimitivoNaoMudaFora:\nEstoque real: 10\n\nErroStringSemRetorno:\nStatus:  pendente `,
      tip: 'Observe que nem o int estoque e nem a String status sofreram alterações na main.'
    },
    {
      title: 'Testar Efeito de Mutação',
      cmd: `javac ErroArrayAlteradoSemPerceber.java\njava ErroArrayAlteradoSemPerceber`,
      out: `ErroArrayAlteradoSemPerceber:\nPrimeiro valor depois do cálculo: 0\n(Deveria continuar contendo 10!)`,
      tip: 'Este erro lógico demonstra por que rotinas puras de cálculo não devem realizar mutações.'
    },
    {
      title: 'Commit de Fechamento',
      cmd: `git status\ngit add labs/m1/aula-058-passagem-valores-referencias docs/diario-de-bordo.md\ngit commit -m "Aula 058: pratica passagem de valores e referencias"\ngit status`,
      out: 'nothing to commit, working tree clean',
      tip: 'Certifique-se de que os arquivos de classe .class não entrem na área de staging.'
    }
  ];
  const current = steps[stage];

  return (
    <section>
      <div className="v58-delivery-nav">
        {steps.map((s, i) => (
          <button key={s.title} type="button" className={stage === i ? 'active' : ''} onClick={() => setStage(i)}>
            <span>{i < stage ? <Check size={11} /> : i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="v58-terminal">
        <header><Terminal size={14} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={14} /> {current.tip}</p>
      </div>
      <div className="v58-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button>
      </div>

      <aside className="guided-note info" style={{ marginTop: '20px' }}>
        <Lightbulb size={20} />
        <div><strong>Exemplo guiado antes do desafio</strong><p>Execute a classe e preveja cada linha antes de olhar a saída: cópia do primitivo, mutação do array compartilhado, reatribuição local, nova String retornada e mutação do <code>StringBuilder</code>.</p></div>
      </aside>
      <CodePanel name="OficinaPassagemValores.java" code={GUIDED_PROGRAM_058} />
      <div className="v58-console success">
        <header><Terminal size={14} /> Saída esperada</header>
        <pre>{'Estoque: 10\nSaldo: 5000\nTaxa: 1.5\nAtivo: true\nArray: [99, 20]\nStatus: PENDENTE\nLog: Pedido aprovado'}</pre>
      </div>

      <section className="guided-challenge" style={{ marginTop: '20px' }}>
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: SimuladorPassagemMemoria.java</h3></div>
        <p>Crie <code>SimuladorPassagemMemoria.java</code> na pasta da aula. Declare no main uma variável primitiva de saldo: <code>long saldoCentavos = 5000L</code>, um array de controle: <code>long[] saldosParceiros = {'{1000L, 2000L}'}</code> e uma String de status: <code>String statusConta = " ativa "</code>. Implemente métodos estáticos:</p>
        <ul>
          <li><strong>processarSaldo(long saldo)</strong>: Tenta modificar o saldo somando R$ 10,00 (1000L centavos). Retorne o saldo atualizado e capture na main para demonstrar o controle de primitivos.</li>
          <li><strong>aplicarTaxa(long[] saldos)</strong>: Aplica uma mutação de R$ 5,00 (500L centavos) subtraindo da primeira célula do array original (provocando efeito colateral físico na Heap).</li>
          <li><strong>trocarSaldos(long[] saldos)</strong>: Tenta reatribuir o array recebido com <code>saldos = new long[]{"{0L, 0L}"}</code>. Demonstre no console da main que a reatribuição local do parâmetro não desfez o array original da main.</li>
          <li><strong>higienizarStatus(String status)</strong>: Trata a string aplicando trim e toUpperCase, retornando a nova String de status para a main.</li>
        </ul>
      </section>

      <div className="guided-file v58-code" style={{ marginTop: '16px' }}>
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
  if (block.type === 'mem_sim') return <MemorySimulator />;
  if (block.type === 'compare') return <CompareLab />;
  if (block.type === 'string') return <StringLab />;
  if (block.type === 'builder') return <StringBuilderLab />;
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
    id: 'memory', eyebrow: 'Visão Física', label: 'Stack & Heap Sim',
    title: 'Modelando o empilhamento JVM e apontadores hexadecimais', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Opere o simulador passo a passo e observe a movimentação das Stack Frames e Heap de dados:' }, { type: 'mem_sim' }]
  },
  {
    id: 'compare', eyebrow: 'Mecânica de Referência', label: 'Mutação vs Reatribuição',
    title: 'Diferença entre reatribuir variáveis e mutar dados físicos', duration: '5 min',
    blocks: [{ type: 'lead', text: 'Entenda por que a reatribuição do parâmetro é um processo isolado da Stack local:' }, { type: 'compare' }]
  },
  {
    id: 'string', eyebrow: 'Tipos Especiais', label: 'Pool de String',
    title: 'A imutabilidade das Strings literais e captura de retornos', duration: '5 min',
    blocks: [{ type: 'lead', text: 'Analise por que normalizações textuais exigem retorno explícito e reatribuição na main:' }, { type: 'string' }]
  },
  {
    id: 'builder', eyebrow: 'Comparativo Mutável', label: 'StringBuilder Lab',
    title: 'Mutações diretas na Heap com objetos mutáveis de suporte', duration: '5 min',
    blocks: [{ type: 'lead', text: 'Observe como o append() no StringBuilder opera de forma mutável compartilhada:' }, { type: 'builder' }]
  },
  {
    id: 'dominios', eyebrow: 'Arquitetura Aplicada', label: 'Galeria de Domínios',
    title: 'Modelos práticos de múturas e retornos em 10 domínios', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Navegue pelos cenários para aprender a planejar a mutação ou o retorno de dados:' }, { type: 'domains' }]
  },
  {
    id: 'clinica', eyebrow: 'Depuração', label: 'Clínica de Erros',
    title: 'Diagnósticos de 10 equívocos clássicos de passagem de dados', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Analise os sintomas de falha causados por confusão de primitivos e ponteiros de referência:' }, { type: 'errors' }]
  },
  {
    id: 'entrega', eyebrow: 'Prática no Terminal', label: 'Entrega & Desafio',
    title: 'Validação local dos laboratórios e simulação de memória', duration: '10 min',
    blocks: [{ type: 'lead', text: 'Execute os testes estáticos locais e entregue o desafio de simulação de saldo:' }, { type: 'delivery' }]
  }
];

// ── Componente Principal ─────────────────────────────
export default function GuidedValueRefPassingLesson058({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
    <article className="guided-git-lesson guided-value-ref-passing-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Play size={17} /> Métodos</span>
          <p className="guided-sequence">058 · M1.38</p>
          <h1>Passagem de Valores e Referências</h1>
          <p>Domine a transferência de dados na JVM. Compreenda a regra absoluta "pass-by-value" (passagem por valor), veja como os primitivos copiam valores e os objetos copiam referências lógicas, diferencie mutação de reatribuição e controle efeitos colaterais.</p>
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

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula 058" items={[
        { value: 'Pass-by-Value', label: 'Regra Java' },
        { value: 'Cópia de Ref', label: 'Objetos e Arrays' },
        { value: 'Imutável', label: 'String Pool' }
      ]} />

      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 058">
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
                <h3>Passagem de Parâmetros dominada!</h3>
                <p>{lessonComplete ? 'Comportamentos físicos da Stack e Heap da JVM totalmente consolidados.' : 'Conclua a aula para registrar seu progresso no cronograma.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 057</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Passagem de parâmetros dominada' : allStepsComplete ? 'Use o botão acima' : 'Pratique Stack vs Heap, mutações vs reatribuições e Strings'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Próxima Aula'}>
          Aula 059 <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
