import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2, ClipboardList, Clock3, Copy, FileCode2, GitBranch, ListChecks, Play, RotateCcw, Sparkles, StepForward, Terminal, Workflow } from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedPaperModelingLesson.css';

const STORAGE_KEY = 'guided-paper-modeling-lesson-106-progress';
const OS_SOURCE = `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class ModelagemOs {
    public static void main(String[] args) {
        OrdemServico os = new OrdemServico(
                "OS-001", "Ana Silva", StatusOs.ABERTA,
                LocalDate.now().minusDays(5), 1);
        LocalDate hoje = LocalDate.now();
        System.out.println("Certificado: " + os.certificado());
        System.out.println("Cliente: " + os.cliente());
        System.out.println("Status: " + os.status());
        System.out.println("Dias em aberto: " + os.diasEmAberto(hoje));
        System.out.println("Atrasada: " + os.atrasada(hoje));
        System.out.println("Encerrada: " + os.encerrada());
        System.out.println("Fila sugerida: " + os.filaSugerida(hoje));
    }
}

enum StatusOs { ABERTA, AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }
enum FilaAtendimento { ENTRADA, REAGENDAMENTO, CASOS_CRITICOS, SEM_FILA }

class OrdemServico {
    private final String certificado;
    private final String cliente;
    private final StatusOs status;
    private final LocalDate dataAbertura;
    private final int quantidadeReagendamentos;

    OrdemServico(String certificado, String cliente, StatusOs status,
            LocalDate dataAbertura, int quantidadeReagendamentos) {
        this.certificado = certificado;
        this.cliente = cliente;
        this.status = status;
        this.dataAbertura = dataAbertura;
        this.quantidadeReagendamentos = quantidadeReagendamentos;
    }

    String certificado() { return certificado; }
    String cliente() { return cliente; }
    StatusOs status() { return status; }

    long diasEmAberto(LocalDate dataReferencia) {
        long dias = ChronoUnit.DAYS.between(dataAbertura, dataReferencia);
        return dias < 0 ? 0 : dias;
    }

    boolean atrasada(LocalDate dataReferencia) {
        return diasEmAberto(dataReferencia) > 3;
    }

    boolean encerrada() {
        return status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA;
    }

    boolean precisaReagendamento() {
        return quantidadeReagendamentos >= 2;
    }

    FilaAtendimento filaSugerida(LocalDate dataReferencia) {
        if (encerrada()) return FilaAtendimento.SEM_FILA;
        if (atrasada(dataReferencia)) return FilaAtendimento.CASOS_CRITICOS;
        if (precisaReagendamento()) return FilaAtendimento.REAGENDAMENTO;
        return FilaAtendimento.ENTRADA;
    }
}`;

const ORDER_SOURCE = `import java.math.BigDecimal;

public class ModelagemPedido {
    public static void main(String[] args) {
        Pedido pedido = new Pedido(
                "Ana Silva", "Cadeira", new BigDecimal("199.90"), 2);
        System.out.println("Cliente: " + pedido.cliente());
        System.out.println("Produto: " + pedido.produto());
        System.out.println("Válido: " + pedido.valido());
        System.out.println("Total bruto: " + pedido.totalBruto());
        System.out.println("Desconto: " + pedido.desconto());
        System.out.println("Total final: " + pedido.totalFinal());
    }
}

class Pedido {
    private final String cliente;
    private final String produto;
    private final BigDecimal precoUnitario;
    private final int quantidade;

    Pedido(String cliente, String produto,
            BigDecimal precoUnitario, int quantidade) {
        this.cliente = cliente;
        this.produto = produto;
        this.precoUnitario = precoUnitario;
        this.quantidade = quantidade;
    }

    String cliente() { return cliente; }
    String produto() { return produto; }

    boolean valido() {
        return textoInformado(cliente) && textoInformado(produto)
                && precoUnitario != null
                && precoUnitario.compareTo(BigDecimal.ZERO) > 0
                && quantidade > 0;
    }

    BigDecimal totalBruto() {
        if (!valido()) return BigDecimal.ZERO;
        return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    BigDecimal desconto() {
        BigDecimal bruto = totalBruto();
        if (quantidade > 10) return bruto.multiply(new BigDecimal("0.15"));
        if (bruto.compareTo(new BigDecimal("300.00")) >= 0) {
            return bruto.multiply(new BigDecimal("0.10"));
        }
        return BigDecimal.ZERO;
    }

    BigDecimal totalFinal() {
        return totalBruto().subtract(desconto());
    }

    private boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }
}`;

