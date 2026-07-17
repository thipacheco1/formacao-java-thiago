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
import './guidedScannerInputLesson.css';

const STORAGE_KEY = 'guided-scanner-input-lesson-030-progress';

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'Cadastro Simples', file: 'CadastroSimples.java',
    code: 'import java.util.Locale;\nimport java.util.Scanner;\n\npublic class CadastroSimples {\n    public static void main(String[] args) {\n        Locale.setDefault(Locale.US);\n        Scanner scanner = new Scanner(System.in);\n\n        System.out.println("Digite o nome:");\n        String nome = scanner.nextLine();\n\n        System.out.println("Digite a idade:");\n        int idade = scanner.nextInt();\n\n        System.out.println("Digite o valor da compra:");\n        double valorCompra = scanner.nextDouble();\n\n        System.out.println("Nome: " + nome);\n        System.out.println("Idade: " + idade);\n        System.out.println("Valor da compra: " + valorCompra);\n\n        scanner.close();\n    }\n}',
    output: 'Digite o nome:\nAna\nDigite a idade:\n30\nDigite o valor da compra:\n150.75\nNome: Ana\nIdade: 30\nValor da compra: 150.75',
    insight: 'Este fluxo funciona sem limpeza de buffer porque nenhuma leitura textual de nextLine() é executada após a leitura numérica.'
  },
  {
    id: 1, label: 'Limpeza de Buffer', file: 'CadastroComObservacao.java',
    code: 'import java.util.Locale;\nimport java.util.Scanner;\n\npublic class CadastroComObservacao {\n    public static void main(String[] args) {\n        Locale.setDefault(Locale.US);\n        Scanner scanner = new Scanner(System.in);\n\n        System.out.println("Digite o nome:");\n        String nome = scanner.nextLine();\n\n        System.out.println("Digite a idade:");\n        int idade = scanner.nextInt();\n\n        System.out.println("Digite o valor da compra:");\n        double valorCompra = scanner.nextDouble();\n        scanner.nextLine(); // LIMPA O BUFFER\n\n        System.out.println("Digite uma observação:");\n        String observacao = scanner.nextLine();\n\n        System.out.println("Nome: " + nome);\n        System.out.println("Idade: " + idade);\n        System.out.println("Observação: " + observacao);\n\n        scanner.close();\n    }\n}',
    output: 'Digite o nome:\nAna\nDigite a idade:\n30\nDigite o valor da compra:\n99.90\nDigite uma observação:\nUrgente!\nNome: Ana\nIdade: 30\nObservação: Urgente!',
    insight: 'A limpeza de buffer scanner.nextLine() após o nextDouble() impede que a pergunta de observação seja pulada pela JVM.'
  },
  {
    id: 2, label: 'Cadastro Cliente', file: 'CadastroClienteConsole.java',
    code: 'import java.util.Scanner;\n\npublic class CadastroClienteConsole {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n\n        System.out.println("Digite o nome:");\n        String nome = scanner.nextLine();\n\n        System.out.println("Digite o e-mail:");\n        String email = scanner.nextLine();\n\n        System.out.println("Digite o CPF:");\n        String cpf = scanner.nextLine();\n\n        boolean nomeValido = !nome.isBlank();\n        boolean emailValido = email.contains("@");\n        boolean cpfValido = cpf.length() == 11;\n\n        System.out.println("Nome informado: " + nomeValido);\n        System.out.println("Email possui @: " + emailValido);\n        System.out.println("CPF com 11 dígitos: " + cpfValido);\n\n        scanner.close();\n    }\n}',
    output: 'Digite o nome:\nAna Silva\nDigite o e-mail:\nana@exemplo.com\nDigite o CPF:\n12345678900\nNome informado: true\nEmail possui @: true\nCPF com 11 dígitos: true',
    insight: 'Combinação de leituras dinâmicas com os métodos de string isBlank(), contains() e length() para validações de domínio.'
  },
  {
    id: 3, label: 'Cadastro OS', file: 'CadastroOrdemServicoConsole.java',
    code: 'import java.util.Scanner;\n\npublic class CadastroOrdemServicoConsole {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n\n        System.out.println("Número da OS:");\n        String numero = scanner.nextLine();\n\n        System.out.println("Atividades (qtd):");\n        int atividades = scanner.nextInt();\n        scanner.nextLine(); // Limpa buffer\n\n        System.out.println("Observação:");\n        String obs = scanner.nextLine();\n\n        System.out.println("Número OS: " + numero);\n        System.out.println("Atividades: " + atividades);\n        System.out.println("Observação: " + obs);\n\n        scanner.close();\n    }\n}',
    output: 'Número da OS:\nOS-1001\nAtividades (qtd):\n4\nObservação:\nReagendar\nNúmero OS: OS-1001\nAtividades: 4\nObservação: Reagendar',
    insight: 'Quando realizamos leituras de strings (nextLine()) após a entrada de inteiros (nextInt()), a limpeza de buffer é obrigatória.'
  }
];

