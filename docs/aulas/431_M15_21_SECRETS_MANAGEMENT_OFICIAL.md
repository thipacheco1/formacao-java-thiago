# 431 - M15.21 - Secrets management

## Apresentação da aula

Na aula 430, a aplicação ganhou uma trilha de auditoria estruturada.

O audit trail passou a registrar:

```text
actor;

action;

target;

outcome;

reason;

correlation ID;

método e path.
```

Também foi estabelecida uma regra importante:

```text
auditar o evento;

nunca copiar a credencial.
```

A tabela de auditoria não armazena:

- access token;
- refresh token;
- password;
- hash;
- header `Authorization`;
- cookie;
- request body;
- query string;
- private key.

Isso impede a observabilidade de virar repositório de secrets.

Porém, a aplicação utiliza materiais sensíveis fora da auditoria.

Exemplos atuais:

```text
password do PostgreSQL;

password do Redis;

password do usuário de bootstrap;

password do PKCS12;

password da private key;

private key RSA usada na emissão JWT.
```

Exemplos futuros incluem OAuth2 client secret, credencial SMTP, API key, webhook signing secret, chave de criptografia e credenciais de deploy.

A pergunta central desta aula será:

```text
como identificar, transportar,
carregar, rotacionar e responder
a vazamentos de secrets
sem colocá-los no código,
na imagem, no Git,
nos logs ou em defaults inseguros?
```

A solução da formação criará uma baseline local e preparará a arquitetura para um secret manager real.

No laboratório, secrets serão fornecidos por arquivos montados em:

```text
/run/secrets.
```

O Docker Compose concederá cada secret somente ao serviço consumidor.

O Spring Boot utilizará duas estratégias.

Credenciais textuais comuns:

```text
configtree.
```

Passwords de proteção do keystore JWT:

```text
leitura direta de arquivo;

char[];

limpeza do buffer após o uso.
```

O keystore PKCS12 também será montado como arquivo.

Nenhum valor ficará em:

- `application.yaml`;
- `application-prod.yaml`;
- `.env` versionado;
- argumento de linha de comando;
- Dockerfile;
- imagem;
- migration;
- teste de produção;
- documentação;
- collection;
- audit event.

A aplicação também receberá uma política de startup:

```text
secret obrigatório ausente:
startup falha.

secret vazio:
startup falha.

arquivo ilegível:
startup falha.

secret com quebra interna:
startup falha.

fallback conhecido:
proibido.
```

Isso é fail fast.

Um secret ausente não pode fazer a aplicação iniciar com:

```text
password padrão;

usuário default;

assinatura desabilitada;

conexão sem autenticação;

valor de desenvolvimento.
```

A prática produzirá inventário, runbook de rotação, reader de arquivos, properties de paths e testes de policy.

Também atualizará:

```text
JwtKeyStoreLoader;

application-jwt-lab.yaml;

application-prod.yaml;

compose.yaml;

compose.local.yaml;

.gitignore;

README operacional;

threat model;

audit catalog.
```

Esta aula não instalará um produto específico de cofre.

Não serão simulados:

- HashiCorp Vault;
- AWS Secrets Manager;
- Azure Key Vault;
- Google Secret Manager;
- Kubernetes External Secrets;
- HSM;
- KMS.

Essas soluções possuem autenticação, autorização, rotação, auditoria e disponibilidade próprias.

Criar uma classe chamada `VaultService` sem infraestrutura real daria uma falsa sensação de segurança.

A baseline será: desenvolvimento local com arquivos ignorados e Docker secrets; testes com valores sintéticos; produção com secret manager, identidade de workload e nenhum secret no Git ou imagem.

A próxima aula será:

```text
432 - M15.22 - OAuth2 fundamentos
```

Nela, você estudará authorization server, resource server, client, resource owner, grants, tokens e scopes antes de integrar um provedor real.

---

## Onde estamos na formação

A sequência oficial é:

```text
429:
Erros de autenticacao e autorizacao.

430:
Auditoria de acoes sensiveis.

431:
Secrets management.

432:
OAuth2 fundamentos.

433:
OpenID Connect.

434:
OAuth2 Client Credentials.
```

A aula 430 respondeu:

```text
como registrar ações sensíveis
sem armazenar as credenciais?
```

A aula 431 responderá:

```text
como impedir que as próprias
credenciais entrem em locais
onde não deveriam existir?
```

Nesta aula:

```text
inventário:
sim.

classificação:
sim.

arquivos montados:
sim.

Docker Compose secrets:
sim.

Spring configtree:
sim.

leitura em char[]:
sim.

startup fail-fast:
sim.

varredura do repositório:
sim.

rotação:
sim.

resposta a vazamento:
sim.

secret manager real:
arquitetura, não implantação.

OAuth2:
próxima aula.
```

A regra central será:

```text
secret deve existir
somente onde é necessário,
pelo menor tempo possível,
com acesso mínimo,
rotação planejada
e resposta pronta para vazamento.
```

---

## Objetivo prático

Ao final da aula, o projeto terá:

```text
docs/security/
├── M15_SECRET_INVENTORY.md
├── M15_SECRET_ROTATION_RUNBOOK.md
└── M15_SECRETS_BASELINE.md
```

Código:

```text
configuration/security/secrets/
├── SecretFileReader.java
├── SecretFileReadException.java
└── SecretPathProperties.java
```

JWT atualizado:

```text
configuration/security/jwt/
├── JwtKeyStoreSecretFilesProperties.java
└── JwtKeyStoreLoader.java
```

Testes:

```text
SecretFileReaderTest.java;

SecretsRepositoryPolicyTest.java;

SecretsStartupIntegrationTest.java.
```

Diretório local ignorado:

```text
.secrets/
├── postgres-password
├── redis-password
├── jwt-keystore-password
├── jwt-key-password
└── jwt-lab.p12
```

Mount no container:

```text
/run/secrets/application/
├── spring.datasource.password
└── spring.data.redis.password

/run/secrets/jwt/
├── keystore-password
├── key-password
└── jwt-signing.p12
```

Você irá:

1. definir secret;
2. diferenciar secret de configuração;
3. inventariar materiais;
4. classificar impacto;
5. remover defaults;
6. ignorar arquivos locais;
7. usar Docker Compose secrets;
8. importar config tree;
9. carregar password de arquivo;
10. limpar buffers;
11. validar startup;
12. proteger permissions;
13. criar testes de repositório;
14. revisar imagem;
15. revisar history;
16. documentar rotação;
17. documentar vazamento;
18. atualizar auditoria;
19. atualizar threat model;
20. preparar OAuth2.

---

## Conceito essencial

### O que é um secret

Secret é um valor que concede uma capacidade sensível quando conhecido ou possuído.

Exemplos:

- password;
- API key;
- client secret;
- private key;
- token;
- signing secret;
- credencial de banco;
- credencial de broker;
- encryption key.

O impacto depende da capacidade concedida e do privilégio associado.

---

### O que não é secret

Issuer, audience, `kid`, algoritmo, public key, certificado público, roles, permissions e correlation IDs normalmente não são secrets, mas ainda exigem integridade e controle de alteração.

---

### Hash não é igual ao secret original

Um password hash não permite autenticação direta pelo protocolo normal, mas continua sensível e pode apoiar ataques offline ou correlação. O refresh token hash também não é o valor raw, mas não deve ser publicado.

A classificação será: `secret` para acesso direto e `sensitive` para valores que ampliam risco ou apoiam ataques.

---

### Private key e public key

A private key RSA usada para JWT é secret.

A public key não é secret.

O `kid` não é secret.

O PKCS12 contém a private key e precisa ser protegido.

A password do PKCS12 é apenas uma camada e não substitui permissions, isolamento, secret manager, acesso mínimo ou rotação.

---

### Secret lifecycle

O ciclo de vida inclui geração, armazenamento, distribuição, uso, rotação, revogação, expiração, destruição e resposta a compromisso. Gerar e esquecer não é gerenciamento; owner, consumidores, localização, rotação, revogação e impacto precisam estar definidos.

---

### Inventário sem valores

O inventário contém metadata, nunca o valor: ID, nome lógico, categoria, ambiente, owner, consumidor, fonte, privilégio, rotação, expiração, impacto e revogação.

Exemplo:

```text
ID:
SEC-JWT-001.

nome:
JWT signing private key.

fonte:
secret manager / PKCS12.

consumidor:
API emissora.

impacto:
crítico.

rotação:
planejada por kid.

valor:
não registrado.
```

---

### Hardcoded secret

Este padrão é proibido:

```java
private static final String
        PASSWORD =
        "valor-real";
```

Também é proibido em:

- YAML;
- properties;
- Dockerfile;
- Compose versionado;
- SQL;
- scripts;
- testes compartilhados;
- documentação;
- exemplos copiados de produção.

Fixtures sintéticas de teste precisam permanecer isoladas.

---

### Environment variables

Variáveis de ambiente são melhores que secrets no código, mas não são um cofre.

Elas podem aparecer em:

- dumps;
- diagnósticos;
- configuração de orquestrador;
- processo pai;
- ferramentas administrativas;
- `/proc` conforme plataforma e permissões;
- logs de pipeline;
- comandos copiados.

Use environment variables quando a plataforma exige e os controles são adequados.

Prefira arquivos montados ou integração com secret manager para materiais de maior valor.

---

### Command-line arguments

Este padrão é proibido:

```text
--spring.datasource.password=...
```

Argumentos podem aparecer em:

- histórico;
- process listing;
- monitoramento;
- logs de inicialização;
- scripts.

Secrets não devem ser passados na linha de comando.

---

### Docker image

Secret não pode ser copiado em uma camada.

Mesmo que o arquivo seja removido em uma etapa posterior, ele pode permanecer no histórico da imagem.

Proibido:

```dockerfile
COPY .secrets /run/secrets
```

O secret entra somente no runtime por mount ou integração da plataforma.

---

### Docker Compose secrets

Compose permite definir um secret e concedê-lo a serviços específicos.

O container recebe um arquivo em:

```text
/run/secrets/<target>.
```

Benefícios:

- secret não entra na imagem;
- acesso pode ser por serviço;
- app lê arquivo;
- Compose separa declaração e consumo.

No Docker Compose local, o source ainda é um arquivo do host e precisa permanecer fora do Git, com permissions restritas e criação local.

---

### Spring configtree

Spring Boot pode importar uma árvore de arquivos como propriedades.

Arquivo:

```text
/run/secrets/application/spring.datasource.password
```

vira propriedade:

```text
spring.datasource.password.
```

Profile de produção:

```yaml
spring:
  config:
    import:
      - "configtree:/run/secrets/application/"
```

Sem `optional:`.

Se o diretório obrigatório não existir, o startup falha.

Em desenvolvimento sem containers, um profile local pode usar outra estratégia explícita.

Não misture um fallback secreto conhecido.

---

### Arquivo secreto e newline

Ferramentas podem terminar arquivos com newline.

