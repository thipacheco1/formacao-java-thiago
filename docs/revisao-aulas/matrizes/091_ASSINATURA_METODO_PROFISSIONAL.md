# Matriz de preservação — Aula 091

## Identificação

- Aula: `091 — M3.02 — Assinatura de método profissional`
- Fonte integral: `docs/aulas/091_M3_02_ASSINATURA_DE_METODO_PROFISSIONAL_OFICIAL.md`
- Experiência guiada: `plataforma-curso/src/components/GuidedProfessionalSignatureLesson091.jsx`
- Estilos: `plataforma-curso/src/components/guidedProfessionalSignatureLesson.css`
- Validador: `tools/validate-lesson-091.mjs`
- Estado: implementada e tecnicamente validada; inspeção visual e aprovação do responsável pendentes.

## Intenção pedagógica preservada

Todo conteúdo original foi preservado na oficina de contratos legíveis. A experiência mantém anatomia informal da assinatura, contrato, visibilidade, `static`, retorno, nome, parâmetros, ordem, tipos, checked exceptions, linguagem de domínio, relação entre verbo e retorno, `void`, política de `null`, boolean misterioso, enum, parâmetros demais, record futuro, assinatura ruim e boa completas, quatro refatorações, sete aplicações profissionais completas, dez erros, debug, atividade, arquivos, observações, Git e critérios.

## Roteiro reconstruído

| Etapa | Conteúdo da fonte | Transformação didática | Evidência |
| --- | --- | --- | --- |
| 1. Anatomia do Contrato | elementos da assinatura e promessa ao chamador | assinatura segmentada e fluxo chamada–argumentos–corpo–retorno | sete partes selecionáveis, incluindo `throws IOException` |
| 2. Verbo e Retorno | calcular, validar, imprimir, converter, montar, buscar e registrar | mapa interativo de verbos e resultados esperados | comparação entre promessa quebrada e contrato coerente |
| 3. Parâmetros Profissionais | nome, tipo, ordem, necessidade e excesso | laboratório de cinco critérios e mapa de tipos | dinheiro, data, instante, enum e record contextualizados |
| 4. Boolean e Null | `true` misterioso e política implícita de nulo | comparação entre boolean, enum e método específico | duas políticas explícitas de `null` |
| 5. Ruim versus Boa | `AssinaturaRuim` e `AssinaturaBoa` | alternância integral entre as duas fontes | ambas compilam e imprimem `180.0000` |
| 6. Quatro Refatorações | nome, boolean, `void` e parâmetros demais | fluxo antes/depois e checklist de dez perguntas | evolução futura para `ResumoPedido` sem antecipar OO |
| 7. Sete Domínios | pedido, cliente, produto, pagamento, OS, mensageria e auditoria | galeria com sete programas Java completos | nomes, tipos, retorno e cheiros específicos de cada domínio |
| 8. Clínica de Erros | dez falhas comuns | diagnóstico com sintoma e correção | dez casos íntegros e navegáveis |
| 9. Entrega & Desafio | compilação, execução, debug, evidências e Git | terminal, breakpoints, checklist e README copiável | nove fontes compiladas em conjunto e saídas verificadas |

## Decisões de profundidade

- A assinatura é ensinada como contrato observável, não como lista decorativa de tokens.
- `throws IOException` aparece como checked exception conceitual; runtime exceptions permanecem no escopo prático.
- Nome e retorno são avaliados juntos: cálculo devolve valor, impressão executa efeito e validação pode devolver boolean ou resultado rico.
- `null` não é escondido: o aluno compara retorno vazio com `IllegalArgumentException` e vê por que o nome muda.
- As duas versões principais preservam o resultado para isolar o ganho de comunicação.
- Os sete programas de domínio são fontes completas e compiláveis; não são apenas listas de nomes.
- Auditoria mantém cinco parâmetros para que o cheiro de record seja reconhecido sem antecipar a solução arquitetural.
- O validador compila nove arquivos, executa as duas assinaturas e o pedido e confere suas saídas exatas.

## Padrões de interface

- Cabeçalho compacto, fatos compartilhados e nove etapas.
- Roteiro `sticky` no desktop e item ativo focado no trilho mobile.
- Troca de etapa ancora em `.guided-layout`.
- Concluir/desmarcar, portão de etapa e portão curricular para a Aula 092.
- Códigos completos com Prism, linhas, quebra segura e cópia.
- Anatomia segmentada, fluxo de contrato, comparação antes/depois e galeria de domínios.
- Clínica usa círculo numérico restrito e `guided-error-label` legível.
- Layout responde em `900`, `680`, `520`, `380` e `320` px; raiz mantém `overflow: visible`.

## Validações previstas

- Rota dedicada para `091_`.
- Nove etapas, sete partes da assinatura, sete verbos, cinco tópicos de parâmetro, quatro refatorações, dez perguntas, sete domínios e dez erros.
- Progresso filtrado, normalização antiga, foco mobile, âncora e portões.
- Presença de `BigDecimal`, `LocalDate`, `Instant`, enum, record, `null`, `IllegalArgumentException`, `throws IOException`, `void` e debug.
- Extração e compilação das nove fontes Java completas.
- Comparação exata de `AssinaturaRuim`, `AssinaturaBoa` e `PedidoAssinaturaProfissional`.
- Lint, build de produção e `git diff --check`.

## Pendências conscientes

- Inspeção visual manual em desktop e celular.
- Aprovação explícita antes de virar referência aprovada.
- A Aula 092 aprofunda coesão em métodos.
