# 708 - M20.38 - Entrevista Spring JPA

## Apresentação da aula

Na aula 707, você realizou a preparação completa para uma entrevista Java.

O material anterior organizou:

- apresentação profissional;
- leitura do currículo;
- Java core;
- JVM;
- orientação a objetos;
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
- live coding;
- histórias comportamentais;
- perguntas ao entrevistador;
- duas simulações;
- scorecard;
- report, evidence e gate.

Agora você avançará para uma entrevista focada em Spring e JPA.

Esse tipo de entrevista costuma avaliar se você entende apenas anotações ou se compreende o comportamento do framework.

Perguntas comuns:

- o que o Spring resolve?
- o que é inversão de controle?
- o que é injeção de dependência?
- como um bean é criado?
- quando usar `@Component`, `@Service` e `@Repository`?
- o que é proxy?
- por que `@Transactional` pode não funcionar?
- o que acontece em self-invocation?
- como funciona propagation?
- quando o rollback ocorre?
- o que é persistence context?
- entidade JPA é igual a aggregate?
- o que é dirty checking?
- qual a diferença entre `persist` e `merge`?
- o que é lazy loading?
- o que causa N+1?
- quando usar fetch join?
- como funciona optimistic locking?
- como mapear relações?
- por que evitar `EAGER` por padrão?
- como paginar?
- como testar repository e transação?
- como tratar migrations?

Uma resposta superficial costuma repetir:

```text
Spring facilita o desenvolvimento.
```

Uma resposta profissional explica:

```text
Spring organiza a composicao,
gerencia lifecycle,
aplica proxies,
integra configuracao,
transacoes,
seguranca
e observabilidade,
mas exige compreender
o comportamento do container
para evitar erros silenciosos.
```

Nesta aula, você treinará:

- Spring Framework;
- Spring Boot;
- IoC;
- DI;
- beans;
- scopes;
- lifecycle;
- component scan;
- auto-configuration;
- configuration properties;
- profiles;
- proxies;
- AOP;
- transactions;
- propagation;
- isolation;
- rollback;
- Spring Data;
- JPA;
- Hibernate;
- persistence context;
- entity lifecycle;
- mappings;
- fetch;
- N+1;
- pagination;
- locks;
- queries;
- migrations;
- testing;
- troubleshooting;
- entrevista simulada.

A próxima aula será:

```text
709 - M20.39 - Entrevista SQL banco
```

Na aula 709, você aprofundará SQL, modelagem relacional, índices, joins, agregações, planos de execução, transações, locks, isolamento, deadlocks, normalização, performance e diagnóstico de banco.

Nesta aula, SQL será usado apenas para explicar persistência.

Ele não será o foco central.

O laboratório será:

```text
labs/m20/aula-708-entrevista-Spring-JPA/orderflow-Spring-JPA-interview
```

Regra central:

```text
uma boa entrevista Spring JPA
nao mede quantidade de anotacoes decoradas;

ela mede
se voce entende
container,
proxies,
transacoes,
persistencia
e impacto no banco.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
705:
Preparacao LinkedIn.

706:
Curriculo Java Backend.

707:
Entrevista Java.

708:
Entrevista Spring JPA.

709:
Entrevista SQL banco.

710:
Entrevista APIs REST.
```

A aula 708 utiliza como fonte:

- código Spring do OrderFlow;
- módulos application e adapters;
- composition roots;
- configuration properties;
- mappings JPA;
- migrations;
- testes de integração;
- Testcontainers;
- reports;
- evidence;
- decisões arquiteturais;
- currículo;
- respostas da aula 707.

A entrevista precisa preservar a separação arquitetural.

Spring e JPA são ferramentas dos runtimes e adapters.

O domínio não depende do framework.

Quando uma pergunta envolver regra de negócio, explique onde ela pertence.

Quando envolver persistência, explique como o adapter traduz entre aggregate e entidade JPA.

Quando envolver transação, diferencie:

- transaction boundary da aplicação;
- implementação técnica;
- commit no banco;
- publicação via Outbox;
- efeito assíncrono.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/interview-Spring-JPA
├── SPRING_JPA_INTERVIEW_CHARTER.md
├── SPRING_CORE_QUESTION_BANK.md
├── DEPENDENCY_INJECTION_QUESTION_BANK.md
├── BEAN_LIFECYCLE_QUESTION_BANK.md
├── SPRING_BOOT_QUESTION_BANK.md
├── CONFIGURATION_QUESTION_BANK.md
├── AOP_PROXY_QUESTION_BANK.md
├── TRANSACTION_QUESTION_BANK.md
├── SPRING_DATA_QUESTION_BANK.md
├── JPA_HIBERNATE_QUESTION_BANK.md
├── ENTITY_MAPPING_QUESTION_BANK.md
├── FETCHING_N_PLUS_ONE.md
├── LOCKING_QUESTION_BANK.md
├── QUERY_QUESTION_BANK.md
├── MIGRATION_QUESTION_BANK.md
├── PERSISTENCE_TESTING_GUIDE.md
├── SPRING_JPA_TROUBLESHOOTING.md
├── SPRING_JPA_CODING_EXERCISES.md
├── MOCK_SPRING_JPA_INTERVIEW.md
├── SPRING_JPA_SCORECARD.md
├── SPRING_JPA_REVIEW_CHECKLIST.md
├── SPRING_JPA_MATRIX.md
├── SPRING_JPA_RISK_REGISTER.md
├── SPRING_JPA_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/interview-Spring-JPA
├── collect-Spring-JPA-sources.ps1
├── generate-Spring-JPA-question-bank.ps1
├── validate-Spring-JPA-answers.ps1
├── run-persistence-exercises.ps1
├── run-Spring-JPA-mock-interview.ps1
├── generate-Spring-JPA-report.ps1
└── collect-Spring-JPA-evidence.ps1
```

Artifacts:

```text
reports/Spring-JPA-interview-report.yaml

contracts/Spring-JPA-interview-evidence.yaml
```

---

## Conceito essencial

### Spring é container e infraestrutura

O framework organiza objetos e cross-cutting concerns.

Ele não substitui modelagem.

### Proxy muda comportamento

Muitas features dependem de chamadas passando por proxy.

### JPA é especificação

Hibernate é implementação comum.

### Persistence context é unidade de trabalho

Entidades gerenciadas possuem identity map e dirty checking.

### Mapping influencia performance

Anotação simples pode gerar dezenas de queries.

---

## Mão na massa guiada

### 1. Criar Spring JPA Interview Charter

Arquivo:

```text
docs/interview-Spring-JPA/SPRING_JPA_INTERVIEW_CHARTER.md
```

Princípios:

```text
behavior before annotation;

