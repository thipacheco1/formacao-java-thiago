# 471 - M16.16 - Upload download em integracoes

## Apresentação da aula

Nas três aulas anteriores, o laboratório construiu um fluxo completo de integração por arquivos.

Na aula 468:

```text
contrato CSV;

streaming;

checksum;

idempotência;

rejection report;

lifecycle local.
```

Na aula 469:

```text
transporte SFTP;

known_hosts;

remote claim;

download .part;

remote archive;

acknowledgement.
```

Na aula 470:

```text
Spring Batch;

JobInstance;

steps;

checkpoint;

skip;

retry;

restart.
```

O parceiro, porém, pode não possuir SFTP.

Outra integração pode disponibilizar arquivos por uma API HTTP.

Também pode ser necessário que um consumidor autorizado faça download de:

- arquivo recebido;
- rejection report;
- sidecar de resultado;
- documento de auditoria;
- exportação gerada;
- evidência técnica.

A pergunta central será como receber e entregar arquivos por HTTP sem carregar tudo em memória, confiar no filename, ultrapassar limites, publicar conteúdo parcial ou expor dados a callers indevidos.

O `catalog-file-importer` ganhará uma API máquina a máquina.

O contrato principal será dividido em duas etapas.

Primeiro, o client cria a metadata:

```http
POST /api/v1/integration-files
Idempotency-Key: <key>
Content-Type: application/json
```

Request:

```json
{
  "contract": "inventory-adjustments-v1",
  "originalFileName": "inventory-adjustments-v1_20260712T140000Z_000001.csv",
  "mediaType": "text/csv",
  "expectedSize": 48213,
  "expectedContentDigest": "sha-256=:BASE64_DIGEST:"
}
```

Response:

```http
201 Created
Location: /api/v1/integration-files/{fileId}
```

```json
{
  "fileId": "c1daef28-4e8d-4fc5-9a46-9d35b58a3fe8",
  "state": "CREATED",
  "uploadUrl": "/api/v1/integration-files/c1daef28-4e8d-4fc5-9a46-9d35b58a3fe8/content",
  "downloadUrl": "/api/v1/integration-files/c1daef28-4e8d-4fc5-9a46-9d35b58a3fe8/content"
}
```

Depois, o client envia os bytes:

```http
PUT /api/v1/integration-files/{fileId}/content
Content-Type: text/csv
Content-Length: 48213
Content-Digest: sha-256=:BASE64_DIGEST:
If-None-Match: *
```

O body será o arquivo bruto.

A API não usará o filename como path. O servidor gerará file ID, storage key, diretório e nome físico; o nome original será apenas metadata de exibição validada.

O upload seguirá:

```text
request stream;

size counter;

SHA-256;

temporary file;

flush e close;

digest comparison;

atomic move;

state STORED.
```

O arquivo só ficará disponível depois de `STORED`. Se a conexão cair, o temporário é removido, o estado volta a ser recuperável e nenhum final é publicado.

O download será:

```http
GET /api/v1/integration-files/{fileId}/content
```

Headers:

```http
Content-Type: text/csv
Content-Length: 48213
Content-Disposition: attachment; filename="inventory-adjustments-v1_....csv"
ETag: "sha256-..."
Last-Modified: Sun, 12 Jul 2026 14:00:00 GMT
Accept-Ranges: bytes
X-Content-Type-Options: nosniff
Cache-Control: private, max-age=0, must-revalidate
Content-Digest: sha-256=:BASE64_DIGEST:
```

A API também suportará:

```http
HEAD /api/v1/integration-files/{fileId}/content
```

O `HEAD` devolve a mesma metadata do `GET`, sem body.

Conditional request:

```http
If-None-Match: "sha256-..."
```

Quando o conteúdo não mudou:

```http
304 Not Modified
```

Range request:

```http
Range: bytes=0-1048575
```

Resposta:

```http
206 Partial Content
Content-Range: bytes 0-1048575/48213
```

Um range fora do arquivo produz:

```http
416 Range Not Satisfiable
Content-Range: bytes */48213
```

No Spring MVC, respostas com `Resource` permitem que o framework trate byte ranges quando o recurso é repetível e possui tamanho conhecido.

A baseline utilizará:

```text
FileSystemResource.
```

Não usará `InputStreamResource` para arquivos armazenados, porque um stream de uso único não oferece a mesma repetibilidade necessária para metadata e ranges.

O upload principal não será multipart. Para máquina a máquina, `PUT` binário oferece menos overhead, file ID estável, retry previsível, checksum associado e limite direto no stream.

A aula também apresentará compatibilidade multipart.

Spring MVC pode receber:

```java
MultipartFile
```

Spring WebFlux pode receber:

```java
FilePart
```

Mesmo nesses casos, é proibido chamar:

```java
file.getBytes()
```

em arquivos potencialmente grandes.

A aplicação deve usar stream, temporary file e limites configurados.

A integridade utilizará o header HTTP:

```text
Content-Digest.
```

O header moderno define digest do conteúdo efetivo da mensagem.

A baseline exigirá:

```text
sha-256.
```

O checksum calculado durante o upload precisa coincidir com:

- digest declarado na metadata;
- `Content-Digest` do request;
- checksum persistido no objeto final.

Três valores diferentes produzem:

```text
409 ou 422
conforme a origem da divergência;

nenhum arquivo final.
```

A segurança continua independente do formato. Permissions:

```text
integration-file:create;

integration-file:upload;

integration-file:read;

integration-file:delete.
```

O tenant será obtido do contexto autenticado.

Um caller de outro tenant não poderá confirmar a existência do arquivo.

A resposta será:

```text
404.
```

Isso reduz enumeração de IDs.

Arquivos de integração serão tratados como conteúdo não confiável.

O upload não significa que o conteúdo foi aprovado.

Estados:

```text
CREATED;

UPLOADING;

STORED;

VALIDATING;

AVAILABLE;

QUARANTINED;

DELETED.
```

`STORED` significa apenas:

```text
bytes recebidos
com tamanho e checksum válidos.
```

