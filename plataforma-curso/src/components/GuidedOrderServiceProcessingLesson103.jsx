import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Check, CheckCircle2, Clock3, Copy, FileCode2, GitBranch, History, ListChecks, Play, RotateCcw, Route, Sparkles, StepForward, Terminal, Workflow } from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedOrderServiceProcessingLesson.css';

const STORAGE_KEY = 'guided-order-service-processing-lesson-103-progress';
const PROCESSING_SOURCE = `import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.Scanner;

public class ProcessamentoOsConsole {
    private static final int LIMITE_HISTORICO = 10;
    private static final int DIAS_PARA_ATRASO = 3;
    private static final int REAGENDAMENTOS_PARA_ATENCAO = 2;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ResumoOs[] historico = new ResumoOs[LIMITE_HISTORICO];
        int quantidadeHistorico = 0;
        boolean executando = true;

        while (executando) {
            imprimirMenu();
            int opcao = lerInteiro(scanner, "Escolha uma opção: ");

            if (opcao == 0) {
                executando = false;
            } else if (opcao == 1) {
                ResumoOs resumo = executarFluxoProcessamento(scanner);
                if (resumo != null) {
                    quantidadeHistorico = registrarNoHistorico(
                            historico, quantidadeHistorico, resumo);
                }
            } else if (opcao == 2) {
                imprimirHistorico(historico, quantidadeHistorico);
            } else if (opcao == 3) {
                imprimirRelatorio(historico, quantidadeHistorico);
            } else {
                imprimirErro("Opção inválida.");
            }
            imprimirLinha();
        }
        imprimirEncerramento(historico, quantidadeHistorico);
    }

    public static void imprimirMenu() {
        System.out.println("====================================");
        System.out.println("PROCESSAMENTO DE OS");
        System.out.println("====================================");
        System.out.println("1 - Processar nova OS");
        System.out.println("2 - Ver histórico");
        System.out.println("3 - Ver relatório");
        System.out.println("0 - Sair");
        System.out.println("------------------------------------");
    }

    public static ResumoOs executarFluxoProcessamento(Scanner scanner) {
        OrdemServicoEntrada os = lerOrdemServico(scanner);
        if (!ordemServicoValida(os)) {
            imprimirErro("OS inválida. Verifique os dados informados.");
            return null;
        }
        ResumoOs resumo = processarOrdemServico(os);
        imprimirResumoOs(resumo);
        return resumo;
    }

    public static OrdemServicoEntrada lerOrdemServico(Scanner scanner) {
        String certificado = lerTextoObrigatorio(scanner, "Certificado: ");
        String cliente = lerTextoObrigatorio(scanner, "Cliente: ");
        StatusOs status = lerStatusOs(scanner);
        LocalDate dataAbertura = lerData(scanner, "Data de abertura (AAAA-MM-DD): ");
        int reagendamentos = lerInteiroMinimo(
                scanner, "Quantidade de reagendamentos: ", 0);
        return new OrdemServicoEntrada(
                certificado, cliente, status, dataAbertura, reagendamentos);
    }

    public static StatusOs lerStatusOs(Scanner scanner) {
        while (true) {
            System.out.println("Status: 1 ABERTA | 2 AGENDADA | 3 REAGENDADA");
            System.out.println("        4 CONCLUIDA | 5 CANCELADA");
            int opcao = lerInteiro(scanner, "Status: ");
            if (opcao == 1) return StatusOs.ABERTA;
            if (opcao == 2) return StatusOs.AGENDADA;
            if (opcao == 3) return StatusOs.REAGENDADA;
            if (opcao == 4) return StatusOs.CONCLUIDA;
            if (opcao == 5) return StatusOs.CANCELADA;
            imprimirErro("Status inválido.");
        }
    }

    public static boolean ordemServicoValida(OrdemServicoEntrada os) {
        return os != null
                && textoInformado(os.certificado())
                && textoInformado(os.cliente())
                && os.status() != null
                && os.dataAbertura() != null
                && os.quantidadeReagendamentos() >= 0;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static ResumoOs processarOrdemServico(OrdemServicoEntrada os) {
        long diasEmAberto = calcularDiasEmAberto(os.dataAbertura(), LocalDate.now());
        boolean atrasada = osAtrasada(diasEmAberto);
        boolean precisaAtencao = precisaAtencao(os, atrasada);
        String fila = definirFilaSugerida(os, atrasada, precisaAtencao);
        return new ResumoOs(
                os.certificado(), os.cliente(), os.status(), os.dataAbertura(),
                os.quantidadeReagendamentos(), diasEmAberto, atrasada,
                precisaAtencao, fila);
    }

    public static long calcularDiasEmAberto(
            LocalDate dataAbertura, LocalDate dataReferencia) {
        long dias = ChronoUnit.DAYS.between(dataAbertura, dataReferencia);
        return dias < 0 ? 0 : dias;
    }

    public static boolean osAtrasada(long diasEmAberto) {
        return diasEmAberto > DIAS_PARA_ATRASO;
    }

    public static boolean precisaAtencao(
            OrdemServicoEntrada os, boolean atrasada) {
        return atrasada
                || os.quantidadeReagendamentos() >= REAGENDAMENTOS_PARA_ATENCAO;
    }

    public static String definirFilaSugerida(
            OrdemServicoEntrada os, boolean atrasada, boolean precisaAtencao) {
        if (os.status() == StatusOs.CANCELADA
                || os.status() == StatusOs.CONCLUIDA) {
            return "Sem fila";
        }
        if (atrasada) return "Casos Críticos";
        if (precisaAtencao) return "Reagendamento";
        return "Entrada";
    }

    public static int registrarNoHistorico(
            ResumoOs[] historico, int quantidade, ResumoOs resumo) {
        if (quantidade >= historico.length) {
            imprimirErro("Histórico cheio. Esta OS não será armazenada.");
            return quantidade;
        }
        historico[quantidade] = resumo;
        return quantidade + 1;
    }

    public static void imprimirResumoOs(ResumoOs resumo) {
        imprimirCabecalho("RESUMO DA OS");
        System.out.println("Certificado: " + resumo.certificado());
        System.out.println("Cliente: " + resumo.cliente());
        System.out.println("Status: " + resumo.status());
        System.out.println("Data de abertura: " + resumo.dataAbertura());
        System.out.println("Reagendamentos: " + resumo.quantidadeReagendamentos());
        System.out.println("Dias em aberto: " + resumo.diasEmAberto());
        System.out.println("Atrasada: " + resumo.atrasada());
        System.out.println("Precisa atenção: " + resumo.precisaAtencao());
        System.out.println("Fila sugerida: " + resumo.filaSugerida());
    }

    public static void imprimirHistorico(
            ResumoOs[] historico, int quantidade) {
        if (quantidade == 0) {
            System.out.println("Nenhuma OS processada ainda.");
            return;
        }
        imprimirCabecalho("HISTÓRICO DE OS");
        for (int i = 0; i < quantidade; i++) {
            ResumoOs resumo = historico[i];
            System.out.println((i + 1) + " - " + resumo.certificado()
                    + " | Cliente: " + resumo.cliente()
                    + " | Status: " + resumo.status()
                    + " | Fila: " + resumo.filaSugerida());
        }
    }

    public static void imprimirRelatorio(
            ResumoOs[] historico, int quantidade) {
        if (quantidade == 0) {
            System.out.println("Não há dados para relatório.");
            return;
        }
        imprimirCabecalho("RELATÓRIO");
        System.out.println("Total de OS processadas: " + quantidade);
        System.out.println("OS atrasadas: " + contarAtrasadas(historico, quantidade));
        System.out.println("OS que precisam de atenção: "
                + contarComAtencao(historico, quantidade));
        System.out.println("Fila Entrada: "
                + contarPorFila(historico, quantidade, "Entrada"));
        System.out.println("Fila Reagendamento: "
                + contarPorFila(historico, quantidade, "Reagendamento"));
        System.out.println("Fila Casos Críticos: "
                + contarPorFila(historico, quantidade, "Casos Críticos"));
        System.out.println("Sem fila: "
                + contarPorFila(historico, quantidade, "Sem fila"));
    }

    public static int contarAtrasadas(ResumoOs[] historico, int quantidade) {
        int contador = 0;
        for (int i = 0; i < quantidade; i++) {
            if (historico[i].atrasada()) contador++;
        }
        return contador;
    }

    public static int contarComAtencao(ResumoOs[] historico, int quantidade) {
        int contador = 0;
        for (int i = 0; i < quantidade; i++) {
            if (historico[i].precisaAtencao()) contador++;
        }
        return contador;
    }

    public static int contarPorFila(
            ResumoOs[] historico, int quantidade, String fila) {
        int contador = 0;
        for (int i = 0; i < quantidade; i++) {
            if (historico[i].filaSugerida().equals(fila)) contador++;
        }
        return contador;
    }

    public static void imprimirEncerramento(
            ResumoOs[] historico, int quantidade) {
        System.out.println("Encerrando processamento de OS.");
        imprimirRelatorio(historico, quantidade);
    }

    public static String lerTextoObrigatorio(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            String valor = scanner.nextLine().trim();
            if (!valor.isBlank()) return valor;
            imprimirErro("Valor obrigatório.");
        }
    }

    public static int lerInteiro(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                return Integer.parseInt(scanner.nextLine().trim());
            } catch (NumberFormatException erro) {
                imprimirErro("Digite um número inteiro válido.");
            }
        }
    }

    public static int lerInteiroMinimo(
            Scanner scanner, String prompt, int minimo) {
        while (true) {
            int valor = lerInteiro(scanner, prompt);
            if (valor >= minimo) return valor;
            imprimirErro("Digite um valor maior ou igual a " + minimo + ".");
        }
    }

    public static LocalDate lerData(Scanner scanner, String prompt) {
        while (true) {
            System.out.print(prompt);
            try {
                return LocalDate.parse(scanner.nextLine().trim());
            } catch (DateTimeParseException erro) {
                imprimirErro("Digite uma data válida no formato AAAA-MM-DD.");
            }
        }
    }

    public static void imprimirCabecalho(String titulo) {
        System.out.println("====================================");
        System.out.println(titulo);
        System.out.println("====================================");
    }

    public static void imprimirErro(String mensagem) {
        System.out.println("[ERRO] " + mensagem);
    }

    public static void imprimirLinha() {
        System.out.println("------------------------------------");
    }
}

enum StatusOs { ABERTA, AGENDADA, REAGENDADA, CONCLUIDA, CANCELADA }

record OrdemServicoEntrada(
        String certificado, String cliente, StatusOs status,
        LocalDate dataAbertura, int quantidadeReagendamentos) {}

record ResumoOs(
        String certificado, String cliente, StatusOs status,
        LocalDate dataAbertura, int quantidadeReagendamentos,
        long diasEmAberto, boolean atrasada, boolean precisaAtencao,
        String filaSugerida) {}`;

