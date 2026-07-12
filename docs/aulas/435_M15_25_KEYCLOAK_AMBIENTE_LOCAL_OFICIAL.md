# 435 - M15.25 - Keycloak ambiente local

## Apresentação da aula

Na aula 434, o Authorization Code Flow recebeu uma proteção fundamental contra interceptação.

A baseline de PKCE ficou:

```text
code_verifier:
32 bytes de SecureRandom.

code_challenge:
BASE64URL(
    SHA-256(
        ASCII(code_verifier)
    )
).

método:
S256.

plain:
rejeitado.

tentativa:
TTL curto e uso único.

logs:
sem verifier, challenge,
state, nonce ou code.
```

Também foram separados quatro controles:

```text
state:
protege o redirect.

nonce:
liga o ID Token
à tentativa OIDC.

PKCE:
liga o authorization code
à instância do client.

TLS:
protege o transporte.
```

Até aqui, OAuth 2.0, OpenID Connect e PKCE foram estudados sem um provedor executável.

Isso foi intencional.

Antes de instalar uma ferramenta, era necessário compreender:

- quais papéis ela poderá assumir;
- quais tokens existem;
- quem deve receber cada token;
- como validar issuer e audience;
- por que `state`, `nonce` e PKCE são diferentes;
- por que client secret não pertence a uma SPA;
- por que ID Token não deve ser enviado à API.

Nesta aula, o projeto ganhará um OpenID Provider local real:

```text
Keycloak.
```

O Keycloak será executado como um servidor separado.

Ele não será incorporado ao processo da API.

A topologia será:

```text
browser e ferramentas locais
        |
        v
Keycloak
        |
        v
PostgreSQL exclusivo do Keycloak
```

A API de Ordens de Serviço continuará separada.

Ela ainda não utilizará o Keycloak para login nesta aula.

O objetivo será preparar e validar a infraestrutura local:

- imagem versionada;
- banco PostgreSQL externo;
- persistência;
- secrets;
- rede;
- exposição somente em loopback;
- management port separado;
- health;
- readiness;
- startup;
- discovery;
- JWKS;
- logs;
- atualização controlada.

A pergunta central será:

```text
como executar um Keycloak local
de forma reproduzível e observável,
sem usar imagem latest,
sem expor banco ou management
e sem misturar bootstrap administrativo
com configuração de aplicação?
```

A versão adotada será:

```text
Keycloak 26.7.0.
```

A tag ficará explícita:

```text
quay.io/keycloak/keycloak:26.7.0
```

Não será usado:

```text
latest.
```

A imagem do PostgreSQL também ficará fixada:

```text
postgres:17.10-alpine.
```

Essa versão pertence à linha PostgreSQL 17 suportada pelo Keycloak utilizado no laboratório.

O ambiente local usará:

```text
start-dev.
```

Essa decisão não transforma `start-dev` em configuração de produção.

O comando existe para desenvolvimento e teste.

A produção exigiria, entre outros controles:

- HTTPS;
- hostname público correto;
- reverse proxy;
- imagem otimizada;
- secret manager;
- backup;
- alta disponibilidade;
- atualização planejada;
- limites de recursos;
- observabilidade externa;
- proteção do console administrativo.

As interfaces locais serão:

```text
Keycloak:
http://localhost:8180

Management:
http://localhost:9190

PostgreSQL:
somente rede interna do Compose
```

As portas serão publicadas somente no loopback:

```text
127.0.0.1.
```

O banco não será publicado no host.

O management port será disponibilizado em loopback apenas para o laboratório.

Ele não deverá ser exposto por um reverse proxy público.

A credencial administrativa inicial será tratada como bootstrap.

Ela será lida de arquivo em:

```text
/run/secrets/keycloak/bootstrap-admin-password.
```

A password do banco será lida de outro arquivo:

```text
/run/secrets/keycloak/database-password.
```

Como a configuração padrão do Keycloak espera determinados secrets em environment variables, um entrypoint local e controlado fará:

1. validar o arquivo;
2. ler uma única linha;
3. exportar a variável necessária;
4. iniciar o processo com `exec`;
5. não imprimir o valor.

Essa adaptação não será chamada de secret manager.

Ela é somente uma ponte local entre Docker secrets e a interface de configuração do processo.

Arquivos gerados:

```text
compose.keycloak.yaml;

infra/keycloak/keycloak-entrypoint.sh;

.secrets/keycloak/
├── bootstrap-admin-password
└── database-password;

docs/security/M15_KEYCLOAK_LOCAL_ENVIRONMENT.md;

docs/security/M15_KEYCLOAK_UPGRADE_CHECKLIST.md.
```

Os arquivos de secret serão criados localmente e permanecerão ignorados pelo Git.

Nenhum realm de aplicação será criado nesta aula.

Nenhum client será criado.

Nenhuma role será criada.

Nenhum usuário de negócio será criado.

O realm `master` será utilizado somente para:

- acessar o Admin Console;
- verificar que o servidor inicializou;
- consultar discovery;
- consultar JWKS;
- compreender a estrutura de URLs.

A aplicação nunca deverá usar o realm `master` como realm funcional.

A próxima aula será:

```text
436 - M15.26 - Login com Keycloak
```

Nela, a configuração de autenticação da aplicação será iniciada sobre o ambiente preparado aqui.

---

## Onde estamos na formação

A sequência oficial é:

```text
433:
OpenID Connect.

434:
PKCE.

435:
Keycloak ambiente local.

436:
Login com Keycloak.

437:
Multi tenancy seguranca.

438:
Testes de seguranca.
```

A aula 434 respondeu:

```text
como proteger a troca
do authorization code?
```

A aula 435 responderá:

```text
como disponibilizar localmente
um OpenID Provider real,
persistente e observável,
antes de integrar o login?
```

