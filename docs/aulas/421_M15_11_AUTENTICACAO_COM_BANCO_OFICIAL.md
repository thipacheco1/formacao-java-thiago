# 421 - M15.11 - Autenticacao com banco

## Apresentação da aula

Na aula 420, a aplicação autenticou sua primeira identidade real.

O fluxo executado foi:

```text
Authorization Basic;

BasicAuthenticationFilter;

AuthenticationManager;

DaoAuthenticationProvider;

InMemoryUserDetailsManager;

PasswordEncoder.matches;

SecurityContext;

AuthorizationFilter;

controller.
```

A API passou a diferenciar:

```text
sem credencial:
401.

credencial inválida:
401.

credencial válida:
200.

identidade sem role:
403.
```

O usuário, entretanto, continuou temporário.

Ele era reconstruído a partir de configuração e existia apenas na memória da instância.

Essa abordagem foi adequada para visualizar a arquitetura, mas não atende um sistema que precisa administrar contas ao longo do tempo.

A pergunta central desta aula será:

```text
como carregar uma conta persistida
no PostgreSQL,
preservar flags e authorities
e autenticar pelo fluxo padrão
do Spring Security?
```

A solução utilizará:

```text
Flyway;

PostgreSQL;

JPA;

repository;

UserDetailsService;

DatabaseUserPrincipal;

DaoAuthenticationProvider;

DelegatingPasswordEncoder;

Argon2id;

BCrypt para compatibilidade;

HTTP Basic como transporte didático.
```

A origem da identidade mudará de `InMemoryUserDetailsManager` para `DatabaseUserDetailsService -> ApplicationUserRepository -> PostgreSQL`. O HTTP Basic será mantido temporariamente para isolar essa mudança.

Não serão introduzidos ainda:

- JWT;
- endpoint de login que emite token;
- refresh token;
- cadastro público;
- recuperação de senha;
- troca de senha;
- autorização por objeto;
- gestão administrativa de contas.

Esses assuntos possuem etapas próprias.

A modelagem utilizará duas tabelas:

```text
security_user;

security_user_authority.
```

A tabela principal armazenará:

- identificador UUID;
- username de exibição;
- username normalizado;
- password hash;
- flags de conta;
- timestamps;
- versão otimista.

A tabela de authorities armazenará:

- vínculo com usuário;
- authority textual;
- chave primária composta.

Nenhuma coluna armazenará:

- senha em texto puro;
- salt separado;
- pepper;
- token;
- credencial reversível.

O password hash seguirá formato versionado:

```text
{argon2}$argon2id$...

{bcrypt}$2...
```

Novos usuários persistidos usarão:

```text
Argon2id.
```

Hashes BCrypt continuarão verificáveis para compatibilidade.

A entidade JPA não implementará `UserDetails`.

Essa decisão mantém o domínio de persistência independente do framework de segurança.

Um adaptador chamado:

```text
DatabaseUserPrincipal
```

implementará `UserDetails` e `CredentialsContainer`.

Ele receberá somente os dados necessários à autenticação.

Depois do sucesso, as credentials poderão ser apagadas do principal.

O username será case-insensitive. A aplicação preservará o valor de exibição e armazenará uma versão com `trim` e lowercase em `Locale.ROOT`, protegida por índice único. Regras Unicode mais complexas exigem política própria.

O laboratório utilizará um profile:

```text
db-auth-lab.
```

Um initializer condicionado ao profile poderá criar um usuário sintético quando ele ainda não existir.

O username e o hash chegarão por variáveis de ambiente.

O initializer não recebe senha em texto puro, não atualiza hash silenciosamente, não imprime credenciais e não roda fora do profile.

Os testes de integração criarão usuários diretamente pelo repository e autenticarão com `httpBasic`.

Cenários:

- usuário ativo;
- username com caixa diferente;
- password inválida;
- usuário inexistente;
- usuário desabilitado;
- conta bloqueada;
- credentials expiradas;
- authorities carregadas;
- `403` por role ausente;
- ausência de hash na response;
- ausência de sessão.

A próxima aula será:

```text
422 - M15.12 - JWT conceitos header payload signature
```

Por isso, esta aula termina com autenticação persistida por username e password.

Nenhum token será emitido.

---

## Onde estamos na formação

A sequência atual é:

```text
419:
SecurityFilterChain.

420:
Login basico usuario em memoria.

421:
Autenticacao com banco.

422:
JWT conceitos header payload signature.

423:
JWT implementacao login.

424:
JWT filtro por request.
```

A aula 420 respondeu:

```text
como autenticar
um usuário temporário em memória?
```

A aula 421 responderá:

```text
como autenticar
uma conta persistida
sem acoplar a entidade JPA
ao Spring Security?
```

Nesta aula:

```text
migration:
sim.

entidade de usuário:
sim.

authorities persistidas:
sim.

flags de conta:
sim.

UserDetailsService:
sim.

principal adaptador:
sim.

Argon2id:
sim.

BCrypt legado:
sim.

HTTP Basic:
mantido no laboratório.

JWT:
não.

cadastro público:
não.

recuperação:
não.

autorização fina:
não.
```

A regra central será:

```text
o banco guarda
estado e verificadores;

o UserDetailsService
carrega a conta;

o provider valida a senha;

o principal adapta os dados
ao framework.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/resources/db/migration/
└── V8__create_security_user.sql
```

Domínio e persistência:

```text
src/main/java/br/com/formacao/backend
├── domain
│   └── security
│       ├── ApplicationUser.java
│       └── UsernameNormalizer.java
└── persistence
    └── security
        └── ApplicationUserRepository.java
```

Integração Spring Security:

```text
configuration/security/
├── DatabaseAuthenticationProperties.java
├── DatabaseAuthenticationConfiguration.java
├── DatabaseAuthenticationLabInitializer.java
├── DatabaseUserDetailsService.java
├── DatabaseUserPrincipal.java
└── HttpBasicAuthenticationProperties.java
```

Arquivos removidos ou substituídos:

```text
BasicAuthenticationProperties.java;

InMemoryBasicAuthenticationConfiguration.java;

application-basic-lab.yaml.
```

Novo profile:

```text
application-db-auth-lab.yaml
```

Teste:

```text
DatabaseAuthenticationIntegrationTest.java
```

Documentação:

```text
docs/security/M15_DATABASE_AUTHENTICATION.md
```

A aplicação demonstrará:

```text
conta persistida:
autentica.

password errada:
401.

conta ausente:
401.

conta desabilitada:
401.

conta bloqueada:
401.

credentials expiradas:
401.

role ausente:
403.

restart:
conta permanece no banco.
```

Você irá:

1. criar a migration;
2. modelar a entidade;
3. normalizar username;
4. persistir authorities;
5. criar repository;
6. criar principal adaptador;
7. implementar `UserDetailsService`;
8. configurar encoders;
9. configurar `DaoAuthenticationProvider`;
10. configurar `AuthenticationManager`;
11. separar HTTP Basic da origem do usuário;
12. remover autenticação em memória;
13. criar bootstrap de laboratório;
14. criar profile;
15. criar testes de repository;
16. criar testes de autenticação;
17. validar flags;
18. executar com Compose;
19. atualizar segurança;
20. preparar JWT conceitual.

---

## Conceito essencial

### Persistência não deve conhecer o protocolo

A entidade de usuário representa estado persistente.

Ela precisa conhecer:

- username;
- hash;
- authorities;
- flags;
- timestamps;
- versão.

Ela não precisa conhecer:

- HTTP Basic;
- bearer token;
- `Authentication`;
- `SecurityContext`;
- `UserDetails`.

Se a entity implementar diretamente `UserDetails`, o domínio fica acoplado à framework.

Isso pode funcionar em projetos pequenos, mas reduz clareza e aumenta impacto de mudanças.

Nesta formação, será usado um adaptador.

---

### UserDetailsService é uma porta de leitura

O contrato possui uma operação central:

```java
UserDetails loadUserByUsername(
        String username
);
```

Ele deve:

1. normalizar o identificador;
2. consultar o repository;
3. carregar authorities;
4. mapear para `UserDetails`;
5. lançar `UsernameNotFoundException` quando ausente.

Ele apenas carrega e adapta a conta; não compara password, cria sessão, emite token, decide autorização ou expõe a entity.

A comparação continua no `DaoAuthenticationProvider` por meio de `PasswordEncoder`.

---

### DaoAuthenticationProvider

O provider recebe:

- `UserDetailsService`;
- `PasswordEncoder`.

Fluxo:

```text
username/password token;

loadUserByUsername;

UserDetails;

verificação das flags;

PasswordEncoder.matches;

Authentication autenticada.
```

O Spring Security oculta por padrão a diferença entre usuário ausente e password inválida no contrato externo.

A API continuará retornando:

```text
401 authentication_required.
```

---

### Username normalizado

Username é um identificador de segurança.

A comparação precisa ser previsível.

A policy desta aula será:

```text
trim;

lowercase com Locale.ROOT;

não vazio;

máximo 120 caracteres.
```

O valor original será preservado para exibição.

O banco terá índice único sobre:

```text
username_normalized.
```

A aplicação não pode depender apenas de:

```java
equalsIgnoreCase
```

em memória.

A unicidade precisa ser garantida transacionalmente pelo banco.

---

### Authorities persistidas

Uma conta pode possuir mais de uma authority.

Exemplos:

```text
ROLE_OPERATOR;

service-order:read;

service-order:write.
```

A tabela de associação evita colunas como:

```text
is_admin;

can_read;

can_write;

can_delete.
```

Esse modelo é extensível e compatível com `GrantedAuthority`.

A existência da authority no banco não define automaticamente sua aplicação.

As regras de autorização ainda precisam referenciá-la.

---

### Flags de conta

`UserDetails` expõe:

```text
enabled;

accountNonExpired;

accountNonLocked;

credentialsNonExpired.
```

Nesta modelagem, o banco armazenará valores positivos:

```text
enabled;

account_non_expired;

account_non_locked;

credentials_non_expired.
```

Isso reduz inversões como:

```text
disabled;

expired;

locked.
```

Uma conta pode falhar na autenticação mesmo com password correta quando uma flag não permite acesso.

O contrato público permanece genérico.

---

### Password hash persistido

A coluna armazenará:

```text
password_hash.
```

Formato:

```text
{algoritmo}representação.
```

Exemplos:

```text
{argon2}$argon2id$...

{bcrypt}$2a$...
```

O `DelegatingPasswordEncoder` lê o prefixo.

Novos hashes usam Argon2id.

BCrypt legado continua verificável.

O banco não armazena salt separado porque o formato codificado já o contém.

---

### Argon2id em runtime

Na aula 417, Bouncy Castle estava apenas nos testes.

Agora o `Argon2PasswordEncoder` será utilizado em runtime.

A dependency:

```text
bcprov-jdk18on
```

sairá de test scope.

Isso aumenta a superfície de supply chain.

A revisão precisa registrar:

- dependency runtime;
- versão gerenciada;
- SCA;
- SBOM;
- atualização;
- CVEs.

---

### Algorithm agility

O `DelegatingPasswordEncoder` usará Argon2id para novos hashes e manterá BCrypt para formatos legados. A migração oportunista com `upgradeEncoding` ficará para uma etapa futura.

---

### Fetch de authorities

`authorities` será uma coleção lazy.

O `UserDetailsService` precisa carregá-la dentro de transação read-only.

Opções:

- `@EntityGraph`;
- join fetch;
- transação e acesso explícito.

O repository utilizará:

```text
@EntityGraph(attributePaths = "authorities")
```

Isso evita `LazyInitializationException` e reduz consultas repetidas na autenticação.

Não use `EAGER` global sem medir impacto.

---

### Principal adaptador

`DatabaseUserPrincipal` implementará:

```text
UserDetails;

CredentialsContainer.
```

Ele conterá:

- userId;
- username;
- passwordHash;
- authorities;
- flags.

Depois da autenticação, `eraseCredentials()` define o hash interno como `null`.

O hash continua persistido no banco.

A cópia no principal é apagada.

O objeto não será serializado em respostas.

O endpoint `/api/security/me` continuará devolvendo apenas username e authorities.

