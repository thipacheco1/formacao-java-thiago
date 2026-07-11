# 389 - M14.34 - Rate limiting

## Apresentação da aula

Na aula 388, você adicionou cache com Spring e Redis.

O fluxo de leitura por ID passou a funcionar assim:

```text
primeira leitura:
cache miss;
PostgreSQL;
valor gravado no Redis.

leituras seguintes:
cache hit;
retorno sem nova consulta ao banco.
```

A escrita também ganhou invalidação depois do commit:

```text
update ou delete;
commit;
evento interno;
@CacheEvict;
próxima leitura recarrega a fonte.
```

A decisão central foi:

```text
Redis mantém uma cópia temporária;
PostgreSQL continua sendo a fonte da verdade.
```

Nesta aula, o Redis será utilizado para outro problema.

Considere um consumidor chamando a API continuamente:

```text
100 requests em poucos segundos;
1.000 requests em um minuto;
várias chamadas concorrentes;
repetição mesmo depois de erros.
```

Mesmo que cada request seja válida, o volume pode consumir:

- threads HTTP;
- conexões do banco;
- CPU;
- memória;
- largura de banda;
- capacidade de integrações futuras.

Cache reduz trabalho repetido, mas não controla quantas requests um cliente pode enviar.

A pergunta central desta aula será:

```text
como limitar a frequência de requests
por consumidor
sem depender da memória de uma única instância
e sem permitir condições de corrida?
```

A solução utilizará:

```text
rate limiting;

Redis compartilhado;

contador com expiração;

janela fixa;

operação atômica com Lua;

StringRedisTemplate;

OncePerRequestFilter;

429 Too Many Requests;

Retry-After;

Problem Details.
```

A baseline permitirá:

```text
5 requests;
por consumidor;
em uma janela de 60 segundos;
na API de managed runtime messages.
```

A sexta request dentro da mesma janela receberá:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: <segundos restantes>
Content-Type: application/problem+json
```

O contador ficará no Redis.

Isso permite que duas instâncias da API compartilhem o mesmo limite.

Exemplo:

```text
instância A recebe 3 requests;
instância B recebe 3 requests;
Redis contabiliza 6;
a sexta é bloqueada.
```

Um `ConcurrentHashMap` dentro da aplicação não ofereceria esse comportamento.

Cada instância teria seu próprio contador.

O algoritmo utilizado será uma janela fixa iniciada na primeira request da chave.

Fluxo:

```text
primeira request:
contador = 1;
TTL = 60 segundos.

requests seguintes:
contador incrementado;
TTL original preservado.

contador até 5:
permitir.

contador acima de 5:
bloquear com 429.

TTL termina:
chave desaparece;
nova janela começa.
```

O incremento e a criação do TTL precisam ocorrer de forma atômica.

Não será usado este fluxo ingênuo:

```text
INCR;
depois EXPIRE.
```

Se a aplicação falhar entre os dois comandos, a chave pode ficar sem expiração.

Para evitar isso, os comandos serão executados em um script Lua único.

O Redis executa o script como uma operação atômica.

A aula reutilizará a estrutura de filters criada na aula 385.

O novo componente será:

```text
ManagedMessageRateLimitFilter.
```

Ele será executado:

```text
depois do correlation filter;
depois do lifecycle filter;
depois do write traffic gate;
antes do DispatcherServlet.
```

Se o write traffic gate já bloqueou a request com 503, a request não deve consumir cota.

Se o rate limit for excedido:

```text
o controller não executa;
o banco não é consultado;
o cache não é acessado;
o filter escreve a resposta 429.
```

A identidade utilizada no laboratório será:

```http
X-Client-Id: cliente-aula-389
```

Esse header serve somente para tornar o teste manual determinístico.

Ele não é autenticação.

Um cliente pode alterar o valor.

Quando Spring Security for estudado, a identidade deverá vir de uma credencial ou principal autenticado.

Sem o header, a baseline poderá usar o endereço remoto como fallback.

O identificador será transformado em hash antes de compor a chave do Redis.

Assim, a chave não precisa expor diretamente o valor recebido.

O projeto permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
390 - M14.35 - Upload download
```

Por isso, esta aula não adicionará:

- upload de arquivos;
- download;
- armazenamento de documentos;
- scheduler;
- e-mail;
- mensageria;
- broker;
- outbox;
- autenticação;
- autorização;
- testes completos;
- observabilidade avançada.

Redis será usado somente como contador temporário de rate limiting.

---

## Onde estamos na formação

A sequência atual é:

```text
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

390:
Upload download.

391:
Scheduler.
```

A aula 388 respondeu:

```text
como evitar leituras repetidas
sem substituir o PostgreSQL?
```

A aula 389 responderá:

```text
como limitar a frequência
de requests por consumidor
com estado compartilhado entre instâncias?
```

Nesta aula:

```text
rate limiting:
sim.

Redis:
sim.

janela fixa:
sim.

contador:
sim.

expiração:
sim.

Lua:
sim.

operação atômica:
sim.

StringRedisTemplate:
sim.

filter HTTP:
sim.

429:
sim.

Retry-After:
sim.

Problem Details:
sim.

identidade autenticada:
não.

token bucket:
não.

sliding window:
não.

upload:
não.

testes completos:
não.
```

A regra central será:

```text
rate limiting protege capacidade;

não autentica o cliente;
não substitui autorização;
não corrige uma API lenta.
```

