# Matriz de cobertura — Aula 040

## Identificação

- Aula original: `docs/aulas/040_M1_20_DO_WHILE_OFICIAL.md`
- Aula anterior: `docs/aulas/039_M1_19_WHILE_OFICIAL.md`
- Aula posterior: `docs/aulas/041_M1_21_FOR_CLASSICO_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedDoWhileLesson040.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedDoWhileLesson.css`
- Arquétipo: oficina de repetição pós-teste com comparador interativo `while` × `do while`, terminal executável, simulador de menu, galeria de validações e clínica de erros.
- Estado: implementada e tecnicamente validada em 2026-07-17; permanece `em_revisao` até inspeção visual e aprovação do responsável.

## Transformação da aula

O aluno começa sabendo que `while` testa antes. Termina capaz de escolher conscientemente o pós-teste, provar a primeira execução pela saída, manter menus com sentinela, insistir em entradas inválidas, limitar tentativas, diagnosticar falhas e entregar evidências versionadas.

## Fronteiras curriculares

- A Aula 039 ensinou `while`, zero ou mais iterações, contadores e acumuladores.
- A Aula 040 muda somente a ordem essencial: executa primeiro e testa depois; contador e `break`/`continue` são retomados sem aprofundamento indevido.
- A Aula 041 apresentará `for` clássico para repetições cujo início, condição e atualização formam um controle explícito.
- Arrays, coleções, métodos extraídos e arquitetura de menus permanecem fora do escopo.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Significado e sintaxe de `do` + `while` | Comparador interativo e primeiro programa | Fluxo “executa → testa” e código completo com `} while (condicao);`. |
| Diferença direta para `while` | Comparador com valores iniciais 1, 5 e 10 | Número de execuções e caminho de cada estrutura mudam na tela. |
| Execução garantida ao menos uma vez | `PrimeiraExecucao.java` | Com contador 10, a saída ainda mostra uma execução e depois `Fim`. |
| Ponto e vírgula final obrigatório | Nota sintática e clínica, caso 1 | Mensagem `';' expected`, causa e correção. |
| Contador crescente e decrescente | Comparador, galeria e clínica de direção | Valores iniciais, atualização e condição de término são confrontados. |
| Compilar e executar com `javac`/`java` | Terminal do primeiro programa e entrega | Comando, ausência de saída do compilador e saída completa da JVM. |
| Menu com `Scanner`, switch tradicional/moderno e saída 0 | Simulador de menu + `MenuDoWhile.java` | Opções 1, 2, 9 e 0 alteram um console visível; `default` e sentinela são provados. |
| Por que menu combina com `do while` | Simulador e nota de interpretação | Menu aparece antes de a opção existir, sem inicialização artificial `-1`. |
| Valor sentinela | Etapa “Menu e sentinela” | `opcao != 0` fica falsa depois da escolha 0. |
| Validação de quantidade | Galeria “Quantidade” | Entrada `-2`, depois `4`, com falha e aceitação observáveis. |
| Validação de texto e nome obrigatório | Galeria “Nome e confirmação” e consolidação de domínio | `trim()`, `toUpperCase()`, `isBlank()` e nova tentativa são explicados. |
| Confirmação S/N e comparação de `String` | Galeria “Nome e confirmação” | Entradas com caixa/espaços são normalizadas e `"S".equals(...)` é interpretado. |
| Senha com limite e condição composta | Galeria “Senha limitada” | Senha errada e `tentativas < limiteTentativas` precisam ser verdadeiros simultaneamente. |
| Pedido, produto, cliente, e-mail, OS, mensageria e auditoria | Galeria “Pedido e produto”, simulador e desafio | As regras únicas são preservadas; exemplos estruturalmente idênticos são consolidados por padrão. |
| Limite da validação `contains("@")` | Nota de precisão | A aula explicita que o teste não é validação completa de e-mail. |
| `nextInt()` seguido de `nextLine()` | Galeria específica e clínica | Entrada `1↵` seguida de `Ana↵`, causa do texto vazio e consumo da quebra de linha. |
| Escolha entre `while` e `do while` | Comparador e clínica “escolhido por hábito” | Caso com zero pendências mostra por que o pré-teste protege o processamento. |
| Loop infinito, condição invertida e atualização ausente | Clínica de erros | Sintoma, causa e recuperação para cada falha. |
| `break` e `continue` em nível inicial | Galeria “break e continue” | Saída `1, 2, 4`; o teste final após `continue` e a interrupção por `break` são explicados. |
| Dez erros comuns do original | Clínica em oito famílias diagnósticas | Repetições foram agrupadas: sintaxe, término/direção, condição, pré-condição, Scanner e contrato de menu. |
| Debug da primeira execução | Comparador passo a passo | Estado inicial, execução, atualização e teste final aparecem na ordem real do contrato. |
| Atividade, diário e commit | Entrega em quatro estágios | Criação, compilação, testes de fronteira, `git diff --staged`, commit e `.class` fora do histórico. |
| Critérios de conclusão | Evidências copiáveis, gate da aula e desafio | Checklist objetivo, conclusão por etapas e navegação bloqueada até a conclusão geral. |

## Repetições consolidadas sem perda de conteúdo

- Os muitos programas de menu (OS, mensageria, auditoria e switch moderno) viraram um simulador funcional e um código completo; os domínios permanecem nomeados e seus estados/contadores aparecem na explicação e no desafio.
- As validações de pedido, produto, quantidade, nome e e-mail foram organizadas por tipo de regra: número positivo, número não negativo, texto obrigatório e verificação textual simplificada.
- Os dez erros originais foram agrupados em oito diagnósticos porque “variável não atualizada” e “loop infinito”, assim como “saída ausente” e “menu sem sentinela”, descreviam a mesma causa estrutural.
- Contadores crescente/decrescente e primeira condição falsa são explorados no mesmo comparador, mantendo os três comportamentos sem repetir páginas de código.

## Saídas e recuperações verificadas

- `javac` bem-sucedido não imprime mensagem; a aula não inventa uma confirmação do compilador.
- `java PrimeiraExecucao` imprime exatamente `Executou com contador: 10` e `Fim`.
- O menu mostra novamente as opções após 1, 2 ou entrada inválida; 0 encerra.
- `nextLine()` intermediário é explicado como consumo do restante da linha depois de `nextInt()`.
- Loop infinito intencional só é sugerido com interrupção explícita por `Ctrl+C`; o desafio exige condição de saída observável.

## Responsividade e padrão compartilhado

- A raiz preserva `overflow: visible` e não altera o comportamento sticky de `.guided-step-nav`.
- Comparador, terminais, menu, galeria, clínica e entrega usam `minmax(0, ...)`, `min-width: 0` e reorganização em 1024, 760 e 520 px.
- Código e terminal limitam o overflow ao próprio painel; a página não depende de rolagem horizontal.
- A seleção de etapa usa o âncora aprovado em `.guided-layout`; centralização do roteiro compacto continua delegada a `GuidedLessonFacts`/CSS compartilhado.
- A barra fixa, a normalização de estados antigos, marcar/desmarcar etapa, conclusão única e bloqueio da próxima aula seguem o blueprint.

## Validação

- `npm.cmd run lint --prefix plataforma-curso`
- `npm.cmd run build --prefix plataforma-curso`
- `git diff --check` nos arquivos da Aula 040 e documentos atualizados
- Integração por prefixo exato `040_` conferida em `MarkdownViewer.jsx`
- Estado mantido como `em_revisao`; aprovação visual ainda é necessária para mudar para `refeita`.
