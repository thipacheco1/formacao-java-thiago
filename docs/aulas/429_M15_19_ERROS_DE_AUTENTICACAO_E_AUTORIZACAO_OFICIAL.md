# 429 - M15.19 - Erros de autenticacao e autorizacao

## Apresentação da aula

Na aula 428, a autorização deixou de considerar somente a permission geral da operação.

A Ordem de Serviço passou a possuir:

```text
owner_user_id.
```

O backend deriva esse valor do subject UUID autenticado.

A policy combina:

```text
permission;

role;

subject;

recurso;

ownership.
```

Com isso:

```text
operador A lê a própria OS:
permitido.

operador A tenta ler a OS de B:
negado.

auditor lê a OS de B:
permitido.

supervisor altera a OS de B:
permitido conforme permission.

owner enviado pelo cliente:
rejeitado.
```

A autorização está tecnicamente correta, mas uma questão permanece:

```text
como cada falha deve aparecer
para o cliente da API?
```

Considere os cenários:

- request sem bearer token;
- bearer token expirado;
- signature inválida;
- issuer incorreto;
- login com username inexistente;
- login com password incorreta;
- refresh token expirado;
- usuário autenticado sem permission;
- usuário com permission tentando acessar recurso de outro owner;
- UUID que não corresponde a nenhuma OS;
- endpoint não declarado;
- método HTTP não suportado;
- falha inesperada do servidor.

Responder tudo como:

```http
500 Internal Server Error
```

é incorreto.

Responder tudo como:

```http
403 Forbidden
```

também é incorreto.

Expor mensagens como:

```text
user operator exists but password is wrong;

token signature does not match key jwt-lab-2026-01;

service order exists but belongs to another user;

account is locked;

refresh token was already rotated.
```

cria vazamento de informações.

A pergunta central desta aula será:

```text
como manter semântica HTTP correta,
preservar os challenges de autenticação,
evitar enumeração,
entregar um contrato estável
e ainda permitir investigação interna?
```

A solução utilizará:

```text
RFC 9457 Problem Details;

catálogo fechado de erros;

AuthenticationEntryPoint;

AccessDeniedHandler;

GlobalExceptionHandler;

correlation ID;

Cache-Control: no-store;

mensagens públicas genéricas;

causas internas restritas ao servidor.
```

A política será:

| Situação | Status | Código público |
|---|---:|---|
| Bearer ausente | 401 | `authentication_required` |
| Bearer inválido | 401 | `invalid_token` |
| Login inválido | 401 | `invalid_credentials` |
| Refresh inválido | 401 | `invalid_refresh_token` |
| Permission ausente | 403 | `access_denied` |
| Recurso inexistente ou oculto por ownership | 404 | `service_order_not_found` |
| Método não suportado | 405 | contrato HTTP existente |
| Validation | 400 | contrato de validation existente |
| Concorrência otimista | 409/412 | contrato existente |
| Falha inesperada | 500 | `internal_error` |

A diferença entre `401` e `403` será preservada.

`401` significa que a request não possui uma autenticação aceitável para o recurso.

Em recursos bearer, a response inclui:

```http
WWW-Authenticate: Bearer
```

Quando o token foi apresentado, mas é inválido:

```http
WWW-Authenticate: Bearer error="invalid_token"
```

`403` significa que a identidade foi autenticada, mas a operação não foi autorizada.

Para recursos individuais de OS, a aplicação adotará ocultação deliberada.

Estes dois cenários terão a mesma response:

```text
UUID não existe;

UUID existe,
mas o usuário não pode conhecer o recurso.
```

Response:

```http
404 Not Found
Content-Type: application/problem+json
Cache-Control: no-store
```

Body:

```json
{
  "type": "urn:problem:service-order-not-found",
  "title": "Service order not found",
  "status": 404,
  "detail": "The requested service order was not found.",
  "instance": "urn:correlation:...",
  "code": "service_order_not_found",
  "correlationId": "..."
}
```

Isso reduz enumeração horizontal.

A policy de ocultação não será aplicada cegamente a toda autorização.

Exemplos:

```text
auditor tenta criar sem permission:
403.

operador tenta excluir sem delete:
403.

operador possui read,
mas tenta ler OS de outro owner:
404.
```

A distinção ocorre em duas etapas:

```text
@PreAuthorize:
permission geral;
falha -> 403.

guard de negócio:
existência e relacionamento;
falha -> 404.
```

Essa aula refinará a implementação da aula 428.

A regra de ownership deixará de retornar apenas `false` dentro de uma expression composta.

Ela será aplicada por um guard explícito no início do método, depois que `@PreAuthorize` validar a permission.

A próxima aula oficial será:

```text
430 - M15.20 - Auditoria de acoes sensiveis
```

Nela, as decisões e ações de segurança serão registradas de maneira estruturada, sem incluir credenciais ou tokens.

---

## Onde estamos na formação

A sequência oficial é:

```text
427:
Method Security.

428:
Autorizacao por regra de negocio.

429:
Erros de autenticacao e autorizacao.

430:
Auditoria de acoes sensiveis.

431:
OAuth2 conceitos.

432:
OAuth2 Client Credentials.
```

A aula 428 respondeu:

```text
a identidade pode agir
sobre este recurso específico?
```

A aula 429 responderá:

```text
como comunicar a decisão
sem expor informações
e sem perder a semântica HTTP?
```

Nesta aula:

```text
401:
sim.

403:
sim.

404 oculto:
sim.

WWW-Authenticate:
sim.

Problem Details:
sim.

catálogo de erro:
sim.

writer para filtros:
sim.

handler MVC:
sim.

correlation ID:
sim.

no-store:
sim.

enumeração:
sim.

stack trace público:
não.

auditoria completa:
próxima aula.
```

