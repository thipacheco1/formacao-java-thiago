# Matriz de cobertura — Aula 045

## Identificação

- Aula original: `docs/aulas/045_M1_25_ARRAYS_DE_NUMEROS_OFICIAL.md`
- Aula anterior: `docs/aulas/044_M1_24_VALIDACAO_DE_ENTRADA_SEM_TRY_CATCH_PROFUNDO_OFICIAL.md`
- Aula posterior: `docs/aulas/046_M1_26_ARRAYS_COM_TAMANHO_DEFINIDO_PELO_USUARIO_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedNumericArraysLesson045.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedNumericArraysLesson.css`
- Arquétipo: oficina de memória numérica com mapa de índices editável, animador de loop, laboratório de limites, painel de agregações, galeria de domínios e clínica de erros.
- Estado: implementada e tecnicamente validada em 2026-07-17; permanece `em_revisao` até inspeção visual e aprovação do responsável.
- Correção pós-auditoria: roteiro ampliado para sete etapas; clínica e entrega foram separadas. Foram repostos sintaxe alternativa, `double[]`, valores padrão por tipo, leitura em duas fases e preenchimento com soma no mesmo loop.

## Transformação da aula

O aluno começa vendo variáveis numéricas repetidas e termina capaz de modelar uma sequência fixa, explicar índice e elemento, percorrer sem ultrapassar o limite, produzir agregações, proteger o caso vazio, preencher com `Scanner`, diagnosticar exceções de índice e transferir o mecanismo para problemas de backend.

## Fronteiras curriculares

- A Aula 044 ensinou a proteger entradas; a Aula 045 reaplica validação ao preencher posições.
- Nesta aula os arrays têm tamanho conhecido diretamente no código. A Aula 046 perguntará o tamanho ao usuário e validará antes de criar o array.
- Arrays de `String`, matrizes, métodos com arrays, objetos e coleções não são antecipados.
- `ArrayList` é citado apenas para distinguir tamanho fixo de crescimento dinâmico.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Variáveis repetidas versus array | Abertura e mapa editável | Uma declaração reúne três valores e cada posição pode ser alterada. |
| Conceito, elemento, posição, índice e vetor | Mapa de memória | Índice, valor e expressão `numeros[i]` aparecem separadamente. |
| Declaração `int[]`, `long[]`, `double[]` | Galeria “Declarações e padrões” | Tipos, sintaxe preferida, forma alternativa e saídas padrão ficam explícitos. |
| Sintaxe preferida `int[] numeros` | Mapa e códigos | A forma moderna aparece em toda a aula. |
| Inicialização por literal | Mapa editável | `{10, 20, 30}` nasce preenchido. |
| `new int[5]` e valores padrão | Nota de inicialização e clínica | Cinco posições começam em zero e não são confundidas com dados informados. |
| Tamanho fixo | Laboratório de limites e nota ArrayList | Tentar usar `array.length` como nova posição falha. |
| Índice começa em zero | Mapa, animador e fatos | Primeiro índice 0 e primeiro elemento ficam visualmente ligados. |
| Último índice `length - 1` | Mapa e laboratório de limites | Último acesso não depende de número mágico. |
| `array.length` sem parênteses | Clínica | Comparação com `String.length()` aparece no diagnóstico. |
| Acesso e alteração por índice | Mapa editável | Seleção e atribuição atualizam somente uma célula. |
| Preenchimento por posição | Galeria Scanner | O `for` escolhe a posição que recebe a entrada. |
| Percurso com `for` | Animador | Condição, índice atual, célula, valor e console avançam juntos. |
| Razão para `< array.length` | Comparador `<` versus `<=` | O quarto estado em array de tamanho 3 gera estouro observável. |
| `ArrayIndexOutOfBoundsException` | Limites, clínica e entrega | Sintoma, causa, índice inválido e recuperação são explícitos. |
| Soma com acumulador | Painel de agregações e galeria | Alterar valores recalcula o total. |
| Média e divisão inteira | Painel, galeria e clínica | `34 / 4` é comparado com média decimal `8.5`. |
| Maior e menor | Painel e galeria | Extremos partem do primeiro elemento e exigem array não vazio. |
| Array vazio | Nota de limites e clínica | `length == 0` é seguro; `[0]` não é. |
| Contar pares | Painel de agregações | Contagem reage aos valores editados. |
| Ignorar inválidos com `continue` | Galeria “Pares e válidos” | Total 60 e dois ignorados são verificáveis. |
| `long[]` e dinheiro em centavos | Galeria de pedidos | 11500 centavos e média 2875.0 preservam cálculo inteiro. |
| Pedidos | Galeria | Soma e média dos valores são exibidas. |
| Estoque | Galeria | Total e quantidade de produtos zerados são calculados. |
| Atividades por OS | Galeria | Cada posição representa uma OS e o total é produzido. |
| Códigos de ocorrência | Galeria | Código 100 é contado três vezes. |
| Mensageria | Galeria | Mensagens com mais de duas tentativas são contadas. |
| Auditoria | Galeria | Maior volume diário é encontrado. |
| SLA | Desafio final | Total, média, extremos e violações são critérios de aceite. |
| Leitura com Scanner em dois loops | Galeria “Leitura em duas fases” e desafio | Preenchimento e processamento aparecem separados com saída conhecida. |
| Preencher e somar no mesmo loop | Galeria “Ler e somar” | Entradas 4..8 produzem total 30 e média 6.0. |
| Validar cada posição com `do while` | Galeria Scanner | Negativo repete sem avançar o índice. |
| Array não é lista | Nota de fronteira | Tamanho fixo e crescimento dinâmico ficam separados. |
| Arrays e métodos no futuro | Fronteira curricular | A aula permanece no `main` e não antecipa abstrações. |
| Dez erros comuns | Clínica com dez casos | Cada caso contém código, sintoma, causa e correção. |
| Debug de índice e valor | Animador e desafio | Estado 0, 1, 2 e condição falsa final ficam visíveis. |
| Atividade, arquivos e compilação | Entrega em quatro estágios | Pasta, núcleo compilado, erros propositais e outputs esperados. |
| Diário, Git e `.class` | Entrega e evidência copiável | Staged diff e árvore limpa encerram o laboratório. |
| Critério de conclusão | Checklist e progresso | Sete etapas, conclusão única e Aula 046 bloqueada. |

