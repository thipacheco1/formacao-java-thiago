import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2,
  ChevronRight, Clock3, Copy, FileCode2,
  Lightbulb, ListChecks, RotateCcw, Search,
  Sparkles, Terminal, Variable, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedArithmeticOperatorsLesson.css';

const STORAGE_KEY = 'guided-arithmetic-operators-lesson-031-progress';

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'Main Aritmético', file: 'Main.java',
    code: 'public class Main {\n    public static void main(String[] args) {\n        int valorA = 10;\n        int valorB = 3;\n\n        int soma = valorA + valorB;\n        int subtracao = valorA - valorB;\n        int multiplicacao = valorA * valorB;\n        int divisao = valorA / valorB;\n        int resto = valorA % valorB;\n\n        System.out.println("Soma: " + soma);\n        System.out.println("Subtração: " + subtracao);\n        System.out.println("Multiplicação: " + multiplicacao);\n        System.out.println("Divisão: " + divisao);\n        System.out.println("Resto: " + resto);\n    }\n}',
    output: 'Soma: 13\nSubtração: 7\nMultiplicação: 30\nDivisão: 3\nResto: 1',
    insight: 'A divisão de valorA (10) por valorB (3) resulta em 3 porque ambos os operandos são inteiros; a parte fracionária é descartada em direção a zero.'
  },
  {
    id: 1, label: 'Divisão Decimal', file: 'DivisaoDecimal.java',
    code: 'public class DivisaoDecimal {\n    public static void main(String[] args) {\n        int valorA = 10;\n        int valorB = 3;\n\n        double divisaoInteiraGuardadaEmDouble = valorA / valorB;\n        double divisaoDecimal = (double) valorA / valorB;\n\n        System.out.println("Guardada em double: " + divisaoInteiraGuardadaEmDouble);\n        System.out.println("Divisão decimal: " + divisaoDecimal);\n    }\n}',
    output: 'Guardada em double: 3.0\nDivisão decimal: 3.3333333333333335',
    insight: 'Guardar uma divisão inteira em double resulta em .0 porque a perda de precisão ocorre na operação antes da atribuição.'
  },
  {
    id: 2, label: 'Cálculo de Lote', file: 'CalculoLote.java',
    code: 'public class CalculoLote {\n    public static void main(String[] args) {\n        int totalItens = 23;\n        int tamanhoLote = 10;\n\n        int lotesCompletos = totalItens / tamanhoLote;\n        int itensRestantes = totalItens % tamanhoLote;\n\n        System.out.println("Lotes completos: " + lotesCompletos);\n        System.out.println("Itens restantes: " + itensRestantes);\n    }\n}',
    output: 'Lotes completos: 2\nItens restantes: 3',
    insight: 'Combinação clássica de divisão inteira e resto (%) para agrupar e fracionar lotes de mercadorias no estoque.'
  },
  {
    id: 3, label: 'Percentual Conclusão', file: 'PercentualConclusao.java',
    code: 'public class PercentualConclusao {\n    public static void main(String[] args) {\n        int atividadesConcluidas = 7;\n        int totalAtividades = 10;\n\n        double percentualConclusao = ((double) atividadesConcluidas / totalAtividades) * 100;\n\n        System.out.println("Percentual: " + percentualConclusao + "%");\n    }\n}',
    output: 'Percentual: 70.0%',
    insight: 'O cast explicitado (double) converte temporariamente o valor de atividades antes de realizar a divisão por totalAtividades.'
  }
];

