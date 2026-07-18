import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy, Database, FileCode2, Lightbulb, ListChecks, Play, RefreshCw, RotateCcw, Search, Sparkles, Terminal, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedNumericArraysLesson.css';

const STORAGE_KEY = 'guided-numeric-arrays-lesson-045-progress';

const CORE_CODE = `public class Main {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30, 40, 50};

        for (int indice = 0; indice < numeros.length; indice++) {
            System.out.println(
                    "Índice " + indice + ": " + numeros[indice]);
        }
    }
}`;

const PATTERNS = [
  { label: 'Declarações e padrões', file: 'TiposDeArray.java', code: `int[] numeros = new int[3];
long[] valoresCentavos = new long[3];
double[] medias = new double[3];

// Também compila, mas prefira tipo[] nome:
int numerosAlternativo[] = new int[3];

System.out.println(numeros[0]);
System.out.println(valoresCentavos[0]);
System.out.println(medias[0]);`, output: '0\n0\n0.0', insight: 'O tipo inclui os colchetes na forma preferida. Arrays numéricos criados com new começam com o valor padrão do próprio tipo.' },
  { label: 'Soma e média', file: 'MediaArray.java', code: `int[] notas = {8, 7, 10, 9};
int total = 0;
for (int indice = 0; indice < notas.length; indice++) {
    total += notas[indice];
}
double media = (double) total / notas.length;`, output: 'total = 34 | média = 8.5', insight: 'O cast acontece antes da divisão; sem ele, 34 / 4 produziria 8 por divisão inteira.' },
  { label: 'Maior e menor', file: 'ExtremosArray.java', code: `int[] valores = {15, 40, 7, 99, 23};
int maior = valores[0];
int menor = valores[0];
for (int indice = 1; indice < valores.length; indice++) {
    if (valores[indice] > maior) maior = valores[indice];
    if (valores[indice] < menor) menor = valores[indice];
}`, output: 'maior = 99 | menor = 7', insight: 'Usar o primeiro elemento evita inventar uma referência como zero, mas exige array não vazio.' },
  { label: 'Pares e válidos', file: 'FiltroArray.java', code: `int[] valores = {10, -5, 20, 0, 30};
int total = 0;
int ignorados = 0;
for (int indice = 0; indice < valores.length; indice++) {
    if (valores[indice] <= 0) {
        ignorados++;
        continue;
    }
    total += valores[indice];
}`, output: 'total válido = 60 | ignorados = 2', insight: 'O índice continua percorrendo todas as posições; continue pula apenas o processamento do valor atual.' },
  { label: 'Centavos e pedidos', file: 'PedidosValoresArray.java', code: `long[] valoresCentavos = {1000L, 2500L, 5000L, 3000L};
long totalCentavos = 0L;
for (int indice = 0; indice < valoresCentavos.length; indice++) {
    totalCentavos += valoresCentavos[indice];
}
double mediaCentavos =
        (double) totalCentavos / valoresCentavos.length;`, output: 'total = 11500 centavos | média = 2875.0', insight: 'Dinheiro continua inteiro em long e centavos. Formatação monetária profissional fica para outra etapa.' },
  { label: 'Estoque', file: 'EstoqueProdutosArray.java', code: `int[] estoques = {10, 0, 5, 2, 20};
int total = 0;
int semEstoque = 0;
for (int indice = 0; indice < estoques.length; indice++) {
    total += estoques[indice];
    if (estoques[indice] == 0) semEstoque++;
}`, output: 'total = 37 | produtos sem estoque = 1', insight: 'Cada posição representa um produto; o valor guardado é sua quantidade.' },
  { label: 'OS e ocorrências', file: 'OperacaoArray.java', code: `int[] atividadesPorOs = {2, 4, 1, 3};
int[] codigos = {100, 200, 100, 300, 100};
int totalAtividades = 0;
int codigo100 = 0;
for (int indice = 0; indice < atividadesPorOs.length; indice++) {
    totalAtividades += atividadesPorOs[indice];
}
for (int indice = 0; indice < codigos.length; indice++) {
    if (codigos[indice] == 100) codigo100++;
}`, output: 'atividades = 10 | ocorrências 100 = 3', insight: 'Os dois casos usam números, mas o significado de índice e valor precisa ser documentado.' },
  { label: 'Mensageria e auditoria', file: 'ObservabilidadeArray.java', code: `int[] tentativas = {1, 3, 2, 1, 4};
int[] eventosPorDia = {5, 8, 3, 10, 4};
int muitasTentativas = 0;
int maiorVolume = eventosPorDia[0];
for (int indice = 0; indice < tentativas.length; indice++) {
    if (tentativas[indice] > 2) muitasTentativas++;
}
for (int indice = 1; indice < eventosPorDia.length; indice++) {
    if (eventosPorDia[indice] > maiorVolume) {
        maiorVolume = eventosPorDia[indice];
    }
}`, output: 'mensagens > 2 tentativas = 2 | pico diário = 10', insight: 'Contagem e extremo reaparecem em monitoramento, filas, auditoria e SLA.' },
  { label: 'Scanner e validação', file: 'ArrayComValidacaoConsole.java', code: `int[] quantidades = new int[5];
for (int indice = 0; indice < quantidades.length; indice++) {
    do {
        System.out.println("Quantidade da posição " + indice + ":");
        quantidades[indice] = scanner.nextInt();
        if (quantidades[indice] < 0) {
            System.out.println("Quantidade não pode ser negativa.");
        }
    } while (quantidades[indice] < 0);
}`, output: '-2 repete a mesma posição | 0 e positivos avançam', insight: 'O for escolhe a posição; o do while protege o valor que será guardado nela.' },
  { label: 'Leitura em duas fases', file: 'LendoArrayConsole.java', code: `int[] valores = new int[5];

// fase 1: preencher
for (int indice = 0; indice < valores.length; indice++) {
    System.out.println("Valor da posição " + indice + ":");
    valores[indice] = scanner.nextInt();
}

// fase 2: exibir/processar
for (int indice = 0; indice < valores.length; indice++) {
    System.out.println(valores[indice]);
}`, output: 'entradas 4, 5, 6, 7, 8\nsaída 4, 5, 6, 7, 8', insight: 'Separar preenchimento e processamento custa outro loop, mas permite reutilizar o array para várias operações.' },
  { label: 'Ler e somar', file: 'LendoESomandoArrayConsole.java', code: `int[] valores = new int[5];
int total = 0;

for (int indice = 0; indice < valores.length; indice++) {
    valores[indice] = scanner.nextInt();
    total += valores[indice];
}

double media = (double) total / valores.length;
System.out.println("Total: " + total);
System.out.println("Média: " + media);`, output: 'entradas 4, 5, 6, 7, 8\nTotal: 30\nMédia: 6.0', insight: 'Preencher e acumular no mesmo loop é adequado quando a regra é simples; o array continua disponível para outros cálculos.' }
];

