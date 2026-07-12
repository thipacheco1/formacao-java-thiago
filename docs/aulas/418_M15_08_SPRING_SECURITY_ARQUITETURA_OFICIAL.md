# 418 - M15.08 - Spring Security arquitetura

## Apresentação da aula

Na aula 417, você decidiu como as senhas serão armazenadas no futuro.

A baseline ficou:

```text
novo sistema:
Argon2id.

compatibilidade legada:
BCrypt.

texto puro:
proibido.

criptografia reversível:
proibida.

hash rápido:
proibido.
```

Você também diferenciou:

- salt;
- pepper;
- work factor;
- ataque online;
- ataque offline;
- verificação;
- rehash;
- migração de algoritmo.

Aquela aula respondeu:

```text
como armazenar um verificador de senha
sem guardar a senha original?
```

Agora o módulo chega ao framework que coordenará a segurança da aplicação:

```text
Spring Security.
```

A pergunta central desta aula será:

```text
o que acontece entre a chegada
de uma request HTTP
e a decisão de permitir,
autenticar,
negar
ou iniciar um mecanismo de login?
```

A resposta não começa por annotations.

Ela começa pela arquitetura.

Spring Security fornece suporte para:

- autenticação;
- autorização;
- proteção contra ataques comuns;
- gerenciamento de contexto;
- integração com sessão;
- password authentication;
- bearer tokens;
- OAuth2;
- OpenID Connect;
- method security;
- testes;
- headers;
- CSRF;
- CORS.

Essas capacidades são construídas por componentes encadeados:

```text
DelegatingFilterProxy;

FilterChainProxy;

SecurityFilterChain;

SecurityContextHolder;

SecurityContext;

Authentication;

GrantedAuthority;

AuthenticationManager;

ProviderManager;

AuthenticationProvider;

UserDetailsService;

PasswordEncoder;

AuthenticationEntryPoint;

AccessDeniedHandler;

ExceptionTranslationFilter;

RequestCache;

AnonymousAuthenticationFilter;

AuthorizationFilter.
```

Apesar das variações, o fluxo básico pode ser resumido:

```text
request;

filter chain;

extração de credencial;

criação de Authentication não autenticada;

AuthenticationManager;

AuthenticationProvider;

Authentication autenticada;

SecurityContext;

autorização;

controller;

limpeza do contexto.
```

Nesta aula, a aplicação ainda não será protegida.

Não será criado:

```text
SecurityFilterChain bean;

form login;

HTTP Basic;

usuário em memória;

usuário no banco;

JWT;

sessão real;

regra de autorização.
```

Esses passos começam na aula 419.

A prática de hoje ficará em:

```text
test scope.
```

Ela utilizará tipos reais do Spring Security para demonstrar:

- token antes da autenticação;
- delegação por provider;
- token após a autenticação;
- authorities;
- contexto;
- limpeza;
- provider incompatível;
- anonymous authentication.

A application runtime continuará exatamente como estava.

Dependências de teste:

```text
spring-security-core;

spring-security-web.
```

Arquivo prático:

```text
SpringSecurityArchitectureLabTest.java
```

Documento:

```text
docs/security/M15_SPRING_SECURITY_ARCHITECTURE.md
```

A próxima aula será:

```text
419 - M15.09 - SecurityFilterChain
```

Nela, a dependency de runtime será adicionada e a aplicação passará a ter uma filter chain explícita.

Por isso, esta aula não deve atropelar a configuração.

---

## Onde estamos na formação

A sequência atual é:

```text
416:
Security headers.

417:
Hash de senha BCrypt Argon2 conceitual.

418:
Spring Security arquitetura.

419:
SecurityFilterChain.

420:
Login basico usuario em memoria.

421:
Usuario no banco UserDetailsService.
```

A aula 417 respondeu:

```text
como verificar uma senha
sem armazená-la de forma recuperável?
```

A aula 418 responderá:

```text
quais componentes
participam da autenticação
e da autorização
dentro do Spring Security?
```

Nesta aula:

```text
arquitetura Servlet:
sim.

filter chain:
conceito.

SecurityContext:
sim.

Authentication:
sim.

ProviderManager:
sim.

AuthenticationProvider:
sim.

UserDetailsService:
conceito.

PasswordEncoder:
integração conceitual.

anonymous:
sim.

exceptions:
sim.

request cache:
sim.

SecurityFilterChain bean:
não.

login real:
não.

autorização real:
não.
```

A regra central será:

```text
antes de configurar segurança,
é necessário saber
qual componente cria identidade,
qual valida credenciais,
qual guarda o resultado
e qual decide acesso.
```

---

## Objetivo prático

Ao final da aula, você terá:

```text
docs/security/M15_SPRING_SECURITY_ARCHITECTURE.md
```

Estrutura:

```text
# Arquitetura Spring Security

## Visao geral
## Camada Servlet
## DelegatingFilterProxy
## FilterChainProxy
## SecurityFilterChain
## SecurityContext
## Authentication
## AuthenticationManager
## AuthenticationProvider
## Password authentication
## Anonymous
## Exception translation
## Request cache
## Authorization
## Persistencia do contexto
## Async
## Fluxos
## Decisoes para a API
```

Teste:

```text
src/test/java/br/com/formacao/backend
└── security
    └── architecture
        └── SpringSecurityArchitectureLabTest.java
```

Você irá:

1. compreender a camada Servlet;
2. entender o proxy do container;
3. entender `FilterChainProxy`;
4. entender múltiplas chains;
5. entender matching e ordem;
6. entender `SecurityContextHolder`;
7. entender `Authentication`;
8. entender principal, credentials e authorities;
9. entender `AuthenticationManager`;
10. entender `ProviderManager`;
11. entender `AuthenticationProvider`;
12. conectar `UserDetailsService`;
13. conectar `PasswordEncoder`;
14. diferenciar 401 e 403;
15. entender anonymous;
16. entender request cache;
17. entender persistência do contexto;
18. executar laboratório;
19. documentar decisões;
20. preparar a aula 419.

---

## Conceito essencial

