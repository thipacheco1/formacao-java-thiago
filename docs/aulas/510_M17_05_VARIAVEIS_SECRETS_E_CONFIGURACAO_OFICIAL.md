# 510 - M17.05 - Variaveis secrets e configuracao

## Apresentação da aula

Na aula 509, você transformou a execução manual da aplicação e do Kafka em uma stack declarada com Docker Compose.

A stack passou a possuir:

```text
service app;

service kafka;

network backend;

volume app_data;

volume kafka_data;

build multi-stage;

runtime não root;

root filesystem read-only;

tmpfs;

capabilities removidas;

no-new-privileges;

limites básicos.
```

A aplicação foi configurada por valores como:

```text
SPRING_PROFILES_ACTIVE;

SERVER_PORT;

KAFKA_BOOTSTRAP_SERVERS;

DB_URL;

DB_USERNAME;

DB_PASSWORD;

FAKE_NOTIFICATION_API_BASE_URL;

FAKE_NOTIFICATION_API_TOKEN.
```

Na aula anterior, esses valores foram colocados diretamente no `compose.yaml` ou interpolados a partir de um arquivo de exemplo.

Isso foi suficiente para provar a comunicação entre os serviços.

Entretanto, ainda existe uma pergunta importante:

```text
quais valores podem
ficar no arquivo versionado?

quais variam
por ambiente?

quais são segredos?

como a aplicação
recebe cada categoria?

como evitar vazamento
em Git,
logs,
imagem
e metadata do container?
```

A pergunta central desta aula será:

```text
como externalizar
configuração e segredos

de forma previsível,
auditável
e segura

sem transformar
o Docker Compose
em um cofre?
```

A resposta começa separando conceitos.

Nem todo valor variável é segredo.

Exemplos de configuração não sensível:

- porta HTTP;
- nome do profile;
- endereço Kafka;
- URL de banco sem credencial;
- timeout;
- batch size;
- quantidade máxima de tentativas;
- nível de log;
- feature flag não sensível.

Exemplos de segredo:

- senha de banco;
- token de provider;
- API key;
- client secret;
- private key;
- certificado privado;
- credencial de registry;
- senha de truststore ou keystore;
- token de repositório privado.

Essa separação é importante porque as soluções são diferentes.

Configuração comum pode ficar:

```text
application.yaml;

application-container.yaml;

compose.yaml;

arquivo versionado.
```

Configuração específica de ambiente pode entrar por:

```text
variável de ambiente;

arquivo de propriedades;

profile;

configtree;

config server;

orquestrador.
```

Segredos não devem ficar:

```text
no repositório;

no Dockerfile;

em ARG;

em ENV da imagem;

em labels;

em logs;

em exemplos reais;

em screenshots;

em documentação compartilhada.
```

Nesta aula, o laboratório adotará três camadas:

```text
1. defaults seguros
   no application.yaml;

2. configuração operacional
   por variáveis e env_file;

3. segredos
   montados como arquivos
   em /run/secrets.
```

A aplicação Spring Boot utilizará:

```text
spring.config.import
com configtree.
```

O diretório:

```text
/run/secrets/
```

será importado como fonte de propriedades.

Arquivos como:

```text
app.notification.provider.token;

spring.datasource.password.
```

serão lidos como propriedades Spring.

Isso evita colocar o valor sensível diretamente no campo `environment` do Compose.

É importante compreender o limite.

Docker Compose local pode montar secrets como arquivos.

Mas o arquivo de origem ainda existe no host.

Compose local não transforma automaticamente esse arquivo em um segredo criptografado, rotacionado e gerenciado por uma plataforma corporativa.

Portanto:

```text
o mecanismo reduz exposição;

não substitui
um secret manager.
```

A aula também trabalhará com:

- precedência;
- defaults;
- valores obrigatórios;
- placeholders;
- `.env`;
- `env_file`;
- `environment`;
- configtree;
- permissões;
- validação de startup;
- redaction;
- inspeção;
- rotação;
- scripts;
- auditoria;
- troubleshooting.

A próxima aula será:

```text
511 - M17.06 - Healthcheck em containers
```

Portanto, esta aula não criará ainda:

- `HEALTHCHECK` no Dockerfile;
- healthcheck HTTP no Compose;
- `condition: service_healthy`;
- start period;
- interval;
- timeout;
- retries;
- liveness policy;
- readiness policy.

O foco será exclusivamente:

```text
variáveis;

configuração;

segredos;

precedência;

proteção.
```

Ao final, você deverá explicar:

```text
a diferença entre
configuração e segredo;

por que .env
não é um cofre;

como env_file
difere de interpolation;

qual fonte vence
quando há conflito;

por que environment
pode expor valores;

como configtree
mapeia arquivos;

por que secret files
precisam ficar fora do Git;

como validar
configuração obrigatória;

como rotacionar
um segredo local;

como provar
que o token
não entrou na imagem
nem no Compose renderizado.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
508:
Imagem segura e usuario nao root.

509:
Docker Compose para API completa.

510:
Variaveis secrets e configuracao.

511:
Healthcheck em containers.

512:
Build de imagem no CI.
```

A aula 509 respondeu:

```text
como declarar
a stack completa
com app,
Kafka,
rede
e volumes?
```

A aula 510 responderá:

```text
como alimentar
essa stack

sem versionar
valores sensíveis

e sem criar
uma configuração imprevisível?
```

Nesta aula:

