# 713 - M20.43 - Live coding Java

## Apresentação da aula

Na aula 712, você realizou uma entrevista completa de arquitetura.

O trabalho anterior treinou:

- discovery;
- requisitos funcionais;
- requisitos não funcionais;
- constraints;
- assumptions;
- estimativas de capacidade;
- contexto do sistema;
- containers;
- componentes;
- boundaries;
- APIs;
- dados;
- consistência;
- transações;
- mensageria;
- integrações;
- segurança;
- observabilidade;
- escalabilidade;
- disponibilidade;
- cache;
- deployment;
- custos;
- trade-offs;
- evolução;
- defesa arquitetural.

Agora o foco muda do desenho amplo para a execução precisa em código.

Nesta aula, você realizará live coding em Java.

Live coding é diferente de programar sozinho.

Durante uma sessão ao vivo, o avaliador observa simultaneamente:

- entendimento do problema;
- qualidade das perguntas;
- clareza do raciocínio;
- escolha de estruturas de dados;
- domínio da linguagem;
- legibilidade;
- testes;
- análise de complexidade;
- capacidade de depurar;
- reação a mudanças;
- comunicação;
- postura diante de incertezas.

O objetivo não é digitar o código mais curto.

O objetivo é mostrar um processo confiável:

```text
entender;

perguntar;

modelar;

escolher;

implementar;

testar;

explicar;

refatorar.
```

Uma sessão fraca costuma começar assim:

```text
o candidato escuta metade do problema,
abre o editor,
escreve rapidamente
e descobre tarde
que entendeu a regra errada.
```

Uma sessão profissional começa assim:

```text
vou repetir o problema com minhas palavras;
depois confirmarei entradas,
saidas,
casos de borda
e restricoes;
em seguida proponho uma solucao simples,
analiso complexidade
e somente entao implemento.
```

Nesta aula, você trabalhará exercícios ligados ao contexto do OrderFlow, mas independentes o suficiente para uma entrevista.

Os temas serão:

- strings;
- arrays e listas;
- mapas e conjuntos;
- filas;
- pilhas;
- ordenação;
- intervalos;
- agrupamento;
- validação;
- modelagem de domínio;
- imutabilidade;
- records;
- sealed types;
- algoritmos;
- complexidade;
- testes;
- debugging;
- refatoração;
- comunicação.

A próxima aula será:

```text
714 - M20.44 - System design interview
```

Na aula 714, você realizará uma nova entrevista de system design com cenário aberto, pressão de tempo, mudanças de requisitos, desenho em níveis e defesa final.

Nesta aula, a banca completa de system design não será executada.

O laboratório será:

```text
labs/m20/aula-713-live-coding-Java/orderflow-live-coding
```

Regra central:

```text
live coding profissional
nao e correr para terminar;

e tornar o raciocinio
visivel,
testavel
e corrigivel.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
710:
Entrevista seguranca.

711:
Entrevista DevOps cloud.

712:
Entrevista arquitetura.

713:
Live coding Java.

714:
System design interview.

715:
Como ensinar o que aprendeu.
```

A aula 713 utiliza como fonte:

- fundamentos Java;
- collections;
- generics;
- records;
- sealed classes;
- exceptions;
- Streams;
- concorrência básica;
- testes;
- domínio do OrderFlow;
- value objects;
- estados;
- idempotência;
- eventos;
- respostas da aula 707;
- disciplina de comunicação da aula 712.

O código escrito nesta aula precisa ser simples o bastante para ser explicado e robusto o bastante para ser testado.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/live-coding-Java
├── LIVE_CODING_CHARTER.md
├── REQUIREMENT_CLARIFICATION_GUIDE.md
├── SOLUTION_COMMUNICATION_GUIDE.md
├── COMPLEXITY_GUIDE.md
├── EDGE_CASE_CATALOG.md
├── TEST_STRATEGY.md
├── DEBUGGING_GUIDE.md
├── REFACTORING_GUIDE.md
├── EXERCISE_01_WORD_FREQUENCY.md
├── EXERCISE_02_FIRST_UNIQUE_CHARACTER.md
├── EXERCISE_03_ORDER_DEDUPLICATION.md
├── EXERCISE_04_ORDER_GROUPING.md
├── EXERCISE_05_STATUS_TRANSITIONS.md
├── EXERCISE_06_INTERVAL_MERGE.md
├── EXERCISE_07_TOP_CUSTOMERS.md
├── EXERCISE_08_RETRY_SCHEDULE.md
├── EXERCISE_09_IDEMPOTENCY_WINDOW.md
├── EXERCISE_10_EVENT_RECONCILIATION.md
├── TIMED_SIMULATION.md
├── LIVE_CODING_SCORECARD.md
├── LIVE_CODING_REVIEW_CHECKLIST.md
├── LIVE_CODING_MATRIX.md
├── LIVE_CODING_RISK_REGISTER.md
├── LIVE_CODING_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Código:

```text
src/test/Java/com/orderflow/livecoding
├── WordFrequencyTest.java
├── FirstUniqueCharacterTest.java
├── OrderDeduplicationTest.java
├── OrderGroupingTest.java
├── StatusTransitionTest.java
├── IntervalMergeTest.java
├── TopCustomersTest.java
├── RetryScheduleTest.java
├── IdempotencyWindowTest.java
└── EventReconciliationTest.java
```

Scripts:

```text
scripts/live-coding-Java
├── run-all-exercises.ps1
├── run-timed-simulation.ps1
├── collect-live-coding-metrics.ps1
├── generate-live-coding-report.ps1
└── collect-live-coding-evidence.ps1
```

Artifacts:

```text
reports/live-coding-Java-report.yaml

contracts/live-coding-Java-evidence.yaml
```

---

## Conceito essencial

