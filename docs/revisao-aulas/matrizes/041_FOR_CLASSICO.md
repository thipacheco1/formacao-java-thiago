# Matriz de cobertura — Aula 041

## Identificação

- Aula original: `docs/aulas/041_M1_21_FOR_CLASSICO_OFICIAL.md`
- Aula anterior: `docs/aulas/040_M1_20_DO_WHILE_OFICIAL.md`
- Aula posterior: `docs/aulas/042_M1_22_BREAK_E_CONTINUE_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedForClassicLesson041.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedForClassicLesson.css`
- Arquétipo: oficina de repetição controlada com animador do ciclo do `for`, laboratório de fronteiras, simulador de acumulador, galeria de padrões e clínica de erros.
- Estado: implementada e tecnicamente validada em 2026-07-17; permanece `em_revisao` até inspeção visual e aprovação do responsável.
- Correção pós-auditoria: roteiro ampliado para sete etapas; clínica e entrega/desafio são competências independentes. Foram repostos comparação `while` × `for`, contagem de pares, classificação de produtos, mensageria/auditoria e o alerta de bloco com responsabilidades demais.

## Transformação da aula

O aluno começa vendo o `for` como uma linha compacta. Termina capaz de narrar sua ordem real, desenhar início/limite/passo coerentes, provar fronteiras e quantidade de iterações, separar contador de acumulador, escolher a estrutura adequada e diagnosticar `off-by-one` ou loop infinito pela evidência.

## Fronteiras curriculares

- A Aula 040 ensinou pós-teste com `do while`, menus e sentinelas.
- A Aula 041 introduz repetição controlada por início, condição e atualização reunidos no cabeçalho.
- `break` e `continue` são apenas reconhecidos; a Aula 042 trata parada e salto em profundidade.
- Arrays, coleções, enhanced for, streams e otimização permanecem fora do escopo.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Conceito de repetição controlada | Cabeçalho, animador e primeiro programa | Início, condição e atualização aparecem como três regiões ligadas ao ciclo. |
| Sintaxe `for (inicializacao; condicao; atualizacao)` | Animador passo a passo | Cada parte fica ativa somente quando realmente executa. |
| Ordem de execução | Animador do motor do `for` | Inicialização uma vez; condição, bloco, atualização e novo teste até `false`. |
| Primeiro programa, `javac` e `java` | Laboratório `Main.java` | Saída `Contador: 1` até `5` e `Fim do programa`; compilação silenciosa explicada. |
| Comparação com `while` e escolha de estrutura | Nota de decisão e clínica | Menu escrito como `for (; opcao != 0;)` é diagnosticado como intenção mal comunicada. |
| Crescente e decrescente | Galeria “Crescente e decrescente” | Saídas 1→5 e 5→1 com condição e direção coerentes. |
| Contagem começando em zero e zero-based | Laboratório de fronteiras | `0; i < 5` produz 0, 1, 2, 3, 4 em cinco iterações. |
| `<` versus `<=` e `off-by-one` | Laboratório de fronteiras + clínica | Primeiro, último e total mudam imediatamente ao trocar o operador. |
| Vocabulário: iteração, índice, limite, passo, escopo | Narrativa, rótulos e evidências | Termos aparecem vinculados ao estado real, não como glossário isolado. |
| Uso de `i` e nomes de domínio | Galeria “Paginação e tentativas” | `pagina`, `tentativa`, `parcela` e `registro` comunicam a regra. |
| Escopo do contador | Nota de escopo e clínica | Erro `cannot find symbol` e decisão de declarar acumulador antes do loop. |
| Acumulador | Simulador contador × total | Evolução 1, 3, 6, 10, 15 por iteração. |
| Contagem de pares e módulo | Galeria “Contando pares” e desafio de parcelas | `1..10` produz cinco pares; múltiplos de 3 transferem `%` e contadores separados. |
| Passo maior que 1 | Galeria “Passo maior” | Sequência 5, 10, ... 50 com `numero += 5`. |
| Scanner com quantidade e soma | Galeria “Scanner e soma” | Quantidade 3, valores 4/5/6 e total 15. |
| Lote, sucesso e erro | Galeria “Lote e resultado” | Quatro sucessos + um erro = cinco registros processados. |
| Tentativas, paginação, mensageria e auditoria | Galerias “Paginação e tentativas” e “Mensageria e auditoria” | Contadores de domínio, comandos e saídas permanecem observáveis. |
| Produto, pedido, total e parcelas | Galeria “Pedido e parcelas” e desafio | Total em centavos, quantidade conhecida e contadores por faixa. |
| Duas variáveis no cabeçalho | Galeria “Duas variáveis” | Saída 1/5, 2/4, 3/3, acompanhada do alerta de legibilidade. |
| Condição de fronteira e contagem de iterações | Laboratório dedicado | A interface mostra quantidade, primeiro e último valor para cada combinação. |
| `break` e `continue` em nível inicial | Galeria “break e continue”, nota curricular e clínica | Saída `1, 2, 4`; são reconhecidos sem substituir uma condição de loop conhecida. |
| `for (;;)` infinito explícito | Nota de fronteira curricular | A sintaxe é reconhecida como infinita e exige motivo e saída controlada. |
| Loop infinito explícito ou por direção errada | Clínica de erros | Atualização ausente e decremento incompatível mostram sintomas e correções. |
| Dez erros comuns | Clínica com dez casos | Cada falha contém código, sintoma, causa e recuperação. |
| Debug das iterações | Animador do ciclo | Estado `contador = 4` mostra a condição falsa e o término sem executar o bloco. |
| Atividade guiada, diário e commit | Entrega em quatro estágios | Criação, compilação, prova de fronteiras, staged diff, commit e proteção contra `.class`. |
| Critério de conclusão | Checklist copiável, progressão e desafio | Conclusão por etapa, conclusão única da aula e próxima aula bloqueada. |

