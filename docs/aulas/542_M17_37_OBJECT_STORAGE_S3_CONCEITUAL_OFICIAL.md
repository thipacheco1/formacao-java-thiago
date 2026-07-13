# 542 - M17.37 - Object Storage S3 conceitual

## Apresentação da aula

Na aula 541, você modelou Redis gerenciado como cache e coordenação temporária.

A aplicação passou a distinguir:

```text
fonte de verdade;

cache;

TTL;

invalidation;

eviction;

stampede;

locks;

fallback;

observabilidade.
```

Essa distinção protege o banco relacional e evita transformar o cache em armazenamento de negócio.

Agora surge outra necessidade comum em aplicações backend:

```text
onde armazenar
arquivos,
documentos,
exports,
imagens,
evidências,
relatórios
e artefatos?
```

Usar o filesystem local do container não resolve esse problema.

O Pod pode:

- reiniciar;
- ser substituído;
- mudar de node;
- ser escalado horizontalmente;
- perder o volume efêmero;
- executar sem disco persistente compartilhado.

Guardar arquivos binários diretamente no banco relacional também pode aumentar:

- tamanho do banco;
- tempo de backup;
- custo de restore;
- complexidade de replicação;
- pressão sobre I/O;
- dificuldade de distribuição.

A pergunta central desta aula será:

```text
como usar
object storage

para armazenar
arquivos e artefatos

com segurança,
versionamento,
lifecycle,
integridade
e integração desacoplada?
```

A resposta será construída com o modelo conceitual do Amazon S3.

Amazon S3 é um serviço de object storage.

Ele trabalha com:

```text
bucket;

object;

key;

metadata;

version;

policy;

lifecycle.
```

A regra central será:

```text
a aplicação
não trata object storage
como filesystem local;

ela trabalha
com objetos,
keys,
metadata
e operações explícitas.
```

Nesta aula, nenhum recurso AWS real será criado.

Não haverá:

- conta AWS;
- access key;
- secret key;
- bucket real;
- object real;
- endpoint real;
- upload real;
- download real;
- URL assinada real;
- policy aplicada;
- lifecycle aplicado;
- cobrança;
- CDN;
- domínio;
- dado de usuário;
- arquivo confidencial.

Você criará:

- blueprint de object storage;
- contrato de bucket;
- padrão de keys;
- política de upload;
- política de download;
- política de versionamento;
- política de lifecycle;
- política de segurança;
- contrato de integridade;
- abstrações Java;
- adapter em memória;
- profile Spring Boot;
- simuladores offline;
- evidence sanitizada.

A próxima aula será:

```text
543 - M17.38 - Custos cloud
```

Por isso, esta aula apenas identificará drivers de custo do object storage.

Não haverá aprofundamento financeiro, cálculo por fornecedor ou otimização detalhada de custos.

---

## Onde estamos na formação

A sequência oficial é:

```text
540:
SQS SNS.

541:
Redis gerenciado conceitual.

542:
Object Storage S3 conceitual.

543:
Custos cloud.

544:
Cloud readiness.
```

A aula 541 respondeu:

```text
como reduzir latência
e carga

sem transformar
cache
em fonte de verdade?
```

A aula 542 responderá:

```text
como armazenar
arquivos e artefatos

fora do filesystem
da aplicação

com segurança,
integridade
e lifecycle?
```

Nesta aula:

```text
object storage:
sim.

Amazon S3:
sim.

bucket:
sim.

object:
sim.

key:
sim.

prefix:
sim.

metadata:
sim.

tags:
sim.

versioning:
sim.

lifecycle:
sim.

retention:
sim.

encryption:
sim.

bucket policy:
sim.

IAM:
sim.

presigned URL:
sim.

multipart upload:
sim.

checksum:
sim.

content type:
sim.

events:
conceitual.

Spring Boot:
sim.

adapter local:
sim.

bucket real:
não.

CloudFront:
não.

custos detalhados:
não.
```

A regra operacional será:

```text
backend guarda
referência e metadata;

object storage guarda
o conteúdo binário;

acesso ocorre
por identidade
e policy;

lifecycle e versioning
preservam governança.
```

---

## Objetivo prático

O laboratório continuará em:

```text
labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab
```

Serão criados ou atualizados:

```text
cloud/aws/object-storage
├── s3-object-storage-blueprint.yaml
├── s3-bucket-policy-contract.yaml
├── s3-key-policy.yaml
├── s3-upload-policy.yaml
├── s3-download-policy.yaml
├── s3-versioning-policy.yaml
├── s3-lifecycle-policy.yaml
├── s3-integrity-policy.yaml
├── s3-security-policy.yaml
├── s3-observability-contract.yaml
├── s3-event-contract.yaml
└── s3-readiness-checklist.yaml

src/main/java/com/formacao/orders/integration/storage
├── ObjectKey.java
├── ObjectMetadata.java
├── StoredObject.java
├── ObjectStoragePort.java
├── ObjectStorageException.java
├── InMemoryObjectStorageAdapter.java
└── ObjectStorageService.java

src/main/resources
└── application-aws-s3.yml

scripts/cloud/aws/object-storage
├── validate-s3-blueprint.ps1
├── validate-s3-key-policy.ps1
├── validate-s3-upload-policy.ps1
├── validate-s3-lifecycle-policy.ps1
├── simulate-object-upload.ps1
├── simulate-presigned-upload.ps1
├── simulate-versioning.ps1
├── simulate-lifecycle.ps1
├── simulate-integrity-failure.ps1
├── collect-s3-evidence.ps1
└── verify-s3-baseline.ps1

docs/devops/aws-s3
├── OBJECT_STORAGE_MODEL.md
├── S3_BUCKETS_KEYS_PREFIXES.md
├── UPLOAD_DOWNLOAD_PATTERNS.md
├── PRESIGNED_URLS.md
├── VERSIONING_AND_LIFECYCLE.md
├── S3_SECURITY.md
├── S3_INTEGRITY.md
├── S3_EVENTS.md
├── S3_TEST_MATRIX.md
└── S3_TROUBLESHOOTING.md
```

Ao final, você terá:

```text
casos de uso classificados;

bucket privado modelado;

keys padronizadas;

uploads controlados;

downloads autorizados;

versioning definido;

lifecycle definido;

integridade validada;

Spring profile seguro;

simulações offline;

evidência sanitizada.
```

Você irá:

1. confirmar a baseline local;
2. diferenciar filesystem e object storage;
3. classificar casos de uso;
4. definir buckets;
5. definir keys e prefixes;
6. definir metadata;
7. definir tags;
8. definir uploads;
9. definir downloads;
10. definir presigned URLs;
11. definir tamanho máximo;
12. definir content type;
13. definir checksum;
14. definir versioning;
15. definir lifecycle;
16. definir retenção;
17. definir delete markers;
18. definir encryption;
19. definir IAM;
20. definir bucket policy;
21. criar abstrações Java;
22. criar adapter em memória;
23. criar profile Spring Boot;
24. simular upload;
25. simular download;
26. simular versão nova;
27. simular lifecycle;
28. simular falha de integridade;
29. modelar eventos;
30. criar documentação;
31. coletar evidence;
32. executar gate;
33. commitar;
34. preparar a aula 543.

---

## Conceito essencial

### Object storage

Modelo de armazenamento baseado em objetos acessados por key.

---

### Bucket

Container lógico de objetos.

---

### Object

Conteúdo armazenado com key, metadata e outras propriedades.

---

### Key

Identificador completo do object dentro do bucket.

---

### Prefix

Parte inicial da key usada para organização lógica e filtros.

---

### Metadata

Informações associadas ao object.

---

### Tag

Par chave-valor usada para governança, classificação e lifecycle.

---

### Versioning

Capacidade de preservar múltiplas versões da mesma key.

---

### Lifecycle

Regras automáticas de transição, expiração e cleanup.

---

### Presigned URL

URL temporária assinada para uma operação específica.

---

### Multipart upload

Upload dividido em partes para objetos maiores.

---

### Checksum

Valor usado para validar integridade do conteúdo.

---

### Delete marker

Marcador criado em buckets versionados para representar exclusão lógica.

---

## Mão na massa guiada

### 1. Confirmar a baseline local

Execute:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev
```

Confirme:

- aplicação saudável;
- cache desabilitado por padrão;
- SQS e SNS apenas modelados;
- nenhum bucket real;
- nenhum Secret AWS;
- Git sem alterações inesperadas.

---

### 2. Diferenciar filesystem e object storage

Filesystem trabalha com diretórios, arquivos e operações de sistema.

Object storage trabalha com:

```text
bucket;

key;

object;

metadata;

API.
```

Uma key como:

```text
orders/dev/reports/2026/report-example.pdf
```

parece possuir diretórios.

Entretanto, para object storage, ela é um identificador textual completo.

Prefixes ajudam a organizar e filtrar.

Não existe um diretório físico obrigatório com a mesma semântica de um filesystem local.

---

### 3. Classificar casos de uso

Crie:

```text
s3-use-case-matrix.yaml
```

Conteúdo:

```yaml
useCases:
  orderInvoicePdf:
    allowed:
      true

    classification:
      confidential

    retention:
      decisionRequired

  orderExportCsv:
    allowed:
      true

    classification:
      internal

    temporary:
      true

  applicationLog:
    allowed:
      conditional

    centralizedLoggingPreferred:
      true

  databasePrimaryState:
    allowed:
      false

  runtimeSession:
    allowed:
      false

  containerTemporaryFile:
    allowed:
      false

  deploymentArtifact:
    allowed:
      true

  userUpload:
    allowed:
      conditional

    validation:
      required
```

---

### 4. Definir o que não deve ser armazenado sem análise

A policy proíbe:

- senha;
- access key;
- secret key;
- session token;
- kubeconfig;
- private key;
- dump sem encryption;
- dado pessoal sem classificação;
- malware conhecido;
- arquivo sem owner;
- arquivo sem lifecycle;
- conteúdo sem limite de tamanho;
- objeto público por padrão;
- log com Secret;
- dado de negócio sem referência transacional.

Object storage não deve virar um depósito sem governança.

---

### 5. Criar o blueprint

Arquivo:

```text
s3-object-storage-blueprint.yaml
```

Conteúdo:

```yaml
objectStorage:
  provider:
    service:
      S3

  buckets:
    applicationDocuments:
      publicAccess:
        false

      versioning:
        required

      encryption:
        required

      ownership:
        bucketOwnerEnforced:
          required

      lifecycle:
        required

      logging:
        required

  access:
    workloadIdentity:
      required

    staticAccessKey:
      forbidden

  evidence:
    actualBuckets:
      zero
```

---

### 6. Estratégia de buckets

Buckets devem refletir ambiente, classificação, retenção, ownership, região e policy. Não crie um bucket por arquivo nem um bucket global sem boundaries. Os nomes desta aula permanecem lógicos e nenhum nome real será reservado.

---

### 7. Criar política de keys

Arquivo:

```text
s3-key-policy.yaml
```

Padrão:

```text
<environment>/<domain>/<year>/<month>/<aggregate-id>/<object-id>.<extension>
```

Exemplo fictício:

```text
dev/orders/2026/01/order-example/invoice-example.pdf
```

Regras:

- ambiente explícito;
- domínio explícito;
- identificadores opacos;
- sem nome completo de pessoa;
- sem email;
- sem documento;
- sem Secret;
- extensão coerente;
- comprimento limitado;
- normalização;
- nenhuma sequência `../`;
- nenhum path controlado diretamente pelo usuário.

---

### 8. Criar `ObjectKey`

Arquivo:

```text
ObjectKey.java
```

Conteúdo:

```java
package com.formacao.orders.integration.storage;

import java.util.Objects;
import java.util.regex.Pattern;

public record ObjectKey(String value) {

    private static final Pattern ALLOWED =
            Pattern.compile(
                    "[a-z0-9][a-z0-9/_\\-.]{2,511}"
            );

