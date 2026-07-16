# 709 - M20.39 - Entrevista SQL banco

## Apresentação da aula

Na aula 708, você realizou a preparação completa para uma entrevista Spring JPA.

O material anterior organizou:

- Spring Core;
- inversão de controle;
- injeção de dependência;
- lifecycle e scopes;
- Spring Boot;
- auto-configuration;
- configuração externa;
- profiles;
- AOP;
- proxies;
- transações;
- propagation;
- isolation;
- Spring Data;
- JPA;
- Hibernate;
- persistence context;
- mappings;
- fetching;
- N+1;
- locks;
- migrations;
- testes de persistência;
- troubleshooting;
- exercícios;
- duas entrevistas simuladas;
- scorecard;
- report, evidence e gate.

Agora você avançará para uma entrevista focada em SQL e banco de dados.

Essa entrevista avalia se você sabe escrever consultas, mas também se entende:

- modelagem;
- integridade;
- cardinalidade;
- normalização;
- índices;
- planos de execução;
- transações;
- concorrência;
- locks;
- isolamento;
- deadlocks;
- paginação;
- performance;
- observabilidade;
- manutenção;
- diagnóstico.

Perguntas comuns:

- qual a diferença entre chave primária e chave única?
- quando usar chave natural?
- o que é normalização?
- quando desnormalizar?
- qual a diferença entre `INNER JOIN` e `LEFT JOIN`?
- por que um join multiplica linhas?
- como encontrar duplicidades?
- quando usar CTE?
- o que são window functions?
- por que uma query ignora um índice?
- o que é selectivity?
- por que `SELECT *` pode ser ruim?
- como ler um execution plan?
- o que é scan sequencial?
- o que é index scan?
- o que é composite index?
- qual a ordem correta das colunas de um índice?
- o que é MVCC?
- o que é phantom read?
- como ocorre um deadlock?
- como diagnosticar query lenta?
- como modelar multi-tenancy?
- quando particionar uma tabela?
- como fazer migration sem indisponibilidade?

Uma resposta superficial diz:

```text
indice deixa consulta rapida.
```

Uma resposta profissional explica:

```text
um indice pode reduzir o custo
de localizar linhas
quando o predicado possui seletividade adequada,
mas aumenta espaco,
custo de escrita,
manutencao
e pode ser ignorado pelo otimizador
quando o scan sequencial for mais barato.
```

Nesta aula, você treinará:

- modelagem relacional;
- constraints;
- normalização;
- joins;
- filtros;
- agregações;
- subqueries;
- CTEs;
- window functions;
- índices;
- planos de execução;
- transações;
- MVCC;
- isolamento;
- locks;
- deadlocks;
- paginação;
- performance;
- tuning;
- migrations;
- particionamento;
- backup e recovery conceitual;
- troubleshooting;
- exercícios;
- simulação completa.

A próxima aula será:

```text
710 - M20.40 - Entrevista seguranca
```

Na aula 710, você aprofundará autenticação, autorização, OAuth2, JWT, tenant isolation, OWASP, gestão de secrets, criptografia, headers, vulnerabilidades, threat modeling, testes negativos e resposta a incidentes.

Nesta aula, segurança aparecerá apenas quando relacionada ao banco, por exemplo:

- privilégios;
- SQL injection;
- dados sensíveis;
- isolamento de tenant;
- auditoria.

Ela não será o foco central.

O laboratório será:

```text
labs/m20/aula-709-entrevista-SQL-banco/orderflow-SQL-database-interview
```

Regra central:

```text
uma boa entrevista SQL banco
nao mede apenas sintaxe;

ela mede
se voce entende
dados,
custos,
concorrencia,
integridade
e comportamento real
do banco.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
706:
Curriculo Java Backend.

707:
Entrevista Java.

708:
Entrevista Spring JPA.

709:
Entrevista SQL banco.

710:
Entrevista seguranca.

711:
Entrevista mensageria e eventos.
```

A aula 709 utiliza como fonte:

- modelo relacional do OrderFlow;
- migrations Flyway;
- queries;
- repositories;
- índices;
- constraints;
- planos de execução;
- testes com PostgreSQL;
- Testcontainers;
- reports;
- evidence;
- runbooks;
- decisões de persistência;
- respostas da aula 708.

A entrevista precisa conectar SQL e aplicação.

Quando falar de índice, explique qual query ele ajuda.

Quando falar de lock, explique qual fluxo concorre.

Quando falar de normalização, explique qual risco de duplicação foi evitado.

Quando falar de tenant, explique como a query e a constraint protegem isolamento.

Quando falar de performance, explique como medir antes de alterar.

---

## Objetivo prático

Será criada a estrutura:

```text
docs/interview-SQL-banco
├── SQL_DATABASE_INTERVIEW_CHARTER.md
├── RELATIONAL_MODELING_QUESTION_BANK.md
├── KEYS_CONSTRAINTS_QUESTION_BANK.md
├── NORMALIZATION_QUESTION_BANK.md
├── SQL_CORE_QUESTION_BANK.md
├── JOINS_QUESTION_BANK.md
├── AGGREGATION_QUESTION_BANK.md
├── SUBQUERY_CTE_QUESTION_BANK.md
├── WINDOW_FUNCTIONS_QUESTION_BANK.md
├── INDEXES_QUESTION_BANK.md
├── EXECUTION_PLAN_QUESTION_BANK.md
├── TRANSACTIONS_MVCC_QUESTION_BANK.md
├── ISOLATION_LOCKING_QUESTION_BANK.md
├── DEADLOCK_QUESTION_BANK.md
├── PAGINATION_QUESTION_BANK.md
├── DATABASE_PERFORMANCE_GUIDE.md
├── MIGRATION_PARTITIONING_QUESTION_BANK.md
├── DATABASE_TROUBLESHOOTING.md
├── SQL_CODING_EXERCISES.md
├── MOCK_SQL_DATABASE_INTERVIEW.md
├── SQL_DATABASE_SCORECARD.md
├── SQL_DATABASE_REVIEW_CHECKLIST.md
├── SQL_DATABASE_MATRIX.md
├── SQL_DATABASE_RISK_REGISTER.md
├── SQL_DATABASE_TRACEABILITY.md
└── NEXT_LESSON_BOUNDARY.md
```

Scripts:

```text
scripts/interview-SQL-banco
├── collect-SQL-sources.ps1
├── generate-SQL-question-bank.ps1
├── validate-SQL-answers.ps1
├── run-SQL-exercises.ps1
├── analyze-query-plans.ps1
├── run-SQL-mock-interview.ps1
├── generate-SQL-report.ps1
└── collect-SQL-evidence.ps1
```

