# 425 - M15.15 - Refresh token

## Apresentação da aula

Na aula 424, o access token emitido no login passou a ser aceito pela API.

O fluxo protegido ficou:

```text
Authorization: Bearer
-> BearerTokenAuthenticationFilter
-> JwtAuthenticationProvider
-> NimbusJwtDecoder
-> signature RS256
-> validators
-> JwtAuthenticationToken
-> SecurityContext
-> AuthorizationFilter
```

A API agora diferencia:

```text
token ausente:
401 authentication_required.

token inválido:
401 invalid_token.

token válido:
acesso conforme a regra.

token válido sem permissão:
403 access_denied.
```

O access token do laboratório possui vida curta:

```text
cinco minutos.
```

Essa duração reduz a janela de uso de um token roubado, mas cria uma necessidade operacional:

```text
o que o cliente faz
quando o access token expira?
```

Uma alternativa seria pedir username e password novamente.

Isso funciona, porém obriga o usuário a repetir a autenticação completa com frequência.

Outra alternativa é emitir uma segunda credencial:

```text
refresh token.
```

A pergunta central desta aula será:

```text
como emitir e trocar refresh tokens
sem armazenar a credencial em texto,
sem permitir reutilização silenciosa
e sem transformar um vazamento
em uma sessão permanente?
```

A solução da formação utilizará:

```text
access token:
JWT assinado e curto.

refresh token:
opaco, aleatório e longo.

armazenamento:
somente hash.

uso:
uma única vez.

rotação:
obrigatória.

família:
identifica a cadeia.

reutilização:
revoga a família.

expiração ociosa:
sete dias.

expiração absoluta:
trinta dias.
```

O refresh token não será um JWT.

Ele não precisa carregar claims porque o servidor consultará o estado persistido no momento da troca.

O valor será produzido com:

```text
32 bytes aleatórios;
SecureRandom;
Base64URL sem padding.
```

Isso entrega 256 bits de entropia antes da codificação.

No banco será persistido apenas:

```text
SHA-256(refresh token).
```

SHA-256 simples foi rejeitado para passwords na aula 417 porque passwords humanas possuem baixa entropia.

Aqui o cenário é diferente.

O refresh token é:

- gerado aleatoriamente;
- impraticável de adivinhar;
- não escolhido pelo usuário;
- longo;
- usado como credencial opaca.

O hash rápido permite busca eficiente sem guardar a credencial original.

A arquitetura criará:

```text
security_refresh_token_family;

security_refresh_token.
```

Uma família representa a sessão renovável iniciada no login.

Cada troca cria um novo token dentro da mesma família.

Exemplo:

```text
T1:
emitido no login.

T1 usado:
T1 vira ROTATED;
T2 nasce ACTIVE.

T2 usado:
T2 vira ROTATED;
T3 nasce ACTIVE.
```

Se `T1` aparecer novamente depois da rotação, existem duas possibilidades:

- um atacante copiou a credencial;
- o cliente repetiu uma request que não deveria repetir.

A aplicação não consegue distinguir com segurança.

A baseline adotará postura estrita:

```text
reuse detectado:
revogar a família inteira.
```

Assim, `T3` também deixa de funcionar.

O usuário precisará autenticar novamente.

Essa policy aumenta segurança, mas exige disciplina do cliente:

- uma troca por vez;
- sem retry cego;
- atualização atômica do token armazenado;
- descarte imediato do token antigo;
- tratamento de resposta perdida.

O endpoint será:

```http
POST /api/auth/refresh
Content-Type: application/json
```

Request:

```json
{
  "refresh_token": "valor-opaco"
}
```

Response:

```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 300,
  "refresh_token": "novo-valor-opaco",
  "refresh_token_expires_in": 604800
}
```

`refresh_token_expires_in` será uma extensão documentada da API.

Este endpoint não pretende implementar um Authorization Server OAuth 2.0 completo.

Ele aplica boas práticas de rotação e detecção de reutilização ao fluxo interno da formação.

O token será enviado explicitamente no JSON.

Ele não será colocado em cookie nesta aula.

Consequência:

```text
o browser não o anexa automaticamente;

a decisão de CSRF permanece inalterada.
```

Caso o refresh token seja migrado para cookie no futuro, será obrigatório revisar:

- CSRF;
- `HttpOnly`;
- `Secure`;
- `SameSite`;
- domínio;
- path;
- CORS;
- rotação.

O login passará a emitir:

```text
access token;

refresh token inicial.
```

A troca emitirá:

```text
novo access token;

novo refresh token.
```

Nenhuma response será cacheável.

Nenhum token completo será registrado.

A próxima aula oficial será:

```text
426 - M15.16 - Roles authorities e permissoes
```

Ela aprofundará os valores de autorização transportados pelo access token e aplicados pelo Spring Security.

---

## Onde estamos na formação

A sequência atual é:

```text
423:
JWT implementacao login.

424:
Validacao de token e filtros.

425:
Refresh token.

426:
Roles authorities e permissoes.

427:
Method Security.

428:
Autorizacao por regra de negocio.
```

A aula 424 respondeu:

```text
como validar o bearer token
em cada request protegida?
```

A aula 425 responderá:

```text
como renovar o acesso
sem reenviar password
e sem reutilizar
a mesma credencial de refresh?
```

Nesta aula:

```text
refresh token opaco:
sim.

SecureRandom:
sim.

hash persistido:
sim.

família:
sim.

rotação:
sim.

reuse detection:
sim.

lock transacional:
sim.

expiração ociosa:
sim.

expiração absoluta:
sim.

logout endpoint:
não.

cookie:
não.

Authorization Server completo:
não.

roles aprofundadas:
próxima aula.
```