    public ObjectKey {
        value = Objects.requireNonNull(value, "value");

        if (!ALLOWED.matcher(value).matches()) {
            throw new IllegalArgumentException(
                    "invalid object key"
            );
        }

        if (value.contains("../")) {
            throw new IllegalArgumentException(
                    "path traversal is forbidden"
            );
        }

        if (value.startsWith("/")) {
            throw new IllegalArgumentException(
                    "key must be relative"
            );
        }
    }
}
```

A aplicação cria a key.

O cliente não fornece uma key arbitrária completa.

---

### 9. Metadata

Metadata pode registrar content type, tamanho, checksum, schema version, origem, correlation ID, classificação e data de criação. Ela não deve conter senha, token, dado pessoal desnecessário ou conteúdo completo de negócio.

---

### 10. Criar `ObjectMetadata`

Arquivo:

```text
ObjectMetadata.java
```

Conteúdo:

```java
package com.formacao.orders.integration.storage;

import java.time.Instant;
import java.util.Objects;

public record ObjectMetadata(
        String contentType,
        long contentLength,
        String checksumAlgorithm,
        String checksumValue,
        String classification,
        String correlationId,
        Instant createdAt
) {
    public ObjectMetadata {
        contentType = requireText(
                contentType,
                "contentType"
        );

        if (contentLength < 0) {
            throw new IllegalArgumentException(
                    "contentLength must be non-negative"
            );
        }

        checksumAlgorithm = requireText(
                checksumAlgorithm,
                "checksumAlgorithm"
        );

        checksumValue = requireText(
                checksumValue,
                "checksumValue"
        );

        classification = requireText(
                classification,
                "classification"
        );

        correlationId = requireText(
                correlationId,
                "correlationId"
        );

        createdAt = Objects.requireNonNull(
                createdAt,
                "createdAt"
        );
    }

    private static String requireText(
            String value,
            String field
    ) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    field + " is required"
            );
        }

        return value;
    }
}
```

---

### 11. Tags

Tags apoiam lifecycle, classificação, owner, retenção, ambiente e status. Elas não carregam Secrets nem substituem metadata transacional no banco.

---

### 12. Referência no banco

A aplicação pode guardar no PostgreSQL:

```text
object key;

bucket lógico;

version id;

content type;

checksum;

status;

owner;

created at.
```

O banco guarda a referência de negócio.

O object storage guarda o conteúdo binário.

Exemplo:

```text
order_document
--------------------------------
id
order_id
storage_key
storage_version
content_type
checksum
status
created_at
```

---

### 13. Criar `StoredObject`

Arquivo:

```text
StoredObject.java
```

Conteúdo:

```java
package com.formacao.orders.integration.storage;

import java.util.Arrays;
import java.util.Objects;

public record StoredObject(
        ObjectKey key,
        ObjectMetadata metadata,
        byte[] content,
        String versionId
) {
    public StoredObject {
        key = Objects.requireNonNull(key, "key");
        metadata = Objects.requireNonNull(
                metadata,
                "metadata"
        );
        content = Arrays.copyOf(
                Objects.requireNonNull(
                        content,
                        "content"
                ),
                content.length
        );
        versionId = Objects.requireNonNull(
                versionId,
                "versionId"
        );
    }

    @Override
    public byte[] content() {
        return Arrays.copyOf(content, content.length);
    }
}
```

Esse modelo é apenas para o adapter local.

Em produção, objetos grandes não devem ser carregados integralmente na memória sem necessidade.

---

### 14. Criar porta de storage

Arquivo:

```text
ObjectStoragePort.java
```

Conteúdo:

```java
package com.formacao.orders.integration.storage;

import java.time.Duration;
import java.util.Optional;

public interface ObjectStoragePort {

    StoredObject put(
            ObjectKey key,
            ObjectMetadata metadata,
            byte[] content
    );

    Optional<StoredObject> get(ObjectKey key);

    void delete(ObjectKey key);

    String createUploadUrl(
            ObjectKey key,
            ObjectMetadata metadata,
            Duration validity
    );

    String createDownloadUrl(
            ObjectKey key,
            Duration validity
    );
}
```

---

### 15. Upload pelo backend

No modelo direto, cliente envia ao backend e o backend transmite ao object storage. Isso centraliza validação, mas aumenta uso de memória, rede e tempo de requisição. É adequado apenas para arquivos pequenos, com limite e streaming.

---

### 16. Upload com presigned URL

No modelo presigned, o backend autoriza, gera URL temporária e o cliente envia diretamente ao object storage. Isso reduz tráfego pelo backend, mas exige validade curta, operação e key específicas, headers controlados, autenticação, auditoria e confirmação posterior para evitar uploads órfãos.

---

### 17. Criar política de upload

Arquivo:

```text
s3-upload-policy.yaml
```

Conteúdo:

```yaml
upload:
  authentication:
    required

  key:
    serverGenerated:
      required

  maximumBytes:
    decisionRequired

  allowedContentTypes:
    explicit:
      required

  checksum:
    required

  presigned:
    validitySeconds:
      maximum:
        300

    operation:
      putObjectOnly

  confirmation:
    metadataValidation:
      required

  orphanCleanup:
    required

  malwareScanning:
    requiredForUserContent
```

---

### 18. Content type

`Content-Type` informado pelo cliente não prova o conteúdo. A aplicação limita tipos, valida assinatura quando necessário, não confia apenas na extensão e define `Content-Disposition` no download.

---

### 19. Tamanho

A policy define tamanho máximo, timeout, multipart, limites por usuário e quota por domínio. Upload sem limite pode causar exaustão, negação de serviço e objects órfãos.

---

### 20. Multipart upload

Multipart divide objetos maiores em partes. O fluxo inicia, envia partes com checksums, conclui ou aborta. Lifecycle precisa remover uploads incompletos. ---

### 21. Criar política de download

Arquivo:

```text
s3-download-policy.yaml
```

Conteúdo:

```yaml
download:
  public:
    forbidden

  authorization:
    businessRule:
      required

  presigned:
    validitySeconds:
      maximum:
        300

    operation:
      getObjectOnly

  responseHeaders:
    contentType:
      explicit

    contentDisposition:
      explicit

  audit:
    required

  directBucketListing:
    forbidden
