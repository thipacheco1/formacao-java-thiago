import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Banknote, Check, CheckCircle2,
  Clock3, Copy, FileCode2, Lightbulb, ListChecks, Play,
  RotateCcw, Scale, Sparkles, Terminal, Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedBigDecimalLesson.css';

const STORAGE_KEY = 'guided-bigdecimal-lesson-072-progress';

const MAIN_PROGRAM = `import java.math.BigDecimal;
import java.math.RoundingMode;

public class LaboratorioBigDecimal {
    public static void main(String[] args) {
        System.out.println("double: " + (0.1 + 0.2));
        System.out.println("construtor double: " + new BigDecimal(0.1));
        System.out.println("construtor String: " + new BigDecimal("0.1"));
        System.out.println("valueOf: " + BigDecimal.valueOf(0.1));

        BigDecimal valor = new BigDecimal("10.00");
        valor.add(new BigDecimal("5.00"));
        System.out.println("sem capturar: " + valor);
        valor = valor.add(new BigDecimal("5.00"));
        System.out.println("capturando: " + valor);

        System.out.println("soma: " + new BigDecimal("10.50").add(new BigDecimal("5.25")));
        System.out.println("subtracao: " + new BigDecimal("100.00").subtract(new BigDecimal("15.50")));
        System.out.println("multiplicacao: " + new BigDecimal("19.90").multiply(BigDecimal.valueOf(3)));
        System.out.println("divisao: " + new BigDecimal("10.00").divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP));
        System.out.println("scale: " + new BigDecimal("10.00").scale());
        System.out.println("setScale: " + new BigDecimal("10.567").setScale(2, RoundingMode.HALF_UP));

        BigDecimal um = new BigDecimal("1.0");
        BigDecimal outroUm = new BigDecimal("1.00");
        System.out.println("equals: " + um.equals(outroUm));
        System.out.println("compareTo: " + um.compareTo(outroUm));

        BigDecimal totalPedido = dinheiro("100.00").subtract(dinheiro("15.50")).add(dinheiro("9.90"));
        System.out.println("pedido: " + totalPedido);

        BigDecimal[] parcelas = ratear(dinheiro("100.00"), 3);
        System.out.println("rateio: " + parcelas[0] + " | " + parcelas[1] + " | " + parcelas[2]);

        BigDecimal comissao = dinheiro("1000.00")
                .multiply(new BigDecimal("7.5").divide(new BigDecimal("100"), 6, RoundingMode.HALF_UP))
                .setScale(2, RoundingMode.HALF_UP);
        System.out.println("comissao: " + comissao);
        System.out.println("mensageria: " + dinheiro("0.35").multiply(BigDecimal.valueOf(12)));
        System.out.println("auditoria: " + dinheiro("99.995"));
    }

    static BigDecimal dinheiro(String texto) {
        if (texto == null || texto.isBlank()) throw new IllegalArgumentException("Valor monetario e obrigatorio");
        try {
            return new BigDecimal(texto.trim()).setScale(2, RoundingMode.HALF_UP);
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException("Valor monetario invalido");
        }
    }

    static BigDecimal[] ratear(BigDecimal valor, int quantidade) {
        if (valor == null) throw new IllegalArgumentException("Valor e obrigatorio");
        if (quantidade <= 0) throw new IllegalArgumentException("Quantidade deve ser positiva");
        long centavos = valor.movePointRight(2).setScale(0, RoundingMode.HALF_UP).longValueExact();
        long base = centavos / quantidade;
        long resto = centavos % quantidade;
        BigDecimal[] parcelas = new BigDecimal[quantidade];
        for (int i = 0; i < quantidade; i++) {
            parcelas[i] = BigDecimal.valueOf(base + (i < resto ? 1 : 0), 2);
        }
        return parcelas;
    }
}`;

