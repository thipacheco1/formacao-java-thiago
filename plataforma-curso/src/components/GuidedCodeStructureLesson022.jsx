import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  Compass,
  Copy,
  FileCode2,
  FolderTree,
  GitBranch,
  IndentIncrease,
  Layers3,
  Lightbulb,
  ListChecks,
  Maximize2,
  Minimize2,
  MonitorCog,
  RotateCcw,
  ScanSearch,
  Search,
  Terminal,
  TriangleAlert,
  Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedCodeStructureLesson.css';

const LESSON_STORAGE_KEY = 'guided-code-structure-lesson-022-progress';

const MAIN_CODE = [
  'public class Main {',
  '    public static void main(String[] args) {',
  '        System.out.println("Blocos e chaves");',
  '    }',
  '}'
].join('\n');

const ORDER_CODE = [
  'public class LeituraOrdemServico {',
  '    public static void main(String[] args) {',
  '        System.out.println("Ordem de Serviço");',
  '',
  '        if (true) {',
  '            System.out.println("Status: ABERTA");',
  '',
  '            if (true) {',
  '                System.out.println("Atividade: AGENDADA");',
  '            }',
  '',
  '            System.out.println("Checklist: PENDENTE");',
  '        }',
  '',
  '        System.out.println("Fim da leitura");',
  '    }',
  '}'
].join('\n');

const VALIDATION_CODE = [
  'public class ValidacaoPedido {',
  '    public static void main(String[] args) {',
  '        System.out.println("Iniciando validação do pedido");',
  '',
  '        if (true) {',
  '            System.out.println("Pedido encontrado");',
  '',
  '            if (true) {',
  '                System.out.println("Cliente ativo");',
  '            }',
  '        }',
  '',
  '        System.out.println("Validação finalizada");',
  '    }',
  '}'
].join('\n');

const MESSY_CODE = [
  'public class Main {',
  'public static void main(String[] args) {',
  'if (true) {',
  'System.out.println("A");',
  'if (true) {',
  'System.out.println("B");',
  '}',
  'System.out.println("C");',
  '}',
  'System.out.println("D");',
  '}',
  '}'
].join('\n');

const FORMATTED_CODE = [
  'public class Main {',
  '    public static void main(String[] args) {',
  '        if (true) {',
  '            System.out.println("A");',
  '            if (true) {',
  '                System.out.println("B");',
  '            }',
  '            System.out.println("C");',
  '        }',
  '        System.out.println("D");',
  '    }',
  '}'
].join('\n');

const MISLEADING_CODE = [
  'public class Main {',
  '    public static void main(String[] args) {',
  '        if (true) {',
  '            System.out.println("A");',
  '        }',
  '            System.out.println("B");',
  '    }',
  '}'
].join('\n');

const STRUCTURE_PARTS = [
  { label: 'Classe Main', lines: '1–5', depth: 0, text: 'É o bloco externo. Tudo o que forma esta classe precisa permanecer entre a primeira abertura e o último fechamento.' },
  { label: 'Método main', lines: '2–4', depth: 1, text: 'Está aninhado na classe. É o bloco executável que recebe a instrução deste programa.' },
  { label: 'Instrução println', lines: '3', depth: 2, text: 'Não abre um bloco. Ela pertence ao main e termina com ponto e vírgula.' }
];

const BRACE_PAIRS = [
  { label: 'Par da classe', open: 'linha 1', close: 'linha 5', owner: 'public class Main', depth: 'nível 0', explanation: 'A chave final alinha com a declaração da classe.' },
  { label: 'Par do método', open: 'linha 2', close: 'linha 4', owner: 'public static void main', depth: 'nível 1', explanation: 'A chave do método alinha com a assinatura, quatro espaços à direita da classe.' }
];

const READ_PATHS = {
  outside: [
    ['1', 'Classe', 'LeituraOrdemServico contém todo o arquivo executável.'],
    ['2', 'Método', 'main é o ponto de entrada dentro da classe.'],
    ['3', 'Bloco externo', 'O primeiro if contém Status, o if interno e Checklist.'],
    ['4', 'Bloco interno', 'O segundo if contém somente Atividade.'],
    ['5', 'Retorno ao main', 'Fim da leitura está fora dos dois ifs, mas dentro do main.']
  ],
  inside: [
    ['1', 'Atividade', 'A instrução está dentro do if interno.'],
    ['2', 'If interno', 'Esse bloco pertence ao if externo.'],
    ['3', 'If externo', 'Esse bloco pertence ao main.'],
    ['4', 'Método main', 'O método pertence à classe.'],
    ['5', 'Classe', 'LeituraOrdemServico é a casca externa.']
  ]
};

