# 427 - M15.17 - Method Security

## Apresentação da aula

Na aula 426, a autorização deixou de perguntar apenas:

```text
a identidade está autenticada?
```

e passou a perguntar:

```text
qual capacidade esta operação exige?
```

A API recebeu uma matriz HTTP explícita:

```text
GET de OS:
service-order:read.

POST de OS:
service-order:create.

PUT de OS:
service-order:update.

PATCH de status:
service-order:status:update.

DELETE de OS:
service-order:delete.

probe administrativo:
ROLE_ADMIN.

request não declarada:
denyAll.
```

Também foram definidos:

- `SecurityAuthorityCatalog`;
- perfis de operador, supervisor, auditor e administrador;
- authorities conhecidas;
- validação das authorities no domínio;
- validação antes da emissão JWT;
- validação no Resource Server;
- testes positivos e negativos;
- documentação da matriz.

A primeira camada de autorização está na `SecurityFilterChain`.

Ela protege a fronteira HTTP.

Porém, o caso de uso também pode ser alcançado por outros caminhos:

```text
outro controller;

scheduler;

listener;

evento interno;

consumer de mensageria;

teste;

código de integração;

chamada de outro bean.
```

Se a autorização existir somente na rota, uma nova entrada pode invocar o application service sem repetir a mesma proteção.

A pergunta central desta aula será:

```text
como proteger os métodos do caso de uso
independentemente da entrada,
sem substituir a matriz HTTP
e sem antecipar regras de ownership
ou estado da ordem de serviço?
```

A solução utilizará Method Security.

A aplicação ativará:

```java
@EnableMethodSecurity
```

e protegerá o:

```text
ServiceOrderApplicationService.
```

A classe receberá uma policy padrão:

```java
@PreAuthorize("denyAll()")
```

Cada método público terá uma regra explícita.

Exemplo:

```java
@PreAuthorize(
    "hasAuthority('service-order:create')"
)
public ServiceOrderResult create(...)
```

O resultado será defesa em profundidade:

```text
request HTTP
-> SecurityFilterChain
-> controller
-> proxy do application service
-> Method Security
-> método real
-> repository
```

A filter chain continua importante porque:

- rejeita cedo;
- protege paths;
- trata CORS;
- processa bearer;
- produz challenge;
- evita alcançar o controller.

Method Security adiciona proteção porque:

- acompanha o caso de uso;
- protege chamadas diretas por outros beans;
- reduz dependência da rota;
- permite regras com parâmetros e resultados;
- torna a policy visível perto da operação.

As duas camadas não são concorrentes.

Elas possuem responsabilidades complementares.

Nesta aula serão usados:

- `@EnableMethodSecurity`;
- `@PreAuthorize`;
- `hasAuthority`;
- `denyAll`;
- `AccessDeniedException`;
- `AuthenticationCredentialsNotFoundException`;
- `@WithMockUser`;
- `WithSecurityContextTestExecutionListener`;
- proxies Spring AOP;
- testes diretos no service.

Não serão usados ainda:

- `@PostAuthorize`;
- `@PreFilter`;
- `@PostFilter`;
- SpEL com ownership;
- consulta de tenant;
- bean de autorização de negócio;
- `PermissionEvaluator`;
- ACL;
- autorização por estado da OS.

Esses pontos começam na aula seguinte:

```text
428 - M15.18 - Autorizacao por regra de negocio
```

A decisão desta aula será simples:

```text
cada método público do application service
exige a mesma permission
da operação HTTP correspondente.
```

---

## Onde estamos na formação

A sequência atual é:

```text
425:
Refresh token.

426:
Roles authorities e permissoes.

427:
Method Security.

428:
Autorizacao por regra de negocio.

429:
IDOR e autorizacao por recurso.

430:
Multi-tenant e isolamento.
```

A aula 426 respondeu:

```text
quais permissions existem
e qual endpoint exige cada uma?
```

A aula 427 responderá:

```text
como levar a mesma policy
para a camada de aplicação
e proteger chamadas fora do HTTP?
```

Nesta aula:

```text
@EnableMethodSecurity:
sim.

@PreAuthorize:
sim.

denyAll em classe:
sim.

hasAuthority:
sim.

service protegido:
sim.

teste direto:
sim.

@WithMockUser:
sim.

AccessDeniedException:
sim.

proxy:
sim.

self-invocation:
sim.

@PostAuthorize:
conceito e cautela.

regra de ownership:
não.

SpEL com parâmetro:
não.

Method Security customizado:
não.
```

A regra central será:

```text
a rota protege a entrada;

o método protege o caso de uso;

nenhum método público novo
deve nascer autorizado por omissão.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
src/main/java/br/com/formacao/backend
└── configuration
    └── security
        └── authorization
            └── MethodSecurityConfiguration.java
```

O application service será atualizado:

```text
application/serviceorder/
└── ServiceOrderApplicationService.java
```

A policy ficará:

| Método | Permission |
|---|---|
| `create` | `service-order:create` |
| `findById` | `service-order:read` |
| `search` | `service-order:read` |
| `update` | `service-order:update` |
| `transitionStatus` | `service-order:status:update` |
| `delete` | `service-order:delete` |
| método público novo sem annotation | negado |

Teste direto:

```text
src/test/java/br/com/formacao/backend
└── application
    └── serviceorder
        └── ServiceOrderMethodSecurityTest.java
```

Documento:

```text
docs/security/M15_METHOD_SECURITY.md
```

Você irá:

1. ativar Method Security;
2. selecionar somente pre/post annotations;
3. manter `@Secured` desativado;
4. manter JSR-250 desativado;
5. compreender os interceptors;
6. compreender proxies;
7. aplicar class-level deny-all;
8. proteger leitura;
9. proteger criação;
10. proteger atualização;
11. proteger transição;
12. proteger exclusão;
13. testar sem autenticação;
14. testar permission correta;
15. testar permission incorreta;
16. testar que o método não executa quando negado;
17. testar proxy real;
18. revisar self-invocation;
19. atualizar matriz e riscos;
20. preparar regras de negócio.

---

## Conceito essencial

### Method Security não é ativado automaticamente

A presença de:

```text
spring-boot-starter-security
```

não ativa, sozinha, authorization annotations em métodos.

A aplicação precisa declarar:

```java
@EnableMethodSecurity
```

Sem essa configuração, `@PreAuthorize` pode permanecer apenas como metadata sem enforcement.

A suíte precisa provar que o interceptor está ativo.

---

### Configuração moderna

A configuração atual utiliza:

```java
@EnableMethodSecurity
```

Ela substitui a abordagem antiga:

```text
@EnableGlobalMethodSecurity.
```

`@EnableMethodSecurity` ativa pre/post annotations por padrão e utiliza a arquitetura baseada em `AuthorizationManager`.

Nesta formação, a intenção será declarada explicitamente:

```java
@EnableMethodSecurity(
    prePostEnabled = true,
    securedEnabled = false,
    jsr250Enabled = false
)
```

Assim, o projeto utiliza:

```text
@PreAuthorize;

@PostAuthorize;

@PreFilter;

@PostFilter.
```

Embora somente `@PreAuthorize` seja aplicado nesta aula.

---

### @PreAuthorize

`@PreAuthorize` executa uma decisão antes da invocação do método.

Fluxo:

```text
chamada ao proxy;

Authentication obtida;

expressão avaliada;

acesso concedido:
método executa.

acesso negado:
AccessDeniedException.
```

Para um método de escrita, essa ordem é apropriada porque a decisão ocorre antes da alteração de estado.

Exemplo:

```java
@PreAuthorize(
    "hasAuthority('service-order:delete')"
)
@Transactional
public void delete(UUID id) {
    // só executa depois da autorização
}
```

---

### @PostAuthorize

`@PostAuthorize` avalia depois que o método retorna.

Ele pode usar:

```text
returnObject.
```

Isso pode ser útil em leituras.

Porém, em métodos que escrevem no banco, a alteração pode ocorrer antes da decisão.

Por isso, `@PostAuthorize` não será usado nas operações de escrita desta aula.

A autorização por recurso da aula 428 avaliará dados antes da mutação.

---

### AuthorizationManager

O suporte moderno de Method Security usa `AuthorizationManager`.

Para `@PreAuthorize`, o framework publica um interceptor que:

1. identifica a annotation;
2. cria o contexto de avaliação;
3. obtém a `Authentication`;
4. avalia a expressão;
5. permite ou nega a invocação.

Uma decisão negativa produz:

```text
AccessDeniedException.
```

Ausência de autenticação pode produzir:

```text
AuthenticationCredentialsNotFoundException.
```

---

### SecurityContext

Method Security consulta a identidade disponível no `SecurityContextHolder`.

No fluxo HTTP bearer:

```text
BearerTokenAuthenticationFilter
-> JwtAuthenticationToken
-> SecurityContext
-> método protegido.
```

Em teste direto:

```text
@WithMockUser
-> WithSecurityContextTestExecutionListener
-> SecurityContext
-> método protegido.
```

O método não precisa saber se a identidade veio de JWT, Basic, sessão ou teste.

Ele avalia authorities da `Authentication`.

---

### Proxy Spring AOP

Method Security normalmente é aplicado por proxy.

O bean injetado não é apenas a instância original.

Ele é um objeto intermediário que intercepta a chamada.

Fluxo:

```text
caller
-> proxy
-> authorization interceptor
-> target.
```

Consequências:

- use o bean gerenciado pelo Spring;
- não instancie com `new`;
- mantenha métodos protegidos acessíveis ao proxy;
- evite método `private`;
- evite método `final`;
- teste a instância proxied;
- não presuma enforcement em chamada interna.

---

### new não aplica segurança

Este código:

```java
new ServiceOrderApplicationService(...)
```

cria o objeto real fora do container.

Annotations não são executadas automaticamente.

