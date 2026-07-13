# 508 - M17.03 - Imagem segura e usuario nao root

## Apresentação da aula

Na aula 507, você evoluiu o empacotamento da aplicação Spring Boot para um Dockerfile multi-stage.

O fluxo passou a ser:

```text
dependencies stage;

builder stage;

runtime stage.
```

O estágio de construção recebeu:

- JDK 21;
- Maven Wrapper;
- POM;
- dependências;
- fontes;
- testes;
- empacotamento.

O estágio final recebeu somente:

```text
Java Runtime;

JAR executável;

porta;

entrypoint.
```

Isso eliminou do runtime:

- Maven;
- `javac`;
- código-fonte;
- cache `.m2`;
- relatórios de teste;
- arquivos intermediários.

A separação entre build e runtime foi um avanço importante.

Entretanto, uma imagem pequena ou multi-stage não é automaticamente uma imagem segura.

Ainda precisamos responder:

```text
qual usuário executa o processo?

quais arquivos ele pode alterar?

quais diretórios precisam
ser graváveis?

quais capabilities
o processo realmente precisa?

o container pode
elevar privilégios?

o filesystem raiz
precisa ser gravável?

como proteger volumes?

como impedir segredos
nas camadas?

como validar
o endurecimento?
```

A pergunta central desta aula será:

```text
como executar
a aplicação Spring Boot

com o menor conjunto
de privilégios necessário

sem quebrar
persistência,
logs,
health
ou graceful shutdown?
```

O foco será o princípio do menor privilégio.

A aplicação escuta na porta:

```text
8084.
```

Portas acima de 1024 não exigem o privilégio tradicional de bind em porta baixa.

A aplicação também não precisa:

- alterar rede;
- montar filesystem;
- carregar módulo do kernel;
- executar `sudo`;
- gerenciar usuários;
- modificar o sistema operacional;
- acessar dispositivos do host;
- abrir shell administrativo;
- executar como `root`.

O runtime será evoluído para possuir:

```text
grupo dedicado;

usuário dedicado;

UID explícito;

GID explícito;

diretórios controlados;

ownership explícito;

COPY com --chown;

filesystem raiz read-only;

tmpfs em /tmp;

volume gravável em /data;

capabilities removidas;

no-new-privileges;

limites básicos;

validações automatizadas.
```

A aula também diferenciará três conceitos que costumam ser confundidos:

```text
usuário não root
dentro do container;

user namespace remapping;

Docker rootless mode.
```

Eles se complementam, mas não são equivalentes.

Nesta aula, o requisito obrigatório será:

```text
a aplicação executa
como usuário não root
dentro do container.
```

`userns-remap` e rootless mode serão explicados como mecanismos adicionais da plataforma.

A aula manterá a base:

```text
eclipse-temurin:21-jre-jammy.
```

A troca para outra distribuição não será feita apenas para buscar um número menor de megabytes.

Base image envolve:

- compatibilidade;
- certificados;
- biblioteca C;
- atualizações;
- ferramentas disponíveis;
- política de manutenção;
- conhecimento operacional.

A imagem também continuará utilizando:

```text
multi-stage build.
```

A segurança será adicionada sem desfazer:

- cache Maven;
- testes no builder;
- JAR determinístico;
- configuração externa;
- logs em stdout;
- Actuator;
- graceful shutdown.

A execução endurecida utilizará opções como:

```text
--read-only;

--tmpfs;

--cap-drop ALL;

--security-opt no-new-privileges=true;

--pids-limit;

--memory;

--cpus.
```

Essas opções pertencem ao runtime.

O Dockerfile define uma baseline segura.

O comando de execução ou o orquestrador adiciona controles do ambiente.

A aula não irá antecipar:

```text
Docker Compose completo;

gestão avançada de secrets;

healthcheck dedicado;

registry;

scan obrigatório no pipeline;

assinatura de imagem;

Kubernetes SecurityContext;

NetworkPolicy;

admission policies.
```

Esses assuntos possuem aulas próprias ou serão aprofundados posteriormente.

A próxima aula será:

```text
509 - M17.04 - Docker Compose para API completa
```

Portanto, o resultado desta aula será uma imagem endurecida que poderá ser reutilizada no Compose.

Ao final, você deverá explicar:

```text
por que USER 10001
é melhor que root;

por que UID e GID
devem ser explícitos;

por que COPY --chown
é importante;

por que /app
deve permanecer read-only;

por que /tmp
pode usar tmpfs;

por que /data
precisa de volume;

por que cap-drop ALL
é possível nesta aplicação;

o que no-new-privileges
protege;

por que ARG e ENV
não são cofres de segredo;

como provar
que a imagem está endurecida.
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
Docker Compose para API completa.

510:
Variaveis secrets e configuracao.

511:
Healthcheck em containers.
```

A aula 507 respondeu:

```text
como construir
o JAR dentro do Docker

e entregar somente
o runtime necessário?
```

A aula 508 responderá:

```text
como reduzir privilégios
e controlar escrita
no runtime?
```

