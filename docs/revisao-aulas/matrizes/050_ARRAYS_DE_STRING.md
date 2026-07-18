# Matriz de cobertura — Aula 050

## Identificação

- Aula original: `docs/aulas/050_M1_30_ARRAYS_DE_STRING_OFICIAL.md`
- Aula anterior: `docs/aulas/049_M1_29_MAIOR_MENOR_SOMA_E_MEDIA_EM_ARRAY_OFICIAL.md`
- Aula posterior: `docs/aulas/051_M1_31_ARRAYS_PARALELOS_OFICIAL.md`
- Experiência: `plataforma-curso/src/components/GuidedStringArrayLesson050.jsx`
- Estilos: `plataforma-curso/src/components/guidedStringArrayLesson.css`
- Arquétipo: oficina textual com percurso visual, laboratório de `null`, comparação, normalização, busca, relatório de status, domínios, clínica e entrega.
- Estado: implementação do Gemini auditada e corrigida pelo Codex em 2026-07-17; validação estática, lint, build e inspeção responsiva em desktop, 640 px e 360 px aprovados. Aprovação do responsável ainda pendente.

## Fronteiras curriculares

- A Aula 049 encerra os relatórios numéricos em arrays.
- A Aula 050 transfere o mesmo raciocínio de índice e percurso para textos, introduzindo contratos próprios de `String`.
- A Aula 051 relacionará campos de tipos diferentes pelo mesmo índice; isso aparece apenas como ponte final, sem antecipar orientação a objetos.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na experiência | Evidência observável |
|---|---|---|
| Declaração e inicialização de `String[]` | Etapa 1 — Percorrendo Array de String | Array visual, índice técnico, posição amigável, código e console sincronizados. |
| Percurso com `for` clássico | Etapa 1 | O aluno acompanha cada posição e a saída correspondente. |
| `new String[n]` inicia posições com `null` | Etapa 2 — Valor Padrão e Armadilha do null | Comparador distingue `null`, `""` e texto com espaços. |
| Chamada de método em referência `null` | Etapa 2 e Clínica | `NullPointerException` é provocada e corrigida com curto-circuito. |
| Diferença entre `isEmpty()` e `isBlank()` | Etapa 2 | Tabela de casos demonstra vazio, espaços e texto real. |
| Comparação com `equals()` em vez de `==` | Etapa 3 — equals vs == | Simulador mostra igualdade de conteúdo e diferença de referência. |
| Constante à esquerda | Etapa 3 | `"APROVADO".equals(status)` permanece seguro quando o valor é `null`. |
| `trim`, `toUpperCase` e `toLowerCase` | Etapa 4 — Normalização | Entrada bruta e valor normalizado são exibidos lado a lado. |
| Validar depois do `trim` | Etapa 4 | Texto composto apenas por espaços é rejeitado. |
| Busca textual com `equals` e `equalsIgnoreCase` | Etapa 5 — Busca Textual | Sentinela `-1`, busca exata e busca sem diferença de caixa. |
| Contagem e validação de status | Etapa 6 — Relatório de Status | Contadores e contratos de status aparecem com código e saída. |
| Clientes, pedidos, auditoria, mensageria, filas e busca+alteração | Etapa 7 — Galeria de Domínios | Seis programas completos com saída esperada e decisão de negócio. |
| Preenchimento com `Scanner` e tamanho informado | Etapa 9 — Exemplo guiado | `PreencherNomesConsole.java` lê a quantidade, limpa o buffer e preenche o array. |
| `nextInt()` seguido de `nextLine()` | Etapa 9 e Clínica | O Enter pendente é explicado, reproduzido e consumido explicitamente. |
| Validação com `do/while` | Etapa 9 | Nome em branco é rejeitado antes do armazenamento. |
| Alteração e busca de status | Etapas 5 e 7 | A posição encontrada é validada antes da escrita. |
| Dez erros comuns | Etapa 8 — Clínica de Erros | Cada caso apresenta código, sintoma, causa e correção. |
| Laboratório com 34 arquivos | Etapa 9 — Entrega & Desafio | PowerShell, saída esperada, diário e Git aparecem em sequência. |
| Desafio `CadastroResponsaveis.java` | Etapa 9 | Critérios exigem leitura, buffer, normalização, validação, relatório e fechamento do Scanner. |

## Sequência pedagógica preservada

1. Percorrer textos antes de aplicar métodos.
2. Entender o valor padrão e impedir `NullPointerException`.
3. Comparar conteúdo corretamente.
4. Normalizar antes de validar e armazenar.
5. Buscar textos com contrato explícito.
6. Produzir relatórios de status.
7. Transferir o padrão para domínios reais.
8. Diagnosticar dez falhas recorrentes.
9. Digitar um programa guiado, executar o laboratório e resolver um desafio novo.

## Critério da revisão

A validação estática, o lint, o build e a inspeção responsiva foram concluídos. A aula permanece `em_revisao` somente até a aprovação explícita do responsável.