const BLOCK_CASES = [
  {
    id: 'empty', label: 'Bloco vazio', code: 'public class Main {\n    public static void main(String[] args) {\n    }\n}',
    output: '[nenhuma saída]', map: ['Main', 'main', 'nenhuma instrução'],
    explanation: 'O espaço estrutural existe, mas nada dentro dele produz ação. O programa compila e termina sem imprimir.'
  },
  {
    id: 'multiple', label: 'Três instruções', code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Preparando ambiente...");\n        System.out.println("Executando validação...");\n        System.out.println("Finalizado.");\n    }\n}',
    output: 'Preparando ambiente...\nExecutando validação...\nFinalizado.', map: ['Main', 'main', 'println × 3 no mesmo nível'],
    explanation: 'As três instruções são irmãs dentro do main e executam de cima para baixo.'
  },
  {
    id: 'nested', label: 'Ifs aninhados', code: VALIDATION_CODE,
    output: 'Iniciando validação do pedido\nPedido encontrado\nCliente ativo\nValidação finalizada', map: ['ValidacaoPedido', 'main', 'if externo', 'if interno'],
    explanation: 'O exemplo usa true somente para tornar todos os blocos observáveis. A lógica de if será ensinada depois; aqui você lê pertencimento.'
  }
];

const PLACEMENTS = [
  {
    id: 'method', label: 'Dentro do main', code: MAIN_CODE, result: 'Compila e imprime', tone: 'ok',
    diagnostic: 'Bloco da classe → bloco do main → println', explanation: 'A instrução executável está dentro de um método e o método está dentro da classe.'
  },
  {
    id: 'class', label: 'Na classe, fora do main', code: 'public class Main {\n    public static void main(String[] args) {\n    }\n\n    System.out.println("Olá");\n}', result: 'Não compila', tone: 'bad',
    diagnostic: "Main.java:5: error: <identifier> expected", explanation: 'Uma chamada solta não pode ocupar diretamente o corpo da classe. Mova-a para dentro de um método.'
  },
  {
    id: 'outside', label: 'Fora da classe', code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Olá");\n    }\n}\n\nSystem.out.println("Fora da classe");', result: 'Não compila', tone: 'bad',
    diagnostic: "Main.java:7: error: class, interface, enum, or record expected", explanation: 'A classe já terminou. Java não aceita essa instrução solta no arquivo.'
  }
];

const ERRORS = [
  { title: 'Falta chave de fechamento', symptom: 'reached end of file while parsing', cause: 'Um bloco foi aberto e o arquivo terminou antes do par correspondente.', inspect: 'Formate, clique nas aberturas e confira cada par de dentro para fora.', fix: 'Adicione somente a chave que fecha o bloco ainda aberto e compile novamente.' },
  { title: 'Existe chave sobrando', symptom: 'class, interface, enum, or record expected', cause: 'Uma chave fechou a classe cedo demais ou existe um fechamento depois dela.', inspect: 'Localize primeiro a chave que encerra a classe; veja o que ficou depois.', fix: 'Remova ou reposicione o fechamento incorreto e repita javac.' },
  { title: 'Instrução fora do método', symptom: '<identifier> expected', cause: 'println está no corpo da classe, mas não dentro de um método ou inicializador válido.', inspect: 'Suba da linha até encontrar a abertura de main. Se ela já fechou, achou a fronteira errada.', fix: 'Mova a instrução para dentro do main nesta fase da formação.' },
  { title: 'Indentação enganosa', symptom: 'O código compila, mas a leitura humana prevê o bloco errado.', cause: 'Os espaços sugerem pertencimento diferente daquele definido pelas chaves.', inspect: 'Ignore os recuos por um instante e pareie as chaves reais.', fix: 'Use Ctrl+Alt+L e confirme se o resultado representa sua intenção.' },
  { title: 'Fechamentos na ordem errada', symptom: 'Uma instrução fica fora do método ou vários erros aparecem em cascata.', cause: 'O main foi fechado antes de receber todas as instruções.', inspect: 'Nomeie cada fechamento: if, main ou classe.', fix: 'Reposicione a chave do main depois da última instrução que pertence a ele.' },
  { title: 'Código colado sem revisão', symptom: 'Recuos, tabs, espaços e quebras tornam a estrutura opaca.', cause: 'A origem trouxe formatação incompatível ou incompleta.', inspect: 'Formate, leia o diff e confira os pares antes de executar.', fix: 'Não aceite automaticamente: confirme se nenhuma chave mudou de intenção.' },
  { title: 'Método e classe confundidos', symptom: 'Você não consegue dizer qual das duas chaves finais fecha o quê.', cause: 'A leitura está baseada na posição vertical, não no dono do bloco.', inspect: 'A primeira final alinha com main; a segunda, com class.', fix: 'Marque temporariamente os donos ou use o realce de par da IDE.' },
  { title: 'Aninhamento excessivo', symptom: 'Muitos níveis tornam difícil prever o caminho e o escopo.', cause: 'Há if dentro de if repetidamente.', inspect: 'Conte os níveis e desenhe a árvore antes de alterar.', fix: 'Nesta aula, apenas reconheça o risco. A refatoração virá quando houver ferramentas para preservar comportamento.' },
  { title: 'Ignorar ajuda da IDE', symptom: 'A investigação vira tentativa e erro manual.', cause: 'Realce de chaves, linhas-guia, Structure e formatação não estão sendo usados.', inspect: 'Clique junto à chave e procure a ação com Ctrl+Shift+A.', fix: 'Use a IDE como lente, mantendo a explicação estrutural sob seu controle.' },
  { title: 'Ignorar o compilador', symptom: 'Várias mudanças aleatórias escondem a causa original.', cause: 'Arquivo, linha, marcador e mensagem não foram lidos.', inspect: 'Leia o primeiro diagnóstico completo antes dos erros seguintes.', fix: 'Corrija uma hipótese, recompile e compare a nova evidência.' }
];

