import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Boxes, Check, CheckCircle2, Clock3,
  Copy, FileCode2, Gauge, Lightbulb, ListChecks, Play, RefreshCw, RotateCcw,
  Search, ShieldCheck, Sparkles, Terminal, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedUserSizedArraysLesson.css';

const STORAGE_KEY = 'guided-user-sized-arrays-lesson-046-progress';

const MAIN_CODE = `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidade;
        do {
            System.out.println("Quantas notas? Use um valor entre 1 e 50:");
            quantidade = scanner.nextInt();

            if (quantidade < 1 || quantidade > 50) {
                System.out.println("Quantidade inválida.");
            }
        } while (quantidade < 1 || quantidade > 50);

        double[] notas = new double[quantidade];

        for (int indice = 0; indice < notas.length; indice++) {
            do {
                System.out.println("Digite a nota " + (indice + 1) + ":");
                notas[indice] = scanner.nextDouble();
            } while (notas[indice] < 0 || notas[indice] > 10);
        }

        double total = 0.0;
        for (int indice = 0; indice < notas.length; indice++) {
            total += notas[indice];
        }

        System.out.println("Média: " + total / notas.length);
        scanner.close();
    }
}`;

const STRATEGIES = [
  {
    label: 'while',
    title: 'Ler uma vez e repetir enquanto for inválido',
    code: `int quantidade = scanner.nextInt();

while (quantidade < 1 || quantidade > 100) {
    System.out.println("Use um valor entre 1 e 100:");
    quantidade = scanner.nextInt();
}

double[] valores = new double[quantidade];`,
    evidence: 'A primeira leitura fica antes do laço; cada tentativa inválida substitui quantidade.'
  },
  {
    label: 'boolean',
    title: 'Nomear e recalcular a regra que controla o laço',
    code: `int quantidade = scanner.nextInt();
boolean quantidadeValida = quantidade >= 1
        && quantidade <= 100;

while (!quantidadeValida) {
    quantidade = scanner.nextInt();
    quantidadeValida = quantidade >= 1
            && quantidade <= 100;
}

double[] valores = new double[quantidade];`,
    evidence: 'O nome ajuda a leitura, mas o boolean precisa ser recalculado depois de toda nova entrada.'
  },
  {
    label: 'do while',
    title: 'Manter a leitura obrigatória dentro do próprio laço',
    code: `int quantidade;

do {
    System.out.println("Digite a quantidade entre 1 e 100:");
    quantidade = scanner.nextInt();

    if (quantidade < 1 || quantidade > 100) {
        System.out.println("Quantidade inválida.");
    }
} while (quantidade < 1 || quantidade > 100);

double[] valores = new double[quantidade];`,
    evidence: 'A leitura acontece ao menos uma vez e a criação permanece depois do portão.'
  },
  {
    label: 'bug do boolean',
    title: 'A entrada muda, mas a condição continua presa em false',
    code: `boolean quantidadeValida = quantidade > 0;

while (!quantidadeValida) {
    quantidade = scanner.nextInt();
    // ERRO: quantidadeValida não foi recalculada
}`,
    evidence: 'Mesmo digitando 3, o laço continua. Corrija recalculando quantidadeValida dentro dele.'
  }
];

