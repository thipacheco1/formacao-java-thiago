import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2,
  ChevronRight, Clock3, Copy, FileCode2,
  Lightbulb, ListChecks, RotateCcw, Search,
  Sparkles, Terminal, TriangleAlert, Type, Variable, Wrench, ShieldAlert
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedIntegerTypesLesson.css';

const STORAGE_KEY = 'guided-integer-types-lesson-025-progress';

const TYPES_DATA = {
  byte: {
    label: 'byte',
    bits: 8,
    min: '-128',
    max: '127',
    desc: 'Guarda valores muito pequenos de 8 bits. Pouquíssimo usado em regras de negócio backend comuns.',
    usages: ['Dados binários de arquivos', 'Buffers de comunicação de rede', 'Bytes de imagens e arquivos salvos', 'Protocolos e criptografia de baixo nível'],
    rule: 'Normalmente evitado para idades ou contadores comuns para evitar conversões e casts desnecessários.'
  },
  short: {
    label: 'short',
    bits: 16,
    min: '-32.768',
    max: '32.767',
    desc: 'Guarda valores pequenos de 16 bits. Também incomum em código corporativo comum.',
    usages: ['Integração com sistemas legados rígidos', 'Formatos binários compactados', 'Otimização pontual de memória em grandes arranjos', 'Estruturas de protocolo específicas'],
    rule: 'Mesmo que um número caiba em short (ex: ano de fabricação 2026), o padrão corporativo prefere o uso de int pela praticidade.'
  },
  int: {
    label: 'int',
    bits: 32,
    min: '-2.147.483.648',
    max: '2.147.483.647',
    desc: 'Guarda valores de até 2 bilhões de forma eficiente (32 bits). É o tipo inteiro padrão em Java.',
    usages: ['Quantidades de itens no estoque', 'Tentativas de login realizadas', 'Número da página atual de uma API', 'Contadores simples e idades de pessoas'],
    rule: 'Se o valor não corre risco de ultrapassar 2 bilhões, o int deve ser sempre o tipo escolhido.'
  },
  long: {
    label: 'long',
    bits: 64,
    min: '-9.223.372.036.854.775.808',
    max: '9.223.372.036.854.775.807',
    desc: 'Guarda valores astronômicos de 64 bits. Indispensável para IDs globais e contadores massivos.',
    usages: ['IDs de pedidos e transações de banco', 'Timestamps em milissegundos', 'Contagem de auditoria global do sistema', 'Armazenamento de dinheiro em centavos (ex: 9990L)'],
    rule: 'Qualquer literal de número que precise ser long deve conter o sufixo L (maiúsculo) no final.'
  }
};

const SUFIX_TESTS = [
  { input: 'long id = 3000000000;', ok: false, desc: 'Erro: O literal 3000000000 sem o sufixo L é interpretado como int padrão do Java, excedendo o limite de 2 bilhões do int e gerando falha no javac.', msg: 'integer number too large: 3000000000' },
  { input: 'long id = 3000000000L;', ok: true, desc: 'Sucesso: O L maiúsculo deixa explícito para o compilador que este literal deve ser interpretado como long de 64 bits.', msg: 'Compila com sucesso.' },
  { input: 'long id = 3000000000l;', ok: true, warn: true, desc: 'Alerta: Embora compile, o sufixo l minúsculo se parece demais com o número 1 em muitas fontes, dificultando a leitura humana.', msg: 'Compila, mas viola padrões profissionais de legibilidade.' },
  { input: 'long id = 10L;', ok: true, desc: 'Sucesso: Valores pequenos também podem usar L de forma válida, forçando o compilador a tratá-los como long de imediato.', msg: 'Compila com sucesso.' }
];

const UNDERSCORE_QUIZ = [
  { code: 'long total = 1_000_000L;', valid: true, explanation: 'Correto: O underscore divide visualmente as casas de milhar de forma perfeitamente legível para humanos, sendo ignorado pelo compilador.' },
  { code: 'int limite = 10_000;', valid: true, explanation: 'Correto: O underscore pode ser posicionado livremente entre dígitos de um literal inteiro de qualquer tipo.' },
  { code: 'long total = 1_000_000_L;', valid: false, explanation: 'Incorreto: O underscore não pode ficar imediatamente antes ou depois de letras de tipo (como o L) nem no final de um literal.' },
  { code: 'int limite = _1000;', valid: false, explanation: 'Incorreto: O underscore não pode ser posicionado no início de um literal numérico, pois o compilador o interpretará como identificador inválido.' }
];

