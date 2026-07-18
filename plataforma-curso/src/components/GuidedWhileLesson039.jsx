import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2,
  ChevronRight, Clock3, Copy, FileCode2, Lightbulb, ListChecks, RefreshCw,
  RotateCcw, Search, Sparkles, Terminal, Variable, Wrench, Zap
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedWhileLesson.css';

const STORAGE_KEY = 'guided-while-lesson-039-progress';

const EVIDENCE = [
  '# Aula 039 — While', '',
  '## Estrutura e Fluxo', '- [ ] Identifiquei as três partes do while: inicialização, condição e atualização', '- [ ] Demonstrei que while pode executar zero vezes (condição inicial falsa)', '- [ ] Criei while crescente (contador++) e decrescente (contador--)', '',
  '## Acumulador e Contador', '- [ ] Usei acumulador para somar valores dentro de um while', '- [ ] Diferenciei contador (controla o loop) de acumulador (guarda valor)', '',
  '## Padrões Corporativos', '- [ ] Implementei menu com while + switch + valor sentinela 0', '- [ ] Limitei tentativas com while (tentativas < limite)', '- [ ] Processei lote contando registros com erro separadamente', '- [ ] Validei entrada enquanto inválida com while (quantidade <= 0)', '- [ ] Modelei paginação: while (pagina <= total)', '- [ ] Modelei mensageria: while (pendentes > 0)', '',
  '## Segurança e Escopo', '- [ ] Identifiquei e corrigi loop infinito (falta de atualização)', '- [ ] Declarei variáveis fora do while quando precisei após o loop', '- [ ] Evitei uso excessivo de break/continue nas condições de parada',
  '',
  '## Decisão de Projeto', '- O que garante que o meu while vai terminar em todos os casos:', '- Quando prefiro condição composta (&&) em vez de if interno:'
].join('\n');

const LOOP_MODES = [
  { id: 'asc', label: 'Crescente (1 a 5)', init: 1, limit: 5, direction: 1, cond: 'contador <= 5', update: 'contador++' },
  { id: 'desc', label: 'Decrescente (5 a 1)', init: 5, limit: 1, direction: -1, cond: 'contador >= 1', update: 'contador--' },
  { id: 'zero', label: 'Zero iterações (10 <= 5)', init: 10, limit: 5, direction: 1, cond: 'contador <= 5', update: 'contador++' }
];

