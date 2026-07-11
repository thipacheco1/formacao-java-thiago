# 359 - M14.04 - Application properties YAML e profiles

## Apresentacao da aula

Na aula 358, você executou conscientemente a primeira aplicação Spring Boot da formação.

O fluxo observado foi:

```text
JVM;

main;

SpringApplication.run;

Environment;

ApplicationContext;

component scan;

auto-configuration;

Tomcat;

porta 8080;

aplicação pronta.
```

Você também comprovou:

```text
@SpringBootApplication decomposta;

aplicação do tipo SERVLET;

classe principal no package raiz;

probe interno encontrado;

probe externo ignorado;

condition report disponível;

positive matches;

negative matches;

back-off;

encerramento correto.
```

Até agora, a aplicação utilizou os defaults do Spring Boot.

A porta foi:

```text
8080.
```

Nenhum profile foi ativado.

O arquivo:

```text
src/main/resources/application.properties
```

permaneceu vazio.

Agora surge a próxima pergunta:

```text
como alterar o comportamento da aplicacao
sem fixar valores no codigo
e sem gerar um build diferente por ambiente?
```

A resposta passa pela configuração externa do Spring Boot.

O mesmo artefato deve ser capaz de executar em:

- desenvolvimento;
- teste;
- homologação;
- produção;
- máquina local;
- container;
- pipeline.

O código não deve ser recompilado apenas porque:

- a porta mudou;
- o nome do ambiente mudou;
- o nível de log mudou;
- uma URL externa mudou;
- um timeout mudou;
- uma funcionalidade diagnóstica foi habilitada.

Nesta aula, você estudará:

- `application.properties`;
- `application.yaml`;
- sintaxe de propriedades;
- estrutura hierárquica YAML;
- listas;
- valores escalares;
- placeholders;
- valores padrão;
- `Environment`;
- fontes de propriedades;
- precedência;
- command-line arguments;
- Java system properties;
- variáveis de ambiente;
- arquivos externos;
- `spring.config.location`;
- `spring.config.additional-location`;
- `optional:`;
- profiles;
- profile padrão;
- `spring.profiles.active`;
- `spring.profiles.include`;
- grupos de profiles;
- arquivos específicos por profile;
- documentos YAML ativados;
- `@ConfigurationProperties`;
- relaxed binding;
- configuração tipada;
- `Duration`;
- listas;
- diagnóstico de origem;
- proteção de dados sensíveis;
- testes de configuração.

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A decisão editorial e técnica da formação será:

```text
formato final carregado:
YAML.

exemplos de properties:
somente em docs/examples,
fora do classpath.
```

O Spring Boot aceita properties e YAML.

Entretanto, misturar os dois formatos no mesmo local dificulta descobrir qual valor venceu.

Quando os dois existem no mesmo local, o formato `.properties` possui precedência.

Por isso, a aplicação terminará a aula com:

```text
application.yaml;

application-dev.yaml;

application-test.yaml;

application-prod.yaml;

application-diagnostics.yaml.
```

O arquivo `application.properties` será removido depois que a equivalência for documentada.

Os profiles serão:

```text
dev;

test;

prod;

diagnostics.
```

Também será criado o grupo:

```text
local
    -> dev
    -> diagnostics.
```

Nenhum profile será ativado permanentemente no arquivo principal.

A execução local será explícita:

```powershell
--spring.profiles.active=local
```

Essa decisão evita que a aplicação assuma silenciosamente um ambiente.

A aula também criará uma configuração tipada:

```text
AppRuntimeProperties.
```

Ela agrupará propriedades próprias sob o prefixo:

```text
app.runtime.
```

Os dados incluirão:

- nome lógico do ambiente;
- URL pública;
- timeout;
- origens permitidas;
- flag de diagnóstico.

O binding será feito com:

```text
@ConfigurationProperties.
```

O uso de `@Value` será apresentado apenas para comparação.

Para grupos de configuração próprios, o padrão do curso será:

```text
@ConfigurationProperties.
```

Nesta aula, você não criará:

- controller;
- endpoint;
- service de negócio;
- repository;
- entity;
- banco;
- Flyway;
- validação Bean Validation;
- Security;
- Actuator.

A próxima aula será:

```text
360 - M14.05 - Beans Component Service Repository Configuration
```

Por isso, o estudo de stereotypes, declaração genérica de beans e organização de configurações ficará para a aula seguinte.

---

## Onde estamos na formacao

A sequência inicial do M14 está assim:

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
Beans, Component, Service, Repository e Configuration.

361:
constructor injection.

362:
lifecycle de beans.
```

A aula 358 respondeu:

```text
como o Boot inicia?
```

A aula 359 responderá:

```text
como o Environment recebe valores
e como ambientes diferentes alteram comportamento?
```

Nesta aula:

```text
application.properties:
sim, como sintaxe e exemplo.

application.yaml:
sim, como formato final.

precedência:
sim.

variáveis de ambiente:
sim.

system properties:
sim.

command-line:
sim.

arquivos externos:
sim.

profiles:
sim.

profile groups:
sim.

@ConfigurationProperties:
sim.

configuração tipada:
sim.

segredos:
sim.

beans genéricos:
não.

@Component:
não.

@Service:
não.

@Repository:
não.

@Configuration aprofundada:
não.

controller:
não.

endpoint:
não.
```

O objetivo não é criar dezenas de propriedades.

O objetivo é compreender:

```text
origem;

nome;

tipo;

precedência;

ativação;

diagnóstico;

