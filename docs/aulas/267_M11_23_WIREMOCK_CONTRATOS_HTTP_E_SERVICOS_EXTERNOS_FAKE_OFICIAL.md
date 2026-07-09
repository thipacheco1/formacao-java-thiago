# 267 — M11.23 — WireMock, contratos HTTP e serviços externos fake

## 1. Objetivo da aula

Na aula 266, você estudou Testcontainers com PostgreSQL.

Você viu:

```text
teste unitário;
teste de integração;
limites de mock;
PostgreSQL real em teste;
container descartável;
@Testcontainers;
@Container;
PostgreSQLContainer;
JDBC URL dinâmica;
DataSource;
repository JDBC;
execução local;
execução no GitHub Actions.
```

Agora vamos estudar outro tipo de integração muito comum em backend:

```text
serviços HTTP externos.
```

Em sistemas reais, uma API Java raramente vive isolada.

Ela pode precisar chamar:

```text
API de CEP;
API de pagamento;
API de antifraude;
API de autenticação;
API de logística;
API de emissão fiscal;
API de parceiro;
API de mensageria;
API de consulta cadastral;
API interna de outro time.
```

O problema é:

```text
não é saudável testar seu código chamando serviços externos reais o tempo todo.
```

Serviços externos podem estar:

```text
fora do ar;
lentos;
instáveis;
com limite de requisições;
com custo por chamada;
com dados sensíveis;
com comportamento imprevisível;
com ambiente de homologação indisponível;
com contrato mudando.
```

Nesta aula, vamos aprender a usar:

```text
WireMock.
```

WireMock permite simular APIs HTTP.

Com ele, você cria um servidor fake durante o teste, define stubs e valida se seu código fez a chamada correta.

Ao final desta aula, você deve conseguir:

```text
entender o problema que WireMock resolve;
diferenciar mock de objeto, fake HTTP e serviço externo real;
entender o que é stub HTTP;
entender o que é contrato HTTP;
configurar WireMock com JUnit 5;
subir WireMock em porta dinâmica;
criar stub para GET;
criar stub com path e query parameter;
retornar JSON fake;
testar cliente HTTP Java usando HttpClient;
validar status code;
validar body;
validar request enviada;
simular erro 404;
simular erro 500;
simular timeout ou delay;
entender quando usar WireMock;
entender quando não usar WireMock;
integrar WireMock ao GitHub Actions;
preparar base para integrações HTTP, contratos e resiliência.
```

Esta aula continua o M11.

Ainda não vamos para Spring Boot.

Ainda não vamos iniciar SQL completo.

Ainda não vamos para ArchUnit.

A próxima aula será:

```text
268 — ArchUnit: regras arquiteturais automatizadas e proteção de camadas
```

---

## 2. Onde estamos na formação

Estamos no módulo:

```text
M11 — Ferramentas essenciais do Java Backend profissional
```

A sequência atual é:

```text
260 — Docker Compose profissional com PostgreSQL, Redis, redes, volumes e healthcheck
261 — CI/CD, GitHub Actions e pipeline Java Backend: conceitos, workflow e gatilhos
262 — Pipeline Maven com testes, JaCoCo, relatórios e artefatos
263 — Pipeline Docker: build, tags, registry, secrets e imagem versionada
264 — Checkstyle, Spotless e formatação automatizada com critério
265 — Segurança de dependências: SCA, SBOM, Dependabot e supply chain
266 — Testcontainers com PostgreSQL
267 — WireMock, contratos HTTP e serviços externos fake
268 — ArchUnit
269 — Mini-projeto ferramentas
270 — Fechamento do M11
```

A aula 266 ensinou a testar integração com infraestrutura real usando container.

A aula 267 ensina a testar integração HTTP sem depender de API externa real.

A diferença é importante:

```text
Testcontainers:
sobe infraestrutura real em container.

WireMock:
sobe servidor HTTP fake para simular API externa.
```

Os dois aumentam a confiabilidade dos testes.

Mas resolvem problemas diferentes.

---

## 3. O que vamos construir

Vamos criar o laboratório:

```text
labs/m11/aula-267-wiremock-servicos-externos
```

E o workflow:

```text
.github/workflows/aula-267-wiremock.yml
```

A estrutura será:

```text
.github
└── workflows
    └── aula-267-wiremock.yml

labs
└── m11
    └── aula-267-wiremock-servicos-externos
        ├── pom.xml
        └── src
            ├── main
            │   └── java
            │       └── br
            │           └── com
            │               └── curso
            │                   └── aula267
            │                       ├── CepClienteHttp.java
            │                       ├── ConsultaCepException.java
            │                       └── Endereco.java
            └── test
                └── java
                    └── br
                        └── com
                            └── curso
                                └── aula267
                                    └── CepClienteHttpTest.java
```

Vamos criar um cliente HTTP simples que consulta uma API fake de CEP.

A regra será:

```text
GET /cep/{cep}
```

