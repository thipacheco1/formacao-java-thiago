# Matriz de preservação — Aula 100

## Identificação

- Aula: `100 — M3.11 — Refatoração Extract Method no IntelliJ`
- Fonte: `docs/aulas/100_M3_11_REFATORACAO_EXTRACT_METHOD_NO_INTELLIJ_OFICIAL.md`
- Aula anterior: `099 — Debug entrando em métodos`
- Aula seguinte: `101 — Mini arquitetura procedural`
- Experiência: `plataforma-curso/src/components/GuidedExtractMethodLesson100.jsx`
- Estilos: `plataforma-curso/src/components/guidedExtractMethodLesson.css`
- Validador: `tools/validate-lesson-100.mjs`
- Arquétipo: oficina visual de contrato, seleção, baseline, IntelliJ, fluxo de dados, equivalência, assinatura, clínica e entrega.
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Resultado prometido

O aluno cria uma baseline executável, usa `Ctrl + Alt + M` em uma seleção coesa, audita parâmetros e retorno, compara a saída antes/depois e transfere o procedimento para uma ordem de serviço com três extrações próprias.

## Inventário e destino

| Conteúdo original | Destino na experiência | Evidência |
| --- | --- | --- |
| definição de refatoração | Contrato da Refatoração | ciclo provar → transformar → provar |
| código precisa compilar | Rodar o Antes e Clínica | baseline compilável antes do atalho |
| seleção do bloco | Fronteira da Seleção | três fronteiras comparadas |
| `Ctrl + Alt + M` / macOS | IntelliJ Passo a Passo | mock em quatro estados e menu alternativo |
| parâmetros locais inferidos | Parâmetros e Retorno | entradas lidas viram parâmetros |
| variável modificada vira retorno | Parâmetros e Retorno | uma versus duas saídas |
| limite de um retorno | Parâmetros e Retorno | divisão da seleção ou tipo de resultado |
| `PedidoExtractAntes.java` | Rodar o Antes | fonte integral e saída de referência |
| `PedidoExtractDepois.java` | Extrair e Comparar | três métodos e mesma saída |
| nomes ruins e `Shift + F6` | Auditar a Assinatura | quatro assinaturas julgadas |
| não misturar nova regra | Contrato e Clínica | mudança estrutural separada |
| desafio de ordem de serviço | Oficina de Ordem de Serviço | antes/depois completos e três extrações |
| debug com F7 | Oficina de OS | recomendação contextual por método |
| atividade, questões, critério e Git | Entrega & Desafio | checklist, README e comandos |

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Contrato da Refatoração | aparência → equivalência | ciclo em quatro fases |
| Fronteira da Seleção | linhas → responsabilidade | estreita, coesa e larga |
| Rodar o Antes | código inicial → baseline | compilação e quatro linhas |
| IntelliJ Passo a Passo | atalho abstrato → operação guiada | seleção, diálogo, nome e preview |
| Parâmetros e Retorno | mágica da IDE → fluxo de dados | entradas e saídas visíveis |
| Extrair e Comparar | comentários → métodos nomeados | fontes completas e saída idêntica |
| Auditar a Assinatura | sugestão automática → julgamento | nome, coesão e parâmetros |
| Oficina de Ordem de Serviço | repetição do exemplo → transferência | três extrações em novo domínio |
| Clínica de Erros | sintoma → recuperação | oito casos |
| Entrega & Desafio | prática → prova revisável | quatro fontes, duas equivalências e Git |

## Recursos e profundidade

- Quatro fontes Java completas, copiáveis, destacadas, compiláveis e executáveis.
- Mock didático do IntelliJ com seleção de linhas, atalho, diálogo, parâmetros, retorno e preview.
- Simuladores de fronteira, fluxo de dados, uma/duas saídas e qualidade de assinatura.
- Duas provas automáticas de equivalência: pedido e ordem de serviço.
- Clínica própria com oito casos e entrega separada com quatorze evidências.
- Dez etapas, cabeçalho compacto, `GuidedLessonFacts`, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, conteúdo, estrutura, responsividade, dez etapas e oito erros.
- Compila as quatro fontes e exige igualdade exata entre as saídas antes/depois de cada domínio.
- Lint, build e `git diff --check` executados.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 101 continua com mini arquitetura procedural.
