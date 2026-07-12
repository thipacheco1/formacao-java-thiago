# 422 - M15.12 - JWT conceitos header payload signature

## Apresentação da aula

Na aula 421, a autenticação deixou de depender de um usuário em memória.

O fluxo passou a utilizar:

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

A conta agora possui:

- username normalizado;
- password hash versionado;
- authorities persistidas;
- flags de habilitação;
- flags de expiração;
- bloqueio;
- versão otimista;
- continuidade após restart.

O mecanismo de transporte, entretanto, continua sendo HTTP Basic.

Isso significa que cada request envia novamente:

```text
username;

password.
```

A pergunta central desta aula será:

```text
como representar afirmações de identidade
e autorização em um token compacto,
protegido contra alteração,
sem enviar a password em cada request?
```

Antes de implementar qualquer login com token, é necessário compreender o formato.

JWT significa:

```text
JSON Web Token.
```

Um JWT é uma representação compacta e URL-safe de claims transferidas entre partes.

Claims são afirmações.

Exemplos:

```text
quem é o subject;

quem emitiu;

para quem foi emitido;

quando foi emitido;

quando expira;

quais authorities carrega.
```

Um JWT pode ser protegido de duas formas principais:

```text
JWS:
assinatura digital ou MAC.

JWE:
criptografia autenticada.
```

O formato mais visto em APIs é um JWT representado como JWS Compact Serialization.

Ele possui três segmentos:

```text
header.payload.signature
```

Um JWE Compact possui cinco segmentos.

Por isso, a frase:

```text
todo JWT possui três partes
```

não é universalmente correta.

A formulação correta é:

```text
um JWT assinado em JWS Compact
normalmente possui três segmentos.
```

Nesta aula, o foco será JWS.

Você estudará:

- header;
- payload;
- signature;
- Base64URL;
- signing input;
- claims registrados;
- claims públicos;
- claims privados;
- `alg`;
- `typ`;
- `kid`;
- `iss`;
- `sub`;
- `aud`;
- `exp`;
- `nbf`;
- `iat`;
- `jti`;
- HS256;
- RS256;
- ES256;
- allowlist de algoritmos;
- rotação de chaves;
- replay;
- revogação;
- limites de tamanho;
- validação contextual.

A regra mais importante da aula será:

```text
JWT assinado
não significa JWT secreto.
```

Header e payload podem ser decodificados por qualquer portador. A signature protege integridade e autenticidade, não confidencialidade. Portanto, password, hashes, secrets e dados pessoais desnecessários são proibidos no payload.

O laboratório criará:

```text
docs/security/M15_JWT_CONCEPTS.md
```

e:

```text
src/test/java/br/com/formacao/backend
└── security
    └── jwt
        └── JwtStructureLabTest.java
```

O teste usará somente:

- Java;
- Jackson já presente;
- `Base64`;
- `Mac`;
- `SecretKeySpec`;
- `SecureRandom`.

Nenhuma biblioteca JWT será adicionada nesta aula.

O código do laboratório não será utilizado em produção.

Ele existe para mostrar exatamente o que uma biblioteca fará depois.

A próxima aula será:

```text
423 - M15.13 - JWT implementacao login
```

Nela, a aplicação criará um endpoint de login e emitirá um token por meio de componentes de segurança adequados.

---

## Onde estamos na formação

A sequência atual é:

```text
420:
Login basico usuario em memoria.

421:
Autenticacao com banco.

422:
JWT conceitos header payload signature.

423:
JWT implementacao login.

424:
Validacao de token e filtros.

425:
Refresh token estrategia segura.
```

A aula 421 respondeu:

```text
como autenticar
uma conta persistida?
```

A aula 422 responderá:

```text
o que existe dentro de um JWT
e quais validações tornam
um token aceitável para uma API?
```

Nesta aula:

```text
formato JWT:
sim.

JWS:
sim.

JWE:
conceito.

Base64URL:
sim.

claims:
sim.

assinatura:
sim.

HS256:
laboratório.

algoritmos assimétricos:
conceito.

rotação:
conceito.

ameaças:
sim.

login JWT:
não.

emissão em endpoint:
não.

filtro bearer:
não.

refresh token:
não.
```

A regra central será:

```text
um token não é confiável
porque pode ser decodificado;

ele só é aceito
depois de validação criptográfica
e validação completa de claims.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
docs/security/M15_JWT_CONCEPTS.md
```

Estrutura:

```text
# Conceitos e politica JWT

## Objetivo
## Perfil do token
## Estrutura
## Header
## Payload
## Signature
## Claims obrigatorios
## Algoritmos permitidos
## Chaves
## Validacao
## Clock skew
## Replay
## Revogacao
## Dados proibidos
## Limites
## Ameacas
## Decisoes para a API
```

O laboratório produzirá e validará um token sintético:

```text
alg:
HS256.

typ:
JWT.

iss:
formacao-java-api.

sub:
UUID sintético.

aud:
service-order-api.

iat:
instante atual.

nbf:
instante atual.

exp:
cinco minutos.

jti:
UUID aleatório.

authorities:
ROLE_OPERATOR e service-order:read.
```

Você irá:

1. definir JWT;
2. diferenciar JWT, JWS e JWE;
3. compreender compact serialization;
4. compreender Base64URL;
5. decodificar header e payload;
6. construir o signing input;
7. assinar com HS256;
8. verificar signature;
9. provar que payload é visível;
10. detectar alteração;
11. classificar claims;
12. validar issuer;
13. validar audience;
14. validar tempo;
15. validar algoritmo;
16. compreender chaves simétricas;
17. compreender chaves assimétricas;
18. planejar rotação;
19. modelar replay e revogação;
20. preparar a implementação.

