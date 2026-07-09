# 253 — M11.09 — Mockito: mocks, stubs, verify e testes de Use Case/Service

## Objetivo da aula

Na aula anterior, você aprofundou JUnit 5 avançado.

Você estudou:

```text
@ParameterizedTest;
@ValueSource;
@CsvSource;
@CsvFileSource;
@EnumSource;
@MethodSource;
@Nested;
@Tag;
@Disabled;
TestInfo;
Assumptions;
organização profissional de testes.
```

Agora vamos aprofundar uma ferramenta essencial para testes unitários em Java Backend:

```text
Mockito
```

Mockito é uma biblioteca usada para criar objetos simulados, chamados mocks, permitindo testar uma classe isolando suas dependências.

Isso é fundamental para testar:

```text
use cases;
services;
validators;
handlers;
commands;
strategies;
facades;
application services;
componentes que dependem de repository;
componentes que dependem de client externo;
componentes que dependem de gateway;
componentes que publicam eventos.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é mock;
entender o que é stub;
entender o que é spy em alto nível;
configurar Mockito com JUnit 5;
usar @ExtendWith(MockitoExtension.class);
usar @Mock;
usar @InjectMocks;
usar when(...).thenReturn(...);
usar when(...).thenThrow(...);
usar verify(...);
usar times(...);
usar never();
usar any();
usar eq();
usar ArgumentCaptor;
testar use case com repository mockado;
testar service com gateway mockado;
validar interações;
evitar mocks desnecessários;
entender o que deve e o que não deve ser mockado;
preparar base para testes com Spring.
```

---

## Reforço do objetivo maior

Nosso objetivo é criar uma formação completa de Java Backend, do básico ao nível engenheiro/arquiteto Java.

Por isso, Mockito não será tratado como apenas uma biblioteca para decorar comandos.

Um profissional avançado precisa saber:

```text
por que mock existe;
quando mock é útil;
quando mock atrapalha;
como isolar dependências;
como testar comportamento;
como evitar teste acoplado à implementação;
como testar use cases;
como testar regras sem banco real;
como testar erro de integração sem chamar API externa;
como validar se uma ação foi executada;
como validar se uma ação não foi executada;
como usar mocks sem destruir a legibilidade dos testes;
como isso aparece em projetos Spring.
```

Mockito é poderoso.

Mas, se usado sem critério, pode gerar testes frágeis.

---

# Parte 1 — Problema que Mockito resolve

Imagine um use case:

```text
CriarPedidoUseCase
```

Ele precisa:

```text
validar dados;
criar Pedido;
salvar no repository;
notificar cliente;
retornar resultado.
```

Código conceitual:

```java
public class CriarPedidoUseCase {
    private final PedidoRepository repository;
    private final NotificadorPedido notificador;

    public CriarPedidoUseCase(PedidoRepository repository, NotificadorPedido notificador) {
        this.repository = repository;
        this.notificador = notificador;
    }

    public Pedido executar(CriarPedidoCommand command) {
        Pedido pedido = new Pedido(command.codigo(), command.valor());
        repository.salvar(pedido);
        notificador.notificarCriacao(pedido);
        return pedido;
    }
}
```

Para testar isso sem Mockito, você teria que usar:

```text
repository real;
banco real;
notificador real;
API real;
fila real;
e-mail real.
```

Isso não é teste unitário.

Mockito permite criar dependências simuladas:

```text
repository falso;
notificador falso;
gateway falso;
client falso.
```

Assim você testa o use case isolado.

---

## Mockito em uma frase prática

```text
Mockito permite simular dependências para testar uma classe de forma isolada.
```

---

# Parte 2 — O que é mock

Mock é um objeto falso controlado pelo teste.

Ele substitui uma dependência real.

Exemplo:

```java
PedidoRepository repository = mock(PedidoRepository.class);
```

Esse repository não acessa banco.

Ele é um objeto controlado pelo Mockito.

Você pode dizer:

```text
quando chamar buscarPorCodigo("PED-001"), retorne um pedido.
```

E depois verificar:

```text
salvar foi chamado?
notificar foi chamado?
buscarPorCodigo foi chamado uma vez?
```

---

## Mock não é implementação real

Um mock não deve conter regra de negócio.

Ele serve para:

```text
simular respostas;
validar interações;
isolar dependências externas;
controlar cenários de erro;
evitar banco/API/fila em teste unitário.
```

---

# Parte 3 — O que é stub

Stub é uma configuração de comportamento do mock.

Exemplo:

```java
when(repository.existePorCodigo("PED-001")).thenReturn(false);
```

Isso significa:

```text
quando o método existePorCodigo for chamado com "PED-001",
retorne false.
```

Esse comportamento configurado é um stub.

---

## Mock vs Stub

```text
Mock:
objeto simulado.

Stub:
resposta configurada no mock.
```

Exemplo:

```java
PedidoRepository repository = mock(PedidoRepository.class);
when(repository.existePorCodigo("PED-001")).thenReturn(false);
```

Aqui:

```text
repository é o mock.
thenReturn(false) é o comportamento stubado.
```

---

# Parte 4 — O que é verify

`verify` valida interação com o mock.

Exemplo:

```java
verify(repository).salvar(pedido);
```

Significa:

```text
verifique se repository.salvar(pedido) foi chamado.
```

Você também pode verificar quantidade:

```java
verify(repository, times(1)).salvar(pedido);
verify(notificador, never()).notificarErro(pedido);
```

---

## Quando usar verify

Use quando o comportamento esperado é uma interação.

Exemplos:

```text
salvar no repository;
publicar evento;
chamar gateway;
enviar notificação;
não chamar integração quando validação falha;
chamar auditoria uma vez;
não chamar repository se request for inválido.
```

---

# Parte 5 — Quando usar Mockito

Use Mockito quando a classe testada depende de outra abstração.

Exemplos:

```text
use case depende de repository;
service depende de gateway;
command depende de publisher;
handler depende do próximo handler;
facade depende de vários services;
strategy depende de tabela externa;
client wrapper depende de HTTP client.
```

