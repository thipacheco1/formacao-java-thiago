import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Braces, Check, CheckCircle2, Clock3, Copy, FileCode2, GitCompareArrows, Lightbulb, ListChecks, Play, RotateCcw, Sparkles, Terminal, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedProfessionalSignatureLesson.css';

const STORAGE_KEY = 'guided-professional-signature-lesson-091-progress';

const BAD_PROGRAM = [
  'import java.math.BigDecimal;', '', 'public class AssinaturaRuim {', '    public static void main(String[] args) {',
  '        BigDecimal r = p(new BigDecimal("100.00"), 2, true);', '        System.out.println(r);', '    }', '',
  '    public static BigDecimal p(BigDecimal a, int b, boolean c) {', '        BigDecimal t = a.multiply(BigDecimal.valueOf(b));',
  '        if (c) return t.multiply(new BigDecimal("0.90"));', '        return t;', '    }', '}',
].join('\n');

const GOOD_PROGRAM = [
  'import java.math.BigDecimal;', '', 'public class AssinaturaBoa {', '    public static void main(String[] args) {',
  '        BigDecimal total = calcularTotalComDesconto(', '                new BigDecimal("100.00"), 2, TipoCliente091.PREMIUM);',
  '        System.out.println(total);', '    }', '',
  '    public static BigDecimal calcularTotalComDesconto(', '            BigDecimal precoUnitario, int quantidade, TipoCliente091 tipoCliente) {',
  '        BigDecimal total = calcularTotal(precoUnitario, quantidade);', '        if (tipoCliente == TipoCliente091.PREMIUM) {',
  '            return aplicarPercentualDesconto(total, new BigDecimal("0.10"));', '        }', '        return total;', '    }', '',
  '    public static BigDecimal calcularTotal(BigDecimal precoUnitario, int quantidade) {',
  '        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));', '    }', '',
  '    public static BigDecimal aplicarPercentualDesconto(BigDecimal total, BigDecimal percentual) {',
  '        BigDecimal fatorDesconto = BigDecimal.ONE.subtract(percentual);', '        return total.multiply(fatorDesconto);', '    }', '}', '',
  'enum TipoCliente091 { COMUM, PREMIUM }',
].join('\n');

const ORDER_PROGRAM = [
  'import java.math.BigDecimal;', '', 'public class PedidoAssinaturaProfissional {', '    public static void main(String[] args) {',
  '        BigDecimal total = calcularTotalPedido(new BigDecimal("150.00"), 3);', '        BigDecimal desconto = calcularDescontoPorTotal(total);',
  '        BigDecimal totalFinal = calcularTotalFinal(total, desconto);', '        imprimirResumoPedido(total, desconto, totalFinal);', '    }', '',
  '    static BigDecimal calcularTotalPedido(BigDecimal precoUnitario, int quantidade) {', '        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));', '    }',
  '    static BigDecimal calcularDescontoPorTotal(BigDecimal totalPedido) {', '        return totalPedido.compareTo(new BigDecimal("300.00")) >= 0',
  '                ? totalPedido.multiply(new BigDecimal("0.10")) : BigDecimal.ZERO;', '    }',
  '    static BigDecimal calcularTotalFinal(BigDecimal totalPedido, BigDecimal desconto) {', '        return totalPedido.subtract(desconto);', '    }',
  '    static void imprimirResumoPedido(BigDecimal totalPedido, BigDecimal desconto, BigDecimal totalFinal) {',
  '        System.out.println("Total: " + totalPedido);', '        System.out.println("Desconto: " + desconto);', '        System.out.println("Total final: " + totalFinal);', '    }', '}',
].join('\n');

