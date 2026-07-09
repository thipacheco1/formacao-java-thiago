# 252 — M11.08 — JUnit 5 avançado: testes parametrizados, nested tests, tags e organização profissional

## Objetivo da aula

Na aula anterior, você estudou a base do JUnit 5:

```text
teste automatizado;
teste unitário;
JUnit Jupiter;
@Test;
assertions;
assertThrows;
assertAll;
@BeforeEach;
@AfterEach;
@BeforeAll;
@AfterAll;
@DisplayName;
padrão AAA;
testes de domínio;
testes de exceção.
```

Agora vamos aprofundar recursos mais avançados do JUnit 5, usados para deixar os testes mais organizados, expressivos e profissionais.

Nesta aula, vamos estudar:

```text
testes parametrizados;
@ParameterizedTest;
@ValueSource;
@CsvSource;
@CsvFileSource;
@MethodSource;
@EnumSource;
@NullSource;
@EmptySource;
@NullAndEmptySource;
@Nested;
@Tag;
@Disabled;
@TestInfo;
assumptions;
organização de suítes;
nomes de cenários;
boas práticas;
erros comuns;
testes mais próximos de backend real.
```

Ao final desta aula, você deve conseguir:

```text
evitar repetição em testes parecidos;
criar testes parametrizados;
testar vários valores de entrada;
testar enums;
testar combinações de dados;
organizar cenários com @Nested;
separar testes por tags;
desabilitar testes com justificativa;
usar TestInfo;
usar assumptions;
melhorar legibilidade;
estruturar testes de regra de negócio;
preparar base para Mockito, TDD e testes com Spring.
```

---

## Reforço do objetivo maior

Nosso objetivo é formar uma base completa, do básico ao nível engenheiro/arquiteto Java.

Por isso, quando falamos de testes, não estamos falando apenas de decorar anotações.

Estamos falando de qualidade técnica.

Um profissional avançado precisa saber:

```text
reduzir duplicação nos testes;
organizar cenários complexos;
separar testes rápidos de testes lentos;
rodar subconjuntos no pipeline;
dar nomes claros para regras;
testar combinações de entrada;
testar bordas;
testar erros;
escrever testes que documentam comportamento;
evitar testes frágeis;
usar recursos da ferramenta com critério.
```

JUnit avançado ajuda nessa maturidade.

---

# Parte 1 — Por que avançar no JUnit

Com JUnit básico, você já consegue testar muita coisa.

Mas conforme o sistema cresce, aparecem problemas:

```text
muitos testes repetidos;
muitos cenários parecidos;
nomes confusos;
classes de teste enormes;
regras com várias combinações;
testes lentos misturados com rápidos;
testes temporariamente quebrados sem justificativa;
dificuldade para rodar só um grupo;
duplicação de arrange;
falhas difíceis de ler.
```

Os recursos avançados ajudam a resolver esses problemas.

---

## Exemplo de repetição

Teste repetitivo:

```java
@Test
void deveAceitarStatusCriado() {
    assertTrue(validador.valido("CRIADO"));
}

@Test
void deveAceitarStatusPago() {
    assertTrue(validador.valido("PAGO"));
}

@Test
void deveAceitarStatusCancelado() {
    assertTrue(validador.valido("CANCELADO"));
}
```

Com teste parametrizado:

```java
@ParameterizedTest
@ValueSource(strings = {"CRIADO", "PAGO", "CANCELADO"})
void deveAceitarStatusValido(String status) {
    assertTrue(validador.valido(status));
}
```

Mais limpo.

---

# Parte 2 — Dependência necessária

Para testes parametrizados, adicione também:

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-params</artifactId>
    <version>${junit.version}</version>
    <scope>test</scope>
</dependency>
```

Mas atenção:

Se você usa:

```xml
<artifactId>junit-jupiter</artifactId>
```

normalmente ele já traz os módulos principais, incluindo params, dependendo da versão/distribuição.

Para deixar didático e explícito nesta aula, vamos declarar.

---

# Parte 3 — Estrutura do laboratório

Crie:

```powershell
mkdir labs\m11\aula-252-junit5-avancado
cd labs\m11\aula-252-junit5-avancado
mkdir src\main\java\br\com\curso\aula252
mkdir src\test\java\br\com\curso\aula252
mkdir src\test\resources
```

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
    <artifactId>aula-252-junit5-avancado</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <junit.version>5.10.2</junit.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-params</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
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
                <configuration>
                    <groups>unit</groups>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## Observação sobre groups

A configuração:

```xml
<groups>unit</groups>
```

faz o Surefire rodar apenas testes com tag `unit`.

Nesta aula, vamos usar tags.

Se quiser rodar todos os testes ignorando filtro de tag, remova temporariamente essa configuração ou use comandos específicos.

Mais abaixo veremos alternativas.

---

# Parte 4 — Classe de domínio para testar

Crie:

```text
src/main/java/br/com/curso/aula252/TipoCliente.java
```

Código:

```java
package br.com.curso.aula252;