container before magic;

transactions are boundaries;

JPA is not the database;

queries are observed;

mappings require trade-offs;

SQL interview belongs to lesson 709.
```

---

## Spring Core

### 2. Criar Spring Core Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/SPRING_CORE_QUESTION_BANK.md
```

---

### 3. Explicar IoC

Inversão de controle significa que a criação, configuração e lifecycle de componentes são transferidos ao container.

---

### 4. Explicar DI

Injeção de dependência fornece colaboradores a um objeto sem que ele os construa diretamente.

---

### 5. Defender injeção por construtor

Benefícios:

- dependências explícitas;
- imutabilidade de referência;
- teste simples;
- falha rápida;
- ausência de dependência opcional oculta.

---

### 6. Comparar field injection

Problemas:

- dependência escondida;
- teste difícil;
- mutabilidade;
- reflexão;
- objeto inválido fora do container.

---

### 7. Explicar bean

Bean é objeto gerenciado pelo container Spring.

---

### 8. Comparar stereotypes

`@Component`:

- genérico.

`@Service`:

- semântica de serviço.

`@Repository`:

- semântica de persistência;
- tradução de exceptions.

`@Controller` e `@RestController`:

- entrada HTTP.

---

### 9. Explicar `@Configuration`

Classe de configuração declara beans e composição explícita.

---

### 10. Explicar `@Bean`

Útil para:

- bibliotecas externas;
- composition root;
- configuração explícita;
- criação customizada.

---

### 11. Explicar component scan

Descobre componentes em packages definidos.

Scan amplo pode registrar beans não intencionais.

---

### 12. Explicar ambiguity

Quando existem múltiplos beans do mesmo tipo, use:

- `@Primary`;
- `@Qualifier`;
- configuração explícita.

A escolha precisa permanecer clara.

---

## Lifecycle e scopes

### 13. Criar Bean Lifecycle Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/BEAN_LIFECYCLE_QUESTION_BANK.md
```

---

### 14. Explicar criação

Fluxo simplificado:

```text
instanciacao;

injecao;

post-processors;

init;

uso;

destroy.
```

---

### 15. Explicar `@PostConstruct`

Executa após injeção.

Evite trabalho pesado ou dependência de rede sem controle.

---

### 16. Explicar `@PreDestroy`

Permite cleanup em shutdown normal.

---

### 17. Explicar BeanPostProcessor

Pode modificar ou substituir beans, inclusive criando proxies.

---

### 18. Explicar singleton scope

Uma instância por application context, não singleton global da JVM.

---

### 19. Explicar prototype

Nova instância a cada solicitação ao container.

O container não gerencia todo o destroy lifecycle do prototype.

---

### 20. Explicar request scope

Uma instância por request HTTP.

---

### 21. Explicar thread safety de singleton

Singleton não é automaticamente thread-safe.

Beans stateless são mais seguros.

---

### 22. Explicar circular dependency

Construtor expõe o problema cedo.

A solução preferida é revisar responsabilidades, não apenas habilitar ciclo.

---

## Spring Boot

### 23. Criar Spring Boot Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/SPRING_BOOT_QUESTION_BANK.md
```

---

### 24. Explicar Spring Boot

Spring Boot reduz configuração inicial por:

- starters;
- auto-configuration;
- embedded server;
- actuator;
- conventions.

---

### 25. Explicar starter

Agrupa dependências compatíveis para uma capacidade.

---

### 26. Explicar auto-configuration

Cria beans condicionais com base em:

- classpath;
- properties;
- beans existentes;
- environment.

---

### 27. Explicar back-off

Auto-configuração recua quando o usuário fornece bean próprio, conforme a condição definida.

---

### 28. Explicar `@SpringBootApplication`

Combina:

- configuration;
- auto-configuration;
- component scan.

---

### 29. Explicar actuator

Fornece endpoints operacionais.

A exposição precisa ser segura.

---

### 30. Explicar startup failure

Falhar cedo em configuração inválida é melhor do que iniciar degradado silenciosamente.

---

## Configuração

### 31. Criar Configuration Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/CONFIGURATION_QUESTION_BANK.md
```

---

### 32. Explicar externalized configuration

Configuração pode vir de:

- YAML;
- properties;
- environment;
- command line;
- secret store;
- configuração do runtime.

---

### 33. Explicar precedence

Fontes possuem ordem de precedência.

A resposta deve reconhecer que o detalhe pode variar por versão e contexto.

---

### 34. Defender `@ConfigurationProperties`

Benefícios:

- agrupamento;
- type safety;
- validação;
- documentação;
- teste.

---

### 35. Comparar `@Value`

Adequado para poucos valores.

Pode espalhar configuração e reduzir validação estrutural.

---

### 36. Explicar profiles

Profiles selecionam configuração e adapters.

Não devem alterar regra de negócio.

---

### 37. Explicar validação

Use Bean Validation para falhar no startup.

---

### 38. Explicar secrets

Secrets não devem estar versionados.

Eles entram por runtime injection ou secret manager.

---

### 39. Explicar configuração default

Default deve ser seguro.

Quando ausência é risco, falhe.

---

## AOP e proxies

### 40. Criar AOP Proxy Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/AOP_PROXY_QUESTION_BANK.md
```

---

### 41. Explicar AOP

Aspect-Oriented Programming aplica comportamento transversal em pontos definidos.

Exemplos:

- transação;
- segurança;
- cache;
- métricas.

---

### 42. Explicar proxy

O proxy intercepta chamada e adiciona comportamento.

---

### 43. Comparar JDK proxy e class proxy

JDK proxy usa interfaces.

Class proxy cria subclasse quando possível.

Métodos finais podem impedir interceptação por subclass proxy.

---

### 44. Explicar self-invocation

Uma chamada interna:

```text
this.metodo()
```

não passa pelo proxy externo.

Anotação transacional ou de cache pode não ser aplicada.

---

### 45. Explicar solução para self-invocation

Preferências:

- mover boundary para outro bean;
- reorganizar responsabilidade;
- usar programação transacional explícita quando justificada.

