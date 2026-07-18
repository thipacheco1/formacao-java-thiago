# Matriz de preservação — Aula 103

## Identificação

- Aula: `103 — M3.14 — Projeto processamento de OS console`
- Fonte: `docs/aulas/103_M3_14_PROJETO_PROCESSAMENTO_DE_OS_CONSOLE_OFICIAL.md`
- Aula anterior: `102 — Projeto calculadora console revisitada`
- Aula seguinte: `104 — Revisão final de fundamentos antes de OO`
- Experiência: `plataforma-curso/src/components/GuidedOrderServiceProcessingLesson103.jsx`
- Estilos: `plataforma-curso/src/components/guidedOrderServiceProcessingLesson.css`
- Validador: `tools/validate-lesson-103.mjs`
- Arquétipo: projeto guiado de entrada, validação, regra operacional, fila, memória, relatório, debug, evolução, clínica e entrega.
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Resultado prometido

O aluno constrói um processador console de Ordens de Serviço com entrada resiliente, `enum`, `record`, cálculo de dias, regras prioritárias de fila, histórico limitado, relatório derivado, debug guiado e uma evolução V2 localizada.

## Inventário e destino

| Conteúdo original | Destino na experiência | Evidência |
| --- | --- | --- |
| fluxo ler–validar–processar–exibir | Mapa do Projeto | seis estados navegáveis até registro e saída |
| menu 0–3 | Código Completo | processar, histórico, relatório e sair |
| responsabilidades | Responsabilidades | cinco grupos de métodos e dados |
| fonte integral | Código Completo | `ProcessamentoOsConsole.java` compilável |
| `StatusOs` | Código e Laboratório de Filas | cinco estados controlados por enum |
| `OrdemServicoEntrada` e `ResumoOs` | Código, mapa e debug | entrada separada do resultado processado |
| campos obrigatórios | Entradas Defensivas | texto vazio com retry |
| inteiro, mínimo, status e data | Entradas Defensivas | quatro cenários com saída do terminal |
| dias em aberto e data futura | Filas, Código e testes | limite de três dias e normalização para zero |
| prioridade de filas | Laboratório de Filas | simulador de status, dias e reagendamentos |
| histórico de dez posições | Histórico & Relatório | diferença entre capacidade e quantidade |
| relatório e contadores | Histórico & Relatório | indicadores recalculados sobre registros ativos |
| debug recomendado | Debug do Processamento | sete frames da entrada ao relatório |
| atividade guiada | Filas, Histórico e Entrega | normal, atrasada, reagendada e concluída |
| desafio V2 | Evolução V2 | regra REAGENDADA, contagem por status e média |
| registro, conclusão e Git | Entrega & Desafio | checklist, README e comandos copiáveis |

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Mapa do Projeto | requisitos → fluxo | seis estados conectados |
| Responsabilidades | arquivo único → donos claros | leitura, validação, processamento, memória e consulta |
| Código Completo | fragmentos → programa executável | fonte integral com enum e records |
| Laboratório de Filas | regras soltas → prioridade visível | simulador com quatro resultados possíveis |
| Entradas Defensivas | erro fatal → correção local | quatro retries guiados |
| Histórico & Relatório | array → informação | quatro OS selecionáveis e métricas ao vivo |
| Debug do Processamento | saída → caminho interno | sete chamadas com Variables e Frames |
| Evolução V2 | nova regra → mudança localizada | regra e duas métricas completas |
| Clínica de Erros | sintoma → causa e reparo | oito casos específicos |
| Entrega & Desafio | programa → evidência | três fontes, dez testes, checklist e Git |

## Recursos e profundidade

- Três fontes Java completas: projeto, suíte manual e evolução V2.
- Mapa de fluxo, navegador de responsabilidades, simulador de filas, console de validação, relatório interativo e mock de debug.
- Cobertura da entrada à saída: leitura, validação, processamento, `enum`, `record`, data, prioridade, array, relatório e Git.
- Clínica própria com oito casos e entrega separada com quinze evidências.
- Dez etapas substantivas; clínica e entrega permanecem tópicos finais próprios, sem conteúdo genérico.
- Cabeçalho compacto, `GuidedLessonFacts`, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, conteúdo, estrutura, responsividade, dez etapas e oito erros.
- Compila as três fontes e confirma datas, filas, limite, contadores e resultados da V2.
- Lint, build e `git diff --check` executados.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 104 fará a revisão final de fundamentos antes de Orientação a Objetos.
