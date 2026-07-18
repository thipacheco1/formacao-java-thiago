import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Brain, Check, CheckCircle2, ClipboardCheck, Clock3, Copy, FileCode2, GitBranch, ListChecks, Play, RotateCcw, Sparkles, StepForward, Terminal, Workflow } from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedFundamentalsReviewLesson.css';

const STORAGE_KEY = 'guided-fundamentals-review-lesson-104-progress';
const REVIEW_SOURCE = `import java.util.Scanner;

public class RevisaoFundamentosAntesDeOo {
    private static final int LIMITE_HISTORICO = 10;
    private static final int DIAS_PARA_ATRASO = 5;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ResumoSolicitacao[] historico =
                new ResumoSolicitacao[LIMITE_HISTORICO];
        int quantidadeHistorico = 0;
        boolean executando = true;

        while (executando) {
            imprimirMenu();
            int opcao = lerInteiro(scanner, "Escolha uma opção: ");
            if (opcao == 0) {
                executando = false;
            } else if (opcao == 1) {
                ResumoSolicitacao resumo = executarCadastroSolicitacao(scanner);
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
        System.out.println("REVISÃO DE FUNDAMENTOS");
        System.out.println("====================================");
        System.out.println("1 - Cadastrar solicitação");
        System.out.println("2 - Ver histórico");
        System.out.println("3 - Ver relatório");
        System.out.println("0 - Sair");
        System.out.println("------------------------------------");
    }

    public static ResumoSolicitacao executarCadastroSolicitacao(
            Scanner scanner) {
        SolicitacaoEntrada solicitacao = lerSolicitacao(scanner);
        if (!solicitacaoValida(solicitacao)) {
            imprimirErro("Solicitação inválida.");
            return null;
        }
        ResumoSolicitacao resumo = processarSolicitacao(solicitacao);
        imprimirResumoSolicitacao(resumo);
        return resumo;
    }

    public static SolicitacaoEntrada lerSolicitacao(Scanner scanner) {
        String protocolo = lerTextoObrigatorio(scanner, "Protocolo: ");
        String cliente = lerTextoObrigatorio(scanner, "Cliente: ");
        String tipo = lerTextoObrigatorio(scanner, "Tipo: ");
        Prioridade prioridade = lerPrioridade(scanner);
        int dias = lerInteiroMinimo(scanner, "Dias em aberto: ", 0);
        return new SolicitacaoEntrada(
                protocolo, cliente, tipo, prioridade, dias);
    }

    public static Prioridade lerPrioridade(Scanner scanner) {
        while (true) {
            System.out.println("Prioridade: 1 BAIXA | 2 MEDIA | 3 ALTA");
            int opcao = lerInteiro(scanner, "Prioridade: ");
            if (opcao == 1) return Prioridade.BAIXA;
            if (opcao == 2) return Prioridade.MEDIA;
            if (opcao == 3) return Prioridade.ALTA;
            imprimirErro("Prioridade inválida.");
        }
    }

    public static boolean solicitacaoValida(
            SolicitacaoEntrada solicitacao) {
        return solicitacao != null
                && textoInformado(solicitacao.protocolo())
                && textoInformado(solicitacao.cliente())
                && textoInformado(solicitacao.tipo())
                && solicitacao.prioridade() != null
                && solicitacao.diasEmAberto() >= 0;
    }

    public static boolean textoInformado(String valor) {
        return valor != null && !valor.isBlank();
    }

    public static ResumoSolicitacao processarSolicitacao(
            SolicitacaoEntrada solicitacao) {
        boolean atrasada = estaAtrasada(solicitacao.diasEmAberto());
        boolean critica = ehCritica(solicitacao.prioridade(), atrasada);
        String fila = definirFilaSugerida(critica);
        return new ResumoSolicitacao(
                solicitacao.protocolo(), solicitacao.cliente(),
                solicitacao.tipo(), solicitacao.prioridade(),
                solicitacao.diasEmAberto(), atrasada, critica, fila);
    }

    public static boolean estaAtrasada(int diasEmAberto) {
        return diasEmAberto > DIAS_PARA_ATRASO;
    }

    public static boolean ehCritica(
            Prioridade prioridade, boolean atrasada) {
        return prioridade == Prioridade.ALTA || atrasada;
    }

    public static String definirFilaSugerida(boolean critica) {
        return critica ? "Casos Críticos" : "Entrada";
    }

    public static int registrarNoHistorico(
            ResumoSolicitacao[] historico, int quantidade,
            ResumoSolicitacao resumo) {
        if (quantidade >= historico.length) {
            imprimirErro("Histórico cheio. Esta solicitação não será armazenada.");
            return quantidade;
        }
        historico[quantidade] = resumo;
        return quantidade + 1;
    }

    public static void imprimirResumoSolicitacao(
            ResumoSolicitacao resumo) {
        imprimirCabecalho("RESUMO DA SOLICITAÇÃO");
        System.out.println("Protocolo: " + resumo.protocolo());
        System.out.println("Cliente: " + resumo.cliente());
        System.out.println("Tipo: " + resumo.tipo());
        System.out.println("Prioridade: " + resumo.prioridade());
        System.out.println("Dias em aberto: " + resumo.diasEmAberto());
        System.out.println("Atrasada: " + resumo.atrasada());
        System.out.println("Crítica: " + resumo.critica());
        System.out.println("Fila sugerida: " + resumo.filaSugerida());
    }

    public static void imprimirHistorico(
            ResumoSolicitacao[] historico, int quantidade) {
        if (quantidade == 0) {
            System.out.println("Nenhuma solicitação cadastrada.");
            return;
        }
        imprimirCabecalho("HISTÓRICO");
        for (int i = 0; i < quantidade; i++) {
            ResumoSolicitacao resumo = historico[i];
            System.out.println((i + 1) + " - " + resumo.protocolo()
                    + " | Cliente: " + resumo.cliente()
                    + " | Prioridade: " + resumo.prioridade()
                    + " | Fila: " + resumo.filaSugerida());
        }
    }

    public static void imprimirRelatorio(
            ResumoSolicitacao[] historico, int quantidade) {
        if (quantidade == 0) {
            System.out.println("Não há dados para relatório.");
            return;
        }
        imprimirCabecalho("RELATÓRIO");
        System.out.println("Total de solicitações: " + quantidade);
        System.out.println("Atrasadas: "
                + contarAtrasadas(historico, quantidade));
        System.out.println("Críticas: "
                + contarCriticas(historico, quantidade));
        System.out.println("Fila Entrada: "
                + contarPorFila(historico, quantidade, "Entrada"));
        System.out.println("Fila Casos Críticos: "
                + contarPorFila(historico, quantidade, "Casos Críticos"));
        System.out.println("Média de dias em aberto: "
                + calcularMediaDiasEmAberto(historico, quantidade));
    }

    public static int contarAtrasadas(
            ResumoSolicitacao[] historico, int quantidade) {
        int contador = 0;
        for (int i = 0; i < quantidade; i++) {
            if (historico[i].atrasada()) contador++;
        }
        return contador;
    }

    public static int contarCriticas(
            ResumoSolicitacao[] historico, int quantidade) {
        int contador = 0;
        for (int i = 0; i < quantidade; i++) {
            if (historico[i].critica()) contador++;
        }
        return contador;
    }

    public static int contarPorFila(
            ResumoSolicitacao[] historico, int quantidade, String fila) {
        int contador = 0;
        for (int i = 0; i < quantidade; i++) {
            if (historico[i].filaSugerida().equals(fila)) contador++;
        }
        return contador;
    }

    public static double calcularMediaDiasEmAberto(
            ResumoSolicitacao[] historico, int quantidade) {
        int soma = 0;
        for (int i = 0; i < quantidade; i++) {
            soma += historico[i].diasEmAberto();
        }
        return (double) soma / quantidade;
    }

    public static void imprimirEncerramento(
            ResumoSolicitacao[] historico, int quantidade) {
        System.out.println("Encerrando revisão.");
        imprimirRelatorio(historico, quantidade);
    }

    public static String lerTextoObrigatorio(
            Scanner scanner, String prompt) {
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

enum Prioridade { BAIXA, MEDIA, ALTA }

record SolicitacaoEntrada(
        String protocolo, String cliente, String tipo,
        Prioridade prioridade, int diasEmAberto) {}

record ResumoSolicitacao(
        String protocolo, String cliente, String tipo,
        Prioridade prioridade, int diasEmAberto,
        boolean atrasada, boolean critica, String filaSugerida) {}`;