public enum TipoCliente {
    COMUM,
    VIP,
    CORPORATIVO
}
```

Crie:

```text
src/main/java/br/com/curso/aula252/StatusPedido.java
```

Código:

```java
package br.com.curso.aula252;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO,
    ENTREGUE
}
```

Crie:

```text
src/main/java/br/com/curso/aula252/Pedido.java
```

Código:

```java
package br.com.curso.aula252;

import java.math.BigDecimal;

public class Pedido {
    private final String codigo;
    private final BigDecimal valor;
    private final TipoCliente tipoCliente;
    private StatusPedido status;

    public Pedido(String codigo, BigDecimal valor, TipoCliente tipoCliente) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (tipoCliente == null) {
            throw new IllegalArgumentException("Tipo de cliente é obrigatório.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.valor = valor;
        this.tipoCliente = tipoCliente;
        this.status = StatusPedido.CRIADO;
    }

    public Pedido(String codigo, String valor, TipoCliente tipoCliente) {
        this(codigo, new BigDecimal(valor), tipoCliente);
    }

    public void pagar() {
        if (status == StatusPedido.CANCELADO) {
            throw new IllegalStateException("Pedido cancelado não pode ser pago.");
        }

        if (status == StatusPedido.PAGO) {
            throw new IllegalStateException("Pedido já está pago.");
        }

        if (status == StatusPedido.ENTREGUE) {
            throw new IllegalStateException("Pedido entregue não pode ser pago novamente.");
        }

        status = StatusPedido.PAGO;
    }

    public void cancelar() {
        if (status == StatusPedido.PAGO) {
            throw new IllegalStateException("Pedido pago não pode ser cancelado.");
        }

        if (status == StatusPedido.ENTREGUE) {
            throw new IllegalStateException("Pedido entregue não pode ser cancelado.");
        }

        if (status == StatusPedido.CANCELADO) {
            throw new IllegalStateException("Pedido já está cancelado.");
        }

        status = StatusPedido.CANCELADO;
    }

    public void entregar() {
        if (status != StatusPedido.PAGO) {
            throw new IllegalStateException("Somente pedido pago pode ser entregue.");
        }

        status = StatusPedido.ENTREGUE;
    }

    public String codigo() {
        return codigo;
    }

    public BigDecimal valor() {
        return valor;
    }

    public TipoCliente tipoCliente() {
        return tipoCliente;
    }

    public StatusPedido status() {
        return status;
    }
}
```

---

# Parte 5 — Calculadora de desconto

Crie:

```text
src/main/java/br/com/curso/aula252/CalculadoraDesconto.java
```

Código:

```java
package br.com.curso.aula252;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class CalculadoraDesconto {
    public BigDecimal calcular(BigDecimal valor, TipoCliente tipoCliente) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        if (valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (tipoCliente == null) {
            throw new IllegalArgumentException("Tipo de cliente é obrigatório.");
        }

        BigDecimal percentual = percentualPara(tipoCliente, valor);

        return valor.multiply(percentual).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal percentualPara(TipoCliente tipoCliente, BigDecimal valor) {
        if (valor.compareTo(new BigDecimal("500.00")) <= 0) {
            return BigDecimal.ZERO;
        }

        return switch (tipoCliente) {
            case COMUM -> new BigDecimal("0.05");
            case VIP -> new BigDecimal("0.10");
            case CORPORATIVO -> new BigDecimal("0.15");
        };
    }
}
```

---

# Parte 6 — Validador de texto

Crie:

```text
src/main/java/br/com/curso/aula252/ValidadorTexto.java
```

Código:

```java
package br.com.curso.aula252;

public class ValidadorTexto {
    public boolean preenchido(String texto) {
        return texto != null && !texto.isBlank();
    }

    public boolean tamanhoEntre(String texto, int minimo, int maximo) {
        if (texto == null) {
            return false;
        }

        if (minimo < 0) {
            throw new IllegalArgumentException("Tamanho mínimo não pode ser negativo.");
        }

        if (maximo < minimo) {
            throw new IllegalArgumentException("Tamanho máximo não pode ser menor que o mínimo.");
        }

        int tamanho = texto.trim().length();

        return tamanho >= minimo && tamanho <= maximo;
    }
}
```

---

# Parte 7 — @ParameterizedTest

`@ParameterizedTest` permite rodar o mesmo teste várias vezes com dados diferentes.

Exemplo:

```java
@ParameterizedTest
@ValueSource(strings = {"Ana", "Carlos", "Maria"})
void deveAceitarNomesPreenchidos(String nome) {
    ValidadorTexto validador = new ValidadorTexto();

    assertTrue(validador.preenchido(nome));
}
```

Esse teste roda 3 vezes.

Uma vez para cada valor.

---

## Diferença para @Test

```text
@Test:
roda uma vez.

@ParameterizedTest:
roda várias vezes com parâmetros diferentes.
```

---

# Parte 8 — @ValueSource

Use `@ValueSource` para valores simples.

Tipos suportados incluem:

```text
strings;
ints;
longs;
doubles;
booleans;
chars;
classes.
```

Crie:

```text
src/test/java/br/com/curso/aula252/ValidadorTextoValueSourceTest.java
```

Código:

```java
package br.com.curso.aula252;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Tag("unit")
class ValidadorTextoValueSourceTest {
    private final ValidadorTexto validador = new ValidadorTexto();

    @ParameterizedTest
    @ValueSource(strings = {"Ana", "Carlos", "Maria", "Backend Java"})
    void deveRetornarVerdadeiroParaTextosPreenchidos(String texto) {
        assertTrue(validador.preenchido(texto));
    }

    @ParameterizedTest
    @ValueSource(strings = {"", " ", "     "})
    void deveRetornarFalsoParaTextosVaziosOuEmBranco(String texto) {
        assertFalse(validador.preenchido(texto));
    }

    @ParameterizedTest
    @ValueSource(ints = {2, 4, 6, 8, 10})
    void deveValidarNumerosPares(int numero) {
        assertTrue(numero % 2 == 0);
    }
}
```

Execute:

```powershell
mvn test
```

---

# Parte 9 — @NullSource, @EmptySource e @NullAndEmptySource

Para testar nulos e vazios:

```text
@NullSource:
envia null.

@EmptySource:
envia valor vazio.

@NullAndEmptySource:
envia null e vazio.
```

Crie:

```text
src/test/java/br/com/curso/aula252/ValidadorTextoNullEmptyTest.java
```

Código:

```java
package br.com.curso.aula252;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EmptySource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.NullSource;

import static org.junit.jupiter.api.Assertions.assertFalse;

@Tag("unit")
class ValidadorTextoNullEmptyTest {
    private final ValidadorTexto validador = new ValidadorTexto();

    @ParameterizedTest
    @NullSource
    void deveRetornarFalsoParaTextoNulo(String texto) {
        assertFalse(validador.preenchido(texto));
    }

    @ParameterizedTest
    @EmptySource
    void deveRetornarFalsoParaTextoVazio(String texto) {
        assertFalse(validador.preenchido(texto));
    }

    @ParameterizedTest
    @NullAndEmptySource
    void deveRetornarFalsoParaTextoNuloOuVazio(String texto) {
        assertFalse(validador.preenchido(texto));
    }
}
```

---

## Atenção

`@EmptySource` para String envia:

```text
""
```

Mas não envia:

```text
" "
```

Para branco com espaços, use `@ValueSource`.

---

# Parte 10 — @CsvSource

`@CsvSource` permite passar múltiplos valores por linha.

Exemplo:

```java
@ParameterizedTest
@CsvSource({
    "COMUM, 1000.00, 50.00",
    "VIP, 1000.00, 100.00"
})
void deveCalcularDesconto(TipoCliente tipo, String valor, String esperado) {
}
```

Crie:

```text
src/test/java/br/com/curso/aula252/CalculadoraDescontoCsvSourceTest.java
```

Código:

```java
package br.com.curso.aula252;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

@Tag("unit")
class CalculadoraDescontoCsvSourceTest {
    private final CalculadoraDesconto calculadora = new CalculadoraDesconto();

    @ParameterizedTest(name = "cliente={0}, valor={1}, desconto esperado={2}")
    @CsvSource({
            "COMUM, 1000.00, 50.00",
            "VIP, 1000.00, 100.00",
            "CORPORATIVO, 1000.00, 150.00",
            "COMUM, 500.00, 0.00",
            "VIP, 500.00, 0.00",
            "CORPORATIVO, 500.00, 0.00"
    })
    void deveCalcularDescontoPorTipoClienteEValor(
            TipoCliente tipoCliente,
            String valor,
            String descontoEsperado
    ) {
        BigDecimal desconto = calculadora.calcular(new BigDecimal(valor), tipoCliente);

        assertEquals(new BigDecimal(descontoEsperado), desconto);
    }
}
```

---

## name no @ParameterizedTest

O trecho:

```java
@ParameterizedTest(name = "cliente={0}, valor={1}, desconto esperado={2}")
```

deixa a execução mais legível no relatório.

`{0}`, `{1}`, `{2}` representam os parâmetros.

---

# Parte 11 — @CsvFileSource

`@CsvFileSource` lê dados de arquivo CSV.

Crie arquivo:

```text
src/test/resources/descontos.csv
```

Conteúdo:

```csv
tipo,valor,desconto
COMUM,1000.00,50.00
VIP,1000.00,100.00
CORPORATIVO,1000.00,150.00
COMUM,500.00,0.00
VIP,500.00,0.00
CORPORATIVO,500.00,0.00
```

Crie:

```text
src/test/java/br/com/curso/aula252/CalculadoraDescontoCsvFileSourceTest.java
```

Código:

```java
package br.com.curso.aula252;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

@Tag("unit")
class CalculadoraDescontoCsvFileSourceTest {
    private final CalculadoraDesconto calculadora = new CalculadoraDesconto();

    @ParameterizedTest(name = "CSV cliente={0}, valor={1}, desconto={2}")
    @CsvFileSource(resources = "/descontos.csv", numLinesToSkip = 1)
    void deveCalcularDescontoUsandoArquivoCsv(
            TipoCliente tipoCliente,
            String valor,
            String descontoEsperado
    ) {
        BigDecimal desconto = calculadora.calcular(new BigDecimal(valor), tipoCliente);

        assertEquals(new BigDecimal(descontoEsperado), desconto);
    }
}
```

---

## Quando usar CSV externo

Use quando:

```text
há muitos cenários;
os dados são mais importantes que a lógica do teste;
quer facilitar leitura de combinações;
quer separar massa de teste.
```

Evite exagerar.

Para poucos casos, `@CsvSource` pode ser mais simples.

---

# Parte 12 — @EnumSource

`@EnumSource` testa valores de enum.

Crie:

```text
src/test/java/br/com/curso/aula252/StatusPedidoEnumSourceTest.java
```

Código:

```java
package br.com.curso.aula252;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Tag("unit")
class StatusPedidoEnumSourceTest {
    @ParameterizedTest
    @EnumSource(StatusPedido.class)
    void todosOsStatusDevemTerNome(StatusPedido status) {
        assertNotNull(status.name());
        assertTrue(status.name().length() > 0);
    }

    @ParameterizedTest
    @EnumSource(value = StatusPedido.class, names = {"PAGO", "ENTREGUE"})
    void deveConsiderarStatusFinalizados(StatusPedido status) {
        assertTrue(status == StatusPedido.PAGO || status == StatusPedido.ENTREGUE);
    }
}
```

---

## Uso real

`@EnumSource` é útil para:

```text
testar todos os status;
testar subconjunto de enums;
garantir comportamento para cada tipo;
evitar esquecer novo enum.
```

---

# Parte 13 — @MethodSource

`@MethodSource` permite fornecer dados por método.

É mais flexível.

Crie:

```text
src/test/java/br/com/curso/aula252/CalculadoraDescontoMethodSourceTest.java
```

Código:

```java
package br.com.curso.aula252;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.math.BigDecimal;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

@Tag("unit")
class CalculadoraDescontoMethodSourceTest {
    private final CalculadoraDesconto calculadora = new CalculadoraDesconto();

    static Stream<CenarioDesconto> cenariosDeDesconto() {
        return Stream.of(
                new CenarioDesconto(TipoCliente.COMUM, "1000.00", "50.00"),
                new CenarioDesconto(TipoCliente.VIP, "1000.00", "100.00"),
                new CenarioDesconto(TipoCliente.CORPORATIVO, "1000.00", "150.00"),
                new CenarioDesconto(TipoCliente.COMUM, "400.00", "0.00"),
                new CenarioDesconto(TipoCliente.VIP, "400.00", "0.00"),
                new CenarioDesconto(TipoCliente.CORPORATIVO, "400.00", "0.00")
        );
    }

    @ParameterizedTest(name = "{0}")
    @MethodSource("cenariosDeDesconto")
    void deveCalcularDescontoComMethodSource(CenarioDesconto cenario) {
        BigDecimal desconto = calculadora.calcular(cenario.valor(), cenario.tipoCliente());

        assertEquals(cenario.descontoEsperado(), desconto);
    }

    record CenarioDesconto(
            TipoCliente tipoCliente,
            String valorTexto,
            String descontoEsperadoTexto
    ) {
        BigDecimal valor() {
            return new BigDecimal(valorTexto);
        }

        BigDecimal descontoEsperado() {
            return new BigDecimal(descontoEsperadoTexto);
        }

        @Override
        public String toString() {
            return "tipo=" + tipoCliente + ", valor=" + valorTexto + ", esperado=" + descontoEsperadoTexto;
        }
    }
}
```

---

## Quando usar MethodSource

Use quando:

```text
cenário é complexo;
precisa criar objetos;
precisa usar records;
precisa montar listas;
precisa deixar dados mais expressivos;
CSV ficaria pobre demais.
```

---

# Parte 14 — @Nested

`@Nested` organiza testes em grupos internos.

É útil para cenários por contexto.

Exemplo:

```text
PedidoTest
  Criação
  Pagamento
  Cancelamento
  Entrega
```

Crie:

```text
src/test/java/br/com/curso/aula252/PedidoNestedTest.java
```

Código:

```java
package br.com.curso.aula252;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@Tag("unit")
@DisplayName("Pedido")
class PedidoNestedTest {
    @Nested
    @DisplayName("Criação")
    class Criacao {
        @Test
        @DisplayName("deve criar pedido com status CRIADO")
        void deveCriarPedidoComStatusCriado() {
            Pedido pedido = new Pedido("ped-001", "100.00", TipoCliente.COMUM);

            assertEquals(StatusPedido.CRIADO, pedido.status());
            assertEquals("PED-001", pedido.codigo());
        }

        @Test
        @DisplayName("não deve criar pedido sem código")
        void naoDeveCriarPedidoSemCodigo() {
            IllegalArgumentException erro = assertThrows(
                    IllegalArgumentException.class,
                    () -> new Pedido("", "100.00", TipoCliente.COMUM)
            );

            assertEquals("Código é obrigatório.", erro.getMessage());
        }
    }

    @Nested
    @DisplayName("Pagamento")
    class Pagamento {
        @Test
        @DisplayName("deve pagar pedido criado")
        void devePagarPedidoCriado() {
            Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);

            pedido.pagar();

            assertEquals(StatusPedido.PAGO, pedido.status());
        }

        @Test
        @DisplayName("não deve pagar pedido cancelado")
        void naoDevePagarPedidoCancelado() {
            Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);
            pedido.cancelar();

            IllegalStateException erro = assertThrows(
                    IllegalStateException.class,
                    pedido::pagar
            );

            assertEquals("Pedido cancelado não pode ser pago.", erro.getMessage());
        }
    }

