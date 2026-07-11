# 390 - M14.35 - Upload download

## Apresentação da aula

Na aula 389, você protegeu a API com rate limiting.

O fluxo passou a controlar a quantidade de requests por consumidor:

```text
request;
filters HTTP;
contador no Redis;
janela com TTL;
request permitida ou 429.
```

Aquela aula respondeu:

```text
como impedir que um consumidor
use capacidade demais
em uma janela de tempo?
```

Agora a API receberá um tipo diferente de conteúdo.

Até aqui, os endpoints trabalharam principalmente com JSON:

```http
Content-Type: application/json
```

Um upload precisa transportar:

- bytes do arquivo;
- nome original;
- tipo de conteúdo;
- tamanho;
- outros campos opcionais.

O formato HTTP mais comum para esse caso é:

```http
multipart/form-data
```

O download percorre o caminho inverso.

A aplicação localiza um arquivo, devolve seus bytes e produz headers para que o cliente saiba:

- qual é o tipo do conteúdo;
- qual é o tamanho;
- qual nome deve ser sugerido;
- se o conteúdo deve ser aberto ou baixado.

A pergunta central desta aula será:

```text
como receber e devolver arquivos
sem confiar no nome enviado pelo cliente,
sem gravar fora do diretório permitido
e sem carregar o conteúdo inteiro na memória?
```

A solução utilizará:

```text
MultipartFile;
multipart/form-data;
limites de upload;
validação de nome;
allowlist de media types;
ID gerado pelo servidor;
armazenamento local controlado;
Files e Path;
Resource;
ResponseEntity;
Content-Type;
Content-Length;
Content-Disposition.
```

A baseline permitirá upload de:

```text
PDF;
PNG;
JPEG;
texto simples.
```

O tamanho máximo da feature será:

```text
5 MB por arquivo.
```

O Spring Boot também será configurado para rejeitar requests multipart maiores antes de o controller processá-las.

O arquivo não será salvo com o nome recebido do cliente.

Exemplo recebido:

```text
../../documento.pdf
```

Nome físico usado no servidor:

```text
1cd2dd9e-80ef-4a9f-b59a-7fa8362e3f96.data
```

O nome original será preservado apenas como metadado seguro para o download.

Assim:

```text
nome do cliente:
não controla o caminho físico.

ID do servidor:
identifica o arquivo armazenado.
```

A aula utilizará armazenamento local no filesystem:

```text
./var/uploads
```

Esse diretório ficará fora de `src`, fora do classpath e ignorado pelo Git.

A implementação será adequada para estudar:

- multipart;
- validação;
- escrita em disco;
- path traversal;
- download;
- headers HTTP.

Ela não será apresentada como armazenamento definitivo de produção.

Em produção, os arquivos podem ir para:

- object storage;
- serviço especializado;
- volume persistente;
- repositório documental.

Essas alternativas não serão implementadas agora.

Também não haverá:

- upload em partes;
- retomada de upload;
- download parcial;
- presigned URL;
- antivírus real;
- OCR;
- conversão;
- thumbnail;
- compressão;
- scheduler de limpeza;
- mensageria;
- armazenamento em nuvem;
- testes completos.

O upload será síncrono.

Quando a resposta `201 Created` for enviada:

```text
o conteúdo e os metadados
já estarão gravados no armazenamento local.
```

O projeto continua em:

```text
labs/m14/aula-357-spring-initializr-estrutura-projeto/formacao-java-backend-api
```

A próxima aula será:

```text
391 - M14.36 - Scheduler
```

Por isso, não será criado processo automático para remover arquivos antigos. A limpeza agendada pertence à próxima etapa do cronograma.

---

## Onde estamos na formação

A sequência atual do M14 é:

```text
386:
Eventos internos Spring.

387:
Async no Spring.

388:
Cache com Spring Redis.

389:
Rate limiting.

390:
Upload download.

391:
Scheduler.

392:
Email e notificação simples.
```

A aula 389 respondeu:

```text
como limitar requests
por consumidor
com contador compartilhado?
```

A aula 390 responderá:

```text
como transportar arquivos por HTTP,
armazená-los de forma controlada
e devolvê-los com headers corretos?
```

Nesta aula:

```text
multipart/form-data:
sim.

MultipartFile:
sim.

limite de tamanho:
sim.

allowlist de tipo:
sim.

nome seguro:
sim.

Path:
sim.

filesystem local:
sim.

Resource:
sim.

Content-Disposition:
sim.

download:
sim.

path traversal:
sim.

scheduler:
não.

cloud storage:
não.

antivírus real:
não.

upload em partes:
não.

testes completos:
não.
```

A regra central será:

```text
conteúdo enviado pelo cliente
é entrada não confiável;

o servidor controla
identificador, caminho, limites
e forma de download.
```

---

## Objetivo prático

Ao final da aula, a API terá dois endpoints novos:

```http
POST /api/v2/runtime/files
Content-Type: multipart/form-data
```

e:

```http
GET /api/v2/runtime/files/{fileId}
```

O upload responderá:

```http
HTTP/1.1 201 Created
Location: /api/v2/runtime/files/{fileId}
Content-Type: application/json
```

Exemplo de body:

```json
{
  "id": "1cd2dd9e-80ef-4a9f-b59a-7fa8362e3f96",
  "filename": "documento.pdf",
  "contentType": "application/pdf",
  "size": 48321,
  "uploadedAt": "2026-07-11T15:40:00Z"
}
```

O download responderá:

```http
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Length: 48321
Content-Disposition: attachment; filename="documento.pdf"
X-Content-Type-Options: nosniff
```

Você irá:

1. configurar limites multipart;
2. definir o diretório de armazenamento;
3. criar properties tipadas;
4. criar modelos internos de arquivo;
5. validar nome, tamanho e media type;
6. gravar o conteúdo com ID gerado;
7. persistir metadados simples;
8. criar o endpoint de upload;
9. criar o endpoint de download;
10. testar manualmente sucesso e erros;
11. commitar.

Estrutura esperada:

```text
src/main/java/br/com/formacao/backend
├── application
│   └── file
│       ├── FileStorageService.java
│       ├── StoredFileMetadata.java
│       ├── StoredFileDownload.java
│       └── exception
│           ├── InvalidUploadException.java
│           ├── StoredFileNotFoundException.java
│           └── FileStorageException.java
├── config
│   └── file
│       └── FileStorageProperties.java
└── web
    └── v2
        └── file
            ├── FileController.java
            └── StoredFileResponse.java
```

Diretório local:

```text
var
└── uploads
    ├── <uuid>.data
    └── <uuid>.properties
```

O arquivo `.data` contém os bytes.

O arquivo `.properties` contém:

```text
id;
originalFilename;
contentType;
size;
uploadedAt.
```

A aplicação usará somente APIs da JDK e componentes que já existem no Spring Web.

Não é necessária uma nova dependency de upload.

---

## Conceito essencial

### multipart/form-data

JSON representa bem dados estruturados.

Ele não é a melhor escolha para enviar arquivos binários diretamente.

`multipart/form-data` divide a request em partes.

Exemplo conceitual:

```text
parte 1:
nome = file;
content type = application/pdf;
conteúdo = bytes do PDF.

parte 2:
nome = description;
conteúdo = texto opcional.
```

Nesta aula haverá somente a parte:

```text
file.
```

Isso mantém o contrato focado.

---

### MultipartFile

No Spring MVC, um arquivo multipart pode ser recebido como:

```java
MultipartFile
```

Exemplo:

```java
@PostMapping(
        consumes =
                MediaType.MULTIPART_FORM_DATA_VALUE
)
public ResponseEntity<StoredFileResponse>
        upload(
                @RequestPart("file")
                MultipartFile file
        ) {
}
```

`MultipartFile` oferece:

- nome da parte;
- nome original;
- content type informado;
- tamanho;
- `InputStream`;
- cópia para destino.

Não presuma que o conteúdo já está permanentemente salvo.

A representação pode utilizar memória ou arquivo temporário do container.

A aplicação precisa transferir o conteúdo para seu próprio armazenamento antes de concluir a request.

---

### Limite no container e na aplicação

O limite será configurado em duas camadas.

Spring Boot:

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 5MB
      max-request-size: 6MB
```

Esse limite protege o processamento multipart.

A aplicação também valida:

```text
file.getSize() <= 5 MB.
```

Por que duas validações?

```text
limite do container:
barra requests grandes cedo.

limite da aplicação:
expressa a regra da feature.
```

O `max-request-size` é um pouco maior porque a request multipart possui headers e delimitadores além dos bytes do arquivo.

---

### Não confiar no nome original

O método:

```java
file.getOriginalFilename()
```

devolve informação fornecida pelo cliente.

Ela pode ser:

```text
documento.pdf;
C:\fakepath\documento.pdf;
../../etc/passwd;
nome com controle;
nome vazio.
```

O nome original não pode ser usado diretamente em:

```java
root.resolve(originalFilename)
```

Isso abriria espaço para path traversal e colisões.

A baseline:

1. remove segmentos de caminho;
2. substitui caracteres de controle;
3. limita o tamanho;
4. rejeita nome vazio;
5. usa UUID no nome físico.

---

### Path traversal

Path traversal ocorre quando uma entrada tenta sair do diretório permitido.

Exemplo:

```text
../../config/application.yaml
```

Uma defesa importante é não usar o nome enviado como path.

A baseline também normaliza todos os paths gerados:

```java
Path target =
        root.resolve(
                id + ".data"
        ).normalize();

