import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck,
  Check, CheckCircle2, ChevronRight, Clock3, Copy, FileCode2,
  Lightbulb, ListChecks, RotateCcw, Sparkles, Terminal, Play, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedMethodsWithParamsLesson.css';

const STORAGE_KEY = 'guided-methods-with-params-lesson-055-progress';

const EVIDENCE = [
  '# Aula 055 — Métodos com Parâmetros', '',
  '## Conceitos Base', '- [ ] Entendi que parâmetros são declarados na assinatura do método (vagas)', '- [ ] Entendi que argumentos são os valores reais passados na chamada (ocupantes)', '- [ ] Diferenciei escopo da main de escopo de variáveis locais do método', '',
  '## Passagem por Valor', '- [ ] Compreendi que Java sempre passa argumentos por valor', '- [ ] Verifiquei que alterar um primitivo dentro de um método não afeta a main', '- [ ] Aprendi que arrays e matrizes entregam uma cópia do valor da referência, que aponta para o mesmo objeto', '- [ ] Reconheci efeitos colaterais e a importância de expressá-los no nome do método', '',
  '## Higienização e Ordem', '- [ ] Notei o risco semântico de passar argumentos na ordem errada com tipos compatíveis', '- [ ] Construí validações defensivas no início do método contra nulos, vazios ou negativos', '- [ ] Utilizei return vazio em métodos void para abortar execuções perigosas', '',
  '## Evidências Locais', '- [ ] Criei, compilei e executei os 32 arquivos locais de laboratórios', '- [ ] Diagnostiquei a ausência de tipo de parâmetro em `ErroSemTipoParametro.java`', '- [ ] Corrigi a chamada de método sem argumento em `ErroChamadaSemArgumento.java`', '- [ ] Inspecionei a imutabilidade do primitivo na main em `ErroAlterarPrimitivo.java`', '- [ ] Documentei a mutação de array original em `ErroAlterarArraySemPerceber.java`',
  '',
  '## Decisão de Projeto', '- Por que a cópia da referência de arrays exige nomes descritivos quando o método altera o objeto compartilhado?', '- Qual a utilidade da guard clause com "return;" em rotinas void para tratar inputs inválidos?'
].join('\n');

