# 443 - M15.33 - Testes de seguranca

## Apresentação da aula

Na aula 442, o projeto passou a conhecer melhor a própria supply chain.

Foram adicionados:

```text
dependency tree;

effective POM;

SBOM CycloneDX;

OWASP Dependency-Check;

risk register;

policy de suppression;

Dependabot;

artifacts de CI.
```

A aplicação agora consegue responder:

```text
quais componentes externos
entram no build?

quais vulnerabilidades conhecidas
foram detectadas?

qual decisão foi tomada?

quem é responsável?

quando a exceção expira?
```

Esse controle é importante, mas cobre apenas uma parte da segurança.

Ao longo do Módulo 15, o projeto construiu:

- autenticação com banco;
- emissão e validação de JWT;
- refresh token com rotação;
- roles e authorities;
- Method Security;
- autorização por ownership;
- contratos seguros de `401`, `403` e `404`;
- auditoria de ações sensíveis;
- secrets management;
- fundamentos OAuth 2.0;
- OpenID Connect;
- PKCE;
- Keycloak local;
- login OIDC;
- multi-tenancy;
- privacidade;
- rate limiting;
- proteção contra mass assignment;
- DTOs e logs seguros;
- gestão de vulnerabilidades.

Cada controle já recebeu testes durante sua implementação.

Agora é necessário responder:

```text
a suíte de segurança
possui uma estratégia coerente
ou apenas vários testes isolados?
```

Um teste de segurança útil precisa demonstrar uma propriedade.

Exemplos:

```text
token com issuer incorreto:
é rejeitado.

usuário do tenant A:
não lê recurso do tenant B.

payload com ownerUserId:
não produz mutação.

Redis indisponível:
bloqueia export de privacidade.

exception com SQL:
não vaza na response.

refresh reutilizado:
revoga a família.

dependency suppression expirada:
quebra o build.
```

A pergunta central desta aula será:

```text
como organizar testes de segurança
por ameaça, controle e camada,
mantendo execução rápida,
ambiente reproduzível,
asserções negativas
e evidências confiáveis?
```

A resposta será uma estratégia em camadas:

```text
unit tests;

web/security tests;

integration tests;

policy tests;

contract tests;

external smoke tests;

supply-chain gates.
```

Cada camada possui uma responsabilidade.

A suíte rápida não iniciará containers.

A integração utilizará serviços reais efêmeros:

```text
PostgreSQL;

Redis.
```

O login OIDC da aplicação será testado de forma determinística com o suporte do Spring Security:

```text
jwt();

oidcLogin();

user();

csrf().
```

Um Keycloak real permanecerá em um smoke test separado, executado somente quando o ambiente local ou o pipeline dedicado estiver disponível.

Essa separação evita que todos os testes dependam de:

- Docker;
- rede;
- discovery;
- browser;
- tempo de startup;
- disponibilidade externa.

Também impede que mocks substituam todos os controles reais.

A prática criará uma matriz versionada:

```text
security/security-test-matrix.yaml
```

Exemplo:

```yaml
- threat: THR-123
  control: exact-issuer-validation
  test:
    class: JwtIssuerSecurityTest
    method: shouldRejectWrongIssuer
    layer: WEB
  expectedEvidence:
    status: 401
    code: invalid_token
    sideEffects: none
```

A matriz ligará:

```text
threat;

security requirement;

control;

test;

layer;

expected evidence;

owner.
```

Também serão criados:

```text
SecurityTestMatrixPolicyTest;

SecurityTestTagPolicyTest;

SecurityNegativeAssertionPolicyTest;

SecurityFixtureFactory;

SecurityTestData;

SecurityTestClockConfiguration;

SecurityTestSuite.
```

Documentação:

```text
docs/security/
├── M15_SECURITY_TEST_STRATEGY.md
├── M15_SECURITY_TEST_EXECUTION.md
└── M15_SECURITY_TEST_EVIDENCE.md.
```

A aula não aprofundará todas as combinações de autorização.

A próxima aula será:

```text
444 - M15.34 - Testes de autorizacao
```

Nela, roles, permissions, ownership, tenants, métodos e recursos serão combinados em uma matriz específica e mais profunda.

Nesta aula 443, serão utilizados apenas cenários representativos de autorização para validar a arquitetura da suíte.

---

## Onde estamos na formação

A sequência oficial é:

```text
441:
Seguranca em DTOs e logs.

442:
Vulnerabilidades em dependencias.

443:
Testes de seguranca.

444:
Testes de autorizacao.

445:
Hardening de API.

446:
Checklist seguranca de API.
```

A aula 442 respondeu:

```text
quais riscos conhecidos
existem nas dependências?
```

A aula 443 responderá:

```text
como comprovar continuamente
que os controles de segurança
da aplicação continuam ativos?
```

Nesta aula:

```text
matriz ameaça-controle-teste:
sim.

unit tests:
sim.

MockMvc:
sim.

Spring Security Test:
sim.

Testcontainers:
sim.

PostgreSQL real:
sim.

Redis real:
sim.

Keycloak smoke:
separado.

policy tests:
sim.

asserções negativas:
sim.

evidência:
sim.

matriz completa de autorização:
próxima aula.
```

A regra central será:

```text
um controle sem teste
é uma intenção;

um teste sem ameaça
é uma verificação sem contexto.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
security/
└── security-test-matrix.yaml
```

Infraestrutura de teste:

```text
src/test/java/br/com/formacao/backend/
└── security
    └── testing
        ├── SecurityFixtureFactory.java
        ├── SecurityTestData.java
        ├── SecurityTestClockConfiguration.java
        ├── SecurityTestTags.java
        └── SecurityTestSuite.java
```

Policy tests:

```text
SecurityTestMatrixPolicyTest;

SecurityTestTagPolicyTest;

SecurityNegativeAssertionPolicyTest;

DisabledSecurityTestPolicyTest.
```

Testes representativos:

```text
JwtBoundarySecurityTest;

AuthenticationErrorContractTest;

SecurityHeadersContractTest;

TenantBoundarySecurityTest;

MassAssignmentBoundaryTest;

SensitiveLoggingBoundaryTest;

SecurityRateLimitBoundaryTest;

SecurityAuditBoundaryTest;

DependencySecurityGateTest.
```

Documentação:

```text
docs/security/
├── M15_SECURITY_TEST_STRATEGY.md
├── M15_SECURITY_TEST_EXECUTION.md
└── M15_SECURITY_TEST_EVIDENCE.md
```

Você irá:

1. definir objetivo de segurança testável;
2. separar verificação funcional e segurança;
3. criar taxonomia de testes;
4. criar tags;
5. criar matriz ameaça-controle-teste;
6. validar cobertura da matriz;
7. criar fixtures maliciosas;
8. controlar Clock;
9. controlar IDs;
10. testar JWT;
11. testar OIDC;
12. testar headers;
13. testar errors;
14. testar tenant;
15. testar mass assignment;
16. testar rate limiting;
17. testar logs;
18. testar auditoria;
19. organizar execução local e CI;
20. preparar testes profundos de autorização.

---

## Conceito essencial

### Segurança como propriedade

Teste funcional pergunta:

```text
a operação funciona?
```

Teste de segurança pergunta:

```text
a operação continua segura
quando o input, a identidade,
o estado ou a infraestrutura
são hostis?
```

Uma mesma rota precisa de ambos.

---

### Security requirement

A ameaça precisa ser transformada em requisito observável.

Ameaça:

```text
token emitido por outro issuer.
```

Requisito:

```text
a API aceita tokens
somente do issuer configurado.
```

Evidência:

```text
401;

invalid_token;

no-store;

nenhuma consulta de negócio.
```

---

### Unit test

Unit tests validam políticas puras e pequenas.

Exemplos:

- validação de audience;
- parser de ETag;
- `TenantContextResolver`;
- transição de status;
- `RetentionDecisionService`;
- HMAC de rate limit;
- sanitizer de logs;
- risk register;
- policy de suppression.

Eles devem ser rápidos e independentes de Spring, banco, Redis ou rede.

---

### Web security test

Testes com MockMvc validam:

- FilterChain;
- autenticação;
- CSRF;
- CORS;
- headers;
- status;
- Problem Details;
- request mapping;
- serialização;
- ausência de redirect;
- comportamento de sessão.

O suporte de Spring Security permite criar principals controlados sem executar um grant real em cada teste.

---

### Integration test

Integration tests validam interações reais entre:

- Spring;
- PostgreSQL;
- Redis;
- Flyway;
- JPA;
- transactions;
- cache;
- rate limiter;
- auditoria.

Testcontainers cria serviços efêmeros e reproduzíveis.

Mocks não substituem esses cenários.

---

### Policy test

Policy tests inspecionam código e configuração.

Exemplos:

- nenhuma entity como request;
- nenhuma suppression expirada;
- nenhum logger com token;
- nenhum repository tenant-scoped sem tenant;
- nenhum teste de segurança desabilitado;
- nenhuma matriz sem test class correspondente.

Eles funcionam como guardrails.

Não constituem prova formal de ausência de vulnerabilidade.

---

### Contract test

Contract tests verificam o comportamento observável:

- status HTTP;
- content type;
- headers;
- codes;
- schema;
- ausência de campos;
- compatibilidade do Problem Details.

Não devem depender da mensagem interna de exceptions.

---

### External smoke test

Alguns controles precisam de componentes externos reais.

Exemplo:

```text
Keycloak real;

discovery;

authorization endpoint;

JWKS;

redirect.
```

Esses testes ficam separados porque são mais lentos e frágeis.

Eles não substituem os testes determinísticos com `oidcLogin()`.

---

### Teste negativo

Teste negativo envia uma condição proibida.

Ele precisa verificar:

```text
rejeição;

contrato seguro;

ausência de side effects.
```

Apenas validar `403` ou `400` pode ser insuficiente.

---

### Ausência de side effects

Uma operação rejeitada não deve:

- persistir;
- alterar estado;
- publicar evento;
- enviar e-mail;
- invalidar cache incorreto;
- gravar auditoria de sucesso;
- rotacionar token;
- criar sessão;
- consultar recurso protegido desnecessariamente.

Asserções negativas são parte do requisito.

---

### Determinismo

Testes de segurança não devem depender de:

- relógio real;
- UUID imprevisível em assertion;
- ordem aleatória;
- sleep;
- serviço externo;
- timezone da máquina;
- dados restantes de outro teste.

Use:

```text
Clock fixo;

UUIDs sintéticos;

fixtures;

containers limpos;

Awaitility somente
quando há async real.
```

---

### Clock

Tokens, TTLs, retenção, autenticação recente e rate limiting dependem do tempo.

