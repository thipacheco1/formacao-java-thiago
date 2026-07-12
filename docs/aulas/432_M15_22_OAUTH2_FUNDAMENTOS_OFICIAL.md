# 432 - M15.22 - OAuth2 fundamentos

## Apresentação da aula

Na aula 431, a aplicação passou a tratar secrets como capacidades sensíveis com ciclo de vida.

A baseline criada estabeleceu:

```text
Git:
sem secret.

imagem:
sem secret.

linha de comando:
sem secret.

runtime:
arquivos montados.

Spring Boot:
config tree.

keystore:
passwords lidas de arquivos.

startup:
fail fast.

produção:
secret manager obrigatório.
```

Também foram classificados materiais como:

```text
private key:
secret.

public key:
não secret.

password hash:
sensitive.

refresh token hash:
sensitive.

issuer e audience:
configuração pública com integridade.
```

Essa base é necessária porque protocolos de autorização modernos envolvem credenciais próprias, como:

- client secret;
- private key de cliente;
- access token;
- refresh token;
- authorization code;
- device code;
- chave de assinatura;
- chave de criptografia.

Antes de criar qualquer uma dessas credenciais, é necessário entender o protocolo em que elas existem.

A pergunta central desta aula será:

```text
o que é OAuth 2.0,
quais papéis participam do protocolo,
como um cliente obtém acesso limitado
e por que isso não é o mesmo
que implementar login?
```

OAuth 2.0 é um framework de autorização.

Ele permite que uma aplicação chamada cliente obtenha acesso limitado a recursos HTTP:

```text
em nome de um usuário;

ou em nome do próprio cliente.
```

O framework separa responsabilidades entre:

```text
resource owner;

client;

authorization server;

resource server.
```

O fluxo mais conhecido possui:

```text
usuário;

browser;

redirecionamento;

authorization code;

token endpoint;

access token;

API protegida.
```

Mas OAuth 2.0 também cobre cenários sem usuário interativo, como:

```text
serviço chamando serviço
com Client Credentials.
```

A aplicação construída no curso já utiliza conceitos parecidos:

```text
access token JWT;

refresh token;

Resource Server;

Bearer Token;

scope-like authorities;

issuer;

audience.
```

Porém, isso não transforma automaticamente o projeto em uma implementação OAuth 2.0.

Os endpoints atuais:

```text
POST /api/auth/login;

POST /api/auth/refresh.
```

são contratos próprios da aplicação.

Eles não implementam um token endpoint OAuth completo.

A aplicação atual também:

- autentica usuários diretamente;
- emite os próprios tokens;
- protege os próprios recursos;
- não possui registro de clientes;
- não possui authorization endpoint;
- não possui redirect URI;
- não possui consent;
- não possui authorization code;
- não possui discovery;
- não possui metadata OAuth;
- não possui scopes delegados por cliente.

Nesta aula, o projeto não será renomeado para Authorization Server.

Também não serão criados endpoints fictícios como:

```text
/oauth2/authorize;

/oauth2/token;

/oauth2/jwks.
```

Criar nomes parecidos sem implementar as regras do protocolo seria pior que manter um contrato próprio claramente documentado.

O objetivo será construir o mapa mental correto.

A prática terá três entregas:

```text
docs/security/M15_OAUTH2_FOUNDATIONS.md;

docs/security/M15_OAUTH2_ROLE_MAP.md;

OAuth2FoundationsArchitectureTest.java.
```

O teste arquitetural modelará cenários e rejeitará combinações inseguras, como:

- SPA com client secret;
- Authorization Code sem PKCE;
- uso de Implicit Grant;
- uso de Resource Owner Password Credentials;
- Client Credentials representando um usuário;
- refresh token enviado à API de negócio;
- access token para audience incorreta;
- cliente público tratado como confidencial;
- authorization code usado como access token.

A aula utilizará recomendações atuais de segurança.

A baseline será:

```text
aplicação com usuário:
Authorization Code + PKCE.

SPA:
cliente público;
sem client secret.

aplicação nativa:
cliente público;
Authorization Code + PKCE.

backend web:
cliente confidencial;
Authorization Code + PKCE.

máquina para máquina:
Client Credentials.

Implicit Grant:
não usar.

Password Grant:
não usar.
```

OAuth 2.0 não padroniza autenticação de usuário.

Ele não responde sozinho:

```text
quem é o usuário?
```

Ele responde principalmente:

```text
qual cliente recebeu autorização
para acessar qual recurso
com quais limites?
```

A camada que padroniza identidade sobre OAuth 2.0 é OpenID Connect.

Ela será estudada na próxima aula:

```text
433 - M15.23 - OpenID Connect
```

---

## Onde estamos na formação

A sequência oficial é:

```text
430:
Auditoria de acoes sensiveis.

431:
Secrets management.

432:
OAuth2 fundamentos.

433:
OpenID Connect.

434:
PKCE.

435:
OAuth2 Authorization Code.
```

A aula 431 respondeu:

```text
como secrets são identificados,
entregues e rotacionados?
```

A aula 432 responderá:

```text
quais credenciais e papéis existem
em um fluxo de autorização delegada?
```

Nesta aula:

```text
OAuth 2.0:
sim.

papéis:
sim.

endpoints:
sim.

authorization grants:
sim.

access token:
sim.

refresh token:
sim.

scope:
sim.

cliente público:
sim.

cliente confidencial:
sim.

Authorization Code:
sim.

Client Credentials:
sim.

Implicit:
rejeitado.

Password Grant:
rejeitado.

OpenID Connect:
somente fronteira conceitual.

PKCE profundo:
próxima aula específica.

implementação de provider:
não.
```

A regra central será:

```text
OAuth 2.0 delega autorização;

ele não deve ser reduzido
a uma tela de login
ou a um formato JWT.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
docs/security/
├── M15_OAUTH2_FOUNDATIONS.md
└── M15_OAUTH2_ROLE_MAP.md
```

Teste arquitetural:

```text
src/test/java/br/com/formacao/backend
└── configuration
    └── security
        └── oauth2
            └── OAuth2FoundationsArchitectureTest.java
```

A documentação mapeará o projeto atual:

| Papel | Componente atual | Situação |
|---|---|---|
| Resource Owner | Usuário da API | Existente como usuário, sem fluxo OAuth |
| Client | Ainda não definido | Ausente |
| Authorization Server | Funções parciais dentro da API | Não é OAuth completo |
| Resource Server | API de Ordens de Serviço | Implementado com Spring Security |
| Protected Resource | Endpoints `/api/v2/service-orders/**` | Implementado |
| Access Token | JWT RS256 | Implementado em contrato próprio |
| Refresh Token | Opaco e rotativo | Implementado em contrato próprio |
| Scope OAuth | Ainda não definido | Authorities internas não são scopes automaticamente |

O teste modelará:

```text
Browser SPA;

Native App;

Server-side Web App;

Machine-to-Machine;

Device Application.
```

Você irá:

1. definir OAuth 2.0;
2. identificar os quatro papéis;
3. distinguir usuário e cliente;
4. distinguir Authorization Server e Resource Server;
5. entender endpoints de protocolo;
6. entender authorization grant;
7. entender authorization code;
8. entender access token;
9. entender refresh token;
10. entender scope;
11. entender audience;
12. classificar clientes;
13. analisar Authorization Code;
14. analisar Client Credentials;
15. rejeitar Implicit;
16. rejeitar Password Grant;
17. mapear o projeto atual;
18. criar teste arquitetural;
19. atualizar threat model;
20. preparar OpenID Connect.

---

## Conceito essencial

### OAuth 2.0 é autorização delegada

OAuth 2.0 permite que um cliente receba acesso limitado a recursos sem obter a password primária do usuário. O resource owner autoriza uma capacidade, o Authorization Server emite a credencial adequada e o cliente a utiliza no Resource Server.
### Resource Owner

Resource Owner é quem pode conceder acesso ao recurso protegido. Em fluxos com usuário, normalmente é o end-user; em ambientes corporativos, a decisão também pode decorrer de política ou consentimento administrativo. O papel não deve ser confundido com o campo `owner_user_id` da Ordem de Serviço.
### Client

Client é a aplicação que solicita acesso.

Ele não é necessariamente:

- browser;
- usuário;
- frontend;
- backend.

Exemplos:

```text
SPA;

aplicação mobile;

backend web;

serviço batch;

CLI;

smart TV.
```

O cliente possui:

```text
client_id.
```

O `client_id` identifica o cliente, mas não é secret.

Alguns clientes também possuem uma credencial de autenticação.

---

### Authorization Server

O Authorization Server registra clientes, valida redirect URIs, autentica o resource owner quando necessário, aplica autorização, emite codes e tokens, limita scopes e publica metadata ou chaves conforme o protocolo. A API atual realiza emissão própria, mas não implementa esse papel OAuth de forma completa.
### Resource Server

Resource Server hospeda recursos protegidos e valida o access token, incluindo issuer, audience, tempo e autorização. A API de Ordens de Serviço já desempenha esse papel técnico para o token próprio.
### Protected Resource

Protected resource é o dado ou operação protegida.

Exemplos no projeto:

```text
listar OS;

consultar OS;

criar OS;

atualizar OS;

alterar status;

excluir OS.
```

O access token existe para acessar recursos.

Ele não existe para ser exibido ao usuário ou usado como profile de identidade.

---

### Authorization Endpoint

O authorization endpoint é usado em fluxos com redirecionamento e interação do resource owner.

Exemplo conceitual:

```http
GET /oauth2/authorize
```

Parâmetros podem incluir:

- `response_type`;
- `client_id`;
- `redirect_uri`;
- `scope`;
- `state`;
- parâmetros de PKCE;
- parâmetros específicos de OIDC.

O browser navega até esse endpoint.

O cliente não envia a password do usuário diretamente ao próprio backend para “simular OAuth”.

---

### Token Endpoint

O token endpoint troca um grant por tokens.

Exemplo conceitual:

```http
POST /oauth2/token
Content-Type: application/x-www-form-urlencoded
```

Ele pode processar:

- authorization code;
- refresh token;
- client credentials;
- extensões específicas.

O token endpoint não é equivalente ao endpoint atual:

```text
POST /api/auth/login.
```

O contrato, autenticação do cliente, grant type, erros e validações são diferentes.

