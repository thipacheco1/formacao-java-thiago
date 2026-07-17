import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import './guidedBooleanRulesLesson.css';

const STORAGE_KEY = 'guided-boolean-rules-lesson-027-progress';

const NAMING_CASES = [
  { id: 0, question: 'O cliente efetuou o pagamento da fatura?', prefix: ['is', 'has', 'pedido', 'pago'], correct: 'hasFaturaPaga', options: ['isFaturaPago', 'hasFaturaPaga', 'faturaStatusPago'], reason: 'Correto! hasFaturaPaga soa como "possui fatura paga?", permitindo leitura clara como pergunta de sim/não.' },
  { id: 1, question: 'O produto está disponível para entrega?', prefix: ['is', 'has', 'produto', 'disponivel'], correct: 'produtoDisponivel', options: ['produtoDisponivel', 'flagProduto', 'temProdutoDisponivelText'], reason: 'Correto! produtoDisponivel indica sem ruídos a disponibilidade direta do produto.' },
  { id: 2, question: 'O usuário possui a permissão de administrador?', prefix: ['is', 'has', 'user', 'admin'], correct: 'usuarioAdmin', options: ['usuarioAdmin', 'isAdminUser', 'statusAdmin'], reason: 'Correto! usuarioAdmin ou isAdmin expressam o papel de forma direta e concisa.' }
];

const COMPONENT_CASES = [
  { id: 0, label: 'Comparação estoque', code: 'int quantidadeEstoque = 15;\nboolean possuiEstoque = quantidadeEstoque > 0;\nboolean estoqueBaixo = quantidadeEstoque < 5;\n\nSystem.out.println("Possui estoque: " + possuiEstoque);\nSystem.out.println("Estoque baixo: " + estoqueBaixo);', output: 'Possui estoque: true\nEstoque baixo: false', insight: 'O operador > gera um boolean lógico. Não precisamos de ifs para armazenar a condição.' },
  { id: 1, label: 'Regra de Compra do Cliente', code: 'boolean clienteAtivo = true;\nboolean possuiPendenciaFinanceira = false;\nboolean emailValidado = true;\n\nboolean clientePodeComprar = clienteAtivo && !possuiPendenciaFinanceira && emailValidado;\nSystem.out.println("Pode comprar: " + clientePodeComprar);', output: 'Pode comprar: true', insight: 'Combinamos 3 condições com &&. Se qualquer uma for false, o resultado desmorona para false.' },
  { id: 2, label: 'Envio de Pedido', code: 'boolean pedidoPago = true;\nboolean pedidoCancelado = false;\nboolean produtoDisponivel = true;\n\nboolean pedidoPodeSerEnviado = pedidoPago && !pedidoCancelado && produtoDisponivel;\nSystem.out.println("Enviar pedido: " + pedidoPodeSerEnviado);', output: 'Enviar pedido: true', insight: 'O uso da negação !pedidoCancelado permite ler o código como: pago E não cancelado E disponível.' },
  { id: 3, label: 'Autorização com Precedência', code: 'boolean usuarioAdmin = false;\nboolean usuarioSupervisor = true;\nboolean usuarioAtivo = true;\n\nboolean podeAprovarTransacao = usuarioAtivo && (usuarioAdmin || usuarioSupervisor);\nSystem.out.println("Pode aprovar: " + podeAprovarTransacao);', output: 'Pode aprovar: true', insight: 'Os parênteses forçam o OU a ser avaliado antes do E, garantindo consistência lógica.' }
];

