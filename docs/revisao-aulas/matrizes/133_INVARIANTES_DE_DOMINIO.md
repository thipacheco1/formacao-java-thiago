# Matriz de cobertura — Aula 133 — Invariantes de domínio

## Fontes auditadas

- `docs/aulas/133_M4_29_INVARIANTES_DE_DOMINIO_OFICIAL.md`
- Aula anterior: objetos anêmicos e devolução de comportamento às entidades.
- Fronteira seguinte: `134_M4_30_SERVICOS_DE_DOMINIO_INICIAL_OFICIAL.md` trata regras que não pertencem naturalmente a um único objeto; esta aula mantém toda regra em seu dono natural.

## Promessa pedagógica

O aluno deve deixar de enxergar validação como um `if` isolado e passar a provar uma propriedade ao longo de toda a vida do objeto: ele nasce válido, cada operação autorizada preserva o estado e toda tentativa inválida termina em exceção sem corromper o domínio.

## Cobertura obrigatória

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Conceito de invariante | Linha do tempo visual nascimento → operação → estado preservado | Etapa 1 |
| Validação de entrada versus invariante | Classificador com regra de tela, formato e condição essencial | Etapa 2 |
| Pedido quebrado | Laboratório que aceita número zero, total negativo e status nulo | Etapa 3 |
| Construtor protege o nascimento | Pedido e Dinheiro compiláveis com tentativas válidas e inválidas | Etapas 3 e 4 |
| Métodos preservam o estado | Simulador antes/tentativa/depois para pagar e cancelar | Etapa 4 |
| Produto e estoque | Reserva, reposição, quantidade inválida e saldo insuficiente | Etapa 5 |
| Contrato e período | `PeriodoContrato`, ciclo RASCUNHO/ATIVO/CANCELADO e motivo | Etapa 6 |
| Ordem de Serviço | Código, período, enums, contador interno e transições proibidas | Etapa 7 |
| Regra no objeto, exceções e tipos | Escudo de camadas, `IllegalArgumentException`, `IllegalStateException`, enum e value objects | Etapa 8 |
| Como descobrir invariantes | Entrevista guiada com nove perguntas e aplicação por domínio | Etapa 8 |
| Debug recomendado | Mock de IntelliJ com doze paradas, Variables e console de exceções | Etapa 9 |
| Oito erros comuns | Clínica com rótulos legíveis, sintoma, causa e correção | Etapa 10 |
| Desafio Pagamento | Código executável, matriz de transições e suíte de violações | Etapa 11 |

## Decisões pedagógicas

1. Cada exemplo apresenta explicitamente o estado antes, a tentativa e o estado depois; rejeitar uma operação não basta, o estado anterior precisa permanecer íntegro.
2. `IllegalArgumentException` representa um dado recebido inválido; `IllegalStateException` representa uma operação incompatível com o estado atual.
3. A validação externa pode melhorar a experiência do usuário, mas nunca é a última barreira da regra essencial.
4. `enum` fecha o vocabulário; value objects fecham combinações de valores; métodos de domínio fecham transições.
5. `Dinheiro` protege existência e escala, enquanto “ser positivo” continua contextual ao Pedido, Produto ou Pagamento.
6. Nenhum serviço de domínio é introduzido, porque esse critério pertence à Aula 134.
7. O desafio não é considerado entregue apenas pelo caminho feliz: testes precisam tentar construir, confirmar e estornar em estados proibidos.

## Critérios de aceite técnico

- 11 etapas concluíveis e reversíveis com avanço bloqueado.
- 24 fontes Java compiladas em conjunto.
- 9 execuções reais; suíte final imprime `12 testes passaram`.
- 8 casos completos na Clínica de Erros.
- Código destacado, saídas esperadas, simuladores, diagrama de ciclo e mock de IDE.
- Responsividade, roteiro fixo no desktop e foco automático da etapa no mobile.
- Integração `React.lazy` para `133_`.
- Lint, build, validador da aula e continuidade aprovados.
- Estado `em_revisao` até aprovação visual explícita.
