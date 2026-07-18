import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy,
  FileCode2, Gauge, Lightbulb, ListChecks, Play, RefreshCw, RotateCcw,
  Search, Sparkles, Terminal, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedForClassicLesson.css';

const STORAGE_KEY = 'guided-for-classic-lesson-041-progress';

const FIRST_FOR = `public class Main {
    public static void main(String[] args) {
        for (int contador = 1; contador <= 5; contador++) {
            System.out.println("Contador: " + contador);
        }

        System.out.println("Fim do programa");
    }
}`;

const PATTERNS = [
  {
    label: 'while × for', file: 'ComparacaoWhileFor.java',
    code: `int contador = 1;
while (contador <= 5) {
    System.out.println(contador);
    contador++;
}

for (int numero = 1; numero <= 5; numero++) {
    System.out.println(numero);
}`,
    output: 'while: 1 2 3 4 5\nfor:   1 2 3 4 5',
    insight: 'Os dois executam a mesma sequência. No while, início, teste e atualização ficam separados; no for, o controle conhecido fica reunido no cabeçalho.'
  },
  {
    label: 'Crescente e decrescente', file: 'DirecoesFor.java',
    code: `for (int numero = 1; numero <= 5; numero++) {
    System.out.println(numero);
}

for (int numero = 5; numero >= 1; numero--) {
    System.out.println(numero);
}`,
    output: '1 2 3 4 5\n5 4 3 2 1',
    insight: 'A condição e a atualização precisam se aproximar do término: <= combina com incremento; >= combina com decremento.'
  },
  {
    label: 'Passo maior', file: 'MultiplosDeCincoFor.java',
    code: `for (int numero = 5; numero <= 50; numero += 5) {
    System.out.println(numero);
}`,
    output: '5 10 15 20 25 30 35 40 45 50',
    insight: 'A atualização não precisa ser ++. O passo 5 comunica diretamente a sequência de múltiplos.'
  },
  {
    label: 'Acumulador', file: 'AcumuladorFor.java',
    code: `int total = 0;
for (int numero = 1; numero <= 5; numero++) {
    total += numero;
}
System.out.println("Total: " + total);`,
    output: 'Total: 15',
    insight: 'numero controla a repetição; total guarda a soma. São responsabilidades diferentes.'
  },
  {
    label: 'Contando pares', file: 'ContadorParesFor.java',
    code: `int quantidadePares = 0;
for (int numero = 1; numero <= 10; numero++) {
    if (numero % 2 == 0) {
        quantidadePares++;
    }
}
System.out.println("Quantidade de pares: " + quantidadePares);`,
    output: 'Quantidade de pares: 5',
    insight: 'numero controla as dez voltas; % identifica paridade; quantidadePares conta somente os casos que atendem à regra.'
  },
  {
    label: 'Scanner e soma', file: 'SomaValoresConsole.java',
    code: `System.out.println("Quantos valores deseja somar?");
int quantidade = scanner.nextInt();
int total = 0;
for (int contador = 1; contador <= quantidade; contador++) {
    System.out.println("Digite o valor " + contador + ":");
    total += scanner.nextInt();
}
System.out.println("Total: " + total);`,
    output: 'quantidade: 3\nvalores: 4, 5, 6\nTotal: 15',
    insight: 'O limite vem da entrada, mas ainda é conhecido antes do loop começar.'
  },
  {
    label: 'Lote e resultado', file: 'ProcessamentoLoteResultadoFor.java',
    code: `int sucesso = 0;
int erros = 0;
for (int registro = 1; registro <= 5; registro++) {
    if (registro == 3) {
        erros++;
    } else {
        sucesso++;
    }
}
System.out.println("Sucesso: " + sucesso);
System.out.println("Erro: " + erros);`,
    output: 'Sucesso: 4\nErro: 1',
    insight: 'Processamento de lote exige contadores separados para resultados diferentes; o total continua verificável: 4 + 1 = 5.'
  },
  {
    label: 'Produtos ativos', file: 'ProdutosFor.java',
    code: `int ativos = 0;
int inativos = 0;
for (int produto = 1; produto <= 5; produto++) {
    boolean ativo = produto % 2 != 0;
    if (ativo) ativos++;
    else inativos++;
}
System.out.println("Ativos: " + ativos);
System.out.println("Inativos: " + inativos);`,
    output: 'Ativos: 3\nInativos: 2',
    insight: 'Um contador controla o lote e dois acumuladores de contagem classificam resultados mutuamente exclusivos.'
  },
  {
    label: 'Bloco com uma intenção', file: 'ProcessamentoLegivelFor.java',
    code: `for (int registro = 1; registro <= total; registro++) {
    validar(registro);
    calcular(registro);
    consultar(registro);
    enviar(registro);
    registrar(registro);
}`,
    output: 'Sinal de alerta: muitas responsabilidades por iteração',
    insight: 'O for controla repetição; ele não deve esconder validação, consulta, envio e registro extensos no mesmo bloco. Métodos futuros separarão essas responsabilidades.'
  },
  {
    label: 'Paginação e tentativas', file: 'PaginacaoFor.java',
    code: `for (int pagina = 1; pagina <= totalPaginas; pagina++) {
    System.out.println("Buscando página " + pagina);
}

for (int tentativa = 1;
        tentativa <= limiteTentativas;
        tentativa++) {
    System.out.println("Tentativa " + tentativa);
}`,
    output: 'Buscando página 1 ... 4\nTentativa 1 ... 3',
    insight: 'Nomes de domínio tornam o controle legível. Se a próxima página só for descoberta na resposta, while pode comunicar melhor.'
  },
  {
    label: 'Mensageria e auditoria', file: 'OperacoesControladasFor.java',
    code: `int mensagensEnviadas = 0;
for (int mensagem = 1; mensagem <= 4; mensagem++) {
    System.out.println("Enviando mensagem " + mensagem);
    mensagensEnviadas++;
}

for (int evento = 1; evento <= 3; evento++) {
    System.out.println("Registrando auditoria " + evento);
}`,
    output: 'Mensagens enviadas: 4\nAuditoria: eventos 1, 2 e 3\nAuditoria finalizada',
    insight: 'Quando a quantidade é conhecida, o for nomeia a unidade do domínio. Uma fila que cresce ou paginação descoberta por resposta pode pedir while.'
  },
  {
    label: 'Pedido e parcelas', file: 'ParcelasFor.java',
    code: `long valorParcelaCentavos = 5000L;
int quantidadeParcelas = 6;
long totalCentavos = 0L;
for (int parcela = 1;
        parcela <= quantidadeParcelas;
        parcela++) {
    totalCentavos += valorParcelaCentavos;
}
System.out.println("Total: " + totalCentavos);`,
    output: 'Total: 30000',
    insight: 'Centavos evitam ponto flutuante neste exemplo inicial. O for repete uma parcela conhecida seis vezes.'
  },
  {
    label: 'Duas variáveis', file: 'DuasVariaveisFor.java',
    code: `for (int inicio = 1, fim = 5;
        inicio <= fim;
        inicio++, fim--) {
    System.out.println(inicio + " / " + fim);
}`,
    output: '1 / 5\n2 / 4\n3 / 3',
    insight: 'O recurso existe, mas eleva a carga de leitura. Prefira um contador quando dois não trazem benefício claro.'
  },
  {
    label: 'break e continue', file: 'ControleInicialFor.java',
    code: `for (int numero = 1; numero <= 5; numero++) {
    if (numero == 3) {
        continue;
    }
    if (numero == 5) {
        break;
    }
    System.out.println(numero);
}`,
    output: '1\n2\n4',
    insight: 'continue pula somente a iteração 3; break encerra ao chegar em 5. A Aula 042 aprofundará a decisão entre pular e parar.'
  }
];

