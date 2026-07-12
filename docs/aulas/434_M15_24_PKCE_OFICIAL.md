# 434 - M15.24 - PKCE

## Apresentação da aula

Na aula 433, OpenID Connect acrescentou identidade ao modelo OAuth 2.0.

Os papéis ficaram:

```text
End-User:
pessoa autenticada.

OpenID Provider:
autentica e emite ID Token.

Relying Party:
valida o ID Token
e cria a sessão local.
```

Os artefatos também foram separados:

```text
ID Token:
declara autenticação
para o client.

Access Token:
autoriza acesso
ao Resource Server.

UserInfo:
fornece claims adicionais
ao Relying Party.
```

A identidade externa foi modelada pelo par:

```text
issuer + subject.
```

E três controles começaram a aparecer no fluxo:

```text
state;

nonce;

PKCE.
```

Na aula anterior, eles foram diferenciados conceitualmente:

```text
state:
liga a authorization response
ao fluxo iniciado pelo client.

nonce:
liga o ID Token
à Authentication Request.

PKCE:
liga o authorization code
à instância que iniciou o fluxo.
```

Agora será aprofundado o terceiro controle.

A pergunta central desta aula será:

```text
como impedir que um authorization code
interceptado seja trocado por tokens
por alguém que não iniciou o fluxo?
```

Considere um client público, como:

- Single Page Application;
- aplicativo mobile;
- desktop;
- CLI distribuída.

Esses clients não conseguem manter um shared secret confiável.

Qualquer segredo embutido no binário ou no JavaScript pode ser extraído.

No Authorization Code Flow sem PKCE, um atacante que obtém o code e conhece:

- client ID;
- redirect URI;
- token endpoint;

pode tentar trocar esse code por tokens antes do client legítimo.

PKCE adiciona uma prova criada dinamicamente por tentativa.

O client gera:

```text
code_verifier.
```

A partir dele, calcula:

```text
code_challenge.
```

Na authorization request, envia:

```text
code_challenge;

code_challenge_method=S256.
```

Na token request, envia:

```text
code_verifier.
```

O Authorization Server:

1. vincula o challenge ao authorization code;
2. recebe o verifier no token endpoint;
3. calcula novamente o challenge;
4. compara com o valor vinculado;
5. emite tokens somente quando a prova corresponde.

O authorization code interceptado isoladamente não basta.

O atacante também precisaria possuir o verifier daquela tentativa.

O fluxo será:

```text
client cria verifier;

client deriva challenge;

authorization request leva challenge;

Authorization Server vincula challenge ao code;

redirect devolve code;

client envia code + verifier;

Authorization Server recalcula challenge;

somente então emite tokens.
```

A baseline desta formação será:

```text
PKCE obrigatório
para Authorization Code;

método:
S256;

plain:
não permitido;

verifier:
aleatório e por tentativa;

attempt:
uso único;

code:
uso único;

state:
obrigatório;

nonce:
obrigatório em OIDC;

TLS:
obrigatório.
```

PKCE começou como proteção especialmente importante para clients públicos.

As práticas atuais recomendam seu uso também por clients confidenciais no Authorization Code Flow.

PKCE não substitui a autenticação do client confidencial.

Um backend web pode utilizar:

```text
client authentication;

mais PKCE.
```

Os controles protegem ameaças diferentes.

Nesta aula, o projeto ainda não instalará Keycloak nem Spring Authorization Server.

Não serão criados:

- authorization endpoint;
- token endpoint;
- callback;
- `ClientRegistration`;
- `oauth2Login()`;
- sessão OIDC;
- client secret;
- redirect URI real.

O laboratório será test-only.

Ele criará:

```text
PkceGenerator;

PkceProof;

AuthorizationAttempt;

InMemoryAuthorizationAttemptStore;

PkceVerificationService;

PkceFoundationsTest;

docs/security/M15_PKCE_PROFILE.md.
```

O objetivo é comprovar:

- entropia do verifier;
- tamanho correto;
- alfabeto permitido;
- Base64URL sem padding;
- derivação S256;
- vínculo por tentativa;
- mismatch;
- ausência de verifier;
- replay;
- consumo único;
- expiração;
- separação entre state, nonce e verifier;
- proibição de log.

A próxima aula será:

```text
435 - M15.25 - Keycloak ambiente local
```

Nela, um OpenID Provider real será iniciado localmente para que os conceitos desta sequência sejam observados em metadata, endpoints e chaves reais.

---

## Onde estamos na formação

A sequência oficial é:

```text
432:
OAuth2 fundamentos.

433:
OpenID Connect.

434:
PKCE.

435:
Keycloak ambiente local.

436:
Login com Keycloak.

437:
Roles e authorities com Keycloak.
```

A aula 433 respondeu:

```text
como o Relying Party valida
a identidade declarada
pelo OpenID Provider?
```

A aula 434 responderá:

```text
como o client prova,
no token endpoint,
que foi a mesma instância
que iniciou a autorização?
```

Nesta aula:

```text
code_verifier:
sim.

code_challenge:
sim.

S256:
sim.

plain:
rejeitado.

SecureRandom:
sim.

Base64URL:
sim.

attempt store:
sim.

consumo único:
sim.

expiração:
sim.

state:
sim.

nonce:
sim.

Authorization Server real:
não.

Keycloak:
próxima aula.
```

A regra central será:

```text
o authorization code
não deve ser suficiente
para obter tokens;

o client precisa apresentar
a prova secreta daquela tentativa.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
docs/security/
└── M15_PKCE_PROFILE.md
```

Laboratório test-only:

```text
src/test/java/br/com/formacao/backend
└── configuration
    └── security
        └── oauth2
            └── pkce
                ├── PkceGenerator.java
                ├── PkceProof.java
                ├── AuthorizationAttempt.java
                ├── InMemoryAuthorizationAttemptStore.java
                ├── PkceVerificationService.java
                └── PkceFoundationsTest.java
```

O perfil adotado será:

| Item | Decisão |
|---|---|
| Método | `S256` |
| Verifier | 32 bytes aleatórios codificados em Base64URL sem padding |
| Comprimento gerado | 43 caracteres |
| Faixa aceita | 43–128 caracteres |
| Alfabeto | `ALPHA / DIGIT / "-" / "." / "_" / "~"` |
| Challenge | `BASE64URL(SHA-256(ASCII(verifier)))` |
| Persistência | Somente durante a tentativa |
| Uso | Uma única troca |
| TTL da tentativa | Curto e configurável |
| Log | Proibido |
| `plain` | Rejeitado |

Você irá:

1. entender a ameaça de code interception;
2. definir `code_verifier`;
3. definir `code_challenge`;
4. usar `S256`;
5. gerar entropia forte;
6. usar Base64URL sem padding;
7. validar tamanho e alfabeto;
8. criar um contexto de tentativa;
9. armazenar state;
10. armazenar nonce;
11. armazenar verifier;
12. expirar tentativas;
13. consumir uma vez;
14. comparar a prova;
15. rejeitar mismatch;
16. rejeitar replay;
17. impedir logs;
18. criar testes de vetores;
19. atualizar riscos;
20. preparar Keycloak.

---

## Conceito essencial

### A ameaça de interceptação do code

Authorization Code é uma credencial temporária.

No fluxo:

```text
Authorization Server
-> redirect URI
-> client
```

o code passa pelo user-agent e por mecanismos de redirect.

Em alguns ambientes, ele pode ser interceptado por:

- aplicação maliciosa registrada para o mesmo esquema de URI;
- handler de deep link;
- browser extension;
- malware;
- callback mal configurado;
- logs ou analytics indevidos;
- proxy comprometido.

Redirect URI estrita e TLS continuam obrigatórios.

PKCE adiciona uma prova independente do code.

---

### Code verifier

`code_verifier` é uma string aleatória de alta entropia criada pelo client para uma única authorization request.

Requisitos do RFC:

```text
comprimento:
43 a 128 caracteres.

alfabeto:
A-Z;
a-z;
0-9;
-;
.;
_;
~.
```

Esse conjunto é chamado de caracteres não reservados.

A recomendação prática da aula será gerar:

```text
32 bytes aleatórios.
```

Depois:

```text
Base64URL sem padding.
```

Trinta e dois bytes produzem 43 caracteres Base64URL sem `=`.

Isso fornece 256 bits de entropia antes da codificação.

---

### O verifier não é password de usuário

Ele não é:

- password;
- client secret permanente;
- token de acesso;
- authorization code;
- nonce;
- state.

Ele é uma prova efêmera por tentativa.

Depois de consumido ou expirado, precisa ser descartado.

---

### Code challenge

Para `S256`:

```text
code_challenge =
BASE64URL(
    SHA-256(
        ASCII(code_verifier)
    )
)
```

A codificação Base64URL precisa ser:

- URL-safe;
- sem padding;
- sem line breaks;
- determinística.

O challenge pode viajar na authorization request.

Ele não revela diretamente o verifier quando `S256` é usado.

---

### Code challenge method

A baseline aceita somente:

```text
S256.
```

O método `plain` envia o próprio verifier como challenge.

Isso expõe a prova na authorization request e reduz a proteção quando um atacante consegue observar esse canal.

A prática atual recomenda `S256`.

Se o Authorization Server suporta `S256`, o client não deve fazer downgrade para `plain`.

---

### Vínculo ao authorization code

O Authorization Server precisa armazenar, junto da autorização:

```text
client_id;

redirect_uri;

code_challenge;

code_challenge_method;

resource owner;

scopes;

expiração;

estado de uso.
```

Quando emite o authorization code, o challenge fica vinculado a ele.

Na troca, não basta verificar o verifier isoladamente.

É necessário verificar o verifier contra o challenge associado àquele code.

---

### Verificação

Ao receber:

```text
code;

code_verifier.
```

o Authorization Server:

1. localiza a autorização;
2. verifica client;
3. verifica redirect URI;
4. verifica code ainda válido;
5. verifica code não usado;
6. confirma método `S256`;
7. calcula challenge do verifier;
8. compara;
9. marca code como usado;
10. emite tokens.

Falha em qualquer etapa impede emissão.

---

### PKCE para clients públicos

Clients públicos não conseguem guardar um client secret duradouro.

PKCE fornece uma prova dinâmica por tentativa.

Ele não transforma o client público em confidencial.

A identidade do software distribuído continua não sendo garantida por um shared secret.

---

### PKCE para clients confidenciais

Clients confidenciais continuam autenticando-se no token endpoint.

PKCE acrescenta proteção ao authorization code.

Fluxo:

```text
client authentication:
prova quem é o client registrado.

PKCE:
prova continuidade
da tentativa de autorização.
```

Não remova client authentication porque PKCE está ativo.

---

### PKCE não substitui state

PKCE não é uma defesa completa contra CSRF no redirect.

`state` continua necessário para ligar a authorization response ao fluxo iniciado pelo client.

Baseline:

```text
state:
CSRF e correlação do redirect.

nonce:
ID Token e replay OIDC.

PKCE:
interceptação do authorization code.
```

---

### PKCE não substitui nonce

`nonce` é validado no ID Token.

O verifier é enviado ao token endpoint.

Eles possuem destinos e objetivos diferentes.

Usar o mesmo valor para state, nonce e verifier:

- reduz separação de contexto;
- aumenta impacto de vazamento;
- confunde lifecycle;
- facilita erros de implementação.

A aula gerará valores independentes.

---

### PKCE não substitui TLS

Sem TLS, um atacante pode observar ou modificar:

- authorization request;
- redirect;
- token request;
- tokens;
- metadata.

PKCE reduz uma classe específica de ataque.

Ele não protege todo o protocolo.

---

### PKCE não corrige redirect URI insegura

Uma redirect URI ampla ou mal validada ainda pode permitir desvio da resposta.

O Authorization Server deve comparar redirect URIs conforme o registro.

Wildcards amplos não devem ser usados.

---

### PKCE não protege token já emitido

Depois que access token ou refresh token são emitidos, PKCE não impede:

- roubo do bearer token;
- XSS;
- malware;
- log indevido;
- armazenamento inseguro;
- replay do bearer.

A proteção de tokens continua necessária.

---

### Entropia

Não use:

```text
UUID textual concatenado sem análise;

timestamp;

contador;

username;

state reutilizado;

Math.random();

Random.
```

Use:

```java
SecureRandom
```

com bytes suficientes.

O verifier não precisa ser memorizável.

---

### ASCII e UTF-8

O alfabeto permitido é ASCII.

Na derivação:

```text
ASCII(code_verifier)
```

e UTF-8 geram os mesmos bytes para esses caracteres.

A implementação da aula usará:

```java
StandardCharsets.US_ASCII
```

para declarar a intenção de forma explícita.

---

### Base64URL sem padding

Use:

```java
Base64.getUrlEncoder()
        .withoutPadding()
```

Não use Base64 padrão.

Base64 padrão pode produzir:

```text
+;

/;

=.
```

Os dois primeiros não pertencem ao alfabeto URL-safe, e o padding não faz parte do valor gerado nesta baseline.

---

### Comparação

O Authorization Server compara o challenge calculado com o challenge armazenado.

No laboratório, será usada:

```java
MessageDigest.isEqual
```

sobre bytes ASCII.

A comparação constant-time não elimina todas as diferenças de fluxo, mas evita comparação ingênua caractere a caractere.

---

### Tentativa de autorização

O Relying Party precisa manter contexto temporário por tentativa:

```text
attemptId;

state;

nonce;

codeVerifier;

createdAt;

expiresAt;

consumed.
```

Esse contexto não deve ser confundido com sessão autenticada.

Ele existe antes do login ser concluído.

---

### Armazenamento do verifier

Opções:

- sessão server-side;
- storage temporário protegido;
- cache distribuído;
- mecanismo gerenciado pelo framework.

Para uma SPA pura, o verifier permanece no client que iniciou o fluxo, com cuidados contra XSS e perda de contexto.

Nesta aula, o laboratório usa um store in-memory test-only para modelar lifecycle.

Isso não será chamado de solução de produção.

---

### Uso único

Quando a callback é processada:

1. state localiza a tentativa;
2. tentativa é validada;
3. verifier é recuperado;
4. code é trocado;
5. tentativa é consumida;
6. state, nonce e verifier são removidos.

Uma segunda callback com o mesmo state precisa falhar.

---

### Expiração

Tentativas incompletas precisam expirar.

Um TTL curto reduz:

- replay;
- acúmulo de memória;
- tentativa abandonada;
- exposição do verifier.

A aula utilizará:

```text
cinco minutos
como valor de laboratório.
```

O valor de produção depende da UX e do provedor.

---

### Não registrar valores

Proibido em logs e auditoria:

- verifier;
- challenge;
- state;
- nonce;
- authorization code;
- access token;
- refresh token.

O challenge é derivado, mas ainda identifica uma tentativa e não precisa aparecer em logs.

Registre apenas:

- outcome;
- provider;
- client ID quando apropriado;
- correlation ID;
- reason code controlado.

---

## Mão na massa guiada

### 1. Criar M15_PKCE_PROFILE.md

Arquivo:

```text
docs/security/M15_PKCE_PROFILE.md
```

Inclua:

```markdown
# Perfil PKCE

## Decisoes

- Obrigatorio em Authorization Code.
- Metodo S256.
- Plain proibido.
- Verifier aleatorio por tentativa.
- 32 bytes de entropia.
- Base64URL sem padding.
- Uso unico.
- TTL curto.
- Sem logs.

## Controles relacionados

- state para redirect.
- nonce para ID Token.
- TLS para transporte.
- redirect URI estrita.
```

---

### 2. Criar PkceProof

```java
package br.com.formacao.backend.configuration
        .security.oauth2.pkce;

public record PkceProof(
        String verifier,
        String challenge,
        String challengeMethod
) {
}
```

