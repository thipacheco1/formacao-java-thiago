import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2,
  ChevronRight, Clock3, Copy, FileCode2,
  Lightbulb, ListChecks, Play, RotateCcw, Search,
  Sparkles, Terminal, Variable, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedIncrementDecrementLesson.css';

const STORAGE_KEY = 'guided-increment-decrement-lesson-034-progress';

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'Main Abreviado', file: 'IncrementoBasico.java',
    code: 'public class IncrementoBasico {\n    public static void main(String[] args) {\n        int contador = 0;\n\n        contador++;\n        contador++;\n        contador--;\n\n        System.out.println("Contador final: " + contador);\n    }\n}',
    output: 'Contador final: 1',
    insight: 'Incremento (++) e decremento (--) alteram a variável original em 1 unidade de forma implícita.'
  },
  {
    id: 1, label: 'Acumulador BigDecimal', file: 'AcumuladorPagamento.java',
    code: 'import java.math.BigDecimal;\n\npublic class AcumuladorPagamento {\n    public static void main(String[] args) {\n        BigDecimal totalPago = BigDecimal.ZERO;\n\n        totalPago = totalPago.add(new BigDecimal("100.00"));\n        totalPago = totalPago.add(new BigDecimal("50.00"));\n        totalPago = totalPago.add(new BigDecimal("25.50"));\n\n        System.out.println("Total pago: " + totalPago);\n    }\n}',
    output: 'Total pago: 175.50',
    insight: 'Como BigDecimal é imutável, o método .add() não altera o objeto original. Você precisa reatribuir o retorno.'
  },
  {
    id: 2, label: 'Contagem Pedidos', file: 'ContagemPedidos.java',
    code: 'public class ContagemPedidos {\n    public static void main(String[] args) {\n        boolean pedido1Aprovado = true;\n        boolean pedido2Aprovado = false;\n        boolean pedido3Aprovado = true;\n\n        int aprovados = 0;\n        int recusados = 0;\n\n        if (pedido1Aprovado) {\n            aprovados++;\n        } else {\n            recusados++;\n        }\n\n        if (pedido2Aprovado) {\n            aprovados++;\n        } else {\n            recusados++;\n        }\n\n        if (pedido3Aprovado) {\n            aprovados++;\n        } else {\n            recusados++;\n        }\n\n        System.out.println("Aprovados: " + aprovados);\n        System.out.println("Recusados: " + recusados);\n    }\n}',
    output: 'Aprovados: 2\nRecusados: 1',
    insight: 'A contagem utiliza incrementadores simples controlados por desvios if/else.'
  },
  {
    id: 3, label: 'Controle de Estoque', file: 'ControleEstoque.java',
    code: 'public class ControleEstoque {\n    public static void main(String[] args) {\n        int estoque = 10;\n        int entrada = 5;\n        int saida = 3;\n\n        estoque += entrada;\n        estoque -= saida;\n\n        System.out.println("Estoque final: " + estoque);\n    }\n}',
    output: 'Estoque final: 12',
    insight: 'Os operadores compostos += e -= acumulam ou subtraem valores variáveis sem a necessidade de repetir o nome da variável.'
  }
];

