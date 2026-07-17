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
import './guidedIfElseDecisionLesson.css';

const STORAGE_KEY = 'guided-ifelse-decision-lesson-035-progress';

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'If/Else Básico', file: 'IfElseBasico.java',
    code: 'public class IfElseBasico {\n    public static void main(String[] args) {\n        int idade = 17;\n\n        if (idade >= 18) {\n            System.out.println("Maior de idade.");\n        } else {\n            System.out.println("Menor de idade.");\n        }\n    }\n}',
    output: 'Menor de idade.',
    insight: 'O bloco else é o fluxo de fallback automático que executa caso o teste relacional do if resulte em false.'
  },
  {
    id: 1, label: 'Categorização Pedido', file: 'PedidoIfElseIf.java',
    code: 'import java.math.BigDecimal;\n\npublic class PedidoIfElseIf {\n    public static void main(String[] args) {\n        BigDecimal total = new BigDecimal("850.00");\n\n        if (total.compareTo(new BigDecimal("1000.00")) >= 0) {\n            System.out.println("Pedido de alto valor.");\n        } else if (total.compareTo(new BigDecimal("500.00")) >= 0) {\n            System.out.println("Pedido de médio valor.");\n        } else if (total.compareTo(BigDecimal.ZERO) > 0) {\n            System.out.println("Pedido de baixo valor.");\n        } else {\n            System.out.println("Pedido inválido.");\n        }\n    }\n}',
    output: 'Pedido de médio valor.',
    insight: 'Como BigDecimal é um objeto, a comparação lógica de valor é realizada pelo método .compareTo() e não por operadores relacionais comuns.'
  },
  {
    id: 2, label: 'Roteamento OS', file: 'OrdemServicoIfElseIf.java',
    code: 'public class OrdemServicoIfElseIf {\n    public static void main(String[] args) {\n        String statusOs = "REAGENDADA";\n\n        if ("AGENDADA".equals(statusOs)) {\n            System.out.println("OS aguardando execução.");\n        } else if ("REAGENDADA".equals(statusOs)) {\n            System.out.println("OS teve reagendamento.");\n        } else if ("CONCLUIDA".equals(statusOs)) {\n            System.out.println("OS finalizada.");\n        } else if ("CANCELADA".equals(statusOs)) {\n            System.out.println("OS cancelada.");\n        } else {\n            System.out.println("Status de OS desconhecido.");\n        }\n    }\n}',
    output: 'OS teve reagendamento.',
    insight: 'O equals() é posicionado com a String literal estática primeiro ("AGENDADA".equals(status)) para evitar NullPointerException caso statusOs nasça nulo.'
  },
  {
    id: 3, label: 'Notificações Mensageria', file: 'MensageriaIfElseIf.java',
    code: 'public class MensageriaIfElseIf {\n    public static void main(String[] args) {\n        String tipoMensagem = "ENTREGA";\n\n        if ("BOAS_VINDAS".equals(tipoMensagem)) {\n            System.out.println("Enviar boas-vindas.");\n        } else if ("ENTREGA".equals(tipoMensagem)) {\n            System.out.println("Enviar confirmação de entrega.");\n        } else if ("NPS".equals(tipoMensagem)) {\n            System.out.println("Enviar pesquisa NPS.");\n        } else {\n            System.out.println("Tipo de mensagem não configurado.");\n        }\n    }\n}',
    output: 'Enviar confirmação de entrega.',
    insight: 'Estruturas de desvios lineares com Strings são comuns para rotear regras de integração de mensagens em microsserviços.'
  }
];