A leitura precisa remover apenas:

```text
CR ou LF finais.
```

Não use `String.trim()` indiscriminadamente.

Espaços podem fazer parte do secret.

Quebras internas devem ser rejeitadas para secrets textuais de linha única.

---

### String e char[]

`String` é imutável e não pode ser apagada de forma confiável.

`char[]` pode ser preenchido com zeros depois do uso.

Isso reduz a janela em um buffer controlado, mas não garante remoção de todas as cópias na JVM.

Use `char[]` quando a API permite, como `KeyStore.load`.

Não faça claims de zeroização absoluta.

---

### Fail fast

Uma aplicação não deve descobrir secret ausente somente na primeira request real.

O startup valida:

- arquivo existe;
- é regular;
- é legível;
- tamanho é aceitável;
- valor não está vazio;
- formato é permitido.

Para produção:

```text
missing secret:
startup failure.
```

---

### Least privilege

Cada workload recebe somente os secrets necessários. No Compose, declare acesso por serviço.

---

### Rotação

Rotação envolve gerar, distribuir, validar, sobrepor quando necessário, retirar, revogar, auditar e verificar uso residual.

Para JWT:

```text
nova private key;

novo kid;

emissor assina com a nova;

validadores aceitam public keys necessárias;

access tokens antigos expiram;

chave anterior é retirada.
```

Esta aula documentará o processo, mas não transformará o projeto em authorization server multichave.

---

### Vazamento

Secret commitado deve ser considerado comprometido. A resposta prioriza conter, revogar, rotacionar, substituir, investigar e somente depois limpar o histórico. Reescrever Git não encerra o acesso concedido pelo valor.

---

## Mão na massa guiada

### 1. Criar o inventário

Arquivo:

```text
docs/security/M15_SECRET_INVENTORY.md
```

Estrutura:

```markdown
# Inventario de secrets

| ID | Material | Classificacao | Consumidor | Fonte | Rotacao | Impacto |
|---|---|---|---|---|---|---|
| SEC-DB-001 | PostgreSQL password | Secret | API | Secret manager | 90 dias ou incidente | Alto |
| SEC-REDIS-001 | Redis password | Secret | API | Secret manager | 90 dias ou incidente | Alto |
| SEC-JWT-001 | JWT private key | Secret critico | Emissor | KMS/HSM ou keystore | Por kid ou incidente | Critico |
| SEC-JWT-002 | PKCS12 password | Secret | Emissor | Secret manager | Junto do keystore | Alto |
| SEN-AUTH-001 | Password hashes | Sensitive | Auth DB | PostgreSQL | Rehash progressivo | Alto |
| SEN-REF-001 | Refresh token hashes | Sensitive | Auth DB | PostgreSQL | Expiracao | Alto |
```

Não adicione valores.

---

### 2. Criar baseline documental

Arquivo:

```text
docs/security/M15_SECRETS_BASELINE.md
```

Inclua:

- nenhum secret no Git;
- nenhum secret na imagem;
- nenhum secret em argumento;
- nenhum default secreto;
- arquivos montados no runtime;
- production startup fail-fast;
- acesso mínimo;
- inventário obrigatório;
- rotação;
- incident response;
- auditoria sem valores;
- produção NO-GO sem secret manager.

---

### 3. Atualizar .gitignore

Adicione:

```gitignore
# Local secret material
.secrets/
*.local-secret
```

Não ignore genericamente todos os arquivos `.pem` ou `.p12` sem avaliar o repositório.

Certificados públicos podem ser versionáveis em casos específicos.

O diretório de material privado precisa ser explícito.

Valide:

```powershell
git check-ignore `
  -v `
  ".secrets/jwt-lab.p12"
```

---

### 4. Criar arquivos locais sem imprimir valores

Diretório:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  ".secrets"
```

Para um secret textual, use prompt seguro e grave somente no arquivo local.

Não coloque o valor no histórico do shell.

Exemplo operacional deve usar uma função interna da equipe ou secret manager.

No laboratório, confirme somente:

```powershell
Get-ChildItem ".secrets" |
  Select-Object Name, Length
```

Não execute `Get-Content`.

---

### 5. Configurar Docker Compose secrets

No Compose:

```yaml
services:
  api:
    secrets:
      - source: postgres_password
        target:
          application/spring.datasource.password
      - source: redis_password
        target:
          application/spring.data.redis.password
      - source: jwt_keystore_password
        target:
          jwt/keystore-password
      - source: jwt_key_password
        target:
          jwt/key-password
      - source: jwt_signing_keystore
        target:
          jwt/jwt-signing.p12

secrets:
  postgres_password:
    file: ./.secrets/postgres-password

  redis_password:
    file: ./.secrets/redis-password

  jwt_keystore_password:
    file: ./.secrets/jwt-keystore-password

  jwt_key_password:
    file: ./.secrets/jwt-key-password

  jwt_signing_keystore:
    file: ./.secrets/jwt-lab.p12
```

O target mantém organização por domínio.

---

### 6. Importar config tree

Em `application-prod.yaml`:

```yaml
spring:
  config:
    import:
      - "configtree:/run/secrets/application/"
```

O profile de produção não usa `optional:`.

Em um profile local específico, se necessário:

```yaml
spring:
  config:
    import:
      - "optional:configtree:/run/secrets/application/"
```

Esse profile não pode conter defaults secretos.

---

### 7. Refatorar propriedades JWT

Crie:

```java
@ConfigurationProperties(
        prefix =
                "app.security.jwt.secret-files"
)
@Validated
public class JwtKeyStoreSecretFilesProperties {