Artifacts:

```text
reports/SQL-database-interview-report.yaml

contracts/SQL-database-interview-evidence.yaml
```

---

## Conceito essencial

### Banco não é apenas armazenamento

Ele protege:

- integridade;
- concorrência;
- consistência;
- relações;
- histórico;
- consultas.

### Query correta pode ser cara

Resultado correto não significa plano eficiente.

### Índice é trade-off

Ele acelera leitura específica e encarece escrita.

### Isolamento tem custo

Mais isolamento pode reduzir concorrência.

### Modelagem influencia código

Uma decisão de schema afeta transações, migrations, queries e operação.

---

## Mão na massa guiada

### 1. Criar SQL Database Interview Charter

Arquivo:

```text
docs/interview-SQL-banco/SQL_DATABASE_INTERVIEW_CHARTER.md
```

Princípios:

```text
model before query;

integrity before convenience;

measure before tune;

plans before guesses;

transactions are explicit;

indexes have costs;

security interview belongs to lesson 710.
```

---

## Modelagem relacional

### 2. Criar Relational Modeling Question Bank

Arquivo:

```text
docs/interview-SQL-banco/RELATIONAL_MODELING_QUESTION_BANK.md
```

---

### 3. Explicar tabela

Tabela representa um conjunto de linhas com estrutura definida.

---

### 4. Explicar linha e coluna

Linha representa uma ocorrência.

Coluna representa atributo com tipo e restrições.

---

### 5. Explicar entidade e relação

Modelo relacional não é cópia direta de objetos Java.

---

### 6. Explicar cardinalidade

Exemplos:

- um para um;
- um para muitos;
- muitos para muitos.

---

### 7. Explicar tabela associativa

Resolve muitos para muitos e pode possuir atributos próprios.

---

### 8. Explicar nullability

`NULL` representa ausência ou desconhecido.

Não use quando o domínio exige valor.

---

### 9. Explicar tipos corretos

Use tipo que represente o domínio.

Exemplos:

- `numeric` para valor monetário;
- `timestamp with time zone` quando instante é importante;
- `uuid` quando escolhido como identidade;
- `boolean` para estado binário real.

---

### 10. Evitar armazenar tudo como texto

Isso perde validação, ordenação e performance.

---

## Chaves e constraints

### 11. Criar Keys Constraints Question Bank

Arquivo:

```text
docs/interview-SQL-banco/KEYS_CONSTRAINTS_QUESTION_BANK.md
```

---

### 12. Explicar primary key

Identifica unicamente a linha e não aceita `NULL`.

---

### 13. Explicar unique constraint

Garante unicidade adicional.

Pode representar regra de negócio.

---

### 14. Explicar foreign key

Garante integridade referencial.

---

### 15. Explicar check constraint

Protege regra simples no banco.

Exemplo:

```sql
CHECK (amount >= 0)
```

---

### 16. Explicar not null

Impede ausência quando o atributo é obrigatório.

---

### 17. Comparar chave natural e surrogate

Natural:

- possui significado de negócio;
- pode mudar;
- pode ser longa.

Surrogate:

- identidade técnica;
- estável;
- exige unique para chave de negócio.

---

### 18. Explicar composite key

Pode ser útil quando a identidade depende de múltiplos atributos.

---

### 19. Relacionar tenant à chave

Em multi-tenancy, índices e constraints frequentemente incluem `tenant_id`.

---

### 20. Explicar cascade no banco

`ON DELETE CASCADE` é decisão de lifecycle.

Use com cuidado.

---

## Normalização

### 21. Criar Normalization Question Bank

Arquivo:

```text
docs/interview-SQL-banco/NORMALIZATION_QUESTION_BANK.md
```

---

### 22. Explicar primeira forma normal

Valores atômicos e ausência de grupos repetidos.

---

### 23. Explicar segunda forma normal

Atributos não-chave dependem da chave inteira.

---

### 24. Explicar terceira forma normal

Evita dependência transitiva de atributos não-chave.

---

### 25. Explicar benefício

Reduz duplicação e inconsistência de atualização.

---

### 26. Explicar custo

Mais joins e consultas mais complexas.

---

### 27. Explicar desnormalização

Pode melhorar leitura quando existe necessidade medida.

---

### 28. Defender read model desnormalizado

No OrderFlow, projection pode otimizar consulta sem substituir a autoridade transacional.

---

### 29. Evitar desnormalização prematura

Primeiro meça o problema.

---

## SQL Core

### 30. Criar SQL Core Question Bank

Arquivo:

```text
docs/interview-SQL-banco/SQL_CORE_QUESTION_BANK.md
```

---

### 31. Explicar ordem lógica

Ordem conceitual simplificada:

```text
FROM;

JOIN;

WHERE;

GROUP BY;

HAVING;

SELECT;

ORDER BY;

LIMIT.
```

---

### 32. Diferenciar WHERE e HAVING

`WHERE` filtra linhas antes da agregação.

`HAVING` filtra grupos depois.

---

### 33. Explicar alias

Melhora legibilidade, especialmente em joins.

---

### 34. Explicar `DISTINCT`

Remove duplicidade do resultado.

Não use para esconder join incorreto.

---

### 35. Explicar `CASE`

Permite lógica condicional na consulta.

---

### 36. Explicar `COALESCE`

Retorna o primeiro valor não nulo.

---

### 37. Explicar comparação com NULL

Use:

```sql
IS NULL
```

e:

```sql
IS NOT NULL
```

---

### 38. Explicar `IN` e `EXISTS`

`EXISTS` pode ser adequado para verificar existência sem materializar valores.

O plano real precisa ser observado.

---

### 39. Evitar `SELECT *`

Pode aumentar I/O, acoplamento e dificuldade de evolução.

---

## Joins

### 40. Criar Joins Question Bank

Arquivo:

```text
docs/interview-SQL-banco/JOINS_QUESTION_BANK.md
```

---

### 41. Explicar INNER JOIN

Retorna correspondências entre os lados.

---

### 42. Explicar LEFT JOIN

Preserva todas as linhas da esquerda.

---

### 43. Explicar RIGHT JOIN

Preserva a direita.

Pode ser reescrito como LEFT com ordem invertida.

---

### 44. Explicar FULL JOIN

Preserva linhas dos dois lados.

---

### 45. Explicar CROSS JOIN

Produto cartesiano.

---

### 46. Explicar self join

Relaciona linhas da mesma tabela.

