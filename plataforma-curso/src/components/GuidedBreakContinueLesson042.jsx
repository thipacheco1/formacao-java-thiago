import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2,
  Clock3, Copy, FileCode2, FastForward, Lightbulb, ListChecks, Octagon,
  Play, RefreshCw, RotateCcw, Search, SkipForward, Sparkles, Terminal, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedBreakContinueLesson.css';

const STORAGE_KEY = 'guided-break-continue-lesson-042-progress';

const BREAK_CODE = `public class BreakMinimo {
    public static void main(String[] args) {
        for (int numero = 1; numero <= 5; numero++) {
            if (numero == 3) {
                break;
            }
            System.out.println("Número: " + numero);
        }
        System.out.println("Fim do programa");
    }
}`;

const CONTINUE_CODE = `public class ContinueMinimo {
    public static void main(String[] args) {
        for (int numero = 1; numero <= 5; numero++) {
            if (numero == 3) {
                continue;
            }
            System.out.println("Número: " + numero);
        }
        System.out.println("Fim do programa");
    }
}`;

const PATTERNS = [
  {
    label: 'while: break e continue', file: 'ControleWhile.java',
    code: `int contador = 0;
while (contador < 5) {
    contador++;
    if (contador == 3) continue;
    if (contador == 5) break;
    System.out.println(contador);
}
System.out.println("Fim");`,
    output: '1\n2\n4\nFim',
    insight: 'continue exige avanço antes do salto; break encerra o while sem precisar atualizar novamente. O programa continua em “Fim”.'
  },
  {
    label: 'do while: dois saltos', file: 'ControleDoWhile.java',
    code: `int contador = 0;
do {
    contador++;
    if (contador == 3) continue;
    if (contador == 5) break;
    System.out.println(contador);
} while (contador < 10);
System.out.println("Fim");`,
    output: '1\n2\n4\nFim',
    insight: 'continue vai ao teste final do do while; break sai imediatamente. A atualização antes dos dois mantém o estado compreensível.'
  },
  {
    label: 'Busca e parada', file: 'BuscaPedidoBreak.java',
    code: `boolean encontrado = false;
for (int pedido = 1; pedido <= 10; pedido++) {
    System.out.println("Verificando pedido " + pedido);
    if (pedido == 7) {
        encontrado = true;
        System.out.println("Pedido encontrado: " + pedido);
        break;
    }
}
System.out.println("Encontrado: " + encontrado);`,
    output: 'Verificando pedido 1 ... 7\nPedido encontrado: 7\nEncontrado: true',
    insight: 'Depois de encontrar o pedido, continuar a busca não produz valor. break encerra somente o loop; o programa segue depois dele.'
  },
  {
    label: 'Item inválido', file: 'PedidosCanceladosContinue.java',
    code: `int processados = 0;
int ignorados = 0;
for (int pedido = 1; pedido <= 5; pedido++) {
    if (pedido == 3) {
        ignorados++;
        System.out.println("Cancelado: " + pedido);
        continue;
    }
    processados++;
}
System.out.println(processados + " / " + ignorados);`,
    output: 'Cancelado: 3\n4 / 1',
    insight: 'O item 3 é descartado, mas 4 e 5 continuam. Contar o ignorado mantém o lote auditável.'
  },
  {
    label: 'Mensageria local/global', file: 'MensageriaDecisoes.java',
    code: `for (int cliente = 1; cliente <= 5; cliente++) {
    boolean semTelefone = cliente == 2;
    boolean servicoIndisponivel = cliente == 4;
    if (servicoIndisponivel) {
        System.out.println("Serviço indisponível");
        break;
    }
    if (semTelefone) {
        System.out.println("Sem telefone: " + cliente);
        continue;
    }
    System.out.println("Mensagem enviada: " + cliente);
}`,
    output: 'Enviada 1\nSem telefone 2\nEnviada 3\nServiço indisponível\ncliente 5 não visitado',
    insight: 'O mesmo domínio deixa clara a diferença: dado local ausente descarta um cliente; serviço global indisponível encerra o lote.'
  },
  {
    label: 'Auditoria e produto', file: 'FiltrosOperacionais.java',
    code: `for (int evento = 1; evento <= 6; evento++) {
    boolean duplicado = evento == 3 || evento == 4;
    if (duplicado) continue;
    System.out.println("Auditar " + evento);
}

for (int produto = 1; produto <= 8; produto++) {
    boolean inativo = produto == 2 || produto == 6;
    if (inativo) continue;
    System.out.println("Atualizar " + produto);
}`,
    output: 'eventos 3/4 ignorados\nprodutos 2/6 ignorados',
    insight: 'Duplicidade e inatividade são regras locais. Conte e registre os descartes antes do continue em uma aplicação real.'
  },
  {
    label: 'Pagamento local/global', file: 'PagamentosDecisoes.java',
    code: `for (int pagamento = 1; pagamento <= 5; pagamento++) {
    boolean valorInvalido = pagamento == 2;
    boolean contaIndisponivel = pagamento == 4;
    if (contaIndisponivel) {
        System.out.println("Conta indisponível");
        break;
    }
    if (valorInvalido) {
        System.out.println("Pagamento inválido: " + pagamento);
        continue;
    }
    System.out.println("Processado: " + pagamento);
}`,
    output: 'processa 1\nignora 2\nprocessa 3\npara em 4\n5 não visitado',
    insight: 'Valor inválido pertence ao item; conta contábil indisponível bloqueia o processamento como um todo.'
  },
  {
    label: 'Falha crítica', file: 'MensageriaBreak.java',
    code: `int enviadas = 0;
boolean indisponivel = false;
for (int mensagem = 1; mensagem <= 10; mensagem++) {
    if (mensagem == 6) {
        indisponivel = true;
        System.out.println("Serviço indisponível");
        break;
    }
    enviadas++;
}
System.out.println("Enviadas: " + enviadas);`,
    output: 'Serviço indisponível\nEnviadas: 5',
    insight: 'Se o serviço inteiro caiu, tentar os próximos itens não faz sentido. Registre a causa antes de interromper.'
  },
  {
    label: 'Filtro com continue', file: 'ContinueFiltroPares.java',
    code: `for (int numero = 1; numero <= 10; numero++) {
    if (numero % 2 != 0) {
        continue;
    }
    System.out.println("Par: " + numero);
}`,
    output: 'Par: 2\nPar: 4\nPar: 6\nPar: 8\nPar: 10',
    insight: 'continue funciona como filtro, mas um if positivo também pode ser mais simples. Use o salto quando ele deixa o fluxo principal mais claro.'
  },
  {
    label: 'Scanner: 999 e negativo', file: 'BreakEContinueMesmoLoop.java',
    code: `int total = 0;
int ignorados = 0;
for (int leitura = 1; leitura <= 5; leitura++) {
    int valor = scanner.nextInt();
    if (valor == 999) {
        System.out.println("Parada informada");
        break;
    }
    if (valor < 0) {
        ignorados++;
        continue;
    }
    total += valor;
}`,
    output: 'entradas: 10, -2, 20, 999\nTotal: 30\nIgnorados: 1',
    insight: 'A condição especial 999 vem antes do filtro de inválidos. Regras críticas e sentinelas devem ser avaliadas primeiro.'
  },
  {
    label: 'Scanner: filtro puro', file: 'SomaValoresValidosContinue.java',
    code: `int total = 0;
int ignorados = 0;
for (int leitura = 1; leitura <= 5; leitura++) {
    int valor = scanner.nextInt();
    if (valor <= 0) {
        ignorados++;
        continue;
    }
    total += valor;
}`,
    output: 'entradas: 10, -2, 20, 0, 5\nTotal: 35\nIgnorados: 2',
    insight: 'Sem sentinela, toda entrada é lida; valores inválidos são contados e apenas os positivos chegam ao acumulador.'
  },
  {
    label: 'while e do while', file: 'ControleNosLacos.java',
    code: `int contador = 0;
while (contador < 5) {
    contador++; // antes do continue
    if (contador == 3) continue;
    System.out.println(contador);
}

do {
    contador--;
    if (contador == 2) continue;
    System.out.println(contador);
} while (contador > 0);`,
    output: 'while: 1 2 4 5\ndo while: 4 3 1 0',
    insight: 'Nos dois laços, a variável de controle precisa mudar antes de qualquer continue que possa pular o restante do bloco.'
  },
  {
    label: 'switch dentro do for', file: 'BreakSwitchDentroFor.java',
    code: `for (int opcao = 1; opcao <= 3; opcao++) {
    switch (opcao) {
        case 1:
            System.out.println("Cadastrar");
            break;
        default:
            System.out.println("Outra opção");
            break;
    }
    System.out.println("Fim da iteração " + opcao);
}`,
    output: 'Cadastrar\nFim da iteração 1\nOutra opção\nFim da iteração 2\nOutra opção\nFim da iteração 3',
    insight: 'O break pertence ao switch mais próximo. Ele não encerra o for que envolve o switch.'
  },
  {
    label: 'Menu explícito', file: 'MenuBreak.java',
    code: `int opcao = -1;
while (opcao != 0) {
    opcao = scanner.nextInt();
    if (opcao == 1) System.out.println("Consultar");
    else if (opcao == 2) System.out.println("Processar");
    else if (opcao == 0) System.out.println("Sair");
    else System.out.println("Opção inválida");
}`,
    output: '1 → Consultar\n2 → Processar\n0 → Sair',
    insight: 'while (true) com break existe, mas quando a condição opcao != 0 é conhecida, colocá-la no topo comunica melhor a parada.'
  },
  {
    label: 'Loop interno', file: 'BreakLoopInterno.java',
    code: `// break no loop interno
for (int cliente = 1; cliente <= 3; cliente++) {
    for (int pedido = 1; pedido <= 3; pedido++) {
        if (pedido == 2) break;
        System.out.println(cliente + " / " + pedido);
    }
}

// continue no loop interno
for (int linha = 1; linha <= 2; linha++) {
    for (int coluna = 1; coluna <= 3; coluna++) {
        if (coluna == 2) continue;
        System.out.println(linha + " / " + coluna);
    }
}`,
    output: 'break: 1/1, 2/1, 3/1\ncontinue: 1/1, 1/3, 2/1, 2/3',
    insight: 'Os dois atuam no loop interno mais próximo: break encerra pedidos; continue pula somente a coluna 2.'
  }
];