const DOMAINS = [
  {
    label: 'Pedidos', type: 'long[]', rule: 'Quantidade 1..100; cada valor em centavos deve ser positivo.',
    code: `long[] pedidosCentavos = new long[quantidadePedidos];
for (int indice = 0; indice < pedidosCentavos.length; indice++) {
    do {
        pedidosCentavos[indice] = scanner.nextLong();
    } while (pedidosCentavos[indice] <= 0);
}
long total = 0L;
for (long valor : pedidosCentavos) total += valor;
double media = (double) total / pedidosCentavos.length;`,
    output: 'Entradas: 1000, 2550, 5000\nTotal: 8550 centavos\nMédia: 2850.0 centavos',
    insight: 'long em centavos evita ponto flutuante nesta fase; BigDecimal será estudado mais tarde.'
  },
  {
    label: 'Estoque', type: 'int[]', rule: 'Quantidade positiva; estoque aceita zero, mas rejeita negativo.',
    code: `int[] estoques = new int[quantidadeProdutos];
for (int indice = 0; indice < estoques.length; indice++) {
    do {
        estoques[indice] = scanner.nextInt();
    } while (estoques[indice] < 0);
}
int total = 0;
int semEstoque = 0;
for (int estoque : estoques) {
    total += estoque;
    if (estoque == 0) semEstoque++;
}`,
    output: 'Entradas: 8, 0, 5\nTotal em estoque: 13\nProdutos sem estoque: 1',
    insight: 'A regra do tamanho e a regra de cada elemento são contratos diferentes.'
  },
  {
    label: 'Atividades por OS', type: 'int[]', rule: 'Cada OS deve possuir ao menos uma atividade.',
    code: `int[] atividades = new int[quantidadeOs];
// preenchimento exige atividades[indice] > 0
int total = 0;
int maior = atividades[0];
for (int valor : atividades) {
    total += valor;
    if (valor > maior) maior = valor;
}`,
    output: 'Entradas: 2, 4, 1\nTotal de atividades: 7\nMaior quantidade: 4',
    insight: 'O acesso atividades[0] só é seguro porque a quantidade foi validada como maior que zero.'
  },
  {
    label: 'Mensageria', type: 'int[]', rule: 'Tentativas devem ser positivas; conte mensagens acima de duas tentativas.',
    code: `int totalTentativas = 0;
int mensagensProblematicas = 0;
for (int indice = 0; indice < tentativas.length; indice++) {
    totalTentativas += tentativas[indice];
    if (tentativas[indice] > 2) mensagensProblematicas++;
}`,
    output: 'Entradas: 1, 3, 2, 5\nTotal de tentativas: 11\nAcima de 2: 2',
    insight: 'A posição representa uma mensagem; o elemento representa quantas tentativas ela consumiu.'
  },
  {
    label: 'Auditoria diária', type: 'int[]', rule: 'Um dia pode ter zero eventos, mas nunca quantidade negativa.',
    code: `int total = 0;
int maiorVolume = eventosPorDia[0];
for (int eventos : eventosPorDia) {
    total += eventos;
    if (eventos > maiorVolume) maiorVolume = eventos;
}
double media = (double) total / eventosPorDia.length;`,
    output: 'Entradas: 5, 0, 8, 3\nTotal: 16\nPico: 8\nMédia diária: 4.0',
    insight: 'Zero é um dado legítimo neste domínio, diferente de uma entrada ausente.'
  },
  {
    label: 'Pagamentos', type: 'long[]', rule: 'Pagamento deve ser positivo; produza total, maior e menor.',
    code: `long total = 0L;
long maior = pagamentos[0];
long menor = pagamentos[0];
for (long pagamento : pagamentos) {
    total += pagamento;
    if (pagamento > maior) maior = pagamento;
    if (pagamento < menor) menor = pagamento;
}`,
    output: 'Entradas: 1200, 5000, 2500\nTotal: 8700\nMaior: 5000\nMenor: 1200',
    insight: 'Extremos exigem pelo menos um elemento; o portão de tamanho protege essa pré-condição.'
  },
  {
    label: 'SLA', type: 'double[]', rule: 'Horas podem ser zero, mas não negativas; calcule total, maior e média.',
    code: `double totalHoras = 0.0;
double maiorTempo = horas[0];
for (double tempo : horas) {
    totalHoras += tempo;
    if (tempo > maiorTempo) maiorTempo = tempo;
}
double media = totalHoras / horas.length;`,
    output: 'Entradas: 2.5, 4.0, 1.5\nTotal: 8.0 horas\nMaior: 4.0\nMédia: 2.666...',
    insight: 'O mesmo pipeline serve ao domínio, mas tipo, unidade e regra continuam explícitos.'
  }
];

