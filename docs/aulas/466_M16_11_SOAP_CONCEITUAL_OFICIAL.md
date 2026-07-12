# 466 - M16.11 - SOAP conceitual

## Apresentação da aula

Na aula 465, o laboratório implementou webhooks seguros entre o `catalog-provider` e o `order-consumer`.

O fluxo ficou:

```text
evento persistido;

dispatcher;

HTTP POST;

assinatura HMAC;

inbox;

deduplicação;

processamento idempotente.
```

A integração ainda utilizava um contrato HTTP orientado a JSON.

Nesta aula, estudaremos outra família de integração muito presente em:

- bancos;
- seguradoras;
- telecomunicações;
- governos;
- ERPs;
- sistemas de logística;
- plataformas corporativas antigas;
- integrações B2B de longa duração.

O tema será:

```text
SOAP.
```

SOAP não é apenas “XML enviado por HTTP”.

Ele define um modelo de mensagem com:

- envelope;
- header;
- body;
- faults;
- namespaces;
- regras de processamento;
- extensões de segurança;
- contrato formal normalmente publicado em WSDL.

A pergunta central será:

```text
como compreender,
catalogar
e proteger
uma integração SOAP
sem deixar o contrato externo
contaminar o domínio?
```

A formação não tratará SOAP como tecnologia “morta”.

Sistemas novos podem preferir REST, eventos ou mensageria em muitos cenários, mas integrações SOAP continuam relevantes quando existem:

- contratos corporativos estabilizados;
- geração de clients;
- schemas extensos;
- WS-Security;
- operações transacionais legadas;
- fornecedores que publicam somente WSDL;
- exigências de interoperabilidade específicas.

Também não trataremos SOAP como solução superior por padrão.

A decisão precisa considerar:

- ecossistema do parceiro;
- maturidade das ferramentas;
- segurança;
- governança;
- volume;
- latência;
- necessidade de contrato formal;
- manutenção;
- capacidade da equipe.

Nesta aula, não construiremos ainda um client SOAP produtivo completo.

A próxima aula será:

```text
467 - M16.12 - XML
```

Ela aprofundará:

- estrutura XML;
- namespaces;
- validação;
- parsing;
- serialização;
- segurança de parser;
- XSD.

Aqui o objetivo será compreender o protocolo e preparar uma fronteira arquitetural correta.

O laboratório receberá uma integração conceitual chamada:

```text
Legacy Inventory Service.
```

Esse sistema legado expõe a operação:

```text
CheckAvailability.
```

A intenção de negócio é consultar a disponibilidade de um produto em um depósito.

No mundo SOAP, a operação será descrita por um WSDL.

No mundo da aplicação, o domínio dependerá apenas de:

```java
LegacyInventoryGateway
```

e de modelos internos controlados.

A aplicação não permitirá que classes geradas pelo WSDL atravessem:

- application;
- domain;
- controllers;
- casos de uso;
- regras de negócio.

A fronteira será:

```text
domain/application port;

SOAP adapter;

generated or external contract types;

SOAP transport.
```

A aula criará:

- catálogo do contrato;
- cópia versionada do WSDL;
- checksum;
- exemplos de request, response e fault;
- descrição do binding;
- política de endpoints;
- política de segurança;
- taxonomia de faults;
- porta interna;
- modelos internos;
- architecture tests;
- critérios de produção.

O objetivo não será apenas ler um envelope.

Você deverá entender:

```text
quem define a operação;

como o WSDL organiza o contrato;

como SOAP 1.1 e 1.2 diferem;

o que pertence ao Header;

o que pertence ao Body;

como Faults são transportados;

como WS-Security se diferencia
de autenticação HTTP;

como versionar o contrato;

como mapear o mundo externo
para exceptions internas estáveis.
```

O cenário didático utilizará SOAP 1.1 com estilo:

```text
document/literal wrapped.
```

Essa combinação é comum porque representa documentos XML validados por schema sem depender do modelo legado `rpc/encoded`.

O endpoint de laboratório será representado por configuração:

```text
integrations.legacy-inventory.base-url.
```

O endereço não ficará hardcoded no domínio.

O WSDL versionado poderá conter um endereço de exemplo inválido:

```text
https://legacy.example.invalid/soap/inventory
```

A aplicação substituirá esse valor por configuração controlada.

O domínio não saberá:

- URL;
- namespace SOAP;
- `SOAPAction`;
- XML;
- WSDL;
- XSD;
- WS-Security;
- generated classes;
- transport exception.

Ao final, você deverá conseguir explicar:

```text
por que SOAP
não é sinônimo de XML;

por que WSDL
é contrato e não endpoint;

por que namespace
faz parte da identidade;

por que Fault
não é simplesmente HTTP 500;

por que classes geradas
devem ficar na infraestrutura;

por que segurança SOAP
não se resume a Basic Auth;

por que o contrato externo
precisa ser versionado
e verificável.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
464:
Idempotencia em APIs.

465:
Webhooks.

466:
SOAP conceitual.

467:
XML.

468:
CSV e arquivos de integracao.
```

A aula 465 respondeu:

```text
como entregar
um callback HTTP seguro
com duplicação esperada?
```

A aula 466 responderá:

```text
como compreender
uma integração SOAP
antes de gerar código
ou enviar XML?
```

Nesta aula:

```text
SOAP Envelope:
sim.

Header:
sim.

Body:
sim.

Fault:
sim.

WSDL:
sim.

binding:
sim.

SOAP 1.1 e 1.2:
sim.

WS-Security:
sim, conceitualmente.

parsing XML aprofundado:
próxima aula.

client produtivo:
não.
```

A regra central será:

```text
primeiro compreenda
e catalogue o contrato;

depois gere ou escreva
o adapter.
```

---

## Objetivo prático

Ao final, o laboratório terá:

```text
order-consumer/
├── src/main/java/
│   └── br/com/formacao/orderconsumer/
│       ├── application/legacyinventory/
│       └── infrastructure/soap/legacyinventory/
├── src/main/resources/
│   └── contracts/soap/legacy-inventory/v1/
│       ├── inventory-service.wsdl
│       ├── inventory-service.wsdl.sha256
│       └── samples/
│           ├── check-availability-request.xml
│           ├── check-availability-response.xml
│           ├── product-not-found-fault.xml
│           └── service-unavailable-fault.xml
└── docs/soap/
    └── legacy-inventory/
        ├── SOAP_CONTRACT_CATALOG.md
        ├── SOAP_PROTOCOL_PROFILE.md
        ├── SOAP_FAULT_MAPPING.md
        ├── SOAP_SECURITY_DECISION.md
        └── SOAP_PRODUCTION_READINESS.md
```

Classes:

```text
LegacyInventoryGateway;

LegacyInventoryQuery;

LegacyInventoryAvailability;

LegacyInventoryException;

LegacyInventoryProductNotFoundException;

LegacyInventoryAuthenticationException;

LegacyInventoryUnavailableException;

LegacyInventoryContractException;

SoapVersion;

SoapOperationDescriptor;

SoapFaultDescriptor;

LegacyInventoryFaultClassifier;

LegacyInventoryContractProperties.
```

Testes:

```text
SoapOperationDescriptorTest;

LegacyInventoryFaultClassifierTest;

SoapContractChecksumTest;

SoapContractLocationPolicyTest;

SoapSecurityPolicyTest;

SoapArchitectureBoundaryTest;

SoapGeneratedTypesIsolationTest;

SoapSamplesSanitizationTest;

SoapProductionReadinessTest.
```

Você irá:

1. compreender o envelope;
2. diferenciar SOAP 1.1 e 1.2;
3. compreender WSDL;
4. compreender XSD no contrato;
5. identificar service, port e binding;
6. catalogar a operação;
7. versionar o WSDL;
8. calcular checksum;
9. criar exemplos sanitizados;
10. criar a porta interna;
11. criar modelos internos;
12. criar descriptor do protocolo;
13. criar taxonomia de faults;
14. mapear faults;
15. definir política de endpoint;
16. definir política de segurança;
17. proteger generated types;
18. criar tests de arquitetura;
19. registrar gaps;
20. preparar XML.

---

## Conceito essencial

### SOAP

SOAP é um protocolo de mensagens baseado em XML.

Ele pode ser transportado por HTTP, mas o modelo de mensagem não se reduz ao transporte.

Uma mensagem SOAP possui um envelope que contém:

```text
Header opcional;

Body obrigatório.
```

---

### Envelope

SOAP 1.1 utiliza o namespace:

```text
http://schemas.xmlsoap.org/soap/envelope/
```

SOAP 1.2 utiliza:

```text
http://www.w3.org/2003/05/soap-envelope
```

O namespace distingue a versão.

Não determine a versão pelo prefixo textual.

Isto:

```xml
<soapenv:Envelope>
```

e isto:

```xml
<s:Envelope>
```

podem representar a mesma identidade se apontarem para o mesmo namespace.

---

### Header

O Header carrega metadados de processamento.

Exemplos:

- segurança;
- correlation;
- addressing;
- transaction context;
- routing;
- tenant técnico;
- assinatura.

Dados de negócio da operação normalmente pertencem ao Body.

Não coloque secrets em headers apenas porque eles estão dentro do envelope.

A segurança precisa considerar transporte, criptografia, assinatura e logs.

---

### Body

O Body contém a mensagem da operação.

Exemplo conceitual:

```xml
<inv:CheckAvailabilityRequest>
    <inv:ProductCode>SKU-1001</inv:ProductCode>
    <inv:WarehouseCode>SP-01</inv:WarehouseCode>
</inv:CheckAvailabilityRequest>
```

O elemento e seu namespace fazem parte do contrato.

---

### SOAP Fault

Fault é a estrutura padronizada para erro SOAP.

SOAP 1.1 normalmente possui:

```text
faultcode;

faultstring;

faultactor opcional;

detail opcional.
```

SOAP 1.2 utiliza outra estrutura:

```text
Code;

Reason;

Node;

Role;

Detail.
```

Não tente desserializar um fault SOAP 1.2 como se fosse 1.1.

---

### HTTP status e Fault

Em muitas integrações SOAP 1.1, faults são transportados com HTTP `500`.

Entretanto, o significado real está no envelope Fault.

Também existem servidores legados que retornam:

- `200` com erro de negócio no body;
- `500` sem Fault válido;
- `401` antes do SOAP;
- HTML de proxy;
- body vazio.

O adapter precisa classificar transporte e contrato separadamente.

---

### WSDL

WSDL descreve um serviço.

Em WSDL 1.1, os componentes principais são:

```text
definitions;

types;

message;

portType;

binding;

service;

port.
```

Eles respondem perguntas diferentes.

---

### definitions

É a raiz do documento WSDL.

Declara:

- target namespace;
- namespaces auxiliares;
- componentes do contrato.

---

### types

Contém ou importa schemas XSD.

Define estruturas como:

```text
CheckAvailabilityRequest;

CheckAvailabilityResponse;

ServiceFaultDetail.
```

A aula seguinte aprofundará XML e XSD.

---

### message

Em WSDL 1.1, `message` agrupa parts usados como entrada ou saída.

Em contratos document/literal wrapped, uma part costuma referenciar um elemento global do XSD.

---

### portType

Define operações abstratas.

Exemplo:

```text
CheckAvailability.
```

A operação pode possuir:

- input;
- output;
- fault.

`portType` não define ainda detalhes de HTTP ou SOAPAction.

---

### binding

Liga a operação abstrata a um protocolo e formato.

Pode definir:

- SOAP 1.1;
- SOAP 1.2;
- style document ou rpc;
- use literal ou encoded;
- SOAPAction.

---

### service e port

`service` agrupa endpoints.

`port` associa:

```text
binding
+
address.
```

O address pode variar por ambiente.

Por isso, não trate a URL do WSDL versionado como configuração produtiva definitiva.

---

### SOAPAction

Em SOAP 1.1, `SOAPAction` pode ser enviado em header HTTP:

```http
SOAPAction: "urn:legacy-inventory:CheckAvailability"
```

Em SOAP 1.2, a action pode aparecer como parâmetro do `Content-Type`.

A exigência varia entre servidores.

O contrato catalogado precisa registrar o valor exato.

---

### Content-Type

SOAP 1.1 normalmente usa:

```text
text/xml.
```

SOAP 1.2 normalmente usa:

```text
application/soap+xml.
```

Enviar o media type errado pode gerar:

- `415`;
- Fault;
- body vazio;
- comportamento específico do servidor.

---

### Document/literal wrapped

Document:

```text
o Body contém
um documento XML.
```

Literal:

```text
o conteúdo segue
o schema literalmente.
```

Wrapped:

```text
um elemento externo
representa a operação.
```

Essa combinação facilita interoperabilidade e validação.

---

### RPC/encoded

`rpc/encoded` modela a mensagem como chamada remota e usa regras de encoding SOAP.

É comum em sistemas muito antigos.

Pode gerar incompatibilidades e complexidade adicional.

O laboratório não utilizará esse estilo.

---

### WSDL-first

No modelo WSDL-first:

1. o contrato existe primeiro;
2. classes ou stubs são gerados;
3. o adapter usa o código gerado;
4. o domínio permanece independente.

Vantagens:

- contrato explícito;
- interoperabilidade;
- validação;
- comunicação com fornecedor.

Riscos:

- código gerado invadindo o domínio;
- regeneração quebrando customizações;
- endpoint hardcoded;
- classes enormes;
- diferenças entre versões de toolchain.

---

### Code-first

No modelo code-first, classes e annotations geram o contrato.

Pode ser útil quando a organização controla provider e consumer.

Para integrar um legado externo, normalmente consumiremos o WSDL fornecido.

---

### Generated code

Código gerado deve ficar em package de infraestrutura, por exemplo:

```text
infrastructure.soap.legacyinventory.generated.v1.
```

Nunca edite manualmente essas classes.

Ajustes pertencem a:

- binding files;
- plugins;
- adapter;
- mapper;
- configuração.

---

### Namespace

Namespace é parte da identidade XML.

Estes elementos são diferentes:

```text
{urn:legacy:inventory:v1}ProductCode

{urn:legacy:orders:v1}ProductCode
```

Mesmo local name não significa mesmo campo.

A aula seguinte praticará namespace em parsing e validação.

---

### WS-Security

WS-Security define mecanismos de segurança na mensagem SOAP.

Pode envolver:

- UsernameToken;
- timestamps;
- assinatura XML;
- criptografia XML;
- certificados;
- tokens;
- referências de segurança.

Ele é diferente de:

- Basic Auth HTTP;
- bearer token HTTP;
- mTLS;
- VPN.

Um sistema pode usar mais de uma camada.

---

### UsernameToken

Um legado pode exigir:

```text
Username;

PasswordText;

PasswordDigest;

Nonce;

Created.
```

`PasswordText` não significa texto seguro sem TLS.

Nunca grave credenciais no WSDL, XML de exemplo ou Git.

---

### Assinatura XML

Assinatura XML é sensível a canonicalização, transforms e referências.

Não implemente uma assinatura manual concatenando strings.

Use biblioteca madura e policy testada.

Esse tema não será implementado nesta aula conceitual.

---

### mTLS

mTLS autentica os peers no transporte TLS.

Ele não substitui necessariamente WS-Security.

O contrato operacional precisa registrar:

- truststore;
- keystore;
- alias;
- validade;
- rotação;
- hostname verification.

Nenhum certificado será incluído no repositório.

---

### Fault de negócio e técnico

Exemplos de negócio:

```text
PRODUCT_NOT_FOUND;

WAREHOUSE_NOT_FOUND;

INVALID_PRODUCT_CODE.
```

Exemplos técnicos:

```text
SERVICE_UNAVAILABLE;

AUTHENTICATION_FAILED;

CONTRACT_VERSION_UNSUPPORTED;

INTERNAL_PROCESSING_ERROR.
```

O adapter converte faults externos em exceptions internas estáveis.

---

### Versionamento

O WSDL será armazenado em:

```text
contracts/soap/legacy-inventory/v1.
```

Uma mudança incompatível cria:

```text
v2.
```

Não substitua silenciosamente o arquivo v1.

O checksum detecta alteração não revisada.

---

### Endpoint por configuração

Properties:

```yaml
integrations:
  legacy-inventory:
    base-url: ${LEGACY_INVENTORY_URL}
    wsdl-resource: classpath:contracts/soap/legacy-inventory/v1/inventory-service.wsdl
    connect-timeout: 500ms
    response-timeout: 2s
```

Timeouts já foram estudados.

Nesta aula, apenas registraremos sua necessidade no descriptor.

---

### Porta interna

```java
public interface LegacyInventoryGateway {

    LegacyInventoryAvailability checkAvailability(
            LegacyInventoryQuery query
    );
}
```

A porta não recebe XML, generated request ou SOAP headers.

---

### Modelo interno

```java
public record LegacyInventoryQuery(
        ProductCode productCode,
        WarehouseCode warehouseCode
) {
}
```

```java
public record LegacyInventoryAvailability(
        ProductCode productCode,
        WarehouseCode warehouseCode,
        boolean available,
        int quantity,
        Instant observedAt
) {
}
```

O adapter mapeará o contrato SOAP para esses tipos.

---

## Mão na massa guiada

### 1. Criar a estrutura do contrato

```powershell
New-Item `
  -ItemType Directory `
  -Path src/main/resources/contracts/soap/legacy-inventory/v1/samples `
  -Force

New-Item `
  -ItemType Directory `
  -Path docs/soap/legacy-inventory `
  -Force
```

---

### 2. Criar o catálogo

Arquivo:

```text
SOAP_CONTRACT_CATALOG.md
```

Registre:

| Item | Valor |
|---|---|
| Provider | Legacy Inventory |
| Contract | inventory-service.wsdl |
| Contract version | v1 |
| WSDL version | 1.1 |
| SOAP version | 1.1 |
| Style | document |
| Use | literal |
| Operation | CheckAvailability |
| SOAPAction | urn:legacy-inventory:CheckAvailability |
| Target namespace | urn:legacy:inventory:v1 |
| Security | mTLS + WS-Security UsernameToken |
| Production status | NO-GO |

---

### 3. Criar WSDL didático

Use um WSDL sanitizado com:

```text
service:
LegacyInventoryService;

portType:
LegacyInventoryPortType;

binding:
LegacyInventorySoap11Binding;

port:
LegacyInventorySoap11Port.
```

O address será:

```text
https://legacy.example.invalid/soap/inventory.
```

Não use endereço real.

---

### 4. Criar sample request

```xml
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:inv="urn:legacy:inventory:v1">
    <soapenv:Header/>
    <soapenv:Body>
        <inv:CheckAvailabilityRequest>
            <inv:ProductCode>SKU-1001</inv:ProductCode>
            <inv:WarehouseCode>SP-01</inv:WarehouseCode>
        </inv:CheckAvailabilityRequest>
    </soapenv:Body>
</soapenv:Envelope>
```

Não adicione credentials reais.

---

### 5. Criar sample response

```xml
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:inv="urn:legacy:inventory:v1">
    <soapenv:Body>
        <inv:CheckAvailabilityResponse>
            <inv:ProductCode>SKU-1001</inv:ProductCode>
            <inv:WarehouseCode>SP-01</inv:WarehouseCode>
            <inv:Available>true</inv:Available>
            <inv:Quantity>25</inv:Quantity>
            <inv:ObservedAt>2026-07-12T09:00:00Z</inv:ObservedAt>
        </inv:CheckAvailabilityResponse>
    </soapenv:Body>
</soapenv:Envelope>
```

---

### 6. Criar sample Fault de negócio

```xml
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:inv="urn:legacy:inventory:v1">
    <soapenv:Body>
        <soapenv:Fault>
            <faultcode>soapenv:Client</faultcode>
            <faultstring>Product not found</faultstring>
            <detail>
                <inv:InventoryFault>
                    <inv:Code>PRODUCT_NOT_FOUND</inv:Code>
                    <inv:Message>Product does not exist</inv:Message>
                </inv:InventoryFault>
            </detail>
        </soapenv:Fault>
    </soapenv:Body>
</soapenv:Envelope>
```

A mensagem do parceiro não será devolvida diretamente ao caller.

---

### 7. Criar sample Fault técnico

Use code:

```text
SERVICE_UNAVAILABLE.
```

Mapeie para indisponibilidade interna.

---

### 8. Calcular checksum

```powershell
$hash = (
  Get-FileHash `
    src/main/resources/contracts/soap/legacy-inventory/v1/inventory-service.wsdl `
    -Algorithm SHA256
).Hash.ToLowerInvariant()

Set-Content `
  src/main/resources/contracts/soap/legacy-inventory/v1/inventory-service.wsdl.sha256 `
  $hash `
  -Encoding utf8