---

## Objetivo prático

Ao final da aula, o comportamento deverá ser:

```text
cliente A:
requests 1 a 5:
permitidas.

request 6:
429.

cliente B:
possui contador independente.

depois do TTL:
cliente A recebe nova janela.
```

Você irá:

1. configurar a política de rate limiting;
2. criar um script Lua atômico;
3. executar o script com `StringRedisTemplate`;
4. resolver uma chave por consumidor;
5. criar um filtro HTTP;
6. devolver 429 com `Retry-After`;
7. registrar o filtro na ordem correta;
8. testar manualmente o limite;
9. inspecionar contador e TTL no Redis;
10. commitar.

Estrutura esperada:

```text
src/main/java/br/com/formacao/backend
├── config
│   └── ratelimit
│       ├── ManagedMessageRateLimitProperties.java
│       └── ManagedMessageRateLimitConfiguration.java
└── web
    └── ratelimit
        ├── RateLimitDecision.java
        ├── RateLimitClientKeyResolver.java
        ├── RedisFixedWindowRateLimiter.java
        └── ManagedMessageRateLimitFilter.java
```

Script:

```text
src/main/resources/redis
└── fixed-window-rate-limit.lua
```

A baseline utilizará:

```text
limite:
5 requests.

janela:
60 segundos.

escopo:
managed runtime messages.

identificador:
X-Client-Id ou endereço remoto.

armazenamento:
Redis.

algoritmo:
contador de janela fixa.
```

---

## Conceito essencial

### O que é rate limiting

Rate limiting é uma política que controla quantas operações um consumidor pode executar em determinado período.

Exemplo:

```text
5 requests por minuto.
```

Quando o consumidor ultrapassa o limite:

```text
a operação é recusada temporariamente.
```

O objetivo pode ser:

- proteger recursos;
- reduzir abuso;
- impedir loops agressivos;
- distribuir capacidade;
- aplicar cotas;
- evitar que um cliente prejudique os demais.

Rate limiting não é apenas uma resposta de erro.

Ele precisa definir:

```text
quem é o consumidor;
qual operação é contada;
qual é o limite;
qual é a janela;
onde o estado fica;
o que acontece quando o limite é excedido;
o que acontece quando o armazenamento falha.
```

---

### Rate limiting não é cache

Na aula 388, a chave respondia:

```text
já possuo o resultado desta leitura?
```

Nesta aula, a chave responde:

```text
quantas requests este consumidor
já executou nesta janela?
```

No cache:

```text
o valor é um snapshot do recurso.
```

No rate limiting:

```text
o valor é um contador temporário.
```

As duas features podem usar o mesmo servidor Redis local, mas precisam de namespaces e responsabilidades separados.

Não use `@Cacheable` para contar requests.

---

### Por que Redis

Um contador em memória funciona somente em uma instância.

Considere duas instâncias:

```text
API A;
API B.
```

Com memória local:

```text
A conta 5;
B conta 5;
o consumidor executa 10.
```

Com Redis compartilhado:

```text
A e B incrementam a mesma chave;
o limite total continua 5.
```

Redis também oferece:

- incremento atômico;
- expiração;
- baixa latência;
- chaves temporárias;
- scripts atômicos.

Isso o torna adequado para a baseline.

---

### Identidade do consumidor

O limite precisa de uma chave de consumidor.

Possibilidades reais:

- usuário autenticado;
- client ID;
- API key;
- tenant;
- endereço IP;
- combinação de identidade e rota.

A aplicação ainda não possui Spring Security.

Por isso, o laboratório utiliza:

```http
X-Client-Id
```

Esse valor não é confiável como identidade de segurança.

Ele apenas permite repetir o teste com consumidores diferentes.

Fallback:

```text
request.getRemoteAddr().
```

Endereço IP também possui limitações:

- NAT compartilha IP;
- proxies alteram a origem;
- IPv6 pode variar;
- cabeçalhos encaminhados exigem proxy confiável.

A baseline documentará essas limitações sem tentar resolver autenticação antes do módulo correto.

---

### Escopo do limite

Um limite pode ser global:

```text
toda a API.
```

Pode ser por operação:

```text
POST mais restrito;
GET mais permissivo.
```

Pode ser por feature:

```text
managed runtime messages.
```

A baseline usa um escopo único:

```text
managed-messages.
```

Isso significa que GET, POST, PUT, PATCH e DELETE da feature compartilham a mesma cota do consumidor.

`HEAD` e `OPTIONS` não serão contados.

Essa escolha simplifica o laboratório.

---

### Janela fixa

A baseline utilizará uma janela fixa iniciada na primeira request da chave.

Exemplo:

```text
10:00:05:
primeira request;
janela termina aproximadamente 10:01:05.
```

Durante essa janela:

```text
contador 1 a 5:
permitir.

contador 6 ou maior:
bloquear.
```

Quando a chave expira, a próxima request inicia outra janela.

Vantagens:

- simples;
- poucas operações;
- fácil diagnóstico;
- baixo consumo de memória.

Limite:

```text
requests podem se concentrar
perto da troca de janela.
```

Algoritmos como sliding window e token bucket suavizam esse efeito, mas não serão implementados agora.

---

### INCR e EXPIRE

Redis possui:

```text
INCR:
incrementa um contador.

EXPIRE:
define o tempo de vida.
```

