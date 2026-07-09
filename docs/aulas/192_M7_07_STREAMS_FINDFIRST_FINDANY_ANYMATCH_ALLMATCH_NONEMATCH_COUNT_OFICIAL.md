# 192 — M7.07 — Streams: findFirst, findAny, anyMatch, allMatch, noneMatch e count

## Objetivo da aula

Na aula anterior, você estudou como transformar pipelines de Stream em coleções usando:

```text
toList;
collect;
Collectors.toList;
Collectors.toSet;
Collectors.toMap;
Function.identity;
mappers;
responses;
services retornando dados.
```

Agora vamos estudar operações terminais muito usadas para decisão, busca e validação:

```text
findFirst;
findAny;
anyMatch;
allMatch;
noneMatch;
count.
```

Essas operações aparecem muito em backend quando você precisa responder perguntas como:

```text
existe algum cliente ativo?
todos os produtos estão disponíveis?
nenhum pedido está cancelado?
qual é o primeiro item elegível?
quantos registros atendem a uma regra?
existe duplicidade?
existe algum item inválido?
```

Ao final desta aula, você deve conseguir:

```text
usar findFirst;
usar findAny;
entender retorno Optional<T>;
usar anyMatch;
usar allMatch;
usar noneMatch;
usar count;
entender diferença entre buscar elemento e validar condição;
aplicar operações de decisão em services;
evitar uso incorreto de count para existência;
entender curto-circuito em operações de match;
aplicar em domínio de Cliente, Produto, Pedido e Ordem de Serviço.
```

---

## Ideia principal

Na Streams API existem operações terminais que não retornam uma lista.

Elas retornam:

```text
Optional<T>;
boolean;
long.
```

Exemplos:

```java
Optional<Cliente> primeiroAtivo = clientes.stream()
        .filter(Cliente::ativo)
        .findFirst();
```

```java
boolean existeAtivo = clientes.stream()
        .anyMatch(Cliente::ativo);
```

```java
boolean todosAtivos = clientes.stream()
        .allMatch(Cliente::ativo);
```

```java
long quantidadeAtivos = clientes.stream()
        .filter(Cliente::ativo)
        .count();
```

Essas operações são essenciais para regras de negócio e consultas em memória.

---

## Operações desta aula

Vamos estudar:

```text
findFirst:
retorna o primeiro item encontrado no Stream.

findAny:
retorna algum item encontrado no Stream.

anyMatch:
verifica se pelo menos um item atende à regra.

allMatch:
verifica se todos os itens atendem à regra.

noneMatch:
verifica se nenhum item atende à regra.

count:
conta quantos itens existem no Stream.
```

Tabela rápida:

```text
findFirst -> Optional<T>
findAny   -> Optional<T>
anyMatch  -> boolean
allMatch  -> boolean
noneMatch -> boolean
count     -> long
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-192-streams-findfirst-findany-anymatch-allmatch-nonematch-count
cd labs\m7\aula-192-streams-findfirst-findany-anymatch-allmatch-nonematch-count
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula192
mkdir src\br\com\curso\aula192\app
mkdir src\br\com\curso\aula192\dominio
mkdir src\br\com\curso\aula192\dominio\valor
mkdir src\br\com\curso\aula192\dominio\cliente
mkdir src\br\com\curso\aula192\dominio\produto
mkdir src\br\com\curso\aula192\dominio\pedido
mkdir src\br\com\curso\aula192\dominio\ordemservico
mkdir src\br\com\curso\aula192\dto
mkdir src\br\com\curso\aula192\service
```

---

# Parte 1 — findFirst

## O que é findFirst

`findFirst` retorna o primeiro elemento do Stream.

Se não encontrar nada, retorna:

```java
Optional.empty()
```

Assinatura conceitual:

```java
Optional<T> findFirst()
```

Exemplo:

```java
Optional<String> primeiroNomeGrande = nomes.stream()
        .filter(nome -> nome.length() >= 5)
        .findFirst();
```

---

## App básico com findFirst

Crie:

```text
src\br\com\curso\aula192\app\StreamFindFirstBasicoApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import java.util.List;
import java.util.Optional;

public class StreamFindFirstBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        Optional<String> primeiroNomeGrande = nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .findFirst();

        String resultado = primeiroNomeGrande.orElse("Nenhum nome encontrado.");

        System.out.println(resultado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.StreamFindFirstBasicoApp
```

---

## Como ler findFirst

```java
nomes.stream()
        .filter(nome -> nome.length() >= 5)
        .findFirst();
```

Leitura:

```text
pegue os nomes;
mantenha apenas os nomes com 5 ou mais caracteres;
retorne o primeiro encontrado;
se não existir, retorne Optional.empty().
```

`findFirst` combina naturalmente com `Optional`.

---

## findFirst sem filter

Crie:

```text
src\br\com\curso\aula192\app\StreamFindFirstSemFiltroApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import java.util.List;
import java.util.Optional;

public class StreamFindFirstSemFiltroApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        Optional<String> primeiro = nomes.stream()
                .findFirst();

        System.out.println(primeiro.orElse("Lista vazia."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.StreamFindFirstSemFiltroApp
```

---

## findFirst em lista vazia

Crie:

```text
src\br\com\curso\aula192\app\StreamFindFirstListaVaziaApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import java.util.List;
import java.util.Optional;

public class StreamFindFirstListaVaziaApp {
    public static void main(String[] args) {
        List<String> nomes = List.of();

        Optional<String> primeiro = nomes.stream()
                .findFirst();

        System.out.println(primeiro.orElse("Lista vazia."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.StreamFindFirstListaVaziaApp
```

---

## Ponto importante

Como `findFirst` retorna `Optional<T>`, não use:

```java
findFirst().get()
```

sem critério.

Prefira:

```java
orElse;
orElseGet;
orElseThrow;
map;
ifPresent;
ifPresentOrElse.
```

---

# Parte 2 — findAny

## O que é findAny

`findAny` retorna algum elemento do Stream.

Assinatura conceitual:

```java
Optional<T> findAny()
```

Em streams sequenciais, muitas vezes ele parece se comportar como `findFirst`.

Mas a intenção é diferente.

```text
findFirst:
quero o primeiro.

findAny:
qualquer um serve.
```

Em streams paralelos, `findAny` pode ser mais flexível.

---

## App básico com findAny

Crie:

```text
src\br\com\curso\aula192\app\StreamFindAnyBasicoApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import java.util.List;
import java.util.Optional;

public class StreamFindAnyBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        Optional<String> algumNomeGrande = nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .findAny();

        System.out.println(algumNomeGrande.orElse("Nenhum nome encontrado."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.StreamFindAnyBasicoApp
```

---

## Quando usar findFirst ou findAny

Use `findFirst` quando a ordem importa.

Exemplo:

```text
primeiro pedido pendente;
primeira OS crítica;
primeiro produto disponível;
primeiro cliente da lista.
```

Use `findAny` quando qualquer item serve.

Exemplo:

```text
existe algum exemplo para mostrar;
buscar qualquer item válido;
processamento paralelo futuro.
```

Na maior parte dos sistemas de negócio, quando a ordem importa, prefira `findFirst`.

---

# Parte 3 — anyMatch

## O que é anyMatch

`anyMatch` verifica se pelo menos um item atende a uma condição.

Assinatura conceitual:

```java
boolean anyMatch(Predicate<? super T> predicate)
```

Exemplo:

```java
boolean existeNomeGrande = nomes.stream()
        .anyMatch(nome -> nome.length() >= 5);
```

Retorna:

```text
true se pelo menos um item passou;
false se nenhum item passou.
```

---

## App básico com anyMatch

Crie:

```text
src\br\com\curso\aula192\app\StreamAnyMatchBasicoApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import java.util.List;

public class StreamAnyMatchBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        boolean existeNomeGrande = nomes.stream()
                .anyMatch(nome -> nome.length() >= 5);

        boolean existeNomeComZ = nomes.stream()
                .anyMatch(nome -> nome.startsWith("Z"));

        System.out.println("Existe nome grande? " + existeNomeGrande);
        System.out.println("Existe nome com Z? " + existeNomeComZ);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.StreamAnyMatchBasicoApp
```

---

## anyMatch vs filter + count

Evite usar `count` apenas para saber se existe.

Menos ideal:

```java
boolean existe = nomes.stream()
        .filter(nome -> nome.length() >= 5)
        .count() > 0;
```

Melhor:

```java
boolean existe = nomes.stream()
        .anyMatch(nome -> nome.length() >= 5);
```

Por quê?

```text
anyMatch comunica intenção melhor;
anyMatch pode parar quando encontrar o primeiro item válido;
count precisa contar todos os itens.
```

---

## Curto-circuito em anyMatch

`anyMatch` pode parar assim que encontra um item verdadeiro.

Crie:

```text
src\br\com\curso\aula192\app\StreamAnyMatchCurtoCircuitoApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import java.util.List;

public class StreamAnyMatchCurtoCircuitoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        boolean existeNomeGrande = nomes.stream()
                .anyMatch(nome -> {
                    System.out.println("Testando: " + nome);
                    return nome.length() >= 5;
                });

        System.out.println("Resultado: " + existeNomeGrande);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.StreamAnyMatchCurtoCircuitoApp
```

---

## O que observar

A execução pode parar quando encontrar `Carlos`.

Isso mostra o curto-circuito.

Operações como `anyMatch`, `allMatch`, `noneMatch`, `findFirst` e `findAny` podem encerrar antes de percorrer tudo.

---

# Parte 4 — allMatch

## O que é allMatch

`allMatch` verifica se todos os itens atendem a uma condição.

Assinatura conceitual:

```java
boolean allMatch(Predicate<? super T> predicate)
```

Exemplo:

```java
boolean todosValidos = nomes.stream()
        .allMatch(nome -> nome != null && !nome.isBlank());
```

Retorna:

```text
true se todos passarem;
false se pelo menos um falhar.
```

---

## App básico com allMatch

Crie:

```text
src\br\com\curso\aula192\app\StreamAllMatchBasicoApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import java.util.List;

public class StreamAllMatchBasicoApp {
    public static void main(String[] args) {
        List<String> nomesValidos = List.of("Ana", "Carlos", "Maria");
        List<String> nomesInvalidos = java.util.Arrays.asList("Ana", "   ", "Maria");

        boolean todosValidos = nomesValidos.stream()
                .allMatch(nome -> nome != null && !nome.isBlank());

        boolean todosInvalidosValidos = nomesInvalidos.stream()
                .allMatch(nome -> nome != null && !nome.isBlank());

        System.out.println("Todos da primeira lista são válidos? " + todosValidos);
        System.out.println("Todos da segunda lista são válidos? " + todosInvalidosValidos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.StreamAllMatchBasicoApp
```

---

## allMatch em lista vazia

Ponto importante:

```java
List<String> vazia = List.of();

boolean resultado = vazia.stream()
        .allMatch(nome -> nome.length() >= 3);
```

O resultado é:

```text
true
```

Por quê?

Porque não existe nenhum item que viole a regra.

Isso pode parecer estranho no início.

Em regra de negócio, talvez você precise validar lista vazia antes.

Crie:

```text
src\br\com\curso\aula192\app\StreamAllMatchListaVaziaApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import java.util.List;

public class StreamAllMatchListaVaziaApp {
    public static void main(String[] args) {
        List<String> nomes = List.of();

        boolean todosValidos = nomes.stream()
                .allMatch(nome -> nome.length() >= 3);

        System.out.println("Todos válidos em lista vazia? " + todosValidos);
        System.out.println("Lista possui itens? " + !nomes.isEmpty());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.StreamAllMatchListaVaziaApp
```

---

## Regra profissional

Se a regra exige que exista pelo menos um item, combine:

```java
!itens.isEmpty() && itens.stream().allMatch(...)
```

Exemplo:

```java
boolean todosValidos = !nomes.isEmpty()
        && nomes.stream().allMatch(nome -> nome.length() >= 3);
```

---

# Parte 5 — noneMatch

## O que é noneMatch

`noneMatch` verifica se nenhum item atende a uma condição.

Assinatura conceitual:

```java
boolean noneMatch(Predicate<? super T> predicate)
```

Exemplo:

```java
boolean nenhumVazio = nomes.stream()
        .noneMatch(String::isBlank);
```

Retorna:

```text
true se nenhum item passar na condição;
false se algum item passar.
```

---

## App básico com noneMatch

Crie:

```text
src\br\com\curso\aula192\app\StreamNoneMatchBasicoApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import java.util.List;

public class StreamNoneMatchBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");
        List<String> nomesComBranco = List.of("Ana", "   ", "Maria");

        boolean nenhumBranco = nomes.stream()
                .noneMatch(String::isBlank);

        boolean nenhumBrancoNaOutraLista = nomesComBranco.stream()
                .noneMatch(String::isBlank);

        System.out.println("Nenhum branco na primeira lista? " + nenhumBranco);
        System.out.println("Nenhum branco na segunda lista? " + nenhumBrancoNaOutraLista);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.StreamNoneMatchBasicoApp
```

---

## noneMatch vs allMatch com negate

Estas duas ideias podem ser parecidas:

```java
nomes.stream().noneMatch(String::isBlank)
```

e:

```java
nomes.stream().allMatch(nome -> !nome.isBlank())
```

As duas podem chegar ao mesmo resultado.

Mas a leitura muda.

Use a forma que comunica melhor a regra.