A aplicação já injeta `Clock` em vários componentes.

Nos testes:

```java
Clock.fixed(
    Instant.parse(
        "2026-07-12T00:00:00Z"
    ),
    ZoneOffset.UTC
);
```

Avance o tempo por fixture controlada, não com `Thread.sleep`.

---

### Randomness

Segurança usa randomness em:

- tokens;
- state;
- nonce;
- verifier;
- IDs.

O teste não deve exigir um valor exato gerado por `SecureRandom`.

Ele deve validar propriedades:

- não vazio;
- tamanho;
- alfabeto;
- unicidade em amostra;
- hash consistente;
- valor não aparece em log.

---

### Fixtures maliciosas

Fixtures de ataque precisam ser sintéticas.

Exemplos:

```text
wrong-issuer-token;

expired-token;

stale-etag;

cross-tenant-id;

unknown-property;

crlf-sentinel;

oversized-value;

reused-refresh-token.
```

Nunca use:

- token real;
- password real;
- tenant real;
- dump de produção;
- exploit contra sistema externo.

---

### Test names

Use nomes que expressem a propriedade:

```text
shouldRejectTokenFromUnexpectedIssuer;

shouldHideCrossTenantResource;

shouldNotPersistWhenUnknownPropertyIsReceived;

shouldNotLogRefreshToken;

shouldFailClosedWhenRedisIsUnavailable.
```

Evite:

```text
test1;

shouldWork;

securityTest.
```

---

### Tags

Taxonomia:

```text
security-unit;

security-web;

security-integration;

security-policy;

security-external;

security-supply-chain.
```

Uma classe pode possuir `security` e uma tag de camada.

Isso permite pipelines distintos.

---

### Flaky security test

Um teste de segurança instável perde credibilidade.

Não resolva flakiness com:

```text
retry infinito;

sleep maior;

@Disabled;

assertion removida.
```

Encontre a causa:

- tempo;
- concorrência;
- isolamento;
- ambiente;
- porta;
- state compartilhado;
- ordem;
- container readiness.

---

### Evidência

Evidência não é apenas screenshot.

Uma evidência útil contém:

- requirement;
- test ID;
- commit;
- ambiente;
- resultado;
- artifact;
- data;
- versão;
- logs seguros;
- report.

JUnit XML, Surefire reports, SBOM e SCA reports podem compor o pacote.

---

## Mão na massa guiada

### 1. Criar a estratégia

Arquivo:

```text
docs/security/M15_SECURITY_TEST_STRATEGY.md
```

Inclua:

```markdown
# Estrategia de testes de seguranca

## Objetivo

Verificar requisitos derivados
do threat model.

## Camadas

- unit.
- web.
- integration.
- policy.
- contract.
- external.
- supply chain.

## Principios

- deny by default.
- negative assertions.
- no real secrets.
- deterministic time.
- isolated data.
- no disabled security tests.
```

---

### 2. Criar as tags

```java
public final class SecurityTestTags {

    public static final String SECURITY =
            "security";

    public static final String UNIT =
            "security-unit";

    public static final String WEB =
            "security-web";

    public static final String INTEGRATION =
            "security-integration";

    public static final String POLICY =
            "security-policy";

    public static final String EXTERNAL =
            "security-external";

    public static final String SUPPLY_CHAIN =
            "security-supply-chain";

    private SecurityTestTags() {
    }
}
```

Use constantes em annotations quando possível.

---

### 3. Criar a matriz YAML

Arquivo:

```text
security/security-test-matrix.yaml
```

Estrutura:

```yaml
version: 1

requirements:
  - id: SEC-AUTHN-001
    threatIds:
      - THR-123
    requirement:
      Tokens from unexpected issuers are rejected.
    control:
      Exact issuer validation.
    owner:
      backend-security
    tests:
      - className:
          JwtBoundarySecurityTest
        methodName:
          shouldRejectTokenFromUnexpectedIssuer
        layer:
          WEB
        evidence:
          status: 401
          code: invalid_token
          sideEffects: none
```

Use IDs estáveis.

---

### 4. Cobrir grupos principais

Adicione requirements para:

```text
authentication;

token validation;

refresh reuse;

authorization concealment;

tenant isolation;

mass assignment;

safe errors;

safe logs;

rate limiting;

privacy export;

security audit;

secrets;

dependency gate.
```

Não tente cobrir cada linha de código.

Cubra requisitos de segurança.

---

### 5. Criar SecurityTestMatrixPolicyTest

O teste carrega o YAML.

Valide:

- version conhecida;
- requirement ID único;
- threat ID presente;
- requirement não vazio;
- control não vazio;
- owner presente;
- ao menos um teste;
- layer válida;
- class existente;
- method existente;
- evidência definida.

Use reflection sobre o classpath de teste.

---

### 6. Criar policy para threat model

Leia os IDs do threat model.

Valide que toda ameaça com status:

```text
TEST_REQUIRED
```

possui requirement na matriz.

Ameaças documentais podem usar:

```text
MANUAL_REVIEW;

OPERATIONAL_CONTROL;

FUTURE_TEST.
```

Nenhuma ameaça fica sem decisão.

---

### 7. Criar SecurityFixtureFactory