Mockito é útil para testar a unidade isolada.

---

## Quando não usar Mockito

Não use Mockito para tudo.

Evite mockar:

```text
entidades simples;
value objects;
DTOs;
String;
List;
BigDecimal;
métodos puros simples;
classes que você poderia instanciar diretamente sem custo.
```

Exemplo ruim:

```java
Pedido pedido = mock(Pedido.class);
when(pedido.valor()).thenReturn(new BigDecimal("100.00"));
```

Se `Pedido` é sua entidade e é fácil criar:

```java
Pedido pedido = new Pedido("PED-001", "100.00");
```

prefira objeto real.

---

## Regra profissional

```text
Mocke dependências externas ou portas.
Use objetos reais para domínio sempre que possível.
```

---

# Parte 6 — Frase arquitetural aplicada

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Mockito:

```text
Teste de entidade:
não precisa mock.

Teste de use case:
mocka repository, client, gateway, publisher.

Teste de repository:
não é unitário puro; geralmente usa teste de integração.

Teste de client externo:
pode mockar HTTP ou usar teste de contrato/fake server.

Teste de controller:
mais tarde com Spring, usaremos ferramentas específicas.
```

---

# Parte 7 — Configurando laboratório

Crie:

```powershell
mkdir labs\m11\aula-253-mockito-usecase-service
cd labs\m11\aula-253-mockito-usecase-service
mkdir src\main\java\br\com\curso\aula253
mkdir src\main\java\br\com\curso\aula253\domain
mkdir src\main\java\br\com\curso\aula253\application
mkdir src\main\java\br\com\curso\aula253\application\port
mkdir src\main\java\br\com\curso\aula253\application\usecase
mkdir src\main\java\br\com\curso\aula253\application\service
mkdir src\test\java\br\com\curso\aula253
mkdir src\test\java\br\com\curso\aula253\application
mkdir src\test\java\br\com\curso\aula253\application\usecase
mkdir src\test\java\br\com\curso\aula253\application\service
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
    <artifactId>aula-253-mockito-usecase-service</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.release>21</maven.compiler.release>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <junit.version>5.10.2</junit.version>
        <mockito.version>5.12.0</mockito.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-core</artifactId>
            <version>${mockito.version}</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.mockito</groupId>
            <artifactId>mockito-junit-jupiter</artifactId>
            <version>${mockito.version}</version>
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

## Dependências Mockito

```text
mockito-core:
biblioteca principal.

mockito-junit-jupiter:
integra Mockito com JUnit 5 via MockitoExtension.
```

---

# Parte 8 — Domínio: Pedido

Crie:

```text
src/main/java/br/com/curso/aula253/domain/StatusPedido.java
```

Código:

```java
package br.com.curso.aula253.domain;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

Crie:

```text
src/main/java/br/com/curso/aula253/domain/Pedido.java
```

Código:

```java
package br.com.curso.aula253.domain;

import java.math.BigDecimal;
import java.util.Objects;

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

    public boolean criado() {
        return Objects.equals(status, StatusPedido.CRIADO);
    }

    public boolean pago() {
        return Objects.equals(status, StatusPedido.PAGO);
    }

    public boolean cancelado() {
        return Objects.equals(status, StatusPedido.CANCELADO);
    }
}
```

---

# Parte 9 — Portas da aplicação

Agora vamos criar interfaces que representam dependências externas ao use case.

Essas interfaces são portas.

Crie:

```text
src/main/java/br/com/curso/aula253/application/port/PedidoRepository.java
```

Código:

```java
package br.com.curso.aula253.application.port;

import br.com.curso.aula253.domain.Pedido;

import java.util.Optional;

public interface PedidoRepository {
    boolean existePorCodigo(String codigo);

    void salvar(Pedido pedido);

    Optional<Pedido> buscarPorCodigo(String codigo);
}
```

Crie:

```text
src/main/java/br/com/curso/aula253/application/port/NotificadorPedido.java
```

Código:

```java
package br.com.curso.aula253.application.port;

import br.com.curso.aula253.domain.Pedido;

public interface NotificadorPedido {
    void notificarCriacao(Pedido pedido);

    void notificarPagamento(Pedido pedido);

    void notificarCancelamento(Pedido pedido);
}
```

Crie:

```text
src/main/java/br/com/curso/aula253/application/port/AuditoriaGateway.java
```

Código:

```java
package br.com.curso.aula253.application.port;

public interface AuditoriaGateway {
    void registrar(String acao, String detalhe);
}
```

---

## Por que interfaces

Interfaces ajudam a aplicar DIP:

```text
use case depende de abstração;
infra implementa a abstração.
```

No teste, Mockito cria mock dessas interfaces.

No futuro, Spring vai injetar implementações reais.

---

# Parte 10 — Commands e resultados

Crie:

```text
src/main/java/br/com/curso/aula253/application/usecase/CriarPedidoCommand.java
```

Código:

```java
package br.com.curso.aula253.application.usecase;

import java.math.BigDecimal;

public record CriarPedidoCommand(String codigo, BigDecimal valor) {
    public CriarPedidoCommand {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }
    }

    public CriarPedidoCommand(String codigo, String valor) {
        this(codigo, new BigDecimal(valor));
    }
}
```

Crie:

```text
src/main/java/br/com/curso/aula253/application/usecase/PedidoResultado.java
```

Código:

```java
package br.com.curso.aula253.application.usecase;

import br.com.curso.aula253.domain.StatusPedido;

import java.math.BigDecimal;

public record PedidoResultado(
        String codigo,
        BigDecimal valor,
        StatusPedido status
) {
}
```

---

# Parte 11 — CriarPedidoUseCase

Crie:

```text
src/main/java/br/com/curso/aula253/application/usecase/CriarPedidoUseCase.java
```

Código:

```java
package br.com.curso.aula253.application.usecase;

import br.com.curso.aula253.application.port.AuditoriaGateway;
import br.com.curso.aula253.application.port.NotificadorPedido;
import br.com.curso.aula253.application.port.PedidoRepository;
import br.com.curso.aula253.domain.Pedido;

public class CriarPedidoUseCase {
    private final PedidoRepository repository;
    private final NotificadorPedido notificador;
    private final AuditoriaGateway auditoria;

    public CriarPedidoUseCase(
            PedidoRepository repository,
            NotificadorPedido notificador,
            AuditoriaGateway auditoria
    ) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        if (auditoria == null) {
            throw new IllegalArgumentException("Auditoria é obrigatória.");
        }

        this.repository = repository;
        this.notificador = notificador;
        this.auditoria = auditoria;
    }

    public PedidoResultado executar(CriarPedidoCommand command) {
        if (repository.existePorCodigo(command.codigo())) {
            throw new IllegalStateException("Pedido já existe.");
        }

        Pedido pedido = new Pedido(command.codigo(), command.valor());

        repository.salvar(pedido);
        auditoria.registrar("PEDIDO_CRIADO", pedido.codigo());
        notificador.notificarCriacao(pedido);

        return new PedidoResultado(pedido.codigo(), pedido.valor(), pedido.status());
    }
}
```

---

## O que vamos testar

Cenário de sucesso:

```text
repository informa que pedido não existe;
use case cria pedido;
repository.salvar é chamado;
auditoria.registrar é chamada;
notificador.notificarCriacao é chamado;
resultado retorna dados do pedido.
```

Cenário de erro:

```text
repository informa que pedido já existe;
use case lança erro;
não salva;
não audita;
não notifica.
```

---

# Parte 12 — Teste com mock manual

Antes das anotações, vamos entender a forma manual.

Crie:

```text
src/test/java/br/com/curso/aula253/application/usecase/CriarPedidoUseCaseMockManualTest.java
```

Código:

```java
package br.com.curso.aula253.application.usecase;

import br.com.curso.aula253.application.port.AuditoriaGateway;
import br.com.curso.aula253.application.port.NotificadorPedido;
import br.com.curso.aula253.application.port.PedidoRepository;
import br.com.curso.aula253.domain.Pedido;
import br.com.curso.aula253.domain.StatusPedido;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CriarPedidoUseCaseMockManualTest {
    @Test
    void deveCriarPedidoQuandoCodigoNaoExistir() {
        PedidoRepository repository = mock(PedidoRepository.class);
        NotificadorPedido notificador = mock(NotificadorPedido.class);
        AuditoriaGateway auditoria = mock(AuditoriaGateway.class);

        when(repository.existePorCodigo("PED-001")).thenReturn(false);

        CriarPedidoUseCase useCase = new CriarPedidoUseCase(repository, notificador, auditoria);

        PedidoResultado resultado = useCase.executar(new CriarPedidoCommand("PED-001", "100.00"));

        assertEquals("PED-001", resultado.codigo());
        assertEquals(StatusPedido.CRIADO, resultado.status());

        verify(repository).existePorCodigo("PED-001");
        verify(repository).salvar(org.mockito.ArgumentMatchers.any(Pedido.class));
        verify(auditoria).registrar("PEDIDO_CRIADO", "PED-001");
        verify(notificador).notificarCriacao(org.mockito.ArgumentMatchers.any(Pedido.class));
    }
}
```

---

## O que aconteceu

Criamos mocks:

```java
mock(PedidoRepository.class)
```

Configuramos stub:

```java
when(repository.existePorCodigo("PED-001")).thenReturn(false);
```

Executamos o use case.

Validamos resultado.

Validamos interações:

```java
verify(repository).salvar(...)
```

---

# Parte 13 — MockitoExtension

A forma mais comum com JUnit 5 é usar:

```java
@ExtendWith(MockitoExtension.class)
```

E anotações:

```text
@Mock;
@InjectMocks.
```

`@Mock` cria mock.

`@InjectMocks` cria a classe testada injetando os mocks no construtor.

---

## Teste com anotações

Crie:

```text
src/test/java/br/com/curso/aula253/application/usecase/CriarPedidoUseCaseTest.java
```

Código:

```java
package br.com.curso.aula253.application.usecase;

import br.com.curso.aula253.application.port.AuditoriaGateway;
import br.com.curso.aula253.application.port.NotificadorPedido;
import br.com.curso.aula253.application.port.PedidoRepository;
import br.com.curso.aula253.domain.Pedido;
import br.com.curso.aula253.domain.StatusPedido;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("CriarPedidoUseCase")
class CriarPedidoUseCaseTest {
    @Mock
    private PedidoRepository repository;

    @Mock
    private NotificadorPedido notificador;

    @Mock
    private AuditoriaGateway auditoria;

    @InjectMocks
    private CriarPedidoUseCase useCase;

    @Nested
    @DisplayName("Sucesso")
    class Sucesso {
        @Test
        @DisplayName("deve criar pedido quando código não existir")
        void deveCriarPedidoQuandoCodigoNaoExistir() {
            when(repository.existePorCodigo("PED-001")).thenReturn(false);

            PedidoResultado resultado = useCase.executar(new CriarPedidoCommand("PED-001", "100.00"));

            assertEquals("PED-001", resultado.codigo());
            assertEquals(new BigDecimal("100.00"), resultado.valor());
            assertEquals(StatusPedido.CRIADO, resultado.status());

            verify(repository, times(1)).existePorCodigo("PED-001");
            verify(repository, times(1)).salvar(any(Pedido.class));
            verify(auditoria, times(1)).registrar("PEDIDO_CRIADO", "PED-001");
            verify(notificador, times(1)).notificarCriacao(any(Pedido.class));
        }

        @Test
        @DisplayName("deve salvar pedido com dados normalizados")
        void deveSalvarPedidoComDadosNormalizados() {
            when(repository.existePorCodigo("ped-001")).thenReturn(false);

            useCase.executar(new CriarPedidoCommand("ped-001", "100.00"));

            ArgumentCaptor<Pedido> captor = ArgumentCaptor.forClass(Pedido.class);

            verify(repository).salvar(captor.capture());

            Pedido pedidoSalvo = captor.getValue();

            assertEquals("PED-001", pedidoSalvo.codigo());
            assertEquals(new BigDecimal("100.00"), pedidoSalvo.valor());
            assertEquals(StatusPedido.CRIADO, pedidoSalvo.status());
        }
    }

    @Nested
    @DisplayName("Erro")
    class Erro {
        @Test
        @DisplayName("não deve criar pedido quando código já existir")
        void naoDeveCriarPedidoQuandoCodigoJaExistir() {
            when(repository.existePorCodigo("PED-001")).thenReturn(true);

            IllegalStateException erro = assertThrows(
                    IllegalStateException.class,
                    () -> useCase.executar(new CriarPedidoCommand("PED-001", "100.00"))
            );

            assertEquals("Pedido já existe.", erro.getMessage());

            verify(repository, times(1)).existePorCodigo("PED-001");
            verify(repository, never()).salvar(any(Pedido.class));
            verify(auditoria, never()).registrar(any(), any());
            verify(notificador, never()).notificarCriacao(any(Pedido.class));
        }
    }
}
```