```text
nenhum item inválido:
noneMatch

todos os itens válidos:
allMatch
```

---

# Parte 6 — count

## O que é count

`count` conta quantos elementos existem no Stream.

Assinatura:

```java
long count()
```

Exemplo:

```java
long quantidadeAtivos = clientes.stream()
        .filter(Cliente::ativo)
        .count();
```

---

## App básico com count

Crie:

```text
src\br\com\curso\aula192\app\StreamCountBasicoApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import java.util.List;

public class StreamCountBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Alexandre");

        long quantidadeTotal = nomes.stream()
                .count();

        long quantidadeGrandes = nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .count();

        System.out.println("Total: " + quantidadeTotal);
        System.out.println("Nomes grandes: " + quantidadeGrandes);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.StreamCountBasicoApp
```

---

## count retorna long

O retorno de `count` é:

```java
long
```

Não é `int`.

Em listas pequenas não parece importante.

Mas Streams podem processar grandes volumes.

---

## Quando usar count

Use `count` quando você precisa da quantidade.

Exemplos:

```text
quantidade de clientes ativos;
quantidade de pedidos pendentes;
quantidade de produtos disponíveis;
quantidade de OS críticas;
quantidade de registros inválidos.
```

Não use `count` apenas para saber se existe algum item.

Para existência, use:

```java
anyMatch
```

---

# Parte 7 — Domínio Cliente

Agora vamos aplicar em domínio de backend.

## Email

Crie:

```text
src\br\com\curso\aula192\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula192.dominio.valor;

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
src\br\com\curso\aula192\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula192.dominio.cliente;

import br.com.curso.aula192.dominio.valor.Email;

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

## ClienteConsultaService

Crie:

```text
src\br\com\curso\aula192\service\ClienteConsultaService.java
```

Código:

```java
package br.com.curso.aula192.service;

import br.com.curso.aula192.dominio.cliente.Cliente;
import br.com.curso.aula192.dominio.valor.Email;

import java.util.List;
import java.util.Optional;

public class ClienteConsultaService {
    private final List<Cliente> clientes;

    public ClienteConsultaService(List<Cliente> clientes) {
        if (clientes == null) {
            throw new IllegalArgumentException("Clientes são obrigatórios.");
        }

        this.clientes = List.copyOf(clientes);
    }

    public Optional<Cliente> buscarPrimeiroApto() {
        return clientes.stream()
                .filter(Cliente::podeOperar)
                .findFirst();
    }

    public Optional<Cliente> buscarPorEmail(Email email) {
        if (email == null) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        return clientes.stream()
                .filter(cliente -> cliente.email().equals(email))
                .findFirst();
    }

    public boolean existeClienteApto() {
        return clientes.stream()
                .anyMatch(Cliente::podeOperar);
    }

    public boolean todosPodemOperar() {
        return !clientes.isEmpty()
                && clientes.stream().allMatch(Cliente::podeOperar);
    }

    public boolean nenhumBloqueado() {
        return clientes.stream()
                .noneMatch(Cliente::bloqueado);
    }

    public long contarClientesAptos() {
        return clientes.stream()
                .filter(Cliente::podeOperar)
                .count();
    }
}
```

---

## App ClienteConsultaService

Crie:

```text
src\br\com\curso\aula192\app\ClienteConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import br.com.curso.aula192.dominio.cliente.Cliente;
import br.com.curso.aula192.dominio.valor.Email;
import br.com.curso.aula192.service.ClienteConsultaService;

import java.util.List;

public class ClienteConsultaServiceApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true, false),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", true, true),
                new Cliente(new Email("maria@gmail.com"), "Maria Oliveira", true, false),
                new Cliente(new Email("joao@empresa.com"), "João Lima", false, false)
        );

        ClienteConsultaService service = new ClienteConsultaService(clientes);

        System.out.println("Primeiro apto:");
        System.out.println(service.buscarPrimeiroApto().map(Cliente::resumo).orElse("Nenhum cliente apto."));

        System.out.println();

        System.out.println("Buscar por e-mail:");
        System.out.println(service.buscarPorEmail(new Email("maria@gmail.com"))
                .map(Cliente::resumo)
                .orElse("Cliente não encontrado."));

        System.out.println();

        System.out.println("Existe cliente apto? " + service.existeClienteApto());
        System.out.println("Todos podem operar? " + service.todosPodemOperar());
        System.out.println("Nenhum bloqueado? " + service.nenhumBloqueado());
        System.out.println("Quantidade de aptos: " + service.contarClientesAptos());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.ClienteConsultaServiceApp
