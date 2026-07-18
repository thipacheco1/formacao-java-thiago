# Matriz de cobertura — Aula 024

## Identificação

- Aula original: `docs/aulas/024_M1_04_VARIAVEIS_E_NOMES_PROFISSIONAIS_OFICIAL.md`
- Aula anterior lida integralmente: `docs/aulas/023_M1_03_COMENTARIOS_UTEIS_E_DOCUMENTACAO_INICIAL_OFICIAL.md`
- Aula posterior lida integralmente: `docs/aulas/025_M1_05_TIPOS_INTEIROS_EM_JAVA_OFICIAL.md`
- Experiência nova: `plataforma-curso/src/components/GuidedVariablesLesson024.jsx`
- Estilos próprios: `plataforma-curso/src/components/guidedVariablesLesson.css`
- Arquétipo: oficina visual de estado nomeado com ciclo de vida, refatoração segura e diagnóstico de compilação
- Estado: implementada e tecnicamente validada; permanece `em_revisao` até inspeção visual e aprovação do responsável.

## Fronteiras curriculares

- A Aula 023 já ensinou que nomes claros reduzem comentários. A Aula 024 transforma esse princípio em declaração, atribuição, alteração e refatoração segura.
- A Aula 025 ensinará limites de `byte`, `short`, `int`, `long`, overflow e sufixo `L`. A Aula 024 usa `int` apenas como tipo inteiro inicial e não antecipa faixas nem overflow.
- `String`, `double`, `boolean` e `char` aparecem somente para reconhecer forma, valor compatível e nome; suas limitações e usos profundos ficam nas aulas próprias.
- Escopo é apresentado apenas como a fronteira visível do bloco local. Aprofundamento de parâmetros, atributos, instância, `static` e shadowing fica para depois.
- `==`, concatenação, casting e wrappers são apenas sinalizados quando necessários; não viram assuntos paralelos.

## Inventário integral e destino didático

| Conteúdo ou intenção original | Destino na reconstrução | Evidência observável |
|---|---|---|
| Variável guarda informação com nome | Mapa “tipo → nome → valor” | Aluno seleciona cada parte de `int idade = 30;`. |
| Metáfora da etiqueta | Mapa visual de estado nomeado | Valor aparece dentro de uma caixa identificada, sem fingir endereço de memória. |
| Guardar dados, reduzir repetição, representar estado e domínio | Comparador literal versus variável | Uma alteração atualiza todos os usos nomeados. |
| Declaração | Laboratório de ciclo de vida | `int quantidade;` cria nome e tipo sem valor utilizável. |
| Atribuição e leitura “recebe” | Laboratório de ciclo de vida | Fluxo visual direita → esquerda e saída explicada. |
| Declaração com inicialização | Laboratório de ciclo de vida | `int quantidade = 10;` produz estado utilizável. |
| Alteração/reatribuição | Linha do tempo e programa de status | Console mostra valor anterior e posterior. |
| Tipo aparece só na declaração | Comparador declaração/redeclaração | Segunda ocorrência com tipo falha; apenas o nome altera. |
| Variável local no `main` | Mapa de bloco | Chaves delimitam existência e uso nesta aula. |
| Local precisa ser declarada e inicializada antes do uso | Clínica de erros | Diagnóstico do compilador, causa, correção e nova prova. |
| Java fortemente tipado | Laboratório de compatibilidade | Valores aceitos e rejeitados por forma/tipo. |
| Sintaxe `tipo nome = valor;` | Anatomia selecionável | Tipo, identificador, operador, valor e `;` explicados. |
| Prévia de `String`, `int`, `double`, `boolean`, `char` | Seletor de tipos | Código, forma literal, saída e limite curricular. |
| Aspas duplas para `String` | Seletor e clínica | `"Cliente"` aceito; aspas simples rejeitadas. |
| Aspas simples para `char` e apenas um caractere | Seletor e clínica | `'A'` aceito; `"A"` e `'AB'` diagnosticados. |
| Decimal usa ponto | Seletor de tipos | `199.90` aparece como forma Java; vírgula é marcada inválida. |
| `boolean` usa `true`/`false` sem aspas e minúsculos | Seletor e laboratório booleano | Pergunta de domínio muda valor e saída. |
| `int` sem aspas | Seletor de tipos | `10` comparado a `"10"`. |
| Nomes profissionais | Laboratório de revisão | Casos ruins são renomeados com justificativa. |
| `camelCase` | Construtor de nome | Palavras são convertidas para identificador válido e legível. |
| Evitar PascalCase, snake_case, hífen, espaço e caixa total | Classificador de nomes | Cada forma recebe motivo de padrão ou erro sintático. |
| Nome revela intenção | Revisão de casos de domínio | Valor, alcance e unidade orientam o nome. |
| Evitar abreviações vagas | Revisão de nomes | `n`, `qtd`, `v`, `s` e `c` ganham alternativas explícitas. |
| Cuidado com `flag` | Laboratório booleano | Nome passa a soar como pergunta respondida por verdadeiro/falso. |
| `status` normalmente não é booleano | Laboratório booleano | `statusPedido` textual é separado de `pedidoPendente`. |
| Variável temporária útil | Laboratório de cálculo | `valorTotalPedido` dá nome à regra intermediária. |
| Variável temporária inútil | Comparador | `b = a` sem nova intenção é removida. |
| `=` não é igualdade; `==` virá depois | Anatomia e linha do tempo | Leitura direita → esquerda usa “recebe”. |
| Uso antes da declaração | Clínica | Erro, causa, correção e recompilação. |
| Local declarada sem valor | Clínica | `variable ... might not have been initialized`. |
| Duas locais com mesmo nome no bloco | Clínica | Redeclaração comparada a reatribuição. |
| Tipo incompatível | Clínica | Texto em `int` e texto em `boolean` são diagnosticados. |
| Palavra reservada | Clínica | `class` é rejeitado e substituído por nome com intenção. |
| Identificador com acento | Clínica de padrão | Distinguido de erro sintático: pode ser aceito, mas é evitado por padrão de time. |
| Concatenação simples com `+` | Programas e console | Rótulo e valor aparecem na saída. |
| Exemplo mínimo completo | Laboratório de código | `Main.java` compila e imprime três valores nomeados. |
| Ordem de serviço | Galeria de domínio | Código destacado e saída prevista. |
| Pedido | Galeria de domínio | Cinco variáveis nomeadas e ausência de comentário óbvio. |
| Auditoria | Galeria de domínio | Nomes longos comparados a letras vagas. |
| Cálculo de pedido | Laboratório temporário | Entradas e resultado intermediário observáveis. |
| Dez erros comuns | Clínica navegável | Dez diagnósticos com sintoma, causa e reparo. |
| Cinco arquivos da atividade | Laboratório final | Criação, compilação e execução nominal. |
| Quebrar erros de propósito | Clínica + entrega | Aluno reproduz e corrige antes do commit. |
| `Shift + F6` | Mock do IntelliJ | Renomeação segura atualiza declaração e usos relacionados. |
| Git e `.class` fora do commit | Entrega | `status`, `diff`, stage nominal, staged diff e árvore limpa. |
| Diário de bordo | Documento de evidências | Checklist copiável com decisões e resultados reais. |
| Critério de conclusão | Desafio final e gate de etapas | Critérios objetivos cobrem conceito, prática, erro e entrega. |