```java
public final class SecurityFixtureFactory {

    public static final UUID TENANT_ALPHA =
            UUID.fromString(
                "10000000-0000-0000-0000-000000000001"
            );

    public static final UUID TENANT_BETA =
            UUID.fromString(
                "20000000-0000-0000-0000-000000000002"
            );

    public static final UUID USER_ALPHA =
            UUID.fromString(
                "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
            );

    public static final UUID USER_BETA =
            UUID.fromString(
                "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
            );

    private SecurityFixtureFactory() {
    }
}
```

IDs são sintéticos e previsíveis.

---

### 8. Criar SecurityTestData

Centralize sentinelas:

```java
public final class SecurityTestData {

    public static final String PASSWORD =
            "password-secret-sentinel";

    public static final String ACCESS_TOKEN =
            "access-token-secret-sentinel";

    public static final String REFRESH_TOKEN =
            "refresh-token-secret-sentinel";

    public static final String EMAIL =
            "email-sentinel@example.test";

    public static final String ADDRESS =
            "address-secret-sentinel";

    public static final String SQL =
            "select secret-sentinel";

    private SecurityTestData() {
    }
}
```

Não reutilize credenciais reais.

---

### 9. Criar configuração de Clock

```java
@TestConfiguration
public class SecurityTestClockConfiguration {

    public static final Instant NOW =
            Instant.parse(
                "2026-07-12T00:00:00Z"
            );

    @Bean
    @Primary
    Clock securityTestClock() {
        return Clock.fixed(
                NOW,
                ZoneOffset.UTC
        );
    }
}
```

Importe apenas nas suítes que precisam.

---

### 10. Criar JwtBoundarySecurityTest

Use MockMvc e suporte de Resource Server.

Cenários:

- JWT válido;
- issuer incorreto;
- audience incorreta;
- expirado;
- ainda não válido;
- signature inválida em integração dedicada;
- authority ausente;
- bearer malformado;
- header duplicado.

Evidência mínima:

```text
status;

code;

content type;

no-store;

sem redirect;

sem side effect.
```

---

### 11. Usar jwt() com cuidado

Exemplo:

```java
mockMvc.perform(
        get(
            "/api/v2/service-orders"
        )
        .with(
            jwt()
                .jwt(
                    token ->
                        token
                            .issuer(
                                "https://issuer.example.test"
                            )
                            .subject(
                                USER_ALPHA.toString()
                            )
                            .claim(
                                "aud",
                                List.of(
                                    "service-order-api"
                                )
                            )
                )
                .authorities(
                    new SimpleGrantedAuthority(
                        "service-order:read"
                    )
                )
        )
)
.andExpect(
        status().isOk()
);
```

`jwt()` pula a verificação criptográfica real.

Use-o para regras posteriores à autenticação.

Validação criptográfica precisa de teste separado com token assinado.

---

### 12. Criar teste criptográfico

Use o par de chaves de teste já criado para JWT.

Gere tokens:

- assinatura válida;
- assinatura por chave não confiável;
- `kid` desconhecido;
- algoritmo não permitido;
- issuer errado;
- audience errada.

Passe o Bearer raw ao filtro real.

Nenhuma private key de produção entra no teste.

---

### 13. Criar AuthenticationErrorContractTest

Cenários:

```text
sem Authorization;

Bearer vazio;

token inválido;

token expirado;

refresh inválido;

credencial incorreta.
```

Valide:

- `401`;
- Problem Details;
- code uniforme;
- `no-store`;
- ausência de stack trace;
- ausência de token;
- ausência de username;
- ausência de `Location`.

---

### 14. Criar OIDC test determinístico

Para o laboratório:

```java
mockMvc.perform(
        get(
            "/labs/keycloak/me"
        )
        .with(
            oidcLogin()
                .idToken(
                    token ->
                        token
                            .issuer(
                                URI.create(
                                    "http://localhost:8180/realms/formacao-java"
                                )
                            )
                            .subject(
                                "subject-synthetic"
                            )
                )
        )
)
.andExpect(
        status().isOk()
)
.andExpect(
        jsonPath("$.subject")
            .value(
                "subject-synthetic"
            )
);
```

Valide que tokens não aparecem na response.

---

### 15. Criar SecurityHeadersContractTest

Para responses de sucesso e erro, valide conforme a baseline:

```text
X-Content-Type-Options;

Content-Security-Policy
quando aplicável;

Referrer-Policy;

Permissions-Policy;

Cache-Control.
```

Não copie um conjunto de headers para endpoints incompatíveis.

Teste o contrato decidido na aula 416.

---

### 16. Criar CORS e CSRF tests

CORS:

- origin permitida;
- origin não permitida;
- preflight válido;
- method não permitido;
- credentials conforme policy.

CSRF:

- API Bearer stateless não depende de cookie;
- laboratório OIDC stateful exige token em métodos não seguros;
- request sem CSRF é rejeitada;
- request com `csrf()` é aceita quando autorizada.

Não misture as duas chains.

---

### 17. Criar TenantBoundarySecurityTest

Cenários representativos:

- usuário Alpha lista Alpha;
- Alpha não lê Beta;
- Alpha seleciona Beta sem membership;
- global admin sem tenant;
- global admin com tenant;
- count não vaza Beta.

A matriz completa de roles fica para a aula 444.

---

### 18. Criar MassAssignmentBoundaryTest

Envie:

```text
tenantId;

ownerUserId;

status;

version;

createdAt;

authorities;

nested owner.
```

Para cada payload, valide:

- `400`;
- code;
- repository unchanged;
- audit success absent;
- event absent;
- cache unchanged.