const EXPECTED_OUTPUT = `double: 0.30000000000000004
construtor double: 0.1000000000000000055511151231257827021181583404541015625
construtor String: 0.1
valueOf: 0.1
sem capturar: 10.00
capturando: 15.00
soma: 15.75
subtracao: 84.50
multiplicacao: 59.70
divisao: 3.33
scale: 2
setScale: 10.57
equals: false
compareTo: 0
pedido: 94.40
rateio: 33.34 | 33.33 | 33.33
comissao: 75.00
mensageria: 4.20
auditoria: 100.00`;

const EVIDENCE = `# Aula 072 — BigDecimal desde a base

- [ ] Provei a aproximação de 0.1 + 0.2 com double
- [ ] Diferenciei String, valueOf e construtor com double
- [ ] Capturei o retorno de operações imutáveis
- [ ] Usei add, subtract, multiply e divide
- [ ] Provoquei divisão decimal não terminante
- [ ] Defini scale e RoundingMode explicitamente
- [ ] Comparei HALF_UP, HALF_EVEN, DOWN, UP, CEILING e FLOOR
- [ ] Diferenciei equals de compareTo
- [ ] Usei ZERO, ONE e TEN
- [ ] Centralizei parsing, escala e validação monetária
- [ ] Rateei centavos sem perder o total
- [ ] Compilei, depurei, documentei e revisei o diff`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="bd72-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java' }) {
  return <section className="guided-file bd72-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

const CONSTRUCTORS = [
  ['double perigoso', 'new BigDecimal(0.1)', '0.1000000000000000055511151231257827…', 'A aproximação binária já entrou no construtor.'],
  ['String segura', 'new BigDecimal("0.1")', '0.1', 'O texto decimal confiável preserva os dígitos declarados.'],
  ['valueOf', 'BigDecimal.valueOf(0.1)', '0.1', 'Converte o double inevitável por sua representação textual canônica.'],
  ['centavos + scale', 'BigDecimal.valueOf(1050, 2)', '10.50', 'Um long 1050 com escala 2 representa dez reais e cinquenta.'],
];

