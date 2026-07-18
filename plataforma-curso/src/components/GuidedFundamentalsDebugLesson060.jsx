import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpFromLine,
  BookOpenCheck, Bug, Check, CheckCircle2, ChevronRight, Clock3, Copy,
  Eye, FileCode2, Lightbulb, ListChecks, Play, RotateCcw, Sparkles,
  StepForward, Terminal, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedFundamentalsDebugLesson.css';

const STORAGE_KEY = 'guided-fundamentals-debug-lesson-060-progress';

const EVIDENCE = ['# Aula 060 — Debug Aplicado aos Fundamentos', '', '## Sessão de diagnóstico', '- [ ] Reproduzi o comportamento antes de alterar o código', '- [ ] Coloquei o breakpoint antes da decisão suspeita', '- [ ] Registrei valor esperado e valor observado', '- [ ] Usei Step Over em biblioteca e Step Into em método meu', '- [ ] Observei parâmetro, variável local e retorno', '- [ ] Consultei Variables, Watch, Evaluate e Call Stack', '- [ ] Testei os caminhos true e false', '- [ ] Corrigi uma hipótese por vez', '', '## Evidência local', '- [ ] Compilei e executei OficinaDebugFundamentos.java', '- [ ] Expliquei o acumulador em cada iteração', '- [ ] Expliquei mutação do array e cópia do primitivo', '- [ ] Expliquei o caminho inválido e válido do try/catch', '- [ ] Revisei o diff e mantive .class fora do commit'].join('\n');

const GUIDED_PROGRAM_060 = `import java.util.Arrays;

public class OficinaDebugFundamentos {
    public static void main(String[] args) {
        String status = " aprovado ";
        int[] valores = {10, 20, 30};

        String normalizado = normalizar(status);
        int total = calcularTotal(valores);
        alterarPrimeiro(valores);

        System.out.println("Status: " + normalizado);
        System.out.println("Total: " + total);
        System.out.println("Array: " + Arrays.toString(valores));
    }

    static String normalizar(String status) {
        return status.trim().toUpperCase();
    }

    static int calcularTotal(int[] valores) {
        int total = 0;
        for (int indice = 0; indice < valores.length; indice++) {
            total += valores[indice];
        }
        return total;
    }

    static void alterarPrimeiro(int[] valores) {
        valores[0] = 99;
    }
}`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* noop */ } };
  return <button type="button" className="db60-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, lines = true, language = 'java' }) {
  return <div className="guided-file db60-code"><div className="guided-file-title"><FileCode2 size={16} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '16px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