---

## Conceito essencial

### JWT representa claims

O payload de um JWT é um JSON Claims Set.

Exemplo:

```json
{
  "iss": "formacao-java-api",
  "sub": "c915ef2e-cbb5-49f7-86d4-a12f55b77df7",
  "aud": "service-order-api",
  "iat": 1783800000,
  "nbf": 1783800000,
  "exp": 1783800300,
  "jti": "6ab2deab-7d48-43d8-a067-86eb5a60956a",
  "authorities": [
    "ROLE_OPERATOR",
    "service-order:read"
  ]
}
```

Essas afirmações somente ganham confiança depois da validação.

Antes disso, o payload é input não confiável.

---

### JWT, JWS e JWE

`JWT`

```text
formato de claims.
```

`JWS`

```text
estrutura assinada
ou protegida por MAC.
```

`JWE`

```text
estrutura criptografada
com integridade autenticada.
```

Um JWT pode aparecer:

- como payload de um JWS;
- como plaintext de um JWE;
- em estruturas aninhadas.

O access token desta formação será assinado.

Ele não será criptografado nesta etapa.

---

### Compact Serialization

JWS Compact:

```text
BASE64URL(header)
.
BASE64URL(payload)
.
BASE64URL(signature)
```

Exemplo visual:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJpc3MiOiJmb3JtYWNhby1qYXZhLWFwaSIsLi4ufQ
.
c2lnbmF0dXJl
```

Na string real, não existem quebras de linha.

O separador é:

```text
ponto.
```

O token é compacto, mas não necessariamente pequeno.

Claims demais aumentam:

- header HTTP;
- largura de banda;
- logs;
- memória;
- limites de proxy;
- custo de parsing.

---

### Base64URL

Base64URL é uma variação adequada a URLs e headers.

Diferenças comuns em relação ao Base64 tradicional:

```text
+ vira -;

 / vira _;

padding = pode ser omitido.
```

No Java:

```java
Base64
        .getUrlEncoder()
        .withoutPadding();
```

Para decodificar:

```java
Base64
        .getUrlDecoder();
```

Base64URL não protege confidencialidade.

Ela apenas representa bytes como texto.

---

### Header protegido

Exemplo:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Parâmetros importantes:

`alg`

```text
algoritmo usado para proteger o JWS.
```

`typ`

```text
tipo declarado do objeto.
```

`kid`

```text
identificador de chave.
```

`cty`

```text
tipo do conteúdo,
útil em objetos aninhados.
```

O header faz parte do signing input.

Uma alteração nele invalida a signature.

Mesmo assim, valores do header continuam sendo input não confiável até a validação.

---

### alg não escolhe a política do servidor

O token pode declarar:

```json
{
  "alg": "none"
}
```

ou um algoritmo diferente do esperado.

O servidor não deve responder:

```text
o token pediu,
então vou aceitar.
```

A aplicação precisa possuir uma allowlist configurada.

Exemplo:

```text
este endpoint aceita somente RS256.
```

Ou:

```text
este laboratório aceita somente HS256.
```

O algoritmo declarado precisa coincidir com a política.

Não aceite troca dinâmica entre famílias simétricas e assimétricas sem perfil explícito.

Isso reduz ataques de algorithm confusion.

---

### typ e confusão entre tokens

Sistemas podem consumir vários tipos:

- access token;
- ID token;
- refresh token;
- e-mail verification token;
- password reset token.

Todos podem usar JWT.

Validar somente a signature pode permitir que um token de um contexto seja usado em outro.

Controles:

- `typ` explícito;
- issuer distinto;
- audience distinta;
- claims obrigatórios distintos;
- chaves distintas quando apropriado;
- regras de validação mutuamente exclusivas.

A API não deve aceitar um ID token como access token.

---

### kid é uma dica

`kid` ajuda o verificador a selecionar uma chave durante rotação.

Exemplo:

```json
{
  "alg": "RS256",
  "kid": "2026-07-primary",
  "typ": "at+jwt"
}
```

`kid` não é prova de confiança.

O servidor precisa procurar o valor apenas em um conjunto de chaves confiável.

Não transforme `kid` em:

- caminho de arquivo;
- trecho de SQL;
- URL arbitrária;
- nome de bean;
- comando.

---

### Payload é visível

Qualquer pessoa pode dividir o token, decodificar o payload e ler o JSON sem possuir a chave. A signature impede alteração válida, não leitura. Claims decodificados também não devem ser usados como autorização sem validação.

---

### Claims registrados

RFC 7519 define nomes registrados.

`iss`

```text
issuer:
quem emitiu.
```

`sub`

```text
subject:
identidade principal do token.
```

`aud`

```text
audience:
destinatário esperado.
```

`exp`

```text
expiration time:
instante após o qual não deve ser aceito.
```

`nbf`

```text
not before:
não aceitar antes deste instante.
```

`iat`

```text
issued at:
quando foi emitido.
```

`jti`

```text
JWT ID:
identificador único.
```

Esses claims não são obrigatórios em todo JWT por definição.

Um perfil de aplicação precisa declarar quais são obrigatórios.

Na formação, todos os listados serão exigidos para access tokens.

---

### NumericDate

Claims temporais usam NumericDate.

NumericDate representa segundos desde:

```text
1970-01-01T00:00:00Z.
```

Não são milissegundos Java.

Erro comum:

```java
instant.toEpochMilli()
```

quando o contrato espera segundos.

Use:

```java
instant.getEpochSecond()
```

A biblioteca futura trabalhará com `Instant`.

---

### Audience

`aud` pode ser:

- string;
- array de strings.

O consumidor precisa verificar se sua audience esperada está presente.

Não basta existir um `aud` qualquer.

Exemplo:

```text
token para billing-api
não pode ser aceito
pela service-order-api.
```

Audience ajuda a prevenir substituição entre serviços.

---

### Subject

`sub` identifica o principal do token.

Nesta formação, ele deverá usar:

```text
UUID imutável do usuário.
```

O username poderá mudar.

O subject não deve mudar junto com nome de exibição.

Para resolver a identidade atual, a aplicação poderá utilizar:

- UUID;
- status da conta;
- authorities do token;
- versão de segurança futura.

A política será refinada na implementação.

---

### Expiration

Tokens de acesso devem possuir vida curta.

Um token sem `exp` pode permanecer válido por tempo indefinido.

Nesta baseline conceitual:

```text
access token:
cinco minutos no laboratório.
```

Isso ainda será configurável.

A expiração limita a janela de uso após:

- roubo;
- cópia;
- vazamento;
- logout;
- mudança de authorities.

Ela não revoga instantaneamente o token.

---

### Not Before e Issued At

`nbf` impede uso antecipado.

`iat` informa quando o token foi emitido.

Validações possíveis:

- `nbf` não pode estar no futuro além da tolerância;
- `iat` não deve estar no futuro além da tolerância;
- `exp` deve ser posterior a `iat`;
- idade máxima pode ser aplicada;
- tempos absurdos devem ser rejeitados.

Relógios de sistemas possuem pequenas diferenças.

Por isso, existe clock skew.

---

### Clock skew

Clock skew é uma tolerância temporal.

Exemplo:

```text
30 segundos.
```

Ele evita rejeitar tokens legítimos por pequenas diferenças de relógio.

Não use tolerância de vários minutos sem justificativa.

Uma tolerância ampla prolonga tokens expirados e permite uso antecipado.

Todos os hosts devem utilizar sincronização de relógio.

---

### JWT ID

`jti` identifica uma instância de token.

Pode apoiar:

- auditoria;
- correlação;
- denylist;
- detecção de replay;
- revogação específica.

`jti` sozinho não impede replay.

Se o mesmo bearer token for copiado, o atacante pode apresentar o mesmo `jti`.

É necessário estado ou prova de posse para detectar e impedir reutilização.

---

### Claims públicos e privados

Claims públicos devem evitar colisões e, quando necessário, usar nomes registrados ou namespaces controlados.

Claims privados são acordos entre emissor e consumidor.

Exemplo desta aplicação:

```text
authorities.
```

A escolha precisa ser documentada.

Evite nomes vagos como:

```text
data;

