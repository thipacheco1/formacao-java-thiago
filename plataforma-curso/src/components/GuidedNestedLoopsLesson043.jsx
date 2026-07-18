import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Boxes, Check, CheckCircle2, Clock3,
  Copy, FileCode2, Grid3X3, Lightbulb, ListChecks, Play, RefreshCw,
  RotateCcw, Search, Sparkles, Terminal, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedNestedLoopsLesson.css';

const STORAGE_KEY = 'guided-nested-loops-lesson-043-progress';

const FIRST_CODE = `public class Main {
    public static void main(String[] args) {
        for (int linha = 1; linha <= 3; linha++) {
            for (int coluna = 1; coluna <= 3; coluna++) {
                System.out.println(
                        "Linha " + linha + ", coluna " + coluna);
            }
        }

        System.out.println("Fim do programa");
    }
}`;

const PATTERNS = [
  {
    label: 'Grade e print', file: 'GradeConceitual.java',
    code: `for (int linha = 1; linha <= 3; linha++) {
    for (int coluna = 1; coluna <= 4; coluna++) {
        System.out.print("[X]");
    }
    System.out.println();
}`,
    output: '[X][X][X][X]\n[X][X][X][X]\n[X][X][X][X]',
    insight: 'print mantém as células na mesma linha; println depois do loop interno inicia a próxima linha.'
  },
  {
    label: 'Tabuada', file: 'TabuadaAninhada.java',
    code: `for (int numero = 1; numero <= 3; numero++) {
    System.out.println("Tabuada do " + numero);
    for (int multiplicador = 1;
            multiplicador <= 10;
            multiplicador++) {
        int resultado = numero * multiplicador;
        System.out.println(numero + " x "
                + multiplicador + " = " + resultado);
    }
}`,
    output: 'Tabuada do 1: 1 x 1 ... 1 x 10\nTabuada do 2: ...\nTabuada do 3: ...',
    insight: 'Para cada número externo, o multiplicador interno recomeça em 1 e percorre todo o intervalo.'
  },
  {
    label: 'Cliente e pedidos', file: 'ClientesPedidos.java',
    code: `for (int cliente = 1; cliente <= 3; cliente++) {
    System.out.println("Cliente " + cliente);
    for (int pedido = 1; pedido <= 2; pedido++) {
        System.out.println("  Pedido " + pedido
                + " do cliente " + cliente);
    }
}`,
    output: 'Cliente 1\n  Pedido 1\n  Pedido 2\nCliente 2 ...\nCliente 3 ...',
    insight: 'Nomes de domínio revelam a hierarquia: para cada cliente, percorra seus pedidos.'
  },
  {
    label: 'Pedido e itens', file: 'PedidosItens.java',
    code: `long totalGeralCentavos = 0L;
for (int pedido = 1; pedido <= 3; pedido++) {
    long totalPedidoCentavos = 0L;
    for (int item = 1; item <= 4; item++) {
        long valor = 1000L * item;
        totalPedidoCentavos += valor;
        totalGeralCentavos += valor;
    }
    System.out.println("Pedido: " + totalPedidoCentavos);
}
System.out.println("Geral: " + totalGeralCentavos);`,
    output: 'Pedido: 10000\nPedido: 10000\nPedido: 10000\nGeral: 30000',
    insight: 'O total do pedido nasce dentro do loop externo e reinicia; o total geral nasce fora e atravessa todos os pedidos.'
  },
  {
    label: 'OS e checklist', file: 'OrdensAtividadesChecklist.java',
    code: `for (int os = 1; os <= 2; os++) {
    for (int atividade = 1; atividade <= 2; atividade++) {
        for (int pergunta = 1; pergunta <= 3; pergunta++) {
            System.out.println(os + " / "
                    + atividade + " / " + pergunta);
        }
    }
}`,
    output: '2 OS × 2 atividades × 3 perguntas = 12 execuções',
    insight: 'Três níveis funcionam, mas multiplicam trabalho e indentação. Quatro ou mais níveis normalmente pedem reorganização.'
  },
  {
    label: 'Página e itens', file: 'PaginasItens.java',
    code: `for (int pagina = 1; pagina <= 3; pagina++) {
    System.out.println("Página " + pagina);
    for (int item = 1; item <= 4; item++) {
        System.out.println("  Item " + item);
    }
}`,
    output: 'Página 1: itens 1..4\nPágina 2: itens 1..4\nPágina 3: itens 1..4',
    insight: 'Representa uma paginação cujo total é conhecido. Em backend real, evite uma consulta ao banco para cada item externo.'
  },
  {
    label: 'Mensagem e tentativas', file: 'MensagensTentativas.java',
    code: `for (int mensagem = 1; mensagem <= 3; mensagem++) {
    for (int tentativa = 1; tentativa <= 3; tentativa++) {
        boolean sucesso = tentativa == 2;
        if (sucesso) {
            System.out.println("Enviada: " + mensagem);
            break;
        }
    }
}`,
    output: 'Enviada: 1\nEnviada: 2\nEnviada: 3',
    insight: 'break encerra somente as tentativas da mensagem atual. O loop externo avança para a próxima mensagem.'
  },
  {
    label: 'Parada externa com flag', file: 'PararProcessamentoExterno.java',
    code: `boolean interromperTudo = false;
for (int lote = 1; lote <= 3 && !interromperTudo; lote++) {
    for (int registro = 1; registro <= 4; registro++) {
        boolean falhaCritica = lote == 2 && registro == 3;
        if (falhaCritica) {
            interromperTudo = true;
            break;
        }
        System.out.println(lote + " / " + registro);
    }
}
System.out.println("Interrompido: " + interromperTudo);`,
    output: 'lote 1: registros 1..4\nlote 2: registros 1..2\nfalha em 2/3\nlote 3 não inicia\nInterrompido: true',
    insight: 'break encerra o interno; a flag participa da condição externa e impede o próximo lote. Cada nível recebe uma regra explícita.'
  },
  {
    label: 'Permissões e agenda', file: 'MatrizesConceituais.java',
    code: `for (int perfil = 1; perfil <= 3; perfil++) {
    for (int funcionalidade = 1;
            funcionalidade <= 4;
            funcionalidade++) {
        boolean permitido = perfil == 1 || funcionalidade <= 2;
        System.out.println(perfil + " / "
                + funcionalidade + ": " + permitido);
    }
}`,
    output: '3 perfis × 4 funcionalidades = 12 combinações',
    insight: 'Grades, agendas, categorias/produtos e formas/parcelas usam a mesma pergunta: para cada X, percorro vários Y?'
  },
  {
    label: 'Agenda', file: 'AgendaConceitual.java',
    code: `for (int profissional = 1; profissional <= 2; profissional++) {
    for (int horario = 8; horario <= 10; horario++) {
        System.out.println("Profissional " + profissional
                + " / " + horario + "h");
    }
}`,
    output: 'profissional 1: 8h, 9h, 10h\nprofissional 2: 8h, 9h, 10h',
    insight: 'A agenda é uma grade de combinações. O exemplo não afirma disponibilidade real; apenas percorre todos os pares profissional/horário.'
  },
  {
    label: 'Formas e parcelas', file: 'CombinacoesPagamento.java',
    code: `for (int forma = 1; forma <= 2; forma++) {
    for (int parcelas = 1; parcelas <= 3; parcelas++) {
        System.out.println("Forma " + forma
                + " / parcelas " + parcelas);
    }
}`,
    output: '2 formas × 3 quantidades de parcelas = 6 combinações',
    insight: 'Combinar opções é diferente de somar resultados. O custo cresce pelo produto dos limites.'
  },
  {
    label: 'Cliente, pedido e item', file: 'ClientesPedidosItens.java',
    code: `long totalGeral = 0L;
for (int cliente = 1; cliente <= 2; cliente++) {
    long totalCliente = 0L;
    for (int pedido = 1; pedido <= 2; pedido++) {
        long totalPedido = 0L;
        for (int item = 1; item <= 2; item++) {
            totalPedido += 500L;
        }
        totalCliente += totalPedido;
    }
    totalGeral += totalCliente;
    System.out.println("Cliente: " + totalCliente);
}
System.out.println("Geral: " + totalGeral);`,
    output: 'cliente 1 = 2000\ncliente 2 = 2000\ngeral = 4000 centavos',
    insight: 'Pedido reinicia no nível de pedido; cliente reinicia no nível externo; geral sobrevive a toda a hierarquia.'
  },
  {
    label: 'Menu e submenu', file: 'MenuComSubmenu.java',
    code: `do {
    opcaoPrincipal = scanner.nextInt();
    if (opcaoPrincipal == 1) {
        do {
            opcaoCliente = scanner.nextInt();
            // 0 volta ao menu principal
        } while (opcaoCliente != 0);
    }
} while (opcaoPrincipal != 0);`,
    output: 'Menu principal → Clientes → Voltar → Menu principal → Sair',
    insight: 'Subfluxos são laços aninhados, mas crescem rápido. Métodos futuros separarão cada menu e reduzirão a indentação.'
  }
];