Esse record pertence a `src/test`.

Não registre seu `toString()`.

---

### 3. Criar PkceGenerator

```java
final class PkceGenerator {

    private static final int VERIFIER_BYTES =
            32;

    private final SecureRandom secureRandom;

    PkceGenerator(
            SecureRandom secureRandom
    ) {
        this.secureRandom = secureRandom;
    }

    PkceProof generate() {
        byte[] random =
                new byte[VERIFIER_BYTES];

        secureRandom.nextBytes(random);

        try {
            String verifier =
                    Base64
                            .getUrlEncoder()
                            .withoutPadding()
                            .encodeToString(random);

            String challenge =
                    challenge(verifier);

            return new PkceProof(
                    verifier,
                    challenge,
                    "S256"
            );
        }
        finally {
            Arrays.fill(
                    random,
                    (byte) 0
            );
        }
    }
```

Continue:

```java
    String challenge(
            String verifier
    ) {
        validateVerifier(verifier);

        try {
            MessageDigest digest =
                    MessageDigest
                            .getInstance(
                                    "SHA-256"
                            );

            byte[] hash =
                    digest.digest(
                            verifier.getBytes(
                                    StandardCharsets
                                            .US_ASCII
                            )
                    );

            try {
                return Base64
                        .getUrlEncoder()
                        .withoutPadding()
                        .encodeToString(hash);
            }
            finally {
                Arrays.fill(
                        hash,
                        (byte) 0
                );
            }
        }
        catch (
            NoSuchAlgorithmException exception
        ) {
            throw new IllegalStateException(
                    "SHA-256 is unavailable",
                    exception
            );
        }
    }

    void validateVerifier(
            String verifier
    ) {
        if (
            verifier == null
            || verifier.length() < 43
            || verifier.length() > 128
            || !verifier.matches(
                    "[A-Za-z0-9._~-]+"
            )
        ) {
            throw new IllegalArgumentException(
                    "Invalid PKCE verifier"
            );
        }
    }
}
```

A exception não repete o verifier.

---

### 4. Validar o comprimento gerado

Teste:

```java
@Test
void shouldGenerateVerifierWithFortyThreeCharacters() {
    PkceProof proof =
            generator.generate();

    assertThat(
            proof.verifier()
    )
    .hasSize(43);
}
```

Trinta e dois bytes Base64URL sem padding produzem 43 caracteres.

---

### 5. Validar o alfabeto

```java
@Test
void shouldUseOnlyUnreservedCharacters() {
    PkceProof proof =
            generator.generate();

    assertThat(
            proof.verifier()
    )
    .matches(
            "[A-Za-z0-9._~-]{43,128}"
    );

    assertThat(
            proof.challenge()
    )
    .matches(
            "[A-Za-z0-9_-]+"
    )
    .doesNotContain("=");
}
```

O challenge Base64URL não precisa conter ponto ou til.

---

### 6. Testar unicidade prática

Gere dez mil provas sintéticas:

```java
Set<String> verifiers =
        IntStream.range(
                0,
                10_000
        )
        .mapToObj(
                ignored ->
                        generator
                                .generate()
                                .verifier()
        )
        .collect(
                Collectors.toSet()
        );

assertThat(verifiers)
        .hasSize(10_000);
```

Esse teste detecta erro grosseiro.

Ele não prova matematicamente a qualidade do gerador.

---

### 7. Testar o vetor do RFC

Use o verifier conhecido do exemplo do RFC 7636:

```text
dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
```

Challenge esperado:

```text
E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
```

Teste:

```java
assertThat(
        generator.challenge(verifier)
)
.isEqualTo(expectedChallenge);
```

Esse teste valida interoperabilidade da transformação.

---

### 8. Rejeitar verifiers inválidos

Casos:

- 42 caracteres;
- 129 caracteres;
- espaço;
- `+`;
- `/`;
- `=`;
- quebra de linha;
- Unicode;
- string vazia;
- `null`.

Todos devem lançar:

```text
IllegalArgumentException.
```

A mensagem permanece genérica.

---

### 9. Criar AuthorizationAttempt

```java
record AuthorizationAttempt(
        UUID id,
        String state,
        String nonce,
        String codeVerifier,
        Instant createdAt,
        Instant expiresAt
) {
}
```

O record existe apenas no teste.

Não use seu `toString()` em logs.

---

### 10. Gerar state e nonce independentes

Crie um helper:

```java
String randomUrlSafe(
        int bytes
) {
    byte[] value =
            new byte[bytes];

    secureRandom.nextBytes(value);

    try {
        return Base64
                .getUrlEncoder()
                .withoutPadding()
                .encodeToString(value);
    }
    finally {
        Arrays.fill(
                value,
                (byte) 0
        );
    }
}
```

Na tentativa:

```java
state:
32 bytes.

nonce:
32 bytes.

verifier:
32 bytes,
gerado separadamente.
```

Teste que os três valores são diferentes.

---

### 11. Criar InMemoryAuthorizationAttemptStore