A regra central será:

```text
o cliente recebe
somente o necessário para reagir;

o servidor preserva
contexto suficiente para investigar.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
configuration/security/error/
├── SecurityProblemCode.java
├── ApiProblemFactory.java
└── SecurityProblemWriter.java
```

Tratamento de segurança atualizado:

```text
ApiBearerAuthenticationEntryPoint.java;

ApiBearerAccessDeniedHandler.java;

GlobalExceptionHandler.java;

InvalidLoginCredentialsException.java;

InvalidRefreshTokenException.java.
```

Autorização de negócio refinada:

```text
configuration/security/authorization/
├── ServiceOrderBusinessAuthorization.java
└── ServiceOrderAccessGuard.java
```

Exception de recurso:

```text
application/serviceorder/
└── ServiceOrderNotFoundException.java
```

Teste:

```text
SecurityErrorContractIntegrationTest.java
```

Documento:

```text
docs/security/M15_SECURITY_ERROR_CONTRACT.md
```

Você irá:

1. definir uma taxonomia de falhas;
2. separar autenticação e autorização;
3. adotar RFC 9457;
4. criar catálogo fechado;
5. criar factory comum;
6. escrever Problem Details em filtros;
7. preservar `WWW-Authenticate`;
8. padronizar login inválido;
9. padronizar refresh inválido;
10. padronizar permission ausente;
11. ocultar recursos por ownership;
12. manter `405` intacto;
13. preservar validation;
14. adicionar correlation ID;
15. aplicar `no-store`;
16. impedir stack trace público;
17. testar igualdade de responses;
18. testar headers;
19. revisar enumeração;
20. preparar auditoria.

---

## Conceito essencial

### 401 não significa permission insuficiente

O status `401 Unauthorized` possui nome histórico confuso.

Na prática, ele representa falha ou ausência de autenticação aceitável.

Exemplos:

- bearer ausente;
- bearer expirado;
- signature inválida;
- login inválido;
- refresh token inválido.

Em um recurso protegido por bearer, o servidor precisa desafiar o cliente com:

```http
WWW-Authenticate: Bearer
```

Login JSON e refresh interno não são challenges bearer.

Eles podem retornar `401` sem anunciar esse esquema.

---

### 403 significa identidade autenticada e acesso negado

Use `403 Forbidden` quando:

- o token é válido;
- a identidade foi criada;
- a permission necessária está ausente;
- a policy decidiu negar uma operação conhecida.

O cliente não deve repetir automaticamente a mesma request com a mesma credencial esperando resultado diferente.

Exemplos:

```text
auditor tenta POST;

operador tenta DELETE;

ROLE_ADMIN isolada tenta ler OS
sem service-order:read.
```

---

### 404 pode ocultar um recurso proibido

Para recursos individuais sensíveis, responder `403` pode revelar:

```text
o UUID corresponde a um objeto real.
```

A política desta API usa `404` quando:

- a OS não existe;
- a OS existe, mas não está visível ao usuário.

O body, status e headers serão iguais.

Isso não substitui autorização.

O backend continua executando a decisão real antes de responder.

---

### Ocultação não é universal

Use `404` de ocultação somente quando a existência do objeto também é informação protegida.

Não use para:

- falta de permission em uma operação coletiva;
- acesso ao probe administrativo;
- tentativa de criar uma OS;
- endpoint conhecido sem authority;
- erro de validation.

Esses casos permanecem `403` ou status funcional apropriado.

---

### Problem Details

RFC 9457 define um formato padronizado para erros HTTP.

Campos principais:

```text
type;

title;

status;

detail;

instance.
```

A API acrescentará:

```text
code;

correlationId.
```

Exemplo:

```json
{
  "type": "urn:problem:invalid-token",
  "title": "Invalid token",
  "status": 401,
  "detail": "The bearer token is invalid or expired.",
  "instance": "urn:correlation:6f...",
  "code": "invalid_token",
  "correlationId": "6f..."
}
```

O `code` é estável para automação.

O `detail` continua genérico e pode evoluir sem ser usado como chave de negócio.

---

### O type precisa ser estável

A aplicação utilizará URNs:

```text
urn:problem:authentication-required;

urn:problem:invalid-token;

urn:problem:invalid-credentials;

urn:problem:invalid-refresh-token;

urn:problem:access-denied;

urn:problem:service-order-not-found;

urn:problem:internal-error.
```

Não gere um type diferente por stack trace ou exception concreta.

---

### instance e correlation ID

O `instance` identificará a ocorrência:

```text
urn:correlation:<correlation-id>.
```

A response também incluirá:

```text
correlationId.
```

O mesmo valor estará no header:

```http
X-Correlation-Id
```

Isso permite suporte e investigação sem devolver detalhes internos.

---

### Mensagem pública e causa interna

Mensagem pública:

```text
The bearer token is invalid or expired.
```

Causas internas possíveis:

- assinatura incorreta;
- token expirado;
- issuer inválido;
- audience inválida;
- `typ` incorreto;
- `jti` ausente;
- authority desconhecida.

O cliente não precisa saber qual validator falhou.

O servidor poderá registrar a categoria interna na aula 430.

Nunca registre o token completo.

---

### Enumeração de usuário

Login com username inexistente e login com password incorreta devem produzir:

- mesmo status;
- mesmo code;
- mesmo title;
- mesmo detail;
- mesmos headers;
- mesma estrutura.

Não prometa tempo perfeitamente idêntico.

Diferenças de infraestrutura existem.

Controles adicionais:

- fluxo de autenticação uniforme;
- password encoder;
- rate limiting;
- métricas;
- MFA;
- detecção de credential stuffing.