Evite obter o próprio bean como primeira solução.

---

### 46. Explicar private method

Método privado não é interceptado por proxy comum.

---

### 47. Explicar order de aspects

Quando múltiplos aspects existem, ordem pode alterar comportamento.

---

## Transações

### 48. Criar Transaction Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/TRANSACTION_QUESTION_BANK.md
```

---

### 49. Explicar `@Transactional`

Define boundary transacional aplicado normalmente por proxy.

---

### 50. Explicar commit

O commit ocorre ao final da transação, se não houver rollback.

Flush pode ocorrer antes.

---

### 51. Explicar rollback default

Por padrão, exceptions unchecked causam rollback.

Checked exceptions exigem configuração quando desejado.

---

### 52. Explicar `rollbackFor`

Use com intenção.

Não marque qualquer exception sem entender o contrato.

---

### 53. Explicar propagation REQUIRED

Participa da transação existente ou cria uma.

---

### 54. Explicar REQUIRES_NEW

Suspende a transação atual e cria outra.

Pode produzir efeitos independentes.

---

### 55. Explicar SUPPORTS

Participa se existir, caso contrário executa sem transação.

---

### 56. Explicar MANDATORY

Exige transação existente.

---

### 57. Explicar NEVER

Falha se houver transação.

---

### 58. Explicar NESTED

Depende de savepoints e suporte do transaction manager.

Não é igual a REQUIRES_NEW.

---

### 59. Explicar isolation

Níveis controlam fenômenos concorrentes.

A escolha precisa considerar banco e requisito.

---

### 60. Explicar read-only

É uma dica de otimização e intenção.

Não deve ser tratada como garantia absoluta de impossibilidade de escrita.

---

### 61. Explicar timeout

Evita transações indefinidas.

---

### 62. Explicar boundary correto

Transação deve envolver unidade de trabalho.

Não coloque chamadas de provider lento dentro de transação de banco sem análise.

---

### 63. Relacionar com Outbox

Aggregate, audit e Outbox são persistidos na mesma transação local.

---

### 64. Explicar evento após commit

Quando efeito precisa ocorrer após commit, use mecanismo apropriado e entenda falhas.

Outbox oferece persistência durável.

---

## Spring Data

### 65. Criar Spring Data Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/SPRING_DATA_QUESTION_BANK.md
```

---

### 66. Explicar repository abstraction

Spring Data reduz boilerplate de acesso a dados.

Não elimina necessidade de entender SQL, transações e planos.

---

### 67. Explicar query derivation

Métodos podem gerar query pelo nome.

Nomes muito complexos indicam necessidade de query explícita.

---

### 68. Explicar `@Query`

Permite JPQL ou native SQL conforme configuração.

---

### 69. Explicar paginação

`Page` inclui total.

`Slice` informa apenas continuidade.

Count pode ser caro.

---

### 70. Explicar sorting

Ordenação precisa usar campos permitidos.

Não aceite qualquer entrada sem validação.

---

### 71. Explicar projections

Projections reduzem dados carregados.

Podem ser interfaces, DTOs ou records conforme uso.

---

### 72. Explicar Specifications

Permitem composição dinâmica de predicates.

Uso excessivo pode esconder queries complexas.

---

### 73. Explicar repository no boundary

Spring Data repository permanece dentro do adapter de persistência.

---

## JPA e Hibernate

### 74. Criar JPA Hibernate Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/JPA_HIBERNATE_QUESTION_BANK.md
```

---

### 75. Diferenciar JPA e Hibernate

JPA:

- especificação.

Hibernate:

- implementação e recursos adicionais.

---

### 76. Explicar entity

Entidade JPA representa estado persistente.

Ela não precisa ser igual ao aggregate de domínio.

---

### 77. Explicar persistence context

Mantém entidades gerenciadas e identidade por chave.

---

### 78. Explicar estados da entidade

- transient;
- managed;
- detached;
- removed.

---

### 79. Explicar `persist`

Torna nova entidade gerenciada.

---

### 80. Explicar `merge`

Copia estado para uma instância gerenciada e retorna essa instância.

O objeto original continua detached.

---

### 81. Explicar dirty checking

Mudanças em entidade gerenciada são detectadas e sincronizadas no flush.

---

### 82. Explicar flush

Sincroniza alterações com banco, mas não necessariamente commita.

---

### 83. Explicar first-level cache

É associado ao persistence context.

---

### 84. Explicar second-level cache

É opcional e compartilhado além do context.

Exige estratégia de invalidação e medição.

---

### 85. Explicar identidade

Duas consultas da mesma entidade no mesmo context normalmente retornam a mesma instância gerenciada.

---

### 86. Explicar Open Session in View

Mantém context durante request.

Pode esconder lazy loading e gerar queries na camada web.

No backend orientado a boundaries, prefira carregar o necessário no caso de uso.

---

## Mappings

### 87. Criar Entity Mapping Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/ENTITY_MAPPING_QUESTION_BANK.md
```

---

### 88. Explicar `@Id`

Identifica a entidade.

Estratégia de geração precisa considerar banco, batch e domínio.

---

### 89. Comparar IDENTITY e SEQUENCE

IDENTITY depende do insert para obter ID e pode limitar batching.

SEQUENCE permite alocação antecipada em bancos compatíveis.

---

### 90. Explicar `@Version`

Suporta optimistic locking.

---

### 91. Explicar `@Enumerated`

Prefira STRING para legibilidade.

Renomear enum exige cuidado.

---

### 92. Explicar `@Embeddable`

Agrupa valores persistidos na mesma tabela.

---

### 93. Explicar `@OneToMany`

Relação pode gerar grande volume.

Defina owner, fetch, cascade e orphan removal com cuidado.

---

### 94. Explicar owner da relação

O lado owner possui a FK ou join mapping que controla atualização.

---

### 95. Explicar mappedBy

Indica lado inverso.

---

### 96. Explicar cascade

Cascade propaga operações de lifecycle.

Não significa regra de negócio.

---

### 97. Explicar orphanRemoval

Remove filho quando deixa de pertencer à associação.

Use somente quando lifecycle é realmente dependente.

---

### 98. Explicar many-to-many

Frequentemente é melhor modelar entidade associativa quando existem atributos ou lifecycle.

---

### 99. Explicar `equals` em entidades

Evite depender de coleções mutáveis ou ID gerado de forma inconsistente.

---