const CLIENT_SOURCE = `public class ModelagemCliente {
    public static void main(String[] args) {
        Cliente ana = new Cliente(
                "Ana", "ana@email.com", "11999990000", true);
        Cliente bia = new Cliente(
                "Bia", "", "11988880000", false);
        imprimir(ana);
        imprimir(bia);
    }

    static void imprimir(Cliente cliente) {
        System.out.println(cliente.nome()
                + " | completo=" + cliente.contatoCompleto()
                + " | mensagem=" + cliente.podeReceberMensagem());
    }
}

class Cliente {
    private final String nome;
    private final String email;
    private final String telefone;
    private final boolean ativo;

    Cliente(String nome, String email, String telefone, boolean ativo) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.ativo = ativo;
    }

    String nome() { return nome; }

    boolean contatoCompleto() {
        return informado(email) && informado(telefone);
    }

    boolean podeReceberMensagem() {
        return ativo && informado(telefone);
    }

    private boolean informado(String valor) {
        return valor != null && !valor.isBlank();
    }
}`;

const TEST_SOURCE = `import java.math.BigDecimal;
import java.time.LocalDate;

public class TesteModelagemNoPapel {
    public static void main(String[] args) {
        LocalDate referencia = LocalDate.of(2026, 7, 18);
        OrdemServico normal = new OrdemServico(
                "OS-1", "Ana", StatusOs.ABERTA,
                referencia.minusDays(2), 0);
        OrdemServico atrasada = new OrdemServico(
                "OS-2", "Bia", StatusOs.ABERTA,
                referencia.minusDays(5), 1);
        OrdemServico encerrada = new OrdemServico(
                "OS-3", "Caio", StatusOs.CONCLUIDA,
                referencia.minusDays(8), 3);
        exigir(normal.filaSugerida(referencia) == FilaAtendimento.ENTRADA,
                "entrada");
        exigir(atrasada.filaSugerida(referencia)
                == FilaAtendimento.CASOS_CRITICOS, "críticos");
        exigir(encerrada.filaSugerida(referencia)
                == FilaAtendimento.SEM_FILA, "encerrada vence");
        exigir(encerrada.diasEmAberto(referencia) == 8, "dias");

        Pedido valido = new Pedido(
                "Ana", "Cadeira", new BigDecimal("199.90"), 2);
        Pedido atacado = new Pedido(
                "Ana", "Caneta", new BigDecimal("10.00"), 11);
        Pedido invalido = new Pedido("", "Caneta", BigDecimal.TEN, 1);
        exigir(valido.valido(), "pedido válido");
        exigir(valido.totalFinal().equals(new BigDecimal("359.8200")),
                "desconto 10%");
        exigir(atacado.desconto().equals(new BigDecimal("16.5000")),
                "desconto 15%");
        exigir(!invalido.valido(), "pedido inválido");
        exigir(invalido.totalBruto().equals(BigDecimal.ZERO), "total protegido");

        Cliente cliente = new Cliente(
                "Ana", "ana@email.com", "11999990000", true);
        exigir(cliente.contatoCompleto(), "contato completo");
        exigir(cliente.podeReceberMensagem(), "mensagem");
        System.out.println("TESTES OK: 11 evidências");
    }

    static void exigir(boolean condicao, String evidencia) {
        if (!condicao) throw new AssertionError(evidencia);
    }
}`;