---

### 47. Explicar multiplicação de linhas

Um pai com vários filhos aparece repetido.

---

### 48. Explicar filtro no ON versus WHERE

Em outer joins, mover condição pode alterar semântica.

---

### 49. Diagnosticar duplicidade em join

Verifique cardinalidade e condição de junção.

---

### 50. Explicar anti-join

Pode usar `NOT EXISTS` para encontrar ausência.

---

## Agregações

### 51. Criar Aggregation Question Bank

Arquivo:

```text
docs/interview-SQL-banco/AGGREGATION_QUESTION_BANK.md
```

---

### 52. Explicar COUNT

`COUNT(*)` conta linhas.

`COUNT(coluna)` ignora `NULL`.

---

### 53. Explicar SUM, AVG, MIN e MAX

---

### 54. Explicar GROUP BY

Agrupa linhas por expressão.

---

### 55. Explicar HAVING

Filtra agregados.

---

### 56. Explicar agregação condicional

Exemplo:

```sql
SUM(
  CASE
    WHEN status = 'COMPLETED'
    THEN 1
    ELSE 0
  END
)
```

---

### 57. Explicar group sets conceitualmente

Úteis para múltiplos níveis de agregação.

---

## Subqueries e CTEs

### 58. Criar Subquery CTE Question Bank

Arquivo:

```text
docs/interview-SQL-banco/SUBQUERY_CTE_QUESTION_BANK.md
```

---

### 59. Explicar subquery não correlacionada

Pode ser executada independentemente.

---

### 60. Explicar subquery correlacionada

Depende da linha externa.

Pode ser cara.

---

### 61. Explicar CTE

Melhora legibilidade e decomposição.

---

### 62. Explicar CTE recursiva

Útil para hierarquias e grafos simples.

---

### 63. Não assumir materialização

O comportamento depende do banco e da versão.

---

### 64. Comparar CTE e subquery

Escolha por clareza e plano.

---

## Window functions

### 65. Criar Window Functions Question Bank

Arquivo:

```text
docs/interview-SQL-banco/WINDOW_FUNCTIONS_QUESTION_BANK.md
```

---

### 66. Explicar window function

Calcula sobre conjunto relacionado sem colapsar linhas.

---

### 67. Explicar `ROW_NUMBER`

Numera linhas por partição e ordem.

---

### 68. Explicar `RANK` e `DENSE_RANK`

Tratam empates de forma diferente.

---

### 69. Explicar `LAG` e `LEAD`

Acessam linha anterior ou seguinte.

---

### 70. Explicar running total

Use `SUM() OVER`.

---

### 71. Relacionar com auditoria

Pode comparar estados e tempos entre eventos.

---

## Índices

### 72. Criar Indexes Question Bank

Arquivo:

```text
docs/interview-SQL-banco/INDEXES_QUESTION_BANK.md
```

---

### 73. Explicar índice B-tree

Adequado para igualdade, intervalo e ordenação em muitos casos.

---

### 74. Explicar índice composto

A ordem das colunas importa.

---

### 75. Explicar regra do prefixo

Consultas que usam o início do índice aproveitam melhor sua estrutura.

---

### 76. Explicar selectivity

Coluna muito pouco seletiva pode não justificar índice isolado.

---

### 77. Explicar covering index

Inclui colunas necessárias para reduzir acesso à tabela.

---

### 78. Explicar partial index

Indexa subconjunto.

Exemplo:

```sql
CREATE INDEX idx_outbox_pending
ON outbox_message (created_at)
WHERE status = 'PENDING';
```

---

### 79. Explicar unique index

Pode implementar unicidade.

---

### 80. Explicar custo de índice

- espaço;
- insert;
- update;
- delete;
- vacuum;
- manutenção.

---

### 81. Explicar índice não usado

Possíveis causas:

- baixa seletividade;
- tabela pequena;
- função na coluna;
- cast;
- estatísticas;
- tipo incompatível;
- custo estimado.

---

### 82. Explicar expressão sargable

Predicado permite uso eficiente de índice.

---

### 83. Evitar função sobre coluna indexada quando possível

Exemplo ruim:

```sql
WHERE LOWER(email) = 'x'
```

Sem índice funcional apropriado.

---

### 84. Relacionar índice à query

Nunca proponha índice sem workload.

---

## Planos de execução

### 85. Criar Execution Plan Question Bank

Arquivo:

```text
docs/interview-SQL-banco/EXECUTION_PLAN_QUESTION_BANK.md
```

---

### 86. Explicar `EXPLAIN`

Mostra plano estimado.

---

### 87. Explicar `EXPLAIN ANALYZE`

Executa a query e mostra tempos reais.

Use cuidado em comandos mutáveis.

---

### 88. Explicar sequential scan

Pode ser correto para tabela pequena ou grande porcentagem de linhas.

---

### 89. Explicar index scan

Usa índice para localizar linhas.

---

### 90. Explicar bitmap scan

Pode combinar acesso por índice e leitura de páginas.

---

### 91. Explicar join algorithms

- nested loop;
- hash join;
- merge join.

---

### 92. Explicar estimativa de cardinalidade

Erro de estimativa pode levar a plano ruim.

---

### 93. Explicar statistics

O otimizador usa estatísticas.

---

### 94. Explicar cost

É unidade estimada, não milissegundos diretos.

---

### 95. Comparar estimated e actual rows

Grande divergência indica problema de estatística ou correlação.

---

## Transações e MVCC

### 96. Criar Transactions MVCC Question Bank

Arquivo:

```text
docs/interview-SQL-banco/TRANSACTIONS_MVCC_QUESTION_BANK.md
```

---

### 97. Explicar ACID

- atomicidade;
- consistência;
- isolamento;
- durabilidade.

---

### 98. Explicar MVCC

Múltiplas versões permitem leitura consistente com menor bloqueio entre leitores e escritores.

---

### 99. Explicar snapshot

A transação observa uma visão de dados conforme isolamento.

---

### 100. Explicar commit e rollback

Commit torna alterações duráveis e visíveis conforme regras.

Rollback descarta alterações da transação.

---

### 101. Explicar transação longa

Problemas:

- locks;
- bloat;
- vacuum;
- recursos;
- contenção.

---

### 102. Relacionar com application boundary

Transação deve corresponder à unidade de trabalho.

---

## Isolamento e locks

### 103. Criar Isolation Locking Question Bank

Arquivo:

```text
docs/interview-SQL-banco/ISOLATION_LOCKING_QUESTION_BANK.md
```

---

### 104. Explicar dirty read

