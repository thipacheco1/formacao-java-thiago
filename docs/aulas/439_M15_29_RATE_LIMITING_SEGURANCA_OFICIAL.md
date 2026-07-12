# 439 - M15.29 - Rate limiting seguranca

## Apresentação da aula

Na aula 438, o backend passou a tratar privacidade como engenharia de ciclo de vida.

Foram criados:

```text
inventário de dados;

finalidades;

owners;

workflow de direitos;

export do próprio usuário;

matriz de retenção;

proteção de logs;

ciclo de backups;

playbook de incidentes.
```

Dois endpoints de alto valor surgiram:

```text
POST /api/v2/privacy/requests;

GET /api/v2/privacy/me/export.
```

A aplicação também já possui endpoints sensíveis de autenticação:

```text
POST /api/auth/login;

POST /api/auth/refresh.
```

Todos eles podem ser usados de forma abusiva.

Exemplos:

```text
credential stuffing;

password spraying;

tentativas automatizadas;

refresh token guessing;

replay repetitivo;

criação massiva de solicitações;

geração excessiva de exports;

consumo de CPU e banco;

pressão sobre auditoria;

negação de serviço.
```

A API já possui rate limiting genérico desde a aula 389.

Naquele momento, a solução protegeu um endpoint operacional com:

- Redis;
- contador atômico;
- janela fixa;
- Lua;
- `429 Too Many Requests`;
- `Retry-After`;
- Problem Details;
- política fail-open para indisponibilidade do Redis.

A pergunta desta aula é como proteger autenticação e privacidade sem confiar apenas em IP, criar lockout permanente, expor identificadores no Redis ou liberar ataques quando o limitador falhar.

O rate limiting de segurança terá políticas específicas por risco.

Ele não será um filtro único com o mesmo número para toda a API.

A baseline terá:

```text
login:
rede + identidade declarada.

refresh:
rede + fingerprint do token.

privacy request:
usuário + tenant.

privacy export:
usuário + tenant.
```

Cada dimensão responde a uma ameaça; nenhuma delas será usada isoladamente.

Os limites do laboratório serão configuráveis:

| Política | Dimensão | Limite curto | Limite sustentado |
|---|---|---:|---:|
| Login por rede | rede confiável | 20/min | 100/15 min |
| Falhas por identidade | username normalizado | 5/5 min | 20/h |
| Refresh por rede | rede confiável | 30/min | 200/h |
| Refresh por token | fingerprint | 10/5 min | 30/h |
| Privacy request | usuário + tenant | 5/h | 20/dia |
| Privacy export | usuário + tenant | 2/h | 5/dia |

Os valores são didáticos e precisam ser calibrados com tráfego, risco, UX, MFA, capacidade, fraude, falsos positivos e SLAs.

A resposta de bloqueio será:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42
Cache-Control: no-store
Content-Type: application/problem+json
```

Body:

```json
{
  "type": "urn:problem:rate-limit-exceeded",
  "title": "Too many requests",
  "status": 429,
  "detail": "Request rate exceeded. Try again later.",
  "code": "rate_limit_exceeded",
  "correlationId": "corr-...",
  "retryAfterSeconds": 42
}
```

O endpoint de login não informará:

- limite exato;
- contador atual;
- username;
- existência da conta;
- razão interna;
- qual dimensão bloqueou;
- histórico de falhas.

O header `Retry-After` utilizará segundos inteiros.

O algoritmo continuará baseado em Redis e Lua, mas será ampliado para múltiplas janelas por política.

Exemplo:

```text
login-network:
20 por 60 segundos;
100 por 900 segundos.
```

As duas janelas serão avaliadas antes da operação protegida.

O Redis será a fonte compartilhada de estado entre instâncias.

A aplicação não utilizará:

- `ConcurrentHashMap`;
- cache local como autoridade;
- lock de JVM;
- contador no PostgreSQL por request;
- sleep;
- bloqueio permanente da conta;
- raw IP na key;
- e-mail na key;
- username na key;
- refresh token na key.

Identificadores serão transformados com:

```text
HMAC-SHA-256.
```

A chave HMAC virá de secret montado conforme a aula 431.

Isso é melhor que hash simples para valores de baixa entropia, como IP e username.

A indisponibilidade do Redis terá política diferente da aula 389: login, refresh, privacy request e export usam fail-closed.

Se o limitador de segurança não puder tomar uma decisão, a operação sensível não será executada.

Response:

```http
503 Service Unavailable
Retry-After: 5
```

Code:

```text
security_rate_limiter_unavailable.
```

Essa escolha reduz disponibilidade de login e export durante uma falha do Redis.

Ela preserva uma fronteira de segurança explícita.

Tokens de acesso já emitidos continuam utilizáveis na API quando os demais componentes estão saudáveis.

A política fail-open da aula 389 não será alterada para o endpoint operacional genérico.

Teremos duas decisões documentadas:

```text
limite operacional de baixo risco:
fail-open.

limite de autenticação e privacidade:
fail-closed.
```

A próxima aula será:

```text
440 - M15.30 - Protecao contra mass assignment
```

Nela, o backend impedirá que propriedades internas, como tenant, owner, status e permissions, sejam modificadas por JSON não autorizado.

---

## Onde estamos na formação

A sequência oficial é:

```text
437:
Multi tenancy seguranca.

438:
LGPD para backend.

439:
Rate limiting seguranca.

440:
Protecao contra mass assignment.

441:
Seguranca em DTOs e logs.

442:
Validacao de upload segura.
```

A aula 438 respondeu:

```text
como governar
o ciclo de vida
de dados pessoais?
```

A aula 439 responderá:

```text
como impedir abuso volumétrico
de operações sensíveis
sem transformar rate limiting
em um controle simplista?
```

Nesta aula:

```text
Redis:
sim.

Lua:
sim.