const ERRORS = [
  { title: 'Atualização ausente', code: `for (int contador = 1; contador <= 5;) {
    System.out.println(contador);
}`, symptom: 'Imprime 1 indefinidamente.', cause: 'A condição nunca muda porque contador não é atualizado.', fix: 'Use contador++ na terceira parte do for.' },
  { title: 'Direção errada', code: `for (int contador = 1; contador <= 5; contador--) {
    System.out.println(contador);
}`, symptom: '1, 0, -1, -2... sem terminar.', cause: 'O decremento afasta o valor do limite superior.', fix: 'Use contador++ ou redesenhe início, condição e direção como um conjunto.' },
  { title: 'Limite excluído sem querer', code: `for (int contador = 1; contador < 5; contador++) {
    System.out.println(contador);
}`, symptom: 'Imprime 1, 2, 3, 4; o 5 não aparece.', cause: '< exclui o limite.', fix: 'Para incluir 5, use contador <= 5.' },
  { title: 'Índice zero-based com <=', code: `for (int indice = 0; indice <= 5; indice++) {
    System.out.println(indice);
}`, symptom: 'Executa 6 vezes: 0 até 5.', cause: 'Cinco posições zero-based são 0, 1, 2, 3 e 4.', fix: 'Use indice < 5 para cinco posições.' },
  { title: 'Duplo incremento', code: `for (int i = 1; i <= 5; i++) {
    System.out.println(i);
    i++;
}`, symptom: 'Imprime 1, 3, 5; valores são pulados.', cause: 'O contador muda no bloco e novamente na atualização do for.', fix: 'Mantenha a atualização em um único lugar.' },
  { title: 'Contador fora do escopo', code: `for (int contador = 1; contador <= 5; contador++) { }
System.out.println(contador);`, symptom: 'cannot find symbol: variable contador', cause: 'A variável declarada no cabeçalho existe apenas no bloco do for.', fix: 'Use-a dentro do loop; declare antes somente quando o valor final for realmente necessário.' },
  { title: 'Contador confundido com total', code: `for (int total = 1; total <= 5; total++) { }
System.out.println(total);`, symptom: 'Além do escopo inválido, nenhum valor foi acumulado.', cause: 'total foi usado como contador, não como acumulador.', fix: 'Declare int total = 0 antes e faça total += numero dentro do for.' },
  { title: 'for esconde a intenção', code: `for (; opcao != 0;) {
    mostrarMenu();
}`, symptom: 'Compila, mas o cabeçalho não representa uma contagem.', cause: 'A repetição depende de uma escolha aberta, não de início/passo conhecidos.', fix: 'Use while ou do while para comunicar um menu.' },
  { title: 'break corrige limite ruim', code: `for (int i = 1; i <= 1000; i++) {
    if (i > 10) break;
}`, symptom: 'Funciona, mas a regra está dividida em dois lugares.', cause: 'O limite real já era conhecido: 10.', fix: 'Escreva i <= 10 na condição. Reserve break para parada antecipada real.' },
  { title: 'Primeiro e último não testados', code: `for (int item = 1; item < total; item++) {
    processar(item);
}`, symptom: 'O último item pode nunca ser processado.', cause: 'Não houve prova dos valores de fronteira nem da quantidade de iterações.', fix: 'Liste primeiro, último e total esperado antes de executar.' }
];

