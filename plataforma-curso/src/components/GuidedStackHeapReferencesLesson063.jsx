import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  FileCode2,
  GitBranch,
  Layers3,
  Lightbulb,
  Link2,
  ListChecks,
  MemoryStick,
  MousePointerClick,
  RotateCcw,
  Sparkles,
  Terminal,
  Unlink,
  Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedStackHeapReferencesLesson.css';

const STORAGE_KEY = 'guided-stack-heap-references-lesson-063-progress';

const MAIN_PROGRAM = `public class LaboratorioMemoria {
    public static void main(String[] args) {
        int quantidade = 10;
        int[] valores = {10, 20, 30};
        Cliente cliente = new Cliente("Ana", "ATIVO");

        alterarQuantidade(quantidade);
        alterarPrimeiro(valores);
        reatribuirArray(valores);
        alterarStatus(cliente);
        reatribuirCliente(cliente);

        String status = normalizar(" aprovado ");

        System.out.println("quantidade: " + quantidade);
        System.out.println("valores[0]: " + valores[0]);
        System.out.println("cliente: " + cliente.nome + " - " + cliente.status);
        System.out.println("status: " + status);
    }

    static void alterarQuantidade(int quantidade) {
        quantidade = 99;
        System.out.println("quantidade local: " + quantidade);
    }

    static void alterarPrimeiro(int[] valores) {
        valores[0] = 99;
    }

    static void reatribuirArray(int[] valores) {
        valores = new int[]{7, 8, 9};
        System.out.println("array local: " + valores[0]);
    }

    static void alterarStatus(Cliente cliente) {
        cliente.status = "INATIVO";
    }

    static void reatribuirCliente(Cliente cliente) {
        cliente = new Cliente("Bruno", "BLOQUEADO");
        System.out.println("cliente local: " + cliente.nome);
    }

    static String normalizar(String texto) {
        if (texto == null) return "";
        return texto.trim().toUpperCase();
    }
}

class Cliente {
    String nome;
    String status;

    Cliente(String nome, String status) {
        this.nome = nome;
        this.status = status;
    }
}`;

const EXPECTED_OUTPUT = `quantidade local: 99
array local: 7
cliente local: Bruno
quantidade: 10
valores[0]: 99
cliente: Ana - INATIVO
status: APROVADO`;

const EVIDENCE = `# Aula 063 — Stack, Heap e Referências

- [ ] Desenhei os frames do main e do método chamado
- [ ] Diferenciei valor primitivo e cópia de referência
- [ ] Provei mutação do array A
- [ ] Provei que reatribuir parâmetro não troca a referência do main
- [ ] Expliquei null como ausência de referência
- [ ] Testei a ordem segura texto != null && !texto.isBlank()
- [ ] Comparei String imutável e StringBuilder mutável
- [ ] Provei duas referências apontando para o mesmo objeto
- [ ] Separei vida da variável local e alcançabilidade do objeto
- [ ] Usei Step Into e comparei main com alterarStatus
- [ ] Compilei e conferi as sete linhas de saída
- [ ] Ignorei .class e revisei o diff staged`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="mem63-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java' }) {
  return (
    <section className="guided-file mem63-code">
      <div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div>
      <SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter>
    </section>
  );
}

