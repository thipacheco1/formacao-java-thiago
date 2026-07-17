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
import './guidedLogicalOperatorsLesson.css';

const STORAGE_KEY = 'guided-logical-operators-lesson-033-progress';

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'Main Lógico', file: 'OperadoresLogicosBasico.java',
    code: 'public class OperadoresLogicosBasico {\n    public static void main(String[] args) {\n        int idade = 20;\n        boolean possuiDocumento = true;\n        boolean bloqueado = false;\n\n        boolean maiorDeIdade = idade >= 18;\n        boolean podeEntrar = maiorDeIdade && possuiDocumento && !bloqueado;\n\n        System.out.println("Pode entrar: " + podeEntrar);\n    }\n}',
    output: 'Pode entrar: true',
    insight: 'O operador de negação (!) inverte o valor de bloqueado (false para true) antes de realizar a operação cumulativa &&.'
  },
  {
    id: 1, label: 'Validação Pedido', file: 'ValidacaoPedido.java',
    code: 'import java.math.BigDecimal;\n\npublic class ValidacaoPedido {\n    public static void main(String[] args) {\n        String cliente = "Ana";\n        BigDecimal valor = new BigDecimal("150.00");\n        int quantidade = 2;\n        boolean bloqueado = false;\n\n        boolean clienteInformado = cliente != null && !cliente.isBlank();\n        boolean valorPositivo = valor != null && valor.compareTo(BigDecimal.ZERO) > 0;\n        boolean quantidadePositiva = quantidade > 0;\n        boolean podeProcessar = clienteInformado && valorPositivo && quantidadePositiva && !bloqueado;\n\n        System.out.println("Pode processar: " + podeProcessar);\n    }\n}',
    output: 'Pode processar: true',
    insight: 'Quebrar condições grandes em booleanos Stack locais nomeados documenta a regra de negócios e facilita o debug.'
  },
  {
    id: 2, label: 'Validação OS', file: 'ValidacaoOs.java',
    code: 'import java.time.LocalDate;\n\npublic class ValidacaoOs {\n    public static void main(String[] args) {\n        String certificado = "OS-001";\n        LocalDate dataAgendamento = LocalDate.now().plusDays(1);\n        String periodo = "MANHA";\n        boolean cancelada = false;\n\n        boolean certificadoInformado = certificado != null && !certificado.isBlank();\n        boolean dataValida = dataAgendamento != null && !dataAgendamento.isBefore(LocalDate.now());\n        boolean periodoValido = periodo != null && ("MANHA".equals(periodo) || "TARDE".equals(periodo));\n        boolean osPodeSerAgendada = certificadoInformado && dataValida && periodoValido && !cancelada;\n\n        System.out.println("Pode agendar OS: " + osPodeSerAgendada);\n    }\n}',
    output: 'Pode agendar OS: true',
    insight: 'O parênteses envolvendo o teste de períodos MANHA e TARDE garante a precedência adequada do OU lógico (||).'
  },
  {
    id: 3, label: 'Controle de Acesso', file: 'ControleAcesso.java',
    code: 'public class ControleAcesso {\n    public static void main(String[] args) {\n        boolean autenticado = true;\n        boolean admin = false;\n        boolean supervisor = true;\n        boolean bloqueado = false;\n\n        boolean possuiPerfilPermitido = admin || supervisor;\n        boolean acessoLiberado = autenticado && possuiPerfilPermitido && !bloqueado;\n\n        System.out.println("Acesso liberado: " + acessoLiberado);\n    }\n}',
    output: 'Acesso liberado: true',
    insight: 'O OU lógico garante a liberação caso o usuário atinja pelo menos um dos perfis administrativos cadastrados.'
  }
];

