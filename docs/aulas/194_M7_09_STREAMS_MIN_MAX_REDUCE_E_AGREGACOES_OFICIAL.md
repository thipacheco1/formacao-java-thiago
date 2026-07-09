# 194 — M7.09 — Streams: min, max, reduce e agregações

## Objetivo da aula

Na aula anterior, você estudou operações de organização e recorte em Streams:

```text
sorted;
Comparator;
distinct;
limit;
skip;
paginação em memória;
top N;
ordenação por múltiplos critérios.
```

Agora vamos avançar para operações de agregação e redução:

```text
min;
max;
reduce;
soma;
totalização;
maior valor;
menor valor;
acumuladores;
agregações simples.
```

Essas operações são muito importantes em backend porque aparecem em cenários como:

```text
calcular total de pedidos;
encontrar maior valor;
encontrar menor valor;
somar valores de uma lista;
calcular quantidade total de itens;
gerar resumo financeiro;
montar indicadores;
validar limites;
montar dashboards;
processar relatórios;
consolidar resultados.
```

Ao final desta aula, você deve conseguir:

```text
usar min com Comparator;
usar max com Comparator;
entender por que min/max retornam Optional;
usar reduce com valor inicial;
usar reduce sem valor inicial;
somar BigDecimal com reduce;
somar int com mapToInt;
entender diferença entre reduce e collectors;
criar agregações simples;
criar resumo de domínio;
evitar erros comuns com BigDecimal;
evitar reduce complexo demais;
aplicar agregações em Produto, Pedido e Ordem de Serviço;
entender quando usar Stream e quando criar objeto de resumo.
```

---

## Ideia principal

Streams não servem apenas para filtrar e transformar listas.

Streams também podem reduzir vários elementos em um único resultado.

Exemplos:

```java
Optional<Produto> maisCaro = produtos.stream()
        .max(Comparator.comparing(Produto::preco));
```

```java
BigDecimal total = pedidos.stream()
        .map(Pedido::valor)
        .reduce(BigDecimal.ZERO, BigDecimal::add);
```

```java
int totalEstoque = produtos.stream()
        .mapToInt(Produto::estoque)
        .sum();
```

A ideia é:

```text
muitos elementos entram;
um resultado sai.
```

---

## O que é agregação

Agregação é consolidar vários dados em um resultado.

Exemplos:

```text
lista de pedidos -> valor total;
lista de produtos -> maior preço;
lista de OS -> quantidade crítica;
lista de itens -> soma de quantidades;
lista de clientes -> primeiro cliente premium;
lista de pagamentos -> total aprovado.
```

Em backend, agregações são comuns em:

```text
relatórios;
dashboards;
consultas administrativas;
validações;
resumos de operação;
retornos de API;
processamentos em lote.
```

---

## Operações desta aula

Vamos estudar:

```text
min:
menor elemento conforme Comparator.

max:
maior elemento conforme Comparator.

reduce:
reduz elementos em um único resultado.

mapToInt:
transforma em IntStream.

sum:
soma números em streams primitivos.

BigDecimal::add:
soma monetária com segurança.
```

Tabela rápida:

```text
min(Comparator)       -> Optional<T>
max(Comparator)       -> Optional<T>
reduce(...)           -> T ou Optional<T>
mapToInt(...).sum()   -> int
map(...).reduce(...)  -> resultado acumulado
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-194-streams-min-max-reduce-e-agregacoes
cd labs\m7\aula-194-streams-min-max-reduce-e-agregacoes
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula194
mkdir src\br\com\curso\aula194\app
mkdir src\br\com\curso\aula194\dominio
mkdir src\br\com\curso\aula194\dominio\produto
mkdir src\br\com\curso\aula194\dominio\pedido
mkdir src\br\com\curso\aula194\dominio\ordemservico
mkdir src\br\com\curso\aula194\dto
mkdir src\br\com\curso\aula194\service
```

---

# Parte 1 — min

## O que é min

`min` retorna o menor elemento do Stream conforme um `Comparator`.

Assinatura conceitual:

```java
Optional<T> min(Comparator<? super T> comparator)
```

Exemplo:

```java
Optional<Integer> menor = numeros.stream()
        .min(Integer::compareTo);
```

Ou:

```java
Optional<String> menorNome = nomes.stream()
        .min(Comparator.naturalOrder());
```

---

## App básico com min

Crie:

```text
src\br\com\curso\aula194\app\StreamMinBasicoApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class StreamMinBasicoApp {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(30, 10, 50, 20, 40);

        Optional<Integer> menor = numeros.stream()
                .min(Comparator.naturalOrder());

        System.out.println("Menor número: " + menor.orElse(0));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.StreamMinBasicoApp
```

