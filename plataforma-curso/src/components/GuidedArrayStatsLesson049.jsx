import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BarChart2, BookOpenCheck,
  Check, CheckCircle2, ChevronRight, Clock3, Copy, FileCode2,
  Lightbulb, ListChecks, RotateCcw, Sparkles, Terminal, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedArrayStatsLesson.css';

const STORAGE_KEY = 'guided-array-stats-lesson-049-progress';

const EVIDENCE = [
  '# Aula 049 — Maior, Menor, Soma e Média em Array', '',
  '## As Quatro Operações', '- [ ] Implementei acumulador de soma iniciado em 0', '- [ ] Calculei média com cast `(double)` após o loop', '- [ ] Inicializei `maior` com `valores[0]` (não com zero)', '- [ ] Inicializei `menor` com `valores[0]` (não com zero)', '',
  '## Inicialização Correta', '- [ ] Entendi por que init com 0 falha em arrays de negativos', '- [ ] Usei `int maior = valores[0]; int menor = valores[0];` como padrão', '',
  '## Portão de Array Vazio', '- [ ] Protegi o código com `if (valores.length == 0)` antes de acessar `valores[0]`', '',
  '## Maior e Menor com Posição', '- [ ] Rastreei `indiceMaior` e `indiceMenor` atualizando a cada novo máximo/mínimo', '- [ ] Entendi a diferença entre `>` (primeira ocorrência) e `>=` (última ocorrência) em empate', '',
  '## Dois Passes', '- [ ] Entendi que valores acima da média requerem dois loops: um para calcular a média e outro para comparar', '',
  '## Domínios Corporativos', '- [ ] Apliquei as operações em long[] para valores financeiros em centavos', '- [ ] Apliquei em double[] para notas e horas de SLA', '- [ ] Apliquei em domínios de estoque, pedidos, OS, mensageria, auditoria e SLA', '',
  '## Evidências Locais', '- [ ] Criei, compilei e executei os 28 arquivos Java no ambiente local', '- [ ] Identifiquei a saída errada de `ErroMaiorInicialZero.java` e `ErroMenorInicialZero.java`', '- [ ] Mantive o histórico Git livre de arquivos `.class`',
  '',
  '## Decisão de Projeto', '- Por que não inicializar maior/menor com zero:', '- Por que a média é calculada APÓS o loop:'
].join('\n');

// ── Utilidades ──────────────────────────────────────
function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  };
  return (
    <button type="button" className="as49-copy" onClick={copy}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copiado' : label}
    </button>
  );
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file as49-code">
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