### Entendimento vem antes da solução

Uma implementação correta do problema errado continua errada.

### Solução simples vem antes da solução ótima

Comece com uma abordagem correta e melhore quando necessário.

### Complexidade precisa ser explicada

Não basta citar `O(n)`.

Explique qual é `n`, quais operações dominam e qual memória adicional foi usada.

### Teste faz parte da resposta

O código não está concluído quando apenas compila.

### Refatorar é demonstrar controle

Uma pequena melhoria após os testes mostra que você domina o código produzido.

---

## Mão na massa guiada

### 1. Criar Live Coding Charter

Arquivo:

```text
docs/live-coding-Java/LIVE_CODING_CHARTER.md
```

Princípios:

```text
clarify before coding;

start with a correct baseline;

name things explicitly;

test visible behavior;

discuss complexity;

admit uncertainty;

refactor after confidence;

system design belongs to lesson 714.
```

---

## Preparação do ambiente

### 2. Criar módulo de exercícios

Crie um módulo Maven simples para os exercícios.

---

### 3. Usar Java 21

Confirme:

```powershell
Java -version

javac -version
```

---

### 4. Configurar JUnit 5

Inclua JUnit Jupiter e Surefire compatível.

---

### 5. Criar package base

```Java
package com.orderflow.livecoding;
```

---

### 6. Manter dependências mínimas

Evite bibliotecas externas quando a linguagem padrão resolve.

---

### 7. Configurar execução rápida

O comando principal será:

```powershell
mvn test
```

---

### 8. Abrir terminal e editor lado a lado

O avaliador precisa acompanhar código e testes.

---

### 9. Desativar geração automática excessiva

Autocomplete pode ajudar, mas não deve esconder seu conhecimento.

---

### 10. Preparar relógio

Use blocos de:

- cinco minutos para entender;
- vinte minutos para implementar;
- dez minutos para testar;
- cinco minutos para refatorar.

---

## Clarificação de requisitos

### 11. Criar Requirement Clarification Guide

Arquivo:

```text
docs/live-coding-Java/REQUIREMENT_CLARIFICATION_GUIDE.md
```

---

### 12. Repetir o problema

Use:

```text
vou confirmar se entendi:
recebo X,
preciso produzir Y
e devo respeitar Z.
```

---

### 13. Confirmar entrada

Pergunte:

- pode ser nula?
- pode ser vazia?
- pode conter duplicados?
- há limite de tamanho?
- a ordem importa?
- caracteres são case-sensitive?

---

### 14. Confirmar saída

Pergunte:

- retorno vazio ou exception?
- ordem precisa ser preservada?
- empate possui regra?
- o resultado pode ser mutável?

---

### 15. Confirmar restrições

Descubra:

- tempo;
- memória;
- concorrência;
- volume;
- biblioteca permitida;
- API esperada.

---

### 16. Confirmar exemplos

Crie pelo menos um caso pequeno.

---

### 17. Identificar ambiguidade

Não escolha silenciosamente.

---

### 18. Registrar assumption

Quando o entrevistador não definir algo, diga sua escolha.

---

### 19. Evitar perguntas irrelevantes

Pergunte apenas o que pode mudar a solução.

---

### 20. Confirmar entendimento

Antes de codificar, obtenha concordância.

---

## Comunicação da solução

### 21. Criar Solution Communication Guide

Arquivo:

```text
docs/live-coding-Java/SOLUTION_COMMUNICATION_GUIDE.md
```

---

### 22. Descrever a abordagem

Exemplo:

```text
vou percorrer a lista uma vez,
usar um mapa para contar
e preservar a ordem com LinkedHashMap.
```

---

### 23. Explicar por que a estrutura foi escolhida

---

### 24. Explicar alternativa simples

---

### 25. Explicar alternativa otimizada

---

### 26. Escolher a abordagem proporcional

Não use heap, árvore ou graph quando um mapa resolve.

---

### 27. Narrar decisões importantes

Não narre cada caractere digitado.

---

### 28. Sinalizar mudança de plano

Diga por que mudou.

---

### 29. Pedir alguns segundos para pensar

Silêncio curto e consciente é aceitável.

---

### 30. Evitar fingir certeza

---

## Complexidade

### 31. Criar Complexity Guide

Arquivo:

```text
docs/live-coding-Java/COMPLEXITY_GUIDE.md
```

---

### 32. Definir `n`

Exemplo:

```text
n e a quantidade de pedidos.
```

---

### 33. Explicar tempo

Analise:

- loops;
- ordenação;
- busca;
- inserção;
- chamadas aninhadas.

---

### 34. Explicar espaço

Considere:

- mapas;
- conjuntos;
- listas auxiliares;
- recursão;
- cópias.

---

### 35. Distinguir média e pior caso

HashMap oferece custo médio próximo de constante, não garantia absoluta universal.

---

### 36. Explicar custo de sorting

Ordenação típica:

```text
O(n log n).
```

---

### 37. Explicar trade-off espaço-tempo

Mapa extra pode reduzir loops.

---

### 38. Evitar otimização prematura

---

## Casos de borda

### 39. Criar Edge Case Catalog

Arquivo:

```text
docs/live-coding-Java/EDGE_CASE_CATALOG.md
```

Categorias:

- nulo;
- vazio;
- um elemento;
- duplicados;
- todos iguais;
- ordenação;
- empate;
- overflow;
- valor negativo;
- caracteres especiais;
- datas;
- concorrência.

---

### 40. Selecionar casos relevantes

Não teste tudo mecanicamente.

---

### 41. Definir comportamento de nulo

Prefira contrato explícito.

---

### 42. Validar overflow

Somas financeiras não devem usar `double`.

---

### 43. Validar ordem estável

---

### 44. Validar dados imutáveis

