# Analise das grades e roteiro de continuidade

Este documento registra por que a continuidade do curso deve seguir a fonte da verdade atualizada e nao voltar para grades antigas.

O nome do arquivo menciona `pos_259` porque ele nasceu na primeira retomada do curso. O estado atual, porem, ja foi atualizado para a retomada pos-aula 270.

## Estado atual validado

```text
Aulas reais ja geradas: 000 a 270
Total de aulas reais: 271
Ultima aula real: 270
Modulo M11: concluido
Proxima aula: 271
Modulo que inicia agora: M12
Tema do M12: SQL, PostgreSQL e modelagem relacional
```

Proxima aula correta:

```text
271_M12_01_INTRODUCAO_AO_SQL_POSTGRESQL_E_MODELAGEM_RELACIONAL_PARA_JAVA_BACKEND_OFICIAL.md
# 271 - M12.01 - Introducao ao SQL, PostgreSQL e modelagem relacional para Java Backend
```

Grade operacional correta para continuar:

```text
GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_270.csv
```

## Decisao principal

A fonte da verdade deve continuar sendo:

```text
docs/aulas
```

As grades CSV antigas sao fontes auxiliares. Elas nao podem sobrescrever a sequencia real ja produzida.

Regra de autoridade:

```text
1. Para aulas ja geradas, vence docs/aulas.
2. Para aulas futuras, vence GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_270.csv.
3. Para entender lacunas avancadas, usar as grades antigas como checklist, nunca como numeracao literal.
```

## Por que uma grade atualizada foi necessaria

O curso comecou seguindo uma grade inicial. Com o tempo, as aulas ficaram mais profundas e mais granulares.

Isso foi bom para a qualidade, porque assuntos importantes foram separados em aulas proprias, por exemplo:

```text
Collections;
Generics;
Optional;
Streams;
Exceptions;
I/O;
SOLID;
Design Patterns;
Maven;
Git;
JUnit;
Mockito;
AssertJ;
TDD;
JaCoCo;
SonarQube;
Docker;
Docker Compose;
CI/CD;
SCA;
SBOM;
Dependabot;
Testcontainers;
WireMock;
ArchUnit.
```

O problema e que as grades antigas ficaram atrasadas em relacao ao que foi realmente gerado.

Se um novo chat usar uma grade antiga como fonte principal, ele pode:

- voltar para assuntos ja feitos;
- gerar aula com numero errado;
- pular fechamento de modulo;
- mudar nome de arquivo;
- antecipar Spring Boot;
- entrar em JPA sem SQL;
- quebrar a ponte pedagogica entre aulas.

Por isso foi criada a grade operacional atualizada pos-aula 270.

## Grades antigas analisadas

### `grade_atualizada_curso_java_backend_thiago_ate_aula_145.csv`

Uso correto:

- boa referencia historica ate a base inicial do curso;
- ajudou a entender a intencao original;
- nao acompanha mais a granularidade real depois que o curso avancou.

Nao usar para:

- definir a proxima aula;
- renumerar aulas;
- substituir arquivos reais de `docs/aulas`.

### `GRADE_MENTORADA_PROPOSTA_A_AGRUPADA_AUDITAVEL.csv`

Uso correto:

- mapa macro;
- visao agrupada;
- apoio para verificar se grandes blocos da formacao estao presentes.

Nao usar para:

- controlar nomes de arquivos;
- definir aula por aula;
- substituir a CSV operacional atualizada.

### `GRADE_OPERACIONAL_MENTOR_V5_DOCUMENTOS.csv`

Uso correto:

- checklist de cobertura avancada;
- fonte de temas importantes para senioridade, engenharia e arquitetura.

Ela ajudou a preservar temas como:

```text
SCA;
SBOM;
Dependabot;
supply chain;
OpenAPI;
contract-first;
idempotencia;
resiliencia;
mensageria;
outbox;
cache;
observabilidade;
performance;
JFR;
JMC;
Kubernetes;
cloud;
migracao de banco sem downtime;
Clean Architecture;
Hexagonal;
DDD;
microservicos;
consistencia eventual;
SAGA;
Strangler Fig;
fitness functions arquiteturais;
defesa tecnica de projeto final.
```

Nao usar para:

- alterar a ordem atual;
- antecipar topicos que a formacao ainda nao preparou;
- pular a base de banco relacional.

## Reconciliacao feita

A grade atualizada preserva:

- todas as aulas reais de `000` a `270`;
- o fechamento completo do M11;
- a transicao correta para M12;
- os modulos futuros ate `M20`;
- as lacunas avancadas necessarias para formar um backend senior/arquiteto;
- a regra de gerar uma aula por vez.

Estado da grade atualizada:

```text
Intervalo: 000 a 720
Total de linhas: 721
Aulas concluidas: 271
Aulas planejadas: 450
Numeros faltando: nenhum
Numeros duplicados: nenhum
```

## Ponto de continuidade

A continuidade correta e:

```text
M11 encerrado.
M12 inicia agora.
Gerar somente a aula 271.
```

A aula 271 deve abrir banco de dados com base solida:

```text
banco de dados;
SGBD;
banco relacional;
SQL;
PostgreSQL;
tabelas;
linhas;
colunas;
chaves;
relacionamentos;
ambiente minimo de pratica.
```

A aula 271 nao deve entrar ainda em:

```text
JDBC;
JPA;
Hibernate;
Spring Data;
Spring Boot;
APIs REST;
Flyway em profundidade;
DDL completo;
joins;
indices;
transacoes avancadas.
```

## Por que isso protege o curso

O objetivo da formacao nao e apenas ensinar Java isolado.

O objetivo e levar o aluno do zero ate um nivel de backend profissional, senior, arquiteto e engenheiro.

Para isso, a sequencia precisa respeitar dependencias pedagogicas:

```text
Java base antes de OO profunda.
OO antes de collections aplicadas.
Collections antes de generics e streams.
Exceptions e I/O antes de arquitetura de erro.
SOLID antes de patterns.
Patterns antes de ferramentas profissionais.
Ferramentas antes de banco em producao.
SQL e modelagem antes de JPA.
JPA antes de Spring Data.
Spring Boot depois da base de linguagem, ferramentas e dados.
Arquitetura, DDD, eventos, cloud e observabilidade depois da base backend.
```

Se essa ordem for quebrada, o aluno ate pode copiar codigo, mas nao entende o que esta fazendo.

## Regra final para novos chats

Todo novo chat deve obedecer:

```text
Ultima aula valida: 270
Proxima aula: 271
Arquivo: 271_M12_01_INTRODUCAO_AO_SQL_POSTGRESQL_E_MODELAGEM_RELACIONAL_PARA_JAVA_BACKEND_OFICIAL.md
Grade operacional: GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_270.csv
Padrao editorial: REVISAO_EDITORIAL_V2/PADRAO_EDITORIAL_AULA_V2.md
```

E nunca deve:

- reescrever aulas antigas;
- renumerar;
- mudar nomes de arquivos;
- mudar nomes de modulos;
- pular para Spring Boot;
- pular para JPA;
- ignorar a aula 270;
- ignorar a CSV atualizada pos-270.