Nesta aula:

```text
usuário dedicado:
sim.

grupo dedicado:
sim.

UID/GID explícitos:
sim.

COPY --chown:
sim.

diretórios graváveis:
sim.

read-only root filesystem:
sim.

tmpfs:
sim.

volume:
sim.

cap-drop:
sim.

no-new-privileges:
sim.

limites básicos:
sim.

validação automática:
sim.

base image policy:
sim.

digest:
conceito e registro.

build secrets:
conceito preventivo.

Compose:
não.

secrets avançados:
não.

healthcheck dedicado:
não.

Kubernetes:
não.
```

A regra central será:

```text
o processo recebe
somente os privilégios
e caminhos de escrita
necessários para executar.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

O Dockerfile multi-stage será endurecido.

Também serão criados:

```text
scripts/docker/verify-image-security.ps1

docs/devops/docker
├── IMAGE_SECURITY_POLICY.md
├── NON_ROOT_RUNTIME.md
├── READ_ONLY_FILESYSTEM.md
├── IMAGE_SECURITY_CHECKLIST.md
└── IMAGE_SECURITY_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
imagem multi-stage;

usuário app;

grupo app;

UID 10001;

GID 10001;

ownership controlado;

root filesystem read-only;

tmpfs para temporários;

volume para dados;

zero capabilities efetivas;

no-new-privileges;

limites de processo;

verificação reproduzível.
```

Você irá:

1. confirmar a baseline;
2. inspecionar o usuário atual;
3. inspecionar permissões;
4. criar usuário e grupo;
5. definir UID e GID;
6. preparar `/app`;
7. preparar `/data`;
8. preparar `/tmp`;
9. copiar JAR com ownership;
10. definir `USER`;
11. construir a imagem;
12. validar identidade;
13. validar escrita permitida;
14. validar escrita proibida;
15. executar com rootfs read-only;
16. montar tmpfs;
17. montar volume;
18. remover capabilities;
19. impedir elevação;
20. aplicar limites;
21. validar health;
22. validar smoke test;
23. validar shutdown;
24. revisar base image;
25. revisar digest;
26. revisar segredos de build;
27. criar script de segurança;
28. documentar política;
29. executar gate;
30. commitar;
31. preparar o Compose.

---

## Conceito essencial

### Root dentro do container

O usuário `root` do container é o UID 0 dentro daquele namespace.

O isolamento reduz o alcance em comparação com um processo root direto no host.

Mesmo assim, executar sem necessidade como UID 0 aumenta o impacto possível de:

- vulnerabilidade na aplicação;
- escape de container;
- montagem insegura;
- capability excessiva;
- arquivo compartilhado;
- socket Docker montado;
- configuração incorreta.

A primeira defesa é não usar root quando a aplicação não precisa.

---

### Usuário não root

O Dockerfile utilizará:

```text
app.
```

Com:

```text
UID:
10001.

GID:
10001.
```

IDs explícitos ajudam a tornar ownership previsível.

Eles também facilitam políticas de plataforma e auditoria.

---

### Nome versus ID

Dentro da imagem, `app` melhora legibilidade.

O kernel trabalha com IDs numéricos.

Em mounts e ambientes diferentes, o ID costuma ser mais importante que o nome.

Por isso serão definidos:

```dockerfile
ARG APP_UID=10001
ARG APP_GID=10001
```

Esses argumentos não são segredos.

---

### `USER`

A instrução:

```dockerfile
USER app:app
```

define o usuário padrão para:

- `ENTRYPOINT`;
- `CMD`;
- comandos executados sem override;
- container criado a partir da imagem.

O operador ainda pode sobrescrever com `--user`.

Por isso a validação de runtime continua necessária.

---

### `COPY --chown`

Sem ownership explícito, arquivos copiados normalmente pertencem a root.

A aplicação precisa ler o JAR.

Ela não precisa modificá-lo.

Usaremos:

```dockerfile
COPY --from=builder \
  --chown=app:app \
  /workspace/target/kafka-orders-lab.jar \
  /app/app.jar
```

---

### Diretório da aplicação

`/app` conterá:

```text
app.jar.
```

A aplicação precisa:

```text
ler.
```

Ela não precisa:

```text
escrever;

substituir;

instalar;

alterar.
```

No runtime endurecido, `/app` permanecerá read-only.

---

### Diretório de dados

O laboratório utiliza banco H2 em arquivo.

O caminho será:

```text
/data.
```

Esse diretório precisa ser gravável pelo usuário `app`.

Ele será montado como volume.

Em produção, um banco externo normalmente substituiria esse armazenamento local.

---

### Diretório temporário

A JVM e bibliotecas podem utilizar:

```text
/tmp.
```

Com root filesystem read-only, `/tmp` precisa de um filesystem gravável separado.

Usaremos tmpfs:

```text
memória;

efêmero;

limitado;