---

### Redirection Endpoint

O redirection endpoint pertence ao cliente.

Depois da autorização, o Authorization Server redireciona o user-agent para uma URI previamente registrada.

Exemplo:

```text
https://client.example/callback
```

A redirect URI é parte crítica da segurança.

Ela precisa ser registrada e comparada de forma estrita.

Redirects genéricos ou curingas podem permitir roubo de authorization code.

---

### Authorization Grant

Authorization grant representa a autorização usada para obter um access token.

Ele não é o access token.

Exemplos:

- authorization code;
- refresh token;
- client credentials;
- device code;
- token exchange, como extensão.

O grant possui objetivo e duração específicos.

---

### Authorization Code

Authorization code é uma credencial temporária entregue ao cliente por redirecionamento.

Ele deve ser:

- curto;
- de uso único;
- ligado ao cliente;
- ligado à redirect URI;
- ligado ao fluxo;
- protegido por PKCE nos fluxos modernos.

O cliente troca o code no token endpoint.

O code não é enviado ao Resource Server.

---

### Access Token

Access token é a credencial apresentada ao Resource Server. Pode ser JWT ou opaco; OAuth 2.0 não exige um formato específico. Mesmo quando é JWT, o cliente deve tratá-lo como credencial opaca e não depender de claims internos não contratados.
### Bearer Token

Bearer significa:

```text
quem possui a credencial
pode utilizá-la.
```

Controles necessários:

- TLS;
- vida curta;
- armazenamento adequado;
- audience;
- scope;
- não registrar;
- não enviar em URL;
- não enviar ao recurso errado.

Existem tokens sender-constrained, mas a baseline atual usa bearer.

---

### Refresh Token

Refresh token é usado no Authorization Server, não no Resource Server.

Ele permite obter novo access token.

Ele pode possuir:

- rotação;
- expiração;
- revogação;
- detecção de reuse;
- ligação ao cliente;
- ligação ao usuário;
- limitação por scope.

O projeto já implementou um refresh token opaco e rotativo em contrato próprio.

Uma futura migração para OAuth precisará adaptar o endpoint e a semântica ao protocolo.

---

### Scope

Scope representa o limite de autorização solicitado ou concedido ao cliente.

Exemplo:

```text
service-order.read;

service-order.write.
```

Scopes são:

- strings definidas pelo Authorization Server;
- solicitadas pelo cliente;
- aprovadas ou reduzidas;
- associadas ao access token;
- interpretadas pelo Resource Server.

Scope não é automaticamente:

- role do usuário;
- permission interna;
- group;
- claim de identidade;
- audience.

A aplicação possui authorities como:

```text
service-order:read.
```

Elas podem inspirar scopes futuros, mas a conversão precisa ser explícita.

---

### Scope solicitado e concedido

O cliente pode solicitar:

```text
read write delete.
```

O Authorization Server pode conceder:

```text
read write.
```

O access token representa o que foi concedido, não apenas o que foi solicitado.

O cliente precisa funcionar com o resultado efetivo.

---

### Audience e resource

Scope responde:

```text
o que pode fazer?
```

Audience responde:

```text
onde o token deve ser aceito?
```

Um token com scope de leitura, mas audience de outra API, precisa ser rejeitado.

O projeto já valida:

```text
aud:
service-order-api.
```

Essa decisão continua correta em OAuth.

---

### Client público

Cliente público, como SPA, aplicativo mobile ou desktop distribuído, não consegue proteger uma credencial compartilhada. Um secret embutido pode ser extraído. A baseline utiliza Authorization Code + PKCE e não atribui client secret a esses clientes.
### Client confidencial

Cliente confidencial executa em ambiente controlado e pode autenticar no token endpoint por secret, private key, mTLS ou outro método suportado. Qualquer credencial segue a baseline de secrets da aula 431.
### Client authentication não é user authentication

Quando um backend apresenta:

```text
client_id + client_secret
```

ele prova a identidade do cliente.

Isso não prova a identidade de um usuário.

No Authorization Code flow podem existir:

```text
user authentication;

client authentication.
```

São decisões diferentes.

---

### Authorization Code Flow

Resumo:

```text
1. cliente redireciona o browser;

2. Authorization Server autentica o usuário;

3. usuário ou policy autoriza;

4. Authorization Server devolve code;

5. cliente troca code no token endpoint;

6. Authorization Server emite tokens;

7. cliente usa access token na API.
```

PKCE liga o início do fluxo à troca do code.

A aula 434 aprofundará PKCE.

---

### Client Credentials

Client Credentials é usado quando o cliente atua em nome próprio.

Não existe resource owner humano no grant.

Exemplo:

```text
job de faturamento
chamando API interna.
```

O subject do token representa o cliente ou workload, não um usuário final.

Não use Client Credentials para:

- manter sessão de usuário;
- substituir Authorization Code;
- “logar” uma pessoa;
- transportar permissões pessoais.

---

### Implicit Grant

Implicit Grant entregava access token pelo front channel.

A prática atual recomenda não usar esse grant.

Problemas incluem:

- token exposto ao user-agent;
- token em URL ou histórico;
- menor proteção na troca;
- ausência de code protegido;
- dificuldades de rotação e mitigação.