info;

user.
```

Não coloque a entity inteira no payload.

---

### Signature

Para JWS Compact, o signing input é:

```text
BASE64URL(header)
+
"."
+
BASE64URL(payload)
```

Em HS256:

```text
signature =
HMAC-SHA-256(
    sharedSecret,
    signingInput
)
```

Depois, os bytes da signature são codificados em Base64URL.

O verificador repete o cálculo com a mesma chave e compara.

Uma alteração em qualquer byte do header ou payload muda o resultado esperado.

---

### MAC e assinatura digital

HS256 usa HMAC.

A mesma chave:

- assina;
- verifica.

Consequência:

```text
qualquer verificador
também consegue emitir tokens.
```

RS256 e ES256 usam criptografia assimétrica.

`RS256`

```text
private key assina;

public key verifica.
```

`ES256`

```text
private key EC assina;

public key EC verifica.
```

Assim, resource servers podem verificar sem possuir capacidade de emitir.

Para múltiplos serviços, essa separação costuma ser preferível.

---

### HS256 exige segredo forte

HS256 exige material aleatório, não password humana. A baseline usa pelo menos 256 bits e secret manager; nomes, UUIDs previsíveis, hashes de senha e valores no Git são proibidos.

---

### Rotação de chave

Durante a rotação, a nova chave assina, a anterior ainda verifica e `kid` seleciona a chave até os tokens antigos expirarem. Chaves públicas podem ser distribuídas por JWK Set em origem previamente confiável; URLs arbitrárias vindas do token não devem ser seguidas.

---

### Bearer token e replay

Um bearer token concede acesso a quem o apresenta.

Ele não comprova que o apresentador original continua sendo o portador.

Se copiado, pode ser reutilizado até:

- expirar;
- ser revogado;
- a chave ser retirada;
- uma policy de estado rejeitá-lo.

Por isso:

- TLS é obrigatório;
- logs não recebem token;
- browser storage exige threat model;
- vida útil é curta;
- `jti` pode apoiar revogação;
- proof-of-possession é outro modelo.

---

### JWT não implementa logout

Em JWT stateless puro, o token continua válido até `exp`. Revogação pode exigir token curto, denylist, security version, introspection, rotação ou refresh token stateful. Cada opção adiciona estado e será tratada depois.

---

### Assinatura não substitui TLS

A signature protege integridade do token.

TLS protege o canal.

Sem TLS, terceiros podem:

- copiar o bearer token;
- observar claims;
- fazer replay;
- correlacionar tráfego.

Um token assinado continua utilizável por quem o roubar.

---

### LocalStorage e cookies

No browser, `localStorage` expõe o token a JavaScript e ao risco de XSS. Cookie `HttpOnly` reduz leitura por script, mas é enviado automaticamente e reabre a análise de CSRF. A arquitetura frontend ficará para uma decisão específica.

---

### Validação completa

A validação inclui estrutura, Base64URL, JSON, `typ`, algoritmo, chave, signature, issuer, subject, audience, tempos, `jti`, tamanho e perfil do token. Validar somente a signature é insuficiente.

---

## Mão na massa guiada

### 1. Criar o documento de política

Arquivo:

```text
docs/security/M15_JWT_CONCEPTS.md
```

Cabeçalho:

```markdown
# Conceitos e politica JWT

