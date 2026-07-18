# Matriz de cobertura — Aula 114 — Composição

## Fonte auditada

- `docs/aulas/114_M4_10_COMPOSICAO_OFICIAL.md`
- Leitura integral realizada em 2026-07-18 antes da reconstrução.

## Cobertura

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Conceito de composição | Classificador interativo de relações | “tem um” separado de “é um” |
| Classe gigante | Seis sinais e código executável | `PedidoGiganteProblematico.java` |
| Objetos escondidos | Extração visual por prefixos | Cliente, Endereco, Produto e Pagamento |
| Pedido composto | Simulador de quantidade, preço, status e total | `PedidoComposto` em `ComposicaoPedidoCompleto.java` |
| Estrutura do Pedido | Árvore em três níveis | Pedido → Item → Produto |
| Tipos fortes | BigDecimal, LocalDate, enum e objetos próprios | Forma/status deixam de ser String |
| Construtor excessivo | Comparador 15 parâmetros / 4 conceitos | Intenção e inversão de argumentos |
| Validação distribuída | Seis falhas selecionáveis | Regra no objeto que possui os dados |
| Dependências nulas (`null`) | Falha no nascimento | Partes obrigatórias da raiz protegidas |
| Comportamento e responsabilidade local | Faixa Item → Pagamento → Pedido | Subtotal, aprovado e total |
| Ordem de Serviço composta | Árvore, simulador e fonte integral | `OrdemServicoComposta` em `ComposicaoOrdemServico.java` |
| Composição aninhada | Atividade tem Periodo | Data, turno e `podeReagendar` |
| Composição e encapsulamento | Colaboradores privados/finais | Partes válidas e referências protegidas |
| Acoplamento | Auditoria de cinco chamadas | Comportamento em vez de navegação longa |
| Um item versus vários | Caso `List<ItemPedido>` contextualizado | A mesma relação “tem um” evolui |
| Debug | Mock de IDE em oito pausas | Construção, raiz e cadeia de chamadas |
| Sete erros comuns | Clínica integral | Sintoma, causa e correção por caso |
| Desafio Mensageria | Contrato, fonte e sete testes | `ComposicaoMensageria.java` e `TesteComposicao.java` |
| Registro e Git | Defesa oral, checklist e comandos | Aula 115 bloqueada até conclusão integral |

## Arquétipo

Oficina guiada de relações, classe gigante, extração de objetos, árvores, pedido executável, validação distribuída, construtores, OS aninhada, acoplamento, debug, clínica e entrega.

## Decisões pedagógicas

- A composição é lida simultaneamente como relação verbal, árvore e atributo Java.
- O aluno encontra os objetos escondidos pelos prefixos antes de receber a solução composta.
- Validações são provocadas uma a uma para mostrar o construtor exato que deve falhar.
- Árvores do Pedido e da OS tornam visível que uma parte também pode ser composta por outra parte.
- Cinco fontes usam destaque estilo IDE e são compiladas pelo validador dedicado.

## Artefatos

- `plataforma-curso/src/components/GuidedCompositionLesson114.jsx`
- `plataforma-curso/src/components/guidedCompositionLesson.css`
- `tools/validate-lesson-114.mjs`
- `plataforma-curso/src/components/MarkdownViewer.jsx`

## Estado

- Implementação técnica: concluída.
- Validação automatizada: cinco fontes Java compiladas e executadas com sucesso.
- Inspeção visual e aprovação explícita: pendentes.
