import React, { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2,
  ChevronRight, Clock3, Copy, FileCode2, Lightbulb, ListChecks, RotateCcw,
  Search, Sparkles, Terminal, Database, Wrench, Info
} from 'lucide-react';
import './guidedLesson.css';
import GuidedLessonFacts from './GuidedLessonFacts';
import './guidedArrayModificationLesson.css';

const STORAGE_KEY = 'guided-array-modification-lesson-047-progress';

const EVIDENCE = [
  '# Aula 047 — Alteração de Posições do Array', '',
  '## Tamanho Fixo e Conteúdo Mutável', '- [ ] Entendi que a atribuição altera o valor interno da célula mas o tamanho (`length`) permanece fixo', '- [ ] Identifiquei o valor padrão inicial de arrays inteiros (`0`), decimais (`0.0`) e booleanos (`false`)', '- [ ] Reconheci o risco de confundir o zero padrão com um zero de negócio legítimo', '',
  '## Mapeamento de Índices e Tradução', '- [ ] Traduzi posições 1-based do usuário para índices 0-based do Java (`posicaoUsuario - 1`)', '- [ ] Testei e simulei inputs de consoles reais mapeando Scanner para atribuição direta', '',
  '## Portão de Segurança e Exceção', '- [ ] Tratei a exceção ArrayIndexOutOfBoundsException gerada por índices ilegais', '- [ ] Implementei a validação de portão de segurança: `if (indice >= 0 && indice < array.length)`', '',
  '## Histórico e Auditoria', '- [ ] Salvei o valor antigo do elemento em variável auxiliar antes de sobrescrever', '- [ ] Simulei logs de auditoria mostrando a diferença de estado', '',
  '## Recálculo de Valores Derivados', '- [ ] Recalculei a soma total do array percorrendo todas as posições após a alteração', '- [ ] Realizei o ajuste incremental otimizado: `total = total - valorAntigo + valorNovo`', '',
  '## Processamento em Lote', '- [ ] Criei loops para alterar todos os elementos (aumento geral, zerar negativos, aplicar limites, etc.)', '',
  '## Evidências locais', '- [ ] Criei, compilei e executei os 25 arquivos Java no ambiente local', '- [ ] Identifiquei o erro de índice ilegal proposital em `ErroIndiceInvalido.java`', '- [ ] Salvei o diário e mantive os binários `.class` fora do Git',
  '',
  '## Decisão de Projeto', '- Por que prefiro recalcular o total inteiro do array em sistemas pequenos:', '- Por que o default value 0 pode camuflar bugs se não houver inicialização explícita:'
].join('\n');