if (!target.startsWith(root)) {
    throw new FileStorageException(...);
}
```

Mesmo com UUID, essa verificação registra a regra de segurança no código.

---

### ID gerado pelo servidor

O identificador será:

```text
UUID.
```

Ele será usado em:

- URL de download;
- nome do payload;
- nome do arquivo de metadados.

Exemplo:

```text
1cd2dd9e-80ef-4a9f-b59a-7fa8362e3f96.data
1cd2dd9e-80ef-4a9f-b59a-7fa8362e3f96.properties
```

Dois uploads com o mesmo nome original recebem IDs diferentes.

Não existe sobrescrita por nome.

---

### Content type não é prova do conteúdo

O cliente informa:

```http
Content-Type: application/pdf
```

Isso não garante que os bytes realmente formam um PDF.

Nesta aula, a allowlist verifica o tipo declarado para reduzir erros acidentais:

```text
application/pdf;
image/png;
image/jpeg;
text/plain.
```

Essa verificação não substitui inspeção real do conteúdo.

Uma solução de produção pode precisar de:

- magic bytes;
- biblioteca de detecção;
- antivírus;
- sandbox;
- política de segurança.

Esses recursos serão apenas registrados como limites.

---

### Allowlist

Use allowlist, não denylist.

Allowlist:

```text
somente tipos explicitamente aprovados.
```

Denylist:

```text
bloquear alguns tipos conhecidos
e aceitar todo o resto.
```

A denylist deixa passar formatos inesperados.

A baseline aceita somente quatro media types.

---

### Nome físico e nome de download

São responsabilidades diferentes.

Nome físico:

```text
UUID.data
```

Nome sugerido ao usuário:

```text
documento.pdf
```

O nome de download será construído com:

```text
Content-Disposition.
```

O servidor não precisa expor o path real.

---

### Metadados

Para devolver o arquivo corretamente, a aplicação precisa lembrar:

- nome original seguro;
- tipo de conteúdo;
- tamanho;
- data de upload.

A baseline gravará esses campos em um arquivo `.properties`.

Essa escolha evita adicionar banco e migration somente para o laboratório.

O formato não deve ser tratado como arquitetura definitiva.

---

### Escrita temporária e movimento

Gravar diretamente no destino final pode deixar arquivo parcial quando a cópia falha.

Fluxo mais seguro:

```text
1. criar arquivo temporário no diretório;
2. copiar o InputStream;
3. conferir o tamanho;
4. mover para o nome final;
5. gravar metadados.
```

A aplicação tentará:

```text
ATOMIC_MOVE.
```

Quando o filesystem não suportar, fará movimento comum dentro do mesmo diretório.

Isso reduz a chance de um download encontrar payload parcialmente escrito.

---

### Streaming no upload

A aplicação usará:

```text
file.getInputStream();
Files.copy(...).
```

Ela não chamará:

```text
file.getBytes();
```

`getBytes()` materializa todo o arquivo em um array.

Para 5 MB isso poderia funcionar, mas cria um padrão ruim para arquivos maiores.

O `InputStream` permite cópia progressiva.

---

### Resource no download

O Spring utiliza a abstração:

```text
Resource.
```

A baseline devolverá:

```text
PathResource.
```

O body de `ResponseEntity<Resource>` permite que a infraestrutura escreva o conteúdo sem criar manualmente um `byte[]` com o arquivo inteiro.

---

### Content-Type

O download precisa informar o media type salvo.

Exemplo:

```http
Content-Type: image/png
```

Se o valor salvo estiver inválido, a aplicação pode usar fallback:

```text
application/octet-stream.
```

Na baseline, os uploads aceitos já possuem tipos conhecidos.

---

### Content-Length

O header:

```http
Content-Length: 48321
```

informa o tamanho do payload.

O valor virá dos metadados e será comparado com o tamanho real antes do download.

Se houver divergência, a aplicação não deve servir conteúdo silenciosamente.

---

### Content-Disposition

Para download, use:

```http
Content-Disposition: attachment
```

com filename seguro.

O header orienta o cliente a tratar a resposta como anexo e sugere um nome.

A baseline utilizará o builder do Spring:

```java
ContentDisposition
        .attachment()
        .filename(
                filename,
                StandardCharsets.UTF_8
        )
        .build();
```

Não concatene o header manualmente com entrada do cliente.

---

### X-Content-Type-Options

O download incluirá:

```http
X-Content-Type-Options: nosniff
```

Esse header orienta o cliente a respeitar o tipo declarado em vez de tentar inferir outro tipo.

Ele não substitui validação de conteúdo.

---

### Download não revela paths

O endpoint recebe:

```text
UUID.
```

Ele não recebe:

```text
C:\uploads\arquivo.pdf;
../../arquivo;
nome físico.
```

O path é derivado internamente a partir do ID validado.

O cliente nunca escolhe o caminho.

---

### Novo endpoint somente na v2

A v1 já está depreciada.

Esta capacidade nova será publicada somente em:

```text
/api/v2/runtime/files
```

Não há motivo para aumentar a superfície de uma versão antiga somente para espelhar uma feature nova.

A decisão precisa aparecer no contrato e na documentação de versão.

---

## Mão na massa guiada

### 1. Configurar limites multipart

Em `application.yaml`, adicione:

```yaml
spring:
  servlet:
    multipart:
      enabled: true
      max-file-size: "5MB"
      max-request-size: "6MB"
```

O valor pode ser externalizado por ambiente depois.

A regra funcional da feature também será mantida nas properties.

---

### 2. Criar FileStorageProperties

Arquivo:

```text
FileStorageProperties.java
```

Conteúdo:

```java
package br.com.formacao.backend.config.file;

import java.util.Set;

import org.springframework.boot.context.properties
        .ConfigurationProperties;
import org.springframework.util.unit.DataSize;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(
        "app.file-storage"
)
@Validated
public record FileStorageProperties(
        String root,
        DataSize maxFileSize,
        Set<String> allowedContentTypes
) {
}
```

O projeto já utiliza `@ConfigurationPropertiesScan`.

A validação detalhada será feita no service para manter a aula objetiva.

---

### 3. Configurar armazenamento local

Em `application-local.yaml`, adicione:

```yaml
app:
  file-storage:
    root: "${FILE_STORAGE_ROOT:./var/uploads}"
    max-file-size: "${FILE_STORAGE_MAX_SIZE:5MB}"
    allowed-content-types:
      - "application/pdf"
      - "image/png"
      - "image/jpeg"
      - "text/plain"
```

Adicione ao `.gitignore`:

```text
var/uploads/
```

Não grave uploads em:

```text
src/main/resources;
src/test/resources;
target;
diretório raiz do usuário.
```

---

### 4. Criar modelos internos

Arquivo:

```text
StoredFileMetadata.java
```

Conteúdo:

```java
package br.com.formacao.backend.application.file;

import java.time.Instant;
import java.util.UUID;

public record StoredFileMetadata(
        UUID id,
        String originalFilename,
        String contentType,
        long size,
        Instant uploadedAt
) {
}
```

Arquivo:

```text
StoredFileDownload.java
```

Conteúdo:

```java
package br.com.formacao.backend.application.file;

import org.springframework.core.io.Resource;

