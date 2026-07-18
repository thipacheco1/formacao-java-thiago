import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, Braces, Check, CheckCircle2, Clock3, Copy, FileCode2, GitBranch, Lightbulb, ListChecks, Play, RotateCcw, ShieldCheck, Sparkles, Terminal, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedProfessionalEnumLesson.css';

const STORAGE_KEY = 'guided-professional-enum-lesson-076-progress';
const MAIN_PROGRAM = [
  'public class LaboratorioEnum {',
  '    enum StatusPedido {',
  '        PENDENTE("P", "Pendente", false, true),',
  '        APROVADO("A", "Aprovado", false, true),',
  '        RECUSADO("R", "Recusado", true, false),',
  '        CANCELADO("C", "Cancelado", true, false);',
  '',
  '        private final String codigo;',
  '        private final String descricao;',
  '        private final boolean finalizado;',
  '        private final boolean permiteCancelamento;',
  '',
  '        StatusPedido(String codigo, String descricao,',
  '                     boolean finalizado, boolean permiteCancelamento) {',
  '            this.codigo = codigo;',
  '            this.descricao = descricao;',
  '            this.finalizado = finalizado;',
  '            this.permiteCancelamento = permiteCancelamento;',
  '        }',
  '',
  '        public String getCodigo() { return codigo; }',
  '        public String getDescricao() { return descricao; }',
  '        public boolean isFinalizado() { return finalizado; }',
  '        public boolean permiteCancelamento() { return permiteCancelamento; }',
  '',
  '        public static StatusPedido fromCode(String codigo) {',
  '            if (codigo == null || codigo.isBlank()) {',
  '                throw new IllegalArgumentException(',
  '                        "Codigo do status e obrigatorio.");',
  '            }',
  '            for (StatusPedido status : values()) {',
  '                if (status.codigo.equalsIgnoreCase(codigo.trim())) {',
  '                    return status;',
  '                }',
  '            }',
  '            throw new IllegalArgumentException(',
  '                    "Codigo de status invalido: " + codigo);',
  '        }',
  '    }',
  '',
  '    public static void main(String[] args) {',
  '        StatusPedido status = StatusPedido.fromCode(" a ");',
  '        System.out.println("constante: " + status.name());',
  '        System.out.println("codigo: " + status.getCodigo());',
  '        System.out.println("descricao: " + status.getDescricao());',
  '        System.out.println("finalizado: " + status.isFinalizado());',
  '        System.out.println("cancela: " + status.permiteCancelamento());',
  '        System.out.println("comparacao: " + (status == StatusPedido.APROVADO));',
  '        System.out.println("mensagem: " + mensagem(status));',
  '        System.out.println("valueOf exato: "',
  '                + StatusPedido.valueOf("APROVADO"));',
  '        System.out.println("ordinal instavel: " + status.ordinal());',
  '',
  '        StringBuilder opcoes = new StringBuilder();',
  '        for (StatusPedido item : StatusPedido.values()) {',
  '            if (!opcoes.isEmpty()) opcoes.append(" | ");',
  '            opcoes.append(item.getCodigo()).append(":")',
  '                    .append(item.getDescricao());',
  '        }',
  '        System.out.println("opcoes: " + opcoes);',
  '',
  '        testarEntrada("X");',
  '        testarValueOf("aprovado");',
  '    }',
  '',
  '    static String mensagem(StatusPedido status) {',
  '        if (status == null) throw new IllegalArgumentException("Status obrigatório.");',
  '        return switch (status) {',
  '            case PENDENTE -> "Aguardando análise";',
  '            case APROVADO -> "Pedido aprovado";',
  '            case RECUSADO -> "Pedido recusado";',
  '            case CANCELADO -> "Pedido cancelado";',
  '        };',
  '    }',
  '',
  '    static void testarEntrada(String codigo) {',
  '        try { StatusPedido.fromCode(codigo); }',
  '        catch (IllegalArgumentException erro) {',
  '            System.out.println("fromCode: " + erro.getMessage());',
  '        }',
  '    }',
  '',
  '    static void testarValueOf(String nome) {',
  '        try { StatusPedido.valueOf(nome); }',
  '        catch (IllegalArgumentException erro) {',
  '            System.out.println("valueOf rejeitou: " + nome);',
  '        }',
  '    }',
  '}',
].join('\n');
const EXPECTED_OUTPUT = [
  'constante: APROVADO',
  'codigo: A',
  'descricao: Aprovado',
  'finalizado: false',
  'cancela: true',
  'comparacao: true',
  'mensagem: Pedido aprovado',
  'valueOf exato: APROVADO',
  'ordinal instavel: 1',
  'opcoes: P:Pendente | A:Aprovado | R:Recusado | C:Cancelado',
  'fromCode: Codigo de status invalido: X',
  'valueOf rejeitou: aprovado',
].join('\n');
const EVIDENCE = [
  '# Aula 076 — Enum profissional', '',
  '- [ ] Substituí strings mágicas por tipo controlado',
  '- [ ] Separei o enum em arquivo próprio no laboratório',
  '- [ ] Modelei código, descrição e flags finais',
  '- [ ] Comparei constantes com ==',
  '- [ ] Usei switch expression exaustivo',
  '- [ ] Percorri constants com values',
  '- [ ] Diferenciei valueOf de fromCode',
  '- [ ] Rejeitei null, vazio e código desconhecido',
  '- [ ] Expliquei riscos de name, ordinal e toString',
  '- [ ] Mantive comportamento pequeno e coeso',
  '- [ ] Apliquei enum em sete domínios',
  '- [ ] Compilei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16} />{name}<CopyButton value={code} /></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

const MAGIC = ['APROVADO', 'Aprovado', 'aprovado', 'APROVADA', 'APPROVED'];
function TypeGateLab() {
  const [enumMode, setEnumMode] = useState(false); const [selected, setSelected] = useState(0);
  const code = enumMode ? ['StatusPedido status = StatusPedido.APROVADO;', 'if (status == StatusPedido.APROVADO) {', '    System.out.println("Pedido aprovado.");', '}'].join('\n') : ['String status = "' + MAGIC[selected] + '";', 'if ("APROVADO".equals(status)) {', '    System.out.println("Pedido aprovado.");', '}'].join('\n');
  return <section className="en76-stack"><div className="en76-mode"><button type="button" className={!enumMode ? 'active danger' : ''} onClick={() => setEnumMode(false)}>String solta</button><button type="button" className={enumMode ? 'active safe' : ''} onClick={() => setEnumMode(true)}>Tipo enum</button></div>{enumMode ? <div className="en76-type-gate"><ShieldCheck size={38} /><div><small>CONJUNTO FECHADO</small><strong>PENDENTE · APROVADO · RECUSADO</strong><span>autocomplete + compilador + refatoração segura</span></div></div> : <div className="en76-magic-grid">{MAGIC.map((item, index) => <button type="button" key={item} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{item}<small>{index === 0 ? 'aceito' : 'variação acidental'}</small></button>)}</div>}<CodePanel name="Da string mágica ao tipo controlado" code={code} /><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Use enum para conjuntos fixos</strong><p>Status, perfil, prioridade e tipo controlado são bons candidatos. Produtos, clientes e cadastros que mudam sem deploy não são.</p></div></aside></section>;
}

function AnatomyLab() {
  const [selected, setSelected] = useState('constant');
  const details = { constant: ['CONSTANTE', 'APROVADO("A", "Aprovado", false)', 'um dos objetos únicos criados pelo Java'], fields: ['ATRIBUTOS FINAIS', 'codigo · descricao · finalizado', 'dados estáveis associados a cada constante'], constructor: ['CONSTRUTOR', 'StatusPedido(String, String, boolean)', 'chamado pelas constantes; nunca com new'], getters: ['MÉTODOS', 'getCodigo · getDescricao · isFinalizado', 'leitura e comportamento pequeno do próprio valor'] };
  const item = details[selected];
  const code = ['public enum StatusPedido {', '    PENDENTE("P", "Pendente", false),', '    APROVADO("A", "Aprovado", false),', '    RECUSADO("R", "Recusado", true);', '', '    private final String codigo;', '    private final String descricao;', '    private final boolean finalizado;', '', '    StatusPedido(String codigo, String descricao, boolean finalizado) {', '        this.codigo = codigo;', '        this.descricao = descricao;', '        this.finalizado = finalizado;', '    }', '', '    public String getCodigo() { return codigo; }', '    public String getDescricao() { return descricao; }', '    public boolean isFinalizado() { return finalizado; }', '}'].join('\n');
  return <section className="en76-stack"><div className="en76-anatomy"><div>{Object.keys(details).map(key => <button type="button" key={key} className={selected === key ? 'active' : ''} onClick={() => setSelected(key)}>{details[key][0]}</button>)}</div><article><small>{item[0]}</small><strong>{item[1]}</strong><p>{item[2]}.</p></article></div><CodePanel name="StatusPedido.java · arquivo próprio" code={code} /><p className="ln73-format-proof">O construtor do enum não pode ser público. Atributos normalmente são <strong>private final</strong> porque cada constante deve permanecer estável.</p></section>;
}

const SWITCH_STATUS = ['PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO'];
function BehaviorLab() {
  const [status, setStatus] = useState('PENDENTE');
  const info = { PENDENTE: ['Aguardando análise', true, false], APROVADO: ['Pedido aprovado', true, false], RECUSADO: ['Pedido recusado', false, true], CANCELADO: ['Pedido cancelado', false, true] }[status];
  const code = ['static String mensagem(StatusPedido status) {', '    return switch (status) {', '        case PENDENTE -> "Aguardando análise";', '        case APROVADO -> "Pedido aprovado";', '        case RECUSADO -> "Pedido recusado";', '        case CANCELADO -> "Pedido cancelado";', '    };', '}', '', 'boolean permiteCancelamento() {', '    return this == PENDENTE || this == APROVADO;', '}'].join('\n');
  return <section className="en76-stack"><div className="en76-state-board"><div>{SWITCH_STATUS.map(item => <button type="button" key={item} className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>{item}</button>)}</div><article><GitBranch size={30} /><small>SWITCH EXAUSTIVO</small><strong>{info[0]}</strong><span>cancelável: {String(info[1])} · finalizado: {String(info[2])}</span></article></div><CodePanel name="Switch moderno e comportamento coeso" code={code} /><aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Enum não é uma camada de serviço</strong><p>Código, descrição, flags, conversão e métodos pequenos cabem aqui. Banco, HTTP e regras enormes pertencem a outras classes.</p></div></aside></section>;
}

const NATIVE_TOOLS = [
  ['values()', 'lista todas as constantes', 'combo, documentação e busca controlada'],
  ['valueOf("APROVADO")', 'exige o name exato', 'entrada interna já normalizada'],
  ['name()', 'retorna APROVADO', 'renomear pode quebrar contrato persistido'],
  ['ordinal()', 'retorna a posição', 'nunca use como banco, API ou regra'],
  ['toString()', 'texto de concatenação/log', 'não assuma como contrato externo'],
];
function NativeToolsLab() {
  const [selected, setSelected] = useState(0); const [reordered, setReordered] = useState(false); const item = NATIVE_TOOLS[selected];
  const order = reordered ? ['PENDENTE', 'RECUSADO', 'APROVADO'] : ['PENDENTE', 'APROVADO', 'RECUSADO'];
  return <section className="en76-stack"><div className="en76-native"><div>{NATIVE_TOOLS.map((tool, index) => <button type="button" key={tool[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><code>{tool[0]}</code><small>{tool[1]}</small></button>)}</div><article><small>LEITURA PROFISSIONAL</small><strong>{item[0]}</strong><p>{item[2]}.</p></article></div><div className="en76-ordinal"><header><strong>Simulador do perigo do ordinal</strong><button type="button" onClick={() => setReordered(value => !value)}>{reordered ? 'Restaurar ordem' : 'Trocar ordem'}</button></header><div>{order.map((value, index) => <span key={value}><b>{index}</b>{value}</span>)}</div><p>APROVADO mudou de ordinal sem mudar de significado. Código explícito não sofre esse deslocamento.</p></div></section>;
}

const INPUTS = ['A', ' a ', 'P', 'X', '', 'APROVADO'];
function FromCodeLab() {
  const [input, setInput] = useState('A'); const normalized = input.trim().toUpperCase(); const found = { A: 'APROVADO', P: 'PENDENTE', R: 'RECUSADO' }[normalized]; const empty = !normalized;
  const code = ['public static StatusPedido fromCode(String codigo) {', '    if (codigo == null || codigo.isBlank()) {', '        throw new IllegalArgumentException("Código obrigatório.");', '    }', '    for (StatusPedido status : values()) {', '        if (status.codigo.equalsIgnoreCase(codigo.trim())) {', '            return status;', '        }', '    }', '    throw new IllegalArgumentException("Código inválido: " + codigo);', '}'].join('\n');
  return <section className="en76-stack"><div className="ln73-parse-cases">{INPUTS.map(value => <button type="button" key={value || 'blank'} className={input === value ? 'active' : ''} onClick={() => setInput(value)}>{value || '(vazio)'}</button>)}</div><div className="ln73-parse-flow"><article><small>ENTRADA EXTERNA</small><strong>"{input}"</strong></article><ArrowRight /><article><small>NORMALIZAÇÃO</small><code>trim + regra de caixa</code></article><ArrowRight /><article className={found ? 'safe' : 'danger'}><small>RESULTADO</small><strong>{found || (empty ? 'código obrigatório' : 'código inválido')}</strong></article></div><CodePanel name="fromCode obrigatório e explícito" code={code} /><p className="ln73-format-proof"><strong>valueOf</strong> trabalha com o nome exato da constante. <strong>fromCode</strong> traduz um contrato externo deliberado e lança erro claro; retornar null só adia o defeito.</p></section>;
}

function BoundaryLab() {
  const [caseId, setCaseId] = useState(0);
  const cases = [
    ['String mágica', 'pedido.status = "APROVADO"', 'StatusPedido.APROVADO', 'compilador protege o conjunto'],
    ['Código externo', 'if ("A".equals(codigo))', 'StatusPedido.fromCode(codigo)', 'conversão centralizada'],
    ['Descrição duplicada', 'switch em várias telas', 'status.getDescricao()', 'texto associado ao valor'],
    ['Contrato persistido', 'status.ordinal()', 'status.getCodigo()', 'ordem pode mudar; código é explícito'],
  ]; const item = cases[caseId];
  return <section className="en76-stack"><div className="en76-refactor-tabs">{cases.map((entry, index) => <button type="button" key={entry[0]} className={caseId === index ? 'active' : ''} onClick={() => setCaseId(index)}>{entry[0]}</button>)}</div><div className="en76-refactor"><article><small>ANTES</small><code>{item[1]}</code></article><ArrowRight /><article className="safe"><small>DEPOIS</small><code>{item[2]}</code><span>{item[3]}</span></article></div><aside className="guided-note info"><Lightbulb size={20} /><div><strong>Nem tudo que parece lista é enum</strong><p>Se usuário cadastra valores, a lista muda sem deploy ou vem de configuração dinâmica, modele como dado persistido.</p></div></aside></section>;
}

const DOMAINS = [
  ['Cliente', 'PF / PJ', 'TipoCliente.fromCode traduz o cadastro externo'],
  ['Produto', 'ATIVO / INATIVO / BLOQUEADO', 'flag podeVender fica junto do status'],
  ['Pedido', 'PENDENTE → APROVADO', 'transição valida o estado atual'],
  ['Pagamento', 'PENDENTE / CONFIRMADO / ESTORNADO', 'switch exaustivo cria mensagem'],
  ['Ordem de serviço', 'ABE / CON / CAN / REA', 'código, descrição e reagendamento'],
  ['Mensageria', 'BOAS_VINDAS / ENTREGA / NPS', 'tipo informa se gera ocorrência'],
  ['Auditoria', 'CRIACAO / EDICAO / APROVACAO', 'operação controlada junto do Instant'],
];
function DomainLab() { const [selected, setSelected] = useState(0); const item = DOMAINS[selected]; return <section className="ln73-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>ENUM NO DOMÍNIO</small><h3>{item[0]}</h3><code>{item[1]}</code><p>{item[2]}.</p><div><strong>Teste de adequação</strong><span>Os valores são finitos, conhecidos e alterados junto de uma nova versão do código?</span></div></article></section>; }

const ERRORS = [
  ['String para status fixo', 'Digitação cria estados que o domínio não conhece.', 'Use um enum controlado.'],
  ['ordinal como código', 'Reordenar constantes altera banco e API.', 'Crie código explícito e estável.'],
  ['valueOf na entrada', 'Caixa, espaço ou nome diferente quebram em runtime.', 'Traduza com fromCode validado.'],
  ['Enum null', 'Método ou switch quebra sem mensagem de domínio.', 'Valide obrigatoriedade na fronteira.'],
  ['Regra gigante no enum', 'Tipo passa a acessar banco e serviços.', 'Mova orquestração para classe própria.'],
  ['name persistido sem pensar', 'Renomear constante rompe dados antigos.', 'Defina contrato de persistência explícito.'],
  ['toString como contrato', 'Mudança de apresentação quebra integração.', 'Use código/getDescricao conforme a fronteira.'],
  ['Descrição em switches', 'Texto diverge entre várias classes.', 'Centralize o atributo descricao.'],
  ['Conversão espalhada', 'Cada chamador aceita códigos diferentes.', 'Centralize fromCode.'],
  ['Dado dinâmico como enum', 'Nova opção exige deploy desnecessário.', 'Modele cadastro configurável no banco.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors en76-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20} /><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16} /><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['strings mágicas foram removidas','constantes formaram conjunto fechado','atributos ficaram private final','switch cobriu quatro estados','values listou opções','valueOf exato foi demonstrado','fromCode normalizou e validou','ordinal foi tratado como instável','comportamento permaneceu pequeno','sete domínios foram justificados'];
function DeliveryLab() {
  const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const commands = ['mkdir labs\\m2\\aula-076-enum-profissional', 'cd labs\\m2\\aula-076-enum-profissional', 'javac LaboratorioEnum.java', 'java LaboratorioEnum'].join('\n');
  return <section className="ln73-delivery"><CodePanel name="LaboratorioEnum.java" code={MAIN_PROGRAM} /><div className="ln73-terminal"><header><Terminal size={15} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18} /><strong>Debug: acompanhe fromCode por dentro</strong></header><div><article><span>1</span><strong>Breakpoint</strong><p>Pare no for que percorre values().</p></article><article><span>2</span><strong>Constante</strong><p>Veja PENDENTE, depois APROVADO.</p></article><article><span>3</span><strong>Atributos</strong><p>Compare codigo, descricao e flags.</p></article><article><span>4</span><strong>Retorno</strong><p>A entrada “ a ” produz APROVADO.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: fluxo de uma ordem de serviço</h3></div><p>Crie StatusOs em arquivo próprio com código, descrição, flag final e reagendamento; traduza códigos externos e proteja transições.</p><ul><li>Liste opções com values sem expor ordinal.</li><li>Demonstre valueOf válido e inválido separadamente.</li><li>Recuse null, vazio e código desconhecido.</li><li>Explique no README por que banco e HTTP não entram no enum.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { gate: TypeGateLab, anatomy: AnatomyLab, behavior: BehaviorLab, native: NativeToolsLab, fromCode: FromCodeLab, boundary: BoundaryLab, domains: DomainLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component /> : null; }
const steps = [
  { id: 'gate', label: 'Strings Mágicas', duration: '11 min', eyebrow: 'CONJUNTO FECHADO', title: 'Deixe o tipo impedir estados inventados', blocks: [{ type: 'lead', text: 'String aceita qualquer grafia. Enum dá nome ao conjunto fixo, ativa autocomplete e transforma variações acidentais em erro de compilação.' }, { type: 'gate' }] },
  { id: 'anatomy', label: 'Anatomia do Enum', duration: '13 min', eyebrow: 'CONSTANTES, DADOS E CONSTRUTOR', title: 'Construa constantes estáveis com código e descrição', blocks: [{ type: 'lead', text: 'Um enum profissional pode morar em arquivo próprio, ter atributos finais, construtor não público e métodos de leitura.' }, { type: 'anatomy' }] },
  { id: 'behavior', label: 'Switch e Comportamento', duration: '12 min', eyebrow: 'DECISÃO EXAUSTIVA', title: 'Mantenha mensagens e flags perto do valor', blocks: [{ type: 'lead', text: 'Switch tradicional funciona; switch expression é mais direto e força cobertura. Comportamentos pequenos eliminam condicionais repetidas.' }, { type: 'behavior' }] },
  { id: 'native', label: 'API Nativa do Enum', duration: '12 min', eyebrow: 'VALUES, VALUEOF, NAME E ORDINAL', title: 'Saiba o que cada método promete — e o que não promete', blocks: [{ type: 'lead', text: 'values lista constantes; valueOf exige name exato; name e toString podem vazar contrato; ordinal nunca deve ser persistência.' }, { type: 'native' }] },
  { id: 'fromCode', label: 'fromCode Seguro', duration: '13 min', eyebrow: 'ENTRADA EXTERNA VALIDADA', title: 'Traduza código externo sem retornar null', blocks: [{ type: 'lead', text: 'fromCode centraliza normalização, busca e erro de domínio. Tolerância de espaços e caixa deve seguir o contrato real.' }, { type: 'fromCode' }] },
  { id: 'boundary', label: 'Refatoração e Limites', duration: '11 min', eyebrow: 'CONTRATO EXPLÍCITO', title: 'Troque duplicação por uma fronteira central', blocks: [{ type: 'lead', text: 'Status, código e descrição deixam de ficar espalhados. Dados dinâmicos e regras de serviço continuam fora do enum.' }, { type: 'boundary' }] },
  { id: 'domains', label: 'Enum no Backend', duration: '13 min', eyebrow: 'SETE DOMÍNIOS', title: 'Modele tipos, status e operações controladas', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria mostram decisões diferentes para o mesmo recurso da linguagem.' }, { type: 'domains' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Encontre o contrato frágil escondido no enum', blocks: [{ type: 'lead', text: 'String, ordinal, valueOf, null, name, toString e dados dinâmicos falham por razões diferentes.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '27 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove o contrato com compilação e entradas hostis', blocks: [{ type: 'lead', text: 'Compile o laboratório, confira doze saídas, depure values/fromCode e entregue um fluxo de OS sem strings mágicas.' }, { type: 'delivery' }] },
];
export default function GuidedProfessionalEnumLesson076({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false);
  const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]);
  useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]);
  useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]);
  const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone;
  const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); };
  return <article className="guided-git-lesson guided-professional-enum-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Braces size={17} />Oficina de valores controlados</span><p className="guided-sequence">076 · M2.15</p><h1>Enum profissional</h1><p>Substitua strings mágicas por tipos seguros, traduza códigos externos e mantenha contratos explícitos no domínio.</p></div><div className="guided-hero-status"><Clock3 size={42} /><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 076" items={[{ value: '1 tipo', label: 'Com quatro constantes seguras' }, { value: '7 domínios', label: 'Sem strings mágicas' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 076"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item,index)=><button type="button" key={item.id} className={(index===activeIndex?'active ':'')+(completedSteps.has(item.id)?'done':'')} onClick={()=>selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id)?<Check size={14}/>:String(index+1).padStart(2,'0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block,index)=><ContentBlock key={block.type+'-'+index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex===0} onClick={()=>selectStep(activeIndex-1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle '+(stepDone?'undo':'complete')} onClick={toggleStep}>{stepDone?<><RotateCcw size={16}/>Desmarcar etapa</>:<><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex<steps.length-1&&<button type="button" className="primary" disabled={!stepDone} onClick={()=>selectStep(activeIndex+1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone&&<section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Valores controlados pelo tipo</h3><p>{lessonComplete?'Aula concluída e pronta para Records.':'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete?'Reabrir aula':'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 075</button><div className={'guided-course-status '+(lessonComplete?'completed':allStepsDone?'ready':'')}><Clock3 size={18}/><span><strong>{lessonComplete?'Aula concluída':completedSteps.size+' de '+steps.length+' etapas'}</strong><small>constantes, fromCode e contratos</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson||!lessonComplete}>Aula 077<ArrowRight size={17}/></button></footer></article>;
}