A validação CSV e o job batch poderão mover para:

```text
AVAILABLE
ou
QUARANTINED.
```

Downloads dependem de tenant, permission, state, tipo de artefato e retenção.

A aula não implementará antivírus ou content disarm.

Esses controles serão registrados como gaps para arquivos de tipos mais complexos.

Você deverá explicar:

```text
por que filename
não é storage path;

por que Content-Length
não substitui counting stream;

por que media type
não prova conteúdo;

por que checksum
é calculado durante a cópia;

por que temporary file
precisa de atomic move;

por que ETag
não é autorização;

por que HEAD
não deve abrir o arquivo inteiro;

por que Range
exige recurso repetível;

por que client disconnect
não deve deixar partial final.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
469:
SFTP.

470:
Jobs batch.

471:
Upload download em integracoes.

472:
Contratos de integracao.

473:
WireMock aplicado.
```

A aula 470 respondeu:

```text
como organizar
o transporte e o CSV
em jobs persistentes
e reiniciáveis?
```

A aula 471 responderá:

```text
como oferecer
uma alternativa HTTP
para receber e entregar
arquivos grandes
com segurança?
```

Nesta aula:

```text
upload HTTP:
sim.

download HTTP:
sim.

streaming:
sim.

Content-Digest:
sim.

ETag:
sim.

HEAD:
sim.

Range:
sim.

multipart:
comparado.

antivírus:
gap.

contratos consolidados:
próxima aula.
```

A regra central será:

```text
o servidor controla
identidade,
storage,
limites,
integridade
e autorização;

o client fornece
somente bytes
e metadata validada.
```

---

## Objetivo prático

O `catalog-file-importer` terá:

```text
IntegrationFileController;

IntegrationFileMetadataController;

IntegrationFileContentController;

CreateIntegrationFileService;

UploadIntegrationFileContentService;

DownloadIntegrationFileContentService;

IntegrationFileObject;

IntegrationFileObjectRepository;

IntegrationFileStorage;

FileSystemIntegrationFileStorage;

IntegrationFileId;

IntegrationFileState;

IntegrationFileDisplayName;

ContentDigest;

ContentDigestParser;

BoundedDigestingInputStream;

IntegrationFileResourceFactory;

IntegrationFileProblemHandler;

IntegrationFileMetrics.
```

Migration:

```text
V5__create_integration_file_object.sql.
```

Clients de teste e referência:

```text
RestClientIntegrationFileClient;

WebClientIntegrationFileClient.
```

Testes:

```text
IntegrationFileMetadataContractTest;

IntegrationFileIdempotencyTest;

IntegrationFileUploadStreamingTest;

IntegrationFileUploadSizeLimitTest;

IntegrationFileContentLengthMismatchTest;

IntegrationFileContentDigestTest;

IntegrationFileConcurrentUploadTest;

IntegrationFileAtomicPublishTest;

IntegrationFileFilenamePolicyTest;

IntegrationFilePathTraversalTest;

IntegrationFileTenantIsolationTest;

IntegrationFileDownloadHeadersTest;

IntegrationFileConditionalGetTest;

IntegrationFileHeadTest;

IntegrationFileRangeTest;

IntegrationFileUnsatisfiedRangeTest;

IntegrationFileClientDisconnectTest;

IntegrationFileRestClientTest;

IntegrationFileWebClientTest;

IntegrationFileLoggingSecurityTest;

IntegrationFileMetricsTest.
```

Documentação:

```text
docs/http-files/
├── HTTP_FILE_API.md
├── HTTP_FILE_STORAGE_MODEL.md
├── HTTP_FILE_SECURITY_POLICY.md
├── HTTP_FILE_DOWNLOAD_POLICY.md
└── HTTP_FILE_RUNBOOK.md
```

Você irá:

1. definir a API;
2. criar metadata;
3. reutilizar idempotência;
4. criar storage model;
5. gerar path server-side;
6. validar filename;
7. parsear digest;
8. copiar em streaming;
9. aplicar limite;
10. publicar atomically;
11. servir Resource;
12. criar headers;
13. implementar conditional requests;
14. testar ranges;
15. proteger tenant;
16. testar disconnect;
17. criar clients;
18. criar métricas;
19. criar runbook;
20. preparar contratos de integração.

---

## Conceito essencial

### Upload não é byte array

Código inadequado:

```java
byte[] content =
        request.getInputStream()
               .readAllBytes();
```

A memória cresce com o arquivo.

A baseline copia em buffers fixos.

---

### Metadata antes do conteúdo

Separar metadata e bytes cria file ID estável, autorização prévia, size e digest esperados, state machine, idempotência e retry da mesma intenção.

O `POST` de metadata usa `Idempotency-Key`, conforme a aula 464.

---

### Upload com PUT

`PUT` representa o envio do estado do recurso identificado pela URI.

Na baseline:

```text
um file ID
possui um único conteúdo imutável.
```

Se o mesmo conteúdo já foi armazenado:

```text
resposta idempotente.
```

Se a mesma URI recebe bytes diferentes:

```text
409 Conflict.
```

---

### If-None-Match

O upload exige:

```http
If-None-Match: *
```

A intenção é criar o conteúdo somente se ainda não existe.

Se já existe conteúdo final:

```text
412 Precondition Failed
ou replay idempotente
quando o digest coincide.
```

A policy documentará a decisão.

A baseline devolve replay idempotente com metadata do mesmo conteúdo e `409` para digest diferente.

---

### Content-Length

`Content-Length` permite rejeição antecipada quando excede o limite.

Porém:

- pode estar ausente em transferência chunked;
- pode estar incorreto;
- não representa autorização;
- não substitui contagem real.

O counting stream é obrigatório.

---

### Content-Digest

O digest protege integridade, mas não autentica o caller.

Um atacante autorizado a enviar conteúdo pode calcular um digest válido do conteúdo malicioso.

Autenticação, autorização e validação continuam necessárias.

---

### Media type

`Content-Type` é declaração do sender.

Para CSV, não existe uma assinatura binária confiável.

