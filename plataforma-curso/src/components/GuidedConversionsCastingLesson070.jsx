import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Check, CheckCircle2,
  Clock3, Copy, FileCode2, Filter, Gauge, Lightbulb, ListChecks, Play,
  RotateCcw, Scale, Sparkles, Terminal, Wrench,
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedConversionsCastingLesson.css';

const STORAGE_KEY = 'guided-conversions-casting-lesson-070-progress';

const MAIN_PROGRAM = `public class LaboratorioConversoes {
    public static void main(String[] args) {
        int quantidade = 10;
        long quantidadeLong = quantidade;
        double quantidadeDouble = quantidadeLong;
        System.out.println("widening: " + quantidade + " -> " + quantidadeLong + " -> " + quantidadeDouble);

        char letra = 'A';
        System.out.println("char A: " + (int) letra);

        System.out.println("long seguro: " + converterLongParaInt(1_000L));
        try {
            converterLongParaInt(3_000_000_000L);
        } catch (IllegalArgumentException erro) {
            System.out.println("long bloqueado: " + erro.getMessage());
        }

        System.out.println("cast double: " + (int) 10.9);
        System.out.println("divisao inteira: " + (10 / 4));
        System.out.println("divisao decimal: " + ((double) 10 / 4));
        System.out.println("parse int: " + Integer.parseInt("123"));
        System.out.println("parse long: " + Long.parseLong("3000000000"));
        System.out.println("parse double: " + Double.parseDouble("10.75"));
        System.out.println("valueOf: " + Integer.valueOf("10"));
        System.out.println("quantidade valida: " + converterQuantidadeObrigatoria(" 5 "));

        try {
            converterBooleanObrigatorio("abc", "Ativo");
        } catch (IllegalArgumentException erro) {
            System.out.println("boolean bloqueado: " + erro.getMessage());
        }
    }

    static int converterLongParaInt(long valor) {
        if (valor < Integer.MIN_VALUE || valor > Integer.MAX_VALUE) {
            throw new IllegalArgumentException("fora da faixa de int");
        }
        return (int) valor;
    }

    static int converterQuantidadeObrigatoria(String texto) {
        int valor = converterInteiroObrigatorio(texto, "Quantidade");
        if (valor <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero");
        }
        return valor;
    }

    static int converterInteiroObrigatorio(String texto, String campo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(campo + " e obrigatorio");
        }
        try {
            return Integer.parseInt(texto.trim());
        } catch (NumberFormatException erro) {
            throw new IllegalArgumentException(campo + " deve ser um inteiro valido");
        }
    }

    static boolean converterBooleanObrigatorio(String texto, String campo) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException(campo + " e obrigatorio");
        }
        String normalizado = texto.trim().toLowerCase();
        if ("true".equals(normalizado)) return true;
        if ("false".equals(normalizado)) return false;
        throw new IllegalArgumentException(campo + " deve ser true ou false");
    }
}`;

const EXPECTED_OUTPUT = `widening: 10 -> 10 -> 10.0
char A: 65
long seguro: 1000
long bloqueado: fora da faixa de int
cast double: 10
divisao inteira: 2
divisao decimal: 2.5
parse int: 123
parse long: 3000000000
parse double: 10.75
valueOf: 10
quantidade valida: 5
boolean bloqueado: Ativo deve ser true ou false`;

const EVIDENCE = `# Aula 070 — Conversões e casting

- [ ] Expliquei widening e narrowing
- [ ] Acompanhei promoção numérica e char para int
- [ ] Provoquei overflow em long para int
- [ ] Protegi o cast com MIN_VALUE e MAX_VALUE
- [ ] Provei que cast trunca e não arredonda
- [ ] Corrigi divisão inteira antes do cálculo
- [ ] Diferenciei parseInt, parseLong, parseDouble e valueOf
- [ ] Tratei NumberFormatException na borda
- [ ] Normalizei com trim sem alterar espaços internos
- [ ] Separei conversão técnica de regra de negócio
- [ ] Modelei cliente, produto, pedido, pagamento, OS, mensagem e auditoria
- [ ] Compilei, executei, depurei e revisei o diff`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return <button type="button" className="cv70-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java' }) {
  return <section className="guided-file cv70-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>;
}