---

## Estratégia de testes

### 45. Criar Test Strategy

Arquivo:

```text
docs/live-coding-Java/TEST_STRATEGY.md
```

---

### 46. Escrever primeiro o caso feliz

---

### 47. Escrever caso vazio

---

### 48. Escrever caso de borda principal

---

### 49. Escrever caso de erro

---

### 50. Nomear testes por comportamento

Exemplo:

```Java
void shouldPreserveFirstOccurrenceWhenRemovingDuplicates() {
}
```

---

### 51. Usar Arrange, Act, Assert

---

### 52. Não testar implementação interna

---

### 53. Executar testes frequentemente

---

### 54. Ler a falha antes de alterar código

---

### 55. Não apagar teste para passar

---

## Debugging

### 56. Criar Debugging Guide

Arquivo:

```text
docs/live-coding-Java/DEBUGGING_GUIDE.md
```

---

### 57. Reproduzir o erro

---

### 58. Reduzir o caso

---

### 59. Formular hipótese

---

### 60. Inspecionar valores

---

### 61. Usar breakpoint quando útil

---

### 62. Verificar boundary de loop

---

### 63. Verificar mutabilidade

---

### 64. Verificar igualdade

---

### 65. Corrigir uma causa por vez

---

### 66. Rodar regressão

---

## Refatoração

### 67. Criar Refactoring Guide

Arquivo:

```text
docs/live-coding-Java/REFACTORING_GUIDE.md
```

---

### 68. Refatorar somente após testes verdes

---

### 69. Melhorar nomes

---

### 70. Extrair método quando melhora leitura

---

### 71. Remover duplicação

---

### 72. Reduzir mutabilidade

---

### 73. Não criar abstração prematura

---

### 74. Reexecutar testes

---

## Exercício 1 — frequência de palavras

### 75. Criar Exercise 01

Arquivo:

```text
docs/live-coding-Java/EXERCISE_01_WORD_FREQUENCY.md
```

Problema:

```text
receber uma lista de palavras
e retornar a frequencia
preservando a ordem
da primeira aparicao.
```

---

### 76. Clarificar normalização

Defina trim e case.

---

### 77. Escolher LinkedHashMap

---

### 78. Implementar método

```Java
package com.orderflow.livecoding;

import Java.util.LinkedHashMap;
import Java.util.List;
import Java.util.Map;

public final class WordFrequency {

    private WordFrequency() {
    }

    public static Map<String, Long> count(List<String> words) {
        if (words == null) {
            throw new IllegalArgumentException("words must not be null");
        }

        Map<String, Long> result = new LinkedHashMap<>();

        for (String word : words) {
            if (word == null || word.isBlank()) {
                continue;
            }

            String normalized = word.trim().toLowerCase();
            result.merge(normalized, 1L, Long::sum);
        }

        return Map.copyOf(result);
    }
}
```

---

### 79. Discutir imutabilidade do retorno

`Map.copyOf` não garante preservação de implementação ordenada no contrato.

Se a ordem pública for obrigatória, retorne wrapper não modificável sobre `LinkedHashMap`.

---

### 80. Criar testes

---

### 81. Analisar complexidade

Tempo `O(n)` e espaço `O(k)` para `k` palavras distintas.

---

## Exercício 2 — primeiro caractere único

### 82. Criar Exercise 02

---

### 83. Clarificar Unicode

Para a sessão, defina se trabalha com `char` ou code point.

---

### 84. Criar duas passagens

Primeira conta.

Segunda encontra o primeiro com frequência um.

---

### 85. Testar vazio, repetidos e único

---

### 86. Explicar `LinkedHashMap` versus array de contagem

---

## Exercício 3 — remover pedidos duplicados

### 87. Criar Exercise 03

Problema:

```text
preservar a primeira ocorrencia
de cada OrderId.
```

---

### 88. Modelar OrderId como record

```Java
package com.orderflow.livecoding;

import Java.util.Objects;

public record OrderId(String value) {

    public OrderId {
        Objects.requireNonNull(value, "value");
        if (value.isBlank()) {
            throw new IllegalArgumentException("value must not be blank");
        }
    }
}
```

---

### 89. Usar HashSet para IDs vistos

---

### 90. Preservar ordem em ArrayList

---

### 91. Retornar lista imutável

---

### 92. Discutir igualdade do record

---

## Exercício 4 — agrupar pedidos por status

### 93. Criar Exercise 04

---

### 94. Modelar enum de status

---

### 95. Usar `EnumMap`

---

### 96. Decidir se grupos vazios aparecem

---

### 97. Criar versão imperativa

---

### 98. Criar versão com Streams

---

### 99. Comparar legibilidade

---

## Exercício 5 — validar transições

### 100. Criar Exercise 05

---

### 101. Definir estados permitidos

```text
CREATED -> RESERVED;

RESERVED -> PAID;

PAID -> FULFILLMENT_STARTED;

qualquer estado elegivel -> CANCELLED.
```

---

### 102. Modelar política explícita

---

### 103. Evitar `if` espalhado

---

### 104. Criar exception de domínio

---

### 105. Testar transição válida e inválida

---

### 106. Explicar complexidade constante

---

## Exercício 6 — mesclar intervalos

### 107. Criar Exercise 06

---

### 108. Clarificar se intervalos fechados se tocam

---

### 109. Ordenar pelo início

---

### 110. Percorrer e mesclar

---

### 111. Usar record `Interval`

---

### 112. Testar intervalos contidos

---

### 113. Analisar `O(n log n)`

---

## Exercício 7 — top clientes

### 114. Criar Exercise 07

Problema:

```text
encontrar os N clientes
com maior valor total de pedidos.
```

---

### 115. Usar BigDecimal

---

### 116. Agregar por cliente