Resposta de sucesso:

```json
{
  "cep": "06454000",
  "cidade": "Barueri",
  "estado": "SP"
}
```

O teste com WireMock vai validar:

```text
quando API externa retorna 200, o cliente monta Endereco;
quando API externa retorna 404, o cliente lança exceção;
quando API externa retorna 500, o cliente lança exceção;
quando API externa demora demais, o cliente trata timeout;
se o cliente chamou a URL correta;
se enviou header esperado.
```

Vamos usar Java puro com:

```text
java.net.http.HttpClient
```

Sem Spring Boot.

Isso mantém a ordem da formação.

---

## 4. Conceitos essenciais antes da prática

### 4.1 O problema de chamar API externa real em teste

Imagine que seu teste chama uma API real de CEP.

Problemas possíveis:

```text
internet cai;
API fica fora do ar;
API muda resposta;
API limita requisições;
API cobra por chamada;
API demora;
API retorna dados diferentes;
API bloqueia seu IP;
teste fica instável;
pipeline fica vermelho sem culpa do seu código.
```

Um teste automatizado precisa ser:

```text
confiável;
rápido;
repetível;
controlado;
diagnosticável.
```

Chamar API externa real em todo teste quebra esses princípios.

---

### 4.2 O que é WireMock

WireMock é uma ferramenta para simular APIs HTTP.

Ele permite criar respostas fake para requests HTTP.

A documentação oficial descreve WireMock como uma ferramenta para API mocking, capaz de criar ambientes estáveis e previsíveis quando você depende de APIs externas.

Com WireMock, você diz:

```text
quando receber GET /cep/06454000,
responda status 200 com JSON X.
```

Ou:

```text
quando receber GET /cep/00000000,
responda status 404.
```

Ou:

```text
quando receber GET /cep/99999999,
demore 2 segundos e responda 500.
```

Isso permite testar seu cliente HTTP sem depender do serviço real.

---

### 4.3 Mock de objeto vs WireMock

Mock de objeto é algo como Mockito.

Exemplo:

```java
when(cliente.buscarCep("06454000")).thenReturn(endereco);
```

Isso não testa HTTP.

Isso testa apenas a classe que usa o cliente.

WireMock testa outra coisa:

```text
seu código realmente monta request HTTP;
chama o path correto;
envia query param correto;
envia header correto;
interpreta status code;
interpreta body;
lida com erro;
lida com timeout.
```

Resumo:

```text
Mockito:
substitui objeto Java.

WireMock:
simula servidor HTTP.
```

Ambos são úteis.

Mas têm objetivos diferentes.

---

### 4.4 O que é stub HTTP

Stub é uma resposta programada.

Exemplo:

```text
Request esperada:
GET /cep/06454000

Response programada:
200 OK
Content-Type: application/json
Body: {"cep":"06454000","cidade":"Barueri","estado":"SP"}
```

Você programa o comportamento do servidor fake.

O teste passa a ser previsível.

---

### 4.5 O que é contrato HTTP

Contrato HTTP é o acordo entre cliente e servidor.

Ele envolve:

```text
método HTTP;
path;
query parameters;
headers;
status code;
body;
schema do JSON;
campos obrigatórios;
campos opcionais;
erros possíveis;
timeout esperado.
```

Exemplo de contrato:

```text
GET /cep/{cep}

200:
{
  "cep": string,
  "cidade": string,
  "estado": string
}

404:
{
  "erro": "CEP_NAO_ENCONTRADO"
}
```

WireMock ajuda a testar se o seu cliente respeita esse contrato.

Ele não substitui documentação formal como OpenAPI, mas ajuda muito nos testes.

---

### 4.6 Porta dinâmica

Assim como Testcontainers, WireMock pode subir em porta dinâmica.

Não queremos fixar:

```text
8080
```

porque pode estar ocupada.

Com WireMock JUnit 5, podemos usar:

```java
@WireMockTest
```

e receber:

```java
WireMockRuntimeInfo
```

para descobrir a URL do servidor fake.

Exemplo:

```java
wmRuntimeInfo.getHttpBaseUrl()
```

Isso evita conflito de porta.

---

### 4.7 Verificação de request

WireMock não apenas responde.

Ele também permite verificar se uma chamada aconteceu.

Exemplo:

```java
verify(getRequestedFor(urlEqualTo("/cep/06454000")));
```

Isso prova que seu cliente chamou o endpoint certo.

Você também pode verificar headers:

```java
verify(getRequestedFor(urlEqualTo("/cep/06454000"))
        .withHeader("Accept", equalTo("application/json")));
```

Esse ponto é muito importante.

Você testa não só a resposta.

Você testa a request enviada.

---

### 4.8 Quando usar WireMock

Use WireMock quando quiser testar código que chama HTTP.

Exemplos:

```text
cliente de API externa;
integração com parceiro;
consulta de CEP;
pagamento;
antifraude;
logística;
mensageria HTTP;
webhook;
serviço interno de outro time;
API de autorização;
API de catálogo.
```