const TYPE_LADDER = [
  ['byte', '8 bits', '-128 a 127'], ['short', '16 bits', '-32.768 a 32.767'],
  ['int', '32 bits', '±2,1 bilhões'], ['long', '64 bits', 'inteiro muito amplo'],
  ['float', '32 bits', 'decimal aproximado'], ['double', '64 bits', 'decimal aproximado'],
];

function WideningLab() {
  const [selected, setSelected] = useState(2);
  return <section className="cv70-stack"><div className="cv70-ladder" role="list" aria-label="Escada de conversões numéricas">{TYPE_LADDER.map((type, index) => <React.Fragment key={type[0]}><button type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{type[0]}</strong><span>{type[1]}</span></button>{index < TYPE_LADDER.length - 1 && <ArrowRight aria-hidden="true" />}</React.Fragment>)}</div><div className="cv70-type-detail"><article><small>TIPO SELECIONADO</small><h3>{TYPE_LADDER[selected][0]}</h3><p>{TYPE_LADDER[selected][2]}</p></article><article><small>WIDENING</small><strong>{selected < TYPE_LADDER.length - 1 ? `${TYPE_LADDER[selected][0]} → ${TYPE_LADDER[selected + 1][0]}` : 'fim da escada didática'}</strong><p>O compilador aceita implicitamente quando o destino comporta a categoria de origem. Isso não torna todo decimal exato.</p></article></div><CodePanel name="WideningNumerico.java · promoção visível" code={`int quantidade = 10;\nlong quantidadeLong = quantidade;\ndouble quantidadeDouble = quantidadeLong;\n\nchar letra = 'A';\nint codigo = letra;          // 65\n\ndouble total = 10 * 2.5;   // int promovido para double`} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Ampliar não é prometer precisão infinita</strong><p><code>long → double</code> é permitido, mas inteiros gigantes podem não ser representados exatamente. Para dinheiro nesta fase, prefira centavos em <code>long</code>.</p></div></aside></section>;
}

function NarrowingLab() {
  const [value, setValue] = useState('3000000000');
  const number = Number(value || 0);
  const inRange = Number.isInteger(number) && number >= -2147483648 && number <= 2147483647;
  const cast = Number.isFinite(number) ? number | 0 : 0;
  return <section className="cv70-stack"><div className="cv70-range-controls"><label htmlFor="cv70-long">Valor long de teste</label><input id="cv70-long" value={value} inputMode="numeric" onChange={event => setValue(event.target.value)} /><div className={inRange ? 'safe' : 'danger'}><Gauge size={21} /><span><strong>{inRange ? 'Dentro da faixa de int' : 'Fora da faixa de int'}</strong><small>−2.147.483.648 até 2.147.483.647</small></span></div></div><div className="cv70-narrow-flow"><article><small>ORIGEM LONG</small><strong>{value || '0'}L</strong></article><ArrowRight /><article className="danger"><small>CAST CEGO</small><strong>(int) → {cast}</strong><span>compila; não valida faixa</span></article><ArrowRight /><article className={inRange ? 'safe' : 'blocked'}><small>PORTÃO SEGURO</small><strong>{inRange ? `retorna ${Math.trunc(number)}` : 'lança IllegalArgumentException'}</strong><span>limites verificados antes do cast</span></article></div><CodePanel name="LongParaIntSeguro.java" code={`static int converterLongParaInt(long valor) {\n    if (valor < Integer.MIN_VALUE || valor > Integer.MAX_VALUE) {\n        throw new IllegalArgumentException("Valor fora da faixa de int.");\n    }\n    return (int) valor;\n}`} /><p className="cv70-proof"><CheckCircle2 size={18} />O cast só dá permissão ao compilador. A validação de faixa é uma decisão sua e precisa acontecer antes da perda.</p></section>;
}