const EVIDENCE = `# Aula 041 — For clássico

- [ ] Identifiquei inicialização, condição e atualização
- [ ] Narrei a ordem: inicializa, testa, bloco, atualiza, testa
- [ ] Criei for crescente e decrescente
- [ ] Provei cinco iterações em 1..5 e em 0..<5
- [ ] Diagnostiquei um erro off-by-one
- [ ] Diferenciei contador e acumulador
- [ ] Comparei while e for com a mesma saída
- [ ] Contei pares com módulo e contador
- [ ] Classifiquei produtos ativos e inativos
- [ ] Usei passo maior que 1
- [ ] Modelei lote, paginação, tentativas e parcelas
- [ ] Expliquei o escopo do contador
- [ ] Escolhi while quando a condição era aberta
- [ ] Reconheci um bloco com responsabilidades demais
- [ ] Testei primeiro valor, último valor e total de iterações

## Decisão
O meu início é:
O limite é inclusivo/exclusivo porque:
A atualização aproxima o contador do término porque:`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); }
  };
  return <button type="button" className="fr41-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file fr41-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function ForAnimator() {
  const [phase, setPhase] = useState(0);
  const [counter, setCounter] = useState(1);
  const [printed, setPrinted] = useState([]);
  const done = phase === 4;
  const labels = ['inicialização', 'condição', 'bloco', 'atualização', 'fim'];

  const next = () => {
    if (phase === 0) { setCounter(1); setPhase(1); return; }
    if (phase === 1) { setPhase(counter <= 3 ? 2 : 4); return; }
    if (phase === 2) { setPrinted(previous => [...previous, counter]); setPhase(3); return; }
    if (phase === 3) { setCounter(value => value + 1); setPhase(1); }
  };
  const reset = () => { setPhase(0); setCounter(1); setPrinted([]); };

  return <section className="fr41-animator" aria-label="Simulador passo a passo da ordem do for">
    <div className="fr41-for-line"><span className={phase === 0 ? 'active' : ''}>int contador = 1</span><b>;</b><span className={phase === 1 ? 'active' : ''}>contador &lt;= 3</span><b>;</b><span className={phase === 3 ? 'active' : ''}>contador++</span></div>
    <div className="fr41-cycle">
      {labels.map((label, index) => <div key={label} className={(phase === index ? 'active ' : '') + (index === 4 && done ? 'finished' : '')}><span>{index + 1}</span><strong>{label}</strong>{index === 1 && <small>{counter} ≤ 3 → {counter <= 3 ? 'true' : 'false'}</small>}{index === 2 && <small>imprime {counter}</small>}{index === 3 && <small>{counter} vira {counter + 1}</small>}</div>)}
    </div>
    <div className="fr41-anim-controls"><div><span>contador</span><strong>{counter}</strong></div><div><span>console</span><strong>{printed.length ? printed.join(' · ') : '—'}</strong></div><button type="button" onClick={next} disabled={done}><Play size={15} /> Executar próximo passo</button><button type="button" onClick={reset}><RefreshCw size={15} /> Reiniciar</button></div>
  </section>;
}

