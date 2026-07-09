# 195 — M7.10 — Collectors avançado: joining, groupingBy, partitioningBy, mapping, counting e summing

## Objetivo da aula

Na aula anterior, você estudou agregações com Streams:

```text
min;
max;
reduce;
BigDecimal::add;
mapToInt;
sum;
count;
DTO de resumo;
services de agregação.
```

Agora vamos avançar para um ponto muito importante da Streams API:

```text
Collectors avançado.
```

Até aqui você já usou:

```java
Collectors.toList()
Collectors.toSet()
Collectors.toMap()
```

Nesta aula vamos estudar recursos mais poderosos:

```text
Collectors.joining;
Collectors.groupingBy;
Collectors.partitioningBy;
Collectors.mapping;
Collectors.counting;
Collectors.summingInt;
Collectors.reducing.
```

Esses collectors são muito usados quando você precisa montar:

```text
relatórios;
dashboards;
agrupamentos;
resumos por status;
resumos por categoria;
contagens por tipo;
separação entre válidos e inválidos;
consolidações por cliente;
consolidações por domínio;
resumos por prioridade;
retornos administrativos de API.
```

Ao final desta aula, você deve conseguir:

```text
usar Collectors.joining;
juntar textos com separador;
usar groupingBy para agrupar por chave;
usar groupingBy com counting;
usar groupingBy com mapping;
usar groupingBy com summingInt;
usar partitioningBy para separar true/false;
entender Map<K, List<T>>;
entender Map<K, Long>;
entender Map<Boolean, List<T>>;
criar relatórios simples;
criar services de resumo;
evitar groupingBy quando o banco deveria agrupar;
aplicar em Produto, Pedido, Cliente e Ordem de Serviço.
```

---

## Ideia principal

Collectors permitem transformar um Stream em uma estrutura final.

Exemplos:

```java
Map<String, List<Produto>> produtosPorCategoria = produtos.stream()
        .collect(Collectors.groupingBy(Produto::categoria));
```

```java
Map<String, Long> quantidadePorStatus = ordens.stream()
        .collect(Collectors.groupingBy(
                OrdemServico::status,
                Collectors.counting()
        ));
```

```java
Map<Boolean, List<Pedido>> pedidosSeparados = pedidos.stream()
        .collect(Collectors.partitioningBy(Pedido::podeFaturar));
```

A ideia é:

```text
pegar vários elementos;
organizar por uma regra;
produzir uma estrutura de resumo.
```

---

## Por que isso importa no backend

No backend, muitas telas e APIs precisam retornar resumos.

Exemplos:

```text
quantidade de OS por status;
produtos agrupados por categoria;
pedidos agrupados por cliente;
clientes separados entre aptos e bloqueados;
total de estoque por categoria;
nomes concatenados em relatório;
quantidade de atividades por prioridade.
```

Com Collectors, você consegue montar essas estruturas em memória de forma expressiva.

Mais tarde, quando estudarmos SQL, JPA e Spring Data, você verá que muitas dessas agregações também podem e devem ser feitas no banco.

---

## Atenção profissional

Esta aula ensina agrupamentos em memória.

Isso é ótimo para:

```text
listas pequenas;
dados já carregados;
processamentos locais;
relatórios simples;
testes;
pós-processamento;
aprendizado de Java Core.
```

Mas para grandes volumes persistidos, normalmente o correto é usar banco:

```sql
GROUP BY
COUNT
SUM
AVG
MIN
MAX
```

Regra profissional:

```text
se os dados já estão em memória e são poucos, Stream pode resolver bem;
se os dados estão no banco e são muitos, agregue no banco.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-195-collectors-avancado-joining-groupingby-partitioningby
cd labs\m7\aula-195-collectors-avancado-joining-groupingby-partitioningby
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula195
mkdir src\br\com\curso\aula195\app
mkdir src\br\com\curso\aula195\dominio
mkdir src\br\com\curso\aula195\dominio\cliente
mkdir src\br\com\curso\aula195\dominio\produto
mkdir src\br\com\curso\aula195\dominio\pedido
mkdir src\br\com\curso\aula195\dominio\ordemservico
mkdir src\br\com\curso\aula195\dto
mkdir src\br\com\curso\aula195\service
```

---

# Parte 1 — Collectors.joining

## O que é joining

`Collectors.joining` junta textos em uma única String.

Exemplo:

```java
String resultado = nomes.stream()
        .collect(Collectors.joining(", "));
```

Entrada:

```text
Ana
Carlos
Maria
```

Saída:

```text
Ana, Carlos, Maria
```

---

## App básico com joining

Crie:

```text
src\br\com\curso\aula195\app\CollectorsJoiningBasicoApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import java.util.List;
import java.util.stream.Collectors;

public class CollectorsJoiningBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        String resultado = nomes.stream()
                .collect(Collectors.joining(", "));

        System.out.println(resultado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.CollectorsJoiningBasicoApp
```

---

## joining com prefixo e sufixo

`joining` também pode receber:

```text
delimitador;
prefixo;
sufixo.
```

