# 255 — M11.11 — AssertJ: assertions fluentes e testes mais legíveis

## Objetivo da aula

Na aula anterior, você aprofundou Mockito avançado.

Você estudou:

```text
doReturn;
doThrow;
doNothing;
métodos void;
spies;
ArgumentCaptor;
getAllValues;
InOrder;
Answer;
strict stubbing;
lenient;
verifyNoInteractions;
verifyNoMoreInteractions;
testes menos frágeis.
```

Agora vamos aprofundar uma ferramenta muito usada para melhorar a legibilidade dos testes Java:

```text
AssertJ
```

JUnit já possui assertions nativas:

```java
assertEquals(...);
assertTrue(...);
assertThrows(...);
```

Mas, em projetos profissionais, é muito comum encontrar AssertJ porque ele permite escrever assertions de forma mais fluente, expressiva e fácil de ler.

Exemplo JUnit:

```java
assertEquals(StatusPedido.PAGO, pedido.status());
assertTrue(pedido.valor().compareTo(new BigDecimal("100.00")) == 0);
assertNotNull(pedido.codigo());
```

Exemplo AssertJ:

```java
assertThat(pedido.status()).isEqualTo(StatusPedido.PAGO);
assertThat(pedido.valor()).isEqualByComparingTo("100.00");
assertThat(pedido.codigo()).isNotBlank();
```

Ao final desta aula, você deve conseguir:

```text
entender o que é AssertJ;
configurar AssertJ com Maven;
usar assertThat;
comparar strings;
comparar números;
comparar BigDecimal corretamente;
validar objetos;
validar listas;
validar Optional;
validar exceções;
validar múltiplos campos;
usar extracting;
usar containsExactly;
usar containsExactlyInAnyOrder;
usar filteredOn;
usar satisfies;
usar recursive comparison;
escrever testes mais legíveis;
entender quando JUnit basta;
entender quando AssertJ melhora o teste;
preparar base para testes profissionais com Spring.
```

---

## Reforço do objetivo maior

Nosso objetivo é construir um curso completo de Java Backend, do básico até o nível engenheiro/arquiteto Java.

Por isso, esta aula não é apenas sobre trocar:

```java
assertEquals
```

por:

```java
assertThat
```

O objetivo é melhorar a qualidade dos testes.

Um profissional avançado precisa escrever testes que sejam:

```text
claros;
expressivos;
confiáveis;
fáceis de diagnosticar;
fáceis de manter;
úteis para documentação técnica;
bons para code review;
bons para pipeline;
bons para refatoração.
```

AssertJ ajuda bastante nisso.

Mas, como toda ferramenta, deve ser usado com critério.

---

# Parte 1 — O que é AssertJ

AssertJ é uma biblioteca de assertions fluentes para Java.

Ela permite escrever verificações com encadeamento de métodos.

Exemplo:

```java
assertThat(nome)
        .isNotBlank()
        .startsWith("Thi")
        .contains("ago");
```

Esse estilo é chamado de:

```text
fluent assertions
```

Em português:

```text
assertions fluentes
```

Porque a leitura fica próxima de uma frase.

---

## AssertJ em uma frase prática

```text
AssertJ melhora a legibilidade dos testes com assertions fluentes, ricas e expressivas.
```

---

# Parte 2 — Por que usar AssertJ

JUnit é suficiente para muitos casos simples.

Mas AssertJ ajuda quando você quer validar:

```text
listas;
coleções;
objetos complexos;
BigDecimal;
Optional;
exceções;
múltiplos campos;
conteúdo parcial;
comparação recursiva;
filtros;
extração de propriedades;
mensagens mais claras;
cenários de backend com DTOs e resultados.
```

Exemplo com lista usando JUnit:

```java
assertEquals(3, pedidos.size());
assertEquals("PED-001", pedidos.get(0).codigo());
assertEquals("PED-002", pedidos.get(1).codigo());
assertEquals("PED-003", pedidos.get(2).codigo());
```

Com AssertJ:

```java
assertThat(pedidos)
        .extracting(PedidoResultado::codigo)
        .containsExactly("PED-001", "PED-002", "PED-003");
```

Mais expressivo.

---

# Parte 3 — JUnit Assertions vs AssertJ

## JUnit

Exemplo:

```java
assertEquals("PED-001", pedido.codigo());
assertTrue(pedido.valor().compareTo(new BigDecimal("100.00")) == 0);
assertThrows(IllegalArgumentException.class, () -> service.executar(null));
```

## AssertJ

Exemplo:

```java
assertThat(pedido.codigo()).isEqualTo("PED-001");
assertThat(pedido.valor()).isEqualByComparingTo("100.00");

assertThatThrownBy(() -> service.executar(null))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage("Código é obrigatório.");
```

---

## Regra prática

```text
JUnit:
bom para assertions simples.

AssertJ:
excelente para legibilidade, objetos, coleções, Optional, exceções e BigDecimal.
```

Em muitos projetos, os dois convivem.

---

# Parte 4 — Configurando laboratório

Crie a estrutura:

```powershell
mkdir labs\m11\aula-255-assertj-assertions-fluentes
cd labs\m11\aula-255-assertj-assertions-fluentes

mkdir src\main\java\br\com\curso\aula255
mkdir src\main\java\br\com\curso\aula255\domain
mkdir src\main\java\br\com\curso\aula255\application
mkdir src\main\java\br\com\curso\aula255\application\service
mkdir src\test\java\br\com\curso\aula255
mkdir src\test\java\br\com\curso\aula255\domain
mkdir src\test\java\br\com\curso\aula255\application
mkdir src\test\java\br\com\curso\aula255\application\service
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
    <artifactId>aula-255-assertj-assertions-fluentes</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>
    </properties>

    <dependencies>
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

---

## Import principal

Nos testes com AssertJ, o import mais usado será:

```java
import static org.assertj.core.api.Assertions.assertThat;
```

Para exceções:

```java
import static org.assertj.core.api.Assertions.assertThatThrownBy;
```

Ou:

```java
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
```

---

# Parte 5 — Domínio da aula

Crie:

```text
src/main/java/br/com/curso/aula255/domain/StatusPedido.java
```

Código:

```java
package br.com.curso.aula255.domain;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO,
    ENTREGUE
}
```

Crie:

```text
src/main/java/br/com/curso/aula255/domain/TipoCliente.java
```

Código:

```java
package br.com.curso.aula255.domain;

public enum TipoCliente {
    COMUM,
    VIP,
    CORPORATIVO
}
```

Crie:

```text
src/main/java/br/com/curso/aula255/domain/ItemPedido.java
```

Código:

```java
package br.com.curso.aula255.domain;

import java.math.BigDecimal;

public record ItemPedido(
        String sku,
        String descricao,
        int quantidade,
        BigDecimal valorUnitario
) {
    public ItemPedido {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (valorUnitario == null || valorUnitario.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor unitário deve ser maior que zero.");
        }

        sku = sku.trim().toUpperCase();
        descricao = descricao.trim();
    }

    public ItemPedido(String sku, String descricao, int quantidade, String valorUnitario) {
        this(sku, descricao, quantidade, new BigDecimal(valorUnitario));
    }

    public BigDecimal total() {
        return valorUnitario.multiply(new BigDecimal(quantidade));
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula255/domain/Pedido.java
```

Código:

```java
package br.com.curso.aula255.domain;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final TipoCliente tipoCliente;
    private final List<ItemPedido> itens = new ArrayList<>();
    private StatusPedido status;

    public Pedido(String codigo, String cliente, TipoCliente tipoCliente) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (tipoCliente == null) {
            throw new IllegalArgumentException("Tipo de cliente é obrigatório.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.tipoCliente = tipoCliente;
        this.status = StatusPedido.CRIADO;
    }

    public void adicionarItem(ItemPedido item) {
        if (item == null) {
            throw new IllegalArgumentException("Item é obrigatório.");
        }

        if (status != StatusPedido.CRIADO) {
            throw new IllegalStateException("Só é possível adicionar item em pedido criado.");
        }

        itens.add(item);
    }

    public void pagar() {
        if (itens.isEmpty()) {
            throw new IllegalStateException("Pedido sem itens não pode ser pago.");
        }

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

    public BigDecimal total() {
        return itens.stream()
                .map(ItemPedido::total)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public TipoCliente tipoCliente() {
        return tipoCliente;
    }

    public StatusPedido status() {
        return status;
    }

    public List<ItemPedido> itens() {
        return Collections.unmodifiableList(itens);
    }
}
```

---

# Parte 6 — Resultado de aplicação

Crie:

```text
src/main/java/br/com/curso/aula255/application/PedidoResumo.java
```

Código:

```java
package br.com.curso.aula255.application;

import br.com.curso.aula255.domain.StatusPedido;
import br.com.curso.aula255.domain.TipoCliente;

import java.math.BigDecimal;

public record PedidoResumo(
        String codigo,
        String cliente,
        TipoCliente tipoCliente,
        StatusPedido status,
        int quantidadeItens,
        BigDecimal total
) {
}
```

Crie:

```text
src/main/java/br/com/curso/aula255/application/service/GeradorResumoPedidoService.java
```

Código:

```java
package br.com.curso.aula255.application.service;

import br.com.curso.aula255.application.PedidoResumo;
import br.com.curso.aula255.domain.Pedido;

public class GeradorResumoPedidoService {
    public PedidoResumo gerar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return new PedidoResumo(
                pedido.codigo(),
                pedido.cliente(),
                pedido.tipoCliente(),
                pedido.status(),
                pedido.itens().size(),
                pedido.total()
        );
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula255/application/service/FiltroPedidoService.java
```

Código:

```java
package br.com.curso.aula255.application.service;

import br.com.curso.aula255.domain.Pedido;
import br.com.curso.aula255.domain.StatusPedido;
import br.com.curso.aula255.domain.TipoCliente;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public class FiltroPedidoService {
    public List<Pedido> filtrarPorStatus(List<Pedido> pedidos, StatusPedido status) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Lista de pedidos é obrigatória.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        return pedidos.stream()
                .filter(pedido -> pedido.status() == status)
                .toList();
    }

    public List<Pedido> filtrarPorTipoCliente(List<Pedido> pedidos, TipoCliente tipoCliente) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Lista de pedidos é obrigatória.");
        }

        if (tipoCliente == null) {
            throw new IllegalArgumentException("Tipo de cliente é obrigatório.");
        }

        return pedidos.stream()
                .filter(pedido -> pedido.tipoCliente() == tipoCliente)
                .toList();
    }

    public Optional<Pedido> buscarMaiorPedido(List<Pedido> pedidos) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Lista de pedidos é obrigatória.");
        }

        return pedidos.stream()
                .max((p1, p2) -> p1.total().compareTo(p2.total()));
    }

    public List<Pedido> filtrarComTotalMaiorQue(List<Pedido> pedidos, BigDecimal valorMinimo) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Lista de pedidos é obrigatória.");
        }

        if (valorMinimo == null) {
            throw new IllegalArgumentException("Valor mínimo é obrigatório.");
        }

        return pedidos.stream()
                .filter(pedido -> pedido.total().compareTo(valorMinimo) > 0)
                .toList();
    }
}
```

---

# Parte 7 — Primeiro teste com AssertJ

Crie:

```text
src/test/java/br/com/curso/aula255/domain/ItemPedidoAssertJTest.java
```

Código:

```java
package br.com.curso.aula255.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("ItemPedido com AssertJ")
class ItemPedidoAssertJTest {
    @Test
    @DisplayName("deve criar item com dados normalizados")
    void deveCriarItemComDadosNormalizados() {
        ItemPedido item = new ItemPedido(" sku-001 ", " Mesa de Escritório ", 2, "150.00");

        assertThat(item.sku()).isEqualTo("SKU-001");
        assertThat(item.descricao()).isEqualTo("Mesa de Escritório");
        assertThat(item.quantidade()).isEqualTo(2);
        assertThat(item.valorUnitario()).isEqualByComparingTo("150.00");
        assertThat(item.total()).isEqualByComparingTo("300.00");
    }