Não adicione `sleep` fixo como compensação improvisada.

---

### Enumeração de recurso

Para OS individual, estes cenários compartilham o contrato:

```text
não existe;

existe para outro owner;

owner legado nulo para operador.
```

O banco pode executar caminhos internos diferentes.

O contrato público permanece igual.

A aplicação não devolve:

- owner;
- existência;
- role necessária;
- permission faltante;
- nome do usuário.

---

### Erros em filtros e erros em controllers

Falhas de bearer ocorrem antes do controller.

Elas não passam naturalmente por um `@RestControllerAdvice`.

Por isso, a aplicação terá:

```text
SecurityProblemWriter:
escreve responses nos filtros.

ApiProblemFactory:
cria o mesmo ProblemDetail.

GlobalExceptionHandler:
usa a factory em exceptions MVC.
```

O catálogo compartilhado impede bodies diferentes entre camadas.

---

### Não escrever depois do commit

O writer precisa verificar:

```java
response.isCommitted()
```

Ele não pode tentar substituir uma response já enviada.

O `AuthenticationEntryPoint` e o `AccessDeniedHandler` devem coordenar:

1. headers de protocolo;
2. status;
3. body;
4. content type;
5. cache headers.

---

### Cache de erros de segurança

Responses de autenticação e autorização utilizarão:

```http
Cache-Control: no-store
Pragma: no-cache
```

Isso reduz armazenamento de:

- detalhes de autenticação;
- caminhos sensíveis;
- correlation IDs;
- responses de token.

A response `404` ocultada também usará `no-store`.

---

### Stack traces

Nenhuma response deve incluir:

- nome de classe;
- package;
- SQL;
- JPQL;
- path do keystore;
- alias;
- `kid` interno desnecessário;
- stack trace;
- exception message interna;
- token;
- password;
- hash.

Em produção, o endpoint padrão de erro também precisa estar configurado para não incluir stack trace ou mensagem interna.

---

### 405 permanece 405

Se o path existe, mas o método não é suportado, a resposta correta é:

```http
405 Method Not Allowed
Allow: ...
```

Não remapeie todo `AccessDeniedException` ou toda falha de routing para `403`.

O header `Allow` precisa ser preservado.

---

### Validation permanece 400

Campos inválidos continuam usando o contrato de validation.

Porém:

- password não aparece no rejected value;
- refresh token não aparece no rejected value;
- Authorization header não aparece;
- body bruto não é repetido.

Segurança não exige transformar todos os erros em uma única mensagem.

Ela exige não expor segredos e não criar oráculos indevidos.

---

## Mão na massa guiada

### 1. Criar SecurityProblemCode

```java
package br.com.formacao.backend.configuration
        .security.error;

import org.springframework.http.HttpStatus;

public enum SecurityProblemCode {

    AUTHENTICATION_REQUIRED(
            HttpStatus.UNAUTHORIZED,
            "urn:problem:authentication-required",
            "Authentication required",
            "Authentication is required to access this resource.",
            "authentication_required"
    ),

    INVALID_TOKEN(
            HttpStatus.UNAUTHORIZED,
            "urn:problem:invalid-token",
            "Invalid token",
            "The bearer token is invalid or expired.",
            "invalid_token"
    ),

    INVALID_CREDENTIALS(
            HttpStatus.UNAUTHORIZED,
            "urn:problem:invalid-credentials",
            "Invalid credentials",
            "The supplied credentials are invalid.",
            "invalid_credentials"
    ),

    INVALID_REFRESH_TOKEN(
            HttpStatus.UNAUTHORIZED,
            "urn:problem:invalid-refresh-token",
            "Invalid refresh token",
            "The refresh token is invalid.",
            "invalid_refresh_token"
    ),

    ACCESS_DENIED(
            HttpStatus.FORBIDDEN,
            "urn:problem:access-denied",
            "Access denied",
            "The authenticated identity is not allowed to perform this operation.",
            "access_denied"
    ),

    SERVICE_ORDER_NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "urn:problem:service-order-not-found",
            "Service order not found",
            "The requested service order was not found.",
            "service_order_not_found"
    ),

    INTERNAL_ERROR(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "urn:problem:internal-error",
            "Internal server error",
            "An unexpected error occurred.",
            "internal_error"
    );

    // campos, constructor e getters
}
```

O enum não recebe exception messages.

---

### 2. Criar ApiProblemFactory

```java
@Component
public class ApiProblemFactory {

    public ProblemDetail create(
            SecurityProblemCode code,
            String correlationId
    ) {
        ProblemDetail problem =
                ProblemDetail.forStatusAndDetail(
                        code.status(),
                        code.detail()
                );

        problem.setTitle(
                code.title()
        );

        problem.setType(
                URI.create(
                        code.type()
                )
        );

        problem.setInstance(
                URI.create(
                        "urn:correlation:"
                        + correlationId
                )
        );

        problem.setProperty(
                "code",
                code.code()
        );

        problem.setProperty(
                "correlationId",
                correlationId
        );

        return problem;
    }
}
```

O factory não conhece servlet response.

---

### 3. Criar SecurityProblemWriter

