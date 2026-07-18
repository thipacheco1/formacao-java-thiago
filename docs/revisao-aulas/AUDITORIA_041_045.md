# Auditoria pedagógica e estrutural — Aulas 041 a 045

## Estado desta auditoria

- Data: 2026-07-17
- Escopo: aulas 041, 042, 043, 044 e 045.
- Fontes comparadas: aula original integral, componente guiado, CSS próprio, matriz de cobertura, estado e padrão estabelecido até a Aula 040.
- Objetivo: verificar preservação de conteúdo, profundidade, experiência guiada, evidências, progressão e fidelidade da documentação.
- Resultado original: **reprovação da faixa 041–045 como padrão definitivo**.
- Estado após correção: componentes e matrizes corrigidos em 2026-07-17; continuam `em_revisao` até inspeção visual e aprovação do responsável.

## Registro da correção executada

| Aula | Estrutura corrigida | Conteúdo reposto |
|---|---|---|
| 041 | 7 etapas; clínica e entrega independentes | `while` × `for`, pares, produtos, mensageria/auditoria e limite de responsabilidades no bloco. |
| 042 | 7 etapas; clínica e entrega independentes | `break`/`continue` em `while` e `do while`, filtro Scanner, menu explícito, salto interno, mensageria, auditoria, produto e pagamento. |
| 043 | 7 etapas; clínica e entrega independentes | parada externa com flag, agenda, formas/parcelas e cliente/pedido/item com totais por nível. |
| 044 | 7 etapas; clínica e entrega independentes | `if`/`while`/`do while`, menu booleano, status com `switch` e auditoria. |
| 045 | 7 etapas; clínica e entrega independentes | sintaxes de array, `double[]`, padrões numéricos, leitura em duas fases e leitura com soma. |

O progresso antigo não conclui automaticamente as duas novas competências: na Aula 041, o antigo tópico `diagnostico` preserva somente a clínica; nas aulas 042–045, o antigo tópico `entrega` preserva somente a entrega e a nova clínica permanece pendente. IDs desconhecidos são removidos na leitura do armazenamento local.

## Conclusão executiva

A preocupação do responsável é procedente. A partir da Aula 041 foi aplicada uma fórmula artificial de seis etapas:

1. quatro etapas fundamentais;
2. uma galeria ampla de padrões;
3. uma etapa final reunindo clínica, entrega, diário, Git e desafio.

O número seis não nasceu da necessidade pedagógica de cada assunto. Ele virou uma restrição informal e produziu três problemas:

- a clínica deixou de ser uma etapa avaliável no roteiro;
- entrega e desafio deixaram de ser uma etapa própria;
- exemplos originais foram comprimidos em galerias, notas ou frases além do que o blueprint permite.

Não houve perda total do núcleo técnico das cinco aulas. Contudo, houve perda de **tratamento guiado**, perda de exemplos únicos e documentação que declara cobertura maior do que a implementação real. Portanto, não é correto afirmar que todo o conteúdo e profundidade foram preservados.

## Falha estrutural comum

| Aula | Estrutura final atual | Problema |
|---|---|---|
| 040 | `Diagnóstico` + `Entrega e desafio` | Referência correta: duas etapas distintas. |
| 041 | `Diagnóstico e entrega` | Clínica, laboratório, diário, Git e desafio em uma etapa de 22 min. |
| 042 | `Diagnóstico e entrega` | Dez casos, entrega e desafio em uma etapa de 24 min. |
| 043 | `Diagnóstico e entrega` | Dez casos, quatro estágios de entrega e desafio em uma etapa de 24 min. |
| 044 | `Diagnóstico e entrega` | Dez casos, entrega e desafio em uma etapa de 24 min. |
| 045 | `Diagnóstico e entrega` | Dez casos, entrega e desafio em uma etapa de 26 min. |

Consequências:

- o aluno pode marcar uma única etapa e declarar concluídos três trabalhos diferentes;
- o roteiro não mostra claramente que diagnosticar, entregar e transferir conhecimento são competências distintas;
- o último tópico fica desproporcionalmente maior que os anteriores;
- o progresso deixa de representar o trabalho real;
- a experiência se afasta do padrão aprovado na Aula 040.

Regra de correção: não existe quantidade fixa de tópicos. Cada aula deve ter quantas etapas forem necessárias. Clínica de erros e entrega/desafio devem voltar a ser etapas próprias sempre que ambas existirem.

## Aula 041 — For Clássico

### O que ficou forte