const TEST_SOURCE = `public class TesteRevisaoFundamentos {
    public static void main(String[] args) {
        exigir(!RevisaoFundamentosAntesDeOo.estaAtrasada(5), "limite 5");
        exigir(RevisaoFundamentosAntesDeOo.estaAtrasada(6), "atraso 6");
        exigir(RevisaoFundamentosAntesDeOo.ehCritica(
                Prioridade.ALTA, false), "alta crítica");
        exigir(RevisaoFundamentosAntesDeOo.ehCritica(
                Prioridade.BAIXA, true), "atrasada crítica");
        exigir(!RevisaoFundamentosAntesDeOo.ehCritica(
                Prioridade.MEDIA, false), "média normal");
        exigir(RevisaoFundamentosAntesDeOo.definirFilaSugerida(false)
                .equals("Entrada"), "fila entrada");
        exigir(RevisaoFundamentosAntesDeOo.definirFilaSugerida(true)
                .equals("Casos Críticos"), "fila críticos");

        ResumoSolicitacao[] historico = {
            resumo("P-1", Prioridade.BAIXA, 2, false, false, "Entrada"),
            resumo("P-2", Prioridade.ALTA, 1, false, true, "Casos Críticos"),
            resumo("P-3", Prioridade.MEDIA, 9, true, true, "Casos Críticos")
        };
        exigir(RevisaoFundamentosAntesDeOo.contarAtrasadas(
                historico, 3) == 1, "atrasadas");
        exigir(RevisaoFundamentosAntesDeOo.contarCriticas(
                historico, 3) == 2, "críticas");
        exigir(RevisaoFundamentosAntesDeOo.contarPorFila(
                historico, 3, "Entrada") == 1, "entrada");
        exigir(RevisaoFundamentosAntesDeOo.calcularMediaDiasEmAberto(
                historico, 3) == 4.0, "média");
        int quantidade = RevisaoFundamentosAntesDeOo.registrarNoHistorico(
                new ResumoSolicitacao[0], 0, historico[0]);
        exigir(quantidade == 0, "limite");
        System.out.println("TESTES OK: 12 evidências");
    }

    static ResumoSolicitacao resumo(
            String protocolo, Prioridade prioridade, int dias,
            boolean atrasada, boolean critica, String fila) {
        return new ResumoSolicitacao(protocolo, "Cliente", "Suporte",
                prioridade, dias, atrasada, critica, fila);
    }

    static void exigir(boolean condicao, String evidencia) {
        if (!condicao) throw new AssertionError(evidencia);
    }
}`;