const ERRORS = [
  { title: 'Primeiro índice igual a 1', code: 'System.out.println(numeros[1]);', symptom: 'Imprime o segundo elemento.', cause: 'Índices começam em zero.', fix: 'Use numeros[0] para o primeiro.' },
  { title: 'Loop usa <= length', code: 'for (int i = 0; i <= numeros.length; i++)', symptom: 'Falha depois de imprimir os valores válidos.', cause: 'O último i vira length, que já está fora do array.', fix: 'Use i < numeros.length.' },
  { title: 'length com parênteses', code: 'int tamanho = numeros.length();', symptom: 'Erro de compilação.', cause: 'Array possui campo length; String possui método length().', fix: 'Use numeros.length sem parênteses.' },
  { title: 'Acessa posição inexistente', code: 'int[] numeros = new int[3];\nnumeros[3] = 10;', symptom: 'ArrayIndexOutOfBoundsException.', cause: 'Os índices válidos são 0, 1 e 2.', fix: 'Valide 0 <= indice && indice < numeros.length.' },
  { title: 'Média perde decimal', code: 'double media = total / notas.length;', symptom: '34 / 4 resulta em 8.0, não 8.5.', cause: 'A divisão ocorreu entre inteiros antes da atribuição.', fix: 'Use (double) total / notas.length.' },
  { title: 'Primeiro de array vazio', code: 'int[] valores = {};\nint maior = valores[0];', symptom: 'Falha ao inicializar maior.', cause: 'Não existe elemento zero.', fix: 'Garanta valores.length > 0 antes do acesso.' },
  { title: 'Confunde zero padrão com dado', code: 'int[] numeros = new int[5];', symptom: 'O programa trata cinco zeros como entradas informadas.', cause: 'new int[5] inicializa todas as posições com zero.', fix: 'Preencha cada posição ou mantenha controle explícito das preenchidas.' },
  { title: 'Imprime índice, não valor', code: 'System.out.println(indice);', symptom: 'A saída mostra 0, 1, 2...', cause: 'indice localiza; array[indice] recupera o elemento.', fix: 'Imprima numeros[indice], ou ambos para diagnosticar.' },
  { title: 'Tenta fazer array crescer', code: 'numeros[numeros.length] = 40;', symptom: 'Acesso fora do limite.', cause: 'Array tem tamanho fixo.', fix: 'Defina o tamanho correto; crescimento dinâmico será feito com listas futuramente.' },
  { title: 'Não testa fronteiras', code: 'int ultimo = numeros[5];', symptom: 'Código depende de um tamanho presumido.', cause: 'O último índice foi escrito manualmente.', fix: 'Use numeros.length - 1 e teste primeiro, último, loop completo e vazio.' }
];

