import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2,
  ChevronRight, Clock3, Copy, FileCode2,
  Lightbulb, ListChecks, RotateCcw, Search,
  Sparkles, Terminal, Variable, Wrench, Zap
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedSwitchTradicionalLesson.css';

const STORAGE_KEY = 'guided-switch-tradicional-lesson-037-progress';

const EVIDENCE = [
  '# Aula 037 — Switch Tradicional', '',
  '## Estrutura do Switch', '- [ ] Criei um switch com case, break e default', '- [ ] Usei switch com int para menu numérico', '- [ ] Usei switch com String para status corporativo', '- [ ] Usei switch com char para prioridade por código', '',
  '## Fall-Through', '- [ ] Expliquei o que é fall-through acidental', '- [ ] Corrigi fall-through adicionando break em cada case', '- [ ] Usei fall-through intencional para agrupamento de cases', '',
  '## Casos Corporativos', '- [ ] Modelei pedido, OS, auditoria e mensageria com switch', '- [ ] Padronizei String de entrada com trim().toUpperCase() antes do switch', '- [ ] Validei null antes de entrar no switch com String', '',
  '## Evidências locais', '- [ ] Criei, compilei e executei as 16 classes locais', '- [ ] Observei fall-through no debugger por Step Over', '- [ ] Mantive o histórico Git livre de arquivos .class',
  '',
  '## Decisão de Projeto', '- Por que o switch tradicional exige break em cada case:', '- Quando prefiro switch em vez de if/else if:'
].join('\n');

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'Pedido (String)', file: 'SwitchPedido.java',
    code: 'public class SwitchPedido {\n    public static void main(String[] args) {\n        String statusPedido = "PENDENTE";\n\n        switch (statusPedido) {\n            case "PENDENTE":\n                System.out.println("Pedido aguardando análise");\n                break;\n            case "APROVADO":\n                System.out.println("Pedido aprovado para processamento");\n                break;\n            case "RECUSADO":\n                System.out.println("Pedido recusado");\n                break;\n            case "CANCELADO":\n                System.out.println("Pedido cancelado");\n                break;\n            default:\n                System.out.println("Status do pedido desconhecido");\n                break;\n        }\n    }\n}',
    output: 'Pedido aguardando análise',
    insight: 'switch com String funciona a partir do Java 7. Para cada String, o Java compara usando equals() internamente, evitando o risco de == que vimos nos operadores relacionais.'
  },
  {
    id: 1, label: 'OS (String)', file: 'SwitchOrdemServico.java',
    code: 'public class SwitchOrdemServico {\n    public static void main(String[] args) {\n        String statusOS = "ABERTA";\n\n        switch (statusOS) {\n            case "ABERTA":\n                System.out.println("OS aberta para atendimento");\n                break;\n            case "AGENDADA":\n                System.out.println("OS aguardando execução");\n                break;\n            case "CONCLUIDA":\n                System.out.println("OS concluída");\n                break;\n            case "CANCELADA":\n                System.out.println("OS cancelada");\n                break;\n            default:\n                System.out.println("Status da OS desconhecido");\n                break;\n        }\n    }\n}',
    output: 'OS aberta para atendimento',
    insight: 'Sistemas de OS corporativos evoluem esse switch textual para enum com comportamento encapsulado (strategy). O switch é o ponto de partida.'
  },
  {
    id: 2, label: 'Mensageria (String)', file: 'SwitchMensageria.java',
    code: 'public class SwitchMensageria {\n    public static void main(String[] args) {\n        String tipoMensagem = "ENTREGA";\n\n        switch (tipoMensagem) {\n            case "BOAS_VINDAS":\n                System.out.println("Enviar mensagem de boas-vindas");\n                break;\n            case "ENTREGA":\n                System.out.println("Enviar confirmação de entrega");\n                break;\n            case "NPS":\n                System.out.println("Enviar pesquisa NPS");\n                break;\n            case "ERRO":\n                System.out.println("Registrar erro de mensageria");\n                break;\n            default:\n                System.out.println("Tipo de mensagem desconhecido");\n                break;\n        }\n    }\n}',
    output: 'Enviar confirmação de entrega',
    insight: 'Roteadores de mensagens de integração são um dos usos mais frequentes do switch com String em microsserviços Java.'
  },
  {
    id: 3, label: 'Prioridade (char)', file: 'SwitchPrioridadeAtendimento.java',
    code: 'public class SwitchPrioridadeAtendimento {\n    public static void main(String[] args) {\n        char prioridade = \'A\';\n\n        switch (prioridade) {\n            case \'A\':\n                System.out.println("Atendimento crítico");\n                break;\n            case \'B\':\n                System.out.println("Atendimento normal");\n                break;\n            case \'C\':\n                System.out.println("Atendimento baixo");\n                break;\n            default:\n                System.out.println("Prioridade desconhecida");\n                break;\n        }\n    }\n}',
    output: 'Atendimento crítico',
    insight: 'O case de char usa aspas simples (\u0027A\u0027). Usar aspas duplas ("A") geraria um erro de compilação, pois o tipo seria String e não char.'
  },
  {
    id: 4, label: 'Normalização de Entrada', file: 'SwitchStatusConsole.java',
    code: 'import java.util.Scanner;\n\npublic class SwitchStatusConsole {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n\n        System.out.println("Digite o status do pedido:");\n        String statusPedido = scanner.nextLine().trim().toUpperCase();\n\n        switch (statusPedido) {\n            case "PENDENTE":\n                System.out.println("Pedido aguardando análise");\n                break;\n            case "APROVADO":\n                System.out.println("Pedido aprovado");\n                break;\n            default:\n                System.out.println("Status desconhecido");\n                break;\n        }\n\n        scanner.close();\n    }\n}',
    output: 'Pedido aprovado',
    insight: 'trim() remove espaços invisíveis no início e fim. toUpperCase() padroniza a caixa. Sem isso, " aprovado " não casa com case "APROVADO":.'
  }
];