```java
@Component
public class SecurityProblemWriter {

    private final ObjectMapper
            objectMapper;

    private final ApiProblemFactory
            problemFactory;

    private final CorrelationIdResolver
            correlationIdResolver;

    public SecurityProblemWriter(
            ObjectMapper objectMapper,
            ApiProblemFactory problemFactory,
            CorrelationIdResolver
                    correlationIdResolver
    ) {
        this.objectMapper = objectMapper;
        this.problemFactory = problemFactory;
        this.correlationIdResolver =
                correlationIdResolver;
    }

    public void write(
            HttpServletRequest request,
            HttpServletResponse response,
            SecurityProblemCode code
    ) throws IOException {

        if (response.isCommitted()) {
            return;
        }

        String correlationId =
                correlationIdResolver
                        .resolve(request);

        response.setStatus(
                code.status().value()
        );

        response.setContentType(
                MediaType
                        .APPLICATION_PROBLEM_JSON_VALUE
        );

        response.setCharacterEncoding(
                StandardCharsets.UTF_8.name()
        );

        response.setHeader(
                HttpHeaders.CACHE_CONTROL,
                "no-store"
        );

        response.setHeader(
                HttpHeaders.PRAGMA,
                "no-cache"
        );

        response.setHeader(
                "X-Correlation-Id",
                correlationId
        );

        objectMapper.writeValue(
                response.getOutputStream(),
                problemFactory.create(
                        code,
                        correlationId
                )
        );
    }
}
```

O writer não chama `response.reset()`, pois isso apagaria `WWW-Authenticate`.

---

### 4. Atualizar ApiBearerAuthenticationEntryPoint

Mantenha o delegate oficial para o challenge:

```java
private final BearerTokenAuthenticationEntryPoint
        delegate =
        new BearerTokenAuthenticationEntryPoint();
```

No `commence`:

```java
delegate.commence(
        request,
        response,
        exception
);

SecurityProblemCode code =
        isInvalidToken(exception)
                ? SecurityProblemCode
                        .INVALID_TOKEN
                : SecurityProblemCode
                        .AUTHENTICATION_REQUIRED;

problemWriter.write(
        request,
        response,
        code
);
```

Classificação:

```java
private boolean isInvalidToken(
        AuthenticationException exception
) {
    return exception
            instanceof
            OAuth2AuthenticationException oauth
            && "invalid_token".equals(
                    oauth.getError()
                            .getErrorCode()
            );
}
```

O delegate configura o header conforme o protocolo bearer.

O writer preserva o header e cria o body.

---

### 5. Atualizar ApiBearerAccessDeniedHandler

Mantenha:

```java
private final BearerTokenAccessDeniedHandler
        delegate =
        new BearerTokenAccessDeniedHandler();
```

No handler:

```java
delegate.handle(
        request,
        response,
        exception
);

problemWriter.write(
        request,
        response,
        SecurityProblemCode.ACCESS_DENIED
);
```

A response permanece `403`.

O body não informa a permission ausente.

---

### 6. Atualizar login inválido

No `GlobalExceptionHandler`:

```java
@ExceptionHandler(
        InvalidLoginCredentialsException.class
)
ResponseEntity<ProblemDetail>
handleInvalidCredentials(
        InvalidLoginCredentialsException exception,
        HttpServletRequest request
) {
    return securityProblemResponse(
            SecurityProblemCode.INVALID_CREDENTIALS,
            request
    );
}
```

Não use:

- `BadCredentialsException.getMessage()`;
- `UsernameNotFoundException.getMessage()`;
- flags da conta;
- username.

---

### 7. Atualizar refresh inválido

```java
@ExceptionHandler(
        InvalidRefreshTokenException.class
)
ResponseEntity<ProblemDetail>
handleInvalidRefreshToken(
        InvalidRefreshTokenException exception,
        HttpServletRequest request
) {
    return securityProblemResponse(
            SecurityProblemCode
                    .INVALID_REFRESH_TOKEN,
            request
    );
}
```

Token expirado, revogado, rotacionado ou desconhecido recebe o mesmo contrato.

---

### 8. Criar resposta MVC compartilhada

Helper do advice:

```java
private ResponseEntity<ProblemDetail>
securityProblemResponse(
        SecurityProblemCode code,
        HttpServletRequest request
) {
    String correlationId =
            correlationIdResolver
                    .resolve(request);

    return ResponseEntity
            .status(code.status())
            .cacheControl(
                    CacheControl.noStore()
            )
            .header(
                    HttpHeaders.PRAGMA,
                    "no-cache"
            )
            .header(
                    "X-Correlation-Id",
                    correlationId
            )
            .contentType(
                    MediaType
                            .APPLICATION_PROBLEM_JSON
            )
            .body(
                    problemFactory.create(
                            code,
                            correlationId
                    )
            );
}
```

O mesmo factory é usado por filtros e MVC.

---

### 9. Criar ServiceOrderNotFoundException

```java
public final class
        ServiceOrderNotFoundException
        extends RuntimeException {

    public ServiceOrderNotFoundException() {
        super(
                "Service order not found"
        );
    }
}
```

A exception não recebe UUID, owner ou subject.

---

### 10. Criar ServiceOrderAccessGuard

```java
@Component
public class ServiceOrderAccessGuard {

    private final ServiceOrderBusinessAuthorization
            authorization;

    public ServiceOrderAccessGuard(
            ServiceOrderBusinessAuthorization
                    authorization
    ) {
        this.authorization = authorization;
    }

    public void requireRead(
            Authentication authentication,
            UUID serviceOrderId
    ) {
        require(
                authorization.canRead(
                        authentication,
                        serviceOrderId
                )
        );
    }

    public void requireUpdate(
            Authentication authentication,
            UUID serviceOrderId
    ) {
        require(
                authorization.canUpdate(
                        authentication,
                        serviceOrderId
                )
        );
    }

    public void requireStatusTransition(
            Authentication authentication,
            UUID serviceOrderId
    ) {
        require(
                authorization
                        .canTransitionStatus(
                                authentication,
                                serviceOrderId
                        )
        );
    }

    public void requireDelete(
            Authentication authentication,
            UUID serviceOrderId
    ) {
        require(
                authorization.canDelete(
                        authentication,
                        serviceOrderId
                )
        );
    }

    private void require(
            boolean allowed
    ) {
        if (!allowed) {
            throw new ServiceOrderNotFoundException();
        }
    }
}
```

