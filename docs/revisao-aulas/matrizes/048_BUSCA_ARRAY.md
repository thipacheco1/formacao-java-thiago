# Matriz de cobertura — Aula 048

## Identificação

- Aula original: `docs/aulas/048_M1_28_BUSCA_EM_ARRAY_OFICIAL.md`
- Aula anterior: `docs/aulas/047_M1_27_ALTERACAO_DE_POSICOES_DO_ARRAY_OFICIAL.md`
- Aula posterior: `docs/aulas/049_M1_29_MAIOR_MENOR_SOMA_E_MEDIA_EM_ARRAY_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedArraySearchLesson048.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedArraySearchLesson.css`
- Arquétipo: oficina de busca linear com animador passo a passo, comparador de primeira/última ocorrência e contagem, sentinela, portão de acesso, dez domínios corporativos, clínica e entrega.
- Estado: implementação do Gemini auditada e corrigida pelo Codex em 2026-07-17. As coleções ausentes que derrubavam a Galeria de Domínios e a Clínica de Erros foram reconstruídas; validação estática, lint, build e inspeção responsiva passaram. Aprovação do responsável ainda pendente.

## Fronteiras curriculares

- A Aula 047 ensinou a alterar posições de um array, validar limites de índice e guardar o valor antigo para auditoria.
- A Aula 048 ensina a pesquisar um valor ou uma condição dentro de um array por meio de busca linear.
- A Aula 049 ensinará a encontrar o maior, menor, soma e média em um array. Isso não deve ser antecipado.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| O que é busca e busca linear | Etapa 1 — Simulador de Busca Linear | O aluno acompanha o ponteiro percorrendo em sequência os índices de 0 a length-1. |
| Comparação de valores no loop (`if (array[indice] == procurado)`) | Etapa 1 | A comparação lógica reativa acende a cada iteração no animador. |
| Flag `encontrou` booleana (inicializada com false, true ao achar) | Etapa 1 / Etapa 3 | A flag booleana muda de estado e é exibida na tela. |
| Primeiro exemplo mínimo completo (Main.java) | Etapa 1 | Bloco de código compilável com console simulando sucesso e falha. |
| Posição encontrada com sentinela `-1` | Etapa 3 — O Risco do Índice Inicial 0 | Simulação mostrando que inicializar com `0` gera falsos positivos na primeira posição. |
| Evitar acesso ilegal a `array[-1]` | Etapa 4 — Portão contra Acesso Inválido | Simulador gera erro controlado ao acessar sem o `if (posicao != -1)`. |
| Tradução de índice técnico (0-based) para amigável (1-based) | Etapa 3 | O aluno vê a exibição do índice `2` traduzido para "posição 3" ao usuário. |
| Uso do `break` para interrupção precoce | Etapa 2 — Modos de Ocorrência | O loop para assim que encontra a primeira ocorrência. |
| Sobrescrita da posição encontrada sem o `break` | Etapa 2 | O simulador demonstra que a variável assume a última posição encontrada. |
| Primeira ocorrência vs última ocorrência | Etapa 2 | Comparador visual com botões para alternar as regras de loop. |
| Buscar uma ocorrência vs contar todas | Etapa 2 | Mostra que a contagem acumulativa requer a ausência do break. |
| Exemplo: contar ocorrências (ContarOcorrencias.java) | Etapa 2 | Código e console de contagem reativa. |
| Busca com Scanner (BuscaComScanner.java) | Etapas 2 e 5 | console simulando a entrada do usuário em tempo real. |
| Preencher e buscar array (PreencherEBuscarArray.java) | Etapas 2 e 5 | Fluxo de preenchimento seguido por busca linear. |
| Busca e alteração física de valor (BuscarEAlterarValor.java) | Etapa 5 — Galeria de Domínios / Ajuste de Estoque | Busca o código e substitui o valor físico na posição encontrada. |
| Busca em array vazio (seguro, length == 0) | Etapa 3 | O loop é ignorado sem causar NullPointerException ou outros erros. |
| Busca em array de long para pagamentos | Etapa 5 / Pagamentos | Exemplo com `long[]` para centavos, reforçando segurança monetária. |
| Busca em array de double para notas e SLA | Etapa 5 / SLA e notas | Exemplos didáticos com double alertando sobre precisão de ponto flutuante. |
| Busca por condição (estoque zerado, limite de tentativas) | Etapa 5 / Produtos sem estoque | Filtra elementos por critérios booleanos (e.g. `estoque == 0`). |
| Exemplo aplicado: buscar código de produto | Etapa 5 / Código Produto | Localiza o índice pelo ID técnico. |
| Exemplo aplicado: buscar pedido por valor | Etapa 5 / Pedido Valor | Localização de pedido. |
| Exemplo aplicado: buscar OS por quantidade de atividades | Etapa 5 / OS Busca | Busca com interrupção. |
| Exemplo aplicado: contar OS com quantidade de atividades | Etapa 5 / OS Contagem | Contagem totalizada de OSs. |
| Exemplo aplicado: buscar código de ocorrência | Etapa 5 / Ocorrência | Busca rápida com flag booleana. |
| Exemplo aplicado: busca em array informado pelo usuário | Etapa 5 / Busca com Scanner | Programa completo lê o código, busca, trata ausência e fecha o Scanner. |
| Exemplo aplicado: buscar produto e ajustar estoque | Etapa 5 / Estoque | Conexão entre a busca e alteração de valores. |
| Arrays paralelos (didático, alerta sobre desalinhamento) | Etapa 5 / Estoque | Nota pedagógica explicando o risco e a evolução futura para objetos. |
| Mensagem detalhada de feedback (o que, se, onde) | Etapa 5 | Consoles exibindo logs detalhados do resultado da busca. |
| Performance simples em arrays grandes | Etapa 1 / Alerta técnico | Nota explicando o custo computacional em arrays extensos. |
| Quando não usar break (contar, somar, listar todos) | Etapa 2 | Quadro resumo do fluxo de controle. |
| Listar todos os inválidos (ListarProdutosSemEstoque.java) | Etapa 5 / Produtos sem estoque | Exibe todas as posições com estoque 0. |
| Existe qualquer inválido (ExisteProdutoSemEstoque.java) | Etapa 5 | Retorna booleano rápido se há ao menos um zerado. |
| Clínica de 10 Erros Comuns | Etapa 6 — Clínica de Erros | Diagnóstico interativo de falhas clássicas de busca linear. |
| Atividade prática local (24 arquivos Java) | Etapa 7 — Entrega e Desafio | PowerShell guiado para criar e testar o laboratório. |
| Debug e commits limpos | Etapa 7 | Instruções passo a passo de commit e `.gitignore`. |
| Critérios de conclusão | Gate de encerramento da aula | Checklists de validação e gate de progresso. |

## Repetições consolidadas

- Os 24 arquivos do laboratório foram estruturados e classificados na Galeria de dez Domínios (Etapa 5) e na Clínica de Erros (Etapa 6), reduzindo cliques repetitivos sem ocultar as regras de controle ou lógica de fluxo.
