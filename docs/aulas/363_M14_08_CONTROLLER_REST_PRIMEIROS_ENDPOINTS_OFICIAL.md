# 363 - M14.08 - Controller REST primeiros endpoints

## Apresentacao da aula

Na aula 362, você concluiu a fundação inicial do Spring container.

O projeto contínuo já possui:

```text
Spring Boot 4.1.0;

Java 21;

Maven Wrapper;

aplicação servlet;

Tomcat embarcado;

configuração externa;

profiles;

@ConfigurationProperties;

beans;

constructor injection;

qualifiers;

ciclo de vida;

shutdown gracioso.
```

Até agora, a aplicação inicia um servidor HTTP, mas não oferece um contrato de negócio pela web.

Quando a raiz é acessada, o resultado esperado ainda é:

```text
HTTP 404.
```

Esse status foi útil nas aulas anteriores porque comprovou:

```text
processo Java ativo;

Tomcat ativo;

porta ativa;

DispatcherServlet disponível;

nenhum handler registrado para o caminho.
```

Agora surge a pergunta que inaugura a camada web:

```text
como transformar um metodo Java
em um ponto de entrada HTTP
sem colocar regra de negocio no controller?
```

Nesta aula, você criará os primeiros endpoints REST do projeto.

O controller principal será:

```text
RuntimeMessageController.
```

O prefixo HTTP será:

```text
/api/v1/runtime.
```

Os endpoints obrigatórios serão:

```text
GET /api/v1/runtime/ping

GET /api/v1/runtime
```

O primeiro endpoint devolverá texto puro:

```text
pong
```

O segundo chamará o serviço já existente:

```text
RuntimeMessageService
```

e devolverá uma representação JSON.

Essa progressão permite observar dois caminhos de resposta:

```text
String
    -> text/plain.

record Java
    -> application/json.
```

O endpoint JSON utilizará:

```text
ResponseEntity<RuntimeMessageResponse>.
```

Assim, você terá contato inicial com:

- body;
- status;
- headers;
- media type.

Nesta aula, todos os casos válidos retornarão:

```text
200 OK.
```

Outros métodos HTTP, semântica de status, headers, cache, idempotência e desenho REST serão aprofundados na aula:

```text
364 - M14.09 - HTTP e REST de verdade
```

A aula atual também apresentará query string de forma introdutória.

Exemplo:

```text
/api/v1/runtime/greeting?name=Thiago
```

Esse terceiro endpoint ficará como exercício guiado e não fará parte da baseline obrigatória.

A utilização aprofundada de:

- `@RequestParam`;
- `@PathVariable`;
- `@RequestBody`;

será feita na aula:

```text
365 - M14.10 - Request body PathVariable RequestParam
```

A fronteira desta aula é clara.

Você criará:

- controller;
- response record;
- mapping;
- chamada ao service;
- serialização JSON;
- testes MVC;
- teste com servidor real;
- comandos curl;
- logging web controlado.

Você não criará:

- POST;
- PUT;
- PATCH;
- DELETE;
- request body;
- path variable;
- validação;
- tratamento global de erros;
- persistência;
- entity exposta;
- banco;
- Security;
- documentação OpenAPI.

O objetivo é construir o primeiro contrato web com pequena superfície e testes fortes.

O projeto continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Nenhum projeto novo será gerado.

A próxima aula será:

```text
364 - M14.09 - HTTP e REST de verdade
```

---

## Onde estamos na formacao

A progressão do M14 chegou a:

```text
356:
visão geral do Boot.

357:
Initializr e estrutura.

358:
Main Application e auto configuration.

359:
properties, YAML e profiles.

360:
beans e formas de registro.

361:
constructor injection.

362:
ciclo de vida.

363:
primeiros controllers e endpoints.

364:
HTTP e REST de verdade.

365:
request body, path variable e request param.
```

A aula 362 respondeu:

```text
como o container administra o ciclo de vida?
```

A aula 363 responderá:

```text
como uma requisicao chega ao controller
e como um objeto Java vira resposta HTTP?
```

Nesta aula:

```text
@RestController:
sim.

@RequestMapping:
sim.

@GetMapping:
sim.

endpoint textual:
sim.

endpoint JSON:
sim.

ResponseEntity:
sim.

status 200:
sim.

content type:
sim.

record de response:
sim.

service chamado pelo controller:
sim.

MockMvc:
sim.

@WebMvcTest:
sim.

@MockitoBean:
sim.

servidor real:
sim.

Java HttpClient:
sim.

curl:
sim.

query string:
introdução e exercício.

@RequestBody:
não.

@PathVariable:
não.

POST:
não.

erros globais:
não.

HTTP profundo:
não.
```

O controller será fino.

A regra será:

```text
controller recebe HTTP;

controller delega;

service executa o caso de uso;

controller adapta o resultado;

Spring escreve a resposta.
```

---

## Objetivo pratico

Você continuará no projeto:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A estrutura será ampliada para:

```text
src/main/java/br/com/formacao/backend
├── FormacaoJavaBackendApiApplication.java
├── beans
│   ├── repository
│   │   └── RuntimeMessageRepository.java
│   └── service
│       ├── RuntimeMessageResult.java
│       └── RuntimeMessageService.java
└── web
    ├── controller
    │   └── RuntimeMessageController.java
    └── response
        └── RuntimeMessageResponse.java
```

Configuração de laboratório:

```text
src/main/resources
└── application-web-lab.yaml
```

Testes:

```text
src/test/java/br/com/formacao/backend/web
├── RuntimeMessageControllerUnitTest.java
├── RuntimeMessageControllerWebMvcTest.java
├── RuntimeMessageControllerLiveServerIT.java
├── RuntimeMessageJsonContractIT.java
├── RuntimeMessageControllerArchitectureTest.java
└── UnknownRouteWebMvcTest.java
```

