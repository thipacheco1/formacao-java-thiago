# Roteiro operacional reconstruido completo

Este documento explica como continuar a formacao Java Backend sem perder sequencia, nomes, profundidade ou intencao pedagogica.

A fonte da verdade das aulas ja geradas e:

```text
docs/aulas
```

A grade operacional correta para continuar depois da aula 387 e:

```text
docs/FONTE_DA_VERDADE_CONTINUIDADE_CURSO/GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_387.csv
```

## Estado validado

Validacao feita sobre `docs/aulas` e sobre a grade atualizada:

```text
Aulas fisicas existentes: 388
Aulas logicas existentes: 000 a 387
Numeros faltando entre 000 e 387: nenhum
Numeros duplicados entre 000 e 387: nenhum
Ultima aula real: 387
Proxima aula: 388
Modulo atual: M14
Total de linhas na grade atualizada: 721
Intervalo total planejado: 000 a 720
Aulas concluidas registradas: 388
Aulas planejadas reconstruidas: 333
```

## Como ler a grade CSV

Colunas da grade:

```text
numero_aula          Numero global da aula.
codigo_aula          Codigo interno do modulo, como M14.33.
modulo               Modulo pedagogico.
nome_modulo          Nome do modulo.
status_aula          CONCLUIDA_GERADA ou PLANEJADA_RECONSTRUIDA.
tipo_aula            Tipo operacional da aula.
titulo_aula          Titulo previsto ou titulo real.
arquivo_md           Nome exato do arquivo Markdown.
conteudo_principal   Descricao do foco da aula.
fonte_decisao        Origem da decisao.
regra_continuidade   Regra para nao quebrar a sequencia.
```

Regras de uso:

- Se `status_aula` for `CONCLUIDA_GERADA`, nao reescreva a aula.
- Se `status_aula` for `CONCLUIDA_GERADA`, leia o arquivo real em `docs/aulas`.
- Se `status_aula` for `PLANEJADA_RECONSTRUIDA`, use a linha como roteiro da aula futura.
- Gere apenas uma aula por vez.
- Ao terminar uma aula nova, a proxima deve seguir a linha seguinte da CSV.
- Se houver divergencia entre uma grade antiga e `docs/aulas`, vence `docs/aulas`.
- Se houver divergencia entre a CSV antiga e a CSV atualizada pos-387, vence a CSV atualizada pos-387.

## Ponto exato de retomada

Ultima aula real:

```text
387_M14_32_ASYNC_NO_SPRING_OFICIAL.md
# 387 - M14.32 - Async no Spring
```

Proxima aula:

```text
388_M14_33_CACHE_COM_SPRING_REDIS_OFICIAL.md
# 388 - M14.33 - Cache com Spring Redis
```

Projeto:

```text
formacao-java-backend-api
```

## Contexto da aula 387

A aula 387 fechou async no Spring.

Ela tratou de:

- `@EnableAsync`;
- `@Async`;
- proxy e self-invocation;
- `ThreadPoolTaskExecutor`;
- pool, fila, rejeicao e shutdown;
- `TaskDecorator`;
- MDC com whitelist;
- `AsyncUncaughtExceptionHandler`;
- `CompletableFuture`;
- `@TransactionalEventListener`;
- bridge `AFTER_COMMIT`;
- `REQUIRES_NEW` no worker;
- limites de tasks em memoria.

Ela tambem deixou claro:

```text
async nao e cache;
async nao e fila duravel;
async nao e outbox;
async nao garante exactly once;
Redis nao foi adicionado ainda.
```

## Objetivo da aula 388

A aula 388 deve introduzir cache com Spring Redis.

Foco:

```text
cache como otimizacao controlada;
cache nao e fonte da verdade;
Redis como cache externo;
Spring Cache abstraction;
@EnableCaching;
@Cacheable;
@CacheEvict;
CacheManager;
RedisCacheManager;
TTL;
chaves de cache;
serializacao;
cache hit e miss;
invalidacao;
risco de dado velho;
diagnostico basico;
limites do cache.
```