const ERRORS = [
  { title: 'Ordem de faixas invertida', code: 'if (nota >= 7.0) {\n    System.out.println("Aprovado");\n} else if (nota >= 9.0) {\n    System.out.println("Excelente");\n}', symptom: 'Alunos com nota 9.5 recebem a mensagem "Aprovado" em vez de "Excelente"', cause: 'O Java lê as faixas de cima para baixo. Como nota >= 7.0 é verdadeira para 9.5, ela captura o fluxo prematuramente.', fix: 'Posicione as condições mais restritivas (específicas) no topo da cadeia lógica.' },
  { title: 'Usar vários if paralelos', code: 'if (nota >= 9.0) { ... }\nif (nota >= 7.0) { ... }\nif (nota >= 5.0) { ... }', symptom: 'Imprime múltiplos logs redundantes para uma única nota de avaliação', cause: 'Usar condicionais if independentes faz a JVM avaliar todas as linhas em vez de desviar no primeiro sucesso.', fix: 'Encadeie as condições subsequentes utilizando else if.' },
  { title: 'Esquecer o else final', code: 'if ("SIM".equals(opt)) { ... } else if ("NAO".equals(opt)) { ... }', symptom: 'Status desconhecidos ou vazios passam de forma silenciosa sem tratamento', cause: 'Omitir o bloco de fallback de segurança para casos não previstos no algoritmo.', fix: 'Adicione um bloco else final lançando exceções ou logs de "Status desconhecido".' },
  { title: 'Condições lógicas idênticas', code: 'if (status == 1) {\n    ...\n} else if (status == 1) {\n    ...\n}', symptom: 'O segundo bloco condicional idêntico nunca executa na Thread do programa', cause: 'Duplicar expressões de validação na mesma cadeia lógica.', fix: 'Exclua a duplicidade ou ajuste o valor da variável de teste da segunda comparação.' },
  { title: 'Ponto e vírgula após o if', code: 'if (idade >= 18);\n{\n    System.out.println("Maior");\n}', symptom: 'O bloco entre chaves executa sempre, mesmo com idades como 15 anos', cause: 'Colocar ; encerra a instrução do if de forma nula no cabeçalho. O bloco seguinte roda incondicionalmente.', fix: 'Remova o ponto e vírgula indevido após a declaração do parênteses do if.' },
  { title: 'Mensagem incoerente no log', code: 'if (saldo.compareTo(BigDecimal.ZERO) < 0) {\n    System.out.println("Aprovado");\n}', symptom: 'Auditoria corporativa aponta logs falsificados', cause: 'Escrever mensagens textuais de sucesso dentro de blocos que validam falhas.', fix: 'Revise todas as mensagens para que coincidam didaticamente com o estado lógico avaliado.' },
  { title: 'Comparação de String com ==', code: 'if (status == "PENDENTE") { ... }', symptom: 'Desvios lógicos falham de forma intermitente dependendo do Pool da JVM', cause: 'Usar o operador relacional == para comparar o conteúdo de objetos complexos como Strings.', fix: 'Ajuste a comparação para utilizar o método seguro equals(): "PENDENTE".equals(status);' }
];

const EVIDENCE = [
  '# Aula 035 — If, Else If e Else', '',
  '## Desvios Condicionais', '- [ ] Entendi o funcionamento de cadeias excludentes (if, else if, else)', '- [ ] Reconheci o papel do bloco else final como proteção de fallback de dados', '- [ ] Usei chaves {} em todos os desvios de blocos para manutenções seguras', '',
  '## Faixas e Ordenações', '- [ ] Organizei faixas de avaliação do mais restritivo ao mais geral', '- [ ] Diferenciei múltiplos ifs independentes de cadeias de else ifs', '',
  '## Higiene Aritmética', '- [ ] Corrigi e evitei ponto e vírgula indesejado após a declaração do if', '- [ ] Comparei Strings de status usando equals() na ordem correta', '',
  '## Evidências locais', '- [ ] Criei, compilei e testei as 9 classes locais de desvios', '- [ ] Assegurei o Git livre de binários compilados .class', '',
  '## Decisão de Projeto', '- Estruturas aninhadas e cálculos booleanos feitos na calculadora de fretes:', '- Por que o ponto e vírgula após a declaração do if anula o teste lógico:'
].join('\n');

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="dec35-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file dec35-code">
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