const ERRORS = [
  { title: 'Esquecer de inicializar local', code: 'int total;\ntotal++;', symptom: 'Erro de compilação: variable total might not have been initialized', cause: 'Variáveis locais declaradas em métodos do Java não recebem valor padrão (0/null) de forma implícita.', fix: 'Inicialize a variável explicitamente no momento da declaração: int total = 0;' },
  { title: 'Confundir contador com acumulador', code: 'int total = 0;\ntotal++; // Tentando somar um preço de R$ 10.00', symptom: 'O total aumenta em 1 em vez de acumular o preço correto', cause: 'Usar o operador de unidade ++ para acúmulos financeiros.', fix: 'Utilize o operador de atribuição composto: total += preco;' },
  { title: 'Chamar add sem reatribuir', code: 'BigDecimal total = BigDecimal.ZERO;\ntotal.add(new BigDecimal("10.00"));', symptom: 'O valor da variável total continua sendo 0', cause: 'O tipo BigDecimal é imutável. Métodos geram um novo objeto de retorno e não modificam o valor interno.', fix: 'Reatribua o valor retornado à variável: total = total.add(new BigDecimal("10.00"));' },
  { title: 'Usar ++ em BigDecimal', code: 'BigDecimal total = BigDecimal.ZERO;\ntotal++;', symptom: 'Erro de compilação: operator ++ cannot be applied to java.math.BigDecimal', cause: 'O operador aritmético de incremento ++ é exclusivo de tipos numéricos primitivos do Java.', fix: 'Use a soma explícita: total = total.add(BigDecimal.ONE);' },
  { title: 'Incremento complexo em expressão', code: 'int res = x++ + ++x;', symptom: 'Código confuso e dependente de comportamentos de precedência implícitos', cause: 'Misturar pré e pós-incremento em uma mesma linha de processamento.', fix: 'Separe as operações em linhas claras e sequenciais.' },
  { title: 'Decremento negativo sem controle', code: 'tentativasRestantes--; // Sem verificar se já é zero', symptom: 'A quantidade de tentativas atinge valores negativos (-1, -2)', cause: 'Subtrair o contador de forma contínua sem cercar o limite mínimo operacional.', fix: 'Adicione uma verificação condicional para assegurar que a decrementação pare em 0.' }
];

const EVIDENCE = [
  '# Aula 034 — Incremento, Decremento e Acumuladores', '',
  '## Aritmética de Fluxo', '- [ ] Entendi a diferença de Contadores (volume) e Acumuladores (valores)', '- [ ] Usei os operadores abreviados += e -= para totalizações rápidas', '- [ ] Identifiquei o perigo de decrementos negativos em contadores de tentativas', '',
  '## Pré vs Pós Incremento', '- [ ] Compreendi a ordem de avaliação de x++ e ++x', '- [ ] Evitei misturar operadores de incremento em expressões complexas', '',
  '## BigDecimal e Imutabilidade', '- [ ] Guardei o retorno de .add() em variáveis reatribuídas', '- [ ] Entendi por que BigDecimal não aceita o operador ++', '',
  '## Evidências locais', '- [ ] Criei, compilei e executei as 10 classes locais', '- [ ] Garanti a ausência de arquivos binários compilados .class no Git', '',
  '## Decisão de Projeto', '- Transações sucessivas e acúmulos lógicos feitos no desafio final:', '- Por que BigDecimal exige atribuição no retorno de operações matemáticas:'
].join('\n');

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="inc34-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file inc34-code">
      <div className="guided-file-title">
        <FileCode2 size={17} /> {name}
        <CopyButton value={code} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={lines}
        wrapLongLines
        customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function CpuStepLab() {
  const [mode, setMode] = useState('pos'); // 'pos', 'pre'
  const [step, setStep] = useState(0);
  const [x, setX] = useState(5);
  const [y, setY] = useState(0);

  const reset = () => {
    setStep(0);
    setX(5);
    setY(0);
  };

  const nextStep = () => {
    if (mode === 'pos') {
      if (step === 0) {
        setY(5);
        setStep(1);
      } else if (step === 1) {
        setX(6);
        setStep(2);
      }
    } else {
      if (step === 0) {
        setX(6);
        setStep(1);
      } else if (step === 1) {
        setY(6);
        setStep(2);
      }
    }
  };

  return <section className="inc34-cpu-sim">
    <div className="inc34-cpu-flow">
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          type="button"
          onClick={() => { setMode('pos'); reset(); }}
          style={{
            flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.68rem', fontWeight: 'bold',
            background: mode === 'pos' ? 'var(--inc34-emerald)' : '#fff', color: mode === 'pos' ? '#fff' : '#475569', cursor: 'pointer'
          }}
        >
          Pós-incremento: y = x++;
        </button>
        <button
          type="button"
          onClick={() => { setMode('pre'); reset(); }}
          style={{
            flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.68rem', fontWeight: 'bold',
            background: mode === 'pre' ? 'var(--inc34-emerald)' : '#fff', color: mode === 'pre' ? '#fff' : '#475569', cursor: 'pointer'
          }}
        >
          Pré-incremento: y = ++x;
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
        <button type="button" className="inc34-cpu-step-btn" onClick={nextStep} disabled={step >= 2} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Play size={13} /> Avançar Passo
        </button>
        <button type="button" className="inc34-cpu-step-btn" onClick={reset} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <RotateCcw size={13} /> Reiniciar
        </button>
      </div>

      <div style={{ marginTop: '6px', fontSize: '.72rem', color: '#475569' }}>
        {mode === 'pos' ? (
          <>
            {step === 0 && <span>Passo 1: A CPU vai ler o valor de <code>x</code> (5) para atribuir a <code>y</code>.</span>}
            {step === 1 && <span>Passo 2: Valor 5 atribuído a <code>y</code>. Agora, a CPU incrementará <code>x</code>.</span>}
            {step === 2 && <span>Final: <code>x</code> foi para 6, mas <code>y</code> reteve o valor original de 5.</span>}
          </>
        ) : (
          <>
            {step === 0 && <span>Passo 1: no pré-incremento, <code>x</code> muda de 5 para 6 antes de fornecer o valor à atribuição.</span>}
            {step === 1 && <span>Passo 2: <code>x</code> incrementado. Agora a CPU copia o novo valor para <code>y</code>.</span>}
            {step === 2 && <span>Final: Ambos <code>x</code> e <code>y</code> receberam o valor final de 6.</span>}
          </>
        )}
      </div>
    </div>

    <div className="inc34-cpu-register-box">
      <span style={{ fontSize: '.58rem', color: '#047857', textTransform: 'uppercase', fontWeight: 'bold' }}>Estado das variáveis:</span>
      <div>
        <span>Variável <code>x</code> (int):</span>
        <code style={{ float: 'right', fontSize: '.9rem' }}>{x}</code>
      </div>
      <div style={{ borderTop: '1px solid #a7f3d0', paddingTop: '6px', marginTop: '2px' }}>
        <span>Variável <code>y</code> (int):</span>
        <code style={{ float: 'right', fontSize: '.9rem' }}>{step === 0 ? '?' : y}</code>
      </div>
      <div style={{ borderTop: '1px dashed #a7f3d0', paddingTop: '6px', marginTop: '2px', display: 'flex', justifyContent: 'between', fontSize: '.62rem', color: '#047857' }}>
        <span>Instrução atual:</span>
        <strong style={{ marginLeft: 'auto', fontFamily: 'Consolas, monospace' }}>
          {mode === 'pos' ? (step === 0 ? 'Lendo x' : step === 1 ? 'Somando x' : 'Fim') : (step === 0 ? 'Somando x' : step === 1 ? 'Gravando y' : 'Fim')}
        </strong>
      </div>
    </div>
  </section>;
}