---

### 117. Ordenar por total e desempate

---

### 118. Comparar sorting completo e heap

---

### 119. Tratar `N` inválido

---

### 120. Testar empate

---

## Exercício 8 — agenda de retry

### 121. Criar Exercise 08

---

### 122. Implementar exponential backoff

---

### 123. Adicionar limite máximo

---

### 124. Explicar jitter conceitualmente

---

### 125. Evitar overflow

---

### 126. Testar tentativas zero e altas

---

## Exercício 9 — janela de idempotência

### 127. Criar Exercise 09

Problema:

```text
aceitar uma operation key
somente se ela nao foi observada
dentro de uma janela.
```

---

### 128. Usar Map de chave para instante

---

### 129. Injetar Clock

---

### 130. Limpar entradas expiradas

---

### 131. Discutir concorrência

A solução em memória não serve como garantia distribuída.

---

### 132. Relacionar com persistência do OrderFlow

---

## Exercício 10 — reconciliar eventos

### 133. Criar Exercise 10

Problema:

```text
comparar eventos esperados
e processados,
retornando faltantes,
duplicados
e inesperados.
```

---

### 134. Definir identidade do evento

---

### 135. Contar ocorrências

---

### 136. Produzir resultado estruturado

Use sealed interface ou record composto.

---

### 137. Testar duplicidade

---

### 138. Explicar uso em diagnóstico

---

## Condução detalhada dos exercícios ao vivo

Os dez exercícios não devem ser tratados como uma lista para decorar.

Cada exercício precisa ser usado para treinar uma competência diferente do processo de entrevista.

### Frequência de palavras como exercício de contrato

Antes de implementar, explique que a estrutura depende do contrato.

Quando a ordem da primeira aparição é obrigatória, um `HashMap` isolado não comunica essa garantia. Um `LinkedHashMap` torna a intenção mais visível.

Pergunte também se:

- palavras nulas devem ser ignoradas ou rejeitadas;
- espaços devem ser removidos;
- letras maiúsculas e minúsculas representam a mesma palavra;
- o retorno precisa ser modificável;
- a lista pode possuir milhões de elementos.

Se o entrevistador disser que a entrada é muito grande, explique que o algoritmo continua linear, mas o mapa cresce com a quantidade de palavras distintas.

Não prometa processamento ilimitado.

### Primeiro caractere único como exercício de representação

A solução com `char` pode ser suficiente quando o contrato limita a entrada a caracteres básicos.

Quando o texto pode possuir emojis ou símbolos fora do plano básico, explique que um `char` representa uma unidade UTF-16, não necessariamente um caractere Unicode completo.

Você não precisa implementar code points se isso não fizer parte do escopo, mas precisa reconhecer a diferença.

Essa observação demonstra precisão sem transformar um exercício pequeno em uma solução excessiva.

### Deduplicação como exercício de igualdade

Ao remover pedidos duplicados, explique qual atributo define identidade.

Dois pedidos com o mesmo conteúdo não são necessariamente o mesmo pedido.

No OrderFlow, `OrderId` representa a identidade estável.

O `record` fornece `equals` e `hashCode` baseados nos componentes, mas a validação continua necessária no construtor compacto.

Teste:

- primeiro pedido preservado;
- pedido repetido removido;
- IDs diferentes mantidos;
- lista vazia;
- entrada nula conforme o contrato.

### Agrupamento como exercício de escolha da coleção

Quando a chave é um enum, `EnumMap` comunica melhor a intenção e possui implementação especializada.

Compare com `HashMap` sem afirmar que uma alternativa é sempre errada.

Confirme se o resultado precisa conter apenas estados presentes ou todos os estados possíveis.

Essa decisão muda os testes e o contrato público.

Na versão com Streams, evite um pipeline difícil de explicar.

Uma solução imperativa clara pode ser preferível sob pressão.

### Transições como exercício de domínio

A política de transição não deve ser espalhada por vários `if`.

Modele as relações permitidas em uma estrutura explícita.

Uma opção é:

```Java
package com.orderflow.livecoding;

import Java.util.EnumMap;
import Java.util.EnumSet;
import Java.util.Map;
import Java.util.Set;

public final class TransitionPolicy {

    private final Map<OrderStatus, Set<OrderStatus>> allowed;

    public TransitionPolicy() {
        Map<OrderStatus, Set<OrderStatus>> rules =
            new EnumMap<>(OrderStatus.class);

        rules.put(
            OrderStatus.CREATED,
            EnumSet.of(
                OrderStatus.RESERVED,
                OrderStatus.CANCELLED
            )
        );

        rules.put(
            OrderStatus.RESERVED,
            EnumSet.of(
                OrderStatus.PAID,
                OrderStatus.CANCELLED
            )
        );

        rules.put(
            OrderStatus.PAID,
            EnumSet.of(
                OrderStatus.FULFILLMENT_STARTED,
                OrderStatus.CANCELLED
            )
        );

        this.allowed = Map.copyOf(rules);
    }

    public boolean allows(
        OrderStatus current,
        OrderStatus target
    ) {
        return allowed
            .getOrDefault(current, Set.of())
            .contains(target);
    }
}
```

Durante a explicação, reconheça que uma estrutura fixa funciona bem para o exercício.

Em um domínio maior, a regra pode depender de dados, políticas e contexto.

### Intervalos como exercício de invariantes

Valide que o início não é maior que o fim.

Defina se intervalos adjacentes, como `[1, 3]` e `[4, 6]`, devem ser mesclados.

Para intervalos fechados inteiros, a regra de adjacência pode fazer sentido.

Para instantes de tempo, a semântica pode ser diferente.

Ordene uma cópia quando a entrada não deve ser modificada.

Explique que o custo dominante é a ordenação.