function DecisionTreeLab() {
  const [nota, setNota] = useState(8.5);
  const [order, setOrder] = useState('correta'); // 'correta', 'incorreta'

  let activeNode = '';
  if (order === 'correta') {
    if (nota >= 9.0) activeNode = 'excelente';
    else if (nota >= 7.0) activeNode = 'aprovado';
    else if (nota >= 5.0) activeNode = 'recuperacao';
    else activeNode = 'reprovado';
  } else {
    // Incorreta: >= 7.0 está no topo!
    if (nota >= 7.0) activeNode = 'aprovado';
    else if (nota >= 9.0) activeNode = 'excelente'; // Nunca será atingido para notas >= 9.0
    else if (nota >= 5.0) activeNode = 'recuperacao';
    else activeNode = 'reprovado';
  }

  return <section className="dec35-tree-container">
    <div className="dec35-tree-flow">
      <label style={{ display: 'block', fontSize: '.65rem', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Ajuste a nota do estudante:</label>
      <input
        type="number"
        step="0.5"
        min="0"
        max="10"
        value={nota}
        onChange={e => setNota(Number(e.target.value))}
        style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontFamily: 'Consolas, monospace', marginBottom: '10px' }}
      />

      <label style={{ display: 'block', fontSize: '.65rem', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Modo de Ordenação das Condições:</label>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          type="button"
          onClick={() => setOrder('correta')}
          style={{
            flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.65rem', fontWeight: 'bold',
            background: order === 'correta' ? 'var(--dec35-fuchsia)' : '#fff', color: order === 'correta' ? '#fff' : '#475569', cursor: 'pointer'
          }}
        >
          Correto (Restritivo Topo)
        </button>
        <button
          type="button"
          onClick={() => setOrder('incorreta')}
          style={{
            flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.65rem', fontWeight: 'bold',
            background: order === 'incorreta' ? '#ef4444' : '#fff', color: order === 'incorreta' ? '#fff' : '#475569', cursor: 'pointer'
          }}
        >
          Incorreto (Geral Topo)
        </button>
      </div>

      <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '.7rem' }}>
        {order === 'incorreta' && nota >= 9.0 ? (
          <span style={{ color: '#be123c', fontWeight: 'bold' }}>⚠️ Captura Prematura! A nota {nota} foi capturada no bloco "Aprovado" (nota &gt;= 7.0) e a JVM ignorou o bloco "Excelente" subsequente.</span>
        ) : (
          <span style={{ color: '#047857', fontWeight: 'bold' }}>✓ Roteamento Correto. A JVM selecionou o bloco correspondente adequado para a nota {nota}.</span>
        )}
      </div>
    </div>

    <div className="dec35-tree-viewport">
      <div className="dec35-glow-dot" style={{
        top: activeNode === 'excelente' ? '25px' : activeNode === 'aprovado' ? '75px' : activeNode === 'recuperacao' ? '125px' : '175px',
        left: '10px', transition: 'top 0.5s ease-in-out'
      }} />

      {order === 'correta' ? (
        <>
          <div className={`dec35-tree-node ${activeNode === 'excelente' ? 'active' : 'ignored'}`}>if (nota &gt;= 9.0) &rarr; EXCELENTE</div>
          <div className={`dec35-tree-node ${activeNode === 'aprovado' ? 'active' : 'ignored'}`}>else if (nota &gt;= 7.0) &rarr; APROVADO</div>
          <div className={`dec35-tree-node ${activeNode === 'recuperacao' ? 'active' : 'ignored'}`}>else if (nota &gt;= 5.0) &rarr; RECUPERAÇÃO</div>
          <div className={`dec35-tree-node ${activeNode === 'reprovado' ? 'active' : 'ignored'}`}>else &rarr; REPROVADO</div>
        </>
      ) : (
        <>
          <div className={`dec35-tree-node ${activeNode === 'aprovado' ? 'active' : 'ignored'}`}>if (nota &gt;= 7.0) &rarr; APROVADO</div>
          <div className={`dec35-tree-node ${activeNode === 'excelente' ? 'active' : 'ignored'}`} style={{ borderColor: '#ef4444' }}>else if (nota &gt;= 9.0) &rarr; EXCELENTE (Morto)</div>
          <div className={`dec35-tree-node ${activeNode === 'recuperacao' ? 'active' : 'ignored'}`}>else if (nota &gt;= 5.0) &rarr; RECUPERAÇÃO</div>
          <div className={`dec35-tree-node ${activeNode === 'reprovado' ? 'active' : 'ignored'}`}>else &rarr; REPROVADO</div>
        </>
      )}
    </div>
  </section>;
}