const DOMAIN_PROGRAMS = [
  {
    label: 'Tentativas de login', file: 'TentativasLogin.java',
    code: 'public class TentativasLogin {\n    public static void main(String[] args) {\n        int limiteTentativas = 3;\n        int tentativasRealizadas = 2;\n        int tentativasRestantes = limiteTentativas - tentativasRealizadas;\n\n        System.out.println("Limite de tentativas: " + limiteTentativas);\n        System.out.println("Tentativas realizadas: " + tentativasRealizadas);\n        System.out.println("Tentativas restantes: " + tentativasRestantes);\n    }\n}',
    output: 'Limite de tentativas: 3\nTentativas realizadas: 2\nTentativas restantes: 1', insight: 'Valores pequenos e limitados usam int de forma natural, sem necessidade de long.'
  },
  {
    label: 'Paginação de API', file: 'Paginacao.java',
    code: 'public class Paginacao {\n    public static void main(String[] args) {\n        int paginaAtual = 0;\n        int tamanhoPagina = 20;\n        int totalElementosNaPagina = 20;\n\n        System.out.println("Página atual: " + paginaAtual);\n        System.out.println("Tamanho da página: " + tamanhoPagina);\n        System.out.println("Elementos retornados: " + totalElementosNaPagina);\n    }\n}',
    output: 'Página atual: 0\nTamanho da página: 20\nElementos retornados: 20', insight: 'Página e tamanho de paginação são tipicamente int em frameworks Java backend.'
  },
  {
    label: 'Auditoria massiva', file: 'AuditoriaMassiva.java',
    code: 'public class AuditoriaMassiva {\n    public static void main(String[] args) {\n        long totalEventosAuditoria = 5_000_000_000L;\n        long eventosProcessadosHoje = 2_500_000L;\n\n        System.out.println("Total de eventos de auditoria: " + totalEventosAuditoria);\n        System.out.println("Eventos processados hoje: " + eventosProcessadosHoje);\n    }\n}',
    output: 'Total de eventos de auditoria: 5000000000\nEventos processados hoje: 2500000', insight: 'Aqui o uso do long com sufixo L é mandatório para evitar o estouro de 2 bilhões.'
  },
  {
    label: 'Ordem de serviço', file: 'OrdemServicoInteiros.java',
    code: 'public class OrdemServicoInteiros {\n    public static void main(String[] args) {\n        long idOrdemServico = 10_000_000_001L;\n        int quantidadeAtividades = 4;\n        int quantidadeReagendamentos = 1;\n        int prazoAtendimentoDias = 3;\n\n        System.out.println("ID da OS: " + idOrdemServico);\n        System.out.println("Quantidade de atividades: " + quantidadeAtividades);\n        System.out.println("Quantidade de reagendamentos: " + quantidadeReagendamentos);\n        System.out.println("Prazo de atendimento em dias: " + prazoAtendimentoDias);\n    }\n}',
    output: 'ID da OS: 10000000001\nQuantidade de atividades: 4\nQuantidade de reagendamentos: 1\nPrazo de atendimento em dias: 3', insight: 'A escolha de long para IDs e int para contagens de negócio define a intenção do domínio.'
  },
  {
    label: 'Produto e estoque', file: 'ProdutoEstoque.java',
    code: 'public class ProdutoEstoque {\n    public static void main(String[] args) {\n        long idProduto = 9_000_000_001L;\n        int quantidadeEstoque = 120;\n        int quantidadeReservada = 15;\n        int quantidadeDisponivel = quantidadeEstoque - quantidadeReservada;\n\n        System.out.println("ID do produto: " + idProduto);\n        System.out.println("Estoque total: " + quantidadeEstoque);\n        System.out.println("Quantidade reservada: " + quantidadeReservada);\n        System.out.println("Quantidade disponível: " + quantidadeDisponivel);\n    }\n}',
    output: 'ID do produto: 90000000001\nEstoque total: 120\nQuantidade reservada: 15\nQuantidade disponível: 105', insight: 'Os cálculos aritméticos com int ocorrem sem a necessidade de castings manuais.'
  },
  {
    label: 'Valor em centavos', file: 'PagamentoCentavos.java',
    code: 'public class PagamentoCentavos {\n    public static void main(String[] args) {\n        long valorProdutoCentavos = 9990L; // R$ 99,90\n        long valorFreteCentavos = 1500L;   // R$ 15,00\n        long valorTotalCentavos = valorProdutoCentavos + valorFreteCentavos;\n\n        System.out.println("Produto em centavos: " + valorProdutoCentavos);\n        System.out.println("Frete em centavos: " + valorFreteCentavos);\n        System.out.println("Total em centavos: " + valorTotalCentavos);\n    }\n}',
    output: 'Produto em centavos: 9990\nFrete em centavos: 1500\nTotal em centavos: 11490', insight: 'Guardar centavos em long evita imprecisões decimais em cálculos preliminares.'
  }
];

