import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy,
  FileCode2, Lightbulb, ListChecks, Play, RefreshCw, RotateCcw,
  Search, ShieldCheck, Sparkles, Terminal, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedInputValidationLesson.css';

const STORAGE_KEY = 'guided-input-validation-lesson-044-progress';

const QUANTITY_CODE = `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int quantidade;
        do {
            System.out.println(
                    "Digite uma quantidade maior que zero:");
            quantidade = scanner.nextInt();

            if (quantidade <= 0) {
                System.out.println(
                        "Quantidade inválida. Use valor maior que zero.");
            }
        } while (quantidade <= 0);

        System.out.println("Quantidade válida: " + quantidade);
        scanner.close();
    }
}`;

const PATTERNS = [
  {
    label: 'if, while e do while', file: 'EstrategiasValidacao.java',
    code: `// if: informa uma vez, mas não pede correção
int quantidade = scanner.nextInt();
if (quantidade <= 0) {
    System.out.println("Quantidade inválida.");
}

// while: valor já foi lido antes do teste
while (quantidade <= 0) {
    quantidade = scanner.nextInt();
}

// do while: leitura obrigatória acontece no ciclo
do {
    quantidade = scanner.nextInt();
} while (quantidade <= 0);`,
    tests: ['if + -1 → informa, mas não repete', 'while: -1, 0, 5 → aceita 5', 'do while: lê ao menos uma vez'],
    insight: 'Escolha pela forma como o valor nasce. Nos dois loops, toda repetição precisa ler uma nova tentativa.'
  },
  {
    label: 'Faixa e menu', file: 'ValidacaoFaixa.java',
    code: `int prioridade;
do {
    prioridade = scanner.nextInt();
    if (prioridade < 1 || prioridade > 3) {
        System.out.println("Use prioridade 1, 2 ou 3.");
    }
} while (prioridade < 1 || prioridade > 3);`,
    tests: ['0 → bloqueia', '4 → bloqueia', '2 → aceita'],
    insight: 'A condição do loop descreve o estado inválido. Uma variável opcaoValida pode nomear listas maiores de opções.'
  },
  {
    label: 'Menu com boolean', file: 'MenuComBoolean.java',
    code: `int opcao;
boolean opcaoValida;
do {
    opcao = scanner.nextInt();
    opcaoValida = opcao == 0 || opcao == 1 || opcao == 2;
    if (!opcaoValida) {
        System.out.println("Use 0, 1 ou 2.");
    }
} while (!opcaoValida);`,
    tests: ['3 → bloqueia e orienta', '2 → aceita', '0 → aceita saída'],
    insight: 'Nomear opcaoValida evita repetir uma condição composta e deixa claro que o loop continua enquanto a política não for atendida.'
  },
  {
    label: 'Nome obrigatório', file: 'NomeComTrim.java',
    code: `String nome;
do {
    nome = scanner.nextLine().trim();
    if (nome.isBlank()) {
        System.out.println("Nome obrigatório.");
    }
} while (nome.isBlank());
System.out.println("Nome válido: " + nome);`,
    tests: ['"   " → bloqueia', '"  Maria  " → guarda "Maria"'],
    insight: 'trim() normaliza espaços nas pontas; isBlank() também reconhece texto vazio ou composto apenas por espaços.'
  },
  {
    label: 'Status conhecido', file: 'StatusPedidoValidado.java',
    code: `String status;
boolean statusValido;
do {
    status = scanner.nextLine().trim().toUpperCase();
    statusValido = status.equals("PENDENTE")
            || status.equals("APROVADO")
            || status.equals("RECUSADO")
            || status.equals("CANCELADO");
    if (!statusValido) System.out.println("Status inválido.");
} while (!statusValido);`,
    tests: ['" aprovado " → APROVADO', '"ABC" → bloqueia'],
    insight: 'Normalizar antes de comparar reduz falhas de caixa e espaço. Depois da validação, um switch ainda pode manter default como proteção.'
  },
  {
    label: 'Status e switch', file: 'StatusPedidoComSwitch.java',
    code: `String status = scanner.nextLine().trim().toUpperCase();
boolean valido = status.equals("PENDENTE")
        || status.equals("APROVADO")
        || status.equals("CANCELADO");

if (valido) {
    switch (status) {
        case "PENDENTE" -> System.out.println("Aguardar análise");
        case "APROVADO" -> System.out.println("Liberar pedido");
        case "CANCELADO" -> System.out.println("Encerrar pedido");
        default -> System.out.println("Proteção adicional");
    }
}`,
    tests: ['" aprovado " → Liberar pedido', '"abc" → não entra no switch'],
    insight: 'Validação define o conjunto aceito; switch processa o estado já validado. default continua como defesa, não como substituto da validação.'
  },
  {
    label: 'Senha e CPF simples', file: 'TamanhosMinimos.java',
    code: `do {
    senha = scanner.nextLine();
} while (senha.length() < 6);

do {
    cpf = scanner.nextLine().trim();
} while (cpf.length() != 11);`,
    tests: ['senha "java" → curta', 'CPF "123" → tamanho inválido'],
    insight: 'São validações didáticas de tamanho, não validação completa de senha ou CPF. Dígitos, política e algoritmo exigem regras futuras.'
  },
  {
    label: 'Pedido e pagamento', file: 'PagamentoValidado.java',
    code: `long valorCentavos;
int parcelas;
do {
    valorCentavos = scanner.nextLong();
} while (valorCentavos <= 0);
do {
    parcelas = scanner.nextInt();
} while (parcelas < 1 || parcelas > 12);

long valorParcela = valorCentavos / parcelas;`,
    tests: ['valor 0 → bloqueia', 'parcelas 0 → bloqueia', '12000 / 12 → 1000'],
    insight: 'Validar antes de dividir elimina divisão por zero e impede processamento monetário com estado inválido.'
  },
  {
    label: 'Produto e estoque', file: 'ProdutoValidado.java',
    code: `do {
    nomeProduto = scanner.nextLine().trim();
} while (nomeProduto.isBlank());

do {
    estoque = scanner.nextInt();
} while (estoque < 0);`,
    tests: ['nome vazio → bloqueia', 'estoque -1 → bloqueia', 'estoque 0 → válido'],
    insight: 'A regra correta é estoque não negativo. Zero pode representar produto sem unidades e continua sendo um estado válido.'
  },
  {
    label: 'OS e mensageria', file: 'EntradasOperacionais.java',
    code: `do {
    certificado = scanner.nextLine().trim();
} while (certificado.isBlank());

do {
    telefone = scanner.nextLine().trim();
} while (telefone.length() < 10);`,
    tests: ['certificado vazio → bloqueia', 'telefone com 9 caracteres → bloqueia'],
    insight: 'Certificado, telefone e tipo de mensagem ilustram proteção antes da operação; validações reais serão mais rigorosas.'
  },
  {
    label: 'Auditoria', file: 'AuditoriaValidada.java',
    code: `int quantidadeEventos;
do {
    quantidadeEventos = scanner.nextInt();
    if (quantidadeEventos < 0) {
        System.out.println("Eventos não pode ser negativo.");
    }
} while (quantidadeEventos < 0);

System.out.println("Eventos aceitos: " + quantidadeEventos);`,
    tests: ['-1 → bloqueia', '0 → válido: nenhum evento', '12 → válido'],
    insight: 'A regra de auditoria aceita zero, diferente de quantidade de pedido. Validação precisa refletir o domínio, não uma fórmula universal.'
  },
  {
    label: 'Tentativas limitadas', file: 'ValidacaoComLimiteTentativas.java',
    code: `int tentativas = 0;
boolean codigoValido = false;
do {
    int codigo = scanner.nextInt();
    codigoValido = codigo >= 100 && codigo <= 999;
    tentativas++;
} while (!codigoValido && tentativas < 3);

System.out.println(codigoValido
        ? "Código aceito"
        : "Limite atingido");`,
    tests: ['10, 99, 100 → aceita na 3ª', '1, 2, 3 → bloqueia após 3'],
    insight: 'O loop para por sucesso ou esgotamento. A condição composta expressa as duas regras sem repetir para sempre.'
  },
  {
    label: 'Todos os erros', file: 'CadastroClienteComErro.java',
    code: `do {
    possuiErro = false;
    nome = scanner.nextLine().trim();
    email = scanner.nextLine().trim();
    if (nome.isBlank()) {
        System.out.println("Nome obrigatório.");
        possuiErro = true;
    }
    if (!email.contains("@")) {
        System.out.println("E-mail inválido.");
        possuiErro = true;
    }
} while (possuiErro);`,
    tests: ['nome vazio + e-mail sem @ → mostra 2 erros', 'Ana + ana@site → aceita'],
    insight: 'Dois if independentes exibem todos os problemas. else if serviria quando a experiência pede apenas o primeiro erro.'
  }
];

