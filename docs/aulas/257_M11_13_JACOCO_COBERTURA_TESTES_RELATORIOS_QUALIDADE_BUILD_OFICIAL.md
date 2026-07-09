# 257 — M11.13 — JaCoCo: cobertura de testes, relatórios e qualidade no build

## Objetivo da aula

Na aula anterior, você aprofundou:

```text
TDD;
Red, Green, Refactor;
pirâmide de testes;
testes unitários;
testes de integração;
testes de contrato;
testes E2E;
smoke test;
regressão;
testabilidade;
estratégia de testes por camada;
CI/CD;
cobertura em alto nível.
```

Agora vamos aprofundar uma ferramenta muito usada em projetos Java profissionais:

```text
JaCoCo
```

JaCoCo é uma biblioteca/ferramenta usada para medir cobertura de testes em projetos Java.

Ela ajuda a responder perguntas como:

```text
quais linhas foram executadas pelos testes?
quais branches foram cobertas?
quais métodos foram exercitados?
quais classes estão sem teste?
qual pacote tem baixa cobertura?
o build deve falhar se a cobertura mínima não for atingida?
onde estão os pontos cegos dos testes?
```

Ao final desta aula, você deve conseguir:

```text
entender o que é JaCoCo;
entender o que é cobertura de testes;
entender cobertura de linha;
entender cobertura de branch;
entender cobertura de métodos;
entender cobertura de classes;
configurar JaCoCo no Maven;
gerar relatório HTML;
ler o relatório;
configurar limite mínimo de cobertura;
fazer build falhar por cobertura baixa;
entender o que cobertura mede;
entender o que cobertura não mede;
evitar perseguir cobertura vazia;
relacionar cobertura com qualidade real;
preparar base para SonarQube e pipelines profissionais.
```

---

## Reforço do objetivo maior

Nosso objetivo é formar uma trilha completa de Java Backend, do básico ao nível engenheiro/arquiteto Java.

Por isso, cobertura de testes não será tratada como número bonito para mostrar em dashboard.

Um profissional avançado precisa entender:

```text
o que o número representa;
o que o número não representa;
como interpretar cobertura;
como usar cobertura para melhorar qualidade;
como evitar cobertura falsa;
como configurar build;
como definir limites realistas;
como discutir cobertura em code review;
como usar relatórios em CI/CD;
como conectar cobertura com risco de negócio;
como preparar qualidade técnica em escala.
```

Cobertura é uma métrica.

Métrica ajuda.

Mas métrica mal interpretada atrapalha.

---

# Parte 1 — O que é cobertura de testes

Cobertura de testes mede quanto do código foi executado durante os testes.

Exemplo:

```java
public int dividir(int a, int b) {
    if (b == 0) {
        throw new IllegalArgumentException("Divisor não pode ser zero.");
    }

    return a / b;
}
```

Se você só testa:

```java
dividir(10, 2)
```

Você executa:

```text
return a / b;
```

Mas não executa:

```text
throw new IllegalArgumentException(...)
```

Então, a cobertura não é completa.

---

## Cobertura em uma frase prática

```text
Cobertura mostra quais partes do código foram exercitadas pelos testes.
```

---

# Parte 2 — Cobertura não é qualidade sozinha

Cobertura alta não garante teste bom.

Exemplo ruim:

```java
@Test
void testeRuim() {
    Calculadora calculadora = new Calculadora();

    calculadora.somar(10, 5);
}
```

Esse teste executa código.

Mas não valida nada.

Ele aumenta cobertura, mas não protege comportamento.

Teste bom:

```java
@Test
void deveSomarDoisNumeros() {
    Calculadora calculadora = new Calculadora();

    int resultado = calculadora.somar(10, 5);

    assertThat(resultado).isEqualTo(15);
}
```

Esse teste executa e valida.

---

## Regra profissional

```text
Cobertura mostra execução.
Assertions mostram verificação.
Cenários relevantes mostram qualidade.
```

---

# Parte 3 — O que é JaCoCo

JaCoCo significa:

```text
Java Code Coverage
```

É uma ferramenta de cobertura para Java.

Ela pode ser usada com:

```text
Maven;
Gradle;
JUnit;
Mockito;
Spring;
pipelines CI/CD;
SonarQube;
relatórios HTML/XML.
```

Em projetos Maven, geralmente usamos:

```text
jacoco-maven-plugin
```

---

## O que o JaCoCo gera

JaCoCo pode gerar:

```text
relatório HTML;
relatório XML;
relatório CSV;
arquivo .exec;
validação de cobertura mínima.
```

Relatório HTML é bom para leitura humana.

Relatório XML é muito usado por ferramentas como SonarQube e pipelines.

---

# Parte 4 — Tipos de cobertura

JaCoCo mede várias dimensões.

As principais:

```text
Instruction coverage;
Line coverage;
Branch coverage;
Method coverage;
Class coverage;
Complexity coverage.
```

Vamos entender as mais importantes.

---

## Line coverage

Mede linhas executadas.

Exemplo:

```text
linha foi executada?
sim ou não?
```

Se uma linha executou durante o teste, ela aparece como coberta.

---

## Branch coverage

Mede caminhos de decisão.

Exemplo:

```java
if (valor > 100) {
    return "ALTO";
}

return "BAIXO";
```

Há dois caminhos:

```text
valor > 100 verdadeiro;
valor > 100 falso.
```

Se você só testa valor 150, cobre o caminho verdadeiro.

Mas não cobre o falso.

---

## Method coverage

Mede métodos executados.

Se o teste chamou o método, ele conta como coberto.

Mas isso não garante que todos os caminhos internos foram testados.

---

## Class coverage

Mede classes executadas.

Se algum método da classe foi executado, a classe pode aparecer como coberta.

Mas isso é métrica ampla demais.

---

## Instruction coverage

Mede instruções de bytecode executadas.

É mais baixo nível.

Ajuda a ferramenta, mas no dia a dia você geralmente olha mais para:

```text
lines;
branches;
methods.
```

---

# Parte 5 — Por que branch coverage é importante

Código com `if`, `switch`, `catch`, operador ternário e condições compostas possui caminhos.

Exemplo:

```java
public BigDecimal calcularDesconto(BigDecimal valor, TipoCliente tipo) {
    if (valor.compareTo(new BigDecimal("500.00")) <= 0) {
        return BigDecimal.ZERO;
    }

    if (tipo == TipoCliente.VIP) {
        return valor.multiply(new BigDecimal("0.10"));
    }

    return valor.multiply(new BigDecimal("0.05"));
}
```

Cenários necessários:

```text
valor <= 500;
valor > 500 e VIP;
valor > 500 e COMUM.
```

Se você só testa VIP acima de 500, a linha pode parecer parcialmente coberta, mas branches faltam.

---

## Regra prática

```text
Linha coberta não significa caminho coberto.
```

Branch coverage ajuda a enxergar caminhos não testados.

---

# Parte 6 — Configurando laboratório

Crie:

```powershell
mkdir labs\m11\aula-257-jacoco-cobertura-testes
cd labs\m11\aula-257-jacoco-cobertura-testes

mkdir src\main\java\br\com\curso\aula257
mkdir src\main\java\br\com\curso\aula257\domain
mkdir src\main\java\br\com\curso\aula257\application
mkdir src\main\java\br\com\curso\aula257\application\service

mkdir src\test\java\br\com\curso\aula257
mkdir src\test\java\br\com\curso\aula257\domain
mkdir src\test\java\br\com\curso\aula257\application
mkdir src\test\java\br\com\curso\aula257\application\service
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
    <artifactId>aula-257-jacoco-cobertura-testes</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <junit.version>5.10.2</junit.version>
        <assertj.version>3.26.3</assertj.version>
        <jacoco.version>0.8.12</jacoco.version>
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

            <plugin>
                <groupId>org.jacoco</groupId>
                <artifactId>jacoco-maven-plugin</artifactId>
                <version>${jacoco.version}</version>
                <executions>
                    <execution>
                        <id>prepare-agent</id>
                        <goals>
                            <goal>prepare-agent</goal>
                        </goals>
                    </execution>

                    <execution>
                        <id>report</id>
                        <phase>test</phase>
                        <goals>
                            <goal>report</goal>
                        </goals>
                    </execution>

                    <execution>
                        <id>check</id>
                        <phase>verify</phase>
                        <goals>
                            <goal>check</goal>
                        </goals>
                        <configuration>
                            <rules>
                                <rule>
                                    <element>BUNDLE</element>
                                    <limits>
                                        <limit>
                                            <counter>LINE</counter>
                                            <value>COVEREDRATIO</value>
                                            <minimum>0.80</minimum>
                                        </limit>
                                        <limit>
                                            <counter>BRANCH</counter>
                                            <value>COVEREDRATIO</value>
                                            <minimum>0.70</minimum>
                                        </limit>
                                    </limits>
                                </rule>
                            </rules>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

---

# Parte 7 — Entendendo a configuração JaCoCo

## prepare-agent

```xml
<goal>prepare-agent</goal>
```

Prepara o agente JaCoCo para instrumentar a execução dos testes.

Em termos práticos:

```text
permite que JaCoCo acompanhe o que foi executado durante os testes.
```

---

## report

```xml
<goal>report</goal>
```

Gera relatório.

No nosso exemplo, está ligado à fase:

```xml
<phase>test</phase>
```

Então, ao rodar:

```powershell
mvn test
```

o relatório é gerado.

---

## check

```xml
<goal>check</goal>
```

Valida limites mínimos de cobertura.

No nosso exemplo, está ligado à fase:

```xml
<phase>verify</phase>
```

Então, ao rodar:

```powershell
mvn verify
```

o build pode falhar se a cobertura mínima não for atingida.

---

# Parte 8 — Onde fica o relatório

Após rodar:

```powershell
mvn clean test
```

Abra:

```text
target/site/jacoco/index.html
```

Esse é o relatório HTML.

Também podem aparecer arquivos como:

```text
target/jacoco.exec
target/site/jacoco/jacoco.xml
target/site/jacoco/jacoco.csv
```

---

# Parte 9 — Código de domínio para cobertura

Crie:

```text
src/main/java/br/com/curso/aula257/domain/TipoCliente.java
```

Código:

```java
package br.com.curso.aula257.domain;

