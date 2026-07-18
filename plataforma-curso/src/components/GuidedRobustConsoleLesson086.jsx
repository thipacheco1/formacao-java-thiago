import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Copy, FileCode2, Keyboard, Lightbulb, ListChecks, Play, RotateCcw, Sparkles, Terminal, Wrench } from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedLocaleNumberFormatLesson.css';
import './guidedRobustConsoleLesson.css';

const STORAGE_KEY = 'guided-robust-console-lesson-086-progress';
const MAIN_PROGRAM = [
  'import java.math.BigDecimal;',
  'import java.time.LocalDate;',
  'import java.time.format.DateTimeParseException;',
  'import java.util.Scanner;',
  '',
  'public class CadastroConsole {',
  '    public static void main(String[] args) {',
  '        String entradas = String.join(System.lineSeparator(),',
  '                "", "   Ana   ", "abc", "200", "42",',
  '                "zero", "10,50", "talvez", "S",',
  '                "2026-02-30", "2026-07-07");',
  '',
  '        try (Scanner scanner = new Scanner(entradas)) {',
  '            String nome = lerTextoObrigatorio(scanner, "Nome obrigatório: ");',
  '            int idade = lerInteiroEntre(scanner, "Idade (0 a 130): ", 0, 130);',
  '            BigDecimal valor = lerDecimalPositivo(scanner, "Valor do pagamento: ");',
  '            boolean continuar = confirmar(scanner, "Continuar? (S/N): ");',
  '            LocalDate data = lerDataIso(scanner, "Data (yyyy-MM-dd): ");',
  '',
  '            System.out.println("Cadastro válido:");',
  '            System.out.println(nome + " | " + idade + " | "',
  '                    + valor + " | " + continuar + " | " + data);',
  '        }',
  '    }',
  '',
  '    static String lerTextoObrigatorio(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            String valor = scanner.nextLine().strip();',
  '            if (!valor.isBlank()) return valor;',
  '            System.out.println("Valor obrigatório. Tente novamente.");',
  '        }',
  '    }',
  '',
  '    static int lerInteiroEntre(Scanner scanner, String prompt, int min, int max) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            String linha = scanner.nextLine().strip();',
  '            try {',
  '                int valor = Integer.parseInt(linha);',
  '                if (valor >= min && valor <= max) return valor;',
  '                System.out.println("Digite um valor entre " + min + " e " + max + ".");',
  '            } catch (NumberFormatException erro) {',
  '                System.out.println("Digite um número inteiro válido.");',
  '            }',
  '        }',
  '    }',
  '',
  '    static BigDecimal lerDecimalPositivo(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            String linha = scanner.nextLine().strip().replace(",", ".");',
  '            try {',
  '                BigDecimal valor = new BigDecimal(linha);',
  '                if (valor.compareTo(BigDecimal.ZERO) > 0) return valor;',
  '                System.out.println("O valor deve ser maior que zero.");',
  '            } catch (NumberFormatException erro) {',
  '                System.out.println("Digite um valor decimal válido. Exemplo: 10.50");',
  '            }',
  '        }',
  '    }',
  '',
  '    static boolean confirmar(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            String resposta = scanner.nextLine().strip();',
  '            if (resposta.equalsIgnoreCase("S") || resposta.equalsIgnoreCase("SIM")) return true;',
  '            if (resposta.equalsIgnoreCase("N") || resposta.equalsIgnoreCase("NAO")',
  '                    || resposta.equalsIgnoreCase("NÃO")) return false;',
  '            System.out.println("Resposta inválida. Digite S para sim ou N para não.");',
  '        }',
  '    }',
  '',
  '    static LocalDate lerDataIso(Scanner scanner, String prompt) {',
  '        while (true) {',
  '            System.out.print(prompt);',
  '            String linha = scanner.nextLine().strip();',
  '            try {',
  '                return LocalDate.parse(linha);',
  '            } catch (DateTimeParseException erro) {',
  '                System.out.println("Data inválida. Use yyyy-MM-dd. Exemplo: 2026-07-07");',
  '            }',
  '        }',
  '    }',
  '}',
].join('\n');

