# 507 - M17.02 - Dockerfile multi stage avancado

## Apresentação da aula

Na aula 506, você iniciou o Módulo 17 revisando Docker aplicado ao projeto Spring Boot do Módulo 16.

A primeira imagem utilizou um fluxo simples:

```text
host:

Maven Wrapper;

testes;

JAR.

Docker:

copiar JAR;

executar aplicação.
```

O Dockerfile recebeu:

```text
target/*.jar.
```

Isso funcionou.

A imagem conseguiu:

- iniciar a aplicação;
- publicar a porta;
- usar configuração externa;
- conectar-se às dependências;
- escrever logs;
- expor health;
- montar volume;
- executar graceful shutdown.

Entretanto, o processo ainda possui uma dependência importante:

```text
o host precisa produzir
o JAR antes do docker build.
```

Se outra pessoa executar somente:

```powershell
docker build .
```

sem rodar Maven antes, o build falhará.

Também podem surgir diferenças entre ambientes:

- JDK diferente;
- Maven diferente;
- variável local;
- JAR antigo em `target`;
- testes não executados;
- wrapper ignorado;
- artefato criado com configuração inesperada;
- múltiplos JARs no diretório.

A pergunta central desta aula será:

```text
como fazer o Docker
construir a aplicação

e ainda produzir
uma imagem final
sem Maven,
sem código-fonte
e sem JDK de compilação?
```

A resposta será:

```text
Dockerfile multi-stage.
```

Um Dockerfile multi-stage utiliza múltiplas instruções `FROM`.

Cada `FROM` inicia um estágio.

Nesta aula, os estágios principais serão:

```text
builder;

runtime.
```

O estágio `builder` terá:

- JDK 21;
- Maven Wrapper;
- arquivos do projeto;
- download de dependências;
- compilação;
- testes;
- empacotamento.

O estágio `runtime` terá:

- Java Runtime;
- JAR final;
- configuração externa;
- processo da aplicação.

O resultado será:

```text
docker build
capaz de produzir
o artefato completo

sem depender
do Maven ou do JDK
instalado no host.
```

O host continuará precisando de:

```text
Docker Engine;

arquivos do repositório;

acesso às dependências
quando o cache ainda não existe.
```

O Dockerfile avançado também será organizado para aproveitar cache.

Uma ordem ruim seria:

```dockerfile
COPY . .
RUN ./mvnw clean verify
```

Qualquer alteração em qualquer arquivo invalida a camada de build.

Uma ordem melhor separa:

```text
arquivos do wrapper;

POM;

download de dependências;

código-fonte;

build.
```

Assim, uma mudança em uma classe Java pode reutilizar dependências já baixadas.

A aula também utilizará recursos de BuildKit quando disponíveis:

```text
cache mount
para o repositório Maven.
```

Exemplo conceitual:

```dockerfile
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw package
```

Esse cache pertence ao processo de build.

Ele não entra na imagem final.

A aula irá comparar:

```text
build frio;

build quente;

mudança no código;

mudança no pom.xml;

mudança no Dockerfile.
```

Você aprenderá a prever quais camadas serão reutilizadas.

A aula também validará a imagem final.

Serão verificados:

- ausência de Maven;
- ausência de código-fonte;
- ausência do diretório `.m2`;
- ausência do estágio builder;
- JAR correto;
- entrypoint;
- porta;
- tamanho;
- labels;
- health;
- execução real.

A aula não aprofundará hardening de imagem.

A próxima aula será:

```text
508 - M17.03 - Imagem segura e usuario nao root
```

Portanto, os assuntos abaixo serão apenas preservados ou mencionados:

- usuário não root;
- permissões;
- capabilities;
- filesystem read-only;
- base image segura;
- atualização de vulnerabilidades;
- secrets;
- políticas de segurança;
- scanner;
- assinatura.

O foco desta aula será:

```text
reprodutibilidade;

separação de estágios;

cache;

build;

artefato final.
```

Ao final, você deverá explicar:

```text
por que o builder
não aparece no runtime;

como copiar artefatos
entre estágios;

por que copiar o POM
antes do código;

quando o cache
é invalidado;

qual diferença existe
entre cache de camadas
e cache mount;

por que clean pode reduzir
o benefício do cache;

como provar que a imagem
não contém Maven;

como executar um build
sem JDK local;

como manter o build
determinístico e verificável.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
506:
Docker revisao para Spring Boot.

507:
Dockerfile multi stage avancado.

508:
Imagem segura e usuario nao root.

509:
Docker Compose aplicado.

510:
Compose com app, banco e cache.
```

A aula 506 respondeu:

```text
como executar
um JAR Spring Boot
dentro de um container?
```

A aula 507 responderá:

```text
como construir
o próprio JAR
dentro do Docker

e entregar somente
o runtime necessário?
```

Nesta aula:

```text
multi-stage:
sim.

builder:
sim.

runtime:
sim.

Maven Wrapper:
sim.

JDK no builder:
sim.

JRE no runtime:
sim.

cache de camadas:
sim.

cache Maven:
sim.

BuildKit:
sim.

build frio:
sim.

build quente:
sim.

testes no build:
sim.

artefato validado:
sim.

imagem executada:
sim.

hardening avançado:
não.

scanner:
não.

filesystem read-only:
não.

Compose:
não.

registry:
não.

pipeline:
não.

Kubernetes:
não.
```

A regra central será:

```text
ferramentas de construção
ficam no estágio builder;

somente o necessário
para executar
chega ao runtime.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

O Dockerfile simples será evoluído para:

```text
Dockerfile
```

com estágios nomeados:

```text
dependencies;

builder;

runtime.
```

A estrutura conceitual será:

```text
Dockerfile
├── dependencies
│   └── preparar cache Maven
├── builder
│   └── compilar, testar e empacotar
└── runtime
    └── executar o JAR
```

Documentação:

```text
docs/devops/docker
├── MULTI_STAGE_BUILD.md
├── DOCKER_BUILD_CACHE.md
├── BUILD_REPRODUCIBILITY.md
└── MULTI_STAGE_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
build independente do JDK local;

build independente do Maven local;

dependências cacheáveis;

testes executados no builder;

JAR copiado entre estágios;

imagem final sem ferramentas de build;

comparação de tempos;

imagem inspecionada;

container validado.
```

Você irá:

1. confirmar a baseline;
2. confirmar BuildKit;
3. revisar o Dockerfile simples;
4. nomear estágios;
5. preparar o Maven Wrapper;
6. corrigir permissão do wrapper;
7. copiar POM separadamente;
8. preparar dependências;
9. utilizar cache Maven;
10. copiar código-fonte depois;
11. executar testes;
12. produzir o JAR;
13. localizar o artefato;
14. criar runtime stage;
15. copiar com `COPY --from`;
16. manter configuração externa;
17. construir imagem;
18. medir build frio;
19. medir build quente;
20. alterar código;
21. alterar POM;
22. comparar invalidação;
23. inspecionar camadas;
24. validar conteúdo;
25. validar execução;
26. validar ausência de Maven;
27. validar reprodutibilidade;
28. documentar;
29. executar o gate;
30. commitar;
31. preparar a aula 508.

---

## Conceito essencial

### Stage

Um stage começa com:

```dockerfile
FROM imagem AS nome
```

Exemplo:

```dockerfile
FROM eclipse-temurin:21-jdk-jammy AS builder
```

O nome permite referenciar o estágio depois.

---

### Builder stage

O builder possui tudo o que é necessário para construir.

Ele pode conter:

- JDK;
- Maven Wrapper;
- código-fonte;
- dependências;
- arquivos temporários;
- resultados de testes;
- cache.

Esses itens não precisam aparecer no runtime.

---

### Runtime stage

O runtime possui apenas o necessário para iniciar a aplicação.

Exemplo:

- JRE;
- JAR;
- diretório de trabalho;
- usuário;
- entrypoint;
- metadata.

---

### `COPY --from`

A instrução:

```dockerfile
COPY --from=builder \
  /workspace/target/app.jar \
  /app/app.jar
```

copia arquivos de um estágio anterior.

Ela não copia o filesystem inteiro.

---

### Cache de camadas

Docker reutiliza uma camada quando:

- a instrução é equivalente;
- os arquivos usados pela instrução não mudaram;
- o contexto relevante permanece igual;
- a camada ainda existe no cache.

Se uma camada é invalidada, as camadas posteriores normalmente precisam ser reconstruídas.

---

### Ordem do Dockerfile

Arquivos que mudam pouco devem aparecer antes.

Exemplo:

```text
wrapper;

POM;

dependências;

código;

build.
```

O código muda mais que o POM.

Por isso, ele deve ser copiado depois do passo de dependências.

---

### Maven Wrapper

Arquivos necessários:

```text
mvnw;

mvnw.cmd;

.mvn/wrapper;
```

Dentro de uma imagem Linux, o script utilizado é:

```text
./mvnw.
```

Ele precisa de permissão de execução.

---

### `dependency:go-offline`

O goal tenta preparar dependências e plugins.

Exemplo:

```powershell
./mvnw `
  dependency:go-offline
```