Testes unitários que instanciam o service diretamente continuam úteis para lógica.

Eles não testam Method Security.

Para isso, o teste precisa carregar o contexto e injetar o bean.

---

### Self-invocation

Considere:

```java
public void process() {
    this.delete(id);
}
```

Se `process` e `delete` estão no mesmo bean, a chamada com `this` pode não atravessar o proxy.

A annotation de `delete` pode ser ignorada nesse caminho.

Não resolva com self-injection improvisada.

Opções melhores:

- proteger o método externo;
- mover a operação para outro bean;
- chamar um collaborator protegido;
- reorganizar o caso de uso;
- usar AspectJ somente com necessidade comprovada.

Nesta aula, os métodos protegidos não chamarão uns aos outros.

---

### Classe com deny-all

Annotations em métodos não protegem métodos sem annotation.

Para reduzir esse risco, o service receberá:

```java
@PreAuthorize("denyAll()")
```

na classe.

Cada método público autorizado declara sua própria annotation.

A regra de método substitui a regra da classe para aquela operação.

Se um desenvolvedor adicionar:

```java
public void export(...)
```

e esquecer a policy, a chamada será negada.

Isso cria deny by default também na camada de aplicação.

---

### Request Security e Method Security

A regra HTTP e a regra do método devem apontar para a mesma permission.

Exemplo:

```text
HTTP DELETE:
service-order:delete.

service.delete:
service-order:delete.
```

Divergências possíveis:

```text
rota exige read;
método exige delete.

rota exige delete;
método exige read.
```

Esses erros geram comportamento confuso.

A matriz documental e os testes precisam verificar alinhamento.

---

### HTTP 403 e exception direta

Quando uma request HTTP alcança um método e recebe `AccessDeniedException`, a infraestrutura web converte o resultado em:

```text
403 access_denied.
```

Quando o service é chamado diretamente em um teste ou outro bean, não existe response HTTP.

O caller recebe a exception.

Isso é esperado.

Não adicione dependência HTTP ao application service para transformar a exception em JSON.

---

### Annotations em classe, interface ou método

Method Security pode ser declarado em:

- método;
- classe;
- interface.

Nesta formação, a policy ficará na classe concreta do application service.

Motivos:

- a implementação é a fronteira do caso de uso;
- evita ambiguidade entre interfaces;
- facilita revisão;
- mantém annotations próximas da transação e operação.

Se uma classe herdar annotations conflitantes de interfaces diferentes, a configuração pode se tornar ambígua.

---

### Expressions simples primeiro

A aula utilizará:

```text
hasAuthority;

denyAll.
```

Não será criada uma expressão longa como:

```text
hasAuthority(...)
and authentication.name == ...
and @bean.check(...)
and ...
```

Expressions extensas ficam difíceis de:

- ler;
- testar;
- reutilizar;
- observar;
- versionar.

Regras de negócio irão para um bean de autorização na aula 428.

---

### Parâmetros de método

Expressions futuras poderão usar:

```text
#serviceOrderId;

#command;

authentication;

principal.
```

Para nomes de parâmetros estarem disponíveis em runtime, o projeto precisa compilar com:

```text
-parameters.
```

Nesta aula, as expressions não dependem de parâmetros.

A configuração será verificada antes da aula 428.

---

### @Secured e JSR-250

`@Secured` é uma opção legada e menos expressiva.

JSR-250 oferece annotations como:

```text
@RolesAllowed.
```

A formação não misturará três modelos.

Policy:

```text
@PreAuthorize:
padrão adotado.

@Secured:
desativado.

JSR-250:
desativado.
```

Uma única abordagem reduz inconsistência.

---

## Mão na massa guiada

### 1. Criar MethodSecurityConfiguration

Arquivo:

```text
MethodSecurityConfiguration.java
```

Conteúdo:

```java
package br.com.formacao.backend.configuration
        .security.authorization;

import org.springframework.context.annotation
        .Configuration;
import org.springframework.security.config.annotation
        .method.configuration.EnableMethodSecurity;

@Configuration(
        proxyBeanMethods = false
)
@EnableMethodSecurity(
        prePostEnabled = true,
        securedEnabled = false,
        jsr250Enabled = false
)
public class MethodSecurityConfiguration {
}
```

A classe não precisa declarar beans para o caso básico.

---

### 2. Atualizar ServiceOrderApplicationService

Imports:

```java
import org.springframework.security.access
        .prepost.PreAuthorize;

import static br.com.formacao.backend.configuration
        .security.authorization
        .SecurityAuthorityCatalog.*;
```

Na classe:

```java
@Service
@PreAuthorize("denyAll()")
public class ServiceOrderApplicationService {
}
```

A annotation da classe estabelece o fallback.

---

### 3. Proteger create

```java
@PreAuthorize(
        "hasAuthority('"
        + SERVICE_ORDER_CREATE
        + "')"
)
@Transactional
public ServiceOrderResult create(
        CreateServiceOrderCommand command
) {
    // implementação existente
}
```