const EXPECTED_OUTPUT = [
  'Nome obrigatório: Valor obrigatório. Tente novamente.',
  'Nome obrigatório: Idade (0 a 130): Digite um número inteiro válido.',
  'Idade (0 a 130): Digite um valor entre 0 e 130.',
  'Idade (0 a 130): Valor do pagamento: Digite um valor decimal válido. Exemplo: 10.50',
  'Valor do pagamento: Continuar? (S/N): Resposta inválida. Digite S para sim ou N para não.',
  'Continuar? (S/N): Data (yyyy-MM-dd): Data inválida. Use yyyy-MM-dd. Exemplo: 2026-07-07',
  'Data (yyyy-MM-dd): Cadastro válido:',
  'Ana | 42 | 10.50 | true | 2026-07-07',
].join('\n');

const EVIDENCE = [
  '# Aula 086 — Console robusto', '',
  '- [ ] Diferenciei entrada, saída, print e println',
  '- [ ] Expliquei por que nextInt seguido de nextLine pula a leitura',
  '- [ ] Li todas as entradas com nextLine',
  '- [ ] Normalizei texto com strip e rejeitei vazio com isBlank',
  '- [ ] Tratei formato numérico e validei faixa',
  '- [ ] Li dinheiro com BigDecimal e aceitei vírgula conscientemente',
  '- [ ] Validei confirmação S/N e LocalDate ISO',
  '- [ ] Construí menu com repetição e saída explícita',
  '- [ ] Separei leitura em métodos pequenos',
  '- [ ] Diagnostiquei dez falhas comuns',
  '- [ ] Compilei, executei, depurei e revisei o diff',
].join('\n');

function CopyButton({ value, label = 'Copiar' }) { const [copied, setCopied] = useState(false); const copy = async () => { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }; return <button type="button" className="ln73-copy" onClick={copy}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : label}</button>; }
function CodePanel({ name, code, language = 'java' }) { return <section className="guided-file ln73-code"><div className="guided-file-title"><FileCode2 size={16}/>{name}<CopyButton value={code}/></div><SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={language === 'java'} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{code}</SyntaxHighlighter></section>; }

function ConsoleContractLab() { const [mode, setMode] = useState('print'); return <section className="co86-stack"><div className="co86-io"><article><Keyboard/><small>ENTRADA · System.in</small><strong>teclado → Scanner</strong></article><ArrowRight/><article><Terminal/><small>SAÍDA · System.out</small><strong>prompt, erro e resultado</strong></article></div><div className="co86-toggle"><button type="button" className={mode === 'print' ? 'active' : ''} onClick={() => setMode('print')}>print</button><button type="button" className={mode === 'println' ? 'active' : ''} onClick={() => setMode('println')}>println</button></div><div className="co86-terminal"><span>Digite seu nome:{mode === 'println' && <br/>}<b className={mode === 'print' ? 'same-line' : ''}>Ana</b></span><i>{mode === 'print' ? 'cursor permanece na mesma linha do prompt' : 'cursor começa na linha seguinte'}</i></div><CodePanel name="Contrato mínimo" code={'Scanner scanner = new Scanner(System.in);\n\nSystem.out.print("Digite seu nome: ");\nString nome = scanner.nextLine();\nSystem.out.println("Olá, " + nome + "!");'}/><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Não feche System.in cedo demais</strong><p>Fechar o Scanner também fecha a entrada padrão. Em um programa curto isso pode ser aceitável; em fluxo compartilhado, impede leituras posteriores.</p></div></aside></section>; }

function BufferLab() { const [strategy, setStrategy] = useState('mixed'); const mixed = strategy === 'mixed'; return <section className="co86-stack"><div className="co86-toggle"><button type="button" className={mixed ? 'active danger' : ''} onClick={() => setStrategy('mixed')}>nextInt + nextLine</button><button type="button" className={!mixed ? 'active' : ''} onClick={() => setStrategy('line')}>nextLine + parseInt</button></div><div className="co86-buffer"><div><small>BUFFER DE ENTRADA</small><code>{mixed ? '30↵' : '30↵'}</code></div><ArrowDown/><ol>{mixed ? <><li><b>nextInt()</b> consome <code>30</code></li><li className="danger"><b>↵ permanece</b> no buffer</li><li><b>nextLine()</b> consome apenas <code>↵</code></li><li className="danger">nome vira texto vazio</li></> : <><li><b>nextLine()</b> consome <code>30↵</code></li><li><b>strip()</b> produz <code>30</code></li><li><b>Integer.parseInt</b> converte com controle</li><li className="success">próxima linha começa limpa</li></>}</ol></div><CodePanel name={mixed ? 'ProblemaNextInt.java' : 'Estratégia previsível'} code={mixed ? 'int idade = scanner.nextInt();\nString nome = scanner.nextLine(); // lê o Enter pendente' : 'String linha = scanner.nextLine().strip();\ntry {\n    int idade = Integer.parseInt(linha);\n} catch (NumberFormatException erro) {\n    System.out.println("Digite um inteiro válido.");\n}'}/></section>; }