## Contexto

A aplicacao autentica usuarios persistidos com HTTP Basic.
JWT ainda nao foi implementado.

## Perfil planejado

- Tipo: access token.
- Protecao: JWS.
- Transporte: Bearer sobre HTTPS.
- Subject: UUID do usuario.
- Audience: service-order-api.
- Issuer: formacao-java-api.
- Duracao inicial de laboratorio: 5 minutos.
- Claims sensiveis: proibidos.
```

---

### 2. Criar o teste de estrutura

Arquivo:

```text
JwtStructureLabTest.java
```

Imports:

```java
package br.com.formacao.backend.security.jwt;

import static org.assertj.core.api.Assertions
        .assertThat;
import static org.assertj.core.api.Assertions
        .assertThatThrownBy;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import com.fasterxml.jackson.core.type
        .TypeReference;
import com.fasterxml.jackson.databind
        .ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
```

O teste não carrega o contexto Spring.

---

### 3. Criar os campos do laboratório

```java
class JwtStructureLabTest {

    private static final Base64.Encoder
            BASE64_URL_ENCODER =
            Base64
                    .getUrlEncoder()
                    .withoutPadding();

    private static final Base64.Decoder
            BASE64_URL_DECODER =
            Base64.getUrlDecoder();

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    private final Clock clock =
            Clock.fixed(
                    Instant.parse(
                            "2026-07-11T20:00:00Z"
                    ),
                    ZoneOffset.UTC
            );

    private byte[] secret;

    @BeforeEach
    void createSyntheticKey() {
        secret = new byte[32];

        new SecureRandom()
                .nextBytes(secret);
    }
}
```

A chave possui 32 bytes aleatórios.

Ela nunca é impressa.

---

### 4. Criar Base64URL helpers

```java
private String encode(
        byte[] value
) {
    return BASE64_URL_ENCODER
            .encodeToString(
                    value
            );
}

