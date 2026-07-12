# 467 - M16.12 - XML

## Apresentação da aula

Na aula 466, o laboratório catalogou uma integração SOAP chamada:

```text
Legacy Inventory Service.
```

O contrato foi preparado com:

```text
WSDL versionado;

checksum SHA-256;

samples de request;

samples de response;

samples de Fault;

operation descriptor;

fault mapping;

security decision;

production readiness.
```

A operação conceitual é:

```text
CheckAvailability.
```

O domínio conhece somente:

```java
LegacyInventoryGateway
```

e modelos internos controlados.

Ele não conhece:

- envelope SOAP;
- WSDL;
- XSD;
- namespace externo;
- XML;
- `SOAPAction`;
- classes geradas;
- detalhes de transporte.

Agora precisamos compreender e manipular o formato que sustenta esse contrato:

```text
XML.
```

A pergunta central desta aula será:

```text
como receber,
validar,
interpretar
e produzir XML
sem aceitar documentos malformados,
schemas incorretos,
namespaces errados
ou recursos externos perigosos?
```

XML parece simples quando observamos apenas:

```xml
<ProductCode>SKU-1001</ProductCode>
```

Mas uma integração real precisa lidar com:

- declaração XML;
- encoding;
- elementos;
- atributos;
- namespaces;
- prefixos;
- texto;
- ordem dos elementos;
- cardinalidade;
- tipos;
- schemas;
- tamanho;
- entidades;
- DTD;
- imports;
- parsing;
- serialização;
- erros.

Também existem riscos específicos.

Um parser XML mal configurado pode tentar resolver uma entidade externa:

```xml
<!DOCTYPE inventory [
  <!ENTITY secret SYSTEM "file:///etc/passwd">
]>
```

Ou buscar um recurso remoto:

```xml
<!ENTITY remote SYSTEM "https://attacker.example/resource">
```

Isso pode causar:

- leitura de arquivo local;
- chamadas de rede;
- SSRF;
- vazamento de secrets;
- indisponibilidade;
- consumo excessivo de CPU e memória.

Outro ataque conhecido utiliza expansão de entidades em cascata.

Mesmo sem acesso a arquivo ou rede, uma pequena entrada pode gerar uma expansão enorme em memória.

Nesta aula, adotaremos uma política conservadora:

```text
DOCTYPE:
proibido.

entidades externas:
proibidas.

DTD externo:
proibido.

schema externo:
proibido.

XInclude:
proibido.

body:
limitado.

namespace:
obrigatório.

XSD:
obrigatório.

parser:
fail-closed.
```

O laboratório continuará com SOAP 1.1.

O envelope de request será:

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

A aula criará um XSD para o payload de negócio:

```text
inventory-v1.xsd.
```

Ele definirá:

- `CheckAvailabilityRequest`;
- `CheckAvailabilityResponse`;
- `InventoryFault`;
- tipos de product code;
- warehouse code;
- quantity;
- timestamp.

O XSD não validará o envelope SOAP completo.

Ele validará o elemento dentro do `Body`.

Essa separação permite:

```text
SOAP:
estrutura de transporte da mensagem.

XSD do domínio externo:
payload da operação.
```

A sequência segura será:

```text
bytes recebidos;

limite de tamanho;

parser namespace-aware;

DOCTYPE e entidades bloqueados;

Envelope SOAP validado estruturalmente;

payload extraído;

XSD aplicado ao payload;

modelo externo lido;

mapper para modelo interno.
```

Não faremos parsing baseado em prefixo textual.

Isto:

```xml
<soapenv:Envelope>
```

pode chegar como:

```xml
<s:Envelope>
```

desde que o namespace seja o mesmo.

A identidade correta será:

```text
namespace URI
+
local name.
```

Também não validaremos apenas se o XML “abre”.

Um documento pode ser bem formado e ainda violar o contrato.

Exemplo bem formado, mas inválido:

```xml
<inv:CheckAvailabilityRequest
    xmlns:inv="urn:legacy:inventory:v1">
    <inv:ProductCode>!</inv:ProductCode>
</inv:CheckAvailabilityRequest>
```

O XSD rejeitará o product code.

A implementação utilizará APIs JAXP presentes no módulo:

```text
java.xml.
```

Usaremos:

- `DocumentBuilderFactory`;
- `SchemaFactory`;
- `Validator`;
- `TransformerFactory`;
- `XMLConstants`;
- DOM namespace-aware.

Também estudaremos quando usar:

- DOM;
- SAX;
- StAX;
- JAXB.

O parser principal desta aula será DOM porque:

- o body possui limite de 1 MiB;
- o envelope é pequeno;
- precisamos navegar por namespaces;
- o laboratório precisa visualizar a árvore;
- a simplicidade favorece a aprendizagem.

Isso não significa que DOM seja sempre a melhor escolha.

Para arquivos grandes, SAX ou StAX podem ser mais adequados.

O status de produção permanecerá:

```text
NO-GO.
```

Ao final, ainda faltarão:

- geração de classes a partir do contrato;
- client SOAP real;
- WS-Security real;
- mTLS real;
- integração com provider;
- testes de carga;
- observabilidade de transporte.

Mas o XML deixará de ser um gap.

Ao final, você deverá conseguir explicar:

```text
diferença entre
bem formado
e válido;

por que prefixo
não define namespace;

por que XSD
não substitui validação de negócio;

por que DocumentBuilder
não deve ser compartilhado;

por que Schema
pode ser pré-compilado,
mas Validator é criado por chamada;

por que DOCTYPE
deve ser proibido;

por que body limit
vem antes do parser;

por que XML externo
nunca deve buscar
DTD ou schema na rede.
```

---

## Onde estamos na formação

A sequência oficial é:

```text
465:
Webhooks.

466:
SOAP conceitual.

467:
XML.

468:
CSV e arquivos de integracao.

469:
SFTP.
```

A aula 466 respondeu:

```text
como compreender
e catalogar SOAP
antes da implementação?
```

A aula 467 responderá:

```text
como validar
e processar XML
de forma segura?
```

