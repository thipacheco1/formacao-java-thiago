# 251 — M11.07 — JUnit 5: testes unitários, assertions e ciclo de vida

## Objetivo da aula

Na aula anterior, você aprofundou:

```text
IDE;
terminal;
debugging;
breakpoints;
stack trace;
call stack;
produtividade;
investigação profissional.
```

Agora vamos entrar em uma ferramenta essencial para Java Backend profissional:

```text
JUnit 5
```

JUnit é uma das principais bibliotecas para escrever e executar testes automatizados em Java.

Esta aula é muito importante porque um backend Java de nível profissional não pode depender apenas de teste manual, print no console ou validação visual.

Um profissional Java Backend, evoluindo para nível sênior, engenheiro ou arquiteto, precisa dominar testes porque testes protegem:

```text
regra de negócio;
refatoração;
manutenção;
evolução;
qualidade;
entrega contínua;
confiança no build;
segurança em deploy;
arquitetura.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é teste unitário;
entender o que é JUnit 5;
configurar JUnit 5 com Maven;
criar classes de teste;
usar @Test;
usar assertions;
testar retorno;
testar exceções;
usar @BeforeEach;
usar @AfterEach;
usar @BeforeAll;
usar @AfterAll;
usar @DisplayName;
organizar nomes de testes;
testar regras de domínio;
rodar testes pelo terminal;
interpretar falhas de teste;
evitar testes frágeis;
preparar base para Mockito e testes de backend.
```

---

## Reforço do objetivo maior

Nosso curso está sendo construído para ir do básico ao nível arquiteto/engenheiro Java.

Por isso, testes não serão tratados como algo opcional.

Testes são parte da engenharia.

Um profissional avançado precisa saber:

```text
o que testar;
como testar;
por que testar;
quando teste unitário basta;
quando precisa teste de integração;
como isolar regra;
como testar exceções;
como testar comportamento;
como escrever teste legível;
como evitar teste acoplado demais;
como usar testes para guiar refatoração;
como pipeline usa testes;
como arquitetura facilita testes.
```

Nesta aula, começamos pela base:

```text
JUnit 5 e testes unitários.
```

---

# Parte 1 — O que é teste automatizado

Teste automatizado é um código que valida outro código.

Exemplo:

```java
@Test
void deveSomarDoisNumeros() {
    Calculadora calculadora = new Calculadora();

    int resultado = calculadora.somar(10, 5);

    assertEquals(15, resultado);
}
```

Esse teste verifica automaticamente se:

```text
10 + 5 retorna 15.
```

Se alguém quebrar essa regra, o teste falha.

---

## Teste automatizado em uma frase prática

```text
Teste automatizado é código que verifica se o comportamento esperado do sistema continua correto.
```

---

# Parte 2 — Por que testar

Testes ajudam a:

```text
evitar regressão;
documentar comportamento;
proteger regra de negócio;
dar confiança para refatorar;
reduzir teste manual repetitivo;
apoiar CI/CD;
melhorar design;
facilitar manutenção;
acelerar investigação;
aumentar qualidade.
```

---

## Regressão

Regressão é quando algo que funcionava para de funcionar após uma mudança.

Exemplo:

```text
você altera cálculo de desconto;
sem querer quebra cálculo de frete.
```

Teste automatizado ajuda a detectar isso cedo.

---

# Parte 3 — Tipos de teste

Existem vários tipos.

Nesta aula, vamos focar em:

```text
teste unitário.
```

Mas é importante conhecer a visão geral.

---

## Teste unitário

Testa uma unidade pequena de código.

Exemplos:

```text
método de domínio;
validador;
calculadora;
strategy;
use case com dependências fake;
parser;
normalizador;
regra de status.
```

Características:

```text
rápido;
isolado;
não depende de banco;
não depende de API externa;
não depende de rede;
não depende de arquivo real quando possível.
```

---

## Teste de integração

Testa integração entre partes.

Exemplos:

```text
repository com banco;
controller com Spring;
client HTTP;
mensageria;
persistência;
serialização JSON.
```