```

A revisão do WSDL precisa atualizar o checksum de forma consciente.

---

### 9. Criar SoapVersion

```java
public enum SoapVersion {
    SOAP_11,
    SOAP_12
}
```

Não derive a versão de um nome de arquivo.

---

### 10. Criar operation descriptor

```java
public record SoapOperationDescriptor(
        String serviceLocalName,
        String portLocalName,
        String bindingLocalName,
        String operationName,
        String targetNamespace,
        String soapAction,
        SoapVersion soapVersion,
        String style,
        String use
) {
    public SoapOperationDescriptor {
        requireText(serviceLocalName);
        requireText(operationName);
        requireText(targetNamespace);
        requireText(soapAction);

        if (!"document".equals(style)) {
            throw new IllegalArgumentException(
                "Only document style is approved"
            );
        }

        if (!"literal".equals(use)) {
            throw new IllegalArgumentException(
                "Only literal use is approved"
            );
        }
    }
}
```

---

### 11. Criar descriptor do contrato

```java
@Bean
SoapOperationDescriptor legacyInventoryDescriptor() {
    return new SoapOperationDescriptor(
            "LegacyInventoryService",
            "LegacyInventorySoap11Port",
            "LegacyInventorySoap11Binding",
            "CheckAvailability",
            "urn:legacy:inventory:v1",
            "urn:legacy-inventory:CheckAvailability",
            SoapVersion.SOAP_11,
            "document",
            "literal"
    );
}
```

---

### 12. Criar properties

```java
@ConfigurationProperties(
    prefix = "integrations.legacy-inventory"
)
public record LegacyInventoryContractProperties(
        URI baseUrl,
        String wsdlResource,
        Duration connectTimeout,
        Duration responseTimeout
) {
}
```

Valide:

- HTTP somente em local;
- HTTPS em release;
- host;
- ausência de user info;
- ausência de fragment;
- timeouts positivos.

---

### 13. Criar porta interna

```java
public interface LegacyInventoryGateway {

    LegacyInventoryAvailability checkAvailability(
            LegacyInventoryQuery query
    );
}
```

Ela fica em `application`.

---

### 14. Criar exceptions internas

```text
LegacyInventoryProductNotFoundException;

LegacyInventoryAuthenticationException;

LegacyInventoryUnavailableException;

LegacyInventoryContractException.
```

Nenhuma expõe:

- faultstring;
- endpoint;
- stack externa;
- XML;
- credentials.

---

### 15. Criar fault descriptor

```java
public record SoapFaultDescriptor(
        String soapFaultCode,
        String applicationCode,
        String safeReason
) {
}
```

`safeReason` é interno e controlado.

---

### 16. Criar classifier

Baseline:

| Application code | Exception |
|---|---|
| PRODUCT_NOT_FOUND | ProductNotFound |
| WAREHOUSE_NOT_FOUND | Contract/Business mapping aprovado |
| AUTHENTICATION_FAILED | Authentication |
| SERVICE_UNAVAILABLE | Unavailable |
| CONTRACT_VERSION_UNSUPPORTED | Contract |
| desconhecido | Contract |

Um Fault desconhecido não vira indisponibilidade automaticamente.

---

### 17. Criar mapper conceitual

Defina a fronteira:

```text
generated CheckAvailabilityResponse
->
LegacyInventoryAvailability.
```

O mapper validará:

- product code;
- warehouse;
- quantity não negativa;
- timestamp;
- fields obrigatórios.

A geração das classes e o parsing XML não serão feitos nesta aula.

---

### 18. Criar package reservado

Crie:

```text
infrastructure.soap.legacyinventory.generated.v1.
```

Adicione `package-info.java` explicando:

```text
classes generated only;

do not edit;

do not import outside adapter and mapper.
```

Não adicione classe fake com aparência gerada.

---

### 19. Criar checksum test

O teste:

1. lê o WSDL;
2. calcula SHA-256;
3. lê o arquivo `.sha256`;
4. compara;
5. falha em qualquer alteração não registrada.

---

### 20. Criar location policy test

O WSDL versionado não pode conter:

- host produtivo real;
- IP privado real;
- credentials;
- query token.

O único address permitido no artefato didático é:

```text
example.invalid.
```

---

### 21. Criar security decision

Arquivo:

```text
SOAP_SECURITY_DECISION.md
```

Registre:

```text
transport:
TLS;

peer authentication:
mTLS;

message authentication:
WS-Security UsernameToken
conforme contrato legado;

credentials:
secret manager;

logging:
metadata only;

certificates:
fora do Git.
```

---

### 22. Criar policy de generated types

Architecture test falha se packages fora de:

```text
infrastructure.soap.legacyinventory.
```

importarem:

```text
.generated.
```

Também falha se domain importar:

- `jakarta.xml.bind`;
- `jakarta.xml.ws`;
- SOAP libraries;
- generated types.

---

### 23. Criar fault mapping tests

Cenários:

- product not found;
- auth failed;
- unavailable;
- version unsupported;
- fault sem detail;
- application code desconhecido;
- HTTP `500` com body não SOAP.

Cada cenário produz categoria estável.

---

### 24. Criar protocol profile

Arquivo:

```text
SOAP_PROTOCOL_PROFILE.md
```

Inclua:

- SOAP version;
- media type;
- SOAPAction;
- style/use;
- charset;
- endpoint property;
- security;
- timeout;
- maximum response size;
- fault policy.

---

### 25. Criar maximum size decision

Mesmo SOAP precisa de limite de body.

Baseline didática:

```text
1 MiB.
```

Não implemente o parser ainda.

Registre o limite para a aula XML.

---

### 26. Criar sanitization test

Samples não podem conter:

- CPF;
- e-mail real;
- token;
- password;
- certificate;
- hostname real;
- número de contrato real.

Use sentinelas no test.

---

### 27. Criar production readiness

Arquivo:

```text
SOAP_PRODUCTION_READINESS.md
```

Checklist:

```text
WSDL aprovado;

