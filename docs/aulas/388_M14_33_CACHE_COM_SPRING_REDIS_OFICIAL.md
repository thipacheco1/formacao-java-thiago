# 388 - M14.33 - Cache com Spring Redis

## Apresentação da aula

Na aula 387, você aprendeu a executar reações em outro thread com Spring, usando `@Async`, um executor nomeado, limites de capacidade, propagação controlada de contexto e uma nova transação no worker. Aquela aula também deixou uma separação importante:

```text
async não é cache;
async não reduz automaticamente o custo de uma consulta repetida;
async não transforma Redis em fila ou entrega durável.
```

Agora o problema é outro.

Considere a consulta:

```http
GET /api/v2/runtime/managed-messages/42
```

Sem cache, cada chamada percorre novamente toda a cadeia:

```text
controller;
application service;
repository;
JPA;
pool de conexões;
PostgreSQL;
mapeamento para resposta.
```

Esse fluxo está correto. O problema aparece quando o mesmo recurso é consultado muitas vezes e alterado poucas vezes. A aplicação passa a repetir o mesmo trabalho, aumentando latência, uso de conexões e pressão sobre o banco.

A pergunta central desta aula será:

```text
como evitar leituras repetidas
sem transformar o cache em fonte da verdade
e sem manter dados antigos por tempo indefinido?
```

A solução será construída com:

```text
Spring Cache;
Redis;
@EnableCaching;
@Cacheable;
@CacheEvict;
TTL;
chaves;
prefixo;
serialização JSON;
invalidação após commit.
```

A decisão principal será:

```text
PostgreSQL continua sendo a fonte da verdade;
Redis mantém apenas uma cópia temporária e descartável.
```

Se o Redis for apagado, a aplicação deve conseguir reconstruir o valor consultando o PostgreSQL.

Nesta aula, você cacheará somente a leitura individual por ID. Listagens, paginação, filtros e ordenações permanecerão sem cache. Essa escolha reduz a complexidade e permite estudar o mecanismo de forma correta.

O projeto continua em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
389 - M14.34 - Rate limiting
```

Por isso, Redis será usado somente como cache. Não haverá contagem de requests, bloqueio de consumidores, fila, mensageria, outbox, scheduler ou qualquer outro uso.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
384:
Logging em APIs.

385:
Filters e interceptors.

386:
Eventos internos Spring.

387:
Async no Spring.

388:
Cache com Spring Redis.

389:
Rate limiting.
```

A aula 387 respondeu:

```text
como executar uma reação fora do thread da request
com capacidade e falhas controladas?
```

A aula 388 responderá:

```text
como evitar leituras repetidas
sem substituir o PostgreSQL
e sem servir dados antigos indefinidamente?
```

Nesta aula:

```text
Spring Cache:
sim.

Redis:
sim.

cache-aside:
sim.

@EnableCaching:
sim.

@Cacheable:
sim.

@CacheEvict:
sim.

TTL:
sim.

prefixo:
sim.

serialização JSON:
sim.

invalidação após commit:
sim.

teste manual:
sim.

listagem em cache:
não.

rate limiting:
não.

mensageria:
não.

testes completos:
não.
```

A regra central será:

```text
cache é uma otimização de leitura;
não é a origem oficial do estado.
```

---

## Objetivo prático

Ao final da aula, o fluxo de leitura por ID deverá funcionar assim:

```text
primeira leitura:
cache miss;
consulta ao PostgreSQL;
valor gravado no Redis;
resposta retornada.

segunda leitura do mesmo ID:
cache hit;
PostgreSQL não é consultado;
valor retorna do Redis.
```

Depois de uma escrita confirmada:

```text
update ou delete;
commit no PostgreSQL;
evento interno;
invalidação da chave;
próxima leitura consulta o banco novamente.
```

Você irá:

1. iniciar Redis local;
2. adicionar as dependências do Spring Cache e Redis;
3. habilitar cache em uma configuração específica;
4. configurar `RedisCacheManager`;
5. criar um valor imutável para o cache;
6. aplicar `@Cacheable` na leitura por ID;
7. aplicar `@CacheEvict` após escrita confirmada;
8. testar hit, miss, TTL e invalidação;
9. revisar e commitar.

Estrutura esperada:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── managedmessage
│       └── cache
│           ├── ManagedRuntimeMessageCacheEntry.java
│           ├── ManagedRuntimeMessageCacheLoader.java
│           ├── ManagedRuntimeMessageCachedQueryService.java
│           ├── ManagedRuntimeMessageCacheInvalidator.java
│           └── ManagedRuntimeMessageCacheInvalidationListener.java
└── config
    └── cache
        ├── CacheNames.java
        ├── ManagedRuntimeMessageCacheProperties.java
        └── ManagedMessageRedisCacheConfiguration.java
```

Configuração:

```text
src/main/resources
├── application.yaml
├── application-local.yaml
└── application-cache-redis.yaml
```

O cache oficial desta aula será:

```text
managed-runtime-message-by-id
```

A chave lógica será:

```text
id do recurso.
```

O valor será um record com:

```text
id;
value;
description;
createdAt;
updatedAt;
version.
```

O TTL inicial será:

```text
5 minutos.
```

---

## Conceito essencial

### O que é cache

Cache é um armazenamento temporário usado para evitar trabalho repetido.

Nesta aula:

```text
fonte da verdade:
PostgreSQL.

