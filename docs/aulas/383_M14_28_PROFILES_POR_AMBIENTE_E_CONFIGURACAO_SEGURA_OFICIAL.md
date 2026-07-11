# 383 - M14.28 - Profiles por ambiente e configuracao segura

## Apresentacao da aula

Na aula 382, a API passou a possuir duas major versions públicas.

A estrutura atual oferece:

```text
/api/v1/runtime/managed-messages;

/api/v2/runtime/managed-messages.
```

A v1 continua compatível.

A v2 publica o novo contrato.

O ciclo de vida da v1 utiliza:

```text
Deprecation;

Sunset;

Link rel="deprecation";

Link rel="sunset";

Link rel="successor-version".
```

Na baseline anterior, as datas e URIs foram mantidas em um bean de laboratório para tornar o comportamento determinístico.

Essa decisão foi adequada para estudar versionamento.

Ela não é adequada para executar o mesmo artefato em ambientes diferentes.

Considere quatro ambientes:

```text
local;

test;

hml;

production.
```

Eles podem precisar de valores distintos para:

- URL do PostgreSQL;
- usuário do banco;
- senha;
- porta HTTP;
- exposição de OpenAPI;
- endereço público da API;
- datas de depreciação;
- links de migração;
- tamanho do pool;
- timeouts;
- flags operacionais.

Copiar o código e editar constantes para cada ambiente seria um erro.

Criar quatro branches permanentes também seria um erro.

Gerar um jar diferente com credenciais embutidas seria ainda pior.

A pergunta central desta aula será:

```text
como executar o mesmo artefato
em ambientes diferentes
sem hardcode,
sem vazar secrets
e sem criar comportamento ambiguo?
```

A solução utilizará:

```text
externalized configuration;

Config Data;

application.yaml;

profile-specific files;

profile groups;

environment variables;

spring.config.import;

configuration trees;

@ConfigurationProperties;

Bean Validation;

fail fast;

testes de precedencia.
```

O mesmo jar continuará sendo produzido.

A configuração será fornecida externamente.

Exemplo:

```text
mesmo:
application.jar.

diferente:
profiles e property sources.
```

A baseline utilizará os ambientes lógicos:

```text
local;

test;

hml;

production.
```

O nome:

```text
prod
```

não será usado como alias paralelo.

Uma aplicação com `prod` e `production` sem regra clara cria dúvidas em automações, testes e suporte.

Profiles técnicos já existentes serão agrupados.

Exemplo:

```text
local:
persistence-lab;
openapi-lab;
lifecycle-local.

hml:
persistence-external;
openapi-controlled;
lifecycle-external.

production:
persistence-external;
openapi-disabled;
lifecycle-external.
```

O consumidor ativa somente o ambiente lógico.

Exemplo:

```powershell
--spring.profiles.active=local
```

O group ativa os fragments relacionados.

A configuração base utilizará:

```yaml
spring:
  profiles:
    default: none
```

Isso evita que um profile operacional seja escolhido silenciosamente.

A aplicação somente terá valores seguros e universais no arquivo base.

Ela não conterá:

- senha;
- token;
- hostname privado;
- URL de produção;
- credencial local;
- chave;
- secret;
- data operacional inventada;
- profile ativo.

A configuração customizada será vinculada a records tipados.

Exemplos:

```text
ApplicationEnvironmentProperties;

ApiLifecycleProperties;

OpenApiExposureProperties.
```

A conexão do banco continuará usando as properties oficiais:

```text
spring.datasource.url;

spring.datasource.username;

spring.datasource.password.
```

A senha não será copiada para um bean customizado apenas para demonstrar binding.

Isso reduz o risco de:

- `toString` acidental;
- logging do record;
- serialização;
- exposição em teste.

No ambiente local, o desenvolvedor poderá utilizar:

```text
variaveis de ambiente;
```

ou um arquivo:

```text
config/application-local-private.yaml.
```

Esse arquivo será ignorado pelo Git.

O profile local importará o arquivo como opcional.

Em production, os secrets serão obrigatórios.

A baseline demonstrará:

```text
configtree:/run/secrets/formacao-java/.
```

O diretório poderá conter arquivos como:

```text
spring.datasource.username;

spring.datasource.password.
```

O nome do arquivo vira a property.

A aplicação falhará quando o diretório obrigatório não existir.

Não será utilizado:

```text
optional:
```

para secrets essenciais de production.

A regra será:

```text
conveniencia local pode ser opcional;

configuracao critica de production
deve falhar cedo.
```

A aula também tratará a precedência.

Versão simplificada para o laboratório:

```text
base application.yaml;

profile-specific file;

external config file;

environment variable;

system property;

command-line argument;

test overrides.
```

Uma property source de prioridade posterior substitui a anterior.

O objetivo não será decorar uma lista sem contexto.

O objetivo será provar a origem efetiva de cada propriedade com testes.

A aplicação não imprimirá secrets.

A inspeção de configuração utilizará valores não sensíveis.

A próxima aula será:

```text
384 - M14.29 - Logging em APIs
```

Portanto, esta aula não aprofundará:

- formato de log;
- JSON logging;
- MDC detalhado;
- níveis por package;
- appenders;
- masking em Logback;
- correlação distribuída;
- rotação;
- shipping de logs.

A regra atual será somente:

```text
nao registrar secrets.
```

O projeto contínuo permanece:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

---

## Onde estamos na formacao

A sequência atual do M14 é:

```text
379:
Filtros dinamicos e Specifications.

380:
OpenAPI Swagger.

381:
OpenAPI contract first e governanca de contrato.

382:
Versionamento de APIs compatibilidade e depreciacao.

383:
Profiles por ambiente e configuracao segura.

384:
Logging em APIs.

385:
Filters e interceptors.
```

A aula 382 respondeu:

```text
como evoluir e depreciar
uma API sem quebrar consumidores?
```

A aula 383 responderá:

```text
como fornecer valores diferentes
por ambiente
sem alterar o artefato
e sem comprometer secrets?
```

Nesta aula:

```text
externalized configuration:
sim.

Config Data:
sim.

application.yaml:
sim.

profile-specific files:
sim.

profile groups:
sim.

@ConfigurationProperties:
sim.

records:
sim.

validation:
sim.

environment variables:
sim.

command line:
sim.

spring.config.import:
sim.

configtree:
sim.

secrets:
sim.

fail fast:
sim.

Testcontainers:
sim.

logging aprofundado:
nao.

filters HTTP:
nao.
```

A regra central será:

```text
codigo define estrutura e validacao;

ambiente fornece valores;

secrets ficam fora do repository;

startup falha quando
a configuracao obrigatoria e invalida.
```

---

## Objetivo pratico

Você continuará em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

Estrutura principal:

```text
src/main/java/br/com/formacao/backend
├── FormacaoJavaBackendApplication.java
├── config
│   ├── environment
│   │   ├── ApplicationEnvironment.java
│   │   ├── ApplicationEnvironmentProperties.java
│   │   ├── EnvironmentConsistencyValidator.java
│   │   └── EnvironmentConfiguration.java
│   ├── lifecycle
│   │   └── ApiLifecycleProperties.java
│   └── openapi
│       └── OpenApiExposureProperties.java
└── web
    └── versioning
        └── ApiVersionLifecyclePolicy.java
```

Configuração:

```text
src/main/resources
├── application.yaml
├── application-local.yaml
├── application-persistence-lab.yaml
├── application-openapi-lab.yaml
├── application-lifecycle-local.yaml
├── application-hml.yaml
├── application-production.yaml
├── application-persistence-external.yaml
├── application-openapi-controlled.yaml
├── application-openapi-disabled.yaml
└── application-lifecycle-external.yaml
```

Testes:

```text
src/test/resources
└── application-test.yaml
```

Arquivos locais fora do Git:

```text
config
└── application-local-private.yaml

secrets
└── README.example
```

Testes Java:

```text
src/test/java/br/com/formacao/backend/config
├── ApplicationEnvironmentPropertiesTest.java
├── ApiLifecyclePropertiesBindingTest.java
├── ApiLifecyclePropertiesValidationTest.java
├── OpenApiExposurePropertiesTest.java
├── ProfileGroupActivationTest.java
├── PropertySourcePrecedenceTest.java
├── EnvironmentVariableRelaxedBindingTest.java
├── ExternalConfigImportTest.java
├── ConfigTreeSecretBindingTest.java
├── MissingProductionSecretFailsFastTest.java
├── EnvironmentConsistencyValidatorTest.java
├── NoCommittedSecretsTest.java
├── ConfigurationIsolationArchitectureTest.java
└── EnvironmentConfigurationLiveServerIT.java
```

Documentação:

```text
docs
├── externalized-configuration.md
├── configuration-property-precedence.md
├── spring-profiles.md
├── profile-groups.md
├── config-data-imports.md
├── configuration-properties.md
├── configuration-validation.md
├── environment-variable-binding.md
├── secrets-and-config-trees.md
├── local-private-configuration.md
├── environment-configuration-matrix.md
└── secure-configuration-baseline.md
```

Scripts:

```text
scripts
├── 155_iniciar_ambiente_local.ps1
├── 156_validar_profile_hml.ps1
├── 157_validar_profile_production.ps1
├── 158_testar_precedencia_configuracao.ps1
├── 159_testar_configtree_secrets.ps1
├── 160_verificar_secrets_versionados.ps1
└── 161_executar_testes_configuracao.ps1
```

Resultados esperados:

```text
sem profile:
startup falha por configuracao ausente.

local:
PostgreSQL local;
OpenAPI habilitada;
arquivo private opcional.

test:
Testcontainers;
porta aleatoria;
config isolada.

hml:
config externa;
OpenAPI controlada;
secrets obrigatorios.

production:
config externa;
OpenAPI desabilitada;
secrets obrigatorios.

DB_PASSWORD no Git:
zero.

secret default:
zero.

lifecycle hardcoded:
zero.

@ConfigurationProperties:
validada.

profile inconsistente:
startup falha.
```

---

## Conceito essencial

### Externalized configuration

Externalizar configuração significa retirar valores variáveis do código.

Exemplo ruim:

```java
private static final String
        DATABASE_PASSWORD =
                "admin123";
```

Exemplo correto:

```text
o codigo declara que uma senha
e necessaria;

o ambiente fornece o valor.
```

O mesmo princípio vale para URLs, datas e flags.

---

### PropertySource

O Spring Environment agrega fontes de propriedades.

Cada fonte possui precedência.

Quando a mesma chave aparece em mais de uma fonte:

```text
a fonte de maior precedencia vence.
```

Isso permite defaults seguros e overrides operacionais.

---

### Precedencia relevante

Config Data inclui arquivos `application.yaml` e variants de profile.

Environment variables substituem Config Data.

System properties substituem environment variables na ordem oficial.

Command-line arguments possuem prioridade maior que as fontes anteriores.

Testes podem possuir overrides ainda mais prioritários.

Não misture fontes sem necessidade.