sem persistência.
```

---

### Root filesystem read-only

A opção:

```text
--read-only.
```

torna o filesystem raiz do container somente leitura.

Exceções graváveis precisam ser montadas explicitamente.

Isso reduz a capacidade de:

- modificar o JAR;
- instalar arquivo;
- persistir artefato inesperado;
- alterar configuração da imagem;
- esconder mudança no container.

Não impede todos os ataques.

É uma camada adicional.

---

### Capabilities

Linux capabilities dividem privilégios tradicionalmente associados ao root.

A aplicação Spring Boot na porta 8084 não precisa das capabilities padrão do container.

Usaremos:

```text
--cap-drop ALL.
```

Se uma necessidade real aparecer, uma capability específica deve ser justificada e adicionada.

Não use:

```text
--privileged.
```

---

### `no-new-privileges`

A opção:

```text
--security-opt no-new-privileges=true
```

impede o processo e seus filhos de obter novos privilégios por mecanismos como executáveis setuid ou file capabilities.

Ela não substitui usuário não root.

Ela complementa.

---

### Limite de processos

A opção:

```text
--pids-limit 256
```

limita a quantidade de processos e threads no cgroup conforme o runtime.

O valor precisa ser validado com a aplicação.

Um limite baixo demais pode impedir a JVM de criar threads necessárias.

---

### Limites de memória e CPU

Exemplos:

```text
--memory 768m;

--cpus 1.0.
```

Esses valores são didáticos.

Eles não representam capacity planning.

A JVM moderna reconhece limites de container, mas a configuração ainda precisa ser observada por:

- heap;
- metaspace;
- threads;
- buffers;
- native memory;
- margem do sistema.

---

### Rootless mode

Rootless mode executa daemon e containers sem privilégios root do host.

É uma configuração da plataforma Docker.

Ela não é criada por `USER app`.

As duas práticas podem ser combinadas.

---

### `userns-remap`

User namespace remapping mapeia UIDs do container para uma faixa sem privilégio no host.

Também é uma configuração do daemon.

Ela pode complicar bind mounts e ownership.

Não será configurada nesta aula.

---

### Secrets no build

Não use:

```dockerfile
ARG TOKEN=...

ENV TOKEN=...
```

como cofre.

Build args e environment variables podem aparecer em histórico, metadata ou camadas.

Quando o build precisa acessar um repositório privado, BuildKit secret mounts são o mecanismo apropriado.

A aula 510 aprofundará variáveis, secrets e configuração.

---

### Base image

A base precisa possuir:

- origem conhecida;
- manutenção;
- Java compatível;
- atualizações;
- tamanho aceitável;
- política de patch;
- documentação.

Imagem mínima não significa automaticamente imagem segura.

Uma base muito limitada pode dificultar certificados, diagnóstico e compatibilidade.

---

### Tag e digest

Uma tag pode apontar para conteúdo atualizado ao longo do tempo.

Um digest identifica conteúdo específico.

Pinning por digest aumenta reprodutibilidade.

Também exige uma política de atualização para não congelar vulnerabilidades.

Nesta aula, você irá registrar o digest atual da base sem inventar um valor fixo no material.

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

Depois:

```powershell
docker buildx build `
  --load `
  --tag `
  "formacao-java/m16-integrations:2.0.0" `
  .
```

A aula 507 precisa continuar verde.

---

### 2. Inspecionar o usuário atual

Execute:

```powershell
docker image inspect `
  "formacao-java/m16-integrations:2.0.0" `
  --format `
  "{{.Config.User}}"
```

A baseline anterior pode mostrar:

```text
10001.
```

Nesta aula, o usuário também ganhará nome e grupo explícitos.

---

### 3. Inspecionar o filesystem atual

```powershell
docker run `
  --rm `
  --entrypoint `
  sh `
  "formacao-java/m16-integrations:2.0.0" `
  -c `
  "id && ls -ld /app /data /tmp 2>/dev/null || true"
```

Registre:

- UID;
- GID;
- ownership;
- caminhos ausentes;
- caminhos graváveis.

---

### 4. Evoluir o runtime stage

Mantenha os estágios `dependencies` e `builder`.

Substitua o runtime por:

```dockerfile
FROM eclipse-temurin:21-jre-jammy AS runtime

ARG APP_UID=10001
ARG APP_GID=10001

RUN groupadd \
      --gid "${APP_GID}" \
      app \
    && useradd \
      --uid "${APP_UID}" \
      --gid "${APP_GID}" \
      --no-create-home \
      --shell /usr/sbin/nologin \
      --no-log-init \
      app \
    && mkdir -p \
      /app \
      /data \
      /tmp \
    && chown -R \
      app:app \
      /app \
      /data \
      /tmp

WORKDIR /app

COPY --from=builder \
  --chown=app:app \
  /workspace/target/kafka-orders-lab.jar \
  /app/app.jar

LABEL org.opencontainers.image.title="M16 Integrations Lab"
LABEL org.opencontainers.image.description="Spring Boot integrations lab"
LABEL org.opencontainers.image.version="3.0.0"

EXPOSE 8084

USER app:app

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
```

O `RUN` é executado como root durante o build.

O processo final executa como `app`.