function ArrayBlocks({ array, activeIndex = -1, maiorIndex = -1, menorIndex = -1, acimaIndexes = [] }) {
  return (
    <div className="as49-array-view">
      {array.map((val, idx) => {
        let cls = 'as49-cell';
        if (idx === activeIndex) cls += ' active';
        else if (maiorIndex !== -1 && idx === maiorIndex) cls += ' maior';
        else if (menorIndex !== -1 && idx === menorIndex) cls += ' menor';
        else if (acimaIndexes.includes(idx)) cls += ' acima';
        return (
          <div key={idx} className={cls}>
            <div className="as49-cell-idx">[{idx}]</div>
            <div className="as49-cell-val">{val}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── 1. Simulador Mestre ─────────────────────────────
function MasterSimulator() {
  const DEFAULT_ARRAY = [15, 40, 7, 99, 23];
  const [rawInput, setRawInput] = useState(DEFAULT_ARRAY.map(String));
  const [editMode, setEditMode] = useState(false);
  const [results, setResults] = useState(null);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState('Pressione "Executar" para iniciar.');

  const array = rawInput.map(s => parseInt(s, 10)).filter(n => !isNaN(n));

  const run = () => {
    if (array.length === 0) { setLog('Array vazio — sem elementos para analisar.'); return; }
    let soma = 0, maior = array[0], menor = array[0];
    const steps = [];
    for (let i = 0; i < array.length; i++) {
      soma += array[i];
      const prevMaior = maior, prevMenor = menor;
      if (array[i] > maior) maior = array[i];
      if (array[i] < menor) menor = array[i];
      steps.push({ soma, maior, menor, i, prevMaior, prevMenor });
    }
    const media = soma / array.length;
    setResults({ steps, media, final: { soma, media, maior, menor } });
    setStep(0);
    setRunning(true);
  };

  const advance = () => {
    if (!results) return;
    const nextStep = step + 1;
    if (nextStep < results.steps.length) {
      setStep(nextStep);
    } else {
      setRunning(false);
    }
  };

  const reset = () => { setResults(null); setStep(-1); setRunning(false); setLog('Pressione "Executar" para iniciar.'); };

  const cur = results && step >= 0 ? results.steps[step] : null;

  useEffect(() => {
    if (!cur) return;
    const v = array[cur.i];
    const lines = [
      `Passo ${cur.i + 1}: índice [${cur.i}] → valor ${v}`,
      `  soma += ${v} → soma = ${cur.soma}`,
      `  ${v} > ${cur.prevMaior}? ${v > cur.prevMaior ? `SIM → maior = ${cur.maior}` : `NÃO → maior continua ${cur.maior}`}`,
      `  ${v} < ${cur.prevMenor}? ${v < cur.prevMenor ? `SIM → menor = ${cur.menor}` : `NÃO → menor continua ${cur.menor}`}`
    ];
    if (!running) lines.push(`\nmedia = (double) ${results.final.soma} / ${array.length} = ${results.final.media.toFixed(1)}`);
    setLog(lines.join('\n'));
  }, [step, running, cur, results, array]);

  const mainCode = `int[] valores = {${array.join(', ')}};\n\nint soma = 0;\nint maior = valores[0]; // ${array[0]}\nint menor = valores[0]; // ${array[0]}\n\nfor (int indice = 0; indice < valores.length; indice++) {\n    soma += valores[indice];\n\n    if (valores[indice] > maior) {\n        maior = valores[indice];\n    }\n    if (valores[indice] < menor) {\n        menor = valores[indice];\n    }\n}\n\ndouble media = (double) soma / valores.length;`;

  return (
    <div className="as49-sim-box">
      <ArrayBlocks
        array={array}
        activeIndex={cur ? cur.i : -1}
        maiorIndex={!running && results ? results.steps[results.steps.length - 1].menor === results.final.menor && array.indexOf(results.final.maior) >= 0 ? array.indexOf(results.final.maior) : -1 : -1}
        menorIndex={!running && results ? array.indexOf(results.final.menor) : -1}
      />

      {editMode && (
        <div className="as49-sim-controls">
          <label>Editar valores (separados por vírgula):</label>
          <input
            style={{ width: '200px', padding: '6px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
            value={rawInput.join(', ')}
            onChange={e => setRawInput(e.target.value.split(',').map(s => s.trim()))}
          />
          <button type="button" className="as49-sim-action" style={{ background: '#334155' }} onClick={() => setEditMode(false)}>Confirmar</button>
        </div>
      )}

      <div className="as49-sim-controls">
        {!results ? (
          <>
            <button type="button" className="as49-sim-action" onClick={run}>▶ Executar</button>
            <button type="button" className="as49-sim-action" style={{ background: '#334155' }} onClick={() => setEditMode(e => !e)}>✏ Editar Array</button>
          </>
        ) : (
          <>
            {running && <button type="button" className="as49-sim-action" onClick={advance}>Próximo passo →</button>}
            <button type="button" className="as49-sim-action" style={{ background: '#334155' }} onClick={reset}>↺ Reiniciar</button>
          </>
        )}
      </div>

      {cur && (
        <div className="as49-dashboard">
          <div className={`as49-var-card indice`}><small>índice</small><strong>{cur.i}</strong></div>
          <div className={`as49-var-card soma`}><small>soma</small><strong>{cur.soma}</strong></div>
          <div className={`as49-var-card media`}><small>média</small><strong>{running ? '—' : results.final.media.toFixed(1)}</strong></div>
          <div className={`as49-var-card maior`}><small>maior</small><strong>{cur.maior}</strong></div>
          <div className={`as49-var-card menor`}><small>menor</small><strong>{cur.menor}</strong></div>
        </div>
      )}

      <div className="as49-sim-grid">
        <CodePanel name="RelatorioArray.java" code={mainCode} lines={false} />
        <div className="as49-console">
          <header><Terminal size={14} /> Console de depuração</header>
          <pre>{log}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 2. Lab de Inicialização ─────────────────────────
function InicializacaoLab() {
  const [modo, setModo] = useState('correct');
  const ARRAY = [-10, -5, -30];
  let maior0 = 0, maiorCorreto = ARRAY[0];
  for (let i = 0; i < ARRAY.length; i++) {
    if (ARRAY[i] > maior0) maior0 = ARRAY[i];
    if (ARRAY[i] > maiorCorreto) maiorCorreto = ARRAY[i];
  }

  const codeCorreto = `int[] valores = {-10, -5, -30};\nint maior = valores[0]; // inicia com -10 (real)\n\nfor (int i = 1; i < valores.length; i++) {\n    if (valores[i] > maior) {\n        maior = valores[i];\n    }\n}\n// maior = -5 ✓`;

  const codeErrado = `int[] valores = {-10, -5, -30};\nint maior = 0; // ERRADO! 0 não está no array\n\nfor (int i = 0; i < valores.length; i++) {\n    if (valores[i] > maior) { // nenhum negativo passa!\n        maior = valores[i];\n    }\n}\n// maior = 0 ✗ (0 não existe no array!)`;

  return (
    <div className="as49-sim-box">
      <ArrayBlocks array={ARRAY} maiorIndex={modo === 'correct' ? 1 : -1} />
      <div className="as49-sim-controls">
        <label>Modo de inicialização:</label>
        <button type="button" className="as49-sim-action" style={{ background: modo === 'correct' ? '#16a34a' : '#475569' }} onClick={() => setModo('correct')}>✅ valores[0]</button>
        <button type="button" className="as49-sim-action" style={{ background: modo === 'wrong' ? '#dc2626' : '#475569' }} onClick={() => setModo('wrong')}>❌ zero fixo</button>
      </div>
      <div className="as49-sim-grid">
        <CodePanel name={modo === 'correct' ? 'CorretoMaiorValor.java' : 'ErroMaiorInicialZero.java'} code={modo === 'correct' ? codeCorreto : codeErrado} lines={false} />
        <div className={`as49-console ${modo === 'correct' ? 'success' : 'error'}`}>
          <header><Terminal size={14} /> Resultado</header>
          <pre>{modo === 'correct'
            ? `Maior valor: ${maiorCorreto}\n\n✓ Correto! O maior valor real do array\n  é ${maiorCorreto}, não zero.`
            : `Maior valor: ${maior0}\n\n✗ Errado! Zero não existe no array.\n  O resultado correto seria ${maiorCorreto}.`
          }</pre>
        </div>
      </div>
      <aside className={`guided-note ${modo === 'correct' ? 'info' : 'warning'}`}>
        {modo === 'correct' ? <Lightbulb size={20} /> : <AlertTriangle size={20} />}
        <div>
          <strong>{modo === 'correct' ? 'Inicialização com valores[0]' : 'Por que zero é perigoso?'}</strong>
          <p>{modo === 'correct'
            ? 'Ao iniciar o maior com o primeiro elemento real do array, garantimos que a comparação sempre parte de um valor que realmente existe nos dados. Qualquer elemento posterior poderá superá-lo ou não — sem risco de falso positivo.'
            : 'Quando o array contém apenas negativos, nenhum elemento é maior que 0. O loop termina sem atualizar a variável e o programa retorna 0, um valor que nem sequer está no array. É um bug silencioso que só aparece com dados específicos.'}
          </p>
        </div>
      </aside>
    </div>
  );
}

// ── 3. Lab de Cast de Média ─────────────────────────
function CastMediaLab() {
  const [notas] = useState([8, 7, 10, 9]);
  const soma = notas.reduce((a, b) => a + b, 0);
  const mediaInteira = Math.trunc(soma / notas.length);
  const mediaDecimal = soma / notas.length;

  const codeInteiro = `int[] notas = {8, 7, 10, 9};\nint soma = 0;\nfor (int i = 0; i < notas.length; i++) {\n    soma += notas[i];\n}\n// Divisão INTEIRA — trunca decimal!\nint media = soma / notas.length;  // → ${mediaInteira}`;
  const codeDecimal = `int[] notas = {8, 7, 10, 9};\nint soma = 0;\nfor (int i = 0; i < notas.length; i++) {\n    soma += notas[i];\n}\n// Cast antes de dividir — preserva decimal!\ndouble media = (double) soma / notas.length;  // → ${mediaDecimal}`;

  return (
    <div className="as49-sim-box">
      <ArrayBlocks array={notas} />
      <div className="as49-dashboard" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="as49-var-card soma"><small>Soma</small><strong>{soma}</strong></div>
        <div className="as49-var-card" style={{ borderColor: '#dc2626', background: '#450a0a' }}><small>Média (int) ✗</small><strong style={{ color: '#f87171' }}>{mediaInteira}</strong></div>
        <div className="as49-var-card media"><small>Média (double) ✓</small><strong>{mediaDecimal}</strong></div>
      </div>
      <div className="as49-sim-grid">
        <CodePanel name="MediaInteira.java" code={codeInteiro} lines={false} />
        <CodePanel name="MediaDecimal.java" code={codeDecimal} lines={false} />
      </div>
      <aside className="guided-note warning">
        <AlertTriangle size={20} />
        <div>
          <strong>Regra do cast de média</strong>
          <p>Em Java, dividir dois inteiros resulta em um inteiro (divisão truncada). A média de {`{${notas.join(', ')}}`} é {mediaDecimal}, mas sem o cast <code>(double)</code> você obterá {mediaInteira}. Torne um operando double antes da divisão, não depois: <code>(double) soma / notas.length</code>.</p>
        </div>
      </aside>
    </div>
  );
}

// ── 4. Lab de Array Vazio ───────────────────────────
function ArrayVazioLab() {
  const [vazio, setVazio] = useState(true);
  const array = vazio ? [] : [15, 40, 7];

  const codeSemProtecao = `int[] valores = {};\n// ERRO: tentando acessar valores[0] diretamente!\nint maior = valores[0];  // ArrayIndexOutOfBoundsException`;
  const codeComProtecao = `int[] valores = {};\n\nif (valores.length == 0) {\n    System.out.println("Sem valores para analisar");\n} else {\n    int maior = valores[0]; // seguro aqui\n    // ... processa\n}`;

  return (
    <div className="as49-sim-box">
      <div className="as49-sim-controls">
        <label>Array:</label>
        <button type="button" className="as49-sim-action" style={{ background: vazio ? '#dc2626' : '#475569' }} onClick={() => setVazio(true)}>Vazio []</button>
        <button type="button" className="as49-sim-action" style={{ background: !vazio ? '#16a34a' : '#475569' }} onClick={() => setVazio(false)}>Com valores</button>
      </div>
      {array.length > 0 && <ArrayBlocks array={array} />}

      <div className="as49-sim-grid">
        <CodePanel name="SemProtecao.java" code={codeSemProtecao} lines={false} />
        <CodePanel name="ComProtecao.java" code={codeComProtecao} lines={false} />
      </div>
      <div className={`as49-console ${vazio ? 'error' : 'success'}`} style={{ marginTop: '12px' }}>
        <header><Terminal size={14} /> Console</header>
        <pre>{vazio
          ? 'Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException:\nIndex 0 out of bounds for length 0\n\nat SemProtecao.main(SemProtecao.java:3)'
          : 'Relatório\nMaior: 40\nMenor: 7'}
        </pre>
      </div>
    </div>
  );
}

// ── 5. Lab Maior/Menor com Posição ──────────────────
function ComPosicaoLab() {
  const [array] = useState([10, 50, 20, 50]);
  const [modo, setModo] = useState('strict');

  let maior = array[0], indiceMaior = 0, menor = array[0], indiceMenor = 0;
  for (let i = 1; i < array.length; i++) {
    const cond = modo === 'strict' ? array[i] > maior : array[i] >= maior;
    if (cond) { maior = array[i]; indiceMaior = i; }
    if (array[i] < menor) { menor = array[i]; indiceMenor = i; }
  }

  return (
    <div className="as49-sim-box">
      <ArrayBlocks array={array} maiorIndex={indiceMaior} menorIndex={indiceMenor} />
      <div className="as49-sim-controls">
        <label>Operador para maior:</label>
        <button type="button" className="as49-sim-action" style={{ background: modo === 'strict' ? '#4f46e5' : '#475569' }} onClick={() => setModo('strict')}>{'>'} (primeira ocorrência)</button>
        <button type="button" className="as49-sim-action" style={{ background: modo === 'gte' ? '#4f46e5' : '#475569' }} onClick={() => setModo('gte')}>{'≥'} (última ocorrência)</button>
      </div>
      <div className="as49-dashboard" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="as49-var-card maior"><small>maior / índice</small><strong>{maior} <span style={{ fontSize: '.8rem', color: '#6ee7b7' }}>→ [{indiceMaior}]</span></strong></div>
        <div className="as49-var-card menor"><small>menor / índice</small><strong>{menor} <span style={{ fontSize: '.8rem', color: '#fca5a5' }}>→ [{indiceMenor}]</span></strong></div>
      </div>
      <CodePanel name="MaiorMenorComPosicao.java" code={`int maior = valores[0];\nint indiceMaior = 0;\nint menor = valores[0];\nint indiceMenor = 0;\n\nfor (int i = 1; i < valores.length; i++) {\n    if (valores[i] ${modo === 'strict' ? '>' : '>='} maior) {  // ${modo === 'strict' ? '> primeira ocorrência' : '>= última ocorrência em empate'}\n        maior = valores[i];\n        indiceMaior = i;\n    }\n    if (valores[i] < menor) {\n        menor = valores[i];\n        indiceMenor = i;\n    }\n}\n\nSystem.out.println("Maior: " + maior + " na posição " + (indiceMaior + 1));`} lines={false} />
    </div>
  );
}

// ── 6. Lab de Dois Passes ───────────────────────────
function DoisPassesLab() {
  const [array] = useState([10, 20, 30, 40]);
  const soma = array.reduce((a, b) => a + b, 0);
  const media = soma / array.length;
  const acimaIndexes = array.map((v, i) => v > media ? i : -1).filter(i => i !== -1);

  return (
    <div className="as49-sim-box">
      <ArrayBlocks array={array} acimaIndexes={acimaIndexes} />
      <div className="as49-dashboard" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '12px' }}>
        <div className="as49-var-card soma"><small>Soma</small><strong>{soma}</strong></div>
        <div className="as49-var-card media"><small>Média</small><strong>{media.toFixed(1)}</strong></div>
        <div className="as49-var-card" style={{ borderColor: '#f59e0b', background: '#422006' }}><small>Acima da média</small><strong style={{ color: '#fbbf24' }}>{acimaIndexes.length}</strong></div>
      </div>
      <CodePanel name="ValoresAcimaDaMedia.java" code={`// 1º passe: calcular a média\nint soma = 0;\nfor (int i = 0; i < valores.length; i++) {\n    soma += valores[i];\n}\ndouble media = (double) soma / valores.length;  // ${media}\n\n// 2º passe: contar acima da média\nint acimaDaMedia = 0;\nfor (int i = 0; i < valores.length; i++) {\n    if (valores[i] > media) {\n        acimaDaMedia++;\n    }\n}\n// acimaDaMedia = ${acimaIndexes.length}`} lines={false} />
      <aside className="guided-note info">
        <Lightbulb size={20} />
        <div>
          <strong>Por que dois passes?</strong>
          <p>Para saber quais valores estão acima da média, você precisa conhecer a média primeiro. Como a média só é calculada depois do loop completo, você precisa de uma segunda varredura. Nem todo algoritmo pode ser resolvido em um único loop.</p>
        </div>
      </aside>
    </div>
  );
}

// ── 7. Galeria de Domínios ──────────────────────────
const DOMAIN_PROGRAMS = [
  {
    id: 'estoque', label: 'Estoque', file: 'RelatorioEstoqueProdutos.java',
    code: `int[] estoques = {10, 0, 5, 2, 20};\nint total = 0;\nint maior = estoques[0];\nint menor = estoques[0];\n\nfor (int i = 0; i < estoques.length; i++) {\n    total += estoques[i];\n    if (estoques[i] > maior) maior = estoques[i];\n    if (estoques[i] < menor) menor = estoques[i];\n}\ndouble media = (double) total / estoques.length;`,
    output: `Relatório de estoque\nProdutos analisados: 5\nTotal em estoque: 37\nMédia de estoque: 7.4\nMaior estoque: 20\nMenor estoque: 0`,
    insight: 'Menor estoque 0 indica produto sem estoque — útil para alertas.'
  },
  {
    id: 'pedidos', label: 'Pedidos (long)', file: 'RelatorioPedidos.java',
    code: `long[] pedidos = {1000L, 2500L, 5000L, 3000L};\nlong total = 0L;\nlong maior = pedidos[0];\nlong menor = pedidos[0];\n\nfor (int i = 0; i < pedidos.length; i++) {\n    total += pedidos[i];\n    if (pedidos[i] > maior) maior = pedidos[i];\n    if (pedidos[i] < menor) menor = pedidos[i];\n}\ndouble media = (double) total / pedidos.length;`,
    output: `Relatório de pedidos\nQuantidade: 4\nTotal em centavos: 11500\nMédia em centavos: 2875.0\nMaior pedido: 5000\nMenor pedido: 1000`,
    insight: 'Use long para valores financeiros em centavos até estudar BigDecimal.'
  },
  {
    id: 'os', label: 'OS (atividades)', file: 'RelatorioAtividadesOs.java',
    code: `int[] atividades = {2, 4, 1, 3, 6};\nint total = 0;\nint maior = atividades[0];\nint menor = atividades[0];\n\nfor (int i = 0; i < atividades.length; i++) {\n    total += atividades[i];\n    if (atividades[i] > maior) maior = atividades[i];\n    if (atividades[i] < menor) menor = atividades[i];\n}\ndouble media = (double) total / atividades.length;`,
    output: `Relatório de atividades por OS\nOS analisadas: 5\nTotal de atividades: 16\nMédia por OS: 3.2\nMaior quantidade: 6\nMenor quantidade: 1`,
    insight: 'A OS com menor quantidade pode indicar gargalo ou problema de alocação.'
  },
  {
    id: 'mensageria', label: 'Mensageria', file: 'RelatorioMensageria.java',
    code: `int[] tentativas = {1, 3, 2, 1, 4};\nint total = 0;\nint maior = tentativas[0];\nint menor = tentativas[0];\n\nfor (int i = 0; i < tentativas.length; i++) {\n    total += tentativas[i];\n    if (tentativas[i] > maior) maior = tentativas[i];\n    if (tentativas[i] < menor) menor = tentativas[i];\n}\ndouble media = (double) total / tentativas.length;`,
    output: `Relatório de mensageria\nMensagens: 5\nTotal tentativas: 11\nMédia de tentativas: 2.2\nMaior: 4\nMenor: 1`,
    insight: 'Maior número de tentativas indica instabilidade no canal de comunicação.'
  },
  {
    id: 'auditoria', label: 'Auditoria', file: 'RelatorioAuditoria.java',
    code: `int[] eventos = {5, 8, 3, 10, 4};\nint total = 0;\nint maior = eventos[0];\nint menor = eventos[0];\n\nfor (int i = 0; i < eventos.length; i++) {\n    total += eventos[i];\n    if (eventos[i] > maior) maior = eventos[i];\n    if (eventos[i] < menor) menor = eventos[i];\n}\ndouble media = (double) total / eventos.length;`,
    output: `Relatório de auditoria\nDias analisados: 5\nTotal de eventos: 30\nMédia diária: 6.0\nMaior volume: 10\nMenor volume: 3`,
    insight: 'Volume máximo diário de eventos pode indicar pico de risco para auditoria.'
  },
  {
    id: 'sla', label: 'SLA (horas)', file: 'RelatorioSla.java',
    code: `double[] tempos = {2.0, 3.5, 6.0, 1.5};\ndouble total = 0.0;\ndouble maior = tempos[0];\ndouble menor = tempos[0];\n\nfor (int i = 0; i < tempos.length; i++) {\n    total += tempos[i];\n    if (tempos[i] > maior) maior = tempos[i];\n    if (tempos[i] < menor) menor = tempos[i];\n}\ndouble media = total / tempos.length;`,
    output: `Relatório de SLA\nAtendimentos: 4\nTotal de horas: 13.0\nMédia de horas: 3.25\nMaior tempo: 6.0\nMenor tempo: 1.5`,
    insight: 'Use double[] para tempos e notas — mas nunca para dinheiro (use long centavos).'
  }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return (
    <section className="as49-domains-gallery">
      <div className="as49-domains-sidebar">
        {DOMAIN_PROGRAMS.map((entry, index) => (
          <button key={entry.id} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
            {entry.label}
          </button>
        ))}
      </div>
      <div className="as49-domains-content">
        <CodePanel name={item.file} code={item.code} lines={false} />
        <div className="as49-console">
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
    title: 'Inicializar maior com zero (negativos)',
    code: `int[] valores = {-10, -5, -30};\nint maior = 0;  // Errado!\nfor (int i = 0; i < valores.length; i++) {\n    if (valores[i] > maior) maior = valores[i];\n}\n// maior = 0, mas 0 não está no array!`,
    symptom: 'Maior valor: 0 (incorreto — o real é -5)',
    cause: 'Zero não pertence ao array. Com todos os negativos, nenhum passa no teste `> 0`, então maior nunca muda.',
    fix: 'Inicialize com `int maior = valores[0];` para garantir que você começa com um valor real do array.'
  },
  {
    title: 'Inicializar menor com zero (positivos)',
    code: `int[] valores = {10, 20, 30};\nint menor = 0;  // Errado!\nfor (int i = 0; i < valores.length; i++) {\n    if (valores[i] < menor) menor = valores[i];\n}\n// menor = 0, mas 0 não está no array!`,
    symptom: 'Menor valor: 0 (incorreto — o real é 10)',
    cause: 'Todos os valores positivos são maiores que zero, então nenhum passa no teste `< 0`.',
    fix: 'Use `int menor = valores[0];` — inicialização com o primeiro elemento real é o padrão correto.'
  },
  {
    title: 'Acessar valores[0] em array vazio',
    code: `int[] valores = {}; // array vazio!\nint maior = valores[0]; // CRASH!`,
    symptom: 'ArrayIndexOutOfBoundsException: Index 0 out of bounds for length 0',
    cause: 'O array não possui nenhum elemento. Acessar o índice 0 de um array vazio lança exceção em tempo de execução.',
    fix: 'Verifique `if (valores.length == 0)` antes de acessar qualquer posição.'
  },
  {
    title: 'Usar <= valores.length no for',
    code: `for (int i = 0; i <= valores.length; i++) {\n    soma += valores[i]; // quando i == length, CRASH!\n}`,
    symptom: 'ArrayIndexOutOfBoundsException: Index N out of bounds for length N',
    cause: 'O índice máximo válido é `length - 1`. O operador `<=` faz o loop entrar em `i == length`, que não existe.',
    fix: 'Use sempre `i < valores.length` (menor estrito) no for de percurso de arrays.'
  },
  {
    title: 'Calcular média dentro do loop',
    code: `for (int i = 0; i < valores.length; i++) {\n    soma += valores[i];\n    media = soma / valores.length; // recalcula a cada volta!\n}`,
    symptom: 'A média é calculada a cada iteração desnecessariamente.',
    cause: 'A média precisa da soma completa, que só existe após o loop. Calcular dentro é ineficiente e pode dar resultado incorreto com int.',
    fix: 'Calcule `double media = (double) soma / valores.length;` após o loop fechar.'
  },
  {
    title: 'Esquecer o cast para double',
    code: `int[] notas = {8, 7, 10, 9};\nint soma = 34;\ndouble media = soma / notas.length; // divisão inteira!`,
    symptom: 'Média: 8.0 (esperado: 8.5)',
    cause: 'Quando os dois operandos são int, Java faz divisão inteira e trunca a parte decimal antes de converter para double.',
    fix: 'Use `(double) soma / notas.length` — o cast eleva o primeiro operando, forçando divisão decimal.'
  },
  {
    title: 'Somar o índice em vez do valor',
    code: `for (int i = 0; i < valores.length; i++) {\n    soma += i;  // Errado! Soma os índices 0,1,2...\n}`,
    symptom: 'Soma errada (ex: 0+1+2+3 = 6 em vez de 10+20+30+40 = 100)',
    cause: '`i` é o índice (posição), não o valor armazenado. Você está somando o número da posição, não o conteúdo do array.',
    fix: 'Use `soma += valores[i];` — sempre acesse `valores[i]` para obter o valor do elemento naquela posição.'
  },
  {
    title: 'Comparar o índice em vez do valor',
    code: `if (i > maior) {  // Compara posição, não valor!\n    maior = i;\n}`,
    symptom: 'Maior "valor" seria o último índice (N-1), sem relação com os dados.',
    cause: '`i` é a posição no loop. Para comparar o conteúdo, você precisa de `valores[i]`.',
    fix: 'Use `if (valores[i] > maior)` e `maior = valores[i];` para comparar e guardar o valor correto.'
  },
  {
    title: 'Não atualizar o índice do maior/menor',
    code: `if (valores[i] > maior) {\n    maior = valores[i];\n    // Esqueceu de: indiceMaior = i;\n}`,
    symptom: 'O índice reportado é o inicial (0), mesmo que o maior esteja em outra posição.',
    cause: 'A variável `indiceMaior` não foi atualizada junto com o valor, permanecendo com a inicialização antiga.',
    fix: 'Sempre atualize as duas variáveis juntas: `maior = valores[i]; indiceMaior = i;`.'
  },
  {
    title: 'Relatório sem rótulos (números soltos)',
    code: `System.out.println(soma);\nSystem.out.println(media);\nSystem.out.println(maior);\nSystem.out.println(menor);`,
    symptom: '184\n36.8\n99\n7',
    cause: 'Números sem contexto são impossíveis de interpretar por quem não conhece o código.',
    fix: 'Use `System.out.println("Soma: " + soma);` etc. O relatório deve identificar cada valor com um rótulo descritivo.'
  }
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="as49-errors-clinic">
      <nav className="as49-errors-nav">
        {ERRORS.map((entry, index) => (
          <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
            <span>{index + 1}</span>
            <span className="guided-error-label">{entry.title}</span>
          </button>
        ))}
      </nav>
      <div className="as49-error-card">
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
        <div className="as49-error-flow">
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

// ── 9. Entrega & Desafio ────────────────────────────
function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Criar Diretório',
      cmd: `New-Item -ItemType Directory -Force labs\\m1\\aula-049-maior-menor-soma-media-array\ncd labs\\m1\\aula-049-maior-menor-soma-media-array\nNew-Item Main.java, SomaValores.java, MediaValores.java, MaiorValor.java, MenorValor.java, RelatorioArray.java, RelatorioComArrayVazio.java, RelatorioComNegativos.java, RelatorioPagamentosCentavos.java, RelatorioNotasDouble.java, RelatorioEstoqueProdutos.java, RelatorioPedidos.java, RelatorioPagamentos.java, RelatorioAtividadesOs.java, RelatorioMensageria.java, RelatorioAuditoria.java, RelatorioSla.java, RelatorioValoresUsuario.java, RelatorioPagamentosUsuario.java, ValoresAcimaDaMedia.java, ValoresAcimaDoLimite.java, MaiorMenorComPosicao.java, EmpateMaiorValor.java, ErroMaiorInicialZero.java, ErroMenorInicialZero.java, ErroMediaInteira.java, ErroSomarIndice.java, ErroArrayVazio.java`,
      out: 'Criado com sucesso — 28 arquivos de laboratório para a Aula 049.',
      tip: 'Preencha cada arquivo com o código correspondente da aula antes de compilar.'
    },
    {
      title: 'Compilar & Testar Erros',
      cmd: 'javac *.java\njava ErroMaiorInicialZero\njava ErroMenorInicialZero\njava ErroMediaInteira',
      out: 'Maior calculado errado: 0\nMenor calculado errado: 0\nMédia inteira: 8 (errado — real é 8.5)',
      tip: 'Observe os resultados errados propositais. Depois corrija os arquivos e veja o comportamento mudar.'
    },
    {
      title: 'Executar Relatórios',
      cmd: 'java RelatorioArray\njava RelatorioComNegativos\njava RelatorioPagamentosCentavos\njava ValoresAcimaDaMedia',
      out: `RelatorioArray:\nSoma: 184 | Média: 36.8 | Maior: 99 | Menor: 7\n\nRelatorioComNegativos:\nSoma: -45 | Média: -15.0 | Maior: -5 | Menor: -30\n\nValoresAcimaDaMedia:\nMédia: 25.0 | Acima da média: 2`,
      tip: 'Confirme que RelatorioComNegativos retorna Maior: -5 — se retornar 0, você tem o bug de inicialização.'
    },
    {
      title: 'Commit Git',
      cmd: 'git status\ngit add labs/m1/aula-049-maior-menor-soma-media-array docs/diario-de-bordo.md\ngit commit -m "Aula 049: pratica maior menor soma e media em array"\ngit status',
      out: 'working tree clean',
      tip: 'Confirme que nenhum arquivo .class está listado pelo git status. Se aparecer, ajuste o .gitignore.'
    }
  ];

  const current = steps[stage];
  const scannerExample = `import java.util.Scanner;

public class RelatorioValoresUsuario {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("Quantidade de valores: ");
            int quantidade = scanner.nextInt();

            if (quantidade <= 0) {
                System.out.println("Sem valores para analisar.");
                return;
            }

            int[] valores = new int[quantidade];
            for (int i = 0; i < valores.length; i++) {
                System.out.print("Valor " + (i + 1) + ": ");
                valores[i] = scanner.nextInt();
            }

            int soma = 0;
            int maior = valores[0];
            int menor = valores[0];

            for (int valor : valores) {
                soma += valor;
                if (valor > maior) maior = valor;
                if (valor < menor) menor = valor;
            }

            double media = (double) soma / valores.length;
            System.out.println("Soma: " + soma);
            System.out.println("Média: " + media);
            System.out.println("Maior: " + maior);
            System.out.println("Menor: " + menor);
        }
    }
}`;
  return (
    <section>
      <div className="as49-delivery-nav">
        {steps.map((s, i) => (
          <button key={s.title} type="button" className={stage === i ? 'active' : ''} onClick={() => setStage(i)}>
            <span>{i < stage ? <Check size={11} /> : i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="as49-terminal">
        <header><Terminal size={14} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={14} /> {current.tip}</p>
      </div>
      <div className="as49-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button>
      </div>

      <aside className="guided-note info" style={{ marginTop: '18px' }}>
        <Lightbulb size={20} />
        <div><strong>Exemplo guiado antes do desafio</strong><p>Digite, compile e execute este programa primeiro. Ele mostra o portão para quantidade inválida, o preenchimento pelo usuário e o relatório completo com saída rotulada.</p></div>
      </aside>
      <CodePanel name="RelatorioValoresUsuario.java" code={scannerExample} />

      <section className="guided-challenge" style={{ marginTop: '20px' }}>
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: RelatorioNotasAlunos.java</h3></div>
        <p>Crie o arquivo <code>RelatorioNotasAlunos.java</code> em <code>labs/m1/aula-049-maior-menor-soma-media-array/</code>. Declare um array <code>double[]</code> com 6 notas de alunos (ex: {'{'}7.5, 8.0, 5.5, 9.0, 6.0, 10.0{'}'}). Calcule e exiba: soma, média, maior nota, menor nota e quantos alunos ficaram acima da média. Inclua proteção para array vazio.</p>
        <h4>Critérios de aceite</h4>
        <ul>
          <li>Inicializar <code>maior</code> e <code>menor</code> com <code>notas[0]</code>, nunca com zero.</li>
          <li>Calcular a média com <code>soma / notas.length</code> (divisão já em double, sem cast necessário).</li>
          <li>Usar dois passes: primeiro para soma/maior/menor, segundo para contar acima da média.</li>
          <li>Proteger o código com <code>if (notas.length == 0)</code> antes de acessar <code>notas[0]</code>.</li>
          <li>Exibir relatório com rótulos descritivos para cada campo calculado.</li>
        </ul>
      </section>

      <div className="guided-file as49-code" style={{ marginTop: '16px' }}>
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
  if (block.type === 'master_sim') return <MasterSimulator />;
  if (block.type === 'init_lab') return <InicializacaoLab />;
  if (block.type === 'cast_lab') return <CastMediaLab />;
  if (block.type === 'empty_lab') return <ArrayVazioLab />;
  if (block.type === 'position_lab') return <ComPosicaoLab />;
  if (block.type === 'two_pass_lab') return <DoisPassesLab />;
  if (block.type === 'domains') return <DomainsGallery />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return (
      <aside className={`guided-note ${block.tone || 'info'}`}>
        <Icon size={21} />
        <div><strong>{block.title}</strong><p>{block.text}</p></div>
      </aside>
    );
  }
  return null;
}

// ── Roteiro de Etapas ────────────────────────────────
const steps = [
  {
    id: 'relatorio_mestre',
    eyebrow: 'Simulador Mestre',
    label: 'Relatório Interativo',
    title: 'Visualizando soma, média, maior e menor passo a passo',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Edite o array, execute e avance passo a passo para acompanhar o acumulador e os comparadores em cada iteração:' },
      { type: 'master_sim' }
    ]
  },
  {
    id: 'inicializacao',
    eyebrow: 'Inicialização Correta',
    label: 'Risco do Zero Inicial',
    title: 'Por que maior e menor devem começar com valores[0]',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Compare a inicialização correta com `valores[0]` versus o bug silencioso de inicializar com zero em arrays de negativos:' },
      { type: 'init_lab' }
    ]
  },
  {
    id: 'cast_media',
    eyebrow: 'Cast de Média',
    label: 'Divisão Inteira vs Decimal',
    title: 'Por que o (double) antes da divisão é obrigatório para médias exatas',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Veja o impacto de omitir o cast e como ele transforma uma média decimal em um inteiro truncado:' },
      { type: 'cast_lab' }
    ]
  },
  {
    id: 'array_vazio',
    eyebrow: 'Portão de Segurança',
    label: 'Array Vazio',
    title: 'Prevenindo ArrayIndexOutOfBoundsException ao acessar valores[0]',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Observe o crash causado por array vazio e o padrão de proteção com verificação de length antes de calcular:' },
      { type: 'empty_lab' }
    ]
  },
  {
    id: 'posicao',
    eyebrow: 'Rastreamento de Posição',
    label: 'Maior e Menor com Índice',
    title: 'Guardando a posição do maior e do menor — e o comportamento em empate',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Alterne entre `>` e `>=` para ver como o empate afeta a posição guardada:' },
      { type: 'position_lab' }
    ]
  },
  {
    id: 'dois_passes',
    eyebrow: 'Dois Passes no Array',
    label: 'Acima da Média',
    title: 'Contando valores acima da média requer dois loops distintos',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Veja por que a contagem acima da média exige duas varreduras sequenciais no array:' },
      { type: 'two_pass_lab' }
    ]
  },
  {
    id: 'dominios',
    eyebrow: 'Prática Corporativa',
    label: 'Galeria de Domínios',
    title: 'Aplicando soma, média, maior e menor em 6 cenários reais de backend',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Explore os relatórios de estoque, pedidos, OS, mensageria, auditoria e SLA:' },
      { type: 'domains' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Diagnosticando as 10 falhas comuns em soma, média, maior e menor',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Examine cada erro, identifique o sintoma e aplique a correção:' },
      { type: 'errors' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega Final',
    label: 'Entrega & Desafio',
    title: 'Criando e testando os 28 arquivos de laboratório local',
    duration: '10 min',
    blocks: [
      { type: 'lead', text: 'Crie a pasta com os 28 arquivos, observe os erros propositais e resolva o desafio `RelatorioNotasAlunos.java`:' },
      { type: 'delivery' }
    ]
  }
];

// ── Componente Principal ─────────────────────────────
export default function GuidedArrayStatsLesson049({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepNavRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved.filter(id => steps.some(step => step.id === id)) : []);
    } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds]));
  }, [completedStepIds]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const completedLabel = `${completedStepIds.size} de ${steps.length} etapas concluídas`;

  useEffect(() => {
    if (completionNormalizedRef.current) return;
    completionNormalizedRef.current = true;
    if (isCompleted && !allStepsComplete) onToggleCompleted();
  }, [allStepsComplete, isCompleted, onToggleCompleted]);

  useEffect(() => {
    stepNavRef.current?.querySelector('button.active')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);

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
    <article className="guided-git-lesson guided-array-stats-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><BarChart2 size={17} /> Estatísticas em Arrays</span>
          <p className="guided-sequence">049 · M1.29</p>
          <h1>Maior, Menor, Soma e Média em Array</h1>
          <p>Domine as quatro operações essenciais de sumarização numérica em arrays Java: acumulador de soma, média com cast decimal, busca de maior e menor com inicialização correta e geração de relatório final profissional.</p>
        </div>
        <div className="guided-hero-status">
          <BarChart2 size={42} />
          <strong>{progress}%</strong>
          <span>{completedLabel}</span>
        </div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[
        { value: 'valores[0]', label: 'init do maior/menor' },
        { value: '(double)', label: 'cast de média' },
        { value: '2 passes', label: 'acima da média' }
      ]} />

      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 049">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
          {steps.map((step, index) => (
            <button
              type="button"
              key={step.id}
              className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')}
              onClick={() => selectStep(index)}
            >
              <span className="guided-step-number">
                {completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <strong>{step.label}</strong>
                <small>{step.duration}</small>
              </span>
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
                <h3>Estatísticas de arrays dominadas!</h3>
                <p>{lessonComplete ? 'Soma, média, maior e menor com inicialização correta consolidados.' : 'Conclua a aula para registrar seus conhecimentos.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 048</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Sumarização numérica de arrays consolidada' : allStepsComplete ? 'Use o botão acima' : 'Pratique soma, média, maior, menor e relatório'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir Arrays de String'}>
          Aula 050 <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