const EVIDENCE_DOC = [
  '# Aula 022 — blocos, chaves e leitura', '',
  '## Estrutura',
  '- [ ] Identifiquei classe, main, instruções e pares de chaves',
  '- [ ] Li um exemplo de fora para dentro e de dentro para fora',
  '- [ ] Expliquei por que chaves definem e indentação revela blocos', '',
  '## Prática',
  '- [ ] Compilei e executei Main.java',
  '- [ ] Compilei e executei ValidacaoPedido.java',
  '- [ ] Compilei e executei LeituraOrdemServico.java',
  '- [ ] Quebrei uma chave, li o primeiro erro, corrigi e recompilei', '',
  '## IDE e diagnóstico',
  '- [ ] Usei Ctrl+Alt+L e conferi a intenção depois da formatação',
  '- [ ] Sei localizar o par de uma chave',
  '- [ ] Diferencio código fora do método e fora da classe', '',
  '## Git',
  '- [ ] Revisei git status e git diff',
  '- [ ] Nenhum .class entrou no staged diff',
  '- [ ] Registrei a evidência no diário', '',
  '## Minha explicação',
  '- Um bloco é:',
  '- Aninhamento é:',
  '- Indentação ajuda porque:',
  '- A linha que eu mais demorei para localizar foi:'
].join('\n');