A regra central será:

```text
refresh token é credencial de alto valor;

cada uso precisa invalidar o valor anterior,
emitir um substituto
e reagir a qualquer reutilização.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/resources/db/migration/
└── V9__create_refresh_token.sql
```

Domínio:

```text
domain/security/refresh/
├── RefreshTokenFamily.java
├── RefreshTokenRecord.java
└── RefreshTokenStatus.java
```

Persistência:

```text
persistence/security/refresh/
├── RefreshTokenFamilyRepository.java
└── RefreshTokenRepository.java
```

Serviços:

```text
configuration/security/refresh/
├── RefreshTokenProperties.java
├── RefreshTokenGenerator.java
├── RefreshTokenHasher.java
├── RefreshTokenService.java
├── TokenPairService.java
├── IssuedRefreshToken.java
└── RefreshRotationResult.java
```

Web:

```text
web/auth/
├── RefreshTokenController.java
├── RefreshTokenRequest.java
└── JwtTokenPairResponse.java
```

Erro público:

```text
InvalidRefreshTokenException.java
```

Teste:

```text
RefreshTokenIntegrationTest.java
```

Documentação:

```text
docs/security/M15_REFRESH_TOKEN.md
```

A aplicação demonstrará:

```text
login:
access + refresh.

refresh válido:
novo access + novo refresh.

token antigo:
inutilizado.

reuse do token antigo:
família revogada.

token expirado:
rejeitado.

usuário bloqueado:
família revogada.

requests concorrentes:
tratadas por lock.

banco:
somente hash.
```

Você irá:

1. modelar família e token;
2. criar migration;
3. gerar token opaco;
4. calcular hash;
5. persistir somente hash;
6. criar token inicial;
7. rotacionar em transação;
8. usar lock pessimista;
9. detectar reutilização;
10. revogar família;
11. aplicar expiração ociosa;
12. aplicar expiração absoluta;
13. reler estado do usuário;
14. emitir novo access token;
15. atualizar o login;
16. criar endpoint de refresh;
17. padronizar erros;
18. testar concorrência;
19. atualizar documentação;
20. preparar autorização detalhada.

---

## Conceito essencial

### Access token e refresh token possuem papéis diferentes

Access token:

```text
vai ao Resource Server;

circula em muitas requests;

possui vida curta;

carrega claims;

é validado pela public key.
```

Refresh token:

```text
vai somente ao endpoint de refresh;

circula raramente;

possui vida maior;

não precisa carregar claims;

é validado pelo estado persistido.
```

Não use o access token como refresh token.

Não envie refresh token aos endpoints de negócio.

---

### Opaque token

Um token opaco não possui informação útil para o cliente.

Exemplo conceitual:

```text
xgN8...valor-aleatorio...Q7A
```

O servidor interpreta o valor apenas por meio do hash persistido.

Benefícios:

- claims não ficam expostos;
- estado pode ser revogado;
- rotação é simples;
- formato interno pode mudar;
- não exige assinatura própria.

O token continua sendo bearer.

Quem o possui pode apresentá-lo.

TLS permanece obrigatório.

---

### Alta entropia

O gerador utilizará 32 bytes aleatórios:

```text
256 bits.
```

Depois:

```java
Base64.getUrlEncoder()
        .withoutPadding()
```

O valor terá aproximadamente 43 caracteres.

Não use:

- UUID isolado;
- timestamp;
- contador;
- username;
- combinação previsível;
- `Random`;
- token criado pelo frontend.

Use `SecureRandom`.

---

### Hash do refresh token

O banco não precisa recuperar o valor original.

Ele precisa responder:

```text
existe um registro
para este token apresentado?
```

Fluxo:

```text
token raw recebido;

SHA-256;

hexadecimal;

consulta por token_hash.
```

A alta entropia do token torna brute force offline impraticável.

Não aplique BCrypt ou Argon2id a cada refresh apenas por analogia com passwords.

Além do custo desnecessário, hashes salted dificultariam consulta direta por igualdade.

---

### Família

A família representa uma cadeia de rotação.

Campos:

```text
id;

user_id;

created_at;

absolute_expires_at;

revoked_at;

compromise_detected_at;

revocation_reason;

version.
```

A família permite:

- revogar todos os descendentes;
- registrar reuse;
- limitar duração absoluta;
- ligar a sessão ao usuário;
- auditar sem armazenar o token.

---

### Registro de token

Cada refresh token possui:

```text
id;

family_id;

token_hash;

status;

issued_at;

expires_at;

consumed_at;

revoked_at;

replaced_by_id;

version.
```

Status:

```text
ACTIVE;

ROTATED;

REVOKED;

EXPIRED.
```

Somente um token da cadeia deve permanecer ativo depois de uma rotação concluída.

---

### Rotação

Uma troca válida executa, na mesma transação:

1. calcula hash do token recebido;
2. bloqueia o registro;
3. bloqueia a família;
4. valida estado e expiração;
5. relê o usuário e authorities;
6. cria novo refresh token;
7. marca o atual como `ROTATED`;
8. liga `replaced_by_id`;
9. persiste o novo como `ACTIVE`;
10. emite novo access token;
11. confirma a transação;
12. devolve os dois tokens.

Se a transação falhar, a rotação não pode ficar pela metade.

---

### Reutilização

Um token `ROTATED` apresentado novamente indica reuse.

A reação será:

```text
marcar compromise_detected_at;

revogar a família;

revogar tokens ACTIVE da família;

registrar evento sem token;

retornar erro genérico.
```