```

O usuário recebe acesso ao object autorizado.

Ele não recebe permissão de listar o bucket.

---

### 22. Presigned download

O backend valida identidade, vínculo, status, classificação e owner antes de gerar uma URL curta. A URL funciona como credencial temporária e nunca deve aparecer completa em logs.

---

### 23. Versioning

Arquivo:

```text
s3-versioning-policy.yaml
```

Conteúdo:

```yaml
versioning:
  enabled:
    required

  reference:
    versionId:
      storedWhenRelevant

  delete:
    deleteMarker:
      expected

  recovery:
    previousVersion:
      documented

  cleanup:
    noncurrentVersions:
      lifecycleRequired
```

Versioning ajuda a recuperar sobrescritas e exclusões acidentais.

Ele também aumenta armazenamento.

Por isso, precisa de lifecycle.

---

### 24. Sobrescrita

Gravar a mesma key em bucket versionado cria uma nova versão.

```text
key estável
com múltiplas versões;

ou

key imutável
por object id.
```

A baseline preferirá keys imutáveis para documentos de negócio.

Exemplo:

```text
invoice-<object-id>.pdf.
```

Atualizações criam novo object id ou nova versão explicitamente rastreada.

---

### 25. Delete markers

Em bucket versionado, delete normalmente cria um delete marker.

Versões anteriores podem continuar armazenadas.

A recuperação precisa entender:

- delete marker;
- version id;
- noncurrent version;
- lifecycle;
- retenção;
- legal hold.

Delete lógico de negócio e delete físico de object são decisões diferentes.

---

### 26. Lifecycle

Arquivo:

```text
s3-lifecycle-policy.yaml
```

Conteúdo:

```yaml
lifecycle:
  incompleteMultipartUpload:
    abortAfterDays:
      7

  temporaryExports:
    expireAfterDays:
      30

  noncurrentVersions:
    retainDays:
      decisionRequired

  documents:
    transition:
      decisionRequired

  deleteMarkers:
    cleanup:
      reviewed

  legalRetention:
    lifecycleDelete:
      forbiddenWhenActive
```

Os valores são didáticos.

A próxima aula discutirá custos de armazenamento e transição.

---

### 27. Retenção

Retenção depende de negócio, contrato, classificação, auditoria e recuperação. Exports temporários, documentos contratuais e artefatos de pipeline precisam de prazos diferentes.

---

### 28. Object Lock

Object Lock pode impor retenção e legal hold. Ele não será configurado nesta aula e exige análise do impacto sobre exclusão e compliance.

---

### 29. Encryption

Encryption at rest é obrigatória. Quando KMS é usado, key policy, IAM, rotação, auditoria, recovery e cross-account precisam ser revisados. A aplicação não administra a chave.

---

### 30. TLS

Uploads e downloads usam HTTPS.

A aplicação não deve:

- desabilitar validação TLS;
- aceitar hostname inválido;
- confiar em certificados arbitrários;
- usar endpoint HTTP;
- registrar credenciais.

---

### 31. Public access

A baseline exige:

```text
Block Public Access:
habilitado.
```

Bucket e objects permanecem privados.

Exposição pública só pode ocorrer por arquitetura aprovada.

Mesmo arquivos considerados públicos precisam de:

- owner;
- domínio;
- cache policy;
- invalidation;
- observabilidade;
- proteção.

CloudFront não será antecipado nesta aula.

---

### 32. Bucket policy

Arquivo:

```text
s3-bucket-policy-contract.yaml
```

Conteúdo:

```yaml
bucketPolicy:
  publicPrincipal:
    forbidden

  workloadRole:
    allowedActions:
      - PutObject
      - GetObject
      - DeleteObject

    resourcePrefix:
      required

  listBucket:
    prefixCondition:
      required

  insecureTransport:
    deny:
      required

  encryption:
    required

  crossAccount:
    approvalRequired
```

A aplicação não recebe `s3:*`.

---

### 33. IAM e least privilege

Uploader, downloader, cleanup job e auditor recebem apenas actions e prefixes necessários. A aplicação não cria ou remove buckets, não altera lifecycle ou policy, não desabilita versioning e não administra KMS.

---

### 34. Integridade

Arquivo:

```text
s3-integrity-policy.yaml
```

Conteúdo:

```yaml
integrity:
  checksum:
    required

  algorithm:
    approved:
      - SHA256

  upload:
    expectedChecksum:
      required

  download:
    verifyWhenApplicable:
      true

  metadata:
    persisted:
      true

  mismatch:
    reject:
      true

    alert:
      required
```

Checksum ajuda a detectar corrupção ou conteúdo diferente do esperado.

Ele não substitui assinatura digital quando autenticidade formal é necessária.

---

### 35. ETag

ETag não deve ser tratado como checksum universal sem conhecer o modo de upload e a configuração.

Em multipart ou outros cenários, sua interpretação pode mudar.

A policy usará checksum explícito.

---

### 36. Criar adapter em memória

Arquivo:

```text
InMemoryObjectStorageAdapter.java
```

Conteúdo:

```java
package com.formacao.orders.integration.storage;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public final class InMemoryObjectStorageAdapter
        implements ObjectStoragePort {

    private final Map<String, StoredObject> objects =
            new ConcurrentHashMap<>();

    @Override
    public StoredObject put(
            ObjectKey key,
            ObjectMetadata metadata,
            byte[] content
    ) {
        String versionId = UUID.randomUUID().toString();

        StoredObject stored = new StoredObject(
                key,
                metadata,
                content,
                versionId
        );

        objects.put(key.value(), stored);

        return stored;
    }

    @Override
    public Optional<StoredObject> get(ObjectKey key) {
        return Optional.ofNullable(
                objects.get(key.value())
        );
    }

    @Override
    public void delete(ObjectKey key) {
        objects.remove(key.value());
    }

    @Override
    public String createUploadUrl(
            ObjectKey key,
            ObjectMetadata metadata,
            Duration validity
    ) {
        return "memory://upload/"
                + key.value()
                + "?expiresAt="
                + Instant.now().plus(validity);
    }

    @Override
    public String createDownloadUrl(
            ObjectKey key,
            Duration validity
    ) {
        return "memory://download/"
                + key.value()
                + "?expiresAt="
                + Instant.now().plus(validity);
    }
}
```

---

### 37. Criar exceção de storage

Arquivo:

```text
ObjectStorageException.java
```

Conteúdo:

```java
package com.formacao.orders.integration.storage;