### Top clientes como exercício de precisão

Valores monetários usam `BigDecimal`.

Explique a política de escala e arredondamento quando houver divisão.

Para somar, utilize `BigDecimal.ZERO` e `add`.

O desempate precisa ser determinístico.

Exemplo:

- maior valor total primeiro;
- em empate, menor identificador do cliente.

Quando `N` é pequeno e o conjunto é enorme, um heap limitado pode reduzir o custo de ordenação completa.

Para uma entrevista curta, a versão com agregação e ordenação pode ser mais legível.

### Retry como exercício de limites numéricos

Exponential backoff cresce rapidamente.

Defina:

- atraso inicial;
- multiplicador;
- teto;
- quantidade máxima de tentativas;
- unidade de tempo.

Use operações que detectem overflow ou interrompa o crescimento ao atingir o teto.

Explique que jitter reduz sincronização entre clientes, mas não precisa ser aleatório de forma não testável.

Uma estratégia pode receber uma fonte de aleatoriedade injetada.

### Idempotência como exercício de tempo testável

Evite chamar `Instant.now()` diretamente no núcleo da solução.

Injete `Clock`.

Assim, o teste controla o tempo sem `sleep`.

Teste:

- primeira chave aceita;
- repetição dentro da janela rejeitada;
- repetição após expiração aceita;
- chaves diferentes independentes;
- limpeza de entradas antigas.

Declare que a versão em memória perde estado em restart e não coordena múltiplas instâncias.

No OrderFlow real, a garantia principal é persistente.

### Reconciliação como exercício de resultado rico

Um retorno booleano não explica o problema.

Modele um resultado com:

- faltantes;
- duplicados;
- inesperados.

Use coleções imutáveis no resultado.

Explique que reconciliação não corrige automaticamente.

Ela identifica divergências para uma política posterior.

## Mudança de requisito durante a sessão

O entrevistador pode alterar o problema depois da primeira solução.

Exemplos:

- a entrada passou a ser muito maior;
- a ordem agora precisa ser preservada;
- o método precisa ser thread-safe;
- o resultado precisa ser imutável;
- o processamento precisa ser incremental;
- a regra de empate mudou.

Não tente esconder que a primeira solução não atende ao novo cenário.

Responda em três etapas:

```text
a nova restricao muda este ponto;

a estrutura atual possui este limite;

eu alteraria a solucao desta forma.
```

Atualize primeiro os testes.

Depois modifique a implementação.

Essa ordem demonstra controle sobre o comportamento esperado.

## Comunicação quando o tempo está terminando

Quando faltarem poucos minutos, não abandone a comunicação.

Diga claramente:

- o que já funciona;
- quais testes passaram;
- qual caso ainda falta;
- qual risco permanece;
- qual seria a próxima alteração.

Uma entrega parcial, correta e bem explicada pode ser melhor do que uma solução maior sem testes.

Não declare que terminou quando o código não foi executado.

## Revisão final de cinco minutos

Reserve os minutos finais para:

- ler a assinatura pública;
- revisar nomes;
- remover prints;
- executar todos os testes;
- conferir mutabilidade;
- confirmar complexidade;
- comparar a solução com o requisito;
- resumir trade-offs.

O resumo final pode seguir:

```text
a solucao usa esta estrutura;

o tempo e este;

o espaco adicional e este;

os principais casos testados foram estes;

a principal limitacao e esta.
```


## Simulação cronometrada

### 139. Criar Timed Simulation

Arquivo:

```text
docs/live-coding-Java/TIMED_SIMULATION.md
```

Duração:

```text
90 minutos.
```

---

### 140. Bloco 1 — aquecimento

Quinze minutos para frequência de palavras.

---

### 141. Bloco 2 — domínio

Vinte minutos para transições.

---

### 142. Bloco 3 — algoritmo

Vinte e cinco minutos para intervalos.

---

### 143. Bloco 4 — debugging

Quinze minutos para corrigir código com falha.

---

### 144. Bloco 5 — refatoração

Quinze minutos para melhorar legibilidade.

---

### 145. Gravar tela e voz

---

### 146. Não pausar o relógio por erro

Simule pressão real.

---

## Scorecard

### 147. Criar Live Coding Scorecard

Arquivo:

```text
docs/live-coding-Java/LIVE_CODING_SCORECARD.md
```

Critérios de um a cinco:

- clarificação;
- modelagem;
- estrutura de dados;
- Java;
- legibilidade;
- testes;
- edge cases;
- complexidade;
- debugging;
- refatoração;
- comunicação;
- gestão de tempo;
- honestidade.

---

### 148. Criar Review Checklist

Arquivo:

```text
docs/live-coding-Java/LIVE_CODING_REVIEW_CHECKLIST.md
```

Perguntas:

- repeti o problema?
- confirmei entrada e saída?
- declarei assumptions?
- propus abordagem?
- escolhi estrutura adequada?
- testei?
- expliquei complexidade?
- corrigi com método?
- refatorei?
- evitei antecipar system design?

---

### 149. Criar Matrix

Arquivo:

```text
docs/live-coding-Java/LIVE_CODING_MATRIX.md
```

Colunas:

- exercício;
- requisito;
- solução;
- estrutura;
- tempo;
- espaço;
- testes;
- duração;
- score;
- revisão.

---

### 150. Criar Risk Register

Arquivo:

```text
docs/live-coding-Java/LIVE_CODING_RISK_REGISTER.md
```

Riscos:

```text
codificar sem entender;

silencio prolongado;

estrutura excessiva;

caso de borda ignorado;

teste ausente;

complexidade errada;

refatoracao antes da correcao;

uso excessivo de Stream;

system design antecipado;

feedback nao registrado.
```

---

### 151. Criar Traceability

Arquivo:

```text
docs/live-coding-Java/LIVE_CODING_TRACEABILITY.md
```

Exemplo:

```text
OrderId
-> value object
-> deduplication exercise
-> equality tests.

status transition
-> domain state machine
-> valid and invalid tests.

idempotency window
-> operation key
-> Clock
-> distributed limitation.
```

---

### 152. Criar boundary da próxima aula

Arquivo:

```text
docs/live-coding-Java/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 713 define:

- live coding process;
- requirement clarification;
- communication;
- complexity;
- edge cases;
- tests;
- debugging;
- refactoring;
- strings;
- collections;
- maps;
- sets;
- intervals;
- grouping;
- domain modeling;
- idempotency;
- reconciliation;
- timed simulation;
- live coding scorecard.

A aula 714 define:

- system design interview;
- open scenario;
- discovery;
- requirements;
- capacity;
- architecture diagrams;
- APIs;
- data;
- consistency;
- messaging;
- security;
- scalability;
- availability;
- cost;
- scenario changes;
- formal defense.

Nenhum system design interview completo
e executado nesta aula.
```

---

## Relatório e evidence

### 153. Criar report

Arquivo:

```text
reports/live-coding-Java-report.yaml
```

Exemplo:

```yaml
liveCodingJava:
  exercises:
    planned:
      10
    completed:
      measured
    passing:
      measured

  quality:
    clarificationScore:
      measured
    testScore:
      measured
    complexityScore:
      measured
    communicationScore:
      measured

  timing:
    totalMinutes:
      measured
    overtimeExercises:
      measured

  integrity:
    unsupportedClaims:
      0

  systemDesignInterview:
    completed:
      false

  gate:
    PASS
```

---

### 154. Criar evidence

Arquivo:

```text
contracts/live-coding-Java-evidence.yaml
```

Campos:

- lesson;
- project;
- exercise count;
- completed exercise count;
- passing exercise count;
- test count;
- failing test count;
- clarification score;
- modeling score;
- data structure score;
- Java score;
- readability score;
- edge case score;
- complexity score;
- debugging score;
- refactoring score;
- communication score;
- time management score;
- total duration;
- overtime exercise count;
- admitted uncertainty count;
- unsupported claim count;
- system design interview completed;
- documentation status;
- gate status;
- timestamp.

---

### 155. Criar gate

Status:

```text
PASS;

FAIL_ENVIRONMENT;

FAIL_REQUIREMENT_CLARIFICATION;

FAIL_SOLUTION_COMMUNICATION;

FAIL_COMPLEXITY;

FAIL_EDGE_CASES;

FAIL_TEST_STRATEGY;

FAIL_DEBUGGING;

FAIL_REFACTORING;

FAIL_EXERCISE_01;

FAIL_EXERCISE_02;

FAIL_EXERCISE_03;

FAIL_EXERCISE_04;

FAIL_EXERCISE_05;

FAIL_EXERCISE_06;

FAIL_EXERCISE_07;

FAIL_EXERCISE_08;

FAIL_EXERCISE_09;

FAIL_EXERCISE_10;

FAIL_TIMED_SIMULATION;

FAIL_TESTS;

FAIL_UNSUPPORTED_CLAIM;

FAIL_SYSTEM_DESIGN_ANTICIPATION;

INCONCLUSIVE.
```

---

### 156. Executar todos os testes

```powershell
.\scripts\live-coding-Java\run-all-exercises.ps1
```

---

### 157. Executar simulação

```powershell
.\scripts\live-coding-Java\run-timed-simulation.ps1
```

---

### 158. Coletar métricas

```powershell
.\scripts\live-coding-Java\collect-live-coding-metrics.ps1
```

---

### 159. Revisar gravação

Selecione:

- três boas clarificações;
- três momentos de silêncio;
- dois bugs;
- dois testes esquecidos;
- uma refatoração forte.

---

### 160. Repetir dois exercícios

Escolha o pior de algoritmo e o pior de domínio.

---

### 161. Encerrar o laboratório

Confirme:

- Charter;
- ambiente;
- clarificação;
- comunicação;
- complexidade;
- edge cases;
- testes;
- debugging;
- refatoração;
- dez exercícios;
- simulação cronometrada;
- gravação;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 714 preservada.

---

## Entendendo o que foi feito

### O raciocínio ficou visível

Perguntas e assumptions passaram a aparecer antes do código.

### Estruturas ganharam justificativa

Map, Set, EnumMap, queue e sorting foram escolhidos por comportamento.

### Testes viraram parte da implementação

O código deixou de depender de inspeção visual.

### Complexidade ganhou contexto

Tempo e memória passaram a ser explicados com base na entrada.

### Debugging ganhou método

Hipóteses substituíram alterações aleatórias.

### Refatoração ganhou segurança

Melhorias passaram a ocorrer após testes verdes.

### O domínio entrou nos exercícios

IDs, estados, idempotência e reconciliação aproximaram a prática do trabalho real.

### A pressão ganhou simulação

Relógio, gravação e scorecard tornaram a evolução observável.

---

## Erros comuns importantes

### Começar digitando

O problema pode ter sido entendido errado.

### Usar Stream para tudo

A solução pode ficar menos clara.

### Ignorar nulo sem contrato

O comportamento fica implícito.

### Criar abstração demais

O tempo termina antes da solução.

### Não explicar a estrutura

O avaliador não enxerga o critério.

### Testar apenas o caso feliz

Bugs permanecem.

### Corrigir sem reproduzir

A causa continua incerta.

### Refatorar durante falha

Mais variáveis são introduzidas.

### Inventar complexidade

A credibilidade diminui.

### Antecipar system design

Essa etapa pertence à aula 714.

---

## Comandos úteis

### Executar testes

