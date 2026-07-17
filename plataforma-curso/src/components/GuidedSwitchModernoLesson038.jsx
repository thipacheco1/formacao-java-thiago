import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2,
  ChevronRight, Clock3, Copy, FileCode2, Lightbulb, ListChecks, RotateCcw,
  Search, Sparkles, Terminal, Variable, Wrench, Zap
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedSwitchModernoLesson.css';

const STORAGE_KEY = 'guided-switch-moderno-lesson-038-progress';

const EVIDENCE = [
  '# Aula 038 — Switch Moderno e Expressões', '',
  '## Statement vs Expression', '- [ ] Expliquei a diferença entre switch statement e switch expression', '- [ ] Identifiquei o ponto e vírgula obrigatório na atribuição de switch expression', '',
  '## Arrow Syntax e Retorno de Valor', '- [ ] Escrevi um switch moderno com seta (`->`) retornando String', '- [ ] Escrevi um switch moderno retornando int (ex: SLA em horas)', '- [ ] Agrupei valores no mesmo case com vírgula (`case "A", "B" ->`)', '',
  '## Yield', '- [ ] Usei yield corretamente em case com bloco `{ }`', '- [ ] Expliquei a diferença entre yield (entrega valor ao switch) e return (sai do método)', '',
  '## Domínios Corporativos', '- [ ] Modelei pedido, OS, auditoria e mensageria com switch moderno', '- [ ] Modelei perfil com agrupamento de valores (`case "ADMIN", "SUPERVISOR"`)', '- [ ] Padronizei String de entrada com trim().toUpperCase() antes do switch', '- [ ] Validei null antes do switch expression com String', '',
  '## Evidências locais', '- [ ] Criei, compilei e executei os 14 arquivos Java', '- [ ] Observei o erro de compilação de bloco sem yield (SwitchModernoSemYield.java)', '- [ ] Mantive o histórico Git livre de arquivos .class',
  '',
  '## Decisão de Projeto', '- Quando prefiro switch expression sobre switch statement:', '- Por que yield e não return dentro de um case com bloco:'
].join('\n');

