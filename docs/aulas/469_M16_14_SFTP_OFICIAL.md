# 469 - M16.14 - SFTP

## Apresentação da aula

Na aula 468, o laboratório criou o projeto:

```text
catalog-file-importer.
```

O importador passou a tratar arquivos CSV como mensagens formais.

O fluxo local ficou:

```text
inbox;

preflight;

checksum;

receipt;

atomic claim;

streaming parse;

validation;

idempotency;

adjustment;

rejection report;

archive
ou quarantine.
```

O contrato do arquivo também ficou explícito:

```text
UTF-8;

ponto e vírgula;

header obrigatório;

filename versionado;

limite de tamanho;

limite de records;

checksum SHA-256;

idempotência por record ID;

rejeições seguras.
```

Até agora, os arquivos aparecem diretamente no diretório local:

```text
data/file-integration/inbox.
```

Em uma integração real, o parceiro pode publicar esses arquivos em um servidor remoto.

A nova pergunta será:

```text
como buscar e publicar
arquivos por SFTP
sem confiar cegamente
no servidor,
sem baixar arquivos parciais,
sem expor chaves
e sem processar duas vezes?
```

SFTP significa `SSH File Transfer Protocol`. Ele usa uma sessão SSH para autenticação, criptografia e operações remotas de arquivos. Não é FTP com TLS, FTP tunelado, SCP nem HTTPS; cada modelo possui semântica própria.

Nesta aula, o `catalog-file-importer` receberá uma camada de transporte remoto.

A responsabilidade será:

```text
servidor SFTP do parceiro
        |
        v
remote inbox
        |
        | claim remoto
        v
remote processing
        |
        | download para .part
        v
local staging
        |
        | checksum + atomic move
        v
local inbox
        |
        | importador da aula 468
        v
local archive/rejected/quarantine
        |
        | acknowledgement
        v
remote acknowledgements
```

O contrato remoto usará `/inventory/outbound`, `/inventory/processing`, `/inventory/archive`, `/inventory/acknowledgements` e `/inventory/error`.

O parceiro publica o arquivo primeiro com nome temporário:

```text
inventory-adjustments-v1_20260712T140000Z_000001.csv.uploading
```

Quando o upload termina, ele renomeia para:

```text
inventory-adjustments-v1_20260712T140000Z_000001.csv
```

O importador lista somente filenames finais. A presença do nome definitivo representa publicação concluída; idade ou tamanho estável não provam que o produtor terminou. Essa regra de temporary name e rename precisa estar no contrato com o parceiro.

Quando encontrar um arquivo final, o importador fará um claim remoto.

Exemplo:

```text
/inventory/outbound/file.csv
->
/inventory/processing/file.csv.catalog-importer-01
```

O rename remoto define um único owner.

Se duas instâncias tentarem reivindicar o mesmo arquivo:

```text
uma vence;

a outra recebe
remote file not found
ou rename conflict.
```

Depois do claim, o arquivo será baixado como `local-staging/file.csv.part`. O nome final só aparecerá no inbox após término do stream, fechamento, tamanho, checksum e movimentação atômica local.

Fluxo:

```text
file.csv.part
->
file.csv.
```

O importador da aula 468 continuará processando apenas:

```text
*.csv.
```

A segurança SSH possui duas identidades: o client verifica a host key do servidor, e o servidor autentica o client por sua public key.

A host key do servidor será validada por:

```text
known_hosts pre-populado
ou
fingerprint previamente aprovado.
```

Esta configuração é proibida:

```text
StrictHostKeyChecking=no.
```

Também é proibido:

```java
setAllowUnknownKeys(true);
```

fora de um fixture de teste controlado.

Aceitar qualquer host key permite conexão com um impostor. O `known_hosts` deve chegar por canal confiável, nunca por aceitação automática da primeira conexão produtiva.

O client usará private key protegida, public key cadastrada no parceiro e passphrase em secret manager. A private key não irá para Git, imagem Docker, YAML, logs, relatórios ou banco.

No laboratório local, testes utilizarão chaves efêmeras geradas durante o setup do servidor.

A configuração produtiva terá host, port, username, private key, passphrase, known hosts, timeouts, diretórios remotos e limites de download e listagem.

O claim remoto não substitui checksum, receipt, filename uniqueness, record ID e fingerprint locais. Esses controles continuam protegendo recolocação manual, recuperação, cópia e repetição.

A aula também criará acknowledgements.

Após o processamento local:

```text
COMPLETED
ou
COMPLETED_WITH_REJECTIONS
```

o importador publicará:

```text
<original-file>.ack.json.
```

Em falha:

```text
<original-file>.error.json.
```

O upload seguirá a mesma regra de publicação:

```text
nome temporário;

stream;

rename para nome final.
```

A resposta não conterá stack, path absoluto, credentials, private key ou linhas completas.

A próxima aula será `470 - M16.15 - Jobs batch`. Aqui a busca será disparada explicitamente; scheduling, restartability formal e metadata repository ficam para depois.

Ao final, você deverá explicar as diferenças entre SFTP e FTPS, a necessidade de host verification, o papel de `known_hosts`, a autenticação por chave, a publicação temporária, o remote claim e por que SFTP é transporte, não processamento batch.

---

## Onde estamos na formação

A sequência oficial é:

```text
467:
XML.

468:
CSV e arquivos de integracao.

469:
SFTP.

470:
Jobs batch.

471:
Upload download em integracoes.
```

A aula 468 respondeu:

```text
como tratar
um arquivo CSV
com contrato,
streaming,
idempotência
e rejeições?
```

A aula 469 responderá:

```text
como transportar
esses arquivos
por SSH
com autenticação,
claim,
download atômico
e acknowledgement?
```

Nesta aula:

```text
SFTP:
sim.

SSH:
sim.

known_hosts:
sim.

public key authentication:
sim.

remote claim:
sim.

download .part:
sim.

acknowledgement:
sim.

servidor de teste:
sim.

scheduler:
não.

Spring Batch:
próxima aula.
```

A regra central será:

```text
o arquivo só entra
no fluxo local
depois de transporte
autenticado,
completo,
limitado
e verificável.
```

---

## Objetivo prático

Ao final, o `catalog-file-importer` terá:

```text
SftpTransportProperties;

SftpSessionFactoryConfiguration;

RemoteInventoryFileGateway;

SpringIntegrationSftpFileGateway;

RemoteFileDescriptor;

RemoteFileClaimService;

SftpDownloadService;

SftpAcknowledgementPublisher;

SftpTransferResult;

SftpTransportException;

SftpHostVerificationException;

SftpAuthenticationException;

SftpRemoteFileConflictException;

SftpTransferMetrics.
```

Testes:

```text
SftpPropertiesTest;

SftpKnownHostsPolicyTest;

SftpPrivateKeyPolicyTest;

SftpRemoteListingTest;

SftpFinalNameFilterTest;

SftpRemoteClaimConcurrencyTest;

SftpPartialFileVisibilityTest;

SftpDownloadAtomicityTest;

SftpDownloadSizeLimitTest;

SftpChecksumPreservationTest;

SftpRetrySafetyTest;

SftpAcknowledgementUploadTest;

SftpAcknowledgementAtomicPublishTest;

SftpRemoteArchiveTest;

SftpHostKeyRotationTest;

SftpLoggingSecurityTest;

SftpIntegrationTest.
```

Infraestrutura de teste:

```text
embedded Apache MINA SSHD server;

chaves efêmeras;

filesystem temporário;

known_hosts gerado no teste.
```

Documentação:

```text
docs/sftp/
├── SFTP_CONTRACT.md
├── SFTP_SECURITY_POLICY.md
├── SFTP_REMOTE_LIFECYCLE.md
├── SFTP_KEY_ROTATION.md
└── SFTP_RUNBOOK.md
```

Você irá:

1. diferenciar os protocolos;
2. modelar a configuração;
3. proteger host key;
4. proteger client key;
5. criar session factory;
6. criar gateway remoto;
7. listar arquivos;
8. filtrar nomes temporários;
9. fazer claim remoto;
10. baixar em streaming;
11. aplicar limites;
12. finalizar localmente com atomic move;
13. preservar checksum;
14. arquivar remotamente;
15. publicar ack;
16. testar concorrência;
17. testar perda de conexão;
18. criar métricas;
19. criar runbook;
20. preparar jobs batch.

---

## Conceito essencial

### SFTP, FTP, FTPS e SCP

FTP:

```text
protocolo antigo;

canal de controle
e canal de dados;

sem criptografia
por padrão.
```

FTPS:

```text
FTP protegido
por TLS.
```

SFTP é um protocolo de arquivos sobre SSH; SCP é um mecanismo de cópia sobre SSH com modelo mais limitado.

Não trate esses protocolos como sinônimos.

---

### SSH handshake

Uma conexão SSH passa por etapas:

```text
TCP;

identification exchange;

key exchange;

server host key verification;

encrypted session;

client authentication;

SFTP subsystem.
```

Cada etapa precisa de timeout próprio.

---

### Host key

A host key representa a identidade criptográfica do servidor SSH.

Ela não é o certificado TLS de um site.

O client recebe a public key durante o handshake e verifica se ela corresponde à key aprovada.

Se a key mudou sem uma rotação autorizada:

```text
falhar fechado.
```

A mudança pode indicar manutenção, rebuild, erro de configuração ou ataque man-in-the-middle.

---

### known_hosts

O formato `known_hosts` associa host e algoritmo a uma public key.

Exemplo sanitizado:

```text
[sftp.partner.example]:22
ssh-ed25519
AAAAC3NzaC1lZDI1NTE5AAAAI...
```

Na prática, o registro fica em uma linha.

O arquivo deve ser pre-populado, revisado, separado por ambiente e atualizado por change control.

A host public key não é segredo, mas sua origem precisa ser confiável.

---

### Accept all é inseguro

Uma sessão criptografada com um atacante continua insegura. Sem host verification, username, autenticação, arquivos e acknowledgements podem ir ao servidor errado.

---

### Client public key authentication

O servidor mantém a public key, e o client prova posse da private key por assinatura.

A private key nunca é enviada.

A passphrase protege a key em repouso e também precisa de entrega segura.

---

### Algoritmos

Prefira algoritmos aprovados pela organização e suportados pelo parceiro.

Exemplos modernos incluem:

```text
Ed25519;

RSA com SHA-2;

ECDSA
conforme policy.
```

Algoritmos legados exigem aprovação de segurança e a negociação precisa ser observada em homologação.

---

### Connection timeout

Limita a abertura da conexão.

Sem limite, indisponibilidade de rede pode prender a execução.

---

### Authentication timeout

Limita a autenticação SSH.

Ele é diferente do connection timeout.

Um servidor pode aceitar TCP e não concluir auth.

---

### Operation timeout

Lista, stat, rename, read e write precisam de limites.

Não use espera infinita em produção.

---

### Session caching

Abrir uma sessão por operação repete TCP, key exchange, auth e channel setup.

Um cache controlado pode reutilizar sessões, mas deve limitar, validar, descartar conexões quebradas e fechar no shutdown.

Nesta aula, usaremos `CachingSessionFactory` com limite pequeno.

---

### Remote directories

Diretórios são definidos em properties e filenames continuam submetidos à regex da aula 468. Paths arbitrários, `..`, separators locais e paths fornecidos pelo arquivo são proibidos; o separador remoto é `/`.