### 100. Explicar DTO mapping

Entidade JPA não deve vazar para API.

---

## Fetching e N+1

### 101. Criar Fetching N Plus One

Arquivo:

```text
docs/interview-Spring-JPA/FETCHING_N_PLUS_ONE.md
```

---

### 102. Explicar LAZY

Carrega associação quando acessada.

Pode falhar fora do context.

---

### 103. Explicar EAGER

Carrega automaticamente, mas não garante uma única query e pode causar excesso.

---

### 104. Defender LAZY por padrão

Carregue explicitamente conforme caso de uso.

---

### 105. Explicar N+1

Uma query carrega pais e outras N queries carregam associações.

---

### 106. Detectar N+1

Use:

- logs SQL;
- statistics;
- profiler;
- testes de count;
- observabilidade.

---

### 107. Corrigir N+1

Opções:

- fetch join;
- entity graph;
- projection;
- batch fetching;
- query dedicada.

---

### 108. Explicar fetch join com paginação

Collection fetch join pode duplicar linhas e dificultar paginação.

---

### 109. Explicar entity graph

Define fetch plan para uma consulta.

---

### 110. Explicar batch size

Pode reduzir queries, mas não substitui desenho correto.

---

## Locks

### 111. Criar Locking Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/LOCKING_QUESTION_BANK.md
```

---

### 112. Explicar optimistic locking

Usa versão e detecta conflito no update.

---

### 113. Explicar `OptimisticLockException`

Indica que outra transação alterou o registro.

A aplicação decide retry, conflito ou reconciliação.

---

### 114. Explicar pessimistic lock

Solicita lock no banco.

Pode aumentar espera e deadlock.

---

### 115. Explicar quando usar

Quando conflito é frequente e custo de retry é alto, após medição.

---

### 116. Explicar lock timeout

Evita espera indefinida.

---

### 117. Relacionar com OrderFlow

Versão do aggregate protege transições concorrentes.

---

## Queries

### 118. Criar Query Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/QUERY_QUESTION_BANK.md
```

---

### 119. Comparar JPQL e SQL nativo

JPQL trabalha com entidades e atributos.

Native SQL usa recursos específicos do banco.

---

### 120. Explicar Criteria API

Permite construção programática tipada parcialmente, mas pode ser verbosa.

---

### 121. Explicar DTO projection

Retorna apenas dados necessários.

---

### 122. Explicar count query

Paginação pode exigir count separado.

Otimize quando necessário.

---

### 123. Explicar bulk update

Bulk update ignora estado já carregado no persistence context.

Pode ser necessário clear ou refresh.

---

### 124. Explicar query hints

Hints dependem do provider e devem ser medidos.

---

### 125. Explicar tenant filter

Toda query funcional precisa respeitar tenant.

---

## Migrations

### 126. Criar Migration Question Bank

Arquivo:

```text
docs/interview-Spring-JPA/MIGRATION_QUESTION_BANK.md
```

---

### 127. Defender Flyway

Versiona schema e torna ambiente reproduzível.

---

### 128. Explicar migration imutável

Depois de aplicada e compartilhada, não deve ser editada.

Crie nova migration.

---

### 129. Explicar backward compatibility

Deploy gradual pode exigir:

- expand;
- migrate;
- contract.

---

### 130. Explicar índice em produção

Criação pode bloquear.

Avalie recurso do banco, volume e janela.

---

### 131. Explicar default e not null

Migração precisa tratar dados existentes.

---

### 132. Explicar rollback

Nem toda migration possui rollback automático seguro.

Planeje roll-forward.

---

## Testes de persistência

### 133. Criar Persistence Testing Guide

Arquivo:

```text
docs/interview-Spring-JPA/PERSISTENCE_TESTING_GUIDE.md
```

---

### 134. Explicar unit test

Testa mapper ou policy sem banco.

---

### 135. Explicar slice test

`@DataJpaTest` carrega parte de persistência.

---

### 136. Explicar Testcontainers

Usa banco real compatível com produção.

---

### 137. Explicar rollback de testes

Teste transacional pode esconder comportamento após commit.

---

### 138. Testar constraints

Valide:

- unique;
- FK;
- not null;
- optimistic lock;
- tenant.

---

### 139. Testar queries

Inclua:

- resultado;
- ausência;
- paginação;
- ordenação;
- N+1;
- performance básica.

---

### 140. Testar migrations

Suba banco vazio e aplique todas.

---

## Troubleshooting

### 141. Criar Spring JPA Troubleshooting

Arquivo:

```text
docs/interview-Spring-JPA/SPRING_JPA_TROUBLESHOOTING.md
```

---

### 142. Diagnosticar bean ausente

Verifique:

- scan;
- condition;
- profile;
- qualifier;
- configuration;
- classpath.

---

### 143. Diagnosticar transaction não aplicada

Verifique:

- proxy;
- self-invocation;
- visibility;
- exception;
- transaction manager;
- boundary.

---

### 144. Diagnosticar LazyInitializationException

A causa é acesso lazy fora do context.

Corrija fetch plan, não apenas abra sessão globalmente.

---

### 145. Diagnosticar N+1

Observe SQL e acesso a associações.

---

### 146. Diagnosticar detached entity

Verifique lifecycle e uso incorreto de persist/merge.

---

### 147. Diagnosticar duplicate key

Verifique idempotência, constraint e concorrência.

---

### 148. Diagnosticar deadlock

Colete queries, ordem de locks e transactions.

---

## Exercícios

### 149. Criar Spring JPA Coding Exercises

Arquivo:

```text
docs/interview-Spring-JPA/SPRING_JPA_CODING_EXERCISES.md
```

---

### 150. Exercício 1: configuração tipada

Crie `@ConfigurationProperties` para provider com timeout e validação.

---

### 151. Exercício 2: transaction boundary

Implemente caso de uso que salva aggregate, audit e Outbox.

---

### 152. Exercício 3: self-invocation

Identifique por que `@Transactional` não funciona e reorganize beans.

---

### 153. Exercício 4: mapping

Mapeie Order e OrderItem com lifecycle correto.

---

### 154. Exercício 5: N+1

Detecte e corrija consulta de pedidos com itens.

---

### 155. Exercício 6: optimistic lock

Simule duas atualizações concorrentes.

---

### 156. Exercício 7: projection

Crie consulta de resumo sem carregar aggregate completo.

---

### 157. Exercício 8: migration

