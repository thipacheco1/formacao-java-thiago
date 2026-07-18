import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Braces, Check, CheckCircle2,
  Clock3, Copy, FileCode2, GitBranch, Lightbulb, ListChecks, PackageSearch,
  Play, RotateCcw, Search, ShieldCheck, Sparkles, Terminal, Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedNullPointerLesson.css';

const STORAGE_KEY = 'guided-null-pointer-lesson-066-progress';

const MAIN_PROGRAM = `import java.util.Objects;
import java.util.Optional;

public class LaboratorioNullSeguro {
    public static void main(String[] args) {
        validarTexto(null);
        validarTexto("   ");
        validarTexto("Ana");

        String status = null;
        System.out.println("aprovado: " + "APROVADO".equals(status));

        Cliente[] clientes = new Cliente[3];
        clientes[0] = criarCliente("Ana");
        listar(clientes);

        Optional<Cliente> busca = buscar(clientes, "Carla");
        System.out.println("busca: " + busca.map(c -> c.nome).orElse("NAO_ENCONTRADO"));

        Pedido pedido = criarPedido("Bruno", 2500L);
        System.out.println("pedido: " + pedido.cliente + " | " + pedido.status);
    }

    static void validarTexto(String texto) {
        if (texto != null && !texto.isBlank()) {
            System.out.println("texto: " + texto.trim() + " | " + texto.trim().length());
        } else {
            System.out.println("texto: INVALIDO");
        }
    }

    static Cliente criarCliente(String nome) {
        Objects.requireNonNull(nome, "Nome do cliente é obrigatório.");
        if (nome.isBlank()) throw new IllegalArgumentException("Nome não pode ficar em branco.");
        Cliente cliente = new Cliente();
        cliente.nome = nome.trim();
        return cliente;
    }

    static void listar(Cliente[] clientes) {
        for (int i = 0; i < clientes.length; i++) {
            System.out.println("slot " + i + ": " + (clientes[i] == null ? "VAZIO" : clientes[i].nome));
        }
    }

    static Optional<Cliente> buscar(Cliente[] clientes, String nome) {
        Objects.requireNonNull(clientes, "Coleção de clientes é obrigatória.");
        Objects.requireNonNull(nome, "Nome de busca é obrigatório.");
        for (Cliente cliente : clientes) {
            if (cliente != null && nome.equalsIgnoreCase(cliente.nome)) return Optional.of(cliente);
        }
        return Optional.empty();
    }

    static Pedido criarPedido(String cliente, long valorCentavos) {
        Objects.requireNonNull(cliente, "Cliente do pedido é obrigatório.");
        if (cliente.isBlank()) throw new IllegalArgumentException("Cliente não pode ficar em branco.");
        if (valorCentavos <= 0) throw new IllegalArgumentException("Valor deve ser positivo.");
        Pedido pedido = new Pedido();
        pedido.cliente = cliente.trim();
        pedido.valorCentavos = valorCentavos;
        pedido.status = "PENDENTE";
        return pedido;
    }
}

class Cliente { String nome; }

class Pedido {
    String cliente;
    long valorCentavos;
    String status;
}`;

const EXPECTED_OUTPUT = `texto: INVALIDO
texto: INVALIDO
texto: Ana | 3
aprovado: false
slot 0: Ana
slot 1: VAZIO
slot 2: VAZIO
busca: NAO_ENCONTRADO
pedido: Bruno | PENDENTE`;

const EVIDENCE = `# Aula 066 — Null e NullPointerException

- [ ] Expliquei null como referência sem objeto
- [ ] Localizei a referência exata usada como objeto
- [ ] Diferenciei null, texto vazio e texto em branco
- [ ] Provei o curto-circuito na ordem correta
- [ ] Usei requireNonNull e mensagem clara
- [ ] Validei slots null de array
- [ ] Documentei entrada e retorno de uma busca
- [ ] Usei Optional apenas como retorno opcional
- [ ] Comparei empty, of, ofNullable, orElse e orElseThrow
- [ ] Li a primeira linha relevante do stack trace
- [ ] Executei o programa e conferi nove linhas
- [ ] Revisei .gitignore, diff staged e commit`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="np66-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java' }) {
  return <section className="guided-file np66-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

