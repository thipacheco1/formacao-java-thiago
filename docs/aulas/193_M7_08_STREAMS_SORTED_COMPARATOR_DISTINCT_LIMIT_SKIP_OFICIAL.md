# 193 — M7.08 — Streams: sorted, Comparator, distinct, limit e skip

## Objetivo da aula

Na aula anterior, você estudou operações terminais de busca, decisão e contagem:

```text
findFirst;
findAny;
anyMatch;
allMatch;
noneMatch;
count.
```

Agora vamos avançar em operações muito usadas para organizar, limpar e recortar resultados em memória:

```text
sorted;
Comparator;
distinct;
limit;
skip.
```

Essas operações aparecem muito quando você precisa:

```text
ordenar uma lista de respostas;
ordenar por nome;
ordenar por data;
ordenar por valor;
ordenar por prioridade;
remover duplicados;
limitar resultados;
pular resultados;
simular paginação em memória;
montar top N;
montar ranking;
preparar dados antes de devolver para outra camada.
```

Ao final desta aula, você deve conseguir:

```text
usar sorted();
usar sorted(Comparator);
usar Comparator.comparing;
usar reversed;
usar thenComparing;
usar distinct;
entender por que distinct depende de equals/hashCode;
usar limit;
usar skip;
combinar skip + limit para paginação simples;
aplicar ordenação em objetos de domínio;
aplicar distinct em objetos de valor;
evitar erros comuns;
entender quando ordenar em memória é aceitável;
entender quando ordenar/paginar deve ser responsabilidade do banco.
```

---

## Ideia principal

Streams permitem montar pipelines de processamento.

Até agora você já sabe fazer:

```java
clientes.stream()
        .filter(Cliente::ativo)
        .map(ClienteMapper::toResponse)
        .toList();
```

Agora vamos aprender a organizar esse resultado:

```java
clientes.stream()
        .filter(Cliente::ativo)
        .sorted(Comparator.comparing(Cliente::nome))
        .map(ClienteMapper::toResponse)
        .toList();
```

Leitura:

```text
pegue clientes;
filtre ativos;
ordene por nome;
transforme em response;
retorne lista.
```

---

## Operações desta aula

Vamos estudar:

```text
sorted:
ordena elementos.

Comparator:
define critério de comparação.

distinct:
remove duplicados.

limit:
limita quantidade de elementos.

skip:
pula quantidade de elementos.
```

Tabela rápida:

```text
sorted()                  -> ordenação natural
sorted(comparator)        -> ordenação por regra
distinct()                -> remove duplicados
limit(n)                  -> pega no máximo n elementos
skip(n)                   -> ignora os primeiros n elementos
skip(pagina * tamanho)    -> base de paginação em memória
```

---

## Importante: banco vs memória

Nesta aula vamos ordenar e paginar em memória porque ainda estamos estudando Java Core.

Mas em backend real, quando os dados vêm do banco, normalmente ordenação e paginação devem ser feitas no banco:

```text
ORDER BY;
LIMIT;
OFFSET;
Pageable;
PageRequest;
Spring Data;
SQL otimizado.
```

Ordenar em memória pode ser aceitável quando:

```text
a lista é pequena;
os dados já estão carregados;
é uma regra temporária;
é processamento local;
é pós-processamento simples.
```

Mas não é ideal para grandes volumes.

Essa consciência é parte do nosso objetivo profissional.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-193-streams-sorted-comparator-distinct-limit-skip
cd labs\m7\aula-193-streams-sorted-comparator-distinct-limit-skip
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula193
mkdir src\br\com\curso\aula193\app
mkdir src\br\com\curso\aula193\dominio
mkdir src\br\com\curso\aula193\dominio\valor
mkdir src\br\com\curso\aula193\dominio\cliente
mkdir src\br\com\curso\aula193\dominio\produto
mkdir src\br\com\curso\aula193\dominio\pedido
mkdir src\br\com\curso\aula193\dominio\ordemservico
mkdir src\br\com\curso\aula193\dto
mkdir src\br\com\curso\aula193\service
```

---

# Parte 1 — sorted() com tipos naturalmente ordenáveis

## O que é sorted()

`sorted()` ordena o Stream pela ordem natural do tipo.

Exemplo:

```java
nomes.stream()
        .sorted()
        .toList();
```

Funciona porque `String` implementa:

```java
Comparable<String>
```

---

## App básico com sorted

Crie:

```text
src\br\com\curso\aula193\app\StreamSortedBasicoApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import java.util.List;

