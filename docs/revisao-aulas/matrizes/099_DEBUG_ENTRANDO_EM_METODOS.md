# Matriz de preservação — Aula 099

## Identificação

- Aula: `099 — M3.10 — Debug entrando em métodos`
- Fonte: `docs/aulas/099_M3_10_DEBUG_ENTRANDO_EM_METODOS_OFICIAL.md`
- Aula anterior: `098 — Reuso sem duplicação`
- Aula seguinte: `100 — Extract Method`
- Experiência: `plataforma-curso/src/components/GuidedMethodDebugLesson099.jsx`
- Estilos: `plataforma-curso/src/components/guidedMethodDebugLesson.css`
- Validador: `tools/validate-lesson-099.mjs`
- Arquétipo: laboratório visual de pilha, frames, navegação no debugger, rastreamento, correção, stack trace, clínica e entrega.
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Resultado prometido

O aluno explica Call Stack e frames, escolhe conscientemente entre F8, F7 e Shift+F8, acompanha Variables em cinco pausas e prova por que o imposto se perde antes de corrigir o argumento do frete.

## Inventário e destino

| Conteúdo original | Destino na experiência | Evidência |
| --- | --- | --- |
| Call Stack, frame, topo e retorno | Modelo da Call Stack | pilha interativa com entrada e retorno |
| Step Over, Step Into e Step Out | F8, F7 e Shift+F8 | seletor com efeito e situação correta |
| `DebugCallStack.java` | Programa em Camadas | fonte integral, linha do tempo e console |
| breakpoint na calha | IntelliJ: Frames | mock didático do editor/debugger |
| Frames e Variables | IntelliJ e Step Into | escopo por frame e cinco pausas |
| `DebugCalculoComBug.java` | Mapa do Bug | fluxo 300 → 315 → 300 → 315 |
| rastreamento do defeito | Step Into no Fluxo | frames e variáveis sincronizados |
| correção `comImposto` | Correção Comprovada | fonte corrigida e saída 330.0000 |
| `DebugStackTrace.java` | Ler StackTrace | exceção intencional lida do topo até `main` |
| Evaluate Expression | Evaluate Expression | laboratório com `Alt + F8` e três hipóteses |
| erros recorrentes | Clínica de Erros | oito diagnósticos com recuperação |
| atividade, perguntas, Git e critérios | Entrega & Desafio | comandos, checklist, desafio e README |

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Modelo da Call Stack | chamada abstrata → pilha viva | frames empilhados e retorno |
| F8, F7 e Shift+F8 | clique automático → decisão | três controles comparados |
| Programa em Camadas | fonte → ordem observável | seis linhas de console |
| IntelliJ: Frames | ferramenta desconhecida → mapa | calha, Frames e Variables |
| Mapa do Bug | total incorreto → perda localizada | argumento bruto no frete |
| Step Into no Fluxo | suspeita → prova | cinco pausas guiadas |
| Correção Comprovada | hipótese → nova execução | 315.00 versus 330.0000 |
| Ler StackTrace | texto vermelho → cadeia causal | quatro níveis ordenados |
| Evaluate Expression | edição prematura → teste temporário | três expressões no frame |
| Clínica de Erros | hábito ruim → recuperação | oito casos |
| Entrega & Desafio | investigação → registro revisável | fontes, saídas, checklist e Git |

## Recursos e profundidade

- Quatro fontes Java completas, copiáveis, destacadas, compiláveis e executáveis.
- Simulação didática do IntelliJ com calha, Frames, Variables e seleção de frame.
- Linha do tempo de chamadas, pilha interativa, mapa de valores e rastreamento em cinco pausas.
- Comparação explícita do defeito em `315.00` com a correção em `330.0000`.
- StackTrace intencional, Evaluate Expression e clínica com oito casos.
- Onze etapas, cabeçalho compacto, `GuidedLessonFacts`, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, conteúdo, estrutura, responsividade e as onze etapas.
- Compila as quatro fontes; executa três fluxos normais e confirma a exceção e a ordem da StackTrace.
- Lint, build e `git diff --check` executados.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 100 continua com `Extract Method`.
