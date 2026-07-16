# 707 - M20.37 - Entrevista Java

## Apresentação da aula

Na aula 706, você criou o currículo Java Backend.

O material profissional passou a possuir:

- função-alvo;
- senioridade definida com honestidade;
- inventário de carreira;
- análise de vagas;
- matriz de palavras-chave;
- resumo profissional;
- bullets orientados a impacto;
- experiências transferíveis;
- seção do projeto OrderFlow;
- competências técnicas;
- educação e cursos;
- versão de uma página;
- versão detalhada;
- versão Java Backend;
- versão de transição de QA para Backend;
- validação ATS;
- report, evidence e gate.

Agora você usará esse material em uma entrevista Java.

A entrevista não avalia apenas memória.

Ela observa se você consegue:

- explicar conceitos;
- relacionar teoria e prática;
- raciocinar em voz alta;
- reconhecer trade-offs;
- escrever código legível;
- testar hipóteses;
- lidar com dúvidas;
- admitir limites;
- aproveitar sua experiência anterior;
- conectar respostas ao OrderFlow;
- manter clareza sob pressão.

Nesta aula, você criará uma preparação estruturada para entrevistas de Java.

O foco será a linguagem e os fundamentos que sustentam aplicações backend:

- apresentação pessoal;
- leitura do currículo;
- Java e JVM;
- orientação a objetos;
- igualdade e identidade;
- imutabilidade;
- records;
- sealed classes;
- generics;
- collections;
- exceptions;
- Streams;
- Optional;
- concorrência;
- virtual threads;
- memória;
- garbage collection;
- performance básica;
- testes de código;
- exercícios ao vivo;
- comunicação durante resolução;
- perguntas comportamentais;
- simulação completa.

A entrevista não será tratada como uma prova de decorar definições.

Uma resposta profissional precisa possuir:

```text
definicao curta;

exemplo;

motivo;

trade-off;

aplicacao real;

limite.
```

Exemplo fraco:

```text
HashMap e mais rapido.
```

Exemplo melhor:

```text
HashMap oferece busca media proxima de O(1)
quando hashCode distribui bem as chaves,
mas nao garante ordenacao,
nao e thread-safe
e depende da consistencia entre equals e hashCode.
```

Você também aprenderá a dizer:

```text
nao lembro o detalhe exato,
mas eu verificaria desta forma.
```

Isso é melhor do que inventar.

A próxima aula será:

```text
708 - M20.38 - Entrevista Spring JPA
```

Na aula 708, você aprofundará Spring Boot, injeção de dependência, ciclo de beans, configuração, transações, JPA, Hibernate, mappings, fetch, locks, queries, migrations e problemas de persistência.

Nesta aula, Spring e JPA aparecerão apenas quando necessários para contextualizar Java.

Eles não serão o foco central.

O laboratório será:

```text
labs/m20/aula-707-entrevista-java/orderflow-java-interview
```

Regra central:

```text
uma boa entrevista Java
nao premia apenas quem lembra APIs;

ela revela
quem entende comportamento,
trade-offs,
qualidade
e raciocinio.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
704:
Preparacao GitHub.

705:
Preparacao LinkedIn.

706:
Curriculo Java Backend.

707:
Entrevista Java.

708:
Entrevista Spring JPA.

709:
Entrevista APIs REST e seguranca.
```

A aula 707 utiliza como fonte:

- currículo;
- LinkedIn;
- GitHub;
- narrativa do OrderFlow;
- defesa de decisões;
- código Java;
- testes;
- decisões arquiteturais;
- diário de bordo;
- experiência real.

A entrevista precisa manter consistência entre essas fontes.

Se o currículo afirma Java 21, você precisa conseguir explicar por que essa versão foi usada e quais recursos relevantes conhece.

Se o currículo afirma concorrência, você precisa diferenciar segurança de thread, paralelismo e assincronismo.

Se o currículo afirma arquitetura hexagonal, você precisa explicar como Java ajuda a materializar ports, adapters, interfaces e composição.

Se você ainda não domina um tema, responda com honestidade e indique como investigaria.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/interview-java
├── JAVA_INTERVIEW_CHARTER.md
├── INTERVIEW_INTRODUCTION.md
├── RESUME_WALKTHROUGH.md
├── JAVA_CORE_QUESTION_BANK.md
├── OOP_QUESTION_BANK.md
├── EQUALITY_AND_IMMUTABILITY.md
├── GENERICS_QUESTION_BANK.md
├── COLLECTIONS_QUESTION_BANK.md
├── EXCEPTIONS_QUESTION_BANK.md
├── STREAMS_OPTIONAL_QUESTION_BANK.md
├── CONCURRENCY_QUESTION_BANK.md
├── JVM_MEMORY_QUESTION_BANK.md
├── JAVA_21_QUESTION_BANK.md
├── LIVE_CODING_GUIDE.md
├── CODING_EXERCISES.md
├── BEHAVIORAL_STORIES.md
├── INTERVIEW_QUESTION_STRATEGY.md
├── MOCK_JAVA_INTERVIEW.md
├── JAVA_INTERVIEW_SCORECARD.md
├── JAVA_INTERVIEW_REVIEW_CHECKLIST.md
├── JAVA_INTERVIEW_MATRIX.md
├── JAVA_INTERVIEW_RISK_REGISTER.md
├── JAVA_INTERVIEW_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts auxiliares:

```text
scripts/interview-java
├── collect-interview-sources.ps1
├── generate-java-question-bank.ps1
├── validate-java-answers.ps1
├── run-coding-exercises.ps1
├── run-mock-interview.ps1
├── generate-java-interview-report.ps1
└── collect-java-interview-evidence.ps1
```

Artifacts:

```text
reports/java-interview-report.yaml

contracts/java-interview-evidence.yaml
```

---

## Conceito essencial

### Responder não é recitar

Uma definição sem exemplo parece memorização.

### Código ao vivo exige comunicação

O avaliador observa:

- perguntas de clarificação;
- casos de borda;
- escolhas de estrutura;
- complexidade;
- testes;
- capacidade de corrigir.

### Não saber é aceitável

Inventar é pior.

### Currículo direciona perguntas

Cada tecnologia listada pode se transformar em questionamento.

