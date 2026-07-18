import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowLeft, ArrowRight, BarChart3, Calculator, Check, CheckCircle2, Clock3, Copy, FileCode2, GitCompareArrows, History, ListChecks, RotateCcw, Sparkles, StepForward, Terminal, Workflow } from 'lucide-react';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLesson.css';
import './guidedCalculatorRevisitedLesson.css';

const STORAGE_KEY = 'guided-calculator-revisited-lesson-102-progress';
const CALCULATOR_SOURCE = [
  'import java.util.Scanner;', '',
  'public class CalculadoraConsoleRevisitada {',
  '    private static final int LIMITE_HISTORICO = 10;', '',
  '    public static void main(String[] args) {',
  '        Scanner scanner = new Scanner(System.in);',
  '        ResultadoOperacao[] historico =',
  '                new ResultadoOperacao[LIMITE_HISTORICO];',
  '        int quantidadeHistorico = 0;',
  '        boolean executando = true;', '',
  '        while (executando) {',
  '            imprimirMenu();',
  '            int opcao = lerInteiro(scanner, "Escolha uma opção: ");', '',
  '            if (opcao == 0) {',
  '                executando = false;',
  '            } else if (opcao == 5) {',
  '                imprimirHistorico(historico, quantidadeHistorico);',
  '            } else if (opcao == 6) {',
  '                imprimirRelatorio(historico, quantidadeHistorico);',
  '            } else if (opcaoValidaDeOperacao(opcao)) {',
  '                ResultadoOperacao resultado =',
  '                        executarFluxoOperacao(scanner, opcao);',
  '                if (resultado != null) {',
  '                    quantidadeHistorico = registrarNoHistorico(',
  '                            historico, quantidadeHistorico, resultado);',
  '                }',
  '            } else {',
  '                imprimirErro("Opção inválida.");',
  '            }',
  '            imprimirLinha();',
  '        }', '',
  '        imprimirEncerramento(historico, quantidadeHistorico);',
  '    }', '',
  '    public static void imprimirMenu() {',
  '        System.out.println("====================================");',
  '        System.out.println("CALCULADORA CONSOLE");',
  '        System.out.println("====================================");',
  '        System.out.println("1 - Somar");',
  '        System.out.println("2 - Subtrair");',
  '        System.out.println("3 - Multiplicar");',
  '        System.out.println("4 - Dividir");',
  '        System.out.println("5 - Ver histórico");',
  '        System.out.println("6 - Ver relatório");',
  '        System.out.println("0 - Sair");',
  '        System.out.println("------------------------------------");',
  '    }', '',
  '    public static ResultadoOperacao executarFluxoOperacao(',
  '            Scanner scanner, int opcao) {',
  '        double primeiroNumero = lerDouble(scanner, "Primeiro número: ");',
  '        double segundoNumero = lerDouble(scanner, "Segundo número: ");', '',
  '        if (opcao == 4 && segundoNumero == 0) {',
  '            imprimirErro("Não é possível dividir por zero.");',
  '            return null;',
  '        }', '',
  '        double resultado = calcularResultado(',
  '                opcao, primeiroNumero, segundoNumero);',
  '        ResultadoOperacao operacao = new ResultadoOperacao(',
  '                nomeOperacao(opcao), primeiroNumero,',
  '                segundoNumero, resultado);',
  '        imprimirResultado(operacao);',
  '        return operacao;',
  '    }', '',
  '    public static boolean opcaoValidaDeOperacao(int opcao) {',
  '        return opcao >= 1 && opcao <= 4;',
  '    }', '',
  '    public static double calcularResultado(',
  '            int opcao, double primeiroNumero, double segundoNumero) {',
  '        if (opcao == 1) return somar(primeiroNumero, segundoNumero);',
  '        if (opcao == 2) return subtrair(primeiroNumero, segundoNumero);',
  '        if (opcao == 3) return multiplicar(primeiroNumero, segundoNumero);',
  '        if (opcao == 4) return dividir(primeiroNumero, segundoNumero);',
  '        throw new IllegalArgumentException("Operação inválida: " + opcao);',
  '    }', '',
  '    public static double somar(double a, double b) { return a + b; }',
  '    public static double subtrair(double a, double b) { return a - b; }',
  '    public static double multiplicar(double a, double b) { return a * b; }',
  '    public static double dividir(double a, double b) { return a / b; }', '',
  '    public static String nomeOperacao(int opcao) {',
  '        if (opcao == 1) return "SOMA";',
  '        if (opcao == 2) return "SUBTRAÇÃO";',
  '        if (opcao == 3) return "MULTIPLICAÇÃO";',
  '        if (opcao == 4) return "DIVISÃO";',
  '        return "DESCONHECIDA";',
  '    }', '',
  '    public static int registrarNoHistorico(',
  '            ResultadoOperacao[] historico, int quantidadeHistorico,',
  '            ResultadoOperacao resultado) {',
  '        if (quantidadeHistorico >= historico.length) {',
  '            imprimirErro("Histórico cheio. Esta operação não será armazenada.");',
  '            return quantidadeHistorico;',
  '        }',
  '        historico[quantidadeHistorico] = resultado;',
  '        return quantidadeHistorico + 1;',
  '    }', '',
  '    public static void imprimirResultado(ResultadoOperacao resultado) {',
  '        System.out.println("Resultado:");',
  '        System.out.println(resultado.primeiroNumero() + " "',
  '                + simboloOperacao(resultado.operacao()) + " "',
  '                + resultado.segundoNumero() + " = " + resultado.resultado());',
  '    }', '',
  '    public static void imprimirHistorico(',
  '            ResultadoOperacao[] historico, int quantidadeHistorico) {',
  '        if (quantidadeHistorico == 0) {',
  '            System.out.println("Nenhuma operação realizada ainda.");',
  '            return;',
  '        }',
  '        System.out.println("Histórico de operações:");',
  '        for (int indice = 0; indice < quantidadeHistorico; indice++) {',
  '            ResultadoOperacao operacao = historico[indice];',
  '            System.out.println((indice + 1) + " - "',
  '                    + operacao.operacao() + ": "',
  '                    + operacao.primeiroNumero() + " "',
  '                    + simboloOperacao(operacao.operacao()) + " "',
  '                    + operacao.segundoNumero() + " = "',
  '                    + operacao.resultado());',
  '        }',
  '    }', '',
  '    public static void imprimirRelatorio(',
  '            ResultadoOperacao[] historico, int quantidadeHistorico) {',
  '        if (quantidadeHistorico == 0) {',
  '            System.out.println("Não há dados para relatório.");',
  '            return;',
  '        }',
  '        int somas = contarOperacoes(historico, quantidadeHistorico, "SOMA");',
  '        int subtracoes = contarOperacoes(',
  '                historico, quantidadeHistorico, "SUBTRAÇÃO");',
  '        int multiplicacoes = contarOperacoes(',
  '                historico, quantidadeHistorico, "MULTIPLICAÇÃO");',
  '        int divisoes = contarOperacoes(',
  '                historico, quantidadeHistorico, "DIVISÃO");',
  '        double media = calcularMediaResultados(historico, quantidadeHistorico);', '',
  '        System.out.println("Relatório:");',
  '        System.out.println("Total de operações: " + quantidadeHistorico);',
  '        System.out.println("Somas: " + somas);',
  '        System.out.println("Subtrações: " + subtracoes);',
  '        System.out.println("Multiplicações: " + multiplicacoes);',
  '        System.out.println("Divisões: " + divisoes);',
  '        System.out.println("Média dos resultados: " + media);',
  '    }', '',
  '    public static int contarOperacoes(ResultadoOperacao[] historico,',
  '            int quantidadeHistorico, String operacao) {',
  '        int contador = 0;',
  '        for (int indice = 0; indice < quantidadeHistorico; indice++) {',
  '            if (historico[indice].operacao().equals(operacao)) contador++;',
  '        }',
  '        return contador;',
  '    }', '',
  '    public static double calcularMediaResultados(',
  '            ResultadoOperacao[] historico, int quantidadeHistorico) {',
  '        double soma = 0;',
  '        for (int indice = 0; indice < quantidadeHistorico; indice++) {',
  '            soma += historico[indice].resultado();',
  '        }',
  '        return soma / quantidadeHistorico;',
  '    }', '',
  '    public static void imprimirEncerramento(',
  '            ResultadoOperacao[] historico, int quantidadeHistorico) {',
  '        System.out.println("Encerrando calculadora.");',
  '        imprimirRelatorio(historico, quantidadeHistorico);',
  '    }', '',
  '    public static String simboloOperacao(String operacao) {',
  '        if (operacao.equals("SOMA")) return "+";',
  '        if (operacao.equals("SUBTRAÇÃO")) return "-";',
  '        if (operacao.equals("MULTIPLICAÇÃO")) return "*";',
  '        if (operacao.equals("DIVISÃO")) return "/";',
  '        return "?";',
  '    }', '',
  '    public static int lerInteiro(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            try {',
  '                return Integer.parseInt(scanner.nextLine().trim());',
  '            } catch (NumberFormatException erro) {',
  '                imprimirErro("Digite um número inteiro válido.");',
  '            }',
  '        }',
  '    }', '',
  '    public static double lerDouble(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            String linha = scanner.nextLine().trim().replace(",", ".");',
  '            try {',
  '                return Double.parseDouble(linha);',
  '            } catch (NumberFormatException erro) {',
  '                imprimirErro("Digite um número decimal válido.");',
  '            }',
  '        }',
  '    }', '',
  '    public static void imprimirErro(String mensagem) {',
  '        System.out.println("[ERRO] " + mensagem);',
  '    }', '',
  '    public static void imprimirLinha() {',
  '        System.out.println("------------------------------------");',
  '    }',
  '}', '',
  'record ResultadoOperacao(String operacao, double primeiroNumero,',
  '        double segundoNumero, double resultado) {}',
].join('\n');
const TEST_SOURCE = [
  'public class TesteCalculadoraConsole {',
  '    public static void main(String[] args) {',
  '        exigir(CalculadoraConsoleRevisitada.somar(10, 5) == 15, "soma");',
  '        exigir(CalculadoraConsoleRevisitada.subtrair(20, 3) == 17, "subtração");',
  '        exigir(CalculadoraConsoleRevisitada.multiplicar(4, 2) == 8, "multiplicação");',
  '        exigir(CalculadoraConsoleRevisitada.dividir(10, 2) == 5, "divisão");',
  '        exigir(CalculadoraConsoleRevisitada.opcaoValidaDeOperacao(4), "opção 4");',
  '        exigir(!CalculadoraConsoleRevisitada.opcaoValidaDeOperacao(9), "opção 9");', '',
  '        ResultadoOperacao[] historico = new ResultadoOperacao[2];',
  '        int quantidade = 0;',
  '        quantidade = CalculadoraConsoleRevisitada.registrarNoHistorico(',
  '                historico, quantidade, new ResultadoOperacao("SOMA", 10, 5, 15));',
  '        quantidade = CalculadoraConsoleRevisitada.registrarNoHistorico(',
  '                historico, quantidade, new ResultadoOperacao("SUBTRAÇÃO", 20, 3, 17));',
  '        quantidade = CalculadoraConsoleRevisitada.registrarNoHistorico(',
  '                historico, quantidade, new ResultadoOperacao("MULTIPLICAÇÃO", 4, 2, 8));',
  '        exigir(quantidade == 2, "limite do histórico");',
  '        exigir(CalculadoraConsoleRevisitada.calcularMediaResultados(',
  '                historico, quantidade) == 16, "média");',
  '        System.out.println("TESTES OK: 8 evidências");',
  '    }', '',
  '    static void exigir(boolean condicao, String evidencia) {',
  '        if (!condicao) throw new AssertionError(evidencia);',
  '    }',
  '}',
].join('\n');
const V2_SOURCE = [
  'public class CalculadoraConsoleRevisitadaV2 {',
  '    public static void main(String[] args) {',
  '        ResultadoOperacao[] dados = {',
  '            new ResultadoOperacao("SUBTRAÇÃO", 5, 10, -5),',
  '            new ResultadoOperacao("SUBTRAÇÃO", 5, 5, 0),',
  '            new ResultadoOperacao("SOMA", 10, 5, 15),',
  '            new ResultadoOperacao("SOMA", 10, 7, 17),',
  '            new ResultadoOperacao("MULTIPLICAÇÃO", 4, 2, 8)',
  '        };',
  '        System.out.println("Maior: " + calcularMaiorResultado(dados, 5));',
  '        System.out.println("Menor: " + calcularMenorResultado(dados, 5));',
  '        System.out.println("Positivos: " + contarPositivos(dados, 5));',
  '        System.out.println("Negativos: " + contarNegativos(dados, 5));',
  '        System.out.println("Zerados: " + contarZerados(dados, 5));',
  '    }', '',
  '    static double calcularMaiorResultado(ResultadoOperacao[] dados, int qtd) {',
  '        double maior = dados[0].resultado();',
  '        for (int i = 1; i < qtd; i++) maior = Math.max(maior, dados[i].resultado());',
  '        return maior;',
  '    }', '',
  '    static double calcularMenorResultado(ResultadoOperacao[] dados, int qtd) {',
  '        double menor = dados[0].resultado();',
  '        for (int i = 1; i < qtd; i++) menor = Math.min(menor, dados[i].resultado());',
  '        return menor;',
  '    }', '',
  '    static int contarPositivos(ResultadoOperacao[] dados, int qtd) {',
  '        int total = 0;',
  '        for (int i = 0; i < qtd; i++) if (dados[i].resultado() > 0) total++;',
  '        return total;',
  '    }', '',
  '    static int contarNegativos(ResultadoOperacao[] dados, int qtd) {',
  '        int total = 0;',
  '        for (int i = 0; i < qtd; i++) if (dados[i].resultado() < 0) total++;',
  '        return total;',
  '    }', '',
  '    static int contarZerados(ResultadoOperacao[] dados, int qtd) {',
  '        int total = 0;',
  '        for (int i = 0; i < qtd; i++) if (dados[i].resultado() == 0) total++;',
  '        return total;',
  '    }',
  '}',
].join('\n');
const EVIDENCE = [
  '# Aula 102 — Calculadora console revisitada', '',
  '- [ ] Expliquei o ciclo do menu',
  '- [ ] Reconheci as extrações feitas com Extract Method',
  '- [ ] Criei CalculadoraConsoleRevisitada.java',
  '- [ ] Testei soma, subtração, multiplicação e divisão',
  '- [ ] Testei opção e texto inválidos',
  '- [ ] Provei o bloqueio da divisão por zero',
  '- [ ] Confirmei que erro não entra no histórico',
  '- [ ] Exibi três operações em ordem',
  '- [ ] Validei contadores e média do relatório',
  '- [ ] Testei o limite de dez posições',
  '- [ ] Usei F7 nas cinco chamadas críticas',
  '- [ ] Executei TesteCalculadoraConsole',
  '- [ ] Completei o relatório V2',
  '- [ ] Respondi as três perguntas',
  '- [ ] Revisei git diff e artefatos .class',
].join('\n');
const ERRORS = [
  ['Dividir antes de validar', 'O cálculo produz Infinity ou resultado sem sentido.', 'Bloqueie segundoNumero == 0 antes de chamar dividir.'],
  ['Registrar null', 'Uma divisão rejeitada ocupa posição ou causa NullPointerException.', 'Só registre quando executarFluxoOperacao devolver resultado.'],
  ['Estourar o array', 'A 11ª operação tenta acessar índice 10.', 'Compare quantidadeHistorico com historico.length antes de gravar.'],
  ['Média sobre capacidade', 'Posições null entram no divisor e distorcem o relatório.', 'Percorra e divida somente por quantidadeHistorico.'],
  ['Scanner quebrando o loop', 'Texto no menu encerra o programa com NumberFormatException.', 'Centralize retry em lerInteiro e lerDouble.'],
  ['Main calcula tudo', 'Menu, fórmula, histórico e relatório voltam ao mesmo método.', 'Deixe o main rotear e delegue cada responsabilidade.'],
  ['Opção 5 pede números', 'Histórico é tratado como operação matemática.', 'Separe comandos 0, 5 e 6 antes da faixa 1 a 4.'],
  ['V2 altera o fluxo', 'A melhoria de relatório reescreve regras já provadas.', 'Acrescente consultas sobre o histórico sem bagunçar o main.'],
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
function FlowMapLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    ['Menu', 'imprimirMenu', 'mostra 0–6'],
    ['Opção', 'lerInteiro', 'repete até inteiro'],
    ['Roteamento', 'if / else if', 'sair, consultar ou operar'],
    ['Operação', 'executarFluxoOperacao', 'lê, valida e calcula'],
    ['Histórico', 'registrarNoHistorico', 'guarda se houver resultado'],
    ['Repetir', 'while (executando)', 'volta ao menu'],
  ];
  const current = stages[stage];
  return <section className="cr102-stack"><div className="cr102-flow">{stages.map((item, index) => <button type="button" key={item[0]} className={(stage === index ? 'active ' : '') + (index < stage ? 'done' : '')} onClick={() => setStage(index)}><span>{index < stage ? <Check size={14} /> : index + 1}</span><strong>{item[0]}</strong><small>{item[1]}</small></button>)}</div><div className="cr102-focus"><Workflow /><div><small>{current[1]}</small><strong>{current[0]}</strong><span>{current[2]}. O main coordena o ciclo sem conhecer as fórmulas nem os detalhes do relatório.</span></div></div></section>;
}
function ResponsibilitiesLab() {
  const [group, setGroup] = useState(0);
  const groups = [
    ['Leitura', ['lerInteiro', 'lerDouble'], 'converte texto com retry'],
    ['Validação', ['opcaoValidaDeOperacao', 'divisão por zero', 'limite do histórico'], 'impede estado inválido'],
    ['Cálculo', ['calcularResultado', 'somar', 'subtrair', 'multiplicar', 'dividir'], 'produz resultado numérico'],
    ['Histórico', ['registrarNoHistorico', 'ResultadoOperacao[]', 'ResultadoOperacao'], 'preserva até dez evidências'],
    ['Exibição', ['imprimirMenu', 'imprimirResultado', 'imprimirHistorico', 'imprimirRelatorio'], 'traduz estado para console'],
  ];
  const current = groups[group];
  return <section className="cr102-stack"><div className="cr102-responsibilities"><nav>{groups.map((item, index) => <button type="button" key={item[0]} className={group === index ? 'active' : ''} onClick={() => setGroup(index)}><span>{index + 1}</span>{item[0]}</button>)}</nav><main><small>{current[0].toUpperCase()}</small><p>{current[2]}</p><div>{current[1].map(item => <code key={item}>{item}</code>)}</div></main></div><article className="cr102-rule"><CheckCircle2 /><div><strong>Um arquivo, responsabilidades separadas</strong><span>O objetivo é consolidar arquitetura procedural; separar em classes agora anteciparia a próxima fase.</span></div></article></section>;
}
function SourceLab() {
  return <section className="cr102-stack"><CodePanel name="CalculadoraConsoleRevisitada.java" code={CALCULATOR_SOURCE} /><div className="cr102-terminal"><header><Terminal size={16} />Compilar e iniciar<CopyButton value={'javac CalculadoraConsoleRevisitada.java\njava CalculadoraConsoleRevisitada'} /></header><pre><b>PS&gt;</b> javac CalculadoraConsoleRevisitada.java{`\n`}<b>PS&gt;</b> java CalculadoraConsoleRevisitada{`\n`}CALCULADORA CONSOLE{`\n`}1 Somar · 2 Subtrair · 3 Multiplicar · 4 Dividir{`\n`}5 Histórico · 6 Relatório · 0 Sair</pre></div></section>;
}
function OperationLab() {
  const [operation, setOperation] = useState(1);
  const [a, setA] = useState(10);
  const [b, setB] = useState(5);
  const names = ['SOMA', 'SUBTRAÇÃO', 'MULTIPLICAÇÃO', 'DIVISÃO'];
  const symbols = ['+', '-', '*', '/'];
  const invalid = operation === 4 && Number(b) === 0;
  const values = [Number(a) + Number(b), Number(a) - Number(b), Number(a) * Number(b), Number(a) / Number(b)];
  return <section className="cr102-stack"><div className="cr102-operation"><div className="cr102-operation-tabs">{names.map((name, index) => <button type="button" key={name} className={operation === index + 1 ? 'active' : ''} onClick={() => setOperation(index + 1)}><span>{index + 1}</span>{name}</button>)}</div><div className="cr102-operation-body"><label>Primeiro número<input type="number" value={a} onChange={event => setA(event.target.value)} /></label><strong>{symbols[operation - 1]}</strong><label>Segundo número<input type="number" value={b} onChange={event => setB(event.target.value)} /></label><span>=</span><output className={invalid ? 'invalid' : ''}>{invalid ? 'BLOQUEADA' : values[operation - 1]}</output></div></div><article className={invalid ? 'cr102-warning' : 'cr102-rule'}>{invalid ? <AlertTriangle /> : <Calculator />}<div><strong>{invalid ? 'Não é possível dividir por zero' : `${names[operation - 1]} gera um ResultadoOperacao`}</strong><span>{invalid ? 'O fluxo devolve null e não altera o histórico.' : 'Nome, operandos e resultado viajam juntos no record.'}</span></div></article></section>;
}
function ValidationLab() {
  const [caseIndex, setCaseIndex] = useState(0);
  const cases = [
    ['Opção 9', '9', '[ERRO] Opção inválida.', 'volta ao menu'],
    ['Texto no menu', 'abc → 1', '[ERRO] Digite um número inteiro válido.', 'repete a leitura'],
    ['Decimal com vírgula', '10,5', '10.5', 'normaliza antes do parse'],
    ['Divisão por zero', '4 · 10 · 0', '[ERRO] Não é possível dividir por zero.', 'não registra'],
  ];
  const current = cases[caseIndex];
  return <section className="cr102-stack"><div className="cr102-case-tabs">{cases.map((item, index) => <button type="button" key={item[0]} className={caseIndex === index ? 'active' : ''} onClick={() => setCaseIndex(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</div><div className="cr102-terminal"><header><Terminal size={16} />Console · cenário controlado</header><pre><b>ENTRADA</b> {current[1]}{`\n`}<b>RESPOSTA</b> {current[2]}{`\n`}<b>CONTINUIDADE</b> {current[3]}</pre></div><article className="cr102-rule"><RotateCcw /><div><strong>Entrada inválida não encerra o processo</strong><span>Os métodos de leitura repetem conversão; regras de negócio rejeitam sem corromper o histórico.</span></div></article></section>;
}
function HistoryLab() {
  const [items, setItems] = useState([
    { name: 'SOMA', expression: '10 + 5', value: 15 },
    { name: 'SUBTRAÇÃO', expression: '20 - 3', value: 17 },
    { name: 'MULTIPLICAÇÃO', expression: '4 × 2', value: 8 },
  ]);
  const add = () => setItems(current => current.length >= 10 ? current : [...current, { name: 'SOMA', expression: '1 + 1', value: 2 }]);
  return <section className="cr102-stack"><div className="cr102-history"><header><History /><div><strong>{items.length} de 10 posições ocupadas</strong><span>quantidadeHistorico aponta para a próxima posição livre</span></div><button type="button" onClick={add} disabled={items.length >= 10}>Registrar +1</button></header><div>{Array.from({ length: 10 }, (_, index) => <button type="button" key={index} className={index < items.length ? 'filled' : ''}><span>{index}</span><strong>{index < items.length ? items[index].name : 'null'}</strong><small>{index < items.length ? `${items[index].expression} = ${items[index].value}` : 'livre'}</small></button>)}</div></div>{items.length >= 10 && <article className="cr102-warning"><AlertTriangle /><div><strong>Histórico cheio</strong><span>A próxima operação ainda pode ser calculada e exibida, mas `registrarNoHistorico` mantém a quantidade em 10.</span></div></article>}</section>;
}
function ReportLab() {
  const [active, setActive] = useState([true, true, true, false]);
  const operations = [
    ['SOMA', 15], ['SUBTRAÇÃO', 17], ['MULTIPLICAÇÃO', 8], ['DIVISÃO', 5],
  ];
  const selected = operations.filter((_, index) => active[index]);
  const mean = selected.length ? selected.reduce((sum, item) => sum + item[1], 0) / selected.length : 0;
  const toggle = index => setActive(current => current.map((value, position) => position === index ? !value : value));
  return <section className="cr102-stack"><div className="cr102-report"><aside>{operations.map((item, index) => <button type="button" key={item[0]} className={active[index] ? 'active' : ''} onClick={() => toggle(index)}><span>{active[index] ? <Check size={14} /> : index + 1}</span><strong>{item[0]}</strong><small>resultado {item[1]}</small></button>)}</aside><main><BarChart3 /><div><small>RELATÓRIO DERIVADO DO HISTÓRICO</small><strong>Total: {selected.length}</strong><span>Somas: {selected.filter(item => item[0] === 'SOMA').length} · Subtrações: {selected.filter(item => item[0] === 'SUBTRAÇÃO').length}</span><span>Multiplicações: {selected.filter(item => item[0] === 'MULTIPLICAÇÃO').length} · Divisões: {selected.filter(item => item[0] === 'DIVISÃO').length}</span><b>Média: {mean}</b></div></main></div><article className="cr102-rule"><GitCompareArrows /><div><strong>Relatório consulta, não duplica estado</strong><span>Contadores e média são recalculados sobre as posições realmente ocupadas.</span></div></article></section>;
}
function DebugLab() {
  const [step, setStep] = useState(0);
  const trace = [
    ['lerInteiro', 'opcao = 1', 'main'],
    ['executarFluxoOperacao', 'primeiro = 10 · segundo = 5', 'main'],
    ['calcularResultado', 'resultado = 15', 'executarFluxoOperacao'],
    ['registrarNoHistorico', 'índice = 0 · quantidade = 1', 'main'],
    ['imprimirRelatorio', 'total = 1 · média = 15', 'main'],
  ];
  const current = trace[step];
  return <section className="cr102-stack"><div className="cr102-debug"><header><span>CalculadoraConsoleRevisitada.java · Debug</span><span>Step Into · F7</span></header><div><aside>{trace.map((item, index) => <button type="button" key={item[0]} className={step === index ? 'active' : ''} onClick={() => setStep(index)}><span>{index + 1}</span><strong>{item[0]}</strong></button>)}</aside><main><small>VARIABLES</small><strong>{current[0]}</strong><code>{current[1]}</code><span>chamador: {current[2]}</span><button type="button" disabled={step === trace.length - 1} onClick={() => setStep(value => Math.min(value + 1, trace.length - 1))}><StepForward size={15} />Próxima pausa</button></main></div><footer>Observe opção, operandos, record criado, posição do array e contadores do relatório.</footer></div></section>;
}
function V2Lab() {
  const [view, setView] = useState('code');
  return <section className="cr102-stack"><div className="cr102-toggle"><button type="button" className={view === 'code' ? 'active' : ''} onClick={() => setView('code')}>Modelo V2 após tentar</button><button type="button" className={view === 'output' ? 'active' : ''} onClick={() => setView('output')}>Saída esperada</button></div>{view === 'code' ? <CodePanel name="CalculadoraConsoleRevisitadaV2.java" code={V2_SOURCE} /> : <div className="cr102-terminal"><pre>Maior: 17.0{`\n`}Menor: -5.0{`\n`}Positivos: 3{`\n`}Negativos: 1{`\n`}Zerados: 1</pre></div>}<article className="cr102-rule"><Sparkles /><div><strong>Evolua o relatório sem reescrever o ciclo</strong><span>As cinco consultas recebem histórico e quantidade; o main original continua apenas roteando a opção 6.</span></div></article><div className="cr102-improvements"><span>switch moderno</span><span>enum de operação</span><span>formatação decimal</span><span>substituir null</span><span>limpar histórico</span><span>classes no futuro</span></div></section>;
}
function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const current = ERRORS[selected];
  return <section className="guided-errors cr102-errors"><div className="guided-error-tabs">{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article className="guided-error-card"><header><AlertTriangle size={19} /><div><small>CASO {selected + 1} DE {ERRORS.length}</small><strong>{current[0]}</strong></div></header><div className="guided-error-body"><section><small>SINTOMA / CAUSA</small><p>{current[1]}</p></section><ArrowRight /><section><small>COMO CORRIGIR</small><p>{current[2]}</p></section></div></article></section>;
}
function DeliveryLab() {
  const [checked, setChecked] = useState([]);
  const checks = ['três fontes criadas', 'menu 0–6 explicado', 'quatro operações testadas', 'opção inválida testada', 'retry numérico testado', 'divisão por zero rejeitada', 'null fora do histórico', 'três registros em ordem', 'relatório conferido', 'limite 10 conferido', 'F7 em cinco chamadas', 'oito evidências automatizadas', 'V2 com cinco métricas', 'três respostas registradas', 'diff e .class revisados'];
  const commands = ['javac *.java', 'java CalculadoraConsoleRevisitada', 'java TesteCalculadoraConsole', 'java CalculadoraConsoleRevisitadaV2', 'git diff'].join('\n');
  const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  return <section className="cr102-delivery"><div className="cr102-terminal"><header><Terminal size={15} />Compilar projeto, testes e V2<CopyButton value={commands} /></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS> ')}</pre></div><CodePanel name="TesteCalculadoraConsole.java" code={TEST_SOURCE} /><div className="cr102-checks">{checks.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14} /> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: relatório V2 sem bagunçar o main</h3></div><p>Implemente maior, menor, positivos, negativos e zerados antes de abrir o modelo. Todas as consultas devem respeitar <code>quantidadeHistorico</code>.</p><ul><li>Teste um conjunto só com valores negativos.</li><li>Teste zero separadamente de positivo e negativo.</li><li>Não percorra posições <code>null</code>.</li><li>Mantenha menu, leitura e registro intactos.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16} />README.md · evidências<CopyButton value={EVIDENCE} /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>;
}

const steps = [
  { id: 'flow', label: 'Mapa do Projeto', duration: '10 min', eyebrow: 'MENU, ROTEAMENTO E REPETIÇÃO', title: 'Enxergue o ciclo completo antes de digitar métodos', blocks: [{ type: 'lead', text: 'A calculadora agora é um pequeno sistema procedural: recebe comandos, produz resultados, mantém histórico e deriva relatório.' }, { type: 'flow' }] },
  { id: 'responsibilities', label: 'Responsabilidades', duration: '11 min', eyebrow: 'LEITURA, VALIDAÇÃO, CÁLCULO, HISTÓRICO E SAÍDA', title: 'Localize cada regra no grupo que deve conhecê-la', blocks: [{ type: 'lead', text: 'Um único arquivo não obriga um único método: cada motivo de mudança continua com um dono claro.' }, { type: 'responsibilities' }] },
  { id: 'source', label: 'Código Completo', duration: '22 min', eyebrow: 'PROJETO EXECUTÁVEL EM UM ARQUIVO', title: 'Construa a calculadora inteira sem pular o fluxo principal', blocks: [{ type: 'lead', text: 'Leia o código do main para os detalhes e compile antes de iniciar os cenários de teste.' }, { type: 'source' }] },
  { id: 'operations', label: 'Laboratório de Operações', duration: '12 min', eyebrow: 'QUATRO CÁLCULOS E UM RECORD', title: 'Calcule, nomeie e empacote cada operação', blocks: [{ type: 'lead', text: 'O resultado deixa de ser um double solto: operação, operandos e valor formam uma evidência armazenável.' }, { type: 'operations' }] },
  { id: 'validation', label: 'Entradas e Guardas', duration: '12 min', eyebrow: 'RETRY, OPÇÃO, VÍRGULA E ZERO', title: 'Faça erros voltarem ao fluxo sem derrubar o programa', blocks: [{ type: 'lead', text: 'Conversões repetem leitura; regras rejeitam comandos ou operações sem alterar o estado já válido.' }, { type: 'validation' }] },
  { id: 'history', label: 'Histórico de 10 Posições', duration: '13 min', eyebrow: 'ARRAY, ÍNDICE E LIMITE', title: 'Veja quantidadeHistorico avançar sem estourar o array', blocks: [{ type: 'lead', text: 'O array tem capacidade dez, mas somente as posições anteriores à quantidade estão preenchidas e podem ser consultadas.' }, { type: 'history' }] },
  { id: 'report', label: 'Relatório Derivado', duration: '12 min', eyebrow: 'CONTADORES E MÉDIA SOBRE DADOS REAIS', title: 'Transforme histórico em informação sem duplicar estado', blocks: [{ type: 'lead', text: 'Total, contagem por tipo e média são consultas calculadas apenas sobre operações registradas.' }, { type: 'report' }] },
  { id: 'debug', label: 'Debug do Fluxo', duration: '13 min', eyebrow: 'F7 EM CINCO CHAMADAS CRÍTICAS', title: 'Siga uma soma do menu até o relatório', blocks: [{ type: 'lead', text: 'O debug conecta opção, operandos, ResultadoOperacao, posição do histórico e métricas finais.' }, { type: 'debug' }] },
  { id: 'v2', label: 'Extensão de Relatório V2', duration: '14 min', eyebrow: 'MAIOR, MENOR, POSITIVOS, NEGATIVOS E ZERO', title: 'Evolua uma responsabilidade sem reabrir todo o projeto', blocks: [{ type: 'lead', text: 'A melhoria consulta o histórico existente e preserva menu, cálculos, leitura e registro já provados.' }, { type: 'v2' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'ESTADO, LIMITE, NULL E COORDENAÇÃO', title: 'Diagnostique oito falhas que quebram o projeto por dentro', blocks: [{ type: 'lead', text: 'Cada caso liga um sintoma de console à regra ou fronteira responsável pela recuperação.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '14 min', eyebrow: 'CENÁRIOS, TESTES, REGISTRO E GIT', title: 'Entregue o projeto com provas normais, inválidas e de limite', blocks: [{ type: 'lead', text: 'A conclusão exige o programa completo, uma suíte manual executável, o relatório V2 e evidências revisáveis.' }, { type: 'delivery' }] },
];

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'flow') return <FlowMapLab />;
  if (block.type === 'responsibilities') return <ResponsibilitiesLab />;
  if (block.type === 'source') return <SourceLab />;
  if (block.type === 'operations') return <OperationLab />;
  if (block.type === 'validation') return <ValidationLab />;
  if (block.type === 'history') return <HistoryLab />;
  if (block.type === 'report') return <ReportLab />;
  if (block.type === 'debug') return <DebugLab />;
  if (block.type === 'v2') return <V2Lab />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

export default function GuidedCalculatorRevisitedLesson102({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
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
  return <article className="guided-git-lesson guided-calculator-revisited-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Calculator size={17} />Projeto procedural integrado</span><p className="guided-sequence">102 · M3.13</p><h1>Transforme a calculadora em um pequeno sistema</h1><p>Integre menu, leitura robusta, quatro operações, histórico limitado, relatório, debug e evolução V2 sem deixar o main crescer.</p></div><div className="guided-hero-status"><BarChart3 size={42} /><strong>{Math.round(completedSteps.size / steps.length * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 102" items={[{ value: '3 fontes', label: 'Compiladas e executadas' }, { value: '10 posições', label: 'No histórico limitado' }, { value: '8 casos', label: 'Na clínica de erros' }]} /><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 102"><div className="guided-step-nav-title"><ListChecks size={18} />Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block} />)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} />Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16} />Desmarcar etapa</> : <><CheckCircle2 size={16} />Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17} /></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Calculadora organizada, testada e evoluída</h3><p>{lessonComplete ? 'Aula concluída e pronta para o projeto de processamento de OS.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} />Aula 101</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18} /><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>Menu, histórico e relatório</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 103<ArrowRight size={17} /></button></footer></article>;
}