const TEST_SOURCE = `import java.time.LocalDate;

public class TesteProcessamentoOsConsole {
    public static void main(String[] args) {
        LocalDate referencia = LocalDate.of(2026, 7, 18);
        exigir(ProcessamentoOsConsole.calcularDiasEmAberto(
                LocalDate.of(2026, 7, 18), referencia) == 0, "OS de hoje");
        exigir(ProcessamentoOsConsole.calcularDiasEmAberto(
                LocalDate.of(2026, 7, 20), referencia) == 0, "data futura");
        exigir(ProcessamentoOsConsole.osAtrasada(4), "atraso acima de 3 dias");
        exigir(!ProcessamentoOsConsole.osAtrasada(3), "limite de 3 dias");

        OrdemServicoEntrada normal = os(StatusOs.ABERTA, 0);
        OrdemServicoEntrada reagendada = os(StatusOs.REAGENDADA, 2);
        OrdemServicoEntrada concluida = os(StatusOs.CONCLUIDA, 0);
        exigir(ProcessamentoOsConsole.definirFilaSugerida(
                normal, false, false).equals("Entrada"), "fila entrada");
        exigir(ProcessamentoOsConsole.definirFilaSugerida(
                reagendada, false, true).equals("Reagendamento"), "fila reagendamento");
        exigir(ProcessamentoOsConsole.definirFilaSugerida(
                normal, true, true).equals("Casos Críticos"), "fila críticos");
        exigir(ProcessamentoOsConsole.definirFilaSugerida(
                concluida, true, true).equals("Sem fila"), "concluída sem fila");

        ResumoOs[] historico = new ResumoOs[1];
        ResumoOs resumo = new ResumoOs("OS-001", "Ana", StatusOs.ABERTA,
                referencia, 0, 0, false, false, "Entrada");
        int quantidade = ProcessamentoOsConsole.registrarNoHistorico(
                historico, 0, resumo);
        quantidade = ProcessamentoOsConsole.registrarNoHistorico(
                historico, quantidade, resumo);
        exigir(quantidade == 1, "limite do histórico");
        exigir(ProcessamentoOsConsole.contarPorFila(
                historico, quantidade, "Entrada") == 1, "contador por fila");
        System.out.println("TESTES OK: 10 evidências");
    }

    static OrdemServicoEntrada os(StatusOs status, int reagendamentos) {
        return new OrdemServicoEntrada("OS-T", "Cliente", status,
                LocalDate.of(2026, 7, 18), reagendamentos);
    }

    static void exigir(boolean condicao, String evidencia) {
        if (!condicao) throw new AssertionError(evidencia);
    }
}`;