```text
classificação de valores:
sim.

externalized configuration:
sim.

application.yaml:
sim.

profile container:
sim.

.env.example:
sim.

.env local:
sim.

env_file:
sim.

environment:
sim.

interpolação:
sim.

precedência:
sim.

configtree:
sim.

Compose secrets:
sim.

secret files:
sim.

validação:
sim.

redaction:
sim.

rotação local:
sim.

scripts:
sim.

secret manager externo:
conceitual.

healthcheck:
não.

CI:
não.

Kubernetes Secret:
não.

cloud secret manager:
não.
```

A regra central será:

```text
configuração pode ser
declarada e versionada;

segredo precisa ser
injetado em runtime,
protegido
e substituível.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão revisados ou criados:

```text
compose.yaml
.env.example
.gitignore

config/
├── app.env.example
└── README.md

secrets/
├── .gitignore
├── README.md
└── .gitkeep

scripts/config
├── create-local-secrets.ps1
├── validate-runtime-config.ps1
├── rotate-local-secret.ps1
└── verify-no-secret-leak.ps1

docs/devops/config
├── CONFIGURATION_CLASSIFICATION.md
├── CONFIGURATION_PRECEDENCE.md
├── COMPOSE_SECRETS.md
├── SECRET_ROTATION.md
├── SECRET_LEAK_RESPONSE.md
└── CONFIGURATION_TROUBLESHOOTING.md
```

O profile de container será ajustado para importar:

```text
optional:configtree:/run/secrets/
```

O Compose passará a declarar secrets:

```text
provider_token;

database_password.
```

A aplicação receberá os arquivos em:

```text
/run/secrets/app.notification.provider.token;

/run/secrets/spring.datasource.password.
```

Ao final, você terá:

```text
defaults documentados;

configuração não sensível
em env_file;

segredos fora do Git;

segredos montados como arquivo;

precedência conhecida;

startup validado;

rotação documentada;

script contra vazamentos;

Compose renderizado sem token.
```

Você irá:

1. confirmar a baseline;
2. inventariar propriedades;
3. classificar valores;
4. definir owners;
5. revisar defaults;
6. revisar placeholders;
7. ajustar `application-container.yaml`;
8. adicionar configtree;
9. criar arquivo de configuração exemplo;
10. criar arquivo local não versionado;
11. revisar `.env`;
12. revisar `env_file`;
13. revisar `environment`;
14. declarar secrets no Compose;
15. criar arquivos locais;
16. montar secrets;
17. remover token do environment;
18. validar permissões;
19. validar precedência;
20. validar startup;
21. validar ausência em metadata;
22. validar ausência na imagem;
23. validar ausência em logs;
24. testar segredo ausente;
25. testar rotação;
26. criar scripts;
27. documentar resposta a vazamento;
28. executar smoke test;
29. executar gate;
30. commitar;
31. preparar a aula 511.

---

## Conceito essencial

### Configuração externa

Configuração externa permite usar o mesmo artefato em ambientes diferentes.

A imagem não muda quando mudam:

- endereço Kafka;
- porta;
- token;
- senha;
- timeout;
- nível de log.

O ambiente fornece os valores.

---

### Default

Default é um valor utilizado quando nenhuma fonte superior fornece outro valor.

Exemplo:

```yaml
server:
  port: "${SERVER_PORT:8084}"
```

O default precisa ser seguro.

Não use como default:

- token produtivo;
- senha real;
- endpoint real sensível;
- credencial compartilhada.

---

### Placeholder obrigatório

Quando um valor não pode possuir default, ele deve falhar cedo.

Exemplo conceitual:

```yaml
app:
  notification:
    provider:
      base-url:
        "${FAKE_NOTIFICATION_API_BASE_URL}"
```

Sem valor, a aplicação falha no startup.

No laboratório, alguns valores podem ter defaults didáticos.

Documente quais são obrigatórios em ambientes reais.

---

### `.env`

O arquivo `.env` pode fornecer valores para interpolação do Compose.

Exemplo:

```dotenv
APP_HOST_PORT=8084
```

O Compose utiliza esse valor ao renderizar:

```yaml
ports:
  - "${APP_HOST_PORT:-8084}:8084"
```

O `.env` não é automaticamente montado como environment dentro do container.

Ele participa da interpolação.

---

### `env_file`

Exemplo:

```yaml
env_file:
  - ./config/app.env
```

O conteúdo é fornecido como environment do serviço.

Isso é diferente de interpolar o próprio Compose.

---

### `environment`

Exemplo:

```yaml
environment:
  SERVER_PORT: "8084"
```

Valores declarados diretamente em `environment` entram no ambiente do container.

Eles podem ser vistos por:

- `docker inspect`;
- processos;
- ferramentas de diagnóstico;
- dumps;
- usuários autorizados no daemon.

Por isso, não use environment como primeira escolha para segredos.

---

### Precedência no Compose

A precedência pode variar conforme a forma de execução.

Nesta aula, a regra operacional será simplificada e testada.

Para o ambiente do container:

```text
valor explícito em environment
vence valor de env_file.
```

A interpolação do Compose acontece antes da criação do container.

A linha de comando também pode fornecer valores.

Não dependa de memória.

Use:

```powershell
docker compose config
```

e testes controlados.

---

### Precedência no Spring Boot

Spring Boot combina várias property sources.

Entre as fontes relevantes:

- arquivo da aplicação;
- profile;
- configtree import;
- variáveis de ambiente;
- system properties;
- command-line arguments.

Fontes de maior precedência podem sobrescrever defaults.

A aplicação precisa evitar múltiplas fontes concorrentes para o mesmo segredo sem necessidade.

---

### Configtree

Configtree transforma arquivos de um diretório em propriedades.

Exemplo:

```text
/run/secrets/app.notification.provider.token
```

vira:

```text
app.notification.provider.token.
```

Outro arquivo:

```text
/run/secrets/spring.datasource.password
```

vira:

```text
spring.datasource.password.
```

O conteúdo do arquivo é o valor.

---

### `spring.config.import`

No profile de container:

```yaml
spring:
  config:
    import:
      - "optional:configtree:/run/secrets/"