- animador da ordem real do `for`;
- primeiro programa com comando e saída;
- laboratório de início, operador, limite, primeiro, último e quantidade;
- separação visual entre contador e acumulador;
- crescente, decrescente, passo 5, Scanner, lote, paginação, tentativas, parcelas, duas variáveis, `break` e `continue` inicial;
- dez diagnósticos coerentes;
- desafio com resultado numérico verificável.

### Conteúdo comprimido de forma aceitável

- repetição simples, tentativas, paginação e auditoria compartilham o mesmo mecanismo de quantidade conhecida;
- processamento de lote simples pode ser absorvido pelo lote com sucesso/erro;
- `i += 2` e `i += 5` podem compartilhar uma explicação sobre passo maior que um, desde que os dois efeitos sejam demonstrados ou testados.

### Lacunas e perdas reais

1. **Contagem de pares não existe como prática guiada.** O original possui `ContadorParesFor.java`, módulo, condição e contador com saída `Quantidade de pares: 5`. A matriz afirma “galeria e desafio”, mas a galeria não possui esse exemplo; o desafio usa múltiplos de 3 e não substitui a explicação guiada.
2. **Classificação de produtos ativos e inativos desapareceu.** O original aplica paridade, boolean e dois contadores. Nenhuma aba reproduz esse comportamento.
3. **Comparação `while` × `for` foi reduzida a uma nota.** O original coloca as duas implementações lado a lado e mostra onde ficam inicialização, condição e atualização. A nova aula só oferece a regra verbal.
4. **Bloco do `for` excessivamente complexo foi removido.** O original ensina que validação, cálculo, consulta, envio, registro e formatação no mesmo loop indicam futura extração de métodos.
5. **Mensageria e auditoria aparecem na matriz como preservadas em galeria, mas não há código ou saída própria desses domínios no componente.** Podem ser consolidadas, mas a documentação atual não pode afirmar uma evidência inexistente.
6. **A entrega compila somente um subconjunto sem declarar claramente quais exemplos consolidados substituem os arquivos omitidos.** Isso reduz a rastreabilidade entre original, prática e evidência.

### Veredito

Núcleo técnico preservado, mas com perda moderada de aplicações e de comparação guiada. Precisa ganhar uma etapa própria de clínica, uma de entrega/desafio e recuperar pares, produto e a comparação estrutural com `while`.

## Aula 042 — Break e Continue

### O que ficou forte

- contraste visual imediato entre parar e pular;
- dois programas mínimos com saídas corretas;
- simulador de lote com válido, inválido e falha crítica;
- laboratório do `continue` perigoso em `while`;
- busca, item cancelado, falha crítica, filtro, Scanner/sentinela e `switch` dentro de `for`;
- regra de registrar causa e itens ignorados;
- dez diagnósticos coerentes.

### Lacunas e perdas reais

1. **`break` em `while` não possui código guiado nem saída.** O original tem `BreakWhile.java`; o componente só aprofunda `continue` em `while`.
2. **`break` em `do while` foi removido.** A matriz afirma cobertura de `break`/`continue` em `do while`, mas a galeria mostra somente `continue` nesse tipo de laço.
3. **`continue` em loop interno foi removido da demonstração.** A aba “Loop interno” mostra apenas `break`. A matriz afirma que `continue` interno produz 1 e 3, porém essa evidência não existe no componente 042.
4. **Menu com `while (true)` + `break` e comparação com condição explícita desapareceram.** Esse é um julgamento de legibilidade único, não somente outro exemplo de `break`.
5. **Mensageria sem telefone foi removida.** Existe a falha global de mensageria, mas não o contraponto local do mesmo domínio.
6. **Auditoria com duplicados foi removida.** A matriz menciona auditoria genericamente sem código ou saída correspondente.
7. **Produto inativo foi removido.** O domínio é listado no critério original, mas não existe na galeria ou desafio.
8. **Pagamento inválido versus conta contábil indisponível foi removido.** O par era importante para comparar `continue` e `break` no mesmo domínio.
9. **Scanner para somar somente valores válidos foi absorvido pelo caso 999/negativo sem explicitar a versão sem sentinela.** A combinação é útil, mas não substitui totalmente o exercício de filtro puro.
10. **A matriz de cobertura contém afirmações falsas.** Ela declara `break` em `do while`, `continue` interno e aplicações que o componente não apresenta.

### Veredito