Ele pode não prever absolutamente todos os downloads de todos os plugins, profiles ou testes.

O cache Maven continua importante.

---

### BuildKit

BuildKit é o mecanismo moderno de build do Docker.

Ele oferece recursos como:

```text
cache mount;

secret mount;

output avançado;

execução paralela;

melhor progresso.
```

Nesta aula será utilizado cache mount.

Secret mount será tratado quando o cenário exigir credenciais privadas.

---

### Cache mount

Exemplo:

```dockerfile
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw package
```

O diretório `/root/.m2` é reutilizado entre builds.

O conteúdo não é copiado para a camada final da mesma forma que um `RUN` tradicional que deixa arquivos no filesystem da camada.

---

### Cache de camadas versus cache mount

#### Cache de camadas

Reutiliza o resultado completo de uma instrução.

#### Cache mount

Reutiliza um diretório mutável durante a execução da instrução.

Se o código muda:

```text
a camada do Maven pode executar novamente;

mas os artefatos Maven
podem continuar no cache mount.
```

---

### Build frio

Build frio ocorre sem cache útil.

Ele precisa:

- baixar base images;
- baixar dependências;
- compilar;
- testar;
- empacotar.

---

### Build quente

Build quente reutiliza cache.

Se nada mudou, várias etapas retornam rapidamente.

---

### Invalidação pelo POM

Mudar:

```text
pom.xml
```

pode invalidar:

- download de dependências;
- compilação;
- testes;
- empacotamento.

Isso é esperado.

---

### Invalidação pelo código

Mudar somente uma classe deve preservar:

- base image;
- wrapper;
- camada de dependências;
- cache Maven.

A compilação e os testes executam novamente.

---

### Testes no build

Nesta aula, o builder executará:

```text
verify.
```

Assim, uma imagem não será produzida a partir de uma suíte vermelha.

Em pipelines reais, pode existir uma separação entre:

- etapa de teste;
- etapa de imagem.

Mesmo assim, o build precisa possuir uma política explícita.

---

### Artefato determinístico

O build deve selecionar um único JAR executável.

Evite copiar:

```text
target/*.jar
```

quando o diretório pode conter:

- JAR original;
- JAR repackaged;
- sources JAR;
- tests JAR.

Defina um `finalName` ou normalize o artefato no builder.

---

### Target stage

Docker permite construir somente um estágio:

```powershell
docker build `
  --target builder `
  .
```

Isso ajuda em diagnóstico.

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

Confirme que a aula 506 continua verde.

---

### 2. Confirmar BuildKit

Execute:

```powershell
docker buildx version
```

Liste builders:

```powershell
docker buildx ls
```

No Docker Desktop, BuildKit normalmente já está habilitado.

---

### 3. Revisar `.dockerignore`

O build multi-stage precisa do código-fonte.

Portanto, o `.dockerignore` da aula 506 precisa ser ajustado.

Remova a exclusão:

```text
src/test
```

Os testes agora serão executados no builder.

Uma versão adequada:

```dockerignore
.git
.github
.idea
.vscode
*.iml

.env
*.log
logs
data

target
docs

compose*.yaml
```

Não ignore:

- `pom.xml`;
- `mvnw`;
- `.mvn`;
- `src/main`;
- `src/test`.

---

### 4. Fixar o nome do JAR

No `pom.xml`, confirme ou adicione:

```xml
<build>
    <finalName>kafka-orders-lab</finalName>
</build>
```

O resultado esperado será:

```text
target/kafka-orders-lab.jar.
```

Não altere `artifactId` somente por causa do Docker.

---

### 5. Criar o estágio de dependências

Início do Dockerfile:

```dockerfile
# syntax=docker/dockerfile:1.7

FROM eclipse-temurin:21-jdk-jammy AS dependencies

WORKDIR /workspace

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

RUN chmod +x mvnw

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw \
      --batch-mode \
      --no-transfer-progress \
      dependency:go-offline
```

O comentário `syntax` habilita a frontend compatível com cache mount.

---

### 6. Criar o estágio builder

```dockerfile
FROM dependencies AS builder

COPY src/ src/

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw \
      --batch-mode \
      --no-transfer-progress \
      clean verify
```

Esse estágio reutiliza:

- JDK;
- wrapper;
- POM;
- dependências.

Depois copia o código.

---

### 7. Normalizar o JAR

Se o `finalName` foi definido:

```text
/workspace/target/kafka-orders-lab.jar.
```

Valide no builder:

```dockerfile
RUN test \
    -f \
    /workspace/target/kafka-orders-lab.jar
```

Esse passo falha cedo se o artefato esperado não existir.

---

### 8. Criar o estágio runtime

