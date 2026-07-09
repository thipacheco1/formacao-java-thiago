# 228 — M10.06 — Facade Pattern: simplificando fluxos complexos no backend

## Objetivo da aula

Na aula anterior, você estudou:

```text
Adapter Pattern
```

Você viu que Adapter protege o núcleo da aplicação contra detalhes externos, como:

```text
APIs de pagamento;
serviços de CEP;
mensageria;
legados;
clients externos;
payloads externos;
responses externos;
status externos;
exceptions externas.
```

Agora vamos estudar:

```text
Facade Pattern
```

Em português:

```text
Padrão Fachada
```

Facade é muito usado quando existe um fluxo complexo que envolve vários serviços, gateways, repositories e validações, mas você quer oferecer uma interface mais simples para quem consome esse fluxo.

No backend, isso aparece muito em:

```text
checkout;
abertura de OS;
processamento de pagamento;
importação de arquivo;
geração de relatório;
orquestração de integrações;
cadastro completo;
simulação de cotação;
processamento de pedido;
consulta consolidada;
jornada digital;
sincronização com legado.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema que Facade resolve;
identificar fluxos complexos com muitos serviços;
criar uma fachada para simplificar uso;
diferenciar Facade de Use Case;
diferenciar Facade de Adapter;
diferenciar Facade de Service;
evitar fachada virando classe Deus;
organizar um fluxo de checkout;
organizar um fluxo de abertura de OS;
entender quando Facade ajuda e quando atrapalha;
aplicar SRP, DIP e ISP usando Facade;
preparar base para serviços de aplicação mais complexos.
```

---

## Ideia principal

Facade oferece uma interface simples para um conjunto de operações mais complexas.

Exemplo:

Sem facade, o App ou Controller futuro teria que fazer:

```java
estoqueService.reservar(...);
freteService.calcular(...);
pagamentoService.pagar(...);
pedidoRepository.salvar(...);
auditoriaGateway.registrar(...);
notificador.enviar(...);
```

Com Facade:

```java
checkoutFacade.finalizarCompra(request);
```

A complexidade continua existindo.

Mas fica escondida atrás de uma interface mais simples.

---

## Facade em uma frase prática

```text
Facade simplifica o uso de um subsistema complexo.
```

Ou:

```text
Facade oferece uma entrada simples para uma operação que envolve várias partes.
```

---

## Facade não é bagunça organizada

Um erro comum é criar uma Facade e colocar tudo dentro dela.

Isso é errado.

Facade deve coordenar ou simplificar acesso.

Ela não deve virar:

```text
classe Deus;
service gigante;
lugar de regra de negócio sem dono;
atalho para jogar tudo em uma classe.
```

A fachada deve usar classes menores que já têm responsabilidades claras.

---

## Relação com a frase arquitetural

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Com Facade:

```text
A facade simplifica a chamada de um conjunto de use cases ou serviços.
A entidade continua decidindo regra.
O use case continua coordenando regra de aplicação.
O repository continua salvando.
O client continua integrando.
O controller futuro chama uma entrada simples.
```

---

## Relação com SOLID

## SRP

Facade deve ter uma responsabilidade clara:

```text
orquestrar um fluxo de alto nível;
simplificar um subsistema;
expor uma entrada mais simples.
```

Se a Facade faz regra de desconto, pagamento, estoque, auditoria, notificação e persistência diretamente, ela pode estar violando SRP.

---

## OCP

Você pode trocar serviços internos ou adicionar passos ao fluxo sem alterar quem chama a facade.

Mas cuidado: se toda mudança vira alteração na facade, talvez falte separação interna.

---

## LSP

Se a Facade implementa uma interface, ela deve cumprir o contrato esperado.

---

## ISP

A interface da Facade deve ser pequena e orientada ao caso de uso.

Exemplo bom:

```java
CheckoutResultado finalizarCompra(CheckoutRequest request);
```

Exemplo ruim:

```java
SistemaFacade {
    criarPedido();
    pagar();
    enviarEmail();
    importarArquivo();
    consultarCep();
    gerarRelatorio();
}
```

---

## DIP

Facade deve depender de abstrações quando possível.

Exemplo:

```text
PagamentoGateway;
EstoqueGateway;
PedidoRepository;
AuditoriaGateway;
ClienteNotificador.
```

E não diretamente de detalhes externos.

---

# Parte 1 — Facade vs Adapter

## Adapter

Adapter resolve incompatibilidade entre contratos.

Exemplo:

```text
Minha aplicação quer PagamentoGateway.
API externa oferece ExternalPaymentClient.
Adapter traduz um contrato no outro.
```

---

## Facade

Facade simplifica um conjunto de operações.

Exemplo:

```text
CheckoutFacade chama estoque, frete, pagamento, pedido, auditoria e notificação.
```

---

## Diferença prática

```text
Adapter:
tradução entre dentro e fora.

Facade:
simplificação de um fluxo ou subsistema.
```

Os dois podem trabalhar juntos.

Exemplo:

```text
CheckoutFacade usa PagamentoGateway.
PagamentoGateway é implementado por MercadoPagoAdapter.
```

---

# Parte 2 — Facade vs Use Case

Essa diferença é importante.

## Use Case

Representa um caso de uso da aplicação.

Exemplo:

```text
CriarPedidoUseCase;
ProcessarPagamentoUseCase;
ReservarEstoqueUseCase;
EnviarConfirmacaoUseCase.
```

Ele coordena uma ação de aplicação com regra clara.

---

## Facade

Pode simplificar o uso de vários use cases ou serviços.

Exemplo:

```text
CheckoutFacade:
cria pedido;
reserva estoque;
calcula frete;
processa pagamento;
envia confirmação.
```

---

## Quando eles se confundem

Em aplicações pequenas, um use case pode parecer uma facade.

Exemplo:

```text
FinalizarCompraUseCase
```

pode coordenar tudo.

Isso não é necessariamente errado.