function EsteiraRegistradoraLab() {
  const [itens, setItens] = useState(0);
  const [faturamento, setFaturamento] = useState(0.0);
  const [belt, setBelt] = useState([]);
  const [assignError, setAssignError] = useState(false);

  const addItem = (name, price) => {
    setBelt(prev => [...prev, name].slice(-4));
    setItens(prev => prev + 1);
    if (assignError) {
      // Simula o erro: executa a operação, mas não altera o estado real da variável
      // totalPago.add(preço) sem reatribuição. O faturamento não aumenta!
    } else {
      setFaturamento(prev => Number((prev + price).toFixed(2)));
    }
  };

  const clear = () => {
    setItens(0);
    setFaturamento(0.0);
    setBelt([]);
  };

  return <section className="inc34-esteira-container">
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '.62rem', color: '#475569', fontWeight: 'bold', textTransform: 'uppercase' }}>Clique para passar um item na esteira:</span>
      <button type="button" onClick={clear} style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '.65rem', background: '#fff', cursor: 'pointer' }}>Limpar Caixa</button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
      <button type="button" onClick={() => addItem('Café', 15.20)} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', background: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>☕ Café (R$ 15,20)</button>
      <button type="button" onClick={() => addItem('Pão', 3.00)} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', background: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>🍞 Pão (R$ 3,00)</button>
      <button type="button" onClick={() => addItem('Leite', 5.50)} style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', background: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>🥛 Leite (R$ 5,50)</button>
    </div>

    <div className="inc34-esteira-belt">
      {belt.length === 0 ? (
        <span style={{ color: '#94a3b8', fontSize: '.7rem', width: '100%', textAlign: 'center' }}>Esteira vazia. Passe algum produto.</span>
      ) : (
        belt.map((item, idx) => (
          <div key={idx} className="inc34-esteira-item">{item}</div>
        ))
      )}
    </div>

    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => setAssignError(!assignError)}
        style={{ padding: '6px 10px', background: assignError ? '#ef4444' : '#fff', color: assignError ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '.65rem', fontWeight: 'bold', cursor: 'pointer' }}
      >
        {assignError ? 'Erro Ativado: add() sem atribuir' : 'Ativar erro de Imutabilidade'}
      </button>
      <span style={{ fontSize: '.62rem', color: '#64748b' }}>
        {assignError ? 'O acumulador BigDecimal ignorará os preços porque não há reatribuição.' : 'O faturamento acumula normalmente.'}
      </span>
    </div>

    <div className="inc34-totalizer-box">
      <div className="inc34-totalizer-card">
        <h4>Contador de Itens (int ++)</h4>
        <div className="val">{itens} itens</div>
      </div>
      <div className="inc34-totalizer-card" style={{ background: assignError ? '#fef2f2' : '#fff', borderColor: assignError ? '#fee2e2' : '#cbd5e1' }}>
        <h4>Acumulador Total (BigDecimal)</h4>
        <div className="val" style={{ color: assignError ? '#be123c' : '#0f172a' }}>R$ {faturamento.toFixed(2)}</div>
      </div>
    </div>
  </section>;
}