Documentação externa:

```text
docs
├── spring-mvc-request-flow.md
├── controller-restcontroller.md
├── request-mapping-first-endpoints.md
├── response-body-and-json.md
├── response-entity.md
├── thin-controller.md
├── mockmvc-vs-live-server.md
├── first-api-contract.md
└── curl-evidence.md
```

Scripts:

```text
scripts
├── 33_iniciar_web_lab.ps1
├── 34_testar_ping.ps1
├── 35_testar_runtime_json.ps1
├── 36_executar_testes_mvc.ps1
├── 37_executar_teste_servidor_real.ps1
└── 38_validar_controller_fino.ps1
```

Resultados esperados:

```text
GET /api/v1/runtime/ping:
200.

content type:
text/plain compatível.

body:
pong.

GET /api/v1/runtime:
200.

content type:
application/json compatível.

body:
generatedAt, formatterId e messages.

controller:
@RestController.

base path:
/api/v1/runtime.

service:
injetado por construtor.

repository no controller:
ausente.

ApplicationContext no controller:
ausente.

MockMvc:
verde.

servidor real:
porta aleatória no teste.

rota desconhecida:
404.

POST:
nenhum.

request body:
nenhum.

path variable:
nenhum.
```

---

## Conceito essencial

### Camada web

A camada web traduz protocolo HTTP para chamadas da aplicação.

Ela recebe informações como:

- método;
- caminho;
- headers;
- query;
- body;
- media type.

Depois, converte essas informações em parâmetros Java.

Ao terminar, converte o resultado Java em:

- status;
- headers;
- body;
- content type.

O controller é uma fronteira.

Ele não deve assumir responsabilidades do domínio ou da persistência.

---

### Fluxo de uma requisicao Spring MVC

O fluxo simplificado será:

```text
cliente HTTP;

Tomcat;

filtros servlet;

DispatcherServlet;

HandlerMapping;

HandlerAdapter;

controller;

service;

return value handler;

HttpMessageConverter;

resposta HTTP.
```

Nesta aula, o foco ficará entre:

```text
DispatcherServlet
-> controller
-> service
-> resposta.
```

Filtros, interceptors, exceptions e segurança terão momentos próprios.

---

### DispatcherServlet

O `DispatcherServlet` é o front controller do Spring MVC.

Ele recebe requisições e coordena:

- descoberta do handler;
- resolução de argumentos;
- execução do método;
- tratamento do retorno;
- renderização ou escrita do body;
- tratamento de exceptions.

Você não criará o `DispatcherServlet` manualmente.

A auto-configuração do Spring Boot já o registrou porque Spring Web MVC está no classpath.

---

### HandlerMapping

O `HandlerMapping` associa uma requisição a um handler.

No projeto, o handler será um método do controller.

Exemplo:

```text
GET + /api/v1/runtime/ping
    -> RuntimeMessageController.ping().
```

O caminho sozinho não basta.

O método HTTP também participa do mapping.

A semântica profunda de métodos será estudada na aula 364.

---

### HandlerAdapter

Depois que o handler é localizado, uma infraestrutura compatível executa o método.

Ela participa de:

- resolução de parâmetros;
- chamada;
- processamento do retorno.

Isso permite que o controller trabalhe com tipos Java em vez de manipular diretamente request e response servlet.

Nesta primeira aula, os métodos serão simples e sem dependência direta da API Servlet.

---

### @Controller

`@Controller` marca uma classe da camada MVC.

Tradicionalmente, métodos podem retornar:

- nome de view;
- model;
- body com `@ResponseBody`;
- outros tipos suportados.

A formação está construindo uma API.

Por isso, usará:

```text
@RestController.
```

---

### @RestController

`@RestController` combina:

```text
@Controller
+
@ResponseBody.
```

Com isso, o valor retornado pelos métodos é tratado como corpo da resposta por padrão.

Exemplos:

```text
String:
texto no body.

record:
objeto convertido para JSON.

ResponseEntity:
status, headers e body.
```

Não confunda `@RestController` com arquitetura REST completa.

A annotation define comportamento MVC.

O desenho REST será aprofundado depois.

---

### @RequestMapping

`@RequestMapping` mapeia requisições.

Pode ser aplicado:

- na classe;
- no método.

Nesta aula, será usado na classe:

```java
@RequestMapping(
        "/api/v1/runtime"
)
```

Isso cria um prefixo compartilhado.

Os métodos adicionam caminhos específicos.

---

### @GetMapping

`@GetMapping` é a variante especializada de mapping para GET.

Exemplo:

```java
@GetMapping(
        path = "/ping",
        produces = MediaType.TEXT_PLAIN_VALUE
)
```

Ele é equivalente, em intenção, a um request mapping restrito ao método GET.

A forma especializada comunica melhor a operação.

---

### Endpoint

Neste curso, endpoint será entendido como a combinação observável de:

```text
método HTTP;

caminho;

entrada;

saída;

status;

media type.
```

Exemplo:

```text
GET /api/v1/runtime/ping

entrada:
nenhuma.

saída:
pong.

status:
200.

media type:
text/plain.
```

Não trate somente o caminho como contrato completo.

---

### Prefixo /api

O prefixo:

```text
/api
```

separa endpoints de API de recursos estáticos e outras superfícies.

Ele é uma convenção do projeto.

Não é uma exigência do Spring.

---

### Versao /v1

O prefixo:

```text
/v1
```

introduz versionamento de contrato no caminho.

A aula não comparará todas as estratégias de versionamento.

O objetivo é estabelecer uma baseline estável.

Mudanças incompatíveis futuras não devem ser introduzidas silenciosamente sob o mesmo contrato.