---

### 5. Revisar o Dockerfile completo

A estrutura final será:

```text
syntax;

dependencies stage;

builder stage;

runtime stage;

usuário;

diretórios;

ownership;

JAR;

labels;

porta;

USER;

ENTRYPOINT.
```

Não copie:

- shell script desnecessário;
- token;
- `.env`;
- certificado privado;
- banco;
- logs;
- arquivos de teste.

---

### 6. Construir a imagem endurecida

```powershell
docker buildx build `
  --progress plain `
  --load `
  --tag `
  "formacao-java/m16-integrations:3.0.0" `
  .
```

Confirme que os testes do builder continuam executando.

---

### 7. Validar usuário e grupo

```powershell
docker run `
  --rm `
  --entrypoint `
  id `
  "formacao-java/m16-integrations:3.0.0"
```

Resultado esperado:

```text
uid=10001(app);

gid=10001(app).
```

A apresentação exata pode variar, mas os IDs devem corresponder.

---

### 8. Validar ownership do JAR

```powershell
docker run `
  --rm `
  --entrypoint `
  sh `
  "formacao-java/m16-integrations:3.0.0" `
  -c `
  "ls -ln /app/app.jar"
```

Confirme:

```text
UID:
10001.

GID:
10001.
```

---

### 9. Validar que o JAR não precisa ser gravável

```powershell
docker run `
  --rm `
  --entrypoint `
  sh `
  "formacao-java/m16-integrations:3.0.0" `
  -c `
  "test -r /app/app.jar && test ! -w /app/app.jar"
```

Se o arquivo ainda for gravável pelo owner, ajuste permissões:

```dockerfile
RUN chmod 0444 /app/app.jar
```

Como o arquivo chega depois do `RUN`, aplique uma etapa no runtime após o `COPY`:

```dockerfile
USER root

RUN chmod 0444 /app/app.jar

USER app:app
```

Evite alternar usuários repetidamente.

Uma alternativa mais limpa é copiar, ajustar uma vez e definir `USER` apenas no final.

---

### 10. Definir permissões finais

Use no runtime:

```dockerfile
COPY --from=builder \
  --chown=app:app \
  /workspace/target/kafka-orders-lab.jar \
  /app/app.jar

RUN chmod 0444 /app/app.jar

USER app:app
```

O usuário lê o JAR.

Ele não altera o artefato.

---

### 11. Criar volume limpo

Remova somente o volume de teste se os dados não precisarem ser preservados:

```powershell
docker volume rm `
  "m17-secure-data" `
  2>$null
```

Crie:

```powershell
docker volume create `
  "m17-secure-data"
```

---

### 12. Executar com controles de segurança

```powershell
docker run `
  --detach `
  --name `
  "m17-secure-app" `
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
  "type=volume,source=m17-secure-data,target=/data" `
  --read-only `
  --tmpfs `
  "/tmp:rw,noexec,nosuid,size=64m,mode=1777" `
  --cap-drop `
  "ALL" `
  --security-opt `
  "no-new-privileges=true" `
  --pids-limit `
  "256" `
  --memory `
  "768m" `
  --cpus `
  "1.0" `
  "formacao-java/m16-integrations:3.0.0"
```

Não use token real no comando.

---

### 13. Validar o usuário em runtime

```powershell
docker exec `
  "m17-secure-app" `
  id
```

Confirme UID e GID 10001.

---

### 14. Validar root filesystem read-only

```powershell
docker exec `
  "m17-secure-app" `
  sh `
  -c `
  "touch /app/forbidden.txt"
```

Resultado esperado:

```text
falha por filesystem
somente leitura
ou permissão.
```

Confirme que o arquivo não existe:

```powershell
docker exec `
  "m17-secure-app" `
  sh `
  -c `
  "test ! -e /app/forbidden.txt"
```

---

### 15. Validar `/tmp`

```powershell
docker exec `
  "m17-secure-app" `
  sh `
  -c `
  "echo temporary > /tmp/allowed.txt && cat /tmp/allowed.txt"
```

O arquivo deve existir durante a execução atual.

Ele desaparecerá quando o container for removido.

---

### 16. Validar `/data`

```powershell
docker exec `
  "m17-secure-app" `
  sh `
  -c `
  "echo persistent > /data/security-check.txt && cat /data/security-check.txt"
```

O volume deve aceitar escrita pelo usuário `app`.

---

### 17. Validar capabilities

```powershell
docker exec `
  "m17-secure-app" `
  sh `
  -c `
  "grep '^CapEff:' /proc/1/status"
```

Com `--cap-drop ALL`, o valor efetivo esperado deve representar zero capabilities.

---

### 18. Validar `no-new-privileges`

```powershell
docker exec `
  "m17-secure-app" `
  sh `
  -c `
  "grep '^NoNewPrivs:' /proc/1/status"
```

Resultado esperado:

```text
NoNewPrivs:
1.
```

---

### 19. Validar limites

