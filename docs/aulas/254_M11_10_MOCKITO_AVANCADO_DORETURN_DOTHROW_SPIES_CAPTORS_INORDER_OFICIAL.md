# 254 — M11.10 — Mockito avançado: doReturn, doThrow, spies, captors, InOrder e testes menos frágeis

## Objetivo da aula

Na aula anterior, você estudou Mockito na base profissional:

```text
mock;
stub;
verify;
when/thenReturn;
when/thenThrow;
@Mock;
@InjectMocks;
MockitoExtension;
times;
never;
any;
eq;
ArgumentCaptor;
testes de use case;
testes de service;
repository mockado;
gateway mockado;
notificador mockado.
```

Agora vamos aprofundar Mockito em um nível mais avançado.

Esta aula é importante porque em projetos reais você vai encontrar cenários mais complexos:

```text
métodos void;
exceções em gateways;
spies;
captura de múltiplos argumentos;
ordem de chamadas;
respostas customizadas;
mocks com Optional;
listas e coleções;
verificação de ausência de interação;
testes muito acoplados;
testes frágeis por excesso de verify;
diferença entre mock, stub, fake e spy;
armadilhas de Mockito;
boas práticas para use cases reais.
```

Ao final desta aula, você deve conseguir:

```text
usar doReturn;
usar doThrow;
usar doNothing;
testar métodos void;
usar spy com cuidado;
entender diferença entre mock e spy;
usar ArgumentCaptor com múltiplas chamadas;
usar InOrder para ordem de execução;
usar Answer para resposta customizada;
usar verifyNoInteractions;
usar verifyNoMoreInteractions com critério;
usar lenient com cautela;
entender strict stubbing;
evitar testes frágeis;
testar fluxos de backend mais realistas;
preparar base para testes com Spring.
```

---

## Reforço do objetivo maior

Nosso objetivo continua sendo formar uma trilha completa de Java Backend, do básico ao nível engenheiro/arquiteto Java.

Por isso, Mockito avançado não é apenas sobre decorar comandos.

O objetivo é entender:

```text
como testar comportamento real;
como isolar dependências;
como controlar cenários difíceis;
como testar falhas;
como evitar testes acoplados demais;
como manter teste legível;
como proteger regra de negócio;
como preparar testes rápidos para pipeline;
como aplicar isso em arquitetura limpa;
como isso se conecta com Spring depois.
```

Mockito é uma ferramenta.

A maturidade está em saber quando usar, quando evitar e como escrever testes que ajudam o projeto.

---

# Parte 1 — Revisão rápida: mock, stub e verify

## Mock

Objeto simulado.

Exemplo:

```java
PedidoRepository repository = mock(PedidoRepository.class);
```

Ele substitui uma dependência real.

---

## Stub

Comportamento configurado no mock.

Exemplo:

```java
when(repository.existePorCodigo("PED-001")).thenReturn(false);
```

---

## Verify

Validação de interação.

Exemplo:

```java
verify(repository).salvar(pedido);
```

---

## Frase prática

```text
Mock é o objeto falso.
Stub é a resposta combinada.
Verify é a conferência da interação.
```

---

# Parte 2 — Por que existe Mockito avançado

Na prática, nem todo método retorna valor.

Alguns métodos são `void`.

Exemplos:

```java
void salvar(Pedido pedido);
void publicar(Evento evento);
void enviar(Mensagem mensagem);
void registrar(String acao, String detalhe);
```

Com `void`, você não usa:

```java
when(...).thenReturn(...)
```

porque não há retorno.

Você usa recursos como:

```text
doNothing;
doThrow;
doAnswer.
```

Também há casos em que você precisa:

```text
simular exceção em método void;
capturar vários argumentos;
validar ordem;
parcialmente mockar um objeto real;
evitar execução real de método em spy;
simular resposta baseada no argumento.
```

É aqui que entram os recursos avançados.

---

# Parte 3 — when/thenReturn vs doReturn/when

Forma comum:

```java
when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
```

Forma alternativa:

```java
doReturn(Optional.of(pedido))
        .when(repository)
        .buscarPorCodigo("PED-001");
```

As duas podem configurar retorno.

---

## Quando usar when/thenReturn

Use normalmente para mocks comuns.

Exemplo:

```java
when(gateway.autorizar(pedido)).thenReturn(true);
```

Essa é a forma mais legível na maioria dos casos.

---

## Quando usar doReturn

`doReturn` é útil principalmente com spies ou quando você quer evitar que o método real seja chamado durante o stubbing.

Exemplo com spy:

```java
Calculadora calculadora = spy(new Calculadora());

doReturn(100).when(calculadora).somar(50, 50);
```

Se usar `when(spy.metodo()).thenReturn(...)`, o método real pode ser chamado no momento da configuração.

Isso pode causar efeitos colaterais.

---

## Regra prática

```text
Mock comum:
prefira when/thenReturn.

Spy:
prefira doReturn/when para evitar chamada real durante o stubbing.
```

---

# Parte 4 — doThrow para métodos void

Para método que retorna valor, você pode usar:

```java
when(gateway.autorizar(pedido)).thenThrow(new RuntimeException("Erro"));
```

Para método `void`, use:

```java
doThrow(new RuntimeException("Erro"))
        .when(notificador)
        .notificarPagamento(pedido);
```

---

## Exemplo prático

Se `notificador.notificarPagamento(pedido)` falhar, queremos simular:

```text
serviço de notificação indisponível.
```