Use Authorization Code + PKCE.

---

### Resource Owner Password Credentials

O password grant fazia o cliente coletar username e password do usuário.

Isso quebra a separação que OAuth tenta criar.

Ele:

- aumenta confiança no cliente;
- impede autenticação moderna;
- dificulta MFA;
- dificulta federação;
- amplia exposição de password;
- não deve ser usado em novos sistemas.

O endpoint atual de login não será chamado de password grant.

Ele é autenticação própria da aplicação.

---

### Device Authorization

Device Authorization atende equipamentos com entrada limitada: o dispositivo exibe um código, o usuário autoriza em outro equipamento e o cliente consulta o resultado. É uma extensão do OAuth e será apenas classificada nesta aula.
### OAuth 2.0 não é login

OAuth 2.0 não padroniza como o cliente comprova a identidade do usuário. Usar access token como login cria confusão de audience, cliente e claims. OpenID Connect adiciona ID Token, `openid`, UserInfo, `nonce` e regras interoperáveis de identidade; esse será o foco da aula 433.
## Mão na massa guiada

### 1. Criar o documento de fundamentos

Crie `docs/security/M15_OAUTH2_FOUNDATIONS.md` com papéis, credenciais, grants aprovados e rejeitados, além dos limites: OAuth 2.0 não é autenticação, JWT não é obrigatório e scope não é role.

---

### 2. Criar o mapa de papéis

Crie `docs/security/M15_OAUTH2_ROLE_MAP.md` mapeando usuário, client ausente, funções parciais de emissão, Resource Server, recursos protegidos, tokens próprios e scopes ainda não definidos. Registre que `/api/auth/login` e `/api/auth/refresh` não são `/oauth2/token`.

---

### 3. Definir cenários

No teste, crie:

```java
enum ClientType {
    PUBLIC,
    CONFIDENTIAL
}
```

```java
enum GrantType {
    AUTHORIZATION_CODE,
    CLIENT_CREDENTIALS,
    DEVICE_CODE,
    IMPLICIT,
    PASSWORD
}
```

```java
record OAuth2Scenario(
        String name,
        ClientType clientType,
        GrantType grantType,
        boolean humanUser,
        boolean pkce,
        boolean sharedSecret,
        boolean refreshToken,
        String targetAudience
) {
}
```

Esse modelo existe somente no teste.

Ele não vira runtime protocol.

---

### 4. Criar a policy do teste

```java
private ValidationResult validate(
        OAuth2Scenario scenario
) {
    if (
        scenario.clientType()
                == ClientType.PUBLIC
        && scenario.sharedSecret()
    ) {
        return invalid(
                "Public clients cannot protect a shared secret"
        );
    }

    if (
        scenario.grantType()
                == GrantType.AUTHORIZATION_CODE
        && !scenario.pkce()
    ) {
        return invalid(
                "Authorization Code requires PKCE"
        );
    }

    if (
        scenario.grantType()
                == GrantType.IMPLICIT
    ) {
        return invalid(
                "Implicit Grant is not allowed"
        );
    }

    if (
        scenario.grantType()
                == GrantType.PASSWORD
    ) {
        return invalid(
                "Password Grant is not allowed"
        );
    }

    if (
        scenario.grantType()
                == GrantType.CLIENT_CREDENTIALS
        && scenario.humanUser()
    ) {
        return invalid(
                "Client Credentials cannot represent an end-user"
        );
    }

    return valid();
}
```

O teste documenta decisões.

Ele não substitui validações de um provider real.

---

### 5. Testar SPA

```java
OAuth2Scenario spa =
        new OAuth2Scenario(
                "browser-spa",
                ClientType.PUBLIC,
                GrantType.AUTHORIZATION_CODE,
                true,
                true,
                false,
                true,
                "service-order-api"
        );
```

Esperado:

```text
válido.
```

A SPA não possui client secret.

---

### 6. Testar aplicação nativa

```java
OAuth2Scenario nativeApp =
        new OAuth2Scenario(
                "native-app",
                ClientType.PUBLIC,
                GrantType.AUTHORIZATION_CODE,
                true,
                true,
                false,
                true,
                "service-order-api"
        );
```

Esperado:

```text
válido.
```

A redirect URI e PKCE serão aprofundados depois.

---

### 7. Testar backend web

```java
OAuth2Scenario webBackend =
        new OAuth2Scenario(
                "server-side-web",
                ClientType.CONFIDENTIAL,
                GrantType.AUTHORIZATION_CODE,
                true,
                true,
                true,
                true,
                "service-order-api"
        );
```

Esperado:

```text
válido,
desde que o secret seja gerenciado.
```

A aula 431 fornece a policy para essa credencial.

---

### 8. Testar machine-to-machine

```java
OAuth2Scenario worker =
        new OAuth2Scenario(
                "billing-worker",
                ClientType.CONFIDENTIAL,
                GrantType.CLIENT_CREDENTIALS,
                false,
                false,
                true,
                false,
                "service-order-api"
        );
```

Esperado:

```text
válido.
```

O token representa o worker.

---

### 9. Rejeitar SPA com secret