const V2_SOURCE = `public class ProcessamentoOsConsoleV2 {
    public static void main(String[] args) {
        ResumoOs[] historico = {
            new ResumoOs("OS-1", "Ana", StatusOs.REAGENDADA, null,
                    0, 2, false, false, "Reagendamento"),
            new ResumoOs("OS-2", "Bia", StatusOs.ABERTA, null,
                    0, 6, true, true, "Casos Críticos")
        };
        OrdemServicoEntrada os = new OrdemServicoEntrada(
                "OS-3", "Caio", StatusOs.REAGENDADA, null, 0);
        System.out.println("Fila V2: " + definirFilaV2(os, false, false));
        System.out.println("REAGENDADA: "
                + contarPorStatus(historico, 2, StatusOs.REAGENDADA));
        System.out.println("Média de dias: "
                + calcularMediaDiasEmAberto(historico, 2));
    }

    public static String definirFilaV2(
            OrdemServicoEntrada os, boolean atrasada, boolean precisaAtencao) {
        if (os.status() == StatusOs.CANCELADA
                || os.status() == StatusOs.CONCLUIDA) return "Sem fila";
        if (atrasada) return "Casos Críticos";
        if (os.status() == StatusOs.REAGENDADA || precisaAtencao) {
            return "Reagendamento";
        }
        return "Entrada";
    }

    public static int contarPorStatus(
            ResumoOs[] historico, int quantidade, StatusOs status) {
        int total = 0;
        for (int i = 0; i < quantidade; i++) {
            if (historico[i].status() == status) total++;
        }
        return total;
    }

    public static double calcularMediaDiasEmAberto(
            ResumoOs[] historico, int quantidade) {
        if (quantidade == 0) return 0;
        long soma = 0;
        for (int i = 0; i < quantidade; i++) {
            soma += historico[i].diasEmAberto();
        }
        return (double) soma / quantidade;
    }
}`;

