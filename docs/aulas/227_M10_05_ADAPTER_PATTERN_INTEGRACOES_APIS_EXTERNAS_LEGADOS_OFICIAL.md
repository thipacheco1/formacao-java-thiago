# 227 — M10.05 — Adapter Pattern: integrações, APIs externas e sistemas legados

## Objetivo da aula

Na aula anterior, você estudou:

```text
Builder Pattern
```

Você viu que Builder ajuda quando a criação de objetos fica complexa por causa de:

```text
muitos campos;
muitos opcionais;
construtores grandes;
parâmetros do mesmo tipo;
objetos de teste;
responses complexos;
defaults;
validações no build.
```

Agora vamos estudar um dos padrões mais importantes para backend corporativo:

```text
Adapter Pattern
```

Em português:

```text
Padrão Adaptador
```

Adapter aparece muito em sistemas reais porque backend quase sempre precisa conversar com algo externo:

```text
API de pagamento;
API de CEP;
API de mensageria;
WhatsApp;
e-mail;
SAP;
ERP;
legado;
banco antigo;
serviço de antifraude;
storage;
fila;
serviço de geolocalização;
serviço de emissão fiscal;
sistema de logística.
```

O problema é que cada sistema externo tem seu próprio contrato.

E o seu domínio não deve ficar contaminado por isso.

Ao final desta aula, você deve conseguir:

```text
entender o problema que Adapter resolve;
identificar acoplamento com API externa;
criar contrato interno da aplicação;
criar adapter para client externo;
traduzir request interno para request externo;
traduzir response externo para response interno;
tratar erro externo sem vazar detalhe técnico;
proteger use case e domínio;
aplicar DIP com Adapter;
aplicar SRP separando integração;
entender relação com ports and adapters;
entender como isso aparecerá em Spring com clients HTTP.
```

---

## Ideia principal

Adapter transforma uma interface externa em uma interface que a aplicação entende.

Exemplo:

Sua aplicação quer isso:

```java
PagamentoResultado pagar(PagamentoRequest request);
```

Mas a API externa oferece isso:

```java
ExternalPaymentResponse charge(ExternalPaymentPayload payload);
```

O adapter fica no meio:

```text
Use case -> PagamentoGateway -> PagamentoApiAdapter -> Client externo
```

O use case fala com o contrato interno.

O adapter traduz para o mundo externo.

---

## Adapter em uma frase prática

```text
Adapter protege sua aplicação de detalhes de sistemas externos.
```

Ou:

```text
Adapter adapta o contrato de fora para o contrato de dentro.
```

---

## Problema sem Adapter

Sem Adapter, o use case começa a depender diretamente de detalhes externos.

Exemplo ruim:

```java
public class ProcessarPagamentoUseCase {
    private final MercadoPagoClient client;

    public void executar() {
        MercadoPagoPayload payload = new MercadoPagoPayload();
        MercadoPagoResponse response = client.charge(payload);

        if ("APPROVED".equals(response.status())) {
            // regra interna
        }
    }
}
```

Problemas:

```text
use case conhece MercadoPago;
use case conhece payload externo;
use case conhece status externo;
trocar provedor fica difícil;
testar fica difícil;
detalhe externo invade regra;
erro externo vaza para aplicação;
API externa dita o modelo interno.
```

Adapter resolve isso.

---

## Adapter e a frase arquitetural

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Adapter:

```text
O use case coordena usando uma porta interna.
O adapter implementa essa porta.
O client externo fica encapsulado dentro do adapter.
O domínio não conhece API externa.
```

---

## Relação com SOLID

## SRP

Adapter tem uma responsabilidade:

```text
adaptar contrato externo para contrato interno.
```

Ele não deve conter regra de negócio central.

---

## OCP

Você pode adicionar outro adapter sem alterar o use case.

Exemplo:

```text
MercadoPagoAdapter;
StripeAdapter;
PixBancoAdapter.
```

---

## LSP

Todos os adapters que implementam a mesma porta devem cumprir o contrato.

Se `PagamentoGateway` promete retornar `PagamentoResultado`, nenhum adapter deve retornar `null`.

---

## ISP

A porta deve ser pequena e específica.

Exemplo bom:

```java
public interface PagamentoGateway {
    PagamentoResultado pagar(PagamentoRequest request);
}
```

Exemplo ruim:

```java
public interface SistemaExternoCompleto {
    void pagar();
    void enviarEmail();
    void consultarCep();
    void emitirNota();
}
```

---

## DIP

O use case depende da abstração:

```text
PagamentoGateway
```

A infraestrutura implementa:

```text
MercadoPagoPagamentoAdapter
```

Isso é DIP aplicado.

---

# Parte 1 — Quando usar Adapter

Use Adapter quando:

```text
sua aplicação precisa integrar com API externa;
sistema externo tem contrato diferente do seu;
você quer proteger domínio de detalhes externos;
você quer trocar integração no futuro;
você quer testar sem chamar sistema real;
você quer traduzir erros externos;
você quer padronizar responses;
você quer evitar que o use case conheça payload externo;
você está integrando legado.
```

---

## Quando não usar Adapter

Evite Adapter quando:

```text
não existe sistema externo;
não existe diferença de contrato;
a integração é simples e isolada;
você está criando camada extra sem benefício;
o adapter só repassa chamada sem proteger nada.
```

Mas em backend real, integrações externas quase sempre merecem algum tipo de adapter/gateway.

---

# Parte 2 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-227-adapter-pattern-integracoes-apis-externas-legados
cd labs\m10\aula-227-adapter-pattern-integracoes-apis-externas-legados
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula227

mkdir src\br\com\curso\aula227\app

