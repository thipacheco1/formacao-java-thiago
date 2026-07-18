# Matriz de cobertura — Aula 046

## Identificação

- Aula original: `docs/aulas/046_M1_26_ARRAYS_COM_TAMANHO_DEFINIDO_PELO_USUARIO_OFICIAL.md`
- Aula anterior: `docs/aulas/045_M1_25_ARRAYS_DE_NUMEROS_OFICIAL.md`
- Aula posterior: `docs/aulas/047_M1_27_ALTERACAO_DE_POSICOES_DO_ARRAY_OFICIAL.md`
- Experiência candidata: `plataforma-curso/src/components/GuidedUserSizedArraysLesson046.jsx`
- Estilos candidatos: `plataforma-curso/src/components/guidedUserSizedArraysLesson.css`
- Arquétipo: oficina de alocação segura com pipeline entrada-validação-criação, construtor de array, preenchimento observado, comparador de processamento, contratos de domínio, clínica e entrega.
- Estado: reconstruída do zero pelo Codex em 2026-07-17 após descarte integral da apresentação do piloto local. Validação estática, lint, build e inspeção responsiva em desktop, 640 px e 360 px aprovados; aprovação pedagógica do responsável ainda pendente.
- Data da auditoria: 2026-07-17.

## Transformação prometida ao aluno

O aluno começa tentando usar diretamente uma quantidade externa e termina capaz de validar limites, criar o array somente depois da entrada se tornar confiável, preencher cada posição com regra própria, processar os elementos, diagnosticar falhas de alocação e explicar por que o tamanho continua fixo após a criação.

## Fronteiras curriculares