segurança.
```

---

## Objetivo pratico

Você continuará no mesmo projeto:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A estrutura será ampliada para:

```text
formacao-java-backend-api
├── pom.xml
├── src
│   ├── main
│   │   ├── java
│   │   │   └── br
│   │   │       └── com
│   │   │           └── formacao
│   │   │               └── backend
│   │   │                   ├── FormacaoJavaBackendApiApplication.java
│   │   │                   ├── bootstrap
│   │   │                   │   ├── ApplicationContextSnapshot.java
│   │   │                   │   ├── BootstrapDiagnostics.java
│   │   │                   │   └── RootPackageProbe.java
│   │   │                   └── properties
│   │   │                       ├── AppRuntimeProperties.java
│   │   │                       ├── ConfigurationOriginSnapshot.java
│   │   │                       └── RuntimeConfigurationDiagnostics.java
│   │   └── resources
│   │       ├── application.yaml
│   │       ├── application-dev.yaml
│   │       ├── application-test.yaml
│   │       ├── application-prod.yaml
│   │       └── application-diagnostics.yaml
│   └── test
│       └── java
│           └── br
│               └── com
│                   └── formacao
│                       └── backend
│                           ├── BaseConfigurationIT.java
│                           ├── DevProfileIT.java
│                           ├── TestProfileIT.java
│                           ├── ProdProfileIT.java
│                           ├── ProfileGroupIT.java
│                           ├── PropertyPrecedenceIT.java
│                           ├── ExternalConfigurationIT.java
│                           ├── ConfigurationPropertiesBindingIT.java
│                           └── SensitiveConfigurationPolicyTest.java
└── target
```

A pasta externa da aula receberá:

```text
docs
├── examples
│   ├── application.properties.example
│   └── application-multidocument.yaml.example
├── properties-vs-yaml.md
├── property-source-precedence.md
├── external-config-locations.md
├── profiles.md
├── configuration-properties.md
├── sensitive-data-policy.md
└── configuration-baseline.md

scripts
├── 11_iniciar_base.ps1
├── 12_iniciar_dev.ps1
├── 13_iniciar_local_group.ps1
├── 14_iniciar_prod.ps1
├── 15_demonstrar_precedencia.ps1
├── 16_executar_testes_configuracao.ps1
└── 17_validar_segredos.ps1
```

Resultados esperados:

```text
formato carregado:
YAML.

profile base:
nenhum ativo.

profile dev:
ativado explicitamente.

profile test:
usado nos testes.

profile prod:
exige URL externa.

profile local:
ativa dev e diagnostics.

server port base:
8080.

server port dev:
8081.

server port test:
aleatória ou zero no teste.

server port prod:
variável de ambiente com default operacional definido.

logging base:
INFO.

logging dev:
DEBUG para package da aplicação.

logging test:
WARN.

logging prod:
INFO.

typed binding:
válido.

Duration:
convertida.

List:
convertida.

command-line:
vence arquivo.

test property:
vence configuração carregada no teste.

secret:
não commitado.
```

---

## Conceito essencial

### Configuracao externa

Configuração externa permite usar o mesmo código em ambientes diferentes.

Fontes incluem:

```text
default properties;

arquivos de configuração;

variáveis de ambiente;

system properties;

SPRING_APPLICATION_JSON;

argumentos de linha de comando;

propriedades de teste.
```

As fontes formam uma ordem.

Fontes posteriores podem sobrescrever fontes anteriores.

A pergunta correta não é apenas:

```text
qual é o valor?
```

Também é:

```text
qual fonte forneceu o valor vencedor?
```

---

### Environment

O Spring `Environment` reúne:

- profiles ativos;
- profiles padrão;
- property sources;
- resolução de placeholders;
- conversão simples de valores.

Exemplo de leitura:

```java
String applicationName =
        environment.getProperty(
                "spring.application.name"
        );
```

O `Environment` é útil para diagnóstico e infraestrutura.

Para um grupo próprio de propriedades, prefira binding tipado.

---

### application.properties

Properties utiliza pares:

```properties
spring.application.name=formacao-java-backend-api
server.port=8080
app.runtime.environment-name=base
```

Vantagens:

- formato direto;
- diff simples;
- uma propriedade por linha;
- familiaridade;
- baixa ambiguidade de indentação.

Limitações:

- hierarquias repetem prefixos;
- listas ficam menos visuais;
- estruturas grandes ficam extensas.

---

### application.yaml

YAML representa hierarquias:

```yaml
spring:
  application:
    name: formacao-java-backend-api

server:
  port: 8080

app:
  runtime:
    environment-name: base
```

O Spring converte a hierarquia para chaves planas.

Exemplo:

```text
app.runtime.environment-name.
```

YAML é uma forma de escrever propriedades.

O `Environment` continua trabalhando com chaves.

---

### Indentacao YAML

YAML depende de indentação.

Regras práticas:

- use espaços;
- não use tab;
- mantenha dois espaços por nível;
- alinhe elementos irmãos;
- revise listas;
- use aspas quando o valor puder ser interpretado de forma inesperada.

Exemplo de lista:

```yaml
app:
  runtime:
    allowed-origins:
      - "http://localhost:3000"
      - "http://localhost:4200"
```

---

### YAML e tipos aparentes

YAML diferencia escalares, listas e mapas.

Use aspas quando o valor precisar permanecer textual.

O binder realizará a conversão final para o tipo Java.

---

### Escolher um formato

O projeto final usará YAML.

A documentação oficial recomenda manter um formato único na aplicação.

Se `.properties` e YAML estiverem no mesmo local, `.properties` tem precedência.

Por isso:

```text
application.properties:
removido de src/main/resources.

application.properties.example:
mantido somente em docs/examples.
```

O exemplo não entra no classpath.

---

### Property source order

O Boot considera diversas fontes.

Uma visão resumida relevante para o laboratório é:

```text
defaults programáticos;

@PropertySource;

config data;

random.*;

variáveis de ambiente;

system properties;

SPRING_APPLICATION_JSON;

command-line arguments;

propriedades de teste.
```

A lista completa possui outras fontes relacionadas a servlet, JNDI, DevTools e testes.

A regra central é:

```text
fonte de maior precedência vence.
```

---

### Ordem dentro de config data

Arquivos são considerados em camadas.

Ordem conceitual:

```text
application dentro do jar;

application de profile dentro do jar;

application externo;