### A base é a Servlet Filter Chain

Aplicações Spring MVC executam sobre a API Servlet.

Antes de um controller receber a request, filtros podem:

- ler headers;
- alterar request;
- alterar response;
- interromper o fluxo;
- chamar o próximo filtro;
- executar lógica depois da chain.

Representação:

```text
HTTP request
    |
Servlet container
    |
Filter 1
    |
Filter 2
    |
DispatcherServlet
    |
Controller
```

Spring Security utiliza essa infraestrutura.

A segurança ocorre antes do controller, inclusive em endpoints que não conhecem o framework diretamente.

---

### DelegatingFilterProxy

O Servlet container conhece filtros Servlet.

O Spring conhece beans.

`DelegatingFilterProxy` conecta esses dois mundos.

Ele é registrado no container, mas delega o trabalho a um bean Spring.

A ideia é:

```text
container chama proxy;

proxy encontra bean;

bean executa segurança.
```

O proxy liga o ciclo de vida Servlet ao contexto Spring; no Spring Boot, grande parte do registro é auto-configurada.

---

### FilterChainProxy

O bean central do suporte web é:

```text
FilterChainProxy.
```

Ele mantém uma lista de:

```text
SecurityFilterChain.
```

Quando uma request chega, o `FilterChainProxy` procura a primeira chain cujo matcher corresponde à request.

Depois executa os filtros de segurança daquela chain.

Fluxo:

```text
DelegatingFilterProxy
        |
FilterChainProxy
        |
SecurityFilterChain correspondente
        |
filtros de segurança
        |
aplicação
```

O `FilterChainProxy` também centraliza lifecycle do contexto e firewall HTTP.

---

### SecurityFilterChain

Uma `SecurityFilterChain` possui:

```text
RequestMatcher;

lista ordenada de filtros.
```

Conceitualmente:

```java
boolean matches(
        HttpServletRequest request
);

List<Filter> getFilters();
```

A chain pode ser específica.

Exemplos futuros:

```text
/api/**:
bearer token;

swagger:
acesso local;

actuator:
regra operacional;

web:
sessão e form login.
```

A primeira chain correspondente vence; por isso, a ordem é crítica.

Erro comum:

```text
chain genérica primeiro;

chain específica nunca executa.
```

A aula 419 começará com uma única chain para reduzir complexidade.

---

### Ordem dos filtros

Filtros de segurança possuem responsabilidades distintas.

Uma ordem conceitual comum é:

```text
carregar contexto;

proteções contra exploits;

autenticação;

anonymous;

tratamento de exceptions;

autorização.
```

A ordem exata varia. O ponto importante é:

```text
um filtro de autorização
precisa receber o contexto
depois que mecanismos de autenticação
tiveram oportunidade de atuar.
```

Não use números de posição memorizados como regra principal.

Use os métodos oficiais:

```text
addFilterBefore;

addFilterAfter;

addFilterAt.
```

E somente quando um filtro customizado for realmente necessário.

---

### HttpFirewall

Antes do matching, o Spring Security pode normalizar ou rejeitar requests suspeitas.

Exemplos:

- paths ambíguos;
- caracteres inválidos;
- padrões perigosos;
- métodos não permitidos.

O firewall não substitui WAF, validation ou authorization. Ele reduz ambiguidades usadas pelas regras; prefira corrigir o contrato a relaxá-lo para aceitar URLs malformadas.

---

### SecurityContextHolder

`SecurityContextHolder` é o ponto usado pelo Spring Security para acessar o contexto da identidade atual.

O contexto contém:

```text
Authentication.
```

Uso conceitual:

```java
Authentication authentication =
        SecurityContextHolder
                .getContext()
                .getAuthentication();
```

Na estratégia padrão para aplicações Servlet, o contexto é associado à thread atual.

Isso permite acessar a identidade durante a request.

A consequência é crítica:

```text
o contexto precisa ser limpo
ao final do processamento.
```

Threads de servidores são reutilizadas.

Se o contexto antigo permanecesse, outra request poderia enxergar a identidade errada.

O filtro da infraestrutura gerencia essa limpeza.

---

### SecurityContext

`SecurityContext` é um container para o `Authentication`.

Ele pode estar:

- vazio;
- com anonymous;
- com usuário autenticado;
- com token bearer;
- com autenticação customizada.

Criar um contexto vazio:

```java
SecurityContext context =
        SecurityContextHolder
                .createEmptyContext();
```

É preferível a alterar um contexto compartilhado de maneira insegura.

Depois:

```java
context.setAuthentication(
        authentication
);

SecurityContextHolder.setContext(
        context
);
```

No final:

```java
SecurityContextHolder.clearContext();
```

Na aplicação real, os filtros realizam esse ciclo.

---

### Authentication

`Authentication` representa duas coisas em momentos diferentes.

Antes da autenticação:

```text
pedido de autenticação.
```

Depois da autenticação:

```text
resultado autenticado.
```

Campos principais:

`principal`

```text
quem é a identidade.
```

`credentials`

```text
prova apresentada,
como senha ou token.
```

`authorities`

```text
permissões atribuídas.
```

`details`

```text
detalhes adicionais da request.
```

`authenticated`

```text
estado do token.
```

Um token não autenticado pode conter username e password; o resultado pode conter `UserDetails`, credentials removidas e authorities.

---

### Principal

O principal pode ser:

- string;
- `UserDetails`;
- subject de JWT;
- certificado;
- objeto de domínio adaptado;
- identidade externa.

Não assuma que sempre será um username string.

Evite espalhar casts pelo sistema.

Crie uma abstração clara quando a aplicação possuir identidade própria.

---

### Credentials

Credentials são materiais usados para autenticar.

Exemplos:

- password;
- bearer token;
- API key;
- certificado.

Depois da autenticação, credenciais sensíveis devem ser removidas quando possível.

`ProviderManager` pode apagar credentials de objetos que implementam o contrato apropriado.

A senha não deve permanecer no `SecurityContext`.

Ela também não deve aparecer em:

- logs;
- eventos;
- DTOs;
- exception messages;
- metrics;
- traces.

---

### GrantedAuthority

`GrantedAuthority` representa uma autoridade concedida.

Exemplos:

```text
ROLE_ADMIN;

ROLE_OPERATOR;

service-order:read;

service-order:update.
```

Role e authority são relacionadas, mas não idênticas.

Por convenção, verificações de role usam prefixo:

```text
ROLE_.
```

Uma autorização pode ser:

- ampla por role;
- fina por permission;
- contextual por recurso;
- combinada.

A API OS precisará de autorização por objeto, não apenas role.

Esse aprofundamento virá nas aulas de autorização.

---

### AuthenticationManager

`AuthenticationManager` recebe um `Authentication` e tenta autenticá-lo.

Contrato conceitual:

```java
Authentication authenticate(
        Authentication authentication
);
```

Resultados:

- retorna `Authentication` autenticada;
- lança `AuthenticationException`;
- em alguns designs delegados, um provider pode retornar `null` para indicar que não suporta aquele token.

O filtro de autenticação não precisa conhecer detalhes de banco, senha ou OAuth.

Ele entrega o token ao manager.

---

### ProviderManager

A implementação comum de `AuthenticationManager` é:

```text
ProviderManager.
```

Ele possui uma lista de:

```text
AuthenticationProvider.
```

Fluxo:

```text
token chega;

provider suporta o tipo?

se não:
próximo provider;

se sim:
tenta autenticar;

sucesso:
retorna Authentication;

falha:
lança exception.
```

Isso permite combinar mecanismos.

Exemplo futuro:

```text
username/password;

API key;

token externo.
```

Cada provider trata um tipo de token.

---

### AuthenticationProvider

`AuthenticationProvider` possui duas responsabilidades principais:

```text
supports:
este provider entende este token?

authenticate:
este token é válido?
```

Contrato:

```java
Authentication authenticate(
        Authentication authentication
);

boolean supports(
        Class<?> authentication
);
```

O provider não deve dizer que suporta tipos que não consegue validar corretamente.

Quando vários providers aceitam o mesmo token, a ordem precisa ser intencional.

---

### DaoAuthenticationProvider

Para username e password, um provider comum é:

```text
DaoAuthenticationProvider.
```

Ele coordena:

```text
UserDetailsService;

PasswordEncoder.
```

Fluxo:

```text
username;

UserDetailsService.loadUserByUsername;

UserDetails;

PasswordEncoder.matches;

validações da conta;

Authentication autenticada.
```

A aula 421 implementará `UserDetailsService` com banco.

Antes disso, a aula 420 usará usuário em memória.

---

### UserDetailsService

`UserDetailsService` carrega dados por username.

Contrato principal:

```java
UserDetails loadUserByUsername(
        String username
);
```

Ele não compara a senha.

Ele localiza o usuário.

Quem valida password é o provider com `PasswordEncoder`.

Separação:

```text
UserDetailsService:
carregar identidade.

PasswordEncoder:
comparar verificador.

AuthenticationProvider:
coordenar autenticação.
```

---

### UserDetails

`UserDetails` adapta uma conta para o Spring Security.

Ele expõe:

- username;
- password hash;
- authorities;
- account non-expired;
- account non-locked;
- credentials non-expired;
- enabled.

O hash fica dentro do servidor.

Ele não é enviado em responses.

Uma entity JPA não precisa implementar `UserDetails`.

Uma classe adaptadora pode evitar acoplar o domínio ao framework.

Essa decisão será tomada na aula de usuário no banco.

---

### Authentication success

Quando uma autenticação tem sucesso, o mecanismo normalmente:

1. recebe o resultado autenticado;
2. cria ou atualiza o `SecurityContext`;
3. salva o contexto quando a estratégia é stateful;
4. executa success handler;
5. continua ou responde.

Em uma API:

- pode retornar JSON;
- pode não criar sessão;
- pode usar bearer;
- pode emitir token.

Em form login:

- pode redirecionar;
- pode restaurar request salva.

A mesma arquitetura suporta ambos.

---

### Authentication failure

Quando falha:

- contexto deve permanecer vazio;
- credentials não devem vazar;
- response precisa ser previsível;
- erro não deve revelar se usuário existe;
- logs precisam evitar senha;
- rate limiting pode atuar;
- auditoria pode registrar resultado.

Um `AuthenticationFailureHandler` pode produzir a resposta específica do mecanismo de login.

Não confunda falha de autenticação com acesso negado após autenticação.

---

### 401 e AuthenticationEntryPoint

Uma request sem autenticação suficiente precisa iniciar o mecanismo de autenticação.

Esse papel pertence a:

```text
AuthenticationEntryPoint.
```

Para API, resultado comum:

```http
401 Unauthorized
```

Apesar do nome histórico, 401 significa:

```text
autenticação necessária
ou inválida.
```

A response pode incluir:

```http
WWW-Authenticate
```

dependendo do mecanismo.

Uma API deve responder JSON, não redirecionar silenciosamente para HTML.

---

### 403 e AccessDeniedHandler

Quando existe uma identidade autenticada, mas ela não possui permissão:

```http
403 Forbidden
```

O tratamento pertence a:

```text
AccessDeniedHandler.
```

Resumo:

```text
não autenticado:
401.

autenticado sem autoridade:
403.
```

Existem detalhes com anonymous authentication e exceptions, mas essa é a semântica que a API deve preservar.

---

### ExceptionTranslationFilter

`ExceptionTranslationFilter` traduz exceptions de segurança em respostas HTTP.

Ele observa principalmente:

- `AuthenticationException`;
- `AccessDeniedException`.

Comportamento conceitual:

```text
falta autenticação:
AuthenticationEntryPoint.

identidade presente sem permissão:
AccessDeniedHandler.
```

Ele não decide a autorização.

Ele traduz a falha produzida por componentes posteriores.

---

### RequestCache

Em aplicações web com login por formulário, uma request protegida pode ser salva.

Fluxo:

```text
usuário pede /private;

é enviado ao login;

autentica;

volta para /private.
```