public enum TipoCliente {
    COMUM,
    VIP,
    CORPORATIVO
}
```

Crie:

```text
src/main/java/br/com/curso/aula257/domain/StatusPedido.java
```

Código:

```java
package br.com.curso.aula257.domain;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Crie:

```text
src/main/java/br/com/curso/aula257/domain/Pedido.java
```

Código:

```java
package br.com.curso.aula257.domain;

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

        status = StatusPedido.PAGO;
    }

    public void cancelar() {
        if (status == StatusPedido.PAGO) {
            throw new IllegalStateException("Pedido pago não pode ser cancelado.");
        }

        if (status == StatusPedido.CANCELADO) {
            throw new IllegalStateException("Pedido já está cancelado.");
        }

        status = StatusPedido.CANCELADO;
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

# Parte 10 — Service com branches

Crie:

```text
src/main/java/br/com/curso/aula257/application/service/CalculadoraDescontoService.java
```

Código:

```java
package br.com.curso.aula257.application.service;

import br.com.curso.aula257.domain.TipoCliente;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class CalculadoraDescontoService {
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

        if (valor.compareTo(new BigDecimal("500.00")) <= 0) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal percentual = switch (tipoCliente) {
            case COMUM -> new BigDecimal("0.05");
            case VIP -> new BigDecimal("0.10");
            case CORPORATIVO -> new BigDecimal("0.15");
        };

        return valor.multiply(percentual).setScale(2, RoundingMode.HALF_UP);
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula257/application/service/ClassificadorPedidoService.java
```

Código:

```java
package br.com.curso.aula257.application.service;

import br.com.curso.aula257.domain.Pedido;
import br.com.curso.aula257.domain.TipoCliente;

import java.math.BigDecimal;

public class ClassificadorPedidoService {
    public String classificar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        if (pedido.tipoCliente() == TipoCliente.CORPORATIVO) {
            return "CORPORATIVO";
        }

        if (pedido.valor().compareTo(new BigDecimal("1000.00")) >= 0) {
            return "ALTO_VALOR";
        }

        if (pedido.valor().compareTo(new BigDecimal("300.00")) >= 0) {
            return "MEDIO_VALOR";
        }

        return "BAIXO_VALOR";
    }
}
```

---

# Parte 11 — Testes iniciais incompletos

Crie:

```text
src/test/java/br/com/curso/aula257/application/service/CalculadoraDescontoServiceTest.java
```

Código inicial:

```java
package br.com.curso.aula257.application.service;

import br.com.curso.aula257.domain.TipoCliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("CalculadoraDescontoService")
class CalculadoraDescontoServiceTest {
    private final CalculadoraDescontoService service = new CalculadoraDescontoService();

    @Test
    @DisplayName("deve calcular desconto para cliente VIP acima de 500")
    void deveCalcularDescontoParaClienteVipAcimaDe500() {
        BigDecimal desconto = service.calcular(new BigDecimal("1000.00"), TipoCliente.VIP);

        assertThat(desconto).isEqualByComparingTo("100.00");
    }
}
```

Crie:

```text
src/test/java/br/com/curso/aula257/application/service/ClassificadorPedidoServiceTest.java
```

Código inicial:

```java
package br.com.curso.aula257.application.service;

