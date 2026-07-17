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
import './guidedNestedIfsSimplificationLesson.css';

const STORAGE_KEY = 'guided-nested-ifs-simplification-lesson-036-progress';

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'Pedido Aninhado', file: 'PedidoAninhado.java',
    code: 'public class PedidoAninhado {\n    public static void main(String[] args) {\n        boolean pedidoPago = true;\n        boolean pedidoCancelado = false;\n        boolean produtoDisponivel = true;\n        boolean enderecoValido = true;\n\n        if (pedidoPago) {\n            if (!pedidoCancelado) {\n                if (produtoDisponivel) {\n                    if (enderecoValido) {\n                        System.out.println("Pedido pode ser enviado");\n                    } else {\n                        System.out.println("Endereço inválido");\n                    }\n                } else {\n                    System.out.println("Produto indisponível");\n                }\n            } else {\n                System.out.println("Pedido cancelado");\n            }\n        } else {\n            System.out.println("Pedido não pago");\n        }\n    }\n}',
    output: 'Pedido pode ser enviado',
    insight: 'Esta é a clássica escada de aninhamento para a direita, que exige alta sobrecarga cognitiva de leitura.'
  },
  {
    id: 1, label: 'Pedido Simplificado', file: 'PedidoSimplificado.java',
    code: 'public class PedidoSimplificado {\n    public static void main(String[] args) {\n        boolean pedidoPago = true;\n        boolean pedidoCancelado = false;\n        boolean produtoDisponivel = true;\n        boolean enderecoValido = true;\n\n        if (!pedidoPago) {\n            System.out.println("Pedido não pago");\n        } else if (pedidoCancelado) {\n            System.out.println("Pedido cancelado");\n        } else if (!produtoDisponivel) {\n            System.out.println("Produto indisponível");\n        } else if (!enderecoValido) {\n            System.out.println("Endereço inválido");\n        } else {\n            System.out.println("Pedido pode ser enviado");\n        }\n    }\n}',
    output: 'Pedido pode ser enviado',
    insight: 'A inversão de lógica para capturar erros e motivos de bloqueio no topo achatou a indentação e clareou o código.'
  },
  {
    id: 2, label: 'Pedido Regra Nomeada', file: 'PedidoRegraNomeada.java',
    code: 'public class PedidoRegraNomeada {\n    public static void main(String[] args) {\n        boolean pedidoPago = true;\n        boolean pedidoCancelado = false;\n        boolean produtoDisponivel = true;\n        boolean enderecoValido = true;\n\n        boolean pedidoPodeSerEnviado = pedidoPago\n                && !pedidoCancelado\n                && produtoDisponivel\n                && enderecoValido;\n\n        if (pedidoPodeSerEnviado) {\n            System.out.println("Pedido pode ser enviado");\n        } else {\n            System.out.println("Pedido não pode ser enviado");\n        }\n    }\n}',
    output: 'Pedido pode ser enviado',
    insight: 'Quando o motivo do erro não precisa ser detalhado no output, a regra booleana nomeada é a opção mais limpa.'
  },
  {
    id: 3, label: 'Validações Independentes', file: 'ClienteValidacoesIndependentes.java',
    code: 'public class ClienteValidacoesIndependentes {\n    public static void main(String[] args) {\n        String nome = "";\n        String email = "clienteexemplo.com";\n        String cpf = "123";\n\n        boolean possuiErro = false;\n\n        if (nome.isBlank()) {\n            System.out.println("Nome obrigatório");\n            possuiErro = true;\n        }\n\n        if (!email.contains("@")) {\n            System.out.println("E-mail inválido");\n            possuiErro = true;\n        }\n\n        if (cpf.length() != 11) {\n            System.out.println("CPF deve ter 11 caracteres");\n            possuiErro = true;\n        }\n\n        if (!possuiErro) {\n            System.out.println("Cliente válido");\n        }\n    }\n}',
    output: 'Nome obrigatório\nE-mail inválido\nCPF deve ter 11 caracteres',
    insight: 'Múltiplos ifs independentes coletam todas as falhas consecutivas, acumulando o resultado em um booleano de controle.'
  }
];