const OS_STATEMENT = 'O sistema recebe uma Ordem de Serviço de um cliente. A OS possui certificado, status, data de abertura e quantidade de reagendamentos. Uma OS com mais de 3 dias em aberto é considerada atrasada. Uma OS atrasada deve ir para a fila de Casos Críticos. Uma OS com 2 ou mais reagendamentos deve ir para a fila de Reagendamento. OS concluída ou cancelada não deve ir para fila de atendimento.';

const ERRORS = [
  ['Codar antes de explicar', 'A IDE abre, mas ninguém consegue escrever as regras em texto objetivo.', 'Pare e produza descrição, candidatos, responsabilidades, regras e dúvidas.'],
  ['Classe para cada substantivo', 'Sistema, dado, tela, resultado e atendimento viram tipos sem propósito.', 'Trate substantivos como candidatos; exija conceito, estado, regra e nome do domínio.'],
  ['Método para cada verbo', 'receber, possuir e ir viram métodos artificiais na OrdemServico.', 'Traduza o verbo em responsabilidade e pergunte quem deve conhecê-la.'],
  ['Responsabilidades misturadas', 'Pedido lê Scanner, calcula total, imprime e salva no banco.', 'Separe domínio de entrada, apresentação e infraestrutura.'],
  ['Nome genérico', 'Manager, Processor, Helper e Dados escondem o problema real.', 'Prefira Pedido, OrdemServico, FilaAtendimento e outros termos do domínio.'],
  ['Regra longe do estado', 'Atraso é recalculado em vários mains com limites diferentes.', 'Centralize a pergunta atrasada em OrdemServico.'],
  ['Ordem de regras ignorada', 'OS concluída e atrasada vai para Casos Críticos.', 'Registre prioridade no papel e teste encerrada antes de atraso.'],
  ['Modelo tratado como definitivo', 'Uma hipótese inicial vira dogma mesmo após testes e novas regras.', 'Use modelo, código e testes como ciclo de aprendizagem e ajuste.'],
];

const EVIDENCE = `# Aula 106 — Modelagem no papel

- [ ] Percorri as oito etapas antes de codar
- [ ] Marquei substantivos, verbos e regras da OS
- [ ] Filtrei candidatos fortes, dados e valores controlados
- [ ] Distribuí responsabilidades de OS e enums
- [ ] Escrevi o rascunho completo da OS
- [ ] Criei e executei ModelagemOs.java
- [ ] Modelei Pedido antes de abrir o código
- [ ] Criei e executei ModelagemPedido.java
- [ ] Apliquei desconto de 15% acima de dez itens
- [ ] Diferenciei entidade, valor e serviço
- [ ] Auditei candidatos vagos e classes que fazem tudo
- [ ] Depurei OS e Pedido por comportamento
- [ ] Modelei e executei ModelagemCliente.java
- [ ] Executei TesteModelagemNoPapel
- [ ] Revisei Git, .class, dúvidas e decisões`;

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

function ProcessLab() {
  const [stage, setStage] = useState(0);
  const stages = [['Ler', 'entender o problema'], ['Substantivos', 'marcar conceitos e dados'], ['Verbos', 'marcar ações e perguntas'], ['Regras', 'escrever limites e prioridades'], ['Candidatos', 'filtrar classes e enums'], ['Responsabilidades', 'decidir quem sabe o quê'], ['Fluxo', 'rascunhar colaboração'], ['Código', 'testar a hipótese']];
  const current = stages[stage];
  return <section className="pm106-stack"><div className="pm106-process">{stages.map((item, index) => <button type="button" key={item[0]} className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}><span>{index < stage ? <Check size={14} /> : index + 1}</span><strong>{item[0]}</strong></button>)}</div><div className="pm106-focus"><Workflow /><div><small>ETAPA {stage + 1} DE {stages.length}</small><strong>{current[0]}</strong><span>{current[1]}. O resultado é uma hipótese clara o suficiente para ser implementada e testada.</span></div></div></section>;
}