const ERRORS = [
  { title: 'break no lugar de continue', code: `if (registro == 3) {
    break;
}`, symptom: 'Registros 4 até 10 nunca são processados.', cause: 'Um item inválido foi tratado como falha do lote inteiro.', fix: 'Use continue se somente o registro 3 deve ser ignorado.' },
  { title: 'continue em falha global', code: `if (servicoIndisponivel) {
    continue;
}`, symptom: 'O programa insiste em todas as mensagens mesmo sem serviço.', cause: 'A falha impede qualquer item seguinte, não apenas o atual.', fix: 'Registre a indisponibilidade e use break ou tratamento de erro adequado.' },
  { title: 'continue antes do incremento', code: `int contador = 1;
while (contador <= 5) {
    if (contador == 3) continue;
    contador++;
}`, symptom: 'Loop infinito quando contador chega a 3.', cause: 'continue pula contador++; a condição permanece verdadeira para sempre.', fix: 'Atualize antes do if, ou reorganize o fluxo para garantir avanço em todo caminho.' },
  { title: 'break esconde limite conhecido', code: `for (int i = 1; i <= 100; i++) {
    if (i > 5) break;
}`, symptom: 'A regra real está dividida entre cabeçalho e bloco.', cause: 'O limite 5 já era conhecido antes do loop.', fix: 'Use i <= 5 diretamente na condição.' },
  { title: 'continue demais', code: `if (item == 2) continue;
if (item == 4) continue;
if (item == 7) continue;`, symptom: 'A regra fica espalhada e difícil de explicar.', cause: 'Três saltos escondem uma única política de itens ignorados.', fix: 'Nomeie boolean itemIgnorado = item == 2 || item == 4 || item == 7.' },
  { title: 'break do switch confundido', code: `for (...) {
    switch (opcao) {
        case 0: break;
    }
}`, symptom: 'O for continua após a opção 0.', cause: 'break interrompe o switch mais próximo.', fix: 'Use uma condição/flag do loop externo; não presuma que o break atravessa estruturas.' },
  { title: 'Ignorado sem contador', code: `if (pedidoCancelado) {
    continue;
}`, symptom: 'O resumo diz apenas quantos foram processados.', cause: 'O salto descartou também a evidência operacional.', fix: 'Incremente pedidosIgnorados e registre o motivo antes de continue.' },
  { title: 'Parada sem motivo', code: `if (registro == 6) {
    break;
}`, symptom: 'O lote termina silenciosamente no registro 6.', cause: 'Não existe evidência que explique a interrupção antecipada.', fix: 'Registre o motivo e o identificador antes do break.' },
  { title: 'Salto sem necessidade', code: `if (numero % 2 != 0) continue;
System.out.println(numero);`, symptom: 'Funciona, mas pode ser mais difícil que a condição positiva.', cause: 'continue não melhorou a leitura neste caso pequeno.', fix: 'Considere if (numero % 2 == 0) { println(...); }.' },
  { title: 'Cenários não testados', code: `// testado apenas com todos válidos`, symptom: 'Falhas aparecem somente em produção.', cause: 'Não foram exercitados item inválido, falha crítica nem sua ordem.', fix: 'Teste todos válidos, inválido antes/depois da falha e falha no primeiro item.' }
];

