import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck,
  Check, CheckCircle2, ChevronRight, Clock3, Copy, FileCode2,
  Lightbulb, ListChecks, RotateCcw, Sparkles, Terminal, Layers, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedArrayParallelLesson.css';

const STORAGE_KEY = 'guided-array-parallel-lesson-051-progress';

const EVIDENCE = [
  '# Aula 051 — Arrays Paralelos', '',
  '## Fundamentos', '- [ ] Entendi como o mesmo índice liga dados em arrays paralelos', '- [ ] Declarei e manipulei String[] de clientes, long[] de valores e String[] de status', '- [ ] Percorri arrays em paralelo no mesmo loop for usando o mesmo índice', '',
  '## Validação de Integridade', '- [ ] Implementei a verificação de tamanho (`length`) igual antes de processar', '- [ ] Compreendi o risco de `ArrayIndexOutOfBoundsException` com tamanhos diferentes', '',
  '## Fragilidades do Modelo', '- [ ] Entendi o problema do desalinhamento de dados (ordenar ou alterar apenas um array)', '- [ ] Compreendi por que arrays paralelos são didáticos mas frágeis no mundo real', '- [ ] Reconheci que a programação orientada a objetos (POO) é a solução ideal para agrupar campos', '',
  '## Processamento Condicional', '- [ ] Calculei a soma total de valores usando long[] em centavos', '- [ ] Filtrei e somei apenas pedidos com status "APROVADO"', '- [ ] Contei ocorrências por status em loops condicionais', '',
  '## Operações de Busca e Escrita', '- [ ] Implementei busca por cliente ignorando caixa (`equalsIgnoreCase`)', '- [ ] Executei a alteração do status de um cliente usando o índice encontrado', '- [ ] Validei a consistência dos registros lógicos (cliente em branco, valor negativo, status inválido)', '',
  '## Evidências Locais', '- [ ] Criei, compilei e executei os 27 arquivos de laboratório localmente', '- [ ] Diagnostiquei a falha e simulei a quebra em `ErroTamanhosDiferentes.java`', '- [ ] Simulei o resultado corrompido em `ErroValorDesalinhado.java`', '- [ ] Guardei as evidências e limpei os arquivos `.class` via Git',
  '',
  '## Decisão de Projeto', '- Por que arrays paralelos exigem verificação de tamanho no início do método?', '- O que acontece se ordenarmos apenas um dos arrays paralelos?'
].join('\n');

// ── Utilidades ──────────────────────────────────────
function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  };
  return <button type="button" className="p51-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file p51-code">
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