const MEMORY_STATES = [
  { label: 'main inicia', line: 'int[] valores = {10, 20, 30};', frames: [{ name: 'main', vars: ['quantidade = 10', 'valores = ref A'] }], objects: [{ id: 'A', value: '[10, 20, 30]', state: 'reachable' }], note: 'A variável valores guarda ref A; o array A é o objeto.' },
  { label: 'método entra', line: 'alterarPrimeiro(valores);', frames: [{ name: 'alterarPrimeiro', vars: ['valores = ref A'] }, { name: 'main', vars: ['quantidade = 10', 'valores = ref A'] }], objects: [{ id: 'A', value: '[10, 20, 30]', state: 'reachable' }], note: 'O parâmetro é outra variável e recebeu uma cópia da mesma referência.' },
  { label: 'objeto muda', line: 'valores[0] = 99;', frames: [{ name: 'alterarPrimeiro', vars: ['valores = ref A'] }, { name: 'main', vars: ['quantidade = 10', 'valores = ref A'] }], objects: [{ id: 'A', value: '[99, 20, 30]', state: 'mutated' }], note: 'A instrução alcança o array A e muda seu conteúdo; não troca nenhuma referência.' },
  { label: 'método retorna', line: 'System.out.println(valores[0]);', frames: [{ name: 'main', vars: ['quantidade = 10', 'valores = ref A'] }], objects: [{ id: 'A', value: '[99, 20, 30]', state: 'mutated' }], note: 'O frame do método saiu. main continua alcançando o array A já alterado.' },
  { label: 'reatribuição local', line: 'valores = new int[]{7, 8, 9};', frames: [{ name: 'reatribuirArray', vars: ['valores = ref B'] }, { name: 'main', vars: ['valores = ref A'] }], objects: [{ id: 'A', value: '[99, 20, 30]', state: 'reachable' }, { id: 'B', value: '[7, 8, 9]', state: 'local' }], note: 'Somente o parâmetro local passou a apontar para B. A variável do main ainda contém ref A.' },
  { label: 'frame desaparece', line: 'fim de reatribuirArray', frames: [{ name: 'main', vars: ['valores = ref A'] }], objects: [{ id: 'A', value: '[99, 20, 30]', state: 'reachable' }, { id: 'B', value: '[7, 8, 9]', state: 'unreachable' }], note: 'O frame local acabou. B ficou sem referência alcançável e apenas se tornou elegível para coleta futura.' },
];

function MemoryModelLab() {
  const [index, setIndex] = useState(0);
  const state = MEMORY_STATES[index];
  return (
    <section className="mem63-model">
      <div className="mem63-scrubber">
        {MEMORY_STATES.map((item, itemIndex) => <button type="button" key={item.label} className={itemIndex === index ? 'active' : itemIndex < index ? 'visited' : ''} onClick={() => setIndex(itemIndex)}><span>{itemIndex + 1}</span>{item.label}</button>)}
      </div>
      <div className="mem63-memory-board" role="img" aria-label={`Modelo conceitual de memória: ${state.note}`}>
        <section className="mem63-stack">
          <header><Layers3 size={17} /><strong>Stack</strong><small>frames da thread atual</small></header>
          <div className="mem63-stack-space">
            {state.frames.map(frame => <article key={frame.name}><strong>{frame.name}()</strong>{frame.vars.map(variable => <code key={variable}>{variable}</code>)}</article>)}
            <span>base da stack</span>
          </div>
        </section>
        <section className="mem63-heap">
          <header><Boxes size={17} /><strong>Heap</strong><small>objetos do modelo</small></header>
          <div>
            {state.objects.map(object => <article key={object.id} className={object.state}><span>objeto {object.id}</span><strong>{object.value}</strong><small>{object.state === 'unreachable' ? 'sem referência alcançável' : object.state === 'local' ? 'alcançado só pelo frame local' : 'alcançável'}</small></article>)}
          </div>
        </section>
      </div>
      <div className="mem63-current"><code>{state.line}</code><p>{state.note}</p></div>
      <aside className="guided-note info"><Lightbulb size={20} /><div><strong>Modelo conceitual, não fotografia física</strong><p><code>ref A</code> e <code>objeto A</code> são símbolos para raciocinar sobre identidade e alcançabilidade. Java não expõe esses endereços e uma JVM pode aplicar otimizações internas.</p></div></aside>
    </section>
  );
}

const FRAME_STATES = [
  { line: 'main()', frames: [{ name: 'main', vars: ['resultado = ?'] }], result: 'A JVM iniciou o ponto de entrada.' },
  { line: 'somar(10, 20)', frames: [{ name: 'somar', vars: ['a = 10', 'b = 20'] }, { name: 'main', vars: ['resultado = ?'] }], result: 'Uma chamada cria outro frame com seus próprios parâmetros.' },
  { line: 'return a + b', frames: [{ name: 'somar', vars: ['a = 10', 'b = 20', 'retorno = 30'] }, { name: 'main', vars: ['resultado = ?'] }], result: 'O método calcula o valor que voltará ao chamador.' },
  { line: 'resultado = 30', frames: [{ name: 'main', vars: ['resultado = 30'] }], result: 'O frame de somar saiu; suas variáveis locais deixaram de existir.' },
];