Nesta aula:

```text
XML bem formado:
sim.

namespaces:
sim.

XSD:
sim.

DOM:
sim.

SAX e StAX:
comparados.

XXE:
bloqueado.

entity expansion:
bloqueada.

serialização:
sim.

client SOAP:
não.

CSV:
próxima aula.
```

A regra central será:

```text
nenhum XML externo
é confiável
antes de limite,
hardening,
namespace
e schema.
```

---

## Objetivo prático

Ao final, o laboratório terá:

```text
src/main/resources/contracts/soap/legacy-inventory/v1/
├── inventory-service.wsdl
├── inventory-v1.xsd
├── inventory-v1.xsd.sha256
└── samples/
    ├── check-availability-request.xml
    ├── check-availability-response.xml
    ├── invalid-wrong-namespace.xml
    ├── invalid-missing-field.xml
    ├── attack-doctype.xml
    └── attack-entity-expansion.xml
```

Classes:

```text
XmlPayloadLimits;

SecureXmlFactories;

XmlSchemaCatalog;

XmlSchemaValidator;

Soap11EnvelopeReader;

Soap11EnvelopeWriter;

LegacyInventoryXmlCodec;

LegacyInventoryXmlMapper;

XmlDocumentException;

XmlSecurityViolationException;

XmlSchemaViolationException;

XmlContractViolationException.
```

Testes:

```text
XmlWellFormednessTest;

XmlNamespaceTest;

InventoryXsdValidationTest;

SecureDocumentBuilderFactoryTest;

XmlDoctypeRejectionTest;

XmlExternalEntityRejectionTest;

XmlEntityExpansionRejectionTest;

XmlExternalSchemaAccessTest;

XmlBodyLimitTest;

Soap11EnvelopeReaderTest;

LegacyInventoryXmlCodecTest;

XmlSerializationRoundTripTest;

XmlThreadSafetyTest;

XmlLoggingSecurityTest;

XmlProductionReadinessTest.
```

Documentação:

```text
docs/xml/
├── XML_PROFILE.md
├── XML_SECURITY_POLICY.md
├── XML_SCHEMA_CATALOG.md
├── XML_ERROR_MAPPING.md
└── XML_RUNBOOK.md
```

Você irá:

1. compreender bem-formado;
2. compreender válido;
3. trabalhar com namespaces;
4. criar XSD;
5. criar checksum;
6. configurar body limit;
7. configurar parser seguro;
8. bloquear DOCTYPE;
9. bloquear entidades;
10. bloquear acesso externo;
11. pré-compilar Schema;
12. criar Validator por chamada;
13. ler Envelope SOAP;
14. extrair payload;
15. validar payload;
16. mapear response;
17. produzir request;
18. testar ataques;
19. criar runbook;
20. preparar arquivos CSV.

---

## Conceito essencial

### Documento bem formado

Um XML bem formado obedece às regras sintáticas.

Exemplo:

```xml
<root>
    <item>value</item>
</root>
```

Exemplo malformado:

```xml
<root>
    <item>value</root>
```

O parser rejeita antes de qualquer XSD.

---

### Documento válido

Um XML válido é bem formado e também atende ao schema esperado.

O XSD pode exigir:

- elementos;
- ordem;
- tipos;
- padrões;
- quantidade mínima;
- quantidade máxima;
- namespaces.

---

### Declaração XML

Exemplo:

```xml
<?xml version="1.0" encoding="UTF-8"?>
```

O laboratório aceitará:

```text
XML 1.0;

UTF-8.
```

Não confie apenas no texto da declaração.

O transporte e os bytes precisam ser coerentes.

---

### Elementos

```xml
<inv:ProductCode>SKU-1001</inv:ProductCode>
```

Possuem:

- namespace;
- local name;
- conteúdo.

O prefixo `inv` é apenas um alias.

---

### Atributos

```xml
<inv:Item version="1">
```

Atributos sem prefixo não herdam automaticamente o namespace default do elemento.

Essa diferença é importante em schemas e assinaturas XML.

---

### Namespace

Declaração:

```xml
xmlns:inv="urn:legacy:inventory:v1"
```

Nome expandido:

```text
{urn:legacy:inventory:v1}ProductCode.
```

Use APIs namespace-aware.

Não compare:

```text
node.getNodeName()
```

com:

```text
inv:ProductCode.
```

Prefira:

```text
node.getNamespaceURI();

node.getLocalName().
```

---

### Namespace default

Exemplo:

```xml
<CheckAvailabilityRequest
    xmlns="urn:legacy:inventory:v1">
```

Os elementos sem prefixo pertencem ao namespace default.

O contrato é equivalente ao uso do prefixo `inv`.

---

### Namespace e atributos

Isto:

```xml
<item xmlns="urn:x" id="10">
```

coloca `item` em `urn:x`, mas `id` permanece sem namespace.

Para namespaced attribute:

```xml
<x:item xmlns:x="urn:x" x:id="10">
```

---

### XSD

XML Schema Definition descreve estrutura e restrições.

Namespace do XSD:

```text
http://www.w3.org/2001/XMLSchema.
```

O schema do laboratório usará:

```text
targetNamespace:
urn:legacy:inventory:v1;

elementFormDefault:
qualified.
```

Assim, os elementos do payload precisam estar qualificados pelo namespace.

---

### Tipos simples

Exemplo:

```xml
<xs:simpleType name="ProductCodeType">
    <xs:restriction base="xs:string">
        <xs:minLength value="3"/>
        <xs:maxLength value="40"/>
        <xs:pattern value="[A-Z0-9_-]+"/>
    </xs:restriction>
</xs:simpleType>
```

O XSD elimina entradas estruturalmente incompatíveis.

A aplicação ainda mantém value objects internos.

---

### Tipos complexos

Exemplo:

```xml
<xs:complexType name="CheckAvailabilityRequestType">
    <xs:sequence>
        <xs:element
            name="ProductCode"
            type="inv:ProductCodeType"/>
        <xs:element
            name="WarehouseCode"
            type="inv:WarehouseCodeType"/>
    </xs:sequence>
</xs:complexType>
```