```

---

## Ponto arquitetural

Repare nos retornos:

```java
Optional<Cliente>
boolean
long
```

Cada método comunica uma intenção diferente:

```text
buscarPrimeiroApto:
talvez exista um cliente.

existeClienteApto:
pergunta de sim ou não.

contarClientesAptos:
pergunta de quantidade.
```

Não use sempre o mesmo tipo de retorno.

Escolha o tipo conforme a pergunta do método.

---

# Parte 8 — Produto

## Produto

Crie:

```text
src\br\com\curso\aula192\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula192.dominio.produto;

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

## ProdutoConsultaService

Crie:

```text
src\br\com\curso\aula192\service\ProdutoConsultaService.java
```

Código:

```java
package br.com.curso.aula192.service;

import br.com.curso.aula192.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public class ProdutoConsultaService {
    private final List<Produto> produtos;

    public ProdutoConsultaService(List<Produto> produtos) {
        if (produtos == null) {
            throw new IllegalArgumentException("Produtos são obrigatórios.");
        }

        this.produtos = List.copyOf(produtos);
    }

    public Optional<Produto> buscarPrimeiroDisponivel() {
        return produtos.stream()
                .filter(Produto::disponivel)
                .findFirst();
    }

    public Optional<Produto> buscarPorSku(String sku) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        String normalizado = sku.trim().toUpperCase();

        return produtos.stream()
                .filter(produto -> produto.sku().equals(normalizado))
                .findFirst();
    }

    public boolean existeProdutoDisponivel() {
        return produtos.stream()
                .anyMatch(Produto::disponivel);
    }

    public boolean todosAtivos() {
        return !produtos.isEmpty()
                && produtos.stream().allMatch(Produto::ativo);
    }

    public boolean nenhumSemEstoque() {
        return produtos.stream()
                .noneMatch(produto -> produto.estoque() == 0);
    }

    public long contarDisponiveisAcimaDe(BigDecimal valorReferencia) {
        if (valorReferencia == null) {
            throw new IllegalArgumentException("Valor de referência é obrigatório.");
        }

        return produtos.stream()
                .filter(Produto::disponivel)
                .filter(produto -> produto.precoMaiorQue(valorReferencia))
                .count();
    }
}
```

---

## App ProdutoConsultaService

Crie:

```text
src\br\com\curso\aula192\app\ProdutoConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import br.com.curso.aula192.dominio.produto.Produto;
import br.com.curso.aula192.service.ProdutoConsultaService;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoConsultaServiceApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Monitor", new BigDecimal("1200.00"), false, 10),
                new Produto("prd-004", "Teclado", new BigDecimal("150.00"), true, 0)
        );

        ProdutoConsultaService service = new ProdutoConsultaService(produtos);

        System.out.println("Primeiro disponível:");
        System.out.println(service.buscarPrimeiroDisponivel().map(Produto::resumo).orElse("Nenhum disponível."));

        System.out.println();

        System.out.println("Buscar SKU PRD-003:");
        System.out.println(service.buscarPorSku("prd-003").map(Produto::resumo).orElse("Produto não encontrado."));

        System.out.println();

        System.out.println("Existe disponível? " + service.existeProdutoDisponivel());
        System.out.println("Todos ativos? " + service.todosAtivos());
        System.out.println("Nenhum sem estoque? " + service.nenhumSemEstoque());
        System.out.println("Disponíveis acima de 100: " + service.contarDisponiveisAcimaDe(new BigDecimal("100.00")));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.ProdutoConsultaServiceApp
```

---

# Parte 9 — Pedido e validações de lote

## Pedido

Crie:

```text
src\br\com\curso\aula192\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula192.dominio.pedido;

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

## PedidoLoteService

Crie:

```text
src\br\com\curso\aula192\service\PedidoLoteService.java
```

Código:

```java
package br.com.curso.aula192.service;