import br.com.curso.aula257.domain.Pedido;
import br.com.curso.aula257.domain.TipoCliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("ClassificadorPedidoService")
class ClassificadorPedidoServiceTest {
    private final ClassificadorPedidoService service = new ClassificadorPedidoService();

    @Test
    @DisplayName("deve classificar pedido de alto valor")
    void deveClassificarPedidoDeAltoValor() {
        Pedido pedido = new Pedido("PED-001", "1000.00", TipoCliente.COMUM);

        String classificacao = service.classificar(pedido);

        assertThat(classificacao).isEqualTo("ALTO_VALOR");
    }
}
```

---

## Rodando relatório inicial

Execute:

```powershell
mvn clean test
```

Abra:

```text
target/site/jacoco/index.html
```

Você verá que há código não coberto.

Isso é esperado.

---

# Parte 12 — Melhorando cobertura com cenários relevantes

Agora melhore os testes para cobrir branches reais.

Atualize:

```text
CalculadoraDescontoServiceTest.java
```

Código completo:

```java
package br.com.curso.aula257.application.service;

import br.com.curso.aula257.domain.TipoCliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("CalculadoraDescontoService")
class CalculadoraDescontoServiceTest {
    private final CalculadoraDescontoService service = new CalculadoraDescontoService();

    @Nested
    @DisplayName("Sucesso")
    class Sucesso {
        @Test
        @DisplayName("deve retornar zero para valor até 500")
        void deveRetornarZeroParaValorAte500() {
            BigDecimal desconto = service.calcular(new BigDecimal("500.00"), TipoCliente.COMUM);

            assertThat(desconto).isEqualByComparingTo("0.00");
        }

        @Test
        @DisplayName("deve calcular cinco por cento para cliente comum acima de 500")
        void deveCalcularCincoPorCentoParaClienteComumAcimaDe500() {
            BigDecimal desconto = service.calcular(new BigDecimal("1000.00"), TipoCliente.COMUM);

            assertThat(desconto).isEqualByComparingTo("50.00");
        }

        @Test
        @DisplayName("deve calcular dez por cento para cliente VIP acima de 500")
        void deveCalcularDezPorCentoParaClienteVipAcimaDe500() {
            BigDecimal desconto = service.calcular(new BigDecimal("1000.00"), TipoCliente.VIP);

            assertThat(desconto).isEqualByComparingTo("100.00");
        }

        @Test
        @DisplayName("deve calcular quinze por cento para cliente corporativo acima de 500")
        void deveCalcularQuinzePorCentoParaClienteCorporativoAcimaDe500() {
            BigDecimal desconto = service.calcular(new BigDecimal("1000.00"), TipoCliente.CORPORATIVO);

            assertThat(desconto).isEqualByComparingTo("150.00");
        }
    }

    @Nested
    @DisplayName("Erro")
    class Erro {
        @Test
        @DisplayName("não deve calcular com valor nulo")
        void naoDeveCalcularComValorNulo() {
            assertThatThrownBy(() -> service.calcular(null, TipoCliente.COMUM))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Valor é obrigatório.");
        }

        @Test
        @DisplayName("não deve calcular com valor zero")
        void naoDeveCalcularComValorZero() {
            assertThatThrownBy(() -> service.calcular(BigDecimal.ZERO, TipoCliente.COMUM))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Valor deve ser maior que zero.");
        }

        @Test
        @DisplayName("não deve calcular com tipo de cliente nulo")
        void naoDeveCalcularComTipoClienteNulo() {
            assertThatThrownBy(() -> service.calcular(new BigDecimal("1000.00"), null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Tipo de cliente é obrigatório.");
        }
    }
}
```

Atualize:

```text
ClassificadorPedidoServiceTest.java
```

Código completo:

```java
package br.com.curso.aula257.application.service;

import br.com.curso.aula257.domain.Pedido;
import br.com.curso.aula257.domain.TipoCliente;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("ClassificadorPedidoService")
class ClassificadorPedidoServiceTest {
    private final ClassificadorPedidoService service = new ClassificadorPedidoService();

    @Nested
    @DisplayName("Sucesso")
    class Sucesso {
        @Test
        @DisplayName("deve classificar pedido corporativo")
        void deveClassificarPedidoCorporativo() {
            Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.CORPORATIVO);