A ordem é significativa porque usamos `xs:sequence`.

---

### Cardinalidade

Atributos:

```text
minOccurs;

maxOccurs.
```

Default:

```text
1.
```

Um field opcional:

```xml
minOccurs="0"
```

Não transforme tudo em opcional para aceitar qualquer payload.

---

### XSD não é regra de negócio completa

O schema pode validar:

```text
quantity não negativa.
```

Mas não sabe:

```text
se o depósito existe;

se o produto pode ser vendido;

se o tenant possui acesso;

se o estoque está reservado.
```

Essas regras continuam na aplicação.

---

### DOM

DOM carrega o documento em uma árvore.

Vantagens:

- navegação simples;
- acesso aleatório;
- XPath;
- boa didática.

Custos:

- memória proporcional ao documento;
- árvore completa;
- inadequado para arquivos enormes.

Por isso, usamos body limit antes do parser.

---

### SAX

SAX é orientado a eventos.

O parser chama callbacks para:

- início de elemento;
- texto;
- fim de elemento.

Vantagens:

- baixo uso de memória;
- streaming.

Custos:

- estado manual;
- leitura menos intuitiva;
- acesso não aleatório.

---

### StAX

StAX é um parser pull.

A aplicação solicita o próximo evento:

```text
START_ELEMENT;

CHARACTERS;

END_ELEMENT.
```

É útil para arquivos grandes e pipelines streaming.

A configuração segura precisa desabilitar DTD e entidades externas.

---

### JAXB

JAXB mapeia XML para objetos.

No Java moderno, JAXB é uma dependência separada do JDK.

Mesmo com JAXB:

- o parser precisa ser seguro;
- namespaces continuam relevantes;
- XSD continua relevante;
- classes geradas ficam na infraestrutura.

Nesta aula, não geraremos classes JAXB.

---

### XXE

XML External Entity explora resolução externa.

Exemplo:

```xml
<!DOCTYPE root [
    <!ENTITY xxe SYSTEM "file:///secret">
]>
```

Se o parser resolver a entidade, o conteúdo pode aparecer na árvore.

A baseline rejeita qualquer `DOCTYPE`.

---

### Entity expansion

Exemplo conceitual:

```text
entidade A expande B várias vezes;

B expande C várias vezes;

o documento cresce em memória.
```

Bloquear `DOCTYPE` elimina esse vetor no laboratório.

Também ativaremos secure processing e limites JAXP.

---

### XInclude

XInclude pode incluir conteúdo externo.

Desabilitaremos:

```java
factory.setXIncludeAware(false);
```

---

### Acesso externo do schema

`SchemaFactory` e `Validator` não podem buscar:

- DTD;
- XSD remoto;
- imports externos;
- arquivos arbitrários.

Properties:

```text
ACCESS_EXTERNAL_DTD = "";

ACCESS_EXTERNAL_SCHEMA = "".
```

O schema será local e autocontido.

---

### Objetos thread-safe

Não compartilhe:

- `DocumentBuilder`;
- `Validator`;
- `Transformer`.

Crie por operação.

O `Schema` pré-compilado pode ser mantido como componente imutável e usado para criar validators.

O factory configurado pode ser encapsulado, mas a implementação mais clara cria o builder por chamada.

---

### Body limit

O limite vem antes do parse.

Baseline:

```text
1 MiB.
```

Não leia um stream ilimitado inteiro para depois verificar o tamanho.

Use um bounded stream ou contador durante a leitura.

---

### Erros estáveis

Categorias internas:

```text
XmlSecurityViolationException;

XmlDocumentException;

XmlSchemaViolationException;

XmlContractViolationException.
```

Não devolva mensagens completas de parser ao caller.

Elas podem incluir trechos de payload, caminhos ou detalhes internos.

---

## Mão na massa guiada

### 1. Criar inventory-v1.xsd

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:inv="urn:legacy:inventory:v1"
    targetNamespace="urn:legacy:inventory:v1"
    elementFormDefault="qualified"
    attributeFormDefault="unqualified">

    <xs:simpleType name="ProductCodeType">
        <xs:restriction base="xs:string">
            <xs:minLength value="3"/>
            <xs:maxLength value="40"/>
            <xs:pattern value="[A-Z0-9_-]+"/>
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="WarehouseCodeType">
        <xs:restriction base="xs:string">
            <xs:minLength value="2"/>
            <xs:maxLength value="20"/>
            <xs:pattern value="[A-Z0-9_-]+"/>
        </xs:restriction>
    </xs:simpleType>

    <xs:element
        name="CheckAvailabilityRequest"
        type="inv:CheckAvailabilityRequestType"/>

    <xs:complexType
        name="CheckAvailabilityRequestType">
        <xs:sequence>
            <xs:element
                name="ProductCode"
                type="inv:ProductCodeType"/>
            <xs:element
                name="WarehouseCode"
                type="inv:WarehouseCodeType"/>
        </xs:sequence>
    </xs:complexType>
</xs:schema>
```

Amplie com response e fault.

---

### 2. Definir response no XSD

Inclua:

```text
ProductCode;

WarehouseCode;

Available;

Quantity;

ObservedAt.
```

Use:

```text
xs:boolean;

xs:nonNegativeInteger;

xs:dateTime.
```

A aplicação ainda valida limite de `int`.

---

### 3. Definir InventoryFault

Campos:

```text
Code;

Message.
```

Limite o tamanho de ambos.

Não aceite `xs:any` na baseline.

---

### 4. Calcular checksum

```powershell
$hash = (
  Get-FileHash `
    src/main/resources/contracts/soap/legacy-inventory/v1/inventory-v1.xsd `
    -Algorithm SHA256
).Hash.ToLowerInvariant()

Set-Content `
  src/main/resources/contracts/soap/legacy-inventory/v1/inventory-v1.xsd.sha256 `
  $hash `
  -Encoding utf8
```

---

### 5. Criar XmlPayloadLimits

