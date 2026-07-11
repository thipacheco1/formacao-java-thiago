# Analise das grades e roteiro de continuidade

Este documento registra por que a continuidade do curso deve seguir a fonte da verdade atualizada e nao voltar para grades antigas.

O nome do arquivo menciona `pos_259` porque ele nasceu na primeira retomada do curso. O estado atual, porem, ja foi atualizado para a retomada pos-aula 387.

## Estado atual validado

```text
Aulas reais ja geradas: 000 a 387
Total de aulas reais: 388
Ultima aula real: 387
Modulo atual: M14
Proxima aula: 388
Tema da proxima aula: Cache com Spring Redis
```

Proxima aula correta:

```text
388_M14_33_CACHE_COM_SPRING_REDIS_OFICIAL.md
# 388 - M14.33 - Cache com Spring Redis
```

Grade operacional correta para continuar:

```text
GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_387.csv
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
2. Para aulas futuras, vence GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_387.csv.
3. Para entender lacunas avancadas, usar as grades antigas como checklist, nunca como numeracao literal.
```

## Reconciliacao feita

A grade atualizada preserva:

- todas as aulas reais de `000` a `387`;
- o M12 completo;
- o M13 completo;
- o M14 em andamento;
- a transicao correta da aula 387 para a aula 388;
- os modulos futuros ate `M20`;
- a regra de gerar uma aula por vez.

Estado da grade atualizada:

```text
Intervalo: 000 a 720
Total de linhas: 721
Aulas concluidas: 388
Aulas planejadas: 333
Numeros faltando em docs/aulas: nenhum
Numeros duplicados em docs/aulas: nenhum
```

## Ponto de continuidade

A continuidade correta e:

```text
M14 em andamento.
Ultima aula: 387 - Async no Spring.
Gerar somente a aula 388.
```

A aula 388 deve tratar de:

```text
cache;
Spring Cache;
Redis;
TTL;
chaves;
invalidacao;
CacheManager;
RedisCacheManager;
@EnableCaching;
@Cacheable;
@CacheEvict;
cache hit;
cache miss;
risco de dado velho;
diagnostico basico.
```

A aula 388 nao deve tratar ainda de:

```text
rate limiting;
upload/download;
scheduler;
email;
testes de controller;
testes de service;
testes de integracao;
observabilidade avancada;
Dockerizacao final da API;
Compose completo API PostgreSQL Redis;
mensageria;
outbox;
broker;
lock distribuido;
arquitetura distribuida avancada.
```

## Por que isso protege o curso

O objetivo da formacao nao e apenas ensinar Java isolado.

O objetivo e levar o aluno do zero ate um nivel de backend profissional, senior, arquiteto e engenheiro.

Para isso, a sequencia precisa respeitar dependencias pedagogicas:

```text
Java base antes de OO profunda.
OO antes de collections aplicadas.
Collections antes de generics e streams.
SOLID antes de patterns.
Patterns antes de ferramentas profissionais.
Ferramentas antes de banco em producao.
SQL e modelagem antes de JPA.
JPA antes de Spring Data.
Spring Boot depois da base de linguagem, ferramentas e dados.
Cache depois de API, DTO, validacao, erro, CRUD, filtros, OpenAPI, logging, eventos e async.
Rate limiting depois de cache.
Arquitetura, seguranca, eventos externos, cloud e observabilidade avancada depois da base backend.
```

Se essa ordem for quebrada, o aluno ate pode copiar codigo, mas nao entende o que esta fazendo.

## Regra final para novos chats

Todo novo chat deve obedecer:

```text
Ultima aula valida: 387
Proxima aula: 388
Arquivo: 388_M14_33_CACHE_COM_SPRING_REDIS_OFICIAL.md
Grade operacional: GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_387.csv
Padrao editorial: REVISAO_EDITORIAL_V2/PADRAO_EDITORIAL_AULA_V2.md
```

E nunca deve:

- reescrever aulas antigas;
- renumerar;
- mudar nomes de arquivos;
- mudar nomes de modulos;
- voltar para M12 ou M13;
- ignorar a aula 387;
- ignorar a CSV atualizada pos-387;
- pular a aula 388.