public final class ObjectStorageException
        extends RuntimeException {

    public ObjectStorageException(
            String message,
            Throwable cause
    ) {
        super(message, cause);
    }
}
```

---

### 38. Criar serviço de storage

Arquivo:

```text
ObjectStorageService.java
```

Conteúdo:

```java
package com.formacao.orders.integration.storage;

import java.time.Duration;
import java.util.Objects;
import java.util.Optional;

public final class ObjectStorageService {

    private final ObjectStoragePort storagePort;

    public ObjectStorageService(
            ObjectStoragePort storagePort
    ) {
        this.storagePort = Objects.requireNonNull(
                storagePort,
                "storagePort"
        );
    }

    public StoredObject upload(
            ObjectKey key,
            ObjectMetadata metadata,
            byte[] content
    ) {
        validateLength(metadata, content);
        return storagePort.put(
                key,
                metadata,
                content
        );
    }

    public Optional<StoredObject> download(
            ObjectKey key
    ) {
        return storagePort.get(key);
    }

    public String createUploadUrl(
            ObjectKey key,
            ObjectMetadata metadata,
            Duration validity
    ) {
        validateValidity(validity);

        return storagePort.createUploadUrl(
                key,
                metadata,
                validity
        );
    }

    public String createDownloadUrl(
            ObjectKey key,
            Duration validity
    ) {
        validateValidity(validity);

        return storagePort.createDownloadUrl(
                key,
                validity
        );
    }

    private void validateLength(
            ObjectMetadata metadata,
            byte[] content
    ) {
        if (metadata.contentLength() != content.length) {
            throw new IllegalArgumentException(
                    "content length mismatch"
            );
        }
    }

    private void validateValidity(Duration validity) {
        if (validity.isZero()
                || validity.isNegative()
                || validity.compareTo(
                        Duration.ofMinutes(5)
                ) > 0) {
            throw new IllegalArgumentException(
                    "invalid signed URL validity"
            );
        }
    }
}
```

---

### 39. Criar profile Spring Boot

Arquivo:

```text
application-aws-s3.yml
```

Conteúdo:

```yaml
app:
  object-storage:
    enabled: ${AWS_S3_ENABLED:false}

    region: ${AWS_REGION:}
    bucket: ${AWS_S3_BUCKET:}

    key-prefix: ${AWS_S3_KEY_PREFIX:dev/orders}

    upload:
      max-bytes: ${AWS_S3_UPLOAD_MAX_BYTES:10485760}
      presigned-validity-seconds: ${AWS_S3_UPLOAD_URL_TTL_SECONDS:300}

    download:
      presigned-validity-seconds: ${AWS_S3_DOWNLOAD_URL_TTL_SECONDS:300}

    integrity:
      checksum-algorithm: ${AWS_S3_CHECKSUM_ALGORITHM:SHA256}

    security:
      public-access: false
      require-tls: true
```

O adapter fica desabilitado por padrão.

Nenhum bucket, endpoint ou credencial real possui default.

---

### 40. Eventos de object storage

Criações e remoções podem disparar processamento, scan, metadata e auditoria. O arquivo `s3-event-contract.yaml` exige payload mínimo e consumers idempotentes; SQS e SNS podem participar da integração.

---

### 41. Upload seguro de usuário

O backend autentica, cria key opaca, define tipo e tamanho, gera autorização temporária e confirma metadata, checksum e scan antes de marcar o object como disponível. Estados possíveis incluem `PENDING_SCAN`, `AVAILABLE`, `REJECTED` e `DELETED`.

---

### 42. Malware scanning

Conteúdo de usuário exige quarentena, trigger, scanner, timeout, status, evidência e cleanup. Nenhum scanner real será configurado.

---

### 43. Consistência entre banco e object storage

Object gravado sem transação confirmada gera órfão; registro sem upload concluído gera referência incompleta. A arquitetura exige estados, confirmação, timeout, reconciliação, cleanup e idempotência.

---

### 44. Criar contrato de reconciliação

Arquivo:

```text
s3-reconciliation-policy.yaml
```

Conteúdo:

```yaml
reconciliation:
  pendingUpload:
    timeoutMinutes:
      decisionRequired

  orphanObject:
    detection:
      required

    cleanup:
      controlled

  missingObject:
    alert:
      required

  versionMismatch:
    alert:
      required

  schedule:
    required

  destructiveCleanup:
    dryRunFirst:
      required
```

---

### 45. Observabilidade

Arquivo:

```text
s3-observability-contract.yaml
```

Inclua:

```yaml
observability:
  application:
    - upload-requested
    - upload-completed
    - upload-rejected
    - download-requested
    - download-denied
    - checksum-mismatch
    - orphan-detected
    - presigned-url-created
    - object-not-found

  service:
    - request-count
    - errors
    - latency
    - bytes-uploaded
    - bytes-downloaded
    - incomplete-multipart-uploads

  audit:
    required:
      true

  logging:
    presignedUrl:
      forbidden

    objectContent:
      forbidden
```

---

### 46. Drivers de custo

Registre storage, requests, transferência, retrieval, versioning, multipart abandonado, logs, KMS, replication e objects órfãos. A aula 543 aprofundará esses custos; aqui basta garantir lifecycle e ownership.

---

### 47. Simular upload

Execute:

```powershell
.\scripts\cloud\aws\object-storage\simulate-object-upload.ps1
```

A simulação deve:

1. gerar key válida;
2. validar content type;
3. validar tamanho;
4. calcular checksum;
5. armazenar no adapter local;
6. registrar version id;
7. recuperar;
8. comparar checksum;
9. registrar evidence.

---

### 48. Simular presigned upload

Execute:

```powershell
.\scripts\cloud\aws\object-storage\simulate-presigned-upload.ps1
```

A simulação deve:

- gerar URL fictícia `memory://`;
- limitar validade;
- restringir operação;
- fixar key;
- validar metadata;
- recusar validade acima de cinco minutos;
- não registrar URL completa em evidence.

---

### 49. Simular versioning

Execute:

```powershell
.\scripts\cloud\aws\object-storage\simulate-versioning.ps1
```

A simulação deve:

- gravar a mesma key duas vezes;
- criar versões diferentes;
- manter referência de versão;
- simular delete marker;
- recuperar versão anterior;
- registrar lifecycle esperado.