const ERRORS = [
  { title: 'Fora do limite de byte', code: 'byte valor = 128;', symptom: 'possible lossy conversion from int to byte', cause: 'O literal 128 ultrapassa o valor máximo de byte (127), obrigando o Java a dar erro de compilação.', fix: 'Mude a variável para short ou int, conforme o limite do negócio.' },
  { title: 'Fora do limite de short', code: 'short quantidade = 40000;', symptom: 'possible lossy conversion from int to short', cause: 'O valor 40000 excede o máximo de short (32767).', fix: 'Use int, que suporta de forma confortável e com boa performance.' },
  { title: 'long sem o sufixo L', code: 'long id = 3000000000;', symptom: 'integer number too large', cause: 'Mesmo a variável sendo long, o literal inteiro sem sufixo é avaliado como int padrão, que estoura 2 bilhões.', fix: 'Escreva L no final do número: 3000000000L.' },
  { title: 'Sufixo l minúsculo', code: 'long numero = 3000000000l;', symptom: 'Compila, mas atrapalha a leitura', cause: 'O caractere "l" em minúsculo se confunde facilmente com o dígito "1".', fix: 'Substitua pelo "L" maiúsculo por padrão corporativo de legibilidade.' },
  { title: 'Overflow silencioso', code: 'int resultado = 2_000_000_000 + 2_000_000_000;', symptom: 'Compila e roda, mas dá saída -294967296', cause: 'Estouro silencioso da faixa máxima do tipo int em tempo de execução sem lançar exceções.', fix: 'Promova ao menos um termo para long na operação: 2_000_000_000L + 2_000_000_000L.' },
  { title: 'Achar que int cabe ID', code: 'int idAuditoria = 5_000_000_000;', symptom: 'integer number too large', cause: 'Muitos desenvolvedores usam int para ID sem prever que a base cresce e estoura 2 bilhões.', fix: 'IDs globais de entidades do banco de dados sempre devem ser do tipo long.' },
  { title: 'Otimização com byte/short', code: 'byte idade = 30;\n// byte novaIdade = idade + 1; // dá erro', symptom: 'possible lossy conversion from int to byte', cause: 'Java promove operações aritméticas menores para int por segurança e performance.', fix: 'Use int diretamente no código comum de negócio para evitar complexidade de casts.' },
  { title: 'Uso de vírgula em literais', code: 'int valor = 1,000;', symptom: "';' expected", cause: 'A vírgula não é usada para separar milhares nem decimais em Java.', fix: 'Substitua pela notação de underscore: 1_000.' },
  { title: 'Decimal em variável inteira', code: 'int valor = 99.90;', symptom: 'possible lossy conversion from double to int', cause: 'Java não faz coerção automática de valores decimais em inteiros por risco de perda de precisão.', fix: 'Use double/float (próxima aula) ou represente o valor em centavos como long (9990L).' },
  { title: 'long sem necessidade', code: 'long idade = 30L;', symptom: 'Sem erro, mas sem utilidade', cause: 'Uso excessivo de long para dados pequenos polui a legibilidade do código e o consumo de memória.', fix: 'Mantenha int para idades, quantidades e contagens de negócio simples.' }
];

