import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2,
  ChevronRight, Clock3, Copy, FileCode2, Lightbulb, ListChecks, RotateCcw,
  Search, Sparkles, Terminal, Database, Wrench
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedArraySearchLesson.css';

const STORAGE_KEY = 'guided-array-search-lesson-048-progress';

const EVIDENCE = [
  '# Aula 048 — Busca em Array', '',
  '## Busca Linear e Comparação', '- [ ] Entendi que a busca linear percorre o array posição por posição', '- [ ] Usei a flag booleana `encontrou` para indicar se o elemento existe no array', '',
  '## Sentinelas e Posição Encontrada', '- [ ] Usei -1 como sentinela de posição não encontrada para evitar o falso positivo do índice 0', '- [ ] Traduzi o índice técnico zero-based para a posição amigável ao usuário (`posicao + 1`)', '',
  '## Break e Modos de Ocorrência', '- [ ] Usei `break` para interromper o loop após localizar a primeira ocorrência do valor', '- [ ] Diferenciei primeira ocorrência (com break), última ocorrência (sem break) e contagem', '- [ ] Implementei busca com Scanner, permitindo que o usuário digite o código procurado', '',
  '## Domínios e Tratamento de Erros', '- [ ] Tratei o caso de não encontrado impedindo acessos ilegais a `array[-1]`', '- [ ] Apliquei busca linear a domínios de negócio: estoque zerado, SLA extrapolado, tentativas de mensagens', '- [ ] Entendi a vantagem e as limitações de usar arrays paralelos interligados por índice de busca', '',
  '## Evidências locais', '- [ ] Criei, compilei e executei os 24 arquivos Java no ambiente local', '- [ ] Observei o erro de índice ilegal -1 proposital em `ErroAcessarPosicaoNaoEncontrada.java`', '- [ ] Mantive o histórico Git livre de arquivos `.class`',
  '',
  '## Decisão de Projeto', '- Por que a busca linear é adequada para arrays pequenos e desordenados:', '- Quando é seguro utilizar a técnica de arrays paralelos e quando ela deve ser substituída por objetos:'
].join('\n');

