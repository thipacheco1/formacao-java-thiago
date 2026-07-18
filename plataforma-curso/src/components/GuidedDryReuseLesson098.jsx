import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Boxes, Check, CheckCircle2, Clock3, Copy, FileCode2, GitCompareArrows, ListChecks, Network, PackageCheck, RotateCcw, Sparkles, StepForward, Terminal, Wrench } from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedDryReuseLesson.css';

const STORAGE_KEY = 'guided-dry-reuse-lesson-098-progress';
const BAD = [
  '// EXEMPLO PARA ANÁLISE — não mantenha esta duplicação',
  'public class DuplicacaoValidacaoRuim {',
  '    public static void cadastrarCliente(String nome, String email) {',
  '        if (nome == null || nome.trim().isEmpty()) {',
  '            throw new IllegalArgumentException("Nome do cliente é obrigatório.");',
  '        }',
  '        if (email == null || email.trim().isEmpty()) {',
  '            throw new IllegalArgumentException("E-mail do cliente é obrigatório.");',
  '        }',
  '    }', '',
  '    public static void cadastrarProduto(String nomeProduto, String categoria) {',
  '        if (nomeProduto == null || nomeProduto.trim().isEmpty()) {',
  '            throw new IllegalArgumentException("Nome do produto é obrigatório.");',
  '        }',
  '        if (categoria == null || categoria.trim().isEmpty()) {',
  '            throw new IllegalArgumentException("Categoria do produto é obrigatória.");',
  '        }',
  '    }',
  '}',
].join('\n');
const VALIDATIONS = [
  'public final class ValidacoesBasicas {',
  '    private ValidacoesBasicas() {',
  '    }', '',
  '    public static void validarTextoObrigatorio(String texto, String nomeCampo) {',
  '        if (texto == null || texto.trim().isEmpty()) {',
  '            throw new IllegalArgumentException(',
  '                    nomeCampo + " é obrigatório e não pode estar em branco.");',
  '        }',
  '    }',
  '}',
].join('\n');
const CALCULATIONS = [
  'import java.math.BigDecimal;',
  'import java.math.RoundingMode;', '',
  'public final class CalculosPedido {',
  '    private CalculosPedido() {',
  '    }', '',
  '    public static BigDecimal calcularTotal(BigDecimal precoUnitario, int quantidade) {',
  '        if (precoUnitario == null) {',
  '            throw new IllegalArgumentException("Preço unitário é obrigatório.");',
  '        }',
  '        if (quantidade <= 0) {',
  '            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");',
  '        }',
  '        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));',
  '    }', '',
  '    public static BigDecimal aplicarDesconto(BigDecimal total, BigDecimal percentualDesconto) {',
  '        if (total == null || percentualDesconto == null) {',
  '            return BigDecimal.ZERO;',
  '        }',
  '        return total.multiply(percentualDesconto)',
  '                .setScale(2, RoundingMode.HALF_UP);',
  '    }',
  '}',
].join('\n');
const MANUAL_TEST = [
  'import java.math.BigDecimal;', '',
  'public class TesteManualReuso {',
  '    public static void main(String[] args) {',
  '        try {',
  '            ValidacoesBasicas.validarTextoObrigatorio("", "Nome do Cliente");',
  '        } catch (IllegalArgumentException e) {',
  '            System.out.println("Validação funcionou corretamente: " + e.getMessage());',
  '        }', '',
  '        BigDecimal preco = new BigDecimal("49.90");',
  '        int qtde = 3;',
  '        BigDecimal totalBruto = CalculosPedido.calcularTotal(preco, qtde);',
  '        BigDecimal desconto = CalculosPedido.aplicarDesconto(',
  '                totalBruto, new BigDecimal("0.10"));', '',
  '        System.out.println("Total Bruto: " + totalBruto);',
  '        System.out.println("Desconto Aplicado: " + desconto);',
  '    }',
  '}',
].join('\n');
const STOCK_CALC = [
  'import java.math.BigDecimal;', '',
  'public final class CalculosEstoque {',
  '    private CalculosEstoque() {',
  '    }', '',
  '    public static BigDecimal calcularValorEmEstoque(',
  '            BigDecimal precoUnitario, int quantidade) {',
  '        if (precoUnitario == null) {',
  '            throw new IllegalArgumentException("Preço é obrigatório.");',
  '        }',
  '        if (quantidade < 0) {',
  '            throw new IllegalArgumentException("Estoque não pode ser negativo.");',
  '        }',
  '        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));',
  '    }',
  '}',
].join('\n');
const STOCK_TEST = [
  'import java.math.BigDecimal;', '',
  'public class TesteEstoque {',
  '    public static void main(String[] args) {',
  '        String nome = "Teclado Mecânico";',
  '        BigDecimal preco = new BigDecimal("49.90");',
  '        int quantidade = 30;', '',
  '        ValidacoesBasicas.validarTextoObrigatorio(nome, "Nome do Produto");',
  '        BigDecimal valor = CalculosEstoque.calcularValorEmEstoque(preco, quantidade);', '',
  '        System.out.println("Produto: " + nome);',
  '        System.out.println("Valor em estoque: R$ " + valor);',
  '    }',
  '}',
].join('\n');
const EVIDENCE = [
  '# Aula 098 — Reuso sem duplicação', '',
  '- [ ] Expliquei conhecimento com fonte única',
  '- [ ] Diferenciei duplicação semântica e visual',
  '- [ ] Mapeei quatro cópias de validação',
  '- [ ] Extraí ValidacoesBasicas',
  '- [ ] Parametrizei nomeCampo',
  '- [ ] Separei CalculosPedido',
  '- [ ] Preservei BigDecimal e arredondamento',
  '- [ ] Impedi instâncias dos utilitários',
  '- [ ] Evitei Utils/Helper gigante',
  '- [ ] Provei equivalência no teste manual',
  '- [ ] Criei CalculosEstoque coeso',
  '- [ ] Usei Step Into entre arquivos',
  '- [ ] Revisei respostas, diff e .class',
].join('\n');
const DUPLICATIONS = [
  ['Imposto em dois pedidos', 'semântica', 'A mesma regra fiscal muda pelo mesmo motivo.', 'extrair'],
  ['valor > 0 em estoque e dependentes', 'visual', 'As políticas pertencem a domínios que evoluem separadamente.', 'separar'],
  ['Validação de texto obrigatório', 'semântica', 'Null, branco e mensagem representam o mesmo contrato básico.', 'extrair'],
  ['Dois títulos com =====', 'avaliar', 'Podem ser a mesma identidade visual ou relatórios independentes.', 'investigar'],
  ['return a + b em uma única classe', 'trivial', 'Uma abstração genérica pode custar mais do que a linha.', 'manter'],
  ['Chamada externa repetida', 'semântica', 'Timeout, autenticação e contrato precisam de um dono.', 'extrair'],
];
const ERRORS = [
  ['Utils gigante', 'Validação, banco, e-mail e cálculo vivem em 3 mil linhas.', 'Divida por responsabilidade e motivo de mudança.'],
  ['DRY excessivo', 'return a + b ganha uma abstração genérica sem valor.', 'Extraia quando conhecimento e mudança são compartilhados.'],
  ['Semelhança visual forçada', 'Estoque e dependentes usam valor > 0 e viram a mesma regra.', 'Mantenha conceitos que evoluem por motivos diferentes separados.'],
  ['Regra sem fonte única', 'A taxa fiscal está copiada em vários serviços.', 'Escolha um dono autoritativo e faça os chamadores delegarem.'],
  ['Classe sem coesão', 'Um Helper conhece console, SQL e HTTP.', 'Nomeie a especialidade: ValidacoesBasicas, CalculosPedido.'],
  ['Construtor público', 'new CalculosPedido() cria objeto utilitário sem estado.', 'Use final, construtor private e métodos static.'],
  ['Parâmetro rígido', 'Cada campo exige um validador copiado só para mudar a mensagem.', 'Parametrize nomeCampo sem apagar o contrato comum.'],
  ['Refatoração sem prova', 'A duplicação some, mas a saída ou exceção muda.', 'Compile e compare comportamento antes e depois.'],
];

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return <button type="button" className="guided-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : 'Copiar'}</button>;
}
function CodePanel({ name, code, label }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}{label && <small>{label}</small>}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}
function KnowledgeLab() {
  const [copies, setCopies] = useState(4);
  const files = ['Cliente.java', 'Produto.java', 'Pedido.java', 'Fornecedor.java'];
  return <section className="dr98-stack"><label className="dr98-range"><span>Cópias da mesma regra <strong>{copies}</strong></span><input type="range" min="1" max="4" value={copies} onChange={event => setCopies(Number(event.target.value))} /></label><div className="dr98-copies">{files.map((file, index) => <div key={file} className={index < copies ? 'active' : ''}><FileCode2 /><strong>{file}</strong><code>texto == null || isEmpty()</code></div>)}</div><div className="dr98-change"><span>regra muda</span><ArrowRight /><strong>{copies === 1 ? '1 alteração' : copies + ' alterações coordenadas'}</strong><ArrowRight /><span>{copies === 1 ? 'uma fonte autoritativa' : 'risco de esquecer uma cópia'}</span></div><article className="dr98-rule"><CheckCircle2 /><div><strong>DRY — Don't Repeat Yourself</strong><span>Trate conhecimento, não contagem de linhas: cada regra deve ter uma representação única, inequívoca e autoritativa quando ela realmente é a mesma regra.</span></div></article></section>;
}
function ClassifierLab() {
  const [selected, setSelected] = useState(0);
  const current = DUPLICATIONS[selected];
  return <section className="dr98-stack"><div className="dr98-cases">{DUPLICATIONS.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</div><div className="dr98-verdict"><small>DIAGNÓSTICO</small><strong>{current[1]}</strong><p>{current[2]}</p><span>Decisão: {current[3]}</span></div><article className="dr98-warning"><AlertTriangle /><div><strong>Pergunta de mentor</strong><span>Esses trechos mudariam juntos pela mesma razão? Se não, a igualdade atual pode ser apenas acidental.</span></div></article></section>;
}
function BadDuplicationLab() {
  const [field, setField] = useState(0);
  const fields = [['nome', 'cliente'], ['email', 'cliente'], ['nomeProduto', 'produto'], ['categoria', 'produto']];
  return <section className="dr98-stack"><div className="dr98-four-copies">{fields.map((item, index) => <button type="button" key={item[0]} className={field === index ? 'active' : ''} onClick={() => setField(index)}><span>{index + 1}</span><strong>{item[0]}</strong><small>{item[1]}</small></button>)}</div><div className="dr98-diff"><code>if ({fields[field][0]} == null || {fields[field][0]}.trim().isEmpty())</code><ArrowRight /><strong>mesmo contrato, só muda campo e mensagem</strong></div><CodePanel name="DuplicacaoValidacaoRuim.java" code={BAD} label="somente análise; não adicionar ao repositório final" /></section>;
}
function ValidationLab() {
  const [field, setField] = useState('E-mail do Cliente');
  const message = `${field} é obrigatório e não pode estar em branco.`;
  return <section className="dr98-stack"><div className="dr98-validation"><label>nomeCampo<select value={field} onChange={event => setField(event.target.value)}><option>Nome do Cliente</option><option>E-mail do Cliente</option><option>Nome do Produto</option><option>Categoria do Produto</option></select></label><div><small>UMA REGRA, CONTEXTO PARAMETRIZADO</small><strong>{message}</strong></div></div><div className="dr98-change"><span>4 condições copiadas</span><ArrowRight /><strong>validarTextoObrigatorio</strong><ArrowRight /><span>4 chamadas legíveis</span></div><CodePanel name="ValidacoesBasicas.java" code={VALIDATIONS} /></section>;
}
function CalculationLab() {
  const [step, setStep] = useState(0);
  const stages = [['preço × quantidade', '49.90 × 3', '149.70'], ['percentual', '149.70 × 0.10', '14.970'], ['arredondamento', 'setScale(2, HALF_UP)', '14.97']];
  const current = stages[step];
  return <section className="dr98-stack"><div className="dr98-calc-steps">{stages.map((item, index) => <button type="button" key={item[0]} className={(step === index ? 'active ' : '') + (step > index ? 'done' : '')} onClick={() => setStep(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</div><div className="dr98-formula"><span>{current[1]}</span><ArrowRight /><strong>{current[2]}</strong></div><article className="dr98-rule"><PackageCheck /><div><strong>Coesão financeira</strong><span>Validação do preço, quantidade, BigDecimal e arredondamento permanecem no mesmo dono: <code>CalculosPedido</code>.</span></div></article><CodePanel name="CalculosPedido.java" code={CALCULATIONS} /></section>;
}
function IntegrationLab() {
  const [frame, setFrame] = useState(0);
  const frames = [
    ['TesteManualReuso.main', 'chama validarTextoObrigatorio', 'arquivo principal'],
    ['ValidacoesBasicas.validarTextoObrigatorio', 'texto = ""', 'Step Into · F7'],
    ['TesteManualReuso.main', 'catch recebe IllegalArgumentException', 'retorno ao chamador'],
    ['CalculosPedido.calcularTotal', '49.90 × 3 = 149.70', 'Step Into · F7'],
    ['CalculosPedido.aplicarDesconto', '149.70 × 0.10 = 14.97', 'resultado final'],
  ];
  const current = frames[frame];
  return <section className="dr98-stack"><div className="dr98-debug"><header><span>TesteManualReuso.java · simulação didática do IntelliJ</span><span>Frames e Variables</span></header><div className="dr98-debug-body"><aside>{frames.map((item, index) => <button type="button" key={item[0] + index} className={frame === index ? 'active' : ''} onClick={() => setFrame(index)}>{index + 1}<span>{item[0]}</span></button>)}</aside><main><small>{current[2]}</small><strong>{current[0]}</strong><p>{current[1]}</p><button type="button" onClick={() => setFrame(value => Math.min(value + 1, frames.length - 1))} disabled={frame === frames.length - 1}><StepForward size={15} />Executar próximo passo</button></main></div><footer>F7 entra no utilitário; o retorno reaparece no fluxo principal sem duplicar a regra.</footer></div><CodePanel name="TesteManualReuso.java" code={MANUAL_TEST} /><div className="dr98-console"><pre>{'Validação funcionou corretamente: Nome do Cliente é obrigatório e não pode estar em branco.\nTotal Bruto: 149.70\nDesconto Aplicado: 14.97'}</pre></div></section>;
}
function CohesionLab() {
  const [mode, setMode] = useState('focused');
  const focused = [['ValidacoesBasicas', 'texto e limites básicos'], ['CalculosPedido', 'total e desconto'], ['ConsoleInput', 'entrada do terminal'], ['ConsoleView', 'apresentação no console']];
  return <section className="dr98-stack"><div className="dr98-toggle"><button type="button" className={mode === 'god' ? 'active danger' : ''} onClick={() => setMode('god')}>Utils.java gigante</button><button type="button" className={mode === 'focused' ? 'active' : ''} onClick={() => setMode('focused')}>classes coesas</button></div>{mode === 'god' ? <div className="dr98-god"><Boxes /><strong>Utils.java · 3.000 linhas</strong><div><span>validar texto</span><span>abrir banco</span><span>enviar e-mail</span><span>calcular imposto</span><span>formatar console</span><span>chamar API</span></div><small>seis motivos independentes para mudar</small></div> : <div className="dr98-focused">{focused.map(item => <div key={item[0]}><Network /><strong>{item[0]}</strong><small>{item[1]}</small></div>)}</div>}<article className="dr98-warning"><Wrench /><div><strong>Extração tem custo</strong><span>Uma abstração só ajuda quando o nome, o dono e o motivo de mudança ficam mais claros do que o código original.</span></div></article></section>;
}
function StockLab() {
  const [tab, setTab] = useState('calc');
  return <section className="dr98-stack"><div className="dr98-decision"><span><b>Pedido</b> quantidade comprada deve ser maior que zero</span><GitCompareArrows /><span><b>Estoque</b> quantidade disponível pode ser zero</span></div><article className="dr98-rule"><CheckCircle2 /><div><strong>Mesma multiplicação, invariantes diferentes</strong><span>Criar <code>CalculosEstoque</code> evita acoplar a política de estoque à regra de pedido apenas porque a fórmula atual se parece.</span></div></article><div className="dr98-toggle"><button type="button" className={tab === 'calc' ? 'active' : ''} onClick={() => setTab('calc')}>CalculosEstoque.java</button><button type="button" className={tab === 'test' ? 'active' : ''} onClick={() => setTab('test')}>TesteEstoque.java</button></div><CodePanel name={tab === 'calc' ? 'CalculosEstoque.java' : 'TesteEstoque.java'} code={tab === 'calc' ? STOCK_CALC : STOCK_TEST} /><div className="dr98-console"><pre>{'Produto: Teclado Mecânico\nValor em estoque: R$ 1497.00'}</pre></div></section>;
}
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors dr98-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}
function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const checks = ['duplicação ruim apenas analisada', 'real versus acidental explicado', 'ValidacoesBasicas criada', 'nomeCampo parametrizado', 'CalculosPedido criado', 'construtores privados', 'teste manual executado', 'saída 149.70 e 14.97', 'Utils gigante recusada', 'CalculosEstoque separado', 'Step Into entre arquivos', 'três respostas registradas', 'diff e .class revisados'];
  const commands = ['javac ValidacoesBasicas.java CalculosPedido.java TesteManualReuso.java', 'java TesteManualReuso', 'javac CalculosEstoque.java TesteEstoque.java', 'java TesteEstoque'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  return <section className="dr98-delivery"><div className="dr98-terminal"><header><Terminal size={15} />Compilar somente a solução final<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{'\n\n'}<span>Não adicione DuplicacaoValidacaoRuim.java ao repositório definitivo.</span></pre></div><div className="dr98-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: estoque sem DRY forçado</h3></div><p>Valide o nome com a fonte comum, mas dê ao estoque uma classe de cálculo própria porque sua quantidade pode ser zero e muda por uma política diferente.</p><ul><li>Reutilize <code>ValidacoesBasicas</code>.</li><li>Crie <code>CalculosEstoque</code> coeso.</li><li>Proteja preço nulo e estoque negativo.</li><li>Comprove R$ 1.497,00 sem copiar validações.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'knowledge', label: 'Fonte do Conhecimento', duration: '9 min', eyebrow: 'DRY E PROPAGAÇÃO DE MUDANÇA', title: 'Conte regras, não apenas linhas parecidas', blocks: [{ type: 'lead', text: 'Uma regra copiada exige mudanças coordenadas; uma fonte autoritativa concentra conhecimento e responsabilidade.' }, { type: 'knowledge' }] },
  { id: 'classifier', label: 'Real ou Acidental?', duration: '13 min', eyebrow: 'SEMÂNTICA, VISUAL E MOTIVO', title: 'Decida se dois trechos deveriam mudar juntos', blocks: [{ type: 'lead', text: 'Duplicação real ou semântica pede extração; duplicação acidental ou visual pode esconder regras que evoluem separadamente.' }, { type: 'classifier' }] },
  { id: 'bad', label: 'Quatro Cópias', duration: '11 min', eyebrow: 'CHEIRO, CAMPO E MENSAGEM', title: 'Mapeie o contrato repetido antes de apagar código', blocks: [{ type: 'lead', text: 'O exemplo ruim é material de análise: quatro condições preservam a mesma validação e variam apenas contexto e mensagem.' }, { type: 'bad' }] },
  { id: 'validation', label: 'Extrair Validação', duration: '13 min', eyebrow: 'MÉTODO ÚNICO, CONTEXTO PARAMETRIZADO', title: 'Centralize o contrato sem perder mensagens específicas', blocks: [{ type: 'lead', text: 'nomeCampo permite uma única regra de null/branco produzir erros úteis para cliente, e-mail, produto e categoria.' }, { type: 'validation' }] },
  { id: 'calculation', label: 'CalculosPedido', duration: '14 min', eyebrow: 'COESÃO FINANCEIRA E BIGDECIMAL', title: 'Dê um dono comum ao total e ao desconto do pedido', blocks: [{ type: 'lead', text: 'Preço, quantidade, percentual e arredondamento mudam dentro da mesma responsabilidade financeira.' }, { type: 'calculation' }] },
  { id: 'integration', label: 'Teste e Step Into', duration: '16 min', eyebrow: 'CHAMADOR, UTILITÁRIOS E EQUIVALÊNCIA', title: 'Atravesse arquivos e confirme que a saída permanece correta', blocks: [{ type: 'lead', text: 'A simulação didática acompanha F7 entre validação e cálculo; o programa real prova exceção, total e desconto.' }, { type: 'integration' }] },
  { id: 'cohesion', label: 'Coesão, não Utils', duration: '11 min', eyebrow: 'GOD UTILITY E CUSTO DE ABSTRAÇÃO', title: 'Separe classes pelo motivo de mudança', blocks: [{ type: 'lead', text: 'Uma Utils gigante remove cópias locais, mas cria um centro sem identidade, difícil de testar e manter.' }, { type: 'cohesion' }] },
  { id: 'stock', label: 'Desafio de Estoque', duration: '16 min', eyebrow: 'REUSO CONSCIENTE E POLÍTICA PRÓPRIA', title: 'Reutilize validação e preserve a diferença do domínio', blocks: [{ type: 'lead', text: 'Pedido exige quantidade positiva; estoque aceita zero. A fórmula parecida não autoriza compartilhar a política.' }, { type: 'stock' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'ACOPLAMENTO, COESÃO E PROVA', title: 'Diagnostique oito maneiras de aplicar DRY sem critério', blocks: [{ type: 'lead', text: 'Cada caso separa o desejo de reduzir linhas da obrigação de preservar significado e comportamento.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '11 min', eyebrow: 'COMPILAÇÃO, SAÍDA E GIT', title: 'Entregue apenas abstrações coesas e comprovadas', blocks: [{ type: 'lead', text: 'A oficina termina com cinco fontes finais, duas execuções, saída conhecida e nenhuma classe ruim versionada.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'knowledge') return <KnowledgeLab />;
  if (block.type === 'classifier') return <ClassifierLab />;
  if (block.type === 'bad') return <BadDuplicationLab />;
  if (block.type === 'validation') return <ValidationLab />;
  if (block.type === 'calculation') return <CalculationLab />;
  if (block.type === 'integration') return <IntegrationLab />;
  if (block.type === 'cohesion') return <CohesionLab />;
  if (block.type === 'stock') return <StockLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedDryReuseLesson098({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const validIds = new Set(steps.map(step => step.id));
      return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []);
    } catch { return new Set(); }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => {
    if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) {
      completionNormalizedRef.current = true;
      onToggleCompleted();
    }
  }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => {
    const active = navRef.current?.querySelector('button.active');
    if (active && window.matchMedia('(max-width: 900px)').matches) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);
  const step = steps[activeIndex];
  const stepDone = completedSteps.has(step.id);
  const allStepsDone = completedSteps.size === steps.length;
  const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const toggleStep = () => {
    if (stepDone && isCompleted) onToggleCompleted();
    setCompletedSteps(current => {
      const next = new Set(current);
      if (next.has(step.id)) next.delete(step.id); else next.add(step.id);
      return next;
    });
  };
  return <article className="guided-git-lesson guided-dry-reuse-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><GitCompareArrows size={17} />Oficina de reuso com critério</span><p className="guided-sequence">098 · M3.09</p><h1>Remova a duplicação sem unir regras diferentes</h1><p>Encontre a fonte do conhecimento, extraia classes coesas e prove que a refatoração preservou comportamento.</p></div><div className="guided-hero-status"><Network size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 098" items={[{ value: '5 fontes', label: 'Compiladas de verdade' }, { value: '6 cenários', label: 'Classificados por semântica' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 098"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Uma fonte por conhecimento, uma classe por motivo</h3><p>{lessonComplete ? 'Aula concluída e pronta para debug entrando em métodos.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 097</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>DRY, semântica, coesão e prova</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 099<ArrowRight size={17} /></button></footer></article>;
}
