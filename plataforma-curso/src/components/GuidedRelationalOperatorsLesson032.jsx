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
import './guidedRelationalOperatorsLesson.css';

const STORAGE_KEY = 'guided-relational-operators-lesson-032-progress';

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'Main Relacional', file: 'Main.java',
    code: 'public class Main {\n    public static void main(String[] args) {\n        int valorA = 10;\n        int valorB = 5;\n\n        System.out.println("A > B: " + (valorA > valorB));\n        System.out.println("A < B: " + (valorA < valorB));\n        System.out.println("A >= B: " + (valorA >= valorB));\n        System.out.println("A <= B: " + (valorA <= valorB));\n        System.out.println("A == B: " + (valorA == valorB));\n        System.out.println("A != B: " + (valorA != valorB));\n    }\n}',
    output: 'A > B: true\nA < B: false\nA >= B: true\nA <= B: false\nA == B: false\nA != B: true',
    insight: 'Use sempre parênteses ao concatenar expressões relacionais em prints para evitar que o operador + concatene antes de comparar.'
  },
  {
    id: 1, label: 'Validação Estoque', file: 'ValidacaoEstoque.java',
    code: 'public class ValidacaoEstoque {\n    public static void main(String[] args) {\n        int quantidadeEstoque = 15;\n        int quantidadeMinima = 5;\n\n        boolean possuiEstoque = quantidadeEstoque > 0;\n        boolean estoqueBaixo = quantidadeEstoque < quantidadeMinima;\n        boolean estoqueNoMinimo = quantidadeEstoque == quantidadeMinima;\n        boolean estoqueAcimaDoMinimo = quantidadeEstoque > quantidadeMinima;\n\n        System.out.println("Possui estoque: " + possuiEstoque);\n        System.out.println("Estoque baixo: " + estoqueBaixo);\n        System.out.println("Estoque no mínimo: " + estoqueNoMinimo);\n        System.out.println("Estoque acima do mínimo: " + estoqueAcimaDoMinimo);\n    }\n}',
    output: 'Possui estoque: true\nEstoque baixo: false\nEstoque no mínimo: false\nEstoque acima do mínimo: true',
    insight: 'Exemplo de várias perguntas feitas sobre a mesma variável, armazenando o resultado booleano em variáveis explicativas.'
  },
  {
    id: 2, label: 'Validação OS', file: 'ValidacaoOrdemServico.java',
    code: 'public class ValidacaoOrdemServico {\n    public static void main(String[] args) {\n        int quantidadeAtividades = 2;\n        int quantidadeReagendamentos = 1;\n        int limiteReagendamentos = 3;\n\n        boolean possuiAtividades = quantidadeAtividades > 0;\n        boolean semAtividades = quantidadeAtividades == 0;\n        boolean podeReagendarMaisVezes = quantidadeReagendamentos < limiteReagendamentos;\n        boolean atingiuLimiteReagendamentos = quantidadeReagendamentos >= limiteReagendamentos;\n\n        System.out.println("Possui atividades: " + possuiAtividades);\n        System.out.println("Sem atividades: " + semAtividades);\n        System.out.println("Pode reagendar: " + podeReagendarMaisVezes);\n    }\n}',
    output: 'Possui atividades: true\nSem atividades: false\nPode reagendar: true',
    insight: 'Aplicação prática para triagem e regras de workflows em backend de ordens de serviços corporativas.'
  },
  {
    id: 3, label: 'Igualdade de Strings', file: 'ValidacaoStatusTexto.java',
    code: 'public class ValidacaoStatusTexto {\n    public static void main(String[] args) {\n        String statusPedido = "PENDENTE";\n\n        boolean pedidoPendente = "PENDENTE".equals(statusPedido);\n        boolean pedidoAprovado = "APROVADO".equals(statusPedido);\n        boolean pedidoNaoCancelado = !"CANCELADO".equals(statusPedido);\n\n        System.out.println("Pedido pendente: " + pedidoPendente);\n        System.out.println("Pedido aprovado: " + pedidoAprovado);\n        System.out.println("Pedido não cancelado: " + pedidoNaoCancelado);\n    }\n}',
    output: 'Pedido pendente: true\nPedido aprovado: false\nPedido não cancelado: true',
    insight: 'A comparação segura de Strings é feita com .equals(). O operador ! nega a resposta final para expressar negações.'
  }
];