Mockito:

```java
doThrow(new RuntimeException("Notificador indisponível."))
        .when(notificador)
        .notificarPagamento(pedido);
```

---

# Parte 5 — doNothing

Métodos void em mocks, por padrão, já não fazem nada.

Então isto geralmente é desnecessário:

```java
doNothing().when(repository).salvar(pedido);
```

Mas pode ser usado para deixar intenção explícita em alguns cenários.

Exemplo:

```java
doNothing()
        .when(auditoria)
        .registrar("PEDIDO_CRIADO", "PED-001");
```

---

## Regra prática

```text
Não use doNothing sem necessidade.
Mocks void já não fazem nada por padrão.
```

Use quando:

```text
quer deixar uma configuração explícita;
está combinando com doThrow em cenários diferentes;
está trabalhando com spy e quer impedir método real.
```

---

# Parte 6 — O que é spy

Spy é um objeto real parcialmente monitorado/mockado.

Exemplo:

```java
Calculadora calculadora = spy(new Calculadora());
```

Por padrão, o spy chama métodos reais.

Mas você pode sobrescrever alguns comportamentos.

---

## Mock vs Spy

## Mock

```text
objeto falso.
não executa métodos reais por padrão.
retorna valores default se não houver stub.
```

## Spy

```text
objeto real embrulhado.
executa métodos reais por padrão.
permite stubar partes.
```

---

## Exemplo

```java
Calculadora calculadora = spy(new Calculadora());

doReturn(999).when(calculadora).somar(10, 5);

int soma = calculadora.somar(10, 5);
int multiplicacao = calculadora.multiplicar(10, 5);
```

Resultado:

```text
soma:
999, porque foi stubada.

multiplicacao:
50, porque chamou método real.
```

---

## Cuidado com spy

Spy pode ser útil, mas costuma indicar risco.

Pergunte:

```text
por que preciso mockar parcialmente esse objeto?
essa classe tem responsabilidade demais?
seria melhor extrair uma dependência?
seria melhor testar comportamento público?
```

Spy pode ajudar em legado, mas não deve ser primeira opção.

---

# Parte 7 — Estrutura do laboratório

Crie:

```powershell
mkdir labs\m11\aula-254-mockito-avancado
cd labs\m11\aula-254-mockito-avancado

mkdir src\main\java\br\com\curso\aula254
mkdir src\main\java\br\com\curso\aula254\domain
mkdir src\main\java\br\com\curso\aula254\application
mkdir src\main\java\br\com\curso\aula254\application\port
mkdir src\main\java\br\com\curso\aula254\application\usecase
mkdir src\main\java\br\com\curso\aula254\application\service

mkdir src\test\java\br\com\curso\aula254
mkdir src\test\java\br\com\curso\aula254\application
mkdir src\test\java\br\com\curso\aula254\application\usecase
mkdir src\test\java\br\com\curso\aula254\application\service
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
    <artifactId>aula-254-mockito-avancado</artifactId>
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

# Parte 8 — Domínio

Crie:

```text
src/main/java/br/com/curso/aula254/domain/StatusPedido.java
```

Código:

```java
package br.com.curso.aula254.domain;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO,
    REEMBOLSADO
}
```

Crie:

```text
src/main/java/br/com/curso/aula254/domain/Pedido.java
```

Código:

```java
package br.com.curso.aula254.domain;

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

        if (status == StatusPedido.REEMBOLSADO) {
            throw new IllegalStateException("Pedido reembolsado não pode ser pago.");
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

        if (status == StatusPedido.REEMBOLSADO) {
            throw new IllegalStateException("Pedido reembolsado não pode ser cancelado.");
        }

        status = StatusPedido.CANCELADO;
    }

    public void reembolsar() {
        if (status != StatusPedido.PAGO) {
            throw new IllegalStateException("Somente pedido pago pode ser reembolsado.");
        }

        status = StatusPedido.REEMBOLSADO;
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

    public boolean pago() {
        return Objects.equals(status, StatusPedido.PAGO);
    }
}
```

---

# Parte 9 — Portas da aplicação

Crie:

```text
src/main/java/br/com/curso/aula254/application/port/PedidoRepository.java
```

Código:

```java
package br.com.curso.aula254.application.port;

import br.com.curso.aula254.domain.Pedido;

import java.util.Optional;

public interface PedidoRepository {
    Optional<Pedido> buscarPorCodigo(String codigo);

    void salvar(Pedido pedido);
}
```

Crie:

```text
src/main/java/br/com/curso/aula254/application/port/AuditoriaGateway.java
```

Código:

```java
package br.com.curso.aula254.application.port;

public interface AuditoriaGateway {
    void registrar(String acao, String detalhe);
}
```

Crie:

```text
src/main/java/br/com/curso/aula254/application/port/NotificadorPedido.java
```

Código:

```java
package br.com.curso.aula254.application.port;

import br.com.curso.aula254.domain.Pedido;

public interface NotificadorPedido {
    void notificarPagamento(Pedido pedido);

    void notificarReembolso(Pedido pedido);

    void notificarFalha(String codigoPedido, String motivo);
}
```

Crie:

```text
src/main/java/br/com/curso/aula254/application/port/GatewayPagamento.java
```

Código:

```java
package br.com.curso.aula254.application.port;

import br.com.curso.aula254.domain.Pedido;

public interface GatewayPagamento {
    boolean autorizar(Pedido pedido);