O guard transforma ausência e invisibilidade na mesma exception pública.

---

### 11. Refatorar as annotations

`findById` volta a declarar somente a permission:

```java
@PreAuthorize(
        "hasAuthority('"
        + SERVICE_ORDER_READ
        + "')"
)
@Transactional(readOnly = true)
public ServiceOrderResult findById(
        UUID serviceOrderId
) {
    accessGuard.requireRead(
            currentAuthentication(),
            serviceOrderId
    );

    // consulta e retorno existentes
}
```

A ordem é:

```text
@PreAuthorize:
permission;
falha -> 403.

accessGuard:
existência e relacionamento;
falha -> 404.
```

Aplique o mesmo padrão em:

- `update`;
- `transitionStatus`;
- `delete`.

`create` continua sem guard de objeto.

`search` continua com escopo SQL.

---

### 12. Mapear ServiceOrderNotFoundException

```java
@ExceptionHandler(
        ServiceOrderNotFoundException.class
)
ResponseEntity<ProblemDetail>
handleServiceOrderNotFound(
        ServiceOrderNotFoundException exception,
        HttpServletRequest request
) {
    return securityProblemResponse(
            SecurityProblemCode
                    .SERVICE_ORDER_NOT_FOUND,
            request
    );
}
```

A response não contém o UUID.

---

### 13. Preservar recurso realmente inexistente

Se o repository principal ainda lançar outra exception para OS ausente, unifique-a com:

```text
ServiceOrderNotFoundException.
```

O mesmo código deve ser usado quando:

- guard nega;
- entity desaparece entre guard e uso;
- repository não encontra;
- delete recebe UUID inexistente.

Isso reduz diferenças de contrato.

---

### 14. Configurar erro inesperado

No handler de fallback:

```java
@ExceptionHandler(Exception.class)
ResponseEntity<ProblemDetail>
handleUnexpected(
        Exception exception,
        HttpServletRequest request
) {
    return securityProblemResponse(
            SecurityProblemCode.INTERNAL_ERROR,
            request
    );
}
```

Não faça log duplicado em múltiplas camadas.

A aula 430 definirá o evento estruturado.

O cliente nunca recebe `exception.getMessage()`.

---

### 15. Revisar error properties

Em configuração de produção:

```yaml
server:
  error:
    include-message: never
    include-binding-errors: never
    include-stacktrace: never
    include-exception: false
```

O profile de desenvolvimento pode possuir observabilidade local, mas a response HTTP continua segura.

---

### 16. Criar SecurityErrorContractIntegrationTest

A suíte usa:

- PostgreSQL real;
- login real;
- RSA de teste;
- JWT real;
- dois usuários;
- duas OS;
- correlation ID conhecido.

Ela valida status, headers e body.

---

### 17. Testar bearer ausente

```java
mockMvc.perform(
        get("/api/security/me")
        .header(
            "X-Correlation-Id",
            "corr-missing-token"
        )
)
.andExpect(
        status().isUnauthorized()
)
.andExpect(
        header().string(
                HttpHeaders.WWW_AUTHENTICATE,
                containsString("Bearer")
        )
)
.andExpect(
        jsonPath("$.code")
                .value(
                        "authentication_required"
                )
)
.andExpect(
        jsonPath("$.correlationId")
                .value(
                        "corr-missing-token"
                )
);
```

---

### 18. Testar bearer inválido

Use token adulterado.

Valide:

```text
401;

invalid_token;

WWW-Authenticate contém Bearer;

WWW-Authenticate contém invalid_token;

no-store;

sem detalhe criptográfico.
```

Não valide a mensagem exata da biblioteca.

---

### 19. Testar login uniforme

Execute:

```text
username inexistente;

password incorreta;

conta bloqueada;

conta desabilitada.
```

Todos devem possuir:

- `401`;
- `invalid_credentials`;
- mesmo type;
- mesmo title;
- mesmo detail;
- mesma lista de propriedades;
- ausência de `WWW-Authenticate`;
- `no-store`.

Não use assertion rígida de duração em CI.

---

### 20. Testar refresh uniforme

Execute:

```text
token desconhecido;

token expirado;

token revogado;

token rotacionado;

família revogada.
```

Todos:

```text
401 invalid_refresh_token.
```

A reutilização ainda produz reação interna de revogação, mas não muda o body público.

---

### 21. Testar 403 de permission

Auditor tenta criar:

```text
403 access_denied.
```

Operador tenta excluir sem `service-order:delete`:

```text
403 access_denied.
```

Valide:

- identidade permanece autenticada;
- body não informa permission;
- challenge não sugere login novamente;
- no-store.

---

### 22. Testar 404 de ownership

Operador B solicita a OS de A.

Valide:

```text
404 service_order_not_found.
```

Depois solicite um UUID inexistente com o mesmo operador.

Compare:

```text
status;

type;

title;

detail;

code;

nomes das propriedades;

headers de cache.
```

Somente correlation ID pode diferir.

---

### 23. Testar writes ocultos

Com permission de update, operador B tenta alterar OS de A:

```text
404.
```

Com permission de status, tenta transição:

```text
404.
```

Um usuário owner com permission ausente recebe:

```text
403.
```

Isso comprova a ordem permission antes de ownership.

---

### 24. Testar owner legado

Operador solicita OS com owner nulo:

```text
404.
```

Auditor com read:

```text
200.
```

A response do operador é igual ao UUID inexistente.

---

### 25. Testar 405

Execute:

```http
GET /api/auth/refresh
```

Espere:

```text
405 Method Not Allowed;

Allow presente.
```