Cada override adicional aumenta a dificuldade de diagnóstico.

---

### Arquivos dentro e fora do jar

Arquivos empacotados fornecem defaults.

Arquivos externos podem substituí-los.

Ordem conceitual:

```text
application dentro do jar;

application-profile dentro do jar;

application externo;

application-profile externo.
```

Configuração externa permite operar o mesmo jar sem recompilar.

---

### Um formato principal

A baseline utilizará:

```text
YAML.
```

Não mantenha `application.properties` e `application.yaml` no mesmo local.

Quando os dois existem no mesmo location, `.properties` possui precedência.

Essa mistura torna troubleshooting desnecessariamente difícil.

---

### application.yaml base

O arquivo base contém somente propriedades comuns.

Exemplo:

```yaml
spring:
  application:
    name: formacao-java-backend-api

  profiles:
    default: none

  jpa:
    open-in-view: false
    hibernate:
      ddl-auto: validate

  flyway:
    enabled: true

springdoc:
  api-docs:
    enabled: false
  swagger-ui:
    enabled: false
```

Nenhuma credencial.

---

### Ativacao de profile

Ative externamente:

```powershell
--spring.profiles.active=local
```

ou:

```text
SPRING_PROFILES_ACTIVE=local.
```

Não fixe `spring.profiles.active` em `application-local.yaml`.

`spring.profiles.active` e `spring.profiles.default` devem permanecer em documentos não específicos de profile.

---

### Default none

Configuração:

```yaml
spring:
  profiles:
    default: none
```

Sem um profile ativo, nenhum ambiente operacional é escolhido.

A aplicação também possui properties obrigatórias sem default.

Resultado:

```text
startup falha.
```

Isso é mais seguro que iniciar acidentalmente com localhost em production.

---

### Profile-specific files

O arquivo:

```text
application-local.yaml
```

é carregado quando `local` está ativo.

O arquivo:

```text
application-production.yaml
```

é carregado quando `production` está ativo.

Eles sobrescrevem valores base conforme a precedência do Config Data.

---

### Profile groups

Profile group fornece um nome lógico.

Exemplo:

```yaml
spring:
  profiles:
    group:
      local:
        - persistence-lab
        - openapi-lab
        - lifecycle-local
      hml:
        - persistence-external
        - openapi-controlled
        - lifecycle-external
      production:
        - persistence-external
        - openapi-disabled
        - lifecycle-external
```

Ativar `production` também ativa os fragments do group.

O group deve ser declarado em documento não específico de profile.

---

### @Profile

`@Profile` limita beans.

Use quando a própria existência do bean varia.

Exemplo aceitável:

```java
@Configuration(
        proxyBeanMethods = false
)
@Profile("local")
class LocalSeedDataConfiguration {
}
```

Não use `@Profile` para cada valor simples.

Para valores, prefira properties.

---

### spring.profiles.include

`include` adiciona profiles.

Profile groups comunicam melhor ambientes lógicos.

A baseline utiliza groups para evitar ativar manualmente uma lista longa.

Não misture include e groups para o mesmo objetivo.

---

### Config Data imports

Use:

```yaml
spring:
  config:
    import:
      - "optional:file:./config/application-local-private.yaml"
```

O imported document pode sobrescrever o documento que o importou.

Cada location é importada somente uma vez.

---

### optional

Use `optional:` somente quando a ausência é válida.

Local private file:

```text
opcional.
```

Production secret tree:

```text
obrigatorio.
```

Não aplique `spring.config.on-not-found=ignore` globalmente.

Isso esconderia falhas reais.

---

### location versus additional-location

`spring.config.location` substitui as locations padrão.

`spring.config.additional-location` adiciona locations.

Use `additional-location` quando quiser preservar a busca padrão.

Use `location` somente com entendimento completo do efeito.

---

### Configuration tree

Uma árvore de configuração mapeia arquivos para properties.

Exemplo:

```text
/run/secrets/formacao-java/
├── spring.datasource.username
└── spring.datasource.password
```

Import:

```yaml
spring:
  config:
    import:
      - "configtree:/run/secrets/formacao-java/"
```

O conteúdo de cada arquivo vira o valor.

---

### Secrets montados

Config trees funcionam bem com:

- Kubernetes Secrets;
- Docker secrets;
- volumes de plataforma;
- arquivos gerenciados.

O secret não precisa aparecer em:

- command line;
- Git;
- imagem;
- YAML empacotado.

---

### Environment variables

Conversão:

```text
spring.datasource.password
```

para:

```text
SPRING_DATASOURCE_PASSWORD.
```

Regras:

- pontos viram underscore;
- hífens são removidos;
- nome fica uppercase.

---

### Relaxed binding

`@ConfigurationProperties` aceita formas equivalentes.

Canonical:

```text
app.lifecycle.deprecation-at.
```

Environment:

```text
APP_LIFECYCLE_DEPRECATIONAT.
```

Use kebab-case no YAML e prefixo.

Não invente nomes de environment variables diferentes por script.

---

### Command-line arguments

Exemplo:

```powershell
java -jar app.jar `
  --server.port=9090
```

Command line possui precedência alta.

Não forneça secrets dessa forma.

Argumentos podem aparecer em:

- histórico;
- process listing;
- diagnóstico;
- automação.

Use command line para overrides operacionais não sensíveis.

---

### SPRING_APPLICATION_JSON

É possível fornecer bloco JSON.

Exemplo conceitual:

```text
SPRING_APPLICATION_JSON.
```

Não será usado para secrets na baseline.

Blocos grandes dificultam auditoria e troubleshooting.

---

### Placeholders

Valor seguro com default:

```yaml
server:
  port: "${SERVER_PORT:8081}"