const ERRORS = [
  { title: 'Criar antes de validar', code: 'int n = scanner.nextInt();\ndouble[] valores = new double[n];\nwhile (n <= 0) n = scanner.nextInt();', symptom: 'O programa pode quebrar antes de alcançar o while.', cause: 'A alocação recebeu uma entrada ainda não confiável.', fix: 'Valide n primeiro; execute new double[n] somente depois do laço.' },
  { title: 'Aceitar tamanho negativo', code: 'double[] valores = new double[-3];', symptom: 'NegativeArraySizeException.', cause: 'Um array não pode possuir quantidade negativa de posições.', fix: 'Exija n >= 1 antes de criar.' },
  { title: 'Acessar índice zero de array vazio', code: 'int[] valores = new int[0];\nint maior = valores[0];', symptom: 'ArrayIndexOutOfBoundsException: Index 0 out of bounds for length 0.', cause: 'O array existe, mas não possui primeira posição.', fix: 'Aceite vazio somente em fluxos preparados; aqui, exija quantidade maior que zero.' },
  { title: 'Usar <= length', code: 'for (int i = 0; i <= valores.length; i++)\n    valores[i] = scanner.nextDouble();', symptom: 'A falha aparece após preencher todas as posições válidas.', cause: 'O último índice é length - 1; i == length já está fora.', fix: 'Percorra com i < valores.length.' },
  { title: 'Percorrer pela variável alterada', code: 'double[] valores = new double[quantidade];\nquantidade = 99;\nfor (int i = 0; i < quantidade; i++)', symptom: 'O laço tenta visitar posições que o array não possui.', cause: 'A variável deixou de representar o tamanho real criado.', fix: 'Depois da criação, use valores.length.' },
  { title: 'Validar o tamanho, mas não a nota', code: 'notas[i] = scanner.nextDouble(); // aceita 99', symptom: 'O array nasce com tamanho correto e dados inválidos.', cause: 'Validação de quantidade não valida cada elemento.', fix: 'Repita a leitura da mesma posição enquanto nota < 0 || nota > 10.' },
  { title: 'Não impor limite máximo', code: 'int n = scanner.nextInt();\nint[] valores = new int[n];', symptom: 'Uma entrada enorme pode pressionar a memória do processo.', cause: 'A única regra foi n > 0.', fix: 'Defina um máximo coerente e rejeite antes de alocar; não teste valores enormes de verdade.' },
  { title: 'Mostrar índice técnico ao usuário', code: 'System.out.println("Digite a nota " + indice);', symptom: 'A primeira pergunta aparece como “nota 0”.', cause: 'Interface humana e índice técnico foram confundidos.', fix: 'Mostre indice + 1; continue acessando notas[indice].' },
  { title: 'Boolean não atualizado', code: 'boolean valida = n > 0;\nwhile (!valida) { n = scanner.nextInt(); }', symptom: 'O laço não termina mesmo depois de uma entrada válida.', cause: 'valida permanece com o valor calculado antes do laço.', fix: 'Recalcule valida após cada nova leitura.' },
  { title: 'Tentar adicionar além do tamanho', code: 'int[] valores = new int[3];\nvalores[valores.length] = 40;', symptom: 'ArrayIndexOutOfBoundsException no índice 3.', cause: 'Tamanho decidido em execução continua fixo depois de new.', fix: 'Preencha apenas 0..length-1; crescimento dinâmico pertence a ArrayList.' }
];

const EVIDENCE = `# Aula 046 — Arrays com tamanho decidido em execução

- [ ] Li a quantidade com Scanner e expliquei tempo de execução
- [ ] Bloqueei zero, negativos e valores acima do limite antes de new
- [ ] Criei double[], int[] e long[] com uma variável
- [ ] Observei os valores padrão antes do preenchimento
- [ ] Usei array.length no percurso
- [ ] Mostrei indice + 1 ao usuário e usei indice no código
- [ ] Repeti a mesma posição quando um elemento violou a regra
- [ ] Calculei soma, média, maior e menor com proteção de vazio
- [ ] Comparei soma durante o preenchimento e em uma segunda fase
- [ ] Expliquei por que o tamanho continua fixo depois da criação
- [ ] Diagnostiquei NegativeArraySizeException e dez falhas comuns
- [ ] Testei no debug as entradas -1, 0 e 3
- [ ] Mantive .class fora do Git e revisei o staged diff

## Minha prova
O array só pode ser criado depois de:
Eu prefiro array.length porque:
Zero é permitido no domínio:
Se eu precisar adicionar elementos depois, escolherei:`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };
  return <button type="button" className="usa46-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file usa46-code">
    <div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div>
    <SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter>
  </div>;
}