const EVIDENCE = [
  '# Aula 025 — tipos inteiros em Java', '',
  '## Tamanhos e responsabilidades', '- [ ] Identifiquei byte, short, int, long', '- [ ] Entendi limites de bits (8, 16, 32, 64)', '- [ ] Justifiquei a escolha de int como padrão', '',
  '## Literais e representação', '- [ ] Usei o sufixo L e evitei l minúsculo', '- [ ] Usei underscore de forma correta para milhares', '- [ ] Entendi a introdução de dinheiro em centavos', '',
  '## Estouro e comportamento', '- [ ] Constatei a volta do estouro de overflow', '- [ ] Concluí que overflow é silencioso nas operações inteiras', '- [ ] Compreendi a promoção aritmética em somas de byte', '',
  '## Evidências locais', '- [ ] Criei e executei os nove arquivos Java', '- [ ] Auditei e mantive os .class fora do commit Git', '',
  '## Decisão técnica pessoal', '- Cenário real onde usei long:', '- Cenário real onde mantive int:'
].join('\n');

const steps = [
  { id: 'tabela', label: 'Tabela de tipos', duration: '12 min', eyebrow: 'Comece aqui', title: 'Entenda os limites físicos e a intenção de cada tipo inteiro', blocks: [{ type: 'lead', text: 'Iniciantes usam int para tudo, mas o Java oferece quatro primitivos inteiros. A escolha depende da faixa do número e do significado no domínio do negócio.' }, { type: 'types_selector' }, { type: 'note', tone: 'info', title: 'Resultado prático', text: 'Ao final do laboratório, você criará nove programas executáveis no PowerShell, preverá suas saídas, diagnosticará 10 tipos de falhas e auditará seus commits.' }] },
  { id: 'memoria', label: 'Bits e Memória', duration: '15 min', eyebrow: 'Etapa 1', title: 'Visualize a ocupação física de bits e o espaço na memória', blocks: [{ type: 'lead', text: 'Computadores representam números com bits (digitos binários). Quanto mais bits o tipo possui, maior o número que ele consegue conter na memória.' }, { type: 'bits_visualizer' }] },
  { id: 'sufixo', label: 'Sufixo L', duration: '18 min', eyebrow: 'Etapa 2', title: 'Marque literais long de forma visível e evite confusoes de leitura', blocks: [{ type: 'lead', text: 'Em Java, literais inteiros sem marcação são int por padrão. Para números gigantes, o sufixo L avisa ao compilador o tamanho correto de imediato.' }, { type: 'suffix_simulator' }] },
  { id: 'overflow', label: 'Overflow de dados', duration: '15 min', eyebrow: 'Etapa 3', title: 'Descubra como números estouram limites e dão a volta de forma silenciosa', blocks: [{ type: 'lead', text: 'Somar 1 ao limite máximo de um tipo inteiro faz o valor virar o seu limite negativo. Esse bug silencioso não gera exceções ou travamentos no console.' }, { type: 'overflow_simulator' }] },
  { id: 'underscore', label: 'Underscores', duration: '10 min', eyebrow: 'Etapa 4', title: 'Use underscores para melhorar a leitura sem violar as regras sintáticas', blocks: [{ type: 'lead', text: 'O underscore _ ajuda humanos a lerem números grandes (como 1_000_000L). O compilador os remove antes de rodar o programa.' }, { type: 'underscore_quiz' }] },
  { id: 'galeria', label: 'Cenários de domínio', duration: '20 min', eyebrow: 'Etapa 5', title: 'Leia e execute seis programas de domínio corporativo em Java', blocks: [{ type: 'lead', text: 'Analise como contadores, páginas, IDs globais, OS, estoque e centavos são implementados no código profissional.' }, { type: 'domains_gallery' }] },
  { id: 'clinica', label: 'Clínica de erros', duration: '22 min', eyebrow: 'Etapa 6', title: 'Diagnostique dez erros clássicos de compilação, sintaxe e lógica', blocks: [{ type: 'lead', text: 'Nem toda falha ocorre no compilador. Separe a clínica de erros inteiros entre problemas de restrição e problemas de performance ou estilo.' }, { type: 'errors_clinic' }] },
  { id: 'entrega', label: 'Entrega e Desafio', duration: '25 min', eyebrow: 'Etapa final', title: 'Escreva nove programas no repositório real, preencha o diário e faça o commit', blocks: [{ type: 'lead', text: 'Chegou a hora de rodar no terminal real do IntelliJ. Crie a estrutura, compile silenciosamente, execute e registre evidências.' }, { type: 'delivery' }, { type: 'challenge', title: 'Modele o sensor de tráfego de dados de uma API', text: 'Crie SensorTrafegoInteiros.java em labs/m1/aula-025-tipos-inteiros. Represente o identificador do sensor, requisições por segundo atuais, volume acumulado em bytes que passe de 2 bilhões (use L e underscores), status ativo/inativo e média simples. Salve diário e faça o commit Git limpo.', acceptance: ['Identificador do sensor usa long para prever crescimento de base.', 'Volume acumulado de bytes usa long com L maiúsculo e underscore de milhares.', 'Quantidades por segundo usam int ou short válidos.', 'O status ativo/inativo é booleano modelado de forma a fazer sentido no domínio.', 'O programa compila de forma silenciosa e sua execução é limpa.', 'Diário de bordo preenchido com evidências coletadas localmente.', 'O diff do commit contém apenas os arquivos fontes e o diário.'] }] }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="int25-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return <div className="guided-file int25-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function TypesSelectorLab() {
  const [selected, setSelected] = useState('int');
  const item = TYPES_DATA[selected];
  return <section className="int25-types-selector">
    <nav className="int25-selector-nav" role="tablist">
      {Object.entries(TYPES_DATA).map(([id, entry]) => (
        <button type="button" role="tab" aria-selected={selected === id} className={selected === id ? 'active' : ''} onClick={() => setSelected(id)} key={id}>{entry.label}</button>
      ))}
    </nav>
    <div className="int25-type-card">
      <div>
        <header>
          <Type size={18} />
          <small>{item.bits} bits</small>
        </header>
        <h3>{item.label}</h3>
        <p>{item.desc}</p>
        <ul>
          {item.usages.map((use, idx) => <li key={idx}>{use}</li>)}
        </ul>
      </div>
      <div className="int25-metric">
        <span>Faixa mínima: <strong>{item.min}</strong></span>
        <span>Faixa máxima: <strong>{item.max}</strong></span>
        <span style={{ fontSize: '.62rem', color: '#0891b2', borderTop: '1px solid #c5f2f7', paddingTop: '8px', marginTop: '4px' }}>{item.rule}</span>
      </div>
    </div>
  </section>;
}

function BitsVisualizerLab() {
  const [selectedType, setSelectedType] = useState('byte');
  const items = TYPES_DATA[selectedType];
  const numBits = items.bits;

  const boxes = useMemo(() => {
    const list = [];
    for (let i = numBits - 1; i >= 0; i--) {
      // Primeiro bit (índice 7 para byte, 15 para short, etc) é o de sinal
      const isSign = i === numBits - 1;
      list.push(
        <div key={i} className={`int25-bit-box ${isSign ? 'sign' : 'active'}`} title={isSign ? 'Bit de Sinal (1 = Negativo / 0 = Positivo)' : `Bit de Dados ${i}`}>
          {isSign ? 'S' : '1'}
        </div>
      );
    }
    return list;
  }, [numBits]);

  return <section className="int25-bits-container">
    <div className="int25-bits-header">
      <h4>Slots de representação física (primitivo {selectedType})</h4>
      <select value={selectedType} onChange={e => setSelectedType(e.target.value)} style={{ padding: '6px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
        <option value="byte">byte (8 bits)</option>
        <option value="short">short (16 bits)</option>
        <option value="int">int (32 bits)</option>
        <option value="long">long (64 bits)</option>
      </select>
    </div>
    <div className={numBits === 64 ? 'int25-bits-grid-64' : 'int25-bits-grid'} style={{ gridTemplateColumns: `repeat(${numBits > 32 ? 32 : numBits}, 1fr)` }}>
      {boxes}
    </div>
    <div className="int25-bits-legend">
      <span><div className="int25-legend-box bg-sign" /> Bit de Sinal (S)</span>
      <span><div className="int25-legend-box bg-active" /> Bits de Dados (1 / 0)</span>
      <span>Total: {numBits} bits ({numBits / 8} {numBits === 8 ? 'byte' : 'bytes'})</span>
    </div>
  </section>;
}

function SuffixSimulatorLab() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const item = SUFIX_TESTS[selectedIdx];
  return <section className="int25-suffix-simulator">
    <div className="int25-suffix-playground">
      <div className="int25-input-container">
        <label>Selecione a atribuição literal:</label>
        <div className="int25-quiz-options">
          {SUFIX_TESTS.map((test, index) => (
            <button type="button" className={selectedIdx === index ? 'active' : ''} onClick={() => setSelectedIdx(index)} key={index}>
              <code>{test.input}</code>
              {test.ok ? (test.warn ? <TriangleAlert size={16} style={{ color: '#eab308' }} /> : <Check size={16} style={{ color: '#10b981' }} />) : <TriangleAlert size={16} style={{ color: '#ef4444' }} />}
            </button>
          ))}
        </div>
      </div>
      <div className={`int25-compilation-box ${item.ok && !item.warn ? 'success' : 'error'}`}>
        <strong>{item.ok ? (item.warn ? 'Status: Advertência de equipe' : 'Status: Compilação realizada') : 'Status: Falha de compilação'}</strong>
        <p style={{ margin: '4px 0', fontSize: '.72rem' }}>{item.desc}</p>
        {!item.ok && <pre>Main.java:3: error: {item.msg}</pre>}
        {item.warn && <pre>Checkstyle: Evite 'l' minúsculo. Use 'L' maiúsculo.</pre>}
      </div>
    </div>
    <div>
      <aside className="guided-note info" style={{ margin: 0, padding: '16px' }}>
        <Search size={22} />
        <div>
          <strong>Aparência da Fonte</strong>
          <p>Veja a diferença crucial na tipografia entre sans-serif e monospace (estilo IDE):</p>
          <div className="int25-font-compare">
            <div className="int25-font-item">
              <span>Fonte Comum (sans)</span>
              <strong className="int25-sans">3000000000l</strong>
              <small style={{ color: '#64748b', fontSize: '.6rem' }}>O l parece número 1</small>
            </div>
            <div className="int25-font-item">
              <span>Fonte IDE (mono)</span>
              <strong className="int25-mono">3000000000L</strong>
              <small style={{ color: '#64748b', fontSize: '.6rem' }}>Visibilidade perfeita</small>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </section>;
}

function OverflowSimulatorLab() {
  const [type, setType] = useState('byte');
  const [value, setValue] = useState(126);

  useEffect(() => {
    if (type === 'byte') {
      setValue(126);
    } else {
      setValue(2147483645);
    }
  }, [type]);

  const max = type === 'byte' ? 127 : 2147483647;
  const min = type === 'byte' ? -128 : -2147483648;

  const handleAdd = () => {
    if (value === max) {
      setValue(min);
    } else {
      setValue(value + 1);
    }
  };

  const handleReset = () => {
    setValue(type === 'byte' ? 126 : 2147483645);
  };

  const isOverflowed = value < 0;

  return <section className="int25-overflow-simulator">
    <div className="int25-overflow-box">
      <div className="int25-overflow-controls">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select value={type} onChange={e => setType(e.target.value)} style={{ padding: '6px 10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
            <option value="byte">byte (limite: 127)</option>
            <option value="int">int (limite: ~2 bilhões)</option>
          </select>
          <button type="button" onClick={handleReset} style={{ display: 'inline-flex', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff', cursor: 'pointer' }} title="Resetar valores"><RotateCcw size={15} /></button>
        </div>
        <p style={{ margin: '0', fontSize: '.76rem', color: '#92400e', lineHeight: 1.5 }}>
          Ao clicar no botão de somar, acompanhe o valor. Quando atingir o máximo e somar mais uma vez, o valor estourará silenciosamente para o mínimo negativo.
        </p>
        <div className="int25-overflow-actions">
          <button type="button" onClick={handleAdd}>Somar + 1</button>
        </div>
      </div>
      <div className="int25-overflow-state" style={{ background: isOverflowed ? '#fee2e2' : 'rgba(255, 255, 255, 0.7)', borderColor: isOverflowed ? '#fecdd3' : '#fde68a' }}>
        <span style={{ color: isOverflowed ? '#991b1b' : '#78350f' }}>Valor em Memória: <strong style={{ fontSize: '1rem' }}>{value.toLocaleString('pt-BR')}</strong></span>
        <span style={{ color: isOverflowed ? '#b91c1c' : '#b45309' }}>Limite Máximo: <strong>{max.toLocaleString('pt-BR')}</strong></span>
        {isOverflowed && (
          <div className="int25-overflow-alert">
            <ShieldAlert size={16} style={{ color: '#ef4444', flex: '0 0 auto' }} />
            <div>
              <strong>Overflow Ocorrido!</strong>
              <p style={{ margin: '2px 0 0', fontSize: '.65rem', lineHeight: 1.4, color: '#991b1b' }}>
                O valor superou o máximo ({max.toLocaleString('pt-BR')}) e retornou para o início ({min.toLocaleString('pt-BR')}) de forma invisível. Nenhum log de erro é impresso no terminal Java.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  </section>;
}

function UnderscoreQuizLab() {
  const [selected, setSelected] = useState(0);
  const quiz = UNDERSCORE_QUIZ[selected];
  return <section className="int25-underscore-quiz">
    <div className="int25-quiz-options">
      {UNDERSCORE_QUIZ.map((entry, index) => (
        <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={index}>
          <code>{entry.code}</code>
          <span className={`int25-quiz-badge ${entry.valid ? 'valid' : 'invalid'}`}>{entry.valid ? 'Válido' : 'Inválido'}</span>
        </button>
      ))}
    </div>
    <div className="int25-quiz-feedback" style={{ borderColor: quiz.valid ? '#a7f3d0' : '#fecdd3', background: quiz.valid ? '#f0fdf4' : '#fff5f5' }}>
      <div>
        <span className={`int25-quiz-badge ${quiz.valid ? 'valid' : 'invalid'}`} style={{ marginBottom: '8px' }}>
          {quiz.valid ? 'Compila sem erro' : 'Erro de sintaxe'}
        </span>
        <h3 style={{ color: quiz.valid ? '#065f46' : '#991b1b', fontFamily: 'Consolas, monospace' }}><code>{quiz.code}</code></h3>
        <p style={{ color: quiz.valid ? '#047857' : '#b91c1c' }}>{quiz.explanation}</p>
      </div>
      <aside className="guided-note info" style={{ margin: '8px 0 0', padding: '10px' }}>
        <Lightbulb size={16} />
        <span style={{ fontSize: '.68rem', color: '#475569' }}><strong>Regra do Java:</strong> O underscore só pode separar dígitos. Não pode tocar em letras (como L), nem ficar no início ou no fim do literal.</span>
      </aside>
    </div>
  </section>;
}

function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return <section className="int25-domains-gallery">
    <div className="int25-domains-sidebar">
      {DOMAIN_PROGRAMS.map((entry, index) => (
        <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.file}>
          {entry.label}
        </button>
      ))}
    </div>
    <div className="int25-domains-content">
      <CodePanel name={item.file} code={item.code} />
      <section className="int25-console">
        <header><Terminal size={15} /> Console de saída esperado</header>
        <pre>{item.output}</pre>
        <p style={{ display: 'flex', gap: '8px', margin: '0', padding: '12px 14px', alignItems: 'flex-start', color: '#94a3b8', background: '#1e293b', borderTop: '1px solid #334155', fontSize: '.72rem', lineHeight: 1.5 }}>
          <Sparkles size={16} style={{ color: '#06b6d4', flex: '0 0 auto' }} />
          <span>{item.insight}</span>
        </p>
      </section>
    </div>
  </section>;
}

function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="int25-errors-clinic">
    <nav className="int25-errors-nav">
      {ERRORS.map((entry, index) => (
        <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.title}>
          <span>{index + 1}</span>
          {entry.title}
        </button>
      ))}
    </nav>
    <div className="int25-error-card">
      <header>
        <AlertTriangle size={20} />
        <div>
          <small>Caso {selected + 1} de {ERRORS.length}</small>
          <h3>{item.title}</h3>
        </div>
      </header>
      <CodePanel name="Código Problemático" code={item.code} />
      <section style={{ margin: '12px 0' }}>
        <small style={{ display: 'block', marginBottom: '4px', fontSize: '.65rem', color: '#475569', fontWeight: 'bold' }}>Sintoma ou Mensagem</small>
        <code>{item.symptom}</code>
      </section>
      <div className="int25-error-flow">
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
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-025-tipos-inteiros\ncd labs\\m1\\aula-025-tipos-inteiros\nNew-Item Main.java, LimitesInteiros.java, OverflowInteiro.java, TentativasLogin.java, Paginacao.java, AuditoriaMassiva.java, OrdemServicoInteiros.java, ProdutoEstoque.java, PagamentoCentavos.java',
      out: 'Nove arquivos Java criados na estrutura do repositório.',
      tip: 'Abra cada arquivo no IntelliJ e copie os respectivos códigos de negócio, analisando as escolhas semânticas de int e long.'
    },
    {
      title: 'Compilar Fontes',
      cmd: 'javac Main.java LimitesInteiros.java OverflowInteiro.java TentativasLogin.java Paginacao.java AuditoriaMassiva.java OrdemServicoInteiros.java ProdutoEstoque.java PagamentoCentavos.java',
      out: '[Compilação silenciosa - nenhum retorno significa sucesso]',
      tip: 'Verifique se não há mensagens de erro. Se houver, leia o arquivo e a linha e use a clínica de erros para resolver.'
    },
    {
      title: 'Executar Programas',
      cmd: 'java Main\njava LimitesInteiros\njava OverflowInteiro',
      out: 'Saída típica dos limites máximos de tipos e do estouro silencioso.',
      tip: 'Confirme se o overflow no programa OverflowInteiro imprimiu a volta com sinal negativo sem abortar a aplicação.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-025-tipos-inteiros docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 025: pratica tipos inteiros e overflow em Java"\ngit status',
      out: 'nothing to commit, working tree clean',
      tip: 'Certifique-se de que os arquivos .class não entraram no commit. Caso apareçam no status, remova-os e configure o .gitignore.'
    }
  ];

  const current = steps[stage];

  return <section className="int25-terminal-flow">
    <div className="int25-delivery-flow">
      <nav>
        {steps.map((entry, index) => (
          <button type="button" className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)} key={entry.title}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="int25-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="int25-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
    </div>
    <div className="guided-file int25-evidence" style={{ marginTop: '14px' }}>
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
  if (block.type === 'types_selector') return <TypesSelectorLab />;
  if (block.type === 'bits_visualizer') return <BitsVisualizerLab />;
  if (block.type === 'suffix_simulator') return <SuffixSimulatorLab />;
  if (block.type === 'overflow_simulator') return <OverflowSimulatorLab />;
  if (block.type === 'underscore_quiz') return <UnderscoreQuizLab />;
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

export default function GuidedIntegerTypesLesson025({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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

  return <article className="guided-git-lesson guided-integer-types-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy">
        <span className="guided-kicker"><Variable size={17} /> Oficina de tipos numéricos</span>
        <p className="guided-sequence">025 · M1.05</p>
        <h1>Tipos Inteiros e Limites de Dados em Java</h1>
        <p>Domine o byte, short, int e long, diferencie limites de bits, trate o estouro silencioso de overflow e utilize o sufixo L.</p>
      </div>
      <div className="guided-hero-status">
        <Variable size={42} />
        <strong>{progress}%</strong>
        <span>{completedLabel}</span>
      </div>
      <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
    </header>

    <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[{ value: 4, label: 'tipos primitivos' }, { value: 64, label: 'bits de tamanho máximo' }, { value: 10, label: 'falhas clínicas' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 025">
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
              <h3>{lessonComplete ? 'Tipos inteiros dominados com sucesso' : 'Oficina concluída'}</h3>
              <p>{lessonComplete ? 'Etapas, evidências e conclusão geral registradas no Git.' : 'Conclua a aula para consolidar seus conhecimentos.'}</p>
            </div>
            <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
              {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
            </button>
          </section>
        )}
      </main>
    </div>

    <footer className="guided-course-nav">
      <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 024</button>
      <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
        {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <span>
          <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
          <small>{lessonComplete ? 'Tipos inteiros com responsabilidade' : allStepsComplete ? 'Use o botão acima' : 'Estude os limites e sufixos'}</small>
        </span>
      </div>
      <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir tipos decimais'}>Aula 026 <ArrowRight size={17} /></button>
    </footer>
  </article>;
}
