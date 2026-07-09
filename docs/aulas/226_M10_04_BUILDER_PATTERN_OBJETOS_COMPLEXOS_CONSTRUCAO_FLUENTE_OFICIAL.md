# 226 — M10.04 — Builder Pattern: objetos complexos e construção fluente

## Objetivo da aula

Na aula anterior, você estudou:

```text
Factory Pattern
```

Você viu que Factory ajuda quando a criação de objetos tem:

```text
regra;
repetição;
escolha de implementação;
composição de dependências;
criação padronizada;
montagem de use case;
montagem de strategies.
```

Agora vamos estudar outro padrão criacional muito importante:

```text
Builder Pattern
```

Em português:

```text
Padrão Construtor
```

Builder é usado quando a criação de um objeto fica difícil por causa de:

```text
muitos campos;
muitos campos opcionais;
construtor grande;
ordem confusa de parâmetros;
objetos de teste repetitivos;
requests complexas;
responses complexos;
configurações;
objetos imutáveis;
criação passo a passo.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Builder resolve;
identificar construtor grande demais;
criar Builder manual em Java puro;
criar objeto imutável com Builder;
validar campos obrigatórios no build;
definir valores padrão;
usar Builder para domínio;
usar Builder para DTO/Response;
usar Builder para testes;
diferenciar Builder de Factory;
evitar Builder desnecessário;
entender como Lombok @Builder funciona conceitualmente no futuro;
preparar base para criação de objetos em APIs Spring.
```

---

## Ideia principal

Builder separa o processo de construção de um objeto da classe que usa esse objeto.

Em vez de criar assim:

```java
new Pedido(
        codigo,
        cliente,
        telefone,
        email,
        valor,
        desconto,
        frete,
        status,
        criadoEm,
        atualizadoEm,
        observacao,
        origem
);
```

você cria assim:

```java
Pedido pedido = Pedido.builder()
        .codigo("PED-001")
        .cliente("Ana")
        .valor("1500.00")
        .origem("ECOMMERCE")
        .build();
```

Fica mais legível.

Você sabe o que cada valor significa.

---

## Builder em uma frase prática

```text
Use Builder quando um objeto é complexo demais para ser criado com um construtor simples e legível.
```

Mas atenção:

```text
não use Builder para todo objeto.
```

Se a classe tem dois ou três campos obrigatórios e criação simples, construtor pode ser melhor.

---

## Problema clássico: construtor telescópico

Construtor telescópico é quando você cria várias versões de construtor:

```java
public Pedido(String codigo, String cliente) {
}

public Pedido(String codigo, String cliente, BigDecimal valor) {
}

public Pedido(String codigo, String cliente, BigDecimal valor, String cupom) {
}

public Pedido(String codigo, String cliente, BigDecimal valor, String cupom, String observacao) {
}
```

Isso vai crescendo.

Fica difícil manter.

Builder ajuda a evitar esse problema.

---

## Problema clássico: parâmetros do mesmo tipo

Exemplo perigoso:

```java
new Cliente("Ana", "11999999999", "ana@email.com", "São Paulo");
```

Até dá para entender.

Mas com muitos `String`, o risco aumenta:

```java
new Cliente("Ana", "ana@email.com", "11999999999", "São Paulo");
```

Compila.

Mas pode estar errado.

Builder melhora a leitura:

```java
Cliente.builder()
        .nome("Ana")
        .email("ana@email.com")
        .telefone("11999999999")
        .cidade("São Paulo")
        .build();
```

---

## Relação com SOLID

## SRP

Builder fica responsável por construir.

A entidade fica responsável por regra.

O service coordena fluxo.

---

## OCP

Builder pode evoluir com novos campos opcionais com menos impacto em chamadas antigas.

---

## LSP

Se o Builder cria uma implementação de um contrato, o objeto criado precisa cumprir o contrato esperado.

---

## ISP

Builder deve construir um objeto específico.

Não deve virar interface gigante de criação de tudo.

---

## DIP

Use case ainda deve depender de contratos.

Builder não substitui ports/adapters.

Ele ajuda na criação de objetos.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Builder:

```text
Builder constrói objeto complexo.
A entidade continua protegendo regra.
O use case continua coordenando.
O repository continua salvando.
O controller futuro continua recebendo.
```

Builder não deve virar use case.

---

# Parte 1 — Quando usar Builder

Use Builder quando encontrar:

```text
construtor com muitos parâmetros;
muitos parâmetros do mesmo tipo;
muitos campos opcionais;
muitos overloads de construtor;
objeto imutável complexo;
criação de objeto em teste muito repetitiva;
response com muitos campos;
request de simulação;
configuração complexa;
objeto com valores padrão.
```

---

## Quando não usar Builder

Evite Builder quando:

```text
classe tem poucos campos;
todos os campos são obrigatórios e claros;
construtor é simples;
não há opcionais;
Builder deixaria o código mais verboso sem ganho;
você está usando por moda.
```

Exemplo que não precisa de Builder:

```java
new Produto("TV", new BigDecimal("1500.00"));
```

Se está claro, mantenha simples.

---

# Parte 2 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-226-builder-pattern-objetos-complexos-construcao-fluente
cd labs\m10\aula-226-builder-pattern-objetos-complexos-construcao-fluente
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula226

mkdir src\br\com\curso\aula226\app

mkdir src\br\com\curso\aula226\ruim

mkdir src\br\com\curso\aula226\dominio
mkdir src\br\com\curso\aula226\dominio\pedido
mkdir src\br\com\curso\aula226\dominio\os

mkdir src\br\com\curso\aula226\dto

mkdir src\br\com\curso\aula226\builder
mkdir src\br\com\curso\aula226\builder\pedido
mkdir src\br\com\curso\aula226\builder\os
mkdir src\br\com\curso\aula226\builder\teste
```

---

# Parte 3 — Exemplo ruim: construtor gigante

## PedidoRuim

Crie:

```text
src\br\com\curso\aula226\ruim\PedidoRuim.java
```

Código:

```java
package br.com.curso.aula226.ruim;

import java.math.BigDecimal;
import java.time.Instant;

public class PedidoRuim {
    private final String codigo;
    private final String cliente;
    private final String telefone;
    private final String email;
    private final BigDecimal valorProdutos;
    private final BigDecimal desconto;
    private final BigDecimal frete;
    private final String status;
    private final String origem;
    private final String observacao;
    private final Instant criadoEm;
    private final Instant atualizadoEm;

    public PedidoRuim(
            String codigo,
            String cliente,
            String telefone,
            String email,
            BigDecimal valorProdutos,
            BigDecimal desconto,
            BigDecimal frete,
            String status,
            String origem,
            String observacao,
            Instant criadoEm,
            Instant atualizadoEm
    ) {
        this.codigo = codigo;
        this.cliente = cliente;
        this.telefone = telefone;
        this.email = email;
        this.valorProdutos = valorProdutos;
        this.desconto = desconto;
        this.frete = frete;
        this.status = status;
        this.origem = origem;
        this.observacao = observacao;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valorProdutos
                + " | Desconto: " + desconto
                + " | Frete: " + frete
                + " | Status: " + status
                + " | Origem: " + origem
                + " | Criado em: " + criadoEm;
    }
}
```

---

## PedidoRuimApp

Crie:

```text
src\br\com\curso\aula226\app\PedidoRuimApp.java
```

Código:

```java
package br.com.curso.aula226.app;

import br.com.curso.aula226.ruim.PedidoRuim;

import java.math.BigDecimal;
import java.time.Instant;

public class PedidoRuimApp {
    public static void main(String[] args) {
        PedidoRuim pedido = new PedidoRuim(
                "PED-001",
                "Ana Silva",
                "11999999999",
                "ana@email.com",
                new BigDecimal("1500.00"),
                new BigDecimal("100.00"),
                new BigDecimal("30.00"),
                "CRIADO",
                "ECOMMERCE",
                "Entregar no período da manhã",
                Instant.now(),
                Instant.now()
        );

        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula226.app.PedidoRuimApp
```

---

## Problemas

O construtor tem muitos parâmetros.

Problemas reais:

```text
difícil ler;
fácil inverter parâmetros;
muitos Strings;
muitos BigDecimals;
muitos campos opcionais;
chamada extensa;
difícil saber o que cada valor representa;
difícil criar variações em testes.
```

Builder resolve esse tipo de problema.

---

# Parte 4 — Builder manual em domínio

## StatusPedido

Crie:

```text
src\br\com\curso\aula226\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula226.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    FATURADO,
    CANCELADO
}
```

---

## OrigemPedido

Crie:

```text
src\br\com\curso\aula226\dominio\pedido\OrigemPedido.java
```

Código:

```java
package br.com.curso.aula226.dominio.pedido;

public enum OrigemPedido {
    LOJA,
    ECOMMERCE,
    BACKOFFICE,
    INTEGRACAO
}
```

---

## Pedido com Builder

Crie:

```text
src\br\com\curso\aula226\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula226.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.StringJoiner;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final String telefone;
    private final String email;
    private final BigDecimal valorProdutos;
    private final BigDecimal desconto;
    private final BigDecimal frete;
    private final StatusPedido status;
    private final OrigemPedido origem;
    private final String observacao;
    private final Instant criadoEm;
    private final Instant atualizadoEm;