const ERRORS = [
  { title: 'Somar em vez de multiplicar', code: `// externo: 10 vezes
// interno: 10 vezes
// expectativa errada: 10 + 10 = 20`, symptom: 'O bloco executa 100 vezes, não 20.', cause: 'O interno completa dez voltas para cada uma das dez voltas externas.', fix: 'Calcule 10 × 10 e valide primeiro com 2 × 3.' },
  { title: 'Acumulador no nível errado', code: `long totalPedido = 0;
for (int pedido = 1; pedido <= 3; pedido++) {
    for (int item = 1; item <= 4; item++) totalPedido += 1000;
    System.out.println(totalPedido);
}`, symptom: 'Imprime 4000, 8000 e 12000.', cause: 'O total não reinicia entre pedidos.', fix: 'Declare totalPedido dentro do loop de pedido; mantenha outro total fora se precisar do geral.' },
  { title: 'break deveria parar tudo', code: `for (int lote = 1; lote <= 3; lote++) {
    for (int registro = 1; registro <= 4; registro++) {
        if (registro == 2) break;
    }
}`, symptom: 'O próximo lote ainda começa.', cause: 'break encerra apenas o loop interno mais próximo.', fix: 'Use uma flag na condição externa ou reorganize o fluxo; não presuma que break atravessa loops.' },
  { title: 'continue no nível errado', code: `for (int pedido = 1; pedido <= 2; pedido++) {
    for (int item = 1; item <= 3; item++) {
        if (item == 2) continue;
    }
}`, symptom: 'Somente o item 2 é pulado; o pedido não é descartado.', cause: 'continue atua no loop interno onde está escrito.', fix: 'Decida qual nível deve avançar e expresse a regra nesse nível.' },
  { title: 'Muitos níveis', code: `for (...) {
    for (...) {
        for (...) {
            for (...) { /* regra */ }
        }
    }
}`, symptom: 'A regra fica escondida em quatro níveis de indentação.', cause: 'Hierarquia e responsabilidades foram acumuladas no mesmo bloco.', fix: 'Mantenha o exemplo pequeno; métodos futuros separarão responsabilidades.' },
  { title: 'Variável interna não reinicia', code: `int item = 1;
for (int pedido = 1; pedido <= 3; pedido++) {
    while (item <= 3) item++;
}`, symptom: 'Somente o primeiro pedido percorre os itens.', cause: 'item foi declarado fora e chegou a 4 antes do segundo pedido.', fix: 'Declare/reinicialize item dentro do loop externo quando o ciclo pertence a cada pedido.' },
  { title: 'Grade sem quebra de linha', code: `for (int linha = 1; linha <= 3; linha++) {
    for (int coluna = 1; coluna <= 4; coluna++) {
        System.out.print("[X]");
    }
}`, symptom: 'Todos os 12 blocos aparecem na mesma linha.', cause: 'Não há println depois de concluir cada linha externa.', fix: 'Adicione System.out.println(); após o loop interno.' },
  { title: 'Contadores genéricos', code: `for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 4; j++) processar(i, j);
}`, symptom: 'Não fica claro se i é cliente, pedido, linha ou página.', cause: 'Os nomes não revelam o domínio.', fix: 'Use cliente/pedido, linha/coluna ou pagina/item conforme a regra.' },
  { title: 'Contador redeclarado', code: `for (int i = 1; i <= 3; i++) {
    for (int i = 1; i <= 3; i++) { }
}`, symptom: 'variable i is already defined', cause: 'O identificador externo ainda está no escopo do bloco interno.', fix: 'Use nomes diferentes e significativos para cada nível.' },
  { title: 'Escala sem teste pequeno', code: `for (int a = 1; a <= 1000; a++) {
    for (int b = 1; b <= 1000; b++) executar();
}`, symptom: 'Um milhão de execuções tornam o diagnóstico difícil.', cause: 'A multiplicação não foi validada em escala pequena.', fix: 'Prove primeiro 2 × 3 = 6; depois estime o custo antes de aumentar limites.' }
];