```java
OAuth2Scenario invalidSpa =
        new OAuth2Scenario(
                "spa-with-secret",
                ClientType.PUBLIC,
                GrantType.AUTHORIZATION_CODE,
                true,
                true,
                true,
                true,
                "service-order-api"
        );
```

Esperado:

```text
inválido.
```

Não esconda o secret em JavaScript minificado.

---

### 10. Rejeitar code sem PKCE

```java
OAuth2Scenario noPkce =
        new OAuth2Scenario(
                "native-without-pkce",
                ClientType.PUBLIC,
                GrantType.AUTHORIZATION_CODE,
                true,
                false,
                false,
                true,
                "service-order-api"
        );
```

Esperado:

```text
inválido.
```

---

### 11. Rejeitar Implicit

```java
OAuth2Scenario implicit =
        new OAuth2Scenario(
                "legacy-implicit",
                ClientType.PUBLIC,
                GrantType.IMPLICIT,
                true,
                false,
                false,
                false,
                "service-order-api"
        );
```

Esperado:

```text
inválido.
```

---

### 12. Rejeitar Password Grant

```java
OAuth2Scenario password =
        new OAuth2Scenario(
                "legacy-password",
                ClientType.CONFIDENTIAL,
                GrantType.PASSWORD,
                true,
                false,
                true,
                true,
                "service-order-api"
        );
```

Esperado:

```text
inválido.
```

Não tente migrar `/api/auth/login` renomeando o endpoint.

---

### 13. Rejeitar Client Credentials com usuário

```java
OAuth2Scenario invalidM2m =
        new OAuth2Scenario(
                "client-credentials-for-user",
                ClientType.CONFIDENTIAL,
                GrantType.CLIENT_CREDENTIALS,
                true,
                false,
                true,
                false,
                "service-order-api"
        );
```

Esperado:

```text
inválido.
```

---

### 14. Modelar tokens por destino

Crie:

```java
enum TokenUse {
    AUTHORIZATION_SERVER,
    RESOURCE_SERVER
}
```

Policy:

```text
authorization code:
Authorization Server token endpoint.

refresh token:
Authorization Server token endpoint.

access token:
Resource Server.

client secret:
Authorization Server,
somente para autenticar cliente confidencial.
```

Teste que refresh token não é enviado a:

```text
/api/v2/service-orders.
```

---

### 15. Modelar audience

Crie um helper:

```java
boolean canUseAtResource(
        String tokenAudience,
        String resourceAudience
) {
    return Objects.equals(
            tokenAudience,
            resourceAudience
    );
}
```

Teste:

```text
service-order-api:
aceito na API OS.

billing-api:
rejeitado na API OS.
```

O teste reforça a decisão já implementada no JWT decoder.

---

### 16. Modelar scopes

Crie um conjunto:

```java
Set<String> requested =
        Set.of(
                "service-order.read",
                "service-order.write",
                "service-order.delete"
        );

Set<String> granted =
        Set.of(
                "service-order.read",
                "service-order.write"
        );
```

Valide:

```text
granted é subconjunto de requested.
```

Mapeamento inicial proposto:

| Scope futuro | Authorities internas possíveis |
|---|---|
| `service-order.read` | `service-order:read` |
| `service-order.write` | create, update e status update |
| `service-order.delete` | `service-order:delete` |

Registre que esse mapeamento ainda não foi aprovado para runtime.

---

### 17. Documentar consent

Explique scope solicitado, scope concedido, consentimento do usuário, consentimento administrativo e policies pré-aprovadas. Consentimento representa a decisão de autorização, não apenas uma tela.

---

### 18. Criar diagrama Authorization Code

Documente o fluxo `Resource Owner -> Authorization Server -> authorization code -> redirect URI -> token endpoint -> access token -> Resource Server` e registre que a password não passa pelo client quando o Authorization Server autentica o usuário.

---

### 19. Criar diagrama Client Credentials

Documente `Confidential Client -> token endpoint -> access token -> Resource Server`. Não existe resource owner humano nesse grant.

---

### 20. Mapear o projeto atual

Registre a API OS como Resource Server para token próprio; `JwtTokenService`, login e refresh como mecanismos proprietários; authorities como modelo interno; e `DatabaseUserPrincipal` como principal, não client registration.

---

### 21. Registrar decisão futura

Crie uma ADR exigindo definição de Authorization Server, clients, redirect URIs, scopes, audience, autenticação do cliente, formato de token, consentimento, discovery e migração dos endpoints antes de instalar um provider.

---

### 22. Atualizar secrets inventory

Registre, sem valores, possíveis client secrets, private keys de client assertion e credenciais de provider. Não crie secrets antes de existir um client real.

---

### 23. Atualizar auditoria

Planeje eventos de authorization request, code exchange, client authentication, emissão e revogação. Não altere o runtime antes de existir um provider real.

---

### 24. Atualizar threat model

Adicione:

```text
THR-111:
SPA recebe client secret.

THR-112:
authorization code é usado sem PKCE.

THR-113:
redirect URI aceita wildcard amplo.

THR-114:
Implicit Grant expõe token no front channel.

THR-115:
Password Grant expõe credencial ao client.

THR-116:
Client Credentials representa usuário.

THR-117:
refresh token é enviado ao Resource Server.

THR-118:
access token é aceito por audience errada.

THR-119:
scope é confundido com role.

THR-120:
API própria é declarada OAuth sem conformidade.
```