    boolean reembolsar(Pedido pedido);
}
```

Crie:

```text
src/main/java/br/com/curso/aula254/application/port/EventPublisher.java
```

Código:

```java
package br.com.curso.aula254.application.port;

public interface EventPublisher {
    void publicar(String tipoEvento, String chave);
}
```

---

# Parte 10 — ReembolsarPedidoUseCase

Crie:

```text
src/main/java/br/com/curso/aula254/application/usecase/ReembolsarPedidoUseCase.java
```

Código:

```java
package br.com.curso.aula254.application.usecase;

import br.com.curso.aula254.application.port.AuditoriaGateway;
import br.com.curso.aula254.application.port.EventPublisher;
import br.com.curso.aula254.application.port.GatewayPagamento;
import br.com.curso.aula254.application.port.NotificadorPedido;
import br.com.curso.aula254.application.port.PedidoRepository;
import br.com.curso.aula254.domain.Pedido;

public class ReembolsarPedidoUseCase {
    private final PedidoRepository repository;
    private final GatewayPagamento gatewayPagamento;
    private final AuditoriaGateway auditoria;
    private final NotificadorPedido notificador;
    private final EventPublisher eventPublisher;

    public ReembolsarPedidoUseCase(
            PedidoRepository repository,
            GatewayPagamento gatewayPagamento,
            AuditoriaGateway auditoria,
            NotificadorPedido notificador,
            EventPublisher eventPublisher
    ) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (gatewayPagamento == null) {
            throw new IllegalArgumentException("Gateway de pagamento é obrigatório.");
        }

        if (auditoria == null) {
            throw new IllegalArgumentException("Auditoria é obrigatória.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        if (eventPublisher == null) {
            throw new IllegalArgumentException("Event publisher é obrigatório.");
        }

        this.repository = repository;
        this.gatewayPagamento = gatewayPagamento;
        this.auditoria = auditoria;
        this.notificador = notificador;
        this.eventPublisher = eventPublisher;
    }

    public void executar(String codigoPedido) {
        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        Pedido pedido = repository.buscarPorCodigo(codigoPedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));

        if (!pedido.pago()) {
            auditoria.registrar("REEMBOLSO_NEGADO_STATUS_INVALIDO", pedido.codigo());
            throw new IllegalStateException("Somente pedido pago pode ser reembolsado.");
        }

        boolean autorizado = gatewayPagamento.reembolsar(pedido);

        if (!autorizado) {
            auditoria.registrar("REEMBOLSO_RECUSADO_GATEWAY", pedido.codigo());
            notificador.notificarFalha(pedido.codigo(), "Gateway recusou reembolso.");
            throw new IllegalStateException("Reembolso não autorizado.");
        }

        pedido.reembolsar();

        repository.salvar(pedido);
        auditoria.registrar("PEDIDO_REEMBOLSADO", pedido.codigo());
        eventPublisher.publicar("PEDIDO_REEMBOLSADO", pedido.codigo());
        notificador.notificarReembolso(pedido);
    }
}
```

---

## O que esse use case faz

Fluxo de sucesso:

```text
valida código;
busca pedido;
valida status pago;
chama gateway de reembolso;
altera status;
salva;
audita;
publica evento;
notifica.
```

Fluxos de erro:

```text
código vazio;
pedido não encontrado;
pedido não pago;
gateway recusou.
```

---

# Parte 11 — Teste com doThrow em método void

Vamos testar falha em notificação.

Crie:

```text
src/test/java/br/com/curso/aula254/application/usecase/ReembolsarPedidoUseCaseTest.java
```

Código:

```java
package br.com.curso.aula254.application.usecase;

import br.com.curso.aula254.application.port.AuditoriaGateway;
import br.com.curso.aula254.application.port.EventPublisher;
import br.com.curso.aula254.application.port.GatewayPagamento;
import br.com.curso.aula254.application.port.NotificadorPedido;
import br.com.curso.aula254.application.port.PedidoRepository;
import br.com.curso.aula254.domain.Pedido;
import br.com.curso.aula254.domain.StatusPedido;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("ReembolsarPedidoUseCase")
class ReembolsarPedidoUseCaseTest {
    @Mock
    private PedidoRepository repository;

    @Mock
    private GatewayPagamento gatewayPagamento;

    @Mock
    private AuditoriaGateway auditoria;

    @Mock
    private NotificadorPedido notificador;

    @Mock
    private EventPublisher eventPublisher;

    @InjectMocks
    private ReembolsarPedidoUseCase useCase;

    @Nested
    @DisplayName("Sucesso")
    class Sucesso {
        @Test
        @DisplayName("deve reembolsar pedido pago")
        void deveReembolsarPedidoPago() {
            Pedido pedido = new Pedido("PED-001", "100.00");
            pedido.pagar();

            when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
            when(gatewayPagamento.reembolsar(pedido)).thenReturn(true);

            useCase.executar("PED-001");

            ArgumentCaptor<Pedido> pedidoCaptor = ArgumentCaptor.forClass(Pedido.class);

            verify(repository).salvar(pedidoCaptor.capture());

            Pedido pedidoSalvo = pedidoCaptor.getValue();

            assertEquals(StatusPedido.REEMBOLSADO, pedidoSalvo.status());

            verify(auditoria).registrar("PEDIDO_REEMBOLSADO", "PED-001");
            verify(eventPublisher).publicar("PEDIDO_REEMBOLSADO", "PED-001");
            verify(notificador).notificarReembolso(pedido);
        }