function FlowAnimatorLab() {
  const [modeId, setModeId] = useState('asc');
  const [running, setRunning] = useState(false);
  const [iteração, setIteracao] = useState(0);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'cond_true' | 'block' | 'cond_false' | 'done'
  const [contador, setContador] = useState(null);
  const timerRef = useRef(null);

  const mode = LOOP_MODES.find(m => m.id === modeId);

  const reset = () => {
    window.clearTimeout(timerRef.current);
    setRunning(false); setIteracao(0); setPhase('idle'); setContador(null);
  };

  const condMet = (c) => {
    if (mode.id === 'asc' || mode.id === 'zero') return c <= mode.limit;
    return c >= mode.limit;
  };

  useEffect(() => { reset(); }, [modeId]);

  const tick = (currentVal, currentIter) => {
    const met = condMet(currentVal);
    if (!met) {
      setPhase('cond_false'); setRunning(false); return;
    }
    setPhase('cond_true');
    timerRef.current = window.setTimeout(() => {
      setPhase('block');
      timerRef.current = window.setTimeout(() => {
        const nextVal = currentVal + mode.direction;
        const nextIter = currentIter + 1;
        setContador(nextVal); setIteracao(nextIter);
        tick(nextVal, nextIter);
      }, 700);
    }, 700);
  };

  const start = () => {
    if (running) return;
    const initial = mode.init;
    setContador(initial); setIteracao(0); setRunning(true); setPhase('cond_true');
    if (!condMet(initial)) { setPhase('cond_false'); setRunning(false); return; }
    timerRef.current = window.setTimeout(() => {
      setPhase('block');
      timerRef.current = window.setTimeout(() => {
        const next = initial + mode.direction;
        setContador(next); setIteracao(1);
        tick(next, 1);
      }, 700);
    }, 700);
  };

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const displayContador = contador !== null ? contador : mode.init;
  const isCond = phase === 'cond_true' || phase === 'cond_false';
  const isBlock = phase === 'block';
  const condResult = phase === 'cond_true' ? 'true' : phase === 'cond_false' ? 'false' : '?';

  return (
    <section className="wh39-animator">
      <div className="wh39-animator-controls">
        <label htmlFor="wh39-mode-select">Modo:</label>
        <select id="wh39-mode-select" value={modeId} onChange={e => { reset(); setModeId(e.target.value); }}>
          {LOOP_MODES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
        <div className="wh39-anim-btn" style={{ marginLeft: 'auto' }}>
          <button type="button" className="run" onClick={start} disabled={running}>▶ Simular</button>
          <button type="button" className="reset" onClick={reset} disabled={running}><RefreshCw size={14} /> Reset</button>
        </div>
      </div>

      <div className="wh39-animator-body">
        <div className="wh39-flow-area">
          <div className="wh39-step" style={{ background: '#f0fdf4', border: '2px solid #a7f3d0', fontSize: '.7rem', fontWeight: 'bold', color: '#065f46' }}>
            <span className="wh39-step-icon">①</span>
            <span>Inicialização: <code>int contador = {mode.init};</code></span>
          </div>
          <div className={`wh39-step condition ${isCond ? (phase === 'cond_true' ? 'evaluating' : 'false') : ''}`}>
            <span className="wh39-step-icon" style={{ background: isCond ? '#059669' : '#e2e8f0', color: isCond ? '#fff' : '#475569' }}>②</span>
            <span><code>while ({mode.cond})</code> → {isCond ? condResult : '...'}</span>
          </div>
          {condResult !== 'false' && (
            <div className={`wh39-step block ${isBlock ? 'executing' : ''}`}>
              <span className="wh39-step-icon" style={{ background: isBlock ? '#0284c7' : '#e2e8f0', color: isBlock ? '#fff' : '#475569' }}>③</span>
              <span>Bloco: <code>System.out.println(contador);</code></span>
            </div>
          )}
          <div className={`wh39-step block ${isBlock ? 'executing' : ''}`}>
            <span className="wh39-step-icon" style={{ background: isBlock ? '#0284c7' : '#e2e8f0', color: isBlock ? '#fff' : '#475569' }}>④</span>
            <span>Atualização: <code>{mode.update};</code></span>
          </div>
          {phase === 'cond_false' && (
            <div className="wh39-step" style={{ border: '2px solid #dc2626', background: '#fff5f5', color: '#dc2626', fontWeight: 'bold' }}>
              <span className="wh39-step-icon" style={{ background: '#dc2626', color: '#fff' }}>⑤</span>
              <span>Condição false → sai do while</span>
            </div>
          )}
        </div>

        <div className="wh39-flow-info">
          <div className="wh39-var-display">
            <p>// Estado atual</p>
            <p className={phase === 'cond_false' ? 'cond-false' : 'cond-true'}>
              <strong>contador = {displayContador}</strong>
            </p>
            <p className={phase === 'cond_false' ? 'cond-false' : 'cond-true'}>
              <strong>condição = {isCond || phase === 'done' ? condResult : '...'}</strong>
            </p>
          </div>
          <div className="wh39-iter-badge">
            Iteração atual: <strong>{iteração}</strong>
          </div>
          {phase === 'cond_false' && (
            <div style={{ padding: '10px', background: '#fff5f5', border: '1px solid #fecdd3', borderRadius: '10px', fontSize: '.7rem', color: '#9f1239', lineHeight: 1.5 }}>
              {mode.id === 'zero'
                ? '⚠ Condição já era falsa no início. While não executou nenhuma vez!'
                : `✓ Loop encerrado após ${iteração} iteração${iteração === 1 ? '' : 'ões'}.`
              }
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AccumulatorLab() {
  const totalItems = 5;
  const [step, setStep] = useState(0);

  const rows = [];
  let c = 0, t = 0;
  for (let i = 1; i <= totalItems; i++) {
    c = i; t += i;
    rows.push({ iter: i, contador: c, total: t });
  }

  const advance = () => { if (step < totalItems) setStep(step + 1); };
  const reset = () => setStep(0);

  return (
    <section className="wh39-acc-lab">
      <div className="wh39-acc-history">
        <div className="wh39-acc-row header">
          <span>Iteração</span><span>contador</span><span>total +=</span>
        </div>
        {rows.map((row) => (
          <div key={row.iter} className={`wh39-acc-row ${step >= row.iter ? (step === row.iter ? 'active' : '') : ''}`}>
            <span>{row.iter}</span>
            <span>{step >= row.iter ? row.contador : '—'}</span>
            <span>{step >= row.iter ? row.total : '—'}</span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button type="button" onClick={advance} disabled={step >= totalItems} style={{ flex: 1, padding: '8px', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '.72rem', cursor: step >= totalItems ? 'not-allowed' : 'pointer', opacity: step >= totalItems ? .5 : 1 }}>
            Próxima iteração →
          </button>
          <button type="button" onClick={reset} style={{ padding: '8px 12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '.72rem', cursor: 'pointer' }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      <div className="wh39-acc-totals">
        <div className="wh39-acc-total-box counter">
          <small>contador (controla)</small>
          <strong>{step > 0 ? rows[step - 1]?.contador : '—'}</strong>
        </div>
        <div className="wh39-acc-total-box accumulator">
          <small>total (acumula)</small>
          <strong>{step > 0 ? rows[step - 1]?.total : '—'}</strong>
        </div>
        {step === totalItems && (
          <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '10px', fontSize: '.7rem', lineHeight: 1.5, color: '#065f46' }}>
            <strong>Resultado final:</strong> 1+2+3+4+5 = 15.<br />
            <code>total = 15</code> — acumulou os valores.<br />
            <code>contador = 5</code> — controlou o loop.
          </div>
        )}
      </div>
    </section>
  );
}

const PATTERNS = [
  {
    id: 0, label: 'Menu + Sentinela', file: 'MenuWhile.java',
    code: 'import java.util.Scanner;\npublic class MenuWhile {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int opcao = -1;\n        while (opcao != 0) {\n            System.out.println("Menu");\n            System.out.println("1 - Cadastrar");\n            System.out.println("2 - Consultar");\n            System.out.println("0 - Sair");\n            opcao = scanner.nextInt();\n            switch (opcao) {\n                case 1: System.out.println("Cadastrar"); break;\n                case 2: System.out.println("Consultar"); break;\n                case 0: System.out.println("Saindo"); break;\n                default: System.out.println("Opção inválida"); break;\n            }\n        }\n        scanner.close();\n    }\n}',
    output: 'Menu\n1 - Cadastrar\n2 - Consultar\n0 - Sair\n[usuário digita 1]\nCadastrar\n...\n[usuário digita 0]\nSaindo',
    insight: 'opcao = -1 garante que a condição (opcao != 0) seja verdadeira na primeira avaliação. Se começasse com 0, o while não executaria nenhuma vez. Na Aula 040, do while resolverá isso mais naturalmente.'
  },
  {
    id: 1, label: 'Tentativas Limitadas', file: 'TentativasWhile.java',
    code: 'public class TentativasWhile {\n    public static void main(String[] args) {\n        int tentativasRealizadas = 0;\n        int limiteTentativas = 3;\n        while (tentativasRealizadas < limiteTentativas) {\n            tentativasRealizadas++;\n            System.out.println("Tentativa " + tentativasRealizadas);\n        }\n        System.out.println("Limite de tentativas atingido");\n    }\n}',
    output: 'Tentativa 1\nTentativa 2\nTentativa 3\nLimite de tentativas atingido',
    insight: 'Padrão de retry: tentativas < limite é a versão mais comum em backends Java para reprocessamento, envio de mensagens e conexões com sistemas externos.'
  },
  {
    id: 2, label: 'Lote com Erros', file: 'ProcessamentoLoteComErro.java',
    code: 'public class ProcessamentoLoteComErro {\n    public static void main(String[] args) {\n        int totalRegistros = 5;\n        int registroAtual = 1;\n        int registrosProcessados = 0;\n        int registrosComErro = 0;\n        while (registroAtual <= totalRegistros) {\n            System.out.println("Processando registro " + registroAtual);\n            if (registroAtual == 3) {\n                System.out.println("Erro no registro " + registroAtual);\n                registrosComErro++;\n            } else {\n                registrosProcessados++;\n            }\n            registroAtual++;\n        }\n        System.out.println("Processados com sucesso: " + registrosProcessados);\n        System.out.println("Registros com erro: " + registrosComErro);\n    }\n}',
    output: 'Processando registro 1\nProcessando registro 2\nProcessando registro 3\nErro no registro 3\nProcessando registro 4\nProcessando registro 5\nProcessados com sucesso: 4\nRegistros com erro: 1',
    insight: 'Separar o contador de erros do contador de sucesso é um padrão fundamental em processamento de lotes. Nunca some erros e sucessos no mesmo acumulador.'
  },
  {
    id: 3, label: 'Paginação', file: 'PaginacaoWhile.java',
    code: 'public class PaginacaoWhile {\n    public static void main(String[] args) {\n        int paginaAtual = 1;\n        int totalPaginas = 3;\n        while (paginaAtual <= totalPaginas) {\n            System.out.println("Buscando página " + paginaAtual);\n            paginaAtual++;\n        }\n        System.out.println("Todas as páginas foram buscadas");\n    }\n}',
    output: 'Buscando página 1\nBuscando página 2\nBuscando página 3\nTodas as páginas foram buscadas',
    insight: 'Paginação é um dos usos mais frequentes do while em APIs backend. O padrão while (pagina <= total) aparece em relatórios, sincronizações e integrações por lote.'
  },
  {
    id: 4, label: 'Validação de Entrada', file: 'ValidacaoEntradaWhile.java',
    code: 'import java.util.Scanner;\npublic class ValidacaoEntradaWhile {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        System.out.println("Digite uma quantidade maior que zero:");\n        int quantidade = scanner.nextInt();\n        while (quantidade <= 0) {\n            System.out.println("Quantidade inválida. Digite novamente:");\n            quantidade = scanner.nextInt();\n        }\n        System.out.println("Quantidade válida: " + quantidade);\n        scanner.close();\n    }\n}',
    output: 'Digite uma quantidade maior que zero:\n[usuário digita -5]\nQuantidade inválida. Digite novamente:\n[usuário digita 3]\nQuantidade válida: 3',
    insight: 'A variável da condição (quantidade) DEVE ser atualizada dentro do while. Se não houver nova leitura dentro do bloco, o loop nunca termina — loop infinito clássico!'
  },
  {
    id: 5, label: 'Mensageria', file: 'MensageriaWhile.java',
    code: 'public class MensageriaWhile {\n    public static void main(String[] args) {\n        int mensagensPendentes = 4;\n        int mensagensEnviadas = 0;\n        while (mensagensPendentes > 0) {\n            System.out.println("Enviando mensagem");\n            mensagensPendentes--;\n            mensagensEnviadas++;\n        }\n        System.out.println("Mensagens enviadas: " + mensagensEnviadas);\n        System.out.println("Mensagens pendentes: " + mensagensPendentes);\n    }\n}',
    output: 'Enviando mensagem\nEnviando mensagem\nEnviando mensagem\nEnviando mensagem\nMensagens enviadas: 4\nMensagens pendentes: 0',
    insight: 'Padrão while (pendentes > 0): cada iteração consome um item da fila. Em sistemas reais, pendentes é a quantidade restante na fila de mensagens, eventos ou notificações.'
  }
];

const ERRORS = [
  { title: 'Esquecer atualização do contador', code: 'int contador = 1;\nwhile (contador <= 5) {\n    System.out.println(contador);\n    // contador++ ausente!\n}', symptom: 'Programa congela imprimindo "1" infinitamente.', cause: 'O contador nunca muda. A condição contador <= 5 sempre é true.', fix: 'Adicione contador++; dentro do bloco, antes ou após o println.' },
  { title: 'Atualizar na direção errada', code: 'int contador = 1;\nwhile (contador <= 5) {\n    System.out.println(contador);\n    contador--; // vai para 0, -1, -2...\n}', symptom: 'Programa congela: 1, 0, -1, -2... infinitamente.', cause: 'O decremento afasta o contador do limite 5 em vez de aproximar.', fix: 'Use contador++ para contador crescente com condição <= .' },
  { title: 'Condição inicial já falsa', code: 'int contador = 10;\nwhile (contador <= 5) {\n    System.out.println(contador);\n    contador++;\n}', symptom: 'Nada é impresso.', cause: 'while testa ANTES. 10 <= 5 é false desde o início.', fix: 'Verifique o valor inicial da variável de controle e o operador da condição.' },
  { title: 'Usar < quando deveria ser <=', code: 'int contador = 1;\nwhile (contador < 5) {\n    System.out.println(contador);\n    contador++;\n}', symptom: 'Imprime 1, 2, 3, 4. O número 5 nunca aparece.', cause: '< exclui o valor limite. Para incluir 5, use <=.', fix: 'while (contador <= 5)' },
  { title: 'Não atualizar a entrada no loop', code: 'while (quantidade <= 0) {\n    System.out.println("Inválida");\n    // falta: quantidade = scanner.nextInt();\n}', symptom: 'Loop infinito: "Inválida" impresso sem parar.', cause: 'quantidade nunca muda. A variável da condição precisa ser relida.', fix: 'Adicione quantidade = scanner.nextInt(); dentro do while.' },
  { title: 'while(true) sem break', code: 'while (true) {\n    System.out.println("Executando");\n}', symptom: 'Loop infinito imediato.', cause: 'Condição true nunca muda.', fix: 'Para uso intencional: adicione if (condição) break; interno. Para aprendizado: prefira while (opcao != 0).' },
  { title: 'Confundir contador e acumulador', code: '// Quer contar pedidos:\ncontador += valorPedido;', symptom: 'contador acumula o valor dos pedidos, não a quantidade.', cause: 'Operador += com valorPedido soma o valor, não incrementa o contador.', fix: 'Para contar: contador++;\nPara acumular: totalValor += valorPedido;' },
  { title: 'Variável declarada dentro, usada fora', code: 'while (contador <= 3) {\n    int total = 10;\n}\nSystem.out.println(total); // erro!', symptom: 'Erro de compilação: total cannot be found.', cause: 'Variáveis declaradas dentro do bloco existem apenas dentro do bloco (escopo).', fix: 'Declare antes do while: int total = 0; e atualize dentro.' },
  { title: 'Não testar zero iterações', code: 'int totalRegistros = 0;\nwhile (registroAtual <= totalRegistros) { ... }', symptom: 'Nenhum processamento. Se não testado, o caso vazio pode ser um bug silencioso.', cause: 'while pode executar 0 vezes. Esse cenário deve ser tratado explicitamente se relevante.', fix: 'Teste com totalRegistros = 0 e valide se o comportamento está correto.' },
  { title: 'Dupla atualização dentro do bloco', code: 'while (contador <= 5) {\n    contador++;\n    System.out.println(contador);\n    contador++; // atualiza duas vezes!\n}', symptom: 'Imprime 2, 4, 6... Valores são pulados.', cause: 'Dois incrementos por iteração fazem o loop avançar dois passos por volta.', fix: 'Mantenha apenas um ponto de atualização do contador por iteração.' }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="wh39-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file wh39-code">
      <div className="guided-file-title">
        <FileCode2 size={17} /> {name}
        <CopyButton value={code} />
      </div>
      <SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines
        customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function PatternsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = PATTERNS[selected];
  return (
    <section className="wh39-patterns-gallery">
      <div className="wh39-patterns-sidebar">
        {PATTERNS.map((entry, index) => (
          <button key={entry.id} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
            {entry.label}
          </button>
        ))}
      </div>
      <div className="wh39-patterns-content">
        <CodePanel name={item.file} code={item.code} />
        <div className="wh39-console">
          <header><Terminal size={15} /> Console de simulação</header>
          <pre>{item.output}</pre>
          <p><Sparkles size={16} /><span>{item.insight}</span></p>
        </div>
      </div>
    </section>
  );
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="wh39-errors-clinic">
      <nav className="wh39-errors-nav">
        {ERRORS.map((entry, index) => (
          <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
            <span>{index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="wh39-error-card">
        <header>
          <AlertTriangle size={20} />
          <div>
            <small>Caso {selected + 1} de {ERRORS.length}</small>
            <h3>{item.title}</h3>
          </div>
        </header>
        <CodePanel name="Código com problema" code={item.code} />
        <section style={{ margin: '12px 0' }}>
          <small style={{ display: 'block', marginBottom: '4px', fontSize: '.65rem', color: '#475569', fontWeight: 'bold' }}>Sintoma</small>
          <code style={{ display: 'block', padding: '10px', color: '#fecdd3', background: '#0f172a', borderRadius: '8px', fontSize: '.7rem', fontFamily: 'Consolas, monospace' }}>{item.symptom}</code>
        </section>
        <div className="wh39-error-flow">
          <span><Search size={16} /><div><strong>Causa</strong><p>{item.cause}</p></div></span>
          <ChevronRight size={18} />
          <span><Wrench size={16} /><div><strong>Correção</strong><p>{item.fix}</p></div></span>
        </div>
      </div>
    </section>
  );
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Estruturar Diretório',
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-039-while\ncd labs\\m1\\aula-039-while\nNew-Item Main.java, WhileCrescente.java, WhileDecrescente.java, AcumuladorWhile.java, LeituraEnquantoPositivo.java, MenuWhile.java, ProcessamentoLoteWhile.java, ProcessamentoLoteComErro.java, TentativasWhile.java, TentativaSenhaConsole.java, BaixaEstoqueWhile.java, PaginacaoWhile.java, MensageriaWhile.java, AuditoriaWhile.java, ValidacaoEntradaWhile.java, WhileBreak.java, WhileContinue.java',
      out: 'Dezessete arquivos Java criados.',
      tip: 'Copie os códigos da galeria e do material de aula para cada arquivo.'
    },
    {
      title: 'Compilar e Testar Básico',
      cmd: 'javac *.java\njava WhileCrescente\njava WhileDecrescente',
      out: '1\n2\n3\n4\n5\n---\n5\n4\n3\n2\n1',
      tip: 'Após confirmar o crescente e decrescente, teste o AcumuladorWhile e valide que o total é 15 (1+2+3+4+5).'
    },
    {
      title: 'Provocar Loop Infinito',
      cmd: 'javac WhileInfinito.java',
      out: '// Crie o arquivo manualmente sem contador++\n// Execute e pressione Ctrl+C para interromper\n// Depois corrija adicionando contador++',
      tip: 'Provocar e encerrar um loop infinito é uma experiência fundamental. Ctrl+C encerra o processo em execução no PowerShell.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit add labs/m1/aula-039-while docs/diario-de-bordo.md\ngit commit -m "Aula 039: pratica while em Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Confirme que nenhum arquivo .class foi commitado. Se necessário, adicione *.class no .gitignore.'
    }
  ];
  const current = steps[stage];
  return (
    <section>
      <div className="wh39-delivery-nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={stage === index ? 'active' : ''} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </div>
      <div className="wh39-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="wh39-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
      <div className="guided-file wh39-code" style={{ marginTop: '14px' }}>
        <div className="guided-file-title">
          <BookOpenCheck size={16} /> docs/diario-de-bordo.md
          <CopyButton value={EVIDENCE} label="Copiar evidências" />
        </div>
        <SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>
          {EVIDENCE}
        </SyntaxHighlighter>
      </div>
    </section>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'flow_animator') return <FlowAnimatorLab />;
  if (block.type === 'accumulator') return <AccumulatorLab />;
  if (block.type === 'patterns_gallery') return <PatternsGalleryLab />;
  if (block.type === 'errors_clinic') return <ErrorsClinicLab />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') {
    return (
      <section className="guided-challenge">
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div>
        <p>{block.text}</p>
        <h4>Critérios de aceite</h4>
        <ul>{block.acceptance.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
      </section>
    );
  }
  return null;
}

const steps = [
  {
    id: 'fluxo',
    eyebrow: 'Repetição com Condição',
    label: 'Animador de Fluxo',
    title: 'Vendo a condição ser testada antes de cada bloco',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Selecione o modo e clique em Simular para ver o while testando a condição antes de cada iteração, e o caso especial de zero iterações:' },
      { type: 'flow_animator' },
      { type: 'note', tone: 'warning', title: 'while testa ANTES', text: 'Se a condição já for falsa na primeira avaliação, o bloco não executa nenhuma vez. Na Aula 040, do while resolverá casos onde precisamos executar pelo menos uma vez (como menus).' }
    ]
  },
  {
    id: 'acumulador',
    eyebrow: 'Contador vs Acumulador',
    label: 'Simulador de Acumulador',
    title: 'Diferenciando quem controla e quem guarda valor',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Clique em "Próxima iteração" para avançar passo a passo e ver como contador e total se comportam de forma independente:' },
      { type: 'accumulator' },
      { type: 'note', tone: 'info', title: 'Contador ≠ Acumulador', text: 'O contador (contador++) controla o loop — avança para terminar a repetição. O acumulador (total += contador) guarda a soma dos valores. Nunca use o mesmo ++ para as duas funções.' }
    ]
  },
  {
    id: 'padroes',
    eyebrow: 'Padrões Corporativos',
    label: 'Galeria de Padrões',
    title: 'Menu, tentativas, lote, paginação, mensageria e validação',
    duration: '7 min',
    blocks: [
      { type: 'lead', text: 'Explore os 6 padrões corporativos que surgem quando o programa precisa repetir baseado em uma condição de negócio:' },
      { type: 'patterns_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Os 10 erros mais perigosos do while',
    duration: '7 min',
    blocks: [
      { type: 'lead', text: 'Diagnostique os 10 erros — do loop infinito clássico à confusão entre contador e acumulador:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega',
    label: 'Entrega do Lab',
    title: 'PowerShell, 17 arquivos Java, loop infinito intencional e commit',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Monte a pasta local, compile os 17 arquivos, provoque um loop infinito intencional e encerre com Ctrl+C:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio: Processador de Pagamentos por Lote',
        text: 'Crie ProcessadorPagamentos.java em labs/m1/aula-039-while/. O programa deve processar uma fila simulada de 6 pagamentos. Use while para processar cada pagamento de 1 a 6. Pagamentos de número par são "aprovados"; ímpares são "recusados". Mantenha contadores separados: pagamentosAprovados e pagamentosRecusados. Ao final, imprima: "Lote processado. Aprovados: X. Recusados: Y." Adicione uma linha de simulação de auditoria a cada pagamento: "Auditando pagamento N: APROVADO/RECUSADO".',
        acceptance: [
          'Uso de while com contador de 1 a 6.',
          'Lógica par/ímpar para determinar status.',
          'Dois acumuladores separados (aprovados e recusados).',
          'Impressão de auditoria por iteração.',
          'Compilação limpa e commit Git sem arquivos .class.'
        ]
      }
    ]
  }
];

export default function GuidedWhileLesson039({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
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

  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <article className="guided-git-lesson guided-while-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Variable size={17} /> Repetição</span>
          <p className="guided-sequence">039 · M1.19</p>
          <h1>While — Repetindo com Condição</h1>
          <p>Domine o while: a estrutura que faz o programa repetir enquanto uma regra for verdadeira. Veja o fluxo iteração a iteração, entenda contador vs acumulador e modele menus, lotes, tentativas, paginação e mensageria.</p>
        </div>
        <div className="guided-hero-status">
          <Zap size={42} />
          <strong>{progress}%</strong>
          <span>{completedLabel}</span>
        </div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[
        { value: 'while', label: 'testa antes' },
        { value: '0..N', label: 'iterações' },
        { value: '∞', label: 'risco de loop infinito' }
      ]} />

      <div className="guided-layout">
        <nav className="guided-step-nav" aria-label="Etapas da aula 039">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
          {steps.map((step, index) => (
            <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}>
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
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button>
            <div className="guided-step-actions-main">
              <button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>
                {activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}
              </button>
              {activeIndex < steps.length - 1 && (
                <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>
              )}
            </div>
          </div>

          {allStepsComplete && (
            <section className="guided-finish">
              <CheckCircle2 size={30} />
              <div>
                <h3>While dominado!</h3>
                <p>{lessonComplete ? 'Repetição, contadores, acumuladores e padrões corporativos consolidados.' : 'Conclua a aula para consolidar seus conhecimentos.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 038</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'While consolidado' : allStepsComplete ? 'Use o botão acima' : 'Pratique fluxo, acumulador e padrões corporativos'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir Do While'}>Aula 040 <ArrowRight size={17} /></button>
      </footer>
    </article>
  );
}