const ERRORS = [
  { title: 'Valida e processa mesmo assim', code: `if (quantidade <= 0) {
    System.out.println("Inválida");
}
processar(quantidade);`, symptom: 'Uma quantidade negativa ainda chega ao processamento.', cause: 'if informou, mas não bloqueou nem pediu nova entrada.', fix: 'Use um loop de validação e processe somente depois de sair dele.' },
  { title: 'Não lê novamente', code: `while (quantidade <= 0) {
    System.out.println("Inválida");
}`, symptom: 'Loop infinito repetindo a mesma mensagem.', cause: 'quantidade não muda dentro do loop.', fix: 'Leia uma nova tentativa em todo caminho que repete.' },
  { title: 'Mensagem genérica', code: `System.out.println("Erro.");`, symptom: 'A pessoa não sabe qual valor deve corrigir.', cause: 'A mensagem bloqueia sem explicar a regra.', fix: 'Diga campo, motivo e faixa: “Quantidade deve ser maior que zero.”' },
  { title: 'Condição complexa repetida', code: `while (opcao != 1 && opcao != 2 && opcao != 0) { }`, symptom: 'A regra fica difícil de reler e fácil de divergir.', cause: 'A política não recebeu um nome.', fix: 'Calcule boolean opcaoValida e repita enquanto !opcaoValida.' },
  { title: 'String comparada com ==', code: `if (status == "APROVADO") { }`, symptom: 'Textos iguais podem não entrar no if.', cause: '== entre referências testa identidade, não o conteúdo textual.', fix: 'Use "APROVADO".equals(status).' },
  { title: 'Espaços não normalizados', code: `status = scanner.nextLine();`, symptom: '" aprovado " falha na comparação.', cause: 'Espaços nas pontas permanecem no texto.', fix: 'Use trim() antes de validar quando a regra permite remover espaços.' },
  { title: 'Caixa não normalizada', code: `status.equals("APROVADO")`, symptom: '"aprovado" é rejeitado.', cause: 'A comparação diferencia maiúsculas e minúsculas.', fix: 'Normalize com toUpperCase() quando o contrato aceitar variações de caixa.' },
  { title: 'nextInt seguido de nextLine', code: `int idade = scanner.nextInt();
String nome = scanner.nextLine();`, symptom: 'nome recebe a quebra de linha pendente.', cause: 'nextInt() lê o número, mas deixa o fim da linha.', fix: 'Chame scanner.nextLine() uma vez antes de ler o nome.' },
  { title: 'Tentativa sem limite', code: `do {
    codigo = scanner.nextInt();
} while (!codigoValido);`, symptom: 'Fluxo crítico pode repetir para sempre.', cause: 'A regra não definiu quantidade máxima.', fix: 'Combine !codigoValido && tentativas < limite quando o domínio exigir limite.' },
  { title: 'Confunde regra lógica e leitura', code: `int quantidade = scanner.nextInt(); // usuário digita abc`, symptom: 'O Scanner pode lançar erro técnico antes da regra quantidade > 0.', cause: 'A aula valida valores do tipo correto, não conversão de texto inválido.', fix: 'Registre a fronteira: tratamento técnico com exceções será estudado depois.' }
];