### Profundidade precisa acompanhar senioridade

Uma pessoa júnior pode demonstrar ótima base sem afirmar experiência que ainda não possui.

---

## Mão na massa guiada

### 1. Criar Java Interview Charter

Arquivo:

```text
docs/interview-java/JAVA_INTERVIEW_CHARTER.md
```

Princípios:

```text
clarity before speed;

reasoning before memorization;

examples before abstractions;

trade-offs are explicit;

unknowns are admitted;

code is tested;

Spring and JPA belong to lesson 708.
```

---

### 2. Criar roteiro de apresentação

Arquivo:

```text
docs/interview-java/INTERVIEW_INTRODUCTION.md
```

Estrutura:

1. identidade profissional;
2. experiência atual;
3. transição;
4. projeto principal;
5. competências;
6. objetivo.

---

### 3. Criar apresentação de 60 segundos

Exemplo:

```text
Sou profissional de qualidade e automação de software,
com experiência em APIs, bancos, testes e pipelines.
Nos últimos meses aprofundei minha atuação em Java Backend
e desenvolvi o OrderFlow,
um projeto completo em Java 21 e Spring Boot
com PostgreSQL, Kafka, segurança multi-tenant,
observabilidade, testes, Docker e CI/CD.
Minha experiência em QA me ajuda a construir sistemas
com foco em testabilidade, risco e confiabilidade.
Busco uma oportunidade em Java Backend
na qual eu possa unir desenvolvimento e qualidade.
```

---

### 4. Criar apresentação de três minutos

Inclua:

- trajetória;
- responsabilidades;
- aprendizados;
- projeto;
- desafios;
- objetivo.

---

### 5. Evitar biografia extensa

A apresentação precisa abrir a conversa.

---

## Currículo

### 6. Criar Resume Walkthrough

Arquivo:

```text
docs/interview-java/RESUME_WALKTHROUGH.md
```

Para cada seção do currículo, prepare:

- resumo oral;
- exemplo;
- evidence;
- pergunta provável;
- limite.

---

### 7. Preparar explicação da transição

Estrutura:

```text
nao estou abandonando qualidade;

estou ampliando minha atuacao
para construir sistemas
com a mesma preocupacao
que sempre tive ao valida-los.
```

---

### 8. Preparar explicação do OrderFlow

Fale em camadas:

- problema;
- domínio;
- arquitetura;
- confiabilidade;
- segurança;
- testes;
- operação.

---

### 9. Preparar resposta sobre experiência comercial

Se perguntarem se o OrderFlow foi usado em produção:

```text
nao;
e um projeto pessoal,
educacional
e demonstrativo,
validado em ambiente controlado
com testes,
reports
e simulacao de deploy.
```

---

### 10. Preparar evidências

Tenha acesso rápido a:

- README;
- código;
- testes;
- OpenAPI;
- Postman;
- reports;
- diagramas.

---

## Java e JVM

### 11. Criar Java Core Question Bank

Arquivo:

```text
docs/interview-java/JAVA_CORE_QUESTION_BANK.md
```

Temas:

- JDK;
- JVM;
- bytecode;
- compilação;
- class loading;
- tipos;
- objetos;
- referências;
- métodos;
- modificadores;
- packages.

---

### 12. Responder JDK, JRE e JVM

```text
JDK:
ferramentas para desenvolver,
compilar,
testar
e executar.

JRE:
ambiente de execucao,
conceito historico composto por JVM e bibliotecas.

JVM:
maquina virtual que executa bytecode
e fornece memoria,
class loading,
JIT
e garbage collection.
```

---

### 13. Explicar compilação Java

Fluxo:

```text
.java
-> javac
-> bytecode .class
-> class loader
-> verificacao
-> interpretacao e JIT
-> codigo nativo.
```

---

### 14. Explicar portabilidade

O bytecode é portável entre JVMs compatíveis.

Código nativo, filesystem, timezone e dependências externas ainda podem introduzir diferenças.

---

### 15. Explicar tipos primitivos e referências

Primitivos armazenam valores simples.

Variáveis de referência apontam para objetos.

Evite simplificações absolutas sobre stack e heap sem considerar otimizações da JVM.

---

### 16. Explicar passagem de parâmetros

Java é pass-by-value.

Quando o valor é uma referência, uma cópia dessa referência é passada.

O método pode alterar o objeto apontado, mas não substituir a variável do chamador.

---

### 17. Explicar `final`

Pode impedir:

- reatribuição de variável;
- override de método;
- herança de classe.

`final` em referência não torna o objeto imutável.

---

### 18. Explicar `static`

Pertence à classe, não à instância.

Uso excessivo pode aumentar acoplamento e dificultar testes.

---

### 19. Explicar sobrecarga e sobrescrita

Sobrecarga:

- mesmo nome;
- parâmetros diferentes;
- resolvida em compilação.

Sobrescrita:

- subclasse redefine comportamento;
- mesma assinatura compatível;
- polimorfismo em runtime.

---

### 20. Explicar interface e classe abstrata

Interface define contrato e pode possuir métodos default.

Classe abstrata pode manter estado e implementação compartilhada.

A escolha depende da relação e da necessidade de estado.

---

## Orientação a objetos

### 21. Criar OOP Question Bank

Arquivo:

```text
docs/interview-java/OOP_QUESTION_BANK.md
```

---

### 22. Explicar encapsulamento

Não é apenas usar campos privados.

É proteger invariantes e controlar mudanças de estado.

---

### 23. Explicar abstração

Representa o essencial de um conceito e omite detalhes irrelevantes para o contexto.

---

### 24. Explicar herança

Herança modela relação “é um”.

Pode criar acoplamento forte.

Composição costuma ser preferível quando o comportamento pode variar independentemente.

---

### 25. Explicar polimorfismo

Código opera por contrato e aceita implementações diferentes.

No OrderFlow, ports permitem substituir adapters.

---

### 26. Explicar composição sobre herança

Composição favorece substituição e responsabilidades menores.

Não é regra absoluta.

---

### 27. Explicar SOLID sem decorar siglas

Use exemplos:

- aggregate com responsabilidade clara;
- ports pequenas;
- adapters substituíveis;
- application dependendo de abstrações.

---

### 28. Explicar coesão

