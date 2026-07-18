# Matriz de cobertura — Aula 079 — Varargs

Fonte integral analisada: docs/aulas/079_M2_18_VARARGS_OFICIAL.md.

Implementação: GuidedVarargsLesson079.jsx e guidedVarargsLesson.css.

## Cobertura do conteúdo original

| Conteúdo exigido | Onde foi reconstruído | Evidência didática |
|---|---|---|
| Varargs e array interno | Etapa 1 | Transformação visual de chamada em índices |
| Zero, um, vários e array explícito | Etapas 1 e 2 | Seletor de aridade e programa compilável |
| Validação de quantidade mínima | Etapa 2 | Simulador de média sem argumentos |
| Último parâmetro e apenas um varargs | Etapa 3 | Quatro assinaturas válidas/inválidas |
| int, String, separador e BigDecimal | Etapa 4 | Laboratório de utilitários tipados |
| Array vazio, elemento null e array null | Etapa 5 | Comparador de três estados de memória |
| Sobrecarga e ambiguidade | Etapa 6 | Laboratório de decisão de API |
| Object... e tipos diferentes | Etapas 6 e 8 | Comparação tipo forte/request e clínica |
| Custo de array e performance | Etapa 6 | Caso de caminho crítico com recomendação de medir |
| String.format, List.of e Arrays.asList | Etapas 6 e 9 | APIs conhecidas contextualizadas e executadas |
| Refatorações para varargs, tipo forte e request | Etapas 6 e 9 | Decisões visuais e desafio |
| Cliente, produto, pedido, pagamento, OS, mensageria e auditoria | Etapa 7 | Galeria de sete domínios |
| Dez erros comuns | Etapa 8 | Clínica navegável |
| Debug de length e índices | Etapa 9 | Roteiro de quatro observações |
| Atividade, comandos, evidências, desafio e Git | Etapa 9 | Programa, terminal e checklist |

## Decisões de reconstrução

- A ideia de açúcar sintático foi convertida em fluxo chamada-compilador-array.
- Zero argumentos foi separado de regra de quantidade mínima.
- Null ganhou três estados independentes para impedir explicações ambíguas.
- Object..., sobrecarga, performance e request foram tratados como decisões de design.
- O programa integrado valida doze saídas determinísticas.
- Layout e navegação permanecem responsivos até 320 px.

Cobertura: 100%.

Pendente: inspeção visual do usuário e aprovação explícita.