Geralmente é mais lento e exige ambiente.

---

## Teste end-to-end

Testa fluxo completo.

Exemplo:

```text
front chama API;
API salva banco;
mensagem é enviada;
resposta aparece.
```

É mais caro e mais lento.

---

## Regra prática

```text
Teste unitário:
testa regra pequena rápido.

Teste de integração:
testa se partes conversam corretamente.

Teste e2e:
testa jornada completa.
```

---

# Parte 4 — O que é JUnit 5

JUnit 5 é uma plataforma moderna de testes para Java.

Ela é composta por partes:

```text
JUnit Platform;
JUnit Jupiter;
JUnit Vintage.
```

---

## JUnit Platform

Base para descoberta e execução de testes.

Ferramentas como Maven, Gradle e IDE usam a plataforma para rodar testes.

---

## JUnit Jupiter

É a API moderna para escrever testes JUnit 5.

É aqui que entram:

```text
@Test;
@BeforeEach;
@AfterEach;
@DisplayName;
Assertions.
```

---

## JUnit Vintage

Permite rodar testes antigos de JUnit 3 e JUnit 4.

No nosso curso, vamos usar JUnit Jupiter.

---

# Parte 5 — Configurando JUnit 5 com Maven

Crie o projeto:

```powershell
mkdir labs\m11\aula-251-junit5-testes-unitarios
cd labs\m11\aula-251-junit5-testes-unitarios
mkdir src\main\java\br\com\curso\aula251
mkdir src\test\java\br\com\curso\aula251
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
    <artifactId>aula-251-junit5-testes-unitarios</artifactId>
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

## Por que scope test

A dependência do JUnit deve ser usada apenas nos testes:

```xml
<scope>test</scope>
```

Isso significa:

```text
JUnit não entra no código de produção.
JUnit entra apenas no classpath de teste.
```

---

# Parte 6 — Primeiro código para testar

Crie:

```text
src/main/java/br/com/curso/aula251/Calculadora.java
```

Código:

```java
package br.com.curso.aula251;

public class Calculadora {
    public int somar(int a, int b) {
        return a + b;
    }

    public int subtrair(int a, int b) {
        return a - b;
    }

    public int multiplicar(int a, int b) {
        return a * b;
    }

    public int dividir(int a, int b) {
        if (b == 0) {
            throw new IllegalArgumentException("Divisor não pode ser zero.");
        }

        return a / b;
    }

