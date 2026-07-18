# Auditoria das aulas 024 a 039

Data da auditoria: **2026-07-17**.

## Resultado

As dezesseis aulas estão implementadas e roteadas na plataforma. A estrutura pedagógica principal foi preservada: roteiro guiado, explicação antes da ação, código com destaque de sintaxe, estados e saídas esperadas, clínica de erros, prática, desafio de transferência, conclusão por etapa e navegação bloqueada até a conclusão real.

Todas permanecem com estado `em_revisao`. Implementação e validação técnica não substituem a inspeção visual em navegador real nem a aprovação explícita do responsável.

## Escopo conferido

- originais, matrizes de cobertura e componentes das aulas 024 a 039;
- registro das dezesseis rotas em `MarkdownViewer.jsx`;
- uso do CSS compartilhado, `GuidedLessonFacts`, destaque de sintaxe e CSS específico;
- raiz com `overflow: visible` e ausência de sobrescrita local do `sticky` do roteiro;
- persistência com chave exclusiva por aula;
- marcar e desmarcar etapa, gate de conclusão geral, reabertura e bloqueio da próxima aula;
- cabeçalho compacto, faixa de fatos compartilhada, roteiro e rodapé fixo;
- responsividade declarada para desktop, faixa intermediária e celular;
- alinhamento dos tópicos únicos inventariados nas matrizes com a experiência reconstruída;
- lint, build de produção, consistência do JSON e geração do cronograma.

## Correções aplicadas

1. A Aula 039 existia no código e na matriz, mas não estava registrada em `STATUS_REVISAO.json`; ela voltou a aparecer no cronograma como `em_revisao`.
2. As aulas 038 e 039 não normalizavam o estado antigo inconsistente de aula concluída com etapas pendentes; agora seguem a mesma regra das demais.
3. O roteiro horizontal no celular apenas destacava a etapa atual. `GuidedLessonFacts` agora observa a mudança da etapa ativa e a centraliza com `scrollIntoView({ block: 'nearest', inline: 'center' })`, inclusive após redimensionamento.
4. Foram removidas explicações que tratavam Stack, Heap, pool e endereços fictícios como garantias físicas da linguagem. Os diagramas das aulas 028, 029, 032, 033 e 034 agora ensinam comportamento observável, identidade de referência e conteúdo sem inventar alocação da JVM.
5. A Aula 025 passou a representar inteiros como complemento de dois, sem ensinar sinal-magnitude, e deixou de afirmar que todo identificador deve ser `long` ou que todo literal `long` exige `L`.
6. A Aula 031 passou a explicar truncamento em direção a zero e IEEE 754 sem relacionar precisão à região de memória.
7. A Aula 037 agora mostra que o aviso de fall-through depende de `javac -Xlint:fallthrough`.
8. A Aula 038 separa a compilação dos treze arquivos válidos do arquivo propositalmente inválido, registra a baseline Java 21 e esclarece que `default` não cobre `null`, embora Java 21 permita `case null` explícito.
9. Matrizes que ainda diziam “aguardando implementação” foram sincronizadas com o estado real e tiveram a terminologia técnica corrigida.
10. A Aula 026 passou a distinguir dígitos significativos de casas decimais, explicar a variação de `printf` por Locale e exigir arredondamento explícito ao converter cálculo decimal para centavos.
11. A Aula 030 passou a aplicar `Locale.US` no próprio `Scanner`, validar o token decimal completo nos simuladores e evitar a alteração global do Locale da aplicação.
12. Dois trechos Java sem cores na Aula 027 foram migrados para o mesmo destaque de sintaxe usado no restante do curso.

## Estado após a auditoria

- `refeita`: 24 aulas, de 000 a 023, já aprovadas pelo responsável;
- `em_revisao`: 16 aulas, de 024 a 039;
- `pendente`: 681 aulas, de 040 a 720;
- próxima aula ainda não reconstruída: **040 — Do While**.

## Validação visual pendente

A inspeção visual manual em navegador real continua pendente para desktop e larguras de 640, 360 e 320 px. O ambiente de navegador integrado não estava disponível nesta auditoria. Por isso nenhuma aula de 024 a 039 foi promovida para `refeita`.