const ERRORS = [
  { title: 'Criar escada de ifs indevida', code: 'if (A) {\n    if (B) {\n        if (C) {\n            ...\n        }\n    }\n}', symptom: 'Indentação excessiva e código complexo empurrado para a direita', cause: 'Aninhar múltiplos ifs lógicos cumulativos sem necessidade didática.', fix: 'Combine as condições lógicas com && ou crie um booleano explicativo intermediário.' },
  { title: 'Perda de motivo específico', code: 'boolean apto = A && B && C;\nif (!apto) {\n    System.out.println("Bloqueado");\n}', symptom: 'O usuário recebe uma mensagem genérica de bloqueio sem saber o motivo real', cause: 'Simplificar a regra com operadores lógicos sem preservar desvios para logs detalhados.', fix: 'Ajuste para uma cadeia excludente de else if testando negações de prioridades.' },
  { title: 'Else if em teste independente', code: 'if (nome.isBlank()) { ... } else if (!email.contains("@")) { ... }', symptom: 'Apenas a primeira falha de cadastro é exibida, ocultando outros erros válidos do formulário', cause: 'Usar uma cadeia excludente de else if em verificações que deveriam rodar paralelamente.', fix: 'Use ifs separados e crie uma variável acumuladora booleana possuiErro.' },
  { title: 'Ifs separados para status único', code: 'if ("PENDENTE".equals(status)) { ... }\nif ("APROVADO".equals(status)) { ... }', symptom: 'Múltiplos ifs independentes executando e avaliando dados excludentes de forma desnecessária', cause: 'Não encadear desvios de caminhos exclusivos utilizando else ifs.', fix: 'Substitua por uma única cadeia de else if finalizando em um else de fallback.' },
  { title: 'Nomear regra de forma genérica', code: 'boolean flag = ativo && !bloqueado && valido;', symptom: 'Variáveis com nomes como flag, res ou test que não explicam o contexto', cause: 'Nomenclaturas profissionais inexistentes para regras booleanas acumuladas.', fix: 'Substitua por nomes autodescritivos profissionais: boolean usuarioAptoParaAprovacao = ...;' },
  { title: 'Criar condição gigante na linha', code: 'if (A && B && C && D && E && !F) { ... }', symptom: 'Código ilegível e de difícil depuração por breakpoints', cause: 'Declarar excessivas operações em uma única condicional de linha única.', fix: 'Quebre a expressão lógica em booleanos locais explicativos Stack-local.' },
  { title: 'Ignorar a ordem de bloqueio', code: 'if (estoqueVazio) { ... } else if (produtoInativo) { ... }', symptom: 'Exibe a mensagem de estoque vazio para produtos que nem deveriam estar ativos no sistema', cause: 'Ordem de faixas e desvios desrespeitando as regras de prioridades de negócios do backend.', fix: 'Reordene as condições para que as regras de estado preliminares (inativo) venham primeiro.' },
  { title: 'Esconder fluxo principal', code: 'if (A) {\n    if (B) {\n        processamentoPrincipal();\n    }\n}', symptom: 'Código principal enterrado sob vários níveis de recuo e chaves', cause: 'Não tratar preliminarmente desvios rápidos com negação lógicas.', fix: 'Refatore o código invertendo os ifs para capturar falhas e desviar o fluxo logo no início.' },
  { title: 'Achar que todo aninhamento é ruim', code: 'if (clienteEncontrado && clienteAtivo) { ... } // Se clienteEncontrado é false, dá NullPointer ao ler clienteAtivo', symptom: 'Lança NullPointerException em tempo de execução', cause: 'Simplificar aninhamentos de dependência estrita onde a segunda variável exige a existência da primeira.', fix: 'Utilize aninhamento protetor ou tire proveito do curto-circuito seguro.' },
  { title: 'Não testar combinações limiares', code: 'boolean aprovado = ... // Sem homologar com todos os booleanos false/true', symptom: 'Bugs ocultos de lógica passam despercebidos para produção', cause: 'Deixar de testar exaustivamente a tabela-verdade do algoritmo com valores de fronteiras.', fix: 'Teste o algoritmo cobrindo todas as saídas lógicas de combinações de inputs.' }
];