const DOMAIN_PROGRAMS = [
  {
    id: 'produto', label: 'Código de produto', file: 'BuscarCodigoProduto.java', type: 'int',
    code: `int[] codigos = {101, 205, 330, 418};
int procurado = 330;
int posicao = -1;

for (int i = 0; i < codigos.length; i++) {
    if (codigos[i] == procurado) {
        posicao = i;
        break;
    }
}

System.out.println(posicao == -1
        ? "Produto não encontrado"
        : "Produto na posição " + (posicao + 1));`,
    output: 'Produto na posição 3',
    insight: 'O índice técnico 2 vira a posição amigável 3 somente na mensagem para o usuário.'
  },
  {
    id: 'scanner', label: 'Busca com Scanner', file: 'BuscaComScanner.java', type: 'int',
    code: `import java.util.Scanner;

public class BuscaComScanner {
    public static void main(String[] args) {
        int[] codigos = {10, 20, 30, 40};

        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("Código procurado: ");
            int procurado = scanner.nextInt();
            int posicao = -1;

            for (int i = 0; i < codigos.length; i++) {
                if (codigos[i] == procurado) {
                    posicao = i;
                    break;
                }
            }

            System.out.println(posicao == -1
                    ? "Código não encontrado"
                    : "Encontrado na posição " + (posicao + 1));
        }
    }
}`,
    output: 'Código procurado: 30\nEncontrado na posição 3',
    insight: 'Entrada, busca e tratamento de ausência aparecem no mesmo programa executável.'
  },
  {
    id: 'pagamento', label: 'Pagamento em centavos', file: 'BuscaPagamentoCentavos.java', type: 'long',
    code: `long[] pagamentos = {15000L, 45000L, 120000L, 80000L};
long procurado = 120000L;
int posicao = -1;

for (int i = 0; i < pagamentos.length; i++) {
    if (pagamentos[i] == procurado) {
        posicao = i;
        break;
    }
}

System.out.println("Índice: " + posicao);`,
    output: 'Índice: 2',
    insight: 'Valores monetários inteiros são representados em centavos com long, sem ponto flutuante.'
  },
  {
    id: 'estoque-zero', label: 'Primeiro sem estoque', file: 'PrimeiroProdutoSemEstoque.java', type: 'int',
    code: `int[] estoques = {12, 4, 0, 8, 0};
int primeiroSemEstoque = -1;

for (int i = 0; i < estoques.length; i++) {
    if (estoques[i] == 0) {
        primeiroSemEstoque = i;
        break;
    }
}

System.out.println("Primeiro índice sem estoque: " + primeiroSemEstoque);`,
    output: 'Primeiro índice sem estoque: 2',
    insight: 'Busca por condição compara uma regra de negócio, não um valor informado separadamente.'
  },
  {
    id: 'mensageria', label: 'Muitas tentativas', file: 'PrimeiraMensagemComMuitasTentativas.java', type: 'int',
    code: `int[] tentativas = {1, 2, 5, 3};
int limite = 3;
int posicao = -1;

for (int i = 0; i < tentativas.length; i++) {
    if (tentativas[i] > limite) {
        posicao = i;
        break;
    }
}

System.out.println("Primeira mensagem crítica: " + posicao);`,
    output: 'Primeira mensagem crítica: 2',
    insight: 'O break é adequado porque o requisito pede a primeira mensagem que excedeu o limite.'
  },
  {
    id: 'sla', label: 'Atendimento fora do SLA', file: 'PrimeiroAtendimentoForaSla.java', type: 'double',
    code: `double[] horas = {1.5, 2.0, 4.75, 3.0};
double limiteSla = 4.0;
int posicao = -1;

for (int i = 0; i < horas.length; i++) {
    if (horas[i] > limiteSla) {
        posicao = i;
        break;
    }
}

System.out.println("Fora do SLA na posição: " + (posicao + 1));`,
    output: 'Fora do SLA na posição: 3',
    insight: 'Aqui a busca usa desigualdade; igualdade exata entre doubles exige cuidado com precisão.'
  },
  {
    id: 'os', label: 'Contar OS', file: 'ContarOsPorQuantidadeAtividades.java', type: 'int',
    code: `int[] atividades = {2, 5, 1, 5, 3};
int quantidadeProcurada = 5;
int ocorrencias = 0;

for (int i = 0; i < atividades.length; i++) {
    if (atividades[i] == quantidadeProcurada) {
        ocorrencias++;
    }
}

System.out.println("OS encontradas: " + ocorrencias);`,
    output: 'OS encontradas: 2',
    insight: 'Para contar todas as ocorrências, o loop precisa chegar ao fim e não pode usar break.'
  },
  {
    id: 'ocorrencia', label: 'Código de ocorrência', file: 'BuscarCodigoOcorrencia.java', type: 'long',
    code: `long[] ocorrencias = {900001L, 900015L, 900044L};
long codigo = 900015L;
boolean encontrou = false;

for (int i = 0; i < ocorrencias.length; i++) {
    if (ocorrencias[i] == codigo) {
        encontrou = true;
        break;
    }
}

System.out.println("Ocorrência existe: " + encontrou);`,
    output: 'Ocorrência existe: true',
    insight: 'Uma flag basta quando o sistema precisa saber apenas se o código existe.'
  },
  {
    id: 'ajuste', label: 'Buscar e ajustar estoque', file: 'BuscarProdutoEAjustarEstoque.java', type: 'int',
    code: `int[] codigos = {101, 205, 330};
int[] estoques = {8, 2, 0};
int codigo = 330;
int posicao = -1;

for (int i = 0; i < codigos.length; i++) {
    if (codigos[i] == codigo) {
        posicao = i;
        break;
    }
}

if (posicao != -1) {
    estoques[posicao] = 12;
    System.out.println("Novo estoque: " + estoques[posicao]);
}`,
    output: 'Novo estoque: 12',
    insight: 'Arrays paralelos exigem tamanhos iguais e o mesmo índice; objetos substituirão esse vínculo frágil.'
  },
  {
    id: 'todos-invalidos', label: 'Listar todos inválidos', file: 'ListarProdutosSemEstoque.java', type: 'int',
    code: `int[] estoques = {0, 5, 0, 9};
int encontrados = 0;

for (int i = 0; i < estoques.length; i++) {
    if (estoques[i] == 0) {
        System.out.println("Sem estoque na posição " + (i + 1));
        encontrados++;
    }
}

System.out.println("Total: " + encontrados);`,
    output: 'Sem estoque na posição 1\nSem estoque na posição 3\nTotal: 2',
    insight: 'Listar todos os inválidos é outro caso em que usar break produziria um relatório incompleto.'
  }
];