const ERRORS = [
  { title: 'Usar = em vez de ==', code: 'boolean igual = (quantidade = 10);', symptom: 'O Java atribui o valor 10 e pode gerar erro de incompatibilidade de tipos', cause: 'O operador = é de atribuição de dados, enquanto o == é de comparação lógica de igualdade.', fix: 'Substitua o operador para comparação: quantidade == 10;' },
  { title: 'Exclusão indesejada de limite', code: 'boolean maiorDeIdade = idade > 18; // Idade: 18', symptom: 'Retorna false para uma idade de 18 anos', cause: 'O operador > exclui o valor limite exato informado na comparação.', fix: 'Utilize o operador maior ou igual se a fronteira for inclusiva: idade >= 18;' },
  { title: 'Comparação de conteúdo textual com ==', code: 'String status = new String("ABERTA");\nboolean aberto = (status == "ABERTA");', symptom: 'Retorna false mesmo com caracteres iguais', cause: 'O operador == testa identidade de referência, não equivalência de conteúdo.', fix: 'Use equals() para conteúdo e a constante à esquerda se status puder ser null: "ABERTA".equals(status);' },
  { title: 'Comparação com boolean redundante', code: 'boolean ativo = (clienteAtivo == true);', symptom: 'Código poluído com ruído visual redundante', cause: 'Variáveis booleanas já contêm por si mesmas os valores lógicos true ou false.', fix: 'Simplifique para a leitura direta: boolean ativo = clienteAtivo;' },
  { title: 'Comparação com false redundante', code: 'boolean ok = (pendente == false);', symptom: 'Código poluído e pouco natural', cause: 'Comparar com false pode ser expresso simplesmente pela negação da variável.', fix: 'Utilize o operador de negação: boolean ok = !pendente;' },
  { title: 'Concatenação de print sem parênteses', code: 'System.out.println("Resultado: " + A > B);', symptom: 'Erro de compilação ou concatenação incorreta', cause: 'O operador + de String lê da esquerda para a direita e concatena A antes do teste relacional.', fix: 'Envolva a expressão relacional com parênteses: System.out.println("Resultado: " + (A > B));' },
  { title: 'Igualdade com double calculado', code: 'boolean ok = ((0.1 + 0.2) == 0.3);', symptom: 'Retorna false de forma inesperada', cause: 'O ponto flutuante de tipo double carrega imprecisões decimais físicas de cálculo (0.30000000000000004).', fix: 'Evite igualdade exata de doubles. Calcule em centavos de tipo long ou use BigDecimal.' },
  { title: 'Nome booleano genérico', code: 'boolean flag = (valorTotal > 0);', symptom: 'Código difícil de ler e depurar', cause: 'Nomes de variáveis como "flag", "resultado" ou "teste" ocultam a intenção da regra.', fix: 'Utilize nomes profissionais e autoexplicativos: boolean possuiValorTotal = (valorTotal > 0);' },
  { title: 'Falta de teste de fronteira', code: 'boolean estoqueBaixo = (estoque < 5); // Não testa com 5', symptom: 'Comportamento incorreto não detectado nos limites exatos da regra', cause: 'Não validar valores limiares exatos de limite durante a homologação do algoritmo.', fix: 'Teste o limite com valores de fronteira (ex: para limite 5, teste 4, 5 e 6).' },
  { title: 'Negação dupla confusa', code: 'boolean ativo = !(!statusAtivo);', symptom: 'Código redundante que prejudica o raciocínio', cause: 'Aplicar múltiplas negações seguidas sobre uma mesma variável lógica.', fix: 'Mantenha a variável crua ou utilize uma única negação direta: boolean ativo = statusAtivo;' }
];