private byte[] decode(
        String value
) {
    return BASE64_URL_DECODER
            .decode(
                    value
            );
}
```

Para JSON:

```java
private String encodeJson(
        Map<String, ?> value
) throws Exception {
    return encode(
            objectMapper.writeValueAsBytes(
                    value
            )
    );
}
```

---

### 5. Criar assinatura HS256

```java
private byte[] signHs256(
        String signingInput,
        byte[] key
) throws Exception {

    Mac mac =
            Mac.getInstance(
                    "HmacSHA256"
            );

    mac.init(
            new SecretKeySpec(
                    key,
                    "HmacSHA256"
            )
    );

    return mac.doFinal(
            signingInput.getBytes(
                    StandardCharsets.US_ASCII
            )
    );
}
```

O signing input usa ASCII porque os segmentos compactos utilizam caracteres URL-safe.

---

### 6. Criar o token sintético

```java
private String createToken()
        throws Exception {

    Instant now =
            clock.instant();

    Map<String, Object> header =
            Map.of(
                    "alg",
                    "HS256",
                    "typ",
                    "JWT"
            );

    Map<String, Object> payload =
            Map.of(
                    "iss",
                    "formacao-java-api",
                    "sub",
                    "78ea0e4e-f990-45cd-a572-28dfd1f43d66",
                    "aud",
                    "service-order-api",
                    "iat",
                    now.getEpochSecond(),
                    "nbf",
                    now.getEpochSecond(),
                    "exp",
                    now.plusSeconds(300)
                            .getEpochSecond(),
                    "jti",
                    UUID.randomUUID()
                            .toString(),
                    "authorities",
                    List.of(
                            "ROLE_OPERATOR",
                            "service-order:read"
                    )
            );

    String encodedHeader =
            encodeJson(header);

    String encodedPayload =
            encodeJson(payload);

    String signingInput =
            encodedHeader
            + "."
            + encodedPayload;

    String signature =
            encode(
                    signHs256(
                            signingInput,
                            secret
                    )
            );

    return signingInput
            + "."
            + signature;
}
```

---

### 7. Provar os três segmentos

```java
@Test
void shouldCreateThreePartJwsCompact()
        throws Exception {

    String token =
            createToken();

    String[] parts =
            token.split(
                    "\\.",
                    -1
            );

    assertThat(parts)
            .hasSize(3);

    assertThat(parts)
            .allSatisfy(
                    part ->
                            assertThat(part)
                                    .doesNotContain("=")
            );
}
```

O teste valida JWS Compact, não todo JWT possível.

---

### 8. Decodificar header e payload

```java
@Test
void shouldDecodeHeaderAndPayloadWithoutKey()
        throws Exception {

    String token =
            createToken();

    String[] parts =
            token.split("\\.");

    Map<String, Object> header =
            objectMapper.readValue(
                    decode(parts[0]),
                    new TypeReference<>() {
                    }
            );

    Map<String, Object> payload =
            objectMapper.readValue(
                    decode(parts[1]),
                    new TypeReference<>() {
                    }
            );

    assertThat(header)
            .containsEntry(
                    "alg",
                    "HS256"
            )
            .containsEntry(
                    "typ",
                    "JWT"
            );

    assertThat(payload)
            .containsEntry(
                    "iss",
                    "formacao-java-api"
            )
            .containsEntry(
                    "aud",
                    "service-order-api"
            )
            .containsKey(
                    "sub"
            )
            .containsKey(
                    "exp"
            );
}
```

A chave não foi usada para ler os claims.

---

### 9. Verificar a signature

```java
private boolean hasValidSignature(
        String token,
        byte[] key
) throws Exception {

    String[] parts =
            token.split(
                    "\\.",
                    -1
            );

    if (parts.length != 3) {
        return false;
    }

    String signingInput =
            parts[0]
            + "."
            + parts[1];

    byte[] expected =
            signHs256(
                    signingInput,
                    key
            );

    byte[] received =
            decode(
                    parts[2]
            );

    return MessageDigest.isEqual(
            expected,
            received
    );
}
```

A comparação usa:

```java
MessageDigest.isEqual
```

em vez de igualdade ingênua de arrays.

---

### 10. Testar a signature

```java
@Test
void shouldValidateSignatureWithCorrectKey()
        throws Exception {

    String token =
            createToken();

    assertThat(
            hasValidSignature(
                    token,
                    secret
            )
    )
    .isTrue();

    byte[] anotherKey =
            new byte[32];

    new SecureRandom()
            .nextBytes(
                    anotherKey
            );

    assertThat(
            hasValidSignature(
                    token,
                    anotherKey
            )
    )
    .isFalse();
}
```

A mesma chave HMAC verifica e assina.

---

### 11. Detectar alteração do payload

```java
@Test
void shouldRejectTamperedPayload()
        throws Exception {

    String token =
            createToken();

    String[] parts =
            token.split("\\.");

    Map<String, Object> payload =
            objectMapper.readValue(
                    decode(parts[1]),
                    new TypeReference<>() {
                    }
            );

    payload.put(
            "authorities",
            List.of(
                    "ROLE_ADMIN"
            )
    );

    String tamperedToken =
            parts[0]
            + "."
            + encodeJson(payload)
            + "."
            + parts[2];

    assertThat(
            hasValidSignature(
                    tamperedToken,
                    secret
            )
    )
    .isFalse();
}
```

O atacante consegue alterar o JSON.

Ele não consegue produzir uma signature válida sem a chave.

---

### 12. Validar algoritmo permitido

Crie:

```java
private Map<String, Object> readHeader(
        String token
) throws Exception {
    return objectMapper.readValue(
            decode(
                    token.split("\\.")[0]
            ),
            new TypeReference<>() {
            }
    );
}
```

Teste:

```java
@Test
void shouldRequireExpectedAlgorithm()
        throws Exception {

    String token =
            createToken();

    Map<String, Object> header =
            readHeader(token);

    assertThat(
            header.get("alg")
    )
    .isEqualTo(
            "HS256"
    );

    assertThat(
            List.of("HS256")
    )
    .contains(
            header.get("alg")
    );
}
```

Na implementação real, essa verificação pertence à configuração do decoder, não a uma lista montada por request.

---

### 13. Criar um validador conceitual de claims

```java
private void validateClaims(
        Map<String, Object> claims,
        Instant now
) {
    assertThat(
            claims.get("iss")
    )
    .isEqualTo(
            "formacao-java-api"
    );

    assertThat(
            claims.get("aud")
    )
    .isEqualTo(
            "service-order-api"
    );

    long expiration =
            ((Number) claims.get("exp"))
                    .longValue();

    long notBefore =
            ((Number) claims.get("nbf"))
                    .longValue();

    long issuedAt =
            ((Number) claims.get("iat"))
                    .longValue();

    long skew =
            30;

    assertThat(expiration)
            .isGreaterThan(
                    now.getEpochSecond()
                    - skew
            );

    assertThat(notBefore)
            .isLessThanOrEqualTo(
                    now.getEpochSecond()
                    + skew
            );

    assertThat(issuedAt)
            .isLessThanOrEqualTo(
                    now.getEpochSecond()
                    + skew
            );

    assertThat(claims)
            .containsKeys(
                    "sub",
                    "jti"
            );
}
```

Esse helper didático usa assertions.

Na aplicação real, validators retornarão erros de autenticação controlados.

---

### 14. Validar claims do token

```java
@Test
void shouldValidateExpectedClaims()
        throws Exception {

    String token =
            createToken();

    Map<String, Object> payload =
            objectMapper.readValue(
                    decode(
                            token.split("\\.")[1]
                    ),
                    new TypeReference<>() {
                    }
            );

    validateClaims(
            payload,
            clock.instant()
    );
}
```

---

### 15. Demonstrar token expirado

Monte payload com:

```text
exp:
now - 1.
```

Assine corretamente.

A signature será válida.

A validação temporal deverá falhar.

Isso prova:

```text
signature válida
não significa token aceitável.
```

Repita com:

- issuer incorreto;
- audience incorreta;
- `nbf` futuro;
- `iat` futuro.

---

### 16. Demonstrar tamanho e dados proibidos

Crie um teste que inspeciona as keys permitidas:

```java
Set<String> allowedClaims =
        Set.of(
                "iss",
                "sub",
                "aud",
                "iat",
                "nbf",
                "exp",
                "jti",
                "authorities"
        );