Uma implementação ingênua seria:

```text
1. INCR chave;
2. se resultado for 1:
   EXPIRE chave 60.
```

Existe uma janela de falha entre os comandos.

Se o processo cair depois do `INCR` e antes do `EXPIRE`:

```text
a chave permanece sem TTL;
o consumidor pode ficar bloqueado indefinidamente.
```

A solução é executar a decisão em um script atômico.

---

### Lua no Redis

O script será:

```lua
local current =
    redis.call(
        'INCR',
        KEYS[1]
    )

if current == 1 then
    redis.call(
        'EXPIRE',
        KEYS[1],
        ARGV[1]
    )
end

local ttl =
    redis.call(
        'TTL',
        KEYS[1]
    )

return {
    current,
    ttl
}
```

O resultado contém:

```text
contador atual;
TTL restante.
```

A aplicação usa o contador para permitir ou bloquear.

Usa o TTL para preencher `Retry-After`.

O script não contém o limite.

O limite permanece na configuração Java.

Isso permite alterar a política sem alterar a operação atômica do Redis.

---

### RedisScript

Spring Data Redis permite executar scripts por meio de `RedisTemplate` e `StringRedisTemplate`.

A baseline registrará um único `RedisScript<List>` como bean.

Isso evita recriar a representação do script em toda request.

O executor tenta usar o SHA do script e recorre à execução completa quando necessário.

O código da aplicação não chamará `EVAL` manualmente.

---

### StringRedisTemplate

Nesta feature, chaves e argumentos são strings.

Por isso:

```text
StringRedisTemplate
```

é suficiente.

Ele será usado para:

```text
executar o script;
enviar a chave;
enviar a duração da janela;
receber contador e TTL.
```

Não use o `CacheManager` da aula anterior.

Rate limiting não é uma operação de cache da aplicação.

---

### RateLimitDecision

O resultado interno será:

```java
public record RateLimitDecision(
        boolean allowed,
        long limit,
        long remaining,
        long retryAfterSeconds
) {
}
```

Exemplo para a quarta request:

```text
allowed:
true.

limit:
5.

remaining:
1.
```

Exemplo para a sexta:

```text
allowed:
false.

remaining:
0.

retryAfter:
TTL restante.
```

---

### 429 Too Many Requests

Quando a cota é excedida, a API responderá:

```text
429 Too Many Requests.
```

Esse status comunica:

```text
o consumidor enviou requests demais
dentro da política atual.
```

Não use:

```text
503 Service Unavailable.
```

503 representa indisponibilidade do serviço.

429 representa limitação aplicada ao consumidor.

---

### Retry-After

A resposta bloqueada incluirá:

```http
Retry-After: 37
```

O valor em segundos informa quanto o consumidor deve aguardar antes de tentar novamente.

O número virá do TTL da chave.

Nunca devolva zero ou valor negativo.

A baseline normaliza o mínimo para:

```text
1 segundo.
```

---

### Problem Details

O body continuará seguindo o formato público da API.

Exemplo:

```json
{
  "type": "about:blank",
  "title": "Too Many Requests",
  "status": 429,
  "detail": "Rate limit exceeded. Retry later.",
  "code": "rate_limit_exceeded",
  "retryAfterSeconds": 37
}
```

O filtro reutilizará o `ServletProblemDetailWriter` criado na aula 385.

Como o bloqueio ocorre antes do MVC:

```text
GlobalExceptionHandler não processa a resposta.
```

---

### Ordem dos filters

A cadeia atual possui:

```text
correlation;
lifecycle;
write traffic gate.
```

O rate limiter será adicionado depois do gate.

Entrada:

```text
correlation;
lifecycle;
write gate;
rate limit;
DispatcherServlet;
controller.
```

Se o gate retornar 503:

```text
rate limit não executa;
a request não consome cota.
```

Se o rate limiter retornar 429:

```text
controller não executa;
filters externos encerram normalmente.
```

---

### Fail-open ou fail-closed

Se Redis estiver indisponível, existem duas políticas principais.

Fail-open:

```text
permitir a request;
rate limiting fica temporariamente inativo.
```

Fail-closed:

```text
bloquear a request;
Redis vira dependência obrigatória.
```

A baseline didática utilizará:

```text
fail-open.
```

Motivo:

```text
a API continua disponível
enquanto o laboratório diagnostica Redis.
```

Isso não é uma regra universal.

Em um endpoint altamente sensível ou caro, permitir todas as requests durante a falha pode ser perigoso.

A decisão precisa ser registrada conforme risco e capacidade.

Nesta aula, uma falha será logada e a request seguirá.

---

### Hash da identidade

A chave não armazenará diretamente:

```text
cliente-aula-389;
192.168.0.10.
```

O resolver aplicará SHA-256.

Exemplo conceitual:

```text
entrada:
cliente-aula-389.

saída:
hash hexadecimal.
```

A chave ficará parecida com:

```text
formacao-java-backend-api:
local:
rate-limit:
managed-messages:
a93f...
```

O hash reduz exposição direta no keyspace.

Ele não transforma um identificador fraco em autenticação.

---

## Mão na massa guiada

### 1. Confirmar Redis e aplicação

Valide Redis:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli PING
```

Resultado:

```text
PONG
```

Entre no projeto:

```powershell
Set-Location `
  "labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api"
```

Compile:

```powershell
.\mvnw.cmd clean compile
```

---