function ArrayCells({ values, current = -1, type = 'double' }) {
  return <div className="usa46-array" role="group" aria-label={`Array de ${type} com ${values.length} posições`}>
    {values.map((value, index) => <div className={index === current ? 'current' : value !== 0 && value !== '0L' && value !== '0.0' ? 'filled' : ''} key={index}>
      <small>índice {index}</small><strong>{value}</strong><span>{type}[{index}]</span>
    </div>)}
  </div>;
}

function AllocationLab() {
  const [raw, setRaw] = useState('3');
  const [type, setType] = useState('double');
  const [attempted, setAttempted] = useState(false);
  const quantity = Number(raw);
  const valid = Number.isInteger(quantity) && quantity >= 1 && quantity <= 100;
  const defaultValue = type === 'double' ? '0.0' : type === 'long' ? '0L' : '0';
  const visibleCount = valid ? Math.min(quantity, 8) : 0;
  const values = Array.from({ length: visibleCount }, () => defaultValue);
  const run = value => { setRaw(String(value)); setAttempted(true); };
  return <section className="usa46-lab">
    <div className="usa46-pipeline" aria-label="Pipeline de alocação segura">
      {['Entrada externa', 'Validar 1..100', `new ${type}[n]`, 'Valores padrão'].map((label, index) => {
        const active = attempted && (index < 2 || valid);
        const blocked = attempted && !valid && index >= 2;
        return <React.Fragment key={label}><div className={active ? 'active' : blocked ? 'blocked' : ''}><span>{index + 1}</span><strong>{label}</strong></div>{index < 3 && <ArrowRight aria-hidden="true" />}</React.Fragment>;
      })}
    </div>
    <div className="usa46-controls">
      <label>Tipo do array<select value={type} onChange={event => { setType(event.target.value); setAttempted(false); }}><option value="double">double[]</option><option value="int">int[]</option><option value="long">long[]</option></select></label>
      <label>Quantidade informada<input type="number" value={raw} onChange={event => { setRaw(event.target.value); setAttempted(false); }} /></label>
      <button type="button" onClick={() => setAttempted(true)}><Play size={15} /> Validar e criar</button>
    </div>
    <div className="usa46-presets"><span>Teste as fronteiras:</span>{[-3, 0, 3, 100, 1000000000].map(value => <button type="button" key={value} onClick={() => run(value)}>{value.toLocaleString('pt-BR')}</button>)}</div>
    {attempted && <div className={`usa46-verdict ${valid ? 'safe' : 'danger'}`}>
      {valid ? <ShieldCheck size={22} /> : <AlertTriangle size={22} />}
      <div><strong>{valid ? `Entrada confiável: ${type}[] criado com length ${quantity}` : 'Alocação bloqueada antes de new'}</strong><p>{valid ? `As posições nascem com ${defaultValue}. O tamanho foi decidido agora, mas ficará fixo depois da criação.` : quantity < 1 ? 'Zero ou negativo não atende ao contrato desta aula. Um negativo causaria NegativeArraySizeException.' : 'O limite máximo impede uma solicitação externa de pressionar a memória. A simulação não tenta alocar esse valor.'}</p></div>
    </div>}
    {valid && attempted && <><ArrayCells values={values} type={type} />{quantity > visibleCount && <p className="usa46-more">… mais {quantity - visibleCount} posições existem no array; a visualização foi abreviada.</p>}</>}
    <CodePanel name="TamanhoComLimiteMaximo.java" code={`int quantidade = ${raw || 0};\n\nwhile (quantidade < 1 || quantidade > 100) {\n    quantidade = scanner.nextInt();\n}\n\n${type}[] valores = new ${type}[quantidade];\nSystem.out.println(valores.length);`} lines={false} />
  </section>;
}

