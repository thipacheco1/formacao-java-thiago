# 199 — M7.14 — Exercícios integradores: Streams, Functional Interfaces e Optional

## Objetivo da aula

Nesta aula você vai consolidar o que estudou no Módulo 7 até aqui:

```text
Functional Interfaces;
Lambdas;
Method Reference;
Constructor Reference;
Predicate;
Function;
Consumer;
Supplier;
Composição funcional;
Streams;
filter;
map;
flatMap;
sorted;
distinct;
limit;
skip;
toList;
collect;
Collectors;
findFirst;
anyMatch;
allMatch;
noneMatch;
count;
min;
max;
reduce;
Optional;
boas práticas.
```

O objetivo não é apresentar recurso novo.

O objetivo é praticar integração.

Em projeto real, você raramente usa um recurso isolado.

Você usa vários juntos:

```text
buscar dados;
filtrar por regra;
ordenar;
mapear para response;
tratar ausência;
agrupar;
calcular resumo;
retornar lista vazia;
lançar exceção quando necessário;
evitar efeito colateral;
manter regra no domínio;
manter conversão no mapper;
manter coordenação no service.
```

Ao final desta aula, você deve conseguir:

```text
resolver exercícios usando Streams com clareza;
criar services de consulta;
criar services de relatório;
usar Optional em busca de um item;
usar lista vazia para busca de muitos itens;
usar exceção em fluxo obrigatório;
usar flatMap em coleções aninhadas;
usar Collectors para agrupamentos;
usar reduce para totalização;
usar Comparator para ordenação;
evitar pipelines ilegíveis;
aplicar a frase arquitetural do curso.
```

---

## Frase central da aula

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

Nesta aula, ainda não teremos banco, Spring, controller real ou repository real.

Mas a mentalidade já precisa ser profissional:

```text
Entidade:
protege regra.

Mapper:
converte para response.

Service:
coordena consultas, filtros, ordenações, agrupamentos e retornos.

App:
apenas demonstra execução.
```

---

## Regras gerais dos exercícios

Para todos os exercícios desta aula:

```text
não use Optional.get();
não retorne null;
não use forEach para montar lista;
não coloque regra importante escondida em lambda gigante;
não imprima dentro do service;
não use parallelStream;
não use stream apenas para parecer avançado;
não crie pipeline ilegível.
```

Prefira:

```text
métodos de domínio com nomes claros;
mappers separados;
services retornando dados;
DTOs para retorno;
Optional para busca de um item;
List vazia para busca de muitos itens;
exceção clara quando ausência for erro do fluxo.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-199-exercicios-integradores-streams-functional-interfaces-e-optional
cd labs\m7\aula-199-exercicios-integradores-streams-functional-interfaces-e-optional
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula199
mkdir src\br\com\curso\aula199\app
mkdir src\br\com\curso\aula199\dominio
mkdir src\br\com\curso\aula199\dominio\cliente
mkdir src\br\com\curso\aula199\dominio\pedido
mkdir src\br\com\curso\aula199\dominio\ordemservico
mkdir src\br\com\curso\aula199\dto
mkdir src\br\com\curso\aula199\service
```

---

# Parte 1 — Exercício 1: Cliente, consulta e Optional

## Objetivo

Criar um fluxo de consulta de clientes usando:

```text
Predicate;
Function;
Method Reference;
Optional;
filter;
map;
sorted;
toList;
findFirst.
```

---

## Cliente

Crie:

```text
src\br\com\curso\aula199\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula199.dominio.cliente;

public class Cliente {
    private final String nome;
    private final String email;
    private final boolean ativo;
    private final boolean bloqueado;
    private final String tipo;

    public Cliente(String nome, String email, boolean ativo, boolean bloqueado, String tipo) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        this.nome = nome.trim();
        this.email = email.trim().toLowerCase();
        this.ativo = ativo;
        this.bloqueado = bloqueado;
        this.tipo = tipo.trim().toUpperCase();
    }

    public String nome() {
        return nome;
    }

    public String email() {
        return email;
    }

    public boolean ativo() {
        return ativo;
    }

    public boolean bloqueado() {
        return bloqueado;
    }

    public String tipo() {
        return tipo;
    }

    public String dominioEmail() {
        return email.substring(email.indexOf("@") + 1);
    }

    public boolean podeOperar() {
        return ativo && !bloqueado;
    }

    public boolean corporativo() {
        return "CORPORATIVO".equals(tipo);
    }

    public boolean consumidorFinal() {
        return "CONSUMIDOR_FINAL".equals(tipo);
    }

    public String resumo() {
        return nome
                + " | " + email
                + " | Tipo: " + tipo
                + " | Ativo: " + ativo
                + " | Bloqueado: " + bloqueado;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ClienteResponse

Crie:

```text
src\br\com\curso\aula199\dto\ClienteResponse.java
```

Código:

```java
package br.com.curso.aula199.dto;

public class ClienteResponse {
    private final String nome;
    private final String email;
    private final String dominio;
    private final String tipo;