const EVIDENCE = `# Aula 044 — Validação de Entrada

- [ ] Diferenciei validação lógica de erro técnico de leitura
- [ ] Modelei o fluxo ler → normalizar → validar → processar
- [ ] Pedi nova entrada em todo caminho inválido
- [ ] Comparei if, while e do while pelo momento da leitura
- [ ] Escrevi mensagem com campo, regra e correção
- [ ] Validei faixa, menu, texto, status e centavos
- [ ] Usei trim, isBlank, contains, equals e toUpperCase com critério
- [ ] Corrigi nextInt seguido de nextLine
- [ ] Limitei tentativas quando a regra exigiu
- [ ] Nomeei a validade do menu com boolean
- [ ] Usei switch somente depois de validar o status
- [ ] Modelei auditoria aceitando zero e bloqueando negativo
- [ ] Comparei mostrar todos os erros e apenas o primeiro
- [ ] Provei que o processamento só acontece depois da validação

## Decisão
A regra lógica da entrada é:
A mensagem orienta a correção dizendo:
O limite de tentativas existe/não existe porque:
O erro técnico que ainda fica fora desta aula é:`;

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); } };
  return <button type="button" className="iv44-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file iv44-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function ValidationPipelineLab() {
  const [raw, setRaw] = useState(' aprovado ');
  const normalized = raw.trim().toUpperCase();
  const valid = ['PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO'].includes(normalized);
  return <section className="iv44-pipeline" aria-label="Fluxo interativo de validação de status">
    <label htmlFor="iv44-status">Entrada de status<input id="iv44-status" value={raw} onChange={event => setRaw(event.target.value)} /></label>
    <div className="iv44-pipe"><div><span>1</span><strong>Ler</strong><code>"{raw}"</code></div><b>→</b><div><span>2</span><strong>Normalizar</strong><code>"{normalized}"</code></div><b>→</b><div className={valid ? 'valid' : 'invalid'}><span>3</span><strong>Validar</strong><code>{valid ? 'aceito' : 'bloqueado'}</code></div><b>→</b><div className={valid ? 'ready' : 'blocked'}><span>4</span><strong>Processar</strong><code>{valid ? 'liberado' : 'não executa'}</code></div></div>
    <p>{valid ? `Status ${normalized} pode seguir para a regra ou switch.` : 'Informe PENDENTE, APROVADO, RECUSADO ou CANCELADO.'}</p>
  </section>;
}