function FillingLab() {
  const [values, setValues] = useState([0, 0, 0, 0]);
  const [current, setCurrent] = useState(0);
  const [draft, setDraft] = useState('8.5');
  const [messages, setMessages] = useState(['Array criado: [0.0, 0.0, 0.0, 0.0]']);
  const complete = current >= values.length;
  const submit = () => {
    const parsed = Number(draft);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 10) {
      setMessages(previous => [`Nota ${current + 1}: ${draft} é inválida; o índice ${current} continua ativo.`, ...previous]);
      return;
    }
    const next = values.map((value, index) => index === current ? parsed : value);
    setValues(next);
    setMessages(previous => [`Nota ${current + 1} gravada em notas[${current}] = ${parsed}`, ...previous]);
    setCurrent(index => index + 1);
    setDraft('');
  };
  const reset = () => { setValues([0, 0, 0, 0]); setCurrent(0); setDraft('8.5'); setMessages(['Array recriado com quatro valores padrão 0.0']); };
  return <section className="usa46-lab">
    <div className="usa46-fill-heading"><div><small>Índice técnico</small><strong>{complete ? 'fim' : current}</strong></div><ArrowRight /><div><small>Mensagem para a pessoa</small><strong>{complete ? 'preenchimento concluído' : `Digite a nota ${current + 1}`}</strong></div></div>
    <ArrayCells values={values.map(value => value.toFixed(1))} current={complete ? -1 : current} type="notas" />
    <div className="usa46-controls">
      <label>Nota entre 0 e 10<input type="number" step="0.5" value={draft} disabled={complete} onChange={event => setDraft(event.target.value)} /></label>
      <button type="button" disabled={complete} onClick={submit}><Wrench size={15} /> Validar e gravar</button>
      <button type="button" className="secondary-action" onClick={reset}><RefreshCw size={15} /> Reiniciar</button>
    </div>
    <div className="usa46-console"><header><Terminal size={15} /> Console didático</header><pre>{messages.join('\n')}</pre></div>
    <aside className="guided-note info"><Lightbulb size={21} /><div><strong>Um erro não consome a posição</strong><p>Digite 11 ou -1: a validação pede novamente e mantém o mesmo índice. A interface mostra nota {Math.min(current + 1, values.length)} para a pessoa, mas o Java continua acessando notas[{Math.min(current, values.length - 1)}].</p></div></aside>
  </section>;
}

function ProcessingLab() {
  const values = [8.5, 7.0, 10.0, 6.5];
  const [mode, setMode] = useState('after');
  const total = values.reduce((sum, value) => sum + value, 0);
  const average = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const code = mode === 'during' ? `double total = 0.0;
for (int indice = 0; indice < notas.length; indice++) {
    notas[indice] = scanner.nextDouble();
    total += notas[indice];
}` : `double total = 0.0;
for (int indice = 0; indice < notas.length; indice++) {
    total += notas[indice];
}

double maior = notas[0];
double menor = notas[0];
for (int indice = 1; indice < notas.length; indice++) {
    if (notas[indice] > maior) maior = notas[indice];
    if (notas[indice] < menor) menor = notas[indice];
}`;
  return <section className="usa46-lab">
    <div className="usa46-mode"><button type="button" className={mode === 'during' ? 'active' : ''} onClick={() => setMode('during')}>Somar durante o preenchimento</button><button type="button" className={mode === 'after' ? 'active' : ''} onClick={() => setMode('after')}>Processar depois</button></div>
    <div className="usa46-processing"><div><small>Array criado e preenchido</small><code>[{values.join(', ')}]</code><span>length = {values.length}</span></div><ArrowRight /><div><small>{mode === 'during' ? '1 loop, responsabilidades juntas' : '2 fases, leitura e cálculo separados'}</small><strong>Total {total.toFixed(1)}</strong><span>Média {average.toFixed(2)} · menor {min} · maior {max}</span></div></div>
    <CodePanel name={mode === 'during' ? 'SomaDurantePreenchimento.java' : 'MaiorMenorNota.java'} code={code} lines={false} />
    <aside className="guided-note info"><Gauge size={21} /><div><strong>O acesso notas[0] ganhou uma pré-condição</strong><p>Maior e menor usam a primeira posição como referência. Isso só é seguro porque o portão anterior recusou quantidade zero. A validação inicial protege também o processamento posterior.</p></div></aside>
  </section>;
}