function AbbrevOperatorsLab() {
  const [val, setVal] = useState(10);

  return <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
      <span style={{ fontSize: '.75rem', color: '#475569' }}>Valor atual da variável local:</span>
      <code style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'Consolas, monospace', color: 'var(--inc34-emerald)' }}>{val}</code>
    </div>
    <div className="inc34-abbrev-grid">
      <button type="button" className="inc34-abbrev-btn" onClick={() => setVal(prev => prev + 1)}>+= 1</button>
      <button type="button" className="inc34-abbrev-btn" onClick={() => setVal(prev => prev - 1)}>-= 1</button>
      <button type="button" className="inc34-abbrev-btn" onClick={() => setVal(prev => prev + 5)}>+= 5</button>
      <button type="button" className="inc34-abbrev-btn" onClick={() => setVal(prev => prev - 5)}>-= 5</button>
    </div>
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="inc34-domains-gallery">
    <div className="inc34-domains-sidebar">
      {DOMAIN_PROGRAMS.map((entry, index) => (
        <button key={entry.id} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          {entry.label}
        </button>
      ))}
    </div>
    <div className="calc31-domains-content">
      <CodePanel name={item.file} code={item.code} />
      <section className="calc31-console">
        <header><Terminal size={15} /> Console de simulação de execução</header>
        <pre>{item.output}</pre>
        <p style={{ display: 'flex', gap: '8px', margin: '0', padding: '12px 14px', alignItems: 'flex-start', color: '#94a3b8', background: '#1e293b', borderTop: '1px solid #334155', fontSize: '.72rem', lineHeight: 1.5 }}>
          <Sparkles size={16} style={{ color: 'var(--inc34-emerald)', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="inc34-errors-clinic">
    <nav className="inc34-errors-nav">
      {ERRORS.map((entry, index) => (
        <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="inc34-error-card">
      <header>
        <AlertTriangle size={20} />
        <div>
          <small>Caso {selected + 1} de {ERRORS.length}</small>
          <h3>{item.title}</h3>
        </div>
      </header>
      <CodePanel name="Código Incorreto" code={item.code} />
      <section style={{ margin: '12px 0' }}>
        <small style={{ display: 'block', marginBottom: '4px', fontSize: '.65rem', color: '#475569', fontWeight: 'bold' }}>Sintoma ou Mensagem</small>
        <code>{item.symptom}</code>
      </section>
      <div className="inc34-error-flow">
        <span>
          <Search size={16} />
          <div>
            <strong>Causa</strong>
            <p>{item.cause}</p>
          </div>
        </span>
        <ChevronRight size={18} />
        <span>
          <Wrench size={16} />
          <div>
            <strong>Correção</strong>
            <p>{item.fix}</p>
          </div>
        </span>
      </div>
    </div>
  </section>;
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Estruturar Diretório',
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-034-incremento-decremento-acumuladores\ncd labs\\m1\\aula-034-incremento-decremento-acumuladores\nNew-Item IncrementoBasico.java, PrePosIncremento.java, ContadorPedidos.java, AcumuladorItens.java, AcumuladorPagamento.java, ContagemPedidos.java, ControleEstoque.java, TentativasLogin.java, ContagemOs.java, ContagemAuditoria.java, ErroContadorSemInicializar.java, ErroBigDecimalSemAtribuir.java, ErroIncrementoComplexo.java, ErroDecrementoSemLimite.java',
      out: 'Quatorze arquivos Java criados na estrutura do repositório.',
      tip: 'Configure no seu IntelliJ os respectivos códigos de totalização.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac *.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Se atente a erros de compilação com BigDecimal e inicializações locais ausentes.'
    },
    {
      title: 'Executar Programas',
      cmd: 'java AcumuladorPagamento',
      out: 'Total pago: 175.50',
      tip: 'Monitore se o BigDecimal está acumulando de forma imutável e reatribuída.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-034-incremento-decremento-acumuladores docs/diario-de-bordo.md\ngit commit -m "Aula 034: pratica incremento decremento e acumuladores em Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Certifique-se de que os arquivos binários de bytecode compilados .class estão devidamente ignorados.'
    }
  ];

  const current = steps[stage];

  return <section className="inc34-terminal-flow">
    <div className="bool27-delivery-flow">
      <nav className="inc34-delivery-flow nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="inc34-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="inc34-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file inc34-code" style={{ marginTop: '14px' }}>
      <div className="guided-file-title">
        <BookOpenCheck size={16} /> docs/diario-de-bordo.md
        <CopyButton value={EVIDENCE} label="Copiar evidências" />
      </div>
      <SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>
        {EVIDENCE}
      </SyntaxHighlighter>
    </div>
  </section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'cpu_steps') return <CpuStepLab />;
  if (block.type === 'esteira_vendas') return <EsteiraRegistradoraLab />;
  if (block.type === 'abbrev_ops') return <AbbrevOperatorsLab />;
  if (block.type === 'domains_gallery') return <DomainsGalleryLab />;
  if (block.type === 'errors_clinic') return <ErrorsClinicLab />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}>
      <Icon size={21} />
      <div>
        <strong>{block.title}</strong>
        <p>{block.text}</p>
      </div>
    </aside>;
  }
  if (block.type === 'challenge') {
    return <section className="guided-challenge">
      <div className="guided-challenge-title">
        <Sparkles size={22} />
        <h3>{block.title}</h3>
      </div>
      <p>{block.text}</p>
      <h4>Critérios de aceite</h4>
      <ul>
        {block.acceptance.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </section>;
  }
  return null;
}

