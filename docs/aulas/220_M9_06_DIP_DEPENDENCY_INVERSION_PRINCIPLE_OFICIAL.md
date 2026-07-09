# 220 — M9.06 — DIP: Dependency Inversion Principle

## Objetivo da aula

Na aula anterior, você estudou:

```text
ISP — Interface Segregation Principle
```

Você viu que:

```text
clientes não devem depender de métodos que não usam;
interfaces grandes demais criam contratos falsos;
UnsupportedOperationException pode indicar interface mal desenhada;
interfaces devem representar capacidades coesas;
leitura e escrita podem ser separadas;
notificação pode ser separada por capacidade;
ISP ajuda LSP;
ISP prepara DIP.
```

Agora vamos estudar o quinto princípio do SOLID:

```text
DIP — Dependency Inversion Principle
```

Em português:

```text
Princípio da Inversão de Dependência
```

Este princípio fecha o SOLID e conecta diretamente com:

```text
arquitetura;
testes;
injeção de dependência;
Spring;
Clean Architecture;
Hexagonal Architecture;
Ports and Adapters;
baixo acoplamento;
troca de infraestrutura;
mock;
fake;
stub;
repository;
gateway;
client.
```

Ao final desta aula, você deve conseguir:

```text
entender o que é DIP;
entender o que são módulos de alto nível;
entender o que são módulos de baixo nível;
entender por que regra de negócio não deve depender de detalhes;
entender dependência direta em implementação concreta;
entender dependência por abstração;
criar interfaces de porta;
implementar adapters concretos;
injetar dependências pelo construtor;
evitar new dentro do service;
trocar implementação sem alterar o use case;
testar fluxo com implementação fake;
aplicar DIP em repository, notificação e gateway;
entender como isso prepara Spring Boot.
```

---

## Ideia principal

DIP diz:

```text
módulos de alto nível não devem depender de módulos de baixo nível;
ambos devem depender de abstrações.
```

E também:

```text
abstrações não devem depender de detalhes;
detalhes devem depender de abstrações.
```

Traduzindo para backend:

```text
o use case não deveria depender diretamente de banco, arquivo, SMTP, API externa ou implementação concreta.
```

Ele deveria depender de contratos.

Exemplo:

```text
PedidoFaturamentoUseCase
depende de PedidoRepository
depende de PedidoNotificador
depende de AuditoriaGateway
```

E não diretamente de:

```text
PedidoRepositoryPostgres
EmailSmtpClient
ArquivoAuditoriaGateway
```

---

## DIP em uma frase prática

```text
Regra de negócio deve depender de contrato, não de detalhe técnico.
```

Exemplo ruim:

```java
public class PedidoService {
    private final PedidoRepositoryPostgres repository = new PedidoRepositoryPostgres();
}
```

Exemplo melhor:

```java
public class PedidoService {
    private final PedidoRepository repository;

    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }
}
```

Agora o service não sabe se o pedido vem de:

```text
memória;
arquivo;
PostgreSQL;
MongoDB;
API externa;
fake de teste.
```

Ele só sabe que existe um contrato:

```text
PedidoRepository
```

---

## Por que chama inversão de dependência

Sem DIP, o fluxo costuma ser:

```text
regra de negócio depende de infraestrutura.
```

Exemplo:

```text
PedidoService -> PedidoRepositoryPostgres
```

Com DIP, invertimos:

```text
regra de negócio define o contrato;
infraestrutura implementa o contrato.
```

Exemplo:

```text
PedidoService -> PedidoRepository
PedidoRepositoryPostgres -> implementa PedidoRepository
```

A regra não aponta para o detalhe.

O detalhe se adapta à regra.

Isso é a inversão.

---

## Frase arquitetural mantida

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com DIP:

```text
o use case coordena dependendo de contratos;
o repository concreto é detalhe;
o client concreto é detalhe;
o gateway concreto é detalhe;
o controller monta/injeta as dependências nesta fase;
futuramente o Spring fará isso automaticamente.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m9\aula-220-dip-dependency-inversion-principle
cd labs\m9\aula-220-dip-dependency-inversion-principle
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula220
mkdir src\br\com\curso\aula220\app
mkdir src\br\com\curso\aula220\dominio
mkdir src\br\com\curso\aula220\dominio\pedido
mkdir src\br\com\curso\aula220\dto
mkdir src\br\com\curso\aula220\ruim
mkdir src\br\com\curso\aula220\aplicacao
mkdir src\br\com\curso\aula220\aplicacao\port
mkdir src\br\com\curso\aula220\aplicacao\service
mkdir src\br\com\curso\aula220\infra
mkdir src\br\com\curso\aula220\infra\repository
mkdir src\br\com\curso\aula220\infra\notificacao
mkdir src\br\com\curso\aula220\infra\auditoria
mkdir src\br\com\curso\aula220\teste
```

---

# Parte 1 — Alto nível e baixo nível

## Módulo de alto nível

Módulo de alto nível representa regra importante do sistema.

Exemplos:

```text
FaturarPedidoUseCase;
ReagendarOrdemServicoUseCase;
CriarContratoUseCase;
ImportarProdutosUseCase;
ProcessarPagamentoUseCase.
```

Ele expressa o fluxo de negócio.

---

## Módulo de baixo nível

Módulo de baixo nível representa detalhe técnico.

Exemplos:

```text
PostgresPedidoRepository;
ArquivoPedidoRepository;
EmailSmtpNotificador;
WhatsAppClient;
OraclePagamentoGateway;
CsvArquivoGateway;
HttpCepClient.
```

Ele sabe como fazer algo tecnicamente.

---

## Problema

Se o alto nível depende diretamente do baixo nível, a regra fica presa no detalhe.

Exemplo:

```text
FaturarPedidoService depende de EmailSmtpNotificador.
```

Se amanhã trocar e-mail por WhatsApp, mexe no service.

Se quiser testar sem enviar e-mail, fica difícil.

Se quiser trocar Postgres por memória no teste, fica difícil.

DIP resolve isso.

---

# Parte 2 — Exemplo ruim com dependência concreta

## Pedido

Crie:

```text
src\br\com\curso\aula220\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula220.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class Pedido {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final Instant criadoEm;
    private boolean pago;
    private boolean faturado;

    public Pedido(UUID id, String codigo, String cliente, BigDecimal valor, Instant criadoEm, boolean pago) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        this.id = id;
        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
        this.criadoEm = criadoEm;
        this.pago = pago;
        this.faturado = false;
    }

    public UUID id() {
        return id;
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public BigDecimal valor() {
        return valor;
    }

    public Instant criadoEm() {
        return criadoEm;
    }

    public boolean pago() {
        return pago;
    }

    public boolean faturado() {
        return faturado;
    }

    public void faturar() {
        if (!pago) {
            throw new IllegalStateException("Pedido não pago não pode ser faturado: " + codigo);
        }

        if (faturado) {
            throw new IllegalStateException("Pedido já faturado: " + codigo);
        }

        faturado = true;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
                + " | Pago: " + pago
                + " | Faturado: " + faturado;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## PedidoRepositoryMemoriaRuim

Crie:

```text
src\br\com\curso\aula220\ruim\PedidoRepositoryMemoriaRuim.java
```

Código:

```java
package br.com.curso.aula220.ruim;

import br.com.curso.aula220.dominio.pedido.Pedido;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PedidoRepositoryMemoriaRuim {
    private final List<Pedido> pedidos = new ArrayList<>();

    public void salvar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedidos.removeIf(item -> item.codigo().equals(pedido.codigo()));
        pedidos.add(pedido);

        System.out.println("[MEMORIA] Pedido salvo: " + pedido.codigo());
    }

    public Optional<Pedido> buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        return pedidos.stream()
                .filter(pedido -> pedido.codigo().equals(normalizado))
                .findFirst();
    }
}
```

---

## EmailNotificadorRuim

Crie:

```text
src\br\com\curso\aula220\ruim\EmailNotificadorRuim.java
```

Código:

```java
package br.com.curso.aula220.ruim;

import br.com.curso.aula220.dominio.pedido.Pedido;

public class EmailNotificadorRuim {
    public void enviarPedidoFaturado(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        System.out.println("[EMAIL] Pedido faturado para " + pedido.cliente() + ": " + pedido.codigo());
    }
}
```

---

## AuditoriaConsoleRuim

Crie:

```text
src\br\com\curso\aula220\ruim\AuditoriaConsoleRuim.java
```

Código:

```java
package br.com.curso.aula220.ruim;

import java.time.Instant;

public class AuditoriaConsoleRuim {
    public void registrar(String evento, Instant agora) {
        if (evento == null || evento.isBlank()) {
            throw new IllegalArgumentException("Evento é obrigatório.");
        }

        if (agora == null) {
            throw new IllegalArgumentException("Instante é obrigatório.");
        }

        System.out.println("[AUDITORIA] " + evento + " | " + agora);
    }
}
```

---

## PedidoFaturamentoServiceRuim

Crie:

```text
src\br\com\curso\aula220\ruim\PedidoFaturamentoServiceRuim.java
```

Código:

```java
package br.com.curso.aula220.ruim;

import br.com.curso.aula220.dominio.pedido.Pedido;

import java.time.Instant;

public class PedidoFaturamentoServiceRuim {
    private final PedidoRepositoryMemoriaRuim repository = new PedidoRepositoryMemoriaRuim();
    private final EmailNotificadorRuim notificador = new EmailNotificadorRuim();
    private final AuditoriaConsoleRuim auditoria = new AuditoriaConsoleRuim();

    public void cadastrar(Pedido pedido) {
        repository.salvar(pedido);
    }

    public Pedido faturar(String codigoPedido, Instant agora) {
        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        Pedido pedido = repository.buscarPorCodigo(codigoPedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + codigoPedido));

        pedido.faturar();

