# 190 — M7.05 — Streams API: introdução, filter, map e forEach

## Objetivo da aula

Nesta aula você vai iniciar um dos assuntos mais usados no Java moderno:

```text
Streams API
```

Streams aparecem em praticamente todo projeto Java backend atual.

Você verá Streams em:

```text
tratamento de listas;
filtros;
mapeamentos;
transformação de entidades em DTOs;
relatórios;
validações;
resumos;
agrupamentos;
processamento de collections;
testes;
serviços;
controllers;
integrações;
consultas em memória.
```

Na aula anterior, você estudou:

```text
Predicate<T>;
Function<T, R>;
Consumer<T>;
Supplier<T>;
method reference;
composição funcional.
```

Agora vamos ver essas interfaces funcionando dentro de Streams.

Ao final desta aula, você deve conseguir:

```text
entender o que é Stream;
entender diferença entre Collection e Stream;
criar stream a partir de List;
usar filter;
usar map;
usar forEach;
entender operações intermediárias;
entender operações terminais;
entender execução preguiçosa;
usar lambdas em streams;
usar method reference em streams;
evitar erros comuns;
entender quando stream melhora o código;
entender quando for tradicional é melhor;
aplicar Streams em domínio de backend.
```

---

## Ideia principal

Uma `List` guarda dados.

Uma `Stream` processa dados.

Exemplo:

```java
List<Cliente> clientes = List.of(...);
```

A lista contém clientes.

Quando fazemos:

```java
clientes.stream()
        .filter(Cliente::ativo)
        .map(Cliente::resumo)
        .forEach(System.out::println);
```

estamos criando um fluxo de processamento:

```text
pegar clientes;
filtrar ativos;
transformar em resumo;
imprimir.
```

Esse é o coração da Streams API.

---

## O que é Stream

`Stream<T>` representa uma sequência de elementos que pode ser processada.

Exemplo:

```java
Stream<Cliente>
Stream<String>
Stream<Pedido>
Stream<Produto>
Stream<Integer>
```

Um Stream não é uma lista.

Ele é um fluxo de processamento.

A lista armazena.

O stream processa.

---

## Collection vs Stream

### Collection

Uma collection representa dados armazenados:

```java
List<Cliente> clientes
Set<String> nomes
Map<CodigoOs, OrdemServico> ordens
```

Você pode:

```text
guardar;
adicionar;
remover;
consultar;
iterar.
```

### Stream

Um stream representa processamento:

```java
clientes.stream()
        .filter(...)
        .map(...)
        .forEach(...);
```

Você pode:

```text
filtrar;
transformar;
ordenar;
limitar;
agrupar;
reduzir;
coletar.
```

---

## Primeira comparação: for tradicional vs stream

Com `for` tradicional:

```java
for (Cliente cliente : clientes) {
    if (cliente.ativo()) {
        System.out.println(cliente.resumo());
    }
}
```

Com Stream:

```java
clientes.stream()
        .filter(Cliente::ativo)
        .map(Cliente::resumo)
        .forEach(System.out::println);
```

Ambos podem estar corretos.

A diferença é o estilo.

O Stream descreve um pipeline de processamento.

---

## Pipeline de Stream

Um pipeline de Stream geralmente tem três partes:

```text
fonte;
operações intermediárias;
operação terminal.
```

Exemplo:

```java
clientes.stream()
        .filter(Cliente::ativo)
        .map(Cliente::resumo)
        .forEach(System.out::println);
```

Separando:

```text
Fonte:
clientes.stream()

Operação intermediária:
filter(Cliente::ativo)

Operação intermediária:
map(Cliente::resumo)

Operação terminal:
forEach(System.out::println)
```

---

## Operações intermediárias

Operações intermediárias transformam ou filtram o fluxo, mas não executam tudo sozinhas.

Exemplos:

```text
filter;
map;
sorted;
limit;
skip;
distinct.
```

Nesta aula vamos focar em:

```text
filter;
map.
```

---

## Operações terminais

Operações terminais encerram o pipeline e disparam o processamento.

Exemplos:

```text
forEach;
toList;
count;
findFirst;
anyMatch;
allMatch;
noneMatch;
reduce;
collect.
```

Nesta aula vamos focar em:

```text
forEach.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-190-streams-api-introducao-filter-map-foreach
cd labs\m7\aula-190-streams-api-introducao-filter-map-foreach
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula190
mkdir src\br\com\curso\aula190\app
mkdir src\br\com\curso\aula190\dominio
mkdir src\br\com\curso\aula190\dominio\valor
mkdir src\br\com\curso\aula190\dominio\cliente
mkdir src\br\com\curso\aula190\dominio\produto
mkdir src\br\com\curso\aula190\dominio\pedido
mkdir src\br\com\curso\aula190\util
```

---

# Parte 1 — Primeiro Stream

## App simples com String

Crie:

```text
src\br\com\curso\aula190\app\PrimeiroStreamApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import java.util.List;

public class PrimeiroStreamApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        nomes.stream()
                .forEach(nome -> System.out.println(nome));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.PrimeiroStreamApp
```

---

## O que aconteceu

A lista:

```java
nomes
```

virou um stream:

```java
nomes.stream()
```

Depois usamos:

```java
forEach(...)
```

para processar cada elemento.

A lambda:

```java
nome -> System.out.println(nome)
```

é um:

```java
Consumer<String>
```

Porque recebe uma `String` e não retorna nada.

---

## Melhorando com method reference

Crie:

```text
src\br\com\curso\aula190\app\PrimeiroStreamMethodReferenceApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import java.util.List;

public class PrimeiroStreamMethodReferenceApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        nomes.stream()
                .forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.PrimeiroStreamMethodReferenceApp
```

---

## Como ler forEach

```java
forEach(System.out::println)
```

Significa:

```text
para cada item do stream, execute println.
```

O `forEach` recebe um:

```java
Consumer<T>
```

Neste caso:

```java
Consumer<String>
```

---

# Parte 2 — filter

## O que é filter

`filter` mantém no stream apenas os elementos que passam em uma condição.

Assinatura conceitual:

```java
Stream<T> filter(Predicate<? super T> predicate)
```

Em linguagem simples:

```text
recebe uma regra;
testa cada item;
mantém apenas os itens que retornam true.
```

Exemplo:

```java
nomes.stream()
        .filter(nome -> nome.length() >= 5)
        .forEach(System.out::println);
```

---

## App com filter

Crie:

```text
src\br\com\curso\aula190\app\StreamFilterBasicoApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import java.util.List;

public class StreamFilterBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Alexandre");

        nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamFilterBasicoApp
```

---

## Como ler filter

```java
.filter(nome -> nome.length() >= 5)
```

Significa:

```text
mantenha apenas nomes com tamanho maior ou igual a 5.
```

A lambda:

```java
nome -> nome.length() >= 5
```

é um:

```java
Predicate<String>
```

Porque recebe `String` e retorna `boolean`.

---

## filter com Predicate nomeado

Crie:

```text
src\br\com\curso\aula190\app\StreamFilterPredicateNomeadoApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import java.util.List;
import java.util.function.Predicate;

public class StreamFilterPredicateNomeadoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Alexandre");

        Predicate<String> nomeGrande = nome -> nome.length() >= 5;

        nomes.stream()
                .filter(nomeGrande)
                .forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamFilterPredicateNomeadoApp
```

---

## Por que nomear Predicate pode ajudar

Este código:

```java
Predicate<String> nomeGrande = nome -> nome.length() >= 5;
```

dá nome para a regra.

Isso melhora leitura quando a regra é usada mais de uma vez ou representa algo importante.

Em código profissional, nome bom vale muito.

---

# Parte 3 — map

## O que é map

`map` transforma cada elemento do stream em outro valor.

Assinatura conceitual:

```java
<R> Stream<R> map(Function<? super T, ? extends R> mapper)
```

Em linguagem simples:

```text
recebe uma função;
aplica essa função em cada item;
gera um novo stream com os resultados.
```

Exemplo:

```java
nomes.stream()
        .map(String::toUpperCase)
        .forEach(System.out::println);
```

---

## App com map

Crie:

```text
src\br\com\curso\aula190\app\StreamMapBasicoApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import java.util.List;

public class StreamMapBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        nomes.stream()
                .map(String::toUpperCase)
                .forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamMapBasicoApp
```

---

## Como ler map