XSD aprovado;

checksum;

endpoint release;

TLS;

mTLS;

WS-Security;

secret rotation;

timeout;

body limit;

parser hardening;

fault mapping;

generated code;

integration tests;

observability;

runbook.
```

Status:

```text
NO-GO.
```

---

### 28. Criar teste do descriptor

Valide:

```text
SOAP_11;

document;

literal;

operation;

action;

namespace.
```

O teste funciona como contrato interno.

---

### 29. Criar teste de mudança de action

Altere a action no fixture de teste.

Esperado:

```text
descriptor mismatch;

gate falha.
```

O SOAPAction não é um texto decorativo.

---

### 30. Criar teste de endpoint

Profiles:

```text
local:
http://localhost permitido.

release:
somente https.
```

User info e fragment sempre proibidos.

---

### 31. Criar tabela REST versus SOAP

No catálogo:

| Aspecto | REST/HTTP JSON | SOAP |
|---|---|---|
| Contrato | OpenAPI opcional | WSDL comum |
| Mensagem | JSON comum | Envelope XML |
| Erro | status + Problem Details | Fault + transporte |
| Segurança | OAuth2, mTLS | HTTP + WS-Security |
| Versionamento | URL/header/schema | namespace/WSDL/XSD |
| Tooling | clients HTTP | code generation |
| Streaming | varia | normalmente request/response |
| Legado B2B | possível | muito comum |

A tabela não define um vencedor universal.

---

### 32. Criar ADR

Decisão:

```text
consumir o contrato legado;

isolar generated types;

usar WSDL-first;

manter domínio independente;

não iniciar produção
antes da aula XML
e geração validada.
```

---

### 33. Criar fault runbook

No arquivo de fault mapping, inclua perguntas:

- HTTP status;
- content type;
- SOAP version;
- fault code;
- application code;
- detail presente;
- action correta;
- endpoint correto;
- certificate válido;
- credential válida;
- WSDL checksum;
- deploy recente;
- payload excedeu limite.

---

### 34. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=SoapOperationDescriptorTest,LegacyInventoryFaultClassifierTest,SoapContractChecksumTest,SoapContractLocationPolicyTest,SoapSecurityPolicyTest,SoapArchitectureBoundaryTest,SoapGeneratedTypesIsolationTest,SoapSamplesSanitizationTest,SoapProductionReadinessTest `
  test
```

---

### 35. Executar gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- WSDL versionado;
- checksum;
- samples;
- descriptor;
- fault mapping;
- security;
- endpoint;
- architecture;
- NO-GO.

---

### 36. Revisar o contrato em grupo

Faça uma revisão simulada com papéis:

```text
consumer owner;

provider owner;

security;

operations;

QA.
```

Cada pessoa deve responder:

- qual operation;
- qual action;
- qual namespace;
- qual fault;
- qual auth;
- qual timeout;
- qual version;
- qual owner.

---

### 37. Registrar gaps

Ainda faltam:

```text
parsing XML;

XSD validation;

XXE hardening;

class generation;

marshaller;

unmarshaller;

SOAP client;

WS-Security real;

mTLS real;

integration test com provider;

observability de chamada.
```

Esses itens não serão escondidos.

---

## Entendendo o que foi feito

### SOAP foi tratado como protocolo

Ele não foi reduzido a uma string XML.

### WSDL ganhou governança

O contrato foi versionado, catalogado e protegido por checksum.

### A operação ficou explícita

Service, port, binding, action e namespace foram registrados.

### O domínio permaneceu limpo

A porta interna não conhece XML ou generated types.

### Faults receberam taxonomia

Erro de negócio, autenticação, indisponibilidade e contrato foram separados.

### Segurança ganhou camadas

TLS, mTLS e WS-Security não foram confundidos.

### Endpoints ficaram configuráveis

O address do WSDL não controla produção.

### Generated code recebeu boundary

Classes futuras ficarão restritas à infraestrutura.

### Produção permaneceu bloqueada

XML, parser hardening e client real ainda faltam.

---

## Erros comuns importantes

### Tratar SOAP como REST com XML

Envelope, Fault e WSDL são ignorados.

### Comparar prefixo de namespace

Prefixos podem mudar sem alterar identidade.

### Hardcodar endpoint do WSDL

Ambientes ficam acoplados ao artefato.

### Importar generated types no domínio

Uma mudança externa contamina toda a aplicação.

### Mapear todo HTTP 500 para unavailable

O body pode conter Fault de negócio ou contrato.

### Logar envelope completo

Credentials e dados podem vazar.

### Editar classe gerada

A próxima geração destrói a alteração.

### Implementar WS-Security manualmente

Canonicalização e assinatura são complexas.

### Copiar certificado para o Git

Secret material fica exposto.

### Declarar produção pronta

Ainda faltam XML seguro, geração e integração real.

---

## Comandos úteis

### Checksum

```powershell
Get-FileHash `
  src/main/resources/contracts/soap/legacy-inventory/v1/inventory-service.wsdl `
  -Algorithm SHA256
