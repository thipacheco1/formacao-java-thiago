# Matriz de preservação — Aula 101

## Identificação

- Aula: `101 — M3.12 — Mini arquitetura procedural`
- Fonte: `docs/aulas/101_M3_12_MINI_ARQUITETURA_PROCEDURAL_OFICIAL.md`
- Aula anterior: `100 — Refatoração Extract Method no IntelliJ`
- Aula seguinte: `102 — Projeto calculadora console revisitada`
- Experiência: `plataforma-curso/src/components/GuidedProceduralArchitectureLesson101.jsx`
- Estilos: `plataforma-curso/src/components/guidedProceduralArchitectureLesson.css`
- Validador: `tools/validate-lesson-101.mjs`
- Arquétipo: oficina visual de fluxo, diagnóstico, baseline, responsabilidades, records, equivalência, limites, transferência, clínica e entrega.
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Resultado prometido

O aluno transforma um `main` com quatro responsabilidades misturadas em um coordenador legível, organiza leitura, validação, processamento e exibição, usa records nas fronteiras e transfere o desenho para uma ordem de serviço.

## Inventário e destino

| Conteúdo original | Destino na experiência | Evidência |
| --- | --- | --- |
| conceito de mini arquitetura | Mapa da Arquitetura | pipeline preparar, ler, validar, processar e exibir |
| main gigante | Diagnóstico do Main | quatro áreas e motivos de mudança |
| `PedidoMainGrande.java` | Rodar o Main Grande | fonte integral, entrada e saída conhecidas |
| main coordenador | Main como Roteiro | quatro chamadas navegáveis com F7 |
| métodos de leitura | Separar Responsabilidades | quatro métodos e contrato |
| métodos de validação | Separar Responsabilidades | três perguntas isoladas |
| métodos de cálculo | Separar Responsabilidades | quatro operações de processamento |
| métodos de exibição | Separar Responsabilidades | quatro operações de console |
| `PedidoMiniArquiteturaProcedural.java` | Código Organizado | fonte integral com dois records |
| equivalência antes/depois | Código Organizado | mesmos bruto, desconto e total |
| ordem dos métodos | Ordem de Navegação | sete grupos e ressalva de convenção |
| procedural não é bagunça | Diagnóstico e Clínica | responsabilidade versus tecnologia |
| limites da abordagem | Limites sem Antecipação | classe única, sem camadas, DI ou persistência |
| desafio de OS | Projeto de OS | fonte completa com LocalDate e dois records |
| erros comuns | Clínica de Erros | oito diagnósticos com recuperação |
| atividade, registro e Git | Entrega & Desafio | checklist, comandos e README |

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Mapa da Arquitetura | métodos soltos → fluxo | cinco papéis interativos |
| Diagnóstico do Main | tamanho → motivos de mudança | quatro áreas localizadas |
| Rodar o Main Grande | código inicial → baseline | entrada Ana/Cadeira e totais |
| Main como Roteiro | detalhes → coordenação | quatro contratos com Step Into |
| Separar Responsabilidades | extrações → grupos coesos | leitura, validação, processamento e saída |
| Código Organizado | fragmentos → programa completo | records e prova de equivalência |
| Ordem de Navegação | arquivo longo → percurso previsível | sete grupos |
| Limites sem Antecipação | organização → expectativa correta | cinco limites explícitos |
| Projeto de OS | repetição → transferência | novo domínio e LocalDate |
| Clínica de Erros | sintoma → recuperação | oito casos |
| Entrega & Desafio | prática → evidência revisável | três fontes, debug e Git |

## Recursos e profundidade

- Três fontes Java completas, copiáveis, destacadas, compiláveis e executáveis.
- Pipeline arquitetural, mapa de cheiro, simulador de main e navegador de responsabilidades.
- Prova automática de equivalência do pedido com a mesma entrada de console.
- Projeto completo de ordem de serviço com `LocalDate`, `ChronoUnit` e records de entrada e resumo.
- Clínica própria com oito casos e entrega separada com dezesseis evidências.
- Onze etapas, cabeçalho compacto, `GuidedLessonFacts`, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, conteúdo, estrutura, responsividade, onze etapas e oito erros.
- Compila as três fontes, exige equivalência exata do pedido e executa a OS com entrada conhecida.
- Lint, build e `git diff --check` executados.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 102 continua com o projeto calculadora console revisitada.
