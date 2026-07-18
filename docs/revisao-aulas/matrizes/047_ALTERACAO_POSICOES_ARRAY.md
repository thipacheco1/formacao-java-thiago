# Matriz de cobertura — Aula 047

## Identificação

- Aula original: `docs/aulas/047_M1_27_ALTERACAO_DE_POSICOES_DO_ARRAY_OFICIAL.md`
- Aula anterior: `docs/aulas/046_M1_26_ARRAYS_COM_TAMANHO_DEFINIDO_PELO_USUARIO_OFICIAL.md`
- Aula posterior: `docs/aulas/048_M1_28_BUSCA_EM_ARRAY_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedArrayModificationLesson047.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedArrayModificationLesson.css`
- Arquétipo: oficina de alteração segura de array com simulador de índice técnico vs amigável, portão de validação de índice, preservação de histórico, recálculo de totais, galeria de domínios e clínica de erros
- Estado: implementação do Gemini auditada e corrigida pelo Codex em 2026-07-17; validação estática, lint, build e inspeção responsiva em desktop, 640 px e 360 px aprovados. Aprovação do responsável ainda pendente.

## Fronteiras curriculares

- A Aula 046 ensinou a definir o tamanho do array dinamicamente em tempo de execução com base no input do usuário.
- A Aula 047 foca em como alterar o valor das posições de um array já alocado, preservando o tamanho fixo mas demonstrando a mutabilidade dos elementos.
- A Aula 048 ensinará a busca de valores em um array (percurso com condições de busca). Isso não deve ser antecipado.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Array tem tamanho fixo, conteúdo mutável | Etapa 1 — Mutabilidade & Tamanho Fixo | Visualização interativa demonstrando que a atribuição altera o valor interno da célula mas o total de caixas (`length`) não muda. |
| Atribuição simples por índice (`valores[1] = 99`) | Etapa 1 | Exemplo de código e representação visual reativa da atribuição no array. |
| Primeiro exemplo mínimo completo (Main.java) | Etapa 1 | Código fonte compilável com console simulado mostrando o estado "Antes" e "Depois". |
| Exibição e alteração com `for` | Etapas 1 e 6 | Exibição do estado atualizado e galeria de loops pontuais e em lote. |
| Perda de valor antigo ao atribuir | Etapa 4 — Histórico e Auditoria | O aluno vê o valor antigo ser guardado em uma variável auxiliar antes da atribuição. |
| Salvar valor antigo para auditoria | Etapa 4 | Painel que gera log de auditoria: "Na data X, alterou da quantidade A para B". |
| Default values do Java em arrays (0, 0L, 0.0, false) | Etapa 1 / Nota técnica | Alerta visual listando o preenchimento automático inicial do array conforme o tipo. |
| Perigo de confundir zero padrão (default) com zero real (estoque zerado) | Etapa 1 / Alerta pedagógico | Caixa de aviso explicando o significado semântico do zero no backend. |
| Atualização incremental (`+=`, `-=`, `++`, `--`) | Etapas 4, 5 e 6 | Auditoria, recálculo e galeria demonstram alteração baseada no valor atual. |
| Exemplo: baixa de estoque e validação de quantidade | Etapa 6 — Galeria de Domínios / Ajuste de Estoque | Código e simulação preservam a quantidade atual antes de aplicar a regra. |
| Risco de índice inválido (ArrayIndexOutOfBoundsException) | Etapa 3 — Validação de Índice | Simulador gera mensagem de erro e explicação ao tentar acessar índice ilegal. |
| Validação de índice (`indice >= 0 && indice < array.length`) | Etapa 3 | A condição do portão é destacada e testada dinamicamente pelo aluno. |
| Posição do usuário (1..N) vs índice técnico (0..N-1) | Etapa 2 — Índice Técnico vs Amigável | O aluno digita "Posição 2" e a ferramenta calcula `indice = 1`, alterando a célula correta. |
| Scanner para ler posição e alterar valor | Etapas 2 e 6 | Console simulado e programas de domínio representam a interação completa. |
| Exemplo aplicado: Ajuste de estoque do produto | Etapa 6 / Ajuste de Estoque | Fluxo completo com posição, regra, valor anterior e novo valor. |
| Exemplo aplicado: Corrigir valor de pedido (centavos/long) | Etapa 6 / Pedido Centavos | Exemplo demonstra `long[]`, validação positiva e preservação do valor anterior. |
| Exemplo aplicado: Atualizar atividades por OS | Etapa 6 / Atividades OS | Domínio exige ao menos uma atividade na OS informada. |
| Exemplo aplicado: Tentativas de mensageria | Etapa 6 / Mensageria | Incremento da posição escolhida aparece com saída conhecida. |
| Exemplo aplicado: Auditoria de eventos por dia | Etapa 6 / Auditoria | Valor anterior e contador atualizado aparecem no console. |
| Exemplo aplicado: Ajustar SLA em horas (double) | Etapa 6 / SLA Horas | Exemplo demonstra `double[]` e bloqueio de tempo negativo. |
| Recalcular totais após alteração (loop completo) | Etapa 5 — Recálculo | Simulador e código distinguem total armazenado de soma real e sincronizam pelo loop. |
| Ajustar totais usando valor antigo (`total = total - antigo + novo`) | Etapa 5 | Ação atômica só é liberada quando o total de origem está consistente. |
| Loops para alterar todas as posições (AumentarTodosValores) | Etapa 6 / Aumento em lote | Código e saída `20, 30, 40` preservam o incremento geral. |
| Loops para zerar valores negativos (ZerarValoresNegativos) | Etapa 6 / Normalização em lote | Filtragem e normalização aparecem com código e saída. |
| Loops para aplicar limite máximo (AplicarLimiteMaximo) | Etapa 6 / Teto de valores | Imposição do teto 100 aparece com código e saída. |
| Loops para substituir zeros por outro valor (SubstituirZeros) | Etapa 6 / Substituir zeros | A regra é exibida junto do alerta de que zero pode ser legítimo. |
| Clínica de 10 Erros Comuns | Etapa 7 — Clínica de Erros | Diagnóstico interativo com sintoma, causa raiz, correção e confirmação. |
| Atividade prática local (criar 25 arquivos Java) | Etapa 8 — Entrega e Desafio | PowerShell instrui a criação dos arquivos de forma organizada. |
| Debug e commits limpos | Etapa 8 | Staged diff, commit e `.class` fora do Git aparecem explicitamente. |
| Critérios de conclusão | Gate de encerramento da aula | Checklists de validação e gate de progresso. |

## Repetições consolidadas

- Os 25 arquivos do laboratório foram estruturados e classificados na Galeria de Domínios (Etapa 6) e na Clínica de Erros (Etapa 7), reduzindo cliques repetitivos sem esconder as nuances de cada tipo numérico (`int`, `long`, `double`) e regras de negócio.