Exemplo:

```java
Collectors.joining(", ", "[", "]")
```

Crie:

```text
src\br\com\curso\aula195\app\CollectorsJoiningPrefixoSufixoApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import java.util.List;
import java.util.stream.Collectors;

public class CollectorsJoiningPrefixoSufixoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        String resultado = nomes.stream()
                .collect(Collectors.joining(", ", "[", "]"));

        System.out.println(resultado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.CollectorsJoiningPrefixoSufixoApp
```

---

## joining depois de map

`joining` trabalha com Stream de String.

Se você tem objetos, normalmente faz `map` antes.

Exemplo:

```java
produtos.stream()
        .map(Produto::nome)
        .collect(Collectors.joining(", "));
```

Vamos aplicar isso no domínio mais adiante.

---

# Parte 2 — groupingBy básico

## O que é groupingBy

`groupingBy` agrupa elementos por uma chave.

Exemplo:

```java
Map<String, List<String>> nomesPorInicial = nomes.stream()
        .collect(Collectors.groupingBy(nome -> nome.substring(0, 1)));
```

Resultado conceitual:

```text
A -> [Ana]
C -> [Carlos]
M -> [Maria]
```

---

## App básico com groupingBy

Crie:

```text
src\br\com\curso\aula195\app\CollectorsGroupingByBasicoApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CollectorsGroupingByBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Amanda", "Carlos", "Carla", "Maria");

        Map<String, List<String>> nomesPorInicial = nomes.stream()
                .collect(Collectors.groupingBy(nome -> nome.substring(0, 1)));

        System.out.println(nomesPorInicial);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.CollectorsGroupingByBasicoApp
```

---

## Como ler groupingBy

```java
.collect(Collectors.groupingBy(nome -> nome.substring(0, 1)))
```

Leitura:

```text
agrupe os nomes pela primeira letra.
```

O resultado é:

```java
Map<String, List<String>>
```

Ou seja:

```text
chave:
inicial do nome.

valor:
lista de nomes daquela inicial.
```

---

## groupingBy com tamanho

Crie:

```text
src\br\com\curso\aula195\app\CollectorsGroupingByTamanhoApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CollectorsGroupingByTamanhoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Bia", "Carlos", "Maria", "João", "Bruna");

        Map<Integer, List<String>> nomesPorTamanho = nomes.stream()
                .collect(Collectors.groupingBy(String::length));

        System.out.println(nomesPorTamanho);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.CollectorsGroupingByTamanhoApp
```

---

## groupingBy retorna Map

`groupingBy` normalmente retorna um:

```java
Map<K, List<T>>
```

Onde:

```text
K:
tipo da chave de agrupamento.

T:
tipo dos itens agrupados.
```

Exemplo:

```java
Map<String, List<Produto>>
```

significa:

```text
chave String;
lista de Produto em cada chave.
```

---

# Parte 3 — groupingBy com counting

## O que é counting

`Collectors.counting()` conta elementos dentro de cada grupo.

Exemplo:

```java
Map<String, Long> quantidadePorInicial = nomes.stream()
        .collect(Collectors.groupingBy(
                nome -> nome.substring(0, 1),
                Collectors.counting()
        ));
```

Resultado:

```text
A -> 2
C -> 2
M -> 1
```

---

## App groupingBy + counting

Crie:

```text
src\br\com\curso\aula195\app\CollectorsGroupingByCountingApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CollectorsGroupingByCountingApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Amanda", "Carlos", "Carla", "Maria");

        Map<String, Long> quantidadePorInicial = nomes.stream()
                .collect(Collectors.groupingBy(
                        nome -> nome.substring(0, 1),
                        Collectors.counting()
                ));

        System.out.println(quantidadePorInicial);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.CollectorsGroupingByCountingApp
```

---

## Como ler groupingBy com downstream collector

Neste código:

```java
Collectors.groupingBy(
        nome -> nome.substring(0, 1),
        Collectors.counting()
)
```

temos:

```text
primeiro argumento:
como agrupar.

segundo argumento:
o que fazer com cada grupo.
```

O segundo argumento é chamado de collector downstream.

Tradução simples:

```text
agrupe por inicial;
dentro de cada grupo, conte.
```

---

# Parte 4 — groupingBy com mapping

## O que é mapping

`Collectors.mapping` transforma os itens dentro de cada grupo.

Exemplo:

```java
Map<String, List<String>> nomesPorInicial = pessoas.stream()
        .collect(Collectors.groupingBy(
                Pessoa::cidade,
                Collectors.mapping(Pessoa::nome, Collectors.toList())
        ));
```

Leitura:

```text
agrupe por cidade;
dentro de cada grupo, guarde apenas os nomes.
```

---

## App groupingBy + mapping

Crie:

```text
src\br\com\curso\aula195\app\CollectorsGroupingByMappingApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CollectorsGroupingByMappingApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Amanda", "Carlos", "Carla", "Maria");

        Map<String, List<Integer>> tamanhosPorInicial = nomes.stream()
                .collect(Collectors.groupingBy(
                        nome -> nome.substring(0, 1),
                        Collectors.mapping(
                                String::length,
                                Collectors.toList()
                        )
                ));

        System.out.println(tamanhosPorInicial);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.CollectorsGroupingByMappingApp
```