Nao aprofundar ainda:

```text
rate limiting;
upload/download;
scheduler;
email;
MockMvc;
testes de service;
testes de integracao;
observabilidade avancada;
Dockerizacao completa da API;
Compose final API PostgreSQL Redis;
mensageria;
broker;
outbox;
pub/sub;
lock distribuido;
arquitetura distribuida avancada.
```

## Sequencia imediata do M14

| Aula | Codigo | Arquivo | Foco |
|---:|---|---|---|
| 388 | M14.33 | `388_M14_33_CACHE_COM_SPRING_REDIS_OFICIAL.md` | Cache com Spring Redis. |
| 389 | M14.34 | `389_M14_34_RATE_LIMITING_OFICIAL.md` | Rate limiting. |
| 390 | M14.35 | `390_M14_35_UPLOAD_DOWNLOAD_OFICIAL.md` | Upload download. |
| 391 | M14.36 | `391_M14_36_SCHEDULER_OFICIAL.md` | Scheduler. |
| 392 | M14.37 | `392_M14_37_EMAIL_E_NOTIFICACAO_SIMPLES_OFICIAL.md` | Email e notificacao simples. |
| 393 | M14.38 | `393_M14_38_TESTES_DE_CONTROLLER_COM_MOCKMVC_OFICIAL.md` | Testes de controller com MockMvc. |
| 394 | M14.39 | `394_M14_39_TESTES_DE_SERVICE_EM_SPRING_OFICIAL.md` | Testes de service em Spring. |
| 395 | M14.40 | `395_M14_40_TESTES_DE_INTEGRACAO_SPRING_COM_TESTCONTAINERS_OFICIAL.md` | Testes de integracao Spring com Testcontainers. |
| 396 | M14.41 | `396_M14_41_TESTES_DE_CONTRATO_INTRODUCAO_OFICIAL.md` | Testes de contrato introducao. |
| 397 | M14.42 | `397_M14_42_OBSERVABILIDADE_INICIAL_COM_ACTUATOR_OFICIAL.md` | Observabilidade inicial com Actuator. |
| 398 | M14.43 | `398_M14_43_HEALTH_READINESS_LIVENESS_OFICIAL.md` | Health readiness liveness. |
| 399 | M14.44 | `399_M14_44_DOCKERIZANDO_API_SPRING_OFICIAL.md` | Dockerizando API Spring. |
| 400 | M14.45 | `400_M14_45_COMPOSE_API_POSTGRESQL_REDIS_OFICIAL.md` | Compose API PostgreSQL Redis. |
| 401 | M14.46 | `401_M14_46_COLECAO_POSTMAN_INSOMNIA_PROFISSIONAL_OFICIAL.md` | Colecao Postman Insomnia profissional. |
| 402 | M14.47 | `402_M14_47_DOCUMENTACAO_TECNICA_DA_API_OFICIAL.md` | Documentacao tecnica da API. |
| 403 | M14.48 | `403_M14_48_ERROS_COMUNS_EM_API_REST_OFICIAL.md` | Erros comuns em API REST. |
| 404 | M14.49 | `404_M14_49_CHECKLIST_DE_PRODUCAO_INICIAL_OFICIAL.md` | Checklist de producao inicial. |
| 405 | M14.50 | `405_M14_50_PROJETO_API_OS_PARTE_1_DOMINIO_E_CRUD_OFICIAL.md` | Projeto API OS parte 1. |
| 406 | M14.51 | `406_M14_51_PROJETO_API_OS_PARTE_2_VALIDACOES_E_ERROS_OFICIAL.md` | Projeto API OS parte 2. |
| 407 | M14.52 | `407_M14_52_PROJETO_API_OS_PARTE_3_PERSISTENCIA_E_FILTROS_OFICIAL.md` | Projeto API OS parte 3. |
| 408 | M14.53 | `408_M14_53_PROJETO_API_OS_PARTE_4_TESTES_E_DOCUMENTACAO_OFICIAL.md` | Projeto API OS parte 4. |
| 409 | M14.54 | `409_M14_54_REVISAO_TECNICA_SPRING_BOOT_APIS_OFICIAL.md` | Revisao tecnica Spring Boot APIs. |
| 410 | M14.55 | `410_M14_55_FECHAMENTO_DO_MODULO_14_SPRING_BOOT_OFICIAL.md` | Fechamento do M14. |