const ERRORS = [
  { title: 'Usar & no lugar de &&', code: 'boolean ok = (A & B);', symptom: 'Desativa o curto-circuito. JVM avalia B mesmo se A for false', cause: 'O operador simples & roda avaliação lógica direta sem curto-circuito, gerando riscos.', fix: 'Utilize sempre o operador duplo && para avaliação lógica comum com desvio seguro.' },
  { title: 'Usar | no lugar de ||', code: 'boolean ok = (A | B);', symptom: 'Desativa o curto-circuito. JVM avalia B mesmo se A for true', cause: 'O operador simples | roda avaliação lógica direta sem curto-circuito.', fix: 'Utilize sempre o operador duplo || para avaliação lógica.' },
  { title: 'Ordem incorreta contra nulo', code: 'if (!nome.isBlank() && nome != null) { ... }', symptom: 'java.lang.NullPointerException', cause: 'A JVM tenta invocar isBlank() antes de verificar se o endereço de Stack aponta para null.', fix: 'Coloque sempre a verificação de existência (nome != null) em primeiro lugar.' },
  { title: 'Esquecer parênteses', code: 'boolean ok = A && B || C;', symptom: 'Precedência lógica incorreta. JVM avalia AND antes do OR', cause: 'O operador && possui prioridade implícita sobre o || na tabela de precedência do Java.', fix: 'Utilize parênteses para agrupar e documentar: (A && B) || C;' },
  { title: 'Negação dupla confusa', code: 'boolean pode = !(!statusAtivo);', symptom: 'Dificuldade de leitura humana e erros ocultos de lógica', cause: 'Encadear negações desnecessárias sobre booleanos locais.', fix: 'Remova as negações duplas ou renomencie a variável de forma positiva.' },
  { title: 'Expressões gigantes em if', code: 'if (A && B && C && (D || E) && !F) { ... }', symptom: 'Código ilegível que prejudica o debug e a manutenção', cause: 'Escrever regras complexas em uma linha única e extensa.', fix: 'Quebre a expressão em booleanos locais explicativos (ex: clienteValido, pagamentoAprovado).' },
  { title: 'Comparação de Strings com ==', code: 'boolean ok = status == "OK" && ativo;', symptom: 'Retorna false de forma aleatória em tempo de execução', cause: 'Utilizar o operador relacional == para comparar conteúdos textuais de objetos.', fix: 'Substitua pelo método seguro equals(): "OK".equals(status) && ativo;' },
  { title: 'Comparar boolean com true', code: 'boolean ok = ativo == true && permissao;', symptom: 'Código verboso com ruído redundante', cause: 'Testar explicitamente igualdade com true em variáveis que já são booleanas.', fix: 'Use a variável de forma direta: ativo && permissao;' },
  { title: 'Comparar boolean com false', code: 'boolean ok = suspenso == false && ativo;', symptom: 'Código pouco natural e legível', cause: 'Testar explicitamente igualdade com false.', fix: 'Substitua pela negação lógica da variável: !suspenso && ativo;' },
];

const EVIDENCE = [
  '# Aula 033 — Operadores Lógicos', '',
  '## Operações Lógicas', '- [ ] Entendi o comportamento do && (E lógico), || (OU lógico) e ! (NÃO lógico)', '- [ ] Pratiquei a construção de tabelas-verdade interativas com chaves e circuitos', '- [ ] Entendi a precedência implícita de && sobre || e o uso de parênteses', '',
  '## Curto-Circuito e Segurança', '- [ ] Compreendi o desvio de curto-circuito na JVM para && e ||', '- [ ] Apliquei a ordem correta de verificação contra null (null check primeiro)', '- [ ] Previni a exceção NullPointerException em tempo de execução', '',
  '## Manutenibilidade e Limpeza', '- [ ] Refatorei condições extensas em booleanos locais explicativos (Stack-local)', '- [ ] Removi negações duplas confusas de booleanos do sistema', '',
  '## Evidências locais', '- [ ] Criei, compilei e executei as 7 classes locais de regras de negócio', '- [ ] Garanti a ausência de binários compilados .class no histórico do Git', '',
  '## Decisão de Projeto', '- Regras lógicas combinadas e parênteses utilizados no desafio de transferência:', '- Por que a ordem dos operandos de null check importa no curto-circuito:'
].join('\n');

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="log33-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file log33-code">
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