function FramesLab() {
  const [index, setIndex] = useState(0);
  const state = FRAME_STATES[index];
  return (
    <section className="mem63-frames-lab">
      <div className="mem63-frame-controls"><button type="button" onClick={() => setIndex(current => Math.max(0, current - 1))} disabled={index === 0}><ArrowLeft size={16} />Voltar</button><span>Passo {index + 1} de {FRAME_STATES.length}</span><button type="button" onClick={() => setIndex(current => Math.min(FRAME_STATES.length - 1, current + 1))} disabled={index === FRAME_STATES.length - 1}>Avançar<ArrowRight size={16} /></button></div>
      <div className="mem63-frame-stage">
        <section><span>TOPO DA STACK</span>{state.frames.map(frame => <article key={frame.name}><strong>{frame.name}()</strong>{frame.vars.map(item => <code key={item}>{item}</code>)}</article>)}<span>BASE DA STACK</span></section>
        <article><small>LINHA CONCEITUAL</small><code>{state.line}</code><p>{state.result}</p></article>
      </div>
      <p className="mem63-proof"><CheckCircle2 size={18} />Stack organiza chamadas e estado local. Heap não é “melhor” nem “pior”; ele resolve a vida dos objetos fora de uma chamada específica.</p>
    </section>
  );
}

const PASS_CASES = {
  primitive: { label: 'Primitivo', code: 'alterarQuantidade(quantidade)', callerBefore: 'quantidade = 10', parameter: 'quantidade = 10 → 99', callerAfter: 'quantidade = 10', object: 'nenhum objeto', verdict: 'O parâmetro recebeu cópia do valor 10.' },
  mutation: { label: 'Mutação', code: 'alterarPrimeiro(valores)', callerBefore: 'valores = ref A', parameter: 'valores = ref A', callerAfter: 'valores = ref A', object: 'array A: [10,20,30] → [99,20,30]', verdict: 'A referência foi copiada; o objeto compartilhado mudou.' },
  reassignment: { label: 'Reatribuição', code: 'trocarArray(valores)', callerBefore: 'valores = ref A', parameter: 'valores = ref A → ref B', callerAfter: 'valores = ref A', object: 'array A preservado; array B só local', verdict: 'Reatribuir a cópia não troca a variável do chamador.' },
};

function PassingLab() {
  const [mode, setMode] = useState('primitive');
  const item = PASS_CASES[mode];
  return (
    <section className="mem63-passing-lab">
      <div className="mem63-mode-tabs">{Object.entries(PASS_CASES).map(([key, value]) => <button type="button" key={key} className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>{value.label}</button>)}</div>
      <div className="mem63-passing-map">
        <article><small>Antes · main</small><code>{item.callerBefore}</code></article><ArrowRight /><article><small>Frame do método</small><code>{item.parameter}</code></article><ArrowRight /><article><small>Depois · main</small><code>{item.callerAfter}</code></article>
      </div>
      <div className="mem63-object-effect"><Boxes size={20} /><span><small>Efeito no heap</small><strong>{item.object}</strong></span></div>
      <p className="mem63-current"><code>{item.code}</code><span>{item.verdict}</span></p>
    </section>
  );
}

const NULL_CASES = [
  { label: 'null', value: null, first: false, second: 'não avaliado', result: 'Cliente inválido.' },
  { label: 'vazio', value: '', first: true, second: false, result: 'Cliente inválido.' },
  { label: 'espaços', value: '   ', first: true, second: false, result: 'Cliente inválido.' },
  { label: 'Ana', value: 'Ana', first: true, second: true, result: 'Cliente: Ana' },
];