Controles:

- classificação de clientes;
- Authorization Code + PKCE;
- redirect URI estrita;
- grants rejeitados;
- separação usuário/cliente;
- token por destino;
- audience;
- mapping explícito;
- linguagem correta.

---

### 25. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
scopes futuros:
precisam mapear para permissions.

audience:
continua validada.

consent:
precisa ser definido.
```

A02 Security Misconfiguration:

```text
grants legados:
rejeitados.

redirect URI:
deverá ser estrita.
```

A07 Authentication Failures:

```text
OAuth2 não será usado
como login sem OpenID Connect.
```

Baseline:

```text
OAuth2:
fundamentos mapeados.

Authorization Server:
não implementado.

Resource Server:
existente para token próprio.

grants aprovados:
Authorization Code + PKCE;
Client Credentials.

grants rejeitados:
Implicit;
Password.

produção pública:
NO-GO.
```

---

### 26. Criar o teste completo

Classe:

```java
class OAuth2FoundationsArchitectureTest {
}
```

Use testes parametrizados:

```java
@ParameterizedTest
@MethodSource("approvedScenarios")
void shouldAcceptApprovedScenarios(
        OAuth2Scenario scenario
) {
    assertThat(validate(scenario))
            .isEqualTo(
                    ValidationResult.valid()
            );
}
```

```java
@ParameterizedTest
@MethodSource("rejectedScenarios")
void shouldRejectUnsafeScenarios(
        OAuth2Scenario scenario
) {
    assertThat(validate(scenario).valid())
            .isFalse();
}
```

O teste não precisa carregar Spring.

Ele é rápido e documental.

---

### 27. Testar que não houve implementação prematura

Crie guardrails:

```text
nenhuma dependency de Authorization Server;

nenhum endpoint /oauth2/authorize;

nenhum endpoint /oauth2/token;

nenhum client secret real;

nenhum redirect URI de produção;

nenhuma classe RegisteredClient criada.
```

Use um teste de policy ou `git grep`.

A ausência é parte do escopo.

---

### 28. Executar os testes

Teste focado:

```powershell
.\mvnw.cmd `
  -Dtest=OAuth2FoundationsArchitectureTest `
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
  "/oauth2/authorize|/oauth2/token|RegisteredClient|client-secret:"
```

Nenhum resultado novo de runtime deve aparecer.

---

## Entendendo o que foi feito

### OAuth 2.0 foi separado de login

O framework trata autorização delegada.

### Os quatro papéis ficaram claros

Usuário, cliente, Authorization Server e Resource Server não são sinônimos.

### O projeto atual foi mapeado sem overclaim

Ele possui token próprio e Resource Server, mas não é um Authorization Server OAuth completo.

### Grants seguros foram escolhidos

Authorization Code + PKCE e Client Credentials possuem casos distintos.

### Grants legados foram rejeitados

Implicit e Password não fazem parte da baseline.

### Client type passou a orientar credenciais

Clientes públicos não recebem shared secrets.

### Scope foi separado de role

O futuro mapping será explícito.

### O teste documentou decisões

Combinações inseguras falham antes de uma implementação real.

---

## Erros comuns importantes

### Chamar qualquer JWT de OAuth

JWT é formato; OAuth é protocolo.

### Chamar login próprio de Password Grant

Um endpoint com username e password não implementa automaticamente o grant.

### Colocar client secret em SPA

O valor pode ser extraído.

### Usar access token como identidade

OAuth não padroniza login de usuário.

### Enviar refresh token à API

Refresh pertence ao Authorization Server.

### Usar Client Credentials para usuário

O token representa o cliente.

### Tratar scope como role

São conceitos e ciclos diferentes.

### Aceitar token de audience errada

Signature válida não basta.

### Criar endpoints com nomes OAuth

Nomes não garantem conformidade.

### Implementar provider antes de definir clientes

Sem use case, scopes e redirects, a configuração vira improviso.

---

## Comandos úteis

### Teste arquitetural

```powershell
.\mvnw.cmd `
  -Dtest=OAuth2FoundationsArchitectureTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar implementação prematura

```powershell
git grep `
  -n `
  -E `
  "/oauth2/authorize|/oauth2/token|RegisteredClient"
```

### Procurar client secret

```powershell
git grep `
  -n `
  -E `
  "client-secret:[[:space:]]+[^$]"
```

### Procurar grants rejeitados

```powershell
git grep `
  -n `
  -E `
  "response_type=token|grant_type=password"
```

---

## Exercício guiado

### Parte 1 — Papéis

Mapeie resource owner, client, Authorization Server e Resource Server.

### Parte 2 — Endpoints

Diferencie authorization, token e redirect endpoints.

### Parte 3 — Credenciais

Diferencie code, access token, refresh token e client credential.

### Parte 4 — Clientes

Classifique SPA, mobile, backend e worker.

### Parte 5 — Grants

Escolha Authorization Code ou Client Credentials.

### Parte 6 — Rejeições

Recuse Implicit e Password Grant.

### Parte 7 — Scopes

Proponha mapping sem ativar runtime.

### Parte 8 — Projeto atual