const ERRORS = [
  { title: 'Esquecer o Import', code: 'Scanner sc = new Scanner(System.in);', symptom: 'cannot find symbol: class Scanner', cause: 'A classe Scanner não reside no pacote padrão java.lang, necessitando de importação explícita.', fix: 'Insira no topo do arquivo: import java.util.Scanner;' },
  { title: 'Fechar cedo demais', code: 'scanner.close();\nString nome = scanner.nextLine();', symptom: 'java.lang.IllegalStateException: Scanner closed', cause: 'Invocar qualquer leitura em um scanner já descartado dispara falha imediata da JVM.', fix: 'Feche o scanner exclusivamente no final do método main, após concluir todas as leituras.' },
  { title: 'Errar tipo numérico', code: 'int idade = scanner.nextInt(); // Digita: "trinta"', symptom: 'java.util.InputMismatchException', cause: 'O método nextInt() exige de forma estrita dígitos inteiros. Caracteres textuais causam quebra.', fix: 'Digite apenas números. Tratamento robusto com loops e exceções será estudado em módulos avançados.' },
  { title: 'Vírgula decimal com Locale US', code: 'Locale.setDefault(Locale.US);\ndouble val = scanner.nextDouble(); // Digita: "99,90"', symptom: 'java.util.InputMismatchException', cause: 'Com Locale.US, o Java espera o ponto (.) como separador. A vírgula é considerada inválida.', fix: 'Digite números decimais utilizando ponto (ex: 99.90).' },
  { title: 'Buffer não limpo', code: 'int idade = scanner.nextInt();\nString nome = scanner.nextLine();', symptom: 'O console pula a pergunta do nome e avalia como String vazia ""', cause: 'O método nextInt() lê o número mas deixa a quebra de linha (\\n) no buffer. O nextLine() engole o \\n.', fix: 'Insira um scanner.nextLine() extra logo após o nextInt() para limpar a fila.' },
  { title: 'next() lê só uma palavra', code: 'String nome = scanner.next(); // Digita: "Ana Silva"', symptom: 'A variável nome recebe apenas "Ana"', cause: 'O método next() encerra a leitura no primeiro espaço em branco encontrado.', fix: 'Substitua pelo método nextLine(), que lê a linha inteira incluindo os espaços.' },
  { title: 'Múltiplos Scanners', code: 'Scanner s1 = new Scanner(System.in);\nScanner s2 = new Scanner(System.in);', symptom: 'Falha ou comportamento indefinido na leitura do teclado', cause: 'Criar múltiplas instâncias de Scanner apontando concorrentemente para a mesma entrada System.in.', fix: 'Use uma única variável de Scanner para gerenciar todas as leituras do console.' },
  { title: 'Declarar sem inicializar', code: 'Scanner scanner;\nString s = scanner.nextLine();', symptom: 'variable scanner might not have been initialized', cause: 'A variável foi declarada no Stack, mas o objeto Scanner não foi instanciado.', fix: 'Inicialize com o construtor: Scanner scanner = new Scanner(System.in);' },
  { title: 'Sem instrução prévia', code: 'String cep = scanner.nextLine();', symptom: 'O console fica piscando sem que o usuário saiba o que digitar', cause: 'O programa bloqueia à espera de dados sem antes imprimir uma mensagem explicativa.', fix: 'Coloque sempre um System.out.println("Digite o CEP:"); antes da leitura.' },
  { title: 'Não validar texto branco', code: 'String nome = scanner.nextLine(); // Usuário dá espaços\n// Processa sem verificar...', symptom: 'Cadastro de usuários contendo nomes falsos formados por espaços', cause: 'Aceitar o resultado da leitura crua sem validar a consistência com isBlank().', fix: 'Valide sempre as entradas: if (!nome.isBlank()) { ... }' }
];

