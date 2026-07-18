import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2,
  ChevronRight, Clock3, Copy, FileCode2, Lightbulb, ListChecks,
  RotateCcw, ShieldCheck, Sparkles, Terminal, Trash2, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedInputErrorsLesson.css';

const STORAGE_KEY = 'guided-input-errors-lesson-059-progress';

const EVIDENCE = [
  '# Aula 059 — Tratamento Inicial de Erros de Entrada', '',
  '## Mecânica',
  '- [ ] Provoquei uma InputMismatchException com entrada incompatível',
  '- [ ] Expliquei o desvio do try para o catch',
  '- [ ] Limpei a entrada problemática antes de repetir',
  '- [ ] Diferenciei erro de execução de erro de compilação', '',
  '## Leitura segura',
  '- [ ] Implementei leitura de int, long e double',
  '- [ ] Usei um único Scanner passado como parâmetro',
  '- [ ] Diferenciei incompatibilidade de tipo de regra de negócio',
  '- [ ] Validei positivo, não negativo, texto obrigatório e status', '',
  '## Diagnóstico e entrega',
  '- [ ] Corrigi catch vazio, catch genérico e loop sem consumo',
  '- [ ] Executei o programa guiado com entradas inválidas e válidas',
  '- [ ] Registrei as saídas observadas no diário de bordo',
  '- [ ] Revisei o diff e mantive arquivos .class fora do commit'
].join('\n');