---

### 19. Criar SecurityRateLimitBoundaryTest

Com Redis real:

- permite até o limite;
- próxima request recebe `429`;
- `Retry-After` positivo;
- TTL libera;
- Redis indisponível gera `503`;
- login não chama `AuthenticationManager` após deny;
- export não consulta repository após deny;
- sentinelas não aparecem no Redis ou log.

---

### 20. Criar SensitiveLoggingBoundaryTest

Execute cenários com:

```text
password;

access token;

refresh token;

email;

address;

description;

SQL;

CRLF.
```

Capture logs.

Confirme:

- nenhuma sentinela;
- uma entrada por evento;
- JSON estruturado válido;
- correlation ID correto;
- MDC limpo.

---

### 21. Criar SecurityAuditBoundaryTest

Cenários:

- login success;
- login failure;
- permission denial;
- ownership denial;
- tenant denial;
- OS update;
- refresh reuse;
- personal data export.

Valide:

- action;
- outcome;
- actor quando aplicável;
- tenant validado;
- target;
- correlation ID;
- ausência de secrets;
- rollback correto.

---

### 22. Criar DependencySecurityGateTest

Esse teste não executa o scanner novamente.

Ele valida a configuração:

- profile existe;
- plugin possui versão;
- `failOnError=true`;
- threshold presente;
- suppression file existe;
- unused suppression falha;
- SBOM plugin existe;
- plugins não usam `LATEST`.

A execução real permanece no gate SCA.

---

### 23. Criar asserções reutilizáveis

```java
public final class SecurityResponseAssertions {

    public static ResultMatcher
    isProblem(
            int status,
            String code
    ) {
        return result -> {
            assertThat(
                result.getResponse()
                      .getStatus()
            )
            .isEqualTo(status);

            assertThat(
                result.getResponse()
                      .getContentType()
            )
            .isCompatibleWith(
                MediaType.APPLICATION_PROBLEM_JSON
            );

            assertThat(
                result.getResponse()
                      .getContentAsString()
            )
            .contains(
                "\"code\":\"" + code + "\""
            );
        };
    }

    private SecurityResponseAssertions() {
    }
}
```

Não torne a assertion permissiva demais.

---

### 24. Criar asserção de não vazamento

```java
public static void assertDoesNotContain(
        String content,
        String... forbiddenValues
) {
    for (
        String forbidden :
        forbiddenValues
    ) {
        assertThat(content)
                .doesNotContain(
                    forbidden
                );
    }
}
```

Use em responses, logs e reports de teste.

---

### 25. Criar SecurityNegativeAssertionPolicyTest

Inspecione testes marcados com `@Tag("security")`.

A baseline exige, para testes de rejeição HTTP, ao menos uma assertion além do status:

- code;
- header;
- ausência de campo;
- ausência de side effect.

Como análise de bytecode seria excessiva, o policy test pode exigir uma annotation própria:

```java
@SecurityNegativeTest(
    verifies = {
        "problem-code",
        "no-side-effects"
    }
)
```

A annotation documenta a intenção.

---

### 26. Criar DisabledSecurityTestPolicyTest

Escaneie classes com tag `security`.

Falhe se encontrar:

```java
@Disabled
```

ou:

```text
maven test exclusion
para security packages.
```

Uma exceção temporária exige:

- ticket;
- owner;
- expiração;
- aprovação;
- registro no risk register.

A baseline da aula não cria exceções.

---

### 27. Criar SecurityTestTagPolicyTest

Valide que classes em:

```text
security/testing;

security/authentication;

security/tenant;

security/privacy;

security/supplychain.
```

possuem:

```text
@Tag("security")
```

e uma tag de camada.

Isso permite seleção previsível no CI.

---

### 28. Configurar Surefire

No `pom.xml`, mantenha testes rápidos como default.

Exemplo:

```xml
<configuration>
    <excludedGroups>
        security-external
    </excludedGroups>
</configuration>
```

Não exclua:

- unit;
- web;
- integration;
- policy;
- supply chain config tests.

O profile externo será separado.

---

### 29. Configurar profile external smoke

```xml
<profile>
    <id>security-external-smoke</id>

    <properties>
        <groups>
            security-external
        </groups>
    </properties>
</profile>
```

O smoke de Keycloak exige ambiente explicitamente iniciado.

Ele não roda silenciosamente contra qualquer URL.

---

### 30. Configurar execução local

Suíte rápida:

```powershell
.\mvnw.cmd test
```

Somente segurança:

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

Policy:

```powershell
.\mvnw.cmd `
  -Dgroups=security-policy `
  test
```

External:

```powershell
.\mvnw.cmd `
  -Psecurity-external-smoke `
  test
```

---

### 31. Organizar pipeline

Jobs sugeridos:

```text
unit-and-web;

security-policy;

security-integration;

security-sca;

security-external-smoke
quando aplicável.
```

O branch protection exige os jobs aprovados.

External smoke pode ser obrigatório somente para release ou mudança de identidade.

---

### 32. Isolar Testcontainers

Use containers estáticos por classe ou suíte quando seguro.

Limpe dados entre testes com:

- transaction rollback;
- repository cleanup;
- schema reset controlado;
- Redis flush em database exclusivo.

Nunca aponte os testes para banco compartilhado.

---

### 33. Aguardar readiness

Testcontainers já oferece mecanismos de espera.

Não use:

```java
Thread.sleep(
    10_000
);
```