```

### Procurar endpoints e secrets

```powershell
git grep `
  -n `
  -E `
  "http://|https://|PasswordText|UsernameToken|BEGIN CERTIFICATE|Authorization"
```

### Boundary tests

```powershell
.\mvnw.cmd `
  -Dtest=SoapArchitectureBoundaryTest,SoapGeneratedTypesIsolationTest `
  test
```

### Contract tests

```powershell
.\mvnw.cmd `
  -Dtest=SoapContractChecksumTest,SoapContractLocationPolicyTest,SoapSamplesSanitizationTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Protocolo

Identifique Envelope, Header, Body e Fault.

### Parte 2 — WSDL

Identifique types, message, portType, binding, service e port.

### Parte 3 — Perfil

Registre version, action, style e use.

### Parte 4 — Contrato

Versione WSDL e samples.

### Parte 5 — Integridade

Crie checksum.

### Parte 6 — Arquitetura

Crie porta e modelos internos.

### Parte 7 — Faults

Crie taxonomia e classifier.

### Parte 8 — Segurança

Registre TLS, mTLS e WS-Security.

### Parte 9 — Policies

Proteja endpoints, generated types e samples.

### Parte 10 — Gate

Mantenha produção como NO-GO.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 465 foi preservada;
- SOAP foi diferenciado de XML;
- SOAP foi diferenciado do transporte HTTP;
- Envelope foi explicado;
- Header foi explicado;
- Body foi explicado;
- Fault foi explicado;
- SOAP 1.1 e 1.2 foram diferenciados;
- namespaces das versões foram registrados;
- media types foram diferenciados;
- SOAPAction foi explicado;
- WSDL 1.1 foi explicado;
- definitions foi explicado;
- types foi explicado;
- message foi explicado;
- portType foi explicado;
- binding foi explicado;
- service e port foram explicados;
- document/literal wrapped foi adotado;
- rpc/encoded foi contextualizado;
- WSDL-first e code-first foram diferenciados;
- WSDL foi versionado;
- checksum foi criado;
- samples sanitizados foram criados;
- endpoint real não foi incluído;
- porta interna foi criada;
- modelos internos foram criados;
- generated package foi reservado;
- domínio não importa SOAP libraries;
- generated types não atravessam a infraestrutura;
- operation descriptor foi criado;
- target namespace foi registrado;
- fault classifier foi criado;
- product not found foi diferenciado;
- auth failure foi diferenciada;
- unavailable foi diferenciada;
- contract failure foi diferenciada;
- HTTP status e Fault foram separados;
- TLS, mTLS e WS-Security foram diferenciados;
- credentials ficaram fora do repositório;
- endpoint é configurável;
- HTTPS é obrigatório em release;
- body limit foi registrado;
- architecture tests foram criados;
- sanitization test foi criado;
- security policy foi criada;
- production readiness foi criada;
- status público permaneceu NO-GO;
- parsing XML não foi antecipado;
- XSD validation não foi antecipada;
- client produtivo não foi inventado;
- gaps foram registrados;
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
  "PasswordText|UsernameToken|BEGIN CERTIFICATE|legacy\\.example|\\.generated\\.|soapAction|targetNamespace"
```

Adicione:

```powershell
git add `
  labs/m16/aula-456-integracoes-http-entre-sistemas/order-consumer `
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
git commit -m "docs(m16): catalogar contrato SOAP legado"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- credentials;
- certificate;
- keystore;
- truststore;
- endpoint real;
- payload produtivo;
- generated code manual;
- client incompleto;
- parser inseguro;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o laboratório preparou uma integração SOAP sem misturar o contrato legado ao domínio.

O contrato passou a possuir:

```text
WSDL versionado;

checksum;

samples;

operation descriptor;

fault mapping;

security decision;

production readiness.
```

A mensagem SOAP foi compreendida como:

```text
Envelope;

Header;

Body;

Fault.
```

O WSDL foi compreendido como:

```text
types;

message;

portType;

binding;

service;

port.
```

A principal decisão foi:

```text
o contrato externo
fica na infraestrutura;

o domínio depende
de uma porta estável.
```

Também ficou comprovado que:

- prefixo não define namespace;
- SOAP 1.1 e 1.2 não são intercambiáveis;
- HTTP `500` não explica sozinho o fault;
- URL do WSDL não deve controlar o ambiente;
- generated types não pertencem ao domínio;
- WS-Security não é sinônimo de Basic Auth;
- checksum torna alterações contratuais visíveis.

A próxima aula será:

```text
467 - M16.12 - XML
```

Nela, você irá:

- compreender documentos XML;
- trabalhar com elementos e atributos;
- dominar namespaces;
- criar XSD;
- validar XML;
- configurar parsers seguros;
- bloquear XXE;
- analisar entity expansion;
- serializar e desserializar;
- validar os envelopes SOAP preparados nesta aula.

---

# Material complementar

## Checkpoint final

- [ ] Cataloguei o WSDL e a operação.
- [ ] Versionei contrato e samples.
- [ ] Criei porta e fault mapping.
- [ ] Separei domínio e generated types.
- [ ] Mantive produção como NO-GO.

---

## Troubleshooting adicional

### O serviço responde `415`