import br.com.curso.aula192.dominio.pedido.Pedido;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public class PedidoLoteService {
    private final List<Pedido> pedidos;

    public PedidoLoteService(List<Pedido> pedidos) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Pedidos são obrigatórios.");
        }

        this.pedidos = List.copyOf(pedidos);
    }

    public boolean existePedidoCancelado() {
        return pedidos.stream()
                .anyMatch(Pedido::cancelado);
    }

    public boolean todosPodemFaturar() {
        return !pedidos.isEmpty()
                && pedidos.stream().allMatch(Pedido::podeFaturar);
    }

    public boolean nenhumValorAbaixoOuIgualAZero() {
        return pedidos.stream()
                .noneMatch(pedido -> pedido.valor().compareTo(BigDecimal.ZERO) <= 0);
    }

    public Optional<Pedido> buscarPrimeiroParaFaturar() {
        return pedidos.stream()
                .filter(Pedido::podeFaturar)
                .findFirst();
    }

    public long contarParaFaturar() {
        return pedidos.stream()
                .filter(Pedido::podeFaturar)
                .count();
    }

    public boolean codigoDuplicado(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        long quantidade = pedidos.stream()
                .filter(pedido -> pedido.codigo().equals(normalizado))
                .count();

        return quantidade > 1;
    }
}
```

---

## App PedidoLoteService

Crie:

```text
src\br\com\curso\aula192\app\PedidoLoteServiceApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import br.com.curso.aula192.dominio.pedido.Pedido;
import br.com.curso.aula192.service.PedidoLoteService;

import java.math.BigDecimal;
import java.util.List;