Nesta aula:

```text
Keycloak:
sim.

versão fixa:
sim.

PostgreSQL:
sim.

volume:
sim.

secrets em arquivo:
sim.

bootstrap admin:
sim.

health:
sim.

readiness:
sim.

startup:
sim.

management port:
sim.

discovery:
sim.

JWKS:
sim.

realm de aplicação:
não.

client:
não.

roles:
não.

login da API:
próxima aula.
```

A regra central será:

```text
primeiro tornar o provedor
reproduzível e verificável;

depois configurar identidade,
clients e integração.
```

---

## Objetivo prático

Ao final da aula, o repositório terá:

```text
compose.keycloak.yaml
```

Infraestrutura:

```text
infra/keycloak/
└── keycloak-entrypoint.sh
```

Documentação:

```text
docs/security/
├── M15_KEYCLOAK_LOCAL_ENVIRONMENT.md
└── M15_KEYCLOAK_UPGRADE_CHECKLIST.md
```

Secrets locais ignorados:

```text
.secrets/keycloak/
├── bootstrap-admin-password
└── database-password
```

Volumes:

```text
keycloak_postgres_data
```

Rede:

```text
keycloak_internal
```

Serviços:

```text
keycloak-db;

keycloak.
```

Endpoints operacionais:

```text
http://localhost:9190/health/started

http://localhost:9190/health/live

http://localhost:9190/health/ready

http://localhost:9190/health

http://localhost:9190/metrics
```

Endpoints OIDC de validação no realm `master`:

```text
http://localhost:8180/realms/master/.well-known/openid-configuration

http://localhost:8180/realms/master/protocol/openid-connect/certs
```

Você irá:

1. fixar versões;
2. criar a rede interna;
3. criar banco exclusivo;
4. manter o banco sem porta publicada;
5. criar secrets locais;
6. validar os secrets no entrypoint;
7. criar o serviço Keycloak;
8. ativar health;
9. ativar metrics;
10. separar management port;
11. configurar hostname local;
12. publicar portas em loopback;
13. criar volumes;
14. subir os serviços;
15. acompanhar logs;
16. validar startup;
17. validar readiness;
18. acessar discovery;
19. acessar JWKS;
20. documentar atualização e limpeza.

---

## Conceito essencial

### Keycloak é um servidor separado

Keycloak executa fora da API e pode atuar como OpenID Provider, Authorization Server, servidor SAML, broker de identidades e gerenciador de sessões. A aplicação configura confiança no provedor; ela não incorpora o produto em seu próprio processo.
### Separação de responsabilidades

O Keycloak cuida de autenticação, emissão, sessões, metadata e chaves. A API OS continua como Resource Server e mantém autorização de negócio, ownership e auditoria. Cada sistema terá seu próprio PostgreSQL, permitindo ciclos independentes de acesso, backup e evolução.
### Imagem versionada

`latest` quebra reprodutibilidade. A baseline fixa `quay.io/keycloak/keycloak:26.7.0`; uma promoção mais rígida também registra o digest validado no processo de atualização.
### PostgreSQL externo

O laboratório usa PostgreSQL externo e persistente para separar processo e dados, praticar migrations, backup e restauração. O banco é exclusivo do Keycloak e não é compartilhado com a API.
### start-dev

`start-dev` simplifica desenvolvimento local e permite HTTP. Ele não é configuração de produção. Uma implantação real exigiria `start`, HTTPS, imagem preparada, reverse proxy, secrets gerenciados, recursos, backup, atualização e observabilidade revisados.
### Hostname

`KC_HOSTNAME=http://localhost:8180` fixa as URLs publicadas, incluindo issuer e endpoints OIDC. Em produção, esse valor precisa representar a URL pública real e estar alinhado a TLS e reverse proxy.
### Main interface e management interface

A interface principal entrega consoles e endpoints OIDC. Health e metrics usam a interface de management, na porta interna `9000`. Essa porta não deve ser publicada por um reverse proxy externo.
### Startup, liveness e readiness

`/health/started` acompanha a inicialização, `/health/live` verifica se o processo está vivo, `/health/ready` indica se pode receber tráfego e `/health` agrega os checks. Readiness deve controlar entrada de tráfego.
### Health e metrics precisam ser habilitados

A configuração utiliza `KC_HEALTH_ENABLED=true` e `KC_METRICS_ENABLED=true`. O management port fica disponível somente em loopback para o laboratório.
### A imagem oficial não traz curl

A imagem oficial é reduzida e não garante `curl` ou `wget`. O healthcheck interno usa `/dev/tcp`; inspeções humanas são executadas no host.
### Bootstrap admin

`KC_BOOTSTRAP_ADMIN_USERNAME` e `KC_BOOTSTRAP_ADMIN_PASSWORD` criam a conta administrativa inicial quando o estado ainda não existe. A password vem de arquivo. Alterar esse arquivo depois não atualiza automaticamente a conta persistida.
### Bootstrap não é usuário de negócio

A conta bootstrap administra o provedor. Ela não representa operador, não autentica na API e não deve ser compartilhada ou usada como service account.
### Docker secrets no laboratório

O Compose monta os arquivos em `/run/secrets/keycloak`. O PostgreSQL usa `POSTGRES_PASSWORD_FILE`; um wrapper local exporta as variáveis esperadas pelo Keycloak sem imprimir os valores. Essa ponte não substitui um secret manager de produção.
### Entry point seguro

O script usa `set -Eeuo pipefail`, valida arquivo, leitura e valor não vazio, não ativa tracing e finaliza com `exec`. Paths são fixos e não dependem de input externo.
### Rede interna