function FirstProgramLab() {
  const [ran, setRan] = useState(false);
  return <section className="fr41-first-lab"><CodePanel name="Main.java" code={FIRST_FOR} /><div className="fr41-terminal"><header><Terminal size={15} /> PowerShell</header><pre><strong>PS&gt; javac Main.java</strong>{ran ? '\nPS&gt; java Main\nContador: 1\nContador: 2\nContador: 3\nContador: 4\nContador: 5\nFim do programa' : '\n(compilação sem mensagem = sucesso)'}</pre><button type="button" className="fr41-run" onClick={() => setRan(true)}><Play size={15} /> Executar</button></div></section>;
}

function BoundaryLab() {
  const [start, setStart] = useState(0);
  const [operator, setOperator] = useState('<');
  const [limit, setLimit] = useState(5);
  const values = [];
  for (let i = start; operator === '<' ? i < limit : i <= limit; i++) {
    values.push(i);
    if (values.length > 12) break;
  }
  return <section className="fr41-boundary">
    <div className="fr41-boundary-controls"><label>Início<select value={start} onChange={event => setStart(Number(event.target.value))}><option value="0">0</option><option value="1">1</option></select></label><label>Operador<select value={operator} onChange={event => setOperator(event.target.value)}><option value="<">&lt;</option><option value="<=">&lt;=</option></select></label><label>Limite<select value={limit} onChange={event => setLimit(Number(event.target.value))}><option value="4">4</option><option value="5">5</option></select></label></div>
    <code>for (int i = {start}; i {operator} {limit}; i++)</code>
    <div className="fr41-values">{values.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}</div>
    <div className="fr41-boundary-result"><strong>{values.length} iterações</strong><span>primeiro: {values[0] ?? 'nenhum'} · último: {values.at(-1) ?? 'nenhum'}</span></div>
  </section>;
}