const GUIDED_PROGRAM_059 = `import java.util.InputMismatchException;
import java.util.Scanner;

public class CadastroPedidoResiliente {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String cliente = lerTextoObrigatorio(scanner, "Cliente:");
        long valorCentavos = lerLongPositivo(scanner, "Valor em centavos:");
        int parcelas = lerInteiroPositivo(scanner, "Parcelas:");
        String status = lerStatus(scanner, "Status:");

        System.out.println("Pedido aceito");
        System.out.println("Cliente: " + cliente);
        System.out.println("Valor: " + valorCentavos);
        System.out.println("Parcelas: " + parcelas);
        System.out.println("Status: " + status);
        scanner.close();
    }

    static int lerInteiroPositivo(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);
                int valor = scanner.nextInt();
                scanner.nextLine();
                if (valor > 0) return valor;
                System.out.println("Informe um inteiro maior que zero.");
            } catch (InputMismatchException erro) {
                System.out.println("Entrada incompatível: use um inteiro.");
                scanner.nextLine();
            }
        }
    }

    static long lerLongPositivo(Scanner scanner, String mensagem) {
        while (true) {
            try {
                System.out.println(mensagem);
                long valor = scanner.nextLong();
                scanner.nextLine();
                if (valor > 0) return valor;
                System.out.println("Informe um valor maior que zero.");
            } catch (InputMismatchException erro) {
                System.out.println("Entrada incompatível: use centavos inteiros.");
                scanner.nextLine();
            }
        }
    }

    static String lerTextoObrigatorio(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem);
            String texto = scanner.nextLine().trim();
            if (!texto.isBlank()) return texto;
            System.out.println("Campo obrigatório.");
        }
    }

    static String lerStatus(Scanner scanner, String mensagem) {
        while (true) {
            System.out.println(mensagem + " PENDENTE, APROVADO ou CANCELADO");
            String status = scanner.nextLine().trim().toUpperCase();
            if ("PENDENTE".equals(status) || "APROVADO".equals(status)
                    || "CANCELADO".equals(status)) return status;
            System.out.println("Status inválido.");
        }
    }
}`;

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { /* Clipboard pode estar indisponível fora de HTTPS. */ }
  };
  return <button type="button" className="ie59-copy" onClick={copy}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file ie59-code">
      <div className="guided-file-title"><FileCode2 size={16} /> {name}<CopyButton value={code} /></div>
      <SyntaxHighlighter language={language} style={vscDarkPlus} showLineNumbers={lines} wrapLongLines
        customStyle={{ margin: 0, padding: '16px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

const FLOW_CODE = `try {
    int quantidade = scanner.nextInt();
    scanner.nextLine();
    System.out.println("Quantidade: " + quantidade);
} catch (InputMismatchException erro) {
    System.out.println("Entrada inválida. Use um inteiro.");
    scanner.nextLine();
}`;

function ExceptionFlowLab() {
  const [input, setInput] = useState('abc');
  const [frame, setFrame] = useState(0);
  const valid = /^[-+]?\d+$/.test(input.trim());
  const frames = valid
    ? ['Entrada chega ao Scanner', 'nextInt() converte o texto', 'A linha restante é consumida', 'O valor é usado; catch não executa']
    : ['Entrada chega ao Scanner', 'nextInt() não consegue converter', 'A JVM cria InputMismatchException', 'O fluxo salta para catch', 'Mensagem amigável e limpeza da linha'];
  const next = () => setFrame(current => Math.min(current + 1, frames.length - 1));

  return (
    <section className="ie59-lab">
      <div className="ie59-input-row">
        <label>Entrada simulada<input value={input} onChange={event => { setInput(event.target.value); setFrame(0); }} /></label>
        <button type="button" onClick={next} disabled={frame === frames.length - 1}>Executar próximo passo <ArrowRight size={15} /></button>
        <button type="button" className="secondary" onClick={() => setFrame(0)}><RotateCcw size={15} /> Reiniciar</button>
      </div>
      <div className="ie59-flow" aria-label="Fluxo do try e catch">
        {frames.map((label, index) => (
          <React.Fragment key={label}>
            <div className={`${index === frame ? 'active ' : ''}${index < frame ? 'done' : ''}`}>
              <span>{index < frame ? <Check size={14} /> : index + 1}</span><strong>{label}</strong>
            </div>
            {index < frames.length - 1 && <ChevronRight aria-hidden="true" />}
          </React.Fragment>
        ))}
      </div>
      <div className={`ie59-console ${valid && frame === frames.length - 1 ? 'success' : !valid && frame >= 2 ? 'warning' : ''}`}>
        <header><Terminal size={14} /> Console e estado da execução</header>
        <pre>{frame === 0 ? `Digite uma quantidade:\n> ${input}` : frames[frame] + (frame === frames.length - 1 ? `\n${valid ? `Quantidade: ${Number(input)}` : 'Entrada inválida. Use um inteiro.'}` : '')}</pre>
      </div>
      <CodePanel name="PrimeiroTratamento.java" code={FLOW_CODE} />
      <aside className="guided-note info"><Lightbulb size={20} /><div><strong>Leia como professor</strong><p>O código compila nos dois casos. A diferença só aparece durante a execução: uma entrada incompatível interrompe o restante do <code>try</code> e transfere o controle ao <code>catch</code>.</p></div></aside>
    </section>
  );
}

function BufferLab() {
  const [clean, setClean] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const repeat = () => setAttempt(value => Math.min(value + 1, 4));
  return (
    <section className="ie59-lab">
      <div className="ie59-buffer-map">
        <div><small>Teclado</small><strong>abc↵</strong></div><ArrowRight />
        <div className={clean ? 'consumed' : 'blocked'}><small>Buffer do Scanner</small><strong>{clean ? 'linha consumida' : 'abc↵ pendente'}</strong></div><ArrowRight />
        <div><small>nextInt()</small><strong>{clean ? 'aguarda nova entrada' : `falha ${attempt}×`}</strong></div>
      </div>
      <div className="ie59-input-row">
        <button type="button" onClick={repeat} disabled={clean}>Repetir sem limpar</button>
        <button type="button" onClick={() => { setClean(true); setAttempt(1); }}><Trash2 size={15} /> Executar scanner.nextLine()</button>
        <button type="button" className="secondary" onClick={() => { setClean(false); setAttempt(1); }}><RotateCcw size={15} /> Restaurar</button>
      </div>
      <div className={`ie59-console ${clean ? 'success' : 'warning'}`}><header><Terminal size={14} /> Evidência</header><pre>{clean ? 'Entrada problemática consumida.\nDigite uma quantidade:\n> _' : `Entrada inválida.\n`.repeat(attempt) + 'O mesmo token continua pendente; o usuário não recupera o controle.'}</pre></div>
      <aside className="guided-note warning"><AlertTriangle size={20} /><div><strong>Duas limpezas com papéis diferentes</strong><p>No <code>catch</code>, <code>nextLine()</code> descarta a linha incompatível. Depois de uma leitura numérica bem-sucedida, ele consome a quebra de linha antes de uma futura leitura textual.</p></div></aside>
    </section>
  );
}

const TYPE_READERS = {
  int: { method: 'nextInt()', ok: '25', bad: '10.5', type: 'int', message: 'Use um número inteiro.' },
  long: { method: 'nextLong()', ok: '9000000000', bad: 'nove bilhões', type: 'long', message: 'Use um inteiro longo.' },
  double: { method: 'nextDouble()', ok: '7.5', bad: 'sete', type: 'double', message: 'Use um número decimal compatível com a configuração regional.' }
};

function NumericReadersLab() {
  const [kind, setKind] = useState('int');
  const [mode, setMode] = useState('bad');
  const item = TYPE_READERS[kind];
  const code = `static ${item.type} ler${kind[0].toUpperCase() + kind.slice(1)}(Scanner scanner) {\n    while (true) {\n        try {\n            ${item.type} valor = scanner.${item.method};\n            scanner.nextLine();\n            return valor;\n        } catch (InputMismatchException erro) {\n            System.out.println("${item.message}");\n            scanner.nextLine();\n        }\n    }\n}`;
  return (
    <section className="ie59-lab">
      <div className="ie59-tabs" role="group" aria-label="Tipo numérico">
        {Object.keys(TYPE_READERS).map(key => <button type="button" key={key} className={kind === key ? 'active' : ''} onClick={() => setKind(key)}>{key}</button>)}
      </div>
      <div className="ie59-input-row"><button type="button" onClick={() => setMode('bad')}>Testar “{item.bad}”</button><button type="button" onClick={() => setMode('ok')}>Testar “{item.ok}”</button></div>
      <CodePanel name={`Leitor${kind[0].toUpperCase() + kind.slice(1)}.java`} code={code} />
      <div className={`ie59-console ${mode === 'ok' ? 'success' : 'warning'}`}><header><Terminal size={14} /> Saída prevista</header><pre>{mode === 'ok' ? `Valor ${item.type} aceito: ${item.ok}` : `${item.message}\nA linha “${item.bad}” foi consumida. Tente novamente.`}</pre></div>
    </section>
  );
}

function TypeVsRuleLab() {
  const [value, setValue] = useState('-10');
  const isInteger = /^[-+]?\d+$/.test(value.trim());
  const number = Number(value);
  const outcome = !isInteger ? 'type' : number <= 0 ? 'rule' : 'ok';
  return (
    <section className="ie59-lab">
      <div className="ie59-input-row"><label>Quantidade<input value={value} onChange={event => setValue(event.target.value)} /></label></div>
      <div className="ie59-gates">
        <div className={outcome === 'type' ? 'failed' : 'passed'}><small>Portão 1 · tipo</small><strong>É possível produzir um int?</strong><p>{outcome === 'type' ? 'Não: catch trata a incompatibilidade.' : 'Sim: a leitura terminou normalmente.'}</p></div>
        <ArrowRight />
        <div className={outcome === 'rule' ? 'failed' : outcome === 'ok' ? 'passed' : ''}><small>Portão 2 · regra</small><strong>O valor é maior que zero?</strong><p>{outcome === 'rule' ? 'Não: if rejeita a regra.' : outcome === 'ok' ? 'Sim: processamento liberado.' : 'Ainda não foi avaliado.'}</p></div>
      </div>
      <aside className="guided-note info"><ShieldCheck size={20} /><div><strong>Não confunda mecanismos</strong><p><code>abc</code> exige recuperação técnica; <code>-10</code> já é um <code>int</code>, mas viola a regra. Texto vazio e status desconhecido também são validações, não <code>InputMismatchException</code>.</p></div></aside>
    </section>
  );
}

const METHODS = [
  { label: 'Inteiro positivo', name: 'lerInteiroPositivo', rule: 'valor > 0', use: 'quantidade e parcelas', code: 'int valor = scanner.nextInt();' },
  { label: 'Long positivo', name: 'lerLongPositivo', rule: 'valor > 0', use: 'centavos e identificadores grandes', code: 'long valor = scanner.nextLong();' },
  { label: 'Texto obrigatório', name: 'lerTextoObrigatorio', rule: '!texto.isBlank()', use: 'cliente e certificado', code: 'String texto = scanner.nextLine().trim();' },
  { label: 'Status válido', name: 'lerStatus', rule: 'conjunto permitido', use: 'estado de pedido, produto ou OS', code: 'String status = scanner.nextLine().trim().toUpperCase();' }
];

function ReusableMethodsLab() {
  const [selected, setSelected] = useState(0);
  const item = METHODS[selected];
  return (
    <section className="ie59-methods">
      <div className="ie59-method-list">{METHODS.map((method, index) => <button type="button" key={method.name} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{method.label}<small>{method.use}</small></button>)}</div>
      <div className="ie59-method-detail"><div className="ie59-responsibility"><span><small>main</small>orquestra o cadastro</span><ChevronRight /><span><small>{item.name}</small>lê, recupera e valida</span><ChevronRight /><span><small>retorno</small>entrega valor confiável</span></div><CodePanel name={`${item.name}.java`} code={`${item.code}\n// regra: ${item.rule}\n// um único Scanner chega por parâmetro`} lines={false} /><p><strong>Responsabilidade:</strong> {item.use}. O <code>main</code> não precisa duplicar o protocolo de recuperação.</p></div>
    </section>
  );
}

const DOMAINS = [
  { id: 'pedido', label: 'Pedido', fields: 'cliente · valorCentavos · status', strategy: 'texto obrigatório + long positivo + status permitido', output: 'Pedido aceito | Ana | 15990 | PENDENTE' },
  { id: 'produto', label: 'Produto', fields: 'nome · estoque · status', strategy: 'texto obrigatório + inteiro não negativo + ATIVO/INATIVO', output: 'Produto aceito | Teclado | 0 | ATIVO' },
  { id: 'pagamento', label: 'Pagamento', fields: 'valorCentavos · parcelas', strategy: 'long positivo + inteiro positivo; impede divisão por zero', output: 'Pagamento | 12000 | 3 × 4000' },
  { id: 'os', label: 'OS', fields: 'certificado · atividades · status', strategy: 'texto obrigatório + inteiro positivo + estado da OS', output: 'OS | CERT-42 | 4 | AGENDADA' },
  { id: 'mensagem', label: 'Mensageria', fields: 'cliente · tipo · tentativas', strategy: 'texto obrigatório + tipo permitido + inteiro não negativo', output: 'Mensagem | Bruno | NPS | 0 tentativas' },
  { id: 'auditoria', label: 'Auditoria', fields: 'usuário · operação · status', strategy: 'somente texto normalizado e validado; try/catch numérico seria ruído', output: 'thiago | EDICAO | SUCESSO' }
];

function DomainsGallery() {
  const [selected, setSelected] = useState(0);
  const item = DOMAINS[selected];
  return (
    <section className="ie59-domains-gallery">
      <div className="ie59-domains-sidebar">{DOMAINS.map((domain, index) => <button type="button" key={domain.id} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>{domain.label}</button>)}</div>
      <div className="ie59-domain-card"><span className="ie59-domain-badge">{item.label}</span><h3>{item.fields}</h3><p>{item.strategy}</p><div className="ie59-console success"><header><Terminal size={14} /> Resultado após entradas válidas</header><pre>{item.output}</pre></div><aside className="guided-note info"><Lightbulb size={19} /><div><strong>Decisão de projeto</strong><p>O tratamento deve existir apenas no ponto que sabe se recuperar. Cada domínio combina leitores técnicos com suas próprias regras.</p></div></aside></div>
    </section>
  );
}

const ERRORS = [
  { title: 'Import ausente', symptom: 'cannot find symbol: InputMismatchException', cause: 'A classe não foi importada.', fix: 'Importe java.util.InputMismatchException.' },
  { title: 'Token inválido não consumido', symptom: 'A mesma mensagem se repete sem nova digitação.', cause: 'nextInt() falhou e deixou a linha pendente.', fix: 'Execute scanner.nextLine() dentro do catch.' },
  { title: 'Try/catch como validação', symptom: '-10 é aceito como quantidade.', cause: 'O tipo é int; nenhuma exceção deve ocorrer.', fix: 'Valide a regra com if depois da leitura.' },
  { title: 'catch (Exception)', symptom: 'Falhas diferentes viram a mesma mensagem.', cause: 'A captura é ampla demais e mascara bugs.', fix: 'Capture InputMismatchException onde sabe recuperar.' },
  { title: 'Catch vazio', symptom: 'O programa parece ignorar a tentativa.', cause: 'O usuário não recebe orientação nem evidência.', fix: 'Mostre uma mensagem específica e recupere o Scanner.' },
  { title: 'Vários Scanners em System.in', symptom: 'Leituras competem ou o fluxo fecha inesperadamente.', cause: 'Cada método cria ou fecha seu próprio Scanner.', fix: 'Crie um Scanner no main e passe-o por parâmetro.' },
  { title: 'nextInt seguido de nextLine', symptom: 'O texto seguinte parece ser pulado.', cause: 'A quebra de linha ficou pendente após o número.', fix: 'Consuma a quebra com nextLine antes de ler texto.' },
  { title: 'Loop sem saída', symptom: 'Mesmo dados válidos não encerram a leitura.', cause: 'Não há return, break ou mudança de condição.', fix: 'Retorne o valor assim que leitura e regra forem aprovadas.' },
  { title: 'Mensagem genérica', symptom: 'O usuário vê apenas “Erro”.', cause: 'A mensagem não informa o formato esperado.', fix: 'Diga qual campo falhou e qual entrada é aceita.' },
  { title: 'Try/catch duplicado', symptom: 'Cada cadastro repete dezenas de linhas frágeis.', cause: 'Leitura, recuperação e regra não foram encapsuladas.', fix: 'Crie leitores reutilizáveis com responsabilidades claras.' }
];

function ErrorsClinic() {
  const [selected, setSelected] = useState(0);
  const error = ERRORS[selected];
  return (
    <section className="ie59-errors-clinic">
      <div className="ie59-errors-nav">{ERRORS.map((item, index) => <button type="button" key={item.title} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}><span>{index + 1}</span><span className="guided-error-label">{item.title}</span></button>)}</div>
      <article className="ie59-error-card"><header><AlertTriangle size={22} /><div><small>Caso {selected + 1} de {ERRORS.length}</small><h3>{error.title}</h3></div></header><div className="ie59-error-symptom"><strong>Sintoma observável</strong><code>{error.symptom}</code></div><div className="ie59-error-flow"><span><Wrench size={17} /><div><strong>Causa raiz</strong><p>{error.cause}</p></div></span><ChevronRight /><span><ShieldCheck size={17} /><div><strong>Como corrigir</strong><p>{error.fix}</p></div></span></div></article>
    </section>
  );
}

function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const stages = [
    { title: 'Criar laboratório', cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-059-tratamento-erros-entrada\ncd labs\\m1\\aula-059-tratamento-erros-entrada\nNew-Item CadastroPedidoResiliente.java', out: 'Diretório e arquivo criados.', tip: 'Os exemplos repetidos foram consolidados em um programa completo, mas cada competência continua verificável.' },
    { title: 'Compilar', cmd: 'javac CadastroPedidoResiliente.java', out: 'Sem saída: compilação concluída com sucesso.', tip: 'Silêncio do javac significa sucesso. Confirme que o arquivo .class nasceu, mas não o versione.' },
    { title: 'Testar recuperação', cmd: 'java CadastroPedidoResiliente', out: 'Cliente:\n>    \nCampo obrigatório.\nCliente:\n> Ana\nValor em centavos:\n> dez\nEntrada incompatível: use centavos inteiros.\nValor em centavos:\n> 15990', tip: 'Digite erros deliberadamente. Uma execução apenas com dados perfeitos não prova recuperação.' },
    { title: 'Versionar evidência', cmd: 'git status\ngit diff\ngit add labs/m1/aula-059-tratamento-erros-entrada docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 059: pratica tratamento inicial de erros de entrada"\ngit status', out: 'nothing to commit, working tree clean', tip: 'Se .class aparecer no staged, retire-o e ajuste o .gitignore antes do commit.' }
  ];
  const current = stages[stage];
  return (
    <section>
      <div className="ie59-delivery-nav">{stages.map((item, index) => <button type="button" key={item.title} className={stage === index ? 'active' : ''} onClick={() => setStage(index)}><span>{index < stage ? <Check size={11} /> : index + 1}</span>{item.title}</button>)}</div>
      <div className="ie59-terminal"><header><Terminal size={14} /> PowerShell <small>saída esperada</small></header><pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre><p><Lightbulb size={14} /> {current.tip}</p></div>
      <div className="ie59-delivery-actions"><button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button><span>Passo {stage + 1} de {stages.length}</span><button type="button" disabled={stage === stages.length - 1} onClick={() => setStage(stage + 1)}>Próximo <ArrowRight size={14} /></button></div>
      <aside className="guided-note info"><Lightbulb size={20} /><div><strong>Exemplo guiado antes do desafio</strong><p>Compile este programa primeiro. Execute uma sequência com campo vazio, texto em campo numérico, número negativo, status desconhecido e finalmente valores válidos.</p></div></aside>
      <CodePanel name="CadastroPedidoResiliente.java" code={GUIDED_PROGRAM_059} />
      <div className="ie59-console success"><header><Terminal size={14} /> Estado final esperado</header><pre>{'Pedido aceito\nCliente: Ana\nValor: 15990\nParcelas: 3\nStatus: PENDENTE'}</pre></div>
      <section className="guided-challenge"><div className="guided-challenge-title"><Sparkles size={22} /><h3>Desafio: CadastroOsResiliente.java</h3></div><p>Sem copiar o programa pronto, crie um cadastro que reutilize um único <code>Scanner</code> e só termine após obter certificado obrigatório, quantidade positiva de atividades e status <code>ABERTA</code>, <code>AGENDADA</code>, <code>CONCLUIDA</code> ou <code>CANCELADA</code>.</p><ul><li>Teste <code>abc</code> no campo numérico e prove que o programa pede novamente.</li><li>Teste <code>0</code> e explique por que isso é regra, não exceção.</li><li>Use mensagem específica em cada falha e não capture <code>Exception</code>.</li><li>Defenda oralmente onde a linha inválida é consumida.</li></ul></section>
      <div className="guided-file ie59-code"><div className="guided-file-title"><BookOpenCheck size={16} /> docs/diario-de-bordo.md<CopyButton value={EVIDENCE} label="Copiar evidências" /></div><SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '16px', background: '#0f172a', fontSize: '.76rem', lineHeight: 1.65 }}>{EVIDENCE}</SyntaxHighlighter></div>
    </section>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'flow') return <ExceptionFlowLab />;
  if (block.type === 'buffer') return <BufferLab />;
  if (block.type === 'numeric') return <NumericReadersLab />;
  if (block.type === 'rule') return <TypeVsRuleLab />;
  if (block.type === 'methods') return <ReusableMethodsLab />;
  if (block.type === 'domains') return <DomainsGallery />;
  if (block.type === 'errors') return <ErrorsClinic />;
  if (block.type === 'delivery') return <DeliveryLab />;
  return null;
}