Leitura de dado não commitado.

---

### 105. Explicar non-repeatable read

A mesma linha muda entre leituras.

---

### 106. Explicar phantom read

Novas linhas passam a atender ao predicado.

---

### 107. Explicar Read Committed

Cada statement vê dados commitados conforme implementação.

---

### 108. Explicar Repeatable Read

Mantém snapshot mais estável.

---

### 109. Explicar Serializable

Busca comportamento equivalente a execução serial.

Pode abortar transações.

---

### 110. Explicar row lock

Protege linhas específicas.

---

### 111. Explicar table lock

Afeta escopo maior.

---

### 112. Explicar `SELECT FOR UPDATE`

Bloqueia linhas selecionadas para atualização.

---

### 113. Explicar `SKIP LOCKED`

Permite workers ignorarem linhas já bloqueadas.

Útil no claim da Outbox.

---

### 114. Explicar lock timeout

Evita espera indefinida.

---

### 115. Não aumentar isolamento global sem motivo

---

## Deadlocks

### 116. Criar Deadlock Question Bank

Arquivo:

```text
docs/interview-SQL-banco/DEADLOCK_QUESTION_BANK.md
```

---

### 117. Explicar deadlock

Transações aguardam locks umas das outras.

---

### 118. Explicar detecção

O banco aborta uma vítima.

---

### 119. Explicar prevenção

- ordem consistente;
- transações curtas;
- índices adequados;
- menor lote;
- retry controlado.

---

### 120. Explicar diagnóstico

Colete:

- queries;
- locks;
- ordem;
- tempo;
- transaction IDs;
- logs.

---

## Paginação

### 121. Criar Pagination Question Bank

Arquivo:

```text
docs/interview-SQL-banco/PAGINATION_QUESTION_BANK.md
```

---

### 122. Explicar offset pagination

Simples, mas piora em offsets altos e pode sofrer inconsistência sob mudanças.

---

### 123. Explicar keyset pagination

Usa chave estável para continuar.

Melhor para grandes volumes.

---

### 124. Explicar ordering estável

Inclua desempate.

---

### 125. Explicar count total

Pode ser caro.

Avalie necessidade.

---

## Performance

### 126. Criar Database Performance Guide

Arquivo:

```text
docs/interview-SQL-banco/DATABASE_PERFORMANCE_GUIDE.md
```

---

### 127. Criar processo de tuning

1. reproduzir;
2. medir;
3. capturar query;
4. observar plano;
5. validar cardinalidade;
6. revisar índice;
7. revisar schema;
8. testar mudança;
9. comparar;
10. monitorar.

---

### 128. Explicar I/O, CPU e memória

Query pode ser limitada por recursos diferentes.

---

### 129. Explicar connection pool

Pool excessivo pode sobrecarregar banco.

---

### 130. Explicar batch

Batch reduz round trips, mas aumenta tamanho transacional.

---

### 131. Explicar prepared statements

Ajudam segurança e reutilização.

---

### 132. Explicar estatísticas atualizadas

Planos dependem delas.

---

### 133. Explicar vacuum e bloat conceitualmente

No PostgreSQL, MVCC gera versões mortas que precisam de limpeza.

---

### 134. Explicar slow query log

Ajuda priorizar workload real.

---

### 135. Evitar tuning por intuição

---

## Migrations e particionamento

### 136. Criar Migration Partitioning Question Bank

Arquivo:

```text
docs/interview-SQL-banco/MIGRATION_PARTITIONING_QUESTION_BANK.md
```

---

### 137. Explicar migration segura

- compatível;
- incremental;
- observável;
- reversível quando possível;
- testada.

---

### 138. Explicar expand-migrate-contract

Evita breaking change imediato.

---

### 139. Explicar índice concorrente

Quando suportado, reduz bloqueio, mas possui restrições.

---

### 140. Explicar particionamento

Divide tabela por chave.

Não é solução universal.

---

### 141. Explicar pruning

Banco evita partições irrelevantes quando predicado permite.

---

### 142. Explicar escolha de chave

Pode usar:

- data;
- tenant;
- range;
- hash.

A escolha depende do workload.

---

### 143. Explicar custo operacional

Partições aumentam gestão e migrations.

---

### 144. Explicar backup e restore conceitualmente

Backup só é confiável quando restore é testado.

---

## Troubleshooting

### 145. Criar Database Troubleshooting

Arquivo:

```text
docs/interview-SQL-banco/DATABASE_TROUBLESHOOTING.md
```

---

### 146. Diagnosticar query lenta

Verifique:

- plano;
- volume;
- seletividade;
- índices;
- locks;
- I/O;
- estatísticas;
- parâmetros.

---

### 147. Diagnosticar conexão esgotada

Verifique:

- pool;
- transações longas;
- leak;
- timeout;
- banco.

---

### 148. Diagnosticar lock alto

Identifique blocker e blocked.

---

### 149. Diagnosticar crescimento de tabela

Verifique retenção, purge, vacuum e índices.

---

### 150. Diagnosticar duplicate key

Pode indicar concorrência, idempotência ou dado inconsistente.

---

### 151. Diagnosticar erro de tenant

Revisar queries, constraints e testes cross-tenant.

---

### 152. Diagnosticar plano instável

Verifique estatísticas, parâmetros e distribuição de dados.

---

## Exercícios

### 153. Criar SQL Coding Exercises

Arquivo:

```text
docs/interview-SQL-banco/SQL_CODING_EXERCISES.md
```

---

### 154. Exercício 1: pedidos por tenant

Liste pedidos de um tenant em período com paginação estável.

---

### 155. Exercício 2: duplicidade

Encontre operation IDs duplicados.

---

### 156. Exercício 3: agregação

Calcule total por status e tenant.

---

### 157. Exercício 4: jornada

Use window function para duração entre estados.

---

### 158. Exercício 5: anti-join

Encontre pedidos sem projection.

---

### 159. Exercício 6: backlog

Calcule idade da mensagem mais antiga da Outbox pendente.

---

### 160. Exercício 7: índice

Proponha índice para claim da Outbox e valide com plano.

---

### 161. Exercício 8: concorrência

Simule duas transações atualizando o mesmo pedido.

---

### 162. Exercício 9: deadlock

Crie cenário controlado e corrija ordem de locks.

---

### 163. Exercício 10: migration

Adicione coluna obrigatória sem quebrar registros existentes.

---

## Simulação

### 164. Criar Mock SQL Database Interview

Arquivo:

```text
docs/interview-SQL-banco/MOCK_SQL_DATABASE_INTERVIEW.md
```