### 2. Criar properties

Arquivo:

```text
ManagedMessageRateLimitProperties.java
```

Conteúdo:

```java
package br.com.formacao.backend.config.ratelimit;

import java.time.Duration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import org.springframework.boot.context.properties
        .ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(
        "app.rate-limit.managed-message"
)
@Validated
public record ManagedMessageRateLimitProperties(
        boolean enabled,

        @Positive
        long limit,

        @NotNull
        Duration window,

        @NotBlank
        String keyPrefix,

        @NotBlank
        String clientIdHeader
) {
}
```

O projeto já utiliza `@ConfigurationPropertiesScan`.

Não registre o record duas vezes.

---

### 3. Configurar a política

No profile Redis, adicione:

```yaml
app:
  rate-limit:
    managed-message:
      enabled: "${MANAGED_MESSAGE_RATE_LIMIT_ENABLED:true}"
      limit: "${MANAGED_MESSAGE_RATE_LIMIT:5}"
      window: "${MANAGED_MESSAGE_RATE_LIMIT_WINDOW:60s}"
      key-prefix: "formacao-java-backend-api:${app.environment.name}:rate-limit:managed-messages:"
      client-id-header: "X-Client-Id"
```

O namespace é diferente do cache.

Cache:

```text
...:managed-runtime-message-by-id::
```

Rate limit:

```text
...:rate-limit:managed-messages:
```

---

### 4. Criar o script Lua

Arquivo:

```text
src/main/resources/redis/fixed-window-rate-limit.lua
```

Conteúdo:

```lua
local current =
    redis.call(
        'INCR',
        KEYS[1]
    )

if current == 1 then
    redis.call(
        'EXPIRE',
        KEYS[1],
        ARGV[1]
    )
end

local ttl =
    redis.call(
        'TTL',
        KEYS[1]
    )

return {
    current,
    ttl
}
```

Não coloque regra HTTP no script.

O script cuida somente do contador e da expiração.

---

### 5. Registrar o RedisScript

Arquivo:

```text
ManagedMessageRateLimitConfiguration.java
```

Conteúdo:

```java
package br.com.formacao.backend.config.ratelimit;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation
        .Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.script
        .RedisScript;

@Configuration(
        proxyBeanMethods = false
)
public class ManagedMessageRateLimitConfiguration {

    @Bean
    @SuppressWarnings(
            "rawtypes"
    )
    RedisScript<List>
            managedMessageRateLimitScript() {

        return RedisScript.of(
                new ClassPathResource(
                        "redis/fixed-window-rate-limit.lua"
                ),
                List.class
        );
    }
}
```

Um único bean é reutilizado por todas as requests.

---

### 6. Criar RateLimitDecision

Arquivo:

```text
RateLimitDecision.java
```

Conteúdo:

```java
package br.com.formacao.backend.web.ratelimit;

public record RateLimitDecision(
        boolean allowed,
        long limit,
        long remaining,
        long retryAfterSeconds
) {
}
```

O record representa uma decisão já calculada.

Ele não conhece Servlet ou HTTP.

---

### 7. Criar o rate limiter Redis

Arquivo:

```text
RedisFixedWindowRateLimiter.java
```

Conteúdo:

```java
package br.com.formacao.backend.web.ratelimit;

import java.util.List;

import org.springframework.data.redis.core
        .StringRedisTemplate;
import org.springframework.data.redis.core.script
        .RedisScript;
import org.springframework.stereotype.Component;

import br.com.formacao.backend.config.ratelimit
        .ManagedMessageRateLimitProperties;

@Component
public class RedisFixedWindowRateLimiter {

    private final StringRedisTemplate
            redisTemplate;

    private final RedisScript<List>
            script;

    private final ManagedMessageRateLimitProperties
            properties;

    public RedisFixedWindowRateLimiter(
            StringRedisTemplate redisTemplate,
            RedisScript<List> script,
            ManagedMessageRateLimitProperties
                    properties
    ) {
        this.redisTemplate = redisTemplate;
        this.script = script;
        this.properties = properties;
    }

    public RateLimitDecision check(
            String clientKey
    ) {

        long windowSeconds =
                Math.max(
                        1,
                        properties
                                .window()
                                .toSeconds()
                );

        String redisKey =
                properties.keyPrefix()
                + clientKey;

        List<?> result =
                redisTemplate.execute(
                        script,
                        List.of(
                                redisKey
                        ),
                        Long.toString(
                                windowSeconds
                        )
                );

        if (result == null
                || result.size() < 2) {

            throw new IllegalStateException(
                    "Redis rate limit script "
                    + "returned an invalid result"
            );
        }

        long current =
                ((Number) result.get(0))
                        .longValue();

        long ttl =
                Math.max(
                        1,
                        ((Number) result.get(1))
                                .longValue()
                );

        long remaining =
                Math.max(
                        0,
                        properties.limit()
                                - current
                );

        return new RateLimitDecision(
                current
                        <= properties.limit(),
                properties.limit(),
                remaining,
                ttl
        );
    }
}
```

O contador pode continuar aumentando depois do limite.

Isso é aceitável.

A chave desaparecerá quando o TTL terminar.

---

### 8. Resolver a identidade

Arquivo:

```text
RateLimitClientKeyResolver.java
```

Conteúdo:

```java
package br.com.formacao.backend.web.ratelimit;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import br.com.formacao.backend.config.ratelimit
        .ManagedMessageRateLimitProperties;

@Component
public class RateLimitClientKeyResolver {

    private final ManagedMessageRateLimitProperties
            properties;

    public RateLimitClientKeyResolver(
            ManagedMessageRateLimitProperties
                    properties
    ) {
        this.properties = properties;
    }

    public String resolve(
            HttpServletRequest request
    ) {

        String clientId =
                request.getHeader(
                        properties.clientIdHeader()
                );

        if (clientId == null
                || clientId.isBlank()) {

            clientId =
                    request.getRemoteAddr();
        }

        String normalized =
                clientId
                        .trim()
                        .toLowerCase();

        return sha256(
                normalized
        );
    }

    private String sha256(
            String value
    ) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance(
                            "SHA-256"
                    );

            byte[] bytes =
                    digest.digest(
                            value.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            return HexFormat
                    .of()
                    .formatHex(
                            bytes
                    );
        } catch (
                NoSuchAlgorithmException exception
        ) {
            throw new IllegalStateException(
                    "SHA-256 is unavailable",
                    exception
            );
        }
    }
}
```

SHA-256 faz parte da plataforma Java.

---

### 9. Criar o filter

Arquivo:

```text
ManagedMessageRateLimitFilter.java
```

Estrutura:

```java
package br.com.formacao.backend.web.ratelimit;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.filter
        .OncePerRequestFilter;

public class ManagedMessageRateLimitFilter
        extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(
                    ManagedMessageRateLimitFilter.class
            );

    private final ManagedMessageRateLimitProperties
            properties;

    private final RateLimitClientKeyResolver
            clientKeyResolver;

    private final RedisFixedWindowRateLimiter
            rateLimiter;

    private final ServletProblemDetailWriter
            problemDetailWriter;

    public ManagedMessageRateLimitFilter(
            ManagedMessageRateLimitProperties
                    properties,
            RateLimitClientKeyResolver
                    clientKeyResolver,
            RedisFixedWindowRateLimiter
                    rateLimiter,
            ServletProblemDetailWriter
                    problemDetailWriter
    ) {
        this.properties = properties;
        this.clientKeyResolver =
                clientKeyResolver;
        this.rateLimiter = rateLimiter;
        this.problemDetailWriter =
                problemDetailWriter;
    }

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request
    ) {

        if (!properties.enabled()) {
            return true;
        }

        String method =
                request.getMethod();

        if ("OPTIONS".equals(method)
                || "HEAD".equals(method)) {
            return true;
        }

        String path =
                request.getRequestURI();

        return !path.startsWith(
                "/api/v1/runtime/managed-messages"
        )
        && !path.startsWith(
                "/api/v2/runtime/managed-messages"
        );
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        RateLimitDecision decision;

        try {
            String clientKey =
                    clientKeyResolver.resolve(
                            request
                    );

            decision =
                    rateLimiter.check(
                            clientKey
                    );
        } catch (
                DataAccessException
                | IllegalStateException exception
        ) {
            log.atWarn()
                    .setCause(
                            exception
                    )
                    .addKeyValue(
                            "event",
                            "rate_limit.redis.failed"
                    )
                    .log(
                            "Rate limit storage failed; "
                            + "allowing request"
                    );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        if (decision.allowed()) {
            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        response.setHeader(
                "Retry-After",
                Long.toString(
                        decision.retryAfterSeconds()
                )
        );

        ProblemDetail problem =
                ProblemDetail.forStatusAndDetail(
                        HttpStatus.TOO_MANY_REQUESTS,
                        "Rate limit exceeded. "
                        + "Retry after "
                        + decision.retryAfterSeconds()
                        + " seconds."
                );

        problem.setTitle(
                "Too Many Requests"
        );

        problem.setProperty(
                "code",
                "rate_limit_exceeded"
        );

        problem.setProperty(
                "limit",
                decision.limit()
        );

        problem.setProperty(
                "retryAfterSeconds",
                decision.retryAfterSeconds()
        );

        problemDetailWriter.write(
                response,
                problem
        );
    }
}
```

Adapte somente a chamada final à assinatura real do `ServletProblemDetailWriter` criado na aula 385.

Não duplique um segundo writer de Problem Details.

---

### 10. Registrar na ordem correta

Adicione em `ApiFilterOrder`:

```java
public static final int
        RATE_LIMIT =
                Ordered.HIGHEST_PRECEDENCE
                + 80;
```

A sequência permanece:

```text
correlation:
+50.

lifecycle:
+60.

write gate:
+70.

rate limit:
+80.
```

Na configuração de filters:

```java
@Bean
ManagedMessageRateLimitFilter
        managedMessageRateLimitFilter(
                ManagedMessageRateLimitProperties
                        properties,
                RateLimitClientKeyResolver
                        clientKeyResolver,
                RedisFixedWindowRateLimiter
                        rateLimiter,
                ServletProblemDetailWriter
                        problemDetailWriter
        ) {

    return new ManagedMessageRateLimitFilter(
            properties,
            clientKeyResolver,
            rateLimiter,
            problemDetailWriter
    );
}
```

Registration:

```java
@Bean
FilterRegistrationBean<
        ManagedMessageRateLimitFilter
> managedMessageRateLimitRegistration(
        ManagedMessageRateLimitFilter
                filter
) {

    FilterRegistrationBean<
            ManagedMessageRateLimitFilter
    > registration =
            new FilterRegistrationBean<>(
                    filter
            );

    registration.setName(
            "managedMessageRateLimitFilter"
    );

    registration.addUrlPatterns(
            "/api/*"
    );

    registration.setDispatcherTypes(
            DispatcherType.REQUEST
    );

    registration.setOrder(
            ApiFilterOrder.RATE_LIMIT
    );

    registration.setAsyncSupported(
            false
    );

    return registration;
}
```

Não anote o filter com `@Component`.

Isso evita registro duplicado.

---

### 11. Atualizar o contrato HTTP

As operações da feature podem devolver:

```text
429 Too Many Requests.
```

Adicione ao contrato v1 e v2:

- status 429;
- `application/problem+json`;
- header `Retry-After`;
- código `rate_limit_exceeded`.

Não altere os DTOs de sucesso.

A limitação é uma preocupação transversal da API.

---

### 12. Iniciar a aplicação

Com Redis e PostgreSQL ativos:

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

Confirme:

```text
rate limit enabled:
true.

limit:
5.

window:
60 segundos.
```

Não imprima o identificador bruto do cliente.

---

### 13. Testar manualmente

Use um cliente fixo:

```powershell
$headers = @{
  "X-Client-Id" = "cliente-aula-389"
}
```

Execute sete requests:

```powershell
1..7 | ForEach-Object {

    $response = Invoke-WebRequest `
      -Method Get `
      -Uri "http://localhost:8081/api/v2/runtime/managed-messages" `
      -Headers $headers `
      -SkipHttpErrorCheck

    [PSCustomObject]@{
        Request = $_
        Status = $response.StatusCode
        RetryAfter =
            $response.Headers["Retry-After"]
    }
}
```

Resultado esperado:

```text
requests 1 a 5:
status normal da operação.

requests 6 e 7:
429.

Retry-After:
valor positivo.
```

Se o endpoint de listagem exigir dados ou parâmetros, utilize uma rota válida da mesma feature.

---

### 14. Testar outro consumidor

Troque:

```powershell
$headers = @{
  "X-Client-Id" = "outro-cliente"
}
```

Faça uma request.

Resultado esperado:

```text
não herda o contador anterior.
```

Cada cliente gera outra chave.

---

### 15. Inspecionar no Redis

Liste as chaves:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli `
  --scan `
  --pattern "formacao-java-backend-api:local:rate-limit:*"
```

Capture uma chave:

```powershell
$rateLimitKey = docker exec `
  formacao-java-redis `
  redis-cli `
  --scan `
  --pattern "formacao-java-backend-api:local:rate-limit:*" |
  Select-Object -First 1
```

Consulte o contador:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli GET $rateLimitKey
```

Consulte o TTL:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli TTL $rateLimitKey
```

Resultado esperado:

```text
contador:
6 ou maior após bloqueio.

TTL:
positivo e menor ou igual a 60.
```

---

### 16. Testar a nova janela

Você pode aguardar o TTL terminar.

Depois faça outra request com o mesmo `X-Client-Id`.

Resultado:

```text
request permitida;
novo contador = 1;
novo TTL.
```

Para acelerar somente no laboratório, remova a chave específica:

```powershell
docker exec `
  formacao-java-redis `
  redis-cli DEL $rateLimitKey
```

Não use `FLUSHALL`.

---

### 17. Testar rate limit desabilitado

Pare a aplicação.

Defina:

```powershell
$env:MANAGED_MESSAGE_RATE_LIMIT_ENABLED = "false"
```

Inicie novamente e repita mais de cinco requests.

Resultado:

```text
nenhuma resposta 429
produzida pelo rate limiter.
```

Restaure:

```powershell
Remove-Item `
  Env:MANAGED_MESSAGE_RATE_LIMIT_ENABLED
```

---

### 18. Testar falha do Redis

Pare Redis:

```powershell
docker stop formacao-java-redis
```

Faça uma request válida.

Na baseline:

```text
WARN rate_limit.redis.failed;
request permitida.
```

Reinicie:

```powershell
docker start formacao-java-redis
```

Registre a decisão:

```text
baseline fail-open;
adequação de produção depende do risco.
```

---

## Entendendo o que foi feito

### O contador ficou compartilhado

Instâncias diferentes podem usar a mesma chave no Redis.

### A janela possui expiração

A chave desaparece automaticamente depois do período.

### O incremento ficou atômico

Lua impede uma chave incrementada sem TTL por falha entre comandos.

### O bloqueio ocorre antes do controller

Requests excedentes não consomem banco ou regra de negócio.

### A resposta usa semântica HTTP adequada

429 representa excesso de requests daquele consumidor.

### Retry-After orienta o cliente

O valor vem do TTL restante da chave.

### O identificador ficou separado da autenticação

`X-Client-Id` é somente recurso de laboratório.

### Cache e rate limiting não foram misturados

As features usam Redis, mas possuem namespaces e modelos diferentes.

---

## Erros comuns importantes

### Usar contador em memória

Cada instância aplicaria um limite diferente.

### Executar INCR e EXPIRE sem atomicidade

Uma falha pode deixar a chave sem TTL.

### Usar 503 para excesso individual

O serviço pode estar saudável; o cliente é que excedeu a política.

### Aplicar limite depois do controller

A capacidade que deveria ser protegida já foi consumida.

### Contar OPTIONS