    public ClienteResponse(String nome, String email, String dominio, String tipo) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        if (dominio == null || dominio.isBlank()) {
            throw new IllegalArgumentException("Domínio é obrigatório.");
        }

        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        this.nome = nome;
        this.email = email;
        this.dominio = dominio;
        this.tipo = tipo;
    }

    public String nome() {
        return nome;
    }

    public String email() {
        return email;
    }

    public String dominio() {
        return dominio;
    }

    public String tipo() {
        return tipo;
    }

    public String resumo() {
        return nome + " | " + email + " | Domínio: " + dominio + " | Tipo: " + tipo;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ClienteMapper

Crie:

```text
src\br\com\curso\aula199\dto\ClienteMapper.java
```

Código:

```java
package br.com.curso.aula199.dto;

import br.com.curso.aula199.dominio.cliente.Cliente;

public final class ClienteMapper {
    private ClienteMapper() {
    }

    public static ClienteResponse toResponse(Cliente cliente) {
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        return new ClienteResponse(
                cliente.nome(),
                cliente.email(),
                cliente.dominioEmail(),
                cliente.tipo()
        );
    }
}
```

---

## ClienteConsultaService

Crie:

```text
src\br\com\curso\aula199\service\ClienteConsultaService.java
```

Código:

```java
package br.com.curso.aula199.service;

import br.com.curso.aula199.dominio.cliente.Cliente;
import br.com.curso.aula199.dto.ClienteMapper;
import br.com.curso.aula199.dto.ClienteResponse;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

public class ClienteConsultaService {
    private final List<Cliente> clientes;

    public ClienteConsultaService(List<Cliente> clientes) {
        if (clientes == null) {
            throw new IllegalArgumentException("Clientes são obrigatórios.");
        }

        this.clientes = List.copyOf(clientes);
    }

    public Optional<Cliente> buscarPorEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        String normalizado = email.trim().toLowerCase();

        return clientes.stream()
                .filter(cliente -> cliente.email().equals(normalizado))
                .findFirst();
    }

    public Optional<ClienteResponse> buscarResponsePorEmail(String email) {
        return buscarPorEmail(email)
                .map(ClienteMapper::toResponse);
    }

    public ClienteResponse buscarObrigatorio(String email) {
        return buscarResponsePorEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado: " + email));
    }

    public List<ClienteResponse> listarAptosCorporativosPorDominio(String dominio) {
        if (dominio == null || dominio.isBlank()) {
            throw new IllegalArgumentException("Domínio é obrigatório.");
        }

        String normalizado = dominio.trim().toLowerCase();

        Predicate<Cliente> apto = Cliente::podeOperar;
        Predicate<Cliente> corporativo = Cliente::corporativo;
        Predicate<Cliente> dominioInformado = cliente -> cliente.dominioEmail().equals(normalizado);

        Predicate<Cliente> regra = apto
                .and(corporativo)
                .and(dominioInformado);

        return clientes.stream()
                .filter(regra)
                .sorted(Comparator.comparing(Cliente::nome))
                .map(ClienteMapper::toResponse)
                .toList();
    }
}
```

---

## App do exercício 1

Crie:

```text
src\br\com\curso\aula199\app\ExercicioClienteConsultaApp.java
```

Código:

```java
package br.com.curso.aula199.app;

import br.com.curso.aula199.dominio.cliente.Cliente;
import br.com.curso.aula199.dto.ClienteResponse;
import br.com.curso.aula199.service.ClienteConsultaService;

import java.util.List;

public class ExercicioClienteConsultaApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente("Ana Silva", "ana@empresa.com", true, false, "CORPORATIVO"),
                new Cliente("Carlos Souza", "carlos@empresa.com", true, true, "CORPORATIVO"),
                new Cliente("Maria Oliveira", "maria@gmail.com", true, false, "CONSUMIDOR_FINAL"),
                new Cliente("Bruna Alves", "bruna@empresa.com", true, false, "CORPORATIVO"),
                new Cliente("João Lima", "joao@empresa.com", false, false, "CORPORATIVO")
        );

        ClienteConsultaService service = new ClienteConsultaService(clientes);

        System.out.println("Buscar cliente:");
        System.out.println(service.buscarResponsePorEmail("ana@empresa.com")
                .map(ClienteResponse::resumo)
                .orElse("Cliente não encontrado."));

        System.out.println();

        System.out.println("Corporativos aptos por domínio:");
        List<ClienteResponse> responses = service.listarAptosCorporativosPorDominio("empresa.com");
        responses.forEach(System.out::println);

        System.out.println();

        System.out.println("Cliente obrigatório:");
        System.out.println(service.buscarObrigatorio("bruna@empresa.com"));
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula199.app.ExercicioClienteConsultaApp
```

---

## O que este exercício integra

```text
Predicate nomeado;
Predicate.and;
method reference;
findFirst;
Optional.map;
Optional.orElse;
Optional.orElseThrow;
sorted;
mapper;
service retornando dados.
```

---

# Parte 2 — Exercício 2: Pedido, itens, flatMap e agregação

## Objetivo

Criar relatório de pedidos usando:

```text
flatMap;
reduce;
groupingBy;
summingInt;
reducing;
Optional;
DTO de resumo;
regra no domínio.
```

---

## ItemPedido

Crie:

```text
src\br\com\curso\aula199\dominio\pedido\ItemPedido.java
```

Código:

```java
package br.com.curso.aula199.dominio.pedido;

import java.math.BigDecimal;

public class ItemPedido {
    private final String sku;
    private final String nome;
    private final BigDecimal valorUnitario;
    private final int quantidade;

    public ItemPedido(String sku, String nome, BigDecimal valorUnitario, int quantidade) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (valorUnitario == null || valorUnitario.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor unitário deve ser maior que zero.");
        }

        if (quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }

        this.sku = sku.trim().toUpperCase();
        this.nome = nome.trim();
        this.valorUnitario = valorUnitario;
        this.quantidade = quantidade;
    }

    public String sku() {
        return sku;
    }

    public String nome() {
        return nome;
    }

    public BigDecimal valorUnitario() {
        return valorUnitario;
    }

    public int quantidade() {
        return quantidade;
    }

    public BigDecimal subtotal() {
        return valorUnitario.multiply(BigDecimal.valueOf(quantidade));
    }

    public boolean altoValor() {
        return subtotal().compareTo(new BigDecimal("1000.00")) >= 0;
    }

    public String resumo() {
        return sku
                + " | " + nome
                + " | Unitário: " + valorUnitario
                + " | Quantidade: " + quantidade
                + " | Subtotal: " + subtotal();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## Pedido

Crie:

```text
src\br\com\curso\aula199\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula199.dominio.pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final LocalDate data;
    private final boolean pago;
    private final boolean cancelado;
    private final List<ItemPedido> itens;

    public Pedido(String codigo, String cliente, LocalDate data, boolean pago, boolean cancelado, List<ItemPedido> itens) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        if (itens == null || itens.isEmpty()) {
            throw new IllegalArgumentException("Pedido deve possuir itens.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.data = data;
        this.pago = pago;
        this.cancelado = cancelado;
        this.itens = List.copyOf(itens);
    }

    public String codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public LocalDate data() {
        return data;
    }

    public boolean pago() {
        return pago;
    }

    public boolean cancelado() {
        return cancelado;
    }

    public List<ItemPedido> itens() {
        return itens;
    }

    public boolean podeFaturar() {
        return pago && !cancelado;
    }

    public BigDecimal total() {
        return itens.stream()
                .map(ItemPedido::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Data: " + data
                + " | Pago: " + pago
                + " | Cancelado: " + cancelado
                + " | Total: " + total();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ItemConsolidadoResponse

Crie:

```text
src\br\com\curso\aula199\dto\ItemConsolidadoResponse.java
```

Código:

```java
package br.com.curso.aula199.dto;

import java.math.BigDecimal;

public class ItemConsolidadoResponse {
    private final String sku;
    private final int quantidadeTotal;
    private final BigDecimal valorTotal;

    public ItemConsolidadoResponse(String sku, int quantidadeTotal, BigDecimal valorTotal) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (quantidadeTotal < 0) {
            throw new IllegalArgumentException("Quantidade total não pode ser negativa.");
        }

        if (valorTotal == null) {
            throw new IllegalArgumentException("Valor total é obrigatório.");
        }

        this.sku = sku;
        this.quantidadeTotal = quantidadeTotal;
        this.valorTotal = valorTotal;
    }

    public String sku() {
        return sku;
    }

    public int quantidadeTotal() {
        return quantidadeTotal;
    }

    public BigDecimal valorTotal() {
        return valorTotal;
    }

    public String resumo() {
        return sku
                + " | Quantidade total: " + quantidadeTotal
                + " | Valor total: " + valorTotal;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## PedidoRelatorioService

Crie:

```text
src\br\com\curso\aula199\service\PedidoRelatorioService.java
```

Código:

```java
package br.com.curso.aula199.service;

import br.com.curso.aula199.dominio.pedido.ItemPedido;
import br.com.curso.aula199.dominio.pedido.Pedido;
import br.com.curso.aula199.dto.ItemConsolidadoResponse;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class PedidoRelatorioService {
    private final List<Pedido> pedidos;

    public PedidoRelatorioService(List<Pedido> pedidos) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Pedidos são obrigatórios.");
        }

        this.pedidos = List.copyOf(pedidos);
    }

    public BigDecimal calcularTotalFaturavel() {
        return pedidos.stream()
                .filter(Pedido::podeFaturar)
                .map(Pedido::total)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Optional<Pedido> buscarMaiorPedidoFaturavel() {
        return pedidos.stream()
                .filter(Pedido::podeFaturar)
                .max(Comparator.comparing(Pedido::total));
    }

    public List<ItemPedido> listarItensDeAltoValorEmPedidosFaturaveis() {
        return pedidos.stream()
                .filter(Pedido::podeFaturar)
                .flatMap(pedido -> pedido.itens().stream())
                .filter(ItemPedido::altoValor)
                .sorted(Comparator.comparing(ItemPedido::subtotal).reversed())
                .toList();
    }

    public List<ItemConsolidadoResponse> consolidarItensPorSku() {
        Map<String, Integer> quantidadePorSku = pedidos.stream()
                .filter(Pedido::podeFaturar)
                .flatMap(pedido -> pedido.itens().stream())
                .collect(Collectors.groupingBy(
                        ItemPedido::sku,
                        Collectors.summingInt(ItemPedido::quantidade)
                ));

        Map<String, BigDecimal> totalPorSku = pedidos.stream()
                .filter(Pedido::podeFaturar)
                .flatMap(pedido -> pedido.itens().stream())
                .collect(Collectors.groupingBy(
                        ItemPedido::sku,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                ItemPedido::subtotal,
                                BigDecimal::add
                        )
                ));

        return quantidadePorSku.entrySet()
                .stream()
                .map(entry -> new ItemConsolidadoResponse(
                        entry.getKey(),
                        entry.getValue(),
                        totalPorSku.getOrDefault(entry.getKey(), BigDecimal.ZERO)
                ))
                .sorted(Comparator.comparing(ItemConsolidadoResponse::valorTotal).reversed())
                .toList();
    }
}
```

---

## App do exercício 2

Crie:

```text
src\br\com\curso\aula199\app\ExercicioPedidoRelatorioApp.java
```

Código:

```java
package br.com.curso.aula199.app;

import br.com.curso.aula199.dominio.pedido.ItemPedido;
import br.com.curso.aula199.dominio.pedido.Pedido;
import br.com.curso.aula199.dto.ItemConsolidadoResponse;
import br.com.curso.aula199.service.PedidoRelatorioService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ExercicioPedidoRelatorioApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido(
                        "PED-001",
                        "Ana",
                        LocalDate.of(2026, 7, 1),
                        true,
                        false,
                        List.of(
                                new ItemPedido("SKU-001", "Notebook", new BigDecimal("3500.00"), 1),
                                new ItemPedido("SKU-002", "Mouse", new BigDecimal("80.00"), 2)
                        )
                ),
                new Pedido(
                        "PED-002",
                        "Carlos",
                        LocalDate.of(2026, 7, 2),
                        true,
                        false,
                        List.of(
                                new ItemPedido("SKU-003", "Monitor", new BigDecimal("1200.00"), 1),
                                new ItemPedido("SKU-002", "Mouse", new BigDecimal("80.00"), 1)
                        )
                ),
                new Pedido(
                        "PED-003",
                        "Maria",
                        LocalDate.of(2026, 7, 3),
                        false,
                        false,
                        List.of(
                                new ItemPedido("SKU-004", "Cadeira", new BigDecimal("450.00"), 2)
                        )
                )
        );

        PedidoRelatorioService service = new PedidoRelatorioService(pedidos);

        System.out.println("Total faturável:");
        System.out.println(service.calcularTotalFaturavel());

        System.out.println();

        System.out.println("Maior pedido faturável:");
        System.out.println(service.buscarMaiorPedidoFaturavel()
                .map(Pedido::resumo)
                .orElse("Nenhum pedido faturável."));

        System.out.println();

        System.out.println("Itens de alto valor:");
        service.listarItensDeAltoValorEmPedidosFaturaveis()
                .forEach(item -> System.out.println("  " + item.resumo()));

        System.out.println();

        System.out.println("Itens consolidados:");
        List<ItemConsolidadoResponse> consolidados = service.consolidarItensPorSku();
        consolidados.forEach(item -> System.out.println("  " + item.resumo()));
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula199.app.ExercicioPedidoRelatorioApp
```

---

## O que este exercício integra

```text
flatMap;
filter no pai;
filter no filho;
reduce com BigDecimal;
max com Comparator;
Optional retornando ausência;
groupingBy;
summingInt;
reducing;
DTO consolidado;
ordenação por valor.
```

---

# Parte 3 — Exercício 3: Ordem de Serviço, atividades e resumo operacional

## Objetivo

Criar relatório operacional de OS com atividades usando:

```text
flatMap;
groupingBy;
partitioningBy;
counting;
summingInt;
Optional;
sorted;
limit;
DTO de resumo;
boas práticas.
```

---

## AtividadeOs

Crie:

```text
src\br\com\curso\aula199\dominio\ordemservico\AtividadeOs.java
```

Código:

```java
package br.com.curso.aula199.dominio.ordemservico;

public class AtividadeOs {
    private final String codigo;
    private final String descricao;
    private final String status;
    private final boolean obrigatoria;
    private final boolean urgente;
    private final int tentativas;
    private final int minutosEstimados;

    public AtividadeOs(
            String codigo,
            String descricao,
            String status,
            boolean obrigatoria,
            boolean urgente,
            int tentativas,
            int minutosEstimados
    ) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição é obrigatória.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (tentativas < 0) {
            throw new IllegalArgumentException("Tentativas não pode ser negativo.");
        }

        if (minutosEstimados <= 0) {
            throw new IllegalArgumentException("Minutos estimados deve ser maior que zero.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.descricao = descricao.trim();
        this.status = status.trim().toUpperCase();
        this.obrigatoria = obrigatoria;
        this.urgente = urgente;
        this.tentativas = tentativas;
        this.minutosEstimados = minutosEstimados;
    }

    public String codigo() {
        return codigo;
    }

    public String descricao() {
        return descricao;
    }

    public String status() {
        return status;
    }

    public boolean obrigatoria() {
        return obrigatoria;
    }

    public boolean urgente() {
        return urgente;
    }

    public int tentativas() {
        return tentativas;
    }

    public int minutosEstimados() {
        return minutosEstimados;
    }

    public boolean pendente() {
        return "PENDENTE".equals(status);
    }

    public boolean concluida() {
        return "CONCLUIDA".equals(status);
    }

    public boolean excedeuTentativas() {
        return tentativas > 3;
    }

    public boolean podeExecutar() {
        return pendente() && !excedeuTentativas();
    }

    public boolean critica() {
        return urgente || obrigatoria;
    }

    public int prioridadeNumerica() {
        if (urgente && obrigatoria) {
            return 1;
        }

        if (urgente) {
            return 2;
        }

        if (obrigatoria) {
            return 3;
        }

        return 4;
    }

    public String resumo() {
        return codigo
                + " | " + descricao
                + " | Status: " + status
                + " | Obrigatória: " + obrigatoria
                + " | Urgente: " + urgente
                + " | Tentativas: " + tentativas
                + " | Minutos: " + minutosEstimados;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## OrdemServico

Crie:

```text
src\br\com\curso\aula199\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula199.dominio.ordemservico;

import java.util.List;

public class OrdemServico {
    private final String codigo;
    private final String cliente;
    private final String status;
    private final List<AtividadeOs> atividades;

    public OrdemServico(String codigo, String cliente, String status, List<AtividadeOs> atividades) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (atividades == null) {
            throw new IllegalArgumentException("Atividades são obrigatórias.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.status = status.trim().toUpperCase();
        this.atividades = List.copyOf(atividades);
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

    public List<AtividadeOs> atividades() {
        return atividades;
    }

    public boolean aberta() {
        return "ABERTA".equals(status);
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Status: " + status
                + " | Atividades: " + atividades.size();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ResumoOperacionalOsResponse

Crie:

```text
src\br\com\curso\aula199\dto\ResumoOperacionalOsResponse.java
```

Código:

```java
package br.com.curso.aula199.dto;

import java.util.Map;

public class ResumoOperacionalOsResponse {
    private final long totalExecutaveis;
    private final long totalCriticas;
    private final int minutosPendentes;
    private final Map<String, Long> quantidadePorStatus;

    public ResumoOperacionalOsResponse(
            long totalExecutaveis,
            long totalCriticas,
            int minutosPendentes,
            Map<String, Long> quantidadePorStatus
    ) {
        if (totalExecutaveis < 0) {
            throw new IllegalArgumentException("Total executáveis não pode ser negativo.");
        }

        if (totalCriticas < 0) {
            throw new IllegalArgumentException("Total críticas não pode ser negativo.");
        }

        if (minutosPendentes < 0) {
            throw new IllegalArgumentException("Minutos pendentes não pode ser negativo.");
        }

        if (quantidadePorStatus == null) {
            throw new IllegalArgumentException("Quantidade por status é obrigatória.");
        }

        this.totalExecutaveis = totalExecutaveis;
        this.totalCriticas = totalCriticas;
        this.minutosPendentes = minutosPendentes;
        this.quantidadePorStatus = Map.copyOf(quantidadePorStatus);
    }

    public long totalExecutaveis() {
        return totalExecutaveis;
    }

    public long totalCriticas() {
        return totalCriticas;
    }

    public int minutosPendentes() {
        return minutosPendentes;
    }

    public Map<String, Long> quantidadePorStatus() {
        return quantidadePorStatus;
    }

    public String resumo() {
        return "Executáveis: " + totalExecutaveis
                + " | Críticas: " + totalCriticas
                + " | Minutos pendentes: " + minutosPendentes
                + " | Por status: " + quantidadePorStatus;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## OrdemServicoRelatorioService

Crie:

```text
src\br\com\curso\aula199\service\OrdemServicoRelatorioService.java
```

Código:

```java
package br.com.curso.aula199.service;

import br.com.curso.aula199.dominio.ordemservico.AtividadeOs;
import br.com.curso.aula199.dominio.ordemservico.OrdemServico;
import br.com.curso.aula199.dto.ResumoOperacionalOsResponse;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class OrdemServicoRelatorioService {
    private final List<OrdemServico> ordens;

    public OrdemServicoRelatorioService(List<OrdemServico> ordens) {
        if (ordens == null) {
            throw new IllegalArgumentException("Ordens são obrigatórias.");
        }

        this.ordens = List.copyOf(ordens);
    }

    public List<AtividadeOs> listarTopAtividadesExecutaveis(int limite) {
        if (limite <= 0) {
            throw new IllegalArgumentException("Limite deve ser maior que zero.");
        }

        return ordens.stream()
                .filter(OrdemServico::aberta)
                .flatMap(os -> os.atividades().stream())
                .filter(AtividadeOs::podeExecutar)
                .sorted(
                        Comparator.comparing(AtividadeOs::prioridadeNumerica)
                                .thenComparing(Comparator.comparing(AtividadeOs::tentativas).reversed())
                                .thenComparing(AtividadeOs::codigo)
                )
                .limit(limite)
                .toList();
    }

    public Optional<AtividadeOs> buscarPrimeiraCriticaExecutavel() {
        return ordens.stream()
                .filter(OrdemServico::aberta)
                .flatMap(os -> os.atividades().stream())
                .filter(AtividadeOs::podeExecutar)
                .filter(AtividadeOs::critica)
                .findFirst();
    }

    public Map<String, Long> contarAtividadesPorStatus() {
        return ordens.stream()
                .flatMap(os -> os.atividades().stream())
                .collect(Collectors.groupingBy(
                        AtividadeOs::status,
                        Collectors.counting()
                ));
    }

    public Map<Boolean, List<AtividadeOs>> separarCriticas() {
        return ordens.stream()
                .flatMap(os -> os.atividades().stream())
                .collect(Collectors.partitioningBy(AtividadeOs::critica));
    }

    public ResumoOperacionalOsResponse gerarResumoOperacional() {
        List<AtividadeOs> atividades = ordens.stream()
                .flatMap(os -> os.atividades().stream())
                .toList();

        long totalExecutaveis = atividades.stream()
                .filter(AtividadeOs::podeExecutar)
                .count();

        long totalCriticas = atividades.stream()
                .filter(AtividadeOs::critica)
                .count();

        int minutosPendentes = atividades.stream()
                .filter(AtividadeOs::pendente)
                .mapToInt(AtividadeOs::minutosEstimados)
                .sum();

        Map<String, Long> quantidadePorStatus = atividades.stream()
                .collect(Collectors.groupingBy(
                        AtividadeOs::status,
                        Collectors.counting()
                ));

        return new ResumoOperacionalOsResponse(
                totalExecutaveis,
                totalCriticas,
                minutosPendentes,
                quantidadePorStatus
        );
    }
}
```

---

## App do exercício 3

Crie:

```text
src\br\com\curso\aula199\app\ExercicioOrdemServicoRelatorioApp.java
```

Código:

```java
package br.com.curso.aula199.app;

import br.com.curso.aula199.dominio.ordemservico.AtividadeOs;
import br.com.curso.aula199.dominio.ordemservico.OrdemServico;
import br.com.curso.aula199.dto.ResumoOperacionalOsResponse;
import br.com.curso.aula199.service.OrdemServicoRelatorioService;

import java.util.List;

public class ExercicioOrdemServicoRelatorioApp {
    public static void main(String[] args) {
        List<OrdemServico> ordens = List.of(
                new OrdemServico(
                        "OS-001",
                        "Ana",
                        "ABERTA",
                        List.of(
                                new AtividadeOs("ATV-001", "Confirmar entrega", "PENDENTE", true, true, 1, 30),
                                new AtividadeOs("ATV-002", "Gerar checklist", "CONCLUIDA", true, false, 0, 20)
                        )
                ),
                new OrdemServico(
                        "OS-002",
                        "Carlos",
                        "ABERTA",
                        List.of(
                                new AtividadeOs("ATV-003", "Reagendar", "PENDENTE", false, true, 4, 15),
                                new AtividadeOs("ATV-004", "Validar contato", "PENDENTE", true, false, 2, 25)
                        )
                ),
                new OrdemServico(
                        "OS-003",
                        "Maria",
                        "CONCLUIDA",
                        List.of(
                                new AtividadeOs("ATV-005", "Finalizar OS", "CONCLUIDA", true, false, 0, 10)
                        )
                )
        );

        OrdemServicoRelatorioService service = new OrdemServicoRelatorioService(ordens);

        System.out.println("Top executáveis:");
        service.listarTopAtividadesExecutaveis(3)
                .forEach(atividade -> System.out.println("  " + atividade.resumo()));

        System.out.println();

        System.out.println("Primeira crítica executável:");
        System.out.println(service.buscarPrimeiraCriticaExecutavel()
                .map(AtividadeOs::resumo)
                .orElse("Nenhuma crítica executável."));

        System.out.println();

        System.out.println("Atividades por status:");
        System.out.println(service.contarAtividadesPorStatus());

        System.out.println();

        System.out.println("Resumo operacional:");
        ResumoOperacionalOsResponse resumo = service.gerarResumoOperacional();
        System.out.println(resumo);
    }
}
```

Execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula199.app.ExercicioOrdemServicoRelatorioApp
```

---

## O que este exercício integra

```text
flatMap;
filter no pai;
filter no filho;
findFirst;
Optional;
sorted com Comparator composto;
limit;
groupingBy;
partitioningBy;
counting;
mapToInt;
DTO de resumo;
service sem impressão.
```

---

# Parte 4 — Exercício 4: Refatoração de pipeline ruim

## Objetivo

Praticar leitura crítica.

Você vai analisar um pipeline ruim e refatorar.

---

## Código ruim

Imagine este código:

```java
List<String> resultado = pedidos.stream()
        .filter(p -> p.pago() && !p.cancelado() && p.total().compareTo(new BigDecimal("1000.00")) > 0)
        .sorted((a, b) -> b.total().compareTo(a.total()))
        .map(p -> p.codigo() + " - " + p.cliente() + " - " + p.total())
        .limit(10)
        .toList();
```

Problemas:

```text
regra de faturamento exposta;
regra de valor alto exposta;
BigDecimal mágico dentro do pipeline;
comparator manual;
mapper inline;
String como DTO improvisado;
sem nome de intenção.
```

---

## Refatoração esperada

A entidade deve ter:

```java
podeFaturar()
valorAlto(BigDecimal referencia)
```

O mapper deve ter:

```java
toResumoResponse(Pedido pedido)
```

O service deve ter:

```java
listarTopPedidosFaturaveisDeAltoValor(BigDecimal valorReferencia, int limite)
```

Pipeline esperado:

```java
return pedidos.stream()
        .filter(Pedido::podeFaturar)
        .filter(pedido -> pedido.valorAlto(valorReferencia))
        .sorted(Comparator.comparing(Pedido::total).reversed())
        .limit(limite)
        .map(PedidoMapper::toResumoResponse)
        .toList();
```

---

## Critério de avaliação

A refatoração deve melhorar:

```text
nome das regras;
legibilidade;
testabilidade;
separação de responsabilidade;
clareza do retorno;
facilidade de manutenção.
```

---

# Parte 5 — Exercício 5: Matriz de decisão

Complete mentalmente:

## Cenário 1

```text
Preciso buscar um cliente por e-mail.
Pode não existir.
```

Resposta esperada:

```text
Optional<Cliente>
```

---

## Cenário 2

```text
Preciso listar clientes por domínio.
Pode não existir nenhum.
```

Resposta esperada:

```text
List<ClienteResponse> vazia se não encontrar.
```

---

## Cenário 3

```text
Preciso faturar um pedido por código.
Se não existir, é erro.
```

Resposta esperada:

```text
buscarObrigatorio com orElseThrow.
```

---

## Cenário 4

```text
Preciso processar todos os pedidos e registrar erro individual por item.
```

Resposta esperada:

```text
for tradicional pode ser mais claro.
```

---

## Cenário 5

```text
Preciso agrupar produtos por categoria.
```

Resposta esperada:

```text
Collectors.groupingBy.
```

---

## Cenário 6

```text
Preciso separar atividades críticas e não críticas.
```

Resposta esperada:

```text
Collectors.partitioningBy.
```

---

## Cenário 7

```text
Preciso pegar todos os itens de todos os pedidos.
```

Resposta esperada:

```text
flatMap.
```

---

## Cenário 8

```text
Preciso saber se existe algum cliente bloqueado.
```

Resposta esperada:

```text
anyMatch.
```

---

## Cenário 9

```text
Preciso saber se todos os itens do lote são válidos.
```

Resposta esperada:

```text
allMatch, com cuidado para lista vazia.
```

---

## Cenário 10

```text
Preciso somar valores financeiros.
```

Resposta esperada:

```text
BigDecimal com reduce(BigDecimal.ZERO, BigDecimal::add).
```

---

# Parte 6 — Checklist de code review para Streams

Use este checklist em qualquer código com Stream:

```text
1. O pipeline é fácil de ler?
2. A ordem das operações faz sentido?
3. O filtro vem antes da ordenação quando possível?
4. O map está transformando dados, não executando regra escondida?
5. O forEach está sendo usado apenas para ação final?
6. Existe estado externo mutável?
7. Optional está sendo tratado sem get?
8. Busca de um item retorna Optional?
9. Busca de muitos itens retorna lista vazia?
10. Ausência obrigatória lança exceção clara?
11. Regras importantes estão na entidade?
12. Conversões estão em mapper quando crescem?
13. groupingBy ou partitioningBy fazem sentido?
14. flatMap é necessário ou o map bastava?
15. O volume de dados permite processamento em memória?
16. Isso deveria estar no banco?
17. parallelStream foi evitado sem medição?
18. O nome do método explica a intenção?
```

---

# Parte 7 — Desafio final da aula

Crie um mini-módulo completo de consulta de atividades.

## Entidade

Crie:

```text
src\br\com\curso\aula199\dominio\ordemservico\AtividadeOperacional.java
```

Campos:

```text
String codigo;
String descricao;
String status;
String responsavel;
boolean obrigatoria;
boolean urgente;
int tentativas;
int minutosEstimados;
```

Regras:

```text
codigo obrigatório;
descricao obrigatória;
status obrigatório;
responsavel obrigatório;
tentativas não pode ser negativo;
minutosEstimados maior que zero;
pendente() retorna status igual "PENDENTE";
concluida() retorna status igual "CONCLUIDA";
excedeuTentativas() retorna tentativas > 3;
podeExecutar() retorna pendente && !excedeuTentativas;
critica() retorna urgente || obrigatoria;
prioridadeNumerica:
    1 se urgente e obrigatoria;
    2 se urgente;
    3 se obrigatoria;
    4 caso contrário;
resumo().
```

---

## DTOs

Crie:

```text
AtividadeOperacionalResponse
```

Campos:

```text
codigo;
descricao;
status;
responsavel;
prioridade;
minutosEstimados;
```

Crie:

```text
ResumoResponsavelResponse
```

Campos:

```text
responsavel;
long quantidade;
int minutosEstimados;
```

---

## Mapper

Crie:

```text
AtividadeOperacionalMapper
```

Métodos:

```java
toResponse(AtividadeOperacional atividade)
toResumoResponsavel(String responsavel, long quantidade, int minutosEstimados)
```

---

## Service

Crie:

```text
AtividadeOperacionalService
```

Métodos obrigatórios:

```java
Optional<AtividadeOperacionalResponse> buscarPorCodigo(String codigo)

AtividadeOperacionalResponse buscarObrigatoriaParaExecucao(String codigo)

List<AtividadeOperacionalResponse> listarExecutaveisOrdenadas()

List<AtividadeOperacionalResponse> listarPaginaExecutaveis(int pagina, int tamanho)

Map<String, Long> contarPorStatus()

Map<Boolean, List<AtividadeOperacionalResponse>> separarCriticas()

List<ResumoResponsavelResponse> resumirPorResponsavel()
```

Regras:

```text
buscarPorCodigo:
findFirst + map.

buscarObrigatoriaParaExecucao:
buscar por código;
filter podeExecutar;
orElseThrow.

listarExecutaveisOrdenadas:
filter podeExecutar;
sorted por prioridadeNumerica, tentativas desc, codigo;
map;
toList.

listarPaginaExecutaveis:
mesma regra da ordenação;
skip;
limit.

contarPorStatus:
groupingBy status + counting.

separarCriticas:
partitioningBy critica;
mapping para response.

resumirPorResponsavel:
groupingBy responsavel + counting;
groupingBy responsavel + summingInt minutosEstimados;
montar DTO final ordenado por responsavel.
```

---

## App

Crie:

```text
AtividadeOperacionalServiceApp
```

Deve demonstrar:

```text
buscar por código existente;
buscar por código inexistente com Optional;
buscar obrigatória para execução;
listar executáveis;
listar página;
contar por status;
separar críticas;
resumir por responsável.
```

---

## Critérios de aprovação do desafio final

O desafio estará correto se:

```text
não usar Optional.get;
não retornar null;
não imprimir dentro do service;
não usar forEach para montar lista;
não usar parallelStream;
não deixar lambda gigante;
usar regra no domínio;
usar mapper;
usar DTO;
usar Optional quando busca um item;
usar List vazia quando consulta muitos;
usar orElseThrow quando ausência impede fluxo;
usar groupingBy e partitioningBy corretamente;
usar sorted com Comparator legível;
usar skip e limit corretamente;
```

---

# Parte 8 — Perguntas de revisão

Responda sem olhar as aulas anteriores:

```text
1. Qual a diferença entre Predicate, Function, Consumer e Supplier?
2. Quando usar method reference?
3. Quando lambda é melhor que method reference?
4. Qual a diferença entre map e flatMap?
5. Qual a diferença entre Stream<T> e Optional<T>?
6. Quando usar findFirst?
7. Quando usar anyMatch?
8. Quando usar allMatch?
9. Por que allMatch em lista vazia exige cuidado?
10. Quando usar groupingBy?
11. Quando usar partitioningBy?
12. Quando usar reduce?
13. Como somar BigDecimal em Stream?
14. Por que não usar Optional.get?
15. Por que service não deve imprimir?
16. Por que regra de negócio deve ficar no domínio?
17. Por que mapper ajuda?
18. Quando usar for em vez de Stream?
19. Por que parallelStream exige cuidado?
20. Quando processamento deve ir para o banco?
```

---

# Parte 9 — Gabarito conceitual

## 1. Predicate, Function, Consumer e Supplier

```text
Predicate<T>:
recebe T e retorna boolean.

Function<T, R>:
recebe T e retorna R.

Consumer<T>:
recebe T e retorna void.

Supplier<T>:
não recebe nada e retorna T.
```

---

## 2. Method reference

Use quando a lambda apenas chama um método já existente:

```java
Cliente::nome
Produto::disponivel
System.out::println
Email::new
```

---

## 3. Lambda melhor que method reference

Use lambda quando precisa de:

```text
parâmetro extra;
regra composta;
if;
validação;
mais de uma chamada;
clareza maior.
```

---

## 4. map vs flatMap

```text
map:
transforma um item em um valor.

flatMap:
transforma um item em vários valores e achata tudo em um único stream.
```

---

## 5. Stream vs Optional

```text
Stream:
muitos elementos.

Optional:
zero ou um elemento.
```

---

## 6. findFirst

Use quando quer o primeiro item que atende uma regra.

Retorna:

```java
Optional<T>
```

---

## 7. anyMatch

Use para pergunta:

```text
existe algum?
```

---

## 8. allMatch

Use para pergunta:

```text
todos atendem?
```

---

## 9. allMatch em lista vazia

Retorna `true`.

Se a regra exige pelo menos um item, valide:

```java
!lista.isEmpty() && lista.stream().allMatch(...)
```

---

## 10. groupingBy

Use para agrupar por chave com várias possibilidades:

```text
status;
categoria;
responsável;
cliente;
domínio.
```

---

## 11. partitioningBy

Use para separar por boolean:

```text
crítico / não crítico;
ativo / inativo;
pode faturar / não pode faturar.
```

---

## 12. reduce

Use para acumular valores em um único resultado:

```text
total;
soma;
consolidação.
```

---

## 13. BigDecimal em Stream

Use:

```java
.reduce(BigDecimal.ZERO, BigDecimal::add)
```

---

## 14. Optional.get

Evite porque pode quebrar com Optional vazio.

Prefira:

```text
orElse;
orElseGet;
orElseThrow;
map;
flatMap;
ifPresent.
```

---

## 15. Service não imprime

Service retorna dados.

Quem apresenta os dados é outra camada.

---

## 16. Regra no domínio

Porque a entidade protege invariantes e decisões do negócio.

---

## 17. Mapper

Mapper separa conversão de dados da regra de negócio.

---

## 18. for em vez de Stream

Use `for` quando há:

```text
try/catch por item;
continue;
break;
muitos efeitos colaterais;
fluxo procedural;
debug mais detalhado.
```

---

## 19. parallelStream

Exige cuidado por causa de:

```text
threads;
estado compartilhado;
ordem;
efeitos colaterais;
transações;
chamadas externas;
falta de medição.
```

---

## 20. Banco

Se o volume é grande e os dados estão persistidos, filtros, ordenações, paginações e agregações geralmente devem ir para o banco.

---

# Parte 10 — Critério de conclusão da aula

Ao final desta aula, você deve conseguir:

```text
resolver ClienteConsultaService;
resolver PedidoRelatorioService;
resolver OrdemServicoRelatorioService;
resolver refatoração de pipeline ruim;
explicar matriz de decisão;
usar checklist de code review;
resolver desafio final de AtividadeOperacionalService;
usar Optional corretamente;
usar Streams com legibilidade;
usar flatMap em coleções aninhadas;
usar Collectors para relatórios;
usar reduce para BigDecimal;
usar sorted com Comparator composto;
usar skip e limit;
decidir entre Optional, lista vazia e exceção;
decidir entre Stream e for;
manter regra no domínio;
manter mapper separado;
manter service retornando dados;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-199-exercicios-integradores-streams-functional-interfaces-e-optional
git commit -m "Aula 199: exercicios integradores streams functional interfaces e optional"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Streams, Optional e Functional Interfaces fazem sentido quando trabalham juntos com clareza arquitetural.
```

Você integrou:

```text
Predicate;
Function;
Consumer;
Supplier;
method reference;
constructor reference;
Optional;
Stream;
filter;
map;
flatMap;
sorted;
limit;
skip;
toList;
Collectors;
groupingBy;
partitioningBy;
counting;
summingInt;
reducing;
min;
max;
reduce.
```

Mais importante do que decorar métodos é saber decidir:

```text
quando usar;
onde usar;
por que usar;
quando não usar.
```

Na próxima aula, vamos fazer o fechamento técnico do Módulo 7.

Vamos revisar tudo, aplicar um simulado e preparar a transição para o próximo bloco do curso.