Duração:

```text
75 a 90 minutos.
```

---

### 165. Estruturar simulação

1. modelagem;
2. constraints;
3. normalização;
4. SQL core;
5. joins;
6. agregações;
7. CTE;
8. window functions;
9. índices;
10. planos;
11. transações;
12. isolamento;
13. locks;
14. deadlocks;
15. paginação;
16. performance;
17. migration;
18. troubleshooting;
19. exercício.

---

### 166. Criar follow-ups

Exemplos:

- e se a tabela tiver cem milhões de linhas?
- e se o tenant for pouco seletivo?
- e se o índice aumentar escrita?
- e se a query retornar metade da tabela?
- e se o count for caro?
- e se o lock esperar demais?
- e se o deadlock reaparecer?

---

### 167. Gravar a entrevista

---

### 168. Criar SQL Database Scorecard

Arquivo:

```text
docs/interview-SQL-banco/SQL_DATABASE_SCORECARD.md
```

Critérios:

- modelagem;
- constraints;
- normalização;
- SQL;
- joins;
- agregações;
- CTE;
- windows;
- índices;
- planos;
- transações;
- isolamento;
- locks;
- deadlocks;
- performance;
- migrations;
- troubleshooting;
- comunicação.

---

### 169. Criar Review Checklist

Arquivo:

```text
docs/interview-SQL-banco/SQL_DATABASE_REVIEW_CHECKLIST.md
```

Perguntas:

- expliquei o modelo?
- protegi integridade?
- discuti custo?
- medi antes de indexar?
- li o plano?
- considerei concorrência?
- expliquei isolamento?
- usei OrderFlow?
- admiti limite?
- evitei antecipar segurança?

---

### 170. Criar Matrix

Arquivo:

```text
docs/interview-SQL-banco/SQL_DATABASE_MATRIX.md
```

Colunas:

- tema;
- pergunta;
- resposta curta;
- aprofundamento;
- query;
- evidence;
- score;
- revisão.

---

### 171. Criar Risk Register

Arquivo:

```text
docs/interview-SQL-banco/SQL_DATABASE_RISK_REGISTER.md
```

Riscos:

```text
sintaxe sem modelagem;

indice sem workload;

select distinct escondendo erro;

isolamento exagerado;

transacao longa;

plano ignorado;

migration insegura;

tenant sem constraint;

seguranca antecipada;

feedback nao registrado.
```

---

### 172. Criar Traceability

Arquivo:

```text
docs/interview-SQL-banco/SQL_DATABASE_TRACEABILITY.md
```

Exemplo:

```text
Outbox claim
-> partial index
-> SKIP LOCKED query
-> integration test
-> query plan.

tenant isolation
-> composite unique
-> repository query
-> security test.

optimistic locking
-> version column
-> concurrent update test
-> incident runbook.
```

---

### 173. Criar boundary da próxima aula

Arquivo:

```text
docs/interview-SQL-banco/NEXT_LESSON_BOUNDARY.md
```

Conteúdo:

```text
A aula 709 define:

- relational modeling;
- keys;
- constraints;
- normalization;
- SQL core;
- joins;
- aggregations;
- subqueries;
- CTEs;
- window functions;
- indexes;
- execution plans;
- transactions;
- MVCC;
- isolation;
- locks;
- deadlocks;
- pagination;
- performance;
- migrations;
- partitioning;
- database troubleshooting;
- mock interview.

A aula 710 define:

- authentication;
- authorization;
- OAuth2;
- JWT;
- password security;
- cryptography;
- secrets;
- OWASP;
- SQL injection;
- XSS;
- CSRF;
- SSRF;
- IDOR;
- mass assignment;
- tenant isolation;
- security headers;
- threat modeling;
- negative testing;
- incident response;
- security interview simulation.

Nenhuma entrevista de seguranca
e executada nesta aula.
```

---

## Validação final

### 174. Criar report

Arquivo:

```text
reports/SQL-database-interview-report.yaml
```

Exemplo:

```yaml
SQLDatabaseInterview:
  questionBank:
    total:
      measured
    answered:
      measured

  scores:
    modeling:
      measured
    SQL:
      measured
    joins:
      measured
    indexes:
      measured
    plans:
      measured
    transactions:
      measured
    locking:
      measured
    performance:
      measured
    migrations:
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

  securityInterview:
    completed:
      false

  gate:
    PASS
```

---

### 175. Criar evidence

Arquivo:

```text
contracts/SQL-database-interview-evidence.yaml
```

Campos:

- lesson;
- project;
- modeling question count;
- keys question count;
- normalization question count;
- SQL core question count;
- joins question count;
- aggregation question count;
- CTE question count;
- window function question count;
- index question count;
- execution plan question count;
- transaction question count;
- isolation question count;
- lock question count;
- deadlock question count;
- pagination question count;
- performance question count;
- migration question count;
- troubleshooting question count;
- coding exercise count;
- completed exercise count;
- mock interview duration;
- average score;
- lowest topic;
- highest topic;
- unsupported answer count;
- contradiction count;
- admitted uncertainty count;
- security interview completed;
- documentation status;
- gate status;
- timestamp.

---

### 176. Criar gate

Status:

```text
PASS;

FAIL_RELATIONAL_MODELING;

FAIL_KEYS_CONSTRAINTS;

FAIL_NORMALIZATION;

FAIL_SQL_CORE;

FAIL_JOINS;

FAIL_AGGREGATIONS;

FAIL_SUBQUERY_CTE;

FAIL_WINDOW_FUNCTIONS;

FAIL_INDEXES;

FAIL_EXECUTION_PLAN;

FAIL_TRANSACTIONS;

FAIL_MVCC;

FAIL_ISOLATION;

FAIL_LOCKING;

FAIL_DEADLOCK;

FAIL_PAGINATION;

FAIL_PERFORMANCE;

FAIL_MIGRATION;

FAIL_PARTITIONING;

FAIL_TROUBLESHOOTING;

FAIL_CODING_EXERCISE;

FAIL_MOCK_INTERVIEW;

FAIL_UNSUPPORTED_ANSWER;

FAIL_CONTRADICTION;

FAIL_SECURITY_ANTICIPATION;

INCONCLUSIVE.
```

---

### 177. Executar validators