public class StreamSortedBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Maria", "Ana", "Carlos", "João", "Bruna");

        List<String> ordenados = nomes.stream()
                .sorted()
                .toList();

        System.out.println("Original:");
        System.out.println(nomes);

        System.out.println();

        System.out.println("Ordenados:");
        System.out.println(ordenados);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.StreamSortedBasicoApp
```

---

## O que observar

A lista original não foi alterada.

O Stream gerou uma nova lista ordenada.

Isso reforça uma ideia importante:

```text
Streams processam dados e retornam novos resultados.
```

---

## sorted com números

Crie:

```text
src\br\com\curso\aula193\app\StreamSortedNumerosApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import java.util.List;

public class StreamSortedNumerosApp {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(30, 10, 50, 20, 40);

        List<Integer> ordenados = numeros.stream()
                .sorted()
                .toList();

        System.out.println(ordenados);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.StreamSortedNumerosApp
```

---

## Quando sorted() funciona sem Comparator

`sorted()` sem argumento funciona quando o tipo tem ordem natural.

Exemplos:

```text
String;
Integer;
Long;
BigDecimal;
LocalDate;
LocalDateTime;
objetos que implementam Comparable.
```

Se o objeto não implementa `Comparable`, você precisa passar um `Comparator`.

---

# Parte 2 — sorted com Comparator

## O que é Comparator

`Comparator<T>` define uma regra externa de comparação.

Exemplo:

```java
Comparator<String> porTamanho = Comparator.comparing(String::length);
```

Uso:

```java
nomes.stream()
        .sorted(porTamanho)
        .toList();
```

---

## App ordenando por tamanho

Crie:

```text
src\br\com\curso\aula193\app\StreamSortedComparatorApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import java.util.Comparator;
import java.util.List;

public class StreamSortedComparatorApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Maria", "Ana", "Carlos", "João", "Alexandre");

        List<String> ordenadosPorTamanho = nomes.stream()
                .sorted(Comparator.comparing(String::length))
                .toList();

        System.out.println(ordenadosPorTamanho);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.StreamSortedComparatorApp
```

---

## Como ler Comparator.comparing

```java
Comparator.comparing(String::length)
```

Significa:

```text
compare os itens usando o tamanho da String.
```

A função:

```java
String::length
```

extrai a chave de comparação.

---

## Ordenando em ordem decrescente

Use:

```java
reversed()
```

Crie:

```text
src\br\com\curso\aula193\app\StreamSortedReversedApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import java.util.Comparator;
import java.util.List;

public class StreamSortedReversedApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Maria", "Ana", "Carlos", "João", "Alexandre");

        List<String> maioresPrimeiro = nomes.stream()
                .sorted(Comparator.comparing(String::length).reversed())
                .toList();

        System.out.println(maioresPrimeiro);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.StreamSortedReversedApp
```

---

## Comparação por mais de um critério

Use:

```java
thenComparing
```

Exemplo:

```java
.sorted(
        Comparator.comparing(String::length)
                .thenComparing(nome -> nome)
)
```

Crie:

```text
src\br\com\curso\aula193\app\StreamSortedThenComparingApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import java.util.Comparator;
import java.util.List;

public class StreamSortedThenComparingApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("João", "Ana", "Bia", "Carlos", "Maria", "Bruna");

        List<String> ordenados = nomes.stream()
                .sorted(
                        Comparator.comparing(String::length)
                                .thenComparing(nome -> nome)
                )
                .toList();

        System.out.println(ordenados);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.StreamSortedThenComparingApp
```

---

## Como ler thenComparing

```java
Comparator.comparing(String::length)
        .thenComparing(nome -> nome)
```

Leitura:

```text
ordene primeiro por tamanho;
se empatar, ordene pelo próprio nome.
```

Isso é muito comum em backend:

```text
ordenar por status e depois por data;
ordenar por prioridade e depois por nome;
ordenar por data e depois por código;
ordenar por cliente e depois por valor.
```

---

# Parte 3 — distinct

## O que é distinct

`distinct()` remove duplicados do Stream.

Exemplo:

```java
nomes.stream()
        .distinct()
        .toList();
```

---

## App básico com distinct

Crie:

```text
src\br\com\curso\aula193\app\StreamDistinctBasicoApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import java.util.List;

public class StreamDistinctBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Ana", "Maria", "Carlos", "João");

        List<String> unicos = nomes.stream()
                .distinct()
                .toList();