application de profile externo.
```

Arquivos externos permitem alterar o comportamento sem reconstruir o jar.

Arquivos específicos de profile sobrescrevem os valores base quando o profile está ativo.

---

### Command-line arguments

Argumentos com `--` viram propriedades.

Exemplo:

```powershell
java -jar app.jar `
  --server.port=9090
```

O argumento vence o valor do arquivo.

Isso é útil para execução pontual.

Não use command-line para expor segredo em ambientes onde a linha de comando pode ser observada.

---

### Java system properties

System property usa `-D` antes de `-jar`:

```powershell
java `
  -Dserver.port=9091 `
  -jar app.jar
```

A posição importa para a JVM.

Não confunda com:

```text
--server.port.
```

Um é system property.

O outro é argumento convertido pelo Boot.

---

### Variaveis de ambiente

Variáveis de ambiente são comuns em containers e pipelines.

Conversão canônica:

```text
app.runtime.public-base-url
```

para:

```text
APP_RUNTIME_PUBLICBASEURL
```

Regras:

1. trocar pontos por underscores;
2. remover hífens;
3. converter para maiúsculas.

Outro exemplo:

```text
server.port
    -> SERVER_PORT.
```

Use nomes documentados.

Não dependa de variações acidentais.

---

### SPRING_APPLICATION_JSON

`SPRING_APPLICATION_JSON` permite fornecer um bloco JSON como property source.

Ele será apenas reconhecido, não adotado como fonte principal do laboratório.

---

### Placeholders

Valores podem referenciar outras propriedades:

```yaml
app:
  runtime:
    public-base-url: "${APP_PUBLIC_BASE_URL:http://localhost:8080}"
```

Sintaxe:

```text
${nome:valor-padrao}.
```

O placeholder deve usar nome canônico em kebab-case quando possível.

Não use default para segredo obrigatório de produção.

---

### Valores padrao

Default é apropriado quando existe um valor seguro.

Exemplos:

```text
porta local;

timeout de laboratório;

flag diagnóstica false.
```

Default não é apropriado para:

- senha;
- token;
- chave privada;
- credencial de produção;
- URL obrigatória sem alternativa segura.

O profile `prod` exigirá:

```text
APP_PUBLIC_BASE_URL.
```

Sem essa variável, a inicialização deverá falhar.

Fail fast é melhor que iniciar com uma URL incorreta.

---

### Localizacoes padrao

O Boot procura `application.properties` e `application.yaml` em locais como:

```text
classpath root;

classpath /config;

diretório atual;

diretório ./config;

subdiretórios imediatos de ./config.
```

Localizações externas possuem maior precedência conforme a ordem de config data.

---

### spring.config.location

`spring.config.location` substitui as localizações padrão.

Exemplo conceitual:

```powershell
--spring.config.location=file:./runtime-config/
```

Use com cuidado.

Ao substituir, arquivos internos podem deixar de ser carregados.

---

### spring.config.additional-location

`spring.config.additional-location` adiciona localizações.

Exemplo:

```powershell
--spring.config.additional-location=optional:file:./runtime-config/
```

Essa opção preserva os defaults e acrescenta overrides.

Será a opção preferida no experimento externo.

---

### optional:

Uma localização declarada e inexistente normalmente pode impedir o startup.

O prefixo:

```text
optional:
```

permite ausência.

Use quando o arquivo é realmente opcional.

Não use para esconder arquivo obrigatório de produção.

---

### spring.config.import

Arquivos carregados podem importar outra configuração.

Exemplo conceitual:

```yaml
spring:
  config:
    import: "optional:file:./secrets/runtime.yaml"
```

Esse mecanismo será documentado, mas não será usado para armazenar segredo real no repositório.

---

### Profile

Profile representa um conjunto de configuração ativado sob um nome.

Exemplos:

```text
dev;

test;

prod;

diagnostics.
```

Profile não deve representar cada desenvolvedor.

Evite:

```text
profile-thiago;

profile-maria;

profile-pc-casa.
```

Diferenças pessoais devem vir de configuração externa ignorada ou variáveis.

---

### Profile ativo

Ativação por argumento:

```powershell
--spring.profiles.active=dev
```

Também pode vir de outras property sources.

A maior precedência vence.

Não fixe:

```text
spring.profiles.active=prod
```

dentro de arquivo de produção.

A escolha do ambiente pertence ao deploy.

---

### Profile padrao

Sem profile ativo, o Spring utiliza:

```text
default.
```

O nome pode ser alterado com:

```text
spring.profiles.default.
```

Nesta formação, o default implícito será mantido.

A aplicação base precisa iniciar sem profile, com valores neutros.

---

### Restricao de active e default

As propriedades:

```text
spring.profiles.active;

spring.profiles.default.
```

só podem ficar em documento não específico de profile.

Não coloque dentro de:

```text
application-dev.yaml;

documento ativado por on-profile.
```

Um profile não deve escolher outro por meio de uma propriedade inválida nesse contexto.

---

### Arquivos especificos

Formato:

```text
application-{profile}.yaml.
```

Exemplos:

```text
application-dev.yaml;

application-test.yaml;

application-prod.yaml.
```

Quando o profile está ativo:

1. base é carregada;
2. arquivo específico é carregado;
3. valores específicos sobrescrevem base.

---

### spring.profiles.include

`spring.profiles.include` acrescenta profiles.

Ele não substitui os profiles ativos.

Pode ser útil para configuração comum.

Entretanto, ativações implícitas demais dificultam diagnóstico.

O projeto explicará `include`, mas usará profile group para o cenário local.

Assim como `active`, `include` deve ficar em documento não específico de profile.

---

### Profile groups

Grupo dá um nome lógico a vários profiles.

Base:

```yaml
spring:
  profiles:
    group:
      local:
        - "dev"
        - "diagnostics"
```

Executar:

```powershell
--spring.profiles.active=local
```

ativa:

```text
local;

dev;

diagnostics.
```

O grupo deve ser definido no documento base, não em arquivo específico.

---

### Multi-document YAML

Um arquivo YAML pode conter documentos separados por:

```yaml
---
```

Documentos posteriores podem sobrescrever anteriores.