Não transforme em `403` ou `404`.

---

### 26. Testar validation sem segredo

Envie login com password vazia.

Valide:

```text
400;

campo identificado;

rejectedValue ausente ou mascarado;

password raw ausente.
```

Repita para refresh token inválido por tamanho.

O token raw não pode aparecer na response.

---

### 27. Testar internal_error

Crie um collaborator de teste que lança uma exception inesperada em um endpoint controlado por profile de teste.

Valide:

```text
500 internal_error;

sem class name;

sem message interna;

sem stack trace;

com correlation ID.
```

Não crie endpoint de diagnóstico em produção.

---

### 28. Testar cache headers

Para todos os erros de segurança:

```text
401;

403;

404 ocultado;

500.
```

Valide:

```http
Cache-Control: no-store
Pragma: no-cache
```

Para `405`, preserve a política HTTP existente e o header `Allow`.

---

### 29. Testar content type e charset

Valide:

```http
Content-Type:
application/problem+json
```

O writer e o MVC handler precisam produzir o mesmo formato.

---

### 30. Criar documento do contrato

Arquivo:

```text
docs/security/M15_SECURITY_ERROR_CONTRACT.md
```

Inclua:

```markdown
# Contrato de erros de seguranca

## Principios

- Semantica HTTP correta.
- Mensagens publicas genericas.
- Correlation ID.
- No-store.
- Nenhum segredo.
- Ocultacao de recursos individuais.

## Matriz

| Cenario | Status | Code | Challenge |
| ... |

## Resource concealment

- Ausente e inacessivel retornam 404 identico.
- Permission geral ausente retorna 403.

## Campos Problem Details

- type
- title
- status
- detail
- instance
- code
- correlationId

## Fora de escopo

- Auditoria estruturada.
- Alertas.
- SIEM.
- Retencao.
```

---

### 31. Atualizar OpenAPI

Documente:

- schemas de Problem Details;
- codes possíveis;
- `WWW-Authenticate`;
- `401`, `403` e `404`;
- regra de ocultação;
- correlation ID;
- no-store.

Não documente causas internas de `invalid_token`.

---

### 32. Atualizar threat model

Adicione:

```text
THR-081:
login revela se usuário existe.

THR-082:
403 revela existência de OS alheia.

THR-083:
token inválido expõe causa criptográfica.

THR-084:
security response fica em cache.

THR-085:
stack trace chega ao cliente.

THR-086:
filtros e controllers usam bodies diferentes.

THR-087:
405 é convertido em 403.

THR-088:
password ou refresh aparece em validation.
```

Controles:

- catálogo;
- factory compartilhada;
- writer;
- concealment;
- no-store;
- correlation ID;
- testes de igualdade;
- `Allow` preservado;
- rejected values seguros.

---

### 33. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
ownership:
implementado.

resource concealment:
implementado.

permission denial:
403 consistente.

testes:
incluem owner e não owner.
```

A07 Authentication Failures:

```text
login uniforme;

token inválido genérico;

refresh uniforme;

rate limiting ainda necessário.
```

A09 Security Logging:

```text
correlation ID presente;

auditoria estruturada:
próxima aula.
```

Baseline:

```text
401:
falha de autenticação.

403:
permission ausente.

404:
recurso ausente ou oculto.

Problem Details:
RFC 9457.

produção pública:
NO-GO.
```

---

### 34. Executar o gate

Teste focado:

```powershell
.\mvnw.cmd `
  -Dtest=SecurityErrorContractIntegrationTest `
  test
```

Suítes anteriores:

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixIntegrationTest,ServiceOrderBusinessAuthorizationIntegrationTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- challenges;
- codes;
- bodies;
- cache headers;
- correlation ID;
- 403 versus 404;
- 405;
- validation;
- refresh;
- nenhum token ou password em reports;
- PostgreSQL real;
- JWT real.

---

## Entendendo o que foi feito

### 401 e 403 ganharam responsabilidades distintas

Autenticação inválida não foi confundida com autorização negada.

### O challenge bearer foi preservado

O cliente sabe qual esquema utilizar sem receber detalhes internos.

### Problem Details unificou camadas

Filtros e controllers entregam o mesmo formato.

### O catálogo fechou o vocabulário

Exceptions internas não definem o contrato público.

### Ownership negado ficou oculto

OS ausente e OS alheia retornam o mesmo `404`.

### Permission ausente continuou explícita

Operações conhecidas sem capacidade retornam `403`.

### Correlation ID substituiu stack trace público

Suporte pode localizar a ocorrência sem expor internals.

### Cache foi desativado

Responses de segurança não devem ser armazenadas.

---

## Erros comuns importantes

### Retornar 403 para token expirado

Token inválido é falha de autenticação e usa `401`.

### Retornar 401 para permission ausente

A identidade já foi autenticada; use `403`.

### Revelar “usuário não existe”

Isso cria enumeração de contas.

### Revelar “recurso pertence a outro usuário”

Isso cria enumeração de objetos.

### Usar exception message como detail

Messages internas não são contrato público.

### Apagar WWW-Authenticate com reset

O client perde o challenge do protocolo.

### Passar erro de filtro somente ao ControllerAdvice

O controller pode nunca ser alcançado.

### Retornar 200 com body de erro

Status HTTP precisa representar o resultado.

### Remapear 405 como 403

O header `Allow` e a semântica do método seriam perdidos.

### Testar apenas o body

Status, challenge, content type e cache também fazem parte do contrato.

---

## Comandos úteis

### Teste do contrato

```powershell
.\mvnw.cmd `
  -Dtest=SecurityErrorContractIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar stack trace público

```powershell
git grep `
  -n `
  -E `
  "include-stacktrace|exception\\.getMessage\\(\\)"
```