O adapter local pode manter uma estrutura específica no script.

---

### 50. Simular lifecycle

Execute:

```powershell
.\scripts\cloud\aws\object-storage\simulate-lifecycle.ps1
```

Cenários:

- export temporário expirado;
- versão não atual;
- multipart incompleto;
- legal retention ativa;
- object sem owner.

A simulação não apaga arquivo real do usuário.

---

### 51. Simular falha de integridade

Execute:

```powershell
.\scripts\cloud\aws\object-storage\simulate-integrity-failure.ps1
```

A simulação altera um byte após o checksum.

Resultado esperado:

- mismatch;
- rejeição;
- alerta;
- object não marcado como disponível;
- evidence sem conteúdo binário.

---

### 52. Criar readiness checklist

Arquivo:

```text
s3-readiness-checklist.yaml
```

Conteúdo:

```yaml
readiness:
  useCases:
    classified

  bucket:
    private:
      required

  key:
    serverGenerated:
      required

  upload:
    sizeLimit:
      required

    contentTypeValidation:
      required

  integrity:
    checksum:
      required

  versioning:
    required

  lifecycle:
    required

  encryption:
    required

  leastPrivilege:
    required

  presignedUrl:
    shortLived:
      required

  reconciliation:
    required

  actualBuckets:
    zero
```

---

### 53. Criar documentação

#### `OBJECT_STORAGE_MODEL.md`

Explique bucket, object, key, prefix e metadata.

#### `S3_BUCKETS_KEYS_PREFIXES.md`

Explique naming, ambiente, domínio e identifiers.

#### `UPLOAD_DOWNLOAD_PATTERNS.md`

Compare backend proxy e acesso presigned.

#### `PRESIGNED_URLS.md`

Explique validade, operação e risco de vazamento.

#### `VERSIONING_AND_LIFECYCLE.md`

Explique versions, delete markers e cleanup.

#### `S3_SECURITY.md`

Explique IAM, policies, TLS, encryption e public access.

#### `S3_INTEGRITY.md`

Explique checksum, content type e reconciliação.

#### `S3_EVENTS.md`

Explique triggers e consumers idempotentes.

---

### 54. Criar test matrix

Arquivo:

```text
S3_TEST_MATRIX.md
```

Cenários:

- bucket privado;
- public access bloqueado;
- key válida;
- path traversal bloqueado;
- dado pessoal em key bloqueado;
- content type permitido;
- content type divergente;
- tamanho excedido;
- checksum válido;
- checksum inválido;
- presigned URL curta;
- presigned URL longa bloqueada;
- upload direto;
- download autorizado;
- download negado;
- versioning;
- delete marker;
- noncurrent lifecycle;
- multipart abandonado;
- legal retention;
- object órfão;
- referência ausente;
- policy wildcard bloqueada;
- bucket real permanece zero.

---

### 55. Criar troubleshooting

Arquivo:

```text
S3_TROUBLESHOOTING.md
```

Inclua:

- access denied;
- bucket incorreto;
- region incorreta;
- key incorreta;
- signature mismatch;
- presigned URL expirada;
- content type divergente;
- upload incompleto;
- multipart abandonado;
- checksum mismatch;
- object not found;
- version id incorreto;
- delete marker;
- lifecycle não aplicado;
- KMS denied;
- bucket policy negando;
- public access bloqueado;
- object órfão;
- referência de banco ausente;
- custo crescendo por versions.

---

### 56. Executar gate final

Execute:

```powershell
.\scripts\cloud\aws\object-storage\validate-s3-blueprint.ps1

.\scripts\cloud\aws\object-storage\validate-s3-key-policy.ps1

.\scripts\cloud\aws\object-storage\validate-s3-upload-policy.ps1

.\scripts\cloud\aws\object-storage\validate-s3-lifecycle-policy.ps1

.\scripts\cloud\aws\object-storage\simulate-object-upload.ps1

.\scripts\cloud\aws\object-storage\simulate-presigned-upload.ps1

.\scripts\cloud\aws\object-storage\simulate-versioning.ps1

.\scripts\cloud\aws\object-storage\simulate-lifecycle.ps1

.\scripts\cloud\aws\object-storage\simulate-integrity-failure.ps1

.\scripts\cloud\aws\object-storage\collect-s3-evidence.ps1

.\scripts\cloud\aws\object-storage\verify-s3-baseline.ps1
```

Finalize:

```powershell
kubectl get deployment,pod,service,ingress,hpa `
  --namespace `
  formacao-java-dev

git diff --check
git status
```

Confirme:

- aplicação saudável;
- S3 desabilitado por padrão;
- nenhum bucket;
- nenhum endpoint;
- nenhuma credencial;
- nenhum object real;
- nenhuma URL real;
- nenhum aprofundamento prematuro de custos.

---

## Entendendo o que foi feito

### Object storage ganhou modelo correto

Ele deixou de ser tratado como diretório remoto.

### Bucket ganhou boundaries

Ambiente, classificação, retenção e owner passaram a orientar separação.

### Keys ganharam padrão

Elas são opacas, versionadas e sem dados pessoais.

### Upload ganhou segurança

Tamanho, content type, checksum e autorização passaram a ser obrigatórios.

### Presigned URL ganhou limite

Ela é credencial temporária e não deve aparecer em logs.

### Versioning ganhou governança

Sobrescritas e exclusões podem ser recuperadas, mas geram lifecycle.

### Lifecycle ganhou responsabilidade

Objetos temporários, versões antigas e uploads incompletos recebem regras.

### Integridade ganhou checksum

Conteúdo divergente é rejeitado antes de ficar disponível.

### Banco e storage ganharam reconciliação

Referência transacional e object precisam permanecer coerentes.

### A próxima aula ganhou continuidade

Os drivers de custo foram identificados sem antecipar a análise financeira detalhada.

---

## Erros comuns importantes

### Tratar S3 como filesystem compartilhado

Object storage possui semântica de API e key.

### Usar key fornecida integralmente pelo usuário

A aplicação precisa gerar e validar a key.

### Colocar nome ou documento na key

Keys aparecem em auditoria, métricas e diagnósticos.

### Tornar bucket público para facilitar download