        @Test
        @DisplayName("deve executar salvar, auditar, publicar e notificar nesta ordem")
        void deveExecutarAcoesNaOrdemEsperada() {
            Pedido pedido = new Pedido("PED-001", "100.00");
            pedido.pagar();

            when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
            when(gatewayPagamento.reembolsar(pedido)).thenReturn(true);

            useCase.executar("PED-001");

            InOrder ordem = inOrder(repository, auditoria, eventPublisher, notificador);

            ordem.verify(repository).salvar(any(Pedido.class));
            ordem.verify(auditoria).registrar("PEDIDO_REEMBOLSADO", "PED-001");
            ordem.verify(eventPublisher).publicar("PEDIDO_REEMBOLSADO", "PED-001");
            ordem.verify(notificador).notificarReembolso(pedido);
        }
    }

    @Nested
    @DisplayName("Erros")
    class Erros {
        @Test
        @DisplayName("não deve reembolsar quando código for vazio")
        void naoDeveReembolsarQuandoCodigoForVazio() {
            IllegalArgumentException erro = assertThrows(
                    IllegalArgumentException.class,
                    () -> useCase.executar(" ")
            );

            assertEquals("Código do pedido é obrigatório.", erro.getMessage());

            verify(repository, never()).buscarPorCodigo(any());
            verify(gatewayPagamento, never()).reembolsar(any(Pedido.class));
            verify(repository, never()).salvar(any(Pedido.class));
        }

        @Test
        @DisplayName("não deve reembolsar quando pedido não existir")
        void naoDeveReembolsarQuandoPedidoNaoExistir() {
            when(repository.buscarPorCodigo("PED-404")).thenReturn(Optional.empty());

            IllegalArgumentException erro = assertThrows(
                    IllegalArgumentException.class,
                    () -> useCase.executar("PED-404")
            );

            assertEquals("Pedido não encontrado.", erro.getMessage());

            verify(gatewayPagamento, never()).reembolsar(any(Pedido.class));
            verify(repository, never()).salvar(any(Pedido.class));
            verify(notificador, never()).notificarReembolso(any(Pedido.class));
        }

        @Test
        @DisplayName("não deve chamar gateway quando pedido não está pago")
        void naoDeveChamarGatewayQuandoPedidoNaoEstaPago() {
            Pedido pedido = new Pedido("PED-001", "100.00");

            when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));

            IllegalStateException erro = assertThrows(
                    IllegalStateException.class,
                    () -> useCase.executar("PED-001")
            );

            assertEquals("Somente pedido pago pode ser reembolsado.", erro.getMessage());

            verify(auditoria).registrar("REEMBOLSO_NEGADO_STATUS_INVALIDO", "PED-001");
            verify(gatewayPagamento, never()).reembolsar(any(Pedido.class));
            verify(repository, never()).salvar(any(Pedido.class));
            verify(notificador, never()).notificarReembolso(any(Pedido.class));
        }

        @Test
        @DisplayName("não deve salvar quando gateway recusar reembolso")
        void naoDeveSalvarQuandoGatewayRecusarReembolso() {
            Pedido pedido = new Pedido("PED-001", "100.00");
            pedido.pagar();

            when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
            when(gatewayPagamento.reembolsar(pedido)).thenReturn(false);

            IllegalStateException erro = assertThrows(
                    IllegalStateException.class,
                    () -> useCase.executar("PED-001")
            );

            assertEquals("Reembolso não autorizado.", erro.getMessage());
            assertEquals(StatusPedido.PAGO, pedido.status());

            verify(auditoria).registrar("REEMBOLSO_RECUSADO_GATEWAY", "PED-001");
            verify(notificador).notificarFalha("PED-001", "Gateway recusou reembolso.");
            verify(repository, never()).salvar(any(Pedido.class));
            verify(eventPublisher, never()).publicar(eq("PEDIDO_REEMBOLSADO"), any());
        }

        @Test
        @DisplayName("deve propagar erro quando notificador falhar após reembolso")
        void devePropagarErroQuandoNotificadorFalharAposReembolso() {
            Pedido pedido = new Pedido("PED-001", "100.00");
            pedido.pagar();

            when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
            when(gatewayPagamento.reembolsar(pedido)).thenReturn(true);

            doThrow(new RuntimeException("Notificador indisponível."))
                    .when(notificador)
                    .notificarReembolso(pedido);

            RuntimeException erro = assertThrows(
                    RuntimeException.class,
                    () -> useCase.executar("PED-001")
            );

            assertEquals("Notificador indisponível.", erro.getMessage());

            verify(repository).salvar(any(Pedido.class));
            verify(auditoria).registrar("PEDIDO_REEMBOLSADO", "PED-001");
            verify(eventPublisher).publicar("PEDIDO_REEMBOLSADO", "PED-001");
            verify(notificador).notificarReembolso(pedido);
        }
    }

    @Test
    @DisplayName("deve capturar múltiplos registros de auditoria")
    void deveCapturarMultiplosRegistrosDeAuditoria() {
        Pedido pedido = new Pedido("PED-001", "100.00");

        when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));

        assertThrows(
                IllegalStateException.class,
                () -> useCase.executar("PED-001")
        );

        ArgumentCaptor<String> acaoCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> detalheCaptor = ArgumentCaptor.forClass(String.class);

        verify(auditoria, times(1)).registrar(acaoCaptor.capture(), detalheCaptor.capture());

        List<String> acoes = acaoCaptor.getAllValues();
        List<String> detalhes = detalheCaptor.getAllValues();

        assertEquals(List.of("REEMBOLSO_NEGADO_STATUS_INVALIDO"), acoes);
        assertEquals(List.of("PED-001"), detalhes);
    }
}
```

---

## Recursos usados nesse teste

```text
doThrow;
ArgumentCaptor;
getAllValues;
InOrder;
never;
times;
eq;
any;
nested tests;
assertThrows.
```

---

# Parte 12 — InOrder com critério

`InOrder` valida ordem de chamadas.

Use quando a ordem é regra.

Exemplo:

```text
salvar antes de notificar.
```

Código:

```java
InOrder ordem = inOrder(repository, notificador);