```

Secret sem default:

```yaml
spring:
  datasource:
    password: "${DB_PASSWORD}"
```

Não escreva:

```text
${DB_PASSWORD:admin}.
```

Um default inseguro transforma ausência em credencial conhecida.

---

### @ConfigurationProperties

Properties tipadas são preferíveis para grupos hierárquicos.

Exemplo:

```java
@ConfigurationProperties(
        "app.lifecycle"
)
@Validated
public record ApiLifecycleProperties(
        @NotNull
        Instant deprecationAt,

        @NotNull
        Instant sunsetAt,

        @NotNull
        URI deprecationDocumentation,

        @NotNull
        URI sunsetDocumentation,

        @NotNull
        URI successorVersion
) {
}
```

---

### ConfigurationPropertiesScan

Na classe principal:

```java
@SpringBootApplication
@ConfigurationPropertiesScan
public class FormacaoJavaBackendApplication {
}
```

O scan registra os records.

Não anote o mesmo tipo com `@Component`.

---

### Records de configuration

Records funcionam bem para configuração imutável.

Benefícios:

- components finais;
- constructor binding;
- igualdade;
- leitura clara;
- ausência de setters.

Não coloque secrets em `toString` de diagnóstico.

Um record gera `toString` automaticamente.

---

### Validacao

Use:

- `@NotNull`;
- `@NotBlank`;
- `@Positive`;
- `@DurationMin`;
- `@DurationMax`;
- `@Valid`;
- custom constraint quando necessário.

Para o lifecycle, valide:

```text
sunsetAt >= deprecationAt.
```

A aplicação falha no startup quando a property é inválida.

---

### Properties aninhadas

Exemplo:

```java
public record ApplicationEnvironmentProperties(
        @NotNull
        ApplicationEnvironment name,

        @Valid
        @NotNull
        PublicEndpoint publicEndpoint
) {
}
```

`@Valid` dispara validação aninhada.

---

### Fail fast

Falhar cedo é melhor que descobrir no primeiro request.

Falhas que interrompem startup:

- environment ausente;
- URL obrigatória ausente;
- secret obrigatório ausente;
- data inválida;
- profile inconsistente;
- production com Swagger UI habilitada;
- HML apontando para localhost;
- production com database URL local.

---

### Consistencia do ambiente

`EnvironmentConsistencyValidator` verifica propriedades não sensíveis.

Exemplos:

```text
environment=production
e active profile nao contem production:
falha.

environment=production
e Swagger enabled:
falha.

environment=hml
e public URL usa localhost:
falha.
```

Não imprima credenciais na mensagem de erro.

---

### OpenAPI por ambiente

Local:

```text
Swagger UI habilitada.
```

HML:

```text
desabilitada por default;
habilitada somente por override controlado.
```

Production:

```text
desabilitada.
```

A configuração segura não substitui autenticação futura.

---

### Lifecycle por ambiente

Local pode usar datas de laboratório.

HML e production recebem:

```text
deprecationAt;

sunsetAt;

documentation URIs;

successor URI
```

externamente.

O bean hardcoded da aula 382 será removido.

---

### PostgreSQL por ambiente

Local pode utilizar:

```text
jdbc:postgresql://localhost:5432/formacao_java.
```

Test usa Testcontainers.

HML e production recebem URL e credenciais externas.

Nenhum ambiente production herda localhost como default.

---

### Testcontainers e properties

Nos testes de integração:

```text
@ServiceConnection
```

fornece detalhes de conexão.

Esse mecanismo possui precedência própria de teste.

Não copie usuário e senha do container para `application-test.yaml`.

---

### Arquivos ignorados

Adicione ao `.gitignore`:

```text
.env;

.env.*;

config/application-local-private.yaml;