`keycloak-db` fica na rede `keycloak_internal` e não possui `ports`. O Keycloak acessa `keycloak-db:5432`; consultas administrativas usam `docker compose exec`.
### Persistência

O volume `keycloak_postgres_data` sobrevive a `down`. `down -v` remove o estado e será tratado como reset destrutivo.
### Discovery

Cada realm publica metadata em `/realms/{realm}/.well-known/openid-configuration`. O realm `master` será consultado somente para validar issuer, endpoints e JWKS URI.
### JWKS

`/realms/master/protocol/openid-connect/certs` publica public keys com dados como `kid`, `kty`, `alg` e `use`. Private keys não são expostas.
### Realm master

`master` administra a instalação e não deve ser realm funcional da API. Misturar administração e negócio amplia privilégios e acoplamento.
### Logs

Logs precisam mostrar versão, startup, migrations e falhas operacionais sem expor passwords, tokens, codes ou client secrets.
### Atualizações

Trocar a tag exige release notes, upgrading guide, backup, restore test, compatibilidade do banco, smoke tests e plano de rollback. O checklist operacional será criado nesta aula.
## Mão na massa guiada

### 1. Criar a estrutura

No diretório do projeto:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  "infra/keycloak"

New-Item `
  -ItemType Directory `
  -Force `
  ".secrets/keycloak"
```

Confirme que `.secrets/` já está ignorado desde a aula 431.

Valide:

```powershell
git check-ignore `
  -v `
  ".secrets/keycloak/database-password"
```

---

### 2. Criar os secrets locais

Crie dois valores distintos:

```text
database-password;

bootstrap-admin-password.
```

Utilize geração criptograficamente segura ou um password manager.

Não coloque os valores:

- no histórico do terminal;
- no README;
- no Compose;
- no chat;
- em screenshot;
- em evidence pública.

Depois, valide somente metadata:

```powershell
Get-ChildItem `
  ".secrets/keycloak" |
  Select-Object `
    Name,
    Length
```

Não use `Get-Content`.

---

### 3. Criar keycloak-entrypoint.sh

Arquivo:

```text
infra/keycloak/keycloak-entrypoint.sh
```

Use somente recursos disponíveis na imagem oficial:

```bash
#!/usr/bin/env bash

set -Eeuo pipefail

read_required_secret() {
    local path="$1"
    local name="$2"
    local value

    [[ -f "${path}" ]] || {
        echo "Missing required secret: ${name}" >&2
        exit 1
    }

    [[ -r "${path}" ]] || {
        echo "Unreadable required secret: ${name}" >&2
        exit 1
    }

    IFS= read -r value < "${path}" || true

    [[ -n "${value}" ]] || {
        echo "Empty required secret: ${name}" >&2
        exit 1
    }

    printf '%s' "${value}"
}

export KC_DB_PASSWORD="$(
    read_required_secret \
      "/run/secrets/keycloak/database-password" \
      "database-password"
)"

export KC_BOOTSTRAP_ADMIN_PASSWORD="$(
    read_required_secret \
      "/run/secrets/keycloak/bootstrap-admin-password" \
      "bootstrap-admin-password"
)"

exec /opt/keycloak/bin/kc.sh "$@"
```

Não use `set -x`, não imprima valores e valide no host que cada arquivo possui somente uma linha.
### 4. Garantir line ending Unix

O script será executado em Linux.

No Windows, confirme que ele possui LF.

Crie ou atualize `.gitattributes`:

```gitattributes
infra/keycloak/*.sh text eol=lf
```

Valide:

```powershell
git diff `
  --check
```

Um erro como:

```text
/usr/bin/env: 'bash\r':
No such file or directory
```

indica CRLF.

---

### 5. Tornar o script executável no container

Como permissions do host variam no Windows, monte o script e execute explicitamente:

```yaml
entrypoint:
  - /usr/bin/env
  - bash
  - /opt/local/keycloak-entrypoint.sh
```

Não dependa do bit executável do arquivo montado.

---

### 6. Criar compose.keycloak.yaml

Conteúdo inicial:

```yaml
services:
  keycloak-db:
    image: postgres:17.10-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD_FILE:
        /run/secrets/keycloak/database-password
    secrets:
      - source: keycloak_database_password
        target: keycloak/database-password
    volumes:
      - keycloak_postgres_data:/var/lib/postgresql/data
    networks:
      - keycloak_internal
```

O banco não possui `ports`.

---

### 7. Adicionar healthcheck do PostgreSQL

```yaml
    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready -U keycloak -d keycloak
      interval: 5s
      timeout: 5s
      retries: 20
      start_period: 10s
```

O healthcheck verifica disponibilidade do servidor.

Ele não substitui backup ou validação de schema.

---

### 8. Adicionar o serviço Keycloak

```yaml
  keycloak:
    image:
      quay.io/keycloak/keycloak:26.7.0
    restart: unless-stopped
    depends_on:
      keycloak-db:
        condition: service_healthy
    entrypoint:
      - /usr/bin/env
      - bash
      - /opt/local/keycloak-entrypoint.sh
    command:
      - start-dev
    environment:
      KC_DB: postgres
      KC_DB_URL_HOST: keycloak-db
      KC_DB_URL_PORT: "5432"
      KC_DB_URL_DATABASE: keycloak
      KC_DB_USERNAME: keycloak

      KC_BOOTSTRAP_ADMIN_USERNAME:
        local-keycloak-admin

      KC_HOSTNAME:
        http://localhost:8180

      KC_HEALTH_ENABLED: "true"
      KC_METRICS_ENABLED: "true"

      KC_HTTP_MANAGEMENT_PORT: "9000"

      KC_LOG_LEVEL: INFO
    secrets:
      - source: keycloak_database_password
        target: keycloak/database-password
      - source: keycloak_bootstrap_admin_password
        target: keycloak/bootstrap-admin-password
    volumes:
      - type: bind
        source:
          ./infra/keycloak/keycloak-entrypoint.sh
        target:
          /opt/local/keycloak-entrypoint.sh
        read_only: true
    ports:
      - "127.0.0.1:8180:8080"
      - "127.0.0.1:9190:9000"
    networks:
      - keycloak_internal