ordem.verify(repository).salvar(any(Pedido.class));
ordem.verify(notificador).notificarReembolso(pedido);
```

---

## Quando evitar InOrder

Evite se a ordem não importa.

Exemplo:

```text
auditar e publicar evento podem acontecer em qualquer ordem?
```

Se sim, não teste ordem.

Testar ordem desnecessária deixa o teste frágil.

---

# Parte 13 — Capturando múltiplas chamadas

Se um mock é chamado várias vezes:

```java
auditoria.registrar("ACAO_1", "PED-001");
auditoria.registrar("ACAO_2", "PED-001");
```

Você pode capturar tudo:

```java
ArgumentCaptor<String> acaoCaptor = ArgumentCaptor.forClass(String.class);

verify(auditoria, times(2)).registrar(acaoCaptor.capture(), any());

List<String> acoes = acaoCaptor.getAllValues();
```

Isso ajuda a validar:

```text
ordem das auditorias;
conteúdo das chamadas;
quantidade de eventos;
detalhes enviados.
```

---

# Parte 14 — doAnswer e Answer

`doAnswer` permite criar resposta customizada.

É útil quando a resposta depende do argumento.

Exemplo:

```java
doAnswer(invocation -> {
    Pedido pedido = invocation.getArgument(0);
    System.out.println("Salvando pedido " + pedido.codigo());
    return null;
}).when(repository).salvar(any(Pedido.class));
```

Para métodos com retorno:

```java
when(gateway.reembolsar(any(Pedido.class)))
        .thenAnswer(invocation -> {
            Pedido pedido = invocation.getArgument(0);
            return pedido.valor().compareTo(new BigDecimal("1000.00")) <= 0;
        });
```

---

## Exemplo com service de risco

Crie:

```text
src/main/java/br/com/curso/aula254/application/service/AnalisadorRiscoService.java
```

Código:

```java
package br.com.curso.aula254.application.service;

import br.com.curso.aula254.domain.Pedido;

import java.math.BigDecimal;

public class AnalisadorRiscoService {
    public boolean riscoAlto(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return pedido.valor().compareTo(new BigDecimal("1000.00")) > 0;
    }
}
```

Crie:

```text
src/test/java/br/com/curso/aula254/application/service/AnswerExemploTest.java
```

Código:

```java
package br.com.curso.aula254.application.service;

import br.com.curso.aula254.application.port.GatewayPagamento;
import br.com.curso.aula254.domain.Pedido;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AnswerExemploTest {
    @Test
    @DisplayName("deve autorizar dinamicamente conforme valor do pedido")
    void deveAutorizarDinamicamenteConformeValorDoPedido() {
        GatewayPagamento gateway = mock(GatewayPagamento.class);

        when(gateway.autorizar(any(Pedido.class)))
                .thenAnswer(invocation -> {
                    Pedido pedido = invocation.getArgument(0);
                    return pedido.valor().doubleValue() <= 500.00;
                });

        assertTrue(gateway.autorizar(new Pedido("PED-001", "100.00")));
        assertFalse(gateway.autorizar(new Pedido("PED-002", "900.00")));
    }
}
```

---

## Cuidado com Answer

`Answer` pode deixar teste complexo.

Use quando:

```text
resposta depende do argumento;
cenário simples com thenReturn não basta;
quer simular comportamento controlado.
```

Evite transformar mock em sistema completo.

Se o mock começa a ter muita lógica, talvez você precise de um fake.

---

# Parte 15 — Fake vs Mock

## Mock

Criado pelo Mockito.

Usado para simular e verificar interação.

---

## Fake

Implementação simples feita manualmente para teste.

Exemplo:

```java
class PedidoRepositoryFake implements PedidoRepository {
    private final Map<String, Pedido> pedidos = new HashMap<>();

    public Optional<Pedido> buscarPorCodigo(String codigo) {
        return Optional.ofNullable(pedidos.get(codigo));
    }

    public void salvar(Pedido pedido) {
        pedidos.put(pedido.codigo(), pedido);
    }
}
```

Fake pode ser melhor quando:

```text
muitos stubs deixam teste confuso;
você precisa simular comportamento mais realista;
quer testar fluxo com armazenamento em memória;
quer evitar verify excessivo.
```

---

## Regra prática

```text
Mock:
bom para verificar interação e isolar dependência.

Fake:
bom para simular uma dependência simples com comportamento realista.
```

---

# Parte 16 — Spy na prática

Crie:

```text
src/main/java/br/com/curso/aula254/application/service/CalculadoraTaxaService.java
```

Código:

```java
package br.com.curso.aula254.application.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class CalculadoraTaxaService {
    public BigDecimal calcularTaxa(BigDecimal valor) {
        validarValor(valor);

        return valor.multiply(percentualTaxa()).setScale(2, RoundingMode.HALF_UP);
    }

    protected BigDecimal percentualTaxa() {
        return new BigDecimal("0.05");
    }

    protected void validarValor(BigDecimal valor) {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }
    }
}
```

Crie:

```text
src/test/java/br/com/curso/aula254/application/service/SpyExemploTest.java
```

Código:

```java
package br.com.curso.aula254.application.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

