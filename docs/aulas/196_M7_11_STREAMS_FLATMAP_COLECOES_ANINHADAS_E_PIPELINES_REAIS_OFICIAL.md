# 196 — M7.11 — Streams: flatMap, coleções aninhadas e pipelines reais

## Objetivo da aula

Na aula anterior, você estudou Collectors avançados:

```text
joining;
groupingBy;
partitioningBy;
mapping;
counting;
summingInt;
reducing;
relatórios por status;
relatórios por categoria;
DTOs de resumo.
```

Agora vamos estudar um dos pontos mais importantes para pipelines reais com Streams:

```text
flatMap
```

Você já viu `flatMap` com `Optional`.

Agora vai ver `flatMap` com `Stream`.

O problema que o `flatMap` resolve é muito comum:

```text
lista de pedidos, cada pedido com lista de itens;
lista de clientes, cada cliente com lista de contratos;
lista de turmas, cada turma com lista de alunos;
lista de OS, cada OS com lista de atividades;
lista de respostas de API, cada resposta com lista de registros;
lista de grupos, cada grupo com lista de permissões.
```

Ao final desta aula, você deve conseguir:

```text
entender o problema de coleções aninhadas;
entender diferença entre map e flatMap;
usar flatMap para achatar listas;
transformar Stream<List<T>> em Stream<T>;
processar pedidos com itens;
somar valores de itens;
filtrar itens de todos os pedidos;
agrupar itens por SKU;
mapear coleções aninhadas para DTOs;
evitar Optional<Optional<T>> e Stream<Stream<T>>;
entender pipelines reais com filter, map, flatMap e collect;
aplicar flatMap em domínio backend.
```

---

## Ideia principal

`map` transforma cada elemento em outro valor.

`flatMap` transforma cada elemento em um Stream e depois achata tudo em um único Stream.

Exemplo com `map`:

```java
Stream<List<ItemPedido>>
```

Exemplo com `flatMap`:

```java
Stream<ItemPedido>
```

A diferença central é:

```text
map mantém a estrutura aninhada;
flatMap achata a estrutura.
```

---

## Problema clássico

Imagine:

```java
List<Pedido> pedidos
```

Cada `Pedido` tem:

```java
List<ItemPedido> itens
```

Se você fizer:

```java
pedidos.stream()
        .map(Pedido::itens)
```

o resultado será:

```java
Stream<List<ItemPedido>>
```

Ou seja:

```text
um stream de listas.
```

Mas normalmente você quer processar todos os itens como se fossem uma lista única.

Aí entra:

```java
pedidos.stream()
        .flatMap(pedido -> pedido.itens().stream())
```

Resultado:

```java
Stream<ItemPedido>
```

---

## map vs flatMap em uma frase

```text
map:
um elemento vira um valor.

flatMap:
um elemento vira vários valores, e tudo é achatado em um único fluxo.
```

Exemplo:

```text
Pedido -> List<ItemPedido>
```

com `map`:

```text
Stream<Pedido> -> Stream<List<ItemPedido>>
```

com `flatMap`:

```text
Stream<Pedido> -> Stream<ItemPedido>
```

---

## Por que flatMap é importante no backend

Backends reais têm estruturas aninhadas.

Exemplos:

```text
Pedido possui itens.
Cliente possui contratos.
Contrato possui serviços.
OS possui atividades.
Atividade possui ocorrências.
Usuário possui permissões.
Categoria possui produtos.
Importação possui registros.
Resposta de API possui páginas e itens.
```

Sem `flatMap`, você acaba escrevendo muitos loops aninhados.

Com `flatMap`, você consegue montar pipelines mais diretos.

---

## Cuidado profissional

`flatMap` pode deixar código elegante.

Mas também pode deixar código difícil se o pipeline ficar grande demais.

Regra do curso:

```text
use flatMap para achatar coleções;
não use flatMap para esconder regra de negócio complexa.
```

Se a regra for importante, ela deve ter nome no domínio ou no service.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-196-streams-flatmap-colecoes-aninhadas-e-pipelines-reais
cd labs\m7\aula-196-streams-flatmap-colecoes-aninhadas-e-pipelines-reais
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula196
mkdir src\br\com\curso\aula196\app
mkdir src\br\com\curso\aula196\dominio
mkdir src\br\com\curso\aula196\dominio\pedido
mkdir src\br\com\curso\aula196\dominio\cliente
mkdir src\br\com\curso\aula196\dominio\ordemservico
mkdir src\br\com\curso\aula196\dto
mkdir src\br\com\curso\aula196\service
```

---

# Parte 1 — flatMap com listas simples

## Primeiro exemplo sem domínio

Crie:

```text
src\br\com\curso\aula196\app\FlatMapListasBasicoApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import java.util.List;