const V2_SOURCE = `public class RevisaoFundamentosAntesDeOoV2 {
    public static void main(String[] args) {
        ResumoSolicitacao[] historico = {
            resumo("Fraude", Prioridade.MEDIA, 2),
            resumo("Suporte", Prioridade.ALTA, 8),
            resumo("Fraude", Prioridade.BAIXA, 4)
        };
        SolicitacaoEntrada fraude = new SolicitacaoEntrada(
                "P-4", "Ana", "Fraude", Prioridade.BAIXA, 0);
        System.out.println("Fraude crítica: " + ehCritica(fraude, false));
        System.out.println("Altas: " + contarAltaPrioridade(historico, 3));
        System.out.println("Fraudes: " + contarPorTipo(historico, 3, "Fraude"));
        System.out.println("Maior número de dias: "
                + maiorNumeroDiasEmAberto(historico, 3));
    }

    public static boolean ehCritica(
            SolicitacaoEntrada solicitacao, boolean atrasada) {
        return solicitacao.prioridade() == Prioridade.ALTA
                || atrasada
                || solicitacao.tipo().equalsIgnoreCase("Fraude");
    }

    public static int contarAltaPrioridade(
            ResumoSolicitacao[] historico, int quantidade) {
        int total = 0;
        for (int i = 0; i < quantidade; i++) {
            if (historico[i].prioridade() == Prioridade.ALTA) total++;
        }
        return total;
    }

    public static int contarPorTipo(
            ResumoSolicitacao[] historico, int quantidade, String tipo) {
        int total = 0;
        for (int i = 0; i < quantidade; i++) {
            if (historico[i].tipo().equalsIgnoreCase(tipo)) total++;
        }
        return total;
    }

    public static int maiorNumeroDiasEmAberto(
            ResumoSolicitacao[] historico, int quantidade) {
        int maior = 0;
        for (int i = 0; i < quantidade; i++) {
            maior = Math.max(maior, historico[i].diasEmAberto());
        }
        return maior;
    }

    static ResumoSolicitacao resumo(
            String tipo, Prioridade prioridade, int dias) {
        boolean atrasada = dias > 5;
        boolean critica = prioridade == Prioridade.ALTA
                || atrasada || tipo.equalsIgnoreCase("Fraude");
        return new ResumoSolicitacao("P", "Cliente", tipo, prioridade,
                dias, atrasada, critica,
                critica ? "Casos Críticos" : "Entrada");
    }
}`;