const ERRORS = [
  {
    title: 'Inicializar a posição encontrada com zero',
    code: `int posicao = 0; // 0 é um índice válido
// busca termina sem encontrar nada
System.out.println("Encontrado em " + posicao);`,
    symptom: 'Falso positivo: o programa informa a primeira posição mesmo sem encontrar o valor.',
    cause: 'Zero representa uma posição real do array e não distingue ausência de sucesso.',
    fix: 'Inicialize com `-1` e teste `posicao != -1` antes de usar o índice.'
  },
  {
    title: 'Encontrar o valor e esquecer de atualizar a flag',
    code: `boolean encontrou = false;
for (int valor : numeros) {
    if (valor == procurado) {
        break; // encontrou continua false
    }
}`,
    symptom: 'A busca localiza o valor, mas a mensagem final afirma que ele não existe.',
    cause: 'O fluxo foi interrompido antes de registrar o sucesso na variável de estado.',
    fix: 'Defina `encontrou = true` antes do `break` ou use somente a sentinela de posição.'
  },
  {
    title: 'Comparar o índice com o valor procurado',
    code: `for (int i = 0; i < numeros.length; i++) {
    if (i == procurado) { // compara índice, não conteúdo
        posicao = i;
    }
}`,
    symptom: 'O resultado depende do número do índice e ignora o conteúdo armazenado.',
    cause: 'A condição usa `i` em vez de acessar `numeros[i]`.',
    fix: 'Compare `numeros[i] == procurado`.'
  },
  {
    title: 'Usar menor ou igual ao tamanho do array',
    code: `for (int i = 0; i <= numeros.length; i++) {
    System.out.println(numeros[i]);
}`,
    symptom: 'ArrayIndexOutOfBoundsException ao chegar ao último passo.',
    cause: 'O último índice válido é `length - 1`; quando `i == length`, a posição não existe.',
    fix: 'Use sempre `i < numeros.length` no percurso completo.'
  },
  {
    title: 'Usar break quando precisava contar todas',
    code: `if (numeros[i] == procurado) {
    quantidade++;
    break;
}`,
    symptom: 'A contagem retorna no máximo 1, mesmo quando há várias ocorrências.',
    cause: 'O break encerra o loop depois do primeiro sucesso.',
    fix: 'Remova o break quando o requisito for contar, somar ou listar todas as ocorrências.'
  },
  {
    title: 'Não usar break ao buscar somente a primeira',
    code: `if (numeros[i] == procurado) {
    posicao = i; // continua e sobrescreve
}`,
    symptom: 'A variável termina apontando para a última ocorrência.',
    cause: 'Cada novo sucesso sobrescreve a posição anterior.',
    fix: 'Use `break` imediatamente depois de guardar a primeira posição.'
  },
  {
    title: 'Usar a posição sem tratar não encontrado',
    code: `int posicao = buscar(numeros, 99);
System.out.println(numeros[posicao]); // posicao pode ser -1`,
    symptom: 'ArrayIndexOutOfBoundsException: Index -1 out of bounds.',
    cause: 'A sentinela foi usada diretamente como índice técnico.',
    fix: 'Crie o portão `if (posicao != -1)` antes de acessar o array.'
  },
  {
    title: 'Usar posição amigável como índice técnico',
    code: `int posicaoDigitada = 3;
System.out.println(numeros[posicaoDigitada]);`,
    symptom: 'O programa lê a quarta célula quando o usuário pediu a terceira.',
    cause: 'A interface começa em 1, mas o array Java começa em 0.',
    fix: 'Converta uma vez: `int indice = posicaoDigitada - 1`, depois valide os limites.'
  },
  {
    title: 'Buscar em um array e usar o índice em outro sem contrato',
    code: `int posicao = buscar(codigos, codigo);
System.out.println(estoques[posicao]); // tamanhos não validados`,
    symptom: 'Dados desalinhados ou exceção quando os arrays têm tamanhos diferentes.',
    cause: 'O vínculo por índice só existe se os arrays representarem o mesmo registro e tiverem tamanhos iguais.',
    fix: 'Valide os tamanhos e documente o vínculo; futuramente agrupe os campos em objetos.'
  },
  {
    title: 'Comparar double por igualdade sem considerar precisão',
    code: `double[] valores = {0.1 + 0.2};
if (valores[0] == 0.3) {
    System.out.println("Encontrou");
}`,
    symptom: 'A busca pode não encontrar um decimal que parece visualmente igual.',
    cause: 'Alguns decimais não têm representação binária exata em ponto flutuante.',
    fix: 'Compare com tolerância: `Math.abs(valor - procurado) < 0.000001` quando o domínio permitir.'
  }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="as48-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file as48-code">
      <div className="guided-file-title">
        <FileCode2 size={17} /> {name}
        <CopyButton value={code} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={lines}
        wrapLongLines
        customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.8rem', lineHeight: 1.65 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function ArrayBlocks({ array, highlightIndex, foundIndex = -1 }) {
  return (
    <div className="as48-array-view">
      {array.map((val, idx) => {
        let cls = 'as48-cell';
        if (idx === highlightIndex) cls += ' active';
        else if (idx === foundIndex) cls += ' found';
        return (
          <div key={idx} className={cls}>
            <div className="as48-cell-idx">[{idx}]</div>
            <div className="as48-cell-val">{val}</div>
          </div>
        );
      })}
    </div>
  );
}