function NullLab() {
  const [selected, setSelected] = useState(0);
  const item = NULL_CASES[selected];
  return (
    <section className="mem63-null-lab">
      <div className="mem63-null-tabs">{NULL_CASES.map((entry, index) => <button type="button" key={entry.label} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>{entry.label}</button>)}</div>
      <div className="mem63-short-circuit">
        <article className={item.first ? 'pass' : 'stop'}><span>1</span><code>texto != null</code><strong>{String(item.first)}</strong></article><GitBranch /><article className={item.second === 'não avaliado' ? 'skipped' : item.second ? 'pass' : 'stop'}><span>2</span><code>!texto.isBlank()</code><strong>{String(item.second)}</strong></article><ArrowRight /><article className="result"><span>saída</span><strong>{item.result}</strong></article>
      </div>
      <div className="mem63-null-compare"><article><small>ORDEM SEGURA</small><code>texto != null && !texto.isBlank()</code><p>Se a primeira condição falha, a chamada do método é pulada.</p></article><article className="danger"><small>ORDEM PERIGOSA</small><code>!texto.isBlank() && texto != null</code><p>Com null, a primeira expressão já lança NullPointerException.</p></article></div>
    </section>
  );
}

function MutabilityLab() {
  const [action, setAction] = useState('initial');
  const stringOriginal = ' APROVADO ';
  const normalized = stringOriginal.trim().toLowerCase();
  const builder = action === 'builder' ? 'Pedido aprovado' : 'Pedido';
  return (
    <section className="mem63-mutability-lab">
      <div className="mem63-mode-tabs"><button type="button" className={action === 'initial' ? 'active' : ''} onClick={() => setAction('initial')}>Estado inicial</button><button type="button" className={action === 'string' ? 'active' : ''} onClick={() => setAction('string')}>String.toLowerCase()</button><button type="button" className={action === 'builder' ? 'active' : ''} onClick={() => setAction('builder')}>StringBuilder.append()</button></div>
      <div className="mem63-mutability-grid">
        <article><header>String · imutável</header><div><span>status</span><code>ref S1</code></div><div><span>objeto S1</span><strong>“{stringOriginal}”</strong></div>{action === 'string' && <><ArrowDown /><div className="new"><span>novoStatus · ref S2</span><strong>“{normalized}”</strong></div></>}<p>{action === 'string' ? 'O objeto textual original permanece; o retorno referencia outro valor.' : 'Sem capturar o retorno, nenhuma variável passa a apontar para o texto normalizado.'}</p></article>
        <article><header>StringBuilder · mutável</header><div><span>mensagem</span><code>ref B1</code></div><div className={action === 'builder' ? 'changed' : ''}><span>objeto B1</span><strong>“{builder}”</strong></div><p>{action === 'builder' ? 'append alterou o conteúdo do mesmo objeto B1; quem compartilha a referência observa a mudança.' : 'A referência aponta para um objeto cujo estado pode mudar.'}</p></article>
      </div>
      <p className="mem63-proof"><CheckCircle2 size={18} />Para transformação sem efeito colateral, prefira retorno: <code>status = normalizar(status)</code>. Para ação intencional, o nome deve comunicar mutação.</p>
    </section>
  );
}

const REACHABILITY = {
  shared: { refs: ['primeiro → A', 'segundo → A'], objects: [{ id: 'A', text: 'Cliente { nome: “Bruno” }', state: 'reachable' }], note: 'Cliente segundo = primeiro copia a referência. Não clona o objeto.' },
  one: { refs: ['primeiro → null', 'segundo → A'], objects: [{ id: 'A', text: 'Cliente { nome: “Bruno” }', state: 'reachable' }], note: 'Remover uma referência não perde o objeto enquanto outra ainda o alcança.' },
  returned: { refs: ['main.cliente → C'], objects: [{ id: 'C', text: 'Cliente retornado por criarCliente()', state: 'reachable' }], note: 'O frame criador terminou, mas a referência retornada mantém C alcançável.' },
  lost: { refs: ['nenhuma referência → B'], objects: [{ id: 'B', text: 'Cliente criado e não retornado', state: 'unreachable' }], note: 'B é elegível para coleta; isso não significa remoção imediata.' },
};