    @Nested
    @DisplayName("Cancelamento")
    class Cancelamento {
        @Test
        @DisplayName("deve cancelar pedido criado")
        void deveCancelarPedidoCriado() {
            Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);

            pedido.cancelar();

            assertEquals(StatusPedido.CANCELADO, pedido.status());
        }

        @Test
        @DisplayName("não deve cancelar pedido pago")
        void naoDeveCancelarPedidoPago() {
            Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);
            pedido.pagar();

            IllegalStateException erro = assertThrows(
                    IllegalStateException.class,
                    pedido::cancelar
            );

            assertEquals("Pedido pago não pode ser cancelado.", erro.getMessage());
        }
    }

    @Nested
    @DisplayName("Entrega")
    class Entrega {
        @Test
        @DisplayName("deve entregar pedido pago")
        void deveEntregarPedidoPago() {
            Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);
            pedido.pagar();

            pedido.entregar();

            assertEquals(StatusPedido.ENTREGUE, pedido.status());
        }

        @Test
        @DisplayName("não deve entregar pedido criado")
        void naoDeveEntregarPedidoCriado() {
            Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);

            IllegalStateException erro = assertThrows(
                    IllegalStateException.class,
                    pedido::entregar
            );

            assertEquals("Somente pedido pago pode ser entregue.", erro.getMessage());
        }
    }
}
```

---

## Quando usar @Nested

Use quando:

```text
classe tem muitos cenários;
quer agrupar por comportamento;
quer relatório mais legível;
quer separar contextos;
quer documentar regra por bloco.
```

Evite se a classe de teste é pequena.

---

# Parte 15 — @Tag

`@Tag` permite categorizar testes.

Exemplos:

```java
@Tag("unit")
@Tag("integration")
@Tag("slow")
@Tag("fast")
@Tag("domain")
```

Nesta aula usamos:

```java
@Tag("unit")
```

Para rodar por tag com Maven Surefire, podemos configurar no POM:

```xml
<groups>unit</groups>
```

Ou via linha de comando, dependendo da configuração:

```powershell
mvn test -Dgroups=unit
```

Para excluir:

```powershell
mvn test -DexcludedGroups=slow
```

---

## Uso profissional de tags

Tags são úteis para pipeline.

Exemplo:

```text
unit:
roda em todo commit.