// 1. Animador de Busca Linear
function LinearSearchLab() {
  const [array] = useState([10, 20, 30, 40]);
  const [procurado, setProcurado] = useState(30);
  const [indice, setIndice] = useState(-1);
  const [encontrou, setEncontrou] = useState(false);
  const [posicaoEncontrada, setPosicaoEncontrada] = useState(-1);
  const [logs, setLogs] = useState(['Aguardando início...']);
  const [running, setRunning] = useState(false);

  const startSearch = () => {
    setIndice(0);
    setEncontrou(false);
    setPosicaoEncontrada(-1);
    setRunning(true);
    setLogs([`Iniciando busca linear pelo valor ${procurado}...`]);
  };

  const advanceStep = () => {
    if (indice < 0 || indice >= array.length || !running) return;

    const val = array[indice];
    const match = val === procurado;
    const nextLogs = [...logs];

    nextLogs.push(`Passo ${indice + 1}: verificando indice [${indice}] → valor ${val} == ${procurado}? ${match ? 'SIM' : 'NÃO'}`);

    if (match) {
      setEncontrou(true);
      setPosicaoEncontrada(indice);
      setRunning(false);
      nextLogs.push(`✓ Encontrado no índice [${indice}]! Executando 'break' para interromper o loop.`);
    } else {
      const nextIdx = indice + 1;
      if (nextIdx >= array.length) {
        setRunning(false);
        nextLogs.push(`✗ Fim do array alcançado. Valor não foi encontrado. Sentinela continua -1.`);
      }
      setIndice(nextIdx);
    }
    setLogs(nextLogs);
  };

  const resetSearch = () => {
    setIndice(-1);
    setEncontrou(false);
    setPosicaoEncontrada(-1);
    setRunning(false);
    setLogs(['Aguardando início...']);
  };

  const codeString = `int valorProcurado = ${procurado};\nboolean encontrou = false;\nint posicaoEncontrada = -1;\n\nfor (int i = 0; i < numeros.length; i++) {\n    if (numeros[i] == valorProcurado) {\n        encontrou = true;\n        posicaoEncontrada = i;\n        break;\n    }\n}`;

  return (
    <div className="as48-sim-box">
      <ArrayBlocks array={array} highlightIndex={running ? indice : -1} foundIndex={posicaoEncontrada} />
      <div className="as48-sim-controls">
        <label htmlFor="as48-lin-select">Procurar valor:</label>
        <select id="as48-lin-select" value={procurado} onChange={e => { setProcurado(parseInt(e.target.value)); resetSearch(); }}>
          <option value={10}>10 (Índice 0)</option>
          <option value={20}>20 (Índice 1)</option>
          <option value={30}>30 (Índice 2)</option>
          <option value={40}>40 (Índice 3)</option>
          <option value={99}>99 (Inexistente)</option>
        </select>
        {!running && indice === -1 ? (
          <button type="button" className="as48-sim-action" onClick={startSearch}>Iniciar</button>
        ) : (
          <>
            <button type="button" className="as48-sim-action" onClick={advanceStep} disabled={!running}>Avançar Passo →</button>
            <button type="button" className="as48-sim-action" style={{ background: '#475569' }} onClick={resetSearch}>Reset</button>
          </>
        )}
      </div>

      <div className="as48-sim-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <CodePanel name="BuscaLinear.java" code={codeString} lines={false} />
          <div className="as48-var-display">
            <div className="as48-var-card active-alt">
              <small>indice (i)</small>
              <strong>{indice}</strong>
            </div>
            <div className="as48-var-card">
              <small>encontrou (flag)</small>
              <strong>{encontrou ? 'true' : 'false'}</strong>
            </div>
            <div className="as48-var-card active">
              <small>posicaoEncontrada</small>
              <strong>{posicaoEncontrada}</strong>
            </div>
          </div>
        </div>
        <div className="as48-console">
          <header><Terminal size={14} /> Console de Auditoria</header>
          <pre style={{ maxHeight: '200px', overflowY: 'auto', flexGrow: 1 }}>{logs.join('\n')}</pre>
        </div>
      </div>
    </div>
  );
}

// 2. Modos de Busca
function OccurrencesLab() {
  const [array] = useState([10, 20, 30, 20, 40]);
  const [procurado] = useState(20);
  const [modo, setModo] = useState('first'); // 'first' | 'last' | 'count'
  const [logs, setLogs] = useState('');

  useEffect(() => {
    let result = '';
    let foundIdx = -1;
    let count = 0;

    if (modo === 'first') {
      result += `// Primeira Ocorrência (com break)\n`;
      for (let i = 0; i < array.length; i++) {
        result += `Verificando indice [${i}]: ${array[i]}\n`;
        if (array[i] === procurado) {
          foundIdx = i;
          result += `-> Encontrou no índice [${i}]. Executou 'break'!\n`;
          break;
        }
      }
      result += `\nResultado final: posicaoEncontrada = ${foundIdx}`;
    } else if (modo === 'last') {
      result += `// Última Ocorrência (sem break)\n`;
      for (let i = 0; i < array.length; i++) {
        result += `Verificando indice [${i}]: ${array[i]}\n`;
        if (array[i] === procurado) {
          foundIdx = i;
          result += `-> Encontrou no índice [${i}]. Sobrescrevendo anterior.\n`;
        }
      }
      result += `\nResultado final: posicaoEncontrada = ${foundIdx}`;
    } else {
      result += `// Contar Ocorrências (sem break)\n`;
      for (let i = 0; i < array.length; i++) {
        result += `Verificando indice [${i}]: ${array[i]}\n`;
        if (array[i] === procurado) {
          count++;
          result += `-> Encontrou no índice [${i}]. Incrementou contagem para ${count}.\n`;
        }
      }
      result += `\nResultado final: quantidadeEncontrada = ${count}`;
    }

    setLogs(result);
  }, [modo, array, procurado]);

  return (
    <div className="as48-sim-box">
      <ArrayBlocks array={array} highlightIndex={-1} foundIndex={modo === 'first' ? 1 : modo === 'last' ? 3 : -1} />
      <div className="as48-sim-controls">
        <label>Estratégia de Busca (Valor 20):</label>
        <button type="button" className="as48-sim-action" onClick={() => setModo('first')} style={{ background: modo === 'first' ? '#059669' : '#64748b' }}>Primeira Ocorrência</button>
        <button type="button" className="as48-sim-action" onClick={() => setModo('last')} style={{ background: modo === 'last' ? '#059669' : '#64748b' }}>Última Ocorrência</button>
        <button type="button" className="as48-sim-action" onClick={() => setModo('count')} style={{ background: modo === 'count' ? '#059669' : '#64748b' }}>Contar Todas</button>
      </div>

      <div className="as48-sim-grid">
        <CodePanel name="EstrategiasLoop.java" code={
          modo === 'first'
            ? `for (int i = 0; i < arr.length; i++) {\n    if (arr[i] == 20) {\n        posicao = i;\n        break; // para imediatamente\n    }\n}`
            : modo === 'last'
              ? `for (int i = 0; i < arr.length; i++) {\n    if (arr[i] == 20) {\n        posicao = i; // continua varrendo\n    }\n}`
              : `for (int i = 0; i < arr.length; i++) {\n    if (arr[i] == 20) {\n        quantidade++; // acumula contagem\n    }\n}`
        } lines={false} />
        <div className="as48-console">
          <header><Terminal size={14} /> Fluxo de Execução</header>
          <pre>{logs}</pre>
        </div>
      </div>
    </div>
  );
}