const EVIDENCE = `# Aula 045 — Arrays de números

- [ ] Expliquei elemento, índice, tamanho e tamanho fixo
- [ ] Declarei int[], long[] e double[] e vi seus padrões
- [ ] Comparei int[] numeros com a sintaxe alternativa
- [ ] Acessei primeiro e último elemento sem número mágico
- [ ] Diferenciei array.length de String.length()
- [ ] Alterei e preenchi posições
- [ ] Percorri com indice < array.length
- [ ] Calculei soma, média decimal, maior e menor
- [ ] Contei pares e ignorei valores inválidos
- [ ] Mantive dinheiro em long e centavos
- [ ] Preenchi e validei um array com Scanner
- [ ] Comparei leitura em duas fases com leitura e soma no mesmo loop
- [ ] Diagnostiquei ArrayIndexOutOfBoundsException
- [ ] Observei índice, valor e parada no debug

## Minha prova
O índice começa em:
O último índice é calculado por:
O caso vazio precisa de proteção porque:
O array é adequado neste problema porque:`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); } };
  return <button type="button" className="na45-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file na45-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function ArrayWorkbench() {
  const [values, setValues] = useState([10, 20, 30]);
  const [selected, setSelected] = useState(0);
  const [draft, setDraft] = useState('10');
  const choose = index => { setSelected(index); setDraft(String(values[index])); };
  const save = () => { const parsed = Number(draft); if (!Number.isInteger(parsed)) return; setValues(current => current.map((value, index) => index === selected ? parsed : value)); };
  return <section className="na45-workbench"><div className="na45-declaration"><code>int[] numeros = {'{' + values.join(', ') + '}'}</code><span>length = {values.length}</span></div><div className="na45-memory" role="group" aria-label="Memória visual do array">{values.map((value, index) => <button type="button" key={index} className={selected === index ? 'active' : ''} onClick={() => choose(index)}><small>índice {index}</small><strong>{value}</strong><span>numeros[{index}]</span></button>)}</div><div className="na45-editor"><label>Alterar numeros[{selected}]<input inputMode="numeric" value={draft} onChange={event => setDraft(event.target.value)} /></label><button type="button" onClick={save}><Wrench size={15} /> Atribuir valor</button><p>Primeiro: <code>numeros[0] = {values[0]}</code> · Último: <code>numeros[numeros.length - 1] = {values.at(-1)}</code></p></div></section>;
}