```powershell
.\scripts\validate-documentation.ps1

.\scripts\validate-secrets.ps1

.\scripts\interview-SQL-banco\collect-SQL-sources.ps1

.\scripts\interview-SQL-banco\generate-SQL-question-bank.ps1

.\scripts\interview-SQL-banco\validate-SQL-answers.ps1

.\scripts\interview-SQL-banco\run-SQL-exercises.ps1

.\scripts\interview-SQL-banco\analyze-query-plans.ps1

.\scripts\interview-SQL-banco\collect-SQL-evidence.ps1
```

---

### 178. Executar duas rodadas

Rodada 1:

```text
consultas e modelagem.
```

Rodada 2:

```text
performance,
concorrencia
e troubleshooting.
```

---

### 179. Revisar gravações

Selecione:

- três respostas fortes;
- três respostas sem custo;
- dois erros de join;
- dois erros de índice;
- um plano de melhoria.

---

### 180. Repetir o tema mais fraco

---

### 181. Encerrar o laboratório

Confirme:

- Charter;
- modelagem;
- chaves;
- constraints;
- normalização;
- SQL core;
- joins;
- agregações;
- subqueries;
- CTEs;
- window functions;
- índices;
- planos;
- transações;
- MVCC;
- isolamento;
- locks;
- deadlocks;
- paginação;
- performance;
- migrations;
- particionamento;
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
- aula 710 preservada.

---

## Entendendo o que foi feito

### SQL deixou de ser apenas sintaxe

Modelagem, integridade e concorrência passaram a fazer parte da resposta.

### Índices ganharam contexto

Cada índice passou a existir por causa de uma query e workload.

### Planos substituíram adivinhação

Otimização passou a ser baseada em evidence.

### Transações ganharam custo

Isolamento, locks e duração foram avaliados.

### MVCC ganhou utilidade prática

Leitores e escritores foram compreendidos com mais precisão.

### Deadlocks ganharam prevenção

Ordem de locks e transações curtas passaram a ser parte do desenho.

### Migrations ganharam segurança

Mudanças incrementais e compatíveis foram reforçadas.

### Troubleshooting ganhou método

Query lenta, conexão, lock e crescimento deixaram de ser diagnósticos genéricos.

---

## Erros comuns importantes

### Criar índice para toda coluna

Escrita e manutenção pioram.

### Usar DISTINCT para esconder join

A causa continua.

### Confundir WHERE e HAVING

A semântica muda.

### Ignorar NULL

Resultados podem ser incorretos.

### Ler cost como milissegundo

Cost é estimativa interna.

### Usar offset alto indefinidamente

Performance degrada.

### Aumentar isolamento global

Concorrência pode piorar.

### Manter transação longa

Locks e bloat aumentam.

### Particionar sem necessidade

Operação fica mais complexa.

### Antecipar entrevista de segurança

Essa etapa pertence à aula 710.

---

## Comandos úteis

### Gerar perguntas

```powershell
.\scripts\interview-SQL-banco\generate-SQL-question-bank.ps1
```

### Validar respostas

```powershell
.\scripts\interview-SQL-banco\validate-SQL-answers.ps1
```

### Executar exercícios

```powershell
.\scripts\interview-SQL-banco\run-SQL-exercises.ps1
```

### Analisar planos

```powershell
.\scripts\interview-SQL-banco\analyze-query-plans.ps1
```

---

## Exercício principal

Realize uma entrevista simulada de 85 minutos.

Inclua:

1. modelagem;
2. cardinalidade;
3. primary key;
4. foreign key;
5. unique;
6. check;
7. natural e surrogate;
8. normalização;
9. desnormalização;
10. ordem lógica SQL;
11. WHERE e HAVING;
12. NULL;
13. INNER JOIN;
14. LEFT JOIN;
15. anti-join;
16. agregação;
17. subquery;
18. CTE;
19. window function;
20. índice B-tree;
21. índice composto;
22. partial index;
23. selectivity;
24. EXPLAIN;
25. EXPLAIN ANALYZE;
26. join algorithms;
27. ACID;
28. MVCC;
29. Read Committed;
30. Repeatable Read;
31. Serializable;
32. row lock;
33. SKIP LOCKED;
34. deadlock;
35. offset;
36. keyset;
37. tuning;
38. pool;
39. migration;
40. particionamento;
41. troubleshooting;
42. exercício;
43. feedback;
44. plano de melhoria.

Não realize a entrevista de segurança.

---

## Critérios de aceite