function AnnotationLab() {
  const [lens, setLens] = useState('nouns');
  const items = lens === 'nouns'
    ? [['Ordem de Serviço', 'candidato forte'], ['cliente', 'candidato futuro'], ['certificado', 'dado/identidade'], ['status', 'valor controlado'], ['data de abertura', 'dado'], ['reagendamentos', 'dado'], ['fila', 'valor controlado']]
    : lens === 'verbs'
      ? [['recebe', 'borda do sistema'], ['possui', 'estado'], ['é atrasada', 'comportamento'], ['deve ir', 'decisão de fila'], ['não deve ir', 'prioridade de encerramento']]
      : [['mais de 3 dias', 'atrasada'], ['concluída/cancelada', 'SEM_FILA primeiro'], ['atrasada', 'CASOS_CRITICOS'], ['2+ reagendamentos', 'REAGENDAMENTO'], ['demais', 'ENTRADA']];
  return <section className="pm106-stack"><blockquote className="pm106-statement">{OS_STATEMENT}</blockquote><div className="pm106-lenses"><button type="button" className={lens === 'nouns' ? 'active' : ''} onClick={() => setLens('nouns')}>Substantivos</button><button type="button" className={lens === 'verbs' ? 'active' : ''} onClick={() => setLens('verbs')}>Verbos</button><button type="button" className={lens === 'rules' ? 'active' : ''} onClick={() => setLens('rules')}>Regras e prioridade</button></div><div className="pm106-annotations">{items.map((item, index) => <article key={item[0]}><span>{index + 1}</span><strong>{item[0]}</strong><small>{item[1]}</small></article>)}</div><article className="pm106-rule"><AlertTriangle /><div><strong>Marcar não significa criar classe</strong><span>A anotação revela candidatos; o filtro seguinte decide conceito, dado, enum, serviço ou palavra sem valor para o modelo.</span></div></article></section>;
}

function CandidatesLab() {
  const [selected, setSelected] = useState(0);
  const candidates = [
    ['OrdemServico', 'Classe forte', 'representa a OS e responde perguntas operacionais', ['certificado', 'cliente', 'status', 'dataAbertura', 'quantidadeReagendamentos'], ['diasEmAberto', 'atrasada', 'encerrada', 'precisaReagendamento', 'filaSugerida']],
    ['StatusOs', 'Enum', 'controla os status possíveis', ['ABERTA', 'AGENDADA', 'REAGENDADA', 'CONCLUIDA', 'CANCELADA'], []],
    ['FilaAtendimento', 'Enum', 'representa o destino operacional', ['ENTRADA', 'REAGENDAMENTO', 'CASOS_CRITICOS', 'SEM_FILA'], []],
    ['Cliente', 'Adiado', 'pode começar como texto até surgirem identidade e regras próprias', ['nome hoje'], ['reavaliar depois']],
  ];
  const current = candidates[selected];
  return <section className="pm106-stack"><div className="pm106-candidates"><nav>{candidates.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span>{item[0]}</button>)}</nav><main><small>{current[1].toUpperCase()}</small><strong>{current[0]}</strong><p>{current[2]}.</p><div><section><b>Estado / valores</b>{current[3].map(item => <code key={item}>{item}</code>)}</section><section><b>Comportamentos</b>{current[4].length ? current[4].map(item => <code key={item}>{item}</code>) : <span>não se aplica</span>}</section></div></main></div><article className="pm106-rule"><GitBranch /><div><strong>Modelo inicial deliberadamente pequeno</strong><span>Adiar Cliente não é esquecer: é registrar uma dúvida e evitar abstração antes de existirem regras suficientes.</span></div></article></section>;
}