const steps = [
  {
    id: 'cpu',
    eyebrow: 'Ordem de avaliação',
    label: 'Pré vs Pós',
    title: 'Análise de ciclo de instrução do incremento',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Avance passo a passo e observe quando o incremento acontece em relação ao valor entregue à expressão:' },
      { type: 'cpu_steps' }
    ]
  },
  {
    id: 'esteira',
    eyebrow: 'Contadores vs Acumuladores',
    label: 'Esteira Registradora',
    title: 'Acumulando quantidades e faturamento',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Adicione itens na esteira para contar volumes de produtos e acumular o preço financeiro. Ative o erro de imutabilidade para testar BigDecimal sem atribuição:' },
      { type: 'esteira_vendas' }
    ]
  },
  {
    id: 'abreviados',
    eyebrow: 'Aritmética Compacta',
    label: 'Operações Abreviadas',
    title: 'Somas e subtrações compostas no estado local',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'Utilize os operadores compactos += e -= e observe a evolução do valor local sem depender de detalhes de alocação da JVM:' },
      { type: 'abbrev_ops' }
    ]
  },
  {
    id: 'exemplos',
    eyebrow: 'Aplicações',
    label: 'Casos Corporativos',
    title: 'Loteamento, tentativas de login e OS atrasadas',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Estude as aplicações do mundo real contendo auditorias de ações, prazos vencidos com LocalDate e bloqueios de tentativas de login:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Depurando falhas de inicialização e mutabilidade',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Depure as 6 falhas clássicas de contagem de eventos, objetos imutáveis soltos e decrementações sem limite do Java:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega',
    label: 'Entrega do Lab',
    title: 'Compilações em lote e Git limpo',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Abra seu console, monte a pasta, compile as 10 classes Java da aula e execute o commit limpo:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio Prático de Transferência: Gerenciador de Vendas de Bilheteria',
        text: 'Crie o arquivo BilheteriaVendas.java em labs/m1/aula-034-incremento-decremento-acumuladores/. Configure o Locale padrão americano. Declare as variáveis locais no escopo do main: totalIngressosVendidos (int inicializado com 0), faturamentoTotal (BigDecimal inicializado com BigDecimal.ZERO), quantidadeVendasConfirmadas (int inicializada com 0). Simule e pergunte através do Scanner a leitura sequencial de 3 transações de vendas contendo: valor do ingresso (double) e quantidade comprada nessa venda (int). Acumule a quantidade total comprada no totalIngressosVendidos (utilizando +=), multiplique a quantidade pelo valor unitário convertendo para BigDecimal e acumule com faturamentoTotal (utilizando reatribuição .add()), e incremente quantidadeVendasConfirmadas (utilizando ++). Imprima o relatório detalhado de auditoria final.',
        acceptance: [
          'Instanciação e uso de Scanner associado a System.in com Locale padrão Locale.US.',
          'Inicialização explícita de todas as variáveis contadoras e acumuladoras locais.',
          'Uso correto de += para acumular quantidades primitivas int.',
          'Uso obrigatório de reatribuição (total = total.add(...)) no acumulador BigDecimal.',
          'Uso correto de ++ para contar transações confirmadas.',
          'Compilação, execução e commit limpo de 14 arquivos no Git sem cometer arquivos binários .class.'
        ]
      }
    ]
  }
];