Defina uma wait strategy apropriada quando o container customizado exigir readiness real.

Porta aberta não garante que migrations ou health estejam prontos.

---

### 34. Proteger execução externa

Smoke tests nunca usam:

- produção;
- usuário real;
- tenant real;
- client secret real não dedicado;
- dados pessoais;
- endpoint destrutivo.

Use realm, client e usuários sintéticos.

---

### 35. Criar execução documentada

Arquivo:

```text
docs/security/M15_SECURITY_TEST_EXECUTION.md
```

Inclua:

- pré-requisitos;
- comandos;
- tags;
- Docker;
- profiles;
- artifacts;
- troubleshooting;
- ordem dos jobs;
- política de falha;
- proibição de `@Disabled`.

---

### 36. Criar política de evidência

Arquivo:

```text
docs/security/M15_SECURITY_TEST_EVIDENCE.md
```

Defina:

```text
JUnit XML;

Surefire reports;

Testcontainers logs sanitizados;

dependency reports;

SBOM;

commit SHA;

build ID;

test matrix version.
```

Não armazene payloads sensíveis como evidência.

---

### 37. Atualizar threat model

Adicione:

```text
THR-241:
controle de segurança existe
sem teste rastreável.

THR-242:
teste valida apenas status
e ignora side effect.

THR-243:
mock substitui integração real
em todos os cenários.

THR-244:
security test depende
de tempo real.

THR-245:
fixture usa secret real.

THR-246:
teste externo atinge produção.

THR-247:
security test é desabilitado
para estabilizar pipeline.

THR-248:
MDC e dados vazam
entre testes.

THR-249:
matriz aponta para teste removido.

THR-250:
report contém sentinela
ou dado pessoal.

THR-251:
container é considerado pronto
somente pela porta.

THR-252:
suíte completa de segurança
não roda antes da release.
```

Controles:

- matriz;
- negative assertions;
- Testcontainers;
- Clock;
- fixtures sintéticas;
- ambiente dedicado;
- policy test;
- cleanup;
- reflection check;
- evidence policy;
- readiness;
- release gate.

---

### 38. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
tenant e ownership:
testes representativos.

matriz completa:
aula 444.
```

A02 Security Misconfiguration:

```text
headers;

CORS;

CSRF;

errors;

profiles.
```

A03 Supply Chain:

```text
gate e configuração:
testados.
```

A07 Authentication Failures:

```text
JWT;

login;

refresh;

OIDC;

rate limit.
```

A09 Logging:

```text
sentinelas;

MDC;

audit;

no disclosure.
```

Baseline:

```text
security requirements:
matriz.

unit:
rápido.

web:
MockMvc.

integration:
PostgreSQL e Redis reais.

external:
isolado.

negative assertions:
obrigatórias.

disabled security tests:
proibidos.

produção pública:
NO-GO.
```

---

### 39. Executar o gate

Suíte de segurança:

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

Integração:

```powershell
.\mvnw.cmd `
  -Dgroups=security-integration `
  test
```

Policy:

```powershell
.\mvnw.cmd `
  -Dgroups=security-policy `
  test
```

SCA:

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

Gate completo:

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  clean verify
```

Confirme:

- matrix válida;
- threat IDs;
- classes e métodos existentes;
- tags;
- nenhum `@Disabled`;
- Clock fixo;
- fixtures sintéticas;
- JWT;
- OIDC;
- headers;
- CORS e CSRF;
- tenant;
- mass assignment;
- rate limiting;
- logs;
- auditoria;
- dependency config;
- PostgreSQL;
- Redis;
- reports;
- nenhuma sentinela.

---

## Entendendo o que foi feito

### Ameaças ganharam testes rastreáveis

Cada requirement aponta para uma classe, método e evidência.

### A suíte ganhou camadas

Políticas puras não precisam de Spring; persistência e Redis usam integração real.

### Mocks ganharam limite claro

Eles ajudam a testar regras específicas, mas não substituem todos os componentes reais.

### Asserções negativas ficaram explícitas

Rejeição agora inclui ausência de mutação e vazamento.

### Tempo e dados ficaram determinísticos

Clock, UUIDs e sentinelas são controlados.

### Testes externos ficaram isolados

Keycloak real não torna toda a suíte lenta ou dependente do ambiente.

### Policy tests protegeram a suíte

Matriz quebrada, tags ausentes e testes desabilitados falham no build.

### Evidências ficaram reproduzíveis

Reports são ligados ao commit e à versão da matriz.

---

## Erros comuns importantes

### Criar um único teste chamado security

Ele não documenta a propriedade validada.

### Testar somente happy path

Segurança aparece principalmente em condições proibidas.

### Verificar somente status

O estado pode ter sido alterado antes da response.

### Mockar PostgreSQL e Redis em tudo

Races, transactions e TTLs reais ficam sem cobertura.

### Usar sleep

O teste se torna lento e instável.

### Colocar token real em fixture

O repositório e reports passam a conter credencial.

### Rodar smoke contra produção

O teste pode causar impacto ou incidente.

### Desabilitar teste instável

A propriedade deixa de ser protegida.

### Duplicar toda a aplicação no teste

Fixtures precisam ser mínimas e legíveis.

### Confundir coverage com segurança

Alta cobertura de linhas não garante cenários de ameaça.

---

## Comandos úteis

### Suíte de segurança