const SCENARIOS = {
  if: {
    file: 'DebugIf.java', breakpoint: 4,
    code: ['String status = " aprovado ";', 'String normalizado = status.trim().toUpperCase();', '', 'if ("APROVADO".equals(normalizado)) {', '    System.out.println("Pedido aprovado");', '} else {', '    System.out.println("Pedido não aprovado");', '}'],
    frames: [
      { line: 1, vars: { status: '" aprovado "', normalizado: '<não inicializada>' }, watch: '"APROVADO".equals(status) = false', console: '' },
      { line: 2, vars: { status: '" aprovado "', normalizado: '<não inicializada>' }, watch: 'status.trim().toUpperCase() = "APROVADO"', console: '' },
      { line: 4, vars: { status: '" aprovado "', normalizado: '"APROVADO"' }, watch: '"APROVADO".equals(normalizado) = true', console: '' },
      { line: 5, vars: { status: '" aprovado "', normalizado: '"APROVADO"' }, watch: 'condição = true', console: '' },
      { line: 8, vars: { status: '" aprovado "', normalizado: '"APROVADO"' }, watch: 'fluxo concluído', console: 'Pedido aprovado' }
    ], stack: ['main']
  },
  method: {
    file: 'DebugMetodoRetorno.java', breakpoint: 2,
    code: ['int[] valores = {10, 20, 30};', 'int total = calcularTotal(valores);', 'System.out.println("Total: " + total);', '', 'static int calcularTotal(int[] valores) {', '    int total = 0;', '    for (int indice = 0; indice < valores.length; indice++)', '        total += valores[indice];', '    return total;', '}'],
    frames: [
      { line: 2, vars: { valores: '[10, 20, 30]', total: '<não inicializada>' }, watch: 'Use Step Into para entrar no seu método', console: '', stack: ['main'] },
      { line: 5, vars: { valores: '[10, 20, 30]', total: '<não inicializada>' }, watch: 'parâmetro recebeu a referência do array', console: '', stack: ['calcularTotal', 'main'] },
      { line: 8, vars: { valores: '[10, 20, 30]', indice: '0', total: '10' }, watch: 'valores[indice] = 10', console: '', stack: ['calcularTotal', 'main'] },
      { line: 8, vars: { valores: '[10, 20, 30]', indice: '1', total: '30' }, watch: 'valores[indice] = 20', console: '', stack: ['calcularTotal', 'main'] },
      { line: 9, vars: { valores: '[10, 20, 30]', indice: '3', total: '60' }, watch: 'return total = 60', console: '', stack: ['calcularTotal', 'main'] },
      { line: 3, vars: { valores: '[10, 20, 30]', total: '60' }, watch: 'retorno atribuído no main', console: 'Total: 60', stack: ['main'] }
    ]
  },
  collections: {
    file: 'DebugMatriz.java', breakpoint: 6,
    code: ['int[][] matriz = {{10, 20}, {30, 40}};', 'int total = 0;', '', 'for (int linha = 0; linha < matriz.length; linha++) {', '  for (int coluna = 0; coluna < matriz[linha].length; coluna++) {', '    total += matriz[linha][coluna];', '  }', '}', 'System.out.println(total);'],
    frames: [
      { line: 6, vars: { linha: '0', coluna: '0', valor: '10', total: '0' }, watch: 'matriz[0][0] = 10', console: '' },
      { line: 6, vars: { linha: '0', coluna: '1', valor: '20', total: '10' }, watch: 'matriz[0][1] = 20', console: '' },
      { line: 6, vars: { linha: '1', coluna: '0', valor: '30', total: '30' }, watch: 'matriz[1][0] = 30', console: '' },
      { line: 6, vars: { linha: '1', coluna: '1', valor: '40', total: '60' }, watch: 'matriz[1][1] = 40', console: '' },
      { line: 9, vars: { linha: '2', coluna: '2', total: '100' }, watch: 'laços concluídos', console: '100' }
    ], stack: ['main']
  },
  values: {
    file: 'DebugPassagem.java', breakpoint: 4,
    code: ['int quantidade = 10;', 'int[] valores = {10, 20};', 'alterarQuantidade(quantidade);', 'alterarPrimeiro(valores);', 'System.out.println(quantidade);', 'System.out.println(valores[0]);', '', 'static void alterarQuantidade(int quantidade) { quantidade = 99; }', 'static void alterarPrimeiro(int[] valores) { valores[0] = 99; }'],
    frames: [
      { line: 3, vars: { quantidade: '10', valores: '[10, 20]' }, watch: 'primitivo será copiado', console: '', stack: ['main'] },
      { line: 8, vars: { quantidade: '99 (parâmetro local)' }, watch: 'main continua com quantidade = 10', console: '', stack: ['alterarQuantidade', 'main'] },
      { line: 4, vars: { quantidade: '10', valores: '[10, 20]' }, watch: 'array aponta para conteúdo compartilhado', console: '', stack: ['main'] },
      { line: 9, vars: { valores: '[99, 20]' }, watch: 'conteúdo do array foi mutado', console: '', stack: ['alterarPrimeiro', 'main'] },
      { line: 6, vars: { quantidade: '10', valores: '[99, 20]' }, watch: 'cópia primitiva ≠ mutação de array', console: '10\n99', stack: ['main'] }
    ]
  },
  exception: {
    file: 'DebugTryCatch.java', breakpoint: 3,
    code: ['while (true) {', '  try {', '    int valor = scanner.nextInt();', '    scanner.nextLine();', '    return valor;', '  } catch (InputMismatchException erro) {', '    System.out.println("Entrada inválida");', '    scanner.nextLine();', '  }', '}'],
    frames: [
      { line: 3, vars: { entrada: '"abc"', valor: '<não atribuído>' }, watch: 'nextInt() tentará converter', console: '', stack: ['lerInteiro', 'main'] },
      { line: 6, vars: { erro: 'InputMismatchException', buffer: '"abc\\n"' }, watch: 'o restante do try foi abandonado', console: '', stack: ['lerInteiro', 'main'] },
      { line: 7, vars: { erro: 'InputMismatchException', buffer: '"abc\\n"' }, watch: 'mensagem ao usuário', console: 'Entrada inválida', stack: ['lerInteiro', 'main'] },
      { line: 8, vars: { buffer: 'vazio' }, watch: 'linha problemática consumida', console: 'Entrada inválida', stack: ['lerInteiro', 'main'] },
      { line: 3, vars: { entrada: '"10"', valor: '<não atribuído>' }, watch: 'segunda tentativa', console: 'Entrada inválida', stack: ['lerInteiro', 'main'] },
      { line: 5, vars: { valor: '10', buffer: 'vazio' }, watch: 'return 10', console: 'Entrada inválida\nQuantidade: 10', stack: ['lerInteiro', 'main'] }
    ]
  }
};