```

O hostname contém a porta publicada no host.

---

### 9. Adicionar healthcheck do Keycloak

A imagem não contém `curl`.

Use:

```yaml
    healthcheck:
      test:
        - CMD-SHELL
        - >-
          { printf
          'HEAD /health/ready HTTP/1.0\r\n\r\n'
          >&0;
          grep 'HTTP/1.0 200';
          } 0<>/dev/tcp/127.0.0.1/9000
      interval: 10s
      timeout: 5s
      retries: 30
      start_period: 30s
```

A verificação usa o management port interno.

Ela não depende da porta publicada `9190`.

---

### 10. Finalizar secrets, volumes e networks

```yaml
secrets:
  keycloak_database_password:
    file:
      ./.secrets/keycloak/database-password

  keycloak_bootstrap_admin_password:
    file:
      ./.secrets/keycloak/bootstrap-admin-password

volumes:
  keycloak_postgres_data:

networks:
  keycloak_internal:
    driver: bridge
```

A rede permanece bridge; o banco continua sem publicação no host.

---

### 11. Validar a configuração do Compose

Execute:

```powershell
docker compose `
  -f compose.keycloak.yaml `
  config
```

Revise:

- imagens;
- portas;
- secrets;
- mounts;
- healthchecks;
- volumes;
- networks;
- hostname.

O comando não deve imprimir o conteúdo dos secrets.

---

### 12. Baixar as imagens

```powershell
docker compose `
  -f compose.keycloak.yaml `
  pull
```

Confirme:

```powershell
docker image inspect `
  quay.io/keycloak/keycloak:26.7.0 `
  --format `
  '{{json .RepoDigests}}'
```

Registre o digest no checklist de evidência local.

Não substitua a tag no arquivo por `latest`.

---

### 13. Subir o banco primeiro

```powershell
docker compose `
  -f compose.keycloak.yaml `
  up `
  -d `
  keycloak-db
```

Acompanhe:

```powershell
docker compose `
  -f compose.keycloak.yaml `
  ps
```

Espere:

```text
healthy.
```

---

### 14. Subir o Keycloak

```powershell
docker compose `
  -f compose.keycloak.yaml `
  up `
  -d `
  keycloak
```

Acompanhe os logs:

```powershell
docker compose `
  -f compose.keycloak.yaml `
  logs `
  -f `
  --tail=200 `
  keycloak
```

Não copie linhas que contenham material sensível.

---

### 15. Validar os containers

```powershell
docker compose `
  -f compose.keycloak.yaml `
  ps
```

Esperado:

```text
keycloak-db:
healthy.

keycloak:
healthy.
```

O primeiro startup pode demorar por causa das migrations; readiness permanece indisponível até a conclusão.

---

### 16. Validar startup

No host:

```powershell
Invoke-WebRequest `
  -Method Head `
  -Uri `
    "http://localhost:9190/health/started"
```

Esperado:

```text
HTTP 200.
```

Em falha:

```text
HTTP 503
ou conexão ainda indisponível.
```

---

### 17. Validar liveness

```powershell
Invoke-WebRequest `
  -Method Head `
  -Uri `
    "http://localhost:9190/health/live"
```

Esperado:

```text
HTTP 200.
```

---

### 18. Validar readiness

```powershell
Invoke-RestMethod `
  -Uri `
    "http://localhost:9190/health/ready"
```

Esperado:

```json
{
  "status": "UP",
  "checks": []
}
```

A lista pode conter checks adicionais; não dependa da ordem.

---

### 19. Validar health agregado

```powershell
Invoke-RestMethod `
  -Uri `
    "http://localhost:9190/health"
```

Confirme:

```text
status:
UP.
```

Se metrics estiver habilitado, a verificação do banco poderá aparecer.

---

### 20. Validar metrics

```powershell
$response =
  Invoke-WebRequest `
    -Uri `
      "http://localhost:9190/metrics"

$response.StatusCode

$response.Content `
  -split "`n" |
  Select-Object `
    -First 20
```

Não publique o dump completo: métricas podem revelar detalhes operacionais.

---

### 21. Abrir o Admin Console

Acesse:

```text
http://localhost:8180/admin/
```

Use:

```text
username:
local-keycloak-admin.

password:
valor do secret local.
```

Não salve a password no navegador compartilhado.

Não utilize a conta em fluxos de negócio.

---

### 22. Verificar persistência do bootstrap

Pare:

```powershell
docker compose `
  -f compose.keycloak.yaml `
  down
```

Suba novamente:

```powershell
docker compose `
  -f compose.keycloak.yaml `
  up `
  -d
```

A conta administrativa e o estado devem permanecer porque o banco utiliza volume.

Alterar o secret de bootstrap não altera automaticamente a conta existente.

---

### 23. Consultar discovery

Use o realm `master` somente como prova operacional:

```powershell
$discovery =
  Invoke-RestMethod `
    -Uri `
      "http://localhost:8180/realms/master/.well-known/openid-configuration"

$discovery.issuer
$discovery.authorization_endpoint
$discovery.token_endpoint
$discovery.userinfo_endpoint
$discovery.jwks_uri
```

Confirme:

```text
issuer:
http://localhost:8180/realms/master.
```

Se o issuer apresentar outra porta ou host, revise `KC_HOSTNAME`.

---

### 24. Consultar JWKS

```powershell
$jwks =
  Invoke-RestMethod `
    -Uri `
      "http://localhost:8180/realms/master/protocol/openid-connect/certs"