Esse comportamento usa:

```text
RequestCache.
```

Para APIs REST, salvar requests e criar sessão pode ser indesejado.

Uma API normalmente prefere:

```text
401 JSON;

cliente autentica;

cliente repete conscientemente.
```

A decisão futura poderá usar:

```text
NullRequestCache.
```

Ela será aplicada na configuração prática.

---

### AnonymousAuthentication

Quando nenhuma autenticação real existe, o Spring Security pode inserir um token anônimo.

Isso permite que componentes trabalhem com um `Authentication` não nulo.

Um `AnonymousAuthenticationToken` pode retornar:

```text
isAuthenticated():
true.
```

Mesmo assim, ele continua sendo anonymous.

Por isso, não use apenas:

```java
authentication.isAuthenticated()
```

para concluir que existe usuário real.

Use as abstrações da framework, como:

```text
AuthenticationTrustResolver.
```

Ou utilize regras declarativas de autorização.

---

### AuthorizationFilter

Depois que mecanismos de autenticação tiveram oportunidade de preencher o contexto, a autorização avalia a request.

O modelo atual utiliza:

```text
AuthorizationManager.
```

Ele considera:

- request;
- `Authentication`;
- regra configurada;
- authorities;
- contexto adicional.

Resultados:

- permitido;
- negado.

A aula 419 criará regras simples por request.

Autorização por método e por objeto virá depois.

---

### Persistência do SecurityContext

O contexto pode ser persistido entre requests.

Estratégias:

`HttpSessionSecurityContextRepository`

```text
salva na sessão HTTP.
```

`RequestAttributeSecurityContextRepository`

```text
disponível durante dispatches
da mesma request.
```

`NullSecurityContextRepository`

```text
não persiste.
```

Uma aplicação stateful usa sessão.

Uma API bearer stateless normalmente reconstrói a identidade em cada request e não salva contexto em sessão.

A escolha precisa corresponder ao mecanismo de autenticação.

---

### SecurityContextHolderFilter

A infraestrutura web carrega o contexto de um `SecurityContextRepository`, disponibiliza durante a request e garante limpeza no final.

Em configurações modernas, salvar o contexto pode ser uma responsabilidade explícita do mecanismo.

Não escreva manualmente em `SecurityContextHolder` dentro de controllers sem compreender persistência, lifecycle e cleanup.

---

### ThreadLocal e async

O contexto associado à thread não passa automaticamente para qualquer nova thread.

Exemplo:

```text
request thread:
possui Authentication.

executor thread:
pode não possuir.
```

Spring Security oferece wrappers e executors delegantes para propagar contexto conscientemente.

Propagar contexto sem necessidade também amplia exposição.

Na aplicação:

- eventos assíncronos;
- `@Async`;
- schedulers;
- executors

precisam de decisão explícita.

Nunca copie senha ou bearer token para contexto assíncrono.

---

### SecurityContext em testes

Spring Security Test permite criar identidades em MockMvc.

Exemplos futuros:

```java
with(user("operator"));

with(anonymous());

@WithMockUser.
```

Esses utilitários criam contextos para autorização; autenticação real exige testes do mecanismo.

---

## Mão na massa guiada

### 1. Criar o documento de arquitetura

Arquivo:

```text
docs/security/M15_SPRING_SECURITY_ARCHITECTURE.md
```

Cabeçalho:

```markdown
# Arquitetura Spring Security

## Contexto

A aplicacao ainda nao possui uma SecurityFilterChain de runtime.
Este documento registra os componentes antes da configuracao pratica.

## Fluxo resumido

Request
-> DelegatingFilterProxy
-> FilterChainProxy
-> SecurityFilterChain
-> Authentication mechanism
-> AuthenticationManager
-> AuthenticationProvider
-> SecurityContext
-> Authorization
-> Controller
```

---

### 2. Adicionar dependencies de teste

No `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-core</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
    <scope>test</scope>
</dependency>
```

`spring-security-core` já fornece os principais contratos.

`spring-security-web` fornece tipos da arquitetura Servlet.

Mantenha versões sob o dependency management.

Valide:

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.springframework.security"
```

---

### 3. Criar o teste de laboratório

Arquivo:

```text
src/test/java/br/com/formacao/backend/security/architecture/SpringSecurityArchitectureLabTest.java
```

Imports principais:

```java
package br.com.formacao.backend.security.architecture;

import static org.assertj.core.api.Assertions
        .assertThat;
import static org.assertj.core.api.Assertions
        .assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import org.springframework.security.authentication
        .AnonymousAuthenticationProvider;
import org.springframework.security.authentication
        .AnonymousAuthenticationToken;
import org.springframework.security.authentication
        .AuthenticationProvider;
import org.springframework.security.authentication
        .AuthenticationTrustResolverImpl;
import org.springframework.security.authentication
        .BadCredentialsException;
import org.springframework.security.authentication
        .ProviderManager;
import org.springframework.security.authentication
        .ProviderNotFoundException;
import org.springframework.security.authentication
        .UsernamePasswordAuthenticationToken;
import org.springframework.security.core
        .Authentication;
import org.springframework.security.core
        .AuthenticationException;
import org.springframework.security.core.authority
        .AuthorityUtils;
import org.springframework.security.core.context
        .SecurityContext;
import org.springframework.security.core.context
        .SecurityContextHolder;