```

Valide que não existem:

```text
password;

passwordHash;

email;

address;

document;

secret.
```

O laboratório não precisa incluir dados pessoais para representar autenticação.

---

### 17. Registrar o perfil planejado

No documento:

```markdown
## Claims obrigatorios

- `iss`
- `sub`
- `aud`
- `iat`
- `nbf`
- `exp`
- `jti`
- `authorities`

## Validacoes obrigatorias

- JWS Compact com tres segmentos.
- Tipo esperado.
- Algoritmo em allowlist.
- Signature valida.
- Issuer exato.
- Audience esperada.
- Subject UUID.
- Expiracao.
- Not before.
- Issued at.
- Clock skew maximo de 30 segundos.
- Tamanho maximo configurado.
```

---

### 18. Registrar a decisão de algoritmo

Para o laboratório conceitual:

```text
HS256.
```

Para a implementação, registre uma decisão pendente entre:

```text
RS256;

ES256.
```

Critérios:

- número de resource servers;
- distribuição de public keys;
- capacidade operacional;
- HSM ou KMS;
- bibliotecas;
- rotação;
- interoperabilidade;
- performance;
- compliance.

Não escolha algoritmo apenas pelo tamanho do token.

---

### 19. Registrar key management

Inclua:

- chave não fica no Git;
- chave não fica em Dockerfile;
- secret manager;
- rotação;
- `kid`;
- duas chaves válidas durante transição;
- auditoria;
- acesso mínimo;
- backup;
- recuperação;
- incidente;
- retirada de chave.

Para assimétrico:

```text
private key:
somente emissor.

public key:
verificadores.
```

---

### 20. Atualizar o threat model

Adicione:

```text
THR-025:
payload tratado como secreto.

THR-026:
algoritmo escolhido pelo token.

THR-027:
issuer ou audience não validados.

THR-028:
token expirado aceito.

THR-029:
bearer token roubado e reproduzido.

THR-030:
chave de assinatura exposta.

THR-031:
kid usado para acesso arbitrário.

THR-032:
ID token aceito como access token.

THR-033:
claims excessivos vazam dados.
```

Associe:

```text
A01;

A02;

A04;

A07;

A08;

A09.
```

---

### 21. Atualizar OWASP e baseline

A04:

```text
chaves e TLS são obrigatórios.
```

A07:

```text
JWT ainda não implementado;
perfil e validações definidos.
```

A08:

```text
signature, algoritmo e key rotation.
```

A09:

```text
jti pode apoiar auditoria;
token completo não entra em log.
```

Baseline:

```text
HTTP Basic:
mecanismo atual do laboratório.

JWT:
somente política conceitual.

produção:
não aprovada.
```

---

### 22. Executar os testes

```powershell
.\mvnw.cmd `
  -Dtest=JwtStructureLabTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- nenhuma dependency JWT adicionada;
- nenhuma chave impressa;
- nenhum token completo persistido;
- nenhuma alteração em runtime;
- nenhum endpoint de login;
- nenhuma mudança na filter chain.

---

## Entendendo o que foi feito

### JWT foi separado de JWS

O token de três partes foi identificado como JWS Compact.

### Base64URL perdeu a aparência de criptografia

Header e payload foram lidos sem chave.

### Signature ganhou fórmula concreta

O signing input ficou visível.

### Alteração foi detectada

O payload adulterado não passou na verificação.

### Claims ganharam contexto

Issuer, audience e tempo foram tratados como controles.

### Signature deixou de ser validação completa

Um token expirado ainda pode possuir signature válida.

### Chaves simétricas e assimétricas foram diferenciadas

A capacidade de emitir e verificar foi separada.

### Replay permaneceu uma ameaça

Bearer roubado continua utilizável.

### Runtime ficou intacto

Nenhum login JWT foi antecipado.

---

## Erros comuns importantes

### Chamar Base64URL de criptografia

Qualquer pessoa pode decodificar.

### Colocar password no payload

Assinatura não esconde claims.

### Confiar no alg recebido

O servidor precisa de allowlist.

### Validar apenas signature

Issuer, audience e tempo também importam.

### Aceitar qualquer audience

Tokens podem ser substituídos entre serviços.

### Usar username mutável como subject

Prefira identificador imutável.

### Criar secret HMAC humano

HS256 exige chave aleatória forte.

### Logar token completo

O bearer pode ser reutilizado.

### Achar que expiração revoga imediatamente

O token vive até `exp` sem estado adicional.

### Usar JWT para tudo

Sessão server-side pode ser mais simples em alguns sistemas.

---

## Comandos úteis

### Teste focado

```powershell
.\mvnw.cmd `
  -Dtest=JwtStructureLabTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar tokens em logs e fixtures

```powershell
git grep `
  -n `
  -E `
  "eyJ[a-zA-Z0-9_-]+\."
```

### Procurar secrets JWT

```powershell
git grep `
  -n `
  -i `
  -E `
  "jwt.*secret|signing.*key|private.*key"
```

### Revisar runtime

```powershell
git diff `
  -- `
  "pom.xml" `
  "src/main"
