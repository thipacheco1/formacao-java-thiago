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
import './guidedStringBasicsLesson.css';

const STORAGE_KEY = 'guided-string-basics-lesson-029-progress';

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'Main Principal', file: 'Main.java',
    code: 'public class Main {\n    public static void main(String[] args) {\n        String nome = "  Cliente Exemplo  ";\n        String nomeTratado = nome.trim();\n\n        System.out.println("Original: [" + nome + "]");\n        System.out.println("Tratado: [" + nomeTratado + "]");\n        System.out.println("Tamanho original: " + nome.length());\n        System.out.println("Tamanho tratado: " + nomeTratado.length());\n        System.out.println("Está vazio: " + nomeTratado.isEmpty());\n        System.out.println("Está em branco: " + nomeTratado.isBlank());\n    }\n}',
    output: 'Original: [  Cliente Exemplo  ]\nTratado: [Cliente Exemplo]\nTamanho original: 21\nTamanho tratado: 15\nEstá vazio: false\nEstá em branco: false',
    insight: 'Exemplo mínimo provando que o trim() corta as extremidades, diminuindo o length() físico de 21 para 15.'
  },
  {
    id: 1, label: 'Comparação de Strings', file: 'ComparacaoString.java',
    code: 'public class ComparacaoString {\n    public static void main(String[] args) {\n        String statusInformado = "aberta";\n\n        boolean comparacaoExata = statusInformado.equals("ABERTA");\n        boolean comparacaoIgnorandoCaixa = statusInformado.equalsIgnoreCase("ABERTA");\n\n        System.out.println("Comparação exata: " + comparacaoExata);\n        System.out.println("Comparação ignorando caixa: " + comparacaoIgnorandoCaixa);\n    }\n}',
    output: 'Comparação exata: false\nComparação ignorando caixa: true',
    insight: 'Use equalsIgnoreCase() quando a regra permitir variações de caixa digitadas pelo usuário ou sistemas legados.'
  },
  {
    id: 2, label: 'Validação de Texto', file: 'ValidacaoTexto.java',
    code: 'public class ValidacaoTexto {\n    public static void main(String[] args) {\n        String nome = "   ";\n        String email = "cliente@exemplo.com";\n\n        boolean nomeVazio = nome.isEmpty();\n        boolean nomeEmBranco = nome.isBlank();\n        boolean emailPossuiArroba = email.contains("@");\n\n        System.out.println("Nome vazio: " + nomeVazio);\n        System.out.println("Nome em branco: " + nomeEmBranco);\n        System.out.println("Email possui arroba: " + emailPossuiArroba);\n    }\n}',
    output: 'Nome vazio: false\nNome em branco: true\nEmail possui arroba: true',
    insight: 'O nome contém espaços físicos, então não está vazio (isEmpty = false), mas está em branco (isBlank = true).'
  },
  {
    id: 3, label: 'Cliente de Domínio', file: 'ClienteStringBasica.java',
    code: 'public class ClienteStringBasica {\n    public static void main(String[] args) {\n        String nomeCliente = "  Cliente Exemplo  ";\n        String emailCliente = "cliente@exemplo.com";\n\n        String nomeTratado = nomeCliente.trim();\n        boolean nomeInformado = !nomeTratado.isBlank();\n        boolean emailPossuiArroba = emailCliente.contains("@");\n\n        System.out.println("Nome original: [" + nomeCliente + "]");\n        System.out.println("Nome tratado: [" + nomeTratado + "]");\n        System.out.println("Nome informado: " + nomeInformado);\n        System.out.println("Email possui @: " + emailPossuiArroba);\n    }\n}',
    output: 'Nome original: [  Cliente Exemplo  ]\nNome tratado: [Cliente Exemplo]\nNome informado: true\nEmail possui @: true',
    insight: 'A negação !nomeTratado.isBlank() é a forma correta e limpa de garantir que um campo de texto possui conteúdo útil real.'
  },
  {
    id: 4, label: 'Auditoria de Sistema', file: 'AuditoriaStringBasica.java',
    code: 'public class AuditoriaStringBasica {\n    public static void main(String[] args) {\n        String usuario = " usuario.exemplo ";\n        String evento = "ALTERACAO_STATUS";\n        String origem = "sistema";\n\n        String usuarioTratado = usuario.trim();\n        boolean usuarioInformado = !usuarioTratado.isBlank();\n        boolean eventoAlteracaoStatus = "ALTERACAO_STATUS".equals(evento);\n        boolean origemSistema = origem.equalsIgnoreCase("SISTEMA");\n\n        System.out.println("Usuário tratado: " + usuarioTratado);\n        System.out.println("Usuário informado: " + usuarioInformado);\n        System.out.println("Evento alteração status: " + eventoAlteracaoStatus);\n        System.out.println("Origem sistema: " + origemSistema);\n    }\n}',
    output: 'Usuário tratado: usuario.exemplo\nUsuário informado: true\nEvento alteração status: true\nOrigem sistema: true',
    insight: 'A comparação defensiva "ALTERACAO_STATUS".equals(evento) impede falhas catastróficas caso a variável evento seja null.'
  }
];