function DebuggerLab({ scenario }) {
  const model = SCENARIOS[scenario];
  const [frame, setFrame] = useState(0);
  const current = model.frames[frame];
  const stack = current.stack || model.stack;
  const advance = () => setFrame(value => Math.min(value + 1, model.frames.length - 1));
  return (
    <section className="db60-ide" aria-label={`Simulação didática do IntelliJ para ${model.file}`}>
      <header><span><Bug size={15} /> IntelliJ IDEA · Debug</span><small>Simulação didática — detalhes visuais podem variar por versão e tema</small></header>
      <div className="db60-toolbar"><button type="button" onClick={() => setFrame(model.frames.length - 1)} disabled={frame === model.frames.length - 1}><Play size={14} /> Resume <kbd>F9</kbd></button><button type="button" onClick={advance} disabled={frame === model.frames.length - 1}><StepForward size={14} /> Step Over <kbd>F8</kbd></button><button type="button" onClick={advance} disabled={frame === model.frames.length - 1}><ArrowDownToLine size={14} /> Step Into <kbd>F7</kbd></button><button type="button" onClick={advance} disabled={frame === model.frames.length - 1}><ArrowUpFromLine size={14} /> Step Out <kbd>⇧F8</kbd></button><button type="button" onClick={() => setFrame(0)}><RotateCcw size={14} /> Reiniciar</button></div>
      <div className="db60-workspace">
        <div className="db60-editor"><div className="db60-file-tab"><FileCode2 size={14} /> {model.file}</div>{model.code.map((line, index) => <div key={`${index}-${line}`} className={`db60-line ${current.line === index + 1 ? 'current' : ''}`}><span className="db60-gutter">{model.breakpoint === index + 1 && <i aria-label="Breakpoint" />}{index + 1}</span><code>{line || ' '}</code></div>)}</div>
        <aside className="db60-inspector"><h4>Variables</h4>{Object.entries(current.vars).map(([key, value]) => <div key={key}><strong>{key}</strong><code>{value}</code></div>)}<h4>Watches</h4><p><Eye size={13} /> {current.watch}</p><h4>Call Stack</h4>{stack.map((call, index) => <p key={`${call}-${index}`}><span>{index === 0 ? '▶' : '↳'}</span> {call}()</p>)}</aside>
      </div>
      <div className="db60-debug-bottom"><div><strong>Console</strong><pre>{current.console || 'Execução pausada; nenhuma nova saída.'}</pre></div><p><strong>Linha atual:</strong> {current.line} · o marcador mostra a próxima instrução a executar.</p></div>
    </section>
  );
}

function ToolWindowsLab() {
  const [tool, setTool] = useState('variables');
  const tools = {
    variables: { title: 'Variables', question: 'O que existe no escopo atual?', body: ['status = " aprovado "', 'indice = 1', 'total = 30', 'valores = [10, 20, 30]'] },
    watches: { title: 'Watches', question: 'Qual hipótese quero acompanhar a cada passo?', body: ['"APROVADO".equals(statusNormalizado) = true', 'indice < valores.length = true', 'valores[indice] = 20'] },
    evaluate: { title: 'Evaluate Expression · Alt+F8', question: 'O que esta expressão produziria agora?', body: ['status.trim().toUpperCase() → "APROVADO"', 'valorCentavos / parcelas → 2500', 'valores[indice] → 20'] },
    stack: { title: 'Call Stack', question: 'Como a execução chegou a esta linha?', body: ['calcularTotal()', '↳ calcularMedia()', '  ↳ main()'] }
  };
  const selected = tools[tool];
  return <section className="db60-tools"><div className="db60-tool-tabs">{Object.entries(tools).map(([key, item]) => <button type="button" key={key} className={tool === key ? 'active' : ''} onClick={() => setTool(key)}>{item.title.split(' · ')[0]}</button>)}</div><div className="db60-tool-panel"><small>{selected.title}</small><h3>{selected.question}</h3>{selected.body.map(line => <code key={line}>{line}</code>)}<aside className="guided-note info"><Lightbulb size={19} /><div><strong>Fato primeiro, interpretação depois</strong><p>A ferramenta mostra estado. Você ainda precisa comparar valor esperado e real, localizar a linha que divergiu e corrigir uma única hipótese.</p></div></aside></div></section>;
}