const steps = [
  { id: 'mapa', label: 'Mapa estrutural', duration: '10 min', eyebrow: 'Comece aqui', title: 'Troque a massa de símbolos por uma árvore de pertencimento', blocks: [{ type: 'lead', text: 'Hoje eu vou ensinar você a enxergar onde cada parte mora. Primeiro selecionamos classe, método e instrução; depois usamos essa visão para formatar, diagnosticar e defender código real.' }, { type: 'structureMap' }, { type: 'note', tone: 'info', title: 'Uma distinção que guiará a aula', text: 'Chaves definem a estrutura que Java interpreta. Indentação comunica essa estrutura para pessoas. Código profissional precisa das duas coerentes.' }] },
  { id: 'pares', label: 'Pares de chaves', duration: '14 min', eyebrow: 'Etapa 1', title: 'Dê um dono para cada abertura e cada fechamento', blocks: [{ type: 'lead', text: 'Não conte chaves como caracteres soltos. Cada abertura cria uma fronteira e cada fechamento precisa retornar ao nível do dono desse bloco.' }, { type: 'braceLab' }, { type: 'note', tone: 'info', title: 'Comentário didático, não decoração permanente', text: 'Durante o treino, você pode marcar “início/fim da classe” e “início/fim do método”. Depois remova: o pareamento e a indentação devem sustentar a leitura.' }] },
  { id: 'leitura', label: 'Duas leituras', duration: '16 min', eyebrow: 'Etapa 2', title: 'Leia de fora para dentro e investigue de dentro para fora', blocks: [{ type: 'lead', text: 'A leitura externa cria o mapa geral. A leitura interna responde a uma pergunta de diagnóstico: “esta linha pertence a qual bloco, método e classe?”. Pratique as duas sobre a mesma ordem de serviço.' }, { type: 'readingLens' }] },
  { id: 'indentacao', label: 'Indentação honesta', duration: '18 min', eyebrow: 'Etapa 3', title: 'Use quatro espaços para revelar a estrutura — nunca para inventá-la', blocks: [{ type: 'lead', text: 'Java pode compilar código sem recuo porque são as chaves que delimitam os blocos. Compare o texto bagunçado, uma indentação enganosa e a versão formatada.' }, { type: 'indentationLab' }, { type: 'note', tone: 'warning', title: 'Formatação não adivinha intenção', text: 'Ctrl+Alt+L reorganiza conforme as chaves existentes. Se a chave estiver no lugar errado, a IDE pode apenas tornar o erro estrutural mais visível. Sempre leia o resultado.' }] },
  { id: 'acao', label: 'Blocos em ação', duration: '17 min', eyebrow: 'Etapa 4', title: 'Compare espaço estrutural, sequência e aninhamento', blocks: [{ type: 'lead', text: 'Um bloco vazio não age. Várias instruções no mesmo nível executam de cima para baixo. Um bloco interno pertence a outro bloco. Alterne os casos e associe código, árvore e console.' }, { type: 'blockCases' }] },
  { id: 'fronteiras', label: 'Fronteiras legais', duration: '15 min', eyebrow: 'Etapa 5', title: 'Descubra por que uma linha válida falha quando muda de lugar', blocks: [{ type: 'lead', text: 'System.out.println é uma instrução válida, mas contexto faz parte da sintaxe. Coloque a mesma intenção dentro do main, no corpo da classe e depois da classe.' }, { type: 'placementLab' }, { type: 'note', tone: 'info', title: 'Escopo visual agora; escopo da linguagem depois', text: 'Nesta aula, o recuo ajuda a enxergar pertencimento. Em aulas futuras, variáveis criadas dentro de um bloco também terão existência limitada por esse escopo real.' }] },
  { id: 'backend', label: 'Mapa de backend', duration: '18 min', eyebrow: 'Etapa 6', title: 'Localize o que executa dentro, depois e fora de cada regra', blocks: [{ type: 'lead', text: 'Ainda não estamos aprendendo a decidir com if. Usamos condições verdadeiras para tornar os blocos visíveis e treinar a leitura que você fará em serviços, validações e tratamento de erros.' }, { type: 'domainMap' }, { type: 'note', tone: 'warning', title: 'Muitos níveis são um sinal, não um convite à refatoração cega', text: 'Antes de reduzir aninhamento, preserve o comportamento e entenda o caminho. Técnicas de guarda e extração de método virão quando você puder testá-las.' }] },
  { id: 'intellij', label: 'Lentes do IntelliJ', duration: '16 min', eyebrow: 'Etapa 7', title: 'Faça a IDE revelar pares, níveis e blocos recolhíveis', blocks: [{ type: 'lead', text: 'Abra o arquivo no IntelliJ ao lado desta simulação. Clique junto a uma chave, observe o par, formate e recolha um bloco. A interface pode variar; os estados que você procura permanecem.' }, { type: 'ideaMock' }] },
  { id: 'erros', label: 'Clínica de chaves', duration: '24 min', eyebrow: 'Etapa 8', title: 'Leia o primeiro sintoma antes de mover qualquer chave', blocks: [{ type: 'lead', text: 'Algumas falhas impedem compilação; outras compilam e enganam pessoas. Explore os dez casos usando sempre sintoma, inspeção, causa, correção e nova prova.' }, { type: 'errorClinic' }] },
  { id: 'entrega', label: 'Laboratório e Git', duration: '24 min', eyebrow: 'Etapa final', title: 'Construa três mapas executáveis e prove uma recuperação completa', blocks: [{ type: 'lead', text: 'Agora pratique no repositório real. Crie os três arquivos, preveja as saídas, compile, execute e quebre uma única chave de propósito. O painel mostra o roteiro e as evidências esperadas; ele não altera sua máquina.' }, { type: 'delivery' }, { type: 'challenge', title: 'Leitura estrutural sem muletas', text: 'Crie LeituraAtendimento.java com classe, main, um if externo, um if interno e uma instrução que volta ao main. Antes de executar, desenhe a árvore e marque o dono de cada fechamento.', acceptance: ['O arquivo compila e a saída coincide com a previsão.', 'A árvore distingue classe, main, if externo, if interno e instruções irmãs.', 'Você explica qual linha está fora dos ifs, mas dentro do main.', 'Uma chave removida produz diagnóstico lido e uma correção confirmada.', 'O staged diff contém fontes e registro; nenhum .class.', 'A próxima aula permanece focada em comentários úteis, sem antecipar Javadoc profundo.'] }] }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return <button type="button" className="bs22-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', showLineNumbers = true }) {
  return <div className="guided-file bs22-code"><div className="guided-file-title"><FileCode2 size={17} /> {name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={showLineNumbers} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.8rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></div>;
}

function StructureMap() {
  const [selected, setSelected] = useState(0);
  const part = STRUCTURE_PARTS[selected];
  return <section className="bs22-structure"><CodePanel name="Main.java" code={MAIN_CODE} /><div className="bs22-tree" role="tablist" aria-label="Camadas do programa">{STRUCTURE_PARTS.map((item, index) => <React.Fragment key={item.label}><button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} style={{ '--depth': index }}><span>{index + 1}</span><div><strong>{item.label}</strong><small>linhas {item.lines} · profundidade {item.depth}</small></div></button>{index < STRUCTURE_PARTS.length - 1 && <ArrowDown size={17} />}</React.Fragment>)}</div><article role="tabpanel"><Layers3 size={23} /><div><small>Nível selecionado</small><h3>{part.label}</h3><p>{part.text}</p></div></article></section>;
}