---

## Como ler mapping

```java
Collectors.mapping(
        String::length,
        Collectors.toList()
)
```

Leitura:

```text
para cada item do grupo, transforme em tamanho;
colete os tamanhos em lista.
```

Resultado:

```java
Map<String, List<Integer>>
```

---

# Parte 5 — summingInt

## O que é summingInt

`Collectors.summingInt` soma valores inteiros dentro de uma coleta.

Exemplo:

```java
Map<String, Integer> somaPorInicial = nomes.stream()
        .collect(Collectors.groupingBy(
                nome -> nome.substring(0, 1),
                Collectors.summingInt(String::length)
        ));
```

Leitura:

```text
agrupe por inicial;
some o tamanho dos nomes em cada grupo.
```

---

## App groupingBy + summingInt

Crie:

```text
src\br\com\curso\aula195\app\CollectorsGroupingBySummingIntApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CollectorsGroupingBySummingIntApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Amanda", "Carlos", "Carla", "Maria");

        Map<String, Integer> somaTamanhoPorInicial = nomes.stream()
                .collect(Collectors.groupingBy(
                        nome -> nome.substring(0, 1),
                        Collectors.summingInt(String::length)
                ));

        System.out.println(somaTamanhoPorInicial);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.CollectorsGroupingBySummingIntApp
```

---

## Quando usar summingInt

Use quando precisa somar campos inteiros por grupo.

Exemplos:

```text
estoque por categoria;
tentativas por status;
dias em aberto por cliente;
quantidade de itens por pedido;
minutos estimados por prioridade.
```

---

# Parte 6 — partitioningBy

## O que é partitioningBy

`partitioningBy` separa os elementos em dois grupos:

```text
true;
false.
```

Exemplo:

```java
Map<Boolean, List<String>> separados = nomes.stream()
        .collect(Collectors.partitioningBy(nome -> nome.length() >= 5));
```

Resultado conceitual:

```text
true  -> nomes com 5 ou mais letras
false -> nomes com menos de 5 letras
```

---

## App básico com partitioningBy

Crie:

```text
src\br\com\curso\aula195\app\CollectorsPartitioningByBasicoApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CollectorsPartitioningByBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Alexandre");

        Map<Boolean, List<String>> separados = nomes.stream()
                .collect(Collectors.partitioningBy(nome -> nome.length() >= 5));

        System.out.println("Grandes:");
        System.out.println(separados.get(true));

        System.out.println();

        System.out.println("Pequenos:");
        System.out.println(separados.get(false));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.CollectorsPartitioningByBasicoApp
```

---

## groupingBy vs partitioningBy

Use `groupingBy` quando há várias chaves possíveis.

Exemplo:

```text
status;
categoria;
cliente;
domínio;
prioridade.
```

Use `partitioningBy` quando a divisão é booleana:

```text
apto / não apto;
ativo / inativo;
pago / não pago;
crítico / não crítico;
disponível / indisponível.
```

---

## partitioningBy com counting

Crie:

```text
src\br\com\curso\aula195\app\CollectorsPartitioningByCountingApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CollectorsPartitioningByCountingApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Alexandre");

        Map<Boolean, Long> quantidade = nomes.stream()
                .collect(Collectors.partitioningBy(
                        nome -> nome.length() >= 5,
                        Collectors.counting()
                ));

        System.out.println("Grandes: " + quantidade.get(true));
        System.out.println("Pequenos: " + quantidade.get(false));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.CollectorsPartitioningByCountingApp
```

---

# Parte 7 — Domínio Produto

## Produto

Crie:

```text
src\br\com\curso\aula195\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula195.dominio.produto;

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

## App produtos por categoria

Crie:

```text
src\br\com\curso\aula195\app\ProdutoGroupingByCategoriaApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ProdutoGroupingByCategoriaApp {
    public static void main(String[] args) {
        List<Produto> produtos = produtos();

        Map<String, List<Produto>> porCategoria = produtos.stream()
                .collect(Collectors.groupingBy(Produto::categoria));

        porCategoria.forEach((categoria, itens) -> {
            System.out.println("Categoria: " + categoria);
            itens.forEach(produto -> System.out.println("  " + produto.resumo()));
        });
    }

    private static List<Produto> produtos() {
        return List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-004", "Cadeira", "Móveis", new BigDecimal("450.00"), false, 0),
                new Produto("prd-005", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10)
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.ProdutoGroupingByCategoriaApp
```

---

## App quantidade por categoria

Crie:

```text
src\br\com\curso\aula195\app\ProdutoQuantidadePorCategoriaApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ProdutoQuantidadePorCategoriaApp {
    public static void main(String[] args) {
        List<Produto> produtos = produtos();

        Map<String, Long> quantidadePorCategoria = produtos.stream()
                .collect(Collectors.groupingBy(
                        Produto::categoria,
                        Collectors.counting()
                ));

        System.out.println(quantidadePorCategoria);
    }

    private static List<Produto> produtos() {
        return List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-004", "Cadeira", "Móveis", new BigDecimal("450.00"), false, 0),
                new Produto("prd-005", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10)
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.ProdutoQuantidadePorCategoriaApp
```

---

## App estoque por categoria

Crie:

```text
src\br\com\curso\aula195\app\ProdutoEstoquePorCategoriaApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ProdutoEstoquePorCategoriaApp {
    public static void main(String[] args) {
        List<Produto> produtos = produtos();

        Map<String, Integer> estoquePorCategoria = produtos.stream()
                .collect(Collectors.groupingBy(
                        Produto::categoria,
                        Collectors.summingInt(Produto::estoque)
                ));

        System.out.println(estoquePorCategoria);
    }

    private static List<Produto> produtos() {
        return List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-004", "Cadeira", "Móveis", new BigDecimal("450.00"), false, 0),
                new Produto("prd-005", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10)
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.ProdutoEstoquePorCategoriaApp
```

---

## App nomes por categoria com mapping

Crie:

```text
src\br\com\curso\aula195\app\ProdutoNomesPorCategoriaApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ProdutoNomesPorCategoriaApp {
    public static void main(String[] args) {
        List<Produto> produtos = produtos();

        Map<String, List<String>> nomesPorCategoria = produtos.stream()
                .collect(Collectors.groupingBy(
                        Produto::categoria,
                        Collectors.mapping(
                                Produto::nome,
                                Collectors.toList()
                        )
                ));

        System.out.println(nomesPorCategoria);
    }

    private static List<Produto> produtos() {
        return List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-004", "Cadeira", "Móveis", new BigDecimal("450.00"), false, 0),
                new Produto("prd-005", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10)
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.ProdutoNomesPorCategoriaApp
```

---

## App particionando disponíveis

Crie:

```text
src\br\com\curso\aula195\app\ProdutoPartitioningByDisponivelApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ProdutoPartitioningByDisponivelApp {
    public static void main(String[] args) {
        List<Produto> produtos = produtos();

        Map<Boolean, List<Produto>> separados = produtos.stream()
                .collect(Collectors.partitioningBy(Produto::disponivel));

        System.out.println("Disponíveis:");
        separados.get(true).forEach(produto -> System.out.println("  " + produto.resumo()));

        System.out.println();

        System.out.println("Indisponíveis:");
        separados.get(false).forEach(produto -> System.out.println("  " + produto.resumo()));
    }

    private static List<Produto> produtos() {
        return List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-004", "Cadeira", "Móveis", new BigDecimal("450.00"), false, 0),
                new Produto("prd-005", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10)
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.ProdutoPartitioningByDisponivelApp
```

---

# Parte 8 — Domínio Pedido

## Pedido

Crie:

```text
src\br\com\curso\aula195\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula195.dominio.pedido;

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

    public String statusFinanceiro() {
        if (cancelado) {
            return "CANCELADO";
        }

        if (pago) {
            return "PAGO";
        }

        return "PENDENTE";
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
                + " | Data: " + data
                + " | Status: " + statusFinanceiro();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## Pedido agrupado por status financeiro

Crie:

```text
src\br\com\curso\aula195\app\PedidoGroupingByStatusApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PedidoGroupingByStatusApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = pedidos();

        Map<String, List<Pedido>> porStatus = pedidos.stream()
                .collect(Collectors.groupingBy(Pedido::statusFinanceiro));

        porStatus.forEach((status, itens) -> {
            System.out.println("Status: " + status);
            itens.forEach(pedido -> System.out.println("  " + pedido.resumo()));
        });
    }

    private static List<Pedido> pedidos() {
        return List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), LocalDate.of(2026, 7, 1), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), LocalDate.of(2026, 7, 2), true, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), LocalDate.of(2026, 7, 3), false, false),
                new Pedido("PED-004", "João", new BigDecimal("3000.00"), LocalDate.of(2026, 7, 4), true, true)
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.PedidoGroupingByStatusApp
```

---

## Pedido quantidade por status

Crie:

```text
src\br\com\curso\aula195\app\PedidoQuantidadePorStatusApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PedidoQuantidadePorStatusApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = pedidos();

        Map<String, Long> quantidadePorStatus = pedidos.stream()
                .collect(Collectors.groupingBy(
                        Pedido::statusFinanceiro,
                        Collectors.counting()
                ));

        System.out.println(quantidadePorStatus);
    }

    private static List<Pedido> pedidos() {
        return List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), LocalDate.of(2026, 7, 1), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), LocalDate.of(2026, 7, 2), true, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), LocalDate.of(2026, 7, 3), false, false),
                new Pedido("PED-004", "João", new BigDecimal("3000.00"), LocalDate.of(2026, 7, 4), true, true)
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.PedidoQuantidadePorStatusApp
```

---

## Pedido partitioningBy podeFaturar

Crie:

```text
src\br\com\curso\aula195\app\PedidoPartitioningByPodeFaturarApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class PedidoPartitioningByPodeFaturarApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = pedidos();

        Map<Boolean, List<Pedido>> separados = pedidos.stream()
                .collect(Collectors.partitioningBy(Pedido::podeFaturar));

        System.out.println("Pode faturar:");
        separados.get(true).forEach(pedido -> System.out.println("  " + pedido.resumo()));

        System.out.println();

        System.out.println("Não pode faturar:");
        separados.get(false).forEach(pedido -> System.out.println("  " + pedido.resumo()));
    }

    private static List<Pedido> pedidos() {
        return List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), LocalDate.of(2026, 7, 1), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), LocalDate.of(2026, 7, 2), true, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), LocalDate.of(2026, 7, 3), false, false),
                new Pedido("PED-004", "João", new BigDecimal("3000.00"), LocalDate.of(2026, 7, 4), true, true)
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.PedidoPartitioningByPodeFaturarApp
```

---

# Parte 9 — Cliente com groupingBy por domínio

## Cliente

Crie:

```text
src\br\com\curso\aula195\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula195.dominio.cliente;

public class Cliente {
    private final String nome;
    private final String email;
    private final boolean ativo;
    private final boolean bloqueado;

    public Cliente(String nome, String email, boolean ativo, boolean bloqueado) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank() || !email.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.nome = nome.trim();
        this.email = email.trim().toLowerCase();
        this.ativo = ativo;
        this.bloqueado = bloqueado;
    }

    public String nome() {
        return nome;
    }

    public String email() {
        return email;
    }

    public String dominioEmail() {
        return email.substring(email.indexOf("@") + 1);
    }

    public boolean ativo() {
        return ativo;
    }

    public boolean bloqueado() {
        return bloqueado;
    }

    public boolean podeOperar() {
        return ativo && !bloqueado;
    }

    public String resumo() {
        return nome
                + " | " + email
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

## App Cliente agrupado por domínio

Crie:

```text
src\br\com\curso\aula195\app\ClienteGroupingByDominioApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.cliente.Cliente;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ClienteGroupingByDominioApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente("Ana Silva", "ana@empresa.com", true, false),
                new Cliente("Carlos Souza", "carlos@empresa.com", true, true),
                new Cliente("Maria Oliveira", "maria@gmail.com", true, false),
                new Cliente("João Lima", "joao@gmail.com", false, false),
                new Cliente("Bruna Alves", "bruna@empresa.com", true, false)
        );

        Map<String, List<String>> nomesPorDominio = clientes.stream()
                .filter(Cliente::podeOperar)
                .collect(Collectors.groupingBy(
                        Cliente::dominioEmail,
                        Collectors.mapping(
                                Cliente::nome,
                                Collectors.toList()
                        )
                ));

        System.out.println(nomesPorDominio);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.ClienteGroupingByDominioApp
```

---

## App Cliente joining por domínio

Crie:

```text
src\br\com\curso\aula195\app\ClienteJoiningPorDominioApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.cliente.Cliente;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ClienteJoiningPorDominioApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente("Ana Silva", "ana@empresa.com", true, false),
                new Cliente("Carlos Souza", "carlos@empresa.com", true, true),
                new Cliente("Maria Oliveira", "maria@gmail.com", true, false),
                new Cliente("João Lima", "joao@gmail.com", false, false),
                new Cliente("Bruna Alves", "bruna@empresa.com", true, false)
        );

        Map<String, String> nomesConcatenadosPorDominio = clientes.stream()
                .filter(Cliente::podeOperar)
                .collect(Collectors.groupingBy(
                        Cliente::dominioEmail,
                        Collectors.mapping(
                                Cliente::nome,
                                Collectors.joining(", ")
                        )
                ));

        System.out.println(nomesConcatenadosPorDominio);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.ClienteJoiningPorDominioApp
```

---

# Parte 10 — Ordem de Serviço com resumo por status

## OrdemServico

Crie:

```text
src\br\com\curso\aula195\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula195.dominio.ordemservico;

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

## ResumoStatusOsResponse

Crie:

```text
src\br\com\curso\aula195\dto\ResumoStatusOsResponse.java
```

Código:

```java
package br.com.curso.aula195.dto;

public class ResumoStatusOsResponse {
    private final String status;
    private final long quantidade;
    private final int totalDiasEmAberto;

    public ResumoStatusOsResponse(String status, long quantidade, int totalDiasEmAberto) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (quantidade < 0) {
            throw new IllegalArgumentException("Quantidade não pode ser negativa.");
        }

        if (totalDiasEmAberto < 0) {
            throw new IllegalArgumentException("Total de dias não pode ser negativo.");
        }

        this.status = status;
        this.quantidade = quantidade;
        this.totalDiasEmAberto = totalDiasEmAberto;
    }

    public String status() {
        return status;
    }

    public long quantidade() {
        return quantidade;
    }

    public int totalDiasEmAberto() {
        return totalDiasEmAberto;
    }

    public String resumo() {
        return status
                + " | Quantidade: " + quantidade
                + " | Total dias em aberto: " + totalDiasEmAberto;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## OrdemServicoResumoService

Crie:

```text
src\br\com\curso\aula195\service\OrdemServicoResumoService.java
```

Código:

```java
package br.com.curso.aula195.service;

import br.com.curso.aula195.dominio.ordemservico.OrdemServico;
import br.com.curso.aula195.dto.ResumoStatusOsResponse;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class OrdemServicoResumoService {
    private final List<OrdemServico> ordens;

    public OrdemServicoResumoService(List<OrdemServico> ordens) {
        if (ordens == null) {
            throw new IllegalArgumentException("Ordens são obrigatórias.");
        }

        this.ordens = List.copyOf(ordens);
    }

    public Map<String, Long> contarPorStatus() {
        return ordens.stream()
                .collect(Collectors.groupingBy(
                        OrdemServico::status,
                        Collectors.counting()
                ));
    }

    public Map<String, Integer> somarDiasPorStatus() {
        return ordens.stream()
                .collect(Collectors.groupingBy(
                        OrdemServico::status,
                        Collectors.summingInt(OrdemServico::diasEmAberto)
                ));
    }

    public Map<Boolean, List<OrdemServico>> separarCriticas() {
        return ordens.stream()
                .collect(Collectors.partitioningBy(OrdemServico::critica));
    }

    public List<ResumoStatusOsResponse> resumirPorStatus() {
        Map<String, Long> quantidadePorStatus = contarPorStatus();
        Map<String, Integer> diasPorStatus = somarDiasPorStatus();

        return quantidadePorStatus.entrySet()
                .stream()
                .map(entry -> new ResumoStatusOsResponse(
                        entry.getKey(),
                        entry.getValue(),
                        diasPorStatus.getOrDefault(entry.getKey(), 0)
                ))
                .sorted(Comparator.comparing(ResumoStatusOsResponse::status))
                .toList();
    }
}
```

---

## App OrdemServicoResumoService

Crie:

```text
src\br\com\curso\aula195\app\OrdemServicoResumoServiceApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.ordemservico.OrdemServico;
import br.com.curso.aula195.dto.ResumoStatusOsResponse;
import br.com.curso.aula195.service.OrdemServicoResumoService;

import java.util.List;
import java.util.Map;

public class OrdemServicoResumoServiceApp {
    public static void main(String[] args) {
        List<OrdemServico> ordens = List.of(
                new OrdemServico("OS-001", "Ana", "ABERTA", false, 5),
                new OrdemServico("OS-002", "Carlos", "ABERTA", true, 2),
                new OrdemServico("OS-003", "Maria", "ABERTA", false, 20),
                new OrdemServico("OS-004", "João", "CONCLUIDA", true, 40),
                new OrdemServico("OS-005", "Bruna", "CANCELADA", false, 8)
        );

        OrdemServicoResumoService service = new OrdemServicoResumoService(ordens);

        Map<String, Long> quantidadePorStatus = service.contarPorStatus();
        Map<String, Integer> diasPorStatus = service.somarDiasPorStatus();
        Map<Boolean, List<OrdemServico>> criticas = service.separarCriticas();
        List<ResumoStatusOsResponse> resumo = service.resumirPorStatus();

        System.out.println("Quantidade por status:");
        System.out.println(quantidadePorStatus);

        System.out.println();

        System.out.println("Dias por status:");
        System.out.println(diasPorStatus);

        System.out.println();

        System.out.println("Críticas:");
        criticas.get(true).forEach(os -> System.out.println("  " + os.resumo()));

        System.out.println();

        System.out.println("Resumo por status:");
        resumo.forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.OrdemServicoResumoServiceApp
```

---

# Parte 11 — reducing como downstream

## O que é Collectors.reducing

`Collectors.reducing` permite reduzir valores dentro de um collector.

Ele pode aparecer dentro de `groupingBy`.

Exemplo conceitual:

```java
Map<String, BigDecimal> totalPorCategoria = produtos.stream()
        .collect(Collectors.groupingBy(
                Produto::categoria,
                Collectors.reducing(
                        BigDecimal.ZERO,
                        Produto::preco,
                        BigDecimal::add
                )
        ));
```

Leitura:

```text
agrupe por categoria;
para cada produto, extraia preço;
some os preços dentro do grupo.
```

---

## App reducing com BigDecimal

Crie:

```text
src\br\com\curso\aula195\app\ProdutoReducingPrecoPorCategoriaApp.java
```

Código:

```java
package br.com.curso.aula195.app;

import br.com.curso.aula195.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ProdutoReducingPrecoPorCategoriaApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-004", "Cadeira", "Móveis", new BigDecimal("450.00"), false, 0),
                new Produto("prd-005", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10)
        );

        Map<String, BigDecimal> somaPrecosPorCategoria = produtos.stream()
                .collect(Collectors.groupingBy(
                        Produto::categoria,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Produto::preco,
                                BigDecimal::add
                        )
                ));

        System.out.println(somaPrecosPorCategoria);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula195.app.ProdutoReducingPrecoPorCategoriaApp
```

---

## Quando usar reducing

Use `reducing` quando você precisa de redução dentro de outro collector.

Exemplo:

```text
soma BigDecimal por categoria;
maior valor por status;
consolidação por cliente;
acumulado customizado por grupo.
```

Para somas simples de inteiros, use:

```java
Collectors.summingInt(...)
```

Para BigDecimal, `reducing` é uma opção.

---

# Parte 12 — Boas práticas

## 1. Use groupingBy para múltiplas chaves possíveis

Bom:

```java
Collectors.groupingBy(Produto::categoria)
Collectors.groupingBy(Pedido::statusFinanceiro)
Collectors.groupingBy(OrdemServico::status)
```

---

## 2. Use partitioningBy para boolean

Bom:

```java
Collectors.partitioningBy(Produto::disponivel)
Collectors.partitioningBy(Pedido::podeFaturar)
Collectors.partitioningBy(OrdemServico::critica)
```

---

## 3. Use downstream collector para resumir

Exemplo:

```java
Collectors.groupingBy(
        Produto::categoria,
        Collectors.counting()
)
```

Isso é melhor do que agrupar em lista e depois sair contando manualmente em vários lugares.

---

## 4. Cuidado com Map complexo demais

Se o tipo ficou muito difícil:

```java
Map<String, Map<Boolean, List<Produto>>>
```

talvez seja melhor criar DTOs de resumo.

Código legível é prioridade.

---

## 5. Não coloque regra de negócio escondida no collector

Se a regra é importante, dê nome:

```java
Produto::disponivel
Pedido::podeFaturar
OrdemServico::critica
```

Evite lambdas gigantes dentro do `groupingBy`.

---

## 6. Para grandes volumes, pense em banco

Exemplo em Java:

```java
ordens.stream()
        .collect(Collectors.groupingBy(OrdemServico::status, Collectors.counting()));
```

Exemplo futuro em SQL:

```sql
select status, count(*)
from ordem_servico
group by status;
```

Para grande volume, SQL normalmente é melhor.

---

# Parte 13 — Erros comuns

## 1. Usar groupingBy quando era partitioningBy

Se a chave é boolean, prefira:

```java
partitioningBy
```

em vez de:

```java
groupingBy(item -> item.ativo())
```

---

## 2. Esperar ordenação no Map

O `Map` retornado por `groupingBy` não deve ser usado assumindo ordem específica.

Se precisa ordenar, transforme em lista e ordene, ou use Map específico em aula futura.

---

## 3. Criar mapas difíceis de manter

Evite retornar estruturas muito profundas para fora do service.

Prefira DTOs quando o retorno precisa ser claro.

---

## 4. Usar joining antes de map

`joining` trabalha com String.

Se o stream é de objetos, faça:

```java
.map(Objeto::campoTexto)
.collect(Collectors.joining(", "))
```

---

## 5. Somar BigDecimal com summingDouble

Evite converter dinheiro para double.

Para BigDecimal, use reducing:

```java
Collectors.reducing(BigDecimal.ZERO, Produto::preco, BigDecimal::add)
```

---

## 6. Fazer agrupamento em memória de dados enormes

Se vem do banco e é grande, use SQL.

---

# Parte 14 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula195.app.CollectorsJoiningBasicoApp
java -cp out br.com.curso.aula195.app.CollectorsJoiningPrefixoSufixoApp
java -cp out br.com.curso.aula195.app.CollectorsGroupingByBasicoApp
java -cp out br.com.curso.aula195.app.CollectorsGroupingByTamanhoApp
java -cp out br.com.curso.aula195.app.CollectorsGroupingByCountingApp
java -cp out br.com.curso.aula195.app.CollectorsGroupingByMappingApp
java -cp out br.com.curso.aula195.app.CollectorsGroupingBySummingIntApp
java -cp out br.com.curso.aula195.app.CollectorsPartitioningByBasicoApp
java -cp out br.com.curso.aula195.app.CollectorsPartitioningByCountingApp
java -cp out br.com.curso.aula195.app.ProdutoGroupingByCategoriaApp
java -cp out br.com.curso.aula195.app.ProdutoQuantidadePorCategoriaApp
java -cp out br.com.curso.aula195.app.ProdutoEstoquePorCategoriaApp
java -cp out br.com.curso.aula195.app.ProdutoNomesPorCategoriaApp
java -cp out br.com.curso.aula195.app.ProdutoPartitioningByDisponivelApp
java -cp out br.com.curso.aula195.app.PedidoGroupingByStatusApp
java -cp out br.com.curso.aula195.app.PedidoQuantidadePorStatusApp
java -cp out br.com.curso.aula195.app.PedidoPartitioningByPodeFaturarApp
java -cp out br.com.curso.aula195.app.ClienteGroupingByDominioApp
java -cp out br.com.curso.aula195.app.ClienteJoiningPorDominioApp
java -cp out br.com.curso.aula195.app.OrdemServicoResumoServiceApp
java -cp out br.com.curso.aula195.app.ProdutoReducingPrecoPorCategoriaApp
```

Para cada execução, responda:

```text
qual collector foi usado?
o resultado foi String, Map, List ou DTO?
a chave do agrupamento foi qual?
houve downstream collector?
foi groupingBy ou partitioningBy?
o agrupamento deveria estar em memória ou no banco em um sistema real?
```

---

# Parte 15 — Desafio prático

Crie entidade:

```text
src\br\com\curso\aula195\dominio\atividade\Atividade.java
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
prioridadeTexto():
    "ALTA" se urgente e obrigatoria;
    "MEDIA" se urgente ou obrigatoria;
    "NORMAL" caso contrário;
resumo().
```

Crie DTO:

```text
src\br\com\curso\aula195\dto\ResumoAtividadeStatusResponse.java
```

Campos:

```text
String status;
long quantidade;
int totalMinutos;
String descricoes;
```

Crie service:

```text
src\br\com\curso\aula195\service\AtividadeResumoService.java
```

Métodos obrigatórios:

```java
Map<String, Long> contarPorStatus()

Map<String, Integer> somarMinutosPorStatus()

Map<Boolean, List<Atividade>> separarCriticas()

Map<String, List<String>> descricoesPorPrioridade()

Map<String, String> descricoesConcatenadasPorStatus()

List<ResumoAtividadeStatusResponse> resumirPorStatus()
```

Critérios:

```text
usar groupingBy;
usar counting;
usar summingInt;
usar partitioningBy;
usar mapping;
usar joining;
não imprimir dentro do service;
usar DTO para retorno final quando fizer sentido.
```

Crie app:

```text
src\br\com\curso\aula195\app\AtividadeResumoServiceApp.java
```

---

## Desafio extra

No service de atividades, crie:

```java
Map<String, Integer> totalTentativasPorPrioridade()
```

Regra:

```text
agrupar por prioridadeTexto;
somar tentativas.
```

Depois crie:

```java
Map<String, Long> contarExecutaveisPorPrioridade()
```

Regra:

```text
filtrar atividades que podeExecutar;
agrupar por prioridadeTexto;
contar.
```

Critério principal:

```text
combinar filter antes do groupingBy quando fizer sentido.
```

---

# Parte 16 — Debug recomendado

Coloque breakpoints em:

```text
ProdutoGroupingByCategoriaApp
ProdutoQuantidadePorCategoriaApp
ProdutoNomesPorCategoriaApp
ProdutoPartitioningByDisponivelApp
PedidoGroupingByStatusApp
ClienteJoiningPorDominioApp
OrdemServicoResumoService
ProdutoReducingPrecoPorCategoriaApp
```

Pontos de atenção:

```java
.collect(Collectors.joining(...))
.collect(Collectors.groupingBy(...))
.collect(Collectors.partitioningBy(...))
Collectors.counting()
Collectors.mapping(...)
Collectors.summingInt(...)
Collectors.reducing(...)
```

Observe:

```text
como a chave do grupo é gerada;
como os itens entram no Map;
como counting troca List por Long;
como mapping transforma itens do grupo;
como partitioningBy cria true e false;
como reducing acumula BigDecimal por grupo;
como o service monta DTO a partir de Maps.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Para que serve Collectors.joining?
2. Qual a diferença entre groupingBy e partitioningBy?
3. O que é um downstream collector?
4. Quando usar Collectors.mapping?
5. Por que agrupamentos grandes normalmente devem ir para o banco?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar Collectors.joining;
usar joining com delimitador;
usar joining com prefixo e sufixo;
usar groupingBy simples;
usar groupingBy com counting;
usar groupingBy com mapping;
usar groupingBy com summingInt;
usar partitioningBy simples;
usar partitioningBy com counting;
usar reducing como downstream;
criar Map<K, List<T>>;
criar Map<K, Long>;
criar Map<K, Integer>;
criar Map<Boolean, List<T>>;
criar relatório por status;
criar relatório por categoria;
criar DTO de resumo;
saber quando Stream em memória é aceitável;
saber quando SQL seria melhor;
resolver AtividadeResumoServiceApp;
resolver desafio extra de tentativas por prioridade;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-195-collectors-avancado-joining-groupingby-partitioningby
git commit -m "Aula 195: collectors avancado joining groupingby partitioningby"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Collectors avançados permitem transformar listas em relatórios, agrupamentos e resumos.
```

Você estudou:

```text
joining;
groupingBy;
partitioningBy;
mapping;
counting;
summingInt;
reducing;
Map<K, List<T>>;
Map<K, Long>;
Map<Boolean, List<T>>;
DTOs de resumo.
```

Também reforçou uma visão profissional:

```text
Streams são ótimos para agrupamentos em memória;
SQL é melhor para grandes volumes persistidos.
```

Na próxima aula, vamos estudar um ponto que aparece muito em pipelines reais:

```text
flatMap
```

Vamos entender como transformar listas dentro de listas, como processar coleções aninhadas e como isso se conecta com Optional, pedidos com itens, clientes com contratos e respostas de APIs.