const EVIDENCE = `# Aula 103 — Processamento de OS console

- [ ] Expliquei o ciclo 0–3 do menu
- [ ] Criei ProcessamentoOsConsole.java
- [ ] Separei entrada, validação, processamento e saída
- [ ] Testei OS normal, atrasada, reagendada e concluída
- [ ] Provei a prioridade da fila sugerida
- [ ] Testei texto, inteiro, data e status inválidos
- [ ] Confirmei que data futura resulta em zero dias
- [ ] Registrei e listei o histórico em ordem
- [ ] Conferi todos os contadores do relatório
- [ ] Testei o limite de dez posições
- [ ] Percorri o fluxo com Step Into (F7)
- [ ] Executei TesteProcessamentoOsConsole
- [ ] Completei regra e métricas da V2
- [ ] Respondi as três perguntas da aula
- [ ] Revisei git diff e removi arquivos .class`;

const ERRORS = [
  ['Data futura negativa', 'ChronoUnit devolve dias negativos e a regra classifica um estado impossível.', 'Normalize resultados menores que zero em calcularDiasEmAberto.'],
  ['Prioridade invertida', 'OS concluída e atrasada aparece em Casos Críticos.', 'Teste CONCLUIDA/CANCELADA antes de atraso e reagendamento.'],
  ['Record de entrada nulo', 'A validação acessa os.certificado() e lança NullPointerException.', 'Comece a expressão com os != null e preserve o curto-circuito.'],
  ['Reagendamento negativo', 'O relatório aceita uma quantidade sem sentido.', 'Use lerInteiroMinimo com mínimo zero e valide novamente o record.'],
  ['Data derruba o menu', '2026/07/18 causa DateTimeParseException e encerra o programa.', 'Capture a exceção em lerData e repita no formato AAAA-MM-DD.'],
  ['Histórico estourado', 'A 11ª OS tenta gravar no índice 10.', 'Compare quantidade com historico.length antes de registrar.'],
  ['Relatório percorre null', 'O laço usa historico.length e acessa posições vazias.', 'Percorra somente até quantidadeHistorico.'],
  ['Main conhece as regras', 'Cada nova fila obriga alterar menu, cálculo e relatório juntos.', 'Faça o main coordenar e concentre a decisão em definirFilaSugerida.'],
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

function ProjectMapLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['Ler', 'lerOrdemServico', 'transforma cinco entradas em OrdemServicoEntrada'],
    ['Validar', 'ordemServicoValida', 'barra campos ausentes e reagendamento negativo'],
    ['Processar', 'processarOrdemServico', 'calcula dias, atenção e fila'],
    ['Resumir', 'ResumoOs', 'congela a decisão e seus dados'],
    ['Registrar', 'registrarNoHistorico', 'guarda até dez resultados'],
    ['Exibir', 'resumo / histórico / relatório', 'apresenta evidências sem recalcular no main'],
  ];
  const current = stages[stage];
  return <section className="os103-stack"><div className="os103-flow">{stages.map((item, index) => <button type="button" key={item[0]} className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}><span>{index < stage ? <Check size={14} /> : index + 1}</span><strong>{item[0]}</strong><small>{item[1]}</small></button>)}</div><div className="os103-focus"><Workflow /><div><small>{current[1]}</small><strong>{current[0]}</strong><span>{current[2]}. O main apenas conduz a história.</span></div></div></section>;
}