Um documento pode ser condicionado:

```yaml
spring:
  config:
    activate:
      on-profile: "dev"
```

O projeto final usará arquivos separados por profile.

O exemplo multi-document ficará apenas em:

```text
docs/examples.
```

Arquivos separados tornam a baseline mais simples de revisar.

---

### @ConfigurationProperties

`@ConfigurationProperties` liga um grupo de chaves a um objeto Java.

Exemplo:

```java
@ConfigurationProperties(
        "app.runtime"
)
public record AppRuntimeProperties(
        String environmentName,
        URI publicBaseUrl,
        Duration requestTimeout,
        List<String> allowedOrigins,
        Diagnostics diagnostics
) {

    public record Diagnostics(
            boolean enabled
    ) {
    }
}
```

Benefícios:

- tipo;
- agrupamento;
- relaxed binding;
- metadata;
- estrutura;
- conversão;
- teste.

---

### Registro das properties

A classe principal usará:

```java
@ConfigurationPropertiesScan
```

Ela localizará as classes tipadas abaixo do package raiz.

Beans em geral serão aprofundados na aula 360.

---

### Relaxed binding

O binder aceita variações.

Exemplo de propriedade Java:

```text
environmentName.
```

Chave recomendada:

```text
app.runtime.environment-name.
```

Em YAML e properties, prefira:

```text
kebab-case em minúsculas.
```

O prefixo da annotation também deve usar kebab-case.

---

### Tipos suportados no laboratorio

O record utilizará:

```text
String;

URI;

Duration;

List<String>;

record aninhado;

boolean.
```

Exemplos:

```yaml
request-timeout: 3s
```

e:

```yaml
request-timeout: 500ms
```

O binder converte para `Duration`.

Não faça parsing manual.

---

### @Value versus @ConfigurationProperties

`@Value` é útil para valor isolado.

Exemplo:

```java
@Value(
        "${spring.application.name}"
)
```

Para um grupo próprio, `@ConfigurationProperties` oferece:

- relaxed binding;
- metadata;
- objeto estruturado;
- melhor teste.

A aula não adicionará um componente apenas para demonstrar `@Value`.

A comparação será documental.

---

### Configuration processor

Adicione ao POM:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

Ele gera metadata para ferramentas.

Não fixe versão.

---

### Listas e override

Listas não são mescladas item por item como regra geral.

Quando uma fonte de maior precedência define a lista, ela pode substituir a lista inteira.

Por isso, teste:

```text
allowed-origins.
```

Não assuma que o profile apenas acrescentará itens.

---

### Dados sensiveis

Não versione:

- senha;
- token;
- API key;
- certificado privado;
- segredo JWT;
- credencial de banco.

Use:

- variável de ambiente;
- secret manager;
- arquivo externo protegido;
- configuração do pipeline;
- config tree quando apropriado.

O projeto terá um teste de política para detectar padrões evidentes.

Esse teste ajuda, mas não substitui secret scanning profissional.

---

### Diagnostico sem vazar segredo

O relatório de configuração imprimirá apenas:

- profiles;
- porta;
- nome da aplicação;
- nome do ambiente;
- URL pública;
- timeout;
- quantidade de origens;
- flag diagnóstica;
- nomes das fontes relevantes.

Nunca imprima:

- password;
- token;
- chave;
- conteúdo completo de Environment.

---

### Propriedade de teste

Testes podem fornecer propriedades por:

- `@SpringBootTest(properties = ...)`;
- `@DynamicPropertySource`;
- `@TestPropertySource`;
- profile específico.

Essas fontes possuem alta precedência.

Use valores explícitos para tornar testes determinísticos.

---

### Origem de propriedade

O Boot mantém informações de origem para config data.

O snapshot registrará a fonte vencedora somente para propriedades seguras, sem acoplar testes a nomes internos completos.

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

O build precisa estar verde.

---

### 2. Criar exemplo properties

Na pasta externa:

```text
docs/examples/application.properties.example.
```

Conteúdo equivalente à base:

```properties
spring.application.name=formacao-java-backend-api
server.port=${SERVER_PORT:8080}
app.runtime.environment-name=base
app.runtime.public-base-url=${APP_PUBLIC_BASE_URL:http://localhost:8080}
app.runtime.request-timeout=3s
app.runtime.allowed-origins[0]=http://localhost:3000
app.runtime.diagnostics.enabled=false
logging.level.root=INFO
logging.level.br.com.formacao.backend=INFO
```

Esse arquivo não entra no classpath.

---

### 3. Substituir properties por YAML

Remova:

```text
src/main/resources/application.properties.
```

Crie:

```text
src/main/resources/application.yaml.
```

Base:

```yaml
spring:
  application:
    name: "formacao-java-backend-api"
  profiles:
    group:
      local:
        - "dev"
        - "diagnostics"

server:
  port: "${SERVER_PORT:8080}"

app:
  runtime:
    environment-name: "base"
    public-base-url: "${APP_PUBLIC_BASE_URL:http://localhost:8080}"
    request-timeout: "3s"
    allowed-origins:
      - "http://localhost:3000"
    diagnostics:
      enabled: false

logging:
  level:
    root: "INFO"
    br.com.formacao.backend: "INFO"
```

---

### 4. Criar application-dev.yaml

```yaml
server:
  port: "${SERVER_PORT:8081}"

app:
  runtime:
    environment-name: "development"
    public-base-url: "${APP_PUBLIC_BASE_URL:http://localhost:8081}"
    request-timeout: "2s"
    allowed-origins:
      - "http://localhost:3000"
      - "http://localhost:4200"

logging:
  level:
    br.com.formacao.backend: "DEBUG"
```

A lista substitui a lista base.

---

### 5. Criar application-test.yaml

```yaml
server:
  port: 0

app:
  runtime:
    environment-name: "test"
    public-base-url: "http://localhost"
    request-timeout: "500ms"
    allowed-origins:
      - "http://test.invalid"
    diagnostics:
      enabled: false

logging:
  level:
    root: "WARN"
    br.com.formacao.backend: "WARN"
```