// 3. Sentinela de Erro 0
function SentinelaLab() {
  const procurado = 99;

  const comSentinela = `int posicaoEncontrada = -1; // correto\nfor (int i = 0; i < arr.length; i++) {\n    if (arr[i] == ${procurado}) {\n        posicaoEncontrada = i;\n        break;\n    }\n}\n// posicaoEncontrada continua -1 (correto!)`;
  const semSentinela = `int posicaoEncontrada = 0; // incorreto\nfor (int i = 0; i < arr.length; i++) {\n    if (arr[i] == ${procurado}) {\n        posicaoEncontrada = i;\n        break;\n    }\n}\n// posicaoEncontrada continuou 0!\n// O sistema acha que o valor foi achado no índice 0 (arr[0] = 10)!`;

  return (
    <div className="as48-sim-box">
      <div className="as48-sim-controls">
        <label htmlFor="as48-sent-select">Valor procurado inexistente:</label>
        <select id="as48-sent-select" value={procurado} readOnly>
          <option value={99}>99 (Não existe no array)</option>
        </select>
      </div>
      <div className="as48-sim-grid">
        <CodePanel name="SeguroComSentinela.java" code={comSentinela} lines={false} />
        <CodePanel name="InseguroSentinelaZero.java" code={semSentinela} lines={false} />
      </div>
      <aside className="guided-note warning">
        <AlertTriangle size={20} />
        <div>
          <strong>Por que inicializar com -1?</strong>
          <p>
            O índice 0 é uma posição perfeitamente válida em arrays Java (a primeira célula). Se você inicializa a variável com 0 e a busca termina sem achar nada, o programa assumirá indevidamente que o valor procurado estava no índice 0. O valor -1 serve como uma sentinela universal de "nenhuma posição encontrada".
          </p>
        </div>
      </aside>
    </div>
  );
}

// 4. Acesso Inválido
function InvalidAccessLab() {
  const [posicao, setPosicao] = useState(-1);
  const [consoleMsg, setConsoleMsg] = useState('Console limpo.');
  const [status, setStatus] = useState('idle');

  const comSeguranca = () => {
    if (posicao !== -1) {
      setConsoleMsg(`Console:\n> Acesso seguro: numeros[${posicao}] = 10;`);
      setStatus('success');
    } else {
      setConsoleMsg('Console:\n> Busca sem sucesso. Acesso bloqueado para evitar erro.');
      setStatus('idle');
    }
  };

  const semSeguranca = () => {
    if (posicao === -1) {
      setConsoleMsg('Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index -1 out of bounds for length 3\n\tat ErroAcessarPosicaoNaoEncontrada.main(ErroAcessarPosicaoNaoEncontrada.java:10)');
      setStatus('error');
    } else {
      setConsoleMsg(`Console:\n> numeros[${posicao}] = 10;`);
      setStatus('success');
    }
  };

  return (
    <div className="as48-sim-box">
      <div className="as48-sim-controls">
        <label htmlFor="as48-acc-pos">Posição encontrada da busca:</label>
        <select id="as48-acc-pos" value={posicao} onChange={e => { setPosicao(parseInt(e.target.value)); setConsoleMsg('Console limpo.'); setStatus('idle'); }}>
          <option value={-1}>-1 (Não Encontrado)</option>
          <option value={0}>0 (Primeira Posição)</option>
        </select>
        <button type="button" className="as48-sim-action" onClick={comSeguranca} style={{ background: '#059669' }}>Acesso Seguro</button>
        <button type="button" className="as48-sim-action" onClick={semSeguranca} style={{ background: '#be123c' }}>Acesso Direto (Quebra)</button>
      </div>

      <div className="as48-sim-grid">
        <CodePanel name="SegurancaAcesso.java" code={`// Seguro:\nif (posicaoEncontrada != -1) {\n    System.out.println(numeros[posicaoEncontrada]);\n} else {\n    System.out.println("Não encontrado");\n}\n\n// Perigoso (Trava se for -1):\nSystem.out.println(numeros[posicaoEncontrada]);`} lines={false} />
        <div className={`as48-console ${status}`}>
          <header><Terminal size={14} /> Console do Java</header>
          <pre>{consoleMsg}</pre>
        </div>
      </div>
    </div>
  );
}