function ResponsibilitiesLab() {
  const [group, setGroup] = useState(0);
  const groups = [
    ['Leitura', ['lerOrdemServico', 'lerStatusOs', 'lerTextoObrigatorio', 'lerInteiro', 'lerData'], 'converte console em dados confiáveis'],
    ['Validação', ['ordemServicoValida', 'textoInformado', 'lerInteiroMinimo'], 'protege as pré-condições'],
    ['Processamento', ['calcularDiasEmAberto', 'osAtrasada', 'precisaAtencao', 'definirFilaSugerida'], 'aplica a regra operacional'],
    ['Memória', ['ResumoOs[]', 'registrarNoHistorico', 'quantidadeHistorico'], 'preserva os resultados processados'],
    ['Consulta', ['imprimirHistorico', 'imprimirRelatorio', 'contarAtrasadas', 'contarPorFila'], 'deriva informação dos registros'],
  ];
  const current = groups[group];
  return <section className="os103-stack"><div className="os103-responsibilities"><nav>{groups.map((item, index) => <button type="button" key={item[0]} className={group === index ? 'active' : ''} onClick={() => setGroup(index)}><span>{index + 1}</span>{item[0]}</button>)}</nav><main><small>{current[0].toUpperCase()}</small><p>{current[2]}</p><div>{current[1].map(item => <code key={item}>{item}</code>)}</div></main></div><article className="os103-rule"><GitBranch /><div><strong>Separar agora prepara as camadas de amanhã</strong><span>Mais tarde leitura, regra e persistência irão para classes diferentes; hoje você aprende primeiro a fronteira entre elas.</span></div></article></section>;
}

function SourceLab() {
  const commands = 'javac ProcessamentoOsConsole.java\njava ProcessamentoOsConsole';
  return <section className="os103-stack"><CodePanel name="ProcessamentoOsConsole.java" code={PROCESSING_SOURCE} /><div className="os103-terminal"><header><Terminal size={16} />Compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> javac ProcessamentoOsConsole.java{`\n`}<b>PS&gt;</b> java ProcessamentoOsConsole{`\n`}PROCESSAMENTO DE OS{`\n`}1 - Processar nova OS{`\n`}2 - Ver histórico · 3 - Ver relatório · 0 - Sair</pre></div></section>;
}