function ErrorBoundaryLab() {
  const [input, setInput] = useState('-3');
  const integer = /^-?\d+$/.test(input.trim());
  const value = integer ? Number(input) : null;
  const logicalValid = integer && value > 0;
  return <section className="iv44-boundary"><div className="iv44-boundary-presets"><span>Teste a entrada:</span>{['5', '0', '-3', 'abc'].map(item => <button type="button" key={item} className={input === item ? 'active' : ''} onClick={() => setInput(item)}>{item}</button>)}</div><div className="iv44-boundary-result"><div className={!integer ? 'active technical' : ''}><strong>Erro técnico de leitura</strong><p>{integer ? 'Não ocorreu: a entrada representa um int.' : `"${input}" não representa int; nextInt() falharia antes da regra.`}</p></div><div className={integer && !logicalValid ? 'active logical' : ''}><strong>Validação lógica</strong><p>{!integer ? 'Nem começou: a leitura técnica falhou.' : logicalValid ? `${value} atende quantidade > 0.` : `${value} é int, mas não atende quantidade > 0.`}</p></div></div><small>Esta simulação separa os conceitos; a aula ainda não implementa tratamento de exceções do Scanner.</small></section>;
}

function RetryConsoleLab() {
  const attempts = [-1, 0, 5];
  const [step, setStep] = useState(0);
  const accepted = step >= attempts.length;
  const visible = attempts.slice(0, step);
  return <section className="iv44-retry"><CodePanel name="Main.java" code={QUANTITY_CODE} /><div className="iv44-terminal"><header><Terminal size={15} /> Console guiado</header><pre>{visible.map(value => `Digite uma quantidade maior que zero:\n> ${value}\n${value <= 0 ? 'Quantidade inválida. Use valor maior que zero.' : `Quantidade válida: ${value}`}`).join('\n') || 'Aguardando a primeira entrada...'}</pre><div className="iv44-retry-actions"><button type="button" disabled={accepted} onClick={() => setStep(value => value + 1)}><Play size={14} /> {step < attempts.length ? `Digitar ${attempts[step]}` : 'Finalizado'}</button><button type="button" onClick={() => setStep(0)}><RefreshCw size={14} /> Reiniciar</button></div></div></section>;
}