---

## Por que min retorna Optional

Se a lista estiver vazia, não existe menor elemento.

Por isso o retorno é:

```java
Optional<T>
```

Exemplo:

```java
List<Integer> numeros = List.of();

Optional<Integer> menor = numeros.stream()
        .min(Comparator.naturalOrder());
```

Resultado:

```java
Optional.empty()
```

---

## App min com lista vazia

Crie:

```text
src\br\com\curso\aula194\app\StreamMinListaVaziaApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class StreamMinListaVaziaApp {
    public static void main(String[] args) {
        List<Integer> numeros = List.of();

        Optional<Integer> menor = numeros.stream()
                .min(Comparator.naturalOrder());

        System.out.println(menor.orElse(-1));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.StreamMinListaVaziaApp
```

---

# Parte 2 — max

## O que é max

`max` retorna o maior elemento do Stream conforme um `Comparator`.

Assinatura conceitual:

```java
Optional<T> max(Comparator<? super T> comparator)
```

Exemplo:

```java
Optional<Integer> maior = numeros.stream()
        .max(Comparator.naturalOrder());
```

---

## App básico com max

Crie:

```text
src\br\com\curso\aula194\app\StreamMaxBasicoApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class StreamMaxBasicoApp {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(30, 10, 50, 20, 40);

        Optional<Integer> maior = numeros.stream()
                .max(Comparator.naturalOrder());

        System.out.println("Maior número: " + maior.orElse(0));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.StreamMaxBasicoApp
```

---

## min/max com String

Crie:

```text
src\br\com\curso\aula194\app\StreamMinMaxStringApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import java.util.Comparator;
import java.util.List;

public class StreamMinMaxStringApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Bruna");

        String primeiroAlfabetico = nomes.stream()
                .min(Comparator.naturalOrder())
                .orElse("Nenhum");

        String ultimoAlfabetico = nomes.stream()
                .max(Comparator.naturalOrder())
                .orElse("Nenhum");

        String menorNome = nomes.stream()
                .min(Comparator.comparing(String::length))
                .orElse("Nenhum");

        String maiorNome = nomes.stream()
                .max(Comparator.comparing(String::length))
                .orElse("Nenhum");

        System.out.println("Primeiro alfabético: " + primeiroAlfabetico);
        System.out.println("Último alfabético: " + ultimoAlfabetico);
        System.out.println("Menor nome: " + menorNome);
        System.out.println("Maior nome: " + maiorNome);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.StreamMinMaxStringApp
```

---

## Comparador define o que é menor ou maior

Este trecho:

```java
.min(Comparator.naturalOrder())
```

usa ordem natural.

Este trecho:

```java
.min(Comparator.comparing(String::length))
```

usa tamanho da String.

Ou seja:

```text
menor/maior depende do critério do Comparator.
```

---

# Parte 3 — reduce

## O que é reduce

`reduce` combina vários elementos em um único resultado.

Exemplos de redução:

```text
somar números;
concatenar textos;
calcular total;
calcular acumulado;
juntar informações;
consolidar valores.
```

Exemplo:

```java
Integer soma = numeros.stream()
        .reduce(0, Integer::sum);
```

Leitura:

```text
comece com 0;
para cada número, some no acumulador;
retorne o total.
```

---

## App básico com reduce

Crie:

```text
src\br\com\curso\aula194\app\StreamReduceSomaApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import java.util.List;

public class StreamReduceSomaApp {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(10, 20, 30, 40);

        Integer soma = numeros.stream()
                .reduce(0, Integer::sum);

        System.out.println("Soma: " + soma);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.StreamReduceSomaApp
```

---

## Como ler reduce com valor inicial

```java
.reduce(0, Integer::sum)
```

Significa:

```text
valor inicial:
0

operação:
some acumulado com próximo número.
```

Equivalente mental:

```java
int acumulado = 0;

for (Integer numero : numeros) {
    acumulado = acumulado + numero;
}
```

---

## reduce sem valor inicial

Quando você usa reduce sem valor inicial, o retorno é Optional.

Exemplo:

```java
Optional<Integer> soma = numeros.stream()
        .reduce(Integer::sum);
```

Por quê?

Porque se a lista estiver vazia, não existe resultado.

Crie:

```text
src\br\com\curso\aula194\app\StreamReduceSemInicialApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import java.util.List;
import java.util.Optional;

public class StreamReduceSemInicialApp {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(10, 20, 30, 40);

        Optional<Integer> soma = numeros.stream()
                .reduce(Integer::sum);

        System.out.println("Soma: " + soma.orElse(0));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.StreamReduceSemInicialApp
```