$jwks.keys |
  Select-Object `
    kid,
    kty,
    alg,
    use
```

Confirme:

- existe ao menos uma public key;
- `kid` está presente;
- nenhum material privado é publicado;
- a URL corresponde à discovery.

---

### 25. Validar relação discovery e JWKS

```powershell
$discovery.jwks_uri
```

Compare com:

```text
http://localhost:8180/realms/master/protocol/openid-connect/certs
```

Não hardcode essa URL em um client quando a biblioteca pode usar issuer discovery.

---

### 26. Verificar que o banco não está publicado

```powershell
docker compose `
  -f compose.keycloak.yaml `
  ps
```

A coluna de ports do `keycloak-db` não deve exibir:

```text
0.0.0.0:5432;
127.0.0.1:5432.
```

Também valide:

```powershell
docker inspect `
  -f `
  '{{json .NetworkSettings.Ports}}' `
  "$(docker compose `
      -f compose.keycloak.yaml `
      ps -q keycloak-db)"
```

A porta não deve possuir binding no host.

---

### 27. Verificar bind em loopback

No serviço Keycloak, a saída deve mostrar:

```text
127.0.0.1:8180->8080/tcp;

127.0.0.1:9190->9000/tcp.
```

Não aceite:

```text
0.0.0.0.
```

para esta baseline local.

---

### 28. Consultar o banco por exec

Quando necessário:

```powershell
docker compose `
  -f compose.keycloak.yaml `
  exec `
  keycloak-db `
  psql `
  -U keycloak `
  -d keycloak `
  -c `
  "select current_database(), current_user;"
```

A consulta não exige publicar a porta. Tabelas internas não são contrato da aplicação.

---

### 29. Criar documento do ambiente

Arquivo:

```text
docs/security/M15_KEYCLOAK_LOCAL_ENVIRONMENT.md
```

Inclua:

```markdown
# Keycloak local

## Versoes

- Keycloak 26.7.0.
- PostgreSQL 17.10.

## Portas

- 8180: interface principal em loopback.
- 9190: management em loopback.
- PostgreSQL: sem publicacao.

## Secrets

- bootstrap admin password.
- database password.
- arquivos ignorados.

## Probes

- started.
- live.
- ready.
- aggregate.

## OIDC

- discovery do master apenas para validacao.
- JWKS do master apenas para validacao.
- aplicacao nunca usa realm master.

## Limites

- start-dev.
- HTTP local.
- instancia unica.
- sem backup automatizado.
- sem realm funcional.
- sem client.
- sem login integrado.
```

---

### 30. Criar checklist de atualização

Arquivo:

```text
docs/security/M15_KEYCLOAK_UPGRADE_CHECKLIST.md
```

Inclua:

```markdown
# Checklist de atualizacao do Keycloak

## Antes

- Ler release notes.
- Ler upgrading guide.
- Verificar CVEs.
- Fixar nova tag e digest.
- Fazer backup do banco.
- Testar restore.
- Registrar versao anterior.
- Revisar features preview.

## Ensaio

- Subir copia do banco.
- Executar migrations.
- Validar readiness.
- Validar discovery.
- Validar JWKS.
- Validar Admin Console.
- Validar login.
- Validar refresh.
- Validar logout.
- Validar tokens.

## Promocao

- Definir janela.
- Parar writers quando necessario.
- Executar backup final.
- Aplicar versao.
- Verificar probes.
- Executar smoke tests.

## Rollback

- Nao presumir downgrade de schema.
- Restaurar backup compativel.
- Reimplantar versao anterior.
- Validar integridade.
```

---

### 31. Criar teste de policy do Compose

Adicione um teste que leia `compose.keycloak.yaml`.

Valide:

- imagem Keycloak não usa `latest`;
- versão é `26.7.0`;
- PostgreSQL possui tag explícita;
- banco não possui `ports`;
- ports do Keycloak começam com `127.0.0.1`;
- health e metrics estão habilitados;
- management port está presente;
- secrets não têm valores inline;
- script está read-only;
- `start-dev` está documentado como local;
- não existe realm import nesta aula.

Esse teste é estático e não inicia containers.

---

### 32. Testar ausência de secrets no repositório

Atualize `SecretsRepositoryPolicyTest`.

Procure:

```text
KC_BOOTSTRAP_ADMIN_PASSWORD:
com valor literal;

KC_DB_PASSWORD:
com valor literal;

POSTGRES_PASSWORD:
com valor literal;

.secrets/keycloak
em arquivos rastreados.
```

Permita apenas:

```text
nomes de variables;

paths de secret;

fixtures sintéticas explícitas.
```

---

### 33. Atualizar auditoria planejada

Planeje eventos operacionais futuros:

```text
IDENTITY_PROVIDER_STARTED;

IDENTITY_PROVIDER_NOT_READY;

IDENTITY_PROVIDER_UPGRADE_COMPLETED;

IDENTITY_PROVIDER_CONFIGURATION_REJECTED.
```

Não grave password, database URL com credencial, tokens ou configuração completa.

Os eventos permanecem documentais; o audit trail da API não substitui os eventos internos do Keycloak.

---

### 34. Atualizar threat model

Adicione:

```text
THR-144:
imagem latest muda sem revisão.

THR-145:
banco Keycloak é publicado no host.

THR-146:
management port é exposto publicamente.

THR-147:
bootstrap password está no Compose.

THR-148:
realm master é usado pela aplicação.

THR-149:
start-dev chega à produção.

THR-150:
hostname gera issuer incorreto.

THR-151:
readiness é ignorada.

THR-152:
volume é removido sem backup.

THR-153:
upgrade executa migration
sem restore test.

THR-154:
logs contêm credenciais.

THR-155:
Admin Console usa conta compartilhada.
```