const CLIENT_PROGRAM = [
  'public class ClienteAssinaturaProfissional {', '    public static void main(String[] args) {',
  '        String nome = normalizarNomeCliente("  Ana Silva  ");', '        String email = normalizarEmailCliente(" ANA@EMAIL.COM ");',
  '        ResultadoValidacao091 validacao = validarCliente(nome, email);', '        if (!validacao.valido()) { System.out.println(validacao.mensagem()); return; }',
  '        imprimirCliente(nome, email);', '    }',
  '    static String normalizarNomeCliente(String nome) { return nome == null ? "" : nome.trim().replaceAll("\\\\s+", " "); }',
  '    static String normalizarEmailCliente(String email) { return email == null ? "" : email.trim().toLowerCase(); }',
  '    static ResultadoValidacao091 validarCliente(String nome, String email) {',
  '        if (nome == null || nome.isBlank()) return ResultadoValidacao091.erro("Nome obrigatório.");',
  '        if (email == null || email.isBlank() || !email.contains("@")) return ResultadoValidacao091.erro("E-mail inválido.");',
  '        return ResultadoValidacao091.sucesso();', '    }',
  '    static void imprimirCliente(String nome, String email) { System.out.println(nome + " | " + email); }', '}',
  'record ResultadoValidacao091(boolean valido, String mensagem) {',
  '    static ResultadoValidacao091 sucesso() { return new ResultadoValidacao091(true, "OK"); }',
  '    static ResultadoValidacao091 erro(String mensagem) { return new ResultadoValidacao091(false, mensagem); }', '}',
].join('\n');

const PRODUCT_PROGRAM = [
  'import java.math.BigDecimal;', '', 'public class ProdutoAssinaturaProfissional {', '    public static void main(String[] args) {',
  '        String nome = normalizarNomeProduto("  mesa de escritório  ");', '        BigDecimal preco = new BigDecimal("450.00");', '        int estoque = 4;',
  '        if (!produtoDisponivelParaVenda(preco, estoque)) { System.out.println("Indisponível."); return; }',
  '        imprimirResumoProduto(nome, preco, estoque, calcularValorTotalEmEstoque(preco, estoque));', '    }',
  '    static String normalizarNomeProduto(String nome) { return nome == null ? "" : nome.trim().replaceAll("\\\\s+", " "); }',
  '    static boolean produtoDisponivelParaVenda(BigDecimal preco, int estoque) {',
  '        return preco != null && preco.compareTo(BigDecimal.ZERO) > 0 && estoque > 0;', '    }',
  '    static BigDecimal calcularValorTotalEmEstoque(BigDecimal precoUnitario, int quantidadeEmEstoque) {',
  '        return precoUnitario.multiply(BigDecimal.valueOf(quantidadeEmEstoque));', '    }',
  '    static void imprimirResumoProduto(String nome, BigDecimal preco, int estoque, BigDecimal total) {',
  '        System.out.println(nome + " | " + preco + " | " + estoque + " | " + total);', '    }', '}',
].join('\n');

const PAYMENT_PROGRAM = [
  'import java.math.BigDecimal;', 'import java.math.RoundingMode;', '', 'public class PagamentoAssinaturaProfissional {',
  '    public static void main(String[] args) {', '        BigDecimal valor = arredondarValorMonetario(new BigDecimal("100.005"));',
  '        ResultadoPagamento091 resultado = processarPagamento(valor, FormaPagamento091.PIX);', '        imprimirResultadoPagamento(resultado);', '    }',
  '    static BigDecimal arredondarValorMonetario(BigDecimal valor) {', '        if (valor == null) throw new IllegalArgumentException("Valor obrigatório.");',
  '        return valor.setScale(2, RoundingMode.HALF_UP);', '    }',
  '    static ResultadoPagamento091 processarPagamento(BigDecimal valor, FormaPagamento091 forma) {',
  '        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) return new ResultadoPagamento091(false, "Valor inválido.");',
  '        if (forma == null) return new ResultadoPagamento091(false, "Forma obrigatória.");',
  '        return new ResultadoPagamento091(true, "Pagamento processado via " + forma);', '    }',
  '    static void imprimirResultadoPagamento(ResultadoPagamento091 resultado) { System.out.println(resultado.mensagem()); }', '}',
  'enum FormaPagamento091 { PIX, CARTAO, BOLETO }', 'record ResultadoPagamento091(boolean aprovado, String mensagem) {}',
].join('\n');

const SERVICE_ORDER_PROGRAM = [
  'import java.time.LocalDate;', 'import java.time.temporal.ChronoUnit;', '', 'public class OrdemServicoAssinaturaProfissional {',
  '    public static void main(String[] args) {', '        String certificado = normalizarCertificadoOs(" os-001 ");',
  '        LocalDate dataAgendamento = LocalDate.now().plusDays(3);', '        if (!dataAgendamentoValida(dataAgendamento)) { System.out.println("Data inválida."); return; }',
  '        imprimirResumoAgendamento(certificado, dataAgendamento, calcularDiasAteAgendamento(dataAgendamento));', '    }',
  '    static String normalizarCertificadoOs(String certificado) { return certificado == null ? "" : certificado.trim().toUpperCase(); }',
  '    static boolean dataAgendamentoValida(LocalDate data) { return data != null && !data.isBefore(LocalDate.now()); }',
  '    static long calcularDiasAteAgendamento(LocalDate data) { return ChronoUnit.DAYS.between(LocalDate.now(), data); }',
  '    static void imprimirResumoAgendamento(String certificado, LocalDate data, long dias) {',
  '        System.out.println(certificado + " | " + data + " | " + dias);', '    }', '}',
].join('\n');

