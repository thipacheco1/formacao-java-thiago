# Matriz de reconstrução — Aula 118 — Identidade de objetos

Fonte auditada: `docs/aulas/118_M4_14_IDENTIDADE_DE_OBJETOS_OFICIAL.md`.

Identidade, referência e valor respondem perguntas diferentes. A experiência mantém toda a profundidade da fonte e transforma cada distinção em evidência visível e executável, inclusive a diferença entre mesma referência e mesma identidade.

| Conteúdo preservado | Experiência guiada | Evidência |
| --- | --- | --- |
| Referência não é objeto | Mapa Stack/Heap com duas variáveis e um Cliente | Alterar pelo alias e observar ambos |
| Um `new` versus dois `new` | Comparador de endereços conceituais | Provar `== true` e `== false` |
| Três tipos de comparação | Triângulo referência/entidade/valor | Nomear pergunta, critério e resultado |
| Identidade em entidade | Ciclo CRIADO/PAGO/ENVIADO do Pedido 1001 | Estado muda; número permanece |
| Igualdade de valor | Normalizador interativo de Email | Duas instâncias, mesmo conteúdo |
| `String`, `==` e pool | Comparador `new String` versus literal | Separar reuso de instância e conteúdo |
| Entidade ainda sem id | Linha antes/depois da persistência | Não igualar dois ids nulos |
| Código como objeto de valor | Ordem de Serviço (OS) com código final e estado mutável | Reagendar/concluir sem trocar identidade |
| Debug | Dez pausas em `new`, atribuição e comparações | Inspecionar referência, identidade e valor |
| Erros comuns | Clínica com oito diagnósticos | Explicar sintoma e correção |
| Desafio Produto | Código `PROD-`, estoque, status, testes e Git | Compilar oito fontes e passar oito testes |

Cobertura adicional: duas instâncias podem representar a mesma entidade; identidade precisa ser estável; `CodigoOs` e `CodigoProduto` são valores usados como identidade; `equals` e `hashCode` ficam explicitamente preparados para a Aula 119 sem antecipar sua implementação.

Pergunta-guia: duas variáveis apontam para a mesma referência, carregam o mesmo valor ou representam a mesma identidade de domínio?

Aceite: 11 etapas; progresso reversível; foco móvel; breakpoints 900/680/520/380/320; navegação 117/119 bloqueada; oito fontes compiladas; lint, build, validador e diff check. Inspeção visual e aprovação explícita permanecem pendentes.