Controles:

- versão fixa;
- banco sem ports;
- loopback;
- Docker secrets;
- realm dedicado futuro;
- documentação local;
- hostname explícito;
- healthchecks;
- checklist de backup;
- logging seguro;
- bootstrap administrativo isolado.

---

### 35. Atualizar OWASP e baseline

A02 Security Misconfiguration:

```text
latest:
proibido.

management:
loopback.

database:
não publicada.

hostname:
explícito.
```

A03 Software Supply Chain Failures:

```text
imagem:
tag fixa.

upgrade:
release notes,
digest e testes.
```

A04 Cryptographic Failures:

```text
JWKS:
public keys observadas.

private key:
permanece no Keycloak.
```

A07 Authentication Failures:

```text
bootstrap admin:
separado de usuário de negócio.

realm master:
não usado pela aplicação.
```

A09 Security Logging:

```text
logs:
sem secrets.

management metrics:
acesso restrito.
```

Baseline:

```text
Keycloak local:
disponível.

PostgreSQL:
persistente e isolado.

health:
habilitado.

discovery:
validado.

JWKS:
validado.

realm funcional:
pendente.

produção pública:
NO-GO.
```

---

### 36. Executar o gate

Validação estática:

```powershell
docker compose `
  -f compose.keycloak.yaml `
  config
```

Subida:

```powershell
docker compose `
  -f compose.keycloak.yaml `
  up `
  -d
```

Status:

```powershell
docker compose `
  -f compose.keycloak.yaml `
  ps
```

Testes HTTP:

```powershell
Invoke-RestMethod `
  "http://localhost:9190/health/ready"

Invoke-RestMethod `
  "http://localhost:8180/realms/master/.well-known/openid-configuration"

Invoke-RestMethod `
  "http://localhost:8180/realms/master/protocol/openid-connect/certs"
```

Gate Java:

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- scripts em LF;
- secrets ignorados;
- banco saudável;
- Keycloak saudável;
- readiness `UP`;
- issuer correto;
- JWKS com keys;
- portas em loopback;
- banco sem binding;
- nenhum realm import;
- nenhum client;
- nenhum token em logs;
- nenhum secret no staging.

---

## Entendendo o que foi feito

### O provedor virou infraestrutura real

Keycloak agora executa separado da API.

### A versão ficou reproduzível

A tag `26.7.0` substituiu `latest`.

### O banco ficou persistente e isolado

PostgreSQL possui volume e nenhuma porta publicada.

### Secrets saíram do Compose

Passwords são montadas como arquivos.

### O bootstrap ficou separado do negócio

A conta inicial administra o provedor, não a aplicação.

### A observabilidade ganhou interface própria

Health e metrics utilizam management port.

### Readiness passou a controlar disponibilidade

O serviço só é considerado pronto depois da inicialização.

### Discovery e JWKS foram validados

O ambiente já expõe metadata e public keys de um OP real.

### O realm master permaneceu administrativo

Ele não virou realm da aplicação.

---

## Erros comuns importantes

### Usar latest

O ambiente deixa de ser reproduzível.

### Publicar o PostgreSQL

Aumenta a superfície sem necessidade.

### Publicar management em 0.0.0.0

Health e metrics podem vazar detalhes operacionais.

### Escrever password no Compose

O secret entra no repositório e na configuração renderizada.

### Usar bootstrap admin na API

Conta administrativa não é usuário de negócio.

### Usar master como realm funcional

Administração e aplicação ficam misturadas.

### Tratar start-dev como produção

HTTP e defaults de desenvolvimento não são baseline produtiva.

### Verificar somente liveness

O processo pode estar vivo e ainda não pronto.

### Colocar curl na imagem sem avaliar

A imagem oficial é reduzida intencionalmente.

### Trocar versão sem backup

Migrations podem impedir downgrade simples.

---

## Comandos úteis

### Renderizar Compose

```powershell
docker compose `
  -f compose.keycloak.yaml `
  config
```

### Subir ambiente

```powershell
docker compose `
  -f compose.keycloak.yaml `
  up `
  -d
```

### Acompanhar logs

```powershell
docker compose `
  -f compose.keycloak.yaml `
  logs `
  -f `
  --tail=200 `
  keycloak
```

### Consultar readiness

```powershell
Invoke-RestMethod `
  "http://localhost:9190/health/ready"
```

### Consultar discovery

```powershell
Invoke-RestMethod `
  "http://localhost:8180/realms/master/.well-known/openid-configuration"
```

### Parar sem apagar volume

```powershell
docker compose `
  -f compose.keycloak.yaml `
  down
```

### Reset destrutivo do laboratório

```powershell
docker compose `
  -f compose.keycloak.yaml `
  down `
  -v