const EVIDENCE = `# Aula 043 — Laços Aninhados

- [ ] Identifiquei loop externo e interno
- [ ] Provei que o interno reinicia a cada volta externa
- [ ] Calculei externo × interno antes de executar
- [ ] Desenhei grade usando print e println
- [ ] Usei nomes de domínio em vez de i/j quando necessário
- [ ] Posicionei acumulador por pedido e total geral
- [ ] Expliquei o alcance de break e continue no loop interno
- [ ] Interrompi o loop externo com flag na condição
- [ ] Modelei cliente/pedido, página/item e mensagem/tentativa
- [ ] Modelei agenda e combinações de pagamento
- [ ] Reconheci quando muitos níveis pedem reorganização
- [ ] Testei primeiro com 2 × 3

## Decisão
O elemento externo é:
Para cada elemento externo, o interno percorre:
O acumulador que reinicia pertence a:
Total estimado de execuções internas:`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); } };
  return <button type="button" className="nl43-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file nl43-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function GridStepper() {
  const rows = 3;
  const cols = 3;
  const [position, setPosition] = useState(0);
  const done = position >= rows * cols;
  const currentRow = done ? rows : Math.floor(position / cols) + 1;
  const currentCol = done ? cols : (position % cols) + 1;
  const next = () => setPosition(value => Math.min(value + 1, rows * cols));
  return <section className="nl43-grid-stepper" aria-label="Percurso passo a passo de um laço 3 por 3">
    <div className="nl43-grid">{Array.from({ length: rows * cols }, (_, index) => { const row = Math.floor(index / cols) + 1; const col = (index % cols) + 1; return <div key={index} className={(index < position ? 'visited ' : '') + (index === position && !done ? 'active' : '')}><span>[{row},{col}]</span><small>{index < position ? 'visitada' : index === position && !done ? 'agora' : 'aguarda'}</small></div>; })}</div>
    <div className="nl43-loop-state"><div><span>loop externo</span><strong>linha = {currentRow}</strong></div><div><span>loop interno</span><strong>coluna = {currentCol}</strong></div><div><span>execuções</span><strong>{position} de {rows * cols}</strong></div></div>
    <div className="nl43-step-actions"><p>{done ? 'O loop interno completou três voltas para cada uma das três linhas.' : currentCol === 1 && position > 0 ? `A coluna reiniciou em 1 quando a linha virou ${currentRow}.` : `Visite [${currentRow},${currentCol}] e depois avance a coluna.`}</p><button type="button" onClick={next} disabled={done}><Play size={14} /> Próxima execução</button><button type="button" onClick={() => setPosition(0)}><RefreshCw size={14} /> Reiniciar</button></div>
  </section>;
}