function TextPipelineLab() { const [raw, setRaw] = useState('   Ana   '); const clean = raw.trim(); return <section className="co86-stack"><label className="co86-field">Entrada bruta<input value={raw} onChange={event => setRaw(event.target.value)} aria-label="Entrada bruta"/></label><div className="co86-pipeline"><span>nextLine<small>“{raw || 'vazio'}”</small></span><ArrowRight/><span>strip<small>“{clean || 'vazio'}”</small></span><ArrowRight/><span className={clean ? 'success' : 'danger'}>isBlank<small>{clean ? 'válido' : 'repetir'}</small></span></div><CodePanel name="Texto obrigatório" code={'static String lerTextoObrigatorio(Scanner scanner, String prompt) {\n    while (true) {\n        System.out.print(prompt);\n        String valor = scanner.nextLine().strip();\n        if (!valor.isBlank()) return valor;\n        System.out.println("Valor obrigatório. Tente novamente.");\n    }\n}'}/><p className="ln73-format-proof"><strong>trim</strong> é antigo e cobre caracteres até U+0020; <strong>strip</strong> entende espaços Unicode. Nos exemplos simples ambos funcionam, mas o contrato deve ser consciente.</p></section>; }

function NumberLab() { const [entry, setEntry] = useState('abc'); let state = 'format'; let result = 'Não é inteiro'; try { const value = Number(entry); if (entry.trim() && Number.isInteger(value)) { if (value >= 0 && value <= 130) { state = 'ok'; result = 'Aceito: ' + value; } else { state = 'range'; result = 'Fora de 0 a 130'; } } } catch { state = 'format'; } return <section className="co86-stack"><label className="co86-field">Teste uma idade<input value={entry} onChange={event => setEntry(event.target.value)} inputMode="numeric"/></label><div className={'co86-verdict ' + state}><strong>{state === 'format' ? '1 · FORMATO' : state === 'range' ? '2 · FAIXA' : 'VALOR CONFIÁVEL'}</strong><span>{result}</span></div><div className="co86-loop"><span>prompt</span><ArrowRight/><span>nextLine</span><ArrowRight/><span>parseInt</span><ArrowRight/><span>faixa</span><ArrowRight/><span>return ou repetir</span></div><CodePanel name="Inteiro com faixa" code={'while (true) {\n    System.out.print(prompt);\n    String linha = scanner.nextLine().strip();\n    try {\n        int valor = Integer.parseInt(linha);\n        if (valor >= minimo && valor <= maximo) return valor;\n        System.out.println("Digite entre " + minimo + " e " + maximo + ".");\n    } catch (NumberFormatException erro) {\n        System.out.println("Digite um número inteiro válido.");\n    }\n}'}/></section>; }