---

## O que este teste mostra

Ele mostra recursos importantes:

```text
@Mock;
@InjectMocks;
@ExtendWith(MockitoExtension.class);
when/thenReturn;
verify;
times;
never;
any;
ArgumentCaptor;
@Nested;
@DisplayName.
```

Esse é um padrão muito usado em testes unitários de use case.

---

# Parte 14 — ArgumentCaptor

`ArgumentCaptor` captura o argumento passado para um mock.

Exemplo:

```java
ArgumentCaptor<Pedido> captor = ArgumentCaptor.forClass(Pedido.class);

verify(repository).salvar(captor.capture());

Pedido pedidoSalvo = captor.getValue();
```

Use quando você precisa validar os dados do objeto enviado ao mock.

Exemplo:

```text
repository.salvar recebeu Pedido com código normalizado?
notificador recebeu pedido com status correto?
auditoria recebeu detalhe correto?
```

---

## Quando usar ArgumentCaptor

Use quando:

```text
o objeto é criado dentro do método testado;
você precisa validar campos desse objeto;
não tem referência direta ao objeto;
verify com any() seria genérico demais.
```

---

## Quando evitar

Evite captor quando um assert no resultado já cobre o comportamento.

Não transforme todo teste em verificação interna demais.

---

# Parte 15 — ArgumentMatchers: any e eq

Mockito tem matchers.

Exemplos:

```java
any(Pedido.class)
any()
eq("PED-001")
```

`any()` aceita qualquer valor.

`eq()` exige valor específico.

Exemplo:

```java
verify(auditoria).registrar(eq("PEDIDO_CRIADO"), eq("PED-001"));
```

---

## Regra importante

Quando você usa matcher em um argumento, geralmente deve usar matcher em todos os argumentos da mesma chamada.

Evite misturar assim:

```java
verify(auditoria).registrar(eq("PEDIDO_CRIADO"), "PED-001");
```

Prefira:

```java
verify(auditoria).registrar(eq("PEDIDO_CRIADO"), eq("PED-001"));
```

Ou sem matchers:

```java
verify(auditoria).registrar("PEDIDO_CRIADO", "PED-001");
```

---

# Parte 16 — Serviço de pagamento

Agora vamos criar um service com dependências.

Crie:

```text
src/main/java/br/com/curso/aula253/application/port/GatewayPagamento.java
```

Código:

```java
package br.com.curso.aula253.application.port;

import br.com.curso.aula253.domain.Pedido;

public interface GatewayPagamento {
    boolean autorizar(Pedido pedido);
}
```

Crie:

```text
src/main/java/br/com/curso/aula253/application/service/PagamentoPedidoService.java
```

Código:

```java
package br.com.curso.aula253.application.service;

import br.com.curso.aula253.application.port.AuditoriaGateway;
import br.com.curso.aula253.application.port.GatewayPagamento;
import br.com.curso.aula253.application.port.NotificadorPedido;
import br.com.curso.aula253.application.port.PedidoRepository;
import br.com.curso.aula253.domain.Pedido;

public class PagamentoPedidoService {
    private final PedidoRepository repository;
    private final GatewayPagamento gatewayPagamento;
    private final NotificadorPedido notificador;
    private final AuditoriaGateway auditoria;

    public PagamentoPedidoService(
            PedidoRepository repository,
            GatewayPagamento gatewayPagamento,
            NotificadorPedido notificador,
            AuditoriaGateway auditoria
    ) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (gatewayPagamento == null) {
            throw new IllegalArgumentException("Gateway de pagamento é obrigatório.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        if (auditoria == null) {
            throw new IllegalArgumentException("Auditoria é obrigatória.");
        }

        this.repository = repository;
        this.gatewayPagamento = gatewayPagamento;
        this.notificador = notificador;
        this.auditoria = auditoria;
    }

    public void pagar(String codigoPedido) {
        Pedido pedido = repository.buscarPorCodigo(codigoPedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));

        boolean autorizado = gatewayPagamento.autorizar(pedido);

        if (!autorizado) {
            auditoria.registrar("PAGAMENTO_RECUSADO", pedido.codigo());
            throw new IllegalStateException("Pagamento não autorizado.");
        }

        pedido.pagar();

        repository.salvar(pedido);
        auditoria.registrar("PEDIDO_PAGO", pedido.codigo());
        notificador.notificarPagamento(pedido);
    }
}
```

---

# Parte 17 — Testando PagamentoPedidoService

Crie:

```text
src/test/java/br/com/curso/aula253/application/service/PagamentoPedidoServiceTest.java
```

Código:

```java
package br.com.curso.aula253.application.service;

import br.com.curso.aula253.application.port.AuditoriaGateway;
import br.com.curso.aula253.application.port.GatewayPagamento;
import br.com.curso.aula253.application.port.NotificadorPedido;
import br.com.curso.aula253.application.port.PedidoRepository;
import br.com.curso.aula253.domain.Pedido;
import br.com.curso.aula253.domain.StatusPedido;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("PagamentoPedidoService")
class PagamentoPedidoServiceTest {
    @Mock
    private PedidoRepository repository;

    @Mock
    private GatewayPagamento gatewayPagamento;

    @Mock
    private NotificadorPedido notificador;

    @Mock
    private AuditoriaGateway auditoria;

    @InjectMocks
    private PagamentoPedidoService service;

    @Nested
    @DisplayName("Sucesso")
    class Sucesso {
        @Test
        @DisplayName("deve pagar pedido quando gateway autorizar")
        void devePagarPedidoQuandoGatewayAutorizar() {
            Pedido pedido = new Pedido("PED-001", "100.00");

            when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
            when(gatewayPagamento.autorizar(pedido)).thenReturn(true);

            service.pagar("PED-001");

            ArgumentCaptor<Pedido> captor = ArgumentCaptor.forClass(Pedido.class);
            verify(repository).salvar(captor.capture());

            Pedido pedidoSalvo = captor.getValue();

            assertEquals(StatusPedido.PAGO, pedidoSalvo.status());

            verify(gatewayPagamento).autorizar(pedido);
            verify(auditoria).registrar("PEDIDO_PAGO", "PED-001");
            verify(notificador).notificarPagamento(pedido);
        }
    }

    @Nested
    @DisplayName("Erro")
    class Erro {
        @Test
        @DisplayName("não deve pagar quando pedido não existir")
        void naoDevePagarQuandoPedidoNaoExistir() {
            when(repository.buscarPorCodigo("PED-404")).thenReturn(Optional.empty());

            IllegalArgumentException erro = assertThrows(
                    IllegalArgumentException.class,
                    () -> service.pagar("PED-404")
            );

            assertEquals("Pedido não encontrado.", erro.getMessage());

            verify(gatewayPagamento, never()).autorizar(any(Pedido.class));
            verify(repository, never()).salvar(any(Pedido.class));
            verify(auditoria, never()).registrar(any(), any());
            verify(notificador, never()).notificarPagamento(any(Pedido.class));
        }

        @Test
        @DisplayName("não deve pagar quando gateway recusar")
        void naoDevePagarQuandoGatewayRecusar() {
            Pedido pedido = new Pedido("PED-001", "100.00");

            when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
            when(gatewayPagamento.autorizar(pedido)).thenReturn(false);

            IllegalStateException erro = assertThrows(
                    IllegalStateException.class,
                    () -> service.pagar("PED-001")
            );

            assertEquals("Pagamento não autorizado.", erro.getMessage());
            assertEquals(StatusPedido.CRIADO, pedido.status());

            verify(gatewayPagamento).autorizar(pedido);
            verify(auditoria).registrar("PAGAMENTO_RECUSADO", "PED-001");
            verify(repository, never()).salvar(any(Pedido.class));
            verify(notificador, never()).notificarPagamento(any(Pedido.class));
        }
    }
}
```

---

## O que este teste valida

Cenário de sucesso:

```text
busca pedido;
autoriza pagamento;
muda status para PAGO;
salva;
audita;
notifica.
```

Cenário pedido não encontrado:

```text
não chama gateway;
não salva;
não audita;
não notifica.
```

Cenário pagamento recusado:

```text
chama gateway;
audita recusa;
não salva pedido;
não notifica pagamento;
status permanece CRIADO.
```

---

# Parte 18 — thenThrow

Mockito também permite simular exceção.

Exemplo:

```java
when(gatewayPagamento.autorizar(pedido)).thenThrow(new RuntimeException("Gateway indisponível"));
```

Mas atenção:

Se o método retorna `void`, você usa outro formato:

```java
doThrow(new RuntimeException("Erro"))
        .when(notificador)
        .notificarPagamento(pedido);
```

Vamos ver `doThrow` em mais detalhes na próxima aula ou quando entrarmos em casos de void.

---

## Exemplo com thenThrow

Adicione em `PagamentoPedidoServiceTest`:

```java
@Test
@DisplayName("deve propagar erro quando gateway falhar")
void devePropagarErroQuandoGatewayFalhar() {
    Pedido pedido = new Pedido("PED-001", "100.00");

    when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
    when(gatewayPagamento.autorizar(pedido)).thenThrow(new RuntimeException("Gateway indisponível."));

    RuntimeException erro = assertThrows(
            RuntimeException.class,
            () -> service.pagar("PED-001")
    );

    assertEquals("Gateway indisponível.", erro.getMessage());

    verify(repository, never()).salvar(any(Pedido.class));
    verify(notificador, never()).notificarPagamento(any(Pedido.class));
}
```

Discussão:

```text
Dependendo da regra do sistema, talvez o erro de gateway devesse ser tratado.
Nesta aula, estamos apenas simulando a falha.
```

---

# Parte 19 — Verificando ausência de interação

Mockito permite verificar que um mock não teve interações.

Exemplo:

```java
verifyNoInteractions(notificador);
```

Ou verificar que não houve mais interações além das verificadas:

```java
verifyNoMoreInteractions(repository);
```

Use com cuidado.

---

## Cuidado com verifyNoMoreInteractions

Ele pode deixar testes muito acoplados.

Exemplo:

```text
se amanhã o use case também auditar uma métrica,
um teste antigo quebra mesmo que a regra continue correta.
```

Use quando a ausência de interação é regra importante.

Não use só por obsessão.

---

# Parte 20 — Teste de comportamento vs teste de implementação

Mockito facilita verificar chamadas.

Mas cuidado.

Teste ruim:

```java
verify(repository).buscarPorCodigo("PED-001");
verify(gateway).autorizar(pedido);
verify(repository).salvar(pedido);
verify(auditoria).registrar(...);
verify(notificador).notificarPagamento(pedido);
verifyNoMoreInteractions(repository, gateway, auditoria, notificador);
```

Às vezes isso é necessário.

Mas se você verifica cada detalhe interno, o teste fica acoplado à implementação.

Pergunte:

```text
essa interação é parte do comportamento esperado?
ou é detalhe interno?
```

---

## Exemplo de comportamento importante

```text
quando pedido não existe:
não deve chamar gateway de pagamento.
```

Isso é comportamento importante.

```java
verify(gatewayPagamento, never()).autorizar(any(Pedido.class));
```

---

