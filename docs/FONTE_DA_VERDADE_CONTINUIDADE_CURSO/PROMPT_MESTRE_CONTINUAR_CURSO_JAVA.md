# Prompt mestre para continuar a formacao Java Backend a partir da aula 388

Este documento existe para retomar a geracao das aulas em outro chat sem perder sequencia, estilo, nomes, diretorios, profundidade e raciocinio pedagogico.

Use este prompt junto com:

```text
ORDEM_DE_ENVIO_AO_CHAT.md
LEIA_PRIMEIRO_FONTE_DA_VERDADE.md
ROTEIRO_OPERACIONAL_RECONSTRUIDO_COMPLETO.md
GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_387.csv
387_M14_32_ASYNC_NO_SPRING_OFICIAL.md
REVISAO_EDITORIAL_V2/PADRAO_EDITORIAL_AULA_V2.md
```

## Diagnostico do estado atual

- A fonte da verdade das aulas ja geradas e `docs/aulas`.
- Existem 388 arquivos Markdown reais.
- A numeracao real vai de `000` a `387`.
- Nao ha aula `388` real em `docs/aulas` no momento desta atualizacao.
- A aula `387` e a ultima aula valida gerada.
- A aula `387` tratou de Async no Spring.
- A proxima aula deve continuar o M14.
- O M14 e sobre Spring Boot, REST APIs e backend profissional.
- A grade operacional correta para continuar agora e:
  - `GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_387.csv`
- Arquivos `POS_270` e `ATE_259` sao historicos. Nao usar como ponto atual de retomada.

## Ultimo arquivo valido

```text
387_M14_32_ASYNC_NO_SPRING_OFICIAL.md
```

H1:

```text
# 387 - M14.32 - Async no Spring
```

A aula 387 consolidou:

```text
@EnableAsync;
@Async por proxy;
self-invocation;
executor nomeado e limitado;
ThreadPoolTaskExecutor;
pool, queue, rejection e shutdown;
TaskDecorator com propagacao controlada de MDC;
AsyncUncaughtExceptionHandler;
CompletableFuture;
transaction REQUIRES_NEW em outro bean;
bridge AFTER_COMMIT;
tasks em memoria nao duraveis;
limites de async;
sem Redis, sem cache, sem broker, sem outbox e sem promessa de entrega duravel.
```

Ela termina apontando que a proxima aula e:

```text
Cache com Spring Redis.
```

## Proxima aula obrigatoria

```text
Numero global:
388

Codigo interno:
M14.33

Arquivo:
388_M14_33_CACHE_COM_SPRING_REDIS_OFICIAL.md

H1:
# 388 - M14.33 - Cache com Spring Redis

Modulo:
M14 - Spring Boot, REST APIs e backend profissional

Projeto:
formacao-java-backend-api
```

## Sequencia real ja produzida

- `000`: abertura da formacao.
- `001` a `020` - M0: ambiente, metodo, ferramentas, Git, Maven, PostgreSQL, HTTP, Docker Desktop/WSL2 e rotina profissional.
- `021` a `061` - M1: fundamentos absolutos de Java.
- `062` a `089` - M2: Java Core profundo.
- `090` a `104` - M3: organizacao procedural, metodos e projetos console.
- `105` a `145` - M4: orientacao a objetos, dominio, encapsulamento, invariantes, agregados e mini-projeto.
- `146` a `171` - M5: Collections Framework.
- `172` a `185` - M6: Generics e Optional.
- `186` a `200` - M7: Functional Interfaces, lambdas e Streams.
- `201` a `214` - M8: exceptions, I/O, CSV, datas e utilitarios modernos.
- `215` a `222` - M9: SOLID.
- `223` a `244` - M10: Design Patterns aplicados ao backend.
- `245` a `270` - M11: ferramentas profissionais, Maven, Git, testes, qualidade, Docker, CI/CD, Testcontainers, WireMock e ArchUnit.
- `271` a `310` - M12: SQL, PostgreSQL e modelagem relacional.
- `311` a `355` - M13: persistencia Java com JDBC, JPA, Hibernate, Spring Data, migrations, repositories, transactions, testes e fechamento.
- `356` a `387` - M14 ate agora: Spring Boot, Initializr, auto-configuration, properties, profiles, beans, DI, controllers, REST, DTOs, mappers, Bean Validation, exceptions, Problem Details, CRUD, PUT/PATCH, paginacao, filtros, OpenAPI, versionamento, profiles seguros, logging, filters/interceptors, eventos internos e async.