    private Pedido(Builder builder) {
        this.codigo = builder.codigo;
        this.cliente = builder.cliente;
        this.telefone = builder.telefone;
        this.email = builder.email;
        this.valorProdutos = builder.valorProdutos;
        this.desconto = builder.desconto;
        this.frete = builder.frete;
        this.status = builder.status;
        this.origem = builder.origem;
        this.observacao = builder.observacao;
        this.criadoEm = builder.criadoEm;
        this.atualizadoEm = builder.atualizadoEm;

        validar();
    }

    public static Builder builder() {
        return new Builder();
    }

    private void validar() {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valorProdutos == null || valorProdutos.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor dos produtos deve ser maior que zero.");
        }

        if (desconto == null || desconto.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Desconto não pode ser negativo.");
        }

        if (frete == null || frete.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Frete não pode ser negativo.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (origem == null) {
            throw new IllegalArgumentException("Origem é obrigatória.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        if (atualizadoEm == null) {
            throw new IllegalArgumentException("Data de atualização é obrigatória.");
        }
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public String telefone() {
        return telefone;
    }

    public String email() {
        return email;
    }

    public BigDecimal valorProdutos() {
        return valorProdutos;
    }

    public BigDecimal desconto() {
        return desconto;
    }

    public BigDecimal frete() {
        return frete;
    }

    public StatusPedido status() {
        return status;
    }

    public OrigemPedido origem() {
        return origem;
    }

    public String observacao() {
        return observacao;
    }

    public Instant criadoEm() {
        return criadoEm;
    }

    public Instant atualizadoEm() {
        return atualizadoEm;
    }

    public BigDecimal valorTotal() {
        return valorProdutos.subtract(desconto).add(frete);
    }

    public String resumo() {
        return new StringJoiner(" | ")
                .add(codigo)
                .add("Cliente: " + cliente)
                .add("Valor produtos: " + valorProdutos)
                .add("Desconto: " + desconto)
                .add("Frete: " + frete)
                .add("Total: " + valorTotal())
                .add("Status: " + status)
                .add("Origem: " + origem)
                .toString();
    }

    public static class Builder {
        private String codigo;
        private String cliente;
        private String telefone;
        private String email;
        private BigDecimal valorProdutos;
        private BigDecimal desconto = BigDecimal.ZERO;
        private BigDecimal frete = BigDecimal.ZERO;
        private StatusPedido status = StatusPedido.CRIADO;
        private OrigemPedido origem = OrigemPedido.BACKOFFICE;
        private String observacao = "";
        private Instant criadoEm = Instant.now();
        private Instant atualizadoEm = Instant.now();

        private Builder() {
        }

        public Builder codigo(String codigo) {
            this.codigo = codigo;
            return this;
        }

        public Builder cliente(String cliente) {
            this.cliente = cliente;
            return this;
        }

        public Builder telefone(String telefone) {
            this.telefone = telefone;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder valorProdutos(BigDecimal valorProdutos) {
            this.valorProdutos = valorProdutos;
            return this;
        }

        public Builder valorProdutos(String valorProdutos) {
            this.valorProdutos = new BigDecimal(valorProdutos);
            return this;
        }

        public Builder desconto(BigDecimal desconto) {
            this.desconto = desconto;
            return this;
        }

        public Builder desconto(String desconto) {
            this.desconto = new BigDecimal(desconto);
            return this;
        }

        public Builder frete(BigDecimal frete) {
            this.frete = frete;
            return this;
        }

        public Builder frete(String frete) {
            this.frete = new BigDecimal(frete);
            return this;
        }

        public Builder status(StatusPedido status) {
            this.status = status;
            return this;
        }

        public Builder origem(OrigemPedido origem) {
            this.origem = origem;
            return this;
        }

        public Builder observacao(String observacao) {
            this.observacao = observacao;
            return this;
        }

        public Builder criadoEm(Instant criadoEm) {
            this.criadoEm = criadoEm;
            return this;
        }

        public Builder atualizadoEm(Instant atualizadoEm) {
            this.atualizadoEm = atualizadoEm;
            return this;
        }

        public Pedido build() {
            return new Pedido(this);
        }
    }
}
```

---

## PedidoBuilderApp

Crie:

```text
src\br\com\curso\aula226\app\PedidoBuilderApp.java
```

Código:

```java
package br.com.curso.aula226.app;

import br.com.curso.aula226.dominio.pedido.OrigemPedido;
import br.com.curso.aula226.dominio.pedido.Pedido;

public class PedidoBuilderApp {
    public static void main(String[] args) {
        Pedido pedido = Pedido.builder()
                .codigo("PED-001")
                .cliente("Ana Silva")
                .telefone("11999999999")
                .email("ana@email.com")
                .valorProdutos("1500.00")
                .desconto("100.00")
                .frete("30.00")
                .origem(OrigemPedido.ECOMMERCE)
                .observacao("Entregar no período da manhã")
                .build();

        System.out.println(pedido.resumo());
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula226.app.PedidoBuilderApp
```

---

## O que melhorou

Agora a criação ficou:

```text
legível;
fluente;
com nomes nos campos;
com defaults;
com validação no build;
com menos risco de inverter parâmetros.
```

---

# Parte 5 — Campos obrigatórios e opcionais

No Builder acima:

## Obrigatórios

```text
codigo;
cliente;
valorProdutos.
```

## Opcionais com default

```text
desconto = 0;
frete = 0;
status = CRIADO;
origem = BACKOFFICE;
observacao = "";
criadoEm = Instant.now();
atualizadoEm = Instant.now();
```

Isso é comum em Builder.

A criação simples fica curta:

```java
Pedido pedido = Pedido.builder()
        .codigo("PED-002")
        .cliente("Carlos")
        .valorProdutos("900.00")
        .build();
```

---

## PedidoBuilderMinimoApp

Crie:

```text
src\br\com\curso\aula226\app\PedidoBuilderMinimoApp.java
```

Código:

```java
package br.com.curso.aula226.app;

import br.com.curso.aula226.dominio.pedido.Pedido;

public class PedidoBuilderMinimoApp {
    public static void main(String[] args) {
        Pedido pedido = Pedido.builder()
                .codigo("PED-002")
                .cliente("Carlos")
                .valorProdutos("900.00")
                .build();

        System.out.println(pedido.resumo());
    }
}
```

---

# Parte 6 — Builder com validação

## PedidoBuilderInvalidoApp

Crie:

```text
src\br\com\curso\aula226\app\PedidoBuilderInvalidoApp.java
```

Código:

```java
package br.com.curso.aula226.app;

import br.com.curso.aula226.dominio.pedido.Pedido;

public class PedidoBuilderInvalidoApp {
    public static void main(String[] args) {
        try {
            Pedido pedido = Pedido.builder()
                    .codigo("PED-003")
                    .cliente("Maria")
                    .valorProdutos("0.00")
                    .build();

            System.out.println(pedido.resumo());
        } catch (RuntimeException erro) {
            System.out.println("Falha ao criar pedido: " + erro.getMessage());
        }
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula226.app.PedidoBuilderInvalidoApp
```

---

## Observação importante

Builder não dispensa validação.

A entidade ainda deve proteger regra.

O Builder facilita a montagem.

A entidade continua garantindo consistência.

---

# Parte 7 — Builder para DTO/Response

Builder também é útil para responses complexos.

## OrdemServicoResponse

Crie:

```text
src\br\com\curso\aula226\dto\OrdemServicoResponse.java
```

Código:

```java
package br.com.curso.aula226.dto;

import java.util.ArrayList;
import java.util.List;

public class OrdemServicoResponse {
    private final String codigo;
    private final String cliente;
    private final String status;
    private final String tipo;
    private final int prioridade;
    private final String mensagem;
    private final List<String> avisos;

    private OrdemServicoResponse(Builder builder) {
        this.codigo = builder.codigo;
        this.cliente = builder.cliente;
        this.status = builder.status;
        this.tipo = builder.tipo;
        this.prioridade = builder.prioridade;
        this.mensagem = builder.mensagem;
        this.avisos = List.copyOf(builder.avisos);

        validar();
    }

    public static Builder builder() {
        return new Builder();
    }

    private void validar() {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public String status() {
        return status;
    }

    public String tipo() {
        return tipo;
    }

    public int prioridade() {
        return prioridade;
    }

    public String mensagem() {
        return mensagem;
    }

    public List<String> avisos() {
        return avisos;
    }

    @Override
    public String toString() {
        return "OrdemServicoResponse{"
                + "codigo='" + codigo + '\''
                + ", cliente='" + cliente + '\''
                + ", status='" + status + '\''
                + ", tipo='" + tipo + '\''
                + ", prioridade=" + prioridade
                + ", mensagem='" + mensagem + '\''
                + ", avisos=" + avisos
                + '}';
    }

    public static class Builder {
        private String codigo;
        private String cliente;
        private String status;
        private String tipo = "";
        private int prioridade = 0;
        private String mensagem;
        private final List<String> avisos = new ArrayList<>();

        private Builder() {
        }

        public Builder codigo(String codigo) {
            this.codigo = codigo;
            return this;
        }

        public Builder cliente(String cliente) {
            this.cliente = cliente;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public Builder tipo(String tipo) {
            this.tipo = tipo;
            return this;
        }

        public Builder prioridade(int prioridade) {
            this.prioridade = prioridade;
            return this;
        }

        public Builder mensagem(String mensagem) {
            this.mensagem = mensagem;
            return this;
        }

        public Builder adicionarAviso(String aviso) {
            if (aviso != null && !aviso.isBlank()) {
                this.avisos.add(aviso);
            }

            return this;
        }

        public Builder avisos(List<String> avisos) {
            this.avisos.clear();

            if (avisos != null) {
                avisos.stream()
                        .filter(aviso -> aviso != null && !aviso.isBlank())
                        .forEach(this.avisos::add);
            }

            return this;
        }

        public OrdemServicoResponse build() {
            return new OrdemServicoResponse(this);
        }
    }
}
```

---

## OrdemServicoResponseBuilderApp

Crie:

```text
src\br\com\curso\aula226\app\OrdemServicoResponseBuilderApp.java
```

Código:

```java
package br.com.curso.aula226.app;

import br.com.curso.aula226.dto.OrdemServicoResponse;

public class OrdemServicoResponseBuilderApp {
    public static void main(String[] args) {
        OrdemServicoResponse response = OrdemServicoResponse.builder()
                .codigo("OS-2026-000001")
                .cliente("Ana Silva")
                .status("ABERTA")
                .tipo("CRITICA")
                .prioridade(100)
                .mensagem("Ordem de serviço aberta com sucesso.")
                .adicionarAviso("Cliente deve ser avisado no período da manhã.")
                .adicionarAviso("Prioridade crítica aplicada.")
                .build();

        System.out.println(response);
    }
}
```

---

## Como isso conversa com o front

No futuro, uma response como essa pode virar JSON:

```json
{
  "codigo": "OS-2026-000001",
  "cliente": "Ana Silva",
  "status": "ABERTA",
  "tipo": "CRITICA",
  "prioridade": 100,
  "mensagem": "Ordem de serviço aberta com sucesso.",
  "avisos": [
    "Cliente deve ser avisado no período da manhã.",
    "Prioridade crítica aplicada."
  ]
}
```

O Builder ajuda o backend a montar responses complexos com clareza.

---

# Parte 8 — Builder para objeto de teste

Em testes, Builder é muito usado para criar dados.

Antes:

```java
Pedido pedido = new Pedido(... muitos parâmetros ...);
```

Depois:

```java
Pedido pedido = PedidoTesteBuilder.umPedidoVip().build();
```

---

## PedidoTesteBuilder

Crie:

```text
src\br\com\curso\aula226\builder\teste\PedidoTesteBuilder.java
```

Código:

```java
package br.com.curso.aula226.builder.teste;

import br.com.curso.aula226.dominio.pedido.OrigemPedido;
import br.com.curso.aula226.dominio.pedido.Pedido;
import br.com.curso.aula226.dominio.pedido.StatusPedido;

import java.time.Instant;

public class PedidoTesteBuilder {
    private String codigo = "PED-TESTE-001";
    private String cliente = "Cliente Teste";
    private String telefone = "11999999999";
    private String email = "cliente@teste.com";
    private String valorProdutos = "1000.00";
    private String desconto = "0.00";
    private String frete = "0.00";
    private StatusPedido status = StatusPedido.CRIADO;
    private OrigemPedido origem = OrigemPedido.BACKOFFICE;
    private String observacao = "";
    private Instant criadoEm = Instant.parse("2026-07-09T10:00:00Z");
    private Instant atualizadoEm = Instant.parse("2026-07-09T10:00:00Z");

    private PedidoTesteBuilder() {
    }

    public static PedidoTesteBuilder umPedido() {
        return new PedidoTesteBuilder();
    }

    public static PedidoTesteBuilder umPedidoVip() {
        return new PedidoTesteBuilder()
                .cliente("Cliente VIP")
                .valorProdutos("5000.00")
                .origem(OrigemPedido.ECOMMERCE)
                .observacao("Pedido VIP para teste");
    }

    public PedidoTesteBuilder codigo(String codigo) {
        this.codigo = codigo;
        return this;
    }

    public PedidoTesteBuilder cliente(String cliente) {
        this.cliente = cliente;
        return this;
    }

    public PedidoTesteBuilder telefone(String telefone) {
        this.telefone = telefone;
        return this;
    }

    public PedidoTesteBuilder email(String email) {
        this.email = email;
        return this;
    }

    public PedidoTesteBuilder valorProdutos(String valorProdutos) {
        this.valorProdutos = valorProdutos;
        return this;
    }

    public PedidoTesteBuilder desconto(String desconto) {
        this.desconto = desconto;
        return this;
    }

    public PedidoTesteBuilder frete(String frete) {
        this.frete = frete;
        return this;
    }

    public PedidoTesteBuilder status(StatusPedido status) {
        this.status = status;
        return this;
    }

    public PedidoTesteBuilder origem(OrigemPedido origem) {
        this.origem = origem;
        return this;
    }

    public PedidoTesteBuilder observacao(String observacao) {
        this.observacao = observacao;
        return this;
    }

    public Pedido build() {
        return Pedido.builder()
                .codigo(codigo)
                .cliente(cliente)
                .telefone(telefone)
                .email(email)
                .valorProdutos(valorProdutos)
                .desconto(desconto)
                .frete(frete)
                .status(status)
                .origem(origem)
                .observacao(observacao)
                .criadoEm(criadoEm)
                .atualizadoEm(atualizadoEm)
                .build();
    }
}
```

---

## PedidoTesteBuilderApp

Crie:

```text
src\br\com\curso\aula226\app\PedidoTesteBuilderApp.java
```

Código:

```java
package br.com.curso.aula226.app;

import br.com.curso.aula226.builder.teste.PedidoTesteBuilder;
import br.com.curso.aula226.dominio.pedido.Pedido;

public class PedidoTesteBuilderApp {
    public static void main(String[] args) {
        Pedido pedidoPadrao = PedidoTesteBuilder.umPedido().build();

        Pedido pedidoVip = PedidoTesteBuilder.umPedidoVip()
                .codigo("PED-VIP-001")
                .frete("20.00")
                .build();

        System.out.println(pedidoPadrao.resumo());
        System.out.println(pedidoVip.resumo());
    }
}
```

---

## Importante

Esse tipo de Builder é muito comum em testes.

Mais para frente, quando entrarmos em JUnit, você vai usar muito essa ideia.

Ela reduz repetição e deixa testes mais legíveis.

---

# Parte 9 — Builder e imutabilidade

Builder combina muito bem com objetos imutáveis.

No exemplo `Pedido`, os campos são `final`.

Depois de criado, o objeto não muda diretamente.

Isso traz benefícios:

```text
menos efeito colateral;
mais segurança;
mais previsibilidade;
melhor para testes;
melhor para concorrência;
mais fácil raciocinar.
```

Mas atenção:

```text
nem todo objeto de domínio precisa ser 100% imutável.
```

Entidades com ciclo de vida, como OS e Pedido, muitas vezes têm métodos de transição:

```text
faturar;
cancelar;
concluir;
reagendar.
```

Nesses casos, você pode usar Builder para criação e métodos de domínio para mudança controlada.

---

# Parte 10 — Builder vs Factory

## Factory

Factory responde:

```text
qual objeto criar?
como centralizar criação?
qual implementação escolher?
como montar dependências?
```

Exemplo:

```java
AbrirOrdemServicoUseCaseFactory.criarComWhatsApp()
```

---

## Builder

Builder responde:

```text
como montar um objeto complexo passo a passo?
como lidar com muitos campos opcionais?
como evitar construtor gigante?
```

Exemplo:

```java
Pedido.builder()
        .codigo("PED-001")
        .cliente("Ana")
        .valorProdutos("1500.00")
        .build();
```

---

## Eles podem trabalhar juntos

Factory pode usar Builder internamente.

Exemplo conceitual:

```java
public class PedidoFactory {
    public static Pedido criarPedidoEcommerce(String codigo, String cliente, String valor) {
        return Pedido.builder()
                .codigo(codigo)
                .cliente(cliente)
                .valorProdutos(valor)
                .origem(OrigemPedido.ECOMMERCE)
                .build();
    }
}
```

Factory define intenção.

Builder monta objeto.

---

# Parte 11 — Builder e Lombok

Em projetos Java reais, você pode ver:

```java
@Builder
public class Pedido {
}
```

Isso é Lombok.

Lombok gera o Builder automaticamente em tempo de compilação.

Mas é fundamental entender o Builder manual primeiro.

Porque assim você entende:

```text
o que o Lombok gera;
quais campos são obrigatórios;
onde validar;
quais defaults usar;
quais riscos existem.
```

Não use Lombok como mágica.

Entenda o padrão.

---

# Parte 12 — Erros comuns com Builder

## 1. Builder sem validação

Ruim:

```text
build cria objeto inválido.
```

A entidade ou o build devem impedir inconsistência.

---

## 2. Builder para objeto simples

Ruim:

```java
Produto.builder().nome("TV").build();
```

Se só tem um campo, talvez não faça sentido.

---

## 3. Builder com regra de fluxo

Builder não deve:

```text
salvar no banco;
enviar e-mail;
auditar;
chamar API;
executar use case.
```

Builder constrói.

---

## 4. Builder permitindo estado impossível

Exemplo:

```text
status CONCLUIDO sem data de conclusão;
valor negativo;
pedido faturado sem pagamento;
OS concluída sem atendimento.
```

A validação ainda importa.

---

## 5. Builder escondendo obrigatórios

Se tudo é opcional no Builder, o erro aparece tarde.

Você pode melhorar a API do Builder, mas nesta fase o mais importante é validar no build.

---

# Parte 13 — Checklist para usar Builder

Pergunte:

```text
1. O construtor tem muitos parâmetros?
2. Existem muitos campos opcionais?
3. Existem muitos parâmetros do mesmo tipo?
4. A criação está difícil de ler?
5. O objeto precisa de defaults?
6. O objeto é usado muito em testes?
7. O Builder vai melhorar clareza?
8. O Builder vai evitar erro de ordem?
9. Existe validação no build?
10. Estou usando Builder por necessidade ou por moda?
```

---

# Parte 14 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula226.app.PedidoRuimApp
java -cp out br.com.curso.aula226.app.PedidoBuilderApp
java -cp out br.com.curso.aula226.app.PedidoBuilderMinimoApp
java -cp out br.com.curso.aula226.app.PedidoBuilderInvalidoApp
java -cp out br.com.curso.aula226.app.OrdemServicoResponseBuilderApp
java -cp out br.com.curso.aula226.app.PedidoTesteBuilderApp
```

Depois responda:

```text
1. Qual era o problema do PedidoRuim?
2. O que o Builder melhorou?
3. Quais campos tinham default?
4. Onde a validação ocorreu?
5. Por que Builder ajuda com muitos Strings?
6. Como Builder ajuda em testes?
7. Qual diferença entre Builder e Factory?
8. Builder deve salvar no banco?
9. Quando Builder seria exagerado?
10. Como Lombok se relaciona com Builder?
```

---

# Parte 15 — Exercício prático principal

## Contexto

Crie um objeto complexo:

```text
Contrato
```

Campos:

```text
String codigo;
String cliente;
String tipoContrato;
LocalDate inicioVigencia;
LocalDate fimVigencia;
BigDecimal valorMensal;
boolean ativo;
String observacao;
String canalOrigem;
String usuarioCriacao;
Instant criadoEm;
```

---

## Regras

Obrigatórios:

```text
codigo;
cliente;
tipoContrato;
inicioVigencia;
valorMensal;
usuarioCriacao;
criadoEm.
```

Defaults:

```text
ativo = true;
observacao = "";
canalOrigem = "BACKOFFICE";
fimVigencia = null;
```

Validações:

```text
valorMensal maior que zero;
fimVigencia, se informado, não pode ser antes de inicioVigencia;
codigo não pode ser vazio;
cliente não pode ser vazio.
```

---

## Tarefa

Crie:

```text
Contrato
```

com Builder interno.

Crie apps:

```text
ContratoBuilderCompletoApp;
ContratoBuilderMinimoApp;
ContratoBuilderInvalidoApp.
```

---

## Perguntas

```text
1. Quais campos são obrigatórios?
2. Quais campos têm default?
3. O Builder melhorou a leitura?
4. O que aconteceria com um construtor gigante?
5. Onde você colocou validação?
```

---

# Parte 16 — Desafio extra

## Test Data Builder

Crie:

```text
ContratoTesteBuilder
```

Métodos:

```java
umContrato();
umContratoAtivo();
umContratoInativo();
umContratoVencido();
comCliente(String cliente);
comValorMensal(String valor);
```

Objetivo:

```text
preparar objetos para testes futuros.
```

Use o Builder do domínio internamente.

---

# Parte 17 — Simulado rápido

## Questão 1

Builder é mais útil quando:

```text
A) objeto tem muitos campos ou muitos opcionais.
B) classe tem apenas um campo simples.
C) queremos salvar no banco.
D) queremos substituir repository.
```

---

## Questão 2

Qual problema Builder ajuda a resolver?

```text
A) construtor gigante e difícil de ler.
B) falta de package.
C) erro de import.
D) ausência de System.out.println.
```

---

## Questão 3

Builder deve:

```text
A) construir objeto.
B) executar use case completo.
C) salvar no banco.
D) enviar WhatsApp.
```

---

## Questão 4

Factory e Builder são iguais?

```text
A) Não. Factory centraliza criação/escolha; Builder monta objeto complexo passo a passo.
B) Sim, sempre são a mesma coisa.
C) Builder é banco de dados.
D) Factory é DTO.
```

---

## Questão 5

Builder sem validação pode:

```text
A) criar objeto inválido.
B) melhorar tudo automaticamente.
C) substituir entidade.
D) eliminar regra de negócio.
```

---

## Questão 6

Builder em testes ajuda porque:

```text
A) reduz repetição e facilita criar cenários.
B) impede usar Java.
C) substitui todos os asserts.
D) remove necessidade de domínio.
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

# Parte 18 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Builder Pattern.
[ ] Sei identificar construtor gigante.
[ ] Sei criar Builder manual.
[ ] Sei usar métodos fluentes.
[ ] Sei definir campos obrigatórios.
[ ] Sei definir defaults.
[ ] Sei validar no build.
[ ] Sei usar Builder em domínio.
[ ] Sei usar Builder em response.
[ ] Sei usar Test Data Builder.
[ ] Sei diferenciar Builder de Factory.
[ ] Sei quando Builder é exagerado.
[ ] Sei como Lombok @Builder se relaciona com isso.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Builder Pattern?
2. Qual problema ele resolve?
3. O que é construtor telescópico?
4. Por que muitos parâmetros String são perigosos?
5. Como Builder melhora legibilidade?
6. Onde validar objeto criado?
7. Qual diferença entre Builder e Factory?
8. Como Builder ajuda em testes?
9. Quando não usar Builder?
10. Como isso aparece em projetos com Lombok?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
refatorar construtor gigante para Builder;
criar Builder com defaults;
criar Builder com validação;
criar objeto de domínio com Builder;
criar response com Builder;
criar Test Data Builder;
explicar diferença entre Factory e Builder;
resolver o exercício de Contrato.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-226-builder-pattern-objetos-complexos-construcao-fluente
git commit -m "Aula 226: builder pattern objetos complexos construcao fluente"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Builder melhora a criação de objetos complexos, deixando a montagem mais legível, segura e flexível.
```

Você estudou:

```text
Builder Pattern;
construtor gigante;
construtor telescópico;
métodos fluentes;
defaults;
validação;
objeto imutável;
response builder;
test data builder;
diferença entre Builder e Factory;
uso futuro com Lombok.
```

Na próxima aula, vamos estudar:

```text
Adapter Pattern.
```

A ideia será entender como adaptar APIs externas, sistemas legados e bibliotecas para contratos internos do backend sem contaminar o domínio e o use case.