```powershell
.\mvnw.cmd `
  -Dgroups=security `
  test
```

### Policy tests

```powershell
.\mvnw.cmd `
  -Dgroups=security-policy `
  test
```

### Integração

```powershell
.\mvnw.cmd `
  -Dgroups=security-integration `
  test
```

### Gate SCA

```powershell
.\mvnw.cmd `
  -Psecurity-sca `
  verify
```

### Procurar teste desabilitado

```powershell
git grep `
  -n `
  -E `
  "@Disabled|security.*skip"
```

---

## Exercício guiado

### Parte 1 — Requisitos

Transforme ameaças em propriedades observáveis.

### Parte 2 — Matriz

Ligue threat, control, test e evidence.

### Parte 3 — Camadas

Classifique unit, web, integration, policy e external.

### Parte 4 — Fixtures

Crie IDs, Clock e sentinelas sintéticas.

### Parte 5 — Autenticação

Teste JWT, OIDC e erros.

### Parte 6 — Fronteiras

Teste tenant, mass assignment e privacidade.

### Parte 7 — Infraestrutura

Teste Redis, PostgreSQL e indisponibilidade.

### Parte 8 — Observabilidade

Teste logs, MDC e auditoria.

### Parte 9 — Pipeline

Crie tags, jobs e gates.

### Parte 10 — Evidência

Documente artifacts e rastreabilidade.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 442 foi preservada;
- teste funcional e teste de segurança foram diferenciados;
- ameaças foram transformadas em requirements;
- unit, web, integration, policy, contract e external foram separados;
- matriz YAML foi criada;
- IDs de requirements são estáveis;
- threat IDs, controls, tests, owner e evidence foram registrados;
- matrix policy test valida classes e métodos;
- ameaças sem teste recebem decisão explícita;
- tags de segurança foram criadas;
- fixtures usam somente dados sintéticos;
- Clock fixo foi configurado;
- randomness é testada por propriedades;
- JWT com mocks e criptografia real foram separados;
- OIDC determinístico usa `oidcLogin()`;
- headers, CORS, CSRF e errors foram testados;
- tenant recebeu cenários representativos;
- mass assignment valida ausência de side effects;
- rate limiting usa Redis real;
- logs e auditoria usam sentinelas;
- SCA config possui teste de policy;
- asserções negativas foram formalizadas;
- testes de segurança desabilitados foram proibidos;
- tags foram verificadas;
- Surefire separa external smoke;
- Keycloak real não roda em produção;
- Testcontainers possui isolamento e readiness;
- execução local e CI foram documentadas;
- evidências não contêm secrets ou PII;
- threat model e OWASP foram atualizados;
- matriz completa de autorização não foi antecipada;
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
  "@Disabled|password-secret|access-token-secret"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto/security `
  labs/m14/aula-357-spring-initializr-estrutura-projeto/src/test `
  labs/m14/aula-357-spring-initializr-estrutura-projeto/pom.xml `
  docs/security `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "test(m15): consolidar estrategia de testes de seguranca"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- password real;
- token real;
- private key de produção;
- dados pessoais;
- output com sentinela;
- relatório local instável;
- container log sem sanitização;
- credenciais do Keycloak;
- teste apontando para produção.

---

## Fechamento e ponte para a próxima aula

Nesta aula, os controles do módulo ganharam uma estratégia de teste comum.

A rastreabilidade ficou:

```text
threat;

requirement;

control;

test;

layer;

evidence;

owner.
```

A suíte foi organizada em:

```text
unit;

web;

integration;

policy;

contract;

external;

supply chain.
```

Os testes passaram a exigir:

```text
input hostil;

contrato seguro;

ausência de side effects;

dados sintéticos;

tempo controlado;

ambiente isolado;

evidência reproduzível.
```

PostgreSQL e Redis reais foram mantidos nas integrações.

JWT e OIDC receberam suporte determinístico sem eliminar testes criptográficos e smoke tests separados.

A decisão central foi:

```text
testar segurança
não é executar um scanner
ou verificar um status;