```

---

## Exercício guiado

### Parte 1 — Estrutura

Separe header, payload e signature.

### Parte 2 — Base64URL

Codifique e decodifique sem padding.

### Parte 3 — Signing input

Monte `header.payload`.

### Parte 4 — HS256

Assine e valide com chave sintética.

### Parte 5 — Alteração

Troque a role e confirme falha.

### Parte 6 — Claims

Valide issuer, audience e subject.

### Parte 7 — Tempo

Teste expiração, not-before e clock skew.

### Parte 8 — Algoritmos

Compare HMAC e assinatura assimétrica.

### Parte 9 — Ameaças

Modele replay, vazamento e confusion.

### Parte 10 — Política

Documente perfil e key management.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 421 foi preservada;
- JWT, JWS e JWE foram definidos e diferenciados;
- JWS Compact foi identificado com três segmentos;
- JWE Compact foi reconhecido com cinco segmentos;
- Base64URL foi explicado e não foi tratado como criptografia;
- header, payload, signature e signing input foram explicados;
- payload foi tratado como visível;
- password, hash, secrets e dados pessoais desnecessários foram proibidos;
- claims registrados, públicos e privados foram diferenciados;
- `alg`, `typ`, `kid` e `cty` foram explicados;
- allowlist de algoritmo foi exigida;
- `none` e algorithm confusion foram tratados;
- access token foi diferenciado de ID token;
- `kid` foi tratado apenas como identificador de chave confiável;
- `iss`, `sub`, `aud`, `exp`, `nbf`, `iat` e `jti` foram explicados;
- NumericDate foi tratado em segundos;
- issuer e audience exatos foram exigidos;
- subject UUID imutável foi planejado;
- expiração curta e clock skew de 30 segundos foram planejados;
- `jti` não foi tratado como prevenção automática de replay;
- HS256, RS256 e ES256 foram apresentados;
- MAC e assinatura digital foram diferenciados;
- chave HMAC aleatória de pelo menos 256 bits foi exigida;
- secret manager, rotação, `kid` e JWK Set foram documentados;
- URLs arbitrárias indicadas pelo token foram rejeitadas;
- bearer replay, revogação, logout e TLS foram discutidos;
- localStorage e cookie foram comparados;
- validação completa foi definida além da signature;
- documento `M15_JWT_CONCEPTS.md` foi criado;
- laboratório permaneceu em `src/test`;
- nenhuma biblioteca JWT foi adicionada;
- `SecureRandom` gerou uma chave sintética de 32 bytes;
- chave, token e credentials não foram impressos;
- Base64 URL-safe sem padding foi utilizado;
- `Mac` com `HmacSHA256` e `SecretKeySpec` foi utilizado;
- o signing input utilizou ASCII;
- token sintético possui claims documentados;
- três segmentos e ausência de padding foram testados;
- header e payload foram decodificados sem chave;
- signature correta foi aceita e chave incorreta foi rejeitada;
- `MessageDigest.isEqual` foi usado na comparação;
- payload adulterado e authority administrativa foram rejeitados;
- algoritmo esperado foi validado;
- issuer, audience, subject e claims temporais foram validados;
- token expirado com signature válida foi discutido;
- claims permitidos foram inventariados;
- decisão de algoritmo de produção permaneceu explícita e pendente;
- key management, threat model, OWASP e baseline foram atualizados;
- runtime, filter chain e dependências de produção não foram alterados;
- login, bearer filter e refresh token não foram antecipados;
- gate completo foi executado;
- commit recomendado está pronto;
- ponte para a aula 423 está correta.

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
git commit -m "test(m15): explorar estrutura e validacao conceitual de JWT"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- chave de assinatura;
- token completo;
- bearer token;
- password;
- hash de usuário;
- secret;
- private key;
- JWK privado;
- logs do laboratório;
- endpoint JWT antecipado;
- dependency não utilizada.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você desmontou um JWT assinado.

A estrutura ficou:

```text
header;

payload;

signature.
```

O laboratório demonstrou:

```text
header e payload
podem ser lidos sem chave;

signature válida
detecta alterações;

signature válida
não substitui validação de claims.
```

Você também diferenciou:

```text
JWT;

JWS;

JWE;

HS256;

RS256;

ES256;

MAC;

assinatura digital;

confidencialidade;

integridade.
```

A policy planejada exige:

```text
issuer;

subject UUID;

audience;

issued-at;

not-before;

expiration;

JWT ID;

authorities;

algoritmo em allowlist;

tempo curto;

TLS.
```

A decisão central foi:

```text
um JWT não se torna confiável
porque possui três segmentos;