```

`optional` permite iniciar quando o diretório não existe.

Em ambientes onde os segredos são obrigatórios, a validação da aplicação ainda precisa rejeitar valor ausente.

`optional` não significa que o segredo é opcional para o negócio.

Ele significa que a fonte de configuração pode não existir durante determinados testes ou modos.

---

### Compose secret

No topo do Compose:

```yaml
secrets:
  provider_token:
    file: ./secrets/provider-token.txt
```

No serviço:

```yaml
secrets:
  - source: provider_token
    target: app.notification.provider.token
```

O arquivo será montado em:

```text
/run/secrets/app.notification.provider.token.
```

---

### Limite do Compose local

O arquivo:

```text
./secrets/provider-token.txt
```

existe no host.

Ele precisa de:

- permissão adequada;
- exclusão do Git;
- backup consciente;
- rotação;
- remoção segura;
- owner.

Compose local não oferece sozinho uma solução corporativa completa.

---

### Build secret versus runtime secret

Build secret existe durante o build.

Exemplo:

```text
credencial para repositório Maven privado.
```

Runtime secret existe quando a aplicação executa.

Exemplo:

```text
token do provider.
```

Não confunda.

Um runtime token não deve ser usado durante o build.

---

### `_FILE` pattern

Algumas imagens oficiais suportam variáveis como:

```text
PASSWORD_FILE.
```

A aplicação Spring Boot não suporta automaticamente todo padrão `_FILE`.

Você pode:

- usar configtree;
- criar um adapter;
- usar entrypoint;
- usar biblioteca;
- mapear arquivo em configuração.

Nesta aula, a escolha será configtree.

---

### Binding tipado

Use `@ConfigurationProperties` para propriedades da aplicação.

Exemplo conceitual:

```java
@ConfigurationProperties(
    prefix = "app.notification.provider"
)
public record NotificationProviderProperties(
    URI baseUrl,
    String token,
    Duration connectTimeout,
    Duration readTimeout
) {
}
```

Binding tipado melhora:

- validação;
- documentação;
- testes;
- refatoração.

---

### Validação

Segredos obrigatórios precisam falhar cedo.

Exemplos:

- token vazio;
- password ausente;
- URL inválida;
- timeout negativo.

Use validação no startup.

Não espere a primeira chamada externa para descobrir configuração inválida.

---

### Redaction

Quando uma configuração é exibida:

```text
token:
******.
```

Não imprima:

- valor completo;
- primeiros caracteres;
- últimos caracteres;
- hash reutilizável;
- tamanho quando sensível.

A melhor evidência é provar presença sem revelar conteúdo.

---

### Rotação

Rotação troca o segredo.

Em Compose local, uma estratégia simples é:

1. criar novo arquivo;
2. validar permissões;
3. substituir referência ou conteúdo;
4. recriar o serviço;
5. validar autenticação;
6. revogar valor antigo;
7. registrar horário e owner.

Alterar o arquivo montado pode não ser suficiente para a aplicação recarregar o valor.

O binding normalmente acontece no startup.

Recrie o container.

---

### Vazamento

Se um segredo entrou no Git:

```text
remover o arquivo
não é suficiente.
```

É necessário:

- revogar;
- rotacionar;
- investigar uso;
- remover da versão atual;
- tratar histórico conforme política;
- comunicar;
- registrar incidente.

A prioridade é invalidar o segredo.

---

## Mão na massa guiada

### 1. Confirmar a baseline

Entre:

```powershell
Set-Location `
  "labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab"
```

Execute:

```powershell
.\mvnw.cmd clean verify
```

Valide o Compose:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config
```

---

### 2. Inventariar propriedades

Crie:

```text
docs/devops/config/CONFIGURATION_CLASSIFICATION.md
```

Tabela inicial:

```markdown
| Propriedade | Categoria | Sensível | Fonte |
|---|---|---:|---|
| server.port | Runtime | Não | env |
| spring.kafka.bootstrap-servers | Runtime | Não | env_file |
| spring.datasource.url | Runtime | Não | env_file |
| spring.datasource.username | Runtime | Pode ser | env_file |
| spring.datasource.password | Secret | Sim | configtree |
| app.notification.provider.base-url | Runtime | Não | env_file |
| app.notification.provider.token | Secret | Sim | configtree |
| connect-timeout | Runtime | Não | default/env |
| read-timeout | Runtime | Não | default/env |
```

---

### 3. Definir owners

Cada propriedade precisa ter owner.

Exemplo:

```text
application team:

timeouts;

batch sizes;

feature flags.

platform team:

ports;

service DNS;

resource limits.

security:

secret lifecycle.

database owner:

credentials.
```

No laboratório, os owners são lógicos.

---

### 4. Ajustar `application-container.yaml`

Adicione:

```yaml
spring:
  config:
    import:
      - "optional:configtree:/run/secrets/"