const NPE_CASES = {
  variable: { label: 'String null', chain: ['nome', 'length()'], nullAt: 0, code: 'String nome = null;\nnome.length();', why: 'nome existe como variável, mas não aponta para uma String.' },
  object: { label: 'Objeto null', chain: ['cliente', 'nome'], nullAt: 0, code: 'Cliente cliente = null;\nSystem.out.println(cliente.nome);', why: 'O acesso ao campo já exige que cliente aponte para um objeto.' },
  field: { label: 'Campo interno null', chain: ['cliente', 'nome', 'length()'], nullAt: 1, code: 'Cliente cliente = new Cliente();\ncliente.nome.length();', why: 'cliente existe; o campo nome é a referência ausente.' },
  array: { label: 'Slot null', chain: ['clientes', '[1]', 'nome'], nullAt: 1, code: 'Cliente[] clientes = new Cliente[3];\nclientes[1].nome;', why: 'O array existe; a posição 1 ainda contém null.' },
};

function AnatomyLab() {
  const [mode, setMode] = useState('field');
  const item = NPE_CASES[mode];
  return <section className="np66-anatomy"><div className="np66-tabs">{Object.entries(NPE_CASES).map(([key, value]) => <button type="button" key={key} className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>{value.label}</button>)}</div><div className="np66-chain" role="img" aria-label={`Cadeia de acesso; null localizado em ${item.chain[item.nullAt]}`}>{item.chain.map((part, index) => <React.Fragment key={`${part}-${index}`}><article className={index === item.nullAt ? 'null' : index < item.nullAt ? 'exists' : 'blocked'}><small>{index === item.nullAt ? 'NULL' : index < item.nullAt ? 'EXISTE' : 'NÃO ALCANÇADO'}</small><strong>{part}</strong></article>{index < item.chain.length - 1 && <ArrowRight />}</React.Fragment>)}</div><CodePanel name={`${item.label} · falha proposital`} code={item.code} /><p className="np66-root-cause"><Search size={18} /><span><strong>Referência culpada:</strong> {item.chain[item.nullAt]}. {item.why}</span></p><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Leia da esquerda para a direita</strong><p>NPE não significa que “tudo é null”. Identifique o ponto exato da cadeia que deveria apontar para um objeto e não aponta.</p></div></aside></section>;
}

const TEXTS = [
  { label: 'null', value: null, object: 'não existe String', length: 'não pode chamar length/isBlank' },
  { label: '""', value: '', object: 'existe String', length: 'length = 0; isBlank = true' },
  { label: '"   "', value: '   ', object: 'existe String', length: 'length = 3; isBlank = true' },
  { label: '"Ana"', value: 'Ana', object: 'existe String', length: 'length = 3; isBlank = false' },
];

function TextLab() {
  const [selected, setSelected] = useState(0);
  const [safeOrder, setSafeOrder] = useState(true);
  const item = TEXTS[selected];
  const firstResult = safeOrder ? item.value !== null : item.value === null ? 'NPE' : !item.value.trim();
  const outcome = firstResult === 'NPE' ? 'NullPointerException antes da segunda condição' : item.value !== null && !item.value.trim().length ? 'Inválido: vazio ou branco' : item.value !== null ? 'Válido: objeto preenchido' : 'Inválido: curto-circuito interrompeu a expressão';
  return <section className="np66-text"><div className="np66-text-values">{TEXTS.map((text, index) => <button type="button" key={text.label} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{text.label}</strong><small>{text.object}</small></button>)}</div><div className="np66-short-circuit"><div className="np66-order"><button type="button" className={safeOrder ? 'active' : ''} onClick={() => setSafeOrder(true)}>texto != null primeiro</button><button type="button" className={!safeOrder ? 'active danger' : ''} onClick={() => setSafeOrder(false)}>texto.isBlank() primeiro</button></div><code>{safeOrder ? 'texto != null && !texto.isBlank()' : '!texto.isBlank() && texto != null'}</code><div className={firstResult === 'NPE' ? 'bad' : 'ok'}><strong>{outcome}</strong><span>{item.length}</span></div></div><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Validar não é apagar o significado</strong><p>Converter qualquer <code>null</code> em <code>""</code> pode esconder um dado obrigatório. Primeiro decida se ausência é permitida ou é erro.</p></div></aside></section>;
}