A constant é expressão constante em compile time.

O valor efetivo permanece:

```text
service-order:create.
```

---

### 4. Proteger findById

```java
@PreAuthorize(
        "hasAuthority('"
        + SERVICE_ORDER_READ
        + "')"
)
@Transactional(
        readOnly = true
)
public ServiceOrderResult findById(
        UUID serviceOrderId
) {
    // implementação existente
}
```

A permission controla a chamada ao caso de uso.

Ela ainda não verifica se o usuário pode ler aquela OS específica.

---

### 5. Proteger search

```java
@PreAuthorize(
        "hasAuthority('"
        + SERVICE_ORDER_READ
        + "')"
)
@Transactional(
        readOnly = true
)
public Page<ServiceOrderResult> search(
        ServiceOrderSearchCriteria criteria,
        Pageable pageable
) {
    // implementação existente
}
```

A busca ainda pode retornar todas as OS compatíveis com os filtros.

Isolamento por cliente será aprofundado depois.

---

### 6. Proteger update

```java
@PreAuthorize(
        "hasAuthority('"
        + SERVICE_ORDER_UPDATE
        + "')"
)
@Transactional
public ServiceOrderResult update(
        UUID serviceOrderId,
        long expectedVersion,
        UpdateServiceOrderCommand command
) {
    // implementação existente
}
```

A autorização acontece antes:

- da validation do command;
- da consulta;
- da verificação de versão;
- da alteração.

---

### 7. Proteger transitionStatus

```java
@PreAuthorize(
        "hasAuthority('"
        + SERVICE_ORDER_STATUS_UPDATE
        + "')"
)
@Transactional
public ServiceOrderResult transitionStatus(
        UUID serviceOrderId,
        long expectedVersion,
        TransitionServiceOrderStatusCommand command
) {
    // implementação existente
}
```

A permission de status permanece separada de update.

---

### 8. Proteger delete

```java
@PreAuthorize(
        "hasAuthority('"
        + SERVICE_ORDER_DELETE
        + "')"
)
@Transactional
public void delete(
        UUID serviceOrderId
) {
    // implementação existente
}
```

A regra de negócio do delete continua no domínio e no service.

Permission não significa que qualquer exclusão será válida.

---

### 9. Revisar métodos públicos

Liste:

```powershell
Select-String `
  -Path `
    "src/main/java/**/ServiceOrderApplicationService.java" `
  -Pattern `
    "public "
```

Confirme que cada método público possui uma policy explícita.

Métodos privados não precisam de annotation.

---

### 10. Criar ServiceOrderMethodSecurityTest

Anotações:

```java
@SpringBootTest
@TestInstance(
        TestInstance.Lifecycle.PER_CLASS
)
class ServiceOrderMethodSecurityTest {
}
```

Injete:

```java
@Autowired
ServiceOrderApplicationService service;

@Autowired
ServiceOrderRepository repository;
```

Use o PostgreSQL real e a infraestrutura Testcontainers já existente.

---

### 11. Provar que o bean é proxy

```java
@Test
void shouldInjectProxiedApplicationService() {
    assertThat(
            AopUtils.isAopProxy(service)
    )
    .isTrue();
}
```

Esse teste não substitui os cenários de autorização.

Ele apenas detecta que o bean passa pela infraestrutura AOP.

---

### 12. Testar ausência de autenticação

Escolha uma chamada que não dependa de fixture:

```java
@Test
void shouldRejectDirectCallWithoutAuthentication() {
    assertThatExceptionOfType(
            AuthenticationCredentialsNotFoundException.class
    )
    .isThrownBy(
            () ->
                    service.search(
                            emptyCriteria(),
                            PageRequest.of(
                                    0,
                                    10
                            )
                    )
    );
}
```

O repository não deve ser consultado.

Se utilizar `@SpyBean` ou uma porta fake em teste específico, valide ausência de interação.

---

### 13. Testar leitura permitida

```java
@Test
@WithMockUser(
        username = "auditor",
        authorities = {
                SERVICE_ORDER_READ
        }
)
void shouldAllowReadWithReadAuthority() {
    Page<ServiceOrderResult> result =
            service.search(
                    emptyCriteria(),
                    PageRequest.of(
                            0,
                            10
                    )
            );

    assertThat(result)
            .isNotNull();
}
```

`@WithMockUser` não exige usuário no banco.

Ele cria uma `Authentication` sintética para isolar Method Security.

---

### 14. Testar leitura negada

```java
@Test
@WithMockUser(
        username = "creator",
        authorities = {
                SERVICE_ORDER_CREATE
        }
)
void shouldDenyReadWithoutReadAuthority() {
    assertThatExceptionOfType(
            AccessDeniedException.class
    )
    .isThrownBy(
            () ->
                    service.search(
                            emptyCriteria(),
                            PageRequest.of(
                                    0,
                                    10
                            )
                    )
    );
}
```

A identidade existe.

A permission necessária não.

Resultado:

```text
AccessDeniedException.
```

---

### 15. Testar criação permitida