## Exemplo de detalhe talvez desnecessário

```text
verificar que buscarPorCodigo foi chamado exatamente antes de autorizar.
```

Ordem pode não importar.

Se ordem importa, Mockito tem `InOrder`, mas use com critério.

---

# Parte 21 — Testando ordem com InOrder

Em alguns fluxos, a ordem importa.

Exemplo:

```text
salvar antes de notificar.
```

Mockito permite:

```java
InOrder inOrder = inOrder(repository, notificador);

inOrder.verify(repository).salvar(any(Pedido.class));
inOrder.verify(notificador).notificarPagamento(any(Pedido.class));
```

Uso completo:

```java
org.mockito.InOrder inOrder = org.mockito.Mockito.inOrder(repository, notificador);

inOrder.verify(repository).salvar(any(Pedido.class));
inOrder.verify(notificador).notificarPagamento(any(Pedido.class));
```

Use apenas se a ordem for regra relevante.

---

# Parte 22 — Criando um cancelamento

Agora vamos criar outro use case para praticar.

Crie:

```text
src/main/java/br/com/curso/aula253/application/usecase/CancelarPedidoUseCase.java
```

Código:

```java
package br.com.curso.aula253.application.usecase;

import br.com.curso.aula253.application.port.AuditoriaGateway;
import br.com.curso.aula253.application.port.NotificadorPedido;
import br.com.curso.aula253.application.port.PedidoRepository;
import br.com.curso.aula253.domain.Pedido;

public class CancelarPedidoUseCase {
    private final PedidoRepository repository;
    private final NotificadorPedido notificador;
    private final AuditoriaGateway auditoria;

    public CancelarPedidoUseCase(
            PedidoRepository repository,
            NotificadorPedido notificador,
            AuditoriaGateway auditoria
    ) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        if (auditoria == null) {
            throw new IllegalArgumentException("Auditoria é obrigatória.");
        }

        this.repository = repository;
        this.notificador = notificador;
        this.auditoria = auditoria;
    }

    public void executar(String codigoPedido) {
        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        Pedido pedido = repository.buscarPorCodigo(codigoPedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));

        pedido.cancelar();

        repository.salvar(pedido);
        auditoria.registrar("PEDIDO_CANCELADO", pedido.codigo());
        notificador.notificarCancelamento(pedido);
    }
}
```

---

# Parte 23 — Teste do cancelamento

Crie:

```text
src/test/java/br/com/curso/aula253/application/usecase/CancelarPedidoUseCaseTest.java
```

Código:

```java
package br.com.curso.aula253.application.usecase;

import br.com.curso.aula253.application.port.AuditoriaGateway;
import br.com.curso.aula253.application.port.NotificadorPedido;
import br.com.curso.aula253.application.port.PedidoRepository;
import br.com.curso.aula253.domain.Pedido;
import br.com.curso.aula253.domain.StatusPedido;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("CancelarPedidoUseCase")
class CancelarPedidoUseCaseTest {
    @Mock
    private PedidoRepository repository;

    @Mock
    private NotificadorPedido notificador;

    @Mock
    private AuditoriaGateway auditoria;

    @InjectMocks
    private CancelarPedidoUseCase useCase;

    @Nested
    @DisplayName("Sucesso")
    class Sucesso {
        @Test
        @DisplayName("deve cancelar pedido criado")
        void deveCancelarPedidoCriado() {
            Pedido pedido = new Pedido("PED-001", "100.00");

            when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));

            useCase.executar("PED-001");

            ArgumentCaptor<Pedido> captor = ArgumentCaptor.forClass(Pedido.class);

            verify(repository).salvar(captor.capture());

            Pedido pedidoSalvo = captor.getValue();

            assertEquals(StatusPedido.CANCELADO, pedidoSalvo.status());

            verify(auditoria).registrar("PEDIDO_CANCELADO", "PED-001");
            verify(notificador).notificarCancelamento(pedido);
        }
    }

    @Nested
    @DisplayName("Erro")
    class Erro {
        @Test
        @DisplayName("não deve cancelar quando código for vazio")
        void naoDeveCancelarQuandoCodigoForVazio() {
            IllegalArgumentException erro = assertThrows(
                    IllegalArgumentException.class,
                    () -> useCase.executar(" ")
            );

            assertEquals("Código do pedido é obrigatório.", erro.getMessage());

            verify(repository, never()).buscarPorCodigo(any());
            verify(repository, never()).salvar(any(Pedido.class));
            verify(auditoria, never()).registrar(any(), any());
            verify(notificador, never()).notificarCancelamento(any(Pedido.class));
        }

        @Test
        @DisplayName("não deve cancelar quando pedido não existir")
        void naoDeveCancelarQuandoPedidoNaoExistir() {
            when(repository.buscarPorCodigo("PED-404")).thenReturn(Optional.empty());

            IllegalArgumentException erro = assertThrows(
                    IllegalArgumentException.class,
                    () -> useCase.executar("PED-404")
            );

            assertEquals("Pedido não encontrado.", erro.getMessage());

            verify(repository).buscarPorCodigo("PED-404");
            verify(repository, never()).salvar(any(Pedido.class));
            verify(auditoria, never()).registrar(any(), any());
            verify(notificador, never()).notificarCancelamento(any(Pedido.class));
        }

        @Test
        @DisplayName("não deve cancelar pedido pago")
        void naoDeveCancelarPedidoPago() {
            Pedido pedido = new Pedido("PED-001", "100.00");
            pedido.pagar();

            when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));

            IllegalStateException erro = assertThrows(
                    IllegalStateException.class,
                    () -> useCase.executar("PED-001")
            );

            assertEquals("Pedido pago não pode ser cancelado.", erro.getMessage());

            verify(repository, never()).salvar(any(Pedido.class));
            verify(auditoria, never()).registrar(any(), any());
            verify(notificador, never()).notificarCancelamento(any(Pedido.class));
        }
    }
}
```

---

# Parte 24 — Rodando os testes

Execute:

```powershell
mvn clean test
```

Resultado esperado:

```text
BUILD SUCCESS
```