---

### Endpoint textual

O método:

```java
@GetMapping(
        path = "/ping",
        produces = MediaType.TEXT_PLAIN_VALUE
)
public String ping() {
    return "pong";
}
```

devolve uma `String`.

Como a classe é `@RestController`, a string vai para o body.

O método não representa health check de produção.

Ele é apenas o primeiro endpoint didático.

Actuator e health real serão estudados depois.

---

### produces

O atributo:

```text
produces
```

declara o media type produzido.

Nesta aula:

```text
ping:
text/plain.

runtime:
application/json.
```

Isso torna o contrato explícito.

Content negotiation e header `Accept` serão aprofundados na aula 364.

---

### Response record

A resposta JSON não devolverá diretamente:

```text
RuntimeMessageResult.
```

Será criado:

```text
RuntimeMessageResponse.
```

Motivos:

- separar aplicação de HTTP;
- controlar nomes expostos;
- evitar acoplamento com alterações internas;
- preparar evolução de contrato;
- impedir exposição de entidades futuras.

O response será um record imutável.

---

### Serializacao JSON

Quando um objeto é retornado por um `@RestController`, Spring MVC utiliza um message converter compatível.

Com suporte JSON no classpath, o record é convertido em JSON.

Exemplo conceitual:

```json
{
  "generatedAt": "2026-07-10T22:00:00Z",
  "formatterId": "compact",
  "messages": [
    "bootstrap",
    "configuration"
  ]
}
```

O controller não concatena JSON manualmente.

Não use:

```java
return "{\"status\":\"ok\"}";
```

para objetos estruturados.

Isso produz contrato frágil e escapa incorretamente dados.

---

### Record como response

O record será:

```java
public record RuntimeMessageResponse(
        Instant generatedAt,
        String formatterId,
        List<String> messages
) {
}
```

No construtor compacto:

- valide campos obrigatórios;
- copie a lista;
- mantenha imutabilidade.

Ele não recebe stereotype Spring.

É um valor de resposta criado por operação.

---

### Factory from

O response pode possuir:

```java
public static RuntimeMessageResponse from(
        RuntimeMessageResult result
) {
}
```

Essa factory adapta o resultado da aplicação para o contrato web.

A lógica deve ser mecânica.

Ela não decide regra de negócio.

---

### ResponseEntity

`ResponseEntity<T>` representa uma resposta HTTP com:

- status;
- headers;
- body.

Uso inicial:

```java
return ResponseEntity.ok(
        RuntimeMessageResponse.from(
                result
        )
);
```

O status será:

```text
200 OK.
```

O body será serializado.

Nesta aula, não serão criados headers customizados.

O objetivo é reconhecer a estrutura completa.

---

### Retornar objeto direto ou ResponseEntity

Um método pode retornar o objeto diretamente quando:

- status padrão é suficiente;
- nenhum header especial é necessário;
- o contrato é simples.

`ResponseEntity` é útil quando o método precisa controlar explicitamente o envelope HTTP.

Não envolva tudo mecanicamente.

Nesta aula, o ping retorna `String` diretamente e o endpoint principal retorna `ResponseEntity`.

---

### Status 200

O status:

```text
200 OK
```

indica sucesso com uma representação no body.

A aula 364 aprofundará:

- famílias de status;
- diferenças entre 200, 201, 204;
- erros de cliente;
- erros de servidor;
- semântica de cada método.

Agora, apenas valide o contrato de sucesso.

---

### Content-Type

`Content-Type` descreve o formato do body devolvido.

Resultados esperados:

```text
text/plain;

application/json.
```

Nos testes, use compatibilidade de media type quando parâmetros como charset puderem existir.

Evite assert frágil em string exata quando o contrato aceita media type compatível.

---

### Controller fino

Um controller fino:

- recebe dados HTTP;
- delega ao service;
- adapta resultado;
- devolve resposta.

Ele não deve:

- acessar repository;
- iniciar transação manual;
- executar SQL;
- usar `ApplicationContext.getBean`;
- montar regra de negócio;
- capturar `Exception` genérica;
- criar dependências com `new`;
- conhecer detalhes de persistência.

---

### Service como fronteira de caso de uso

O controller receberá:

```text
RuntimeMessageService.
```

por construtor.

A chamada será:

```java
RuntimeMessageResult result =
        runtimeMessageService.generate();
```

O nome exato do método deve seguir a implementação construída na aula 361.

Se a baseline usa outro nome equivalente, adapte uma vez e documente.

Não duplique regra no controller.

---

### Query string introdutoria

Uma URI pode possuir query:

```text
/api/v1/runtime/greeting?name=Thiago.
```

O par:

```text
name=Thiago
```

é um query parameter.

Em Spring MVC, `@RequestParam` pode ligar esse valor a um parâmetro Java.

Nesta aula, isso será implementado somente no exercício.

O conteúdo oficial da baseline permanece sem parâmetros.

---

### Nenhum RequestBody ainda

`@RequestBody` transforma conteúdo do body em objeto Java.

Esse mecanismo exige discutir:

- media type de entrada;
- desserialização;
- campos;
- erros;
- validação.

Por isso, não será usado nesta aula.

---

### Nenhum PathVariable ainda

`@PathVariable` extrai partes do caminho.

Exemplo futuro:

```text
/api/v1/resources/{id}.
```

Ele será estudado junto com request body e request param na aula 365.

---

### Teste unitario do controller

O controller pode ser criado manualmente com um service fake ou mock.

Esse teste valida:

- delegação;
- mapping mecânico;
- ausência de contexto obrigatório.

Ele não valida toda a infraestrutura MVC.

Por isso, não substitui o teste MockMvc.

---

### MockMvc

`MockMvc` executa o fluxo Spring MVC usando request e response simulados.

