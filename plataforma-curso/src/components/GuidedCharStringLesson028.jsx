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
import './guidedCharStringLesson.css';

const STORAGE_KEY = 'guided-char-string-lesson-028-progress';

const QUOTES_CASES = [
  { id: 0, input: "'A'", type: 'char', ok: true, text: 'Válido! Aspas simples contendo um único caractere é interpretado corretamente como tipo primitivo char de 16 bits (Unicode).', badge: 'char' },
  { id: 1, input: '"A"', type: 'String', ok: true, text: 'Válido! Aspas duplas representam objetos da classe String, mesmo contendo apenas um caractere.', badge: 'string' },
  { id: 2, input: "'SP'", type: 'Erro', ok: false, text: 'Erro sintático! Aspas simples em Java são exclusivas para char primitivo de caractere único. SP contém dois caracteres.', badge: 'error', errorMsg: 'unclosed character literal / empty character literal' },
  { id: 3, input: '"SP"', type: 'String', ok: true, text: 'Válido! Aspas duplas contendo múltiplos caracteres criam uma String perfeitamente.', badge: 'string' },
  { id: 4, input: "'Ana'", type: 'Erro', ok: false, text: 'Erro sintático! Não é possível colocar uma cadeia de caracteres (texto) sob aspas simples em Java.', badge: 'error', errorMsg: 'unclosed character literal' }
];

const MODELING_QUIZ = [
  {
    id: 0,
    field: 'CEP do endereço de entrega',
    options: ['int/long', 'String'],
    correct: 'String',
    reason: 'Correto! CEPs podem iniciar com zero (ex: "06454000"). Se modelado como int, o Java trunca para 6454000, corrompendo a busca postal. CEP também não é usado em cálculos matemáticos.'
  },
  {
    id: 1,
    field: 'Quantidade de itens no carrinho',
    options: ['int/long', 'String'],
    correct: 'int/long',
    reason: 'Correto! A quantidade é uma contagem aritmética direta na qual faremos somas, subtrações e multiplicações de estoque.'
  },
  {
    id: 2,
    field: 'CPF do cliente',
    options: ['int/long', 'String'],
    correct: 'String',
    reason: 'Correto! CPF é um identificador textual. Tratar como número causa perda de zeros à esquerda e dificulta a aplicação de máscaras (ex: 123.456.789-00).'
  },
  {
    id: 3,
    field: 'Renda mensal declarada',
    options: ['int/long', 'String'],
    correct: 'int/long',
    reason: 'Correto! Renda mensal é um valor financeiro que sofrerá juros, taxas ou cálculos tributários. (Nesse caso, guardado em centavos via long).'
  },
  {
    id: 4,
    field: 'Código de barras de produto',
    options: ['int/long', 'String'],
    correct: 'String',
    reason: 'Correto! EAN/GTIN frequentemente possuem zeros à esquerda ou letras. Trata-se de identificação de catálogo de backend.'
  }
];

const CONCAT_CASES = [
  {
    label: 'Sem Parênteses (Precedência)',
    code: 'int x = 10;\nint y = 20;\nSystem.out.println("Soma: " + x + y);',
    output: 'Soma: 1020',
    desc: 'Armadilha! Como a operação inicia com String, o Java lê o sinal de + sequencialmente como concatenação textual, promovendo x e y para texto. O resultado é a junção crua de "10" e "20".'
  },
  {
    label: 'Com Parênteses',
    code: 'int x = 10;\nint y = 20;\nSystem.out.println("Soma: " + (x + y));',
    output: 'Soma: 30',
    desc: 'Correto! Os parênteses isolam a expressão aritmética (x + y), forçando a CPU a somar os valores inteiros primeiro (30) antes de realizar a concatenação final.'
  }
];