public class FlatMapListasBasicoApp {
    public static void main(String[] args) {
        List<List<String>> grupos = List.of(
                List.of("Ana", "Carlos"),
                List.of("Maria", "João"),
                List.of("Bruna")
        );

        List<String> todos = grupos.stream()
                .flatMap(grupo -> grupo.stream())
                .toList();

        System.out.println(todos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.FlatMapListasBasicoApp
```

---

## O que aconteceu

A estrutura original era:

```java
List<List<String>>
```

Depois do `stream()`:

```java
Stream<List<String>>
```

Depois do `flatMap`:

```java
Stream<String>
```

Depois do `toList()`:

```java
List<String>
```

Ou seja:

```text
lista de listas virou lista única.
```

---

## Comparando map e flatMap

Crie:

```text
src\br\com\curso\aula196\app\MapVsFlatMapApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import java.util.List;

public class MapVsFlatMapApp {
    public static void main(String[] args) {
        List<List<String>> grupos = List.of(
                List.of("Ana", "Carlos"),
                List.of("Maria", "João"),
                List.of("Bruna")
        );

        List<List<String>> resultadoComMap = grupos.stream()
                .map(grupo -> grupo)
                .toList();

        List<String> resultadoComFlatMap = grupos.stream()
                .flatMap(grupo -> grupo.stream())
                .toList();

        System.out.println("Com map:");
        System.out.println(resultadoComMap);

        System.out.println();

        System.out.println("Com flatMap:");
        System.out.println(resultadoComFlatMap);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.MapVsFlatMapApp
```

---

## Leitura técnica

Com `map`, cada grupo continua sendo uma lista.

Com `flatMap`, cada grupo vira um stream, e todos esses streams são unidos em um só.

Visualmente:

```text
Entrada:
[
  [Ana, Carlos],
  [Maria, João],
  [Bruna]
]

map:
[
  [Ana, Carlos],
  [Maria, João],
  [Bruna]
]

flatMap:
[
  Ana,
  Carlos,
  Maria,
  João,
  Bruna
]
```

---

# Parte 2 — flatMap com transformação

## Filtrando depois de achatar

Crie:

```text
src\br\com\curso\aula196\app\FlatMapFilterApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import java.util.List;

public class FlatMapFilterApp {
    public static void main(String[] args) {
        List<List<String>> grupos = List.of(
                List.of("Ana", "Carlos"),
                List.of("Maria", "João"),
                List.of("Bruna", "Alexandre")
        );

        List<String> nomesGrandes = grupos.stream()
                .flatMap(grupo -> grupo.stream())
                .filter(nome -> nome.length() >= 5)
                .toList();

        System.out.println(nomesGrandes);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.FlatMapFilterApp
```

---

## Ordem do pipeline

```java
grupos.stream()
        .flatMap(grupo -> grupo.stream())
        .filter(nome -> nome.length() >= 5)
        .toList();
```

Leitura:

```text
pegue grupos;
achate os nomes;
filtre nomes com 5 ou mais letras;
retorne lista.
```

Se você filtrar antes do `flatMap`, estaria filtrando grupos, não nomes.

---

## Transformando depois de achatar

Crie:

```text
src\br\com\curso\aula196\app\FlatMapMapApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import java.util.List;

public class FlatMapMapApp {
    public static void main(String[] args) {
        List<List<String>> grupos = List.of(
                List.of("Ana", "Carlos"),
                List.of("Maria", "João"),
                List.of("Bruna", "Alexandre")
        );

        List<String> nomesFormatados = grupos.stream()
                .flatMap(grupo -> grupo.stream())
                .filter(nome -> nome.length() >= 5)
                .map(String::toUpperCase)
                .toList();

        System.out.println(nomesFormatados);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.FlatMapMapApp
```

---

# Parte 3 — Domínio Pedido com Itens

Agora vamos aplicar no domínio mais clássico:

```text
Pedido -> Itens do pedido
```

## ItemPedido

Crie:

```text
src\br\com\curso\aula196\dominio\pedido\ItemPedido.java
```

Código:

```java
package br.com.curso.aula196.dominio.pedido;

import java.math.BigDecimal;
import java.util.Objects;

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

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof ItemPedido itemPedido)) {
            return false;
        }

        return Objects.equals(sku, itemPedido.sku);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sku);
    }
}
```

---

## Pedido

Crie:

```text
src\br\com\curso\aula196\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula196.dominio.pedido;

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
            throw new IllegalArgumentException("Pedido precisa ter ao menos um item.");
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

## App listando todos os itens de todos os pedidos

Crie:

```text
src\br\com\curso\aula196\app\PedidoFlatMapItensApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import br.com.curso.aula196.dominio.pedido.ItemPedido;
import br.com.curso.aula196.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PedidoFlatMapItensApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = criarPedidos();

        List<ItemPedido> todosItens = pedidos.stream()
                .flatMap(pedido -> pedido.itens().stream())
                .toList();

        todosItens.forEach(item -> System.out.println(item.resumo()));
    }

    private static List<Pedido> criarPedidos() {
        return List.of(
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
                )
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.PedidoFlatMapItensApp
```

---

## Como ler este flatMap

```java
pedidos.stream()
        .flatMap(pedido -> pedido.itens().stream())
        .toList();
```

Leitura:

```text
pegue pedidos;
para cada pedido, pegue a lista de itens;
transforme cada lista de itens em stream;
una todos os streams de itens em um único stream;
retorne todos os itens em uma lista.
```

---

# Parte 4 — Agregações com flatMap

## Somando todos os subtotais

Crie:

```text
src\br\com\curso\aula196\app\PedidoFlatMapTotalItensApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import br.com.curso.aula196.dominio.pedido.ItemPedido;
import br.com.curso.aula196.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PedidoFlatMapTotalItensApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = criarPedidos();

        BigDecimal totalItens = pedidos.stream()
                .flatMap(pedido -> pedido.itens().stream())
                .map(ItemPedido::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        System.out.println("Total dos itens: " + totalItens);
    }

    private static List<Pedido> criarPedidos() {
        return List.of(
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
                )
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.PedidoFlatMapTotalItensApp
```

---

## Contando quantidade total de itens

Crie:

```text
src\br\com\curso\aula196\app\PedidoFlatMapQuantidadeItensApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import br.com.curso.aula196.dominio.pedido.ItemPedido;
import br.com.curso.aula196.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PedidoFlatMapQuantidadeItensApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = criarPedidos();

        int quantidadeTotal = pedidos.stream()
                .flatMap(pedido -> pedido.itens().stream())
                .mapToInt(ItemPedido::quantidade)
                .sum();

        System.out.println("Quantidade total de unidades: " + quantidadeTotal);
    }

    private static List<Pedido> criarPedidos() {
        return List.of(
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
                )
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.PedidoFlatMapQuantidadeItensApp
```

---

## Filtrando itens de pedidos faturáveis

Crie:

```text
src\br\com\curso\aula196\app\PedidoFlatMapItensFaturaveisApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import br.com.curso.aula196.dominio.pedido.ItemPedido;
import br.com.curso.aula196.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PedidoFlatMapItensFaturaveisApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = criarPedidos();

        List<ItemPedido> itensFaturaveis = pedidos.stream()
                .filter(Pedido::podeFaturar)
                .flatMap(pedido -> pedido.itens().stream())
                .filter(item -> item.subtotal().compareTo(new BigDecimal("100.00")) > 0)
                .toList();

        itensFaturaveis.forEach(item -> System.out.println(item.resumo()));
    }

    private static List<Pedido> criarPedidos() {
        return List.of(
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
                        false,
                        false,
                        List.of(
                                new ItemPedido("SKU-003", "Monitor", new BigDecimal("1200.00"), 1),
                                new ItemPedido("SKU-002", "Mouse", new BigDecimal("80.00"), 1)
                        )
                )
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.PedidoFlatMapItensFaturaveisApp
```

---

## Ordem faz diferença

Neste pipeline:

```java
pedidos.stream()
        .filter(Pedido::podeFaturar)
        .flatMap(pedido -> pedido.itens().stream())
        .filter(item -> item.subtotal().compareTo(new BigDecimal("100.00")) > 0)
        .toList();
```

Primeiro filtramos pedidos faturáveis.

Depois achatamos os itens desses pedidos.

Depois filtramos os itens.

Isso evita processar itens de pedidos que nem podem faturar.

---

# Parte 5 — Agrupando itens após flatMap

## Quantidade por SKU

Crie:

```text
src\br\com\curso\aula196\app\PedidoFlatMapQuantidadePorSkuApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import br.com.curso.aula196.dominio.pedido.ItemPedido;
import br.com.curso.aula196.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PedidoFlatMapQuantidadePorSkuApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = criarPedidos();

        Map<String, Integer> quantidadePorSku = pedidos.stream()
                .flatMap(pedido -> pedido.itens().stream())
                .collect(Collectors.groupingBy(
                        ItemPedido::sku,
                        Collectors.summingInt(ItemPedido::quantidade)
                ));

        System.out.println(quantidadePorSku);
    }

    private static List<Pedido> criarPedidos() {
        return List.of(
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
                )
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.PedidoFlatMapQuantidadePorSkuApp
```

---

## Total financeiro por SKU

Crie:

```text
src\br\com\curso\aula196\app\PedidoFlatMapTotalPorSkuApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import br.com.curso.aula196.dominio.pedido.ItemPedido;
import br.com.curso.aula196.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PedidoFlatMapTotalPorSkuApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = criarPedidos();

        Map<String, BigDecimal> totalPorSku = pedidos.stream()
                .flatMap(pedido -> pedido.itens().stream())
                .collect(Collectors.groupingBy(
                        ItemPedido::sku,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                ItemPedido::subtotal,
                                BigDecimal::add
                        )
                ));

        System.out.println(totalPorSku);
    }

    private static List<Pedido> criarPedidos() {
        return List.of(
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
                )
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.PedidoFlatMapTotalPorSkuApp
```

---

## O que este exemplo representa

Esse tipo de pipeline aparece em relatórios:

```text
total vendido por produto;
quantidade vendida por SKU;
itens mais vendidos;
consolidação por categoria;
dashboard financeiro.
```

Em banco, isso provavelmente viraria:

```sql
group by sku
sum(quantidade)
sum(subtotal)
```

Em memória, `flatMap + groupingBy` resolve.

---

# Parte 6 — DTO de item consolidado

## ItemConsolidadoResponse

Crie:

```text
src\br\com\curso\aula196\dto\ItemConsolidadoResponse.java
```

Código:

```java
package br.com.curso.aula196.dto;

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
src\br\com\curso\aula196\service\PedidoRelatorioService.java
```

Código:

```java
package br.com.curso.aula196.service;

import br.com.curso.aula196.dominio.pedido.ItemPedido;
import br.com.curso.aula196.dominio.pedido.Pedido;
import br.com.curso.aula196.dto.ItemConsolidadoResponse;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PedidoRelatorioService {
    private final List<Pedido> pedidos;

    public PedidoRelatorioService(List<Pedido> pedidos) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Pedidos são obrigatórios.");
        }

        this.pedidos = List.copyOf(pedidos);
    }

    public List<ItemPedido> listarTodosItens() {
        return pedidos.stream()
                .flatMap(pedido -> pedido.itens().stream())
                .toList();
    }

    public List<ItemPedido> listarItensDePedidosFaturaveis() {
        return pedidos.stream()
                .filter(Pedido::podeFaturar)
                .flatMap(pedido -> pedido.itens().stream())
                .toList();
    }

    public BigDecimal calcularTotalFaturavel() {
        return pedidos.stream()
                .filter(Pedido::podeFaturar)
                .flatMap(pedido -> pedido.itens().stream())
                .map(ItemPedido::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<ItemConsolidadoResponse> consolidarItensPorSku() {
        Map<String, Integer> quantidadePorSku = pedidos.stream()
                .flatMap(pedido -> pedido.itens().stream())
                .collect(Collectors.groupingBy(
                        ItemPedido::sku,
                        Collectors.summingInt(ItemPedido::quantidade)
                ));

        Map<String, BigDecimal> totalPorSku = pedidos.stream()
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
                .sorted(Comparator.comparing(ItemConsolidadoResponse::sku))
                .toList();
    }
}
```

---

## App PedidoRelatorioService

Crie:

```text
src\br\com\curso\aula196\app\PedidoRelatorioServiceApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import br.com.curso.aula196.dominio.pedido.ItemPedido;
import br.com.curso.aula196.dominio.pedido.Pedido;
import br.com.curso.aula196.dto.ItemConsolidadoResponse;
import br.com.curso.aula196.service.PedidoRelatorioService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PedidoRelatorioServiceApp {
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
                )
        );

        PedidoRelatorioService service = new PedidoRelatorioService(pedidos);

        System.out.println("Todos os itens:");
        service.listarTodosItens().forEach(item -> System.out.println("  " + item.resumo()));

        System.out.println();

        System.out.println("Total faturável:");
        System.out.println(service.calcularTotalFaturavel());

        System.out.println();

        System.out.println("Itens consolidados:");
        List<ItemConsolidadoResponse> consolidados = service.consolidarItensPorSku();
        consolidados.forEach(item -> System.out.println("  " + item.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.PedidoRelatorioServiceApp
```

---

## Ponto arquitetural

O service não imprime.

Ele retorna:

```text
List<ItemPedido>;
BigDecimal;
List<ItemConsolidadoResponse>.
```

O app imprime apenas para demonstrar.

Em backend real, o controller chamaria o service e retornaria JSON.

---

# Parte 7 — Cliente com contratos

Agora vamos ver outro domínio comum:

```text
Cliente -> Contratos
```

## ContratoCliente

Crie:

```text
src\br\com\curso\aula196\dominio\cliente\ContratoCliente.java
```

Código:

```java
package br.com.curso.aula196.dominio.cliente;

import java.time.LocalDate;

public class ContratoCliente {
    private final String codigo;
    private final String tipo;
    private final LocalDate inicio;
    private final LocalDate fim;

    public ContratoCliente(String codigo, String tipo, LocalDate inicio, LocalDate fim) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código do contrato é obrigatório.");
        }

        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("Tipo é obrigatório.");
        }

        if (inicio == null) {
            throw new IllegalArgumentException("Início é obrigatório.");
        }

        if (fim != null && fim.isBefore(inicio)) {
            throw new IllegalArgumentException("Fim não pode ser anterior ao início.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.tipo = tipo.trim().toUpperCase();
        this.inicio = inicio;
        this.fim = fim;
    }

    public String codigo() {
        return codigo;
    }

    public String tipo() {
        return tipo;
    }

    public LocalDate inicio() {
        return inicio;
    }

    public LocalDate fim() {
        return fim;
    }

    public boolean vigenteEm(LocalDate data) {
        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        boolean depoisOuIgualInicio = !data.isBefore(inicio);
        boolean semFim = fim == null;
        boolean antesOuIgualFim = fim != null && !data.isAfter(fim);

        return depoisOuIgualInicio && (semFim || antesOuIgualFim);
    }

    public String resumo() {
        return codigo
                + " | Tipo: " + tipo
                + " | Início: " + inicio
                + " | Fim: " + fim;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## Cliente

Crie:

```text
src\br\com\curso\aula196\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula196.dominio.cliente;

import java.util.List;

public class Cliente {
    private final String nome;
    private final String email;
    private final boolean ativo;
    private final List<ContratoCliente> contratos;

    public Cliente(String nome, String email, boolean ativo, List<ContratoCliente> contratos) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        if (contratos == null) {
            throw new IllegalArgumentException("Contratos são obrigatórios.");
        }

        this.nome = nome.trim();
        this.email = email.trim().toLowerCase();
        this.ativo = ativo;
        this.contratos = List.copyOf(contratos);
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

    public List<ContratoCliente> contratos() {
        return contratos;
    }

    public String resumo() {
        return nome
                + " | " + email
                + " | Ativo: " + ativo
                + " | Contratos: " + contratos.size();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## App contratos vigentes

Crie:

```text
src\br\com\curso\aula196\app\ClienteFlatMapContratosApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import br.com.curso.aula196.dominio.cliente.Cliente;
import br.com.curso.aula196.dominio.cliente.ContratoCliente;

import java.time.LocalDate;
import java.util.List;

public class ClienteFlatMapContratosApp {
    public static void main(String[] args) {
        LocalDate hoje = LocalDate.of(2026, 7, 8);

        List<Cliente> clientes = List.of(
                new Cliente(
                        "Ana Silva",
                        "ana@empresa.com",
                        true,
                        List.of(
                                new ContratoCliente("CTR-001", "MMS", LocalDate.of(2026, 1, 1), null),
                                new ContratoCliente("CTR-002", "SUPORTE", LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31))
                        )
                ),
                new Cliente(
                        "Carlos Souza",
                        "carlos@empresa.com",
                        true,
                        List.of(
                                new ContratoCliente("CTR-003", "MMS", LocalDate.of(2026, 6, 1), LocalDate.of(2026, 12, 31))
                        )
                )
        );

        List<ContratoCliente> vigentes = clientes.stream()
                .filter(Cliente::ativo)
                .flatMap(cliente -> cliente.contratos().stream())
                .filter(contrato -> contrato.vigenteEm(hoje))
                .toList();

        vigentes.forEach(contrato -> System.out.println(contrato.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.ClienteFlatMapContratosApp
```

---

# Parte 8 — Ordem de Serviço com atividades

## AtividadeOs

Crie:

```text
src\br\com\curso\aula196\dominio\ordemservico\AtividadeOs.java
```

Código:

```java
package br.com.curso.aula196.dominio.ordemservico;

public class AtividadeOs {
    private final String codigo;
    private final String descricao;
    private final String status;
    private final boolean obrigatoria;
    private final int tentativas;

    public AtividadeOs(String codigo, String descricao, String status, boolean obrigatoria, int tentativas) {
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

        this.codigo = codigo.trim().toUpperCase();
        this.descricao = descricao.trim();
        this.status = status.trim().toUpperCase();
        this.obrigatoria = obrigatoria;
        this.tentativas = tentativas;
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

    public int tentativas() {
        return tentativas;
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

    public String resumo() {
        return codigo
                + " | " + descricao
                + " | Status: " + status
                + " | Obrigatória: " + obrigatoria
                + " | Tentativas: " + tentativas;
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
src\br\com\curso\aula196\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula196.dominio.ordemservico;

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

## OrdemServicoAtividadeService

Crie:

```text
src\br\com\curso\aula196\service\OrdemServicoAtividadeService.java
```

Código:

```java
package br.com.curso.aula196.service;

import br.com.curso.aula196.dominio.ordemservico.AtividadeOs;
import br.com.curso.aula196.dominio.ordemservico.OrdemServico;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class OrdemServicoAtividadeService {
    private final List<OrdemServico> ordens;

    public OrdemServicoAtividadeService(List<OrdemServico> ordens) {
        if (ordens == null) {
            throw new IllegalArgumentException("Ordens são obrigatórias.");
        }

        this.ordens = List.copyOf(ordens);
    }

    public List<AtividadeOs> listarAtividadesExecutaveis() {
        return ordens.stream()
                .filter(OrdemServico::aberta)
                .flatMap(os -> os.atividades().stream())
                .filter(AtividadeOs::podeExecutar)
                .toList();
    }

    public Map<String, Long> contarAtividadesPorStatus() {
        return ordens.stream()
                .flatMap(os -> os.atividades().stream())
                .collect(Collectors.groupingBy(
                        AtividadeOs::status,
                        Collectors.counting()
                ));
    }

    public Map<Boolean, List<AtividadeOs>> separarObrigatorias() {
        return ordens.stream()
                .flatMap(os -> os.atividades().stream())
                .collect(Collectors.partitioningBy(AtividadeOs::obrigatoria));
    }

    public int somarTentativasDePendentes() {
        return ordens.stream()
                .flatMap(os -> os.atividades().stream())
                .filter(AtividadeOs::pendente)
                .mapToInt(AtividadeOs::tentativas)
                .sum();
    }
}
```

---

## App OrdemServicoAtividadeService

Crie:

```text
src\br\com\curso\aula196\app\OrdemServicoAtividadeServiceApp.java
```

Código:

```java
package br.com.curso.aula196.app;

import br.com.curso.aula196.dominio.ordemservico.AtividadeOs;
import br.com.curso.aula196.dominio.ordemservico.OrdemServico;
import br.com.curso.aula196.service.OrdemServicoAtividadeService;

import java.util.List;
import java.util.Map;

public class OrdemServicoAtividadeServiceApp {
    public static void main(String[] args) {
        List<OrdemServico> ordens = List.of(
                new OrdemServico(
                        "OS-001",
                        "Ana",
                        "ABERTA",
                        List.of(
                                new AtividadeOs("ATV-001", "Confirmar entrega", "PENDENTE", true, 1),
                                new AtividadeOs("ATV-002", "Gerar checklist", "CONCLUIDA", true, 0)
                        )
                ),
                new OrdemServico(
                        "OS-002",
                        "Carlos",
                        "ABERTA",
                        List.of(
                                new AtividadeOs("ATV-003", "Reagendar", "PENDENTE", false, 4),
                                new AtividadeOs("ATV-004", "Validar contato", "PENDENTE", true, 2)
                        )
                )
        );

        OrdemServicoAtividadeService service = new OrdemServicoAtividadeService(ordens);

        System.out.println("Atividades executáveis:");
        service.listarAtividadesExecutaveis().forEach(atividade -> System.out.println("  " + atividade.resumo()));

        System.out.println();

        System.out.println("Atividades por status:");
        System.out.println(service.contarAtividadesPorStatus());

        System.out.println();

        System.out.println("Obrigatórias:");
        Map<Boolean, List<AtividadeOs>> obrigatorias = service.separarObrigatorias();
        obrigatorias.get(true).forEach(atividade -> System.out.println("  " + atividade.resumo()));

        System.out.println();

        System.out.println("Soma tentativas pendentes:");
        System.out.println(service.somarTentativasDePendentes());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula196.app.OrdemServicoAtividadeServiceApp
```

---

# Parte 9 — flatMap com Optional

Você já estudou `flatMap` em Optional no Módulo 6.

Agora vale comparar novamente.

## Optional com map

Se uma função retorna Optional e você usa `map`, pode gerar:

```java
Optional<Optional<Cliente>>
```

## Optional com flatMap

Se uma função retorna Optional e você usa `flatMap`, o resultado fica:

```java
Optional<Cliente>
```

## Stream com map

Se uma função retorna Stream e você usa `map`, pode gerar:

```java
Stream<Stream<ItemPedido>>
```

## Stream com flatMap

Se uma função retorna Stream e você usa `flatMap`, o resultado fica:

```java
Stream<ItemPedido>
```

A ideia é a mesma:

```text
flatMap evita aninhamento desnecessário.
```

---

# Parte 10 — Erros comuns

## 1. Usar map quando precisava de flatMap

Errado para achatar:

```java
pedidos.stream()
        .map(Pedido::itens)
        .toList();
```

Resultado:

```java
List<List<ItemPedido>>
```

Se você queria todos os itens:

```java
pedidos.stream()
        .flatMap(pedido -> pedido.itens().stream())
        .toList();
```

---

## 2. Fazer flatMap antes do filtro errado

Cuidado com a ordem.

Se você quer itens apenas de pedidos faturáveis:

```java
pedidos.stream()
        .filter(Pedido::podeFaturar)
        .flatMap(pedido -> pedido.itens().stream())
```

Não comece achatando tudo se o filtro de pedido elimina muita coisa.

---

## 3. Esquecer que flatMap precisa retornar Stream

A função dentro do `flatMap` precisa retornar Stream.

Certo:

```java
.flatMap(pedido -> pedido.itens().stream())
```

Errado:

```java
.flatMap(Pedido::itens)
```

porque `Pedido::itens` retorna `List<ItemPedido>`, não `Stream<ItemPedido>`.

---

## 4. Pipeline longo demais

Evite pipelines enormes.

Se ficar difícil, quebre:

```java
List<ItemPedido> itens = pedidos.stream()
        .flatMap(pedido -> pedido.itens().stream())
        .toList();
```

Depois trabalhe com `itens`.

---

## 5. Regra de negócio escondida

Evite:

```java
.filter(p -> p.pago() && !p.cancelado())
```

se isso é regra importante.

Prefira:

```java
.filter(Pedido::podeFaturar)
```

---

## 6. Processar grandes volumes aninhados em memória sem pensar

Se os dados vêm do banco, talvez seja melhor buscar de forma otimizada ou agregar no SQL.

`flatMap` em memória é ótimo quando os dados já estão carregados e o volume é controlado.

---

# Parte 11 — Boas práticas

## 1. Use nomes claros

Bom:

```java
listarTodosItens()
calcularTotalFaturavel()
consolidarItensPorSku()
listarAtividadesExecutaveis()
```

Nomes bons reduzem complexidade.

---

## 2. Coloque regra no domínio

Bom:

```java
Pedido::podeFaturar
ItemPedido::subtotal
AtividadeOs::podeExecutar
ContratoCliente::vigenteEm
```

O Stream organiza.

A entidade decide.

---

## 3. Use DTOs para retorno consolidado

Quando o retorno é relatório, crie DTO:

```java
ItemConsolidadoResponse
ResumoAtividadeResponse
ResumoStatusResponse
```

Evite retornar `Map` complexo demais para fora do service quando um DTO seria mais claro.

---

## 4. Filtre antes de achatar quando fizer sentido

Se o filtro é no pai, aplique antes do `flatMap`.

Exemplo:

```java
pedidos.stream()
        .filter(Pedido::podeFaturar)
        .flatMap(pedido -> pedido.itens().stream())
```

---

## 5. Achate antes de filtrar quando a regra é no filho

Se a regra é no item, achate primeiro.

Exemplo:

```java
pedidos.stream()
        .flatMap(pedido -> pedido.itens().stream())
        .filter(item -> item.quantidade() > 1)
```

---

# Parte 12 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula196.app.FlatMapListasBasicoApp
java -cp out br.com.curso.aula196.app.MapVsFlatMapApp
java -cp out br.com.curso.aula196.app.FlatMapFilterApp
java -cp out br.com.curso.aula196.app.FlatMapMapApp
java -cp out br.com.curso.aula196.app.PedidoFlatMapItensApp
java -cp out br.com.curso.aula196.app.PedidoFlatMapTotalItensApp
java -cp out br.com.curso.aula196.app.PedidoFlatMapQuantidadeItensApp
java -cp out br.com.curso.aula196.app.PedidoFlatMapItensFaturaveisApp
java -cp out br.com.curso.aula196.app.PedidoFlatMapQuantidadePorSkuApp
java -cp out br.com.curso.aula196.app.PedidoFlatMapTotalPorSkuApp
java -cp out br.com.curso.aula196.app.PedidoRelatorioServiceApp
java -cp out br.com.curso.aula196.app.ClienteFlatMapContratosApp
java -cp out br.com.curso.aula196.app.OrdemServicoAtividadeServiceApp
```

Para cada execução, responda:

```text
qual era a estrutura aninhada?
qual era o tipo antes do flatMap?
qual era o tipo depois do flatMap?
o filtro era no pai ou no filho?
houve agregação depois do flatMap?
o pipeline ficou claro?
alguma regra deveria estar no domínio?
```

---

# Parte 13 — Desafio prático

Crie entidade:

```text
src\br\com\curso\aula196\dominio\curso\Aula.java
```

Campos:

```text
String codigo;
String titulo;
int minutos;
boolean obrigatoria;
boolean concluida;
```

Regras:

```text
codigo obrigatório;
titulo obrigatório;
minutos maior que zero;
pendente() retorna !concluida;
podeEstudar() retorna obrigatoria && pendente;
resumo().
```

Crie entidade:

```text
src\br\com\curso\aula196\dominio\curso\ModuloCurso.java
```

Campos:

```text
String codigo;
String nome;
List<Aula> aulas;
```

Regras:

```text
codigo obrigatório;
nome obrigatório;
aulas não pode ser null;
resumo().
```

Crie service:

```text
src\br\com\curso\aula196\service\CursoRelatorioService.java
```

Métodos:

```java
List<Aula> listarTodasAulas()

List<Aula> listarAulasObrigatoriasPendentes()

int calcularMinutosPendentes()

Map<String, Long> contarAulasPorStatus()

Map<Boolean, List<Aula>> separarObrigatorias()

List<String> listarTitulosPendentes()
```

Critérios:

```text
usar flatMap para achatar aulas dos módulos;
usar filter;
usar map;
usar mapToInt;
usar groupingBy;
usar partitioningBy;
não imprimir dentro do service.
```

Crie app:

```text
src\br\com\curso\aula196\app\CursoRelatorioServiceApp.java
```

---

## Desafio extra

Crie DTO:

```text
ResumoModuloResponse
```

Campos:

```text
codigoModulo;
nomeModulo;
long quantidadeAulas;
long quantidadePendentes;
int minutosPendentes;
```

No service, crie:

```java
List<ResumoModuloResponse> resumirModulos()
```

Critério:

```text
aqui talvez NÃO precise de flatMap, porque o resumo é por módulo.
```

Objetivo do desafio:

```text
saber quando usar flatMap e quando não usar.
```

---

# Parte 14 — Debug recomendado

Coloque breakpoints em:

```text
MapVsFlatMapApp
PedidoFlatMapItensApp
PedidoFlatMapTotalItensApp
PedidoRelatorioService
ClienteFlatMapContratosApp
OrdemServicoAtividadeService
```

Pontos de atenção:

```java
.map(...)
.flatMap(...)
.flatMap(pedido -> pedido.itens().stream())
.collect(...)
.reduce(...)
```

Observe:

```text
como map preserva lista dentro do stream;
como flatMap achata;
como cada pedido abre seus itens;
como os itens entram no próximo filter;
como agregações usam os itens já achatados;
como DTO consolidado é montado.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre map e flatMap?
2. O que significa achatar uma coleção?
3. Por que Pedido -> Itens é um caso clássico de flatMap?
4. Quando filtrar antes do flatMap?
5. Quando não usar flatMap?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar flatMap com List<List<T>>;
explicar Stream<List<T>> vs Stream<T>;
diferenciar map de flatMap;
usar flatMap em Pedido -> Itens;
somar subtotais com flatMap;
contar quantidades com flatMap;
agrupar itens por SKU;
consolidar itens em DTO;
usar flatMap em Cliente -> Contratos;
usar flatMap em OS -> Atividades;
saber filtrar antes ou depois do flatMap;
evitar pipeline aninhado confuso;
resolver CursoRelatorioServiceApp;
resolver ResumoModuloResponse;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-196-streams-flatmap-colecoes-aninhadas-e-pipelines-reais
git commit -m "Aula 196: streams flatmap colecoes aninhadas e pipelines reais"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
flatMap transforma estruturas aninhadas em um fluxo único de elementos.
```

Você estudou:

```text
map vs flatMap;
List<List<T>>;
Stream<List<T>>;
Stream<T>;
Pedido com itens;
Cliente com contratos;
Ordem de Serviço com atividades;
agregações após flatMap;
groupingBy após flatMap;
DTO consolidado.
```

Também reforçou uma decisão importante:

```text
use flatMap quando precisa processar filhos de vários pais como uma sequência única.
```

Na próxima aula, vamos estudar:

```text
Streams com Optional e pipelines seguros
```

Vamos conectar `Optional`, `Stream`, `flatMap`, `findFirst`, `orElseThrow`, tratamento de ausência e boas práticas para services de consulta.