```java
@Test
@WithMockUser(
        username = "operator",
        authorities = {
                SERVICE_ORDER_CREATE
        }
)
void shouldAllowCreateWithCreateAuthority() {
    ServiceOrderResult result =
            service.create(
                    validCreateCommand()
            );

    assertThat(result.id())
            .isNotNull();
}
```

Prepare clock e command compatíveis com a validation atual.

---

### 16. Provar que negação ocorre antes da escrita

```java
@Test
@WithMockUser(
        username = "auditor",
        authorities = {
                SERVICE_ORDER_READ
        }
)
void shouldNotWriteWhenCreateIsDenied() {
    long before =
            repository.count();

    assertThatExceptionOfType(
            AccessDeniedException.class
    )
    .isThrownBy(
            () ->
                    service.create(
                            validCreateCommand()
                    )
    );

    assertThat(
            repository.count()
    )
    .isEqualTo(before);
}
```

Esse teste prova ausência de efeito observável.

---

### 17. Testar update, status e delete

Crie uma fixture por cenário.

Matriz direta:

| Chamada | Authority correta | Authority incorreta |
|---|---|---|
| `update` | `service-order:update` | `service-order:read` |
| `transitionStatus` | `service-order:status:update` | `service-order:update` |
| `delete` | `service-order:delete` | `service-order:status:update` |

Valide:

- método permitido executa;
- método negado lança `AccessDeniedException`;
- versão e estado permanecem inalterados quando negado.

---

### 18. Testar roles isoladas

```java
@Test
@WithMockUser(
        roles = "ADMIN"
)
void shouldNotInferDeletePermissionFromAdminRole() {
    assertThatExceptionOfType(
            AccessDeniedException.class
    )
    .isThrownBy(
            () ->
                    service.delete(
                            existingId()
                    )
    );
}
```

A aula 426 definiu que role não implica permission.

O teste direto preserva essa decisão.

---

### 19. Testar permission sem role

```java
@Test
@WithMockUser(
        authorities = {
                SERVICE_ORDER_DELETE
        }
)
void shouldAllowDeleteWithPermissionWithoutRole() {
    UUID id =
            createFixture();

    service.delete(id);

    assertThat(
            repository.existsById(id)
    )
    .isFalse();
}
```

O método exige capacidade concreta.

---

### 20. Criar método de laboratório temporário

Para provar class-level deny-all, adicione temporariamente durante o laboratório:

```java
public long countForDiagnostics() {
    return repository.count();
}
```

Sem annotation específica:

```text
chamada autenticada:
AccessDeniedException.
```

Depois remova esse método.

A suíte final pode testar a policy por reflexão em vez de manter uma API desnecessária.

---

### 21. Criar teste arquitetural simples

Percorra métodos públicos declarados:

```java
@Test
void shouldDeclareMethodSecurityOnPublicMethods() {
    Arrays.stream(
            ServiceOrderApplicationService.class
                    .getDeclaredMethods()
    )
    .filter(
            method ->
                    Modifier.isPublic(
                            method.getModifiers()
                    )
    )
    .forEach(
            method ->
                    assertThat(
                            AnnotatedElementUtils
                                    .findMergedAnnotation(
                                            method,
                                            PreAuthorize.class
                                    )
                    )
                    .as(method.getName())
                    .isNotNull()
    );
}
```

Esse teste verifica annotation explícita.

A class-level deny-all continua sendo a proteção de fallback.

Ignore métodos synthetic quando necessário.

---

### 22. Testar pelo HTTP

Mantenha `AuthorizationMatrixIntegrationTest`.

Ele continua comprovando:

```text
bearer real;

decoder;

converter;

request authorization;

controller;

method authorization;

service;

repository.
```

Os novos testes diretos comprovam apenas a segunda camada.

As duas suítes são complementares.

---

### 23. Revisar self-invocation

Procure chamadas internas:

```powershell
Select-String `
  -Path `
    "src/main/java/**/ServiceOrderApplicationService.java" `
  -Pattern `
    "this\."
```

Revise também chamadas sem `this` entre métodos públicos.

Se um método protegido chama outro método protegido no mesmo bean, documente e refatore.

---

### 24. Verificar métodos final e private

Procure:

```powershell
Select-String `
  -Path `
    "src/main/java/**/ServiceOrderApplicationService.java" `
  -Pattern `
    "private .*create|final .*create|private .*delete|final .*delete"
```

Métodos de entrada protegidos devem permanecer públicos e interceptáveis.

Helpers privados continuam permitidos.

---

### 25. Atualizar documentação

Crie:

```text
docs/security/M15_METHOD_SECURITY.md
```

Inclua:

```markdown
# Method Security

## Objetivo

Proteger casos de uso independentemente da entrada.

## Configuracao

- `@EnableMethodSecurity`.
- Pre/post habilitado.
- `@Secured` desabilitado.
- JSR-250 desabilitado.

## Policy

- Class-level `denyAll`.
- Permission explícita por método.

## Matriz

| Metodo | Authority |
| ... |

## Limites

- Proxy Spring AOP.
- Self-invocation.
- `new` não é protegido.
- Methods sem annotation usam deny-all.
- Ownership ainda pendente.

## Testes

- Sem authentication.
- Permission correta.
- Permission ausente.
- Sem efeitos quando negado.
- HTTP end-to-end.
```

---

### 26. Atualizar threat model

Adicione:

```text
THR-066:
service chamado por outra entrada
sem autorização HTTP.

THR-067:
método público novo
nasce sem annotation.

THR-068:
self-invocation ignora proxy.

THR-069:
objeto criado com new
ignora Method Security.

THR-070:
permission HTTP e método divergem.

THR-071:
@PostAuthorize valida
depois de uma escrita.

THR-072:
scheduler chama método protegido
sem SecurityContext.
```

Controles:

- Method Security;
- class-level deny-all;
- testes diretos;
- alinhamento de matriz;
- ausência de self-invocation;
- `@PreAuthorize` em writes;
- revisão de entradas internas.

---

### 27. Atualizar OWASP e baseline

A01 Broken Access Control:

```text
request authorization:
implementada.

method authorization:
implementada.

object-level authorization:
pendente.
```

Baseline:

```text
fronteira HTTP:
permissions explícitas.

application service:
@PreAuthorize.

default do service:
denyAll.

regras por objeto:
pendentes.

produção pública:
NO-GO.
```

Não declare A01 resolvido.

---

### 28. Executar o gate

Teste focado:

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderMethodSecurityTest `
  test
```

Matriz HTTP:

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixIntegrationTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- bean proxied;
- ausência de autenticação rejeitada;
- permissions corretas permitidas;
- permissions incorretas negadas;
- nenhum write negado alterou banco;
- HTTP continua alinhado;
- refresh continua verde;
- nenhum teste usa objeto criado com `new` para provar Method Security;
- nenhum método público ficou sem policy;
- nenhum token apareceu em logs.

---

## Entendendo o que foi feito

### A policy acompanhou o caso de uso

Ela deixou de existir apenas na rota.

### A filter chain permaneceu ativa

Method Security não substituiu a proteção HTTP.

### A classe passou a negar por padrão

Métodos públicos novos não nascem liberados.

### Cada operação recebeu uma permission

A matriz HTTP e o service ficaram alinhados.

### Testes diretos provaram a segunda camada

Eles não dependem de controller ou MockMvc.

### O proxy tornou as annotations executáveis

O bean gerenciado foi essencial.

### Writes negados não produziram efeitos

`@PreAuthorize` executou antes do método.

### Regras por objeto permaneceram fora do escopo

A permission ainda é apenas a primeira decisão.

---

## Erros comuns importantes

### Adicionar annotation sem EnableMethodSecurity

A annotation não produz enforcement.

### Instanciar service com new

O proxy é ignorado.

### Proteger método private

Chamadas privadas não atravessam o proxy.

### Chamar método protegido com this

Self-invocation pode ignorar o interceptor.

### Usar @PostAuthorize em escrita

A alteração pode acontecer antes da negação.

### Confiar somente no teste HTTP

Outra entrada pode chamar o service.

### Confiar somente no teste direto

O bearer e a filter chain também precisam ser testados.

### Deixar método público sem annotation

Use class-level deny-all e teste arquitetural.

### Duplicar expressions longas

Regras de negócio devem ir para componentes testáveis.

### Misturar @Secured, JSR-250 e @PreAuthorize

Uma policy única é mais previsível.

---

## Comandos úteis

### Teste direto

```powershell
.\mvnw.cmd `
  -Dtest=ServiceOrderMethodSecurityTest `
  test
```

### Teste HTTP

```powershell
.\mvnw.cmd `
  -Dtest=AuthorizationMatrixIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Procurar Method Security

```powershell
git grep `
  -n `
  -E `
  "@EnableMethodSecurity|@PreAuthorize"
```

### Procurar self-invocation

```powershell
git grep `
  -n `
  -E `
  "this\\.(create|findById|search|update|transitionStatus|delete)"
```

### Procurar configuração antiga

```powershell
git grep `
  -n `
  "@EnableGlobalMethodSecurity"
```

---

## Exercício guiado

### Parte 1 — Configuração

Ative somente pre/post Method Security.

### Parte 2 — Fallback

Aplique deny-all na classe.

### Parte 3 — Leitura

Proteja `findById` e `search`.

### Parte 4 — Escrita

Proteja create, update, status e delete.

### Parte 5 — Contexto

Teste ausência de Authentication.

### Parte 6 — Permission

Teste allowed e denied diretamente.

### Parte 7 — Efeitos

Comprove que write negado não alterou banco.

### Parte 8 — Proxy

Comprove que o bean é proxied.

### Parte 9 — Arquitetura

Detecte método público sem annotation.

### Parte 10 — Documentação