function SketchLab() {
  const [section, setSection] = useState('state');
  const parts = {
    state: ['Estado', ['certificado: String', 'cliente: String', 'status: StatusOs', 'dataAbertura: LocalDate', 'quantidadeReagendamentos: int']],
    behavior: ['Comportamentos', ['diasEmAberto(dataReferencia)', 'atrasada(dataReferencia)', 'encerrada()', 'precisaReagendamento()', 'filaSugerida(dataReferencia)']],
    rules: ['Regras ordenadas', ['encerrada → SEM_FILA', 'atrasada → CASOS_CRITICOS', '2+ reagendamentos → REAGENDAMENTO', 'demais → ENTRADA']],
    doubts: ['Dúvidas', ['Cliente merece classe agora?', 'Data futura deve virar zero?', 'Fila é enum ou classe?', 'O limite de atraso pode mudar?']],
  };
  const current = parts[section];
  return <section className="pm106-stack"><div className="pm106-paper"><header><ClipboardList /><strong>Rascunho · OrdemServico</strong><span>antes da IDE</span></header><nav>{Object.entries(parts).map(([key, item]) => <button type="button" key={key} className={section === key ? 'active' : ''} onClick={() => setSection(key)}>{item[0]}</button>)}</nav><main><small>{current[0].toUpperCase()}</small>{current[1].map((item, index) => <p key={item}><span>{index + 1}</span>{item}</p>)}</main></div><article className="pm106-rule"><BookOpenCheck /><div><strong>O rascunho explica decisões, não decoração</strong><span>Se outro desenvolvedor consegue implementar e questionar o modelo, o papel já cumpriu seu papel.</span></div></article></section>;
}

function OsSourceLab() {
  const commands = ['mkdir labs\\m4\\aula-106-modelagem-no-papel', 'cd labs\\m4\\aula-106-modelagem-no-papel', 'javac ModelagemOs.java', 'java ModelagemOs'].join('\n');
  return <section className="pm106-stack"><CodePanel name="ModelagemOs.java" code={OS_SOURCE} /><div className="pm106-terminal"><header><Terminal size={16} />Transformar hipótese em código executável<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}Certificado: OS-001{`\n`}Dias em aberto: 5{`\n`}Atrasada: true{`\n`}Fila sugerida: CASOS_CRITICOS</pre></div></section>;
}

function OrderLab() {
  const [view, setView] = useState('model');
  return <section className="pm106-stack"><div className="pm106-toggle"><button type="button" className={view === 'model' ? 'active' : ''} onClick={() => setView('model')}>Rascunho do Pedido</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código após modelar</button></div>{view === 'code' ? <CodePanel name="ModelagemPedido.java" code={ORDER_SOURCE} /> : <div className="pm106-order-model"><section><small>ESTADO</small><strong>cliente · produto · precoUnitario · quantidade</strong></section><section><small>COMPORTAMENTOS</small><strong>valido · totalBruto · desconto · totalFinal</strong></section><section><small>REGRAS</small><strong>campos válidos · 10% a partir de 300 · 15% acima de 10 itens</strong></section><section><small>DÚVIDA</small><strong>qual desconto vence quando as duas regras são verdadeiras?</strong></section></div>}<article className="pm106-rule"><CheckCircle2 /><div><strong>Regra nova exige prioridade explícita</strong><span>O modelo escolhe 15% acima de dez itens antes de testar os 10% por total; código e teste devem provar essa decisão.</span></div></article></section>;
}