// 5. Galeria de Domínios
function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return (
    <section className="as48-domains-gallery">
      <div className="as48-domains-sidebar">
        {DOMAIN_PROGRAMS.map((entry, index) => (
          <button key={entry.id} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
            {entry.label}
          </button>
        ))}
      </div>
      <div className="as48-domains-content">
        <CodePanel name={item.file} code={item.code} />
        <div className="as48-console">
          <header><Terminal size={15} /> Console simulado (saída de {item.type || 'void'})</header>
          <pre>{item.output}</pre>
          <p><Sparkles size={16} /><span>{item.insight}</span></p>
        </div>
      </div>
    </section>
  );
}

// 6. Clínica de Erros
function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="as48-errors-clinic">
      <nav className="as48-errors-nav">
        {ERRORS.map((entry, index) => (
          <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
            <span>{index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="as48-error-card">
        <header>
          <AlertTriangle size={20} />
          <div>
            <small>Caso {selected + 1} de {ERRORS.length}</small>
            <h3>{item.title}</h3>
          </div>
        </header>
        <CodePanel name="Código Problemático" code={item.code} />
        <section style={{ margin: '12px 0' }}>
          <small style={{ display: 'block', marginBottom: '4px', fontSize: '.65rem', color: '#475569', fontWeight: 'bold' }}>Sintoma no console</small>
          <code style={{ display: 'block', padding: '10px', color: '#fecdd3', background: '#0f172a', borderRadius: '8px', fontSize: '.7rem', fontFamily: 'Consolas, monospace' }}>{item.symptom}</code>
        </section>
        <div className="as48-error-flow">
          <span>
            <Search size={16} />
            <div><strong>Causa raiz</strong><p>{item.cause}</p></div>
          </span>
          <ChevronRight size={18} />
          <span>
            <Wrench size={16} />
            <div><strong>Como corrigir</strong><p>{item.fix}</p></div>
          </span>
        </div>
      </div>
    </section>
  );
}

// 7. PowerShell de Entrega
function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Montar Diretório',
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-048-busca-array\ncd labs\\m1\\aula-048-busca-array\nNew-Item Main.java, BuscaComPosicao.java, ContarOcorrencias.java, BuscaComScanner.java, PreencherEBuscarArray.java, BuscarEAlterarValor.java, BuscaPagamentoCentavos.java, PrimeiroProdutoSemEstoque.java, PrimeiraMensagemComMuitasTentativas.java, PrimeiroAtendimentoForaSla.java, BuscarCodigoProduto.java, BuscarPedidoPorValor.java, BuscarOsPorQuantidadeAtividades.java, ContarOsPorQuantidadeAtividades.java, BuscarCodigoOcorrencia.java, BuscaEmArrayInformadoUsuario.java, BuscarProdutoEAjustarEstoque.java, ListarProdutosSemEstoque.java, ExisteProdutoSemEstoque.java, ErroPosicaoInicialZero.java, ErroCompararIndice.java, ErroEsquecerFlag.java, ErroBreakAoContar.java, ErroAcessarPosicaoNaoEncontrada.java',
      out: 'Criado com sucesso 24 arquivos de laboratório local.',
      tip: 'Organize os códigos dos domínios em cada arquivo Java correspondente.'
    },
    {
      title: 'Compilar e Quebrar',
      cmd: 'javac *.java\njava ErroAcessarPosicaoNaoEncontrada',
      out: 'Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index -1 out of bounds for length 3',
      tip: 'O arquivo ErroAcessarPosicaoNaoEncontrada.java vai falhar ao rodar porque tenta ler um índice inválido (-1). É intencional.'
    },
    {
      title: 'Verificar Contagens',
      cmd: 'java ContarOcorrencias',
      out: 'Quantidade encontrada: 3',
      tip: 'Observe que a contagem do código 100 corre em todo o array de 5 posições sem dar break.'
    },
    {
      title: 'Fazer o Commit Git',
      cmd: 'git status\ngit add labs/m1/aula-048-busca-array docs/diario-de-bordo.md\ngit commit -m "Aula 048: pratica busca em array"\ngit status',
      out: 'working tree clean',
      tip: 'Confirme que nenhum arquivo class compilado está listado pelo git status.'
    }
  ];
  const current = steps[stage];
  return (
    <section>
      <div className="as48-delivery-nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={stage === index ? 'active' : ''} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </div>
      <div className="as48-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="as48-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
      <div className="guided-file as48-code" style={{ marginTop: '14px' }}>
        <div className="guided-file-title">
          <BookOpenCheck size={16} /> docs/diario-de-bordo.md
          <CopyButton value={EVIDENCE} label="Copiar evidências" />
        </div>
        <SyntaxHighlighter language="markdown" style={vscDarkPlus} wrapLongLines customStyle={{ margin: 0, padding: '18px', background: '#0f172a', fontSize: '.78rem', lineHeight: 1.65 }}>
          {EVIDENCE}
        </SyntaxHighlighter>
      </div>
    </section>
  );
}