```java
final class
        InMemoryAuthorizationAttemptStore {

    private final Map<String, AuthorizationAttempt>
            attempts =
            new ConcurrentHashMap<>();

    void save(
            AuthorizationAttempt attempt
    ) {
        AuthorizationAttempt previous =
                attempts.putIfAbsent(
                        attempt.state(),
                        attempt
                );

        if (previous != null) {
            throw new IllegalStateException(
                    "Authorization state collision"
            );
        }
    }

    Optional<AuthorizationAttempt>
    consume(
            String state,
            Instant now
    ) {
        AuthorizationAttempt attempt =
                attempts.remove(state);

        if (
            attempt == null
            || !attempt.expiresAt()
                    .isAfter(now)
        ) {
            return Optional.empty();
        }

        return Optional.of(attempt);
    }
}
```

`remove` implementa consumo único.

---

### 12. Não armazenar challenge como substituto do verifier

O Relying Party precisa do verifier para o token request.

Armazenar somente o challenge impediria a troca.

O Authorization Server armazena o challenge.

O client ou RP armazena o verifier.

Essa diferença precisa aparecer no documento.

---

### 13. Criar PkceVerificationService

O laboratório modelará o lado do Authorization Server:

```java
final class PkceVerificationService {

    private final PkceGenerator generator;

    PkceVerificationService(
            PkceGenerator generator
    ) {
        this.generator = generator;
    }

    boolean matches(
            String storedChallenge,
            String challengeMethod,
            String receivedVerifier
    ) {
        if (
            !"S256".equals(
                    challengeMethod
            )
        ) {
            return false;
        }

        String calculated;

        try {
            calculated =
                    generator.challenge(
                            receivedVerifier
                    );
        }
        catch (
            IllegalArgumentException exception
        ) {
            return false;
        }

        return MessageDigest.isEqual(
                storedChallenge.getBytes(
                        StandardCharsets.US_ASCII
                ),
                calculated.getBytes(
                        StandardCharsets.US_ASCII
                )
        );
    }
}
```

O método nunca aceita `plain`.

---

### 14. Testar correspondência

```java
PkceProof proof =
        generator.generate();

assertThat(
        verificationService.matches(
                proof.challenge(),
                proof.challengeMethod(),
                proof.verifier()
        )
)
.isTrue();
```

Esse é o caminho válido.

---

### 15. Testar mismatch

Altere um caractere do verifier.

Resultado:

```text
false.
```

Não emita detalhe público dizendo qual posição divergiu.

---

### 16. Testar verifier ausente

Valores:

```text
null;

string vazia.
```

Resultado:

```text
false.
```

No protocolo real, o token endpoint retorna erro OAuth apropriado.

O laboratório não implementará a response HTTP.

---

### 17. Rejeitar plain

```java
assertThat(
        verificationService.matches(
                proof.verifier(),
                "plain",
                proof.verifier()
        )
)
.isFalse();
```

Mesmo que os textos coincidam, o método não é permitido pela policy.

---

### 18. Testar consumo único

1. salvar tentativa;
2. consumir com state correto;
3. obter tentativa;
4. consumir novamente;
5. receber vazio.

Esse teste modela replay da callback.

---

### 19. Testar state incorreto

Salvar uma tentativa com `state-A`.

Consumir com `state-B`.

Resultado:

```text
vazio.
```

A tentativa original continua disponível até ser consumida ou expirar.

Não faça fallback para “última tentativa criada”.

---

### 20. Testar expiração

Use `Clock` fixo.

Tentativa:

```text
createdAt:
10:00.

expiresAt:
10:05.
```

Consumo:

```text
10:04:
permitido.

10:05:
rejeitado,
conforme comparação adotada.
```

O limite precisa ser testado explicitamente.

---

### 21. Modelar o authorization request

Crie uma representação test-only:

```java
record AuthorizationRequestData(
        String clientId,
        URI redirectUri,
        String responseType,
        Set<String> scopes,
        String state,
        String nonce,
        String codeChallenge,
        String codeChallengeMethod
) {
}
```

Valide:

```text
response_type=code;

state presente;

nonce presente em OIDC;

challenge presente;

method=S256.
```

---

### 22. Modelar o token request

```java
record TokenRequestData(
        String grantType,
        String code,
        URI redirectUri,
        String clientId,
        String codeVerifier
) {
}
```

Valide:

```text
grant_type=authorization_code;

code presente;

redirect URI igual;

client ID igual;

verifier válido.
```

Não inclua ID Token ou access token nessa request.

---

### 23. Simular interceptação

Cenário:

1. client legítimo gera verifier;
2. authorization request leva challenge;
3. atacante intercepta apenas o code;
4. atacante cria outro verifier;
5. token endpoint calcula challenge diferente;
6. troca é rejeitada;
7. client legítimo usa verifier correto;
8. troca é permitida.

Esse é o teste narrativo principal da aula.

---

### 24. Simular vazamento do verifier

Se o atacante obtiver:

```text
code + verifier.
```

PKCE não impede a troca.

Por isso, continuam necessários:

- TLS;
- armazenamento seguro;
- ausência de logs;
- proteção contra XSS;
- proteção do dispositivo;
- callback segura.

Documente o limite sem diminuir o valor do controle.

---

### 25. Testar separação dos valores

Teste que:

```text
state != nonce;

state != verifier;

nonce != verifier.
```

Também valide que nenhum valor é derivado diretamente do outro.

A independência reduz acoplamento e confusão.

---

### 26. Testar ausência em logs

Use um appender de teste.

Gere:

- state;
- nonce;
- verifier;
- challenge;
- authorization code sintético.

Execute cenários de sucesso e falha.

Confirme que nenhuma dessas strings aparece no output capturado.