## Repetições consolidadas sem perda de conteúdo

- Soma, média, maior, menor e contagem foram reunidos em um painel manipulável e reaparecem nos contextos em que o significado muda.
- Pedidos, estoque, OS, ocorrências, mensageria, auditoria e SLA ficam em uma galeria por padrão operacional, preservando os resultados únicos.
- Os vários arquivos da atividade foram organizados em um núcleo progressivo, uma galeria e três falhas propositais, sem exigir cópia mecânica de dezenas de arquivos antes da compreensão.
- Todos os dez erros continuam individualizados porque quebram contratos diferentes.

## Saídas, precisão e segurança

- O animador termina com `indice == length` e não simula acesso nessa condição.
- O laboratório de `<=` mostra explicitamente o acesso inválido e a exceção esperada.
- Média usa cast antes da divisão; a clínica mostra por que atribuir depois a `double` não corrige truncamento.
- Maior e menor só são ensinados com proteção para array vazio.
- Valores monetários permanecem em `long` e centavos.
- O exemplo com `Scanner` valida valores numéricos já lidos; tratamento técnico de texto em `nextInt()` não é prometido.

## Responsividade e padrão compartilhado

- A raiz mantém `overflow: visible` e não sobrescreve `.guided-step-nav`.
- Mapa, animador, linha de limites, métricas, galeria, clínica e entrega reorganizam em 1024, 760 e 520 px.
- Código, terminal e painéis contêm seu próprio overflow; a página não depende de rolagem horizontal.
- Troca de etapa usa o âncora exato de `.guided-layout`; centralização móvel segue o comportamento compartilhado.
- Persistência usa chave exclusiva, filtra IDs conhecidos, normaliza conclusão incompatível e bloqueia a Aula 046 até todas as etapas e a aula estarem concluídas.

## Validação

- `npm.cmd run lint --prefix plataforma-curso`
- `npm.cmd run build --prefix plataforma-curso`
- `git diff --check` nos arquivos da Aula 045 e documentos atualizados
- Integração pelo prefixo exato `045_` conferida em `MarkdownViewer.jsx`
- Estado mantido como `em_revisao`; inspeção visual e aprovação explícita ainda são necessárias.