const EVIDENCE = [
  '# Aula 036 — Ifs Aninhados e Simplificação', '',
  '## Achatamento de Escadas', '- [ ] Identifiquei o anti-pattern do "código escada" provocado por recuos excessivos', '- [ ] Refatorei ifs aninhados cumulativos unindo condições com o operador &&', '- [ ] Guardei regras complexas em booleanos locais autoexplicativos', '',
  '## Estruturas de Validação', '- [ ] Usei ifs independentes paralelos associados a um acumulador booleano (possuiErro)', '- [ ] Diferenciei validações paralelas de cadeias excludentes de else ifs', '- [ ] Organizei a ordem de prioridades de bloqueio alinhado ao negócio', '',
  '## Guard Clauses', '- [ ] Entendi a mentalidade de guard clauses para desvios rápidos de falhas', '- [ ] Evitei ocultar o fluxo principal de processamento em aninhamentos profundos', '',
  '## Evidências locais', '- [ ] Criei, compilei e executei as 15 classes locais', '- [ ] Mantive o histórico do Git livre de arquivos de bytecode .class', '',
  '## Decisão de Projeto', '- Validações e tratamento de fornecedores cadeia fria no desafio:', '- Por que priorizar o fluxo principal nos níveis iniciais de indentação:'
].join('\n');

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="nes36-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file nes36-code">
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

function AchatadorEscadaLab() {
  const [refactored, setRefactored] = useState(false);

  return <section className="nes36-flatten-container">
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => setRefactored(!refactored)}
        style={{ padding: '8px 12px', background: refactored ? 'var(--nes36-violet)' : '#fff', color: refactored ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}
      >
        {refactored ? 'Restaurar Escada Lógica' : 'Aplanar e Refatorar'}
      </button>
      <span style={{ fontSize: '.65rem', color: '#64748b' }}>
        {refactored ? 'Estrutura linear limpa, sem recuos excessivos.' : 'Indentação empurrando o código para a direita.'}
      </span>
    </div>

    <div className="nes36-code-indent-stage">
      <div className="nes36-indent-line" style={{ paddingLeft: '0px' }}>if (pedidoPago) &#123;</div>
      <div className="nes36-indent-line" style={{ paddingLeft: refactored ? '0px' : '20px' }}>if (!pedidoCancelado) &#123;</div>
      <div className="nes36-indent-line" style={{ paddingLeft: refactored ? '0px' : '40px' }}>if (produtoDisponivel) &#123;</div>
      <div className="nes36-indent-line" style={{ paddingLeft: refactored ? '0px' : '60px' }}>if (enderecoValido) &#123;</div>
      <div className="nes36-indent-line" style={{ paddingLeft: refactored ? '0px' : '80px', color: 'var(--nes36-magenta)', fontWeight: 'bold' }}>System.out.println("Pedido enviado!");</div>
      <div className="nes36-indent-line" style={{ paddingLeft: refactored ? '0px' : '60px' }}>&#125;</div>
      <div className="nes36-indent-line" style={{ paddingLeft: refactored ? '0px' : '40px' }}>&#125;</div>
      <div className="nes36-indent-line" style={{ paddingLeft: refactored ? '0px' : '20px' }}>&#125;</div>
      <div className="nes36-indent-line" style={{ paddingLeft: '0px' }}>&#125;</div>
    </div>
  </section>;
}