const steps = [
  { id: 'fluxo', eyebrow: 'Execução observável', label: 'Try/catch em movimento', title: 'Veja uma entrada incompatível desviar o fluxo sem derrubar o programa', duration: '7 min', blocks: [{ type: 'lead', text: 'Digite valores válidos e inválidos, avance quadro a quadro e acompanhe exatamente onde o try é interrompido.' }, { type: 'flow' }] },
  { id: 'buffer', eyebrow: 'Recuperação real', label: 'Limpeza do Scanner', title: 'Retire o token problemático antes de pedir uma nova tentativa', duration: '6 min', blocks: [{ type: 'lead', text: 'Reproduza o loop infinito causado pelo mesmo token pendente e depois devolva o controle ao usuário.' }, { type: 'buffer' }] },
  { id: 'numericos', eyebrow: 'Leitores tipados', label: 'int, long e double', title: 'Compare os três leitores numéricos e suas falhas de conversão', duration: '7 min', blocks: [{ type: 'lead', text: 'Alterne tipos e entradas para ligar nextInt, nextLong e nextDouble às saídas corretas.' }, { type: 'numeric' }] },
  { id: 'regras', eyebrow: 'Dois portões', label: 'Tipo vs Regra', title: 'Separe incompatibilidade técnica de valor proibido pelo negócio', duration: '7 min', blocks: [{ type: 'lead', text: 'Teste texto, zero, número negativo e número positivo para descobrir qual mecanismo deve responder.' }, { type: 'rule' }] },
  { id: 'metodos', eyebrow: 'Responsabilidade', label: 'Leitores reutilizáveis', title: 'Mantenha o main limpo e concentre a recuperação em métodos de leitura', duration: '7 min', blocks: [{ type: 'lead', text: 'Explore contratos de leitura para número positivo, centavos, texto obrigatório e status permitido.' }, { type: 'methods' }] },
  { id: 'dominios', eyebrow: 'Arquitetura aplicada', label: 'Galeria de Domínios', title: 'Combine leitores técnicos e regras em seis cenários de backend', duration: '8 min', blocks: [{ type: 'lead', text: 'Compare pedido, produto, pagamento, OS, mensageria e auditoria sem repetir try/catch indiscriminadamente.' }, { type: 'domains' }] },
  { id: 'clinica', eyebrow: 'Depuração', label: 'Clínica de Erros', title: 'Diagnostique dez falhas clássicas de entrada e recuperação', duration: '9 min', blocks: [{ type: 'lead', text: 'Leia primeiro o sintoma, formule sua hipótese e só então confronte a causa e a correção.' }, { type: 'errors' }] },
  { id: 'entrega', eyebrow: 'Prática no terminal', label: 'Entrega & Desafio', title: 'Compile, provoque falhas, recupere o fluxo e entregue evidências', duration: '12 min', blocks: [{ type: 'lead', text: 'Execute o programa completo antes do desafio e prove cada saída, inclusive as tentativas inválidas.' }, { type: 'delivery' }] }
];