public record StoredFileDownload(
        StoredFileMetadata metadata,
        Resource resource
) {
}
```

Os records não conhecem controller ou response DTO.

---

### 5. Criar exceptions

Crie:

```text
InvalidUploadException;
StoredFileNotFoundException;
FileStorageException.
```

Responsabilidades:

```text
InvalidUploadException:
entrada inválida;
status 400 ou 415 conforme o motivo.

StoredFileNotFoundException:
ID inexistente;
status 404.

FileStorageException:
falha inesperada de I/O;
status 500 com detalhe público genérico.
```

Integre essas exceptions ao `GlobalExceptionHandler` já existente.

Não exponha:

- path absoluto;
- stack trace;
- nome temporário;
- mensagem completa do filesystem.

---

### 6. Criar FileStorageService

A classe terá:

```text
store(MultipartFile);
load(UUID).
```

Estrutura inicial:

```java
@Service
public class FileStorageService {

    private final Path root;
    private final FileStorageProperties
            properties;
    private final Clock clock;

    public FileStorageService(
            FileStorageProperties properties,
            Clock clock
    ) {
        this.properties = properties;
        this.clock = clock;
        this.root =
                Path.of(
                        properties.root()
                )
                .toAbsolutePath()
                .normalize();

        createRoot();
    }
}
```

O diretório é criado no startup.

Falha de criação deve impedir a aplicação de anunciar uma feature de armazenamento que não funciona.

---

### 7. Sanitizar o nome

Adicione um método:

```java
private String sanitizeFilename(
        String originalFilename
) {

    if (originalFilename == null
            || originalFilename.isBlank()) {
        throw new InvalidUploadException(
                "Filename is required"
        );
    }

    String normalized =
            originalFilename
                    .replace(
                            '\\',
                            '/'
                    );

    String filename =
            normalized.substring(
                    normalized.lastIndexOf('/')
                            + 1
            )
            .trim()
            .replaceAll(
                    "[\\p{Cntrl}]",
                    "_"
            );

    if (filename.isBlank()
            || filename.equals(".")
            || filename.equals("..")) {
        throw new InvalidUploadException(
                "Filename is invalid"
        );
    }

    if (filename.length() > 150) {
        throw new InvalidUploadException(
                "Filename is too long"
        );
    }

    return filename;
}
```

O nome sanitizado continua sendo metadado.

Ele não será usado para construir o path físico.

---

### 8. Validar o upload

Antes de gravar:

```java
private void validate(
        MultipartFile file
) {

    if (file == null
            || file.isEmpty()) {
        throw new InvalidUploadException(
                "File is required"
        );
    }

    if (file.getSize()
            > properties
                    .maxFileSize()
                    .toBytes()) {
        throw new InvalidUploadException(
                "File exceeds the allowed size"
        );
    }

    String contentType =
            file.getContentType();

    if (contentType == null
            || !properties
                    .allowedContentTypes()
                    .contains(
                            contentType
                    )) {
        throw new InvalidUploadException(
                "File content type is not allowed"
        );
    }
}
```

O handler pode mapear media type não permitido para 415.

Não use a extensão como única validação.

---

### 9. Gravar o payload

Método principal simplificado:

```java
public StoredFileMetadata store(
        MultipartFile file
) {

    validate(
            file
    );

    UUID id =
            UUID.randomUUID();

    String filename =
            sanitizeFilename(
                    file.getOriginalFilename()
            );

    String contentType =
            file.getContentType();

    Path payload =
            resolveInsideRoot(
                    id + ".data"
            );

    Path temporary;

    try {
        temporary =
                Files.createTempFile(
                        root,
                        id + "-",
                        ".upload"
                );

        try (
            InputStream input =
                    file.getInputStream()
        ) {
            Files.copy(
                    input,
                    temporary,
                    StandardCopyOption
                            .REPLACE_EXISTING
            );
        }

        long storedSize =
                Files.size(
                        temporary
                );

        if (storedSize != file.getSize()) {
            throw new FileStorageException(
                    "Stored size differs "
                    + "from received size"
            );
        }

        moveToFinalLocation(
                temporary,
                payload
        );

        StoredFileMetadata metadata =
                new StoredFileMetadata(
                        id,
                        filename,
                        contentType,
                        storedSize,
                        clock.instant()
                );

        writeMetadata(
                metadata
        );

        return metadata;
    } catch (
            IOException exception
    ) {
        deleteQuietly(
                payload
        );

        throw new FileStorageException(
                "Could not store file",
                exception
        );
    }
}
```

Adicione os imports da JDK necessários.

Não use `getBytes()`.

---

### 10. Garantir path dentro do root

Crie:

```java
private Path resolveInsideRoot(
        String filename
) {
    Path resolved =
            root.resolve(
                    filename
            )
            .normalize();

    if (!resolved.startsWith(root)) {
        throw new FileStorageException(
                "Resolved path escaped "
                + "the storage root"
        );
    }

    return resolved;
}
```

Todos os paths físicos passam por esse método.

---

### 11. Mover de forma controlada

Crie:

```java
private void moveToFinalLocation(
        Path temporary,
        Path target
) throws IOException {
    try {
        Files.move(
                temporary,
                target,
                StandardCopyOption.ATOMIC_MOVE
        );
    } catch (
            AtomicMoveNotSupportedException
                    exception
    ) {
        Files.move(
                temporary,
                target
        );
    }
}
```

Como origem e destino pertencem ao mesmo diretório, a chance de movimento atômico é maior.

Não sobrescreva target existente.

Um UUID repetido é extremamente improvável e deve causar falha em vez de sobrescrita.

---

### 12. Gravar metadados

Use `Properties`:

```java
private void writeMetadata(
        StoredFileMetadata metadata
) throws IOException {

    Properties values =
            new Properties();

    values.setProperty(
            "id",
            metadata.id().toString()
    );

    values.setProperty(
            "originalFilename",
            metadata.originalFilename()
    );

    values.setProperty(
            "contentType",
            metadata.contentType()
    );

    values.setProperty(
            "size",
            Long.toString(
                    metadata.size()
            )
    );

    values.setProperty(
            "uploadedAt",
            metadata.uploadedAt().toString()
    );

    Path target =
            resolveInsideRoot(
                    metadata.id()
                    + ".properties"
            );

    Path temporary =
            Files.createTempFile(
                    root,
                    metadata.id() + "-",
                    ".metadata"
            );

    try (
        OutputStream output =
                Files.newOutputStream(
                        temporary
                )
    ) {
        values.store(
                output,
                "Stored file metadata"
        );
    }

    moveToFinalLocation(
            temporary,
            target
    );
}
```

Os metadados não contêm conteúdo do arquivo.

---

### 13. Carregar para download

Implemente:

```java
public StoredFileDownload load(
        UUID id
) {

    Path payload =
            resolveInsideRoot(
                    id + ".data"
            );

    Path metadataPath =
            resolveInsideRoot(
                    id + ".properties"
            );

    if (!Files.isRegularFile(payload)
            || !Files.isRegularFile(
                    metadataPath
            )) {
        throw new StoredFileNotFoundException(
                id
        );
    }

    StoredFileMetadata metadata =
            readMetadata(
                    metadataPath
            );

    try {
        long actualSize =
                Files.size(
                        payload
                );

        if (actualSize != metadata.size()) {
            throw new FileStorageException(
                    "Stored file size is inconsistent"
            );
        }
    } catch (
            IOException exception
    ) {
        throw new FileStorageException(
                "Could not inspect stored file",
                exception
        );
    }

    return new StoredFileDownload(
            metadata,
            new PathResource(
                    payload
            )
    );
}
```

O método `readMetadata` faz o caminho inverso do `writeMetadata`.

Valide que:

```text
metadata.id == id.
```

---

### 14. Criar response do upload

Arquivo:

```text
StoredFileResponse.java
```

Conteúdo:

```java
package br.com.formacao.backend.web.v2.file;

