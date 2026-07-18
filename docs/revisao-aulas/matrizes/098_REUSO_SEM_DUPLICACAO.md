# Matriz de preservação — Aula 098

## Identificação

- Aula: `098 — M3.09 — Reuso sem duplicação`
- Fonte: `docs/aulas/098_M3_09_REUSO_SEM_DUPLICACAO_OFICIAL.md`
- Aula anterior: `097 — Métodos de leitura`
- Aula seguinte: `099 — Debug entrando em métodos`
- Experiência: `plataforma-curso/src/components/GuidedDryReuseLesson098.jsx`
- Estilos: `plataforma-curso/src/components/guidedDryReuseLesson.css`
- Validador: `tools/validate-lesson-098.mjs`
- Arquétipo: oficina visual de conhecimento, semântica, extração, coesão, equivalência, IntelliJ, clínica e entrega.
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Resultado prometido

O aluno classifica duplicações pelo motivo de mudança, extrai validação e cálculo para donos coesos, prova a equivalência com execução e resolve o estoque sem forçar compartilhamento com uma política de pedido diferente.

## Inventário e destino

| Conteúdo original | Destino na experiência | Evidência |
| --- | --- | --- |
| DRY e fonte autoritativa | Fonte do Conhecimento | simulador de uma a quatro cópias e custo de mudança |
| duplicação semântica versus visual | Real ou Acidental? | seis cenários classificados e justificados |
| cenário ruim de quatro validações | Quatro Cópias | código integral marcado apenas para análise |
| não versionar a classe ruim | Quatro Cópias e Entrega | aviso visual e terminal da solução final |
| `ValidacoesBasicas.java` | Extrair Validação | código integral e mensagens parametrizadas |
| `nomeCampo` | Extrair Validação | quatro contextos gerando mensagem específica |
| `CalculosPedido.java` | CalculosPedido | código integral e pipeline monetário em três passos |
| `BigDecimal` e `RoundingMode.HALF_UP` | CalculosPedido | total, percentual e resultado arredondado |
| `TesteManualReuso.java` | Teste e Step Into | código integral, saída e fluxo entre arquivos |
| construtores privados | validação, cálculo e estoque | classes `final` com construtor `private` |
| coesão e especialidade | Coesão, não Utils | quatro classes focadas versus God Utility |
| antipadrão `Utils`/`Helper` | Coesão e Clínica | comparação com seis responsabilidades misturadas |
| DRY excessivo | Real ou Acidental? e Clínica | soma trivial mantida sem abstração genérica |
| desafio de produto/estoque | Desafio de Estoque | `CalculosEstoque.java` e `TesteEstoque.java` completos |
| diferença de política pedido/estoque | Desafio de Estoque | positivo versus zero permitido |
| debug com Step Into F7 | Teste e Step Into | simulação didática de cinco frames |
| atividade guiada | validação, cálculo e integração | criação, compilação, execução e saída conhecida |
| registro, critério e Git | Entrega & Desafio | checklist, README e comandos copiáveis |
| backend, banco e API externa | classificação e coesão | exemplos de conhecimento compartilhado e donos separados |

## Repetições consolidadas

- Definição, importância e fechamento do DRY viraram o simulador de propagação de mudança.
- As explicações posteriores aos exemplos aparecem junto do código, do pipeline e da saída.
- Coesão, classes pequenas e proibição de `Utils` são julgadas em um único comparador, sem repetição textual.

## Lacunas corrigidas

- A diferença entre duplicação real e acidental agora exige decisão em seis cenários.
- A refatoração possui prova de comportamento, não apenas uma aparência menor.
- O exemplo ruim é explicitamente separado dos cinco arquivos finais compilados.
- O desafio de estoque possui solução executável e demonstra por que fórmula parecida não implica política compartilhada.
- O Step Into mostra a transição entre chamador, validação e cálculo sem antecipar a aula profunda de debug.
- O aluno vê o custo de abstração excessiva antes de aplicar DRY mecanicamente.

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Fonte do Conhecimento | cópias → custo de mudança | simulador de uma a quatro fontes |
| Real ou Acidental? | semelhança → julgamento semântico | seis cenários |
| Quatro Cópias | cheiro genérico → contrato repetido localizado | quatro campos e código ruim |
| Extrair Validação | quatro condições → uma regra parametrizada | `ValidacoesBasicas` |
| CalculosPedido | matemática espalhada → dono financeiro | pipeline e código integral |
| Teste e Step Into | refatoração aparente → equivalência provada | cinco frames e saída real |
| Coesão, não Utils | centralização cega → classes por motivo | comparador God Utility/coesas |
| Desafio de Estoque | reuso forçado → domínio próprio | duas fontes e saída R$ 1497.00 |
| Clínica de Erros | sintoma → causa e recuperação | oito diagnósticos |
| Entrega & Desafio | arquivos → solução revisável | cinco fontes, checklist e Git |

## Recursos e profundidade

- Cinco fontes Java finais completas, copiáveis, destacadas e compiláveis; o exemplo ruim fica apenas para análise.
- Simulador de propagação de mudança, classificador semântico e comparador de coesão.
- Pipeline monetário e decisão explícita de política para estoque.
- Simulação didática do IntelliJ com `Step Into`, Frames e Variables em cinco estados.
- Clínica própria e separada da entrega, com oito casos.
- Dez etapas, cabeçalho compacto, `GuidedLessonFacts`, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, conteúdo, estrutura, responsividade e compila as cinco fontes finais.
- Executa o teste manual e o estoque, conferindo validação, total, desconto e valor de estoque.
- Lint, build e `git diff --check` executados.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 099 continua com Call Stack, Step Into, Step Over e Step Out no IntelliJ.