```

Preserve:

```yaml
spring:
  kafka:
    bootstrap-servers:
      "${KAFKA_BOOTSTRAP_SERVERS:kafka:29092}"

  datasource:
    url:
      "${DB_URL:jdbc:h2:file:/data/m16-integrations}"

    username:
      "${DB_USERNAME:sa}"
```

Para a senha, remova um default real.

Use:

```yaml
    password:
      "${DB_PASSWORD:}"
```

A fonte configtree poderá sobrescrever.

---

### 5. Ajustar provider properties

Mantenha:

```yaml
app:
  notification:
    provider:
      base-url:
        "${FAKE_NOTIFICATION_API_BASE_URL:http://app:8084}"

      token:
        "${FAKE_NOTIFICATION_API_TOKEN:}"

      connect-timeout:
        "${FAKE_NOTIFICATION_CONNECT_TIMEOUT:500ms}"

      read-timeout:
        "${FAKE_NOTIFICATION_READ_TIMEOUT:1s}"
```

A propriedade de token poderá vir do configtree.

A variável de ambiente vazia não deve sobrescrever acidentalmente o secret file.

Para evitar ambiguidade, remova `FAKE_NOTIFICATION_API_TOKEN` do Compose.

---

### 6. Criar arquivo de configuração exemplo

Arquivo:

```text
config/app.env.example
```

Conteúdo:

```dotenv
SPRING_PROFILES_ACTIVE=container
SERVER_PORT=8084
KAFKA_BOOTSTRAP_SERVERS=kafka:29092
DB_URL=jdbc:h2:file:/data/m16-integrations
DB_USERNAME=sa
FAKE_NOTIFICATION_API_BASE_URL=http://app:8084
FAKE_NOTIFICATION_CONNECT_TIMEOUT=500ms
FAKE_NOTIFICATION_READ_TIMEOUT=1s
JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75.0 -Djava.io.tmpdir=/tmp
```

Nenhum segredo entra nesse arquivo.

---

### 7. Criar arquivo local

Copie:

```powershell
Copy-Item `
  "config/app.env.example" `
  "config/app.env"
```

Adicione ao `.gitignore`:

```text
config/app.env
```

O arquivo local pode variar.

---

### 8. Revisar `.env.example`

Mantenha somente interpolação do Compose:

```dotenv
APP_HOST_PORT=8084
KAFKA_HOST_PORT=9092
APP_IMAGE_TAG=4.1.0
```

Remova:

```text
FAKE_NOTIFICATION_API_TOKEN.
```

O arquivo `.env.example` não deve sugerir que segredo pertence à interpolação.

---

### 9. Criar diretório de secrets

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "secrets"
```

Arquivo:

```text
secrets/.gitignore
```

Conteúdo:

```gitignore
*
!.gitignore
!README.md
!.gitkeep
```

Crie:

```text
secrets/.gitkeep.
```

---

### 10. Criar README de secrets

Arquivo:

```text
secrets/README.md
```

Inclua:

- arquivos esperados;
- nomes;
- finalidade;
- proibição de commit;
- comandos de criação;
- rotação;
- resposta a vazamento.

Não inclua valores.

---

### 11. Criar secrets locais

PowerShell:

```powershell
Set-Content `
  -Path `
  "secrets/provider-token.txt" `
  -Value `
  "local-provider-token-change-me" `
  -NoNewline

Set-Content `
  -Path `
  "secrets/database-password.txt" `
  -Value `
  "local-database-password-change-me" `
  -NoNewline
```

Esses valores são apenas locais.

Não copie para o documento de evidência.

---

### 12. Declarar secrets no Compose

No service `app`:

```yaml
secrets:
  - source: provider_token
    target: app.notification.provider.token

  - source: database_password
    target: spring.datasource.password
```

No topo:

```yaml
secrets:
  provider_token:
    file: ./secrets/provider-token.txt

  database_password:
    file: ./secrets/database-password.txt
```

---

### 13. Usar `env_file`

No service `app`:

```yaml
env_file:
  - ./config/app.env
```

Remova do bloco `environment` os valores já fornecidos pelo arquivo.

Mantenha em `environment` apenas overrides deliberados.

Uma baseline limpa:

```yaml
environment:
  SPRING_PROFILES_ACTIVE:
    "container"
```

Mesmo esse valor pode permanecer no `env_file`.

Escolha uma fonte única por propriedade.

---

### 14. Revisar o service app

Estrutura conceitual:

```yaml
app:
  build:
    context: .
    dockerfile: Dockerfile
    target: runtime

  image:
    "formacao-java/m16-integrations:${APP_IMAGE_TAG:-4.1.0}"

  env_file:
    - ./config/app.env

  secrets:
    - source: provider_token
      target: app.notification.provider.token

    - source: database_password
      target: spring.datasource.password
```

Preserve:

- volumes;
- tmpfs;
- read_only;
- cap_drop;
- security_opt;
- limits;
- network;
- restart.

---

### 15. Validar renderização sem token

Execute:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config `
  > `
  ".compose.rendered.yaml"
```

Procure:

```powershell
Select-String `
  -Path `
  ".compose.rendered.yaml" `
  -Pattern `
  "local-provider-token-change-me|local-database-password-change-me"
```

Resultado esperado:

```text
nenhuma ocorrência.
```

Apague o arquivo renderizado depois:

```powershell
Remove-Item `
  ".compose.rendered.yaml"
```

Adicione padrões temporários ao `.gitignore` quando necessário.

---

### 16. Construir e iniciar

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  --detach `
  --build
```

---