integration:
roda em PR ou pipeline específico.

slow:
roda à noite ou antes de release.

contract:
roda em validação de contrato.
```

---

# Parte 16 — @Disabled

`@Disabled` desabilita teste.

Exemplo:

```java
@Disabled("Aguardando definição da regra XPTO")
@Test
void deveTestarRegraFutura() {
}
```

Crie:

```text
src/test/java/br/com/curso/aula252/TesteDesabilitadoExemploTest.java
```

Código:

```java
package br.com.curso.aula252;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

@Tag("unit")
class TesteDesabilitadoExemploTest {
    @Disabled("Exemplo didático: teste desabilitado deve sempre ter justificativa.")
    @Test
    void testeTemporariamenteDesabilitado() {
        throw new RuntimeException("Este teste não será executado.");
    }
}
```

---

## Regra profissional

Nunca deixe teste desabilitado sem justificativa.

Ruim:

```java
@Disabled
```

Melhor:

```java
@Disabled("Aguardando ajuste da API externa no ticket XPTO-123")
```

Teste desabilitado esquecido vira dívida técnica.

---

# Parte 17 — TestInfo

`TestInfo` permite acessar informações do teste atual.

Crie:

```text
src/test/java/br/com/curso/aula252/TestInfoExemploTest.java
```

Código:

```java
package br.com.curso.aula252;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;