const ERRORS = [
  { title: 'Esquecer o break', code: 'case 1:\n    System.out.println("Cadastrar");\ncase 2:\n    System.out.println("Consultar");', symptom: 'Para opcao=1, imprime "Cadastrar" e "Consultar" simultaneamente.', cause: 'Sem break, o Java continua executando o próximo case (fall-through acidental).', fix: 'Coloque break; ao final de cada case.' },
  { title: 'Achar que default evita fall-through', code: 'case 1:\n    System.out.println("Ação");\ndefault:\n    System.out.println("Inválido");', symptom: 'opcao=1 imprime "Ação" e "Inválido" em sequência.', cause: 'default não funciona como barreira. Apenas break impede a queda de execução.', fix: 'Sempre adicione break; antes do default.' },
  { title: 'Esquecer o default', code: 'switch (opcao) {\n    case 1: ...\n        break;\n}', symptom: 'Valores inesperados passam sem nenhum tratamento visível.', cause: 'Ausência do default como fallback de segurança.', fix: 'Adicione default com log ou exceção para valores não mapeados.' },
  { title: 'Usar switch para intervalos', code: '// Isso não compila:\nswitch (idade) {\n    case >= 18: ...\n}', symptom: 'Erro de compilação ao tentar usar expressões booleanas no case.', cause: 'Switch tradicional aceita apenas valores discretos, não intervalos.', fix: 'Use if/else if para lógica com operadores relacionais e intervalos.' },
  { title: 'String sem padronizar', code: 'String s = scanner.nextLine(); // "aprovado"\nswitch (s) { case "APROVADO": ... }', symptom: 'default é atingido mesmo o usuário digitando "aprovado" corretamente.', cause: 'Comparação case-sensitive: "aprovado" ≠ "APROVADO".', fix: 'Normalize: scanner.nextLine().trim().toUpperCase() antes do switch.' },
  { title: 'Switch com String null', code: 'String status = null;\nswitch (status) { ... }', symptom: 'NullPointerException em tempo de execução, antes de entrar nos cases.', cause: 'O Java avalia a expressão do switch antes dos cases. Se for null, lança NPE.', fix: 'Valide null com if antes do switch: if (status == null) { ... }' },
  { title: 'Responsabilidade demais no case', code: 'case "APROVADO":\n    // valida + calcula + envia + atualiza\n    break;', symptom: 'Case com 30+ linhas de código difícil de testar e manter.', cause: 'Acumular responsabilidades distintas dentro de um único case.', fix: 'Cada case deve ter uma responsabilidade. Delegue lógica a métodos.' },
  { title: 'Duplicar lógica em cases separados', code: 'case "ADMIN":\n    System.out.println("Pode aprovar");\n    break;\ncase "SUPERVISOR":\n    System.out.println("Pode aprovar");\n    break;', symptom: 'Mesma mensagem duplicada em dois cases separados.', cause: 'Não usar fall-through intencional para agrupar cases com comportamento idêntico.', fix: 'Agrupe: case "ADMIN": case "SUPERVISOR": System.out.println("Pode aprovar"); break;' },
  { title: 'Tipo incompatível no case', code: 'int opcao = 1;\nswitch (opcao) {\n    case "1": ...', symptom: 'Erro de compilação: incompatible types.', cause: 'Switch usa int mas o case usa String "1" entre aspas duplas.', fix: 'Use o tipo correto: case 1: para int, case "UM": para String.' },
  { title: 'Condição booleana no case', code: 'switch (idade) {\n    case idade >= 18: ...', symptom: 'Erro de compilação imediato.', cause: 'Case não aceita expressões booleanas. Aceita apenas valores constantes.', fix: 'Substitua o switch por if/else if para lógica com relacionais e booleanos.' }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="sw37-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file sw37-code">
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

const MENU_OPTIONS = [
  { key: 1, label: 'Cadastrar cliente', output: 'Cadastrar cliente' },
  { key: 2, label: 'Consultar cliente', output: 'Consultar cliente' },
  { key: 3, label: 'Atualizar cliente', output: 'Atualizar cliente' },
  { key: 4, label: 'Excluir cliente', output: 'Excluir cliente' },
  { key: 0, label: 'Sair', output: 'Encerrando o sistema...' }
];

function MenuSelectorLab() {
  const [selected, setSelected] = useState(1);
  const item = MENU_OPTIONS.find(o => o.key === selected) || MENU_OPTIONS[0];
  return <section className="sw37-selector">
    <div className="sw37-menu-panel">
      <p style={{ margin: '0 0 8px', fontSize: '.65rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Escolha uma opção do menu:</p>
      {MENU_OPTIONS.map(opt => (
        <div key={opt.key} className={`sw37-menu-option ${selected === opt.key ? 'active' : ''}`} onClick={() => setSelected(opt.key)} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setSelected(opt.key)}>
          <span className="badge">{opt.key}</span>
          <span style={{ fontSize: '.75rem', fontWeight: 'bold' }}>{opt.label}</span>
        </div>
      ))}
    </div>
    <div className="sw37-result-panel">
      <CodePanel
        name="switch (opcao) { ... }"
        lines={false}
        code={`switch (opcao) {\n    case ${item.key}:\n        System.out.println("${item.output}");\n        break;\n    // outros cases...\n    default:\n        System.out.println("Opção inválida");\n        break;\n}`}
      />
      <div className="sw37-result-console">
        <header><Terminal size={14} /> Console de execução</header>
        <pre>{item.output}</pre>
      </div>
    </div>
  </section>;
}

const FT_CASES = [
  { label: 'case 1: System.out.println("Cadastrar");', hasBreakSafe: true },
  { label: 'case 2: System.out.println("Consultar");', hasBreakSafe: true },
  { label: 'case 3: System.out.println("Excluir");', hasBreakSafe: true },
  { label: 'default: System.out.println("Inválido");', hasBreakSafe: true }
];

function FallThroughLab() {
  const [mode, setMode] = useState('danger'); // 'danger' | 'safe'
  const [currentCase, setCurrentCase] = useState(0);
  const [executed, setExecuted] = useState([]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const runSimulation = () => {
    if (running) return;
    setCurrentCase(0);
    setExecuted([]);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    timerRef.current = window.setTimeout(() => {
      setExecuted(prev => [...prev, currentCase]);
      const next = currentCase + 1;
      if (mode === 'safe' || next >= FT_CASES.length) {
        setRunning(false);
        setCurrentCase(-1);
      } else {
        setCurrentCase(next);
      }
    }, 700);
    return () => window.clearTimeout(timerRef.current);
  }, [running, currentCase, mode]);

  const caseClass = (idx) => {
    if (currentCase === idx) return 'sw37-ft-case active';
    if (executed.includes(idx)) return mode === 'safe' && idx === 0 ? 'sw37-ft-case stopped' : 'sw37-ft-case executed';
    return 'sw37-ft-case';
  };

  return <section className="sw37-fallthrough-container">
    <div>
      <p style={{ margin: '0 0 10px', fontSize: '.65rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Simulação de execução (opcao = 1):</p>
      <div className="sw37-ft-cases">
        {FT_CASES.map((c, idx) => (
          <div key={idx} className={caseClass(idx)}>
            {c.label}
            {mode === 'safe' && idx < FT_CASES.length - 1 && <span style={{ color: '#22c55e', fontSize: '.65rem', marginLeft: '8px' }}>↵ break;</span>}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={runSimulation}
        disabled={running}
        style={{ marginTop: '12px', width: '100%', padding: '8px', background: running ? '#64748b' : '#ea580c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '.72rem', cursor: running ? 'not-allowed' : 'pointer' }}
      >
        {running ? 'Simulando...' : '▶ Simular execução'}
      </button>
    </div>

    <div className="sw37-ft-controls">
      <div className="sw37-ft-toggle">
        <button type="button" className={mode === 'danger' ? 'danger' : ''} onClick={() => { setMode('danger'); setExecuted([]); setCurrentCase(0); setRunning(false); }}>
          Sem break (Fall-through)
        </button>
        <button type="button" className={mode === 'safe' ? 'safe' : ''} onClick={() => { setMode('safe'); setExecuted([]); setCurrentCase(0); setRunning(false); }}>
          Com break (Seguro)
        </button>
      </div>

      <div className="sw37-ft-legend">
        <span><i style={{ background: '#78350f', border: '2px solid #f59e0b' }} /> Case em execução</span>
        <span><i style={{ background: '#431407', border: '2px solid #ea580c' }} /> Case executado (fall-through)</span>
        <span><i style={{ background: '#052e16', border: '2px solid #22c55e' }} /> Case parou com break</span>
      </div>

      <div style={{ padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '.7rem', lineHeight: 1.5 }}>
        {mode === 'danger'
          ? <><strong style={{ color: '#be123c' }}>⚠ Fall-through acidental:</strong> Para opcao=1, o Java entra no case 1 e, sem break, cai em todos os cases seguintes imprimindo 4 mensagens.</>
          : <><strong style={{ color: '#15803d' }}>✓ Break correto:</strong> Para opcao=1, o Java entra no case 1, executa e para. Apenas "Cadastrar" é impresso.</>
        }
      </div>
    </div>
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="sw37-domains-gallery">
    <div className="sw37-domains-sidebar">
      {DOMAIN_PROGRAMS.map((entry, index) => (
        <button key={entry.id} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          {entry.label}
        </button>
      ))}
    </div>
    <div className="sw37-domains-content">
      <CodePanel name={item.file} code={item.code} />
      <div className="sw37-console">
        <header><Terminal size={15} /> Console de simulação de execução</header>
        <pre>{item.output}</pre>
        <p><Sparkles size={16} /><span>{item.insight}</span></p>
      </div>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="sw37-errors-clinic">
    <nav className="sw37-errors-nav">
      {ERRORS.map((entry, index) => (
        <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="sw37-error-card">
      <header>
        <AlertTriangle size={20} />
        <div>
          <small>Caso {selected + 1} de {ERRORS.length}</small>
          <h3>{item.title}</h3>
        </div>
      </header>
      <CodePanel name="Código Incorreto" code={item.code} />
      <section style={{ margin: '12px 0' }}>
        <small style={{ display: 'block', marginBottom: '4px', fontSize: '.65rem', color: '#475569', fontWeight: 'bold' }}>Sintoma</small>
        <code style={{ display: 'block', padding: '10px', color: '#fecdd3', background: '#0f172a', borderRadius: '8px', fontSize: '.7rem', fontFamily: 'Consolas, monospace' }}>{item.symptom}</code>
      </section>
      <div className="sw37-error-flow">
        <span>
          <Search size={16} />
          <div><strong>Causa</strong><p>{item.cause}</p></div>
        </span>
        <ChevronRight size={18} />
        <span>
          <Wrench size={16} />
          <div><strong>Correção</strong><p>{item.fix}</p></div>
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
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-037-switch-tradicional\ncd labs\\m1\\aula-037-switch-tradicional\nNew-Item Main.java, MenuSimples.java, MenuConsole.java, SwitchStatusPedido.java, SwitchPrioridade.java, SwitchPedido.java, SwitchOrdemServico.java, SwitchOperacao.java, SwitchMensageria.java, SwitchPrioridadeAtendimento.java, SwitchOcorrencia.java, SwitchStatusConsole.java, MenuOperacoesConsole.java, FallThroughAcidental.java, FallThroughIntencional.java, SwitchNull.java',
      out: 'Dezesseis arquivos Java criados na estrutura do repositório.',
      tip: 'Copie os códigos da galeria e do material de aula para cada arquivo correspondente.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac *.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Se FallThroughAcidental.java compilar com warning de fall-through, isso é esperado e educativo.'
    },
    {
      title: 'Testar Fall-Through',
      cmd: 'java FallThroughAcidental',
      out: 'Cadastrar\nConsultar\nExcluir\nInválido',
      tip: 'Observe todas as 4 linhas sendo impressas para opcao=1. Depois corrija adicionando break e recompile.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit add labs/m1/aula-037-switch-tradicional docs/diario-de-bordo.md\ngit commit -m "Aula 037: pratica switch tradicional em Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Confirme que nenhum arquivo .class foi commitado. Se necessário, atualize o .gitignore.'
    }
  ];

  const current = steps[stage];
  return <section>
    <div className="sw37-delivery-nav">
      {steps.map((entry, index) => (
        <button key={entry.title} type="button" className={stage === index ? 'active' : ''} onClick={() => setStage(index)}>
          <span>{index < stage ? <Check size={12} /> : index + 1}</span>
          {entry.title}
        </button>
      ))}
    </div>
    <div className="sw37-terminal">
      <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
      <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
      <p><Lightbulb size={16} /> {current.tip}</p>
    </div>
    <div className="sw37-delivery-actions">
      <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
      <span>Passo {stage + 1} de {steps.length}</span>
      <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
    </div>
    <div className="guided-file sw37-code" style={{ marginTop: '14px' }}>
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
  if (block.type === 'menu_selector') return <MenuSelectorLab />;
  if (block.type === 'fallthrough') return <FallThroughLab />;
  if (block.type === 'domains_gallery') return <DomainsGalleryLab />;
  if (block.type === 'errors_clinic') return <ErrorsClinicLab />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') {
    return <section className="guided-challenge">
      <div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div>
      <p>{block.text}</p>
      <h4>Critérios de aceite</h4>
      <ul>{block.acceptance.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
    </section>;
  }
  return null;
}

const steps = [
  {
    id: 'menu',
    eyebrow: 'Seleção por Valor',
    label: 'Simulador de Menu',
    title: 'Clicando nas opções e vendo o case selecionado',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Clique nas opções do menu abaixo e observe qual case do switch Java é ativado e qual mensagem aparece no console:' },
      { type: 'menu_selector' }
    ]
  },
  {
    id: 'fallthrough',
    eyebrow: 'Fall-Through',
    label: 'Risco do Fall-Through',
    title: 'Simulando a queda de execução sem o break',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Alterne entre os modos "Sem break" e "Com break" e clique em Simular para ver a diferença de comportamento em tempo de execução:' },
      { type: 'fallthrough' },
      { type: 'note', tone: 'warning', title: 'Fall-Through Intencional', text: 'O fall-through é aceitável quando agrupa cases com comportamento idêntico. Ex: case "ADMIN": case "SUPERVISOR": — ambos caem no mesmo bloco com um único break.' }
    ]
  },
  {
    id: 'dominios',
    eyebrow: 'Aplicações',
    label: 'Casos Corporativos',
    title: 'Status de pedido, OS, mensageria e padronização',
    duration: '7 min',
    blocks: [
      { type: 'lead', text: 'Explore os casos reais corporativos de switch com String e char, incluindo a normalização de entrada via Scanner:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Os 10 erros clássicos do switch tradicional',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Diagnostique e corrija os 10 erros mais comuns cometidos ao usar o switch tradicional no Java:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega',
    label: 'Entrega do Lab',
    title: 'PowerShell, javac e Git histórico limpo',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Monte a pasta local, compile as 16 classes e faça o commit com histórico limpo:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio Prático: Roteador de Eventos de Pagamento',
        text: 'Crie o arquivo RoteadorEventoPagamento.java em labs/m1/aula-037-switch-tradicional/. Leia do console via Scanner um código de evento inteiro: 1 (Pagamento iniciado), 2 (Pagamento aprovado), 3 (Pagamento recusado), 4 (Pagamento estornado), 5 (Pagamento expirado). Use switch com int para rotear. Cada case deve imprimir a mensagem de evento correspondente e obrigatoriamente encerrar com break. Para outros valores, imprima "Código de evento desconhecido" no default. Após o switch, imprima "Processamento concluído." independente do caso.',
        acceptance: [
          'Uso de switch com int lendo a entrada do Scanner.',
          'Cinco cases mapeados (1 a 5) com break em cada um.',
          'Default cobrindo códigos não previstos.',
          'Impressão de "Processamento concluído." após o switch, fora do bloco.',
          'Compilação limpa e commit Git sem arquivos .class.'
        ]
      }
    ]
  }
];

export default function GuidedSwitchTradicionalLesson037({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
      if (next.has(activeStep.id)) next.delete(activeStep.id);
      else next.add(activeStep.id);
      return next;
    });
  };

  return <article className="guided-git-lesson guided-switch-tradicional-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Seleção por Valor</span>
        <p className="guided-sequence">037 · M1.17</p>
        <h1>Switch Tradicional</h1>
        <p>Domine a seleção por valor no Java. Entenda case, break e default, simule o perigoso fall-through acidental e modele menus, status e códigos de eventos corporativos com clareza.</p>
      </div>
      <div className="guided-hero-status">
        <Zap size={42} />
        <strong>{progress}%</strong>
        <span>{completedLabel}</span>
      </div>
      <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
    </header>

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[
      { value: 'case', label: 'valor esperado' },
      { value: 'break', label: 'encerra o case' },
      { value: 'fall-through', label: 'perigo sem break' }
    ]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 037">
        <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
        {steps.map((step, index) => (
          <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}>
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
              <h3>Switch Tradicional dominado!</h3>
              <p>{lessonComplete ? 'Etapas, evidências e conclusão registradas no repositório.' : 'Conclua a aula para consolidar seus conhecimentos.'}</p>
            </div>
            <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
              {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
            </button>
          </section>
        )}
      </main>
    </div>

    <footer className="guided-course-nav">
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 036</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Switch tradicional consolidado' : allStepsComplete ? 'Use o botão acima' : 'Pratique menus, fall-through e status corporativos'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir Switch Moderno'}>Aula 038 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