### 17. Inspecionar arquivos montados

Sem imprimir conteúdo:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  app `
  sh `
  -c `
  "ls -ln /run/secrets"
```

Confirme os targets.

---

### 18. Validar permissões dos secrets

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  app `
  sh `
  -c `
  "stat -c '%n %a %u %g' /run/secrets/*"
```

A disponibilidade de `stat` depende da base.

Se não existir, use `ls -l`.

Não altere a imagem apenas para obter uma ferramenta de diagnóstico.

---

### 19. Validar binding sem revelar valor

Adicione um teste de contexto que valide:

```text
token não vazio;

password não nulo;

base URL válida;

timeouts positivos.
```

O teste não imprime os valores.

Para runtime, use um endpoint interno apenas se já existir uma forma segura de validar configuração.

Não crie endpoint que exponha segredo.

---

### 20. Validar metadata do container

Execute:

```powershell
docker inspect `
  "$(docker compose ps -q app)" `
  --format `
  "{{range .Config.Env}}{{println .}}{{end}}" `
  > `
  ".container.env.txt"
```

Procure os valores locais.

Resultado esperado:

```text
segredos ausentes.
```

Apague:

```powershell
Remove-Item `
  ".container.env.txt"
```

---

### 21. Validar imagem

Procure valores no histórico:

```powershell
docker history `
  --no-trunc `
  "formacao-java/m16-integrations:4.1.0" `
  > `
  ".image.history.txt"
```

Procure os secrets.

Resultado esperado:

```text
ausentes.
```

Remova o arquivo temporário.

---

### 22. Validar logs

```powershell
docker compose `
  --env-file `
  ".env.example" `
  logs `
  app `
  > `
  ".app.logs.txt"
```

Procure os valores.

Resultado esperado:

```text
ausentes.
```

Remova o arquivo.

---

### 23. Validar token ausente

Pare:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  down
```

Renomeie temporariamente:

```powershell
Rename-Item `
  "secrets/provider-token.txt" `
  "provider-token.missing"
```

Tente iniciar.

O comportamento esperado depende da validação da aplicação.

Para ambiente seguro:

```text
startup deve falhar
ou provider deve ficar
explicitamente indisponível.
```

Não aceite token vazio silencioso para um provider obrigatório.

Restaure o arquivo.

---

### 24. Criar validação tipada

A configuração do provider deve possuir validação.

Exemplo:

```java
package br.com.formacao.m16.architecture.os.notification.provider.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(
    prefix = "app.notification.provider"
)
public record NotificationProviderProperties(
    @NotNull URI baseUrl,
    @NotBlank String token,
    @NotNull Duration connectTimeout,
    @NotNull Duration readTimeout
) {
}
```

Adicione validações de duração positiva por método ou custom validator quando necessário.

---

### 25. Testar configuração inválida

Crie testes:

```text
NotificationProviderConfigurationValidationTest;

ContainerConfigTreeIntegrationTest.
```

Cenários:

- token ausente;
- token vazio;
- URL inválida;
- connect timeout zero;
- read timeout negativo;
- secret file presente;
- environment não sobrescreve sem intenção.

---

### 26. Criar script de secrets

Arquivo:

```text
scripts/config/create-local-secrets.ps1
```

O script deve:

- criar diretório;
- verificar arquivos existentes;
- pedir confirmação antes de substituir;
- gerar valores aleatórios para laboratório;
- usar UTF-8 sem newline indesejado;
- não imprimir o valor;
- mostrar apenas caminhos criados.

Não use um token previsível em automação real.

---

### 27. Criar script de validação

Arquivo:

```text
scripts/config/validate-runtime-config.ps1
```

Responsabilidades:

1. verificar arquivos;
2. verificar exclusão pelo Git;
3. renderizar Compose;
4. procurar vazamentos;
5. iniciar stack;
6. validar contexto;
7. validar health atual apenas como smoke;
8. executar jornada;
9. remover temporários.

A política dedicada de health continua na aula 511.

---

### 28. Criar script de rotação

Arquivo:

```text
scripts/config/rotate-local-secret.ps1
```

Parâmetros:

```text
-SecretName;

-NewValuePath.
```

Fluxo:

1. validar novo arquivo;
2. preservar backup temporário protegido;
3. substituir atomicamente;
4. recriar `app`;
5. executar smoke test;
6. confirmar;
7. remover backup;
8. registrar horário sem valor.

---

### 29. Testar rotação

Crie um novo token no provider fake, quando o laboratório permitir.

Substitua o arquivo.

Recrie somente a aplicação:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  --detach `
  --no-deps `
  --force-recreate `
  app
```

Confirme:

- container novo;
- secret novo montado;
- valor não aparece em inspect;
- autenticação funciona;
- valor antigo deixa de funcionar quando revogado.

---

### 30. Criar script contra vazamento

Arquivo:

```text
scripts/config/verify-no-secret-leak.ps1
```

Verifique:

- arquivos rastreados;
- diff;
- Compose renderizado;
- image history;
- container env;
- logs;
- documentação;
- nomes de arquivos temporários.

O script deve receber padrões por arquivo local e não imprimir os valores.

---

### 31. Validar o Git

Execute:

```powershell
git check-ignore `
  -v `
  "secrets/provider-token.txt"

git check-ignore `
  -v `
  "secrets/database-password.txt"

git check-ignore `
  -v `
  "config/app.env"
```

Todos precisam estar ignorados.

Depois:

```powershell
git ls-files `
  "secrets" `
  "config/app.env"
