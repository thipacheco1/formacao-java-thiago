# Matriz de cobertura — Aula 131 — Tell, Don't Ask

## Fontes auditadas

- `docs/aulas/131_M4_27_TELL_DONT_ASK_OFICIAL.md`
- Aula anterior: colaboração entre objetos.
- Fronteira seguinte: a Aula 132 aprofunda objetos anêmicos; esta aula não deve consumir esse tema inteiro.

## Promessa pedagógica

O aluno deve substituir sequências de consultas e setters que reproduzem regras externas por comandos de domínio expressivos, sem concluir erroneamente que getters, queries ou `if` externos são sempre ruins.

## Cobertura obrigatória

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Ideia central de Tell, Don't Ask | Lente visual Ask → decisão externa versus Tell → decisão interna | Etapa 1 |
| Perguntar continua permitido | Classificador de commands, queries e violações | Etapa 2 |
| Pedido perguntando demais | Aplicação ruim executável com `getStatus + getTotal + setStatus` | Etapa 3 |
| Perigo do setter genérico | Simulador de transições inválidas e porta pública | Etapa 3 |
| Processo de refatoração em quatro passos | Nomear intenção, criar método, mover regra e remover setter | Etapa 4 |
| Dinheiro, StatusPedido e Pedido | Workspace compilável e fluxo de pagamento | Etapa 5 |
| Produto e estoque | Comparação executável Ask/Set versus `reservarEstoque` | Etapa 6 |
| OrdemServico e reagendamento | Comando atômico protegendo período, status e contador | Etapa 7 |
| Contrato, ativação e cancelamento | Commands e query útil para coordenação externa | Etapa 8 |
| Nem todo `if` externo é errado | Comparação: escolher fluxo versus alterar regra interna | Etapas 2 e 8 |
| Commands e Queries | Tabela explorável com efeitos e responsabilidade | Etapa 2 |
| Debug recomendado | Mock do IntelliJ com dez paradas Ask/Set/Tell | Etapa 9 |
| Oito erros comuns | Clínica com rótulos completos, sintomas e correções | Etapa 10 |
| Desafio PagamentoContrato | Fluxo completo, estorno, oito testes e evidências | Etapa 11 |

## Decisões pedagógicas

1. O princípio será ensinado como critério de responsabilidade, não como proibição sintática.
2. Query para apresentação, relatório ou seleção de fluxo permanece explicitamente legítima.
3. `if` externo só é sinal de violação quando reproduz uma regra que deveria ser protegida pelo consultado.
4. A refatoração preserva comportamento observável antes de remover o setter perigoso.
5. Pedido, Produto, OS e Contrato recebem exemplos executáveis independentes.
6. O desafio PagamentoContrato demonstra comandos `confirmar` e `estornar`, queries sem efeito colateral e transições bloqueadas.

## Critérios de aceite técnico

- 11 etapas concluíveis e reversíveis, com avanço bloqueado.
- 20 fontes Java compiladas em conjunto.
- 8 execuções reais; suíte final imprime `8 testes passaram`.
- 8 casos na Clínica de Erros.
- Código destacado, saídas, simuladores, mock de IDE e evidências copiáveis.
- Roteiro fixo no desktop e foco automático da etapa no mobile.
- Integração `React.lazy` para `131_`.
- Lint, build e continuidade aprovados.
- Estado `em_revisao` até aprovação visual explícita.