---

## Quando preferir reduce com valor inicial

Para soma, geralmente prefira:

```java
.reduce(0, Integer::sum)
```

ou streams primitivos:

```java
.mapToInt(...).sum()
```

Porque você já sabe qual é o valor neutro da soma:

```text
0
```

Para BigDecimal:

```java
.reduce(BigDecimal.ZERO, BigDecimal::add)
```

---

# Parte 4 — mapToInt e sum

## O que é mapToInt

`mapToInt` transforma um Stream de objetos em um `IntStream`.

Exemplo:

```java
int total = produtos.stream()
        .mapToInt(Produto::estoque)
        .sum();
```

Isso é útil para somar campos inteiros.

---

## App com mapToInt

Crie:

```text
src\br\com\curso\aula194\app\StreamMapToIntSumApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import java.util.List;

public class StreamMapToIntSumApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        int totalCaracteres = nomes.stream()
                .mapToInt(String::length)
                .sum();

        System.out.println("Total de caracteres: " + totalCaracteres);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.StreamMapToIntSumApp
```

---

## reduce vs mapToInt

Para somar inteiros, estas duas formas são possíveis:

```java
Integer soma = numeros.stream()
        .reduce(0, Integer::sum);
```

e:

```java
int soma = numeros.stream()
        .mapToInt(Integer::intValue)
        .sum();
```

`mapToInt().sum()` costuma ser mais direto para inteiros.

`reduce` é mais geral e serve para outros tipos de acumulação.

---

# Parte 5 — BigDecimal com reduce

## Por que BigDecimal importa

Em backend financeiro, use `BigDecimal` para valores monetários.

Evite `double` para dinheiro.

Para somar `BigDecimal` em Streams, use:

```java
.reduce(BigDecimal.ZERO, BigDecimal::add)
```

---

## App com BigDecimal

Crie:

```text
src\br\com\curso\aula194\app\StreamReduceBigDecimalApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import java.math.BigDecimal;
import java.util.List;

public class StreamReduceBigDecimalApp {
    public static void main(String[] args) {
        List<BigDecimal> valores = List.of(
                new BigDecimal("100.50"),
                new BigDecimal("200.25"),
                new BigDecimal("50.25")
        );

        BigDecimal total = valores.stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        System.out.println("Total: " + total);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.StreamReduceBigDecimalApp
```

---

## Como ler BigDecimal::add

```java
BigDecimal::add
```

equivale a:

```java
(acumulado, valorAtual) -> acumulado.add(valorAtual)
```

O valor inicial é:

```java
BigDecimal.ZERO
```

---

## Cuidado com BigDecimal

Evite:

```java
new BigDecimal(0.1)
```

Prefira:

```java
new BigDecimal("0.1")
```

ou:

```java
BigDecimal.valueOf(0.1)
```

Para esta fase do curso, use string:

```java
new BigDecimal("100.50")
```

---

# Parte 6 — Domínio Produto

## Produto

Crie:

```text
src\br\com\curso\aula194\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula194.dominio.produto;

import java.math.BigDecimal;

public class Produto {
    private final String sku;
    private final String nome;
    private final String categoria;
    private final BigDecimal preco;
    private final boolean ativo;
    private final int estoque;

    public Produto(String sku, String nome, String categoria, BigDecimal preco, boolean ativo, int estoque) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (categoria == null || categoria.isBlank()) {
            throw new IllegalArgumentException("Categoria é obrigatória.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo.");
        }

        this.sku = sku.trim().toUpperCase();
        this.nome = nome.trim();
        this.categoria = categoria.trim().toUpperCase();
        this.preco = preco;
        this.ativo = ativo;
        this.estoque = estoque;
    }

    public String sku() {
        return sku;
    }

    public String nome() {
        return nome;
    }

    public String categoria() {
        return categoria;
    }

    public BigDecimal preco() {
        return preco;
    }

    public boolean ativo() {
        return ativo;
    }

    public int estoque() {
        return estoque;
    }

    public boolean disponivel() {
        return ativo && estoque > 0;
    }

    public BigDecimal valorTotalEmEstoque() {
        return preco.multiply(BigDecimal.valueOf(estoque));
    }

    public String resumo() {
        return sku
                + " | " + nome
                + " | Categoria: " + categoria
                + " | Preço: " + preco
                + " | Ativo: " + ativo
                + " | Estoque: " + estoque;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## App Produto min/max

Crie:

```text
src\br\com\curso\aula194\app\ProdutoMinMaxApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import br.com.curso.aula194.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

