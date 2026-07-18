# Matriz de preservação — Aula 106

## Identificação

- Aula: `106 — M4.02 — Modelagem no papel`
- Fonte: `docs/aulas/106_M4_02_MODELAGEM_NO_PAPEL_OFICIAL.md`
- Aula anterior: `105 — Pensamento orientado a objetos`
- Aula seguinte: `107 — Classe e objeto em Java`
- Experiência: `plataforma-curso/src/components/GuidedPaperModelingLesson106.jsx`
- Estilos: `plataforma-curso/src/components/guidedPaperModelingLesson.css`
- Validador: `tools/validate-lesson-106.mjs`
- Arquétipo: oficina guiada de leitura, anotação, filtragem, rascunho, implementação, responsabilidade, auditoria, debug, clínica e entrega.
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Resultado prometido

O aluno transforma descrições de negócio em hipóteses de modelo explícitas — candidatos, estado, comportamentos, regras, responsabilidades e dúvidas — antes de escrever classes e validar as decisões com código e testes.

## Inventário e destino

| Conteúdo original | Destino na experiência | Evidência |
| --- | --- | --- |
| técnica em oito passos | Processo em 8 Etapas | fluxo interativo do enunciado ao código |
| descrição da OS | Anotar o Enunciado | texto integral sob três lentes |
| substantivos | Anotar e Filtrar | candidatos, dados e valores controlados |
| verbos | Anotar o Enunciado | ações traduzidas em responsabilidades |
| cinco regras e prioridade | Anotar e Rascunho | encerramento antes de atraso e reagendamento |
| candidatos da OS | Filtrar Candidatos | classe, dois enums e Cliente adiado |
| responsabilidades | Filtrar e Responsabilidade | estado e comportamento por conceito |
| rascunho da OS | Rascunho da OS | estado, métodos, regras e dúvidas navegáveis |
| implementação da OS | Do Papel ao Código | `ModelagemOs.java` integral |
| modelagem do Pedido | Modelar Pedido | estado, comportamento, regras e dúvida |
| implementação do Pedido | Modelar Pedido | `ModelagemPedido.java` integral |
| regra de 15% acima de dez itens | Pedido e testes | prioridade explícita sobre 10% |
| quem deve saber/fazer | Responsabilidade e Tipos | oito decisões classificadas |
| entidade, valor e serviço | Responsabilidade e Tipos | primeira noção sem forçar abstração |
| nomes genéricos | Auditar o Modelo | Manager, Processor, Helper, Utils, Dados e Info |
| critérios de boa candidata | Auditar o Modelo | oito perguntas baseadas em evidência |
| modelo como hipótese | Auditoria | ciclo de revisão explícito |
| debug de OS e Pedido | Debug do Modelo | nove frames conectados ao rascunho |
| desafio Cliente | Entrega & Desafio Cliente | modelo textual e `ModelagemCliente.java` |
| sete erros comuns | Clínica ampliada | oito casos com sintoma e correção |
| registro, conclusão e Git | Entrega | checklist, testes, decisões e commit |

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Processo em 8 Etapas | impulso de codar → processo | oito estados |
| Anotar o Enunciado | texto → sinais do domínio | três lentes |
| Filtrar Candidatos | palavras → decisões | classe, enum, dado ou adiado |
| Rascunho da OS | decisões → contrato | estado, comportamento, regras e dúvidas |
| Do Papel ao Código | hipótese → execução | fonte integral da OS |
| Modelar Pedido | transferência → nova regra | rascunho e fonte integral |
| Responsabilidade e Tipos | comportamento → dono | entidade, valor, serviço e borda |
| Auditar o Modelo | nome → evidência | critérios e sinais suspeitos |
| Debug do Modelo | rascunho → frames | OS e Pedido |
| Clínica de Erros | falha → etapa ignorada | oito casos |
| Entrega & Desafio Cliente | compreensão → autoria | modelo, código, testes e Git |

## Recursos e profundidade

- Quatro fontes Java completas: OS, Pedido, Cliente e suíte manual.
- Processo visual, lentes de anotação, navegador de candidatos, papel interativo, classificador de responsabilidades, auditoria e mock de debug.
- Modelos registram dúvidas e decisões adiadas, evitando apresentar a primeira versão como definitiva.
- Onze etapas substantivas; Clínica de Erros e Entrega permanecem tópicos finais próprios.
- Clínica própria com oito casos e entrega separada com quinze evidências.
- Cabeçalho compacto, `GuidedLessonFacts`, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, conteúdo, estrutura, responsividade, onze etapas e oito erros.
- Compila quatro fontes e confirma filas da OS, descontos, inválidos, Cliente e onze evidências automatizadas.
- Lint, build e `git diff --check` executados.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 107 aprofundará `class`, `new`, instância, atributos, métodos, construtor e `this`.