const EVIDENCE = `# Aula 042 — Break e Continue

- [ ] Provei que break encerra o loop, não o programa
- [ ] Provei que continue pula somente a iteração atual
- [ ] Diferenciei item inválido de falha crítica
- [ ] Usei break em for, while e do while
- [ ] Usei continue sem bloquear a variável de controle
- [ ] Comparei break e continue dentro do loop interno
- [ ] Preferi condição explícita quando o menu já conhecia a saída
- [ ] Registrei itens ignorados e motivo da parada
- [ ] Expliquei break dentro de switch e loop aninhado
- [ ] Comparei continue com if positivo
- [ ] Ordenei sentinela crítica antes do filtro
- [ ] Diferenciei falha local/global em mensageria e pagamento
- [ ] Filtrei duplicidade de auditoria e produto inativo
- [ ] Testei todos válidos, item inválido e falha global

## Decisão
O evento que interrompe todo o lote é:
O evento que descarta somente um item é:
A evidência registrada antes do salto é:`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); } };
  return <button type="button" className="bc42-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file bc42-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function FlowContrastLab() {
  const [mode, setMode] = useState('break');
  const values = [1, 2, 3, 4, 5];
  const result = mode === 'break' ? [1, 2] : [1, 2, 4, 5];
  return <section className="bc42-contrast" aria-label="Comparação entre parar e pular uma iteração">
    <div className="bc42-mode"><button type="button" className={mode === 'break' ? 'active stop' : ''} onClick={() => setMode('break')}><Octagon size={16} /> break: parar</button><button type="button" className={mode === 'continue' ? 'active skip' : ''} onClick={() => setMode('continue')}><SkipForward size={16} /> continue: pular</button></div>
    <div className="bc42-track">{values.map(value => { const trigger = value === 3; const unreachable = mode === 'break' && value > 3; return <div key={value} className={(trigger ? `trigger ${mode}` : '') + (unreachable ? ' unreachable' : '')}><span>{value}</span><strong>{trigger ? mode : unreachable ? 'não visitado' : 'processa'}</strong></div>; })}</div>
    <div className="bc42-result"><span>console</span><code>{result.join(' · ')}</code><strong>{mode === 'break' ? 'o loop terminou; o programa segue depois dele' : 'somente o valor 3 foi pulado'}</strong></div>
  </section>;
}