function ParallelTable({ clientes, valores, status, activeIndex = -1, isCorrupted = false }) {
  return (
    <div className="p51-table-wrapper">
      <table className="p51-table">
        <thead>
          <tr>
            <th className="p51-idx-col">Índice</th>
            <th>Cliente (String[])</th>
            <th>Valor Centavos (long[])</th>
            <th>Status (String[])</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c, i) => {
            const val = valores[i] !== undefined ? valores[i] : 'OUT_OF_BOUNDS';
            const stat = status[i] !== undefined ? status[i] : 'OUT_OF_BOUNDS';
            let rowCls = '';
            if (i === activeIndex) rowCls = 'active';
            if (isCorrupted && i === 1) rowCls = 'corrupted';

            const statBadgeCls = `p51-status-badge ${String(stat).toLowerCase()}`;

            return (
              <tr key={i} className={rowCls}>
                <td className="p51-idx-col">[{i}]</td>
                <td>{c}</td>
                <td style={{ color: val === 'OUT_OF_BOUNDS' ? '#f87171' : '#e2e8f0' }}>
                  {val === 'OUT_OF_BOUNDS' ? 'OUT_OF_BOUNDS' : `${val} (R$ ${(val/100).toFixed(2)})`}
                </td>
                <td>
                  <span className={statBadgeCls}>{stat}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── 1. Simulador de Tabela Paralela ──────────────────
function TabelaParalelaSimulator() {
  const [clientes] = useState(['Ana', 'Bruno', 'Carla']);
  const [valores] = useState([1000, 2500, 5000]);
  const [status] = useState(['PENDENTE', 'APROVADO', 'RECUSADO']);
  const [step, setStep] = useState(-1);
  const [log, setLog] = useState('Pressione "Percorrer" para ver como o loop lê os arrays em paralelo.');

  const advance = () => {
    const next = step + 1;
    if (next < clientes.length) {
      setStep(next);
      setLog(`índice = ${next}
  clientes[${next}] = "${clientes[next]}"
  valoresCentavos[${next}] = ${valores[next]}
  statusPedidos[${next}] = "${status[next]}"`);
    } else {
      setStep(-1);
      setLog('Fim do percurso.');
    }
  };

  const reset = () => {
    setStep(-1);
    setLog('Pressione "Percorrer" para ver como o loop lê os arrays em paralelo.');
  };

  const code = `String[] clientes = {"Ana", "Bruno", "Carla"};\nlong[] valoresCentavos = {1000L, 2500L, 5000L};\nString[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO"};\n\nfor (int i = 0; i < clientes.length; i++) {\n    System.out.println("Cliente: " + clientes[i]);\n    System.out.println("Valor: " + valoresCentavos[i]);\n    System.out.println("Status: " + statusPedidos[i]);\n}`;

  return (
    <div className="p51-sim-box">
      <ParallelTable clientes={clientes} valores={valores} status={status} activeIndex={step} />
      <div className="p51-sim-controls">
        <button type="button" className="p51-sim-action" onClick={advance}>
          {step === -1 ? '▶ Percorrer' : 'Próximo passo →'}
        </button>
        <button type="button" className="p51-sim-action" style={{ background: '#334155' }} onClick={reset}>↺ Reiniciar</button>
      </div>
      <div className="p51-sim-grid">
        <CodePanel name="RelatorioPedidosParalelos.java" code={code} lines={false} />
        <div className="p51-console success">
          <header><Terminal size={14} /> Console de Depuração</header>
          <pre>{log}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 2. Painel de Fragilidade & Desalinhamento ────────
function FragilidadeSimulator() {
  const [modo, setModo] = useState('normal'); // 'normal', 'desalinhado', 'tamanhos'

  // Normal:
  const clientesN = ['Ana', 'Bruno', 'Carla'];
  const valoresN = [1000, 2500, 5000];
  const statusN = ['PENDENTE', 'APROVADO', 'RECUSADO'];

  // Desalinhado (Valores trocados):
  const clientesD = ['Ana', 'Bruno', 'Carla'];
  const valoresD = [2500, 1000, 5000]; // Valores trocados de Ana e Bruno
  const statusD = ['PENDENTE', 'APROVADO', 'RECUSADO'];

  // Tamanhos diferentes:
  const clientesT = ['Ana', 'Bruno', 'Carla'];
  const valoresT = [1000, 2500]; // Carla não tem valor!
  const statusT = ['PENDENTE', 'APROVADO', 'RECUSADO'];

  const getClientes = () => modo === 'normal' ? clientesN : modo === 'desalinhado' ? clientesD : clientesT;
  const getValores = () => modo === 'normal' ? valoresN : modo === 'desalinhado' ? valoresD : valoresT;
  const getStatus = () => modo === 'normal' ? statusN : modo === 'desalinhado' ? statusD : statusT;

  const codeDesalinhado = `// O programador mudou apenas a ordem do array de valores:\nString[] clientes = {"Ana", "Bruno", "Carla"};\nlong[] valores = {2500L, 1000L, 5000L}; // Bruno <-> Ana trocados!\nString[] status = {"PENDENTE", "APROVADO", "RECUSADO"};\n\n// Ana ficou com o valor de Bruno e vice-versa. Sem exceções, dado corrompido!`;

  const codeTamanhos = `// Tamanhos desiguais:\nString[] clientes = {"Ana", "Bruno", "Carla"};\nlong[] valores = {1000L, 2500L}; // falta o índice 2!\n\nfor (int i = 0; i < clientes.length; i++) {\n    // Quando i == 2, valores[2] lança erro!\n    System.out.println(valores[i]);\n}`;

  return (
    <div className="p51-sim-box">
      <ParallelTable
        clientes={getClientes()}
        valores={getValores()}
        status={getStatus()}
        isCorrupted={modo === 'desalinhado'}
      />
      <div className="p51-sim-controls">
        <button type="button" className="p51-sim-action" style={{ background: modo === 'normal' ? '#16a34a' : '#475569' }} onClick={() => setModo('normal')}>✅ Alinhamento Correto</button>
        <button type="button" className="p51-sim-action" style={{ background: modo === 'desalinhado' ? '#d97706' : '#475569' }} onClick={() => setModo('desalinhado')}>❌ Desalinhamento Lógico</button>
        <button type="button" className="p51-sim-action" style={{ background: modo === 'tamanhos' ? '#dc2626' : '#475569' }} onClick={() => setModo('tamanhos')}>⚠️ Tamanhos Diferentes</button>
      </div>

      {modo === 'desalinhado' && (
        <div className="p51-sim-grid">
          <CodePanel name="ErroValorDesalinhado.java" code={codeDesalinhado} lines={false} />
          <div className="p51-console warning">
            <header><Terminal size={14} /> Efeito Silencioso</header>
            <pre>{`Ana -> R$ 25.00 (Deveria ser R$ 10.00)\nBruno -> R$ 10.00 (Deveria ser R$ 25.00)\n\n⚠ O programa roda com sucesso, mas o\n   relatório exibe valores trocados!\n   Isso é um bug lógico gravíssimo.`}</pre>
          </div>
        </div>
      )}

      {modo === 'tamanhos' && (
        <div className="p51-sim-grid">
          <CodePanel name="ErroTamanhosDiferentes.java" code={codeTamanhos} lines={false} />
          <div className="p51-console error">
            <header><Terminal size={14} /> Crash</header>
            <pre>{`Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException:\nIndex 2 out of bounds for length 2\n\tat ErroTamanhosDiferentes.main(ErroTamanhosDiferentes.java:7)`}</pre>
          </div>
        </div>
      )}

      {modo === 'normal' && (
        <aside className="guided-note info">
          <Lightbulb size={20} />
          <div>
            <strong>O Vínculo por Índice é Frágil</strong>
            <p>Arrays paralelos dependem de estrita sincronização de posições. Se você alterar o tamanho de um array ou ordenar apenas uma das listas, todo o sistema de vínculos se rompe, exibindo dados incoerentes ou gerando falhas em runtime. Essa dor didática serve para justificar a necessidade da Orientação a Objetos no futuro.</p>
          </div>
        </aside>
      )}
    </div>
  );
}

// ── 3. Lab Validador de Tamanhos ────────────────────
function TamanhosLab() {
  const [tamanhoValores, setTamanhoValores] = useState(3);
  const clientes = ['Ana', 'Bruno', 'Carla'];
  const valores = tamanhoValores === 3 ? [1000, 2500, 5000] : [1000, 2500];

  const valid = clientes.length === valores.length;

  const code = `boolean tamanhosIguais = clientes.length == valores.length;\n\nif (!tamanhosIguais) {\n    System.out.println("Erro: dados desalinhados.");\n} else {\n    // processa com segurança\n}`;

  return (
    <div className="p51-sim-box">
      <ParallelTable clientes={clientes} valores={valores} status={['PENDENTE', 'APROVADO', 'RECUSADO']} />
      <div className="p51-sim-controls">
        <label>Tamanho do array de valores:</label>
        <button type="button" className="p51-sim-action" style={{ background: tamanhoValores === 3 ? '#16a34a' : '#475569' }} onClick={() => setTamanhoValores(3)}>Igual (3 elementos)</button>
        <button type="button" className="p51-sim-action" style={{ background: tamanhoValores === 2 ? '#dc2626' : '#475569' }} onClick={() => setTamanhoValores(2)}>Diferente (2 elementos)</button>
      </div>

      <div className="p51-dashboard">
        <div className="p51-var-card"><small>clientes.length</small><strong>{clientes.length}</strong></div>
        <div className="p51-var-card"><small>valores.length</small><strong>{valores.length}</strong></div>
        <div className={`p51-var-card ${valid ? 'count' : 'error'}`}>
          <small>Status</small>
          <strong>{valid ? 'VÁLIDO' : 'ERRO'}</strong>
        </div>
      </div>

      <div className="p51-sim-grid">
        <CodePanel name="ValidarTamanhosParalelos.java" code={code} lines={false} />
        <div className={`p51-console ${valid ? 'success' : 'error'}`}>
          <header><Terminal size={14} /> Validador</header>
          <pre>{valid ? 'Console:\nArrays válidos para processamento. Pronto para iniciar o percurso.' : 'Console:\nErro: arrays paralelos com tamanhos diferentes. Processamento abortado preventivamente.'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 4. Lab de Operações Condicionais ────────────────
function OperacoesCondicionaisLab() {
  const [statusFiltro, setStatusFiltro] = useState('APROVADO');
  const clientes = ['Ana', 'Bruno', 'Carla', 'Daniel', 'Eva'];
  const valores = [1000, 2500, 5000, 3000, 7000];
  const status = ['PENDENTE', 'APROVADO', 'RECUSADO', 'APROVADO', 'PENDENTE'];

  let soma = 0;
  let count = 0;
  status.forEach((st, i) => {
    if (st === statusFiltro) {
      soma += valores[i];
      count++;
    }
  });

  const code = `long totalAprovado = 0L;\nint quantidadeAprovados = 0;\n\nfor (int i = 0; i < clientes.length; i++) {\n    if ("${statusFiltro}".equals(statusPedidos[i])) {\n        totalAprovado += valoresCentavos[i];\n        quantidadeAprovados++;\n    }\n}`;

  return (
    <div className="p51-sim-box">
      <ParallelTable clientes={clientes} valores={valores} status={status} />
      <div className="p51-sim-controls">
        <label>Filtrar por Status:</label>
        {['PENDENTE', 'APROVADO', 'RECUSADO'].map(st => (
          <button key={st} type="button" className="p51-sim-action" style={{ background: statusFiltro === st ? '#4f46e5' : '#334155' }} onClick={() => setStatusFiltro(st)}>
            {st}
          </button>
        ))}
      </div>

      <div className="p51-dashboard">
        <div className="p51-var-card count"><small>Quantidade</small><strong>{count}</strong></div>
        <div className="p51-var-card soma"><small>Soma Filtrada</small><strong>{soma} c</strong></div>
        <div className="p51-var-card media"><small>Em Reais</small><strong>R$ {(soma/100).toFixed(2)}</strong></div>
      </div>

      <CodePanel name="TotalPedidosAprovados.java" code={code} lines={false} />
    </div>
  );
}

// ── 5. Lab de Busca e Alteração ─────────────────────
function BuscaAlteracaoLab() {
  const [clientes] = useState(['Ana', 'Bruno', 'Carla']);
  const [valores] = useState([1000, 2500, 5000]);
  const [status, setStatus] = useState(['PENDENTE', 'APROVADO', 'RECUSADO']);

  const [busca, setBusca] = useState('');
  const [novoStatus, setNovoStatus] = useState('APROVADO');

  let foundIndex = -1;
  const buscaNormalizada = busca.trim().toUpperCase();
  if (buscaNormalizada) {
    foundIndex = clientes.findIndex(c => c.toUpperCase() === buscaNormalizada);
  }

  const update = () => {
    if (foundIndex !== -1) {
      const copy = [...status];
      copy[foundIndex] = novoStatus;
      setStatus(copy);
    }
  };

  const code = `String clienteProcurado = "${busca}";\nint indiceEncontrado = -1;\n\nfor (int i = 0; i < clientes.length; i++) {\n    if (clienteProcurado.equalsIgnoreCase(clientes[i])) {\n        indiceEncontrado = i;\n        break;\n    }\n}\n\nif (indiceEncontrado == -1) {\n    System.out.println("Cliente não encontrado.");\n} else {\n    statusPedidos[indiceEncontrado] = "${novoStatus}";\n}`;

  return (
    <div className="p51-sim-box">
      <ParallelTable clientes={clientes} valores={valores} status={status} foundIndexes={foundIndex !== -1 ? [foundIndex] : []} />
      <div className="p51-sim-controls">
        <label>Buscar Cliente:</label>
        <input
          style={{ padding: '7px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Ex: Bruno"
        />
        <label style={{ marginLeft: '12px' }}>Novo Status:</label>
        <select
          style={{ padding: '7px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'inherit' }}
          value={novoStatus}
          onChange={e => setNovoStatus(e.target.value)}
        >
          {['PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO'].map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
        <button type="button" className="p51-sim-action" disabled={foundIndex === -1} onClick={update}>Atualizar Status</button>
      </div>

      <div className="p51-sim-grid">
        <CodePanel name="AlterarStatusPorCliente.java" code={code} lines={false} />
        <div className={`p51-console ${foundIndex !== -1 ? 'success' : 'error'}`}>
          <header><Terminal size={14} /> Status da Busca</header>
          <pre>{busca ? foundIndex !== -1 ? `Cliente encontrado no índice [${foundIndex}]\nNome: ${clientes[foundIndex]}\nValor correspondente: ${valores[foundIndex]} c\nStatus atual: ${status[foundIndex]}` : 'Cliente não encontrado.' : 'Insira o nome de um cliente no campo acima.'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 6. Lab de Validador de Registros ────────────────
function ValidadorRegistrosLab() {
  const [clientes] = useState(['Ana', '', 'Carla']);
  const [valores] = useState([1000, -2500, 5000]);
  const [status] = useState(['PENDENTE', 'APROVADO', 'XYZ']);
  const [checkRun, setCheckRun] = useState(false);

  const errors = [];
  for (let i = 0; i < clientes.length; i++) {
    const rowErrors = [];
    if (clientes[i] === null || clientes[i].trim() === '') {
      rowErrors.push('Cliente em branco');
    }
    if (valores[i] <= 0) {
      rowErrors.push('Valor <= 0');
    }
    const statusValido = ['PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO'].includes(status[i]);
    if (!statusValido) {
      rowErrors.push('Status inválido');
    }
    if (rowErrors.length > 0) {
      errors.push({ idx: i, desc: rowErrors.join(' & ') });
    }
  }

  const code = `for (int i = 0; i < clientes.length; i++) {\n    boolean clienteInvalido = clientes[i] == null || clientes[i].isBlank();\n    boolean valorInvalido = valoresCentavos[i] <= 0;\n    boolean statusValido = "PENDENTE".equals(statusPedidos[i]) || "APROVADO".equals(statusPedidos[i]) || "RECUSADO".equals(statusPedidos[i]);\n\n    if (clienteInvalido || valorInvalido || !statusValido) {\n        System.out.println("Registro inválido na posição " + (i + 1));\n    }\n}`;

  return (
    <div className="p51-sim-box">
      <ParallelTable clientes={clientes} valores={valores} status={status} />
      <div className="p51-sim-controls">
        <button type="button" className="p51-sim-action" onClick={() => setCheckRun(c => !c)}>
          {checkRun ? 'Ocultar Validação' : 'Validar Integridade Lógica'}
        </button>
      </div>

      {checkRun && (
        <div className="p51-dashboard" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="p51-var-card" style={{ borderColor: '#10b981', background: '#062f22' }}><small>Posição 1 (Ana)</small><strong style={{ color: '#34d399' }}>OK</strong></div>
          <div className="p51-var-card error"><small>Posição 2 (Bruno)</small><strong>ERRO</strong></div>
          <div className="p51-var-card error"><small>Posição 3 (Carla)</small><strong>ERRO</strong></div>
        </div>
      )}

      <div className="p51-sim-grid">
        <CodePanel name="ValidarRegistrosParalelos.java" code={code} lines={false} />
        <div className="p51-console warning">
          <header><Terminal size={14} /> Console de Auditoria</header>
          <pre>{checkRun ? errors.map(e => `Registro inválido no índice [${e.idx}] (Posição ${e.idx + 1}):\n  → Motivo: ${e.desc}`).join('\n\n') : 'Aguardando validação...'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 7. Galeria de Domínios ──────────────────────────
const DOMAINS = [
  {
    id: 'produtos', label: 'Estoque', file: 'ProdutosEstoquesParalelos.java',
    code: `String[] produtos = {"Mesa", "Cadeira", "Sofá"};\nint[] estoques = {10, 0, 5};\nString[] status = {"ATIVO", "ATIVO", "INATIVO"};\n\nint semEstoqueAtivo = 0;\nfor (int i = 0; i < produtos.length; i++) {\n    if (estoques[i] == 0 && "ATIVO".equals(status[i])) {\n        System.out.println("Alerta: produto ativo sem estoque -> " + produtos[i]);\n        semEstoqueAtivo++;\n    }\n}`,
    output: `Alerta: produto ativo sem estoque -> Cadeira\nTotal de produtos ativos sem estoque: 1`,
    insight: 'Use a conjunção de dois arrays para sinalizar alertas operacionais.'
  },
  {
    id: 'os', label: 'OS & Atividades', file: 'TotalAtividadesOsAbertas.java',
    code: `String[] certOs = {"OS-001", "OS-002", "OS-003"};\nint[] atividades = {2, 4, 1};\nString[] statusOs = {"ABERTA", "CONCLUIDA", "ABERTA"};\n\nint total = 0;\nfor (int i = 0; i < certOs.length; i++) {\n    if ("ABERTA".equals(statusOs[i])) {\n        total += atividades[i];\n    }\n}\nSystem.out.println("Atividades pendentes: " + total);`,
    output: 'Atividades pendentes: 3',
    insight: 'Soma de atividades filtradas por status de ordem de serviço.'
  },
  {
    id: 'mensageria', label: 'Mensageria', file: 'MensagensComMuitasTentativas.java',
    code: `String[] clientes = {"Ana", "Bruno", "Carla"};\nString[] tipos = {"BOAS_VINDAS", "ENTREGA", "NPS"};\nint[] tentativas = {1, 3, 5};\n\nfor (int i = 0; i < clientes.length; i++) {\n    if (tentativas[i] > 2) {\n        System.out.println("Alerta: " + clientes[i] + " (" + tipos[i] + ") -> " + tentativas[i] + " tentativas");\n    }\n}`,
    output: `Alerta: Bruno (ENTREGA) -> 3 tentativas\nAlerta: Carla (NPS) -> 5 tentativas`,
    insight: 'Monitoramento de falhas e excesso de tentativas no canal de envio.'
  },
  {
    id: 'auditoria', label: 'Auditoria', file: 'ContagemAuditoriaParalela.java',
    code: `String[] usuarios = {"aline", "jackson", "guilherme", "aline"};\nString[] operacoes = {"CRIACAO", "EDICAO", "EXCLUSAO", "EDICAO"};\nString[] status = {"SUCESSO", "SUCESSO", "RECUSADO", "SUCESSO"};\n\nint edicoesComSucesso = 0;\nfor (int i = 0; i < usuarios.length; i++) {\n    if ("EDICAO".equals(operacoes[i]) && "SUCESSO".equals(status[i])) {\n        edicoesComSucesso++;\n    }\n}\nSystem.out.println("Edições seguras concluídas: " + edicoesComSucesso);`,
    output: 'Edições seguras concluídas: 2',
    insight: 'Acompanhamento do histórico e integridade operacional do sistema.'
  }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return (
    <section className="p51-domains-gallery">
      <div className="p51-domains-sidebar">
        {DOMAINS.map((d, i) => (
          <button key={d.id} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>{d.label}</button>
        ))}
      </div>
      <div className="p51-domains-content">
        <CodePanel name={item.file} code={item.code} lines={false} />
        <div className="p51-console">
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
    title: 'Arrays paralelos com tamanhos desiguais',
    code: `String[] clientes = {"Ana", "Bruno", "Carla"};\nlong[] valores = {1000L, 2500L}; // falta um elemento!\n\nfor (int i = 0; i < clientes.length; i++) {\n    System.out.println(valores[i]); // crash no índice 2!\n}`,
    symptom: 'ArrayIndexOutOfBoundsException: Index 2 out of bounds for length 2',
    cause: 'O loop usa o tamanho de clientes como limite superior, mas o array de valores é menor, quebrando quando o índice atinge o elemento faltante.',
    fix: 'Valide sempre `if (clientes.length != valores.length)` antes de iniciar qualquer iteração.'
  },
  {
    title: 'Alteração desalinhada (quebra de correspondência)',
    code: `// O programador altera ou ordena apenas um dos arrays:\nString[] clientes = {"Ana", "Bruno"};\nlong[] valores = {2500L, 1000L}; // Trocados em relação ao original!\n\n// Isso liga Ana a 2500 e Bruno a 1000 de forma incorreta.`,
    symptom: 'Exibição de dados errados ou cobranças indevidas sem lançar erros no console.',
    cause: 'O vínculo lógico depende puramente da posição manual. O compilador não sabe que clientes[0] e valores[0] são semanticamente ligados.',
    fix: 'Se você trocar a ordem ou alterar o índice de um array, garanta a mesma alteração nos arrays paralelos correspondentes.'
  },
  {
    title: 'Uso de índice de busca não encontrado (-1)',
    code: `String[] clientes = {"Ana", "Bruno"};\nlong[] valores = {1000L, 2500L};\n\nint index = -1; // não encontrado\nSystem.out.println(valores[index]); // crash!`,
    symptom: 'ArrayIndexOutOfBoundsException: Index -1 out of bounds for length 2',
    cause: 'Se a busca por cliente não encontrou o elemento, o índice permanece como a sentinela -1. Usá-lo diretamente no array de valores lança erro.',
    fix: 'Proteja com `if (indiceEncontrado != -1)` antes de acessar qualquer posição associada.'
  },
  {
    title: 'Esquecer o scanner.nextLine() após nextInt()/nextLong()',
    code: `int qtd = scanner.nextInt();\n// scanner.nextLine(); // FALTANDO!\nString[] nomes = new String[qtd];\nfor (int i = 0; i < qtd; i++) {\n    nomes[i] = scanner.nextLine(); // lê linha vazia!\n}`,
    symptom: 'O primeiro cliente no array é guardado como string vazia ("").',
    cause: 'A quebra de linha do Enter após o número fica pendente no buffer do Scanner, sendo lida pelo próximo nextLine().',
    fix: 'Limpe o buffer chamando `scanner.nextLine();` imediatamente após leituras numéricas.'
  },
  {
    title: 'Comparar String com == em vez de equals()',
    code: `if (statusPedidos[i] == "APROVADO") { ... }`,
    symptom: 'Status correto não é contabilizado e o relatório exibe zero.',
    cause: '`==` avalia a referência de memória em Java, não o conteúdo de caracteres do objeto.',
    fix: 'Use `"APROVADO".equals(statusPedidos[i])`.'
  },
  {
    title: 'Status sem normalização na comparação',
    code: `if ("APROVADO".equals(statusPedidos[i])) { ... } // status digitado como "aprovado"`,
    symptom: 'Entradas válidas em minúsculas ou com espaços extras são descartadas.',
    cause: 'A comparação `equals()` é rígida e exige exatidão de caixa e caracteres.',
    fix: 'Aplique `statusPedidos[i].trim().toUpperCase()` antes de comparar.'
  },
  {
    title: 'Não validar campos obrigatórios e salvar registros nulos/vazios',
    code: `clientes[i] = scanner.nextLine(); // pode ser "" ou "   "`,
    symptom: 'Relatório contém linhas sem cliente ou com valores financeiros negativos.',
    cause: 'Ausência de rotina de consistência na entrada de dados.',
    fix: 'Implemente um laço `do/while` com `isBlank()` e validações numéricas no Scanner.'
  },
  {
    title: 'Achar que arrays paralelos substituem objetos no mundo real',
    code: `// Criando 10 arrays paralelos para modelar um produto...`,
    symptom: 'Código ilegível, difícil de manter e propenso a bugs de alinhamento.',
    cause: 'Arrays paralelos não escalam bem quando a complexidade das entidades cresce.',
    fix: 'Utilize classes e objetos para encapsular dados relacionados de forma íntegra.'
  },
  {
    title: 'Usar equals do lado que pode ser null',
    code: `if (statusPedidos[i].equals("APROVADO")) { ... }`,
    symptom: 'NullPointerException em tempo de execução se o índice for nulo.',
    cause: 'Chamar métodos diretamente em referências nulas.',
    fix: 'Coloque a constante conhecida à esquerda: `"APROVADO".equals(statusPedidos[i])`.'
  },
  {
    title: 'Misturar índice técnico do array com posição amigável ao usuário',
    code: `System.out.println("Erro na posição " + i); // imprime 0`,
    symptom: 'Confusão para o usuário final, que enxerga o zero como uma posição inexistente.',
    cause: 'Acesso zero-indexed do array exposto diretamente na saída.',
    fix: 'Exiba `(i + 1)` para visualização humana e use `i` estritamente para acesso.'
  }
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="p51-errors-clinic">
      <nav className="p51-errors-nav">
        {ERRORS.map((e, i) => (
          <button key={i} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>
            <span>{i + 1}</span>
            <span className="guided-error-label">{e.title}</span>
          </button>
        ))}
      </nav>
      <div className="p51-error-card">
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
        <div className="p51-error-flow">
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
      cmd: `New-Item -ItemType Directory -Force labs\\m1\\aula-051-arrays-paralelos\ncd labs\\m1\\aula-051-arrays-paralelos\nNew-Item Main.java, RelatorioPedidosParalelos.java, ValidarTamanhosParalelos.java, RelatorioComValidacaoTamanho.java, RelatorioPedidosComTotal.java, TotalPedidosAprovados.java, ContagemStatusParalelos.java, BuscarPedidoPorCliente.java, ListarPedidosPorStatus.java, AlterarStatusPorCliente.java, ValidarRegistrosParalelos.java, ValidarRegistrosComDetalhe.java, ProdutosEstoquesParalelos.java, ProdutosSemEstoqueParalelos.java, OrdensServicoParalelas.java, TotalAtividadesOsAbertas.java, MensageriaParalela.java, MensagensComMuitasTentativas.java, AuditoriaParalela.java, ContagemAuditoriaParalela.java, PreencherPedidosParalelos.java, PreencherPedidosParalelosMelhorado.java, ErroTamanhosDiferentes.java, ErroValorDesalinhado.java, ErroStringComIgualIgual.java, ErroBuscaSemValidarPosicao.java, ErroNextLine.java`,
      out: 'Criado com sucesso — 27 arquivos de laboratório para a Aula 051.',
      tip: 'Cada arquivo deve ser populado com o código Java equivalente antes da compilação.'
    },
    {
      title: 'Compilar & Diagnosticar Erros',
      cmd: `javac *.java\njava ErroTamanhosDiferentes\njava ErroValorDesalinhado\njava ErroBuscaSemValidarPosicao`,
      out: `ErroTamanhosDiferentes:\nException in thread "main" java.lang.ArrayIndexOutOfBoundsException\n\nErroValorDesalinhado:\nAna - 2500\nBruno - 1000\n\nErroBuscaSemValidarPosicao:\nException in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index -1`,
      tip: 'Observe a quebra de exceção no índice -1 e no índice out of bounds, bem como a inversão lógica silenciosa de valores.'
    },
    {
      title: 'Validar Relatórios de Sucesso',
      cmd: `java RelatorioComValidacaoTamanho\njava TotalPedidosAprovados\njava ContagemStatusParalelos\njava ValidarRegistrosComDetalhe`,
      out: `RelatorioComValidacaoTamanho:\nAna | 1000 | PENDENTE\nBruno | 2500 | APROVADO\n\nTotalPedidosAprovados:\nPedidos aprovados: 2\nTotal aprovado em centavos: 5500`,
      tip: 'Verifique se a lógica condicional e a barreira de tamanhos estão operando corretamente.'
    },
    {
      title: 'Commit de Fechamento',
      cmd: `git status\ngit add labs/m1/aula-051-arrays-paralelos docs/diario-de-bordo.md\ngit commit -m "Aula 051: pratica arrays paralelos em Java"\ngit status`,
      out: 'working tree clean',
      tip: 'Garante que os arquivos .class não foram adicionados à staging area.'
    }
  ];
  const current = steps[stage];
  const scannerExample = `import java.util.Scanner;

public class PreencherPedidosParalelos {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("Quantidade de pedidos: ");
            int quantidade = scanner.nextInt();
            scanner.nextLine();

            String[] clientes = new String[quantidade];
            long[] valoresCentavos = new long[quantidade];
            String[] status = new String[quantidade];

            for (int i = 0; i < quantidade; i++) {
                System.out.print("Cliente: ");
                clientes[i] = scanner.nextLine().trim();

                System.out.print("Valor em centavos: ");
                valoresCentavos[i] = scanner.nextLong();
                scanner.nextLine();

                System.out.print("Status: ");
                status[i] = scanner.nextLine().trim().toUpperCase();
            }

            boolean tamanhosIguais = clientes.length == valoresCentavos.length
                    && clientes.length == status.length;

            if (!tamanhosIguais) {
                System.out.println("Dados desalinhados.");
                return;
            }

            for (int i = 0; i < clientes.length; i++) {
                System.out.println(clientes[i] + " | "
                        + valoresCentavos[i] + " | " + status[i]);
            }
        }
    }
}`;

  return (
    <section>
      <div className="p51-delivery-nav">
        {steps.map((s, i) => (
          <button key={s.title} type="button" className={stage === i ? 'active' : ''} onClick={() => setStage(i)}>
            <span>{i < stage ? <Check size={11} /> : i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="p51-terminal">
        <header><Terminal size={14} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={14} /> {current.tip}</p>
      </div>
      <div className="p51-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button>
      </div>

      <aside className="guided-note info" style={{ marginTop: '18px' }}>
        <Lightbulb size={20} />
        <div><strong>Exemplo guiado antes do desafio</strong><p>O programa mantém os três arrays sincronizados pelo mesmo índice, limpa o buffer após cada leitura numérica e valida o contrato de tamanhos antes do relatório.</p></div>
      </aside>
      <CodePanel name="PreencherPedidosParalelos.java" code={scannerExample} />

      <section className="guided-challenge" style={{ marginTop: '20px' }}>
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: CadastroPedidosParalelos.java</h3></div>
        <p>Crie <code>CadastroPedidosParalelos.java</code> na pasta da aula. Leia <em>n</em> pedidos do console contendo: cliente (String), valor em centavos (long) e status (String). Armazene-os em arrays paralelos. Faça as seguintes validações e relatórios:</p>
        <ul>
          <li><strong>Validação obrigatória</strong>: Cliente não vazio, valor &gt; 0, status pertencente a PENDENTE, APROVADO, RECUSADO, CANCELADO (utilizar loop do/while com flag booleana de controle).</li>
          <li><strong>Buffer do Scanner</strong>: Chame <code>scanner.nextLine()</code> após ler o valor numérico (long).</li>
          <li><strong>Cálculo do Relatório</strong>: Mostre todos os pedidos cadastrados, a soma de todos os valores e conte quantos pedidos estão "PENDENTE".</li>
          <li><strong>Proteção preventória</strong>: Certifique-se de que a validação de tamanho é executada antes de gerar o relatório final.</li>
        </ul>
      </section>

      <div className="guided-file p51-code" style={{ marginTop: '16px' }}>
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
  if (block.type === 'tabela_sim') return <TabelaParalelaSimulator />;
  if (block.type === 'frag_sim') return <FragilidadeSimulator />;
  if (block.type === 'tamanhos_lab') return <TamanhosLab />;
  if (block.type === 'cond_lab') return <OperacoesCondicionaisLab />;
  if (block.type === 'busca_lab') return <BuscaAlteracaoLab />;
  if (block.type === 'valid_lab') return <ValidadorRegistrosLab />;
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
    id: 'tabela', eyebrow: 'Conceito Base', label: 'Tabela Paralela',
    title: 'Visualizando a relação lógica por meio de índices comuns', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Veja como três arrays distintos caminham lado a lado no mesmo loop:' }, { type: 'tabela_sim' }]
  },
  {
    id: 'fragilidade', eyebrow: 'Riscos Práticos', label: 'Fragilidade e Desalinhamento',
    title: 'O perigo de corromper dados silenciosamente ou lançar exceções', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Simule o desalinhamento lógico de dados ou tamanhos desiguais e observe a consequência:' }, { type: 'frag_sim' }]
  },
  {
    id: 'tamanhos', eyebrow: 'Validação preventiva', label: 'Consistência de Tamanhos',
    title: 'Assegurando a integridade do percurso comparando length', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Simule a barreira preventiva que valida o tamanho dos arrays antes de operar:' }, { type: 'tamanhos_lab' }]
  },
  {
    id: 'condicionais', eyebrow: 'Sumarização', label: 'Operações Condicionais',
    title: 'Cálculos de soma e contadores baseados em status textuais', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Altere o status no filtro e veja os acumuladores atualizando com equals seguro:' }, { type: 'cond_lab' }]
  },
  {
    id: 'busca', eyebrow: 'Manipulação de Dados', label: 'Busca e Alteração',
    title: 'Localizando um cliente pelo nome e editando seu status específico', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Insira um cliente existente e altere seu status correspondente no mesmo índice:' }, { type: 'busca_lab' }]
  },
  {
    id: 'validacao', eyebrow: 'Validação Lógica', label: 'Validador de Registros',
    title: 'Auditando campos cruzados de uma mesma linha conceitual', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Analise os erros lógicos cruzados em lote e exiba mensagens específicas por índice:' }, { type: 'valid_lab' }]
  },
  {
    id: 'dominios', eyebrow: 'Cenários Reais', label: 'Galeria de Domínios',
    title: 'Aplicações de arrays paralelos em fluxos de negócios corporativos', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Navegue pelos domínios operacionais de estoque, ordens de serviço, auditoria e mensageria:' }, { type: 'domains' }]
  },
  {
    id: 'clinica', eyebrow: 'Depuração', label: 'Clínica de Erros',
    title: 'Diagnóstico e resolução das 10 falhas comuns com arrays paralelos', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Estude as armadilhas comuns, seus sintomas em runtime e a correção:' }, { type: 'errors' }]
  },
  {
    id: 'entrega', eyebrow: 'Exercícios locais', label: 'Entrega & Desafio',
    title: 'Criação dos 27 laboratórios em Java e o desafio integrado', duration: '10 min',
    blocks: [{ type: 'lead', text: 'Comande o PowerShell guiado e implemente o desafio CadastroPedidosParalelos:' }, { type: 'delivery' }]
  }
];

// ── Componente Principal ─────────────────────────────
export default function GuidedArrayParallelLesson051({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
    <article className="guided-git-lesson guided-array-parallel-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Layers size={17} /> Arrays Paralelos</span>
          <p className="guided-sequence">051 · M1.31</p>
          <h1>Arrays Paralelos</h1>
          <p>Domine o vínculo por índice para relacionar dados diferentes em arrays separados. Compreenda a utilidade conceitual do modelo de tabelas lógicas, as validações de tamanho de segurança e a inerente fragilidade que abre caminho para a POO.</p>
        </div>
        <div className="guided-hero-status">
          <Layers size={42} />
          <strong>{progress}%</strong>
          <span>{completedLabel}</span>
        </div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula 051" items={[
        { value: 'Mesmo índice', label: 'Vínculo lógico' },
        { value: 'length == length', label: 'Integridade de percurso' },
        { value: 'POO prepara', label: 'Conclusão conceitual' }
      ]} />

      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 051">
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
                <h3>Arrays Paralelos dominados!</h3>
                <p>{lessonComplete ? 'Vínculo por índice, validações e fragilidades consolidados.' : 'Conclua a aula para registrar seu progresso.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 050</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Arrays paralelos consolidados' : allStepsComplete ? 'Use o botão acima' : 'Pratique vínculos por índice, consistência de length e POO'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Próxima Aula'}>
          Aula 052 <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