## O que a aula 388 deve fazer

A aula 388 deve introduzir cache com Spring e Redis dentro do projeto `formacao-java-backend-api`.

Ela deve conectar com a aula 387 assim:

```text
A aula 387 ensinou execucao assincrona e deixou claro que async em memoria nao e cache, nao e fila, nao e entrega duravel e nao usa Redis.
A aula 388 deve entrar em Redis pelo caminho correto: cache controlado para leitura, performance e reducao de custo de consultas repetidas.
```

A aula 388 deve ensinar:

```text
o problema que cache resolve;
o que cache nao resolve;
cache como otimizacao, nao como fonte da verdade;
Redis como armazenamento externo de cache;
Spring Cache abstraction;
@EnableCaching;
@Cacheable;
@CachePut quando fizer sentido;
@CacheEvict;
CacheManager;
RedisCacheManager;
TTL;
chaves de cache;
prefixos;
serializacao;
invalidacao;
cache hit e cache miss;
risco de dado velho;
diagnostico basico no Redis;
limites do cache em API REST;
quando nao usar cache.
```

A aula deve manter o projeto real:

```text
formacao-java-backend-api
```

Direcao pratica sugerida:

```text
1. revisar rapidamente o ponto da aula 387;
2. explicar cache como leitura otimizada;
3. adicionar dependencias necessarias para Redis/cache;
4. preparar Redis local de forma simples;
5. configurar propriedades de cache;
6. habilitar cache;
7. criar cache em uma consulta de leitura que faça sentido;
8. mostrar cache hit/miss por log ou diagnostico simples;
9. invalidar cache em escrita relevante;
10. configurar TTL;
11. documentar riscos e limites;
12. testar manualmente com chamadas HTTP;
13. recomendar commit.
```

## O que a aula 388 nao deve fazer

Nao antecipar:

```text
Rate limiting;
upload/download;
scheduler;
email;
MockMvc;
testes de service em Spring;
testes de integracao completos;
testes de contrato;
Actuator e observabilidade profunda;
Dockerizacao completa da API;
Compose final API + PostgreSQL + Redis;
colecao Postman profissional;
projeto API OS final;
mensageria;
broker;
outbox;
pub/sub;
fila;
lock distribuido;
SAGA;
arquitetura de cache distribuido avancada.
```

Redis nesta aula deve ser tratado como:

```text
cache externo para a API Spring.
```

Nao tratar Redis como:

```text
broker;
fila duravel;
banco principal;
substituto de PostgreSQL;
solucao magica de performance;
garantia de consistencia.
```

## Padrao editorial obrigatorio

Continuar usando o Padrao Editorial Aula V2.

A aula deve ter duas camadas:

```text
1. AULA
2. MATERIAL COMPLEMENTAR
```

Na parte `AULA`, manter apenas o que o aluno precisa para:

```text
entender;
executar;
comparar;
errar com seguranca;
corrigir;
commitar;
conectar com a proxima aula.
```

Estrutura recomendada:

```text
# 388 - M14.33 - Cache com Spring Redis

## Apresentacao da aula
## Onde estamos na formacao
## Objetivo pratico
## Conceito essencial
## Mao na massa guiada
## Entendendo o que foi feito
## Erros comuns importantes
## Comandos uteis
## Exercicio guiado
## Criterios de aceite
## Commit recomendado
## Fechamento e ponte para a proxima aula

---

# Material complementar

## Checkpoint final
## Troubleshooting adicional
## Perguntas de revisao
## Roteiro de resposta
## Desafio opcional
## Atualizacao do diario de bordo
## Referencia tecnica curta
```

Regras editoriais:

- Nao deixar a aula rasa.
- Nao cortar explicacoes importantes.
- Nao transformar a aula em resumo.
- Nao colocar checklist enorme dentro da aula principal.
- Nao colocar simulado longo em toda aula.
- Nao repetir a mesma ideia em muitas secoes.
- Nao escrever cada frase como um paragrafo isolado.
- Agrupar frases relacionadas em paragrafos compactos.
- Usar listas quando elas melhorarem o estudo.
- Usar exemplos praticos.
- Manter o tom de mentor tecnico.
- Preservar profundidade de formacao senior/arquiteto.

