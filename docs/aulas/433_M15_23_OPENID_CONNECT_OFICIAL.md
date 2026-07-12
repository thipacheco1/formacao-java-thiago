# 433 - M15.23 - OpenID Connect

## Apresentação da aula

Na aula 432, OAuth 2.0 foi estudado como um framework de autorização delegada.

Os papéis ficaram separados:

```text
Resource Owner:
concede acesso.

Client:
solicita acesso.

Authorization Server:
autoriza e emite tokens.

Resource Server:
protege recursos.
```

As credenciais também ganharam destinos distintos:

```text
authorization code:
vai ao token endpoint.

access token:
vai ao Resource Server.

refresh token:
vai ao Authorization Server.

client credential:
autentica um client confidencial.
```

A conclusão principal foi:

```text
OAuth 2.0 não é,
por si só,
um protocolo de autenticação
de usuário.
```

Ele define como um client obtém autorização limitada para acessar recursos.

Ainda falta uma resposta interoperável para perguntas como:

```text
quem foi autenticado?

qual provedor realizou
a autenticação?

para qual client
a identidade foi emitida?

quando a autenticação ocorreu?

como a resposta é ligada
à tentativa iniciada?
```

A camada que acrescenta identidade sobre OAuth 2.0 é:

```text
OpenID Connect 1.0.
```

OpenID Connect, normalmente abreviado como OIDC, adiciona:

- o scope `openid`;
- o ID Token;
- claims padronizadas;
- regras de validação;
- UserInfo Endpoint;
- discovery;
- metadata do provedor;
- uso de `nonce`;
- semântica de autenticação para o client.

A pergunta central desta aula será:

```text
como um client verifica
a identidade autenticada
sem confundir ID Token,
access token,
profile de usuário
e autorização da API?
```

A resposta começa pela separação de três artefatos:

```text
ID Token:
declaração de autenticação
destinada ao client.

Access Token:
credencial de autorização
destinada ao Resource Server.

UserInfo:
claims adicionais do usuário
obtidas com access token.
```

Um ID Token costuma ser um JWT.

Isso não significa que qualquer JWT seja um ID Token.

Também não significa que um access token JWT possa ser usado como prova de login.

As audiences são diferentes.

Exemplo:

```text
ID Token audience:
client_id do Relying Party.

Access Token audience:
identificador da API.
```

A API de Ordens de Serviço espera:

```text
aud:
service-order-api.
```

Um futuro client web OIDC poderá esperar:

```text
aud:
service-order-web.
```

Aceitar o ID Token na API criaria token substitution.

Aceitar um access token como sessão de login criaria confusão entre identidade e autorização.

Nesta aula, o projeto não integrará um provedor real.

Não serão adicionados:

- Keycloak;
- `oauth2Login()`;
- client registration;
- redirect URI real;
- callback HTTP;
- sessão web;
- login social;
- logout OIDC;
- token exchange.

A aula 435 criará o ambiente local do Keycloak.

Antes disso, esta aula produzirá:

```text
docs/security/M15_OIDC_FOUNDATIONS.md;

docs/security/M15_OIDC_VALIDATION_PROFILE.md;

OpenIdConnectFoundationsTest.java.
```

O laboratório será conceitual e test-only.

Ele modelará:

- End-User;
- OpenID Provider;
- Relying Party;
- Authentication Request;
- ID Token;
- UserInfo;
- discovery metadata;
- `state`;
- `nonce`;
- validações obrigatórias;
- prevenção de token substitution;
- minimização de claims.

Um ID Token só será considerado aceitável quando:

- a signature estiver validada;
- o algoritmo estiver permitido;
- o issuer for exato;
- a audience contiver o client ID;
- `azp` for coerente quando necessário;
- `exp` ainda for válido;
- `iat` for aceitável;
- `sub` existir;
- `nonce` corresponder à tentativa;
- as claims possuírem tipos esperados.

A próxima aula será:

```text
434 - M15.24 - PKCE
```

Nela, o authorization code será ligado à instância que iniciou o fluxo por meio de `code_verifier` e `code_challenge`.

---

## Onde estamos na formação

A sequência oficial é:

```text
431:
Secrets management.

432:
OAuth2 fundamentos.

433:
OpenID Connect.

434:
PKCE.

435:
Keycloak ambiente local.

436:
Keycloak realm client roles.
```

A aula 432 respondeu:

```text
como a autorização delegada
separa client,
Authorization Server
e Resource Server?
```

A aula 433 responderá:

```text
como o client recebe
uma declaração verificável
sobre a autenticação
do End-User?
```

Nesta aula:

```text
OIDC:
sim.

scope openid:
sim.

ID Token:
sim.

nonce:
sim.

state:
sim.

UserInfo:
sim.

discovery:
sim.

issuer e JWKS:
sim.

Keycloak:
não.

oauth2Login runtime:
não.

PKCE profundo:
próxima aula.
```

A regra central será:

```text
ID Token autentica
a sessão do client;

Access Token autoriza
acesso ao Resource Server.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
docs/security/
├── M15_OIDC_FOUNDATIONS.md
└── M15_OIDC_VALIDATION_PROFILE.md
```

Teste:

```text
src/test/java/br/com/formacao/backend
└── configuration
    └── security
        └── oidc
            └── OpenIdConnectFoundationsTest.java
```

O mapa conceitual será:

| Conceito | Significado |
|---|---|
| End-User | Pessoa autenticada |
| OpenID Provider | Authorization Server com suporte OIDC |
| Relying Party | Client que confia no OP |
| ID Token | Declaração de autenticação destinada ao RP |
| UserInfo | Recurso protegido com claims do usuário |
| Discovery | Metadata do provedor |
| `openid` | Scope que ativa OIDC |
| `nonce` | Liga a tentativa ao ID Token |
| `sub` | Identificador do usuário no issuer |
| `aud` | Client destinatário do ID Token |

O perfil de validação exigirá:

```text
signature;

algorithm allowlist;

issuer exato;

client audience;

authorized party
quando aplicável;

expiration;

issued-at;

subject;

nonce;

UserInfo subject matching.
```

Você irá:

1. definir OIDC;
2. identificar End-User;
3. identificar OpenID Provider;
4. identificar Relying Party;
5. entender `openid`;
6. diferenciar ID Token e access token;
7. estudar claims;
8. validar issuer;
9. validar audience;
10. validar `azp`;
11. validar tempo;
12. validar `nonce`;
13. diferenciar `state` e `nonce`;
14. conhecer UserInfo;
15. validar o `sub` do UserInfo;
16. conhecer discovery;
17. entender JWKS;
18. evitar e-mail como identidade;
19. criar testes conceituais;
20. preparar PKCE.

---

## Conceito essencial

### OIDC é uma camada de identidade

OpenID Connect é uma camada de identidade construída sobre OAuth 2.0.

OAuth responde:

```text
qual acesso foi concedido?
```

OIDC acrescenta:

```text
qual End-User foi autenticado
pelo OpenID Provider
para este Relying Party?
```

OIDC não remove os papéis OAuth.

Ele especializa o Authorization Server como:

```text
OpenID Provider.
```

E especializa o client como:

```text
Relying Party.
```

---

### End-User

End-User é a pessoa autenticada pelo OpenID Provider.

O Relying Party não precisa receber a password.

Fluxo:

```text
RP inicia a autenticação;

browser vai ao OP;

OP autentica o usuário;

OP devolve authorization code;

RP troca o code;

OP devolve ID Token
e normalmente access token.
```

A credencial primária permanece no domínio do provedor.

---

### OpenID Provider

OpenID Provider, ou OP, é um Authorization Server capaz de autenticar o End-User e emitir ID Tokens.

Responsabilidades:

- autenticar o usuário;
- aplicar políticas;
- validar clients;
- validar redirect URIs;
- emitir ID Token;
- publicar metadata;
- publicar chaves;
- oferecer UserInfo quando suportado.

Um Authorization Server OAuth sem suporte OIDC não é automaticamente um OP.

---

### Relying Party

Relying Party, ou RP, é o client que confia nas declarações do OP depois de validá-las.

O RP não deve confiar apenas porque:

- o JWT pode ser decodificado;
- o e-mail parece conhecido;
- o token veio do browser;
- a signature usa uma chave;
- o issuer possui nome parecido;
- o token funciona em outra API.

A confiança nasce da validação completa.

---

### O scope openid

Uma Authentication Request se torna OIDC quando inclui:

```text
scope=openid
```

Sem `openid`, a request é OAuth 2.0, não OIDC.

Scopes adicionais podem solicitar claims:

```text
profile;

email;

address;

phone.
```

A presença do scope não garante toda claim.

A policy do OP, o consentimento e a disponibilidade também influenciam.

---

### ID Token

ID Token é uma declaração de autenticação emitida pelo OP para o RP.

Normalmente é um JWT assinado.

Claims centrais:

```text
iss:
issuer do OP.

sub:
identificador do End-User.

aud:
client destinatário.

exp:
expiração.

iat:
momento de emissão.
```

Claims comuns:

```text
auth_time;

nonce;

acr;

amr;

azp;

at_hash;

c_hash.
```

O ID Token não é a credencial padrão para chamar a API.

---

### Access Token

Access token é enviado ao Resource Server.

Ele representa autorização.

O token response pode conter:

```text
id_token;

access_token;

refresh_token.
```

Cada artefato possui finalidade própria.

Proibido:

```text
Authorization: Bearer <id-token>
```

na API OS.

Também é proibido usar um access token destinado a uma API para criar sessão de usuário no RP.

---

### Subject

`sub` identifica o End-User dentro de um issuer.

A chave estável é:

```text
iss + sub.
```

Não use apenas `sub` globalmente.

Dois issuers podem emitir o mesmo texto para pessoas diferentes.

Também não use como chave principal:

- e-mail;
- username;
- nome;
- telefone.

Esses atributos podem mudar ou ser reciclados.

---

### Subject público e pairwise

Um OP pode usar subject:

```text
public:
mesmo sub para vários clients.

pairwise:
sub diferente por setor
ou por client.
```

Pairwise subject reduz correlação entre aplicações.

O RP trata `sub` como opaco.

Ele não deve inferir ID interno, e-mail, tenant ou significado humano.