---

### Listing

O gateway lista apenas o diretório configurado e ignora diretórios, symbolic links, temporários, nomes fora do contrato e arquivos acima do limite.

---

### Publicação atômica do produtor

O producer deve:

1. enviar com suffix `.uploading`;
2. fechar o handle;
3. opcionalmente publicar checksum sidecar;
4. renomear para `.csv`.

O consumer lista apenas `.csv`.

Se rename confiável não existir, o contrato precisa de marker `.ready`, manifest, checksum ou directory handoff; a proteção não pode ser removida silenciosamente.

---

### Remote claim

Claim remoto:

```text
outbound/file.csv
->
processing/file.csv.<consumer-id>.
```

O rename precisa ocorrer dentro do servidor.

Ele não substitui transaction de banco, mas reduz disputa entre consumers.

A instância vencedora registra o claim no receipt.

---

### Arquivo preso em processing

Um processo pode morrer depois do rename, então remote processing exige recuperação.

Metadados:

- claimedAt local;
- consumer ID;
- receipt ID;
- remote path;
- checksum quando disponível.

Runbook e receipt decidem a retomada; idade isolada não basta.

---

### Download temporário

Local target:

```text
staging/<file>.part.
```

Enquanto `.part` existir:

```text
importador local ignora.
```

Depois do download:

1. flush;
2. close;
3. tamanho;
4. SHA-256;
5. atomic move para inbox.

---

### Limite durante o stream

Não confie somente no remote `stat`; aplique counting stream durante o download.

Quando ultrapassar o limite:

```text
interromper;

apagar .part;

marcar erro;

mover remoto para error
conforme policy.
```

---

### Checksum

O checksum baixado deve ser o mesmo do importador local.

Se houver sidecar `<file>.sha256`, a aplicação pode comparar.

Sidecar é opcional.

Não confie em hash de canal não autenticado.

Como o sidecar também vem por SFTP autenticado, ele pode participar do contrato.

---

### Retry do download

Retry é seguro quando o remoto permanece imutável, o `.part` é descartado, o download reinicia, o receipt é preservado e o final ainda não existe.

A baseline não implementa resume.

Resume exige controle de offset, tamanho e hash incremental.

---

### Finalização remota

Depois que o arquivo aparece no inbox local, o transporte não deve removê-lo imediatamente sem registro.

Fluxo aprovado:

1. local final publicado;
2. receipt atualizado como `DOWNLOADED`;
3. remote file movido para remote archive;
4. importador local processa.

Se o archive remoto falhar, o local permanece e o receipt registra `REMOTE_ARCHIVE_PENDING`; a idempotência impede reaplicação.

---

### Acknowledgement

O ack informa:

- filename;
- checksum;
- status;
- rows read;
- accepted;
- rejected;
- report name;
- completedAt;
- receipt ID técnico.

Upload:

```text
ack.json.uploading
->
ack.json.
```

Não inclua conteúdo das linhas.

---

### Delete remoto

A baseline prefere archive remoto.

Delete remove evidência operacional.

Retenção e limpeza serão decididas pelo parceiro.

---

### Host key rotation

Rotação segura recebe a fingerprint por canal confiável, adiciona a nova key, testa, mantém overlap, remove a antiga após cutover e registra o change.

Nunca use `allowUnknownKeys=true` durante rotação.

---

### Private key rotation

A rotação do client gera novo par, guarda a private key no secret manager, cadastra a public key, testa overlap, migra e revoga o par antigo.

Nunca envie a private key ao parceiro.

---

### Observabilidade

Métricas:

```text
sftp.connection;

sftp.authentication;

sftp.list;

sftp.claim;

sftp.download;

sftp.upload;

sftp.remote.archive;

sftp.bytes;

sftp.duration;

sftp.failure.
```

Tags:

```text
partner;

operation;

outcome;

failure.kind.
```

Não use filename ou path como tag.

---

## Mão na massa guiada

### 1. Adicionar Spring Integration SFTP

No `catalog-file-importer`, adicione a dependência SFTP compatível com a versão Spring adotada.

O stack moderno utiliza Apache MINA SSHD por baixo da session factory.

Mantenha a versão gerenciada.

---

### 2. Criar properties

```java
@ConfigurationProperties(
    prefix = "integrations.inventory-sftp"
)
public record SftpTransportProperties(
        String host,
        int port,
        String username,
        Resource privateKey,
        String privateKeyPassphrase,
        Resource knownHosts,
        Duration timeout,
        String remoteOutbound,
        String remoteProcessing,
        String remoteArchive,
        String remoteAcknowledgements,
        String remoteError,
        DataSize maximumDownloadSize,
        int maximumFilesPerPoll,
        String consumerId
) {
}
```

Valide:

- host obrigatório;
- port entre 1 e 65535;
- username obrigatório;
- key e known hosts obrigatórios;
- timeout positivo;
- paths absolutos remotos;
- paths sem `..`;
- directories distintos;
- limits positivos;
- consumer ID seguro.

---

### 3. Criar configuração local

```yaml
integrations:
  inventory-sftp:
    host: ${INVENTORY_SFTP_HOST:localhost}
    port: ${INVENTORY_SFTP_PORT:2222}
    username: ${INVENTORY_SFTP_USERNAME:catalog-importer}
    private-key: ${INVENTORY_SFTP_PRIVATE_KEY}
    private-key-passphrase: ${INVENTORY_SFTP_KEY_PASSPHRASE}
    known-hosts: ${INVENTORY_SFTP_KNOWN_HOSTS}
    timeout: 10s
    remote-outbound: /inventory/outbound
    remote-processing: /inventory/processing
    remote-archive: /inventory/archive
    remote-acknowledgements: /inventory/acknowledgements
    remote-error: /inventory/error
    maximum-download-size: 50MB
    maximum-files-per-poll: 20
    consumer-id: ${HOSTNAME:catalog-importer-local}
```