Use autorização e URL temporária.

### Confiar apenas no content type do cliente

Valide o conteúdo.

### Não definir tamanho máximo

Uploads podem causar abuso e custo.

### Registrar presigned URL em logs

A URL funciona como credencial temporária.

### Habilitar versioning sem lifecycle

Versões antigas crescem sem controle.

### Usar ETag como checksum universal

Use checksum explícito.

### Excluir object antes da transação

Banco e storage podem ficar inconsistentes.

### Antecipar custos cloud

A aula 543 possui esse objetivo.

---

## Comandos úteis

### Validar blueprint

```powershell
.\scripts\cloud\aws\object-storage\validate-s3-blueprint.ps1
```

### Validar keys

```powershell
.\scripts\cloud\aws\object-storage\validate-s3-key-policy.ps1
```

### Simular upload

```powershell
.\scripts\cloud\aws\object-storage\simulate-object-upload.ps1
```

### Simular versioning

```powershell
.\scripts\cloud\aws\object-storage\simulate-versioning.ps1
```

### Simular integridade

```powershell
.\scripts\cloud\aws\object-storage\simulate-integrity-failure.ps1
```

---

## Exercício guiado

### Parte 1 — Use cases

Classifique documentos, exports e uploads.

### Parte 2 — Buckets

Defina boundaries de ambiente e retenção.

### Parte 3 — Keys

Crie padrão opaco e validado.

### Parte 4 — Upload

Defina tamanho, tipo e checksum.

### Parte 5 — Download

Use autorização e validade curta.

### Parte 6 — Versioning

Trate versões e delete markers.

### Parte 7 — Lifecycle

Defina expiração e cleanup.

### Parte 8 — Security

Modele IAM, policy, TLS e encryption.

### Parte 9 — Reconciliation

Trate objects órfãos e referências ausentes.

### Parte 10 — Evidence

Comprove readiness sem AWS real.

---

## Critérios de aceite

- arquivo, H1, número, módulo e nome seguem a grade;
- continuidade com a aula 541 foi preservada;
- ponte para a aula 543 está correta;
- object storage foi definido;
- bucket, object, key, prefix, metadata e tags foram definidos;
- filesystem e object storage foram diferenciados;
- use cases foram classificados;
- dados proibidos foram listados;
- blueprint foi criado;
- buckets privados foram exigidos;
- versioning foi exigido;
- lifecycle foi exigido;
- workload identity foi exigida;
- static access key foi proibida;
- estratégia de buckets foi documentada;
- key policy foi criada;
- keys são geradas pelo servidor;
- path traversal foi bloqueado;
- dados pessoais em keys foram proibidos;
- metadata foi modelada;
- tags foram modeladas;
- referência transacional foi documentada;
- `ObjectKey` foi criado;
- `ObjectMetadata` foi criado;
- `StoredObject` foi criado;
- `ObjectStoragePort` foi criado;
- `ObjectStorageException` foi criada;
- `InMemoryObjectStorageAdapter` foi criado;
- `ObjectStorageService` foi criado;
- upload via backend foi analisado;
- upload presigned foi analisado;
- upload policy foi criada;
- content type foi validado;
- tamanho máximo foi exigido;
- multipart upload foi explicado;
- cleanup de multipart foi exigido;
- download policy foi criada;
- listagem de bucket foi proibida;
- presigned URL recebeu validade curta;
- URL completa em logs foi proibida;
- versioning policy foi criada;
- delete markers foram explicados;
- lifecycle policy foi criada;
- Object Lock foi explicado sem implementação;
- encryption foi exigida;
- TLS foi exigido;
- Block Public Access foi exigido;
- bucket policy foi criada;
- wildcard IAM foi proibido;
- acesso foi limitado por prefix;
- checksum explícito foi exigido;
- ETag não foi tratado como checksum universal;
- profile `application-aws-s3.yml` foi criado;
- S3 começa desabilitado;
- nenhum bucket ou credencial possui default;
- eventos de object storage foram modelados;
- consumers idempotentes foram exigidos;
- upload de usuário possui quarentena e scan;
- inconsistência entre banco e storage foi tratada;
- reconciliation policy foi criada;
- observability contract foi criado;
- drivers de custo foram apenas identificados;
- upload foi simulado;
- presigned upload foi simulado;
- versioning foi simulado;
- lifecycle foi simulado;
- checksum failure foi simulada;
- readiness checklist foi criada;
- documentação foi criada;
- test matrix foi criada;
- troubleshooting foi criado;
- evidence foi sanitizada;
- nenhum bucket, object, URL, endpoint ou credencial real foi criado;
- custos cloud não foram antecipados;
- gate final foi executado;
- commit recomendado está pronto.

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
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/cloud/aws/object-storage `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/java/com/formacao/orders/integration/storage `
  labs/m16/aula-481-consumers-producers-kafka/kafka-orders-lab/src/main/resources/application-aws-s3.yml `
  scripts/cloud/aws/object-storage `
  docs/devops/aws-s3 `
  docs/diario-de-bordo.md
```

Revise:

```powershell
git diff `
  --cached `
  --name-only
```

Procure conteúdo sensível:

```powershell
git diff `
  --cached `
  | Select-String `
      -Pattern `
      "AKIA|ASIA|arn:aws:|amazonaws.com|X-Amz-Signature|secret.key|access.key|private.key"
```

Commit recomendado:

```powershell
git commit -m "feat(m17): modelar Object Storage S3"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- access key;
- secret key;
- session token;
- bucket real;
- object real;
- ARN;
- endpoint;
- presigned URL;
- arquivo pessoal;
- malware;
- cálculo detalhado da aula 543.

---

## Fechamento e ponte para a próxima aula

Nesta aula, object storage deixou de ser tratado como um diretório remoto.

O modelo passou a possuir:

```text
bucket;

object;

key;

prefix;

metadata;

tags;

versioning;

lifecycle;

integrity;

authorization;