```

---

### 4. Limpar o contexto após cada teste

```java
@AfterEach
void clearContext() {
    SecurityContextHolder
            .clearContext();
}
```

Essa limpeza não é opcional.

O holder é global para a estratégia atual e pode contaminar outros testes na mesma thread.

---

### 5. Criar um provider didático

Dentro da classe de teste:

```java
private static final class LabAuthenticationProvider
        implements AuthenticationProvider {

    @Override
    public Authentication authenticate(
            Authentication authentication
    ) throws AuthenticationException {

        String username =
                authentication.getName();

        String password =
                String.valueOf(
                        authentication
                                .getCredentials()
                );

        if (
            !"architecture-user".equals(
                    username
            )
            || !"synthetic-password".equals(
                    password
            )
        ) {
            throw new BadCredentialsException(
                    "Invalid synthetic credentials"
            );
        }

        return UsernamePasswordAuthenticationToken
                .authenticated(
                        username,
                        null,
                        AuthorityUtils
                                .createAuthorityList(
                                        "service-order:read",
                                        "ROLE_OPERATOR"
                                )
                );
    }

    @Override
    public boolean supports(
            Class<?> authentication
    ) {
        return UsernamePasswordAuthenticationToken
                .class
                .isAssignableFrom(
                        authentication
                );
    }
}
```

As credentials são sintéticas.

O provider existe somente no teste.

Ele não representa armazenamento real.

---

### 6. Testar token antes e depois

```java
@Test
void shouldAuthenticateThroughProviderManager() {
    Authentication request =
            UsernamePasswordAuthenticationToken
                    .unauthenticated(
                            "architecture-user",
                            "synthetic-password"
                    );

    assertThat(
            request.isAuthenticated()
    )
    .isFalse();

    assertThat(
            request.getAuthorities()
    )
    .isEmpty();

    ProviderManager manager =
            new ProviderManager(
                    List.of(
                            new LabAuthenticationProvider()
                    )
            );

    Authentication result =
            manager.authenticate(
                    request
            );

    assertThat(
            result.isAuthenticated()
    )
    .isTrue();

    assertThat(
            result.getName()
    )
    .isEqualTo(
            "architecture-user"
    );

    assertThat(
            result.getCredentials()
    )
    .isNull();

    assertThat(
            result.getAuthorities()
    )
    .extracting(
            authority ->
                    authority.getAuthority()
    )
    .containsExactlyInAnyOrder(
            "service-order:read",
            "ROLE_OPERATOR"
    );
}
```

Observe as mudanças:

```text
authenticated:
false -> true.

authorities:
vazio -> preenchido.

credentials:
senha -> null.
```

---

### 7. Testar credencial inválida

```java
@Test
void shouldRejectInvalidCredentials() {
    ProviderManager manager =
            new ProviderManager(
                    List.of(
                            new LabAuthenticationProvider()
                    )
            );

    Authentication request =
            UsernamePasswordAuthenticationToken
                    .unauthenticated(
                            "architecture-user",
                            "wrong"
                    );

    assertThatThrownBy(
            () ->
                    manager.authenticate(
                            request
                    )
    )
    .isInstanceOf(
            BadCredentialsException.class
    );
}
```

O teste não diferencia:

```text
usuário ausente;

senha incorreta.
```

Uma response de login futura deve evitar enumeração.

---

### 8. Testar provider incompatível

Crie um token anônimo:

```java
@Test
void shouldFailWhenNoProviderSupportsToken() {
    ProviderManager manager =
            new ProviderManager(
                    List.of(
                            new LabAuthenticationProvider()
                    )
            );

    Authentication anonymous =
            new AnonymousAuthenticationToken(
                    "lab-key",
                    "anonymousUser",
                    AuthorityUtils
                            .createAuthorityList(
                                    "ROLE_ANONYMOUS"
                            )
            );

    assertThatThrownBy(
            () ->
                    manager.authenticate(
                            anonymous
                    )
    )
    .isInstanceOf(
            ProviderNotFoundException.class
    );
}
```

O provider declarou suporte apenas a username/password.

---

### 9. Demonstrar contexto

```java
@Test
void shouldStoreAuthenticationInSecurityContext() {
    Authentication authenticated =
            UsernamePasswordAuthenticationToken
                    .authenticated(
                            "architecture-user",
                            null,
                            AuthorityUtils
                                    .createAuthorityList(
                                            "ROLE_OPERATOR"
                                    )
                    );

    SecurityContext context =
            SecurityContextHolder
                    .createEmptyContext();

    context.setAuthentication(
            authenticated
    );

    SecurityContextHolder.setContext(
            context
    );

    assertThat(
            SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName()
    )
    .isEqualTo(
            "architecture-user"
    );

    SecurityContextHolder.clearContext();

    assertThat(
            SecurityContextHolder
                    .getContext()
                    .getAuthentication()
    )
    .isNull();
}
```

A limpeza prova o lifecycle esperado.

---

### 10. Demonstrar anonymous

```java
@Test
void shouldDistinguishAnonymousAuthentication() {
    AnonymousAuthenticationToken anonymous =
            new AnonymousAuthenticationToken(
                    "lab-key",
                    "anonymousUser",
                    AuthorityUtils
                            .createAuthorityList(
                                    "ROLE_ANONYMOUS"
                            )
            );

    AuthenticationTrustResolverImpl resolver =
            new AuthenticationTrustResolverImpl();

    assertThat(
            anonymous.isAuthenticated()
    )
    .isTrue();

    assertThat(
            resolver.isAnonymous(
                    anonymous
            )
    )
    .isTrue();

    assertThat(
            resolver.isFullyAuthenticated(
                    anonymous
            )
    )
    .isFalse();
}
```

Essa é uma das observações mais importantes da aula.

`isAuthenticated()` sozinho não significa usuário real.

---

### 11. Demonstrar provider anônimo correto

```java
@Test
void shouldAuthenticateAnonymousTokenWithMatchingKey() {
    String key =
            "lab-key";

    ProviderManager manager =
            new ProviderManager(
                    List.of(
                            new AnonymousAuthenticationProvider(
                                    key
                            )
                    )
            );

    Authentication token =
            new AnonymousAuthenticationToken(
                    key,
                    "anonymousUser",
                    AuthorityUtils
                            .createAuthorityList(
                                    "ROLE_ANONYMOUS"
                            )
            );

    Authentication result =
            manager.authenticate(
                    token
            );

    assertThat(
            result
    )
    .isSameAs(token);
}
```

A key é interna à configuração.

Ela não autentica uma pessoa.

---

### 12. Executar o laboratório

```powershell
.\mvnw.cmd `
  -Dtest=SpringSecurityArchitectureLabTest `
  test
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- dependencies em test scope;
- nenhum endpoint protegido;
- nenhum password real;
- nenhum contexto vazando entre testes.