    public boolean par(int numero) {
        return numero % 2 == 0;
    }
}
```

---

# Parte 7 — Primeiro teste

Crie:

```text
src/test/java/br/com/curso/aula251/CalculadoraTest.java
```

Código:

```java
package br.com.curso.aula251;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CalculadoraTest {
    @Test
    void deveSomarDoisNumeros() {
        Calculadora calculadora = new Calculadora();

        int resultado = calculadora.somar(10, 5);

        assertEquals(15, resultado);
    }
}
```

Execute:

```powershell
mvn test
```

Resultado esperado:

```text
BUILD SUCCESS
```

---

## Anatomia do teste

```java
@Test
```

Indica que o método é um teste.

```java
void deveSomarDoisNumeros()
```

Nome do teste.

```java
Calculadora calculadora = new Calculadora();
```

Preparação.

```java
int resultado = calculadora.somar(10, 5);
```

Execução.

```java
assertEquals(15, resultado);
```

Verificação.

---

# Parte 8 — Padrão AAA

Um teste legível costuma seguir o padrão:

```text
Arrange;
Act;
Assert.
```

Em português:

```text
Preparar;
Executar;
Verificar.
```

Exemplo:

```java
@Test
void deveSomarDoisNumeros() {
    // Arrange
    Calculadora calculadora = new Calculadora();

    // Act
    int resultado = calculadora.somar(10, 5);

    // Assert
    assertEquals(15, resultado);
}
```

Não precisa comentar sempre, mas a estrutura mental ajuda.

---

## Regra prática

```text
Um bom teste deixa claro:
dado um cenário,
quando uma ação acontece,
então um resultado deve ocorrer.
```

---

# Parte 9 — Assertions principais

JUnit oferece várias assertions.

Vamos estudar as mais usadas.

---

## assertEquals

Verifica igualdade.

```java
assertEquals(15, resultado);
```

Ordem recomendada:

```text
esperado primeiro;
atual depois.
```

Exemplo:

```java
assertEquals(valorEsperado, valorAtual);
```

---

## assertNotEquals

Verifica que valores são diferentes.

```java
assertNotEquals(0, resultado);
```

---

## assertTrue

Verifica verdadeiro.

```java
assertTrue(calculadora.par(10));
```

---

## assertFalse

Verifica falso.

```java
assertFalse(calculadora.par(11));
```

---

## assertNull

Verifica nulo.

```java
assertNull(valor);
```

---

## assertNotNull

Verifica não nulo.

```java
assertNotNull(cliente);
```

---

## assertThrows

Verifica exceção.

```java
assertThrows(IllegalArgumentException.class, () -> calculadora.dividir(10, 0));
```

---

## assertAll

Agrupa várias verificações.

```java
assertAll(
        () -> assertEquals("PED-001", pedido.codigo()),
        () -> assertEquals("PAGO", pedido.status()),
        () -> assertEquals("Ana", pedido.cliente())
);
```

Se uma falhar, JUnit mostra todas as falhas do grupo.

---

# Parte 10 — Testando a Calculadora completa

Atualize:

```text
CalculadoraTest.java
```

Código:

```java
package br.com.curso.aula251;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CalculadoraTest {
    @Test
    void deveSomarDoisNumeros() {
        Calculadora calculadora = new Calculadora();

        int resultado = calculadora.somar(10, 5);

        assertEquals(15, resultado);
    }

    @Test
    void deveSubtrairDoisNumeros() {
        Calculadora calculadora = new Calculadora();

        int resultado = calculadora.subtrair(10, 5);

        assertEquals(5, resultado);
    }

    @Test
    void deveMultiplicarDoisNumeros() {
        Calculadora calculadora = new Calculadora();

        int resultado = calculadora.multiplicar(10, 5);

        assertEquals(50, resultado);
    }

    @Test
    void deveDividirDoisNumeros() {
        Calculadora calculadora = new Calculadora();

        int resultado = calculadora.dividir(10, 5);

        assertEquals(2, resultado);
    }

    @Test
    void naoDeveDividirPorZero() {
        Calculadora calculadora = new Calculadora();

        assertThrows(IllegalArgumentException.class, () -> calculadora.dividir(10, 0));
    }

    @Test
    void deveIdentificarNumeroPar() {
        Calculadora calculadora = new Calculadora();

        assertTrue(calculadora.par(10));
    }

    @Test
    void deveIdentificarNumeroImpar() {
        Calculadora calculadora = new Calculadora();

        assertFalse(calculadora.par(11));
    }
}
```

Execute:

```powershell
mvn test
```

---

# Parte 11 — Testando mensagem da exceção

Às vezes, não basta testar que exceção foi lançada.

Também queremos testar a mensagem.

Exemplo:

```java
@Test
void naoDeveDividirPorZeroComMensagemClara() {
    Calculadora calculadora = new Calculadora();

    IllegalArgumentException erro = assertThrows(
            IllegalArgumentException.class,
            () -> calculadora.dividir(10, 0)
    );

    assertEquals("Divisor não pode ser zero.", erro.getMessage());
}
```

Isso valida:

```text
tipo da exceção;
mensagem da exceção.
```

Mensagem clara é importante para debug, logs e resposta de API futura.

---

# Parte 12 — @DisplayName

`@DisplayName` permite dar nome mais descritivo ao teste.

Exemplo:

```java
@Test
@DisplayName("Deve lançar erro ao tentar dividir por zero")
void naoDeveDividirPorZero() {
    Calculadora calculadora = new Calculadora();

    assertThrows(IllegalArgumentException.class, () -> calculadora.dividir(10, 0));
}
```

No relatório, aparece o nome amigável.

---

## Quando usar

Use quando o nome do método ficaria muito grande ou quando deseja relatório mais legível.

Mesmo com `@DisplayName`, mantenha o nome do método claro.

---

# Parte 13 — Ciclo de vida dos testes

JUnit permite executar código antes e depois dos testes.

Anotações:

```text
@BeforeEach;
@AfterEach;
@BeforeAll;
@AfterAll.
```

---

## @BeforeEach

Executa antes de cada teste.

Exemplo:

```java
private Calculadora calculadora;