import static org.junit.jupiter.api.Assertions.assertTrue;

@Tag("unit")
class TestInfoExemploTest {
    @Test
    void deveAcessarInformacoesDoTeste(TestInfo testInfo) {
        assertTrue(testInfo.getDisplayName().contains("deveAcessarInformacoesDoTeste"));
        assertTrue(testInfo.getTags().contains("unit"));
    }
}
```

---

## Uso real

`TestInfo` é menos comum no dia a dia, mas pode ser útil para:

```text
logs de teste;
diagnóstico;
extensões;
relatórios customizados;
comportamento baseado em metadados.
```

Use com critério.

---

# Parte 18 — Assumptions

Assumptions permitem executar teste apenas se uma condição for verdadeira.

Exemplo:

```java
assumeTrue(condicao);
```

Se a condição for falsa, o teste é abortado, não falha.

Crie:

```text
src/test/java/br/com/curso/aula252/AssumptionsExemploTest.java
```

Código:

```java
package br.com.curso.aula252;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assumptions.assumeTrue;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Tag("unit")
class AssumptionsExemploTest {
    @Test
    void deveExecutarSomenteQuandoAmbienteLocal() {
        String ambiente = System.getProperty("ambiente", "local");

        assumeTrue("local".equals(ambiente));

        assertTrue(true);
    }
}
```

Execute normalmente:

```powershell
mvn test
```

Com outro ambiente:

```powershell
mvn test -Dambiente=ci
```

Esse teste será abortado.

---

## Quando usar assumptions

Use quando teste depende de condição externa controlada:

```text
sistema operacional;
ambiente;
variável;
perfil;
recurso disponível.
```

Mas cuidado.

Se usar demais, pode esconder falta de cobertura.

---

# Parte 19 — Organização profissional de testes

Conforme o projeto cresce, organize testes por camada.

Exemplo futuro:

```text
domain
  PedidoTest
  CalculadoraDescontoTest