const DOMAINS = [
  { label: 'Pedido', path: 'normalizarStatus → statusValido → exibirPedido', evidence: '" aprovado " → "APROVADO" → true', decision: 'Inspecione parâmetro e retorno em cada método.' },
  { label: 'Produto', path: 'produtoAtivoSemEstoque', evidence: 'estoque=0 · status=ATIVO → true', decision: 'Confirme os dois lados do && e depois o caminho do if.' },
  { label: 'Pagamento', path: 'pagamentoValido → calcularParcela', evidence: '10000 > 0 · 4 > 0 → 2500', decision: 'Entre no validador e no cálculo; teste parcelas=0 no caminho falso.' },
  { label: 'OS', path: 'podeConcluirOs', evidence: 'ABERTA · pendentes=0 → true', decision: 'Troque pendentes para 2 e observe somente uma variável alterar o retorno.' },
  { label: 'Mensageria', path: 'deveEnviarMensagem', evidence: 'tentativas=3 · limite=3 → false', decision: 'Watch prova que 3 < 3 é falso; não adivinhe a intenção da regra.' },
  { label: 'Auditoria', path: 'montarLinhaAuditoria', evidence: '" edicao " · "sucesso" → EDICAO · SUCESSO', decision: 'Observe parâmetros, normalizações locais e String retornada.' }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return <section className="db60-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain.label} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{domain.label}</button>)}</div><article><span>{item.label}</span><h3>{item.path}</h3><div className="db60-evidence"><small>Evidência em Variables/Watch</small><code>{item.evidence}</code></div><p>{item.decision}</p></article></section>;
}