    @Test
    @DisplayName("não deve criar item sem SKU")
    void naoDeveCriarItemSemSku() {
        assertThatThrownBy(() -> new ItemPedido(" ", "Mesa", 1, "100.00"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("SKU é obrigatório.");
    }

    @Test
    @DisplayName("não deve criar item com quantidade zero")
    void naoDeveCriarItemComQuantidadeZero() {
        assertThatThrownBy(() -> new ItemPedido("SKU-001", "Mesa", 0, "100.00"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Quantidade deve ser maior que zero.");
    }

    @Test
    @DisplayName("não deve criar item com valor unitário inválido")
    void naoDeveCriarItemComValorUnitarioInvalido() {
        assertThatThrownBy(() -> new ItemPedido("SKU-001", "Mesa", 1, BigDecimal.ZERO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Valor unitário deve ser maior que zero.");
    }
}
```

---

## O que observar

AssertJ deixou claro:

```java
assertThat(item.total()).isEqualByComparingTo("300.00");
```

Isso é ótimo para `BigDecimal`.

---

# Parte 8 — Assertions com String

AssertJ tem várias verificações para String.

Exemplos:

```java
assertThat(nome).isNotBlank();
assertThat(nome).startsWith("Thi");
assertThat(nome).endsWith("go");
assertThat(nome).contains("ia");
assertThat(nome).isEqualToIgnoringCase("thiago");
```

Crie:

```text
src/test/java/br/com/curso/aula255/domain/StringAssertionsTest.java
```

Código:

```java
package br.com.curso.aula255.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Assertions de String")
class StringAssertionsTest {
    @Test
    @DisplayName("deve validar conteúdo de string")
    void deveValidarConteudoDeString() {
        String texto = "Java Backend Profissional";

        assertThat(texto)
                .isNotBlank()
                .startsWith("Java")
                .contains("Backend")
                .endsWith("Profissional");
    }

    @Test
    @DisplayName("deve comparar ignorando maiúsculas e minúsculas")
    void deveCompararIgnorandoMaiusculasMinusculas() {
        String status = "pago";

        assertThat(status).isEqualToIgnoringCase("PAGO");
    }
}
```

---

# Parte 9 — Assertions com números

Exemplos:

```java
assertThat(numero).isPositive();
assertThat(numero).isGreaterThan(10);
assertThat(numero).isBetween(1, 100);
assertThat(numero).isZero();
```

Crie:

```text
src/test/java/br/com/curso/aula255/domain/NumberAssertionsTest.java
```

Código:

```java
package br.com.curso.aula255.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Assertions numéricas")
class NumberAssertionsTest {
    @Test
    @DisplayName("deve validar número inteiro")
    void deveValidarNumeroInteiro() {
        int quantidade = 10;

        assertThat(quantidade)
                .isPositive()
                .isGreaterThan(5)
                .isLessThanOrEqualTo(10)
                .isBetween(1, 10);
    }

    @Test
    @DisplayName("deve validar zero")
    void deveValidarZero() {
        int total = 0;

        assertThat(total).isZero();
    }
}
```

---

# Parte 10 — BigDecimal com AssertJ

Com dinheiro, `BigDecimal` exige cuidado.

Em Java:

```java
new BigDecimal("100.0").equals(new BigDecimal("100.00"))
```

pode retornar falso por causa da escala.

AssertJ oferece:

```java
isEqualByComparingTo
```

Exemplo:

```java
assertThat(valor).isEqualByComparingTo("100.00");
```

Crie:

```text
src/test/java/br/com/curso/aula255/domain/BigDecimalAssertionsTest.java
```

Código:

```java
package br.com.curso.aula255.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Assertions com BigDecimal")
class BigDecimalAssertionsTest {
    @Test
    @DisplayName("deve comparar BigDecimal por valor numérico")
    void deveCompararBigDecimalPorValorNumerico() {
        BigDecimal valor = new BigDecimal("100.0");

        assertThat(valor).isEqualByComparingTo("100.00");
    }

    @Test
    @DisplayName("deve validar BigDecimal maior que outro valor")
    void deveValidarBigDecimalMaiorQueOutroValor() {
        BigDecimal valor = new BigDecimal("150.00");

        assertThat(valor)
                .isGreaterThan(new BigDecimal("100.00"))
                .isLessThanOrEqualTo(new BigDecimal("200.00"));
    }
}
```

---

## Regra profissional

Para dinheiro:

```text
evite new BigDecimal(double);
prefira String;
em AssertJ, prefira isEqualByComparingTo para comparar valor numérico.
```

---

# Parte 11 — Assertions com objetos

Crie:

```text
src/test/java/br/com/curso/aula255/domain/PedidoAssertJTest.java
```

Código:

```java
package br.com.curso.aula255.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Pedido com AssertJ")
class PedidoAssertJTest {
    @Test
    @DisplayName("deve criar pedido com status CRIADO")
    void deveCriarPedidoComStatusCriado() {
        Pedido pedido = new Pedido(" ped-001 ", " Ana ", TipoCliente.VIP);

        assertThat(pedido.codigo()).isEqualTo("PED-001");
        assertThat(pedido.cliente()).isEqualTo("Ana");
        assertThat(pedido.tipoCliente()).isEqualTo(TipoCliente.VIP);
        assertThat(pedido.status()).isEqualTo(StatusPedido.CRIADO);
        assertThat(pedido.itens()).isEmpty();
        assertThat(pedido.total()).isEqualByComparingTo("0.00");
    }

    @Test
    @DisplayName("deve adicionar item ao pedido criado")
    void deveAdicionarItemAoPedidoCriado() {
        Pedido pedido = new Pedido("PED-001", "Ana", TipoCliente.COMUM);
        ItemPedido item = new ItemPedido("SKU-001", "Mesa", 2, "150.00");

        pedido.adicionarItem(item);

        assertThat(pedido.itens())
                .hasSize(1)
                .containsExactly(item);

        assertThat(pedido.total()).isEqualByComparingTo("300.00");
    }

    @Test
    @DisplayName("deve pagar pedido com itens")
    void devePagarPedidoComItens() {
        Pedido pedido = new Pedido("PED-001", "Ana", TipoCliente.COMUM);
        pedido.adicionarItem(new ItemPedido("SKU-001", "Mesa", 1, "300.00"));

        pedido.pagar();

        assertThat(pedido.status()).isEqualTo(StatusPedido.PAGO);
    }

    @Test
    @DisplayName("não deve pagar pedido sem itens")
    void naoDevePagarPedidoSemItens() {
        Pedido pedido = new Pedido("PED-001", "Ana", TipoCliente.COMUM);

        assertThatThrownBy(pedido::pagar)
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Pedido sem itens não pode ser pago.");

        assertThat(pedido.status()).isEqualTo(StatusPedido.CRIADO);
    }
}
```

---

# Parte 12 — Assertions com listas

AssertJ é excelente para listas.

Exemplos:

```java
assertThat(lista).hasSize(3);
assertThat(lista).isNotEmpty();
assertThat(lista).contains(elemento);
assertThat(lista).containsExactly(a, b, c);
assertThat(lista).containsExactlyInAnyOrder(c, a, b);
```

Crie:

```text
src/test/java/br/com/curso/aula255/application/service/FiltroPedidoServiceListaTest.java
```

Código:

```java
package br.com.curso.aula255.application.service;

import br.com.curso.aula255.domain.ItemPedido;
import br.com.curso.aula255.domain.Pedido;
import br.com.curso.aula255.domain.StatusPedido;
import br.com.curso.aula255.domain.TipoCliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("FiltroPedidoService - listas")
class FiltroPedidoServiceListaTest {
    private final FiltroPedidoService service = new FiltroPedidoService();

    @Test
    @DisplayName("deve filtrar pedidos pagos")
    void deveFiltrarPedidosPagos() {
        Pedido pedido1 = pedidoPago("PED-001", TipoCliente.COMUM, "100.00");
        Pedido pedido2 = pedidoCriado("PED-002", TipoCliente.VIP, "200.00");
        Pedido pedido3 = pedidoPago("PED-003", TipoCliente.CORPORATIVO, "300.00");

        List<Pedido> resultado = service.filtrarPorStatus(
                List.of(pedido1, pedido2, pedido3),
                StatusPedido.PAGO
        );

        assertThat(resultado)
                .hasSize(2)
                .containsExactly(pedido1, pedido3)
                .extracting(Pedido::codigo)
                .containsExactly("PED-001", "PED-003");
    }

    @Test
    @DisplayName("deve filtrar pedidos por tipo de cliente")
    void deveFiltrarPedidosPorTipoCliente() {
        Pedido pedido1 = pedidoCriado("PED-001", TipoCliente.COMUM, "100.00");
        Pedido pedido2 = pedidoCriado("PED-002", TipoCliente.VIP, "200.00");
        Pedido pedido3 = pedidoCriado("PED-003", TipoCliente.VIP, "300.00");

        List<Pedido> resultado = service.filtrarPorTipoCliente(
                List.of(pedido1, pedido2, pedido3),
                TipoCliente.VIP
        );

        assertThat(resultado)
                .containsExactly(pedido2, pedido3)
                .extracting(Pedido::codigo)
                .containsExactly("PED-002", "PED-003");
    }

    private Pedido pedidoCriado(String codigo, TipoCliente tipoCliente, String valorItem) {
        Pedido pedido = new Pedido(codigo, "Cliente " + codigo, tipoCliente);
        pedido.adicionarItem(new ItemPedido("SKU-" + codigo, "Produto", 1, valorItem));
        return pedido;
    }

    private Pedido pedidoPago(String codigo, TipoCliente tipoCliente, String valorItem) {
        Pedido pedido = pedidoCriado(codigo, tipoCliente, valorItem);
        pedido.pagar();
        return pedido;
    }
}
```

---

## containsExactly vs containsExactlyInAnyOrder

```text
containsExactly:
valida elementos e ordem.

containsExactlyInAnyOrder:
valida elementos sem exigir ordem.
```

Use conforme a regra.

Se a ordem não importa, não exija ordem.

Isso evita teste frágil.

---

# Parte 13 — extracting

`extracting` permite validar propriedades de uma lista.

Exemplo:

```java
assertThat(pedidos)
        .extracting(Pedido::codigo)
        .containsExactly("PED-001", "PED-002");
```

Você pode extrair múltiplos campos:

```java
assertThat(resumos)
        .extracting(PedidoResumo::codigo, PedidoResumo::status)
        .containsExactly(
                tuple("PED-001", StatusPedido.PAGO),
                tuple("PED-002", StatusPedido.CRIADO)
        );
```

Para tuple, importe:

```java
import static org.assertj.core.api.Assertions.tuple;
```

---

# Parte 14 — Testando resumo com extracting e tuple

Crie:

```text
src/test/java/br/com/curso/aula255/application/service/GeradorResumoPedidoServiceTest.java
```

Código:

```java
package br.com.curso.aula255.application.service;

import br.com.curso.aula255.application.PedidoResumo;
import br.com.curso.aula255.domain.ItemPedido;
import br.com.curso.aula255.domain.Pedido;
import br.com.curso.aula255.domain.StatusPedido;
import br.com.curso.aula255.domain.TipoCliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("GeradorResumoPedidoService")
class GeradorResumoPedidoServiceTest {
    private final GeradorResumoPedidoService service = new GeradorResumoPedidoService();

    @Test
    @DisplayName("deve gerar resumo do pedido")
    void deveGerarResumoDoPedido() {
        Pedido pedido = new Pedido("PED-001", "Ana", TipoCliente.VIP);
        pedido.adicionarItem(new ItemPedido("SKU-001", "Mesa", 2, "150.00"));
        pedido.adicionarItem(new ItemPedido("SKU-002", "Cadeira", 1, "200.00"));
        pedido.pagar();

        PedidoResumo resumo = service.gerar(pedido);

        assertThat(resumo)
                .extracting(
                        PedidoResumo::codigo,
                        PedidoResumo::cliente,
                        PedidoResumo::tipoCliente,
                        PedidoResumo::status,
                        PedidoResumo::quantidadeItens
                )
                .containsExactly(
                        "PED-001",
                        "Ana",
                        TipoCliente.VIP,
                        StatusPedido.PAGO,
                        2
                );

        assertThat(resumo.total()).isEqualByComparingTo("500.00");
    }

    @Test
    @DisplayName("não deve gerar resumo para pedido nulo")
    void naoDeveGerarResumoParaPedidoNulo() {
        assertThatThrownBy(() -> service.gerar(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Pedido é obrigatório.");
    }
}
```

---

# Parte 15 — Optional com AssertJ

AssertJ valida Optional de forma muito boa.

Exemplos:

```java
assertThat(optional).isPresent();
assertThat(optional).isEmpty();
assertThat(optional).hasValue(pedido);
assertThat(optional).get().extracting(Pedido::codigo).isEqualTo("PED-001");
```

Crie:

```text
src/test/java/br/com/curso/aula255/application/service/FiltroPedidoServiceOptionalTest.java
```

Código:

```java
package br.com.curso.aula255.application.service;

import br.com.curso.aula255.domain.ItemPedido;
import br.com.curso.aula255.domain.Pedido;
import br.com.curso.aula255.domain.TipoCliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("FiltroPedidoService - Optional")
class FiltroPedidoServiceOptionalTest {
    private final FiltroPedidoService service = new FiltroPedidoService();

    @Test
    @DisplayName("deve buscar maior pedido")
    void deveBuscarMaiorPedido() {
        Pedido pedido1 = pedido("PED-001", "100.00");
        Pedido pedido2 = pedido("PED-002", "500.00");
        Pedido pedido3 = pedido("PED-003", "300.00");

        Optional<Pedido> maiorPedido = service.buscarMaiorPedido(List.of(pedido1, pedido2, pedido3));

        assertThat(maiorPedido)
                .isPresent()
                .get()
                .extracting(Pedido::codigo)
                .isEqualTo("PED-002");
    }

    @Test
    @DisplayName("deve retornar Optional vazio quando lista estiver vazia")
    void deveRetornarOptionalVazioQuandoListaEstiverVazia() {
        Optional<Pedido> maiorPedido = service.buscarMaiorPedido(List.of());

        assertThat(maiorPedido).isEmpty();
    }

    private Pedido pedido(String codigo, String valorItem) {
        Pedido pedido = new Pedido(codigo, "Cliente " + codigo, TipoCliente.COMUM);
        pedido.adicionarItem(new ItemPedido("SKU-" + codigo, "Produto", 1, valorItem));
        return pedido;
    }
}
```

---

# Parte 16 — filteredOn

`filteredOn` permite filtrar dentro da assertion.

Exemplo:

```java
assertThat(pedidos)
        .filteredOn(pedido -> pedido.tipoCliente() == TipoCliente.VIP)
        .extracting(Pedido::codigo)
        .containsExactly("PED-002", "PED-003");
```

Crie:

```text
src/test/java/br/com/curso/aula255/application/service/FiltroPedidoServiceFilteredOnTest.java
```

Código:

```java
package br.com.curso.aula255.application.service;

import br.com.curso.aula255.domain.ItemPedido;
import br.com.curso.aula255.domain.Pedido;
import br.com.curso.aula255.domain.TipoCliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("AssertJ filteredOn")
class FiltroPedidoServiceFilteredOnTest {
    @Test
    @DisplayName("deve filtrar pedidos VIP dentro da assertion")
    void deveFiltrarPedidosVipDentroDaAssertion() {
        Pedido pedido1 = pedido("PED-001", TipoCliente.COMUM, "100.00");
        Pedido pedido2 = pedido("PED-002", TipoCliente.VIP, "200.00");
        Pedido pedido3 = pedido("PED-003", TipoCliente.VIP, "300.00");

        List<Pedido> pedidos = List.of(pedido1, pedido2, pedido3);

        assertThat(pedidos)
                .filteredOn(pedido -> pedido.tipoCliente() == TipoCliente.VIP)
                .extracting(Pedido::codigo)
                .containsExactly("PED-002", "PED-003");
    }

    private Pedido pedido(String codigo, TipoCliente tipoCliente, String valorItem) {
        Pedido pedido = new Pedido(codigo, "Cliente " + codigo, tipoCliente);
        pedido.adicionarItem(new ItemPedido("SKU-" + codigo, "Produto", 1, valorItem));
        return pedido;
    }
}
```

---

## Cuidado

`filteredOn` é bom para assertion.

Mas não use para esconder lógica do teste.

Se a lógica de filtro é o que você quer testar, normalmente você deve chamar o service e validar o resultado.

---

# Parte 17 — satisfies

`satisfies` permite validar um objeto com bloco de assertions.

Exemplo:

```java
assertThat(pedido).satisfies(p -> {
    assertThat(p.codigo()).isEqualTo("PED-001");
    assertThat(p.status()).isEqualTo(StatusPedido.PAGO);
});
```

Crie:

```text
src/test/java/br/com/curso/aula255/domain/SatisfiesTest.java
```

Código:

```java
package br.com.curso.aula255.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("AssertJ satisfies")
class SatisfiesTest {
    @Test
    @DisplayName("deve validar pedido com satisfies")
    void deveValidarPedidoComSatisfies() {
        Pedido pedido = new Pedido("PED-001", "Ana", TipoCliente.CORPORATIVO);
        pedido.adicionarItem(new ItemPedido("SKU-001", "Mesa", 1, "100.00"));

        assertThat(pedido).satisfies(p -> {
            assertThat(p.codigo()).isEqualTo("PED-001");
            assertThat(p.cliente()).isEqualTo("Ana");
            assertThat(p.tipoCliente()).isEqualTo(TipoCliente.CORPORATIVO);
            assertThat(p.status()).isEqualTo(StatusPedido.CRIADO);
            assertThat(p.total()).isEqualByComparingTo("100.00");
        });
    }
}
```

---

# Parte 18 — Recursive comparison

Às vezes você quer comparar objetos inteiros.

AssertJ permite:

```java
usingRecursiveComparison()
```

Exemplo:

```java
assertThat(objetoAtual)
        .usingRecursiveComparison()
        .isEqualTo(objetoEsperado);
```

Isso compara campos recursivamente.

Crie:

```text
src/main/java/br/com/curso/aula255/application/PedidoExportacao.java
```

Código:

```java
package br.com.curso.aula255.application;

import br.com.curso.aula255.domain.StatusPedido;

import java.math.BigDecimal;
import java.util.List;

public record PedidoExportacao(
        String codigo,
        String cliente,
        StatusPedido status,
        BigDecimal total,
        List<String> skus
) {
}
```

Crie:

```text
src/main/java/br/com/curso/aula255/application/service/ExportadorPedidoService.java
```

Código:

```java
package br.com.curso.aula255.application.service;

import br.com.curso.aula255.application.PedidoExportacao;
import br.com.curso.aula255.domain.Pedido;

public class ExportadorPedidoService {
    public PedidoExportacao exportar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return new PedidoExportacao(
                pedido.codigo(),
                pedido.cliente(),
                pedido.status(),
                pedido.total(),
                pedido.itens().stream()
                        .map(item -> item.sku())
                        .toList()
        );
    }
}
```

Crie teste:

```text
src/test/java/br/com/curso/aula255/application/service/ExportadorPedidoServiceTest.java
```

Código:

```java
package br.com.curso.aula255.application.service;

import br.com.curso.aula255.application.PedidoExportacao;
import br.com.curso.aula255.domain.ItemPedido;
import br.com.curso.aula255.domain.Pedido;
import br.com.curso.aula255.domain.StatusPedido;
import br.com.curso.aula255.domain.TipoCliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ExportadorPedidoService")
class ExportadorPedidoServiceTest {
    private final ExportadorPedidoService service = new ExportadorPedidoService();

    @Test
    @DisplayName("deve exportar pedido usando comparação recursiva")
    void deveExportarPedidoUsandoComparacaoRecursiva() {
        Pedido pedido = new Pedido("PED-001", "Ana", TipoCliente.VIP);
        pedido.adicionarItem(new ItemPedido("SKU-001", "Mesa", 1, "100.00"));
        pedido.adicionarItem(new ItemPedido("SKU-002", "Cadeira", 2, "50.00"));

        PedidoExportacao exportacao = service.exportar(pedido);

        PedidoExportacao esperado = new PedidoExportacao(
                "PED-001",
                "Ana",
                StatusPedido.CRIADO,
                new BigDecimal("200.00"),
                List.of("SKU-001", "SKU-002")
        );

        assertThat(exportacao)
                .usingRecursiveComparison()
                .isEqualTo(esperado);
    }
}
```

---

## Cuidado com recursive comparison

É poderoso, mas pode ser excessivo.

Use quando:

```text
quer comparar DTOs/resultados completos;
objetos são simples;
campos esperados são claros.
```

Evite quando:

```text
comparação fica grande demais;
há campos irrelevantes;
há datas dinâmicas;
há IDs gerados;
há detalhes internos que não são contrato.
```

---

# Parte 19 — Ignorando campos na comparação recursiva

Exemplo conceitual:

```java
assertThat(atual)
        .usingRecursiveComparison()
        .ignoringFields("id", "criadoEm")
        .isEqualTo(esperado);
```

Isso é útil quando campos são gerados.

Em backend real, isso aparece com:

```text
id;
createdAt;
updatedAt;
version;
audit fields.
```

Use com clareza.

Não ignore campo importante só para teste passar.

---

# Parte 20 — Exceções com AssertJ

Existem formas diferentes.

## assertThatThrownBy

```java
assertThatThrownBy(() -> service.gerar(null))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage("Pedido é obrigatório.");
```

## assertThatExceptionOfType

```java
assertThatExceptionOfType(IllegalArgumentException.class)
        .isThrownBy(() -> service.gerar(null))
        .withMessage("Pedido é obrigatório.");
```

Ambas são válidas.

---

## Testando parte da mensagem

```java
assertThatThrownBy(() -> service.gerar(null))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("obrigatório");
```

Use `hasMessageContaining` quando a mensagem contém detalhes dinâmicos.

---

# Parte 21 — Assertions com descrição

AssertJ permite adicionar descrição ao assert.

Exemplo:

```java
assertThat(pedido.status())
        .as("status do pedido após pagamento")
        .isEqualTo(StatusPedido.PAGO);
```

Se falhar, a mensagem fica mais clara.

Use quando:

```text
o cenário é complexo;
há vários asserts parecidos;
quer melhorar diagnóstico.
```

Não precisa usar em todo assert.

---

# Parte 22 — Boas práticas com AssertJ

Use boas práticas:

```text
importe assertThat estaticamente;
prefira isEqualByComparingTo para BigDecimal;
use extracting para listas de objetos;
use containsExactly quando ordem importa;
use containsExactlyInAnyOrder quando ordem não importa;
use assertThatThrownBy para exceções;
use satisfies para validar objeto em bloco;
use recursive comparison com cuidado;
não escreva assertions gigantes;
não coloque lógica complexa dentro da assertion;
não esconda regra do teste;
mantenha nomes claros.
```

---

# Parte 23 — Erros comuns

## 1. Comparar BigDecimal com isEqualTo sem entender escala

Pode falhar por escala.

Prefira:

```java
isEqualByComparingTo("100.00")
```

---

## 2. Exigir ordem quando ordem não importa

Ruim:

```java
containsExactly(...)
```

se a regra não exige ordem.

Prefira:

```java
containsExactlyInAnyOrder(...)
```

---

## 3. Usar recursive comparison para tudo

Isso pode esconder intenção.

Às vezes é melhor validar campos importantes explicitamente.

---

## 4. Teste com assertion longa demais

Se a assertion vira um bloco enorme, talvez seja melhor quebrar o teste ou usar helper.

---

## 5. Usar filteredOn para testar a própria lógica de filtro

Se você quer testar o service de filtro, chame o service.

Não replique o filtro dentro da assertion.

---

# Parte 24 — AssertJ com Mockito

AssertJ combina muito bem com Mockito.

Exemplo com ArgumentCaptor:

```java
ArgumentCaptor<Pedido> captor = ArgumentCaptor.forClass(Pedido.class);

verify(repository).salvar(captor.capture());

assertThat(captor.getValue())
        .satisfies(pedido -> {
            assertThat(pedido.codigo()).isEqualTo("PED-001");
            assertThat(pedido.status()).isEqualTo(StatusPedido.PAGO);
        });
```

Com lista capturada:

```java
assertThat(captor.getAllValues())
        .extracting(Pedido::codigo)
        .containsExactly("PED-001", "PED-002");
```

Isso melhora muito testes de use case.

---

# Parte 25 — Como isso prepara Spring

Em Spring, AssertJ aparece muito em testes:

```text
testes de DTO;
testes de response;
testes de repository;
testes de service;
testes de controller;
testes com JSON;
testes com paginação;
testes com Optional;
testes com listas;
testes com entidades;
testes com Testcontainers.
```

Exemplo futuro:

```java
assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
assertThat(response.getBody()).isNotNull();
assertThat(response.getBody().codigo()).isEqualTo("PED-001");
```

Ou:

```java
assertThat(pedidos)
        .extracting(PedidoEntity::getCodigo)
        .containsExactly("PED-001", "PED-002");
```

---

# Parte 26 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar o que é AssertJ.
[ ] Sei configurar AssertJ com Maven.
[ ] Sei usar assertThat.
[ ] Sei usar assertThatThrownBy.
[ ] Sei validar String.
[ ] Sei validar números.
[ ] Sei validar BigDecimal.
[ ] Sei validar objetos.
[ ] Sei validar listas.
[ ] Sei usar containsExactly.
[ ] Sei usar containsExactlyInAnyOrder.
[ ] Sei usar extracting.
[ ] Sei usar tuple em alto nível.
[ ] Sei validar Optional.
[ ] Sei usar filteredOn.
[ ] Sei usar satisfies.
[ ] Sei usar recursive comparison.
[ ] Sei ignorar campos em comparação recursiva em alto nível.
[ ] Sei adicionar descrição com as().
[ ] Sei evitar uso exagerado.
[ ] Sei conectar AssertJ com Mockito.
[ ] Sei conectar AssertJ com Spring futuro.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é AssertJ?
2. Qual vantagem de assertThat?
3. Quando JUnit Assertions já bastam?
4. Quando AssertJ melhora muito?
5. Como comparar BigDecimal?
6. Qual diferença entre containsExactly e containsExactlyInAnyOrder?
7. Para que serve extracting?
8. Para que serve filteredOn?
9. Para que serve satisfies?
10. Para que serve usingRecursiveComparison?
11. Quando recursive comparison pode ser perigoso?
12. Como testar exceção com AssertJ?
13. Como usar AssertJ com ArgumentCaptor?
14. Quais erros comuns com AssertJ?
15. Como AssertJ prepara testes com Spring?
```

---

# Parte 27 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-255-assertj-assertions-fluentes
```

Com:

```text
pom.xml;
StatusPedido.java;
TipoCliente.java;
ItemPedido.java;
Pedido.java;
PedidoResumo.java;
PedidoExportacao.java;
GeradorResumoPedidoService.java;
FiltroPedidoService.java;
ExportadorPedidoService.java;
testes com AssertJ;
RELATORIO_ASSERTJ.md.
```

---

## Requisitos

Você deve testar:

```text
criação de item;
validações de item;
strings;
números;
BigDecimal;
criação de pedido;
adição de item;
pagamento de pedido;
erro ao pagar pedido sem itens;
listas de pedidos;
filtro por status;
filtro por tipo de cliente;
Optional com maior pedido;
filteredOn;
satisfies;
recursive comparison;
exceções com assertThatThrownBy.
```

---

## Critérios

```text
usar AssertJ;
usar assertThat;
usar assertThatThrownBy;
usar isEqualByComparingTo para BigDecimal;
usar extracting em listas;
usar containsExactly quando ordem importar;
usar containsExactlyInAnyOrder quando ordem não importar;
não usar lógica excessiva dentro das assertions;
mvn clean test deve passar;
relatório deve ser preenchido.
```

---

# Parte 28 — Desafio extra

## Aplicar AssertJ em teste com Mockito

Crie um use case simples:

```text
CriarPedidoUseCase
```

Dependências:

```text
PedidoRepository;
AuditoriaGateway.
```

Regras:

```text
não criar se código já existe;
criar pedido;
adicionar itens;
salvar;
auditar.
```

No teste:

```text
use Mockito para mockar repository e auditoria;
use ArgumentCaptor para capturar pedido salvo;
use AssertJ para validar pedido capturado;
use extracting para validar itens;
use assertThatThrownBy para erro de duplicidade.
```

Critérios:

```text
não mockar Pedido;
usar domínio real;
usar AssertJ nas validações;
usar verify para interações importantes;
não exagerar em verifyNoMoreInteractions.
```

---

# Parte 29 — Relatório da aula

Crie:

```text
RELATORIO_ASSERTJ.md
```

Modelo:

```md
# Relatório AssertJ — Aula 255

## Comando executado

`mvn clean test`

## Recursos usados

- assertThat
- assertThatThrownBy
- isEqualByComparingTo
- extracting
- containsExactly
- containsExactlyInAnyOrder
- filteredOn
- satisfies
- usingRecursiveComparison

## Classes testadas

## Cenários de sucesso

## Cenários de erro

## Onde AssertJ melhorou a leitura

## Cuidados com BigDecimal

## Cuidados com listas

## Falhas encontradas

## Correções aplicadas

## Aprendizados
```

---

# Parte 30 — Simulado rápido

## Questão 1

AssertJ é usado principalmente para:

```text
A) escrever assertions fluentes e expressivas.
B) criar banco de dados.
C) substituir Maven.
D) criar imagens Docker.
```

---

## Questão 2

O import principal do AssertJ é:

```text
A) assertThat
B) mock
C) verify
D) SpringApplication
```

---

## Questão 3

Para comparar BigDecimal por valor numérico, uma boa opção é:

```text
A) isEqualByComparingTo
B) isSameAs sempre
C) containsExactly
D) filteredOn
```

---

## Questão 4

`extracting` serve para:

```text
A) extrair propriedades de objetos para validar.
B) criar branch Git.
C) compilar Java.
D) publicar evento.
```

---

## Questão 5

`containsExactly` valida:

```text
A) elementos e ordem.
B) apenas se a lista não é nula.
C) exceção lançada.
D) versão do JDK.
```

---

## Questão 6

`containsExactlyInAnyOrder` valida:

```text
A) elementos sem exigir ordem.
B) ordem obrigatória.
C) stack trace.
D) package Java.
```

---

## Questão 7

`assertThatThrownBy` serve para:

```text
A) validar exceções.
B) criar mock.
C) rodar Maven.
D) gerar JAR.
```

---

## Questão 8

`usingRecursiveComparison` deve ser usado:

```text
A) com cuidado, para comparar objetos por campos recursivamente.
B) sempre em todo teste.
C) apenas para Git.
D) para substituir todos os asserts de regra.
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

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m11/aula-255-assertj-assertions-fluentes
git commit -m "Aula 255: assertj assertions fluentes testes legiveis"
git status
```

---

## Fechamento

A principal ideia desta aula é:

```text
AssertJ melhora a legibilidade e a expressividade dos testes Java, principalmente em objetos, coleções, Optional, exceções e BigDecimal.
```

Você estudou:

```text
AssertJ;
assertThat;
assertThatThrownBy;
strings;
números;
BigDecimal;
objetos;
listas;
containsExactly;
containsExactlyInAnyOrder;
extracting;
tuple em alto nível;
Optional;
filteredOn;
satisfies;
recursive comparison;
descrições com as;
boas práticas;
erros comuns;
AssertJ com Mockito;
preparação para Spring.
```

Na próxima aula, vamos aprofundar:

```text
TDD e estratégia de testes no backend.
```

A ideia será entender Red, Green, Refactor, quando usar TDD, quando não usar, pirâmide de testes, testes unitários, integração, contrato, E2E e como organizar uma estratégia profissional de qualidade em Java Backend.