const PARSERS = [
  ['money', 'Dinheiro', '10,50', '10.50', 'BigDecimal', 'compareTo(BigDecimal.ZERO) > 0'],
  ['date', 'Data ISO', '07/07/2026', '2026-07-07', 'LocalDate', 'DateTimeParseException'],
  ['confirm', 'Confirmação', 'talvez', 'S / SIM / N / NÃO', 'boolean', 'equalsIgnoreCase'],
];
function TypedLab() { const [selected, setSelected] = useState(0); const item = PARSERS[selected]; return <section className="co86-stack"><div className="co86-tabs">{PARSERS.map((parser, index) => <button type="button" key={parser[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{parser[1]}</button>)}</div><div className="co86-parse"><article><small>ENTRADA QUE FALHA</small><code>{item[2]}</code></article><ArrowRight/><article><small>FORMATO ORIENTADO</small><code>{item[3]}</code></article><ArrowRight/><article className="success"><small>TIPO CONFIÁVEL</small><strong>{item[4]}</strong><span>{item[5]}</span></article></div><CodePanel name="BigDecimal, confirmação e LocalDate" code={'String linha = scanner.nextLine().strip().replace(",", ".");\nBigDecimal valor = new BigDecimal(linha);\nif (valor.compareTo(BigDecimal.ZERO) <= 0) { /* repetir */ }\n\nif (resposta.equalsIgnoreCase("S") || resposta.equalsIgnoreCase("SIM")) {\n    return true;\n}\n\ntry {\n    return LocalDate.parse(scanner.nextLine().strip());\n} catch (DateTimeParseException erro) {\n    System.out.println("Use yyyy-MM-dd. Exemplo: 2026-07-07");\n}'}/><aside className="guided-note warning"><AlertTriangle size={20}/><div><strong>replace de vírgula é uma decisão didática</strong><p>Ajuda a entrada brasileira simples. Aplicações reais devem definir Locale e formatação explicitamente, sem trocar separadores às cegas.</p></div></aside></section>; }

function MenuLab() { const [option, setOption] = useState(1); const labels = ['Cadastrar cliente', 'Listar clientes', 'Remover cliente', 'Sair']; return <section className="co86-stack"><div className="co86-menu"><header>=== MENU ===</header>{labels.map((label, index) => <button type="button" key={label} className={option === index + 1 ? 'active' : ''} onClick={() => setOption(index + 1)}><span>{index + 1}</span>{label}</button>)}<footer>{option === 4 ? 'Saindo com break.' : labels[option - 1] + '.'}</footer></div><div className="co86-loop"><span>mostrar menu</span><ArrowRight/><span>ler 1..4</span><ArrowRight/><span>executar</span><ArrowRight/><span>{option === 4 ? 'break' : 'voltar ao menu'}</span></div><CodePanel name="Menu robusto" code={'while (true) {\n    mostrarMenu();\n    int opcao = lerInteiroEntre(scanner, "Escolha (1 a 4): ", 1, 4);\n    if (opcao == 1) System.out.println("Cadastrar cliente.");\n    else if (opcao == 2) System.out.println("Listar clientes.");\n    else if (opcao == 3) System.out.println("Remover cliente.");\n    else {\n        System.out.println("Saindo.");\n        break;\n    }\n}'}/></section>; }

const DOMAINS = [
  ['Cliente', 'nome, e-mail e idade', 'texto obrigatório + faixa'], ['Produto', 'nome, preço e estoque', 'BigDecimal + inteiro'],
  ['Pedido', 'código, cliente e total', 'texto + BigDecimal'], ['Pagamento', 'código, valor e forma', 'decimal + menu'],
  ['Ordem de serviço', 'certificado, data e período', 'LocalDate + texto'], ['Mensageria', 'cliente, certificado e envio', 'texto + confirmação'],
  ['Auditoria', 'usuário, operação, entidade e ID', 'texto + long positivo'],
];
function ReuseLab() { const [selected, setSelected] = useState(0); const item = DOMAINS[selected]; return <section className="co86-stack"><div className="ln73-domains co86-domains"><div>{DOMAINS.map((domain, index) => <button type="button" key={domain[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><strong>{domain[0]}</strong></button>)}</div><article><small>CONSOLE DO DOMÍNIO</small><h3>{item[0]}</h3><p>{item[1]}.</p><div><strong>Leitores reutilizados</strong><span>{item[2]}.</span></div></article></div><div className="co86-boundary"><span>prompt claro</span><ArrowRight/><span>método leitor</span><ArrowRight/><span>valor validado</span><ArrowRight/><span>record/domínio</span></div><aside className="guided-note info"><Lightbulb size={20}/><div><strong>Refatore métodos; não antecipe uma arquitetura gigante</strong><p>A repetição revela um futuro LeitorConsole. Pacotes vêm na próxima aula; agora domine contratos pequenos, nomes claros e retorno confiável.</p></div></aside><CodePanel name="Ruim versus melhor" code={'// Frágil: quebra, não valida faixa e deixa buffer confuso\nint idade = scanner.nextInt();\n\n// Intenção clara: formato, faixa, mensagem e repetição\nint idade = lerInteiroEntre(scanner, "Idade (0 a 130): ", 0, 130);'}/></section>; }

const ERRORS = [
  ['Misturar nextInt e nextLine', 'a próxima leitura parece ser pulada.', 'Leia linhas inteiras e converta, ou consuma o Enter conscientemente.'],
  ['Ignorar NumberFormatException', 'texto inválido encerra o programa.', 'Capture a conversão e repita o prompt.'],
  ['Aceitar vazio', 'campo obrigatório vira dado ruim.', 'Aplique strip e isBlank antes de retornar.'],
  ['Prompt confuso', 'usuário não conhece campo, formato ou faixa.', 'Diga o que digitar e o formato esperado.'],
  ['Erro genérico', '“Inválido” não ensina como corrigir.', 'Informe regra, exemplo ou intervalo.'],
  ['Não repetir', 'usuário não consegue corrigir a entrada.', 'Use while com retorno apenas no valor válido.'],
  ['Loop infinito', 'entrada não é consumida ou saída nunca ocorre.', 'Consuma uma linha por tentativa e mantenha break/return alcançável.'],
  ['double para dinheiro', 'arredondamento binário contamina valores.', 'Use BigDecimal e valide sinal.'],
  ['Fechar Scanner cedo', 'System.in fica indisponível para o restante do fluxo.', 'Centralize o ciclo de vida e não feche em métodos leitores.'],
  ['Copiar sem entender', 'validações divergem e bugs reaparecem.', 'Explique formato, regra, repetição e retorno de cada método.'],
];
function ErrorsClinic() { const [selected, setSelected] = useState(0); const item = ERRORS[selected]; return <section className="ln73-errors co86-errors"><div>{ERRORS.map((error, index) => <button type="button" key={error[0]} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{error[0]}</span></button>)}</div><article><header><AlertTriangle size={20}/><div><small>CASO {selected + 1} DE 10</small><h3>{item[0]}</h3></div></header><p><strong>Sintoma:</strong> {item[1]}</p><p><Wrench size={16}/><strong>Correção:</strong> {item[2]}</p></article></section>; }

const CHECKS = ['entrada e saída diferenciadas', 'print e println observados', 'buffer nextInt/nextLine explicado', 'nextLine usado em todas as leituras', 'texto obrigatório normalizado', 'formato e faixa separados', 'BigDecimal positivo validado', 'S/N e LocalDate validados', 'menu encerra com break', 'Scanner tem ciclo de vida consciente'];
function DeliveryLab() { const [checked, setChecked] = useState([]); const toggle = index => setChecked(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]); const commands = ['mkdir labs\\m2\\aula-086-console-robusto', 'cd labs\\m2\\aula-086-console-robusto', 'javac CadastroConsole.java', 'java CadastroConsole'].join('\n'); return <section className="ln73-delivery"><CodePanel name="CadastroConsole.java" code={MAIN_PROGRAM}/><div className="ln73-terminal"><header><Terminal size={15}/>Compilar e executar<CopyButton value={commands}/></header><pre><b>PS&gt;</b> {commands.replaceAll('\n', '\nPS&gt; ')}{'\n\n'}<span>{EXPECTED_OUTPUT}</span></pre></div><section className="ln73-debug"><header><Play size={18}/><strong>Debug: acompanhe uma tentativa inválida</strong></header><div><article><span>1</span><strong>Breakpoint</strong><p>Pare após nextLine.</p></article><article><span>2</span><strong>linha</strong><p>Teste abc e 42.</p></article><article><span>3</span><strong>catch</strong><p>Veja a repetição.</p></article><article><span>4</span><strong>return</strong><p>Confirme o tipo válido.</p></article></div></section><div className="ln73-checks">{CHECKS.map((item, index) => <button type="button" key={item} className={checked.includes(index) ? 'done' : ''} onClick={() => toggle(index)}><span>{checked.includes(index) ? <Check size={14}/> : index + 1}</span>{item}</button>)}</div><section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22}/><h3>Desafio: cadastro completo de uma OS</h3></div><p>Leia certificado, data ISO, período, prioridade de 1 a 5 e confirmação final sem encerrar em entrada inválida.</p><ul><li>Faça cada erro dizer como corrigir.</li><li>Use somente nextLine nas entradas.</li><li>Provoque vazio, texto numérico inválido e data impossível.</li><li>Registre entradas, saídas e decisão sobre fechar Scanner.</li></ul></section><section className="guided-file"><div className="guided-file-title"><FileCode2 size={16}/>README.md · evidências<CopyButton value={EVIDENCE}/></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem' }}>{EVIDENCE}</SyntaxHighlighter></section></section>; }

function ContentBlock({ block }) { if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>; const map = { contract: ConsoleContractLab, buffer: BufferLab, text: TextPipelineLab, number: NumberLab, typed: TypedLab, menu: MenuLab, reuse: ReuseLab, errors: ErrorsClinic, delivery: DeliveryLab }; const Component = map[block.type]; return Component ? <Component/> : null; }
const steps = [
  { id: 'contract', label: 'Contrato do Console', duration: '11 min', eyebrow: 'ENTRADA, SAÍDA E CURSOR', title: 'Faça teclado e terminal conversarem com clareza', blocks: [{ type: 'lead', text: 'System.in recebe, Scanner interpreta e System.out orienta. print mantém o cursor no prompt; println encerra a linha.' }, { type: 'contract' }] },
  { id: 'buffer', label: 'Buffer sem Surpresas', duration: '14 min', eyebrow: 'NEXTINT VERSUS NEXTLINE', title: 'Veja por que o nome é pulado e elimine a causa', blocks: [{ type: 'lead', text: 'nextInt consome o token numérico, mas deixa a quebra de linha. Ler tudo com nextLine torna o ciclo visível e previsível.' }, { type: 'buffer' }] },
  { id: 'text', label: 'Texto Obrigatório', duration: '12 min', eyebrow: 'LER, NORMALIZAR E VALIDAR', title: 'Transforme uma linha bruta em texto confiável', blocks: [{ type: 'lead', text: 'Uma entrada útil passa por prompt claro, leitura completa, remoção de bordas, validação de vazio e repetição.' }, { type: 'text' }] },
  { id: 'number', label: 'Inteiro e Faixa', duration: '14 min', eyebrow: 'FORMATO ANTES DA REGRA', title: 'Separe “não é número” de “está fora da faixa”', blocks: [{ type: 'lead', text: 'parseInt resolve formato; a comparação resolve domínio. Cada falha pede uma mensagem diferente e nova tentativa.' }, { type: 'number' }] },
  { id: 'typed', label: 'Decimal, Data e S/N', duration: '16 min', eyebrow: 'CONVERSÕES CONTROLADAS', title: 'Valide dinheiro, confirmação e data sem quebrar', blocks: [{ type: 'lead', text: 'BigDecimal preserva dinheiro, LocalDate.parse exige ISO e a confirmação aceita apenas respostas explícitas.' }, { type: 'typed' }] },
  { id: 'menu', label: 'Menu Robusto', duration: '12 min', eyebrow: 'REPETIÇÃO COM SAÍDA', title: 'Limite opções e deixe o encerramento alcançável', blocks: [{ type: 'lead', text: 'Um menu confiável mostra opções, valida 1 a 4, executa uma ação e retorna até a escolha de saída.' }, { type: 'menu' }] },
  { id: 'reuse', label: 'Métodos e Domínios', duration: '15 min', eyebrow: 'SETE APLICAÇÕES', title: 'Reutilize leitores sem antecipar arquitetura', blocks: [{ type: 'lead', text: 'Cliente, produto, pedido, pagamento, OS, mensageria e auditoria combinam os mesmos contratos de leitura de maneiras diferentes.' }, { type: 'reuse' }] },
  { id: 'errors', label: 'Clínica de Erros', duration: '12 min', eyebrow: 'DEZ DIAGNÓSTICOS', title: 'Corrija buffer, loop, mensagem e ciclo de vida', blocks: [{ type: 'lead', text: 'Console robusto não é só try/catch: a experiência depende de consumo de entrada, regra, mensagem, repetição e saída.' }, { type: 'errors' }] },
  { id: 'delivery', label: 'Entrega & Desafio', duration: '31 min', eyebrow: 'CÓDIGO, DEBUG E GIT', title: 'Prove cada recuperação com entradas reproduzíveis', blocks: [{ type: 'lead', text: 'Compile o laboratório determinístico, confira oito linhas, depure a repetição e entregue evidências do contrato.' }, { type: 'delivery' }] },
];

export default function GuidedRobustConsoleLesson086({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) { const [activeIndex, setActiveIndex] = useState(0); const navRef = useRef(null); const completionNormalizedRef = useRef(false); const [completedSteps, setCompletedSteps] = useState(() => { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); const validIds = new Set(steps.map(step => step.id)); return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []); } catch { return new Set(); } }); useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps])), [completedSteps]); useEffect(() => { if (!completionNormalizedRef.current && isCompleted && completedSteps.size !== steps.length) { completionNormalizedRef.current = true; onToggleCompleted(); } }, [completedSteps.size, isCompleted, onToggleCompleted]); useEffect(() => { const button = navRef.current?.querySelector('button.active'); if (button && window.matchMedia('(max-width: 900px)').matches) button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }, [activeIndex]); const step = steps[activeIndex]; const stepDone = completedSteps.has(step.id); const allStepsDone = completedSteps.size === steps.length; const lessonComplete = isCompleted && allStepsDone; const selectStep = index => { setActiveIndex(index); document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; const toggleStep = () => { if (stepDone && isCompleted) onToggleCompleted(); setCompletedSteps(current => { const next = new Set(current); if (next.has(step.id)) next.delete(step.id); else next.add(step.id); return next; }); }; return <article className="guided-git-lesson guided-robust-console-lesson"><header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><Terminal size={17}/>Laboratório de I/O Java</span><p className="guided-sequence">086 · M2.25</p><h1>Console que orienta, valida e recupera</h1><p>Leia linhas completas, converta com cuidado e dê ao usuário uma nova tentativa em vez de encerrar o programa.</p></div><div className="guided-hero-status"><Keyboard size={42}/><strong>{Math.round((completedSteps.size / steps.length) * 100)}%</strong><span>{completedSteps.size} de {steps.length} etapas concluídas</span></div></header><GuidedLessonFacts ariaLabel="Resumo da aula 086" items={[{ value: '1 pipeline', label: 'Ler, limpar, validar e converter' }, { value: '5 tipos', label: 'Texto, inteiro, decimal, data e S/N' }, { value: '10 falhas', label: 'Diagnosticadas pela causa' }]}/><div className="guided-layout"><nav ref={navRef} className="guided-step-nav" aria-label="Roteiro prático da aula 086"><div className="guided-step-nav-title"><ListChecks size={18}/>Roteiro prático</div>{steps.map((item, index) => <button type="button" key={item.id} className={(index === activeIndex ? 'active ' : '') + (completedSteps.has(item.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedSteps.has(item.id) ? <Check size={14}/> : String(index + 1).padStart(2, '0')}</span><span><strong>{item.label}</strong><small>{item.duration}</small></span></button>)}</nav><main className="guided-step-content"><div className="guided-step-heading"><span>{step.eyebrow} · {step.duration}</span><h2>{step.title}</h2></div>{step.blocks.map((block, index) => <ContentBlock key={block.type + '-' + index} block={block}/>)}<div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17}/>Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={'step-toggle ' + (stepDone ? 'undo' : 'complete')} onClick={toggleStep}>{stepDone ? <><RotateCcw size={16}/>Desmarcar etapa</> : <><CheckCircle2 size={16}/>Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!stepDone} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa<ArrowRight size={17}/></button>}</div></div>{allStepsDone && <section className="guided-finish"><CheckCircle2 size={30}/><div><h3>Entradas inválidas agora viram orientação</h3><p>{lessonComplete ? 'Aula concluída e pronta para organizar os arquivos em pacotes.' : 'Confira a entrega antes da conclusão geral.'}</p></div><button type="button" onClick={onToggleCompleted}>{lessonComplete ? 'Reabrir aula' : 'Concluir aula'}</button></section>}</main></div><footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17}/>Aula 085</button><div className={'guided-course-status ' + (lessonComplete ? 'completed' : allStepsDone ? 'ready' : '')}><Clock3 size={18}/><span><strong>{lessonComplete ? 'Aula concluída' : completedSteps.size + ' de ' + steps.length + ' etapas'}</strong><small>entrada, validação e recuperação</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete}>Aula 087<ArrowRight size={17}/></button></footer></article>; }