function StrategyLab() {
  const [selected, setSelected] = useState(0);
  const item = STRATEGIES[selected];
  return <section className="usa46-gallery"><nav>{STRATEGIES.map((entry, index) => <button type="button" className={selected === index ? 'active' : ''} key={entry.label} onClick={() => setSelected(index)}>{entry.label}</button>)}</nav><div><h3>{item.title}</h3><CodePanel name="ValidarQuantidade.java" code={item.code} lines={false} /><p className="usa46-evidence"><CheckCircle2 size={17} /> {item.evidence}</p></div></section>;
}

function DomainGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return <section className="usa46-domain"><nav>{DOMAINS.map((entry, index) => <button type="button" className={selected === index ? 'active' : ''} key={entry.label} onClick={() => setSelected(index)}><strong>{entry.label}</strong><small>{entry.type}</small></button>)}</nav><div className="usa46-domain-content"><div className="usa46-contract"><span>{item.type}</span><strong>{item.rule}</strong></div><CodePanel name={`${item.label.replaceAll(' ', '')}ComTamanhoUsuario.java`} code={item.code} /><div className="usa46-output"><header><Terminal size={15} /> Saída conhecida</header><pre>{item.output}</pre><p><Sparkles size={16} /> {item.insight}</p></div></div></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="usa46-clinic"><nav>{ERRORS.map((entry, index) => <button type="button" className={selected === index ? 'active' : ''} key={entry.title} onClick={() => setSelected(index)}><span>{index + 1}</span>{entry.title}</button>)}</nav><div className="usa46-diagnosis"><header><AlertTriangle size={20} /><div><small>Caso {selected + 1} de {ERRORS.length}</small><h3>{item.title}</h3></div></header><CodePanel name="Código sob investigação" code={item.code} lines={false} /><div className="usa46-symptom"><strong>Sintoma observável</strong><code>{item.symptom}</code></div><div className="usa46-recovery"><span><Search size={16} /><div><strong>Causa</strong><p>{item.cause}</p></div></span><span><Wrench size={16} /><div><strong>Recuperação e prova</strong><p>{item.fix}</p></div></span></div></div></section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: 'Criar laboratório', command: 'New-Item -ItemType Directory -Force labs\\m1\\aula-046-arrays-tamanho-usuario\ncd labs\\m1\\aula-046-arrays-tamanho-usuario', output: 'Directory: ...\\labs\\m1\\aula-046-arrays-tamanho-usuario', note: 'Crie o núcleo Main, NotasComMedia, MaiorMenorNota, TamanhoComLimiteMaximo e NotasComDoWhile antes das variações.' },
    { title: 'Compilar o núcleo', command: 'javac Main.java NotasComMedia.java MaiorMenorNota.java TamanhoComLimiteMaximo.java NotasComDoWhile.java\njava Main', output: 'Quantas notas? Use um valor entre 1 e 50:\n3\nDigite a nota 1:\n8.5\n...\nMédia: 8.5', note: 'javac bem-sucedido não imprime mensagem. Compare prompts, entradas e resultado na ordem real.' },
    { title: 'Diagnosticar', command: 'java ErroTamanhoNegativo\njava ErroCriarAntesDeValidar\njava ErroLoopComMenorIgual\njava ErroBooleanNaoAtualizado', output: 'NegativeArraySizeException ...\nOs demais casos devem ser executados e corrigidos um por vez.', note: 'No debug, teste quantidade -1, 0 e 3; observe quando o array passa a existir, seu length e o índice atual.' },
    { title: 'Versionar evidências', command: 'git status\ngit diff\ngit add labs/m1/aula-046-arrays-tamanho-usuario docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 046: pratica arrays com tamanho informado pelo usuario"\ngit status', output: 'nothing to commit, working tree clean', note: 'Se arquivos .class aparecerem no stage, corrija .gitignore antes do commit.' }
  ];
  const current = stages[stage];
  return <section><div className="usa46-delivery-nav">{stages.map((entry, index) => <button type="button" className={stage === index ? 'active' : ''} key={entry.title} onClick={() => setStage(index)}><span>{index + 1}</span>{entry.title}</button>)}</div><div className="usa46-terminal"><header><Terminal size={15} /> PowerShell <small>passo {stage + 1} de {stages.length}</small></header><pre><strong>PS&gt; {current.command}</strong>{'\n\n'}{current.output}</pre><p><Lightbulb size={16} /> {current.note}</p></div><div className="guided-file usa46-code usa46-diary"><div className="guided-file-title"><FileCode2 size={16} /> docs/diario-de-bordo.md<CopyButton value={EVIDENCE} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>{EVIDENCE}</SyntaxHighlighter></div></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'allocation') return <AllocationLab />;
  if (block.type === 'strategies') return <StrategyLab />;
  if (block.type === 'code') return <CodePanel name={block.name} code={block.code} />;
  if (block.type === 'filling') return <FillingLab />;
  if (block.type === 'processing') return <ProcessingLab />;
  if (block.type === 'domains') return <DomainGallery />;
  if (block.type === 'errors') return <ErrorClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