function ContentBlock({ block }) {
  if (block.type === 'lead') return <p className="guided-lead">{block.text}</p>;
  if (block.type === 'linear_search') return <LinearSearchLab />;
  if (block.type === 'occurrences') return <OccurrencesLab />;
  if (block.type === 'sentinela') return <SentinelaLab />;
  if (block.type === 'invalid_access') return <InvalidAccessLab />;
  if (block.type === 'domains_gallery') return <DomainsGalleryLab />;
  if (block.type === 'errors_clinic') return <ErrorsClinicLab />;
  if (block.type === 'delivery') return <DeliveryLab />;
  if (block.type === 'note') {
    const Icon = block.tone === 'warning' ? AlertTriangle : Lightbulb;
    return <aside className={'guided-note ' + (block.tone || 'info')}><Icon size={21} /><div><strong>{block.title}</strong><p>{block.text}</p></div></aside>;
  }
  if (block.type === 'challenge') {
    return (
      <section className="guided-challenge">
        <div className="guided-challenge-title"><Sparkles size={22} /><h3>{block.title}</h3></div>
        <p>{block.text}</p>
        <h4>Critérios de aceite</h4>
        <ul>{block.acceptance.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
      </section>
    );
  }
  return null;
}

const steps = [
  {
    id: 'linear_search',
    eyebrow: 'Busca Linear',
    label: 'Simulador de Busca',
    title: 'Visualizando o percurso sequencial do loop',
    duration: '7 min',
    blocks: [
      { type: 'lead', text: 'Selecione o valor desejado e avance passo a passo para acompanhar o ponteiro de busca comparando os índices:' },
      { type: 'linear_search' }
    ]
  },
  {
    id: 'ocorrencias',
    eyebrow: 'Estratégias de Busca',
    label: 'Modos de Ocorrência',
    title: 'Comportamento com break, sem break e contagem',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Altere o modo de busca no array duplicado e acompanhe a saída no console simulado:' },
      { type: 'occurrences' }
    ]
  },
  {
    id: 'sentinela',
    eyebrow: 'Valor Sentinela',
    label: 'Risco do Índice Zero',
    title: 'Por que inicializar a posição encontrada com -1',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Compare a lógica com sentinela -1 versus a inicialização incorreta em 0 para valores inexistentes:' },
      { type: 'sentinela' }
    ]
  },
  {
    id: 'invalid_access',
    eyebrow: 'Proteção de Acesso',
    label: 'Portão contra Acesso Inválido',
    title: 'Prevenindo ArrayIndexOutOfBoundsException ao ler resultados',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Inspecione a segurança de leitura para evitar crashes quando a busca não obtém sucesso:' },
      { type: 'invalid_access' }
    ]
  },
  {
    id: 'dominios',
    eyebrow: 'Prática de Backend',
    label: 'Galeria de Domínios',
    title: 'Modelando problemas corporativos reais de busca em arrays',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Conheça como a busca linear é aplicada a estoques, pedidos, ordem de serviço, mensageria e SLA:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Diagnosticando as 10 falhas comuns de busca em loops',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Examine a clínica diagnóstica para corrigir os erros técnicos clássicos da aula:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega final',
    label: 'Entrega & Desafio',
    title: 'Prática de laboratório local, compilação e versionamento no Git',
    duration: '10 min',
    blocks: [
      { type: 'lead', text: 'Crie e teste a pasta com os 24 arquivos de laboratório locais, provocando o erro de índice inválido intencional:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio: Localizador de Pagamento Excedente',
        text: 'Crie o arquivo PagamentoExcedente.java em labs/m1/aula-048-busca-array/. Declare um array long[] contendo 5 pagamentos em centavos: {15000L, 45000L, 120000L, 80000L, 200000L}. Leia um valor limite via Scanner. Busque o primeiro pagamento que seja estritamente maior que o limite informado. Se encontrar, exiba "Primeiro pagamento excedente na posição X: valor Y". Se não encontrar, exiba "Nenhum pagamento excede o limite".',
        acceptance: [
          'Percorrer o array long[] com busca linear por critério de desigualdade (>).',
          'Usar break para parar no primeiro pagamento encontrado.',
          'Inicializar a posição encontrada com a sentinela -1.',
          'Converter o índice técnico do Java para a posição amigável ao usuário (+1) na exibição.',
          'Verificação e compilação local limpa sem arquivos compilados no Git.'
        ]
      }
    ]
  }
];