A aplicação aceita apenas media types previstos, mas valida:

- encoding;
- header;
- estrutura;
- contrato.

Não confie somente em extensão ou MIME.

---

### Filename

O filename pode conter paths, controles, CRLF, Unicode confusável, nomes reservados ou comprimento excessivo.

A baseline cria um `IntegrationFileDisplayName`.

Regras:

```text
somente basename;

sem separator;

sem controle;

máximo 180 caracteres;

extensão conforme contrato;

normalização Unicode definida;

fallback ASCII para headers.
```

O storage usa apenas `fileId`.

---

### Storage key

Exemplo:

```text
objects/
c1/
da/
c1daef28-4e8d-4fc5-9a46-9d35b58a3fe8.bin
```

O path é derivado de UUID validado e configuration root.

Nenhuma parte vem do filename.

---

### Temporary file

Upload target:

```text
staging/<fileId>.part.
```

Final:

```text
objects/.../<fileId>.bin.
```

Staging e final devem estar no mesmo filesystem quando o contrato exige `ATOMIC_MOVE`.

Se o filesystem não suporta a operação:

```text
startup ou upload falha;
```

não use copy/delete silencioso.

---

### State machine

```text
CREATED
   |
   v
UPLOADING
   |
   +---- failure ----> CREATED/FAILED_RETRYABLE
   |
   v
STORED
   |
   v
VALIDATING
   |
   +----> AVAILABLE
   |
   +----> QUARANTINED
```

Uma transição usa optimistic locking ou lock controlado.

---

### Concorrência

Duas requests podem tentar enviar o mesmo `fileId`.

Somente uma pode adquirir:

```text
CREATED -> UPLOADING.
```

A outra recebe:

```text
409 upload_in_progress.
```

Se o conteúdo já está `STORED`, a policy compara digest.

---

### Atomicidade entre filesystem e banco

Filesystem e PostgreSQL não compartilham transaction, então a ordem precisa ser reconciliável.

Baseline:

1. adquirir row;
2. escrever `.part`;
3. verificar;
4. mover para final;
5. marcar `STORED`.

Se o processo morrer entre move e update:

```text
final orphan possível.
```

Um reconciliation service consulta:

- final existente;
- row em `UPLOADING`;
- digest;
- idade.

Ele nunca apaga automaticamente um final válido sem policy.

---

### Download autorizado

Fluxo:

1. autenticar;
2. resolver tenant;
3. buscar metadata;
4. validar permission;
5. validar state;
6. obter Resource;
7. criar headers;
8. devolver body.

Não abra o arquivo antes de autorização.

---

### Content-Disposition

Use:

```java
ContentDisposition
    .attachment()
    .filename(
        safeFilename,
        StandardCharsets.UTF_8
    )
    .build();
```

Não concatene header manualmente.

CRLF e quotes precisam ser tratados.

---

### ETag

A baseline cria um ETag forte a partir do SHA-256:

```text
"sha256-<base64url>".
```

O ETag é opaco para o client.

Ele representa os bytes do recurso, não permission ou tenant.

---

### Last-Modified

Use o instante em que o conteúdo final foi publicado.

Não use:

- horário atual;
- data do filename;
- timestamp fornecido sem validação.

---

### Conditional GET

Quando `If-None-Match` coincide:

```text
304;

sem body.
```

O ETag tem precedência sobre `If-Modified-Since` quando ambos são enviados conforme a semântica HTTP.

---

### HEAD

O controller usa a mesma metadata do GET.

Ele não copia o conteúdo.

Confirme:

- authorization;
- headers;
- content length;
- ETag;
- no body.

---

### Range

Range permite retomar ou segmentar downloads.

Spring MVC trata ranges ao devolver `Resource` repetível.

A baseline suporta:

```text
bytes.
```

Range não ignora autorização nem altera o checksum do objeto completo.

`Content-Digest` do response parcial exige decisão explícita, porque o conteúdo da mensagem é somente o range.

Na baseline:

```text
GET completo:
Content-Digest presente.

206:
Content-Digest omitido,
ETag e Content-Range presentes.
```

---

### Cache-Control

Arquivos são privados.

Baseline:

```text
private, max-age=0, must-revalidate.
```

Para artefatos altamente sensíveis, uma policy pode usar:

```text
no-store.
```

Essa decisão depende da classificação.

---

### Client disconnect

Se o client abandonar download:

- o stream é fechado;
- a exception é classificada;
- não altere o arquivo;
- não marque o client como concluído;
- métrica registra cancelamento;
- não faça retry server-side.

---

### Multipart

Spring MVC pode receber `MultipartFile`.

O conteúdo pode ser mantido em memória ou temporário conforme configuração do container.

O controller não deve pressupor onde está.

Use:

```java
file.getInputStream()
```

ou:

```java
file.transferTo(...)
```

com lifecycle controlado.

No WebFlux, `FilePart` expõe conteúdo como `DataBuffer`.

Buffers pooled precisam ser consumidos e liberados pelas APIs corretas.

---

## Mão na massa guiada

### 1. Criar migration V5

```sql
CREATE TABLE integration_file_object (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    contract_name VARCHAR(120) NOT NULL,
    original_file_name VARCHAR(180) NOT NULL,
    declared_media_type VARCHAR(120) NOT NULL,
    expected_size BIGINT,
    expected_digest_sha256 CHAR(64),
    actual_size BIGINT,
    actual_digest_sha256 CHAR(64),
    storage_key VARCHAR(255),
    state VARCHAR(40) NOT NULL,
    version BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    upload_started_at TIMESTAMPTZ,
    stored_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT integration_file_expected_size
        CHECK (
            expected_size IS NULL
            OR expected_size >= 0
        ),
    CONSTRAINT uq_integration_file_storage_key
        UNIQUE (storage_key)
);
```

O registro idempotente da criação pode reutilizar a infraestrutura da aula 464 ou usar scope dedicado.

---

### 2. Criar states