cópia temporária:
Redis.
```

O Redis não substitui o banco. Ele apenas mantém uma cópia de uma leitura que pode ser reconstruída.

Se a chave desaparecer, a aplicação consulta novamente o PostgreSQL.

Se o recurso for alterado, a entrada antiga precisa ser removida.

Se a entrada permanecer tempo demais, ela pode ficar obsoleta.

Por isso, um cache precisa de três decisões básicas:

```text
qual dado será cacheado;
como ele será identificado;
quando deixará de ser válido.
```

---

### Cache-aside

A estratégia utilizada será cache-aside.

Fluxo:

```text
1. consultar o cache;

2. se encontrar:
   retornar o valor;

3. se não encontrar:
   consultar a fonte;

4. armazenar o resultado;

5. retornar.
```

Com Spring Cache, esse comportamento será aplicado pelo `@Cacheable`.

Você não escreverá manualmente:

```java
if (cache.containsKey(id)) {
    return cache.get(id);
}
```

A infraestrutura do Spring fará a interceptação.

---

### Cache hit

Cache hit ocorre quando a chave já existe.

Resultado:

```text
o método anotado não é executado;
o valor retorna diretamente do cache.
```

Isso é importante: o código interno do método não roda em hit.

Se você colocar um log dentro do método, ele aparecerá somente em miss.

---

### Cache miss

Cache miss ocorre quando a chave não existe.

Resultado:

```text
o método é executado;
o PostgreSQL é consultado;
o resultado entra no Redis;
o caller recebe o valor.
```

A primeira leitura normalmente é miss.

As próximas, enquanto a entrada existir, são hits.

---

### Spring Cache e Redis

Spring Cache é a abstração.

Redis é o armazenamento utilizado.

```text
Spring Cache:
define annotations e fluxo.

Redis:
armazena chaves e valores.
```

O Spring Cache trabalha por meio de:

```text
CacheManager;
Cache;
interceptor;
annotations.
```

Nesta aula, o `CacheManager` concreto será um `RedisCacheManager`.

---

### @EnableCaching

`@EnableCaching` habilita o processamento das annotations de cache.

Exemplo:

```java
@Configuration(
        proxyBeanMethods = false
)
@EnableCaching
public class ManagedMessageRedisCacheConfiguration {
}
```

A annotation ficará em uma configuração própria.

Não coloque `@EnableCaching` na classe principal da aplicação. Cache deve permanecer uma preocupação configurável, não uma regra invisível do bootstrap.

---

### Proxy e chamada externa

`@Cacheable` e `@CacheEvict` funcionam por proxy.

Fluxo:

```text
caller;
proxy Spring;
interceptor de cache;
método alvo.
```

A chamada precisa atravessar o proxy.

Exemplo problemático:

```java
public CacheEntry find(long id) {
    return this.findCached(id);
}

@Cacheable(...)
public CacheEntry findCached(long id) {
}
```

Como a chamada ocorre pelo próprio objeto, o proxy não participa.

A baseline separará os componentes:

```text
CachedQueryService;
CacheLoader.
```

---

### @Cacheable

A annotation será aplicada na leitura por ID:

```java
@Cacheable(
        cacheNames =
                CacheNames.MANAGED_RUNTIME_MESSAGE_BY_ID,
        key = "#id"
)
public ManagedRuntimeMessageCacheEntry
        findById(long id) {
    return loader.load(id);
}
```

Em hit, `loader.load(id)` não executa.

Em miss, o loader consulta o PostgreSQL.

---

### @CacheEvict

`@CacheEvict` remove uma entrada.

Exemplo:

```java
@CacheEvict(
        cacheNames =
                CacheNames.MANAGED_RUNTIME_MESSAGE_BY_ID,
        key = "#resourceId"
)
public void evictById(long resourceId) {
}
```

A remoção deve ocorrer depois que a escrita estiver confirmada.

Se o banco fizer rollback, o cache não deve ser invalidado.

Por isso, a aula reutilizará os eventos internos das aulas anteriores e executará a invalidação em um listener `AFTER_COMMIT`.

---

### TTL

TTL significa:

```text
time to live.
```

É o tempo máximo de vida da entrada.

Baseline:

```text
5 minutos.
```

Depois disso:

```text
a chave expira;
a próxima leitura vira miss;
o PostgreSQL é consultado novamente.
```

TTL não substitui invalidação.

A invalidação remove a entrada logo após uma escrita.

O TTL limita quanto tempo uma entrada pode sobreviver caso alguma invalidação não aconteça.

As duas estratégias se complementam.

---

### Chave, prefixo e namespace

A chave lógica será:

```text
42
```

Mas no Redis ela precisa estar dentro de um namespace.

Exemplo:

```text
formacao-java-backend-api:
local:
managed-runtime-message-by-id::
42
```

Em uma linha:

```text
formacao-java-backend-api:local:
managed-runtime-message-by-id::42
```

O prefixo evita colisão entre:

- aplicações;
- ambientes;
- caches diferentes.

Nunca use apenas o ID sem namespace em um Redis compartilhado.

---

### Serialização JSON tipada

Redis armazena bytes.

A aplicação precisa converter o record Java para bytes e depois reconstruí-lo.

A baseline usará:

```text
chave:
String.