O valor zero solicita porta aleatória quando servidor real é criado.

---

### 6. Criar application-prod.yaml

```yaml
server:
  port: "${SERVER_PORT:8080}"

app:
  runtime:
    environment-name: "production"
    public-base-url: "${APP_PUBLIC_BASE_URL}"
    request-timeout: "${APP_REQUEST_TIMEOUT:5s}"
    allowed-origins: []
    diagnostics:
      enabled: false

logging:
  level:
    root: "INFO"
    br.com.formacao.backend: "INFO"
```

Sem `APP_PUBLIC_BASE_URL`, o startup prod deve falhar.

---

### 7. Criar application-diagnostics.yaml

```yaml
app:
  runtime:
    diagnostics:
      enabled: true

logging:
  level:
    br.com.formacao.backend.properties: "DEBUG"
```

Esse profile não abre endpoint.

Ele altera somente diagnóstico interno.

---

### 8. Adicionar configuration processor

Atualize o POM com a dependência opcional.

Recarregue Maven.

Execute:

```powershell
.\mvnw.cmd clean compile
```

Confirme metadata em:

```text
target/classes/META-INF/spring-configuration-metadata.json.
```

---

### 9. Criar AppRuntimeProperties.java

Package:

```text
br.com.formacao.backend.properties.
```

Use record imutável.

Campos:

```text
environmentName;

publicBaseUrl;

requestTimeout;

allowedOrigins;

diagnostics.
```

No construtor compacto:

- copie a lista;
- rejeite valores nulos críticos;
- não implemente Bean Validation;
- mantenha mensagens claras.

---

### 10. Ativar scan de properties

Na classe principal, adicione:

```java
@ConfigurationPropertiesScan
```


---

### 11. Criar ConfigurationOriginSnapshot.java

Record:

```java
public record ConfigurationOriginSnapshot(
        String propertyName,
        String resolvedValue,
        String sourceName
) {
}
```

Use apenas para propriedades não sensíveis.

---

### 12. Criar RuntimeConfigurationDiagnostics.java

Responsabilidades:

- receber `Environment`;
- receber `AppRuntimeProperties`;
- obter profiles ativos;
- obter profiles padrão;
- montar resumo;
- localizar fonte relevante;
- imprimir valores seguros.

Não percorra todas as properties.

Não imprima variáveis do sistema.

---

### 13. Integrar ao diagnóstico existente

Depois do bootstrap, chame:

```text
RuntimeConfigurationDiagnostics.
```

O acesso pelo contexto continua restrito ao laboratório.

Na aula 360, a organização por beans será aprofundada.

---

### 14. Executar sem profile

```powershell
.\mvnw.cmd spring-boot:run
```

Confirme:

```text
active profiles:
nenhum.

environment:
base.

port:
8080.

diagnostics:
false.
```

Encerre.

---

### 15. Executar dev

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=dev"
```

Confirme:

```text
profile:
dev.

environment:
development.

port:
8081.

timeout:
2s.

origins:
2.

logging:
DEBUG para package.
```

---

### 16. Executar grupo local

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

Confirme:

```text
profiles:
local, dev, diagnostics.

environment:
development.

diagnostics:
true.
```


---

### 17. Executar prod com variavel

No PowerShell:

```powershell
$env:APP_PUBLIC_BASE_URL =
  "https://api.exemplo.invalid"

$env:SERVER_PORT =
  "8090"

.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=prod"
```

Confirme:

```text
environment:
production.

port:
8090.

public URL:
variável.

diagnostics:
false.
```

Depois limpe:

```powershell
Remove-Item Env:APP_PUBLIC_BASE_URL
Remove-Item Env:SERVER_PORT
```

---

### 18. Confirmar falha prod

Sem `APP_PUBLIC_BASE_URL`:

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=prod"
```

A aplicação deve falhar por placeholder não resolvido.

Registre a causa.

Não adicione default inseguro.

---

### 19. Demonstrar command-line override

Empacote:

```powershell
.\mvnw.cmd clean package
```

Execute:

```powershell
java -jar target\*.jar `
  --spring.profiles.active=dev `
  --server.port=9090 `
  --app.runtime.environment-name=command-line
```

Confirme que command-line venceu o YAML dev.

---

### 20. Demonstrar system property

```powershell
java `
  -Dserver.port=9091 `
  -jar target\*.jar `
  --spring.profiles.active=dev
```

Confirme a porta.

Depois compare com command-line adicional.

O argumento `--server.port` deve vencer a system property.

---

### 21. Demonstrar arquivo externo

Crie temporariamente:

```text
runtime-config/application.yaml.
```

Conteúdo:

```yaml
app:
  runtime:
    environment-name: "external-file"

server:
  port: 9093
```

Execute:

```powershell
java -jar target\*.jar `
  --spring.config.additional-location=optional:file:./runtime-config/
```

Confirme o override.

Remova a pasta temporária antes do commit.

---

### 22. Criar BaseConfigurationIT

Use `@SpringBootTest`.

Confirme:

- nenhum profile explícito;
- nome da aplicação;
- ambiente base;
- porta configurada no Environment;
- timeout 3 segundos;
- uma origem;
- diagnóstico false.

Não abra servidor real.

---

### 23. Criar DevProfileIT

Use:

```java
@ActiveProfiles("dev")
```

Confirme:

- dev ativo;
- porta 8081;
- timeout 2 segundos;
- duas origens;
- environmentName development.

---

### 24. Criar TestProfileIT

Use:

```java
@ActiveProfiles("test")
```

Confirme:

- ambiente test;
- timeout 500 ms;
- logging configurado;
- diagnóstico false.

---

### 25. Criar ProdProfileIT

Ative `prod`.

Forneça:

```text
APP_PUBLIC_BASE_URL equivalente
por propriedade de teste.
```

Não tente alterar variável de ambiente do processo.

Confirme o binding de URI e timeout.

---

### 26. Criar ProfileGroupIT

Ative:

```text
local.
```

Confirme que:

```text
dev;