```

Nenhum secret local deve aparecer.

---

### 32. Documentar precedência

Arquivo:

```text
CONFIGURATION_PRECEDENCE.md
```

Inclua exemplos testados:

```text
application.yaml;

application-container.yaml;

configtree;

env_file;

environment;

command-line.
```

Não crie uma tabela genérica sem validar o comportamento real da versão usada.

---

### 33. Documentar Compose secrets

Arquivo:

```text
COMPOSE_SECRETS.md
```

Inclua:

- objetivo;
- limites;
- source file;
- target;
- `/run/secrets`;
- configtree;
- permissões;
- Git;
- rotação;
- inspeção;
- diferenças para secret manager.

---

### 34. Documentar rotação

Arquivo:

```text
SECRET_ROTATION.md
```

Inclua:

- owner;
- periodicidade;
- criação;
- distribuição;
- ativação;
- validação;
- revogação;
- rollback;
- auditoria.

---

### 35. Documentar resposta a vazamento

Arquivo:

```text
SECRET_LEAK_RESPONSE.md
```

Primeiras ações:

```text
1. revogar;

2. rotacionar;

3. limitar impacto;

4. investigar;

5. corrigir fonte;

6. tratar histórico;

7. comunicar;

8. registrar.
```

Não coloque o segredo vazado no documento.

---

### 36. Criar troubleshooting

Arquivo:

```text
CONFIGURATION_TROUBLESHOOTING.md
```

Inclua:

- `.env` não lido;
- `env_file` ausente;
- interpolation vazia;
- variável sobrescrevendo configtree;
- secret file ausente;
- target incorreto;
- newline no secret;
- permissão negada;
- validation failure;
- inspect mostrando segredo;
- log mostrando segredo;
- rotação sem recreate;
- valor antigo em cache;
- arquivo rastreado pelo Git.

---

### 37. Executar validação final

Execute:

```powershell
.\scripts\config\verify-no-secret-leak.ps1
```

Depois:

```powershell
.\mvnw.cmd clean verify
```

Valide Compose:

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config
```

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### Valores ganharam classificação

Configuração e segredo deixaram de ser tratados como a mesma coisa.

### `.env` ganhou limite claro

Ele serve para interpolação, não para proteção.

### `env_file` concentrou configuração operacional

O Compose ficou menos repetitivo.

### Secrets saíram de `environment`

Tokens e passwords deixaram de aparecer na metadata comum do container.

### Configtree integrou arquivos ao Spring Boot

A aplicação recebeu propriedades sem criar endpoint ou entrypoint inseguro.

### Validação antecipou falhas

Configuração inválida interrompe o startup.

### A rotação ganhou procedimento

Trocar um arquivo passou a incluir recreate, teste e revogação.

### O Git ganhou verificações

Arquivos locais sensíveis ficaram explicitamente ignorados.

### Vazamento ganhou resposta operacional

Remover o arquivo não foi confundido com revogar o segredo.

### A stack ficou pronta para healthchecks

A próxima aula poderá avaliar estado sem misturar configuração sensível.

---

## Erros comuns importantes

### Colocar segredo em `.env.example`

O exemplo vira um vazamento ou um incentivo incorreto.

### Versionar `.env`

O repositório passa a conter valores locais ou reais.

### Usar `ARG` para token de runtime

O segredo entra no contexto de build.

### Usar environment para tudo

Metadata do container fica excessivamente sensível.

### Montar secret e também definir env

A precedência pode esconder o arquivo.

### Imprimir secret para provar que foi lido

A validação causa o próprio vazamento.

### Usar token vazio como fallback

A aplicação falha tarde ou autentica incorretamente.

### Alterar secret file sem recriar app

O binding pode continuar com o valor antigo.

### Confundir Compose secret com secret manager

O arquivo de origem continua no host.

### Remover segredo do Git sem revogar

O valor comprometido continua válido.

### Criar endpoint de diagnóstico com propriedades

A superfície de exposição aumenta.

### Antecipar healthcheck nesta aula

Configuração e health possuem objetivos diferentes.

---

## Comandos úteis

### Renderizar Compose

```powershell
docker compose `
  --env-file `
  ".env.example" `
  config
```

### Ver arquivos de secrets

```powershell
docker compose `
  --env-file `
  ".env.example" `
  exec `
  app `
  sh `
  -c `
  "ls -l /run/secrets"
```

### Ver environment

```powershell
docker inspect `
  "$(docker compose ps -q app)" `
  --format `
  "{{range .Config.Env}}{{println .}}{{end}}"
```

### Ver arquivos ignorados

```powershell
git check-ignore `
  -v `
  "secrets/provider-token.txt"
```

### Ver arquivos rastreados

```powershell
git ls-files `
  "secrets" `
  "config/app.env"
```

### Recriar app

```powershell
docker compose `
  --env-file `
  ".env.example" `
  up `
  --detach `
  --no-deps `
  --force-recreate `
  app
```

---

## Exercício guiado

### Parte 1 — Inventário

Liste todas as propriedades.

### Parte 2 — Classificação

Separe config e secret.

### Parte 3 — Defaults

Revise valores seguros.

### Parte 4 — Env

Crie `app.env`.

### Parte 5 — Secrets

Crie arquivos e targets.

### Parte 6 — Spring

Importe configtree.

### Parte 7 — Validação

Falhe cedo em configuração inválida.

### Parte 8 — Evidência

Prove ausência de vazamento.

### Parte 9 — Rotação

Troque o token com recreate.

### Parte 10 — Documentação