```java
@ConfigurationProperties(
    prefix = "integrations.legacy-inventory.xml"
)
public record XmlPayloadLimits(
        DataSize maxPayloadSize
) {
    public XmlPayloadLimits {
        if (
            maxPayloadSize == null
            || maxPayloadSize.toBytes() < 1
            || maxPayloadSize.toMegabytes() > 10
        ) {
            throw new IllegalArgumentException(
                "Invalid XML payload limit"
            );
        }
    }
}
```

Profile local:

```yaml
integrations:
  legacy-inventory:
    xml:
      max-payload-size: 1MB
```

---

### 6. Criar bounded reader

```java
public byte[] readBounded(
        InputStream input,
        long maximumBytes
) {
    try (
        InputStream limited =
            new BoundedInputStream(
                input,
                maximumBytes + 1
            )
    ) {
        byte[] bytes =
                limited.readAllBytes();

        if (bytes.length > maximumBytes) {
            throw new XmlPayloadTooLargeException();
        }

        return bytes;
    }
}
```

Se não usar uma library, implemente o contador com buffer fixo.

Não confie em `Content-Length`.

---

### 7. Criar SecureXmlFactories

```java
@Component
public class SecureXmlFactories {

    DocumentBuilder newDocumentBuilder() {
        try {
            DocumentBuilderFactory factory =
                    DocumentBuilderFactory
                        .newInstance();

            factory.setNamespaceAware(true);
            factory.setXIncludeAware(false);
            factory.setExpandEntityReferences(false);

            factory.setFeature(
                XMLConstants.FEATURE_SECURE_PROCESSING,
                true
            );

            factory.setFeature(
                "http://apache.org/xml/features/disallow-doctype-decl",
                true
            );

            factory.setFeature(
                "http://xml.org/sax/features/external-general-entities",
                false
            );

            factory.setFeature(
                "http://xml.org/sax/features/external-parameter-entities",
                false
            );

            factory.setFeature(
                "http://apache.org/xml/features/nonvalidating/load-external-dtd",
                false
            );

            factory.setAttribute(
                XMLConstants.ACCESS_EXTERNAL_DTD,
                ""
            );

            factory.setAttribute(
                XMLConstants.ACCESS_EXTERNAL_SCHEMA,
                ""
            );

            DocumentBuilder builder =
                    factory.newDocumentBuilder();

            builder.setEntityResolver(
                (publicId, systemId) -> {
                    throw new SAXException(
                        "External entities are forbidden"
                    );
                }
            );

            return builder;
        }
        catch (
            ParserConfigurationException exception
        ) {
            throw new IllegalStateException(
                "Secure XML parser is unavailable",
                exception
            );
        }
    }
}
```

Se uma feature de segurança não for suportada, o startup deve falhar.

---

### 8. Criar parser

```java
public Document parse(
        byte[] xml
) {
    try (
        ByteArrayInputStream input =
            new ByteArrayInputStream(xml)
    ) {
        return factories
                .newDocumentBuilder()
                .parse(input);
    }
    catch (
        SAXException exception
    ) {
        throw classify(exception);
    }
    catch (
        IOException exception
    ) {
        throw new XmlDocumentException();
    }
}
```

Não inclua o XML na exception.

---

### 9. Criar SchemaFactory segura

```java
SchemaFactory factory =
        SchemaFactory.newInstance(
            XMLConstants.W3C_XML_SCHEMA_NS_URI
        );

factory.setFeature(
    XMLConstants.FEATURE_SECURE_PROCESSING,
    true
);

factory.setProperty(
    XMLConstants.ACCESS_EXTERNAL_DTD,
    ""
);

factory.setProperty(
    XMLConstants.ACCESS_EXTERNAL_SCHEMA,
    ""
);
```

Carregue o XSD de classpath.

---

### 10. Pré-compilar Schema

```java
@Bean
Schema legacyInventorySchema(
        ResourceLoader resourceLoader
) {
    Resource resource =
            resourceLoader.getResource(
                "classpath:contracts/soap/legacy-inventory/v1/inventory-v1.xsd"
            );

    try (
        InputStream input =
            resource.getInputStream()
    ) {
        StreamSource source =
                new StreamSource(input);

        source.setSystemId(
            "classpath:/contracts/soap/legacy-inventory/v1/inventory-v1.xsd"
        );

        return secureSchemaFactory()
                .newSchema(source);
    }
}
```

O `systemId` serve para diagnóstico e resolução controlada.

O schema da baseline não importa recursos externos.

---

### 11. Criar Validator por operação

```java
public void validate(
        DOMSource source
) {
    Validator validator =
            schema.newValidator();

    validator.setProperty(
        XMLConstants.ACCESS_EXTERNAL_DTD,
        ""
    );

    validator.setProperty(
        XMLConstants.ACCESS_EXTERNAL_SCHEMA,
        ""
    );

    try {
        validator.validate(source);
    }
    catch (
        SAXException exception
    ) {
        throw new XmlSchemaViolationException();
    }
    catch (
        IOException exception
    ) {
        throw new XmlDocumentException();
    }
}
```

Não compartilhe o `Validator`.

---

### 12. Ler o Envelope SOAP 1.1

Constantes:

```java
static final String SOAP_11_NS =
        "http://schemas.xmlsoap.org/soap/envelope/";

static final String INVENTORY_NS =
        "urn:legacy:inventory:v1";
```

Valide o root:

```java
Element root =
        document.getDocumentElement();

requireName(
    root,
    SOAP_11_NS,
    "Envelope"
);
```

---

### 13. Localizar Body por namespace

```java
Element body =
        directChild(
            root,
            SOAP_11_NS,
            "Body"
        );
```

Não use:

```java
getElementsByTagName("soapenv:Body")
```

O prefixo pode mudar.

---

### 14. Validar children do Envelope

Na baseline:

- no máximo um Header;
- exatamente um Body;
- nenhuma estrutura desconhecida entre eles;
- Body possui exatamente um payload ou um Fault.

Essas regras complementam o XSD do payload.

---

### 15. Detectar Fault

Antes de mapear response:

```java
Optional<Element> fault =
        directChildOptional(
            body,
            SOAP_11_NS,
            "Fault"
        );
```