Adicione coluna not null em tabela com dados usando etapas seguras.

---

### 158. Exercício 9: tenant

Garanta filtro de tenant em repository adapter.

---

### 159. Exercício 10: test

Crie Testcontainers para repository, lock e migration.

---

## Simulação

### 160. Criar Mock Spring JPA Interview

Arquivo:

```text
docs/interview-Spring-JPA/MOCK_SPRING_JPA_INTERVIEW.md
```

Duração:

```text
75 a 90 minutos.
```

---

### 161. Estruturar simulação

1. Spring core;
2. DI;
3. lifecycle;
4. Boot;
5. config;
6. proxy;
7. transaction;
8. Spring Data;
9. JPA;
10. mappings;
11. fetching;
12. locks;
13. migration;
14. coding;
15. troubleshooting.

---

### 162. Criar follow-ups

Exemplos:

- e se for self-invocation?
- e se exception for checked?
- e se a associação tiver mil itens?
- e se duas transações atualizarem?
- e se o count for caro?
- e se migration precisar rollback?

---

### 163. Gravar a entrevista

---

### 164. Criar Spring JPA Scorecard

Arquivo:

```text
docs/interview-Spring-JPA/SPRING_JPA_SCORECARD.md
```

Critérios:

- Spring core;
- DI;
- lifecycle;
- Boot;
- config;
- AOP;
- transactions;
- Spring Data;
- JPA;
- mappings;
- fetching;
- locks;
- migrations;
- testing;
- troubleshooting;
- comunicação.

---

### 165. Criar Review Checklist

Arquivo:

```text
docs/interview-Spring-JPA/SPRING_JPA_REVIEW_CHECKLIST.md
```

Perguntas:

- expliquei comportamento?
- mencionei proxy?
- diferenciei flush e commit?
- diferenciei JPA e Hibernate?
- considerei banco?
- tratei N+1?
- expliquei lock?
- usei evidence?
- admiti limite?
- evitei antecipar SQL?

---

### 166. Criar Matrix

Arquivo:

```text
docs/interview-Spring-JPA/SPRING_JPA_MATRIX.md
```

Colunas:

- tema;
- pergunta;
- resposta curta;
- aprofundamento;
- exemplo OrderFlow;
- evidence;
- score;
- revisão.

---

### 167. Criar Risk Register

Arquivo:

```text
docs/interview-Spring-JPA/SPRING_JPA_RISK_REGISTER.md
```

Riscos:

```text
anotacao decorada;

proxy ignorado;

self-invocation;

transaction longa;

JPA confundida com banco;

EAGER por padrao;

N plus one ignorado;

migration editada;

SQL antecipado;

feedback nao registrado.
```

---

### 168. Criar Traceability

Arquivo:

```text
docs/interview-Spring-JPA/SPRING_JPA_TRACEABILITY.md
```

Exemplo:

```text
transaction boundary
-> application handler
-> transaction adapter
-> integration test.

optimistic lock
-> version field
-> concurrency test.

N plus one
-> query report
-> fetch correction
-> performance evidence.
```

---

### 169. Criar boundary da próxima aula

Arquivo:

```text
docs/interview-Spring-JPA/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 708 define:

- Spring core;
- IoC;
- dependency injection;
- bean lifecycle;
- scopes;
- Spring Boot;
- auto-configuration;
- configuration properties;
- profiles;
- AOP;
- proxies;
- transactions;
- propagation;
- isolation;
- Spring Data;
- JPA;
- Hibernate;
- entity lifecycle;
- mappings;
- fetch;
- N plus one;
- locks;
- queries;
- migrations;
- persistence testing;
- mock interview.

A aula 709 define:

- relational modeling;
- SQL syntax;
- joins;
- grouping;
- window functions;
- subqueries;
- CTEs;
- indexes;
- execution plans;
- transactions;
- isolation;
- locks;
- deadlocks;
- normalization;
- denormalization;
- database performance;
- SQL interview simulation.

Nenhuma entrevista SQL banco
e executada nesta aula.
```

---

## Validação final

### 170. Criar report

Arquivo:

```text
reports/Spring-JPA-interview-report.yaml
```

Exemplo:

```yaml
SpringJPAInterview:
  questionBank:
    total:
      measured
    answered:
      measured

  scores:
    SpringCore:
      measured
    dependencyInjection:
      measured
    transactions:
      measured
    JPA:
      measured
    mappings:
      measured
    fetching:
      measured
    locks:
      measured
    migrations:
      measured
    testing:
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

  SQLDatabaseInterview:
    completed:
      false

  gate:
    PASS
```

---

### 171. Criar evidence

Arquivo:

```text
contracts/Spring-JPA-interview-evidence.yaml
```

Campos:

- lesson;
- project;
- Spring core question count;
- DI question count;
- lifecycle question count;
- Boot question count;
- configuration question count;
- AOP question count;
- transaction question count;
- Spring Data question count;
- JPA question count;
- mapping question count;
- fetch question count;
- lock question count;
- query question count;
- migration question count;
- testing question count;
- coding exercise count;
- completed exercise count;
- mock interview duration;
- average score;
- lowest topic;
- highest topic;
- unsupported answer count;
- contradiction count;
- admitted uncertainty count;
- SQL database interview completed;
- documentation status;
- gate status;
- timestamp.

---

### 172. Criar gate

Status:

```text
PASS;

FAIL_SPRING_CORE;

FAIL_DEPENDENCY_INJECTION;

FAIL_BEAN_LIFECYCLE;

FAIL_SPRING_BOOT;

FAIL_CONFIGURATION;

FAIL_AOP_PROXY;

FAIL_TRANSACTION;

FAIL_PROPAGATION;

FAIL_ISOLATION;

FAIL_SPRING_DATA;

FAIL_JPA;

FAIL_HIBERNATE;

FAIL_ENTITY_LIFECYCLE;

FAIL_MAPPING;

FAIL_FETCHING;

FAIL_N_PLUS_ONE;

FAIL_LOCKING;

FAIL_QUERY;

FAIL_MIGRATION;

FAIL_PERSISTENCE_TESTING;

FAIL_TROUBLESHOOTING;

FAIL_CODING_EXERCISE;

FAIL_MOCK_INTERVIEW;

FAIL_UNSUPPORTED_ANSWER;

FAIL_CONTRADICTION;

FAIL_SQL_DATABASE_ANTICIPATION;

INCONCLUSIVE.
```