Elementos relacionados permanecem juntos.

---

### 29. Explicar acoplamento

Dependência entre componentes.

O objetivo não é acoplamento zero, mas acoplamento intencional.

---

## Igualdade e imutabilidade

### 30. Criar Equality and Immutability

Arquivo:

```text
docs/interview-java/EQUALITY_AND_IMMUTABILITY.md
```

---

### 31. Explicar `==` e `equals`

Para referências:

- `==` compara identidade;
- `equals` pode comparar valor.

---

### 32. Explicar contrato de `equals`

Deve ser:

- reflexivo;
- simétrico;
- transitivo;
- consistente;
- falso para `null`.

---

### 33. Explicar `hashCode`

Objetos iguais por `equals` precisam possuir o mesmo hash.

Objetos com mesmo hash não precisam ser iguais.

---

### 34. Explicar impacto em HashMap

Se a chave muda de forma que altera o hash depois de inserida, a busca pode falhar.

Chaves imutáveis são mais seguras.

---

### 35. Explicar imutabilidade

Características:

- estado não muda após construção;
- campos privados e finais;
- validação no construtor;
- sem exposição mutável;
- cópias defensivas.

---

### 36. Explicar benefícios

- thread safety;
- previsibilidade;
- cache;
- igualdade;
- redução de estados inválidos.

---

### 37. Explicar record

Record reduz boilerplate para portadores de dados.

Ele não garante imutabilidade profunda se componentes forem mutáveis.

---

## Generics

### 38. Criar Generics Question Bank

Arquivo:

```text
docs/interview-java/GENERICS_QUESTION_BANK.md
```

---

### 39. Explicar objetivo

Generics fornecem segurança de tipo em compilação e reduzem casts.

---

### 40. Explicar invariância

```text
List<Integer>
```

não é subtipo de:

```text
List<Number>
```

---

### 41. Explicar wildcard

```text
? extends T
```

para produzir valores de `T`.

```text
? super T
```

para consumir valores de `T`.

Regra PECS:

```text
Producer Extends;
Consumer Super.
```

---

### 42. Explicar type erasure

Grande parte das informações genéricas não permanece disponível em runtime.

---

### 43. Explicar limitações

Não é possível instanciar diretamente `new T()` ou criar array genérico simples.

---

## Collections

### 44. Criar Collections Question Bank

Arquivo:

```text
docs/interview-java/COLLECTIONS_QUESTION_BANK.md
```

---

### 45. Comparar List, Set e Map

List:

- ordem;
- duplicidade.

Set:

- unicidade.

Map:

- chave e valor.

---

### 46. Comparar ArrayList e LinkedList

ArrayList:

- acesso por índice eficiente;
- memória contígua conceitual;
- inserção no meio exige deslocamento.

LinkedList:

- nós ligados;
- acesso por índice custoso;
- overhead de memória;
- raramente é melhor em aplicações comuns.

---

### 47. Comparar HashSet e TreeSet

HashSet:

- sem ordenação;
- busca média eficiente.

TreeSet:

- ordenado;
- operações logarítmicas;
- exige comparação consistente.

---

### 48. Comparar HashMap e TreeMap

TreeMap mantém ordenação por chave.

HashMap geralmente possui menor custo médio de busca.

---

### 49. Explicar LinkedHashMap

Preserva ordem de inserção ou acesso, dependendo da configuração.

---

### 50. Explicar ConcurrentHashMap

Permite acesso concorrente com estratégia própria.

Não torna operações compostas automaticamente atômicas.

---

### 51. Explicar fail-fast iterator

Pode lançar `ConcurrentModificationException` quando a coleção é alterada estruturalmente fora do iterator.

Não é mecanismo de sincronização.

---

### 52. Explicar complexidade

Fale em comportamento médio e pior caso quando relevante.

---

## Exceptions

### 53. Criar Exceptions Question Bank

Arquivo:

```text
docs/interview-java/EXCEPTIONS_QUESTION_BANK.md
```

---

### 54. Diferenciar checked e unchecked

Checked precisam ser tratadas ou declaradas.

Unchecked descendem de `RuntimeException`.

---

### 55. Explicar quando criar exception de domínio

Quando a falha representa regra ou estado inválido do negócio.

---

### 56. Evitar exception para fluxo normal

Use resultado explícito quando a situação é esperada e frequente.

---

### 57. Explicar `try-with-resources`

Fecha recursos que implementam `AutoCloseable`.

---

### 58. Explicar causa

Preserve a causa ao traduzir exception.

---

### 59. Evitar catch genérico silencioso

Isso perde contexto e dificulta diagnóstico.

---

### 60. Explicar `finally`

Executa após `try` ou `catch`, com exceções em casos de encerramento abrupto da JVM.

---

## Streams e Optional

### 61. Criar Streams Optional Question Bank

Arquivo:

```text
docs/interview-java/STREAMS_OPTIONAL_QUESTION_BANK.md
```

---

### 62. Explicar Stream

Stream representa pipeline de operações sobre dados.

Não é estrutura de armazenamento.

---

### 63. Explicar lazy evaluation

Operações intermediárias aguardam uma operação terminal.

---

### 64. Diferenciar `map` e `flatMap`

`map` transforma um elemento em outro.

`flatMap` transforma e achata estruturas aninhadas.

---

### 65. Explicar efeitos colaterais

Pipelines são mais previsíveis quando funções são puras.

---

### 66. Explicar parallel stream

Não use por padrão.

Avalie:

- volume;
- CPU;
- custo;
- pool;
- ordenação;
- bloqueio;
- contexto da aplicação.

---

### 67. Explicar Optional

Útil para representar ausência em retornos.

Evite como campo JPA, parâmetro obrigatório ou substituto universal de validação.

---

### 68. Evitar `get` sem verificação

Prefira:

- `orElse`;
- `orElseGet`;
- `orElseThrow`;
- `map`;
- `flatMap`.

---

### 69. Diferenciar `orElse` e `orElseGet`

`orElse` avalia o valor alternativo imediatamente.

`orElseGet` avalia sob demanda.

---

## Concorrência

### 70. Criar Concurrency Question Bank

Arquivo:

```text
docs/interview-java/CONCURRENCY_QUESTION_BANK.md
```