## Sequencia planejada imediata

Depois da aula 388, continuar nesta ordem:

```text
388 M14.33 Cache com Spring Redis
389 M14.34 Rate limiting
390 M14.35 Upload download
391 M14.36 Scheduler
392 M14.37 Email e notificacao simples
393 M14.38 Testes de controller com MockMvc
394 M14.39 Testes de service em Spring
395 M14.40 Testes de integracao Spring com Testcontainers
396 M14.41 Testes de contrato introducao
397 M14.42 Observabilidade inicial com Actuator
398 M14.43 Health readiness liveness
399 M14.44 Dockerizando API Spring
400 M14.45 Compose API PostgreSQL Redis
401 M14.46 Colecao Postman Insomnia profissional
402 M14.47 Documentacao tecnica da API
403 M14.48 Erros comuns em API REST
404 M14.49 Checklist de producao inicial
405 M14.50 Projeto API OS parte 1 dominio e CRUD
406 M14.51 Projeto API OS parte 2 validacoes e erros
407 M14.52 Projeto API OS parte 3 persistencia e filtros
408 M14.53 Projeto API OS parte 4 testes e documentacao
409 M14.54 Revisao tecnica Spring Boot APIs
410 M14.55 Fechamento do Modulo 14 Spring Boot
```

## Prompt para colar no novo chat

```text
Voce vai assumir a continuidade de uma formacao Java Backend extensa que ja possui aulas geradas em Markdown na pasta docs/aulas.

Tarefa principal:
continuar a geracao do curso a partir do ponto exato em que ele parou, sem mudar a sequencia, sem renomear padroes, sem trocar modulo, sem pular assunto e sem reescrever aulas antigas.

Fonte da verdade:
- Aulas reais ja geradas: docs/aulas
- Grade operacional atualizada: GRADE_OPERACIONAL_RECONSTRUIDA_COMPLETA_ATUALIZADA_POS_387.csv
- Ultima aula real: 387_M14_32_ASYNC_NO_SPRING_OFICIAL.md
- Padrao editorial: REVISAO_EDITORIAL_V2/PADRAO_EDITORIAL_AULA_V2.md

Estado atual validado:
- Existem 388 aulas reais, numeradas de 000 a 387.
- Nao gere aula 387 ou anteriores.
- A aula 387 tratou de Async no Spring.
- A proxima aula e 388.
- A aula 388 continua o M14.
- M14 e Spring Boot, REST APIs e backend profissional.

Ultima aula valida:
387_M14_32_ASYNC_NO_SPRING_OFICIAL.md

Proxima aula a gerar:
388_M14_33_CACHE_COM_SPRING_REDIS_OFICIAL.md

H1 da proxima aula:
# 388 - M14.33 - Cache com Spring Redis

Projeto:
formacao-java-backend-api

Direcao da aula 388:
- introduzir cache com Spring e Redis;
- explicar cache como otimizacao e nao como fonte da verdade;
- usar Redis como cache externo;
- cobrir Spring Cache, @EnableCaching, @Cacheable, @CacheEvict, CacheManager, RedisCacheManager, TTL, chaves, invalidacao, serializacao, cache hit/miss e diagnostico;
- conectar com a aula 387, deixando claro que async em memoria nao e cache nem entrega duravel;
- nao antecipar rate limiting, upload/download, scheduler, email, testes, observabilidade profunda, Dockerizacao, Compose final, mensageria, broker, outbox ou arquitetura distribuida completa.

Antes de gerar conteudo, responda apenas:
1. Ultimo arquivo valido.
2. Proximo numero global.
3. Modulo atual.
4. Arquivo exato da proxima aula.
5. Tres coisas que voce nao pode fazer para nao quebrar a continuidade.

Depois aguarde meu comando GERAR_AULA_388.
```

## Comando de geracao

Quando o novo chat confirmar corretamente o entendimento, envie:

```text
GERAR_AULA_388
```

Ele deve gerar somente a aula 388 completa, pronta para salvar no arquivo indicado.