```java
.map(String::toUpperCase)
```

Significa:

```text
transforme cada String em sua versão maiúscula.
```

`String::toUpperCase` é uma:

```java
Function<String, String>
```

Recebe `String`.

Retorna `String`.

---

## map mudando o tipo

O `map` pode mudar o tipo do stream.

Crie:

```text
src\br\com\curso\aula190\app\StreamMapMudandoTipoApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import java.util.List;

public class StreamMapMudandoTipoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        nomes.stream()
                .map(String::length)
                .forEach(tamanho -> System.out.println("Tamanho: " + tamanho));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamMapMudandoTipoApp
```

---

## Fluxo de tipos

Antes do map:

```java
Stream<String>
```

Depois de:

```java
.map(String::length)
```

vira:

```java
Stream<Integer>
```

Porque:

```java
String::length
```

recebe `String` e retorna `int`, que é tratado como `Integer` no contexto genérico.

Esse é um ponto essencial.

`map` transforma o tipo do fluxo.

---

# Parte 4 — filter + map + forEach

Agora vamos juntar.

Crie:

```text
src\br\com\curso\aula190\app\StreamFilterMapForEachApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import java.util.List;

public class StreamFilterMapForEachApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Alexandre");

        nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .map(String::toUpperCase)
                .forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamFilterMapForEachApp
```

---

## Como ler esse pipeline

```java
nomes.stream()
        .filter(nome -> nome.length() >= 5)
        .map(String::toUpperCase)
        .forEach(System.out::println);
```

Leitura:

```text
pegue a lista de nomes;
crie um stream;
mantenha apenas nomes com 5 ou mais letras;
transforme cada nome em maiúsculo;
imprima cada resultado.
```

Esse é o jeito certo de ler Streams.

Não leia como “métodos soltos”.

Leia como fluxo.

---

## Tipos no pipeline

```java
nomes.stream()
```

Tipo:

```java
Stream<String>
```

Depois do filter:

```java
.filter(nome -> nome.length() >= 5)
```

Continua:

```java
Stream<String>
```

Depois do map:

```java
.map(String::toUpperCase)
```

Continua:

```java
Stream<String>
```

Depois do forEach:

```java
.forEach(System.out::println)
```

Termina o pipeline.

---

# Parte 5 — Operação intermediária vs terminal

## filter e map são intermediárias

Estas operações não encerram o Stream:

```java
filter
map
```

Elas retornam outro Stream.

Por isso você pode continuar encadeando:

```java
.stream()
.filter(...)
.map(...)
```

---

## forEach é terminal

Esta operação encerra o Stream:

```java
forEach
```

Depois dela, o processamento acontece.

Você não continua encadeando outro `map` após `forEach`.

Errado:

```java
clientes.stream()
        .forEach(System.out::println)
        .map(...);
```

Não compila.

`forEach` retorna `void`.

---

## App mostrando execução preguiçosa

Streams têm execução preguiçosa.

As operações intermediárias só executam quando há operação terminal.

Crie:

```text
src\br\com\curso\aula190\app\StreamExecucaoPreguicosaApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import java.util.List;

public class StreamExecucaoPreguicosaApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        nomes.stream()
                .filter(nome -> {
                    System.out.println("Filtrando: " + nome);
                    return nome.length() >= 5;
                })
                .map(nome -> {
                    System.out.println("Mapeando: " + nome);
                    return nome.toUpperCase();
                });

        System.out.println("Nenhuma operação terminal foi chamada.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamExecucaoPreguicosaApp
```

---

## O que observar

Você verá apenas:

```text
Nenhuma operação terminal foi chamada.
```

As mensagens dentro do `filter` e do `map` não aparecem.

Por quê?

Porque não houve operação terminal.

O pipeline foi montado, mas não executado.

---

## App com operação terminal

Crie:

```text
src\br\com\curso\aula190\app\StreamExecucaoComTerminalApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import java.util.List;

public class StreamExecucaoComTerminalApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        nomes.stream()
                .filter(nome -> {
                    System.out.println("Filtrando: " + nome);
                    return nome.length() >= 5;
                })
                .map(nome -> {
                    System.out.println("Mapeando: " + nome);
                    return nome.toUpperCase();
                })
                .forEach(nome -> System.out.println("Resultado: " + nome));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamExecucaoComTerminalApp
```