function AccumulatorLab() {
  const [step, setStep] = useState(0);
  const totals = [1, 3, 6, 10, 15];
  return <section className="fr41-accumulator">
    <div className="fr41-acc-grid"><span className="head">iteração</span><span className="head">numero</span><span className="head">total</span>{[1,2,3,4,5].flatMap(value => [<span key={`i${value}`} className={step === value ? 'active' : ''}>{value}</span>, <span key={`n${value}`} className={step === value ? 'active' : ''}>{step >= value ? value : '—'}</span>, <span key={`t${value}`} className={step === value ? 'active' : ''}>{step >= value ? totals[value - 1] : '—'}</span>])}</div>
    <div className="fr41-acc-state"><div><span>contador atual</span><strong>{step || '—'}</strong></div><div><span>acumulador total</span><strong>{step ? totals[step - 1] : 0}</strong></div><button type="button" disabled={step === 5} onClick={() => setStep(value => value + 1)}>Próxima iteração <ArrowRight size={14} /></button><button type="button" onClick={() => setStep(0)}><RefreshCw size={14} /> Reiniciar</button></div>
  </section>;
}

function PatternGallery() {
  const [selected, setSelected] = useState(0);
  const item = PATTERNS[selected];
  return <section className="fr41-gallery"><nav>{PATTERNS.map((entry, index) => <button type="button" key={entry.label} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>{entry.label}</button>)}</nav><div className="fr41-gallery-content"><CodePanel name={item.file} code={item.code} /><div className="fr41-output"><header><Terminal size={15} /> Saída esperada</header><pre>{item.output}</pre><p><Sparkles size={16} /> {item.insight}</p></div></div></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="fr41-clinic"><nav>{ERRORS.map((entry, index) => <button type="button" key={entry.title} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span>{entry.title}</button>)}</nav><div className="fr41-diagnosis"><header><AlertTriangle size={20} /><div><small>Caso {selected + 1} de {ERRORS.length}</small><h3>{item.title}</h3></div></header><CodePanel name="Código sob investigação" code={item.code} /><div className="fr41-symptom"><strong>Sintoma</strong><code>{item.symptom}</code></div><div className="fr41-recovery"><span><Search size={16} /><div><strong>Causa</strong><p>{item.cause}</p></div></span><span><Wrench size={16} /><div><strong>Correção</strong><p>{item.fix}</p></div></span></div></div></section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: 'Criar laboratório', command: 'New-Item -ItemType Directory -Force labs\\m1\\aula-041-for-classico\ncd labs\\m1\\aula-041-for-classico', output: 'Directory: ...\\labs\\m1\\aula-041-for-classico', note: 'Crie os arquivos conforme praticar cada padrão; a evidência importa mais que gerar muitos arquivos de uma vez.' },
    { title: 'Compilar o núcleo', command: 'javac Main.java ForCrescente.java ForDecrescente.java ForZeroBased.java AcumuladorFor.java\njava Main\njava AcumuladorFor', output: 'Contador: 1 ... 5\nFim do programa\nTotal: 15', note: 'Se javac não imprimir nada, a compilação terminou com sucesso.' },
    { title: 'Provar fronteiras', command: 'java ForOffByOne\n# compare 1..<5, 1..<=5 e 0..<5', output: '1..<5  => 1 2 3 4 (4 vezes)\n1..<=5 => 1 2 3 4 5 (5 vezes)\n0..<5  => 0 1 2 3 4 (5 vezes)', note: 'Registre primeiro valor, último valor e quantidade. Essa tríade encontra off-by-one antes de arrays.' },
    { title: 'Versionar entrega', command: 'git status\ngit diff\ngit add labs/m1/aula-041-for-classico docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 041: pratica for classico em Java"\ngit status', output: 'nothing to commit, working tree clean', note: 'Confirme que nenhum .class entrou no staged; se necessário, ajuste o .gitignore.' }
  ];
  const current = stages[stage];
  return <section><div className="fr41-delivery-nav">{stages.map((entry, index) => <button type="button" key={entry.title} className={index === stage ? 'active' : ''} onClick={() => setStage(index)}><span>{index + 1}</span>{entry.title}</button>)}</div><div className="fr41-terminal"><header><Terminal size={15} /> PowerShell <small>passo {stage + 1} de {stages.length}</small></header><pre><strong>PS&gt; {current.command}</strong>{'\n\n'}{current.output}</pre><p><Lightbulb size={16} /> {current.note}</p></div><div className="guided-file fr41-code fr41-diary"><div className="guided-file-title"><Gauge size={16} /> docs/diario-de-bordo.md<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>{EVIDENCE}</SyntaxHighlighter></div></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'animator') return <ForAnimator />;
  if (block.type === 'first') return <FirstProgramLab />;
  if (block.type === 'boundary') return <BoundaryLab />;
  if (block.type === 'accumulator') return <AccumulatorLab />;
  if (block.type === 'patterns') return <PatternGallery />;
  if (block.type === 'errors') return <ErrorClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