Preflight e descoberta podem consumir cota sem representar operação real.

### Confiar em X-Client-Id como autenticação

O cliente pode trocar o header.

### Usar endereço IP sem considerar proxy

A aplicação pode limitar o proxy inteiro ou aceitar valor forjado.

### Compartilhar namespace com cache

Contadores e snapshots precisam de chaves separadas.

### Bloquear tudo quando Redis falhar sem decisão

Fail-closed transforma Redis em dependência crítica.

### Permitir tudo quando Redis falhar sem avaliar risco

Fail-open pode retirar a proteção de uma rota cara.

---

## Comandos úteis

### Iniciar Redis

```powershell
docker start formacao-java-redis
```

### Parar Redis

```powershell
docker stop formacao-java-redis
```

### Listar contadores

```powershell
docker exec `
  formacao-java-redis `
  redis-cli `
  --scan `
  --pattern "formacao-java-backend-api:local:rate-limit:*"
```

### Ler contador

```powershell
docker exec `
  formacao-java-redis `
  redis-cli GET <chave>
```

### Ler TTL

```powershell
docker exec `
  formacao-java-redis `
  redis-cli TTL <chave>
```

### Remover contador do laboratório

```powershell
docker exec `
  formacao-java-redis `
  redis-cli DEL <chave>
```

---

## Exercício guiado

### Parte 1 — Consumidores independentes

Use:

```text
cliente-a;
cliente-b.
```

Faça cinco requests para cada um.

Confirme dois contadores.

### Parte 2 — Compartilhamento entre versões

Faça requests v1 e v2 com o mesmo `X-Client-Id`.

Confirme que compartilham a cota da feature.

### Parte 3 — Nova janela

Ultrapasse o limite, aguarde o TTL e faça nova request.

Confirme reinício em 1.

### Parte 4 — Ordem do filter

Feche o write traffic gate.

Faça um POST.

Confirme:

```text
503;
contador não incrementa.
```

Restaure o gate.

### Parte 5 — Falha do Redis

Pare Redis.

Confirme a política fail-open e o log.

### Parte 6 — Registrar a decisão

Anote:

```text
5 requests por 60 segundos;

janela iniciada na primeira request;

contador no Redis;

INCR e EXPIRE em Lua;

X-Client-Id somente no laboratório;

hash SHA-256 na chave;

filter após write gate;

429 com Retry-After;

fail-open na baseline;

sem token bucket;
sem sliding window;
sem autenticação antecipada.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- a continuidade com a aula 388 foi preservada;
- Redis não foi confundido com cache nesta feature;
- contador ficou em namespace próprio;
- limite foi configurado externamente;
- janela foi configurada externamente;
- `StringRedisTemplate` foi usado;
- script Lua foi criado;
- `INCR` e `EXPIRE` ficaram atômicos;
- o script retorna contador e TTL;
- um `RedisScript` foi registrado como bean;
- `RateLimitDecision` foi criado;
- consumidor foi resolvido por header ou endereço remoto;
- identidade foi transformada em hash;
- `X-Client-Id` não foi tratado como autenticação;
- limite foi aplicado à feature;
- `HEAD` não foi contado;
- `OPTIONS` não foi contado;
- filter foi registrado explicitamente;
- filter ficou depois do write traffic gate;
- controller não executa em bloqueio;
- status 429 foi usado;
- `Retry-After` foi enviado;
- Problem Details foi reutilizado;
- contrato v1 e v2 recebeu 429;
- clientes diferentes possuem contadores diferentes;
- v1 e v2 compartilham a cota da feature;
- contador foi inspecionado no Redis;
- TTL foi inspecionado;
- nova janela foi testada;
- rate limit desabilitado foi testado;
- falha do Redis foi testada;
- fail-open foi documentado como decisão;
- token bucket não foi antecipado;
- sliding window não foi antecipada;
- Spring Security não foi antecipado;
- upload/download não foi antecipado;
- scheduler não foi antecipado;
- mensageria não foi antecipada;
- testes completos não foram antecipados;
- commit recomendado está pronto;
- ponte para a aula 390 está correta.

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
git commit -m "feat(m14): adicionar rate limiting com Redis"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `target`;
- dados do Redis;
- dumps;
- logs;
- identificadores reais;
- credenciais;
- `.env`;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a API ganhou uma proteção de frequência.

O fluxo ficou:

```text
request;

correlation filter;

lifecycle filter;

write traffic gate;

rate limit filter;

Redis Lua script;

permitir ou responder 429;

DispatcherServlet;

controller.
```

Você comprovou:

```text
contador compartilhado;

janela com TTL;

incremento atômico;

clientes independentes;

bloqueio antes do controller;

429 Too Many Requests;

Retry-After;

fail-open quando Redis falha.
```

A decisão central foi:

```text
rate limiting protege capacidade
por meio de uma cota temporária;

Redis mantém o contador compartilhado;

Lua garante a atomicidade;