function ScannerLineLab() {
  const [fixed, setFixed] = useState(false);
  return <section className="iv44-scanner"><div className="iv44-scanner-keys"><span>entrada física</span><kbd>25</kbd><kbd>Enter ↵</kbd><kbd>Ana</kbd><kbd>Enter ↵</kbd></div><div className="iv44-scanner-flow"><div><strong>nextInt()</strong><span>consome 25</span></div><div className={fixed ? 'consumed' : 'pending'}><strong>{fixed ? 'nextLine() intermediário' : 'fim da linha pendente'}</strong><span>{fixed ? 'consome ↵' : 'permanece no Scanner'}</span></div><div className={fixed ? 'good' : 'bad'}><strong>nextLine() do nome</strong><span>{fixed ? 'recebe "Ana"' : 'recebe ""'}</span></div></div><button type="button" onClick={() => setFixed(value => !value)}><Wrench size={14} /> {fixed ? 'Remover correção' : 'Inserir scanner.nextLine()'}</button></section>;
}

function MultiFieldLab() {
  const [strategy, setStrategy] = useState('all');
  const [name, setName] = useState('   ');
  const [email, setEmail] = useState('ana.site');
  const errors = [];
  if (name.trim().length === 0) errors.push('Nome obrigatório.');
  if (!email.includes('@')) errors.push('E-mail precisa conter @.');
  const shown = strategy === 'all' ? errors : errors.slice(0, 1);
  return <section className="iv44-multifield"><div className="iv44-strategy"><button type="button" className={strategy === 'all' ? 'active' : ''} onClick={() => setStrategy('all')}>Mostrar todos</button><button type="button" className={strategy === 'first' ? 'active' : ''} onClick={() => setStrategy('first')}>Mostrar o primeiro</button></div><div className="iv44-fields"><label>Nome<input value={name} onChange={event => setName(event.target.value)} /></label><label>E-mail<input value={email} onChange={event => setEmail(event.target.value)} /></label></div><div className={shown.length ? 'iv44-errors' : 'iv44-success'}>{shown.length ? shown.map(error => <p key={error}><AlertTriangle size={15} /> {error}</p>) : <p><CheckCircle2 size={15} /> Cliente válido. O processamento pode começar.</p>}</div><small>O exemplo de e-mail é propositalmente simples; conter @ não é uma validação completa.</small></section>;
}