            String classificacao = service.classificar(pedido);

            assertThat(classificacao).isEqualTo("CORPORATIVO");
        }

        @Test
        @DisplayName("deve classificar pedido de alto valor")
        void deveClassificarPedidoDeAltoValor() {
            Pedido pedido = new Pedido("PED-001", "1000.00", TipoCliente.COMUM);

            String classificacao = service.classificar(pedido);

            assertThat(classificacao).isEqualTo("ALTO_VALOR");
        }

        @Test
        @DisplayName("deve classificar pedido de médio valor")
        void deveClassificarPedidoDeMedioValor() {
            Pedido pedido = new Pedido("PED-001", "300.00", TipoCliente.COMUM);

            String classificacao = service.classificar(pedido);

            assertThat(classificacao).isEqualTo("MEDIO_VALOR");
        }

        @Test
        @DisplayName("deve classificar pedido de baixo valor")
        void deveClassificarPedidoDeBaixoValor() {
            Pedido pedido = new Pedido("PED-001", "299.99", TipoCliente.COMUM);

            String classificacao = service.classificar(pedido);

            assertThat(classificacao).isEqualTo("BAIXO_VALOR");
        }
    }

    @Nested
    @DisplayName("Erro")
    class Erro {
        @Test
        @DisplayName("não deve classificar pedido nulo")
        void naoDeveClassificarPedidoNulo() {
            assertThatThrownBy(() -> service.classificar(null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Pedido é obrigatório.");
        }
    }
}
```

---

# Parte 13 — Teste do domínio Pedido

Crie:

```text
src/test/java/br/com/curso/aula257/domain/PedidoTest.java
```

Código:

```java
package br.com.curso.aula257.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("Pedido")
class PedidoTest {
    @Nested
    @DisplayName("Criação")
    class Criacao {
        @Test
        @DisplayName("deve criar pedido com dados válidos")
        void deveCriarPedidoComDadosValidos() {
            Pedido pedido = new Pedido(" ped-001 ", "100.00", TipoCliente.VIP);

            assertThat(pedido.codigo()).isEqualTo("PED-001");
            assertThat(pedido.valor()).isEqualByComparingTo("100.00");
            assertThat(pedido.tipoCliente()).isEqualTo(TipoCliente.VIP);
            assertThat(pedido.status()).isEqualTo(StatusPedido.CRIADO);
        }

        @Test
        @DisplayName("não deve criar pedido sem código")
        void naoDeveCriarPedidoSemCodigo() {
            assertThatThrownBy(() -> new Pedido(" ", "100.00", TipoCliente.COMUM))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Código é obrigatório.");
        }

        @Test
        @DisplayName("não deve criar pedido com valor nulo")
        void naoDeveCriarPedidoComValorNulo() {
            assertThatThrownBy(() -> new Pedido("PED-001", (BigDecimal) null, TipoCliente.COMUM))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Valor deve ser maior que zero.");
        }

        @Test
        @DisplayName("não deve criar pedido com tipo de cliente nulo")
        void naoDeveCriarPedidoComTipoClienteNulo() {
            assertThatThrownBy(() -> new Pedido("PED-001", "100.00", null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Tipo de cliente é obrigatório.");
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

            assertThat(pedido.status()).isEqualTo(StatusPedido.PAGO);
        }

        @Test
        @DisplayName("não deve pagar pedido cancelado")
        void naoDevePagarPedidoCancelado() {
            Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);
            pedido.cancelar();

            assertThatThrownBy(pedido::pagar)
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Pedido cancelado não pode ser pago.");
        }

        @Test
        @DisplayName("não deve pagar pedido já pago")
        void naoDevePagarPedidoJaPago() {
            Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);
            pedido.pagar();

            assertThatThrownBy(pedido::pagar)
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Pedido já está pago.");
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

            assertThat(pedido.status()).isEqualTo(StatusPedido.CANCELADO);
        }

        @Test
        @DisplayName("não deve cancelar pedido pago")
        void naoDeveCancelarPedidoPago() {
            Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);
            pedido.pagar();

            assertThatThrownBy(pedido::cancelar)
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Pedido pago não pode ser cancelado.");
        }