function ReachabilityLab() {
  const [mode, setMode] = useState('shared');
  const item = REACHABILITY[mode];
  return (
    <section className="mem63-reachability-lab">
      <div className="mem63-mode-tabs"><button type="button" className={mode === 'shared' ? 'active' : ''} onClick={() => setMode('shared')}>Duas referências</button><button type="button" className={mode === 'one' ? 'active' : ''} onClick={() => setMode('one')}>Uma removida</button><button type="button" className={mode === 'returned' ? 'active' : ''} onClick={() => setMode('returned')}>Objeto retornado</button><button type="button" className={mode === 'lost' ? 'active' : ''} onClick={() => setMode('lost')}>Objeto perdido</button></div>
      <div className="mem63-reachability-map"><section><header><Link2 size={17} />Referências alcançáveis</header>{item.refs.map(ref => <code key={ref}>{ref}</code>)}</section><ArrowRight /><section><header><Boxes size={17} />Heap conceitual</header>{item.objects.map(object => <article key={object.id} className={object.state}><strong>objeto {object.id}</strong><span>{object.text}</span><small>{object.state === 'reachable' ? 'alcançável' : 'elegível para coleta futura'}</small></article>)}</section></div>
      <p className="mem63-current"><Unlink size={18} /><span>{item.note}</span></p>
    </section>
  );
}

const DOMAINS = [
  ['Pedido', 'aprovarPedido(pedido)', 'Mutação esperada', 'pedido.status = "APROVADO"', 'O nome comunica que o mesmo pedido mudará de estado.'],
  ['Produto', 'baixarEstoque(produto, 3)', 'Mutação validada', 'produto.estoque -= quantidade', 'A alteração é coerente quando quantidade e saldo são validados.'],
  ['Pagamento', 'calcularParcela(valor, parcelas)', 'Retorno preferível', 'long parcela = valor / parcelas', 'Um cálculo fica mais claro devolvendo o valor sem esconder efeito colateral.'],
  ['Ordem de serviço', 'concluirSePossivel(os)', 'Mutação condicional', 'os.status = "CONCLUIDA"', 'A regra altera estado somente depois de verificar as condições.'],
  ['Mensageria', 'incrementarTentativa(mensagem)', 'Mutação explícita', 'mensagem.tentativas++', 'O contador faz parte do estado evolutivo da mensagem.'],
  ['Auditoria', 'criarRegistro(...)', 'Criação + retorno', 'return registro', 'O objeto criado sobrevive ao frame porque a referência volta ao chamador.'],
];

function DomainsLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return (
    <section className="mem63-domains">
      <div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div>
      <article><small>{item[2]}</small><h3>{item[1]}</h3><code>{item[3]}</code><p>{item[4]}</p><div><strong>Leitura profissional</strong><span>Separe alterar, calcular e exibir. O nome e o retorno devem revelar se existe efeito colateral.</span></div></article>
    </section>
  );
}

const ERRORS = [
  ['Referência tratada como objeto', 'A variável e a instância viram uma única coisa no desenho mental.', 'Nomeie separadamente variável, ref simbólica e objeto.'],
  ['Atribuição chamada de clone', 'Cliente segundo = primeiro parece criar dois clientes.', 'Desenhe duas setas para o mesmo objeto e prove mutando por segundo.'],
  ['Reatribuição troca o chamador', 'Um novo objeto local deveria aparecer no main, mas não aparece.', 'Lembre que o parâmetro recebeu uma cópia da referência.'],
  ['Mutação escondida', 'Outro trecho observa estado alterado sem esperar.', 'Use nome de ação, valide a mudança e documente o efeito colateral.'],
  ['Método chamado em null', 'A execução lança NullPointerException.', 'Trate ausência antes de acessar campo ou método.'],
  ['Validação na ordem errada', '!texto.isBlank() roda antes de texto != null.', 'Coloque texto != null primeiro e aproveite o curto-circuito.'],
  ['Objeto criado e perdido', 'O método termina sem retornar nem compartilhar a referência.', 'Retorne ou armazene somente quando o objeto realmente precisar continuar acessível.'],
  ['String “alterada” sem retorno', 'normalizar(status) não muda a variável do main.', 'Faça status = normalizar(status), pois String é imutável.'],
  ['Método ambíguo', 'processar tanto altera quanto imprime.', 'Separe aprovarPedido de exibirPedido e torne a responsabilidade observável.'],
  ['Frame confundido com objeto', 'A variável local acabou e parece que o objeto também deveria sumir.', 'Avalie alcançabilidade do objeto separadamente da vida do frame.'],
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="mem63-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>
  );
}

