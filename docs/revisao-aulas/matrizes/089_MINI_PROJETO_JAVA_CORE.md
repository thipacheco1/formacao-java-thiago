# Matriz de preservação — Aula 089

## Identificação

- Aula: `089 — M2.28 — Mini projeto biblioteca Java Core`
- Fonte integral: `docs/aulas/089_M2_28_MINI_PROJETO_BIBLIOTECA_JAVA_CORE_OFICIAL.md`
- Experiência guiada: `plataforma-curso/src/components/GuidedJavaCoreLibraryLesson089.jsx`
- Estilos: `plataforma-curso/src/components/guidedJavaCoreLibraryLesson.css`
- Validador: `tools/validate-lesson-089.mjs`
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação do responsável pendentes.

## Intenção pedagógica preservada

Todo conteúdo original foi preservado no primeiro projeto integrador do bloco. A experiência mantém escopo Java puro, estrutura de três pacotes, oito classes, default package, classes utilitárias, record, enum, testes manuais, criação da árvore, implementações completas de texto/dinheiro/data, quatro asserts, aplicação, compilação, duas execuções, cinco refatorações, oito perguntas de leitura crítica, `.gitignore`, dez erros, debug, README, commit e critérios.

## Roteiro reconstruído

| Etapa | Conteúdo da fonte | Transformação didática | Evidência |
| --- | --- | --- | --- |
| 1. Mapa do Projeto | objetivo, limites, três pacotes e oito classes | árvore selecionável `app/core/teste` e escopo explícito | sem Maven, JUnit, Spring ou biblioteca externa |
| 2. Record e Enum | `ResultadoValidacao` e `TipoNormalizacao` | simulador de sucesso/erro e seletor de caixa | duas implementações completas |
| 3. TextoUtils | normalização, dígitos, limite, obrigatório e caixa | laboratório editável de texto e limite | classe completa com regex, enum, record e exceção |
| 4. DinheiroUtils | parse, arredondamento, positivo, soma e formato | pipeline monetário e três contratos auxiliares | classe completa com BigDecimal, varargs e causa preservada |
| 5. DataUtils | ISO, formato BR, dias e futuro | laboratório de duas datas | classe completa com LocalDate, formatter e ChronoUnit |
| 6. Testes Manuais | quatro asserts, cenários normais e inválidos | seletor de assert, falha simulada e fluxo expected/actual | `AssertManual` e `TesteBibliotecaJavaCore` completos |
| 7. Integração e Revisão | Main pequeno, oito arquivos, cinco refatorações e oito perguntas | explorador de fontes e auditoria selecionável | Main completo e `.gitignore` |
| 8. Clínica de Erros | dez falhas comuns | diagnóstico com sintoma e correção | dez casos íntegros |
| 9. Entrega & Desafio | compilar, executar app/testes, debug, atividade e Git | terminal com duas saídas, checklist e extensão controlada | compilação real dos oito arquivos e execução dos dois entrypoints |

## Decisões de profundidade

- As oito classes são fontes Java completas, não trechos ilustrativos.
- `TextoUtils` preserva os cinco contratos da fonte; `DinheiroUtils` preserva cinco; `DataUtils` preserva quatro.
- Exceptions de parse ganham contexto sem apagar `NumberFormatException` ou `DateTimeParseException`.
- `AssertManual` compara objetos, boolean, BigDecimal numérico e erro esperado.
- A suíte contém dezoito verificações, incluindo vazio, zero, decimal inválido e data fora do ISO.
- `Main` só demonstra a biblioteca e produz seis linhas previsíveis.
- A validação compila os oito fontes em `out`, executa `br.com.formacao.app.Main` e `br.com.formacao.teste.TesteBibliotecaJavaCore`.
- Maven, JUnit, Spring, publicação, camadas e bibliotecas externas permanecem fora do escopo.

## Padrões de interface

- Cabeçalho compacto, fatos compartilhados e nove etapas.
- Roteiro `sticky` no desktop e item ativo focado no trilho mobile.
- Troca de etapa ancora em `.guided-layout`.
- Concluir/desmarcar, portão de etapa e portão curricular para a Aula 090.
- Código completo com Prism, linhas e cópia.
- Clínica usa círculo numérico restrito e `guided-error-label` legível.
- Layout responde em `900`, `680`, `520`, `380` e `320` px; raiz mantém `overflow: visible`.

## Validações previstas

- Rota dedicada para `089_`.
- Nove etapas, oito classes, quatro asserts, oito perguntas de revisão e dez erros.
- Progresso filtrado, normalização antiga, foco mobile, âncora e portões.
- Presença de String, regex, BigDecimal, RoundingMode, LocalDate, formatter, ChronoUnit, enum, record, static, construtor privado, exceptions e testes.
- Extração e compilação dos oito arquivos na árvore correta.
- Comparação exata das seis linhas da aplicação e da confirmação da suíte.
- Lint e `git diff --check`; build de produção segue a cadência já validada na Aula 087.

## Pendências conscientes

- Inspeção visual manual em desktop e celular.
- Aprovação explícita antes de virar referência aprovada.
- A Aula 090 inicia o Módulo 3 com decomposição de `main` em métodos pequenos.