        @Test
        @DisplayName("não deve cancelar pedido já cancelado")
        void naoDeveCancelarPedidoJaCancelado() {
            Pedido pedido = new Pedido("PED-001", "100.00", TipoCliente.COMUM);
            pedido.cancelar();

            assertThatThrownBy(pedido::cancelar)
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Pedido já está cancelado.");
        }
    }
}
```

---

# Parte 14 — Rodando coverage completo

Execute:

```powershell
mvn clean test
```

Depois abra:

```text
target/site/jacoco/index.html
```

Para validar limites:

```powershell
mvn clean verify
```

Se a cobertura estiver abaixo dos mínimos configurados, o build falha.

---

# Parte 15 — Entendendo falha por cobertura mínima

Se o JaCoCo check falhar, você verá algo parecido com:

```text
Rule violated for bundle aula-257-jacoco-cobertura-testes:
lines covered ratio is 0.75, but expected minimum is 0.80
```

Isso significa:

```text
cobertura de linhas foi 75%;
mínimo configurado era 80%;
build falhou.
```

---

## O que fazer

Não faça teste qualquer só para subir número.

Faça:

```text
abra relatório;
veja código não coberto;
entenda se é regra relevante;
crie cenário de teste útil;
rode novamente;
avalie branch coverage.
```

---

# Parte 16 — Configurando limites por pacote ou classe

No exemplo usamos:

```xml
<element>BUNDLE</element>
```

Isso aplica ao projeto como um todo.

Também existem outros níveis, como:

```text
PACKAGE;
CLASS;
SOURCEFILE;
METHOD.
```

Exemplo conceitual:

```xml
<element>CLASS</element>
```

Pode ser rígido demais em alguns projetos.

---

## Regra profissional

```text
Limite global é mais simples.
Limite por classe é mais rígido.
Limite por pacote pode ser útil em projetos maduros.
```

Comece simples.

Evolua com maturidade.

---

# Parte 17 — Excluindo classes da cobertura

Às vezes faz sentido excluir:

```text
classes de configuração;
DTOs simples;
classes geradas;
main application;
mappers gerados;
código boilerplate.
```

Exemplo conceitual:

```xml
<configuration>
    <excludes>
        <exclude>**/config/**</exclude>
        <exclude>**/*Application.class</exclude>
        <exclude>**/dto/**</exclude>
    </excludes>
</configuration>
```

---

## Cuidado com exclusões

Não exclua regra de negócio só para melhorar número.

Exclusão deve ter justificativa.

Exemplo ruim:

```text
excluir service porque está difícil testar.
```

Melhor:

```text
melhorar design e testar.
```

---

# Parte 18 — Cobertura em projeto Spring

Quando chegarmos em Spring, JaCoCo continuará funcionando.

Você verá classes como:

```text
Controller;
Service;
UseCase;
Repository;
Configuration;
Application;
DTO;
Entity;
Mapper.
```

A estratégia será:

```text
domínio e use cases:
alta cobertura unitária.

repositories:
cobertura por integração.

controllers:
cobertura por web tests.

configurations:
nem sempre entram no alvo principal.

DTOs simples:
depende da política do time.
```

---

# Parte 19 — Cobertura e SonarQube

Em empresas, é comum usar SonarQube ou ferramentas similares.

O fluxo:

```text
mvn test gera jacoco.xml;
pipeline envia relatório para Sonar;
Sonar calcula coverage;
quality gate valida limites;
PR pode ser bloqueado.
```

Um conceito importante:

```text
coverage on new code
```

Ou seja:

```text
cobertura apenas do código novo alterado no PR.
```

Isso é mais justo do que exigir 80% em um legado inteiro de uma vez.

---

# Parte 20 — Coverage on new code

Em projeto legado, cobertura global pode ser baixa.

Exemplo:

```text
projeto inteiro: 32%;
código novo: 85%.
```

Uma boa estratégia é:

```text
não tentar resolver tudo de uma vez;
exigir boa cobertura no código novo;
aumentar cobertura gradualmente;
criar testes ao mexer em código legado;
priorizar áreas críticas.
```

---

# Parte 21 — Métricas úteis além de cobertura

Cobertura é só uma métrica.

Outras métricas e sinais:

```text
testes passando;
tempo de build;
quantidade de testes;
falhas intermitentes;
bugs em produção;
complexidade ciclomática;
duplicação;
code smells;
mutation score;
tempo para diagnosticar falhas;
qualidade dos asserts;
testes de regressão para bugs reais.
```

Um bom engenheiro não olha apenas um número.

---

# Parte 22 — Cobertura de código novo vs cobertura total

## Cobertura total

Mostra o projeto inteiro.

Útil para visão geral.

Mas pode punir times que herdaram legado ruim.

---

## Cobertura de código novo

Mostra apenas alterações recentes.

Muito útil para PR.

Regra profissional:

```text
não piore a base.
código novo deve nascer testado.
```

---

# Parte 23 — Antipadrões de cobertura

## 1. Teste sem assert

Aumenta execução, mas não valida.

---

## 2. Teste só para passar no percentual

Exemplo:

```java
@Test
void cobertura() {
    new MinhaClasse().metodo1();
    new MinhaClasse().metodo2();
    new MinhaClasse().metodo3();
}
```

Isso é fraco.

---

## 3. Excluir pacote inteiro sem justificativa

Exemplo:

```text
excluir application/service
```

Péssimo se ali está regra.

---

## 4. Perseguir 100% em tudo

Pode gerar custo alto sem ganho proporcional.

Alguns códigos têm baixo valor de teste direto.

Melhor focar risco e regra.

---

## 5. Ignorar branch coverage

Linha coberta pode esconder caminho não testado.

---

# Parte 24 — Como usar cobertura no code review

Em PR, avalie:

```text
código novo tem teste?
cenários de erro foram cobertos?
branches importantes foram cobertos?
teste tem assert?
teste valida comportamento?
cobertura caiu?
relatório aponta classe crítica sem teste?
há exclusão suspeita?
há teste artificial?
```

Perguntas boas:

```text
qual regra esse teste protege?
esse teste falharia se a regra quebrasse?
esse teste cobre cenário negativo?
essa branch não coberta é relevante?
```

---

# Parte 25 — Como definir limite mínimo

Não existe número mágico.

Exemplo de estratégia:

```text
projeto novo:
80% linhas e 70% branches pode ser um começo.

projeto legado:
começar com limite menor global e exigir mais no código novo.

domínio crítico:
pode exigir cobertura mais alta.

código de configuração:
pode ser excluído ou ter exigência menor.
```

---

## Regra profissional

```text
limite deve ser realista, evolutivo e conectado a qualidade.
```

Não defina número impossível só para todo mundo burlar.

---

# Parte 26 — Comandos importantes

Rodar testes e gerar relatório:

```powershell
mvn clean test
```

Rodar verificação de cobertura:

```powershell
mvn clean verify
```

Abrir relatório:

```text
target/site/jacoco/index.html
```

Limpar:

```powershell
mvn clean
```

---

# Parte 27 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar o que é cobertura de testes.
[ ] Sei explicar o que é JaCoCo.
[ ] Sei configurar jacoco-maven-plugin.
[ ] Sei explicar prepare-agent.
[ ] Sei explicar report.
[ ] Sei explicar check.
[ ] Sei gerar relatório HTML.
[ ] Sei abrir target/site/jacoco/index.html.
[ ] Sei interpretar line coverage.
[ ] Sei interpretar branch coverage.
[ ] Sei interpretar method coverage.
[ ] Sei explicar por que cobertura não garante qualidade.
[ ] Sei configurar limite mínimo.
[ ] Sei fazer build falhar por cobertura baixa.
[ ] Sei melhorar cobertura com cenários úteis.
[ ] Sei evitar teste sem assert.
[ ] Sei discutir cobertura em PR.
[ ] Sei explicar coverage on new code.
[ ] Sei preparar base para SonarQube.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é cobertura de testes?
2. O que é JaCoCo?
3. O que é line coverage?
4. O que é branch coverage?
5. Por que branch coverage importa?
6. O que é method coverage?
7. O que faz prepare-agent?
8. O que faz report?
9. O que faz check?
10. Onde fica o relatório HTML?
11. Qual comando gera relatório?
12. Qual comando valida limite?
13. Por que cobertura alta não garante qualidade?
14. O que é teste sem assert?
15. Quando excluir classe da cobertura?
16. O que é coverage on new code?
17. Como cobertura entra no CI/CD?
18. Como usar cobertura em code review?
```

---

# Parte 28 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-257-jacoco-cobertura-testes
```

Com:

```text
pom.xml;
TipoCliente.java;
StatusPedido.java;
Pedido.java;
CalculadoraDescontoService.java;
ClassificadorPedidoService.java;
PedidoTest.java;
CalculadoraDescontoServiceTest.java;
ClassificadorPedidoServiceTest.java;
RELATORIO_COBERTURA.md.
```

---

## Requisitos

Você deve:

```text
configurar JaCoCo;
rodar mvn clean test;
abrir target/site/jacoco/index.html;
rodar mvn clean verify;
validar limite mínimo;
criar testes de sucesso;
criar testes de erro;
cobrir branches principais;
documentar resultado.
```

---

## Critérios

```text
relatório HTML deve ser gerado;
build verify deve passar;
testes devem ter assertions reais;
não criar teste apenas para cobertura;
branch coverage deve ser analisado;
RELATORIO_COBERTURA.md deve explicar números;
não excluir regra de negócio da cobertura.
```

---

# Parte 29 — Relatório da aula

Crie:

```text
RELATORIO_COBERTURA.md
```

Modelo:

```md
# Relatório de Cobertura — Aula 257

## Comando executado

`mvn clean test`

`mvn clean verify`

## Relatório HTML

`target/site/jacoco/index.html`

## Cobertura observada

### Linhas

### Branches

### Métodos

### Classes

## Classes analisadas

- Pedido
- CalculadoraDescontoService
- ClassificadorPedidoService

## Pontos não cobertos inicialmente

## Testes adicionados para melhorar cobertura

## Cenários de sucesso cobertos

## Cenários de erro cobertos

## Branches relevantes cobertas

## O que cobertura não garante neste laboratório

## Decisões

## Aprendizados
```

---

# Parte 30 — Desafio extra

## Adicionar service de elegibilidade

Crie:

```text
ElegibilidadePedidoService
```

Regra:

```text
pedido é elegível para análise especial quando:
tipoCliente é CORPORATIVO
OU
valor >= 1000
OU
status é CANCELADO
```

Mas:

```text
pedido nulo deve lançar erro.
```

Crie testes cobrindo:

```text
pedido corporativo;
pedido valor alto;
pedido cancelado;
pedido comum valor baixo criado;
pedido nulo;
combinações relevantes.
```

Depois rode:

```powershell
mvn clean verify
```

Analise branch coverage.

---

# Parte 31 — Simulado rápido

## Questão 1

JaCoCo é usado para:

```text
A) medir cobertura de testes em Java.
B) criar branch Git.
C) substituir JUnit.
D) criar banco de dados.
```

---

## Questão 2

Line coverage mede:

```text
A) linhas executadas pelos testes.
B) nomes de classes.
C) commits no Git.
D) tempo de deploy.
```

---

## Questão 3

Branch coverage mede:

```text
A) caminhos de decisão executados.
B) branches do Git.
C) arquivos no target.
D) dependências Maven.
```

---

## Questão 4

O relatório HTML do JaCoCo geralmente fica em:

```text
A) target/site/jacoco/index.html
B) src/main/java/index.html
C) .git/jacoco.html
D) pom.xml
```

---

## Questão 5

Cobertura alta:

```text
A) não garante qualidade sozinha.
B) garante ausência total de bugs.
C) elimina necessidade de assert.
D) substitui code review.
```

---

## Questão 6

O goal `check` do JaCoCo serve para:

```text
A) validar regras mínimas de cobertura.
B) executar aplicação.
C) criar Dockerfile.
D) instalar Java.
```

---

## Questão 7

Um antipadrão é:

```text
A) criar teste sem assert apenas para aumentar cobertura.
B) criar teste para regra de negócio.
C) testar branches importantes.
D) analisar relatório HTML.
```

---

## Questão 8

Coverage on new code significa:

```text
A) cobertura do código novo/alterado.
B) cobertura apenas do Java instalado.
C) cobertura do Git remoto.
D) cobertura de arquivos .md.
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
git add labs/m11/aula-257-jacoco-cobertura-testes
git commit -m "Aula 257: jacoco cobertura testes relatorios qualidade build"
git status
```

---

## Fechamento

A principal ideia desta aula é:

```text
JaCoCo mede execução dos testes, mas qualidade real depende de cenários relevantes, assertions fortes e estratégia bem definida.
```

Você estudou:

```text
cobertura de testes;
JaCoCo;
jacoco-maven-plugin;
prepare-agent;
report;
check;
line coverage;
branch coverage;
method coverage;
class coverage;
relatório HTML;
target/site/jacoco/index.html;
limites mínimos;
falha de build;
exclusões;
coverage on new code;
SonarQube em alto nível;
antipadrões;
code review;
estratégia de cobertura;
laboratório Maven.
```

Na próxima aula, vamos aprofundar:

```text
SonarQube, qualidade de código, quality gates e análise estática.
```

A ideia será entender bugs, vulnerabilities, code smells, duplicação, cobertura, quality gate, análise em pipeline, leitura de issues e como isso entra na rotina profissional de Java Backend.