function FirstProgramsLab() {
  const [mode, setMode] = useState('break');
  const code = mode === 'break' ? BREAK_CODE : CONTINUE_CODE;
  const output = mode === 'break' ? 'Número: 1\nNúmero: 2\nFim do programa' : 'Número: 1\nNúmero: 2\nNúmero: 4\nNúmero: 5\nFim do programa';
  return <section><div className="bc42-tabs"><button type="button" className={mode === 'break' ? 'active' : ''} onClick={() => setMode('break')}>BreakMinimo.java</button><button type="button" className={mode === 'continue' ? 'active' : ''} onClick={() => setMode('continue')}>ContinueMinimo.java</button></div><div className="bc42-first-grid"><CodePanel name={mode === 'break' ? 'BreakMinimo.java' : 'ContinueMinimo.java'} code={code} /><div className="bc42-terminal"><header><Terminal size={15} /> PowerShell</header><pre><strong>PS&gt; javac {mode === 'break' ? 'BreakMinimo.java' : 'ContinueMinimo.java'}{`\nPS> java ${mode === 'break' ? 'BreakMinimo' : 'ContinueMinimo'}`}</strong>{'\n'}{output}</pre></div></div></section>;
}

const BATCH = [
  { id: 1, status: 'ok' }, { id: 2, status: 'invalid' }, { id: 3, status: 'ok' },
  { id: 4, status: 'critical' }, { id: 5, status: 'ok' }, { id: 6, status: 'invalid' }
];