const EVIDENCE = [
  '# Aula 030 — Entrada de Dados com Scanner', '',
  '## Arquitetura de Entrada', '- [ ] Entendi que System.in representa a entrada padrão (teclado/console)', '- [ ] Compreendi a necessidade de importar java.util.Scanner', '- [ ] Instanciei o Scanner e utilizei scanner.close() de forma segura', '',
  '## Tipos de Leitura', '- [ ] Li strings completas utilizando o método nextLine()', '- [ ] Diferenciei o comportamento truncado do next() contra o nextLine()', '- [ ] Li inteiros com nextInt() e decimais com nextDouble()', '- [ ] Configurei Locale.US para padronizar pontos decimais', '',
  '## Lógica de Buffer', '- [ ] Vivenciei e depurei o erro do buffer (pular perguntas)', '- [ ] Apliquei scanner.nextLine() para higienizar a quebra de linha (\\n)', '',
  '## Evidências locais', '- [ ] Criei, compilei e executei as 11 classes locais', '- [ ] Garanti a ausência de arquivos binários compilados .class no Git', '',
  '## Decisão de Projeto', '- Cadastro de fretes e auditorias no desafio de transferência:', '- Por que o buffer de entrada do console difere de fluxos web HTTP:'
].join('\n');

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="scan30-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file scan30-code">
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