- A Aula 045 já ensinou declaração, índice zero, `length`, percurso, agregações e exceção de índice com tamanho conhecido no código. Esses fundamentos reaparecem apenas como instrumentos da nova transformação.
- A Aula 046 introduz a quantidade decidida em tempo de execução e a fronteira de segurança antes de `new tipo[n]`.
- A Aula 047 ensinará alteração de posições já preenchidas, preservação do valor antigo e atualização de totais. Isso não deve ser antecipado como assunto central.
- Arrays de `String`, matrizes, métodos que recebem arrays, objetos e `ArrayList` continuam fora do escopo. `ArrayList` é apenas a fronteira para crescimento dinâmico.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino planejado | Evidência exigida no candidato |
|---|---|---|
| Tamanho decidido pelo programador versus pelo usuário | Etapa 1 — Portão de alocação | O aluno altera a entrada e vê o tamanho nascer somente em execução. |
| Flexibilidade e risco da entrada externa | Etapa 1 | Pipeline interrompe entradas inválidas antes de criar o array. |
| Validar antes de `new tipo[n]` | Etapas 1 e 2 | Ordem entrada → validação → criação fica animada e aparece no código. |
| Vocabulário: tempo de execução, quantidade, validação, preenchimento, índice, `length` | Etapas 1 a 3 | Termos ficam associados a estados concretos, não a lista solta. |
| `new double[n]`, `new int[n]` e `new long[n]` | Etapas 1 e 5 | Declaração, tipo, quantidade e valores padrão aparecem em exemplos verificáveis. |
| Valores padrão de arrays numéricos | Etapa 1 | Array recém-criado mostra `0.0`, `0` ou `0L` antes do preenchimento. |
| Exemplo mínimo completo com Scanner | Etapas 2 e 3 | Código compilável, entradas de teste e console esperado. |
| Fluxo ler, validar, criar, preencher, processar e exibir | Mapa da aula e etapas 1 a 4 | Pipeline indica fase atual e o bloqueio entre validar e criar. |
| Preferir `array.length` ao percorrer | Etapa 3 e clínica | Loop continua ligado ao array mesmo se a variável de quantidade mudar. |
| Preenchimento por índice | Etapa 3 | Célula atual, `indice`, `indice + 1`, valor e console mudam juntos. |
| Validar cada elemento | Etapa 3 | Nota fora de 0..10 repete a mesma posição sem avançar. |
| Índice técnico versus número amigável | Etapa 3 | Interface mostra índice 0 e mensagem “nota 1” simultaneamente. |
| Notas com média | Etapa 4 | Entradas conhecidas geram soma e média verificáveis. |
| Somar durante o preenchimento versus depois | Etapa 4 | Comparador evidencia um loop versus separação de fases e reutilização. |
| Maior e menor iniciados pela primeira posição | Etapa 4 | Cálculo só é liberado depois da garantia de array não vazio. |
| Validação positiva protege `array[0]` | Etapas 2 e 4 | Quantidade zero impede o processamento que depende da primeira posição. |
| Pedidos em centavos e razão para `long` | Etapa 5 | Contrato monetário, soma e média decimal aparecem com saída. |
| Estoque: zero permitido, negativo proibido | Etapa 5 | Regra do elemento é diferente da regra da quantidade. |
| Atividades por OS: ao menos uma atividade | Etapa 5 | Total e maior quantidade são preservados. |
| Mensageria: tentativas positivas e contagem acima de 2 | Etapa 5 | Total e quantidade problemática aparecem. |
| Auditoria por dia: zero permitido, maior e média | Etapa 5 | Total, pico e média decimal são exibidos. |
| Pagamentos: positivos, total, maior e menor | Etapa 5 | `long[]` e extremos têm saída conhecida. |
| SLA em horas: não negativo, total, maior e média | Etapa 5 e desafio | `double[]` contextualizado e critérios de transferência. |
| Tamanho negativo e `NegativeArraySizeException` | Etapa 6 — Clínica | Sintoma, causa, ponto da falha e correção antes de `new`. |
| Array de tamanho zero existe, mas não possui índice 0 | Etapas 2, 4 e clínica | `length == 0` é separado de acesso `[0]`. |
| Limite máximo contra alocação descontrolada | Etapa 2 | Entrada `1_000_000_000` é rejeitada antes da alocação e o risco é explicado sem provocar falta de memória. |
| Intervalos 1..100 e 1..50 | Etapa 2 | Limites mínimo e máximo aparecem como contrato configurável. |
| Criar somente depois de toda validação | Etapa 2 | Código incorreto/correto e pipeline mostram a diferença temporal. |
| Boolean nomeando a regra | Etapa 2 e clínica | `quantidadeValida` é recalculada após cada nova leitura. |
| Boolean não atualizado e loop infinito | Etapa 6 | Diagnóstico mostra estado que permanece `false` e correção. |
| `do while` para leitura obrigatória | Etapa 2 | Comparador mostra por que a primeira leitura cabe dentro do laço. |
| Fases separadas no código | Etapas 2 a 4 | Leitura, alocação, preenchimento, processamento e saída têm blocos reconhecíveis. |
| Tamanho vindo do usuário continua fixo | Etapas 1 e 5 | Tentativa de adicionar além de `length` é recusada; `ArrayList` fica para depois. |
| Dez erros comuns | Etapa 6 | Dez casos distintos possuem sintoma, causa, correção e confirmação. |
| Atividade com arquivos compiláveis e falhas propositais | Etapa 7 — Entrega | Roteiro consolidado preserva competências sem exigir cópia cega de 16 arquivos. |
| Debug com entradas `-1`, `0`, `3` | Etapa 7 | Checklist exige observar quantidade, condição, momento de criação, `length` e índice. |
| Diário, Git, `.class` fora do stage e commit nominal | Etapa 7 | Comandos, staged diff, registro de evidência e árvore limpa. |
| Critério de conclusão e assuntos futuros | Etapa 7 | Checklist objetivo e próxima aula bloqueada até conclusão real. |

## Repetições consolidadas sem perda