// ── Utilidades ──────────────────────────────────────
function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  };
  return <button type="button" className="p55-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file p55-code">
      <div className="guided-file-title">
        <FileCode2 size={16} /> {name}
        <CopyButton value={code} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={lines}
        wrapLongLines
        customStyle={{ margin: 0, padding: '16px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// ── 1. Simulador de Passagem por Valor vs Referência ─
function PassingSimulator() {
  const [stepVal, setStepVal] = useState(-1);
  const [stepRef, setStepRef] = useState(-1);

  // Valor
  const stepsVal = [
    { label: 'Variável no main', desc: 'No main, declaramos estoque = 10 na Stack.' },
    { label: 'Chamada do método', desc: 'alterarEstoque(estoque) é chamado. O valor 10 é COPIADO para a Stack do método.' },
    { label: 'Modificação no método', desc: 'No método, reatribuímos a variável local: estoque = 99. Isso afeta apenas a vaga do método.' },
    { label: 'Retorno ao main', desc: 'O método se encerra, seu escopo de Stack é destruído. No main, estoque continua sendo 10.' }
  ];

  // Referência
  const stepsRef = [
    { label: 'Array no main', desc: 'No main, criamos estoques = {10, 20}. O ponteiro estoques fica na Stack, apontando para a Heap.' },
    { label: 'Chamada do método', desc: 'alterarPrimeiro(estoques) é chamado. A REFERÊNCIA de endereço da Heap é copiada para o método.' },
    { label: 'Modificação no método', desc: 'valores[0] = 99. O método acessa o endereço físico na Heap e modifica o elemento original.' },
    { label: 'Retorno ao main', desc: 'O método encerra. No main, ao imprimir estoques[0], vemos o valor alterado de 99.' }
  ];

  const currentVal = stepsVal[stepVal] || { label: 'Aguardando...', desc: 'Pressione "Avançar" para simular Passagem por Valor.' };
  const currentRef = stepsRef[stepRef] || { label: 'Aguardando...', desc: 'Pressione "Avançar" para simular a cópia do valor da referência.' };

  return (
    <section className="p55-passing-sim">
      <div className="p55-passing-card">
        <div className="p55-passing-header valor">
          Passagem por Valor (Primitivos) <span>int, long, double, boolean</span>
        </div>
        <div className="p55-memory-viz">
          <div className="p55-mem-segment">
            <span className="p55-mem-title">Stack (main)</span>
            <span className="p55-mem-val">estoque = 10</span>
          </div>
          <div className="p55-mem-segment">
            <span className="p55-mem-title">Stack (método)</span>
            <span className={`p55-mem-val ${stepVal >= 2 ? 'changed' : ''}`}>
              {stepVal >= 2 ? 'estoque = 99' : stepVal === 1 ? 'estoque = 10 (cópia)' : '—'}
            </span>
          </div>
        </div>
        <div style={{ minHeight: '70px' }}>
          <p style={{ fontSize: '.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            <strong>Etapa: {currentVal.label}</strong><br />
            {currentVal.desc}
          </p>
        </div>
        <button type="button" className="p55-sim-action" onClick={() => setStepVal(s => s < 3 ? s + 1 : -1)}>
          {stepVal === -1 ? 'Iniciar Simulação' : stepVal === 3 ? 'Reiniciar' : 'Avançar passo'}
        </button>
      </div>

      <div className="p55-passing-card">
        <div className="p55-passing-header ref">
          Referência copiada por valor <span>int[], String[], matrizes</span>
        </div>
        <div className="p55-memory-viz">
          <div className="p55-mem-segment">
            <span className="p55-mem-title">Stack (main/método)</span>
            <span className="p55-mem-val">ponteiro ➔ Heap [0x9ff]</span>
          </div>
          <div className="p55-mem-segment">
            <span className="p55-mem-title">Heap [0x9ff]</span>
            <span className={`p55-mem-val ${stepRef >= 2 ? 'success' : ''}`}>
              {stepRef >= 2 ? '[99, 20]' : '[10, 20]'}
            </span>
          </div>
        </div>
        <div style={{ minHeight: '70px' }}>
          <p style={{ fontSize: '.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            <strong>Etapa: {currentRef.label}</strong><br />
            {currentRef.desc}
          </p>
        </div>
        <button type="button" className="p55-sim-action" style={{ background: '#10b981' }} onClick={() => setStepRef(s => s < 3 ? s + 1 : -1)}>
          {stepRef === -1 ? 'Iniciar Simulação' : stepRef === 3 ? 'Reiniciar' : 'Avançar passo'}
        </button>
      </div>
    </section>
  );
}

// ── 2. Painel Anatômico do Cabeçalho ─────────────────
function AnatomyPanel() {
  return (
    <div className="p55-sim-box">
      <div className="p55-anatomy-box">
        <div className="p55-anatomy-line">
          <span className="p55-anatomy-part access" data-tooltip="Modificador de Acesso: Permite visibilidade pública">public</span>{' '}
          <span className="p55-anatomy-part static" data-tooltip="Modificador Estático: Permite chamada direta a partir do main">static</span>{' '}
          <span className="p55-anatomy-part type" data-tooltip="Tipo do Retorno: void indica que o método não devolve nada">void</span>{' '}
          <span className="p55-anatomy-part name" data-tooltip="Nome do Método: CamelCase expressando ação">exibirPedido</span>(
          <span className="p55-anatomy-part param" data-tooltip="Parâmetro 1: Tipo String, recebe o nome do cliente">String cliente</span>,{' '}
          <span className="p55-anatomy-part param" data-tooltip="Parâmetro 2: Tipo long, recebe o valor financeiro em centavos">long valorCentavos</span>,{' '}
          <span className="p55-anatomy-part param" data-tooltip="Parâmetro 3: Tipo String, recebe o status do fluxo">String status</span>
          ) &#123;
        </div>
        <div className="p55-anatomy-line">    // corpo do método usando as variáveis locais (cliente, valorCentavos, status)</div>
        <div className="p55-anatomy-line">&#125;</div>
      </div>
      <aside className="guided-note info">
        <Lightbulb size={20} />
        <div>
          <strong>Parâmetros como Vagas Declarativas</strong>
          <p>
            Na declaração, os parâmetros indicam o tipo físico exigido e dão nomes locais às vagas. Na chamada, o Java avalia se os argumentos enviados preenchem rigorosamente esses tipos na ordem em que foram propostos.
          </p>
        </div>
      </aside>
    </div>
  );
}

// ── 3. Lab de Escopos e Nomes ────────────────────────
function EscopoNomesLab() {
  const [equalName, setEqualName] = useState(true);

  const codeEqual = `public class Main {\n    public static void main(String[] args) {\n        String status = "APROVADO"; // escopo: main\n        exibir(status);\n    }\n\n    public static void exibir(String status) {\n        // escopo: método. Mesmo nome, variáveis físicas distintas!\n        System.out.println("Status: " + status);\n    }\n}`;
  const codeDiff = `public class Main {\n    public static void main(String[] args) {\n        String statusPedido = "APROVADO"; // escopo: main\n        exibir(statusPedido);\n    }\n\n    public static void exibir(String status) {\n        // escopo: método. Nomes diferentes, atribuição do valor normal!\n        System.out.println("Status: " + status);\n    }\n}`;

  return (
    <div className="p55-sim-box">
      <div className="p55-sim-controls">
        <label>Nome do argumento vs parâmetro:</label>
        <button type="button" className="p55-sim-action" style={{ background: equalName ? '#4f46e5' : '#334155' }} onClick={() => setEqualName(true)}>Nomes Iguais</button>
        <button type="button" className="p55-sim-action" style={{ background: !equalName ? '#4f46e5' : '#334155' }} onClick={() => setEqualName(false)}>Nomes Diferentes</button>
      </div>

      <div className="p55-sim-grid">
        <CodePanel name={equalName ? 'NomeIgualParametro.java' : 'NomeDiferenteParametro.java'} code={equalName ? codeEqual : codeDiff} lines={false} />
        <div className="p55-console success" style={{ justifyContent: 'center' }}>
          <header><Terminal size={14} /> Análise Lógica</header>
          <pre>{equalName
            ? 'Cenário: Nomes Iguais\n\n- O Java copia o valor de "status" do main para a vaga local do método.\n- Elas não compartilham o mesmo espaço de memória Stack.'
            : 'Cenário: Nomes Diferentes\n\n- O Java apenas se importa com a ordem e tipo dos dados.\n- A variável "statusPedido" é entregue perfeitamente ao parâmetro local "status".'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 4. Lab de Argumentos: Literais vs Variáveis ──────
function ArgumentosLab() {
  const [literal, setLiteral] = useState(true);

  const codeLiteral = `public class Main {\n    public static void main(String[] args) {\n        // Passando literais diretamente na chamada\n        exibirPedido("Ana", 1000L, "PENDENTE");\n    }\n}`;
  const codeVar = `public class Main {\n    public static void main(String[] args) {\n        // Declarando variáveis primeiro\n        String nomeCliente = "Ana";\n        long precoCentavos = 1000L;\n        String estado = "PENDENTE";\n\n        exibirPedido(nomeCliente, precoCentavos, estado);\n    }\n}`;

  return (
    <div className="p55-sim-box">
      <div className="p55-sim-controls">
        <label>Tipo de Argumento:</label>
        <button type="button" className="p55-sim-action" style={{ background: literal ? '#4f46e5' : '#334155' }} onClick={() => setLiteral(true)}>Valores Literais</button>
        <button type="button" className="p55-sim-action" style={{ background: !literal ? '#4f46e5' : '#334155' }} onClick={() => setLiteral(false)}>Variáveis de Apoio</button>
      </div>

      <div className="p55-sim-grid">
        <CodePanel name="UsoDeArgumentos.java" code={literal ? codeLiteral : codeVar} lines={false} />
        <div className="p55-console success">
          <header><Terminal size={14} /> Console</header>
          <pre>{`Cliente: Ana\nValor em centavos: 1000\nStatus: PENDENTE`}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 5. Lab de Validação Defensiva ───────────────────
function ValidacaoDefensivaLab() {
  const [cliente, setCliente] = useState('Ana');
  const [valor, setValor] = useState(1000);
  const [status, setStatus] = useState('PENDENTE');

  let logs = [];
  let valid = true;

  if (cliente === null || cliente.trim() === '') {
    logs.push('Cliente inválido. Interrompendo método via return;');
    valid = false;
  }
  if (valid && valor <= 0) {
    logs.push('Valor inválido. Interrompendo método via return;');
    valid = false;
  }
  if (valid && (status === null || status.trim() === '')) {
    logs.push('Status inválido. Interrompendo método via return;');
    valid = false;
  }

  if (valid) {
    logs.push(`Cliente: ${cliente.trim()}`);
    logs.push(`Valor em centavos: ${valor}`);
    logs.push(`Status: ${status.trim().toUpperCase()}`);
    logs.push('--------------------');
  }

  const code = `public static void exibirPedido(String cliente, long valorCentavos, String status) {\n    if (cliente == null || cliente.isBlank()) {\n        System.out.println("Cliente inválido.");\n        return; // escape imediato em void\n    }\n    if (valorCentavos <= 0) {\n        System.out.println("Valor inválido.");\n        return;\n    }\n    if (status == null || status.isBlank()) {\n        System.out.println("Status inválido.");\n        return;\n    }\n    System.out.println("Cliente: " + cliente.trim());\n    // ... rest of execution\n}`;

  return (
    <div className="p55-sim-box">
      <div className="p55-sim-controls">
        <label>Cliente:</label>
        <input
          style={{ width: '80px', padding: '6px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.8rem', fontFamily: 'Consolas' }}
          value={cliente}
          onChange={e => setCliente(e.target.value)}
        />
        <label style={{ marginLeft: '12px' }}>Centavos:</label>
        <input
          type="number"
          style={{ width: '80px', padding: '6px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.8rem', fontFamily: 'Consolas' }}
          value={valor}
          onChange={e => setValor(parseInt(e.target.value, 10) || 0)}
        />
        <label style={{ marginLeft: '12px' }}>Status:</label>
        <input
          style={{ width: '100px', padding: '6px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontSize: '.8rem', fontFamily: 'Consolas' }}
          value={status}
          onChange={e => setStatus(e.target.value)}
        />
      </div>

      <div className="p55-sim-grid">
        <CodePanel name="PedidoParametrosValidados.java" code={code} lines={false} />
        <div className={`p55-console ${valid ? 'success' : 'error'}`}>
          <header><Terminal size={14} /> Console de Auditoria</header>
          <pre>{logs.join('\n')}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 6. Galeria de Domínios ──────────────────────────
const DOMAINS = [
  {
    id: 'cliente', label: 'Cliente', file: 'ClienteComParametros.java',
    code: `public static void exibirCliente(String nome, String documento, String status) {\n    System.out.println("Cliente: " + nome);\n    System.out.println("Documento: " + documento);\n    System.out.println("Status: " + status);\n}`,
    output: 'Cliente: Ana\nDocumento: 12345678900\nStatus: ATIVO',
    insight: 'Isola os dados do cliente em parâmetros do tipo String com exibição formatada.'
  },
  {
    id: 'produto', label: 'Produto', file: 'ProdutoComParametros.java',
    code: `public static void exibirProduto(String nome, int estoque, String status) {\n    System.out.println("Produto: " + nome);\n    System.out.println("Estoque: " + estoque);\n    if (estoque == 0 && "ATIVO".equals(status)) {\n        System.out.println("Atenção: produto ativo sem estoque.");\n    }\n}`,
    output: 'Produto: Cadeira\nEstoque: 0\nAtenção: produto ativo sem estoque.',
    insight: 'Avalia a combinação lógica de parâmetros ativos com estoque zerado.'
  },
  {
    id: 'pedido', label: 'Pedido', file: 'PedidoComParametros.java',
    code: `public static void exibirPedido(String cliente, long valorCentavos, String status) {\n    System.out.println("Cliente: " + cliente);\n    System.out.println("Valor em centavos: " + valorCentavos);\n    System.out.println("Status: " + status);\n}`,
    output: 'Cliente: Bruno\nValor em centavos: 2500\nStatus: APROVADO',
    insight: 'Consolida informações de negócios comuns a pedidos comerciais.'
  },
  {
    id: 'pagamento', label: 'Pagamento', file: 'PagamentoComParametros.java',
    code: `public static void exibirPagamento(long valorCentavos, int parcelas) {\n    if (valorCentavos <= 0 || parcelas <= 0) return;\n    long valorParcela = valorCentavos / parcelas;\n    System.out.println("Valor da parcela: " + valorParcela);\n}`,
    output: 'Valor da parcela: 2500',
    insight: 'Efetua a divisão financeira no método e apresenta o resultado simulado.'
  },
  {
    id: 'os', label: 'Ordem de Serviço', file: 'OrdemServicoComParametros.java',
    code: `public static void exibirOS(String certificado, String status, int atividades) {\n    System.out.println("Certificado: " + certificado);\n    System.out.println("Status: " + status);\n    System.out.println("Atividades: " + atividades);\n}`,
    output: 'Certificado: OS-001\nStatus: ABERTA\nAtividades: 3',
    insight: 'Combina identificadores alfamétricos com números inteiros na OS.'
  },
  {
    id: 'auditoria', label: 'Auditoria', file: 'AuditoriaComParametros.java',
    code: `public static void registrarAuditoria(String usuario, String operacao, String status) {\n    System.out.println("Usuário: " + usuario);\n    System.out.println("Operação: " + operacao);\n    System.out.println("Status: " + status);\n}`,
    output: 'Usuário: aline\nOperação: CRIACAO\nStatus: SUCESSO',
    insight: 'Método de ação parametrizado para registrar logs de rastreabilidade de sistema.'
  },
  {
    id: 'mensageria', label: 'Mensageria', file: 'MensageriaComParametros.java',
    code: `public static void exibirMensagem(String cliente, String tipo, int tentativas) {\n    System.out.println("Cliente: " + cliente);\n    if (tentativas > 2) System.out.println("Muitas tentativas!");\n}`,
    output: 'Cliente: Bruno\nMuitas tentativas!',
    insight: 'Adiciona avisos dinâmicos no fluxo baseado na contagem de tentativas enviada.'
  }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return (
    <section className="p55-domains-gallery">
      <div className="p55-domains-sidebar">
        {DOMAINS.map((d, i) => (
          <button key={d.id} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>{d.label}</button>
        ))}
      </div>
      <div className="p55-domains-content">
        <CodePanel name={item.file} code={item.code} lines={false} />
        <div className="p55-console">
          <header><Terminal size={14} /> Console</header>
          <pre>{item.output}</pre>
          <p><Sparkles size={14} /> {item.insight}</p>
        </div>
      </div>
    </section>
  );
}

// ── 7. Clínica de Erros ─────────────────────────────
const ERRORS = [
  {
    title: 'Confundir parâmetro com argumento',
    code: `// Chamada errada no main:\nexibirNome(String nome); // Tenta colocar tipo na chamada!`,
    symptom: 'Compilation error: \'.class\' expected or unexpected token: String',
    cause: 'Declarar o tipo da variável durante o envio do argumento na chamada do método.',
    fix: 'Envie apenas o valor real ou a variável de apoio: `exibirNome("Ana");`.'
  },
  {
    title: 'Passar argumentos na ordem errada',
    code: `// Assinatura: exibir(String nome, String documento)\nexibir("12345678900", "Ana"); // compila mas fica semanticamente trocado!`,
    symptom: 'Sintoma: O console inverte os dados apresentando o documento como nome.',
    cause: 'Como os tipos coincidem (String, String), o Java aceita o envio, mas a semântica de ordem é quebrada.',
    fix: 'Respeite a ordem declarada na assinatura durante a formulação dos argumentos.'
  },
  {
    title: 'Utilizar nomes de parâmetros genéricos',
    code: `public static void p(String a, String b, int c) {\n    System.out.println(a + b + c);\n}`,
    symptom: 'Dificuldade de manutenção: impossível deduzir as responsabilidades sem inspecionar o código completo.',
    cause: 'Falta de zelo na nomenclatura declarativa de parâmetros estruturais.',
    fix: 'Renomeie para descrever o negócio: `exibirPedido(String cliente, String status, int parcelas)`.'
  },
  {
    title: 'Esquecer de declarar o tipo de dado',
    code: `public static void exibirNome(nome) {\n    System.out.println(nome); // Erro de sintaxe!\n}`,
    symptom: 'Compilation error: <identifier> expected',
    cause: 'Falta do tipo (ex: String, int) antes do identificador do parâmetro no cabeçalho.',
    fix: 'Especifique o tipo de dado no parâmetro: `public static void exibirNome(String nome)`.'
  },
  {
    title: 'Chamar método sem enviar argumento obrigatório',
    code: `// Assinatura: exibir(String msg)\nexibir(); // Não envia argumentos!`,
    symptom: 'Compilation error: method exibir in class Main cannot be applied to given types; actual and formal argument lists differ in length',
    cause: 'A chamada deixa de preencher as vagas definidas na assinatura do método.',
    fix: 'Preencha todos os argumentos obrigatórios: `exibir("Olá");`.'
  },
  {
    title: 'Enviar tipo incompatível com o esperado',
    code: `// Assinatura: quantidade(int q)\nquantidade("dez"); // Envia String no int!`,
    symptom: 'Compilation error: incompatible types: String cannot be converted to int',
    cause: 'O argumento passado na chamada difere fisicamente do tipo do parâmetro associado.',
    fix: 'Envie um literal ou variável compatível: `quantidade(10);`.'
  },
  {
    title: 'Crê que alterar primitivo altera fora',
    code: `public static void alterar(int estoque) {\n    estoque = 99;\n}`,
    symptom: 'O valor na main continua intacto, ignorando a atribuição interna do método.',
    cause: 'Tipos primitivos são passados por valor (cópia), impossibilitando mutação da variável original.',
    fix: 'Para refletir alterações, utilize retorno do valor modificado ou passe uma coleção mutável.'
  },
  {
    title: 'Alterar array recebido por acidente (Heap)',
    code: `public static void exibir(int[] valores) {\n    valores[0] = 99; // altera o original!\n}`,
    symptom: 'Efeito colateral indesejado: o array original na main tem seus elementos desconfigurados.',
    cause: 'O método recebe uma cópia da referência; ela aponta para o mesmo array, então a mutação afeta o objeto compartilhado na Heap.',
    fix: 'Evite atribuições no array se o método for de exibição. Crie cópias se necessário.'
  },
  {
    title: 'Método com excesso de parâmetros',
    code: `public static void cadastrar(String a, String b, String c, String d, String e, int f, int g)`,
    symptom: 'Chamadas extremamente extensas com alto índice de erros de digitação e acoplamento.',
    cause: 'Acúmulo de dados correlacionados em uma única assinatura.',
    fix: 'Planeje o agrupamento futuro dessas variáveis em objetos/classes específicas.'
  },
  {
    title: 'Não validar parâmetros críticos',
    code: `public static void normalizar(String status) {\n    System.out.println(status.trim()); // Se status for null, quebra!\n}`,
    symptom: 'Runtime error: java.lang.NullPointerException',
    cause: 'Ausência de guard clauses no início do método contra entradas nulas ou vazias.',
    fix: 'Adicione a validação defensiva: `if (status == null) return;`.'
  }
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="p55-errors-clinic">
      <nav className="p55-errors-nav">
        {ERRORS.map((e, i) => (
          <button key={i} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>
            <span>{i + 1}</span>
            <span className="guided-error-label">{e.title}</span>
          </button>
        ))}
      </nav>
      <div className="p55-error-card">
        <header>
          <AlertTriangle size={20} />
          <div>
            <small>Caso {selected + 1} de {ERRORS.length}</small>
            <h3>{item.title}</h3>
          </div>
        </header>
        <div style={{ padding: '0 14px' }}>
          <CodePanel name="Código Problemático" code={item.code} lines={false} />
        </div>
        <section style={{ margin: '12px 14px' }}>
          <small style={{ display: 'block', marginBottom: '4px', fontSize: '.65rem', color: '#475569', fontWeight: 'bold' }}>Sintoma no console</small>
          <code style={{ display: 'block', padding: '10px', color: '#fecdd3', background: '#0f172a', borderRadius: '8px', fontSize: '.72rem', fontFamily: 'Consolas, monospace', whiteSpace: 'pre-wrap' }}>{item.symptom}</code>
        </section>
        <div className="p55-error-flow">
          <span>
            <AlertTriangle size={16} />
            <div><strong>Causa raiz</strong><p>{item.cause}</p></div>
          </span>
          <ChevronRight size={18} />
          <span>
            <Wrench size={16} />
            <div><strong>Como corrigir</strong><p>{item.fix}</p></div>
          </span>
        </div>
      </div>
    </section>
  );
}

const GUIDED_PROGRAM_055 = `public class OficinaMetodosParametros {
    public static void main(String[] args) {
        String cliente = "Ana";
        long valorCentavos = 6000L;
        String[] status = {" pendente ", "aprovado"};
        int[][] quantidades = {{2, 3}, {1, 4}};
        int[] notas = {8, 9, 10};

        exibirPedido(cliente, valorCentavos, "PENDENTE");
        normalizarStatus(status);
        long total = calcularTotal(valorCentavos, 3);
        int itens = somarMatriz(quantidades);
        double media = calcularMedia(notas);
        boolean autorizado = podeProcessar(true, media);

        System.out.println("Status 2: " + status[1]);
        System.out.println("Total de 3 pedidos: " + total);
        System.out.println("Itens na matriz: " + itens);
        System.out.println("Média: " + media);
        System.out.println("Processamento autorizado: " + autorizado);
    }

    static void exibirPedido(String cliente, long valorCentavos, String status) {
        if (cliente == null || cliente.isBlank() || valorCentavos <= 0) {
            System.out.println("Pedido inválido.");
            return;
        }
        System.out.println(cliente + " | " + valorCentavos + " | " + status);
    }

    static long calcularTotal(long valorUnitarioCentavos, int quantidade) {
        return valorUnitarioCentavos * quantidade;
    }

    static void normalizarStatus(String[] status) {
        if (status == null) return;
        for (int i = 0; i < status.length; i++) {
            if (status[i] != null) status[i] = status[i].trim().toUpperCase();
        }
    }

    static int somarMatriz(int[][] matriz) {
        int total = 0;
        for (int[] linha : matriz) {
            for (int valor : linha) total += valor;
        }
        return total;
    }

    static double calcularMedia(int[] notas) {
        if (notas == null || notas.length == 0) return 0.0;
        int soma = 0;
        for (int nota : notas) soma += nota;
        return (double) soma / notas.length;
    }

    static boolean podeProcessar(boolean ativo, double media) {
        return ativo && media >= 7.0;
    }
}`;

// ── 8. Entrega & Desafio ────────────────────────────
function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Criar Diretório',
      cmd: `New-Item -ItemType Directory -Force labs\\m1\\aula-055-metodos-com-parametros\ncd labs\\m1\\aula-055-metodos-com-parametros\nNew-Item Main.java, ParametroInt.java, ParametroLong.java, ParametroDouble.java, ParametroBoolean.java, ParametroString.java, VariosParametros.java, ClienteComParametros.java, ProdutoComParametros.java, PedidoComParametros.java, PagamentoComParametros.java, OrdemServicoComParametros.java, AuditoriaComParametros.java, MensageriaComParametros.java, ValidarStatusComParametro.java, ArrayComoParametro.java, ArrayParametroComRetorno.java, MatrizComoParametro.java, MatrizParametroComRetorno.java, PrimitivoComoParametro.java, ArrayAlteradoPorMetodo.java, NormalizarArrayStatusParametro.java, LegibilidadeRuimParametros.java, LegibilidadeBoaParametros.java, PedidoParametrosValidados.java, NomeIgualParametro.java, NomeDiferenteParametro.java, ErroSemTipoParametro.java, ErroChamadaSemArgumento.java, ErroOrdemString.java, ErroAlterarPrimitivo.java, ErroAlterarArraySemPerceber.java`,
      out: 'Criado com sucesso — 32 arquivos de laboratório para a Aula 055.',
      tip: 'Cada arquivo deve ser populado com as assinaturas e testes adequados.'
    },
    {
      title: 'Validar Erros na Compilação',
      cmd: `javac ErroSemTipoParametro.java\njavac ErroChamadaSemArgumento.java`,
      out: `ErroSemTipoParametro:\n<identifier> expected\npublic static void exibirNome(nome)\n\nErroChamadaSemArgumento:\nmethod exibirNome in class Main cannot be applied to given types`,
      tip: 'Note como o compilador Java intercepta parâmetros mal declarados ou chamadas sem argumentos.'
    },
    {
      title: 'Testar Valor vs Referência',
      cmd: `javac PrimitivoComoParametro.java ArrayAlteradoPorMetodo.java\njava PrimitivoComoParametro\njava ArrayAlteradoPorMetodo`,
      out: `PrimitivoComoParametro:\nQuantidade no método: 99\nQuantidade no main: 10\n\nArrayAlteradoPorMetodo:\n99`,
      tip: 'O primitivo é copiado e o original não muda. No array, a referência também é copiada, mas as duas cópias alcançam o mesmo objeto na Heap.'
    },
    {
      title: 'Commit de Fechamento',
      cmd: `git status\ngit add labs/m1/aula-055-metodos-com-parametros docs/diario-de-bordo.md\ngit commit -m "Aula 055: pratica metodos com parametros"\ngit status`,
      out: 'nothing to commit, working tree clean',
      tip: 'Sempre garanta que os arquivos de classe compilados (.class) fiquem de fora do repositório.'
    }
  ];
  const current = steps[stage];

  return (
    <section>
      <div className="p55-delivery-nav">
        {steps.map((s, i) => (
          <button key={s.title} type="button" className={stage === i ? 'active' : ''} onClick={() => setStage(i)}>
            <span>{i < stage ? <Check size={11} /> : i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="p55-terminal">
        <header><Terminal size={14} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={14} /> {current.tip}</p>
      </div>
      <div className="p55-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button>
      </div>

      <aside className="guided-note info" style={{ marginTop: '20px' }}>
        <Lightbulb size={20} />
        <div><strong>Exemplo guiado antes do desafio</strong><p>Execute esta classe para comparar parâmetros primitivos, String, array e matriz. Observe que todos são passados por valor; no array e na matriz, o valor copiado é uma referência para o mesmo objeto.</p></div>
      </aside>
      <CodePanel name="OficinaMetodosParametros.java" code={GUIDED_PROGRAM_055} />
      <div className="p55-console success">
        <header><Terminal size={14} /> Saída esperada</header>
        <pre>{'Ana | 6000 | PENDENTE\nStatus 2: APROVADO\nTotal de 3 pedidos: 18000\nItens na matriz: 10\nMédia: 9.0\nProcessamento autorizado: true'}</pre>
      </div>

      <section className="guided-challenge" style={{ marginTop: '20px' }}>
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: CadastroProdutosComParametros.java</h3></div>
        <p>Crie <code>CadastroProdutosComParametros.java</code> na pasta da aula. Declare arrays de controle no main: <code>String[] nomes = new String[5]</code>, <code>int[] estoques = new int[5]</code> e <code>long[] precosCentavos = new long[5]</code>. Implemente métodos estáticos void com parâmetros validados:</p>
        <ul>
          <li><strong>cadastrarProduto(String[] nomes, int[] estoques, long[] precos, int indice, String nome, int estoque, long preco)</strong>: Recebe as estruturas e os valores. Valida se o índice está nos limites, se o nome não é nulo/vazio, se o estoque é positivo e se o preço é maior que zero. Se inválido, imprime aviso e encerra com <code>return;</code>. Caso contrário, atribui aos arrays correspondentes (provocando efeitos colaterais saudáveis).</li>
          <li><strong>exibirEstoqueAlerta(String[] nomes, int[] estoques, int limiteAlerta)</strong>: Percorre os arrays. Se o estoque estiver abaixo ou igual ao <code>limiteAlerta</code>, imprime o alerta de baixa do produto.</li>
        </ul>
      </section>

      <div className="guided-file p55-code" style={{ marginTop: '16px' }}>
        <div className="guided-file-title">
          <BookOpenCheck size={16} /> docs/diario-de-bordo.md
          <CopyButton value={EVIDENCE} label="Copiar evidências" />
        </div>
        <SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '16px', background: '#0f172a', fontSize: '.76rem', lineHeight: 1.65 }}>
          {EVIDENCE}
        </SyntaxHighlighter>
      </div>
    </section>
  );
}

// ── Bloco Condicional ───────────────────────────────
function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'passing_sim') return <PassingSimulator />;
  if (block.type === 'anatomy') return <AnatomyPanel />;
  if (block.type === 'escopo') return <EscopoNomesLab />;
  if (block.type === 'args') return <ArgumentosLab />;
  if (block.type === 'valid') return <ValidacaoDefensivaLab />;
  if (block.type === 'domains') return <DomainsGallery />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={`guided-note ${block.tone || 'info'}`}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  return null;
}

// ── Roteiro ──────────────────────────────────────────
const steps = [
  {
    id: 'passing', eyebrow: 'Fluxo Físico', label: 'Valor vs Referência',
    title: 'Entendendo a passagem de dados na memória Stack e Heap', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Simule o fluxo para primitivos (cópia por valor) e coleções (passagem da referência da Heap):' }, { type: 'passing_sim' }]
  },
  {
    id: 'anatomia', eyebrow: 'Estrutura Técnica', label: 'Anatomia da Assinatura',
    title: 'A especificação de modificadores, tipos e nomes locais', duration: '5 min',
    blocks: [{ type: 'lead', text: 'Passe o mouse sobre cada elemento de um cabeçalho de método parametrizado:' }, { type: 'anatomy' }]
  },
  {
    id: 'escopo', eyebrow: 'Lógica Isolada', label: 'Escopo e Nomes',
    title: 'Isolamento de variáveis locais e mapeamento de argumentos', duration: '5 min',
    blocks: [{ type: 'lead', text: 'Veja como o Java isola variáveis da main com nomes idênticos ou diferentes dos parâmetros:' }, { type: 'escopo' }]
  },
  {
    id: 'argumentos', eyebrow: 'Chamada de Rotinas', label: 'Literais vs Variáveis',
    title: 'Opções de formulação de dados na invocação de rotinas', duration: '5 min',
    blocks: [{ type: 'lead', text: 'Alterne as duas formas aceitáveis de passagem de argumentos:' }, { type: 'args' }]
  },
  {
    id: 'validacao', eyebrow: 'Tratamento Defensivo', label: 'Validação Defensiva',
    title: 'Barreiras contra nulos, vazios ou negativos usando escape return;', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Altere os inputs de entrada para observar a proteção ativa e o escape preventivo do método:' }, { type: 'valid' }]
  },
  {
    id: 'dominios', eyebrow: 'Arquitetura Aplicada', label: 'Galeria de Domínios',
    title: 'Aplicações corporativas do uso de parâmetros', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Navegue pelos domínios para entender a estruturação de assinaturas organizadas:' }, { type: 'domains' }]
  },
  {
    id: 'clinica', eyebrow: 'Depuração', label: 'Clínica de Erros',
    title: 'Estudo e correção das 10 falhas clássicas associadas a parâmetros', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Examine cada armadilha de parâmetros, os sintomas gerados pelo javac e a correção definitiva:' }, { type: 'errors' }]
  },
  {
    id: 'entrega', eyebrow: 'Prática no Terminal', label: 'Entrega & Desafio',
    title: 'Compilação dos 32 laboratórios e cadastro com efeitos colaterais', duration: '10 min',
    blocks: [{ type: 'lead', text: 'Acompanhe as fases de validação local por linha de comando no terminal PowerShell:' }, { type: 'delivery' }]
  }
];

// ── Componente Principal ─────────────────────────────
export default function GuidedMethodsWithParamsLesson055({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepNavRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const validIds = new Set(steps.map(step => step.id));
      return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []);
    } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds]));
  }, [completedStepIds]);

  useEffect(() => {
    if (!completionNormalizedRef.current && isCompleted && completedStepIds.size !== steps.length) {
      completionNormalizedRef.current = true;
      onToggleCompleted();
    }
  }, [completedStepIds.size, isCompleted, onToggleCompleted]);

  useEffect(() => {
    const activeButton = stepNavRef.current?.querySelector('button.active');
    if (activeButton && window.matchMedia('(max-width: 900px)').matches) {
      activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeIndex]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const completedLabel = `${completedStepIds.size} de ${steps.length} etapas concluídas`;

  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleActiveStep = () => {
    if (activeStepComplete && isCompleted) onToggleCompleted();
    setCompletedStepIds(prev => {
      const next = new Set(prev);
      if (next.has(activeStep.id)) next.delete(activeStep.id);
      else next.add(activeStep.id);
      return next;
    });
  };

  return (
    <article className="guided-git-lesson guided-methods-with-params-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Play size={17} /> Métodos</span>
          <p className="guided-sequence">055 · M1.35</p>
          <h1>Métodos com Parâmetros</h1>
          <p>Domine a entrada de dados em Java. Diferencie parâmetros de argumentos, compreenda que Java sempre passa por valor — inclusive ao copiar referências de coleções —, mitigue efeitos colaterais acidentais na Heap e projete validações robustas.</p>
        </div>
        <div className="guided-hero-status">
          <Play size={42} />
          <strong>{progress}%</strong>
          <span>{completedLabel}</span>
        </div>
        <div className="guided-hero-status-track" aria-label={`Progresso: ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula 055" items={[
        { value: 'Valor vs Ref', label: 'Stack vs Heap' },
        { value: 'Guard Clauses', label: 'Filtro defensivo' },
        { value: 'Efeito Colateral', label: 'Mutabilidade de array' }
      ]} />

      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 055">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
          {steps.map((step, index) => (
            <button type="button" key={step.id}
              className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')}
              onClick={() => selectStep(index)}>
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
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}>
              <ArrowLeft size={17} /> Etapa anterior
            </button>
            <div className="guided-step-actions-main">
              <button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>
                {activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}
              </button>
              {activeIndex < steps.length - 1 && (
                <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>
                  Próxima etapa <ArrowRight size={17} />
                </button>
              )}
            </div>
          </div>

          {allStepsComplete && (
            <section className="guided-finish">
              <CheckCircle2 size={30} />
              <div>
                <h3>Métodos com Parâmetros consolidados!</h3>
                <p>{lessonComplete ? 'Compreensão física de Stack e Heap e validação defensiva garantidos.' : 'Conclua a aula para registrar seu progresso no cronograma.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 054</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Métodos com parâmetros validados' : allStepsComplete ? 'Use o botão acima' : 'Pratique passagem de tipos, Stack vs Heap, guard clauses e mutações'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Próxima Aula'}>
          Aula 056 <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