---

### Cache de UserDetails

Cache exigiria invalidation para bloqueios, troca de password e authorities. Nesta aula, cada request Basic consulta o banco e verifica o hash; JWT mudará esse perfil depois.

---

### Concorrência e versão

A entity terá `@Version` para futuras mudanças administrativas. A autenticação permanece leitura, e o bootstrap apenas insere quando a conta não existe.

---

### Bootstrap não é cadastro

O initializer cria somente uma conta sintética sob profile e property explícitos. Produção real exige fluxo auditável de criação de contas.

---

### Falha segura no startup

Quando `database.enabled=true`, a aplicação precisa de:

- repository;
- encoder;
- provider;
- manager;
- datasource;
- migration válida.

Quando bootstrap está habilitado, precisa também de:

- username;
- hash versionado;
- authorities.

Configuração incompleta deve falhar.

Não crie defaults como:

```text
admin/admin.
```

---

## Mão na massa guiada

### 1. Mover Bouncy Castle para runtime

No `pom.xml`, altere:

```xml
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk18on</artifactId>
</dependency>
```

Remova:

```xml
<scope>test</scope>
```

A versão deve continuar gerenciada pelo BOM.

Valide:

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.bouncycastle:bcprov-jdk18on"
```

---

### 2. Criar a migration V8

Arquivo:

```text
V8__create_security_user.sql
```

Conteúdo:

```sql
create table security_user (
    id uuid primary key,
    username varchar(120) not null,
    username_normalized varchar(120) not null,
    password_hash varchar(255) not null,
    enabled boolean not null,
    account_non_expired boolean not null,
    account_non_locked boolean not null,
    credentials_non_expired boolean not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    version bigint not null default 0,

    constraint ck_security_user_username
        check (btrim(username) <> ''),

    constraint ck_security_user_username_normalized
        check (btrim(username_normalized) <> ''),

    constraint ck_security_user_password_hash
        check (btrim(password_hash) <> '')
);

create unique index ux_security_user_username_normalized
    on security_user (username_normalized);

create table security_user_authority (
    user_id uuid not null,
    authority varchar(120) not null,

    constraint pk_security_user_authority
        primary key (user_id, authority),

    constraint fk_security_user_authority_user
        foreign key (user_id)
        references security_user (id)
        on delete cascade,

    constraint ck_security_user_authority
        check (btrim(authority) <> '')
);

create index ix_security_user_authority_authority
    on security_user_authority (authority);
```

A migration não insere usuário ou hash.

---

### 3. Criar UsernameNormalizer

```java
package br.com.formacao.backend.domain.security;

import java.util.Locale;

public final class UsernameNormalizer {

    private UsernameNormalizer() {
    }

    public static String normalize(
            String username
    ) {
        if (username == null) {
            throw new IllegalArgumentException(
                    "Username is required"
            );
        }

        String normalized =
                username
                        .trim()
                        .toLowerCase(
                                Locale.ROOT
                        );

        if (normalized.isBlank()) {
            throw new IllegalArgumentException(
                    "Username is required"
            );
        }

        if (normalized.length() > 120) {
            throw new IllegalArgumentException(
                    "Username exceeds 120 characters"
            );
        }

        return normalized;
    }
}
```

A mensagem não contém o username recebido.

---

### 4. Criar ApplicationUser

Estrutura principal:

```java
@Entity
@Table(
        name = "security_user",
        uniqueConstraints = {
                @UniqueConstraint(
                        name =
                                "ux_security_user_username_normalized",
                        columnNames =
                                "username_normalized"
                )
        }
)
public class ApplicationUser {

    @Id
    private UUID id;

    @Column(
            nullable = false,
            length = 120
    )
    private String username;

    @Column(
            name = "username_normalized",
            nullable = false,
            length = 120
    )
    private String usernameNormalized;

    @Column(
            name = "password_hash",
            nullable = false,
            length = 255
    )
    private String passwordHash;

    @Column(nullable = false)
    private boolean enabled;

    @Column(
            name = "account_non_expired",
            nullable = false
    )
    private boolean accountNonExpired;

    @Column(
            name = "account_non_locked",
            nullable = false
    )
    private boolean accountNonLocked;

    @Column(
            name = "credentials_non_expired",
            nullable = false
    )
    private boolean credentialsNonExpired;

    @ElementCollection(
            fetch = FetchType.LAZY
    )
    @CollectionTable(
            name =
                    "security_user_authority",
            joinColumns =
                    @JoinColumn(
                            name = "user_id"
                    )
    )
    @Column(
            name = "authority",
            nullable = false,
            length = 120
    )
    private Set<String> authorities =
            new LinkedHashSet<>();

    @Column(
            name = "created_at",
            nullable = false
    )
    private OffsetDateTime createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private OffsetDateTime updatedAt;

    @Version
    private long version;

    protected ApplicationUser() {
    }
}
```

Adicione uma factory:

```java
public static ApplicationUser create(

        String username,

        String passwordHash,

        Set<String> authorities,

        Clock clock

) {
    String normalized =
            UsernameNormalizer.normalize(
                    username
            );

    if (
        passwordHash == null
        || passwordHash.isBlank()
        || !passwordHash.startsWith("{")
    ) {
        throw new IllegalArgumentException(
                "Versioned password hash is required"
        );
    }

    if (
        authorities == null
        || authorities.isEmpty()
    ) {
        throw new IllegalArgumentException(
                "At least one authority is required"
        );
    }

    OffsetDateTime now =
            OffsetDateTime.now(
                    clock
            );

    ApplicationUser user =
            new ApplicationUser();

    user.id =
            UUID.randomUUID();

    user.username =
            username.trim();

    user.usernameNormalized =
            normalized;

    user.passwordHash =
            passwordHash;

    user.authorities =
            authorities
                    .stream()
                    .map(String::trim)
                    .filter(
                            authority ->
                                    !authority.isBlank()
                    )
                    .collect(
                            Collectors.toCollection(
                                    LinkedHashSet::new
                            )
                    );

    if (user.authorities.isEmpty()) {
        throw new IllegalArgumentException(
                "At least one authority is required"
        );
    }

    user.enabled = true;
    user.accountNonExpired = true;
    user.accountNonLocked = true;
    user.credentialsNonExpired = true;
    user.createdAt = now;
    user.updatedAt = now;

    return user;
}
```

Crie métodos:

```java
public void disable(
        Clock clock
) {
    enabled = false;
    touch(clock);
}