Atualize matriz, threat model e baseline.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 426 foi preservada;
- Method Security foi diferenciado de request security;
- `@EnableMethodSecurity` foi adicionado;
- pre/post annotations foram habilitadas;
- `@Secured` permaneceu desativado;
- JSR-250 permaneceu desativado;
- configuração antiga não foi usada;
- arquitetura com `AuthorizationManager` foi explicada;
- `@PreAuthorize` foi aplicado antes da invocação;
- `@PostAuthorize` foi discutido e não usado em writes;
- `SecurityContext` foi conectado à decisão;
- proxy Spring AOP foi explicado;
- objeto criado com `new` não foi tratado como protegido;
- self-invocation foi explicada;
- método `private` e `final` foram evitados nas entradas;
- class-level `denyAll` foi aplicado;
- método específico substitui o fallback da classe;
- `create` exige create;
- `findById` exige read;
- `search` exige read;
- `update` exige update;
- `transitionStatus` exige status update;
- `delete` exige delete;
- role isolada não implica permission;
- permission sem role pode autorizar a operação correspondente;
- HTTP e método usam a mesma permission;
- expression longa de negócio não foi criada;
- SpEL por parâmetro não foi antecipado;
- bean de autorização de negócio não foi antecipado;
- teste carrega contexto Spring;
- bean injetado foi comprovado como proxy;
- chamada sem authentication foi rejeitada;
- permission correta foi permitida;
- permission incorreta lançou `AccessDeniedException`;
- criação negada não alterou o banco;
- update negado não alterou versão ou estado;
- status negado não alterou estado;
- delete negado não removeu registro;
- teste direto não foi chamado de teste JWT;
- `@WithMockUser` foi usado somente para isolar Method Security;
- testes HTTP com bearer real foram preservados;
- método público sem annotation foi detectado;
- métodos synthetic foram considerados;
- chamadas internas entre métodos protegidos foram revisadas;
- documentação Method Security foi criada;
- matriz de autorização foi atualizada;
- threat model foi atualizado;
- OWASP A01 foi atualizado sem ser encerrado;
- baseline foi atualizada;
- object-level authorization permaneceu pendente;
- PostgreSQL real foi preservado;
- refresh token continuou verde;
- nenhum token apareceu em logs;
- gate completo foi executado;
- commit recomendado está pronto;
- ponte para a aula 428 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git grep -n "@EnableGlobalMethodSecurity"
git grep -n -E "this\\.(create|findById|search|update|transitionStatus|delete)"
```

Adicione:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Commit recomendado:

```powershell
git commit -m "feat(m15): proteger casos de uso com Method Security"
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
- annotation sem teste;
- Method Security duplicado em objetos não gerenciados;
- regra de ownership antecipada;
- configuração antiga;
- teste desabilitado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a autorização ganhou uma segunda camada.

O fluxo passou a ser:

```text
request authorization;

controller;

method authorization;

application service;

domínio;

repository.
```

A filter chain continua protegendo:

- paths;
- métodos HTTP;
- autenticação bearer;
- challenge;
- respostas 401 e 403.

Method Security passou a proteger:

- criação;
- leitura;
- busca;
- atualização;
- transição de status;
- exclusão.

A classe recebeu:

```text
denyAll como fallback.
```

Cada método público recebeu:

```text
permission explícita.
```

Os testes diretos comprovaram:

```text
sem Authentication:
rejeitado.

sem permission:
rejeitado.

com permission:
permitido.

write negado:
sem efeito no banco.
```

A decisão central foi:

```text
a policy precisa acompanhar
o caso de uso,
não apenas a rota;

o proxy intercepta a invocação,
@PreAuthorize decide antes do método
e métodos públicos novos permanecem negados.
```

A autorização ainda não considera o objeto concreto.

Um usuário com:

```text
service-order:read
```

ainda pode, em princípio, solicitar qualquer OS.

Um usuário com:

```text
service-order:update
```

ainda não passou por regras como:

- vínculo com cliente;
- ownership;
- tenant;
- estado atual;
- campo alterado;
- janela operacional.

A próxima aula será:

```text
428 - M15.18 - Autorizacao por regra de negocio
```

Nela, você irá:

- criar um componente de autorização;
- usar parâmetros de método;
- validar UUID do subject;
- consultar vínculo do usuário;
- combinar permission e regra de domínio;
- usar SpEL curto;
- testar acesso ao mesmo recurso por identidades diferentes;
- evitar lógica extensa dentro da annotation;
- preparar prevenção de IDOR.

---

# Material complementar

## Checkpoint final

- [ ] Ativei `@EnableMethodSecurity`.
- [ ] Apliquei deny-all no application service.
- [ ] Protegi cada método com sua permission.
- [ ] Testei chamadas diretas ao bean proxied.
- [ ] Comprovei ausência de efeitos quando negado.

---

## Troubleshooting adicional

### @PreAuthorize não faz nada

Confirme:

- `@EnableMethodSecurity`;
- bean gerenciado;
- chamada através do proxy;
- annotation no método ou classe;
- teste com contexto Spring.