---

### Issuer

`iss` identifica o OP.

A comparação precisa ser exata.

Não use:

- `startsWith`;
- `contains`;
- host parcial;
- alias não documentado;
- normalização inventada.

O issuer usado na discovery deve corresponder ao issuer do ID Token.

---

### Audience e azp

No ID Token, `aud` identifica o RP.

A audience deve conter:

```text
client_id esperado.
```

Se houver múltiplas audiences, `azp` precisa ser coerente com o client autorizado.

Baseline:

```text
aud única:
client_id esperado.

aud múltipla:
client_id presente
e azp igual ao client_id.
```

Um token destinado à audience `service-order-api` não é um ID Token válido para `service-order-web`.

---

### Claims temporais

`exp` precisa estar no futuro, considerando clock skew pequeno e documentado.

`iat` não pode estar excessivamente no futuro.

`auth_time` informa quando a autenticação ocorreu quando solicitado ou exigido.

O RP não deve usar ID Token expirado para reautenticar silenciosamente.

---

### Nonce

`nonce` é criado pelo RP antes da Authentication Request.

Ele precisa ser:

- imprevisível;
- ligado à tentativa;
- armazenado temporariamente;
- enviado ao OP;
- devolvido no ID Token;
- comparado exatamente;
- consumido uma vez.

Objetivo:

```text
ligar a resposta de identidade
à autenticação iniciada
e reduzir replay ou injection.
```

O nonce não deve ser constante, contador ou timestamp puro.

---

### State, nonce e PKCE

Esses controles não são sinônimos.

`state`:

```text
liga a authorization response
ao fluxo iniciado pelo client
e mitiga CSRF.
```

`nonce`:

```text
liga o ID Token
à Authentication Request.
```

PKCE:

```text
liga o authorization code
à instância que possui
o code_verifier.
```

Os três controles podem coexistir.

---

### auth_time, acr e amr

`auth_time` registra o momento da autenticação.

`acr` representa um contexto ou nível de autenticação.

`amr` lista métodos usados, como password ou OTP.

O RP não interpreta `acr` e `amr` sem contrato explícito com o OP.

A presença de `amr=["pwd"]` não concede permission.

---

### at_hash e c_hash

`at_hash` pode ligar o access token ao ID Token em determinados fluxos.

`c_hash` pode ligar o authorization code ao ID Token em respostas híbridas.

Na futura integração, as validações suportadas pela biblioteca e pelo fluxo serão utilizadas.

Não implemente esses cálculos manualmente sem necessidade.

---

### UserInfo Endpoint

UserInfo é um protected resource do OP.

O RP envia o access token:

```http
Authorization: Bearer <access-token>
```

Exemplo de response:

```json
{
  "sub": "subject-opaco",
  "name": "Pessoa",
  "email": "pessoa@example.test",
  "email_verified": true
}
```

UserInfo não substitui a validação do ID Token.

---

### Correspondência de subject

O `sub` do UserInfo precisa ser exatamente igual ao `sub` do ID Token.

Se divergir:

```text
rejeitar.
```

Não aceite UserInfo apenas porque o e-mail coincide.

---

### Claims de profile

Claims como `name`, `preferred_username`, `picture`, `locale`, `email` e `phone_number` são atributos de profile.

Elas não concedem roles ou permissions automaticamente.

O e-mail pode mudar ou ser reciclado.

Mesmo com `email_verified=true`, a chave de identidade continua sendo `iss + sub`.

---

### Minimização de claims

O RP deve solicitar e armazenar somente claims necessárias.

Evite pedir address, phone ou birthdate quando a aplicação precisa apenas de:

```text
sub;

name para exibição.
```

Menos claims significam menor impacto de vazamento, menor retenção e menor acoplamento.

---

### Discovery

OIDC Discovery publica metadata em:

```text
/.well-known/openid-configuration
```

A metadata pode informar:

- `issuer`;
- `authorization_endpoint`;
- `token_endpoint`;
- `userinfo_endpoint`;
- `jwks_uri`;
- scopes;
- response types;
- subject types;
- algoritmos;
- autenticação de client.

O RP não deve construir endpoints por concatenação quando discovery é utilizada.

---

### JWKS

`jwks_uri` aponta para public keys do OP.

O RP usa essas chaves para validar signatures.

Controles:

- issuer confiável;
- HTTPS;
- algorithm allowlist;
- cache e rotação;
- `kid` usado apenas para selecionar chave;
- rejeitar chave ausente;
- não buscar URL arbitrária do token.

O header do token não escolhe um endpoint externo de chave.

---

### Discovery não é confiança automática

Baixar metadata não significa confiar em qualquer issuer.

O issuer precisa vir de configuração ou processo confiável.

Proibido:

```text
request informa issuer;

aplicação faz discovery;

aplicação confia automaticamente.
```

Esse padrão pode permitir SSRF e provedor malicioso.

---

### Ordem de validação

A ordem conceitual será:

1. parsear com limite;
2. restringir algoritmo;
3. selecionar chave do issuer confiável;
4. verificar signature;
5. validar `iss`;
6. validar `aud`;
7. validar `azp`;
8. validar `exp`;
9. validar `iat`;
10. validar `nonce`;
11. exigir `sub`;
12. validar tipos;
13. validar hashes quando aplicável;
14. criar identidade local.