public class PedidoLoteServiceApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), true, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), false, false),
                new Pedido("PED-004", "João", new BigDecimal("3000.00"), true, true)
        );

        PedidoLoteService service = new PedidoLoteService(pedidos);

        System.out.println("Existe cancelado? " + service.existePedidoCancelado());
        System.out.println("Todos podem faturar? " + service.todosPodemFaturar());
        System.out.println("Nenhum valor inválido? " + service.nenhumValorAbaixoOuIgualAZero());
        System.out.println("Primeiro para faturar: " + service.buscarPrimeiroParaFaturar().map(Pedido::resumo).orElse("Nenhum"));
        System.out.println("Quantidade para faturar: " + service.contarParaFaturar());
        System.out.println("PED-001 duplicado? " + service.codigoDuplicado("PED-001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.PedidoLoteServiceApp
```

---

## Observação sobre duplicidade

Neste método:

```java
public boolean codigoDuplicado(String codigo)
```

usamos `count`.

Aqui `count` faz sentido, porque queremos saber se existe mais de um item com a mesma chave.

Para apenas saber se existe um código, usaríamos:

```java
anyMatch
```

Para saber se duplicou, precisamos contar ou usar outra estratégia.

---

# Parte 10 — Ordem de Serviço

## OrdemServico

Crie:

```text
src\br\com\curso\aula192\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula192.dominio.ordemservico;

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

## OrdemServicoConsultaService

Crie:

```text
src\br\com\curso\aula192\service\OrdemServicoConsultaService.java
```

Código:

```java
package br.com.curso.aula192.service;

import br.com.curso.aula192.dominio.ordemservico.OrdemServico;

import java.util.List;
import java.util.Optional;

public class OrdemServicoConsultaService {
    private final List<OrdemServico> ordens;

    public OrdemServicoConsultaService(List<OrdemServico> ordens) {
        if (ordens == null) {
            throw new IllegalArgumentException("Ordens são obrigatórias.");
        }

        this.ordens = List.copyOf(ordens);
    }

    public Optional<OrdemServico> buscarPrimeiraCriticaAtendivel() {
        return ordens.stream()
                .filter(OrdemServico::podeAtender)
                .filter(OrdemServico::critica)
                .findFirst();
    }

    public boolean existeCriticaAtendivel() {
        return ordens.stream()
                .filter(OrdemServico::podeAtender)
                .anyMatch(OrdemServico::critica);
    }

    public boolean todasAbertasPodemAtender() {
        List<OrdemServico> abertas = ordens.stream()
                .filter(OrdemServico::aberta)
                .toList();

        return !abertas.isEmpty()
                && abertas.stream().allMatch(OrdemServico::podeAtender);
    }

    public boolean nenhumaCriticaFechada() {
        return ordens.stream()
                .noneMatch(os -> os.critica() && !os.aberta());
    }

    public long contarCriticasAtendiveis() {
        return ordens.stream()
                .filter(OrdemServico::podeAtender)
                .filter(OrdemServico::critica)
                .count();
    }
}
```

---

## App OrdemServicoConsultaService

Crie:

```text
src\br\com\curso\aula192\app\OrdemServicoConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula192.app;

import br.com.curso.aula192.dominio.ordemservico.OrdemServico;
import br.com.curso.aula192.service.OrdemServicoConsultaService;

import java.util.List;

public class OrdemServicoConsultaServiceApp {
    public static void main(String[] args) {
        List<OrdemServico> ordens = List.of(
                new OrdemServico("OS-001", "Ana", "ABERTA", false, 5),
                new OrdemServico("OS-002", "Carlos", "ABERTA", true, 2),
                new OrdemServico("OS-003", "Maria", "ABERTA", false, 40),
                new OrdemServico("OS-004", "João", "CONCLUIDA", true, 20)
        );

        OrdemServicoConsultaService service = new OrdemServicoConsultaService(ordens);

        System.out.println("Primeira crítica atendível:");
        System.out.println(service.buscarPrimeiraCriticaAtendivel()
                .map(OrdemServico::resumo)
                .orElse("Nenhuma OS crítica atendível."));

        System.out.println();

        System.out.println("Existe crítica atendível? " + service.existeCriticaAtendivel());
        System.out.println("Todas abertas podem atender? " + service.todasAbertasPodemAtender());
        System.out.println("Nenhuma crítica fechada? " + service.nenhumaCriticaFechada());
        System.out.println("Quantidade críticas atendíveis: " + service.contarCriticasAtendiveis());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula192.app.OrdemServicoConsultaServiceApp
```

---

# Parte 11 — Escolhendo a operação certa

## Quando usar findFirst

Use quando você quer recuperar um item:

```text
primeiro cliente apto;
primeiro produto disponível;
primeiro pedido pendente;
primeira OS crítica.
```

Retorno:

```java
Optional<T>
```

---

## Quando usar findAny

Use quando qualquer item serve:

```text
qualquer item de exemplo;
qualquer registro válido;
qualquer candidato.
```

Retorno:

```java
Optional<T>
```

Na maioria das consultas de negócio com ordem definida, `findFirst` comunica melhor.

---

## Quando usar anyMatch

Use quando a pergunta é:

```text
existe algum?
```

Exemplos:

```text
existe produto disponível?
existe cliente bloqueado?
existe pedido cancelado?
existe OS crítica?
```

Retorno:

```java
boolean
```

---

## Quando usar allMatch

Use quando a pergunta é:

```text
todos atendem?
```

Exemplos:

```text
todos os pedidos podem faturar?
todos os produtos estão ativos?
todos os clientes são válidos?
todas as OS abertas podem atender?
```

Retorno:

```java
boolean
```

Lembre-se da lista vazia.

---

## Quando usar noneMatch

Use quando a pergunta é:

```text
nenhum atende a esta condição?
```

Exemplos:

```text
nenhum cliente está bloqueado?
nenhum pedido está cancelado?
nenhum produto está sem estoque?
nenhuma OS crítica está fechada?
```

Retorno:

```java
boolean
```

---

## Quando usar count

Use quando a pergunta é:

```text
quantos?
```

Exemplos:

```text
quantos clientes aptos?
quantos produtos disponíveis?
quantos pedidos para faturar?
quantas OS críticas?
quantos registros duplicados?
```

Retorno:

```java
long
```

---

# Parte 12 — Erros comuns

## 1. Usar count para existência

Evite:

```java
stream.filter(regra).count() > 0
```

Prefira:

```java
stream.anyMatch(regra)
```

---

## 2. Usar findFirst quando queria boolean

Evite:

```java
boolean existe = stream.filter(regra).findFirst().isPresent();
```

Prefira:

```java
boolean existe = stream.anyMatch(regra);
```

---

## 3. Usar get em Optional de findFirst

Evite:

```java
stream.findFirst().get()
```

Prefira:

```java
orElse;
orElseGet;
orElseThrow;
map.
```

---

## 4. Ignorar lista vazia em allMatch

`allMatch` em lista vazia retorna `true`.

Se isso não serve para sua regra, valide:

```java
!lista.isEmpty() && lista.stream().allMatch(...)
```

---

## 5. Confundir noneMatch com allMatch

```text
noneMatch:
nenhum atende a uma condição ruim.

allMatch:
todos atendem a uma condição boa.
```

Escolha a leitura mais clara.

---

## 6. Usar findAny quando a ordem importa

Se a regra depende do primeiro item, use:

```java
findFirst
```

---

## 7. Pipeline grande demais para uma pergunta simples

Às vezes um método nomeado ajuda mais.

Exemplo:

```java
pedido.podeFaturar()
```

melhor do que repetir condições dentro do Stream.

---

# Parte 13 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula192.app.StreamFindFirstBasicoApp
java -cp out br.com.curso.aula192.app.StreamFindFirstSemFiltroApp
java -cp out br.com.curso.aula192.app.StreamFindFirstListaVaziaApp
java -cp out br.com.curso.aula192.app.StreamFindAnyBasicoApp
java -cp out br.com.curso.aula192.app.StreamAnyMatchBasicoApp
java -cp out br.com.curso.aula192.app.StreamAnyMatchCurtoCircuitoApp
java -cp out br.com.curso.aula192.app.StreamAllMatchBasicoApp
java -cp out br.com.curso.aula192.app.StreamAllMatchListaVaziaApp
java -cp out br.com.curso.aula192.app.StreamNoneMatchBasicoApp
java -cp out br.com.curso.aula192.app.StreamCountBasicoApp
java -cp out br.com.curso.aula192.app.ClienteConsultaServiceApp
java -cp out br.com.curso.aula192.app.ProdutoConsultaServiceApp
java -cp out br.com.curso.aula192.app.PedidoLoteServiceApp
java -cp out br.com.curso.aula192.app.OrdemServicoConsultaServiceApp
```

Para cada execução, responda:

```text
qual foi a operação terminal?
o retorno foi Optional, boolean ou long?
a operação poderia parar antes de percorrer tudo?
a lista vazia teria algum comportamento especial?
a operação escolhida comunica bem a intenção?
```

---

# Parte 14 — Desafio prático

Crie entidade:

```text
src\br\com\curso\aula192\dominio\atividade\Atividade.java
```

Campos:

```text
String codigo;
String descricao;
String status;
boolean obrigatoria;
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
resumo().
```

Crie service:

```text
src\br\com\curso\aula192\service\AtividadeConsultaService.java
```

Métodos:

```java
Optional<Atividade> buscarPrimeiraPendenteObrigatoria()

boolean existeAtividadeExecutavel()

boolean todasObrigatoriasConcluidas()

boolean nenhumaExcedeuTentativas()

long contarPendentes()
```

Crie app:

```text
src\br\com\curso\aula192\app\AtividadeConsultaServiceApp.java
```

Critério principal:

```text
usar findFirst;
usar anyMatch;
usar allMatch;
usar noneMatch;
usar count;
escolher retorno correto para cada pergunta.
```

---

## Desafio extra

Crie método no service:

```java
boolean lotePodeSerFinalizado()
```

Regra:

```text
deve existir pelo menos uma atividade;
todas as atividades obrigatórias devem estar concluídas;
nenhuma atividade deve ter excedido tentativas.
```

Critério principal:

```text
tratar lista vazia;
usar allMatch e noneMatch com intenção clara;
não esconder regra crítica em lambda gigante.
```

---

# Parte 15 — Debug recomendado

Coloque breakpoints em:

```text
StreamAnyMatchCurtoCircuitoApp
StreamAllMatchBasicoApp
ClienteConsultaService
ProdutoConsultaService
PedidoLoteService
OrdemServicoConsultaService
```

Pontos de atenção:

```java
.findFirst()
.findAny()
.anyMatch(...)
.allMatch(...)
.noneMatch(...)
.count()
```

Observe:

```text
quando a operação terminal executa;
quando o curto-circuito acontece;
quando Optional vem vazio;
quando boolean fica true ou false;
quando count percorre todos os itens;
como a regra de domínio melhora leitura.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre findFirst e anyMatch?
2. Quando usar count?
3. O que allMatch retorna em lista vazia?
4. Quando usar noneMatch?
5. Por que findFirst retorna Optional?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar findFirst;
usar findAny;
tratar Optional retornado por findFirst/findAny;
usar anyMatch;
usar allMatch;
usar noneMatch;
usar count;
explicar curto-circuito;
evitar count para existência;
validar lista vazia com allMatch;
criar service com métodos de busca;
criar service com métodos booleanos;
criar service com métodos de contagem;
aplicar em Cliente;
aplicar em Produto;
aplicar em Pedido;
aplicar em OrdemServico;
resolver AtividadeConsultaServiceApp;
resolver lotePodeSerFinalizado;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-192-streams-findfirst-findany-anymatch-allmatch-nonematch-count
git commit -m "Aula 192: streams findfirst findany anymatch allmatch nonematch count"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Streams não servem apenas para transformar listas; também servem para responder perguntas.
```

Você estudou:

```text
findFirst;
findAny;
anyMatch;
allMatch;
noneMatch;
count.
```

Também aprendeu a escolher o retorno conforme a pergunta:

```text
quero um item:
Optional<T>

quero saber se existe:
boolean com anyMatch

quero saber se todos atendem:
boolean com allMatch

quero saber se nenhum atende:
boolean com noneMatch

quero quantidade:
long com count
```

Na próxima aula, vamos avançar em operações de ordenação e recorte:

```text
sorted;
Comparator;
distinct;
limit;
skip.
```

Essas operações são muito úteis para montar listas ordenadas, remover duplicados e paginar resultados em memória antes de estudarmos paginação real com banco e Spring Data.