public void lock(
        Clock clock
) {
    accountNonLocked = false;
    touch(clock);
}

public void expireCredentials(
        Clock clock
) {
    credentialsNonExpired = false;
    touch(clock);
}

private void touch(
        Clock clock
) {
    updatedAt =
            OffsetDateTime.now(
                    clock
            );
}
```

Adicione getters somente de leitura para os campos necessários.

Não crie setter público para `passwordHash`.

---

### 5. Criar o repository

```java
package br.com.formacao.backend.persistence.security;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository
        .EntityGraph;
import org.springframework.data.jpa.repository
        .JpaRepository;

import br.com.formacao.backend.domain.security
        .ApplicationUser;

public interface ApplicationUserRepository
        extends JpaRepository<
                ApplicationUser,
                UUID
        > {

    @EntityGraph(
            attributePaths = "authorities"
    )
    Optional<ApplicationUser>
    findByUsernameNormalized(
            String usernameNormalized
    );

    boolean existsByUsernameNormalized(
            String usernameNormalized
    );
}
```

O método de autenticação carrega authorities na mesma consulta lógica.

---

### 6. Criar DatabaseUserPrincipal

```java
package br.com.formacao.backend.configuration.security;

import java.util.Collection;
import java.util.Set;
import java.util.UUID;

import org.springframework.security.core
        .CredentialsContainer;
import org.springframework.security.core
        .GrantedAuthority;
import org.springframework.security.core.authority
        .SimpleGrantedAuthority;
import org.springframework.security.core.userdetails
        .UserDetails;