múltiplas janelas:
sim.

login:
sim.

refresh:
sim.

privacy request:
sim.

privacy export:
sim.

HMAC nas keys:
sim.

proxy confiável:
sim.

429:
sim.

Retry-After:
sim.

fail-closed:
sim.

lockout permanente:
não.

CAPTCHA:
discutido, não implementado.

MFA:
complementar.

mass assignment:
próxima aula.
```

A regra central será:

```text
rate limiting de segurança
precisa combinar dimensões,
ser distribuído,
não revelar identidade
e falhar conforme o risco.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
configuration/security/ratelimit/
├── SecurityRateLimitPolicy.java
├── SecurityRateLimitWindow.java
├── SecurityRateLimitProbe.java
├── SecurityRateLimitDecision.java
├── SecurityRateLimitKeyFactory.java
├── SecurityRateLimitKeyHasher.java
├── RedisSecurityRateLimiter.java
├── SecurityRateLimitGuard.java
├── SecurityRateLimitProblemWriter.java
├── SecurityRateLimitUnavailableException.java
└── SecurityRateLimitExceededException.java
```

Integrações:

```text
application/security/login/
└── LoginRateLimitService.java

application/security/refresh/
└── RefreshRateLimitService.java

application/privacy/
├── PrivacyRequestRateLimitService.java
└── PrivacyExportRateLimitService.java
```

Infraestrutura:

```text
src/main/resources/
├── redis/security-rate-limit.lua
└── application-security-rate-limit.yaml
```

Secret local:

```text
/run/secrets/security/
rate-limit-key-hmac.
```

Testes:

```text
SecurityRateLimitKeyHasherTest;

RedisSecurityRateLimiterIntegrationTest;

LoginRateLimitIntegrationTest;

RefreshRateLimitIntegrationTest;

PrivacyRateLimitIntegrationTest;

SecurityRateLimitLoggingPolicyTest.
```

Documentação:

```text
docs/security/
├── M15_SECURITY_RATE_LIMITING.md
└── M15_SECURITY_RATE_LIMIT_MATRIX.md
```

Você irá:

1. distinguir rate limit operacional e de segurança;
2. criar matriz de risco;
3. configurar múltiplas janelas;
4. criar policies imutáveis;
5. resolver rede confiável;
6. normalizar identidades;
7. aplicar HMAC;
8. criar keys sem PII;
9. criar script Lua atômico;
10. aplicar TTL;
11. calcular `Retry-After`;
12. proteger login;
13. proteger refresh;
14. proteger privacy request;
15. proteger export;
16. implementar fail-closed;
17. escrever Problem Details;
18. testar concorrência distribuída;
19. testar indisponibilidade;
20. preparar mass assignment.

---

## Conceito essencial

### Rate limiting não é autenticação

O limitador controla frequência; autenticação, autorização, tenant, ownership e regras de negócio continuam obrigatórios.
### Rate limiting não é lockout

A baseline limita tentativas por janelas e não desabilita contas permanentemente, evitando que um atacante cause bloqueio indefinido.
### Credential stuffing e password spraying

Credential stuffing reutiliza credenciais vazadas; password spraying testa poucas senhas contra muitas contas. Policies somente por username ou somente por IP são insuficientes, por isso a solução combina dimensões.
### Dimensões independentes

Login usa rede e falhas por identidade; refresh usa rede e fingerprint; privacidade usa usuário e tenant. A request precisa passar por todas as probes aplicáveis.
### Não confiar apenas em IP

IP é um sinal imperfeito: pode representar NAT, VPN, rede móvel, botnet ou proxy. Ele sempre será combinado com outra dimensão.
### Proxy confiável

`Forwarded` e `X-Forwarded-For` só serão usados atrás de proxy conhecido que higieniza headers. No laboratório, a origem vem de `request.getRemoteAddr()`.
### Network prefix

Policies podem agrupar IPv4 por `/24` e IPv6 por `/64`, reduzindo evasão e cardinalidade, com revisão de impacto para redes compartilhadas.
### HMAC em vez de SHA-256 simples

IP e username possuem baixa entropia. As keys usarão HMAC-SHA-256 com secret montado no runtime, impedindo comparação direta por dicionário contra o conteúdo do Redis. Rotacionar a chave reinicia contadores e exige registro operacional.
### Normalização

Username será limitado, trimmed e convertido com `Locale.ROOT`; valores inválidos entram em um bucket genérico. Tokens são transformados em fingerprint em memória e nunca registrados.
### Múltiplas janelas

Uma janela curta controla burst e outra controla abuso sustentado. Ambas precisam permitir a request.
### Janela fixa iniciada na primeira request

A primeira request cria contador e TTL; as seguintes incrementam sem renovar a expiração. Depois do TTL, a próxima request inicia nova janela.
### Operação atômica

Lua verifica todas as janelas, nega sem incrementar quando alguma está cheia e incrementa com TTL quando todas permitem.
### Retry-After

A response usa segundos inteiros calculados pelo maior TTL bloqueante, com arredondamento para cima e mínimo de um segundo.
### Não expor contador de login

Login, refresh e privacidade retornam apenas `Retry-After`, sem remaining, policy, dimensão ou contador.
### Fail-open e fail-closed

O limiter operacional da aula 389 permanece fail-open. Login, refresh e privacidade usam fail-closed e retornam `503` quando Redis não permite decisão.
### Rate limiting e enumeração

Usuário inexistente e password incorreta consomem o mesmo bucket de falhas e produzem contratos públicos iguais antes e depois do limite.
### Negação contra uma conta

Account buckets podem causar bloqueio temporário dirigido. A mitigação combina janelas curtas, rede, MFA, detecção de risco e ausência de lockout permanente.
### Resposta 429

`429 Too Many Requests` usa Problem Details genérico, correlation ID, `Retry-After` e `no-store`.
### Resposta 503

Falha do controle retorna `503 security_rate_limiter_unavailable`, sem detalhes de Redis, key ou infraestrutura.
### Redis não é audit trail

Counters expiram. Métricas agregadas e eventos amostrados registram deny e indisponibilidade sem armazenar cada request ou dimensão raw.
## Mão na massa guiada

### 1. Criar a matriz de policies

Arquivo:

```text
docs/security/M15_SECURITY_RATE_LIMIT_MATRIX.md
```

Inclua:

| Policy | Endpoint | Dimensão | Curto | Longo | Falha Redis |
|---|---|---|---:|---:|---|
| LOGIN_NETWORK | `/api/auth/login` | network | 20/min | 100/15m | deny |
| LOGIN_ACCOUNT_FAILURE | `/api/auth/login` | normalized username | 5/5m | 20/h | deny |
| REFRESH_NETWORK | `/api/auth/refresh` | network | 30/min | 200/h | deny |
| REFRESH_TOKEN | `/api/auth/refresh` | token fingerprint | 10/5m | 30/h | deny |
| PRIVACY_REQUEST | `/api/v2/privacy/requests` | user + tenant | 5/h | 20/day | deny |
| PRIVACY_EXPORT | `/api/v2/privacy/me/export` | user + tenant | 2/h | 5/day | deny |

Marque:

```text
valores de laboratório;
revisão obrigatória antes de produção.
```

---

### 2. Criar SecurityRateLimitWindow

```java
public record SecurityRateLimitWindow(
        int limit,
        Duration duration
) {
    public SecurityRateLimitWindow {
        if (limit <= 0) {
            throw new IllegalArgumentException(
                    "Rate limit must be positive"
            );
        }

        if (
            duration == null
            || duration.isZero()
            || duration.isNegative()
        ) {
            throw new IllegalArgumentException(
                    "Rate limit duration must be positive"
            );
        }
    }
}
```

---

### 3. Criar SecurityRateLimitPolicy

```java
public record SecurityRateLimitPolicy(
        String id,
        List<SecurityRateLimitWindow> windows,
        SecurityRateLimitFailureMode failureMode
) {
    public SecurityRateLimitPolicy {
        if (
            id == null
            || !id.matches(
                "[A-Z0-9_]{3,80}"
            )
        ) {
            throw new IllegalArgumentException(
                    "Invalid policy id"
            );
        }

        windows =
                List.copyOf(
                        windows
                );

        if (windows.isEmpty()) {
            throw new IllegalArgumentException(
                    "At least one window is required"
            );
        }
    }
}
```

Enum:

```java
public enum SecurityRateLimitFailureMode {
    ALLOW,
    DENY
}
```

As policies desta aula usam `DENY`.

---

### 4. Criar configuração

Arquivo:

```text
application-security-rate-limit.yaml
```

Exemplo:

```yaml
security:
  rate-limit:
    enabled: true
    key-version: v1
    key-hmac-file:
      /run/secrets/security/rate-limit-key-hmac

    policies:
      login-network:
        failure-mode: deny
        windows:
          - limit: 20
            duration: 60s
          - limit: 100
            duration: 15m

      login-account-failure:
        failure-mode: deny
        windows:
          - limit: 5
            duration: 5m
          - limit: 20
            duration: 1h

      refresh-network:
        failure-mode: deny
        windows:
          - limit: 30
            duration: 60s
          - limit: 200
            duration: 1h

      refresh-token:
        failure-mode: deny
        windows:
          - limit: 10
            duration: 5m
          - limit: 30
            duration: 1h

      privacy-request:
        failure-mode: deny
        windows:
          - limit: 5
            duration: 1h
          - limit: 20
            duration: 24h

      privacy-export:
        failure-mode: deny
        windows:
          - limit: 2
            duration: 1h
          - limit: 5
            duration: 24h