### Procurar detalhes sensíveis

```powershell
git grep `
  -n `
  -E `
  "password is wrong|belongs to another|signature does not match"
```

### Procurar responses sem no-store

```powershell
git grep `
  -n `
  "APPLICATION_PROBLEM_JSON"
```

---

## Exercício guiado

### Parte 1 — Taxonomia

Classifique autenticação, autorização, recurso e falha interna.

### Parte 2 — Catálogo

Crie codes, types e mensagens estáveis.

### Parte 3 — Factory

Produza Problem Details com correlation ID.

### Parte 4 — Filtros

Escreva `401` e `403` preservando challenges.

### Parte 5 — MVC

Use o mesmo factory no advice.

### Parte 6 — Ownership

Converta ausência e invisibilidade no mesmo `404`.

### Parte 7 — Uniformidade

Compare login e refresh em vários estados.

### Parte 8 — HTTP

Preserve `405`, validation e headers.

### Parte 9 — Testes

Valide body, status, content type e cache.

### Parte 10 — Documentação

Atualize OpenAPI, threat model e baseline.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 428 foi preservada;
- próxima aula correta é Auditoria de acoes sensiveis;
- `401`, `403` e `404` foram diferenciados;
- bearer ausente usa `authentication_required`;
- bearer inválido usa `invalid_token`;
- login inválido usa `invalid_credentials`;
- refresh inválido usa `invalid_refresh_token`;
- permission ausente usa `access_denied`;
- recurso ausente ou oculto usa `service_order_not_found`;
- `WWW-Authenticate: Bearer` foi preservado;
- invalid token preserva error de challenge;
- login e refresh não anunciam bearer indevidamente;
- RFC 9457 foi adotada;
- type, title, status, detail e instance foram usados;
- code e correlationId foram adicionados;
- URNs estáveis foram criadas;
- exception message não define o contrato;
- `SecurityProblemCode` foi criado;
- `ApiProblemFactory` foi criado;
- `SecurityProblemWriter` foi criado;
- filtros e MVC usam o mesmo factory;
- writer verifica response committed;
- writer não usa reset;
- content type é `application/problem+json`;
- charset foi definido;
- `Cache-Control: no-store` foi aplicado;
- `Pragma: no-cache` foi aplicado;
- correlation ID está no body e header;
- stack trace não aparece;
- class name não aparece;
- SQL e paths internos não aparecem;
- token, password e hash não aparecem;
- erros de login são uniformes;
- username inexistente e password incorreta são indistinguíveis;
- flags de conta não alteram o body público;
- testes não exigem tempo exatamente igual;
- erros de refresh são uniformes;
- reuse continua produzindo reação interna;
- permission ausente retorna `403`;
- body de `403` não informa permission;
- ownership negado retorna `404`;
- UUID inexistente retorna o mesmo `404`;
- owner legado negado retorna o mesmo `404`;
- `ServiceOrderAccessGuard` foi criado;
- permission permanece em `@PreAuthorize`;
- relacionamento é verificado depois da permission;
- owner sem permission recebe `403`;
- permission sem ownership recebe `404`;
- repository missing usa a mesma exception;
- `ServiceOrderNotFoundException` não inclui UUID;
- writes ocultos foram testados;
- 405 e header `Allow` foram preservados;
- validation permaneceu `400`;
- rejected value sensível não aparece;
- erro inesperado retorna `internal_error`;
- erro inesperado possui correlation ID;
- properties de erro foram endurecidas;
- teste usa JWT real;
- teste usa PostgreSQL real;
- bodies de filtro e MVC foram comparados;
- OpenAPI foi atualizado;
- contrato de segurança foi documentado;
- threat model foi atualizado;
- OWASP A01, A07 e A09 foram atualizados;
- auditoria completa não foi antecipada;
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
git grep -n -E "password is wrong|belongs to another|signature does not match"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m15): padronizar erros de autenticacao e autorizacao"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- access token;
- refresh token;
- password;
- hash;
- private key;
- stack trace;
- response com owner;
- permission ausente no detail;
- UUID em exception pública;
- logs de auditoria antecipados;
- testes desabilitados.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a API passou a comunicar falhas de segurança com semântica previsível.

A matriz ficou:

```text
sem autenticação:
401 authentication_required.

token inválido:
401 invalid_token.

login inválido:
401 invalid_credentials.

refresh inválido:
401 invalid_refresh_token.

permission ausente:
403 access_denied.

recurso ausente ou oculto:
404 service_order_not_found.

falha inesperada:
500 internal_error.
```

Os recursos bearer preservam:

```text
WWW-Authenticate.
```

As responses utilizam:

```text
application/problem+json;

type;

title;

status;

detail;

instance;

code;

correlationId;

no-store.
```

A policy de ownership foi refinada:

```text
permission geral:
@PreAuthorize;
falha -> 403.

existência e relacionamento:
ServiceOrderAccessGuard;
falha -> 404.
```

Assim, o cliente não consegue diferenciar:

```text
OS inexistente;

OS pertencente a outro usuário;

OS legada invisível.
```

A decisão central foi:

```text
respostas de segurança precisam
ser corretas para o protocolo,
úteis para o cliente
e pobres em informação para o atacante;