public final class DatabaseUserPrincipal
        implements UserDetails,
                   CredentialsContainer {

    private final UUID userId;
    private final String username;
    private String passwordHash;

    private final Set<GrantedAuthority>
            authorities;

    private final boolean enabled;
    private final boolean accountNonExpired;
    private final boolean accountNonLocked;
    private final boolean credentialsNonExpired;

    public DatabaseUserPrincipal(
            UUID userId,
            String username,
            String passwordHash,
            Set<String> authorities,
            boolean enabled,
            boolean accountNonExpired,
            boolean accountNonLocked,
            boolean credentialsNonExpired
    ) {
        this.userId = userId;
        this.username = username;
        this.passwordHash = passwordHash;

        this.authorities =
                authorities
                        .stream()
                        .map(
                                SimpleGrantedAuthority::new
                        )
                        .collect(
                                java.util.stream
                                        .Collectors
                                        .toUnmodifiableSet()
                        );

        this.enabled = enabled;
        this.accountNonExpired =
                accountNonExpired;
        this.accountNonLocked =
                accountNonLocked;
        this.credentialsNonExpired =
                credentialsNonExpired;
    }

    public UUID getUserId() {
        return userId;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public Collection<
            ? extends GrantedAuthority
    > getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public void eraseCredentials() {
        passwordHash = null;
    }
}
```

O principal não expõe entity, timestamps ou version.

---

### 7. Criar DatabaseUserDetailsService

```java
package br.com.formacao.backend.configuration.security;

import org.springframework.boot.autoconfigure.condition
        .ConditionalOnProperty;
import org.springframework.security.core.userdetails
        .UserDetails;
import org.springframework.security.core.userdetails
        .UserDetailsService;
import org.springframework.security.core.userdetails
        .UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation
        .Transactional;

import br.com.formacao.backend.domain.security
        .UsernameNormalizer;
import br.com.formacao.backend.persistence.security
        .ApplicationUserRepository;

@Service
@ConditionalOnProperty(
        prefix = "app.security.database",
        name = "enabled",
        havingValue = "true"
)
public class DatabaseUserDetailsService
        implements UserDetailsService {

    private final ApplicationUserRepository
            repository;

    public DatabaseUserDetailsService(
            ApplicationUserRepository repository
    ) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(
            String username
    ) throws UsernameNotFoundException {

        String normalized =
                UsernameNormalizer.normalize(
                        username
                );

        return repository
                .findByUsernameNormalized(
                        normalized
                )
                .map(
                        user ->
                                new DatabaseUserPrincipal(
                                        user.getId(),
                                        user.getUsername(),
                                        user.getPasswordHash(),
                                        user.getAuthorities(),
                                        user.isEnabled(),
                                        user.isAccountNonExpired(),
                                        user.isAccountNonLocked(),
                                        user.isCredentialsNonExpired()
                                )
                )
                .orElseThrow(
                        () ->
                                new UsernameNotFoundException(
                                        "User not found"
                                )
                );
    }
}
```

A exception não repete o username.

---

### 8. Criar o PasswordEncoder de runtime

```java
@Bean
PasswordEncoder passwordEncoder() {
    String idForEncode =
            "argon2";

    Map<String, PasswordEncoder> encoders =
            new HashMap<>();

    encoders.put(
            "argon2",
            new Argon2PasswordEncoder(
                    16,
                    32,
                    1,
                    19 * 1024,
                    2
            )
    );

    encoders.put(
            "bcrypt",
            new BCryptPasswordEncoder(
                    12
            )
    );

    return new DelegatingPasswordEncoder(
            idForEncode,
            encoders
    );
}
```

O bean substitui o encoder criado no laboratório in-memory.

---

### 9. Configurar provider e manager

Em:

```text
DatabaseAuthenticationConfiguration.java
```

Crie:

```java
@Configuration(
        proxyBeanMethods = false
)
@EnableConfigurationProperties({
        DatabaseAuthenticationProperties.class,
        HttpBasicAuthenticationProperties.class
})
@ConditionalOnProperty(
        prefix = "app.security.database",
        name = "enabled",
        havingValue = "true"
)
public class
        DatabaseAuthenticationConfiguration {

    @Bean
    DaoAuthenticationProvider
    databaseAuthenticationProvider(

            DatabaseUserDetailsService
                    userDetailsService,

            PasswordEncoder
                    passwordEncoder

    ) {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(
                        userDetailsService
                );

        provider.setPasswordEncoder(
                passwordEncoder
        );

        return provider;
    }

    @Bean
    AuthenticationManager
    authenticationManager(

            DaoAuthenticationProvider provider

    ) {
        return new ProviderManager(
                provider
        );
    }
}
```

A configuração usa o constructor atual que recebe `UserDetailsService`.

---

### 10. Separar HTTP Basic da fonte do usuário

Substitua:

```text
BasicAuthenticationProperties
```

por:

```text
HttpBasicAuthenticationProperties.
```

Prefixo:

```text
app.security.http-basic.
```

Campos:

```java
private boolean enabled;

@NotBlank
private String realm =
        "formacao-java-api";
```

A property controla somente o protocolo.

Ela não contém username, hash ou authorities.

Atualize:

- `ApiSecurityConfiguration`;
- `ApiAuthenticationEntryPoint`;
- `SecurityIdentityController`.

Condição do controller:

```text
app.security.http-basic.enabled=true.
```

---

### 11. Remover autenticação em memória

Remova:

```text
InMemoryBasicAuthenticationConfiguration.java;

application-basic-lab.yaml.
```

O teste da aula 420 pode ser preservado como histórico didático ou convertido para uma configuração de teste isolada.

A aplicação principal não deve possuir dois `UserDetailsService` sem decisão explícita.

---

### 12. Criar DatabaseAuthenticationProperties

Use:

```text
app.security.database.
```

Campos:

```text
enabled;

bootstrap.enabled;

bootstrap.username;

bootstrap.password-hash;

bootstrap.authorities.
```

Validação:

```text
se bootstrap enabled:

username obrigatório;

hash versionado obrigatório;

ao menos uma authority.
```

Não forneça valores default de credencial.

---

### 13. Criar o profile db-auth-lab

```yaml
spring:
  config:
    activate:
      on-profile: db-auth-lab

app:
  security:
    http-basic:
      enabled: true
      realm: formacao-java-db-lab

    database:
      enabled: true

      bootstrap:
        enabled: true
        username:
          ${APP_SECURITY_DB_BOOTSTRAP_USERNAME}

        password-hash:
          ${APP_SECURITY_DB_BOOTSTRAP_PASSWORD_HASH}

        authorities:
          - ROLE_OPERATOR
          - service-order:read
          - service-order:write
```

Sem as variáveis, o startup falha.

---

### 14. Criar o initializer de laboratório

`DatabaseAuthenticationLabInitializer` implementará `ApplicationRunner`.

Lógica:

```java
String normalized =
        UsernameNormalizer.normalize(
                properties
                        .getBootstrap()
                        .getUsername()
        );

if (
    repository.existsByUsernameNormalized(
            normalized
    )
) {
    logger.info(
            "Database authentication lab user already exists"
    );

    return;
}

ApplicationUser user =
        ApplicationUser.create(
                properties
                        .getBootstrap()
                        .getUsername(),
                properties
                        .getBootstrap()
                        .getPasswordHash(),
                Set.copyOf(
                        properties
                                .getBootstrap()
                                .getAuthorities()
                ),
                clock
        );

repository.saveAndFlush(
        user
);

logger.info(
        "Database authentication lab user created"
);
```

Anotações:

```java
@Component
@Profile("db-auth-lab")
@ConditionalOnProperty(
        prefix =
                "app.security.database.bootstrap",
        name = "enabled",
        havingValue = "true"
)
```

O log não contém username, hash ou authorities.

---

### 15. Criar gerador Argon2id manual

Crie:

```text
DatabaseLabPasswordHashGeneratorTest.java
```

Ele lerá:

```text
DB_AUTH_LAB_RAW_PASSWORD.
```

Use o mesmo `PasswordEncoder` definido para runtime.

O output terá:

```text
APP_SECURITY_DB_BOOTSTRAP_PASSWORD_HASH=
{argon2}$argon2id$...
```

O teste fica skipped quando a variável não existe.

Não versione o output.

---

### 16. Criar teste de integração

Use:

```java
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(
        properties = {
                "app.security.http-basic.enabled=true",
                "app.security.database.enabled=true",
                "app.security.database.bootstrap.enabled=false"
        }
)
@TestInstance(
        TestInstance.Lifecycle.PER_CLASS
)
class DatabaseAuthenticationIntegrationTest {
}
```

Injete:

- `MockMvc`;
- repository;
- `PasswordEncoder`;
- `Clock`.

Antes de cada teste:

```java
repository.deleteAll();

ApplicationUser user =
        ApplicationUser.create(
                "operator",
                passwordEncoder.encode(
                        "Laboratorio-DB-M15!2026"
                ),
                Set.of(
                        "ROLE_OPERATOR",
                        "service-order:read",
                        "service-order:write"
                ),
                clock
        );

repository.saveAndFlush(
        user
);
```

Como o encode Argon2id é caro, calcule o hash uma vez no `@BeforeAll` e reutilize a string sintética nos fixtures.

---

### 17. Testar autenticação persistida

```java
@Test
void shouldAuthenticateUserLoadedFromDatabase()
        throws Exception {

    mockMvc.perform(
            get(
                    "/api/security/me"
            )
            .with(
                    httpBasic(
                            "operator",
                            "Laboratorio-DB-M15!2026"
                    )
            )
    )
    .andExpect(
            status().isOk()
    )
    .andExpect(
            authenticated()
                    .withUsername(
                            "operator"
                    )
    )
    .andExpect(
            jsonPath("$.authorities")
                    .value(
                            hasItems(
                                    "ROLE_OPERATOR",
                                    "service-order:read",
                                    "service-order:write"
                            )
                    )
    );
}
```

Esse teste atravessa PostgreSQL, provider e encoder.

---

### 18. Testar normalização

```java
@Test
void shouldAuthenticateUsernameIgnoringCaseAndSpaces()
        throws Exception {

    mockMvc.perform(
            get(
                    "/api/security/me"
            )
            .with(
                    httpBasic(
                            "  OPERATOR  ",
                            "Laboratorio-DB-M15!2026"
                    )
            )
    )
    .andExpect(
            status().isOk()
    )
    .andExpect(
            authenticated()
                    .withUsername(
                            "operator"
                    )
    );
}
```

O principal retorna o username de exibição persistido.

---

### 19. Testar falhas genéricas

Crie testes separados para:

```text
username ausente;

password inválida.
```

Ambos devem validar:

```text
401;

authentication_required;

WWW-Authenticate Basic;

sem diferença pública.
```

Não valide mensagens internas de exceptions.

---

### 20. Testar flags

Antes de cada cenário, altere a entity:

```text
disable;

lock;

expireCredentials.
```

Salve e tente autenticar.

Resultados:

```text
DisabledException;

LockedException;

CredentialsExpiredException
```

internamente.

Externamente:

```text
401 authentication_required.
```

O contrato não revela o estado da conta.

---

### 21. Testar authorities e 403

Use a conta `ROLE_OPERATOR` no:

```text
/api/security/admin-probe.
```

Resultado:

```text
403 access_denied.
```

Isso confirma:

- autenticação passou;
- authorities vieram do banco;
- `ROLE_ADMIN` não existe;
- autorização permaneceu separada.

---

### 22. Testar unicidade

No teste de repository:

1. salve `Operator`;
2. tente salvar `operator`;
3. execute `flush`;
4. espere violação de constraint.

A regra importante está no banco.

A validação de aplicação deve antecipar uma mensagem amigável em um futuro cadastro, mas a constraint continua obrigatória.

---

### 23. Testar principal sem credencial após sucesso

No controller `/me`, continue expondo somente:

- username;
- authorities.

Em teste de unidade do provider, valide que o principal implementa `CredentialsContainer`.

Não serialize `DatabaseUserPrincipal`.

Não exponha:

- userId sem necessidade;
- hash;
- flags internas;
- versão;
- timestamps.

---

### 24. Executar testes

```powershell
.\mvnw.cmd `
  -Dtest=DatabaseAuthenticationIntegrationTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- Flyway V8;
- PostgreSQL real nos testes de integração;
- nenhuma H2;
- nenhuma conta default;
- nenhum hash em log;
- nenhuma sessão;
- Basic challenge;
- 401 e 403 consistentes.

---

### 25. Gerar hash para o laboratório

Use `SecureString` como na aula anterior.

Defina temporariamente:

```text
DB_AUTH_LAB_RAW_PASSWORD.
```

Execute:

```powershell
.\mvnw.cmd `
  -Dtest=DatabaseLabPasswordHashGeneratorTest `
  test
```

Copie somente o hash Argon2id.

Remova a variável raw imediatamente.

---

### 26. Subir a stack

Defina:

```powershell
$env:SPRING_PROFILES_ACTIVE =
  "local,db-auth-lab"

$env:APP_SECURITY_DB_BOOTSTRAP_USERNAME =
  "operator"

$env:APP_SECURITY_DB_BOOTSTRAP_PASSWORD_HASH =
  '{argon2}$argon2id$...'
```

Suba:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Nos logs, confirme apenas:

```text
lab user created
```

ou:

```text
lab user already exists.
```

O hash não pode aparecer.

---

### 27. Testar com PSCredential

Crie uma `PSCredential` com a senha sintética e execute:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:8081/api/security/me" `
  -Authentication Basic `
  -Credential $credential
```

Confirme username e authorities.

Reinicie somente a API.

Autentique novamente.

A conta deve permanecer no PostgreSQL.

---

### 28. Comprovar origem no banco

Consulte sem selecionar `password_hash`:

```sql
select
    id,
    username,
    username_normalized,
    enabled,
    account_non_locked,
    credentials_non_expired,
    version
from
    security_user;
```

Authorities:

```sql
select
    user_id,
    authority
from
    security_user_authority
order by
    authority;
```

Não coloque o hash em evidências.

---

### 29. Atualizar documentação

Crie:

```text
docs/security/M15_DATABASE_AUTHENTICATION.md
```

Registre:

- schema;
- normalização;
- flags;
- authorities;
- adapter;
- encoder;
- provider;
- bootstrap;
- testes;
- limitações;
- migração do in-memory;
- decisão de não cache;
- decisão de não criar cadastro.

Atualize:

- baseline;
- threat model;
- OWASP review;
- password storage decision;
- Basic auth document;
- OpenAPI.

---

### 30. Atualizar OpenAPI

O scheme `basicAuth` permanece temporário.

Atualize a descrição:

```text
usuário carregado do PostgreSQL;

somente laboratório;

TLS obrigatório fora de localhost;

será substituído pelo fluxo JWT.
```

Não exponha endpoints de administração de usuário.

---

### 31. Encerrar e limpar

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

Remova:

```powershell
Remove-Item `
  Env:APP_SECURITY_DB_BOOTSTRAP_USERNAME,
  Env:APP_SECURITY_DB_BOOTSTRAP_PASSWORD_HASH,
  Env:SPRING_PROFILES_ACTIVE `
  -ErrorAction SilentlyContinue
```

Não remova o volume se deseja preservar a conta do laboratório para a próxima execução.

Use `down -v` somente quando quiser destruir conscientemente os dados locais.

---

## Entendendo o que foi feito

### A identidade tornou-se persistente

O restart da API não apaga a conta.

### A entity ficou independente

Spring Security recebeu um adaptador.

### O provider manteve sua responsabilidade

Repository carrega; encoder compara; provider autentica.

### Username ganhou unicidade real

A constraint protege concorrência e múltiplas instâncias.

### Authorities vieram do banco

O `403` administrativo usou dados persistidos.

### Flags entraram no fluxo

Conta desabilitada ou bloqueada não autentica.

### Argon2id entrou no runtime

Novos hashes seguem a decisão da aula 417.

### BCrypt continuou compatível

O formato versionado permite legados.

### O bootstrap ficou isolado

Nenhuma credencial default foi inserida por migration.

---

## Erros comuns importantes

### Fazer a entity implementar UserDetails

O domínio fica acoplado ao framework.

### Comparar password no service

Essa responsabilidade pertence ao provider e encoder.

### Buscar por username sem normalizar

Contas duplicadas e comportamento inconsistente aparecem.

### Garantir unicidade apenas na aplicação

Requests concorrentes podem criar duplicação.

### Usar EAGER em toda coleção

A autenticação não justifica custo global em outros fluxos.

### Logar username e estado de falha

Pode facilitar enumeração e expor dados.

### Inserir admin em migration

O hash vira parte permanente do repositório.

### Atualizar hash no bootstrap

Um restart poderia sobrescrever uma troca legítima.

### Cachear usuário sem invalidation

Bloqueios e alterações podem demorar a valer.

### Manter in-memory e banco simultaneamente

Providers e fontes ficam ambíguos.

---

## Comandos úteis

### Validar dependency

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.bouncycastle:bcprov-jdk18on"
```

### Teste de autenticação

```powershell
.\mvnw.cmd `
  -Dtest=DatabaseAuthenticationIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Inspecionar migrations

```powershell
Get-ChildItem `
  "src/main/resources/db/migration" |
  Sort-Object Name
```

### Consultar identidade

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:8081/api/security/me" `
  -Authentication Basic `
  -Credential $credential
```

### Ver logs sem hash

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs api |
  Select-String `
    "Database authentication"
```

---

## Exercício guiado

### Parte 1 — Schema

Crie usuário e authorities com constraints.

### Parte 2 — Domínio

Implemente normalização, flags e versão.

### Parte 3 — Persistência

Crie repository com entity graph.

### Parte 4 — Adapter

Mapeie entity para `DatabaseUserPrincipal`.

### Parte 5 — Service

Implemente `UserDetailsService`.

### Parte 6 — Encoder

Configure Argon2id e BCrypt legado.

### Parte 7 — Provider

Monte `DaoAuthenticationProvider` e manager.

### Parte 8 — Bootstrap

Crie conta sintética por profile e env.

### Parte 9 — Testes

Valide sucesso, falhas, flags e 403.

### Parte 10 — Operação

Reinicie a API e comprove persistência.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 420 foi preservada;
- PostgreSQL real foi usado, sem H2;
- `V8__create_security_user.sql` criou usuário e authorities;
- migration não inseriu conta nem hash;
- username original e normalizado foram persistidos;
- unicidade normalizada foi garantida no banco;
- password em texto puro não existe;
- hash versionado e flags de conta foram persistidos;
- UUID, timestamps e `@Version` foram usados;
- `UsernameNormalizer` usa `trim`, `Locale.ROOT` e limite de 120;
- `ApplicationUser` não implementa `UserDetails`;
- factory e operações de estado foram criadas;
- setters públicos sensíveis foram evitados;
- repository com `@EntityGraph` foi criado;
- authorities permanecem lazy por padrão;
- `DatabaseUserPrincipal` adapta a entity;
- `CredentialsContainer` permite apagar o hash do principal;
- entity e hash não são serializados;
- `DatabaseUserDetailsService` usa transação read-only;
- usuário ausente gera exception genérica;
- `UserDetailsService` não compara password;
- Bouncy Castle passou para runtime;
- Argon2id é default e BCrypt continua legado;
- `DelegatingPasswordEncoder` foi usado;
- `DaoAuthenticationProvider` e `ProviderManager` foram configurados;
- HTTP Basic foi separado da origem do usuário;
- configuração in-memory foi removida;
- não ficaram duas fontes de `UserDetailsService`;
- properties de banco e profile `db-auth-lab` foram criados;
- bootstrap exige env vars e não possui credenciais default;
- initializer não atualiza conta existente nem registra dados sensíveis;
- gerador manual Argon2id foi criado;
- testes de integração usam PostgreSQL real;
- autenticação válida e username normalizado foram testados;
- username ausente e password inválida retornam o mesmo `401`;
- conta desabilitada, bloqueada e expirada retorna `401`;
- authorities vindas do banco foram testadas;
- ausência de `ROLE_ADMIN` retorna `403`;
- unicidade foi testada com `flush`;
- sessão não foi criada;
- `WWW-Authenticate`, CORS e security headers foram preservados;
- Flyway V8, Compose e gate completo foram validados;
- restart da API preservou a conta;
- evidências SQL não selecionam `password_hash`;
- documentação e artefatos de segurança foram atualizados;
- produção pública continua não aprovada;
- cadastro, recuperação, troca de senha e JWT não foram antecipados;
- commit recomendado está pronto;
- ponte para a aula 422 está correta.

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
git commit -m "feat(m15): autenticar usuarios persistidos no PostgreSQL"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- raw password;
- hash de ambiente;
- Basic header;
- credentials;
- env file;
- dump de tabela com password_hash;
- logs de autenticação;
- usuário de produção;
- bootstrap ativado fora do lab;
- JWT antecipado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a identidade saiu da memória da aplicação e passou a ser persistida.

O fluxo ficou:

```text
HTTP Basic;

BasicAuthenticationFilter;

ProviderManager;

DaoAuthenticationProvider;

DatabaseUserDetailsService;

ApplicationUserRepository;

PostgreSQL;

PasswordEncoder.matches;

DatabaseUserPrincipal;

SecurityContext.
```

A implementação preservou:

```text
entidade independente;

username normalizado;

unicidade no banco;

flags de conta;

authorities persistidas;

Argon2id para novos hashes;

BCrypt para legado;

401 genérico;

403 separado;

stateless.
```

A decisão central foi:

```text
persistir usuário
não significa mover
a autenticação para o repository;

o repository carrega estado,
o UserDetailsService adapta,
o provider valida
e o encoder compara.
```

A aplicação ainda utiliza HTTP Basic como transporte didático.

A próxima aula será:

```text
422 - M15.12 - JWT conceitos header payload signature
```

Nela, você estudará:

- token;
- claims;
- header;
- payload;
- signature;
- Base64URL;
- JWS;
- JWT assinado versus criptografado;
- `iss`;
- `sub`;
- `aud`;
- `iat`;
- `exp`;
- `nbf`;
- `jti`;
- algoritmos;
- chaves simétricas e assimétricas;
- ameaças;
- limites;
- quando JWT não deve ser usado.

Nenhum login JWT será implementado antes de entender o formato.

---

# Material complementar

## Checkpoint final

- [ ] Criei schema e migration de usuário.
- [ ] Mantive a entity independente do Spring Security.
- [ ] Implementei `UserDetailsService` com PostgreSQL.
- [ ] Testei flags, authorities, 401 e 403.
- [ ] Comprovei persistência após restart.

---

## Troubleshooting adicional

### Flyway falha na V8

Confirme:

- V7 aplicada;
- nome exato;
- SQL PostgreSQL;
- índice não duplicado;
- migration não editada após aplicação.

### Username válido retorna 401

Confirme:

- valor normalizado;
- hash com prefixo;
- provider ativo;
- database enabled;
- authorities carregadas.

### LazyInitializationException

Confirme `@EntityGraph` e transação read-only.

Não transforme a coleção em EAGER como primeira reação.

### Argon2 gera ClassNotFoundException

Confirme Bouncy Castle em runtime.

Revise dependency tree e imagem Docker.

### Aplicação possui dois providers

Remova a configuração in-memory.

Revise beans de `UserDetailsService` e `AuthenticationProvider`.

### Bootstrap não cria usuário

Confirme:

- profile `db-auth-lab`;
- property enabled;
- env vars;
- migration;
- logs genéricos.

### Bootstrap não atualiza password

Esse comportamento é intencional.

Faça uma operação administrativa futura ou recrie conscientemente o volume local.

### Usuário bloqueado revela LockedException

O contrato público deve continuar `401 authentication_required`.

Não exponha a exception no Problem Details.

---

## Perguntas de revisão

1. Qual componente carrega usuário do banco?
2. Quem compara a password?
3. A entity deve implementar UserDetails?
4. Para que serve o principal adaptador?
5. Por que normalizar username?
6. Onde garantir unicidade?
7. Como authorities são armazenadas?
8. O que faz `@EntityGraph`?
9. Para que serve `@Version`?
10. Qual algoritmo cria novos hashes?
11. Qual algoritmo legado permanece?
12. O que faz o prefixo `{argon2}`?
13. O que ocorre com conta bloqueada?
14. A resposta revela o motivo?
15. O bootstrap é cadastro?
16. Ele atualiza usuário existente?
17. O hash pode aparecer em consulta de evidência?
18. Existe cache nesta aula?
19. JWT já foi implementado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. `DatabaseUserDetailsService`.
2. `DaoAuthenticationProvider` com `PasswordEncoder`.
3. Não nesta arquitetura.
4. Adaptar domínio para Spring Security.
5. Tornar identificação previsível.
6. No banco e na aplicação.
7. Em tabela de associação.
8. Carregar authorities com a conta.
9. Controle otimista para mudanças futuras.
10. Argon2id.
11. BCrypt.
12. Selecionar o encoder.
13. A autenticação falha.
14. Não.
15. Não.
16. Não.
17. Não.
18. Não.
19. Não.
20. JWT conceitos header payload signature.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 421 - M15.11 - Autenticacao com banco

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Substituí o usuário em memória por PostgreSQL.
- Criei a migration `V8__create_security_user.sql`.
- Criei as tabelas `security_user` e `security_user_authority`.
- Armazenei username original e normalizado.
- Criei índice único para o username normalizado.
- Armazenei somente password hash versionado.
- Modelei enabled, account non-expired, account non-locked e credentials non-expired.
- Adicionei timestamps e `@Version`.
- Mantive authorities em tabela própria.
- Criei `UsernameNormalizer`.
- Usei `Locale.ROOT`.
- Criei `ApplicationUser` sem implementar `UserDetails`.
- Criei `ApplicationUserRepository`.
- Usei `@EntityGraph` para authorities.
- Criei `DatabaseUserPrincipal`.
- Implementei `CredentialsContainer`.
- Criei `DatabaseUserDetailsService`.
- Usei transação read-only.
- Mantive exceptions públicas genéricas.
- Mudei Bouncy Castle para runtime.
- Criei `DelegatingPasswordEncoder`.
- Configurei Argon2id como default.
- Mantive BCrypt para hashes legados.
- Criei `DaoAuthenticationProvider`.
- Criei `ProviderManager`.
- Separei HTTP Basic da origem do usuário.
- Removi a configuração in-memory da aplicação.
- Criei `DatabaseAuthenticationProperties`.
- Criei o profile `db-auth-lab`.
- Criei bootstrap condicionado ao laboratório.
- Não inseri usuário ou hash em migration.
- Não atualizei conta existente no bootstrap.
- Criei gerador manual de hash Argon2id.
- Criei testes com PostgreSQL real.
- Testei autenticação válida.
- Testei username case-insensitive.
- Testei username e password inválidos.
- Testei conta desabilitada e bloqueada.
- Testei credentials expiradas.
- Testei authorities vindas do banco.
- Testei `403` sem ROLE_ADMIN.
- Testei unicidade no banco.
- Comprovei persistência após restart da API.
- Não expus password hash em response ou evidência.
- Criei `docs/security/M15_DATABASE_AUTHENTICATION.md`.
- Atualizei baseline, threat model, OWASP, password storage, Basic e OpenAPI.
- Não criei cadastro, recuperação, troca de senha ou JWT.
- Próxima aula: JWT conceitos header payload signature.
```

---

## Referência técnica curta

- [Spring Security — UserDetailsService](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/user-details-service.html)
- [Spring Security — DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html)
- [Spring Security — PasswordEncoder](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/password-encoder.html)
- [Spring Security — JDBC Authentication](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/jdbc.html)
- [Spring Data JPA — EntityGraph](https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html#jpa.entity-graph)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

Regra final:

```text
a autenticação persistida precisa separar entidade, repository, adaptação e validação de credenciais: o PostgreSQL garante estado e unicidade, o UserDetailsService carrega a conta, o principal adapta flags e authorities, o DaoAuthenticationProvider verifica a senha com um PasswordEncoder versionado e o contrato externo mantém falhas genéricas; nesta baseline, novos hashes usam Argon2id, BCrypt permanece compatível, o bootstrap fica restrito ao laboratório e HTTP Basic continua apenas como transporte didático até a introdução consciente de JWT.
```