Documente o que existe e o que não existe.

### Parte 9 — Testes

Modele cenários válidos e inválidos.

### Parte 10 — Segurança

Atualize secrets, auditoria e threat model.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 431 foi preservada;
- ponte correta aponta para OpenID Connect;
- OAuth 2.0 foi definido como framework de autorização;
- autorização delegada foi explicada;
- resource owner foi definido;
- client foi definido;
- Authorization Server foi definido;
- Resource Server foi definido;
- protected resource foi definido;
- usuário e cliente foram diferenciados;
- client ID não foi tratado como secret;
- authorization endpoint foi explicado;
- token endpoint foi explicado;
- redirect endpoint foi explicado;
- redirect URI estrita foi registrada;
- authorization grant foi diferenciado de token;
- authorization code foi explicado;
- code não foi usado no Resource Server;
- access token foi explicado;
- JWT não foi tratado como obrigatório;
- token opaco foi reconhecido;
- bearer semantics foram preservadas;
- refresh token foi destinado ao Authorization Server;
- scope foi definido;
- scope solicitado e concedido foram diferenciados;
- scope não foi tratado como role;
- audience foi diferenciada de scope;
- cliente público foi definido;
- cliente confidencial foi definido;
- SPA não recebeu client secret;
- aplicação nativa não recebeu client secret;
- backend confidencial foi classificado;
- client authentication foi diferenciada de user authentication;
- Authorization Code flow foi explicado;
- PKCE foi exigido na baseline;
- Client Credentials foi explicado;
- Client Credentials não representa usuário;
- Implicit Grant foi rejeitado;
- Password Grant foi rejeitado;
- Device Authorization foi contextualizado;
- OAuth2 não foi usado como login;
- fronteira com OpenID Connect foi explicada;
- projeto atual foi mapeado;
- login atual foi mantido como contrato próprio;
- refresh atual foi mantido como contrato próprio;
- API atual não foi chamada de Authorization Server completo;
- scopes futuros foram mapeados sem runtime;
- consent foi contextualizado;
- diagramas foram criados;
- ADR de decisões futuras foi registrada;
- inventário de secrets foi atualizado sem valores;
- auditoria OAuth ficou apenas planejada;
- threat model foi atualizado;
- OWASP A01, A02 e A07 foram atualizados;
- `OAuth2FoundationsArchitectureTest` foi criado;
- cenários aprovados foram testados;
- cenários inseguros foram rejeitados;
- audience incorreta foi testada;
- refresh no Resource Server foi rejeitado;
- implementação prematura foi bloqueada;
- nenhuma dependency de Authorization Server foi adicionada;
- nenhum endpoint OAuth falso foi criado;
- nenhum client secret real foi criado;
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
git grep -n -E "/oauth2/authorize|/oauth2/token|RegisteredClient"
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
git commit -m "docs(m15): modelar fundamentos e papeis do OAuth2"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- client secret;
- access token;
- refresh token;
- private key;
- endpoint OAuth fictício;
- redirect URI de produção;
- provider improvisado;
- dependency não utilizada;
- claim de identidade inventada;
- implementação de OIDC antecipada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, OAuth 2.0 foi tratado como protocolo de autorização delegada.

Os papéis ficaram:

```text
Resource Owner:
concede acesso.

Client:
solicita e utiliza acesso.

Authorization Server:
emite tokens e aplica autorização.

Resource Server:
protege os recursos.
```

As credenciais ficaram separadas:

```text
authorization code:
grant temporário.

access token:
credencial da API.

refresh token:
renovação no Authorization Server.

client credential:
autenticação do cliente confidencial.
```

A baseline de fluxos ficou:

```text
SPA e native app:
Authorization Code + PKCE;
sem client secret.

backend web:
Authorization Code + PKCE;
cliente confidencial.

machine-to-machine:
Client Credentials.

Implicit:
rejeitado.

Password:
rejeitado.
```

O projeto atual foi descrito com precisão:

```text
possui Resource Server;

possui emissão própria;

possui refresh próprio;

não possui client registration;

não possui authorization endpoint;

não possui redirect URI;

não possui scopes OAuth;

não é Authorization Server completo.
```

A decisão central foi:

```text
OAuth 2.0 não é um formato de token
nem um sinônimo de login;

é uma separação de papéis
para delegar acesso limitado
a recursos protegidos.
```

Ainda falta responder:

```text
como o cliente recebe
uma declaração interoperável
sobre a identidade do usuário?
```

OAuth 2.0 sozinho não padroniza essa resposta.

A próxima aula será:

```text
433 - M15.23 - OpenID Connect
```

Nela, você irá:

- entender OIDC como camada de identidade;
- estudar ID Token;
- diferenciar ID Token e access token;
- estudar o scope `openid`;
- estudar claims de identidade;
- estudar subject;
- estudar issuer e audience no ID Token;
- estudar `nonce`;
- conhecer UserInfo;
- conhecer discovery;
- evitar usar access token como login.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei os quatro papéis do OAuth 2.0.
- [ ] Diferenciei grants e tokens.
- [ ] Classifiquei clientes públicos e confidenciais.
- [ ] Rejeitei Implicit e Password Grant.
- [ ] Documentei que o projeto atual ainda não é OAuth completo.