const ESCAPE_CASES = [
  {
    label: 'Aspas Internas (\\")',
    code: 'String s = "Mensagem: \\"pedido urgente\\"";\nSystem.out.println(s);',
    output: 'Mensagem: "pedido urgente"',
    desc: 'A barra invertida sinaliza que as aspas internas não fecham a String literal, mas são caracteres textuais reais na saída.'
  },
  {
    label: 'Barra Invertida (\\\\)',
    code: 'String path = "C:\\\\dev\\\\projects";\nSystem.out.println(path);',
    output: 'C:\\dev\\projects',
    desc: 'Uma barra invertida serve para escapar. Para imprimir uma única barra real no console, declare duas seguidas (\\\\).'
  },
  {
    label: 'Quebra de Linha (\\n)',
    code: 'String s = "Linha 1\\nLinha 2";\nSystem.out.println(s);',
    output: 'Linha 1\nLinha 2',
    desc: 'O caractere especial \\n obriga o console a saltar para a próxima linha física de saída de forma imediata.'
  },
  {
    label: 'Tabulação (\\t)',
    code: 'System.out.println("Item\\tQtd");\nSystem.out.println("Mesa\\t2");',
    output: 'Item\tQtd\nMesa\t2',
    desc: 'O escape \\t insere uma tabulação de espaço padrão, alinhando colunas em terminais de texto simplificados.'
  }
];

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'Cliente e Categoria', file: 'ClienteTexto.java',
    code: 'public class ClienteTexto {\n    public static void main(String[] args) {\n        String nomeCliente = "Cliente Exemplo";\n        String emailCliente = "cliente@exemplo.com";\n        char categoriaCliente = \'A\';\n\n        System.out.println("Nome: " + nomeCliente);\n        System.out.println("Email: " + emailCliente);\n        System.out.println("Categoria: " + categoriaCliente);\n    }\n}',
    output: 'Nome: Cliente Exemplo\nEmail: cliente@exemplo.com\nCategoria: A', insight: 'Nome e e-mail exigem String. A categoria, sendo uma única letra de controle, utiliza char de forma limpa.'
  },
  {
    id: 1, label: 'Pedido e Identificadores', file: 'PedidoTexto.java',
    code: 'public class PedidoTexto {\n    public static void main(String[] args) {\n        String codigoPedido = "PED-2026-001";\n        String statusPedido = "PENDENTE";\n        String nomeCliente = "Cliente Exemplo";\n\n        System.out.println("Pedido: " + codigoPedido);\n        System.out.println("Status: " + statusPedido);\n        System.out.println("Cliente: " + nomeCliente);\n    }\n}',
    output: 'Pedido: PED-2026-001\nStatus: PENDENTE\nCliente: Cliente Exemplo', insight: 'Mesmo contendo dígitos como 001, códigos de pedidos são identificadores e utilizam String.'
  },
  {
    id: 2, label: 'Documentos e Zeros', file: 'DocumentoTexto.java',
    code: 'public class DocumentoTexto {\n    public static void main(String[] args) {\n        String cpf = "12345678900";\n        String cep = "06454000";\n        String telefone = "11999999999";\n\n        System.out.println("CPF: " + cpf);\n        System.out.println("CEP: " + cep);\n        System.out.println("Telefone: " + telefone);\n    }\n}',
    output: 'CPF: 12345678900\nCEP: 06454000\nTelefone: 11999999999', insight: 'CPF, CEP e telefone são modelados como String para manter zeros à esquerda e viabilizar futuras máscaras.'
  },
  {
    id: 3, label: 'Padronização', file: 'StatusTexto.java',
    code: 'public class StatusTexto {\n    public static void main(String[] args) {\n        String statusInformado = "aberta";\n        String statusPadronizado = statusInformado.toUpperCase();\n\n        System.out.println("Informado: " + statusInformado);\n        System.out.println("Padronizado: " + statusPadronizado);\n    }\n}',
    output: 'Informado: aberta\nPadronizado: ABERTA', insight: 'toUpperCase() gera um novo valor lógico. Guardamos na nova variável statusPadronizado para uso comercial.'
  },
  {
    id: 4, label: 'Tamanho de CPF', file: 'TamanhoDocumentoTexto.java',
    code: 'public class TamanhoDocumentoTexto {\n    public static void main(String[] args) {\n        String cpf = "12345678900";\n        int tamanhoCpf = cpf.length();\n\n        System.out.println("CPF: " + cpf);\n        System.out.println("Tamanho do CPF: " + tamanhoCpf);\n    }\n}',
    output: 'CPF: 12345678900\nTamanho do CPF: 11', insight: 'O método length() fornece o comprimento textual físico, essencial para validações cadastrais de entrada.'
  }
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
  '# Aula 028 — char e String no Java', '',
  '## Tipos textuais e aspas', '- [ ] Entendi que char representa caractere único sob aspas simples', '- [ ] Constatei que String representa cadeia de texto sob aspas duplas', '- [ ] Diferenciei aspas simples de aspas duplas no compilador', '',
  '## Modelagem e semântica', '- [ ] Identifiquei que CEP, CPF e telefone devem ser String no backend', '- [ ] Compreendi o risco de perda de zeros à esquerda em inteiros', '- [ ] Pratiquei concatenação e entendi o papel do espaço em branco', '- [ ] Evitei armadilhas de precedência indevidas em somas textuais usando parênteses', '',
  '## Escape e Métodos', '- [ ] Apliquei escapes de aspas, quebras e tabulações no console', '- [ ] Constatei a imutabilidade física das Strings na Heap do Java', '- [ ] Guardei o retorno modificado de toUpperCase() na nova referência', '- [ ] Verifiquei o comprimento físico de documentos via length()', '',
  '## Evidências locais', '- [ ] Criei e compilei as nove classes locais', '- [ ] Mantive o repositório Git higienizado contra arquivos .class', '',
  '## Decisão de Projeto', '- Funcionário e máscara cadastrada no desafio de transferência:', '- Por que cpf.length() é preferível a validações numéricas:'
].join('\n');

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="str28-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file str28-code">
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