```powershell
docker inspect `
  "m17-secure-app" `
  --format `
  "Memory={{.HostConfig.Memory}} NanoCpus={{.HostConfig.NanoCpus}} PidsLimit={{.HostConfig.PidsLimit}}"
```

Confirme que os limites foram aplicados.

---

### 20. Validar health sem criar HEALTHCHECK antecipado

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health"
```

Depois:

```powershell
Invoke-RestMethod `
  "http://localhost:8084/actuator/health/readiness"
```

A aula 511 criará a política dedicada de healthcheck em containers.

---

### 21. Executar smoke test

Execute a jornada de criação de OS.

Confirme:

- HTTP;
- Outbox;
- Kafka;
- Inbox;
- intent;
- provider;
- logs;
- métricas.

A segurança do runtime não pode quebrar o comportamento esperado.

---

### 22. Validar persistência

Pare e remova o container:

```powershell
docker stop `
  --time `
  30 `
  "m17-secure-app"

docker rm `
  "m17-secure-app"
```

Crie novamente com o mesmo volume.

Confirme:

```text
/data/security-check.txt
permanece.
```

O arquivo em `/tmp` não deve permanecer.

---

### 23. Validar graceful shutdown

Acompanhe:

```powershell
docker logs `
  --follow `
  "m17-secure-app"
```

Em outro terminal:

```powershell
docker stop `
  --time `
  30 `
  "m17-secure-app"
```

Confirme encerramento sem `kill` forçado.

---

### 24. Validar que root não é necessário

Tente executar o container sem override.

Confirme usuário `app`.

Depois, documente que:

```text
docker run --user 0
```

pode sobrescrever a imagem quando a plataforma permite.

A política operacional deve impedir overrides não autorizados.

Não use root para corrigir permissões de volume como solução permanente.

---

### 25. Comparar bind mount e volume

Um bind mount do Windows pode apresentar ownership diferente.

Exemplo conceitual:

```text
host path
-> /data.
```

Se houver falha, investigue:

- UID/GID;
- Docker Desktop;
- permissões;
- filesystem;
- user namespace.

Para o laboratório, named volume é a baseline.

---

### 26. Revisar a base image

Execute:

```powershell
docker buildx imagetools inspect `
  "eclipse-temurin:21-jre-jammy"
```

Registre:

- digest;
- platforms;
- data da inspeção;
- tag.

Não copie um digest antigo de outro documento.

---

### 27. Documentar política de atualização

No arquivo:

```text
IMAGE_SECURITY_POLICY.md
```

Registre:

```text
base conhecida;

digest registrado;

rebuild periódico;

testes obrigatórios;

smoke test;

rollback de tag;

responsável.
```

Pinning sem atualização pode manter vulnerabilidades conhecidas.

Atualização sem testes pode introduzir regressão.

A política precisa dos dois lados.

---

### 28. Revisar segredos de build

Procure:

```powershell
git grep `
  -n `
  -E `
  "ARG .*TOKEN|ARG .*PASSWORD|ENV .*TOKEN|ENV .*PASSWORD"
```

A presença precisa ser investigada.

Quando o Maven precisar de credencial privada, use BuildKit secret mount.

Exemplo conceitual:

```dockerfile
RUN --mount=type=secret,id=maven_settings \
    ./mvnw \
      --settings \
      /run/secrets/maven_settings \
      verify
```

Não implemente credencial fictícia.

---

### 29. Criar script de verificação

Arquivo:

```text
scripts/docker/verify-image-security.ps1
```

Responsabilidades:

1. receber a tag;
2. verificar `Config.User`;
3. iniciar container endurecido;
4. verificar UID/GID;
5. verificar `/app` read-only;
6. verificar `/tmp` gravável;
7. verificar `/data` gravável;
8. verificar capabilities;
9. verificar `NoNewPrivs`;
10. verificar health;
11. remover o container.

O script deve usar:

```powershell
$ErrorActionPreference = "Stop"
```

E limpeza em:

```powershell
try {
    # validações
}
finally {
    docker rm --force $ContainerName 2>$null
}
```

---

### 30. Criar documentação de usuário não root

Arquivo:

```text
NON_ROOT_RUNTIME.md
```

Inclua:

- UID;
- GID;
- nome;
- diretórios;
- ownership;
- arquivos read-only;
- volume;
- override;
- bind mounts;
- limitações.

---

### 31. Criar documentação de filesystem

Arquivo:

```text
READ_ONLY_FILESYSTEM.md
```

Mapa:

```markdown
| Caminho | Modo | Motivo |
|---|---|---|
| /app | Read-only | Artefato |
| /app/app.jar | 0444 | Somente leitura |
| /tmp | tmpfs rw | Temporários |
| /data | volume rw | Banco do laboratório |
| /run/secrets | read-only quando usado | Segredos futuros |
```

---

### 32. Criar checklist de segurança

Arquivo:

```text
IMAGE_SECURITY_CHECKLIST.md
```

Inclua:

- [ ] multi-stage;
- [ ] runtime sem ferramentas;
- [ ] usuário não root;
- [ ] UID/GID explícitos;
- [ ] ownership;
- [ ] JAR não gravável;
- [ ] rootfs read-only;
- [ ] tmpfs;
- [ ] volume;
- [ ] cap-drop;
- [ ] no-new-privileges;
- [ ] limites;
- [ ] nenhum segredo;
- [ ] base registrada;
- [ ] testes verdes;
- [ ] smoke test;
- [ ] graceful shutdown.

---

### 33. Criar troubleshooting

Arquivo:

```text
IMAGE_SECURITY_TROUBLESHOOTING.md
```

Inclua:

- `useradd` ausente;
- UID já existente;
- GID já existente;
- JAR sem leitura;
- `/data` sem escrita;
- rootfs read-only quebrando temp;
- tmpfs pequeno;
- limite de PIDs baixo;
- OOM;
- capability necessária;
- override para root;
- bind mount incompatível;
- health falhando;
- shutdown interrompido.

---

### 34. Executar gate final

No host:

```powershell
.\mvnw.cmd clean verify
```

Depois:

```powershell
docker buildx build `
  --load `
  --tag `
  "formacao-java/m16-integrations:3.0.0" `
  .
```

Execute o script de segurança.

Finalize:

```powershell
git diff --check
git status
```

---

## Entendendo o que foi feito

### O usuário ganhou identidade explícita

UID e GID deixaram de ser implícitos.

### O JAR ganhou ownership e permissão controlados

A aplicação lê o artefato, mas não precisa alterá-lo.

### O filesystem raiz ficou imutável em runtime

Escritas passaram a ser exceções documentadas.

### `/tmp` virou tmpfs

Temporários ficaram efêmeros e limitados.

### `/data` virou a fronteira persistente

O volume recebe somente o estado necessário do laboratório.

### Capabilities foram removidas

A aplicação não depende de privilégios do kernel.

### Elevação foi bloqueada

`no-new-privileges` adicionou uma defesa de runtime.

### Recursos receberam limites iniciais

Consumo descontrolado passou a possuir contenção básica.

### Base image ganhou política

Digest, atualização e testes passaram a fazer parte da decisão.

### Segurança ficou verificável

O script transforma intenções em evidências repetíveis.

---

## Erros comuns importantes

### Usar `USER 10001` sem criar diretórios

A aplicação falha por permissão.

### Criar usuário sem UID explícito

Ownership pode variar entre builds.

### Copiar JAR como root e exigir escrita

A solução acaba voltando ao root.

### Tornar todo o filesystem gravável

Mudanças inesperadas ficam possíveis.

### Ativar read-only sem tmpfs

Bibliotecas podem falhar ao criar temporários.

### Montar `/data` sem validar ownership

O banco não inicia.

### Usar `--privileged`

Todos os controles de menor privilégio são enfraquecidos.

### Adicionar capability sem evidência

O processo recebe poder desnecessário.

### Colocar token em `ARG`

O valor pode aparecer no histórico ou metadata.

### Confundir não root com rootless daemon

São camadas diferentes.

### Pin por digest e nunca atualizar

A imagem congela patches.

### Aplicar limites sem teste

A JVM pode falhar sob carga normal.

---

## Comandos úteis

### Build endurecido

```powershell
docker buildx build `
  --load `
  -t `
  "formacao-java/m16-integrations:3.0.0" `
  .
```

### Ver usuário

```powershell
docker image inspect `
  "formacao-java/m16-integrations:3.0.0" `
  --format `
  "{{.Config.User}}"
```

### Executar identidade

```powershell
docker run `
  --rm `
  --entrypoint id `
  "formacao-java/m16-integrations:3.0.0"
```

### Ver capabilities

```powershell
docker exec `
  "m17-secure-app" `
  sh `
  -c `
  "grep '^CapEff:' /proc/1/status"
```

### Ver no-new-privileges

```powershell
docker exec `
  "m17-secure-app" `
  sh `
  -c `
  "grep '^NoNewPrivs:' /proc/1/status"
```

### Inspecionar digest

```powershell
docker buildx imagetools inspect `
  "eclipse-temurin:21-jre-jammy"