const MESSAGING_PROGRAM = [
  'public class MensageriaAssinaturaProfissional {', '    public static void main(String[] args) {',
  '        String mensagem = montarMensagemAcompanhamentoOs("Ana", "OS-001");', '        imprimirMensagemWhatsApp(mensagem);', '    }',
  '    static String montarMensagemAcompanhamentoOs(String nomeCliente, String certificadoOs) {',
  '        return "Olá, %s. Sua OS %s está em acompanhamento.".formatted(',
  '                normalizarNomeCliente(nomeCliente), normalizarCertificadoOs(certificadoOs));', '    }',
  '    static String normalizarNomeCliente(String nome) { return nome == null ? "" : nome.trim(); }',
  '    static String normalizarCertificadoOs(String certificado) { return certificado == null ? "" : certificado.trim().toUpperCase(); }',
  '    static void imprimirMensagemWhatsApp(String mensagem) { System.out.println("WhatsApp: " + mensagem); }', '}',
].join('\n');

const AUDIT_PROGRAM = [
  'import java.time.Instant;', '', 'public class AuditoriaAssinaturaProfissional {', '    public static void main(String[] args) {',
  '        String registro = montarRegistroAuditoria("aline", "CRIACAO", "Produto", 10L, Instant.EPOCH);',
  '        imprimirRegistroAuditoria(registro);', '    }',
  '    static String montarRegistroAuditoria(String usuario, String operacao, String entidade, Long entidadeId, Instant criadoEm) {',
  '        if (usuario == null || usuario.isBlank()) throw new IllegalArgumentException("Usuário obrigatório.");',
  '        if (operacao == null || operacao.isBlank()) throw new IllegalArgumentException("Operação obrigatória.");',
  '        if (entidade == null || entidade.isBlank()) throw new IllegalArgumentException("Entidade obrigatória.");',
  '        if (entidadeId == null || entidadeId <= 0) throw new IllegalArgumentException("ID obrigatório.");',
  '        if (criadoEm == null) throw new IllegalArgumentException("Data obrigatória.");',
  '        return "AUDITORIA | usuario=%s | operacao=%s | entidade=%s | entidadeId=%d | criadoEm=%s"',
  '                .formatted(usuario, operacao, entidade, entidadeId, criadoEm);', '    }',
  '    static void imprimirRegistroAuditoria(String registro) { System.out.println(registro); }', '}',
].join('\n');

const EXPECTED_GOOD = '180.0000';
const EXPECTED_ORDER = ['Total: 450.00', 'Desconto: 45.0000', 'Total final: 405.0000'].join('\n');
const EVIDENCE = ['# Aula 091 — Assinatura profissional', '', '- [ ] Li a assinatura como contrato', '- [ ] Combinei verbo e retorno', '- [ ] Nomeei parâmetros pelo domínio', '- [ ] Escolhi tipos que representam o dado', '- [ ] Ordenei parâmetros naturalmente', '- [ ] Substituí boolean misterioso por enum', '- [ ] Defini a política de null', '- [ ] Reconheci parâmetros demais', '- [ ] Comparei assinatura ruim e boa', '- [ ] Compilei os nove exemplos', '- [ ] Depurei parâmetros e retornos', '- [ ] Revisei diff e .class antes do commit'].join('\n');

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); };
  return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : label}</button>;
}
function CodePanel({ name, code }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16}/>{name}<CopyButton value={code}/></div><SyntaxHighlighter language="java" style={vscDarkPlus} showLineNumbers wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