valor:
JSON tipado.
```

O valor armazenado será:

```text
ManagedRuntimeMessageCacheEntry.
```

Não cacheie:

- entity JPA;
- DTO v1;
- DTO v2;
- request;
- response;
- `ProblemDetail`.

Um record imutável da camada de aplicação mantém o cache simples e estável.

---

### O que não será cacheado

Listagens não serão cacheadas nesta aula.

Motivo:

```text
page;
size;
sort;
filters;
combinações.
```

Uma única alteração poderia invalidar várias chaves.

A leitura por ID possui:

```text
uma chave;
um valor;
uma invalidação direta.
```

Essa é a escolha correta para aprender o mecanismo.

---

### Dado obsoleto

Um valor fica obsoleto quando o PostgreSQL mudou, mas o Redis ainda possui a versão anterior.

Isso pode acontecer se:

- update não invalidar;
- delete não invalidar;
- chave estiver errada;
- prefixo estiver errado;
- TTL estiver ausente;
- outro sistema alterar o banco diretamente.

A baseline reduz esse risco com:

```text
invalidação AFTER_COMMIT;
TTL;
chave simples;
prefixo por ambiente;
um único ponto de leitura.
```

### Quando cache faz sentido

Cache é útil quando existe um desequilíbrio claro entre leitura e escrita.

Exemplo:

```text
o recurso muda duas vezes por hora;
o mesmo recurso é lido centenas de vezes por minuto.
```

Nesse cenário, repetir a consulta completa ao PostgreSQL desperdiça capacidade.

Cache pode ajudar quando:

- a leitura é frequente;
- o valor é relativamente estável;
- o custo da consulta é relevante;
- um pequeno intervalo de desatualização é aceitável;
- a chave é previsível;
- a invalidação é compreensível.

Cache pode não ajudar quando:

- o dado muda a todo instante;
- cada consulta é diferente;
- o resultado precisa refletir o banco imediatamente;
- o volume é baixo;
- o custo da leitura é irrelevante;
- a invalidação é mais complexa que a própria consulta.

Uma decisão profissional não começa com:

```text
vamos colocar Redis.
```

Ela começa com:

```text
qual trabalho repetido queremos evitar;
qual dado pode ser temporariamente copiado;
quanto tempo de desatualização é aceitável;
como a cópia será descartada.
```

Nesta aula, a leitura por ID atende bem a esses critérios. A mesma chave pode ser consultada várias vezes, o valor é pequeno e uma escrita possui um caminho direto de invalidação.

---

### Momento correto da invalidação

A ordem dos acontecimentos importa.

Uma implementação incorreta poderia fazer:

```text
1. remover cache;
2. tentar atualizar PostgreSQL;
3. transação falhar;
4. cache já foi removido.
```

Esse caso não corrompe o banco, mas provoca trabalho desnecessário e pode criar comportamentos difíceis de interpretar.

Outro erro seria atualizar o banco e esquecer o cache:

```text
1. PostgreSQL recebe valor novo;
2. Redis continua com valor antigo;
3. próximas leituras servem dado obsoleto.
```

A baseline usa:

```text
1. executar a escrita;
2. publicar o evento;
3. concluir o commit;
4. receber o evento em AFTER_COMMIT;
5. remover a chave.
```

Assim, a invalidação representa uma mudança realmente confirmada.

A criação também pode acionar o mesmo listener. Nesse caso, remover uma chave que ainda não existe é uma operação inofensiva. A vantagem é manter um único fluxo de invalidação para todos os eventos de mudança.

O no-op permanece especial. Como não existe mudança real, não há novo evento e não existe motivo para remover uma entrada válida.

---

### Leitura do valor serializado

O JSON armazenado no Redis não é o contrato HTTP.

Exemplo conceitual:

```json
{
  "id": 42,
  "value": "Cache com Spring Redis",
  "description": "Entrada de laboratorio",
  "createdAt": "2026-07-11T15:00:00Z",
  "updatedAt": "2026-07-11T15:00:00Z",
  "version": 0
}
```

A v1 pode transformar `value` em `value`.

A v2 pode transformar `value` em `message`.

Essa separação permite alterar uma representação HTTP sem obrigar o cache a duplicar o mesmo recurso.

O JSON no Redis deve ser tratado como detalhe interno da aplicação. Consumidores externos não devem depender desse formato.

---

### Decisões da baseline

A configuração desta aula adota decisões simples:

```text
um cache;
uma chave por ID;
um valor imutável;
TTL de 5 minutos;
invalidação após commit;
sem cache de listagem;
sem null caching.
```

Essas decisões deixam o comportamento observável e fácil de diagnosticar.

A aula não tenta resolver todos os cenários possíveis. O objetivo é construir uma base correta, pequena e compreensível. Evoluções devem nascer de medição e necessidade real, não da quantidade de recursos oferecidos pelo Redis.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean compile
```

