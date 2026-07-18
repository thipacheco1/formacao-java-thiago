# Matriz de preservação — Aula 096

## Identificação

- Aula: `096 — M3.07 — Métodos de exibição`
- Fonte: `docs/aulas/096_M3_07_METODOS_DE_EXIBICAO_OFICIAL.md`
- Aula anterior: `095 — Métodos de cálculo`
- Aula seguinte: `097 — Métodos de leitura`
- Experiência: `plataforma-curso/src/components/GuidedDisplayMethodsLesson096.jsx`
- Estilos: `plataforma-curso/src/components/guidedDisplayMethodsLesson.css`
- Validador: `tools/validate-lesson-096.mjs`
- Arquétipo: oficina visual de fronteiras, `void`, console, Text Block, record, utilitário, IntelliJ, clínica e entrega.
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Resultado prometido

O aluno compila seis fontes, prevê suas saídas, separa cálculo, leitura e apresentação, constrói uma `ConsoleView` não instanciável e depura com `Step Over` uma view de ordem de serviço que também trata `null`.

## Inventário e destino

| Conteúdo original | Destino na experiência | Evidência |
| --- | --- | --- |
| responsabilidade de um método de exibição | Mapa de Responsabilidades | fluxo selecionável entrada → método → efeito |
| `void` e seus limites | Contrato do void | comparação com método que retorna valor |
| separação da lógica de negócio | mapa, resumo, OS e clínica | cálculo, leitura e view têm fronteiras explícitas |
| `ExibicaoBasica.java` | Exibição Básica | código integral e quatro prévias de console |
| `MenuComTextBlock.java` | Menu com Text Block | código integral versus saída renderizada |
| Java 15+, aspas triplas e recuo incidental | Menu com Text Block | diagrama fonte → normalização → console |
| `ResumoPedidoConsole.java` e record | Resumo com record | recibo preenchido, cenário nulo e código integral |
| guard clause contra `NullPointerException` | Resumo com record e OS | alternância preenchido/null e retorno antecipado |
| `ConsoleView.java` | ConsoleView Utilitária | anatomia `final/private/static` e código integral |
| teste de sucesso e erro | ConsoleView Utilitária | `TesteConsoleView.java` e saída prefixada |
| não calcular nem ler na exibição | mapa e Clínica de Erros | casos próprios com correção de fronteira |
| prints fora de padrão | utilitário e clínica | identidade visual centralizada |
| `OrdemServicoExibicao.java` | OS e Step Over | solução completa com record, OS preenchida e nula |
| debug no IntelliJ com F8 | OS e Step Over | simulação didática em cinco estados |
| atividade guiada | etapas básica, Text Block e utilitário | ações, saída e programa de teste executável |
| três perguntas de registro | Entrega & Desafio | checklist de evidências |
| critério de conclusão e Git | Entrega & Desafio | comandos, doze verificações e README copiável |
| transição para JSON/Spring | Mapa de Responsabilidades | interface pode mudar sem tocar na regra |

## Repetições consolidadas

- A definição, importância e fechamento repetiam a mesma separação; viraram um mapa de três fronteiras usado na prática.
- As recomendações sobre identidade visual espalhada convergem na construção e no teste da `ConsoleView`.
- A explicação de cada exemplo aparece junto do código, da saída ou do estado nulo, e não em uma seção posterior desconectada.

## Lacunas corrigidas

- As saídas dos exemplos agora são visíveis e verificáveis.
- A atividade que pedia uma classe temporária agora possui `TesteConsoleView.java` completo e compilável.
- O desafio agora possui uma solução executável e testa tanto a OS preenchida quanto a nula.
- O debug agora orienta o estado observado em cada `Step Over`, sem fingir screenshot oficial do IntelliJ.
- `void` é comparado com retorno de valor para evitar a associação equivocada com “método sem responsabilidade”.
- A relação com a Aula 097 é preservada: `Scanner` é apenas identificado como responsabilidade de leitura, sem antecipar sua implementação.

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Mapa de Responsabilidades | método genérico → fronteira explícita | cálculo, exibição e leitura selecionáveis |
| Contrato do void | ausência de retorno → efeito responsável | assinatura e fluxo do chamador |
| Exibição Básica | prints repetidos → peças reutilizáveis | código e console por rotina |
| Menu com Text Block | concatenação mental → bloco e saída comparáveis | fonte Java e menu alinhado |
| Resumo com record | dados agrupados → recibo seguro | record preenchido e guard clause |
| ConsoleView Utilitária | padrões espalhados → utilitário protegido | `final`, `private`, `static` e teste |
| OS e Step Over | requisito aberto → solução depurada | cinco estados do IntelliJ e fonte completa |
| Clínica de Erros | sintoma → causa e recuperação | oito diagnósticos |
| Entrega & Desafio | arquivos locais → prova revisável | seis execuções, checklist e Git |

## Recursos e profundidade

- Seis fontes Java completas, copiáveis, destacadas e compiláveis.
- Quatro prévias de console e comparação Text Block/saída.
- Recibo responsivo para o record e estado alternativo de erro.
- Simulação didática do IntelliJ com `Step Over`, `Variables` e progressão em cinco estados.
- Clínica própria e separada da entrega, com oito casos.
- Nove etapas, cabeçalho compacto, `GuidedLessonFacts`, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, conteúdo, estrutura, responsividade e compila as seis fontes.
- Executa os cinco programas com `main` e confere as saídas essenciais, inclusive OS nula.
- Lint, build e `git diff --check` executados.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 097 continua com métodos de leitura e `Scanner` defensivo.