const DECIMALS = ['10.1', '10.5', '10.9', '-10.9'];
function PrecisionLab() {
  const [decimal, setDecimal] = useState('10.9');
  const [divisionMode, setDivisionMode] = useState('integer');
  const cast = Math.trunc(Number(decimal));
  return <section className="cv70-stack"><div className="cv70-decimal-tabs">{DECIMALS.map(item => <button type="button" key={item} className={decimal === item ? 'active' : ''} onClick={() => setDecimal(item)}>{item}</button>)}</div><div className="cv70-cast-board"><article><small>DOUBLE</small><strong>{decimal}</strong><span>valor de origem</span></article><ArrowDown /><article className="danger"><small>(int) valor</small><strong>{cast}</strong><span>parte decimal descartada em direção a zero</span></article><aside><AlertTriangle size={20} /><strong>Isso não é arredondamento.</strong><p>10.1, 10.5 e 10.9 viram 10. A próxima aula ensina <code>Math.round</code>, <code>floor</code> e <code>ceil</code>.</p></aside></div><div className="cv70-division"><div><button type="button" className={divisionMode === 'integer' ? 'active' : ''} onClick={() => setDivisionMode('integer')}>10 / 4</button><button type="button" className={divisionMode === 'decimal' ? 'active' : ''} onClick={() => setDivisionMode('decimal')}>(double) 10 / 4</button></div><article><small>ORDEM REAL</small><code>{divisionMode === 'integer' ? 'int ÷ int → int → atribuição a double' : 'cast antes → double ÷ int → double'}</code><strong>{divisionMode === 'integer' ? '2.0' : '2.5'}</strong><p>{divisionMode === 'integer' ? 'O .5 já foi perdido antes de guardar o resultado.' : 'Um operando decimal promove a expressão antes da divisão.'}</p></article></div></section>;
}

const PARSERS = {
  int: ['Integer.parseInt', '123', 'int', '123'],
  long: ['Long.parseLong', '3000000000', 'long', '3000000000'],
  double: ['Double.parseDouble', '10.75', 'double', '10.75'],
  wrapper: ['Integer.valueOf', '123', 'Integer', '123'],
};

function ParsingLab() {
  const [parser, setParser] = useState('int');
  const [input, setInput] = useState('123');
  const selected = PARSERS[parser];
  let result = '';
  let error = false;
  try {
    const normalized = input.trim();
    if (parser === 'int' || parser === 'wrapper') {
      if (!/^[+-]?\d+$/.test(normalized) || Number(normalized) < -2147483648 || Number(normalized) > 2147483647) throw new Error();
      result = String(Number(normalized));
    } else if (parser === 'long') {
      if (!/^[+-]?\d+$/.test(normalized)) throw new Error();
      result = normalized;
    } else {
      if (normalized === '' || !Number.isFinite(Number(normalized))) throw new Error();
      result = String(Number(normalized));
    }
  } catch { error = true; result = 'NumberFormatException'; }
  const choose = key => { setParser(key); setInput(PARSERS[key][1]); };
  return <section className="cv70-stack"><div className="cv70-parser-tabs">{Object.entries(PARSERS).map(([key, item]) => <button type="button" key={key} className={parser === key ? 'active' : ''} onClick={() => choose(key)}>{item[0]}</button>)}</div><div className="cv70-parser-bench"><label htmlFor="cv70-input"><span>STRING RECEBIDA</span><input id="cv70-input" value={input} onChange={event => setInput(event.target.value)} /></label><ArrowRight /><article><small>NORMALIZAR</small><code>trim()</code><strong>"{input.trim()}"</strong></article><ArrowRight /><article className={error ? 'danger' : 'safe'}><small>{error ? 'FALHA DE FORMATO' : selected[2]}</small><strong>{result}</strong></article></div><CodePanel name="Bancada de parsing · expressão atual" code={`${selected[2]} valor = ${selected[0]}("${input.replaceAll('"', '\\"')}");`} /><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Ponto decimal e formato importam</strong><p><code>parseInt("10.5")</code>, texto vazio, <code>abc</code> e <code>12a</code> falham. <code>parseDouble("10,75")</code> também não adota vírgula automaticamente; Locale virá depois.</p></div></aside></section>;
}