O cliente não recebe:

- “token roubado”;
- identificador da família;
- status interno;
- hash;
- usuário.

Externamente:

```text
401 invalid_refresh_token.
```

---

### Concorrência

Duas requests podem chegar ao mesmo tempo com o mesmo token.

Sem lock:

```text
request A lê ACTIVE;

request B lê ACTIVE;

A cria T2;

B cria T3;

dois tokens ativos.
```

A solução utilizará:

```text
PESSIMISTIC_WRITE.
```

A segunda transação espera.

Depois do commit da primeira, ela enxerga:

```text
ROTATED.
```

Isso dispara reuse e revoga a família.

Essa policy também trata duplicidade acidental como risco.

O cliente deve serializar refreshes.

---

### Expiração ociosa e absoluta

Token individual:

```text
sete dias.
```

Família:

```text
trinta dias.
```

Na rotação:

```text
expires_at =
min(
    now + 7 dias,
    family.absolute_expires_at
)
```

A família não pode ser estendida indefinidamente por uso constante.

Quando o limite absoluto chega, novo login é obrigatório.

---

### Estado atual do usuário

Ao renovar, a aplicação consultará novamente:

- enabled;
- account non-expired;
- account non-locked;
- credentials non-expired;
- authorities atuais.

Se a conta estiver inválida:

```text
revogar família;

rejeitar refresh.
```

Isso reduz a janela deixada pelos access tokens self-contained.

Novas authorities entram no access token renovado.

Authorities removidas deixam de aparecer na próxima renovação.

---

### Response perdida

A rotação ocorre antes da response chegar ao cliente.

Se a rede falhar depois do commit:

- token antigo já está rotacionado;
- cliente não recebeu o novo;
- retry com o token antigo detectará reuse;
- família será revogada;
- novo login será necessário.

Essa é uma limitação conhecida da policy estrita.

Uma solução de idempotência exigiria desenho adicional e armazenamento seguro da resposta.

Ela não será improvisada nesta aula.

---

### Armazenamento no cliente

O token será devolvido no JSON.

A aplicação não decidirá automaticamente entre:

- memória;
- armazenamento seguro nativo;
- cookie;
- backend-for-frontend.

Para browser, essa decisão exige threat model específico.

O curso não recomendará salvar refresh token em `localStorage` por conveniência.

---

## Mão na massa guiada

### 1. Criar a migration V9

Arquivo:

```text
V9__create_refresh_token.sql
```

Conteúdo:

```sql
create table security_refresh_token_family (
    id uuid primary key,
    user_id uuid not null,
    created_at timestamptz not null,
    absolute_expires_at timestamptz not null,
    revoked_at timestamptz,
    compromise_detected_at timestamptz,
    revocation_reason varchar(80),
    version bigint not null default 0,

    constraint fk_refresh_family_user
        foreign key (user_id)
        references security_user (id)
        on delete cascade,

    constraint ck_refresh_family_expiration
        check (absolute_expires_at > created_at)
);

create table security_refresh_token (
    id uuid primary key,
    family_id uuid not null,
    token_hash char(64) not null,
    status varchar(20) not null,
    issued_at timestamptz not null,
    expires_at timestamptz not null,
    consumed_at timestamptz,
    revoked_at timestamptz,
    replaced_by_id uuid,
    version bigint not null default 0,

    constraint fk_refresh_token_family
        foreign key (family_id)
        references security_refresh_token_family (id)
        on delete cascade,

    constraint fk_refresh_token_replacement
        foreign key (replaced_by_id)
        references security_refresh_token (id),

    constraint ux_refresh_token_hash
        unique (token_hash),

    constraint ck_refresh_token_status
        check (
            status in (
                'ACTIVE',
                'ROTATED',
                'REVOKED',
                'EXPIRED'
            )
        ),

    constraint ck_refresh_token_expiration
        check (expires_at > issued_at)
);

create index ix_refresh_family_user
    on security_refresh_token_family (user_id);

create index ix_refresh_token_family_status
    on security_refresh_token (family_id, status);
```

A migration não insere tokens.

---

### 2. Criar RefreshTokenStatus

```java
public enum RefreshTokenStatus {
    ACTIVE,
    ROTATED,
    REVOKED,
    EXPIRED
}
```

Não use booleanos como:

```text
used;

revoked;

expired.
```

Combinações inválidas seriam possíveis.

---

### 3. Criar RefreshTokenFamily

Métodos principais:

```java
public boolean isRevoked() {
    return revokedAt != null;
}

public boolean isExpired(
        Instant now
) {
    return !absoluteExpiresAt
            .isAfter(now);
}

public void revoke(
        Instant now,
        String reason
) {
    if (revokedAt == null) {
        revokedAt = now;
        revocationReason = reason;
    }
}

public void markCompromised(
        Instant now
) {
    compromiseDetectedAt = now;
    revoke(
            now,
            "REFRESH_TOKEN_REUSE"
    );
}
```

A entidade não armazena token raw.

---

### 4. Criar RefreshTokenRecord

Métodos:

```java
public boolean isActive() {
    return status
            == RefreshTokenStatus.ACTIVE;
}

public boolean isExpired(
        Instant now
) {
    return !expiresAt.isAfter(now);
}

public void rotate(
        UUID replacementId,
        Instant now
) {
    if (!isActive()) {
        throw new IllegalStateException(
                "Refresh token is not active"
        );
    }

    status = RefreshTokenStatus.ROTATED;
    consumedAt = now;
    replacedById = replacementId;
}

public void expire(
        Instant now
) {
    status = RefreshTokenStatus.EXPIRED;
    consumedAt = now;
}

public void revoke(
        Instant now
) {
    status = RefreshTokenStatus.REVOKED;
    revokedAt = now;
}
```