- Os sete domínios aplicados reutilizam o mesmo esqueleto de entrada, validação e percurso; serão reunidos em uma galeria de contratos que preserva tipo, validade do elemento e resultado exclusivo de cada domínio.
- Os muitos programas da atividade serão organizados em núcleo compilável, variações de domínio e clínica. A consolidação não remove nenhuma categoria de raciocínio.
- `while`, `do while` e boolean não serão apresentados como três aulas repetidas: cada alternativa mostrará sua consequência na primeira leitura e na atualização da condição.
- Soma, média e extremos não serão reensinados desde o início; a aula demonstrará quando são seguros depois da alocação orientada por entrada.

## Lacunas do original que o candidato deve corrigir

| Lacuna | Consequência | Correção exigida |
|---|---|---|
| O exemplo mínimo não mostra todo o diálogo do console | O aluno não sabe quais prompts pertencem às entradas | Simular prompt, entrada e saída na ordem exata. |
| A entrada não numérica fica fora do escopo sem aviso claro | O aluno pode esperar tratamento que ainda não aprendeu | Declarar que `InputMismatchException`/parsing profundo não é objetivo desta aula. |
| Alocação enorme é citada sem visualização segura | O aluno pode testar um valor perigoso | Simular a rejeição antes de `new`, nunca tentar realmente alocar. |
| Dezesseis arquivos podem virar trabalho mecânico | Cópia substitui compreensão | Consolidar em entregas progressivas com resultados e critérios por competência. |
| “Tamanho dinâmico” pode ser confundido com crescimento | Modelo mental incorreto | Usar “tamanho decidido em execução” e provar que depois da criação `length` não muda. |
| Comentários de fases podem parecer arquitetura final | Aluno pode manter tudo no `main` para sempre | Identificar como apoio temporário e anunciar métodos sem antecipar sua implementação. |

## Sequência planejada

| Etapa | Ação do aluno | Evidência visível | Conteúdos centrais |
|---:|---|---|---|
| 1. Mapa da alocação | Testar tipos e quantidades no pipeline | Entradas inválidas param antes de `new`; entrada válida cria células padrão | tempo de execução, `new tipo[n]`, ordem e valores padrão |
| 2. Validar o tamanho | Comparar `while`, `do while`, limite, boolean e o bug de atualização | Quantidade só se torna confiável após mínimo, máximo e atualização da condição | negativo, zero, máximo, boolean e criação tardia |
| 3. Programa completo | Localizar as cinco fases em um programa compilável | Código destacado liga prompts, validação, criação, preenchimento, cálculo e saída | Scanner, `new double[n]`, `length` e separação temporária de fases |
| 4. Preencher e validar | Inserir notas e corrigir um valor inválido na mesma posição | Índice técnico, número amigável, `length`, célula e console sincronizados | preenchimento e validação do elemento |
| 5. Processar com segurança | Alternar estratégia de soma e executar agregações | Soma, média, maior e menor com proteção de vazio | um/dois loops, extremos e divisão decimal |
| 6. Contratos de backend | Explorar sete domínios e comparar regras | Tipo, significado da posição, regra, código e resultado por domínio | pedidos, estoque, OS, mensageria, auditoria, pagamentos e SLA |
| 7. Clínica de erros | Diagnosticar dez falhas | Sintoma → causa → correção → confirmação para cada contrato quebrado | exceções, loop infinito, limite e tamanho fixo |
| 8. Entrega e desafio | Construir, depurar e versionar um analisador novo | Código compilado, console, debug, diário, staged diff e critérios do desafio | transferência e evidência profissional |

## Recursos exigidos

- Código Java com destaque de sintaxe e botão de cópia.
- Pipeline visual e interativo de entrada, validação, criação, preenchimento e processamento.
- Construtor de array responsivo com índices e valores padrão.
- Console didático sincronizado ao preenchimento.
- Comparador de estratégias de soma.
- Galeria de contratos de domínio.
- Clínica interativa com dez erros.
- Comandos de terminal com saída/interpretação.
- Desafio final sem copiar o roteiro.

## Critério da revisão

A cobertura item a item, o lint, o build, a validação estática e as inspeções em desktop e celular foram concluídos. A experiência permanece `em_revisao` somente até receber aprovação explícita do responsável.