function PrecisionLab() {
  const [selected, setSelected] = useState(1);
  const item = CONSTRUCTORS[selected];
  return <section className="bd72-stack"><div className="bd72-precision"><article><small>DOUBLE</small><code>0.1 + 0.2</code><strong>0.30000000000000004</strong><span>aproximação binária</span></article><ArrowRight /><article className="safe"><small>BIGDECIMAL DE TEXTO</small><code>"0.10" + "0.20"</code><strong>0.30</strong><span>decimal previsível</span></article></div><div className="bd72-constructor-tabs">{CONSTRUCTORS.map((constructor, index) => <button type="button" key={constructor[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{constructor[0]}</button>)}</div><div className={selected === 0 ? 'bd72-constructor danger' : 'bd72-constructor safe'}><code>{item[1]}</code><strong>{item[2]}</strong><p>{item[3]}</p></div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Precisão técnica não escolhe o domínio</strong><p><code>double</code> continua adequado para muitas medições e cálculos científicos. Para dinheiro e decimais de negócio, queremos regras decimais explícitas — ou centavos em <code>long</code> quando o modelo permitir.</p></div></aside></section>;
}

const OPERATIONS = [
  ['add', '10.50', '5.25', '15.75'], ['subtract', '100.00', '15.50', '84.50'],
  ['multiply', '19.90', '3', '59.70'], ['divide exato', '10.00', '2', '5.00'],
];

function ImmutabilityLab() {
  const [captured, setCaptured] = useState(false);
  const [operation, setOperation] = useState(0);
  const item = OPERATIONS[operation];
  return <section className="bd72-stack"><div className="bd72-immutable"><article><small>OBJETO ORIGINAL</small><strong>valor → 10.00</strong></article><ArrowRight /><article><code>valor.add(5.00)</code><span>cria novo BigDecimal 15.00</span></article><ArrowRight /><article className={captured ? 'safe' : 'danger'}><small>{captured ? 'RETORNO CAPTURADO' : 'RETORNO IGNORADO'}</small><strong>valor → {captured ? '15.00' : '10.00'}</strong></article></div><button type="button" className="bd72-capture" onClick={() => setCaptured(value => !value)}>{captured ? 'Simular retorno ignorado' : 'Capturar: valor = valor.add(...)'}</button><div className="bd72-operation-tabs">{OPERATIONS.map((entry, index) => <button type="button" key={entry[0]} className={operation === index ? 'active' : ''} onClick={() => setOperation(index)}>{entry[0]}</button>)}</div><div className="bd72-operation"><code>new BigDecimal("{item[1]}").{item[0].split(' ')[0]}(new BigDecimal("{item[2]}"))</code><strong>{item[3]}</strong></div><CodePanel name="BigDecimalImutavel.java · regra de atribuição" code={`BigDecimal valor = new BigDecimal("10.00");\nvalor.add(new BigDecimal("5.00"));\nSystem.out.println(valor);             // 10.00\n\nvalor = valor.add(new BigDecimal("5.00"));\nSystem.out.println(valor);             // 15.00`} /></section>;
}

const ROUNDING = [
  ['HALF_UP', '10.56', 'meio ou mais sobe'], ['HALF_EVEN', '10.56', 'empate vai ao último dígito par'],
  ['DOWN', '10.55', 'descarta casas em direção a zero'], ['UP', '10.56', 'afasta de zero se houver descarte'],
  ['CEILING', '10.56', 'vai ao infinito positivo'], ['FLOOR', '10.55', 'vai ao infinito negativo'],
];

function DivisionLab() {
  const [parts, setParts] = useState(3);
  const [rounding, setRounding] = useState(0);
  const exact = 10 % parts === 0;
  const item = ROUNDING[rounding];
  return <section className="bd72-stack"><div className="bd72-division-control"><label htmlFor="bd72-parts">Dividir 10.00 por <strong>{parts}</strong></label><input id="bd72-parts" type="range" min="2" max="10" value={parts} onChange={event => setParts(Number(event.target.value))} /><article className={exact ? 'safe' : 'danger'}><strong>{exact ? (10 / parts).toFixed(2) : 'ArithmeticException'}</strong><span>{exact ? 'divisão terminante' : 'divide sem regra não sabe onde cortar'}</span></article></div><div className="bd72-divide-flow"><code>total.divide(parcelas)</code><ArrowRight /><strong>{exact ? 'resultado exato' : 'Non-terminating decimal expansion'}</strong><ArrowRight /><code>divide(parcelas, 2, {item[0]})</code></div><div className="bd72-rounding-tabs">{ROUNDING.map((mode, index) => <button type="button" key={mode[0]} className={rounding === index ? 'active' : ''} onClick={() => setRounding(index)}><strong>{mode[0]}</strong><span>{mode[1]}</span></button>)}</div><p className="bd72-rounding-rule"><Scale size={18} /><strong>{item[0]}:</strong> {item[2]}. A regra precisa vir do contrato, contabilidade ou legislação — nunca do chute.</p><CodePanel name="Divisão com contrato explícito" code={`BigDecimal total = new BigDecimal("10.00");\nBigDecimal parcelas = BigDecimal.valueOf(3);\nBigDecimal valorParcela = total.divide(parcelas, 2, RoundingMode.HALF_UP);\nSystem.out.println(valorParcela); // 3.33`} /></section>;
}

const SCALE_VALUES = ['10', '10.0', '10.00', '10.500'];
function ScaleComparisonLab() {
  const [first, setFirst] = useState(1);
  const [second, setSecond] = useState(2);
  const numericEqual = Number(SCALE_VALUES[first]) === Number(SCALE_VALUES[second]);
  const equals = numericEqual && first === second;
  return <section className="bd72-stack"><div className="bd72-scale-grid">{SCALE_VALUES.map((value, index) => <button type="button" key={value} className={first === index ? 'first' : second === index ? 'second' : ''} onClick={() => first === index ? setSecond(index) : setFirst(index)}><strong>{value}</strong><span>scale {value.includes('.') ? value.split('.')[1].length : 0}</span></button>)}</div><div className="bd72-compare"><article className={equals ? 'safe' : 'danger'}><small>EQUALS · VALOR + SCALE</small><code>{SCALE_VALUES[first]}.equals({SCALE_VALUES[second]})</code><strong>{String(equals)}</strong></article><article className={numericEqual ? 'safe' : 'danger'}><small>COMPARETO · VALOR NUMÉRICO</small><code>{SCALE_VALUES[first]}.compareTo({SCALE_VALUES[second]})</code><strong>{numericEqual ? '0' : Number(SCALE_VALUES[first]) < Number(SCALE_VALUES[second]) ? '-1' : '1'}</strong></article></div><div className="bd72-constants"><code>BigDecimal.ZERO</code><code>BigDecimal.ONE</code><code>BigDecimal.TEN</code></div><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>BigDecimal é objeto</strong><p>Use <code>compareTo(BigDecimal.ZERO) &gt; 0</code> para valor positivo. Operadores como <code>&gt;</code> não comparam objetos; <code>equals</code> é correto somente quando a escala também faz parte do contrato.</p></div></aside></section>;
}

function previewMoney(text) {
  const match = text.match(/^([+-]?)(\d+)(?:\.(\d+))?$/);
  if (!match) return { valid: false, value: 'valor inválido', positive: false };
  const negative = match[1] === '-';
  const fraction = (match[3] || '').padEnd(3, '0');
  let cents = BigInt(match[2]) * 100n + BigInt(fraction.slice(0, 2));
  if (Number(fraction[2]) >= 5) cents += 1n;
  const units = cents / 100n;
  const decimal = String(cents % 100n).padStart(2, '0');
  return { valid: true, value: `${negative ? '-' : ''}${units}.${decimal}`, positive: !negative && cents > 0n };
}

function MoneyBoundaryLab() {
  const [input, setInput] = useState('199.905');
  const normalized = input.trim();
  const preview = previewMoney(normalized);
  return <section className="bd72-stack"><div className="bd72-money-flow"><label htmlFor="bd72-money"><small>STRING EXTERNA</small><input id="bd72-money" value={input} onChange={event => setInput(event.target.value)} /></label><ArrowRight /><article><small>NORMALIZAR</small><strong>"{normalized}"</strong></article><ArrowRight /><article className={preview.valid ? 'safe' : 'danger'}><small>CRIAR + SCALE 2</small><strong>{preview.value}</strong></article><ArrowRight /><article className={preview.positive ? 'safe' : 'danger'}><small>DOMÍNIO</small><strong>{preview.positive ? 'positivo' : 'rejeitado'}</strong></article></div><CodePanel name="DinheiroUtil.java" code={`static BigDecimal dinheiro(String texto) {\n    if (texto == null || texto.isBlank()) {\n        throw new IllegalArgumentException("Valor monetário é obrigatório.");\n    }\n    try {\n        return new BigDecimal(texto.trim()).setScale(2, RoundingMode.HALF_UP);\n    } catch (NumberFormatException erro) {\n        throw new IllegalArgumentException("Valor monetário inválido.");\n    }\n}\n\nstatic void validarPositivo(BigDecimal valor, String campo) {\n    if (valor == null) throw new IllegalArgumentException(campo + " é obrigatório.");\n    if (valor.compareTo(BigDecimal.ZERO) <= 0) {\n        throw new IllegalArgumentException(campo + " deve ser maior que zero.");\n    }\n}`} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Formato local vem depois</strong><p>Nesta base, o texto decimal usa ponto. Vírgula, símbolo de moeda e Locale pertencem à próxima aula. Não troque vírgula por ponto sem compreender o formato recebido.</p></div></aside></section>;
}

function AllocationLab() {
  const [cents, setCents] = useState(10000);
  const [parts, setParts] = useState(3);
  const base = Math.floor(cents / parts);
  const remainder = cents % parts;
  const shares = Array.from({ length: parts }, (_, index) => base + (index < remainder ? 1 : 0));
  return <section className="bd72-stack"><div className="bd72-allocation-controls"><label>Valor em centavos<input type="number" min="0" value={cents} onChange={event => setCents(Math.max(0, Number(event.target.value)))} /></label><label>Parcelas<input type="number" min="1" max="12" value={parts} onChange={event => setParts(Math.max(1, Math.min(12, Number(event.target.value))))} /></label><article><small>BASE + RESTO</small><strong>{base} + {remainder}</strong><span>centavos</span></article></div><div className="bd72-shares">{shares.map((share, index) => <article key={index} className={index < remainder ? 'extra' : ''}><small>PARCELA {index + 1}</small><strong>{(share / 100).toFixed(2)}</strong><span>{index < remainder ? '+ 1 centavo do resto' : 'valor base'}</span></article>)}</div><p className="bd72-allocation-proof"><CheckCircle2 size={18} />Soma das parcelas: <strong>{(shares.reduce((sum, value) => sum + value, 0) / 100).toFixed(2)}</strong>. Arredondar cada parcela para 33.33 daria 99.99; distribuir o resto preserva o total.</p><CodePanel name="RateioCentavos.java · núcleo" code={`long centavos = valor.movePointRight(2)\n        .setScale(0, RoundingMode.HALF_UP)\n        .longValueExact();\nlong base = centavos / quantidade;\nlong resto = centavos % quantidade;\nfor (int i = 0; i < quantidade; i++) {\n    long centavosParcela = base + (i < resto ? 1 : 0);\n    parcelas[i] = BigDecimal.valueOf(centavosParcela, 2);\n}`} /></section>;
}

const DOMAINS = [
  ['Produto', '199.905 → 199.91', 'texto validado, preço positivo e scale 2'],
  ['Pedido', '100.00 − 15.50 + 9.90 = 94.40', 'subtotal, desconto e frete encadeados'],
  ['Pagamento', '100.00 / 3 → 33.33', 'parcela isolada não fecha o total; rateio define sobra'],
  ['Comissão', '1000.00 × 7.5% = 75.00', 'taxa dividida por 100 com scale intermediária'],
  ['Ordem de serviço', '120.00 + 35.50 = 155.50', 'custo técnico e peça somados'],
  ['Mensageria', '0.35 × 12 = 4.20', 'custo unitário vezes quantidade inteira'],
  ['Auditoria', '99.995 → 100.00', 'valor registrado com arredondamento explícito'],
];
function DomainLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return <section className="bd72-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>REGRA MONETÁRIA</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><Banknote size={24} /><span><strong>Pergunte antes do cálculo:</strong> origem do decimal, scale contratada, modo de arredondamento, comparação desejada e destino de qualquer centavo restante.</span></div></article></section>;
}

const ERRORS = [
  ['BigDecimal de double', 'A aproximação binária vira uma cauda decimal extensa.', 'Crie por String; use valueOf quando o double for inevitável.'],
  ['Retorno ignorado', 'add parece executar, mas o valor original continua igual.', 'Capture o novo BigDecimal retornado.'],
  ['Divide sem regra', '10/3 lança ArithmeticException.', 'Defina scale e RoundingMode conforme o contrato.'],
  ['equals para valor', '1.0 e 1.00 resultam false por causa da escala.', 'Use compareTo quando a pergunta é numérica.'],
  ['Dinheiro sem scale', 'Valores equivalentes circulam com casas diferentes.', 'Normalize a escala no limite definido pelo domínio.'],
  ['RoundingMode no chute', 'Centavos mudam sem justificativa contábil.', 'Obtenha a regra do negócio, contrato ou legislação.'],
  ['double corrigido tarde', 'O erro entrou antes do BigDecimal.', 'Preserve texto decimal ou centavos desde a fronteira.'],
  ['BigDecimal null', 'Método de objeto quebra antes de explicar o campo.', 'Valide presença antes de operar.'],
  ['Conversão para double', 'Precisão controlada é descartada sem necessidade.', 'Mantenha BigDecimal durante o cálculo de negócio.'],
  ['Parcelas não fecham', '3 × 33.33 soma 99.99.', 'Converta em centavos e distribua o resto por regra.'],
];
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="bd72-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>;
}