- arquivo, H1, número, módulo, título e nome seguem a grade oficial;
- continuidade com a aula 708 e ponte para a aula 710 foram preservadas;
- SQL Database Interview Charter foi criado;
- Relational Modeling Question Bank foi criado;
- tabela, linha e coluna foram explicadas;
- entidade e relação foram explicadas;
- cardinalidade foi explicada;
- tabela associativa foi explicada;
- nullability foi explicada;
- tipos corretos foram discutidos;
- texto universal foi evitado;
- Keys Constraints Question Bank foi criado;
- primary key foi explicada;
- unique foi explicada;
- foreign key foi explicada;
- check foi explicada;
- not null foi explicada;
- natural e surrogate foram comparadas;
- composite key foi explicada;
- tenant foi relacionado às chaves;
- cascade foi discutido;
- Normalization Question Bank foi criado;
- primeira, segunda e terceira formas foram explicadas;
- benefícios e custos foram explicados;
- desnormalização foi explicada;
- read model foi defendido;
- desnormalização prematura foi evitada;
- SQL Core Question Bank foi criado;
- ordem lógica foi explicada;
- WHERE e HAVING foram diferenciados;
- aliases foram explicados;
- DISTINCT foi explicado;
- CASE foi explicado;
- COALESCE foi explicado;
- NULL foi tratado;
- IN e EXISTS foram comparados;
- SELECT * foi evitado;
- Joins Question Bank foi criado;
- INNER, LEFT, RIGHT, FULL, CROSS e self join foram explicados;
- multiplicação de linhas foi explicada;
- ON e WHERE foram diferenciados;
- duplicidade foi diagnosticada;
- anti-join foi explicado;
- Aggregation Question Bank foi criado;
- COUNT foi explicado;
- SUM, AVG, MIN e MAX foram explicados;
- GROUP BY foi explicado;
- HAVING foi explicado;
- agregação condicional foi explicada;
- grouping sets foram mencionados;
- Subquery CTE Question Bank foi criado;
- subqueries correlacionadas e não correlacionadas foram explicadas;
- CTE foi explicada;
- CTE recursiva foi explicada;
- materialização não foi presumida;
- CTE e subquery foram comparadas;
- Window Functions Question Bank foi criado;
- window functions foram explicadas;
- ROW_NUMBER, RANK, DENSE_RANK, LAG e LEAD foram explicados;
- running total foi explicado;
- auditoria foi relacionada;
- Indexes Question Bank foi criado;
- B-tree foi explicado;
- índice composto foi explicado;
- prefixo foi explicado;
- selectivity foi explicada;
- covering foi explicado;
- partial index foi explicado;
- unique index foi explicado;
- custo de índice foi explicado;
- índice não usado foi explicado;
- sargability foi explicada;
- função em coluna indexada foi discutida;
- índice foi ligado a workload;
- Execution Plan Question Bank foi criado;
- EXPLAIN e EXPLAIN ANALYZE foram explicados;
- sequential, index e bitmap scans foram explicados;
- join algorithms foram explicados;
- estimativa de cardinalidade foi explicada;
- statistics foram explicadas;
- cost foi explicado;
- estimated e actual foram comparados;
- Transactions MVCC Question Bank foi criado;
- ACID foi explicado;
- MVCC foi explicado;
- snapshot foi explicado;
- commit e rollback foram explicados;
- transação longa foi discutida;
- boundary foi relacionado;
- Isolation Locking Question Bank foi criado;
- dirty, non-repeatable e phantom reads foram explicados;
- Read Committed, Repeatable Read e Serializable foram explicados;
- row e table locks foram explicados;
- FOR UPDATE foi explicado;
- SKIP LOCKED foi explicado;
- timeout foi explicado;
- isolamento global não foi aumentado sem motivo;
- Deadlock Question Bank foi criado;
- deadlock foi explicado;
- detecção foi explicada;
- prevenção foi explicada;
- diagnóstico foi explicado;
- Pagination Question Bank foi criado;
- offset foi explicado;
- keyset foi explicado;
- ordering estável foi explicado;
- count foi explicado;
- Database Performance Guide foi criado;
- processo de tuning foi criado;
- I/O, CPU e memória foram explicados;
- pool foi explicado;
- batch foi explicado;
- prepared statements foram explicados;
- statistics foram tratadas;
- vacuum e bloat foram explicados;
- slow query log foi explicado;
- tuning por intuição foi evitado;
- Migration Partitioning Question Bank foi criado;
- migration segura foi explicada;
- expand-migrate-contract foi explicado;
- índice concorrente foi tratado;
- particionamento foi explicado;
- pruning foi explicado;
- chave de partição foi explicada;
- custo operacional foi explicado;
- backup e restore foram explicados;
- Troubleshooting foi criado;
- query lenta foi diagnosticada;
- conexão esgotada foi diagnosticada;
- lock alto foi diagnosticado;
- crescimento foi diagnosticado;
- duplicate key foi diagnosticada;
- erro de tenant foi diagnosticado;
- plano instável foi diagnosticado;
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
- boundary da aula 710 foi criado;
- report, evidence e gate foram criados;
- validators foram executados;
- duas rodadas foram executadas;
- gravações foram revisadas;
- tema fraco foi repetido;
- commit recomendado e diário de bordo estão presentes;
- entrevista de segurança não foi antecipada.

---

## Commit recomendado

Antes do commit:

```powershell
git status

git diff

git diff --check

.\scripts\interview-SQL-banco\validate-SQL-answers.ps1

.\scripts\interview-SQL-banco\run-SQL-exercises.ps1

.\scripts\validate-secrets.ps1
```

Adicione:

```powershell
git add `
  docs/interview-SQL-banco `
  scripts/interview-SQL-banco `
  reports/SQL-database-interview-report.yaml `
  contracts/SQL-database-interview-evidence.yaml `
  docs/diario-de-bordo.md
```

Procure conteúdo proibido:

```powershell
git diff `
  --cached `
| Select-String `
    -Pattern `
    "Bearer ey|client_secret|private_key|access_token|refresh_token|production-connection-string|memorized-false-answer|security-mock|realTenant|realCustomer"
```

Commit recomendado:

```powershell
git commit `
  -m `
  "docs(interview): prepare SQL database interview"
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

- connection string real;
- dado sensível;
- resposta sem prova;
- entrevista detalhada da aula 710.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você realizou a preparação completa para uma entrevista SQL banco.

Você estruturou:

```text
relational modeling;

keys;

constraints;

normalization;

SQL core;

joins;

aggregations;

subqueries;

CTEs;

window functions;

indexes;

execution plans;

transactions;

MVCC;

isolation;

locks;

deadlocks;

pagination;

performance;

migrations;

partitioning;

troubleshooting;

coding exercises;

mock interview;

scorecard;

report e evidence.
```

Agora você consegue explicar dados e banco como comportamento, custo, integridade e concorrência.

A próxima aula será:

```text
710 - M20.40 - Entrevista seguranca
```

Nela, você treinará autenticação, autorização, OAuth2, JWT, OWASP, tenant isolation, cryptography, secrets, vulnerabilidades, threat modeling, testes negativos e resposta a incidentes.

Nenhuma entrevista de segurança foi executada nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Revisei modelagem relacional.
- [ ] Revisei chaves e constraints.
- [ ] Revisei normalização.
- [ ] Revisei SQL core.
- [ ] Revisei joins.
- [ ] Revisei agregações.
- [ ] Revisei CTEs e windows.
- [ ] Revisei índices.
- [ ] Revisei planos.
- [ ] Revisei transações e MVCC.
- [ ] Revisei isolamento e locks.
- [ ] Revisei deadlocks.
- [ ] Revisei performance.
- [ ] Executei exercícios.
- [ ] Preservei segurança para a aula 710.

---

## Troubleshooting adicional

### Query correta está lenta

Leia o plano e compare cardinalidade.

### Índice não é usado

Revise seletividade, função, cast e estatísticas.

### Join duplica linhas

Revise cardinalidade.

### Offset fica lento

Considere keyset.

### Deadlock aparece raramente

Colete ordem de locks e queries.

### Pool esgota

Revise transações e leak.

### Migration bloqueia tabela

Planeje etapas e estratégia compatível.

### Particionamento não melhora

Talvez o predicado não permita pruning.

### Tenant aparece em outra empresa

Trate como incidente crítico.

### Quero estudar segurança agora

Essa etapa pertence à aula 710.

---

## Perguntas de revisão