A distinção aparece mais quando o fluxo fica grande e composto por vários subsistemas.

---

## Regra prática

Se é um fluxo de negócio único e bem definido:

```text
UseCase pode ser suficiente.
```

Se você quer simplificar acesso a vários serviços/subsistemas:

```text
Facade pode ajudar.
```

---

# Parte 3 — Estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m10\aula-228-facade-pattern-simplificando-fluxos-complexos-backend
cd labs\m10\aula-228-facade-pattern-simplificando-fluxos-complexos-backend
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula228

mkdir src\br\com\curso\aula228\app

mkdir src\br\com\curso\aula228\dominio
mkdir src\br\com\curso\aula228\dominio\checkout
mkdir src\br\com\curso\aula228\dominio\pedido

mkdir src\br\com\curso\aula228\aplicacao
mkdir src\br\com\curso\aula228\aplicacao\dto
mkdir src\br\com\curso\aula228\aplicacao\facade
mkdir src\br\com\curso\aula228\aplicacao\port
mkdir src\br\com\curso\aula228\aplicacao\service

mkdir src\br\com\curso\aula228\infra
mkdir src\br\com\curso\aula228\infra\auditoria
mkdir src\br\com\curso\aula228\infra\estoque
mkdir src\br\com\curso\aula228\infra\frete
mkdir src\br\com\curso\aula228\infra\notificacao
mkdir src\br\com\curso\aula228\infra\pagamento
mkdir src\br\com\curso\aula228\infra\repository

mkdir src\br\com\curso\aula228\teste
```

---

# Parte 4 — Cenário: checkout

Vamos criar um fluxo de checkout.

O processo completo envolve:

```text
validar request;
calcular frete;
reservar estoque;
processar pagamento;
criar pedido;
salvar pedido;
registrar auditoria;
notificar cliente;
retornar resultado.
```

Sem organização, o Controller ou App ficaria cheio de chamadas.

Com Facade, vamos simplificar:

```java
CheckoutResultado resultado = checkoutFacade.finalizarCompra(request);
```

---

# Parte 5 — DTOs do checkout

## CheckoutRequest

Crie:

```text
src\br\com\curso\aula228\aplicacao\dto\CheckoutRequest.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.dto;

import java.math.BigDecimal;

public record CheckoutRequest(
        String cliente,
        String telefone,
        String produto,
        int quantidade,
        BigDecimal valorUnitario,
        String cep,
        String formaPagamento
) {
}
```

---

## CheckoutResultado

Crie:

```text
src\br\com\curso\aula228\aplicacao\dto\CheckoutResultado.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.dto;

public record CheckoutResultado(
        String codigoPedido,
        boolean pagamentoAprovado,
        String statusPedido,
        String mensagem
) {
}
```

---

# Parte 6 — Domínio do pedido

## StatusPedido

Crie:

```text
src\br\com\curso\aula228\dominio\pedido\StatusPedido.java
```

Código:

```java
package br.com.curso.aula228.dominio.pedido;

public enum StatusPedido {
    CRIADO,
    PAGO,
    CANCELADO
}
```

---

## Pedido

Crie:

```text
src\br\com\curso\aula228\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula228.dominio.pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.StringJoiner;
import java.util.UUID;

public class Pedido {
    private final UUID id;
    private final String codigo;
    private final String cliente;
    private final String telefone;
    private final String produto;
    private final int quantidade;
    private final BigDecimal valorProdutos;
    private final BigDecimal valorFrete;
    private final Instant criadoEm;
    private StatusPedido status;

    public Pedido(
            UUID id,
            String codigo,
            String cliente,
            String telefone,
            String produto,
            int quantidade,
            BigDecimal valorProdutos,
            BigDecimal valorFrete,
            Instant criadoEm
    ) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (telefone == null || telefone.isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        if (produto == null || produto.isBlank()) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (valorProdutos == null || valorProdutos.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor dos produtos deve ser maior que zero.");
        }

        if (valorFrete == null || valorFrete.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Frete não pode ser negativo.");
        }

        if (criadoEm == null) {
            throw new IllegalArgumentException("Data de criação é obrigatória.");
        }

        this.id = id;
        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.telefone = telefone.trim();
        this.produto = produto.trim();
        this.quantidade = quantidade;
        this.valorProdutos = valorProdutos;
        this.valorFrete = valorFrete;
        this.criadoEm = criadoEm;
        this.status = StatusPedido.CRIADO;
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

    public String telefone() {
        return telefone;
    }

    public String produto() {
        return produto;
    }

    public int quantidade() {
        return quantidade;
    }

    public BigDecimal valorProdutos() {
        return valorProdutos;
    }

    public BigDecimal valorFrete() {
        return valorFrete;
    }

    public BigDecimal valorTotal() {
        return valorProdutos.add(valorFrete);
    }

    public Instant criadoEm() {
        return criadoEm;
    }

    public StatusPedido status() {
        return status;
    }

    public void marcarComoPago() {
        if (status != StatusPedido.CRIADO) {
            throw new IllegalStateException("Somente pedido criado pode ser pago.");
        }

        status = StatusPedido.PAGO;
    }

    public void cancelar() {
        if (status == StatusPedido.PAGO) {
            throw new IllegalStateException("Pedido pago não pode ser cancelado diretamente.");
        }

        status = StatusPedido.CANCELADO;
    }

    public String resumo() {
        return new StringJoiner(" | ")
                .add(codigo)
                .add("Cliente: " + cliente)
                .add("Produto: " + produto)
                .add("Quantidade: " + quantidade)
                .add("Produtos: " + valorProdutos)
                .add("Frete: " + valorFrete)
                .add("Total: " + valorTotal())
                .add("Status: " + status)
                .toString();
    }
}
```

---

# Parte 7 — Ports da aplicação

## PedidoRepository

Crie:

```text
src\br\com\curso\aula228\aplicacao\port\PedidoRepository.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.port;

import br.com.curso.aula228.dominio.pedido.Pedido;

import java.util.Optional;

public interface PedidoRepository {
    void salvar(Pedido pedido);