const STATUS_OPTIONS = [
  { value: 'PENDENTE', label: '📋 PENDENTE', output: 'Pedido aguardando análise' },
  { value: 'APROVADO', label: '✅ APROVADO', output: 'Pedido aprovado para processamento' },
  { value: 'RECUSADO', label: '❌ RECUSADO', output: 'Pedido recusado' },
  { value: 'CANCELADO', label: '🚫 CANCELADO', output: 'Pedido cancelado' },
  { value: 'OUTRO', label: '❓ DESCONHECIDO', output: 'Status desconhecido' }
];

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'SLA por Prioridade', file: 'SwitchModernoSla.java', type: 'int',
    code: "public class SwitchModernoSla {\n    public static void main(String[] args) {\n        char prioridade = 'A';\n\n        int prazoHoras = switch (prioridade) {\n            case 'A' -> 4;\n            case 'B' -> 24;\n            case 'C' -> 72;\n            default -> 168;\n        };\n\n        System.out.println(\"Prazo em horas: \" + prazoHoras);\n    }\n}",
    output: 'Prazo em horas: 4',
    insight: 'Aqui o switch expression retorna um int. O resultado é diretamente atribuível e pode ser usado em cálculos. Isso elimina a necessidade de variáveis intermediárias com if/else if.'
  },
  {
    id: 1, label: 'Pedido (String)', file: 'SwitchModernoPedido.java', type: 'String',
    code: 'public class SwitchModernoPedido {\n    public static void main(String[] args) {\n        String statusPedido = "APROVADO";\n\n        String mensagem = switch (statusPedido) {\n            case "PENDENTE" -> "Pedido aguardando análise";\n            case "APROVADO" -> "Pedido aprovado para processamento";\n            case "RECUSADO" -> "Pedido recusado";\n            case "CANCELADO" -> "Pedido cancelado";\n            default -> "Status do pedido desconhecido";\n        };\n\n        System.out.println(mensagem);\n    }\n}',
    output: 'Pedido aprovado para processamento',
    insight: 'Switch expression com String é o caso mais comum em sistemas corporativos. O `;` depois de `}` é obrigatório porque é uma atribuição, não apenas um comando.'
  },
  {
    id: 2, label: 'Perfil (Agrupamento)', file: 'SwitchModernoPerfil.java', type: 'String',
    code: 'public class SwitchModernoPerfil {\n    public static void main(String[] args) {\n        String perfil = "SUPERVISOR";\n\n        String permissao = switch (perfil) {\n            case "ADMIN", "SUPERVISOR" -> "Pode aprovar transações";\n            case "OPERADOR" -> "Pode consultar dados";\n            case "CLIENTE" -> "Pode acompanhar solicitações";\n            default -> "Perfil desconhecido";\n        };\n\n        System.out.println(permissao);\n    }\n}',
    output: 'Pode aprovar transações',
    insight: 'O agrupamento com vírgula (`case "ADMIN", "SUPERVISOR"`) é a versão moderna e explícita do fall-through intencional. Muito mais legível do que empilhar cases sem break.'
  },
  {
    id: 3, label: 'OS (String)', file: 'SwitchModernoOrdemServico.java', type: 'String',
    code: 'public class SwitchModernoOrdemServico {\n    public static void main(String[] args) {\n        String statusOS = "ABERTA";\n\n        String descricao = switch (statusOS) {\n            case "ABERTA" -> "OS aberta para atendimento";\n            case "AGENDADA" -> "OS aguardando execução";\n            case "CONCLUIDA" -> "OS concluída";\n            case "CANCELADA" -> "OS cancelada";\n            default -> "Status da OS desconhecido";\n        };\n\n        System.out.println(descricao);\n    }\n}',
    output: 'OS aberta para atendimento',
    insight: 'Compare com a versão da Aula 037: aqui eliminamos o break e tornamos o switch uma expressão que retorna valor diretamente, sem variável intermediária invisível.'
  },
  {
    id: 4, label: 'Yield com Bloco', file: 'SwitchModernoYieldPedido.java', type: 'String',
    code: 'public class SwitchModernoYieldPedido {\n    public static void main(String[] args) {\n        String statusPedido = "APROVADO";\n        long valorTotalCentavos = 15000L;\n\n        String mensagem = switch (statusPedido) {\n            case "APROVADO" -> {\n                boolean valorValido = valorTotalCentavos > 0;\n                if (valorValido) {\n                    yield "Pedido aprovado com valor válido";\n                }\n                yield "Pedido aprovado, mas valor inválido";\n            }\n            case "PENDENTE" -> "Pedido aguardando análise";\n            case "RECUSADO" -> "Pedido recusado";\n            default -> "Status desconhecido";\n        };\n\n        System.out.println(mensagem);\n    }\n}',
    output: 'Pedido aprovado com valor válido',
    insight: 'Quando um case precisa de mais de uma linha de lógica, usamos um bloco `{ }` e yield para entregar o valor de retorno. yield != return: yield entrega para o switch, return sai do método.'
  },
  {
    id: 5, label: 'Mensageria (String)', file: 'SwitchModernoMensageria.java', type: 'String',
    code: 'public class SwitchModernoMensageria {\n    public static void main(String[] args) {\n        String tipoMensagem = "ENTREGA";\n\n        String acao = switch (tipoMensagem) {\n            case "BOAS_VINDAS" -> "Enviar mensagem de boas-vindas";\n            case "ENTREGA" -> "Enviar confirmação de entrega";\n            case "NPS" -> "Enviar pesquisa NPS";\n            case "ERRO" -> "Registrar erro de mensageria";\n            default -> "Tipo de mensagem desconhecido";\n        };\n\n        System.out.println(acao);\n    }\n}',
    output: 'Enviar confirmação de entrega',
    insight: 'Roteadores de eventos de mensageria são um dos usos mais frequentes de switch expression em microsserviços. A seta torna a tabela de mapeamento extremamente legível.'
  },
  {
    id: 6, label: 'Null + Guard', file: 'SwitchModernoNull.java', type: 'String',
    code: 'public class SwitchModernoNull {\n    public static void main(String[] args) {\n        String status = null;\n\n        String mensagem;\n        if (status == null) {\n            mensagem = "Status não informado";\n        } else {\n            mensagem = switch (status) {\n                case "PENDENTE" -> "Pendente";\n                case "APROVADO" -> "Aprovado";\n                default -> "Desconhecido";\n            };\n        }\n\n        System.out.println(mensagem);\n    }\n}',
    output: 'Status não informado',
    insight: 'O default NÃO protege contra null no switch com String. Se status for null, o Java lança NullPointerException antes de avaliar qualquer case. Sempre valide null antes com if.'
  }
];