```

Não coloque a chave HMAC no YAML.

---

### 5. Criar o secret local

Crie:

```text
.secrets/security/
rate-limit-key-hmac
```

Gere ao menos 32 bytes aleatórios.

Monte no container:

```text
/run/secrets/security/rate-limit-key-hmac.
```

O arquivo permanece ignorado.

O loader reutiliza `SecretFileReader` da aula 431.

---

### 6. Criar SecurityRateLimitKeyHasher

```java
@Component
public class SecurityRateLimitKeyHasher {

    private final SecretKeySpec key;

    public SecurityRateLimitKeyHasher(
            RateLimitSecretProperties properties,
            SecretFileReader reader
    ) {
        char[] secret =
                reader.readRequired(
                        properties.keyHmacFile()
                );

        try {
            byte[] bytes =
                    new String(secret)
                            .getBytes(
                                StandardCharsets.UTF_8
                            );

            this.key =
                    new SecretKeySpec(
                            bytes,
                            "HmacSHA256"
                    );

            Arrays.fill(
                    bytes,
                    (byte) 0
            );
        }
        finally {
            Arrays.fill(
                    secret,
                    '\0'
            );
        }
    }

    public String hash(
            String policy,
            String dimension,
            String normalizedValue
    ) {
        try {
            Mac mac =
                    Mac.getInstance(
                            "HmacSHA256"
                    );

            mac.init(key);

            byte[] digest =
                    mac.doFinal(
                        String.join(
                            "\n",
                            policy,
                            dimension,
                            normalizedValue
                        )
                        .getBytes(
                            StandardCharsets.UTF_8
                        )
                    );

            return HexFormat
                    .of()
                    .formatHex(
                        digest
                    );
        }
        catch (
            GeneralSecurityException exception
        ) {
            throw new IllegalStateException(
                    "Unable to hash rate limit key",
                    exception
            );
        }
    }
}
```

Não registre os parâmetros.

---

### 7. Criar SecurityRateLimitKeyFactory

```java
@Component
public class SecurityRateLimitKeyFactory {