WireMock é ótimo para testar:

```text
status 200;
status 400;
status 401;
status 404;
status 409;
status 422;
status 500;
timeout;
delay;
body inesperado;
header obrigatório;
query parameter;
retry;
fallback.
```

---

### 4.9 Quando não usar WireMock

Não use WireMock para testar:

```text
cálculo puro;
validação sem HTTP;
método simples;
regra isolada;
comportamento que poderia ser teste unitário.
```

Também não use WireMock como desculpa para nunca testar contrato real.

Em ambientes maduros, você pode ter:

```text
teste unitário;
teste com WireMock;
contract testing;
teste de integração em ambiente controlado;
monitoramento em produção.
```

Cada camada tem papel.

---

### 4.10 WireMock não garante que a API real nunca vai mudar

WireMock simula o contrato que você conhece.

Se a API real mudar e você não atualizar o stub, seu teste pode continuar verde.

Por isso, em projetos avançados, WireMock pode ser combinado com:

```text
OpenAPI;
contract testing;
Pact;
testes de contrato;
validação de schema;
monitoramento de integração real;
ambiente sandbox do fornecedor.
```

Nesta aula, vamos aprender a base.

---

## 5. Laboratório guiado passo a passo

### 5.1 Criar a pasta do laboratório

A partir da raiz do repositório:

```powershell
mkdir labs\m11\aula-267-wiremock-servicos-externos
cd labs\m11\aula-267-wiremock-servicos-externos

mkdir src\main\java\br\com\curso\aula267
mkdir src\test\java\br\com\curso\aula267
```

No Linux/macOS:

```bash
mkdir -p labs/m11/aula-267-wiremock-servicos-externos/src/main/java/br/com/curso/aula267
mkdir -p labs/m11/aula-267-wiremock-servicos-externos/src/test/java/br/com/curso/aula267
cd labs/m11/aula-267-wiremock-servicos-externos
```

---

### 5.2 Criar o pom.xml

Crie:

```text
pom.xml
```

