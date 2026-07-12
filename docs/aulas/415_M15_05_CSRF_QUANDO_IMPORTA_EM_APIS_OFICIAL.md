# 415 - M15.05 - CSRF quando importa em APIs

## Apresentação da aula

Na aula 414, você aprofundou CORS.

A política criada passou a controlar:

```text
origins;

methods;

request headers;

response headers;

preflight;

credentials;

cache.
```

A configuração local permite:

```text
http://localhost:5173
```

e rejeita origins não incluídas na allowlist.

Aquela aula respondeu:

```text
quando um JavaScript
executado em outra origin
pode ler a response da API?
```

Agora surge uma pergunta diferente:

```text
um site malicioso consegue induzir
o navegador de uma vítima autenticada
a executar uma ação indesejada?
```

Esse é o problema central de CSRF.

CSRF significa:

```text
Cross-Site Request Forgery.
```

Em português:

```text
falsificação de request entre sites.
```

Um ataque CSRF explora uma característica legítima do navegador:

```text
determinadas credenciais
são anexadas automaticamente
às requests.
```

Exemplos de credenciais automáticas:

- cookie de sessão;
- cookie contendo JWT;
- HTTP Basic armazenado pelo navegador;
- certificado de cliente;
- outras credenciais ambientais do browser.

O atacante não precisa conhecer a credencial.

Ele precisa fazer o navegador da vítima enviar uma request ao sistema alvo enquanto a credencial é anexada automaticamente.

Exemplo conceitual:

```text
1. Thiago autentica no sistema confiável.

2. O browser recebe um cookie de sessão.

3. Thiago visita uma página maliciosa.

4. Essa página envia uma request
   ao sistema confiável.

5. O browser anexa o cookie.

6. O servidor interpreta a request
   como ação de Thiago.
```

A ameaça depende de três elementos:

```text
credencial automática;

operação com efeito;

ausência de prova de intenção.
```

A API atual ainda não possui autenticação.

Ela também não utiliza cookie de sessão.

Portanto:

```text
o projeto atual
não possui uma identidade de vítima
que possa ser reutilizada
em um CSRF clássico.
```

Isso não significa:

```text
CSRF nunca importará.
```

A partir das próximas aulas, a aplicação poderá receber:

- sessão;
- usuário;
- login;
- logout;
- cookie;
- token.

A decisão precisa ser tomada conforme a arquitetura de autenticação.

Uma API que usa:

```http
Authorization: Bearer <token>
```

e depende de JavaScript para adicionar o header normalmente não sofre o mesmo mecanismo clássico de CSRF, porque o navegador não inventa nem anexa esse header por conta própria.

Por outro lado, se o JWT estiver em:

```text
cookie;
```

o navegador pode anexá-lo automaticamente.

Nesse caso, CSRF volta a importar.

A regra não é:

```text
REST API:
desabilitar CSRF.
```

A regra correta é:

```text
qual credencial autentica a request?

quem a anexa?

ela é enviada automaticamente
em contexto não confiável?
```

O Spring Security protege contra CSRF por default em métodos considerados inseguros.

Mais adiante, quando a filter chain for criada, qualquer decisão de manter, adaptar ou desabilitar essa proteção deverá ser explícita e testada.

Nesta aula, Spring Security ainda não será instalado.

O laboratório criará um cenário isolado:

```text
profile:
csrf-lab.
```

Ele simulará:

- uma sessão autenticada em cookie;
- uma alteração vulnerável;
- uma alteração protegida;
- um synchronizer token;
- uma página legítima;
- uma página atacante.

O laboratório não será uma implementação de produção.

Ele existirá somente para provar o mecanismo.

Arquivos:

```text
docs/security/M15_CSRF_DECISION.md;

CsrfLabSessionStore.java;

CsrfLabController.java;

CsrfLabControllerTest.java;

tools/csrf-lab/attacker.html.
```

A página atacante será executada em:

```text
http://localhost:5174.
```

A aplicação estará em:

```text
http://localhost:8081.
```

As duas URLs possuem origins diferentes porque as portas são diferentes.

Elas continuam no mesmo site para a política SameSite do cookie.

Isso demonstra uma limitação importante:

```text
SameSite não substitui
um token anti-CSRF.
```

O cookie do laboratório será:

```text
HttpOnly;

SameSite=Lax;

Path=/labs/csrf.
```

`HttpOnly` impede que JavaScript leia o cookie.

Ele não impede que o navegador envie o cookie.

A operação vulnerável aceitará apenas:

```text
cookie de sessão.
```

A operação protegida exigirá:

```text
cookie de sessão;

token anti-CSRF correspondente.
```

A página atacante não conseguirá conhecer o token emitido na página legítima.

A próxima aula será:

```text
416 - M15.06 - Security headers
```

Por isso, headers de segurança serão apenas citados quando necessários.

---

## Onde estamos na formação

A sequência atual é:

```text
413:
OWASP Top 10 aplicado.

414:
CORS profundo.

415:
CSRF quando importa em APIs.

416:
Security headers.

417:
Senhas nunca em texto puro.

418:
Spring Security arquitetura geral.
```

A aula 414 respondeu:

```text
qual origin pode acessar
a response pelo navegador?
```

A aula 415 responderá:

```text
quando o navegador pode enviar
uma credencial da vítima
sem que a vítima tenha autorizado
a operação?
```

Nesta aula:

```text
ambient authority:
sim.

cookie:
sim.

sessão:
sim.

SameSite:
sim.

synchronizer token:
sim.

double-submit:
conceito.

Origin e Referer:
defesa complementar.

Fetch Metadata:
conceito.

laboratório vulnerável:
sim.

laboratório protegido:
sim.

Spring Security:
não.

login real:
não.

JWT:
decisão conceitual.

security headers:
não ainda.
```

A regra central será:

```text
CSRF importa
quando a autenticação
é anexada automaticamente
pelo navegador
a uma operação com efeito.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
docs/security/M15_CSRF_DECISION.md
```

O documento registrará:

```text
# Decisao de CSRF

## Contexto
## Arquitetura atual
## Credenciais avaliadas
## Matriz de aplicabilidade
## Controles
## Laboratorio
## Decisao atual
## Decisao futura
## Criterios de revisao
```

O laboratório terá:

```text
GET  /labs/csrf/session

GET  /labs/csrf/state

POST /labs/csrf/insecure/profile

POST /labs/csrf/protected/profile
```

Fluxo:

```text
session:
cria cookie e token;

insecure:
aceita cookie sem token;

protected:
exige cookie e token;

state:
mostra o valor atual.
```

Você irá:

1. definir CSRF;
2. identificar ambient authority;
3. diferenciar CORS e CSRF;
4. identificar métodos seguros;
5. comparar arquiteturas;
6. estudar SameSite;
7. estudar synchronizer token;
8. estudar double-submit cookie;
9. estudar Origin e Referer;
10. estudar Fetch Metadata;
11. criar o profile de laboratório;
12. criar sessão simulada;
13. criar endpoint vulnerável;
14. criar endpoint protegido;
15. criar página atacante;
16. executar a falsificação;
17. comprovar a proteção;
18. criar testes;
19. registrar decisão atual;
20. atualizar documentos de segurança.

---

## Conceito essencial

### Ambient authority

Ambient authority é uma credencial ou autoridade utilizada automaticamente no contexto.

O navegador pode anexar um cookie sem que o código atacante conheça seu valor.

O servidor recebe:

```text
request;

cookie válido.
```

Sem outro sinal, pode assumir incorretamente:

```text
a pessoa desejou essa ação.
```

O token anti-CSRF adiciona uma prova que o site atacante não consegue obter pelas regras normais de isolamento do browser.

---

### Condições para CSRF

Um cenário típico possui:

1. vítima autenticada;
2. credencial automática;
3. endpoint com efeito;
4. request forjável;
5. ausência de token ou verificação equivalente.

Se não existe credencial automática, o modelo muda.

Um endpoint anônimo pode sofrer:

- spam;
- abuso;
- automação;
- DoS;
- criação indevida.

Mas isso não é necessariamente CSRF contra a identidade da vítima.

---

### Métodos seguros

Pela semântica HTTP, métodos seguros não deveriam alterar estado relevante.

Principais:

```text
GET;

HEAD;

OPTIONS.
```

Nunca use GET para:

- excluir;
- transferir;
- confirmar;
- alterar e-mail;
- mudar status;
- executar pagamento;
- fazer logout com efeito sensível.

SameSite=Lax pode permitir cookies em determinadas navegações top-level seguras.

Se GET altera estado, o risco aumenta.

A primeira defesa é:

```text
usar o método correto.
```

---

### CORS e CSRF

CORS responde:

```text
o JavaScript pode ler
a response cross-origin?
```

CSRF responde:

```text
a request forjada
pode executar uma ação
usando credenciais da vítima?
```

Uma response bloqueada ainda pode ter produzido efeito.

Também existem requests que não exigem preflight, como forms tradicionais.

CORS é defesa complementar.

Não é o controle principal contra CSRF.

---

### Content-Type e custom header

Uma API que aceita somente:

```text
application/json
```

e exige um header customizado reduz requests forjáveis por HTML form.

Um JavaScript atacante precisaria de preflight para enviar JSON e headers não safelisted.

Uma política CORS restrita pode bloquear esse caminho.

Porém:

- configuração pode mudar;
- outro endpoint pode aceitar form;
- CORS pode ser liberado incorretamente;
- subdomínio confiável pode ser comprometido;
- credenciais podem ter outro comportamento.

Não substitua uma decisão anti-CSRF robusta por uma coincidência de content type.

---

### Cookie HttpOnly

`HttpOnly` reduz a leitura do cookie por JavaScript.

Ele ajuda contra roubo direto da credencial em determinados cenários de XSS.

Ele não impede CSRF.