const ERRORS = [
  { title: 'Esquecer o ponto e vírgula final', code: 'String acao = switch (opcao) {\n    case 1 -> "Cadastrar";\n    default -> "Inválida";\n}', symptom: 'Erro de compilação: esperado ";" após o fechamento de bloco de switch expression.', cause: 'Switch expression é uma expressão dentro de uma atribuição. A instrução completa precisa de ";".', fix: 'Adicione ; depois do }:\nString acao = switch (opcao) { ... };' },
  { title: 'Bloco sem yield em switch expression', code: 'String msg = switch (status) {\n    case "APROVADO" -> {\n        String texto = "Aprovado";\n    }\n    default -> "?";\n};', symptom: 'Erro de compilação: missing return value.', cause: 'Quando o case usa bloco {}, precisa usar yield para devolver o valor.', fix: 'case "APROVADO" -> {\n    String texto = "Aprovado";\n    yield texto;\n}' },
  { title: 'Usar break em switch expression com seta', code: 'String acao = switch (opcao) {\n    case 1 -> {\n        break;\n    }\n    default -> "?";\n};', symptom: 'Erro de compilação: break não é permitido neste contexto.', cause: 'Switch expression com seta usa yield para devolver valor, não break.', fix: 'case 1 -> {\n    yield "Cadastrar";\n}' },
  { title: 'Default tratando null automaticamente', code: 'String status = null;\nString msg = switch (status) {\n    default -> "Desconhecido";\n};', symptom: 'NullPointerException em tempo de execução.', cause: 'O Java avalia o valor de status antes dos cases. Se for null, lança NPE antes do default.', fix: 'Valide null antes:\nif (status == null) { ... } else { msg = switch(status) {...}; }' },
  { title: 'Esquecer default com String', code: 'String msg = switch (status) {\n    case "PENDENTE" -> "Pendente";\n    case "APROVADO" -> "Aprovado";\n};', symptom: 'Erro de compilação: switch expression does not cover all possible input values.', cause: 'Com String, qualquer texto pode chegar. Sem default, o compilador não garante cobertura.', fix: 'Adicione:\ndefault -> "Status não mapeado";' },
  { title: 'Condição booleana no case', code: 'case valor >= 0 -> "Positivo";', symptom: 'Erro de compilação imediato.', cause: 'Switch por valor aceita apenas constantes discretas, não expressões booleanas.', fix: 'Substitua por if/else if para regras com relacionais.' },
  { title: 'Misturar estilos sem clareza', code: '// Mistura\ncase 1:\n    System.out.println("...");\n    break;\ncase 2 -> "Consultar";', symptom: 'Erro de compilação: não é possível misturar arrow syntax com a sintaxe de colon no mesmo switch.', cause: 'Cada switch deve usar um único estilo de sintaxe.', fix: 'Escolha um estilo e mantenha consistente no mesmo bloco switch.' },
  { title: 'Case com tipo incompatível', code: 'int opcao = 1;\nString acao = switch (opcao) {\n    case "1" -> "Cadastrar";\n    default -> "?";\n};', symptom: 'Erro de compilação: incompatible types em case.', cause: 'Switch usa int mas o case contém String "1".', fix: 'Use o tipo correto:\ncase 1 -> "Cadastrar";' },
  { title: 'Case grande demais sem delegar', code: 'case "APROVADO" -> {\n    // valida\n    // calcula\n    // atualiza banco\n    // envia mensagem\n    yield "Aprovado";\n}', symptom: 'Código difícil de testar, manter e revisar.', cause: 'Case acumulando múltiplas responsabilidades distintas.', fix: 'Extraia lógica para métodos:\ncase "APROVADO" -> aprovarPedido(pedido);' },
  { title: 'Usar switch quando if é mais claro', code: 'String cat = switch (valor) {\n    // valor entre 0 e 100? switch não compara intervalos\n};', symptom: 'Tentativa de usar case com expressão relacional falha na compilação.', cause: 'Switch por valor não suporta intervalos ou condições compostas.', fix: 'if (valor >= 0 && valor <= 100) { ... }' }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="sw38-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file sw38-code">
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

const TRADITIONAL_CODE = `switch (statusPedido) {
    case "PENDENTE":
        System.out.println(
            "Pedido aguardando análise");
        break;
    case "APROVADO":
        System.out.println(
            "Pedido aprovado");
        break;
    default:
        System.out.println(
            "Status desconhecido");
        break;
}`;

const MODERN_EXPRESSION_CODE = `String mensagem = switch (statusPedido) {
    case "PENDENTE" -> "Pendente";
    case "APROVADO" -> "Aprovado";
    default -> "Desconhecido";
};

System.out.println(mensagem);`;

function ComparatorLab() {
  return (
    <section className="sw38-comparator">
      <div className="sw38-comparator-col">
        <div className="sw38-col-header danger">
          <AlertTriangle size={17} />
          Switch Statement Tradicional — Executa comandos
        </div>
        <CodePanel name="SwitchTradicional.java" code={TRADITIONAL_CODE} lines={false} />
        <div style={{ padding: '10px 12px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', fontSize: '.7rem', lineHeight: 1.5, color: '#9f1239' }}>
          <strong>Atenção:</strong> Requer break em cada case. Não produz um valor — executa ações. Mais verboso para tabelas de mapeamento.
        </div>
      </div>
      <div className="sw38-comparator-col">
        <div className="sw38-col-header safe">
          <Sparkles size={17} />
          Switch Expression Moderno — Produz valor
        </div>
        <CodePanel name="SwitchModerno.java" code={MODERN_EXPRESSION_CODE} lines={false} />
        <div style={{ padding: '10px 12px', background: '#f0fdfa', border: '1px solid #a7f3d0', borderRadius: '10px', fontSize: '.7rem', lineHeight: 1.5, color: '#065f46' }}>
          <strong>Vantagem:</strong> Sem break. O switch produz valor diretamente atribuível. O <code>{`};`}</code> final é obrigatório por ser atribuição.
        </div>
      </div>
    </section>
  );
}

function ExpressionLab() {
  const [selected, setSelected] = useState('APROVADO');
  const item = STATUS_OPTIONS.find(o => o.value === selected) || STATUS_OPTIONS[1];

  return (
    <section className="sw38-expression-lab">
      <div className="sw38-expr-controls">
        <label htmlFor="sw38-status-select">Valor de statusPedido:</label>
        <select id="sw38-status-select" value={selected} onChange={e => setSelected(e.target.value)}>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="sw38-expr-output">
        <CodePanel
          name='String mensagem = switch(statusPedido) { ... };'
          lines={false}
          code={`String mensagem = switch ("${selected}") {\n    case "PENDENTE" -> "Pedido aguardando análise";\n    case "APROVADO" -> "Pedido aprovado para processamento";\n    case "RECUSADO" -> "Pedido recusado";\n    case "CANCELADO" -> "Pedido cancelado";\n    default -> "Status desconhecido";\n};\n// → mensagem = "${item.output}"`}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="sw38-var-box">
            <small>Variável mensagem</small>
            <div className="sw38-var-value">"{item.output}"</div>
          </div>
          <div className="sw38-console">
            <header><Terminal size={13} /> Console</header>
            <pre>{item.output}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}

const YIELD_SIMPLE = `// Caso simples: retorno direto
String mensagem = switch (status) {
    case "APROVADO" -> "Pedido aprovado";
    default -> "Desconhecido";
};`;

const YIELD_BLOCK_OK = `// Caso com bloco: yield obrigatório
String mensagem = switch (status) {
    case "APROVADO" -> {
        String texto = "Pedido aprovado";
        yield texto; // entrega o valor
    }
    default -> "Desconhecido";
};`;

const YIELD_BLOCK_WRONG = `// Erro: bloco sem yield
String mensagem = switch (status) {
    case "APROVADO" -> {
        String texto = "Pedido aprovado";
        // sem yield = erro de compilação!
    }
    default -> "Desconhecido";
};`;

function YieldDemoLab() {
  return (
    <section className="sw38-yield-demo">
      <div className="sw38-yield-card">
        <span className="sw38-yield-badge simple">✓ Simples: sem yield</span>
        <CodePanel name="Retorno direto" code={YIELD_SIMPLE} lines={false} />
        <div style={{ padding: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', fontSize: '.68rem', lineHeight: 1.5 }}>
          Case simples: apenas escreva o valor após a seta. Sem bloco, sem yield.
        </div>
      </div>
      <div className="sw38-yield-card">
        <span className="sw38-yield-badge block">✓ Bloco: yield necessário</span>
        <CodePanel name="Bloco com yield" code={YIELD_BLOCK_OK} lines={false} />
        <div style={{ padding: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', fontSize: '.68rem', lineHeight: 1.5 }}>
          <strong>yield</strong> entrega o valor para o switch. Diferente de <strong>return</strong>, que sai do método inteiro.
        </div>
      </div>
      <div className="sw38-yield-card">
        <span className="sw38-yield-badge wrong">✗ Bloco sem yield: erro</span>
        <CodePanel name="Erro de compilação" code={YIELD_BLOCK_WRONG} lines={false} />
        <div style={{ padding: '10px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', fontSize: '.68rem', lineHeight: 1.5 }}>
          Bloco sem yield = erro de compilação. O compilador sabe que o switch expression precisa retornar um valor, mas o bloco não o fornece.
        </div>
      </div>
    </section>
  );
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return (
    <section className="sw38-domains-gallery">
      <div className="sw38-domains-sidebar">
        {DOMAIN_PROGRAMS.map((entry, index) => (
          <button key={entry.id} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
            {entry.label}
          </button>
        ))}
      </div>
      <div className="sw38-domains-content">
        <CodePanel name={item.file} code={item.code} />
        <div className="sw38-console-full">
          <header><Terminal size={15} /> Console — retorno de {item.type}</header>
          <pre>{item.output}</pre>
          <p><Sparkles size={16} /><span>{item.insight}</span></p>
        </div>
      </div>
    </section>
  );
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="sw38-errors-clinic">
      <nav className="sw38-errors-nav">
        {ERRORS.map((entry, index) => (
          <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
            <span>{index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="sw38-error-card">
        <header>
          <AlertTriangle size={20} />
          <div>
            <small>Caso {selected + 1} de {ERRORS.length}</small>
            <h3>{item.title}</h3>
          </div>
        </header>
        <CodePanel name="Código com problema" code={item.code} />
        <section style={{ margin: '12px 0' }}>
          <small style={{ display: 'block', marginBottom: '4px', fontSize: '.65rem', color: '#475569', fontWeight: 'bold' }}>Sintoma</small>
          <code style={{ display: 'block', padding: '10px', color: '#fecdd3', background: '#0f172a', borderRadius: '8px', fontSize: '.7rem', fontFamily: 'Consolas, monospace' }}>{item.symptom}</code>
        </section>
        <div className="sw38-error-flow">
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
    </section>
  );
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Estruturar Diretório',
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-038-switch-moderno\ncd labs\\m1\\aula-038-switch-moderno\nNew-Item Main.java, SwitchModernoStatement.java, SwitchModernoPedido.java, SwitchModernoOrdemServico.java, SwitchModernoOperacaoAuditoria.java, SwitchModernoMensageria.java, SwitchModernoPerfil.java, SwitchModernoPrioridade.java, SwitchModernoSla.java, SwitchModernoYieldPedido.java, SwitchModernoStatusConsole.java, SwitchModernoMenuConsole.java, SwitchModernoNull.java, SwitchModernoSemYield.java',
      out: 'Catorze arquivos Java criados na estrutura do repositório.',
      tip: 'Copie os códigos da galeria de domínios para cada arquivo correspondente.'
    },
    {
      title: 'Compilar e Quebrar',
      cmd: 'javac *.java\njavac SwitchModernoSemYield.java',
      out: 'SwitchModernoSemYield.java:7: error: missing return value',
      tip: 'A compilação do SwitchModernoSemYield.java deve falhar com erro de bloco sem yield. Esse erro é intencional e educativo. Depois corrija adicionando yield.'
    },
    {
      title: 'Testar SLA e Yield',
      cmd: 'java SwitchModernoSla\njava SwitchModernoYieldPedido\njava SwitchModernoNull',
      out: 'Prazo em horas: 4\nPedido aprovado com valor válido\nStatus não informado',
      tip: 'Observe o switch retornando int, yield em bloco com lógica interna, e a proteção contra null antes do switch.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit add labs/m1/aula-038-switch-moderno docs/diario-de-bordo.md\ngit commit -m "Aula 038: pratica switch moderno e expressoes"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Confirme que nenhum arquivo .class foi commitado. Se necessário, atualize o .gitignore com *.class.'
    }
  ];
  const current = steps[stage];
  return (
    <section>
      <div className="sw38-delivery-nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={stage === index ? 'active' : ''} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </div>
      <div className="sw38-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="sw38-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
      <div className="guided-file sw38-code" style={{ marginTop: '14px' }}>
        <div className="guided-file-title">
          <BookOpenCheck size={16} /> docs/diario-de-bordo.md
          <CopyButton value={EVIDENCE} label="Copiar evidências" />
        </div>
        <SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>
          {EVIDENCE}
        </SyntaxHighlighter>
      </div>
    </section>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'comparator') return <ComparatorLab />;
  if (block.type === 'expression_lab') return <ExpressionLab />;
  if (block.type === 'yield_demo') return <YieldDemoLab />;
  if (block.type === 'domains_gallery') return <DomainsGalleryLab />;
  if (block.type === 'errors_clinic') return <ErrorsClinicLab />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') {
    return (
      <section className="guided-challenge">
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div>
        <p>{block.text}</p>
        <h4>Critérios de aceite</h4>
        <ul>{block.acceptance.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
      </section>
    );
  }
  return null;
}

const steps = [
  {
    id: 'comparador',
    eyebrow: 'A Grande Mudança',
    label: 'Statement vs Expression',
    title: 'Do "executa ação" ao "produz valor"',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Veja lado a lado a diferença fundamental entre o switch tradicional que executa comandos e o switch moderno que produz um valor atribuível:' },
      { type: 'comparator' }
    ]
  },
  {
    id: 'expressao',
    eyebrow: 'Switch Expression',
    label: 'Simulador de Valor',
    title: 'Vendo a variável ser preenchida pelo resultado do switch',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Selecione o status do pedido e observe o switch expression retornando um valor que é diretamente atribuído à variável:' },
      { type: 'expression_lab' },
      { type: 'note', tone: 'info', title: 'Ponto e vírgula final', text: 'O "; depois do fechamento de bloco é obrigatório porque String mensagem = switch(...) {...}; é uma atribuição, não apenas um comando. O compilador rejeitará sem ele.' }
    ]
  },
  {
    id: 'yield',
    eyebrow: 'Retorno em Blocos',
    label: 'Yield — Bloco com Valor',
    title: 'Quando o case precisa de mais de uma linha',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Compare os três cenários: retorno simples, bloco correto com yield, e bloco incorreto sem yield:' },
      { type: 'yield_demo' },
      { type: 'note', tone: 'warning', title: 'yield ≠ return', text: 'yield entrega o valor para o switch expression e não sai do método. return sai do método inteiro. Nunca use return dentro de um case para tentar retornar do switch.' }
    ]
  },
  {
    id: 'dominios',
    eyebrow: 'Casos Corporativos',
    label: 'Galeria de Domínios',
    title: 'SLA, pedido, perfil, OS, mensageria e null',
    duration: '7 min',
    blocks: [
      { type: 'lead', text: 'Explore os sete programas corporativos navegando pelos domínios abaixo:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Os 10 erros mais comuns do switch moderno',
    duration: '7 min',
    blocks: [
      { type: 'lead', text: 'Diagnostique e corrija os erros clássicos — do ponto e vírgula esquecido ao bloco sem yield:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega',
    label: 'Entrega do Lab',
    title: 'PowerShell, javac, erro intencional de yield e commit',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Monte a pasta local, compile os 14 arquivos (incluindo o que vai quebrar de propósito) e faça o commit:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio: Calculador de Desconto por Categoria',
        text: 'Crie DescontoCategoria.java em labs/m1/aula-038-switch-moderno/. Leia uma categoria de produto via Scanner (String): "ALIMENTICIO", "ELETRONICO", "VESTUARIO", "LIVRO" ou outro valor. Use switch expression para retornar um int representando o percentual de desconto: ALIMENTICIO → 5, ELETRONICO → 10, VESTUARIO → 20, LIVRO → 15, default → 0. Imprima: "Desconto aplicado: X%". Para ELETRONICO, use um bloco com lógica extra: se o desconto for 10, imprima também "Desconto especial de eletrônicos aplicado" via yield dentro do bloco.',
        acceptance: [
          'Switch expression retornando int por categoria.',
          'Ao menos um case "ELETRONICO" com bloco e yield.',
          'Default cobrindo categorias não previstas retornando 0.',
          'Normalização da entrada com trim().toUpperCase() antes do switch.',
          'Compilação limpa e commit Git sem arquivos .class.'
        ]
      }
    ]
  }
];

export default function GuidedSwitchModernoLesson038({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch { return new Set(); }
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds]));
  }, [completedStepIds]);

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
    setCompletedStepIds(previous => {
      const next = new Set(previous);
      if (next.has(activeStep.id)) next.delete(activeStep.id);
      else next.add(activeStep.id);
      return next;
    });
  };

  return (
    <article className="guided-git-lesson guided-switch-moderno-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Variable size={17} /> Switch Expression</span>
          <p className="guided-sequence">038 · M1.18</p>
          <h1>Switch Moderno e Expressões</h1>
          <p>Domine a arrow syntax, o switch expression que retorna valor, o yield em blocos, o agrupamento de cases com vírgula e os 7 domínios corporativos onde o switch moderno brilha.</p>
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
        { value: '->', label: 'arrow syntax' },
        { value: 'yield', label: 'valor em bloco' },
        { value: 'expression', label: 'produz valor' }
      ]} />

      <div className="guided-layout">
        <nav className="guided-step-nav" aria-label="Etapas da aula 038">
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
                <h3>Switch Moderno dominado!</h3>
                <p>{lessonComplete ? 'Expressões, yield e domínios corporativos registrados.' : 'Conclua a aula para consolidar seus conhecimentos.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 037</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Switch expression consolidado' : allStepsComplete ? 'Use o botão acima' : 'Pratique arrow syntax, yield e domínios corporativos'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir While'}>Aula 039 <ArrowRight size={17} /></button>
      </footer>
    </article>
  );
}