function BatchDecisionLab() {
  const [index, setIndex] = useState(0);
  const [processed, setProcessed] = useState([]);
  const [ignored, setIgnored] = useState([]);
  const [stopped, setStopped] = useState(false);
  const current = BATCH[index];
  const act = action => {
    if (stopped || !current) return;
    if (action === 'break') { setStopped(true); return; }
    if (action === 'continue') setIgnored(previous => [...previous, current.id]);
    else setProcessed(previous => [...previous, current.id]);
    setIndex(value => value + 1);
  };
  const reset = () => { setIndex(0); setProcessed([]); setIgnored([]); setStopped(false); };
  const recommendation = current?.status === 'critical' ? 'break' : current?.status === 'invalid' ? 'continue' : 'processar';
  return <section className="bc42-batch">
    <div className="bc42-batch-track">{BATCH.map((item, position) => <div key={item.id} className={(position === index && !stopped ? 'active ' : '') + (processed.includes(item.id) ? 'processed ' : '') + (ignored.includes(item.id) ? 'ignored ' : '') + (stopped && position >= index ? 'unvisited ' : '')}><span>{item.id}</span><strong>{item.status === 'ok' ? 'válido' : item.status === 'invalid' ? 'inválido' : 'crítico'}</strong></div>)}</div>
    <div className="bc42-batch-console"><div><span>processados</span><strong>{processed.length ? processed.join(', ') : '—'}</strong></div><div><span>ignorados</span><strong>{ignored.length ? ignored.join(', ') : '—'}</strong></div><div><span>estado</span><strong>{stopped ? 'lote interrompido' : index >= BATCH.length ? 'lote concluído' : `item ${current.id}`}</strong></div></div>
    {!stopped && current && <div className="bc42-batch-actions"><span>Decida para o item {current.id}: recomendação <b>{recommendation}</b></span><button type="button" onClick={() => act('processar')} disabled={current.status !== 'ok'}><Play size={14} /> Processar</button><button type="button" onClick={() => act('continue')} disabled={current.status !== 'invalid'}><SkipForward size={14} /> continue</button><button type="button" onClick={() => act('break')} disabled={current.status !== 'critical'}><Octagon size={14} /> break</button></div>}
    {(stopped || index >= BATCH.length) && <button type="button" className="bc42-reset" onClick={reset}><RefreshCw size={14} /> Reiniciar lote</button>}
  </section>;
}