const DOMAIN_PROGRAMS = [
  {
    id: 0, label: 'Ajuste de Estoque', file: 'AjusteEstoqueProduto.java', type: 'int',
    code: `import java.util.Scanner;
public class AjusteEstoqueProduto {
    public static void main(String[] args) {
        int[] estoques = {10, 5, 8, 0};
        int produto = 2; // Posição 2 (amigável)
        int novoEstoque = 12;

        if (produto < 1 || produto > estoques.length) {
            System.out.println("Produto inválido");
        } else {
            int indice = produto - 1; // Índice 1
            if (novoEstoque < 0) {
                System.out.println("Estoque não pode ser negativo");
            } else {
                int estoqueAntigo = estoques[indice];
                estoques[indice] = novoEstoque;
                System.out.println("Estoque ajustado");
                System.out.println("Antigo: " + estoqueAntigo);
                System.out.println("Novo: " + estoques[indice]);
            }
        }
    }
}`,
    output: 'Estoque ajustado\nAntigo: 5\nNovo: 12',
    insight: 'Valida a posição amigável do usuário e protege o novo valor contra estoques negativos antes de efetuar a alteração.'
  },
  {
    id: 1, label: 'Pedido (Centavos)', file: 'CorrigirValorPedido.java', type: 'long',
    code: `public class CorrigirValorPedido {
    public static void main(String[] args) {
        long[] valoresPedidosCentavos = {1000L, 2500L, 5000L};
        int pedido = 1; // Pedido 1
        long novoValorCentavos = 1500L;

        if (pedido < 1 || pedido > valoresPedidosCentavos.length) {
            System.out.println("Pedido inválido");
        } else {
            int indice = pedido - 1;
            if (novoValorCentavos <= 0) {
                System.out.println("Valor inválido");
            } else {
                long valorAntigo = valoresPedidosCentavos[indice];
                valoresPedidosCentavos[indice] = novoValorCentavos;
                System.out.println("Pedido corrigido de " + valorAntigo + " para " + valoresPedidosCentavos[indice]);
            }
        }
    }
}`,
    output: 'Pedido corrigido de 1000 para 1500',
    insight: 'Usar long para representar valores monetários em centavos previne problemas de arredondamento inerentes ao float/double.'
  },
  {
    id: 2, label: 'Atividades por OS', file: 'AtualizarAtividadesOs.java', type: 'int',
    code: `public class AtualizarAtividadesOs {
    public static void main(String[] args) {
        int[] atividadesPorOs = {2, 4, 1};
        int os = 3;
        int novaQuantidade = 5;

        if (os < 1 || os > atividadesPorOs.length) {
            System.out.println("OS inválida");
        } else {
            int indice = os - 1;
            if (novaQuantidade <= 0) {
                System.out.println("A OS deve ter ao menos uma atividade");
            } else {
                int antigo = atividadesPorOs[indice];
                atividadesPorOs[indice] = novaQuantidade;
                System.out.println("OS " + os + " atualizada para " + novaQuantidade + " atividades");
            }
        }
    }
}`,
    output: 'OS 3 atualizada para 5 atividades',
    insight: 'Regras de negócio exigem que a quantidade de atividades por ordem de serviço nunca seja menor ou igual a zero.'
  },
  {
    id: 3, label: 'Mensageria', file: 'IncrementarTentativaMensagem.java', type: 'int',
    code: `public class IncrementarTentativaMensagem {
    public static void main(String[] args) {
        int[] tentativasPorMensagem = {1, 2, 0};
        int mensagem = 3;

        if (mensagem < 1 || mensagem > tentativasPorMensagem.length) {
            System.out.println("Mensagem inválida");
        } else {
            int indice = mensagem - 1;
            tentativasPorMensagem[indice]++; // Incremento
            System.out.println("Nova tentativa registrada. Mensagem " + mensagem + " = " + tentativasPorMensagem[indice]);
        }
    }
}`,
    output: 'Nova tentativa registrada. Mensagem 3 = 1',
    insight: 'A alteração aqui é incremental (`++`), simulando o reenvio e contagem de tentativas de entrega de um web-hook ou broker.'
  },
  {
    id: 4, label: 'Ajuste SLA (double)', file: 'AjustarSlaHoras.java', type: 'double',
    code: `public class AjustarSlaHoras {
    public static void main(String[] args) {
        double[] temposHoras = {2.5, 4.0, 1.5};
        int atendimento = 1;
        double novoTempo = 3.2;

        if (atendimento < 1 || atendimento > temposHoras.length) {
            System.out.println("Atendimento inválido");
        } else {
            int indice = atendimento - 1;
            if (novoTempo < 0) {
                System.out.println("Tempo não pode ser negativo");
            } else {
                temposHoras[indice] = novoTempo;
                System.out.println("SLA alterado para " + temposHoras[indice] + " horas");
            }
        }
    }
}`,
    output: 'SLA alterado para 3.2 horas',
    insight: 'Uso de double[] para tempos fracionados, garantindo consistência com a regra de que tempos de atendimento não podem ser negativos.'
  },
  {
    id: 5, label: 'Normalização em Lote', file: 'ZerarValoresNegativos.java', type: 'int',
    code: `public class ZerarValoresNegativos {
    public static void main(String[] args) {
        int[] valores = {10, -5, 20, -1, 30};

        for (int i = 0; i < valores.length; i++) {
            if (valores[i] < 0) {
                valores[i] = 0; // Normaliza
            }
        }

        for (int val : valores) {
            System.out.print(val + " ");
        }
    }
}`,
    output: '10 0 20 0 30 ',
    insight: 'Percorre todo o array e altera apenas as posições que violam a condição de negócio, útil para higienização e saneamento de dados vindos de APIs.'
  },
  {
    id: 6, label: 'Teto de Valores (Clipping)', file: 'AplicarLimiteMaximo.java', type: 'int',
    code: `public class AplicarLimiteMaximo {
    public static void main(String[] args) {
        int[] pontuacoes = {80, 120, 95, 150};

        for (int i = 0; i < pontuacoes.length; i++) {
            if (pontuacoes[i] > 100) {
                pontuacoes[i] = 100; // Teto
            }
        }

        for (int val : pontuacoes) {
            System.out.print(val + " ");
        }
    }
}`,
    output: '80 100 95 100 ',
    insight: 'Aplica um limite rígido a todos os elementos. O nome técnico importa menos do que a regra observável: nenhum valor permanece acima de 100.'
  },
  {
    id: 7, label: 'Auditoria por Dia', file: 'RegistrarEventoAuditoriaArray.java', type: 'int',
    code: `public class RegistrarEventoAuditoriaArray {
    public static void main(String[] args) {
        int[] eventosPorDia = {5, 8, 3, 0, 4};
        int dia = 4;

        if (dia < 1 || dia > eventosPorDia.length) {
            System.out.println("Dia inválido");
        } else {
            int indice = dia - 1;
            int valorAntigo = eventosPorDia[indice];
            eventosPorDia[indice]++;
            System.out.println("Eventos antes: " + valorAntigo);
            System.out.println("Eventos agora: " + eventosPorDia[indice]);
        }
    }
}`,
    output: 'Eventos antes: 0\nEventos agora: 1',
    insight: 'Preserva o valor anterior e incrementa a posição escolhida, oferecendo uma evidência mínima de auditoria.'
  },
  {
    id: 8, label: 'Aumento em Lote', file: 'AumentarTodosValores.java', type: 'int',
    code: `public class AumentarTodosValores {
    public static void main(String[] args) {
        int[] valores = {10, 20, 30};

        for (int indice = 0; indice < valores.length; indice++) {
            valores[indice] += 10;
        }

        for (int valor : valores) {
            System.out.println(valor);
        }
    }
}`,
    output: '20\n30\n40',
    insight: 'O loop foi escolhido porque a regra realmente deve alcançar todas as posições, não apenas uma.'
  },
  {
    id: 9, label: 'Substituir Zeros', file: 'SubstituirZeros.java', type: 'int',
    code: `public class SubstituirZeros {
    public static void main(String[] args) {
        int[] quantidades = {3, 0, 5, 0};

        for (int indice = 0; indice < quantidades.length; indice++) {
            if (quantidades[indice] == 0) {
                quantidades[indice] = 1;
            }
        }

        for (int valor : quantidades) {
            System.out.println(valor);
        }
    }
}`,
    output: '3\n1\n5\n1',
    insight: 'Só aplique esta normalização quando a regra declarar que zero significa ausência. Em estoque ou auditoria, zero pode ser um dado legítimo.'
  }
];