```dockerfile
FROM eclipse-temurin:21-jre-jammy AS runtime

WORKDIR /app

COPY --from=builder \
  /workspace/target/kafka-orders-lab.jar \
  /app/app.jar

EXPOSE 8084

USER 10001

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

Apenas o JAR atravessa a fronteira.

---

### 9. Revisar o Dockerfile completo

```dockerfile
# syntax=docker/dockerfile:1.7

FROM eclipse-temurin:21-jdk-jammy AS dependencies

WORKDIR /workspace

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

RUN chmod +x mvnw

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw \
      --batch-mode \
      --no-transfer-progress \
      dependency:go-offline

FROM dependencies AS builder

COPY src/ src/

RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw \
      --batch-mode \
      --no-transfer-progress \
      clean verify

RUN test \
    -f \
    /workspace/target/kafka-orders-lab.jar

FROM eclipse-temurin:21-jre-jammy AS runtime

WORKDIR /app

COPY --from=builder \
  /workspace/target/kafka-orders-lab.jar \
  /app/app.jar

EXPOSE 8084

USER 10001

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

Esse é o baseline da aula.

---

### 10. Remover dependência do `target` local

Apague o diretório local:

```powershell
Remove-Item `
  "target" `
  -Recurse `
  -Force `
  -ErrorAction SilentlyContinue
```

Confirme:

```powershell
Test-Path "target"
```

Resultado esperado:

```text
False.
```

O Docker build precisa funcionar mesmo assim.

---

### 11. Executar build frio

Use progresso detalhado:

```powershell
Measure-Command {
  docker buildx build `
    --progress plain `
    --load `
    --tag `
    "formacao-java/m16-integrations:2.0.0" `
    .
}
```

Registre a duração.

Observe:

- pull das bases;
- download Maven;
- compilação;
- testes;
- JAR;
- runtime.

---

### 12. Executar build quente

Sem alterar arquivos:

```powershell
Measure-Command {
  docker buildx build `
    --progress plain `
    --load `
    --tag `
    "formacao-java/m16-integrations:2.0.0" `
    .
}
```

Compare.

Procure:

```text
CACHED.
```

---

### 13. Alterar somente uma classe

Faça uma alteração sem efeito funcional, como melhorar um comentário ou mensagem interna não contratual.

Reconstrua.

Observe:

- `dependencies` reutilizado;
- cache Maven reutilizado;
- compilação executada;
- testes executados;
- runtime reconstruído com novo JAR.

Depois, reverta a alteração didática se ela não fizer parte do objetivo real.

---

### 14. Alterar o POM de forma controlada

Não adicione dependência inútil.

Uma alteração possível é uma propriedade de build necessária e revisada.

Reconstrua.

Observe que a camada de dependências foi invalidada.

Registre o motivo.

---

### 15. Construir somente o builder

```powershell
docker buildx build `
  --target builder `
  --progress plain `
  .
```

Isso ajuda a diagnosticar falhas de compilação antes do runtime.

---

### 16. Construir sem cache

Use apenas para comparação ou troubleshooting:

```powershell
docker buildx build `
  --no-cache `
  --progress plain `
  --load `
  --tag `
  "formacao-java/m16-integrations:2.0.0-nocache" `
  .
```

Não use `--no-cache` como padrão.

Ele elimina benefícios importantes.

---

### 17. Inspecionar a imagem final

```powershell
docker image inspect `
  "formacao-java/m16-integrations:2.0.0"
```

Confirme:

- entrypoint;
- user;
- exposed port;
- architecture;
- layers.

---

### 18. Comparar imagens

Liste:

```powershell
docker image ls `
  "formacao-java/m16-integrations"
```

Compare:

```text
1.0.0:

JAR construído no host.

2.0.0:

JAR construído no Docker.
```

O tamanho final pode ser parecido, porque ambos usam base runtime e copiam o mesmo JAR.

O benefício principal do multi-stage nesta aula é reprodutibilidade e separação.

---

### 19. Validar ausência de Maven

Inicie um shell temporário:

```powershell
docker run `
  --rm `
  --entrypoint `
  sh `
  "formacao-java/m16-integrations:2.0.0" `
  -c `
  "command -v mvn || true"
```

Resultado esperado:

```text
sem caminho para Maven.
```

Valide `javac`:

```powershell
docker run `
  --rm `
  --entrypoint `
  sh `
  "formacao-java/m16-integrations:2.0.0" `
  -c `
  "command -v javac || true"
```

O runtime não precisa do compilador.

---

### 20. Validar ausência do código-fonte

```powershell
docker run `
  --rm `
  --entrypoint `
  sh `
  "formacao-java/m16-integrations:2.0.0" `
  -c `
  "find / -path '*/src/main/java' 2>/dev/null"
```

Resultado esperado:

```text
nenhum diretório do projeto.
```

---

### 21. Validar o JAR

```powershell
docker run `
  --rm `
  --entrypoint `
  sh `
  "formacao-java/m16-integrations:2.0.0" `
  -c `
  "ls -lh /app/app.jar"
```

---

### 22. Iniciar o container

Remova o container antigo, se existir:

```powershell
docker rm `
  --force `
  "m16-integrations-app" `
  2>$null
```

Inicie com as mesmas configurações da aula 506:

```powershell
docker run `
  --detach `
  --name `
  "m16-integrations-app" `
  --publish `
  "8084:8084" `
  --add-host `
  "host.docker.internal:host-gateway" `
  --env `
  "SPRING_PROFILES_ACTIVE=container" `
  --env `
  "KAFKA_BOOTSTRAP_SERVERS=host.docker.internal:9092" `
  --env `
  "DB_URL=jdbc:h2:file:/data/m16-integrations" `
  --env `
  "FAKE_NOTIFICATION_API_BASE_URL=http://127.0.0.1:8084" `
  --mount `
  "type=volume,source=m16-integrations-data,target=/data" `
  "formacao-java/m16-integrations:2.0.0"
```

---

### 23. Validar health

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health"
```

Depois:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health/readiness"
```

---

### 24. Executar smoke test

Execute a jornada de OS.

Confirme:

- response;
- Outbox;
- Kafka;
- Inbox;
- intent;
- provider;
- logs;
- métricas.

O comportamento precisa ser idêntico ao da imagem 1.0.0.

---

### 25. Validar testes executados no builder

O output do build precisa mostrar a execução da suíte.

Além disso, force um teste controlado a falhar apenas em uma branch de experimento local.

Confirme:

```text
docker build falha;

imagem runtime nova
não é produzida.
```

Depois, reverta imediatamente a falha e reconstrua.

Não versione um teste quebrado.

---

### 26. Inspecionar stages intermediários

Liste cache e imagens:

```powershell
docker buildx du
```

O builder pode existir no cache do build, mas não faz parte do filesystem da imagem runtime.

---

### 27. Revisar uso de `clean`

O comando:

```text
clean verify
```

é previsível.

Entretanto, ele remove `target` dentro do estágio e recompila tudo naquele passo.

O cache Maven reduz downloads, mas não preserva classes compiladas entre builds.

Nesta aula, essa decisão é aceita pela clareza.

Otimizações mais avançadas precisam de evidência de necessidade.

---

### 28. Adicionar labels básicas

No runtime:

```dockerfile
LABEL org.opencontainers.image.title="M16 Integrations Lab"
LABEL org.opencontainers.image.description="Spring Boot integrations lab"
LABEL org.opencontainers.image.version="2.0.0"
```

Não grave:

- token;
- senha;
- commit fictício;
- URL sensível.

Em pipeline, versão e commit poderão ser passados por build args controlados.

---

### 29. Criar documentação multi-stage

Arquivo:

```text
MULTI_STAGE_BUILD.md
```

Inclua:

- stages;
- inputs;
- outputs;
- comandos;
- artefato;
- testes;
- limitações;
- decisões.

---

### 30. Criar documentação de cache

Arquivo:

```text
DOCKER_BUILD_CACHE.md
```

Tabela:

```markdown
| Mudança | Dependencies stage | Build stage | Runtime |
|---|---:|---:|---:|
| Nenhuma | Cache | Cache | Cache |
| Classe Java | Cache | Reexecuta | Reexecuta |
| Teste | Cache | Reexecuta | Pode reexecutar |
| pom.xml | Reexecuta | Reexecuta | Reexecuta |
| Runtime base | Cache builder | Cache builder | Reexecuta |
| Dockerfile antes do COPY | Pode invalidar | Pode invalidar | Reexecuta |
```

---

### 31. Criar documentação de reprodutibilidade

Arquivo:

```text
BUILD_REPRODUCIBILITY.md
```

Registre:

- wrapper versionado;
- Java major;
- base images;
- artifact name;
- tests;
- cache;
- rede;
- repositórios Maven;
- timestamps;
- dependências dinâmicas;
- tags mutáveis;
- limitações.

Uma tag como:

```text
21-jdk-jammy
```

pode receber atualizações.

Pin por digest será tratado quando a estratégia de segurança e atualização for aprofundada.

---

### 32. Criar troubleshooting

Arquivo:

```text
MULTI_STAGE_TROUBLESHOOTING.md
```

Inclua:

- `mvnw` sem permissão;
- `.mvn` ausente;
- POM não copiado;
- dependência privada;
- cache corrompido;
- JAR não encontrado;
- JAR com nome diferente;
- teste falhando;
- BuildKit desabilitado;
- `--mount` desconhecido;
- runtime com Maven por engano;
- código-fonte copiado ao runtime;
- cache não reutilizado;
- build lento.

---

### 33. Executar gate final no host

Mesmo que os testes rodem no builder:

```powershell
.\mvnw.cmd clean verify
```

Depois:

```powershell
git diff --check
git status
```

O host e o builder devem concordar.

---

## Entendendo o que foi feito

### O build entrou no Docker

O JAR não depende mais de uma execução anterior no host.

### Builder e runtime foram separados

Ferramentas de compilação não chegaram à imagem final.

### O wrapper foi versionado como contrato

A versão de Maven deixou de depender da máquina.

### A ordem do Dockerfile melhorou o cache

POM e wrapper aparecem antes do código.

### Cache de camada e cache Maven trabalharam juntos

Mudanças no código não exigiram novo download completo.

### Os testes viraram gate da imagem

Uma suíte vermelha impede a criação do runtime novo.

### O artefato ganhou nome determinístico

`COPY --from` deixou de depender de wildcard ambíguo.

### A imagem final permaneceu simples

Runtime, JAR e entrypoint continuam visíveis.

### O comportamento foi preservado

A jornada da aplicação não mudou.

### A segurança avançada permaneceu para a próxima aula

A refatoração atual concentrou build e cache.

---

## Erros comuns importantes

### Copiar tudo antes do `go-offline`

Qualquer mudança invalida as dependências.

### Ignorar `.mvn`

O Maven Wrapper pode não iniciar.

### Usar `mvn` em vez de wrapper

A versão depende da base.

### Executar testes apenas no host

`docker build` pode produzir imagem sem validar a suíte.

### Copiar `target/*.jar`

Mais de um artefato pode corresponder.

### Copiar o builder inteiro

Código, cache e ferramentas chegam ao runtime.

### Usar a imagem JDK como runtime

A imagem final contém ferramentas desnecessárias.

### Desabilitar cache sempre

O build fica mais lento sem necessidade.

### Confiar no cache para correção

Cache acelera; testes e checks garantem.

### Mudar o POM só para medir cache

Dependência inútil vira dívida.

### Esconder toda a lógica em scripts

O Dockerfile deixa de explicar o pipeline.

### Antecipar hardening avançado

A próxima aula possui esse escopo.

---

## Comandos úteis

### Build multi-stage

```powershell
docker buildx build `
  --load `
  -t `
  "formacao-java/m16-integrations:2.0.0" `
  .
```

### Build detalhado

```powershell
docker buildx build `
  --progress plain `
  --load `
  -t `
  "formacao-java/m16-integrations:2.0.0" `
  .
```

### Build de stage

```powershell
docker buildx build `
  --target builder `
  .
```

### Build sem cache

```powershell
docker buildx build `
  --no-cache `
  --load `
  -t `
  "formacao-java/m16-integrations:2.0.0-nocache" `
  .
```

### Uso do cache

```powershell
docker buildx du
```

### Histórico

```powershell
docker history `
  "formacao-java/m16-integrations:2.0.0"
```

### Inspeção

```powershell
docker image inspect `
  "formacao-java/m16-integrations:2.0.0"
```

---

## Exercício guiado

### Parte 1 — Contexto

Ajuste `.dockerignore`.

### Parte 2 — Artefato

Defina nome determinístico.

### Parte 3 — Dependências

Crie stage de cache.

### Parte 4 — Builder

Execute Maven Wrapper e testes.

### Parte 5 — Runtime

Copie somente o JAR.

### Parte 6 — Cache

Compare build frio e quente.

### Parte 7 — Invalidação

Mude código e POM de forma controlada.

### Parte 8 — Inspeção

Prove ausência de Maven e fonte.

### Parte 9 — Execução

Valide health e smoke test.

### Parte 10 — Documentação

Registre decisões e troubleshooting.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 506 foi preservada;
- Dockerfile multi-stage foi criado;
- BuildKit foi validado;
- `.dockerignore` foi revisado;
- código-fonte permaneceu no contexto;
- testes permaneceram no contexto;
- target local foi ignorado;
- nome final do JAR foi definido;
- wildcard ambíguo foi eliminado;
- stage dependencies foi criado;
- stage builder foi criado;
- stage runtime foi criado;
- stages foram nomeados;
- JDK 21 foi usado no builder;
- JRE 21 foi usado no runtime;
- WORKDIR do builder foi definido;
- `.mvn` foi copiado;
- `mvnw` foi copiado;
- `pom.xml` foi copiado;
- permissão de execução foi aplicada;
- `dependency:go-offline` foi executado;
- cache mount Maven foi usado;
- código foi copiado depois das dependências;
- testes foram executados no builder;
- `clean verify` foi executado;
- existência do JAR foi validada;
- `COPY --from` foi usado;
- somente o JAR foi copiado;
- entrypoint foi preservado;
- porta foi preservada;
- configuração externa foi preservada;
- usuário não root da baseline foi preservado;
- target local foi removido antes do build;
- build sem JAR local funcionou;
- build frio foi medido;
- build quente foi medido;
- cache foi observado;
- alteração de código foi testada;
- alteração do POM foi analisada;
- invalidação foi documentada;
- builder isolado foi construído;
- build sem cache foi comparado;
- imagem final foi inspecionada;
- imagens 1.0.0 e 2.0.0 foram comparadas;
- ausência de Maven foi validada;
- ausência de javac foi validada;
- ausência de código-fonte foi validada;
- JAR final foi validado;
- container foi iniciado;
- health foi validado;
- readiness foi validada;
- smoke test foi executado;
- comportamento permaneceu igual;
- falha de teste impediu a imagem nova;
- cache do builder foi inspecionado;
- impacto de `clean` foi explicado;
- labels básicas foram adicionadas;
- documentação multi-stage foi criada;
- documentação de cache foi criada;
- documentação de reprodutibilidade foi criada;
- troubleshooting foi criado;
- hardening avançado não foi antecipado;
- scanner não foi antecipado;
- pin por digest não foi aprofundado;
- Compose não foi antecipado;
- pipeline não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 508 está correta.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat
```

Adicione:

```powershell
git add `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/Dockerfile `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/.dockerignore `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/pom.xml `
  docs/devops/docker `
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
git commit -m "build(m17): criar Dockerfile multi stage"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- cache Maven;
- diretório target;
- imagem exportada;
- tar;
- banco;
- logs;
- token;
- senha;
- dependência inútil;
- teste quebrado;
- arquivo temporário;
- hardening da aula 508.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o Docker deixou de ser apenas um empacotador de um JAR produzido no host.

O fluxo passou a ser:

```text
Docker recebe
o repositório;

builder prepara
dependências;

builder compila;

builder testa;

builder empacota;

runtime recebe
somente o JAR.
```

Você comprovou que:

- múltiplos `FROM` criam estágios;
- o builder não faz parte do runtime;
- `COPY --from` transfere somente o artefato;
- Maven Wrapper reduz dependência do host;
- POM antes do código melhora cache;
- cache mount reduz downloads repetidos;
- build frio e quente possuem custos diferentes;
- alteração de código não precisa invalidar dependências;
- alteração do POM precisa;
- testes podem bloquear a criação da imagem;
- o runtime não precisa de Maven, javac ou fonte;
- o comportamento da aplicação permanece igual.

A próxima aula será:

```text
508 - M17.03 - Imagem segura e usuario nao root
```

Nela, você irá:

- revisar a superfície da imagem;
- aprofundar usuário e grupo;
- revisar ownership e permissões;
- reduzir privilégios;
- avaliar filesystem read-only;
- revisar arquivos temporários;
- revisar secrets;
- revisar base images;
- revisar atualização e pinning;
- aplicar validações de segurança no runtime.

Nenhum hardening avançado foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei os estágios.
- [ ] Usei Maven Wrapper.
- [ ] Preparei cache de dependências.
- [ ] Executei testes no builder.
- [ ] Copiei somente o JAR.
- [ ] Comparei builds.
- [ ] Inspecionei a imagem final.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### `./mvnw: Permission denied`

Confirme:

```dockerfile
RUN chmod +x mvnw
```

### O wrapper não baixa Maven

Confirme `.mvn/wrapper` e acesso de rede.

### `dependency:go-offline` ainda baixa itens depois

Alguns plugins ou profiles podem resolver dependências adicionais.

### `--mount` não é reconhecido

Confirme BuildKit e a diretiva `syntax`.

### O JAR não existe

Revise `finalName`, plugin Spring Boot e resultado do Maven.

### O runtime contém Maven

A imagem final pode estar usando o stage errado.

### O código-fonte aparece no runtime

Algum `COPY . .` foi executado no último estágio.

### O cache nunca é usado

Revise ordem de COPY, builder ativo e mudanças no contexto.

### Mudar uma classe baixa todas as dependências

O POM ou wrapper pode estar sendo copiado junto com o código.

### O build passa, mas o container falha

A falha é de runtime, configuração ou dependência externa.

### `clean verify` está lento

O cache Maven reduz rede, mas a compilação continua deliberadamente completa.

### A imagem final ficou maior

Compare bases e arquivos copiados; multi-stage não garante redução automática quando o runtime anterior já era simples.

---

## Perguntas de revisão

1. O que é um stage?
2. O que é builder?
3. O que é runtime?
4. O que faz `COPY --from`?
5. Por que copiar o POM antes?
6. O que invalida cache?
7. O que é cache mount?
8. Cache mount entra no runtime?
9. Para que serve Maven Wrapper?
10. Por que usar JDK no builder?
11. Por que usar JRE no runtime?
12. Por que evitar wildcard de JAR?
13. O que é build frio?
14. O que é build quente?
15. Mudar código invalida dependências?
16. Mudar POM invalida dependências?
17. Teste falho deve gerar imagem?
18. Maven existe no runtime?
19. O comportamento da aplicação mudou?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Seção iniciada por FROM.
2. Ambiente de construção.
3. Ambiente de execução.
4. Copiar entre estágios.
5. Reutilizar dependências.
6. Mudança na instrução ou input.
7. Diretório reutilizável do build.
8. Não.
9. Fixar execução do Maven.
10. Compilar Java.
11. Executar com menos ferramentas.
12. Evitar artefato ambíguo.
13. Sem cache útil.
14. Com cache reutilizado.
15. Não a camada de dependências.
16. Sim.
17. Não.
18. Não.
19. Não.
20. Imagem segura e usuario nao root.

---

## Desafio opcional

Crie um estágio adicional:

```text
test-report.
```

Objetivo:

```text
exportar relatórios
de teste
como output do build.
```

Requisitos:

- não copiar relatórios para o runtime;
- manter testes obrigatórios;
- documentar o comando de output;
- preservar cache;
- não publicar dados sensíveis;
- não antecipar pipeline CI.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 507 - M17.02 - Dockerfile multi stage avancado

- Continuei após a revisão de Docker para Spring Boot.
- Revisei o conceito de stages.
- Criei stage de dependências.
- Criei stage builder.
- Criei stage runtime.
- Usei JDK 21 no builder.
- Usei JRE 21 no runtime.
- Copiei Maven Wrapper e POM antes do código.
- Corrigi permissão do `mvnw`.
- Executei `dependency:go-offline`.
- Usei cache mount para `.m2`.
- Copiei o código depois das dependências.
- Executei `clean verify` no builder.
- Impedi imagem nova com testes vermelhos.
- Defini nome determinístico do JAR.
- Validei a existência do artefato.
- Usei `COPY --from`.
- Copiei somente o JAR.
- Removi dependência do `target` local.
- Executei build frio.
- Executei build quente.
- Analisei invalidação por código.
- Analisei invalidação por POM.
- Construí somente o builder.
- Comparei build com e sem cache.
- Inspecionei a imagem final.
- Confirmei ausência de Maven.
- Confirmei ausência de javac.
- Confirmei ausência de código-fonte.
- Executei o container.
- Validei health e smoke test.
- Preservei o comportamento da aplicação.
- Documentei cache e reprodutibilidade.
- Não antecipei o hardening da aula seguinte.
- Próxima aula: Imagem segura e usuario nao root.
```

---

## Referência técnica curta

- Docker Multi-stage Builds.
- Docker Build Cache.
- BuildKit.
- Cache Mounts.
- Dockerfile `COPY --from`.
- Maven Wrapper.
- Maven Dependency Plugin.
- Spring Boot Maven Plugin.
- OCI Image Labels.
- Reproducible Builds.

Regra final:

```text
o Dockerfile multi-stage torna o build da aplicação reproduzível dentro do Docker: o estágio de dependências copia Maven Wrapper e POM antes do código, prepara artefatos com `dependency:go-offline` e reutiliza um cache mount para `.m2`; o builder copia fontes e testes, executa `clean verify`, valida um JAR de nome determinístico e impede a produção de uma imagem quando a suíte falha; o runtime utiliza Java 21 Runtime e recebe somente `/app/app.jar` por `COPY --from`, sem Maven, javac, código-fonte ou cache do builder; builds frios e quentes tornam visível a estratégia de cache, mudanças em classes preservam dependências e mudanças no POM invalidam a resolução necessária; a imagem final mantém porta, configuração, entrypoint e comportamento da aula anterior, enquanto hardening de usuário, permissões, filesystem, secrets e base image permanece reservado para a aula 508.
```