application
  CriarPedidoUseCaseTest
  CancelarPedidoUseCaseTest

infra
  PedidoRepositoryTest

api
  PedidoControllerTest
```

No começo, siga:

```text
classe principal -> classe de teste correspondente.
```

Exemplo:

```text
CalculadoraDesconto.java
CalculadoraDescontoTest.java
```

---

# Parte 20 — Testes parametrizados e clareza

Teste parametrizado não deve virar bagunça.

Ruim:

```java
@CsvSource({
    "A, 1, true, X, 10, XPTO, false"
})
```

Se a linha fica incompreensível, prefira:

```text
MethodSource com objeto de cenário;
classe/record de cenário;
vários testes menores.
```

Regra:

```text
reduza duplicação sem sacrificar leitura.
```

---

# Parte 21 — Erros comuns

## 1. Parametrizar tudo

Nem todo teste precisa ser parametrizado.

Se são dois cenários muito diferentes, faça dois testes.

---

## 2. CSV confuso

Se muitos campos estão em CSV, fica difícil ler.

Use `MethodSource`.

---

## 3. Teste genérico demais

Ruim:

```text
deveValidarTudo
```

Melhor:

```text
deveAplicarDezPorCentoParaClienteVipAcimaDeQuinhentos
```

---

## 4. Tags sem padrão

Se cada dev cria tags diferentes, vira bagunça.

Defina padrão do time:

```text
unit;
integration;
slow;
contract.
```

---

## 5. Disabled esquecido

Teste desabilitado sem ticket ou justificativa vira risco.

---

# Parte 22 — Como isso prepara Mockito

Com Mockito, vamos testar classes com dependências.

Exemplo futuro:

```text
CriarPedidoUseCase depende de PedidoRepository.
```

JUnit organiza teste.

Mockito simula repository.

JUnit avançado ajuda com:

```text
Nested para cenários;
ParameterizedTest para entradas;
Tags para separar unit/integration;
DisplayName para relatório;
assertThrows para erros;
BeforeEach para preparar mocks.
```

---

# Parte 23 — Como isso prepara Spring

Em Spring, os testes serão mais variados.

Você verá:

```text
@Tag("unit");
@Tag("integration");
@SpringBootTest;
@WebMvcTest;
@DataJpaTest;
@Nested;
@DisplayName;
testes parametrizados para validações;
testes de controller;
testes de repository;
testes com banco.
```

A base do JUnit continua a mesma.

Quanto melhor sua base agora, menos mágico Spring parecerá depois.

---

# Parte 24 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei usar @ParameterizedTest.
[ ] Sei usar @ValueSource.
[ ] Sei usar @NullSource.
[ ] Sei usar @EmptySource.
[ ] Sei usar @NullAndEmptySource.
[ ] Sei usar @CsvSource.
[ ] Sei usar @CsvFileSource.
[ ] Sei usar @EnumSource.
[ ] Sei usar @MethodSource.
[ ] Sei criar record de cenário.
[ ] Sei usar @Nested.
[ ] Sei usar @Tag.
[ ] Sei usar @Disabled com justificativa.
[ ] Sei usar TestInfo.
[ ] Sei usar assumptions.
[ ] Sei organizar testes por cenário.
[ ] Sei evitar parametrização confusa.
[ ] Sei conectar isso com Mockito e Spring.
```