```java
public enum IntegrationFileState {
    CREATED,
    UPLOADING,
    STORED,
    VALIDATING,
    AVAILABLE,
    QUARANTINED,
    DELETED
}
```

Crie métodos de transição na entity.

---

### 3. Criar display name

```java
public record IntegrationFileDisplayName(
        String value
) {
    public IntegrationFileDisplayName {
        if (
            value == null
            || value.isBlank()
            || value.length() > 180
            || value.contains("/")
            || value.contains("\\")
            || value.chars()
                    .anyMatch(
                        Character::isISOControl
                    )
        ) {
            throw new InvalidIntegrationFileNameException();
        }
    }
}
```

Aplique também a regex do contrato CSV.

---

### 4. Criar metadata request

```java
public record CreateIntegrationFileRequest(
        @NotBlank
        String contract,

        @NotBlank
        String originalFileName,

        @NotBlank
        String mediaType,

        @PositiveOrZero
        Long expectedSize,

        String expectedContentDigest
) {
}
```

O tenant não vem no body.

---

### 5. Criar metadata service

O service:

1. valida permission;
2. valida contract;
3. valida filename;
4. valida media type;
5. valida size;
6. parseia digest;
7. cria file ID;
8. persiste `CREATED`;
9. devolve URLs relativas.

Use idempotency key para impedir criação duplicada.

---

### 6. Criar ContentDigest

```java
public record ContentDigest(
        String algorithm,
        byte[] value
) {
    public ContentDigest {
        if (!"sha-256".equals(algorithm)) {
            throw new UnsupportedContentDigestException();
        }

        value =
            Arrays.copyOf(
                value,
                value.length
            );
    }
}
```

Não mantenha array mutável exposto.

---

### 7. Parsear Content-Digest

Aceite apenas:

```text
uma entrada;

algoritmo sha-256;

base64 válido;

32 bytes.
```

Rejeite:

- algoritmo desconhecido;
- múltiplos valores não suportados;
- base64 inválido;
- digest com tamanho incorreto.

Não use comparação textual de base64.

---

### 8. Criar storage port

```java
public interface IntegrationFileStorage {

    StoredFile writeAtomically(
            IntegrationFileId fileId,
            InputStream content,
            long maximumBytes
    );

    Resource resource(
            String storageKey
    );

    void delete(
            String storageKey
    );
}
```

A implementação não recebe filename do caller.

---

### 9. Criar root seguro

Properties:

```yaml
integration-files:
  storage:
    root: ${INTEGRATION_FILE_STORAGE_ROOT}
    maximum-upload-size: 50MB
    staging-directory: .staging
```

No startup:

- root existe;
- root não é symlink;
- staging e objects são diretórios;
- atomic move é testado;
- permissions são restritas.

---

### 10. Criar streaming copy

```java
public StoredFile writeAtomically(
        IntegrationFileId fileId,
        InputStream input,
        long maximumBytes
) {
    Path part =
            stagingPath(
                fileId
            );

    MessageDigest digest =
            sha256();

    long total = 0;

    try (
        OutputStream raw =
            Files.newOutputStream(
                part,
                StandardOpenOption.CREATE_NEW
            );

        DigestOutputStream output =
            new DigestOutputStream(
                new BufferedOutputStream(raw),
                digest
            )
    ) {
        byte[] buffer =
                new byte[64 * 1024];

        int read;

        while (
            (read = input.read(buffer)) != -1
        ) {
            total =
                Math.addExact(
                    total,
                    read
                );

            if (total > maximumBytes) {
                throw new IntegrationFileTooLargeException();
            }

            output.write(
                buffer,
                0,
                read
            );
        }
    }
    catch (
        RuntimeException
        | IOException exception
    ) {
        deletePartQuietly(
            part
        );

        throw translate(
            exception
        );
    }

    Path finalPath =
            finalPath(
                fileId
            );

    Files.move(
        part,
        finalPath,
        StandardCopyOption.ATOMIC_MOVE
    );

    return storedFile(
        finalPath,
        total,
        digest.digest()
    );
}
```

Não chame `digest.digest()` antes do fechamento completo do stream.

---

### 11. Conferir Content-Length

Antes da cópia:

```text
se presente e maior:
413.

se presente e diferente
do expected size:
409.

durante a cópia:
contar sempre.
```

Depois:

```text
actual size
deve coincidir
com Content-Length
e expected size
quando declarados.
```

---

### 12. Adquirir upload

Use update com version ou lock:

```text
CREATED -> UPLOADING.
```

Se state:

```text
UPLOADING:
409.

STORED + mesmo digest:
replay.

STORED + digest diferente:
409.

QUARANTINED:
bloqueado.
```

---

### 13. Criar upload controller

```java
@PutMapping(
    path = "/api/v1/integration-files/{fileId}/content",
    consumes = {
        MediaType.APPLICATION_OCTET_STREAM_VALUE,
        "text/csv"
    }
)
ResponseEntity<Void> upload(
        @PathVariable
        UUID fileId,

        @RequestHeader(
            name = HttpHeaders.CONTENT_LENGTH,
            required = false
        )
        Long contentLength,

        @RequestHeader("Content-Digest")
        String rawDigest,

        HttpServletRequest request
) {
    UploadResult result =
            service.upload(
                new IntegrationFileId(fileId),
                contentLength,
                rawDigest,
                request.getInputStream()
            );

    return ResponseEntity
            .status(result.status())
            .eTag(result.eTag())
            .build();
}
```

O controller não lê bytes.

---

### 14. Tratar falha

Em qualquer falha:

- fechar stream;
- apagar `.part`;
- liberar state;
- registrar safe error;
- não criar final;
- não guardar body.

Se o processo morrer abruptamente, o reconciler trata `.part` e state antigo.

---

### 15. Criar resource factory

```java
public FileSystemResource resource(
        String storageKey
) {
    Path path =
            resolveStorageKey(
                storageKey
            );

    requireInsideRoot(
        path
    );

    requireRegularFile(
        path
    );

    return new FileSystemResource(
        path
    );
}
```

O storage key vem do banco e foi gerado internamente.