function WhileTrapLab() {
  const [fixed, setFixed] = useState(false);
  const code = fixed
    ? `int contador = 0;\nwhile (contador < 5) {\n    contador++; // avança antes do salto\n    if (contador == 3) continue;\n    System.out.println(contador);\n}`
    : `int contador = 1;\nwhile (contador <= 5) {\n    if (contador == 3) continue;\n    System.out.println(contador);\n    contador++; // nunca alcançado no 3\n}`;
  return <section className="bc42-trap"><div className="bc42-trap-head"><span className={fixed ? 'safe' : 'danger'}>{fixed ? 'Fluxo seguro' : 'Loop infinito no 3'}</span><button type="button" onClick={() => setFixed(value => !value)}><Wrench size={14} /> {fixed ? 'Ver defeito' : 'Aplicar correção'}</button></div><CodePanel name={fixed ? 'ContinueWhileCorrigido.java' : 'ContinuePerigosoWhile.java'} code={code} /><div className="bc42-trace">{(fixed ? ['1', '2', '3 pula', '4', '5', 'fim'] : ['1', '2', '3', '3', '3', '∞']).map((value, index) => <span key={`${value}-${index}`} className={!fixed && index >= 2 ? 'danger' : ''}>{value}</span>)}</div><p>{fixed ? 'Todo caminho atualiza contador antes de poder executar continue.' : 'No valor 3, continue volta ao teste sem executar contador++; o estado nunca muda.'}</p></section>;
}