        System.out.println(unicos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.StreamDistinctBasicoApp
```

---

## distinct depende de equals/hashCode

Para objetos próprios, `distinct` usa:

```text
equals;
hashCode.
```

Se sua classe não implementa corretamente `equals` e `hashCode`, `distinct` pode não funcionar como você espera.

Isso conecta diretamente com o que estudamos em módulos anteriores.

---

# Parte 4 — limit

## O que é limit

`limit(n)` limita a quantidade máxima de elementos do Stream.

Exemplo:

```java
nomes.stream()
        .limit(3)
        .toList();
```

Retorna no máximo 3 elementos.

---

## App básico com limit

Crie:

```text
src\br\com\curso\aula193\app\StreamLimitBasicoApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import java.util.List;

public class StreamLimitBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Bruna");

        List<String> primeirosTres = nomes.stream()
                .limit(3)
                .toList();

        System.out.println(primeirosTres);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.StreamLimitBasicoApp
```

---

## limit com ordenação

`limit` é muito usado depois de `sorted`.

Exemplo:

```java
produtos.stream()
        .sorted(Comparator.comparing(Produto::preco).reversed())
        .limit(5)
        .toList();
```

Leitura:

```text
ordene por preço decrescente;
pegue os 5 primeiros.
```

Isso cria um ranking ou top N.

---

# Parte 5 — skip

## O que é skip

`skip(n)` pula os primeiros `n` elementos do Stream.

Exemplo:

```java
nomes.stream()
        .skip(2)
        .toList();
```

Ignora os dois primeiros.

---

## App básico com skip

Crie:

```text
src\br\com\curso\aula193\app\StreamSkipBasicoApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import java.util.List;

public class StreamSkipBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Bruna");

        List<String> depoisDosDoisPrimeiros = nomes.stream()
                .skip(2)
                .toList();

        System.out.println(depoisDosDoisPrimeiros);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.StreamSkipBasicoApp
```

---

## skip + limit

`skip` e `limit` juntos são a base de paginação em memória.

Exemplo:

```java
int pagina = 1;
int tamanho = 3;

List<String> resultado = nomes.stream()
        .skip((long) pagina * tamanho)
        .limit(tamanho)
        .toList();
```

Se `pagina` começa em 0:

```text
página 0:
skip 0

página 1:
skip tamanho

página 2:
skip tamanho * 2
```

---

## App com paginação simples

Crie:

```text
src\br\com\curso\aula193\app\StreamSkipLimitPaginacaoApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import java.util.List;

public class StreamSkipLimitPaginacaoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of(
                "Ana",
                "Carlos",
                "Maria",
                "João",
                "Bruna",
                "Marcos",
                "Fernanda",
                "Rafael"
        );

        int pagina = 1;
        int tamanho = 3;

        List<String> resultado = nomes.stream()
                .skip((long) pagina * tamanho)
                .limit(tamanho)
                .toList();

        System.out.println("Página: " + pagina);
        System.out.println("Tamanho: " + tamanho);
        System.out.println(resultado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.StreamSkipLimitPaginacaoApp
```

---

## Observação profissional sobre paginação

Isso é paginação em memória.

É útil para aprender.

Mas em backend real com banco, paginação normalmente deve ir para o banco.

Exemplo futuro:

```text
PageRequest.of(pagina, tamanho, Sort.by("nome"))
```

Ou SQL:

```sql
ORDER BY nome
LIMIT 10
OFFSET 20
```

Não carregue milhares ou milhões de registros para paginar em memória sem necessidade.

---

# Parte 6 — Domínio Cliente

Agora vamos aplicar em objetos de domínio.

## Email

Crie:

```text
src\br\com\curso\aula193\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula193.dominio.valor;

import java.util.Objects;

public final class Email {
    private final String valor;

    public Email(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        String normalizado = valor.trim().toLowerCase();

        if (!normalizado.contains("@")) {
            throw new IllegalArgumentException("E-mail inválido.");
        }

        this.valor = normalizado;
    }

    public String valor() {
        return valor;
    }

    public String dominio() {
        return valor.substring(valor.indexOf("@") + 1);
    }

    public String resumo() {
        return valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof Email email)) {
            return false;
        }

        return Objects.equals(valor, email.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
```

---

## Cliente

Crie:

```text
src\br\com\curso\aula193\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula193.dominio.cliente;

import br.com.curso.aula193.dominio.valor.Email;

public class Cliente {
    private final Email email;
    private final String nome;
    private final boolean ativo;
    private final boolean bloqueado;

    public Cliente(Email email, String nome, boolean ativo, boolean bloqueado) {
        if (email == null) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.email = email;
        this.nome = nome.trim();
        this.ativo = ativo;
        this.bloqueado = bloqueado;
    }

    public Email email() {
        return email;
    }

    public String nome() {
        return nome;
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
                + " | " + email.resumo()
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

## App Cliente ordenado

Crie:

```text
src\br\com\curso\aula193\app\ClienteSortedApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import br.com.curso.aula193.dominio.cliente.Cliente;
import br.com.curso.aula193.dominio.valor.Email;

import java.util.Comparator;
import java.util.List;

public class ClienteSortedApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("maria@empresa.com"), "Maria Oliveira", true, false),
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true, false),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", true, true),
                new Cliente(new Email("joao@empresa.com"), "João Lima", false, false)
        );

        List<Cliente> ordenados = clientes.stream()
                .filter(Cliente::podeOperar)
                .sorted(Comparator.comparing(Cliente::nome))
                .toList();

        ordenados.forEach(cliente -> System.out.println(cliente.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.ClienteSortedApp
```

---

## Ordenando por domínio e depois nome

Crie:

```text
src\br\com\curso\aula193\app\ClienteSortedThenComparingApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import br.com.curso.aula193.dominio.cliente.Cliente;
import br.com.curso.aula193.dominio.valor.Email;

import java.util.Comparator;
import java.util.List;

public class ClienteSortedThenComparingApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("maria@gmail.com"), "Maria Oliveira", true, false),
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true, false),
                new Cliente(new Email("bruna@gmail.com"), "Bruna Alves", true, false),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", true, false)
        );

        List<Cliente> ordenados = clientes.stream()
                .sorted(
                        Comparator.comparing((Cliente cliente) -> cliente.email().dominio())
                                .thenComparing(Cliente::nome)
                )
                .toList();

        ordenados.forEach(cliente -> System.out.println(cliente.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.ClienteSortedThenComparingApp
```

---

## Observação sobre inferência de tipo

Neste trecho:

```java
Comparator.comparing((Cliente cliente) -> cliente.email().dominio())
```

colocamos o tipo `Cliente` explicitamente para ajudar o compilador e a leitura.

Em alguns casos, o Java consegue inferir.

Em outros, informar o tipo deixa mais claro.

---

# Parte 7 — Produto com sorted, limit e skip

## Produto

Crie:

```text
src\br\com\curso\aula193\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula193.dominio.produto;

import java.math.BigDecimal;
import java.util.Objects;

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

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof Produto produto)) {
            return false;
        }

        return Objects.equals(sku, produto.sku);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sku);
    }
}
```

---

## App Top produtos

Crie:

```text
src\br\com\curso\aula193\app\ProdutoTopPrecoApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import br.com.curso.aula193.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

public class ProdutoTopPrecoApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10),
                new Produto("prd-004", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-005", "Cadeira", "Móveis", new BigDecimal("450.00"), false, 0)
        );

        List<Produto> top3MaisCaros = produtos.stream()
                .filter(Produto::disponivel)
                .sorted(Comparator.comparing(Produto::preco).reversed())
                .limit(3)
                .toList();

        top3MaisCaros.forEach(produto -> System.out.println(produto.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.ProdutoTopPrecoApp
```

---

## App paginação de produtos

Crie:

```text
src\br\com\curso\aula193\app\ProdutoPaginacaoApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import br.com.curso.aula193.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

public class ProdutoPaginacaoApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10),
                new Produto("prd-004", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-005", "Cadeira", "Móveis", new BigDecimal("450.00"), true, 12),
                new Produto("prd-006", "Teclado", "Informática", new BigDecimal("150.00"), true, 8)
        );

        int pagina = 1;
        int tamanho = 2;

        List<Produto> resultado = produtos.stream()
                .filter(Produto::disponivel)
                .sorted(Comparator.comparing(Produto::nome))
                .skip((long) pagina * tamanho)
                .limit(tamanho)
                .toList();

        resultado.forEach(produto -> System.out.println(produto.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.ProdutoPaginacaoApp
```

---

## App distinct com Produto

Crie:

```text
src\br\com\curso\aula193\app\ProdutoDistinctApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import br.com.curso.aula193.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoDistinctApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-001", "Notebook duplicado", "Informática", new BigDecimal("3600.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20)
        );

        List<Produto> unicos = produtos.stream()
                .distinct()
                .toList();

        unicos.forEach(produto -> System.out.println(produto.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.ProdutoDistinctApp
```

---

## O que observar

Como `Produto` implementou `equals` e `hashCode` por `sku`, o `distinct` considera produtos com mesmo SKU como duplicados.

Essa decisão precisa fazer sentido para o domínio.

No nosso exemplo:

```text
SKU identifica produto.
```

Por isso faz sentido.

---

# Parte 8 — Pedido com ordenação

## Pedido

Crie:

```text
src\br\com\curso\aula193\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula193.dominio.pedido;

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

## App Pedido ordenado

Crie:

```text
src\br\com\curso\aula193\app\PedidoSortedApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import br.com.curso.aula193.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

public class PedidoSortedApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), LocalDate.of(2026, 7, 2), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), LocalDate.of(2026, 7, 1), true, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), LocalDate.of(2026, 7, 3), false, false),
                new Pedido("PED-004", "João", new BigDecimal("3000.00"), LocalDate.of(2026, 7, 1), true, true)
        );