---

### 71. Diferenciar concorrência e paralelismo

Concorrência lida com múltiplas tarefas em progresso.

Paralelismo executa tarefas simultaneamente.

---

### 72. Explicar race condition

O resultado depende da ordem de execução entre threads.

---

### 73. Explicar visibility

Uma thread pode não observar imediatamente a escrita de outra sem garantias de memória.

---

### 74. Explicar atomicidade

Uma operação aparentemente simples pode possuir vários passos.

---

### 75. Explicar `synchronized`

Fornece exclusão mútua e relação de visibilidade.

---

### 76. Explicar `volatile`

Garante visibilidade e ordenação para a variável.

Não torna incremento composto atômico.

---

### 77. Explicar atomic classes

`AtomicInteger` e similares fornecem operações atômicas específicas.

---

### 78. Explicar locks

`ReentrantLock` oferece recursos adicionais como tentativa, interrupção e conditions.

---

### 79. Explicar deadlock

Threads aguardam recursos umas das outras.

Prevenção:

- ordem consistente;
- menor escopo;
- timeout;
- redução de locks.

---

### 80. Explicar executor

Executor separa submissão de tarefa do gerenciamento de threads.

---

### 81. Explicar CompletableFuture

Permite composição assíncrona.

Exige atenção a:

- executor;
- tratamento de erro;
- bloqueio;
- contexto;
- observabilidade.

---

### 82. Explicar virtual threads

Virtual threads foram finalizadas no Java 21.

Elas são adequadas para grande quantidade de tarefas bloqueantes, especialmente I/O.

Não tornam CPU-bound automaticamente mais rápido.

---

### 83. Explicar pinning e limites

Código sincronizado ou chamadas nativas podem afetar o benefício.

A implementação precisa ser medida.

---

### 84. Relacionar com OrderFlow

Workers e providers usam concorrência com limites, idempotência e observabilidade.

---

## JVM e memória

### 85. Criar JVM Memory Question Bank

Arquivo:

```text
docs/interview-java/JVM_MEMORY_QUESTION_BANK.md
```

---

### 86. Explicar heap

Objetos normalmente são alocados no heap, sujeito a GC.

---

### 87. Explicar stack de thread

Cada thread possui frames de chamadas, variáveis locais e informações de execução.

---

### 88. Explicar metaspace

Armazena metadata de classes.

---

### 89. Explicar garbage collection

GC identifica objetos não alcançáveis e recupera memória.

---

### 90. Explicar memory leak em Java

Objetos ainda alcançáveis, porém não mais necessários, continuam ocupando memória.

Exemplos:

- cache sem limite;
- listener não removido;
- coleção estática;
- ThreadLocal mal limpo.

---

### 91. Explicar JIT

Compila trechos quentes para código nativo e aplica otimizações.

---

### 92. Explicar profiling

Antes de otimizar:

- medir;
- reproduzir;
- usar profiler;
- identificar allocation, CPU, locks e I/O.

---

### 93. Evitar otimização prematura

Código simples e correto vem antes.

---

## Java 21

### 94. Criar Java 21 Question Bank

Arquivo:

```text
docs/interview-java/JAVA_21_QUESTION_BANK.md
```

---

### 95. Revisar records

Úteis para dados imutáveis superficiais e contratos internos.

---

### 96. Revisar sealed classes

Restringem hierarquia permitida.

Podem ajudar modelagem de resultados fechados.

---

### 97. Revisar pattern matching

Reduz casts explícitos e melhora expressividade quando usado com cuidado.

---

### 98. Revisar switch expressions

Permitem retorno de valor e reduzem fall-through acidental.

---

### 99. Revisar virtual threads

Explique caso de uso e limite.

---

### 100. Não listar recurso sem uso

Conheça o que afirma no currículo.

---

## Live coding

### 101. Criar Live Coding Guide

Arquivo:

```text
docs/interview-java/LIVE_CODING_GUIDE.md
```

Processo:

1. ouvir;
2. repetir problema;
3. esclarecer entrada;
4. esclarecer saída;
5. listar casos;
6. propor solução;
7. discutir complexidade;
8. implementar;
9. testar;
10. revisar.

---

### 102. Falar durante o exercício

Explique decisões sem narrar cada tecla.

---

### 103. Começar simples

Uma solução correta e clara vem antes da otimização.

---

### 104. Criar testes manuais

Inclua:

- caso comum;
- vazio;
- nulo quando permitido;
- duplicado;
- limite;
- erro.

---

### 105. Revisar nomes

Código de entrevista também precisa ser legível.

---

### 106. Tratar complexidade

Explique tempo e espaço.

---

## Exercícios práticos

### 107. Criar Coding Exercises

Arquivo:

```text
docs/interview-java/CODING_EXERCISES.md
```

---

### 108. Exercício 1: frequência de palavras

Entrada:

```text
lista de palavras.
```

Saída:

```text
mapa com frequencia.
```

Avalie:

- normalização;
- nulos;
- ordem;
- complexidade.

---

### 109. Exercício 2: primeiro caractere não repetido

Use:

- LinkedHashMap;
- contagem;
- duas passagens.

---

### 110. Exercício 3: pedidos por status

Agrupe:

```java
Map<OrderStatus, List<Order>>
```

Discuta mutabilidade e collectors.

---

### 111. Exercício 4: remover duplicados preservando ordem

Use LinkedHashSet ou estratégia explícita.

---

### 112. Exercício 5: top N valores

Discuta ordenação completa versus heap.

---

### 113. Exercício 6: value object

Implemente `OrderId` com validação, igualdade e representação.

---

### 114. Exercício 7: cache limitado

Discuta LinkedHashMap em access order.

---

### 115. Exercício 8: contador concorrente

Compare:

- `synchronized`;
- `AtomicLong`;
- `LongAdder`.

---

### 116. Exercício 9: processamento de resultados

Use sealed interface para:

- success;
- rejected;
- ambiguous.

---

### 117. Exercício 10: validação de transição

Modele estados permitidos sem `if` espalhado.

---

## Histórias comportamentais

### 118. Criar Behavioral Stories

Arquivo:

```text
docs/interview-java/BEHAVIORAL_STORIES.md
```

Histórias:

- problema difícil;
- erro;
- conflito;
- aprendizado;
- prazo;
- melhoria;
- colaboração;
- decisão.

---

### 119. Usar estrutura STAR

```text
Situation;

Task;

Action;

Result;

Learning.
```

---

### 120. Preparar história de erro técnico

Explique:

- o que aconteceu;
- como detectou;
- como corrigiu;
- como evitou repetição.

---

### 121. Preparar história de discordância

Mostre escuta, critérios e decisão.

---

### 122. Preparar história de aprendizado

Use a evolução do OrderFlow.

---

## Perguntas ao entrevistador

### 123. Criar Interview Question Strategy

Arquivo:

```text
docs/interview-java/INTERVIEW_QUESTION_STRATEGY.md
```

Perguntas:

- como a equipe organiza revisão?
- como mede qualidade?
- como trata incidentes?
- qual maturidade de testes?
- como é o onboarding?
- quais desafios técnicos atuais?
- como decisões são registradas?

---

### 124. Evitar perguntas encontráveis na descrição

---

### 125. Perguntar sobre expectativa da função

---

## Simulação

### 126. Criar Mock Java Interview

Arquivo:

```text
docs/interview-java/MOCK_JAVA_INTERVIEW.md
```

Duração:

```text
60 a 90 minutos.
```

---

### 127. Estruturar simulação

1. apresentação;
2. currículo;
3. Java core;
4. orientação a objetos;
5. collections;
6. exceptions;
7. Streams;
8. concorrência;
9. JVM;
10. Java 21;
11. live coding;
12. comportamento;
13. perguntas.

---

### 128. Criar níveis de pergunta

- base;
- intermediário;
- aprofundamento;
- follow-up.

---

### 129. Gravar a simulação

Avalie conteúdo e comunicação.

---

### 130. Não interromper toda resposta

Deixe o candidato concluir antes do feedback.

---

## Scorecard

### 131. Criar Java Interview Scorecard

Arquivo:

```text
docs/interview-java/JAVA_INTERVIEW_SCORECARD.md
```

Critérios de 1 a 5:

- apresentação;
- Java core;
- OOP;
- collections;
- exceptions;
- Streams;
- concorrência;
- JVM;
- Java 21;
- coding;
- testes;
- comunicação;
- honestidade;
- comportamento.

---

### 132. Criar Review Checklist

Arquivo:

```text
docs/interview-java/JAVA_INTERVIEW_REVIEW_CHECKLIST.md
```

Perguntas:

- respondi primeiro?
- dei exemplo?
- expliquei trade-off?
- usei OrderFlow quando relevante?
- inventei algo?
- testei código?
- discuti complexidade?
- mantive calma?
- fiz perguntas?
- evitei antecipar Spring JPA?

---

### 133. Criar Java Interview Matrix

Arquivo:

```text
docs/interview-java/JAVA_INTERVIEW_MATRIX.md
```

Colunas:

- tema;
- pergunta;
- resposta curta;
- aprofundamento;
- exemplo;
- evidence;
- score;
- revisão.

---

### 134. Criar Risk Register

Arquivo:

```text
docs/interview-java/JAVA_INTERVIEW_RISK_REGISTER.md
```

Riscos:

```text
decoracao sem entendimento;

resposta longa;

codigo sem teste;

complexidade ignorada;

claim inventada;

nervosismo;

curriculo inconsistente;

Spring antecipado;

JPA antecipado;

feedback nao registrado.
```

---

### 135. Criar Traceability

Arquivo:

```text
docs/interview-java/JAVA_INTERVIEW_TRACEABILITY.md
```

Exemplo:

```text
idempotencia
-> application code
-> integration test
-> interview answer.

immutability
-> value objects
-> domain tests.

concurrency
-> Outbox publisher
-> worker configuration
-> performance evidence.
```

---

### 136. Criar boundary da próxima aula

Arquivo:

```text
docs/interview-java/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 707 define:

- personal introduction;
- resume walkthrough;
- Java core;
- JVM basics;
- object orientation;
- equality;
- immutability;
- records;
- generics;
- collections;
- exceptions;
- Streams;
- Optional;
- concurrency;
- virtual threads;
- memory;
- Java 21;
- live coding;
- behavioral stories;
- mock interview;
- scorecard.

A aula 708 define:

- Spring Boot;
- dependency injection;
- bean lifecycle;
- configuration properties;
- profiles;
- transactions;
- Spring Data;
- JPA;
- Hibernate;
- mappings;
- fetch;
- N plus one;
- locks;
- queries;
- migrations;
- persistence interview simulation.

Nenhuma entrevista Spring JPA
e executada nesta aula.
```

---

## Validação final

### 137. Criar report

Arquivo:

```text
reports/java-interview-report.yaml
```

Exemplo:

```yaml
javaInterview:
  questionBank:
    total:
      measured
    answered:
      measured

  score:
    JavaCore:
      measured
    OOP:
      measured
    collections:
      measured
    exceptions:
      measured
    Streams:
      measured
    concurrency:
      measured
    JVM:
      measured
    Java21:
      measured
    coding:
      measured

  integrity:
    unsupportedAnswers:
      0
    contradictions:
      0

  mockInterview:
    completed:
      true
    durationMinutes:
      measured

  SpringJPAInterview:
    completed:
      false

  gate:
    PASS
```

---

### 138. Criar evidence

Arquivo:

```text
contracts/java-interview-evidence.yaml
```

Campos:

- lesson;
- project;
- introduction status;
- resume walkthrough status;
- Java core question count;
- OOP question count;
- generics question count;
- collections question count;
- exceptions question count;
- Streams question count;
- concurrency question count;
- JVM question count;
- Java 21 question count;
- coding exercise count;
- completed coding exercise count;
- behavioral story count;
- interviewer question count;
- mock interview duration;
- average score;
- lowest topic;
- highest topic;
- unsupported answer count;
- contradiction count;
- admitted uncertainty count;
- code test status;
- Spring JPA interview completed;
- documentation status;
- gate status;
- timestamp.

---

### 139. Criar gate da entrevista

Status:

```text
PASS;

FAIL_INTRODUCTION;

FAIL_RESUME_WALKTHROUGH;

FAIL_JAVA_CORE;

FAIL_OOP;

FAIL_EQUALITY;

FAIL_IMMUTABILITY;

FAIL_GENERICS;

FAIL_COLLECTIONS;

FAIL_EXCEPTIONS;

FAIL_STREAMS;

FAIL_OPTIONAL;

FAIL_CONCURRENCY;

FAIL_JVM;

FAIL_JAVA_21;

FAIL_LIVE_CODING;

FAIL_CODE_TEST;

FAIL_COMPLEXITY_ANALYSIS;

FAIL_BEHAVIORAL_STORY;

FAIL_INTERVIEWER_QUESTIONS;

FAIL_MOCK_INTERVIEW;

FAIL_UNSUPPORTED_ANSWER;

FAIL_CONTRADICTION;

FAIL_SPRING_JPA_ANTICIPATION;

INCONCLUSIVE.
```

---

### 140. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\interview-java\collect-interview-sources.ps1

.\scripts\interview-java\generate-java-question-bank.ps1

.\scripts\interview-java\validate-java-answers.ps1

.\scripts\interview-java\run-coding-exercises.ps1

.\scripts\interview-java\collect-java-interview-evidence.ps1
```

---

### 141. Executar duas simulações

Rodada 1:

```text
colaborativa.
```

Rodada 2:

```text
com follow-ups e pressao controlada.
```

---

### 142. Revisar gravações

Selecione:

- três boas respostas;
- três respostas longas;
- três lacunas;
- dois exercícios;
- um plano de melhoria.

---

### 143. Repetir o tema mais fraco

---

### 144. Encerrar o laboratório

Confirme:

- Charter;
- apresentação;
- currículo;
- Java core;
- JVM;
- OOP;
- igualdade;
- imutabilidade;
- records;
- generics;
- collections;
- exceptions;
- Streams;
- Optional;
- concorrência;
- virtual threads;
- memória;
- Java 21;
- coding;
- behavior;
- perguntas;
- simulação;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 708 preservada.

---

## Entendendo o que foi feito

### A entrevista ganhou método

Perguntas deixaram de ser estudadas de forma aleatória.

### O currículo virou roteiro de preparação

Cada claim passou a possuir exemplo e evidence.

### Java foi tratado como comportamento

Definições foram ligadas a código, trade-offs e limites.

### Live coding ganhou processo

Clarificação, implementação, teste e revisão foram praticados.

### Concorrência ganhou precisão

Visibility, atomicidade e paralelismo deixaram de ser confundidos.

### A JVM ganhou lugar na conversa

Memória, JIT e GC foram explicados sem simplificações perigosas.

### Java 21 ganhou contexto

Records, sealed classes, pattern matching e virtual threads foram ligados a casos reais.

### Feedback ganhou evidência

Scorecard e gravação ajudam a medir evolução.

---

## Erros comuns importantes

### Decorar definição

Follow-up revela falta de entendimento.

### Falar sem responder

Comece pela conclusão.

### Escrever código imediatamente

Clarifique primeiro.

### Ignorar casos de borda

A solução fica incompleta.

### Não testar

Erros simples permanecem.

### Confundir `volatile` com atomicidade

Incremento ainda pode sofrer race condition.

### Dizer que record é profundamente imutável

Componentes mutáveis continuam mutáveis.

### Usar parallel stream por padrão

Pode piorar comportamento.

### Inventar experiência de produção

A credibilidade é perdida.

### Responder Spring e JPA agora

Essa etapa pertence à aula 708.

---

## Comandos úteis

### Gerar perguntas

```powershell
.\scripts\interview-java\generate-java-question-bank.ps1
```

### Validar respostas

```powershell
.\scripts\interview-java\validate-java-answers.ps1
```

### Executar exercícios

```powershell
.\scripts\interview-java\run-coding-exercises.ps1
```

### Coletar evidence

```powershell
.\scripts\interview-java\collect-java-interview-evidence.ps1
```

---

## Exercício principal

Realize uma entrevista simulada de 75 minutos.

Inclua:

1. apresentação de 60 segundos;
2. transição QA para Backend;
3. explicação do OrderFlow;
4. JDK, JRE e JVM;
5. pass-by-value;
6. `final`;
7. overload e override;
8. encapsulamento;
9. composição;
10. `equals`;
11. `hashCode`;
12. imutabilidade;
13. record;
14. generics;
15. PECS;
16. ArrayList;
17. HashMap;
18. ConcurrentHashMap;
19. exceptions;
20. try-with-resources;
21. Stream;
22. `map` e `flatMap`;
23. Optional;
24. race condition;
25. `synchronized`;
26. `volatile`;
27. executor;
28. virtual threads;
29. heap e stack;
30. garbage collection;
31. exercício de frequência;
32. exercício de value object;
33. testes;
34. complexidade;
35. história comportamental;
36. perguntas ao entrevistador;
37. feedback;
38. plano de melhoria.

Não realize a entrevista Spring JPA.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 706 e ponte para a aula 708 foram preservadas;
- Java Interview Charter foi criado;
- roteiro de apresentação foi criado;
- apresentação de 60 segundos foi criada;
- apresentação longa foi criada;
- biografia excessiva foi evitada;
- Resume Walkthrough foi criado;
- transição foi explicada;
- OrderFlow foi explicado;
- experiência comercial não foi inventada;
- evidências foram preparadas;
- Java Core Question Bank foi criado;
- JDK, JRE e JVM foram explicados;
- compilação foi explicada;
- portabilidade foi explicada;
- primitivos e referências foram explicados;
- pass-by-value foi explicado;
- `final` foi explicado;
- `static` foi explicado;
- overload e override foram explicados;
- interfaces e classes abstratas foram comparadas;
- OOP Question Bank foi criado;
- encapsulamento foi explicado;
- abstração foi explicada;
- herança foi explicada;
- polimorfismo foi explicado;
- composição foi explicada;
- SOLID foi relacionado a exemplos;
- coesão foi explicada;
- acoplamento foi explicado;
- Equality and Immutability foi criado;
- `==` e `equals` foram explicados;
- contrato de `equals` foi explicado;
- `hashCode` foi explicado;
- HashMap foi relacionado ao contrato;
- imutabilidade foi explicada;
- benefícios foram explicados;
- records foram explicados;
- Generics Question Bank foi criado;
- objetivo de generics foi explicado;
- invariância foi explicada;
- wildcards foram explicados;
- PECS foi explicado;
- type erasure foi explicado;
- limitações foram explicadas;
- Collections Question Bank foi criado;
- List, Set e Map foram comparados;
- ArrayList e LinkedList foram comparados;
- HashSet e TreeSet foram comparados;
- HashMap e TreeMap foram comparados;
- LinkedHashMap foi explicado;
- ConcurrentHashMap foi explicado;
- fail-fast foi explicado;
- complexidade foi discutida;
- Exceptions Question Bank foi criado;
- checked e unchecked foram diferenciadas;
- exceptions de domínio foram explicadas;
- exception para fluxo normal foi evitada;
- try-with-resources foi explicado;
- causas foram preservadas;
- catch silencioso foi evitado;
- `finally` foi explicado;
- Streams Optional Question Bank foi criado;
- Stream foi explicado;
- lazy evaluation foi explicada;
- `map` e `flatMap` foram comparados;
- efeitos colaterais foram tratados;
- parallel stream foi tratado;
- Optional foi explicado;
- `get` sem validação foi evitado;
- `orElse` e `orElseGet` foram comparados;
- Concurrency Question Bank foi criado;
- concorrência e paralelismo foram diferenciados;
- race condition foi explicada;
- visibility foi explicada;
- atomicidade foi explicada;
- `synchronized` foi explicado;
- `volatile` foi explicado;
- atomic classes foram explicadas;
- locks foram explicados;
- deadlock foi explicado;
- executor foi explicado;
- CompletableFuture foi explicado;
- virtual threads foram explicadas;
- limites de virtual threads foram explicados;
- concorrência foi relacionada ao OrderFlow;
- JVM Memory Question Bank foi criado;
- heap foi explicado;
- stack foi explicada;
- metaspace foi explicada;
- GC foi explicado;
- memory leak foi explicado;
- JIT foi explicado;
- profiling foi explicado;
- otimização prematura foi evitada;
- Java 21 Question Bank foi criado;
- records foram revisados;
- sealed classes foram revisadas;
- pattern matching foi revisado;
- switch expressions foram revisadas;
- virtual threads foram revisadas;
- recursos não usados não foram exagerados;
- Live Coding Guide foi criado;
- processo de live coding foi praticado;
- raciocínio em voz alta foi praticado;
- solução simples foi priorizada;
- testes manuais foram criados;
- nomes foram revisados;
- complexidade foi explicada;
- Coding Exercises foi criado;
- dez exercícios foram preparados;
- Behavioral Stories foi criado;
- STAR foi usado;
- história de erro foi criada;
- história de discordância foi criada;
- história de aprendizado foi criada;
- Interview Question Strategy foi criada;
- perguntas ao entrevistador foram preparadas;
- perguntas óbvias foram evitadas;
- expectativa da função foi questionada;
- Mock Java Interview foi criado;
- simulação foi estruturada;
- níveis de perguntas foram criados;
- simulação foi gravada;
- feedback não interrompeu todas as respostas;
- Scorecard foi criado;
- Review Checklist foi criado;
- Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 708 foi criado;
- report, evidence e gate foram criados;
- validators foram executados;
- duas simulações foram realizadas;
- gravações foram revisadas;
- tema mais fraco foi repetido;
- commit recomendado e diário de bordo estão presentes;
- entrevista Spring JPA não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\interview-java\validate-java-answers.ps1

.\scripts\interview-java\run-coding-exercises.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/interview-java `
  scripts/interview-java `
  reports/java-interview-report.yaml `
  contracts/java-interview-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|commercial-production-false|memorized-secret-answer|Spring-JPA-mock|realTenant|realCustomer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(interview): prepare Java technical interview"
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