Registre precedência e resposta.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 509 foi preservada;
- propriedades foram inventariadas;
- configuração foi diferenciada de segredo;
- sensibilidade foi classificada;
- owners foram definidos;
- defaults foram revisados;
- defaults sensíveis foram proibidos;
- placeholders obrigatórios foram discutidos;
- profile container foi revisado;
- configtree foi importado;
- diretório `/run/secrets` foi definido;
- arquivo `app.env.example` foi criado;
- nenhum segredo entrou no exemplo;
- `app.env` local foi criado;
- `app.env` foi ignorado;
- `.env.example` foi revisado;
- token foi removido de `.env.example`;
- `.env` real permaneceu fora do Git;
- diretório secrets foi criado;
- `.gitignore` de secrets foi criado;
- README de secrets foi criado;
- arquivos locais foram criados;
- valores locais não foram documentados;
- Compose secrets foram declarados;
- provider token foi declarado;
- database password foi declarado;
- targets com nomes de propriedade foram usados;
- service app recebeu secrets;
- token foi removido de environment;
- `env_file` foi usado;
- fontes duplicadas foram evitadas;
- Compose foi renderizado;
- token não apareceu no render;
- password não apareceu no render;
- stack foi iniciada;
- arquivos montados foram listados;
- conteúdo não foi impresso;
- permissões foram inspecionadas;
- binding foi validado;
- endpoint de segredo não foi criado;
- metadata do container foi inspecionada;
- token não apareceu em inspect;
- password não apareceu em inspect;
- image history foi inspecionado;
- logs foram inspecionados;
- token não apareceu nos logs;
- password não apareceu nos logs;
- cenário de secret ausente foi testado;
- token vazio não foi aceito silenciosamente;
- configuration properties foram validadas;
- testes de configuração foram criados;
- token ausente foi testado;
- URL inválida foi testada;
- timeouts inválidos foram testados;
- configtree presente foi testado;
- precedência foi testada;
- script de criação foi criado;
- script não imprime segredo;
- script de validação foi criado;
- script de rotação foi criado;
- rotação exige recreate;
- revogação foi documentada;
- script contra vazamento foi criado;
- Git ignore foi verificado;
- arquivos sensíveis não estão rastreados;
- precedência foi documentada;
- limites do Compose secrets foram documentados;
- rotação foi documentada;
- resposta a vazamento foi documentada;
- troubleshooting foi criado;
- secret manager externo foi diferenciado;
- build secret foi diferenciado de runtime secret;
- `_FILE` foi discutido;
- healthcheck não foi antecipado;
- CI não foi antecipado;
- Kubernetes Secret não foi antecipado;
- cloud secret manager não foi antecipado;
- smoke test foi executado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 511 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Adicione somente arquivos seguros:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/compose.yaml `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/.env.example `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/.gitignore `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/config/app.env.example `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/config/README.md `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/secrets/.gitignore `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/secrets/.gitkeep `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/secrets/README.md `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-container.yaml `
  scripts/config `
  docs/devops/config `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Verifique novamente:

```powershell
git ls-files `
  "secrets" `
  "config/app.env" `
  ".env"
```

Commit recomendado:

```powershell
git commit -m "build(m17): externalizar configuracao e secrets"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- `.env`;
- `config/app.env`;
- `provider-token.txt`;
- `database-password.txt`;
- token;
- password;
- output renderizado;
- output de inspect;
- logs;
- history;
- volume;
- banco;
- target;
- arquivo temporário;
- healthcheck da aula 511.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a stack Compose ganhou um modelo explícito de configuração.

A separação passou a ser:

```text
application defaults;

profile container;

env_file;

Compose interpolation;

secret files;

configtree;