        List<Pedido> paraFaturarOrdenados = pedidos.stream()
                .filter(Pedido::podeFaturar)
                .sorted(
                        Comparator.comparing(Pedido::data)
                                .thenComparing(Comparator.comparing(Pedido::valor).reversed())
                )
                .toList();

        paraFaturarOrdenados.forEach(pedido -> System.out.println(pedido.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.PedidoSortedApp
```

---

## Leitura do Comparator

```java
Comparator.comparing(Pedido::data)
        .thenComparing(Comparator.comparing(Pedido::valor).reversed())
```

Leitura:

```text
ordene por data crescente;
se empatar, ordene por valor decrescente.
```

Essa composição de comparator é muito usada em código real.

---

# Parte 9 — Ordem de Serviço com prioridade

## OrdemServico

Crie:

```text
src\br\com\curso\aula193\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula193.dominio.ordemservico;

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

    public int prioridadeNumerica() {
        if (urgente) {
            return 1;
        }

        if (diasEmAberto > 15) {
            return 2;
        }

        return 3;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Status: " + status
                + " | Urgente: " + urgente
                + " | Dias em aberto: " + diasEmAberto
                + " | Prioridade: " + prioridadeNumerica();
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## App OS prioridade

Crie:

```text
src\br\com\curso\aula193\app\OrdemServicoPrioridadeApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import br.com.curso.aula193.dominio.ordemservico.OrdemServico;

import java.util.Comparator;
import java.util.List;

public class OrdemServicoPrioridadeApp {
    public static void main(String[] args) {
        List<OrdemServico> ordens = List.of(
                new OrdemServico("OS-001", "Ana", "ABERTA", false, 5),
                new OrdemServico("OS-002", "Carlos", "ABERTA", true, 2),
                new OrdemServico("OS-003", "Maria", "ABERTA", false, 20),
                new OrdemServico("OS-004", "João", "CONCLUIDA", true, 1),
                new OrdemServico("OS-005", "Bruna", "ABERTA", false, 10)
        );

        List<OrdemServico> priorizadas = ordens.stream()
                .filter(OrdemServico::podeAtender)
                .sorted(
                        Comparator.comparing(OrdemServico::prioridadeNumerica)
                                .thenComparing(Comparator.comparing(OrdemServico::diasEmAberto).reversed())
                                .thenComparing(OrdemServico::codigo)
                )
                .toList();

        priorizadas.forEach(os -> System.out.println(os.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.OrdemServicoPrioridadeApp
```

---

## Ponto arquitetural

A regra:

```java
prioridadeNumerica()
```

ficou dentro da entidade.

Isso é melhor do que escrever toda a regra dentro do comparator.

O Stream usa a regra.

A entidade protege a regra.

A frase continua:

```text
A entidade decide.
O use case coordena.
O repository salva.
O client integra.
O controller recebe.
```

---

# Parte 10 — Services com ordenação e paginação em memória

## ProdutoResponse

Crie:

```text
src\br\com\curso\aula193\dto\ProdutoResponse.java
```

Código:

```java
package br.com.curso.aula193.dto;

import java.math.BigDecimal;

public class ProdutoResponse {
    private final String sku;
    private final String nome;
    private final String categoria;
    private final BigDecimal preco;

    public ProdutoResponse(String sku, String nome, String categoria, BigDecimal preco) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (categoria == null || categoria.isBlank()) {
            throw new IllegalArgumentException("Categoria é obrigatória.");
        }

        if (preco == null) {
            throw new IllegalArgumentException("Preço é obrigatório.");
        }

        this.sku = sku;
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
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

    public String resumo() {
        return sku + " | " + nome + " | " + categoria + " | " + preco;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ProdutoMapper

Crie:

```text
src\br\com\curso\aula193\dto\ProdutoMapper.java
```

Código:

```java
package br.com.curso.aula193.dto;

import br.com.curso.aula193.dominio.produto.Produto;

public final class ProdutoMapper {
    private ProdutoMapper() {
    }

    public static ProdutoResponse toResponse(Produto produto) {
        if (produto == null) {
            throw new IllegalArgumentException("Produto é obrigatório.");
        }

        return new ProdutoResponse(
                produto.sku(),
                produto.nome(),
                produto.categoria(),
                produto.preco()
        );
    }
}
```

---

## ProdutoConsultaService

Crie:

```text
src\br\com\curso\aula193\service\ProdutoConsultaService.java
```

Código:

```java
package br.com.curso.aula193.service;

import br.com.curso.aula193.dominio.produto.Produto;
import br.com.curso.aula193.dto.ProdutoMapper;
import br.com.curso.aula193.dto.ProdutoResponse;

import java.util.Comparator;
import java.util.List;

public class ProdutoConsultaService {
    private final List<Produto> produtos;

    public ProdutoConsultaService(List<Produto> produtos) {
        if (produtos == null) {
            throw new IllegalArgumentException("Produtos são obrigatórios.");
        }

        this.produtos = List.copyOf(produtos);
    }

    public List<ProdutoResponse> listarDisponiveisOrdenadosPorNome() {
        return produtos.stream()
                .filter(Produto::disponivel)
                .sorted(Comparator.comparing(Produto::nome))
                .map(ProdutoMapper::toResponse)
                .toList();
    }

    public List<ProdutoResponse> listarTopMaisCaros(int limite) {
        if (limite <= 0) {
            throw new IllegalArgumentException("Limite deve ser maior que zero.");
        }

        return produtos.stream()
                .filter(Produto::disponivel)
                .sorted(Comparator.comparing(Produto::preco).reversed())
                .limit(limite)
                .map(ProdutoMapper::toResponse)
                .toList();
    }

    public List<ProdutoResponse> listarPaginaOrdenadaPorNome(int pagina, int tamanho) {
        if (pagina < 0) {
            throw new IllegalArgumentException("Página não pode ser negativa.");
        }

        if (tamanho <= 0) {
            throw new IllegalArgumentException("Tamanho deve ser maior que zero.");
        }

        return produtos.stream()
                .filter(Produto::disponivel)
                .sorted(Comparator.comparing(Produto::nome))
                .skip((long) pagina * tamanho)
                .limit(tamanho)
                .map(ProdutoMapper::toResponse)
                .toList();
    }
}
```

---

## App ProdutoConsultaService

Crie:

```text
src\br\com\curso\aula193\app\ProdutoConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula193.app;

import br.com.curso.aula193.dominio.produto.Produto;
import br.com.curso.aula193.dto.ProdutoResponse;
import br.com.curso.aula193.service.ProdutoConsultaService;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoConsultaServiceApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10),
                new Produto("prd-004", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-005", "Cadeira", "Móveis", new BigDecimal("450.00"), true, 12),
                new Produto("prd-006", "Teclado", "Informática", new BigDecimal("150.00"), true, 8)
        );

        ProdutoConsultaService service = new ProdutoConsultaService(produtos);

        System.out.println("Ordenados por nome:");
        imprimir(service.listarDisponiveisOrdenadosPorNome());

        System.out.println();

        System.out.println("Top 3 mais caros:");
        imprimir(service.listarTopMaisCaros(3));

        System.out.println();

        System.out.println("Página 1 tamanho 2:");
        imprimir(service.listarPaginaOrdenadaPorNome(1, 2));
    }

    private static void imprimir(List<ProdutoResponse> produtos) {
        produtos.forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula193.app.ProdutoConsultaServiceApp
```

---

# Parte 11 — Ordem recomendada no pipeline

A ordem das operações afeta leitura e performance.

Em geral:

```text
1. stream()
2. filter()
3. distinct()
4. sorted()
5. skip()
6. limit()
7. map()
8. toList() / collect()
```

Mas depende do caso.

---

## Por que filtrar antes de ordenar

Prefira:

```java
produtos.stream()
        .filter(Produto::disponivel)
        .sorted(Comparator.comparing(Produto::nome))
        .toList();
```

em vez de:

```java
produtos.stream()
        .sorted(Comparator.comparing(Produto::nome))
        .filter(Produto::disponivel)
        .toList();
```

Filtrar antes reduz a quantidade de itens a ordenar.

---

## Por que map geralmente vem depois

Se você precisa ordenar por campo da entidade, ordene antes de mapear para response.

Exemplo:

```java
produtos.stream()
        .filter(Produto::disponivel)
        .sorted(Comparator.comparing(Produto::preco))
        .map(ProdutoMapper::toResponse)
        .toList();
```

Se mapear antes, talvez você perca informações úteis da entidade.

---

## skip/limit depois da ordenação

Para paginação correta, primeiro ordene, depois aplique `skip` e `limit`.

```java
produtos.stream()
        .sorted(Comparator.comparing(Produto::nome))
        .skip((long) pagina * tamanho)
        .limit(tamanho)
        .toList();
```

Se você aplicar `limit` antes de ordenar, você ordena apenas um recorte arbitrário.

---

# Parte 12 — Erros comuns

## 1. Usar sorted() em objeto sem Comparable

Se `Produto` não implementa `Comparable`, isto não funciona:

```java
produtos.stream().sorted()
```

Use:

```java
produtos.stream().sorted(Comparator.comparing(Produto::nome))
```

---

## 2. Achar que distinct remove duplicados por campo sem equals/hashCode

`distinct` depende de `equals` e `hashCode`.

Se quer remover duplicados por uma chave específica sem alterar equals/hashCode, precisa de outra estratégia.

Vamos ver técnicas mais avançadas depois.

---

## 3. Aplicar limit antes de sorted sem intenção

Cuidado:

```java
stream.limit(10).sorted(...)
```

Isso pega os 10 primeiros da lista original e depois ordena só eles.

Geralmente, para top N, o certo é:

```java
stream.sorted(...).limit(10)
```

---

## 4. Paginando sem ordenação

Paginar sem ordenação pode gerar resultado instável.

Prefira:

```java
.sorted(...)
.skip(...)
.limit(...)
```

---

## 5. Ordenar/paginar grandes volumes em memória

Em backend real, prefira banco:

```text
ORDER BY;
LIMIT;
OFFSET;
Pageable.
```

---

## 6. Comparator ilegível

Se o comparator ficou grande demais, extraia.

Exemplo:

```java
private static Comparator<OrdemServico> porPrioridade() {
    return Comparator.comparing(OrdemServico::prioridadeNumerica)
            .thenComparing(Comparator.comparing(OrdemServico::diasEmAberto).reversed())
            .thenComparing(OrdemServico::codigo);
}
```

---

# Parte 13 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula193.app.StreamSortedBasicoApp
java -cp out br.com.curso.aula193.app.StreamSortedNumerosApp
java -cp out br.com.curso.aula193.app.StreamSortedComparatorApp
java -cp out br.com.curso.aula193.app.StreamSortedReversedApp
java -cp out br.com.curso.aula193.app.StreamSortedThenComparingApp
java -cp out br.com.curso.aula193.app.StreamDistinctBasicoApp
java -cp out br.com.curso.aula193.app.StreamLimitBasicoApp
java -cp out br.com.curso.aula193.app.StreamSkipBasicoApp
java -cp out br.com.curso.aula193.app.StreamSkipLimitPaginacaoApp
java -cp out br.com.curso.aula193.app.ClienteSortedApp
java -cp out br.com.curso.aula193.app.ClienteSortedThenComparingApp
java -cp out br.com.curso.aula193.app.ProdutoTopPrecoApp
java -cp out br.com.curso.aula193.app.ProdutoPaginacaoApp
java -cp out br.com.curso.aula193.app.ProdutoDistinctApp
java -cp out br.com.curso.aula193.app.PedidoSortedApp
java -cp out br.com.curso.aula193.app.OrdemServicoPrioridadeApp
java -cp out br.com.curso.aula193.app.ProdutoConsultaServiceApp
```

Para cada execução, responda:

```text
qual foi a fonte do stream?
qual foi o filtro?
qual foi o critério de ordenação?
houve distinct?
houve limit?
houve skip?
o map ocorreu antes ou depois da ordenação?
a ordem do pipeline fez sentido?
```

---

# Parte 14 — Desafio prático

Crie entidade:

```text
src\br\com\curso\aula193\dominio\atividade\Atividade.java
```

Campos:

```text
String codigo;
String descricao;
String status;
boolean obrigatoria;
boolean urgente;
int tentativas;
```

Regras:

```text
codigo obrigatório;
descricao obrigatória;
status obrigatório;
tentativas não pode ser negativo;
pendente() retorna status igual "PENDENTE";
concluida() retorna status igual "CONCLUIDA";
excedeuTentativas() retorna tentativas > 3;
podeExecutar() retorna pendente && !excedeuTentativas;
prioridadeNumerica():
    1 se urgente e obrigatoria;
    2 se urgente;
    3 se obrigatoria;
    4 caso contrário;
resumo().
```

Crie DTO:

```text
src\br\com\curso\aula193\dto\AtividadeResponse.java
```

Campos:

```text
codigo;
descricao;
status;
prioridade;
```

Crie mapper:

```text
src\br\com\curso\aula193\dto\AtividadeMapper.java
```

Crie service:

```text
src\br\com\curso\aula193\service\AtividadeConsultaService.java
```

Métodos:

```java
List<AtividadeResponse> listarExecutaveisOrdenadasPorPrioridade()

List<AtividadeResponse> listarTopExecutaveis(int limite)

List<AtividadeResponse> listarPaginaExecutaveis(int pagina, int tamanho)
```

Ordenação obrigatória:

```text
prioridadeNumerica crescente;
tentativas decrescente;
codigo crescente.
```

Crie app:

```text
src\br\com\curso\aula193\app\AtividadeConsultaServiceApp.java
```

Critério principal:

```text
usar sorted;
usar Comparator.comparing;
usar reversed;
usar thenComparing;
usar limit;
usar skip;
usar mapper;
não imprimir dentro do service.
```

---

## Desafio extra

Crie uma lista com atividades duplicadas pelo mesmo código.

Implemente `equals` e `hashCode` em `Atividade` usando `codigo`.

No service, crie:

```java
List<AtividadeResponse> listarExecutaveisUnicasOrdenadas()
```

Pipeline obrigatório:

```text
stream;
filter podeExecutar;
distinct;
sorted;
map;
toList.
```

Critério principal:

```text
entender distinct com equals/hashCode.
```

---

# Parte 15 — Debug recomendado

Coloque breakpoints em:

```text
ProdutoTopPrecoApp
ProdutoPaginacaoApp
ProdutoDistinctApp
PedidoSortedApp
OrdemServicoPrioridadeApp
ProdutoConsultaService
```

Pontos de atenção:

```java
.sorted(...)
.distinct()
.limit(...)
.skip(...)
.toList()
```

Observe:

```text
quando os itens são filtrados;
quando os itens são ordenados;
quando duplicados são removidos;
quando a lista é limitada;
quando os primeiros itens são pulados;
quando a paginação é montada;
quando o mapper é executado.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Quando usar sorted() sem Comparator?
2. Quando usar sorted(Comparator)?
3. Por que distinct depende de equals/hashCode?
4. Qual a diferença entre limit e skip?
5. Por que paginação em memória não é ideal para grandes volumes?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar sorted();
usar sorted(Comparator);
usar Comparator.comparing;
usar reversed;
usar thenComparing;
usar distinct;
explicar equals/hashCode no distinct;
usar limit;
usar skip;
combinar skip + limit;
montar top N;
montar paginação simples;
ordenar objetos de domínio;
ordenar por múltiplos critérios;
criar service com ordenação;
criar service com paginação em memória;
saber quando banco deveria fazer ordenação/paginação;
resolver AtividadeConsultaServiceApp;
resolver listarExecutaveisUnicasOrdenadas;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-193-streams-sorted-comparator-distinct-limit-skip
git commit -m "Aula 193: streams sorted comparator distinct limit skip"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Streams também servem para organizar, remover duplicados e recortar resultados.
```

Você estudou:

```text
sorted;
Comparator;
Comparator.comparing;
reversed;
thenComparing;
distinct;
limit;
skip;
paginação em memória;
top N;
ordenação por múltiplos critérios.
```

Também reforçou uma visão profissional:

```text
ordenar e paginar em memória é útil para aprender e para listas pequenas;
em backend real com banco, isso normalmente deve ir para SQL ou Spring Data.
```

Na próxima aula, vamos estudar operações de redução e agregação:

```text
min;
max;
reduce;
soma;
totalização;
maior valor;
menor valor;
agregações simples.
```

Esse assunto é importante para relatórios, dashboards, validações e cálculos em backend.