class SpyExemploTest {
    @Test
    @DisplayName("deve sobrescrever apenas percentual da taxa usando spy")
    void deveSobrescreverApenasPercentualDaTaxaUsandoSpy() {
        CalculadoraTaxaService calculadora = spy(new CalculadoraTaxaService());

        doReturn(new BigDecimal("0.10"))
                .when(calculadora)
                .percentualTaxa();

        BigDecimal taxa = calculadora.calcularTaxa(new BigDecimal("100.00"));

        assertEquals(new BigDecimal("10.00"), taxa);

        verify(calculadora).percentualTaxa();
    }
}
```

---

## Discussão importante

Esse exemplo é didático.

Em projeto real, se você precisa sobrescrever método protegido para testar, talvez o design possa melhorar.

Uma alternativa seria extrair uma dependência:

```text
PoliticaTaxa
```

E testar com Strategy/mocks.

---

# Parte 17 — Strict stubbing

Mockito com `MockitoExtension` usa uma postura mais rígida.

Se você cria stub que não é usado, pode aparecer erro como:

```text
UnnecessaryStubbingException
```

Exemplo:

```java
when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
```

Mas o método nunca é chamado.

Mockito reclama porque isso pode indicar teste mal escrito.

---

## Por que isso é bom

Ajuda a evitar:

```text
stubs mortos;
teste confuso;
arrange poluído;
comportamento não usado;
cópia e cola de teste.
```

---

## Como resolver

Remova o stub não usado.

Ou ajuste o teste.

Não coloque lenient sem motivo.

---

# Parte 18 — lenient

`lenient` relaxa uma configuração.

Exemplo:

```java
lenient().when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
```

Import estático:

```java
import static org.mockito.Mockito.lenient;
```

Use com muita cautela.

---

## Quando pode fazer sentido

```text
setup compartilhado em @BeforeEach;
alguns testes usam o stub e outros não;
custo de duplicar setup é alto.
```

Mesmo assim, prefira setup específico por teste.

Regra:

```text
lenient é exceção, não padrão.
```

---

# Parte 19 — verifyNoInteractions

Valida que nenhum método foi chamado em um mock.

Exemplo:

```java
verifyNoInteractions(notificador);
```

Use quando a ausência de qualquer interação é regra importante.

Exemplo:

```text
se validação de entrada falha, não deve acionar nenhuma dependência externa.
```

---

# Parte 20 — verifyNoMoreInteractions

Valida que não houve chamadas além das já verificadas.

Exemplo:

```java
verify(repository).salvar(pedido);
verifyNoMoreInteractions(repository);
```

Use com cuidado.

Pode deixar teste frágil quando uma nova interação legítima é adicionada.

---

## Regra prática

```text
verifyNoInteractions:
útil para garantir que nada foi chamado.

verifyNoMoreInteractions:
use apenas quando chamadas extras seriam erro real.
```

---

# Parte 21 — Testes menos frágeis

Um teste frágil quebra quando você muda implementação sem mudar comportamento.

Exemplo:

```text
troquei ordem de auditoria e evento;
regra continua correta;
teste quebra porque testava ordem sem necessidade.
```

Outro exemplo:

```text
adicionei métrica;
teste quebra por verifyNoMoreInteractions.
```

---

## Como escrever teste menos frágil

```text
teste comportamento público;
verifique interações que são regra;
evite verificar detalhe irrelevante;
use captor quando necessário;
não exagere em InOrder;
não use verifyNoMoreInteractions por padrão;
não mocke domínio;
não replique lógica da classe no teste;
mantenha arrange simples.
```

---

# Parte 22 — Fluxo de pensamento para teste com Mockito

Antes de escrever o teste, responda:

```text
1. Qual classe estou testando?
2. Quais dependências ela tem?
3. Quais dependências devem ser mockadas?
4. Qual cenário de entrada?
5. O que os mocks precisam retornar?
6. Qual ação será executada?
7. Qual resultado esperado?
8. Quais interações são regra?
9. Quais interações não devem acontecer?
10. O teste está verificando comportamento ou detalhe interno?
```

---

# Parte 23 — Exemplo de teste ruim e melhoria

## Teste ruim

```java
@Test
void teste() {
    when(repository.buscarPorCodigo(any())).thenReturn(Optional.of(new Pedido("PED-001", "100.00")));
    when(gateway.reembolsar(any())).thenReturn(true);

    useCase.executar("PED-001");

    verify(repository).buscarPorCodigo(any());
    verify(gateway).reembolsar(any());
    verify(repository).salvar(any());
    verify(auditoria).registrar(any(), any());
    verify(eventPublisher).publicar(any(), any());
    verify(notificador).notificarReembolso(any());
}
```

Problemas:

```text
nome ruim;
any demais;
não valida resultado;
não valida status;
não valida dados;
não explica regra.
```

---

## Melhor

```java
@Test
@DisplayName("deve reembolsar pedido pago")
void deveReembolsarPedidoPago() {
    Pedido pedido = new Pedido("PED-001", "100.00");
    pedido.pagar();

    when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
    when(gatewayPagamento.reembolsar(pedido)).thenReturn(true);

    useCase.executar("PED-001");

    ArgumentCaptor<Pedido> captor = ArgumentCaptor.forClass(Pedido.class);
    verify(repository).salvar(captor.capture());

    assertEquals(StatusPedido.REEMBOLSADO, captor.getValue().status());

    verify(auditoria).registrar("PEDIDO_REEMBOLSADO", "PED-001");
    verify(notificador).notificarReembolso(pedido);
}
```

Mais claro.

---

# Parte 24 — Mockito e métodos finais/classes finais

Versões modernas do Mockito conseguem lidar melhor com classes/métodos finais em muitos casos.

Mas, em arquitetura limpa, você tende a mockar interfaces de portas:

```text
PedidoRepository;
GatewayPagamento;
EventPublisher;
NotificadorPedido.
```

Isso reduz necessidade de mockar classes concretas ou final.

Regra profissional:

```text
prefira depender de abstrações nas bordas.
```

---

# Parte 25 — Mockito e Optional

Para repository:

```java
when(repository.buscarPorCodigo("PED-001")).thenReturn(Optional.of(pedido));
```

Para não encontrado:

```java
when(repository.buscarPorCodigo("PED-404")).thenReturn(Optional.empty());
```

Isso ajuda a testar fluxos:

```text
registro encontrado;
registro não encontrado.
```

---

# Parte 26 — Mockito e listas

Exemplo:

```java
when(repository.listarPendentes()).thenReturn(List.of(pedido1, pedido2));
```

Depois:

```java
verify(notificador, times(2)).notificarPagamento(any(Pedido.class));
```

Se precisar capturar todos:

```java
ArgumentCaptor<Pedido> captor = ArgumentCaptor.forClass(Pedido.class);