O objetivo é iniciar a aula com o projeto funcionando.

---

### 2. Iniciar Redis local

Remova um container antigo, se existir:

```powershell
docker rm -f formacao-java-redis `
  2>$null
```

Inicie Redis:

```powershell
docker run `
  --name formacao-java-redis `
  --detach `
  --publish 6379:6379 `
  redis:8-alpine
```

Valide:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli PING
```

Resultado esperado:

```text
PONG
```

Este Redis é local.

Não exponha a porta publicamente.

---

### 3. Adicionar dependências

No `pom.xml`, adicione:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

Não fixe versões.

O Spring Boot gerencia as versões compatíveis.

---

### 4. Criar CacheNames

Arquivo:

```text
config/cache/CacheNames.java
```

Conteúdo:

```java
package br.com.formacao.backend.config.cache;

public final class CacheNames {

    public static final String
            MANAGED_RUNTIME_MESSAGE_BY_ID =
                    "managed-runtime-message-by-id";

    private CacheNames() {
    }
}
```

O nome do cache deve ficar centralizado.

Evite strings repetidas em annotations diferentes.

---

### 5. Criar properties do cache

Arquivo:

```text
ManagedRuntimeMessageCacheProperties.java
```

Conteúdo:

```java
package br.com.formacao.backend.config.cache;

import java.time.Duration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.boot.context.properties
        .ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(
        "app.cache.managed-message"
)
@Validated
public record ManagedRuntimeMessageCacheProperties(
        @NotBlank
        String keyPrefix,

        @NotNull
        Duration ttl
) {
}
```

O projeto já utiliza `@ConfigurationPropertiesScan`.

Não registre o mesmo tipo novamente.

---

### 6. Criar application-cache-redis.yaml

Arquivo:

```text
src/main/resources/application-cache-redis.yaml
```

Conteúdo:

```yaml
spring:
  cache:
    type: redis

  data:
    redis:
      host: "${REDIS_HOST:localhost}"
      port: "${REDIS_PORT:6379}"
      connect-timeout: "${REDIS_CONNECT_TIMEOUT:2s}"
      timeout: "${REDIS_OPERATION_TIMEOUT:1s}"

app:
  cache:
    managed-message:
      key-prefix: "formacao-java-backend-api:${app.environment.name}:"
      ttl: "${MANAGED_MESSAGE_CACHE_TTL:5m}"
```

O profile `local` deve incluir:

```text
cache-redis.
```

Se o projeto usa profile groups, adicione:

```yaml
spring:
  profiles:
    group:
      local:
        - persistence-lab
        - openapi-lab
        - lifecycle-local
        - cache-redis
```

Preserve os fragments já existentes.

---

### 7. Criar o valor cacheável

Arquivo:

```text
ManagedRuntimeMessageCacheEntry.java
```

Conteúdo:

```java
package br.com.formacao.backend.application
        .managedmessage.cache;

import java.time.Instant;

import br.com.formacao.backend.domain.managedmessage
        .ManagedRuntimeMessage;

public record ManagedRuntimeMessageCacheEntry(
        long id,
        String value,
        String description,
        Instant createdAt,
        Instant updatedAt,
        long version
) {

    public static ManagedRuntimeMessageCacheEntry
            from(
                    ManagedRuntimeMessage message
            ) {

        return new ManagedRuntimeMessageCacheEntry(
                message.id(),
                message.value(),
                message.description(),
                message.createdAt(),
                message.updatedAt(),
                message.version()
        );
    }
}
```

Ajuste os accessors aos nomes reais do projeto.

O record não pertence à web.

Ele será reutilizado por v1 e v2.

---

### 8. Criar o loader

Arquivo:

```text
ManagedRuntimeMessageCacheLoader.java
```

Conteúdo:

```java
package br.com.formacao.backend.application
        .managedmessage.cache;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation
        .Transactional;

@Service
public class ManagedRuntimeMessageCacheLoader {

    private static final Logger log =
            LoggerFactory.getLogger(
                    ManagedRuntimeMessageCacheLoader.class
            );

    private final ManagedRuntimeMessageRepositoryPort
            repository;

    public ManagedRuntimeMessageCacheLoader(
            ManagedRuntimeMessageRepositoryPort
                    repository
    ) {
        this.repository = repository;
    }

    @Transactional(
            readOnly = true
    )
    public ManagedRuntimeMessageCacheEntry load(
            long id
    ) {

        log.atDebug()
                .addKeyValue(
                        "event",
                        "managed_message.cache.source_load"
                )
                .addKeyValue(
                        "managedMessageId",
                        id
                )
                .log(
                        "Loading managed runtime "
                        + "message from PostgreSQL"
                );

        return repository
                .findById(id)
                .map(
                        ManagedRuntimeMessageCacheEntry::from
                )
                .orElseThrow(
                        () ->
                                new ManagedRuntimeMessageNotFoundException(
                                        id
                                )
                );
    }
}
```