function BraceLab() {
  const [selected, setSelected] = useState(0);
  const pair = BRACE_PAIRS[selected];
  return <section className="bs22-braces"><div className="bs22-brace-visual"><div className="bs22-brace-rail"><span className={selected === 0 ? 'active' : ''}>{'{'}</span><span className={selected === 1 ? 'active' : ''}>{'{'}</span><code>System.out.println(...);</code><span className={selected === 1 ? 'active' : ''}>{'}'}</span><span className={selected === 0 ? 'active' : ''}>{'}'}</span></div><div className="bs22-brace-code"><CodePanel name="Main.java · clique em um par" code={MAIN_CODE} /></div></div><div className="bs22-pair-controls">{BRACE_PAIRS.map((item, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={item.label}><Braces size={18} /><span><strong>{item.label}</strong><small>{item.open} ↔ {item.close}</small></span></button>)}</div><article><span className="bs22-depth">{pair.depth}</span><div><small>Dono do bloco</small><h3>{pair.owner}</h3><p>{pair.explanation}</p></div></article></section>;
}

function ReadingLens() {
  const [mode, setMode] = useState('outside');
  const items = READ_PATHS[mode];
  return <section className="bs22-reading"><div className="bs22-reading-toolbar"><button type="button" className={mode === 'outside' ? 'active' : ''} onClick={() => setMode('outside')}><Maximize2 size={17} /> Fora → dentro</button><button type="button" className={mode === 'inside' ? 'active' : ''} onClick={() => setMode('inside')}><Minimize2 size={17} /> Dentro → fora</button></div><div className="bs22-reading-grid"><CodePanel name="LeituraOrdemServico.java" code={ORDER_CODE} /><ol>{items.map(([number, title, text]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol></div><p className="bs22-reading-answer"><ScanSearch size={18} /><span><strong>Teste de pertencimento:</strong> “Checklist” está fora do if interno, dentro do if externo; “Fim da leitura” está fora dos ifs, dentro do main.</span></p></section>;
}

function IndentationLab() {
  const [mode, setMode] = useState('messy');
  const data = mode === 'messy'
    ? { code: MESSY_CODE, title: 'Chaves válidas, leitura cara', text: 'Pode compilar, mas os níveis desapareceram para o leitor.' }
    : mode === 'misleading'
      ? { code: MISLEADING_CODE, title: 'O recuo mente; as chaves vencem', text: 'B está fora do if. A posição visual não muda o bloco definido pelas chaves.' }
      : { code: FORMATTED_CODE, title: 'Quatro espaços por nível', text: 'A classe está no nível 0; main no 1; if no 2; suas instruções avançam mais um nível.' };
  return <section className="bs22-indent"><div className="bs22-indent-controls">{[['messy', 'Sem recuo'], ['misleading', 'Enganosa'], ['formatted', 'Ctrl + Alt + L']].map(([id, label]) => <button type="button" className={mode === id ? 'active' : ''} onClick={() => setMode(id)} key={id}><IndentIncrease size={16} />{label}</button>)}</div><CodePanel name="Main.java" code={data.code} /><article className={mode === 'formatted' ? 'ok' : 'warning'}><CircleDot size={20} /><div><h3>{data.title}</h3><p>{data.text}</p></div></article><div className="bs22-indent-rules"><span><strong>Quem define</strong><small>chaves {'{ }'}</small></span><ChevronRight size={18} /><span><strong>Quem revela</strong><small>indentação coerente</small></span><ChevronRight size={18} /><span><strong>Quem confirma</strong><small>leitura + compilação</small></span></div></section>;
}

function BlockCases() {
  const [selected, setSelected] = useState(0);
  const item = BLOCK_CASES[selected];
  return <section className="bs22-cases"><nav role="tablist">{BLOCK_CASES.map((entry, index) => <button type="button" role="tab" aria-selected={selected === index} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.id}>{entry.label}</button>)}</nav><div className="bs22-case-grid"><CodePanel name={item.id === 'nested' ? 'ValidacaoPedido.java' : 'Main.java'} code={item.code} /><div><section className="bs22-map-stack"><header><FolderTree size={17} /> Mapa do bloco</header>{item.map.map((node, index) => <span style={{ '--level': index }} key={node}><i />{node}</span>)}</section><section className="bs22-console"><header><Terminal size={16} /> Saída esperada</header><pre>{item.output}</pre></section></div></div><p><Lightbulb size={18} />{item.explanation}</p></section>;
}

function PlacementLab() {
  const [selected, setSelected] = useState(0);
  const item = PLACEMENTS[selected];
  return <section className="bs22-placement"><nav>{PLACEMENTS.map((entry, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={entry.id}><span>{index + 1}</span>{entry.label}</button>)}</nav><div className="bs22-placement-grid"><CodePanel name="Main.java" code={item.code} /><article className={item.tone}><header>{item.tone === 'ok' ? <CheckCircle2 size={22} /> : <TriangleAlert size={22} />}<div><small>Resultado</small><h3>{item.result}</h3></div></header><pre>{item.diagnostic}</pre><p>{item.explanation}</p>{item.tone === 'bad' && <div className="bs22-recovery"><Wrench size={17} /> Corrija o pertencimento, formate e execute <code>javac Main.java</code> novamente.</div>}</article></div></section>;
}

function DomainMap() {
  const [selected, setSelected] = useState('order');
  const order = selected === 'order';
  const code = order ? ORDER_CODE : VALIDATION_CODE;
  const tree = order
    ? ['LeituraOrdemServico', 'main', 'if externo: Status + if interno + Checklist', 'if interno: Atividade', 'main novamente: Fim da leitura']
    : ['ValidacaoPedido', 'main', 'if externo: Pedido encontrado + if interno', 'if interno: Cliente ativo', 'main novamente: Validação finalizada'];
  return <section className="bs22-domain"><div className="bs22-domain-tabs"><button type="button" className={order ? 'active' : ''} onClick={() => setSelected('order')}>Ordem de serviço</button><button type="button" className={!order ? 'active' : ''} onClick={() => setSelected('validation')}>Validação de pedido</button></div><div className="bs22-domain-grid"><CodePanel name={order ? 'LeituraOrdemServico.java' : 'ValidacaoPedido.java'} code={code} /><ol>{tree.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol></div><aside><BookOpenCheck size={19} /><span><strong>Leitura ativa:</strong> nomeie a classe, os métodos, os blocos, o dono de cada instrução e onde o fluxo retorna um nível. Só então tente resumir o comportamento.</span></aside></section>;
}

function IdeaMock() {
  const [formatted, setFormatted] = useState(false);
  const [pair, setPair] = useState(false);
  const [folded, setFolded] = useState(false);
  const code = folded ? 'public class Main {\n    public static void main(String[] args) { ... }\n}' : formatted ? FORMATTED_CODE : MESSY_CODE;
  return <section className="bs22-idea"><header><span><Code2 size={16} /> aula-022-blocos-chaves-indentacao</span><div><button type="button" className={formatted ? 'active' : ''} onClick={() => setFormatted(true)}><IndentIncrease size={14} /> Reformat Code</button><button type="button" className={pair ? 'active' : ''} onClick={() => setPair(!pair)}><Braces size={14} /> Par de chaves</button><button type="button" className={folded ? 'active' : ''} onClick={() => setFolded(!folded)}>{folded ? <Maximize2 size={14} /> : <Minimize2 size={14} />}{folded ? 'Expandir' : 'Recolher'}</button></div></header><main><aside><strong>Project</strong><span><FolderTree size={15} /> aula-022...</span><span className="selected"><FileCode2 size={15} /> Main.java</span><hr /><small>Structure</small><span>◉ Main</span><span>└ main(String[])</span></aside><section className={pair ? 'pair-visible' : ''}><div className="bs22-editor-tab">Main.java {pair && <small>{'{ linha 1 ↔ } linha ' + (folded ? '3' : '12')}</small>}</div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, minHeight: '290px', padding: '18px', background: '#1f2530', fontSize: '.78rem', lineHeight: 1.65 }}>{code}</SyntaxHighlighter></section></main><footer><MonitorCog size={18} /><span><strong>{!formatted ? 'Estado inicial: formatação ainda não aplicada.' : pair ? 'O par selecionado ganhou destaque; confira o dono antes de editar.' : folded ? 'O corpo foi recolhido sem alterar o código.' : 'Código reformatado; agora valide se as chaves expressam sua intenção.'}</strong><small>Ctrl+Alt+L formata · Ctrl+Shift+A busca ações · Alt+1 abre Project · Shift Shift busca arquivos · Ctrl+E mostra recentes.</small></span></footer><p>Simulação didática da interface. Nomes e regiões correspondem ao IntelliJ; detalhes visuais podem variar por versão e keymap.</p></section>;
}

function ErrorClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="bs22-errors"><nav aria-label="Dez problemas de estrutura">{ERRORS.map((error, index) => <button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} key={error.title}><span>{index + 1}</span>{error.title}</button>)}</nav><article><header><AlertTriangle size={23} /><div><small>Caso {selected + 1} de {ERRORS.length}</small><h3>{item.title}</h3></div></header><section className="bs22-symptom"><strong>Sintoma ou evidência</strong><code>{item.symptom}</code></section><div className="bs22-diagnosis"><section><Search size={18} /><span><strong>Inspecione</strong>{item.inspect}</span></section><ChevronRight size={18} /><section><CircleDot size={18} /><span><strong>Causa provável</strong>{item.cause}</span></section><ChevronRight size={18} /><section><Wrench size={18} /><span><strong>Corrija e prove</strong>{item.fix}</span></section></div></article></section>;
}

function Delivery() {
  const [step, setStep] = useState(0);
  const terminal = [
    ['Criar o laboratório', 'New-Item -ItemType Directory -Force labs\\m1\\aula-022-blocos-chaves-indentacao\ncd labs\\m1\\aula-022-blocos-chaves-indentacao', 'Directory: ...\\labs\\m1\\aula-022-blocos-chaves-indentacao', 'Crie Main.java, ValidacaoPedido.java e LeituraOrdemServico.java dentro desta pasta.'],
    ['Compilar os três', 'javac Main.java\njavac ValidacaoPedido.java\njavac LeituraOrdemServico.java', '[nenhuma mensagem, se os três forem aceitos]', 'Confirme os três .class no disco; silêncio do javac precisa de evidência.'],
    ['Executar e comparar', 'java Main\njava ValidacaoPedido\njava LeituraOrdemServico', 'Blocos e chaves\n[saídas de validação e ordem de serviço]', 'Preveja cada linha antes de executar e compare a ordem observada.'],
    ['Quebrar e recuperar', '# remova uma chave final de Main.java\njavac Main.java', "Main.java:4: error: reached end of file while parsing", 'Leia arquivo, linha e mensagem; restaure o par, formate, compile e execute novamente.'],
    ['Revisar e entregar', 'git status\ngit diff\ngit add labs/m1/aula-022-blocos-chaves-indentacao docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 022: pratica blocos chaves e indentacao"\ngit status', 'On branch ...\nnothing to commit, working tree clean', 'O texto da branch pode variar. Se .class aparecer, pare e corrija *.class no .gitignore antes do commit.']
  ];
  const current = terminal[step];
  return <section className="bs22-delivery"><nav>{terminal.map((entry, index) => <button type="button" className={(step === index ? 'active ' : '') + (index < step ? 'done' : '')} onClick={() => setStep(index)} key={entry[0]}><span>{index < step ? <Check size={13} /> : index + 1}</span>{entry[0]}</button>)}</nav><div className="bs22-terminal"><header><Terminal size={16} /> PowerShell <small>saída didática esperada</small></header><pre><strong>PS&gt; {current[1]}</strong>{'\n\n'}{current[2]}</pre><p><Lightbulb size={17} />{current[3]}</p></div><div className="bs22-delivery-actions"><button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={15} /> Voltar</button><span>{step + 1} de {terminal.length}</span><button type="button" disabled={step === terminal.length - 1} onClick={() => setStep(step + 1)}>Próxima prova <ArrowRight size={15} /></button></div><div className="guided-file bs22-evidence"><div className="guided-file-title"><BookOpenCheck size={17} /> docs/blocos-chaves-leitura.md <CopyButton value={EVIDENCE_DOC} label="Copiar modelo" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#101827', fontSize: '.78rem', lineHeight: 1.65 }}>{EVIDENCE_DOC}</SyntaxHighlighter></div><aside><GitBranch size={19} /><span><strong>Stage nominal e revisão obrigatória.</strong> O commit sugerido só faz sentido depois que suas três execuções, a recuperação do erro e o staged diff forem realmente observados.</span></aside></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'structureMap') return <StructureMap />;
  if (block.type === 'braceLab') return <BraceLab />;
  if (block.type === 'readingLens') return <ReadingLens />;
  if (block.type === 'indentationLab') return <IndentationLab />;
  if (block.type === 'blockCases') return <BlockCases />;
  if (block.type === 'placementLab') return <PlacementLab />;
  if (block.type === 'domainMap') return <DomainMap />;
  if (block.type === 'ideaMock') return <IdeaMock />;
  if (block.type === 'errorClinic') return <ErrorClinic />;
  if (block.type === 'delivery') return <Delivery />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') return <section className="guided-challenge"><div className="guided-challenge-title"><Compass size={22} /><h3>{block.title}</h3></div><p>{block.text}</p><h4>Critérios de aceite</h4><ul>{block.acceptance.map(item => <li key={item}>{item}</li>)}</ul></section>;
  return null;
}

export default function GuidedCodeStructureLesson022({
  isCompleted,
  onToggleCompleted,
  onNextLesson,
  onPrevLesson,
  hasNextLesson,
  hasPrevLesson
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LESSON_STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify([...completedStepIds])), [completedStepIds]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const completedLabel = useMemo(() => completedStepIds.size + ' de ' + steps.length + ' etapas concluídas', [completedStepIds]);

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

  return <article className="guided-git-lesson guided-code-structure-lesson">
    <header className="guided-hero">
      <div className="guided-hero-copy"><span className="guided-kicker"><Braces size={17} /> Oficina de leitura estrutural</span><p className="guided-sequence">022 · M1.02</p><h1>Enxergue o bloco antes de tentar consertar o código</h1><p>Pareie chaves, leia níveis, formate sem se enganar e diagnostique onde cada instrução realmente pertence.</p></div>
      <div className="guided-hero-status"><Layers3 size={42} /><strong>{progress}%</strong><span>{completedLabel}</span></div>
      <div className="guided-progress-track" aria-label={'Progresso: ' + progress + '%'}><span style={{ width: progress + '%' }} /></div>
    </header>

    <GuidedLessonFacts ariaLabel="Resultado da aula" items={[{ value: 4, label: 'níveis legíveis' }, { value: 3, label: 'programas executados' }, { value: 10, label: 'falhas investigáveis' }]} />

    <div className="guided-layout">
      <nav className="guided-step-nav" aria-label="Etapas da aula 022"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
      <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={activeStep.id + '-' + block.type + '-' + index} />)}</div>
        <div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (activeStepComplete ? 'undo' : 'complete')} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><Check size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>
        {allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>{lessonComplete ? 'Leitura estrutural registrada' : 'Laboratório concluído'}</h3><p>{lessonComplete ? 'Etapas, evidências e conclusão geral estão registradas.' : 'Conclua a aula para liberar comentários úteis e documentação inicial.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}
      </main>
    </div>
    <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 021</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsComplete ? 'ready' : '')}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : completedStepIds.size + ' de ' + steps.length + ' etapas'}</strong><small>{lessonComplete ? 'Estrutura lida e provada' : allStepsComplete ? 'Use o botão acima' : 'Pareie, leia e diagnostique'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas e a aula para avançar' : 'Abrir comentários úteis e documentação inicial'}>Aula 023 <ArrowRight size={17} /></button></footer>
  </article>;
}