const ERRORS = [
  { title: 'Comparar com ==', code: 'String status = "ABERTA";\nif (status == "ABERTA") { ... }', symptom: 'Resultado imprevisível ou falhas intermitentes em execução', cause: 'O operador == compara o endereço de referência da memória, e não os caracteres internos.', fix: 'Substitua pela chamada equals(): status.equals("ABERTA") ou "ABERTA".equals(status).' },
  { title: 'Esquecer case-sensitivity', code: 'String status = "aberta";\nboolean ok = status.equals("ABERTA");', symptom: 'Retorna false indevidamente para variações de caixa', cause: 'O método equals() exige correspondência absoluta de bytes e caracteres.', fix: 'Se a regra de negócio for insensível à caixa, use: status.equalsIgnoreCase("ABERTA").' },
  { title: 'isEmpty no lugar de isBlank', code: 'String nome = "   ";\nif (nome.isEmpty()) { ... }', symptom: 'Retorna false e aceita nomes compostos por espaços vazios', cause: 'isEmpty() valida apenas se o tamanho físico é zero (length == 0). Espaços ocupam posições.', fix: 'Use o método isBlank() para capturar texto vazio ou contendo apenas espaços.' },
  { title: 'Chamar trim() sem reatribuir', code: 'String nome = " Ana ";\nnome.trim();\nSystem.out.println(nome);', symptom: 'A saída continua exibindo os espaços nas bordas: " Ana "', cause: 'Strings em Java são imutáveis. Métodos de manipulação nunca modificam a String original.', fix: 'Reatribua o retorno: String nomeTratado = nome.trim(); ou nome = nome.trim();' },
  { title: 'contains() case-sensitive', code: 'String msg = "Erro ao salvar";\nboolean erro = msg.contains("erro");', symptom: 'Retorna false mesmo contendo a palavra "Erro"', cause: 'O método contains() diferencia maiúsculas de minúsculas de forma estrita.', fix: 'Padronize a string de busca: msg.toLowerCase().contains("erro").' },
  { title: 'Validação fraca com contains', code: 'boolean emailValido = email.contains("@");', symptom: 'Aceita entradas inválidas como "cliente@" ou "@exemplo.com"', cause: 'contains() apenas atesta presença do trecho, sem avaliar padrões ou estruturas.', fix: 'Use contains para checagem básica inicial, mas saiba que validações completas exigirão padrões maiores.' },
  { title: 'Esquecer espaços ao juntar', code: 'String nomeCompleto = nome + sobrenome;', symptom: 'Imprime textos aglutinados (ex: "AnaSilva")', cause: 'A concatenação crua não insere espaços automaticamente nas junções.', fix: 'Adicione um caractere com espaço literal: nome + " " + sobrenome;' },
  { title: 'Soma virar texto', code: 'System.out.println("Total: " + a + b);', symptom: 'Se a=10 e b=20, imprime "Total: 1020"', cause: 'O sinal de + realiza concatenação textual sequencial quando precedido por String.', fix: 'Use parênteses para forçar a aritmética: "Total: " + (a + b);' },
  { title: 'Método em String null', code: 'String nome = null;\nSystem.out.println(nome.length());', symptom: 'java.lang.NullPointerException na linha de execução', cause: 'Chamar qualquer método (como length() ou trim()) em uma referência null causa falha.', fix: 'Valide a referência ou use a comparação defensiva constante à esquerda: "Constante".equals(nome).' },
  { title: 'Encadeamento ilegível', code: 'boolean ok = s.trim().toLowerCase().contains("x") && !s.trim().isBlank();', symptom: 'Dificuldade extrema de leitura e depuração de falhas', cause: 'Múltiplas chamadas acumuladas na mesma expressão reduzem a legibilidade do backend.', fix: 'Refatore usando variáveis locais explicativas: String limpa = s.trim();' }
];