Mesmo assim, valide o root.

---

### 16. Criar download metadata

```java
public record DownloadableIntegrationFile(
        Resource resource,
        String displayName,
        MediaType mediaType,
        long size,
        String eTag,
        Instant lastModified,
        ContentDigest contentDigest
) {
}
```

---

### 17. Criar GET

```java
@GetMapping(
    "/api/v1/integration-files/{fileId}/content"
)
ResponseEntity<Resource> download(
        @PathVariable
        UUID fileId,
        WebRequest webRequest
) {
    DownloadableIntegrationFile file =
            service.authorizeAndOpen(
                new IntegrationFileId(fileId)
            );

    if (
        webRequest.checkNotModified(
            file.eTag(),
            file.lastModified()
                .toEpochMilli()
        )
    ) {
        return null;
    }

    ContentDisposition disposition =
            ContentDisposition
                .attachment()
                .filename(
                    file.displayName(),
                    StandardCharsets.UTF_8
                )
                .build();

    return ResponseEntity
            .ok()
            .contentType(
                file.mediaType()
            )
            .contentLength(
                file.size()
            )
            .eTag(
                file.eTag()
            )
            .lastModified(
                file.lastModified()
            )
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                disposition.toString()
            )
            .header(
                HttpHeaders.X_CONTENT_TYPE_OPTIONS,
                "nosniff"
            )
            .cacheControl(
                CacheControl
                    .maxAge(
                        Duration.ZERO
                    )
                    .cachePrivate()
                    .mustRevalidate()
            )
            .body(
                file.resource()
            );
}
```

A API exata de `CacheControl` deve seguir a versão gerenciada.

---

### 18. Criar HEAD

Mapeie o mesmo path com `HEAD`.

Reutilize a montagem de headers.

Não chame:

```text
getInputStream;
```

O test usará spy no storage.

---

### 19. Range transparente

Com `FileSystemResource`, teste:

```http
Range: bytes=0-99
```

Confirme:

```text
206;

Content-Range;

100 bytes;

sem carregar arquivo inteiro.
```

Não implemente slicing manual sem necessidade.

---

### 20. Range inválido

Teste:

```http
Range: bytes=999999-1000000
```

Confirme:

```text
416;

Content-Range:
bytes */<size>.
```

---

### 21. Conditional GET

Teste:

```text
If-None-Match coincidente:
304.

If-None-Match diferente:
200.

If-Modified-Since antigo:
200.

If-Modified-Since igual ou posterior:
304.
```

Use ETag como validador principal.

---

### 22. Content-Digest no download

No GET completo, devolva:

```http
Content-Digest: sha-256=:BASE64:
```

No `206`, omita na baseline.

O ETag completo continua presente.

---

### 23. Tenant isolation

Cenários:

- owner tenant: download;
- outro tenant: `404`;
- sem permission: `403` ou policy unificada;
- file inexistente: `404`;
- deleted: `404`;
- state não permitido: `409` ou `404` conforme exposição.

Documente a escolha.

---

### 24. Criar compatibility multipart endpoint

Opcional no laboratório:

```http
POST /api/v1/integration-files/multipart
Content-Type: multipart/form-data
```

Parts:

```text
metadata:
application/json.

file:
text/csv.
```

No MVC:

```java
@RequestPart
CreateIntegrationFileRequest metadata;

@RequestPart
MultipartFile file;
```

Use `file.getInputStream()`.

Não use `getBytes()`.

O endpoint deve chamar a mesma application service.

---

### 25. Configurar multipart limits

Mesmo que a baseline seja PUT:

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 51MB
```

O limite da application continua obrigatório.

Container limit e domain limit são camadas diferentes.

---

### 26. Client RestClient

```java
restClient
    .put()
    .uri(
        uploadUrl
    )
    .contentType(
        MediaType.TEXT_PLAIN
    )
    .contentLength(
        Files.size(path)
    )
    .header(
        "Content-Digest",
        digestHeader
    )
    .body(
        new FileSystemResource(path)
    )
    .retrieve()
    .toBodilessEntity();
```

Use media type contratual `text/csv`, não `TEXT_PLAIN` se o contrato exigir valor mais específico.

O exemplo final deve usar o media type correto.

---

### 27. Client WebClient

```java
webClient
    .put()
    .uri(uploadUrl)
    .contentType(
        MediaType.parseMediaType(
            "text/csv"
        )
    )
    .contentLength(
        Files.size(path)
    )
    .header(
        "Content-Digest",
        digestHeader
    )
    .body(
        BodyInserters.fromResource(
            new FileSystemResource(path)
        )
    )
    .retrieve()
    .toBodilessEntity();
```

O client não cria `byte[]`.

---

### 28. Download client seguro

O client baixa para:

```text
<name>.part.
```

Depois:

- status;
- headers;
- size;
- checksum;
- close;
- atomic move.

Nunca use o filename do `Content-Disposition` como path; gere destino sob root controlado.

---

### 29. WebClient e DataBuffer

Para download reativo:

```java
Flux<DataBuffer> body =
        webClient
            .get()
            .uri(downloadUrl)
            .retrieve()
            .bodyToFlux(
                DataBuffer.class
            );
```

Use `DataBufferUtils.write` para um path controlado e preserve a liberação dos buffers.

Não use `bodyToMono(byte[].class)` para arquivos grandes.

---

### 30. Testar upload streaming

Use um stream que falha se:

- `readAllBytes` é chamado;
- leitura tenta alocar o tamanho total;
- buffer excede a policy.

Confirme buffer fixo e contagem.

---

### 31. Testar size limit

Request sem `Content-Length` envia:

```text
50 MiB + 1 byte.
```

Esperado:

```text
413;

.part removido;

final ausente.
```

---

### 32. Testar mismatch

Cenários:

- length declarado diferente;
- expected size diferente;
- digest metadata diferente;
- digest header diferente;
- digest calculado diferente.

Nenhum produz `STORED`.

---

### 33. Testar concorrência

Duas requests para o mesmo file ID.

Esperado:

```text
uma adquire UPLOADING;