const ERRORS = [
  { title: 'Divisão inteira sem decimal', code: 'double resultado = 10 / 4;', symptom: 'O valor impresso é 2.0 em vez de 2.5', cause: 'O Java calcula 10 / 4 como divisão inteira, descarta o resto (gerando 2) e depois atribui 2.0 ao double.', fix: 'Converta pelo menos um dos valores para decimal (ex: 10.0 / 4 ou (double) 10 / 4).' },
  { title: 'Esquecer Precedência', code: 'int total = 10 + 5 * 2;', symptom: 'O resultado obtido é 20 em vez de 30', cause: 'Java segue precedência padrão e executa a multiplicação (5 * 2 = 10) antes da soma (10 + 10 = 20).', fix: 'Force a ordem desejada envolvendo os operandos com parênteses: (10 + 5) * 2;' },
  { title: 'Concatenação Acidental', code: 'System.out.println("Soma: " + 10 + 20);', symptom: 'Imprime no console: "Soma: 1020"', cause: 'O operador + lê da esquerda para a direita. Ao ler a string, ele concatena o 10 e depois concatena o 20.', fix: 'Envolva a operação numérica em parênteses: System.out.println("Soma: " + (10 + 20));' },
  { title: 'Divisão por Zero', code: 'int resultado = 10 / 0;', symptom: 'java.lang.ArithmeticException: / by zero', cause: 'Divisores de valor 0 são estritamente proibidos em aritmética de inteiros na JVM.', fix: 'Valide se o divisor é diferente de zero antes da operação (ex: if (divisor != 0) { ... }).' },
  { title: 'Confundir % com percentual', code: 'double taxa = 200 % 10;', symptom: 'Retorna 0.0 em vez de calcular 10 por cento de 200', cause: 'O operador % em Java significa resto da divisão de inteiros, não cálculo percentual.', fix: 'Calcule o percentual multiplicando e dividindo por 100: 200 * 10 / 100;' },
  { title: 'Imprecisão Monetária com double', code: 'double total = 0.1 + 0.2;', symptom: 'Imprime 0.30000000000000004 no console', cause: 'O formato binário IEEE 754 não representa exatamente várias frações decimais, independentemente da região de memória usada pela JVM.', fix: 'Trabalhe com centavos usando long quando o contrato permitir ou use BigDecimal com escala e arredondamento explícitos.' },
  { title: 'Overflow Silencioso', code: 'int resultado = 2_000_000_000 + 2_000_000_000;', symptom: 'Imprime um valor negativo (-294967296) incorreto', cause: 'A soma dos valores excede o limite máximo permitido pelo tipo int (2.147.483.647).', fix: 'Declare os valores e a variável receptora como tipo long com o literal L (ex: 2_000_000_000L).' },
  { title: 'Expressões sem clareza', code: 'int total = q * v - d + f + t - b;', symptom: 'Dificuldade de manutenção e bugs invisíveis de precedência', cause: 'Juntar muitas operações e operadores em uma linha única sem segmentação explicativa.', fix: 'Utilize variáveis intermediárias como subtotal e totalComFrete para nomear cada parte do cálculo.' },
  { title: 'Resto de negativo', code: 'int resto = -10 % 3;', symptom: 'Imprime -1 em vez de 1', cause: 'No Java, o operador resto (%) preserva o sinal do dividendo da operação.', fix: 'Utilize Math.abs() ou lógica condicional caso necessite de resto sempre positivo.' },
  { title: 'Cast no lugar errado', code: 'double d = (double) (10 / 4);', symptom: 'Retorna 2.0 em vez de 2.5', cause: 'O cast está sendo aplicado ao resultado da divisão inteira que já perdeu a precisão.', fix: 'Coloque o cast direto no dividendo: (double) 10 / 4;' }
];