    @NotNull
    private Path keyStore;

    @NotNull
    private Path keyStorePassword;

    @NotNull
    private Path keyPassword;

    // getters e setters

    @Override
    public String toString() {
        return "JwtKeyStoreSecretFilesProperties[redacted]";
    }
}
```

Paths não contêm valores, mas ainda não precisam aparecer em logs de produção.

---

### 8. Configurar paths sem valor

Em `application-jwt-lab.yaml`:

```yaml
app:
  security:
    jwt:
      secret-files:
        key-store:
          /run/secrets/jwt/jwt-signing.p12
        key-store-password:
          /run/secrets/jwt/keystore-password
        key-password:
          /run/secrets/jwt/key-password
```

Remova:

```text
APP_SECURITY_JWT_KEYSTORE_PASSWORD;

APP_SECURITY_JWT_KEY_PASSWORD.
```

do fluxo principal.

---

### 9. Criar SecretFileReadException

```java
public final class
        SecretFileReadException
        extends RuntimeException {

    public SecretFileReadException(
            String message
    ) {
        super(message);
    }

    public SecretFileReadException(
            String message,
            Throwable cause
    ) {
        super(message, cause);
    }
}
```

A mensagem não inclui o secret.

Evite incluir path completo quando ele revelar estrutura sensível.

---

### 10. Criar SecretFileReader

```java
@Component
public class SecretFileReader {

    private static final int MAX_BYTES =
            8 * 1024;

    public char[] readSingleLine(
            Path path
    ) {
        validatePath(path);

        byte[] bytes;

        try {
            long size =
                    Files.size(path);

            if (
                size <= 0
                || size > MAX_BYTES
            ) {
                throw new SecretFileReadException(
                        "Secret file has invalid size"
                );
            }

            bytes =
                    Files.readAllBytes(path);
        }
        catch (IOException exception) {
            throw new SecretFileReadException(
                    "Could not read required secret file",
                    exception
            );
        }

        try {
            int length =
                    removeTrailingLineBreaks(
                            bytes
                    );

            if (length == 0) {
                throw new SecretFileReadException(
                        "Secret file is empty"
                );
            }

            for (int index = 0;
                 index < length;
                 index++) {

                if (
                    bytes[index] == '\r'
                    || bytes[index] == '\n'
                    || bytes[index] == 0
                ) {
                    throw new SecretFileReadException(
                            "Secret file contains invalid characters"
                    );
                }
            }

            return StandardCharsets.UTF_8
                    .decode(
                            ByteBuffer.wrap(
                                    bytes,
                                    0,
                                    length
                            )
                    )
                    .toString()
                    .toCharArray();
        }
        finally {
            Arrays.fill(
                    bytes,
                    (byte) 0
            );
        }
    }

    private void validatePath(
            Path path
    ) {
        if (
            path == null
            || !Files.isRegularFile(path)
            || !Files.isReadable(path)
        ) {
            throw new SecretFileReadException(
                    "Required secret file is unavailable"
            );
        }
    }

    private int removeTrailingLineBreaks(
            byte[] bytes
    ) {
        int length = bytes.length;

        while (
            length > 0
            && (
                bytes[length - 1] == '\n'
                || bytes[length - 1] == '\r'
            )
        ) {
            length--;
        }

        return length;
    }
}
```

A conversão cria objetos internos temporários na JVM.

O código reduz exposição, mas não promete zeroização perfeita.

---

### 11. Atualizar JwtKeyStoreLoader

Fluxo:

```java
char[] storePassword =
        secretFileReader
                .readSingleLine(
                        properties
                                .getKeyStorePassword()
                );

char[] keyPassword =
        secretFileReader
                .readSingleLine(
                        properties
                                .getKeyPassword()
                );