function PortasLogicasLab() {
  const [circuit, setCircuit] = useState('AND'); // 'AND', 'OR'
  const [switchA, setSwitchA] = useState(false);
  const [switchB, setSwitchB] = useState(false);
  const [negate, setNegate] = useState(false);

  let output = circuit === 'AND' ? (switchA && switchB) : (switchA || switchB);
  if (negate) {
    output = !output;
  }

  return <section className="log33-portas">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          type="button"
          onClick={() => setCircuit('AND')}
          style={{
            flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.68rem', fontWeight: 'bold',
            background: circuit === 'AND' ? 'var(--log33-teal)' : '#fff', color: circuit === 'AND' ? '#fff' : '#475569', cursor: 'pointer'
          }}
        >
          E Lógico (Chaves em Série)
        </button>
        <button
          type="button"
          onClick={() => setCircuit('OR')}
          style={{
            flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.68rem', fontWeight: 'bold',
            background: circuit === 'OR' ? 'var(--log33-teal)' : '#fff', color: circuit === 'OR' ? '#fff' : '#475569', cursor: 'pointer'
          }}
        >
          OU Lógico (Chaves em Paralelo)
        </button>
      </div>

      <div className="log33-circuit-board">
        <button type="button" className={`log33-switch-key ${switchA ? 'on' : ''}`} onClick={() => setSwitchA(!switchA)}>
          <span className="label">Chave A</span>
          <span className="state">{switchA ? 'TRUE' : 'FALSE'}</span>
        </button>

        <span style={{ color: '#94a3b8', fontFamily: 'Consolas, monospace', fontWeight: 'bold', fontSize: '1rem' }}>
          {circuit === 'AND' ? '&&' : '||'}
        </span>

        <button type="button" className={`log33-switch-key ${switchB ? 'on' : ''}`} onClick={() => setSwitchB(!switchB)}>
          <span className="label">Chave B</span>
          <span className="state">{switchB ? 'TRUE' : 'FALSE'}</span>
        </button>

        <button
          type="button"
          className={`log33-switch-key ${negate ? 'on' : ''}`}
          onClick={() => setNegate(!negate)}
          style={{ borderStyle: 'dashed', borderColor: '#ef4444', background: negate ? '#7f1d1d' : '#1e293b' }}
        >
          <span className="label" style={{ color: '#fecdd3' }}>Inverter (!)</span>
          <span className="state">{negate ? 'ATIVO' : 'DESAT'}</span>
        </button>

        <span style={{ color: '#94a3b8', fontFamily: 'Consolas, monospace', fontWeight: 'bold', fontSize: '1rem' }}>&rarr;</span>

        <div className={`log33-lamp ${output ? 'on' : ''}`}>
          <span>{output ? 'LIGADA' : 'DESLIG'}</span>
          <span style={{ fontSize: '.5rem', opacity: 0.8 }}>({String(output)})</span>
        </div>
      </div>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px', background: '#fff', borderColor: '#cbd5e1' }}>
        <Lightbulb size={22} style={{ color: 'var(--log33-teal)' }} />
        <div>
          <strong>Tabela-Verdade Física</strong>
          <p style={{ fontSize: '.65rem', lineHeight: 1.45, color: '#475569', margin: '2px 0 0' }}>
            No circuito <b>E (&&)</b>, a lâmpada acende se ambas as chaves forem ligadas. No circuito <b>OU (||)</b>, ligar qualquer uma das chaves fecha a corrente e acende o sinal.
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function CurtoCircuitoLab() {
  const [order, setOrder] = useState('correta'); // 'correta', 'incorreta'

  return <section className="log33-curto-sim">
    <div style={{ display: 'flex', gap: '6px' }}>
      <button
        type="button"
        onClick={() => setOrder('correta')}
        style={{
          flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.68rem', fontWeight: 'bold',
          background: order === 'correta' ? 'var(--log33-teal)' : '#fff', color: order === 'correta' ? '#fff' : '#475569', cursor: 'pointer'
        }}
      >
        Ordem Segura: null check primeiro
      </button>
      <button
        type="button"
        onClick={() => setOrder('incorreta')}
        style={{
          flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.68rem', fontWeight: 'bold',
          background: order === 'incorreta' ? '#ef4444' : '#fff', color: order === 'incorreta' ? '#fff' : '#475569', cursor: 'pointer'
        }}
      >
        Ordem Perigosa: método primeiro
      </button>
    </div>

    <div className="log33-thread-line">
      <span style={{ color: '#94a3b8' }}>Thread JVM:</span>
      {order === 'correta' ? (
        <>
          <span className="log33-thread-node eval">1. nome != null (FALSO)</span>
          <span style={{ color: '#e11d48', fontWeight: 'bold' }}>&amp;&amp;</span>
          <span className="log33-thread-node skip">2. !nome.isBlank() (PULADO)</span>
        </>
      ) : (
        <>
          <span className="log33-thread-node eval" style={{ background: '#be123c' }}>1. !nome.isBlank() (EXECUTA)</span>
          <span style={{ color: '#94a3b8' }}>&amp;&amp;</span>
          <span className="log33-thread-node">2. nome != null</span>
        </>
      )}
    </div>

    {order === 'incorreta' ? (
      <div className="log33-bomba-npe">
        <AlertTriangle size={18} style={{ flex: '0 0 auto' }} />
        <span><b>Bomba de Runtime!</b> A JVM tenta chamar <code>isBlank()</code> em uma referência de Stack com valor <code>null</code>, lançando <code>NullPointerException</code>.</span>
      </div>
    ) : (
      <div className="log33-bomba-npe" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}>
        <Check size={18} style={{ flex: '0 0 auto', color: '#10b981' }} />
        <span><b>Execução Segura!</b> O curto-circuito do <code>&&</code> impede que a JVM execute a segunda condição ao ver que a primeira é falsa, protegendo a Thread.</span>
      </div>
    )}
  </section>;
}