        repository.salvar(pedido);
        notificador.enviarPedidoFaturado(pedido);
        auditoria.registrar("Pedido faturado: " + pedido.codigo(), agora);

        return pedido;
    }
}
```

---

## PedidoFaturamentoRuimApp

Crie:

```text
src\br\com\curso\aula220\app\PedidoFaturamentoRuimApp.java
```

Código:

```java
package br.com.curso.aula220.app;

import br.com.curso.aula220.dominio.pedido.Pedido;
import br.com.curso.aula220.ruim.PedidoFaturamentoServiceRuim;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoFaturamentoRuimApp {
    public static void main(String[] args) {
        PedidoFaturamentoServiceRuim service = new PedidoFaturamentoServiceRuim();

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana",
                new BigDecimal("1500.00"),
                Instant.now(),
                true
        );

        service.cadastrar(pedido);

        Pedido faturado = service.faturar("PED-001", Instant.now());

        System.out.println(faturado.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula220.app.PedidoFaturamentoRuimApp
```

---

## Diagnóstico da versão ruim

O service depende diretamente de:

```text
PedidoRepositoryMemoriaRuim;
EmailNotificadorRuim;
AuditoriaConsoleRuim.
```

Problemas:

```text
não consigo trocar repository sem alterar o service;
não consigo trocar e-mail por WhatsApp sem alterar o service;
não consigo testar sem notificação real;
não consigo simular auditoria facilmente;
o service cria suas próprias dependências com new;
o alto nível depende do baixo nível.
```

Isso viola DIP.

---

# Parte 3 — Criando portas da aplicação

Agora vamos inverter a dependência.

A aplicação define contratos.

Infraestrutura implementa contratos.

---

## PedidoRepository

Crie:

```text
src\br\com\curso\aula220\aplicacao\port\PedidoRepository.java
```

Código:

```java
package br.com.curso.aula220.aplicacao.port;

import br.com.curso.aula220.dominio.pedido.Pedido;

import java.util.Optional;

public interface PedidoRepository {
    void salvar(Pedido pedido);

    Optional<Pedido> buscarPorCodigo(String codigo);
}
```

---

## PedidoNotificador

Crie:

```text
src\br\com\curso\aula220\aplicacao\port\PedidoNotificador.java
```

Código:

```java
package br.com.curso.aula220.aplicacao.port;

import br.com.curso.aula220.dominio.pedido.Pedido;

public interface PedidoNotificador {
    void notificarPedidoFaturado(Pedido pedido);
}
```

---

## AuditoriaGateway

Crie:

```text
src\br\com\curso\aula220\aplicacao\port\AuditoriaGateway.java
```

Código:

```java
package br.com.curso.aula220.aplicacao.port;

import java.time.Instant;

public interface AuditoriaGateway {
    void registrar(String evento, Instant ocorridoEm);
}
```

---

## O que essas interfaces representam

Elas são portas da aplicação.

```text
PedidoRepository:
porta para persistência de pedido.

PedidoNotificador:
porta para notificação de pedido.

AuditoriaGateway:
porta para auditoria.
```

A aplicação precisa dessas capacidades.

Mas não precisa saber como elas são implementadas.

---

# Parte 4 — Service seguindo DIP

## PedidoFaturamentoService

Crie:

```text
src\br\com\curso\aula220\aplicacao\service\PedidoFaturamentoService.java
```

Código:

```java
package br.com.curso.aula220.aplicacao.service;

import br.com.curso.aula220.aplicacao.port.AuditoriaGateway;
import br.com.curso.aula220.aplicacao.port.PedidoNotificador;
import br.com.curso.aula220.aplicacao.port.PedidoRepository;
import br.com.curso.aula220.dominio.pedido.Pedido;

import java.time.Instant;

public class PedidoFaturamentoService {
    private final PedidoRepository repository;
    private final PedidoNotificador notificador;
    private final AuditoriaGateway auditoriaGateway;

    public PedidoFaturamentoService(
            PedidoRepository repository,
            PedidoNotificador notificador,
            AuditoriaGateway auditoriaGateway
    ) {
        if (repository == null) {
            throw new IllegalArgumentException("Repository é obrigatório.");
        }

        if (notificador == null) {
            throw new IllegalArgumentException("Notificador é obrigatório.");
        }

        if (auditoriaGateway == null) {
            throw new IllegalArgumentException("AuditoriaGateway é obrigatório.");
        }

        this.repository = repository;
        this.notificador = notificador;
        this.auditoriaGateway = auditoriaGateway;
    }

    public Pedido faturar(String codigoPedido, Instant agora) {
        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        Pedido pedido = repository.buscarPorCodigo(codigoPedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + codigoPedido));

        pedido.faturar();

        repository.salvar(pedido);
        notificador.notificarPedidoFaturado(pedido);
        auditoriaGateway.registrar("Pedido faturado: " + pedido.codigo(), agora);

        return pedido;
    }
}
```

---

## O que mudou

Agora o service depende de:

```text
PedidoRepository;
PedidoNotificador;
AuditoriaGateway.
```

Ele não depende de:

```text
memória;
Postgres;
SMTP;
console;
arquivo;
API externa.
```

Ele depende de contratos.

Isso é DIP.

---

# Parte 5 — Implementações de infraestrutura

## PedidoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula220\infra\repository\PedidoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula220.infra.repository;

import br.com.curso.aula220.aplicacao.port.PedidoRepository;
import br.com.curso.aula220.dominio.pedido.Pedido;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PedidoRepositoryMemoria implements PedidoRepository {
    private final List<Pedido> pedidos = new ArrayList<>();

    @Override
    public void salvar(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedidos.removeIf(item -> item.codigo().equals(pedido.codigo()));
        pedidos.add(pedido);

        System.out.println("[MEMORIA] Pedido salvo: " + pedido.codigo());
    }

    @Override
    public Optional<Pedido> buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        return pedidos.stream()
                .filter(pedido -> pedido.codigo().equals(normalizado))
                .findFirst();
    }
}
```

---

## EmailPedidoNotificador

Crie:

```text
src\br\com\curso\aula220\infra\notificacao\EmailPedidoNotificador.java
```

Código:

```java
package br.com.curso.aula220.infra.notificacao;

import br.com.curso.aula220.aplicacao.port.PedidoNotificador;
import br.com.curso.aula220.dominio.pedido.Pedido;

public class EmailPedidoNotificador implements PedidoNotificador {
    @Override
    public void notificarPedidoFaturado(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        System.out.println("[EMAIL] Pedido faturado para " + pedido.cliente() + ": " + pedido.codigo());
    }
}
```

---

## WhatsAppPedidoNotificador

Crie:

```text
src\br\com\curso\aula220\infra\notificacao\WhatsAppPedidoNotificador.java
```

Código:

```java
package br.com.curso.aula220.infra.notificacao;

import br.com.curso.aula220.aplicacao.port.PedidoNotificador;
import br.com.curso.aula220.dominio.pedido.Pedido;

public class WhatsAppPedidoNotificador implements PedidoNotificador {
    @Override
    public void notificarPedidoFaturado(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        System.out.println("[WHATSAPP] Pedido faturado para " + pedido.cliente() + ": " + pedido.codigo());
    }
}
```

---

## AuditoriaConsoleGateway

Crie:

```text
src\br\com\curso\aula220\infra\auditoria\AuditoriaConsoleGateway.java
```

Código:

```java
package br.com.curso.aula220.infra.auditoria;

import br.com.curso.aula220.aplicacao.port.AuditoriaGateway;

import java.time.Instant;

public class AuditoriaConsoleGateway implements AuditoriaGateway {
    @Override
    public void registrar(String evento, Instant ocorridoEm) {
        if (evento == null || evento.isBlank()) {
            throw new IllegalArgumentException("Evento é obrigatório.");
        }

        if (ocorridoEm == null) {
            throw new IllegalArgumentException("Instante é obrigatório.");
        }

        System.out.println("[AUDITORIA] " + evento + " | " + ocorridoEm);
    }
}
```

---

# Parte 6 — App montando dependências manualmente

## PedidoFaturamentoDipApp

Crie:

```text
src\br\com\curso\aula220\app\PedidoFaturamentoDipApp.java
```

Código:

```java
package br.com.curso.aula220.app;

import br.com.curso.aula220.aplicacao.port.AuditoriaGateway;
import br.com.curso.aula220.aplicacao.port.PedidoNotificador;
import br.com.curso.aula220.aplicacao.port.PedidoRepository;
import br.com.curso.aula220.aplicacao.service.PedidoFaturamentoService;
import br.com.curso.aula220.dominio.pedido.Pedido;
import br.com.curso.aula220.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula220.infra.notificacao.EmailPedidoNotificador;
import br.com.curso.aula220.infra.repository.PedidoRepositoryMemoria;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoFaturamentoDipApp {
    public static void main(String[] args) {
        PedidoRepository repository = new PedidoRepositoryMemoria();
        PedidoNotificador notificador = new EmailPedidoNotificador();
        AuditoriaGateway auditoriaGateway = new AuditoriaConsoleGateway();

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-001",
                "Ana",
                new BigDecimal("1500.00"),
                Instant.now(),
                true
        );

        repository.salvar(pedido);

        PedidoFaturamentoService service = new PedidoFaturamentoService(
                repository,
                notificador,
                auditoriaGateway
        );

        Pedido faturado = service.faturar("PED-001", Instant.now());

        System.out.println(faturado.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula220.app.PedidoFaturamentoDipApp
```

---

## O que aconteceu

O app montou as dependências.

O service recebeu dependências prontas pelo construtor.

Isso se chama:

```text
injeção de dependência por construtor.
```

Em Java puro, fazemos manualmente.

Futuramente, com Spring, o framework fará isso.

Mas o princípio é o mesmo.

---

# Parte 7 — Trocando implementação sem alterar o service

## PedidoFaturamentoWhatsAppApp

Crie:

```text
src\br\com\curso\aula220\app\PedidoFaturamentoWhatsAppApp.java
```

Código:

```java
package br.com.curso.aula220.app;

import br.com.curso.aula220.aplicacao.port.AuditoriaGateway;
import br.com.curso.aula220.aplicacao.port.PedidoNotificador;
import br.com.curso.aula220.aplicacao.port.PedidoRepository;
import br.com.curso.aula220.aplicacao.service.PedidoFaturamentoService;
import br.com.curso.aula220.dominio.pedido.Pedido;
import br.com.curso.aula220.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula220.infra.notificacao.WhatsAppPedidoNotificador;
import br.com.curso.aula220.infra.repository.PedidoRepositoryMemoria;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoFaturamentoWhatsAppApp {
    public static void main(String[] args) {
        PedidoRepository repository = new PedidoRepositoryMemoria();
        PedidoNotificador notificador = new WhatsAppPedidoNotificador();
        AuditoriaGateway auditoriaGateway = new AuditoriaConsoleGateway();

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-002",
                "Carlos",
                new BigDecimal("900.00"),
                Instant.now(),
                true
        );

        repository.salvar(pedido);

        PedidoFaturamentoService service = new PedidoFaturamentoService(
                repository,
                notificador,
                auditoriaGateway
        );

        Pedido faturado = service.faturar("PED-002", Instant.now());

        System.out.println(faturado.resumo());
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula220.app.PedidoFaturamentoWhatsAppApp
```

---

## O que observar

Mudamos:

```text
EmailPedidoNotificador
```

para:

```text
WhatsAppPedidoNotificador
```

Sem alterar:

```text
PedidoFaturamentoService.
```

Isso é DIP na prática.

---

# Parte 8 — Teste com implementação fake

Ainda não estamos no módulo formal de testes automatizados.

Mas DIP já mostra seu valor para teste.

Podemos criar implementações fake.

---

## PedidoNotificadorFake

Crie:

```text
src\br\com\curso\aula220\teste\PedidoNotificadorFake.java
```

Código:

```java
package br.com.curso.aula220.teste;

import br.com.curso.aula220.aplicacao.port.PedidoNotificador;
import br.com.curso.aula220.dominio.pedido.Pedido;

import java.util.ArrayList;
import java.util.List;

public class PedidoNotificadorFake implements PedidoNotificador {
    private final List<String> pedidosNotificados = new ArrayList<>();

    @Override
    public void notificarPedidoFaturado(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        pedidosNotificados.add(pedido.codigo());
    }

    public boolean foiNotificado(String codigoPedido) {
        return pedidosNotificados.contains(codigoPedido);
    }

    public List<String> pedidosNotificados() {
        return List.copyOf(pedidosNotificados);
    }
}
```

---

## AuditoriaFakeGateway

Crie:

```text
src\br\com\curso\aula220\teste\AuditoriaFakeGateway.java
```

Código:

```java
package br.com.curso.aula220.teste;

import br.com.curso.aula220.aplicacao.port.AuditoriaGateway;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class AuditoriaFakeGateway implements AuditoriaGateway {
    private final List<String> eventos = new ArrayList<>();

    @Override
    public void registrar(String evento, Instant ocorridoEm) {
        if (evento == null || evento.isBlank()) {
            throw new IllegalArgumentException("Evento é obrigatório.");
        }

        if (ocorridoEm == null) {
            throw new IllegalArgumentException("Instante é obrigatório.");
        }

        eventos.add(evento + " | " + ocorridoEm);
    }

    public List<String> eventos() {
        return List.copyOf(eventos);
    }
}
```

---

## PedidoFaturamentoFakeTestApp

Crie:

```text
src\br\com\curso\aula220\app\PedidoFaturamentoFakeTestApp.java
```

Código:

```java
package br.com.curso.aula220.app;

import br.com.curso.aula220.aplicacao.service.PedidoFaturamentoService;
import br.com.curso.aula220.dominio.pedido.Pedido;
import br.com.curso.aula220.infra.repository.PedidoRepositoryMemoria;
import br.com.curso.aula220.teste.AuditoriaFakeGateway;
import br.com.curso.aula220.teste.PedidoNotificadorFake;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoFaturamentoFakeTestApp {
    public static void main(String[] args) {
        PedidoRepositoryMemoria repository = new PedidoRepositoryMemoria();
        PedidoNotificadorFake notificadorFake = new PedidoNotificadorFake();
        AuditoriaFakeGateway auditoriaFake = new AuditoriaFakeGateway();

        Pedido pedido = new Pedido(
                UUID.randomUUID(),
                "PED-003",
                "Maria",
                new BigDecimal("1200.00"),
                Instant.now(),
                true
        );

        repository.salvar(pedido);

        PedidoFaturamentoService service = new PedidoFaturamentoService(
                repository,
                notificadorFake,
                auditoriaFake
        );

        service.faturar("PED-003", Instant.now());

        System.out.println("Pedido notificado? " + notificadorFake.foiNotificado("PED-003"));
        System.out.println("Eventos de auditoria: " + auditoriaFake.eventos());
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula220.app.PedidoFaturamentoFakeTestApp
```

---

## O que isso mostra

Com DIP, conseguimos testar sem:

```text
enviar e-mail real;
chamar API real;
usar banco real;
escrever arquivo real.
```

Basta passar implementações fake.

Esse é um dos maiores ganhos do DIP.

---

# Parte 9 — O que é injeção de dependência

Injeção de dependência significa:

```text
a classe não cria suas dependências;
ela recebe as dependências de fora.
```

Ruim:

```java
public class Service {
    private final Repository repository = new Repository();
}
```

Melhor:

```java
public class Service {
    private final Repository repository;

    public Service(Repository repository) {
        this.repository = repository;
    }
}
```

A classe fica mais flexível.

---

## Tipos comuns de injeção

## 1. Construtor

```java
public Service(Repository repository) {
    this.repository = repository;
}
```

É a forma preferida na maioria dos casos.

Vantagens:

```text
dependências obrigatórias ficam claras;
objeto nasce completo;
facilita teste;
evita estado incompleto.
```

---

## 2. Setter

```java
service.setRepository(repository);
```

Útil para dependência opcional em alguns cenários.

Mas pode deixar objeto incompleto.

---

## 3. Campo

Em frameworks, você pode ver:

```java
@Autowired
private Repository repository;
```

Mas em design moderno, construtor costuma ser melhor.

Quando estudarmos Spring, vamos reforçar isso.

---

# Parte 10 — DIP, portas e adapters

DIP está muito ligado a arquitetura hexagonal.

Termos:

```text
Port:
contrato que a aplicação precisa.

Adapter:
implementação concreta desse contrato.
```

Exemplo:

```text
Port:
PedidoRepository.

Adapter:
PedidoRepositoryPostgres.
PedidoRepositoryMemoria.
PedidoRepositoryArquivo.
```

Exemplo:

```text
Port:
PedidoNotificador.

Adapter:
EmailPedidoNotificador.
WhatsAppPedidoNotificador.
SmsPedidoNotificador.
```

O use case depende da porta.

A infraestrutura implementa adapter.

---

## Fluxo

```text
Controller/App
  monta dependências
  chama UseCase

UseCase
  depende de interfaces

Interfaces
  ficam próximas da aplicação

Infraestrutura
  implementa interfaces
```

Isso mantém regra protegida.

---

# Parte 11 — DIP e Spring

Ainda não estamos em Spring.

Mas quando chegarmos lá, isso vai aparecer assim:

```java
@Service
public class PedidoFaturamentoService {
    private final PedidoRepository repository;

    public PedidoFaturamentoService(PedidoRepository repository) {
        this.repository = repository;
    }
}
```

E uma implementação:

```java
@Repository
public class PedidoRepositoryJpa implements PedidoRepository {
}
```

O Spring monta tudo.

Mas o design vem antes do framework.

Se você entende DIP em Java puro, Spring fica muito mais claro.

---

## Spring não é DIP automaticamente

Usar `@Autowired` não significa que o design está bom.

Se você injeta implementação concreta demais, ainda pode estar acoplado.

Exemplo problemático:

```java
private final PedidoRepositoryJpa repository;
```

Melhor:

```java
private final PedidoRepository repository;
```

A ideia é depender do contrato.

---

# Parte 12 — DIP e camadas

## Domínio

Domínio não deve depender de infra.

Entidade não deve conhecer:

```text
repository;
client;
gateway;
controller;
arquivo;
HTTP;
banco.
```

---

## Aplicação

Aplicação coordena fluxo e define contratos necessários.

Exemplo:

```text
PedidoRepository;
PagamentoGateway;
AuditoriaGateway;
PedidoNotificador.
```

---

## Infraestrutura

Infraestrutura implementa contratos.

Exemplo:

```text
PedidoRepositoryPostgres implements PedidoRepository;
PagamentoApiClient implements PagamentoGateway;
AuditoriaArquivoGateway implements AuditoriaGateway.
```

---

## App/Controller

Nesta fase, App monta manualmente.

Futuramente, Controller recebe request e Spring injeta o use case.

---

# Parte 13 — DIP e Repository

## Sem DIP

```java
public class CriarPedidoService {
    private final PedidoRepositoryPostgres repository = new PedidoRepositoryPostgres();
}
```

Problemas:

```text
service preso ao Postgres;
difícil testar;
difícil trocar para Mongo;
difícil usar memória em teste.
```

---

## Com DIP

```java
public class CriarPedidoService {
    private final PedidoRepository repository;

    public CriarPedidoService(PedidoRepository repository) {
        this.repository = repository;
    }
}
```

Agora você pode usar:

```text
PedidoRepositoryPostgres;
PedidoRepositoryMemoria;
PedidoRepositoryFake;
PedidoRepositoryArquivo.
```

---

# Parte 14 — DIP e Client/Gateway

## Sem DIP

```java
public class PagamentoService {
    private final MercadoPagoClient client = new MercadoPagoClient();
}
```

Problemas:

```text
service preso ao Mercado Pago;
difícil trocar provedor;
difícil testar sem chamar API real;
falhas externas invadem regra.
```

---

## Com DIP

```java
public interface PagamentoGateway {
    PagamentoResultado pagar(PagamentoRequest request);
}
```

Implementações:

```text
MercadoPagoGateway;
StripeGateway;
PixBancoGateway;
PagamentoFakeGateway.
```

Service depende de:

```text
PagamentoGateway
```

---

# Parte 15 — DIP e OCP

DIP ajuda OCP.

Porque quando o service depende de interface, você pode adicionar nova implementação.

Exemplo:

```text
PedidoNotificador:
EmailPedidoNotificador;
WhatsAppPedidoNotificador;
SmsPedidoNotificador.
```

O service continua igual.

Isso é:

```text
OCP + DIP trabalhando juntos.
```

---

# Parte 16 — DIP e ISP

DIP precisa de boas abstrações.

ISP ajuda a criar abstrações menores.

Ruim:

```java
public interface SistemaGatewayCompleto {
    void salvarPedido();
    void enviarEmail();
    void processarPagamento();
    void gerarRelatorio();
}
```

Melhor:

```text
PedidoRepository;
PedidoNotificador;
PagamentoGateway;
RelatorioExporter.
```

DIP sem ISP pode gerar interfaces gigantes.

---

# Parte 17 — DIP e LSP

Se o service depende de uma interface, as implementações precisam cumprir o contrato.

Isso é LSP.

Exemplo:

```text
PedidoRepository.buscarPorCodigo deve retornar Optional.
```

Implementação ruim:

```text
retorna null.
```

Isso quebra LSP e prejudica DIP.

---

# Parte 18 — Erros comuns ao aplicar DIP

## 1. Criar interface para tudo sem motivo

Não faça:

```text
PedidoServiceInterface;
ClienteServiceInterface;
ProdutoServiceInterface;
```

só porque sim.

Interface deve representar uma abstração útil.

---

## 2. Interface no lugar errado

Se a aplicação define o que precisa, a interface geralmente fica próxima da aplicação.

A infra implementa.

---

## 3. Service ainda criando dependência com new

Se o service faz:

```java
this.repository = new PedidoRepositoryMemoria();
```

ele continua acoplado.

---

## 4. Injetar implementação concreta

Menos flexível:

```java
public PedidoService(PedidoRepositoryMemoria repository)
```

Mais flexível:

```java
public PedidoService(PedidoRepository repository)
```

---

## 5. Abstração sem comportamento claro

Nome ruim:

```text
Executor;
Manager;
Processor;
Handler.
```

Nome melhor:

```text
PedidoRepository;
PagamentoGateway;
PedidoNotificador;
AuditoriaGateway.
```

---

# Parte 19 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula220.app.PedidoFaturamentoRuimApp
java -cp out br.com.curso.aula220.app.PedidoFaturamentoDipApp
java -cp out br.com.curso.aula220.app.PedidoFaturamentoWhatsAppApp
java -cp out br.com.curso.aula220.app.PedidoFaturamentoFakeTestApp
```

Depois responda:

```text
1. Quais dependências concretas existiam na versão ruim?
2. Quais portas foram criadas?
3. Qual classe representa o use case?
4. Quais classes são adapters de infraestrutura?
5. O service conhece EmailPedidoNotificador?
6. O service conhece WhatsAppPedidoNotificador?
7. Como trocamos e-mail por WhatsApp?
8. Como testamos sem enviar notificação real?
9. Qual dependência foi injetada pelo construtor?
10. Como isso prepara Spring?
```

---

# Parte 20 — Exercício prático

## Contexto

Você vai aplicar DIP em um fluxo de pagamento.

---

## Domínio

Crie:

```text
PagamentoRequest
```

Campos:

```text
String codigoPedido;
BigDecimal valor;
String cliente;
```

Crie:

```text
PagamentoResultado
```

Campos:

```text
boolean aprovado;
String mensagem;
String codigoAutorizacao;
```

---

## Portas

Crie:

```text
PagamentoGateway
```

Método:

```java
PagamentoResultado pagar(PagamentoRequest request);
```

Crie:

```text
PagamentoRepository
```

Métodos:

```java
void salvarResultado(String codigoPedido, PagamentoResultado resultado);
```

Crie:

```text
AuditoriaGateway
```

Método:

```java
void registrar(String evento, Instant ocorridoEm);
```

---

## Use case

Crie:

```text
ProcessarPagamentoService
```

Depende apenas de:

```text
PagamentoGateway;
PagamentoRepository;
AuditoriaGateway.
```

Método:

```java
PagamentoResultado processar(PagamentoRequest request, Instant agora)
```

Fluxo:

```text
validar request;
chamar gateway;
salvar resultado;
registrar auditoria;
retornar resultado.
```

---

## Infraestrutura

Crie implementações:

```text
PagamentoGatewayPixSimulado;
PagamentoGatewayCartaoSimulado;
PagamentoRepositoryMemoria;
AuditoriaConsoleGateway.
```

---

## Fake

Crie:

```text
PagamentoGatewayFakeAprovado;
AuditoriaFakeGateway.
```

App:

```text
PagamentoDipApp;
PagamentoDipFakeTestApp.
```

---

## Critérios

```text
service não pode usar new para gateway;
service não pode depender de Pix concreto;
service depende de interface;
infra implementa interface;
app monta dependências;
fake permite teste sem integração real.
```

---

# Parte 21 — Desafio extra

## Aplicar DIP na importação CSV do Módulo 8

Pegue um fluxo de importação CSV e identifique:

```text
ArquivoCsvGateway;
AuditoriaGateway;
Repository;
Notificador;
RelatorioExporter.
```

Crie interfaces para as dependências que variam.

Faça o service depender das interfaces.

Crie implementações:

```text
ArquivoCsvGatewayLocal;
AuditoriaConsoleGateway;
RelatorioCsvExporter;
RepositoryMemoria.
```

Objetivo:

```text
separar aplicação de infraestrutura.
```

---

# Parte 22 — Simulado rápido

## Questão 1

DIP significa:

```text
A) Módulos de alto nível não devem depender de módulos de baixo nível; ambos devem depender de abstrações.
B) Toda classe deve ter interface.
C) Toda dependência deve ser static.
D) Todo código deve ficar no controller.
```

---

## Questão 2

Qual exemplo viola DIP?

```text
A) Service depende de PedidoRepository.
B) Service recebe dependência pelo construtor.
C) Service cria new PedidoRepositoryPostgres dentro dele.
D) Infra implementa interface da aplicação.
```

---

## Questão 3

Injeção de dependência por construtor significa:

```text
A) A classe recebe suas dependências no construtor.
B) A classe cria tudo com new.
C) A classe não tem dependências.
D) A classe só usa static.
```

---

## Questão 4

Uma porta em arquitetura hexagonal é:

```text
A) Um contrato que a aplicação usa.
B) Uma tabela do banco.
C) Um campo private.
D) Uma exception.
```

---

## Questão 5

DIP ajuda testes porque:

```text
A) Permite trocar dependências reais por fakes/mocks.
B) Remove a necessidade de regra de negócio.
C) Obriga usar banco real.
D) Obriga usar API externa.
```

---

## Gabarito

```text
1. A
2. C
3. A
4. A
5. A
```

---

# Parte 23 — Checklist DIP

Marque mentalmente:

```text
[ ] Sei explicar DIP.
[ ] Sei diferenciar alto nível e baixo nível.
[ ] Sei identificar dependência concreta.
[ ] Sei criar interface de porta.
[ ] Sei criar adapter concreto.
[ ] Sei injetar dependência pelo construtor.
[ ] Sei evitar new dentro do service.
[ ] Sei trocar implementação sem alterar use case.
[ ] Sei criar fake para teste.
[ ] Sei relação entre DIP e OCP.
[ ] Sei relação entre DIP e ISP.
[ ] Sei relação entre DIP e LSP.
[ ] Sei como isso prepara Spring.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é DIP?
2. O que é módulo de alto nível?
3. O que é módulo de baixo nível?
4. Por que service não deve criar repository concreto?
5. O que é porta?
6. O que é adapter?
7. O que é injeção de dependência?
8. Por que construtor é uma boa forma de injeção?
9. Como DIP ajuda testes?
10. Como DIP prepara Spring Boot?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar DIP;
identificar service acoplado em implementação concreta;
criar portas de aplicação;
criar adapters de infraestrutura;
usar injeção por construtor;
trocar Email por WhatsApp sem alterar service;
usar fake para teste manual;
entender relação com OCP, ISP e LSP;
resolver exercício de pagamento;
entender por que Spring vai fazer mais sentido depois disso.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m9/aula-220-dip-dependency-inversion-principle
git commit -m "Aula 220: dip dependency inversion principle"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
o núcleo da aplicação deve depender de contratos, não de detalhes técnicos.
```

Você estudou:

```text
DIP;
alto nível;
baixo nível;
abstrações;
portas;
adapters;
repository;
notificador;
auditoria;
injeção por construtor;
fake para teste;
troca de implementação;
relação com Spring;
relação com arquitetura.
```

Também reforçou:

```text
A entidade decide.
O use case coordena usando contratos.
O repository concreto salva.
O client concreto integra.
O controller recebe e aciona.
```

Com esta aula, você fechou os cinco princípios do SOLID individualmente.

Na próxima aula, vamos fazer uma aula integradora:

```text
SOLID aplicado em um fluxo completo de backend.
```

Vamos juntar:

```text
SRP;
OCP;
LSP;
ISP;
DIP;
use case;
ports;
adapters;
repository;
gateway;
notificação;
auditoria;
DTO;
app.
```