function LoopAnimator() {
  const values = [10, 20, 30, 40, 50];
  const [index, setIndex] = useState(0);
  const finished = index >= values.length;
  const output = values.slice(0, Math.min(index, values.length)).map((value, i) => `Índice ${i}: ${value}`).join('\n');
  return <section className="na45-loop"><CodePanel name="Main.java" code={CORE_CODE} /><div className="na45-runtime"><header><Play size={15} /> Execução passo a passo</header><div className="na45-condition"><span>indice</span><strong>{index}</strong><code>{index} &lt; {values.length}</code><b className={finished ? 'false' : 'true'}>{finished ? 'false — encerra' : 'true — entra'}</b></div><div className="na45-loop-memory">{values.map((value, i) => <span key={i} className={!finished && i === index ? 'current' : i < index ? 'visited' : ''}><small>[{i}]</small>{value}</span>)}</div><pre>{output || 'Console aguardando...'}{!finished && index < values.length ? `\n→ próximo valor: numeros[${index}] = ${values[index]}` : '\nFim: não existe acesso numeros[5].'}</pre><div className="na45-actions"><button type="button" disabled={finished} onClick={() => setIndex(value => value + 1)}><Play size={14} /> Executar iteração</button><button type="button" onClick={() => setIndex(0)}><RefreshCw size={14} /> Reiniciar</button></div></div></section>;
}

function BoundaryLab() {
  const [operator, setOperator] = useState('<');
  const values = [10, 20, 30];
  const visited = operator === '<' ? [0, 1, 2] : [0, 1, 2, 3];
  return <section className="na45-boundary"><div className="na45-switch"><button type="button" className={operator === '<' ? 'active' : ''} onClick={() => setOperator('<')}>indice &lt; length</button><button type="button" className={operator === '<=' ? 'active danger' : ''} onClick={() => setOperator('<=')}>indice &lt;= length</button></div><div className="na45-numberline">{visited.map(index => <div key={index} className={index >= values.length ? 'outside' : ''}><span>{index}</span><strong>{index < values.length ? values[index] : 'não existe'}</strong><small>{index < values.length ? `numeros[${index}]` : 'estouro do limite'}</small></div>)}</div><p className={operator === '<' ? 'safe' : 'failure'}>{operator === '<' ? 'O teste para quando indice vira 3. Todas as posições válidas foram visitadas.' : '3 <= 3 ainda é true; o corpo tenta numeros[3] e lança ArrayIndexOutOfBoundsException.'}</p></section>;
}