---

## Troubleshooting adicional

### JWT está sendo chamado de OAuth

Revise a linguagem.

JWT é um formato possível de access token.

### O endpoint de login virou `/oauth2/token`

Renomear não implementa o protocolo.

Remova o endpoint falso.

### A SPA exige client secret

Cliente público não consegue protegê-lo.

Use Authorization Code + PKCE.

### Client Credentials carrega userId

Esse grant representa o cliente.

Use um fluxo com resource owner para usuário.

### Scope foi mapeado diretamente para ROLE_ADMIN

Revise a diferença entre autorização delegada e role interna.

### Refresh token foi enviado à API OS

Ele deve ser enviado somente ao Authorization Server.

### Access token de outra API foi aceito

Revise audience e resource.

### OAuth foi usado para login

Aguarde a modelagem de OpenID Connect.

---

## Perguntas de revisão

1. OAuth 2.0 é autenticação ou autorização?
2. Quem é o resource owner?
3. O que é o client?
4. O que faz o Authorization Server?
5. O que faz o Resource Server?
6. O que é um protected resource?
7. O authorization code é access token?
8. Onde o code é trocado?
9. Onde o access token é usado?
10. Onde o refresh token é usado?
11. OAuth exige JWT?
12. O que é scope?
13. Scope é role?
14. O que é audience?
15. SPA é cliente público ou confidencial?
16. Client Credentials representa usuário?
17. Implicit deve ser usado?
18. Password Grant deve ser usado?
19. O projeto atual é Authorization Server OAuth completo?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Autorização.
2. Quem pode conceder acesso ao recurso.
3. A aplicação que solicita acesso.
4. Autoriza e emite tokens.
5. Protege recursos e valida access tokens.
6. O dado ou operação protegida.
7. Não.
8. No token endpoint.
9. No Resource Server.
10. No Authorization Server.
11. Não.
12. Limite de acesso concedido ao client.
13. Não.
14. O destino do token.
15. Público.
16. Não.
17. Não.
18. Não.
19. Não.
20. OpenID Connect.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 432 - M15.22 - OAuth2 fundamentos

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Defini OAuth 2.0 como framework de autorização delegada.
- Diferenciei resource owner, client, Authorization Server e Resource Server.
- Diferenciei usuário e cliente.
- Estudei protected resources.
- Estudei authorization endpoint, token endpoint e redirect endpoint.
- Diferenciei authorization grant e access token.
- Estudei authorization code.
- Confirmei que authorization code não vai para o Resource Server.
- Estudei access tokens JWT e opacos.
- Reforcei a semântica bearer.
- Estudei refresh token no Authorization Server.
- Defini scope e scope concedido.
- Diferenciei scope, role e permission.
- Diferenciei scope e audience.
- Classifiquei clientes públicos e confidenciais.
- Registrei que `client_id` não é secret.
- Registrei que SPA e native app não protegem client secret.
- Escolhi Authorization Code + PKCE para clientes com usuário.
- Escolhi Client Credentials para machine-to-machine.
- Rejeitei Implicit Grant.
- Rejeitei Resource Owner Password Credentials.
- Contextualizei Device Authorization.
- Diferenciei client authentication e user authentication.
- Registrei que OAuth2 não padroniza login.
- Mapeei o projeto atual sem chamá-lo de Authorization Server completo.
- Mantive `/api/auth/login` e `/api/auth/refresh` como contratos próprios.
- Criei `docs/security/M15_OAUTH2_FOUNDATIONS.md`.
- Criei `docs/security/M15_OAUTH2_ROLE_MAP.md`.
- Criei `OAuth2FoundationsArchitectureTest`.
- Testei cenários válidos e inválidos.
- Testei client público com secret, code sem PKCE e grants rejeitados.
- Testei audience e destino dos tokens.
- Não adicionei Authorization Server nem endpoints OAuth fictícios.
- Atualizei secrets inventory, auditoria planejada, threat model e OWASP.
- Próxima aula: OpenID Connect.
```

---

## Referência técnica curta

- [RFC 6749 — The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html)
- [RFC 6750 — OAuth 2.0 Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750.html)
- [RFC 9700 — Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)
- [RFC 7636 — Proof Key for Code Exchange](https://www.rfc-editor.org/rfc/rfc7636.html)
- [RFC 8628 — OAuth 2.0 Device Authorization Grant](https://www.rfc-editor.org/rfc/rfc8628.html)
- [Spring Security — OAuth 2.0](https://docs.spring.io/spring-security/reference/servlet/oauth2/index.html)
- [Spring Security — OAuth 2.0 Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/index.html)

Regra final:

```text
OAuth 2.0 precisa ser modelado como autorização delegada entre papéis distintos: resource owner concede, client solicita, Authorization Server emite e Resource Server valida; authorization code, access token, refresh token e client credential possuem destinos diferentes, scopes limitam a autorização e não substituem roles, clientes públicos não recebem shared secrets, Authorization Code exige PKCE, Client Credentials representa workloads, Implicit e Password Grant ficam fora da baseline e a API atual não deve ser chamada de OAuth completa até possuir clients, endpoints, redirect URIs, scopes e comportamento compatível com o protocolo.
```
