# Matriz de cobertura — Aula 037

## Identificação

- Aula original: `docs/aulas/037_M1_17_SWITCH_TRADICIONAL_OFICIAL.md`
- Aula anterior: `docs/aulas/036_M1_16_IFS_ANINHADOS_E_SIMPLIFICACAO_OFICIAL.md`
- Aula posterior: `docs/aulas/038_M1_18_SWITCH_MODERNO_OFICIAL.md` (switch moderno com expressões)
- Experiência nova: `plataforma-curso/src/components/GuidedSwitchTradicionalLesson037.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedSwitchTradicionalLesson.css`
- Arquétipo: oficina de seleção por valor com simulador animado de fall-through, menu interativo de menu+Scanner e clínica de erros
- Estado: em_revisao

## Fronteiras curriculares

- A Aula 036 ensinou simplificação de ifs aninhados. A Aula 037 apresenta o switch como alternativa clara para seleção por valor discreto (int, String, char).
- A Aula 038 apresentará o switch moderno com expressões (switch expression, `->` e `yield`). A 037 está restrita ao switch tradicional com `:`, `break` e `default`.
- Enum e polimorfismo são apenas sugeridos de forma conceitual como evolução futura.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Contexto: switch para seleção por valor (menus, status, códigos) | Painel conceitual de abertura | Tabela comparativa de tipos de variáveis adequados ao switch. |
| Estrutura básica do switch (switch, case, break, default) | Painel de anatomia do switch | Diagrama interativo das quatro peças da estrutura. |
| Vocabulário essencial | Painel de anatomia do switch | Glossário de termos com definições e exemplos. |
| Primeiro exemplo visual com int e menu numérico | Simulador de Menu Interativo | Painel de menu numerado simulando seleção de opção. |
| switch com String | Simulador de Seleção de Status | Painel de status de pedidos em um switch com Strings corporativas. |
| switch com char | Simulador de Prioridade | Painel de prioridades A/B/C com char. |
| Comparação switch vs if/else if | Comparador Lado a Lado | Dois painéis executando a mesma lógica com estruturas diferentes. |
| Fall-through acidental (sem break) | Simulador de Fall-Through Animado | Cursor de luz descendo pelos cases sem parar. |
| Fall-through intencional (agrupamento de cases) | Simulador de Fall-Through Animado | Casos ADMIN e SUPERVISOR compartilhando o mesmo bloco. |
| Agrupamento de dias úteis e final de semana | Simulador de Fall-Through Animado | Dias 1-5 e 6-7 agrupados em um único bloco. |
| Switch com null → NullPointerException | Clínica de Erros | Simulação de NPE no switch com String nula. |
| padronização de entrada com trim().toUpperCase() | Galeria de Domínios | SwitchStatusConsole demonstrando a normalização da entrada do Scanner. |
| Exemplo Menu com Scanner | Galeria de Domínios | MenuConsole e MenuOperacoesConsole. |
| SwitchPedido | Galeria de Domínios | Código e console do roteador de status de pedidos. |
| SwitchOrdemServico | Galeria de Domínios | Código e console de OS com quatro estados. |
| SwitchOperacao | Galeria de Domínios | Código e console de auditoria de operações. |
| SwitchMensageria | Galeria de Domínios | Código e console de roteador de mensagens NPS, boas-vindas e entregas. |
| SwitchOcorrencia | Galeria de Domínios | Código e console com códigos de ocorrências numéricas. |
| Clínica de 10 Erros Comuns | Clínica de Erros (10 abas) | Diagnóstico e conserto dos erros clássicos do switch tradicional. |
| Atividade prática local e commits | Terminal de Entrega e Diário | PowerShell para criação de 16 arquivos Java e commit Git limpo. |
| Critérios de Conclusão | Gate final da Aula | Checklist objetivo de conclusão. |

## Repetições consolidadas

- Os 12 programas locais foram organizados na Galeria de Casos de Domínio, eliminando duplicações de explicações conceituais.
- Fall-through acidental e intencional foram unificados em um único simulador animado com dois modos de alternância.

## Lacunas resolvidas

- O simulador de fall-through com cursor de luz descendo pelos cases torna visceralmente claro o perigo de esquecer o break, algo que o aluno só veria em um debugger real.
- A normalização de entrada via `trim().toUpperCase()` é demonstrada com input real no simulador, reforçando por que `aprovado` não casa com `case "APROVADO":` sem transformação.