O teste pode procurar os valores completos.

---

### 27. Testar ausência em auditoria planejada

Revise o catálogo da aula 430.

Eventos futuros podem registrar:

```text
OIDC_AUTHENTICATION_STARTED;

OAUTH_CODE_EXCHANGE_FAILED;

OIDC_AUTHENTICATION_SUCCEEDED.
```

Não devem registrar:

- state;
- nonce;
- verifier;
- challenge;
- code.

Registre apenas correlation ID e reason code.

---

### 28. Atualizar secrets baseline

O verifier é uma credencial efêmera.

Classificação:

```text
secret efêmero.
```

O challenge é derivado e não concede sozinho a troca, mas ainda não precisa ser logado.

Adicione os dois ao inventário de dados proibidos em logs.

Não crie secrets permanentes para esta aula.

---

### 29. Atualizar threat model

Adicione:

```text
THR-133:
authorization code é interceptado.

THR-134:
verifier possui baixa entropia.

THR-135:
client usa método plain.

THR-136:
verifier é reutilizado.

THR-137:
attempt não expira.

THR-138:
state, nonce e verifier
usam o mesmo valor.

THR-139:
verifier aparece em log.

THR-140:
challenge não é vinculado ao code.

THR-141:
token endpoint ignora redirect URI.

THR-142:
PKCE é tratado
como substituto de TLS.

THR-143:
client confidencial remove
sua autenticação por usar PKCE.
```

Controles:

- SecureRandom;
- 32 bytes;
- S256;
- uso único;
- TTL;
- valores independentes;
- proibição de logs;
- vínculo da autorização;
- redirect estrita;
- TLS;
- client authentication preservada.

---

### 30. Atualizar OWASP e baseline

A02 Security Misconfiguration:

```text
plain:
rejeitado.

S256:
obrigatório.

attempt:
TTL e consumo único.
```

A07 Authentication Failures:

```text
state:
preservado.

nonce:
preservado.

PKCE:
obrigatório.
```

A09 Security Logging:

```text
verifier, challenge,
state, nonce e code:
proibidos em logs.
```

Baseline:

```text
Authorization Code:
sempre com PKCE.

verifier:
32 bytes aleatórios.

challenge:
S256.

plain:
não suportado.

Keycloak:
ainda não integrado.

produção pública:
NO-GO.
```

---

### 31. Criar PkceFoundationsTest

Organize:

```text
nested class Generator;

nested class RfcVector;

nested class Verification;

nested class AttemptLifecycle;

nested class AuthorizationRequest;

nested class InterceptionAttack;

nested class LogProtection.
```

Os testes não carregam Spring.

Eles são rápidos e determinísticos quando recebem `SecureRandom` controlado apenas nos cenários de vetor.

Para geração real, use `SecureRandom` verdadeiro.

---

### 32. Criar guardrails

Verifique:

```text
nenhum método plain aceito;

nenhum Math.random;

nenhum java.util.Random;

nenhum verifier hardcoded
fora do vetor RFC;

nenhum log de proof;

nenhum endpoint OAuth criado;

nenhuma configuração Keycloak.
```

A ausência de runtime continua sendo requisito.

---

### 33. Executar o gate

Teste focado:

```powershell
.\mvnw.cmd `
  -Dtest=PkceFoundationsTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Buscas:

```powershell
git grep `
  -n `
  -E `
  "code_verifier|code_challenge|Math\\.random|new Random"
```

Revise cada ocorrência.

---

## Entendendo o que foi feito

### O code ganhou uma prova complementar

Interceptar somente o authorization code não basta.

### O verifier ficou no iniciador

O authorization request envia apenas o challenge.

### S256 foi fixado

Não existe downgrade para `plain`.

### A prova é efêmera

Cada tentativa usa novo verifier e TTL curto.

### State, nonce e PKCE ficaram independentes

Cada controle possui finalidade e lifecycle próprios.

### O store consumiu a tentativa

Replay da callback não recupera o mesmo verifier.

### O vetor RFC comprovou interoperabilidade

A transformação não depende de interpretação local.

### Os limites foram documentados

PKCE não substitui TLS, redirect URI segura ou proteção de tokens.

---

## Erros comuns importantes

### Gerar verifier com Random

Use `SecureRandom`.

### Usar verifier curto

A faixa é 43–128 caracteres.

### Usar Base64 comum

Use Base64URL sem padding.

### Aceitar plain

A baseline permite somente `S256`.

### Usar o challenge no token request

O token request envia o verifier.

### Guardar somente o challenge no client

O client precisa recuperar o verifier.

### Reutilizar verifier entre tentativas

Cada tentativa exige um novo valor.

### Confundir state e verifier

State não prova posse do verifier.

### Logar o verifier para depurar

Isso elimina a proteção em caso de acesso aos logs.

### Achar que PKCE protege access token roubado

PKCE atua antes da emissão.

---

## Comandos úteis

### Teste PKCE

```powershell
.\mvnw.cmd `
  -Dtest=PkceFoundationsTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar geradores fracos

```powershell
git grep `
  -n `
  -E `
  "Math\\.random|new Random"
```

### Procurar método plain

```powershell
git grep `
  -n `
  -E `
  "code_challenge_method.*plain|\"plain\""
```

### Procurar logs indevidos

```powershell
git grep `
  -n `
  -E `
  "log.*(verifier|challenge|state|nonce|code)"
```