const BOUNDARY_CASES = [
  ['null', 'Objects.requireNonNull(nome, "Nome é obrigatório.")', 'NullPointerException com mensagem explícita', 'Valida ausência de referência.'],
  ['blank', 'if (nome.isBlank()) throw new IllegalArgumentException(...)', 'IllegalArgumentException de regra', 'Só execute depois de garantir que nome não é null.'],
  ['valid', 'nome.trim()', '"Ana"', 'Normalização acontece depois das pré-condições.'],
];

function BoundaryLab() {
  const [selected, setSelected] = useState(0);
  const item = BOUNDARY_CASES[selected];
  return <section className="np66-boundary"><div className="np66-boundary-flow">{BOUNDARY_CASES.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{entry[0] === 'null' ? 'Referência existe?' : entry[0] === 'blank' ? 'Texto preenchido?' : 'Normalizar e criar'}</strong></button>)}</div><article><ShieldCheck size={34} /><small>FALHAR NA BORDA</small><h3>{item[2]}</h3><code>{item[1]}</code><p>{item[3]}</p></article><div className="np66-decision"><article><strong>Ausência aceitável</strong><span>Retorne vazio, mostre mensagem ou preserve um resultado opcional pelo contrato.</span></article><article><strong>Valor obrigatório</strong><span>Interrompa cedo com mensagem clara; não deixe uma NPE surgir longe da entrada.</span></article></div></section>;
}

function ArrayLab() {
  const [slots, setSlots] = useState(['Ana', null, null]);
  const [index, setIndex] = useState(1);
  const current = slots[index];
  const create = () => setSlots(values => values.map((value, itemIndex) => itemIndex === index ? `Cliente ${index + 1}` : value));
  const clear = () => setSlots(values => values.map((value, itemIndex) => itemIndex === index ? null : value));
  return <section className="np66-array"><div className="np66-array-stage"><section><header><code>Cliente[] clientes = new Cliente[3]</code></header><div>{slots.map((value, itemIndex) => <button type="button" key={itemIndex} className={index === itemIndex ? 'active' : ''} onClick={() => setIndex(itemIndex)}><small>slot {itemIndex}</small><strong>{value ? `ref → C${itemIndex}` : 'null'}</strong></button>)}</div></section><ArrowRight /><section><header>Heap conceitual</header><div>{slots.map((value, itemIndex) => value && <article key={itemIndex}><Braces size={17} /><strong>C{itemIndex}</strong><span>nome = {value}</span></article>)}</div></section></div><div className="np66-array-action"><div><strong>clientes[{index}]</strong><span>{current ? `aponta para objeto; .nome = ${current}` : 'está null; acessar .nome causaria NPE'}</span></div><button type="button" onClick={current ? clear : create}>{current ? 'Remover referência' : 'Criar objeto no slot'}</button></div><CodePanel name="Percurso seguro · trecho" code={`for (int i = 0; i < clientes.length; i++) {\n    if (clientes[i] != null) {\n        System.out.println(clientes[i].nome);\n    } else {\n        System.out.println("Posição " + i + " vazia.");\n    }\n}`} /></section>;
}

const CONTRACTS = {
  nullable: { label: 'Retorna null', signature: 'Cliente buscar(... )', found: 'return cliente;', absent: 'return null;', caller: 'if (encontrado != null) { ... }', message: 'Funciona, mas o chamador precisa conhecer e lembrar o contrato.' },
  optional: { label: 'Retorna Optional', signature: 'Optional<Cliente> buscar(... )', found: 'return Optional.of(cliente);', absent: 'return Optional.empty();', caller: 'encontrado.orElse(... )', message: 'O tipo do retorno comunica que o resultado pode não existir.' },
};

function ContractLab() {
  const [mode, setMode] = useState('optional');
  const [found, setFound] = useState(false);
  const item = CONTRACTS[mode];
  return <section className="np66-contract"><div className="np66-tabs">{Object.entries(CONTRACTS).map(([key, value]) => <button type="button" key={key} className={mode === key ? 'active' : ''} onClick={() => setMode(key)}>{value.label}</button>)}</div><div className="np66-contract-map"><section><small>ENTRADAS</small><code>clientes: não null</code><code>nome: não null nem blank</code></section><ArrowRight /><section><small>ASSINATURA</small><strong>{item.signature}</strong><button type="button" onClick={() => setFound(value => !value)}>{found ? 'Simular ausência' : 'Simular encontrado'}</button></section><ArrowRight /><section className={found ? 'found' : 'absent'}><small>SAÍDA</small><code>{found ? item.found : item.absent}</code><span>{item.caller}</span></section></div><p className="np66-contract-note"><GitBranch size={18} />{item.message}</p></section>;
}