O browser continua podendo anexar o cookie à request.

Portanto:

```text
HttpOnly:
confidencialidade do cookie para scripts.

anti-CSRF:
prova de intenção da request.
```

---

### SameSite

SameSite controla quando cookies são enviados conforme a relação entre sites.

Valores:

`Strict`

```text
mais restritivo;

pode afetar navegações legítimas.
```

`Lax`

```text
oferece proteção parcial;

permite alguns contextos de navegação.
```

`None`

```text
permite contexto cross-site;

exige Secure em browsers modernos.
```

SameSite é defesa em profundidade.

Não deve ser o único controle.

Razões:

- compatibilidade;
- regras de navegação;
- mesmo site com origins diferentes;
- subdomínios comprometidos;
- requisitos de integração;
- configurações futuras.

No laboratório:

```text
localhost:5174
e localhost:8081
são cross-origin,
mas same-site.
```

O cookie Lax pode acompanhar a request.

---

### Synchronizer Token Pattern

No synchronizer token pattern:

1. servidor cria sessão;
2. servidor gera token imprevisível;
3. token fica associado à sessão;
4. página legítima recebe o token;
5. request mutável envia o token;
6. servidor compara;
7. token inválido é rejeitado.

O token pode ser enviado por:

- hidden input;
- custom header.

Não envie token em URL.

URLs podem aparecer em:

- history;
- logs;
- Referer;
- analytics;
- screenshots.

O token precisa ser:

- secreto;
- imprevisível;
- associado à sessão;
- validado em operações inseguras.

---

### Double-Submit Cookie

No double-submit cookie pattern:

```text
token em cookie;

mesmo token em header ou parâmetro;

servidor compara os dois.
```

Uma versão ingênua pode sofrer problemas se o atacante conseguir definir cookies relacionados ao domínio.

Uma implementação assinada e vinculada à sessão é preferível.

Nesta aula, o laboratório usará synchronizer token.

O double-submit será implementado somente se a arquitetura futura justificar.

---

### Token por sessão ou por request

Token por sessão:

- simples;
- reduz problemas com abas;
- adequado a muitos sistemas.

Token por request:

- janela de reutilização menor;
- pode quebrar back button e concorrência;
- aumenta complexidade.

Não escolha rotação por request sem requisito.

Spring Security gerencia o ciclo do token.

---

### Origin e Referer

O servidor pode validar:

```http
Origin
```

e, em alguns casos:

```http
Referer.
```

Esses headers ajudam a confirmar a origem da request.

Eles são defesa complementar.

Cuidados:

- Origin pode faltar em alguns cenários;
- Referer depende de política de privacidade;
- proxies podem interferir;
- comparação precisa usar origin completa;
- parsing ingênuo é perigoso.

Não use:

```text
contains("minhaempresa.com").
```

Isso aceitaria domínios maliciosos com nome semelhante.

---

### Fetch Metadata

Browsers modernos podem enviar:

```http
Sec-Fetch-Site;

Sec-Fetch-Mode;

Sec-Fetch-Dest.
```

`Sec-Fetch-Site` pode indicar:

- same-origin;
- same-site;
- cross-site;
- none.

Uma policy pode rejeitar certas requests cross-site mutáveis.

Isso adiciona defesa em profundidade.

Não substitui automaticamente o token, principalmente quando compatibilidade e proxies precisam ser considerados.

---

### Login CSRF

CSRF também pode ocorrer no login.

Cenário:

```text
atacante autentica com a própria conta;

induz vítima a usar essa sessão;

vítima adiciona dados pensando
estar em sua própria conta.
```

Depois, o atacante vê os dados na conta dele.

Por isso, login pode precisar de proteção.

Logout também pode ser sensível.

Spring Security trata operações de login e logout dentro do modelo de proteção.

---

### Matriz de aplicabilidade

`Sessão em cookie`

```text
CSRF:
SIM.
```

`JWT em cookie HttpOnly`

```text
CSRF:
SIM.
```

`HTTP Basic lembrado pelo navegador`

```text
CSRF:
SIM ou deve ser avaliado como credencial automática.
```

`Certificado de cliente`

```text
CSRF:
DEVE SER AVALIADO.
```

`Bearer em Authorization,
adicionado explicitamente pelo JavaScript,
sem cookies de autenticação`

```text
CSRF clássico:
GERALMENTE NÃO.

Risco principal:
XSS e roubo do token.
```

`API key em custom header,
não anexada automaticamente`

```text
CSRF clássico:
GERALMENTE NÃO.
```

`Endpoint anônimo`

```text
sem identidade de vítima;

avaliar abuso,
DoS e lógica de negócio.
```

A palavra “geralmente” é importante.

A arquitetura completa precisa ser verificada.

---

### Spring Security

Quando Spring Security estiver ativo:

```text
proteção CSRF:
habilitada por default
para métodos inseguros.
```

No MockMvc, requests mutáveis protegidas precisarão de token válido.

Exemplo futuro:

```java
mockMvc.perform(
        post("/resource")
                .with(csrf())
);
```

Desabilitar:

```java
csrf.disable()
```

não deve ser uma receita genérica.

Precisa existir um registro como:

```text
autenticação exclusiva por bearer header;

nenhuma credencial automática;

nenhum cookie de autenticação;

testes negativos;

revisão de arquitetura.
```

---

## Mão na massa guiada

### 1. Criar o documento de decisão

Arquivo:

```text
docs/security/M15_CSRF_DECISION.md
```

Cabeçalho:

```markdown
# Decisao de CSRF

## Contexto

A aplicacao ainda nao possui autenticacao real.
A baseline atual nao utiliza cookies de sessao,
HTTP Basic ou JWT em cookie.

## Decisao atual

CSRF classico nao se aplica aos endpoints de negocio
na arquitetura atual porque nao existe identidade autenticada
anexada automaticamente pelo navegador.

A decisao deve ser revista assim que um mecanismo
de autenticacao for adicionado.
```

---

### 2. Criar a matriz

```markdown
| Arquitetura | Credencial automatica | CSRF |
|---|---:|---|
| Sessao em cookie | Sim | Necessario |
| JWT em cookie | Sim | Necessario |
| Basic no browser | Pode ser | Avaliar/proteger |
| Bearer em Authorization | Nao | Geralmente nao |
| API key em header | Nao | Geralmente nao |
| Endpoint anonimo | Nao ha identidade | Avaliar abuso |
```

Adicione:

- risco principal;
- decisão;
- evidência.

---

### 3. Criar o store do laboratório

Arquivo:

```text
CsrfLabSessionStore.java
```

Conteúdo principal:

```java
package br.com.formacao.backend.security.lab;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("csrf-lab")
public class CsrfLabSessionStore {

    private final SecureRandom secureRandom =
            new SecureRandom();

    private final Map<String, LabSession> sessions =
            new ConcurrentHashMap<>();

    public LabSession create() {
        LabSession session =
                new LabSession(
                        randomValue(),
                        randomValue(),
                        new AtomicReference<>(
                                "original@example.test"
                        )
                );

        sessions.put(
                session.id(),
                session
        );

        return session;
    }

    public Optional<LabSession> find(
            String id
    ) {
        return Optional.ofNullable(
                sessions.get(id)
        );
    }

    private String randomValue() {
        byte[] bytes =
                new byte[32];

        secureRandom.nextBytes(bytes);

        return Base64
                .getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    public record LabSession(
            String id,
            String csrfToken,
            AtomicReference<String> email
    ) {
    }
}
```

Esse store é somente didático e em memória.

---

### 4. Criar o controller do laboratório

Arquivo:

```text
CsrfLabController.java
```

Anotações:

```java
@RestController
@RequestMapping("/labs/csrf")
@Profile("csrf-lab")
```

Constante:

```java
private static final String COOKIE_NAME =
        "CSRF_LAB_SESSION";
```

---

### 5. Criar a sessão simulada

```java
@GetMapping(
        value = "/session",
        produces = MediaType.TEXT_HTML_VALUE
)
public ResponseEntity<String> createSession() {
    LabSession session =
            store.create();

    ResponseCookie cookie =
            ResponseCookie
                    .from(
                            COOKIE_NAME,
                            session.id()
                    )
                    .httpOnly(true)
                    .sameSite("Lax")
                    .path("/labs/csrf")
                    .build();

    String html =
            """
            <!doctype html>
            <html lang="pt-BR">
            <body>
              <h1>Vitima do laboratorio CSRF</h1>
              <p>Cookie de sessao criado.</p>

              <form method="post"
                    action="/labs/csrf/protected/profile">
                <label>
                  Novo e-mail:
                  <input name="email"
                         value="legitimo@example.test">
                </label>

                <input type="hidden"
                       name="_csrf"
                       value="%s">

                <button type="submit">
                  Alterar com token
                </button>
              </form>

              <p>
                <a href="/labs/csrf/state">
                  Consultar estado
                </a>
              </p>
            </body>
            </html>
            """
            .formatted(
                    session.csrfToken()
            );

    return ResponseEntity
            .ok()
            .header(
                    HttpHeaders.SET_COOKIE,
                    cookie.toString()
            )
            .body(html);
}
```

A página legítima recebe o token.

O cookie permanece `HttpOnly`.

---

### 6. Criar a operação vulnerável

```java
@PostMapping(
        path = "/insecure/profile",
        consumes =
                MediaType
                .APPLICATION_FORM_URLENCODED_VALUE
)
public ResponseEntity<Void> updateInsecure(

        @CookieValue(
                name = COOKIE_NAME,
                required = false
        )
        String sessionId,

        @RequestParam
        String email
) {
    LabSession session =
            requireSession(
                    sessionId
            );

    session.email().set(
            email
    );

    return ResponseEntity
            .noContent()
            .build();
}
```

Ela confia somente no cookie automático.

---

### 7. Criar a operação protegida