Conteúdo:

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>br.com.curso</groupId>
    <artifactId>aula-267-wiremock-servicos-externos</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>
        <wiremock.version>3.13.2</wiremock.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.wiremock</groupId>
            <artifactId>wiremock</artifactId>
            <version>${wiremock.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <version>${assertj.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <finalName>aula-267-wiremock-servicos-externos</finalName>

        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.13.0</version>
                <configuration>
                    <release>21</release>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.5</version>
            </plugin>
        </plugins>
    </build>
</project>
```

Observação:

```text
A documentação oficial de download do WireMock indica a dependência org.wiremock:wiremock na linha 3.x e, no momento da consulta, usa a versão 3.13.2 como exemplo para testes Maven.
```

Em projeto real, confirme a versão mais adequada no Maven Central antes de atualizar.

---

### 5.3 Criar o record Endereco

Crie:

```text
src/main/java/br/com/curso/aula267/Endereco.java
```

Conteúdo:

```java
package br.com.curso.aula267;

import java.util.Objects;

public record Endereco(
        String cep,
        String cidade,
        String estado
) {
    public Endereco {
        Objects.requireNonNull(cep, "cep não pode ser nulo");
        Objects.requireNonNull(cidade, "cidade não pode ser nula");
        Objects.requireNonNull(estado, "estado não pode ser nulo");

        if (cep.isBlank()) {
            throw new IllegalArgumentException("cep não pode ser vazio");
        }

        if (cidade.isBlank()) {
            throw new IllegalArgumentException("cidade não pode ser vazia");
        }

        if (estado.isBlank()) {
            throw new IllegalArgumentException("estado não pode ser vazio");
        }
    }
}
```

Esse record representa a resposta interpretada pelo cliente.

---

### 5.4 Criar exceção de consulta

Crie:

```text
src/main/java/br/com/curso/aula267/ConsultaCepException.java
```

Conteúdo:

```java
package br.com.curso.aula267;

public class ConsultaCepException extends RuntimeException {

    public ConsultaCepException(String mensagem) {
        super(mensagem);
    }

    public ConsultaCepException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

Essa exceção será lançada quando a chamada HTTP falhar ou retornar status inesperado.

---

### 5.5 Criar cliente HTTP com Java HttpClient

Crie:

```text
src/main/java/br/com/curso/aula267/CepClienteHttp.java
```

Conteúdo:

```java
package br.com.curso.aula267;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

public class CepClienteHttp {

    private final HttpClient httpClient;
    private final URI baseUri;

    public CepClienteHttp(URI baseUri) {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(500))
                .build();
        this.baseUri = baseUri;
    }

    public Endereco buscarPorCep(String cep) {
        String cepTratado = validarCep(cep);
        URI uri = baseUri.resolve("/cep/" + encode(cepTratado));

        HttpRequest request = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofMillis(800))
                .header("Accept", "application/json")
                .GET()
                .build();

        try {
            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            return tratarResposta(cepTratado, response);
        } catch (IOException exception) {
            throw new ConsultaCepException("Erro de comunicação ao consultar CEP", exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ConsultaCepException("Consulta de CEP foi interrompida", exception);
        }
    }

    private Endereco tratarResposta(String cep, HttpResponse<String> response) {
        int status = response.statusCode();

        if (status == 200) {
            return parseEndereco(response.body());
        }

        if (status == 404) {
            throw new ConsultaCepException("CEP não encontrado: " + cep);
        }

        throw new ConsultaCepException("Erro ao consultar CEP. Status HTTP: " + status);
    }

    private String validarCep(String cep) {
        if (cep == null || cep.isBlank()) {
            throw new IllegalArgumentException("cep não pode ser vazio");
        }

        return cep.trim();
    }

    private String encode(String valor) {
        return URLEncoder.encode(valor, StandardCharsets.UTF_8);
    }

    private Endereco parseEndereco(String json) {
        String cep = extrairCampo(json, "cep");
        String cidade = extrairCampo(json, "cidade");
        String estado = extrairCampo(json, "estado");

        return new Endereco(cep, cidade, estado);
    }

    private String extrairCampo(String json, String campo) {
        String marcador = "\"" + campo + "\":\"";
        int inicio = json.indexOf(marcador);

        if (inicio < 0) {
            throw new ConsultaCepException("Campo ausente na resposta: " + campo);
        }

        int inicioValor = inicio + marcador.length();
        int fimValor = json.indexOf("\"", inicioValor);

        if (fimValor < 0) {
            throw new ConsultaCepException("Campo inválido na resposta: " + campo);
        }

        return json.substring(inicioValor, fimValor);
    }
}
```

Observação importante:

```text
Neste laboratório, fizemos parsing simples de JSON para evitar introduzir Jackson antes da hora.
```

Em projeto real, você provavelmente usaria:

```text
Jackson;
Json-B;
Gson;
cliente HTTP da stack;
DTOs;
validação de schema.
```

Mas aqui o foco é WireMock e integração HTTP fake.

---

### 5.6 Criar testes com WireMock

Crie:

```text
src/test/java/br/com/curso/aula267/CepClienteHttpTest.java
```

Conteúdo:

```java
package br.com.curso.aula267;

import com.github.tomakehurst.wiremock.junit5.WireMockRuntimeInfo;
import com.github.tomakehurst.wiremock.junit5.WireMockTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.time.Duration;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@WireMockTest
@DisplayName("CepClienteHttp com WireMock")
class CepClienteHttpTest {

    @Test
    @DisplayName("deve consultar endereço por CEP com sucesso")
    void deveConsultarEnderecoPorCepComSucesso(WireMockRuntimeInfo wireMock) {
        stubFor(get(urlEqualTo("/cep/06454000"))
                .willReturn(okJson("""
                        {
                          "cep": "06454000",
                          "cidade": "Barueri",
                          "estado": "SP"
                        }
                        """)));

        CepClienteHttp cliente = new CepClienteHttp(URI.create(wireMock.getHttpBaseUrl()));

        Endereco endereco = cliente.buscarPorCep("06454000");

        assertThat(endereco.cep()).isEqualTo("06454000");
        assertThat(endereco.cidade()).isEqualTo("Barueri");
        assertThat(endereco.estado()).isEqualTo("SP");

        verify(getRequestedFor(urlEqualTo("/cep/06454000"))
                .withHeader("Accept", equalTo("application/json")));
    }

    @Test
    @DisplayName("deve tratar CEP não encontrado")
    void deveTratarCepNaoEncontrado(WireMockRuntimeInfo wireMock) {
        stubFor(get(urlEqualTo("/cep/00000000"))
                .willReturn(notFound()
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                                {
                                  "erro": "CEP_NAO_ENCONTRADO"
                                }
                                """)));

        CepClienteHttp cliente = new CepClienteHttp(URI.create(wireMock.getHttpBaseUrl()));

        assertThatThrownBy(() -> cliente.buscarPorCep("00000000"))
                .isInstanceOf(ConsultaCepException.class)
                .hasMessage("CEP não encontrado: 00000000");

        verify(getRequestedFor(urlEqualTo("/cep/00000000")));
    }

    @Test
    @DisplayName("deve tratar erro interno do serviço externo")
    void deveTratarErroInternoDoServicoExterno(WireMockRuntimeInfo wireMock) {
        stubFor(get(urlEqualTo("/cep/99999999"))
                .willReturn(serverError()
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                                {
                                  "erro": "ERRO_INTERNO"
                                }
                                """)));

        CepClienteHttp cliente = new CepClienteHttp(URI.create(wireMock.getHttpBaseUrl()));

        assertThatThrownBy(() -> cliente.buscarPorCep("99999999"))
                .isInstanceOf(ConsultaCepException.class)
                .hasMessage("Erro ao consultar CEP. Status HTTP: 500");

        verify(getRequestedFor(urlEqualTo("/cep/99999999")));
    }

    @Test
    @DisplayName("deve falhar quando resposta não tiver campo esperado")
    void deveFalharQuandoRespostaNaoTiverCampoEsperado(WireMockRuntimeInfo wireMock) {
        stubFor(get(urlEqualTo("/cep/11111111"))
                .willReturn(okJson("""
                        {
                          "cep": "11111111",
                          "cidade": "Barueri"
                        }
                        """)));

        CepClienteHttp cliente = new CepClienteHttp(URI.create(wireMock.getHttpBaseUrl()));

        assertThatThrownBy(() -> cliente.buscarPorCep("11111111"))
                .isInstanceOf(ConsultaCepException.class)
                .hasMessage("Campo ausente na resposta: estado");
    }

    @Test
    @DisplayName("deve tratar timeout de serviço externo lento")
    void deveTratarTimeoutDeServicoExternoLento(WireMockRuntimeInfo wireMock) {
        stubFor(get(urlEqualTo("/cep/22222222"))
                .willReturn(okJson("""
                        {
                          "cep": "22222222",
                          "cidade": "Lento",
                          "estado": "SP"
                        }
                        """)
                        .withFixedDelay((int) Duration.ofSeconds(2).toMillis())));

        CepClienteHttp cliente = new CepClienteHttp(URI.create(wireMock.getHttpBaseUrl()));

        assertThatThrownBy(() -> cliente.buscarPorCep("22222222"))
                .isInstanceOf(ConsultaCepException.class)
                .hasMessageContaining("Erro de comunicação ao consultar CEP");
    }

    @Test
    @DisplayName("deve rejeitar CEP vazio antes de chamar serviço externo")
    void deveRejeitarCepVazioAntesDeChamarServicoExterno(WireMockRuntimeInfo wireMock) {
        CepClienteHttp cliente = new CepClienteHttp(URI.create(wireMock.getHttpBaseUrl()));

        assertThatThrownBy(() -> cliente.buscarPorCep(" "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("cep não pode ser vazio");

        verify(0, getRequestedFor(anyUrl()));
    }
}
```

Esse teste cobre vários cenários profissionais:

```text
sucesso;
404;
500;
body inválido;
timeout;
validação local antes da chamada;
verificação da request enviada.
```

---

### 5.7 Entender o teste por partes

#### @WireMockTest

```java
@WireMockTest
```

Essa anotação inicia um servidor WireMock para o teste.

Por padrão, ele usa porta dinâmica.

A documentação oficial do WireMock explica que a extensão JUnit Jupiter simplifica a execução de uma ou mais instâncias WireMock em testes JUnit 5 e que `@WireMockTest` inicia um servidor com porta aleatória por padrão.

---

#### WireMockRuntimeInfo

```java
WireMockRuntimeInfo wireMock
```

Esse parâmetro fornece informações do servidor fake.

Usamos:

```java
wireMock.getHttpBaseUrl()
```

para montar a base URL do cliente.

Assim não precisamos saber a porta.

---

#### stubFor

```java
stubFor(get(urlEqualTo("/cep/06454000"))
        .willReturn(okJson(...)));
```

Isso registra um stub.

Em português:

```text
quando chegar GET /cep/06454000,
responda 200 com JSON.
```

---

#### verify

```java
verify(getRequestedFor(urlEqualTo("/cep/06454000")));
```

Isso valida que a request aconteceu.

Também validamos header:

```java
.withHeader("Accept", equalTo("application/json"))
```

Esse tipo de verificação é muito útil em integração HTTP.

---

#### withFixedDelay

```java
.withFixedDelay(2000)
```

Simula lentidão.

Como o cliente tem timeout menor, o teste valida comportamento de erro por timeout.

Em sistemas reais, isso é essencial para estudar:

```text
timeout;
retry;
fallback;
circuit breaker;
resiliência.
```

Esses temas voltarão em módulos futuros.

---

### 5.8 Rodar os testes localmente

Execute:

```powershell
mvn clean test
```

Resultado esperado:

```text
BUILD SUCCESS
```

Se falhar, leia o erro com calma.

Para logs mais completos:

```powershell
mvn test -DtrimStackTrace=false
```

---

### 5.9 Criar workflow para WireMock

Volte para a raiz do repositório.

No PowerShell:

```powershell
cd ..\..\..
```

Crie a pasta de workflows se necessário:

```powershell
mkdir .github
mkdir .github\workflows
```

No Linux/macOS:

```bash
mkdir -p .github/workflows
```

Crie:

```text
.github/workflows/aula-267-wiremock.yml
```

Conteúdo:

```yaml
name: Aula 267 - WireMock

on:
  push:
    branches:
      - main
      - develop
      - "feature/**"
  pull_request:
    branches:
      - main
      - develop
  workflow_dispatch:

permissions:
  contents: read

jobs:
  wiremock-tests:
    name: Testes HTTP com WireMock
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: labs/m11/aula-267-wiremock-servicos-externos

    steps:
      - name: Baixar código do repositório
        uses: actions/checkout@v4

      - name: Configurar Java 21
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      - name: Exibir versões Java e Maven
        run: |
          java -version
          mvn -version

      - name: Rodar testes com WireMock
        run: mvn -B clean test

      - name: Publicar relatórios Surefire
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: aula-267-surefire-reports
          path: labs/m11/aula-267-wiremock-servicos-externos/target/surefire-reports
          if-no-files-found: error
```

WireMock não precisa de Docker neste laboratório.

Ele sobe servidor HTTP dentro do próprio processo de teste.

Isso torna a execução rápida e simples no GitHub Actions.

---

## 6. Entendendo as decisões técnicas

### 6.1 Por que usar Java HttpClient

Usamos:

```java
java.net.http.HttpClient
```

porque ele já vem na JDK moderna.

Não precisamos adicionar Spring WebClient, RestTemplate, Feign ou Apache HttpClient agora.

Isso mantém o foco em:

```text
contrato HTTP;
request;
response;
status;
timeout;
WireMock.
```

Quando chegarmos em Spring Boot, veremos clientes HTTP mais integrados ao ecossistema.

---

### 6.2 Por que não usar Jackson nesta aula

O JSON foi interpretado com parsing simples.

Isso não é o ideal para produção.

Mas foi uma escolha didática.

Motivo:

```text
não introduzir biblioteca extra;
não transformar aula de WireMock em aula de JSON;
manter foco no fake HTTP.
```

Em projeto real, use parser JSON adequado.

Exemplos:

```text
Jackson;
Json-B;
Gson.
```

---

### 6.3 Por que validar header Accept

O teste valida:

```java
.withHeader("Accept", equalTo("application/json"))
```

Isso garante que o cliente declara o tipo de resposta esperado.

Em APIs reais, headers podem ser parte importante do contrato.

Exemplos:

```text
Authorization;
Content-Type;
Accept;
X-Correlation-Id;
X-Request-Id;
Idempotency-Key;
User-Agent.
```

WireMock permite validar esses detalhes.

---

### 6.4 Por que testar 404 e 500

Cliente HTTP profissional não testa só caminho feliz.

Ele precisa tratar:

```text
sucesso;
não encontrado;
erro do servidor;
body inválido;
timeout;
falha de rede.
```

Se você só testa 200, seu cliente pode quebrar feio em produção.

Backend real vive em ambiente imperfeito.

---

### 6.5 Por que timeout importa

Sem timeout, uma chamada HTTP pode prender uma thread por tempo demais.

Em backend, isso pode gerar:

```text
lentidão;
fila de requisições;
esgotamento de threads;
efeito cascata;
instabilidade.
```

Nesta aula, usamos timeout simples.

Mais à frente, estudaremos:

```text
retry;
fallback;
circuit breaker;
bulkhead;
resiliência.
```

---

### 6.6 Por que verificar request e não apenas response

Se o teste só olha o retorno, ele pode deixar passar erro de contrato.

Exemplo:

```text
path errado;
header ausente;
query parameter errado;
método HTTP errado.
```

Com `verify`, você valida a chamada feita.

Isso aumenta a confiança no cliente HTTP.

---

### 6.7 WireMock e contratos

WireMock pode servir como documentação viva de contrato.

Um stub mostra:

```text
qual request esperamos;
qual response simulamos;
quais erros podem ocorrer.
```

Mas cuidado:

```text
stub desatualizado vira mentira automatizada.
```

Por isso, em projetos maiores, combine com:

```text
OpenAPI;
contract testing;
Pact;
validação de schema;
ambiente sandbox;
monitoramento.
```

---

### 6.8 WireMock no pipeline

Rodar WireMock no pipeline prova que:

```text
cliente HTTP compila;
testes executam;
contratos fake funcionam;
erros são tratados;
não dependemos de internet externa;
não dependemos de API real.
```

Isso torna a esteira mais estável.

---

### 6.9 WireMock vs Testcontainers

Resumo prático:

```text
Testcontainers:
quando você precisa subir serviço real em container.

WireMock:
quando você precisa simular serviço HTTP.
```

Exemplo:

```text
PostgreSQL real:
Testcontainers.

API de CEP fake:
WireMock.

API de pagamento fake:
WireMock.

Redis real:
Testcontainers.

RabbitMQ real:
Testcontainers.
```

---

## 7. Erros comuns e troubleshooting essencial

### 7.1 Stub não encontrado

Sintoma:

```text
WireMock retorna 404 inesperado.
```

Causas:

```text
path diferente;
barra faltando;
query parameter diferente;
método HTTP errado;
stub registrado com urlEqualTo mas request tem query string.
```

Diagnóstico:

```text
confira a URL chamada pelo cliente;
confira urlEqualTo;
confira método GET/POST;
veja logs do teste.
```

Se tiver query string, talvez precise usar:

```java
urlPathEqualTo("/cep")
```

e:

```java
.withQueryParam("codigo", equalTo("06454000"))
```

---

### 7.2 Header esperado não foi enviado

Erro pode aparecer no `verify`.

Exemplo:

```text
Expected header Accept: application/json
```

Verifique se o cliente tem:

```java
.header("Accept", "application/json")
```

Headers fazem parte do contrato.

---

### 7.3 Timeout não acontece

Se o teste de timeout não falha como esperado, confira:

```text
timeout configurado no HttpRequest;
delay configurado no WireMock;
tempo do delay maior que timeout;
tipo de exceção encapsulada.
```

Nesta aula:

```text
timeout do request: 800 ms;
delay do WireMock: 2000 ms.
```

---

### 7.4 JSON com espaços quebra parser simples

Nosso parser simples procura padrão:

```text
"campo":"valor"
```

Mas o JSON usado nos testes tem espaços e quebras.

Para evitar problema em projeto real, use biblioteca JSON.

Nesta aula, se seu parser falhar por espaços, ajuste o JSON do stub para uma linha:

```json
{"cep":"06454000","cidade":"Barueri","estado":"SP"}
```

Ou evolua o parser.

Como a aula não é sobre parser JSON, a solução profissional futura será usar Jackson.

---

### 7.5 Porta fixa ocupada

Usando `@WireMockTest`, a porta é dinâmica por padrão.

Então esse problema deve ser raro.

Evite fixar porta sem necessidade.

Se fixar:

```java
@WireMockTest(httpPort = 8089)
```

pode conflitar com outro processo.

Prefira porta dinâmica.

---

### 7.6 Teste passa sozinho, mas falha com vários testes

Possíveis causas:

```text
stubs compartilhados;
estado não resetado;
verificações acumuladas;
uso incorreto de WireMock estático;
porta fixa compartilhada.
```

A documentação do WireMock informa que, por padrão, a extensão reseta stubs e requests antes de cada método de teste.

Ainda assim, mantenha testes independentes.

---

### 7.7 Cliente aponta para URL real por engano

Se o teste está chamando a API real, verifique:

```text
baseUri passada no construtor;
wireMock.getHttpBaseUrl();
configuração hardcoded;
variável de ambiente.
```

Em teste com WireMock, a base URL deve vir do WireMock.

---

## 8. Exercício prático principal

### Missão

Criar teste de cliente HTTP usando WireMock.

Você deve criar:

```text
labs/m11/aula-267-wiremock-servicos-externos
.github/workflows/aula-267-wiremock.yml
```

O projeto deve conter:

```text
pom.xml;
Endereco.java;
ConsultaCepException.java;
CepClienteHttp.java;
CepClienteHttpTest.java.
```

O teste deve cobrir:

```text
sucesso 200;
CEP não encontrado 404;
erro interno 500;
body inválido;
timeout;
validação local antes da chamada;
verificação da request enviada;
verificação de header Accept.
```

O workflow deve:

```text
rodar em push;
rodar em pull_request;
permitir workflow_dispatch;
usar Java 21;
rodar mvn clean test;
publicar relatórios Surefire.
```

---

### Roteiro local

Dentro do laboratório:

```powershell
mvn clean test
```

Se falhar:

```powershell
mvn test -DtrimStackTrace=false
```

Confira:

```text
target/surefire-reports
```

---

### Roteiro no GitHub

Na raiz do repositório:

```bash
git status
git add labs/m11/aula-267-wiremock-servicos-externos
git add .github/workflows/aula-267-wiremock.yml
git commit -m "Aula 267: wiremock contratos http e servicos externos fake"
git push
```

Depois no GitHub:

```text
Actions;
Aula 267 - WireMock;
abrir execução;
verificar testes;
baixar surefire reports se necessário.
```

---

### Critérios de aceite

A aula está concluída quando:

```text
mvn clean test passa localmente;
WireMock sobe em porta dinâmica;
cliente usa base URL do WireMock;
stub de sucesso retorna JSON;
cliente interpreta resposta 200;
cliente trata 404;
cliente trata 500;
cliente trata timeout;
teste verifica request enviada;
teste verifica header Accept;
workflow roda no GitHub Actions;
relatórios Surefire são publicados.
```

---

## 9. Checkpoint final

Responda mentalmente:

```text
1. Por que não chamar API externa real em teste automatizado?
2. O que é WireMock?
3. Qual diferença entre Mockito e WireMock?
4. O que é stub HTTP?
5. O que é contrato HTTP?
6. Para que serve @WireMockTest?
7. Para que serve WireMockRuntimeInfo?
8. Por que usar porta dinâmica?
9. Para que serve stubFor?
10. Para que serve verify?
11. Por que validar headers?
12. Por que testar 404?
13. Por que testar 500?
14. Por que testar timeout?
15. O que pode causar stub não encontrado?
16. Quando usar WireMock?
17. Quando evitar WireMock?
18. Qual diferença entre WireMock e Testcontainers?
19. Por que WireMock melhora estabilidade do pipeline?
20. Como essa aula prepara integrações HTTP futuras?
```

Checklist curto:

```text
[ ] Criei o laboratório da aula 267.
[ ] Configurei WireMock no pom.xml.
[ ] Criei cliente HTTP com Java HttpClient.
[ ] Criei record Endereco.
[ ] Criei exceção ConsultaCepException.
[ ] Criei testes com @WireMockTest.
[ ] Usei WireMockRuntimeInfo.
[ ] Criei stub de sucesso.
[ ] Criei stub de 404.
[ ] Criei stub de 500.
[ ] Criei simulação de timeout.
[ ] Verifiquei request enviada.
[ ] Verifiquei header Accept.
[ ] Rodei mvn clean test local.
[ ] Criei workflow da aula 267.
[ ] Entendi quando usar WireMock.
```

---

## 10. Fechamento e ponte para a próxima aula

Nesta aula, você aprendeu a simular serviços HTTP externos com WireMock.

Você estudou:

```text
serviços externos fake;
problemas de chamar API real em teste;
mock de objeto vs fake HTTP;
WireMock;
stub HTTP;
contrato HTTP;
@WireMockTest;
WireMockRuntimeInfo;
porta dinâmica;
stubFor;
okJson;
notFound;
serverError;
withFixedDelay;
verify;
headers;
status code;
body;
timeout;
cliente HTTP com Java HttpClient;
testes em pipeline.
```

A ideia principal é:

```text
WireMock permite testar integrações HTTP de forma controlada, previsível e automatizada, sem depender da disponibilidade ou instabilidade de serviços externos reais.
```

Agora você tem mais uma ferramenta essencial para backend profissional.

Você já consegue testar:

```text
regras puras com teste unitário;
banco real com Testcontainers;
serviços HTTP fake com WireMock.
```

Na próxima aula, vamos proteger arquitetura.

A próxima aula será:

```text
268 — M11.24 — ArchUnit: regras arquiteturais automatizadas e proteção de camadas
```

Nela, vamos estudar:

```text
por que arquitetura quebra aos poucos;
como criar regras automatizadas;
como impedir dependência indevida entre pacotes;
como proteger camadas;
como validar convenções arquiteturais no pipeline;
como pensar como engenheiro e arquiteto Java.
```

Ainda não vamos para Spring Boot.

Ainda não vamos iniciar SQL completo.

Vamos concluir o M11 com ferramentas que aumentam maturidade técnica.

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-267-wiremock-servicos-externos
git add .github/workflows/aula-267-wiremock.yml
git commit -m "Aula 267: wiremock contratos http e servicos externos fake"
git push
git status
```

Se estiver em branch nova:

```bash
git checkout -b feature/aula-267-wiremock
git add labs/m11/aula-267-wiremock-servicos-externos
git add .github/workflows/aula-267-wiremock.yml
git commit -m "Aula 267: wiremock contratos http e servicos externos fake"
git push -u origin feature/aula-267-wiremock
```

---

## Diário de bordo

Atualize o arquivo:

```text
docs/diario-de-bordo.md
```

Com o bloco:

```md
## Aula 267 — M11.23 — WireMock, contratos HTTP e serviços externos fake

Nesta aula, aprendi a usar WireMock para simular serviços HTTP externos em testes automatizados.

Criei o laboratório `labs/m11/aula-267-wiremock-servicos-externos`, configurei Maven com Java 21, JUnit 5, AssertJ e WireMock, e implementei um cliente HTTP simples usando `java.net.http.HttpClient`.

Criei testes com `@WireMockTest` e `WireMockRuntimeInfo`, usando porta dinâmica para simular uma API de CEP fake.

Pratiquei stubs de sucesso com JSON, erro 404, erro 500, resposta inválida e timeout com delay. Também validei que o cliente enviou a request correta e o header `Accept: application/json`.

O principal aprendizado foi que WireMock permite testar integrações HTTP de forma controlada e confiável, sem depender de APIs externas reais, instáveis, lentas ou custosas.
```

---

## Referências oficiais consultadas

Esta aula foi elaborada considerando a documentação oficial do WireMock.

Pontos importantes utilizados:

```text
WireMock é uma ferramenta de API mocking para criar ambientes previsíveis quando há dependência de APIs externas;
WireMock Java possui distribuição para uso em testes Maven;
a documentação oficial de instalação apresenta org.wiremock:wiremock na linha 3.x;
a extensão JUnit Jupiter simplifica a execução de instâncias WireMock em testes JUnit 5;
@WireMockTest inicia servidor WireMock em porta dinâmica por padrão;
WireMockRuntimeInfo fornece informações como base URL e porta;
por padrão, a extensão reseta stubs e requests antes de cada método de teste.
```