const POLICIES = [
  ['Opcional', 'Integer ou null', 'Retorne null somente quando ausência ou formato inválido fizerem parte do contrato; quem chama deve conferir.'],
  ['Fallback', 'int ou padrão', 'Use 0 apenas quando zero for uma resposta de negócio legítima. Caso contrário, o erro fica escondido.'],
  ['Obrigatório', 'int ou exceção clara', 'Valide null/blank, normalize, capture NumberFormatException e informe o campo.'],
  ['Pré-validação', 'somente dígitos', 'Um laço pode restringir a inteiros positivos; sinais, decimais e espaços internos ficam rejeitados por regra.'],
];

function PolicyLab() {
  const [selected, setSelected] = useState(2);
  const item = POLICIES[selected];
  return <section className="cv70-stack"><div className="cv70-policy-tabs">{POLICIES.map((policy, index) => <button type="button" key={policy[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{policy[0]}</button>)}</div><div className="cv70-pipeline"><article><small>1 · ENTRADA</small><strong>String</strong><span>null, blank ou texto</span></article><ArrowRight /><article><small>2 · NORMALIZAÇÃO</small><strong>trim</strong><span>não remova espaços internos às cegas</span></article><ArrowRight /><article><small>3 · CONVERSÃO</small><strong>parse</strong><span>formato e faixa técnica</span></article><ArrowRight /><article><small>4 · DOMÍNIO</small><strong>validar</strong><span>positivo, obrigatório, vocabulário</span></article></div><div className="cv70-policy-verdict"><Filter size={24} /><div><small>POLÍTICA SELECIONADA</small><h3>{item[0]} → {item[1]}</h3><p>{item[2]}</p></div></div><CodePanel name="Conversão obrigatória · responsabilidades separadas" code={`static int converterInteiroObrigatorio(String texto, String campo) {\n    if (texto == null || texto.isBlank()) {\n        throw new IllegalArgumentException(campo + " é obrigatório.");\n    }\n    try {\n        return Integer.parseInt(texto.trim());\n    } catch (NumberFormatException erro) {\n        throw new IllegalArgumentException(campo + " deve ser inteiro válido.");\n    }\n}\n\nstatic int converterQuantidade(String texto) {\n    int quantidade = converterInteiroObrigatorio(texto, "Quantidade");\n    if (quantidade <= 0) throw new IllegalArgumentException("Quantidade deve ser positiva.");\n    return quantidade;\n}`} /></section>;
}

const DOMAINS = [
  ['Cliente', 'idade: "30" → int 30', 'idade não pode ser negativa'],
  ['Produto', 'estoque: "10"; ativo: "true"', 'estoque ≥ 0; boolean aceita apenas true/false'],
  ['Pedido', 'id: "1001"; centavos: "2500"', 'long para ID e dinheiro em centavos; valor > 0'],
  ['Pagamento', 'centavos: "10000"; parcelas: "4"', 'valor e parcelas > 0 antes de dividir'],
  ['Ordem de serviço', 'atividades: "3"; urgente: "false"', 'quantidade não negativa e boolean estrito'],
  ['Mensageria', 'tentativas: "2"; tipo: "entrega"', 'tentativas não negativas; tipo normalizado'],
  ['Auditoria', 'id: "100"; tentativa: "1"', 'long para ID; tentativa positiva; usuário normalizado'],
];

function DomainLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return <section className="cv70-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>FRONTEIRA → TIPO → REGRA</small><h3>{item[0]}</h3><code>{item[1]}</code><div><Scale size={25} /><p><strong>Conversão técnica:</strong> o texto cabe e tem formato aceito.</p><p><strong>Validação de negócio:</strong> {item[2]}.</p></div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Boolean.parseBoolean não é validador</strong><p><code>Boolean.parseBoolean("abc")</code> devolve false silenciosamente. Em campos obrigatórios, reconheça true e false explicitamente e rejeite o resto.</p></div></aside></article></section>;
}

const ERRORS = [
  ['Cast como validação', 'O código compila, mas uma faixa menor pode corromper o valor.', 'Valide MIN_VALUE e MAX_VALUE antes do cast.'],
  ['Cast como arredondamento', '10.9 vira 10 porque a fração é truncada.', 'Use a regra de arredondamento adequada, estudada na próxima aula.'],
  ['long grande para int', '3.000.000.000 pode virar número negativo.', 'Bloqueie valores fora da faixa antes de converter.'],
  ['Divisão inteira escondida', 'double resultado = 10 / 4 produz 2.0.', 'Promova um operando antes da divisão.'],
  ['parseInt em decimal', '"10.5" não é formato de int.', 'Escolha o parser compatível ou rejeite a entrada.'],
  ['NumberFormatException solta', 'A borda técnica vaza erro sem contexto do campo.', 'Capture na fronteira e produza mensagem clara.'],
  ['parseBoolean permissivo', '"abc" vira false e parece uma resposta válida.', 'Valide o vocabulário true/false.'],
  ['null antes do parse', 'A conversão quebra sem explicar obrigatoriedade.', 'Valide null e blank antes de normalizar.'],
  ['Zero como fallback universal', 'Entrada inválida vira dado real e segue no fluxo.', 'Use fallback somente com regra explícita.'],
  ['Regra misturada sem clareza', 'Formato, faixa e domínio viram um bloco difícil de testar.', 'Converta tecnicamente e valide o domínio em etapas nomeadas.'],
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return <section className="cv70-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>;
}

const CHECKS = ['widening preservou 10','char A virou código 65','cast seguro aceitou 1000','faixa bloqueou 3 bilhões','cast 10.9 truncou para 10','divisão inteira mostrou 2','promoção corrigiu para 2.5','parsers produziram tipos esperados','trim normalizou a quantidade','boolean desconhecido foi rejeitado'];
function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = 'mkdir labs\\m2\\aula-070-conversoes-casting\ncd labs\\m2\\aula-070-conversoes-casting\njavac LaboratorioConversoes.java\njava LaboratorioConversoes';
  return <section className="cv70-delivery"><CodePanel name="LaboratorioConversoes.java" code={MAIN_PROGRAM} /><div className="cv70-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="cv70-debug"><header><Play size={18} /><strong>Debug: diferencie falha, perda e regra</strong></header><div><article><span>1</span><strong>Breakpoint no cast</strong><p>Compare <code>3_000_000_000L</code> com os limites de int.</p></article><article><span>2</span><strong>Evaluate cast</strong><p>Veja o valor corrompido sem alterar o fluxo seguro.</p></article><article><span>3</span><strong>Breakpoint no parse</strong><p>Troque a entrada por <code>10.5</code> e observe NumberFormatException.</p></article><article><span>4</span><strong>Antes da divisão</strong><p>Confirme os tipos dos operandos antes de calcular.</p></article></div></section><div className="cv70-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: importador de pedido sem conversão silenciosa</h3></div><p>Receba ID, cliente, valor em centavos, parcelas e indicador de urgência como texto. Normalize apenas o que a regra permite, converta por métodos centralizados, rejeite boolean desconhecido e valide o domínio depois do parse.</p><ul><li>Prove um pedido válido com saída determinística.</li><li>Provoque formato inválido, overflow e regra negativa separadamente.</li><li>Não use cast para arredondar nem zero como erro genérico.</li><li>Registre decisões no README e mantenha <code>.class</code> fora do Git.</li></ul></section><section className="guided-file cv70-evidence"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'widening') return <WideningLab />;
  if (block.type === 'narrowing') return <NarrowingLab />;
  if (block.type === 'precision') return <PrecisionLab />;
  if (block.type === 'parsing') return <ParsingLab />;
  if (block.type === 'policy') return <PolicyLab />;
  if (block.type === 'domains') return <DomainLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'widening', label: 'Mapa de Ampliação', duration: '12 min', eyebrow: 'WIDENING E PROMOÇÃO', title: 'Suba a escada de tipos sem tratar conversão como mágica', blocks: [{ type: 'lead', text: 'Widening leva um valor a uma categoria mais ampla e costuma ser implícito. A expressão também pode promover operandos; char participa como código numérico.' }, { type: 'widening' }] },
  { id: 'narrowing', label: 'Narrowing com Faixa', duration: '12 min', eyebrow: 'CAST EXPLÍCITO', title: 'Meça a faixa antes de reduzir o tipo', blocks: [{ type: 'lead', text: 'Narrowing exige cast porque o destino pode não representar a origem. O cast satisfaz o compilador, mas não detecta overflow nem protege o negócio.' }, { type: 'narrowing' }] },
  { id: 'precision', label: 'Truncamento e Divisão', duration: '11 min', eyebrow: 'ORDEM DA PERDA', title: 'Descubra exatamente quando a informação desaparece', blocks: [{ type: 'lead', text: 'Converter double para int descarta a parte decimal; divisão entre inteiros também perde a fração antes da atribuição. O ponto da promoção muda o resultado.' }, { type: 'precision' }] },
  { id: 'parsing', label: 'Bancada de Parsing', duration: '13 min', eyebrow: 'STRING PARA NÚMERO', title: 'Escolha parser, formato e tipo de retorno conscientemente', blocks: [{ type: 'lead', text: 'Entradas de terminal, arquivos, HTTP e mensageria frequentemente chegam como String. parseInt, parseLong e parseDouble retornam primitivos; valueOf retorna wrapper.' }, { type: 'parsing' }] },
  { id: 'policy', label: 'Política de Conversão', duration: '12 min', eyebrow: 'NORMALIZAR, CONVERTER, VALIDAR', title: 'Defina o contrato do erro em vez de esconder a entrada', blocks: [{ type: 'lead', text: 'Null, blank, formato inválido e regra de negócio são problemas diferentes. Um método seguro precisa declarar se retorna ausência, aplica fallback ou falha com mensagem clara.' }, { type: 'policy' }] },
  { id: 'domains', label: 'Conversão no Backend', duration: '13 min', eyebrow: 'SETE DOMÍNIOS', title: 'Transforme texto externo em estado válido, não apenas em outro tipo', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensagem e auditoria usam os mesmos parsers, mas não compartilham as mesmas regras.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Corrija a causa: faixa, precisão, formato ou domínio', blocks: [{ type: 'lead', text: 'Cast, parse e validação falham de maneiras distintas. Leia o sintoma, localize a fronteira responsável e aplique a correção específica.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '23 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove cada conversão com saída, falha controlada e evidência', blocks: [{ type: 'lead', text: 'Compile um laboratório integrado, confira treze linhas, depure overflow, parse e divisão, depois projete um importador com contrato explícito.' }, { type: 'delivery' }] },
];

export default function GuidedConversionsCastingLesson070({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-conversions-casting-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Scale size={17} />Laboratório de fronteiras numéricas</span><p className="guided-sequence">070 · M2.09</p><h1>Conversões e casting</h1><p>Acompanhe ampliação, redução, overflow, truncamento e parsing; depois transforme texto externo em valor validado pelo domínio.</p></div><div className="guided-hero-status"><Scale size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 070" items={[{ value: '4 fronteiras', label: 'Faixa, precisão, formato e regra' }, { value: '7 domínios', label: 'Convertidos com contrato' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 070"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={`${index === activeIndex ? 'active ' : ''}${completedSteps.has(item.id) ? 'done' : ''}`} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={`${block.type}-${index}`} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${stepDone ? 'undo' : 'complete'}`} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Conversões sob controle</h3><p>{lessonComplete ? 'Aula concluída e pronta para Math.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 069</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsDone ? 'ready' : ''}`}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : `${completedSteps.size} de ${steps.length} etapas`}</strong><small>faixa, precisão, parse e domínio</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 071<ArrowRight size={17} /></button></footer></article>;
}