Se falhar:

```text
leia a falha;
veja teste;
veja linha;
debugue se necessário;
corrija regra ou teste.
```

---

# Parte 25 — Erros comuns com Mockito

## 1. Esquecer MockitoExtension

Erro comum:

```text
mocks ficam null.
```

Causa:

```java
@Mock
private PedidoRepository repository;
```

mas esqueceu:

```java
@ExtendWith(MockitoExtension.class)
```

---

## 2. Stub não usado

Exemplo:

```java
when(repository.existePorCodigo("PED-001")).thenReturn(false);
```

Mas o código chama:

```java
repository.existePorCodigo("ped-001")
```

Pode dar comportamento inesperado.

Atenção aos valores.

---

## 3. Usar mock onde objeto real seria melhor

Ruim:

```java
Pedido pedido = mock(Pedido.class);
```

Melhor:

```java
Pedido pedido = new Pedido("PED-001", "100.00");
```

---

## 4. Teste muito acoplado

Verificar cada chamada interna pode quebrar refatorações legítimas.

Teste deve proteger comportamento, não engessar implementação.

---

## 5. Mockar classe testada

Ruim:

```java
CriarPedidoUseCase useCase = mock(CriarPedidoUseCase.class);
```

Se você mocka a classe que quer testar, você não testa nada.

Você deve mockar dependências, não a unidade testada.

---

## 6. Misturar matcher com valor real incorretamente

Ruim:

```java
verify(auditoria).registrar(eq("PEDIDO_CRIADO"), "PED-001");
```

Prefira:

```java
verify(auditoria).registrar(eq("PEDIDO_CRIADO"), eq("PED-001"));
```

Ou:

```java
verify(auditoria).registrar("PEDIDO_CRIADO", "PED-001");
```

---

# Parte 26 — Boas práticas com Mockito

Use boas práticas:

```text
mocke dependências, não domínio simples;
prefira interfaces para portas externas;
use nomes de teste claros;
configure apenas stubs necessários;
não exagere em verify;
verifique ausência de interação quando for regra;
use ArgumentCaptor quando precisar validar objeto criado internamente;
use objetos reais para entidades;
mantenha teste legível;
evite lógica complexa no teste;
rode mvn clean test;
organize por cenário com @Nested quando ajudar;
não use mock para esconder design ruim.
```

---

# Parte 27 — Mockito e arquitetura

Mockito funciona melhor quando a arquitetura está bem separada.

Exemplo bom:

```text
CriarPedidoUseCase
  depende de PedidoRepository
  depende de NotificadorPedido
  depende de AuditoriaGateway
```

Tudo por interface.

Teste fica simples.

Exemplo ruim:

```java
public class CriarPedidoService {
    public void executar(...) {
        Connection conn = DriverManager.getConnection(...);
        HttpClient client = HttpClient.newHttpClient();
        // regra + banco + http + validação no mesmo método
    }
}
```

Difícil de testar.

Isso mostra por que arquitetura importa.

---

# Parte 28 — Testes de use case

Um teste de use case deve focar em:

```text
entrada;
regra de orquestração;
dependências chamadas;
resultado;
erros;
efeitos esperados.
```

Normalmente mockamos:

```text
repository;
gateway;
publisher;
notificador;
auditoria;
clock;
client externo.
```

E usamos objetos reais para:

```text
command;
entidade;
value object;
resultado.
```

---

# Parte 29 — Testes de service

Um service pode ser:

```text
service de domínio;
application service;
service de integração.
```

Para service de domínio puro:

```text
geralmente não precisa mock.
```

Para application service com dependências:

```text
Mockito ajuda.
```

Para service que chama API externa:

```text
mock do client/gateway.
```

---

# Parte 30 — Mockito e Spring futuramente

Quando entrarmos em Spring, você verá:

```text
@Mock;
@InjectMocks;
@MockBean ou substitutos modernos conforme contexto;
@WebMvcTest;
@SpringBootTest;
@DataJpaTest;
MockitoExtension;
SpringExtension;
testes unitários sem subir contexto;
testes de integração subindo contexto.
```

A ideia importante:

```text
Nem todo teste de Spring precisa subir o Spring.
```

Muitos use cases podem ser testados com JUnit + Mockito puro.

Isso deixa testes:

```text
mais rápidos;
mais simples;
mais estáveis.
```

---

# Parte 31 — Teste unitário vs teste de integração

Teste com Mockito:

```text
rápido;
isolado;
sem banco real;
sem Spring;
sem rede;
bom para regra e orquestração.
```

Teste de integração:

```text
valida wiring real;
banco real ou container;
Spring context;
repositories reais;
serialização real;
mais lento;
mais próximo da execução real.
```

Os dois são importantes.

Mas não substituem um ao outro.

---

# Parte 32 — Relatório da aula

Crie:

```text
RELATORIO_MOCKITO.md
```

Modelo:

```md
# Relatório Mockito — Aula 253

## Comando executado

`mvn clean test`

## Classes testadas

- CriarPedidoUseCase
- PagamentoPedidoService
- CancelarPedidoUseCase

## Dependências mockadas

- PedidoRepository
- NotificadorPedido
- AuditoriaGateway
- GatewayPagamento

## Cenários de sucesso

## Cenários de erro

## Verificações com verify

## Uso de ArgumentCaptor

## Falhas encontradas

## Correções aplicadas

## Aprendizados
```

---