outra recebe 409;

um final.
```

---

### 34. Testar atomic publish

Durante upload:

```text
GET:
409 ou 404;

final path:
ausente.
```

Depois:

```text
GET:
200;

final presente.
```

---

### 35. Testar filename hostil

Cenários:

```text
../../secret.csv;

C:\temp\file.csv;

file.csv\r\nX-Evil: yes;

CON;

nome excessivo;

extension diferente.
```

Todos são rejeitados ou transformados somente para display conforme policy.

Nenhum influencia storage path.

---

### 36. Testar disconnect

Upload interrompido:

```text
.part removido;

state recuperável.
```

Download interrompido:

```text
source preservado;

stream fechado;

cancel metric.
```

---

### 37. Testar HEAD

Confirme:

- `200`;
- headers;
- zero body;
- storage stream não aberto.

---

### 38. Testar Range

Use arquivo com bytes conhecidos.

Teste:

- prefix range;
- suffix range;
- open-ended range;
- invalid range;
- conditional + range.

Não compare apenas status; valide bytes.

---

### 39. Testar Content-Disposition

Nomes:

- ASCII;
- espaço;
- acento;
- quote;
- CRLF proibido.

O builder produz header válido.

---

### 40. Criar metrics

```text
integration.file.created;

integration.file.upload.started;

integration.file.upload.completed;

integration.file.upload.failed;

integration.file.download.started;

integration.file.download.completed;

integration.file.download.cancelled;

integration.file.bytes;

integration.file.digest_mismatch;

integration.file.range.
```

Tags:

```text
contract;

operation;

outcome;

failure.kind;

range.used.
```

Não use file ID, filename ou tenant como tag.

---

### 41. Criar logging test

Sentinelas:

```text
upload-body-sentinel;

filename-crlf-sentinel;

tenant-file-sentinel;

absolute-storage-path-sentinel;

authorization-sentinel.
```

Nenhuma aparece nos logs.

---

### 42. Criar runbook

Perguntas:

- file ID;
- tenant técnico;
- state;
- expected size;
- actual size;
- expected digest;
- actual digest;
- `.part` existe;
- final existe;
- storage key;
- upload em andamento;
- last transition;
- range foi usado;
- download foi cancelado;
- permission correta;
- retention;
- orphan reconciliation;
- batch receipt associado.

---

### 43. Integrar ao Batch

Depois de `STORED`, o service pode criar receipt e lançar:

```text
inventorySftpImportJob
ou
inventoryHttpImportJob.
```

Melhor nome futuro:

```text
inventoryFileImportJob.
```

O transporte vira JobParameter não identificador ou origem registrada no receipt.

Não duplique o processamento CSV.

---

### 44. Executar testes focados

```powershell
Set-Location `
  labs/m16/aula-456-integracoes-http-entre-sistemas/catalog-file-importer

.\mvnw.cmd `
  -Dtest=IntegrationFileMetadataContractTest,IntegrationFileIdempotencyTest,IntegrationFileUploadStreamingTest,IntegrationFileUploadSizeLimitTest,IntegrationFileContentLengthMismatchTest,IntegrationFileContentDigestTest,IntegrationFileConcurrentUploadTest,IntegrationFileAtomicPublishTest,IntegrationFileFilenamePolicyTest,IntegrationFilePathTraversalTest,IntegrationFileTenantIsolationTest,IntegrationFileDownloadHeadersTest,IntegrationFileConditionalGetTest,IntegrationFileHeadTest,IntegrationFileRangeTest,IntegrationFileUnsatisfiedRangeTest,IntegrationFileClientDisconnectTest,IntegrationFileRestClientTest,IntegrationFileWebClientTest,IntegrationFileLoggingSecurityTest,IntegrationFileMetricsTest `
  test
```

---

### 45. Executar cenário manual

1. crie metadata;
2. copie `fileId`;
3. envie conteúdo com digest correto;
4. consulte `HEAD`;
5. faça `GET`;
6. faça conditional GET;
7. faça range;
8. tente outro tenant;
9. tente digest incorreto;
10. confirme ausência de partial final.

---

### 46. Executar gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- migration;
- idempotência;
- streaming;
- limits;
- digest;
- atomic move;
- filename;
- tenant;
- headers;
- ranges;
- clients;
- logs;
- metrics;
- Batch regression;
- SFTP regression;
- CSV regression.

---

### 47. Registrar limitações

Ainda faltam:

```text
antivírus;

content disarm;

object storage;

pre-signed URLs;

multipart resumível;

TUS;

upload paralelo;

criptografia at rest;

WAF produtivo;

load test;

retention aprovada.
```

---

## Entendendo o que foi feito

### Upload ganhou identidade

Metadata e file ID existem antes dos bytes.

### O body ficou streaming

O arquivo não precisa caber em memória.

### Integridade ficou tripla

Metadata, header e digest calculado precisam coincidir.

### Filename ficou separado do storage

O client não controla paths físicos.

### Publicação ficou atômica

O final só aparece depois de stream, close, limit e digest.

### Download ficou protocolar

Content type, disposition, length, ETag, last modified e ranges foram tratados.

### Authorization veio antes do arquivo

Outro tenant não consegue enumerar ou abrir o conteúdo.

### MVC e WebFlux ficaram contextualizados

Ambos podem transmitir arquivos sem converter tudo em `byte[]`.

### O Batch continuou reutilizável

SFTP e HTTP alimentam o mesmo pipeline local.

---

## Erros comuns importantes

### Chamar getBytes

O arquivo inteiro pode ir para heap.

### Confiar em Content-Length

O tamanho real ainda precisa ser contado.

### Confiar em MIME

O sender pode declarar qualquer media type.

### Usar filename no resolve

Path traversal e overwrite tornam-se possíveis.

### Gravar direto no final

Downloads podem observar conteúdo parcial.

### Calcular checksum depois relendo sem necessidade

A cópia já pode atualizar o digest.

### Criar ETag com timestamp

O mesmo conteúdo recebe identificadores diferentes.