function ResponsibilityLab() {
  const [selected, setSelected] = useState(0);
  const items = [
    ['Pedido calcula total', 'Entidade', 'depende apenas do estado do pedido'], ['Pedido lê Scanner', 'Borda', 'entrada do console muda sem mudar Pedido'], ['OS decide atraso', 'Entidade', 'usa sua data de abertura'], ['OS imprime relatório', 'Apresentação', 'formato de saída é outra responsabilidade'], ['Email', 'Valor', 'representa informação sem identidade própria neste contexto'], ['EnviarMensagem', 'Serviço', 'operação pode depender de cliente, canal e infraestrutura'], ['Cliente', 'Entidade', 'possui identidade e ciclo próprio'], ['GerarRelatorio', 'Serviço', 'consolida múltiplos objetos e saída'],
  ];
  const current = items[selected];
  return <section className="pm106-stack"><div className="pm106-responsibility"><nav>{items.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{item[1]}</span>{item[0]}</button>)}</nav><main><small>{current[1].toUpperCase()}</small><strong>{current[0]}</strong><p>{current[2]}.</p></main></div><article className="pm106-rule"><Workflow /><div><strong>Entidade, valor e serviço são lentes iniciais</strong><span>Não force a classificação: use-a para descobrir identidade, dados, regras e dependências antes de definir a classe.</span></div></article></section>;
}