const ERRORS = [
  ['Run em vez de Debug', 'O breakpoint é ignorado.', 'A execução foi iniciada com Run.', 'Use Debug (Shift+F9 ou o ícone correspondente).'],
  ['Breakpoint depois do problema', 'O programa falha antes de pausar.', 'O ponto de parada está tarde demais.', 'Pare antes da entrada ou decisão suspeita.'],
  ['Step Into em println', 'Você entra em código interno e se perde.', 'A biblioteca não é a hipótese investigada.', 'Use Step Over em biblioteca e Into em método seu.'],
  ['Variables ignorado', 'Debug vira apenas uma execução lenta.', 'Nenhum estado foi confrontado.', 'Liste entrada, esperado e observado a cada decisão.'],
  ['Valor presumido', 'A correção ataca a causa errada.', 'A hipótese foi tratada como fato.', 'Confirme o valor real antes de editar.'],
  ['Só caminho true', 'A regra parece funcionar até receber outro caso.', 'A decisão não foi exercitada dos dois lados.', 'Teste true, false e limites como 3 < 3.'],
  ['Entrada inválida não testada', 'O caminho catch permanece desconhecido.', 'Só dados perfeitos foram usados.', 'Teste abc, vazio, negativo e válido.'],
  ['Retorno ignorado', 'O método parece correto, mas o main recebe outro estado.', 'Não se observou return e atribuição.', 'Pare no return e depois no chamador.'],
  ['Código grande demais', 'A Call Stack e o estado ficam confusos.', 'Responsabilidades estão misturadas.', 'Extraia métodos pequenos antes de investigar em profundidade.'],
  ['Várias correções juntas', 'Não é possível saber qual mudança resolveu.', 'Múltiplas hipóteses foram alteradas.', 'Mude uma causa, execute novamente e registre a evidência.']
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const [title, symptom, cause, fix] = ERRORS[selected];
  return <section className="db60-errors"><div className="db60-errors-nav">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={21} /><div><small>Caso {selected + 1} de 10</small><h3>{title}</h3></div></header><div className="db60-symptom"><strong>Sintoma</strong><code>{symptom}</code></div><div className="db60-correction"><span><Wrench size={16} /><div><strong>Causa</strong><p>{cause}</p></div></span><ChevronRight /><span><Bug size={16} /><div><strong>Próxima prova</strong><p>{fix}</p></div></span></div></article></section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['Preparar', 'New-Item -ItemType Directory -Force labs\\m1\\aula-060-debug-aplicado-fundamentos\ncd labs\\m1\\aula-060-debug-aplicado-fundamentos\nNew-Item OficinaDebugFundamentos.java', 'Pasta e fonte criados.', 'Abra a pasta pela raiz no IntelliJ para que SDK e configuração sejam previsíveis.'],
    ['Compilar e executar', 'javac OficinaDebugFundamentos.java\njava OficinaDebugFundamentos', 'Status: APROVADO\nTotal: 60\nArray: [99, 20, 30]', 'A saída final é referência; a evidência principal será explicar como cada valor nasceu.'],
    ['Depurar', 'IntelliJ: breakpoint na chamada calcularTotal(valores)\nDebug · F7 · F8 · Shift+F8 · F9', 'Variables: total 0 → 10 → 30 → 60\nCall Stack: calcularTotal → main', 'Atalhos variam por keymap; use Ctrl+Shift+A e procure a ação se necessário.'],
    ['Versionar', 'git status\ngit diff\ngit add labs/m1/aula-060-debug-aplicado-fundamentos docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 060: pratica debug aplicado aos fundamentos"\ngit status', 'nothing to commit, working tree clean', 'Não versione .class. Registre breakpoint, valores esperados, observados e conclusão.']
  ];
  const current = stages[stage];
  return <section><div className="db60-delivery-nav">{stages.map((item, index) => <button type="button" key={item[0]} className={stage === index ? 'active' : ''} onClick={() => setStage(index)}><span>{index < stage ? <Check size={11} /> : index + 1}</span>{item[0]}</button>)}</div><div className="db60-terminal"><header><Terminal size={14} /> Roteiro verificável</header><pre><strong>{current[1]}</strong>{'\n\n'}{current[2]}</pre><p><Lightbulb size={14} /> {current[3]}</p></div><div className="db60-delivery-actions"><button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button><span>Passo {stage + 1} de 4</span><button type="button" disabled={stage === 3} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button></div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Programa guiado antes do desafio</strong><p>Preveja o estado antes de cada Step Over. Entre apenas em métodos do programa, observe o retorno e compare a mutação do array com a String retornada.</p></div></aside><CodePanel name="OficinaDebugFundamentos.java" code={GUIDED_PROGRAM_060} /><div className="db60-console"><header><Terminal size={14} /> Saída esperada</header><pre>{'Status: APROVADO\nTotal: 60\nArray: [99, 20, 30]'}</pre></div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: DiagnosticoPedido.java</h3></div><p>Receba status <code>" aprovado "</code>, valores <code>{'{10, 20, 30}'}</code> e limite <code>3</code>. O programa propositalmente deve começar com uma normalização ausente e um acumulador declarado dentro do laço.</p><ul><li>Reproduza as duas saídas erradas antes de alterar.</li><li>Defina breakpoints antes do <code>if</code> e dentro do <code>for</code>.</li><li>Registre esperado versus observado e corrija uma causa por vez.</li><li>Use Watch na condição e Call Stack ao entrar no método de total.</li><li>Explique por que a correção funciona sem depender apenas da saída final.</li></ul></section><div className="guided-file db60-code"><div className="guided-file-title"><BookOpenCheck size={16} /> docs/diario-de-bordo.md<CopyButton value={EVIDENCE} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '16px', background: '#0f172a', fontSize: '.76rem', lineHeight: 1.65 }}>{EVIDENCE}</SyntaxHighlighter></div></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'debugger') return <DebuggerLab scenario={block.scenario} />;
  if (block.type === 'tools') return <ToolWindowsLab />;
  if (block.type === 'domains') return <DomainsGallery />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'ide', label: 'Breakpoint e Interface', eyebrow: 'IntelliJ guiado', title: 'Pause antes da decisão e leia a próxima linha a executar', duration: '8 min', blocks: [{ type: 'lead', text: 'Use a simulação do IntelliJ para criar um breakpoint mental, iniciar Debug e acompanhar um if verdadeiro sem confundir linha atual com linha já executada.' }, { type: 'debugger', scenario: 'if' }] },
  { id: 'metodo', label: 'Método e Retorno', eyebrow: 'Navegação de chamadas', title: 'Entre no método, acompanhe parâmetros e volte com o retorno', duration: '8 min', blocks: [{ type: 'lead', text: 'Compare Step Over, Step Into, Step Out e Resume enquanto total, índice e Call Stack mudam.' }, { type: 'debugger', scenario: 'method' }] },
  { id: 'colecoes', label: 'Laços, Arrays e Matriz', eyebrow: 'Estado iterativo', title: 'Observe índices, células e acumulador em cada volta dos laços', duration: '8 min', blocks: [{ type: 'lead', text: 'Percorra a matriz célula por célula; o mesmo método serve para for, busca linear, retorno antecipado e arrays de String.' }, { type: 'debugger', scenario: 'collections' }] },
  { id: 'valores', label: 'Valor, Array e String', eyebrow: 'Memória observável', title: 'Compare cópia do primitivo, mutação do array e retorno de String', duration: '8 min', blocks: [{ type: 'lead', text: 'Entre nos dois métodos e use Variables para provar por que a variável primitiva não muda no main enquanto o conteúdo do array muda.' }, { type: 'debugger', scenario: 'values' }] },
  { id: 'excecao', label: 'Try/catch no Debug', eyebrow: 'Recuperação de entrada', title: 'Acompanhe a exceção saltar para o catch e depois retomar o while', duration: '8 min', blocks: [{ type: 'lead', text: 'Teste primeiro abc e depois 10 para observar falha, variável erro, limpeza do Scanner, nova tentativa e retorno.' }, { type: 'debugger', scenario: 'exception' }] },
  { id: 'ferramentas', label: 'Painéis de Evidência', eyebrow: 'Estado e hipótese', title: 'Use Variables, Watches, Evaluate Expression e Call Stack com intenção', duration: '7 min', blocks: [{ type: 'lead', text: 'Cada painel responde a uma pergunta diferente; explore-os sem transformar debug em execução lenta sem observação.' }, { type: 'tools' }] },
  { id: 'dominios', label: 'Galeria de Domínios', eyebrow: 'Backend aplicado', title: 'Planeje a sessão de debug em seis cenários de negócio', duration: '8 min', blocks: [{ type: 'lead', text: 'Escolha o domínio, identifique a cadeia de chamadas, a evidência esperada e a variação que precisa ser testada.' }, { type: 'domains' }] },
  { id: 'clinica', label: 'Clínica de Erros', eyebrow: 'Diagnóstico disciplinado', title: 'Corrija dez hábitos que tornam o debug confuso ou inconclusivo', duration: '9 min', blocks: [{ type: 'lead', text: 'Comece pelo sintoma, formule uma causa e escolha a próxima prova antes de editar o código.' }, { type: 'errors' }] },
  { id: 'entrega', label: 'Entrega & Desafio', eyebrow: 'Prática no IntelliJ e terminal', title: 'Compile, depure, explique o estado e entregue uma correção rastreável', duration: '12 min', blocks: [{ type: 'lead', text: 'Execute o programa completo, pratique os controles e só então investigue dois defeitos no desafio.' }, { type: 'delivery' }] }
];