---

## Registro rápido da aula

Responda:

```text
1. Para que serve @ParameterizedTest?
2. Quando usar @ValueSource?
3. Quando usar @CsvSource?
4. Quando usar @CsvFileSource?
5. Quando usar @EnumSource?
6. Quando usar @MethodSource?
7. Para que serve @Nested?
8. Para que serve @Tag?
9. Para que serve @Disabled?
10. Por que teste desabilitado precisa justificativa?
11. O que são assumptions?
12. Qual risco de parametrizar demais?
13. Quando CSV fica ruim?
14. Como tags ajudam no pipeline?
15. Como JUnit avançado prepara Mockito e Spring?
```

---

# Parte 25 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-252-junit5-avancado
```

Com:

```text
pom.xml;
TipoCliente.java;
StatusPedido.java;
Pedido.java;
CalculadoraDesconto.java;
ValidadorTexto.java;
testes com ValueSource;
testes com Null/Empty;
testes com CsvSource;
testes com CsvFileSource;
testes com EnumSource;
testes com MethodSource;
testes com Nested;
testes com Tag;
teste Disabled;
teste TestInfo;
teste Assumptions;
RELATORIO_JUNIT_AVANCADO.md.
```

---

## Requisitos

Você deve validar:

```text
textos preenchidos;
textos nulos/vazios/em branco;
desconto por tipo de cliente;
desconto por CSV externo;
todos os status do enum;
cenários de Pedido agrupados por @Nested;
tags unit;
teste desabilitado com justificativa;
uso de TestInfo;
uso de Assumptions.
```

---

## Critérios

```text
mvn test deve passar;
testes devem ser legíveis;
CSV deve estar em src/test/resources;
@Disabled deve ter motivo;
@Nested deve organizar cenários reais;
tags devem ter padrão;
não criar parametrização confusa;
relatório deve registrar aprendizados.
```

---

# Parte 26 — Desafio extra

## Regras de elegibilidade

Crie:

```text
ElegibilidadeAtendimento
```

Contexto:

```text
idadeHoras;
prioridade;
clienteCorporativo;
possuiErro;
```

Regra:

```text
atendimento é crítico quando:
idadeHoras > 24
E
(prioridade ALTA OU clienteCorporativo)
E
não possui erro técnico pendente
```

Crie enum:

```text
PrioridadeAtendimento
BAIXA
MEDIA
ALTA
```

Crie testes com:

```text
@CsvSource;
@EnumSource;
@MethodSource;
@Nested.
```

Critérios:

```text
testar casos positivos;
testar casos negativos;
testar borda idadeHoras = 24;
testar prioridade ALTA;
testar cliente corporativo;
testar possuiErro true;
nomes claros;
mvn test deve passar.
```

---

# Parte 27 — Simulado rápido

## Questão 1

`@ParameterizedTest` serve para:

```text
A) executar o mesmo teste com diferentes entradas.
B) desabilitar teste.
C) criar branch Git.
D) empacotar JAR.
```

---

## Questão 2

`@CsvSource` é útil para:

```text
A) passar múltiplos argumentos por linha.
B) criar tabela no banco.
C) configurar Maven Central.
D) rodar Docker.
```

---

## Questão 3

`@MethodSource` é melhor quando:

```text
A) os cenários são mais complexos e precisam ser montados por código.
B) não existem parâmetros.
C) queremos apagar testes.
D) queremos criar variável de ambiente.
```

---

## Questão 4

`@Nested` serve para:

```text
A) organizar testes em grupos internos por contexto.
B) compilar código.
C) baixar dependência.
D) criar tag Git.
```

---

## Questão 5

`@Tag` serve para:

```text
A) categorizar testes.
B) desabilitar Maven.
C) substituir assertEquals.
D) criar package.
```

---

## Questão 6

`@Disabled` deve ser usado:

```text
A) com justificativa clara.
B) sempre sem motivo.
C) para esconder erro permanentemente.
D) para apagar teste do projeto.
```

---

## Questão 7

Assumptions fazem o teste:

```text
A) ser abortado quando uma condição não é atendida.
B) falhar sempre.
C) passar sempre.
D) virar teste de integração.
```

---

## Questão 8

Um risco de testes parametrizados é:

```text
A) reduzir leitura quando os dados ficam confusos.
B) impedir qualquer repetição.
C) não funcionar com JUnit.
D) substituir todos os testes de backend.
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
7. A
8. A
```

---

## Relatório da aula

Crie:

```text
RELATORIO_JUNIT_AVANCADO.md
```

Modelo:

```md
# Relatório JUnit Avançado — Aula 252