---

### 5. Criar RefreshTokenGenerator

```java
@Component
public class RefreshTokenGenerator {

    private static final int TOKEN_BYTES =
            32;

    private final SecureRandom secureRandom =
            new SecureRandom();

    public String generate() {
        byte[] value =
                new byte[TOKEN_BYTES];

        secureRandom.nextBytes(value);

        return Base64
                .getUrlEncoder()
                .withoutPadding()
                .encodeToString(value);
    }
}
```

Não registre `value` ou o retorno.

---

### 6. Criar RefreshTokenHasher

```java
@Component
public class RefreshTokenHasher {

    public String hash(
            String rawToken
    ) {
        if (
            rawToken == null
            || rawToken.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Refresh token is required"
            );
        }

        try {
            MessageDigest digest =
                    MessageDigest.getInstance(
                            "SHA-256"
                    );

            byte[] hash =
                    digest.digest(
                            rawToken.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            return HexFormat.of()
                    .formatHex(hash);
        }
        catch (
            NoSuchAlgorithmException exception
        ) {
            throw new IllegalStateException(
                    "SHA-256 is not available",
                    exception
            );
        }
    }
}
```

A exception não inclui o token.

---

### 7. Criar RefreshTokenProperties

Prefixo:

```text
app.security.refresh-token.
```

Campos:

```java
private boolean enabled;

@NotNull
private Duration tokenTtl =
        Duration.ofDays(7);

@NotNull
private Duration familyTtl =
        Duration.ofDays(30);
```

Validação:

```text
token TTL:
entre uma hora e sete dias.

family TTL:
maior ou igual ao token TTL;
máximo de noventa dias.
```

A baseline usa sete e trinta dias.

---

### 8. Criar repositories com lock

Token:

```java
public interface RefreshTokenRepository
        extends JpaRepository<
                RefreshTokenRecord,
                UUID
        > {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select token
            from RefreshTokenRecord token
            where token.tokenHash = :tokenHash
            """)
    Optional<RefreshTokenRecord>
    findByHashForUpdate(
            String tokenHash
    );

    @Modifying
    @Query("""
            update RefreshTokenRecord token
            set token.status =
                br.com.formacao.backend.domain.security.refresh.RefreshTokenStatus.REVOKED,
                token.revokedAt = :now
            where token.familyId = :familyId
              and token.status =
                br.com.formacao.backend.domain.security.refresh.RefreshTokenStatus.ACTIVE
            """)
    int revokeActiveByFamily(
            UUID familyId,
            Instant now
    );
}
```

Família:

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("""
        select family
        from RefreshTokenFamily family
        where family.id = :id
        """)
Optional<RefreshTokenFamily>
findByIdForUpdate(UUID id);
```

---

### 9. Criar token inicial

O login já possui `DatabaseUserPrincipal`.

No `RefreshTokenService`:

```java
@Transactional
public IssuedRefreshToken issueInitial(
        UUID userId
) {
    Instant now = clock.instant();

    RefreshTokenFamily family =
            RefreshTokenFamily.create(
                    userId,
                    now,
                    now.plus(
                            properties.getFamilyTtl()
                    )
            );

    String raw =
            generator.generate();

    RefreshTokenRecord token =
            RefreshTokenRecord.active(
                    family.getId(),
                    hasher.hash(raw),
                    now,
                    minimum(
                            now.plus(
                                    properties.getTokenTtl()
                            ),
                            family
                                    .getAbsoluteExpiresAt()
                    )
            );

    familyRepository.save(family);
    tokenRepository.save(token);

    return new IssuedRefreshToken(
            raw,
            Duration.between(
                    now,
                    token.getExpiresAt()
            )
    );
}
```

O record de retorno existe apenas em memória.

---

### 10. Criar rotação transacional

Estrutura principal:

```java
@Transactional
public RefreshRotationResult rotate(
        String rawToken
) {
    Instant now =
            clock.instant();

    String hash =
            hasher.hash(rawToken);

    RefreshTokenRecord current =
            tokenRepository
                    .findByHashForUpdate(hash)
                    .orElseThrow(
                            InvalidRefreshTokenException
                                    ::new
                    );

    RefreshTokenFamily family =
            familyRepository
                    .findByIdForUpdate(
                            current.getFamilyId()
                    )
                    .orElseThrow(
                            InvalidRefreshTokenException
                                    ::new
                    );

    if (family.isRevoked()) {
        throw new InvalidRefreshTokenException();
    }

    if (
        current.getStatus()
                == RefreshTokenStatus.ROTATED
    ) {
        family.markCompromised(now);

        tokenRepository
                .revokeActiveByFamily(
                        family.getId(),
                        now
                );

        throw new InvalidRefreshTokenException();
    }

    if (
        !current.isActive()
        || current.isExpired(now)
        || family.isExpired(now)
    ) {
        expireOrRevoke(
                current,
                family,
                now
        );

        throw new InvalidRefreshTokenException();
    }
```

Continue com o usuário:

```java
    ApplicationUser user =
            userRepository
                    .findByIdWithAuthorities(
                            family.getUserId()
                    )
                    .orElseThrow(
                            InvalidRefreshTokenException
                                    ::new
                    );

    if (!canAuthenticate(user)) {
        family.revoke(
                now,
                "ACCOUNT_NOT_ELIGIBLE"
        );

        tokenRepository
                .revokeActiveByFamily(
                        family.getId(),
                        now
                );

        throw new InvalidRefreshTokenException();
    }

    String nextRaw =
            generator.generate();

    RefreshTokenRecord next =
            RefreshTokenRecord.active(
                    family.getId(),
                    hasher.hash(nextRaw),
                    now,
                    minimum(
                            now.plus(
                                    properties.getTokenTtl()
                            ),
                            family
                                    .getAbsoluteExpiresAt()
                    )
            );

    current.rotate(
            next.getId(),
            now
    );

    tokenRepository.save(next);

    DatabaseUserPrincipal principal =
            DatabaseUserPrincipal.from(user);

    Authentication authentication =
            UsernamePasswordAuthenticationToken
                    .authenticated(
                            principal,
                            null,
                            principal.getAuthorities()
                    );

    return new RefreshRotationResult(
            authentication,
            nextRaw,
            Duration.between(
                    now,
                    next.getExpiresAt()
            )
    );
}
```

O método inteiro permanece transacional.

---

### 11. Criar TokenPairService

```java
@Service
public class TokenPairService {

