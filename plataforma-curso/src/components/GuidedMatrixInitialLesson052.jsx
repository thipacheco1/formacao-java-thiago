import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck,
  Check, CheckCircle2, ChevronRight, Clock3, Copy, FileCode2,
  Lightbulb, ListChecks, RotateCcw, Sparkles, Terminal, Table, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedMatrixInitialLesson.css';

const STORAGE_KEY = 'guided-matrix-initial-lesson-052-progress';

const EVIDENCE = [
  '# Aula 052 — Matriz Bidimensional Inicial', '',
  '## Fundamentos', '- [ ] Declarei e inicializei matrizes como `int[][] matriz = {{10, 20, 30}, {40, 50, 60}};`', '- [ ] Entendi que matriz em Java é um array de arrays', '- [ ] Compreendi a relação de coordenadas: `matriz[linha][coluna]`', '',
  '## Propriedades e Percurso', '- [ ] Usei `matriz.length` para obter a quantidade de linhas', '- [ ] Usei `matriz[linha].length` para obter a quantidade de colunas daquela linha', '- [ ] Percorri a matriz utilizando laços aninhados (for externo para linhas, for interno para colunas)', '- [ ] Formatei a saída em console simulando uma tabela visual', '',
  '## Operações de Estatística', '- [ ] Calculei a soma e a média dos elementos convertendo a divisão para double', '- [ ] Encontrei o maior e o menor valor iniciando a busca em `matriz[0][0]`', '- [ ] Calculei a soma total por linha e por coluna em matrizes retangulares', '',
  '## Busca e Escrita', '- [ ] Realizei a busca linear de um valor retornando suas coordenadas com duplo break de escape', '- [ ] Executei a alteração de valor de uma célula através do acesso direto', '- [ ] Protegi a leitura validando se a linha é válida antes de ler o length das colunas', '',
  '## Evidências Locais', '- [ ] Criei, compilei e executei os 25 arquivos Java no ambiente local', '- [ ] Identifiquei o bug de limite de loop em `ErroLengthColuna.java` e corrigi', '- [ ] Simulei o crash de linha inválida em `ErroValidarColunaAntesLinha.java` e corrigi', '- [ ] Mantive o repositório organizado e limpo de artefatos temporários',
  '',
  '## Decisão de Projeto', '- Por que matriz.length retorna a quantidade de linhas e não o total de elementos?', '- Por que a verificação da linha deve anteceder a verificação da coluna?'
].join('\n');

// ── Utilidades ──────────────────────────────────────
function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  };
  return <button type="button" className="m52-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file m52-code">
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

