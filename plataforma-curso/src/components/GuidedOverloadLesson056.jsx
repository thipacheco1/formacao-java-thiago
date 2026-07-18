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
import './guidedOverloadLesson.css';

const STORAGE_KEY = 'guided-overload-lesson-056-progress';

const EVIDENCE = [
  '# Aula 056 — Sobrecarga de Métodos Inicial', '',
  '## Conceitos Base', '- [ ] Entendi que a sobrecarga (overload) permite criar métodos com o mesmo nome na classe', '- [ ] Identifiquei que as assinaturas devem diferir por quantidade, tipo ou ordem dos parâmetros', '- [ ] Aprendi que a escolha da versão ativa acontece em tempo de compilação', '',
  '## Restrições de Sobrecarga', '- [ ] Fixei que mudar apenas o tipo de retorno não constitui sobrecarga', '- [ ] Compreendi que alterar o nome dos parâmetros de entrada não muda a assinatura do método', '- [ ] Entendi a ambiguidade causada pelo uso de null em sobrecargas de referências conflitantes', '- [ ] Acompanhei a promoção implícita de tipos (ex: int promovido a long na falta de assinatura específica)', '',
  '## Boas Práticas', '- [ ] Implementei a delegação lógica das sobrecargas simplificadas chamando o método mais completo', '- [ ] Evitei sobrecargas confusas que escondem a intenção de negócio', '- [ ] Analisei o risco de usar booleanos cegos como argumentos em assinaturas sobrecarregadas', '',
  '## Evidências Locais', '- [ ] Criei, compilei e executei os 21 arquivos locais de laboratórios', '- [ ] Experimentei a falha de compilação em `ErroRetornoNaoDiferencia.java`', '- [ ] Inspecionei a falha por colisão de escopos em `ErroMesmoParametroNomeDiferente.java`', '- [ ] Diagnostiquei a chamada indeterminada por null em `ErroNullAmbiguo.java`',
  '',
  '## Decisão de Projeto', '- Por que prefiro delegar a chamada de sobrecargas mais simples para a versão mais completa com valores default?', '- Qual o perigo de criar sobrecargas de assinaturas diferenciadas apenas pela inversão de ordem dos mesmos tipos?'
].join('\n');

// ── Utilidades ──────────────────────────────────────
function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  };
  return <button type="button" className="v56-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file v56-code">
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