## Mapa completo de modulos

| Modulo | Aulas | Total | Status | Objetivo |
|---|---:|---:|---|---|
| Abertura | 000 | 1 | Gerado | Apresentar a formacao e o caminho ate engenharia backend. |
| M0 | 001-020 | 20 | Gerado | Ambiente, metodo, ferramentas e rotina profissional. |
| M1 | 021-061 | 41 | Gerado | Fundamentos absolutos de Java. |
| M2 | 062-089 | 28 | Gerado | Java Core profundo. |
| M3 | 090-104 | 15 | Gerado | Metodos e organizacao procedural. |
| M4 | 105-145 | 41 | Gerado | Orientacao a objetos e dominio. |
| M5 | 146-171 | 26 | Gerado | Collections Framework. |
| M6 | 172-185 | 14 | Gerado | Generics e Optional. |
| M7 | 186-200 | 15 | Gerado | Functional Interfaces, lambdas e Streams. |
| M8 | 201-214 | 14 | Gerado | Exceptions, I/O, CSV, Date/Time e utilitarios. |
| M9 | 215-222 | 8 | Gerado | SOLID. |
| M10 | 223-244 | 22 | Gerado | Design Patterns. |
| M11 | 245-270 | 26 | Gerado | Ferramentas profissionais, testes, Docker e CI/CD. |
| M12 | 271-310 | 40 | Gerado | SQL, PostgreSQL e modelagem relacional. |
| M13 | 311-355 | 45 | Gerado | Persistencia Java: JDBC, JPA, Hibernate e Spring Data. |
| M14 | 356-410 | 55 | Em andamento | Spring Boot, APIs REST e backend profissional. |
| M15 | 411-455 | 45 | Planejado | Seguranca de aplicacoes Java. |
| M16 | 456-505 | 50 | Planejado | Integracoes, mensageria, eventos e resiliencia. |
| M17 | 506-555 | 50 | Planejado | DevOps, CI/CD, Kubernetes e Cloud. |
| M18 | 556-610 | 55 | Planejado | Observabilidade, performance, concorrencia e producao. |
| M19 | 611-670 | 60 | Planejado | Arquitetura, DDD e sistemas distribuidos. |
| M20 | 671-720 | 50 | Planejado | Projeto final, carreira e defesa tecnica. |

## Padrao editorial obrigatorio

Continuar usando o Padrao Editorial Aula V2:

- portugues brasileiro;
- tom de mentor tecnico;
- profundidade pratica, nao resumo;
- progressao gradual;
- foco em Java 21 e Spring Boot;
- Markdown;
- H1 no formato `# NNN - Mx.yy - Titulo da aula`;
- arquivo em caixa alta com underscores e sufixo `_OFICIAL.md`;
- aula principal focada;
- material complementar separado;
- checkpoint curto;
- commit recomendado;
- fechamento com ponte para a proxima aula.

## Criterio de sucesso

O curso so continua corretamente se cada nova aula:

- respeitar a linha correspondente da CSV atualizada;
- ler a aula anterior antes de escrever;
- manter a ponte com a aula anterior;
- preparar a proxima aula sem mudar a grade;
- seguir o Padrao Editorial Aula V2;
- aumentar a maturidade do aluno rumo a senioridade, arquitetura e engenharia backend.