public class ProdutoMinMaxApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10),
                new Produto("prd-004", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2)
        );

        Produto maisBarato = produtos.stream()
                .min(Comparator.comparing(Produto::preco))
                .orElseThrow(() -> new IllegalStateException("Nenhum produto encontrado."));

        Produto maisCaro = produtos.stream()
                .max(Comparator.comparing(Produto::preco))
                .orElseThrow(() -> new IllegalStateException("Nenhum produto encontrado."));

        System.out.println("Mais barato:");
        System.out.println(maisBarato.resumo());

        System.out.println();

        System.out.println("Mais caro:");
        System.out.println(maisCaro.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.ProdutoMinMaxApp
```

---

## App Produto agregações

Crie:

```text
src\br\com\curso\aula194\app\ProdutoAgregacoesApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import br.com.curso.aula194.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoAgregacoesApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10),
                new Produto("prd-004", "Mesa", "Móveis", new BigDecimal("600.00"), false, 2)
        );

        int estoqueTotalDisponivel = produtos.stream()
                .filter(Produto::disponivel)
                .mapToInt(Produto::estoque)
                .sum();

        BigDecimal valorTotalDisponivel = produtos.stream()
                .filter(Produto::disponivel)
                .map(Produto::valorTotalEmEstoque)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        System.out.println("Estoque total disponível: " + estoqueTotalDisponivel);
        System.out.println("Valor total disponível: " + valorTotalDisponivel);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.ProdutoAgregacoesApp