export default function GuidedFundamentalsDebugLesson060({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepNavRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } });
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds])); }, [completedStepIds]);
  useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedStepIds.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedStepIds.size, isCompleted, onToggleCompleted]);
  useEffect(() => { const activeButton = stepNavRef.current?.querySelector('button.active'); if (activeButton && window.matchMedia('(max-width: 900px)').matches) activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]);
  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleActiveStep = () => { if (activeStepComplete && isCompleted) onToggleCompleted(); setCompletedStepIds(previous => { const next = new Set(previous); if (next.has(activeStep.id)) next.delete(activeStep.id); else next.add(activeStep.id); return next; }); };
  return <article className="guided-git-lesson guided-fundamentals-debug-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Bug size={17} /> Diagnóstico por evidências</span><p className="guided-sequence">060 · M1.40</p><h1>Debug Aplicado aos Fundamentos</h1><p>Pare de adivinhar: pause antes da decisão, observe o estado real, navegue pelas chamadas e corrija uma hipótese por vez.</p></div><div className="guided-hero-status"><Bug size={42} /><strong>{progress}%</strong><span>{completedStepIds.size} de {steps.length} etapas concluídas</span></div><div className="guided-hero-status-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header><GuidedLessonFacts ariaLabel="Resumo técnico da aula 060" items={[{ value: 'F7 · F8 · F9', label: 'Navegação controlada' }, { value: '4 painéis', label: 'Estado e chamadas' }, { value: '1 hipótese', label: 'Correção por ciclo' }]} /><div className="guided-layout"><nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 060"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Diagnóstico guiado consolidado</h3><p>{lessonComplete ? 'Você já consegue investigar fundamentos com evidências.' : 'Registre a conclusão para liberar o projeto final do módulo.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 059</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Debug baseado em fatos consolidado' : allStepsComplete ? 'Use o botão acima' : 'Pratique breakpoint, estado, chamadas e hipóteses'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Próxima aula'}>Aula 061 <ArrowRight size={17} /></button></footer></article>;
}