function QuoteBoxLab() {
  const [selected, setSelected] = useState(0);
  const item = QUOTES_CASES[selected];
  return <section className="str28-quote-box">
    <div className="str28-quote-inputs">
      {QUOTES_CASES.map((entry, index) => (
        <button key={entry.id || index} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          <code>{entry.input}</code>
          <span className={`str28-quote-badge ${entry.badge}`}>{entry.type}</span>
        </button>
      ))}
    </div>
    <div className="str28-quote-feedback">
      <div>
        <span className={`str28-quote-badge ${item.badge}`} style={{ marginBottom: '8px' }}>
          {item.type === 'Erro' ? 'Rejeitado pelo javac' : 'Tipo: ' + item.type}
        </span>
        <h3 style={{ margin: '4px 0 8px', color: '#3b0764' }}>Análise do compilador</h3>
        <p style={{ fontSize: '.74rem', lineHeight: 1.5, margin: 0, color: '#581c87' }}>{item.text}</p>
      </div>
      {!item.ok && (
        <pre style={{ margin: '12px 0 0', padding: '8px', background: '#fee2e2', color: '#991b1b', border: '1px solid #fecdd3', borderRadius: '6px', fontSize: '.68rem', fontFamily: 'Consolas, monospace' }}>
          Main.java:3: error: {item.errorMsg}
        </pre>
      )}
    </div>
  </section>;
}

