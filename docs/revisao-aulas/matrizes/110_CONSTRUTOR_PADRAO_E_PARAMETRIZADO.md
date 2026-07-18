# Matriz de cobertura — Aula 110 — Construtor padrão e parametrizado

## Fonte auditada

- `docs/aulas/110_M4_06_CONSTRUTOR_PADRAO_E_PARAMETRIZADO_OFICIAL.md`
- Leitura integral realizada em 2026-07-18 antes da reconstrução.

## Cobertura

| Conteúdo original | Reconstrução | Evidência |
|---|---|---|
| Construtor e `new` | Linha do tempo interativa em seis movimentos | argumentos → new → construtor → validação → `this` → referência |
| Cliente parametrizado | Fonte integral, mapa atributo/parâmetro, comandos e saída | `ClienteConstrutorParametrizado.java` |
| Atributo versus parâmetro | Comparador visual `this.nome` / `nome` | Papéis e tempos de vida distintos |
| Construtor padrão automático | Simulador de três cenários do compilador | Nenhum declarado, só parametrizado e ambos explícitos |
| Produto sem parâmetros | Contraste entre valores técnicos e padrões intencionais | `ProdutoConstrutorPadrao.java` |
| Risco de objeto vazio | Duas portas de criação do Pedido | Construtor parametrizado torna obrigatórios visíveis |
| Pedido parametrizado | Fonte completa e cálculo executável | `PedidoConstrutorParametrizado.java` |
| Validação e `IllegalArgumentException` | Cinco cenários selecionáveis e ordem antes da atribuição | `PedidoConstrutorComValidacao.java` |
| Invariantes | Cliente, produto, preço e quantidade protegidos | Quatro falhas intencionais observáveis |
| Sobrecarga e `this(...)` | Diagrama dos dois caminhos e padrões aplicados | `ClienteConstrutoresSobrecarregados.java` |
| Valores padrão | Telefone vazio e ativo true tornados explícitos | Decisão questionada antes de aceita |
| OS protegida | Seletor de cinco invariantes e fonte integral | `OrdemServicoConstrutor.java` |
| Limite do construtor | Faixa “pode / não deve” | Validação e inicialização separadas de banco, API, Scanner e mensagens |
| Debug | Mock de IDE com sucesso e exceção em oito pausas | Estado só é atribuído depois da aceitação |
| Oito erros comuns | Clínica integral | Sintoma, causa e correção por caso |
| Desafio Pagamento | Contrato antes do código, criação válida/inválida e testes | `PagamentoConstrutor.java` e `TesteConstrutores.java` |
| Registro, conclusão e Git | Defesa oral, checklist, evidências e portões | Aula 111 bloqueada até conclusão integral |

## Arquétipo

Oficina guiada de nascimento, primeiro construtor, regra do compilador, padrões, obrigatórios, validação, sobrecarga, invariantes, debug, clínica e entrega.

## Decisões pedagógicas

- A criação deixa de parecer instantânea: cada etapa entre argumentos e referência é inspecionável, inclusive a diferença entre atributo e parâmetro.
- “Construtor padrão” é desambiguado entre construtor sem parâmetros explícito e construtor fornecido automaticamente.
- Validações são executadas antes das atribuições para impedir estado parcial.
- Sobrecarga é ensinada como delegação a um construtor principal, não duplicação de regras.
- Cada valor padrão aparece como decisão de domínio, e trabalho pesado ou efeitos colaterais permanecem fora da porta de entrada do objeto.
- As oito fontes usam destaque de sintaxe estilo IDE e são compiladas pelo validador dedicado.

## Artefatos

- `plataforma-curso/src/components/GuidedConstructorsLesson110.jsx`
- `plataforma-curso/src/components/guidedConstructorsLesson.css`
- `tools/validate-lesson-110.mjs`
- `plataforma-curso/src/components/MarkdownViewer.jsx`

## Estado

- Implementação técnica: concluída.
- Validação automatizada: oito fontes Java compiladas e executadas com sucesso.
- Inspeção visual e aprovação explícita: pendentes.
