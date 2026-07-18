import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy,
  FileCode2, Globe2, Languages, Lightbulb, ListChecks, Play, RotateCcw,
  Sparkles, Terminal, Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';

const STORAGE_KEY = 'guided-locale-numberformat-lesson-073-progress';

const MAIN_PROGRAM = `import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;

public class LaboratorioFormatacao {
    static final Locale BRASIL = Locale.forLanguageTag("pt-BR");

    public static void main(String[] args) throws ParseException {
        BigDecimal valor = new BigDecimal("1234.56");
        System.out.println("moeda BR: " + limpar(NumberFormat.getCurrencyInstance(BRASIL).format(valor)));
        System.out.println("moeda US: " + NumberFormat.getCurrencyInstance(Locale.US).format(valor));
        System.out.println("numero BR: " + NumberFormat.getNumberInstance(BRASIL).format(new BigDecimal("1234567.89")));
        System.out.println("numero US: " + NumberFormat.getNumberInstance(Locale.US).format(new BigDecimal("1234567.89")));

        NumberFormat percentual = NumberFormat.getPercentInstance(BRASIL);
        percentual.setMinimumFractionDigits(2);
        percentual.setMaximumFractionDigits(2);
        System.out.println("percentual: " + limpar(percentual.format(new BigDecimal("0.075"))));

        NumberFormat numero = NumberFormat.getNumberInstance(BRASIL);
        numero.setMinimumFractionDigits(2);
        numero.setMaximumFractionDigits(4);
        System.out.println("casas: " + numero.format(10) + " | " + numero.format(10.5) + " | " + numero.format(10.56789));
        String exibido = NumberFormat.getNumberInstance(BRASIL).format(new BigDecimal("10.567"));
        System.out.println("exibido: " + exibido);
        System.out.println("original: " + new BigDecimal("10.567"));

        Number parsed = NumberFormat.getNumberInstance(BRASIL).parse("1.234,56");
        System.out.println("parse Number: " + parsed);
        System.out.println("parse BigDecimal: " + converterBrasil("1.234,56"));
        System.out.println("produto: Cadeira custa " + formatarMoeda(new BigDecimal("199.90")));

        BigDecimal total = new BigDecimal("100.00").subtract(new BigDecimal("15.50")).add(new BigDecimal("9.90"));
        System.out.println("pedido: " + formatarMoeda(total));
        System.out.println("pagamento: 3x de " + formatarMoeda(new BigDecimal("33.33")));
        System.out.println("OS: " + formatarMoeda(new BigDecimal("155.50")));
        System.out.println("mensageria: " + formatarMoeda(new BigDecimal("0.35").multiply(BigDecimal.valueOf(12))));
        System.out.println("auditoria exibida: " + formatarMoeda(new BigDecimal("99.995")));
        System.out.println("auditoria original: " + new BigDecimal("99.995"));
    }

    static String formatarMoeda(BigDecimal valor) {
        if (valor == null) return "R$ 0,00";
        return limpar(NumberFormat.getCurrencyInstance(BRASIL).format(valor));
    }

    static BigDecimal converterBrasil(String texto) {
        if (texto == null || texto.isBlank()) throw new IllegalArgumentException("Valor e obrigatorio");
        String limpo = texto.trim();
        if (!limpo.matches("[+-]?(?:\\d{1,3}(?:\\.\\d{3})*|\\d+),\\d+")) {
            throw new IllegalArgumentException("Formato brasileiro invalido");
        }
        return new BigDecimal(limpo.replace(".", "").replace(",", "."))
                .setScale(2, RoundingMode.HALF_UP);
    }

    static String limpar(String texto) {
        return texto.replace('\u00A0', ' ').replace('\u202F', ' ');
    }
}`;

const EXPECTED_OUTPUT = `moeda BR: R$ 1.234,56
moeda US: $1,234.56
numero BR: 1.234.567,89
numero US: 1,234,567.89
percentual: 7,50%
casas: 10,00 | 10,50 | 10,5679
exibido: 10,567
original: 10.567
parse Number: 1234.56
parse BigDecimal: 1234.56
produto: Cadeira custa R$ 199,90
pedido: R$ 94,40
pagamento: 3x de R$ 33,33
OS: R$ 155,50
mensageria: R$ 4,20
auditoria exibida: R$ 100,00
auditoria original: 99.995`;