@BeforeEach
void setUp() {
    calculadora = new Calculadora();
}
```

Assim cada teste começa com uma calculadora nova.

---

## @AfterEach

Executa depois de cada teste.

Útil para limpeza.

Exemplo:

```java
@AfterEach
void tearDown() {
    System.out.println("Teste finalizado.");
}
```

Em testes unitários simples, você usa pouco.

Em integração, pode limpar recursos.

---

## @BeforeAll

Executa uma vez antes de todos os testes da classe.

Precisa ser `static`, por padrão.

Exemplo:

```java
@BeforeAll
static void antesDeTodos() {
    System.out.println("Iniciando testes da Calculadora.");
}
```

---

## @AfterAll

Executa uma vez depois de todos os testes da classe.

Exemplo:

```java
@AfterAll
static void depoisDeTodos() {
    System.out.println("Finalizando testes da Calculadora.");
}
```

---

# Parte 14 — CalculadoraTest com ciclo de vida

Crie:

```text
src/test/java/br/com/curso/aula251/CalculadoraCicloVidaTest.java
```

Código:

```java
package br.com.curso.aula251;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CalculadoraCicloVidaTest {
    private Calculadora calculadora;

    @BeforeAll
    static void antesDeTodos() {
        System.out.println("Iniciando testes da CalculadoraCicloVidaTest.");
    }

    @BeforeEach
    void antesDeCadaTeste() {
        calculadora = new Calculadora();
        System.out.println("Nova calculadora criada.");
    }

    @AfterEach
    void depoisDeCadaTeste() {
        System.out.println("Teste finalizado.");
    }

    @AfterAll
    static void depoisDeTodos() {
        System.out.println("Todos os testes foram finalizados.");
    }

    @Test
    void deveSomar() {
        assertEquals(15, calculadora.somar(10, 5));
    }

    @Test
    void deveSubtrair() {
        assertEquals(5, calculadora.subtrair(10, 5));
    }
}
```

---

## Observação profissional

Não abuse de `System.out.println` em testes.

Aqui estamos usando para aprender ciclo de vida.

Em projeto real, teste deve ser limpo.

---

# Parte 15 — Cuidado com estado compartilhado

Teste ruim:

```java
class PedidoTest {
    private static Pedido pedido = new Pedido(...);

    @Test
    void teste1() {
        pedido.cancelar();
    }

    @Test
    void teste2() {
        assertEquals("PENDENTE", pedido.status());
    }
}
```

Problema:

```text
um teste altera estado usado por outro.
```

Isso causa testes instáveis.

Regra profissional:

```text
um teste não deve depender da ordem ou efeito de outro teste.
```

Cada teste deve montar seu próprio cenário ou usar `@BeforeEach` para estado novo.

---

# Parte 16 — Nome de teste

Um bom nome de teste descreve comportamento.

Exemplos bons:

```text
deveCriarPedidoQuandoDadosValidos
naoDeveCriarPedidoComValorZero
deveAplicarDescontoParaClienteVip
naoDeveCancelarPedidoJaEntregue
deveLancarErroQuandoEmailForInvalido
```

Exemplos ruins:

```text
teste1
testaPedido
deuCerto
validacao
cenarioA
```

---

## Padrão recomendado

Use nomes como:

```text
deve...Quando...
naoDeve...Quando...
```

Exemplos:

```java
void deveAprovarTransacaoQuandoStatusForPendente()
void naoDeveAprovarTransacaoQuandoStatusForRecusada()
```

---

# Parte 17 — Testando domínio: Pedido

Agora vamos testar uma classe mais próxima de backend.

Crie:

```text
src/main/java/br/com/curso/aula251/StatusPedido.java
```

Código:

```java
package br.com.curso.aula251;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Crie:

```text
src/main/java/br/com/curso/aula251/Pedido.java
```

Código:

```java
package br.com.curso.aula251;

import java.math.BigDecimal;

public class Pedido {
    private final String codigo;
    private final BigDecimal valor;
    private StatusPedido status;

    public Pedido(String codigo, BigDecimal valor) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.valor = valor;
        this.status = StatusPedido.CRIADO;
    }

    public Pedido(String codigo, String valor) {
        this(codigo, new BigDecimal(valor));
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

    public StatusPedido status() {
        return status;
    }
}
```

---

# Parte 18 — Testando Pedido

Crie:

```text
src/test/java/br/com/curso/aula251/PedidoTest.java
```

Código:

```java
package br.com.curso.aula251;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PedidoTest {
    @Test
    void deveCriarPedidoComStatusCriado() {
        Pedido pedido = new Pedido("ped-001", "100.00");

        assertAll(
                () -> assertEquals("PED-001", pedido.codigo()),
                () -> assertEquals(new BigDecimal("100.00"), pedido.valor()),
                () -> assertEquals(StatusPedido.CRIADO, pedido.status())
        );
    }

    @Test
    void naoDeveCriarPedidoSemCodigo() {
        IllegalArgumentException erro = assertThrows(
                IllegalArgumentException.class,
                () -> new Pedido("", "100.00")
        );

        assertEquals("Código é obrigatório.", erro.getMessage());
    }

    @Test
    void naoDeveCriarPedidoComValorZero() {
        IllegalArgumentException erro = assertThrows(
                IllegalArgumentException.class,
                () -> new Pedido("PED-001", "0")
        );

        assertEquals("Valor deve ser maior que zero.", erro.getMessage());
    }

    @Test
    void devePagarPedidoCriado() {
        Pedido pedido = new Pedido("PED-001", "100.00");

        pedido.pagar();

        assertEquals(StatusPedido.PAGO, pedido.status());
    }

    @Test
    void deveCancelarPedidoCriado() {
        Pedido pedido = new Pedido("PED-001", "100.00");

        pedido.cancelar();

        assertEquals(StatusPedido.CANCELADO, pedido.status());
    }

    @Test
    void naoDevePagarPedidoCancelado() {
        Pedido pedido = new Pedido("PED-001", "100.00");
        pedido.cancelar();

        IllegalStateException erro = assertThrows(
                IllegalStateException.class,
                pedido::pagar
        );

        assertEquals("Pedido cancelado não pode ser pago.", erro.getMessage());
    }

    @Test
    void naoDeveCancelarPedidoPago() {
        Pedido pedido = new Pedido("PED-001", "100.00");
        pedido.pagar();

        IllegalStateException erro = assertThrows(
                IllegalStateException.class,
                pedido::cancelar
        );

        assertEquals("Pedido pago não pode ser cancelado.", erro.getMessage());
    }
}
```

---

## O que esse teste valida

Ele valida:

```text
criação válida;
normalização de código;
valor;
status inicial;
erro de código inválido;
erro de valor inválido;
transição CRIADO -> PAGO;
transição CRIADO -> CANCELADO;
bloqueio CANCELADO -> PAGO;
bloqueio PAGO -> CANCELADO.
```

Isso é regra de domínio.

Esse tipo de teste é essencial em backend profissional.

---

# Parte 19 — Teste deve proteger regra

Um teste bom não testa implementação interna sem necessidade.

Ele testa comportamento.

Ruim:

```text
verificar se método privado foi chamado.
```

Melhor:

```text
verificar resultado público observável.
```

Exemplo:

```java
pedido.pagar();

assertEquals(StatusPedido.PAGO, pedido.status());
```

Não importa como internamente foi feito.

Importa o comportamento.

---

# Parte 20 — Testes frágeis

Teste frágil quebra por motivo irrelevante.

Exemplo:

```text
teste depende da ordem da lista sem necessidade;
teste depende de horário atual sem controlar;
teste depende de mensagem completa quando a mensagem não é contrato;
teste depende de implementação interna;
teste usa dados aleatórios sem controle;
teste depende de outro teste;
teste depende de ambiente externo.
```

---

## Como evitar

```text
teste comportamento;
controle dados;
evite aleatoriedade sem seed;
não dependa de ordem se ordem não importa;
não compartilhe estado mutável;
use nomes claros;
mantenha teste simples.
```

---

# Parte 21 — Rodando teste específico

Com Maven:

```powershell
mvn test -Dtest=PedidoTest
```

Rodar um método específico:

```powershell
mvn test -Dtest=PedidoTest#devePagarPedidoCriado
```

Isso acelera durante desenvolvimento.

Antes do commit, rode todos:

```powershell
mvn clean test
```

---

# Parte 22 — Interpretando falha de teste

Falha típica:

```text
expected: <PAGO> but was: <CRIADO>
```

Leia:

```text
esperado;
obtido;
teste que falhou;
linha do assert;
stack trace.
```

Método:

```text
1. entenda cenário;
2. veja esperado;
3. veja atual;
4. debug se necessário;
5. corrija código ou teste;
6. rode novamente.
```

Nem toda falha significa código errado.

Às vezes o teste está errado.

Mas não altere teste apenas para ficar verde sem entender.

---

# Parte 23 — Teste como documentação

Um teste bem escrito documenta regra.

Exemplo:

```java
void naoDeveCancelarPedidoPago()
```

Isso documenta:

```text
pedido pago não pode ser cancelado.
```

Quem lê o teste entende a regra.

Por isso, nomes de teste importam.

---

# Parte 24 — Teste e arquitetura

Arquitetura boa facilita teste.

Código difícil de testar pode indicar:

```text
método grande demais;
classe com responsabilidades demais;
dependência direta de infraestrutura;
uso excessivo de static;
acoplamento forte;
regra escondida no controller;
regra espalhada no repository;
construtores difíceis.
```

Testes ajudam a revelar design ruim.

---

## Frase arquitetural aplicada

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Testes unitários geralmente começam por:

```text
entidade;
value object;
service de domínio;
strategy;
use case com dependências fake;
validators;
parsers.
```

Controller, repository e integração exigem outros tipos de teste.

---

# Parte 25 — Testando BigDecimal com cuidado

Em Java:

```java
new BigDecimal("100.00")
```

é melhor que:

```java
new BigDecimal(100.00)
```

Porque double pode trazer imprecisão.

Para dinheiro, use String ou métodos controlados.

Em asserts:

```java
assertEquals(new BigDecimal("100.00"), valor);
```

Mas cuidado:

```text
BigDecimal considera escala no equals.
```

Exemplo:

```text
100.0 é diferente de 100.00 no equals.
```

Em alguns casos, compare com:

```java
assertEquals(0, valor.compareTo(new BigDecimal("100.00")));
```

Nesta aula, mantivemos valores com escala igual.

---

# Parte 26 — Organização de testes

Boas práticas:

```text
classe de teste espelha classe testada;
testes em src/test/java;
mesmo package da classe principal;
nomes claros;
um comportamento por teste;
sem lógica complexa no teste;
sem dependência entre testes;
dados simples;
asserts objetivos.
```

Exemplo:

```text
src/main/java/br/com/curso/aula251/Pedido.java
src/test/java/br/com/curso/aula251/PedidoTest.java
```

---

# Parte 27 — O que não testar em teste unitário

Evite em teste unitário:

```text
banco real;
API externa real;
fila real;
sistema de arquivos real sem necessidade;
horário real sem controle;
rede;
Spring context completo;
container;
integração com serviço externo.
```