Use o nome real do repository port e da exception já existentes.

O log será útil para diferenciar hit e miss.

Em hit, esse log não aparece.

---

### 9. Criar o serviço cacheado

Arquivo:

```text
ManagedRuntimeMessageCachedQueryService.java
```

Conteúdo:

```java
package br.com.formacao.backend.application
        .managedmessage.cache;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import br.com.formacao.backend.config.cache.CacheNames;

@Service
public class ManagedRuntimeMessageCachedQueryService {

    private final ManagedRuntimeMessageCacheLoader
            loader;

    public ManagedRuntimeMessageCachedQueryService(
            ManagedRuntimeMessageCacheLoader
                    loader
    ) {
        this.loader = loader;
    }

    @Cacheable(
            cacheNames =
                    CacheNames
                            .MANAGED_RUNTIME_MESSAGE_BY_ID,
            key = "#id"
    )
    public ManagedRuntimeMessageCacheEntry findById(
            long id
    ) {
        return loader.load(id);
    }
}
```

A chamada precisa vir de outro bean.

Não chame `findById` por `this`.

---

### 10. Configurar RedisCacheManager

Arquivo:

```text
ManagedMessageRedisCacheConfiguration.java
```

Conteúdo:

```java
package br.com.formacao.backend.config.cache;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation
        .Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.cache
        .RedisCacheManager;
import org.springframework.data.redis.connection
        .RedisConnectionFactory;
import org.springframework.data.redis.serializer
        .JacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer
        .RedisSerializationContext
        .SerializationPair;
import org.springframework.data.redis.serializer
        .RedisSerializer;

import tools.jackson.databind.ObjectMapper;

import br.com.formacao.backend.application
        .managedmessage.cache
        .ManagedRuntimeMessageCacheEntry;

@Configuration(
        proxyBeanMethods = false
)
@Profile(
        "cache-redis"
)
@EnableCaching
public class ManagedMessageRedisCacheConfiguration {

    @Bean
    CacheManager cacheManager(
            RedisConnectionFactory
                    connectionFactory,
            ObjectMapper objectMapper,
            ManagedRuntimeMessageCacheProperties
                    properties
    ) {

        RedisSerializer<
                ManagedRuntimeMessageCacheEntry
        > valueSerializer =
                new JacksonJsonRedisSerializer<>(
                        objectMapper,
                        ManagedRuntimeMessageCacheEntry.class
                );

        org.springframework.data.redis.cache
                .RedisCacheConfiguration
                cacheConfiguration =
                    org.springframework.data.redis.cache
                            .RedisCacheConfiguration
                            .defaultCacheConfig()
                            .disableCachingNullValues()
                            .entryTtl(
                                    properties.ttl()
                            )
                            .computePrefixWith(
                                    cacheName ->
                                            properties
                                                    .keyPrefix()
                                            + cacheName
                                            + "::"
                            )
                            .serializeKeysWith(
                                    SerializationPair
                                            .fromSerializer(
                                                RedisSerializer
                                                    .string()
                                            )
                            )
                            .serializeValuesWith(
                                    SerializationPair
                                            .fromSerializer(
                                                valueSerializer
                                            )
                            );

        return RedisCacheManager
                .builder(
                        connectionFactory
                )
                .withCacheConfiguration(
                        CacheNames
                                .MANAGED_RUNTIME_MESSAGE_BY_ID,
                        cacheConfiguration
                )
                .build();
    }
}
```

A configuração define:

- cache conhecido;
- TTL;
- prefixo;
- chave String;
- valor JSON tipado;
- null não cacheado.

---

### 11. Usar o serviço cacheado no GET por ID

Nos controllers v1 e v2, substitua a leitura direta pelo:

```text
ManagedRuntimeMessageCachedQueryService.
```

Fluxo:

```java
ManagedRuntimeMessageCacheEntry
        cached =
                cachedQueryService
                        .findById(id);
```

Depois, cada versão mantém seu mapper.

V1:

```text
cached.value -> response.value.
```

V2:

```text
cached.value -> response.message.
```

A entrada interna é única.

Os contratos públicos continuam separados.

---

### 12. Criar o invalidator

Arquivo:

```text
ManagedRuntimeMessageCacheInvalidator.java
```

Conteúdo:

```java
package br.com.formacao.backend.application
        .managedmessage.cache;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Component;

import br.com.formacao.backend.config.cache.CacheNames;

@Component
public class ManagedRuntimeMessageCacheInvalidator {

    @CacheEvict(
            cacheNames =
                    CacheNames
                            .MANAGED_RUNTIME_MESSAGE_BY_ID,
            key = "#resourceId"
    )
    public void evictById(
            long resourceId
    ) {
        // O efeito é aplicado pelo interceptor de cache.
    }
}
```

O método permanece vazio porque a annotation representa a operação.

---

### 13. Invalidar depois do commit

Arquivo:

```text
ManagedRuntimeMessageCacheInvalidationListener.java
```

Conteúdo:

```java
package br.com.formacao.backend.application
        .managedmessage.cache;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event
        .TransactionPhase;
import org.springframework.transaction.event
        .TransactionalEventListener;

import br.com.formacao.backend.application
        .managedmessage.event
        .ManagedRuntimeMessageChangedEvent;

@Component
public class ManagedRuntimeMessageCacheInvalidationListener {

    private final ManagedRuntimeMessageCacheInvalidator
            invalidator;

    public ManagedRuntimeMessageCacheInvalidationListener(
            ManagedRuntimeMessageCacheInvalidator
                    invalidator
    ) {
        this.invalidator = invalidator;
    }

    @TransactionalEventListener(
            phase =
                    TransactionPhase.AFTER_COMMIT
    )
    public void invalidate(
            ManagedRuntimeMessageChangedEvent event
    ) {
        invalidator.evictById(
                event.resourceId()
        );
    }
}
```

O listener não usa `@Async`.

A invalidação é curta e precisa acontecer logo após o commit.

Rollback:

```text
não executa AFTER_COMMIT;
cache permanece.
```

No-op:

```text
não publica novo evento;
cache permanece.
```

Update real ou delete:

```text
evento;
commit;
eviction.
```

---

### 14. Iniciar a aplicação

Com PostgreSQL e Redis ativos:

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

Confirme nos logs que a aplicação iniciou sem erro de conexão com Redis.

---

### 15. Criar um recurso

Exemplo v2:

```powershell
$body = @{
  message = "Cache com Spring Redis"
  description = "Entrada de laboratorio"
} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Method Post `
  -Uri "http://localhost:8081/api/v2/runtime/managed-messages" `
  -ContentType "application/json" `
  -Body $body
```

Capture o ID da `Location`.

Exemplo:

```powershell
$location = $response.Headers.Location
$id = ($location -split "/")[-1]
```

---

### 16. Testar cache miss

Faça o primeiro GET:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:8081/api/v2/runtime/managed-messages/$id"
```

Procure no log:

```text
managed_message.cache.source_load
```

Esse é o miss.

A fonte foi consultada.

---

### 17. Testar cache hit

Repita:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:8081/api/v2/runtime/managed-messages/$id"
```

Resultado esperado:

```text
mesma resposta;
sem novo source_load.
```

Não use apenas a diferença de tempo como prova.

O log do loader é mais confiável.

---

### 18. Inspecionar a chave no Redis

Liste as chaves:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli `
  --scan `
  --pattern "formacao-java-backend-api:local:*"
```

Capture a chave:

```powershell
$cacheKey = docker exec `
  formacao-java-redis `
  redis-cli `
  --scan `
  --pattern "formacao-java-backend-api:local:*"
```

Verifique o tipo:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli TYPE $cacheKey
```

Resultado:

```text
string
```

Leia o JSON:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli GET $cacheKey
```

Você deve ver os campos do record.

---

### 19. Verificar TTL

Execute:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli TTL $cacheKey
```

Resultado esperado:

```text
valor positivo;
menor ou igual a 300.
```

Significados:

```text
-2:
a chave não existe.

-1:
a chave existe sem expiração.
```

A baseline espera TTL positivo.

---

### 20. Testar invalidação em update

Faça um PUT real usando o contrato atual da API e o header de precondition já existente no projeto.

Depois do sucesso, procure a chave novamente:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli EXISTS $cacheKey
```

Resultado esperado:

```text
0
```

Faça novo GET.

Resultado:

```text
cache miss;
source_load;
valor atualizado;
nova entrada no Redis.
```

---

### 21. Testar invalidação em delete

Carregue novamente o recurso para garantir uma entrada.

Execute DELETE seguindo o contrato atual.

Depois:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli EXISTS $cacheKey
```

Resultado:

```text
0
```

O próximo GET deve retornar 404.

O 404 não é cacheado.

---

### 22. Testar TTL curto

Pare a aplicação.

Defina:

```powershell
$env:MANAGED_MESSAGE_CACHE_TTL = "10s"
```

Inicie novamente.

Faça um GET e consulte o TTL.

Espere mais de 10 segundos.

Consulte:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli EXISTS $cacheKey
```

Resultado esperado:

```text
0
```

O próximo GET deve executar o loader novamente.

Restaure:

```powershell
Remove-Item Env:MANAGED_MESSAGE_CACHE_TTL
```

---

### 23. Revisar o comportamento

Confirme manualmente:

```text
primeiro GET:
miss.

segundo GET:
hit.

TTL:
positivo.

update:
evict.

delete:
evict.

rollback:
não evict.

no-op:
não evict.
```

Não é necessário criar testes automatizados completos nesta aula.

Esse aprofundamento será feito nas aulas específicas do cronograma.

---

## Entendendo o que foi feito

### A fonte da verdade não mudou

O PostgreSQL continua oficial.

Redis apenas reduz leituras repetidas.

### A leitura ficou protegida por proxy

`@Cacheable` decide se o loader deve executar.

### O valor cacheado é simples

Um record imutável evita entity, proxy e DTO web no Redis.

### O namespace ficou explícito

Aplicação, ambiente e cache name compõem a chave real.

### A validade ficou controlada

TTL limita a vida da entrada.