---

## Exercício guiado

### Parte 1 — Ameaça

Explique o ataque de code interception.

### Parte 2 — Geração

Crie verifier com 32 bytes de `SecureRandom`.

### Parte 3 — Derivação

Calcule challenge com SHA-256 e Base64URL.

### Parte 4 — Validação

Exija 43–128 caracteres não reservados.

### Parte 5 — Tentativa

Armazene state, nonce e verifier.

### Parte 6 — Consumo

Remova a tentativa no primeiro uso.

### Parte 7 — Expiração

Rejeite contexto vencido.

### Parte 8 — Ataque

Comprove que outro verifier falha.

### Parte 9 — Sigilo

Garanta ausência em logs.

### Parte 10 — Governança

Atualize documentação, riscos e baseline.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 433 foi preservada;
- ponte correta aponta para Keycloak ambiente local;
- ameaça de code interception foi explicada;
- `code_verifier` foi definido;
- `code_challenge` foi definido;
- método `S256` foi adotado;
- método `plain` foi rejeitado;
- verifier possui 43–128 caracteres;
- alfabeto não reservado foi aplicado;
- geração usa 32 bytes;
- `SecureRandom` foi usado;
- `Random` e `Math.random` foram rejeitados;
- Base64URL sem padding foi usada;
- SHA-256 foi usado;
- ASCII foi declarado;
- verifier não foi confundido com password;
- verifier é novo por tentativa;
- challenge viaja na authorization request;
- verifier viaja na token request;
- challenge é vinculado ao authorization code;
- token endpoint recalcula o challenge;
- comparação defensiva foi usada;
- public clients foram cobertos;
- confidential clients preservam client authentication;
- PKCE não substituiu state;
- PKCE não substituiu nonce;
- PKCE não substituiu TLS;
- PKCE não corrigiu redirect URI insegura;
- PKCE não foi tratado como proteção de token emitido;
- `PkceProof` foi criado em test source;
- `PkceGenerator` foi criado;
- tamanho gerado foi testado;
- alfabeto foi testado;
- padding foi rejeitado;
- vetor RFC foi testado;
- verifiers inválidos foram rejeitados;
- `AuthorizationAttempt` foi criado;
- state, nonce e verifier são independentes;
- store test-only foi criado;
- save evita colisão;
- consume remove a tentativa;
- replay foi rejeitado;
- expiração foi testada;
- state incorreto foi rejeitado;
- fallback para última tentativa não existe;
- `PkceVerificationService` foi criado;
- correspondência válida foi testada;
- mismatch foi rejeitado;
- verifier ausente foi rejeitado;
- plain foi rejeitado mesmo com textos iguais;
- authorization request foi modelada;
- token request foi modelada;
- redirect URI e client ID foram preservados;
- ataque de interceptação foi simulado;
- limite de vazamento do verifier foi documentado;
- ausência em logs foi testada;
- verifier foi classificado como secret efêmero;
- challenge também foi proibido em logs;
- auditoria planejada não contém valores;
- threat model foi atualizado;
- OWASP A02, A07 e A09 foram atualizados;
- nenhum endpoint OAuth foi criado;
- nenhuma configuração Keycloak foi antecipada;
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
git grep -n -E "Math\\.random|new Random"
git grep -n -E "code_challenge_method.*plain"
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
git commit -m "test(m15): modelar PKCE com S256 e uso unico"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- verifier real;
- challenge de execução;
- state;
- nonce;
- authorization code;
- access token;
- refresh token;
- client secret;
- endpoint OAuth fictício;
- configuração Keycloak antecipada;
- log com prova PKCE.

---

## Fechamento e ponte para a próxima aula

Nesta aula, PKCE adicionou prova de continuidade ao Authorization Code Flow.

O client cria:

```text
code_verifier.
```

E deriva:

```text
code_challenge =
BASE64URL(
    SHA-256(
        ASCII(verifier)
    )
).
```

A authorization request envia:

```text
code_challenge;

code_challenge_method=S256.
```

A token request envia:

```text
code_verifier.
```

O Authorization Server emite tokens somente quando a prova corresponde ao challenge vinculado ao code.

A baseline ficou:

```text
SecureRandom;

32 bytes;

43 caracteres;

Base64URL sem padding;

S256;

uso único;

TTL curto;

sem logs;

plain rejeitado.
```

Os controles permaneceram separados:

```text
state:
protege o redirect.

nonce:
protege a resposta OIDC.

PKCE:
protege a troca do code.

TLS:
protege o transporte.
```

A decisão central foi:

```text
um authorization code interceptado
não deve ser suficiente
para obter tokens;

somente a instância
que conserva o verifier
pode concluir a troca.
```

Até aqui, todos os componentes foram modelados sem um provedor real.

A próxima etapa será observar esses conceitos em um OpenID Provider executável.

A próxima aula será:

```text
435 - M15.25 - Keycloak ambiente local
```

Nela, você irá:

- adicionar Keycloak ao ambiente local;
- fixar versão de imagem;
- criar volume persistente;
- configurar hostname local;
- criar credencial administrativa somente por secret;
- restringir exposição;
- validar readiness;
- acessar discovery;
- acessar JWKS;
- manter realm e clients ainda fora do escopo;
- preparar o login da aula 436.

---

# Material complementar

## Checkpoint final