const OPTIONAL_CASES = [
  ['Optional.of(valor)', 'valor presente e garantidamente não null', 'presente', 'Use quando você já provou que o objeto existe.'],
  ['Optional.empty()', 'ausência conhecida', 'vazio', 'Expõe que a busca não encontrou resultado.'],
  ['Optional.ofNullable(valor)', 'valor legado pode ser null', 'presente ou vazio', 'Converte null em empty; não corrige contrato ruim sozinho.'],
  ['isPresent + get', 'leitura didática após verificar', 'seguro com condição', 'Nunca execute get sem provar presença.'],
  ['orElse(fallback)', 'ausência possui substituto válido', 'valor ou fallback', 'Fallback precisa fazer sentido para a regra.'],
  ['orElseThrow()', 'ausência é erro neste ponto', 'valor ou exceção', 'Use quando continuar sem resultado seria inválido.'],
];

function OptionalLab() {
  const [selected, setSelected] = useState(0);
  const item = OPTIONAL_CASES[selected];
  return <section className="np66-optional"><div>{OPTIONAL_CASES.map((entry, index) => <button type="button" key={entry[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{entry[0]}</strong></button>)}</div><article><PackageSearch size={37} /><small>{item[2]}</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[3]}</p><aside><strong>Limite desta aula</strong><span>Use Optional principalmente no retorno de busca. Não use como campo, parâmetro ou objeto que também pode ser null.</span></aside></article></section>;
}

const DOMAINS = [
  ['Pedido', 'cliente obrigatório; valor positivo; status PENDENTE', 'Criação falha cedo e exibição ainda pode defender parâmetro null.'],
  ['Produto', 'nome obrigatório; estoque não negativo', 'Baixa de estoque valida produto, quantidade e saldo.'],
  ['Pagamento', 'valor e parcelas positivos', 'Cálculo não recebe pagamento null nem divide por zero.'],
  ['Ordem de serviço', 'certificado obrigatório; status ABERTA', '"ABERTA".equals(os.status) evita equals sobre status null.'],
  ['Mensageria', 'cliente e tipo obrigatórios', 'Mensagem começa com zero tentativas e recebe incremento seguro.'],
  ['Auditoria', 'usuário e operação obrigatórios', 'Registro inválido falha na criação, antes de perder rastreabilidade.'],
];

function DomainsLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return <section className="np66-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>CONTRATO NULL-SAFE</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}</p><div><strong>Quatro perguntas</strong><span>O dado é obrigatório? Quem valida? Ausência retorna vazio ou lança erro? A mensagem aponta a regra quebrada?</span></div></article></section>;
}

const TRACE_FRAMES = [
  ['1', 'Main.exibirNome(Main.java:14)', 'onde quebrou', 'nome.length() tentou usar null como String'],
  ['2', 'Main.exibirCliente(Main.java:10)', 'quem chamou', 'exibirCliente passou cliente.nome sem validar'],
  ['3', 'Main.main(Main.java:5)', 'origem do fluxo', 'main criou Cliente, mas não inicializou nome'],
];