```

---

## Exercício guiado

### Parte 1 — Identidade

Crie usuário e grupo.

### Parte 2 — Ownership

Ajuste JAR e diretórios.

### Parte 3 — Imutabilidade

Ative rootfs read-only.

### Parte 4 — Escritas permitidas

Monte tmpfs e volume.

### Parte 5 — Privilégios

Remova capabilities.

### Parte 6 — Elevação

Ative no-new-privileges.

### Parte 7 — Recursos

Defina limites.

### Parte 8 — Base

Registre digest e política.

### Parte 9 — Evidência

Crie script de validação.

### Parte 10 — Documentação

Registre segurança e troubleshooting.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 507 foi preservada;
- escopo de segurança foi definido;
- baseline Maven foi executada;
- imagem multi-stage continuou válida;
- usuário anterior foi inspecionado;
- permissões anteriores foram inspecionadas;
- grupo `app` foi criado;
- usuário `app` foi criado;
- UID 10001 foi definido;
- GID 10001 foi definido;
- `--no-create-home` foi usado;
- shell sem login foi usada;
- `--no-log-init` foi usado;
- `/app` foi criado;
- `/data` foi criado;
- `/tmp` foi criado;
- ownership foi aplicado;
- `COPY --chown` foi usado;
- JAR foi copiado do builder;
- JAR permaneceu determinístico;
- permissão 0444 foi aplicada;
- `USER app:app` foi definido;
- aplicação não executa como root;
- imagem endurecida foi construída;
- UID foi validado;
- GID foi validado;
- ownership do JAR foi validado;
- leitura do JAR foi validada;
- escrita do JAR foi negada;
- named volume foi criado;
- root filesystem read-only foi ativado;
- escrita em `/app` foi negada;
- tmpfs foi montado em `/tmp`;
- escrita em `/tmp` foi validada;
- volume foi montado em `/data`;
- escrita em `/data` foi validada;
- persistência em `/data` foi validada;
- efemeridade de `/tmp` foi validada;
- todas as capabilities foram removidas;
- `CapEff` foi inspecionado;
- no-new-privileges foi ativado;
- `NoNewPrivs` foi inspecionado;
- limite de PIDs foi aplicado;
- limite de memória foi aplicado;
- limite de CPU foi aplicado;
- limites foram inspecionados;
- health foi validado;
- readiness foi validada;
- smoke test foi executado;
- fluxo de integrações permaneceu funcional;
- graceful shutdown foi validado;
- override de usuário foi discutido;
- named volume foi preferido no laboratório;
- bind mount foi documentado;
- base image foi revisada;
- digest foi inspecionado;
- digest real não foi inventado;
- política de atualização foi criada;
- pinning e atualização foram equilibrados;
- segredos em ARG foram proibidos;
- segredos em ENV de build foram proibidos;
- BuildKit secret mount foi explicado;
- script de verificação foi criado;
- limpeza do script foi garantida;
- política de segurança foi criada;
- documentação non-root foi criada;
- mapa de filesystem foi criado;
- checklist foi criado;
- troubleshooting foi criado;
- Compose não foi antecipado;
- secrets avançados não foram antecipados;
- healthcheck dedicado não foi antecipado;
- Kubernetes SecurityContext não foi antecipado;
- gate final foi executado;
- commit recomendado está pronto;
- ponte para a aula 509 está correta.

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
  scripts/docker/verify-image-security.ps1 `
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
git commit -m "build(m17): endurecer imagem Spring Boot"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- token real;
- senha;
- arquivo `.env`;
- Maven settings privado;
- cache;
- volume;
- banco;
- logs;
- target;
- imagem exportada;
- digest inventado;
- arquivo temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a imagem multi-stage foi evoluída para uma baseline de runtime com menor privilégio.

O fluxo passou a possuir:

```text
builder isolado;

runtime com JRE;

usuário app;

UID/GID explícitos;

JAR read-only;

rootfs read-only;

tmpfs;

volume;

capabilities removidas;

no-new-privileges;

limites;

validação.
```

Você comprovou que:

- multi-stage não substitui hardening;
- UID 0 não é necessário para a aplicação;
- ownership precisa ser planejado;
- caminhos graváveis precisam ser explícitos;
- `/app` contém artefato imutável;
- `/tmp` é temporário;
- `/data` é persistente;
- porta 8084 não exige capability especial;
- `cap-drop ALL` reduz privilégios;
- `no-new-privileges` impede elevação futura;
- limites básicos reduzem impacto de consumo descontrolado;
- base image precisa de política de atualização;
- segredo não pertence a ARG ou ENV de build;
- segurança precisa ser testada, não presumida.

A próxima aula será:

```text
509 - M17.04 - Docker Compose para API completa
```

Nela, você irá:

- declarar a aplicação em YAML;
- declarar Kafka;
- declarar rede;
- declarar volume;
- declarar configuração;
- declarar dependências;
- iniciar a stack;
- parar a stack;
- inspecionar serviços;
- validar comunicação por DNS;
- reutilizar a imagem segura.

Nenhum arquivo Compose foi criado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Criei usuário e grupo.
- [ ] Ajustei ownership e permissões.
- [ ] Ativei filesystem read-only.
- [ ] Montei tmpfs e volume.
- [ ] Removi capabilities.
- [ ] Ativei no-new-privileges.
- [ ] Validei limites e health.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### `groupadd` não existe

A base escolhida pode não usar ferramentas Debian/Ubuntu.

Revise a distribuição antes de copiar comandos.

### UID 10001 já existe

Inspecione `/etc/passwd` e escolha uma política consistente.

### O JAR não pode ser lido

Revise `COPY --chown` e `chmod`.

### H2 não consegue abrir o banco

O usuário não possui escrita em `/data` ou o volume está incorreto.

### A JVM falha com rootfs read-only

Verifique caminhos temporários e cache de bibliotecas.

### `/tmp` enche

Aumente com evidência ou investigue vazamento de temporários.