### A escrita invalida depois do commit

Rollback não remove uma entrada ainda válida.

### V1 e v2 permanecem separadas na web

As duas versões compartilham o valor interno, mas preservam seus contratos.

---

## Erros comuns importantes

### Cachear entity JPA

Entity pode carregar proxy, relações e comportamento ligado ao persistence context.

Use um record imutável.

### Cachear listagens cedo demais

Filtros, paginação e ordenação criam muitas chaves e invalidações.

Comece pela leitura por ID.

### Não configurar TTL

Uma entrada antiga pode permanecer indefinidamente.

### Usar somente TTL

A atualização pode ficar invisível até a expiração.

Use invalidação também.

### Invalidar antes do commit

Rollback deixaria o banco antigo e o cache vazio sem necessidade.

### Chamar método cacheado por this

A chamada não atravessa o proxy.

### Usar o mesmo prefixo em todos os ambientes

Local, HML e production podem colidir.

### Cachear null

O recurso pode ser criado depois, mas a ausência antiga continuaria sendo servida.

A baseline não cacheia null.

---

## Comandos úteis

### Iniciar Redis

```powershell
docker run `
  --name formacao-java-redis `
  --detach `
  --publish 6379:6379 `
  redis:8-alpine
```

### Testar conexão

```powershell
docker exec `
  formacao-java-redis `
  redis-cli PING
```

### Listar chaves

```powershell
docker exec `
  formacao-java-redis `
  redis-cli `
  --scan `
  --pattern "formacao-java-backend-api:local:*"
```

### Ler valor

```powershell
docker exec `
  formacao-java-redis `
  redis-cli GET <chave>
```

### Ver TTL

```powershell
docker exec `
  formacao-java-redis `
  redis-cli TTL <chave>
```

### Remover uma chave

```powershell
docker exec `
  formacao-java-redis `
  redis-cli DEL <chave>
```

Não use `FLUSHALL` em ambiente compartilhado.

---

## Exercício guiado

### Parte 1 — Provar o hit

Faça três GETs do mesmo ID.

Confirme que o log `source_load` aparece uma vez.

### Parte 2 — Provar o TTL

Configure TTL de 10 segundos.

Confirme a expiração e o novo load.

### Parte 3 — Provar a invalidação

Carregue um recurso, atualize e confirme que a chave desapareceu.

### Parte 4 — Provar a separação de versão

Leia o mesmo ID pela v1 e pela v2.

Confirme:

```text
v1:
value.

v2:
message.

Redis:
uma única entrada interna.
```

### Parte 5 — Registrar a decisão

Anote:

```text
PostgreSQL é fonte da verdade;

Redis é cache externo;

cache somente por ID;

TTL de 5 minutos;

prefixo por aplicação e ambiente;

JSON tipado;

invalidação AFTER_COMMIT;

sem cache de listagem;

sem rate limiting nesta aula.
```

---

## Critérios de aceite

- arquivo e H1 permanecem corretos;
- a aula continua sendo a 388 do M14;
- o projeto contínuo foi preservado;
- Redis foi usado somente como cache;
- PostgreSQL permaneceu fonte da verdade;
- Spring Cache foi configurado;
- `@EnableCaching` foi usado;
- `RedisCacheManager` foi criado;
- cache name foi centralizado;
- TTL foi configurado;
- prefixo por aplicação e ambiente foi configurado;
- chave por ID foi usada;
- valor JSON tipado foi usado;
- entity JPA não foi cacheada;
- DTO v1 e v2 não foram cacheados;
- null caching foi desabilitado;
- `@Cacheable` foi aplicado na leitura por ID;
- loader ficou em outro bean;
- self-invocation foi evitada;
- cache hit foi testado manualmente;
- cache miss foi testado manualmente;
- TTL foi testado manualmente;
- `@CacheEvict` foi aplicado;
- invalidação ocorreu depois do commit;
- rollback não invalidou;
- no-op não invalidou;
- update invalidou;
- delete invalidou;
- listagens não foram cacheadas;
- rate limiting não foi antecipado;
- testes completos não foram antecipados;
- ponte para a aula 389 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m14): adicionar cache com Spring Redis"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `target`;
- dados do Redis;
- logs;
- dumps;
- credentials;
- `.env`;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a leitura individual passou a utilizar cache externo.

O fluxo ficou:

```text
controller v1 ou v2;

cached query service;

Spring Cache;

Redis.

hit:
retorno do cache.

miss:
loader;
PostgreSQL;
gravação no Redis.
```

A escrita ficou:

```text
update ou delete;

commit;

evento interno;

listener AFTER_COMMIT;

@CacheEvict.
```

Você comprovou:

```text
cache hit;

cache miss;

TTL;

serialização JSON;

prefixo;

invalidação;

rollback sem eviction;

no-op sem eviction.
```

A decisão central foi:

```text
cache melhora performance,
mas não define o estado oficial;

a fonte continua sendo o PostgreSQL;

TTL e invalidação controlam
a validade da cópia temporária.
```

A próxima aula será:

```text
389 - M14.34 - Rate limiting
```

