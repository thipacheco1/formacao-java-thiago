# Matriz de preservação — Aula 102

## Identificação

- Aula: `102 — M3.13 — Projeto calculadora console revisitada`
- Fonte: `docs/aulas/102_M3_13_PROJETO_CALCULADORA_CONSOLE_REVISITADA_OFICIAL.md`
- Aula anterior: `101 — Mini arquitetura procedural`
- Aula seguinte: `103 — Projeto processamento de OS console`
- Experiência: `plataforma-curso/src/components/GuidedCalculatorRevisitedLesson102.jsx`
- Estilos: `plataforma-curso/src/components/guidedCalculatorRevisitedLesson.css`
- Validador: `tools/validate-lesson-102.mjs`
- Arquétipo: projeto visual de fluxo, responsabilidades, operações, validação, histórico, relatório, debug, evolução, clínica e entrega.
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Resultado prometido

O aluno constrói uma calculadora procedural completa com menu, leitura resiliente, quatro operações, histórico limitado, relatório derivado, debug guiado e uma evolução V2 sem fazer o `main` voltar a crescer.

## Inventário e destino

| Conteúdo original | Destino na experiência | Evidência |
| --- | --- | --- |
| fluxo 1–8 do projeto | Mapa do Projeto | ciclo interativo em seis estados |
| menu 0–6 | Mapa e Código Completo | roteamento de operações e consultas |
| responsabilidades | Responsabilidades | cinco grupos navegáveis |
| fonte integral | Código Completo | `CalculadoraConsoleRevisitada.java` |
| quatro operações | Laboratório de Operações | simulador com operandos e record |
| leitura robusta | Entradas e Guardas | texto inválido e vírgula decimal |
| opção inválida | Entradas e Guardas | erro e retorno ao menu |
| divisão por zero | Operações e Guardas | bloqueio antes do cálculo e do registro |
| `ResultadoOperacao` | Operações, histórico e fonte | nome, operandos e valor agrupados |
| array de dez posições | Histórico | ocupação interativa e limite |
| relatório | Relatório Derivado | total, contadores e média ao vivo |
| debug recomendado | Debug do Fluxo | cinco pausas com Variables |
| melhorias futuras | Extensão V2 | switch, enum, formatação, null e classes |
| desafio V2 | Extensão e Entrega | maior, menor e três contadores completos |
| atividade e critérios | Entrega & Desafio | suíte manual, checklist e README |
| Git | Entrega | comandos copiáveis e diff |

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Mapa do Projeto | requisitos → ciclo | menu, rota, operação, histórico e repetição |
| Responsabilidades | arquivo único → donos claros | cinco grupos |
| Código Completo | fragmentos → projeto executável | fonte integral |
| Laboratório de Operações | cálculo solto → record | quatro operações |
| Entradas e Guardas | erro fatal → recuperação | quatro cenários |
| Histórico de 10 Posições | array abstrato → estado | índice e capacidade |
| Relatório Derivado | dados → informação | contadores e média |
| Debug do Fluxo | console → execução interna | cinco frames |
| Extensão V2 | mudança ampla → evolução localizada | cinco métricas |
| Clínica de Erros | sintoma → recuperação | oito casos |
| Entrega & Desafio | projeto → evidência | três fontes, testes e Git |

## Recursos e profundidade

- Três fontes Java completas: projeto, suíte manual e extensão V2.
- Simuladores de operação, validação, histórico, relatório e debug.
- Execução automatizada do roteiro principal, de entradas inválidas, do limite do array e da V2.
- Clínica própria com oito casos e entrega separada com quinze evidências.
- Onze etapas, cabeçalho compacto, `GuidedLessonFacts`, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, conteúdo, estrutura, responsividade, onze etapas e oito erros.
- Compila as três fontes e confirma operações, rejeições, histórico, relatório, limite e métricas V2.
- Lint, build e `git diff --check` executados.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 103 continua com processamento de ordem de serviço no console.