function PatternGallery() {
  const [selected, setSelected] = useState(0);
  const item = PATTERNS[selected];
  return <section className="bc42-gallery"><nav>{PATTERNS.map((entry, index) => <button type="button" key={entry.label} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>{entry.label}</button>)}</nav><div className="bc42-gallery-content"><CodePanel name={item.file} code={item.code} /><div className="bc42-output"><header><Terminal size={15} /> Evidência</header><pre>{item.output}</pre><p><Sparkles size={16} /> {item.insight}</p></div></div></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="bc42-clinic"><nav>{ERRORS.map((entry, index) => <button type="button" key={entry.title} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span>{entry.title}</button>)}</nav><div className="bc42-diagnosis"><header><AlertTriangle size={20} /><div><small>Caso {selected + 1} de {ERRORS.length}</small><h3>{item.title}</h3></div></header><CodePanel name="Código sob investigação" code={item.code} /><div className="bc42-symptom"><strong>Sintoma</strong><code>{item.symptom}</code></div><div className="bc42-recovery"><span><Search size={16} /><div><strong>Causa</strong><p>{item.cause}</p></div></span><span><Wrench size={16} /><div><strong>Correção</strong><p>{item.fix}</p></div></span></div></div></section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: 'Criar laboratório', command: 'New-Item -ItemType Directory -Force labs\\m1\\aula-042-break-continue\ncd labs\\m1\\aula-042-break-continue', output: 'Directory: ...\\labs\\m1\\aula-042-break-continue', note: 'Comece pelos dois programas mínimos e avance para lote, Scanner e estruturas aninhadas.' },
    { title: 'Compilar núcleo', command: 'javac BreakMinimo.java ContinueMinimo.java BreakEContinueMesmoLoop.java BreakSwitchDentroFor.java\njava BreakMinimo\njava ContinueMinimo', output: 'break: 1, 2, Fim\ncontinue: 1, 2, 4, 5, Fim', note: 'A presença de “Fim” prova que break encerrou o loop, não o processo Java.' },
    { title: 'Testar decisões', command: 'java BreakEContinueMesmoLoop\n# teste: 10, -2, 20, 999\n# teste: 999 no primeiro valor\n# teste: cinco valores válidos', output: 'Total 30 / ignorados 1\nTotal 0 / parada imediata\nTotal conforme a soma / ignorados 0', note: 'Exercite a ordem: sentinela, item inválido e caminho válido.' },
    { title: 'Versionar entrega', command: 'git status\ngit diff\ngit add labs/m1/aula-042-break-continue docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 042: pratica break e continue em Java"\ngit status', output: 'nothing to commit, working tree clean', note: 'Revise o staged e mantenha arquivos .class fora do commit.' }
  ];
  const current = stages[stage];
  return <section><div className="bc42-delivery-nav">{stages.map((entry, index) => <button type="button" key={entry.title} className={index === stage ? 'active' : ''} onClick={() => setStage(index)}><span>{index + 1}</span>{entry.title}</button>)}</div><div className="bc42-terminal"><header><Terminal size={15} /> PowerShell <small>passo {stage + 1} de {stages.length}</small></header><pre><strong>PS&gt; {current.command}</strong>{'\n\n'}{current.output}</pre><p><Lightbulb size={16} /> {current.note}</p></div><div className="guided-file bc42-code bc42-diary"><div className="guided-file-title"><FastForward size={16} /> docs/diario-de-bordo.md<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>{EVIDENCE}</SyntaxHighlighter></div></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'contrast') return <FlowContrastLab />;
  if (block.type === 'first') return <FirstProgramsLab />;
  if (block.type === 'batch') return <BatchDecisionLab />;
  if (block.type === 'trap') return <WhileTrapLab />;
  if (block.type === 'patterns') return <PatternGallery />;
  if (block.type === 'errors') return <ErrorClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