diagnostics
```

também estão ativos.

Confirme ambiente development e diagnóstico true.

---

### 27. Criar PropertyPrecedenceIT

Use propriedades de teste para sobrescrever:

```text
server.port;

app.runtime.environment-name;

app.runtime.request-timeout.
```

Confirme que vencem os arquivos.

Crie outro teste com `ApplicationContextRunner` ou `SpringApplication` para comparar system property e command-line sem poluir a JVM inteira.

Restaure propriedades no `finally`.

---

### 28. Criar ExternalConfigurationIT

Crie diretório temporário com `application.yaml`.

Inicie aplicação em modo `NONE` com:

```text
spring.config.additional-location.
```

Confirme:

- arquivo externo carregado;
- base interna preservada;
- override aplicado;
- contexto fechado;
- diretório removido.

---

### 29. Criar ConfigurationPropertiesBindingIT

Confirme tipos:

```text
URI;

Duration;

List;

boolean.
```

Confirme lista imutável.

Confirme relaxed binding por propriedade de teste em formato alternativo.

Mantenha a chave canônica nos arquivos reais.

---

### 30. Criar SensitiveConfigurationPolicyTest

Leia:

```text
src/main/resources.
```

Falhe se encontrar padrões evidentes:

```text
password com valor literal;

token com valor literal;

secret com valor literal;

private key.
```

Permita placeholders.

Não trate o teste como ferramenta completa de segurança.

---

### 31. Criar exemplo multi-document

Em:

```text
docs/examples/application-multidocument.yaml.example.
```

Mostre:

```yaml
app:
  runtime:
    environment-name: "base-example"
---
spring:
  config:
    activate:
      on-profile: "dev"
app:
  runtime:
    environment-name: "dev-example"
```

Não carregue esse arquivo.

---

### 32. Criar scripts

`11_iniciar_base.ps1` executa sem profile.

`12_iniciar_dev.ps1` ativa dev.

`13_iniciar_local_group.ps1` ativa local.

`14_iniciar_prod.ps1` exige variáveis e falha claramente quando ausentes.

`15_demonstrar_precedencia.ps1` executa arquivo, environment e command-line em sequência.

`16_executar_testes_configuracao.ps1` executa os testes da aula.

`17_validar_segredos.ps1` pesquisa padrões antes do commit.

---

### 33. Criar properties-vs-yaml.md

Compare:

- sintaxe;
- hierarquia;
- listas;
- risco de indentação;
- precedência quando misturados;
- decisão do projeto.

---

### 34. Criar property-source-precedence.md

Registre a ordem relevante.

Inclua uma tabela:

```text
fonte;

valor;

resultado;

motivo.
```

Use o experimento da porta.

---

### 35. Criar external-config-locations.md

Explique:

- locais padrão;
- location;
- additional-location;
- optional;
- import;
- arquivo externo;
- uso em deploy.

---

### 36. Criar profiles.md

Documente:

- active;
- default;
- include;
- group;
- profile-specific file;
- on-profile;
- restrições;
- comando de ativação.

---

### 37. Criar configuration-properties.md

Documente:

- prefixo;
- record;
- tipos;
- relaxed binding;
- metadata;
- processor;
- comparação com `@Value`.

---

### 38. Criar sensitive-data-policy.md

Defina:

```text
nenhum segredo no Git;

nenhum segredo em log;

variáveis para laboratório;

secret manager em produção;

fail fast para obrigatório;

rotação quando houver vazamento.
```

---

### 39. Criar configuration-baseline.md

Registre os valores finais de cada profile.

Não inclua segredo.

Inclua comandos reproduzíveis.

---

### 40. Executar a suite

```powershell
.\mvnw.cmd clean test
```

Confirme:

```text
todos os contexts fechados;

nenhuma porta presa;

profiles determinísticos;

binding válido;

policy verde.
```

---

### 41. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme jar executável.

---

### 42. Revisar Git

Na raiz:

```powershell
git status
git diff
git diff --check
```

Confirme ausência de:

- runtime-config;
- segredo;
- target;
- log;
- arquivo local;
- application.properties carregado;
- profile pessoal.

---

## Entendendo o que foi feito

### O comportamento saiu do codigo

Porta, timeout, URL e logging passaram a vir do Environment.

### YAML virou o formato oficial

Properties foi mantido somente como exemplo documental.

### Profiles ficaram explicitos

Nenhum ambiente foi ativado silenciosamente.

### A precedencia foi comprovada

Arquivo, ambiente, system property, command-line e teste foram comparados.

### A configuracao ganhou tipo

URI, Duration, lista e flag deixaram de ser strings espalhadas.

---

## Erros comuns importantes

### Manter properties e YAML juntos

Pode esconder qual arquivo venceu.

### Ativar prod dentro de application-prod

A propriedade active não deve ficar em documento específico.

### Colocar senha com default

A aplicação pode iniciar insegura.

### Usar profile por pessoa

Ambientes ficam impossíveis de reproduzir.

### Imprimir o Environment inteiro

Segredos e dados internos podem vazar.

---

## Comandos uteis

### Base

```powershell
.\mvnw.cmd spring-boot:run
```

### Dev

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=dev"
```

### Grupo local

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

### Jar com profile

```powershell
java -jar target\*.jar `
  --spring.profiles.active=dev
```

### Environment

```powershell
$env:SERVER_PORT = "8090"
Remove-Item Env:SERVER_PORT
```

### Testes

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Conversao

Converta o YAML base para properties.

Compare visualmente.

Não carregue os dois.

### Parte 2 — Precedencia

Defina a porta em:

```text
base;

dev;

environment;

system property;

command-line.
```

Preveja e confirme o vencedor.

### Parte 3 — Profile group

Crie grupo temporário:

```text
qa
    -> test
    -> diagnostics.