- experiência inventada;
- resposta tecnicamente falsa;
- dado sensível;
- simulação detalhada da aula 708.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou a preparação completa para uma entrevista Java.

Você estruturou:

```text
personal introduction;

resume walkthrough;

Java core;

JVM;

object orientation;

equality;

immutability;

records;

generics;

collections;

exceptions;

Streams;

Optional;

concurrency;

virtual threads;

memory;

Java 21;

live coding;

behavioral stories;

interviewer questions;

mock interview;

scorecard;

report e evidence.
```

Agora você consegue apresentar sua trajetória, responder fundamentos, escrever código, discutir trade-offs e reconhecer limites.

A próxima aula será:

```text
708 - M20.38 - Entrevista Spring JPA
```

Nela, você treinará perguntas e exercícios sobre Spring Boot, injeção de dependência, beans, configuração, transações, Spring Data, JPA, Hibernate, mappings, fetch, N+1, locks, queries, migrations e persistência.

Nenhuma entrevista Spring JPA foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Preparei apresentação.
- [ ] Preparei currículo.
- [ ] Revisei Java core.
- [ ] Revisei OOP.
- [ ] Revisei igualdade e imutabilidade.
- [ ] Revisei generics.
- [ ] Revisei collections.
- [ ] Revisei exceptions.
- [ ] Revisei Streams e Optional.
- [ ] Revisei concorrência.
- [ ] Revisei JVM.
- [ ] Revisei Java 21.
- [ ] Executei live coding.
- [ ] Gravei simulações.
- [ ] Preservei Spring JPA para a aula 708.

---

## Troubleshooting adicional

### Resposta ficou decorada

Inclua exemplo e limite.

### Não lembro uma API

Explique o conceito e como confirmaria.

### Live coding travou

Volte ao exemplo mínimo e teste casos pequenos.

### Código funciona, mas está confuso

Renomeie e extraia etapas.

### Complexidade ficou incerta

Analise loops, estruturas e memória auxiliar.

### Concorrência parece abstrata

Use um contador ou fila como exemplo.

### Virtual threads parecem solução universal

Separe I/O-bound de CPU-bound.

### Não consigo explicar meu projeto

Volte ao problema e às decisões.

### Fiquei nervoso

Use pausa, repita a pergunta e comece curto.

### Quero estudar Spring agora

Essa etapa pertence à aula 708.

---

## Perguntas de revisão