### Concatenar Content-Disposition

Quotes e CRLF podem quebrar o header.

### Usar InputStreamResource para Range

O recurso pode não ser repetível.

### Retornar 404 antes de validar tenant

A ordem de busca e autorização pode vazar existência.

---

## Comandos úteis

### Upload e integridade

```powershell
.\mvnw.cmd `
  -Dtest=IntegrationFileUploadStreamingTest,IntegrationFileUploadSizeLimitTest,IntegrationFileContentLengthMismatchTest,IntegrationFileContentDigestTest,IntegrationFileAtomicPublishTest `
  test
```

### Download

```powershell
.\mvnw.cmd `
  -Dtest=IntegrationFileDownloadHeadersTest,IntegrationFileConditionalGetTest,IntegrationFileHeadTest,IntegrationFileRangeTest,IntegrationFileUnsatisfiedRangeTest `
  test
```

### Segurança

```powershell
.\mvnw.cmd `
  -Dtest=IntegrationFileFilenamePolicyTest,IntegrationFilePathTraversalTest,IntegrationFileTenantIsolationTest,IntegrationFileLoggingSecurityTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

### Procurar carregamento integral

```powershell
git grep `
  -n `
  -E `
  "getBytes\\(\\)|readAllBytes|bodyToMono\\(byte\\[\\]|ByteArrayResource|resolve\\(.*filename|Content-Disposition.*\\+"
```

---

## Exercício guiado

### Parte 1 — Metadata

Crie o file ID e a state machine.

### Parte 2 — Integridade

Parseie `Content-Digest`.

### Parte 3 — Storage

Gere storage key internamente.

### Parte 4 — Upload

Copie com buffer, limite e SHA-256.

### Parte 5 — Atomicidade

Mova `.part` para final.

### Parte 6 — Download

Monte headers e Resource.

### Parte 7 — HTTP

Implemente HEAD, conditional e Range.

### Parte 8 — Clients

Envie e baixe sem `byte[]`.

### Parte 9 — Segurança

Teste tenant, filename, paths e logs.

### Parte 10 — Gate

Execute regressões de Batch, SFTP e CSV.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 470 foi preservada;
- API de metadata foi criada;
- criação usa `Idempotency-Key`;
- file ID é server-generated;
- upload usa `PUT`;
- conteúdo é imutável depois de armazenado;
- `If-None-Match` foi documentado;
- state machine foi criada;
- tenant vem do contexto;
- permissions foram definidas;
- outro tenant não enumera o arquivo;
- filename foi tratado como display metadata;
- path separators foram rejeitados;
- controles e CRLF foram rejeitados;
- storage key é gerado internamente;
- storage root foi validado;
- symlink root foi proibido;
- staging foi criado;
- atomic move foi comprovado;
- upload é streaming;
- `readAllBytes` não foi usado;
- `getBytes` não foi usado;
- buffer é limitado;
- `Content-Length` foi validado;
- counting stream foi mantido;
- size esperado foi validado;
- `Content-Digest` foi usado;
- somente SHA-256 foi aceito;
- base64 e tamanho foram validados;
- digest declarado e calculado coincidem;
- `.part` é removido em falha;
- final não aparece durante upload;
- concorrência de upload foi tratada;
- optimistic lock ou lock foi criado;
- orphan reconciliation foi documentado;
- `FileSystemResource` foi usado;
- autorização ocorre antes de abrir o arquivo;
- `Content-Type` foi definido;
- `Content-Length` foi definido;
- `Content-Disposition` usa builder;
- filename UTF-8 foi testado;
- `X-Content-Type-Options` foi definido;
- Cache-Control foi definido;
- ETag forte usa digest;
- Last-Modified usa publicação real;
- conditional GET foi implementado;
- HEAD foi implementado sem body;
- Range foi implementado;
- `206` foi testado;
- `416` foi testado;
- bytes do range foram validados;
- Content-Digest de range possui policy explícita;
- client disconnect foi tratado;
- multipart foi contextualizado;
- multipart limits foram configurados;
- RestClient não usa byte array;
- WebClient não usa byte array;
- DataBuffer foi contextualizado;
- download client usa `.part`;
- client valida size e digest;
- CSV, SFTP e Batch foram reutilizados;
- antivírus não foi inventado;
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
  "getBytes\\(\\)|readAllBytes|bodyToMono\\(byte\\[\\]|InputStreamResource|Content-Disposition.*\\+|resolve\\(.*fileName|\\.part|Content-Digest"
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
git commit -m "feat(m16): adicionar upload e download HTTP de arquivos"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- arquivo de integração real;
- body capturado;
- path absoluto;
- storage local;
- token;
- tenant real;
- `.part`;
- dump de metadata;
- antivírus fictício;
- contrato da aula 472 antecipado;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o `catalog-file-importer` ganhou uma segunda entrada de transporte.

O SFTP continua disponível.

Agora existe também:

```text
POST metadata;

PUT content;

streaming;

digest;

atomic publish;

GET;

HEAD;

conditional requests;

Range.
```

O upload passou a separar identidade, metadata, bytes, validação e disponibilidade.

O download passou a oferecer autorização, Resource repetível, headers de representação, digest e byte ranges.

A principal decisão foi:

```text
o client nunca controla
o storage path;