## Comando executado

`mvn test`

## Recursos usados

- @ParameterizedTest
- @ValueSource
- @CsvSource
- @CsvFileSource
- @EnumSource
- @MethodSource
- @Nested
- @Tag
- @Disabled
- TestInfo
- Assumptions

## Testes criados

## Cenários positivos

## Cenários negativos

## Falhas encontradas

## Correções aplicadas

## Aprendizados

## Dúvidas
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-252-junit5-avancado
git commit -m "Aula 252: junit5 avancado testes parametrizados nested tags"
git status
```

---

## Fechamento

A principal ideia desta aula é:

```text
JUnit 5 avançado permite escrever testes mais expressivos, organizados e preparados para cenários reais de backend.
```

Você estudou:

```text
@ParameterizedTest;
@ValueSource;
@NullSource;
@EmptySource;
@NullAndEmptySource;
@CsvSource;
@CsvFileSource;
@EnumSource;
@MethodSource;
records de cenário;
@Nested;
@Tag;
@Disabled;
TestInfo;
Assumptions;
organização profissional;
boas práticas;
erros comuns;
preparação para Mockito;
preparação para Spring.
```

Na próxima aula, vamos aprofundar:

```text
Mockito.
```

A ideia será aprender a testar classes com dependências, criando mocks, stubs e verificações, preparando o caminho para use cases, services, repositories fake, clients externos e testes profissionais de backend.