É a aula mais comprometida da faixa. O núcleo “parar × pular” existe, mas a cobertura por tipo de laço, alcance e comparação de domínios ficou incompleta. Exige reconstrução parcial, não apenas reorganização do roteiro.

## Aula 043 — Laços Aninhados

### O que ficou forte

- grade passo a passo e reinício do loop interno;
- programa 3 × 3 com saída completa;
- simulador real de multiplicação de custo;
- acumuladores por pedido e geral;
- `print` × `println`, tabuada, cliente/pedido, pedido/item, OS/checklist, página/item, mensagem/tentativa, permissões e menu/submenu;
- comparação visual entre `break` e `continue` internos;
- dez diagnósticos consistentes;
- desafio de três níveis com totais por ordem, centro e geral.

### Lacunas e compressões indevidas

1. **Parada do processamento externo com variável booleana não foi demonstrada.** O original possui `PararProcessamentoExterno.java`; a nova aula apenas recomenda flag em nota e correção de erro, sem código completo, estado e saída.
2. **Agenda foi reduzida ao nome de uma aba e a uma frase.** O código exibido trata permissões; não há exemplo observável de agenda.
3. **Combinações de pagamento foram reduzidas a uma frase de equivalência.** Se forem consolidadas, a matriz precisa registrar explicitamente que a competência é o produto cartesiano, não afirmar que o domínio foi demonstrado.
4. **Relatório de cliente/pedido/item não aparece como prática guiada completa.** A estrutura de três níveis existe em OS/checklist e no desafio, mas totais por cliente/pedido/geral merecem um estado visual próprio ou uma transferência explicitamente orientada.
5. **A clínica e a entrega continuam indevidamente fundidas.** Mesmo sendo a aula mais bem preservada das cinco, a última etapa continua sobrecarregada.

### Veredito

É a melhor aula da faixa 041–045. Precisa de correção estrutural e reposição da parada externa com flag; os demais domínios podem permanecer consolidados se a matriz deixar de prometer demonstrações que não existem.

## Aula 044 — Validação de Entrada

### O que ficou forte

- pipeline `ler → normalizar → validar → processar`;
- separação explícita entre erro lógico e falha técnica de leitura;
- console com -1, 0 e 5;
- simulador de `nextInt()` seguido de `nextLine()`;
- comparação “todos os erros × primeiro erro”;
- faixa/menu, nome, status, senha/CPF, pedido/pagamento, produto/estoque, OS/mensageria e tentativas;
- limites didáticos de e-mail, CPF e telefone declarados;
- dez diagnósticos consistentes.

### Lacunas e compressões indevidas

1. **`while` e `do while` não são demonstrados como duas implementações completas.** O fluxo principal usa `do while`; a diferença ficou apenas em nota, embora o original ensine as duas formas e seus critérios.
2. **Menu validado com boolean nomeado não possui implementação completa.** A aba usa prioridade e apenas recomenda `opcaoValida` em texto.
3. **`switch` moderno depois da validação não possui código e saída próprios.** A matriz chama de “insight”, mas o original contém uma aplicação completa de status.
4. **Auditoria validada foi removida.** A matriz agrupa cliente, OS, mensageria e auditoria, mas não existe código ou estado de auditoria no componente.
5. **Validação simples com `if` aparece principalmente como diagnóstico do que não bloqueia.** Falta um degrau guiado que mostre quando um `if` único é suficiente e quando é necessário repetir.
6. **Cliente, OS e mensageria foram comprimidos em padrões menores.** A consolidação é possível, mas deve preservar entradas, regras, mensagens e saída de cada competência, não apenas mencionar os domínios.
7. **Clínica, laboratório, diário, Git e desafio estão fundidos em uma única etapa.**

### Veredito

O núcleo conceitual está forte, mas há perda de implementações comparativas e de domínios declarados pela matriz. Precisa recuperar `while` × `do while`, boolean nomeado, `switch` pós-validação e auditoria, além da separação final.

## Aula 045 — Arrays de Números

### O que ficou forte

- mapa de memória editável com índice e valor;
- animador do `for` com condição, célula e console;
- comparação `< length` × `<= length`;
- painel reativo de soma, média, extremos e pares;
- pedidos em centavos, estoque, OS/ocorrências, mensageria/auditoria e preenchimento validado;
- dez diagnósticos coerentes;
- desafio de SLA com critérios verificáveis.

### Lacunas e compressões indevidas