Se existe Fault, use o classifier da aula 466.

Não valide Fault como `CheckAvailabilityResponse`.

---

### 16. Extrair payload

```java
Element payload =
        singleElementChild(
            body
        );

requireName(
    payload,
    INVENTORY_NS,
    "CheckAvailabilityResponse"
);
```

Passe apenas o payload para o `Validator`.

---

### 17. Validar payload com XSD

```java
schemaValidator.validate(
    new DOMSource(
        payload
    )
);
```

A ordem é:

```text
Envelope estrutural;

payload esperado;

XSD;

mapping.
```

---

### 18. Ler campos por namespace

```java
String productCode =
        requiredChildText(
            payload,
            INVENTORY_NS,
            "ProductCode"
        );
```

O helper deve exigir child direto e único.

Não use busca recursiva ampla que possa encontrar elemento em local inesperado.

---

### 19. Converter tipos

```java
int quantity =
        parseNonNegativeInt(
            requiredChildText(
                payload,
                INVENTORY_NS,
                "Quantity"
            )
        );
```

Mesmo que o XSD aceite `xs:nonNegativeInteger`, o valor pode exceder `Integer.MAX_VALUE`.

Traduza overflow para contract violation.

---

### 20. Converter timestamp

Use:

```java
OffsetDateTime.parse(value)
              .toInstant();
```

Rejeite timezone ausente se o contrato exige instante.

Não use timezone local do servidor.

---

### 21. Criar mapper interno

```java
LegacyInventoryAvailability toInternal(
        ExternalAvailabilityXml value
) {
    return new LegacyInventoryAvailability(
            new ProductCode(
                value.productCode()
            ),
            new WarehouseCode(
                value.warehouseCode()
            ),
            value.available(),
            value.quantity(),
            value.observedAt()
    );
}
```

O mapper mantém value objects internos.

---

### 22. Criar writer de request

Use DOM ou StAX para produzir o envelope.

Nunca concatene strings com valores externos.

Exemplo DOM:

```java
Document document =
        factories
            .newDocumentBuilder()
            .newDocument();

Element envelope =
        document.createElementNS(
            SOAP_11_NS,
            "soapenv:Envelope"
        );

Element body =
        document.createElementNS(
            SOAP_11_NS,
            "soapenv:Body"
        );

Element request =
        document.createElementNS(
            INVENTORY_NS,
            "inv:CheckAvailabilityRequest"
        );
```

Use `createTextNode`.

---

### 23. Criar TransformerFactory segura

```java
TransformerFactory factory =
        TransformerFactory.newInstance();

factory.setFeature(
    XMLConstants.FEATURE_SECURE_PROCESSING,
    true
);

factory.setAttribute(
    XMLConstants.ACCESS_EXTERNAL_DTD,
    ""
);

factory.setAttribute(
    XMLConstants.ACCESS_EXTERNAL_STYLESHEET,
    ""
);
```

Crie novo `Transformer` por operação.

---

### 24. Serializar UTF-8

```java
transformer.setOutputProperty(
    OutputKeys.ENCODING,
    StandardCharsets.UTF_8.name()
);

transformer.setOutputProperty(
    OutputKeys.OMIT_XML_DECLARATION,
    "no"
);
```

Não dependa do charset default do sistema.

---

### 25. Validar request produzida

Depois de criar o request:

1. parse novamente;
2. extraia payload;
3. valide contra XSD;
4. compare campos.

Isso cria um round-trip test.

---

### 26. Testar namespace com prefixo diferente

Troque:

```text
soapenv -> s;

inv -> inventory.
```

Esperado:

```text
sucesso.
```

A identidade permanece pelo namespace.

---

### 27. Testar namespace errado

Use:

```text
urn:legacy:inventory:v2.
```

Esperado:

```text
XmlContractViolationException.
```

Não aceite apenas pelo local name.

---

### 28. Testar field ausente

Remova `WarehouseCode`.

Esperado:

```text
XmlSchemaViolationException.
```

---

### 29. Testar ordem errada

Como o schema usa `xs:sequence`, inverter `ProductCode` e `WarehouseCode` deve falhar.

---

### 30. Testar quantidade negativa

Esperado:

```text
schema violation.
```

---

### 31. Testar overflow

Use valor maior que `Integer.MAX_VALUE`.

O XSD pode aceitar como nonNegativeInteger.

O mapper rejeita como contract violation.

---

### 32. Testar DOCTYPE

Use:

```xml
<!DOCTYPE root [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
```

Esperado:

```text
XmlSecurityViolationException;

nenhum acesso a arquivo.
```

Não dependa da existência do arquivo.

---

### 33. Testar entidade HTTP

A entity aponta para um servidor local contador.

Esperado:

```text
zero requests recebidas;

parsing rejeitado.
```

Isso comprova ausência de SSRF.

---

### 34. Testar entity expansion

Use fixture pequena com expansão em níveis.

Esperado:

```text
DOCTYPE rejeitado
antes da expansão.
```

---

### 35. Testar XInclude

Documento com:

```xml
<xi:include
    xmlns:xi="http://www.w3.org/2001/XInclude"
    href="file:///secret"/>
```

Esperado:

```text
nenhuma inclusão.
```

Se o elemento não pertence ao schema, a validação também falha.

---

### 36. Testar schema externo

Crie XSD de teste com import HTTP.

Esperado:

```text
SchemaFactory rejeita;

zero chamada externa.
```

A baseline produtiva usa schema autocontido.

---

### 37. Testar payload grande

Gere XML com:

```text
1 MiB + 1 byte.
```

Esperado:

```text
XmlPayloadTooLargeException;

parser não invocado.
```

Use spy na factory.

---

### 38. Testar thread safety

Execute centenas de parses concorrentes.

Cada chamada cria:

```text
DocumentBuilder;

Validator;

Transformer.
```

O `Schema` pode ser compartilhado.

Nenhum estado cruza requests.

---

### 39. Testar logs

Sentinelas:

```text
xml-secret-sentinel;

xml-password-sentinel;

xml-body-sentinel;

xml-file-path-sentinel.
```

Force parsing, validation e mapping errors.

Nenhuma sentinela aparece.

---

### 40. Criar XML_PROFILE.md

Registre:

| Item | Decisão |
|---|---|
| XML version | 1.0 |
| Encoding | UTF-8 |
| SOAP | 1.1 |
| Payload namespace | urn:legacy:inventory:v1 |
| XSD | inventory-v1.xsd |
| Max size | 1 MiB |
| DOCTYPE | forbidden |
| External DTD | forbidden |
| External schema | forbidden |
| XInclude | forbidden |
| Parser | namespace-aware DOM |

---

### 41. Criar XML_SECURITY_POLICY.md

Inclua:

- secure processing;
- features obrigatórias;
- access external vazio;
- entity resolver rejeitando;
- body limit;
- logs;
- schema local;
- fail-closed;
- startup failure se hardening não puder ser aplicado.

---

### 42. Criar XML_ERROR_MAPPING.md

| Falha | Categoria |
|---|---|
| malformado | document |
| DOCTYPE | security |
| external entity | security |
| payload grande | security/input |
| namespace errado | contract |
| XSD inválido | schema |
| overflow | contract |
| Fault SOAP | fault classifier |
| I/O local | document/internal |

---

### 43. Criar XML_RUNBOOK.md

Perguntas:

- tamanho do body;
- charset;
- XML version;
- namespace do Envelope;
- namespace do payload;
- local name;
- XSD checksum;
- DOCTYPE presente;
- external access bloqueado;
- field ausente;
- ordem errada;
- overflow;
- Fault presente;
- deploy recente;
- contrato mudou;
- logs sanitizados.

---

### 44. Atualizar readiness SOAP

Marque como concluído:

```text
XML profile;

XSD;

checksum;

body limit;

parser hardening;

namespace validation;

schema validation;

attack tests.
```

Permanece pendente:

```text
generated classes;

client SOAP;

WS-Security;

mTLS;

provider integration.
```

Status:

```text
NO-GO.
```

---

### 45. Executar testes focados

```powershell
.\mvnw.cmd `
  -Dtest=XmlWellFormednessTest,XmlNamespaceTest,InventoryXsdValidationTest,SecureDocumentBuilderFactoryTest,XmlDoctypeRejectionTest,XmlExternalEntityRejectionTest,XmlEntityExpansionRejectionTest,XmlExternalSchemaAccessTest,XmlBodyLimitTest,Soap11EnvelopeReaderTest,LegacyInventoryXmlCodecTest,XmlSerializationRoundTripTest,XmlThreadSafetyTest,XmlLoggingSecurityTest,XmlProductionReadinessTest `
  test
```

---

### 46. Executar gate

```powershell
.\mvnw.cmd clean verify
```

Confirme:

- checksum;
- parser secure;
- schema secure;
- namespaces;
- samples;
- attacks;
- serialization;
- thread safety;
- logs;
- readiness.

---

### 47. Registrar limitações

Ainda faltam:

```text
JAXB generation;

WebServiceTemplate;

WS-Security;

mTLS;

integration server;

transport metrics;

fault real;

load test;

certificate rotation.
```

---

## Entendendo o que foi feito

### XML deixou de ser apenas texto

Elementos, atributos, namespaces, schema e encoding passaram a ser parte do contrato.

### Bem-formado e válido ficaram separados

Parser e XSD possuem responsabilidades distintas.

### Namespace ganhou identidade correta

Prefixos podem variar sem quebrar a integração.

### XSD passou a proteger a estrutura

Fields, ordem, tipos e padrões ficaram verificáveis.

### O parser ficou fail-closed

DOCTYPE, entidades e acesso externo foram bloqueados.

### O limite veio antes do parse

Documentos grandes não ocupam a árvore DOM.

### Schema e objetos de execução foram separados

Schema é pré-compilado; Validator, Builder e Transformer são criados por operação.

### O domínio continuou independente

O codec XML termina na infraestrutura e produz modelos internos.

### Produção continuou bloqueada

O client SOAP e a segurança real ainda faltam.

---

## Erros comuns importantes

### Validar somente se o XML abre

Documento bem formado pode violar o contrato.

### Comparar prefixos

O parceiro pode trocar `inv` por outro alias.

### Habilitar namespaceAware depois do parse

A árvore já foi criada incorretamente.

### Permitir DOCTYPE porque o XSD valida

O ataque ocorre antes ou durante o parse.

### Bloquear entity, mas permitir XInclude

Outra forma de inclusão permanece.

### Validar tamanho depois de readAllBytes ilimitado

A memória já foi consumida.

### Compartilhar DocumentBuilder

O objeto não deve ser usado concorrentemente.

### Compartilhar Validator

Estado de validação pode cruzar chamadas.

### Permitir schema remoto

Build e runtime dependem da rede e abrem superfície de ataque.

### Logar SAXException completa

A mensagem pode conter conteúdo e paths internos.

---

## Comandos úteis

### Checksum do XSD

```powershell
Get-FileHash `
  src/main/resources/contracts/soap/legacy-inventory/v1/inventory-v1.xsd `
  -Algorithm SHA256
```

### Procurar parsing inseguro

```powershell
git grep `
  -n `
  -E `
  "DocumentBuilderFactory|SAXParserFactory|XMLInputFactory|SchemaFactory|TransformerFactory|DOCTYPE|setExpandEntityReferences"
```

### Testes de segurança

```powershell
.\mvnw.cmd `
  -Dtest=XmlDoctypeRejectionTest,XmlExternalEntityRejectionTest,XmlEntityExpansionRejectionTest,XmlExternalSchemaAccessTest,XmlBodyLimitTest `
  test
```

### Testes de contrato

```powershell
.\mvnw.cmd `
  -Dtest=XmlNamespaceTest,InventoryXsdValidationTest,Soap11EnvelopeReaderTest,LegacyInventoryXmlCodecTest `
  test