```java
@PostMapping(
        path = "/protected/profile",
        consumes =
                MediaType
                .APPLICATION_FORM_URLENCODED_VALUE
)
public ResponseEntity<Void> updateProtected(

        @CookieValue(
                name = COOKIE_NAME,
                required = false
        )
        String sessionId,

        @RequestParam
        String email,

        @RequestParam(
                name = "_csrf",
                required = false
        )
        String csrfToken
) {
    LabSession session =
            requireSession(
                    sessionId
            );

    if (
        csrfToken == null
        || !MessageDigest.isEqual(
                session
                        .csrfToken()
                        .getBytes(
                                StandardCharsets.UTF_8
                        ),
                csrfToken.getBytes(
                        StandardCharsets.UTF_8
                )
        )
    ) {
        return ResponseEntity
                .status(
                        HttpStatus.FORBIDDEN
                )
                .build();
    }

    session.email().set(
            email
    );

    return ResponseEntity
            .noContent()
            .build();
}
```

A comparação constante é usada como boa prática.

O laboratório continua não sendo uma implementação reutilizável.

---

### 8. Criar state e requireSession

```java
@GetMapping("/state")
public Map<String, String> state(

        @CookieValue(
                name = COOKIE_NAME,
                required = false
        )
        String sessionId
) {
    LabSession session =
            requireSession(
                    sessionId
            );

    return Map.of(
            "email",
            session.email().get()
    );
}

private LabSession requireSession(
        String sessionId
) {
    return store
            .find(sessionId)
            .orElseThrow(
                    () ->
                            new ResponseStatusException(
                                    HttpStatus.UNAUTHORIZED
                            )
            );
}
```

O objetivo é didático.

---

### 9. Criar o profile

Em:

```text
application-csrf-lab.yaml
```

Adicione:

```yaml
spring:
  config:
    activate:
      on-profile: csrf-lab

app:
  web:
    cors:
      enabled: false
```

O laboratório não depende de CORS.

Ele demonstra um form tradicional.

Nunca ative esse profile em produção.

---

### 10. Criar a página atacante

Arquivo:

```text
tools/csrf-lab/attacker.html
```

Conteúdo:

```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Página atacante simulada</title>
</head>
<body>
  <h1>Origem atacante simulada</h1>

  <form id="insecure"
        action="http://localhost:8081/labs/csrf/insecure/profile"
        method="post"
        target="result">
    <input type="hidden"
           name="email"
           value="atacante@example.test">
  </form>

  <form id="protected"
        action="http://localhost:8081/labs/csrf/protected/profile"
        method="post"
        target="result">
    <input type="hidden"
           name="email"
           value="atacante@example.test">
  </form>

  <button onclick="insecure.submit()">
    Atacar endpoint vulnerável
  </button>

  <button onclick="protected.submit()">
    Atacar endpoint protegido
  </button>

  <iframe name="result"></iframe>
</body>
</html>
```

A página não possui `_csrf`.

---

### 11. Criar os testes

Use:

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("csrf-lab")
class CsrfLabControllerTest {
}
```

Cenários:

```text
session cria cookie;

cookie possui HttpOnly;

cookie possui SameSite=Lax;

insecure aceita cookie sem token;

protected rejeita ausência de token;

protected aceita token correto;

token de outra sessão é rejeitado.
```

---

### 12. Testar operação vulnerável

Fluxo do teste:

1. criar sessão;
2. extrair cookie;
3. enviar POST form sem token;
4. esperar 204;
5. consultar state;
6. confirmar alteração.

Isso comprova:

```text
cookie foi suficiente.
```

---

### 13. Testar operação protegida

Sem token:

```text
403.
```

Com token correto:

```text
204.
```

Com token de outra sessão:

```text
403.
```

Não compare token em logs.

---

### 14. Executar a suíte

```powershell
.\mvnw.cmd `
  -Dtest=CsrfLabControllerTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

O profile de laboratório precisa ser ativado somente pelos testes e execução manual.

---

### 15. Subir o laboratório

Ative profiles:

```text
local,csrf-lab.
```

No ambiente local, use a forma já adotada pelo projeto para `SPRING_PROFILES_ACTIVE`.

Suba:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  up `
  --build `
  --detach
```

Confirme nos logs que o profile foi ativado conscientemente.

---

### 16. Criar sessão no browser

Abra:

```text
http://localhost:8081/labs/csrf/session
```

No DevTools:

```text
Application;

Cookies.
```

Confirme:

- nome;
- Path;
- HttpOnly;
- SameSite=Lax.

Não copie o valor para documentação.

---

### 17. Servir a página atacante

```powershell
npx --yes http-server `
  "tools/csrf-lab" `
  -p 5174 `
  -c-1