const ERRORS = [
  { title: 'Aspas no booleano', code: 'boolean ativo = "true";', symptom: 'incompatible types: String cannot be converted to boolean', cause: 'Colocar aspas transforma a palavra reservada true em um literal String.', fix: 'Remova as aspas duplas: true.' },
  { title: 'Primeira letra maiúscula', code: 'boolean ativo = True;', symptom: 'cannot find symbol: symbol var True', cause: 'Java é sensível a maiúsculas (case-sensitive). True ou False com letra maiúscula são tratados como variáveis inexistentes.', fix: 'Use sempre minúsculas: true ou false.' },
  { title: 'Usar 0 e 1', code: 'boolean ativo = 1;', symptom: 'incompatible types: int cannot be converted to boolean', cause: 'Java é fortemente tipado. Ao contrário de C/C++ ou Javascript, 1 e 0 não são coagidos para boolean.', fix: 'Substitua pelo literal adequado: true.' },
  { title: 'Nomes genéricos', code: 'boolean flag = true;\nboolean status = false;', symptom: 'Dificuldade de leitura e manutenção de regras no futuro', cause: 'flag e status não comunicam o domínio do negócio nem o que está sendo testado.', fix: 'Adote nomes descritivos: clienteAtivo, pedidoPago.' },
  { title: 'Dupla negação', code: 'boolean naoBloqueado = true;\nif (!naoBloqueado) { ... }', symptom: 'Confusão mental na leitura do fluxo lógico', cause: 'Usar prefixos negativos gera dupla negação ao negar a variável, aumentando a taxa de erro.', fix: 'Prefira nomes positivos: usuarioAtivo ou usuarioBloqueado.' },
  { title: 'Confundir = com ==', code: 'boolean resultado = (status = true); // atribuição', symptom: 'Atribui e avalia como true, ignorando teste de igualdade', cause: 'O operador = altera o estado. O operador == compara valores lógicos.', fix: 'Use == para comparação: status == true (ou simplesmente use a variável booleana direta).' },
  { title: 'Regra composta sem parênteses', code: 'boolean pode = ativo && admin || supervisor;', symptom: 'Precedência errada de operadores lógicos', cause: 'O operador && possui precedência automática sobre o ||, avaliando (ativo && admin) primeiro.', fix: 'Adote parênteses explícitos para forçar a precedência desejada.' },
  { title: 'Múltiplos flags booleanos', code: 'boolean aberto = true;\nboolean cancelado = false;\nboolean entregue = false;', symptom: 'Flags concorrentes inconsistentes na mesma entidade', cause: 'Utilizar múltiplos booleanos para estados mutuamente exclusivos de uma entidade.', fix: 'Substitua os flags por uma única String statusPedido ou crie um enum.' },
  { title: 'Comparação redundante', code: 'boolean ativo = true;\nif (ativo == true) { ... }', symptom: 'Poluição visual do código com comparações desnecessárias', cause: 'Comparar uma variável booleana explicitamente com true ou false.', fix: 'Escreva a condição diretamente: if (ativo).' },
  { title: 'Negação confusa de desigualdade', code: 'boolean diferente = !(quantidade == 10);', symptom: 'Complexidade de leitura lógica desnecessária', cause: 'Negar uma comparação de igualdade em vez de usar o operador de desigualdade correto.', fix: 'Use o operador diferente de (!=): quantidade != 10.' }
];