```

### Gate

```powershell
.\mvnw.cmd clean verify
```

---

## Exercício guiado

### Parte 1 — Estrutura

Crie XML bem formado.

### Parte 2 — Namespace

Use namespace URI e prefixos alternativos.

### Parte 3 — XSD

Defina request, response e Fault.

### Parte 4 — Limites

Implemente leitura bounded.

### Parte 5 — Hardening

Configure parser e schema fail-closed.

### Parte 6 — Envelope

Extraia Header, Body, Fault e payload.

### Parte 7 — Mapping

Converta response em modelo interno.

### Parte 8 — Writer

Produza request sem concatenar strings.

### Parte 9 — Ataques

Teste XXE, expansion, XInclude e schema externo.

### Parte 10 — Gate

Atualize readiness mantendo NO-GO.

---

## Critérios de aceite

- arquivo, H1, número, módulo e ponte seguem a grade;
- continuidade com a aula 466 foi preservada;
- XML bem formado foi explicado;
- XML válido foi explicado;
- declaração e UTF-8 foram explicados;
- elementos foram explicados;
- atributos foram explicados;
- namespace foi explicado;
- namespace default foi explicado;
- attributes sem namespace foram diferenciados;
- XSD foi criado;
- target namespace foi definido;
- element form qualified foi definido;
- tipos simples foram criados;
- tipos complexos foram criados;
- sequence foi usada;
- cardinalidade foi explicada;
- XSD não foi tratado como regra de negócio completa;
- DOM, SAX e StAX foram comparados;
- JAXB foi contextualizado;
- body limit foi aplicado antes do parse;
- parser namespace-aware foi criado;
- secure processing foi ativado;
- DOCTYPE foi proibido;
- external general entities foram proibidas;
- external parameter entities foram proibidas;
- external DTD loading foi proibido;
- XInclude foi desabilitado;
- entity expansion foi desabilitada;
- ACCESS_EXTERNAL_DTD ficou vazio;
- ACCESS_EXTERNAL_SCHEMA ficou vazio;
- entity resolver rejeita acesso;
- startup falha sem hardening;
- SchemaFactory segura foi criada;
- Schema foi pré-compilado;
- Validator é criado por operação;
- DocumentBuilder é criado por operação;
- Transformer é criado por operação;
- Envelope SOAP 1.1 foi validado;
- Body foi localizado por namespace;
- Fault foi diferenciado de response;
- payload foi extraído;
- payload foi validado com XSD;
- child direto e único foi exigido;
- overflow foi tratado;
- timestamp foi convertido para Instant;
- mapper interno foi criado;
- writer não concatena XML;
- serialização usa UTF-8;
- round-trip foi testado;
- prefixo alternativo foi testado;
- namespace errado foi rejeitado;
- field ausente foi rejeitado;
- ordem errada foi rejeitada;
- quantidade negativa foi rejeitada;
- DOCTYPE foi testado;
- entity HTTP não gerou request;
- entity expansion foi testada;
- XInclude foi testado;
- schema externo foi bloqueado;
- payload acima do limite foi rejeitado antes do parser;
- thread safety foi testada;
- logs foram sanitizados;
- readiness foi atualizada;
- client SOAP não foi antecipado;
- produção pública permaneceu NO-GO;
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
  "DOCTYPE|SYSTEM|PUBLIC|DocumentBuilderFactory|SchemaFactory|ACCESS_EXTERNAL|setXIncludeAware|setExpandEntityReferences"
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
git commit -m "feat(m16): validar XML com parser seguro e XSD"
```

Valide:

```powershell
git log -1 --oneline
git status --short
```

Não inclua:

- XML real;
- credentials;
- endpoint real;
- DTD;
- schema remoto;
- parser permissivo;
- generated classes manuais;
- client SOAP incompleto;
- payload de ataque fora de tests;
- report temporário.

---

## Fechamento e ponte para a próxima aula

Nesta aula, o laboratório transformou XML em uma fronteira contratual e segura.

A sequência ficou:

```text
body limitado;

parser hardened;

Envelope;

Body;

Fault ou payload;

namespace;

XSD;

mapping;

modelo interno.
```

O contrato recebeu:

```text
inventory-v1.xsd;

checksum;

samples válidos;

samples inválidos;

fixtures de segurança.
```

A principal decisão foi:

```text
nenhum XML externo
é interpretado
antes de limite,
hardening
e validação.
```

Também ficou comprovado que:

- bem-formado não significa válido;
- prefixo não define namespace;
- XSD não substitui regra de negócio;
- `DOCTYPE` não é necessário no contrato;
- entidades externas não devem ser resolvidas;
- schema externo não deve ser buscado;
- body limit precisa vir antes do DOM;
- objetos de parse e validação não devem ser compartilhados;
- o mapper protege o domínio do contrato externo.

A integração SOAP ainda permanece `NO-GO`, porque faltam client, geração, WS-Security, mTLS e integração real.

A próxima aula será:

```text
468 - M16.13 - CSV e arquivos de integracao
```

Nela, você irá:

- compreender contratos baseados em arquivos;
- definir encoding, delimitador e header;
- tratar escaping e aspas;
- impedir CSV injection;
- validar colunas e linhas;
- processar arquivos grandes em streaming;
- criar arquivo de rejeições;
- garantir idempotência por checksum;
- preparar transporte por SFTP.

---

# Material complementar

## Checkpoint final

- [ ] Criei e versionei o XSD.
- [ ] Configurei parser e validator seguros.
- [ ] Bloqueei XXE e acesso externo.
- [ ] Li e produzi envelopes por namespace.
- [ ] Mantive o client SOAP para depois.

---

## Troubleshooting adicional

### XML válido falha por namespace

Confirme `targetNamespace`, `elementFormDefault` e namespace do elemento.

### Prefixo diferente falha

O código pode estar comparando `nodeName` em vez de namespace e local name.

### XSD tenta buscar a internet

Existe import externo ou `ACCESS_EXTERNAL_SCHEMA` não está vazio.

### DOCTYPE ainda é aceito

A feature `disallow-doctype-decl` não foi aplicada ao factory usado.

### Teste XXE não detecta acesso