const steps = [
  { id: 'mapa', label: 'Mapa da alocação', eyebrow: 'Tempo de execução', title: 'Faça o tamanho nascer somente depois que a entrada for confiável', duration: '12 min', blocks: [
    { type: 'lead', text: 'Altere tipo e quantidade. Acompanhe entrada, validação, criação e valores padrão como estados separados; valores inválidos param antes de new.' },
    { type: 'allocation' },
    { type: 'note', tone: 'warning', title: 'Entrada não numérica fica na fronteira desta aula', text: 'Scanner.nextInt e nextDouble podem lançar InputMismatchException se receberem texto. Aqui dominamos regras numéricas; parsing e try/catch profundos serão tratados depois.' }
  ] },
  { id: 'validacao', label: 'Validar o tamanho', eyebrow: 'Portão de segurança', title: 'Compare while, boolean e do while sem mover a alocação para cedo demais', duration: '14 min', blocks: [
    { type: 'lead', text: 'As três formas podem proteger a criação. Leia onde acontece a primeira entrada, o que controla a repetição e o que precisa ser atualizado.' },
    { type: 'strategies' },
    { type: 'note', title: 'Mínimo e máximo pertencem ao contrato', text: '1..100 e 1..50 são exemplos de limites coerentes. O valor correto depende do domínio e da capacidade que o programa realmente suporta.' }
  ] },
  { id: 'programa', label: 'Programa completo', eyebrow: 'Código guiado', title: 'Leia um programa inteiro pelas cinco fases do fluxo', duration: '16 min', blocks: [
    { type: 'lead', text: 'Localize leitura e validação, criação, preenchimento, processamento e saída. Os comentários de fase são apoio temporário; mais tarde essas responsabilidades virarão métodos.' },
    { type: 'code', name: 'Main.java', code: MAIN_CODE },
    { type: 'note', title: 'Prefira notas.length no percurso', text: 'quantidade serviu para construir o array. Depois disso, o próprio array é a fonte confiável do limite: indice < notas.length.' }
  ] },
  { id: 'preenchimento', label: 'Preencher e validar', eyebrow: 'Índice em movimento', title: 'Grave cada nota sem avançar quando o valor estiver inválido', duration: '15 min', blocks: [
    { type: 'lead', text: 'Digite primeiro um valor inválido e depois um válido. Observe o índice técnico, a mensagem amigável e a mesma célula permanecerem sincronizados.' },
    { type: 'filling' }
  ] },
  { id: 'processamento', label: 'Processar com segurança', eyebrow: 'Resultados derivados', title: 'Escolha quando somar e proteja média, maior e menor', duration: '14 min', blocks: [
    { type: 'lead', text: 'Compare um loop mais curto com a separação entre preencher e processar. As duas estratégias são válidas quando suas consequências estão claras.' },
    { type: 'processing' }
  ] },
  { id: 'dominios', label: 'Contratos de backend', eyebrow: 'Transferência de raciocínio', title: 'Mude tipo, unidade e regra sem perder o pipeline seguro', duration: '22 min', blocks: [
    { type: 'lead', text: 'Explore pedidos, estoque, OS, mensageria, auditoria, pagamentos e SLA. Em cada domínio, leia primeiro o significado da posição e a validade do elemento.' },
    { type: 'domains' },
    { type: 'note', tone: 'warning', title: 'Tamanho decidido em execução não é crescimento dinâmico', text: 'Depois de new, length permanece fixo. Se o problema exige adicionar e remover elementos durante a execução, ArrayList será a estrutura estudada futuramente.' }
  ] },
  { id: 'clinica', label: 'Clínica de erros', eyebrow: 'Diagnóstico por evidência', title: 'Recupere dez quebras diferentes do contrato de alocação', duration: '18 min', blocks: [
    { type: 'lead', text: 'Leia sintoma, causa e correção. Não provoque alocações enormes: o objetivo é provar que o portão rejeita antes de consumir memória.' },
    { type: 'errors' }
  ] },
  { id: 'entrega', label: 'Entrega e desafio', eyebrow: 'Evidência profissional', title: 'Entregue um analisador de SLA sem copiar o roteiro', duration: '22 min', blocks: [
    { type: 'lead', text: 'Compile o núcleo, investigue as falhas propositais, registre o debug e versiona somente fontes e evidências.' },
    { type: 'delivery' },
    { type: 'challenge', title: 'Desafio: janela de SLA configurável', text: 'Crie JanelaSla.java. A pessoa informa quantos atendimentos serão analisados, dentro de um limite de 1 a 30. Depois informa horas não negativas. O programa produz total, média, maior tempo e quantidade acima de 4 horas.', acceptance: [
      'Valide 1..30 antes de executar new double[quantidade].',
      'Repita a mesma posição quando o tempo for negativo.',
      'Mostre atendimento 1..N para a pessoa e use índice 0..length-1 internamente.',
      'Percorra com horas.length e proteja o uso de horas[0].',
      'Exiba uma saída conhecida para as entradas 2.5, 5.0 e 1.5.',
      'No debug, prove as tentativas -1, 0 e 3 antes da criação.',
      'Registre decisão, console e staged diff sem arquivos .class.'
    ] }
  ] }
];