Claims só viram identidade depois dessas verificações.

---

## Mão na massa guiada

### 1. Criar M15_OIDC_FOUNDATIONS.md

Arquivo:

```text
docs/security/M15_OIDC_FOUNDATIONS.md
```

Inclua:

```markdown
# OpenID Connect

## Objetivo

Adicionar identidade interoperavel sobre OAuth2.

## Papeis

- End-User.
- OpenID Provider.
- Relying Party.

## Artefatos

- Authentication Request.
- Authorization Code.
- ID Token.
- Access Token.
- UserInfo.

## Regra

ID Token e destinado ao client.
Access Token e destinado a API.
```

---

### 2. Criar o perfil de validação

Arquivo:

```text
docs/security/M15_OIDC_VALIDATION_PROFILE.md
```

Tabela:

| Item | Regra |
|---|---|
| Issuer | Comparação exata |
| Algoritmo | Allowlist assimétrica |
| Signature | Obrigatória |
| Audience | Deve conter o client ID |
| `azp` | Coerente em múltiplas audiences |
| Expiração | Obrigatória |
| Emissão | Não pode estar no futuro além do skew |
| Subject | Obrigatório e opaco |
| Nonce | Igual ao valor armazenado |
| UserInfo `sub` | Igual ao ID Token |
| E-mail | Nunca identificador principal |
| Claims | Minimização |

---

### 3. Criar modelos test-only

```java
record OidcProviderMetadata(
        URI issuer,
        URI authorizationEndpoint,
        URI tokenEndpoint,
        URI userInfoEndpoint,
        URI jwksUri,
        Set<String> idTokenAlgorithms
) {
}
```

```java
record OidcAuthenticationAttempt(
        String clientId,
        String state,
        String nonce,
        Instant createdAt
) {
}
```

```java
record OidcIdTokenClaims(
        URI issuer,
        String subject,
        List<String> audience,
        String authorizedParty,
        Instant issuedAt,
        Instant expiresAt,
        String nonce
) {
}
```

Esses records não fazem parte do runtime.

---

### 4. Criar OidcValidationResult

```java
record OidcValidationResult(
        boolean valid,
        String reason
) {
    static OidcValidationResult valid() {
        return new OidcValidationResult(
                true,
                "valid"
        );
    }

    static OidcValidationResult invalid(
            String reason
    ) {
        return new OidcValidationResult(
                false,
                reason
        );
    }
}
```

Os reasons existem apenas nos testes.

---

### 5. Criar validator conceitual

```java
OidcValidationResult validate(
        OidcProviderMetadata provider,
        OidcAuthenticationAttempt attempt,
        OidcIdTokenClaims token,
        Instant now,
        Duration clockSkew
) {
    if (
        !provider.issuer()
                .equals(token.issuer())
    ) {
        return invalid(
                "issuer mismatch"
        );
    }

    if (
        token.audience() == null
        || !token.audience()
                .contains(
                        attempt.clientId()
                )
    ) {
        return invalid(
                "audience mismatch"
        );
    }

    if (
        token.audience().size() > 1
        && !attempt.clientId()
                .equals(
                        token.authorizedParty()
                )
    ) {
        return invalid(
                "authorized party mismatch"
        );
    }

    if (
        token.subject() == null
        || token.subject().isBlank()
    ) {
        return invalid(
                "missing subject"
        );
    }

    if (
        token.expiresAt() == null
        || token.expiresAt()
                .plus(clockSkew)
                .isBefore(now)
    ) {
        return invalid(
                "expired"
        );
    }

    if (
        token.issuedAt() == null
        || token.issuedAt()
                .isAfter(
                        now.plus(clockSkew)
                )
    ) {
        return invalid(
                "invalid issued-at"
        );
    }

    if (
        !attempt.nonce()
                .equals(token.nonce())
    ) {
        return invalid(
                "nonce mismatch"
        );
    }

    return valid();
}
```

A validação criptográfica é uma precondition.

Na integração real, use o decoder da biblioteca.

---

### 6. Modelar validação criptográfica

Crie:

```java
record VerifiedIdToken(
        String algorithm,
        String keyId,
        OidcIdTokenClaims claims
) {
}
```

O validator de identidade recebe apenas `VerifiedIdToken`.

Teste que um token sem signature verificada nunca chega à validação de claims.

Regra:

```text
decodificar não é validar.
```

---

### 7. Testar cenário válido

Use:

```text
issuer:
https://idp.example.test.

clientId:
service-order-web.

aud:
service-order-web.

sub:
user-opaque-123.

nonce:
valor da tentativa.

exp:
cinco minutos no futuro.

iat:
agora.
```

Esperado:

```text
válido.
```

---

### 8. Testar issuer incorreto

Token:

```text
iss:
https://attacker.example.
```

Metadata:

```text
https://idp.example.test.
```

Esperado:

```text
inválido.
```

Não aceite issuer parecido.

---

### 9. Testar audience da API

Use:

```text
aud:
service-order-api.
```

O RP espera:

```text
service-order-web.
```

Esperado:

```text
inválido.
```

Esse cenário representa token substitution.

---

### 10. Testar múltiplas audiences

Token:

```text
aud:
service-order-web;
another-client.

azp:
service-order-web.
```

Esperado:

```text
válido.
```

Troque `azp` para `another-client`.

Esperado:

```text
inválido.
```

---

### 11. Testar tempo

Cenários:

- `exp` no passado;
- `iat` além do skew;
- `exp` ausente;
- `iat` ausente.

Todos:

```text
inválidos.
```

Use `Clock` controlado.

---

### 12. Testar nonce

Tentativa:

```text
nonce:
nonce-original.
```

Token:

```text
nonce:
nonce-replay.
```

Esperado:

```text
inválido.
```

Depois, consuma o nonce.

Uma segunda validação da mesma tentativa precisa falhar no storage temporário do RP.

---

### 13. Testar state separadamente

Crie:

```java
boolean matchesState(
        String expected,
        String received
) {
    return MessageDigest.isEqual(
            expected.getBytes(
                    StandardCharsets.UTF_8
            ),
            received.getBytes(
                    StandardCharsets.UTF_8
            )
    );
}
```

Teste:

- state correto;
- ausente;
- diferente;
- reutilizado.

Não use state como nonce.

---

### 14. Testar identity key

Crie:

```java
record ExternalIdentityKey(
        URI issuer,
        String subject
) {
}
```

Teste:

```text
mesmo sub;
issuers diferentes;
identidades diferentes.
```

Também:

```text
mesmo issuer;
sub diferente;
identidades diferentes.
```

---

### 15. Testar UserInfo

```java
record UserInfoResponse(
        String subject,
        String name,
        String email,
        Boolean emailVerified
) {
}
```

Validator:

```java
boolean matchesIdentity(
        OidcIdTokenClaims idToken,
        UserInfoResponse userInfo
) {
    return Objects.equals(
            idToken.subject(),
            userInfo.subject()
    );
}
```

Subject diferente:

```text
rejeitar.
```

---

### 16. Testar e-mail mutável

Modele duas responses para a mesma identidade:

```text
iss + sub:
iguais.

email:
alterado.
```

A chave local permanece a mesma.

Depois modele:

```text
mesmo email;
sub diferente.
```

As identidades permanecem diferentes.

---

### 17. Testar minimização

Crie:

```java
Set<String> requiredClaims =
        Set.of(
                "sub",
                "name"
        );
```

Rejeite configuração que solicite address, phone e birthdate sem use case registrado.

O teste pode usar uma allowlist de claims.

---

### 18. Modelar discovery confiável

Metadata válida:

```text
issuer:
https://idp.example.test.

jwks_uri:
https://idp.example.test/jwks.

authorization_endpoint:
https://idp.example.test/authorize.

token_endpoint:
https://idp.example.test/token.
```

Valide:

- HTTPS;
- issuer exato;
- endpoints absolutos;
- algoritmo permitido;
- origem confiável conforme policy.

Não aceite issuer vindo de parâmetro da request.

---

### 19. Testar algoritmo

Allowlist:

```text
RS256;

ES256.
```

Rejeite:

```text
none;

HS256 não contratado;

alg desconhecido.
```

O header não escolhe a policy.

---

### 20. Criar matriz de artefatos

| Artefato | Destinatário | Finalidade | Enviado para |
|---|---|---|---|
| Authorization Code | Client | Troca temporária | Token Endpoint |
| ID Token | Relying Party | Identidade autenticada | RP |
| Access Token | Resource Server | Autorização | API |
| Refresh Token | Authorization Server | Renovação | Token Endpoint |
| UserInfo | Relying Party | Claims adicionais | RP |

A matriz deve permanecer no documento.

---

### 21. Mapear o projeto atual

Registre:

```text
API OS:
Resource Server,
não RP web.

JwtAuthenticationToken:
identidade da API,
não ID Token OIDC.

JwtTokenService:
emissor próprio,
não OP.

DatabaseUserPrincipal:
usuário interno,
não OidcUser.

M15.23:
conceitual e test-only.
```

Não altere os endpoints atuais.

---

### 22. Criar ADR de integração futura

Decisões pendentes:

1. OP escolhido;
2. issuer;
3. client ID;
4. client type;
5. redirect URIs;
6. scopes;
7. claims;
8. subject type;
9. algorithms;
10. session policy;
11. account linking;
12. logout;
13. UserInfo;
14. migração do login local.

Sem essas respostas, não habilite `oauth2Login()`.

---

### 23. Atualizar secrets inventory

Planeje:

```text
OIDC client secret:
somente RP confidencial.

private key:
quando houver private_key_jwt.

client ID:
não secret.

issuer:
não secret.

redirect URI:
não secret,
mas controlada.
```

Nenhum valor real será criado.

---

### 24. Atualizar auditoria

Planeje eventos:

```text
OIDC_AUTHENTICATION_STARTED;

OIDC_CALLBACK_RECEIVED;

OIDC_ID_TOKEN_REJECTED;

OIDC_AUTHENTICATION_SUCCEEDED;

OIDC_USERINFO_REJECTED.
```

Dados proibidos:

- ID Token;
- access token;
- code;
- nonce;
- state;
- client secret;
- claims completas.

---

### 25. Atualizar threat model

Adicione:

```text
THR-121:
ID Token é enviado ao Resource Server.

THR-122:
access token é usado como login.

THR-123:
issuer é comparado parcialmente.

THR-124:
audience do client não é validada.

THR-125:
azp incompatível é ignorado.

THR-126:
nonce não é validado.

THR-127:
state e nonce são confundidos.

THR-128:
UserInfo pertence a outro subject.

THR-129:
email é usado como chave estável.

THR-130:
discovery aceita issuer arbitrário.

THR-131:
claims excessivas são armazenadas.

THR-132:
algoritmo é escolhido pelo token.
```

Controles:

- artefatos separados;
- issuer exato;
- audience e `azp`;
- nonce;
- state;
- subject matching;
- `iss + sub`;
- issuer allowlist;
- minimização;
- algorithm allowlist.

---

### 26. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
ID Token:
não autoriza a API.

Access Token:
continua sujeito
a audience e permissions.
```

A02 Security Misconfiguration:

```text
issuer:
configurado explicitamente.

algoritmos:
allowlist.

discovery:
não controlada pelo usuário.
```

A07 Authentication Failures:

```text
nonce:
obrigatório no perfil.

state:
obrigatório no redirect.

identidade:
iss + sub.
```

Baseline:

```text
OIDC:
fundamentos mapeados.

RP:
não implementado.

OP:
não integrado.

ID Token:
não aceito na API.

UserInfo:
não integrado.

produção pública:
NO-GO.
```

---

### 27. Criar a suíte

Classe:

```java
class OpenIdConnectFoundationsTest {
}
```

Organize:

```text
nested class IdTokenValidation;

nested class StateAndNonce;

nested class UserInfo;

nested class Discovery;

nested class IdentityKey;

nested class ClaimMinimization.
```

Os testes não carregam Spring.

---

### 28. Criar guardrails

Verifique:

```text
nenhuma dependency oauth2-client nova;

nenhum client registration;

nenhum issuer real;

nenhum client secret;

nenhum redirect URI de produção;

nenhum callback;

nenhum OidcUserService customizado.
```

A ausência de integração prematura faz parte do aceite.

---

### 29. Executar o gate

Teste:

```powershell
.\mvnw.cmd `
  -Dtest=OpenIdConnectFoundationsTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Revise:

```powershell
git grep `
  -n `
  -E `
  "oauth2Login|ClientRegistration|OidcUserService|registration:"
```

Nenhuma implementação runtime nova deve aparecer.

---

## Entendendo o que foi feito

### OIDC foi colocado sobre OAuth

A autorização permaneceu separada da identidade.

### Os papéis ganharam nomes específicos

OP autentica; RP confia depois de validar.

### ID Token e access token foram separados

Um cria identidade no client; o outro autoriza a API.

### A identidade passou a ser iss + sub

E-mail e username não são chaves estáveis.

### State, nonce e PKCE foram diferenciados

Cada controle protege uma parte do fluxo.

### UserInfo recebeu validação própria

O subject precisa coincidir com o ID Token.

### Discovery foi tratada como metadata

Ela não torna um issuer arbitrário confiável.

### O laboratório evitou implementação prematura

Keycloak e `oauth2Login()` ficaram para aulas posteriores.

---

## Erros comuns importantes

### Enviar ID Token à API

A audience é o client, não o Resource Server.

### Usar access token para login

OAuth não define identidade interoperável por esse token.

### Usar e-mail como chave

E-mail pode mudar ou ser reciclado.

### Validar apenas a signature

Issuer, audience, tempo, nonce e `azp` continuam necessários.

### Confundir state e nonce

Eles protegem contextos diferentes.

### Confiar em UserInfo sem comparar sub

Claims podem pertencer a outra identidade.

### Aceitar qualquer issuer por discovery

Isso pode criar SSRF e confiança indevida.

### Solicitar profile completo

Claims desnecessárias aumentam risco e retenção.

### Interpretar amr como autorização

Método de autenticação não concede permission.

### Criar RP antes de escolher o OP

Client ID, redirects, claims e algorithms ficam improvisados.

---

## Comandos úteis

### Teste OIDC

```powershell
.\mvnw.cmd `
  -Dtest=OpenIdConnectFoundationsTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar integração prematura

```powershell
git grep `
  -n `
  -E `
  "oauth2Login|ClientRegistration|OidcUserService"
```

### Procurar ID Token como bearer

```powershell
git grep `
  -n `
  -E `
  "Authorization.*id_token|Bearer.*idToken"
```

### Procurar e-mail como chave

```powershell
git grep `
  -n `
  -E `
  "findByEmail|email.*primary|email.*identity"