    Optional<Pedido> buscarPorCodigo(String codigo);
}
```

---

## FreteGateway

Crie:

```text
src\br\com\curso\aula228\aplicacao\port\FreteGateway.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.port;

import java.math.BigDecimal;

public interface FreteGateway {
    BigDecimal calcularFrete(String cep, BigDecimal valorProdutos);
}
```

---

## EstoqueGateway

Crie:

```text
src\br\com\curso\aula228\aplicacao\port\EstoqueGateway.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.port;

public interface EstoqueGateway {
    void reservar(String produto, int quantidade);
}
```

---

## PagamentoGateway

Crie:

```text
src\br\com\curso\aula228\aplicacao\port\PagamentoGateway.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.port;

import java.math.BigDecimal;

public interface PagamentoGateway {
    boolean pagar(String codigoPedido, BigDecimal valorTotal, String formaPagamento);
}
```

---

## ClienteNotificador

Crie:

```text
src\br\com\curso\aula228\aplicacao\port\ClienteNotificador.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.port;

import br.com.curso.aula228.dominio.pedido.Pedido;

public interface ClienteNotificador {
    void notificarPedidoPago(Pedido pedido);
}
```

---

## AuditoriaGateway

Crie:

```text
src\br\com\curso\aula228\aplicacao\port\AuditoriaGateway.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.port;

import java.time.Instant;

public interface AuditoriaGateway {
    void registrar(String evento, String detalhes, Instant ocorridoEm);
}
```

---

## GeradorCodigoPedido

Crie:

```text
src\br\com\curso\aula228\aplicacao\port\GeradorCodigoPedido.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.port;

public interface GeradorCodigoPedido {
    String gerar();
}
```

---

# Parte 8 — Services internos

A Facade vai usar services pequenos.

Isso evita que ela vire classe Deus.

---

## CheckoutValidadorService

Crie:

```text
src\br\com\curso\aula228\aplicacao\service\CheckoutValidadorService.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.service;

import br.com.curso.aula228.aplicacao.dto.CheckoutRequest;

import java.math.BigDecimal;

public class CheckoutValidadorService {
    public void validar(CheckoutRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("CheckoutRequest é obrigatório.");
        }

        if (request.cliente() == null || request.cliente().isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (request.telefone() == null || request.telefone().isBlank()) {
            throw new IllegalArgumentException("Telefone é obrigatório.");
        }

        if (request.produto() == null || request.produto().isBlank()) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (request.quantidade() <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        if (request.valorUnitario() == null || request.valorUnitario().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor unitário deve ser maior que zero.");
        }

        if (request.cep() == null || request.cep().isBlank()) {
            throw new IllegalArgumentException("CEP é obrigatório.");
        }

        if (request.formaPagamento() == null || request.formaPagamento().isBlank()) {
            throw new IllegalArgumentException("Forma de pagamento é obrigatória.");
        }
    }
}
```

---

## PedidoFactoryService

Crie:

```text
src\br\com\curso\aula228\aplicacao\service\PedidoFactoryService.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.service;

import br.com.curso.aula228.aplicacao.dto.CheckoutRequest;
import br.com.curso.aula228.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class PedidoFactoryService {
    public Pedido criarPedido(
            CheckoutRequest request,
            String codigoPedido,
            BigDecimal valorProdutos,
            BigDecimal valorFrete,
            Instant agora
    ) {
        return new Pedido(
                UUID.randomUUID(),
                codigoPedido,
                request.cliente(),
                request.telefone(),
                request.produto(),
                request.quantidade(),
                valorProdutos,
                valorFrete,
                agora
        );
    }
}
```

---

## CheckoutValorService

Crie:

```text
src\br\com\curso\aula228\aplicacao\service\CheckoutValorService.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.service;

import br.com.curso.aula228.aplicacao.dto.CheckoutRequest;

import java.math.BigDecimal;

public class CheckoutValorService {
    public BigDecimal calcularValorProdutos(CheckoutRequest request) {
        return request.valorUnitario().multiply(BigDecimal.valueOf(request.quantidade()));
    }
}
```

---

# Parte 9 — Facade principal

## CheckoutFacade

Crie:

```text
src\br\com\curso\aula228\aplicacao\facade\CheckoutFacade.java
```

Código:

```java
package br.com.curso.aula228.aplicacao.facade;

import br.com.curso.aula228.aplicacao.dto.CheckoutRequest;
import br.com.curso.aula228.aplicacao.dto.CheckoutResultado;
import br.com.curso.aula228.aplicacao.port.AuditoriaGateway;
import br.com.curso.aula228.aplicacao.port.ClienteNotificador;
import br.com.curso.aula228.aplicacao.port.EstoqueGateway;
import br.com.curso.aula228.aplicacao.port.FreteGateway;
import br.com.curso.aula228.aplicacao.port.GeradorCodigoPedido;
import br.com.curso.aula228.aplicacao.port.PagamentoGateway;
import br.com.curso.aula228.aplicacao.port.PedidoRepository;
import br.com.curso.aula228.aplicacao.service.CheckoutValidadorService;
import br.com.curso.aula228.aplicacao.service.CheckoutValorService;
import br.com.curso.aula228.aplicacao.service.PedidoFactoryService;
import br.com.curso.aula228.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.Instant;

public class CheckoutFacade {
    private final CheckoutValidadorService validadorService;
    private final CheckoutValorService valorService;
    private final PedidoFactoryService pedidoFactoryService;
    private final FreteGateway freteGateway;
    private final EstoqueGateway estoqueGateway;
    private final PagamentoGateway pagamentoGateway;
    private final PedidoRepository pedidoRepository;
    private final ClienteNotificador clienteNotificador;
    private final AuditoriaGateway auditoriaGateway;
    private final GeradorCodigoPedido geradorCodigoPedido;