mkdir src\br\com\curso\aula227\dominio
mkdir src\br\com\curso\aula227\dominio\pagamento
mkdir src\br\com\curso\aula227\dominio\cep
mkdir src\br\com\curso\aula227\dominio\mensageria

mkdir src\br\com\curso\aula227\aplicacao
mkdir src\br\com\curso\aula227\aplicacao\port
mkdir src\br\com\curso\aula227\aplicacao\usecase

mkdir src\br\com\curso\aula227\externo
mkdir src\br\com\curso\aula227\externo\pagamento
mkdir src\br\com\curso\aula227\externo\cep
mkdir src\br\com\curso\aula227\externo\mensageria

mkdir src\br\com\curso\aula227\infra
mkdir src\br\com\curso\aula227\infra\adapter
mkdir src\br\com\curso\aula227\infra\adapter\pagamento
mkdir src\br\com\curso\aula227\infra\adapter\cep
mkdir src\br\com\curso\aula227\infra\adapter\mensageria

mkdir src\br\com\curso\aula227\teste
```

---

# Parte 3 — Exemplo 1: Pagamento

Vamos começar com pagamento.

A aplicação quer um contrato limpo.

O provedor externo tem outro formato.

---

## PagamentoRequest

Crie:

```text
src\br\com\curso\aula227\dominio\pagamento\PagamentoRequest.java
```

Código:

```java
package br.com.curso.aula227.dominio.pagamento;

import java.math.BigDecimal;

public class PagamentoRequest {
    private final String codigoPedido;
    private final String cliente;
    private final BigDecimal valor;
    private final String formaPagamento;

    public PagamentoRequest(String codigoPedido, String cliente, BigDecimal valor, String formaPagamento) {
        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (formaPagamento == null || formaPagamento.isBlank()) {
            throw new IllegalArgumentException("Forma de pagamento é obrigatória.");
        }

        this.codigoPedido = codigoPedido.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
        this.formaPagamento = formaPagamento.trim().toUpperCase();
    }

    public String codigoPedido() {
        return codigoPedido;
    }

    public String cliente() {
        return cliente;
    }

    public BigDecimal valor() {
        return valor;
    }

    public String formaPagamento() {
        return formaPagamento;
    }
}
```

---

## PagamentoResultado

Crie:

```text
src\br\com\curso\aula227\dominio\pagamento\PagamentoResultado.java
```

Código:

```java
package br.com.curso.aula227.dominio.pagamento;

public class PagamentoResultado {
    private final boolean aprovado;
    private final String codigoAutorizacao;
    private final String mensagem;

    private PagamentoResultado(boolean aprovado, String codigoAutorizacao, String mensagem) {
        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.aprovado = aprovado;
        this.codigoAutorizacao = codigoAutorizacao == null ? "" : codigoAutorizacao;
        this.mensagem = mensagem.trim();
    }

    public static PagamentoResultado aprovado(String codigoAutorizacao) {
        if (codigoAutorizacao == null || codigoAutorizacao.isBlank()) {
            throw new IllegalArgumentException("Código de autorização é obrigatório para pagamento aprovado.");
        }

        return new PagamentoResultado(true, codigoAutorizacao.trim().toUpperCase(), "Pagamento aprovado.");
    }

    public static PagamentoResultado recusado(String mensagem) {
        return new PagamentoResultado(false, "", mensagem);
    }

    public boolean aprovado() {
        return aprovado;
    }

    public boolean recusado() {
        return !aprovado;
    }

    public String codigoAutorizacao() {
        return codigoAutorizacao;
    }

    public String mensagem() {
        return mensagem;
    }

    @Override
    public String toString() {
        return "PagamentoResultado{"
                + "aprovado=" + aprovado
                + ", codigoAutorizacao='" + codigoAutorizacao + '\''
                + ", mensagem='" + mensagem + '\''
                + '}';
    }
}
```

---

## PagamentoGateway

Crie a porta interna:

```text
src\br\com\curso\aula227\aplicacao\port\PagamentoGateway.java
```

Código:

```java
package br.com.curso.aula227.aplicacao.port;

import br.com.curso.aula227.dominio.pagamento.PagamentoRequest;
import br.com.curso.aula227.dominio.pagamento.PagamentoResultado;

public interface PagamentoGateway {
    PagamentoResultado pagar(PagamentoRequest request);
}
```

---

## Provedor externo simulado

Agora vamos simular uma API externa com nomes e formatos diferentes.

Crie:

```text
src\br\com\curso\aula227\externo\pagamento\ExternalPaymentPayload.java
```

Código:

```java
package br.com.curso.aula227.externo.pagamento;

public record ExternalPaymentPayload(
        String orderReference,
        String customerName,
        long amountInCents,
        String paymentMethod
) {
}
```

---

Crie:

```text
src\br\com\curso\aula227\externo\pagamento\ExternalPaymentResponse.java
```

Código:

```java
package br.com.curso.aula227.externo.pagamento;

public record ExternalPaymentResponse(
        String status,
        String authorizationCode,
        String errorMessage
) {
}
```

---

Crie:

```text
src\br\com\curso\aula227\externo\pagamento\ExternalPaymentClient.java
```

Código:

```java
package br.com.curso.aula227.externo.pagamento;

import java.util.UUID;

public class ExternalPaymentClient {
    public ExternalPaymentResponse charge(ExternalPaymentPayload payload) {
        if (payload.amountInCents() <= 0) {
            return new ExternalPaymentResponse(
                    "DECLINED",
                    "",
                    "Invalid amount"
            );
        }

        if ("CARD_BLOCKED".equals(payload.paymentMethod())) {
            return new ExternalPaymentResponse(
                    "DECLINED",
                    "",
                    "Card blocked"
            );
        }

        return new ExternalPaymentResponse(
                "APPROVED",
                "AUTH-" + UUID.randomUUID(),
                ""
        );
    }
}
```

---

## Adapter de pagamento

Crie:

```text
src\br\com\curso\aula227\infra\adapter\pagamento\ExternalPaymentGatewayAdapter.java
```

Código:

```java
package br.com.curso.aula227.infra.adapter.pagamento;