1. **A sintaxe alternativa `int numeros[]` e a recomendação por `int[] numeros` desapareceram.** É uma nuance pequena, mas explicitamente ensinada no original.
2. **`double[]` não é demonstrado em código Java.** A matriz afirma declaração de `int[]`, `long[]` e `double[]`, mas o componente apresenta arrays Java de `int` e `long`; os cálculos reativos são JavaScript da interface, não código Java do aluno.
3. **Valores padrão de `long[]` e `double[]` não são demonstrados.** Apenas `new int[5]` e zeros aparecem em nota/clínica.
4. **Leitura e soma no mesmo loop não aparecem.** A matriz afirma cobertura em galeria, mas a aba de Scanner apenas preenche e valida.
5. **Leitura em dois loops não possui console ou programa completo.** Está reduzida a fragmento na galeria e critério de desafio.
6. **SLA está somente no desafio.** Isso pode servir como transferência, mas a matriz não deve descrevê-lo como exemplo guiado equivalente ao original.
7. **A entrega atual reduz a lista de programas sem mapear claramente quais evidências substituem os arquivos omitidos.**
8. **Clínica e entrega/desafio estão fundidos em uma etapa de 26 minutos.**

### Veredito

A visualização do mecanismo do array está boa, mas a cobertura Java ficou menor que a matriz declara. Precisa recuperar `double[]`, valores padrão por tipo, as duas estratégias de leitura/soma e a separação final.

## Divergências documentais confirmadas

As matrizes 041–045 foram usadas como prova de cobertura, mas algumas linhas descrevem destinos que não existem no componente. Exemplos confirmados:

- Aula 041: contagem de pares atribuída à galeria, embora não exista aba correspondente;
- Aula 042: `break` em `do while` e `continue` em loop interno declarados como demonstrados, mas ausentes;
- Aula 043: parada externa com boolean descrita como coberta sem programa completo ou saída;
- Aula 044: auditoria agrupada em galeria sem exemplo correspondente;
- Aula 045: `double[]` e soma durante preenchimento descritos como cobertos sem código Java correspondente.

Isso viola a função da matriz. A matriz deve registrar evidência real, não intenção ou equivalência presumida.

## Plano obrigatório de correção

### Fase 1 — corrigir a estrutura das cinco aulas

- remover a fórmula fixa de seis etapas;
- criar etapa própria `Clínica de erros`;
- criar etapa própria `Entrega e desafio`;
- recalcular durações e progresso;
- migrar o progresso local preservando etapas já concluídas, mas sem considerar automaticamente clínica e entrega como duas competências concluídas por causa do antigo tópico combinado.

### Fase 2 — repor conteúdo e profundidade

- 041: pares, produtos, comparação visual `while` × `for` e bloco excessivamente complexo;
- 042: `break`/`continue` completos em `while` e `do while`, menu explícito, continue interno, mensageria local/global, auditoria, produto e pagamento local/global;
- 043: parada externa com flag e evidência; revisar consolidações de agenda, combinações e relatórios;
- 044: comparação completa `while` × `do while`, menu booleano, switch pós-validação e auditoria;
- 045: sintaxes de declaração, `double[]`, valores padrão por tipo, leitura em duas fases e leitura+soma.

### Fase 3 — reconstruir as matrizes

- auditar cada linha contra um bloco, interação, código, saída ou desafio realmente existente;
- classificar claramente `demonstrado`, `praticado`, `transferido no desafio`, `consolidado` ou `fora do escopo`;
- proibir frases genéricas como “galeria de padrões” sem nome da aba e evidência verificável;
- registrar explicitamente toda consolidação e justificar por que nenhuma competência única foi perdida.

### Fase 4 — validação

- lint e build;
- `git diff --check` no escopo;
- inspeção de desktop, largura lateral, 640 px, 360 px e 320 px;
- verificar roteiro sticky e centralização móvel;
- testar progresso antigo e novo;
- aprovação visual e pedagógica do responsável antes de qualquer aula virar `refeita`.

## Regra nova para o blueprint

> A quantidade de etapas nasce da transformação pedagógica da aula. É proibido forçar todas as aulas a uma quantidade fixa. Quando a aula possuir clínica de erros e entrega/desafio, cada uma deve ser uma etapa independente no roteiro e no progresso. Uma matriz só pode declarar cobertura quando apontar para evidência real presente na experiência.

## Próximo passo

A correção técnica das aulas 041–045 foi concluída. Antes de retomar a Aula 046, falta a inspeção visual e pedagógica do responsável; nenhuma dessas aulas deve mudar de `em_revisao` para `refeita` automaticamente.