---

## O que observar

Agora o pipeline executa.

Você verá o filtro, o mapeamento e o resultado.

Isso mostra:

```text
filter e map são preguiçosos;
forEach dispara a execução.
```

Esse conceito é essencial para entender Streams.

---

# Parte 6 — Stream só pode ser consumido uma vez

Um Stream não deve ser reutilizado depois de uma operação terminal.

Crie:

```text
src\br\com\curso\aula190\app\StreamUsoUnicoApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import java.util.List;
import java.util.stream.Stream;

public class StreamUsoUnicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        Stream<String> stream = nomes.stream();

        stream.forEach(System.out::println);

        System.out.println("Stream já foi consumido. Crie outro stream se precisar processar novamente.");

        nomes.stream()
                .map(String::toUpperCase)
                .forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamUsoUnicoApp
```

---

## Observação

Se você tentar usar o mesmo `stream` novamente após `forEach`, receberá erro.

Exemplo perigoso:

```java
stream.forEach(System.out::println);
stream.map(String::toUpperCase);
```

Isso gera:

```text
IllegalStateException
```

Regra:

```text
stream é fluxo de uso único.
```

Se precisar processar de novo, crie outro stream a partir da lista.

---

# Parte 7 — Domínio de backend

Agora vamos aplicar em objetos de domínio.

## Email

Crie:

```text
src\br\com\curso\aula190\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula190.dominio.valor;

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
src\br\com\curso\aula190\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula190.dominio.cliente;

import br.com.curso.aula190.dominio.valor.Email;

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

## Stream com Cliente

Crie:

```text
src\br\com\curso\aula190\app\StreamClienteApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import br.com.curso.aula190.dominio.cliente.Cliente;
import br.com.curso.aula190.dominio.valor.Email;

import java.util.List;

public class StreamClienteApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true, false),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", true, true),
                new Cliente(new Email("maria@gmail.com"), "Maria Oliveira", true, false),
                new Cliente(new Email("joao@empresa.com"), "João Lima", false, false)
        );

        clientes.stream()
                .filter(Cliente::podeOperar)
                .filter(cliente -> cliente.email().dominio().equals("empresa.com"))
                .map(Cliente::resumo)
                .forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamClienteApp
```

---

## Como ler o pipeline de Cliente

```java
clientes.stream()
        .filter(Cliente::podeOperar)
        .filter(cliente -> cliente.email().dominio().equals("empresa.com"))
        .map(Cliente::resumo)
        .forEach(System.out::println);
```

Leitura:

```text
pegue clientes;
mantenha apenas quem pode operar;
mantenha apenas e-mails do domínio empresa.com;
transforme cliente em resumo;
imprima.
```

Repare que:

```java
Cliente::podeOperar
```

é melhor do que repetir:

```java
cliente -> cliente.ativo() && !cliente.bloqueado()
```

Porque essa regra pertence ao domínio.

---

# Parte 8 — Produto com Stream

## Produto

Crie:

```text
src\br\com\curso\aula190\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula190.dominio.produto;

import java.math.BigDecimal;

public class Produto {
    private final String sku;
    private final String nome;
    private final BigDecimal preco;
    private final boolean ativo;
    private final int estoque;

