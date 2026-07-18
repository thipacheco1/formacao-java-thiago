import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck,
  Check, CheckCircle2, ChevronRight, Clock3, Copy, FileCode2,
  Lightbulb, ListChecks, RotateCcw, Sparkles, Terminal, Text, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedStringArrayLesson.css';

const STORAGE_KEY = 'guided-string-array-lesson-050-progress';

const EVIDENCE = [
  '# Aula 050 — Arrays de String', '',
  '## Fundamentos', '- [ ] Declarei e inicializei `String[] nomes = {"Ana", "Bruno", "Carla"};`', '- [ ] Percebi que `new String[n]` cria posições `null`, NÃO texto vazio', '- [ ] Percorri array de String com for clássico usando `nomes[indice]`', '',
  '## Validação Textual', '- [ ] Usei `isEmpty()` e entendi que `"   ".isEmpty()` retorna `false`', '- [ ] Usei `isBlank()` e entendi que `"   ".isBlank()` retorna `true`', '- [ ] Validei null com `nomes[i] == null || nomes[i].isBlank()` ANTES de chamar método', '',
  '## Comparação Segura', '- [ ] Comparo String com `equals()`, nunca com `==`', '- [ ] Usei constante à esquerda: `"APROVADO".equals(status)` para segurança com null', '- [ ] Usei `equalsIgnoreCase()` para comparação sem diferença de caixa', '',
  '## Normalização', '- [ ] Apliquei `trim()` para remover espaços externos', '- [ ] Apliquei a cadeia `trim().toUpperCase()` antes de comparar status', '- [ ] Normalizei entries do usuário com `scanner.nextLine().trim()`', '',
  '## Domínios Aplicados', '- [ ] Contei status textuais com acumulador e `"APROVADO".equals()`', '- [ ] Validei status inválidos com lista de valores permitidos', '- [ ] Normalizei um array inteiro de status com loop de dois passes', '- [ ] Apliquei em clientes, produtos, pedidos, auditoria, mensageria e filas', '',
  '## Scanner', '- [ ] Lembrei de `scanner.nextLine()` após `nextInt()` para limpar a quebra de linha pendente', '',
  '## Evidências Locais', '- [ ] Criei, compilei e executei os 35 arquivos Java do laboratório', '- [ ] Observei a saída errada de `ErroStringComIgualIgual.java` e corrigi', '- [ ] Observei o crash de `ErroIsBlankEmNull.java` e corrigi', '- [ ] Registrei no diário de bordo os aprendizados desta aula',
  '',
  '## Decisão de Projeto', '- Por que prefiro constante à esquerda no equals?', '- Quando uso isBlank vs isEmpty?'
].join('\n');

// ── Utilidades ──────────────────────────────────────
function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  };
  return <button type="button" className="str50-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file str50-code">
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