function FirstProgramLab() {
  const [ran, setRan] = useState(false);
  const output = Array.from({ length: 9 }, (_, index) => `Linha ${Math.floor(index / 3) + 1}, coluna ${(index % 3) + 1}`).join('\n');
  return <section className="nl43-first-grid"><CodePanel name="Main.java" code={FIRST_CODE} /><div className="nl43-terminal"><header><Terminal size={15} /> PowerShell</header><pre><strong>PS&gt; javac Main.java</strong>{ran ? `\nPS> java Main\n${output}\nFim do programa` : '\n(compilação sem mensagem = sucesso)'}</pre><button type="button" className="nl43-run" onClick={() => setRan(true)}><Play size={14} /> Executar</button></div></section>;
}

function ComplexityLab() {
  const [outer, setOuter] = useState(3);
  const [inner, setInner] = useState(4);
  const total = outer * inner;
  return <section className="nl43-complexity"><div className="nl43-complex-controls"><label>Externo: <strong>{outer}</strong><input type="range" min="1" max="100" value={outer} onChange={event => setOuter(Number(event.target.value))} /></label><label>Interno: <strong>{inner}</strong><input type="range" min="1" max="100" value={inner} onChange={event => setInner(Number(event.target.value))} /></label></div><div className="nl43-equation"><span>{outer}</span><b>×</b><span>{inner}</span><b>=</b><strong>{total.toLocaleString('pt-BR')}</strong><small>execuções do bloco interno</small></div><div className="nl43-scale" aria-label={`${total} execuções`}><span style={{ width: `${Math.max(2, (total / 10000) * 100)}%` }} /></div><p>{total <= 20 ? 'Escala pequena: você consegue conferir mentalmente.' : total <= 1000 ? 'O trabalho já cresceu; estime antes de executar.' : 'Atenção: a multiplicação transformou dois limites moderados em milhares de execuções.'}</p></section>;
}