    private final SecurityRateLimitKeyHasher
            hasher;

    private final String keyVersion;

    public String create(
            SecurityRateLimitPolicy policy,
            String dimension,
            String normalizedValue,
            int windowIndex
    ) {
        String digest =
                hasher.hash(
                        policy.id(),
                        dimension,
                        normalizedValue
                );

        return "sec-rl:{"
                + digest
                + "}:"
                + keyVersion
                + ":"
                + policy.id()
                + ":"
                + windowIndex;
    }
}
```

As janelas da mesma probe compartilham o mesmo Redis Cluster hash tag.

---

### 8. Criar o script Lua

Arquivo:

```text
redis/security-rate-limit.lua
```

Conteúdo:

```lua
local denied = 0
local retry_after_ms = 0
local minimum_remaining = 2147483647

for index, key in ipairs(KEYS) do
    local limit =
        tonumber(ARGV[(index - 1) * 2 + 1])

    local window_ms =
        tonumber(ARGV[(index - 1) * 2 + 2])

    local current =
        tonumber(redis.call("GET", key) or "0")

    local ttl =
        tonumber(redis.call("PTTL", key))

    if current >= limit then
        denied = 1

        if ttl < 1 then
            ttl = window_ms
        end

        if ttl > retry_after_ms then
            retry_after_ms = ttl
        end
    end
end

if denied == 1 then
    return {
        0,
        retry_after_ms,
        0
    }
end

for index, key in ipairs(KEYS) do
    local limit =
        tonumber(ARGV[(index - 1) * 2 + 1])

    local window_ms =
        tonumber(ARGV[(index - 1) * 2 + 2])

    local current =
        tonumber(redis.call("INCR", key))

    if current == 1 then
        redis.call(
            "PEXPIRE",
            key,
            window_ms
        )
    end

    local remaining =
        limit - current

    if remaining < minimum_remaining then
        minimum_remaining = remaining
    end
end

return {
    1,
    0,
    minimum_remaining
}
```

Se qualquer janela negar, nenhuma janela é incrementada.

---

### 9. Criar SecurityRateLimitDecision

```java
public record SecurityRateLimitDecision(
        boolean allowed,
        Duration retryAfter,
        long remaining
) {
    public static SecurityRateLimitDecision allowed(
            long remaining
    ) {
        return new SecurityRateLimitDecision(
                true,
                Duration.ZERO,
                remaining
        );
    }

    public static SecurityRateLimitDecision denied(
            Duration retryAfter
    ) {
        return new SecurityRateLimitDecision(
                false,
                retryAfter,
                0
        );
    }
}
```

---

### 10. Criar RedisSecurityRateLimiter

```java
@Component
public class RedisSecurityRateLimiter {

    private final StringRedisTemplate
            redisTemplate;

    private final RedisScript<List>
            script;

    private final SecurityRateLimitKeyFactory
            keyFactory;

    public SecurityRateLimitDecision evaluate(
            SecurityRateLimitPolicy policy,
            String dimension,
            String normalizedValue
    ) {
        List<String> keys =
                new ArrayList<>();

        List<String> arguments =
                new ArrayList<>();

        for (
            int index = 0;
            index < policy.windows().size();
            index++
        ) {
            SecurityRateLimitWindow window =
                    policy.windows().get(index);

            keys.add(
                keyFactory.create(
                        policy,
                        dimension,
                        normalizedValue,
                        index
                )
            );

            arguments.add(
                Integer.toString(
                        window.limit()
                )
            );

            arguments.add(
                Long.toString(
                        window.duration()
                                .toMillis()
                )
            );
        }

        List<?> result =
                redisTemplate.execute(
                        script,
                        keys,
                        arguments.toArray()
                );

        return mapDecision(
                result
        );
    }
}
```

Valide null e formato inesperado como indisponibilidade.

---

### 11. Criar SecurityRateLimitGuard

```java
@Component
public class SecurityRateLimitGuard {

    private final RedisSecurityRateLimiter
            limiter;

    public void requireAllowed(
            SecurityRateLimitProbe probe
    ) {
        SecurityRateLimitDecision decision;

        try {
            decision =
                    limiter.evaluate(
                            probe.policy(),
                            probe.dimension(),
                            probe.normalizedValue()
                    );
        }
        catch (
            RuntimeException exception
        ) {
            handleUnavailable(
                    probe.policy(),
                    exception
            );

            return;
        }

        if (!decision.allowed()) {
            throw new SecurityRateLimitExceededException(
                    decision.retryAfter()
            );
        }
    }
}
```

Para `DENY`, `handleUnavailable` lança:

```text
SecurityRateLimitUnavailableException.
```

A exception original fica somente no log interno, sem valores da probe.

---

### 12. Resolver a rede

Crie:

```java
@Component
public class TrustedNetworkIdentityResolver {
}
```

Baseline local:

```java
String resolve(
        HttpServletRequest request
) {
    return normalizeAddress(
            request.getRemoteAddr()
    );
}
```

Não leia `X-Forwarded-For` até existir uma lista de proxies confiáveis e configuração de infraestrutura.

Teste um header falsificado e confirme que ele é ignorado.

---

### 13. Normalizar username

```java
String normalizeUsername(
        String raw
) {
    if (
        raw == null
        || raw.length() > 254
    ) {
        return "invalid";
    }

    return raw
            .strip()
            .toLowerCase(
                    Locale.ROOT
            );
}
```

O valor `"invalid"` também possui bucket.

Não diferencie conta inexistente.

---

### 14. Integrar o login por rede

No início de `POST /api/auth/login`:

```java
loginRateLimitService
        .requireNetworkAllowed(
                request
        );