export default function GuidedUserSizedArraysLesson046({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved.filter(id => steps.some(step => step.id === id)) : []);
    } catch {
      return new Set();
    }
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
    setCompletedStepIds(previous => {
      const next = new Set(previous);
      if (next.has(activeStep.id)) next.delete(activeStep.id);
      else next.add(activeStep.id);
      return next;
    });
  };

  return <article className="guided-git-lesson guided-user-sized-arrays-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Boxes size={17} /> Oficina de alocação segura</span><p className="guided-sequence">046 · M1.26</p><h1>Arrays com Tamanho Decidido em Execução</h1><p>Receba uma quantidade externa, transforme-a em um limite confiável e só então crie, preencha e processe o array.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{progress}%</strong><span>{completedStepIds.size} de {steps.length} etapas concluídas</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: '1 → 100', label: 'portão configurável' }, { value: '3', label: 'tipos numéricos aplicados' }, { value: '10', label: 'falhas diagnosticáveis' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 046"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Alocação segura comprovada!</h3><p>{lessonComplete ? 'Validação, criação, preenchimento, processamento e diagnóstico consolidados.' : 'Conclua a aula para registrar a entrega.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 045</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Alocação segura consolidada' : allStepsComplete ? 'Use o botão acima' : 'Entrada, portão e array sob controle'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir Alteração de Posições do Array'}>Aula 047 <ArrowRight size={17} /></button></footer>
  </article>;
}