const EVIDENCE = [
  '# Aula 031 — Operadores Aritméticos', '',
  '## Operações e Tipos', '- [ ] Entendi o comportamento dos operadores básicos (+, -, *, /)', '- [ ] Compreendi a perda de precisão na divisão inteira (int / int)', '- [ ] Utilizei o cast (double) para converter inteiros para decimais', '',
  '## Operador de Resto (%)', '- [ ] Apliquei o resto (%) para verificar par ou ímpar', '- [ ] Usei o resto (%) para organizar lotes de estoque', '',
  '## Precedência e Parênteses', '- [ ] Montei expressões respeitando a precedência implícita de operadores', '- [ ] Utilizei parênteses () para modificar a ordem de execução', '- [ ] Preveni a concatenação acidental de strings com números', '',
  '## Segurança e Boas Práticas', '- [ ] Vivenciei e tratei o erro ArithmeticException de divisão por zero', '- [ ] Identifiquei e resolvi overflow usando o tipo long', '- [ ] Compreendi a imprecisão do double para valores monetários reais', '',
  '## Evidências locais', '- [ ] Criei, compilei e testei as 10 classes locais', '- [ ] Mantive o histórico de Git limpo sem arquivos .class binários', '',
  '## Decisão de Projeto', '- Como a divisão inteira ajuda a calcular paginações de bancos de dados:', '- Por que trabalhar com centavos inteiros (long) protege cálculos financeiros:'
].join('\n');

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="calc31-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file calc31-code">
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