reconciliation.
```

Você comprovou que arquivos não devem depender do filesystem do container; keys precisam ser opacas e geradas pelo backend; uploads exigem limite, content type e checksum; presigned URLs são credenciais temporárias; buckets permanecem privados; versioning ajuda a recuperar sobrescritas, mas exige lifecycle; multipart abandonado precisa de cleanup; IAM e bucket policy aplicam least privilege; e banco e object storage precisam de reconciliação.

A próxima aula será:

```text
543 - M17.38 - Custos cloud
```

Nela, você irá aprofundar modelos de cobrança, tagging, budgets, previsões, unit economics, custos de compute, banco, mensageria, cache, object storage, observabilidade, transferência, NAT e estratégias de otimização.

Nenhum orçamento, preço, commitment, cálculo financeiro ou política detalhada de custos foi implementado antecipadamente nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Classifiquei os casos de uso.
- [ ] Defini buckets privados.
- [ ] Modelei keys e metadata.
- [ ] Defini uploads e downloads.
- [ ] Modelei versioning e lifecycle.
- [ ] Defini integridade e reconciliação.
- [ ] Gerei evidence sanitizada.
- [ ] Fiz o commit recomendado.

---

## Troubleshooting adicional

### O upload recebe access denied

Revise role, bucket policy, prefix, encryption e operação permitida.

### A presigned URL expira cedo

Revise relógio, validade e momento de uso.

### A URL funciona para object errado

A key não foi fixada corretamente ou houve autorização incorreta.

### O checksum diverge

Rejeite o conteúdo e revise transporte, cálculo e metadata.

### O object não aparece no sistema

Revise confirmação, referência no banco e reconciliação.

### O banco referencia object inexistente

Gere alerta e execute o runbook de recuperação.

### Existem muitos objects órfãos

Revise upload não confirmado, timeout e cleanup.

### O versioning aumenta continuamente

Crie lifecycle para versões não atuais.

### Multipart uploads permanecem abertos

Adicione abort lifecycle e observabilidade.

### Um cálculo detalhado de custo apareceu

Remova e preserve para a aula 543.

---

## Perguntas de revisão

1. O que é object storage?
2. O que é bucket?
3. O que é object?
4. O que é key?
5. O que é prefix?
6. Qual a diferença entre filesystem e object storage?
7. O que é presigned URL?
8. Por que a key deve ser gerada pelo backend?
9. Por que validar content type?
10. Para que serve checksum?
11. O que é versioning?
12. O que é delete marker?
13. Para que serve lifecycle?
14. O que é multipart upload?
15. Por que Block Public Access é importante?
16. Como IAM e bucket policy se relacionam?
17. Como tratar object órfão?
18. O que observar?
19. O que não foi criado?
20. Qual é a próxima aula?

---

## Roteiro de resposta

1. Armazenamento por objetos.
2. Container lógico.
3. Conteúdo com metadata.
4. Identificador do object.
5. Parte inicial da key.
6. API e semântica de arquivos.
7. URL temporária assinada.
8. Evitar manipulação e exposição.
9. Bloquear conteúdo inesperado.
10. Validar integridade.
11. Preservar versões.
12. Exclusão lógica versionada.
13. Transição e cleanup.
14. Upload em partes.
15. Evitar exposição pública.
16. Identidade e policy do recurso.
17. Reconciliação e cleanup.
18. Erros, latência, bytes e órfãos.
19. Bucket e recursos reais.
20. Custos cloud.

---

## Atualização do diário de bordo

Adicione ao arquivo:

```text
docs/diario-de-bordo.md
```

O bloco:

```markdown
### Aula 542 - M17.37 - Object Storage S3 conceitual

- Continuei após Redis gerenciado conceitual.
- Defini object storage, bucket, object, key e prefix.
- Diferenciei object storage de filesystem.
- Classifiquei documentos, exports, artefatos e uploads.
- Proibi Secrets, chaves e dados sem classificação.
- Modelei buckets privados por ambiente e responsabilidade.
- Criei padrão opaco e versionado de keys.
- Evitei dados pessoais em keys e metadata.
- Criei `ObjectKey`, `ObjectMetadata`, `StoredObject` e `ObjectStoragePort`.
- Criei adapter em memória e serviço de object storage.
- Comparei upload via backend e presigned upload.
- Defini limite de tamanho, content type e checksum.
- Estudei multipart upload e cleanup.
- Modelei downloads autorizados com URLs temporárias.
- Exigi Block Public Access.
- Modelei versioning, delete markers e noncurrent versions.
- Criei lifecycle para exports, versions e multipart abandonado.
- Estudei Object Lock conceitualmente.
- Modelei encryption, TLS, IAM e bucket policy.
- Limitei acesso por prefix e responsabilidade.
- Diferenciei ETag de checksum explícito.
- Criei `application-aws-s3.yml`.
- Mantive object storage desabilitado por padrão.
- Modelei eventos e consumers idempotentes.
- Modelei quarentena e malware scanning.
- Tratei inconsistência entre banco e object storage.
- Criei reconciliation policy.
- Simulei upload, presigned URL, versioning, lifecycle e falha de integridade.
- Não criei bucket, object, endpoint ou credencial real.
- Não antecipei custos cloud.
- Próxima aula: Custos cloud.
```

---

## Referência técnica curta

- Amazon S3 Concepts.
- S3 Buckets and Objects.
- S3 Object Keys and Prefixes.
- S3 Versioning.
- S3 Lifecycle Management.
- S3 Presigned URLs.
- S3 Multipart Upload.
- S3 Encryption and Access Control.
- S3 Checksums.
- Object Storage Integration Patterns.

Regra final:

```text
object storage deve ser tratado como serviço de objetos acessados por bucket e key, não como filesystem remoto: o backend gera keys opacas e versionadas, mantém no banco a referência de negócio e armazena no object storage o conteúdo binário com metadata, classificação e checksum; uploads exigem autenticação, limite de tamanho, content type validado, integridade, quarentena quando houver conteúdo de usuário e confirmação antes de disponibilizar; presigned URLs são credenciais temporárias com operação, key e validade restritas e nunca entram em logs; buckets permanecem privados com Block Public Access, TLS, encryption, IAM mínimo e bucket policy limitada por prefix; versioning, delete markers, lifecycle, cleanup de multipart e reconciliação entre banco e objects preservam governança e recuperação; nenhum bucket, object, endpoint ou credencial real é criado, deixando para a aula 543 o aprofundamento de custos cloud.
```