try {
    KeyStore keyStore =
            KeyStore.getInstance(
                    "PKCS12"
            );

    try (
        InputStream input =
                Files.newInputStream(
                        properties
                                .getKeyStore()
                )
    ) {
        keyStore.load(
                input,
                storePassword
        );
    }

    Key key =
            keyStore.getKey(
                    keyAlias,
                    keyPassword
            );

    // validação RSA existente
}
finally {
    Arrays.fill(
            storePassword,
            '\0'
    );

    Arrays.fill(
            keyPassword,
            '\0'
    );
}
```

Não registre alias, path ou exception cause em um endpoint público.

---

### 12. Validar permissions dos arquivos

Em Linux:

```bash
stat -c "%a %n" /run/secrets/jwt/*
```

A intenção é que apenas o workload necessário consiga ler.

No Docker Compose local, suporte a `uid`, `gid` e `mode` depende do tipo de source e da plataforma.

Não declare controle que não foi verificado.

Teste dentro do container executando como o usuário não root já definido.

---

### 13. Criar SecretFileReaderTest

Cenários:

- lê UTF-8;
- preserva espaço;
- remove CR/LF somente no final;
- rejeita vazio;
- rejeita newline interno;
- rejeita NUL;
- rejeita arquivo acima de 8 KB;
- rejeita path ausente;
- não inclui valor na exception.

Use `@TempDir`.

O teste usa somente valores sintéticos.

---

### 14. Criar SecretsStartupIntegrationTest

Cenário válido:

- cria diretório temporário;
- cria arquivos sintéticos;
- aponta properties;
- inicia contexto;
- carrega o keystore de teste.

Cenários inválidos:

- password file ausente;
- arquivo vazio;
- keystore ausente;
- alias inválido;
- key password incorreta.

Espere startup failure.

Não reduza validação para facilitar o teste.

---

### 15. Criar SecretsRepositoryPolicyTest

O teste inspeciona:

```text
src/main/java;

src/main/resources;

compose files;

Dockerfile.
```

Regras mínimas:

- nenhum `BEGIN PRIVATE KEY`;
- nenhum `BEGIN RSA PRIVATE KEY`;
- nenhum `.p12` em resources;
- nenhum property secreto com valor literal em production YAML;
- nenhum `COPY .secrets`;
- `.secrets/` presente no `.gitignore`;
- argumentos com `--password=` ausentes;
- JWT compact real não versionado.

Use allowlist explícita para fixtures sintéticas de teste.

Esse teste é guardrail, não detector completo de secrets.

---

### 16. Revisar arquivos rastreados

Execute:

```powershell
git ls-files |
  Select-String `
    -Pattern `
    "\.p12$|\.jks$|\.key$|\.pem$|\.env$"
```

Revise cada resultado.

Um certificado público pode ser permitido.

Uma private key não.

---

### 17. Revisar conteúdo atual

Use buscas por indicadores, sem imprimir valores completos:

```powershell
git grep `
  -n `
  -E `
  "BEGIN (RSA )?PRIVATE KEY|password:[[:space:]]+[^$]|client-secret:[[:space:]]+[^$]"
```

A regex possui falsos positivos e negativos; revise manualmente e não publique os achados.

---

### 18. Revisar histórico

Um secret pode ter sido removido do branch atual e continuar no Git.

Use buscas controladas no histórico e ferramentas aprovadas pela equipe.

Se encontrar um valor real:

1. não o copie;
2. registre o incidente por canal restrito;
3. revogue;
4. rotacione;
5. atualize consumidores;
6. confirme o corte;
7. avalie limpeza do histórico;
8. verifique forks, caches e artifacts.

Limpar o Git não substitui rotação.

---

### 19. Inspecionar a imagem

Construa a imagem local:

```powershell
docker build `
  -t formacao-java-api:secrets-lab `
  .
```

Inspecione:

```powershell
docker history `
  --no-trunc `
  formacao-java-api:secrets-lab
```

Crie container sem iniciar a aplicação e confirme ausência de:

```text
.secrets;

jwt-lab.p12;

password files;

.env.
```

Não publique a imagem até concluir a revisão.

---

### 20. Remover secret defaults

Proibido:

```yaml
password:
  ${DB_PASSWORD:postgres}
```

Preferido:

```yaml
password:
  ${DB_PASSWORD}
```

ou config tree obrigatório.

Para local, um valor conhecido só pode existir em um profile de laboratório isolado e nunca reutilizado.

A baseline desta aula remove defaults de credenciais.

---

### 21. Atualizar audit catalog

Adicione actions futuras:

```text
SECRET_CONFIGURATION_REJECTED;

SECRET_ROTATION_STARTED;

SECRET_ROTATION_COMPLETED;

SECRET_COMPROMISE_REPORTED.
```

Nesta aula, audite apenas falhas de configuração que ocorram depois que o audit sink estiver disponível.

Startup anterior ao banco deve usar log técnico mínimo.

Nunca registre:

- nome do arquivo completo;
- valor;
- hash;
- conteúdo;
- bytes;
- password length quando isso não for necessário.

---

### 22. Criar runbook de rotação

Arquivo:

```text
docs/security/M15_SECRET_ROTATION_RUNBOOK.md
```

Estrutura:

```markdown
# Runbook de rotacao de secrets

## Antes

- Identificar owner e consumidores.
- Verificar suporte a sobreposicao.
- Criar plano de rollback.
- Definir janela.
- Preparar observabilidade.

## Rotacao

- Gerar novo material.
- Armazenar no secret manager.
- Disponibilizar ao workload.
- Reiniciar ou recarregar.
- Validar conexao e assinatura.
- Retirar o valor anterior.
- Revogar.

## Depois

- Verificar uso residual.
- Auditar conclusao.
- Atualizar inventario.
- Confirmar backups e replicas.
```

O documento não contém secrets.

---

### 23. Planejar rotação do JWT

Registre:

```text
kid atual;

kid novo;

private key nova;

public key nova;

janela de validação;

TTL máximo do access token;

retirada da chave antiga.
```

A arquitetura atual de um único decoder precisará evoluir para múltiplas public keys ou JWK Set antes de uma rotação sem interrupção.

Não rotacione a private key em produção sem esse suporte.

---

### 24. Criar runbook de vazamento

No mesmo documento ou arquivo dedicado:

```markdown
## Secret comprometido

1. Classificar alcance.
2. Conter acesso.
3. Revogar o valor.
4. Gerar substituto.
5. Atualizar consumidores.
6. Invalidar tokens ou sessoes relacionados.
7. Buscar uso indevido.
8. Revisar logs e auditoria.
9. Limpar Git e artifacts depois da revogacao.
10. Documentar causa e prevencao.
```

Exemplos:

```text
DB password:
rotacionar credencial e sessões.

JWT private key:
rotacionar chave;
invalidar confiança;
avaliar tokens forjados.

OAuth client secret:
revogar no provider;
atualizar client;
verificar grants.
```

---

### 25. Atualizar CI

Defina gates:

- testes de policy;
- secret scanner aprovado;
- bloqueio de private key;
- bloqueio de `.env`;
- revisão de image layers;
- proteção de logs;
- secrets mascarados no pipeline;
- permissions mínimas do job.

Não passe secrets de produção para jobs de pull request não confiáveis.

---

### 26. Atualizar threat model

Adicione:

```text
THR-099:
secret hardcoded no código.

THR-100:
secret entra no Git history.

THR-101:
secret é copiado para imagem.

THR-102:
secret aparece em argumento.

THR-103:
environment variable é despejada.

THR-104:
workload recebe secrets desnecessários.

THR-105:
startup usa fallback conhecido.

THR-106:
rotação quebra consumidores.

THR-107:
vazamento é removido sem revogação.

THR-108:
secret aparece em log ou audit.

THR-109:
arquivo secret possui permissões amplas.

THR-110:
private key antiga permanece confiável.
```

Controles:

- inventário;
- mounts;
- config tree;
- file reader;
- fail fast;
- least privilege;
- scanner;
- image review;
- runbook;
- audit sem valor;
- rotação por `kid`.

---

### 27. Atualizar OWASP e baseline

A02 Security Misconfiguration:

```text
secret defaults:
removidos.

startup:
fail fast.

profiles:
isolados.
```

A03 Software Supply Chain Failures:

```text
pipeline não recebe secrets
em contexto não confiável.

imagem revisada.
```

A04 Cryptographic Failures:

```text
private key externa;

keystore protegido;

rotação planejada.
```

A09 Security Logging:

```text
secret não entra em log ou audit.
```

Baseline:

```text
local:
Docker secrets e arquivos ignorados.

produção:
secret manager obrigatório.

imagem:
sem secret.

Git:
sem secret.

CLI:
sem secret.

produção pública:
NO-GO.
```

---

### 28. Executar o gate

Teste do reader:

```powershell
.\mvnw.cmd `
  -Dtest=SecretFileReaderTest `
  test
```

Policy:

```powershell
.\mvnw.cmd `
  -Dtest=SecretsRepositoryPolicyTest `
  test
```

Startup:

```powershell
.\mvnw.cmd `
  -Dtest=SecretsStartupIntegrationTest `
  test
```

Gate completo:

```powershell
.\mvnw.cmd clean verify
```

Valide ainda:

```powershell
git status --short
git check-ignore -v ".secrets/jwt-lab.p12"
docker compose config
docker history --no-trunc formacao-java-api:secrets-lab
```

Não imprima secret values durante a validação.

---

## Entendendo o que foi feito

### Secrets ganharam inventário

A equipe sabe quais capacidades sensíveis existem sem registrar valores.

### A imagem deixou de transportar material privado

Secrets entram somente no runtime.

### Config tree externalizou credenciais

O profile de produção exige a árvore montada.

### Passwords do keystore saíram do Environment

Elas são lidas de arquivos em buffers controlados.

### O startup ficou fail-fast

Ausência ou malformação impede execução insegura.

### O Compose aplicou acesso por serviço

Cada workload recebe somente o que consome.

### Testes criaram guardrails

Eles detectam padrões proibidos, embora não substituam scanner dedicado.

### Rotação deixou de ser improvisada

Inventário e runbook definem responsabilidade e ordem.

---

## Erros comuns importantes

### Tratar variável de ambiente como cofre

Ela continua exposta ao processo e à plataforma.

### Colocar secret em argumento

Process list e logs podem capturá-lo.

### Remover arquivo em uma camada posterior

O secret pode permanecer na imagem.

### Usar fallback conhecido

A aplicação inicia insegura quando o secret falta.

### Versionar `.env`

O nome do arquivo não oferece proteção.

### Imprimir secret para verificar mount

Valide existência e tamanho, não conteúdo.

### Usar trim em password

Espaços legítimos podem ser alterados.

### Confiar apenas em regex

Scanners possuem falsos positivos e negativos.

### Limpar Git antes de revogar

O valor vazado continua válido.

### Rotacionar sem mapear consumidores

Serviços podem parar ou continuar usando o antigo.

---

## Comandos úteis

### Verificar ignore

```powershell
git check-ignore `
  -v `
  ".secrets/jwt-lab.p12"
```

### Listar arquivos rastreados suspeitos

```powershell
git ls-files |
  Select-String `
    "\.p12$|\.jks$|\.key$|\.env$"
```

### Procurar private keys

```powershell
git grep `
  -n `
  -E `
  "BEGIN (RSA )?PRIVATE KEY"
```

### Testes

```powershell
.\mvnw.cmd `
  -Dtest=SecretFileReaderTest,SecretsRepositoryPolicyTest,SecretsStartupIntegrationTest `
  test
```

### Gate completo

```powershell
.\mvnw.cmd clean verify
```

### Revisar imagem

```powershell
docker history `
  --no-trunc `
  formacao-java-api:secrets-lab
```

---

## Exercício guiado

### Parte 1 — Classificação

Separe secret, sensitive e configuração pública.

### Parte 2 — Inventário

Registre metadata sem valor.

### Parte 3 — Repositório

Ignore o diretório local e crie guardrails.

### Parte 4 — Runtime

Monte secrets por serviço no Compose.

### Parte 5 — Spring Boot

Importe credenciais com config tree.

### Parte 6 — Keystore

Leia passwords de arquivo em `char[]`.

### Parte 7 — Startup

Falhe para secret ausente ou inválido.

### Parte 8 — Supply chain

Revise arquivos, histórico e imagem.

### Parte 9 — Rotação

Crie runbook para troca segura.

### Parte 10 — Incidente

Priorize revogação antes da limpeza histórica.

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 430 foi preservada;
- ponte correta aponta para OAuth2 fundamentos;
- secret foi definido por capacidade concedida;
- configuração pública foi diferenciada de secret;
- private key foi classificada como secret;
- public key e `kid` não foram classificados como secrets;
- hashes foram classificados como sensitive;
- ciclo de vida de secret foi documentado;
- inventário não contém valores;
- owner, consumidor, rotação e impacto foram registrados;
- hardcoded secrets foram proibidos;
- secrets em YAML e properties foram proibidos;
- secrets em CLI foram proibidos;
- secrets em Dockerfile e imagem foram proibidos;
- limitações de environment variables foram explicadas;
- arquivos montados foram adotados;
- Docker Compose secrets foram configurados;
- cada serviço recebe somente os secrets necessários;
- arquivos locais ficam em `.secrets`;
- `.secrets/` está no `.gitignore`;
- `git check-ignore` foi usado;
- config tree foi configurado;
- profile de produção não usa `optional`;
- secret default conhecido foi removido;
- paths de secret foram externalizados;
- `JwtKeyStoreSecretFilesProperties` foi criado;
- `toString` não expõe properties;
- `SecretFileReadException` foi criado;
- exception não inclui secret;
- `SecretFileReader` foi criado;
- tamanho máximo foi definido;
- arquivo ausente, vazio ou ilegível falha;
- trailing CR/LF é removido;
- newline interno e NUL são rejeitados;
- `trim()` não foi usado no secret;
- bytes temporários são sobrescritos;
- retorno em `char[]` foi usado;
- limites de zeroização na JVM foram documentados;
- `JwtKeyStoreLoader` usa files;
- passwords são limpas no finally;
- keystore não entra em resources;
- permissions do mount são verificadas;
- testes usam `@TempDir`;
- SecretFileReader foi testado;
- startup válido e inválido foi testado;
- policy test verifica private keys e defaults;
- allowlist de fixtures é explícita;
- policy test não foi tratado como scanner completo;
- arquivos rastreados foram revisados;
- conteúdo atual foi revisado;
- histórico foi incluído na análise;
- rotação precede limpeza de history;
- image layers foram revisadas;
- nenhum secret foi copiado para a imagem;
- audit catalog não recebe valores;
- runbook de rotação foi criado;
- rotação JWT considera `kid` e overlap;
- suporte multichave foi registrado como requisito;
- runbook de vazamento foi criado;
- revogação é prioridade;
- CI não expõe secrets a PRs não confiáveis;
- threat model foi atualizado;
- OWASP A02, A03, A04 e A09 foram atualizados;
- secret manager real não foi fingido;
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
git check-ignore -v ".secrets/jwt-lab.p12"
git grep -n -E "BEGIN (RSA )?PRIVATE KEY"
```

Adicione somente arquivos seguros:

```powershell
git add `
  labs/m14/aula-357-spring-initializr-estrutura-projeto `
  docs/diario-de-bordo.md
```

Revise o staging:

```powershell
git diff `
  --cached `
  --name-only
```

Commit recomendado:

```powershell
git commit -m "feat(m15): externalizar e validar secrets da aplicacao"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- arquivo de secret;
- `.env`;
- PKCS12;
- private key;
- password;
- API key;
- client secret;
- token;
- hash;
- output de secret manager;
- screenshot de valor;
- history rewrite não revisado.

---

## Fechamento e ponte para a próxima aula

Nesta aula, secrets deixaram de ser apenas valores escondidos em variáveis.

Eles passaram a possuir:

```text
classificação;

inventário;

owner;

consumidor;

fonte;

distribuição;

validação;

rotação;

revogação;

resposta a compromisso.
```

A baseline prática ficou:

```text
Git:
sem secret.

imagem:
sem secret.

linha de comando:
sem secret.

runtime:
arquivos montados.

Spring Boot:
config tree.

keystore:
passwords lidas de arquivo.

startup:
fail fast.

auditoria:
evento sem valor.

produção:
secret manager obrigatório.
```

A aplicação também passou a diferenciar:

```text
private key:
secret.

public key:
não secret.

password hash:
sensitive.

issuer e audience:
configuração pública com integridade.
```

Decisão:

```text
secret management não é
esconder uma string;

é controlar todo o ciclo de vida
da capacidade que aquela string,
chave ou token concede.
```

Um secret pode ser usado para autenticar um cliente perante outro sistema.

No ecossistema moderno, uma das utilizações mais comuns é:

```text
OAuth2 client secret.
```

Antes de criar esse tipo de credencial, é necessário compreender o protocolo no qual ele existe.

A próxima aula será:

```text
432 - M15.22 - OAuth2 fundamentos
```

Nela, você irá:

- diferenciar autenticação e autorização delegada;
- identificar resource owner;
- identificar client;
- identificar authorization server;
- identificar resource server;
- estudar authorization grant;
- estudar access token;
- estudar refresh token;
- estudar scope;
- diferenciar confidential e public client;
- entender por que OAuth2 não é login por si só;
- preparar OpenID Connect.

---

# Material complementar

## Checkpoint final

- [ ] Criei inventário sem valores.
- [ ] Removi secrets do código, YAML, CLI e imagem.
- [ ] Montei secrets por arquivo no runtime.
- [ ] Implementei leitura fail-fast e testes.
- [ ] Documentei rotação e resposta a vazamento.

---

## Troubleshooting adicional

### O config tree não encontra a propriedade

Confirme o nome do arquivo, diretório importado e profile ativo.

O filename precisa corresponder à property.

### O startup funciona sem secret em produção

Verifique se `optional:` foi usado indevidamente ou se existe fallback.

### O arquivo existe, mas não é legível

Confirme usuário não root, mount e permissions.

Não altere para execução como root apenas para contornar.

### A password falha depois da migração

Verifique se o arquivo possui newline final, encoding e espaços significativos.

O reader remove somente CR/LF finais.

### O teste encontra um falso positivo

Crie uma allowlist específica para fixture sintética.

Não desative a regra inteira.

### O image history mostra secret antigo

Considere a imagem comprometida, revogue o valor e reconstrua sem cache depois da correção.

### O secret foi removido do branch

Ele ainda pode existir no history, fork, artifact ou cache.

Rotacione antes de limpar.

### A rotação JWT invalida tudo

A validação ainda suporta uma única public key.

Planeje overlap por `kid` antes da troca sem interrupção.

---

## Perguntas de revisão

1. O que transforma um valor em secret?
2. Public key é secret?
3. Private key é secret?
4. Password hash é público?
5. O inventário guarda valores?
6. Environment variable é cofre?
7. Por que evitar argumentos?
8. Remover secret em camada posterior resolve?
9. Onde o Compose monta secrets?
10. O que faz config tree?
11. Produção deve usar `optional:`?
12. Por que usar `char[]`?
13. A JVM garante zeroização?
14. O que acontece se o arquivo falta?
15. O que é least privilege de secrets?
16. Rotação é apenas gerar novo valor?
17. O que fazer primeiro após vazamento?
18. Limpar Git revoga o secret?
19. Qual é a próxima aula?
20. O que OAuth2 adicionará?

---

## Roteiro de resposta

1. A capacidade sensível que ele concede.
2. Normalmente não.
3. Sim.
4. Não; é sensitive.
5. Não.
6. Não.
7. Podem aparecer em process listing e logs.
8. Não.
9. Em `/run/secrets`.
10. Converte arquivos em properties.
11. Não para secrets obrigatórios.
12. Permite sobrescrever o buffer controlado.
13. Não.
14. O startup falha.
15. Entregar somente ao workload consumidor.
16. Não; inclui distribuição, overlap, retirada e revogação.
17. Conter, revogar e rotacionar.
18. Não.
19. OAuth2 fundamentos.
20. Autorização delegada entre papéis definidos.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 431 - M15.21 - Secrets management

- Continuei no Módulo 15 de Segurança de aplicações Java.
- Defini secret pela capacidade sensível concedida.
- Diferenciei secret, sensitive e configuração pública.
- Classifiquei private key como secret.
- Classifiquei public key e `kid` como não secretos.
- Protegi password hashes e refresh token hashes como dados sensíveis.
- Modelei o ciclo de vida de secrets.
- Criei `docs/security/M15_SECRET_INVENTORY.md`.
- Inventariei metadata sem registrar valores.
- Criei `docs/security/M15_SECRETS_BASELINE.md`.
- Proibi secrets no código, YAML, CLI, Git e imagem.
- Registrei limitações de environment variables.
- Adicionei `.secrets/` ao `.gitignore`.
- Configurei Docker Compose secrets.
- Concedi secrets somente ao serviço consumidor.
- Montei arquivos em `/run/secrets`.
- Configurei Spring Boot config tree.
- Mantive o config tree obrigatório em produção.
- Removi defaults conhecidos.
- Criei `JwtKeyStoreSecretFilesProperties`.
- Criei `SecretFileReadException`.
- Criei `SecretFileReader`.
- Limitei tamanho dos arquivos.
- Rejeitei arquivos ausentes, vazios ou malformados.
- Preservei espaços significativos.
- Removi apenas CR/LF finais.
- Rejeitei newline interno e NUL.
- Sobrescrevi buffers temporários.
- Usei `char[]` para passwords do keystore.
- Documentei limites de zeroização da JVM.
- Refatorei `JwtKeyStoreLoader`.
- Não coloquei PKCS12 em resources.
- Criei `SecretFileReaderTest`.
- Criei `SecretsStartupIntegrationTest`.
- Criei `SecretsRepositoryPolicyTest`.
- Revisei arquivos rastreados, histórico e image layers.
- Criei `docs/security/M15_SECRET_ROTATION_RUNBOOK.md`.
- Planejei rotação JWT por `kid`.
- Registrei necessidade de múltiplas public keys.
- Criei procedimento de resposta a vazamento.
- Priorizei revogação e rotação antes da limpeza do Git.
- Atualizei audit catalog, threat model, OWASP e baseline.
- Não fingi possuir um secret manager real.
- Mantive produção pública como NO-GO.
- Próxima aula: OAuth2 fundamentos.
```

---

## Referência técnica curta

- [Spring Boot — Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html)
- [Docker Docs — Manage secrets securely in Docker Compose](https://docs.docker.com/compose/how-tos/use-secrets/)
- [OWASP — Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [OWASP — Key Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html)
- [OWASP — Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [Java 21 — KeyStore](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/security/KeyStore.html)
- [Java 21 — SecureRandom](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/security/SecureRandom.html)

Regra final:

```text
secrets management precisa controlar o ciclo de vida completo da capacidade sensível: nesta baseline, valores não entram no código, Git, argumentos, imagem, logs ou auditoria; cada secret possui inventário, owner, consumidor, impacto e rotação, é montado somente no workload necessário, credenciais comuns chegam por config tree, passwords do keystore são lidas de arquivo em buffers controlados, a aplicação falha no startup quando o material obrigatório está ausente e qualquer vazamento exige contenção, revogação e rotação antes da limpeza histórica.
```