Isso entra em testes de integração ou contrato.

Teste unitário deve ser rápido e isolado.

---

# Parte 28 — Quando um teste unitário é bom

Um bom teste unitário é:

```text
rápido;
isolado;
determinístico;
legível;
pequeno;
focado em comportamento;
com entrada clara;
com saída esperada clara;
não depende de ordem;
não depende de ambiente externo.
```

---

# Parte 29 — Laboratório de relatório

Crie:

```text
RELATORIO_TESTES.md
```

Preencha:

```md
# Relatório de Testes — Aula 251

## Comando executado

`mvn clean test`

## Classes testadas

- Calculadora
- Pedido

## Regras validadas

## Testes de sucesso

## Testes de exceção

## Falhas encontradas

## Correções aplicadas

## Aprendizados
```

Esse hábito prepara evidências técnicas e documentação profissional.

---

# Parte 30 — Como isso prepara Mockito

Até aqui, testamos classes sem dependências externas.

Mas em backend real teremos use cases assim:

```java
public class CriarPedidoUseCase {
    private final PedidoRepository repository;
    private final Notificador notificador;
}
```

Para testar sem banco e sem API externa, vamos usar mocks.

Isso virá nas próximas aulas.

JUnit será a base.

Mockito entrará para simular dependências.

---

# Parte 31 — Como isso prepara Spring

Em Spring, testes aparecem em várias camadas:

```text
teste unitário de domínio;
teste unitário de use case;
teste com Mockito;
teste de controller com MockMvc;
teste de repository com banco;
teste de integração com SpringBootTest;
teste com Testcontainers;
teste de contrato;
teste de API.
```

JUnit estará por baixo de tudo isso.

Por isso precisamos dominar bem a base.

---

# Parte 32 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar teste automatizado.
[ ] Sei explicar teste unitário.
[ ] Sei explicar JUnit 5.
[ ] Sei configurar JUnit com Maven.
[ ] Sei criar teste com @Test.
[ ] Sei usar assertEquals.
[ ] Sei usar assertTrue.
[ ] Sei usar assertFalse.
[ ] Sei usar assertThrows.
[ ] Sei testar mensagem de exceção.
[ ] Sei usar assertAll.
[ ] Sei usar @DisplayName.
[ ] Sei usar @BeforeEach.
[ ] Sei usar @AfterEach.
[ ] Sei usar @BeforeAll.
[ ] Sei usar @AfterAll.
[ ] Sei nomear testes profissionalmente.
[ ] Sei testar regra de domínio.
[ ] Sei rodar teste específico.
[ ] Sei interpretar falha de teste.
[ ] Sei evitar teste frágil.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é teste automatizado?
2. O que é teste unitário?
3. O que é JUnit 5?
4. Qual dependência Maven usamos para JUnit?
5. Para que serve @Test?
6. Para que serve assertEquals?
7. Para que serve assertThrows?
8. Para que serve @BeforeEach?
9. Para que serve @BeforeAll?
10. O que é padrão AAA?
11. Como nomear um teste?
12. O que é teste frágil?
13. Por que cada teste deve ser independente?
14. Por que teste ajuda arquitetura?
15. Como JUnit prepara Mockito e Spring?
```

---

# Parte 33 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-251-junit5-testes-unitarios
```

Com:

```text
pom.xml;
Calculadora.java;
CalculadoraTest.java;
StatusPedido.java;
Pedido.java;
PedidoTest.java;
RELATORIO_TESTES.md.
```

---

## Requisitos

Você deve testar:

```text
soma;
subtração;
multiplicação;
divisão;
divisão por zero;
número par;
número ímpar;
criação de pedido válido;
pedido sem código;
pedido com valor zero;
pagamento de pedido;
cancelamento de pedido;
bloqueio de pagamento para pedido cancelado;
bloqueio de cancelamento para pedido pago.
```

---

## Critérios