## Repetições consolidadas

- As definições repetidas de declaração, atribuição, inicialização e alteração viram uma única linha do tempo interativa.
- Os exemplos de tipos permanecem como uma prévia comparativa, sem repetir a profundidade reservada às aulas 025–029.
- As listas de nomes bons e ruins são absorvidas por revisão, classificador e refatoração segura; cada bloco pratica uma decisão diferente.
- Os três domínios corporativos e o cálculo permanecem, mas compartilham uma galeria única com código e saída.
- Os dez erros mantêm categorias próprias porque mudam sintoma, causa ou correção.

## Lacunas resolvidas

- Atribuição deixa de ser uma frase abstrata: a direção do valor até o nome é mostrada antes e depois da execução.
- Declaração sem inicialização não é apresentada como estado pronto; o laboratório distingue “declarada” de “utilizável”.
- Mensagens de compilação relevantes passam a aparecer com linha, causa e confirmação posterior.
- `Shift + F6` ganha um mock com declaração e usos sincronizados, sem fingir screenshot oficial do IntelliJ.
- Os comandos finais possuem saída e interpretação, inclusive o silêncio esperado do `javac`.
- Identificador Unicode é separado de recomendação de equipe: acento pode ser válido, mas continua inadequado para o padrão adotado.

## Recursos planejados

- Anatomia interativa de `tipo nome = valor;`.
- Linha do tempo de declaração, inicialização, uso e reatribuição.
- Comparador de repetição literal versus estado nomeado.
- Prévia controlada de cinco tipos sem antecipar suas aulas profundas.
- Construtor e classificador de nomes `camelCase`.
- Laboratório de nomes booleanos como perguntas.
- Galeria de quatro programas de domínio e cálculo.
- Mock do IntelliJ para Rename/`Shift + F6`.
- Clínica de dez erros com mensagens e recuperação.
- Terminal de entrega, documento de evidências e desafio de transferência.

## Validação

- [x] Aula original lida integralmente.
- [x] Aula anterior lida integralmente.
- [x] Aula posterior lida integralmente.
- [x] Todo conteúdo único possui destino.
- [x] Componente e CSS implementados.
- [x] Roteamento integrado.
- [x] Lint sem alertas.
- [x] Dois builds completos de produção.
- [x] `git diff --check` no escopo.
- [x] JSON e cronograma atualizados após a auditoria do bloco, com 24 aprovadas, 16 em revisão e 681 pendentes.
- [ ] Inspeção visual desktop em navegador real.
- [ ] Inspeção visual mobile em navegador real.
- [ ] Aprovação explícita do responsável.