```

Teste e remova.

### Parte 4 — Lista

Sobrescreva `allowed-origins` em dev.

Confirme que a lista inteira foi substituída.

### Parte 5 — External file

Crie arquivo externo temporário.

Use additional-location.

Remova ao final.

### Parte 6 — Fail fast

Ative prod sem URL obrigatória.

Explique por que a falha é desejável.

### Parte 7 — @Value

Escreva um exemplo documental para uma propriedade isolada.

Compare com o record tipado.

### Parte 8 — ADR

Registre:

```text
YAML como formato único;

profiles ativados pelo deploy;

grupo local;

configuração tipada;

kebab-case;

sem segredo no Git;

command-line vence arquivo;

additional-location para override externo.
```

---

## Criterios de aceite

- arquivo e H1 seguem a grade oficial;
- continuidade com a aula 358 foi preservada;
- o mesmo projeto foi continuado;
- configuração externa foi explicada;
- Environment foi explicado;
- application.properties foi ensinado;
- application.yaml foi ensinado;
- sintaxe properties foi mostrada;
- sintaxe YAML foi mostrada;
- hierarquia YAML foi explicada;
- listas YAML foram explicadas;
- indentação foi explicada;
- tabs foram evitados;
- tipos aparentes foram discutidos;
- formato final único foi definido;
- YAML foi adotado;
- properties ficou somente em exemplo externo;
- mistura no mesmo local foi evitada;
- precedência de properties sobre YAML no mesmo local foi explicada;
- property source order foi explicado;
- config data order foi explicado;
- arquivo interno foi explicado;
- arquivo externo foi explicado;
- profile-specific externo foi explicado;
- command-line foi usado;
- system property foi usada;
- variável de ambiente foi usada;
- `SPRING_APPLICATION_JSON` foi apresentado;
- placeholders foram usados;
- valor padrão foi usado com critério;
- segredo sem default foi exigido;
- kebab-case foi usado;
- conversão para environment variable foi explicada;
- pontos viraram underscores;
- hífens foram removidos;
- maiúsculas foram usadas;
- localizações padrão foram explicadas;
- `spring.config.location` foi explicado;
- efeito de substituição foi explicado;
- `spring.config.additional-location` foi usado;
- `optional:` foi explicado;
- `spring.config.import` foi apresentado;
- profile foi explicado;
- profile por pessoa foi rejeitado;
- dev foi criado;
- test foi criado;
- prod foi criado;
- diagnostics foi criado;
- profile base iniciou sem active explícito;
- profile default foi explicado;
- `spring.profiles.active` foi explicado;
- `spring.profiles.default` foi explicado;
- restrição de active/default foi explicada;
- arquivos específicos foram criados;
- base carregou antes do profile;
- profile sobrescreveu base;
- `spring.profiles.include` foi explicado;
- restrição de include foi explicada;
- profile group foi criado;
- grupo local ativou dev e diagnostics;
- grupo foi definido no documento base;
- multi-document YAML foi explicado;
- `spring.config.activate.on-profile` foi explicado;
- exemplo multi-document ficou fora do classpath;
- `@ConfigurationProperties` foi usado;
- configuração tipada foi criada;
- record imutável foi usado;
- prefixo `app.runtime` foi usado;
- `@ConfigurationPropertiesScan` foi adicionado;
- bean genérico não foi aprofundado;
- relaxed binding foi explicado;
- prefixo usou kebab-case;
- URI foi convertida;
- Duration foi convertida;
- List foi convertida;
- record aninhado foi convertido;
- lista foi copiada;
- `@Value` foi comparado;
- `@Value` não foi usado para grupo próprio;
- configuration processor foi adicionado;
- versão do processor não foi fixada;
- metadata foi gerada;
- override de lista foi testado;
- dados sensíveis foram protegidos;
- segredo não foi logado;
- Environment inteiro não foi impresso;
- diagnóstico exibiu somente valores seguros;
- origem foi registrada com baixo acoplamento;
- base foi executada;
- dev foi executado;
- local group foi executado;
- prod foi executado com variável;
- prod falhou sem variável obrigatória;
- command-line sobrescreveu YAML;
- system property foi comparada;
- command-line venceu system property;
- arquivo externo sobrescreveu interno;
- diretório temporário foi removido;
- BaseConfigurationIT foi criado;
- DevProfileIT foi criado;
- TestProfileIT foi criado;
- ProdProfileIT foi criado;
- ProfileGroupIT foi criado;
- PropertyPrecedenceIT foi criado;
- ExternalConfigurationIT foi criado;
- ConfigurationPropertiesBindingIT foi criado;
- SensitiveConfigurationPolicyTest foi criado;
- testes não dependeram da ordem;
- system properties foram restauradas;
- contexts foram fechados;
- portas foram liberadas;
- scripts foram criados;
- properties versus YAML foi documentado;
- precedência foi documentada;
- config location foi documentada;
- profiles foram documentados;
- configuration properties foi documentada;
- política de segredo foi documentada;
- baseline foi documentada;
- clean test passou;
- package passou;
- jar continuou executável;
- nenhum controller foi criado;
- nenhum endpoint foi criado;
- nenhum service de negócio foi criado;
- nenhum repository foi criado;
- nenhum banco foi adicionado;
- Flyway não foi adicionado;
- Validation não foi adicionada;
- Security não foi adicionada;
- Actuator não foi adicionado;
- stereotypes da aula 360 não foram antecipados;
- ponte para a aula 360 está correta;
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
git commit -m "feat(m14): configurar properties yaml e profiles"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- segredo;
- runtime-config;
- target;
- log;
- profile pessoal;
- arquivo temporário.

---

## Fechamento e ponte para a proxima aula

Nesta aula, você retirou valores operacionais do código e os colocou no sistema de configuração do Spring Boot.

O mapa consolidado foi:

```text
Environment:
conjunto de fontes.

application.yaml:
configuração base.

application-{profile}.yaml:
override por ambiente.

environment variable:
override de deploy.

system property:
override da JVM.

command-line:
override pontual de alta precedência.

@ConfigurationProperties:
binding tipado.

profile group:
ativação composta.
```

Você comprovou:

```text
base sem profile;