function VisualMatrix({ matrix, activeLinha = -1, activeColuna = -1, foundLinha = -1, foundColuna = -1, activeRowHighlight = -1 }) {
  return (
    <div className="m52-matrix-grid">
      <div className="m52-cols-header">
        {matrix[0] && matrix[0].map((_, c) => (
          <div key={c} className="m52-col-label">col {c}</div>
        ))}
      </div>
      {matrix.map((row, l) => (
        <div key={l} className="m52-row">
          <div className="m52-row-label">lin {l}</div>
          {row.map((val, c) => {
            let cls = 'm52-cell';
            if (l === activeLinha && c === activeColuna) cls += ' active';
            else if (l === foundLinha && c === foundColuna) cls += ' found';
            else if (l === activeRowHighlight) cls += ' active-row';
            return (
              <div key={c} className={cls}>
                <span className="m52-cell-coords">[{l}][{c}]</span>
                <span className="m52-cell-val">{val}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── 1. Simulador de Grid Matriz ──────────────────────
function GridMatrizSimulator() {
  const [matrix] = useState([
    [10, 20, 30],
    [40, 50, 60]
  ]);
  const [step, setStep] = useState(-1);
  const [log, setLog] = useState('Pressione "Percorrer" para iniciar a iteração.');

  const advance = () => {
    const next = step + 1;
    if (next < 6) {
      setStep(next);
      const l = Math.floor(next / 3);
      const c = next % 3;
      setLog(`Linha = ${l}, Coluna = ${c}\nValor lido: matriz[${l}][${c}] = ${matrix[l][c]}`);
    } else {
      setStep(-1);
      setLog('Percurso concluído.');
    }
  };

  const reset = () => {
    setStep(-1);
    setLog('Pressione "Percorrer" para iniciar a iteração.');
  };

  const activeLinha = step >= 0 ? Math.floor(step / 3) : -1;
  const activeColuna = step >= 0 ? step % 3 : -1;

  const code = `int[][] matriz = {\n    {10, 20, 30},\n    {40, 50, 60}\n};\n\nfor (int linha = 0; linha < matriz.length; linha++) {\n    for (int coluna = 0; coluna < matriz[linha].length; coluna++) {\n        System.out.print(matriz[linha][coluna] + " ");\n    }\n    System.out.println();\n}`;

  return (
    <div className="m52-sim-box">
      <VisualMatrix matrix={matrix} activeLinha={activeLinha} activeColuna={activeColuna} />
      <div className="m52-sim-controls">
        <button type="button" className="m52-sim-action" onClick={advance}>
          {step === -1 ? '▶ Percorrer' : 'Próximo passo →'}
        </button>
        <button type="button" className="m52-sim-action" style={{ background: '#334155' }} onClick={reset}>↺ Reiniciar</button>
      </div>
      <div className="m52-sim-grid">
        <CodePanel name="ExibirMatriz.java" code={code} lines={false} />
        <div className="m52-console success">
          <header><Terminal size={14} /> Console</header>
          <pre>{`10 20 30\n40 50 60\n\n[Depuração Atual]:\n${log}`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 2. Painel de Propriedades da Matriz ─────────────
function PropriedadesLab() {
  const [tipo, setTipo] = useState('retangular');

  const retangular = [
    [10, 20, 30],
    [40, 50, 60]
  ];

  const irregular = [
    [10, 20],
    [30, 40, 50]
  ];

  const current = tipo === 'retangular' ? retangular : irregular;

  const codeRetangular = `int[][] matriz = {\n    {10, 20, 30},\n    {40, 50, 60}\n};\n// matriz.length = 2 (linhas)\n// matriz[0].length = 3 (colunas da linha 0)\n// matriz[1].length = 3 (colunas da linha 1)`;
  const codeIrregular = `int[][] matriz = {\n    {10, 20},\n    {30, 40, 50}\n};\n// matriz.length = 2 (linhas)\n// matriz[0].length = 2 (colunas da linha 0)\n// matriz[1].length = 3 (colunas da linha 1)`;

  return (
    <div className="m52-sim-box">
      <VisualMatrix matrix={current} />
      <div className="m52-sim-controls">
        <label>Formato da Matriz:</label>
        <button type="button" className="m52-sim-action" style={{ background: tipo === 'retangular' ? '#4f46e5' : '#334155' }} onClick={() => setTipo('retangular')}>Matriz Retangular</button>
        <button type="button" className="m52-sim-action" style={{ background: tipo === 'irregular' ? '#4f46e5' : '#334155' }} onClick={() => setTipo('irregular')}>Matriz Irregular (Conceito)</button>
      </div>

      <div className="m52-dashboard" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="m52-var-card"><small>matriz.length (linhas)</small><strong>{current.length}</strong></div>
        <div className="m52-var-card"><small>matriz[0].length</small><strong>{current[0].length}</strong></div>
        <div className="m52-var-card"><small>matriz[1].length</small><strong>{current[1].length}</strong></div>
      </div>

      <CodePanel name={tipo === 'retangular' ? 'MatrizRetangular.java' : 'MatrizIrregular.java'} code={tipo === 'retangular' ? codeRetangular : codeIrregular} lines={false} />
    </div>
  );
}

// ── 3. Lab de Operações Básicas ─────────────────────
function OperacoesLab() {
  const [modo, setModo] = useState('soma');
  const matrix = [
    [10, 20, 30],
    [40, 5, 60]
  ];

  let total = 0;
  let count = 0;
  let maior = matrix[0][0];
  let menor = matrix[0][0];

  for (let l = 0; l < matrix.length; l++) {
    for (let c = 0; c < matrix[l].length; c++) {
      total += matrix[l][c];
      count++;
      if (matrix[l][c] > maior) maior = matrix[l][c];
      if (matrix[l][c] < menor) menor = matrix[l][c];
    }
  }

  const media = total / count;

  const codeSoma = `int soma = 0;\nfor (int l = 0; l < matriz.length; l++) {\n    for (int c = 0; c < matriz[l].length; c++) {\n        soma += matriz[l][c];\n    }\n}`;
  const codeMaiorMenor = `int maior = matriz[0][0];\nint menor = matriz[0][0];\nfor (int l = 0; l < matriz.length; l++) {\n    for (int c = 0; c < matriz[l].length; c++) {\n        if (matriz[l][c] > maior) maior = matriz[l][c];\n        if (matriz[l][c] < menor) menor = matriz[l][c];\n    }\n}`;
  const codeLinhas = `for (int l = 0; l < matriz.length; l++) {\n    int somaLinha = 0;\n    for (int c = 0; c < matriz[l].length; c++) {\n        somaLinha += matriz[l][c];\n    }\n    System.out.println("Linha " + (l+1) + ": " + somaLinha);\n}`;
  const codeColunas = `int qtdCols = matriz[0].length;\nfor (int c = 0; c < qtdCols; c++) {\n    int somaCol = 0;\n    for (int l = 0; l < matriz.length; l++) {\n        somaCol += matriz[l][c];\n    }\n    System.out.println("Coluna " + (c+1) + ": " + somaCol);\n}`;

  return (
    <div className="m52-sim-box">
      <VisualMatrix matrix={matrix} />
      <div className="m52-sim-controls">
        <button type="button" className="m52-sim-action" style={{ background: modo === 'soma' ? '#4f46e5' : '#334155' }} onClick={() => setModo('soma')}>Soma & Média</button>
        <button type="button" className="m52-sim-action" style={{ background: modo === 'maiormenor' ? '#4f46e5' : '#334155' }} onClick={() => setModo('maiormenor')}>Maior & Menor</button>
        <button type="button" className="m52-sim-action" style={{ background: modo === 'linhas' ? '#4f46e5' : '#334155' }} onClick={() => setModo('linhas')}>Soma por Linha</button>
        <button type="button" className="m52-sim-action" style={{ background: modo === 'colunas' ? '#4f46e5' : '#334155' }} onClick={() => setModo('colunas')}>Soma por Coluna</button>
      </div>

      {modo === 'soma' && (
        <div className="m52-sim-grid">
          <CodePanel name="SomarMatriz.java" code={codeSoma} lines={false} />
          <div className="m52-console success">
            <header><Terminal size={14} /> Resultado</header>
            <pre>{`Total Acumulado: ${total}\nQuantidade de Células: ${count}\nMédia Calculada: ${media.toFixed(1)}`}</pre>
          </div>
        </div>
      )}

      {modo === 'maiormenor' && (
        <div className="m52-sim-grid">
          <CodePanel name="MaiorMenorMatriz.java" code={codeMaiorMenor} lines={false} />
          <div className="m52-console success">
            <header><Terminal size={14} /> Limites</header>
            <pre>{`Maior Elemento: ${maior} (iniciado em matriz[0][0])\nMenor Elemento: ${menor} (iniciado em matriz[0][0])`}</pre>
          </div>
        </div>
      )}

      {modo === 'linhas' && (
        <div className="m52-sim-grid">
          <CodePanel name="SomaLinhas.java" code={codeLinhas} lines={false} />
          <div className="m52-console success">
            <header><Terminal size={14} /> Relatório Linha a Linha</header>
            <pre>{`Soma Linha 1 [10+20+30]: 60\nSoma Linha 2 [40+5+60]: 105`}</pre>
          </div>
        </div>
      )}

      {modo === 'colunas' && (
        <div className="m52-sim-grid">
          <CodePanel name="SomarColunas.java" code={codeColunas} lines={false} />
          <div className="m52-console success">
            <header><Terminal size={14} /> Relatório por Coluna</header>
            <pre>{`Soma Coluna 1 [10+40]: 50\nSoma Coluna 2 [20+5]: 25\nSoma Coluna 3 [30+60]: 90`}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 4. Lab de Busca e Escrita ───────────────────────
function BuscaEscritaLab() {
  const [matrix, setMatrix] = useState([
    [10, 20, 30],
    [40, 50, 60]
  ]);
  const [searchVal, setSearchVal] = useState('50');
  const [writeLinha, setWriteLinha] = useState('1');
  const [writeColuna, setWriteColuna] = useState('2');
  const [writeVal, setWriteVal] = useState('99');

  const sVal = parseInt(searchVal, 10);
  let foundLinha = -1;
  let foundColuna = -1;
  if (!isNaN(sVal)) {
    for (let l = 0; l < matrix.length; l++) {
      for (let c = 0; c < matrix[l].length; c++) {
        if (matrix[l][c] === sVal) {
          foundLinha = l;
          foundColuna = c;
          break;
        }
      }
      if (foundLinha !== -1) break;
    }
  }

  const handleWrite = () => {
    const l = parseInt(writeLinha, 10);
    const c = parseInt(writeColuna, 10);
    const v = parseInt(writeVal, 10);
    if (!isNaN(l) && !isNaN(c) && !isNaN(v) && l >= 0 && l < matrix.length && c >= 0 && c < matrix[l].length) {
      const copy = matrix.map(row => [...row]);
      copy[l][c] = v;
      setMatrix(copy);
    }
  };

  const codeBusca = `int valorProcurado = ${searchVal};\nint lin = -1, col = -1;\n\nfor (int l = 0; l < matriz.length; l++) {\n    for (int c = 0; c < matriz[l].length; c++) {\n        if (matriz[l][c] == valorProcurado) {\n            lin = l; col = c;\n            break;\n        }\n    }\n    if (lin != -1) break; // escape do loop externo\n}`;

  return (
    <div className="m52-sim-box">
      <VisualMatrix matrix={matrix} foundLinha={foundLinha} foundColuna={foundColuna} />
      <div className="m52-sim-controls">
        <label>Buscar Valor:</label>
        <input
          style={{ width: '80px', padding: '6px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
        />
        {foundLinha !== -1 && (
          <span style={{ fontSize: '.8rem', color: '#34d399', fontWeight: 'bold' }}>Encontrado em [{foundLinha}][{foundColuna}]</span>
        )}
      </div>

      <div className="m52-sim-controls" style={{ borderTop: '1px solid #1e293b', paddingTop: '14px', marginTop: '10px' }}>
        <label>Alterar Célula - Linha:</label>
        <input
          style={{ width: '45px', padding: '6px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={writeLinha}
          onChange={e => setWriteLinha(e.target.value)}
        />
        <label>Coluna:</label>
        <input
          style={{ width: '45px', padding: '6px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={writeColuna}
          onChange={e => setWriteColuna(e.target.value)}
        />
        <label>Valor:</label>
        <input
          style={{ width: '60px', padding: '6px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={writeVal}
          onChange={e => setWriteVal(e.target.value)}
        />
        <button type="button" className="m52-sim-action" onClick={handleWrite}>Gravar Célula</button>
      </div>

      <CodePanel name="BuscarValorMatriz.java" code={codeBusca} lines={false} />
    </div>
  );
}

// ── 5. Lab de Validador de Coordenadas ──────────────
function ValidadorLab() {
  const [linha, setLinha] = useState('1');
  const [coluna, setColuna] = useState('2');
  const matrix = [
    [10, 20, 30],
    [40, 50, 60]
  ];

  const l = parseInt(linha, 10);
  const c = parseInt(coluna, 10);

  const lValida = !isNaN(l) && l >= 0 && l < matrix.length;
  const cValida = lValida && !isNaN(c) && c >= 0 && c < matrix[l].length;

  const code = `int linha = ${linha};\nint coluna = ${coluna};\n\nboolean linhaValida = linha >= 0 && linha < matriz.length;\nboolean colunaValida = linhaValida && coluna >= 0 && coluna < matriz[linha].length;\n\nif (linhaValida && colunaValida) {\n    System.out.println(matriz[linha][coluna]);\n} else {\n    System.out.println("Coordenada inválida!");\n}`;

  return (
    <div className="m52-sim-box">
      <VisualMatrix matrix={matrix} activeLinha={lValida ? l : -1} activeColuna={cValida ? c : -1} />
      <div className="m52-sim-controls">
        <label>Coordenada Linha:</label>
        <input
          style={{ width: '60px', padding: '6px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={linha}
          onChange={e => setLinha(e.target.value)}
        />
        <label style={{ marginLeft: '12px' }}>Coluna:</label>
        <input
          style={{ width: '60px', padding: '6px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={coluna}
          onChange={e => setColuna(e.target.value)}
        />
      </div>

      <div className="p51-dashboard" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className={`p51-var-card ${lValida ? 'count' : 'error'}`}><small>Linha Válida?</small><strong>{lValida ? 'SIM' : 'NÃO'}</strong></div>
        <div className={`p51-var-card ${cValida ? 'count' : 'error'}`}><small>Coluna Válida?</small><strong>{cValida ? 'SIM' : 'NÃO'}</strong></div>
        <div className="p51-var-card"><small>Célula Acessível</small><strong>{lValida && cValida ? matrix[l][c] : '—'}</strong></div>
      </div>

      <div className="m52-sim-grid">
        <CodePanel name="ValidarLinhaColuna.java" code={code} lines={false} />
        <div className={`m52-console ${lValida && cValida ? 'success' : 'error'}`}>
          <header><Terminal size={14} /> Console</header>
          <pre>{lValida && cValida ? `Valor da célula: ${matrix[l][c]}` : 'Linha ou coluna inválida! Evitou crash na memória.'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 6. Galeria de Domínios ──────────────────────────
const DOMAINS = [
  {
    id: 'notas', label: 'Alunos & Notas', file: 'NotasAlunosBimestres.java',
    code: `double[][] notas = {\n    {8.0, 7.5, 9.0, 8.5},\n    {6.0, 7.0, 6.5, 8.0},\n    {9.0, 9.5, 10.0, 9.0}\n};\n\nfor (int a = 0; a < notas.length; a++) {\n    double soma = 0.0;\n    for (int b = 0; b < notas[a].length; b++) {\n        soma += notas[a][b];\n    }\n    double media = soma / notas[a].length;\n    System.out.println("Aluno " + (a+1) + " - Media: " + media);\n}`,
    output: `Aluno 1 - Media: 8.25\nAluno 2 - Media: 6.875\nAluno 3 - Media: 9.375`,
    insight: 'Didaticamente modela linhas como alunos e colunas como notas de bimestres.'
  },
  {
    id: 'vendas', label: 'Vendas por Mês', file: 'VendasProdutosMes.java',
    code: `int[][] vendas = {\n    {10, 12, 8},\n    {5, 7, 9},\n    {20, 18, 22}\n};\n\nfor (int p = 0; p < vendas.length; p++) {\n    int total = 0;\n    for (int m = 0; m < vendas[p].length; m++) {\n        total += vendas[p][m];\n    }\n    System.out.println("Produto " + (p+1) + " - Vendas: " + total);\n}`,
    output: `Produto 1 - Vendas: 30\nProduto 2 - Vendas: 21\nProduto 3 - Vendas: 60`,
    insight: 'Linhas representam os produtos e as colunas, as vendas de cada mês.'
  },
  {
    id: 'pedidos', label: 'Pedidos & Status', file: 'PedidosStatusMes.java',
    code: `int[][] pedidos = {\n    {10, 12, 8},\n    {5, 7, 4},\n    {2, 1, 3}\n};\nString[] status = {"PENDENTE", "APROVADO", "RECUSADO"};\n\nfor (int l = 0; l < pedidos.length; l++) {\n    int total = 0;\n    for (int m = 0; m < pedidos[l].length; m++) {\n        total += pedidos[l][m];\n    }\n    System.out.println(status[l] + " - Total: " + total);\n}`,
    output: `PENDENTE - Total: 30\nAPROVADO - Total: 16\nRECUSADO - Total: 6`,
    insight: 'Utilização de matriz bidimensional em conjunto com array de rótulo para as linhas.'
  },
  {
    id: 'os', label: 'OS & Atividades', file: 'OrdensAtividadesMatriz.java',
    code: `int[][] atividadesPorOs = {\n    {1, 0, 1},\n    {1, 1, 1},\n    {0, 1, 0}\n};\n\nfor (int os = 0; os < atividadesPorOs.length; os++) {\n    int total = 0;\n    for (int a = 0; a < atividadesPorOs[os].length; a++) {\n        total += atividadesPorOs[os][a];\n    }\n    System.out.println("OS " + (os+1) + " - Atividades: " + total);\n}`,
    output: `OS 1 - Atividades: 2\nOS 2 - Atividades: 3\nOS 3 - Atividades: 1`,
    insight: 'A matriz representa presença (1) ou ausência (0) de atividades em ordens de serviço.'
  },
  {
    id: 'parcelas', label: 'Parcelas (long)', file: 'PagamentosParcelasMatriz.java',
    code: `long[][] parcelas = {\n    {1000L, 1000L, 1000L},\n    {2500L, 2500L, 0L},\n    {5000L, 0L, 0L}\n};\n\nfor (int p = 0; p < parcelas.length; p++) {\n    long total = 0L;\n    for (int c = 0; c < parcelas[p].length; c++) {\n        total += parcelas[p][c];\n    }\n    System.out.println("Pagamento " + (p+1) + " - Total Centavos: " + total);\n}`,
    output: `Pagamento 1 - Total Centavos: 3000\nPagamento 2 - Total Centavos: 5000\nPagamento 3 - Total Centavos: 5000`,
    insight: 'Para valores financeiros, seguimos a regra de usar long em centavos.'
  },
  {
    id: 'auditoria', label: 'Auditoria', file: 'AuditoriaDiaOperacaoMatriz.java',
    code: `int[][] eventos = {\n    {5, 2, 1},\n    {8, 4, 0},\n    {3, 1, 2}\n};\nString[] operacoes = {"CRIACAO", "EDICAO", "EXCLUSAO"};\n\nfor (int d = 0; d < eventos.length; d++) {\n    System.out.println("Dia " + (d+1));\n    for (int o = 0; o < eventos[d].length; o++) {\n        System.out.println("  " + operacoes[o] + ": " + eventos[d][o]);\n    }\n}`,
    output: `Dia 1\n  CRIACAO: 5\n  EDICAO: 2\n  EXCLUSAO: 1\nDia 2\n  CRIACAO: 8\n  EDICAO: 4\n  EXCLUSAO: 0\nDia 3\n  CRIACAO: 3\n  EDICAO: 1\n  EXCLUSAO: 2`,
    insight: 'Matriz com rótulo de colunas fornecidos por array separado.'
  },
  {
    id: 'mensageria', label: 'Mensageria', file: 'MensageriaDiaTipoMatriz.java',
    code: `int[][] envios = {\n    {10, 5, 2},\n    {8, 7, 3},\n    {12, 4, 1}\n};\nString[] tipos = {"BOAS_VINDAS", "ENTREGA", "NPS"};\n\nfor (int d = 0; d < envios.length; d++) {\n    int total = 0;\n    System.out.println("Dia " + (d+1));\n    for (int t = 0; t < envios[d].length; t++) {\n        System.out.println("  " + tipos[t] + ": " + envios[d][t]);\n        total += envios[d][t];\n    }\n    System.out.println("  Total: " + total);\n}`,
    output: `Dia 1\n  BOAS_VINDAS: 10\n  ENTREGA: 5\n  NPS: 2\n  Total: 17\nDia 2\n  BOAS_VINDAS: 8\n  ENTREGA: 7\n  NPS: 3\n  Total: 18\nDia 3\n  BOAS_VINDAS: 12\n  ENTREGA: 4\n  NPS: 1\n  Total: 17`,
    insight: 'Matriz aplicada para consolidar envio diário de mensagens por tipo.'
  }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return (
    <section className="m52-domains-gallery">
      <div className="m52-domains-sidebar">
        {DOMAINS.map((d, i) => (
          <button key={d.id} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>{d.label}</button>
        ))}
      </div>
      <div className="m52-domains-content">
        <CodePanel name={item.file} code={item.code} lines={false} />
        <div className="m52-console">
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
    title: 'Confundir Linha e Coluna no Acesso',
    code: `int[][] matriz = {\n    {10, 20, 30},\n    {40, 50, 60}\n};\n// Esperado: valor 40 na linha 1, coluna 0\nSystem.out.println(matriz[0][1]); // imprime 20!`,
    symptom: 'Exibição de valores trocados ou crash na memória.',
    cause: 'Inverter a ordem lógica dos índices: usar matriz[coluna][linha] ao invés de matriz[linha][coluna].',
    fix: 'Mantenha a convenção estrita: o primeiro índice é linha, o segundo é coluna.'
  },
  {
    title: 'Usar matriz.length para o loop de colunas',
    code: `int[][] matriz = {\n    {10, 20, 30},\n    {40, 50, 60}\n};\nfor (int l = 0; l < matriz.length; l++) {\n    for (int c = 0; c < matriz.length; c++) { // Errado!\n        System.out.print(matriz[l][c]);\n    }\n}`,
    symptom: 'Loop de colunas é interrompido antes do tempo (imprime apenas 2 colunas ao invés de 3).',
    cause: '`matriz.length` retorna a quantidade de linhas (2). O loop interno de colunas deveria ir até 3.',
    fix: 'Use sempre `matriz[linha].length` no limite do loop interno de colunas.'
  },
  {
    title: 'Usar <= em vez de < na condição de parada',
    code: `for (int l = 0; l <= matriz.length; l++) { ... }`,
    symptom: 'ArrayIndexOutOfBoundsException: Index N out of bounds for length N',
    cause: 'Índices de arrays são zero-indexed, indo de 0 a length-1. Usar `<=` causa acesso no índice length, que é inexistente.',
    fix: 'Use sempre `<` (menor estrito) na condição de parada do laço.'
  },
  {
    title: 'Não quebrar linha na exibição tabular',
    code: `for (int l = 0; l < matriz.length; l++) {\n    for (int c = 0; c < matriz[l].length; c++) {\n        System.out.print(matriz[l][c] + " ");\n    }\n    // Esqueceu de pular linha!\n}`,
    symptom: '10 20 30 40 50 60 (tudo em uma única linha no terminal).',
    cause: 'Falta de chamada ao método `System.out.println()` após o término do loop interno de colunas.',
    fix: 'Adicione `System.out.println();` logo após fechar o laço de colunas.'
  },
  {
    title: 'Acessar matriz[0][0] em matriz vazia',
    code: `int[][] matriz = new int[0][0];\nint maior = matriz[0][0]; // crash!`,
    symptom: 'ArrayIndexOutOfBoundsException: Index 0 out of bounds for length 0',
    cause: 'A matriz foi criada sem dimensões físicas (tamanho zero). Tentar acessar a primeira célula causa quebra.',
    fix: 'Valide sempre `if (matriz.length == 0 || matriz[0].length == 0)` antes de iniciar a varredura.'
  },
  {
    title: 'Somar índices l/c em vez do valor da célula',
    code: `for (int l = 0; l < matriz.length; l++) {\n    for (int c = 0; c < matriz[l].length; c++) {\n        soma += l + c; // Errado!\n    }\n}`,
    symptom: 'Soma calculada incorretamente (soma os índices físicos 0, 1, 2...).',
    cause: 'Atribuir a soma aos contadores de laços (`l` e `c`) ao invés do elemento `matriz[l][c]`.',
    fix: 'Use `soma += matriz[l][c];` para acessar e acumular o conteúdo da célula.'
  },
  {
    title: 'Validar coluna antes de validar a linha',
    code: `int linha = 5; int coluna = 0;\n// Perigo: linha inválida acessada no length!\nif (coluna < matriz[linha].length && linha < matriz.length) { ... }`,
    symptom: 'ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 1',
    cause: 'Avaliar a coluna chamando `matriz[linha].length` antes de certificar que a linha é de fato válida.',
    fix: 'Use curto-circuito de forma ordenada: valide a linha primeiro, depois a coluna.'
  },
  {
    title: 'Esquecer que cada linha pode ter tamanho diferente',
    code: `int[][] matriz = {{10, 20}, {30, 40, 50}};\nint cols = matriz[0].length; // assume 2 colunas para todas\nfor (int l = 0; l < matriz.length; l++) {\n    for (int c = 0; c < cols; c++) { ... } // ignora col 2 da lin 1\n}`,
    symptom: 'Elementos de colunas extras em linhas irregulares são ignorados no relatório.',
    cause: 'Fixar o tamanho de colunas com base em apenas uma linha (usualmente a primeira) em matrizes irregulares.',
    fix: 'Use o acesso dinâmico por linha no loop interno: `matriz[linha].length`.'
  },
  {
    title: 'Nomes de variáveis confusos em laços complexos',
    code: `for (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++) {\n        // Quem é i e quem é j?\n    }\n}`,
    symptom: 'Fácil inversão de parâmetros e dificuldade extrema de leitura do código.',
    cause: 'Uso excessivo de contadores genéricos `i` e `j` em loops aninhados.',
    fix: 'Use nomes descritivos como `linha` e `coluna` (ou `aluno` e `bimestre` dependendo do negócio).'
  },
  {
    title: 'Usar matriz bidimensional sem necessidade real',
    code: `// Criando matriz de R$ vendas apenas por produto simples...`,
    symptom: 'Complexidade de código acentuada sem ganho lógico.',
    cause: 'Utilizar estrutura 2D para representar uma única dimensão de dados.',
    fix: 'Avalie: se a estrutura pode ser descrita por um array unidimensional simples, evite a matriz.'
  }
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="m52-errors-clinic">
      <nav className="m52-errors-nav">
        {ERRORS.map((e, i) => (
          <button key={i} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>
            <span>{i + 1}</span>
            <span className="guided-error-label">{e.title}</span>
          </button>
        ))}
      </nav>
      <div className="m52-error-card">
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
        <div className="m52-error-flow">
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
      cmd: `New-Item -ItemType Directory -Force labs\\m1\\aula-052-matriz-bidimensional-inicial\ncd labs\\m1\\aula-052-matriz-bidimensional-inicial\nNew-Item Main.java, ExibirMatriz.java, ExibirComIndice.java, PreencherManual.java, PreencherComCalculo.java, LerMatrizConsole.java, SomarMatriz.java, MediaMatriz.java, MaiorMenorMatriz.java, NotasAlunosBimestres.java, VendasProdutosMes.java, PedidosStatusMes.java, OrdensAtividadesMatriz.java, PagamentosParcelasMatriz.java, AuditoriaDiaOperacaoMatriz.java, MensageriaDiaTipoMatriz.java, SomarColunas.java, BuscarValorMatriz.java, AlterarValorMatriz.java, ValidarLinhaColuna.java, ErroLengthColuna.java, ErroMenorIgual.java, ErroSemQuebraLinha.java, ErroValidarColunaAntesLinha.java, ErroSomarIndice.java`,
      out: 'Criado com sucesso — 25 arquivos de laboratório para a Aula 052.',
      tip: 'Insira o código de cada respectiva lição em seus arquivos locais.'
    },
    {
      title: 'Verificar Erros Propositais',
      cmd: `javac ErroLengthColuna.java && java ErroLengthColuna\njavac ErroValidarColunaAntesLinha.java && java ErroValidarColunaAntesLinha`,
      out: `ErroLengthColuna:\n10 20 (Parou na coluna 1!)\n40 50\n\nErroValidarColunaAntesLinha:\nException in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 1`,
      tip: 'Observe o crash. Corrija o loop interno e a ordem do curto-circuito condicional.'
    },
    {
      title: 'Compilar e Executar Sucessos',
      cmd: `javac *.java\njava ExibirComIndice\njava PreencherComCalculo\njava SomarMatriz\njava MediaMatriz`,
      out: `ExibirComIndice:\nLinha 0, coluna 0: 10\nLinha 0, coluna 1: 20...\n\nPreencherComCalculo:\n0 1 2\n1 2 3\n2 3 4`,
      tip: 'Verifique se as impressões estão alinhadas no console em formato de tabela.'
    },
    {
      title: 'Commit de Fechamento',
      cmd: `git status\ngit add labs/m1/aula-052-matriz-bidimensional-inicial docs/diario-de-bordo.md\ngit commit -m "Aula 052: pratica matriz bidimensional inicial"\ngit status`,
      out: 'working tree clean',
      tip: 'Confirme que a working tree está limpa e sem rastros de arquivos .class.'
    }
  ];
  const current = steps[stage];
  const scannerExample = `import java.util.Scanner;

public class LerMatrizConsole {
    public static void main(String[] args) {
        int[][] valores = new int[2][3];

        try (Scanner scanner = new Scanner(System.in)) {
            for (int linha = 0; linha < valores.length; linha++) {
                for (int coluna = 0; coluna < valores[linha].length; coluna++) {
                    System.out.print("Linha " + (linha + 1)
                            + ", coluna " + (coluna + 1) + ": ");
                    valores[linha][coluna] = scanner.nextInt();
                }
            }
        }

        int soma = 0;
        for (int linha = 0; linha < valores.length; linha++) {
            for (int coluna = 0; coluna < valores[linha].length; coluna++) {
                System.out.print(valores[linha][coluna] + " ");
                soma += valores[linha][coluna];
            }
            System.out.println();
        }

        System.out.println("Soma total: " + soma);
    }
}`;

  return (
    <section>
      <div className="m52-delivery-nav">
        {steps.map((s, i) => (
          <button key={s.title} type="button" className={stage === i ? 'active' : ''} onClick={() => setStage(i)}>
            <span>{i < stage ? <Check size={11} /> : i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="m52-terminal">
        <header><Terminal size={14} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={14} /> {current.tip}</p>
      </div>
      <div className="m52-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button>
      </div>

      <aside className="guided-note info" style={{ marginTop: '18px' }}>
        <Lightbulb size={20} />
        <div><strong>Exemplo guiado antes do desafio</strong><p>Acompanhe os dois laços tanto na leitura quanto na exibição. Os rótulos usam posição amigável, mas o acesso continua com os índices técnicos linha e coluna.</p></div>
      </aside>
      <CodePanel name="LerMatrizConsole.java" code={scannerExample} />

      <section className="guided-challenge" style={{ marginTop: '20px' }}>
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: RelatorioVendasMatriz.java</h3></div>
        <p>Crie <code>RelatorioVendasMatriz.java</code> na pasta da aula. Declare uma matriz <code>int[3][4]</code> representando as vendas de 3 produtos durante os 4 trimestres do ano. Leia esses valores do console (Scanner). Após ler:</p>
        <ul>
          <li><strong>Exiba a matriz tabular</strong> com rótulos de posições amigáveis (Produto 1, Trimestre 1, etc).</li>
          <li><strong>Soma por Produto</strong>: Calcule e exiba o total anual de vendas para cada um dos 3 produtos (soma das linhas).</li>
          <li><strong>Soma por Trimestre</strong>: Calcule e exiba o total geral vendido pela empresa em cada um dos 4 trimestres (soma das colunas).</li>
          <li><strong>Consistência</strong>: Proteja o loop de colunas com <code>matriz[linha].length</code> e garanta que o Scanner seja devidamente fechado.</li>
        </ul>
      </section>

      <div className="guided-file m52-code" style={{ marginTop: '16px' }}>
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
  if (block.type === 'grid_sim') return <GridMatrizSimulator />;
  if (block.type === 'prop_lab') return <PropriedadesLab />;
  if (block.type === 'op_lab') return <OperacoesLab />;
  if (block.type === 'busca_lab') return <BuscaEscritaLab />;
  if (block.type === 'valid_lab') return <ValidadorLab />;
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
    id: 'grid', eyebrow: 'Conceito Central', label: 'Grid Visual de Matriz',
    title: 'Visualizando linhas, colunas e células em uma estrutura bidimensional', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Itere passo a passo pela matriz 2x3 e acompanhe as coordenadas do percurso aninhado:' }, { type: 'grid_sim' }]
  },
  {
    id: 'propriedades', eyebrow: 'Tamanhos Físicos', label: 'Propriedades da Matriz',
    title: 'Propriedades matriz.length e matriz[linha].length com linhas e colunas', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Veja como o Java lê os tamanhos de matrizes retangulares e irregulares:' }, { type: 'prop_lab' }]
  },
  {
    id: 'operacoes', eyebrow: 'Cálculos Matemáticos', label: 'Estatísticas de Matriz',
    title: 'Soma total, média, maior, menor e consolidação de linhas/colunas', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Selecione a operação para visualizar o algoritmo em ação e o console correspondente:' }, { type: 'op_lab' }]
  },
  {
    id: 'busca', eyebrow: 'Pesquisa e Alteração', label: 'Busca e Escrita',
    title: 'Localizando valores e alterando células diretamente', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Pesquise um elemento para destacar sua posição ou reescreva dados em tempo real:' }, { type: 'busca_lab' }]
  },
  {
    id: 'validacao', eyebrow: 'Segurança de Acesso', label: 'Validador de Coordenadas',
    title: 'Protegendo a leitura de células contra índices fora dos limites', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Simule coordenadas inválidas para testar o curto-circuito condicional:' }, { type: 'valid_lab' }]
  },
  {
    id: 'dominios', eyebrow: 'Aplicações Práticas', label: 'Galeria de Domínios',
    title: 'Matrizes aplicadas em 7 cenários reais de backend Java', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Navegue pelas regras de bimestres, vendas, OS, parcelas, auditoria e mensageria:' }, { type: 'domains' }]
  },
  {
    id: 'clinica', eyebrow: 'Depuração', label: 'Clínica de Erros',
    title: 'Estudo e correção das 10 falhas comuns com matrizes bidimensionais', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Examine cada bug clássico, seu sintoma característico e a resolução:' }, { type: 'errors' }]
  },
  {
    id: 'entrega', eyebrow: 'Exercícios Locais', label: 'Entrega & Desafio',
    title: 'Execução dos 25 arquivos de laboratório e o desafio RelatorioVendasMatriz', duration: '10 min',
    blocks: [{ type: 'lead', text: 'Acompanhe os passos do PowerShell local e implemente o desafio anual de vendas:' }, { type: 'delivery' }]
  }
];

// ── Componente Principal ─────────────────────────────
export default function GuidedMatrixInitialLesson052({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
    <article className="guided-git-lesson guided-matrix-initial-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Table size={17} /> Matrizes</span>
          <p className="guided-sequence">052 · M1.32</p>
          <h1>Matriz Bidimensional Inicial</h1>
          <p>Domine tabelas lógicas em Java: declaração, inicialização, percursos usando laços aninhados, propriedades físicas de linhas e colunas, preenchimento dinâmico, estatísticas básicas (soma, média, maior e menor) e validações preventivas.</p>
        </div>
        <div className="guided-hero-status">
          <Table size={42} />
          <strong>{progress}%</strong>
          <span>{completedLabel}</span>
        </div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula 052" items={[
        { value: 'matriz[l][c]', label: 'Coordenada de célula' },
        { value: 'matriz.length', label: 'Contagem de linhas' },
        { value: 'matriz[l].length', label: 'Contagem de colunas' }
      ]} />

      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 052">
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
                <h3>Matrizes Bidimensionais dominadas!</h3>
                <p>{lessonComplete ? 'Linhas, colunas, loops aninhados e estatísticas consolidados.' : 'Conclua a aula para registrar seu progresso.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 051</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Matrizes bidimensionais consolidadas' : allStepsComplete ? 'Use o botão acima' : 'Pratique percursos, soma, média, maior, menor e validações'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Próxima Aula'}>
          Aula 053 <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