```

Isso ocorre antes de:

- `AuthenticationManager`;
- password hash;
- banco;
- emissão de token.

Requests bloqueadas não executam autenticação.

---

### 15. Integrar falhas por identidade

Fluxo:

```java
String normalized =
        normalizeUsername(
                body.username()
        );

loginRateLimitService
        .requireAccountFailureAllowed(
                normalized
        );

try {
    Authentication authentication =
            authenticationManager
                    .authenticate(
                        token
                    );

    loginRateLimitService
            .clearAccountFailures(
                    normalized
            );

    return issueTokens(
            authentication
    );
}
catch (
    AuthenticationException exception
) {
    loginRateLimitService
            .recordAccountFailure(
                    normalized
            );

    throw exception;
}
```

O pre-check e o record utilizam a mesma key.

O clear acontece somente após autenticação válida.

O bucket de rede não é limpo.

---

### 16. Evitar double consumption

`requireAccountFailureAllowed` apenas consulta a decisão atual?

A implementação Lua da aula consome ao permitir.

Para falhas por conta, crie duas operações:

```text
check;

consumeFailure.
```

O script de check lê sem incrementar.

Somente a falha incrementa.

Caso contrário, logins válidos consumiriam cota de falha.

Crie:

```text
security-rate-limit-check.lua;

security-rate-limit-consume.lua.
```

A mesma atomicidade é preservada.

---

### 17. Proteger refresh por rede

Antes de consultar o refresh token:

```java
refreshRateLimitService
        .requireNetworkAllowed(
                request
        );
```

A request bloqueada não acessa banco.

---

### 18. Proteger refresh por fingerprint

O body contém refresh token raw.

Crie fingerprint em memória:

```java
String fingerprint =
        keyHasher.hash(
                "REFRESH_TOKEN",
                "token",
                rawRefreshToken
        );
```

Use a fingerprint como normalized value de outra HMAC key ou crie uma função específica que evite dupla exposição.

Nunca persista ou registre o raw.

Random tokens diferentes podem criar keys diferentes, por isso a policy de rede continua obrigatória.

---

### 19. Integrar privacy request

No início do application service:

```java
privacyRequestRateLimitService
        .requireAllowed(
                tenant
        );
```

A key lógica contém:

```text
tenantId + userId.
```

O guard roda antes de:

- criar aggregate;
- inserir no PostgreSQL;
- gravar audit de sucesso.

Um bloqueio pode gerar evento agregado ou métrica.

---

### 20. Integrar privacy export

Antes de montar o export:

```java
privacyExportRateLimitService
        .requireAllowed(
                tenant
        );
```

O rate limit roda antes da query de alto volume.

A recent authentication continua obrigatória.

Ordem:

```text
authentication;

tenant;

recent authentication;

rate limit;

queries;

export.
```

Não consumir quota de export para usuário sem autenticação recente.

---

### 21. Criar Problem Details 429

```java
@ExceptionHandler(
    SecurityRateLimitExceededException.class
)
ResponseEntity<ProblemDetail>
handleRateLimitExceeded(
        SecurityRateLimitExceededException exception,
        HttpServletRequest request
) {
    long seconds =
            Math.max(
                1,
                exception.retryAfter()
                        .toSeconds()
            );

    ProblemDetail problem =
            apiProblemFactory.create(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "urn:problem:rate-limit-exceeded",
                    "Too many requests",
                    "Request rate exceeded. Try again later.",
                    "rate_limit_exceeded",
                    request
            );

    problem.setProperty(
            "retryAfterSeconds",
            seconds
    );

    return ResponseEntity
            .status(
                HttpStatus.TOO_MANY_REQUESTS
            )
            .header(
                HttpHeaders.RETRY_AFTER,
                Long.toString(seconds)
            )
            .cacheControl(
                CacheControl.noStore()
            )
            .body(problem);
}
```

Use arredondamento para cima ao converter milissegundos.

---

### 22. Criar Problem Details 503

```java
@ExceptionHandler(
    SecurityRateLimitUnavailableException.class
)
ResponseEntity<ProblemDetail>
handleRateLimiterUnavailable(
        HttpServletRequest request
) {
    ProblemDetail problem =
            apiProblemFactory.create(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "urn:problem:security-rate-limiter-unavailable",
                    "Security control unavailable",
                    "The operation is temporarily unavailable.",
                    "security_rate_limiter_unavailable",
                    request
            );

    return ResponseEntity
            .status(
                HttpStatus.SERVICE_UNAVAILABLE
            )
            .header(
                HttpHeaders.RETRY_AFTER,
                "5"
            )
            .cacheControl(
                CacheControl.noStore()
            )
            .body(problem);
}
```

Não escreva “Redis unavailable” no body.

---

### 23. Tratar login fora do MVC handler

Controllers usam o advice existente. Se uma policy for aplicada em filtro, reutilize `SecurityProblemWriter` para manter `application/problem+json` e o mesmo catálogo.

### 24. Adicionar métricas

Crie contadores de allow, deny e unavailable e histograma de latência. Use somente `policy` e `outcome` como labels; nunca username, IP, tenant, user ID, fingerprint ou correlation ID.

### 25. Logging

Deny registra policy, outcome e correlation ID. Indisponibilidade registra exception class internamente. Keys e dimensões nunca aparecem.

### 26. Atualizar OpenAPI

Documente `429`, `503`, Problem Details e `Retry-After` nos endpoints de login, refresh, privacy request e export.

### 27. Atualizar Postman e Insomnia

Adicione cenários de allow, deny, indisponibilidade e recuperação após TTL usando somente fixtures sintéticas.

### 28. Testar o HMAC

Valide determinismo, separação por policy e dimension, mudança por secret e ausência dos valores raw no digest e nas keys.

### 29. Testar o script com Redis real

Com Testcontainers, cubra limite, próxima request negada, TTL, expiração, janelas curta e longa e ausência de incremento quando houver deny.

### 30. Testar concorrência distribuída

Duas instâncias apontadas ao mesmo Redis devem permitir exatamente a quantidade configurada sob concorrência.

### 31. Testar login genérico

Usuário inexistente e password incorreta retornam o mesmo `401`; após o threshold, o mesmo `429`, sem enumeração.

### 32. Testar bloqueio antes da autenticação

Quando a policy de rede nega, valide `verifyNoInteractions(authenticationManager)`.

### 33. Testar sucesso limpando falhas

Autenticação válida limpa apenas o bucket de falhas da identidade e preserva o bucket de rede.

### 34. Testar refresh

Cubra rede, fingerprint, tokens aleatórios, ausência do raw no Redis e nenhuma rotação ou revogação após deny.

### 35. Testar privacidade por tenant

Usuário e tenant compõem buckets independentes; nenhum UUID raw aparece no Redis.

### 36. Testar indisponibilidade

Redis indisponível produz `503`, `Retry-After`, `no-store` e nenhuma chamada ao serviço sensível. O limiter operacional antigo continua fail-open.

### 37. Testar logs

Use sentinelas de username, IP, token e tenant e confirme ausência em allow, deny e erro.

### 38. Criar documento principal

Em `M15_SECURITY_RATE_LIMITING.md`, documente objetivo, dimensões, algoritmo Redis/Lua, HMAC, respostas e diferença entre fail-open operacional e fail-closed de segurança.

### 39. Atualizar auditoria

Planeje `SECURITY_RATE_LIMIT_EXCEEDED` e `SECURITY_RATE_LIMIT_UNAVAILABLE` com agregação ou sampling, sem dimensão raw.

### 40. Atualizar threat model

Adicione:

```text
THR-192:
credential stuffing.