const EVIDENCE = `# Aula 073 — Locale, NumberFormat e formatação

- [ ] Separei valor de cálculo de texto de apresentação
- [ ] Comparei pt-BR, en-US e fr-FR
- [ ] Formatei moeda, número e percentual
- [ ] Configurei mínimo e máximo de casas
- [ ] Provei que format não altera BigDecimal
- [ ] Evitei depender do Locale padrão
- [ ] Fiz parse brasileiro e tratei ParseException
- [ ] Validei entrada controlada antes de substituir separadores
- [ ] Mantive NumberFormat local ao método
- [ ] Separei formatador, conversor e validador
- [ ] Testei seis aplicações de backend
- [ ] Compilei, depurei, documentei e revisei o diff`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}
function CodePanel({ name, code, language = 'java' }) {
  return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

const LOCALES = [
  ['pt-BR', 'Brasil', 'R$ 1.234,56', '1.234.567,89', '7,50%'],
  ['en-US', 'Estados Unidos', '$1,234.56', '1,234,567.89', '7.50%'],
  ['fr-FR', 'França', '1 234,56 €', '1 234 567,89', '7,50 %'],
];
function LocaleLab() {
  const [selected, setSelected] = useState(0);
  const item = LOCALES[selected];
  return <section className="ln73-stack"><div className="ln73-locale-tabs">{LOCALES.map((locale, index) => <button type="button" key={locale[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{locale[0]}</strong><span>{locale[1]}</span></button>)}</div><div className="ln73-showroom"><article><small>VALOR DE CÁLCULO</small><code>new BigDecimal("1234.56")</code><strong>1234.56</strong></article><ArrowRight /><article className="active"><small>LOCALE {item[0]}</small><strong>{item[2]}</strong><span>mesmo valor, convenção regional</span></article></div><div className="ln73-locale-facts"><article><small>MOEDA</small><strong>{item[2]}</strong></article><article><small>NÚMERO</small><strong>{item[3]}</strong></article><article><small>PERCENTUAL</small><strong>{item[4]}</strong></article></div><aside className="guided-note info"><Globe2 size={20} /><div><strong>Locale não é tradução do valor</strong><p>Ele descreve idioma e região, separadores, agrupamento e símbolo. O BigDecimal continua igual; somente a borda de apresentação muda.</p></div></aside></section>;
}

const FORMAT_KINDS = [
  ['Moeda', 'getCurrencyInstance', 'R$ 1.234,56'], ['Número', 'getNumberInstance', '1.234,56'], ['Percentual', 'getPercentInstance', '7,50%'],
];
function DigitsLab() {
  const [kind, setKind] = useState(0);
  const [minimum, setMinimum] = useState(2);
  const [maximum, setMaximum] = useState(4);
  const examples = ['10', '10,5', '10,56789'];
  const render = value => {
    const [integer, fraction = ''] = value.split(',');
    const padded = fraction.padEnd(minimum, '0').slice(0, maximum);
    return padded ? `${integer},${padded}` : integer;
  };
  return <section className="ln73-stack"><div className="ln73-kind-tabs">{FORMAT_KINDS.map((entry, index) => <button type="button" key={entry[0]} className={kind === index ? 'active' : ''} onClick={() => setKind(index)}><strong>{entry[0]}</strong><code>{entry[1]}</code></button>)}</div><div className="ln73-digit-controls"><label>Mínimo: <strong>{minimum}</strong><input type="range" min="0" max="4" value={minimum} onChange={event => { const value = Number(event.target.value); setMinimum(value); if (maximum < value) setMaximum(value); }} /></label><label>Máximo: <strong>{maximum}</strong><input type="range" min="0" max="6" value={maximum} onChange={event => { const value = Number(event.target.value); setMaximum(value); if (minimum > value) setMinimum(value); }} /></label></div><div className="ln73-digit-examples">{examples.map(value => <article key={value}><code>{value}</code><ArrowRight /><strong>{render(value)}</strong></article>)}</div><p className="ln73-format-proof"><Languages size={18} /><strong>{FORMAT_KINDS[kind][2]}</strong> · mínimo completa zeros; máximo limita e arredonda a exibição. Percentual recebe 0.075 e apresenta 7,50% porque multiplica por 100.</p><CodePanel name="Configuração local do formatador" code={`NumberFormat formato = NumberFormat.${FORMAT_KINDS[kind][1]}(Locale.forLanguageTag("pt-BR"));\nformato.setMinimumFractionDigits(${minimum});\nformato.setMaximumFractionDigits(${maximum});\nString texto = formato.format(valor);`} /></section>;
}

function BoundaryLab() {
  const [displayDigits, setDisplayDigits] = useState(2);
  return <section className="ln73-stack"><div className="ln73-boundary"><article><small>DOMÍNIO / CÁLCULO</small><strong>BigDecimal 10.567</strong><span>valor permanece preciso</span></article><ArrowRight /><article><small>FORMAT</small><strong>{displayDigits === 2 ? '10,57' : '10,567'}</strong><span>String para exibição</span></article><ArrowRight /><article className="blocked"><small>NÃO VOLTA AO CÁLCULO</small><strong>texto ≠ número</strong><span>não persistir “R$ 10,57” como valor</span></article></div><button type="button" className="ln73-toggle" onClick={() => setDisplayDigits(value => value === 2 ? 3 : 2)}>Alternar máximo: {displayDigits} casas</button><div className="ln73-responsibilities"><article><strong>Formatador</strong><span>valor → texto</span><code>formatarMoeda(valor)</code></article><article><strong>Conversor</strong><span>texto → valor</span><code>converterMoedaBrasil(texto)</code></article><article><strong>Validador</strong><span>valor → regra</span><code>validarValorPositivo(valor)</code></article></div><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Locale padrão é estado do ambiente</strong><p><code>Locale.getDefault()</code> pode mudar entre máquinas. Quando contrato e teste exigem formato previsível, informe o Locale explicitamente.</p></div></aside></section>;
}

const PARSE_CASES = ['1.234,56', '1234,56', 'R$ 1.234,56', '1.234.56', '12abc', ''];
function ParseLab() {
  const [input, setInput] = useState(PARSE_CASES[0]);
  const trimmed = input.trim();
  const currency = trimmed.startsWith('R$');
  const raw = currency ? trimmed.replace(/^R\$\s*/, '') : trimmed;
  const valid = /^(?:[+-]?(?:\d{1,3}(?:\.\d{3})*|\d+),\d+)$/.test(raw);
  const normalized = valid ? raw.replaceAll('.', '').replace(',', '.') : 'bloqueado';
  return <section className="ln73-stack"><div className="ln73-parse-cases">{PARSE_CASES.map(value => <button type="button" key={value || 'blank'} className={input === value ? 'active' : ''} onClick={() => setInput(value)}>{value || '(vazio)'}</button>)}</div><div className="ln73-parse-flow"><article><small>ENTRADA {currency ? 'DE MOEDA' : 'NUMÉRICA'}</small><strong>"{input}"</strong></article><ArrowRight /><article><small>LOCALE / GRAMÁTICA</small><strong>pt-BR</strong><span>milhar “.”, decimal “,”</span></article><ArrowRight /><article className={valid ? 'safe' : 'danger'}><small>VALOR CONTROLADO</small><strong>{normalized}</strong><span>{valid ? 'BigDecimal scale 2' : 'erro claro; não parse parcial'}</span></article></div><CodePanel name="Conversão brasileira controlada" code={`String limpo = texto.trim();\nif (!limpo.matches("[+-]?(?:\\\\d{1,3}(?:\\\\.\\\\d{3})*|\\\\d+),\\\\d+")) {\n    throw new IllegalArgumentException("Formato brasileiro inválido.");\n}\nString normalizado = limpo.replace(".", "").replace(",", ".");\nreturn new BigDecimal(normalizado).setScale(2, RoundingMode.HALF_UP);`} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>NumberFormat.parse retorna Number</strong><p>Ele pode lançar <code>ParseException</code> e pode aceitar prefixos válidos. Entrada monetária crítica precisa de formato aceito bem definido e consumo completo, não de replace ou parse permissivo às cegas.</p></div></aside></section>;
}

function MutabilityLab() {
  const [configured, setConfigured] = useState(false);
  return <section className="ln73-stack"><div className="ln73-mutability"><article><small>OBJETO CRIADO</small><strong>máximo padrão</strong><code>NumberFormat formato</code></article><ArrowRight /><article className={configured ? 'active' : ''}><small>SETTER</small><strong>maximumFractionDigits = 2</strong><span>o mesmo objeto muda</span></article><ArrowRight /><article><small>PRÓXIMA CHAMADA</small><strong>{configured ? '10,57' : '10,568'}</strong><span>configuração permanece</span></article></div><button type="button" className="ln73-toggle" onClick={() => setConfigured(value => !value)}>{configured ? 'Recriar formatador local' : 'Executar setMaximumFractionDigits(2)'}</button><div className="ln73-thread-rule"><AlertTriangle size={21} /><div><strong>Não transforme NumberFormat em global compartilhado</strong><p>Ele é mutável e não deve circular entre threads sem projeto consciente. Nesta fase, crie e configure dentro do método que formata ou converte.</p></div></div></section>;
}

const DOMAINS = [
  ['Produto', 'Cadeira custa R$ 199,90', 'preço continua BigDecimal; resumo recebe String'],
  ['Pedido', 'Subtotal, desconto, frete e total', 'calcula primeiro; formata cada linha depois'],
  ['Pagamento', '3x de R$ 33,33', 'texto não resolve o rateio de centavos'],
  ['Ordem de serviço', 'OS-001 | Custo total: R$ 155,50', 'soma custos antes da exibição'],
  ['Mensageria', '12 mensagens | Custo: R$ 4,20', 'quantidade e custo unitário permanecem tipados'],
  ['Auditoria', 'aline | ALTERACAO_VALOR | R$ 100,00', 'formatação pode arredondar a tela sem mudar 99.995'],
];
function DomainLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return <section className="ln73-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>BORDA DE APRESENTAÇÃO</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Pipeline profissional</strong><span>entrada textual → conversão → validação → cálculo BigDecimal → formatação final. Nunca use a String exibida como fonte do próximo cálculo.</span></div></article></section>;
}

const ERRORS = [
  ['Replace sem gramática', '1.234,56 vira 1.234.56 e permanece inválido.', 'Valide o formato conhecido antes de remover milhar e trocar decimal.'],
  ['Texto brasileiro no cálculo', '“R$ 1.234,56” é tratado como valor.', 'Converta para tipo numérico antes da regra.'],
  ['Persistir apresentação', 'Símbolo e separadores entram numa coluna numérica.', 'Persista valor; formate somente na saída.'],
  ['Locale padrão implícito', 'Teste passa numa máquina e muda em outra.', 'Informe Locale quando o contrato exigir.'],
  ['Vírgula e ponto trocados', 'BigDecimal recebe 1234,56 e falha.', 'String técnica usa ponto; entrada local exige conversão.'],
  ['Format muda valor', 'Arredondamento visual é confundido com regra.', 'Use setScale no domínio; format só gera String.'],
  ['NumberFormat global', 'Configuração mutável vaza entre usos e threads.', 'Crie/configure no escopo do método.'],
  ['double no dinheiro', 'Precisão é perdida antes da exibição.', 'Mantenha BigDecimal até a borda.'],
  ['Parse parcial permissivo', 'Prefixo válido esconde lixo restante.', 'Exija consumo completo ou gramática controlada.'],
  ['ParseException ignorada', 'Entrada inválida quebra sem mensagem de campo.', 'Trate ou traduza a falha na fronteira.'],
];
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="ln73-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>;
}

const CHECKS = ['pt-BR e en-US mostraram o mesmo valor','moeda, número e percentual foram separados','mínimo e máximo de casas foram configurados','formatação preservou o BigDecimal','parse Number leu 1.234,56','conversor controlado produziu 1234.56','produto e pedido formataram após cálculo','parcela não foi confundida com rateio','auditoria exibida preservou original','NumberFormat ficou local ao método'];
function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = 'mkdir labs\\m2\\aula-073-locale-numberformat\ncd labs\\m2\\aula-073-locale-numberformat\njavac LaboratorioFormatacao.java\njava LaboratorioFormatacao';
  return <section className="ln73-delivery"><CodePanel name="LaboratorioFormatacao.java" code={MAIN_PROGRAM} /><div className="ln73-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18} /><strong>Debug: valor, Locale, configuração e texto</strong></header><div><article><span>1</span><strong>Antes do format</strong><p>Confirme BigDecimal 1234.56 e Locale pt_BR.</p></article><article><span>2</span><strong>Depois do format</strong><p>Texto muda para R$ 1.234,56; valor não muda.</p></article><article><span>3</span><strong>Troque para US</strong><p>Observe símbolo e separadores sem recalcular.</p></article><article><span>4</span><strong>Entre no parse</strong><p>Acompanhe entrada, Number e BigDecimal controlado.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: resumo internacional sem contaminar o domínio</h3></div><p>Monte um pedido BigDecimal e apresente o mesmo resumo em pt-BR e en-US. Depois aceite uma entrada brasileira controlada, converta, valide e recalcule o total.</p><ul><li>Formate moeda, número e percentual separadamente.</li><li>Prove que o valor antes e depois do format é idêntico.</li><li>Rejeite entrada parcial, separadores incoerentes e texto vazio.</li><li>Não compartilhe NumberFormat global nem persista o texto formatado.</li></ul></section><section className="guided-file ln73-evidence"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'locale') return <LocaleLab />;
  if (block.type === 'digits') return <DigitsLab />;
  if (block.type === 'boundary') return <BoundaryLab />;
  if (block.type === 'parse') return <ParseLab />;
  if (block.type === 'mutable') return <MutabilityLab />;
  if (block.type === 'domains') return <DomainLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'locale', label: 'Showroom de Locales', duration: '12 min', eyebrow: 'MESMO VALOR, OUTRA CONVENÇÃO', title: 'Troque a apresentação sem tocar no cálculo', blocks: [{ type: 'lead', text: 'Locale combina idioma e região. NumberFormat usa essas convenções para moeda, números e percentuais; BigDecimal continua sendo o valor do domínio.' }, { type: 'locale' }] },
  { id: 'digits', label: 'Moeda, Número e Percentual', duration: '12 min', eyebrow: 'TRÊS FORMATADORES', title: 'Configure casas sem inventar zeros no valor', blocks: [{ type: 'lead', text: 'Currency, number e percent possuem semânticas diferentes. MinimumFractionDigits completa a exibição; MaximumFractionDigits limita e arredonda apenas o texto.' }, { type: 'digits' }] },
  { id: 'boundary', label: 'Cálculo versus Exibição', duration: '11 min', eyebrow: 'FRONTEIRA DE SAÍDA', title: 'Não deixe a String formatada voltar ao domínio', blocks: [{ type: 'lead', text: 'Formatar transforma valor em texto e não altera o BigDecimal. Persistência e cálculo usam tipos numéricos; símbolo e separadores pertencem à tela ou relatório.' }, { type: 'boundary' }] },
  { id: 'parse', label: 'Parsing Brasileiro', duration: '13 min', eyebrow: 'VÍRGULA, PONTO E CONSUMO COMPLETO', title: 'Interprete uma gramática conhecida antes de substituir', blocks: [{ type: 'lead', text: 'NumberFormat.parse retorna Number e pode falhar ou aceitar parcialmente. Dinheiro crítico pede formato aceito explícito, tratamento de erro e conversão cuidadosa para BigDecimal.' }, { type: 'parse' }] },
  { id: 'mutable', label: 'Mutabilidade e Escopo', duration: '9 min', eyebrow: 'CONFIGURAÇÃO PERSISTENTE', title: 'Mantenha NumberFormat local e previsível', blocks: [{ type: 'lead', text: 'Setters alteram o mesmo NumberFormat. Um formatador global compartilhado pode vazar configuração e criar problemas de concorrência.' }, { type: 'mutable' }] },
  { id: 'domains', label: 'Formatação no Backend', duration: '12 min', eyebrow: 'SEIS DOMÍNIOS', title: 'Calcule primeiro e apresente por último', blocks: [{ type: 'lead', text: 'Produto, pedido, pagamento, OS, mensageria e auditoria preservam tipos no domínio e geram texto apenas no resumo final.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Recupere a fronteira entre texto, valor e ambiente', blocks: [{ type: 'lead', text: 'Replace cego, Locale implícito, parse parcial e formatador global são falhas diferentes. Corrija a responsabilidade responsável.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '24 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove o mesmo domínio em duas apresentações', blocks: [{ type: 'lead', text: 'Compile o laboratório, confira dezessete linhas, investigue Locale e texto no debug e entregue um resumo internacional sem contaminar o valor.' }, { type: 'delivery' }] },
];

export default function GuidedLocaleNumberFormatLesson073({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => { const activeButton = navRef.current?.querySelector('button.active'); if (activeButton && window.matchMedia('(max-width: 900px)').matches) activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]);
  const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); };
  return <article className="guided-git-lesson guided-locale-numberformat-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Globe2 size={17} />Laboratório de apresentação regional</span><p className="guided-sequence">073 · M2.12</p><h1>Locale, NumberFormat e formatação</h1><p>Mantenha o valor no domínio, mude símbolos e separadores na borda e interprete entrada brasileira sem replace ou parse permissivo.</p></div><div className="guided-hero-status"><Globe2 size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 073" items={[{ value: '3 locales', label: 'Comparados com o mesmo valor' }, { value: '6 domínios', label: 'Formatados após o cálculo' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 073"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Valor e apresentação separados</h3><p>{lessonComplete ? 'Aula concluída e pronta para java.time.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 072</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>Locale, format, parse e fronteiras</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 074<ArrowRight size={17} /></button></footer></article>;
}