verify(notificador, times(2)).notificarPagamento(captor.capture());

List<Pedido> pedidosNotificados = captor.getAllValues();
```

---

# Parte 27 — Mockito em CI/CD

Testes com Mockito são rápidos.

Por isso, normalmente rodam em:

```text
todo commit;
todo pull request;
todo push;
pipeline principal.
```

Eles ajudam a detectar erro cedo.

Mas lembre:

```text
Mockito não valida integração real com banco;
Mockito não valida query real;
Mockito não valida serialização real;
Mockito não valida configuração Spring;
Mockito não valida HTTP real.
```

Ele complementa, não substitui outros testes.

---

# Parte 28 — Como isso prepara Spring

Em Spring, você vai ver:

```text
Service com @Service;
Repository com Spring Data;
Gateway com @Component;
Controller com @RestController;
injeção por construtor;
testes unitários com Mockito;
testes de controller com MockMvc;
testes de repository com @DataJpaTest;
testes integrados com @SpringBootTest.
```

A regra será:

```text
Se quero testar regra/orquestração:
JUnit + Mockito puro geralmente basta.

Se quero testar configuração Spring:
teste com Spring.

Se quero testar banco:
teste de integração.

Se quero testar endpoint:
teste web.
```

---

# Parte 29 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei usar doReturn.
[ ] Sei quando preferir doReturn em spy.
[ ] Sei usar doThrow em método void.
[ ] Sei explicar doNothing.
[ ] Sei explicar mock vs spy.
[ ] Sei usar spy com cuidado.
[ ] Sei usar ArgumentCaptor com getAllValues.
[ ] Sei usar InOrder.
[ ] Sei usar Answer.
[ ] Sei diferenciar mock e fake.
[ ] Sei explicar strict stubbing.
[ ] Sei explicar lenient.
[ ] Sei usar verifyNoInteractions.
[ ] Sei usar verifyNoMoreInteractions com critério.
[ ] Sei evitar teste frágil.
[ ] Sei testar métodos void.
[ ] Sei testar falha de notificador.
[ ] Sei testar ordem quando ela importa.
[ ] Sei preparar base para Spring.
```

---

## Registro rápido da aula

Responda:

```text
1. Qual diferença entre when/thenReturn e doReturn/when?
2. Quando usar doThrow?
3. Para que serve doNothing?
4. O que é spy?
5. Qual diferença entre mock e spy?
6. Por que spy deve ser usado com cuidado?
7. Para que serve ArgumentCaptor.getAllValues?
8. Para que serve InOrder?
9. Quando não usar InOrder?
10. O que é Answer?
11. Qual diferença entre fake e mock?
12. O que é strict stubbing?
13. Quando usar lenient?
14. Para que serve verifyNoInteractions?
15. Por que verifyNoMoreInteractions pode deixar teste frágil?
16. Como escrever testes menos frágeis?
17. Como Mockito avançado prepara Spring?
```

---

# Parte 30 — Exercício prático principal

## Missão

Criar o laboratório:

```text
labs/m11/aula-254-mockito-avancado
```

Com:

```text
pom.xml;
domain/Pedido.java;
domain/StatusPedido.java;
application/port/PedidoRepository.java;
application/port/AuditoriaGateway.java;
application/port/NotificadorPedido.java;
application/port/GatewayPagamento.java;
application/port/EventPublisher.java;
application/usecase/ReembolsarPedidoUseCase.java;
application/service/AnalisadorRiscoService.java;
application/service/CalculadoraTaxaService.java;
testes avançados com Mockito;
RELATORIO_MOCKITO_AVANCADO.md.
```

---

## Requisitos

Você deve testar:

```text
reembolso com sucesso;
pedido inexistente;
pedido não pago;
gateway recusando;
notificador lançando exceção com doThrow;
captura de pedido salvo;
ordem de salvar/auditar/publicar/notificar com InOrder;
captura de argumentos de auditoria;
Answer com resposta dinâmica;
Spy com doReturn;
verify never;
verifyNoInteractions ou verifyNoMoreInteractions em cenário justificado.
```

---

## Critérios

```text
usar JUnit 5;
usar Mockito;
usar MockitoExtension;
usar doThrow;
usar doReturn;
usar spy;
usar ArgumentCaptor;
usar InOrder;
usar Answer;
não exagerar em verify;
não mockar Pedido sem necessidade;
mvn clean test deve passar;
relatório deve registrar decisões.
```

---

# Parte 31 — Desafio extra

## Criar processamento em lote

Crie:

```text
ProcessarReembolsosEmLoteUseCase
```

Entrada:

```text
List<String> codigosPedidos
```

Regras:

```text
para cada código:
buscar pedido;
se não existir, auditar PEDIDO_NAO_ENCONTRADO;
se existir e não estiver pago, auditar STATUS_INVALIDO;
se existir e estiver pago, chamar gateway;
se gateway autorizar, reembolsar, salvar e notificar;
se gateway recusar, auditar REEMBOLSO_RECUSADO;
no final, publicar evento LOTE_REEMBOLSO_FINALIZADO.
```

Testes obrigatórios:

```text
deve processar múltiplos pedidos;
deve capturar todos os pedidos salvos;
deve capturar todas as auditorias;
deve notificar somente pedidos reembolsados;
deve publicar evento final uma vez;
deve usar InOrder se você considerar ordem regra;
deve usar Answer para gateway autorizar conforme valor.
```

Critérios:

```text
usar captor getAllValues;
usar times(n);
usar never onde fizer sentido;
não criar teste gigante impossível de ler;
se necessário, quebrar em cenários menores.
```

---

# Parte 32 — Relatório da aula

Crie:

```text
RELATORIO_MOCKITO_AVANCADO.md
```

Modelo:

```md
# Relatório Mockito Avançado — Aula 254

## Comando executado

`mvn clean test`

## Recursos usados

- doReturn
- doThrow
- spy
- ArgumentCaptor
- getAllValues
- InOrder
- Answer
- verifyNoInteractions
- verifyNoMoreInteractions

## Classes testadas

## Cenários de sucesso

## Cenários de erro

## Onde usei doThrow

## Onde usei spy

## Onde usei InOrder

## Onde usei captor

## Cuidados para evitar teste frágil

## Falhas encontradas

## Correções aplicadas

## Aprendizados
```

---

# Parte 33 — Simulado rápido

## Questão 1

`doThrow` é especialmente útil para:

```text
A) configurar exceção em método void.
B) criar branch Git.
C) compilar Maven.
D) criar enum.
```

---

## Questão 2

Spy é:

```text
A) objeto real parcialmente monitorado/mockado.
B) banco de dados falso obrigatório.
C) arquivo de configuração.
D) plugin Maven.
```

---

## Questão 3

`doReturn` é preferível em spy porque:

```text
A) evita chamada real do método durante o stubbing.
B) sempre executa banco real.
C) impede todos os testes.
D) substitui JUnit.
```

---

## Questão 4

`InOrder` serve para:

```text
A) validar ordem de interações.
B) ordenar imports.
C) criar build.gradle.
D) configurar JDK.
```

---

## Questão 5

`ArgumentCaptor.getAllValues()` serve para:

```text
A) obter todos os argumentos capturados em múltiplas chamadas.
B) listar branches.
C) listar dependências Maven.
D) capturar stack trace.
```

---

## Questão 6

`Answer` permite:

```text
A) criar resposta customizada baseada na invocação.
B) desabilitar teste permanentemente.
C) apagar mocks.
D) rodar Spring automaticamente.
```

---

## Questão 7

`verifyNoMoreInteractions` deve ser usado:

```text
A) com critério, pois pode deixar teste frágil.
B) sempre em todo teste.
C) para substituir assertEquals.
D) apenas em Git.
```

---

## Questão 8

Uma boa prática é:

```text
A) mockar dependências externas e usar domínio real quando possível.
B) mockar todos os objetos sempre.
C) mockar a classe testada.
D) usar spy em todos os testes.
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
git add labs/m11/aula-254-mockito-avancado
git commit -m "Aula 254: mockito avancado doreturn dothrow spies captors inorder"
git status
```

---

## Fechamento

A principal ideia desta aula é:

```text
Mockito avançado ajuda a testar cenários mais complexos de backend, mas deve ser usado com critério para evitar testes frágeis e acoplados demais.
```

Você estudou:

```text
doReturn;
doThrow;
doNothing;
métodos void;
spy;
mock vs spy;
ArgumentCaptor avançado;
getAllValues;
InOrder;
Answer;
fake vs mock;
strict stubbing;
lenient;
verifyNoInteractions;
verifyNoMoreInteractions;
testes menos frágeis;
testes de reembolso;
falhas de gateway;
falhas de notificador;
ordem de interações;
preparação para Spring.
```

Na próxima aula, vamos aprofundar:

```text
AssertJ e escrita de assertions mais expressivas.
```

A ideia será melhorar a legibilidade dos testes com assertions fluentes, comparações de objetos, listas, exceções, BigDecimal, Optional e cenários reais de backend.