function BasicOpsLab() {
  const [valA, setValA] = useState(10);
  const [valB, setValB] = useState(3);

  const soma = valA + valB;
  const sub = valA - valB;
  const mult = valA * valB;

  let div = 'ArithmeticException';
  let resto = 'ArithmeticException';

  if (valB !== 0) {
    div = String(Math.floor(valA / valB));
    resto = String(valA % valB);
  }

  return <section className="calc31-ops-calculator">
    <div className="calc31-inputs-panel">
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '.65rem', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Valor A (int):</label>
          <input
            type="number"
            value={valA}
            onChange={e => setValA(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontFamily: 'Consolas, monospace' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '.65rem', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Valor B (int):</label>
          <input
            type="number"
            value={valB}
            onChange={e => setValB(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontFamily: 'Consolas, monospace' }}
          />
        </div>
      </div>

      <div className="calc31-results-grid">
        <div className="calc31-result-card">
          <label>Soma (+)</label>
          <span>{soma}</span>
        </div>
        <div className="calc31-result-card">
          <label>Subtração (-)</label>
          <span>{sub}</span>
        </div>
        <div className="calc31-result-card">
          <label>Multiplicação (*)</label>
          <span>{mult}</span>
        </div>
        <div className="calc31-result-card" style={{ borderLeft: valB === 0 ? '3px solid #ef4444' : '1px solid #e2e8f0' }}>
          <label>Divisão Inteira (/)</label>
          <span style={{ color: valB === 0 ? '#be123c' : '#0f172a' }}>{div}</span>
        </div>
        <div className="calc31-result-card" style={{ gridColumn: 'span 2', borderLeft: valB === 0 ? '3px solid #ef4444' : '1px solid #e2e8f0' }}>
          <label>Resto (%)</label>
          <span style={{ color: valB === 0 ? '#be123c' : '#0f172a' }}>{resto}</span>
        </div>
      </div>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px', background: '#fff', borderColor: '#cbd5e1' }}>
        <Terminal size={22} style={{ color: 'var(--calc31-cyan)' }} />
        <div>
          <strong>Divisor Zero</strong>
          <p style={{ fontSize: '.65rem', lineHeight: 1.45, color: '#475569', margin: '2px 0 0' }}>
            Experimente definir o <b>Valor B</b> como <code>0</code>. O Java impede a conclusão da divisão e do resto arremessando a exceção <code>ArithmeticException</code> de forma imediata na Thread ativa.
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function DivSplitLab() {
  const [mode, setMode] = useState('inteira'); // 'inteira', 'guardada', 'decimal'

  return <section className="calc31-div-split">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          type="button"
          onClick={() => setMode('inteira')}
          style={{
            flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.65rem', fontWeight: 'bold',
            background: mode === 'inteira' ? 'var(--calc31-cyan)' : '#fff', color: mode === 'inteira' ? '#fff' : '#475569', cursor: 'pointer'
          }}
        >
          10 / 4 (Inteira)
        </button>
        <button
          type="button"
          onClick={() => setMode('guardada')}
          style={{
            flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.65rem', fontWeight: 'bold',
            background: mode === 'guardada' ? 'var(--calc31-cyan)' : '#fff', color: mode === 'guardada' ? '#fff' : '#475569', cursor: 'pointer'
          }}
        >
          double d = 10 / 4
        </button>
        <button
          type="button"
          onClick={() => setMode('decimal')}
          style={{
            flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.65rem', fontWeight: 'bold',
            background: mode === 'decimal' ? 'var(--calc31-cyan)' : '#fff', color: mode === 'decimal' ? '#fff' : '#475569', cursor: 'pointer'
          }}
        >
          10.0 / 4 (Decimal)
        </button>
      </div>

      <div className="calc31-water-container">
        <div className="calc31-glass">
          <div
            className="calc31-water"
            style={{
              height: mode === 'inteira' ? '60px' : mode === 'guardada' ? '60px' : '75px',
              background: mode === 'guardada' ? '#64748b' : '#06b6d4'
            }}
          />
          <div className="calc31-glass-label">
            {mode === 'inteira' ? '2' : mode === 'guardada' ? '2.0' : '2.5'}
          </div>
        </div>
        <div style={{ flex: 1, color: '#e2e8f0', fontSize: '.72rem', fontFamily: 'Consolas, monospace', lineHeight: 1.4 }}>
          {mode === 'inteira' && (
            <p><strong>Resultado: 2 (int)</strong><br />Como ambos os números são inteiros, o Java descarta toda a parte fracionária (.5). Não há arredondamento.</p>
          )}
          {mode === 'guardada' && (
            <p><strong>Resultado: 2.0 (double)</strong><br />Erro comum! A divisão ocorre como inteira (gera 2). Apenas depois o 2 é guardado em double como 2.0. A perda já ocorreu.</p>
          )}
          {mode === 'decimal' && (
            <p><strong>Resultado: 2.5 (double)</strong><br />Como 10.0 é um literal double, a operação é promovida a decimal, preservando a fração correta de 2.5.</p>
          )}
        </div>
      </div>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px', background: '#fff', borderColor: '#cbd5e1' }}>
        <Lightbulb size={22} style={{ color: 'var(--calc31-cyan)' }} />
        <div>
          <strong>Promoção de Tipos</strong>
          <p style={{ fontSize: '.65rem', lineHeight: 1.45, color: '#475569', margin: '2px 0 0' }}>
            No Java, quando operamos tipos diferentes, o menor é promovido: se dividirmos double por int, o resultado é promovido a double automaticamente.
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function LoteLab() {
  const [total, setTotal] = useState(23);
  const [tamanho, setTamanho] = useState(10);

  const lotes = tamanho > 0 ? Math.floor(total / tamanho) : 0;
  const restos = tamanho > 0 ? total % tamanho : 0;

  return <section className="calc31-lote-box">
    <div style={{ display: 'flex', gap: '12px' }}>
      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '.65rem', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Quantidade de itens total (totalItens):</label>
        <input
          type="number"
          value={total}
          onChange={e => setTotal(Math.max(0, Number(e.target.value)))}
          style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '.65rem', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Capacidade da Caixa (tamanhoLote):</label>
        <input
          type="number"
          value={tamanho}
          onChange={e => setTamanho(Math.max(1, Number(e.target.value)))}
          style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px' }}
        />
      </div>
    </div>

    <div className="calc31-grid-lote">
      <div className="calc31-container-visual">
        <span style={{ fontSize: '.62rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Visualização Física do Estoque:</span>
        <div className="calc31-caixas-wrap">
          {Array.from({ length: Math.min(12, lotes) }).map((_, i) => (
            <div key={i} className="calc31-caixa">
              <span className="title">Caixa {i + 1}</span>
              <span className="val">{tamanho} un</span>
            </div>
          ))}
          {lotes > 12 && (
            <div className="calc31-caixa" style={{ borderStyle: 'solid' }}>
              <span className="title">Outras caixas</span>
              <span className="val">+{lotes - 12}</span>
            </div>
          )}
        </div>
        {restos > 0 && (
          <div>
            <span style={{ fontSize: '.6rem', color: '#ef4444', fontWeight: 'bold', display: 'block', margin: '8px 0 2px' }}>Itens soltos fora das caixas (Resto):</span>
            <div className="calc31-sobras-wrap">
              {Array.from({ length: restos }).map((_, i) => (
                <span key={i} className="calc31-item-solto">
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
        <div style={{ padding: '10px', background: 'var(--calc31-cyan-soft)', border: '1px solid #cbd5e1', borderRadius: '10px' }}>
          <h5 style={{ margin: '0 0 4px', fontSize: '.7rem', color: 'var(--calc31-blue)' }}>Lotes Completos (Divisão "/")</h5>
          <code style={{ fontSize: '.8rem', fontWeight: 'bold', color: '#0f172a' }}>{total} / {tamanho} = {lotes}</code>
        </div>
        <div style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecdd3', borderRadius: '10px' }}>
          <h5 style={{ margin: '0 0 4px', fontSize: '.7rem', color: '#ef4444' }}>Itens Sobrados (Resto "%")</h5>
          <code style={{ fontSize: '.8rem', fontWeight: 'bold', color: '#0f172a' }}>{total} % {tamanho} = {restos}</code>
        </div>
      </div>
    </div>
  </section>;
}

function PrecedenciaLab() {
  const [expr, setExpr] = useState('sem-parenteses'); // 'sem-parenteses', 'com-parenteses', 'concatenacao', 'concatenacao-fix'

  return <section className="calc31-precedencia">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <button type="button" className={`scan30-domains-sidebar button ${expr === 'sem-parenteses' ? 'active' : ''}`} onClick={() => setExpr('sem-parenteses')} style={{ fontSize: '.64rem', padding: '8px' }}>10 + 5 * 2</button>
        <button type="button" className={`scan30-domains-sidebar button ${expr === 'com-parenteses' ? 'active' : ''}`} onClick={() => setExpr('com-parenteses')} style={{ fontSize: '.64rem', padding: '8px' }}>(10 + 5) * 2</button>
        <button type="button" className={`scan30-domains-sidebar button ${expr === 'concatenacao' ? 'active' : ''}`} onClick={() => setExpr('concatenacao')} style={{ fontSize: '.64rem', padding: '8px' }}>"Soma: " + 10 + 20</button>
        <button type="button" className={`scan30-domains-sidebar button ${expr === 'concatenacao-fix' ? 'active' : ''}`} onClick={() => setExpr('concatenacao-fix')} style={{ fontSize: '.64rem', padding: '8px' }}>"Soma: " + (10 + 20)</button>
      </div>

      <div className="calc31-tree-nodes">
        <span style={{ fontSize: '.62rem', color: '#94a3b8', textTransform: 'uppercase' }}>Ordem de Execução da JVM:</span>
        {expr === 'sem-parenteses' && (
          <>
            <div className="calc31-tree-line">1. Executa multiplicação: <code>5 * 2 = 10</code></div>
            <div className="calc31-tree-line">2. Executa soma: <code>10 + 10 = 20</code></div>
            <div className="calc31-tree-line eval">Resultado final avaliado: <strong>20</strong></div>
          </>
        )}
        {expr === 'com-parenteses' && (
          <>
            <div className="calc31-tree-line">1. Executa soma nos parênteses: <code>10 + 5 = 15</code></div>
            <div className="calc31-tree-line">2. Executa multiplicação: <code>15 * 2 = 30</code></div>
            <div className="calc31-tree-line eval">Resultado final avaliado: <strong>30</strong></div>
          </>
        )}
        {expr === 'concatenacao' && (
          <>
            <div className="calc31-tree-line">1. Avalia "Soma: " + 10: <code>"Soma: 10"</code></div>
            <div className="calc31-tree-line">2. Avalia "Soma: 10" + 20: <code>"Soma: 1020"</code></div>
            <div className="calc31-tree-line eval">Resultado final avaliado: <strong>"Soma: 1020"</strong></div>
          </>
        )}
        {expr === 'concatenacao-fix' && (
          <>
            <div className="calc31-tree-line">1. Executa soma nos parênteses: <code>10 + 20 = 30</code></div>
            <div className="calc31-tree-line">2. Concatena texto: <code>"Soma: " + 30 = "Soma: 30"</code></div>
            <div className="calc31-tree-line eval">Resultado final avaliado: <strong>"Soma: 30"</strong></div>
          </>
        )}
      </div>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px', background: '#fff', borderColor: '#cbd5e1' }}>
        <Lightbulb size={22} style={{ color: 'var(--calc31-cyan)' }} />
        <div>
          <strong>Direção da Leitura</strong>
          <p style={{ fontSize: '.65rem', lineHeight: 1.45, color: '#475569', margin: '2px 0 0' }}>
            Operações aritméticas de mesma precedência são resolvidas da esquerda para a direita. Ao misturar Strings, o Java interpreta o operador <code>+</code> como concatenação textual.
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="calc31-domains-gallery">
    <div className="calc31-domains-sidebar">
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
          <Sparkles size={16} style={{ color: 'var(--calc31-cyan)', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="calc31-errors-clinic">
    <nav className="calc31-errors-nav">
      {ERRORS.map((entry, index) => (
        <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="calc31-error-card">
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
      <div className="calc31-error-flow">
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
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-031-operadores-aritmeticos\ncd labs\\m1\\aula-031-operadores-aritmeticos\nNew-Item Main.java, DivisaoDecimal.java, PrecedenciaAritmetica.java, CalculoPedido.java, CalculoEstoque.java, CalculoPaginacao.java, CalculoLote.java, PercentualConclusao.java, CalculoPedidoConsole.java, CalculoLoteConsole.java',
      out: 'Dez arquivos Java criados na estrutura do repositório.',
      tip: 'Copie os respectivos códigos do IntelliJ e monte a lógica de negócios.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac *.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Verifique se não há divisões por zero declaradas de forma literal que quebrem a compilação.'
    },
    {
      title: 'Executar Programas',
      cmd: 'java DivisaoDecimal',
      out: 'Guardada em double: 3.0\nDivisão decimal: 3.3333333333333335',
      tip: 'Observe como o arredondamento na divisão decimal é representado com imprecisão física no final do double.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-031-operadores-aritmeticos docs/diario-de-bordo.md\ngit commit -m "Aula 031: pratica operadores aritmeticos em Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Evite a todo custo commitar arquivos binários compilados .class no histórico do Git.'
    }
  ];

  const current = steps[stage];

  return <section className="calc31-terminal-flow">
    <div className="bool27-delivery-flow">
      <nav className="calc31-delivery-flow nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="calc31-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="calc31-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file calc31-code" style={{ marginTop: '14px' }}>
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
  if (block.type === 'basic_ops') return <BasicOpsLab />;
  if (block.type === 'div_split') return <DivSplitLab />;
  if (block.type === 'lote') return <LoteLab />;
  if (block.type === 'precedencia') return <PrecedenciaLab />;
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
    id: 'operadores',
    eyebrow: 'Aritmética',
    label: 'Operadores Básicos',
    title: 'As cinco operações fundamentais',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'Insira números inteiros na máquina de calcular lógica e observe o comportamento em tempo real de soma, subtração, multiplicação, divisão e resto:' },
      { type: 'basic_ops' }
    ]
  },
  {
    id: 'divisao',
    eyebrow: 'Precisão',
    label: 'Divisão Inteira',
    title: 'Descarte de frações decimais',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Analise visualmente por que o Java descarta a fração decimal no tipo de divisão int / int, e qual a diferença didática de utilizar cast decimal:' },
      { type: 'div_split' }
    ]
  },
  {
    id: 'resto',
    eyebrow: 'Módulos',
    label: 'Estoque de Lotes',
    title: 'Divisão em Caixas e Itens Sobrados',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Ajuste a quantidade de mercadorias no estoque e examine visualmente como o operador de resto (%) ajuda a separar os itens soltos fora das caixas completas:' },
      { type: 'lote' }
    ]
  },
  {
    id: 'precedencia',
    eyebrow: 'Precedência',
    label: 'Precedência e Strings',
    title: 'Árvore de Execução da JVM',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Compare a ordem de execução com e sem parênteses, e veja por que a concatenação acidental de strings com números ocorre em leituras cruas:' },
      { type: 'precedencia' }
    ]
  },
  {
    id: 'exemplos',
    eyebrow: 'Aplicações',
    label: 'Casos Corporativos',
    title: 'Códigos aplicados ao domínio de backend',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Explore os programas de cálculo de estoque, offset de paginações em bancos de dados SQL, lotes de frete e percentuais de conclusão:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Tratamento de overflow, divisões por zero e imprecisões',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Depure e previna os 10 erros comuns aritméticos que quebram o console Java em tempo de execução:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega',
    label: 'Entrega do Lab',
    title: 'PowerShell, compilação de lote e commits Git',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Configure sua pasta de trabalho local, compile as 10 classes Java da aula e execute o commit de forma limpa:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio Prático de Transferência: Eficiência de Máquina de Fábrica',
        text: 'Crie o arquivo CalculoEficienciaMaquina.java em labs/m1/aula-031-operadores-aritmeticos/. Configure o Locale padrão americano. Pergunte e leia do console utilizando o Scanner: total de horas de funcionamento da máquina (int), peças produzidas (int) e peças defeituosas descartadas (int). Calcule: a taxa de produção por hora (peças boas por hora) em formato decimal usando cast double, o percentual de peças rejeitadas (peças defeituosas em relação ao total de peças) como decimal de 0 a 100%, a quantidade de caixas completas necessárias para armazenar as peças boas (sabendo que cada caixa comporta 15 peças), e a quantidade de peças boas que sobram fora das caixas usando o resto (%). Imprima o relatório completo formatado no console com tabulações.',
        acceptance: [
          'Instanciação correta de Scanner associado a System.in.',
          'Configuração regional Locale.US declarada antes do Scanner.',
          'Cálculo de divisão decimal usando cast (double) para peças por hora e percentual.',
          'Cálculo de lotes com divisão inteira (/) e resto (%) para armazenamento de caixas.',
          'Compilação e execução corretas no terminal local com histórico de Git limpo.'
        ]
      }
    ]
  }
];

export default function GuidedArithmeticOperatorsLesson031({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-arithmetic-operators-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Máquina de Calcular Lógica</span>
        <p className="guided-sequence">031 · M1.11</p>
        <h1>Operadores Aritméticos</h1>
        <p>Aprenda a realizar cálculos com variáveis no backend. Domine divisão inteira, o resto da divisão %, as regras de precedência, tratamento de divisores nulos, overflow de dados e formatação.</p>
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

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'divisão', label: 'inteira vs decimal' }, { value: '% resto', label: 'quebra de lotes' }, { value: 'precedência', label: 'parênteses e strings' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 031">
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
              {activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}
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
              <h3>Aritmética e Precedência dominadas!</h3>
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
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 030</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Cálculos de backend consolidados' : allStepsComplete ? 'Use o botão acima' : 'Pratique resto, precedência e divisão inteira'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir Operadores Relacionais'}>Aula 032 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