import br.com.curso.aula227.aplicacao.port.PagamentoGateway;
import br.com.curso.aula227.dominio.pagamento.PagamentoRequest;
import br.com.curso.aula227.dominio.pagamento.PagamentoResultado;
import br.com.curso.aula227.externo.pagamento.ExternalPaymentClient;
import br.com.curso.aula227.externo.pagamento.ExternalPaymentPayload;
import br.com.curso.aula227.externo.pagamento.ExternalPaymentResponse;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class ExternalPaymentGatewayAdapter implements PagamentoGateway {
    private final ExternalPaymentClient client;

    public ExternalPaymentGatewayAdapter(ExternalPaymentClient client) {
        if (client == null) {
            throw new IllegalArgumentException("Client externo é obrigatório.");
        }

        this.client = client;
    }

    @Override
    public PagamentoResultado pagar(PagamentoRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("PagamentoRequest é obrigatório.");
        }

        ExternalPaymentPayload payload = toExternalPayload(request);

        ExternalPaymentResponse response = client.charge(payload);

        return toPagamentoResultado(response);
    }

    private ExternalPaymentPayload toExternalPayload(PagamentoRequest request) {
        long amountInCents = request.valor()
                .multiply(new BigDecimal("100"))
                .setScale(0, RoundingMode.HALF_UP)
                .longValueExact();

        return new ExternalPaymentPayload(
                request.codigoPedido(),
                request.cliente(),
                amountInCents,
                request.formaPagamento()
        );
    }

    private PagamentoResultado toPagamentoResultado(ExternalPaymentResponse response) {
        if (response == null) {
            throw new IllegalStateException("API externa retornou resposta nula.");
        }

        if ("APPROVED".equals(response.status())) {
            return PagamentoResultado.aprovado(response.authorizationCode());
        }

        if ("DECLINED".equals(response.status())) {
            String mensagem = response.errorMessage() == null || response.errorMessage().isBlank()
                    ? "Pagamento recusado."
                    : "Pagamento recusado: " + response.errorMessage();

            return PagamentoResultado.recusado(mensagem);
        }

        throw new IllegalStateException("Status externo de pagamento não mapeado: " + response.status());
    }
}
```

---

## ProcessarPagamentoUseCase

Crie:

```text
src\br\com\curso\aula227\aplicacao\usecase\ProcessarPagamentoUseCase.java
```

Código:

```java
package br.com.curso.aula227.aplicacao.usecase;

import br.com.curso.aula227.aplicacao.port.PagamentoGateway;
import br.com.curso.aula227.dominio.pagamento.PagamentoRequest;
import br.com.curso.aula227.dominio.pagamento.PagamentoResultado;

public class ProcessarPagamentoUseCase {
    private final PagamentoGateway pagamentoGateway;

    public ProcessarPagamentoUseCase(PagamentoGateway pagamentoGateway) {
        if (pagamentoGateway == null) {
            throw new IllegalArgumentException("PagamentoGateway é obrigatório.");
        }

        this.pagamentoGateway = pagamentoGateway;
    }

    public PagamentoResultado executar(PagamentoRequest request) {
        return pagamentoGateway.pagar(request);
    }
}
```

---

## PagamentoAdapterApp

Crie:

```text
src\br\com\curso\aula227\app\PagamentoAdapterApp.java
```

Código:

```java
package br.com.curso.aula227.app;

import br.com.curso.aula227.aplicacao.port.PagamentoGateway;
import br.com.curso.aula227.aplicacao.usecase.ProcessarPagamentoUseCase;
import br.com.curso.aula227.dominio.pagamento.PagamentoRequest;
import br.com.curso.aula227.dominio.pagamento.PagamentoResultado;
import br.com.curso.aula227.externo.pagamento.ExternalPaymentClient;
import br.com.curso.aula227.infra.adapter.pagamento.ExternalPaymentGatewayAdapter;

import java.math.BigDecimal;