    public Produto(String sku, String nome, BigDecimal preco, boolean ativo, int estoque) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero.");
        }

        if (estoque < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo.");
        }

        this.sku = sku.trim().toUpperCase();
        this.nome = nome.trim();
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

    public boolean precoMaiorQue(BigDecimal valorReferencia) {
        if (valorReferencia == null) {
            throw new IllegalArgumentException("Valor de referência é obrigatório.");
        }

        return preco.compareTo(valorReferencia) > 0;
    }

    public String resumo() {
        return sku
                + " | " + nome
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

## Stream com Produto

Crie:

```text
src\br\com\curso\aula190\app\StreamProdutoApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import br.com.curso.aula190.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;

public class StreamProdutoApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Monitor", new BigDecimal("1200.00"), false, 10),
                new Produto("prd-004", "Teclado", new BigDecimal("150.00"), true, 0)
        );

        BigDecimal valorMinimo = new BigDecimal("100.00");

        produtos.stream()
                .filter(Produto::disponivel)
                .filter(produto -> produto.precoMaiorQue(valorMinimo))
                .map(Produto::resumo)
                .forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamProdutoApp
```

---

## Observação de domínio

Este trecho:

```java
.filter(Produto::disponivel)
```

usa uma regra nomeada no domínio.

Este trecho:

```java
.filter(produto -> produto.precoMaiorQue(valorMinimo))
```

usa uma regra parametrizada.

Está bom.

Se a regra de preço mínimo fosse algo fixo de negócio, poderia virar método de domínio ou política.

---

# Parte 9 — forEach e efeitos colaterais

## forEach executa ação

`forEach` é terminal e recebe um `Consumer`.

Exemplo:

```java
.forEach(System.out::println)
```

Ele é usado para ações:

```text
imprimir;
registrar;
enviar;
adicionar em coleção externa;
chamar algum processamento.
```

Mas precisa de cuidado.

---

## Exemplo aceitável de forEach

Imprimir resultados:

```java
clientes.stream()
        .map(Cliente::resumo)
        .forEach(System.out::println);
```

Aqui o efeito colateral é claro:

```text
impressão no console.
```

---

## Exemplo perigoso de forEach

```java
clientes.stream()
        .filter(Cliente::podeOperar)
        .forEach(cliente -> repository.salvar(cliente));
```

Pode até funcionar, mas em backend real isso exige cuidado.

Salvar dados dentro de `forEach` pode esconder:

```text
transação;
erro parcial;
ordem de execução;
falha no meio do processamento;
efeito colateral importante.
```

Regra:

```text
use forEach para ações simples e claras;
cuidado com regras críticas e persistência dentro de stream.
```

---

## Stream não deve esconder regra de negócio

Se o pipeline começar a ficar grande:

```java
pedidos.stream()
        .filter(...)
        .map(...)
        .filter(...)
        .map(...)
        .forEach(...)
```

pare e pergunte:

```text
isso ainda está claro?
alguma regra deveria ter nome?
alguma regra deveria estar no domínio?
alguma parte deveria ir para um service?
```

Stream é ferramenta.

Não é arquitetura.

---

# Parte 10 — Pedido com Stream

## Pedido

Crie:

```text
src\br\com\curso\aula190\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula190.dominio.pedido;

import java.math.BigDecimal;

public class Pedido {
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;
    private final boolean pago;
    private final boolean cancelado;

    public Pedido(String codigo, String cliente, BigDecimal valor, boolean pago, boolean cancelado) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        this.codigo = codigo.trim().toUpperCase();
        this.cliente = cliente.trim();
        this.valor = valor;
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

    public boolean pago() {
        return pago;
    }

    public boolean cancelado() {
        return cancelado;
    }

    public boolean podeFaturar() {
        return pago && !cancelado;
    }

    public boolean valorMaiorQue(BigDecimal referencia) {
        if (referencia == null) {
            throw new IllegalArgumentException("Referência é obrigatória.");
        }

        return valor.compareTo(referencia) > 0;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Valor: " + valor
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

## Stream com Pedido

Crie:

```text
src\br\com\curso\aula190\app\StreamPedidoApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import br.com.curso.aula190.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.util.List;

public class StreamPedidoApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), true, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), false, false),
                new Pedido("PED-004", "João", new BigDecimal("3000.00"), true, true)
        );

        BigDecimal limite = new BigDecimal("1000.00");

        pedidos.stream()
                .filter(Pedido::podeFaturar)
                .filter(pedido -> pedido.valorMaiorQue(limite))
                .map(Pedido::resumo)
                .map(resumo -> "FATURAMENTO -> " + resumo)
                .forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamPedidoApp
```

---

## Leitura do pipeline de Pedido

```java
pedidos.stream()
        .filter(Pedido::podeFaturar)
        .filter(pedido -> pedido.valorMaiorQue(limite))
        .map(Pedido::resumo)
        .map(resumo -> "FATURAMENTO -> " + resumo)
        .forEach(System.out::println);