### O teste com new permite tudo

Isso é esperado.

O objeto foi criado fora do container.

### A chamada interna ignora a annotation

Revise self-invocation.

Mova a operação protegida para outro bean.

### O método permitido lança AuthenticationCredentialsNotFoundException

Confirme o `SecurityContext`.

Em teste, use `@WithMockUser`.

### O método permitido lança AccessDeniedException

Confirme o valor exato da authority.

Authorities são case-sensitive.

### HTTP retorna 500 para AccessDeniedException

Revise a integração entre `ExceptionTranslationFilter`, entry point e denied handler.

Não capture a exception no controller.

### @WithMockUser passa, bearer real falha

O teste direto não valida decoder ou JWT.

Mantenha a suíte HTTP real.

### O método novo ficou acessível

Confirme class-level `denyAll` e o teste arquitetural.

---

## Perguntas de revisão

1. O que ativa Method Security?
2. O starter ativa sozinho?
3. Qual annotation foi usada?
4. Quando `@PreAuthorize` executa?
5. Qual exception representa negação?
6. O que acontece sem Authentication?
7. De onde vem a Authentication no HTTP?
8. De onde vem no teste direto?
9. Por que o bean precisa ser proxy?
10. `new` aplica Method Security?
11. O que é self-invocation?
12. Por que usar deny-all na classe?
13. Qual permission protege create?
14. Qual permission protege search?
15. Qual permission protege status?
16. Method Security substitui a chain?
17. `@PostAuthorize` foi usado em writes?
18. Ownership foi implementado?
19. Qual é a próxima aula?
20. O que ela adicionará?

---

## Roteiro de resposta

1. `@EnableMethodSecurity`.
2. Não.
3. `@PreAuthorize`.
4. Antes do método.
5. `AccessDeniedException`.
6. Falha de credenciais no contexto.
7. Do bearer validado.
8. De `@WithMockUser`.
9. O interceptor fica no proxy.
10. Não.
11. Chamada interna que não atravessa o proxy.
12. Negar métodos públicos não declarados.
13. `service-order:create`.
14. `service-order:read`.
15. `service-order:status:update`.
16. Não.
17. Não.
18. Não.
19. Autorização por regra de negócio.
20. Decisão baseada no recurso e no usuário.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 427 - M15.17 - Method Security

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Diferenciei request security e Method Security.
- Ativei `@EnableMethodSecurity`.
- Mantive pre/post annotations habilitadas.
- Mantive `@Secured` e JSR-250 desativados.
- Estudei a arquitetura baseada em `AuthorizationManager`.
- Estudei `@PreAuthorize`.
- Registrei a cautela de `@PostAuthorize` em writes.
- Entendi o uso do `SecurityContext`.
- Estudei proxies Spring AOP.
- Confirmei que objetos criados com `new` não são protegidos.
- Estudei self-invocation.
- Mantive métodos protegidos públicos e interceptáveis.
- Apliquei `denyAll` na classe do application service.
- Exigi `service-order:create` em `create`.
- Exigi `service-order:read` em `findById` e `search`.
- Exigi `service-order:update` em `update`.
- Exigi `service-order:status:update` em `transitionStatus`.
- Exigi `service-order:delete` em `delete`.
- Mantive role separada de permission.
- Criei `ServiceOrderMethodSecurityTest`.
- Testei o bean proxied.
- Testei chamada sem Authentication.
- Testei permissions corretas e incorretas.
- Comprovei que writes negados não alteram o banco.
- Testei role sem permission e permission sem role.
- Mantive testes HTTP com bearer real.
- Criei verificação de métodos públicos sem policy.
- Revisei self-invocation.
- Criei `docs/security/M15_METHOD_SECURITY.md`.
- Atualizei matriz, threat model, OWASP e baseline.
- Não implementei ownership ou regra por recurso.
- Próxima aula: Autorizacao por regra de negocio.
```

---

## Referência técnica curta

- [Spring Security — Method Security](https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html)
- [Spring Security — Testing Method Security](https://docs.spring.io/spring-security/reference/servlet/test/method.html)
- [Spring Security — Authorization Architecture](https://docs.spring.io/spring-security/reference/servlet/authorization/architecture.html)
- [Spring Security — AuthorizationManager](https://docs.spring.io/spring-security/reference/api/java/org/springframework/security/authorization/AuthorizationManager.html)
- [Spring Framework — Proxying Mechanisms](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

Regra final:

```text
Method Security deve complementar a autorização HTTP e acompanhar o caso de uso: nesta baseline, @EnableMethodSecurity ativa interceptors baseados em AuthorizationManager, o ServiceOrderApplicationService recebe denyAll como fallback, cada método público exige sua permission com @PreAuthorize, chamadas precisam atravessar o proxy Spring, self-invocation e objetos criados com new não são considerados protegidos, writes negados não podem produzir efeitos e testes diretos do service precisam coexistir com testes HTTP de bearer; ownership e regras baseadas no recurso permanecem para a próxima aula.
```