```text
todos os testes devem passar;
usar JUnit 5;
usar nomes claros;
usar assertThrows para exceções;
validar mensagens importantes;
rodar mvn clean test;
preencher relatório;
não depender da ordem dos testes.
```

---

# Parte 34 — Desafio extra

## Criar regra de desconto

Crie:

```text
CalculadoraDesconto
```

Regras:

```text
cliente comum:
5% de desconto acima de 500.

cliente VIP:
10% de desconto acima de 500.

pedido abaixo ou igual a 500:
sem desconto.

valor nulo:
erro.

tipo de cliente nulo:
erro.
```

Crie enum:

```text
TipoCliente
COMUM
VIP
```

Crie testes:

```text
deveRetornarZeroQuandoValorAbaixoOuIgualQuinhentos
deveAplicarCincoPorCentoParaClienteComum
deveAplicarDezPorCentoParaClienteVip
naoDeveCalcularComValorNulo
naoDeveCalcularComTipoClienteNulo
```

Critérios:

```text
usar BigDecimal;
não usar double para dinheiro;
testar exceções;
nomes claros;
mvn test deve passar.
```

---

# Parte 35 — Simulado rápido

## Questão 1

Teste unitário deve ser preferencialmente:

```text
A) rápido, isolado e determinístico.
B) dependente de banco real sempre.
C) dependente de API externa sempre.
D) executado apenas manualmente.
```

---

## Questão 2

A anotação usada para marcar um método de teste no JUnit 5 é:

```text
A) @Test
B) @Run
C) @Main
D) @Java
```

---

## Questão 3

`assertEquals` verifica:

```text
A) se valor esperado e valor atual são iguais.
B) se uma exceção foi lançada.
C) se o Git está limpo.
D) se Maven está instalado.
```

---

## Questão 4

`assertThrows` é usado para:

```text
A) validar que uma exceção esperada foi lançada.
B) rodar aplicação Spring.
C) criar dependência Maven.
D) criar branch Git.
```

---

## Questão 5

`@BeforeEach` executa:

```text
A) antes de cada teste.
B) depois de todos os testes.
C) apenas uma vez depois da classe.
D) no build do Maven apenas.
```

---

## Questão 6

Um teste frágil é:

```text
A) teste que quebra por detalhes irrelevantes ou depende de estado/ordem.
B) teste rápido e isolado.
C) teste com nome claro.
D) teste determinístico.
```

---

## Questão 7

O padrão AAA significa:

```text
A) Arrange, Act, Assert.
B) Add, Apply, Archive.
C) API, Adapter, Annotation.
D) Author, Access, Action.
```

---

## Questão 8

JUnit prepara a base para:

```text
A) Mockito, testes de backend e testes com Spring.
B) substituir todo tipo de teste manual e análise.
C) eliminar necessidade de arquitetura.
D) apagar o Git.
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
git add labs/m11/aula-251-junit5-testes-unitarios
git commit -m "Aula 251: junit5 testes unitarios assertions ciclo vida"
git status
```

---

## Fechamento

A principal ideia desta aula é:

```text
JUnit 5 permite criar testes automatizados unitários para proteger regras de negócio, facilitar refatoração e aumentar confiança no backend Java.
```

Você estudou:

```text
teste automatizado;
teste unitário;
JUnit 5;
JUnit Platform;
JUnit Jupiter;
pom.xml com JUnit;
@Test;
assertEquals;
assertTrue;
assertFalse;
assertThrows;
assertAll;
@DisplayName;
@BeforeEach;
@AfterEach;
@BeforeAll;
@AfterAll;
padrão AAA;
testes de Calculadora;
testes de Pedido;
testes de exceção;
nomes de testes;
testes frágeis;
organização;
relação com arquitetura;
preparação para Mockito;
preparação para Spring.
```

Na próxima aula, vamos aprofundar:

```text
JUnit 5 avançado: testes parametrizados, assertAll, nested tests, tags e organização profissional.
```

A ideia será sair do teste básico e começar a criar suítes mais organizadas, expressivas e próximas de um projeto backend real.