const FUNDAMENTALS = [
  ['Variável', 'Nomeia um estado com tipo e escopo.'], ['Tipos', 'int, double, boolean, char e String representam dados diferentes.'], ['BigDecimal', 'Use quando precisão decimal, especialmente monetária, importa.'], ['Condição', 'Escolhe um caminho a partir de uma expressão booleana.'], ['Laço', 'Repete um bloco enquanto ou para cada elemento.'], ['while', 'Adequado quando a quantidade de repetições não é conhecida.'], ['for', 'Adequado para contagem e percurso indexado.'], ['Array', 'Coleção tipada, indexada e de tamanho fixo.'], ['Método', 'Unidade nomeada de comportamento com contrato.'], ['Parâmetro', 'Dado recebido pelo método.'], ['Retorno', 'Resultado devolvido ao chamador.'], ['Escopo', 'Região em que um nome existe.'], ['null', 'Ausência de referência; exige contrato explícito.'], ['enum', 'Conjunto fechado de valores válidos.'], ['record', 'Agrupa dados com contrato imutável e conciso.'],
  ['main enxuto', 'Coordena a história e delega detalhes.'], ['Leitura', 'Converte entrada externa em dados.'], ['Validação', 'Protege pré-condições antes da regra.'], ['Cálculo', 'Transforma entradas em resultado sem imprimir.'], ['Exibição', 'Traduz estado para o usuário.'], ['Reuso', 'Uma regra possui uma única fonte de verdade.'], ['Extract Method', 'Cria uma fronteira nomeada preservando comportamento.'], ['Step Into', 'Entra na chamada para acompanhar sua execução.'], ['Call stack', 'Mostra a cadeia de chamadores e frames.'], ['Coesão', 'Um método possui um propósito claro e poucos motivos de mudança.'],
];

const ORAL_QUESTIONS = [
  ['Por que enum para prioridade?', 'Limita os valores e elimina variações de texto.'],
  ['Por que record para entrada e resumo?', 'Agrupa dados relacionados e distingue o que chega do que foi processado.'],
  ['Por que o main não calcula a fila?', 'A coordenação não deve conhecer detalhes da regra.'],
  ['Por que quantidadeHistorico?', 'Capacidade do array não informa quantas posições estão ocupadas.'],
  ['Por que não percorrer o array inteiro?', 'Posições ainda vazias são null e podem quebrar a consulta.'],
  ['Por que try/catch na leitura de inteiro?', 'Texto externo pode falhar na conversão e precisa de retry.'],
  ['Quem define se é crítica?', 'ehCritica centraliza prioridade alta ou atraso.'],
  ['Quem calcula a média?', 'calcularMediaDiasEmAberto percorre somente registros válidos.'],
  ['Onde fica a regra de atraso?', 'estaAtrasada compara dias com DIAS_PARA_ATRASO.'],
  ['Como adicionar uma nova fila?', 'Evolua o processamento e a decisão nomeada, sem inserir a regra no main.'],
];

const ERRORS = [
  ['Confundir capacidade com quantidade', 'O relatório percorre dez posições mesmo com apenas duas preenchidas.', 'Use quantidadeHistorico como limite de todos os laços.'],
  ['Limite de atraso errado', 'Cinco dias já aparecem como atrasados.', 'A regra diz mais de cinco: use diasEmAberto > 5.'],
  ['Criticidade só pela prioridade', 'Solicitação média com oito dias vai para Entrada.', 'ehCritica deve combinar prioridade ALTA || atrasada.'],
  ['Texto derruba o menu', 'abc lança NumberFormatException.', 'Capture a conversão em lerInteiro e repita a leitura.'],
  ['Média com divisão inteira', 'A média de 2, 3 e 4 vira 3 sem representar frações.', 'Converta soma ou divisor para double antes da divisão.'],
  ['Record usado como regra', 'O record começa a validar, imprimir e decidir fila.', 'Nesta revisão, records carregam dados; métodos nomeados aplicam comportamento.'],
  ['Main cresce na V2', 'A regra Fraude aparece dentro do else do menu.', 'Passe a solicitação para ehCritica e evolua a fronteira existente.'],
  ['Arquivo .class no Git', 'Artefatos compilados aparecem no commit da prática.', 'Remova .class, ajuste .gitignore e confira git status antes do commit.'],
];

const EVIDENCE = `# Aula 104 — Revisão final antes de OO

- [ ] Respondi às 25 perguntas de fundamentos e organização
- [ ] Expliquei o pipeline completo sem consultar o código
- [ ] Criei RevisaoFundamentosAntesDeOo.java
- [ ] Executei três solicitações válidas
- [ ] Testei seis entradas inválidas sem encerrar o programa
- [ ] Provei os quatro cenários de criticidade
- [ ] Conferi histórico, contadores e média
- [ ] Provei o limite de dez posições
- [ ] Usei F7 nas dez chamadas recomendadas
- [ ] Auditei sete perguntas de refatoração
- [ ] Executei TesteRevisaoFundamentos
- [ ] Respondi às dez perguntas orais
- [ ] Completei regra e três métricas da V2
- [ ] Registrei domínio, lacuna e evolução pessoal
- [ ] Revisei git status, .class e diff`;

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