    private final JwtTokenService
            jwtTokenService;

    private final RefreshTokenService
            refreshTokenService;

    public JwtTokenPairResponse issueInitial(
            Authentication authentication
    ) {
        DatabaseUserPrincipal principal =
                requirePrincipal(
                        authentication
                );

        IssuedRefreshToken refresh =
                refreshTokenService
                        .issueInitial(
                                principal.getUserId()
                        );

        return response(
                jwtTokenService.issue(
                        authentication
                ),
                refresh.rawToken(),
                refresh.expiresIn()
        );
    }

    public JwtTokenPairResponse refresh(
            String rawRefreshToken
    ) {
        RefreshRotationResult rotation =
                refreshTokenService.rotate(
                        rawRefreshToken
                );

        return response(
                jwtTokenService.issue(
                        rotation.authentication()
                ),
                rotation.rawToken(),
                rotation.expiresIn()
        );
    }
}
```

A response recebe tokens somente no último momento.

---

### 12. Atualizar o login

O `JwtLoginController` troca:

```java
tokenService.issue(authentication)
```

por:

```java
tokenPairService.issueInitial(
        authentication
)
```

A response agora inclui o refresh token.

Preserve:

```text
Cache-Control: no-store;

Pragma: no-cache.
```

---

### 13. Criar RefreshTokenRequest

```java
public record RefreshTokenRequest(

        @JsonProperty("refresh_token")
        @NotBlank
        @Size(
            min = 40,
            max = 200
        )
        String refreshToken

) {
}
```

Não sobrescreva `toString()`.

Não registre o request.

---

### 14. Criar RefreshTokenController

```java
@RestController
@RequestMapping("/api/auth")
@ConditionalOnProperty(
        prefix =
                "app.security.refresh-token",
        name = "enabled",
        havingValue = "true"
)
public class RefreshTokenController {

    private final TokenPairService
            tokenPairService;

    public RefreshTokenController(
            TokenPairService tokenPairService
    ) {
        this.tokenPairService =
                tokenPairService;
    }