    public CheckoutFacade(
            CheckoutValidadorService validadorService,
            CheckoutValorService valorService,
            PedidoFactoryService pedidoFactoryService,
            FreteGateway freteGateway,
            EstoqueGateway estoqueGateway,
            PagamentoGateway pagamentoGateway,
            PedidoRepository pedidoRepository,
            ClienteNotificador clienteNotificador,
            AuditoriaGateway auditoriaGateway,
            GeradorCodigoPedido geradorCodigoPedido
    ) {
        this.validadorService = exigir(validadorService, "ValidadorService");
        this.valorService = exigir(valorService, "ValorService");
        this.pedidoFactoryService = exigir(pedidoFactoryService, "PedidoFactoryService");
        this.freteGateway = exigir(freteGateway, "FreteGateway");
        this.estoqueGateway = exigir(estoqueGateway, "EstoqueGateway");
        this.pagamentoGateway = exigir(pagamentoGateway, "PagamentoGateway");
        this.pedidoRepository = exigir(pedidoRepository, "PedidoRepository");
        this.clienteNotificador = exigir(clienteNotificador, "ClienteNotificador");
        this.auditoriaGateway = exigir(auditoriaGateway, "AuditoriaGateway");
        this.geradorCodigoPedido = exigir(geradorCodigoPedido, "GeradorCodigoPedido");
    }

    public CheckoutResultado finalizarCompra(CheckoutRequest request, Instant agora) {
        if (agora == null) {
            throw new IllegalArgumentException("Instante atual é obrigatório.");
        }

        validadorService.validar(request);

        BigDecimal valorProdutos = valorService.calcularValorProdutos(request);
        BigDecimal valorFrete = freteGateway.calcularFrete(request.cep(), valorProdutos);

        estoqueGateway.reservar(request.produto(), request.quantidade());

        Pedido pedido = pedidoFactoryService.criarPedido(
                request,
                geradorCodigoPedido.gerar(),
                valorProdutos,
                valorFrete,
                agora
        );

        boolean pagamentoAprovado = pagamentoGateway.pagar(
                pedido.codigo(),
                pedido.valorTotal(),
                request.formaPagamento()
        );

        if (!pagamentoAprovado) {
            auditoriaGateway.registrar(
                    "CHECKOUT_PAGAMENTO_RECUSADO",
                    "Pedido: " + pedido.codigo() + " | Valor: " + pedido.valorTotal(),
                    agora
            );

            return new CheckoutResultado(
                    pedido.codigo(),
                    false,
                    pedido.status().name(),
                    "Pagamento recusado."
            );
        }

        pedido.marcarComoPago();

        pedidoRepository.salvar(pedido);

        auditoriaGateway.registrar(
                "CHECKOUT_FINALIZADO",
                "Pedido pago: " + pedido.codigo() + " | Total: " + pedido.valorTotal(),
                agora
        );

        clienteNotificador.notificarPedidoPago(pedido);

        return new CheckoutResultado(
                pedido.codigo(),
                true,
                pedido.status().name(),
                "Compra finalizada com sucesso."
        );
    }

    private <T> T exigir(T valor, String nome) {
        if (valor == null) {
            throw new IllegalArgumentException(nome + " é obrigatório.");
        }

        return valor;
    }
}
```

---

## Análise da Facade

A Facade simplifica o fluxo para quem chama:

```java
checkoutFacade.finalizarCompra(request, agora)
```

Mas internamente ela usa componentes separados.

Isso é diferente de jogar toda lógica dentro da Facade.

---

# Parte 10 — Infraestrutura simulada

## PedidoRepositoryMemoria

Crie:

```text
src\br\com\curso\aula228\infra\repository\PedidoRepositoryMemoria.java
```

Código:

```java
package br.com.curso.aula228.infra.repository;

import br.com.curso.aula228.aplicacao.port.PedidoRepository;
import br.com.curso.aula228.dominio.pedido.Pedido;

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