function QualityLab() {
  const [checked, setChecked] = useState([]);
  const questions = ['Representa conceito importante?', 'Possui estado próprio?', 'Possui regras relacionadas ao estado?', 'Nome vem do domínio?', 'Aparece em mais de uma parte?', 'Evita ser função disfarçada?', 'Evita misturar console, banco e relatório?', 'Dúvidas e decisões estão registradas?'];
  const suspicious = ['Manager', 'Processor', 'Helper', 'Utils', 'Dados', 'Info'];
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="pm106-stack"><div className="pm106-quality"><header><BookOpenCheck /><div><strong>{checked.length} de {questions.length} critérios defendidos</strong><span>Um “sim” precisa apontar para evidência no enunciado ou nas regras.</span></div></header>{questions.map((question, index) => <button type="button" key={question} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{question}</button>)}</div><div className="pm106-suspicious"><strong>Nomes que pedem investigação</strong>{suspicious.map(item => <code key={item}>{item}</code>)}</div><article className="pm106-rule"><RotateCcw /><div><strong>Primeiro modelo é hipótese, não contrato eterno</strong><span>Novas regras, testes e colaboração podem dividir, unir, mover ou renomear responsabilidades.</span></div></article></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [
    ['filaSugerida', 'os = OS-001 · dataReferencia = hoje', 'ModelagemOs.main'], ['encerrada', 'status ABERTA → false', 'filaSugerida'], ['atrasada', 'diasEmAberto(hoje) > 3', 'filaSugerida'], ['diasEmAberto', 'between(abertura, hoje) = 5', 'atrasada'], ['filaSugerida', 'CASOS_CRITICOS', 'ModelagemOs.main'], ['valido', 'cliente, produto, preço e quantidade', 'ModelagemPedido.main'], ['totalBruto', '199.90 × 2 = 399.80', 'desconto'], ['desconto', '399.80 >= 300 → 39.9800', 'totalFinal'], ['totalFinal', '399.80 - 39.9800', 'ModelagemPedido.main'],
  ];
  const current = trace[pause];
  return <section className="pm106-stack"><div className="pm106-debug"><header><span>ModelagemOs / ModelagemPedido · Debug</span><span>Step Into · F7</span></header><div><aside>{trace.map((item, index) => <button type="button" key={index} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>THIS / VARIABLES / FRAMES</small><strong>{current[0]}</strong><code>{current[1]}</code><span>chamador: {current[2]}</span><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => Math.min(value + 1, trace.length - 1))}><StepForward size={15} />Próxima pausa</button></main></div><footer>Conecte cada frame ao item correspondente do rascunho: estado, comportamento ou regra.</footer></div></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors pm106-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [view, setView] = useState('contract');
  const [checked, setChecked] = useState([]);
  const checks = ['oito etapas percorridas', 'três lentes aplicadas à OS', 'quatro candidatos decididos', 'rascunho OS completo', 'ModelagemOs executada', 'rascunho Pedido completo', 'ModelagemPedido executada', 'regra 15% comprovada', 'oito responsabilidades classificadas', 'oito critérios auditados', 'nove frames depurados', 'Cliente modelado no papel', 'ModelagemCliente executada', '11 testes executados', 'Git, .class e dúvidas revisados'];
  const commands = ['javac ModelagemOs.java ModelagemPedido.java ModelagemCliente.java', 'javac TesteModelagemNoPapel.java', 'java ModelagemOs', 'java ModelagemPedido', 'java ModelagemCliente', 'java TesteModelagemNoPapel', 'git status', 'git add labs/m4/aula-106-modelagem-no-papel', 'git commit -m "Aula 106: pratica modelagem no papel"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="pm106-delivery"><div className="pm106-toggle"><button type="button" className={view === 'contract' ? 'active' : ''} onClick={() => setView('contract')}>Modelo de Cliente antes de codar</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Código após tentar</button></div>{view === 'code' ? <CodePanel name="ModelagemCliente.java" code={CLIENT_SOURCE} /> : <div className="pm106-client-model"><p><b>Substantivos:</b> cliente, nome, email, telefone, status, mensagem</p><p><b>Verbos:</b> possui, pode receber, informar, estar ativo</p><p><b>Classe principal:</b> Cliente</p><p><b>Estado:</b> nome, email, telefone, ativo</p><p><b>Comportamentos:</b> contatoCompleto, podeReceberMensagem</p><p><b>Regras:</b> contato completo exige email e telefone; mensagem exige ativo e telefone</p><p><b>Dúvidas:</b> email e telefone merecem value objects depois?</p></div>}<div className="pm106-terminal"><header><Play size={15} />Compilar hipóteses, executar testes e versionar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}</pre></div><CodePanel name="TesteModelagemNoPapel.java" code={TEST_SOURCE} /><div className="pm106-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Registro de decisão</h3></div><ul><li>Qual substantivo virou a classe principal?</li><li>Qual comportamento pertence naturalmente a ela?</li><li>Qual responsabilidade ficou explicitamente fora?</li><li>Qual dúvida deve ser revisitada após a implementação?</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'process', label: 'Processo em 8 Etapas', duration: '10 min', eyebrow: 'DO ENUNCIADO À HIPÓTESE TESTÁVEL', title: 'Use um processo antes de abrir a IDE', blocks: [{ type: 'lead', text: 'Modelar no papel não busca desenho bonito; cria entendimento, decisões, dúvidas e uma primeira divisão de responsabilidades.' }, { type: 'process' }] },
  { id: 'annotation', label: 'Anotar o Enunciado', duration: '13 min', eyebrow: 'SUBSTANTIVOS, VERBOS E REGRAS', title: 'Leia a Ordem de Serviço com três lentes diferentes', blocks: [{ type: 'lead', text: 'Cada lente produz informação distinta: candidatos e dados, ações e responsabilidades, limites e prioridades.' }, { type: 'annotation' }] },
  { id: 'candidates', label: 'Filtrar Candidatos', duration: '13 min', eyebrow: 'CLASSE, ENUM, DADO OU DECISÃO ADIADA', title: 'Escolha um modelo pequeno e justifique o que ficou de fora', blocks: [{ type: 'lead', text: 'Nem todo substantivo merece classe; a primeira versão precisa ser simples, expressiva e aberta a revisão.' }, { type: 'candidates' }] },
  { id: 'sketch', label: 'Rascunho da OS', duration: '12 min', eyebrow: 'ESTADO, COMPORTAMENTOS, REGRAS E DÚVIDAS', title: 'Escreva o contrato que orientará a implementação', blocks: [{ type: 'lead', text: 'O rascunho liga cada dado e método a uma regra e torna a ordem de decisão visível antes do if.' }, { type: 'sketch' }] },
  { id: 'os-code', label: 'Do Papel ao Código', duration: '20 min', eyebrow: 'LOCALDATE, ENUMS E FILA PRIORITÁRIA', title: 'Implemente a hipótese da OS sem inventar responsabilidades novas', blocks: [{ type: 'lead', text: 'O código nasce diretamente do rascunho e serve para testar se nomes, regras e colaborações realmente funcionam.' }, { type: 'os-code' }] },
  { id: 'order', label: 'Modelar Pedido', duration: '17 min', eyebrow: 'VALIDADE, BIGDECIMAL E DESCONTOS', title: 'Repita o processo e evolua uma regra com prioridade', blocks: [{ type: 'lead', text: 'Pedido demonstra que o método vem depois da regra escrita e que duas promoções exigem uma decisão explícita.' }, { type: 'order' }] },
  { id: 'responsibility', label: 'Responsabilidade e Tipos', duration: '13 min', eyebrow: 'ENTIDADE, VALOR, SERVIÇO E BORDA', title: 'Pergunte quem deve saber, aplicar, responder ou executar', blocks: [{ type: 'lead', text: 'A classificação é uma lente para evitar que entidades leiam console, imprimam relatório ou escondam infraestrutura.' }, { type: 'responsibility' }] },
  { id: 'quality', label: 'Auditar o Modelo', duration: '12 min', eyebrow: 'CRITÉRIOS, NOMES VAGOS E HIPÓTESES', title: 'Questione a classe antes de tratá-la como definitiva', blocks: [{ type: 'lead', text: 'Uma candidata forte representa o domínio, possui estado e regras; uma candidata suspeita só encaminha chamadas ou mistura tudo.' }, { type: 'quality' }] },
  { id: 'debug', label: 'Debug do Modelo', duration: '14 min', eyebrow: 'DO RASCUNHO AOS FRAMES', title: 'Veja estado, comportamento e regra trabalhando juntos', blocks: [{ type: 'lead', text: 'O debug conecta itens do papel às chamadas reais de OrdemServico e Pedido.' }, { type: 'debug' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'EXCESSO, NOMES VAGOS, ORDEM E RESPONSABILIDADE', title: 'Diagnostique oito falhas antes que virem arquitetura', blocks: [{ type: 'lead', text: 'Cada sintoma volta a uma etapa ignorada do processo de modelagem.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio Cliente', duration: '18 min', eyebrow: 'MODELO, CÓDIGO, TESTES, DECISÕES E GIT', title: 'Modele um terceiro problema sem copiar o desenho anterior', blocks: [{ type: 'lead', text: 'A entrega comprova que você consegue pensar primeiro, codar depois e registrar por que escolheu cada responsabilidade.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'process') return <ProcessLab />;
  if (block.type === 'annotation') return <AnnotationLab />;
  if (block.type === 'candidates') return <CandidatesLab />;
  if (block.type === 'sketch') return <SketchLab />;
  if (block.type === 'os-code') return <OsSourceLab />;
  if (block.type === 'order') return <OrderLab />;
  if (block.type === 'responsibility') return <ResponsibilityLab />;
  if (block.type === 'quality') return <QualityLab />;
  if (block.type === 'debug') return <DebugLab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedPaperModelingLesson106({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-paper-modeling-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><BookOpenCheck size={17} />Oficina de modelagem antes da IDE</span><p className="guided-sequence">106 · M4.02</p><h1>Não comece pela classe; comece pelo problema</h1><p>Leia as regras do domínio, marque substantivos e verbos, filtre candidatos, distribua responsabilidades, registre dúvidas e transforme a hipótese em código testável.</p></div><div className="guided-hero-status"><ClipboardList size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 106" items={[{ value: '8 etapas', label: 'Antes de abrir a IDE' }, { value: '4 fontes', label: 'Compiladas e testadas' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 106"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Hipóteses modeladas, implementadas e testadas</h3><p>{lessonComplete ? 'Aula concluída: agora você pode aprofundar class, new, atributos, métodos, construtor e this.' : 'Confira decisões e evidências antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 105</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Problema, modelo, código e teste</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 107<ArrowRight size={17} /></button></footer></article>;
}