const CHECKS = ['double expôs aproximação','String e valueOf produziram 0.1','imutabilidade exigiu capturar retorno','quatro operações foram provadas','divide usou scale e HALF_UP','setScale produziu 10.57','equals e compareTo divergiram','pedido fechou em 94.40','rateio preservou 100.00','comissão e custos mantiveram scale'];
function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = 'mkdir labs\\m2\\aula-072-bigdecimal\ncd labs\\m2\\aula-072-bigdecimal\njavac LaboratorioBigDecimal.java\njava LaboratorioBigDecimal';
  return <section className="bd72-delivery"><CodePanel name="LaboratorioBigDecimal.java" code={MAIN_PROGRAM} /><div className="bd72-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="bd72-debug"><header><Play size={18} /><strong>Debug: valor, scale e objeto retornado</strong></header><div><article><span>1</span><strong>Construtores</strong><p>Compare a representação interna de double, String e valueOf.</p></article><article><span>2</span><strong>Após add</strong><p>Veja original 10.00 e novo objeto 15.00 antes da atribuição.</p></article><article><span>3</span><strong>Dentro do divide</strong><p>Confirme total, divisor, scale 2 e HALF_UP.</p></article><article><span>4</span><strong>Comparação</strong><p>Avalie equals, compareTo e scale de 1.0/1.00.</p></article></div></section><div className="bd72-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: fechamento financeiro sem centavo perdido</h3></div><p>Modele um pedido com três produtos, desconto, frete, comissão e três parcelas. Todos os textos passam por um método monetário único; cada arredondamento deve ter uma justificativa escrita.</p><ul><li>Prove que subtotal − desconto + frete fecha o total.</li><li>Rateie as parcelas preservando exatamente a soma.</li><li>Compare limites com compareTo, não equals.</li><li>Provoque construtor double, retorno ignorado e divide sem regra separadamente.</li></ul></section><section className="guided-file bd72-evidence"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'precision') return <PrecisionLab />;
  if (block.type === 'immutable') return <ImmutabilityLab />;
  if (block.type === 'division') return <DivisionLab />;
  if (block.type === 'scale') return <ScaleComparisonLab />;
  if (block.type === 'boundary') return <MoneyBoundaryLab />;
  if (block.type === 'allocation') return <AllocationLab />;
  if (block.type === 'domains') return <DomainLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'precision', label: 'Precisão e Construção', duration: '13 min', eyebrow: 'DOUBLE VERSUS DECIMAL', title: 'Proteja os dígitos desde a origem', blocks: [{ type: 'lead', text: 'BigDecimal é um objeto imutável de java.math para decimais com precisão controlada. Ele não repara automaticamente uma aproximação que já entrou por double.' }, { type: 'precision' }] },
  { id: 'immutable', label: 'Operações Imutáveis', duration: '12 min', eyebrow: 'NOVO OBJETO A CADA CÁLCULO', title: 'Capture o retorno antes de confiar no valor', blocks: [{ type: 'lead', text: 'add, subtract, multiply e divide não alteram o receptor. A expressão produz outro BigDecimal e o programa precisa guardar esse retorno.' }, { type: 'immutable' }] },
  { id: 'division', label: 'Divisão e RoundingMode', duration: '13 min', eyebrow: 'DECIMAL NÃO TERMINANTE', title: 'Diga ao Java onde e como cortar', blocks: [{ type: 'lead', text: '10/2 termina; 10/3 não. Quando a expansão é infinita, BigDecimal exige uma escala e uma regra de arredondamento explícitas.' }, { type: 'division' }] },
  { id: 'scale', label: 'Scale e Comparação', duration: '12 min', eyebrow: 'VALOR NUMÉRICO OU REPRESENTAÇÃO', title: 'Escolha entre compareTo e equals pela pergunta', blocks: [{ type: 'lead', text: 'Scale conta casas decimais. Por isso 1.0 e 1.00 têm o mesmo valor numérico, mas não são iguais para equals.' }, { type: 'scale' }] },
  { id: 'boundary', label: 'Fronteira Monetária', duration: '12 min', eyebrow: 'PARSE, SCALE E VALIDAÇÃO', title: 'Centralize o contrato antes de espalhar dinheiro', blocks: [{ type: 'lead', text: 'Texto obrigatório, formato decimal, scale 2, RoundingMode e positividade são decisões distintas que uma fronteira monetária pode padronizar.' }, { type: 'boundary' }] },
  { id: 'allocation', label: 'Rateio de Centavos', duration: '13 min', eyebrow: 'SOMA PRECISA FECHAR', title: 'Distribua o resto em vez de perder um centavo', blocks: [{ type: 'lead', text: 'Arredondar 100/3 para 33.33 gera 99.99. Em centavos inteiros, o quociente dá a base e o resto identifica quantas parcelas recebem um centavo extra.' }, { type: 'allocation' }] },
  { id: 'domains', label: 'Dinheiro no Backend', duration: '12 min', eyebrow: 'SETE DOMÍNIOS', title: 'Torne escala, arredondamento e sobra decisões visíveis', blocks: [{ type: 'lead', text: 'Produto, pedido, pagamento, comissão, OS, mensageria e auditoria usam BigDecimal com regras diferentes e verificáveis.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Corrija a origem, não apenas o último decimal', blocks: [{ type: 'lead', text: 'Construtor, imutabilidade, divisão, scale, comparação, null e rateio produzem sintomas diferentes. Cada um exige sua própria correção.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '25 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Feche valores, escalas e parcelas com evidência executável', blocks: [{ type: 'lead', text: 'Compile o laboratório, confira dezenove linhas, investigue objetos e scales no debug e entregue um fechamento financeiro cuja soma possa ser provada.' }, { type: 'delivery' }] },
];

export default function GuidedBigDecimalLesson072({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
    const activeButton = navRef.current?.querySelector('button.active');
    if (activeButton && window.matchMedia('(max-width: 900px)').matches) activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);
  const step = steps[activeIndex];
  const stepDone = completedSteps.has(step.id);
  const allStepsDone = completedSteps.size === steps.length;
  const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleStep = () => {
    if (stepDone && isCompleted) onToggleCompleted();
    setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; });
  };
  return <article className="guided-git-lesson guided-bigdecimal-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Banknote size={17} />Laboratório de precisão monetária</span><p className="guided-sequence">072 · M2.11</p><h1>BigDecimal desde a base</h1><p>Preserve dígitos, capture operações imutáveis, defina escala e arredondamento e faça cada parcela fechar o mesmo total.</p></div><div className="guided-hero-status"><Banknote size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 072" items={[{ value: '4 origens', label: 'De BigDecimal comparadas' }, { value: '7 domínios', label: 'Com regras monetárias' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 072"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Precisão com regra de negócio</h3><p>{lessonComplete ? 'Aula concluída e pronta para Locale e NumberFormat.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 071</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>precisão, scale, compareTo e rateio</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 073<ArrowRight size={17} /></button></footer></article>;
}