## Repetições consolidadas sem perda de conteúdo

- Processamento de lote, mensageria, auditoria, produtos e tentativas compartilham a mesma estrutura de quantidade conhecida; a galeria preserva as diferenças de estado e nomenclatura sem repetir páginas inteiras.
- Total de pedido e parcelas foram agrupados por acumulador monetário em centavos.
- Crescente, decrescente, zero-based e múltiplos foram distribuídos entre o laboratório de fronteiras e a galeria, evitando quatro explicações idênticas do cabeçalho.
- `break` e `continue` aparecem somente no limite necessário para preparar a Aula 042, sem antecipar a profundidade posterior.

## Saídas, precisão e recuperação

- O animador representa o contrato observável da linguagem; não atribui a execução a Stack, Heap, CPU ou endereços fictícios.
- `javac` sem mensagem é apresentado como sucesso, sem fabricar confirmação.
- A clínica separa erro de compilação, loop infinito, salto de valores e intenção estrutural ruim.
- O laboratório ensina a provar primeiro valor, último valor e total de iterações antes de usar índices em arrays.
- Valores monetários do desafio usam `long` em centavos; não introduzem `double` para dinheiro.

## Responsividade e padrão compartilhado

- A raiz mantém `overflow: visible` e não sobrescreve `.guided-step-nav`.
- Animador, terminal, fronteiras, acumulador, galeria, clínica e entrega usam `minmax(0, ...)`, `min-width: 0` e reorganização em 1024, 760 e 520 px.
- Código e terminal contêm o próprio overflow; o documento não depende de rolagem horizontal.
- A troca de etapa usa o âncora exato de `.guided-layout`; o foco horizontal móvel continua no componente compartilhado.
- Persistência, normalização de estado antigo, marcar/desmarcar etapa, conclusão única e bloqueio da próxima aula seguem o blueprint.

## Validação

- `npm.cmd run lint --prefix plataforma-curso`
- `npm.cmd run build --prefix plataforma-curso`
- `git diff --check` nos arquivos da Aula 041 e documentos atualizados
- Integração por prefixo exato `041_` conferida em `MarkdownViewer.jsx`
- Estado mantido como `em_revisao`; inspeção visual e aprovação explícita ainda são necessárias.
