# Matriz de cobertura — Aula 136 — Builder inicial

## Fontes auditadas

- `docs/aulas/136_M4_32_BUILDER_INICIAL_OFICIAL.md`
- Aula anterior: factories nomeiam e centralizam formas de criação.
- Fronteira seguinte: `137_M4_33_COLECOES_DENTRO_DE_OBJETOS_OFICIAL.md` aprofundará cópia defensiva e exposição de listas; aqui itens são apenas parte da montagem inicial.

## Promessa pedagógica

O aluno deve identificar quando um construtor ficou difícil de ler, montar o objeto passo a passo com nomes e padrões, impedir `build()` inválido e manter comportamento e invariantes no objeto final.

## Cobertura obrigatória

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Construtor confuso | Decodificador visual de dez posições e código executável | Etapa 1 |
| Builder versus construtor/factory/setter | Classificador por problema resolvido | Etapa 2 |
| API fluente e `return this` | Simulador de identidade do mesmo Builder durante o encadeamento | Etapa 3 |
| `ContratoBuilder` | Oficina de obrigatórios, opcionais, padrões e objeto final | Etapa 4 |
| Validação no `build()` e na entidade | Portão duplo com tentativas incompletas e cliente inativo | Etapa 5 |
| `OrdemServicoBuilder` | Prioridade, canal, observação e padrões interativos | Etapa 6 |
| `PedidoBuilder` | Adição encadeada de itens, total e pagamento na entidade | Etapa 7 |
| Reuso, mutabilidade, externo/interno e nomes | Laboratório de ciclo de vida temporário e fronteiras | Etapa 8 |
| Debug recomendado | Mock de IntelliJ com doze paradas entre Builder e entidade | Etapa 9 |
| Oito erros comuns | Clínica com sintoma, risco e correção | Etapa 10 |
| Desafio `PagamentoBuilder` | Padrões, obrigatórios, ciclo na entidade e testes | Etapa 11 |

## Decisões pedagógicas

1. Builder é escolhido pelo problema de legibilidade e opcionais; um `Cliente(id,nome)` continua usando construtor.
2. Cada chamada fluente altera o Builder temporário e retorna a mesma referência; somente `build()` cria a entidade.
3. O Builder pode detectar ausência de obrigatórios para dar erro melhor, mas a entidade repete as invariantes essenciais.
4. Valores padrão são exibidos antes da construção, para o aluno não confundir “omitido” com `null` acidental.
5. Reutilização é demonstrada como risco de vazamento de dados entre construções.
6. Pedido recebe cópia dos itens; os detalhes de coleções protegidas ficam explicitamente reservados à Aula 137.
7. Builder interno é apresentado como variação futura, sem introduzir classes aninhadas nesta aula.

## Critérios de aceite técnico

- 11 etapas concluíveis e reversíveis com avanço bloqueado.
- 28 fontes Java compiladas em conjunto.
- 6 execuções reais; suíte final imprime `10 testes passaram`.
- 8 casos completos na Clínica de Erros.
- Código destacado, saídas, simuladores, diagramas e mock de IDE.
- Responsividade e foco automático da etapa no mobile.
- Integração `React.lazy` para `136_`.
- Lint, build, validador e continuidade aprovados.
- Estado `em_revisao` até aprovação visual explícita.
