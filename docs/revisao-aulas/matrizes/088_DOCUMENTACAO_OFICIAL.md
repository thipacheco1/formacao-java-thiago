# Matriz de preservação — Aula 088

## Identificação

- Aula: `088 — M2.27 — Leitura de documentação oficial`
- Fonte integral: `docs/aulas/088_M2_27_LEITURA_DE_DOCUMENTACAO_OFICIAL.md`
- Experiência guiada: `plataforma-curso/src/components/GuidedOfficialDocsLesson088.jsx`
- Estilos: `plataforma-curso/src/components/guidedOfficialDocsLesson.css`
- Validador: `tools/validate-lesson-088.mjs`
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação do responsável pendentes.

## Intenção pedagógica preservada

Todo conteúdo original foi preservado. A nova experiência mantém fonte oficial versus tutorial, JavaDoc, vocabulário, anatomia da página, assinatura, parâmetros, retorno, exceções, Deprecated, Since, static, instância, overload, dez exemplos de API, teste mínimo, mapa de leitura, sete aplicações, três refatorações, Quick Documentation no IntelliJ, documentação externa por versão, dez erros, debug, atividade, commit e critérios. A repetição foi convertida em leitura orientada, simulações e provas executáveis.

## Roteiro reconstruído

| Etapa | Conteúdo da fonte | Transformação didática | Evidência |
| --- | --- | --- | --- |
| 1. Fonte Primária | documentação, tutorial, fórum, verdade técnica | comparador interativo de finalidade e confiabilidade | fluxo dúvida → fonte → contrato → teste → registro |
| 2. Anatomia do JavaDoc | pacote, hierarquia, summaries, details, Since, Deprecated, See Also | mock navegável de uma página JavaDoc | detalhe de `substring` com Parameters, Returns e Throws |
| 3. Ler a Assinatura | acesso, static, retorno, nome, parâmetros e exceções | assinatura segmentada e selecionável | chamadas static e de instância lado a lado |
| 4. String em Prova | `isBlank`, `substring`, índices, retorno e exceção | laboratório editável de texto, begin e end | caso normal, limite e inválido |
| 5. BigDecimal sem Chute | `compareTo`, `equals`, escala, ZERO e objeto | simulador de valores e escalas | execução Java confirma `false` versus `0` |
| 6. Galeria de APIs | LocalDate, Scanner, Integer, Math, StringBuilder e BigDecimal | seis fichas de contrato e metadados | imutabilidade, efeito colateral, overload e construção |
| 7. IDE e Sete Domínios | cliente, produto, pedido, pagamento, OS, mensageria, auditoria, Quick Documentation e versão | galeria de domínio e mock do IntelliJ | perguntas normal/limite/inválido e documentação externa |
| 8. Clínica de Erros | dez falhas comuns | menu com sintoma e correção | dez diagnósticos íntegros |
| 9. Entrega & Desafio | métodos estudados, debug, atividade, README e Git | programa único com doze provas, checklist e desafio | compilação e comparação exata da saída |

## Decisões de profundidade

- A documentação é ensinada como contrato, não como substituta de uma aula guiada.
- O mock da JavaDoc mostra a ordem de leitura e preserva os nomes oficiais `Parameters`, `Returns`, `Throws`, `Since`, `Deprecated` e `See Also`.
- `String.substring` recebe entradas editáveis para tornar intervalo `[begin, end)` e falha de índice visíveis.
- O comparador visual de BigDecimal é explicitamente tratado como modelo; o laboratório Java real é a prova final.
- `StringBuilder.append` representa efeito colateral; `String`, `BigDecimal` e `LocalDate` representam retornos que não devem ser ignorados.
- A IDE simula Quick Documentation e explica quando abrir a documentação externa da versão correta.
- O programa integra `trim`, `isBlank`, `substring`, `equals`, `compareTo`, `parse`, `plusDays`, `parseInt`, `max`, `append`, `setScale` e `formatted`.

## Padrões de interface

- Cabeçalho compacto e `GuidedLessonFacts` compartilhado.
- Roteiro lateral `sticky`; no celular, trilho horizontal focado na etapa ativa.
- Troca de etapa ancora no começo de `.guided-layout`.
- Concluir/desmarcar etapa, portão de avanço e conclusão geral após nove etapas.
- Código com Prism, tema de IDE, linhas e cópia.
- Clínica usa seletor numérico restrito e `guided-error-label` legível.
- Layout responsivo em `900`, `680`, `520`, `380` e `320` px; raiz mantém `overflow: visible`.

## Validações previstas

- Rota exclusiva para `088_`.
- Nove etapas, seis APIs na galeria, sete domínios e dez diagnósticos.
- Persistência filtrada, normalização antiga, foco mobile, âncora e portões.
- Presença dos doze métodos e conceitos centrais da fonte.
- CSS responsivo até 320 px.
- Extração, compilação e execução real de `LaboratorioDocumentacao.java`.
- Comparação exata das doze linhas de saída.
- Lint dos arquivos alterados e `git diff --check`; build de produção já validado na Aula 087 e seguirá a cadência periódica.

## Pendências conscientes

- Inspeção visual manual em desktop e celular.
- Aprovação explícita do responsável antes de virar referência aprovada.
- A Aula 089 deve usar esse método de investigação no mini projeto biblioteca Java Core.