function AggregationLab() {
  const [values, setValues] = useState([8, 7, 10, 9]);
  const update = (index, raw) => setValues(current => current.map((value, i) => i === index ? Number(raw) || 0 : value));
  const total = values.reduce((sum, value) => sum + value, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const evens = values.filter(value => value % 2 === 0).length;
  return <section className="na45-aggregate"><div className="na45-inputs">{values.map((value, index) => <label key={index}><span>notas[{index}]</span><input type="number" value={value} onChange={event => update(index, event.target.value)} /></label>)}</div><div className="na45-metrics"><div><small>Acumulador</small><strong>{total}</strong><code>total += valor</code></div><div><small>Média decimal</small><strong>{average.toFixed(2)}</strong><code>(double) total / length</code></div><div><small>Extremos</small><strong>{min} / {max}</strong><code>menor / maior</code></div><div><small>Pares</small><strong>{evens}</strong><code>valor % 2 == 0</code></div></div></section>;
}

function PatternGallery() {
  const [selected, setSelected] = useState(0);
  const item = PATTERNS[selected];
  return <section className="na45-gallery"><nav>{PATTERNS.map((entry, index) => <button type="button" key={entry.label} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>{entry.label}</button>)}</nav><div className="na45-gallery-content"><CodePanel name={item.file} code={item.code} /><div className="na45-output"><header><Terminal size={15} /> Evidência esperada</header><code>{item.output}</code><p><Sparkles size={16} /> {item.insight}</p></div></div></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="na45-clinic"><nav>{ERRORS.map((entry, index) => <button type="button" key={entry.title} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span>{entry.title}</button>)}</nav><div className="na45-diagnosis"><header><AlertTriangle size={20} /><div><small>Caso {selected + 1} de {ERRORS.length}</small><h3>{item.title}</h3></div></header><CodePanel name="Código sob investigação" code={item.code} lines={false} /><div className="na45-symptom"><strong>Sintoma</strong><code>{item.symptom}</code></div><div className="na45-recovery"><span><Search size={16} /><div><strong>Causa</strong><p>{item.cause}</p></div></span><span><Wrench size={16} /><div><strong>Correção</strong><p>{item.fix}</p></div></span></div></div></section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: 'Criar laboratório', command: 'New-Item -ItemType Directory -Force labs\\m1\\aula-045-arrays-numeros\ncd labs\\m1\\aula-045-arrays-numeros', output: 'Directory: ...\\labs\\m1\\aula-045-arrays-numeros', note: 'Comece por Main, SomaArray, MediaArray, ExtremosArray e ArrayComValidacaoConsole.' },
    { title: 'Compilar núcleo', command: 'javac Main.java SomaArray.java MediaArray.java ExtremosArray.java\njava Main\njava MediaArray', output: 'Índice 0: 10 ... Índice 4: 50\nMédia: 8.5', note: 'javac sem mensagem indica sucesso. Compare o console real com os valores calculados à mão.' },
    { title: 'Provar fronteiras', command: 'java ErroIndiceForaDoLimite\njava ErroLoopComMenorIgual\njava ErroMediaInteira', output: 'ArrayIndexOutOfBoundsException ... Index 3 out of bounds for length 3\nMédia inteira: 8', note: 'Erros propositais pertencem ao diagnóstico. Corrija um caso por vez e execute novamente.' },
    { title: 'Versionar entrega', command: 'git status\ngit diff\ngit add labs/m1/aula-045-arrays-numeros docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 045: pratica arrays de numeros em Java"\ngit status', output: 'nothing to commit, working tree clean', note: 'Se .class aparecer, ajuste .gitignore antes do commit.' }
  ];
  const current = stages[stage];
  return <section><div className="na45-delivery-nav">{stages.map((entry, index) => <button type="button" key={entry.title} className={index === stage ? 'active' : ''} onClick={() => setStage(index)}><span>{index + 1}</span>{entry.title}</button>)}</div><div className="na45-terminal"><header><Terminal size={15} /> PowerShell <small>passo {stage + 1} de {stages.length}</small></header><pre><strong>PS&gt; {current.command}</strong>{'\n\n'}{current.output}</pre><p><Lightbulb size={16} /> {current.note}</p></div><div className="guided-file na45-code na45-diary"><div className="guided-file-title"><Database size={16} /> docs/diario-de-bordo.md<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>{EVIDENCE}</SyntaxHighlighter></div></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'memory') return <ArrayWorkbench />;
  if (block.type === 'loop') return <LoopAnimator />;
  if (block.type === 'boundary') return <BoundaryLab />;
  if (block.type === 'aggregate') return <AggregationLab />;
  if (block.type === 'patterns') return <PatternGallery />;
  if (block.type === 'errors') return <ErrorClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