const steps = [
  { id: 'motor', label: 'Motor do for', eyebrow: 'Ordem de execução', title: 'Faça cada parte do for acontecer na sua frente', duration: '10 min', blocks: [
    { type: 'lead', text: 'Clique em “Executar próximo passo” e narre em voz alta: inicialização uma vez; depois condição, bloco, atualização e condição novamente.' },
    { type: 'animator' },
    { type: 'note', title: 'A atualização não vem antes do primeiro bloco', text: 'O contador começa em 1, a condição é testada e só depois o bloco imprime. contador++ acontece ao final de cada iteração concluída.' }
  ] },
  { id: 'primeiro', label: 'Primeiro programa', eyebrow: 'Código e terminal', title: 'Digite, compile e confira cinco execuções', duration: '12 min', blocks: [
    { type: 'lead', text: 'Crie Main.java, compile e execute. Não avance apenas porque compilou: confira a primeira linha, a última e a quantidade total.' },
    { type: 'first' },
    { type: 'note', title: 'Quando o for comunica melhor', text: 'Use-o quando início, limite e passo podem ser lidos juntos. Menu e espera por estado externo continuam mais naturais com while ou do while.' }
  ] },
  { id: 'fronteiras', label: 'Zero-based e limites', eyebrow: 'Laboratório off-by-one', title: 'Mude início e operador até prever cada fronteira', duration: '14 min', blocks: [
    { type: 'lead', text: 'Altere os três controles e tente prever o resultado antes de olhar os blocos. Compare 1 até 5 com 0 até menor que 5.' },
    { type: 'boundary' },
    { type: 'note', tone: 'warning', title: 'Off-by-one é evidência, não azar', text: 'Antes de rodar, escreva: primeiro valor, último valor e número de iterações. Arrays usarão o padrão 0 <= indice < tamanho.' }
  ] },
  { id: 'acumular', label: 'Contar e acumular', eyebrow: 'Estado por iteração', title: 'Separe quem controla de quem guarda o resultado', duration: '12 min', blocks: [
    { type: 'lead', text: 'Avance uma iteração por vez. numero muda para controlar o loop; total sobrevive às voltas e acumula 1 + 2 + 3 + 4 + 5.' },
    { type: 'accumulator' },
    { type: 'note', title: 'Escopo com intenção', text: 'O contador declarado no for fica restrito ao loop. O acumulador fica antes porque seu resultado precisa ser lido depois.' }
  ] },
  { id: 'padroes', label: 'Padrões de backend', eyebrow: 'Aplicações controladas', title: 'Modele passos, lotes, entradas, páginas e parcelas', duration: '20 min', blocks: [
    { type: 'lead', text: 'Explore os exemplos consolidados. Em cada aba, identifique início, condição, atualização e o estado que pertence ao domínio.' },
    { type: 'patterns' },
    { type: 'note', title: 'break e continue só como reconhecimento', text: 'Eles podem alterar o fluxo, mas serão aprofundados na Aula 042. Nesta aula, prefira uma condição que exponha o limite real. for (;;) é um loop infinito explícito e só deve existir com motivo e saída controlada.' }
  ] },
  { id: 'diagnostico', label: 'Clínica de erros', eyebrow: 'Sintoma, causa e recuperação', title: 'Corrija atualização, direção, limites, escopo e intenção', duration: '16 min', blocks: [
    { type: 'lead', text: 'Diagnostique cada caso pela saída ou mensagem. Antes de corrigir, diga qual parte do contrato — início, condição, atualização, escopo ou intenção — foi quebrada.' },
    { type: 'errors' }
  ] },
  { id: 'entrega', label: 'Entrega e desafio', eyebrow: 'Evidência e transferência', title: 'Prove as fronteiras e entregue sem atalhos', duration: '18 min', blocks: [
    { type: 'lead', text: 'Finalize o laboratório, registre as evidências e resolva um cenário novo sem copiar os exemplos.' },
    { type: 'delivery' },
    { type: 'challenge', title: 'Desafio: fechamento de parcelas', text: 'Crie FechamentoParcelas.java para processar 8 parcelas numeradas de 1 a 8. Parcelas múltiplas de 3 têm taxa de 200 centavos; as demais têm taxa de 100 centavos. Some o total de taxas e conte quantas parcelas receberam cada faixa. Ao final, imprima os três resultados.', acceptance: [
      'Use for clássico com contador de domínio chamado parcela.',
      'Processe exatamente 8 iterações e prove primeiro/último valor.',
      'Use acumulador long para o total em centavos.',
      'Mantenha contadores separados para taxas de 100 e 200 centavos.',
      'A saída final deve ser: total 1000 centavos, 6 parcelas de 100 e 2 parcelas de 200.',
      'Compile, registre a evidência e faça commit sem arquivos .class.'
    ] }
  ] }
];