function AccumulatorScopeLab() {
  const [step, setStep] = useState(0);
  const entries = Array.from({ length: 6 }, (_, index) => ({ order: Math.floor(index / 2) + 1, item: (index % 2) + 1, value: ((index % 2) + 1) * 1000 }));
  const visible = entries.slice(0, step);
  const currentOrder = step === 0 ? 1 : entries[Math.min(step - 1, entries.length - 1)].order;
  const orderTotal = visible.filter(entry => entry.order === currentOrder).reduce((sum, entry) => sum + entry.value, 0);
  const general = visible.reduce((sum, entry) => sum + entry.value, 0);
  return <section className="nl43-scope"><div className="nl43-scope-code"><span>fora de todos os pedidos</span><code>long totalGeral = 0;</code><div><span>dentro de cada pedido — reinicia</span><code>long totalPedido = 0;</code><div><span>dentro de cada item</span><code>totalPedido += valor;<br />totalGeral += valor;</code></div></div></div><div className="nl43-scope-state"><div><span>pedido atual</span><strong>{currentOrder}</strong></div><div><span>total do pedido</span><strong>{orderTotal}</strong></div><div><span>total geral</span><strong>{general}</strong></div><div className="nl43-scope-actions"><button type="button" disabled={step === entries.length} onClick={() => setStep(value => value + 1)}>Processar item <ArrowRight size={14} /></button><button type="button" onClick={() => setStep(0)}><RefreshCw size={14} /> Reiniciar</button></div></div></section>;
}

function NestedControlLab() {
  const [mode, setMode] = useState('break');
  const rows = mode === 'break'
    ? [[1], [1], [1]]
    : [[1, 3], [1, 3], [1, 3]];
  return <section className="nl43-control"><div className="nl43-tabs"><button type="button" className={mode === 'break' ? 'active' : ''} onClick={() => setMode('break')}>break no pedido 2</button><button type="button" className={mode === 'continue' ? 'active' : ''} onClick={() => setMode('continue')}>continue no item 2</button></div><div className="nl43-control-tree">{rows.map((items, customerIndex) => <div key={customerIndex}><strong>externo {customerIndex + 1}</strong><span>{items.map(item => <b key={item}>interno {item}</b>)}</span><small>{mode === 'break' ? 'interno encerra no 2; externo continua' : 'interno pula o 2; 3 ainda executa'}</small></div>)}</div><p>O salto atua no loop interno onde está escrito. Parar o externo exige uma regra explícita no nível externo.</p></section>;
}