```powershell
mvn test
```

### Executar exercício específico

```powershell
mvn `
  -Dtest=IntervalMergeTest `
  test
```

### Ver diff

```powershell
git diff
```

### Coletar evidence

```powershell
.\scripts\live-coding-Java\collect-live-coding-evidence.ps1
```

---

## Exercício principal

Realize uma sessão de 90 minutos com quatro blocos.

Inclua:

1. repetir requisito;
2. confirmar nulo;
3. confirmar vazio;
4. confirmar duplicidade;
5. confirmar ordem;
6. criar exemplo;
7. propor abordagem;
8. escolher estrutura;
9. explicar complexidade;
10. implementar frequência;
11. testar frequência;
12. implementar transição;
13. testar transição;
14. implementar intervalos;
15. testar intervalos;
16. corrigir bug;
17. executar regressão;
18. refatorar nomes;
19. remover duplicação;
20. revisar mutabilidade;
21. explicar trade-offs;
22. registrar tempo;
23. preencher scorecard;
24. revisar gravação;
25. repetir exercício fraco.

Não realize a banca completa de system design.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 712 e ponte para a aula 714 foram preservadas;
- Live Coding Charter foi criado;
- módulo Java 21 foi configurado;
- JUnit 5 foi configurado;
- dependências foram minimizadas;
- execução rápida foi preparada;
- relógio foi configurado;
- Requirement Clarification Guide foi criado;
- problema foi repetido;
- entrada, saída, restrições e exemplos foram confirmados;
- ambiguidades e assumptions foram registradas;
- perguntas irrelevantes foram evitadas;
- Solution Communication Guide foi criado;
- abordagem, estrutura, alternativas e mudanças foram explicadas;
- silêncio consciente foi permitido;
- certeza falsa foi evitada;
- Complexity Guide foi criado;
- `n`, tempo, espaço, média, pior caso, sorting e trade-off foram explicados;
- otimização prematura foi evitada;
- Edge Case Catalog foi criado;
- nulo, vazio, duplicados, empate, overflow, ordem e mutabilidade foram tratados;
- Test Strategy foi criada;
- caso feliz, vazio, borda e erro foram testados;
- testes receberam nomes comportamentais;
- Arrange, Act, Assert foi usado;
- implementação interna não foi testada;
- testes foram executados frequentemente;
- falhas foram lidas;
- testes não foram apagados;
- Debugging Guide foi criado;
- erro foi reproduzido e reduzido;
- hipótese foi formulada;
- valores, loops, mutabilidade e igualdade foram verificados;
- uma causa por vez foi corrigida;
- regressão foi executada;
- Refactoring Guide foi criado;
- refatoração ocorreu com testes verdes;
- nomes, métodos, duplicação e mutabilidade foram melhorados;
- abstração prematura foi evitada;
- Exercise 01 foi criado e testado;
- Exercise 02 foi criado e testado;
- Exercise 03 foi criado e testado;
- Exercise 04 foi criado e testado;
- Exercise 05 foi criado e testado;
- Exercise 06 foi criado e testado;
- Exercise 07 foi criado e testado;
- Exercise 08 foi criado e testado;
- Exercise 09 foi criado e testado;
- Exercise 10 foi criado e testado;
- records, enums, maps, sets, lists, BigDecimal e Clock foram aplicados;
- limites distribuídos foram declarados;
- Timed Simulation foi criada;
- quatro blocos foram executados;
- tela e voz foram gravadas;
- relógio não foi pausado;
- Scorecard foi criado;
- Review Checklist foi criado;
- Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 714 foi criado;
- report, evidence e gate foram criados;
- todos os testes foram executados;
- métricas foram coletadas;
- gravação foi revisada;
- dois exercícios foram repetidos;
- commit recomendado e diário de bordo estão presentes;
- system design interview não foi antecipado.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

mvn test

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/live-coding-Java `
  src/test/Java/com/orderflow/livecoding `
  scripts/live-coding-Java `
  reports/live-coding-Java-report.yaml `
  contracts/live-coding-Java-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|copied-interview-solution|realTenant|realCustomer|system-design-final-answer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "test(live-coding): practice Java interview exercises"
```

Valide:

```powershell
git log `
  -1 `
  --oneline

git status `
  --short
```

Não inclua:

- solução copiada sem entendimento;
- secret;
- dado real;
- resposta final da aula 714.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou live coding Java com processo profissional.

Você treinou:

```text
requirement clarification;

solution communication;

complexity;

edge cases;

tests;

debugging;

refactoring;

strings;

collections;

maps;

sets;

records;

domain states;

intervals;

aggregation;

retry;

idempotency;

reconciliation;

timed simulation;

scorecard;

report e evidence.
```

Agora você consegue tornar seu raciocínio visível, produzir uma solução correta, testar, depurar e melhorar sob tempo controlado.

A próxima aula será:

```text
714 - M20.44 - System design interview
```

Nela, você realizará uma entrevista aberta de system design, com discovery, estimativas, diagramas, APIs, dados, mensageria, segurança, escala, disponibilidade, custos, mudanças de cenário e defesa final.

Nenhum system design interview completo foi executado nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Preparei o ambiente.
- [ ] Clarifiquei requisitos.
- [ ] Comuniquei a solução.
- [ ] Analisei complexidade.
- [ ] Tratei casos de borda.
- [ ] Escrevi testes.
- [ ] Depurei com hipótese.
- [ ] Refatorei com testes verdes.
- [ ] Completei dez exercícios.
- [ ] Executei simulação cronometrada.
- [ ] Revisei gravação.
- [ ] Preservei system design para a aula 714.

---

## Troubleshooting adicional

### Travei no início

Repita o problema e crie um exemplo pequeno.

### Não sei a estrutura ideal