function FlowComparisonLab() {
  const [flow, setFlow] = useState('elseif'); // 'elseif', 'multipleifs'

  return <section className="dec35-comp-box">
    <div className="dec35-comp-side">
      <button
        type="button"
        onClick={() => setFlow('elseif')}
        style={{
          padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.68rem', fontWeight: 'bold',
          background: flow === 'elseif' ? 'var(--dec35-fuchsia)' : '#fff', color: flow === 'elseif' ? '#fff' : '#475569', cursor: 'pointer'
        }}
      >
        Cadeia else if (Excludente)
      </button>
      <CodePanel
        name="Cadeia Excludente"
        lines={false}
        code={[
          'if (nota >= 9.0) {',
          '    System.out.println("Excelente");',
          '} else if (nota >= 7.0) {',
          '    System.out.println("Aprovado");',
          '}'
        ].join('\n')}
      />
      <div style={{ marginTop: 'auto', background: '#0f172a', padding: '10px', borderRadius: '8px', color: '#fff', fontSize: '.7rem', fontFamily: 'Consolas, monospace' }}>
        <span>Console de Saída:</span><br />
        <span style={{ color: '#f472b6' }}>Excelente</span>
      </div>
    </div>

    <div className="dec35-comp-side">
      <button
        type="button"
        onClick={() => setFlow('multipleifs')}
        style={{
          padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.68rem', fontWeight: 'bold',
          background: flow === 'multipleifs' ? '#ef4444' : '#fff', color: flow === 'multipleifs' ? '#fff' : '#475569', cursor: 'pointer'
        }}
      >
        Vários ifs Paralelos (Redundante)
      </button>
      <CodePanel
        name="Ifs Independentes"
        lines={false}
        code={[
          'if (nota >= 9.0) {',
          '    System.out.println("Excelente");',
          '}',
          'if (nota >= 7.0) {',
          '    System.out.println("Aprovado");',
          '}'
        ].join('\n')}
      />
      <div style={{ marginTop: 'auto', background: '#0f172a', padding: '10px', borderRadius: '8px', color: '#fff', fontSize: '.7rem', fontFamily: 'Consolas, monospace' }}>
        <span>Console de Saída:</span><br />
        <span style={{ color: '#ef4444' }}>Excelente<br />Aprovado</span>
      </div>
    </div>
  </section>;
}