---

### 173. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\interview-Spring-JPA\collect-Spring-JPA-sources.ps1

.\scripts\interview-Spring-JPA\generate-Spring-JPA-question-bank.ps1

.\scripts\interview-Spring-JPA\validate-Spring-JPA-answers.ps1

.\scripts\interview-Spring-JPA\run-persistence-exercises.ps1

.\scripts\interview-Spring-JPA\collect-Spring-JPA-evidence.ps1
```

---

### 174. Executar duas rodadas

Rodada 1:

```text
conceitual e colaborativa.
```

Rodada 2:

```text
troubleshooting e follow-ups.
```

---

### 175. Revisar gravações

Selecione:

- três respostas fortes;
- três respostas superficiais;
- dois erros de transaction;
- dois erros de mapping;
- um plano de melhoria.

---

### 176. Repetir o tema mais fraco

---

### 177. Encerrar o laboratório

Confirme:

- Charter;
- Spring core;
- IoC;
- DI;
- lifecycle;
- scopes;
- Boot;
- auto-config;
- config;
- profiles;
- AOP;
- proxies;
- transaction;
- propagation;
- isolation;
- Spring Data;
- JPA;
- Hibernate;
- lifecycle de entidade;
- mappings;
- fetch;
- N+1;
- locks;
- queries;
- migrations;
- testing;
- troubleshooting;
- exercises;
- mock;
- scorecard;
- matrix;
- risks;
- traceability;
- report;
- evidence;
- gate aprovado;
- aula 709 preservada.

---

## Entendendo o que foi feito

### Spring deixou de parecer magia

Container, lifecycle, conditions e proxies foram explicados.

### Injeção ganhou critério

Construtores tornaram dependências explícitas.

### Transações ganharam boundary

Propagation, rollback, flush e commit deixaram de ser confundidos.

### JPA ganhou lifecycle

Managed, detached, dirty checking e persistence context foram revisados.

### Mapping ganhou impacto operacional

Fetch, cascade e relações foram ligados a queries e locks.

### N+1 ganhou diagnóstico

Logs, statistics, tests e fetch plans foram usados.

### Locks ganharam decisão

Optimistic e pessimistic foram comparados por contenção e custo.

### Migrations ganharam segurança

Imutabilidade, compatibilidade e roll-forward foram reforçados.

### A entrevista ganhou troubleshooting

Você passou a explicar falhas reais, não apenas definições.

---

## Erros comuns importantes

### Dizer que Spring cria tudo automaticamente

Conditions e configuration importam.

### Usar field injection

Dependências ficam escondidas.

### Ignorar proxy

`@Transactional` pode não ser aplicado.

### Confundir flush e commit

Flush sincroniza; commit finaliza.

### Usar EAGER para evitar LazyInitializationException

Pode criar carga excessiva.

### Mapear aggregate diretamente como entity

Boundaries podem se misturar.

### Tratar merge como update do mesmo objeto

Merge retorna outra instância gerenciada.

### Ignorar count de paginação

Pode ser caro.

### Editar migration aplicada

O histórico fica inconsistente.

### Antecipar entrevista SQL

Essa etapa pertence à aula 709.

---

## Comandos úteis

### Gerar perguntas

```powershell
.\scripts\interview-Spring-JPA\generate-Spring-JPA-question-bank.ps1
```

### Validar respostas

```powershell
.\scripts\interview-Spring-JPA\validate-Spring-JPA-answers.ps1
```

### Executar exercícios

```powershell
.\scripts\interview-Spring-JPA\run-persistence-exercises.ps1
```

### Coletar evidence

```powershell
.\scripts\interview-Spring-JPA\collect-Spring-JPA-evidence.ps1
```

---

## Exercício principal

Realize uma entrevista simulada de 85 minutos.

Inclua:

1. IoC;
2. DI;
3. constructor injection;
4. bean;
5. stereotypes;
6. lifecycle;
7. scopes;
8. Spring Boot;
9. auto-configuration;
10. configuration properties;
11. profiles;
12. AOP;
13. proxy;
14. self-invocation;
15. `@Transactional`;
16. rollback;
17. propagation;
18. isolation;
19. read-only;
20. Spring Data;
21. query derivation;
22. pagination;
23. JPA e Hibernate;
24. persistence context;
25. entity states;
26. persist e merge;
27. dirty checking;
28. flush;
29. cache;
30. mappings;
31. cascade;
32. orphan removal;
33. LAZY;
34. EAGER;
35. N+1;
36. fetch join;
37. optimistic lock;
38. pessimistic lock;
39. migration;
40. Testcontainers;
41. troubleshooting;
42. exercício;
43. feedback;
44. plano de melhoria.

Não realize a entrevista SQL banco.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 707 e ponte para a aula 709 foram preservadas;
- Spring JPA Interview Charter foi criado;
- Spring Core Question Bank foi criado;
- IoC foi explicado;
- DI foi explicada;
- constructor injection foi defendida;
- field injection foi comparada;
- bean foi explicado;
- stereotypes foram comparados;
- configuration e bean foram explicados;
- component scan foi explicado;
- ambiguidades foram tratadas;
- Bean Lifecycle Question Bank foi criado;
- criação de bean foi explicada;
- post construct e pre destroy foram explicados;
- BeanPostProcessor foi explicado;
- singleton, prototype e request foram explicados;
- thread safety foi explicada;
- circular dependency foi tratada;
- Spring Boot Question Bank foi criado;
- Boot, starters e auto-configuration foram explicados;
- back-off foi explicado;
- SpringBootApplication foi explicado;
- actuator foi explicado;
- startup failure foi tratado;
- Configuration Question Bank foi criado;
- configuração externa foi explicada;
- precedence foi tratada;
- ConfigurationProperties foi defendida;
- Value foi comparado;
- profiles foram explicados;
- validação foi explicada;
- secrets foram tratados;
- defaults seguros foram explicados;
- AOP Proxy Question Bank foi criado;
- AOP foi explicado;
- proxy foi explicado;
- proxies JDK e class foram comparados;
- self-invocation foi explicada;
- soluções foram apresentadas;
- private method foi tratado;
- ordem de aspects foi tratada;
- Transaction Question Bank foi criado;
- Transactional foi explicado;
- commit e flush foram diferenciados;
- rollback default foi explicado;
- rollbackFor foi explicado;
- REQUIRED, REQUIRES_NEW, SUPPORTS, MANDATORY, NEVER e NESTED foram explicados;
- isolation foi explicada;
- read-only foi explicado;
- timeout foi explicado;
- boundary correto foi explicado;
- Outbox foi relacionada;
- efeito após commit foi tratado;
- Spring Data Question Bank foi criado;
- repository abstraction foi explicada;
- query derivation foi explicada;
- Query foi explicada;
- Page e Slice foram comparados;
- sorting foi tratado;
- projections foram explicadas;
- Specifications foram explicadas;
- repository ficou no adapter;
- JPA Hibernate Question Bank foi criado;
- JPA e Hibernate foram diferenciados;
- entity foi explicada;
- persistence context foi explicado;
- estados da entidade foram explicados;
- persist e merge foram comparados;
- dirty checking foi explicado;
- flush foi explicado;
- first-level e second-level cache foram explicados;
- identidade foi explicada;
- Open Session in View foi discutido;
- Entity Mapping Question Bank foi criado;
- ID e estratégias foram explicados;
- Version foi explicada;
- Enum foi explicado;
- Embeddable foi explicado;
- OneToMany foi explicado;
- owner e mappedBy foram explicados;
- cascade foi explicado;
- orphanRemoval foi explicado;
- many-to-many foi tratado;
- equals em entidades foi tratado;
- DTO mapping foi defendido;
- Fetching N Plus One foi criado;
- LAZY e EAGER foram explicados;
- LAZY foi defendido por padrão;
- N+1 foi explicado;
- detecção foi explicada;
- correções foram apresentadas;
- fetch join e paginação foram tratados;
- entity graph foi explicado;
- batch size foi explicado;
- Locking Question Bank foi criado;
- optimistic lock foi explicado;
- OptimisticLockException foi explicada;
- pessimistic lock foi explicado;
- quando usar foi explicado;
- lock timeout foi explicado;
- OrderFlow foi relacionado;
- Query Question Bank foi criado;
- JPQL e native foram comparados;
- Criteria foi explicado;
- DTO projection foi explicada;
- count query foi explicada;
- bulk update foi explicado;
- hints foram explicadas;
- tenant filter foi explicado;
- Migration Question Bank foi criado;
- Flyway foi defendido;
- migration imutável foi explicada;
- compatibilidade foi explicada;
- índice foi tratado;
- default e not null foram tratados;
- rollback foi explicado;
- Persistence Testing Guide foi criado;
- unit, slice e Testcontainers foram explicados;
- rollback de teste foi tratado;
- constraints, queries e migrations foram testadas;
- Troubleshooting foi criado;
- bean ausente foi diagnosticado;
- transaction não aplicada foi diagnosticada;
- LazyInitializationException foi diagnosticada;
- N+1 foi diagnosticado;
- detached entity foi diagnosticada;
- duplicate key foi diagnosticada;
- deadlock foi diagnosticado;
- Coding Exercises foi criado;
- dez exercícios foram preparados;
- Mock Interview foi criado;
- simulação foi estruturada;
- follow-ups foram criados;
- entrevista foi gravada;
- Scorecard foi criado;
- Review Checklist foi criado;
- Matrix foi criada;
- Risk Register foi criado;
- Traceability foi criada;
- boundary da aula 709 foi criado;
- report, evidence e gate foram criados;
- validators foram executados;
- duas rodadas foram executadas;
- gravações foram revisadas;
- tema fraco foi repetido;
- commit recomendado e diário de bordo estão presentes;
- entrevista SQL banco não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\interview-Spring-JPA\validate-Spring-JPA-answers.ps1

.\scripts\interview-Spring-JPA\run-persistence-exercises.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/interview-Spring-JPA `
  scripts/interview-Spring-JPA `
  reports/Spring-JPA-interview-report.yaml `
  contracts/Spring-JPA-interview-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|production-database-secret|memorized-false-answer|SQL-database-mock|realTenant|realCustomer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(interview): prepare Spring JPA interview"
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