const EVIDENCE = [
  '# Aula 032 — Operadores Relacionais', '',
  '## Comparações Lógicas', '- [ ] Entendi o papel de todos os operadores relacionais (>, <, >=, <=, ==, !=)', '- [ ] Diferenciei atribuição (=) de comparação de igualdade (==)', '- [ ] Nomeei variáveis booleanas seguindo o padrão profissional (possuiEstoque, etc.)', '',
  '## Fronteiras de Dados', '- [ ] Testei valores de fronteira de limites mínimos e máximos', '- [ ] Evitei igualdades exatas de tipo double', '- [ ] Comparei caracteres char usando aspas simples', '',
  '## String e equals', '- [ ] Diferenciei identidade de referência e igualdade de conteúdo', '- [ ] Usei equals() em vez de == para conteúdo textual', '- [ ] Simplifiquei testes redundantes com booleanos', '',
  '## Evidências locais', '- [ ] Criei, compilei e testei as 12 classes locais', '- [ ] Garanti a ausência de arquivos binários compilados .class no Git', '',
  '## Decisão de Projeto', '- Regras de triagem e limites avaliados no desafio de transferência:', '- Por que equals() difere de == ao comparar objetos:'
].join('\n');

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="rel32-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file rel32-code">
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

function GeneralSimLab() {
  const [valA, setValA] = useState(10);
  const [valB, setValB] = useState(5);
  const [op, setOp] = useState('>');

  let result = false;
  let reading = '';

  switch (op) {
    case '>': result = valA > valB; reading = 'A é maior que B?'; break;
    case '<': result = valA < valB; reading = 'A é menor que B?'; break;
    case '>=': result = valA >= valB; reading = 'A é maior ou igual a B?'; break;
    case '<=': result = valA <= valB; reading = 'A é menor ou igual a B?'; break;
    case '==': result = valA == valB; reading = 'A é igual a B?'; break;
    case '!=': result = valA != valB; reading = 'A é diferente de B?'; break;
    default: break;
  }

  return <section className="rel32-general-sim">
    <div className="rel32-sim-controls">
      <div style={{ display: 'flex', gap: '10px' }}>
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

      <label style={{ display: 'block', fontSize: '.65rem', color: '#475569', fontWeight: 'bold', marginBottom: '4px' }}>Escolha o Operador Relacional:</label>
      <div className="rel32-op-btn-grid">
        {['>', '<', '>=', '<=', '==', '!='].map(operator => (
          <button key={operator} type="button" className={op === operator ? 'active' : ''} onClick={() => setOp(operator)}>
            {operator}
          </button>
        ))}
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', background: '#f8fafc', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
      <div>
        <span style={{ fontSize: '.62rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Pergunta avaliada:</span>
        <strong style={{ fontSize: '.78rem', color: '#0f172a' }}>{reading}</strong>
      </div>
      <div>
        <span style={{ fontSize: '.62rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Expressão Java:</span>
        <code style={{ fontSize: '.8rem', color: 'var(--rel32-indigo)', fontWeight: 'bold', fontFamily: 'Consolas, monospace' }}>
          {valA} {op} {valB}
        </code>
      </div>
      <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className={`str29-state-badge ${result}`} style={{ background: result ? '#dcfce7' : '#fee2e2', color: result ? '#15803d' : '#991b1b', border: 0 }}>
          {String(result).toUpperCase()}
        </span>
        <span style={{ fontSize: '.66rem', color: '#475569' }}>Resultado retornado pela JVM.</span>
      </div>
    </div>
  </section>;
}

function ReguaFronteiraLab() {
  const [idade, setIdade] = useState(18);

  const maiorQue18 = idade > 18;
  const maiorOuIgual18 = idade >= 18;

  return <section className="rel32-regua-container">
    <span style={{ fontSize: '.62rem', color: '#475569', fontWeight: 'bold', textTransform: 'uppercase' }}>Escolha a idade do paciente na régua física:</span>
    <div className="rel32-regua-linha">
      {[17, 18, 19].map(tick => (
        <div key={tick} className="rel32-regua-tick" onClick={() => setIdade(tick)} style={{ opacity: idade === tick ? 1 : 0.4 }}>
          <span className="num">{tick} anos</span>
          <span className="badge" style={{ background: tick >= 18 ? '#10b981' : '#ef4444', color: '#fff' }}>
            {tick >= 18 ? 'Adulto' : 'Menor'}
          </span>
        </div>
      ))}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' }}>
      <div style={{ padding: '12px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '10px', opacity: maiorQue18 ? 1 : 0.7 }}>
        <h4 style={{ margin: '0 0 4px', fontSize: '.72rem', color: '#475569' }}>Limite Exclusivo: <code>idade &gt; 18</code></h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`str29-state-badge ${maiorQue18}`} style={{ background: maiorQue18 ? '#dcfce7' : '#fee2e2', color: maiorQue18 ? '#15803d' : '#991b1b', border: 0 }}>
            {String(maiorQue18)}
          </span>
          <span style={{ fontSize: '.64rem', color: '#64748b' }}>
            {idade === 18 ? 'Exclui o 18. Retorna false.' : maiorQue18 ? 'Verdadeiro.' : 'Falso.'}
          </span>
        </div>
      </div>
      <div style={{ padding: '12px', background: 'var(--rel32-violet-soft)', border: '1px solid #ddd6fe', borderRadius: '10px', opacity: maiorOuIgual18 ? 1 : 0.7 }}>
        <h4 style={{ margin: '0 0 4px', fontSize: '.72rem', color: 'var(--rel32-indigo)' }}>Limite Inclusivo: <code>idade &gt;= 18</code></h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`str29-state-badge ${maiorOuIgual18}`} style={{ background: maiorOuIgual18 ? '#dcfce7' : '#fee2e2', color: maiorOuIgual18 ? '#15803d' : '#991b1b', border: 0 }}>
            {String(maiorOuIgual18)}
          </span>
          <span style={{ fontSize: '.64rem', color: '#64748b' }}>
            {idade === 18 ? 'Inclui a fronteira do 18. Retorna true.' : maiorOuIgual18 ? 'Verdadeiro.' : 'Falso.'}
          </span>
        </div>
      </div>
    </div>
  </section>;
}

function HeapStackStringLab() {
  const [equalOp, setEqualOp] = useState('=='); // '==', 'equals'

  return <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ display: 'flex', gap: '6px' }}>
      <button
        type="button"
        onClick={() => setEqualOp('==')}
        style={{
          flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.68rem', fontWeight: 'bold',
          background: equalOp === '==' ? '#ef4444' : '#fff', color: equalOp === '==' ? '#fff' : '#475569', cursor: 'pointer'
        }}
      >
        Comparar Strings com ==
      </button>
      <button
        type="button"
        onClick={() => setEqualOp('equals')}
        style={{
          flex: 1, padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.68rem', fontWeight: 'bold',
          background: equalOp === 'equals' ? 'var(--rel32-violet)' : '#fff', color: equalOp === 'equals' ? '#fff' : '#475569', cursor: 'pointer'
        }}
      >
        Comparar Strings com equals()
      </button>
    </div>

    <div className="rel32-memoria-sim">
      <div className="rel32-memoria-block stack">
        <span style={{ fontSize: '.58rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Referências (modelo conceitual):</span>
        <div className="rel32-memoria-cell">
          <span>s1</span>
          <span className="address">ref A</span>
        </div>
        <div className="rel32-memoria-cell">
          <span>s2</span>
          <span className="address">ref B</span>
        </div>
      </div>
      <div style={{ color: '#fff', fontSize: '1.2rem' }}>&rarr;</div>
      <div className="rel32-memoria-block heap">
        <span style={{ fontSize: '.58rem', color: '#c084fc', textTransform: 'uppercase', fontWeight: 'bold' }}>Objetos String:</span>
        <div className="rel32-memoria-cell">
          <span className="address">objeto A</span>
          <span>"PENDENTE"</span>
        </div>
        <div className="rel32-memoria-cell">
          <span className="address">objeto B</span>
          <span>"PENDENTE"</span>
        </div>
      </div>
    </div>

    <p style={{ margin: 0, fontSize: '.72rem', lineHeight: 1.5, color: '#475569' }}>
      {equalOp === '==' ? (
        <span><b>Sintoma (==): false</b>. O operador <code>==</code> verifica se as referências representam o mesmo objeto (<code>ref A == ref B</code>), sem comparar os caracteres.</span>
      ) : (
        <span><b>Sintoma (equals): true</b>. O contrato de <code>String.equals()</code> compara a sequência de caracteres e confirma a igualdade de conteúdo.</span>
      )}
    </p>
  </section>;
}

function RedundancyLab() {
  return <section className="rel32-redundancy-box">
    <div className="rel32-redundancy-card">
      <span style={{ fontSize: '.6rem', color: '#ef4444', textTransform: 'uppercase', fontWeight: 'bold' }}>Ruim / Redundante</span>
      <pre style={{ margin: '4px 0', fontSize: '.74rem', fontFamily: 'Consolas, monospace', background: '#f8fafc', padding: '6px' }}>
        boolean ativo = clienteAtivo == true;<br />
        boolean erro = status != false;
      </pre>
      <p style={{ fontSize: '.64rem', color: '#64748b', margin: 0, lineHeight: 1.35 }}>
        Polui o código com ruído visual. Variáveis booleanas já contêm o valor de verdadeiro ou falso nativo.
      </p>
    </div>
    <div className="rel32-redundancy-card fixed">
      <span style={{ fontSize: '.6rem', color: 'var(--rel32-violet)', textTransform: 'uppercase', fontWeight: 'bold' }}>Melhor / Profissional</span>
      <pre style={{ margin: '4px 0', fontSize: '.74rem', fontFamily: 'Consolas, monospace', background: '#fff', padding: '6px' }}>
        boolean ativo = clienteAtivo;<br />
        boolean erro = !status;
      </pre>
      <p style={{ fontSize: '.64rem', color: '#64748b', margin: 0, lineHeight: 1.35 }}>
        Simplifica a leitura e deixa a lógica natural de escrita. O operador de negação (!) cuida de falsos.
      </p>
    </div>
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="rel32-domains-gallery">
    <div className="rel32-domains-sidebar">
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
          <Sparkles size={16} style={{ color: 'var(--rel32-violet)', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="rel32-errors-clinic">
    <nav className="rel32-errors-nav">
      {ERRORS.map((entry, index) => (
        <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="rel32-error-card">
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
      <div className="rel32-error-flow">
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
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-032-operadores-relacionais\ncd labs\\m1\\aula-032-operadores-relacionais\nNew-Item Main.java, ValidacaoEstoque.java, ValidacaoLimite.java, ValidacaoIdade.java, ValidacaoTentativas.java, ValidacaoPedido.java, ValidacaoProduto.java, ValidacaoOrdemServico.java, ValidacaoAuditoria.java, ValidacaoPedidoConsole.java, ValidacaoEstoqueConsole.java, ValidacaoStatusTexto.java',
      out: 'Doze arquivos Java criados na estrutura do repositório.',
      tip: 'Configure no seu IntelliJ os respectivos códigos de domínio corporativo.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac *.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Se atente a erros de igualdade de Strings utilizando == e corrija para equals().'
    },
    {
      title: 'Executar Programas',
      cmd: 'java ValidacaoStatusTexto',
      out: 'Pedido pendente: true\nPedido aprovado: false\nPedido não cancelado: true',
      tip: 'Teste rodar os consoles interativos de Pedidos e Estoque com valores limiares de fronteiras.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-032-operadores-relacionais docs/diario-de-bordo.md\ngit commit -m "Aula 032: pratica operadores relacionais em Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Mantenha a higiene do repositório garantindo que os arquivos binários compilados .class fiquem ignorados.'
    }
  ];

  const current = steps[stage];

  return <section className="rel32-terminal-flow">
    <div className="bool27-delivery-flow">
      <nav className="rel32-delivery-flow nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="rel32-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="rel32-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file rel32-code" style={{ marginTop: '14px' }}>
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
  if (block.type === 'general_sim') return <GeneralSimLab />;
  if (block.type === 'regua_fronteira') return <ReguaFronteiraLab />;
  if (block.type === 'string_mem') return <HeapStackStringLab />;
  if (block.type === 'redundancy') return <RedundancyLab />;
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
    eyebrow: 'Comparações',
    label: 'Operadores Relacionais',
    title: 'Avaliando perguntas lógicas',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'Chaveie os operadores relacionais, insira números e veja a JVM responder a perguntas lógicas gerando booleanos explicativos:' },
      { type: 'general_sim' }
    ]
  },
  {
    id: 'fronteira',
    eyebrow: 'Fronteiras',
    label: 'Réguas de Limites',
    title: 'Inclusão e exclusão de fronteiras',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Altere as idades do paciente na régua física interativa e observe o comportamento e as diferenças didáticas de limites inclusivos e exclusivos:' },
      { type: 'regua_fronteira' }
    ]
  },
  {
    id: 'strings',
    eyebrow: 'Memória',
    label: 'Igualdade de Strings',
    title: 'Identidade de referência vs igualdade de conteúdo',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Descubra por que == não é um operador de conteúdo para String. O diagrama usa referências simbólicas e não afirma endereços ou regiões físicas da JVM:' },
      { type: 'string_mem' }
    ]
  },
  {
    id: 'redundancia',
    eyebrow: 'Nomenclatura',
    label: 'Limpeza de Booleanos',
    title: 'Redundância com true/false',
    duration: '4 min',
    blocks: [
      { type: 'lead', text: 'Simplifique os testes lógicos redundantes deixando o código mais limpo e natural para o programador:' },
      { type: 'redundancy' }
    ]
  },
  {
    id: 'exemplos',
    eyebrow: 'Aplicações',
    label: 'Casos Corporativos',
    title: 'Galeria de validações aplicadas',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Acompanhe os códigos corporativos para triagem de estoques de segurança, crédito de pedidos, tentativas de login e OS:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Depurando 10 falhas de comparação de dados',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Analise o diagnóstico e o conserto das 10 falhas relacionais clássicas que ocorrem em regras de negócios de Java:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega',
    label: 'Entrega do Lab',
    title: 'Estruturação PowerShell, compilações e commits Git',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Abra seu console, estruture a pasta local, compile as 12 classes Java da aula e execute o commit:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio Prático de Transferência: Triagem de Admissão de Pacientes',
        text: 'Crie o arquivo ValidacaoTriagemPaciente.java em labs/m1/aula-032-operadores-relacionais/. Configure o Locale padrão americano. Pergunte e leia do console utilizando o Scanner: a idade do paciente (int), a temperatura corporal em Celsius (double), o status de prioridade (char: \'V\', \'A\', \'E\') e o nome do plano de saúde (String). Calcule e armazene as regras de negócio booleanas: pacienteIdoso (idade maior ou igual a 60 anos), possuiFebre (temperatura estritamente maior que 37.8), prioridadeMaxima (prioridade igual a \'E\') e planoAtendido (plano de saúde igual a "SUS" ou "PARTICULAR" utilizando equals()). Imprima o relatório estruturado.',
        acceptance: [
          'Instanciação correta de Scanner associado a System.in.',
          'Configuração regional Locale.US declarada antes do Scanner.',
          'Uso adequado de >= para idade e > para temperatura no teste relacional.',
          'Comparação exata de char usando aspas simples e de String usando o método equals().',
          'Compilação e execução corretas no terminal local com histórico de Git limpo.'
        ]
      }
    ]
  }
];

export default function GuidedRelationalOperatorsLesson032({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-relational-operators-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Máquina de Decisões</span>
        <p className="guided-sequence">032 · M1.12</p>
        <h1>Operadores Relacionais</h1>
        <p>Aprenda a fazer perguntas aos seus dados para criar regras de negócio no backend. Domine maior, menor, igualdade em primitivos, as perigosas igualdades em double e como comparar Strings com equals().</p>
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

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 'relacionais', label: 'retornam boolean' }, { value: 'limites', label: 'exclusivo vs inclusivo' }, { value: 'equals()', label: 'igualdade de Strings' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 032">
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
              <h3>Regras e Comparações de dados dominadas!</h3>
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
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 031</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Comparações de dados consolidadas' : allStepsComplete ? 'Use o botão acima' : 'Pratique limites, equals() e redundâncias'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir Operadores Lógicos'}>Aula 033 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