function StringArrayBlocks({ array, activeIndex = -1, foundIndexes = [], invalidIndexes = [] }) {
  return (
    <div className="str50-array-view">
      {array.map((val, idx) => {
        let cls = 'str50-cell';
        let valCls = 'str50-cell-val';
        let display = String(val);
        if (val === null) { cls += ' null-cell'; valCls += ' null-val'; display = 'null'; }
        else if (val === '') { valCls += ' empty-val'; display = '""'; }
        else if (val.trim() === '' && val !== '') { valCls += ' blank-val'; display = `"${val}" (branco)`; }
        if (idx === activeIndex) cls += ' active';
        else if (foundIndexes.includes(idx)) cls += ' found';
        else if (invalidIndexes.includes(idx)) cls += ' invalid-status';
        return (
          <div key={idx} className={cls}>
            <div className="str50-cell-idx">[{idx}]</div>
            <div className={valCls}>{display}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── 1. Simulador de Percurso ────────────────────────
function PercursoSimulator() {
  const DEFAULT = ['Ana', 'Bruno', 'Carla'];
  const [array] = useState(DEFAULT);
  const [step, setStep] = useState(-1);
  const [log, setLog] = useState('Clique em Iniciar para percorrer o array.');

  const start = () => { setStep(0); setLog(`índice 0 → "${array[0]}"`); };
  const advance = () => {
    const next = step + 1;
    if (next < array.length) { setStep(next); setLog(`índice ${next} → "${array[next]}"`); }
    else { setStep(-1); setLog('Loop encerrado. Todos os elementos percorridos.'); }
  };
  const reset = () => { setStep(-1); setLog('Clique em Iniciar para percorrer o array.'); };

  const code = `String[] nomes = {"Ana", "Bruno", "Carla"};\n\nfor (int indice = 0; indice < nomes.length; indice++) {\n    System.out.println("Nome " + (indice + 1) + ": " + nomes[indice]);\n}`;
  const out = array.map((n, i) => `Nome ${i + 1}: ${n}`).join('\n');

  return (
    <div className="str50-sim-box">
      <StringArrayBlocks array={array} activeIndex={step} />
      <div className="str50-sim-controls">
        {step === -1 ? <button type="button" className="str50-sim-action" onClick={start}>▶ Iniciar</button> : <button type="button" className="str50-sim-action" onClick={advance}>Próximo →</button>}
        <button type="button" className="str50-sim-action" style={{ background: '#334155' }} onClick={reset}>↺ Reiniciar</button>
      </div>
      <div className="str50-sim-grid">
        <CodePanel name="PercorrendoNomes.java" code={code} lines={false} />
        <div className="str50-console success">
          <header><Terminal size={14} /> Console</header>
          <pre>{out}</pre>
          <p><Lightbulb size={14} /> Atual: {step >= 0 ? log : 'Aguardando...'}</p>
        </div>
      </div>
    </div>
  );
}

// ── 2. Lab de null vs "" vs "  " ────────────────────
function NullVsEmptyLab() {
  const array = [null, '', '   ', 'Ana'];

  return (
    <div className="str50-sim-box">
      <StringArrayBlocks array={array} />

      <table className="str50-matrix-table" style={{ marginTop: '12px' }}>
        <thead>
          <tr>
            <th>Valor</th>
            <th>isEmpty()</th>
            <th>isBlank()</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>null</code></td>
            <td><span className="f">ERRO</span></td>
            <td><span className="f">ERRO</span></td>
            <td><span>Não tem métodos — valide null antes!</span></td>
          </tr>
          <tr>
            <td><code>""</code></td>
            <td><span className="t">true</span></td>
            <td><span className="t">true</span></td>
            <td>Sem caracteres</td>
          </tr>
          <tr>
            <td><code>"   "</code></td>
            <td><span className="f">false</span><span className="exp">Tem 3 chars (espaços)</span></td>
            <td><span className="t">true</span></td>
            <td>isEmpty falha aqui — use isBlank!</td>
          </tr>
          <tr>
            <td><code>"Ana"</code></td>
            <td><span className="f">false</span></td>
            <td><span className="f">false</span></td>
            <td>Texto válido e preenchido</td>
          </tr>
        </tbody>
      </table>

      <div className="str50-sim-grid" style={{ marginTop: '12px' }}>
        <CodePanel name="ValorPadraoNull.java" code={`String[] nomes = new String[4];\n// as posições NÃO são ""\n// todas começam como null!\n\nSystem.out.println(nomes[0]); // null\nSystem.out.println(nomes[1]); // null`} lines={false} />
        <div className="str50-console error">
          <header><Terminal size={14} /> Armadilha do null</header>
          <pre>{`// Código perigoso:\nif (nomes[0].isBlank()) { ... }\n\n// CRASH:\nNullPointerException\n\n// Código seguro:\nif (nomes[0] == null || nomes[0].isBlank()) { ... }`}</pre>
        </div>
      </div>

      <aside className="guided-note warning">
        <AlertTriangle size={20} />
        <div>
          <strong>new String[n] não cria Strings vazias</strong>
          <p>Quando você cria <code>new String[3]</code>, Java preenche as posições com <code>null</code>, não com <code>""</code>. Isso é diferente de <code>new int[3]</code> (que preenche com zeros). Sempre valide <code>null</code> antes de chamar qualquer método.</p>
        </div>
      </aside>
    </div>
  );
}

// ── 3. Lab de equals vs == ──────────────────────────
function EqualsLab() {
  const [modo, setModo] = useState('wrong');

  const codeErrado = `String status = new String("APROVADO"); // força nova referência\n\n// ERRADO: compara referência, não conteúdo\nif (status == "APROVADO") {\n    System.out.println("Aprovado");\n} else {\n    System.out.println("Não aprovado"); // ← Executa aqui!\n}`;
  const codeCorreto = `String status = new String("APROVADO");\n\n// CORRETO: compara conteúdo textual\nif ("APROVADO".equals(status)) {\n    System.out.println("Aprovado"); // ← Executa aqui!\n}`;

  const codeNullErrado = `String status = null;\n\n// Perigoso se status for null:\nif (status.equals("APROVADO")) { // CRASH!\n    ...`;
  const codeNullCorreto = `String status = null;\n\n// Seguro: constante à esquerda\nif ("APROVADO".equals(status)) { // false, sem crash\n    ...`;

  return (
    <div className="str50-sim-box">
      <div className="str50-sim-controls">
        <label>Modo:</label>
        <button type="button" className="str50-sim-action" style={{ background: modo === 'wrong' ? '#dc2626' : '#475569' }} onClick={() => setModo('wrong')}>❌ Comparação com ==</button>
        <button type="button" className="str50-sim-action" style={{ background: modo === 'correct' ? '#16a34a' : '#475569' }} onClick={() => setModo('correct')}>✅ Comparação com equals</button>
        <button type="button" className="str50-sim-action" style={{ background: modo === 'null' ? '#4f46e5' : '#475569' }} onClick={() => setModo('null')}>🛡 Constante à esquerda</button>
      </div>

      {modo === 'wrong' && (
        <div className="str50-sim-grid">
          <CodePanel name="ErroStringComIgualIgual.java" code={codeErrado} lines={false} />
          <div className="str50-console warning">
            <header><Terminal size={14} /> Saída incorreta</header>
            <pre>{'Não aprovado\n\n⚠ O texto é igual, mas == compara\nreferências de objeto, não conteúdo.\nCom new String("APROVADO"), as referências\nsão diferentes!'}</pre>
          </div>
        </div>
      )}
      {modo === 'correct' && (
        <div className="str50-sim-grid">
          <CodePanel name="CorretoEqualsString.java" code={codeCorreto} lines={false} />
          <div className="str50-console success">
            <header><Terminal size={14} /> Saída correta</header>
            <pre>{'Aprovado\n\n✓ equals() compara o conteúdo dos\ncaracteres, não a referência.\nSempre use equals() para String!'}</pre>
          </div>
        </div>
      )}
      {modo === 'null' && (
        <div className="str50-sim-grid">
          <CodePanel name="ConstanteAEsquerda.java" code={`${codeNullErrado}\n\n// vs\n\n${codeNullCorreto}`} lines={false} />
          <div className="str50-console success">
            <header><Terminal size={14} /> Por que constante à esquerda?</header>
            <pre>{'Forma perigosa:\n  status.equals("APROVADO")\n  → NullPointerException se status == null\n\nForma segura:\n  "APROVADO".equals(status)\n  → retorna false se status == null\n\n✓ Código profissional usa constante à esquerda!'}</pre>
          </div>
        </div>
      )}

      <aside className={`guided-note ${modo === 'wrong' ? 'warning' : 'info'}`}>
        {modo === 'wrong' ? <AlertTriangle size={20} /> : <Lightbulb size={20} />}
        <div>
          <strong>{modo === 'wrong' ? 'Por que == falha com String?' : modo === 'correct' ? 'A regra: sempre equals() para String' : 'Constante à esquerda — idioma profissional'}</strong>
          <p>{modo === 'wrong'
            ? 'O operador == em Java compara referências de objetos na memória, não o conteúdo. Duas Strings com o mesmo texto podem estar em endereços diferentes, fazendo == retornar false mesmo com conteúdo idêntico.'
            : modo === 'correct'
            ? 'O método equals() compara os caracteres da String um a um. É o único jeito correto de verificar se dois textos são iguais em Java.'
            : 'Colocar a constante conhecida à esquerda ("APROVADO".equals(status)) garante que, se status for null, não há crash — equals() apenas retorna false. É um hábito de código defensivo amplamente adotado.'}
          </p>
        </div>
      </aside>
    </div>
  );
}

// ── 4. Lab de Normalização ──────────────────────────
function NormalizacaoLab() {
  const [input, setInput] = useState(' aprovado ');
  const trimmed = input.trim();
  const upper = trimmed.toUpperCase();

  const isValid = ['PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO'].includes(upper);

  return (
    <div className="str50-sim-box">
      <div className="str50-sim-controls">
        <label>Texto de entrada (simule digitação com espaços):</label>
        <input
          style={{ flex: '1', padding: '8px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder=" aprovado "
        />
      </div>

      <div className="str50-norm-flow">
        <div className="str50-norm-step">
          <label>Bruto</label>
          <code>"{input}"</code>
        </div>
        <ChevronRight size={18} className="str50-norm-arrow" />
        <div className="str50-norm-step">
          <label>.trim()</label>
          <code>"{trimmed}"</code>
        </div>
        <ChevronRight size={18} className="str50-norm-arrow" />
        <div className="str50-norm-step">
          <label>.toUpperCase()</label>
          <code>"{upper}"</code>
        </div>
      </div>

      <StringArrayBlocks
        array={[' pendente ', 'aprovado', ' RECUSADO ']}
        foundIndexes={[]}
      />

      <div className="str50-sim-grid">
        <CodePanel name="NormalizarStatusArray.java" code={`String[] statusPedidos = {" pendente ", "aprovado", " RECUSADO "};\n\nfor (int i = 0; i < statusPedidos.length; i++) {\n    statusPedidos[i] = statusPedidos[i].trim().toUpperCase();\n}\n\n// resultado: {"PENDENTE", "APROVADO", "RECUSADO"}\n\nfor (int i = 0; i < statusPedidos.length; i++) {\n    System.out.println(statusPedidos[i]);\n}`} lines={false} />
        <div className={`str50-console ${isValid ? 'success' : 'error'}`}>
          <header><Terminal size={14} /> Validação com normalização</header>
          <pre>{`Bruto: "${input}"\ntrim(): "${trimmed}"\ntoUpperCase(): "${upper}"\n\nStatus válido: ${isValid ? '✓ SIM' : '✗ NÃO'}\n\nStatuses permitidos:\nPENDENTE, APROVADO, RECUSADO, CANCELADO`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 5. Lab de Busca Textual ─────────────────────────
function BuscaTextualLab() {
  const array = ['Ana', 'Bruno', 'Carla', null, 'Daniela'];
  const [busca, setBusca] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const normalizedBusca = busca.trim();
  let foundIndex = -1;
  if (normalizedBusca) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === null) continue;
      const match = caseSensitive
        ? normalizedBusca === array[i].trim()
        : normalizedBusca.toUpperCase() === array[i].trim().toUpperCase();
      if (match) { foundIndex = i; break; }
    }
  }

  const code = caseSensitive
    ? `String procurado = "${normalizedBusca}";\nint pos = -1;\n\nfor (int i = 0; i < nomes.length; i++) {\n    if (nomes[i] == null) continue;\n    if (procurado.equals(nomes[i].trim())) {\n        pos = i;\n        break;\n    }\n}`
    : `String procurado = "${normalizedBusca}";\nString procNorm = procurado.trim().toUpperCase();\nint pos = -1;\n\nfor (int i = 0; i < nomes.length; i++) {\n    if (nomes[i] == null) continue;\n    String nomeNorm = nomes[i].trim().toUpperCase();\n    if (procNorm.equals(nomeNorm)) {\n        pos = i;\n        break;\n    }\n}`;

  return (
    <div className="str50-sim-box">
      <StringArrayBlocks array={array} foundIndexes={foundIndex >= 0 ? [foundIndex] : []} />
      <div className="str50-sim-controls">
        <label>Buscar:</label>
        <input
          style={{ padding: '7px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.85rem', fontFamily: 'Consolas' }}
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Ex: bruno"
        />
        <button type="button" className="str50-sim-action" style={{ background: caseSensitive ? '#4f46e5' : '#334155' }} onClick={() => setCaseSensitive(c => !c)}>
          {caseSensitive ? 'Case-Sensitive' : 'Case-Insensitive'}
        </button>
      </div>
      <div className="str50-sim-grid">
        <CodePanel name={caseSensitive ? 'BuscaNomeEquals.java' : 'BuscarNomeNormalizado.java'} code={code} lines={false} />
        <div className={`str50-console ${foundIndex >= 0 ? 'success' : busca ? 'error' : ''}`}>
          <header><Terminal size={14} /> Resultado</header>
          <pre>{busca ? foundIndex >= 0 ? `Encontrado na posição ${foundIndex + 1}\n(índice ${foundIndex})\nValor: "${array[foundIndex]}"` : 'Não encontrado — sentinela retorna -1' : 'Digite um nome para buscar...'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 6. Lab de Status ────────────────────────────────
function StatusLab() {
  const [statusArr] = useState(['PENDENTE', 'APROVADO', 'RECUSADO', 'APROVADO', 'PENDENTE']);
  const VALIDOS = ['PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO'];

  let pendentes = 0, aprovados = 0, recusados = 0, desconhecidos = 0;
  const invalidIndexes = [];
  statusArr.forEach((s, i) => {
    if ('PENDENTE' === s) pendentes++;
    else if ('APROVADO' === s) aprovados++;
    else if ('RECUSADO' === s) recusados++;
    else { desconhecidos++; invalidIndexes.push(i); }
    if (!VALIDOS.includes(s)) invalidIndexes.push(i);
  });

  const code = `String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO", "APROVADO", "PENDENTE"};\n\nint pendentes = 0, aprovados = 0, recusados = 0, desconhecidos = 0;\n\nfor (int i = 0; i < statusPedidos.length; i++) {\n    if ("PENDENTE".equals(statusPedidos[i])) {\n        pendentes++;\n    } else if ("APROVADO".equals(statusPedidos[i])) {\n        aprovados++;\n    } else if ("RECUSADO".equals(statusPedidos[i])) {\n        recusados++;\n    } else {\n        desconhecidos++;\n    }\n}`;

  return (
    <div className="str50-sim-box">
      <StringArrayBlocks array={statusArr} />
      <div className="str50-sim-grid" style={{ marginTop: '12px' }}>
        <CodePanel name="RelatorioStatusPedidos.java" code={code} lines={false} />
        <div className="str50-console success">
          <header><Terminal size={14} /> Console</header>
          <pre>{`Pendentes:    ${pendentes}\nAprovados:    ${aprovados}\nRecusados:    ${recusados}\nDesconhecidos: ${desconhecidos}\n\n✓ "APROVADO".equals(status)\n  é mais seguro que status.equals("APROVADO")\n  pois funciona mesmo se status for null.`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 7. Galeria de Domínios ──────────────────────────
const DOMAINS = [
  {
    id: 'clientes', label: 'Clientes', file: 'ClientesArray.java',
    code: `String[] clientes = {"Maria", "João", "Ana"};\n\nfor (int i = 0; i < clientes.length; i++) {\n    System.out.println("Cliente " + (i + 1) + ": " + clientes[i]);\n}`,
    output: `Cliente 1: Maria\nCliente 2: João\nCliente 3: Ana`,
    insight: 'Lista de nomes de clientes — o padrão mais simples de array de String.'
  },
  {
    id: 'status', label: 'Pedidos (status)', file: 'ContarStatusAprovado.java',
    code: `String[] statusPedidos = {"PENDENTE", "APROVADO", "RECUSADO", "APROVADO"};\n\nint aprovados = 0;\nfor (int i = 0; i < statusPedidos.length; i++) {\n    if ("APROVADO".equals(statusPedidos[i])) {\n        aprovados++;\n    }\n}\nSystem.out.println("Pedidos aprovados: " + aprovados);`,
    output: 'Pedidos aprovados: 2',
    insight: 'Constante à esquerda garante segurança mesmo com null no array.'
  },
  {
    id: 'auditoria', label: 'Auditoria (usuários)', file: 'AuditoriaUsuariosArray.java',
    code: `String[] usuarios = {"thiago", "aline", "JACKSON", "Guilherme"};\n\nfor (int i = 0; i < usuarios.length; i++) {\n    usuarios[i] = usuarios[i].trim().toLowerCase();\n}\n\nfor (int i = 0; i < usuarios.length; i++) {\n    System.out.println("Usuário: " + usuarios[i]);\n}`,
    output: `Usuário: thiago\nUsuário: aline\nUsuário: jackson\nUsuário: guilherme`,
    insight: 'Normalizar usuários para minúsculo facilita busca, comparação e log de auditoria.'
  },
  {
    id: 'mensageria', label: 'Mensageria (tipos)', file: 'MensageriaTiposArray.java',
    code: `String[] tiposMensagem = {"BOAS_VINDAS", "ENTREGA", "NPS", "ENTREGA"};\n\nint entregas = 0;\nfor (int i = 0; i < tiposMensagem.length; i++) {\n    if ("ENTREGA".equals(tiposMensagem[i])) {\n        entregas++;\n    }\n}\nSystem.out.println("Mensagens de entrega: " + entregas);`,
    output: 'Mensagens de entrega: 2',
    insight: 'Contagem de tipos de mensagem é o padrão típico para sistemas de mensageria.'
  },
  {
    id: 'filas', label: 'Filas (validação)', file: 'ValidarFilaAtendimento.java',
    code: `String[] filas = {"Entrada", "Reagendamento", "XYZ"};\n\nfor (int i = 0; i < filas.length; i++) {\n    String filaNorm = filas[i].trim().toUpperCase();\n    boolean valida = "ENTRADA".equals(filaNorm)\n        || "REAGENDAMENTO".equals(filaNorm)\n        || "SEM CAPACITY".equals(filaNorm);\n\n    if (!valida) {\n        System.out.println("Fila inválida [" + (i+1) + "]: " + filas[i]);\n    }\n}`,
    output: 'Fila inválida [3]: XYZ',
    insight: 'Normalização + lista de valores permitidos é o padrão para validação de enum textual.'
  },
  {
    id: 'buscarAlterar', label: 'Buscar & Alterar', file: 'BuscarEAlterarStatus.java',
    code: `String[] statusPedidos = {"PENDENTE", "PENDENTE", "APROVADO"};\n\nString procurado = "PENDENTE";\nint pos = -1;\n\nfor (int i = 0; i < statusPedidos.length; i++) {\n    if (procurado.equals(statusPedidos[i])) {\n        pos = i;\n        break;\n    }\n}\n\nif (pos != -1) {\n    String antigo = statusPedidos[pos];\n    statusPedidos[pos] = "APROVADO";\n    System.out.println("Alterado [" + (pos+1) + "]: " + antigo + " → " + statusPedidos[pos]);\n}`,
    output: 'Alterado [1]: PENDENTE → APROVADO',
    insight: 'Busca com sentinela −1 combinada com alteração de posição — padrão de update textual.'
  }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return (
    <section className="str50-domains-gallery">
      <div className="str50-domains-sidebar">
        {DOMAINS.map((d, i) => (
          <button key={d.id} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>{d.label}</button>
        ))}
      </div>
      <div className="str50-domains-content">
        <CodePanel name={item.file} code={item.code} lines={false} />
        <div className="str50-console">
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
    title: 'Comparar String com == em vez de equals',
    code: `String status = new String("APROVADO");\n\nif (status == "APROVADO") {  // ERRADO!\n    System.out.println("Aprovado");\n} else {\n    System.out.println("Não aprovado"); // ← executa incorretamente\n}`,
    symptom: 'Não aprovado (resultado incorreto — o conteúdo é igual!)',
    cause: '`==` compara referências de objeto na memória heap. `new String("APROVADO")` cria um objeto diferente, por isso as referências diferem mesmo com conteúdo idêntico.',
    fix: 'Sempre use `"APROVADO".equals(status)` para comparar conteúdo textual em Java.'
  },
  {
    title: 'Chamar isBlank() em posição null (NullPointerException)',
    code: `String[] nomes = new String[3]; // posições = null\n\n// CRASH: nomes[0] é null, não tem método!\nif (nomes[0].isBlank()) {\n    System.out.println("Nome em branco");\n}`,
    symptom: 'java.lang.NullPointerException: Cannot invoke "String.isBlank()"',
    cause: '`new String[n]` preenche as posições com `null`, não com `""`. Chamar qualquer método em `null` lança NullPointerException.',
    fix: 'Valide null primeiro: `if (nomes[0] == null || nomes[0].isBlank())`. O curto-circuito `||` impede a execução de `isBlank()` quando é null.'
  },
  {
    title: 'Confundir isEmpty com isBlank para campos obrigatórios',
    code: `String nome = "   "; // usuário digitou só espaços\n\n// Parace certo, mas falha!\nif (nome.isEmpty()) {\n    System.out.println("Nome obrigatório");\n}\n// isEmpty retorna false! 3 espaços são 3 caracteres.`,
    symptom: 'Nome com espaços passa pela validação como se fosse preenchido.',
    cause: '`isEmpty()` retorna `true` apenas se `length() == 0`. Espaços são caracteres, então `"   ".isEmpty() == false`.',
    fix: 'Use `isBlank()` para campos obrigatórios: `"   ".isBlank() == true`. Ele detecta texto vazio ou composto apenas por espaços.'
  },
  {
    title: 'Não usar trim em entrada do usuário',
    code: `nomes[i] = scanner.nextLine(); // sem trim!\n\n// Usuário digitou "  Ana  "\n// array guarda "  Ana  "\n\n// Comparação falha:\nif ("Ana".equals(nomes[i])) { ... } // false!`,
    symptom: 'Nomes com espaços extras causam falha em comparações e inconsistência nos dados.',
    cause: 'O Scanner lê o texto exatamente como digitado. Espaços antes e depois são preservados, quebrando comparações com equals.',
    fix: 'Normalize na entrada: `nomes[i] = scanner.nextLine().trim();`. Assim o array guarda o texto limpo.'
  },
  {
    title: 'Não normalizar status antes de comparar',
    code: `String status = " aprovado "; // entrada crua\n\nif ("APROVADO".equals(status)) { // false!\n    System.out.println("Aprovado");\n}`,
    symptom: 'Status válido não é reconhecido por diferença de caixa ou espaços.',
    cause: '`equals()` faz comparação exata. `" aprovado "` ≠ `"APROVADO"` por causa de espaços e minúsculas.',
    fix: 'Normalize antes de comparar: `String normalizado = status.trim().toUpperCase(); "APROVADO".equals(normalizado);`'
  },
  {
    title: 'Esquecer scanner.nextLine() após nextInt()',
    code: `int qtd = scanner.nextInt();\n// scanner.nextLine(); ← linha obrigatória aqui!\n\nfor (int i = 0; i < qtd; i++) {\n    nomes[i] = scanner.nextLine(); // 1ª leitura pega ""\n}`,
    symptom: 'O primeiro nome do array vem vazio — a leitura lê a quebra de linha do nextInt.',
    cause: '`nextInt()` lê o número mas deixa `"\\n"` (Enter) no buffer. O próximo `nextLine()` lê essa quebra pendente e retorna string vazia.',
    fix: 'Adicione `scanner.nextLine();` imediatamente após `nextInt()` para consumir a quebra de linha antes de ler o texto.'
  },
  {
    title: 'Usar equals do lado que pode ser null',
    code: `String status = null; // pode vir de array não preenchido\n\n// CRASH se status for null:\nif (status.equals("APROVADO")) { // NullPointerException!\n    ...\n}`,
    symptom: 'NullPointerException em tempo de execução quando o status não foi preenchido.',
    cause: '`status` é `null`. Chamar `.equals()` em `null` lança exceção porque não há objeto para invocar o método.',
    fix: 'Inverta a ordem: `"APROVADO".equals(status)`. A constante nunca é null, então é seguro chamar equals nela passando qualquer valor, inclusive null.'
  },
  {
    title: 'Achar que new String[n] cria Strings vazias',
    code: `String[] nomes = new String[3];\n\n// Expectativa errada:\n// nomes[0] = "", nomes[1] = "", nomes[2] = ""\n\n// Realidade:\n// nomes[0] = null, nomes[1] = null, nomes[2] = null`,
    symptom: 'NullPointerException ao tentar usar métodos nas posições logo após criação.',
    cause: 'Java inicializa arrays de objetos com `null`, não com uma instância vazia. `""` é uma String diferente de `null`.',
    fix: 'Preencha as posições explicitamente ou valide null antes de qualquer operação. Se precisar de vazio: `Arrays.fill(nomes, "");`'
  },
  {
    title: 'Não validar textos antes de salvar (campos obrigatórios)',
    code: `nomes[indice] = scanner.nextLine();\n// Pode salvar "" ou "   " sem perceber`,
    symptom: 'Array com posições em branco ou só com espaços, causando dados inconsistentes.',
    cause: 'Sem validação, qualquer entrada — incluindo textos em branco — é aceita e salva.',
    fix: 'Use `do/while` com validação: `do { nomes[i] = scanner.nextLine().trim(); } while (nomes[i].isBlank());`'
  },
  {
    title: 'Misturar índice técnico com posição do usuário',
    code: `// Para mostrar ao usuário:\nSystem.out.println("Posição " + indice); // exibe 0, 1, 2...\n\n// Usuário espera: 1, 2, 3...`,
    symptom: 'Usuário vê posição 0 onde deveria ver posição 1, gerando confusão na interface.',
    cause: 'Arrays são zero-indexed (começa em 0) mas humanos contam a partir de 1.',
    fix: 'Para exibir ao usuário: `(indice + 1)`. Para acessar o array: `indice`. Mantenha essa distinção sempre.'
  }
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="str50-errors-clinic">
      <nav className="str50-errors-nav">
        {ERRORS.map((e, i) => (
          <button key={i} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>
            <span>{i + 1}</span>
            <span className="guided-error-label">{e.title}</span>
          </button>
        ))}
      </nav>
      <div className="str50-error-card">
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
        <div className="str50-error-flow">
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
      cmd: `New-Item -ItemType Directory -Force labs\\m1\\aula-050-arrays-string\ncd labs\\m1\\aula-050-arrays-string\nNew-Item Main.java, PercorrendoNomes.java, CriandoArrayString.java, ArrayStringComNull.java, IsEmptyVsIsBlank.java, BuscaNomeEquals.java, PreencherNomesConsole.java, ValidarNomesArray.java, NomesComTamanhoUsuario.java, ClientesArray.java, ProdutosArray.java, StatusPedidosArray.java, ContarStatusAprovado.java, RelatorioStatusPedidos.java, ValidarStatusPedidos.java, NormalizarStatusArray.java, BuscarStatusArray.java, BuscarNomeNormalizado.java, BuscarNomeEqualsIgnoreCase.java, PrimeiroTextoEmBranco.java, ValidarTodosOsNomes.java, AuditoriaUsuariosArray.java, MensageriaTiposArray.java, FilasAtendimentoArray.java, ValidarFilaAtendimento.java, RelatorioStatusInvalidos.java, RelatorioStatusInvalidosMelhorado.java, AlterarNomeArray.java, BuscarEAlterarStatus.java, ErroStringComIgualIgual.java, ErroIsBlankEmNull.java, ErroIsEmptyComEspacos.java, ErroSemTrim.java, ErroNextIntNextLine.java`,
      out: 'Criado com sucesso — 34 arquivos de laboratório para a Aula 050.',
      tip: 'Preencha cada arquivo com o código da aula antes de compilar.'
    },
    {
      title: 'Observar Erros Propositais',
      cmd: `javac ErroStringComIgualIgual.java && java ErroStringComIgualIgual\njavac ErroIsBlankEmNull.java && java ErroIsBlankEmNull`,
      out: `ErroStringComIgualIgual:\nNão aprovado (embora o texto seja igual!)\n\nErroIsBlankEmNull:\nException in thread "main" java.lang.NullPointerException`,
      tip: 'Observe os bugs. Depois corrija == por equals e adicione a verificação de null.'
    },
    {
      title: 'Compilar e Executar',
      cmd: `javac *.java\njava IsEmptyVsIsBlank\njava ContarStatusAprovado\njava NormalizarStatusArray\njava BuscaNomeNormalizado`,
      out: `IsEmptyVsIsBlank:\nvazio.isEmpty(): true | vazio.isBlank(): true\nespacos.isEmpty(): false | espacos.isBlank(): true\n\nContarStatusAprovado: Pedidos aprovados: 2\nNormalizarStatusArray: PENDENTE / APROVADO / RECUSADO`,
      tip: 'Confirme que NormalizarStatusArray exibe os 3 status em maiúsculas sem espaços.'
    },
    {
      title: 'Commit Git',
      cmd: `git status\ngit add labs/m1/aula-050-arrays-string docs/diario-de-bordo.md\ngit commit -m "Aula 050: pratica arrays de String em Java"\ngit status`,
      out: 'working tree clean',
      tip: 'Confirme que nenhum .class aparece no git status. Se sim, verifique .gitignore.'
    }
  ];
  const current = steps[stage];
  const scannerExample = `import java.util.Scanner;

public class PreencherNomesConsole {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("Quantidade de nomes: ");
            int quantidade = scanner.nextInt();
            scanner.nextLine(); // consome o Enter deixado por nextInt

            String[] nomes = new String[quantidade];

            for (int i = 0; i < nomes.length; i++) {
                String nome;
                do {
                    System.out.print("Nome " + (i + 1) + ": ");
                    nome = scanner.nextLine().trim();
                    if (nome.isBlank()) {
                        System.out.println("Nome obrigatório. Tente novamente.");
                    }
                } while (nome.isBlank());

                nomes[i] = nome.toLowerCase();
            }

            for (int i = 0; i < nomes.length; i++) {
                System.out.println((i + 1) + " - " + nomes[i]);
            }
        }
    }
}`;

  return (
    <section>
      <div className="str50-delivery-nav">
        {steps.map((s, i) => (
          <button key={s.title} type="button" className={stage === i ? 'active' : ''} onClick={() => setStage(i)}>
            <span>{i < stage ? <Check size={11} /> : i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="str50-terminal">
        <header><Terminal size={14} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={14} /> {current.tip}</p>
      </div>
      <div className="str50-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button>
      </div>

      <aside className="guided-note info" style={{ marginTop: '18px' }}>
        <Lightbulb size={20} />
        <div><strong>Exemplo guiado antes do desafio</strong><p>Observe a ordem: ler a quantidade, limpar o buffer, validar após o trim, armazenar somente texto válido e então exibir posições amigáveis.</p></div>
      </aside>
      <CodePanel name="PreencherNomesConsole.java" code={scannerExample} />

      <section className="guided-challenge" style={{ marginTop: '20px' }}>
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: CadastroResponsaveis.java</h3></div>
        <p>Crie <code>CadastroResponsaveis.java</code> em <code>labs/m1/aula-050-arrays-string/</code>. Leia <em>n</em> nomes de responsáveis via Scanner (n definido pelo usuário). Para cada nome: aplique <code>trim()</code>, rejeite nomes em branco com do/while e armazene normalizado (trim + toLowerCase). Ao final, liste todos os responsáveis numerados e conte quantos têm nome com menos de 3 caracteres após o trim (campos suspeitos).</p>
        <h4>Critérios de aceite</h4>
        <ul>
          <li>Usar <code>scanner.nextLine()</code> após <code>nextInt()</code> para limpar o buffer.</li>
          <li>Validar obrigatoriedade com <code>do/while + isBlank()</code>.</li>
          <li>Guardar texto normalizado no array (<code>trim().toLowerCase()</code>).</li>
          <li>Exibir relatório com posição (índice + 1) e contar suspeitos.</li>
          <li>Fechar o Scanner ao final com <code>scanner.close()</code>.</li>
        </ul>
      </section>

      <div className="guided-file str50-code" style={{ marginTop: '16px' }}>
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
  if (block.type === 'percurso') return <PercursoSimulator />;
  if (block.type === 'null_lab') return <NullVsEmptyLab />;
  if (block.type === 'equals_lab') return <EqualsLab />;
  if (block.type === 'norm_lab') return <NormalizacaoLab />;
  if (block.type === 'busca_lab') return <BuscaTextualLab />;
  if (block.type === 'status_lab') return <StatusLab />;
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
    id: 'percurso', eyebrow: 'Visão Geral', label: 'Percorrendo Array de String',
    title: 'Visualizando como cada posição armazena um texto', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Percorra o array passo a passo e veja como o for clássico funciona para textos:' }, { type: 'percurso' }]
  },
  {
    id: 'null', eyebrow: 'null vs "" vs "  "', label: 'Valor Padrão e Armadilha do null',
    title: 'Por que new String[n] cria null, não texto vazio — e como se proteger', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Compare os quatro estados de uma String e entenda a armadilha de chamar métodos em null:' }, { type: 'null_lab' }]
  },
  {
    id: 'equals', eyebrow: 'Comparação Textual', label: 'equals vs == e Constante à Esquerda',
    title: 'A regra mais importante de String em Java: nunca compare com ==', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Explore o bug do == e o padrão profissional de constante à esquerda:' }, { type: 'equals_lab' }]
  },
  {
    id: 'normalizacao', eyebrow: 'Normalização', label: 'trim, toUpperCase, toLowerCase',
    title: 'Padronizando texto antes de comparar ou armazenar — o ciclo de normalização', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Edite a entrada e veja o efeito de trim → toUpperCase em tempo real:' }, { type: 'norm_lab' }]
  },
  {
    id: 'busca', eyebrow: 'Busca Textual', label: 'Busca com equals e equalsIgnoreCase',
    title: 'Localizando textos em array com sentinela -1 e normalização', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Busque nomes com e sem diferença de caixa — observe o impacto do null no array:' }, { type: 'busca_lab' }]
  },
  {
    id: 'status', eyebrow: 'Relatório de Status', label: 'Contando e Validando Status',
    title: 'Acumulando contadores de status textuais com equals seguro', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Veja o relatório de status de pedidos gerado com acumuladores e constantes à esquerda:' }, { type: 'status_lab' }]
  },
  {
    id: 'dominios', eyebrow: 'Prática Corporativa', label: 'Galeria de Domínios',
    title: 'Arrays de String aplicados em 6 cenários reais de backend Java', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Explore clientes, pedidos, auditoria, mensageria, filas e busca+alteração de status:' }, { type: 'domains' }]
  },
  {
    id: 'clinica', eyebrow: 'Depuração', label: 'Clínica de Erros',
    title: 'Diagnosticando as 10 falhas mais comuns com arrays de String', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Examine cada armadilha, seu sintoma e a correção definitiva:' }, { type: 'errors' }]
  },
  {
    id: 'entrega', eyebrow: 'Entrega Final', label: 'Entrega & Desafio',
    title: 'Criando o laboratório local com 34 arquivos e o desafio CadastroResponsaveis', duration: '10 min',
    blocks: [{ type: 'lead', text: 'Crie o diretório, observe os bugs propositais e implemente o desafio completo:' }, { type: 'delivery' }]
  }
];

// ── Componente Principal ─────────────────────────────
export default function GuidedStringArrayLesson050({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
    <article className="guided-git-lesson guided-string-array-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Text size={17} /> Arrays de String</span>
          <p className="guided-sequence">050 · M1.30</p>
          <h1>Arrays de String</h1>
          <p>Domine listas de texto em Java: criação, percurso, validação com <code>isEmpty</code> e <code>isBlank</code>, comparação segura com <code>equals</code>, normalização com <code>trim/toUpperCase</code>, busca textual e tratamento da armadilha do <code>null</code>.</p>
        </div>
        <div className="guided-hero-status">
          <Text size={42} />
          <strong>{progress}%</strong>
          <span>{completedLabel}</span>
        </div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula 050" items={[
        { value: 'equals()', label: 'comparação textual' },
        { value: 'isBlank()', label: 'campo obrigatório' },
        { value: 'null ≠ ""', label: 'valor padrão' }
      ]} />

      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 050">
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
                <h3>Arrays de String dominados!</h3>
                <p>{lessonComplete ? 'Comparação, normalização e validação textual consolidadas.' : 'Conclua a aula para registrar seu progresso.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 049</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Arrays de String consolidados' : allStepsComplete ? 'Use o botão acima' : 'Pratique equals, isBlank, trim e normalização'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Arrays Paralelos'}>
          Aula 051 <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