```

---

## Ponto de domínio

Repare no método:

```java
valorTotalEmEstoque()
```

Essa regra ficou na entidade.

O Stream apenas agregou:

```java
.map(Produto::valorTotalEmEstoque)
.reduce(BigDecimal.ZERO, BigDecimal::add);
```

Isso mantém a linha arquitetural:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

---

# Parte 7 — Pedido com agregações financeiras

## Pedido

Crie:

```text
src\br\com\curso\aula194\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula194.dominio.pedido;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final LocalDate data;
    private final boolean pago;
    private final boolean cancelado;

    public Pedido(String codigo, String cliente, BigDecimal valor, LocalDate data, boolean pago, boolean cancelado) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        if (data == null) {
            throw new IllegalArgumentException("Data é obrigatória.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
        this.data = data;
        this.pago = pago;
        this.cancelado = cancelado;
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

    public LocalDate data() {
        return data;
    }

    public boolean pago() {
        return pago;
    }

    public boolean cancelado() {
        return cancelado;
    }

    public boolean podeFaturar() {
        return pago && !cancelado;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
                + " | Data: " + data
                + " | Pago: " + pago
                + " | Cancelado: " + cancelado;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## App Pedido agregações

Crie:

```text
src\br\com\curso\aula194\app\PedidoAgregacoesApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import br.com.curso.aula194.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

public class PedidoAgregacoesApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), LocalDate.of(2026, 7, 2), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), LocalDate.of(2026, 7, 1), true, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), LocalDate.of(2026, 7, 3), false, false),
                new Pedido("PED-004", "João", new BigDecimal("3000.00"), LocalDate.of(2026, 7, 4), true, true)
        );

        BigDecimal totalParaFaturar = pedidos.stream()
                .filter(Pedido::podeFaturar)
                .map(Pedido::valor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Pedido maiorPedidoParaFaturar = pedidos.stream()
                .filter(Pedido::podeFaturar)
                .max(Comparator.comparing(Pedido::valor))
                .orElseThrow(() -> new IllegalStateException("Nenhum pedido para faturar."));

        Pedido menorPedidoParaFaturar = pedidos.stream()
                .filter(Pedido::podeFaturar)
                .min(Comparator.comparing(Pedido::valor))
                .orElseThrow(() -> new IllegalStateException("Nenhum pedido para faturar."));

        long quantidadeParaFaturar = pedidos.stream()
                .filter(Pedido::podeFaturar)
                .count();

        System.out.println("Total para faturar: " + totalParaFaturar);
        System.out.println("Quantidade para faturar: " + quantidadeParaFaturar);

        System.out.println();

        System.out.println("Maior pedido:");
        System.out.println(maiorPedidoParaFaturar.resumo());

        System.out.println();

        System.out.println("Menor pedido:");
        System.out.println(menorPedidoParaFaturar.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.PedidoAgregacoesApp
```

---

## O que observar

O mesmo conjunto de pedidos gerou:

```text
total financeiro;
maior pedido;
menor pedido;
quantidade.
```

Essas são perguntas diferentes.

Por isso usamos operações diferentes:

```text
reduce;
max;
min;
count.
```

---

# Parte 8 — DTO de resumo

Em backend, muitas vezes você não retorna apenas uma lista.

Você retorna um resumo.

Exemplo:

```text
quantidade;
total;
maior item;
menor item.
```

Vamos criar um DTO para isso.

## ResumoPedidosResponse

Crie:

```text
src\br\com\curso\aula194\dto\ResumoPedidosResponse.java
```

Código:

```java
package br.com.curso.aula194.dto;

import java.math.BigDecimal;

public class ResumoPedidosResponse {
    private final long quantidade;
    private final BigDecimal total;
    private final BigDecimal maiorValor;
    private final BigDecimal menorValor;

    public ResumoPedidosResponse(long quantidade, BigDecimal total, BigDecimal maiorValor, BigDecimal menorValor) {
        if (quantidade < 0) {
            throw new IllegalArgumentException("Quantidade não pode ser negativa.");
        }

        if (total == null) {
            throw new IllegalArgumentException("Total é obrigatório.");
        }

        if (maiorValor == null) {
            throw new IllegalArgumentException("Maior valor é obrigatório.");
        }

        if (menorValor == null) {
            throw new IllegalArgumentException("Menor valor é obrigatório.");
        }

        this.quantidade = quantidade;
        this.total = total;
        this.maiorValor = maiorValor;
        this.menorValor = menorValor;
    }

    public long quantidade() {
        return quantidade;
    }

    public BigDecimal total() {
        return total;
    }

    public BigDecimal maiorValor() {
        return maiorValor;
    }

    public BigDecimal menorValor() {
        return menorValor;
    }

    public String resumo() {
        return "Quantidade: " + quantidade
                + " | Total: " + total
                + " | Maior: " + maiorValor
                + " | Menor: " + menorValor;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## PedidoResumoService

Crie:

```text
src\br\com\curso\aula194\service\PedidoResumoService.java
```

Código:

```java
package br.com.curso.aula194.service;

import br.com.curso.aula194.dominio.pedido.Pedido;
import br.com.curso.aula194.dto.ResumoPedidosResponse;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

public class PedidoResumoService {
    private final List<Pedido> pedidos;

    public PedidoResumoService(List<Pedido> pedidos) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Pedidos são obrigatórios.");
        }

        this.pedidos = List.copyOf(pedidos);
    }

    public ResumoPedidosResponse resumirPedidosParaFaturar() {
        List<Pedido> paraFaturar = pedidos.stream()
                .filter(Pedido::podeFaturar)
                .toList();

        if (paraFaturar.isEmpty()) {
            return new ResumoPedidosResponse(
                    0,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO
            );
        }

        long quantidade = paraFaturar.size();

        BigDecimal total = paraFaturar.stream()
                .map(Pedido::valor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal maior = paraFaturar.stream()
                .map(Pedido::valor)
                .max(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);

        BigDecimal menor = paraFaturar.stream()
                .map(Pedido::valor)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);

        return new ResumoPedidosResponse(
                quantidade,
                total,
                maior,
                menor
        );
    }
}
```

---

## App PedidoResumoService

Crie:

```text
src\br\com\curso\aula194\app\PedidoResumoServiceApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import br.com.curso.aula194.dominio.pedido.Pedido;
import br.com.curso.aula194.dto.ResumoPedidosResponse;
import br.com.curso.aula194.service.PedidoResumoService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PedidoResumoServiceApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), LocalDate.of(2026, 7, 2), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), LocalDate.of(2026, 7, 1), true, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), LocalDate.of(2026, 7, 3), false, false),
                new Pedido("PED-004", "João", new BigDecimal("3000.00"), LocalDate.of(2026, 7, 4), true, true)
        );

        PedidoResumoService service = new PedidoResumoService(pedidos);

        ResumoPedidosResponse resumo = service.resumirPedidosParaFaturar();

        System.out.println(resumo);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.PedidoResumoServiceApp
```

---

## Por que criar lista intermediária

No service, criamos:

```java
List<Pedido> paraFaturar = pedidos.stream()
        .filter(Pedido::podeFaturar)
        .toList();
```

Depois usamos essa lista para calcular:

```text
quantidade;
total;
maior;
menor.
```

Isso evita repetir o filtro várias vezes na lista original.

Também melhora leitura.

Em listas pequenas, está ótimo.

Em grandes volumes, no futuro, isso deveria ser pensado com banco, SQL e consultas agregadas.

---

# Parte 9 — Ordem de Serviço com agregações

## OrdemServico

Crie:

```text
src\br\com\curso\aula194\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula194.dominio.ordemservico;