---

### 13. Desenhar o fluxo username/password

No documento:

```text
HTTP request
    |
Authentication Filter
    |
UsernamePasswordAuthenticationToken
unauthenticated
    |
AuthenticationManager
    |
ProviderManager
    |
DaoAuthenticationProvider
    |
UserDetailsService
    |
PasswordEncoder.matches
    |
Authentication authenticated
    |
SecurityContext
```

Esse fluxo será concretizado nas aulas 420 e 421.

---

### 14. Desenhar o fluxo de autorização

```text
request protegida
    |
AuthorizationFilter
    |
AuthorizationManager
    |
Authentication atual
    |
regra de acesso
    |
permitir ou AccessDeniedException
```

Depois:

```text
anonymous ou sem autenticação:
AuthenticationEntryPoint -> 401.

autenticado sem authority:
AccessDeniedHandler -> 403.
```

---

### 15. Registrar decisões para a API

No documento:

```markdown
## Decisoes para a API

- Responses de seguranca serao JSON Problem Details.
- API nao redirecionara para tela HTML.
- Request cache sera desativado.
- Endpoints novos serao negados por default.
- Swagger e health terao regras explicitas.
- Credenciais nao permanecerao no contexto.
- 401 e 403 terao contratos diferentes.
- Autorizacao por objeto sera obrigatoria na API OS.
- Contexto nao sera salvo em sessao para bearer stateless.
```

Algumas decisões serão aplicadas gradualmente.

---

### 16. Registrar lifecycle do contexto

```markdown
## Lifecycle do SecurityContext

1. Contexto e carregado.
2. Mecanismo tenta autenticar.
3. Resultado e associado ao contexto.
4. Autorizacao consulta o contexto.
5. Controller executa quando permitido.
6. Contexto pode ser persistido conforme estrategia.
7. Holder e limpo ao final.
```

---

### 17. Registrar riscos de async

```markdown
## Async

O SecurityContext usa estrategia associada a thread na baseline.

- Nao assumir propagacao automatica.
- Propagar somente quando necessario.
- Usar wrappers oficiais.
- Nao copiar credentials.
- Limpar contexto.
- Testar identidade em tarefas.
```

Relacione aos eventos e `@Async` do M14.

---

### 18. Atualizar o threat model

Adicione componentes:

```text
P6:
Security Filter Chain.

P7:
Authentication Manager.

P8:
Authentication Provider.

D6:
Future User Store.
```

Ameaças:

```text
THR-016:
chain incorreta permite endpoint.

THR-017:
contexto não limpo vaza identidade.

THR-018:
provider suporta token indevido.

THR-019:
401 e 403 expõem comportamento incorreto.

THR-020:
contexto é propagado indevidamente para async.
```

---

### 19. Atualizar OWASP

A01:

```text
arquitetura de autorização definida;
controle ainda não implementado.
```

A02:

```text
ordem e matching de chains
são configuração sensível.
```

A07:

```text
componentes de autenticação mapeados;
login ainda ausente.
```

A09:

```text
sucesso e falha precisarão de auditoria
sem credentials.
```

A10:

```text
exceptions serão traduzidas
por entry point e denied handler.
```

Não marque A01 ou A07 como resolvidas.

---

### 20. Revisar o runtime

Execute:

```powershell
git diff `
  -- `
  "pom.xml" `
  "src/main" `
  "src/test" `
  "docs/security"
```

Confirme:

```text
src/main:
sem segurança de runtime nova.

src/test:
laboratório.

pom:
dependencies test.

docs:
arquitetura.
```

---

## Entendendo o que foi feito

### A segurança entrou antes do controller

A arquitetura foi ligada à filter chain Servlet.

### Proxy e chain foram separados

O proxy delega; o `FilterChainProxy` coordena chains.

### Authentication ganhou dois estados

Pedido não autenticado e resultado autenticado foram diferenciados.

### Providers ficaram especializados

Cada provider suporta tipos específicos de token.

### Contexto ganhou lifecycle

Carregamento, uso, persistência e limpeza ficaram explícitos.

### 401 e 403 foram separados

Autenticação necessária não é falta de permissão.

### Anonymous deixou de ser usuário real

`isAuthenticated()` sozinho mostrou-se insuficiente.

### O runtime permaneceu intacto

A arquitetura foi compreendida antes da configuração.

---

## Erros comuns importantes

### Começar por annotations

Sem arquitetura, diagnósticos ficam superficiais.

### Criar vários SecurityFilterChains sem ordem

A primeira chain correspondente vence.

### Ler password no controller

O mecanismo de autenticação deve processar credenciais.

### Usar UserDetailsService para comparar senha

Ele carrega usuário; o provider valida.

### Manter credenciais no contexto

Password e token não devem sobreviver sem necessidade.

### Confiar apenas em isAuthenticated

Anonymous pode retornar true.

### Retornar 403 para tudo

Request não autenticada deve receber 401.

### Redirecionar API para HTML

O contrato REST precisa de response própria.

### Salvar request em sessão sem necessidade

APIs stateless não precisam desse comportamento.

### Assumir contexto em @Async

ThreadLocal não propaga automaticamente.

---

## Comandos úteis

### Dependency tree

```powershell
.\mvnw.cmd dependency:tree `
  "-Dincludes=org.springframework.security"
```

### Teste focado

```powershell
.\mvnw.cmd `
  -Dtest=SpringSecurityArchitectureLabTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Revisar runtime

```powershell
git diff `
  -- `
  "src/main" `
  "pom.xml"
```

### Procurar contexto manual

```powershell
Select-String `
  -Path "src/main/java/**/*.java" `
  -Pattern `
    "SecurityContextHolder"
```

---

## Exercício guiado

### Parte 1 — Servlet

Desenhe container, proxy e filtros.

### Parte 2 — Chains

Explique matching, primeira chain e ordem.

### Parte 3 — Authentication

Diferencie request e resultado.

### Parte 4 — Provider