é comprovar propriedades
derivadas de ameaças
em todas as fronteiras relevantes.
```

A arquitetura da suíte está pronta.

A próxima etapa aprofundará a área mais combinatória do módulo:

```text
quem pode fazer o quê
sobre qual recurso
em qual tenant
e em qual estado?
```

A próxima aula será:

```text
444 - M15.34 - Testes de autorizacao
```

Nela, você irá:

- criar uma matriz actor-action-resource;
- combinar roles e authorities;
- testar ownership;
- testar tenant;
- testar administradores globais;
- testar Method Security;
- testar chamada HTTP e chamada direta;
- diferenciar `403` e `404`;
- testar decisões em lote;
- provar deny-by-default.

---

# Material complementar

## Checkpoint final

- [ ] Liguei ameaças a requirements e testes.
- [ ] Separei as camadas da suíte.
- [ ] Usei fixtures e Clock determinísticos.
- [ ] Validei rejeição e ausência de side effects.
- [ ] Criei tags, policies, execução e evidências.

---

## Troubleshooting adicional

### A matriz aponta para método inexistente

Atualize a matriz ou restaure o teste.

Não remova a rastreabilidade silenciosamente.

### A suíte de segurança demora demais

Revise tags, reuse seguro de containers e separação do smoke externo.

Não substitua integrações essenciais por mocks.

### Teste de token falha com Clock da máquina

Injete o Clock de teste no validator e no emissor.

### Redis test passa isolado e falha em conjunto

Verifique database dedicado, cleanup e keys compartilhadas.

### Sentinela aparece no report

Localize response, log ou failure message que a reproduziu.

Não masque apenas o artifact.

### Teste está flaky

Remova sleeps, controle tempo, espere readiness e isole state.

### Keycloak smoke tenta acessar ambiente incorreto

Exija profile e base URL explicitamente locais.

Falhe antes de executar se a URL não estiver em allowlist.

### Policy test não entende uma exceção legítima

Crie uma exceção estreita, com ticket e expiração, sem desabilitar a policy inteira.

---

## Perguntas de revisão

1. O que um teste de segurança comprova?
2. O que é security requirement?
3. Quando usar unit test?
4. Quando usar MockMvc?
5. Quando usar Testcontainers?
6. O que é policy test?
7. O que é external smoke?
8. Por que validar side effects?
9. Por que usar Clock?
10. SecureRandom deve gerar valor fixo?
11. Fixtures podem usar tokens reais?
12. O que a matriz relaciona?
13. Security test pode ficar desabilitado?
14. Coverage de linhas prova segurança?
15. `jwt()` valida assinatura real?
16. `oidcLogin()` substitui Keycloak real?
17. O que entra na evidência?
18. Smoke pode apontar para produção?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Uma propriedade derivada de ameaça.
2. Comportamento seguro observável.
3. Para políticas puras.
4. Para FilterChain e contrato HTTP.
5. Para PostgreSQL, Redis e integrações reais.
6. Guardrail sobre código e configuração.
7. Validação separada com componente externo.
8. Porque a rejeição pode ocorrer tarde.
9. Para determinismo temporal.
10. Não; teste propriedades.
11. Não.
12. Threat, control, test e evidence.
13. Não sem exceção governada.
14. Não.
15. Não.
16. Não.
17. Reports, commit, matriz e ambiente.
18. Não.
19. Testes de autorizacao.
20. Actor, ação, recurso, tenant e estado.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 443 - M15.33 - Testes de seguranca

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei teste funcional e teste de segurança.
- Transformei ameaças em requisitos observáveis.
- Separei unit, web, integration, policy, contract, external e supply-chain tests.
- Criei `security/security-test-matrix.yaml`.
- Liguei threat, requirement, control, test, layer, evidence e owner.
- Criei `SecurityTestMatrixPolicyTest`.
- Validei classes e métodos referenciados pela matriz.
- Exigi decisão para ameaças ainda não automatizadas.
- Criei tags de segurança por camada.
- Criei `SecurityFixtureFactory`.
- Usei UUIDs sintéticos.
- Criei `SecurityTestData` com sentinelas.
- Criei `SecurityTestClockConfiguration`.
- Removi dependência de relógio real.
- Testei randomness por propriedades.
- Organizei testes JWT com mocks e assinatura real.
- Usei `oidcLogin()` para testes determinísticos.
- Mantive Keycloak real em smoke separado.
- Testei contrato de autenticação.
- Testei headers, CORS e CSRF.
- Testei cenários representativos de tenant.
- Testei mass assignment com ausência de side effects.
- Testei rate limiting com Redis real.
- Testei logs e auditoria com sentinelas.
- Testei a configuração do gate de dependências.
- Criei asserções reutilizáveis de Problem Details.
- Criei asserções de não vazamento.
- Criei `SecurityNegativeAssertionPolicyTest`.
- Proibi `@Disabled` em testes de segurança.
- Criei `SecurityTestTagPolicyTest`.
- Separei external smoke no Maven.
- Organizei jobs de pipeline por camada.
- Isolei PostgreSQL e Redis com Testcontainers.
- Proibi smoke contra produção.
- Criei `M15_SECURITY_TEST_STRATEGY.md`.
- Criei `M15_SECURITY_TEST_EXECUTION.md`.
- Criei `M15_SECURITY_TEST_EVIDENCE.md`.
- Atualizei threat model, OWASP e baseline.
- Mantive produção pública como NO-GO.
- Próxima aula: Testes de autorizacao.
```

---

## Referência técnica curta

- [Spring Security — Testing](https://docs.spring.io/spring-security/reference/servlet/test/index.html)
- [Spring Security — MockMvc Setup](https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/setup.html)
- [Spring Security — OAuth 2.0 Testing](https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/oauth2.html)
- [Spring Security — CSRF Testing](https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/csrf.html)
- [Spring Boot — Testing](https://docs.spring.io/spring-boot/reference/testing/index.html)
- [Spring Boot — Testcontainers](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html)
- [Testcontainers for Java — JUnit 5](https://java.testcontainers.org/test_framework_integration/junit_5/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/stable/)
- [OWASP Testing Guide — Principles of Testing](https://owasp.org/www-project-web-security-testing-guide/v42/1-Frontispiece/2-Principles_of_Testing/)

Regra final:

```text
testes de segurança devem nascer do threat model e comprovar requisitos observáveis: políticas puras ficam em unit tests, FilterChain e contratos em MockMvc, PostgreSQL e Redis em Testcontainers, componentes externos em smoke separado e guardrails em policy tests; cada cenário negativo valida rejeição, ausência de side effects e ausência de vazamento, usando Clock e fixtures sintéticas, enquanto uma matriz versionada liga ameaça, controle, teste e evidência e impede que controles críticos desapareçam silenciosamente da suíte.
```