Confirme SOAP version e `Content-Type`.

### O servidor diz que action está ausente

Revise `SOAPAction` ou action do media type.

### O Fault não é reconhecido

Confirme versão, namespace e detail.

### O endpoint aponta para produção no teste

Substitua por `example.invalid` e use configuração por profile.

### O checksum falha

O WSDL mudou; revise o diff antes de atualizar o hash.

### Classes geradas aparecem no domínio

Mova mapping e uso para o adapter.

### UsernameToken aparece nos samples

Remova credentials e use placeholders técnicos sem secret.

### O certificado está no repositório

Revogue, remova do histórico e use secret management.

### O HTTP status é `200`, mas há erro

O legado pode transportar erro no body; catalogue o comportamento.

### A equipe quer liberar produção

XML seguro, XSD, geração e testes reais ainda faltam.

---

## Perguntas de revisão

1. SOAP é apenas XML?
2. SOAP depende obrigatoriamente de HTTP?
3. Quais partes existem no Envelope?
4. O Header é obrigatório?
5. O Body é obrigatório?
6. O que é Fault?
7. SOAP 1.1 e 1.2 usam o mesmo namespace?
8. Prefixo define identidade?
9. O que é WSDL?
10. O que define `portType`?
11. O que define `binding`?
12. O que liga binding a endereço?
13. O que é SOAPAction?
14. O que significa document/literal?
15. Generated types podem ir ao domínio?
16. WSDL pode ser versionado?
17. WS-Security é Basic Auth?
18. O que o checksum protege?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Não.
2. Não.
3. Header opcional e Body obrigatório.
4. Não.
5. Sim.
6. Estrutura padronizada de erro.
7. Não.
8. Não, namespace define.
9. Contrato do serviço.
10. Operações abstratas.
11. Protocolo e formato.
12. `port`.
13. Identificador de operação no transporte.
14. Documento validado literalmente.
15. Não.
16. Sim.
17. Não.
18. Mudanças não revisadas.
19. XML.
20. Estrutura, namespace, XSD e segurança.

---

## Desafio opcional

Crie um segundo descriptor para SOAP 1.2.

Compare:

- namespace do Envelope;
- media type;
- action;
- estrutura de Fault;
- binding WSDL;
- compatibilidade do provider.

Não implemente transporte.

O objetivo é tornar as diferenças explícitas e testáveis.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 466 - M16.11 - SOAP conceitual

- Diferenciei SOAP, XML e transporte HTTP.
- Estudei Envelope, Header, Body e Fault.
- Diferenciei SOAP 1.1 e SOAP 1.2.
- Registrei namespaces e media types.
- Entendi SOAPAction.
- Estudei WSDL 1.1.
- Entendi definitions, types, message, portType, binding, service e port.
- Adotei document/literal wrapped no laboratório.
- Contextualizei rpc/encoded.
- Diferenciei WSDL-first e code-first.
- Criei catálogo do contrato Legacy Inventory.
- Versionei o WSDL em `v1`.
- Criei checksum SHA-256.
- Criei samples de request, response e faults.
- Mantive endpoints reais fora do contrato.
- Criei `SoapVersion`.
- Criei `SoapOperationDescriptor`.
- Criei `LegacyInventoryContractProperties`.
- Criei `LegacyInventoryGateway`.
- Criei query e resultado internos.
- Criei exceptions estáveis.
- Criei `SoapFaultDescriptor`.
- Criei `LegacyInventoryFaultClassifier`.
- Mapeei faults de negócio, autenticação, indisponibilidade e contrato.
- Separei HTTP status e SOAP Fault.
- Registrei TLS, mTLS e WS-Security.
- Mantive credentials e certificates fora do Git.
- Reservei package para generated types.
- Impedi generated types no domínio.
- Criei checksum, endpoint, security e architecture tests.
- Criei sanitization test para samples.
- Criei protocol profile, fault mapping e readiness.
- Registrei body limit de 1 MiB.
- Não antecipei parsing XML, XSD ou client produtivo.
- Mantive produção pública como NO-GO.
- Próxima aula: XML.
```

---

## Referência técnica curta

- [W3C — SOAP 1.1](https://www.w3.org/TR/2000/NOTE-SOAP-20000508/)
- [W3C — SOAP 1.2](https://www.w3.org/TR/soap12-part1/)
- [W3C — WSDL 1.1](https://www.w3.org/TR/wsdl.html)
- [W3C — XML Schema](https://www.w3.org/XML/Schema)
- [OASIS — WS-Security](https://docs.oasis-open.org/wss/)
- [Spring Web Services Reference](https://docs.spring.io/spring-ws/docs/current/reference/html/)

Regra final:

```text
uma integração SOAP deve começar pelo contrato e pela fronteira arquitetural: SOAP define Envelope, Header, Body e Fault sobre XML, WSDL descreve types, messages, operations, bindings, services e ports, namespaces e actions fazem parte da identidade, SOAP 1.1 e 1.2 exigem perfis diferentes, faults de negócio e técnicos precisam ser traduzidos, generated types ficam restritos ao adapter, endpoints e credentials vêm de configuração segura, TLS, mTLS e WS-Security são camadas distintas, o WSDL versionado recebe checksum e samples sanitizados e a aplicação permanece NO-GO até que XML, XSD, parser hardening, geração e testes reais sejam concluídos.
```