function ModelingDetectorLab() {
  const [selected, setSelected] = useState(0);
  const item = MODELING_QUIZ[selected];
  const [answer, setAnswer] = useState(null);

  return <section className="str28-modeling-detector">
    <div className="str28-modeling-nav">
      {MODELING_QUIZ.map((entry, index) => (
        <button key={entry.id} type="button" className={selected === index ? 'active' : ''} onClick={() => { setSelected(index); setAnswer(null); }}>
          <div>
            <strong>{entry.field}</strong>
            <span>Cenário {index + 1}</span>
          </div>
        </button>
      ))}
    </div>
    <div className="str28-modeling-feedback">
      <div>
        <h3 style={{ margin: '0 0 6px', color: '#1e1b4b', fontSize: '.9rem' }}>{item.field}</h3>
        <p style={{ fontSize: '.72rem', color: '#475569', margin: '4px 0 12px' }}>Qual é a melhor decisão de tipo para modelar este campo no backend?</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {item.options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => setAnswer(opt)}
              style={{
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '.72rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: answer === opt ? (opt === item.correct ? '#10b981' : '#ef4444') : '#fff',
                color: answer === opt ? '#fff' : '#475569',
                borderColor: answer === opt ? (opt === item.correct ? '#10b981' : '#ef4444') : '#cbd5e1'
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      {answer && (
        <div style={{ marginTop: '16px', borderTop: '1px dashed #c7d2fe', paddingTop: '12px' }}>
          <span className={`str28-quote-badge ${answer === item.correct ? 'string' : 'error'}`} style={{ marginBottom: '6px', background: answer === item.correct ? '#dbeafe' : '#fee2e2', color: answer === item.correct ? '#1e40af' : '#991b1b', border: 0 }}>
            {answer === item.correct ? 'Decisão Recomendada' : 'Opção não recomendada'}
          </span>
          <p style={{ fontSize: '.72rem', lineHeight: 1.5, margin: '4px 0 0', color: answer === item.correct ? '#1e1b4b' : '#991b1b' }}>
            {answer === item.correct ? item.reason : 'Atenção: Tratar campos de identificação (que podem conter letras, pontuações ou zeros à esquerda) como números gerará perda de integridade cadastral no banco de dados.'}
          </p>
        </div>
      )}
    </div>
  </section>;
}

function ConcatLab() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const item = CONCAT_CASES[selectedIdx];
  return <section className="str28-concat-lab">
    <div className="str28-concat-panel">
      <div className="str28-concat-nav">
        {CONCAT_CASES.map((entry, index) => (
          <button key={index} type="button" className={selectedIdx === index ? 'active' : ''} onClick={() => setSelectedIdx(index)}>
            {entry.label}
          </button>
        ))}
      </div>
      <div className="bool27-compound-expression" style={{ padding: '14px', background: '#030712' }}>
        <span style={{ fontSize: '.6rem', color: '#94a3b8', textTransform: 'uppercase' }}>Trecho executado:</span>
        <code style={{ color: '#c084fc', fontFamily: 'Consolas, monospace', fontSize: '.8rem' }}>{item.code}</code>
      </div>
      <div className="int25-console">
        <header><Terminal size={15} /> Console do Java</header>
        <pre>{item.output}</pre>
      </div>
      <div style={{ fontSize: '.72rem', lineHeight: 1.5, color: '#94a3b8' }}>
        <strong>Regra de precedência:</strong>
        <p style={{ margin: '4px 0 0', color: '#cbd5e1' }}>{item.desc}</p>
      </div>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px' }}>
        <Lightbulb size={22} />
        <div>
          <strong>Conversão Implícita</strong>
          <p>
            No Java, o sinal de + assume o papel de concatenação de strings sempre que pelo menos um dos termos envolvidos for uma String. Use parênteses para forçar a soma matemática dos números antes.
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function EscapeVisualizerLab() {
  const [selected, setSelected] = useState(0);
  const item = ESCAPE_CASES[selected];
  return <section className="str28-escape-visualizer">
    <div className="str28-escape-nav">
      {ESCAPE_CASES.map((entry, index) => (
        <button key={index} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          {entry.label}
        </button>
      ))}
    </div>
    <div className="str28-escape-content">
      <CodePanel name="Main.java" code={item.code} />
      <div className="int25-console">
        <header><Terminal size={15} /> Saída formatada no console</header>
        <pre style={{ color: '#f3e8ff' }}>{item.output}</pre>
      </div>
      <p style={{ fontSize: '.72rem', lineHeight: 1.5, color: '#475569', margin: '4px 0 0' }}>
        {item.desc}
      </p>
    </div>
  </section>;
}

function HeapMemoryLab() {
  const [step, setStep] = useState(0); // 0: inicial, 1: sem variavel, 2: com variavel
  return <section className="str28-heap-memory">
    <div className="str28-heap-board">
      <div className="str28-heap-stack">
        <h4>Pilha (Stack) <span style={{ textTransform: 'none', fontSize: '.6rem', color: '#94a3b8' }}>(Variáveis locais)</span></h4>
        <div className="str28-heap-pointer active">
          <span>String nome</span>
          <strong>0x7FA (endereço)</strong>
        </div>
        {step === 2 && (
          <div className="str28-heap-pointer active" style={{ borderColor: '#10b981' }}>
            <span style={{ color: '#10b981' }}>String maiusculo</span>
            <strong>0x9CB (endereço)</strong>
          </div>
        )}
      </div>
      <div className="str28-heap-heap">
        <h4>Memória Heap <span style={{ textTransform: 'none', fontSize: '.6rem', color: '#94a3b8' }}>(Objetos String imutáveis)</span></h4>
        <div className="str28-heap-block active" style={{ borderColor: step === 0 ? 'var(--str28-orchid)' : '#334155', background: step === 0 ? '#3b0764' : '#0f172a', color: step === 0 ? '#d8b4fe' : '#94a3b8' }}>
          "ana" <span style={{ fontSize: '.6rem', display: 'block', color: '#94a3b8' }}>(Endereço: 0x7FA)</span>
        </div>
        {step !== 0 && (
          <div className="str28-heap-block highlight" style={{ borderColor: step === 2 ? '#10b981' : 'var(--str28-orchid)', background: step === 2 ? '#064e3b' : '#3b0764', color: step === 2 ? '#34d399' : '#d8b4fe' }}>
            "ANA" <span style={{ fontSize: '.6rem', display: 'block', color: '#94a3b8' }}>(Endereço: 0x9CB)</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '.6rem', color: '#94a3b8' }}>*Heap Pool</div>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(220px, .8fr)', gap: '16px', alignItems: 'center' }}>
      <div>
        <h4 style={{ margin: '0 0 6px', color: '#581c87' }}>Teste o impacto da Imutabilidade:</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={() => setStep(0)} style={{ padding: '8px 12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Reiniciar Estado</button>
          <button type="button" onClick={() => setStep(1)} style={{ padding: '8px 12px', background: step === 1 ? 'var(--str28-purple)' : '#fff', color: step === 1 ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>nome.toUpperCase();</button>
          <button type="button" onClick={() => setStep(2)} style={{ padding: '8px 12px', background: step === 2 ? '#10b981' : '#fff', color: step === 2 ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>maiusculo = nome.toUpperCase();</button>
        </div>
        <div style={{ marginTop: '12px', fontSize: '.72rem', lineHeight: 1.5, color: '#581c87' }}>
          {step === 0 && 'Estado Inicial: A variável nome aponta para o endereço 0x7FA contendo "ana".'}
          {step === 1 && 'Alerta! O compilador gerou a nova String "ANA" no endereço 0x9CB, mas como você não atribuiu o retorno a nenhuma variável, a pilha stack continua apontando apenas para "ana". A String "ANA" fica órfã no Heap!'}
          {step === 2 && 'Sucesso! A nova variável maiusculo foi alocada no Stack e aponta para o novo objeto "ANA" (0x9CB). Ambos os estados estão seguros e disponíveis de forma isolada no Heap.'}
        </div>
      </div>
      <div>
        <aside className="guided-note info" style={{ margin: 0, padding: '14px', background: '#fdfaff', borderColor: '#e9d5ff', color: '#581c87' }}>
          <Lightbulb size={20} style={{ color: 'var(--str28-purple)' }} />
          <div>
            <strong>Imutabilidade Lógica</strong>
            <p style={{ fontSize: '.65rem', color: '#475569', lineHeight: 1.4, margin: '2px 0 0' }}>
              Uma String no Java nunca é modificada após criada. Qualquer método de transformação (como toUpperCase) gera um objeto totalmente novo no Heap Pool.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="str28-domains-gallery">
    <div className="str28-domains-sidebar">
      {DOMAIN_PROGRAMS.map((entry, index) => (
        <button key={entry.id} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          {entry.label}
        </button>
      ))}
    </div>
    <div className="str28-domains-content">
      <CodePanel name={item.file} code={item.code} />
      <section className="str28-console">
        <header><Terminal size={15} /> Console de saída esperado</header>
        <pre>{item.output}</pre>
        <p style={{ display: 'flex', gap: '8px', margin: '0', padding: '12px 14px', alignItems: 'flex-start', color: '#94a3b8', background: '#1e293b', borderTop: '1px solid #334155', fontSize: '.72rem', lineHeight: 1.5 }}>
          <Sparkles size={16} style={{ color: '#c084fc', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="str28-errors-clinic">
    <nav className="str28-errors-nav">
      {ERRORS.map((entry, index) => (
        <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="str28-error-card">
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
      <div className="str28-error-flow">
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
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-028-char-string\ncd labs\\m1\\aula-028-char-string\nNew-Item Main.java, ClienteTexto.java, PedidoTexto.java, OrdemServicoTexto.java, DocumentoTexto.java, MensagemErroTexto.java, StatusTexto.java, TamanhoDocumentoTexto.java, ConcatenacaoTexto.java',
      out: 'Nove arquivos Java criados na estrutura do repositório.',
      tip: 'Abra cada arquivo no IntelliJ e copie os respectivos códigos de negócio, analisando as escolhas semânticas das aspas e imutabilidade.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac Main.java ClienteTexto.java PedidoTexto.java OrdemServicoTexto.java DocumentoTexto.java MensagemErroTexto.java StatusTexto.java TamanhoDocumentoTexto.java ConcatenacaoTexto.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Verifique se não há mensagens de erro de compilação (unclosed character literal ou incompatible types).'
    },
    {
      title: 'Executar Programas',
      cmd: 'java Main\njava StatusTexto\njava TamanhoDocumentoTexto',
      out: 'Saída exibindo os textos, tamanhos de documentos e status formatados.',
      tip: 'Verifique se os tamanhos físicos de documentos (length()) batem com o número correto de caracteres.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-028-char-string docs/diario-de-bordo.md\ngit commit -m "Aula 028: pratica char e String no Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Certifique-se de que os arquivos .class não entraram no commit, garantindo a higiene do seu histórico de modificações.'
    }
  ];

  const current = steps[stage];

  return <section className="str28-terminal-flow">
    <div className="bool27-delivery-flow">
      <nav className="str28-delivery-flow nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="str28-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="str28-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file str28-evidence" style={{ marginTop: '14px' }}>
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
  if (block.type === 'quote_box') return <QuoteBoxLab />;
  if (block.type === 'modeling_detector') return <ModelingDetectorLab />;
  if (block.type === 'concat_lab') return <ConcatLab />;
  if (block.type === 'escape_visualizer') return <EscapeVisualizerLab />;
  if (block.type === 'heap_memory') return <HeapMemoryLab />;
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
    title: 'Aspas simples vs Aspas duplas',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'Entenda a diferença sintática fundamental entre o tipo primitivo char (aspas simples) e a classe String (aspas duplas) no Java:' },
      { type: 'quote_box' }
    ]
  },
  {
    id: 'modelagem',
    eyebrow: 'Engenharia',
    label: 'Detector de Tipo',
    title: 'Modelando identificadores com sabedoria',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Descubra por que CPFs, CEPs, telefones e códigos devem ser String no backend para evitar perda de zeros à esquerda:' },
      { type: 'modeling_detector' }
    ]
  },
  {
    id: 'concatenacao',
    eyebrow: 'Sintaxe',
    label: 'Concatenação',
    title: 'Evitando a armadilha do sinal de mais (+)',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Entenda como o Java promove números para texto em concatenações e como usar parênteses para forçar a soma matemática antes:' },
      { type: 'concat_lab' }
    ]
  },
  {
    id: 'escape',
    eyebrow: 'Sintaxe',
    label: 'Playground de Escape',
    title: 'Caracteres especiais de formatação',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Aprenda a inserir aspas internas, barras invertidas e quebras de linha dentro de Strings literais de forma segura:' },
      { type: 'escape_visualizer' }
    ]
  },
  {
    id: 'imutabilidade',
    eyebrow: 'Simulação',
    label: 'Imutabilidade Heap',
    title: 'Entendendo a alocação de Strings em memória',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Métodos de String geram novos objetos. Veja graficamente o comportamento da pilha Stack e da Heap do Java na transformação de caixa alta:' },
      { type: 'heap_memory' },
      { type: 'note', tone: 'info', title: 'Aviso de Comparação', text: 'Como Strings são objetos em memória Heap, evite compará-las com == como regra geral. No futuro, aprenderemos a usar equals().' }
    ]
  },
  {
    id: 'exemplos',
    eyebrow: 'Aplicações',
    label: 'Casos Práticos',
    title: 'Galeria de programas aplicados',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Explore os códigos reais do domínio corporativo que manipulam nomes, e-mails, CEPs e prioridades:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Falhas clássicas de declaração e métodos',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Examine e depure os 10 sintomas clássicos do compilador ao declarar ou comparar strings e caracteres:' },
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
      { type: 'lead', text: 'Crie a pasta de laboratório, compile todas as classes e execute seu progresso com commits Git limpos:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio Prático de Transferência: Cadastro e Máscaras',
        text: 'Crie o arquivo CadastroFuncionarioTexto.java em labs/m1/aula-028-char-string/. Declare as iniciais do funcionário (char em aspas simples), sobrenome (String), registro funcional com zero à esquerda (String), CPF de 11 dígitos (String) e se está ativo (boolean). Imprima essas informações escapando aspas no console, utilizando tabulações \\t e quebras de linha \\n. Padronize o sobrenome do funcionário para caixa alta, guarde o resultado em uma nova variável e exiba o tamanho do CPF impresso no console com o método length().',
        acceptance: [
          'Iniciais do funcionário modeladas como char com aspas simples.',
          'Documento CPF e código de registro com zero à esquerda modelados como String.',
          'Uso correto de caracteres de escape (\\n, \\t, \\") na exibição.',
          'Retorno de toUpperCase() guardado em uma nova variável e impresso no console.',
          'Tamanho do CPF exibido via método length().',
          'Histórico de commits limpo e sem arquivos binários compilados .class no Git.'
        ]
      }
    ]
  }
];

export default function GuidedCharStringLesson028({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-char-string-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Oficina de tipos textuais</span>
        <p className="guided-sequence">028 · M1.08</p>
        <h1>Char e String em Uso Inicial</h1>
        <p>Aprenda a separar char primitivo de String estruturado, use aspas simples e duplas corretamente, domine concatenações, escapes de console e a imutabilidade na JVM.</p>
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

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'char / String', label: 'tipos de dados' }, { value: 'Heap Pool', label: 'imutabilidade' }, { value: '10 casos', label: 'clínica de erros' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 028">
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
              <h3>{lessonComplete ? 'Tipos textuais e imutabilidade dominados!' : 'Oficina concluída'}</h3>
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
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 027</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Texto com precisão sintática' : allStepsComplete ? 'Use o botão acima' : 'Estude as aspas e os blocos de memória Heap'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir String básica'}>Aula 029 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