- [ ] Gerei verifier com entropia forte.
- [ ] Derivei challenge com `S256`.
- [ ] Mantive state, nonce e verifier separados.
- [ ] Implementei TTL e consumo único.
- [ ] Testei interceptação, mismatch e replay.

---

## Troubleshooting adicional

### O challenge contém `=`

O encoder foi usado com padding.

Aplique `withoutPadding()`.

### O challenge do vetor RFC não coincide

Revise:

- bytes ASCII;
- SHA-256;
- Base64URL;
- ausência de padding;
- ausência de newline.

### O verifier possui 42 caracteres

Gere 32 bytes antes do Base64URL.

Não corte o texto manualmente.

### O token endpoint aceita outro verifier

Confirme que o challenge está vinculado ao authorization code correto.

### A callback funciona duas vezes

O attempt store precisa remover a tentativa no primeiro consumo.

### State correto, mas verifier perdido

O contexto temporário foi descartado cedo ou armazenado no local errado.

### PKCE funciona sem HTTPS

O teste local não significa que TLS seja opcional em ambientes reais.

### O verifier aparece no relatório de teste

Não inclua values em nomes de teste, assertions, exceptions ou logs.

---

## Perguntas de revisão

1. Qual ameaça PKCE reduz?
2. O que é `code_verifier`?
3. Qual o comprimento permitido?
4. Qual alfabeto é permitido?
5. Quantos bytes a baseline gera?
6. O que é `code_challenge`?
7. Qual método foi adotado?
8. `plain` é permitido?
9. O que vai na authorization request?
10. O que vai na token request?
11. Quem armazena o challenge?
12. Quem conserva o verifier?
13. PKCE substitui state?
14. PKCE substitui nonce?
15. PKCE substitui TLS?
16. Verifier pode ser reutilizado?
17. O que ocorre após o primeiro consumo?
18. O verifier pode aparecer em logs?
19. Qual é a próxima aula?
20. O que será iniciado nela?

---

## Roteiro de resposta

1. Interceptação do authorization code.
2. Prova aleatória criada pelo client.
3. 43–128 caracteres.
4. Caracteres não reservados.
5. 32 bytes.
6. Derivação do verifier.
7. `S256`.
8. Não.
9. Challenge e método.
10. Code e verifier.
11. Authorization Server.
12. Client ou RP.
13. Não.
14. Não.
15. Não.
16. Não.
17. A tentativa deixa de existir.
18. Não.
19. Keycloak ambiente local.
20. Um OpenID Provider local.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 434 - M15.24 - PKCE

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Estudei a ameaça de interceptação do authorization code.
- Defini `code_verifier`.
- Defini `code_challenge`.
- Adotei o método `S256`.
- Rejeitei o método `plain`.
- Gerei 32 bytes com `SecureRandom`.
- Usei Base64URL sem padding.
- Obtive verifier de 43 caracteres.
- Validei a faixa de 43 a 128 caracteres.
- Validei o alfabeto não reservado.
- Derivei o challenge com SHA-256 e ASCII.
- Testei o vetor oficial do RFC 7636.
- Criei `PkceProof`.
- Criei `PkceGenerator`.
- Criei `AuthorizationAttempt`.
- Gerei state, nonce e verifier separadamente.
- Criei `InMemoryAuthorizationAttemptStore`.
- Apliquei TTL curto.
- Implementei consumo único.
- Rejeitei replay.
- Rejeitei state incorreto.
- Criei `PkceVerificationService`.
- Testei proof válida, mismatch e verifier ausente.
- Modelei authorization request e token request.
- Simulei interceptação do code.
- Registrei que PKCE não substitui state, nonce, TLS ou redirect URI segura.
- Preservei client authentication para clients confidenciais.
- Proibi verifier, challenge, state, nonce e code em logs.
- Classifiquei verifier como secret efêmero.
- Criei `docs/security/M15_PKCE_PROFILE.md`.
- Atualizei secrets baseline, auditoria planejada, threat model e OWASP.
- Não criei endpoints OAuth ou configuração Keycloak.
- Próxima aula: Keycloak ambiente local.
```

---

## Referência técnica curta

- [RFC 7636 — Proof Key for Code Exchange by OAuth Public Clients](https://www.rfc-editor.org/rfc/rfc7636.html)
- [RFC 9700 — Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)
- [RFC 6749 — The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html)
- [Spring Security — Authorization Grant Support](https://docs.spring.io/spring-security/reference/servlet/oauth2/client/authorization-grants.html)
- [Spring Authorization Server — SPA with PKCE](https://docs.spring.io/spring-authorization-server/reference/guides/how-to-pkce.html)
- [Java 21 — SecureRandom](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/security/SecureRandom.html)
- [Java 21 — MessageDigest](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/security/MessageDigest.html)

Regra final:

```text
PKCE deve ser aplicado a todo Authorization Code Flow desta baseline: o client gera um verifier aleatório de alta entropia, envia somente o challenge S256 na authorization request, conserva o verifier em contexto temporário e o apresenta no token endpoint; o Authorization Server vincula challenge e code, valida client, redirect, expiração e uso único, recalcula a prova e rejeita qualquer mismatch; state, nonce, TLS, redirect URI e autenticação do client continuam obrigatórios conforme o cenário, e verifier, challenge, code, state e nonce nunca devem aparecer em logs ou auditoria.
```