1. Banco é apenas armazenamento?
2. Primary key e unique são iguais?
3. Para que serve foreign key?
4. O que normalização reduz?
5. DISTINCT corrige join errado?
6. WHERE e HAVING são iguais?
7. LEFT JOIN preserva qual lado?
8. COUNT(coluna) conta NULL?
9. CTE sempre materializa?
10. Window function colapsa linhas?
11. Índice sempre melhora?
12. O que selectivity representa?
13. Cost é milissegundo?
14. Sequential scan é sempre ruim?
15. O que MVCC permite?
16. Serializable impede qualquer falha?
17. O que SKIP LOCKED faz?
18. Como prevenir deadlock?
19. Offset escala bem?
20. O que tuning começa fazendo?
21. Backup sem restore testado é suficiente?
22. O que a aula 710 fará?
23. O que não foi executado?
24. Qual é a próxima aula?
25. Qual é a regra central?

---

## Roteiro de resposta

1. Não.
2. Não.
3. Integridade referencial.
4. Duplicação.
5. Não.
6. Não.
7. Esquerdo.
8. Não.
9. Não necessariamente.
10. Não.
11. Não.
12. Capacidade de filtrar.
13. Não.
14. Não.
15. Versões concorrentes.
16. Não.
17. Ignora linhas bloqueadas.
18. Ordem consistente.
19. Não em grandes offsets.
20. Medindo.
21. Não.
22. Entrevista de segurança.
23. Segurança aprofundada.
24. Entrevista seguranca.
25. Modelar, medir e explicar custos.

---

## Atualização do diário de bordo

Adicione em:

```text
docs/diario-de-bordo.md
```

```markdown
# Aula 709 - M20.39 - Entrevista SQL banco

- Continuei após Entrevista Spring JPA.
- Criei SQL Database Interview Charter.
- Criei Relational Modeling Question Bank.
- Revisei tabelas, linhas, colunas, cardinalidade e relações.
- Revisei nullability e tipos.
- Criei Keys Constraints Question Bank.
- Revisei primary, unique, foreign key, check e not null.
- Comparei natural, surrogate e composite keys.
- Relacionei tenant a constraints.
- Criei Normalization Question Bank.
- Revisei formas normais, benefícios e custos.
- Revisei desnormalização e read models.
- Criei SQL Core Question Bank.
- Revisei ordem lógica, WHERE, HAVING, aliases, DISTINCT, CASE, COALESCE e NULL.
- Comparei IN e EXISTS.
- Criei Joins Question Bank.
- Revisei INNER, LEFT, RIGHT, FULL, CROSS e self join.
- Revisei cardinalidade, duplicidade e anti-join.
- Criei Aggregation Question Bank.
- Revisei COUNT, SUM, AVG, MIN, MAX, GROUP BY e HAVING.
- Criei Subquery CTE Question Bank.
- Revisei subqueries, CTEs e recursão.
- Criei Window Functions Question Bank.
- Revisei ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD e running totals.
- Criei Indexes Question Bank.
- Revisei B-tree, composto, selectivity, covering, partial, unique e custos.
- Revisei sargability e índices não usados.
- Criei Execution Plan Question Bank.
- Revisei EXPLAIN, ANALYZE, scans, joins, cardinalidade, statistics e cost.
- Criei Transactions MVCC Question Bank.
- Revisei ACID, MVCC, snapshot, commit, rollback e transações longas.
- Criei Isolation Locking Question Bank.
- Revisei dirty, non-repeatable e phantom reads.
- Revisei Read Committed, Repeatable Read e Serializable.
- Revisei row locks, FOR UPDATE, SKIP LOCKED e timeout.
- Criei Deadlock Question Bank.
- Revisei detecção, prevenção e diagnóstico.
- Criei Pagination Question Bank.
- Comparei offset e keyset.
- Criei Database Performance Guide.
- Revisei tuning, I/O, CPU, memory, pool, batch, statistics, vacuum e slow log.
- Criei Migration Partitioning Question Bank.
- Revisei migration segura, expand-migrate-contract, índices e particionamento.
- Revisei backup e restore.
- Criei Database Troubleshooting.
- Diagnostiquei query lenta, pool, locks, crescimento, duplicate, tenant e planos.
- Criei SQL Coding Exercises.
- Preparei dez exercícios.
- Criei Mock SQL Database Interview.
- Executei duas rodadas.
- Gravei entrevistas.
- Criei Scorecard.
- Criei Review Checklist.
- Criei Matrix.
- Criei Risk Register.
- Criei Traceability.
- Criei boundary para a aula 710.
- Criei report, evidence e gate.
- Revisei gravações.
- Repeti o tema mais fraco.
- Não antecipei entrevista de segurança.
- Próxima aula: Entrevista seguranca.
```

---

## Referência técnica curta

- Relational Model.
- Primary Key.
- Foreign Key.
- Unique Constraint.
- Normalization.
- Join.
- Aggregation.
- CTE.
- Window Function.
- B-Tree.
- Selectivity.
- Execution Plan.
- Sequential Scan.
- Index Scan.
- MVCC.
- Isolation.
- Lock.
- Deadlock.
- Keyset Pagination.
- Migration.
- Partitioning.
- Vacuum.

Regra final:

```text
A entrevista SQL banco do OrderFlow deve demonstrar modelagem, custo e concorrência: relational modeling cobre tables, rows, columns, types, nullability, cardinality and association tables, keys and constraints incluem primary, unique, foreign key, check, not null, natural, surrogate, composite and tenant-aware constraints, normalization reduz duplicação e read models permitem desnormalização medida, SQL core cobre logical order, WHERE, HAVING, NULL, CASE, COALESCE, IN, EXISTS and selective columns, joins explicam inner, outer, cross, self, multiplication and anti-join, aggregations cobrem count, sum, avg, grouping and conditional totals, subqueries, CTEs and window functions resolvem decomposição, ranking, lag and running totals, indexes cobrem B-tree, composite order, prefix, selectivity, covering, partial, unique, sargability and write cost, execution plans explicam estimates, actual rows, sequential, index, bitmap, nested loop, hash and merge joins, transactions and MVCC cobrem ACID, snapshots, long transactions and application boundaries, isolation distingue dirty, non-repeatable and phantom reads em Read Committed, Repeatable Read and Serializable, locks cobrem FOR UPDATE, SKIP LOCKED, timeout and deadlocks, pagination compara offset and keyset, performance tuning parte de reproduction, metrics, plans, statistics, pool, batch, vacuum and slow queries, migrations usam compatibility and expand-migrate-contract, partitioning depende de workload and pruning, troubleshooting investiga query, pool, locks, growth, tenant and plan instability, duas mock interviews geram scorecard, report and evidence, e o gate fecha SQL, database behavior and interview practice enquanto authentication, authorization, OAuth2, JWT, OWASP, tenant security, cryptography, secrets, threat modeling and negative tests permanecem reservados para a aula 710.
```