Ele não inicia um servidor HTTP real.

Com ele, você valida:

- mapping;
- status;
- headers;
- content type;
- body;
- JSON;
- integração controller e MVC.

Ele é mais rápido que um teste de servidor real.

---

### @WebMvcTest

`@WebMvcTest` carrega uma slice da camada MVC.

Nesta versão do Boot, o import é:

```java
org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
```

O teste especificará:

```java
@WebMvcTest(
        RuntimeMessageController.class
)
```

O service será substituído por mock.

A slice não precisa carregar lifecycle labs, repositories reais ou toda a aplicação.

---

### @MockitoBean

A substituição do service no contexto de teste será feita com:

```java
@MockitoBean
private RuntimeMessageService runtimeMessageService;
```

O import atual é:

```java
org.springframework.test.context.bean.override.mockito.MockitoBean
```

O mock permite definir um resultado determinístico.

Use mock na borda da slice.

Não use mock para substituir tudo em testes de integração.

---

### MockMvc assertions

O teste fará:

```text
perform GET;

andExpect status;

andExpect content type;

andExpect body;

andExpect jsonPath.
```

Também verificará que o service foi chamado uma vez no endpoint JSON.

O ping não deve chamar o service.

---

### Servidor real

Um segundo teste utilizará:

```java
@SpringBootTest(
        webEnvironment =
                SpringBootTest.WebEnvironment.RANDOM_PORT
)
```

Ele inicia Tomcat em uma porta aleatória.

O teste usará:

```java
@LocalServerPort
```

para descobrir a porta.

O cliente será:

```text
java.net.http.HttpClient.
```

Assim, a requisição percorre uma conexão HTTP real.

---

### Random port

Porta aleatória evita:

- conflito com 8080;
- conflito entre testes;
- dependência da máquina;
- instâncias concorrentes.

O contrato não depende do número da porta.

O teste monta a URI dinamicamente.

---

### MockMvc versus servidor real

MockMvc:

- sem socket real;
- rápido;
- foco MVC;
- bom para mappings e JSON.

Servidor real:

- Tomcat real;
- socket real;
- serialização real;
- configuração integrada;
- maior custo.

A estratégia profissional usa os dois em proporção adequada.

---

### Rota desconhecida

O teste:

```text
GET /api/v1/nao-existe
```

deve retornar:

```text
404.
```

Não será implementado tratamento customizado.

A estrutura de erros da API será criada em aula futura.

---

### Logs HTTP basicos

O profile:

```text
web-lab
```

habilitará logs somente para infraestrutura relevante.

Exemplo:

```yaml
logging:
  level:
    org.springframework.web.servlet.DispatcherServlet: "DEBUG"
    org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping: "TRACE"
    br.com.formacao.backend.web: "DEBUG"
```

Não ative TRACE para todo o Spring.

Não registre bodies indiscriminadamente.

---

### curl como evidencia

`curl` permite validar manualmente:

- status;
- headers;
- body;
- content type.

No Windows, use:

```text
curl.exe
```

para evitar conflito com aliases do PowerShell.

Testes automatizados continuam obrigatórios.

Curl não substitui a suite.

---

## Mao na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs\m14\aula-357-spring-initializr-estrutura-projeto\formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 2. Confirmar o starter web

No `pom.xml`, confirme:

```text
spring-boot-starter-webmvc.
```

Não adicione WebFlux.

Não adicione outro servidor.

---

### 3. Criar package web

Crie:

```text
br.com.formacao.backend.web.controller;

br.com.formacao.backend.web.response.
```

Não coloque controller dentro do package de service.

---

### 4. Criar RuntimeMessageResponse

Crie o record:

```java
public record RuntimeMessageResponse(
        Instant generatedAt,
        String formatterId,
        List<String> messages
) {

    public RuntimeMessageResponse {
        Objects.requireNonNull(
                generatedAt
        );

        Objects.requireNonNull(
                formatterId
        );

        messages =
                List.copyOf(
                        messages
                );
    }

    public static RuntimeMessageResponse from(
            RuntimeMessageResult result
    ) {
        return new RuntimeMessageResponse(
                result.generatedAt(),
                result.formatterId(),
                result.messages()
        );
    }
}
```

Ajuste os accessors ao record real da aula 361.

---

### 5. Criar RuntimeMessageController

Estrutura:

```java
@RestController
@RequestMapping(
        "/api/v1/runtime"
)
public class RuntimeMessageController {

    private final RuntimeMessageService
            runtimeMessageService;

    public RuntimeMessageController(
            RuntimeMessageService
                    runtimeMessageService
    ) {
        this.runtimeMessageService =
                Objects.requireNonNull(
                        runtimeMessageService
                );
    }
}
```

Um único construtor, sem `@Autowired`.

---

### 6. Criar endpoint ping

Adicione:

```java
@GetMapping(
        path = "/ping",
        produces = MediaType.TEXT_PLAIN_VALUE
)
public String ping() {
    return "pong";
}
```

Não chame service.

Não transforme em health check de produção.

---

### 7. Criar endpoint runtime

Adicione:

```java
@GetMapping(
        produces =
                MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<RuntimeMessageResponse>
        runtimeMessages() {

    RuntimeMessageResult result =
            runtimeMessageService.generate();

    RuntimeMessageResponse response =
            RuntimeMessageResponse.from(
                    result
            );

    return ResponseEntity.ok(
            response
    );
}
```

Adapte o nome `generate()` se a baseline utiliza outro.

---

### 8. Criar application-web-lab.yaml

```yaml
logging:
  level:
    org.springframework.web.servlet.DispatcherServlet: "DEBUG"
    org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping: "TRACE"
    br.com.formacao.backend.web: "DEBUG"
```