Comece com lista ou mapa simples e compare.

### O código não compila

Leia a primeira mensagem relevante.

### O teste falha por ordem

Confirme se a ordem faz parte do contrato.

### O algoritmo usa memória demais

Avalie processamento incremental.

### O Stream ficou ilegível

Volte para loop explícito.

### O tempo acabou

Entregue baseline correta e explique próximos passos.

### O entrevistador muda a regra

Atualize assumptions, testes e solução.

### O bug não aparece no caso grande

Crie o menor caso que reproduz.

### Quero desenhar o sistema inteiro

Essa etapa pertence à aula 714.

---

## Perguntas de revisão

1. Live coding mede apenas velocidade?
2. O que vem antes do código?
3. Assumption pode ficar oculta?
4. Solução ótima vem antes da correta?
5. Complexidade precisa definir `n`?
6. Teste faz parte da solução?
7. HashMap garante pior caso constante?
8. Record garante imutabilidade profunda?
9. Stream é sempre mais legível?
10. Refatorar com testes falhando é seguro?
11. Quando usar LinkedHashMap?
12. Por que usar EnumMap?
13. Por que usar BigDecimal?
14. Clock ajuda em quê?
15. Idempotência em memória é distribuída?
16. Como depurar?
17. O que o scorecard mede?
18. Por que gravar?
19. O que fazer quando não sabe?
20. O que fazer quando a regra muda?
21. O que evidence registra?
22. O que a aula 714 fará?
23. O que não foi executado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Clarificação.
3. Não.
4. Não.
5. Sim.
6. Sim.
7. Não.
8. Não.
9. Não.
10. Não.
11. Preservar ordem.
12. Chaves enum.
13. Precisão decimal.
14. Testabilidade temporal.
15. Não.
16. Reproduzir e formular hipótese.
17. Processo e resultado.
18. Revisar comportamento.
19. Admitir e investigar.
20. Revalidar solução.
21. Execução e qualidade.
22. System design interview.
23. Banca completa.
24. System design interview.
25. Entender, implementar, testar e explicar.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 713 - M20.43 - Live coding Java

- Continuei após Entrevista arquitetura.
- Criei Live Coding Charter.
- Configurei módulo Java 21 e JUnit 5.
- Preparei execução rápida e relógio.
- Criei Requirement Clarification Guide.
- Pratiquei entrada, saída, restrições, exemplos e assumptions.
- Criei Solution Communication Guide.
- Pratiquei abordagem, alternativas e mudanças de plano.
- Criei Complexity Guide.
- Revisei tempo, espaço, média, pior caso e trade-offs.
- Criei Edge Case Catalog.
- Revisei nulo, vazio, duplicidade, ordem, empate, overflow e mutabilidade.
- Criei Test Strategy.
- Usei testes comportamentais e Arrange, Act, Assert.
- Criei Debugging Guide.
- Pratiquei reprodução, hipótese, inspeção, correção e regressão.
- Criei Refactoring Guide.
- Refatorei somente com testes verdes.
- Implementei frequência de palavras.
- Implementei primeiro caractere único.
- Implementei deduplicação de pedidos.
- Implementei agrupamento por status.
- Implementei validação de transições.
- Implementei merge de intervalos.
- Implementei top clientes.
- Implementei agenda de retry.
- Implementei janela de idempotência.
- Implementei reconciliação de eventos.
- Usei Map, Set, EnumMap, records, BigDecimal e Clock.
- Declarei limites de soluções em memória.
- Criei Timed Simulation.
- Executei quatro blocos cronometrados.
- Gravei tela e voz.
- Criei Live Coding Scorecard.
- Criei Review Checklist.
- Criei Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 714.
- Criei report, evidence e gate.
- Executei todos os testes.
- Coletei métricas.
- Revisei gravação.
- Repeti os dois exercícios mais fracos.
- Não antecipei system design interview.
- Próxima aula: System design interview.
```

---

## Referência técnica curta

- Requirement Clarification.
- Assumption.
- Data Structure.
- Time Complexity.
- Space Complexity.
- Edge Case.
- Unit Test.
- Debugging.
- Refactoring.
- HashMap.
- LinkedHashMap.
- HashSet.
- EnumMap.
- Record.
- BigDecimal.
- Clock.
- Idempotency.
- Reconciliation.
- Live Coding.

Regra final:

```text
O live coding Java do OrderFlow deve tornar raciocínio, código e validação observáveis: requirement clarification confirma entrada, saída, nulos, vazios, duplicidade, ordenação, limites and assumptions antes da implementação, communication guide apresenta baseline, estrutura de dados, alternativa and trade-off sem narrar cada tecla, complexity guide define n, loops, sorting, average and worst case, auxiliary memory and space-time trade-offs, edge cases cobrem empty, duplicate, tie, overflow, mutability and temporal behavior, test strategy usa behavior names, Arrange Act Assert, happy path, boundary and error cases, debugging reproduz, reduz, formula hipótese, inspeciona valores, corrige uma causa and executa regressão, refactoring ocorre somente com testes verdes e melhora nomes, duplicação and mutability sem abstração prematura, exercícios cobrem word frequency, first unique character, order deduplication, grouping, status transitions, interval merge, top customers, retry schedule, idempotency window and event reconciliation, Java 21 é aplicado com records, enums, collections, BigDecimal and Clock, soluções em memória declaram limites distribuídos, timed simulation usa blocos de aquecimento, domínio, algoritmo, debugging and refactoring com gravação e scorecard, report and evidence registram testes, duração, complexidade, comunicação and evolução, e o gate fecha ambiente, exercícios and simulation enquanto discovery aberto, capacity, diagrams, APIs, data, messaging, security, scale, availability, cost and formal system design defense permanecem reservados para a aula 714.
```
