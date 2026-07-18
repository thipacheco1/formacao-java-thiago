# Matriz de preservação — Aula 097

## Identificação

- Aula: `097 — M3.08 — Métodos de leitura`
- Fonte: `docs/aulas/097_M3_08_METODOS_DE_LEITURA_OFICIAL.md`
- Aula anterior: `096 — Métodos de exibição`
- Aula seguinte: `098 — Reuso sem duplicação`
- Experiência: `plataforma-curso/src/components/GuidedInputMethodsLesson097.jsx`
- Estilos: `plataforma-curso/src/components/guidedInputMethodsLesson.css`
- Validador: `tools/validate-lesson-097.mjs`
- Arquétipo: laboratório visual de adaptador, buffer, retry, conversão, ciclo de vida, IntelliJ, clínica e entrega.
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação pendentes.

## Resultado prometido

O aluno reproduz o Enter residual do `Scanner`, executa sequências inválidas antes das válidas, centraliza texto, inteiro e `BigDecimal` em um único `ConsoleInput` e conclui um cadastro de produto que não trava nem libera dados inválidos.

## Inventário e destino

| Conteúdo original | Destino na experiência | Evidência |
| --- | --- | --- |
| método de leitura como adaptador | Adaptador de Entrada | pipeline em cinco estágios até dado válido |
| `Scanner` seguro | toda a oficina | um objeto criado no `main` e passado por parâmetro |
| bug `nextInt()`/`nextLine()` | Bug do Buffer | simulador passo a passo do buffer residual |
| `nextLine()` fantasma | Bug do Buffer | alternativa explicada sem virar padrão preferido |
| `nextLine()` + parse manual | buffer, inteiro e utilitário | String capturada antes do `Integer.parseInt` |
| `while(true)`, `try-catch`, `return` | Texto e Inteiro | tentativa inválida repete; válida encerra |
| `LeituraTextoObrigatorio.java` | Texto Obrigatório | código integral e sequência espaços → nome |
| `trim().isEmpty()` | Texto Obrigatório | diagrama captura → higiene → decisão |
| `LeituraInteiro.java` | Inteiro sem Travar | código integral e sequência `abc` → `25` |
| `NumberFormatException` | Inteiro e utilitário | fluxo visual do try/catch |
| `InputMismatchException` | buffer e clínica | contraste com a estratégia baseada em String |
| `ConsoleInput.java` | ConsoleInput Coeso | código integral e três contratos selecionáveis |
| inteiro positivo | ConsoleInput Coeso | `parseInt` mais `valor > 0` |
| `BigDecimal` positivo | ConsoleInput e Cadastro | construtor, `compareTo` e erro com vírgula |
| múltiplos Scanners | Um Scanner, Um Buffer | ciclo criar → passar → reusar → não fechar |
| não fechar `System.in` | Um Scanner, Um Buffer | consequência explícita no processo inteiro |
| regra de negócio fora da leitura | mapa, cadastro e clínica | adaptador apenas converte e valida formato/limite |
| `CadastroProdutoConsole.java` | Cadastro e Debug | solução completa com nome, estoque e preço |
| breakpoint em `lerBigDecimal` | Cadastro e Debug | simulação didática de Variables no IntelliJ |
| atividade guiada | Texto e Inteiro | entradas reais inválidas e válidas com saídas |
| registro, critério e Git | Entrega & Desafio | checklist, README e comandos copiáveis |
| analogia com JSON HTTP Request | Adaptador de Entrada | fronteira console/API sem antecipar Spring |

## Repetições consolidadas

- Definição, importância e fechamento convergem no pipeline de adaptador de entrada.
- Explicações posteriores aos exemplos aparecem junto de cada tentativa e evidência do console.
- As recomendações de `Scanner` foram agrupadas em um ciclo de vida único, sem repetir avisos desconectados.

## Lacunas corrigidas

- O bug do buffer agora é reproduzido como mudança de estado, não apenas descrito.
- Todas as entradas possuem sequência explícita, erro esperado, repetição e sucesso.
- O desafio possui solução completa e compilável usando o utilitário da própria aula.
- O mock do IntelliJ identifica-se como simulação didática e mostra o valor antes/depois da conversão.
- A vírgula decimal é diagnosticada com o contrato local de usar ponto.
- A saída do cadastro é mostrada sem misturar cálculo, preservando a Aula 096.
- Reuso é praticado no `ConsoleInput`, mas julgamento profundo de DRY fica reservado à Aula 098.

## Roteiro

| Etapa | Transformação | Evidência |
| --- | --- | --- |
| Adaptador de Entrada | teclado bruto → valor protegido | cinco estágios selecionáveis |
| Bug do Buffer | salto misterioso → Enter residual explicado | dois fluxos de consumo em três passos |
| Texto Obrigatório | espaços → repetição → texto limpo | terminal e código integral |
| Inteiro sem Travar | `abc` → erro tratado → `25` | try/catch e terminal completo |
| ConsoleInput Coeso | leitores soltos → utilitário de três contratos | String, int e BigDecimal |
| Um Scanner, Um Buffer | wrappers concorrentes → ciclo único | criação, passagem, reuso e stream aberto |
| Cadastro e Debug | requisitos → produto válido | quatro estados no IntelliJ e fonte completa |
| Clínica de Erros | sintoma → causa e recuperação | oito diagnósticos |
| Entrega & Desafio | código → prova com entradas hostis | quatro execuções, checklist e Git |

## Recursos e profundidade

- Quatro fontes Java completas, copiáveis, destacadas e compiláveis.
- Execução automatizada com entrada padrão simulando espaços, texto, letras, zero, inteiro e decimal.
- Simulador de buffer, pipeline de adaptador e ciclo de vida do `Scanner`.
- Simulação didática do IntelliJ com breakpoint em `lerBigDecimal` e Variables.
- Clínica própria e separada da entrega, com oito casos.
- Nove etapas, cabeçalho compacto, `GuidedLessonFacts`, roteiro `sticky`, foco mobile, âncora, portões e conclusão reversível.
- Breakpoints em `900`, `680`, `520`, `380` e `320` px; raiz com `overflow: visible`.

## Validação e pendências

- O validador protege rota, conteúdo, estrutura, responsividade e compila as quatro fontes.
- Executa três programas com sequências inválidas/válidas e confere repetição, recuperação e cadastro final.
- Lint, build e `git diff --check` executados.
- Inspeção visual e aprovação explícita permanecem pendentes.
- A Aula 098 continua com DRY, duplicação semântica e classes de apoio coesas.
