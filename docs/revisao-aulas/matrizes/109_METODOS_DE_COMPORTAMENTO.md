# Matriz de cobertura — Aula 109 — Métodos de comportamento

## Fonte auditada

- `docs/aulas/109_M4_05_METODOS_DE_COMPORTAMENTO_OFICIAL.md`
- Leitura integral realizada em 2026-07-18 antes da reconstrução.

## Cobertura

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Acesso versus comportamento | Classificador interativo de getters, perguntas e cálculos | Seis métodos explicados pelo efeito no estado |
| Objeto anêmico | Comparação visual antes/depois e programa procedural executável | `PedidoAnemico.java` |
| Decidir pertencimento | Seis situações e cinco perguntas de decisão | Pedido, Cliente e OS contrastados com console, banco e WhatsApp |
| Pedido com comportamento | Simulador de preço/quantidade, fonte, saída e alerta pedagógico | `PedidoComComportamento.java` |
| Retornar zero pode esconder erro | Alerta explícito antes da continuação | Evoluções futuras preservadas: construtor, exceção e objeto de valor |
| OS com comportamento | Simulador e grafo de chamadas | `OrdemServicoComComportamento.java` |
| Pagamento com comportamento | Composição interativa das quatro condições | `PagamentoComComportamento.java` |
| Nomes de domínio | Laboratório genérico→específico e retornos boolean/valor | valido, totalFinal, temDesconto, filaSugerida, podeConfirmar |
| Composição de métodos | Grafo da OS e debug do Pedido | Oito chamadas de totalFinal até o retorno |
| Consistência e centralização | Antes/depois do Pedido e clínica | Regra deixa de ser repetida nos consumidores |
| Método pequeno | Clínica e composição guiada | processarTudo identificado como mistura |
| Limite do objeto | Classificador domínio/entrada/apresentação/infra/integração/mensageria | Ações externas ficam deliberadamente fora |
| Atividade guiada | Pedido, OS, Pagamento e leitura crítica distribuídos no roteiro | Três fontes completas e classificação explícita |
| Sete erros | Clínica ampliada para oito diagnósticos | Cadeia excessiva adicionada sem remover casos originais |
| Desafio Produto | Contrato antes do código, duas instâncias, fonte e testes | `ProdutoComComportamento.java` e `TesteMetodosComportamento.java` |
| Registro, conclusão e Git | Defesa oral, checklist, evidências e portões | Aula 110 bloqueada até conclusão integral |

## Arquétipo

Oficina guiada de classificação, refatoração de anemia, pertencimento, três domínios executáveis, nomenclatura, fronteiras, debug de composição, clínica e entrega.

## Decisões pedagógicas

- O aluno vê a regra procedural fora do objeto antes de refatorá-la; isso evita tratar “mover método” como ritual.
- Método de acesso e método de comportamento são contrastados pelo uso do estado do objeto antes de métodos booleanos e de retorno de valor, ensinados separadamente com linguagem natural.
- Composição é visualizada como grafo e como Call Stack, mantendo atributos e retornos intermediários observáveis.
- A fronteira entre domínio e infraestrutura é praticada antes do desafio, não apenas citada no fechamento.
- A linguagem do domínio substitui nomes genéricos; comportamento que usa a instância não vira `static` apenas por conveniência.
- Todos os programas têm código com destaque de sintaxe estilo IDE, comandos e saídas verificáveis.

## Artefatos

- `plataforma-curso/src/components/GuidedBehaviorMethodsLesson109.jsx`
- `plataforma-curso/src/components/guidedBehaviorMethodsLesson.css`
- `tools/validate-lesson-109.mjs`
- `plataforma-curso/src/components/MarkdownViewer.jsx`

## Estado

- Implementação técnica: concluída.
- Validação automatizada: seis fontes Java compiladas e executadas com sucesso.
- Inspeção visual e aprovação explícita: pendentes.