function PatternGallery() {
  const [selected, setSelected] = useState(0);
  const item = PATTERNS[selected];
  return <section className="nl43-gallery"><nav>{PATTERNS.map((entry, index) => <button type="button" key={entry.label} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>{entry.label}</button>)}</nav><div className="nl43-gallery-content"><CodePanel name={item.file} code={item.code} /><div className="nl43-output"><header><Terminal size={15} /> Evidência</header><pre>{item.output}</pre><p><Sparkles size={16} /> {item.insight}</p></div></div></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="nl43-clinic"><nav>{ERRORS.map((entry, index) => <button type="button" key={entry.title} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span>{entry.title}</button>)}</nav><div className="nl43-diagnosis"><header><AlertTriangle size={20} /><div><small>Caso {selected + 1} de {ERRORS.length}</small><h3>{item.title}</h3></div></header><CodePanel name="Código sob investigação" code={item.code} /><div className="nl43-symptom"><strong>Sintoma</strong><code>{item.symptom}</code></div><div className="nl43-recovery"><span><Search size={16} /><div><strong>Causa</strong><p>{item.cause}</p></div></span><span><Wrench size={16} /><div><strong>Correção</strong><p>{item.fix}</p></div></span></div></div></section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: 'Criar laboratório', command: 'New-Item -ItemType Directory -Force labs\\m1\\aula-043-lacos-aninhados\ncd labs\\m1\\aula-043-lacos-aninhados', output: 'Directory: ...\\labs\\m1\\aula-043-lacos-aninhados', note: 'Comece por Main, GradeConceitual e MultiplicacaoIteracoes antes dos domínios de três níveis.' },
    { title: 'Compilar núcleo', command: 'javac Main.java GradeConceitual.java MultiplicacaoIteracoes.java PedidosItens.java\njava Main\njava MultiplicacaoIteracoes', output: 'Linha 1, coluna 1 ... Linha 3, coluna 3\nFim do programa\nTotal de execuções internas: 12', note: 'A saída 3 × 3 possui nove linhas; o segundo programa deve provar 3 × 4 = 12.' },
    { title: 'Testar alcance', command: 'javac BreakSaiDoInterno.java ContinueNoInterno.java\njava BreakSaiDoInterno\njava ContinueNoInterno', output: 'break: cliente 1/2/3, somente pedido 1\ncontinue: pedidos 1/2, itens 1 e 3', note: 'Explique qual contador avançou depois de cada salto antes de seguir.' },
    { title: 'Versionar entrega', command: 'git status\ngit diff\ngit add labs/m1/aula-043-lacos-aninhados docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 043: pratica lacos aninhados em Java"\ngit status', output: 'nothing to commit, working tree clean', note: 'Revise os arquivos staged e mantenha .class fora do histórico.' }
  ];
  const current = stages[stage];
  return <section><div className="nl43-delivery-nav">{stages.map((entry, index) => <button type="button" key={entry.title} className={index === stage ? 'active' : ''} onClick={() => setStage(index)}><span>{index + 1}</span>{entry.title}</button>)}</div><div className="nl43-terminal"><header><Terminal size={15} /> PowerShell <small>passo {stage + 1} de {stages.length}</small></header><pre><strong>PS&gt; {current.command}</strong>{'\n\n'}{current.output}</pre><p><Lightbulb size={16} /> {current.note}</p></div><div className="guided-file nl43-code nl43-diary"><div className="guided-file-title"><Boxes size={16} /> docs/diario-de-bordo.md<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>{EVIDENCE}</SyntaxHighlighter></div></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'grid') return <GridStepper />;
  if (block.type === 'first') return <FirstProgramLab />;
  if (block.type === 'complexity') return <ComplexityLab />;
  if (block.type === 'scope') return <AccumulatorScopeLab />;
  if (block.type === 'control') return <NestedControlLab />;
  if (block.type === 'patterns') return <PatternGallery />;
  if (block.type === 'errors') return <ErrorClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