1. Entrevista mede apenas memória?
2. Java é pass-by-reference?
3. `final` torna objeto imutável?
4. Sobrecarga acontece quando?
5. O que encapsulamento protege?
6. `==` e `equals` são iguais?
7. Qual contrato liga `equals` e `hashCode`?
8. Record é profundamente imutável?
9. O que significa PECS?
10. ArrayList é sempre melhor?
11. ConcurrentHashMap torna toda operação atômica?
12. Checked exception é sempre melhor?
13. Stream armazena dados?
14. `orElse` é lazy?
15. `volatile` torna incremento atômico?
16. Virtual thread acelera CPU-bound?
17. O que GC recupera?
18. O que JIT faz?
19. O que perguntar antes de codificar?
20. Por que testar live coding?
21. O que scorecard mede?
22. O que a aula 708 fará?
23. O que não foi realizado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Não.
3. Não.
4. Em compilação.
5. Invariantes.
6. Não.
7. Igualdade exige mesmo hash.
8. Não necessariamente.
9. Producer Extends, Consumer Super.
10. Não.
11. Não.
12. Não.
13. Não.
14. Não.
15. Não.
16. Não.
17. Objetos inalcançáveis.
18. Compila trechos quentes.
19. Entrada, saída e limites.
20. Encontrar erros.
21. Conhecimento e comunicação.
22. Entrevista Spring JPA.
23. Spring e JPA.
24. Entrevista Spring JPA.
25. Entender, explicar, codificar e testar.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 707 - M20.37 - Entrevista Java

- Continuei após Currículo Java Backend.
- Criei Java Interview Charter.
- Criei apresentações de 60 segundos e 3 minutos.
- Criei Resume Walkthrough.
- Preparei transição QA para Backend.
- Preparei explicação do OrderFlow.
- Preservei honestidade sobre produção.
- Organizei evidências.
- Criei Java Core Question Bank.
- Revisei JDK, JRE, JVM, bytecode e JIT.
- Revisei primitivos, referências e pass-by-value.
- Revisei `final`, `static`, overload e override.
- Comparei interface e classe abstrata.
- Criei OOP Question Bank.
- Revisei encapsulamento, abstração, herança e polimorfismo.
- Relacionei SOLID, coesão e acoplamento.
- Criei Equality and Immutability.
- Revisei `==`, `equals`, `hashCode` e HashMap.
- Revisei imutabilidade e records.
- Criei Generics Question Bank.
- Revisei invariância, wildcards, PECS e type erasure.
- Criei Collections Question Bank.
- Comparei List, Set, Map, ArrayList, LinkedList, HashSet, TreeSet, HashMap e TreeMap.
- Revisei LinkedHashMap, ConcurrentHashMap e fail-fast.
- Criei Exceptions Question Bank.
- Revisei checked, unchecked, domínio, try-with-resources, cause e finally.
- Criei Streams Optional Question Bank.
- Revisei lazy evaluation, map, flatMap, side effects, parallel stream e Optional.
- Criei Concurrency Question Bank.
- Revisei concorrência, paralelismo, race condition, visibility e atomicidade.
- Revisei synchronized, volatile, atomics, locks, deadlock e executors.
- Revisei CompletableFuture e virtual threads.
- Relacionei concorrência ao OrderFlow.
- Criei JVM Memory Question Bank.
- Revisei heap, stack, metaspace, GC, leaks, JIT e profiling.
- Criei Java 21 Question Bank.
- Revisei records, sealed classes, pattern matching, switch expressions e virtual threads.
- Criei Live Coding Guide.
- Pratiquei clarificação, solução, testes e complexidade.
- Criei Coding Exercises.
- Preparei dez exercícios.
- Criei Behavioral Stories.
- Usei STAR.
- Preparei histórias de erro, discordância e aprendizado.
- Criei Interview Question Strategy.
- Preparei perguntas ao entrevistador.
- Criei Mock Java Interview.
- Estruturei duas rodadas.
- Gravei simulações.
- Criei Java Interview Scorecard.
- Criei Review Checklist.
- Criei Java Interview Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 708.
- Criei report, evidence e gate.
- Revisei gravações.
- Repeti o tema mais fraco.
- Não antecipei entrevista Spring JPA.
- Próxima aula: Entrevista Spring JPA.
```

---

## Referência técnica curta

- JDK.
- JVM.
- Bytecode.
- JIT.
- Pass-by-Value.
- Encapsulation.
- Polymorphism.
- Immutability.
- Record.
- Generic.
- PECS.
- Collection.
- HashMap.
- Exception.
- Stream.
- Optional.
- Concurrency.
- Atomicity.
- Visibility.
- Virtual Thread.
- Garbage Collection.
- Live Coding.
- Complexity.

Regra final:

```text
A entrevista Java do OrderFlow deve combinar conhecimento, raciocínio e honestidade: personal introduction conecta QA, automação, APIs, bancos and Java Backend, resume walkthrough prepara evidências para cada claim, Java core explica JDK, JVM, bytecode, JIT, primitives, references, pass-by-value, final, static, overload and override, OOP relaciona encapsulation, abstraction, inheritance, composition, polymorphism, cohesion and coupling ao projeto, equality review protege contracts de equals, hashCode and HashMap, immutability inclui defensive copies and records sem prometer deep immutability, generics cobre invariance, wildcards, PECS and erasure, collections compara List, Set, Map, ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap, LinkedHashMap and ConcurrentHashMap com complexidade e limites, exceptions diferenciam checked, unchecked, domain failures and resource handling, Streams and Optional abordam lazy operations, map, flatMap, side effects, parallelism and absence, concurrency explica race conditions, visibility, atomicity, synchronized, volatile, atomics, locks, deadlocks, executors, CompletableFuture and virtual threads, JVM section cobre heap, thread stacks, metaspace, GC, leaks, JIT and profiling, Java 21 inclui records, sealed classes, pattern matching, switch expressions and virtual threads, live coding segue clarificação, cases, solution, complexity, implementation, tests and review, behavioral stories usam STAR, duas mock interviews geram scorecard, report and evidence, e o gate fecha respostas, código, comunicação and improvement plan enquanto dependency injection, bean lifecycle, transactions, Spring Data, JPA, Hibernate, mappings, fetch, locks and persistence interview permanecem reservados para a aula 708.
```