### O container falha com PIDs limitados

Meça threads necessárias antes de alterar o valor.

### O processo recebe OOM

Revise limite total, heap e memória nativa.

### Uma biblioteca exige capability

Confirme a necessidade e adicione somente a capability específica.

### `NoNewPrivs` permanece zero

Revise a opção passada ao `docker run`.

### Bind mount não aceita escrita

Revise ownership e diferenças entre host e VM Linux.

### O script deixa container órfão

Garanta limpeza no bloco `finally`.

---

## Perguntas de revisão

1. Por que não executar como root?
2. Para que servem UID e GID explícitos?
3. O que faz `USER`?
4. O que faz `COPY --chown`?
5. Por que o JAR usa 0444?
6. Por que `/app` é read-only?
7. Por que `/tmp` usa tmpfs?
8. Por que `/data` usa volume?
9. O que faz `--read-only`?
10. O que são capabilities?
11. Por que usar `--cap-drop ALL`?
12. O que faz no-new-privileges?
13. O que limita `--pids-limit`?
14. Non-root é igual a rootless mode?
15. O que é userns-remap?
16. ARG é seguro para token?
17. Para que serve build secret?
18. Tag e digest são iguais?
19. Pinning elimina manutenção?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Reduzir privilégio e impacto.
2. Ownership previsível.
3. Definir usuário padrão.
4. Definir ownership na cópia.
5. Somente leitura.
6. Artefato imutável.
7. Temporários efêmeros.
8. Estado persistente.
9. Bloquear escrita no rootfs.
10. Privilégios Linux granulares.
11. A aplicação não precisa delas.
12. Impedir elevação futura.
13. Processos e threads.
14. Não.
15. Mapeamento de UIDs.
16. Não.
17. Expor segredo temporariamente ao build.
18. Não.
19. Não.
20. Docker Compose para API completa.

---

## Desafio opcional

Execute a imagem com:

```text
--user 20000:20000.
```

Observe quais caminhos deixam de funcionar.

Depois, explique:

- por que o JAR continua legível;
- por que `/data` pode falhar;
- como ownership do volume afeta portabilidade;
- quando usar um UID fixo;
- quando uma plataforma impõe UID arbitrário.

Não altere permissões para `0777`.

Documente uma solução baseada em grupos, ownership ou plataforma.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 508 - M17.03 - Imagem segura e usuario nao root

- Continuei após o Dockerfile multi-stage.
- Revisei o princípio do menor privilégio.
- Diferenciei root no container, userns-remap e rootless mode.
- Criei o grupo `app`.
- Criei o usuário `app`.
- Fixei UID e GID em 10001.
- Usei `--no-create-home`.
- Usei shell sem login.
- Usei `--no-log-init`.
- Preparei `/app`, `/data` e `/tmp`.
- Apliquei ownership explícito.
- Usei `COPY --chown`.
- Tornei o JAR somente leitura.
- Defini `USER app:app`.
- Construí a imagem endurecida.
- Validei UID e GID.
- Ativei root filesystem read-only.
- Neguei escrita em `/app`.
- Montei tmpfs em `/tmp`.
- Montei volume em `/data`.
- Validei efemeridade e persistência.
- Removi todas as capabilities.
- Ativei no-new-privileges.
- Apliquei limites básicos de PIDs, memória e CPU.
- Validei health e smoke test.
- Validei graceful shutdown.
- Revisei a base image.
- Inspecionei o digest real.
- Criei política de atualização.
- Proibi segredos em ARG e ENV de build.
- Expliquei BuildKit secret mount.
- Criei script de validação.
- Documentei usuário, filesystem e troubleshooting.
- Não antecipei Docker Compose.
- Próxima aula: Docker Compose para API completa.
```

---

## Referência técnica curta

- Dockerfile `USER`.
- Docker Build Best Practices.
- Docker Engine Security.
- Linux Capabilities.
- Docker Read-only Root Filesystem.
- Docker tmpfs Mounts.
- Docker Volumes.
- Docker Build Secrets.
- Rootless Docker.
- User Namespace Remapping.

Regra final:

```text
uma imagem segura de Spring Boot aplica menor privilégio de forma verificável: o runtime multi-stage cria grupo e usuário `app` com UID/GID 10001, copia o JAR com ownership explícito, aplica permissão somente leitura e inicia o processo com `USER app:app`; `/app` permanece imutável, `/tmp` recebe tmpfs efêmero e limitado e `/data` recebe volume persistente; o container executa com root filesystem read-only, todas as capabilities removidas, no-new-privileges e limites básicos de PIDs, memória e CPU; health, smoke test e graceful shutdown confirmam que o hardening não quebrou a aplicação; a base image possui origem, digest registrado e política de atualização, enquanto tokens e senhas permanecem fora de ARG, ENV e camadas; non-root no container, userns-remap e rootless daemon são defesas diferentes; o script de segurança prova identidade, permissões, caminhos graváveis, capabilities e runtime antes de a imagem ser reutilizada pelo Docker Compose da aula 509.
```