const steps = [
  { id: 'contraste', label: 'Parar ou pular', eyebrow: 'Decisão de fluxo', title: 'Veja o que desaparece depois de break e continue', duration: '9 min', blocks: [
    { type: 'lead', text: 'Alterne entre as duas instruções. O gatilho é o mesmo, numero == 3; o alcance da decisão é que muda.' },
    { type: 'contrast' },
    { type: 'note', title: 'A pergunta profissional', text: 'Falha global ou resultado já encontrado: parar. Item local inválido: registrar e pular. Essa decisão afeta todos os itens seguintes.' }
  ] },
  { id: 'primeiros', label: 'Dois programas', eyebrow: 'Código e saída', title: 'Compile duas provas mínimas e compare linha a linha', duration: '12 min', blocks: [
    { type: 'lead', text: 'Troque a aba, digite os dois arquivos e confira a saída. Em ambos, “Fim do programa” aparece porque o salto controla o loop, não encerra a JVM.' },
    { type: 'first' }
  ] },
  { id: 'lote', label: 'Decisor de lote', eyebrow: 'Simulação de backend', title: 'Classifique cada evento antes de escolher o salto', duration: '14 min', blocks: [
    { type: 'lead', text: 'Processe os itens na ordem. A interface habilita apenas a decisão coerente para que você observe processados, ignorados e não visitados.' },
    { type: 'batch' },
    { type: 'note', tone: 'warning', title: 'Auditoria antes do salto', text: 'Antes de continue, conte e registre o ignorado. Antes de break, registre a causa e o item que interrompeu o lote.' }
  ] },
  { id: 'armadilha', label: 'Armadilha no while', eyebrow: 'Loop infinito', title: 'Conserte o caminho que nunca atualiza o contador', duration: '12 min', blocks: [
    { type: 'lead', text: 'Leia o rastro defeituoso e aplique a correção. No for, a atualização do cabeçalho ainda acontece depois de continue; no while, você precisa garantir isso explicitamente.' },
    { type: 'trap' },
    { type: 'note', title: 'Também vale para do while', text: 'continue salta para o teste final do do while. Se o estado de término não mudou antes do salto, a repetição pode travar.' }
  ] },
  { id: 'padroes', label: 'Padrões e alcance', eyebrow: 'For, while, switch e aninhamento', title: 'Descubra exatamente qual estrutura será interrompida', duration: '20 min', blocks: [
    { type: 'lead', text: 'Explore busca, filtro, falha crítica, Scanner e estruturas próximas. Em cada aba, nomeie primeiro qual é a estrutura controlada.' },
    { type: 'patterns' },
    { type: 'note', tone: 'warning', title: 'Labels ficam fora desta aula', text: 'Java possui break rotulado, mas ele não é necessário aqui. Na Aula 043, prefira condições e variáveis de controle claras para laços aninhados.' }
  ] },
  { id: 'clinica', label: 'Clínica de erros', eyebrow: 'Recuperação orientada', title: 'Diagnostique decisões erradas antes de tocar no código', duration: '17 min', blocks: [
    { type: 'lead', text: 'Percorra os dez casos, reproduza o continue perigoso somente sabendo interromper com Ctrl+C e finalize com testes de cenários opostos.' },
    { type: 'errors' }
  ] },
  { id: 'entrega', label: 'Entrega e desafio', eyebrow: 'Evidência e transferência', title: 'Entregue um lote auditável com cenários opostos', duration: '19 min', blocks: [
    { type: 'lead', text: 'Execute os casos válidos, ignorados e bloqueantes, registre as saídas e só então resolva a importação final.' },
    { type: 'delivery' },
    { type: 'challenge', title: 'Desafio: importação de registros', text: 'Crie ImportacaoRegistros.java para percorrer registros de 1 a 10. Os registros 3 e 7 são inválidos e devem ser ignorados. O registro 9 representa indisponibilidade do banco e deve interromper o lote. Registre cada decisão e produza um resumo final.', acceptance: [
      'Use continue para 3 e 7, incrementando ignorados antes do salto.',
      'Use break para 9, registrando o motivo antes de interromper.',
      'Registros 1, 2, 4, 5, 6 e 8 devem ser processados; o 10 não pode ser visitado.',
      'Resumo final: 6 processados, 2 ignorados e falha crítica true.',
      'Teste também uma variação sem falha crítica e registre a diferença.',
      'Compile e faça commit limpo sem arquivos .class.'
    ] }
  ] }
];

export default function GuidedBreakContinueLesson042({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-break-continue-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><FastForward size={17} /> Controle de fluxo</span><p className="guided-sequence">042 · M1.22</p><h1>Break e Continue — Pare ou Pule com Critério</h1><p>Decida se uma falha encerra o lote inteiro ou descarta somente o item atual. Você vai visualizar o alcance do salto, diagnosticar loops infinitos e entregar um processamento auditável.</p></div><div className="guided-hero-status"><FastForward size={42} /><strong>{progress}%</strong><span>{completedStepIds.size} de {steps.length} etapas concluídas</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'break', label: 'encerra o loop' }, { value: 'continue', label: 'pula a iteração' }, { value: '10', label: 'diagnósticos praticáveis' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 042"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Decisões de fluxo dominadas!</h3><p>{lessonComplete ? 'Parada, salto, alcance e evidências consolidados.' : 'Conclua a aula para consolidar a entrega.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 041</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Break e continue consolidados' : allStepsComplete ? 'Use o botão acima' : 'Decida, registre e prove o alcance'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir Laços Aninhados'}>Aula 043 <ArrowRight size={17} /></button></footer>
  </article>;
}