```

---

## Exercício guiado

### Parte 1 — Versionamento

Fixe Keycloak e PostgreSQL.

### Parte 2 — Persistência

Crie banco e volume exclusivos.

### Parte 3 — Secrets

Monte passwords por arquivo.

### Parte 4 — Rede

Não publique o banco.

### Parte 5 — Exposição

Use somente loopback.

### Parte 6 — Observabilidade

Ative health, readiness e metrics.

### Parte 7 — Inicialização

Suba banco antes do Keycloak.

### Parte 8 — OIDC

Valide discovery e JWKS.

### Parte 9 — Segurança

Mantenha `master` apenas administrativo.

### Parte 10 — Operação

Documente upgrade, backup e reset.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 434 foi preservada;
- ponte correta aponta para Login com Keycloak;
- Keycloak foi tratado como servidor separado;
- versão `26.7.0` foi fixada;
- `latest` não foi usado;
- PostgreSQL possui versão explícita;
- linha PostgreSQL suportada foi utilizada;
- banco exclusivo foi criado;
- banco não possui porta publicada;
- volume nomeado foi criado;
- rede dedicada foi criada;
- estado persiste após `down`;
- `down -v` foi documentado como destrutivo;
- `start-dev` foi usado somente no ambiente local;
- uso produtivo de `start-dev` foi rejeitado;
- hostname local foi configurado;
- issuer usa `localhost:8180`;
- porta principal foi publicada em loopback;
- management foi publicado em loopback;
- `0.0.0.0` foi rejeitado;
- health foi habilitado;
- metrics foi habilitado;
- management port 9000 foi preservado internamente;
- startup, live, ready e aggregate foram diferenciados;
- readiness foi utilizada no healthcheck;
- ausência de curl na imagem foi considerada;
- healthcheck usa mecanismo compatível com o container;
- password do banco não está inline;
- bootstrap password não está inline;
- secrets locais ficam em `.secrets`;
- secrets permanecem ignorados;
- PostgreSQL usa password file;
- Keycloak lê secrets pelo entrypoint local;
- entrypoint usa `set -Eeuo pipefail`;
- entrypoint não usa `set -x`;
- secret ausente, ilegível ou vazio falha;
- script não imprime secrets;
- line ending LF foi garantido;
- mount do script é read-only;
- bootstrap admin possui username local explícito;
- bootstrap admin foi separado de usuário de negócio;
- alteração do bootstrap secret após criação foi explicada;
- Admin Console foi acessado;
- banco saudável foi validado;
- Keycloak saudável foi validado;
- startup foi validado;
- liveness foi validada;
- readiness foi validada;
- metrics foi validada;
- discovery do `master` foi consultada;
- issuer foi conferido;
- authorization endpoint foi observado via discovery;
- token endpoint foi observado via discovery;
- JWKS URI foi observado;
- endpoint de certs foi consultado;
- conjunto de public keys foi validado;
- private key não foi exposta;
- realm `master` não foi usado pela aplicação;
- nenhum realm funcional foi criado;
- nenhum client foi criado;
- nenhuma role foi criada;
- nenhum usuário de negócio foi criado;
- nenhum login da API foi alterado;
- logs foram revisados sem credenciais;
- digest da imagem foi observado;
- checklist de upgrade foi criado;
- release notes e upgrading guide foram incluídos no processo;
- backup e restore test foram incluídos;
- downgrade de schema não foi presumido;
- teste de policy do Compose foi definido;
- SecretsRepositoryPolicyTest foi atualizado;
- threat model foi atualizado;
- OWASP A02, A03, A04, A07 e A09 foram atualizados;
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
git check-ignore `
  -v `
  ".secrets/keycloak/database-password"

docker compose `
  -f compose.keycloak.yaml `
  config
```

Adicione somente arquivos seguros:

```powershell
git add `
  compose.keycloak.yaml `
  infra/keycloak `
  docs/security `
  docs/diario-de-bordo.md `
  .gitattributes `
  .gitignore
```

Revise o staging:

```powershell
git diff `
  --cached `
  --name-only
```

Confirme que não aparecem:

```text
.secrets/keycloak/database-password;

.secrets/keycloak/bootstrap-admin-password.
```

Commit recomendado:

```powershell
git commit -m "feat(m15): preparar ambiente local do Keycloak"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- password;
- arquivo de secret;
- access token;
- refresh token;
- private key;
- dump do banco;
- realm export;
- client secret;
- imagem `latest`;
- log completo com dado sensível;
- configuração produtiva fictícia.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o projeto ganhou um OpenID Provider local executável.

A topologia ficou:

```text
Keycloak 26.7.0;

PostgreSQL 17.10;

volume persistente;

rede dedicada;

banco sem publicação;

interface principal em loopback;

management em loopback;

secrets por arquivo.
```

A operação passou a validar:

```text
startup;

liveness;

readiness;

health agregado;

metrics;

discovery;

JWKS.
```

O realm `master` foi usado somente para administração e prova operacional.

Nenhum recurso funcional da aplicação foi criado.

A decisão central foi:

```text
um provedor de identidade
precisa primeiro ser
reproduzível, persistente,
observável e isolado;