const SIGNATURE_PARTS = [
  ['public', 'visibilidade', 'quem pode chamar'], ['static', 'vínculo', 'pertence à classe neste momento'], ['BigDecimal', 'retorno', 'o resultado produzido'],
  ['calcularTotalPedido', 'nome', 'verbo + conceito + intenção'], ['BigDecimal precoUnitario', 'parâmetro 1', 'tipo e significado'], ['int quantidade', 'parâmetro 2', 'ordem natural'], ['throws IOException', 'falha declarada', 'checked exception obriga tratar ou propagar'],
];
function AnatomyLab() {
  const [selected, setSelected] = useState(3); const item = SIGNATURE_PARTS[selected];
  return <section className="sg91-stack"><div className="sg91-signature" aria-label="Anatomia interativa de uma assinatura Java">{SIGNATURE_PARTS.map((part, index) => <button type="button" key={part[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{part[0]}</button>)}</div><article className="sg91-contract"><Braces/><div><small>{item[1]}</small><strong>{item[0]}</strong><span>{item[2]}.</span></div></article><div className="sg91-call-flow"><span>quem chama</span><ArrowRight/><span>argumentos tipados</span><ArrowRight/><span>método cumpre promessa</span><ArrowRight/><span>retorno ou falha</span></div><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Assinatura é contrato antes de ser sintaxe</strong><p>Ela informa como chamar, o que fornecer, o que esperar e qual responsabilidade provável — sem abrir o corpo.</p></div></aside></section>;
}

const VERBS = [
  ['calcular', 'BigDecimal', 'produz resultado numérico'], ['validar', 'boolean ou ResultadoValidacao', 'responde validade'], ['imprimir', 'void', 'executa saída'], ['converter', 'outro tipo', 'transforma representação'], ['montar', 'String ou objeto', 'constrói estrutura'], ['buscar', 'tipo encontrado', 'recupera dado'], ['registrar', 'void ou resultado', 'produz efeito observável'],
];
function VerbLab() {
  const [selected, setSelected] = useState(0); const item = VERBS[selected];
  return <section className="sg91-stack"><div className="sg91-verbs">{VERBS.map((verb, index) => <button type="button" key={verb[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><strong>{verb[0]}</strong><span>{verb[1]}</span></button>)}</div><article className="sg91-promise"><span>{item[0]}(...)</span><ArrowRight/><strong>{item[1]}</strong><small>{item[2]}.</small></article><div className="sg91-before-after"><article><small>PROMESSA QUEBRADA</small><code>void calcularTotal(...)</code><span>calcula, mas esconde o valor na impressão.</span></article><article><small>CONTRATO COERENTE</small><code>BigDecimal calcularTotal(...)</code><code>void imprimirTotal(total)</code></article></div></section>;
}

const PARAMETER_TOPICS = [
  ['nome', 'BigDecimal a, int b', 'BigDecimal precoUnitario, int quantidade'],
  ['tipo', 'String valor', 'BigDecimal valorMonetario'],
  ['ordem', 'dataFinal, dataInicial', 'dataInicial, dataFinal'],
  ['null', 'contrato implícito', 'normalizarTexto ou normalizarTextoObrigatorio'],
  ['quantidade', 'sete valores soltos', 'cheiro de ResumoPedido'],
];
function ParameterLab() {
  const [selected, setSelected] = useState(0); const item = PARAMETER_TOPICS[selected];
  return <section className="sg91-stack"><div className="sg91-topics">{PARAMETER_TOPICS.map((topic, index) => <button type="button" key={topic[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{topic[0]}</button>)}</div><div className="sg91-before-after"><article><small>OBRIGA ABRIR O CORPO</small><code>{item[1]}</code></article><article><small>CHAMADA EXPLICÁVEL</small><code>{item[2]}</code></article></div><div className="sg91-type-map"><span>dinheiro → BigDecimal</span><span>data → LocalDate</span><span>instante → Instant</span><span>opção fixa → enum</span><span>resultado rico → record</span></div><aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>Muitos parâmetros são um sinal</strong><p>Podem indicar dados relacionados, responsabilidade grande ou conceito ausente. Reconheça agora; agrupe com record ou classe quando o modelo pedir.</p></div></aside></section>;
}

function BooleanLab() {
  const [mode, setMode] = useState('enum');
  return <section className="sg91-stack"><div className="sg91-toggle"><button type="button" className={mode === 'boolean' ? 'active' : ''} onClick={() => setMode('boolean')}>boolean misterioso</button><button type="button" className={mode === 'enum' ? 'active' : ''} onClick={() => setMode('enum')}>enum explícito</button><button type="button" className={mode === 'method' ? 'active' : ''} onClick={() => setMode('method')}>método específico</button></div><div className="sg91-call"><code>{mode === 'boolean' ? 'formatarNome("Ana", true)' : mode === 'enum' ? 'formatarNome("Ana", TipoNormalizacao.MAIUSCULA)' : 'formatarNomeMaiusculo("Ana")'}</code><span>{mode === 'boolean' ? 'true significa o quê?' : 'a chamada explica a decisão sem abrir o método.'}</span></div><article className="sg91-null"><strong>Política de null também faz parte do contrato</strong><div><code>normalizarTexto(null) → ""</code><code>normalizarTextoObrigatorio(null) → IllegalArgumentException</code></div><p>O nome muda porque a regra muda. Consistência é mais importante que fingir que a assinatura mostra tudo.</p></article></section>;
}

function CompareLab() {
  const [version, setVersion] = useState('good');
  return <section className="sg91-stack"><div className="sg91-toggle"><button type="button" className={version === 'bad' ? 'active danger' : ''} onClick={() => setVersion('bad')}>AssinaturaRuim.java</button><button type="button" className={version === 'good' ? 'active' : ''} onClick={() => setVersion('good')}>AssinaturaBoa.java</button></div><CodePanel name={version === 'bad' ? 'AssinaturaRuim.java' : 'AssinaturaBoa.java'} code={version === 'bad' ? BAD_PROGRAM : GOOD_PROGRAM}/><div className="sg91-score"><span>{version === 'bad' ? 'p(a, b, true)' : 'calcularTotalComDesconto(precoUnitario, quantidade, TipoCliente.PREMIUM)'}</span><strong>{version === 'bad' ? '0 de 5 perguntas respondidas' : '5 de 5 perguntas respondidas'}</strong></div><p className="ln73-format-proof">As duas versões imprimem <strong>{EXPECTED_GOOD}</strong>. A diferença é o esforço de leitura: a boa assinatura revela domínio, influência do enum e significado do retorno.</p></section>;
}

const REFACTORS = [
  ['nome e parâmetros', 'x(BigDecimal a, int b, boolean c)', 'calcularTotalComDesconto(BigDecimal precoUnitario, int quantidade, TipoCliente tipoCliente)'],
  ['boolean misterioso', 'formatarTexto("Ana", true)', 'formatarTexto("Ana", TipoNormalizacao.MAIUSCULA)'],
  ['void errado', 'void calcularTotal(...) { println(...); }', 'BigDecimal calcularTotal(...) + void imprimirTotal(total)'],
  ['parâmetros demais', 'imprimirResumo(cliente, produto, preco, quantidade, total, desconto, totalFinal)', 'imprimirResumo(ResumoPedido resumo) — evolução futura'],
];
function RefactorLab() {
  const [selected, setSelected] = useState(0); const item = REFACTORS[selected];
  return <section className="sg91-stack"><div className="sg91-refactors">{REFACTORS.map((refactor, index) => <button type="button" key={refactor[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span>{refactor[0]}</button>)}</div><div className="sg91-refactor-flow"><article><small>ANTES</small><code>{item[1]}</code></article><ArrowRight/><article><small>DEPOIS</small><code>{item[2]}</code></article></div><div className="sg91-checklist">{['verbo', 'intenção', 'retorno', 'necessidade', 'nomes', 'ordem', 'tipos', 'boolean', 'quantidade', 'leitura sem corpo'].map((check, index) => <span key={check}><b>{index + 1}</b>{check}</span>)}</div></section>;
}

const DOMAINS = [
  ['Pedido', 'PedidoAssinaturaProfissional.java', ORDER_PROGRAM, 'total, desconto e saída têm contratos separados'],
  ['Cliente', 'ClienteAssinaturaProfissional.java', CLIENT_PROGRAM, 'normalização específica e validação expressiva'],
  ['Produto', 'ProdutoAssinaturaProfissional.java', PRODUCT_PROGRAM, 'produtoDisponivelParaVenda comunica regra de negócio'],
  ['Pagamento', 'PagamentoAssinaturaProfissional.java', PAYMENT_PROGRAM, 'arredondar, processar e imprimir são etapas distintas'],
  ['OS', 'OrdemServicoAssinaturaProfissional.java', SERVICE_ORDER_PROGRAM, 'início implícito em hoje e destino no agendamento'],
  ['Mensageria', 'MensageriaAssinaturaProfissional.java', MESSAGING_PROGRAM, 'canal, cliente e certificado aparecem no nome'],
  ['Auditoria', 'AuditoriaAssinaturaProfissional.java', AUDIT_PROGRAM, 'cinco parâmetros claros ainda revelam cheiro de record'],
];
function DomainsLab() {
  const [selected, setSelected] = useState(0); const item = DOMAINS[selected];
  return <section className="sg91-stack"><div className="ln73-domains sg91-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>LINGUAGEM DO DOMÍNIO</small><h3>{item[0]}</h3><p>{item[3]}.</p><div><strong>Leia sem abrir o corpo</strong><span>nome, tipos, ordem e retorno antecipam a história?</span></div></article></div><CodePanel name={item[1]} code={item[2]}/></section>;
}

const ERRORS = [
  ['Nome genérico', 'processar() não diz o que será processado.', 'Use verbo e conceito do domínio.'], ['Abreviação', 'calcTot, vlr e qtd transferem custo ao leitor.', 'Prefira clareza a economia de caracteres.'],
  ['Parâmetro sem significado', 'a, b e c obrigam abrir o corpo.', 'Nomeie pelo papel: precoUnitario e quantidade.'], ['Boolean misterioso', 'gerarRelatorio(true) não explica a escolha.', 'Use enum ou método específico.'],
  ['void para cálculo', 'o resultado fica preso em println.', 'Retorne o cálculo e separe a impressão.'], ['Retorno genérico', 'Object esconde o tipo real conhecido.', 'Retorne String, BigDecimal, record ou outro tipo preciso.'],
  ['Promessa quebrada', 'validar também imprime, salva e calcula.', 'Faça o corpo cumprir uma responsabilidade.'], ['Ordem confusa', 'dataFinal vem antes de dataInicial.', 'Use ordem natural: início e fim.'],
  ['Parâmetros demais', 'a chamada vira uma lista frágil.', 'Reconheça o conceito faltante e planeje agrupamento.'], ['Corpo ruim', 'assinatura bonita mascara implementação incoerente.', 'Depure e prove que o corpo cumpre o contrato.'],
];
function ErrorsClinic() {
  const [selected, setSelected] = useState(0); const item = ERRORS[selected];
  return <section className="ln73-errors sg91-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20}/><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16}/><strong>Correção:</strong> {item[2]}</p></article></section>;
}

const CHECKS = ['nove fontes criadas', 'assinaturas lidas sem corpo', 'verbos combinam com retorno', 'tipos representam domínio', 'ordem natural conferida', 'boolean trocado por enum', 'null documentado pelo comportamento', 'parâmetros demais registrados', 'breakpoints em três métodos', 'saídas conferidas', 'git diff revisado', '.class ignorado'];
function DeliveryLab() {
  const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = ['javac *.java', 'java AssinaturaRuim', 'java AssinaturaBoa', 'java PedidoAssinaturaProfissional'].join('\n');
  return <section className="ln73-delivery"><div className="ln73-terminal"><header><Terminal size={15}/>Compilar a oficina<CopyButton value={commands}/></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_GOOD}{'\n'}{EXPECTED_GOOD}{'\n'}{EXPECTED_ORDER}</span></pre></div><section className="ln73-debug"><header><Play size={18}/><strong>Debug: nomes guiam a inspeção</strong></header><div><article><span>1</span><strong>calcularTotalComDesconto</strong><p>entrada e enum.</p></article><article><span>2</span><strong>calcularTotal</strong><p>parâmetros e retorno.</p></article><article><span>3</span><strong>aplicarPercentualDesconto</strong><p>fator e resultado.</p></article><article><span>4</span><strong>comparar com p</strong><p>custo dos nomes ruins.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14}/> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22}/><h3>Desafio: desenhe o contrato antes do corpo</h3></div><p>Escolha um método de pedido, cliente ou OS e responda às dez perguntas do checklist antes de implementá-lo.</p><ul><li>Escreva uma chamada que se explique sozinha.</li><li>Escolha tipo e ordem pelo domínio.</li><li>Defina retorno, efeito e política de null.</li><li>Compile e depure parâmetros e retorno.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16}/>README.md · evidências<CopyButton value={EVIDENCE}/></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { anatomy: AnatomyLab, verbs: VerbLab, parameters: ParameterLab, boolean: BooleanLab, compare: CompareLab, refactor: RefactorLab, domains: DomainsLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component/> : null; }
const steps = [
  { id: 'anatomy', label: 'Anatomia do Contrato', duration: '12 min', eyebrow: 'ASSINATURA ANTES DO CORPO', title: 'Leia visibilidade, vínculo, retorno, nome, parâmetros e falha', blocks: [{ type: 'lead', text: 'Uma assinatura profissional antecipa como chamar, o que fornecer, o que esperar e qual responsabilidade o método promete.' }, { type: 'anatomy' }] },
  { id: 'verbs', label: 'Verbo e Retorno', duration: '12 min', eyebrow: 'PROMESSA COERENTE', title: 'Faça calcular, validar, imprimir e montar dizerem a verdade', blocks: [{ type: 'lead', text: 'O verbo cria expectativa: cálculo devolve valor, impressão executa ação e conversão entrega outra representação.' }, { type: 'verbs' }] },
  { id: 'parameters', label: 'Parâmetros Profissionais', duration: '15 min', eyebrow: 'NOME, TIPO, ORDEM E NECESSIDADE', title: 'Modele cada entrada para que a chamada continue legível', blocks: [{ type: 'lead', text: 'Parâmetro bom representa o dado, tem nome de domínio, aparece em ordem natural e só existe quando a responsabilidade precisa dele.' }, { type: 'parameters' }] },
  { id: 'boolean', label: 'Boolean e Null', duration: '12 min', eyebrow: 'CONTRATOS QUE A SINTAXE NÃO EXPLICA', title: 'Remova o true misterioso e declare uma política consistente', blocks: [{ type: 'lead', text: 'Enum e métodos específicos explicam escolhas; nomes e comportamento consistente explicam se null vira vazio ou erro.' }, { type: 'boolean' }] },
  { id: 'compare', label: 'Ruim versus Boa', duration: '16 min', eyebrow: 'MESMO RESULTADO, OUTRA LEITURA', title: 'Compare p(a, b, true) com uma assinatura de domínio', blocks: [{ type: 'lead', text: 'A implementação pode produzir o mesmo número, mas a assinatura boa reduz perguntas antes do primeiro breakpoint.' }, { type: 'compare' }] },
  { id: 'refactor', label: 'Quatro Refatorações', duration: '14 min', eyebrow: 'CHECKLIST EM AÇÃO', title: 'Refatore nome, boolean, void e excesso de parâmetros', blocks: [{ type: 'lead', text: 'Cada mudança corrige um contrato observável e deixa explícito o que ainda é evolução futura.' }, { type: 'refactor' }] },
  { id: 'domains', label: 'Sete Domínios', duration: '24 min', eyebrow: 'LINGUAGEM PROFISSIONAL APLICADA', title: 'Leia e execute assinaturas de pedido a auditoria', blocks: [{ type: 'lead', text: 'Sete programas completos mostram como nomes, tipos, ordem e retorno mudam conforme o domínio sem antecipar arquitetura.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Encontre o custo escondido em chamadas aparentemente curtas', blocks: [{ type: 'lead', text: 'Abreviação, Object, boolean, void e ordem confusa são sinais concretos de contratos que obrigam o leitor a investigar.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '35 min', eyebrow: 'NOVE FONTES, DEBUG E GIT', title: 'Compile os exemplos e prove que o corpo cumpre a assinatura', blocks: [{ type: 'lead', text: 'A entrega fecha com compilação real, saídas previsíveis, breakpoints em parâmetros e retornos e revisão limpa do repositório.' }, { type: 'delivery' }] },
];

export default function GuidedProfessionalSignatureLesson091({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]);
  const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); };
  return <article className="guided-git-lesson guided-professional-signature-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Braces size={17}/>Laboratório de contratos legíveis</span><p className="guided-sequence">091 · M3.02</p><h1>Faça a assinatura explicar o método antes do corpo</h1><p>Combine verbo, retorno, tipos, nomes e ordem para transformar chamadas em linguagem de domínio.</p></div><div className="guided-hero-status"><GitCompareArrows size={42}/><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 091" items={[{ value: '10 perguntas', label: 'Checklist de contrato' }, { value: '9 programas', label: 'Compilados de verdade' }, { value: '7 domínios', label: 'Com linguagem específica' }]}/><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 091"><div className="guided-step-nav-title"><ListChecks size={18}/>Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14}/> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16}/>Desmarcar etapa</> : <><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Contratos legíveis antes do corpo</h3><p>{lessonComplete ? 'Aula concluída e pronta para estudar coesão.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 090</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18}/><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>nome, tipos, ordem e retorno</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 092<ArrowRight size={17}/></button></footer></article>;
}