function PatternGallery() {
  const [selected, setSelected] = useState(0);
  const item = PATTERNS[selected];
  return <section className="iv44-gallery"><nav>{PATTERNS.map((entry, index) => <button type="button" key={entry.label} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}>{entry.label}</button>)}</nav><div className="iv44-gallery-content"><CodePanel name={item.file} code={item.code} /><div className="iv44-tests"><header><Terminal size={15} /> Casos de teste</header>{item.tests.map(test => <code key={test}>{test}</code>)}<p><Sparkles size={16} /> {item.insight}</p></div></div></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="iv44-clinic"><nav>{ERRORS.map((entry, index) => <button type="button" key={entry.title} className={index === selected ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span>{entry.title}</button>)}</nav><div className="iv44-diagnosis"><header><AlertTriangle size={20} /><div><small>Caso {selected + 1} de {ERRORS.length}</small><h3>{item.title}</h3></div></header><CodePanel name="Código sob investigação" code={item.code} /><div className="iv44-symptom"><strong>Sintoma</strong><code>{item.symptom}</code></div><div className="iv44-recovery"><span><Search size={16} /><div><strong>Causa</strong><p>{item.cause}</p></div></span><span><Wrench size={16} /><div><strong>Correção</strong><p>{item.fix}</p></div></span></div></div></section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: 'Criar laboratório', command: 'New-Item -ItemType Directory -Force labs\\m1\\aula-044-validacao-entrada\ncd labs\\m1\\aula-044-validacao-entrada', output: 'Directory: ...\\labs\\m1\\aula-044-validacao-entrada', note: 'Comece por Main, ValidacaoFaixa, NomeComTrim e StatusPedidoValidado.' },
    { title: 'Compilar núcleo', command: 'javac Main.java ValidacaoFaixa.java NomeComTrim.java StatusPedidoValidado.java\njava Main', output: 'Teste -1 → bloqueia\nTeste 0 → bloqueia\nTeste 5 → Quantidade válida: 5', note: 'javac sem mensagem é sucesso; registre tanto a entrada rejeitada quanto a aceita.' },
    { title: 'Testar fronteiras', command: 'java PagamentoValidado\n# valor: 0, depois 12000\n# parcelas: 0, 13, depois 12\njava NumeroETextoValidado', output: 'Pagamento válido / parcela 1000\nNome e idade aceitos após limpar a quebra de linha', note: 'Prove limites inferior/superior e a transição nextInt → nextLine.' },
    { title: 'Versionar entrega', command: 'git status\ngit diff\ngit add labs/m1/aula-044-validacao-entrada docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 044: pratica validacao de entrada em Java"\ngit status', output: 'nothing to commit, working tree clean', note: 'Revise as evidências e mantenha arquivos .class fora do commit.' }
  ];
  const current = stages[stage];
  return <section><div className="iv44-delivery-nav">{stages.map((entry, index) => <button type="button" key={entry.title} className={index === stage ? 'active' : ''} onClick={() => setStage(index)}><span>{index + 1}</span>{entry.title}</button>)}</div><div className="iv44-terminal"><header><Terminal size={15} /> PowerShell <small>passo {stage + 1} de {stages.length}</small></header><pre><strong>PS&gt; {current.command}</strong>{'\n\n'}{current.output}</pre><p><Lightbulb size={16} /> {current.note}</p></div><div className="guided-file iv44-code iv44-diary"><div className="guided-file-title"><ShieldCheck size={16} /> docs/diario-de-bordo.md<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>{EVIDENCE}</SyntaxHighlighter></div></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'pipeline') return <ValidationPipelineLab />;
  if (block.type === 'boundary') return <ErrorBoundaryLab />;
  if (block.type === 'retry') return <RetryConsoleLab />;
  if (block.type === 'scanner') return <ScannerLineLab />;
  if (block.type === 'multifield') return <MultiFieldLab />;
  if (block.type === 'patterns') return <PatternGallery />;
  if (block.type === 'errors') return <ErrorClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') { const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb; return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>; }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