THR-193:
password spraying.

THR-194:
atacante distribui requests
entre vários IPs.

THR-195:
usuário legítimo é bloqueado
por account-only policy.

THR-196:
X-Forwarded-For falsificado
contorna limite.

THR-197:
username ou IP aparece no Redis.

THR-198:
refresh tokens aleatórios
criam keys ilimitadas.

THR-199:
Redis indisponível
desabilita controle sensível.

THR-200:
rate limiter por instância
permite excesso global.

THR-201:
janela não possui TTL.

THR-202:
429 revela existência da conta.

THR-203:
metrics possuem labels pessoais.

THR-204:
privacy export é abusado.
```

Controles:

- múltiplas dimensões;
- rede + conta;
- proxy confiável;
- HMAC;
- network bucket;
- fail-closed;
- Redis compartilhado;
- Lua;
- TTL;
- contrato genérico;
- labels limitadas;
- policy específica.

---

### 41. Atualizar OWASP e baseline

A07 Authentication Failures:

```text
login e refresh:
rate limited.

mensagem:
genérica.

lockout permanente:
não usado.

MFA:
continua recomendado.
```

A04 Insecure Design:

```text
policies:
por risco.

falha:
documentada.

múltiplas dimensões:
aplicadas.
```

A09 Security Logging:

```text
deny:
observável.

identificadores:
não registrados.

cardinalidade:
controlada.
```

Baseline:

```text
security rate limiting:
distribuído.

Redis:
atômico.

keys:
HMAC.

login:
rede + falha por identidade.

refresh:
rede + fingerprint.

privacidade:
user + tenant.

429:
Retry-After.

Redis failure:
503 fail-closed.

produção pública:
NO-GO.
```

---

### 42. Executar o gate

Testes focados:

```powershell
.\mvnw.cmd `
  -Dtest=SecurityRateLimitKeyHasherTest,RedisSecurityRateLimiterIntegrationTest,LoginRateLimitIntegrationTest,RefreshRateLimitIntegrationTest,PrivacyRateLimitIntegrationTest,SecurityRateLimitLoggingPolicyTest `
  test
```

Suítes anteriores:

```powershell
.\mvnw.cmd `
  -Dtest=PrivacySubjectRequestIntegrationTest,PersonalDataExportIntegrationTest,TenantIsolationIntegrationTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- secret HMAC obrigatório;
- raw identifiers ausentes;
- Lua atômico;
- TTL;
- múltiplas janelas;
- concorrência;
- login;
- refresh;
- privacy request;
- export;
- 429;
- Retry-After;
- 503;
- fail-closed;
- generic limiter ainda fail-open;
- logs;
- métricas;
- OpenAPI;
- collection;
- nenhum teste desabilitado.

---

## Entendendo o que foi feito

### Rate limiting ficou orientado a risco

Cada endpoint recebeu policy própria.

### Múltiplas dimensões reduziram evasão

Rede, identidade, token, usuário e tenant cumprem papéis diferentes.

### Redis tornou a decisão distribuída

Instâncias compartilham o mesmo contador.

### Lua preservou atomicidade

Contagem, TTL e bloqueio não sofrem race entre comandos.

### HMAC protegeu identificadores

Redis não contém username, IP, token ou UUID raw.

### Falha Redis ganhou decisão explícita

Operações sensíveis retornam `503` em vez de seguir sem controle.

### 429 ganhou contrato estável

`Retry-After`, Problem Details e `no-store` orientam o cliente.

### Segurança e observabilidade foram equilibradas

Métricas usam labels limitadas e logs não recebem dimensões.

---

## Erros comuns importantes

### Usar o mesmo limite em toda a API

Risco e custo variam por endpoint.

### Confiar somente em IP

Botnets contornam; NAT pode bloquear usuários legítimos.

### Confiar no X-Forwarded-For

Headers são falsificáveis sem proxy confiável.

### Guardar username na key

Redis se torna fonte de dados pessoais.

### Usar SHA-256 simples em IP

Valores de baixa entropia podem ser testados offline.

### Aplicar lockout permanente

Atacantes podem negar acesso a uma conta.

### Falhar aberto no login sem decisão

Indisponibilidade do Redis remove a defesa.

### Incrementar contador fora de operação atômica

Requests concorrentes ultrapassam o limite.

### Logar token fingerprint

Mesmo derivado, ele não precisa aparecer na observabilidade.

### Retornar contador detalhado no login

Pode fornecer informação operacional ao atacante.

---

## Comandos úteis

### Testes de rate limiting

```powershell
.\mvnw.cmd `
  -Dtest=RedisSecurityRateLimiterIntegrationTest,LoginRateLimitIntegrationTest,RefreshRateLimitIntegrationTest,PrivacyRateLimitIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar identificadores em keys

```powershell
git grep `
  -n `
  -E `
  "rate.*(username|email|remoteAddr|tokenValue)"
```