Não ative o profile no arquivo base.

---

### 9. Executar a aplicação

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local,web-lab"
```

Confirme nos logs que mappings foram registrados.

---

### 10. Testar ping

Em outro terminal:

```powershell
curl.exe `
  -i `
  http://localhost:8081/api/v1/runtime/ping
```

Com profile dev do grupo local, a porta esperada é 8081.

Resultado:

```text
HTTP 200;

Content-Type text/plain compatível;

pong.
```

---

### 11. Testar JSON

```powershell
curl.exe `
  -i `
  http://localhost:8081/api/v1/runtime
```

Confirme:

- 200;
- application/json;
- generatedAt;
- formatterId;
- messages.

Não compare a data manualmente como texto fixo.

---

### 12. Testar rota desconhecida

```powershell
curl.exe `
  -i `
  http://localhost:8081/api/v1/nao-existe
```

Resultado:

```text
404.
```

Não crie handler customizado.

---

### 13. Criar RuntimeMessageControllerUnitTest

Use Mockito ou fakes.

Cenário ping:

- instancie controller;
- confirme `pong`;
- confirme zero interação com service.

Cenário runtime:

- prepare result fixo;
- configure service;
- chame método;
- confirme status 200;
- confirme body;
- confirme delegação única.

Esse teste não valida annotations MVC.

---

### 14. Criar RuntimeMessageControllerWebMvcTest

Use:

```java
@WebMvcTest(
        RuntimeMessageController.class
)
class RuntimeMessageControllerWebMvcTest {
}
```

Injete:

```java
MockMvc mockMvc;
```

Declare:

```java
@MockitoBean
RuntimeMessageService runtimeMessageService;
```

Use um resultado determinístico.

---

### 15. Testar ping com MockMvc

Execute:

```text
GET /api/v1/runtime/ping.
```

Valide:

- status 200;
- text/plain compatível;
- body pong;
- service sem interação.

---

### 16. Testar JSON com MockMvc

Execute:

```text
GET /api/v1/runtime.
```

Valide:

```text
status 200;

application/json;

generatedAt;

formatterId;

messages[0];

tamanho da lista.
```

Verifique uma chamada ao service.

---

### 17. Testar media type declarado

Envie header:

```text
Accept: application/json
```

para o endpoint JSON.

Valide sucesso.

Não aprofunde negociação de conteúdo ou 406 nesta aula.

Registre apenas a observação.

---

### 18. Criar UnknownRouteWebMvcTest

Use MockMvc.

Valide:

```text
GET /api/v1/unknown
    -> 404.
```

Não faça assert do body de erro padrão.

Esse contrato mudará quando o tratamento de erros for implementado.

---

### 19. Criar RuntimeMessageControllerLiveServerIT

Use:

```java
@SpringBootTest(
        webEnvironment =
                SpringBootTest.WebEnvironment.RANDOM_PORT
)
```

Campo:

```java
@LocalServerPort
int port;
```

Crie `HttpClient`.

Monte:

```text
http://localhost:{port}/api/v1/runtime/ping.
```

Valide status, header e body.

---

### 20. Testar JSON com servidor real

No mesmo teste ou classe separada:

- chame endpoint JSON;
- valide 200;
- valide content type;
- valide presença dos campos;
- não fixe instant atual;
- confirme que o JSON é estruturalmente válido por assertions simples.

Evite duplicar todos os testes MockMvc.

O objetivo do teste real é provar integração de socket, Tomcat e serialização.

---

### 21. Criar RuntimeMessageJsonContractIT

Use MockMvc para validar os nomes públicos:

```text
generatedAt;

formatterId;