runtime validation.
```

Você comprovou que:

- nem toda variável é segredo;
- `.env` participa de interpolação e não é cofre;
- `env_file` fornece environment ao container;
- `environment` explícito pode sobrescrever outros valores;
- secrets não devem ser colocados em metadata comum;
- Compose pode montar arquivos em `/run/secrets`;
- configtree transforma arquivos em propriedades Spring;
- valores obrigatórios precisam falhar cedo;
- validação não deve imprimir conteúdo;
- a imagem não deve conter token;
- o Compose renderizado não deve conter token;
- logs não devem conter token;
- rotação normalmente exige recreate;
- revogação é parte da rotação;
- remover do Git não invalida segredo vazado;
- secret manager externo continua necessário em ambientes reais.

A próxima aula será:

```text
511 - M17.06 - Healthcheck em containers
```

Nela, você irá:

- diferenciar processo vivo e aplicação pronta;
- criar healthcheck HTTP;
- configurar interval;
- configurar timeout;
- configurar retries;
- configurar start period;
- revisar liveness;
- revisar readiness;
- integrar health no Compose;
- usar `depends_on` com condição;
- validar falhas e recuperação.

Nenhuma política dedicada de healthcheck foi implementada antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei as propriedades.
- [ ] Separei config e segredo.
- [ ] Usei env_file.
- [ ] Montei secrets como arquivos.
- [ ] Importe configtree.
- [ ] Validei startup.
- [ ] Testei rotação e vazamentos.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O Compose não encontra `app.env`

Confirme caminho relativo ao `compose.yaml`.

### `.env` não altera o container

`.env` pode estar apenas interpolando o Compose.

Use `env_file` ou `environment` para o container.

### Secret file não aparece

Revise declaração top-level e referência no service.

### Target possui nome errado

O nome do arquivo precisa corresponder à propriedade esperada pelo configtree.

### Token permanece vazio

Revise `spring.config.import`, precedência e validação.

### Environment sobrescreve configtree

Remova a variável duplicada ou defina a fonte oficial.

### O secret possui newline

Crie com `-NoNewline` ou normalize conscientemente.

### App não lê valor novo

Recrie o container após rotação.

### `docker inspect` mostra token

Ele ainda está em environment ou command.

### `docker compose config` mostra token

O valor foi interpolado diretamente no YAML.

### Git rastreia o secret

Remova do index, revogue e trate histórico.

### O teste imprime a propriedade

Troque por assertion de presença sem mensagem sensível.

---

## Perguntas de revisão

1. O que é configuração?
2. O que é segredo?
3. `.env` é um cofre?
4. Para que serve `env_file`?
5. O que faz `environment`?
6. Qual vence: environment ou env_file?
7. O que é configtree?
8. Onde Compose monta secrets?
9. Como um arquivo vira propriedade?
10. Por que não usar ARG para token?
11. Qual a diferença entre build e runtime secret?
12. O que é binding tipado?
13. Por que validar no startup?
14. Como provar que o secret existe sem mostrá-lo?
15. Alterar arquivo rotaciona a aplicação automaticamente?
16. Por que recriar o container?
17. Remover do Git resolve vazamento?
18. O que fazer primeiro em um vazamento?
19. Compose local substitui secret manager?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Valor que controla comportamento.
2. Valor sensível.
3. Não.
4. Fornecer environment ao service.
5. Declarar environment explícito.
6. Environment explícito.
7. Arquivos como propriedades.
8. `/run/secrets`.
9. Nome do arquivo vira key.
10. Pode aparecer no build.
11. Momento de uso.
12. Propriedades em tipos Java.
13. Falhar cedo.
14. Validar presença e comportamento.
15. Não necessariamente.
16. Recarregar binding.
17. Não.
18. Revogar e rotacionar.
19. Não.
20. Healthcheck em containers.

---

## Desafio opcional

Adicione suporte controlado ao padrão:

```text
APP_NOTIFICATION_PROVIDER_TOKEN_FILE.
```

Requisitos:

- não usar shell para exportar valor;
- não imprimir conteúdo;
- manter configtree como baseline;
- documentar precedência;
- testar arquivo ausente;
- testar environment e file simultâneos;
- rejeitar ambiguidade;
- não antecipar Kubernetes Secret.

O objetivo é comparar padrões, não substituir a solução principal sem evidência.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 510 - M17.05 - Variaveis secrets e configuracao

- Continuei após o Docker Compose da API completa.
- Inventariei propriedades da aplicação.
- Diferenciei configuração de segredo.
- Classifiquei sensibilidade e owners.
- Revisei defaults seguros.
- Adicionei import de configtree.
- Mantive `/run/secrets` como fonte.
- Criei `app.env.example`.
- Criei `app.env` local e ignorado.
- Revisei `.env.example`.
- Removi token do arquivo de interpolação.
- Criei diretório `secrets`.
- Protegi arquivos pelo `.gitignore`.
- Documentei os arquivos esperados.
- Criei secrets locais sem versioná-los.
- Declarei Compose secrets.
- Montei token e password com nomes de propriedades.
- Removi token do environment.
- Usei `env_file` para configuração não sensível.
- Renderizei o Compose.
- Confirmei ausência de segredo no render.
- Inspecionei `/run/secrets` sem imprimir conteúdo.
- Confirmei ausência de segredo em inspect.
- Confirmei ausência de segredo na imagem.
- Confirmei ausência de segredo nos logs.
- Testei secret ausente.
- Adicionei binding tipado e validação.
- Testei URL, token e timeouts inválidos.
- Criei scripts de criação, validação, rotação e leak check.
- Testei rotação com recreate.
- Verifiquei Git ignore e arquivos rastreados.
- Documentei precedência.
- Documentei limites do Compose secrets.
- Documentei rotação e resposta a vazamento.
- Não antecipei healthcheck.
- Próxima aula: Healthcheck em containers.
```

---

## Referência técnica curta

- Spring Boot Externalized Configuration.
- Spring Boot Config Data.
- Spring Boot Config Trees.
- Spring Boot Configuration Properties.
- Docker Compose Environment Variables.
- Docker Compose `env_file`.
- Docker Compose Secrets.
- Docker Build Secrets.
- Secret Rotation.
- Incident Response for Leaked Credentials.

Regra final:

```text
variáveis, secrets e configuração precisam de fontes e responsabilidades explícitas: defaults seguros permanecem nos arquivos Spring, valores operacionais não sensíveis entram por `env_file` e interpolação controlada, enquanto tokens e passwords ficam fora do Git, do Dockerfile, de ARG, de ENV da imagem e da metadata comum do container; Docker Compose monta arquivos em `/run/secrets` e `spring.config.import=optional:configtree:/run/secrets/` converte seus nomes em propriedades, permitindo binding tipado e validação de startup sem imprimir conteúdo; fontes duplicadas são evitadas e a precedência é testada com `docker compose config`, inspect e testes; scripts criam, validam e rotacionam secrets sem revelar valores, a aplicação é recriada para recarregar o binding e o segredo anterior é revogado; vazamentos exigem revogação, rotação e investigação, não apenas remoção do arquivo; Compose local reduz exposição, mas não substitui secret manager corporativo; com a configuração protegida, a stack fica pronta para receber healthchecks dedicados na aula 511.
```