const steps = [
  { id: 'memoria', label: 'Mapa do array', eyebrow: 'Estrutura e memória', title: 'Veja índice, elemento e tamanho ocuparem papéis diferentes', duration: '13 min', blocks: [
    { type: 'lead', text: 'Selecione uma posição e altere seu valor. O nome numeros representa o array inteiro; os colchetes escolhem exatamente um elemento.' },
    { type: 'memory' },
    { type: 'note', title: 'Duas inicializações, um tamanho fixo', text: 'int[] valores = {10, 20} cria e preenche. new int[5] cria cinco posições iniciadas em zero. Em ambos os casos, o tamanho não cresce automaticamente.' }
  ] },
  { id: 'percurso', label: 'Percorrer com for', eyebrow: 'Índice em movimento', title: 'Acompanhe condição, posição, valor e saída em cada iteração', duration: '16 min', blocks: [
    { type: 'lead', text: 'Execute uma iteração por vez. O índice começa em zero, localiza o elemento atual e para antes de alcançar length.' },
    { type: 'loop' },
    { type: 'note', title: 'Índice não é valor', text: 'indice vale 0, 1, 2...; numeros[indice] recupera 10, 20, 30... Imprimir ambos é uma ótima evidência durante o aprendizado e o debug.' }
  ] },
  { id: 'limites', label: 'Limites e falhas', eyebrow: 'Contrato de acesso', title: 'Prove por que o último índice é length - 1', duration: '13 min', blocks: [
    { type: 'lead', text: 'Troque apenas o operador do loop. Observe como um único sinal transforma uma execução correta em acesso fora do limite.' },
    { type: 'boundary' },
    { type: 'note', tone: 'warning', title: 'Array vazio muda a regra', text: 'length continua funcionando e vale 0, mas valores[0], maior e menor não existem. Proteja o acesso antes de usar o primeiro elemento como referência.' }
  ] },
  { id: 'calculos', label: 'Calcular em lote', eyebrow: 'Acumuladores e extremos', title: 'Transforme todos os elementos em soma, média, mínimo, máximo e contagem', duration: '17 min', blocks: [
    { type: 'lead', text: 'Altere as quatro notas e confira os resultados. O loop oferece cada valor; acumulador, comparação e contador definem o que será extraído.' },
    { type: 'aggregate' },
    { type: 'note', title: 'Divisão precisa virar decimal antes', text: 'double media = total / length ainda faz divisão inteira. Pelo menos um operando precisa ser double no momento da divisão: (double) total / length.' }
  ] },
  { id: 'dominios', label: 'Padrões de backend', eyebrow: 'Transferência de raciocínio', title: 'Reaplique o mesmo mecanismo em pedidos, estoque, OS, filas, auditoria e SLA', duration: '24 min', blocks: [
    { type: 'lead', text: 'Explore cada padrão. Leia o significado da posição e do valor antes do código: a mesma sintaxe pode representar fatos de negócio muito diferentes.' },
    { type: 'patterns' },
    { type: 'note', tone: 'warning', title: 'Array não é lista', text: 'Use array quando o tipo e o tamanho fixo atendem ao problema. Adicionar e remover dinamicamente pertence a ArrayList, que será estudada depois.' }
  ] },
  { id: 'clinica', label: 'Clínica de erros', eyebrow: 'Prova de limites', title: 'Corrija dez falhas de índice, tamanho, média e intenção', duration: '18 min', blocks: [
    { type: 'lead', text: 'Diagnostique pelo sintoma, encontre a quebra do contrato e confirme a recuperação executando primeiro, último, loop completo e caso vazio.' },
    { type: 'errors' }
  ] },
  { id: 'entrega', label: 'Entrega e desafio', eyebrow: 'Evidência e transferência', title: 'Entregue uma análise numérica verificável', duration: '20 min', blocks: [
    { type: 'lead', text: 'Compile os programas, provoque e corrija as fronteiras, registre as saídas e resolva o painel de SLA sem copiar os exemplos.' },
    { type: 'delivery' },
    { type: 'challenge', title: 'Desafio: painel diário de atendimento', text: 'Crie PainelSlaArray.java com um array fixo de tempos em horas. Produza total, média decimal, maior, menor, quantidade acima de 4 horas e quantidade válida, sem acessar posição inexistente.', acceptance: [
      'Use int[] com pelo menos cinco tempos e explique o significado de cada posição.',
      'Percorra com indice < temposHoras.length.',
      'Calcule média decimal sem divisão inteira.',
      'Inicialize maior e menor pelo primeiro elemento somente após proteger array vazio.',
      'Conte tempos acima de 4 horas sem alterar o array.',
      'Crie uma segunda versão preenchida por Scanner, rejeitando negativos na mesma posição.',
      'Use debug para registrar índice, valor, acumulador e condição de parada.',
      'Compile, registre a evidência no diário e faça commit sem arquivos .class.'
    ] }
  ] }
];

export default function GuidedNumericArraysLesson045({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-numeric-arrays-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Database size={17} /> Oficina de arrays numéricos</span><p className="guided-sequence">045 · M1.25</p><h1>Arrays de Números — Do Índice ao Resultado</h1><p>Enxergue a memória, percorra cada posição e transforme uma sequência fixa em soma, média, extremos, contagens e evidências de backend.</p></div><div className="guided-hero-status"><Database size={42} /><strong>{progress}%</strong><span>{completedStepIds.size} de {steps.length} etapas concluídas</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: '0', label: 'primeiro índice' }, { value: '6', label: 'operações fundamentais' }, { value: '10', label: 'diagnósticos praticáveis' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 045"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Array dominado de ponta a ponta!</h3><p>{lessonComplete ? 'Índices, percurso, cálculos e diagnóstico consolidados.' : 'Conclua a aula para consolidar a entrega.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 044</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Arrays consolidados' : allStepsComplete ? 'Use o botão acima' : 'Índice, valor e limite sob controle'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir Arrays com Tamanho Definido pelo Usuário'}>Aula 046 <ArrowRight size={17} /></button></footer>
  </article>;
}