config/*.secret.yaml;

secrets/;

node_modules/;

target/.
```

Mantenha arquivos example sem valores reais.

---

### Busca por secrets

O teste e o script procuram padrões:

- password literal;
- token;
- secret;
- private key;
- JDBC URL com credencial;
- AWS key pattern;
- bearer token.

Allowlist é pequena e explícita.

Exemplos e nomes de properties não são secrets por si só.

---

### Actuator e configuracao

Endpoints de environment e configuration properties ajudam no diagnóstico.

Eles também exigem cuidado.

Esta aula não adicionará Actuator.

Quando for usado, valores sensíveis precisam ser sanitizados e o endpoint protegido.

---

## Mao na massa guiada

### 1. Confirmar a baseline

Entre no projeto:

```powershell
Set-Location `
  "labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api"
```

Execute:

```powershell
.\mvnw.cmd clean test
```

---

### 2. Ativar ConfigurationPropertiesScan

Na classe principal, adicione:

```text
@ConfigurationPropertiesScan.
```

Não liste packages desnecessários.

---

### 3. Criar ApplicationEnvironment

Enum:

```text
LOCAL;

TEST;

HML;

PRODUCTION.
```

O valor YAML usa lowercase por relaxed binding.

---

### 4. Criar ApplicationEnvironmentProperties

Prefix:

```text
app.environment.
```

Campos:

- name;
- publicBaseUrl.

Valide URI absoluta nos ambientes externos.

---

### 5. Criar ApiLifecycleProperties

Prefix:

```text
app.lifecycle.
```

Mova todos os valores hardcoded da aula 382.

Valide datas e URIs.

---

### 6. Criar OpenApiExposureProperties

Prefix:

```text
app.openapi.
```

Campos:

```text
docsEnabled;

uiEnabled;

tryItOutEnabled.
```

O validator impede UI em production.

---

### 7. Atualizar lifecycle policy

Injete `ApiLifecycleProperties`.

A policy deixa de criar datas.

Ela apenas expõe os valores validados.

---

### 8. Criar application.yaml

Inclua:

- application name;
- default none;
- profile groups;
- JPA validate;
- Flyway;
- open-in-view false;
- springdoc disabled;
- propriedades comuns seguras.

---

### 9. Criar application-local.yaml

Inclua:

```text
app.environment.name=local;

public URL local;

server port;

import optional private file.
```

Não coloque senha.

---

### 10. Criar local private example

Arquivo versionado:

```text
config/application-local-private.example.yaml.
```

Arquivo real ignorado:

```text
config/application-local-private.yaml.
```

O example usa placeholders, nunca credenciais verdadeiras.

---

### 11. Criar persistence-lab profile

URL local pode usar placeholders:

```yaml
spring:
  datasource:
    url: "${LOCAL_DB_URL:jdbc:postgresql://localhost:5432/formacao_java}"
    username: "${LOCAL_DB_USERNAME}"
    password: "${LOCAL_DB_PASSWORD}"
```

Usuário e senha não possuem default.

---

### 12. Criar lifecycle-local

Use datas de laboratório no profile local.

Esses valores não são secrets.

Eles continuam fora do código.

---

### 13. Criar application-test.yaml

Defina somente properties próprias do teste.

A conexão vem de Testcontainers.

Use:

```text
app.environment.name=test.
```

---

### 14. Criar hml

Sem localhost.

Sem credentials.

Import obrigatório de location fornecida pelo ambiente.

OpenAPI controlada por property externa.

---

### 15. Criar production

Import:

```text
configtree obrigatório.
```

OpenAPI desabilitada.

Public base URL obrigatória.

Lifecycle obrigatório.

Nenhum default operacional perigoso.

---

### 16. Criar config tree de teste

Use diretório temporário.

Arquivos:

```text
spring.datasource.username;

spring.datasource.password.
```

Inicie context apontando para o diretório.

---

### 17. Criar EnvironmentConsistencyValidator

Valide profile e environment name.

Valide Swagger.

Valide URLs não locais em ambientes externos.

Use mensagens sem values sensíveis.

---

### 18. Testar binding

Carregue properties com `ApplicationContextRunner`.

Confirme records completos.

---

### 19. Testar validation

Omita uma URI.

Inverta as datas.

Use environment inválido.

Espere startup failure.

---

### 20. Testar profile groups

Ative `local`.

Confirme fragments ativos.

Ative `production`.

Confirme fragments esperados e ausência de local.

---

### 21. Testar precedencia

Defina a mesma property em:

- base;
- profile;
- environment;
- command line de teste.

Confirme a vencedora.

Documente a origem.

---

### 22. Testar relaxed binding

Use:

```text
APP_LIFECYCLE_DEPRECATIONAT.
```

Confirme binding em `deprecationAt`.

---

### 23. Testar import externo

Crie arquivo temporário.

Importe com `spring.config.import`.

Confirme override sobre o documento importador.

---

### 24. Testar secret ausente

Inicie production sem config tree.

Espere falha.

Não marque o import como opcional.

---

### 25. Testar secret presente

Monte config tree temporária.

Confirme DataSource properties.

Não imprima a senha no assertion failure.

---

### 26. Testar Testcontainers

Ative `test`.

Use PostgreSQLContainer e `@ServiceConnection`.

Confirme que nenhum valor production participa.

---

### 27. Testar OpenAPI local

Ative local.

Confirme docs e UI conforme properties.

---

### 28. Testar OpenAPI production

Ative production com secrets de fixture.

Confirme UI e docs desabilitadas.

Tente habilitar UI por valor inconsistente.

Espere startup failure.

---

### 29. Criar NoCommittedSecretsTest

Escaneie:

- `src`;
- `contracts`;
- `docs`;
- `scripts`;
- config examples.

Ignore:

- target;
- .git;
- node_modules.

---

### 30. Criar ArchitectureTest

Valide:

- zero password literal em YAML versionado;
- zero `@Value` para groups customizados;
- ConfigurationProperties records em config;
- domain sem Environment;
- application sem profiles;
- persistence sem profile names;
- controllers sem property lookup;
- zero hardcoded lifecycle dates;
- zero profile active em profile-specific file.

---

### 31. Criar live server test

Cenários:

- local com arquivo private temporário;
- test com Testcontainers;
- hml com external config temporária;
- production com config tree temporária.

Confirme environment marker seguro em endpoint interno de teste.

---

### 32. Criar documentacao

`externalized-configuration.md` explica o mesmo artefato.

`configuration-property-precedence.md` documenta fontes.

`spring-profiles.md` define ambientes.

`profile-groups.md` define fragments.

`config-data-imports.md` diferencia optional e required.

`configuration-properties.md` documenta records.

`configuration-validation.md` documenta fail fast.

`environment-variable-binding.md` registra nomes.

`secrets-and-config-trees.md` define política.

`local-private-configuration.md` orienta o desenvolvedor.

`environment-configuration-matrix.md` cria a matriz.

`secure-configuration-baseline.md` consolida decisões.

---

### 33. Criar scripts

`155_iniciar_ambiente_local.ps1` valida variáveis e inicia local.

`156_validar_profile_hml.ps1` usa config externa de fixture.

`157_validar_profile_production.ps1` exige config tree.

`158_testar_precedencia_configuracao.ps1` demonstra overrides.

`159_testar_configtree_secrets.ps1` cria tree temporária.

`160_verificar_secrets_versionados.ps1` executa scanner.

`161_executar_testes_configuracao.ps1` executa a suite.

---

### 34. Executar binding tests

```powershell
.\mvnw.cmd `
  -Dtest=ApplicationEnvironmentPropertiesTest,ApiLifecyclePropertiesBindingTest,OpenApiExposurePropertiesTest test
```

---

### 35. Executar validation tests

```powershell
.\mvnw.cmd `
  -Dtest=ApiLifecyclePropertiesValidationTest,EnvironmentConsistencyValidatorTest,MissingProductionSecretFailsFastTest test
```

---

### 36. Executar precedence tests

```powershell
.\mvnw.cmd `
  -Dtest=ProfileGroupActivationTest,PropertySourcePrecedenceTest,EnvironmentVariableRelaxedBindingTest,ExternalConfigImportTest test
```

---

### 37. Executar secret tests

```powershell
.\mvnw.cmd `
  -Dtest=ConfigTreeSecretBindingTest,NoCommittedSecretsTest test
```

---

### 38. Executar arquitetura

```powershell
.\mvnw.cmd `
  -Dtest=ConfigurationIsolationArchitectureTest test
```

---

### 39. Executar live

```powershell
.\mvnw.cmd `
  -Dtest=EnvironmentConfigurationLiveServerIT test
```

Docker precisa estar ativo para Testcontainers.

---

### 40. Executar suite completa

```powershell
.\mvnw.cmd clean test
```

Todos os testes anteriores precisam permanecer verdes.

---

### 41. Empacotar

```powershell
.\mvnw.cmd clean package
```

Confirme um único jar.

Não produza um jar por ambiente.

---

### 42. Revisar escopo

Confirme:

```text
um jar:
sim.

profiles:
sim.

groups:
sim.

external config:
sim.

configtree:
sim.

secrets no Git:
zero.

secret default:
zero.

hardcode lifecycle:
zero.

logging avancado:
zero.

filters HTTP:
zero.
```

---

### 43. Revisar Git

```powershell
git status
git diff
git diff --check
```

Inclua:

- YAMLs seguros;
- example local;
- `.gitignore`;
- properties records;
- validators;
- testes;
- docs;
- scripts.

Não inclua:

- `.env`;
- local private;
- config tree;
- secret;
- password;
- target;
- logs;
- arquivo production real.

---

## Entendendo o que foi feito

### O artefato ficou unico

O mesmo jar serve local, test, hml e production.

### Os valores ficaram tipados

ConfigurationProperties substituiu strings dispersas.

### O startup ganhou validacao

Ambientes inválidos não chegam ao primeiro request.

### Secrets sairam do repository

Environment variables e config trees fornecem valores.

### Profiles ficaram organizados

O ambiente lógico ativa fragments por group.

---

## Erros comuns importantes

### Colocar senha com default

A aplicação inicia com credencial conhecida quando o secret falta.

### Fixar active profile no YAML de ambiente

A precedência e ativação ficam confusas.

### Tornar import production optional

A ausência de secret só aparece tarde.

### Usar @Value para dezenas de properties

Binding, metadata e validation ficam fragmentados.

### Produzir um jar por ambiente

Código e configuração deixam de evoluir separadamente.

---

## Comandos uteis

### Iniciar local

```powershell
.\scripts\155_iniciar_ambiente_local.ps1
```

### Validar HML

```powershell
.\scripts\156_validar_profile_hml.ps1
```

### Validar production

```powershell
.\scripts\157_validar_profile_production.ps1
```

### Verificar secrets

```powershell
.\scripts\160_verificar_secrets_versionados.ps1
```

### Suite

```powershell
.\mvnw.cmd clean test
```

---

## Exercicio guiado

### Parte 1 — Precedencia

Defina uma porta em base, profile, environment e command line.

Registre a vencedora.

### Parte 2 — Default inseguro

Adicione temporariamente default de senha.

Faça o scanner falhar.

Restaure.

### Parte 3 — Import obrigatorio

Remova a tree production.

Confirme fail fast.

### Parte 4 — Profile group

Adicione fragment de fixture ao group local.

Confirme ativação.

Remova.

### Parte 5 — Record invalido

Inverta datas de lifecycle.

Confirme context failure.

### Parte 6 — Environment variable

Converta uma property kebab-case para env.

Teste relaxed binding.

### Parte 7 — Jar unico

Empacote uma vez.

Execute o mesmo jar com local e test.

Compare somente a configuração.

### Parte 8 — ADR

Registre:

```text
um artefato;

profiles local, test, hml e production;

groups para fragments;

default none;

ConfigurationProperties records;

validation fail fast;

environment variables para overrides;

configtree para secrets production;

arquivo private local ignorado;

OpenAPI desabilitada em production;

logging na aula 384.
```

---

## Criterios de aceite

- arquivo, H1, numeração e módulo seguem a grade oficial;
- continuidade com a aula 382 foi preservada;
- o mesmo projeto foi continuado;
- externalized configuration foi definida;
- um único jar foi preservado;
- nenhum jar por ambiente foi criado;
- local, test, hml e production foram definidos;
- alias prod não foi criado;
- `application.yaml` foi criado como base;
- somente valores universais ficaram na base;
- nenhum secret ficou na base;
- nenhum hostname production ficou na base;
- nenhum profile operacional ficou ativo por default;
- `spring.profiles.default=none` foi usado;
- profile ativo é fornecido externamente;
- `spring.profiles.active` não foi colocado em profile-specific file;
- files por profile foram criados;
- fragments técnicos foram criados;
- profile groups foram criados;
- groups foram declarados em documento não específico;
- local ativa persistence-lab;
- local ativa openapi-lab;
- hml ativa configuração externa;
- production ativa configuração externa;
- production desabilita OpenAPI;
- `@Profile` foi usado somente para beans cuja existência varia;
- values simples usam properties;
- `spring.profiles.include` foi explicado;
- include não foi misturado sem necessidade;
- Config Data foi explicado;
- arquivos internos e externos foram diferenciados;
- YAML foi escolhido como formato principal;
- application.properties paralelo não foi criado;
- property source precedence foi documentada;
- environment variable sobrescreve Config Data;
- command line sobrescreve fontes anteriores relevantes;
- test overrides foram diferenciados;
- `spring.config.import` foi usado;
- import local private é opcional;
- import production é obrigatório;
- `spring.config.on-not-found=ignore` não foi usado globalmente;
- location e additional-location foram diferenciados;
- values importados sobrescrevem o importador;
- config tree foi implementada;
- filename vira property;
- config tree de production é obrigatória;
- Docker e Kubernetes secrets foram discutidos;
- credenciais não foram colocadas em command line;
- `SPRING_APPLICATION_JSON` não foi usado para secrets;
- environment variable naming foi documentado;
- relaxed binding foi testado;
- prefixos customizados usam kebab-case;
- placeholders seguros podem ter default;
- secrets não possuem default;
- `.env` foi ignorado;
- local private file foi ignorado;
- config secret files foram ignorados;
- example file não contém valor real;
- `@ConfigurationPropertiesScan` foi usado;
- custom properties são records;
- records são imutáveis;
- `@ConfigurationProperties` foi usado;
- `@Validated` foi usado;
- `@NotNull` foi usado;
- nested validation foi explicada;
- lifecycle range foi validado;
- Sunset posterior à Deprecation foi validado;
- URIs foram validadas;
- ApplicationEnvironment enum foi criado;
- ApplicationEnvironmentProperties foi criado;
- ApiLifecycleProperties foi criado;
- OpenApiExposureProperties foi criado;
- hardcodes da aula 382 foram removidos;
- lifecycle policy recebe properties;
- production não habilita Swagger UI;
- HML não usa localhost;
- production não herda JDBC local;
- EnvironmentConsistencyValidator foi criado;
- mensagens de falha não contêm secrets;
- startup falha sem environment;
- startup falha sem production secret;
- startup falha com datas inválidas;
- startup falha com profile inconsistente;
- startup falha com Swagger production habilitado;
- DataSource continua usando properties oficiais;
- password não foi duplicada em record customizado;
- senha não aparece em `toString`;
- local usa variáveis ou arquivo ignorado;
- test usa Testcontainers;
- `@ServiceConnection` foi preservado;
- HML usa configuração externa;
- production usa config tree;
- OpenAPI local permanece acessível;
- OpenAPI production fica desabilitada;
- NoCommittedSecretsTest foi criado;
- scanner ignora target e node_modules;
- scanner diferencia nome de property de secret real;
- patterns de secret foram documentados;
- ApplicationEnvironmentPropertiesTest foi criado;
- ApiLifecyclePropertiesBindingTest foi criado;
- ApiLifecyclePropertiesValidationTest foi criado;
- OpenApiExposurePropertiesTest foi criado;
- ProfileGroupActivationTest foi criado;
- PropertySourcePrecedenceTest foi criado;
- EnvironmentVariableRelaxedBindingTest foi criado;
- ExternalConfigImportTest foi criado;
- ConfigTreeSecretBindingTest foi criado;
- MissingProductionSecretFailsFastTest foi criado;
- EnvironmentConsistencyValidatorTest foi criado;
- NoCommittedSecretsTest foi criado;
- ConfigurationIsolationArchitectureTest foi criado;
- domain não conhece Environment;
- application não conhece profiles;
- persistence não escolhe ambiente;
- controllers não consultam property diretamente;
- `@Value` disperso não foi usado;
- EnvironmentConfigurationLiveServerIT foi criado;
- local, test, hml e production foram exercitados;
- Docker foi usado somente onde necessário;
- matriz de configuração foi criada;
- documentação completa foi criada;
- scripts 155 a 161 foram criados;
- testes de binding, validation, precedence, secret, arquitetura, live, suite e package passaram;
- logging avançado, filters, interceptors, Security, Vault e Kubernetes integration real não foram antecipados;
- ponte para a aula 384 está correta;
- commit recomendado e diário de bordo estão prontos.

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
git commit -m "chore(m14): externalizar configuracao por ambiente"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `.env`;
- arquivo local private;
- secrets;
- credentials;
- config tree;
- target;
- logs;
- configuração production real.

---

## Fechamento e ponte para a proxima aula

Nesta aula, a aplicação deixou de depender de valores fixos por ambiente.

O fluxo consolidado ficou:

```text
application.yaml seguro;

profile logico;

profile group;

profile-specific Config Data;

imports externos;

environment variables;

config tree;

ConfigurationProperties;

validation;

startup fail fast;

um unico jar.
```

Você comprovou:

```text
local isolado;

test com Testcontainers;

hml externo;

production sem secrets no Git;

OpenAPI controlada;

lifecycle externalizado;

precedencia conhecida;

binding tipado;

configuração inválida bloqueada.
```

A decisão central foi:

```text
configuracao segura nao e
espalhar placeholders pelo codigo;

e definir tipos, fontes,
precedencia, validacao,
politica de secrets
e comportamento de falha
para o mesmo artefato.
```

A próxima aula será:

```text
384 - M14.29 - Logging em APIs
```

Nela, você continuará no mesmo projeto e estudará:

- SLF4J;
- Logback;
- níveis TRACE, DEBUG, INFO, WARN e ERROR;
- logs estruturados;
- JSON logging;
- mensagem e argumentos;
- exceptions;
- stack trace;
- masking;
- correlation id;
- MDC;
- request context;
- version;
- environment;
- operation;
- duração;
- logs de entrada e saída;
- logs de aplicação;
- logs de persistência;
- dados pessoais;
- secrets;
- log injection;
- appenders;
- profiles de logging;
- testes;
- observabilidade.

A aula 383 respondeu:

```text
como configurar ambientes
sem hardcode e sem secrets?
```

A aula 384 responderá:

```text
como registrar o comportamento
da API com contexto suficiente
sem produzir ruido
ou vazar informacoes?
```

---

# Material complementar

## Checkpoint final

- [ ] Sei separar configuração do código e produzir um único jar.
- [ ] Sei usar profiles, groups, imports e precedência.
- [ ] Sei criar ConfigurationProperties imutáveis e validadas.
- [ ] Sei fornecer secrets por environment ou config tree.
- [ ] Sei fazer o startup falhar quando a configuração é insegura.

---

## Troubleshooting adicional

### Aplicacao inicia sem profile

Confirme `spring.profiles.default=none` e properties obrigatórias.

### Env var nao faz binding

Revise pontos, hífens, underscores e uppercase.

### Import local nao carrega

Confirme path relativo ao arquivo importador.

### Production inicia sem secret

O configtree foi marcado como optional ou existe default inseguro.

### Swagger aparece em production

Revise group, properties e consistency validator.

### Teste usa banco local

Confirme `@ServiceConnection` e ausência do profile local.

---

## Perguntas de revisao

1. O que externalized configuration resolve?
2. Quantos jars são produzidos?
3. Quais ambientes foram definidos?
4. Para que serve profile group?
5. Onde ativar o profile?
6. O que significa default none?
7. O que `spring.config.import` faz?
8. Quando usar optional?
9. O que é config tree?
10. Como uma env var representa pontos?
11. Secret deve ter default?
12. Para que serve ConfigurationProperties?
13. Por que usar record?
14. Como validar configuration?
15. O que significa fail fast?
16. Production pode herdar localhost?
17. Test usa credencial fixa?
18. Arquivo local private entra no Git?
19. Logging foi aprofundado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Separar valores variáveis do código.
2. Um.
3. Local, test, hml e production.
4. Ativar fragments relacionados.
5. Externamente.
6. Nenhum ambiente implícito.
7. Importa Config Data adicional.
8. Quando ausência é válida.
9. Arquivos montados viram properties.
10. Underscores e uppercase.
11. Não.
12. Binding tipado.
13. Imutabilidade.
14. Bean Validation.
15. Falhar no startup.
16. Não.
17. Não, usa Testcontainers.
18. Não.
19. Não.
20. Logging em APIs.

---

## Atualizacao do diario de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 383 - M14.28 - Profiles por ambiente e configuracao segura

- Continuei no projeto `formacao-java-backend-api`.
- Externalizei a configuração da aplicação.
- Mantive um único jar para todos os ambientes.
- Defini os ambientes local, test, hml e production.
- Configurei `spring.profiles.default=none`.
- Passei a ativar profiles externamente.
- Criei profile groups para fragments técnicos.
- Separei application files por profile.
- Mantive somente defaults seguros no `application.yaml`.
- Removi credenciais, URLs privadas e datas operacionais do código.
- Criei `ApplicationEnvironmentProperties`.
- Criei `ApiLifecycleProperties`.
- Criei `OpenApiExposureProperties`.
- Usei records imutáveis com `@ConfigurationProperties`.
- Ativei `@ConfigurationPropertiesScan`.
- Validei configuration com Bean Validation.
- Implementei fail fast para configuração inválida.
- Validei coerência entre profile e environment.
- Externalizei datas e links de depreciação.
- Mantive OpenAPI habilitada localmente e desabilitada em production.
- Usei environment variables para overrides.
- Estudei a precedência das property sources.
- Usei `spring.config.import`.
- Criei arquivo local private ignorado pelo Git.
- Usei config tree para secrets montados.
- Não defini default para senha.
- Mantive Testcontainers no ambiente de teste.
- Criei scanner para secrets versionados.
- Testei binding, precedence, imports, profiles e falhas de startup.
- Não aprofundei logging.
- Próxima aula: Logging em APIs.
```

---

## Referencia tecnica curta

```text
Config:
valores.

Profile:
ambiente.

Group:
fragments.

Import:
fonte adicional.

Environment:
override.

Configtree:
secret montado.

Properties:
tipo.

Validation:
fail fast.

Gitignore:
isolamento.

Jar:
unico.
```

Regra final:

```text
uma aplicacao Spring Boot deve produzir um unico artefato e receber valores por Config Data e property sources externas; profiles logicos podem ativar fragments por groups, mas nao devem esconder um ambiente default perigoso, propriedades customizadas devem ser vinculadas a records com @ConfigurationProperties e validadas no startup, imports opcionais devem ficar restritos a conveniencias realmente opcionais, secrets obrigatorios devem vir de environment variables ou config trees sem defaults e sem versionamento, e testes precisam comprovar precedencia, isolamento, fail fast e ausencia de credenciais no repository.
```
