# Matriz de cobertura — Aula 108 — Atributos com significado

## Fonte auditada

- `docs/aulas/108_M4_04_ATRIBUTOS_COM_SIGNIFICADO_OFICIAL.md`
- Leitura integral realizada em 2026-07-18 antes da reconstrução.

## Cobertura preservada e aprofundada

| Conteúdo original | Experiência reconstruída | Evidência |
|---|---|---|
| Atributo representa estado com significado | Portal interativo de cinco perguntas | Pertencimento, estado, regra, armazenamento e comunicação |
| Nomes ruins versus bons | Comparador visual e duas fontes completas | `ClienteAtributosRuins.java` e `ClienteAtributosBons.java` |
| Dado armazenado versus calculado | Simulador que permite provocar total inconsistente | `PedidoEstadoMinimo.java` conserva apenas preço e quantidade |
| Tipos adequados | Laboratório String→enum, String→LocalDate e double→BigDecimal | Motivo e restrição de cada substituição |
| OS com tipos melhores | Mapa estado/derivação, fonte completa, comandos e saída | `OrdemServicoAtributos.java` |
| Estado mínimo | Fonte de verdade separada das respostas derivadas | diasEmAberto, atrasada, encerrada e fila continuam métodos |
| Atributos obrigatórios e invariante | Checklist justificável por Cliente, OS, Pedido, Pagamento e Produto | Definição inicial preservada sem antecipar validação avançada |
| Pagamento significativo | Quatro papéis visuais, fonte, terminal e regra composta | `PagamentoAtributos.java` |
| Boolean claro e nomes no contexto | Comparações na clínica e no Pagamento | ativo, aprovado e codigo no contexto correto |
| Classe inchada | Raio-X de conceitos escondidos em uma OS | Cliente, Produto, Técnico, Endereço e Pagamento identificados |
| Atividade guiada | Comparação, tipos, refatoração de Pedido, obrigatórios e debug | Distribuída pelo roteiro em ordem de complexidade |
| Debug recomendado | Mock de IDE com oito pausas | parâmetros, `this`, atributos e métodos derivados |
| Sete erros comuns | Clínica ampliada para oito diagnósticos | Todos os sete preservados; contexto insuficiente explicitado |
| Desafio Produto | Contrato antes do código, enum, BigDecimal, duas instâncias e testes | `ProdutoAtributos.java` e `TesteAtributosSignificativos.java` |
| Registro, conclusão e Git | Defesa oral, evidências, checklist, comandos e portões | Aula 109 bloqueada até todas as etapas e conclusão geral |

## Arquétipo

Oficina guiada de decisão, contraste semântico, consistência, tipos, estado mínimo, pertencimento, invariantes, aplicação, debug, clínica e entrega.

## Decisões pedagógicas

- “Atributo bom” deixou de ser conselho abstrato e virou um filtro repetível de cinco perguntas.
- O risco de guardar dado calculado ou derivado é observável: o aluno consegue criar duas verdades conflitantes e então comparar com o cálculo único.
- Tipos são ensinados como restrições executáveis, não apenas substituições estilísticas.
- Invariante aparece na profundidade autorizada pela fonte: regra de significado e método de consulta, sem antecipar exceções no construtor.
- Código usa destaque de sintaxe estilo IDE; cada programa principal possui comandos e saída observável.
- Clínica e entrega permanecem etapas distintas, completas e responsivas.

## Artefatos

- `plataforma-curso/src/components/GuidedMeaningfulAttributesLesson108.jsx`
- `plataforma-curso/src/components/guidedMeaningfulAttributesLesson.css`
- `tools/validate-lesson-108.mjs`
- `plataforma-curso/src/components/MarkdownViewer.jsx`

## Estado

- Implementação técnica: concluída.
- Validação automatizada: sete fontes Java compiladas e executadas com sucesso.
- Inspeção visual e aprovação explícita: pendentes.