    @PostMapping("/refresh")
    ResponseEntity<JwtTokenPairResponse>
    refresh(
            @Valid
            @RequestBody
            RefreshTokenRequest request
    ) {
        return ResponseEntity
                .ok()
                .cacheControl(
                        CacheControl.noStore()
                )
                .header(
                        HttpHeaders.PRAGMA,
                        "no-cache"
                )
                .body(
                        tokenPairService.refresh(
                                request.refreshToken()
                        )
                );
    }
}
```

---

### 15. Liberar somente o endpoint exato

Na API chain:

```java
.requestMatchers(
        HttpMethod.POST,
        "/api/auth/login",
        "/api/auth/refresh"
)
.permitAll()
```

Não use:

```text
/api/auth/**.
```

O endpoint de refresh autentica pela credencial no body.

---

### 16. Padronizar erro público

`InvalidRefreshTokenException`:

```java
public final class
        InvalidRefreshTokenException
        extends RuntimeException {

    public InvalidRefreshTokenException() {
        super(
                "The refresh token is invalid"
        );
    }
}
```

Problem Details:

```text
status:
401.

code:
invalid_refresh_token.

detail:
The refresh token is invalid.

cache:
no-store.

WWW-Authenticate:
ausente.
```

Não revele:

- expired;
- reused;
- revoked;
- user disabled;
- family missing.

---

### 17. Configurar o profile

Em `application-jwt-lab.yaml`:

```yaml
app:
  security:
    refresh-token:
      enabled: true
      token-ttl: 7d
      family-ttl: 30d
```

A configuração base mantém:

```yaml
enabled: false
```

quando JWT não está ativo.

---

### 18. Testar login com refresh

Cenário:

1. faça login;
2. leia os dois campos sem imprimi-los;
3. valide `expires_in=300`;
4. valide `refresh_token_expires_in=604800`;
5. consulte o banco;
6. confirme uma família;
7. confirme um token `ACTIVE`;
8. confirme que o valor raw não existe no banco;
9. confirme hash de 64 caracteres.

---

### 19. Testar rotação

Use o refresh token inicial.

Espere:

```text
200;

novo access token;

novo refresh token;

novo refresh diferente.
```

No banco:

```text
T1:
ROTATED;
consumed_at preenchido;
replaced_by_id = T2.

T2:
ACTIVE.
```

Use T2 uma vez e confirme a próxima rotação.

---

### 20. Testar reuse

Depois de T1 virar `ROTATED`, apresente T1 novamente.

Espere:

```text
401 invalid_refresh_token.
```

No banco:

```text
family.revoked_at:
preenchido.

family.compromise_detected_at:
preenchido.

T2:
REVOKED.
```

Tente usar T2.

Ele também deve falhar.

---

### 21. Testar expiração

Crie uma família e token com clock controlado.

Avance além de:

```text
token TTL:
token rejeitado.

family TTL:
família rejeitada.
```

Token expirado não precisa ser classificado como compromise.

Valide estado `EXPIRED` ou revogação documentada.

---

### 22. Testar usuário bloqueado

1. emita refresh;
2. bloqueie o usuário;
3. tente renovar.

Resultado:

```text
401 invalid_refresh_token;

família revogada;

nenhum access token.
```

Repita para conta desabilitada.

---

### 23. Testar concorrência

Use duas threads e uma barreira para apresentar o mesmo token.

A suíte deve comprovar:

- não existem dois tokens ativos;
- uma transação rotaciona;
- a outra detecta reuse;
- a família termina revogada;
- o cliente precisa de novo login.

Esse teste documenta a policy estrita.

---

### 24. Testar separação de credenciais

Cenários:

```text
access token enviado como refresh:
401.

refresh token enviado como Bearer:
401 invalid_token.

refresh token em query:
endpoint não utiliza.

GET /api/auth/refresh:
405.
```

Access e refresh tokens não são intercambiáveis.

---

### 25. Testar cache e sessão

Login e refresh:

```text
Cache-Control:
no-store.

Pragma:
no-cache.

Set-Cookie:
ausente.
```

Nenhum `JSESSIONID` é criado.

---

### 26. Executar a suíte

```powershell
.\mvnw.cmd `
  -Dtest=RefreshTokenIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- PostgreSQL real;
- migration V9;
- token raw fora do banco;
- lock funcionando;
- rotação;
- reuse;
- expiração;
- usuário bloqueado;
- nenhum token em logs.

---

### 27. Executar no laboratório local

Faça login e mantenha os tokens apenas em variáveis PowerShell.

Troque:

```powershell
$refreshBody =
  @{
    refresh_token =
      $response.refresh_token
  } |
  ConvertTo-Json

$rotated =
  Invoke-RestMethod `
    -Method Post `
    -Uri "http://localhost:8081/api/auth/refresh" `
    -ContentType "application/json" `
    -Body $refreshBody
```

Substitua imediatamente a referência local:

```powershell
$response.refresh_token =
  $null

$accessToken =
  $rotated.access_token

$refreshToken =
  $rotated.refresh_token
```

Não imprima os valores.

---

### 28. Atualizar OpenAPI

Documente:

```text
POST /api/auth/login:
retorna token pair.

POST /api/auth/refresh:
público;
recebe refresh token;
retorna token pair;
401 invalid_refresh_token;
no-store.

endpoints de negócio:
bearer access token.
```

Declare que `refresh_token_expires_in` é extensão da API.

Não crie um security scheme para refresh token.

---

### 29. Atualizar documentação e riscos

Crie:

```text
docs/security/M15_REFRESH_TOKEN.md
```

Registre:

- token opaco;
- entropia;
- hash;
- família;
- estados;
- rotação;
- reuse;
- lock;
- TTL ocioso;
- TTL absoluto;
- account state;
- response perdida;
- storage do cliente;
- rate limiting;
- testes;
- produção NO-GO.

Adicione ao threat model:

```text
THR-050:
refresh token raw armazenado no banco.

THR-051:
dois refreshes concorrentes geram descendentes.

THR-052:
token rotacionado é reutilizado.

THR-053:
família nunca expira.

THR-054:
refresh token aparece em log.

THR-055:
conta bloqueada continua renovando.

THR-056:
refresh token é enviado como bearer.

THR-057:
retry cego revoga sessão legítima.
```

Atualize:

- baseline;
- OWASP;
- JWT concepts;
- JWT login;
- Resource Server;
- OpenAPI;
- collection.

A coleção não deve salvar tokens reais em arquivo versionado.

---

## Entendendo o que foi feito

### O access token continuou curto

Renovação não exigiu aumentar seu TTL.

### O refresh token ficou opaco

Nenhuma claim foi exposta.

### O banco guardou somente hash

Um dump não entrega diretamente a credencial.

### Cada uso criou um substituto

O token anterior não permaneceu válido.

### A família permitiu reação

Reuse revogou toda a cadeia.

### O lock impediu dois descendentes silenciosos

Concorrência passou a ter resultado determinístico.

### O usuário foi relido

Bloqueios e authorities atuais influenciam a renovação.

### A sessão ganhou limite absoluto

Uso contínuo não cria validade infinita.

---

## Erros comuns importantes

### Usar JWT como refresh token sem necessidade

Estado e rotação continuam necessários.

### Armazenar refresh token em texto

Um vazamento entrega sessões renováveis.

### Usar UUID como token

A entropia e o formato não foram desenhados para isso.

### Não rotacionar

Um token roubado pode ser reutilizado silenciosamente.

### Rotacionar sem lock

Requests concorrentes podem gerar dois tokens ativos.

### Ignorar reuse

O comprometimento não produz reação.

### Estender a família para sempre

A sessão nunca exige nova autenticação.

### Logar request de refresh

O body contém a credencial.

### Usar cookie sem revisar CSRF

Credencial automática muda o threat model.

### Retentar cegamente

A policy estrita pode revogar a família legítima.

---

## Comandos úteis

### Verificar migration

```powershell
Get-Content `
  "src/main/resources/db/migration/V9__create_refresh_token.sql"
```

### Teste focado

```powershell
.\mvnw.cmd `
  -Dtest=RefreshTokenIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar tokens em logs

```powershell
git grep `
  -n `
  -E `
  "refresh_token.*[A-Za-z0-9_-]{30,}"
```

### Consultar sem hash

```sql
select
    family_id,
    status,
    issued_at,
    expires_at,
    consumed_at,
    revoked_at
from
    security_refresh_token;
```

---

## Exercício guiado

### Parte 1 — Schema

Crie família, token, status e constraints.

### Parte 2 — Geração

Use 32 bytes de `SecureRandom`.

### Parte 3 — Hash

Persista somente SHA-256 hexadecimal.

### Parte 4 — Emissão inicial

Associe o token ao login autenticado.

### Parte 5 — Rotação

Invalide o atual e crie o próximo.

### Parte 6 — Reuse

Revogue a família ao reutilizar token rotacionado.

### Parte 7 — Concorrência

Use lock pessimista e teste duas requests.

### Parte 8 — Estado

Releia usuário e authorities.

### Parte 9 — Contrato

Retorne token pair com `no-store`.

### Parte 10 — Segurança

Atualize OpenAPI, threat model e documentação.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 424 foi preservada;
- access e refresh token foram diferenciados;
- refresh token foi definido como credencial opaca;
- JWT não foi reutilizado como refresh token;
- `SecureRandom` e 32 bytes foram usados;
- Base64URL sem padding foi usada;
- token previsível e `Random` foram rejeitados;
- banco persiste somente SHA-256;
- diferença entre hash de password e token aleatório foi explicada;
- migration V9 foi criada;
- família e registro de token foram modelados;
- FK, unique hash, status e constraints foram criados;
- migration não inseriu tokens;
- estados `ACTIVE`, `ROTATED`, `REVOKED` e `EXPIRED` foram usados;
- token inicial foi emitido no login;
- token TTL de sete dias foi configurado;
- família TTL de trinta dias foi configurada;
- limite absoluto foi preservado na rotação;
- rotação ocorre em transação;
- registro e família usam lock;
- token atual é marcado `ROTATED`;
- `replaced_by_id` liga o substituto;
- somente um descendente é criado por uso;
- reuse marca compromise e revoga a família;
- tokens ativos da família são revogados;
- erro público não revela estado interno;
- usuário e authorities são relidos;
- conta inválida revoga a família;
- novo access token usa authorities atuais;
- response perdida e retry cego foram documentados;
- token raw existe somente em memória e response;
- `TokenPairService` coordena access e refresh;
- login passou a retornar token pair;
- endpoint exato `/api/auth/refresh` foi criado;
- wildcard `/api/auth/**` não foi usado;
- request possui validação de tamanho;
- request e response não são logados;
- `Cache-Control: no-store` e `Pragma: no-cache` foram usados;
- cookies e sessão não foram criados;
- CSRF não foi alterado sem cookie;
- login inicial foi testado;
- banco não contém token raw;
- rotação foi testada;
- token antigo foi invalidado;
- reuse revogou o substituto;
- expiração ociosa e absoluta foram testadas;
- conta bloqueada e desabilitada foram testadas;
- concorrência não produziu dois tokens ativos;
- access token não funciona como refresh;
- refresh token não funciona como bearer;
- GET no endpoint foi rejeitado;
- PostgreSQL real e Flyway V9 foram usados;
- token não apareceu em logs, reports ou collection;
- OpenAPI recebeu login e refresh;
- `refresh_token_expires_in` foi documentado como extensão;
- threat model e documentos de segurança foram atualizados;
- produção pública permaneceu NO-GO;
- logout endpoint não foi antecipado;
- próxima aula correta é Roles authorities e permissoes;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git grep -n -E "refresh_token.*[A-Za-z0-9_-]{30,}"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m15): rotacionar refresh tokens com reuse detection"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- refresh token raw;
- access token;
- token hash em evidência desnecessária;
- Authorization header;
- password;
- private key;
- env file;
- body de login;
- body de refresh;
- collection com credenciais;
- log de reuse com dados sensíveis.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a autenticação ganhou renovação controlada.

O fluxo ficou:

```text
login
-> access token curto
-> refresh token opaco inicial

refresh válido
-> lock
-> validação de família
-> leitura do usuário
-> rotação
-> novo access token
-> novo refresh token
```

O banco armazena:

```text
família;

status;

tempos;

ligações;

hash.
```

Ele não armazena:

```text
refresh token raw;

access token;

password.
```

A policy adotada foi:

```text
um uso;

uma rotação;

reuse revoga a família;

sete dias de ociosidade;

trinta dias absolutos.
```

A decisão central foi:

```text
refresh token não deve ser
uma credencial permanente e reutilizável;

ele precisa ser opaco,
persistido somente por hash,
rotacionado sob lock
e acompanhado por detecção de reuse.
```

O access token já transporta:

- roles;
- authorities;
- permissions.

Na próxima aula, esses conceitos deixarão de ser apenas strings carregadas no token e serão organizados como uma política de autorização clara.

A próxima aula será:

```text
426 - M15.16 - Roles authorities e permissoes
```

Nela, você irá:

- diferenciar role, authority e permission;
- entender o prefixo `ROLE_`;
- definir nomenclatura;
- separar coarse-grained e fine-grained authorization;
- mapear authorities persistidas;
- aplicar regras por endpoint;
- evitar superusuários genéricos;
- testar matriz de acesso;
- preparar Method Security.

---

# Material complementar

## Checkpoint final

- [ ] Criei refresh token opaco de alta entropia.
- [ ] Armazenei somente hash.
- [ ] Implementei rotação transacional.
- [ ] Detectei reuse e revoguei a família.
- [ ] Testei expiração, concorrência e estado da conta.

---

## Troubleshooting adicional

### O refresh válido retorna 401

Confirme:

- hash;
- status `ACTIVE`;
- família não revogada;
- clocks;
- usuário elegível;
- profile;
- transaction.

### Existem dois tokens ativos

Revise o lock pessimista, a transação e a ordem de persistência.

### Reuse não revoga o substituto

Confirme o update por `family_id` e status `ACTIVE`.

### O hash não possui 64 caracteres

Confirme SHA-256 e representação hexadecimal.

### O token ficou salvo no banco

A entity deve receber apenas o hash.

Revise DTOs, logs e migrations.

### A segunda request concorrente revoga tudo

Esse é o comportamento estrito definido.

O cliente não deve enviar refreshes simultâneos.

### Token expirado foi marcado como compromise

Separe expiração normal de reuse de token rotacionado.

### Refresh em cookie funcionou sem mudança

Não introduza cookie nesta aula.

Ele exige revisão de CSRF e CORS.

---

## Perguntas de revisão

1. Qual é o papel do access token?
2. Qual é o papel do refresh token?
3. O refresh token precisa ser JWT?
4. Quantos bytes aleatórios foram usados?
5. Qual classe gera os bytes?
6. O que é persistido no banco?
7. Por que SHA-256 é aceitável aqui?
8. O que é uma família?
9. O que significa rotação?
10. Qual status fica no token usado?
11. O que acontece no reuse?
12. Para que serve o lock?
13. Qual é o TTL do token?
14. Qual é o TTL da família?
15. O usuário é relido no refresh?
16. Refresh token pode ir como bearer?
17. Ele foi colocado em cookie?
18. O endpoint é um Authorization Server completo?
19. Qual é a próxima aula?
20. O que ela aprofundará?

---

## Roteiro de resposta

1. Autorizar requests por pouco tempo.
2. Obter novos tokens sem password.
3. Não.
4. 32 bytes.
5. `SecureRandom`.
6. SHA-256 do token.
7. O token possui alta entropia aleatória.
8. A cadeia de tokens rotacionados.
9. Invalidar o atual e emitir outro.
10. `ROTATED`.
11. A família é revogada.
12. Impedir descendentes concorrentes.
13. Sete dias.
14. Trinta dias.
15. Sim.
16. Não.
17. Não.
18. Não.
19. Roles authorities e permissoes.
20. A política de autorização.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 425 - M15.15 - Refresh token

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei access token e refresh token.
- Escolhi refresh token opaco.
- Gereei 32 bytes com `SecureRandom`.
- Codifiquei com Base64URL sem padding.
- Persisti somente SHA-256.
- Diferenciei hash de token aleatório e password humana.
- Criei a migration `V9__create_refresh_token.sql`.
- Modelei família e registro de refresh token.
- Criei os estados ACTIVE, ROTATED, REVOKED e EXPIRED.
- Defini TTL ocioso de sete dias.
- Defini limite absoluto de trinta dias.
- Criei `RefreshTokenGenerator`.
- Criei `RefreshTokenHasher`.
- Criei repositories com lock pessimista.
- Emitei refresh token inicial no login.
- Criei `TokenPairService`.
- Alterei o login para retornar access e refresh token.
- Criei `POST /api/auth/refresh`.
- Mantive o endpoint público exato.
- Implementei rotação transacional.
- Marquei o token usado como ROTATED.
- Liguei o token substituto por `replaced_by_id`.
- Detectei reuse de token antigo.
- Revoguei toda a família em reuse.
- Reli usuário e authorities na renovação.
- Revoguei a família para conta inválida.
- Não criei dois tokens ativos em concorrência.
- Documentei a consequência de response perdida.
- Mantive refresh token fora de cookie e sessão.
- Preservei a decisão atual de CSRF.
- Usei `no-store` e `no-cache`.
- Testei login, rotação, reuse, expiração e concorrência.
- Testei access token como refresh e refresh como bearer.
- Não salvei tokens em logs ou collection.
- Criei `docs/security/M15_REFRESH_TOKEN.md`.
- Atualizei OpenAPI, baseline, threat model e OWASP.
- Mantive produção pública como NO-GO.
- Próxima aula: Roles authorities e permissoes.
```

---

## Referência técnica curta

- [RFC 6749 — OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html)
- [RFC 9700 — Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)
- [RFC 7009 — OAuth 2.0 Token Revocation](https://www.rfc-editor.org/rfc/rfc7009.html)
- [Spring Authorization Server — Core Model and Components](https://docs.spring.io/spring-authorization-server/reference/core-model-components.html)
- [Spring Authorization Server — JPA Core Services Guide](https://docs.spring.io/spring-authorization-server/reference/guides/how-to-jpa.html)
- [Java — SecureRandom](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/security/SecureRandom.html)

Regra final:

```text
refresh tokens precisam ser tratados como credenciais de longa duração e alto impacto: nesta baseline, cada valor é opaco, possui 256 bits de entropia, aparece somente na response e no cliente, é persistido apenas por SHA-256, pertence a uma família com limite absoluto, pode ser usado uma única vez e é substituído sob transação e lock; qualquer reutilização de token rotacionado revoga a família, tokens expirados não são confundidos com compromise, o estado atual do usuário é relido antes da renovação e o cliente precisa serializar refreshes e substituir o token de forma atômica.
```