```

Abra:

```text
http://localhost:5174/attacker.html
```

A origin é diferente da API.

O site permanece o mesmo no laboratório.

---

### 18. Atacar o endpoint vulnerável

Clique:

```text
Atacar endpoint vulnerável.
```

Depois abra:

```text
http://localhost:8081/labs/csrf/state
```

Resultado:

```text
email:
atacante@example.test.
```

A página atacante não leu a response.

Mesmo assim, a ação aconteceu.

Essa é a evidência prática principal.

---

### 19. Atacar o endpoint protegido

Primeiro use a página legítima para restaurar:

```text
legitimo@example.test.
```

Na página atacante, clique:

```text
Atacar endpoint protegido.
```

Consulte state.

Resultado esperado:

```text
email continua legítimo.
```

A request sem token retorna 403.

---

### 20. Registrar a decisão futura

No documento:

```markdown
## Decisao futura

### Se a autenticacao usar sessao ou cookie

- manter protecao CSRF;
- usar mecanismo do Spring Security;
- exigir token em metodos inseguros;
- configurar SameSite como defesa em profundidade;
- testar token ausente e invalido;
- proteger login e logout;
- manter CORS com allowlist.

### Se a autenticacao usar Bearer em Authorization

A protecao CSRF podera ser desabilitada somente se:

- nenhum cookie autenticar a API;
- o browser nao anexar a credencial automaticamente;
- a decisao estiver documentada;
- testes confirmarem ausencia de auth cookie;
- XSS e armazenamento do token forem tratados.
```

---

### 21. Atualizar documentos de segurança

Baseline:

```text
CSRF:
não aplicável atualmente aos endpoints de negócio;
decisão pendente do mecanismo de autenticação.
```

Threat model:

```text
adicionar ameaça condicional
de credencial automática.
```

OWASP review:

```text
A01, A06 e A07.
```

CORS review:

```text
CORS é defesa complementar,
não substituto do token.
```

---

### 22. Remover o estado do laboratório

Encerre o servidor estático:

```text
Ctrl + C.
```

Derrube a stack:

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

O store em memória é descartado.

Não preserve dados do laboratório.

---

## Entendendo o que foi feito

### A aplicabilidade foi decidida por arquitetura

A palavra API não determinou a resposta.

### Ambient authority foi comprovada

O cookie foi anexado sem o atacante conhecer o valor.

### CORS não impediu o efeito

A página atacante não precisou ler a response.

### HttpOnly permaneceu no papel correto

Ele protege leitura, não envio.

### SameSite mostrou limites

Cross-origin same-site continuou relevante.

### O synchronizer token provou intenção

A operação protegida exigiu um valor fora do alcance da página atacante.

### O laboratório ficou isolado

Nenhum endpoint vulnerável foi ativado por default.

### A decisão futura ficou documentada

Sessão, cookie e bearer receberam tratamentos diferentes.

---

## Erros comuns importantes

### Desabilitar CSRF porque a aplicação é REST

O transporte da credencial é o que importa.

### Usar CORS como única defesa

Bloqueio de leitura não garante ausência de efeito.

### Acreditar que HttpOnly impede CSRF

O browser ainda envia o cookie.

### Confiar somente em SameSite

Ele é defesa em profundidade.

### Alterar estado por GET

Métodos seguros não devem possuir efeitos sensíveis.

### Colocar token na URL

Ele pode vazar por logs e Referer.

### Criar token previsível

Use gerador criptograficamente seguro.

### Aceitar qualquer Origin por substring

Compare origins completas.

### Desabilitar proteção sem documento

A decisão precisa de arquitetura e testes.

### Copiar o laboratório para produção

O código customizado existe somente para ensino.

---

## Comandos úteis

### Teste focado

```powershell
.\mvnw.cmd `
  -Dtest=CsrfLabControllerTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Servir atacante

```powershell
npx --yes http-server `
  "tools/csrf-lab" `
  -p 5174 `
  -c-1
```

### Ver profiles

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  logs api |
  Select-String "profile"
```

### Encerrar

```powershell
docker compose `
  --env-file ".docker/compose.local.env" `
  down