function SemicolonAssassinLab() {
  const [fixed, setFixed] = useState(false);

  return <section className="dec35-semicolon-card">
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => setFixed(!fixed)}
        style={{ padding: '8px 12px', background: fixed ? 'var(--dec35-fuchsia)' : '#fff', color: fixed ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}
      >
        {fixed ? 'Remover Correção' : 'Corrigir Ponto e Vírgula'}
      </button>
      <span style={{ fontSize: '.65rem', color: '#64748b' }}>
        {fixed ? 'A condicional agora protege e controla o bloco entre chaves.' : 'O ponto e vírgula anula o efeito lógico do if.'}
      </span>
    </div>

    {fixed ? (
      <CodePanel
        name="Código Seguro e Corretamente Sintetizado"
        code={[
          'int idade = 15;',
          'if (idade >= 18) {',
          '    System.out.println("Maior de idade");',
          '}'
        ].join('\n')}
      />
    ) : (
      <CodePanel
        name="Ponto e Vírgula Assassino (Anti-Pattern)"
        code={[
          'int idade = 15;',
          'if (idade >= 18); // <-- Encerra a instrução aqui!',
          '{',
          '    System.out.println("Maior de idade"); // <-- Roda sempre!',
          '}'
        ].join('\n')}
      />
    )}

    <p style={{ margin: 0, fontSize: '.72rem', lineHeight: 1.5, color: '#475569' }}>
      {fixed ? (
        <span><b>Comportamento: Correto</b>. O bloco interno só será executado caso a idade do paciente satisfaça a comparação. Nada é impresso para idade 15.</span>
      ) : (
        <span><b>Comportamento: Errado</b>. O Java interpreta a condicional como vazia pela presença de <code>;</code> no cabeçalho. O bloco com chaves subsequente é executado como uma declaração de escopo isolado incondicional. Imprime "Maior de idade" mesmo para 15 anos.</span>
      )}
    </p>
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="dec35-domains-gallery">
    <div className="dec35-domains-sidebar">
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
          <Sparkles size={16} style={{ color: 'var(--dec35-fuchsia)', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="dec35-errors-clinic">
    <nav className="dec35-errors-nav">
      {ERRORS.map((entry, index) => (
        <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="dec35-error-card">
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
      <div className="dec35-error-flow">
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
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-035-if-else-if-e-else\ncd labs\\m1\\aula-035-if-else-if-e-else\nNew-Item IfBasico.java, IfElseBasico.java, IfElseIfBasico.java, PedidoIfElseIf.java, ProdutoIfElseIf.java, PagamentoIfElseIf.java, OrdemServicoIfElseIf.java, MensageriaIfElseIf.java, AuditoriaIfElseIf.java, ErroOrdemFaixas.java, ErroVariosIf.java, ErroSemElseFinal.java, ErroStringComIgualIgual.java, ErroPontoVirgulaAposIf.java',
      out: 'Quatorze arquivos Java criados na estrutura do repositório.',
      tip: 'Abra os arquivos locais no seu editor de código.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac *.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Monitore erros de chaves soltas ou ponto e vírgula após a declaração do if.'
    },
    {
      title: 'Executar Programas',
      cmd: 'java PedidoIfElseIf',
      out: 'Pedido de médio valor.',
      tip: 'Verifique se o BigDecimal avaliou adequadamente comparando o retorno de compareTo.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit add labs/m1/aula-035-if-else-if-e-else docs/diario-de-bordo.md\ngit commit -m "Aula 035: pratica desvios condicionais em Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Certifique-se de que nenhum bytecode compilado de extensão .class entrou no commit.'
    }
  ];

  const current = steps[stage];

  return <section className="dec35-terminal-flow">
    <div className="bool27-delivery-flow">
      <nav className="dec35-delivery-flow nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="dec35-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="dec35-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file dec35-code" style={{ marginTop: '14px' }}>
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
  if (block.type === 'routing_tree') return <DecisionTreeLab />;
  if (block.type === 'flow_comp') return <FlowComparisonLab />;
  if (block.type === 'semicolon_error') return <SemicolonAssassinLab />;
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
    id: 'roteamento',
    eyebrow: 'Roteamento JVM',
    label: 'Árvore de Decisão',
    title: 'Visualizando desvios lineares de cima para baixo',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Insira uma nota de avaliação escolar e compare os dois modos de roteamento para ver a JVM selecionando os caminhos e capturando faixas prematuramente:' },
      { type: 'routing_tree' }
    ]
  },
  {
    id: 'comparador',
    eyebrow: 'Estruturas de Decisão',
    label: 'If vs Else If',
    title: 'Fluxos de avaliação paralelos vs excludentes',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Analise e diferencie visualmente como a JVM executa múltiplos ifs independentes contra cadeias de else if excludentes:' },
      { type: 'flow_comp' }
    ]
  },
  {
    id: 'semicolon',
    eyebrow: 'Sintaxe Segura',
    label: 'Evitando o Ponto e Vírgula',
    title: 'O perigo da condicional anulada',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'Ative a correção da condicional e entenda como colocar ponto e vírgula após a declaração do if desativa o controle lógico da estrutura:' },
      { type: 'semicolon_error' }
    ]
  },
  {
    id: 'exemplos',
    eyebrow: 'Aplicações',
    label: 'Casos Corporativos',
    title: 'Categorização de pedidos, produtos e notificações',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Acompanhe as implementações locais do mundo real contendo ordens de serviço, mensagens NPS de fidelização e volumes de estoque:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Corrigindo faixas de avaliação e comparadores de String',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Diagnostique e solucione os 7 erros clássicos cometidos em tomada de decisão lógica do Java:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega',
    label: 'Entrega do Lab',
    title: 'Estruturação PowerShell, javac e Git histórico limpo',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Abra seu terminal local, monte a pasta, compile as 9 classes Java de testes relacionais e realize o commit:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio Prático de Transferência: Roteador e Calculadora de Fretes Logísticos',
        text: 'Crie o arquivo CalculadoraFreteDecisao.java em labs/m1/aula-035-if-else-if-e-else/. Pergunte e leia do console utilizando o Scanner: o peso do pacote em Kg (double) e a distância do envio em Km (int). Defina as regras utilizando cadeias excludentes if / else if / else com chaves { } obrigatórias em todos os blocos: se peso <= 0 ou distância <= 0, imprima "Erro: Dimensões inválidas" e termine. Se o peso for <= 5.0, calcule: se distância <= 100 o frete é "LEVE_CURTO" (R$ 10.00), senão "LEVE_LONGO" (R$ 25.00). Se o peso for <= 20.0, calcule: se distância <= 100 o frete é "MEDIO_CURTO" (R$ 30.00), senão "MEDIO_LONGO" (R$ 60.00). Senão (peso > 20.0), calcule: se distância <= 100 o frete é "PESADO_CURTO" (R$ 80.00), senão "PESADO_LONGO" (R$ 150.00). Imprima o tipo de frete e o valor calculado.',
        acceptance: [
          'Instanciação correta de Scanner associado a System.in com Locale regional Locale.US.',
          'Uso obrigatório de chaves { } em todas as ramificações de if, else if e else.',
          'Validação limiar de dados menores ou iguais a zero no topo do roteador.',
          'Roteamento excludente que desvia e calcula o frete exato sem redundâncias de processamento.',
          'Compilação limpa, execução e commit Git sem poluir o repositório com arquivos compilados .class.'
        ]
      }
    ]
  }
];

export default function GuidedIfElseDecisionLesson035({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-ifelse-decision-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Roteador JVM</span>
        <p className="guided-sequence">035 · M1.15</p>
        <h1>If, Else If e Else</h1>
        <p>Aprenda a fazer seus sistemas backend tomarem decisões inteligentes de processamento. Domine faixas de valores ordenadas, previna erros de ponto e vírgula e aplique desvios excludentes seguros com chaves.</p>
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

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'if', label: 'desvio condicional' }, { value: 'else if', label: 'faixas excludentes' }, { value: 'else', label: 'fallback de segurança' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 035">
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
              <h3>Tomada de decisões em Java dominada!</h3>
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
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 034</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Tomada de decisões lógica consolidada' : allStepsComplete ? 'Use o botão acima' : 'Pratique desvios lineares e ordenação de faixas'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir Condicionais Aninhadas'}>Aula 036 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