dev na porta 8081;

test com configuração isolada;

prod dependente de variável;

local ativando dev e diagnostics;

command-line vencendo arquivo;

arquivo externo sobrescrevendo interno;

Duration convertida;

URI convertida;

lista convertida;

segredos ausentes.
```

A decisão principal foi:

```text
o mesmo jar deve mudar de comportamento
por configuracao externa,
nao por alteracao de codigo.
```

A próxima aula será:

```text
360 - M14.05 - Beans Component Service Repository Configuration
```

Nela, você continuará no mesmo projeto e estudará:

- o que é bean;
- BeanFactory e ApplicationContext;
- bean definition;
- nome e tipo;
- descoberta por component scan;
- `@Component`;
- `@Service`;
- `@Repository`;
- `@Configuration`;
- `@Bean`;
- stereotypes;
- tradução de exceptions em repository;
- configuração explícita;
- factory methods;
- proxy de configuration;
- conflito de nomes;
- múltiplos candidatos;
- introspecção do contexto;
- organização de packages;
- testes de registro;
- fronteiras entre infraestrutura e negócio.

A aula 359 respondeu:

```text
como controlar o comportamento
por ambiente e por fonte?
```

A aula 360 responderá:

```text
quais objetos o container administra
e como eles entram no ApplicationContext?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei comparar properties e YAML.
- [ ] Sei prever a precedência das fontes.
- [ ] Sei criar e ativar profiles.
- [ ] Sei usar binding tipado.
- [ ] Sei manter dados sensíveis fora do Git.

---

## Troubleshooting adicional

### YAML nao carrega

Revise nome, extensão, indentação e localização.

### Dev nao sobrescreve base

Confirme profile ativo e nome `application-dev.yaml`.

### Variavel nao vence

Revise conversão do nome e processo que recebeu a variável.

### Prod inicia sem URL

Revise placeholder e fonte de maior precedência.

### Lista possui itens inesperados

Lembre que a lista de maior precedência substitui a anterior.

### Metadata nao foi gerada

Revise processor, compile e package da classe de properties.

---

## Perguntas de revisao

1. O que é configuração externa?
2. O que o Environment contém?
3. Properties e YAML podem representar a mesma chave?
4. Qual formato o projeto adotou?
5. O que ocorre se os dois estiverem no mesmo local?
6. Qual fonte vence: arquivo ou command-line?
7. Como `server.port` vira variável?
8. O que é placeholder?
9. Quando evitar default?
10. O que faz additional-location?
11. O que significa optional?
12. O que é profile?
13. Qual é o profile padrão?
14. Onde active pode ser declarado?
15. O que é profile group?
16. O que faz on-profile?
17. Para que serve `@ConfigurationProperties`?
18. O que é relaxed binding?
19. Por que usar Duration?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Valores fora do código.
2. Profiles e property sources.
3. Sim.
4. YAML.
5. Properties tem precedência.
6. Command-line.
7. `SERVER_PORT`.
8. Referência `${nome:default}`.
9. Para segredo obrigatório.
10. Acrescenta localizações.
11. Ausência não impede startup.
12. Conjunto nomeado de configuração.
13. `default`.
14. Em documento não específico.
15. Nome lógico para vários profiles.
16. Ativa documento por profile.
17. Binding tipado.
18. Variações de nomes aceitas.
19. Evita parsing manual.
20. Beans Component Service Repository Configuration.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 359 - M14.04 - Application properties YAML e profiles

- Continuei no projeto `formacao-java-backend-api`.
- Entendi configuração externa.
- Aprofundei o `Environment`.
- Comparei `application.properties` e `application.yaml`.
- Adotei YAML como formato final único.
- Mantive properties somente como exemplo fora do classpath.
- Entendi hierarquia e listas YAML.
- Evitei tabs e mistura de formatos.
- Estudei a ordem das property sources.
- Estudei a ordem dos arquivos de config data.
- Usei placeholders e valores padrão.
- Usei variáveis de ambiente.
- Usei Java system properties.
- Usei command-line arguments.
- Comparei a precedência das fontes.
- Conheci `SPRING_APPLICATION_JSON`.
- Conheci localizações padrão.
- Diferenciei `spring.config.location` de `additional-location`.
- Usei `optional:`.
- Conheci `spring.config.import`.
- Criei profiles `dev`, `test`, `prod` e `diagnostics`.
- Mantive ativação explícita.
- Entendi o profile `default`.
- Entendi as restrições de `spring.profiles.active`.
- Estudei `spring.profiles.include`.
- Criei o grupo `local`.
- Conheci multi-document YAML e `on-profile`.
- Criei `AppRuntimeProperties`.
- Usei `@ConfigurationProperties`.
- Usei `@ConfigurationPropertiesScan`.
- Usei record imutável.
- Converti URI, Duration, lista e boolean.
- Entendi relaxed binding e kebab-case.
- Comparei `@ConfigurationProperties` com `@Value`.
- Adicionei o configuration processor.
- Testei base, profiles e precedência.
- Testei configuração externa.
- Protegi dados sensíveis.
- Não criei controllers, services ou repositories.
- Próxima aula: Beans Component Service Repository Configuration.
```

---

## Referencia tecnica curta

```text
Environment:
fontes.

Properties:
chave-valor.

YAML:
hierarquia.

Profile:
ambiente.

Group:
profiles compostos.

Placeholder:
valor externo.

Precedence:
fonte vencedora.

ConfigurationProperties:
tipo.

Environment variable:
deploy.

Secret:
fora do Git.
```

Regra final:

```text
a configuracao de uma aplicacao Spring Boot deve permanecer externa ao codigo, possuir fontes e precedencia conhecidas, usar um unico formato de arquivo por local, ativar profiles explicitamente, manter segredos fora do repositorio e agrupar propriedades proprias em objetos tipados com ConfigurationProperties; o mesmo jar deve executar em ambientes diferentes por meio de config data, variaveis, system properties e argumentos observaveis e testados.
```