const EVIDENCE = [
  '# Aula 029 — String Básica no Java', '',
  '## Validação de Estados', '- [ ] Entendi que isEmpty() exige tamanho 0', '- [ ] Compreendi que isBlank() aceita espaços e valida o conteúdo real', '- [ ] Pratiquei a limpeza de bordas com o método trim()', '- [ ] Fixei o princípio de que o trim() retorna uma referência modificada', '',
  '## Comparações e Buscas', '- [ ] Abandonei o == em comparações de texto na JVM', '- [ ] Dominei equals() e equalsIgnoreCase() para equivalência lógica', '- [ ] Usei contains() e compreendi sua sensibilidade a caixa', '- [ ] Aprendi a combinar toLowerCase().contains() para buscas tolerantes', '',
  '## Arquitetura de Pipelines', '- [ ] Compreendi a teoria por trás do encadeamento de métodos', '- [ ] Refatorei cadeias extensas por variáveis locais claras', '',
  '## Evidências locais', '- [ ] Compilei e executei as 9 classes Java locais', '- [ ] Realizei commit limpo sem arquivos .class no Git', '',
  '## Decisão de Projeto', '- Validação de segurança aplicada no desafio de transferência:', '- Por que equalsIgnoreCase() difere de comparações estritas:'
].join('\n');

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="str29-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file str29-code">
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