public class OrdemServico {
    private final String codigo;
    private final String cliente;
    private final String status;
    private final boolean urgente;
    private final int diasEmAberto;

    public OrdemServico(String codigo, String cliente, String status, boolean urgente, int diasEmAberto) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (diasEmAberto < 0) {
            throw new IllegalArgumentException("Dias em aberto não pode ser negativo.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.status = status.trim().toUpperCase();
        this.urgente = urgente;
        this.diasEmAberto = diasEmAberto;
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

    public boolean urgente() {
        return urgente;
    }

    public int diasEmAberto() {
        return diasEmAberto;
    }

    public boolean aberta() {
        return "ABERTA".equals(status);
    }

    public boolean podeAtender() {
        return aberta() && diasEmAberto <= 30;
    }

    public boolean critica() {
        return urgente || diasEmAberto > 15;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Status: " + status
                + " | Urgente: " + urgente
                + " | Dias em aberto: " + diasEmAberto;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## App OS agregações

Crie:

```text
src\br\com\curso\aula194\app\OrdemServicoAgregacoesApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import br.com.curso.aula194.dominio.ordemservico.OrdemServico;

import java.util.Comparator;
import java.util.List;

public class OrdemServicoAgregacoesApp {
    public static void main(String[] args) {
        List<OrdemServico> ordens = List.of(
                new OrdemServico("OS-001", "Ana", "ABERTA", false, 5),
                new OrdemServico("OS-002", "Carlos", "ABERTA", true, 2),
                new OrdemServico("OS-003", "Maria", "ABERTA", false, 20),
                new OrdemServico("OS-004", "João", "CONCLUIDA", true, 40),
                new OrdemServico("OS-005", "Bruna", "ABERTA", false, 10)
        );

        long criticasAtendiveis = ordens.stream()
                .filter(OrdemServico::podeAtender)
                .filter(OrdemServico::critica)
                .count();

        int totalDiasAbertas = ordens.stream()
                .filter(OrdemServico::aberta)
                .mapToInt(OrdemServico::diasEmAberto)
                .sum();

        OrdemServico maisAntigaAberta = ordens.stream()
                .filter(OrdemServico::aberta)
                .max(Comparator.comparing(OrdemServico::diasEmAberto))
                .orElseThrow(() -> new IllegalStateException("Nenhuma OS aberta."));

        OrdemServico maisNovaAberta = ordens.stream()
                .filter(OrdemServico::aberta)
                .min(Comparator.comparing(OrdemServico::diasEmAberto))
                .orElseThrow(() -> new IllegalStateException("Nenhuma OS aberta."));

        System.out.println("Críticas atendíveis: " + criticasAtendiveis);
        System.out.println("Total de dias das abertas: " + totalDiasAbertas);

        System.out.println();

        System.out.println("Mais antiga aberta:");
        System.out.println(maisAntigaAberta.resumo());

        System.out.println();

        System.out.println("Mais nova aberta:");
        System.out.println(maisNovaAberta.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.OrdemServicoAgregacoesApp
```

---

# Parte 10 — Reduce com texto

`reduce` também pode concatenar textos, mas isso deve ser usado com cuidado.

Para concatenação simples de poucas strings, funciona.

Para concatenação grande, existem alternativas melhores que veremos depois.

Crie:

```text
src\br\com\curso\aula194\app\StreamReduceTextoApp.java
```

Código:

```java
package br.com.curso.aula194.app;

import java.util.List;

public class StreamReduceTextoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        String resultado = nomes.stream()
                .reduce("", (acumulado, nome) -> acumulado + "[" + nome + "]");

        System.out.println(resultado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula194.app.StreamReduceTextoApp
```

---

## Cuidado com concatenação em reduce

Este exemplo é didático.

Em cenários reais, para juntar texto com separador, normalmente é melhor usar:

```java
Collectors.joining()
```

Vamos estudar isso em uma aula futura de Collectors avançados.

Por enquanto, entenda:

```text
reduce pode acumular textos;
mas nem sempre é a melhor ferramenta para isso.
```

---

# Parte 11 — Quando usar min, max, reduce, sum e count

## Use min quando

Você quer o menor item conforme uma regra:

```text
produto mais barato;
pedido de menor valor;
OS mais nova;
menor data;
menor prioridade numérica.
```

Retorno:

```java
Optional<T>
```

---

## Use max quando

Você quer o maior item conforme uma regra:

```text
produto mais caro;
pedido de maior valor;
OS mais antiga;
maior data;
maior quantidade.
```

Retorno:

```java
Optional<T>
```

---

## Use reduce quando

Você quer acumular valores:

```text
somar BigDecimal;
calcular total;
combinar resultados;
consolidar dados;
montar acumulado.
```

Para soma monetária:

```java
.reduce(BigDecimal.ZERO, BigDecimal::add)
```

---

## Use mapToInt().sum quando

Você quer somar inteiros:

```text
estoque total;
quantidade total;
dias totais;
tentativas totais.
```

Exemplo:

```java
int total = itens.stream()
        .mapToInt(Item::quantidade)
        .sum();
```

---

## Use count quando

Você quer quantidade de elementos:

```text
quantos pedidos;
quantas OS críticas;
quantos produtos disponíveis;
quantos clientes bloqueados.
```

Exemplo:

```java
long quantidade = produtos.stream()
        .filter(Produto::disponivel)
        .count();
```

---

# Parte 12 — Boas práticas

## 1. Nomeie bem métodos de domínio

Prefira:

```java
Pedido::podeFaturar
Produto::valorTotalEmEstoque
OrdemServico::critica
```

a lambdas gigantes.

---

## 2. Use BigDecimal para dinheiro

Evite:

```java
double
```

para valores financeiros.

Use:

```java
BigDecimal
```

---

## 3. Não use reduce para tudo

Nem toda agregação precisa de reduce.

Às vezes é melhor:

```text
count;
sum;
min;
max;
collector específico;
objeto de resumo;
for tradicional.
```

---

## 4. Cuidado com Optional vazio em min/max

Sempre trate:

```java
orElse;
orElseGet;
orElseThrow;
ifPresent;
map.
```

---

## 5. Não repita stream complexo sem necessidade

Se você precisa calcular várias coisas sobre o mesmo subconjunto, considere uma lista intermediária:

```java
List<Pedido> paraFaturar = pedidos.stream()
        .filter(Pedido::podeFaturar)
        .toList();
```

Depois calcule sobre ela.

---

## 6. Em banco, agregação normalmente deve ser SQL

Em backend real, para grandes volumes, agregações devem ir para o banco:

```sql
SUM
COUNT
MIN
MAX
GROUP BY
```

Streams são bons para listas em memória.

SQL é melhor para grande volume persistido.

---

# Parte 13 — Erros comuns

## 1. Usar max para menor valor

Parece óbvio, mas acontece.

Leia o método:

```java
min -> menor
max -> maior
```

---

## 2. Usar Comparator errado

Este código pega maior preço:

```java
.max(Comparator.comparing(Produto::preco))
```

Este pega menor preço:

```java
.min(Comparator.comparing(Produto::preco))
```

Não confunda com `reversed`.

---

## 3. Usar get em Optional de min/max

Evite:

```java
.max(...).get()
```

Prefira:

```java
.orElseThrow(...)
```

ou outro tratamento explícito.

---

## 4. Somar BigDecimal com null

Se algum valor puder ser null, trate antes.

Exemplo:

```java
.map(Pedido::valor)
.filter(Objects::nonNull)
.reduce(BigDecimal.ZERO, BigDecimal::add)
```

No nosso domínio, `valor` não pode ser null por construtor.

---

## 5. Usar reduce para mutar objeto externo

Evite reduce com efeito colateral.

`reduce` deve combinar valores e retornar novo resultado.

---

## 6. Fazer agregação pesada em memória sem necessidade

Se os dados estão no banco e são muitos, faça no banco.

---

# Parte 14 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula194.app.StreamMinBasicoApp
java -cp out br.com.curso.aula194.app.StreamMinListaVaziaApp
java -cp out br.com.curso.aula194.app.StreamMaxBasicoApp
java -cp out br.com.curso.aula194.app.StreamMinMaxStringApp
java -cp out br.com.curso.aula194.app.StreamReduceSomaApp
java -cp out br.com.curso.aula194.app.StreamReduceSemInicialApp
java -cp out br.com.curso.aula194.app.StreamMapToIntSumApp
java -cp out br.com.curso.aula194.app.StreamReduceBigDecimalApp
java -cp out br.com.curso.aula194.app.ProdutoMinMaxApp
java -cp out br.com.curso.aula194.app.ProdutoAgregacoesApp
java -cp out br.com.curso.aula194.app.PedidoAgregacoesApp
java -cp out br.com.curso.aula194.app.PedidoResumoServiceApp
java -cp out br.com.curso.aula194.app.OrdemServicoAgregacoesApp
java -cp out br.com.curso.aula194.app.StreamReduceTextoApp
```

Para cada execução, responda:

```text
qual operação terminal foi usada?
o retorno foi Optional, número, BigDecimal ou DTO?
houve filtro antes da agregação?
o Comparator estava correto?
o reduce tinha valor inicial?
a regra de domínio estava nomeada?
```

---

# Parte 15 — Desafio prático

Crie entidade:

```text
src\br\com\curso\aula194\dominio\atividade\Atividade.java
```

Campos:

```text
String codigo;
String descricao;
String status;
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
tentativas não pode ser negativo;
minutosEstimados deve ser maior que zero;
pendente() retorna status igual "PENDENTE";
concluida() retorna status igual "CONCLUIDA";
excedeuTentativas() retorna tentativas > 3;
podeExecutar() retorna pendente && !excedeuTentativas;
critica() retorna urgente || obrigatoria;
resumo().
```

Crie DTO:

```text
src\br\com\curso\aula194\dto\ResumoAtividadesResponse.java
```

Campos:

```text
long quantidadeExecutaveis;
int totalMinutosExecutaveis;
int maiorTempo;
int menorTempo;
long quantidadeCriticasExecutaveis;
```

Crie service:

```text
src\br\com\curso\aula194\service\AtividadeResumoService.java
```

Método:

```java
ResumoAtividadesResponse resumirExecutaveis()
```

Regras:

```text
filtrar atividades que podeExecutar;
quantidade executável com count ou size;
total de minutos com mapToInt().sum();
maior tempo com max;
menor tempo com min;
quantidade críticas executáveis com filter + count;
se não houver executáveis, maiorTempo e menorTempo devem ser 0.
```

Crie app:

```text
src\br\com\curso\aula194\app\AtividadeResumoServiceApp.java
```

Critério principal:

```text
usar min;
usar max;
usar count;
usar mapToInt;
usar DTO de resumo;
não imprimir dentro do service.
```

---

## Desafio extra

Crie uma entidade:

```text
ItemPedido
```

Campos:

```text
String sku;
String nome;
BigDecimal valorUnitario;
int quantidade;
```

Método:

```java
BigDecimal subtotal()
```

Crie uma lista de itens e calcule:

```text
quantidade total;
valor total;
item mais caro por valor unitário;
item com maior subtotal;
item com menor subtotal.
```

Critério principal:

```text
regra de subtotal dentro da entidade;
Stream apenas agrega.
```

---

# Parte 16 — Debug recomendado

Coloque breakpoints em:

```text
StreamReduceSomaApp
StreamReduceBigDecimalApp
ProdutoAgregacoesApp
PedidoAgregacoesApp
PedidoResumoService
OrdemServicoAgregacoesApp
```

Pontos de atenção:

```java
.min(...)
.max(...)
.reduce(...)
.mapToInt(...)
.sum()
.count()
```

Observe:

```text
quando o filtro executa;
quando o valor é mapeado;
como o acumulador muda no reduce;
como min escolhe o menor;
como max escolhe o maior;
como Optional é tratado;
como o DTO de resumo é montado.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que min e max retornam Optional?
2. Quando usar reduce?
3. Como somar BigDecimal com Stream?
4. Quando usar mapToInt().sum?
5. Por que agregação de grandes volumes deve ir para o banco?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar min;
usar max;
usar Comparator com min/max;
tratar Optional de min/max;
usar reduce com valor inicial;
usar reduce sem valor inicial;
somar BigDecimal com reduce;
usar mapToInt;
usar sum;
usar count para quantidade;
criar DTO de resumo;
criar service de resumo;
aplicar agregações em Produto;
aplicar agregações em Pedido;
aplicar agregações em OrdemServico;
saber quando usar SQL em vez de Stream;
resolver AtividadeResumoServiceApp;
resolver desafio ItemPedido;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-194-streams-min-max-reduce-e-agregacoes
git commit -m "Aula 194: streams min max reduce e agregacoes"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Streams permitem reduzir muitos elementos em um único resultado.
```

Você estudou:

```text
min;
max;
reduce;
BigDecimal::add;
mapToInt;
sum;
count;
DTO de resumo;
services de agregação;
agregações em Produto, Pedido e Ordem de Serviço.
```

Também reforçou um ponto profissional:

```text
Stream é excelente para agregações em memória;
para grandes volumes persistidos, agregação normalmente deve ser feita no banco.
```

Na próxima aula, vamos estudar operações mais avançadas de Collectors:

```text
joining;
groupingBy;
partitioningBy;
mapping;
counting;
summing;
reducing.
```

Essas operações vão aproximar ainda mais Streams de relatórios, dashboards e agrupamentos reais usados em backend.