Nela, Redis será usado para um problema diferente:

```text
controlar quantas requests
um consumidor pode executar
em uma janela de tempo.
```

Cache responde:

```text
já possuo o resultado desta leitura?
```

Rate limiting responde:

```text
este consumidor ainda pode fazer outra request?
```

As duas responsabilidades não devem ser misturadas.

---

# Material complementar

## Checkpoint final

- [ ] Iniciei Redis local.
- [ ] Configurei Spring Cache com Redis.
- [ ] Implementei `@Cacheable` por ID.
- [ ] Implementei `@CacheEvict` após commit.
- [ ] Testei hit, miss, TTL e invalidação.

---

## Troubleshooting adicional

### A segunda chamada continua consultando o banco

Confirme:

- profile `cache-redis` ativo;
- `@EnableCaching` carregado;
- chamada atravessa o proxy;
- Redis disponível;
- cache name correto;
- chave correta.

### TTL retorna -1

A configuração de `entryTtl` não foi aplicada.

### TTL retorna -2

A chave não existe, expirou ou foi invalidada.

### Update não remove a chave

Confirme:

- evento publicado;
- commit concluído;
- listener `AFTER_COMMIT`;
- mesmo cache name;
- mesma chave;
- invalidator em outro bean.

### V1 e v2 criam chaves diferentes

O cache foi aplicado na camada web.

Mova a leitura cacheada para a camada de aplicação.

### O JSON não pode ser lido

Pode existir uma entrada antiga com outro formato.

Remova somente a chave do laboratório e faça novo GET.

---

## Observações para aulas futuras

Testes automatizados completos de controller, service e integração serão aprofundados nas aulas próprias do cronograma.

Também existem assuntos mais avançados, como:

- cache stampede;
- relação entre cache e ETag;
- políticas de falha;
- estratégias de aquecimento;
- versionamento avançado do schema de cache.

Eles são importantes, mas não serão implementados agora.

A prioridade desta aula é dominar o fluxo básico e correto.

---

## Perguntas de revisão

1. Qual é a fonte da verdade?
2. Qual é o papel do Redis?
3. O que é cache-aside?
4. O que é cache hit?
5. O que é cache miss?
6. O que `@Cacheable` faz em hit?
7. Por que self-invocation é um problema?
8. Qual é a chave?
9. Por que usar prefixo?
10. Qual é o TTL?
11. TTL substitui invalidação?
12. Por que entity JPA não foi cacheada?
13. Quando ocorre `@CacheEvict`?
14. Rollback invalida?
15. No-op invalida?
16. Listagens foram cacheadas?
17. Redis virou fonte da verdade?
18. Qual é a próxima aula?

---

## Roteiro de resposta

1. PostgreSQL.
2. Cache externo e descartável.
3. Consultar cache, carregar a fonte em miss e armazenar.
4. Chave encontrada.
5. Chave ausente.
6. Retorna o valor sem executar o método.
7. A chamada não atravessa o proxy.
8. O ID.
9. Para evitar colisões.
10. Cinco minutos.
11. Não.
12. Para evitar proxy, sessão e acoplamento.
13. Depois do commit.
14. Não.
15. Não.
16. Não.
17. Não.
18. Rate limiting.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 388 - M14.33 - Cache com Spring Redis

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei execução assíncrona de cache.
- Mantive o PostgreSQL como fonte da verdade.
- Adicionei Spring Cache e Spring Data Redis.
- Iniciei Redis local em container.
- Criei o cache `managed-runtime-message-by-id`.
- Cacheei somente a consulta individual por ID.
- Não cacheei listagens, filtros ou paginação.
- Criei um record imutável para o valor.
- Não cacheei entity JPA nem DTO web.
- Configurei chave por ID.
- Configurei prefixo por aplicação e ambiente.
- Usei JSON tipado para o valor.
- Desabilitei null caching.
- Configurei TTL de 5 minutos.
- Implementei cache-aside com `@Cacheable`.
- Separei o loader em outro bean.
- Evitei self-invocation.
- Testei cache hit e cache miss.
- Implementei invalidação com `@CacheEvict`.
- Invalidei somente em `AFTER_COMMIT`.
- Mantive rollback e no-op sem invalidação.
- Testei TTL e invalidação manualmente.
- Não usei Redis como banco principal.
- Não antecipei rate limiting ou mensageria.
- Próxima aula: Rate limiting.
```

---

## Referência técnica curta

```text
Cache:
cópia temporária.

Fonte:
PostgreSQL.

Provider:
Redis.

Abstração:
Spring Cache.

Leitura:
@Cacheable.

Invalidação:
@CacheEvict.

Validade:
TTL.

Chave:
ID.

Namespace:
aplicação + ambiente + cache name.
```

Regra final:

```text
um cache correto precisa declarar a fonte da verdade, o dado copiado, a chave, o namespace, o formato serializado, o TTL e o momento da invalidação; nesta aula, a leitura individual atravessa um proxy @Cacheable, Redis armazena um record JSON temporário, PostgreSQL permanece oficial e alterações confirmadas removem a entrada por @CacheEvict depois do commit.
```