function StateSimulatorLab() {
  const [inputVal, setInputVal] = useState('');
  const len = inputVal.length;
  const isEmp = inputVal.length === 0; // equivalent to isEmpty()
  const isBlk = inputVal.trim().length === 0; // equivalent to isBlank()

  return <section className="str29-state-simulator">
    <div className="str29-state-input">
      <Search size={18} style={{ color: 'var(--str29-orchid)' }} />
      <input
        type="text"
        value={inputVal}
        onChange={e => setInputVal(e.target.value)}
        placeholder="Digite um texto ou insira espaços..."
      />
      <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '.7rem', color: '#64748b' }} onClick={() => setInputVal('')}>Limpar</button>
    </div>
    <div>
      <span style={{ fontSize: '.65rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Visualização física (Literais de espaços em destaque):</span>
      <div style={{ marginTop: '6px', padding: '10px', background: '#0f172a', borderRadius: '8px', color: '#fff', fontFamily: 'Consolas, monospace', fontSize: '.8rem' }}>
        "
        {inputVal.split('').map((char, index) => (
          <span key={index} style={{ background: char === ' ' ? '#701a75' : '#10b981', color: '#fff', padding: '1px 3px', margin: '0 1px', borderRadius: '3px' }}>
            {char === ' ' ? '␣' : char}
          </span>
        ))}
        "
      </div>
    </div>
    <table className="str29-state-table">
      <thead>
        <tr>
          <th>Método Java</th>
          <th>Expressão Executada</th>
          <th>Resultado Retornado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>length()</strong></td>
          <td><code>texto.length()</code></td>
          <td><span style={{ fontWeight: 'bold', fontSize: '.85rem' }}>{len}</span></td>
        </tr>
        <tr>
          <td><strong>isEmpty()</strong></td>
          <td><code>texto.isEmpty()</code></td>
          <td><span className={`str29-state-badge ${isEmp}`}>{isEmp ? 'true' : 'false'}</span></td>
        </tr>
        <tr>
          <td><strong>isBlank()</strong></td>
          <td><code>texto.isBlank()</code></td>
          <td><span className={`str29-state-badge ${isBlk}`}>{isBlk ? 'true' : 'false'}</span></td>
        </tr>
      </tbody>
    </table>
    <p style={{ margin: 0, fontSize: '.68rem', lineHeight: 1.4, color: '#701a75' }}>
      💡 <strong>Diferença didática:</strong> <code>isEmpty()</code> avalia apenas se a String tem comprimento literal zero. <code>isBlank()</code> verifica se ela está vazia ou contém exclusivamente caracteres invisíveis (como espaços, tabs ou quebras).
    </p>
  </section>;
}

function TrimSimulatorLab() {
  const [text, setText] = useState('  Java  ');
  const [trimmed, setTrimmed] = useState(false);

  // Parse spaces
  const leftSpaces = text.match(/^\s*/)[0];
  const rightSpaces = text.match(/\s*$/)[0];
  const middleText = text.trim();

  return <section className="str29-trim-simulator">
    <div className="str29-trim-box">
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={text}
          onChange={e => { setText(e.target.value); setTrimmed(false); }}
          style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontFamily: 'Consolas, monospace', fontSize: '.8rem' }}
          placeholder="Texto com espaços..."
        />
        <button
          type="button"
          onClick={() => setTrimmed(true)}
          style={{ padding: '10px 14px', background: 'var(--str29-purple)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Cortar Bordas (.trim())
        </button>
      </div>
      <div className="str29-trim-display">
        {!trimmed ? (
          <>
            {leftSpaces.split('').map((_, i) => <span key={`l-${i}`} className="str29-trim-space" style={{ marginRight: '2px' }}>␣</span>)}
            {middleText.length > 0 && <span className="str29-trim-chars">{middleText}</span>}
            {rightSpaces.split('').map((_, i) => <span key={`r-${i}`} className="str29-trim-space" style={{ marginLeft: '2px' }}>␣</span>)}
          </>
        ) : (
          <span className="str29-trim-chars">{middleText}</span>
        )}
      </div>
      <p style={{ margin: 0, fontSize: '.7rem', lineHeight: 1.4, color: '#475569' }}>
        {trimmed ? 'Sucesso! O trim() removeu as caixas roxas de espaços das extremidades. A variável original continua com espaços caso não tenha sido reatribuída no Stack.' : 'Os blocos roxos (␣) representam espaços nas bordas que serão cortados. Espaços internos (caso existam) são preservados.'}
      </p>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px' }}>
        <Lightbulb size={22} />
        <div>
          <strong>Imutabilidade Lógica</strong>
          <p>
            Lembre-se: <code>nome.trim()</code> não altera a variável <code>nome</code>. Ele gera uma nova String limpa que você deve atribuir para persistir.
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function CompareLab() {
  const [valA, setValA] = useState('ABERTA');
  const [valB, setValB] = useState('aberta');

  const eq = valA === valB; // simulating == comparison
  const eqIgnore = valA.toLowerCase() === valB.toLowerCase();

  return <section className="str29-compare-lab">
    <div className="str29-compare-panel">
      <div className="str29-compare-inputs">
        <label>
          String A:
          <input type="text" value={valA} onChange={e => setValA(e.target.value)} />
        </label>
        <label>
          String B:
          <input type="text" value={valB} onChange={e => setValB(e.target.value)} />
        </label>
      </div>
      <div className="str29-compare-results">
        <div className="str29-compare-row">
          <code>A == B</code>
          <span>Compara referências físicas (Stack)</span>
          <span className={`val ${eq ? 'true' : 'false'}`} style={{ color: eq ? '#34d399' : '#f87171' }}>{eq ? 'true' : 'false'}</span>
        </div>
        <div className="str29-compare-row highlight">
          <code>A.equals(B)</code>
          <strong>Compara conteúdo exato de caracteres</strong>
          <span className={`val ${valA === valB ? 'true' : 'false'}`} style={{ color: valA === valB ? '#34d399' : '#f87171' }}>{valA === valB ? 'true' : 'false'}</span>
        </div>
        <div className="str29-compare-row">
          <code>A.equalsIgnoreCase(B)</code>
          <span>Compara ignorando caixa alta/baixa</span>
          <span className={`val ${eqIgnore ? 'true' : 'false'}`} style={{ color: eqIgnore ? '#34d399' : '#f87171' }}>{eqIgnore ? 'true' : 'false'}</span>
        </div>
      </div>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px', background: '#fdf4ff', borderColor: '#f5d0fe', color: 'var(--str29-purple)' }}>
        <Lightbulb size={22} style={{ color: 'var(--str29-fuchsia)' }} />
        <div>
          <strong>A Regra de Ouro</strong>
          <p style={{ fontSize: '.68rem', color: '#475569', lineHeight: 1.4, margin: '2px 0 0' }}>
            Nunca use <code>==</code> para comparar dados textuais em Java. Diferentes origens de leitura (arquivos, banco de dados ou scanners) produzem diferentes instâncias de memória Heap, fazendo o <code>==</code> retornar false mesmo para strings idênticas.
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function ChainingLensLab() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: 'Entrada Bruta', expr: '"  aberta  "', desc: 'A string possui espaços excedentes e caixa baixa.' },
    { title: 'trim()', expr: '.trim()', desc: 'Remove os espaços laterais, retornando a string "aberta".' },
    { title: 'toUpperCase()', expr: '.toUpperCase()', desc: 'Gera a string em caixa alta: "ABERTA".' },
    { title: 'contains("A")', expr: '.contains("ABERTA")', desc: 'Verifica a igualdade final de forma encadeada, retornando true.' }
  ];

  return <section className="str29-chaining-lens">
    <div className="str29-chain-steps">
      {steps.map((entry, index) => (
        <div key={index} className={`str29-chain-step ${step === index ? 'active' : ''}`}>
          <h4>Passo {index + 1}</h4>
          <code>{entry.expr}</code>
          <span>{entry.title}</span>
        </div>
      ))}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(220px, .8fr)', gap: '16px', alignItems: 'center', marginTop: '10px' }}>
      <div>
        <h4 style={{ margin: '0 0 4px', color: 'var(--str29-purple)' }}>Fluxo de Execução:</h4>
        <p style={{ fontSize: '.74rem', margin: 0, color: '#475569' }}>{steps[step].desc}</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button type="button" onClick={() => setStep(0)} style={{ padding: '8px 12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Reiniciar</button>
          <button type="button" disabled={step === steps.length - 1} onClick={() => setStep(step + 1)} style={{ padding: '8px 12px', background: 'var(--str29-purple)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Avançar Fluxo &gt;</button>
        </div>
      </div>
      <div>
        <aside className="guided-note info" style={{ margin: 0, padding: '14px', background: '#fff', borderColor: '#cbd5e1' }}>
          <Lightbulb size={20} />
          <div>
            <strong>Legibilidade</strong>
            <p style={{ fontSize: '.64rem', color: '#475569', lineHeight: 1.4, margin: '2px 0 0' }}>
              Se o encadeamento reduzir a clareza, refatore dividindo a expressão em variáveis intermediárias explicativas no seu código.
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
  return <section className="str29-domains-gallery">
    <div className="str29-domains-sidebar">
      {DOMAIN_PROGRAMS.map((entry, index) => (
        <button key={entry.id} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          {entry.label}
        </button>
      ))}
    </div>
    <div className="str29-domains-content">
      <CodePanel name={item.file} code={item.code} />
      <section className="str29-console">
        <header><Terminal size={15} /> Console de saída esperado</header>
        <pre>{item.output}</pre>
        <p style={{ display: 'flex', gap: '8px', margin: '0', padding: '12px 14px', alignItems: 'flex-start', color: '#94a3b8', background: '#1e293b', borderTop: '1px solid #334155', fontSize: '.72rem', lineHeight: 1.5 }}>
          <Sparkles size={16} style={{ color: 'var(--str29-fuchsia)', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="str29-errors-clinic">
    <nav className="str29-errors-nav">
      {ERRORS.map((entry, index) => (
        <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="str29-error-card">
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
      <div className="str29-error-flow">
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
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-029-string-basica\ncd labs\\m1\\aula-029-string-basica\nNew-Item Main.java, ComparacaoString.java, ValidacaoTexto.java, ClienteStringBasica.java, PedidoStringBasica.java, OrdemServicoStringBasica.java, ProdutoStringBasica.java, MensagemStringBasica.java, AuditoriaStringBasica.java',
      out: 'Nove arquivos Java criados na estrutura do repositório.',
      tip: 'Abra cada arquivo no IntelliJ e copie os respectivos códigos de negócio, analisando as validações de isBlank(), trim() e equals().'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac Main.java ComparacaoString.java ValidacaoTexto.java ClienteStringBasica.java PedidoStringBasica.java OrdemServicoStringBasica.java ProdutoStringBasica.java MensagemStringBasica.java AuditoriaStringBasica.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Verifique se não há mensagens de erro de digitação de métodos.'
    },
    {
      title: 'Executar Programas',
      cmd: 'java Main\njava ComparacaoString\njava ValidacaoTexto',
      out: 'Saída exibindo as auditorias, comparações de status e detecções de strings em branco.',
      tip: 'Analise no seu próprio console por que a string "   " retorna false no isEmpty() e true no isBlank().'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-029-string-basica docs/diario-de-bordo.md\ngit commit -m "Aula 029: pratica String basica no Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Mantenha os arquivos compilados .class fora da árvore do commit para preservar a higiene do repositório.'
    }
  ];

  const current = steps[stage];

  return <section className="str29-terminal-flow">
    <div className="bool27-delivery-flow">
      <nav className="str29-delivery-flow nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="str29-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="str29-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file str29-code" style={{ marginTop: '14px' }}>
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
  if (block.type === 'state_simulator') return <StateSimulatorLab />;
  if (block.type === 'trim_simulator') return <TrimSimulatorLab />;
  if (block.type === 'compare_lab') return <CompareLab />;
  if (block.type === 'chaining_lens') return <ChainingLensLab />;
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
    label: 'isEmpty vs isBlank',
    title: 'Anatomia de Estados Textuais',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Descubra por que a string contendo apenas espaços não está vazia para o isEmpty() mas é capturada perfeitamente pelo isBlank() em formulários:' },
      { type: 'state_simulator' }
    ]
  },
  {
    id: 'trim',
    eyebrow: 'Manipulação',
    label: 'Espaços com trim()',
    title: 'Higienização de Entradas de Usuário',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'Veja na prática como remover espaços indesejados nas extremidades de Strings literais, preservando o miolo do texto:' },
      { type: 'trim_simulator' }
    ]
  },
  {
    id: 'comparacao',
    eyebrow: 'Segurança',
    label: 'equals() vs ==',
    title: 'Comparando Conteúdos com Rigor',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Entenda por que o sinal de == pode gerar falsos negativos na JVM e como utilizar o equals() e equalsIgnoreCase() de forma segura:' },
      { type: 'compare_lab' }
    ]
  },
  {
    id: 'encadeamento',
    eyebrow: 'Arquitetura',
    label: 'Chaining Pipelines',
    title: 'Encadeando Métodos Sequencialmente',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Analise o fluxo interno que a JVM percorre ao encadear transformações em cascata, e quando subdividir a expressão em variáveis explicativas:' },
      { type: 'chaining_lens' }
    ]
  },
  {
    id: 'exemplos',
    eyebrow: 'Aplicações',
    label: 'Casos Reais',
    title: 'Galeria de programas aplicados',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Explore os códigos reais contendo auditorias, buscas simples contains() tolerantes e validações aplicadas de cadastro:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Falhas clássicas em pipelines de strings',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Depure e diagnostique os 10 sintomas e falhas frequentes ao chamar métodos em variáveis que podem estar vazias, brancas ou nulas:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Prática',
    label: 'Entrega do Lab',
    title: 'Auditoria de terminal e commits limpos',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Monte sua pasta local, compile todos os códigos e finalize sua jornada prática fazendo um commit Git exemplar:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio Prático de Transferência: Higienização de Login',
        text: 'Crie o arquivo ValidacaoSeguranca.java em labs/m1/aula-029-string-basica/. Declare loginDigitado (como String com espaços antes/depois, ex: "   Admin.Thiago   ") e emailDigitado (com letras maiúsculas/minúsculas e espaços). Remova os espaços e padronize o login para minúsculas usando encadeamento. Compare o login tratado com a constante "admin.thiago" via equals(). Verifique se o e-mail não está em branco (isBlank()), possui arroba (contains("@")) e tem tamanho mínimo de 10 caracteres (length()). Exiba os resultados das validações no console formatados.',
        acceptance: [
          'Login tratado removendo espaços nas pontas e padronizado em caixa baixa.',
          'Comparação de login com constante utilizando o método equals().',
          'E-mail validado combinando isBlank(), contains("@") e length() de tamanho mínimo.',
          'Uso de variáveis intermediárias explicativas para clareza do fluxo lógico.',
          'Compilação e execução corretas no terminal local com histórico de Git limpo.'
        ]
      }
    ]
  }
];

export default function GuidedStringBasicsLesson029({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-string-basics-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Oficina de Processamento Textual</span>
        <p className="guided-sequence">029 · M1.09</p>
        <h1>String Básica</h1>
        <p>Aprenda a tratar texto como dado de verdade. Domine length, isEmpty vs isBlank, trim, a comparação lógica com equals contra as armadilhas do ==, e o encadeamento de métodos.</p>
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

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'trim / equals', label: 'métodos de dados' }, { value: 'isBlank()', label: 'validação de formulário' }, { value: 'Chaining', label: 'encadeamento' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 029">
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
              <h3>{lessonComplete ? 'Validações e tratamentos de Strings dominados!' : 'Oficina concluída'}</h3>
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
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 028</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Texto como dado real' : allStepsComplete ? 'Use o botão acima' : 'Pratique equals(), trim() e isEmpty()'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir Entrada de dados com Scanner'}>Aula 030 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