messages.
```

Confirme ausência de campos internos.

Não serialize `RuntimeMessageService`, repository ou classes de infraestrutura.

---

### 22. Criar RuntimeMessageControllerArchitectureTest

Valide:

- classe possui `@RestController`;
- possui `@RequestMapping`;
- construtor único;
- field final;
- nenhuma field do tipo repository;
- nenhuma field `ApplicationContext`;
- nenhum field `EntityManager`;
- métodos públicos esperados;
- zero `@PostMapping`;
- zero `@PutMapping`;
- zero `@DeleteMapping`;
- response record sem stereotype.

---

### 23. Validar controller fino por source

Pesquise o package web.

Falhe se encontrar:

```text
getBean(;

new RuntimeMessageRepository;

EntityManager;

JdbcTemplate;

@Transactional;

catch (Exception;

Thread.sleep.
```

Use esse teste como proteção didática.

Não trate busca textual como análise arquitetural completa.

---

### 24. Criar spring-mvc-request-flow.md

Desenhe:

```text
curl
-> Tomcat
-> DispatcherServlet
-> HandlerMapping
-> Controller
-> Service
-> Response record
-> Message converter
-> HTTP response.
```

---

### 25. Criar controller-restcontroller.md

Compare:

- `@Controller`;
- `@ResponseBody`;
- `@RestController`;
- view versus body;
- API versus template.

---

### 26. Criar request-mapping-first-endpoints.md

Documente:

- class-level path;
- method-level path;
- GET;
- prefixo `/api`;
- versão `/v1`;
- paths finais;
- produces.

---

### 27. Criar response-body-and-json.md

Explique:

- String;
- record;
- message converter;
- JSON;
- lista;
- instant;
- por que não montar JSON manual;
- por que não expor objetos internos.

---

### 28. Criar response-entity.md

Registre:

```text
status;

headers;

body;

ok();

uso necessário;

retorno direto.
```

Mantenha exemplos somente com 200.

---

### 29. Criar thin-controller.md

Crie checklist:

```text
sem repository;

sem SQL;

sem transação manual;

sem regra de negócio;

sem Service Locator;

sem catch genérico;

com constructor injection;

com delegação;

com adaptação de response.
```

---

### 30. Criar mockmvc-vs-live-server.md

Compare:

```text
MockMvc:
sem socket.

live server:
Tomcat e HTTP reais.

unit:
método Java direto.
```

Inclua objetivo e custo de cada nível.

---

### 31. Criar first-api-contract.md

Documente o contrato:

```text
GET /api/v1/runtime/ping;

GET /api/v1/runtime.
```

Para cada um:

- entrada;
- status;
- content type;
- body;
- dependências;
- testes.

---

### 32. Criar curl-evidence.md

Registre comandos e resultados resumidos.

Não copie logs completos.

Não registre dados sensíveis.

---

### 33. Criar scripts

`33_iniciar_web_lab.ps1` inicia profiles local e web-lab.

`34_testar_ping.ps1` executa curl e valida status.

`35_testar_runtime_json.ps1` executa curl para JSON.

`36_executar_testes_mvc.ps1` executa testes unitários e MockMvc.

`37_executar_teste_servidor_real.ps1` executa a integração com random port.

`38_validar_controller_fino.ps1` executa testes arquiteturais.

---

### 34. Executar testes MVC

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageControllerUnitTest,RuntimeMessageControllerWebMvcTest,UnknownRouteWebMvcTest test
```

Resultado:

```text
BUILD SUCCESS.
```

---

### 35. Executar teste live server

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageControllerLiveServerIT test
```

Confirme porta aleatória e contexto fechado.

---

### 36. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam continuar verdes.

---

### 37. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 38. Executar o jar

```powershell
java -jar target\*.jar `
  --spring.profiles.active=local,web-lab
```

Repita curl.

Encerre com `Ctrl+C`.

Confirme shutdown gracioso das aulas anteriores.

---

### 39. Revisar escopo

Confirme:

```text
@RestController:
um.

@GetMapping:
dois.

@PostMapping:
zero.

@RequestBody:
zero.

@PathVariable:
zero.

@RequestParam em produção:
zero.

controller acessando repository:
zero.

controller acessando contexto:
zero.

persistência:
ausente.
```

---

### 40. Revisar Git

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- target;
- logs;
- respostas curl temporárias;
- porta fixa de teste;
- endpoint do exercício;
- controller com regra;
- arquivo contendo dados sensíveis.

---

## Entendendo o que foi feito

### O servidor ganhou handlers reais

O 404 da raiz deixou de ser a única evidência da camada web.

### O controller permaneceu uma fronteira

Ele adaptou HTTP e delegou ao service.

### Java virou representacao HTTP

String gerou texto; record gerou JSON.

### ResponseEntity tornou o envelope explicito

Status e body ficaram visíveis no código.

### Os testes cobriram niveis diferentes

Unitário, MockMvc e servidor real cumpriram objetivos distintos.

---

## Erros comuns importantes

### Colocar repository no controller

A camada web passa a conhecer persistência e casos de uso ficam espalhados.

### Retornar JSON montado por string

Escaping, tipos e evolução do contrato ficam frágeis.

### Expor objeto interno diretamente

Mudanças da aplicação quebram o contrato HTTP.

### Usar SpringBootTest para todo teste

A suite fica lenta e sem foco.

### Considerar curl como teste suficiente

A evidência manual não protege regressões automaticamente.

---

## Comandos uteis

### Iniciar aplicação

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local,web-lab"
```

### Ping

```powershell
curl.exe -i `
  http://localhost:8081/api/v1/runtime/ping
```

### JSON

```powershell
curl.exe -i `
  http://localhost:8081/api/v1/runtime
```

### Testes MVC

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageControllerWebMvcTest test
```

### Live server

```powershell
.\mvnw.cmd `
  -Dtest=RuntimeMessageControllerLiveServerIT test
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Greeting com query

Crie temporariamente:

```text
GET /api/v1/runtime/greeting?name=Thiago.
```

Use um `@RequestParam` com default:

```text
backend.
```

Retorne um record:

```text
GreetingResponse.
```

Mantenha a lógica trivial.

Aprofundamento ficará para a aula 365.

### Parte 2 — Accept

Envie:

```text
Accept: application/json.
```

ao endpoint JSON.

Depois envie um tipo incompatível.

Observe o comportamento sem criar tratamento customizado.

### Parte 3 — Controller direto

Teste `ping()` chamando o método Java.

Compare com MockMvc.

Explique o que cada teste não cobre.

### Parte 4 — Record

Adicione temporariamente um campo `module`.

Observe o contrato e os testes.

Remova antes do commit oficial.

### Parte 5 — ResponseEntity

Retorne o response direto em uma fixture.

Compare com `ResponseEntity.ok`.

Não altere a baseline.

### Parte 6 — Path

Mude temporariamente o prefixo para `/runtime`.

Observe os testes falharem.

Restaure `/api/v1/runtime`.

### Parte 7 — Anti-pattern

Crie em teste uma fixture que chama repository diretamente.

Faça o teste arquitetural rejeitá-la.

Remova a fixture.

### Parte 8 — ADR

Registre:

```text
@RestController;

prefixo /api/v1;

GET para leitura inicial;

response records;

controller fino;

ResponseEntity quando envelope precisar ser explicito;

MockMvc para slice;

random port para servidor real;

sem request body e path variable nesta aula.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- continuidade com a aula 362 foi preservada;
- o mesmo projeto foi continuado;
- camada web foi definida;
- fluxo MVC foi explicado;
- Tomcat foi posicionado no fluxo;
- DispatcherServlet foi explicado;
- HandlerMapping foi explicado;
- HandlerAdapter foi explicado;
- controller foi tratado como fronteira;
- `@Controller` foi explicado;
- `@ResponseBody` foi explicado;
- `@RestController` foi usado;
- composição de RestController foi explicada;
- RestController não foi confundido com REST completo;
- `@RequestMapping` foi usado na classe;
- prefixo `/api/v1/runtime` foi criado;
- `@GetMapping` foi usado;
- endpoint ping foi criado;
- endpoint runtime foi criado;
- endpoint textual retornou pong;
- endpoint textual produziu text/plain compatível;
- endpoint JSON chamou service;
- endpoint JSON produziu application/json compatível;
- status 200 foi validado;
- outros status não foram aprofundados;
- prefixo `/api` foi explicado;
- versão `/v1` foi explicada;
- estratégia de versionamento não foi aprofundada;
- endpoint foi definido como método, caminho, entrada e saída;
- `produces` foi usado;
- negociação de conteúdo não foi aprofundada;
- RuntimeMessageResponse foi criado;
- response é record;
- response não é bean;
- lista foi copiada;
- factory `from` foi criada;
- mapping permaneceu mecânico;
- RuntimeMessageResult não foi exposto diretamente;
- nenhuma entity foi exposta;
- serialização JSON foi explicada;
- JSON não foi montado manualmente;
- message converter foi explicado;
- `ResponseEntity` foi usado;
- status, headers e body foram explicados;
- headers customizados não foram antecipados;
- ping retornou valor direto;
- endpoint principal retornou ResponseEntity;
- controller possui constructor injection;
- construtor único não usa Autowired;
- field do service é final;
- controller não possui repository;
- controller não possui ApplicationContext;
- controller não possui EntityManager;
- controller não cria dependências com new;
- controller não contém SQL;
- controller não contém transação manual;
- controller não captura Exception genérica;
- controller não possui regra de negócio;
- query string foi introduzida;
- `@RequestParam` ficou no exercício;
- `@RequestBody` não foi usado;
- `@PathVariable` não foi usado;
- POST não foi criado;
- PUT não foi criado;
- PATCH não foi criado;
- DELETE não foi criado;
- application-web-lab.yaml foi criado;
- web-lab não foi ativado por padrão;
- logs ficaram filtrados;
- body não foi logado indiscriminadamente;
- aplicação foi executada;
- ping foi testado por curl;
- JSON foi testado por curl;
- rota desconhecida retornou 404;
- body de erro padrão não virou contrato;
- RuntimeMessageControllerUnitTest foi criado;
- teste unitário não carregou contexto;
- ping não chamou service;
- endpoint JSON chamou service uma vez;
- RuntimeMessageControllerWebMvcTest foi criado;
- package atual de WebMvcTest foi usado;
- `@MockitoBean` foi usado;
- package atual de MockitoBean foi usado;
- MockMvc foi injetado;
- status foi testado;
- content type foi testado;
- body textual foi testado;
- jsonPath foi usado;
- Accept JSON foi observado;
- UnknownRouteWebMvcTest foi criado;
- MockMvc não foi confundido com servidor real;
- RuntimeMessageControllerLiveServerIT foi criado;
- RANDOM_PORT foi usado;
- LocalServerPort foi usado;
- Java HttpClient foi usado;
- socket real foi exercitado;
- Tomcat real foi exercitado;
- porta fixa não foi usada no teste;
- contexto foi fechado;
- RuntimeMessageJsonContractIT foi criado;
- nomes públicos foram validados;
- campos internos ficaram ausentes;
- RuntimeMessageControllerArchitectureTest foi criado;
- annotations foram validadas;
- métodos inesperados foram rejeitados;
- teste didático de controller fino foi criado;
- documentação do fluxo foi criada;
- Controller versus RestController foi documentado;
- mappings foram documentados;
- body e JSON foram documentados;
- ResponseEntity foi documentada;
- controller fino foi documentado;
- MockMvc versus servidor real foi documentado;
- primeiro contrato foi documentado;
- evidências curl foram documentadas;
- scripts foram criados;
- testes MVC passaram;
- teste live server passou;
- suite completa passou;
- package passou;
- jar executou;
- shutdown gracioso continuou funcionando;
- nenhum banco foi adicionado;
- JPA não foi adicionado;
- Flyway não foi adicionado;
- Security não foi adicionada;
- Validation não foi adicionada;
- tratamento global de erros não foi antecipado;
- HTTP profundo da aula 364 não foi antecipado;
- request binding da aula 365 não foi antecipado;
- ponte para a aula 364 está correta;
- commit recomendado pode ser realizado;
- diário de bordo está pronto.

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
git commit -m "feat(m14): criar primeiros endpoints rest"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- target;
- logs;
- resposta curl temporária;
- endpoint de exercício;
- porta fixa de teste;
- controller com repository;
- arquivos contendo dados sensíveis.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a aplicação passou a oferecer os primeiros contratos HTTP.

O fluxo consolidado ficou:

```text
cliente;

Tomcat;

DispatcherServlet;

mapping;

RuntimeMessageController;

RuntimeMessageService;

RuntimeMessageResponse;

message converter;

resposta HTTP.
```

Você criou:

```text
GET /api/v1/runtime/ping
    -> text/plain
    -> 200
    -> pong.

GET /api/v1/runtime
    -> application/json
    -> 200
    -> response record.
```

Você comprovou:

```text
@RestController registrado;

mappings encontrados;

service delegado;

controller fino;

JSON serializado;

ResponseEntity usado;

MockMvc verde;

Tomcat em porta aleatoria;

curl funcionando;

rota desconhecida 404.
```

A decisão central foi:

```text
controller deve adaptar o protocolo
e delegar o caso de uso,
sem absorver regra de negocio
ou acesso a dados.
```

A próxima aula será:

```text
364 - M14.09 - HTTP e REST de verdade
```

Nela, você continuará no mesmo projeto e estudará:

- protocolo HTTP;
- request e response;
- método;
- URI;
- path;
- query;
- headers;
- body;
- representação;
- recursos;
- operações;
- GET;
- POST;
- PUT;
- PATCH;
- DELETE;
- safety;
- idempotência;
- status codes;
- media types;
- content negotiation;
- `Accept`;
- `Content-Type`;
- cache;
- headers;
- desenho de URI;
- Richardson Maturity Model;
- REST versus RPC;
- contrato e compatibilidade.

A aula 363 respondeu:

```text
como criar os primeiros endpoints
e manter o controller fino?
```

A aula 364 responderá:

```text
o que torna um contrato HTTP
coerente, previsivel e verdadeiramente RESTful?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei explicar o fluxo de uma requisição Spring MVC.
- [ ] Sei criar um `@RestController` com mappings explícitos.
- [ ] Sei devolver texto e JSON.
- [ ] Sei manter controller fino.
- [ ] Sei diferenciar MockMvc de teste com servidor real.

---

## Troubleshooting adicional

### Endpoint retorna 404

Revise package, component scan, mapping de classe, mapping de método e caminho usado.

### Endpoint retorna 500

Leia a causa raiz do service e da serialização; não esconda com catch genérico.

### JSON nao aparece

Revise starter web, message converter, tipo de retorno e media type produzido.

### WebMvcTest nao inicia

Revise dependências do controller e declare mocks somente para colaboradores necessários.

### Live server usa porta errada

Use `@LocalServerPort` e monte a URI dinamicamente.

### Controller chama repository

Mova a operação para o service e mantenha a fronteira web.

---

## Perguntas de revisao

1. Qual é a função da camada web?
2. O que faz o DispatcherServlet?
3. O que faz HandlerMapping?
4. O que é `@RestController`?
5. Qual diferença para `@Controller`?
6. Para que serve `@RequestMapping`?
7. Para que serve `@GetMapping`?
8. O que compõe um endpoint?
9. O que significa `produces`?
10. Como String vira resposta?
11. Como record vira JSON?
12. Por que criar response próprio?
13. O que representa ResponseEntity?
14. O que caracteriza controller fino?
15. MockMvc abre servidor real?
16. O que `@WebMvcTest` carrega?
17. Para que serve `@MockitoBean`?
18. Por que usar RANDOM_PORT?
19. RequestBody foi usado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Adaptar HTTP para a aplicação.
2. Coordenar requests MVC.
3. Localizar o handler.
4. Controller com body por padrão.
5. Controller pode trabalhar com views.
6. Definir mapping compartilhado.
7. Mapear GET.
8. Método, caminho, entrada, saída e media type.
9. Formato produzido.
10. Message converter textual.
11. Message converter JSON.
12. Separar contrato web do modelo interno.
13. Status, headers e body.
14. Delegação e adaptação.
15. Não.
16. Slice MVC.
17. Substituir colaborador por mock.
18. Evitar conflito e testar servidor real.
19. Não.
20. HTTP e REST de verdade.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 363 - M14.08 - Controller REST primeiros endpoints

- Continuei no projeto `formacao-java-backend-api`.
- Iniciei a camada web da aplicação.
- Entendi o fluxo cliente, Tomcat, DispatcherServlet e controller.
- Entendi o papel de HandlerMapping e HandlerAdapter.
- Diferenciei `@Controller` de `@RestController`.
- Entendi que `@RestController` inclui resposta no body.
- Usei `@RequestMapping` no nível da classe.
- Usei o prefixo `/api/v1/runtime`.
- Criei o endpoint `GET /ping`.
- Retornei `pong` como texto puro.
- Declarei `text/plain`.
- Criei o endpoint `GET /api/v1/runtime`.
- Chamei `RuntimeMessageService`.
- Mantive o controller fino.
- Criei `RuntimeMessageResponse`.
- Mantive o response fora do container.
- Adaptei `RuntimeMessageResult` para o contrato web.
- Entendi serialização JSON.
- Evitei montar JSON manualmente.
- Usei `ResponseEntity`.
- Retornei status 200.
- Declarei `application/json`.
- Não acessei repository no controller.
- Não usei ApplicationContext no controller.
- Não criei request body ou path variable.
- Introduzi query string somente no exercício.
- Criei profile `web-lab` para logs controlados.
- Testei os endpoints com curl.
- Confirmei 404 para rota desconhecida.
- Criei teste unitário do controller.
- Criei slice com `@WebMvcTest`.
- Usei `MockMvc`.
- Usei `@MockitoBean` para o service.
- Validei status, content type e JSON.
- Criei teste com Tomcat em porta aleatória.
- Usei `@LocalServerPort`.
- Usei Java `HttpClient`.
- Diferenciei MockMvc de servidor real.
- Criei testes arquiteturais para controller fino.
- Mantive POST, PUT, PATCH e DELETE fora do escopo.
- Próxima aula: HTTP e REST de verdade.
```

---

## Referencia tecnica curta

```text
RestController:
body HTTP.

RequestMapping:
prefixo.

GetMapping:
GET.

Controller:
fronteira.

Service:
caso de uso.

Response record:
contrato.

ResponseEntity:
envelope HTTP.

MockMvc:
MVC sem socket.

Random port:
servidor real.

Curl:
evidencia manual.
```

Regra final:

```text
os primeiros endpoints Spring MVC devem possuir mappings explicitos, responses proprios e testes em camadas; RestController adapta HTTP, delega o caso de uso ao service e devolve texto, objetos serializaveis ou ResponseEntity sem acessar repository, container ou infraestrutura de persistencia, enquanto MockMvc valida a slice MVC e um teste em porta aleatoria comprova a integracao real com o servidor embarcado.
```