- credencial;
- connection string real;
- resposta falsa;
- entrevista detalhada da aula 709.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou a preparação completa para uma entrevista Spring JPA.

Você estruturou:

```text
Spring core;

IoC;

dependency injection;

bean lifecycle;

scopes;

Spring Boot;

auto-configuration;

configuration;

profiles;

AOP;

proxies;

transactions;

propagation;

isolation;

Spring Data;

JPA;

Hibernate;

entity lifecycle;

mappings;

fetching;

N plus one;

locks;

queries;

migrations;

persistence tests;

troubleshooting;

coding exercises;

mock interview;

scorecard;

report e evidence.
```

Agora você consegue explicar o framework como comportamento, não apenas como conjunto de anotações.

A próxima aula será:

```text
709 - M20.39 - Entrevista SQL banco
```

Nela, você treinará modelagem relacional, consultas, joins, agregações, window functions, subqueries, CTEs, índices, planos de execução, transações, locks, isolamento, deadlocks, normalização e performance de banco.

Nenhuma entrevista SQL banco foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Revisei Spring Core.
- [ ] Revisei DI e lifecycle.
- [ ] Revisei Spring Boot.
- [ ] Revisei configuração.
- [ ] Revisei proxies.
- [ ] Revisei transações.
- [ ] Revisei Spring Data.
- [ ] Revisei JPA e Hibernate.
- [ ] Revisei mappings.
- [ ] Revisei fetch e N+1.
- [ ] Revisei locks.
- [ ] Revisei migrations.
- [ ] Executei exercícios.
- [ ] Gravei simulações.
- [ ] Preservei SQL banco para a aula 709.

---

## Troubleshooting adicional

### Não consigo explicar proxy

Use o fluxo cliente, proxy e bean alvo.

### Transactional não funciona

Verifique self-invocation e visibility.

### Confundo flush e commit

Lembre que flush sincroniza e commit encerra.

### Merge parece update

Explique a instância retornada.

### Lazy falha no controller

Carregue o necessário no caso de uso.

### N+1 não aparece em teste pequeno

Conte queries e use dados suficientes.

### Cascade causa delete inesperado

Revise lifecycle e orphan removal.

### Optimistic lock parece erro técnico

Explique conflito de negócio.

### Migration precisa alterar coluna existente

Use passos compatíveis.

### Quero aprofundar SQL

Essa etapa pertence à aula 709.