const EVIDENCE = [
  '# Aula 027 — Boolean e Regras de Decisão', '',
  '## Estado lógico e palavras-chave', '- [ ] Entendi que true e false são minúsculos e sem aspas', '- [ ] Constatei que Java não aceita 0 e 1 como booleanos', '- [ ] Pratiquei a nomenclatura de regras que soam como perguntas', '',
  '## Operadores e precedência', '- [ ] Usei o operador ! para inverter valores booleanos', '- [ ] Desenhei e fechei circuitos lógicos com && e ||', '- [ ] Compreendi a importância dos parênteses em regras compostas', '- [ ] Diferenciei atribuição (=) de comparação de igualdade (==)', '',
  '## Evidências locais', '- [ ] Criei e compilei os sete arquivos Java locais', '- [ ] Validei a saída correta de todas as regras no terminal', '',
  '## Decisão de Projeto', '- Regra de negócio modelada no desafio de crédito:', '- Justificativa do uso de parênteses na regra final:'
].join('\n');

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="bool27-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file bool27-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function NamingBuilderLab() {
  const [selectedCase, setSelectedCase] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const item = NAMING_CASES[selectedCase];

  return <section className="bool27-builder-container">
    <div className="bool27-builder-workspace">
      <h3>Construtor de Nomenclatura Profissional</h3>
      <p style={{ fontSize: '.76rem', color: '#5b21b6', lineHeight: 1.5 }}>
        Para cada pergunta de negócio abaixo, escolha a variável booleana que melhor expressa a regra como uma pergunta de sim ou não:
      </p>
      <div style={{ padding: '12px', background: '#fff', borderRadius: '10px', border: '1px solid #ddd6fe', margin: '8px 0' }}>
        <strong style={{ fontSize: '.78rem', color: '#6d28d9' }}>Pergunta: "{item.question}"</strong>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {item.options.map(option => (
          <button
            key={option}
            type="button"
            className="bool27-builder-chip"
            onClick={() => setSelectedAnswer(option)}
            style={{
              borderColor: selectedAnswer === option ? 'var(--bool27-purple)' : '#cbd5e1',
              background: selectedAnswer === option ? 'var(--bool27-purple)' : '#fff',
              color: selectedAnswer === option ? '#fff' : '#475569'
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="bool27-builder-preview">
        <code>boolean {selectedAnswer || '___________'} = true;</code>
      </div>
      {selectedAnswer && (
        <div style={{ fontSize: '.72rem', color: selectedAnswer === item.correct ? '#065f46' : '#991b1b', marginTop: '10px' }}>
          {selectedAnswer === item.correct ? item.reason : 'Tente novamente. Este nome pode ser confuso ou não soar como uma pergunta direta.'}
        </div>
      )}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {NAMING_CASES.map((entry, index) => (
        <button
          key={entry.id}
          type="button"
          onClick={() => { setSelectedCase(index); setSelectedAnswer(null); }}
          style={{
            padding: '12px',
            textAlign: 'left',
            background: selectedCase === index ? '#f5f3ff' : '#fff',
            border: '1px solid',
            borderColor: selectedCase === index ? '#c084fc' : '#cbd5e1',
            borderRadius: '10px',
            cursor: 'pointer',
            color: selectedCase === index ? '#5b21b6' : '#475569'
          }}
        >
          <strong style={{ display: 'block', fontSize: '.74rem' }}>Caso {index + 1}</strong>
          <span style={{ fontSize: '.64rem', opacity: 0.85 }}>{entry.question}</span>
        </button>
      ))}
    </div>
  </section>;
}

function NegationLensLab() {
  const [val, setVal] = useState(true);
  return <section className="bool27-lens-container">
    <div className="bool27-lens-control">
      <h4 style={{ margin: '0 0 10px', color: '#a78bfa', textTransform: 'uppercase', fontSize: '.68rem', letterSpacing: '.06em' }}>Entrada Original</h4>
      <div className={`bool27-lens-circle ${val ? 'true' : 'false'}`}>
        {val ? 'TRUE' : 'FALSE'}
      </div>
      <button type="button" onClick={() => setVal(!val)} style={{ marginTop: '14px', padding: '8px 12px', background: '#3b82f6', color: '#fff', border: 0, borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>
        Inverter Entrada
      </button>
    </div>
    <div className="bool27-lens-control" style={{ background: '#111827', borderColor: '#3b82f6' }}>
      <h4 style={{ margin: '0 0 10px', color: '#38bdf8', textTransform: 'uppercase', fontSize: '.68rem', letterSpacing: '.06em' }}>Saída com Negação Lógica (!)</h4>
      <div className={`bool27-lens-circle ${!val ? 'true' : 'false'}`}>
        {!val ? 'TRUE' : 'FALSE'}
      </div>
      <code style={{ marginTop: '14px', fontFamily: 'Consolas, monospace', fontSize: '.72rem', color: '#93c5fd' }}>
        !({val ? 'true' : 'false'}) = {!val ? 'true' : 'false'}
      </code>
    </div>
  </section>;
}

function LogicCircuitLab() {
  const [circuitType, setCircuitType] = useState('AND');
  const [switchA, setSwitchA] = useState(false);
  const [switchB, setSwitchB] = useState(false);

  const bulbLit = useMemo(() => {
    if (circuitType === 'AND') return switchA && switchB;
    return switchA || switchB;
  }, [circuitType, switchA, switchB]);

  return <section className="bool27-circuit-container">
    <div className="bool27-circuit-board">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Circuito de Tabela-Verdade</h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button type="button" onClick={() => { setCircuitType('AND'); setSwitchA(false); setSwitchB(false); }} style={{ padding: '6px 10px', background: circuitType === 'AND' ? 'var(--bool27-purple)' : '#312e81', color: '#fff', border: 0, borderRadius: '6px', fontSize: '.65rem', fontWeight: 'bold', cursor: 'pointer' }}>E Lógico (&&)</button>
          <button type="button" onClick={() => { setCircuitType('OR'); setSwitchA(false); setSwitchB(false); }} style={{ padding: '6px 10px', background: circuitType === 'OR' ? 'var(--bool27-purple)' : '#312e81', color: '#fff', border: 0, borderRadius: '6px', fontSize: '.65rem', fontWeight: 'bold', cursor: 'pointer' }}>OU Lógico (||)</button>
        </div>
      </div>
      <p style={{ fontSize: '.72rem', color: '#c7d2fe', margin: '4px 0 14px' }}>
        {circuitType === 'AND'
          ? 'Circuito em Série (&&): A eletricidade lógica só flui se AMBOS os disjuntores estiverem fechados (true).'
          : 'Circuito em Paralelo (||): A eletricidade lógica flui se PELO MENOS UM dos disjuntores estiver fechado (true).'}
      </p>
      <div className="bool27-circuit-switches">
        <div className="bool27-switch-wrapper">
          <span>Disjuntor A</span>
          <button type="button" className={`bool27-switch-btn ${switchA ? 'on' : 'off'}`} onClick={() => setSwitchA(!switchA)} aria-label={`Disjuntor A: ${switchA ? 'Ligado' : 'Desligado'}`} />
          <span style={{ fontSize: '.7rem', color: switchA ? '#34d399' : '#f87171' }}>{switchA ? 'TRUE' : 'FALSE'}</span>
        </div>
        <div className="bool27-switch-wrapper">
          <span>Disjuntor B</span>
          <button type="button" className={`bool27-switch-btn ${switchB ? 'on' : 'off'}`} onClick={() => setSwitchB(!switchB)} aria-label={`Disjuntor B: ${switchB ? 'Ligado' : 'Desligado'}`} />
          <span style={{ fontSize: '.7rem', color: switchB ? '#34d399' : '#f87171' }}>{switchB ? 'TRUE' : 'FALSE'}</span>
        </div>
      </div>

      {/* Esquema do Circuito */}
      <div className="bool27-circuit-diagram">
        <div className={`bool27-circuit-wire active`} style={{ width: '40px' }} />
        {circuitType === 'AND' ? (
          <>
            <div className={`bool27-switch-node ${switchA ? 'active' : ''}`}>
              <div className={`bool27-switch-contact ${switchA ? 'closed' : 'open'}`} />
            </div>
            <div className={`bool27-circuit-wire ${switchA ? 'active' : ''}`} style={{ width: '40px' }} />
            <div className={`bool27-switch-node ${switchA && switchB ? 'active' : ''}`}>
              <div className={`bool27-switch-contact ${switchB ? 'closed' : 'open'}`} />
            </div>
            <div className={`bool27-circuit-wire ${switchA && switchB ? 'active' : ''}`} style={{ width: '40px' }} />
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`bool27-switch-node ${switchA ? 'active' : ''}`}>
                <div className={`bool27-switch-contact ${switchA ? 'closed' : 'open'}`} />
              </div>
              <div className={`bool27-circuit-wire ${switchA ? 'active' : ''}`} style={{ width: '40px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className={`bool27-switch-node ${switchB ? 'active' : ''}`}>
                <div className={`bool27-switch-contact ${switchB ? 'closed' : 'open'}`} />
              </div>
              <div className={`bool27-circuit-wire ${switchB ? 'active' : ''}`} style={{ width: '40px' }} />
            </div>
          </div>
        )}
        <div className={`bool27-circuit-wire ${bulbLit ? 'active' : ''}`} style={{ width: '30px' }} />
        <div className="bool27-bulb-container">
          <div className={`bool27-bulb ${bulbLit ? 'lit' : ''}`}>
            <Sparkles size={24} />
          </div>
        </div>
      </div>
      <div style={{ padding: '10px', background: '#312e81', borderRadius: '8px', textAlign: 'center', fontSize: '.75rem', fontFamily: 'Consolas, monospace' }}>
        Resultado lógico da regra: <strong>{bulbLit ? 'TRUE' : 'FALSE'}</strong>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px', background: '#1e1b4b', borderColor: '#4338ca', color: '#e0e7ff' }}>
        <Lightbulb size={22} style={{ color: '#a78bfa' }} />
        <div>
          <strong style={{ color: '#c084fc' }}>Tabelas Lógicas Pragmáticas</strong>
          <p style={{ fontSize: '.7rem', color: '#a5b4fc', lineHeight: 1.45, margin: '4px 0 0' }}>
            O operador && exige aprovação de todas as condições em série. O operador || aceita aprovação em rotas alternativas paralelas. Compreender esse fluxo é o segredo do desenvolvimento de regras de negócio.
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function CompoundBuilderLab() {
  const [useParens, setUseParens] = useState(true);
  return <section className="bool27-compound-builder">
    <div className="bool27-compound-panel">
      <div className="bool27-compound-nav">
        <button type="button" className={!useParens ? 'active' : ''} onClick={() => setUseParens(false)}>Sem Parênteses (Precedência Automática)</button>
        <button type="button" className={useParens ? 'active' : ''} onClick={() => setUseParens(true)}>Com Parênteses (Precedência Controlada)</button>
      </div>
      <div className="bool27-compound-expression">
        <span style={{ fontSize: '.62rem', color: '#94a3b8', textTransform: 'uppercase' }}>Instrução avaliada pelo compilador:</span>
        <code>
          {useParens
            ? 'boolean podeAprovar = ativo && (admin || supervisor);'
            : 'boolean podeAprovar = ativo && admin || supervisor;'}
        </code>
      </div>
      <div style={{ fontSize: '.72rem', lineHeight: 1.5, color: '#e2e8f0', background: '#111827', padding: '12px', borderRadius: '8px', border: '1px solid #1f2937' }}>
        {useParens ? (
          <div>
            <span className="dec26-sorter-badge tolerant" style={{ background: '#d1fae5', color: '#065f46', border: 0, marginBottom: '6px' }}>Regra Consistente</span>
            <p style={{ margin: 0 }}>O Java resolve primeiro o OU <code>(admin || supervisor)</code> resultando em true. Depois, resolve o E com <code>ativo</code>. Se o usuário estiver inativo, a transação é bloqueada com segurança.</p>
          </div>
        ) : (
          <div>
            <span className="dec26-sorter-badge tolerant" style={{ background: '#fee2e2', color: '#991b1b', border: 0, marginBottom: '6px' }}>Brecha de Segurança</span>
            <p style={{ margin: 0 }}>Como o && tem precedência, o compilador avalia primeiro <code>(ativo && admin)</code>. O resultado final se torna <code>false || supervisor</code>. Um supervisor inativo conseguirá aprovar a transação erroneamente!</p>
          </div>
        )}
      </div>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px' }}>
        <Lightbulb size={22} />
        <div>
          <strong>Legibilidade e Precedência</strong>
          <p>
            Parênteses anulam a precedência padrão dos operadores lógicos e explicitam as intenções comerciais de negócio sem forçar outros engenheiros a adivinharem as prioridades de compilação do Java.
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function TriagemModelagemLab() {
  const [step, setStep] = useState(0);
  return <section className="bool27-triagem-game">
    <div className="bool27-triagem-box">
      <div>
        <h4 style={{ margin: '0 0 6px', color: '#312e81', fontSize: '.9rem' }}>Refatoração: Antipadrão de Flags</h4>
        <p style={{ fontSize: '.74rem', lineHeight: 1.5, color: '#3730a3' }}>
          Muitos flags booleanos na mesma entidade criam estados inconsistentes (ex: um pedido estar marcado como aberto E cancelado ao mesmo tempo). Veja a comparação:
        </p>
        <div style={{ display: 'grid', gap: '8px', margin: '14px 0' }}>
          <button type="button" className={`bool27-compound-nav button ${step === 0 ? 'active' : ''}`} onClick={() => setStep(0)} style={{ padding: '10px', textAlign: 'left', background: step === 0 ? '#c7d2fe' : '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '.7rem', color: '#1e1b4b' }}>
            <strong>Opção A: Flags Esparsos (Antipadrão)</strong>
            <pre style={{ margin: '4px 0 0', fontFamily: 'Consolas, monospace', fontSize: '.65rem', color: '#475569' }}>boolean aberto = true;{'\n'}boolean cancelado = true; // Inconsistência física!</pre>
          </button>
          <button type="button" className={`bool27-compound-nav button ${step === 1 ? 'active' : ''}`} onClick={() => setStep(1)} style={{ padding: '10px', textAlign: 'left', background: step === 1 ? '#c7d2fe' : '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontSize: '.7rem', color: '#1e1b4b' }}>
            <strong>Opção B: Status Consolidado (Refatorado)</strong>
            <pre style={{ margin: '4px 0 0', fontFamily: 'Consolas, monospace', fontSize: '.65rem', color: '#475569' }}>String statusPedido = "CANCELADO"; // Estado único e seguro</pre>
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
        <aside className="guided-note info" style={{ margin: 0, padding: '14px', background: '#fff', borderColor: '#c7d2fe', color: '#1e1b4b' }}>
          <Lightbulb size={20} style={{ color: '#4f46e5' }} />
          <div>
            <strong>Status Controlado</strong>
            <p style={{ fontSize: '.66rem', color: '#475569', lineHeight: 1.4, margin: '2px 0 0' }}>
              {step === 0 
                ? 'Evite criar múltiplos flags booleanos para representar etapas de um processo. Isso permite estados mutáveis impossíveis na vida real.'
                : 'Centralizar o fluxo em uma única variável de estado impede inconsistências contábeis e de negócio na aplicação.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = COMPONENT_CASES[selected];
  return <section className="bool27-domains-gallery">
    <div className="bool27-domains-sidebar">
      {COMPONENT_CASES.map((entry, index) => (
        <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.id}>
          {entry.label}
        </button>
      ))}
    </div>
    <div className="bool27-domains-content">
      <CodePanel name={`${item.label.replace(/\s+/g, '')}.java`} code={item.code} />
      <section className="bool27-console">
        <header><Terminal size={15} /> Console de saída esperado</header>
        <pre>{item.output}</pre>
        <p style={{ display: 'flex', gap: '8px', margin: '0', padding: '12px 14px', alignItems: 'flex-start', color: '#94a3b8', background: '#1e293b', borderTop: '1px solid #334155', fontSize: '.72rem', lineHeight: 1.5 }}>
          <Sparkles size={16} style={{ color: '#a78bfa', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="bool27-errors-clinic">
    <nav className="bool27-errors-nav">
      {ERRORS.map((entry, index) => (
        <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.title}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="bool27-error-card">
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
      <div className="bool27-error-flow">
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
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-027-boolean-regras\ncd labs\\m1\\aula-027-boolean-regras\nNew-Item Main.java, ComparacaoBoolean.java, RegraComposta.java, ClienteBoolean.java, PedidoBoolean.java, OrdemServicoBoolean.java, AutorizacaoBoolean.java',
      out: 'Sete arquivos Java criados na estrutura do repositório.',
      tip: 'Abra cada arquivo no IntelliJ e copie os respectivos códigos de negócio, analisando as escolhas semânticas das regras.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac Main.java ComparacaoBoolean.java RegraComposta.java ClienteBoolean.java PedidoBoolean.java OrdemServicoBoolean.java AutorizacaoBoolean.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Verifique se não há mensagens de erro de compilação (cannot find symbol ou incompatible types).'
    },
    {
      title: 'Executar Programas',
      cmd: 'java Main\njava ComparacaoBoolean\njava RegraComposta',
      out: 'Saída exibindo os valores lógicos booleanos correspondentes.',
      tip: 'Verifique com atenção os valores impressos e note como o Java exibe true e false de forma crua.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-027-boolean-regras docs/diario-de-bordo.md\ngit commit -m "Aula 027: pratica boolean e regras de decisao no Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Certifique-se de que os arquivos .class não entraram no commit, garantindo a higiene do seu histórico de modificações.'
    }
  ];

  const current = steps[stage];

  return <section className="bool27-terminal-flow">
    <div className="bool27-delivery-flow">
      <nav>
        {steps.map((entry, index) => (
          <button type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)} key={entry.title}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="bool27-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="bool27-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file bool27-evidence" style={{ marginTop: '14px' }}>
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
  if (block.type === 'naming_builder') return <NamingBuilderLab />;
  if (block.type === 'negation_lens') return <NegationLensLab />;
  if (block.type === 'logic_circuit') return <LogicCircuitLab />;
  if (block.type === 'compound_builder') return <CompoundBuilderLab />;
  if (block.type === 'triagem_game') return <TriagemModelagemLab />;
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
    id: 'tabela',
    eyebrow: 'Conceitos',
    label: 'Mapa de Anatomia',
    title: 'O que é o booleano em Java',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'O booleano representa respostas de verdadeiro ou falso (true/false) no sistema. Pratique a nomenclatura correta montando variáveis que soam como perguntas claras abaixo:' },
      { type: 'naming_builder' }
    ]
  },
  {
    id: 'negacao',
    eyebrow: 'Sintaxe',
    label: 'Negação Lógica',
    title: 'O operador inversor !',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'O operador de exclamação (!) inverte o sinal booleano lógico na CPU. Teste o comportamento do inversor abaixo:' },
      { type: 'negation_lens' }
    ]
  },
  {
    id: 'circuitos',
    eyebrow: 'Simulação',
    label: 'Circuitos Lógicos',
    title: 'Tabela-Verdade de AND (&&) e OR (||)',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Entenda como os operadores compostos se comportam em série (&&) ou em paralelo (||) manipulando disjuntores lógicos e acendendo a lâmpada da regra:' },
      { type: 'logic_circuit' }
    ]
  },
  {
    id: 'precedencia',
    eyebrow: 'Sintaxe',
    label: 'Uso de Parênteses',
    title: 'Controlando a precedência do && sobre o ||',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'O compilador do Java prioriza o E lógico antes do OU lógico. Entenda por que a ausência de parênteses cria brechas de segurança graves em regras de privilégios:' },
      { type: 'compound_builder' }
    ]
  },
  {
    id: 'modelagem',
    eyebrow: 'Engenharia',
    label: 'Boolean vs Enum',
    title: 'Evitando a proliferação de flags esparsos',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Não crie variáveis booleanas separadas para representar o progresso de uma entidade. Descubra a forma segura de refatoração para estado único:' },
      { type: 'triagem_game' }
    ]
  },
  {
    id: 'exemplos',
    eyebrow: 'Aplicações',
    label: 'Casos Práticos',
    title: 'Galeria de regras do backend corporativo',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Veja os códigos reais de validação lógica de clientes, ordens de serviço, pedidos e autorizações no backend Java:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Análise de falhas clássicas de regras lógicas',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Depure erros envolvendo aspas, letras maiúsculas, confusões de atribuição (=) e redundâncias no compilador:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Prática',
    label: 'Entrega do Lab',
    title: 'Estruturação do terminal e diário de bordo',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Crie a estrutura local, compile os arquivos locais com javac e adicione seu progresso com higiene do repositório no Git:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio Prático de Transferência: Análise de Empréstimo',
        text: 'Crie o arquivo AnaliseCreditoBoolean.java em labs/m1/aula-027-boolean-regras/. Declare variáveis para idade do cliente (int), score de crédito (int), renda mensal em centavos (long) e se possui restrição cadastral (boolean). Calcule variáveis intermediárias: maiorDeIdade, scoreAceitavel, rendaMinima e nomeLimpo. Calcule a regra final creditoAprovado: o cliente precisa ser maior de idade, ter nome limpo, e ter score aceitável OU renda mínima. Imprima todos os resultados lógicos.',
        acceptance: [
          'Variáveis intermediárias booleanas criadas e calculadas de forma explícita.',
          'Uso da negação ! para a variável nomeLimpo.',
          'Uso de parênteses corretos para preceder a avaliação do scoreAceitavel || rendaMinima.',
          'O programa deve compilar silenciosamente e rodar no terminal com saídas descritivas.',
          'Histórico de commits limpo e sem arquivos binários compilados .class no Git.'
        ]
      }
    ]
  }
];

export default function GuidedBooleanRulesLesson027({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-boolean-rules-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Oficina de regras lógicas</span>
        <p className="guided-sequence">027 · M1.07</p>
        <h1>Boolean e Regras Verdadeiras/Falsas</h1>
        <p>Aprenda a modelar regras de negócio com verdadeiro e falso, domine circuitos lógicos com && e ||, entenda a precedência por parênteses e depure falhas clássicas.</p>
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

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'boolean', label: 'tipo lógico' }, { value: '&& / || / !', label: 'operadores lógicos' }, { value: '10 casos', label: 'clínica de erros' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 027">
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
              <h3>{lessonComplete ? 'Regras e lógica booleana dominadas!' : 'Oficina concluída'}</h3>
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
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 026</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Regras com discernimento lógico' : allStepsComplete ? 'Use o botão acima' : 'Estude os circuitos lógicos e parênteses'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir char e strings'}>Aula 028 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