const steps = [
  { id: 'pipeline', label: 'Fluxo protegido', eyebrow: 'Ler, normalizar, validar', title: 'Bloqueie o processamento até a entrada atender ao contrato', duration: '10 min', blocks: [
    { type: 'lead', text: 'Edite o status e acompanhe cada estágio. O processamento só deve ficar disponível depois que a validação lógica produzir um estado válido.' },
    { type: 'pipeline' },
    { type: 'note', title: 'Validação orienta, não apenas bloqueia', text: 'Uma boa mensagem informa o campo, a regra violada e como corrigir. “Erro” não ensina o próximo passo.' }
  ] },
  { id: 'fronteira', label: 'Lógico vs técnico', eyebrow: 'Escopo da aula', title: 'Separe valor inválido de falha na leitura do tipo', duration: '10 min', blocks: [
    { type: 'lead', text: 'Compare 0, -3 e abc. Os dois primeiros são inteiros lidos com sucesso, mas quebram a regra; abc pode falhar antes de a regra começar.' },
    { type: 'boundary' },
    { type: 'note', tone: 'warning', title: 'Sem falsa promessa', text: 'Esta aula não impede InputMismatchException quando nextInt() recebe texto. Try/catch e tratamento técnico serão estudados depois.' }
  ] },
  { id: 'repetir', label: 'Pedir até validar', eyebrow: 'Loop de validação', title: 'Teste -1, 0 e 5 e observe onde o fluxo é liberado', duration: '14 min', blocks: [
    { type: 'lead', text: 'Execute cada tentativa. A nova leitura precisa estar dentro do ciclo; ao sair dele, quantidade > 0 é uma garantia para o processamento seguinte.' },
    { type: 'retry' },
    { type: 'note', title: 'while ou do while', text: 'Use do while quando a coleta precisa acontecer pelo menos uma vez. Use while quando o valor já existe antes da verificação. As duas formas devem atualizar a entrada ao repetir.' }
  ] },
  { id: 'normalizar', label: 'Scanner e campos', eyebrow: 'Entrada textual', title: 'Normalize texto, limpe a linha e escolha como mostrar erros', duration: '16 min', blocks: [
    { type: 'lead', text: 'Primeiro corrija a transição de número para texto. Depois compare a experiência que mostra todos os erros com a que mostra somente o primeiro.' },
    { type: 'scanner' },
    { type: 'multifield' },
    { type: 'note', tone: 'warning', title: 'Validadores didáticos têm limites', text: 'contains("@"), tamanho de CPF e telefone mínimo servem para praticar fluxo; não representam validação profissional completa.' }
  ] },
  { id: 'padroes', label: 'Padrões de domínio', eyebrow: 'Regras reutilizáveis', title: 'Valide faixas, textos, estados, dinheiro e tentativas', duration: '22 min', blocks: [
    { type: 'lead', text: 'Explore os casos e leia primeiro as entradas de fronteira. Só depois confirme a condição Java e a evidência esperada.' },
    { type: 'patterns' },
    { type: 'note', title: 'Proteção inicial', text: 'O fluxo profissional é entrada → validação → regra → efeito. Não calcule, envie, registre ou persista antes de validar.' }
  ] },
  { id: 'clinica', label: 'Clínica de erros', eyebrow: 'Sintoma, causa e recuperação', title: 'Corrija dez formas de aceitar, travar ou interpretar mal a entrada', duration: '18 min', blocks: [
    { type: 'lead', text: 'Diagnostique cada falha pela consequência, execute os casos de fronteira e finalize com um cenário novo sem copiar o roteiro.' },
    { type: 'errors' }
  ] },
  { id: 'entrega', label: 'Entrega e desafio', eyebrow: 'Evidência e transferência', title: 'Entregue um cadastro protegido e testado nas fronteiras', duration: '20 min', blocks: [
    { type: 'lead', text: 'Compile o núcleo, teste valores abaixo, dentro e acima do contrato, registre as evidências e resolva a abertura de OS.' },
    { type: 'delivery' },
    { type: 'challenge', title: 'Desafio: abertura de ordem de serviço', text: 'Crie AberturaOsValidada.java. Colete certificado, prioridade, quantidade de atividades e valor estimado em centavos. Nenhum processamento pode ocorrer antes de todos os campos estarem válidos.', acceptance: [
      'Certificado tratado com trim e bloqueado quando isBlank().',
      'Prioridade limitada de 1 a 3 com mensagem que explica a faixa.',
      'Quantidade de atividades maior que zero.',
      'Valor estimado em centavos maior que zero.',
      'Teste ao menos duas entradas inválidas antes de cada entrada válida.',
      'Imprima “OS pronta para processamento” somente depois de todas as validações.',
      'Documente que texto no lugar de número ainda é erro técnico fora do escopo.',
      'Compile e faça commit sem arquivos .class.'
    ] }
  ] }
];

export default function GuidedInputValidationLesson044({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-input-validation-lesson">
    <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><ShieldCheck size={17} /> Proteção de entrada</span><p className="guided-sequence">044 · M1.24</p><h1>Validação de Entrada — Não Processe Dado Ruim</h1><p>Leia, normalize, valide e somente então processe. Você vai separar falhas lógicas de erros técnicos, construir ciclos de correção e escrever mensagens que realmente orientam.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{progress}%</strong><span>{completedStepIds.size} de {steps.length} etapas concluídas</span></div><div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header>
    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: '4', label: 'estágios protegidos' }, { value: '9', label: 'padrões praticados' }, { value: '10', label: 'diagnósticos praticáveis' }]} />
    <div className="guided-layout"><nav className="guided-step-nav" aria-label="Etapas da aula 044"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Fluxo de entrada protegido!</h3><p>{lessonComplete ? 'Leitura, normalização, validação e evidências consolidadas.' : 'Conclua a aula para consolidar a entrega.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 043</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Validação consolidada' : allStepsComplete ? 'Use o botão acima' : 'Leia, valide e só então processe'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir Arrays de Números'}>Aula 045 <ArrowRight size={17} /></button></footer>
  </article>;
}