o servidor recebe
um stream limitado,
calcula integridade
e publica o objeto
somente quando completo.
```

Também ficou comprovado que:

- upload não precisa produzir um `byte[]`;
- `Content-Length` é somente uma defesa antecipada;
- media type não valida o conteúdo;
- checksum não autentica o caller;
- filename não é storage key;
- conditional request não substitui autorização;
- Range exige representação repetível;
- disconnect não pode deixar arquivo final parcial;
- SFTP e HTTP podem alimentar o mesmo Batch.

Próxima aula:

```text
472 - M16.17 - Contratos de integracao
```

Nela, você irá:

- consolidar contratos HTTP, webhook, SOAP e arquivos;
- definir compatibilidade backward e forward;
- versionar schemas e operações;
- criar consumer-driven contracts;
- definir error catalog;
- criar contract ownership;
- validar exemplos;
- estabelecer lifecycle e deprecation;
- impedir breaking changes;
- preparar WireMock aplicado.

---

# Material complementar

## Checkpoint final

- [ ] Criei metadata e file ID.
- [ ] Fiz upload streaming com digest.
- [ ] Publiquei o arquivo atomically.
- [ ] Implementei download, HEAD e ranges.
- [ ] Mantive autorização e storage desacoplados.

---

## Troubleshooting adicional

### Upload chega ao limite antes do esperado

Confirme unidade de `DataSize`, metadata e counting stream.

### Content-Length coincide, mas digest falha

Os bytes enviados diferem do arquivo usado para gerar o header.

### Final aparece durante upload

O código está escrevendo diretamente no object path.

### Filename cria subdiretório

Alguma camada ainda usa o nome fornecido no `resolve`.

### Download retorna `200` para Range

O response pode não estar usando Resource repetível ou o converter correto.

### HEAD abre o stream

O controller pode estar reutilizando lógica de cópia, não apenas metadata.

### Conditional GET nunca retorna `304`

Revise quotes do ETag e `Last-Modified`.

### Outro tenant recebe `403` e confirma existência

A policy de enumeração pode exigir `404`.

### WebClient consome muita memória

Procure `bodyToMono(byte[].class)` ou join de buffers.

### `.part` permanece após crash

Execute o reconciler com receipt, state, idade e digest.

---

## Perguntas de revisão

1. Por que criar metadata antes?
2. Qual método envia o conteúdo?
3. Quem gera o file ID?
4. Filename define storage?
5. Para que serve Content-Length?
6. Ele substitui counting stream?
7. Para que serve Content-Digest?
8. Digest autentica o caller?
9. Media type prova conteúdo?
10. Por que usar `.part`?
11. Quando o state vira STORED?
12. O que forma o ETag?
13. Para que serve HEAD?
14. O que faz If-None-Match?
15. O que significa `206`?
16. Quando usar `416`?
17. Por que usar FileSystemResource?
18. Multipart exige getBytes?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Criar identidade e policy.
2. `PUT`.
3. O servidor.
4. Não.
5. Rejeição antecipada e metadata.
6. Não.
7. Integridade dos bytes.
8. Não.
9. Não.
10. Evitar final parcial.
11. Após close, limite, digest e move.
12. SHA-256 do conteúdo.
13. Obter headers sem body.
14. Revalidar pelo ETag.
15. Partial Content.
16. Range impossível.
17. É repetível e possui tamanho.
18. Não.
19. Contratos de integracao.
20. Compatibilidade, versões e ownership.

---

## Desafio opcional

Implemente uma extensão de upload resumível.

Restrições:

- protocolo explícito;
- upload session;
- offset confirmado;
- chunk checksum;
- total size conhecido;
- concorrência bloqueada;
- expiração;
- final digest;
- atomic publish;
- nenhuma promoção de partial;
- client restart test;
- não inventar compatibilidade com TUS sem implementar seu contrato completo.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 471 - M16.16 - Upload download em integracoes

- Criei API de metadata de arquivo.
- Reutilizei `Idempotency-Key` na criação.
- Gerei file ID no servidor.
- Modelei states de upload, validação e disponibilidade.
- Separei filename de storage key.
- Bloqueei path separators, CRLF e controles.
- Criei storage root e staging seguros.
- Implementei upload por `PUT`.
- Usei body binário em streaming.
- Evitei `readAllBytes` e `getBytes`.
- Apliquei limite durante a cópia.
- Validei `Content-Length`.
- Implementei `Content-Digest` com SHA-256.
- Comparei digest de metadata, header e conteúdo.
- Escrevi para `.part`.
- Publiquei com atomic move.
- Removi partial em falha.
- Modelei upload concorrente.
- Documentei orphan reconciliation.
- Criei download autorizado.
- Usei `FileSystemResource`.
- Configurei `Content-Type` e `Content-Length`.
- Criei `Content-Disposition` seguro.
- Adicionei `X-Content-Type-Options`.
- Criei ETag forte com SHA-256.
- Configurei `Last-Modified`.
- Implementei conditional GET.
- Implementei `HEAD`.
- Implementei byte ranges.
- Testei `206` e `416`.
- Defini policy de digest para partial content.
- Tratei disconnect de upload e download.
- Contextualizei multipart em MVC e WebFlux.
- Configurei multipart limits.
- Criei clients com RestClient e WebClient sem byte array.
- Baixei no client para `.part`.
- Validei size e checksum no client.
- Mantive isolamento por tenant e permissions.
- Criei métricas e logs seguros.
- Integrei HTTP ao pipeline CSV, SFTP e Batch.
- Registrei gaps de antivírus, object storage e upload resumível.
- Mantive produção como NO-GO.
- Próxima aula: Contratos de integracao.
```

---

## Referência técnica curta

- Spring Framework — Multipart em Spring MVC.
- Spring Framework — Multipart em Spring WebFlux.
- Spring Framework — `ResponseEntity<Resource>`.
- Spring Framework — Range Requests.
- Spring Framework — `ContentDisposition`.
- Spring Framework — Data Buffers e codecs.
- RFC 9110 — HTTP Semantics.
- RFC 6266 — Content-Disposition.
- RFC 9530 — Digest Fields.

Regra final:

```text
upload e download HTTP de arquivos devem preservar streaming, integridade, atomicidade e autorização: o servidor cria metadata e file ID antes dos bytes, o client envia o conteúdo por PUT com size e Content-Digest, o storage usa key interna, escreve em `.part`, conta bytes, calcula SHA-256 e publica por atomic move, a state machine impede concorrência e partial visibility, o download só abre o Resource após tenant e permission, devolve Content-Type, Content-Disposition, Content-Length, ETag, Last-Modified e headers de segurança, suporta HEAD, conditional requests e ranges sobre recurso repetível, e clients MVC ou reativos nunca convertem arquivos grandes em byte arrays.
```