export default function GuidedIncrementDecrementLesson034({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds]));
  }, [completedStepIds]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const completedLabel = `${completedStepIds.size} de ${steps.length} etapas concluídas`;

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
      if (next.has(activeStep.id)) {
        next.delete(activeStep.id);
      } else {
        next.add(activeStep.id);
      }
      return next;
    });
  };

  return <article className="guided-git-lesson guided-increment-decrement-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Máquina Registradora</span>
        <p className="guided-sequence">034 · M1.14</p>
        <h1>Incremento, Decremento e Acumuladores</h1>
        <p>Aprenda a controlar fluxos contínuos e faturamento no Java. Domine o pré e pós-incremento na CPU, diferencie contadores de acumuladores e manipule BigDecimal de forma imutável e segura.</p>
      </div>
      <div className="guided-hero-status">
        <Sparkles size={42} />
        <strong>{progress}%</strong>
        <span>{completedLabel}</span>
      </div>
      <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
    </header>

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'contadores', label: 'incremento ++/--' }, { value: 'acumuladores', label: 'totalizações +=/-=' }, { value: 'BigDecimal', label: 'imutável com add()' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 034">
        <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
        {steps.map((step, index) => (
          <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}>
            <span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span>
            <span>
              <strong>{step.label}</strong>
              <small>{step.duration}</small>
            </span>
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
          <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button>
          <div className="guided-step-actions-main">
            <button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>
              {activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}
            </button>
            {activeIndex < steps.length - 1 && (
              <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>
            )}
          </div>
        </div>

        {allStepsComplete && (
          <section className="guided-finish">
            <CheckCircle2 size={30} />
            <div>
              <h3>Contadores e Acumuladores lógicos dominados!</h3>
              <p>{lessonComplete ? 'Etapas, evidências e conclusão registradas no repositório.' : 'Conclua a aula para consolidar seus conhecimentos e liberar a próxima etapa.'}</p>
            </div>
            <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
              {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
            </button>
          </section>
        )}
      </main>
    </div>

    <footer className="guided-course-nav">
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 033</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Controle de totais e contagens consolidado' : allStepsComplete ? 'Use o botão acima' : 'Pratique pré/pós incremento e BigDecimal'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir Condicionais If-Else'}>Aula 035 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