Não forneça default para private key ou passphrase.

---

### 4. Criar session factory

```java
@Bean
SessionFactory<SftpClient.DirEntry> sftpSessionFactory(
        SftpTransportProperties properties
) {
    DefaultSftpSessionFactory factory =
            new DefaultSftpSessionFactory(
                false
            );

    factory.setHost(
        properties.host()
    );

    factory.setPort(
        properties.port()
    );

    factory.setUser(
        properties.username()
    );

    factory.setPrivateKey(
        properties.privateKey()
    );

    factory.setPrivateKeyPassphrase(
        properties.privateKeyPassphrase()
    );

    factory.setKnownHostsResource(
        properties.knownHosts()
    );

    factory.setAllowUnknownKeys(
        false
    );

    factory.setTimeout(
        properties.timeout()
    );

    CachingSessionFactory<SftpClient.DirEntry>
            caching =
                new CachingSessionFactory<>(
                    factory,
                    4
                );

    caching.setSessionWaitTimeout(
        properties.timeout()
                  .toMillis()
    );

    return caching;
}
```

Ajuste a API à versão aprovada.

---

### 5. Criar policy test de host keys

O teste falha se encontrar:

```text
allowUnknownKeys=true;

AcceptAllServerKeyVerifier;

StrictHostKeyChecking=no.
```

Exceção:

```text
fixture de teste
explicitamente isolado.
```

---

### 6. Criar policy de secrets

Falhe se:

- private key está em `src/main/resources`;
- passphrase possui default;
- key aparece em YAML;
- logs exibem property;
- arquivo começa com `BEGIN OPENSSH PRIVATE KEY` no repositório.

---

### 7. Criar RemoteInventoryFileGateway

```java
public interface RemoteInventoryFileGateway {

    List<RemoteFileDescriptor> listPublished();

    RemoteFileDescriptor claim(
            RemoteFileDescriptor file
    );

    void download(
            RemoteFileDescriptor claimed,
            OutputStream target
    );

    void archive(
            RemoteFileDescriptor claimed
    );

    void moveToError(
            RemoteFileDescriptor claimed,
            String safeReasonCode
    );

    void uploadAcknowledgement(
            String remoteName,
            InputStream content
    );
}
```

O application service não conhece `SftpSession`.

---

### 8. Criar descriptor

```java
public record RemoteFileDescriptor(
        String name,
        String remotePath,
        long size,
        Instant modifiedAt,
        String claimedName
) {
}
```

Não exponha o path em APIs públicas.

---

### 9. Implementar listagem

Use session callback.

Filtre:

- regular file;
- naming regex;
- size permitido;
- não symlink;
- final suffix `.csv`;
- limite por poll.

Ordene por:

```text
filename timestamp
e sequence.
```

Não confie apenas no `modifiedAt`.

---

### 10. Ignorar temporários

Arquivos:

```text
*.uploading;

*.part;

*.tmp;

hidden files.
```

não entram.

Crie métricas separadas apenas para quantidade observada, sem filename tag.

---

### 11. Implementar claim remoto

```java
String claimedName =
        file.name()
        + "."
        + properties.consumerId();

String source =
        remoteOutbound
        + "/"
        + file.name();

String target =
        remoteProcessing
        + "/"
        + claimedName;

session.rename(
    source,
    target
);
```

O consumer ID deve seguir regex segura.

---

### 12. Tratar concorrência de claim

Se o source desapareceu:

```text
claim lost;

não é erro operacional crítico.
```

Se target já existe:

```text
remote conflict;

quarantine operacional.
```

Não sobrescreva.

---

### 13. Criar SftpDownloadService

```java
public LocalDownloadResult downloadClaimed(
        RemoteFileDescriptor claimed
) {
    Path part =
            staging.resolve(
                claimed.name()
                + ".part"
            );

    Path finalFile =
            localInbox.resolve(
                claimed.name()
            );

    try (
        OutputStream output =
            boundedDigestingOutput(
                part,
                maximumBytes
            )
    ) {
        gateway.download(
            claimed,
            output
        );
    }
    catch (
        RuntimeException exception
    ) {
        deleteQuietly(
            part
        );

        throw exception;
    }

    FileDigest digest =
            verifyDownloadedFile(
                part,
                claimed
            );

    Files.move(
        part,
        finalFile,
        StandardCopyOption.ATOMIC_MOVE
    );

    return new LocalDownloadResult(
            finalFile,
            digest
    );
}
```

---

### 14. Não confiar em remote size

Compare:

```text
remote stat;

bytes recebidos;

local file size.
```

Divergência:

```text
SFTP_REMOTE_SIZE_MISMATCH.
```

O arquivo vai para remote error ou permanece em processing para runbook, conforme policy.

---

### 15. Verificar local destination

Antes do download:

- final file não existe;
- `.part` antigo é reconciliado;
- path está dentro de staging;
- no symlink;
- filesystem suporta atomic move para inbox.

Staging e inbox devem estar no mesmo filesystem.

---

### 16. Tratar `.part` abandonado

Na inicialização controlada:

- listar `.part`;
- consultar receipt;
- nunca promover automaticamente;
- apagar somente com policy;
- registrar métrica;
- manter evidence no log técnico seguro.

---

### 17. Criar receipt de transporte

Amplie a persistência com:

```text
remote path hash;

remote filename;

remote size;

claim owner;

claimedAt;

downloadedAt;

remoteArchivedAt;

transportStatus.
```

Não armazene private key, signature ou known_hosts content.

---

### 18. Arquivar remotamente

Depois da publicação local:

```java
gateway.archive(
    claimed
);
```

Target:

```text
/inventory/archive/YYYY/MM/DD/<original-name>.
```

Não sobrescreva arquivo existente.

Conflict remoto exige intervenção.

---

### 19. Tratar archive pending

Se local final existe e remote archive falha:

```text
transportStatus:
REMOTE_ARCHIVE_PENDING.
```

Uma nova execução consulta o receipt e tenta apenas o archive.

Não baixa novamente.

---

### 20. Publicar acknowledgement

Gere JSON controlado.

Nome:

```text
<file>.ack.json.
```

Upload remoto:

```text
ack.json.uploading;

rename;

ack.json.
```

---

### 21. Criar upload atômico

```java
String temporary =
        remoteName
        + ".uploading";

session.write(
    content,
    remoteAcknowledgements
        + "/"
        + temporary
);

session.rename(
    remoteAcknowledgements
        + "/"
        + temporary,
    remoteAcknowledgements
        + "/"
        + remoteName
);
```

A API real pode expor `write` por stream.

Não carregue reports grandes inteiros em memória.

---

### 22. Proibir overwrite

Se ack final já existe:

- comparar hash quando suportado;
- mesmo conteúdo: sucesso idempotente;
- conteúdo diferente: conflict;
- nunca sobrescrever silenciosamente.

---

### 23. Criar error acknowledgement

Em status final de erro:

```text
<file>.error.json.
```

Campos:

- receipt ID;
- filename;
- checksum;
- status;
- safe error code;
- completedAt.

Sem stack ou raw row.

---

### 24. Criar server embutido de teste

Use Apache MINA SSHD para criar:

- host key efêmera;
- user public key auth;
- SFTP subsystem;
- filesystem temporário;
- directories do contrato.

O teste gera `known_hosts` com a host public key do server.

Nenhum `allowUnknownKeys` é necessário no client testado.

---

### 25. Testar host key correta

Esperado:

```text
connection:
success;

authentication:
success;

list:
success.
```

---

### 26. Testar host key diferente

Troque a host key do server sem atualizar `known_hosts`.

Esperado:

```text
connection rejected;

zero auth attempt útil;

zero file operation.
```

---

### 27. Testar key rotation

Known hosts contém key atual e nova durante overlap.

Ambas são aceitas no teste de janela.

Depois, remova a antiga e confirme rejeição.

---

### 28. Testar private key errada

Esperado:

```text
authentication failure;

zero listing;

safe exception.
```

Não logue a passphrase.

---

### 29. Testar temporário invisível

Remote:

```text
file.csv.uploading.
```

Listagem publicada:

```text
vazia.
```

Depois do rename:

```text
1 file.
```

---

### 30. Testar claim concorrente

Duas threads listam o mesmo file.

Ambas tentam rename.

Esperado:

```text
1 claim;

1 lost claim;

1 remote processing file.
```

---

### 31. Testar download completo

Confirme:

- `.part` durante transfer;
- final ausente;
- final aparece após close;
- checksum igual;
- bytes iguais;
- remote archive concluído.

---

### 32. Testar falha no meio

Server interrompe stream.

Esperado:

```text
.part removido
ou mantido conforme runbook;

final ausente;

receipt DOWNLOAD_FAILED;

remote file em processing.
```

---

### 33. Testar retry

Nova tentativa:

- descarta `.part`;
- baixa desde o início;
- usa o mesmo receipt;
- publica um único final.

---

### 34. Testar limite

Remote file informa tamanho pequeno, mas envia acima do limite.

O counting stream aborta.

Isso comprova que remote stat não é a única defesa.

---

### 35. Testar checksum

Bytes remotos e locais produzem o mesmo SHA-256.

O checksum passa para o receipt da aula 468.

---

### 36. Testar remote archive failure

Simule permission denied.

Esperado:

```text
local inbox preservado;

REMOTE_ARCHIVE_PENDING;

sem novo download.
```

---

### 37. Testar ack

Confirme:

- `.uploading` aparece durante write;
- final só aparece após rename;
- JSON corresponde ao receipt;
- nenhum secret;
- upload idempotente.

---

### 38. Testar filename remoto hostil

Nomes com:

```text
../;

barra;

backslash;

controle;

Unicode confusável;

suffix errado.
```

são ignorados e geram métrica limitada.

Não mova o arquivo automaticamente sem policy.

---

### 39. Testar symlink remoto

Symlink para outro diretório:

```text
ignorado;

security metric.
```

---

### 40. Testar timeouts

Fixtures:

- TCP indisponível;
- server aceita e não autentica;
- list bloqueia;
- read interrompe.

Cada uma produz categoria estável.

---

### 41. Criar exceptions

```text
SftpConnectionException;

SftpHostVerificationException;

SftpAuthenticationException;

SftpOperationTimeoutException;

SftpRemoteFileConflictException;

SftpTransferIntegrityException.
```

Não exponha mensagens da library diretamente.

---

### 42. Criar métricas

Métricas:

```text
sftp.transport.connection;

sftp.transport.authentication;

sftp.transport.listed;

sftp.transport.claimed;

sftp.transport.downloaded;

sftp.transport.uploaded;

sftp.transport.archived;

sftp.transport.bytes;

sftp.transport.duration;

sftp.transport.failures.
```

Tags fechadas:

```text
partner;

operation;

outcome;

failure.kind.
```

---

### 43. Criar logging test

Sentinelas:

```text
private-key-sentinel;

passphrase-sentinel;

known-hosts-sentinel;

remote-payload-sentinel;

absolute-path-sentinel.
```

Force connection, auth, list e transfer failures.

Nenhuma sentinela aparece.

---

### 44. Criar SFTP_CONTRACT.md

Inclua:

- protocol;
- host/port por ambiente;
- remote directories;
- filename contract;
- publishing suffix;
- claim rule;
- ack naming;
- archive policy;
- limits;
- retry;
- owner.

Não inclua credentials.

---

### 45. Criar SFTP_SECURITY_POLICY.md

Registre:

```text
known_hosts required;

allow unknown forbidden;

public key auth;

private key in secret manager;

passphrase required conforme policy;

HTTPS não se aplica;

SSH algorithms approved;

symlinks forbidden;

remote paths fixed;

logs sanitized.
```

---

### 46. Criar remote lifecycle

Diagrama:

```text
OUTBOUND
   |
   | rename claim
   v
PROCESSING
   |
   | download local
   v
LOCAL INBOX
   |
   +--> REMOTE ARCHIVE
   |
   +--> ACKNOWLEDGEMENTS
```

Falha de integridade:

```text
PROCESSING
->
REMOTE ERROR
ou manual recovery.
```

---

### 47. Criar key rotation doc

Inclua:

- host key;
- client key;
- overlap;
- owner;
- fingerprints;
- rollback;
- revogação;
- audit.

---

### 48. Criar runbook

Perguntas:

- DNS resolve;
- TCP conecta;
- host key coincide;
- key ID/algorithm esperado;
- client auth funciona;
- remote directories existem;
- filename final;
- arquivo ainda `.uploading`;
- claim ocorreu;
- receipt existe;
- `.part` existe;
- bytes e checksum;
- local final existe;
- remote archive pending;
- ack publicado;
- key rotation em andamento;
- clock e timeout;
- permissions.

---

### 49. Executar testes focados

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-file-importer

.\mvnw.cmd `
  -Dtest=SftpPropertiesTest,SftpKnownHostsPolicyTest,SftpPrivateKeyPolicyTest,SftpRemoteListingTest,SftpFinalNameFilterTest,SftpRemoteClaimConcurrencyTest,SftpPartialFileVisibilityTest,SftpDownloadAtomicityTest,SftpDownloadSizeLimitTest,SftpChecksumPreservationTest,SftpRetrySafetyTest,SftpAcknowledgementUploadTest,SftpAcknowledgementAtomicPublishTest,SftpRemoteArchiveTest,SftpHostKeyRotationTest,SftpLoggingSecurityTest,SftpIntegrationTest `
  test
```

---

### 50. Executar cenário manual

1. inicie o SFTP de teste;
2. publique `.uploading`;
3. confirme que não aparece;
4. renomeie para `.csv`;
5. execute `fetchOnce`;
6. confirme remote claim;
7. confirme local `.part`;
8. confirme local final;
9. execute importador;
10. publique ack;
11. confirme remote archive.

---

### 51. Executar regressão do CSV

```powershell
.\mvnw.cmd `
  -Dtest=FileIdempotencyTest,RecordIdempotencyTest,PartialRejectionTest,FileLifecycleTest `
  test
```

O transporte não pode quebrar o contrato local.

---

### 52. Executar gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- host verification;
- auth;
- remote paths;
- claim;
- atomic download;
- limits;
- checksum;
- retry;
- archive;
- ack;
- logs;
- metrics;
- CSV regression.

---

### 53. Registrar limitações

Ainda faltam:

```text
scheduler;

Spring Batch;

job repository;

restartability formal;

distributed scheduling lock;

production SFTP;

secret manager real;

network allowlist;

antivirus;

PGP;

load test.
```

---

## Entendendo o que foi feito

### O transporte ficou autenticado

O client verifica a identidade do servidor e o servidor verifica a identidade do client.

### known_hosts virou gate

Unknown ou changed key não é aceita silenciosamente.

### Publicação parcial ficou invisível

O producer usa suffix temporário e rename.

### Ownership remoto ficou explícito

Rename para processing define um vencedor.

### Download local ficou atômico

`.part` só vira `.csv` depois de integridade e fechamento.

### Idempotência local foi preservada

Claim remoto não substitui checksum, receipt e record ID.

### Falhas ficaram recuperáveis

Remote processing e receipt mostram onde o fluxo parou.

### Acknowledgement também ficou atômico

Upload temporário e rename evitam ack parcial.

### A próxima camada ficou preparada

Jobs batch irão orquestrar esse transporte e processamento.

---

## Erros comuns importantes

### Usar allowUnknownKeys

O client aceita servidor impostor.

### Confiar só em public key auth

Ela autentica o client para o server, não o server para o client.

### Fazer download direto para inbox

O importador pode ler arquivo parcial.

### Listar `.uploading`

O arquivo ainda pode estar em escrita.

### Processar sem claim remoto

Duas instâncias podem baixar o mesmo arquivo.

### Confiar só no remote size

O stream real pode ultrapassar o metadata.

### Apagar remoto antes do local final

Uma falha pode perder o arquivo.

### Sobrescrever acknowledgement

Resultado divergente fica invisível.

### Colocar private key no resources

A imagem da aplicação passa a conter secret.

### Confundir SFTP com batch

Transporte não oferece restartability de job por si só.

---

## Comandos úteis

### Testes de segurança

```powershell
.\mvnw.cmd `
  -Dtest=SftpKnownHostsPolicyTest,SftpPrivateKeyPolicyTest,SftpHostKeyRotationTest,SftpLoggingSecurityTest `
  test
```

### Testes de lifecycle

```powershell
.\mvnw.cmd `
  -Dtest=SftpRemoteClaimConcurrencyTest,SftpPartialFileVisibilityTest,SftpDownloadAtomicityTest,SftpRemoteArchiveTest `
  test
```

### Testes de integridade

```powershell
.\mvnw.cmd `
  -Dtest=SftpDownloadSizeLimitTest,SftpChecksumPreservationTest,SftpRetrySafetyTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar configuração insegura

```powershell
git grep `
  -n `
  -E `
  "allowUnknownKeys\\(true\\)|StrictHostKeyChecking=no|BEGIN OPENSSH PRIVATE KEY|private-key-passphrase:|AcceptAllServerKeyVerifier"
```