public class PagamentoAdapterApp {
    public static void main(String[] args) {
        PagamentoGateway gateway = new ExternalPaymentGatewayAdapter(
                new ExternalPaymentClient()
        );

        ProcessarPagamentoUseCase useCase = new ProcessarPagamentoUseCase(gateway);

        PagamentoRequest request = new PagamentoRequest(
                "PED-001",
                "Ana Silva",
                new BigDecimal("1500.00"),
                "CREDIT_CARD"
        );

        PagamentoResultado resultado = useCase.executar(request);

        System.out.println(resultado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula227.app.PagamentoAdapterApp
```

---

## O que o adapter fez

O adapter traduziu:

```text
PagamentoRequest interno
-> ExternalPaymentPayload externo
```

E traduziu:

```text
ExternalPaymentResponse externo
-> PagamentoResultado interno
```

O use case não conhece:

```text
ExternalPaymentClient;
ExternalPaymentPayload;
ExternalPaymentResponse;
status APPROVED;
status DECLINED;
amountInCents.
```

Isso é Adapter.

---

# Parte 4 — Exemplo 2: CEP externo

Agora vamos adaptar uma API externa de CEP.

A aplicação quer:

```text
Endereco consultar(String cep)
```

A API externa retorna outro formato.

---

## Endereco

Crie:

```text
src\br\com\curso\aula227\dominio\cep\Endereco.java
```

Código:

```java
package br.com.curso.aula227.dominio.cep;

public class Endereco {
    private final String cep;
    private final String logradouro;
    private final String bairro;
    private final String cidade;
    private final String uf;

    public Endereco(String cep, String logradouro, String bairro, String cidade, String uf) {
        if (cep == null || cep.isBlank()) {
            throw new IllegalArgumentException("CEP é obrigatório.");
        }

        if (cidade == null || cidade.isBlank()) {
            throw new IllegalArgumentException("Cidade é obrigatória.");
        }

        if (uf == null || uf.isBlank()) {
            throw new IllegalArgumentException("UF é obrigatória.");
        }

        this.cep = cep.trim();
        this.logradouro = logradouro == null ? "" : logradouro.trim();
        this.bairro = bairro == null ? "" : bairro.trim();
        this.cidade = cidade.trim();
        this.uf = uf.trim().toUpperCase();
    }

    public String cep() {
        return cep;
    }

    public String logradouro() {
        return logradouro;
    }

    public String bairro() {
        return bairro;
    }

    public String cidade() {
        return cidade;
    }

    public String uf() {
        return uf;
    }

    @Override
    public String toString() {
        return cep
                + " | " + logradouro
                + " | " + bairro
                + " | " + cidade
                + "/" + uf;
    }
}
```

---

## CepGateway

Crie:

```text
src\br\com\curso\aula227\aplicacao\port\CepGateway.java
```

Código:

```java
package br.com.curso.aula227.aplicacao.port;

import br.com.curso.aula227.dominio.cep.Endereco;

public interface CepGateway {
    Endereco consultar(String cep);
}
```

---

## API externa simulada

Crie:

```text
src\br\com\curso\aula227\externo\cep\LegacyCepResponse.java
```

Código:

```java
package br.com.curso.aula227.externo.cep;

public record LegacyCepResponse(
        String zip,
        String street,
        String district,
        String cityName,
        String stateCode,
        boolean found
) {
}
```

---

Crie:

```text
src\br\com\curso\aula227\externo\cep\LegacyCepClient.java
```

Código:

```java
package br.com.curso.aula227.externo.cep;

public class LegacyCepClient {
    public LegacyCepResponse findAddressByZip(String zip) {
        if (zip == null || zip.isBlank()) {
            return new LegacyCepResponse("", "", "", "", "", false);
        }

        String normalizado = zip.replace("-", "").trim();

        if ("00000000".equals(normalizado)) {
            return new LegacyCepResponse(normalizado, "", "", "", "", false);
        }

        return new LegacyCepResponse(
                normalizado,
                "Rua Exemplo",
                "Centro",
                "Barueri",
                "SP",
                true
        );
    }
}
```

---

## LegacyCepGatewayAdapter

Crie:

```text
src\br\com\curso\aula227\infra\adapter\cep\LegacyCepGatewayAdapter.java
```

Código:

```java
package br.com.curso.aula227.infra.adapter.cep;

import br.com.curso.aula227.aplicacao.port.CepGateway;
import br.com.curso.aula227.dominio.cep.Endereco;
import br.com.curso.aula227.externo.cep.LegacyCepClient;
import br.com.curso.aula227.externo.cep.LegacyCepResponse;

public class LegacyCepGatewayAdapter implements CepGateway {
    private final LegacyCepClient client;

    public LegacyCepGatewayAdapter(LegacyCepClient client) {
        if (client == null) {
            throw new IllegalArgumentException("LegacyCepClient é obrigatório.");
        }

        this.client = client;
    }

    @Override
    public Endereco consultar(String cep) {
        if (cep == null || cep.isBlank()) {
            throw new IllegalArgumentException("CEP é obrigatório.");
        }

        LegacyCepResponse response = client.findAddressByZip(cep);

        if (response == null) {
            throw new IllegalStateException("Serviço externo de CEP retornou resposta nula.");
        }

        if (!response.found()) {
            throw new IllegalArgumentException("CEP não encontrado: " + cep);
        }

        return new Endereco(
                response.zip(),
                response.street(),
                response.district(),
                response.cityName(),
                response.stateCode()
        );
    }
}
```

---

## ConsultarCepUseCase

Crie:

```text
src\br\com\curso\aula227\aplicacao\usecase\ConsultarCepUseCase.java
```

Código:

```java
package br.com.curso.aula227.aplicacao.usecase;

import br.com.curso.aula227.aplicacao.port.CepGateway;
import br.com.curso.aula227.dominio.cep.Endereco;

public class ConsultarCepUseCase {
    private final CepGateway cepGateway;

    public ConsultarCepUseCase(CepGateway cepGateway) {
        if (cepGateway == null) {
            throw new IllegalArgumentException("CepGateway é obrigatório.");
        }

        this.cepGateway = cepGateway;
    }

    public Endereco executar(String cep) {
        return cepGateway.consultar(cep);
    }
}
```

---

## CepAdapterApp

Crie:

```text
src\br\com\curso\aula227\app\CepAdapterApp.java
```

Código:

```java
package br.com.curso.aula227.app;

import br.com.curso.aula227.aplicacao.usecase.ConsultarCepUseCase;
import br.com.curso.aula227.dominio.cep.Endereco;
import br.com.curso.aula227.externo.cep.LegacyCepClient;
import br.com.curso.aula227.infra.adapter.cep.LegacyCepGatewayAdapter;

public class CepAdapterApp {
    public static void main(String[] args) {
        ConsultarCepUseCase useCase = new ConsultarCepUseCase(
                new LegacyCepGatewayAdapter(new LegacyCepClient())
        );

        Endereco endereco = useCase.executar("06454-000");

        System.out.println(endereco);
    }
}
```

---

## O que o adapter protegeu

O use case não conhece:

```text
LegacyCepClient;
findAddressByZip;
LegacyCepResponse;
zip;
street;
district;
cityName;
stateCode;
found.
```

Ele conhece apenas:

```text
CepGateway;
Endereco.
```

Isso protege a aplicação.

---

# Parte 5 — Exemplo 3: Mensageria

Agora vamos adaptar um client externo de mensageria.

---

## Mensagem

Crie:

```text
src\br\com\curso\aula227\dominio\mensageria\Mensagem.java
```

Código:

```java
package br.com.curso.aula227.dominio.mensageria;

public class Mensagem {
    private final String destino;
    private final String conteudo;

    public Mensagem(String destino, String conteudo) {
        if (destino == null || destino.isBlank()) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        if (conteudo == null || conteudo.isBlank()) {
            throw new IllegalArgumentException("Conteúdo é obrigatório.");
        }

        this.destino = destino.trim();
        this.conteudo = conteudo.trim();
    }

    public String destino() {
        return destino;
    }

    public String conteudo() {
        return conteudo;
    }
}
```

---

## ResultadoEnvioMensagem

Crie:

```text
src\br\com\curso\aula227\dominio\mensageria\ResultadoEnvioMensagem.java
```

Código:

```java
package br.com.curso.aula227.dominio.mensageria;

public class ResultadoEnvioMensagem {
    private final boolean sucesso;
    private final String protocolo;
    private final String mensagem;

    private ResultadoEnvioMensagem(boolean sucesso, String protocolo, String mensagem) {
        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.sucesso = sucesso;
        this.protocolo = protocolo == null ? "" : protocolo;
        this.mensagem = mensagem;
    }

    public static ResultadoEnvioMensagem sucesso(String protocolo) {
        return new ResultadoEnvioMensagem(true, protocolo, "Mensagem enviada com sucesso.");
    }

    public static ResultadoEnvioMensagem falha(String mensagem) {
        return new ResultadoEnvioMensagem(false, "", mensagem);
    }

    public boolean sucesso() {
        return sucesso;
    }

    public String protocolo() {
        return protocolo;
    }

    public String mensagem() {
        return mensagem;
    }

    @Override
    public String toString() {
        return "ResultadoEnvioMensagem{"
                + "sucesso=" + sucesso
                + ", protocolo='" + protocolo + '\''
                + ", mensagem='" + mensagem + '\''
                + '}';
    }
}
```

---

## MensageriaGateway

Crie:

```text
src\br\com\curso\aula227\aplicacao\port\MensageriaGateway.java
```

Código:

```java
package br.com.curso.aula227.aplicacao.port;

import br.com.curso.aula227.dominio.mensageria.Mensagem;
import br.com.curso.aula227.dominio.mensageria.ResultadoEnvioMensagem;

public interface MensageriaGateway {
    ResultadoEnvioMensagem enviar(Mensagem mensagem);
}
```

---

## Client externo de mensageria

Crie:

```text
src\br\com\curso\aula227\externo\mensageria\ExternalMessageRequest.java
```

Código:

```java
package br.com.curso.aula227.externo.mensageria;

public record ExternalMessageRequest(
        String phone,
        String body,
        String channel
) {
}
```

---

Crie:

```text
src\br\com\curso\aula227\externo\mensageria\ExternalMessageResult.java
```

Código:

```java
package br.com.curso.aula227.externo.mensageria;

public record ExternalMessageResult(
        int code,
        String protocol,
        String description
) {
}
```

---

Crie:

```text
src\br\com\curso\aula227\externo\mensageria\ExternalMessageClient.java
```

Código:

```java
package br.com.curso.aula227.externo.mensageria;

import java.util.UUID;

public class ExternalMessageClient {
    public ExternalMessageResult send(ExternalMessageRequest request) {
        if (request.phone() == null || request.phone().isBlank()) {
            return new ExternalMessageResult(400, "", "Invalid phone");
        }

        if (request.body() == null || request.body().isBlank()) {
            return new ExternalMessageResult(400, "", "Invalid body");
        }

        return new ExternalMessageResult(
                200,
                "MSG-" + UUID.randomUUID(),
                "Sent"
        );
    }
}
```

---

## ExternalMensageriaGatewayAdapter

Crie:

```text
src\br\com\curso\aula227\infra\adapter\mensageria\ExternalMensageriaGatewayAdapter.java
```

Código:

```java
package br.com.curso.aula227.infra.adapter.mensageria;

import br.com.curso.aula227.aplicacao.port.MensageriaGateway;
import br.com.curso.aula227.dominio.mensageria.Mensagem;
import br.com.curso.aula227.dominio.mensageria.ResultadoEnvioMensagem;
import br.com.curso.aula227.externo.mensageria.ExternalMessageClient;
import br.com.curso.aula227.externo.mensageria.ExternalMessageRequest;
import br.com.curso.aula227.externo.mensageria.ExternalMessageResult;

public class ExternalMensageriaGatewayAdapter implements MensageriaGateway {
    private final ExternalMessageClient client;
    private final String channel;

    public ExternalMensageriaGatewayAdapter(ExternalMessageClient client, String channel) {
        if (client == null) {
            throw new IllegalArgumentException("ExternalMessageClient é obrigatório.");
        }

        if (channel == null || channel.isBlank()) {
            throw new IllegalArgumentException("Canal é obrigatório.");
        }

        this.client = client;
        this.channel = channel.trim().toUpperCase();
    }

    @Override
    public ResultadoEnvioMensagem enviar(Mensagem mensagem) {
        if (mensagem == null) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        ExternalMessageRequest request = new ExternalMessageRequest(
                mensagem.destino(),
                mensagem.conteudo(),
                channel
        );

        ExternalMessageResult result = client.send(request);

        if (result == null) {
            throw new IllegalStateException("Serviço externo de mensageria retornou null.");
        }

        if (result.code() == 200) {
            return ResultadoEnvioMensagem.sucesso(result.protocol());
        }

        return ResultadoEnvioMensagem.falha("Falha no envio externo: " + result.description());
    }
}
```

---

## EnviarMensagemUseCase

Crie:

```text
src\br\com\curso\aula227\aplicacao\usecase\EnviarMensagemUseCase.java
```

Código:

```java
package br.com.curso.aula227.aplicacao.usecase;

import br.com.curso.aula227.aplicacao.port.MensageriaGateway;
import br.com.curso.aula227.dominio.mensageria.Mensagem;
import br.com.curso.aula227.dominio.mensageria.ResultadoEnvioMensagem;

public class EnviarMensagemUseCase {
    private final MensageriaGateway mensageriaGateway;

    public EnviarMensagemUseCase(MensageriaGateway mensageriaGateway) {
        if (mensageriaGateway == null) {
            throw new IllegalArgumentException("MensageriaGateway é obrigatório.");
        }

        this.mensageriaGateway = mensageriaGateway;
    }

    public ResultadoEnvioMensagem executar(Mensagem mensagem) {
        return mensageriaGateway.enviar(mensagem);
    }
}
```

---

## MensageriaAdapterApp

Crie:

```text
src\br\com\curso\aula227\app\MensageriaAdapterApp.java
```

Código:

```java
package br.com.curso.aula227.app;

import br.com.curso.aula227.aplicacao.usecase.EnviarMensagemUseCase;
import br.com.curso.aula227.dominio.mensageria.Mensagem;
import br.com.curso.aula227.dominio.mensageria.ResultadoEnvioMensagem;
import br.com.curso.aula227.externo.mensageria.ExternalMessageClient;
import br.com.curso.aula227.infra.adapter.mensageria.ExternalMensageriaGatewayAdapter;

public class MensageriaAdapterApp {
    public static void main(String[] args) {
        EnviarMensagemUseCase useCase = new EnviarMensagemUseCase(
                new ExternalMensageriaGatewayAdapter(
                        new ExternalMessageClient(),
                        "WHATSAPP"
                )
        );

        ResultadoEnvioMensagem resultado = useCase.executar(
                new Mensagem("11999999999", "Sua OS foi aberta com sucesso.")
        );

        System.out.println(resultado);
    }
}
```

---

# Parte 6 — Fakes para teste

Adapter também facilita teste, porque o use case depende de porta.

Podemos criar fake sem chamar sistema externo.

---

## PagamentoGatewayFakeAprovado

Crie:

```text
src\br\com\curso\aula227\teste\PagamentoGatewayFakeAprovado.java
```

Código:

```java
package br.com.curso.aula227.teste;

import br.com.curso.aula227.aplicacao.port.PagamentoGateway;
import br.com.curso.aula227.dominio.pagamento.PagamentoRequest;
import br.com.curso.aula227.dominio.pagamento.PagamentoResultado;

public class PagamentoGatewayFakeAprovado implements PagamentoGateway {
    @Override
    public PagamentoResultado pagar(PagamentoRequest request) {
        return PagamentoResultado.aprovado("AUTH-FAKE-123");
    }
}
```

---

## PagamentoFakeApp

Crie:

```text
src\br\com\curso\aula227\app\PagamentoFakeApp.java
```

Código:

```java
package br.com.curso.aula227.app;

import br.com.curso.aula227.aplicacao.usecase.ProcessarPagamentoUseCase;
import br.com.curso.aula227.dominio.pagamento.PagamentoRequest;
import br.com.curso.aula227.dominio.pagamento.PagamentoResultado;
import br.com.curso.aula227.teste.PagamentoGatewayFakeAprovado;

import java.math.BigDecimal;

public class PagamentoFakeApp {
    public static void main(String[] args) {
        ProcessarPagamentoUseCase useCase = new ProcessarPagamentoUseCase(
                new PagamentoGatewayFakeAprovado()
        );

        PagamentoResultado resultado = useCase.executar(
                new PagamentoRequest(
                        "PED-TESTE",
                        "Cliente Teste",
                        new BigDecimal("100.00"),
                        "PIX"
                )
        );

        System.out.println(resultado);
    }
}
```

---

## O que isso mostra

O use case funciona com:

```text
adapter real;
fake de teste;
outro adapter futuro.
```

Porque depende da porta:

```text
PagamentoGateway.
```

Isso é DIP + Adapter.

---

# Parte 7 — Adapter vs Strategy

Adapter e Strategy podem parecer parecidos porque ambos usam interfaces.

Mas resolvem problemas diferentes.

## Strategy

Resolve:

```text
variação de comportamento interno.
```

Exemplo:

```text
PoliticaDesconto;
PoliticaPrioridade;
ValidadorPedido.
```

---

## Adapter

Resolve:

```text
diferença entre contrato interno e sistema externo.
```

Exemplo:

```text
MercadoPagoAdapter;
LegacyCepAdapter;
ExternalMensageriaAdapter.
```

---

## Comparação

```text
Strategy:
qual regra aplicar?

Adapter:
como falar com esse sistema externo sem contaminar meu domínio?
```

Ambos usam DIP.

Mas o motivo é diferente.

---

# Parte 8 — Adapter vs Facade

Também é comum confundir Adapter com Facade.

## Adapter

Adapta uma interface incompatível.

```text
meu contrato interno é diferente do contrato externo.
```

## Facade

Simplifica acesso a um subsistema complexo.

```text
vários serviços internos são acessados por uma interface simples.
```

Exemplo:

```text
CheckoutFacade:
calcula frete;
reserva estoque;
processa pagamento;
gera pedido;
notifica.
```

Adapter será estudado agora.

Facade virá depois.

---

# Parte 9 — Adapter e tratamento de erro

Um bom adapter não apenas converte request e response.

Ele também traduz erros.

Exemplo externo:

```text
status = "DECLINED"
errorMessage = "Card blocked"
```

Interno:

```text
PagamentoResultado.recusado("Pagamento recusado: Card blocked")
```

Exemplo externo:

```text
HTTP timeout
```

Interno futuro:

```text
FalhaIntegracaoPagamentoException
```

O use case não deve conhecer erro específico do client externo.

---

## Regra prática

Detalhe técnico externo deve ficar dentro da infraestrutura.

A aplicação recebe:

```text
resultado de negócio;
exception de infraestrutura controlada;
contrato interno.
```

Não deve receber:

```text
payload externo;
response externo;
status externo cru;
exception específica de biblioteca;
JSON externo.
```

---

# Parte 10 — Adapter e DTO externo

Nunca deixe DTO externo virar modelo interno.

Ruim:

```java
public ExternalPaymentResponse executarPagamento(...) {
}
```

Melhor:

```java
public PagamentoResultado executarPagamento(...) {
}
```

Por quê?

Porque o response externo pertence ao provedor.

Se o provedor mudar, seu sistema inteiro muda.

Com Adapter, só o adapter muda.

---

# Parte 11 — Adapter e front-end

O front conversa com sua API.

Ele não deve sofrer com mudanças em sistemas externos.

Exemplo:

```text
Provedor de pagamento mudou de APPROVED para AUTHORIZED.
```

Sem adapter:

```text
talvez o backend inteiro precise mudar.
talvez o front receba status diferente.
```

Com adapter:

```text
adapter traduz AUTHORIZED para PagamentoResultado.aprovado.
response da sua API continua estável.
```

Isso é muito importante.

Backend bem feito protege o contrato com o front.

---

# Parte 12 — Como isso vira Spring depois

Futuramente, com Spring, o adapter pode ser algo como:

```java
@Component
public class MercadoPagoPagamentoAdapter implements PagamentoGateway {
    private final MercadoPagoClient client;

    public MercadoPagoPagamentoAdapter(MercadoPagoClient client) {
        this.client = client;
    }
}
```

E o use case:

```java
@Service
public class ProcessarPagamentoUseCase {
    private final PagamentoGateway gateway;

    public ProcessarPagamentoUseCase(PagamentoGateway gateway) {
        this.gateway = gateway;
    }
}
```

O Spring injeta a implementação.

Mas o desenho é o mesmo que você fez em Java puro.

---

# Parte 13 — Erros comuns com Adapter

## 1. Adapter com regra de negócio demais

Adapter deve traduzir e integrar.

Não deve decidir regra central do domínio.

---

## 2. Use case conhecendo DTO externo

Se o use case importa classes do pacote externo, algo está errado.

---

## 3. Adapter retornando response externo

A porta interna deve retornar modelo interno.

---

## 4. Adapter engolindo erro sem controle

Ruim:

```java
catch (Exception e) {
    return null;
}
```

Melhor:

```text
traduzir para resultado controlado ou exception clara.
```

---

## 5. Porta genérica demais

Ruim:

```java
interface ExternalGateway {
    Object execute(Object input);
}
```

Melhor:

```java
interface PagamentoGateway {
    PagamentoResultado pagar(PagamentoRequest request);
}
```

---

# Parte 14 — Checklist para criar Adapter

Pergunte:

```text
1. Qual é o contrato interno que minha aplicação quer?
2. Qual é o contrato externo que o sistema fornece?
3. Quais campos precisam ser traduzidos?
4. Quais status externos precisam ser mapeados?
5. Quais erros externos precisam ser tratados?
6. O use case conhece alguma classe externa?
7. O domínio conhece alguma classe externa?
8. O adapter retorna modelo interno?
9. Consigo trocar o adapter sem alterar o use case?
10. Consigo criar fake para teste?
```

---

# Parte 15 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula227.app.PagamentoAdapterApp
java -cp out br.com.curso.aula227.app.CepAdapterApp
java -cp out br.com.curso.aula227.app.MensageriaAdapterApp
java -cp out br.com.curso.aula227.app.PagamentoFakeApp
```

Depois responda:

```text
1. Qual porta interna foi criada para pagamento?
2. Qual client externo foi adaptado?
3. Quais objetos externos não chegaram ao use case?
4. Qual porta interna foi criada para CEP?
5. O que LegacyCepGatewayAdapter traduziu?
6. Qual porta interna foi criada para mensageria?
7. Como o adapter traduziu retorno externo?
8. Como fake ajuda no teste?
9. Qual relação com DIP?
10. Qual relação com front-end?
```

---

# Parte 16 — Exercício prático principal

## Contexto

Crie um adapter para uma API externa de antifraude.

A aplicação quer:

```java
AnaliseFraudeResultado analisar(AnaliseFraudeRequest request);
```

O client externo oferece:

```java
RiskApiResponse checkRisk(RiskApiPayload payload);
```

---

## Domínio interno

Crie:

```text
AnaliseFraudeRequest
```

Campos:

```text
String codigoPedido;
String cliente;
BigDecimal valor;
String documento;
```

Crie:

```text
AnaliseFraudeResultado
```

Campos:

```text
boolean aprovado;
String nivelRisco;
String mensagem;
```

---

## Porta interna

Crie:

```java
public interface AntifraudeGateway {
    AnaliseFraudeResultado analisar(AnaliseFraudeRequest request);
}
```

---

## Externo simulado

Crie:

```text
RiskApiPayload
```

Campos:

```text
String orderId;
String customer;
long valueInCents;
String documentNumber;
```

Crie:

```text
RiskApiResponse
```

Campos:

```text
String riskLevel;
boolean allowed;
String reason;
```

Crie:

```text
RiskApiClient
```

Método:

```java
RiskApiResponse checkRisk(RiskApiPayload payload)
```

Regras simuladas:

```text
valor acima de 10000 -> HIGH, false, "High value"
documento vazio -> HIGH, false, "Invalid document"
demais -> LOW, true, "Approved"
```

---

## Adapter

Crie:

```text
RiskApiAntifraudeAdapter
```

Implementa:

```text
AntifraudeGateway
```

Responsável por:

```text
converter valor para centavos;
converter campos internos para externos;
traduzir response externo para resultado interno;
não retornar null;
não vazar RiskApiResponse para use case.
```

---

## Use case

Crie:

```text
AnalisarFraudeUseCase
```

Depende de:

```text
AntifraudeGateway.
```

---

## App

Crie:

```text
AntifraudeAdapterApp.
```

---

## Critérios

```text
use case não importa pacote externo;
domínio não importa pacote externo;
adapter fica em infra;
client externo fica em externo;
porta fica em aplicação;
resultado interno é usado pela aplicação.
```

---

# Parte 17 — Desafio extra

## Adapter para sistema legado de OS

Sistema legado retorna:

```text
LegacyOsRecord
```

Campos:

```text
String osNumber;
String customerName;
String phoneNumber;
String situation;
String createdAtText;
```

Sua aplicação quer:

```text
OrdemServicoLegado
```

Campos:

```text
String codigo;
String cliente;
String telefone;
String status;
Instant criadaEm;
```

Crie:

```text
OsLegadoGateway
```

Método:

```java
OrdemServicoLegado buscar(String codigo);
```

Crie:

```text
LegacyOsClient
LegacyOsAdapter
```

Critério:

```text
converter status externo;
converter data texto para Instant;
tratar registro não encontrado;
não vazar LegacyOsRecord.
```

---

# Parte 18 — Simulado rápido

## Questão 1

Adapter é usado principalmente para:

```text
A) adaptar contrato externo ao contrato interno da aplicação.
B) criar objetos com muitos campos.
C) substituir todo construtor.
D) calcular desconto sempre.
```

---

## Questão 2

Em uma boa aplicação, o use case deve depender de:

```text
A) uma porta interna, como PagamentoGateway.
B) DTO externo do provedor.
C) response externo cru.
D) client externo diretamente.
```

---

## Questão 3

Qual classe deve conhecer `ExternalPaymentPayload`?

```text
A) O adapter.
B) A entidade Pedido.
C) O front-end.
D) O use case.
```

---

## Questão 4

Adapter se relaciona fortemente com:

```text
A) DIP.
B) Apenas herança obrigatória.
C) Apenas construtor vazio.
D) Apenas System.out.println.
```

---

## Questão 5

Um adapter que retorna `ExternalPaymentResponse` pela porta interna está:

```text
A) vazando detalhe externo.
B) protegendo o domínio.
C) aplicando Builder.
D) removendo acoplamento.
```

---

## Questão 6

Fake de gateway ajuda porque:

```text
A) permite testar use case sem chamar sistema externo real.
B) obriga usar internet.
C) remove necessidade de domínio.
D) substitui o compilador.
```

---

## Gabarito

```text
1. A
2. A
3. A
4. A
5. A
6. A
```

---

# Parte 19 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Adapter Pattern.
[ ] Sei identificar acoplamento com API externa.
[ ] Sei criar porta interna.
[ ] Sei criar client externo simulado.
[ ] Sei criar adapter.
[ ] Sei traduzir request interno para payload externo.
[ ] Sei traduzir response externo para resultado interno.
[ ] Sei evitar vazamento de DTO externo.
[ ] Sei criar fake para teste.
[ ] Sei diferenciar Adapter de Strategy.
[ ] Sei diferenciar Adapter de Facade.
[ ] Sei explicar relação com DIP.
[ ] Sei explicar relação com front-end.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Adapter Pattern?
2. Qual problema ele resolve?
3. Por que use case não deve conhecer DTO externo?
4. O que é porta interna?
5. O que é client externo?
6. O que o adapter traduz?
7. Como adapter ajuda testes?
8. Qual diferença entre Adapter e Strategy?
9. Qual diferença entre Adapter e Facade?
10. Como isso vai aparecer em Spring?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar adapter para pagamento;
criar adapter para CEP;
criar adapter para mensageria;
proteger use case de detalhes externos;
mapear request e response;
tratar status externo;
criar fake de gateway;
explicar relação com ports and adapters;
resolver exercício de antifraude;
resolver desafio de legado.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-227-adapter-pattern-integracoes-apis-externas-legados
git commit -m "Aula 227: adapter pattern integracoes apis externas legados"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Adapter protege o núcleo da aplicação contra contratos externos.
```

Você estudou:

```text
Adapter Pattern;
ports;
adapters;
clients externos;
pagamento;
CEP;
mensageria;
mapeamento de request;
mapeamento de response;
tratamento de status externo;
fake para teste;
relação com DIP;
relação com front-end;
relação com Spring.
```

Também reforçou:

```text
o domínio não deve conhecer API externa;
o use case não deve importar DTO externo;
o adapter traduz o mundo externo para a linguagem interna da aplicação.
```

Na próxima aula, vamos estudar:

```text
Facade Pattern.
```

A ideia será entender como simplificar fluxos complexos oferecendo uma interface mais simples para vários serviços internos.