function ReadinessLab() {
  const [selected, setSelected] = useState(0);
  const [mastered, setMastered] = useState([]);
  const item = FUNDAMENTALS[selected];
  const toggle = index => setMastered(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="fr104-stack"><div className="fr104-readiness"><header><Brain /><div><strong>{mastered.length} de {FUNDAMENTALS.length} explicados sem copiar</strong><span>Marque somente depois de responder com um exemplo próprio.</span></div></header><div>{FUNDAMENTALS.map((concept, index) => <button type="button" key={concept[0]} className={(selected === index ? 'active ' : '') + (mastered.includes(index) ? 'done' : '')} onClick={() => setSelected(index)}><span>{mastered.includes(index) ? <Check size={13} /> : index + 1}</span>{concept[0]}</button>)}</div><main><small>EXPLIQUE EM VOZ ALTA</small><strong>{item[0]}</strong><p>{item[1]}</p><button type="button" onClick={() => toggle(selected)}>{mastered.includes(selected) ? <RotateCcw size={15} /> : <Check size={15} />}{mastered.includes(selected) ? 'Preciso rever' : 'Consegui explicar'}</button></main></div><article className="fr104-rule"><ClipboardCheck /><div><strong>Reconhecer não é dominar</strong><span>Você está pronto quando consegue definir, exemplificar e apontar onde o conceito aparece no projeto.</span></div></article></section>;
}

function PipelineLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['Entrada', 'teclado hoje · HTTP amanhã'], ['Leitura', 'texto → tipos e enum'], ['Validação', 'pré-condições protegidas'], ['Processamento', 'atraso, criticidade e fila'], ['Resumo', 'resultado em record'], ['Exibição', 'console com intenção'], ['Histórico / relatório', 'array → indicadores'],
  ];
  const current = stages[stage];
  return <section className="fr104-stack"><div className="fr104-pipeline">{stages.map((item, index) => <button type="button" key={item[0]} className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}><span>{index < stage ? <Check size={14} /> : index + 1}</span><strong>{item[0]}</strong></button>)}</div><div className="fr104-focus"><Workflow /><div><small>FASE {stage + 1} DE {stages.length}</small><strong>{current[0]}</strong><span>{current[1]}. A forma externa muda em uma API, mas a responsabilidade permanece reconhecível.</span></div></div></section>;
}

function SourceLab() {
  const commands = ['mkdir labs\\m3\\aula-104-revisao-final-de-fundamentos-antes-de-oo', 'cd labs\\m3\\aula-104-revisao-final-de-fundamentos-antes-de-oo', 'javac RevisaoFundamentosAntesDeOo.java', 'java RevisaoFundamentosAntesDeOo'].join('\n');
  return <section className="fr104-stack"><CodePanel name="RevisaoFundamentosAntesDeOo.java" code={REVIEW_SOURCE} /><div className="fr104-terminal"><header><Terminal size={16} />Criar, compilar e executar<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}REVISÃO DE FUNDAMENTOS{`\n`}1 Cadastrar · 2 Histórico · 3 Relatório · 0 Sair</pre></div></section>;
}

function ScenarioLab() {
  const [priority, setPriority] = useState('BAIXA');
  const [days, setDays] = useState(2);
  const [type, setType] = useState('Entrega');
  const delayed = Number(days) > 5;
  const critical = priority === 'ALTA' || delayed;
  return <section className="fr104-stack"><div className="fr104-simulator"><header><GitBranch /><div><strong>Laboratório da regra</strong><span>Compare normal, alta prioridade, atraso e a futura regra de Fraude.</span></div></header><div className="fr104-controls"><label>Tipo<input value={type} onChange={event => setType(event.target.value)} /></label><label>Prioridade<select value={priority} onChange={event => setPriority(event.target.value)}>{['BAIXA', 'MEDIA', 'ALTA'].map(value => <option key={value}>{value}</option>)}</select></label><label>Dias em aberto<input type="number" min="0" value={days} onChange={event => setDays(event.target.value)} /></label></div><div className="fr104-decision"><span className={delayed ? 'hit' : ''}>dias &gt; 5 → {String(delayed)}</span><span className={priority === 'ALTA' ? 'hit' : ''}>prioridade ALTA → {String(priority === 'ALTA')}</span><strong>{critical ? 'Casos Críticos' : 'Entrada'}</strong></div></div><article className="fr104-rule"><CheckCircle2 /><div><strong>{type}: crítica = {String(critical)}</strong><span>A versão base ignora o tipo na criticidade. A V2 acrescentará Fraude dentro de ehCritica, nunca no main.</span></div></article></section>;
}