import java.time.Instant;
import java.util.UUID;

import br.com.formacao.backend.application.file
        .StoredFileMetadata;

public record StoredFileResponse(
        UUID id,
        String filename,
        String contentType,
        long size,
        Instant uploadedAt
) {

    public static StoredFileResponse from(
            StoredFileMetadata metadata
    ) {
        return new StoredFileResponse(
                metadata.id(),
                metadata.originalFilename(),
                metadata.contentType(),
                metadata.size(),
                metadata.uploadedAt()
        );
    }
}
```

O response não expõe path físico.

---

### 15. Criar endpoint de upload

No controller v2:

```java
@PostMapping(
        consumes =
                MediaType.MULTIPART_FORM_DATA_VALUE,
        produces =
                MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<StoredFileResponse>
        upload(
                @RequestPart("file")
                MultipartFile file
        ) {

    StoredFileMetadata metadata =
            storageService.store(
                    file
            );

    URI location =
            ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path(
                            "/{id}"
                    )
                    .buildAndExpand(
                            metadata.id()
                    )
                    .toUri();

    return ResponseEntity
            .created(
                    location
            )
            .body(
                    StoredFileResponse.from(
                            metadata
                    )
            );
}
```

O endpoint retorna `201 Created`.

Não retorne os bytes no mesmo response do upload.

---

### 16. Criar endpoint de download

Adicione:

```java
@GetMapping(
        path = "/{fileId}"
)
public ResponseEntity<Resource>
        download(
                @PathVariable
                UUID fileId
        ) {

    StoredFileDownload stored =
            storageService.load(
                    fileId
            );

    StoredFileMetadata metadata =
            stored.metadata();

    MediaType mediaType;

    try {
        mediaType =
                MediaType.parseMediaType(
                        metadata.contentType()
                );
    } catch (
            InvalidMediaTypeException exception
    ) {
        mediaType =
                MediaType
                        .APPLICATION_OCTET_STREAM;
    }

    ContentDisposition disposition =
            ContentDisposition
                    .attachment()
                    .filename(
                            metadata
                                    .originalFilename(),
                            StandardCharsets.UTF_8
                    )
                    .build();

    return ResponseEntity
            .ok()
            .contentType(
                    mediaType
            )
            .contentLength(
                    metadata.size()
            )
            .header(
                    HttpHeaders
                            .CONTENT_DISPOSITION,
                    disposition.toString()
            )
            .header(
                    "X-Content-Type-Options",
                    "nosniff"
            )
            .body(
                    stored.resource()
            );
}
```

O Spring escreve o `Resource` na response.

A aplicação não monta um `byte[]` com o arquivo inteiro.

---

### 17. Integrar erros multipart

Quando o limite do Spring Boot for excedido, pode ocorrer uma exception antes de o controller executar.

Adicione tratamento no advice para a exception multipart correspondente da versão usada pelo projeto.

Resposta pública:

```text
status:
413 Payload Too Large.

code:
file_too_large.

detail:
The uploaded file exceeds the allowed size.
```

Não devolva stack trace ou path temporário.

Para media type não permitido:

```text
415 Unsupported Media Type.
```

Para arquivo vazio ou nome inválido:

```text
400 Bad Request.
```

Para ID inexistente:

```text
404 Not Found.
```

---

### 18. Atualizar OpenAPI

Documente somente a v2.

Upload:

```text
multipart/form-data;
parte file;
format binary;
201;
400;
413;
415;
500.
```

Download:

```text
200 com conteúdo binário;
Content-Type variável;
Content-Length;
Content-Disposition;
404;
500.
```

Não declare a v1.

Não invente upload múltiplo.

---

### 19. Iniciar a aplicação

Crie um diretório de amostras:

```powershell
New-Item `
  -ItemType Directory `
  -Force `
  ".\samples" |
  Out-Null
```

Crie um texto:

```powershell
"Formacao Java Backend - Aula 390" |
  Set-Content `
    ".\samples\aula-390.txt" `
    -Encoding utf8
```

Inicie:

```powershell
.\mvnw.cmd spring-boot:run `
  "-Dspring-boot.run.profiles=local"
```

---

### 20. Testar upload

Use `curl.exe`:

```powershell
$uploadJson = curl.exe `
  --silent `
  --fail-with-body `
  --request POST `
  --form `
    "file=@.\samples\aula-390.txt;type=text/plain" `
  "http://localhost:8081/api/v2/runtime/files"

$upload =
    $uploadJson |
    ConvertFrom-Json

$upload
```

Confirme:

```text
id;
filename;
contentType;
size;
uploadedAt.
```

---

### 21. Inspecionar o diretório

Execute:

```powershell
Get-ChildItem `
  ".\var\uploads"
```

Resultado esperado:

```text
<id>.data;
<id>.properties.
```

Não deve existir:

```text
aula-390.txt
```

como nome físico.

O nome do cliente não controla o path.

---

### 22. Testar download

Execute:

```powershell
curl.exe `
  --silent `
  --show-error `
  --dump-header `
    ".\samples\download-headers.txt" `
  --output `
    ".\samples\aula-390-baixada.txt" `
  "http://localhost:8081/api/v2/runtime/files/$($upload.id)"
```

Leia os headers:

```powershell
Get-Content `
  ".\samples\download-headers.txt"
```

Confirme:

```text
200;
Content-Type: text/plain;
Content-Length;
Content-Disposition: attachment;
X-Content-Type-Options: nosniff.
```

Compare:

```powershell
Get-FileHash `
  ".\samples\aula-390.txt"

Get-FileHash `
  ".\samples\aula-390-baixada.txt"
```

Os hashes devem ser iguais.

---

### 23. Testar tipo não permitido

Crie:

```powershell
"arquivo executavel de laboratorio" |
  Set-Content `
    ".\samples\arquivo.exe" `
    -Encoding utf8
```

Envie declarando:

```text
application/octet-stream.
```

Resultado esperado:

```text
415;
code de tipo não permitido.
```

A validação não deve depender somente da extensão `.exe`.

---

### 24. Testar arquivo vazio

Crie:

```powershell
New-Item `
  -ItemType File `
  -Force `
  ".\samples\vazio.txt"
```

Envie.

Resultado esperado:

```text
400;
arquivo vazio.
```

---

### 25. Testar arquivo acima do limite

Crie aproximadamente 6 MB:

```powershell
$bytes =
    New-Object byte[] (
        6 * 1024 * 1024
    )

[System.IO.File]::WriteAllBytes(
    (Resolve-Path ".\samples").Path
        + "\grande.pdf",
    $bytes
)
```

Envie como PDF.

Resultado esperado:

```text
413 Payload Too Large.
```

O controller pode nem ser executado porque o limite multipart atua antes.

---

### 26. Testar ID inexistente

Execute:

```powershell
$missingId =
    [guid]::NewGuid()

curl.exe `
  --include `
  "http://localhost:8081/api/v2/runtime/files/$missingId"
```

Resultado esperado:

```text
404;
Problem Details;
sem path físico.
```

---

### 27. Revisar o armazenamento

Confirme:

```text
diretório fora do Git;
payload com UUID;
metadados separados;
nome original sanitizado;
tipos permitidos;
tamanho limitado;
download por Resource;
headers corretos.
```

Não crie limpeza automática.

Esse assunto começa na próxima aula.

---

## Entendendo o que foi feito

### O protocolo mudou conforme o conteúdo

JSON continua para dados estruturados.

Multipart passou a transportar o arquivo.

### O cliente não controla o path

O servidor gera UUID e usa nomes físicos próprios.

### O armazenamento possui limites

Tamanho e media type são validados antes da gravação definitiva.

### O upload não carrega tudo em byte[]

O conteúdo é copiado por `InputStream`.

### O download não revela o filesystem

O cliente utiliza UUID.

A aplicação resolve o path internamente.

### Os headers descrevem o arquivo

`Content-Type`, `Content-Length` e `Content-Disposition` orientam o consumidor.

### A feature permaneceu pequena

Não foram adicionados cloud storage, processamento assíncrono ou scheduler.

---

## Erros comuns importantes

### Usar originalFilename como path

Isso permite colisão e path traversal.

### Confiar apenas na extensão

Um arquivo pode possuir nome `.pdf` e outro conteúdo.

### Confiar totalmente no Content-Type

O valor também é informado pelo cliente.

A allowlist desta aula é uma proteção inicial, não inspeção completa.

### Usar file.getBytes()

O arquivo inteiro vira um array em memória.

### Salvar dentro de src/main/resources

Uploads passariam a misturar dados runtime com o código da aplicação.

### Retornar path físico

O consumidor não precisa saber onde o arquivo está no servidor.

### Concatenar Content-Disposition manualmente

Nome não tratado pode produzir header inválido.

### Não configurar limites multipart

Requests grandes podem consumir recursos antes da regra da feature.

### Armazenar somente o payload

Sem metadados, o download perde nome, tipo e tamanho esperados.

### Criar scheduler de limpeza agora

A próxima aula existe para estudar scheduling de forma controlada.

---

## Comandos úteis

### Criar arquivo de texto

```powershell
"Arquivo de laboratorio" |
  Set-Content `
    ".\samples\arquivo.txt" `
    -Encoding utf8
```

### Fazer upload

```powershell
curl.exe `
  --form `
    "file=@.\samples\arquivo.txt;type=text/plain" `
  "http://localhost:8081/api/v2/runtime/files"
```

### Fazer download

```powershell
curl.exe `
  --output ".\samples\baixado.txt" `
  "http://localhost:8081/api/v2/runtime/files/<id>"
```

### Exibir headers

```powershell
curl.exe `
  --dump-header - `
  --output NUL `
  "http://localhost:8081/api/v2/runtime/files/<id>"
```

### Comparar hashes

```powershell
Get-FileHash ".\samples\arquivo.txt"
Get-FileHash ".\samples\baixado.txt"
```

### Inspecionar armazenamento

```powershell
Get-ChildItem ".\var\uploads"
```

---

## Exercício guiado

### Parte 1 — Upload válido

Envie um TXT e confirme `201 Created`.

### Parte 2 — Download íntegro

Baixe e compare os hashes.

### Parte 3 — Mesmo nome duas vezes

Envie o mesmo arquivo duas vezes.

Confirme:

```text
dois IDs;
dois payloads;
nenhuma sobrescrita.
```

### Parte 4 — Nome com caminho

Envie um multipart cujo filename contenha segmentos de caminho usando uma ferramenta de sua preferência.

Confirme que o armazenamento físico continua baseado em UUID.

### Parte 5 — Limites

Teste:

```text
arquivo vazio;
tipo não permitido;
arquivo acima de 5 MB.
```

### Parte 6 — Registrar a decisão

Anote:

```text
endpoint somente v2;

multipart/form-data;

limite de 5 MB;

allowlist de quatro tipos;

UUID como nome físico;

nome original somente como metadado;

filesystem local em ./var/uploads;

payload e properties separados;

InputStream para upload;

Resource para download;

Content-Disposition attachment;

sem scheduler;
sem nuvem;
sem antivírus real.
```

---

## Critérios de aceite

- arquivo, H1, número e módulo seguem a grade;
- continuidade com a aula 389 foi preservada;
- upload utiliza `multipart/form-data`;
- `MultipartFile` foi usado;
- limite multipart foi configurado;
- regra de 5 MB foi configurada;
- `max-request-size` considera overhead;
- allowlist de media types foi criada;
- arquivo vazio foi rejeitado;
- tipo não permitido foi rejeitado;
- arquivo grande foi rejeitado;
- nome original foi tratado como não confiável;
- segmentos de path foram removidos;
- caracteres de controle foram tratados;
- nome foi limitado;
- UUID foi gerado pelo servidor;
- nome original não foi usado como path;
- root foi normalizado;
- path final foi validado dentro do root;
- uploads ficaram fora de `src`;
- diretório foi ignorado pelo Git;
- conteúdo foi copiado por `InputStream`;
- `getBytes()` não foi usado;
- arquivo temporário foi usado;
- movimento atômico foi tentado;
- sobrescrita não foi permitida;
- metadados foram armazenados;
- path físico não foi exposto;
- endpoint de upload retorna 201;
- header `Location` foi enviado;
- endpoint de download recebe UUID;
- `Resource` foi usado;
- `byte[]` completo não foi usado no download;
- `Content-Type` foi enviado;
- `Content-Length` foi enviado;
- `Content-Disposition` foi construído com builder;
- filename UTF-8 foi considerado;
- `X-Content-Type-Options: nosniff` foi enviado;
- download inexistente retorna 404;
- falha de armazenamento não expõe path;
- endpoint foi publicado somente na v2;
- contrato OpenAPI foi atualizado;
- upload válido foi testado manualmente;
- download foi testado manualmente;
- integridade foi comparada por hash;
- upload vazio foi testado;
- tipo inválido foi testado;
- limite de tamanho foi testado;
- scheduler não foi antecipado;
- cloud storage não foi antecipado;
- antivírus real não foi antecipado;
- upload em partes não foi antecipado;
- mensageria não foi antecipada;
- testes completos não foram antecipados;
- commit recomendado está pronto;
- ponte para a aula 391 está correta.

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
git commit -m "feat(m14): adicionar upload e download de arquivos"
```

Valide:

```powershell
git log -1 --oneline
```

Não inclua:

- `var/uploads`;
- arquivos de amostra;
- downloads;
- `target`;
- logs;
- dados reais;
- credenciais;
- arquivos temporários.

---

## Fechamento e ponte para a próxima aula

Nesta aula, a API passou a transportar arquivos.

O upload ficou:

```text
multipart/form-data;

MultipartFile;

validação;

UUID;

arquivo temporário;

filesystem local;

metadados;

201 Created.
```

O download ficou:

```text
UUID;

metadados;

PathResource;

Content-Type;

Content-Length;

Content-Disposition;

200 OK.
```

Você comprovou:

```text
nome do cliente não controla path;

arquivo grande é bloqueado;

tipo não permitido é rejeitado;

payload não vira byte[] completo;

download preserva o conteúdo;

path físico não é exposto.
```

A decisão central foi:

```text
upload é uma entrada não confiável;

o servidor precisa controlar
limite, tipo, identificador,
diretório e nome físico;

o download precisa devolver
bytes e headers coerentes
sem revelar o armazenamento interno.
```

A próxima aula será:

```text
391 - M14.36 - Scheduler
```

Nela, você aprenderá a executar tarefas em horários ou intervalos controlados.

O armazenamento criado nesta aula poderá oferecer um caso prático futuro, como identificar arquivos antigos. Porém, nenhuma limpeza automática foi antecipada aqui.

---

# Material complementar

## Checkpoint final

- [ ] Configurei limites multipart.
- [ ] Salvei o arquivo com UUID.
- [ ] Mantive o nome original apenas como metadado.
- [ ] Baixei com `Resource` e headers corretos.
- [ ] Testei tamanho, tipo, 404 e integridade.

---

## Troubleshooting adicional

### O controller não recebe o arquivo grande

O limite multipart pode rejeitar antes do mapping.

Confirme o handler de `413`.

### originalFilename chega com C:\fakepath

Isso é comportamento comum de clientes web.

Use somente o último segmento sanitizado.

### Content-Type chega null

O cliente não declarou o tipo.

A baseline rejeita porque trabalha com allowlist explícita.

### Files.move falha com ATOMIC_MOVE

O filesystem pode não suportar.

Use o fallback controlado dentro do mesmo diretório.

### Download retorna arquivo vazio

Compare:

- tamanho do metadata;
- `Files.size(payload)`;
- hash do original;
- hash do baixado.

### Content-Disposition quebra com acentos

Use o builder com `StandardCharsets.UTF_8`.

### O diretório apareceu no Git

Revise `.gitignore` e remova o conteúdo do staging.

### A aplicação funciona localmente, mas perde arquivos ao reiniciar container

Filesystem efêmero não é armazenamento persistente.

Esta aula não configura volumes ou object storage.

---

## Observações para aulas futuras

Uma solução de produção pode precisar de:

- detecção real de tipo;
- antivírus;
- object storage;
- checksum persistido;
- criptografia;
- autorização por arquivo;
- auditoria;
- retenção;
- limpeza;
- download parcial;
- presigned URLs;
- upload multipart em partes.

Esses recursos não serão implementados agora.

Testes automatizados completos serão aprofundados nas aulas específicas do cronograma.

A próxima aula estudará scheduler, mas não deve transformar imediatamente todo arquivo em tarefa agendada sem uma política clara.

---

## Perguntas de revisão

1. Qual media type é usado no upload?
2. Qual tipo Spring representa o arquivo recebido?
3. Qual é o limite da baseline?
4. Por que existem dois limites?
5. O nome original pode virar path?
6. Qual nome físico é usado?
7. O que é path traversal?
8. Quais tipos são permitidos?
9. Content-Type prova o conteúdo?
10. Por que não usar `getBytes()`?
11. Onde os arquivos ficam?
12. O diretório entra no Git?
13. Quais metadados são salvos?
14. Qual status o upload retorna?
15. Qual header aponta o download criado?
16. Qual tipo representa o body do download?
17. Para que serve Content-Disposition?
18. O endpoint existe na v1?
19. Existe limpeza automática?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. `multipart/form-data`.
2. `MultipartFile`.
3. 5 MB.
4. Container e regra da feature.
5. Não.
6. UUID com sufixo interno.
7. Tentativa de sair do diretório permitido.
8. PDF, PNG, JPEG e texto.
9. Não.
10. Para não materializar todo o arquivo em memória.
11. `./var/uploads`.
12. Não.
13. ID, nome, tipo, tamanho e data.
14. 201.
15. `Location`.
16. `Resource`.
17. Sugerir tratamento e filename do download.
18. Não.
19. Não.
20. Scheduler.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 390 - M14.35 - Upload download

- Continuei no projeto `formacao-java-backend-api`.
- Diferenciei JSON de `multipart/form-data`.
- Recebi arquivos com `MultipartFile`.
- Configurei limite multipart de 5 MB.
- Mantive `max-request-size` acima do tamanho do arquivo.
- Criei allowlist de PDF, PNG, JPEG e texto.
- Rejeitei arquivo vazio.
- Tratei o nome original como entrada não confiável.
- Removi segmentos de caminho e caracteres de controle.
- Gerei UUID para identificar cada upload.
- Não usei o nome original como path.
- Criei um root local em `./var/uploads`.
- Mantive o diretório fora do Git.
- Copiei o conteúdo por `InputStream`.
- Não usei `getBytes()`.
- Gravei primeiro em arquivo temporário.
- Tentei movimento atômico para o destino.
- Armazenei payload e metadados separadamente.
- Criei upload somente na API v2.
- Retornei `201 Created` e `Location`.
- Criei download por UUID.
- Devolvi `PathResource`.
- Configurei `Content-Type`.
- Configurei `Content-Length`.
- Configurei `Content-Disposition` como attachment.
- Adicionei `X-Content-Type-Options: nosniff`.
- Testei upload e download manualmente.
- Comparei integridade por hash.
- Testei arquivo vazio, tipo inválido, tamanho e 404.
- Não antecipei scheduler, nuvem ou antivírus real.
- Próxima aula: Scheduler.
```

---

## Referência técnica curta

- [Spring Framework — Multipart](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/multipart-forms.html)
- [Spring Framework — Resource](https://docs.spring.io/spring-framework/reference/core/resources.html)
- [RFC 6266 — Content-Disposition](https://www.rfc-editor.org/rfc/rfc6266)

Regra final:

```text
um upload seguro não usa o nome do cliente como caminho, limita tamanho e tipos, grava por streaming em um diretório controlado e identifica o payload com ID gerado pelo servidor; o download resolve esse ID internamente e devolve um Resource com Content-Type, Content-Length e Content-Disposition coerentes, sem revelar paths ou carregar o arquivo inteiro em memória.
```