function RefactorLab() {
  const [refactored, setRefactored] = useState(false);

  return <section className="log33-refactor-box">
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => setRefactored(!refactored)}
        style={{ padding: '8px 12px', background: refactored ? 'var(--log33-teal)' : '#fff', color: refactored ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}
      >
        {refactored ? 'Restaurar Condição Gigante' : 'Refatorar Condição'}
      </button>
      <span style={{ fontSize: '.65rem', color: '#64748b' }}>
        {refactored ? 'Código legível com booleanos explicativos locais.' : 'Linha única gigante difícil de depurar.'}
      </span>
    </div>

    {refactored ? (
      <CodePanel
        name="Refatoração Profissional"
        code={[
          'boolean clienteInformado = cliente != null && !cliente.isBlank();',
          'boolean valorPositivo = valor != null && valor.compareTo(BigDecimal.ZERO) > 0;',
          'boolean statusPermitido = status == 1 || status == 2;',
          'boolean naoBloqueado = !bloqueado;',
          '',
          'if (clienteInformado && valorPositivo && statusPermitido && naoBloqueado) {',
          '    System.out.println("Válido.");',
          '}'
        ].join('\n')}
      />
    ) : (
      <CodePanel
        name="Condição Extensa (Anti-Pattern)"
        code={[
          'if (cliente != null && !cliente.isBlank() && valor != null && valor.compareTo(BigDecimal.ZERO) > 0 && (status == 1 || status == 2) && !bloqueado) {',
          '    System.out.println("Válido.");',
          '}'
        ].join('\n')}
      />
    )}
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="log33-domains-gallery">
    <div className="log33-domains-sidebar">
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
          <Sparkles size={16} style={{ color: 'var(--log33-teal)', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="log33-errors-clinic">
    <nav className="log33-errors-nav">
      {ERRORS.map((entry, index) => (
        <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="log33-error-card">
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
      <div className="log33-error-flow">
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
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-033-operadores-logicos\ncd labs\\m1\\aula-033-operadores-logicos\nNew-Item OperadoresLogicosBasico.java, ValidacaoPedido.java, ValidacaoOs.java, ValidacaoPagamento.java, ControleAcesso.java, ValidacaoMensageria.java, ValidacaoAuditoria.java, ErroOrdemNull.java, ErroParenteses.java, ErroNegacaoConfusa.java, ErroStringComIgualIgual.java',
      out: 'Onze arquivos Java criados na estrutura do repositório.',
      tip: 'Configure no seu IntelliJ os respectivos códigos contendo BigDecimal e datas.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac *.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Verifique se não há erros na compilação do BigDecimal ou imports de LocalDate ausentes.'
    },
    {
      title: 'Executar Programas',
      cmd: 'java ControleAcesso',
      out: 'Acesso liberado.',
      tip: 'Teste rodar as classes de erro de negação ou igualdade de String para ver os desvios de lógica.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-033-operadores-logicos docs/diario-de-bordo.md\ngit commit -m "Aula 033: pratica operadores logicos em Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Evite cometer arquivos compilados .class binários de forma acidental no repositório.'
    }
  ];

  const current = steps[stage];

  return <section className="log33-terminal-flow">
    <div className="bool27-delivery-flow">
      <nav className="log33-delivery-flow nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="log33-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="log33-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file log33-code" style={{ marginTop: '14px' }}>
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
  if (block.type === 'basic_gates') return <PortasLogicasLab />;
  if (block.type === 'short_circuit') return <CurtoCircuitoLab />;
  if (block.type === 'refactor') return <RefactorLab />;
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
    id: 'portas',
    eyebrow: 'Circuitos',
    label: 'Portas Lógicas',
    title: 'Acendendo circuitos de regras de negócio',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Altere as chaves lógicas A e B dos disjuntores em série (&&) ou em paralelo (||) e ligue a negação (!) para observar o sinal booleano final:' },
      { type: 'basic_gates' }
    ]
  },
  {
    id: 'curto',
    eyebrow: ' JVM Thread',
    label: 'Curto-Circuito',
    title: 'Desvio seguro contra falhas nulas',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Chaveie a ordem de verificação contra nulos e entenda como a JVM aborta a execução protegendo a Thread ativa contra NullPointerExceptions:' },
      { type: 'short_circuit' }
    ]
  },
  {
    id: 'refatoracao',
    eyebrow: 'Manutenibilidade',
    label: 'Ifs Legíveis',
    title: 'Quebra de expressões extensas',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'Refatore um anti-pattern de condição extensa convertendo-a em booleanos Stack locais autoexplicativos:' },
      { type: 'refactor' }
    ]
  },
  {
    id: 'exemplos',
    eyebrow: 'Aplicações',
    label: 'Casos Práticos',
    title: 'Validações com BigDecimal, LocalDate e perfis',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Estude as aplicações do mundo real contendo BigDecimal para pagamentos e pedidos, LocalDate para agendamentos de OS e triagens:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Evitando negações duplas e prioridades de portas',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Depure e previna as 10 falhas lógicas e de compilação clássicas em atribuições condicionais do Java:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega',
    label: 'Entrega do Lab',
    title: 'PowerShell, compilações em lote e Git',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Abra seu console local, monte a pasta, compile as 7 classes Java de regras e execute o commit:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio Prático de Transferência: Concessão de Crédito Estudantil',
        text: 'Crie o arquivo ConcessaoCreditoEstudantil.java em labs/m1/aula-033-operadores-logicos/. Pergunte e leia do console utilizando o Scanner: renda familiar do estudante (double), nota média no ENEM de 0 a 1000 (int), quantidade de dependentes na família (int) e se possui outras bolsas ativas (boolean). Calcule e armazene as regras de negócio booleanas: rendaDentroDoLimite (renda familiar menor ou igual a 3000.00), desempenhoAcademicoExcelente (nota do ENEM maior ou igual a 750), familiaNumerosa (dependentes maior ou igual a 3), semOutrasBolsas (negação de outras bolsas usando !). Combine as regras em concessaoAprovada: o estudante deve estar sem outras bolsas E (deve satisfazer a renda OU ter desempenho acadêmico excelente) E ter pelo menos uma das garantias familiares (ter desempenho excelente OU família numerosa). Imprima o relatório.',
        acceptance: [
          'Instanciação correta de Scanner associado a System.in com fechamento seguro.',
          'Uso do operador de negação (!) para desconsiderar estudantes com outras bolsas ativas.',
          'Agrupamento lógico adequado de parênteses para forçar a precedência do OU (||) antes do E (&&).',
          'Curto-circuito seguro contra NullPointerException e compilação limpa.',
          'Execução correta no terminal local e Git sem commitar arquivos .class binários.'
        ]
      }
    ]
  }
];

export default function GuidedLogicalOperatorsLesson033({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-logical-operators-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Máquina de Circuitos</span>
        <p className="guided-sequence">033 · M1.13</p>
        <h1>Operadores Lógicos</h1>
        <p>Aprenda a combinar múltiplas perguntas lógicas para validar regras de negócio complexas. Domine o curto-circuito && e || na JVM para evitar NullPointerExceptions e clareza com parênteses.</p>
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

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: '&& curto-circuito', label: 'E cumulativo' }, { value: '|| curto-circuito', label: 'OU alternativo' }, { value: '! negação', label: 'inversão lógica' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 033">
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
              <h3>Circuitos e Lógica combinada dominados!</h3>
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
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 032</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Lógica booleana de backend dominada' : allStepsComplete ? 'Use o botão acima' : 'Pratique curto-circuito, negação e precedência'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir Incremento e Decremento'}>Aula 034 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