export default function GuidedInputErrorsLesson059({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepNavRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const validIds = new Set(steps.map(step => step.id));
      return new Set(Array.isArray(saved) ? saved.filter(id => validIds.has(id)) : []);
    } catch { return new Set(); }
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds])); }, [completedStepIds]);
  useEffect(() => {
    if (!completionNormalizedRef.current && isCompleted && completedStepIds.size !== steps.length) {
      completionNormalizedRef.current = true;
      onToggleCompleted();
    }
  }, [completedStepIds.size, isCompleted, onToggleCompleted]);
  useEffect(() => {
    const activeButton = stepNavRef.current?.querySelector('button.active');
    if (activeButton && window.matchMedia('(max-width: 900px)').matches) activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const toggleActiveStep = () => {
    if (activeStepComplete && isCompleted) onToggleCompleted();
    setCompletedStepIds(previous => {
      const next = new Set(previous);
      if (next.has(activeStep.id)) next.delete(activeStep.id); else next.add(activeStep.id);
      return next;
    });
  };

  return (
    <article className="guided-git-lesson guided-input-errors-lesson">
      <header className="guided-hero"><div className="guided-hero-copy"><span className="guided-kicker"><ShieldCheck size={17} /> Fundamentos resilientes</span><p className="guided-sequence">059 · M1.39</p><h1>Tratamento Inicial de Erros de Entrada</h1><p>Faça o programa sobreviver a entradas incompatíveis, recupere o Scanner, diferencie erro técnico de regra de negócio e transforme tentativas ruins em orientação clara.</p></div><div className="guided-hero-status"><ShieldCheck size={42} /><strong>{progress}%</strong><span>{completedStepIds.size} de {steps.length} etapas concluídas</span></div><div className="guided-hero-status-track" aria-label={`Progresso: ${progress}%`}><span style={{ width: `${progress}%` }} /></div></header>
      <GuidedLessonFacts ariaLabel="Resumo técnico da aula 059" items={[{ value: 'try → catch', label: 'Desvio controlado' }, { value: 'nextLine()', label: 'Recuperação do Scanner' }, { value: '2 portões', label: 'Tipo e regra' }]} />
      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 059"><div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>{steps.map((step, index) => <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}><span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{step.label}</strong><small>{step.duration}</small></span></button>)}</nav>
        <main className="guided-step-content"><div className="guided-step-heading"><span>{activeStep.eyebrow} · {activeStep.duration}</span><h2>{activeStep.title}</h2></div><div className="guided-blocks">{activeStep.blocks.map((block, index) => <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />)}</div><div className="guided-step-actions"><button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button><div className="guided-step-actions-main"><button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>{activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}</button>{activeIndex < steps.length - 1 && <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>}</div></div>{allStepsComplete && <section className="guided-finish"><CheckCircle2 size={30} /><div><h3>Recuperação de entrada dominada</h3><p>{lessonComplete ? 'Você provou tipo, regra, recuperação e orientação ao usuário.' : 'Registre a conclusão da aula para liberar a próxima.'}</p></div><button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>{lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}</button></section>}</main>
      </div>
      <footer className="guided-course-nav"><button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 058</button><div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>{lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}<span><strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong><small>{lessonComplete ? 'Entrada resiliente consolidada' : allStepsComplete ? 'Use o botão acima' : 'Pratique falha, limpeza, regra e recuperação'}</small></span></div><button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Próxima aula'}>Aula 060 <ArrowRight size={17} /></button></footer>
    </article>
  );
}