Use servidor local contador, não arquivo dependente do sistema.

### Payload grande chega ao parser

A leitura bounded está depois do `readAllBytes`.

### Validação funciona em sequência e falha concorrente

Um `Validator` ou `DocumentBuilder` pode estar compartilhado.

### Response válida vira Fault

O reader localizou elemento por local name sem conferir namespace.

### Timestamp muda de timezone

Use `OffsetDateTime` e converta para `Instant`.

### A equipe quer liberar SOAP

O readiness ainda possui client, WS-Security, mTLS e integração pendentes.

---

## Perguntas de revisão

1. O que é XML bem formado?
2. O que é XML válido?
3. Prefixo define namespace?
4. O que forma o nome expandido?
5. Atributo herda namespace default?
6. O que o XSD valida?
7. XSD valida todas as regras de negócio?
8. Quando usar DOM?
9. Quando usar SAX ou StAX?
10. O que é XXE?
11. Por que bloquear DOCTYPE?
12. O que é XInclude?
13. Quando aplicar body limit?
14. Schema pode buscar XSD remoto?
15. DocumentBuilder pode ser compartilhado?
16. Validator pode ser compartilhado?
17. O que pode ser pré-compilado?
18. Como localizar SOAP Body?
19. Qual é a próxima aula?
20. Qual será o foco?

---

## Roteiro de resposta

1. Obedece à sintaxe XML.
2. Também atende ao schema.
3. Não.
4. Namespace URI e local name.
5. Não.
6. Estrutura, tipos e cardinalidade.
7. Não.
8. Documentos pequenos e navegação.
9. Streaming e arquivos grandes.
10. Resolução de entidade externa.
11. Evitar XXE e expansão.
12. Inclusão de conteúdo XML.
13. Antes do parse.
14. Não na baseline.
15. Não.
16. Não.
17. `Schema`.
18. Namespace e local name.
19. CSV e arquivos de integração.
20. Contratos tabulares, streaming e segurança.

---

## Desafio opcional

Implemente um reader StAX seguro para extrair somente:

```text
ProductCode;

WarehouseCode;

Available;

Quantity;

ObservedAt.
```

Requisitos:

- `SUPPORT_DTD=false`;
- external entities desabilitadas;
- limite de payload;
- namespace-aware;
- ordem validada;
- fields únicos;
- nenhum acesso externo;
- mesmos resultados do codec DOM.

Compare legibilidade, memória e complexidade.

---

## Atualização do diário de bordo

Adicione ao `docs/diario-de-bordo.md`:

```markdown
### Aula 467 - M16.12 - XML

- Diferenciei XML bem formado e XML válido.
- Estudei declaração XML, encoding, elementos e atributos.
- Entendi namespace URI, prefixo e local name.
- Diferenciei namespace default de atributos sem prefixo.
- Criei `inventory-v1.xsd`.
- Defini target namespace e `elementFormDefault=qualified`.
- Criei tipos simples e complexos.
- Usei sequence, cardinalidade, pattern e tipos nativos.
- Mantive regras de negócio fora do XSD.
- Comparei DOM, SAX, StAX e JAXB.
- Criei limite de payload de 1 MiB.
- Implementei leitura bounded antes do parser.
- Criei `SecureXmlFactories`.
- Ativei secure processing.
- Proibi DOCTYPE.
- Desabilitei entidades externas e DTD externo.
- Desabilitei XInclude e entity expansion.
- Bloqueei `ACCESS_EXTERNAL_DTD` e `ACCESS_EXTERNAL_SCHEMA`.
- Criei entity resolver fail-closed.
- Configurei SchemaFactory segura.
- Pré-compilei o `Schema`.
- Criei Validator, DocumentBuilder e Transformer por operação.
- Li Envelope SOAP 1.1 por namespace.
- Localizei Body sem depender de prefixo.
- Diferenciei Fault e response.
- Extraí e validei payload com XSD.
- Exigi children diretos e únicos.
- Tratei overflow e timestamp.
- Mapeei XML para modelos internos.
- Produzi request XML sem concatenar strings.
- Serializei em UTF-8.
- Testei round-trip.
- Testei prefixos alternativos e namespace errado.
- Testei field ausente, ordem errada e quantity inválida.
- Testei DOCTYPE, XXE, entity expansion e XInclude.
- Comprovei zero acesso externo.
- Testei schema remoto bloqueado.
- Testei payload grande antes do parser.
- Testei concorrência e thread safety.
- Criei logs sanitizados.
- Criei XML profile, security policy, schema catalog, error mapping e runbook.
- Atualizei SOAP readiness.
- Mantive client SOAP e produção como NO-GO.
- Próxima aula: CSV e arquivos de integracao.
```

---

## Referência técnica curta

- [Oracle — JAXP Security Guide](https://docs.oracle.com/en/java/javase/24/security/java-api-xml-processing-jaxp-security-guide.html)
- [Java — XMLConstants](https://docs.oracle.com/en/java/javase/22/docs/api/java.xml/javax/xml/XMLConstants.html)
- [W3C — Namespaces in XML](https://www.w3.org/TR/xml-names/)
- [W3C — XML Schema Structures](https://www.w3.org/TR/xmlschema-1/)
- [W3C — XML Schema 1.1](https://www.w3.org/TR/xmlschema11-1/)
- [Spring Web Services Reference](https://docs.spring.io/spring-ws/docs/current/reference/html/)

Regra final:

```text
XML externo deve ser tratado como entrada hostil e contrato formal: o body é limitado antes da leitura completa, o parser é namespace-aware e fail-closed, secure processing é ativado, DOCTYPE, entidades externas, DTD externo, XInclude e acesso externo a schemas são bloqueados, o Envelope SOAP é navegado por namespace URI e local name, o payload é validado por XSD local e versionado, Schema pode ser pré-compilado mas Validator, DocumentBuilder e Transformer são criados por operação, o mapper converte apenas dados validados em modelos internos e testes comprovam namespace, tamanho, XXE, expansão, schema externo, serialização, concorrência e ausência de vazamentos.
```