export default function GuidedForClassicLesson041({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(saved) ? saved.filter(id => steps.some(step => step.id === id)) : []); } catch { return new Set(); }
  });
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds])); }, [completedStepIds]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;

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
    setCompletedStepIds(previous => { const next = new Set(previous); if (next.has(activeStep.id)) next.delete(activeStep.id); else next.add(activeStep.id); return next; });
  };

  return <article className="guided-git-lesson guided-for-classic-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Gauge size={17} /> Repetição controlada</span><p className="guided-sequence">041 · M1.21</p><h1>For Clássico — Controle Cada Volta</h1><p>Reúna início, condição e atualização em uma leitura só. Você vai animar a ordem real do loop, dominar fronteiras, separar contador de acumulador e aplicar o padrão em lotes de backend.</p></div><div className="guided-hero-status"><Gauge size={42} /><strong>{progress}%</strong><span>{completedStepIds.size} de {steps.length} etapas concluídas</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: '3', label: 'partes do controle' }, { value: '0..N', label: 'iterações possíveis' }, { value: '10', label: 'diagnósticos praticáveis' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 041"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>For clássico dominado!</h3><p>{lessonComplete ? 'Controle, fronteiras, acumuladores e padrões de lote consolidados.' : 'Conclua a aula para consolidar a entrega.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 040</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'For clássico consolidado' : allStepsComplete ? 'Use o botão acima' : 'Controle, fronteiras e evidências'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir Break e Continue'}>Aula 042 <ArrowRight size={17} /></button></footer>
  </article>;
}