        System.out.println("[REPOSITORY] Pedido salvo: " + pedido.codigo());
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

## FreteGatewaySimulado

Crie:

```text
src\br\com\curso\aula228\infra\frete\FreteGatewaySimulado.java
```

Código:

```java
package br.com.curso.aula228.infra.frete;

import br.com.curso.aula228.aplicacao.port.FreteGateway;

import java.math.BigDecimal;

public class FreteGatewaySimulado implements FreteGateway {
    @Override
    public BigDecimal calcularFrete(String cep, BigDecimal valorProdutos) {
        if (cep == null || cep.isBlank()) {
            throw new IllegalArgumentException("CEP é obrigatório.");
        }

        if (valorProdutos.compareTo(new BigDecimal("1000.00")) >= 0) {
            return BigDecimal.ZERO;
        }

        return new BigDecimal("30.00");
    }
}
```

---

## EstoqueGatewaySimulado

Crie:

```text
src\br\com\curso\aula228\infra\estoque\EstoqueGatewaySimulado.java
```

Código:

```java
package br.com.curso.aula228.infra.estoque;

import br.com.curso.aula228.aplicacao.port.EstoqueGateway;

public class EstoqueGatewaySimulado implements EstoqueGateway {
    @Override
    public void reservar(String produto, int quantidade) {
        if (produto == null || produto.isBlank()) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        System.out.println("[ESTOQUE] Reservado: " + produto + " | Quantidade: " + quantidade);
    }
}
```

---

## PagamentoGatewaySimulado

Crie:

```text
src\br\com\curso\aula228\infra\pagamento\PagamentoGatewaySimulado.java
```

Código:

```java
package br.com.curso.aula228.infra.pagamento;

import br.com.curso.aula228.aplicacao.port.PagamentoGateway;

import java.math.BigDecimal;

public class PagamentoGatewaySimulado implements PagamentoGateway {
    @Override
    public boolean pagar(String codigoPedido, BigDecimal valorTotal, String formaPagamento) {
        if (codigoPedido == null || codigoPedido.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        if (valorTotal == null || valorTotal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor total deve ser maior que zero.");
        }

        if (formaPagamento == null || formaPagamento.isBlank()) {
            throw new IllegalArgumentException("Forma de pagamento é obrigatória.");
        }

        System.out.println("[PAGAMENTO] Pedido: " + codigoPedido
                + " | Valor: " + valorTotal
                + " | Forma: " + formaPagamento);

        return !"RECUSADO".equals(formaPagamento.trim().toUpperCase());
    }
}
```

---

## ClienteNotificadorConsole

Crie:

```text
src\br\com\curso\aula228\infra\notificacao\ClienteNotificadorConsole.java
```

Código:

```java
package br.com.curso.aula228.infra.notificacao;

import br.com.curso.aula228.aplicacao.port.ClienteNotificador;
import br.com.curso.aula228.dominio.pedido.Pedido;

public class ClienteNotificadorConsole implements ClienteNotificador {
    @Override
    public void notificarPedidoPago(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        System.out.println("[NOTIFICACAO] Cliente " + pedido.cliente()
                + " informado sobre pagamento do pedido " + pedido.codigo());
    }
}
```

---

## AuditoriaConsoleGateway

Crie:

```text
src\br\com\curso\aula228\infra\auditoria\AuditoriaConsoleGateway.java
```

Código:

```java
package br.com.curso.aula228.infra.auditoria;

import br.com.curso.aula228.aplicacao.port.AuditoriaGateway;

import java.time.Instant;

public class AuditoriaConsoleGateway implements AuditoriaGateway {
    @Override
    public void registrar(String evento, String detalhes, Instant ocorridoEm) {
        System.out.println("[AUDITORIA] " + evento + " | " + detalhes + " | " + ocorridoEm);
    }
}
```

---

## GeradorCodigoPedidoMemoria

Crie:

```text
src\br\com\curso\aula228\infra\repository\GeradorCodigoPedidoMemoria.java
```

Código:

```java
package br.com.curso.aula228.infra.repository;

import br.com.curso.aula228.aplicacao.port.GeradorCodigoPedido;

import java.time.LocalDate;

public class GeradorCodigoPedidoMemoria implements GeradorCodigoPedido {
    private int sequencia = 0;

    @Override
    public String gerar() {
        sequencia++;

        return "PED-" + LocalDate.now().getYear() + "-" + "%06d".formatted(sequencia);
    }
}
```

---

# Parte 11 — App usando Facade

## CheckoutFacadeApp

Crie:

```text
src\br\com\curso\aula228\app\CheckoutFacadeApp.java
```

Código:

```java
package br.com.curso.aula228.app;

import br.com.curso.aula228.aplicacao.dto.CheckoutRequest;
import br.com.curso.aula228.aplicacao.dto.CheckoutResultado;
import br.com.curso.aula228.aplicacao.facade.CheckoutFacade;
import br.com.curso.aula228.aplicacao.service.CheckoutValidadorService;
import br.com.curso.aula228.aplicacao.service.CheckoutValorService;
import br.com.curso.aula228.aplicacao.service.PedidoFactoryService;
import br.com.curso.aula228.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula228.infra.estoque.EstoqueGatewaySimulado;
import br.com.curso.aula228.infra.frete.FreteGatewaySimulado;
import br.com.curso.aula228.infra.notificacao.ClienteNotificadorConsole;
import br.com.curso.aula228.infra.pagamento.PagamentoGatewaySimulado;
import br.com.curso.aula228.infra.repository.GeradorCodigoPedidoMemoria;
import br.com.curso.aula228.infra.repository.PedidoRepositoryMemoria;

import java.math.BigDecimal;
import java.time.Instant;

public class CheckoutFacadeApp {
    public static void main(String[] args) {
        CheckoutFacade checkoutFacade = new CheckoutFacade(
                new CheckoutValidadorService(),
                new CheckoutValorService(),
                new PedidoFactoryService(),
                new FreteGatewaySimulado(),
                new EstoqueGatewaySimulado(),
                new PagamentoGatewaySimulado(),
                new PedidoRepositoryMemoria(),
                new ClienteNotificadorConsole(),
                new AuditoriaConsoleGateway(),
                new GeradorCodigoPedidoMemoria()
        );

        CheckoutRequest request = new CheckoutRequest(
                "Ana Silva",
                "11999999999",
                "Notebook",
                1,
                new BigDecimal("3500.00"),
                "06454000",
                "CARTAO"
        );

        CheckoutResultado resultado = checkoutFacade.finalizarCompra(request, Instant.now());

        System.out.println();
        System.out.println(resultado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula228.app.CheckoutFacadeApp
```

---

## O que o App ganhou

Sem Facade, o App teria que chamar tudo manualmente.

Com Facade, ele faz:

```java
checkoutFacade.finalizarCompra(request, Instant.now());
```

A complexidade foi organizada.

---

# Parte 12 — Caso de pagamento recusado

## CheckoutPagamentoRecusadoApp

Crie:

```text
src\br\com\curso\aula228\app\CheckoutPagamentoRecusadoApp.java
```

Código:

```java
package br.com.curso.aula228.app;

import br.com.curso.aula228.aplicacao.dto.CheckoutRequest;
import br.com.curso.aula228.aplicacao.dto.CheckoutResultado;
import br.com.curso.aula228.aplicacao.facade.CheckoutFacade;
import br.com.curso.aula228.aplicacao.service.CheckoutValidadorService;
import br.com.curso.aula228.aplicacao.service.CheckoutValorService;
import br.com.curso.aula228.aplicacao.service.PedidoFactoryService;
import br.com.curso.aula228.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula228.infra.estoque.EstoqueGatewaySimulado;
import br.com.curso.aula228.infra.frete.FreteGatewaySimulado;
import br.com.curso.aula228.infra.notificacao.ClienteNotificadorConsole;
import br.com.curso.aula228.infra.pagamento.PagamentoGatewaySimulado;
import br.com.curso.aula228.infra.repository.GeradorCodigoPedidoMemoria;
import br.com.curso.aula228.infra.repository.PedidoRepositoryMemoria;

import java.math.BigDecimal;
import java.time.Instant;

public class CheckoutPagamentoRecusadoApp {
    public static void main(String[] args) {
        CheckoutFacade checkoutFacade = new CheckoutFacade(
                new CheckoutValidadorService(),
                new CheckoutValorService(),
                new PedidoFactoryService(),
                new FreteGatewaySimulado(),
                new EstoqueGatewaySimulado(),
                new PagamentoGatewaySimulado(),
                new PedidoRepositoryMemoria(),
                new ClienteNotificadorConsole(),
                new AuditoriaConsoleGateway(),
                new GeradorCodigoPedidoMemoria()
        );

        CheckoutRequest request = new CheckoutRequest(
                "Carlos Souza",
                "11888888888",
                "Mouse",
                2,
                new BigDecimal("80.00"),
                "06454000",
                "RECUSADO"
        );

        CheckoutResultado resultado = checkoutFacade.finalizarCompra(request, Instant.now());

        System.out.println(resultado);
    }
}
```

---

# Parte 13 — Factory para montar a Facade

A montagem da Facade ficou grande.

Podemos usar Factory para centralizar isso.

## CheckoutFacadeFactory

Crie:

```text
src\br\com\curso\aula228\app\CheckoutFacadeFactory.java
```

Código:

```java
package br.com.curso.aula228.app;

import br.com.curso.aula228.aplicacao.facade.CheckoutFacade;
import br.com.curso.aula228.aplicacao.service.CheckoutValidadorService;
import br.com.curso.aula228.aplicacao.service.CheckoutValorService;
import br.com.curso.aula228.aplicacao.service.PedidoFactoryService;
import br.com.curso.aula228.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula228.infra.estoque.EstoqueGatewaySimulado;
import br.com.curso.aula228.infra.frete.FreteGatewaySimulado;
import br.com.curso.aula228.infra.notificacao.ClienteNotificadorConsole;
import br.com.curso.aula228.infra.pagamento.PagamentoGatewaySimulado;
import br.com.curso.aula228.infra.repository.GeradorCodigoPedidoMemoria;
import br.com.curso.aula228.infra.repository.PedidoRepositoryMemoria;

public final class CheckoutFacadeFactory {
    private CheckoutFacadeFactory() {
    }

    public static CheckoutFacade criarPadrao() {
        return new CheckoutFacade(
                new CheckoutValidadorService(),
                new CheckoutValorService(),
                new PedidoFactoryService(),
                new FreteGatewaySimulado(),
                new EstoqueGatewaySimulado(),
                new PagamentoGatewaySimulado(),
                new PedidoRepositoryMemoria(),
                new ClienteNotificadorConsole(),
                new AuditoriaConsoleGateway(),
                new GeradorCodigoPedidoMemoria()
        );
    }
}
```

---

## CheckoutFacadeFactoryApp

Crie:

```text
src\br\com\curso\aula228\app\CheckoutFacadeFactoryApp.java
```

Código:

```java
package br.com.curso.aula228.app;

import br.com.curso.aula228.aplicacao.dto.CheckoutRequest;
import br.com.curso.aula228.aplicacao.dto.CheckoutResultado;
import br.com.curso.aula228.aplicacao.facade.CheckoutFacade;

import java.math.BigDecimal;
import java.time.Instant;

public class CheckoutFacadeFactoryApp {
    public static void main(String[] args) {
        CheckoutFacade checkoutFacade = CheckoutFacadeFactory.criarPadrao();

        CheckoutResultado resultado = checkoutFacade.finalizarCompra(
                new CheckoutRequest(
                        "Maria Oliveira",
                        "11777777777",
                        "Cadeira",
                        1,
                        new BigDecimal("450.00"),
                        "06454000",
                        "PIX"
                ),
                Instant.now()
        );

        System.out.println(resultado);
    }
}
```

---

## Padrões trabalhando juntos

Aqui você viu:

```text
Facade:
simplifica o fluxo de checkout.

Factory:
centraliza a criação da Facade.

Adapter:
poderia estar por trás dos gateways.

Strategy:
poderia estar por trás do cálculo de frete, desconto ou aprovação.
```

Padrões se combinam.

Mas cada um resolve um problema diferente.

---

# Parte 14 — Fake para teste

## PagamentoGatewayFakeRecusado

Crie:

```text
src\br\com\curso\aula228\teste\PagamentoGatewayFakeRecusado.java
```

Código:

```java
package br.com.curso.aula228.teste;

import br.com.curso.aula228.aplicacao.port.PagamentoGateway;

import java.math.BigDecimal;

public class PagamentoGatewayFakeRecusado implements PagamentoGateway {
    @Override
    public boolean pagar(String codigoPedido, BigDecimal valorTotal, String formaPagamento) {
        return false;
    }
}
```

---

## PagamentoGatewayFakeAprovado

Crie:

```text
src\br\com\curso\aula228\teste\PagamentoGatewayFakeAprovado.java
```

Código:

```java
package br.com.curso.aula228.teste;

import br.com.curso.aula228.aplicacao.port.PagamentoGateway;

import java.math.BigDecimal;

public class PagamentoGatewayFakeAprovado implements PagamentoGateway {
    @Override
    public boolean pagar(String codigoPedido, BigDecimal valorTotal, String formaPagamento) {
        return true;
    }
}
```

---

## CheckoutFacadeFakeTestApp

Crie:

```text
src\br\com\curso\aula228\app\CheckoutFacadeFakeTestApp.java
```

Código:

```java
package br.com.curso.aula228.app;

import br.com.curso.aula228.aplicacao.dto.CheckoutRequest;
import br.com.curso.aula228.aplicacao.dto.CheckoutResultado;
import br.com.curso.aula228.aplicacao.facade.CheckoutFacade;
import br.com.curso.aula228.aplicacao.service.CheckoutValidadorService;
import br.com.curso.aula228.aplicacao.service.CheckoutValorService;
import br.com.curso.aula228.aplicacao.service.PedidoFactoryService;
import br.com.curso.aula228.infra.auditoria.AuditoriaConsoleGateway;
import br.com.curso.aula228.infra.estoque.EstoqueGatewaySimulado;
import br.com.curso.aula228.infra.frete.FreteGatewaySimulado;
import br.com.curso.aula228.infra.notificacao.ClienteNotificadorConsole;
import br.com.curso.aula228.infra.repository.GeradorCodigoPedidoMemoria;
import br.com.curso.aula228.infra.repository.PedidoRepositoryMemoria;
import br.com.curso.aula228.teste.PagamentoGatewayFakeRecusado;

import java.math.BigDecimal;
import java.time.Instant;

public class CheckoutFacadeFakeTestApp {
    public static void main(String[] args) {
        CheckoutFacade checkoutFacade = new CheckoutFacade(
                new CheckoutValidadorService(),
                new CheckoutValorService(),
                new PedidoFactoryService(),
                new FreteGatewaySimulado(),
                new EstoqueGatewaySimulado(),
                new PagamentoGatewayFakeRecusado(),
                new PedidoRepositoryMemoria(),
                new ClienteNotificadorConsole(),
                new AuditoriaConsoleGateway(),
                new GeradorCodigoPedidoMemoria()
        );

        CheckoutResultado resultado = checkoutFacade.finalizarCompra(
                new CheckoutRequest(
                        "Cliente Teste",
                        "11999999999",
                        "Produto Teste",
                        1,
                        new BigDecimal("100.00"),
                        "06454000",
                        "PIX"
                ),
                Instant.parse("2026-07-09T10:00:00Z")
        );

        System.out.println(resultado);
    }
}
```

---

## O que isso mostra

A Facade fica testável porque depende de portas.

Você consegue trocar:

```text
PagamentoGatewaySimulado
```

por:

```text
PagamentoGatewayFakeRecusado
```

sem alterar a Facade.

---

# Parte 15 — Facade e front-end

No futuro, o controller poderia ser simples:

```java
@PostMapping("/checkout")
public ResponseEntity<CheckoutResultado> finalizar(@RequestBody CheckoutRequest request) {
    CheckoutResultado resultado = checkoutFacade.finalizarCompra(request, Instant.now());

    return ResponseEntity.ok(resultado);
}
```

O front enviaria:

```json
{
  "cliente": "Ana Silva",
  "telefone": "11999999999",
  "produto": "Notebook",
  "quantidade": 1,
  "valorUnitario": 3500.00,
  "cep": "06454000",
  "formaPagamento": "CARTAO"
}
```

E receberia:

```json
{
  "codigoPedido": "PED-2026-000001",
  "pagamentoAprovado": true,
  "statusPedido": "PAGO",
  "mensagem": "Compra finalizada com sucesso."
}
```

O front não precisa saber que internamente houve:

```text
frete;
estoque;
pagamento;
repository;
auditoria;
notificação.
```

A Facade simplifica a entrada do fluxo.

---

# Parte 16 — Erros comuns com Facade

## 1. Facade virando classe Deus

Ruim:

```text
CheckoutFacade calcula tudo, valida tudo, salva tudo, notifica tudo, integra tudo diretamente.
```

Melhor:

```text
Facade chama componentes especializados.
```

---

## 2. Facade escondendo domínio fraco

Se não há entidades nem regras bem modeladas, Facade pode virar maquiagem.

---

## 3. Facade genérica demais

Ruim:

```text
SistemaFacade;
OperacaoFacade;
GeralFacade.
```

Melhor:

```text
CheckoutFacade;
ImportacaoProdutosFacade;
JornadaDigitalFacade;
RelatorioFinanceiroFacade.
```

---

## 4. Facade sem necessidade

Se o fluxo tem apenas uma chamada simples, talvez não precise de Facade.

---

## 5. Facade quebrando DIP

Se a Facade cria tudo com `new` internamente, fica acoplada.

Melhor receber dependências no construtor.

---

# Parte 17 — Quando usar Facade

Use Facade quando:

```text
o consumidor precisa chamar muitos serviços para executar um fluxo;
o controller ficaria cheio de orquestração;
existe um subsistema complexo;
você quer uma entrada simples e estável;
você quer esconder detalhes internos;
você quer reduzir acoplamento do consumidor;
o fluxo é composto por várias etapas.
```

---

## Quando não usar

Evite Facade quando:

```text
o fluxo é simples;
a facade só repassa uma chamada;
a facade vira classe Deus;
o nome da facade é genérico;
ela esconde falta de modelagem;
ela acopla em detalhes concretos.
```

---

# Parte 18 — Checklist para criar Facade

Pergunte:

```text
1. Existe um fluxo complexo?
2. O consumidor precisa chamar muitos serviços?
3. Posso oferecer uma entrada mais simples?
4. Os componentes internos têm responsabilidades claras?
5. A Facade depende de portas ou detalhes concretos?
6. A Facade está fazendo regra demais?
7. O nome da Facade é específico?
8. Ela simplifica sem esconder bagunça?
9. Ela melhora teste?
10. Ela ajuda o futuro controller/front?
```

---

# Parte 19 — Atividade guiada

Execute:

```powershell
java -cp out br.com.curso.aula228.app.CheckoutFacadeApp
java -cp out br.com.curso.aula228.app.CheckoutPagamentoRecusadoApp
java -cp out br.com.curso.aula228.app.CheckoutFacadeFactoryApp
java -cp out br.com.curso.aula228.app.CheckoutFacadeFakeTestApp
```

Depois responda:

```text
1. Qual fluxo a Facade simplificou?
2. Quais serviços internos a Facade usou?
3. Quais gateways foram usados?
4. Qual entidade foi criada?
5. Qual método simples o consumidor chama?
6. Por que isso ajuda o controller futuro?
7. Qual diferença entre Facade e Adapter?
8. Qual diferença entre Facade e Factory?
9. Como fake ajudou no teste?
10. Quando essa Facade viraria problema?
```

---

# Parte 20 — Exercício prático principal

## Contexto

Crie uma Facade para abertura de Ordem de Serviço.

O fluxo deve:

```text
validar request;
consultar CEP;
calcular prioridade;
gerar código da OS;
criar OS;
salvar OS;
registrar auditoria;
notificar cliente.
```

---

## DTOs

Crie:

```text
AberturaOsRequest
```

Campos:

```text
String cliente;
String telefone;
String cep;
String descricao;
String tipo;
```

Crie:

```text
AberturaOsResultado
```

Campos:

```text
String codigoOs;
String status;
int prioridade;
String mensagem;
```

---

## Ports

Crie:

```text
CepGateway;
OrdemServicoRepository;
ClienteNotificador;
AuditoriaGateway;
GeradorCodigoOs.
```

---

## Services

Crie:

```text
AberturaOsValidadorService;
PrioridadeOsService;
OrdemServicoFactoryService.
```

---

## Facade

Crie:

```text
AberturaOrdemServicoFacade
```

Método:

```java
AberturaOsResultado abrir(AberturaOsRequest request, Instant agora)
```

---

## Critérios

```text
facade não deve consultar CEP diretamente com client externo;
use porta CepGateway;
facade não deve ter if gigante de prioridade;
use service ou strategy;
facade não deve salvar em lista interna;
use repository;
facade não deve virar classe Deus;
componentes internos devem ter nomes claros.
```

---

# Parte 21 — Desafio extra

## Facade de importação

Crie:

```text
ImportacaoProdutosFacade
```

Fluxo:

```text
ler arquivo;
parsear linhas;
validar produtos;
salvar válidos;
gerar relatório;
auditar resultado.
```

Componentes sugeridos:

```text
ArquivoGateway;
ProdutoCsvParser;
ProdutoValidador;
ProdutoRepository;
RelatorioImportacaoService;
AuditoriaGateway.
```

Método simples:

```java
ResultadoImportacaoProduto importar(String caminhoArquivo);
```

Objetivo:

```text
entender como Facade simplifica importação sem colocar tudo numa classe só.
```

---

# Parte 22 — Simulado rápido

## Questão 1

Facade é usada principalmente para:

```text
A) simplificar acesso a um fluxo ou subsistema complexo.
B) adaptar contrato externo.
C) montar objeto com muitos campos.
D) substituir toda entidade.
```

---

## Questão 2

Facade e Adapter são iguais?

```text
A) Não. Adapter adapta contratos; Facade simplifica um subsistema.
B) Sim, sempre são a mesma coisa.
C) Adapter é banco.
D) Facade é enum.
```

---

## Questão 3

Uma Facade boa deve:

```text
A) usar componentes internos com responsabilidades claras.
B) colocar toda regra do sistema dentro dela.
C) criar tudo com new obrigatoriamente.
D) retornar null em erro.
```

---

## Questão 4

Uma Facade chamada `SistemaFacade` com métodos de tudo quanto é módulo pode indicar:

```text
A) baixa coesão e possível classe Deus.
B) código perfeito.
C) uso obrigatório de Builder.
D) uso de DateTimeFormatter.
```

---

## Questão 5

Facade ajuda o Controller futuro porque:

```text
A) oferece uma entrada simples para um fluxo complexo.
B) elimina a necessidade de request.
C) elimina validação.
D) impede testes.
```

---

## Questão 6

Se a Facade depende de portas e não de detalhes concretos, ela respeita melhor:

```text
A) DIP.
B) apenas toString.
C) apenas enum.
D) apenas package.
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

# Parte 23 — Checklist da aula

Marque mentalmente:

```text
[ ] Sei explicar Facade Pattern.
[ ] Sei identificar fluxo complexo.
[ ] Sei diferenciar Facade de Adapter.
[ ] Sei diferenciar Facade de Factory.
[ ] Sei diferenciar Facade de Use Case.
[ ] Sei criar Facade com dependências no construtor.
[ ] Sei evitar Facade virando classe Deus.
[ ] Sei usar services internos.
[ ] Sei usar ports dentro da Facade.
[ ] Sei criar fake para testar Facade.
[ ] Sei explicar como Facade ajuda controller/front.
```

---

## Registro rápido da aula

Responda:

```text
1. O que é Facade Pattern?
2. Qual problema ele resolve?
3. Qual diferença entre Facade e Adapter?
4. Qual diferença entre Facade e Factory?
5. Por que Facade não deve virar classe Deus?
6. Como Facade ajuda o controller?
7. Como Facade se relaciona com DIP?
8. Quando usar Facade?
9. Quando evitar Facade?
10. Como testar uma Facade?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar uma facade para checkout;
organizar fluxo complexo;
separar services internos;
usar gateways e repositories;
usar fake para teste;
explicar relação com front-end;
resolver exercício de abertura de OS;
resolver desafio de importação.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m10/aula-228-facade-pattern-simplificando-fluxos-complexos-backend
git commit -m "Aula 228: facade pattern simplificando fluxos complexos backend"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Facade oferece uma entrada simples para um fluxo ou subsistema complexo, sem jogar todas as responsabilidades em uma classe só.
```

Você estudou:

```text
Facade Pattern;
checkout;
fluxo complexo;
services internos;
ports;
gateways;
repository;
auditoria;
notificação;
factory junto com facade;
fake para teste;
diferença entre Facade, Adapter, Factory e Use Case;
conversa com controller e front-end.
```

Na próxima aula, vamos estudar:

```text
Template Method Pattern.
```

A ideia será organizar fluxos que têm uma sequência fixa de passos, mas permitem variação em algumas etapas, como importação de arquivos, processamento em lote e validações padronizadas.