const ERRORS = [
  { title: 'Achar que atribuição muda o tamanho', code: 'int[] numeros = {10, 20, 30};\nnumeros[1] = 99;\n// Achar que numeros.length agora é 4!', symptom: 'Problemas de lógica ao assumir que o array cresceu.', cause: 'Arrays em Java possuem tamanho fixo após sua criação na memória heap.', fix: 'Entenda que atribuição altera o valor de uma gaveta existente, nunca adiciona gavetas.' },
  { title: 'Usar posição amigável como índice direto', code: 'int[] numeros = {10, 20, 30};\nint posicaoUsuario = 1;\nnumeros[posicaoUsuario] = 99; // altera o 20!', symptom: 'A primeira posição (10) permanece inalterada; a segunda (20) é sobrescrita por engano.', cause: 'O usuário conta a partir de 1, mas o Java inicia seus índices técnicos em 0.', fix: 'Faça a tradução técnica: int indice = posicaoUsuario - 1;\nnumeros[indice] = 99;' },
  { title: 'Não validar o índice antes de alterar', code: 'int[] numeros = {10, 20, 30};\nint indice = 3;\nnumeros[indice] = 99; // Crash!', symptom: 'ArrayIndexOutOfBoundsException em tempo de execução.', cause: 'Tentativa de acessar uma célula inexistente na memória do array.', fix: 'Valide sempre: if (indice >= 0 && indice < numeros.length) {\n    numeros[indice] = 99;\n}' },
  { title: 'Deixar de validar limites do novo valor', code: 'int[] estoques = {10, 5, 8};\nestoques[0] = -15; // Estoque negativo!', symptom: 'Estados inconsistentes no banco e na lógica de vendas.', cause: 'Atribuição direta de valores arbitrários sem aplicar validações de domínio.', fix: 'if (novoEstoque >= 0) {\n    estoques[0] = novoEstoque;\n}' },
  { title: 'Esquecer de salvar o valor anterior', code: 'int[] estoques = {10, 5, 8};\nestoques[1] = 12;\n// Como auditar o que mudou?', symptom: 'Impossibilidade de gerar logs de auditoria detalhados e rastrear fraudes.', cause: 'A escrita sobrescreve permanentemente a posição na memória sem backup.', fix: 'int antigo = estoques[1];\nestoques[1] = 12;\nSystem.out.println("Mudou de " + antigo + " para 12");' },
  { title: 'Manter acumuladores desatualizados', code: 'int[] valores = {10, 20, 30};\nint total = 60;\nvalores[1] = 100;\nSystem.out.println(total); // total continua 60!', symptom: 'Relatórios e faturamento mostrando valores errados.', cause: 'Valores derivados calculados antes da modificação não se atualizam sozinhos.', fix: 'Recalcule por completo em loop ou atualize incrementalmente:\ntotal = total - valorAntigo + valorNovo;' },
  { title: 'Confundir valor padrão com entrada', code: 'int[] estoques = new int[5];\n// estoques[0] é 0. É estoque zerado ou não preenchido?', symptom: 'O sistema trata um item recém-cadastrado como "esgotado" indevidamente.', cause: 'O Java inicia arrays de int com zeros (default values).', fix: 'Inicie com um valor sentinela (ex: -1) ou use um booleano de controle paralelo.' },
  { title: 'Usar <= no limite do loop de percurso', code: 'for (int i = 0; i <= array.length; i++) {\n    array[i] += 5;\n}', symptom: 'ArrayIndexOutOfBoundsException na última volta do loop.', cause: 'O índice máximo válido é array.length - 1. O operador <= tenta acessar length.', fix: 'Use sempre < no controle do loop:\nfor (int i = 0; i < array.length; i++)' },
  { title: 'Substituir todos quando queria um só', code: 'for (int i = 0; i < array.length; i++) {\n    array[i] = novoValor; // altera tudo!\n}', symptom: 'Todos os produtos ficam com o mesmo preço ou quantidade.', cause: 'Colocação de uma instrução pontual dentro de um loop de percurso geral.', fix: 'Remova o loop se a alteração for em uma posição única e específica.' },
  { title: 'Mudar e não inspecionar o resultado', code: 'estoques[indice] = novo;\n// Fim do programa silencioso.', symptom: 'Dificuldade de depurar se a alteração realmente ocorreu.', cause: 'Falta de logs de monitoramento ou testes após escritas de dados.', fix: 'Imprima o array ou use o depurador para garantir a consistência física.' }
];

function CopyButton({ value, label = 'Copiar' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { setCopied(false); }
  };
  return <button type="button" className="am47-copy" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copiado' : label}</button>;
}