---

## Perguntas de revisão

1. O que IoC transfere?
2. Por que constructor injection?
3. Singleton é thread-safe?
4. O que auto-configuration usa?
5. Profiles podem mudar regra?
6. O que proxy faz?
7. Self-invocation passa pelo proxy?
8. Flush é commit?
9. Checked exception causa rollback por padrão?
10. REQUIRES_NEW participa da atual?
11. JPA é Hibernate?
12. O que persistence context mantém?
13. Merge gerencia o objeto original?
14. O que dirty checking faz?
15. EAGER evita N+1?
16. O que causa N+1?
17. Quando usar optimistic lock?
18. Cascade é regra de negócio?
19. Por que não editar migration aplicada?
20. Teste transacional prova after commit?
21. O que Testcontainers melhora?
22. O que a aula 709 fará?
23. O que não foi executado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Criação e lifecycle.
2. Dependências explícitas.
3. Não.
4. Classpath, properties e beans.
5. Não.
6. Intercepta chamadas.
7. Não.
8. Não.
9. Não.
10. Não.
11. Não.
12. Entidades gerenciadas.
13. Não.
14. Detecta mudanças.
15. Não.
16. Acesso repetido a associações.
17. Conflito ocasional.
18. Não.
19. Preservar histórico.
20. Nem sempre.
21. Banco real.
22. Entrevista SQL banco.
23. SQL aprofundado.
24. Entrevista SQL banco.
25. Entender container, transação e persistência.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 708 - M20.38 - Entrevista Spring JPA

- Continuei após Entrevista Java.
- Criei Spring JPA Interview Charter.
- Criei Spring Core Question Bank.
- Revisei IoC, DI e constructor injection.
- Comparei field injection.
- Revisei beans, stereotypes, configuration e component scan.
- Criei Bean Lifecycle Question Bank.
- Revisei lifecycle, scopes, thread safety e circular dependencies.
- Criei Spring Boot Question Bank.
- Revisei starters, auto-configuration, back-off, actuator e startup.
- Criei Configuration Question Bank.
- Revisei configuração externa, precedence, properties, profiles, validation e secrets.
- Criei AOP Proxy Question Bank.
- Revisei AOP, proxies, self-invocation, visibility e order.
- Criei Transaction Question Bank.
- Revisei Transactional, flush, commit e rollback.
- Revisei propagation e isolation.
- Revisei read-only, timeout e boundaries.
- Relacionei transação com Outbox.
- Criei Spring Data Question Bank.
- Revisei repositories, query derivation, Query, paginação, projections e Specifications.
- Criei JPA Hibernate Question Bank.
- Diferenciei JPA e Hibernate.
- Revisei persistence context, lifecycle, persist, merge, dirty checking e caches.
- Revisei Open Session in View.
- Criei Entity Mapping Question Bank.
- Revisei ID, version, enum, embeddable e relações.
- Revisei owner, mappedBy, cascade, orphan removal e many-to-many.
- Criei Fetching N Plus One.
- Revisei LAZY, EAGER, N+1, fetch join, entity graph e batch.
- Criei Locking Question Bank.
- Revisei optimistic e pessimistic locks.
- Criei Query Question Bank.
- Revisei JPQL, native, Criteria, projections, count, bulk update e tenant.
- Criei Migration Question Bank.
- Revisei Flyway, imutabilidade, compatibilidade, índices e rollback.
- Criei Persistence Testing Guide.
- Revisei unit, DataJpaTest, Testcontainers, constraints, queries e migrations.
- Criei Troubleshooting.
- Diagnostiquei bean, transaction, lazy, N+1, detached, duplicate e deadlock.
- Criei Coding Exercises.
- Preparei dez exercícios.
- Criei Mock Spring JPA Interview.
- Executei duas rodadas.
- Gravei entrevistas.
- Criei Scorecard.
- Criei Review Checklist.
- Criei Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 709.
- Criei report, evidence e gate.
- Revisei gravações.
- Repeti o tema mais fraco.
- Não antecipei entrevista SQL banco.
- Próxima aula: Entrevista SQL banco.
```

---

## Referência técnica curta

- Spring Container.
- IoC.
- Dependency Injection.
- Bean.
- Scope.
- Auto-Configuration.
- Configuration Properties.
- Proxy.
- AOP.
- Transaction.
- Propagation.
- Isolation.
- Spring Data.
- JPA.
- Hibernate.
- Persistence Context.
- Dirty Checking.
- Flush.
- Lazy Loading.
- N Plus One.
- Optimistic Lock.
- Flyway.
- Testcontainers.

Regra final:

```text
A entrevista Spring JPA do OrderFlow deve demonstrar comportamento, não memorização: Spring Core explica IoC, dependency injection, constructor injection, beans, stereotypes, configuration and component scan, lifecycle cobre post processors, init, destroy, singleton, prototype, request scope, thread safety and circular dependencies, Spring Boot cobre starters, auto-configuration, conditions, back-off, actuator and fail-fast startup, configuration usa typed properties, validation, profiles and runtime secrets, AOP explica proxies, JDK and class proxies, self-invocation, private methods and aspect order, transactions diferenciam boundary, flush, commit, rollback, propagation, isolation, read-only, timeout and external calls, Spring Data cobre repository abstraction, derived queries, JPQL, pagination, projections and Specifications, JPA and Hibernate são diferenciados por specification and implementation, persistence context explica transient, managed, detached, removed, persist, merge, dirty checking, first-level cache and flush, mappings cobrem ID, sequence, version, enum, embeddable, owner, mappedBy, cascade, orphan removal and relation lifecycle, fetching explica LAZY, EAGER, N plus one, fetch join, entity graph, batch and pagination limits, locking compara optimistic, pessimistic, timeouts and conflict handling, queries cobrem JPQL, native SQL, Criteria, DTO projection, count and bulk update, migrations usam Flyway, imutabilidade, expand-migrate-contract, safe indexes and roll-forward, tests usam unit, DataJpaTest, Testcontainers, constraints, query count and migration validation, troubleshooting identifica missing beans, proxy failures, lazy access, N plus one, detached entities, duplicate keys and deadlocks, duas mock interviews geram scorecard, report and evidence, e o gate fecha Spring, JPA, persistence and interview practice enquanto relational modeling, joins, indexes, execution plans, locks, isolation and SQL performance permanecem reservados para a aula 709.
```