```

---

## Exercício guiado

### Parte 1 — Papéis

Diferencie End-User, OP e RP.

### Parte 2 — Scope

Explique por que `openid` ativa OIDC.

### Parte 3 — Tokens

Diferencie ID Token e access token.

### Parte 4 — Claims

Valide issuer, subject, audience, tempo e `azp`.

### Parte 5 — Fluxo

Diferencie state, nonce e PKCE.

### Parte 6 — UserInfo

Exija o mesmo subject.

### Parte 7 — Discovery

Use issuer confiável e metadata validada.

### Parte 8 — Identidade

Use `iss + sub`, não e-mail.

### Parte 9 — Privacidade

Solicite somente claims necessárias.

### Parte 10 — Guardrail

Não habilite runtime antes do Keycloak.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 432 foi preservada;
- ponte correta aponta para PKCE;
- OIDC foi definido como camada de identidade;
- OAuth e OIDC foram diferenciados;
- End-User, OP e RP foram definidos;
- scope `openid` foi exigido;
- scopes profile e email foram contextualizados;
- ID Token foi definido;
- ID Token não foi tratado como access token;
- ID Token não é aceito na API OS;
- access token não foi usado como prova de login;
- claims centrais foram cobertas;
- `auth_time`, `acr`, `amr`, `azp`, `at_hash` e `c_hash` foram contextualizadas;
- identidade usa `iss + sub`;
- subject foi tratado como opaco;
- public e pairwise subject foram explicados;
- issuer usa comparação exata;
- audience contém client ID;
- audience da API é rejeitada pelo RP;
- múltiplas audiences exigem `azp`;
- expiration e issued-at foram validados;
- nonce foi definido;
- nonce é imprevisível e de uso único;
- state foi diferenciado de nonce;
- PKCE foi diferenciado dos dois;
- UserInfo foi definido como protected resource;
- UserInfo usa access token;
- UserInfo `sub` precisa coincidir;
- e-mail não foi usado como chave;
- `email_verified` foi contextualizado;
- claims de profile não concedem permissions;
- minimização de claims foi aplicada;
- discovery foi explicado;
- endpoint well-known foi registrado;
- `jwks_uri` foi explicado;
- discovery não aceita issuer controlado pela request;
- JWKS não aceita URL arbitrária do token;
- algorithm allowlist foi aplicada;
- signature precede confiança em claims;
- documentos de fundamentos e validação foram criados;
- records de teste foram criados;
- cenário válido foi testado;
- issuer, audience e `azp` incorretos foram rejeitados;
- expiração e issued-at foram testados;
- nonce e state incorretos foram rejeitados;
- identity key foi testada;
- UserInfo divergente foi rejeitado;
- e-mail mutável foi testado;
- claims excessivas foram rejeitadas;
- discovery metadata foi testada;
- algoritmo incompatível foi rejeitado;
- matriz de artefatos foi criada;
- projeto atual foi mapeado sem overclaim;
- ADR futura foi criada;
- secrets inventory foi atualizado sem valores;
- auditoria foi planejada sem tokens;
- threat model foi atualizado;
- OWASP A01, A02 e A07 foram atualizados;
- nenhuma dependency OAuth Client foi adicionada;
- nenhum provider real foi configurado;
- nenhum client secret ou callback foi criado;
- nenhum issuer real foi versionado;
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
git grep -n -E "oauth2Login|ClientRegistration|OidcUserService"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
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
git commit -m "docs(m15): modelar identidade com OpenID Connect"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- ID Token real;
- access token;
- authorization code;
- nonce;
- state;
- client secret;
- private key;
- issuer de produção;
- callback real;
- e-mail como chave;
- integração Keycloak antecipada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, OpenID Connect acrescentou identidade ao modelo OAuth.

Os papéis ficaram:

```text
End-User:
pessoa autenticada.

OpenID Provider:
autentica e emite ID Token.

Relying Party:
valida e cria a sessão local.
```

Os artefatos ficaram separados:

```text
ID Token:
declara autenticação
para o client.

Access Token:
autoriza acesso
ao Resource Server.

UserInfo:
fornece claims adicionais
ao RP.
```

A identidade local futura será ligada por:

```text
issuer + subject.
```

Não por e-mail, username ou nome.

O perfil de validação exige:

```text
signature;

algorithm allowlist;

issuer exato;

client audience;

azp;

tempo;

nonce;

subject;