export default function GuidedArraySearchLesson048({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepNavRef = useRef(null);
  const completionNormalizedRef = useRef(false);
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return new Set(Array.isArray(saved) ? saved.filter(id => steps.some(step => step.id === id)) : []);
    } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedStepIds]));
  }, [completedStepIds]);

  const activeStep = steps[activeIndex];
  const progress = Math.round((completedStepIds.size / steps.length) * 100);
  const allStepsComplete = completedStepIds.size === steps.length;
  const activeStepComplete = completedStepIds.has(activeStep.id);
  const lessonComplete = isCompleted && allStepsComplete;
  const completedLabel = `${completedStepIds.size} de ${steps.length} etapas concluídas`;

  useEffect(() => {
    if (completionNormalizedRef.current) return;
    completionNormalizedRef.current = true;
    if (isCompleted && !allStepsComplete) onToggleCompleted();
  }, [allStepsComplete, isCompleted, onToggleCompleted]);

  useEffect(() => {
    stepNavRef.current?.querySelector('button.active')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeIndex]);

  const selectStep = index => {
    setActiveIndex(index);
    document.querySelector('.guided-layout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleActiveStep = () => {
    if (activeStepComplete && isCompleted) onToggleCompleted();
    setCompletedStepIds(previous => {
      const next = new Set(previous);
      if (next.has(activeStep.id)) next.delete(activeStep.id);
      else next.add(activeStep.id);
      return next;
    });
  };

  return (
    <article className="guided-git-lesson guided-array-search-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Database size={17} /> Algoritmos de Busca</span>
          <p className="guided-sequence">048 · M1.28</p>
          <h1>Busca em Array</h1>
          <p>Aprenda a pesquisar e localizar elementos dentro de arrays usando busca linear. Domine o uso de flags booleanas, sentinelas de posição (-1), controle de repetição precoce por break e tratamentos de falhas.</p>
        </div>
        <div className="guided-hero-status">
          <Database size={42} />
          <strong>{progress}%</strong>
          <span>{completedLabel}</span>
        </div>
        <div className="guided-progress-track" aria-label={`Progresso: ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <GuidedLessonFacts ariaLabel="Resumo técnico da aula" items={[
        { value: 'linear', label: 'busca em sequência' },
        { value: 'break', label: 'primeira ocorrência' },
        { value: '-1 sentry', label: 'sem falsos positivos' }
      ]} />

      <div className="guided-layout">
        <nav ref={stepNavRef} className="guided-step-nav" aria-label="Etapas da aula 048">
          <div className="guided-step-nav-title"><ListChecks size={18} /> Roteiro prático</div>
          {steps.map((step, index) => (
            <button type="button" key={step.id} className={(index === activeIndex ? 'active ' : '') + (completedStepIds.has(step.id) ? 'done' : '')} onClick={() => selectStep(index)}>
              <span className="guided-step-number">{completedStepIds.has(step.id) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}</span>
              <span><strong>{step.label}</strong><small>{step.duration}</small></span>
            </button>
          ))}
        </nav>

        <main className="guided-step-content">
          <div className="guided-step-heading">
            <span>{activeStep.eyebrow} · {activeStep.duration}</span>
            <h2>{activeStep.title}</h2>
          </div>
          <div className="guided-blocks">
            {activeStep.blocks.map((block, index) => (
              <ContentBlock block={block} key={`${activeStep.id}-${block.type}-${index}`} />
            ))}
          </div>

          <div className="guided-step-actions">
            <button type="button" className="secondary" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)}><ArrowLeft size={17} /> Etapa anterior</button>
            <div className="guided-step-actions-main">
              <button type="button" className={`step-toggle ${activeStepComplete ? 'undo' : 'complete'}`} onClick={toggleActiveStep}>
                {activeStepComplete ? <><RotateCcw size={16} /> Desmarcar etapa</> : <><CheckCircle2 size={16} /> Concluir etapa</>}
              </button>
              {activeIndex < steps.length - 1 && (
                <button type="button" className="primary" disabled={!activeStepComplete} onClick={() => selectStep(activeIndex + 1)}>Próxima etapa <ArrowRight size={17} /></button>
              )}
            </div>
          </div>

          {allStepsComplete && (
            <section className="guided-finish">
              <CheckCircle2 size={30} />
              <div>
                <h3>Busca linear de arrays dominada!</h3>
                <p>{lessonComplete ? 'Conceitos, sentinelas, estratégias de break e clínicas registrados.' : 'Conclua a aula para consolidar seus conhecimentos.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 047</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Busca linear de arrays consolidada' : allStepsComplete ? 'Use o botão acima' : 'Pratique sentinelas, loops de busca e break'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir Estatísticas de Array'}>Aula 049 <ArrowRight size={17} /></button>
      </footer>
    </article>
  );
}