function QueueSimulatorLab() {
  const [status, setStatus] = useState('ABERTA');
  const [days, setDays] = useState(0);
  const [reschedules, setReschedules] = useState(0);
  const closed = status === 'CONCLUIDA' || status === 'CANCELADA';
  const delayed = Number(days) > 3;
  const attention = delayed || Number(reschedules) >= 2;
  const queue = closed ? 'Sem fila' : delayed ? 'Casos Críticos' : attention ? 'Reagendamento' : 'Entrada';
  return <section className="os103-stack"><div className="os103-simulator"><header><Route /><div><strong>Simulador da decisão operacional</strong><span>Altere um dado por vez e defenda qual condição vence.</span></div></header><div className="os103-controls"><label>Status<select value={status} onChange={event => setStatus(event.target.value)}>{['ABERTA', 'AGENDADA', 'REAGENDADA', 'CONCLUIDA', 'CANCELADA'].map(value => <option key={value}>{value}</option>)}</select></label><label>Dias em aberto<input type="number" min="0" value={days} onChange={event => setDays(event.target.value)} /></label><label>Reagendamentos<input type="number" min="0" value={reschedules} onChange={event => setReschedules(event.target.value)} /></label></div><div className="os103-decision"><span className={closed ? 'hit' : ''}>1 · encerrada?</span><span className={!closed && delayed ? 'hit' : ''}>2 · atrasada?</span><span className={!closed && !delayed && attention ? 'hit' : ''}>3 · atenção?</span><strong>{queue}</strong></div></div><article className="os103-rule"><CheckCircle2 /><div><strong>{queue}</strong><span>Atrasada: {String(delayed)} · precisa atenção: {String(attention)}. A ordem dos ifs define a prioridade.</span></div></article></section>;
}

function ValidationLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    ['Certificado vazio', '↵ → OS-001', '[ERRO] Valor obrigatório.', 'lerTextoObrigatorio repete'],
    ['Status 8', '8 → 2', '[ERRO] Status inválido.', 'lerStatusOs repete'],
    ['Data com barras', '18/07/2026 → 2026-07-18', '[ERRO] Digite uma data válida...', 'lerData captura a exceção'],
    ['Reagendamento -1', '-1 → 0', '[ERRO] Digite um valor maior ou igual a 0.', 'lerInteiroMinimo repete'],
  ];
  const current = cases[selected];
  return <section className="os103-stack"><div className="os103-case-tabs">{cases.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</div><div className="os103-terminal"><header><Terminal size={16} />Console · entrada defensiva</header><pre><b>ENTRADA</b> {current[1]}{`\n`}<b>RESPOSTA</b> {current[2]}{`\n`}<b>CONTINUIDADE</b> {current[3]}</pre></div><article className="os103-rule"><RotateCcw /><div><strong>O erro fica perto da conversão</strong><span>O usuário corrige o campo atual; o menu e os dados anteriores não são descartados.</span></div></article></section>;
}

function HistoryReportLab() {
  const seed = [
    { id: 'OS-001', status: 'ABERTA', queue: 'Entrada', delayed: false, attention: false },
    { id: 'OS-002', status: 'AGENDADA', queue: 'Casos Críticos', delayed: true, attention: true },
    { id: 'OS-003', status: 'REAGENDADA', queue: 'Reagendamento', delayed: false, attention: true },
    { id: 'OS-004', status: 'CONCLUIDA', queue: 'Sem fila', delayed: false, attention: false },
  ];
  const [active, setActive] = useState(seed.map(() => true));
  const selected = seed.filter((_, index) => active[index]);
  const toggle = index => setActive(current => current.map((value, position) => position === index ? !value : value));
  const count = queue => selected.filter(item => item.queue === queue).length;
  return <section className="os103-stack"><div className="os103-report"><aside>{seed.map((item, index) => <button type="button" key={item.id} className={active[index] ? 'active' : ''} onClick={() => toggle(index)}><span>{active[index] ? <Check size={14} /> : index + 1}</span><strong>{item.id}</strong><small>{item.status} · {item.queue}</small></button>)}</aside><main><BarChart3 /><div><small>RELATÓRIO DERIVADO DAS POSIÇÕES ATIVAS</small><strong>Total: {selected.length}</strong><span>Atrasadas: {selected.filter(item => item.delayed).length} · Atenção: {selected.filter(item => item.attention).length}</span><span>Entrada: {count('Entrada')} · Reagendamento: {count('Reagendamento')}</span><span>Críticos: {count('Casos Críticos')} · Sem fila: {count('Sem fila')}</span></div></main></div><article className="os103-rule"><History /><div><strong>Capacidade não é quantidade</strong><span>O array possui dez posições, mas relatório e histórico percorrem apenas os índices menores que quantidadeHistorico.</span></div></article></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [
    ['executarFluxoProcessamento', 'scanner pronto', 'main'],
    ['lerOrdemServico', 'OS-009 · Ana · ABERTA · 5 dias · 0', 'executarFluxoProcessamento'],
    ['ordemServicoValida', 'true', 'executarFluxoProcessamento'],
    ['calcularDiasEmAberto', 'diasEmAberto = 5', 'processarOrdemServico'],
    ['definirFilaSugerida', 'fila = Casos Críticos', 'processarOrdemServico'],
    ['registrarNoHistorico', 'índice 0 → quantidade 1', 'main'],
    ['imprimirRelatorio', 'total 1 · atrasadas 1', 'main'],
  ];
  const current = trace[pause];
  return <section className="os103-stack"><div className="os103-debug"><header><span>ProcessamentoOsConsole.java · Debug</span><span>Step Into · F7</span></header><div><aside>{trace.map((item, index) => <button type="button" key={item[0]} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>VARIABLES / FRAMES</small><strong>{current[0]}</strong><code>{current[1]}</code><span>chamador: {current[2]}</span><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => Math.min(value + 1, trace.length - 1))}><StepForward size={15} />Próxima pausa</button></main></div><footer>Em cada pausa, explique qual método decide e qual apenas transporta o resultado.</footer></div></section>;
}