function ValidationLab() {
  const [selected, setSelected] = useState(0);
  const cases = [
    ['Menu 9', '9 → 1', '[ERRO] Opção inválida.', 'volta ao menu'], ['Protocolo vazio', '↵ → P-001', '[ERRO] Valor obrigatório.', 'repete o campo'], ['Cliente vazio', '↵ → Ana', '[ERRO] Valor obrigatório.', 'repete o campo'], ['Prioridade 7', '7 → 2', '[ERRO] Prioridade inválida.', 'repete a prioridade'], ['Dias -1', '-1 → 0', '[ERRO] Digite um valor maior ou igual a 0.', 'repete os dias'], ['Texto numérico', 'abc → 2', '[ERRO] Digite um número inteiro válido.', 'captura e repete'],
  ];
  const current = cases[selected];
  return <section className="fr104-stack"><div className="fr104-case-tabs">{cases.map((item, index) => <button type="button" key={item[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</div><div className="fr104-terminal"><header><Terminal size={16} />Console · prova de resiliência</header><pre><b>ENTRADA</b> {current[1]}{`\n`}<b>RESPOSTA</b> {current[2]}{`\n`}<b>CONTINUIDADE</b> {current[3]}</pre></div><article className="fr104-rule"><RotateCcw /><div><strong>Seis falhas, zero encerramentos inesperados</strong><span>Validação boa não apenas rejeita: informa o contrato e mantém o usuário no ponto correto.</span></div></article></section>;
}

function ReportLab() {
  const entries = [
    { protocol: 'PROT-001', priority: 'BAIXA', days: 2, delayed: false, critical: false, queue: 'Entrada' }, { protocol: 'PROT-002', priority: 'ALTA', days: 1, delayed: false, critical: true, queue: 'Casos Críticos' }, { protocol: 'PROT-003', priority: 'MEDIA', days: 8, delayed: true, critical: true, queue: 'Casos Críticos' },
  ];
  const [active, setActive] = useState(entries.map(() => true));
  const selected = entries.filter((_, index) => active[index]);
  const toggle = index => setActive(current => current.map((value, position) => position === index ? !value : value));
  const average = selected.length ? selected.reduce((sum, item) => sum + item.days, 0) / selected.length : 0;
  return <section className="fr104-stack"><div className="fr104-report"><aside>{entries.map((item, index) => <button type="button" key={item.protocol} className={active[index] ? 'active' : ''} onClick={() => toggle(index)}><span>{active[index] ? <Check size={14} /> : index + 1}</span><strong>{item.protocol}</strong><small>{item.priority} · {item.days} dias</small></button>)}</aside><main><BarChart3 /><div><small>RELATÓRIO SOBRE {selected.length} POSIÇÕES PREENCHIDAS</small><strong>Total: {selected.length}</strong><span>Atrasadas: {selected.filter(item => item.delayed).length} · Críticas: {selected.filter(item => item.critical).length}</span><span>Entrada: {selected.filter(item => item.queue === 'Entrada').length} · Casos Críticos: {selected.filter(item => item.queue === 'Casos Críticos').length}</span><b>Média de dias: {average.toFixed(2)}</b></div></main></div><article className="fr104-rule"><BarChart3 /><div><strong>Relatório deriva; não mantém contadores paralelos</strong><span>Todos os valores são recalculados somente até quantidadeHistorico, sem tocar nas posições null.</span></div></article></section>;
}

function DebugLab() {
  const [pause, setPause] = useState(0);
  const trace = [
    ['executarCadastroSolicitacao', 'entrada do fluxo', 'main'], ['lerSolicitacao', 'P-003 · Maria · Suporte', 'executarCadastroSolicitacao'], ['lerPrioridade', 'prioridade = MEDIA', 'lerSolicitacao'], ['solicitacaoValida', 'válida = true', 'executarCadastroSolicitacao'], ['processarSolicitacao', 'dias = 8', 'executarCadastroSolicitacao'], ['estaAtrasada', '8 > 5 → true', 'processarSolicitacao'], ['ehCritica', 'MEDIA || atrasada → true', 'processarSolicitacao'], ['definirFilaSugerida', 'Casos Críticos', 'processarSolicitacao'], ['registrarNoHistorico', 'índice 0 · quantidade 1', 'main'], ['imprimirRelatorio', 'críticas 1 · média 8.0', 'main'],
  ];
  const current = trace[pause];
  return <section className="fr104-stack"><div className="fr104-debug"><header><span>RevisaoFundamentosAntesDeOo.java · Debug</span><span>Step Into · F7</span></header><div><aside>{trace.map((item, index) => <button type="button" key={item[0]} className={pause === index ? 'active' : ''} onClick={() => setPause(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>VARIABLES / CALL STACK</small><strong>{current[0]}</strong><code>{current[1]}</code><span>chamador: {current[2]}</span><button type="button" disabled={pause === trace.length - 1} onClick={() => setPause(value => Math.min(value + 1, trace.length - 1))}><StepForward size={15} />Próxima pausa</button></main></div><footer>Em cada frame, diga qual variável mudou, qual contrato foi comprovado e para onde o retorno volta.</footer></div></section>;
}

function AuditLab() {
  const questions = ['O main apenas coordena?', 'Os métodos têm nomes claros?', 'Cada método faz uma coisa?', 'Validações possuem uma fonte de verdade?', 'Regras estão visíveis e nomeadas?', 'Histórico distingue capacidade de quantidade?', 'Relatório pode evoluir sem reescrever o menu?'];
  const [checked, setChecked] = useState([]);
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="fr104-stack"><div className="fr104-audit"><header><ClipboardCheck /><div><strong>Leitura crítica depois do programa funcionar</strong><span>{checked.length} de {questions.length} contratos defendidos com uma linha de evidência.</span></div></header>{questions.map((question, index) => <button type="button" key={question} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span><strong>{question}</strong><small>{checked.includes(index) ? 'evidência localizada no código' : 'clique somente após justificar'}</small></button>)}</div><article className="fr104-rule"><GitBranch /><div><strong>Refatorar não é reorganizar por estética</strong><span>Extraia ou mova código somente quando a fronteira melhora nome, reuso, teste ou compreensão sem mudar a saída.</span></div></article></section>;
}

function V2Lab() {
  const [view, setView] = useState('contract');
  return <section className="fr104-stack"><div className="fr104-toggle"><button type="button" className={view === 'contract' ? 'active' : ''} onClick={() => setView('contract')}>Contrato antes do código</button><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Modelo após tentar</button></div>{view === 'code' ? <CodePanel name="RevisaoFundamentosAntesDeOoV2.java" code={V2_SOURCE} /> : <div className="fr104-v2-map"><span>tipo Fraude</span><strong>sempre crítica</strong><span>prioridade ALTA</span><strong>contador próprio</strong><span>tipo Fraude</span><strong>contador próprio</strong><span>dias em aberto</span><strong>maior valor</strong></div>}<article className="fr104-rule"><Sparkles /><div><strong>Mude a assinatura que precisa conhecer o tipo</strong><span>ehCritica passa a receber SolicitacaoEntrada; o main continua chamando o fluxo sem conhecer Fraude.</span></div></article></section>;
}

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors fr104-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}

function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const [question, setQuestion] = useState(0);
  const checks = ['25 conceitos explicados', 'pipeline defendido', 'três fontes criadas', 'três fluxos válidos', 'seis entradas inválidas', 'quatro regras comprovadas', 'histórico conferido', 'relatório e média conferidos', 'limite 10 comprovado', 'dez frames depurados', 'sete critérios auditados', '12 testes executados', 'dez respostas orais', 'V2 com quatro mudanças', 'Git e .class revisados'];
  const commands = ['javac *.java', 'java RevisaoFundamentosAntesDeOo', 'java TesteRevisaoFundamentos', 'java RevisaoFundamentosAntesDeOoV2', 'git status', 'git add labs/m3/aula-104-revisao-final-de-fundamentos-antes-de-oo', 'git commit -m "Aula 104: revisa fundamentos antes de OO"', 'git status'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <section className="fr104-delivery"><div className="fr104-terminal"><header><Play size={15} />Compilar, testar e manter o Git limpo<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}{`\n\n`}Antes do commit: nenhum arquivo <b>.class</b> no staging.</pre></div><CodePanel name="TesteRevisaoFundamentos.java" code={TEST_SOURCE} /><div className="fr104-oral"><nav>{ORAL_QUESTIONS.map((item, index) => <button type="button" key={item[0]} className={question === index ? 'active' : ''} onClick={() => setQuestion(index)}><span>{index + 1}</span>{item[0]}</button>)}</nav><main><small>RESPONDA ANTES DE REVELAR A REFERÊNCIA</small><strong>{ORAL_QUESTIONS[question][0]}</strong><p>{ORAL_QUESTIONS[question][1]}</p></main></div><div className="fr104-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Ponte para Orientação a Objetos</h3></div><p>Registre: qual fundamento já domina, qual ainda precisa revisar e como sua organização mudou desde o início.</p><ul><li>Explique o programa inteiro sem abrir detalhes.</li><li>Localize dados que pertencem à mesma “coisa”.</li><li>Localize comportamentos que atuam sobre esses dados.</li><li>Leve essas observações para a Aula 105.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'readiness', label: 'Diagnóstico de Prontidão', duration: '16 min', eyebrow: '25 CONCEITOS, EXPLICAÇÃO E EXEMPLO', title: 'Descubra o que você realmente consegue explicar', blocks: [{ type: 'lead', text: 'Esta revisão mede compreensão ativa: definir, exemplificar e localizar cada fundamento no projeto.' }, { type: 'readiness' }] },
  { id: 'pipeline', label: 'Ponte para Backend', duration: '10 min', eyebrow: 'DO CONSOLE À FUTURA API', title: 'Reconheça o pipeline que sobreviverá à mudança de tecnologia', blocks: [{ type: 'lead', text: 'Entrada, leitura, validação, processamento, resumo, exibição e consulta continuam existindo quando o teclado virar HTTP.' }, { type: 'pipeline' }] },
  { id: 'source', label: 'Prova Prática Completa', duration: '26 min', eyebrow: 'MENU, ENUM, RECORD, ARRAY E MÉTODOS', title: 'Construa o projeto final de fundamentos sem pular contratos', blocks: [{ type: 'lead', text: 'Digite por responsabilidades, compile cedo e use a saída como baseline antes de refatorar.' }, { type: 'source' }] },
  { id: 'scenarios', label: 'Laboratório de Regras', duration: '13 min', eyebrow: 'ATRASO, PRIORIDADE E FILA', title: 'Prove os quatro cenários que definem criticidade', blocks: [{ type: 'lead', text: 'Normal, alta prioridade, atraso e combinação demonstram que regra de negócio é um contrato verificável.' }, { type: 'scenarios' }] },
  { id: 'validation', label: 'Entradas Inválidas', duration: '12 min', eyebrow: 'SEIS FALHAS SEM CRASH', title: 'Faça a borda recuperar cada erro de usuário', blocks: [{ type: 'lead', text: 'A prova não termina no fluxo feliz: menu, campos, enum e números precisam resistir a entradas reais.' }, { type: 'validation' }] },
  { id: 'report', label: 'Histórico & Relatório', duration: '13 min', eyebrow: 'ARRAY, CONTADOR, CONTAGENS E MÉDIA', title: 'Transforme três solicitações em indicadores conferíveis', blocks: [{ type: 'lead', text: 'Capacidade, quantidade, soma, média e filtros aparecem juntos sem criar estados duplicados.' }, { type: 'report' }] },
  { id: 'debug', label: 'Debug de Ponta a Ponta', duration: '14 min', eyebrow: 'DEZ CHAMADAS E UMA CALL STACK', title: 'Siga uma solicitação crítica da leitura ao relatório', blocks: [{ type: 'lead', text: 'F7 mostra onde cada valor nasce, muda, retorna e finalmente entra no histórico.' }, { type: 'debug' }] },
  { id: 'audit', label: 'Auditoria de Refatoração', duration: '11 min', eyebrow: 'SETE PERGUNTAS DE LEITURA CRÍTICA', title: 'Avalie organização sem confundir refatoração com estética', blocks: [{ type: 'lead', text: 'Código pronto para evoluir conta a história no main e mantém detalhes atrás de nomes honestos.' }, { type: 'audit' }] },
  { id: 'v2', label: 'Desafio Fraude V2', duration: '15 min', eyebrow: 'REGRA NOVA E TRÊS MÉTRICAS', title: 'Evolua criticidade e relatório sem contaminar o menu', blocks: [{ type: 'lead', text: 'Fraude força a assinatura de ehCritica a conhecer a solicitação, enquanto as novas consultas continuam no relatório.' }, { type: 'v2' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'LIMITE, MÉDIA, REGRA, NULL E GIT', title: 'Diagnostique oito sinais de base ainda frágil', blocks: [{ type: 'lead', text: 'Cada falha aponta um fundamento específico que deve ser revisto antes de avançar.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Ponte para OO', duration: '18 min', eyebrow: 'TESTES, PERGUNTAS ORAIS, GIT E REFLEXÃO', title: 'Feche a fase procedural com evidências e uma transição consciente', blocks: [{ type: 'lead', text: 'A aprovação exige explicar, executar, diagnosticar, evoluir e registrar — não apenas fazer o código compilar.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'readiness') return <ReadinessLab />;
  if (block.type === 'pipeline') return <PipelineLab />;
  if (block.type === 'source') return <SourceLab />;
  if (block.type === 'scenarios') return <ScenarioLab />;
  if (block.type === 'validation') return <ValidationLab />;
  if (block.type === 'report') return <ReportLab />;
  if (block.type === 'debug') return <DebugLab />;
  if (block.type === 'audit') return <AuditLab />;
  if (block.type === 'v2') return <V2Lab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedFundamentalsReviewLesson104({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-fundamentals-review-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><ClipboardCheck size={17} />Checkpoint antes de Orientação a Objetos</span><p className="guided-sequence">104 · M3.15</p><h1>Prove que sua base Java está pronta para mudar de fase</h1><p>Explique fundamentos, construa uma solicitação completa, teste regras e falhas, percorra a call stack, evolua o projeto e feche o Git com evidências.</p></div><div className="guided-hero-status"><Brain size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 104" items={[{ value: '25 conceitos', label: 'Explicados ativamente' }, { value: '3 fontes', label: 'Compiladas e testadas' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 104"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Fundamentos comprovados e ponte construída</h3><p>{lessonComplete ? 'Aula concluída: a próxima pergunta será quais objetos existem no problema.' : 'Confira lacunas e evidências antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 103</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Checkpoint procedural antes de OO</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 105<ArrowRight size={17} /></button></footer></article>;
}