const steps = [
  { id: 'grade', label: 'Percurso da grade', eyebrow: 'Externo e interno', title: 'Veja o loop interno reiniciar para cada linha', duration: '12 min', blocks: [
    { type: 'lead', text: 'Avance célula por célula. Observe o momento exato em que coluna volta para 1 e linha avança.' },
    { type: 'grid' },
    { type: 'note', title: 'Leitura obrigatória', text: 'Para cada valor do loop externo, o loop interno executa seu ciclo completo desde a própria inicialização.' }
  ] },
  { id: 'primeiro', label: 'Primeiro programa', eyebrow: 'Código e terminal', title: 'Digite o 3 × 3 e confira nove combinações', duration: '12 min', blocks: [
    { type: 'lead', text: 'Crie Main.java, compile e execute. Confira ordem, reinício da coluna e a linha final antes de considerar o resultado correto.' },
    { type: 'first' },
    { type: 'note', title: 'Ainda é uma matriz conceitual', text: 'Você está percorrendo combinações de linha e coluna, não um array bidimensional. Matrizes reais virão depois.' }
  ] },
  { id: 'custo', label: 'Multiplicação do custo', eyebrow: 'Escala de execução', title: 'Estime o trabalho antes de aumentar os limites', duration: '10 min', blocks: [
    { type: 'lead', text: 'Mova os limites e observe como o total cresce. Dois loops de 100 não produzem 200 execuções: produzem 10.000.' },
    { type: 'complexity' },
    { type: 'note', tone: 'warning', title: 'Alerta de backend', text: 'Um loop interno que consulta banco para cada item externo pode gerar N+1. O problema será aprofundado depois; por enquanto, reconheça e estime o custo.' }
  ] },
  { id: 'escopo', label: 'Acumuladores por nível', eyebrow: 'Estado e hierarquia', title: 'Faça o total do pedido reiniciar sem apagar o total geral', duration: '14 min', blocks: [
    { type: 'lead', text: 'Processe os itens e acompanhe os dois acumuladores. A posição da declaração determina quanto tempo cada total deve viver.' },
    { type: 'scope' },
    { type: 'note', title: 'Pergunta de escopo', text: 'O valor pertence a uma entidade externa — como pedido — ou ao processamento inteiro? Declare-o no nível correspondente.' }
  ] },
  { id: 'padroes', label: 'Padrões e saltos', eyebrow: 'Hierarquias reais', title: 'Modele relações e prove o alcance de break e continue', duration: '22 min', blocks: [
    { type: 'lead', text: 'Compare grade, pedidos, OS, páginas, tentativas, permissões e menus. Depois alterne o salto interno e veja por que o externo continua.' },
    { type: 'patterns' },
    { type: 'control' },
    { type: 'note', tone: 'warning', title: 'Labels apenas para reconhecer', text: 'Java possui break rotulado, mas nesta fase prefira uma flag clara na condição externa ou, futuramente, métodos que expressem a saída.' }
  ] },
  { id: 'clinica', label: 'Clínica de erros', eyebrow: 'Nível, escopo e custo', title: 'Diagnostique o nível errado antes de corrigir', duration: '17 min', blocks: [
    { type: 'lead', text: 'Percorra os dez diagnósticos, prove tudo primeiro com 2 × 3 e finalize o laboratório com evidências e commit limpo.' },
    { type: 'errors' }
  ] },
  { id: 'entrega', label: 'Entrega e desafio', eyebrow: 'Evidência e transferência', title: 'Entregue a hierarquia com totais verificáveis', duration: '19 min', blocks: [
    { type: 'lead', text: 'Compile os casos, prove alcance e custo, registre as saídas e resolva o relatório final sem copiar a galeria.' },
    { type: 'delivery' },
    { type: 'challenge', title: 'Desafio: relatório de centros e ordens', text: 'Crie RelatorioCentrosOrdens.java. Existem 2 centros, cada centro possui 3 ordens e cada ordem possui 2 atividades. Cada atividade custa 500 centavos. Imprima a hierarquia e os totais por ordem, por centro e geral.', acceptance: [
      'Use três laços com nomes centro, ordem e atividade.',
      'Prove 2 × 3 × 2 = 12 atividades.',
      'O total de cada ordem deve ser 1000 centavos e reiniciar no nível correto.',
      'O total de cada centro deve ser 3000 centavos e reiniciar por centro.',
      'O total geral deve ser 6000 centavos e sobreviver a todos os laços.',
      'Compile, registre as saídas e faça commit sem arquivos .class.'
    ] }
  ] }
];

export default function GuidedNestedLoopsLesson043({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(saved) ? saved.filter(id => steps.some(step => step.id === id)) : []); } catch { return new Set(); } });
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds])); }, [completedStepIds]);
  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  useEffect(() => { if (completionNormalizedRef.current) return; completionNormalizedRef.current = true; if (isCompleted && !allStepsComplete) onToggleCompleted(); }, [allStepsComplete, isCompleted, onToggleCompleted]);
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleActiveStep = () => { if (activeStepComplete && isCompleted) onToggleCompleted(); setCompletedStepIds(previous => { const next = new Set(previous); if (next.has(activeStep.id)) next.delete(activeStep.id); else next.add(activeStep.id); return next; }); };

  return <article className="guided-git-lesson guided-nested-loops-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Grid3X3 size={17} /> Repetição em níveis</span><p className="guided-sequence">043 · M1.23</p><h1>Laços Aninhados — Para Cada X, Percorra Y</h1><p>Visualize o loop interno reiniciando, calcule o trabalho multiplicado e posicione cada acumulador no nível certo. Você vai modelar grades e hierarquias sem perder o controle do fluxo.</p></div><div className="guided-hero-status"><Grid3X3 size={42} /><strong>{progress}%</strong><span>{completedStepIds.size} de {steps.length} etapas concluídas</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'X × Y', label: 'execuções internas' }, { value: '3', label: 'níveis praticados' }, { value: '10', label: 'diagnósticos praticáveis' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 043"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Laços aninhados dominados!</h3><p>{lessonComplete ? 'Reinício, multiplicação, escopo e hierarquia consolidados.' : 'Conclua a aula para consolidar a entrega.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 042</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Laços aninhados consolidados' : allStepsComplete ? 'Use o botão acima' : 'Percorra, estime e prove o escopo'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir Validação de Entrada'}>Aula 044 <ArrowRight size={17} /></button></footer>
  </article>;
}