function V2Lab() {
  const [view, setView] = useState('rules');
  return <section className="os103-stack"><div className="os103-toggle"><button type="button" className={view === 'rules' ? 'active' : ''} onClick={() => setView('rules')}>Contrato da evolução</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Modelo após tentar</button></div>{view === 'code' ? <CodePanel name="ProcessamentoOsConsoleV2.java" code={V2_SOURCE} /> : <div className="os103-priority"><span>1 · CANCELADA / CONCLUIDA</span><strong>Sem fila</strong><span>2 · atrasada</span><strong>Casos Críticos</strong><span>3 · REAGENDADA ou atenção</span><strong>Reagendamento</strong><span>4 · demais</span><strong>Entrada</strong></div>}<article className="os103-rule"><Sparkles /><div><strong>Nova regra, mesma fronteira</strong><span>A V2 também conta por status e calcula a média de dias usando somente posições preenchidas.</span></div></article></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors os103-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const checks = ['três fontes criadas', 'menu 0–3 executado', 'responsabilidades explicadas', 'quatro cenários de fila', 'quatro entradas inválidas', 'data futura normalizada', 'prioridade comprovada', 'histórico em ordem', 'relatório conferido', 'limite 10 conferido', 'F7 em sete chamadas', 'dez testes automatizados', 'regra REAGENDADA da V2', 'duas métricas da V2', 'diff e .class revisados'];
  const commands = ['javac *.java', 'java ProcessamentoOsConsole', 'java TesteProcessamentoOsConsole', 'git status', 'git diff', 'git add labs/m3/aula-103-projeto-processamento-de-os-console', 'git commit -m "Aula 103: cria processamento de OS console"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  return <section className="os103-delivery"><div className="os103-terminal"><header><Play size={15} />Compilar, testar e registrar um commit limpo<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}</pre></div><CodePanel name="TesteProcessamentoOsConsole.java" code={TEST_SOURCE} /><div className="os103-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: evolua a fila e o relatório</h3></div><p>Faça <code>REAGENDADA</code> ir à fila Reagendamento mesmo com zero ocorrências, sem vencer encerramento ou atraso.</p><ul><li>Implemente <code>contarPorStatus</code>.</li><li>Implemente <code>calcularMediaDiasEmAberto</code>.</li><li>Teste histórico vazio e um caso com prioridade dupla.</li><li>Não acrescente regra de negócio ao <code>main</code>.</li></ul></section><section className="os103-rule"><FileCode2 /><div><strong>Registro rápido antes do commit</strong><span>1. Qual regra definiu a fila da OS? · 2. Qual método representa o processamento principal? · 3. O que ficou mais claro após separar responsabilidades?</span></div></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'map', label: 'Mapa do Projeto', duration: '10 min', eyebrow: 'ENTRADA, REGRA, MEMÓRIA E SAÍDA', title: 'Veja a OS atravessar o sistema antes de escrever código', blocks: [{ type: 'lead', text: 'O projeto transforma cinco dados do console em uma decisão operacional rastreável, armazenável e explicável.' }, { type: 'map' }] },
  { id: 'responsibilities', label: 'Responsabilidades', duration: '11 min', eyebrow: 'CADA MUDANÇA COM UM DONO', title: 'Separe leitura, validação, processamento, memória e consulta', blocks: [{ type: 'lead', text: 'A arquitetura ainda cabe em um arquivo, mas cada método conhece somente a parte necessária da história.' }, { type: 'responsibilities' }] },
  { id: 'source', label: 'Código Completo', duration: '24 min', eyebrow: 'PROJETO EXECUTÁVEL EM UM ARQUIVO', title: 'Construa o fluxo integral sem esconder nenhuma etapa', blocks: [{ type: 'lead', text: 'Digite por blocos, compile após cada responsabilidade e só então execute o primeiro cenário.' }, { type: 'source' }] },
  { id: 'queues', label: 'Laboratório de Filas', duration: '13 min', eyebrow: 'PRIORIDADE DE REGRAS VISÍVEL', title: 'Descubra por que a ordem dos ifs muda a fila', blocks: [{ type: 'lead', text: 'Encerramento vence atraso; atraso vence atenção; somente depois aparece a fila de entrada.' }, { type: 'queues' }] },
  { id: 'validation', label: 'Entradas Defensivas', duration: '12 min', eyebrow: 'RETRY SEM PERDER O FLUXO', title: 'Corrija cada campo no ponto em que ele falha', blocks: [{ type: 'lead', text: 'Texto, status, data e quantidade possuem contratos diferentes e mensagens específicas.' }, { type: 'validation' }] },
  { id: 'history', label: 'Histórico & Relatório', duration: '14 min', eyebrow: 'ARRAY LIMITADO, CONSULTAS REAIS', title: 'Converta registros em indicadores sem percorrer null', blocks: [{ type: 'lead', text: 'QuantidadeHistorico separa capacidade física de registros realmente disponíveis.' }, { type: 'history' }] },
  { id: 'debug', label: 'Debug do Processamento', duration: '13 min', eyebrow: 'STEP INTO DA ENTRADA AO RELATÓRIO', title: 'Acompanhe uma OS crítica atravessar sete chamadas', blocks: [{ type: 'lead', text: 'Use F7 para provar onde o dado muda de entrada para resumo e onde a fila é decidida.' }, { type: 'debug' }] },
  { id: 'v2', label: 'Evolução V2', duration: '15 min', eyebrow: 'NOVA REGRA, CONTAGEM E MÉDIA', title: 'Acrescente comportamento sem bagunçar o main', blocks: [{ type: 'lead', text: 'A nova prioridade pertence à decisão de fila; as novas métricas pertencem ao relatório.' }, { type: 'v2' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DATA, NULL, PRIORIDADE E LIMITE', title: 'Diagnostique oito falhas típicas do projeto', blocks: [{ type: 'lead', text: 'Ligue cada sintoma à fronteira correta antes de alterar o código.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '16 min', eyebrow: 'CENÁRIOS, TESTES, EVIDÊNCIAS E GIT', title: 'Entregue uma OS processada com provas, não só com impressão', blocks: [{ type: 'lead', text: 'A conclusão exige código compilável, cenários normais e extremos, suíte manual, V2 e registro de aprendizagem.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'map') return <ProjectMapLab />;
  if (block.type === 'responsibilities') return <ResponsibilitiesLab />;
  if (block.type === 'source') return <SourceLab />;
  if (block.type === 'queues') return <QueueSimulatorLab />;
  if (block.type === 'validation') return <ValidationLab />;
  if (block.type === 'history') return <HistoryReportLab />;
  if (block.type === 'debug') return <DebugLab />;
  if (block.type === 'v2') return <V2Lab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedOrderServiceProcessingLesson103({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
    if (active && window.matchMedia('(max-width: 900px)').matches) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
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
  return <article className="guided-git-lesson guided-order-service-processing-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Route size={17} />Projeto procedural de backend</span><p className="guided-sequence">103 · M3.14</p><h1>Processe uma Ordem de Serviço do início ao relatório</h1><p>Leia a OS, valide o contrato, calcule dias e prioridades, sugira uma fila, preserve o histórico e explique cada decisão como em um backend real.</p></div><div className="guided-hero-status"><Workflow size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 103" items={[{ value: '3 fontes', label: 'Compiladas e verificadas' }, { value: '4 filas', label: 'Com prioridade explícita' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 103"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Processamento de OS organizado e comprovado</h3><p>{lessonComplete ? 'Aula concluída e pronta para a revisão final de fundamentos.' : 'Confira as evidências antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 102</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Entrada, regra, fila e relatório</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 104<ArrowRight size={17} /></button></footer></article>;
}