---

## Exercício guiado

### Parte 1 — Segurança

Configure known hosts e key authentication.

### Parte 2 — Session factory

Crie factory e cache controlado.

### Parte 3 — Listing

Filtre somente arquivos finais.

### Parte 4 — Claim

Renomeie para remote processing.

### Parte 5 — Download

Use `.part`, limit e checksum.

### Parte 6 — Finalização

Publique no inbox com atomic move.

### Parte 7 — Archive

Mova o remoto sem apagar evidência.

### Parte 8 — Ack

Publique JSON com nome temporário.

### Parte 9 — Testes

Use servidor SFTP embutido.

### Parte 10 — Gate

Comprove host verification e uma única entrega local.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 468 foi preservada;
- SFTP foi diferenciado de FTP;
- SFTP foi diferenciado de FTPS;
- SFTP foi diferenciado de SCP;
- SSH handshake foi explicado;
- host key foi explicada;
- client authentication foi explicada;
- known hosts é obrigatório;
- unknown keys são rejeitadas;
- changed keys são rejeitadas;
- `StrictHostKeyChecking=no` foi proibido;
- accept-all verifier foi proibido;
- private key fica fora do Git;
- passphrase não possui default;
- public key é cadastrada no parceiro;
- algoritmos legados não são habilitados sem aprovação;
- connection timeout foi configurado;
- authentication timeout foi considerado;
- operation timeout foi considerado;
- session cache foi limitado;
- remote paths são fixos;
- filename remoto usa regex;
- symlinks remotos são ignorados;
- `.uploading` é ignorado;
- producer rename foi definido;
- remote claim foi implementado;
- concorrência de claim foi testada;
- remote processing foi criado;
- arquivo preso em processing foi documentado;
- download usa `.part`;
- local final não aparece durante stream;
- limite é aplicado durante o stream;
- remote stat não é a única defesa;
- checksum foi preservado;
- retry descarta partial;
- resume parcial não foi inventado;
- staging e inbox usam atomic move;
- local receipt foi ampliado;
- remote archive ocorre após publicação local;
- archive pending foi modelado;
- delete remoto não é baseline;
- acknowledgement foi criado;
- acknowledgement usa upload temporário;
- acknowledgement não sobrescreve silenciosamente;
- error acknowledgement foi criado;
- servidor embutido de teste foi criado;
- host key correta foi testada;
- host key incorreta foi testada;
- private key incorreta foi testada;
- temporário invisível foi testado;
- download interrompido foi testado;
- size mismatch foi testado;
- archive failure foi testada;
- retry seguro foi testado;
- rotação de host key foi documentada;
- rotação de client key foi documentada;
- logs não contêm key, passphrase ou payload;
- métricas possuem baixa cardinalidade;
- CSV regression foi executada;
- scheduler não foi antecipado;
- Spring Batch não foi antecipado;
- limitações foram registradas;
- produção permaneceu NO-GO;
- gate foi executado;
- commit recomendado está pronto.

---

## Commit recomendado

Antes do commit:

```powershell
git status
git diff
git diff --check
git diff --stat

git grep `
  -n `
  -E `
  "allowUnknownKeys|StrictHostKeyChecking|BEGIN OPENSSH PRIVATE KEY|privateKeyPassphrase|knownHosts|\\.uploading|ATOMIC_MOVE"
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-file-importer `
  labs/m16/aula-456-integracoes-http-entre-sistemas/docs `
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
git commit -m "feat(m16): transportar arquivos com SFTP seguro"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- private key;
- passphrase;
- known hosts não aprovado;
- endpoint real;
- usuário produtivo;
- arquivo real;
- `.part`;
- ack real;
- scheduler;
- Spring Batch antecipado;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o importador ganhou uma fronteira de transporte remoto segura.

O fluxo passou a ser:

```text
remote outbound;

final filename;

remote claim;

remote processing;

local .part;

size e checksum;

local atomic move;

local inbox;

CSV importer;

remote archive;

acknowledgement.
```

A principal decisão foi:

```text
SFTP só entrega
o arquivo ao fluxo local;

contrato,
idempotência,
validação
e processamento
continuam independentes.
```

Também ficou comprovado que:

- SSH criptografado sem host verification não é suficiente;
- public key auth do client não autentica o server;
- known hosts precisa ser pre-populado;
- arquivos temporários não devem ser listados;
- remote rename define ownership;
- `.part` impede leitura local incompleta;
- remote size precisa ser confirmado durante o stream;
- checksum preserva integridade;
- remote archive e receipt permitem recuperação;
- acknowledgements também precisam de publicação atômica;
- secrets e paths não pertencem aos logs.

Próxima aula:

```text
470 - M16.15 - Jobs batch
```

Nela, você irá:

- compreender job, step e execution;
- criar JobRepository;
- configurar Spring Batch;
- separar download e processamento em steps;
- implementar restartability;
- impedir execução concorrente;
- usar parameters;
- tratar skip e retry;
- promover dados entre steps;
- agendar o fluxo de forma controlada;
- observar execuções e falhas.

---

# Material complementar

## Checkpoint final

- [ ] Validei host key com known hosts.
- [ ] Autentiquei com private key externa.
- [ ] Reivindiquei o arquivo remotamente.
- [ ] Baixei com `.part`, limite e checksum.
- [ ] Publiquei archive e acknowledgement.

---

## Troubleshooting adicional

### A conexão é criptografada, mas falha na host key

O `known_hosts` não corresponde ao servidor ou a key foi rotacionada.

### Funciona apenas com allow unknown