UserInfo matching.
```

A decisão central foi:

```text
o Relying Party só cria
uma sessão de usuário
depois de validar que o ID Token
foi emitido pelo OP confiável,
para o client correto
e para a tentativa iniciada.
```

O nonce liga a identidade à request.

O state protege a resposta de redirect.

Ainda falta ligar o authorization code à instância que iniciou o fluxo.

Esse será o papel do PKCE.

A próxima aula será:

```text
434 - M15.24 - PKCE
```

Nela, você irá:

- criar `code_verifier`;
- derivar `code_challenge`;
- usar o método `S256`;
- enviar challenge na authorization request;
- enviar verifier no token request;
- entender interceptação de code;
- evitar verifier previsível;
- armazenar state, nonce e verifier por tentativa;
- consumir o contexto uma única vez;
- testar mismatch e replay.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei OAuth 2.0 e OIDC.
- [ ] Diferenciei ID Token e access token.
- [ ] Validei issuer, audience, tempo e nonce.
- [ ] Usei `iss + sub` como identidade.
- [ ] Não implementei um provider antes da aula correta.

---

## Troubleshooting adicional

### O ID Token funciona como bearer na API

Revise o decoder e a audience.

A API deve aceitar somente access tokens destinados a ela.

### O RP aceita token da API

A audience esperada precisa ser o client ID.

### O login cria usuários duplicados por e-mail

Use a chave externa `iss + sub`.

### Nonce nunca coincide

Confirme armazenamento por tentativa, codificação e consumo único.

### State e nonce usam o mesmo valor

Separe finalidade e armazenamento.

### UserInfo retorna outro sub

Rejeite a response inteira.

### Discovery aceita qualquer URL

Configure issuers confiáveis; não aceite input do usuário.

### O teste passa sem verificar signature

Claims só podem ser processadas depois da validação criptográfica.

---

## Perguntas de revisão

1. O que OIDC acrescenta ao OAuth?
2. Quem é o End-User?
3. O que é o OP?
4. O que é o RP?
5. Qual scope ativa OIDC?
6. Para quem o ID Token é emitido?
7. Para quem o access token é emitido?
8. ID Token deve ir à API?
9. Qual é a chave estável de identidade?
10. E-mail pode ser chave?
11. O que `aud` representa no ID Token?
12. Quando validar `azp`?
13. Para que serve nonce?
14. Para que serve state?
15. Para que servirá PKCE?
16. O que é UserInfo?
17. Qual claim precisa coincidir no UserInfo?
18. O que discovery publica?
19. Keycloak foi integrado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Uma camada interoperável de identidade.
2. A pessoa autenticada.
3. O provedor que autentica e emite ID Token.
4. O client que confia após validar.
5. `openid`.
6. Para o Relying Party.
7. Para o Resource Server.
8. Não.
9. `iss + sub`.
10. Não.
11. O client destinatário.
12. Em múltiplas audiences e conforme o perfil.
13. Ligar o ID Token à request.
14. Ligar a resposta ao fluxo e mitigar CSRF.
15. Ligar o code à instância do client.
16. Um recurso protegido com claims.
17. `sub`.
18. Metadata e endpoints do OP.
19. Não.
20. PKCE.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 433 - M15.23 - OpenID Connect

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Defini OIDC como camada de identidade sobre OAuth 2.0.
- Diferenciei End-User, OpenID Provider e Relying Party.
- Estudei o scope obrigatório `openid`.
- Diferenciei ID Token, access token e UserInfo.
- Registrei que ID Token é destinado ao client.
- Registrei que access token é destinado ao Resource Server.
- Proibi ID Token como bearer da API OS.
- Estudei `iss`, `sub`, `aud`, `exp` e `iat`.
- Contextualizei `auth_time`, `acr`, `amr`, `azp`, `at_hash` e `c_hash`.
- Defini identidade externa como `iss + sub`.
- Não usei e-mail ou username como chave estável.
- Estudei public e pairwise subject.
- Exigi comparação exata de issuer.
- Exigi client ID na audience.
- Validei `azp` em múltiplas audiences.
- Validei expiration e issued-at.
- Estudei nonce e uso único.
- Diferenciei state, nonce e PKCE.
- Estudei UserInfo e exigi igualdade de `sub`.
- Contextualizei `email_verified`.
- Apliquei minimização de claims.
- Estudei discovery e `/.well-known/openid-configuration`.
- Estudei `jwks_uri` e rotação de public keys.
- Rejeitei issuer e URL de chave controlados pela request.
- Apliquei allowlist de algoritmo.
- Criei `docs/security/M15_OIDC_FOUNDATIONS.md`.
- Criei `docs/security/M15_OIDC_VALIDATION_PROFILE.md`.
- Criei `OpenIdConnectFoundationsTest`.
- Testei issuer, audience, `azp`, tempo, nonce, state e UserInfo.
- Testei identidade por `iss + sub`.
- Testei minimização de claims e metadata.
- Não adicionei Keycloak, `oauth2Login()` ou client registration.
- Atualizei secrets inventory, auditoria planejada, threat model e OWASP.
- Próxima aula: PKCE.
```

---

## Referência técnica curta

- [OpenID Connect Core 1.0 incorporating errata set 2](https://openid.net/specs/openid-connect-core-1_0.html)
- [OpenID Connect Discovery 1.0 incorporating errata set 2](https://openid.net/specs/openid-connect-discovery-1_0.html)
- [RFC 9700 — Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)
- [Spring Security — OAuth 2.0 Login](https://docs.spring.io/spring-security/reference/servlet/oauth2/login/index.html)
- [Spring Security — Advanced OAuth2 Login Configuration](https://docs.spring.io/spring-security/reference/servlet/oauth2/login/advanced.html)
- [Spring Security — OIDC Core API](https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/oauth2/core/oidc/package-summary.html)

Regra final:

```text
OpenID Connect deve ser tratado como a camada de identidade do fluxo OAuth: o OP autentica o End-User, o RP valida um ID Token destinado ao seu client ID e a API continua aceitando somente access tokens; a identidade estável é o par issuer e subject, nonce liga o token à tentativa, state protege o redirect, UserInfo só é aceito com subject correspondente, discovery parte de issuer confiável, algoritmos são restringidos e claims são minimizadas; nenhum ID Token, access token, code, nonce ou client secret deve ser logado ou versionado.
```