function CodePanel({ name, code, language = 'java', lines = true }) {
  return (
    <div className="guided-file am47-code">
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

function ArrayBlocks({ array, highlightIndex, altIndex = -1 }) {
  return (
    <div className="am47-array-view">
      {array.map((val, idx) => {
        let cls = 'am47-cell';
        if (idx === highlightIndex) cls += ' highlight';
        else if (idx === altIndex) cls += ' highlight-alt';
        return (
          <div key={idx} className={cls}>
            <div className="am47-cell-idx">[{idx}]</div>
            <div className="am47-cell-val">{val}</div>
          </div>
        );
      })}
    </div>
  );
}

// 1. Tamanho Fixo e Conteúdo Mutável
function MutabilityLab() {
  const [array, setArray] = useState([10, 20, 30]);
  const [inputVal, setInputVal] = useState('99');
  const [selectedIdx, setSelectedIdx] = useState(1);

  const handleModify = () => {
    const parsed = parseInt(inputVal);
    if (isNaN(parsed)) return;
    const next = [...array];
    next[selectedIdx] = parsed;
    setArray(next);
  };

  const codeString = `int[] numeros = {${array.join(', ')}};\n// Alterando índice ${selectedIdx} para ${inputVal}\nnumeros[${selectedIdx}] = ${inputVal};\n// numeros.length continua sendo ${array.length}`;

  return (
    <div className="am47-sim-box">
      <ArrayBlocks array={array} highlightIndex={selectedIdx} />
      <div className="am47-sim-controls">
        <label htmlFor="am47-mut-select">Índice:</label>
        <select id="am47-mut-select" value={selectedIdx} onChange={e => setSelectedIdx(parseInt(e.target.value))}>
          <option value={0}>Índice [0]</option>
          <option value={1}>Índice [1]</option>
          <option value={2}>Índice [2]</option>
        </select>
        <label htmlFor="am47-mut-val">Novo valor:</label>
        <input id="am47-mut-val" type="number" value={inputVal} onChange={e => setInputVal(e.target.value)} />
        <button type="button" className="am47-sim-action" onClick={handleModify}>Substituir</button>
      </div>
      <CodePanel name="AlteracaoSimples.java" code={codeString} lines={false} />
      <aside className="guided-note info">
        <Info size={20} />
        <div>
          <strong>Tamanho Fixo e Valores Padrão</strong>
          <p>
            O array continua com {array.length} posições. Se tivéssemos feito <code>int[] array = new int[3]</code> no início, ele conteria <code>[0, 0, 0]</code> (valores padrão de inicialização). A atribuição apenas substitui os valores dessas caixas.
          </p>
        </div>
      </aside>
    </div>
  );
}

// 2. Posição do Usuário vs Índice Técnico
function IndexMappingLab() {
  const [array, setArray] = useState([10, 20, 30]);
  const [posicao, setPosicao] = useState(2);
  const [novoValor, setNovoValor] = useState(99);
  const [consoleMsg, setConsoleMsg] = useState('Aguardando simulação...');

  const executarTraducao = () => {
    if (posicao < 1 || posicao > 3) {
      setConsoleMsg('Console:\n> Posição inválida! Escolha de 1 a 3.');
      return;
    }
    const idxTecnico = posicao - 1;
    const next = [...array];
    const antigo = next[idxTecnico];
    next[idxTecnico] = novoValor;
    setArray(next);
    setConsoleMsg(`Console:\n> Posição do usuário: ${posicao}\n> Índice calculado: posicaoUsuario - 1 = ${idxTecnico}\n> Substituindo o valor antigo (${antigo}) pelo novo (${novoValor})\n> Array atualizado com sucesso!`);
  };

  const codeString = `int posicaoUsuario = ${posicao};\nint indiceTecnico = posicaoUsuario - 1; // ${posicao} - 1 = ${posicao - 1}\n\nif (posicaoUsuario >= 1 && posicaoUsuario <= numeros.length) {\n    numeros[indiceTecnico] = ${novoValor};\n}`;

  return (
    <div className="am47-sim-box">
      <ArrayBlocks array={array} highlightIndex={posicao - 1} />
      <div className="am47-sim-controls">
        <label htmlFor="am47-map-pos">Posição do Usuário (1 a 3):</label>
        <input id="am47-map-pos" type="number" min={1} max={3} value={posicao} onChange={e => setPosicao(parseInt(e.target.value) || 0)} />
        <label htmlFor="am47-map-val">Novo valor:</label>
        <input id="am47-map-val" type="number" value={novoValor} onChange={e => setNovoValor(parseInt(e.target.value) || 0)} />
        <button type="button" className="am47-sim-action" onClick={executarTraducao}>Mapear & Gravar</button>
      </div>
      <div className="am47-sim-grid">
        <CodePanel name="MapeamentoPosicao.java" code={codeString} lines={false} />
        <div className="am47-console">
          <header><Terminal size={14} /> Console</header>
          <pre>{consoleMsg}</pre>
        </div>
      </div>
    </div>
  );
}

// 3. Portão de Segurança
function SecurityGateLab() {
  const [array, setArray] = useState([10, 20, 30]);
  const [indiceInput, setIndiceInput] = useState(3);
  const [consoleMsg, setConsoleMsg] = useState('Aguardando simulação...');
  const [consoleStatus, setConsoleStatus] = useState('idle');

  const comSeguranca = () => {
    if (indiceInput >= 0 && indiceInput < array.length) {
      const next = [...array];
      next[indiceInput] = 99;
      setArray(next);
      setConsoleMsg(`Console:\n> Índice ${indiceInput} é válido!\n> numeros[${indiceInput}] = 99;\n> Alteração realizada.`);
      setConsoleStatus('success');
    } else {
      setConsoleMsg(`Console:\n> Índice ${indiceInput} é inválido!\n> Portão de segurança bloqueou a alteração para evitar erro.`);
      setConsoleStatus('error');
    }
  };

  const semSeguranca = () => {
    if (indiceInput >= 0 && indiceInput < array.length) {
      const next = [...array];
      next[indiceInput] = 99;
      setArray(next);
      setConsoleMsg(`Console:\n> numeros[${indiceInput}] = 99;\n> Alteração realizada.`);
      setConsoleStatus('success');
    } else {
      setConsoleMsg(`Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index ${indiceInput} out of bounds for length ${array.length}\n\tat ValidacaoIndice.main(ValidacaoIndice.java:7)`);
      setConsoleStatus('error');
    }
  };

  return (
    <div className="am47-sim-box">
      <ArrayBlocks array={array} highlightIndex={indiceInput >= 0 && indiceInput < 3 ? indiceInput : -1} />
      <div className="am47-sim-controls">
        <label htmlFor="am47-sec-idx">Informe qualquer índice técnico:</label>
        <input id="am47-sec-idx" type="number" value={indiceInput} onChange={e => setIndiceInput(parseInt(e.target.value) || 0)} />
        <button type="button" className="am47-sim-action" onClick={comSeguranca} style={{ background: '#059669' }}>Com Validação (Seguro)</button>
        <button type="button" className="am47-sim-action" onClick={semSeguranca} style={{ background: '#be123c' }}>Sem Validação (Perigo)</button>
      </div>
      <div className="am47-sim-grid">
        <CodePanel name="SegurancaIndices.java" code={`// Seguro:\nif (indice >= 0 && indice < numeros.length) {\n    numeros[indice] = 99;\n} else {\n    System.out.println("Índice inválido");\n}\n\n// Inseguro (Pode quebrar o app):\nnumeros[indice] = 99;`} lines={false} />
        <div className={`am47-console ${consoleStatus}`}>
          <header><Terminal size={14} /> Console do Java</header>
          <pre>{consoleMsg}</pre>
        </div>
      </div>
    </div>
  );
}

// 4. Preservação de Histórico e Auditoria
function AuditLab() {
  const [array, setArray] = useState([10, 5, 8]);
  const [indice, setIndice] = useState(1);
  const [novoValor, setNovoValor] = useState(12);
  const [logs, setLogs] = useState([
    'Iniciou: [10, 5, 8]'
  ]);

  const realizarAlteracao = () => {
    if (indice < 0 || indice >= array.length) return;
    const valorAntigo = array[indice];
    const next = [...array];
    next[indice] = novoValor;
    setArray(next);
    const novoLog = `[${new Date().toLocaleTimeString()}] Alterou índice [${indice}]: ${valorAntigo} → ${novoValor} | Array: [${next.join(', ')}]`;
    setLogs([novoLog, ...logs]);
  };

  const codeString = `int valorAntigo = estoques[${indice}];\nestoques[${indice}] = ${novoValor};\nSystem.out.println("Alterou de " + valorAntigo + " para " + estoques[${indice}]);`;

  return (
    <div className="am47-sim-box">
      <ArrayBlocks array={array} highlightIndex={indice} />
      <div className="am47-sim-controls">
        <label htmlFor="am47-aud-idx">Selecionar produto:</label>
        <select id="am47-aud-idx" value={indice} onChange={e => setIndice(parseInt(e.target.value))}>
          <option value={0}>Produto 1 (Estoque: {array[0]})</option>
          <option value={1}>Produto 2 (Estoque: {array[1]})</option>
          <option value={2}>Produto 3 (Estoque: {array[2]})</option>
        </select>
        <label htmlFor="am47-aud-val">Ajustar quantidade:</label>
        <input id="am47-aud-val" type="number" value={novoValor} onChange={e => setNovoValor(parseInt(e.target.value) || 0)} />
        <button type="button" className="am47-sim-action" onClick={realizarAlteracao}>Ajustar Estoque</button>
      </div>
      <div className="am47-sim-grid">
        <CodePanel name="AuditoriaEstoque.java" code={codeString} lines={false} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '.7rem', fontWeight: 'bold', color: '#64748b' }}>LOG DE AUDITORIA</span>
          <div className="am47-audit-logs">
            {logs.map((log, idx) => (
              <div key={idx} className="am47-audit-line">
                <ChevronRight size={12} /> {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Recálculo e Otimização
function RecalculationLab() {
  const [array, setArray] = useState([10, 20, 30]);
  const [totalCalculado, setTotalCalculado] = useState(60);
  const [logs, setLogs] = useState(['Total inicial = 60']);
  const [recalculando, setRecalculando] = useState(false);
  const totalReal = array.reduce((a, b) => a + b, 0);
  const totalDesatualizado = totalCalculado !== totalReal;

  const alterarSemRecalcular = () => {
    const antigo = array[1];
    if (antigo === 100) return;
    const next = [...array];
    next[1] = 100;
    setArray(next);
    setLogs([
      `Alterou índice [1] de ${antigo} para 100. O total armazenado ${totalCalculado} ficou desatualizado.`,
      ...logs
    ]);
  };

  const recalcularCompleto = () => {
    setRecalculando(true);
    setTimeout(() => {
      let soma = 0;
      for (let i = 0; i < array.length; i++) {
        soma += array[i];
      }
      setTotalCalculado(soma);
      setLogs([`Recalculou com loop completo: total = ${soma}`, ...logs]);
      setRecalculando(false);
    }, 500);
  };

  const alterarComAjusteIncremental = () => {
    if (totalDesatualizado) {
      setLogs(['Ajuste incremental bloqueado: primeiro sincronize o total que já está desatualizado.', ...logs]);
      return;
    }
    const antigo = array[1];
    const novo = antigo === 20 ? 100 : 20;
    const next = [...array];
    next[1] = novo;
    setArray(next);

    const novoTotal = totalCalculado - antigo + novo;
    setTotalCalculado(novoTotal);
    setLogs([
      `Ajustou incrementalmente: ${totalCalculado} - ${antigo} + ${novo} = ${novoTotal}`,
      ...logs
    ]);
  };

  const reiniciar = () => {
    setArray([10, 20, 30]);
    setTotalCalculado(60);
    setLogs(['Estado reiniciado: array [10, 20, 30], total = 60']);
  };

  return (
    <div className="am47-sim-box">
      <ArrayBlocks array={array} highlightIndex={1} />
      <div className="am47-sim-controls">
        <button type="button" className="am47-sim-action am47-neutral-action" onClick={alterarSemRecalcular}>
          Alterar [1] sem atualizar total
        </button>
        <button type="button" className="am47-sim-action" onClick={recalcularCompleto} disabled={recalculando}>
          {recalculando ? 'Calculando...' : 'Recalcular Completo (Loop)'}
        </button>
        <button type="button" className="am47-sim-action am47-safe-action" onClick={alterarComAjusteIncremental} disabled={totalDesatualizado}>
          Alterar + ajustar incrementalmente
        </button>
        <button type="button" className="am47-sim-action am47-reset-action" onClick={reiniciar}><RotateCcw size={14} /> Reiniciar</button>
      </div>

      <CodePanel name="RecalculoAposAlteracao.java" code={`int[] valores = {10, 20, 30};
int total = 60;

// Estratégia 1: alterar e recalcular todo o array
valores[1] = 100;
total = 0;
for (int indice = 0; indice < valores.length; indice++) {
    total += valores[indice];
}

// Estratégia 2: em uma alteração atômica e consistente
int indice = 1;
int valorAntigo = valores[indice];
int valorNovo = 20;
valores[indice] = valorNovo;
total = total - valorAntigo + valorNovo;`} lines={false} />

      <div className="am47-sim-grid">
        <div className="am47-total-calc-box">
          <div className="am47-calc-card active">
            <small>Total armazenado {totalDesatualizado ? '— desatualizado' : '— consistente'}</small>
            <strong>{totalCalculado}</strong>
          </div>
          <div className="am47-calc-card">
            <small>Soma Real do Array</small>
            <strong>{totalReal}</strong>
          </div>
        </div>
        <div className="am47-console">
          <header><Terminal size={14} /> Histórico do Cálculo</header>
          <pre style={{ maxHeight: '110px', overflowY: 'auto' }}>
            {logs.join('\n')}
          </pre>
        </div>
      </div>
    </div>
  );
}

// 6. Galeria de Domínios
function DomainsGalleryLab() {
  const [selected, setSelected] = useState(0);
  const item = DOMAIN_PROGRAMS[selected];
  return (
    <section className="am47-domains-gallery">
      <div className="am47-domains-sidebar">
        {DOMAIN_PROGRAMS.map((entry, index) => (
          <button key={entry.id} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
            {entry.label}
          </button>
        ))}
      </div>
      <div className="am47-domains-content">
        <CodePanel name={item.file} code={item.code} />
        <div className="am47-console">
          <header><Terminal size={15} /> Console simulado (saída de {item.type || 'void'})</header>
          <pre>{item.output}</pre>
          <p><Sparkles size={16} /><span>{item.insight}</span></p>
        </div>
      </div>
    </section>
  );
}

// 7. Clínica de Erros
function ErrorsClinicLab() {
  const [selected, setSelected] = useState(0);
  const item = ERRORS[selected];
  return (
    <section className="am47-errors-clinic">
      <nav className="am47-errors-nav">
        {ERRORS.map((entry, index) => (
          <button key={entry.title} type="button" className={selected === index ? 'active' : ''} onClick={() => setSelected(index)}>
            <span>{index + 1}</span>
            {entry.title}
          </button>
        ))}
      </nav>
      <div className="am47-error-card">
        <header>
          <AlertTriangle size={20} />
          <div>
            <small>Falha comum {selected + 1} de {ERRORS.length}</small>
            <h3>{item.title}</h3>
          </div>
        </header>
        <CodePanel name="Código Problemático" code={item.code} />
        <section style={{ margin: '12px 0' }}>
          <small style={{ display: 'block', marginBottom: '4px', fontSize: '.65rem', color: '#475569', fontWeight: 'bold' }}>Sintoma no console</small>
          <code style={{ display: 'block', padding: '10px', color: '#fecdd3', background: '#0f172a', borderRadius: '8px', fontSize: '.7rem', fontFamily: 'Consolas, monospace' }}>{item.symptom}</code>
        </section>
        <div className="am47-error-flow">
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

// 8. Terminal e Entrega
function DeliveryLab() {
  const [stage, setStage] = useState(0);
  const steps = [
    {
      title: 'Montar Workspace',
      cmd: 'New-Item -ItemType Directory -Force labs\\m1\\aula-047-alteracao-posicoes-array\ncd labs\\m1\\aula-047-alteracao-posicoes-array\nNew-Item Main.java, AlteracaoComFor.java, ValorAntigoENovo.java, ValoresPadraoArray.java, AlterandoValorPadrao.java, BaixaEstoqueArray.java, BaixaEstoqueSegura.java, ValidacaoIndice.java, AlterarPosicaoConsole.java, AlterarPosicaoComHistorico.java, AjusteEstoqueProduto.java, CorrigirValorPedido.java, AtualizarAtividadesOs.java, IncrementarTentativaMensagem.java, RegistrarEventoAuditoriaArray.java, AjustarSlaHoras.java, RecalcularTotalAposAlteracao.java, AjustarTotalComValorAntigo.java, AumentarTodosValores.java, ZerarValoresNegativos.java, AplicarLimiteMaximo.java, SubstituirZeros.java, ErroIndiceInvalido.java, ErroPosicaoUsuarioComoIndice.java, ErroTotalDesatualizado.java',
      out: 'Criado com sucesso 25 arquivos de prática local.',
      tip: 'Organize os domínios corporativos e as correções de erro nos arquivos sugeridos.'
    },
    {
      title: 'Compilar e Quebrar',
      cmd: 'javac *.java\njava ErroIndiceInvalido',
      out: 'Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3',
      tip: 'O arquivo ErroIndiceInvalido.java vai lançar uma exceção de índice ilegal. É o comportamento esperado do Java.'
    },
    {
      title: 'Verificar Ajustes',
      cmd: 'java RecalcularTotalAposAlteracao\njava AjustarTotalComValorAntigo',
      out: 'Total atualizado: 140\nTotal ajustado: 6000',
      tip: 'Os resultados pertencem a dados diferentes: 140 vem de 10 + 100 + 30; 6000 vem de 1000 + 5000. Verifique cada programa contra sua própria entrada, nunca comparando apenas os números finais.'
    },
    {
      title: 'Commit no Git',
      cmd: 'git status\ngit diff\ngit add labs/m1/aula-047-alteracao-posicoes-array docs/diario-de-bordo.md\ngit diff --staged\ngit commit -m "Aula 047: pratica alteracao de posicoes do array"\ngit status',
      out: 'working tree clean',
      tip: 'Revise o staged diff antes do commit e use git status para confirmar que nenhum arquivo .class foi incluído.'
    }
  ];
  const current = steps[stage];
  return (
    <section>
      <div className="am47-delivery-nav">
        {steps.map((entry, index) => (
          <button key={entry.title} type="button" className={stage === index ? 'active' : ''} onClick={() => setStage(index)}>
            <span>{index < stage ? <Check size={12} /> : index + 1}</span>
            {entry.title}
          </button>
        ))}
      </div>
      <div className="am47-terminal">
        <header><Terminal size={15} /> PowerShell <small>saída esperada</small></header>
        <pre><strong>PS&gt; {current.cmd}</strong>{'\n\n'}{current.out}</pre>
        <p><Lightbulb size={16} /> {current.tip}</p>
      </div>
      <div className="am47-delivery-actions">
        <button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}><ArrowLeft size={14} /> Anterior</button>
        <span>Passo {stage + 1} de {steps.length}</span>
        <button type="button" disabled={stage === steps.length - 1} onClick={() => setStage(stage + 1)}>Próxima prova <ArrowRight size={14} /></button>
      </div>
      <div className="guided-file am47-code" style={{ marginTop: '14px' }}>
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
  if (block.type === 'mutability_lab') return <MutabilityLab />;
  if (block.type === 'mapping_lab') return <IndexMappingLab />;
  if (block.type === 'security_lab') return <SecurityGateLab />;
  if (block.type === 'audit_lab') return <AuditLab />;
  if (block.type === 'recalc_lab') return <RecalculationLab />;
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
    id: 'mutabilidade',
    eyebrow: 'Estruturas de Array',
    label: 'Tamanho Fixo & Conteúdo Mutável',
    title: 'A diferença entre adicionar elementos e modificar gavetas',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Veja como a atribuição simples substitui os dados nas células sem alterar a estrutura dimensional fixa do array:' },
      { type: 'mutability_lab' }
    ]
  },
  {
    id: 'mapeamento',
    eyebrow: 'Tradução de Índices',
    label: 'Índice Técnico vs Amigável',
    title: 'Traduzindo a visão do usuário para os índices técnicos',
    duration: '5 min',
    blocks: [
      { type: 'lead', text: 'Experimente a simulação de inputs amigáveis do usuário (começando em 1) e veja como fazer a tradução correta para os índices zero-based:' },
      { type: 'mapping_lab' }
    ]
  },
  {
    id: 'seguranca',
    eyebrow: 'Portão de Segurança',
    label: 'Validação de Índices',
    title: 'Evitando ArrayIndexOutOfBoundsException antes da alteração',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Experimente acessar posições fora do limite de comprimento do array com e sem o portão de validação de índice técnico:' },
      { type: 'security_lab' }
    ]
  },
  {
    id: 'auditoria',
    eyebrow: 'Auditoria de Dados',
    label: 'Histórico & Auditoria',
    title: 'Preservando o valor antigo de negócio antes de reescrever',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Ajuste estoques simulados e observe o padrão de gravação do valor anterior no console de logs da auditoria:' },
      { type: 'audit_lab' }
    ]
  },
  {
    id: 'recalculo',
    eyebrow: 'Valores Derivados',
    label: 'Recálculo & Otimização',
    title: 'Recalculando a soma total do array após modificações',
    duration: '6 min',
    blocks: [
      { type: 'lead', text: 'Veja a diferença entre realizar o loop completo em todos os elementos para recalcular totais versus a técnica de ajuste incremental:' },
      { type: 'recalc_lab' }
    ]
  },
  {
    id: 'dominios',
    eyebrow: 'Prática Corporativa',
    label: 'Galeria de Domínios',
    title: 'Modelando ajustes reais de negócio com arrays numéricos',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Navegue pelos domínios para conferir as implementações específicas de OS, Mensageria, Auditoria, Pedidos e loops de percurso:' },
      { type: 'domains_gallery' }
    ]
  },
  {
    id: 'clinica',
    eyebrow: 'Depuração',
    label: 'Clínica de Erros',
    title: 'Diagnosticando as 10 falhas clássicas de alteração de arrays',
    duration: '8 min',
    blocks: [
      { type: 'lead', text: 'Explore a clínica diagnóstica para examinar sintomas, causa raiz e a correção técnica para cada erro comum:' },
      { type: 'errors_clinic' }
    ]
  },
  {
    id: 'entrega',
    eyebrow: 'Entrega final',
    label: 'Entrega & Desafio',
    title: 'Prática PowerShell, depuração e validação de commits no Git',
    duration: '10 min',
    blocks: [
      { type: 'lead', text: 'Prepare a estrutura local do laboratório, crie os 25 arquivos de prática e execute os testes de verificação de commits:' },
      { type: 'delivery' },
      {
        type: 'challenge',
        title: 'Desafio: Modificador de Limites de Temperatura',
        text: 'Crie um programa Java TemperaturaLimite.java em labs/m1/aula-047-alteracao-posicoes-array/. Declare um array double[] com 5 temperaturas: {25.5, 42.0, -10.5, 30.0, 55.0}. Percorra o array em loop para identificar qualquer temperatura acima de 40.0 e substitua por 40.0. Faça o mesmo para temperaturas abaixo de 0.0, substituindo-as por 0.0. Exiba os valores ajustados no console e recalcule o total de temperaturas antes e depois.',
        acceptance: [
          'Percorrer o array double[] usando loop com limite < length.',
          'Aplicar validação e substituição de valores (teto 40.0, piso 0.0).',
          'Recalcular de forma consistente a soma total antes e após a alteração.',
          'Verificação e compilação local limpa sem arquivos compilados no Git.'
        ]
      }
    ]
  }
];

export default function GuidedArrayModificationLesson047({ isCompleted, onToggleCompleted, onNextLesson, onPrevLesson, hasNextLesson, hasPrevLesson }) {
  const [activeIndex, setActiveIndex] = useState(0);
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
    <article className="guided-git-lesson guided-array-modification-lesson">
      <header className="guided-hero">
        <div className="guided-hero-copy">
          <span className="guided-kicker"><Database size={17} /> Mutabilidade do Conteúdo</span>
          <p className="guided-sequence">047 · M1.27</p>
          <h1>Alteração de Posições do Array</h1>
          <p>Aprenda a modificar e atualizar os dados do array por índices técnicos de forma segura. Valide limites, previna ArrayIndexOutOfBoundsException, salve valores de auditoria e recalcule totais.</p>
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
        { value: 'array[idx]', label: 'atribuição simples' },
        { value: 'pos - 1', label: 'tradução de índice' },
        { value: 'valide!', label: 'ArrayIndexOutOfBounds' }
      ]} />

      <div className="guided-layout">
        <nav className="guided-step-nav" aria-label="Etapas da aula 047">
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
                <h3>Mutabilidade dominada com segurança!</h3>
                <p>{lessonComplete ? 'Conceitos, validações, domínios e clínicas registrados.' : 'Conclua a aula para consolidar seus conhecimentos.'}</p>
              </div>
              <button type="button" className={lessonComplete ? 'reopen' : ''} onClick={onToggleCompleted}>
                {lessonComplete ? <><RotateCcw size={16} /> Reabrir aula</> : <><CheckCircle2 size={16} /> Concluir aula</>}
              </button>
            </section>
          )}
        </main>
      </div>

      <footer className="guided-course-nav">
        <button type="button" onClick={onPrevLesson} disabled={!hasPrevLesson}><ArrowLeft size={17} /> Aula 046</button>
        <div className={`guided-course-status ${lessonComplete ? 'completed' : allStepsComplete ? 'ready' : ''}`}>
          {lessonComplete ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
          <span>
            <strong>{lessonComplete ? 'Aula concluída' : allStepsComplete ? 'Pronta para concluir' : `${completedStepIds.size} de ${steps.length} etapas`}</strong>
            <small>{lessonComplete ? 'Alteração de arrays consolidada' : allStepsComplete ? 'Use o botão acima' : 'Pratique índices técnicos, validações e recálculos'}</small>
          </span>
        </div>
        <button type="button" onClick={onNextLesson} disabled={!hasNextLesson || !lessonComplete} title={!lessonComplete ? 'Conclua todas as etapas para avançar' : 'Abrir Busca em Array'}>Aula 048 <ArrowRight size={17} /></button>
      </footer>
    </article>
  );
}