const DELIVERY_CHECKS = [
  'A saída do primitivo prova 99 no método e 10 no main',
  'O array A termina com primeiro elemento 99',
  'O array B aparece apenas dentro de reatribuirArray',
  'Cliente Ana termina INATIVO após mutação',
  'Cliente Bruno aparece apenas no frame local',
  'A String normalizada volta por retorno',
  'Step Into mostra main.cliente e parâmetro apontando para o mesmo objeto',
  'A clínica de null foi reproduzida com ordem segura e insegura',
  'README explica mutação, reatribuição e alcançabilidade',
  'Git não inclui arquivos .class',
];

function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = 'mkdir labs\\m2\\aula-063-stack-heap-referencias\ncd labs\\m2\\aula-063-stack-heap-referencias\njavac LaboratorioMemoria.java\njava LaboratorioMemoria';
  return (
    <section className="mem63-delivery">
      <aside className="guided-note info"><Lightbulb size={20} /><div><strong>Faça previsão antes de executar</strong><p>Para cada método, anote: qual frame nasce, qual valor é copiado, qual objeto é alcançado, se ocorre mutação ou reatribuição e qual saída deve sobreviver ao retorno.</p></div></aside>
      <CodePanel name="LaboratorioMemoria.java" code={MAIN_PROGRAM} />
      <div className="mem63-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div>
      <section className="mem63-debug"><header><MousePointerClick size={18} /><strong>Debug guiado no IntelliJ</strong><span>Simulação do roteiro; execute na IDE para obter a evidência real.</span></header><div><article><span>1</span><strong>Breakpoint</strong><p>Marque <code>alterarStatus(cliente);</code> no main.</p></article><article><span>2</span><strong>Step Into</strong><p>Entre no método e compare as duas variáveis <code>cliente</code>.</p></article><article><span>3</span><strong>Mutar</strong><p>Execute <code>cliente.status = "INATIVO"</code> e observe o mesmo objeto.</p></article><article><span>4</span><strong>Reatribuir</strong><p>Repita com <code>cliente = new Cliente(...)</code> e observe a referência local mudar.</p></article></div></section>
      <div className="mem63-checks">{DELIVERY_CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div>
      <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: carrinho compartilhado sem surpresa</h3></div><p>Crie um <code>Carrinho</code> mutável e duas referências para ele. Mostre uma mutação visível pelas duas referências; depois reatribua somente uma delas a outro carrinho. Termine criando uma função pura que calcula o total sem alterar nenhum objeto.</p><ul><li>Desenhe refs simbólicas antes de executar.</li><li>Mostre saída que prove identidade compartilhada e separação posterior.</li><li>Explique por que o cálculo deve retornar um valor.</li></ul></section>
      <section className="guided-file mem63-code"><div className="guided-file-title"><MemoryStick size={16} />docs/diario-de-bordo.md<CopyButton value={EVIDENCE} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section>
    </section>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'model') return <MemoryModelLab />;
  if (block.type === 'frames') return <FramesLab />;
  if (block.type === 'passing') return <PassingLab />;
  if (block.type === 'null') return <NullLab />;
  if (block.type === 'mutability') return <MutabilityLab />;
  if (block.type === 'reachability') return <ReachabilityLab />;
  if (block.type === 'domains') return <DomainsLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'model', label: 'Mapa da Memória', duration: '12 min', eyebrow: 'MODELO CONCEITUAL', title: 'Acompanhe frames, referências e objetos na mesma execução', blocks: [{ type: 'lead', text: 'Comece com uma linha por vez. A stack organiza chamadas e variáveis locais; o heap permite que objetos sejam alcançados por referências em diferentes frames.' }, { type: 'model' }] },
  { id: 'frames', label: 'Frames da Stack', duration: '9 min', eyebrow: 'CHAMADA E RETORNO', title: 'Veja o frame nascer, receber parâmetros e desaparecer', blocks: [{ type: 'lead', text: 'Cada chamada possui seu próprio estado local. Quando somar termina, a resposta volta ao main, mas a e b não continuam existindo.' }, { type: 'frames' }] },
  { id: 'passing', label: 'Valor e Referência', duration: '13 min', eyebrow: 'PASSAGEM POR VALOR', title: 'Compare primitivo, mutação e reatribuição sem decorar frases', blocks: [{ type: 'lead', text: 'Java passa argumentos por valor. Para referências, o valor copiado é a própria referência; por isso dois frames podem alcançar o mesmo objeto.' }, { type: 'passing' }] },
  { id: 'null', label: 'null e Curto-circuito', duration: '10 min', eyebrow: 'AUSÊNCIA SEGURA', title: 'Pare antes da chamada que causaria NullPointerException', blocks: [{ type: 'lead', text: 'null não é objeto vazio: é ausência de referência. A ordem das condições decide se isBlank será chamado com segurança.' }, { type: 'null' }] },
  { id: 'mutability', label: 'String e StringBuilder', duration: '11 min', eyebrow: 'MUTABILIDADE', title: 'Diferencie novo valor retornado de objeto alterado', blocks: [{ type: 'lead', text: 'String é objeto imutável; métodos de transformação devolvem um valor. StringBuilder é mutável e permite observar alteração no mesmo objeto.' }, { type: 'mutability' }] },
  { id: 'reachability', label: 'Vida e Alcançabilidade', duration: '11 min', eyebrow: 'FRAME ≠ OBJETO', title: 'Separe o fim da variável local do destino do objeto', blocks: [{ type: 'lead', text: 'Um objeto pode sobreviver ao frame que o criou se a referência for retornada. Sem referência alcançável, ele apenas se torna elegível para coleta futura.' }, { type: 'reachability' }] },
  { id: 'domains', label: 'Decisões de Backend', duration: '12 min', eyebrow: 'MUTAÇÃO COM CRITÉRIO', title: 'Escolha entre alterar estado, calcular e criar', blocks: [{ type: 'lead', text: 'Pedido, estoque, pagamento, OS, mensageria e auditoria usam a mesma mecânica, mas pedem decisões diferentes sobre efeito colateral e retorno.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Reconstrua o modelo mental quando a saída surpreender', blocks: [{ type: 'lead', text: 'Não corrija por tentativa. Desenhe variável, referência e objeto; depois identifique mutação, reatribuição, ausência ou fim de frame.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '20 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove o modelo com saída, Step Into e transferência', blocks: [{ type: 'lead', text: 'Compile um único laboratório integrado, confira sete linhas de saída, observe identidade no debugger e aplique o raciocínio em um carrinho novo.' }, { type: 'delivery' }] },
];

export default function GuidedStackHeapReferencesLesson063({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const validIds = new Set(steps.map(step => step.id));
      return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => {
    if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) {
      completionNormalizedRef.current = true;
      onToggleCompleted();
    }
  }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => {
    const activeButton = navRef.current?.querySelector('button.active');
    if (activeButton && window.matchMedia('(max-width: 900px)').matches) activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);

  const step = steps[activeIndex];
  const stepDone = completedSteps.has(step.id);
  const allStepsDone = completedSteps.size === steps.length;
  const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const toggleStep = () => {
    if (stepDone && isCompleted) onToggleCompleted();
    setCompletedSteps(current => {
      const next = new Set(current);
      if (next.has(step.id)) next.delete(step.id);
      else next.add(step.id);
      return next;
    });
  };

  return (
    <article className="guided-git-lesson guided-stack-heap-references-lesson">
      <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><MemoryStick size={17} />Laboratório de memória Java</span><p className="guided-sequence">063 · M2.02</p><h1>Stack, heap e referências</h1><p>Veja frames nascerem, referências serem copiadas e objetos mudarem; depois defenda mutação, retorno, null e alcançabilidade sem recorrer a “mágica”.</p></div><div className="guided-hero-status"><MemoryStick size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header>
      <GuidedLessonFacts ariaLabel="Resumo da aula 063" items={[{ value: '6 estados', label: 'Memória quadro a quadro' }, { value: '3 efeitos', label: 'Valor, mutação e reatribuição' }, { value: '10 falhas', label: 'Diagnosticadas visualmente' }]} />
      <div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 063"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav>
        <main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Modelo de memória defendível</h3><p>{lessonComplete ? 'Aula concluída e pronta para Garbage Collector.' : 'Confira sua entrega e registre a conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main>
      </div>
      <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 062</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>Frames, objetos, refs e efeitos</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 064<ArrowRight size={17} /></button></footer>
    </article>
  );
}