somente depois deve receber
realm, clients, usuários
e integração com aplicações.
```

A infraestrutura está pronta.

O próximo passo é fazer uma autenticação real usando o provedor.

A próxima aula será:

```text
436 - M15.26 - Login com Keycloak
```

Nela, você irá:

- criar um realm dedicado;
- criar o client necessário;
- definir redirect URIs;
- definir Web Origins;
- habilitar Authorization Code;
- exigir PKCE;
- criar usuário de laboratório;
- iniciar uma autenticação real;
- observar authorization code;
- obter tokens;
- validar issuer, audience e claims;
- manter o realm `master` fora da aplicação.

---

# Material complementar

## Checkpoint final

- [ ] Fixei a versão do Keycloak.
- [ ] Usei PostgreSQL exclusivo sem porta publicada.
- [ ] Montei secrets sem valores inline.
- [ ] Validei health e readiness no management port.
- [ ] Consultei discovery e JWKS sem criar realm funcional.

---

## Troubleshooting adicional

### O Keycloak reinicia continuamente

Verifique:

- secret do banco;
- hostname;
- conexão com PostgreSQL;
- line ending do entrypoint;
- logs anteriores ao restart.

### O entrypoint retorna bash\r

O arquivo está em CRLF.

Aplique `.gitattributes` e salve com LF.

### O banco está healthy, mas Keycloak não está ready

Readiness pode aguardar migrations ou inicialização.

Leia os logs e não reduza o `start_period` arbitrariamente.

### /health retorna 404 na porta 8180

Na configuração atual, health está no management port.

Use:

```text
9190.
```

### curl não existe no container

Use o healthcheck por `/dev/tcp` ou faça a request no host.

### O issuer mostra 8080

Revise:

```text
KC_HOSTNAME=http://localhost:8180.
```

Recrie o container após alterar a configuração.

### A password de bootstrap nova não funciona

A conta já foi criada e persistida.

Rotacione pelo mecanismo administrativo ou resete o laboratório conscientemente.

### O Admin Console abre, mas assets falham

Revise hostname, porta, browser cache e logs.

### O banco aparece no host

Remova `ports` de `keycloak-db` e recrie o serviço.

### O volume foi removido

`down -v` apaga o estado.

Recrie o bootstrap e trate como reset completo.

---

## Perguntas de revisão

1. Por que não usar `latest`?
2. Qual versão do Keycloak foi fixada?
3. Qual banco foi utilizado?
4. O banco possui porta publicada?
5. O que `start-dev` significa?
6. Ele pode ser usado em produção?
7. Qual é a porta principal no host?
8. Qual é a porta de management no host?
9. Qual porta de management existe no container?
10. Para que serve readiness?
11. Para que serve liveness?
12. Onde ficam os secrets?
13. O bootstrap admin é usuário de negócio?
14. Alterar o arquivo muda a password já criada?
15. Para que serve discovery?
16. Para que serve JWKS?
17. A private key aparece no JWKS?
18. A aplicação deve usar o realm master?
19. Qual é a próxima aula?
20. O que será feito nela?

---

## Roteiro de resposta

1. Porque a versão mudaria sem revisão.
2. 26.7.0.
3. PostgreSQL 17.10.
4. Não.
5. Modo local de desenvolvimento.
6. Não.
7. 8180 em loopback.
8. 9190 em loopback.
9. 9000.
10. Indicar que o servidor aceita tráfego.
11. Indicar que o processo continua vivo.
12. Em arquivos montados por Docker secrets.
13. Não.
14. Não automaticamente.
15. Publicar metadata OIDC.
16. Publicar public keys.
17. Não.
18. Não.
19. Login com Keycloak.
20. Realm, client, usuário e autenticação real.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 435 - M15.25 - Keycloak ambiente local

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Iniciei um OpenID Provider local real.
- Fixei `quay.io/keycloak/keycloak:26.7.0`.
- Proibi o uso de `latest`.
- Fixei PostgreSQL 17.10 para o laboratório.
- Criei `compose.keycloak.yaml`.
- Criei o serviço `keycloak-db`.
- Mantive o banco sem porta publicada.
- Criei o volume `keycloak_postgres_data`.
- Criei a rede `keycloak_internal`.
- Usei `start-dev` somente no ambiente local.
- Configurei `KC_HOSTNAME` para `http://localhost:8180`.
- Publiquei a interface principal somente em loopback.
- Publiquei management somente em loopback.
- Ativei health e metrics.
- Diferenciei startup, liveness e readiness.
- Criei healthchecks para PostgreSQL e Keycloak.
- Considerei a ausência de curl na imagem oficial.
- Criei secrets separados para banco e bootstrap admin.
- Mantive os secrets em `.secrets/keycloak`.
- Criei `keycloak-entrypoint.sh`.
- Não imprimi os valores dos secrets.
- Garanti line ending LF para scripts.
- Usei bootstrap admin somente para administração.
- Mantive usuário administrativo separado do negócio.
- Subi banco e Keycloak em ordem.
- Validei status healthy.
- Validei `/health/started`.
- Validei `/health/live`.
- Validei `/health/ready`.
- Validei `/health` e `/metrics`.
- Acessei o Admin Console.
- Validei persistência após restart.
- Consultei discovery do realm `master`.
- Confirmei issuer, authorization endpoint, token endpoint e JWKS URI.
- Consultei public keys no endpoint de certs.
- Mantive o realm `master` fora da aplicação.
- Não criei realm funcional, client, role ou usuário de negócio.
- Criei `docs/security/M15_KEYCLOAK_LOCAL_ENVIRONMENT.md`.
- Criei `docs/security/M15_KEYCLOAK_UPGRADE_CHECKLIST.md`.
- Atualizei testes de policy, baseline, threat model e OWASP.
- Mantive produção pública como NO-GO.
- Próxima aula: Login com Keycloak.
```

---

## Referência técnica curta

- [Keycloak — Running in a container](https://www.keycloak.org/server/containers)
- [Keycloak — Tracking instance status with health checks](https://www.keycloak.org/observability/health)
- [Keycloak — Configuring the Management Interface](https://www.keycloak.org/server/management-interface)
- [Keycloak — Configuring the hostname](https://www.keycloak.org/server/hostname)
- [Keycloak — Configuring the database](https://www.keycloak.org/server/db)
- [Keycloak — OpenID Connect endpoints](https://www.keycloak.org/securing-apps/oidc-layers)
- [Keycloak 26.7.0 release notes](https://www.keycloak.org/2026/07/keycloak-2670-released)
- [PostgreSQL 17.10 release](https://www.postgresql.org/about/news/postgresql-184-1710-1614-1518-and-1423-released-3297/)

Regra final:

```text
o ambiente local do provedor precisa ser reproduzível antes de receber configurações funcionais: nesta baseline, Keycloak e PostgreSQL usam versões fixas, o banco é exclusivo, persistente e não publicado, secrets entram por arquivos, a conta bootstrap permanece administrativa, a interface principal e o management port são limitados ao loopback, health e readiness controlam a disponibilidade, discovery e JWKS comprovam o OpenID Provider, o realm master não é usado pela aplicação e qualquer promoção exige substituir start-dev e HTTP por uma arquitetura produtiva revisada.
```