O ambiente está sem known hosts aprovado; não libere com bypass.

### Auth falha depois da troca da key

Confirme public key cadastrada, formato da private key e passphrase.

### O arquivo não aparece na listagem

Ele pode estar com suffix temporário, nome inválido, size acima do limite ou ser symlink.

### Duas instâncias baixam o mesmo arquivo

O remote claim pode não estar sendo executado antes do download.

### O importador lê `.part`

O filtro local da aula 468 foi alterado incorretamente.

### Download termina com size diferente

O arquivo remoto pode ter mudado ou o stream foi interrompido.

### Local está pronto, remoto continua em processing

Consulte `REMOTE_ARCHIVE_PENDING` e execute apenas o archive.

### Ack aparece incompleto

O upload foi feito diretamente com o nome final.

### Teste passa com server errado

O client de teste pode estar usando accept-all em vez de known hosts.

---

## Perguntas de revisão

1. O que é SFTP?
2. SFTP é FTPS?
3. SFTP é SCP?
4. O que autentica o servidor?
5. O que autentica o client?
6. Public key auth valida host?
7. Para que serve known hosts?
8. Unknown key deve ser aceita?
9. Por que usar `.uploading`?
10. O que define o remote owner?
11. Por que baixar para `.part`?
12. Remote size é suficiente?
13. Quando publicar no inbox?
14. Claim substitui checksum?
15. Quando arquivar remotamente?
16. Por que publicar ack temporário?
17. Private key pode ir ao Git?
18. SFTP é um batch framework?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Protocolo de arquivos sobre SSH.
2. Não.
3. Não.
4. Host key.
5. Private/public key authentication.
6. Não.
7. Verificar identidade do servidor.
8. Não.
9. Evitar arquivo parcial.
10. Rename remoto.
11. Evitar leitura local incompleta.
12. Não.
13. Após download, limite e checksum.
14. Não.
15. Após publicação local registrada.
16. Evitar ack parcial.
17. Não.
18. Não.
19. Jobs batch.
20. Orquestração, steps e restartability.

---

## Desafio opcional

Adicione suporte opcional a:

```text
<file>.sha256.
```

Requisitos:

- sidecar publicado com suffix temporário;
- algoritmo declarado;
- hash em lowercase hexadecimal;
- filename referenciado exatamente;
- limite pequeno;
- mesma autenticação SFTP;
- zero confiança em path informado pelo sidecar;
- divergência move para remote error;
- ausência segue policy configurável;
- checksum local continua sendo calculado.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 469 - M16.14 - SFTP

- Diferenciei SFTP, FTP, FTPS e SCP.
- Estudei o handshake SSH.
- Diferenciei host key e autenticação do client.
- Tornei `known_hosts` obrigatório.
- Proibi `allowUnknownKeys=true` e `StrictHostKeyChecking=no`.
- Mantive private key e passphrase fora do Git.
- Modelei rotação de host key e client key.
- Criei `SftpTransportProperties`.
- Configurei `DefaultSftpSessionFactory`.
- Configurei `CachingSessionFactory` limitado.
- Defini connection, authentication e operation timeouts.
- Criei `RemoteInventoryFileGateway`.
- Fixei remote paths por configuração.
- Filtrei filename e symlink.
- Ignorei `.uploading`, `.part` e temporários.
- Modelei publicação remota por rename.
- Implementei remote claim.
- Testei claim concorrente.
- Modelei arquivos presos em remote processing.
- Implementei download para `.part`.
- Apliquei limite durante o stream.
- Comparei remote size, bytes e local size.
- Preservei checksum SHA-256.
- Publiquei no inbox com atomic move.
- Mantive idempotência local.
- Modelei `REMOTE_ARCHIVE_PENDING`.
- Preferi archive remoto a delete.
- Criei acknowledgement e error acknowledgement.
- Publiquei ack por temporary name e rename.
- Impedi overwrite silencioso.
- Criei servidor SFTP embutido com chaves efêmeras.
- Testei host key correta e incorreta.
- Testei private key incorreta.
- Testei arquivo temporário invisível.
- Testei download interrompido e retry.
- Testei size limit e checksum.
- Testei falha de archive.
- Criei métricas e logs seguros.
- Criei contract, security policy, lifecycle, key rotation e runbook.
- Executei regressão do CSV.
- Não antecipei scheduler ou Spring Batch.
- Mantive produção NO-GO.
- Próxima aula: Jobs batch.
```

---

## Referência técnica curta

- [Apache MINA SSHD — Client setup](https://github.com/apache/mina-sshd/blob/master/docs/client-setup.md)
- [Apache MINA SSHD — SFTP](https://github.com/apache/mina-sshd/blob/master/docs/sftp.md)
- [Spring Integration — SFTP Session Factory](https://docs.spring.io/spring-integration/reference/sftp/session-factory.html)
- [Spring Integration — SFTP Outbound Adapter](https://docs.spring.io/spring-integration/reference/sftp/outbound.html)
- [OpenSSH — ssh-keygen](https://man.openbsd.org/ssh-keygen)
- [Java — Files](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/Files.html)

Regra final:

```text
uma integração SFTP segura deve autenticar as duas pontas e preservar o lifecycle do arquivo: a host key do servidor é validada contra known hosts pre-populado, o client usa private key externa e public key cadastrada, unknown keys e algorithms legados não são aceitos por conveniência, o produtor publica por temporary name e rename, o consumer lista somente nomes finais, reivindica o arquivo remotamente, baixa em streaming para `.part`, aplica limite, tamanho e SHA-256, publica no inbox por atomic move, mantém receipt e idempotência local, arquiva o remoto sem apagar evidência e publica acknowledgements também por rename, enquanto scheduler e Spring Batch permanecem camadas posteriores de orquestração.
```