function ValidadorErrosIndependentesLab() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [mode, setMode] = useState('independent'); // 'independent', 'elseif'

  const errors = [];
  if (nome.trim() === '') errors.push('Nome é obrigatório.');
  if (!email.includes('@')) errors.push('E-mail é inválido (deve conter @).');
  if (cpf.length !== 11) errors.push('CPF deve ter exatamente 11 caracteres.');

  const displayedErrors = mode === 'independent' ? errors : (errors.length > 0 ? [errors[0]] : []);

  return <section className="nes36-validator-box">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '.62rem', color: '#475569', fontWeight: 'bold', marginBottom: '3px' }}>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Ex: João"
          style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '.72rem' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '.62rem', color: '#475569', fontWeight: 'bold', marginBottom: '3px' }}>E-mail:</label>
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Ex: joao@email.com"
          style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '.72rem' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '.62rem', color: '#475569', fontWeight: 'bold', marginBottom: '3px' }}>CPF:</label>
        <input
          type="text"
          value={cpf}
          onChange={e => setCpf(e.target.value)}
          placeholder="Ex: 12345678901"
          style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '.72rem' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
        <button
          type="button"
          onClick={() => setMode('independent')}
          style={{
            flex: 1, padding: '6px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '.62rem', fontWeight: 'bold',
            background: mode === 'independent' ? 'var(--nes36-violet)' : '#fff', color: mode === 'independent' ? '#fff' : '#475569', cursor: 'pointer'
          }}
        >
          Validações Independentes (Exibir todos)
        </button>
        <button
          type="button"
          onClick={() => setMode('elseif')}
          style={{
            flex: 1, padding: '6px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '.62rem', fontWeight: 'bold',
            background: mode === 'elseif' ? 'var(--nes36-violet)' : '#fff', color: mode === 'elseif' ? '#fff' : '#475569', cursor: 'pointer'
          }}
        >
          Cadeia else if (Exibir primeiro)
        </button>
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '.62rem', color: '#475569', fontWeight: 'bold', textTransform: 'uppercase' }}>Console do Validador:</span>
      <div className="nes36-error-console-list">
        {displayedErrors.length === 0 ? (
          <div className="success-msg"><Check size={14} /> Cliente cadastrado com sucesso!</div>
        ) : (
          displayedErrors.map((err, idx) => (
            <div key={idx} className="err-msg">
              <AlertTriangle size={13} /> {err}
            </div>
          ))
        )}
      </div>
    </div>
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="nes36-domains-gallery">
    <div className="nes36-domains-sidebar">
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
          <Sparkles size={16} style={{ color: 'var(--nes36-violet)', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="nes36-errors-clinic">
    <nav className="nes36-errors-nav">
      {ERRORS.map((entry, index) => (
        <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="nes36-error-card">
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
      <div className="nes36-error-flow">
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
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-036-ifs-aninhados-simplificacao\ncd labs\\m1\\aula-036-ifs-aninhados-simplificacao\nNew-Item Main.java, ClienteAninhado.java, ClienteSimplificado.java, ClienteRegraNomeada.java, PedidoAninhado.java, PedidoSimplificado.java, PedidoRegraNomeada.java, OrdemServicoAninhada.java, OrdemServicoSimplificada.java, AutorizacaoAninhada.java, AutorizacaoSimplificada.java, ClienteValidacoesIndependentes.java, FluxoStatusSimplificado.java, PedidoSimplificadoConsole.java, ClienteValidacoesConsole.java',
      out: 'Quinze arquivos Java criados na estrutura do repositório.',
      tip: 'Organize suas classes no IntelliJ para comparar as versões simplificadas das aninhadas.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac *.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Assegure que todas as chaves fechando ifs aninhados estejam perfeitamente casadas.'
    },
    {
      title: 'Executar Programas',
      cmd: 'java ClienteValidacoesIndependentes',
      out: 'Nome obrigatório\nE-mail inválido\nCPF deve ter 11 caracteres',
      tip: 'Verifique se os ifs separados acumularam todas as falhas no booleano local.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-036-ifs-aninhados-simplificacao docs/diario-de-bordo.md\ngit commit -m "Aula 036: pratica ifs aninhados e simplificacao em Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Mantenha o repositório higienizado sem cometer arquivos binários .class compilados.'
    }
  ];

  const current = steps[stage];

  return <section className="nes36-terminal-flow">
    <div className="bool27-delivery-flow">
      <nav className="nes36-delivery-flow nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="nes36-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="nes36-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file nes36-code" style={{ marginTop: '14px' }}>
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
  if (block.type === 'flatten_indent') return <AchatadorEscadaLab />;
  if (block.type === 'validation_mode') return <ValidadorErrosIndependentesLab />;
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
    id: 'escada',
    eyebrow: 'Refatorador',
    label: 'Aplanar Código',
    title: 'Achatando o anti-pattern do código escada',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Clique no botão abaixo para achatar visualmente a indentação de múltiplos ifs aninhados empurrados para a direita, tornando o código linear:' },
      { type: 'flatten_indent' }
    ]
  },
  {
    id: 'validacoes',
    eyebrow: 'Múltiplos Erros',
    label: 'Erros Independentes',
    title: 'Acumuladores lógicos vs desvios excludentes',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Preencha dados inválidos nos inputs e compare os dois modos de exibição de erros (paralelo com if separado vs excludente com else if):' },
      { type: 'validation_mode' }
    ]
  },
  {
    id: 'exemplos',
    eyebrow: 'Aplicações',
    label: 'Casos Corporativos',
    title: 'Autorizações de perfis, bloqueio de pedidos e OS',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Estude as soluções e as comparações estruturais entre os códigos aninhados e simplificados de OS, pedidos e cadastros de fornecedores:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Depurando excesso de indentação e perigos de curto-circuito',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Depure as 10 falhas lógicas e de compilação clássicas ocorridas no aninhamento de ifs do Java:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega',
    label: 'Entrega do Lab',
    title: 'PowerShell, javac em lote e Git limpo',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Abra seu terminal local, estruture a pasta da aula, compile as 15 classes Java de tomada de decisão e realize o commit:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio Prático de Transferência: Validador de Fornecedor de Cadeia Fria',
        text: 'Crie o arquivo ValidadorFornecedorCadeiaFria.java em labs/m1/aula-036-ifs-aninhados-simplificacao/. Pergunte e leia do console utilizando o Scanner: se o fornecedor está ativo no cadastro geral (boolean), se possui pendência financeira crítica (boolean), a temperatura máxima suportada pela câmara frigorífica em Celsius (double) e a quantidade de certificações de qualidade ISO ativas (int). Crie um acumulador booleano possuiErro inicializado com false. Valide de forma linear através de ifs separados e independentes acumulando falhas: se inativo, imprima "Erro: Fornecedor inativo" e marque possuiErro = true; se possui pendência, imprima "Erro: Pendência financeira ativa" e marque possuiErro = true; se temperatura > -18.0, imprima "Erro: Temperatura insatisfatória" e marque possuiErro = true; se certificações ISO < 2, imprima "Erro: Certificações ISO insuficientes" e marque possuiErro = true. Se !possuiErro, imprima "Fornecedor HOMOLOGADO". Evite qualquer tipo de if aninhado.',
        acceptance: [
          'Instanciação correta de Scanner associado a System.in com Locale padrão Locale.US.',
          'Inicialização obrigatória do acumulador booleano de falhas possuiErro com false.',
          'Uso exclusivo de ifs independentes para a varredura paralela completa dos erros.',
          'Ausência absoluta de estruturas condicionais aninhadas (ifs dentro de ifs).',
          'Compilação, execução e commit Git limpo sem commitar arquivos .class binários.'
        ]
      }
    ]
  }
];

export default function GuidedNestedIfsSimplificationLesson036({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-nested-ifs-simplification-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Refatorador Lógico</span>
        <p className="guided-sequence">036 · M1.16</p>
        <h1>Ifs Aninhados e Simplificação</h1>
        <p>Aprenda a aplanar a indentação e evitar o "código escada" no Java. Domine a simplificação condicional por &&, crie booleanos locais autoexplicativos e estruture validações paralelas seguras.</p>
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

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'código escada', label: 'aninhamento excessivo' }, { value: 'ifs paralelos', label: 'validações independentes' }, { value: 'guard clauses', label: 'mentalidade de proteção' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 036">
        <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prãtico</div>
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
              <h3>Simplificação condicional e refatoração dominadas!</h3>
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
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 035</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Refatoração condicional aplanada' : allStepsComplete ? 'Use o botão acima' : 'Pratique aplanar escadas e validações independentes'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir Switch Tradicional'}>Aula 037 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
