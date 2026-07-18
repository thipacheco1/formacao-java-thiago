import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Code2, Copy, FileCode2, GitCompareArrows, Keyboard, ListChecks, RotateCcw, Scissors, Sparkles, StepForward, Terminal, TestTube2, WandSparkles } from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedExtractMethodLesson.css';

const STORAGE_KEY = 'guided-extract-method-lesson-100-progress';
const BEFORE = [
  'import java.math.BigDecimal;', '',
  'public class PedidoExtractAntes {',
  '    public static void main(String[] args) {',
  '        BigDecimal preco = new BigDecimal("120.00");',
  '        int quantidade = 3;', '',
  '        BigDecimal totalBruto = preco.multiply(',
  '                BigDecimal.valueOf(quantidade));', '',
  '        BigDecimal frete = BigDecimal.ZERO;',
  '        if (totalBruto.compareTo(new BigDecimal("300.00")) < 0) {',
  '            frete = new BigDecimal("15.00");',
  '        }', '',
  '        BigDecimal totalFinal = totalBruto.add(frete);', '',
  '        System.out.println("--- DETALHES COMPRA ---");',
  '        System.out.println("Bruto: R$ " + totalBruto);',
  '        System.out.println("Frete: R$ " + frete);',
  '        System.out.println("Final: R$ " + totalFinal);',
  '    }',
  '}',
].join('\n');
const AFTER = [
  'import java.math.BigDecimal;', '',
  'public class PedidoExtractDepois {',
  '    public static void main(String[] args) {',
  '        BigDecimal preco = new BigDecimal("120.00");',
  '        int quantidade = 3;', '',
  '        BigDecimal totalBruto = calcularTotalBruto(preco, quantidade);',
  '        BigDecimal frete = calcularFrete(totalBruto);',
  '        BigDecimal totalFinal = totalBruto.add(frete);', '',
  '        imprimirResumo(totalBruto, frete, totalFinal);',
  '    }', '',
  '    public static BigDecimal calcularTotalBruto(',
  '            BigDecimal preco, int quantidade) {',
  '        return preco.multiply(BigDecimal.valueOf(quantidade));',
  '    }', '',
  '    public static BigDecimal calcularFrete(BigDecimal totalBruto) {',
  '        BigDecimal frete = BigDecimal.ZERO;',
  '        if (totalBruto.compareTo(new BigDecimal("300.00")) < 0) {',
  '            frete = new BigDecimal("15.00");',
  '        }',
  '        return frete;',
  '    }', '',
  '    public static void imprimirResumo(',
  '            BigDecimal totalBruto, BigDecimal frete,',
  '            BigDecimal totalFinal) {',
  '        System.out.println("--- DETALHES COMPRA ---");',
  '        System.out.println("Bruto: R$ " + totalBruto);',
  '        System.out.println("Frete: R$ " + frete);',
  '        System.out.println("Final: R$ " + totalFinal);',
  '    }',
  '}',
].join('\n');
const OS_BEFORE = [
  'import java.math.BigDecimal;', '',
  'public class OsExtractAntes {',
  '    public static void main(String[] args) {',
  '        String certificado = "OS-100";',
  '        int horasSuporte = 4;',
  '        int horasAteAtendimento = 6;', '',
  '        BigDecimal valorHora = new BigDecimal("80.00");',
  '        BigDecimal total = valorHora.multiply(',
  '                BigDecimal.valueOf(horasSuporte));', '',
  '        boolean slaAtrasado = horasAteAtendimento > 4;', '',
  '        System.out.println("--- ORDEM DE SERVICO ---");',
  '        System.out.println("Certificado: " + certificado);',
  '        System.out.println("Horas: " + horasSuporte);',
  '        System.out.println("Total: R$ " + total);',
  '        System.out.println("SLA: " + (slaAtrasado ? "ATRASADA" : "NO PRAZO"));',
  '    }',
  '}',
].join('\n');
const OS_AFTER = [
  'import java.math.BigDecimal;', '',
  'public class OsExtractDepois {',
  '    public static void main(String[] args) {',
  '        String certificado = "OS-100";',
  '        int horasSuporte = 4;',
  '        int horasAteAtendimento = 6;', '',
  '        BigDecimal total = calcularPrecoOS(horasSuporte);',
  '        boolean slaAtrasado = verificarSLA(horasAteAtendimento);',
  '        exibirFichaOS(certificado, horasSuporte, total, slaAtrasado);',
  '    }', '',
  '    public static BigDecimal calcularPrecoOS(int horasSuporte) {',
  '        BigDecimal valorHora = new BigDecimal("80.00");',
  '        return valorHora.multiply(BigDecimal.valueOf(horasSuporte));',
  '    }', '',
  '    public static boolean verificarSLA(int horasAteAtendimento) {',
  '        return horasAteAtendimento > 4;',
  '    }', '',
  '    public static void exibirFichaOS(',
  '            String certificado, int horasSuporte,',
  '            BigDecimal total, boolean slaAtrasado) {',
  '        System.out.println("--- ORDEM DE SERVICO ---");',
  '        System.out.println("Certificado: " + certificado);',
  '        System.out.println("Horas: " + horasSuporte);',
  '        System.out.println("Total: R$ " + total);',
  '        System.out.println("SLA: " + (slaAtrasado ? "ATRASADA" : "NO PRAZO"));',
  '    }',
  '}',
].join('\n');
const EVIDENCE = [
  '# Aula 100 — Extract Method no IntelliJ', '',
  '- [ ] Compilei e rodei a versão antes',
  '- [ ] Registrei a saída de referência',
  '- [ ] Selecionei um bloco lógico completo',
  '- [ ] Usei Ctrl + Alt + M',
  '- [ ] Nomeei calcularFrete pela intenção',
  '- [ ] Conferi parâmetros e retorno inferidos',
  '- [ ] Extraí cálculo bruto e impressão',
  '- [ ] Rodei novamente e comparei a saída',
  '- [ ] Completei calcularPrecoOS',
  '- [ ] Completei verificarSLA',
  '- [ ] Completei exibirFichaOS',
  '- [ ] Usei F7 no método extraído',
  '- [ ] Respondi as três perguntas',
  '- [ ] Revisei git diff e artefatos .class',
].join('\n');
const ERRORS = [
  ['Extrair código vermelho', 'A IDE não consegue construir o fluxo de dados do trecho.', 'Compile e elimine os erros antes da refatoração.'],
  ['Seleção pela metade', 'O if ou a declaração necessária fica fora do bloco.', 'Selecione uma unidade lógica completa e executável.'],
  ['Nome extracted', 'A estrutura muda, mas a intenção continua escondida.', 'Use verbo e objeto do negócio ou Shift+F6 para renomear.'],
  ['Misturar regra nova', 'A saída muda e você não sabe se foi refatoração ou funcionalidade.', 'Faça um commit estrutural separado e compare a saída.'],
  ['Parâmetros demais', 'A seleção atravessa responsabilidades e gera assinatura extensa.', 'Reduza a fronteira e extraia blocos coesos em sequência.'],
  ['Dois valores de saída', 'O bloco modifica variáveis diferentes que serão usadas depois.', 'Divida a seleção ou agrupe o resultado em um tipo quando apropriado.'],
  ['Confiar só no preview', 'A transformação parece correta, mas nunca foi executada.', 'Compile, rode e compare evidência antes e depois.'],
  ['Método pequeno sem intenção', 'A extração reduz linhas, mas não cria uma abstração útil.', 'Extraia uma responsabilidade nomeável, não uma quantidade de linhas.'],
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
function CodePanel({ name, code }) {
  return <section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}
function ContractLab() {
  const [phase, setPhase] = useState(0);
  const phases = [
    ['1. Provar', 'código compila + saída registrada'],
    ['2. Transformar', 'mesma regra, estrutura melhor'],
    ['3. Provar de novo', 'saída exatamente equivalente'],
    ['4. Só depois evoluir', 'nova regra em outra mudança'],
  ];
  return <section className="em100-stack"><div className="em100-contract">{phases.map((item, index) => <button type="button" key={item[0]} className={(index === phase ? 'active ' : '') + (index < phase ? 'done' : '')} onClick={() => setPhase(index)}><span>{index < phase ? <Check size={14} /> : index + 1}</span><strong>{item[0]}</strong><small>{item[1]}</small></button>)}</div><article className="em100-rule"><GitCompareArrows /><div><strong>Refatoração preserva comportamento observável</strong><span>Não é “o código parece melhor”. A mesma entrada precisa produzir a mesma saída antes e depois.</span></div></article></section>;
}
function SelectionLab() {
  const [selection, setSelection] = useState(1);
  const options = [
    ['estreita', 'apenas a atribuição dentro do if', 'incompleta: depende da declaração e da condição'],
    ['coesa', 'declaração do frete + if completo', 'correta: uma responsabilidade com uma saída'],
    ['larga', 'frete + total final + impressão', 'mistura cálculo e exibição; assinatura cresce'],
  ];
  const current = options[selection];
  return <section className="em100-stack"><div className="em100-selection"><aside>{options.map((item, index) => <button type="button" key={item[0]} className={selection === index ? 'active' : ''} onClick={() => setSelection(index)}><span>{index + 1}</span><strong>Seleção {item[0]}</strong></button>)}</aside><main><small>TRECHO SELECIONADO</small><strong>{current[1]}</strong><p>{current[2]}</p><div className={selection === 1 ? 'approved' : 'warning'}>{selection === 1 ? <CheckCircle2 /> : <AlertTriangle />}{selection === 1 ? 'Pronta para Ctrl + Alt + M' : 'Ajuste a fronteira antes de extrair'}</div></main></div><article className="em100-rule"><Scissors /><div><strong>Selecione por responsabilidade</strong><span>A fronteira ideal contém tudo que a regra precisa e devolve apenas o que o chamador realmente usa.</span></div></article></section>;
}
function BaselineLab() {
  const output = ['--- DETALHES COMPRA ---', 'Bruto: R$ 360.00', 'Frete: R$ 0', 'Final: R$ 360.00'].join('\n');
  return <section className="em100-stack"><CodePanel name="PedidoExtractAntes.java" code={BEFORE} /><div className="em100-terminal"><header><Terminal size={16} />Baseline executável<CopyButton value={'javac PedidoExtractAntes.java\njava PedidoExtractAntes'} /></header><pre><b>PS&gt;</b> javac PedidoExtractAntes.java{`\n`}<b>PS&gt;</b> java PedidoExtractAntes{`\n`}{output}</pre></div><article className="em100-rule"><TestTube2 /><div><strong>Guarde esta saída como contrato</strong><span>Preço 120.00 × 3 alcança 360.00; como o limite é 300.00, o frete permanece zero.</span></div></article></section>;
}
function IntelliJExtractLab() {
  const [stage, setStage] = useState(0);
  const stages = ['Selecionar bloco', 'Abrir refatoração', 'Nomear método', 'Confirmar preview'];
  return <section className="em100-stack"><div className="em100-ide"><header><span>PedidoExtractAntes.java · IntelliJ IDEA</span><span>Refactor · Extract Method</span></header><div className="em100-toolbar">{stages.map((item, index) => <button type="button" key={item} className={stage === index ? 'active' : ''} onClick={() => setStage(index)}><span>{index + 1}</span>{item}</button>)}</div><div className="em100-editor"><aside><span>10</span><span className={stage === 0 ? 'selected' : ''}>11</span><span className={stage === 0 ? 'selected' : ''}>12</span><span className={stage === 0 ? 'selected' : ''}>13</span><span className={stage === 0 ? 'selected' : ''}>14</span><span>15</span></aside><pre>{stage === 0 ? 'BigDecimal frete = BigDecimal.ZERO;\nif (totalBruto.compareTo(new BigDecimal("300.00")) < 0) {\n    frete = new BigDecimal("15.00");\n}' : 'BigDecimal frete = calcularFrete(totalBruto);'}</pre>{stage > 0 && <div className="em100-dialog"><header><WandSparkles size={16} />Extract Method</header><label>Method name<input value={stage < 2 ? 'extracted' : 'calcularFrete'} readOnly /></label><div><span>Parameter</span><code>BigDecimal totalBruto</code></div><div><span>Returns</span><code>BigDecimal frete</code></div><footer><button type="button" onClick={() => setStage(value => Math.max(0, value - 1))}>Cancel</button><button type="button" className="primary" onClick={() => setStage(value => Math.min(3, value + 1))}>{stage === 3 ? 'Done' : 'Refactor'}</button></footer></div>}</div><footer><Keyboard size={15} />Windows/Linux: Ctrl + Alt + M · macOS: Cmd + Option + M · menu: Refactor → Extract Method</footer></div><article className="em100-rule"><CheckCircle2 /><div><strong>Revise o preview antes de confirmar</strong><span>A IDE infere estrutura; você continua responsável por fronteira, nome, parâmetros, retorno e coesão.</span></div></article></section>;
}
function DataFlowLab() {
  const [mode, setMode] = useState('one');
  const data = mode === 'one'
    ? { inputs: ['totalBruto'], block: 'calcular frete', outputs: ['frete'], verdict: 'Extração direta: um parâmetro e um retorno.' }
    : { inputs: ['preco', 'quantidade'], block: 'calcular e contar', outputs: ['total', 'itensProcessados'], verdict: 'Dois valores saem do bloco: divida ou use um tipo de resultado.' };
  return <section className="em100-stack"><div className="em100-toggle"><button type="button" className={mode === 'one' ? 'active' : ''} onClick={() => setMode('one')}>Uma saída</button><button type="button" className={mode === 'two' ? 'active danger' : ''} onClick={() => setMode('two')}>Duas saídas</button></div><div className="em100-flow"><section><small>ENTRADAS LIDAS</small>{data.inputs.map(item => <code key={item}>{item}</code>)}</section><ArrowRight /><section className="center"><Scissors /><strong>{data.block}</strong></section><ArrowRight /><section><small>VALORES USADOS DEPOIS</small>{data.outputs.map(item => <code key={item}>{item}</code>)}</section></div><article className={mode === 'one' ? 'em100-rule' : 'em100-warning'}>{mode === 'one' ? <CheckCircle2 /> : <AlertTriangle />}<div><strong>{data.verdict}</strong><span>Java retorna um valor por chamada; um `record` pode agrupar resultados relacionados, mas não deve esconder uma seleção incoesa.</span></div></article></section>;
}
function AfterLab() {
  const [view, setView] = useState('after');
  return <section className="em100-stack"><div className="em100-toggle"><button type="button" className={view === 'before' ? 'active' : ''} onClick={() => setView('before')}>Antes · 1 main</button><button type="button" className={view === 'after' ? 'active' : ''} onClick={() => setView('after')}>Depois · 3 métodos</button></div><CodePanel name={view === 'before' ? 'PedidoExtractAntes.java' : 'PedidoExtractDepois.java'} code={view === 'before' ? BEFORE : AFTER} /><div className="em100-equivalence"><div><small>ANTES</small><strong>360.00</strong><span>frete 0</span></div><GitCompareArrows /><div><small>DEPOIS</small><strong>360.00</strong><span>frete 0</span></div></div><article className="em100-rule"><Code2 /><div><strong>O main agora conta a história</strong><span>Calcular bruto → calcular frete → somar final → imprimir resumo. Comentários de blocos deixam de carregar a intenção.</span></div></article></section>;
}
function QualityLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    ['calcularFrete(totalBruto)', 'boa', 'verbo + objeto, um parâmetro necessário e retorno explícito'],
    ['extracted(totalBruto)', 'ruim', 'a mecânica aparece, mas a intenção de negócio desaparece'],
    ['processar(preco, quantidade, total, frete)', 'ruim', 'nome genérico e fronteira com responsabilidades misturadas'],
    ['imprimirResumo(totalBruto, frete, totalFinal)', 'boa', 'saída isolada; void combina com efeito de exibição'],
  ];
  const current = cases[selected];
  return <section className="em100-stack"><div className="em100-quality">{cases.map((item, index) => <button type="button" key={item[0]} className={(selected === index ? 'active ' : '') + item[1]} onClick={() => setSelected(index)}><code>{item[0]}</code><span>{item[1]}</span></button>)}</div><article className={current[1] === 'boa' ? 'em100-rule' : 'em100-warning'}>{current[1] === 'boa' ? <CheckCircle2 /> : <AlertTriangle />}<div><strong>{current[0]}</strong><span>{current[2]}. Se a IDE sugerir um nome mecânico, use Rename com Shift + F6.</span></div></article></section>;
}
function OsChallengeLab() {
  const [version, setVersion] = useState('after');
  const [extraction, setExtraction] = useState(0);
  const extractions = [
    ['calcularPrecoOS', 'horasSuporte → BigDecimal total'],
    ['verificarSLA', 'horasAteAtendimento → boolean'],
    ['exibirFichaOS', 'dados prontos → saída void'],
  ];
  return <section className="em100-stack"><div className="em100-toggle"><button type="button" className={version === 'before' ? 'active' : ''} onClick={() => setVersion('before')}>OS não refatorada</button><button type="button" className={version === 'after' ? 'active' : ''} onClick={() => setVersion('after')}>OS com 3 extrações</button></div><div className="em100-extractions">{extractions.map((item, index) => <button type="button" key={item[0]} className={extraction === index ? 'active' : ''} onClick={() => setExtraction(index)}><span>{index + 1}</span><strong>{item[0]}</strong><small>{item[1]}</small></button>)}</div><CodePanel name={version === 'before' ? 'OsExtractAntes.java' : 'OsExtractDepois.java'} code={version === 'before' ? OS_BEFORE : OS_AFTER} /><div className="em100-terminal"><pre>--- ORDEM DE SERVICO ---{`\n`}Certificado: OS-100{`\n`}Horas: 4{`\n`}Total: R$ 320.00{`\n`}SLA: ATRASADA</pre></div><article className="em100-rule"><StepForward /><div><strong>Debug recomendado</strong><span>Pare na chamada de <code>{extractions[extraction][0]}</code> e use F7 para conferir parâmetros, retorno e volta ao chamador.</span></div></article></section>;
}
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors em100-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}
function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const checks = ['quatro fontes criadas', 'baseline do pedido registrada', 'Ctrl+Alt+M praticado', 'calcularFrete revisado', 'parâmetros conferidos', 'retorno conferido', 'saídas do pedido equivalentes', 'calcularPrecoOS extraído', 'verificarSLA extraído', 'exibirFichaOS extraído', 'saídas da OS equivalentes', 'F7 praticado', 'três respostas registradas', 'diff e .class revisados'];
  const commands = ['javac *.java', 'java PedidoExtractAntes', 'java PedidoExtractDepois', 'java OsExtractAntes', 'java OsExtractDepois', 'git diff'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  return <section className="em100-delivery"><div className="em100-terminal"><header><Terminal size={15} />Compilar, executar e comparar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}</pre></div><div className="em100-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: extraia sem mudar uma única linha de saída</h3></div><p>Comece por <code>OsExtractAntes.java</code>, registre o console e faça as três extrações pelo IntelliJ. Não copie a solução antes de tentar.</p><ul><li><code>calcularPrecoOS</code> recebe horas e retorna dinheiro.</li><li><code>verificarSLA</code> recebe horas até atendimento e retorna boolean.</li><li><code>exibirFichaOS</code> recebe dados prontos e apenas exibe.</li><li>Compare a saída e explique por que isso foi refatoração, não funcionalidade.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'contract', label: 'Contrato da Refatoração', duration: '9 min', eyebrow: 'COMPORTAMENTO ANTES DE ESTRUTURA', title: 'Refatore somente depois de criar uma prova de equivalência', blocks: [{ type: 'lead', text: 'Refatorar melhora a estrutura interna sem mudar o comportamento que a entrada e a saída tornam observável.' }, { type: 'contract' }] },
  { id: 'selection', label: 'Fronteira da Seleção', duration: '10 min', eyebrow: 'BLOCO COMPLETO E COESO', title: 'Selecione uma responsabilidade, não uma quantidade de linhas', blocks: [{ type: 'lead', text: 'A qualidade da assinatura gerada começa na fronteira escolhida antes de pressionar o atalho.' }, { type: 'selection' }] },
  { id: 'baseline', label: 'Rodar o Antes', duration: '12 min', eyebrow: 'CÓDIGO QUE COMPILA E SAÍDA CONHECIDA', title: 'Execute o main grande e congele a evidência de referência', blocks: [{ type: 'lead', text: 'O arquivo inicial funciona. Nosso objetivo não é corrigir uma regra, mas tornar a intenção legível sem mudar seu resultado.' }, { type: 'baseline' }] },
  { id: 'intellij', label: 'IntelliJ Passo a Passo', duration: '15 min', eyebrow: 'CTRL+ALT+M COM PREVIEW', title: 'Faça a IDE extrair calcularFrete sem perder o controle', blocks: [{ type: 'lead', text: 'A simulação localiza seleção, atalho, diálogo, nome, parâmetros e retorno como você encontrará no IntelliJ.' }, { type: 'intellij' }] },
  { id: 'flow', label: 'Parâmetros e Retorno', duration: '12 min', eyebrow: 'ENTRADAS LIDAS E VALORES USADOS DEPOIS', title: 'Leia o fluxo de dados que a IDE transforma em assinatura', blocks: [{ type: 'lead', text: 'Variáveis externas lidas pelo bloco viram parâmetros; um valor produzido e usado depois tende a virar retorno.' }, { type: 'flow' }] },
  { id: 'after', label: 'Extrair e Comparar', duration: '14 min', eyebrow: 'TRÊS MÉTODOS, MESMA SAÍDA', title: 'Confronte o código completo antes e depois da extração', blocks: [{ type: 'lead', text: 'A versão final substitui comentários por nomes e deixa o main como orquestrador, mantendo bruto, frete e total final.' }, { type: 'after' }] },
  { id: 'quality', label: 'Auditar a Assinatura', duration: '9 min', eyebrow: 'NOME, COESÃO E QUANTIDADE DE DADOS', title: 'Não aceite automaticamente tudo que a ferramenta gerar', blocks: [{ type: 'lead', text: 'Automação evita erros mecânicos; julgamento profissional ainda decide se o método expressa uma responsabilidade.' }, { type: 'quality' }] },
  { id: 'os', label: 'Oficina de Ordem de Serviço', duration: '18 min', eyebrow: 'TRÊS EXTRAÇÕES EM UM NOVO DOMÍNIO', title: 'Refatore preço, SLA e ficha sem copiar o roteiro do pedido', blocks: [{ type: 'lead', text: 'A ordem de serviço exige transferir o método: uma entrada diferente, três responsabilidades e a mesma prova antes/depois.' }, { type: 'os' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'SELEÇÃO, NOME, FLUXO E EVIDÊNCIA', title: 'Diagnostique oito maneiras de produzir uma extração enganosa', blocks: [{ type: 'lead', text: 'Cada sintoma aponta para uma decisão recuperável antes que a refatoração vire uma mudança funcional disfarçada.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '12 min', eyebrow: 'PROVA, DEBUG, REGISTRO E GIT', title: 'Entregue quatro fontes e duas equivalências explicáveis', blocks: [{ type: 'lead', text: 'A conclusão exige código executável, saídas comparadas, uso consciente do IntelliJ e evidências que outra pessoa consegue revisar.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'contract') return <ContractLab />;
  if (block.type === 'selection') return <SelectionLab />;
  if (block.type === 'baseline') return <BaselineLab />;
  if (block.type === 'intellij') return <IntelliJExtractLab />;
  if (block.type === 'flow') return <DataFlowLab />;
  if (block.type === 'after') return <AfterLab />;
  if (block.type === 'quality') return <QualityLab />;
  if (block.type === 'os') return <OsChallengeLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedExtractMethodLesson100({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-extract-method-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Scissors size={17} />Oficina de refatoração segura no IntelliJ</span><p className="guided-sequence">100 · M3.11</p><h1>Extraia métodos sem alterar o comportamento</h1><p>Crie uma baseline, selecione blocos coesos, use Ctrl+Alt+M, audite a assinatura e prove a mesma saída em dois domínios.</p></div><div className="guided-hero-status"><WandSparkles size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 100" items={[{ value: '4 fontes', label: 'Compiladas e comparadas' }, { value: '2 provas', label: 'Pedido e ordem de serviço' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 100"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Duas refatorações provadas e revisáveis</h3><p>{lessonComplete ? 'Aula concluída e pronta para a mini arquitetura procedural.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 099</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Extract Method com equivalência</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 101<ArrowRight size={17} /></button></footer></article>;
}