function StackTraceLab() {
  const [selected, setSelected] = useState(0);
  const item = TRACE_FRAMES[selected];
  return <section className="np66-trace"><div className="np66-trace-console"><header><Terminal size={15} />Stack trace didático</header><p>Exception in thread "main" java.lang.NullPointerException</p>{TRACE_FRAMES.map((frame, index) => <button type="button" key={frame[1]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>at {frame[1]}</button>)}</div><ArrowDown /><article><span>{item[0]}</span><div><small>{item[2]}</small><h3>{item[1]}</h3><p>{item[3]}.</p></div></article><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Comece pela primeira linha do seu código</strong><p>Ela mostra onde houve o acesso inválido. As linhas seguintes contam como a execução chegou até ali; depois inspecione a referência e seus campos no debugger.</p></div></aside></section>;
}

const ERRORS = [
  ['Método em referência null', 'nome.length() usa ausência como String.', 'Valide ou torne nome obrigatório na borda.'],
  ['Campo de objeto null', 'cliente.nome usa cliente null.', 'Valide cliente antes de acessar qualquer campo.'],
  ['Campo interno null', 'cliente existe, mas cliente.nome não.', 'Inicialize o objeto completo ou valide o campo.'],
  ['Slot de array null', 'clientes[i].nome falha em posição vazia.', 'Cheque o slot ou controle a quantidade preenchida.'],
  ['equals do lado inseguro', 'status.equals falha quando status é null.', 'Use "APROVADO".equals(status).'],
  ['Retorno null ignorado', 'Busca não encontra e o chamador acessa o retorno.', 'Valide o retorno ou use Optional no contrato.'],
  ['Optional.get vazio', 'get é chamado sem prova de presença.', 'Use isPresent, orElse ou orElseThrow conforme a regra.'],
  ['Optional em todo lugar', 'Campo ou parâmetro adiciona ruído e pode ser null.', 'Nesta fase, concentre Optional em retornos de busca.'],
  ['Fallback falso', 'null vira texto vazio apenas para não quebrar.', 'Não esconda dado obrigatório; falhe cedo.'],
  ['Ignorar stack trace', 'Correção começa por chute ou if espalhado.', 'Leia arquivo, método, linha e caminho de chamadas.'],
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="np66-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>;
}

const CHECKS = ['null é ausência de objeto, não objeto vazio','A referência culpada é localizada na cadeia','null, vazio e branco permanecem distintos','&& valida null antes de chamar isBlank','requireNonNull não valida blank','equals usa constante no lado esquerdo','Slots vazios são validados antes do campo','Busca comunica ausência pelo retorno','Optional nunca é definido como null','Stack trace começa na primeira linha relevante'];

function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = 'mkdir labs\\m2\\aula-066-null-nullpointerexception\ncd labs\\m2\\aula-066-null-nullpointerexception\njavac LaboratorioNullSeguro.java\njava LaboratorioNullSeguro';
  return <section className="np66-delivery"><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Antes de adicionar um if, declare o contrato</strong><p>Diga se ausência é válida, qual camada decide e qual evidência espera. Só então escolha validação, exceção, Optional ou fallback.</p></div></aside><CodePanel name="LaboratorioNullSeguro.java" code={MAIN_PROGRAM} /><div className="np66-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="np66-debug"><header><Play size={18} /><strong>Debug: referência externa e campo interno</strong></header><div><article><span>1</span><strong>Breakpoint na cadeia</strong><p>Pare antes de <code>cliente.nome.length()</code>.</p></article><article><span>2</span><strong>Expanda cliente</strong><p>Confirme que a referência do objeto não é null.</p></article><article><span>3</span><strong>Inspecione nome</strong><p>O campo interno revela <code>null</code>.</p></article><article><span>4</span><strong>Volte à origem</strong><p>Encontre onde o objeto nasceu sem nome obrigatório.</p></article></div></section><div className="np66-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: busca com contrato impossível de ignorar</h3></div><p>Crie uma busca de pedido por cliente que valide entradas, ignore slots vazios e retorne <code>Optional&lt;Pedido&gt;</code>. Demonstre encontrado, ausente e entrada inválida.</p><ul><li>Não use get sem verificar presença.</li><li>Use mensagem clara para entrada obrigatória.</li><li>Explique por que ausência de resultado não é uma NPE.</li></ul></section><section className="guided-file np66-code"><div className="guided-file-title"><ShieldCheck size={16} />docs/diario-de-bordo.md<CopyButton value={EVIDENCE} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'anatomy') return <AnatomyLab />;
  if (block.type === 'text') return <TextLab />;
  if (block.type === 'boundary') return <BoundaryLab />;
  if (block.type === 'array') return <ArrayLab />;
  if (block.type === 'contract') return <ContractLab />;
  if (block.type === 'optional') return <OptionalLab />;
  if (block.type === 'domains') return <DomainsLab />;
  if (block.type === 'trace') return <StackTraceLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'anatomy', label: 'Anatomia da NPE', duration: '11 min', eyebrow: 'REFERÊNCIA SEM OBJETO', title: 'Localize o null exato dentro da cadeia de acesso', blocks: [{ type: 'lead', text: 'null significa que uma referência não aponta para objeto. NPE acontece quando o código tenta usar essa ausência como String, objeto, array ou campo.' }, { type: 'anatomy' }] },
  { id: 'text', label: 'Null, Vazio e Blank', duration: '11 min', eyebrow: 'TRÊS ESTADOS DIFERENTES', title: 'Valide texto na ordem que o curto-circuito consegue proteger', blocks: [{ type: 'lead', text: 'null não é "" nem espaço. A ordem texto != null && !texto.isBlank() impede que o segundo acesso aconteça quando não existe String.' }, { type: 'text' }] },
  { id: 'boundary', label: 'Falhar na Borda', duration: '10 min', eyebrow: 'PRÉ-CONDIÇÕES CLARAS', title: 'Troque uma NPE distante por uma decisão próxima da entrada', blocks: [{ type: 'lead', text: 'Objects.requireNonNull valida ausência; isBlank valida conteúdo. Valor obrigatório deve falhar cedo com mensagem que revele a regra quebrada.' }, { type: 'boundary' }] },
  { id: 'arrays', label: 'Slots e Cadeias', duration: '10 min', eyebrow: 'ARRAY DE REFERÊNCIAS', title: 'Valide a posição antes de atravessar para o objeto', blocks: [{ type: 'lead', text: 'O array pode existir e seus slots continuarem null. Criar, remover e percorrer referências são operações diferentes.' }, { type: 'array' }] },
  { id: 'contracts', label: 'Contrato de Busca', duration: '11 min', eyebrow: 'ENTRADA E RETORNO', title: 'Deixe explícito quando um resultado pode não existir', blocks: [{ type: 'lead', text: 'Um método precisa declarar o que aceita, o que devolve e como representa ausência. Retornar null exige memória do chamador; Optional torna a possibilidade visível no tipo.' }, { type: 'contract' }] },
  { id: 'optional', label: 'Optional no Momento Certo', duration: '12 min', eyebrow: 'PRESENÇA OU AUSÊNCIA', title: 'Use o contêiner como retorno, sem espalhá-lo por todo o modelo', blocks: [{ type: 'lead', text: 'of, empty e ofNullable constroem o resultado; isPresent, orElse e orElseThrow obrigam uma decisão. get sem presença apenas troca um erro por outro.' }, { type: 'optional' }] },
  { id: 'domains', label: 'Null no Backend', duration: '11 min', eyebrow: 'SEIS APLICAÇÕES', title: 'Defenda invariantes antes que a ausência atravesse o sistema', blocks: [{ type: 'lead', text: 'Pedido, produto, pagamento, OS, mensageria e auditoria combinam valores obrigatórios, ausência legítima e mensagens diferentes.' }, { type: 'domains' }] },
  { id: 'trace', label: 'Stack Trace e Debug', duration: '10 min', eyebrow: 'CAMINHO DA FALHA', title: 'Leia onde quebrou, quem chamou e onde o estado nasceu', blocks: [{ type: 'lead', text: 'A primeira linha relevante do seu código aponta o acesso inválido; as próximas reconstruem o caminho até a origem do objeto incompleto.' }, { type: 'trace' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Corrija o contrato em vez de espalhar verificações por medo', blocks: [{ type: 'lead', text: 'Nem toda correção é if != null. Às vezes a resposta é criar objeto completo, falhar cedo, mudar retorno ou apenas ler corretamente a evidência.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '22 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove validação, ausência e busca em um programa integrado', blocks: [{ type: 'lead', text: 'Compile, confira nove linhas determinísticas, depure um campo interno null e transfira o contrato para uma busca de pedidos.' }, { type: 'delivery' }] },
];

export default function GuidedNullPointerLesson066({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const validIds = new Set(steps.map(step => step.id));
      return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []);
    } catch { return new Set(); }
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
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleStep = () => {
    if (stepDone && isCompleted) onToggleCompleted();
    setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; });
  };
  return <article className="guided-git-lesson guided-null-pointer-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><ShieldCheck size={17} />Clínica de referências ausentes</span><p className="guided-sequence">066 · M2.05</p><h1>Null e NullPointerException</h1><p>Localize a referência ausente, defina se ausência é permitida e escolha validação, falha rápida ou Optional sem esconder a regra de negócio.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 066" items={[{ value: '4 cadeias', label: 'NPE localizada visualmente' }, { value: '6 contratos', label: 'Optional aplicado com critério' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 066"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Ausência com contrato</h3><p>{lessonComplete ? 'Aula concluída e pronta para String pool.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 065</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>null, contratos e diagnóstico</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 067<ArrowRight size={17} /></button></footer></article>;
}