o detalhe interno pertence
à observabilidade protegida,
não ao body HTTP.
```

A API agora possui correlation ID em todas as falhas relevantes.

O próximo passo é usar esse contexto para registrar ações e decisões de segurança sem armazenar credenciais.

A próxima aula será:

```text
430 - M15.20 - Auditoria de acoes sensiveis
```

Nela, você irá:

- definir eventos auditáveis;
- separar audit log de application log;
- registrar actor, action, target e outcome;
- usar correlation ID;
- evitar token, password e hash;
- auditar login, refresh e operações sensíveis;
- modelar retenção e integridade;
- testar eventos de sucesso e falha;
- preparar integração futura com SIEM.

---

# Material complementar

## Checkpoint final

- [ ] Diferenciei `401`, `403` e `404`.
- [ ] Unifiquei Problem Details entre filtros e MVC.
- [ ] Preservei `WWW-Authenticate`.
- [ ] Ocultei recursos alheios com o mesmo `404`.
- [ ] Testei mensagens, headers, cache e correlation ID.

---

## Troubleshooting adicional

### O body do filtro está vazio

Confirme a ordem entre delegate e `SecurityProblemWriter`.

Verifique se a response já estava committed.

### WWW-Authenticate desapareceu

Não use `response.reset()` depois do delegate.

### Token inválido retorna authentication_required

Confirme a classificação de `OAuth2AuthenticationException` e o error code `invalid_token`.

### Permission ausente retorna 404

O guard pode estar executando antes de `@PreAuthorize`.

A permission deve ser avaliada primeiro.

### Não owner retorna 403

O relacionamento ainda pode estar somente na expression.

Use o guard para produzir a exception de recurso.

### UUID inexistente possui body diferente

Unifique as exceptions de repository e guard.

### 405 virou 403

Revise os matchers, routing e exception handlers.

Não capture `HttpRequestMethodNotSupportedException` como security denial.

### Validation mostra a password

Remova rejected value e body bruto do contrato de validation.

---

## Perguntas de revisão

1. Quando usar `401`?
2. Quando usar `403`?
3. Quando esta API usa `404` oculto?
4. Qual header acompanha bearer?
5. Qual code representa token inválido?
6. Qual code representa permission ausente?
7. Login inválido revela usuário existente?
8. Refresh reutilizado muda o body público?
9. Qual RFC define Problem Details atual?
10. Quais campos padrão são usados?
11. Quais extensões foram adicionadas?
12. Para que serve correlation ID?
13. Por que usar no-store?
14. Filtros passam pelo ControllerAdvice?
15. O que faz o SecurityProblemWriter?
16. O guard executa antes ou depois da permission?
17. Não owner recebe qual status?
18. 405 pode ser convertido em 403?
19. Qual é a próxima aula?
20. O que ela adicionará?

---

## Roteiro de resposta

1. Autenticação ausente ou inválida.
2. Identidade autenticada sem autorização.
3. Recurso inexistente ou invisível por ownership.
4. `WWW-Authenticate`.
5. `invalid_token`.
6. `access_denied`.
7. Não.
8. Não.
9. RFC 9457.
10. type, title, status, detail e instance.
11. code e correlationId.
12. Localizar a ocorrência internamente.
13. Evitar cache de respostas sensíveis.
14. Nem sempre.
15. Escreve Problem Details na camada de filtros.
16. Depois.
17. 404.
18. Não.
19. Auditoria de ações sensíveis.
20. Eventos auditáveis estruturados.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 429 - M15.19 - Erros de autenticacao e autorizacao

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei `401`, `403` e `404`.
- Usei `401` para autenticação ausente ou inválida.
- Usei `403` para permission ausente.
- Usei `404` para recurso inexistente ou oculto por ownership.
- Preservei `WWW-Authenticate: Bearer`.
- Diferenciei `authentication_required` e `invalid_token`.
- Mantive login como `invalid_credentials`.
- Mantive refresh como `invalid_refresh_token`.
- Adotei RFC 9457 Problem Details.
- Criei URNs estáveis para os tipos de erro.
- Adicionei `code` e `correlationId`.
- Criei `SecurityProblemCode`.
- Criei `ApiProblemFactory`.
- Criei `SecurityProblemWriter`.
- Unifiquei bodies de filtros e MVC.
- Não usei exception messages no contrato público.
- Apliquei `Cache-Control: no-store`.
- Apliquei `Pragma: no-cache`.
- Impedi stack trace, SQL e internals na response.
- Mantive login uniforme para usuário inexistente, password incorreta e conta bloqueada.
- Mantive refresh uniforme para token desconhecido, expirado, revogado e reutilizado.
- Criei `ServiceOrderAccessGuard`.
- Mantive permission em `@PreAuthorize`.
- Passei ownership e existência para o guard.
- Owner sem permission recebe `403`.
- Permission sem ownership recebe `404`.
- Unifiquei OS ausente e OS invisível.
- Preservei `405` e o header `Allow`.
- Mantive validation em `400` sem valores sensíveis.
- Criei `docs/security/M15_SECURITY_ERROR_CONTRACT.md`.
- Atualizei OpenAPI, threat model, OWASP e baseline.
- Não implementei auditoria completa nesta aula.
- Próxima aula: Auditoria de acoes sensiveis.
```

---

## Referência técnica curta

- [Spring Security — Servlet Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html)
- [Spring Security — Bearer Tokens](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/bearer-tokens.html)
- [Spring Security — BearerTokenAuthenticationEntryPoint](https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/oauth2/server/resource/web/BearerTokenAuthenticationEntryPoint.html)
- [RFC 6750 — Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750.html)
- [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

Regra final:

```text
erros de segurança precisam preservar a semântica do protocolo e reduzir informação útil para atacantes: nesta baseline, autenticação ausente ou inválida usa 401 e challenge adequado, permission ausente usa 403, recurso individual inexistente ou invisível por ownership usa o mesmo 404, filtros e controllers compartilham um catálogo RFC 9457, responses incluem code e correlation ID, não armazenam cache e nunca devolvem stack trace, credencial, token, owner ou causa criptográfica; detalhes internos serão tratados somente pela auditoria protegida da próxima aula.
```