```

Leitura:

```text
pegue pedidos;
mantenha apenas os que podem faturar;
mantenha apenas os acima do limite;
transforme em resumo;
adicione prefixo de faturamento;
imprima.
```

---

# Parte 11 — Streams e null

Streams não removem null automaticamente.

Se a lista tiver null, method reference pode quebrar.

Crie:

```text
src\br\com\curso\aula190\app\StreamComNullApp.java
```

Código:

```java
package br.com.curso.aula190.app;

import java.util.List;
import java.util.Objects;

public class StreamComNullApp {
    public static void main(String[] args) {
        List<String> nomes = java.util.Arrays.asList("Ana", null, "Carlos", "   ", "Maria");

        nomes.stream()
                .filter(Objects::nonNull)
                .filter(nome -> !nome.isBlank())
                .map(String::toUpperCase)
                .forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula190.app.StreamComNullApp
```

---

## Por que usamos Objects::nonNull

Este filtro:

```java
.filter(Objects::nonNull)
```

remove valores nulos.

Depois disso, é seguro chamar:

```java
nome.isBlank()
String::toUpperCase
```

A ordem importa.

Sempre trate null antes de chamar método de instância.

---

# Parte 12 — Quando usar Stream e quando usar for

## Stream é bom quando

Use Stream quando o fluxo é claramente de:

```text
filtrar;
mapear;
transformar;
coletar;
agrupar;
resumir;
contar;
buscar;
validar todos ou algum.
```

Exemplo bom:

```java
clientes.stream()
        .filter(Cliente::podeOperar)
        .map(Cliente::resumo)
        .forEach(System.out::println);
```

---

## for é melhor quando

Use `for` tradicional quando:

```text
há muitas regras de controle;
precisa de break complexo;
precisa de continue explícito;
precisa alterar vários estados;
precisa lidar com erro item a item;
o Stream ficou difícil de ler;
há lógica procedural clara.
```

Exemplo:

```java
for (Pedido pedido : pedidos) {
    if (!pedido.podeFaturar()) {
        continue;
    }

    try {
        faturar(pedido);
    } catch (Exception erro) {
        registrarErro(pedido, erro);
    }
}
```

Esse fluxo talvez fique mais claro com `for`.

---

## Regra profissional

```text
Stream deve melhorar a leitura.
Se piorou, use for.
```

Não use Stream para parecer avançado.

Use porque o pipeline ficou mais claro.

---

# Parte 13 — Erros comuns

## 1. Achar que stream altera a lista original

Este código:

```java
nomes.stream()
        .map(String::toUpperCase);
```

não altera a lista.

Além disso, sem terminal, nem executa.

---

## 2. Esquecer operação terminal

Sem operação terminal, o pipeline não executa.

```java
stream.filter(...).map(...);
```

não processa nada sozinho.

---

## 3. Reutilizar stream

Stream é de uso único.

Crie outro stream se precisar processar novamente.

---

## 4. Usar forEach para tudo

`forEach` é terminal e tem efeito colateral.

Para transformar lista em outra lista, futuramente usaremos:

```java
toList
collect
```

Não use `forEach` adicionando em lista externa sem necessidade.

---

## 5. Lambda gigante dentro de stream

Evite:

```java
.filter(item -> {
    // 20 linhas
})
```

Extraia método ou use regra nomeada.

---

## 6. Esconder regra de domínio no stream

Ruim:

```java
.filter(p -> p.pago() && !p.cancelado())
```

Melhor:

```java
.filter(Pedido::podeFaturar)
```

quando isso for regra de negócio.

---

## 7. Ignorar null

Streams não protegem contra null automaticamente.

Use:

```java
.filter(Objects::nonNull)
```

quando necessário.

---

# Parte 14 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula190.app.PrimeiroStreamApp
java -cp out br.com.curso.aula190.app.PrimeiroStreamMethodReferenceApp
java -cp out br.com.curso.aula190.app.StreamFilterBasicoApp
java -cp out br.com.curso.aula190.app.StreamFilterPredicateNomeadoApp
java -cp out br.com.curso.aula190.app.StreamMapBasicoApp
java -cp out br.com.curso.aula190.app.StreamMapMudandoTipoApp
java -cp out br.com.curso.aula190.app.StreamFilterMapForEachApp
java -cp out br.com.curso.aula190.app.StreamExecucaoPreguicosaApp
java -cp out br.com.curso.aula190.app.StreamExecucaoComTerminalApp
java -cp out br.com.curso.aula190.app.StreamUsoUnicoApp
java -cp out br.com.curso.aula190.app.StreamClienteApp
java -cp out br.com.curso.aula190.app.StreamProdutoApp
java -cp out br.com.curso.aula190.app.StreamPedidoApp
java -cp out br.com.curso.aula190.app.StreamComNullApp
```

Para cada execução, responda:

```text
qual é a fonte do stream?
quais operações são intermediárias?
qual operação é terminal?
qual Predicate foi usado?
qual Function foi usada?
qual Consumer foi usado?
o pipeline melhorou a leitura?
alguma regra deveria estar no domínio?
```

---

# Parte 15 — Desafio prático

Crie uma entidade:

```text
src\br\com\curso\aula190\dominio\ordemservico\OrdemServico.java
```

Campos:

```text
String codigo;
String cliente;
boolean aberta;
boolean urgente;
int diasEmAberto;
```

Regras:

```text
codigo obrigatório;
cliente obrigatório;
diasEmAberto não pode ser negativo;
podeAtender() retorna aberta && diasEmAberto <= 30;
critica() retorna urgente || diasEmAberto > 15;
resumo().
```

Crie app:

```text
src\br\com\curso\aula190\app\StreamOrdemServicoApp.java
```

Fluxo obrigatório:

```text
criar lista de OS;
filtrar OS que podeAtender;
filtrar OS critica;
mapear para resumo;
prefixar com "PRIORIZAR -> ";
imprimir.
```

Critério principal:

```text
usar stream;
usar filter;
usar map;
usar forEach;
manter regra importante dentro da entidade.
```

---

## Desafio extra

Crie app:

```text
src\br\com\curso\aula190\app\StreamDiagnosticoExecucaoApp.java
```

Objetivo:

```text
mostrar a ordem real de execução do stream.
```

Use uma lista de nomes.

Pipeline:

```text
filter com println "filter 1";
map com println "map 1";
filter com println "filter 2";
map com println "map 2";
forEach com println "final".
```

Critério principal:

```text
entender que o stream processa item a item ao chegar na operação terminal.
```

---

# Parte 16 — Debug recomendado

Coloque breakpoints em:

```text
StreamFilterMapForEachApp
StreamExecucaoPreguicosaApp
StreamExecucaoComTerminalApp
StreamClienteApp
StreamProdutoApp
StreamPedidoApp
StreamComNullApp
```

Pontos de atenção:

```java
.stream()
.filter(...)
.map(...)
.forEach(...)
```

Observe:

```text
quando o pipeline é criado;
quando filter executa;
quando map executa;
quando forEach executa;
como filter remove item;
como map muda o tipo;
como method reference é chamado;
como operação terminal dispara tudo.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é Stream?
2. Qual a diferença entre List e Stream?
3. Para que serve filter?
4. Para que serve map?
5. Por que forEach é operação terminal?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar stream a partir de lista;
usar forEach;
usar filter;
usar map;
combinar filter + map + forEach;
identificar operação intermediária;
identificar operação terminal;
explicar execução preguiçosa;
explicar uso único de Stream;
usar stream com objetos de domínio;
usar method reference em stream;
tratar null com Objects::nonNull;
saber quando stream melhora leitura;
saber quando for tradicional é melhor;
resolver StreamOrdemServicoApp;
resolver StreamDiagnosticoExecucaoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-190-streams-api-introducao-filter-map-foreach
git commit -m "Aula 190: streams api introducao filter map foreach"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Stream é um pipeline de processamento de dados.
```

Você viu:

```text
stream();
filter;
map;
forEach;
operações intermediárias;
operação terminal;
execução preguiçosa;
uso único;
method reference;
domínio com Cliente, Produto e Pedido.
```

Também reforçou uma regra importante:

```text
Stream deve melhorar a leitura, não esconder a regra.
```

Na próxima aula, vamos continuar com Streams e estudar como transformar o resultado do pipeline em novas listas:

```text
toList;
collect;
Collectors;
listas imutáveis;
diferença entre imprimir e retornar dados;
boas práticas para services.
```

Isso será fundamental para backend, porque na maioria das vezes você não quer apenas imprimir: você quer retornar uma lista transformada para outra camada.