// ── 1. Resolutor de Sobrecarga (Overload Resolver) ──
function OverloadResolver() {
  const [arg1, setArg1] = useState('none');
  const [arg2, setArg2] = useState('none');
  const [arg3, setArg3] = useState('none');

  // Métodos disponíveis
  // 1: exibir(String)
  // 2: exibir(int)
  // 3: exibir(String, String)
  // 4: exibir(String, int)
  // 5: exibir(int, String)
  // 6: exibir(String, int, String)

  let activeMethod = -1;
  let codeCall = '';

  if (arg1 === 'String' && arg2 === 'none' && arg3 === 'none') {
    activeMethod = 0; // exibir(String)
    codeCall = 'exibir("Texto");';
  } else if (arg1 === 'int' && arg2 === 'none' && arg3 === 'none') {
    activeMethod = 1; // exibir(int)
    codeCall = 'exibir(10);';
  } else if (arg1 === 'String' && arg2 === 'String' && arg3 === 'none') {
    activeMethod = 2; // exibir(String, String)
    codeCall = 'exibir("Texto", "INFO");';
  } else if (arg1 === 'String' && arg2 === 'int' && arg3 === 'none') {
    activeMethod = 3; // exibir(String, int)
    codeCall = 'exibir("Texto", 10);';
  } else if (arg1 === 'int' && arg2 === 'String' && arg3 === 'none') {
    activeMethod = 4; // exibir(int, String)
    codeCall = 'exibir(10, "Texto");';
  } else if (arg1 === 'String' && arg2 === 'int' && arg3 === 'String') {
    activeMethod = 5; // exibir(String, int, String)
    codeCall = 'exibir("Texto", 10, "SUCESSO");';
  }

  const methods = [
    { sig: 'exibir(String msg)', desc: 'Imprime mensagem simples' },
    { sig: 'exibir(int cod)', desc: 'Imprime código do erro numérico' },
    { sig: 'exibir(String msg, String nivel)', desc: 'Imprime mensagem com nível de gravidade' },
    { sig: 'exibir(String msg, int cod)', desc: 'Imprime mensagem seguida do código' },
    { sig: 'exibir(int cod, String msg)', desc: 'Imprime código seguido da mensagem (ordem invertida)' },
    { sig: 'exibir(String msg, int cod, String nivel)', desc: 'Versão mais completa de exibição' }
  ];

  return (
    <div className="v56-resolver-visual">
      <div className="v56-resolver-grid">
        <div className="v56-resolver-options">
          <div className="v56-opt-row">
            <label>Argumento 1:</label>
            <select
              style={{ padding: '6px', background: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontFamily: 'Consolas' }}
              value={arg1} onChange={e => { setArg1(e.target.value); if (e.target.value === 'none') { setArg2('none'); setArg3('none'); } }}
            >
              <option value="none">Vazio (Nenhum)</option>
              <option value="String">String ("Texto")</option>
              <option value="int">int (10)</option>
            </select>
          </div>
          <div className="v56-opt-row">
            <label>Argumento 2:</label>
            <select
              style={{ padding: '6px', background: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontFamily: 'Consolas' }}
              disabled={arg1 === 'none'}
              value={arg2} onChange={e => { setArg2(e.target.value); if (e.target.value === 'none') setArg3('none'); }}
            >
              <option value="none">Vazio (Nenhum)</option>
              <option value="String">String ("Texto")</option>
              <option value="int">int (10)</option>
            </select>
          </div>
          <div className="v56-opt-row">
            <label>Argumento 3:</label>
            <select
              style={{ padding: '6px', background: '#020617', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0', fontFamily: 'Consolas' }}
              disabled={arg2 === 'none'}
              value={arg3} onChange={e => setArg3(e.target.value)}
            >
              <option value="none">Vazio (Nenhum)</option>
              <option value="String">String ("Texto")</option>
              <option value="int">int (10)</option>
            </select>
          </div>
        </div>

        <div className="v56-methods-list">
          {methods.map((m, idx) => (
            <div key={idx} className={`v56-method-item ${activeMethod === idx ? 'active' : ''}`}>
              <div>
                <strong>{m.sig}</strong>
                <small style={{ display: 'block', color: '#64748b', fontSize: '.68rem', marginTop: '2px' }}>{m.desc}</small>
              </div>
              {activeMethod === idx && <span>ATIVADO</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="v56-sim-grid" style={{ marginTop: '10px' }}>
        <CodePanel name="InvocacaoMain.java" code={`public class Main {\n    public static void main(String[] args) {\n        // O Java resolve qual chamar em tempo de compilação:\n        ${codeCall || '// Escolha argumentos válidos ao lado'}\n    }\n}`} lines={false} />
        <div className="v56-console success" style={{ minHeight: '120px' }}>
          <header><Terminal size={14} /> Resolutor de Assinatura</header>
          <pre>{activeMethod !== -1
            ? `Chamada resolvida com sucesso!\nAssinatura invocada: ${methods[activeMethod].sig}\n\n[Depuração]: O javac vinculou estaticamente a chamada ao método de índice [${activeMethod + 1}].`
            : 'Nenhuma assinatura correspondente encontrada.\n\n[Erro]: A combinação atual resultará em erro de compilação: "cannot find symbol / actual and formal argument lists differ in length".'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 2. Painel de Assinatura Conceitual ────────────────
function SignaturePanel() {
  return (
    <div className="v56-sim-box">
      <div className="v56-anatomy-box">
        <div className="v56-anatomy-line">
          <span className="v56-anatomy-part ignored" data-tooltip="Retorno: Ignorado pelo compilador para fins de sobrecarga">public static int</span>{' '}
          <span className="v56-anatomy-part sig" data-tooltip="Nome do método: Elemento estrutural central do Overload">somar</span>(
          <span className="v56-anatomy-part param" data-tooltip="Tipo do Parâmetro: Essencial. Determina a assinatura">int</span>{' '}
          <span className="v56-anatomy-part ignored" data-tooltip="Nome do Parâmetro: O Java ignora o nome do parâmetro da assinatura.">a</span>,{' '}
          <span className="v56-anatomy-part param" data-tooltip="Tipo do Parâmetro: Essencial">int</span>{' '}
          <span className="v56-anatomy-part ignored" data-tooltip="Nome do Parâmetro: Ignorado">b</span>
          ) &#123; ... &#125;
        </div>
      </div>
      <aside className="guided-note info">
        <Lightbulb size={20} />
        <div>
          <strong>Identidade da Assinatura no Compilador</strong>
          <p>
            Para o compilador do Java, a assinatura deste método se resume a: <code>somar(int, int)</code>. Tentar declarar outro método na mesma classe como <code>public static void somar(int x, int y)</code> resultará em erro de colisão de métodos duplicados, pois a assinatura gerada é exatamente a mesma.
          </p>
        </div>
      </aside>
    </div>
  );
}

// ── 3. Lab de Reutilização Limpa ─────────────────────
function ReutilizacaoLab() {
  const [delegated, setDelegated] = useState(true);

  const codeDuplicate = `// Ruim: Lógica de impressão repetida em todas as versões\npublic static void exibir(String msg) {\n    System.out.println("LOG: " + msg);\n}\npublic static void exibir(String msg, String nivel) {\n    System.out.println("LOG [" + nivel + "]: " + msg);\n}`;
  const codeClean = `// Recomendado: Sobrecargas menores delegam para a completa\npublic static void exibir(String msg) {\n    exibir(msg, "INFO"); // delega com valor padrão\n}\npublic static void exibir(String msg, String nivel) {\n    System.out.println("LOG [" + nivel + "]: " + msg); // centralizado!\n}`;

  return (
    <div className="v56-sim-box">
      <div className="v56-sim-controls">
        <label>Arquitetura da Sobrecarga:</label>
        <button type="button" className="v56-sim-action" style={{ background: !delegated ? '#ef4444' : '#334155' }} onClick={() => setDelegated(false)}>Com Duplicação</button>
        <button type="button" className="v56-sim-action" style={{ background: delegated ? '#10b981' : '#334155' }} onClick={() => setDelegated(true)}>Com Reutilização (Delegação)</button>
      </div>

      <div className="v56-sim-grid">
        <CodePanel name="FormatacaoLogs.java" code={delegated ? codeClean : codeDuplicate} lines={false} />
        <div className="v56-console success" style={{ justifyContent: 'center' }}>
          <header><Terminal size={14} /> Análise Arquitetural</header>
          <pre>{delegated
            ? 'Vantagem:\n- Manutenibilidade excelente.\n- Se você precisar mudar o prefixo "LOG" para "SYSTEM", alterará apenas uma linha na versão mais completa.'
            : 'Desvantagem:\n- Código repetitivo e propenso a falhas.\n- Se a formatação do log mudar, você terá que modificar todas as sobrecargas manualmente.'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 4. Lab de Ambiguidade de Null e Conversões ────────
function AmbiguityLab() {
  const [scenario, setScenario] = useState('promotion');

  const codePromotion = `public class Main {\n    public static void main(String[] args) {\n        exibir(10); // 10 é int. Será promovido para long?\n    }\n\n    public static void exibir(long valor) {\n        System.out.println("Assinatura de long ativada: " + valor);\n    }\n}`;
  const codeAmbiguity = `public class Main {\n    public static void main(String[] args) {\n        exibir(null); // String ou Integer? Ambiguidade!\n    }\n\n    public static void exibir(String texto) { ... }\n    public static void exibir(Integer numero) { ... }\n}`;

  const getCode = () => scenario === 'promotion' ? codePromotion : codeAmbiguity;

  return (
    <div className="v56-sim-box">
      <div className="v56-sim-controls">
        <label>Análise Avançada:</label>
        <button type="button" className="v56-sim-action" style={{ background: scenario === 'promotion' ? '#4f46e5' : '#334155' }} onClick={() => setScenario('promotion')}>Conversão Implícita (Promoção)</button>
        <button type="button" className="v56-sim-action" style={{ background: scenario === 'ambiguity' ? '#4f46e5' : '#334155' }} onClick={() => setScenario('ambiguity')}>Ambiguidade com Null</button>
      </div>

      <div className="v56-sim-grid">
        <CodePanel name={scenario === 'promotion' ? 'PromocaoTipos.java' : 'AmbiguidadeNull.java'} code={getCode()} lines={false} />
        <div className={`v56-console ${scenario === 'promotion' ? 'success' : 'error'}`}>
          <header><Terminal size={14} /> Console do Compilador</header>
          <pre>{scenario === 'promotion'
            ? 'Resultado: Assinatura de long ativada: 10\n\n[Análise]: Na ausência do método exibir(int), o compilador promove o argumento int de 32 bits para o parâmetro long de 64 bits automaticamente.'
            : 'Erro de compilação:\nreference to exibir is ambiguous\nboth method exibir(String) and method exibir(Integer) match'}</pre>
        </div>
      </div>
    </div>
  );
}

// ── 5. Galeria de Domínios ──────────────────────────
const DOMAINS = [
  {
    id: 'mensagem', label: 'Mensagens', file: 'MensagensSobrecarregadas.java',
    code: `public static void registrar(String msg) {\n    registrar(msg, "INFO", 0);\n}\npublic static void registrar(String msg, String nivel) {\n    registrar(msg, nivel, 0);\n}\npublic static void registrar(String msg, String nivel, int cod) {\n    System.out.println("[" + nivel + "] " + cod + " - " + msg);\n}`,
    output: '[ERRO] 500 - Falha ao gravar no banco',
    insight: 'Facilita o envio de logs rápidos até relatórios ricos contendo códigos específicos.'
  },
  {
    id: 'pedido', label: 'Pedido', file: 'PedidoSobrecargaMelhorada.java',
    code: `public static void exibirPedido(String cliente) {\n    exibirPedido(cliente, 0L, "SEM_STATUS");\n}\npublic static void exibirPedido(String cliente, long valor) {\n    exibirPedido(cliente, valor, "SEM_STATUS");\n}\npublic static void exibirPedido(String cliente, long valor, String status) {\n    System.out.println(cliente + " | " + valor + " | " + status);\n}`,
    output: 'Bruno | 2500 | SEM_STATUS',
    insight: 'Sobrecargas menores delegam o fluxo para a versão principal do pedido.'
  },
  {
    id: 'pagamento', label: 'Pagamento', file: 'PagamentoSobrecarga.java',
    code: `public static long calcularParcela(long valor) {\n    return calcularParcela(valor, 1);\n}\npublic static long calcularParcela(long valor, int parcelas) {\n    return valor / parcelas;\n}`,
    output: 'Valor da parcela única: 10000 c',
    insight: 'Se a quantidade de parcelas for omitida, assume 1 parcela (pagamento à vista) por padrão.'
  },
  {
    id: 'produto', label: 'Produto', file: 'ProdutoSobrecarga.java',
    code: `public static void exibirProduto(String nome) {\n    exibirProduto(nome, 0, "ATIVO");\n}\npublic static void exibirProduto(String nome, int estoque, String status) {\n    System.out.println(nome + " | Estoque: " + estoque + " | " + status);\n}`,
    output: 'Cadeira | Estoque: 0 | ATIVO\nAtenção: produto ativo sem estoque.',
    insight: 'Dispara alertas automáticos para produtos cadastrados sem itens em estoque.'
  },
  {
    id: 'os', label: 'Ordem de Serviço', file: 'OrdemServicoSobrecarga.java',
    code: `public static void exibirOs(String certificado) {\n    exibirOs(certificado, "ABERTA", 0);\n}\npublic static void exibirOs(String certificado, String status, int atividades) {\n    System.out.println("OS: " + certificado + " | Status: " + status);\n}`,
    output: 'OS: OS-001 | Status: ABERTA',
    insight: 'Suporta a visualização resumida ou detalhada da ordem de serviço.'
  },
  {
    id: 'auditoria', label: 'Auditoria', file: 'AuditoriaSobrecarga.java',
    code: `public static void registrar(String operacao) {\n    registrar(operacao, "DESCONHECIDO");\n}\npublic static void registrar(String operacao, String usuario) {\n    System.out.println("Op: " + operacao + " por: " + usuario);\n}`,
    output: 'Op: CRIACAO por: aline',
    insight: 'Registra auditorias de forma flexível quando o usuário executor é omitido.'
  },
  {
    id: 'mensageria', label: 'Mensageria', file: 'MensageriaSobrecarga.java',
    code: `public static void enviar(String cliente) {\n    enviar(cliente, "SMS", 1);\n}\npublic static void enviar(String cliente, String canal, int tentativas) {\n    System.out.println("Mensagem para " + cliente + " via " + canal);\n}`,
    output: 'Mensagem para Carla via SMS (Tentativa 1)',
    insight: 'Define SMS e tentativa inicial de forma transparente se omitidos.'
  }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return (
    <section className="v56-domains-gallery">
      <div className="v56-domains-sidebar">
        {DOMAINS.map((d, i) => (
          <button key={d.id} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>{d.label}</button>
        ))}
      </div>
      <div className="v56-domains-content">
        <CodePanel name={item.file} code={item.code} lines={false} />
        <div className="v56-console">
          <header><Terminal size={14} /> Console</header>
          <pre>{item.output}</pre>
          <p><Sparkles size={14} /> {item.insight}</p>
        </div>
      </div>
    </section>
  );
}

// ── 6. Clínica de Erros ─────────────────────────────
const ERRORS = [
  {
    title: 'Achar que mudar apenas o retorno é sobrecarga',
    code: `public static int obter() { return 10; }\npublic static String obter() { return "10"; } // tenta mudar retorno!`,
    symptom: 'Compilation error: method obter() is already defined in class Main',
    cause: 'O compilador identifica assinaturas baseando-se apenas nos parâmetros. Mudar o retorno gera colisão.',
    fix: 'Modifique os tipos dos parâmetros na assinatura ou utilize nomes de métodos diferentes.'
  },
  {
    title: 'Mudar o nome das variáveis do parâmetro',
    code: `public static void exibir(String texto) { }\npublic static void exibir(String mensagem) { } // tenta mudar nome do param!`,
    symptom: 'Compilation error: method exibir(String) is already defined in class Main',
    cause: 'Mudar apenas o nome da variável (texto vs mensagem) não altera o tipo físico na assinatura (String).',
    fix: 'Adicione parâmetros adicionais ou mude o tipo físico na sobrecarga.'
  },
  {
    title: 'Sobrecarga confusa com excesso de Strings',
    code: `public static void processar(String cliente, String status) { }\n// Chamada:\nprocessar("Ana", "APROVADO"); // E se eu esquecer qual é qual?`,
    symptom: 'Sintoma: O código compila sem erros, mas gera falhas lógicas graves por troca semântica de valores.',
    cause: 'Múltiplos parâmetros contíguos do mesmo tipo removem a segurança estática contra troca de ordem.',
    fix: 'Use nomes de métodos mais expressivos ou passe um objeto estruturado.'
  },
  {
    title: 'Sobrecargas com responsabilidades diferentes',
    code: `public static void calcular(int preco) { ... } // calcula desconto\npublic static void calcular(String log) { ... } // envia e-mail de log`,
    symptom: 'Dificuldade de leitura: O mesmo nome oculta ações totalmente díspares no sistema.',
    cause: 'Uso indevido do overload por preguiça de declarar nomes adequados.',
    fix: 'Declare nomes verbais distintos para as ações: `calcularDesconto` e `enviarEmailLog`.'
  },
  {
    title: 'Valores padrão sem coerência lógica',
    code: `public static void exibir(String cliente) {\n    exibir(cliente, -1L); // -1 centavos faz sentido para valor?\n}`,
    symptom: 'Sintoma: O sistema grava valores negativos nos relatórios, simulando faturamento inválido.',
    cause: 'Propagação de valores padrão inadequados que ferem a lógica de negócios da aplicação.',
    fix: 'Selecione valores de escape neutros coerentes (como 0L para moeda ou "SEM_STATUS" para strings).'
  },
  {
    title: 'Não compreender qual versão está ativa na chamada',
    code: `exibir(10); // Será que chamou a versão de int ou de long?`,
    symptom: 'Dúvidas em tempo de depuração e perda de visibilidade de execução.',
    cause: 'Falta de verificação ou uso de breakpoints para checar a resolução de chamadas.',
    fix: 'Pressione Ctrl (ou Cmd) e clique no nome do método para navegar até a versão física resolvida pelo IDE.'
  },
  {
    title: 'Utilização de null de forma ambígua',
    code: `public static void exibir(String t) { }\npublic static void exibir(Integer n) { }\n// Chamada:\nexibir(null); // O Java não sabe qual chamar!`,
    symptom: 'Compilation error: reference to exibir is ambiguous',
    cause: 'Como null é compatível com qualquer referência, o Java encontra mais de uma versão correspondente.',
    fix: 'Faça o cast explícito do null na chamada: `exibir((String) null);`.'
  },
  {
    title: 'Sobrecarga gerada para evitar pensar em nomes',
    code: `public static void fazer(int a) { }\npublic static void fazer(String b) { }`,
    symptom: 'Legibilidade fraca e código confuso no main.',
    cause: 'Abuso da ferramenta de sobrecarga sem uma coerência semântica de negócio.',
    fix: 'Dê nomes específicos aos métodos para descrever de forma verbosa a tarefa de negócio.'
  },
  {
    title: 'Sobrecargas acopladas a métodos gigantes',
    code: `// Se a sobrecarga principal possui 200 linhas de código com múltiplas validações complexas.`,
    symptom: 'Dificuldade de manutenção e fragilidade no reaproveitamento de código.',
    cause: 'Concentração de lógica extensa em um único método ao invés de delegar sub-tarefas.',
    fix: 'Extraia validações e sub-processos para métodos auxiliares puros menores.'
  },
  {
    title: 'Deixar de validar ou testar todas as assinaturas',
    code: `// Implementa 4 sobrecargas, mas a main só chama e valida a primeira.`,
    symptom: 'Aparecimento de bugs silenciosos e NullPointerExceptions nas sobrecargas menores não testadas.',
    cause: 'Falta de cobertura de testes manuais ou automatizados nas rotinas delegadas.',
    fix: 'Crie chamadas na main para testar rigorosamente todas as variações sobrecarregadas.'
  }
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="v56-errors-clinic">
      <nav className="v56-errors-nav">
        {ERRORS.map((e, i) => (
          <button key={i} type="button" className={selected === i ? 'active' : ''} onClick={() => setSelected(i)}>
            <span>{i + 1}</span>
            <span className="guided-error-label">{e.title}</span>
          </button>
        ))}
      </nav>
      <div className="v56-error-card">
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
        <div className="v56-error-flow">
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

const GUIDED_PROGRAM_056 = `public class OficinaSobrecarga {
    public static void main(String[] args) {
        registrar("Aplicação iniciada");
        registrar("Pedido inválido", "ERRO");
        registrar("Falha ao salvar", "ERRO", 500);
        System.out.println("Soma int: " + somar(10, 20));
        System.out.println("Soma long: " + somar(10L, 20L));
        System.out.println("Total int[]: " + somar(new int[] {10, 20, 30}));
        System.out.println("Status: " + statusValido(" pendente ", true));
    }

    static void registrar(String mensagem) {
        registrar(mensagem, "INFO");
    }

    static void registrar(String mensagem, String nivel) {
        registrar(mensagem, nivel, 0);
    }

    static void registrar(String mensagem, String nivel, int codigo) {
        System.out.println("[" + nivel + "] " + codigo + " - " + mensagem);
    }

    static int somar(int a, int b) {
        return a + b;
    }

    static long somar(long a, long b) {
        return a + b;
    }

    static int somar(int[] valores) {
        int total = 0;
        for (int valor : valores) total += valor;
        return total;
    }

    static boolean statusValido(String status) {
        return statusValido(status, false);
    }

    static boolean statusValido(String status, boolean aceitaPendente) {
        if (status == null) return false;
        String normalizado = status.trim().toUpperCase();
        return "APROVADO".equals(normalizado)
                || (aceitaPendente && "PENDENTE".equals(normalizado));
    }
}`;

// ── 7. Entrega & Desafio ────────────────────────────
function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Criar Diretório',
      cmd: `New-Item -ItemType Directory -Force labs\\m1\\aula-056-sobrecarga-metodos-inicial\ncd labs\\m1\\aula-056-sobrecarga-metodos-inicial\nNew-Item Main.java, SobrecargaPorQuantidade.java, SobrecargaPorTipo.java, SobrecargaPorOrdem.java, SobrecargaComRetorno.java, SobrecargaVoid.java, MensagensSobrecarregadas.java, PedidoSobrecarga.java, PedidoSobrecargaMelhorada.java, PagamentoSobrecarga.java, ProdutoSobrecarga.java, OrdemServicoSobrecarga.java, AuditoriaSobrecarga.java, MensageriaSobrecarga.java, SobrecargaArrays.java, StatusSobrecarga.java, ErroRetornoNaoDiferencia.java, ErroMesmoParametroNomeDiferente.java, ErroChamadaTiposInesperados.java, ErroSobrecargaConfusa.java, ErroNullAmbiguo.java`,
      out: 'Criado com sucesso — 21 arquivos de laboratório para a Aula 056.',
      tip: 'Organize os arquivos na estrutura física de pacotes recomendada.'
    },
    {
      title: 'Validar Erros na Compilação',
      cmd: `javac ErroRetornoNaoDiferencia.java\njavac ErroMesmoParametroNomeDiferente.java\njavac ErroNullAmbiguo.java`,
      out: `ErroRetornoNaoDiferencia:\nmethod obterValor() is already defined in class ErroRetornoNaoDiferencia\n\nErroMesmoParametroNomeDiferente:\nmethod exibir(String) is already defined in class ErroMesmoParametroNomeDiferente\n\nErroNullAmbiguo:\nreference to exibir is ambiguous`,
      tip: 'Estude como o compilador protege a integridade e impede a ambiguidade de assinaturas.'
    },
    {
      title: 'Executar Sobrecarga de Sucesso',
      cmd: `javac SobrecargaArrays.java StatusSobrecarga.java\njava SobrecargaArrays\njava StatusSobrecarga`,
      out: `SobrecargaArrays:\nTotal quantidades: 60\nTotal valores: 8500\n\nStatusSobrecarga:\ntrue\ntrue`,
      tip: 'Observe como o Java encaminha de forma autônoma os arrays e strings normalizados.'
    },
    {
      title: 'Commit de Fechamento',
      cmd: `git status\ngit add labs/m1/aula-056-sobrecarga-metodos-inicial docs/diario-de-bordo.md\ngit commit -m "Aula 056: pratica sobrecarga de metodos"\ngit status`,
      out: 'working tree clean',
      tip: 'Verifique com antecedência o diff staged para ter certeza da limpeza de arquivos compilados.'
    }
  ];
  const current = steps[stage];

  return (
    <section>
      <div className="v56-delivery-nav">
        {steps.map((s, i) => (
          <button key={s.title} type="button" className={stage === i ? 'active' : ''} onClick={() => setStage(i)}>
            <span>{i < stage ? <Check size={11} /> : i + 1}</span>
            {s.title}
          </button>
        ))}
      </div>
      <div className="v56-terminal">
        <header><Terminal size={14} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={14} /> {current.tip}</p>
      </div>
      <div className="v56-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button>
      </div>

      <aside className="guided-note info" style={{ marginTop: '20px' }}>
        <Lightbulb size={20} />
        <div><strong>Exemplo guiado antes do desafio</strong><p>Compile esta classe e relacione cada chamada à assinatura escolhida. Note que as versões simples delegam à mais completa e que o retorno não participa da decisão da sobrecarga.</p></div>
      </aside>
      <CodePanel name="OficinaSobrecarga.java" code={GUIDED_PROGRAM_056} />
      <div className="v56-console success">
        <header><Terminal size={14} /> Saída esperada</header>
        <pre>{'[INFO] 0 - Aplicação iniciada\n[ERRO] 0 - Pedido inválido\n[ERRO] 500 - Falha ao salvar\nSoma int: 30\nSoma long: 30\nTotal int[]: 60\nStatus: true'}</pre>
      </div>

      <section className="guided-challenge" style={{ marginTop: '20px' }}>
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: CalculadoraCustoServico.java</h3></div>
        <p>Crie <code>CalculadoraCustoServico.java</code> na pasta da aula. Implemente a sobrecarga do método de cálculo do custo de prestação de serviços corporativos usando as seguintes assinaturas com retorno puros e reutilização:</p>
        <ul>
          <li><strong>calcularCusto(long horasTrabalhadas)</strong>: Devolve o custo (long centavos) multiplicando as horas pela taxa padrão do sistema (R$ 150,00 por hora). Esse método deve delegar para a versão mais completa passando 0L de custo de material adicional.</li>
          <li><strong>calcularCusto(long horasTrabalhadas, long custoMateriaisCentavos)</strong>: Devolve a soma do faturamento de horas (horas * taxa de R$ 150,00) com o custo de materiais. Esse método deve delegar para a versão de 3 parâmetros enviando taxaHoraCentavos padrão de R$ 150,00.</li>
          <li><strong>calcularCusto(long horasTrabalhadas, long custoMateriaisCentavos, long taxaHoraCentavos)</strong>: A versão mais completa. Faz o cálculo físico: <code>(horasTrabalhadas * taxaHoraCentavos) + custoMateriaisCentavos</code> e valida se nenhum parâmetro é negativo (se for, retorna 0L).</li>
          <li><strong>Exibição no main</strong>: Chame as 3 versões no main e exiba as diferenças de faturamento no console.</li>
        </ul>
      </section>

      <div className="guided-file v56-code" style={{ marginTop: '16px' }}>
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
  if (block.type === 'resolver_sim') return <OverloadResolver />;
  if (block.type === 'signature') return <SignaturePanel />;
  if (block.type === 'reuso') return <ReutilizacaoLab />;
  if (block.type === 'ambiguity') return <AmbiguityLab />;
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
    id: 'resolver', eyebrow: 'Fluxo Estático', label: 'Overload Resolver',
    title: 'Resolvendo assinaturas com quantidade e tipo de dados', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Selecione e combine os tipos de argumentos e veja qual assinatura o Java ativa:' }, { type: 'resolver_sim' }]
  },
  {
    id: 'assinatura', eyebrow: 'Estrutura de Código', label: 'Assinatura Conceitual',
    title: 'O que de fato diferencia um método sobrecarregado', duration: '5 min',
    blocks: [{ type: 'lead', text: 'Confira as regras de identidade que o compilador lê para decidir se há duplicidade:' }, { type: 'signature' }]
  },
  {
    id: 'reuso', eyebrow: 'Arquitetura e Limpeza', label: 'Lab de Reutilização',
    title: 'Delegando chamadas menores para evitar duplicação', duration: '5 min',
    blocks: [{ type: 'lead', text: 'Compare a duplicação inútil de lógica contra o encapsulamento em métodos centrais:' }, { type: 'reuso' }]
  },
  {
    id: 'ambiguity', eyebrow: 'Compilação Avançada', label: 'Ambiguidade e Promoção',
    title: 'Conversões automáticas e colisões lógicas de referências', duration: '6 min',
    blocks: [{ type: 'lead', text: 'Analise o comportamento do compilador diante de tipos promovidos ou ambiguidades com null:' }, { type: 'ambiguity' }]
  },
  {
    id: 'dominios', eyebrow: 'Arquitetura Aplicada', label: 'Galeria de Domínios',
    title: '7 cenários práticos de sobrecarga corporativa', duration: '7 min',
    blocks: [{ type: 'lead', text: 'Navegue pelos domínios e veja como o overload simplifica a usabilidade do código no main:' }, { type: 'domains' }]
  },
  {
    id: 'clinica', eyebrow: 'Depuração', label: 'Clínica de Erros',
    title: 'Estudo e correção das 10 falhas comuns na sobrecarga', duration: '8 min',
    blocks: [{ type: 'lead', text: 'Examine os sintomas no console causados por má gerência de overload de métodos:' }, { type: 'errors' }]
  },
  {
    id: 'entrega', eyebrow: 'Prática no Terminal', label: 'Entrega & Desafio',
    title: 'Compilação dos 21 laboratórios e desafio CalculadoraCustoServico', duration: '10 min',
    blocks: [{ type: 'lead', text: 'Siga o roteiro de PowerShell para entregar a atividade limpa no repositório:' }, { type: 'delivery' }]
  }
];

// ── Componente Principal ─────────────────────────────
export default function GuidedOverloadLesson056({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
    <article className="guided-git-lesson guided-overload-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Play size={17} /> Métodos</span>
          <p className="guided-sequence">056 · M1.36</p>
          <h1>Sobrecarga de Métodos Inicial</h1>
          <p>Aprenda a estruturar múltiplos métodos com o mesmo nome em Java. Compreenda a assinatura de métodos (nome + parâmetros), entenda as regras do overload (quantidade, tipo e ordem), delegue execuções e evite ambiguidades lógicas com null.</p>
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

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula 056" items={[
        { value: 'Mesmo Nome', label: 'Overload' },
        { value: 'Delegação', label: 'Reuso inteligente' },
        { value: 'Ambiguidade', label: 'Alerta com null' }
      ]} />

      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 056">
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
                <h3>Sobrecarga de Métodos consolidada!</h3>
                <p>{lessonComplete ? 'Assinaturas limpas, delegações estruturadas e controle de colisão dominados.' : 'Conclua a aula para registrar seu progresso no cronograma.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 055</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Sobrecarga de métodos dominada' : allStepsComplete ? 'Use o botão acima' : 'Pratique assinaturas, reutilização limpa, promoção e ambiguidade'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Próxima Aula'}>
          Aula 057 <ArrowRight size={17} />
        </button>
      </footer>
    </article>
  );
}