Implemente supports e authenticate.

### Parte 5 — Context

Armazene, leia e limpe.

### Parte 6 — Anonymous

Comprove o comportamento de `isAuthenticated`.

### Parte 7 — Exceptions

Diferencie entry point e denied handler.

### Parte 8 — Persistence

Compare sessão e stateless.

### Parte 9 — Async

Registre riscos de propagação.

### Parte 10 — Documentação

Atualize threat model e OWASP.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 417 foi preservada;
- arquitetura Servlet foi explicada;
- filter chain foi explicada;
- DelegatingFilterProxy foi explicado;
- proxy não foi tratado como implementação completa;
- FilterChainProxy foi explicado;
- SecurityFilterChain foi explicada;
- RequestMatcher foi explicado;
- primeira chain correspondente foi registrada;
- ordem de chains foi tratada como crítica;
- ordem de filtros foi explicada;
- números de ordem não foram memorizados como contrato;
- APIs oficiais de posicionamento foram citadas;
- HttpFirewall foi explicado;
- firewall não substituiu validation;
- SecurityContextHolder foi explicado;
- estratégia por thread foi explicada;
- limpeza foi considerada obrigatória;
- reutilização de threads foi explicada;
- SecurityContext foi explicado;
- contexto vazio foi criado;
- Authentication foi explicado;
- estado não autenticado foi explicado;
- estado autenticado foi explicado;
- principal foi explicado;
- credentials foram explicadas;
- authorities foram explicadas;
- details foram explicados;
- credentials sensíveis foram removidas;
- GrantedAuthority foi explicado;
- role e authority foram diferenciadas;
- autorização por objeto foi preservada;
- AuthenticationManager foi explicado;
- ProviderManager foi explicado;
- delegação por providers foi explicada;
- AuthenticationProvider foi explicado;
- supports foi explicado;
- authenticate foi explicado;
- provider incompatível foi tratado;
- DaoAuthenticationProvider foi explicado;
- UserDetailsService foi explicado;
- UserDetailsService não comparou senha;
- PasswordEncoder foi conectado ao provider;
- UserDetails foi explicado;
- entity JPA não foi acoplada antecipadamente;
- fluxo de sucesso foi explicado;
- fluxo de falha foi explicado;
- username enumeration foi considerada;
- AuthenticationEntryPoint foi explicado;
- 401 foi explicado;
- WWW-Authenticate foi citado;
- AccessDeniedHandler foi explicado;
- 403 foi explicado;
- 401 e 403 foram diferenciados;
- ExceptionTranslationFilter foi explicado;
- exception translation não foi confundida com decisão;
- RequestCache foi explicado;
- comportamento web com redirect foi explicado;
- API decidiu não salvar request;
- AnonymousAuthentication foi explicado;
- anonymous isAuthenticated true foi demonstrado;
- AuthenticationTrustResolver foi usado;
- anonymous não foi tratado como usuário real;
- AuthorizationFilter foi explicado;
- AuthorizationManager foi explicado;
- persistência do contexto foi explicada;
- HttpSessionSecurityContextRepository foi explicado;
- RequestAttributeSecurityContextRepository foi explicado;
- NullSecurityContextRepository foi explicado;
- stateful e stateless foram diferenciados;
- SecurityContextHolderFilter foi introduzido;
- escrita manual em controller foi rejeitada;
- ThreadLocal e async foram discutidos;
- propagação automática não foi assumida;
- credentials não foram propagadas;
- Spring Security Test foi introduzido conceitualmente;
- documento de arquitetura foi criado;
- dependencies ficaram em test scope;
- versões foram gerenciadas;
- teste de laboratório foi criado;
- contexto foi limpo após cada teste;
- provider didático foi criado;
- credentials sintéticas foram usadas;
- token unauthenticated foi criado;
- ProviderManager autenticou;
- token authenticated foi retornado;
- authorities foram validadas;
- credentials ficaram null;
- credencial inválida foi rejeitada;
- provider incompatível gerou erro;
- SecurityContext foi armazenado;
- SecurityContext foi limpo;
- anonymous foi identificado;
- anonymous provider foi demonstrado;
- gate completo foi executado;
- runtime permaneceu sem chain;
- fluxo username/password foi desenhado;
- fluxo de autorização foi desenhado;
- decisões de API foram registradas;
- lifecycle foi documentado;
- async foi documentado;
- threat model foi atualizado;
- OWASP foi atualizado;
- A01 não foi marcada como resolvida;
- A07 não foi marcada como resolvida;
- SecurityFilterChain bean não foi criado;
- login não foi implementado;
- usuário não foi criado;
- JWT não foi antecipado;
- commit recomendado está pronto;
- ponte para a aula 419 está correta.

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
git commit -m "test(m15): explorar arquitetura do Spring Security"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- passwords reais;
- hashes reais;
- tokens;
- credentials;
- env files;
- contexto de usuário em logs;
- provider didático em runtime;
- SecurityFilterChain antecipada;
- usuário antecipado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, você desmontou a arquitetura do Spring Security.

O fluxo ficou:

```text
request;

DelegatingFilterProxy;

FilterChainProxy;

SecurityFilterChain;

authentication mechanism;

AuthenticationManager;

AuthenticationProvider;

SecurityContext;

AuthorizationManager;

controller.
```

Você diferenciou:

```text
principal;

credentials;

authorities;

authentication request;

authentication result;

anonymous;

usuário real;

401;

403;

stateful;

stateless.
```

O laboratório comprovou:

```text
token começa não autenticado;

provider valida;

token retorna autenticado;

authorities são atribuídas;

credentials são removidas;

contexto é limpo.
```

A decisão central foi:

```text
Spring Security
não é uma annotation isolada;

é uma arquitetura de filtros,
contexto,
autenticação,
providers,
exceptions
e autorização.
```

A aplicação ainda permanece sem proteção de runtime.

Isso muda na próxima aula:

```text
419 - M15.09 - SecurityFilterChain
```

Nela, você irá:

- adicionar o starter;
- criar a primeira chain;
- negar por default;
- liberar endpoints públicos explícitos;
- criar Problem Details para 401 e 403;
- desativar request cache;
- definir session policy inicial;
- integrar CORS;
- integrar CSRF conforme a decisão;
- migrar security headers para a DSL;
- criar testes de acesso.

O login básico continuará reservado para a aula 420.

---

# Material complementar

## Checkpoint final

- [ ] Entendi proxy, chain e filtros.
- [ ] Diferenciei Authentication request e result.
- [ ] Usei ProviderManager e provider.
- [ ] Armazenei e limpei SecurityContext.
- [ ] Diferenciei anonymous, 401 e 403.

---

## Troubleshooting adicional

### ProviderNotFoundException aparece no teste de sucesso

Confirme que `supports` aceita a classe do token.

### BadCredentialsException não aparece

Confirme username e password sintéticos.

Não registre a password na mensagem.

### Contexto permanece após o teste

Adicione `SecurityContextHolder.clearContext()` no `@AfterEach`.

### Anonymous parece autenticado

Esse comportamento é esperado.

Use `AuthenticationTrustResolver`.

### Dependency apareceu no runtime

Confirme `<scope>test</scope>`.

A mudança de runtime fica para a aula 419.

### Testes falham em paralelo

Verifique manipulação global do `SecurityContextHolder`.

Não altere strategy global sem restaurar.

### Authorities estão vazias

O token de request ainda não foi autenticado ou o provider não atribuiu authorities.

### Uma classe antiga aparece na documentação

Priorize a arquitetura atual e APIs não depreciadas do reference.

---

## Perguntas de revisão

1. Qual é a base web do Spring Security?
2. O que faz DelegatingFilterProxy?
3. O que faz FilterChainProxy?
4. O que contém uma SecurityFilterChain?
5. Quantas chains processam uma request?
6. Onde fica a identidade atual?
7. O que contém SecurityContext?
8. Quais campos principais possui Authentication?
9. O que faz AuthenticationManager?
10. O que faz ProviderManager?
11. O que faz AuthenticationProvider?
12. O que faz UserDetailsService?
13. Quem compara a senha?
14. Qual status para não autenticado?
15. Qual status para sem permissão?
16. Anonymous é usuário real?
17. RequestCache é útil para quê?
18. Contexto passa automaticamente para async?
19. A aplicação já está protegida?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Servlet filters.
2. Liga o container a um bean Spring.
3. Seleciona chain e executa filtros.
4. Matcher e filtros ordenados.
5. A primeira correspondente.
6. SecurityContextHolder.
7. Authentication.
8. Principal, credentials, authorities e details.
9. Autentica um token.
10. Delega para providers.
11. Suporta e valida um tipo de token.
12. Carrega usuário por username.
13. Provider com PasswordEncoder.
14. 401.
15. 403.
16. Não.
17. Restaurar request após login web.
18. Não.
19. Não.
20. SecurityFilterChain.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 418 - M15.08 - Spring Security arquitetura

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Estudei a arquitetura Servlet do Spring Security.
- Estudei DelegatingFilterProxy.
- Estudei FilterChainProxy.
- Estudei SecurityFilterChain.
- Entendi matching e ordem das chains.
- Entendi a ordem conceitual dos filtros.
- Introduzi HttpFirewall.
- Estudei SecurityContextHolder.
- Estudei SecurityContext.
- Entendi o lifecycle e a limpeza do contexto.
- Estudei Authentication.
- Diferenciei token não autenticado e autenticado.
- Diferenciei principal, credentials, authorities e details.
- Estudei GrantedAuthority.
- Diferenciei role e permission.
- Estudei AuthenticationManager.
- Estudei ProviderManager.
- Estudei AuthenticationProvider.
- Estudei supports e authenticate.
- Introduzi DaoAuthenticationProvider.
- Estudei UserDetailsService.
- Confirmei que UserDetailsService não compara senha.
- Conectei PasswordEncoder ao provider.
- Estudei AuthenticationEntryPoint e 401.
- Estudei AccessDeniedHandler e 403.
- Estudei ExceptionTranslationFilter.
- Estudei RequestCache e a diferença entre web e API.
- Estudei AnonymousAuthentication.
- Comprovei que anonymous pode retornar isAuthenticated true.
- Usei AuthenticationTrustResolver.
- Estudei AuthorizationFilter e AuthorizationManager.
- Diferenciei sessão e contexto stateless.
- Introduzi repositories de SecurityContext.
- Registrei riscos de ThreadLocal e async.
- Adicionei dependencies somente em test scope.
- Criei `SpringSecurityArchitectureLabTest`.
- Criei um AuthenticationProvider didático.
- Autentiquei um token com ProviderManager.
- Validei authorities e remoção de credentials.
- Testei credencial inválida e provider incompatível.
- Armazenei e limpei SecurityContext.
- Criei `docs/security/M15_SPRING_SECURITY_ARCHITECTURE.md`.
- Atualizei threat model e OWASP.
- Não criei SecurityFilterChain de runtime ou login.
- Próxima aula: SecurityFilterChain.
```

---

## Referência técnica curta

- [Spring Security — Architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html)
- [Spring Security — Authentication Architecture](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html)
- [Spring Security — DaoAuthenticationProvider](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/dao-authentication-provider.html)
- [Spring Security — Anonymous Authentication](https://docs.spring.io/spring-security/reference/servlet/authentication/anonymous.html)
- [Spring Security — Session Management](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html)
- [Spring Security — Authorize HttpServletRequests](https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html)

Regra final:

```text
a arquitetura Servlet do Spring Security precisa ser entendida como uma cadeia de filtros coordenada pelo FilterChainProxy, na qual mecanismos criam Authentication requests, o AuthenticationManager delega para providers, o resultado autenticado ocupa o SecurityContext e o AuthorizationManager decide acesso; nesta baseline, 401 e 403 possuem responsabilidades diferentes, anonymous não representa usuário real, o contexto exige lifecycle e limpeza, e a aplicação permanece sem proteção de runtime até a configuração explícita da SecurityFilterChain.
```