HTTP 429 comunica o bloqueio ao consumidor.
```

A próxima aula será:

```text
390 - M14.35 - Upload download
```

Nela, a API passará a trabalhar com arquivos e conteúdo binário.

A aula tratará:

- recebimento de arquivo;
- validação;
- limites;
- armazenamento controlado;
- download;
- headers adequados.

Esses assuntos não foram antecipados aqui.

---

# Material complementar

## Checkpoint final

- [ ] Configurei limite e janela.
- [ ] Criei o script Lua atômico.
- [ ] Registrei o filter na ordem correta.
- [ ] Recebi 429 depois da quinta request.
- [ ] Validei contador, TTL e `Retry-After`.

---

## Troubleshooting adicional

### Todas as requests continuam permitidas

Confirme:

- `enabled=true`;
- profile correto;
- filter registrado;
- path dentro do escopo;
- Redis ativo;
- mesmo `X-Client-Id`.

### A primeira request retorna 429

Pode existir uma chave anterior.

Consulte contador e TTL.

Remova somente a chave do laboratório.

### A chave não expira

Confirme que o script recebeu uma janela positiva.

Verifique:

```text
TTL <chave>
```

Resultado `-1` indica ausência de expiração.

### O filter executa duas vezes

Confirme que ele não possui `@Component` além do `FilterRegistrationBean`.

### V1 e v2 possuem cotas separadas

A versão foi incluída indevidamente na chave.

A baseline usa uma cota por feature.

### Todos os usuários parecem o mesmo cliente

O proxy pode estar escondendo o endereço remoto.

No laboratório, envie `X-Client-Id`.

Em produção, resolva identidade somente com infraestrutura confiável.

### Redis fora do ar retorna erro 500

A exception não foi tratada pelo filter.

Confirme a política fail-open.

---

## Observações para aulas futuras

Existem algoritmos mais sofisticados:

- sliding window;
- sliding log;
- token bucket;
- leaky bucket;
- cotas por custo;
- múltiplas janelas.

Também existem decisões adicionais:

- limite por usuário autenticado;
- limite por tenant;
- limite por operação;
- política fail-closed;
- headers de quota;
- métricas;
- proteção em gateway.

Esses assuntos não serão implementados agora.

A baseline precisa permanecer compreensível e executável.

Testes automatizados completos serão aprofundados nas aulas específicas do cronograma.

---

## Perguntas de revisão

1. O que rate limiting protege?
2. Rate limiting é autenticação?
3. Por que usar Redis?
4. Qual é o limite da baseline?
5. Qual é a janela?
6. O que identifica o cliente no laboratório?
7. O header é confiável como identidade?
8. Qual algoritmo foi usado?
9. Por que usar Lua?
10. O que `INCR` faz?
11. O que `EXPIRE` faz?
12. O que o script retorna?
13. Qual status representa excesso?
14. Para que serve `Retry-After`?
15. Onde o filter fica na cadeia?
16. OPTIONS consome cota?
17. O controller executa em 429?
18. Qual é a política quando Redis falha?
19. Cache e rate limiting usam a mesma chave?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. A capacidade da API.
2. Não.
3. Para compartilhar o contador entre instâncias.
4. Cinco requests.
5. Sessenta segundos.
6. `X-Client-Id`, com fallback para endereço remoto.
7. Não.
8. Janela fixa por contador.
9. Para executar incremento e expiração atomicamente.
10. Incrementa o contador.
11. Define o TTL.
12. Contador e TTL.
13. 429.
14. Informar quando tentar novamente.
15. Depois do write traffic gate e antes do MVC.
16. Não.
17. Não.
18. Fail-open na baseline.
19. Não.
20. Upload download.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 389 - M14.34 - Rate limiting

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei cache de rate limiting.
- Defini uma cota de 5 requests por 60 segundos.
- Usei Redis para compartilhar contadores entre instâncias.
- Criei uma janela fixa iniciada na primeira request.
- Usei `INCR` e `EXPIRE`.
- Executei os comandos atomicamente com Lua.
- Registrei um `RedisScript` reutilizável.
- Usei `StringRedisTemplate`.
- Criei `RateLimitDecision`.
- Resolvi o consumidor por `X-Client-Id` no laboratório.
- Mantive fallback para endereço remoto.
- Transformei o identificador em SHA-256.
- Não tratei o header como autenticação.
- Criei um filter específico para a feature.
- Mantive `HEAD` e `OPTIONS` fora da cota.
- Registrei o filter depois do write traffic gate.
- Bloqueei requests excedentes antes do controller.
- Retornei HTTP 429.
- Adicionei `Retry-After`.
- Reutilizei Problem Details.
- Testei consumidores independentes.
- Inspecionei contador e TTL no Redis.
- Testei a abertura de nova janela.
- Testei o rate limit desabilitado.
- Adotei fail-open como baseline didática.
- Não antecipei token bucket, sliding window ou Security.
- Próxima aula: Upload download.
```

---

## Referência técnica curta

- [Spring Data Redis — Scripting](https://docs.spring.io/spring-data/redis/reference/redis/scripting.html)
- [Redis — INCR](https://redis.io/docs/latest/commands/incr/)
- [Redis — EXPIRE](https://redis.io/docs/latest/commands/expire/)
- [Redis — Rate limiter](https://redis.io/docs/latest/develop/use-cases/rate-limiter/)
- [RFC 6585 — 429 Too Many Requests](https://www.rfc-editor.org/rfc/rfc6585)

Regra final:

```text
um rate limiter precisa declarar consumidor, escopo, limite, janela, armazenamento, atomicidade e política de falha; nesta baseline, cada consumidor possui um contador no Redis, INCR e EXPIRE executam atomicamente em Lua, o filter bloqueia antes do controller, a API responde 429 com Retry-After e uma falha do Redis permite a request de forma explicitamente documentada.
```