### Procurar trust indevido em proxy

```powershell
git grep `
  -n `
  -E `
  "X-Forwarded-For|Forwarded"
```

### Procurar limiter local

```powershell
git grep `
  -n `
  -E `
  "ConcurrentHashMap.*rate|AtomicInteger.*limit"
```

---

## Exercício guiado

### Parte 1 — Risco

Classifique login, refresh e privacidade.

### Parte 2 — Dimensões

Combine rede, identidade, token, usuário e tenant.

### Parte 3 — Privacidade

Crie keys com HMAC.

### Parte 4 — Redis

Implemente múltiplas janelas em Lua.

### Parte 5 — Login

Limite rede e falhas por identidade.

### Parte 6 — Refresh

Limite rede e fingerprint.

### Parte 7 — Privacidade

Limite request e export.

### Parte 8 — Contrato

Implemente `429`, `503` e `Retry-After`.

### Parte 9 — Resiliência

Teste Redis indisponível e concorrência.

### Parte 10 — Governança

Atualize matriz, riscos, métricas e documentação.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 438 foi preservada;
- rate limiting foi diferenciado de autenticação e lockout;
- credential stuffing e password spraying foram explicados;
- policies por risco e valores didáticos foram documentados;
- rede, identidade, token, usuário e tenant foram combinados;
- proxy headers não são confiados sem proxy conhecido;
- HMAC-SHA-256 com secret protege as keys;
- identificadores raw não aparecem no Redis, logs ou métricas;
- múltiplas janelas, TTL e Lua atômico foram implementados;
- deny não incrementa janelas;
- login limita rede e falhas por identidade;
- sucesso limpa apenas falhas da identidade;
- refresh limita rede e fingerprint;
- privacidade limita usuário e tenant;
- recent authentication precede a cota de export;
- `429`, `Retry-After`, Problem Details e `no-store` foram aplicados;
- indisponibilidade produz `503` fail-closed;
- limiter operacional da aula 389 continua fail-open;
- OpenAPI, collections, documentação e matriz foram atualizados;
- Redis real, concorrência, expiração e indisponibilidade foram testados;
- bloqueio ocorre antes da autenticação ou queries;
- contratos não permitem enumeração;
- auditoria usa agregação ou sampling;
- threat model e OWASP foram atualizados;
- mass assignment não foi antecipado;
- produção pública permaneceu NO-GO;
- gate completo foi executado;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check

git grep `
  -n `
  -E `
  "rate.*(username|email|remoteAddr|tokenValue)"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/security `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Confirme que não aparecem:

```text
.secrets/security/rate-limit-key-hmac;

Redis dump;

tokens;

logs de teste com sentinelas.
```

Commit recomendado:

```powershell
git commit -m "feat(m15): limitar abuso em autenticacao e privacidade"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- chave HMAC;
- username real;
- IP real de usuário;
- refresh token;
- token fingerprint;
- Redis dump;
- contador exportado;
- password;
- métricas com identidade;
- valores produtivos não aprovados.

---

## Fechamento e ponte para a próxima aula

Nesta aula, rate limiting deixou de ser apenas controle de capacidade.

Ele passou a proteger:

```text
login;

refresh;

privacy request;

privacy export.
```

As dimensões ficaram:

```text
rede;

identidade declarada;

token fingerprint;

usuário;

tenant.
```

Os identificadores foram protegidos por:

```text
HMAC-SHA-256;

secret versionado operacionalmente;

nenhum valor raw no Redis.
```

O algoritmo utiliza:

```text
Redis;

Lua;

múltiplas janelas;

TTL;

decisão distribuída.
```

O contrato público ficou:

```text
limite excedido:
429 + Retry-After.

controle indisponível:
503 + Retry-After.

body:
Problem Details.