ele precisa de assinatura válida,
algoritmo esperado,
chave confiável
e claims compatíveis
com o perfil do consumidor.
```

A aplicação ainda autentica por HTTP Basic.

Nenhum token foi emitido.

Isso acontecerá na próxima aula:

```text
423 - M15.13 - JWT implementacao login
```

Nela, você irá:

- criar request de login;
- autenticar username e password;
- usar `AuthenticationManager`;
- configurar um encoder JWT;
- criar claims;
- assinar tokens;
- definir issuer e audience;
- retornar access token;
- não retornar password ou hash;
- testar login válido e inválido;
- testar expiração e estrutura;
- manter HTTP Basic somente como apoio temporário.

A validação do bearer token em cada request ficará para a aula 424.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei JWT, JWS e JWE.
- [ ] Montei header, payload e signature.
- [ ] Provei que Base64URL não esconde claims.
- [ ] Validei assinatura e claims separadamente.
- [ ] Documentei algoritmos, chaves e ameaças.

---

## Troubleshooting adicional

### O decoder Base64 falha

Confirme que está usando:

```java
Base64.getUrlDecoder()
```

e não o decoder tradicional.

### O token possui quatro segmentos

Verifique pontos extras ou segmento vazio.

JWS Compact deve possuir três.

### A signature muda entre testes

A chave é aleatória por teste.

Esse comportamento é esperado.

### O payload adulterado continua válido

Confirme que a signature recebida não foi recalculada.

O teste deve manter a signature original.

### exp parece muito grande

Confirme que o valor está em segundos, não milissegundos.

### JSON decodifica, mas token deve ser rejeitado

Decodificação não é validação.

Verifique signature, issuer, audience e tempo.

### O teste manual virou código em src/main

Mova para `src/test`.

A implementação real usará biblioteca e componentes oficiais.

### Um token apareceu no Git

Remova imediatamente.

Mesmo sintético, evite criar padrão de versionamento de bearer tokens.

---

## Perguntas de revisão

1. O que significa JWT?
2. Qual é a diferença entre JWT e JWS?
3. O que JWE adiciona?
4. Quantas partes possui JWS Compact?
5. Todo JWT possui três partes?
6. Base64URL criptografa?
7. O que existe no header?
8. O que existe no payload?
9. O que a signature protege?
10. O que significa `iss`?
11. O que significa `aud`?
12. O que significa `exp`?
13. NumericDate usa qual unidade?
14. Para que serve `jti`?
15. HS256 usa quantas chaves?
16. RS256 usa quais chaves?
17. `kid` prova confiança?
18. Signature válida basta?
19. JWT elimina replay?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. JSON Web Token.
2. JWT contém claims; JWS protege conteúdo com signature ou MAC.
3. Confidencialidade por criptografia autenticada.
4. Três.
5. Não.
6. Não.
7. Metadados como alg, typ e kid.
8. Claims.
9. Integridade e autenticidade conforme chave e algoritmo.
10. Emissor.
11. Destinatário esperado.
12. Expiração.
13. Segundos desde a Unix epoch.
14. Identificar uma instância do token.
15. Uma chave compartilhada.
16. Private para assinar e public para verificar.
17. Não.
18. Não.
19. Não.
20. JWT implementação login.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 422 - M15.12 - JWT conceitos header payload signature

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Defini JWT como representação compacta de claims.
- Diferenciei JWT, JWS e JWE.
- Entendi que JWS Compact possui três segmentos.
- Registrei que JWE Compact possui cinco segmentos.
- Estudei header, payload e signature.
- Estudei Base64URL sem padding.
- Confirmei que Base64URL não oferece confidencialidade.
- Proibi dados sensíveis no payload.
- Estudei `alg`, `typ`, `kid` e `cty`.
- Exigi allowlist de algoritmo.
- Estudei algorithm confusion.
- Diferenciei access token e ID token.
- Estudei claims registrados.
- Estudei `iss`, `sub`, `aud`, `exp`, `nbf`, `iat` e `jti`.
- Usei UUID imutável como subject planejado.
- Estudei NumericDate em segundos.
- Planejei access token curto e clock skew de 30 segundos.
- Entendi que `jti` sozinho não impede replay.
- Estudei signing input.
- Estudei HS256 e HMAC.
- Diferenciei MAC de assinatura digital.
- Introduzi RS256 e ES256.
- Exigi chave HMAC aleatória de pelo menos 256 bits.
- Estudei rotação, `kid` e JWK Set.
- Mantive TLS obrigatório.
- Estudei bearer replay, revogação e logout.
- Comparei localStorage e cookie.
- Criei `docs/security/M15_JWT_CONCEPTS.md`.
- Criei `JwtStructureLabTest`.
- Montei um JWS HS256 apenas em testes.
- Gereei chave sintética com SecureRandom.
- Codifiquei header e payload em Base64URL.
- Assinei o signing input com HmacSHA256.
- Validei a signature com comparação segura.
- Decodifiquei claims sem usar a chave.
- Adulterei authorities e confirmei rejeição.
- Validei issuer, audience e claims temporais.
- Registrei que signature válida não basta.
- Atualizei baseline, threat model e OWASP.
- Não adicionei biblioteca JWT ou alterei o runtime.
- Não criei login, bearer filter ou refresh token.
- Próxima aula: JWT implementacao login.
```

---

## Referência técnica curta

- [RFC 7519 — JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519.html)
- [RFC 7515 — JSON Web Signature](https://www.rfc-editor.org/rfc/rfc7515.html)
- [RFC 7516 — JSON Web Encryption](https://www.rfc-editor.org/rfc/rfc7516.html)
- [RFC 7517 — JSON Web Key](https://www.rfc-editor.org/rfc/rfc7517.html)
- [RFC 8725 — JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html)
- [RFC 9068 — JWT Profile for OAuth 2.0 Access Tokens](https://www.rfc-editor.org/rfc/rfc9068.html)
- [OWASP REST Security Cheat Sheet — JWT](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#jwt)

Regra final:

```text
um JWT precisa ser tratado como um envelope de claims, não como segredo nem como prova automática de identidade: em JWS Compact, header e payload são Base64URL visíveis, a signature protege o signing input contra alteração e a aceitação depende de algoritmo em allowlist, chave confiável, issuer, audience, subject e tempos corretos; bearer tokens continuam sujeitos a roubo e replay, exigem TLS, vida curta, key management e política de revogação, e a implementação deve usar bibliotecas maduras em vez do código didático desta aula.
```