```

---

## Exercício guiado

### Parte 1 — Aplicabilidade

Classifique sessão, cookie JWT, bearer e API key.

### Parte 2 — Browser

Explique ambient authority.

### Parte 3 — Métodos

Confirme que GET não altera estado.

### Parte 4 — Cookies

Diferencie HttpOnly, Secure e SameSite.

### Parte 5 — Tokens

Compare synchronizer e double-submit.

### Parte 6 — Laboratório

Crie sessão e endpoint vulnerável.

### Parte 7 — Ataque

Execute o form sem ler a response.

### Parte 8 — Proteção

Exija token associado à sessão.

### Parte 9 — Testes

Valide cookie, ausência, token correto e token incorreto.

### Parte 10 — Decisão

Documente sessão versus bearer.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 414 foi preservada;
- CSRF foi definido;
- ambient authority foi explicada;
- condições de CSRF foram listadas;
- endpoint anônimo foi diferenciado;
- métodos seguros foram explicados;
- GET mutável foi rejeitado;
- CORS foi diferenciado de CSRF;
- response bloqueada e efeito executado foram diferenciados;
- content type foi tratado como controle parcial;
- custom header foi tratado como controle parcial;
- HttpOnly foi explicado;
- HttpOnly não foi chamado de anti-CSRF;
- SameSite Strict foi explicado;
- SameSite Lax foi explicado;
- SameSite None foi explicado;
- SameSite foi tratado como defesa em profundidade;
- same-site e cross-origin foram diferenciados;
- synchronizer token foi explicado;
- token foi associado à sessão;
- token em URL foi rejeitado;
- double-submit foi explicado;
- versão ingênua foi criticada;
- token por sessão foi explicado;
- token por request foi explicado;
- Origin foi tratado como defesa complementar;
- Referer foi tratado como defesa complementar;
- comparação por substring foi rejeitada;
- Fetch Metadata foi introduzido;
- login CSRF foi explicado;
- logout foi considerado;
- sessão em cookie exige proteção;
- JWT em cookie exige proteção;
- Basic no browser foi avaliado;
- bearer header foi avaliado;
- API key em header foi avaliada;
- decisão usou “geralmente” em vez de regra absoluta;
- Spring Security default foi registrado;
- desabilitar CSRF não foi receita genérica;
- documento de decisão foi criado;
- matriz de aplicabilidade foi criada;
- profile csrf-lab foi criado;
- profile não fica ativo por default;
- store usa SecureRandom;
- token possui 32 bytes;
- Base64 URL-safe foi usado;
- store é em memória;
- cookie de laboratório foi criado;
- cookie é HttpOnly;
- cookie usa SameSite=Lax;
- cookie possui Path restrito;
- endpoint de sessão foi criado;
- página legítima recebeu token;
- endpoint vulnerável foi criado;
- endpoint protegido foi criado;
- comparação de token foi feita;
- token inválido retorna 403;
- session inválida retorna 401;
- state foi criado;
- página atacante foi criada;
- form usa urlencoded;
- página atacante não possui token;
- laboratório fica fora de `/api/**`;
- CORS não foi usado como proteção principal;
- teste de cookie foi criado;
- teste vulnerável foi criado;
- teste protegido sem token foi criado;
- teste com token correto foi criado;
- token de outra sessão foi rejeitado;
- gate completo foi executado;
- sessão foi criada no browser;
- cookie foi inspecionado sem copiar valor;
- atacante foi servido na porta 5174;
- operação vulnerável foi alterada;
- página atacante não leu response;
- operação protegida permaneceu inalterada;
- decisão futura de sessão foi registrada;
- decisão futura de bearer foi registrada;
- ausência de auth cookie virou critério;
- XSS foi reconhecido no modelo bearer;
- baseline foi atualizada;
- threat model foi atualizado;
- OWASP review foi atualizado;
- CORS review foi atualizado;
- laboratório foi encerrado;
- estado em memória foi descartado;
- Spring Security não foi instalado;
- sessão real não foi implementada;
- JWT não foi implementado;
- security headers não foram antecipados;
- código do laboratório não foi tratado como produção;
- commit recomendado está pronto;
- ponte para a aula 416 está correta.

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
git commit -m "test(m15): demonstrar quando CSRF importa em APIs"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- cookies;
- session IDs;
- CSRF tokens;
- credentials;
- env files;
- dados reais;
- logs locais;
- node_modules;
- respostas do laboratório;
- profile csrf-lab ativo por default.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você decidiu CSRF pelo mecanismo de autenticação.

A análise passou por:

```text
ambient authority;

cookies;

sessões;

SameSite;

tokens;

Origin;

Fetch Metadata;

CORS;

métodos HTTP.
```

O laboratório demonstrou:

```text
cookie automático
mais operação mutável
sem token
permite falsificação;

cookie automático
mais token associado à sessão
rejeita a falsificação.
```

A decisão atual da aplicação é:

```text
sem autenticação real;

sem cookie de autenticação;

CSRF clássico
não aplicável ainda
aos endpoints de negócio.
```

A decisão futura é:

```text
sessão ou JWT em cookie:
proteger CSRF.

bearer exclusivo em header:
avaliar e documentar
possível desativação.
```

A decisão central foi:

```text
CSRF não depende
de a API ser REST;

depende de o navegador
anexar automaticamente
a autoridade da vítima.
```

A próxima aula será:

```text
416 - M15.06 - Security headers
```

Nela, você estudará e aplicará:

- `Content-Security-Policy`;
- `X-Content-Type-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- proteção contra framing;
- HSTS;
- cache de dados sensíveis;
- defaults do Spring Security;
- testes de headers.

CORS e CSRF permanecerão documentados como controles distintos.

---

# Material complementar

## Checkpoint final

- [ ] Decidi CSRF pela credencial.
- [ ] Diferenciei CORS, SameSite e token.
- [ ] Executei o laboratório vulnerável.
- [ ] Comprovei a proteção por token.
- [ ] Registrei decisões para sessão e bearer.

---

## Troubleshooting adicional

### Cookie não aparece

Confirme:

- profile `csrf-lab`;
- path `/labs/csrf`;
- acesso pelo browser;
- header `Set-Cookie`.

### Cookie não acompanha o form

Use `localhost` nos dois lados do laboratório.

Não misture `localhost` e `127.0.0.1`.

### Endpoint vulnerável retorna 401

A sessão pode ter sido perdida após restart.

Crie uma nova em `/labs/csrf/session`.

### Endpoint protegido altera sem token

Confirme:

- request param `_csrf`;
- comparação;
- endpoint correto;
- testes negativos.

### SameSite bloqueia o laboratório

Confirme que as duas origins continuam no mesmo site e scheme.

A porta pode mudar sem mudar o site.

### Teste vaza token no output

Não imprima body ou token.

Use assertions sem logar o valor.

### CORS bloqueia o endpoint de laboratório

O mapping CORS deve continuar limitado a `/api/**`.

O lab fica em `/labs/**`.

### O profile aparece no Compose normal

Remova-o do env local default.

Ative somente durante a prática.

---

## Perguntas de revisão

1. O que é CSRF?
2. O que é ambient authority?
3. Quais três condições tornam CSRF relevante?
4. CORS impede todo CSRF?
5. HttpOnly impede CSRF?
6. SameSite substitui token?
7. GET deve alterar estado?
8. O que é synchronizer token?
9. O que é double-submit?
10. Token deve ir na URL?
11. Origin pode ajudar?
12. O que Sec-Fetch-Site informa?
13. Sessão em cookie exige proteção?
14. JWT em cookie exige proteção?
15. Bearer em Authorization exige sempre?
16. Endpoint anônimo sofre CSRF clássico?
17. Qual status representa token inválido?
18. Spring Security protege por default?
19. O laboratório é código de produção?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Request forjada usando autoridade da vítima.
2. Credencial anexada automaticamente.
3. Credencial automática, efeito e ausência de prova.
4. Não.
5. Não.
6. Não.
7. Não.
8. Token secreto associado à sessão.
9. Token em cookie e request comparados.
10. Não.
11. Sim, como defesa complementar.
12. Relação entre site iniciador e alvo.
13. Sim.
14. Sim.
15. Não; depende da arquitetura.
16. Sem identidade da vítima, geralmente não.
17. 403.
18. Sim, para métodos inseguros.
19. Não.
20. Security headers.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 415 - M15.05 - CSRF quando importa em APIs

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Defini CSRF como falsificação usando autoridade da vítima.
- Estudei ambient authority do navegador.
- Identifiquei credenciais anexadas automaticamente.
- Diferenciei endpoint anônimo de CSRF clássico.
- Reforcei que GET não deve alterar estado.
- Diferenciei CORS de CSRF.
- Entendi que bloquear leitura não impede todo efeito.
- Tratei JSON e custom headers como controles parciais.
- Confirmei que HttpOnly não impede CSRF.
- Estudei SameSite Strict, Lax e None.
- Mantive SameSite como defesa em profundidade.
- Estudei synchronizer token.
- Estudei double-submit cookie.
- Rejeitei token em URL.
- Diferenciei token por sessão e por request.
- Estudei validação de Origin e Referer.
- Introduzi Fetch Metadata.
- Estudei login CSRF e logout.
- Criei uma matriz para sessão, JWT cookie, bearer e API key.
- Registrei que Spring Security protege CSRF por default.
- Criei `docs/security/M15_CSRF_DECISION.md`.
- Criei o profile isolado `csrf-lab`.
- Criei sessão simulada com cookie HttpOnly e SameSite=Lax.
- Gereei session ID e token com SecureRandom.
- Criei endpoint vulnerável sem token.
- Criei endpoint protegido com synchronizer token.
- Criei state para observar o efeito.
- Criei uma página atacante por form tradicional.
- Testei cookie, token ausente, correto e de outra sessão.
- Executei o ataque contra o endpoint vulnerável.
- Confirmei que a ação ocorreu sem leitura da response.
- Confirmei que o endpoint protegido retornou 403.
- Registrei decisão futura para sessão e bearer.
- Atualizei baseline, threat model, OWASP e CORS.
- Não instalei Spring Security.
- Não tratei o laboratório como código de produção.
- Próxima aula: Security headers.
```

---

## Referência técnica curta

- [Spring Security — CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
- [Spring Security — Testing with CSRF](https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/csrf.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [MDN — Cross-site request forgery](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF)
- [MDN — Secure cookie configuration](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Cookies)

Regra final:

```text
a decisão de CSRF precisa observar como a credencial chega à request, e não apenas se o sistema é chamado de API REST; nesta baseline, credenciais automáticas como sessão ou JWT em cookie exigem proteção, SameSite, CORS, Origin e Fetch Metadata funcionam como defesa em profundidade, o synchronizer token prova intenção em operações mutáveis e bearer exclusivo em Authorization pode permitir uma decisão diferente somente quando não existe cookie de autenticação e essa arquitetura está documentada e testada.
```