cache:
no-store.
```

A decisão central foi:

```text
um rate limiter de segurança
precisa combinar sinais,
preservar privacidade,
ser atômico entre instâncias
e possuir política explícita
para a falha do próprio controle.
```

A aplicação agora reduz ataques volumétricos.

Ainda existe outra classe de risco:

```text
o cliente envia campos
que não deveria controlar.
```

Mesmo com autenticação, tenant e rate limit corretos, um JSON pode tentar modificar:

- tenant;
- owner;
- status;
- version;
- roles;
- permissions;
- audit fields;
- internal flags.

A próxima aula será:

```text
440 - M15.30 - Protecao contra mass assignment
```

Nela, você irá:

- separar DTOs de entrada e entidades;
- aplicar allowlist de campos;
- rejeitar propriedades desconhecidas;
- impedir binding de tenant e owner;
- proteger status e version;
- testar JSON malicioso;
- revisar mappers;
- impedir updates genéricos;
- documentar campos controlados pelo servidor.

---

# Material complementar

## Checkpoint final

- [ ] Criei policies por risco.
- [ ] Combinei dimensões sem confiar apenas em IP.
- [ ] Protegi keys com HMAC.
- [ ] Retornei `429` e `Retry-After`.
- [ ] Testei concorrência e Redis indisponível.

---

## Troubleshooting adicional

### Login bloqueia usuários atrás do mesmo NAT

Revise o limite de rede e combine com identity bucket.

Não remova toda proteção de rede.

### X-Forwarded-For permite trocar de IP

A aplicação está confiando em header sem proxy configurado.

Use `remoteAddr` até a infraestrutura ser validada.

### Redis mostra usernames

A key factory está usando valor raw.

Aplique HMAC antes de construir a key.

### O contador não expira

Confirme `PEXPIRE` na primeira request e teste `PTTL`.

### Mais requests passam em concorrência

A operação não está totalmente dentro do script Lua ou usa Redis diferentes.

### Login válido continua bloqueado

Revise limpeza do bucket de falhas e preserve o bucket de rede.

### Redis fora libera login

A policy sensível foi configurada como `ALLOW`.

Use `DENY` conforme a matriz.

### Privacy export consome cota antes do step-up

Mova recent authentication antes do guard.

---

## Perguntas de revisão

1. Rate limiting substitui autenticação?
2. Rate limiting é igual a lockout?
3. O que é credential stuffing?
4. O que é password spraying?
5. Por que não usar somente IP?
6. Quando confiar em X-Forwarded-For?
7. Por que usar HMAC?
8. Onde fica a chave HMAC?
9. Para que servem duas janelas?
10. Por que usar Lua?
11. O que ocorre no limite?
12. Qual header orienta nova tentativa?
13. O login revela a policy?
14. Como limitar refresh?
15. Como limitar export?
16. O que ocorre quando Redis falha?
17. O limiter operacional antigo mudou?
18. Identificadores podem virar labels?
19. Qual é a próxima aula?
20. Qual risco será tratado?

---

## Roteiro de resposta

1. Não.
2. Não.
3. Uso automatizado de credenciais vazadas.
4. Poucas passwords contra muitas contas.
5. Botnets e redes compartilhadas.
6. Somente atrás de proxy confiável.
7. Para não expor valores de baixa entropia.
8. Em secret montado no runtime.
9. Controlar burst e abuso sustentado.
10. Para atomicidade no Redis.
11. `429`.
12. `Retry-After`.
13. Não.
14. Rede e fingerprint do token.
15. Usuário e tenant.
16. `503` fail-closed.
17. Não; continua fail-open.
18. Não.
19. Protecao contra mass assignment.
20. Campos que o cliente não deve controlar.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 439 - M15.29 - Rate limiting seguranca

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei rate limiting operacional e de segurança.
- Diferenciei rate limiting e lockout.
- Estudei credential stuffing e password spraying.
- Criei policies específicas para login, refresh e privacidade.
- Usei limites curtos e sustentados.
- Marquei os valores como didáticos.
- Combinei rede, identidade, token, usuário e tenant.
- Não confiei apenas em IP.
- Ignorei headers de proxy sem infraestrutura confiável.
- Criei `SecurityRateLimitWindow`.
- Criei `SecurityRateLimitPolicy`.
- Criei `SecurityRateLimitKeyHasher`.
- Usei HMAC-SHA-256.
- Carreguei a chave HMAC por secret.
- Não coloquei username, IP, token ou UUID raw no Redis.
- Criei `SecurityRateLimitKeyFactory`.
- Criei script Lua com múltiplas janelas.
- Mantive decisão atômica.
- Apliquei TTL.
- Calculei `Retry-After`.
- Protegi login por rede.
- Protegi falhas por identidade.
- Limpei falhas após sucesso sem limpar a rede.
- Mantive contrato igual para usuário inexistente e password incorreta.
- Protegi refresh por rede e fingerprint.
- Protegi privacy request por usuário e tenant.
- Protegi privacy export por usuário e tenant.
- Mantive recent authentication antes da cota do export.
- Criei Problem Details para `429`.
- Criei Problem Details para `503`.
- Usei `Cache-Control: no-store`.
- Apliquei fail-closed nos endpoints sensíveis.
- Preservei fail-open no limiter operacional da aula 389.
- Criei métricas com labels limitadas.
- Protegi logs contra dimensões raw.
- Atualizei OpenAPI e collections.
- Testei Redis real com Testcontainers.
- Testei limite, TTL, janelas e concorrência.
- Testei bloqueio antes da autenticação.
- Testei refresh sem rotação após deny.
- Testei privacy buckets por tenant.
- Testei Redis indisponível.
- Testei ausência de sentinelas nos logs.
- Criei `M15_SECURITY_RATE_LIMITING.md`.
- Criei `M15_SECURITY_RATE_LIMIT_MATRIX.md`.
- Atualizei auditoria, threat model, OWASP e baseline.
- Mantive produção pública como NO-GO.
- Próxima aula: Protecao contra mass assignment.
```

---

## Referência técnica curta

- [RFC 6585 — Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585.html)
- [RFC 9110 — HTTP Semantics: Retry-After](https://www.rfc-editor.org/rfc/rfc9110.html)
- [OWASP Credential Stuffing Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html)
- [OWASP Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Spring Data Redis — Scripting](https://docs.spring.io/spring-data/redis/reference/redis/scripting.html)
- [Redis — EVAL](https://redis.io/docs/latest/commands/eval/)
- [Java 21 — Mac](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/javax/crypto/Mac.html)

Regra final:

```text
rate limiting de segurança deve ser distribuído, específico por endpoint e composto por múltiplas dimensões: login combina rede e falhas por identidade, refresh combina rede e fingerprint, privacidade combina usuário e tenant; as keys usam HMAC com secret, Redis e Lua mantêm contagem atômica e TTL, `429` usa `Retry-After` e Problem Details sem revelar a policy, falhas do Redis bloqueiam operações sensíveis com `503`, enquanto métricas, logs e auditoria permanecem livres de identificadores e tokens.
```