# Parte 33 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar o que é Mockito.
[ ] Sei explicar o que é mock.
[ ] Sei explicar o que é stub.
[ ] Sei explicar o que é verify.
[ ] Sei configurar Mockito com Maven.
[ ] Sei usar MockitoExtension.
[ ] Sei usar @Mock.
[ ] Sei usar @InjectMocks.
[ ] Sei usar when/thenReturn.
[ ] Sei usar when/thenThrow.
[ ] Sei usar verify.
[ ] Sei usar times.
[ ] Sei usar never.
[ ] Sei usar any.
[ ] Sei usar eq.
[ ] Sei usar ArgumentCaptor.
[ ] Sei testar use case com repository mockado.
[ ] Sei testar service com gateway mockado.
[ ] Sei verificar ausência de interação.
[ ] Sei evitar mock de entidade simples.
[ ] Sei conectar Mockito com arquitetura.
[ ] Sei preparar base para testes com Spring.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Mockito?
2. O que é mock?
3. O que é stub?
4. O que é verify?
5. Para que serve @Mock?
6. Para que serve @InjectMocks?
7. Para que serve MockitoExtension?
8. Qual diferença entre thenReturn e thenThrow?
9. Para que serve times(1)?
10. Para que serve never()?
11. Para que serve any()?
12. Para que serve eq()?
13. Para que serve ArgumentCaptor?
14. O que não devemos mockar sem necessidade?
15. Por que use case com interfaces é mais fácil de testar?
16. Quando usar teste unitário com Mockito?
17. Quando precisa teste de integração?
18. Como Mockito prepara Spring?
```

---

# Parte 34 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-253-mockito-usecase-service
```

Com:

```text
pom.xml;
domain/Pedido.java;
domain/StatusPedido.java;
application/port/PedidoRepository.java;
application/port/NotificadorPedido.java;
application/port/AuditoriaGateway.java;
application/port/GatewayPagamento.java;
application/usecase/CriarPedidoCommand.java;
application/usecase/PedidoResultado.java;
application/usecase/CriarPedidoUseCase.java;
application/usecase/CancelarPedidoUseCase.java;
application/service/PagamentoPedidoService.java;
testes com Mockito;
RELATORIO_MOCKITO.md.
```

---

## Requisitos

Você deve testar:

```text
criação de pedido com sucesso;
bloqueio de criação quando pedido já existe;
captura do pedido salvo;
pagamento com gateway autorizado;
bloqueio quando pedido não existe;
bloqueio quando gateway recusa;
cancelamento com sucesso;
bloqueio de cancelamento com código vazio;
bloqueio de cancelamento quando pedido não existe;
bloqueio de cancelamento de pedido pago.
```

---

## Critérios

```text
usar JUnit 5;
usar Mockito;
usar @ExtendWith(MockitoExtension.class);
usar @Mock;
usar @InjectMocks;
usar when/thenReturn;
usar assertThrows;
usar verify;
usar never;
usar ArgumentCaptor em pelo menos um teste;
não mockar entidade Pedido sem necessidade;
mvn clean test deve passar;
relatório deve ser preenchido.
```

---

# Parte 35 — Desafio extra

## Criar use case de reembolso

Crie:

```text
ReembolsarPedidoUseCase
```

Regras:

```text
pedido deve existir;
pedido deve estar PAGO;
gateway de pagamento deve autorizar reembolso;
pedido deve voltar para CANCELADO ou status REEMBOLSADO, se você criar novo enum;
salvar pedido;
auditar PEDIDO_REEMBOLSADO;
notificar reembolso.
```

Você pode criar:

```text
GatewayReembolso;
NotificadorPedido.notificarReembolso;
StatusPedido.REEMBOLSADO.
```

Testes:

```text
deve reembolsar pedido pago;
não deve reembolsar pedido inexistente;
não deve reembolsar pedido criado;
não deve reembolsar pedido cancelado;
não deve salvar quando gateway recusar;
deve auditar recusa se fizer sentido na regra.
```

Critérios:

```text
usar mocks;
usar captor;
usar verify never;
usar nomes claros;
não chamar gateway se status for inválido;
mvn test deve passar.
```

---

# Parte 36 — Simulado rápido

## Questão 1

Mockito é usado principalmente para:

```text
A) criar mocks e simular dependências em testes.
B) criar tabelas no banco.
C) compilar código Java.
D) substituir Git.
```

---

## Questão 2

Mock é:

```text
A) objeto simulado controlado pelo teste.
B) banco real.
C) arquivo JAR.
D) classe main.
```

---

## Questão 3

Stub é:

```text
A) comportamento configurado em um mock.
B) branch Git.
C) fase do Maven.
D) annotation do Spring apenas.
```

---

## Questão 4

`verify` serve para:

```text
A) verificar se uma interação aconteceu.
B) compilar o projeto.
C) criar package.
D) instalar JDK.
```

---

## Questão 5

`never()` é usado para:

```text
A) verificar que uma chamada não aconteceu.
B) rodar teste sempre.
C) criar commit.
D) gerar CSV.
```

---

## Questão 6

`ArgumentCaptor` serve para:

```text
A) capturar argumento passado para um mock.
B) capturar tela da IDE.
C) capturar branch remota.
D) capturar versão Java.
```

---

## Questão 7

Em teste unitário de use case, geralmente mockamos:

```text
A) repositories, gateways, clients e publishers.
B) String e BigDecimal sempre.
C) entidades simples sempre.
D) todos os records sempre.
```

---

## Questão 8

Um erro comum é:

```text
A) mockar a própria classe que deveria ser testada.
B) usar JUnit com Mockito.
C) usar interfaces para portas.
D) usar objetos reais de domínio.
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
git add labs/m11/aula-253-mockito-usecase-service
git commit -m "Aula 253: mockito mocks stubs verify testes usecase service"
git status
```

---

## Fechamento

A principal ideia desta aula é:

```text
Mockito permite testar classes com dependências de forma isolada, simulando repositories, gateways, clients e serviços externos.
```

Você estudou:

```text
Mockito;
mock;
stub;
verify;
when;
thenReturn;
thenThrow;
@ExtendWith(MockitoExtension.class);
@Mock;
@InjectMocks;
times;
never;
any;
eq;
ArgumentCaptor;
teste de use case;
teste de service;
repository mockado;
gateway mockado;
auditoria mockada;
notificador mockado;
ausência de interação;
erros comuns;
boas práticas;
relação com arquitetura;
preparação para Spring.
```

Na próxima aula, vamos aprofundar:

```text
Mockito avançado.
```

A ideia será estudar `doReturn`, `doThrow`, métodos void, spies, captors avançados, InOrder, respostas customizadas, armadilhas comuns e como escrever testes menos frágeis em cenários reais de backend.