function ConsoleInputLab() {
  const [stage, setStage] = useState(0); // 0: nome, 1: idade, 2: frete, 3: observacao, 4: concluido
  const [nome, setNome] = useState('');
  const [idadeStr, setIdadeStr] = useState('');
  const [freteStr, setFreteStr] = useState('');
  const [obs, setObs] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const processNome = () => {
    if (nome.trim() === '') {
      setErrorMsg('Erro: Nome não pode estar em branco.');
      return;
    }
    setErrorMsg(null);
    setStage(1);
  };

  const processIdade = () => {
    const parsed = parseInt(idadeStr, 10);
    if (isNaN(parsed) || String(parsed) !== idadeStr.trim() || parsed <= 0) {
      setErrorMsg('java.util.InputMismatchException: Esperado valor numérico inteiro válido.');
      return;
    }
    setErrorMsg(null);
    setStage(2);
  };

  const processFrete = () => {
    const parsed = parseFloat(freteStr);
    if (isNaN(parsed) || parsed <= 0.0 || freteStr.includes(',')) {
      setErrorMsg('java.util.InputMismatchException: Esperado decimal válido com ponto (.) regional (Locale.US).');
      return;
    }
    setErrorMsg(null);
    setStage(3);
  };

  const processObs = () => {
    setErrorMsg(null);
    setStage(4);
  };

  const restart = () => {
    setStage(0);
    setNome('');
    setIdadeStr('');
    setFreteStr('');
    setObs('');
    setErrorMsg(null);
  };

  return <section className="scan30-console-box">
    <div className="scan30-console-header">
      <Terminal size={16} /> Console do Java — Entrada de Dados Interativa
      <button type="button" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '.7rem' }} onClick={restart}>Reiniciar</button>
    </div>
    <div className="scan30-console-screen">
      {stage >= 0 && (
        <div className="scan30-console-line">
          <span>Digite seu nome:</span>
          {stage === 0 ? (
            <div className="scan30-console-input-wrap">
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} onKeyDown={e => e.key === 'Enter' && processNome()} placeholder="..." />
              <button type="button" onClick={processNome}>Enter</button>
            </div>
          ) : (
            <strong style={{ color: '#fff' }}>{nome}</strong>
          )}
        </div>
      )}

      {stage >= 1 && (
        <div className="scan30-console-line">
          <span>Digite sua idade:</span>
          {stage === 1 ? (
            <div className="scan30-console-input-wrap">
              <input type="text" value={idadeStr} onChange={e => setIdadeStr(e.target.value)} onKeyDown={e => e.key === 'Enter' && processIdade()} placeholder="..." />
              <button type="button" onClick={processIdade}>Enter</button>
            </div>
          ) : (
            <strong style={{ color: '#fff' }}>{idadeStr}</strong>
          )}
        </div>
      )}

      {stage >= 2 && (
        <div className="scan30-console-line">
          <span>Digite o valor do frete (Locale.US):</span>
          {stage === 2 ? (
            <div className="scan30-console-input-wrap">
              <input type="text" value={freteStr} onChange={e => setFreteStr(e.target.value)} onKeyDown={e => e.key === 'Enter' && processFrete()} placeholder="ex: 120.50" />
              <button type="button" onClick={processFrete}>Enter</button>
            </div>
          ) : (
            <strong style={{ color: '#fff' }}>{freteStr}</strong>
          )}
        </div>
      )}

      {stage >= 3 && (
        <div className="scan30-console-line">
          <span>Digite a observação do frete:</span>
          {stage === 3 ? (
            <div className="scan30-console-input-wrap">
              <input type="text" value={obs} onChange={e => setObs(e.target.value)} onKeyDown={e => e.key === 'Enter' && processObs()} placeholder="..." />
              <button type="button" onClick={processObs}>Enter</button>
            </div>
          ) : (
            <strong style={{ color: '#fff' }}>{obs}</strong>
          )}
        </div>
      )}

      {stage === 4 && (
        <div style={{ marginTop: '14px', borderTop: '1px dashed #34d399', paddingTop: '10px', color: '#fff' }}>
          <h4>Dados Recebidos com Sucesso:</h4>
          <p style={{ margin: '4px 0', fontSize: '.74rem', color: '#a7f3d0' }}>
            Nome: {nome} | Idade: {idadeStr} | Frete: US$ {freteStr} | Obs: {obs}
          </p>
        </div>
      )}

      {errorMsg && (
        <pre style={{ color: '#f87171', background: '#450a0a', border: '1px solid #7f1d1d', padding: '10px', borderRadius: '8px', fontSize: '.7rem', margin: '6px 0 0', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
          {errorMsg}
        </pre>
      )}
    </div>
  </section>;
}

function BufferSimulatorLab() {
  const [cleaned, setCleaned] = useState(false);
  const [step, setStep] = useState(0); // 0: inicial, 1: read int, 2: read line

  // Buffer queue items
  // 3 0 \n N o m e \n
  const initialItems = [
    { v: '3', type: 'char' },
    { v: '0', type: 'char' },
    { v: '\\n', type: 'nl' },
    { v: 'A', type: 'char' },
    { v: 'n', type: 'char' },
    { v: 'a', type: 'char' },
    { v: '\\n', type: 'nl' }
  ];

  const getQueue = () => {
    if (step === 0) return initialItems;
    if (step === 1) {
      // nextInt consumes 3 and 0
      return initialItems.slice(2);
    }
    if (step === 2) {
      if (cleaned) {
        // the extra nextLine consumed the \n, now another nextLine consumes Ana\n
        return [];
      } else {
        // nextLine immediately consumed the first \n, leaving Ana\n
        return initialItems.slice(3);
      }
    }
    return [];
  };

  const currentQueue = getQueue();

  const handleNextInt = () => {
    setStep(1);
  };

  const handleNextLine = () => {
    setStep(2);
  };

  const handleCleanAndNextLine = () => {
    setCleaned(true);
    setStep(2);
  };

  const reset = () => {
    setStep(0);
    setCleaned(false);
  };

  return <section className="scan30-buffer-simulator">
    <div className="scan30-buffer-panel">
      <div className="scan30-buffer-queue-wrap">
        <span style={{ fontSize: '.6rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Fila do Buffer de entrada da JVM (teclado):</span>
        <div className="scan30-buffer-queue">
          {currentQueue.length === 0 ? (
            <span className="scan30-buffer-empty">Fila Vazia (Buffer Consumido)</span>
          ) : (
            currentQueue.map((item, idx) => (
              <span key={idx} className={`scan30-buffer-item ${item.type}`}>
                {item.v}
              </span>
            ))
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="button" onClick={reset} style={{ padding: '8px 12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>Reiniciar Fila</button>
        <button type="button" disabled={step !== 0} onClick={handleNextInt} style={{ padding: '8px 12px', background: step === 0 ? 'var(--scan30-emerald)' : '#fff', color: step === 0 ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>1. Executar nextInt()</button>
        <button type="button" disabled={step !== 1} onClick={handleNextLine} style={{ padding: '8px 12px', background: step === 1 ? '#ef4444' : '#fff', color: step === 1 ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>2. Ler String SEM Limpeza</button>
        <button type="button" disabled={step !== 1} onClick={handleCleanAndNextLine} style={{ padding: '8px 12px', background: step === 1 ? '#10b981' : '#fff', color: step === 1 ? '#fff' : '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.7rem', fontWeight: 'bold', cursor: 'pointer' }}>2. Limpar Buffer + Ler String</button>
      </div>

      <p style={{ margin: 0, fontSize: '.72rem', lineHeight: 1.5, color: '#064e3b' }}>
        {step === 0 && 'A fila contém o número 30, o Enter (\\n), o nome Ana e outro Enter (\\n).'}
        {step === 1 && 'O nextInt() recolheu "3" e "0" para formar o número 30. No entanto, a quebra de linha (\\n) ficou para trás, boiando no topo da fila!'}
        {step === 2 && !cleaned && 'Erro! O nextLine() foi executado, mas ao invés de ler "Ana", ele engoliu de imediato o \\n pendente na fila e retornou vazio! O console pulou a pergunta do nome.'}
        {step === 2 && cleaned && 'Sucesso! O scanner.nextLine() intermediário recolheu e descartou a quebra \\n pendente. O próximo nextLine() pôde consumir "Ana" e o Enter de forma correta!'}
      </p>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px', background: '#fff', borderColor: '#cbd5e1' }}>
        <Lightbulb size={22} style={{ color: 'var(--scan30-emerald)' }} />
        <div>
          <strong>A Pegadinha do Enter</strong>
          <p style={{ fontSize: '.65rem', lineHeight: 1.45, color: '#475569', margin: '2px 0 0' }}>
            Métodos numéricos como nextInt() e nextDouble() não consomem a quebra de linha gerada pela tecla Enter. Ela permanece na fila de entrada e é engolida pelo próximo nextLine(), pulando a pergunta. Limpe sempre a fila!
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function LocaleSimulatorLab() {
  const [locale, setLocale] = useState('US');
  const [val, setVal] = useState('99.90');

  const isOk = locale === 'US' ? (val.includes('.') && !val.includes(',')) : (val.includes(',') && !val.includes('.'));

  return <section className="scan30-locale-simulator">
    <div className="scan30-locale-panel">
      <div className="scan30-locale-switch">
        <button type="button" className={locale === 'US' ? 'active' : ''} onClick={() => { setLocale('US'); setVal('99.90'); }}>Locale.US (Padrão Americano)</button>
        <button type="button" className={locale === 'BR' ? 'active' : ''} onClick={() => { setLocale('BR'); setVal('99,90'); }}>Locale (Padrão Brasileiro)</button>
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '.7rem', color: '#475569' }}>Valor digitado no console:</span>
        <input
          type="text"
          value={val}
          onChange={e => setVal(e.target.value)}
          style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontFamily: 'Consolas, monospace', fontSize: '.78rem' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
        <span className={`str29-state-badge ${isOk}`} style={{ background: isOk ? '#dcfce7' : '#fee2e2', color: isOk ? '#15803d' : '#991b1b', border: 0 }}>
          {isOk ? 'Leitura Aceita' : 'Erro de Conversão'}
        </span>
        <span style={{ fontSize: '.7rem', color: '#475569' }}>
          {isOk ? 'O Java lê o decimal e guarda o valor 99.9 com sucesso.' : 'java.util.InputMismatchException lançado no console!'}
        </span>
      </div>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px', background: '#f0fdf4', borderColor: '#bbf7d0', color: '#064e3b' }}>
        <Lightbulb size={22} style={{ color: 'var(--scan30-emerald)' }} />
        <div>
          <strong>Locale Padronizado</strong>
          <p style={{ fontSize: '.65rem', lineHeight: 1.4, color: '#475569', margin: '2px 0 0' }}>
            Utilizar <code>Locale.setDefault(Locale.US)</code> garante que o separador decimal seja sempre o ponto (.), independente de onde a aplicação seja executada (sua máquina, servidor em nuvem ou máquina do avaliador).
          </p>
        </div>
      </aside>
    </div>
  </section>;
}

function NextVsNextLineLab() {
  const [text, setText] = useState('Ana Silva');

  const word = text.trim().split(/\s+/)[0] || '';

  return <section className="scan30-locale-panel" style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '20px' }}>
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <span style={{ fontSize: '.72rem', color: '#475569' }}>Entrada digitada pelo usuário:</span>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        style={{ flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontFamily: 'Consolas, monospace', fontSize: '.78rem' }}
      />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
        <h4 style={{ margin: '0 0 6px', color: '#475569', fontSize: '.72rem' }}>scanner.next()</h4>
        <span style={{ fontSize: '.6rem', color: '#94a3b8', textTransform: 'uppercase' }}>Retorno lido:</span>
        <div style={{ fontFamily: 'Consolas, monospace', fontSize: '.8rem', color: '#0f172a', fontWeight: 'bold', marginTop: '2px' }}>
          "{word}"
        </div>
        <p style={{ fontSize: '.64rem', color: '#64748b', margin: '4px 0 0', lineHeight: 1.35 }}>Lê apenas até o primeiro espaço em branco (um token).</p>
      </div>
      <div style={{ padding: '12px', background: 'var(--scan30-emerald-soft)', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
        <h4 style={{ margin: '0 0 6px', color: 'var(--scan30-emerald)', fontSize: '.72rem' }}>scanner.nextLine()</h4>
        <span style={{ fontSize: '.6rem', color: '#94a3b8', textTransform: 'uppercase' }}>Retorno lido:</span>
        <div style={{ fontFamily: 'Consolas, monospace', fontSize: '.8rem', color: '#0f172a', fontWeight: 'bold', marginTop: '2px' }}>
          "{text}"
        </div>
        <p style={{ fontSize: '.64rem', color: '#64748b', margin: '4px 0 0', lineHeight: 1.35 }}>Lê a linha inteira, contendo espaços e caracteres.</p>
      </div>
    </div>
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="scan30-domains-gallery">
    <div className="scan30-domains-sidebar">
      {DOMAIN_PROGRAMS.map((entry, index) => (
        <button key={entry.id} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          {entry.label}
        </button>
      ))}
    </div>
    <div className="scan30-domains-content">
      <CodePanel name={item.file} code={item.code} />
      <section className="scan30-console">
        <header><Terminal size={15} /> Console de simulação de execução</header>
        <pre>{item.output}</pre>
        <p style={{ display: 'flex', gap: '8px', margin: '0', padding: '12px 14px', alignItems: 'flex-start', color: '#94a3b8', background: '#1e293b', borderTop: '1px solid #334155', fontSize: '.72rem', lineHeight: 1.5 }}>
          <Sparkles size={16} style={{ color: 'var(--scan30-emerald)', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="scan30-errors-clinic">
    <nav className="scan30-errors-nav">
      {ERRORS.map((entry, index) => (
        <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="scan30-error-card">
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
      <div className="scan30-error-flow">
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
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-030-scanner\ncd labs\\m1\\aula-030-scanner\nNew-Item Main.java, LeituraNome.java, LeituraIdade.java, LeituraValor.java, CadastroSimples.java, CadastroComObservacao.java, CadastroClienteConsole.java, CadastroPedidoConsole.java, CadastroOrdemServicoConsole.java, CadastroProdutoConsole.java, RegistroAuditoriaConsole.java',
      out: 'Onze arquivos Java criados na estrutura do repositório.',
      tip: 'Abra a pasta labs/m1/aula-030-scanner no seu IntelliJ e copie os respectivos códigos de negócio.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac *.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Verifique se não há erros de import ou digitação sintática nos tipos e Locale.'
    },
    {
      title: 'Executar Programas',
      cmd: 'java CadastroComObservacao\n[Digite os dados solicitados no terminal]',
      out: 'Nome: Ana\nIdade: 30\nObservação: Urgente!',
      tip: 'Teste digitar valores textuais em campos numéricos para ver o InputMismatchException quebrar o programa.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-030-scanner docs/diario-de-bordo.md\ngit commit -m "Aula 030: pratica entrada com Scanner"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Verifique se os binários compilados .class foram descartados pelo .gitignore local.'
    }
  ];

  const current = steps[stage];

  return <section className="scan30-terminal-flow">
    <div className="bool27-delivery-flow">
      <nav className="scan30-delivery-flow nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="scan30-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="scan30-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file scan30-code" style={{ marginTop: '14px' }}>
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
  if (block.type === 'console_input') return <ConsoleInputLab />;
  if (block.type === 'buffer_simulator') return <BufferSimulatorLab />;
  if (block.type === 'locale_simulator') return <LocaleSimulatorLab />;
  if (block.type === 'next_vs_nextline') return <NextVsNextLineLab />;
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
    eyebrow: 'Console',
    label: 'Terminal Interativo',
    title: 'Perguntando e Recebendo Respostas',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'Experimente a interação dinâmica de console digitando dados no terminal simulado. Erros de digitação geram as exceções da JVM correspondentes:' },
      { type: 'console_input' }
    ]
  },
  {
    id: 'buffer',
    eyebrow: 'Simulação',
    label: 'Pegadinha do Buffer',
    title: 'A Fila de Caracteres da JVM',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Descubra por que a JVM "pula" perguntas de texto após a leitura de inteiros, e como a quebra de linha (\\n) fica retida na fila física:' },
      { type: 'buffer_simulator' }
    ]
  },
  {
    id: 'locale',
    eyebrow: 'Regionalização',
    label: 'Vírgula vs Ponto',
    title: 'Padronizando Decimais com Locale.US',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Chaveie a configuração de Locale e teste como o console Java se comporta ao receber números com vírgula ou com ponto decimal:' },
      { type: 'locale_simulator' }
    ]
  },
  {
    id: 'next',
    eyebrow: 'Sintaxe',
    label: 'next() vs nextLine()',
    title: 'Truncamento de Espaços',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'Digite entradas compostas por espaços (como nome e sobrenome) e veja a diferença de captura das duas funções do Scanner:' },
      { type: 'next_vs_nextline' }
    ]
  },
  {
    id: 'exemplos',
    eyebrow: 'Aplicações',
    label: 'Casos Práticos',
    title: 'Galeria de programas aplicados',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Explore os programas reais de cadastro de clientes, ordens de serviços e auditorias dinâmicas de console:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Falhas clássicas de Scanner e System.in',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Depure e diagnostique os 10 sintomas e falhas frequentes ao instanciar, fechar ou converter tipos com Scanner:' },
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
        title: 'Desafio Prático de Transferência: Cadastro de Frete',
        text: 'Crie o arquivo CadastroFreteConsole.java em labs/m1/aula-030-scanner/. Configure o Locale padrão americano. Pergunte e leia do console: código de frete (String), peso da carga em kg (double), limpe o buffer, descrição da mercadoria (String) e se a entrega é urgente (boolean via comparação). Valide que o código e a descrição não estão em branco (isBlank()) e que o peso é maior que 0.0. Exiba o recibo formatado com tabulações \\t e quebras de linha \\n no console.',
        acceptance: [
          'Instanciação correta de Scanner associado a System.in.',
          'Configuração regional Locale.US declarada antes do Scanner.',
          'Limpeza de buffer obrigatória com scanner.nextLine() antes da leitura de texto.',
          'Validações lógicas elementares de consistência dos dados de frete.',
          'Compilação e execução corretas no terminal local com histórico de Git limpo.'
        ]
      }
    ]
  }
];

export default function GuidedScannerInputLesson030({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-scanner-input-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Oficina de Entrada Dinâmica</span>
        <p className="guided-sequence">030 · M1.10</p>
        <h1>Entrada de Dados com Scanner</h1>
        <p>Faça seus programas perguntarem e receberem respostas. Domine nextLine, nextInt, nextDouble, Locale regional, e aprenda a desarmar o clássico bug da fila de buffer de caracteres do Enter.</p>
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

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'Scanner', label: 'classe de leitura' }, { value: 'Locale.US', label: 'padronização' }, { value: 'Buffer \\n', label: 'higienização' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 030">
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
              <h3>Interatividade e Scanner dominados!</h3>
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
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 029</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Entrada de dados dominada' : allStepsComplete ? 'Use o botão acima' : 'Pratique buffer, nextLine() e Locale'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir Operadores Aritméticos'}>Aula 031 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
