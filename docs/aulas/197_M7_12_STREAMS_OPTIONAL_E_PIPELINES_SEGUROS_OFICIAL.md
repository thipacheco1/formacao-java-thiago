# 197 — M7.12 — Streams, Optional e pipelines seguros

## Objetivo da aula

Na aula anterior, você estudou:

```text
flatMap;
coleções aninhadas;
Pedido -> Itens;
Cliente -> Contratos;
Ordem de Serviço -> Atividades;
agregações depois do flatMap;
DTOs consolidados.
```

Agora vamos conectar dois assuntos fundamentais que já apareceram no curso:

```text
Optional
```

e:

```text
Streams
```

Essa combinação aparece muito em backend moderno, principalmente em services de consulta.

Exemplos reais:

```text
buscar primeiro item elegível;
buscar entidade por identificador;
transformar Optional<Entidade> em Optional<Response>;
buscar dentro de uma lista;
validar ausência;
evitar NullPointerException;
evitar Optional.get();
processar uma lista de Optional;
achatar Optional dentro de Stream;
retornar resposta segura para controller;
lançar exceção quando ausência for erro de regra.
```

Ao final desta aula, você deve conseguir:

```text
entender por que findFirst retorna Optional;
usar Optional retornado por Stream;
usar map em Optional;
usar flatMap em Optional;
usar filter em Optional;
usar orElse;
usar orElseGet;
usar orElseThrow;
usar ifPresent;
usar ifPresentOrElse;
usar Optional.stream;
achatar Stream<Optional<T>>;
evitar Optional.get;
evitar List<Optional<T>> como retorno público;
criar services de consulta seguros;
decidir quando retornar Optional;
decidir quando lançar exceção;
decidir quando retornar lista vazia;
aplicar em domínio backend.
```

---

## Ideia principal

Streams respondem perguntas sobre coleções.

Optional representa presença ou ausência de um valor.

Quando você faz:

```java
clientes.stream()
        .filter(Cliente::podeOperar)
        .findFirst();
```

o retorno é:

```java
Optional<Cliente>
```

Por quê?

Porque pode existir um cliente apto.

Mas também pode não existir nenhum.

Então o Java obriga você a lidar com a ausência.

Isso evita código inseguro como:

```java
Cliente cliente = null;
```

ou:

```java
cliente.getNome();
```

quando cliente não existe.

---

## Recap rápido: Optional

`Optional<T>` representa:

```text
talvez exista um T;
talvez não exista.
```

Exemplos:

```java
Optional<Cliente>
Optional<Pedido>
Optional<Produto>
Optional<String>
```

Possibilidades:

```text
Optional com valor;
Optional vazio.
```

Você já estudou:

```text
Optional.of;
Optional.ofNullable;
Optional.empty;
map;
flatMap;
filter;
orElse;
orElseGet;
orElseThrow.
```

Agora vamos usar isso junto com Streams.

---

## Recap rápido: Stream

`Stream<T>` representa um fluxo de processamento.

Exemplo:

```java
clientes.stream()
        .filter(Cliente::ativo)
        .map(Cliente::resumo)
        .toList();
```

O Stream trabalha com muitos elementos.

O Optional trabalha com zero ou um elemento.

---

## Stream e Optional em uma frase

```text
Stream representa muitos.
Optional representa talvez um.
```

Quando você busca dentro de um Stream:

```java
.findFirst()
```

você sai de:

```java
Stream<T>
```

para:

```java
Optional<T>
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-197-streams-optional-e-pipelines-seguros
cd labs\m7\aula-197-streams-optional-e-pipelines-seguros
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula197
mkdir src\br\com\curso\aula197\app
mkdir src\br\com\curso\aula197\dominio
mkdir src\br\com\curso\aula197\dominio\cliente
mkdir src\br\com\curso\aula197\dominio\pedido
mkdir src\br\com\curso\aula197\dominio\produto
mkdir src\br\com\curso\aula197\dominio\ordemservico
mkdir src\br\com\curso\aula197\dto
mkdir src\br\com\curso\aula197\service
```

---

# Parte 1 — findFirst retornando Optional

## Primeiro exemplo

Crie:

```text
src\br\com\curso\aula197\app\FindFirstOptionalBasicoApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import java.util.List;
import java.util.Optional;

public class FindFirstOptionalBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        Optional<String> primeiroNomeGrande = nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .findFirst();

        System.out.println(primeiroNomeGrande.orElse("Nenhum nome encontrado."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.FindFirstOptionalBasicoApp
```

---

## O que aconteceu

Este trecho:

```java
.findFirst()
```

retornou:

```java
Optional<String>
```

Porque talvez exista um nome com 5 ou mais letras.

E talvez não exista.

---

## Exemplo sem resultado

Crie:

```text
src\br\com\curso\aula197\app\FindFirstOptionalVazioApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import java.util.List;
import java.util.Optional;

public class FindFirstOptionalVazioApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Bia", "João");

        Optional<String> nomeMuitoGrande = nomes.stream()
                .filter(nome -> nome.length() >= 10)
                .findFirst();

        System.out.println(nomeMuitoGrande.orElse("Nenhum nome com 10 ou mais letras."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.FindFirstOptionalVazioApp
```

---

## Regra profissional

Quando um método pode não encontrar algo, `Optional<T>` é uma boa opção de retorno.

Exemplo:

```java
Optional<Cliente> buscarPorEmail(String email)
```

Isso comunica:

```text
pode existir cliente;
pode não existir cliente.
```

---

# Parte 2 — map em Optional retornado por Stream

## Transformando valor encontrado

Você pode usar `map` depois de `findFirst`.

Crie:

```text
src\br\com\curso\aula197\app\OptionalMapDepoisFindFirstApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import java.util.List;
import java.util.Optional;

public class OptionalMapDepoisFindFirstApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        Optional<String> nomeFormatado = nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .findFirst()
                .map(String::toUpperCase)
                .map(nome -> "NOME ENCONTRADO: " + nome);

        System.out.println(nomeFormatado.orElse("Nenhum nome encontrado."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.OptionalMapDepoisFindFirstApp
```

---

## Como ler

```java
.findFirst()
.map(String::toUpperCase)
.map(nome -> "NOME ENCONTRADO: " + nome)
```

Leitura:

```text
busque o primeiro;
se existir, transforme para maiúsculo;
se existir, adicione prefixo;
se não existir, continue vazio.
```

`map` em Optional só executa se houver valor.

---

## Comparação ruim com isPresent/get

Evite:

```java
Optional<String> optional = nomes.stream()
        .filter(nome -> nome.length() >= 5)
        .findFirst();

if (optional.isPresent()) {
    String valor = optional.get();
    System.out.println(valor.toUpperCase());
}
```

Prefira:

```java
nomes.stream()
        .filter(nome -> nome.length() >= 5)
        .findFirst()
        .map(String::toUpperCase)
        .ifPresent(System.out::println);
```

---

# Parte 3 — filter em Optional

## Refinando valor encontrado

`filter` em Optional mantém o valor apenas se a condição for verdadeira.

Crie:

```text
src\br\com\curso\aula197\app\OptionalFilterDepoisFindFirstApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import java.util.List;
import java.util.Optional;

public class OptionalFilterDepoisFindFirstApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        Optional<String> nomeValido = nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .findFirst()
                .filter(nome -> nome.startsWith("C"));

        System.out.println(nomeValido.orElse("Nome não passou no filtro final."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.OptionalFilterDepoisFindFirstApp
```

---

## Como ler Optional.filter

```java
.findFirst()
.filter(nome -> nome.startsWith("C"))
```

Leitura:

```text
se encontrou um nome;
mantenha apenas se começar com C;
se não começar, vire Optional.empty().
```

---

# Parte 4 — orElse, orElseGet e orElseThrow

## orElse

`orElse` fornece um valor padrão.

```java
String nome = optional.orElse("Não encontrado");
```

O valor padrão é avaliado imediatamente.

---

## orElseGet

`orElseGet` recebe um `Supplier`.

```java
String nome = optional.orElseGet(() -> gerarValorPadrao());
```

O Supplier só executa se o Optional estiver vazio.

---

## orElseThrow

`orElseThrow` lança exceção se o Optional estiver vazio.

```java
Cliente cliente = optional.orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
```

Use quando ausência é erro para aquele fluxo.

---

## App comparando orElse e orElseGet

Crie:

```text
src\br\com\curso\aula197\app\OptionalOrElseVsOrElseGetStreamApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import java.util.List;
import java.util.Optional;

public class OptionalOrElseVsOrElseGetStreamApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        Optional<String> encontrado = nomes.stream()
                .filter(nome -> nome.equals("Ana"))
                .findFirst();

        String comOrElse = encontrado.orElse(valorPadrao());
        String comOrElseGet = encontrado.orElseGet(() -> valorPadrao());

        System.out.println("orElse: " + comOrElse);
        System.out.println("orElseGet: " + comOrElseGet);
    }

    private static String valorPadrao() {
        System.out.println("Gerando valor padrão...");
        return "PADRÃO";
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.OptionalOrElseVsOrElseGetStreamApp
```

---

## O que observar

Mesmo encontrando `"Ana"`, o `orElse(valorPadrao())` chama o método `valorPadrao()`.

Já o `orElseGet(() -> valorPadrao())` não chama se houver valor.

Regra prática:

```text
valor padrão simples:
orElse.

valor padrão caro, calculado ou com chamada externa:
orElseGet.
```

---

## App com orElseThrow

Crie:

```text
src\br\com\curso\aula197\app\OptionalOrElseThrowStreamApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import java.util.List;

public class OptionalOrElseThrowStreamApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        String nome = nomes.stream()
                .filter(valor -> valor.equals("João"))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nome não encontrado."));

        System.out.println(nome);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.OptionalOrElseThrowStreamApp
```

---

## Quando usar orElseThrow

Use quando a ausência é erro no caso de uso.

Exemplo:

```text
editar cliente inexistente;
faturar pedido inexistente;
cancelar OS inexistente;
consultar detalhe obrigatório;
buscar contrato obrigatório para seguir fluxo.
```

Não use exceção quando ausência é uma resposta normal.

---

# Parte 5 — Optional.stream

## O que é Optional.stream

`Optional.stream()` transforma:

```java
Optional<T>
```

em:

```java
Stream<T>
```

Se o Optional tem valor:

```text
Stream com 1 elemento.
```

Se o Optional está vazio:

```text
Stream vazio.
```

Isso é útil para achatar uma lista de Optional.

---

## App básico com Optional.stream

Crie:

```text
src\br\com\curso\aula197\app\OptionalStreamBasicoApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import java.util.Optional;

public class OptionalStreamBasicoApp {
    public static void main(String[] args) {
        Optional<String> comValor = Optional.of("Ana");
        Optional<String> vazio = Optional.empty();

        long quantidadeComValor = comValor.stream()
                .count();

        long quantidadeVazio = vazio.stream()
                .count();

        System.out.println("Com valor: " + quantidadeComValor);
        System.out.println("Vazio: " + quantidadeVazio);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.OptionalStreamBasicoApp
```

---

## Achatar Stream<Optional<T>>

Imagine uma lista de Optional:

```java
List<Optional<String>>
```

Você quer uma lista apenas com os valores presentes.

Use:

```java
.flatMap(Optional::stream)
```

Crie:

```text
src\br\com\curso\aula197\app\StreamOptionalFlatMapApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import java.util.List;
import java.util.Optional;

public class StreamOptionalFlatMapApp {
    public static void main(String[] args) {
        List<Optional<String>> valores = List.of(
                Optional.of("Ana"),
                Optional.empty(),
                Optional.of("Carlos"),
                Optional.empty(),
                Optional.of("Maria")
        );

        List<String> presentes = valores.stream()
                .flatMap(Optional::stream)
                .toList();

        System.out.println(presentes);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.StreamOptionalFlatMapApp
```

---

## Como ler Optional::stream

```java
.flatMap(Optional::stream)
```

Leitura:

```text
para cada Optional;
se tiver valor, transforme em stream com 1 item;
se estiver vazio, transforme em stream vazio;
achate tudo em um único Stream<T>.
```

Resultado:

```text
apenas valores presentes.
```

---

## Cuidado com List<Optional<T>>

Apesar de ser útil entender, em design de API geralmente evite retornar:

```java
List<Optional<Cliente>>
```

Prefira:

```java
List<Cliente>
```

contendo apenas encontrados.

Ou um DTO que represente sucesso/falha por item, se você precisa rastrear cada entrada.

---

# Parte 6 — Domínio Cliente

## Cliente

Crie:

```text
src\br\com\curso\aula197\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula197.dominio.cliente;

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

    public boolean ativo() {
        return ativo;
    }

    public boolean bloqueado() {
        return bloqueado;
    }

    public boolean podeOperar() {
        return ativo && !bloqueado;
    }

    public String dominioEmail() {
        return email.substring(email.indexOf("@") + 1);
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

## ClienteResponse

Crie:

```text
src\br\com\curso\aula197\dto\ClienteResponse.java
```

Código:

```java
package br.com.curso.aula197.dto;

public class ClienteResponse {
    private final String nome;
    private final String email;
    private final String dominio;

    public ClienteResponse(String nome, String email, String dominio) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        if (dominio == null || dominio.isBlank()) {
            throw new IllegalArgumentException("Domínio é obrigatório.");
        }

        this.nome = nome;
        this.email = email;
        this.dominio = dominio;
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

    public String resumo() {
        return nome + " | " + email + " | Domínio: " + dominio;
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
src\br\com\curso\aula197\dto\ClienteMapper.java
```

Código:

```java
package br.com.curso.aula197.dto;

import br.com.curso.aula197.dominio.cliente.Cliente;

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
                cliente.dominioEmail()
        );
    }
}
```

---

## ClienteConsultaService

Crie:

```text
src\br\com\curso\aula197\service\ClienteConsultaService.java
```

Código:

```java
package br.com.curso.aula197.service;

import br.com.curso.aula197.dominio.cliente.Cliente;
import br.com.curso.aula197.dto.ClienteMapper;
import br.com.curso.aula197.dto.ClienteResponse;

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

    public ClienteResponse buscarResponseObrigatorio(String email) {
        return buscarResponsePorEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado: " + email));
    }

    public Optional<ClienteResponse> buscarPrimeiroAptoPorDominio(String dominio) {
        if (dominio == null || dominio.isBlank()) {
            throw new IllegalArgumentException("Domínio é obrigatório.");
        }

        String normalizado = dominio.trim().toLowerCase();

        return clientes.stream()
                .filter(Cliente::podeOperar)
                .filter(cliente -> cliente.dominioEmail().equals(normalizado))
                .findFirst()
                .map(ClienteMapper::toResponse);
    }

    public List<ClienteResponse> buscarVariosPorEmail(List<String> emails) {
        if (emails == null) {
            throw new IllegalArgumentException("E-mails são obrigatórios.");
        }

        return emails.stream()
                .map(this::buscarResponsePorEmail)
                .flatMap(Optional::stream)
                .toList();
    }
}
```

---

## App ClienteConsultaService

Crie:

```text
src\br\com\curso\aula197\app\ClienteConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import br.com.curso.aula197.dominio.cliente.Cliente;
import br.com.curso.aula197.dto.ClienteResponse;
import br.com.curso.aula197.service.ClienteConsultaService;

import java.util.List;

public class ClienteConsultaServiceApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente("Ana Silva", "ana@empresa.com", true, false),
                new Cliente("Carlos Souza", "carlos@empresa.com", true, true),
                new Cliente("Maria Oliveira", "maria@gmail.com", true, false),
                new Cliente("João Lima", "joao@gmail.com", false, false)
        );

        ClienteConsultaService service = new ClienteConsultaService(clientes);

        System.out.println("Buscar Optional Response:");
        System.out.println(service.buscarResponsePorEmail("ana@empresa.com")
                .map(ClienteResponse::resumo)
                .orElse("Cliente não encontrado."));

        System.out.println();

        System.out.println("Buscar primeiro apto por domínio:");
        System.out.println(service.buscarPrimeiroAptoPorDominio("gmail.com")
                .map(ClienteResponse::resumo)
                .orElse("Nenhum apto encontrado."));

        System.out.println();

        System.out.println("Buscar vários por e-mail:");
        List<ClienteResponse> encontrados = service.buscarVariosPorEmail(List.of(
                "ana@empresa.com",
                "naoexiste@empresa.com",
                "maria@gmail.com"
        ));

        encontrados.forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.ClienteConsultaServiceApp
```

---

## Ponto importante

Este método:

```java
public Optional<ClienteResponse> buscarResponsePorEmail(String email)
```

retorna Optional porque buscar por e-mail pode não encontrar cliente.

Este método:

```java
public ClienteResponse buscarResponseObrigatorio(String email)
```

lança exceção porque o próprio nome indica que o cliente é obrigatório.

Nome do método e tipo de retorno precisam conversar.

---

# Parte 7 — Produto com consulta segura

## Produto

Crie:

```text
src\br\com\curso\aula197\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula197.dominio.produto;

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

## ProdutoResponse

Crie:

```text
src\br\com\curso\aula197\dto\ProdutoResponse.java
```

Código:

```java
package br.com.curso.aula197.dto;

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
src\br\com\curso\aula197\dto\ProdutoMapper.java
```

Código:

```java
package br.com.curso.aula197.dto;

import br.com.curso.aula197.dominio.produto.Produto;

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
src\br\com\curso\aula197\service\ProdutoConsultaService.java
```

Código:

```java
package br.com.curso.aula197.service;

import br.com.curso.aula197.dominio.produto.Produto;
import br.com.curso.aula197.dto.ProdutoMapper;
import br.com.curso.aula197.dto.ProdutoResponse;

import java.math.BigDecimal;
import java.util.Comparator;
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

    public Optional<Produto> buscarPorSku(String sku) {
        if (sku == null || sku.isBlank()) {
            throw new IllegalArgumentException("SKU é obrigatório.");
        }

        String normalizado = sku.trim().toUpperCase();

        return produtos.stream()
                .filter(produto -> produto.sku().equals(normalizado))
                .findFirst();
    }

    public Optional<ProdutoResponse> buscarResponsePorSku(String sku) {
        return buscarPorSku(sku)
                .map(ProdutoMapper::toResponse);
    }

    public Optional<ProdutoResponse> buscarMaisCaroDisponivel() {
        return produtos.stream()
                .filter(Produto::disponivel)
                .max(Comparator.comparing(Produto::preco))
                .map(ProdutoMapper::toResponse);
    }

    public Optional<ProdutoResponse> buscarDisponivelAcimaDe(BigDecimal valorMinimo) {
        if (valorMinimo == null) {
            throw new IllegalArgumentException("Valor mínimo é obrigatório.");
        }

        return produtos.stream()
                .filter(Produto::disponivel)
                .filter(produto -> produto.preco().compareTo(valorMinimo) > 0)
                .findFirst()
                .map(ProdutoMapper::toResponse);
    }
}
```

---

## App ProdutoConsultaService

Crie:

```text
src\br\com\curso\aula197\app\ProdutoConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import br.com.curso.aula197.dominio.produto.Produto;
import br.com.curso.aula197.dto.ProdutoResponse;
import br.com.curso.aula197.service.ProdutoConsultaService;

import java.math.BigDecimal;
import java.util.List;

public class ProdutoConsultaServiceApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Monitor", "Informática", new BigDecimal("1200.00"), true, 10),
                new Produto("prd-004", "Cadeira", "Móveis", new BigDecimal("450.00"), false, 0)
        );

        ProdutoConsultaService service = new ProdutoConsultaService(produtos);

        System.out.println("Buscar por SKU:");
        System.out.println(service.buscarResponsePorSku("prd-001")
                .map(ProdutoResponse::resumo)
                .orElse("Produto não encontrado."));

        System.out.println();

        System.out.println("Mais caro disponível:");
        System.out.println(service.buscarMaisCaroDisponivel()
                .map(ProdutoResponse::resumo)
                .orElse("Nenhum produto disponível."));

        System.out.println();

        System.out.println("Disponível acima de 1000:");
        System.out.println(service.buscarDisponivelAcimaDe(new BigDecimal("1000.00"))
                .map(ProdutoResponse::resumo)
                .orElse("Nenhum produto encontrado."));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.ProdutoConsultaServiceApp
```

---

# Parte 8 — Pedido com Optional e regra obrigatória

## Pedido

Crie:

```text
src\br\com\curso\aula197\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula197.dominio.pedido;

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

## PedidoFaturamentoService

Crie:

```text
src\br\com\curso\aula197\service\PedidoFaturamentoService.java
```

Código:

```java
package br.com.curso.aula197.service;

import br.com.curso.aula197.dominio.pedido.Pedido;

import java.util.List;
import java.util.Optional;

public class PedidoFaturamentoService {
    private final List<Pedido> pedidos;

    public PedidoFaturamentoService(List<Pedido> pedidos) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Pedidos são obrigatórios.");
        }

        this.pedidos = List.copyOf(pedidos);
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

    public Pedido buscarObrigatorio(String codigo) {
        return buscarPorCodigo(codigo)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado: " + codigo));
    }

    public Pedido validarPedidoParaFaturar(String codigo) {
        Pedido pedido = buscarObrigatorio(codigo);

        if (!pedido.podeFaturar()) {
            throw new IllegalStateException("Pedido não pode faturar: " + codigo);
        }

        return pedido;
    }

    public Optional<Pedido> buscarPrimeiroParaFaturar() {
        return pedidos.stream()
                .filter(Pedido::podeFaturar)
                .findFirst();
    }
}
```

---

## App PedidoFaturamentoService

Crie:

```text
src\br\com\curso\aula197\app\PedidoFaturamentoServiceApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import br.com.curso.aula197.dominio.pedido.Pedido;
import br.com.curso.aula197.service.PedidoFaturamentoService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PedidoFaturamentoServiceApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), LocalDate.of(2026, 7, 1), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), LocalDate.of(2026, 7, 2), false, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), LocalDate.of(2026, 7, 3), true, true)
        );

        PedidoFaturamentoService service = new PedidoFaturamentoService(pedidos);

        System.out.println("Buscar primeiro para faturar:");
        System.out.println(service.buscarPrimeiroParaFaturar()
                .map(Pedido::resumo)
                .orElse("Nenhum pedido para faturar."));

        System.out.println();

        System.out.println("Validar pedido obrigatório:");
        Pedido pedido = service.validarPedidoParaFaturar("PED-001");
        System.out.println(pedido.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.PedidoFaturamentoServiceApp
```

---

## Ponto de decisão

Neste service temos dois estilos:

```java
Optional<Pedido> buscarPorCodigo(String codigo)
```

e:

```java
Pedido buscarObrigatorio(String codigo)
```

Os dois podem existir.

A diferença é a intenção:

```text
buscarPorCodigo:
ausência é possível e será tratada por quem chamou.

buscarObrigatorio:
ausência é erro neste fluxo.
```

---

# Parte 9 — Ordem de Serviço com pipelines seguros

## OrdemServico

Crie:

```text
src\br\com\curso\aula197\dominio\ordemservico\OrdemServico.java
```

Código:

```java
package br.com.curso.aula197.dominio.ordemservico;

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
                + " | Dias: " + diasEmAberto;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## OrdemServicoResponse

Crie:

```text
src\br\com\curso\aula197\dto\OrdemServicoResponse.java
```

Código:

```java
package br.com.curso.aula197.dto;

public class OrdemServicoResponse {
    private final String codigo;
    private final String cliente;
    private final String status;
    private final String prioridade;

    public OrdemServicoResponse(String codigo, String cliente, String status, String prioridade) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (prioridade == null || prioridade.isBlank()) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.status = status;
        this.prioridade = prioridade;
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

    public String prioridade() {
        return prioridade;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Status: " + status
                + " | Prioridade: " + prioridade;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## OrdemServicoMapper

Crie:

```text
src\br\com\curso\aula197\dto\OrdemServicoMapper.java
```

Código:

```java
package br.com.curso.aula197.dto;

import br.com.curso.aula197.dominio.ordemservico.OrdemServico;

public final class OrdemServicoMapper {
    private OrdemServicoMapper() {
    }

    public static OrdemServicoResponse toResponse(OrdemServico os) {
        if (os == null) {
            throw new IllegalArgumentException("Ordem de Serviço é obrigatória.");
        }

        String prioridade = os.critica() ? "ALTA" : "NORMAL";

        return new OrdemServicoResponse(
                os.codigo(),
                os.cliente(),
                os.status(),
                prioridade
        );
    }
}
```

---

## OrdemServicoConsultaService

Crie:

```text
src\br\com\curso\aula197\service\OrdemServicoConsultaService.java
```

Código:

```java
package br.com.curso.aula197.service;

import br.com.curso.aula197.dominio.ordemservico.OrdemServico;
import br.com.curso.aula197.dto.OrdemServicoMapper;
import br.com.curso.aula197.dto.OrdemServicoResponse;

import java.util.Comparator;
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

    public Optional<OrdemServico> buscarPorCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = codigo.trim().toUpperCase();

        return ordens.stream()
                .filter(os -> os.codigo().equals(normalizado))
                .findFirst();
    }

    public Optional<OrdemServicoResponse> buscarResponsePorCodigo(String codigo) {
        return buscarPorCodigo(codigo)
                .map(OrdemServicoMapper::toResponse);
    }

    public Optional<OrdemServicoResponse> buscarCriticaMaisAntigaAtendivel() {
        return ordens.stream()
                .filter(OrdemServico::podeAtender)
                .filter(OrdemServico::critica)
                .max(Comparator.comparing(OrdemServico::diasEmAberto))
                .map(OrdemServicoMapper::toResponse);
    }

    public OrdemServicoResponse buscarObrigatoriaParaAtendimento(String codigo) {
        return buscarPorCodigo(codigo)
                .filter(OrdemServico::podeAtender)
                .map(OrdemServicoMapper::toResponse)
                .orElseThrow(() -> new IllegalStateException("OS não encontrada ou não atendível: " + codigo));
    }
}
```

---

## App OrdemServicoConsultaService

Crie:

```text
src\br\com\curso\aula197\app\OrdemServicoConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula197.app;

import br.com.curso.aula197.dominio.ordemservico.OrdemServico;
import br.com.curso.aula197.dto.OrdemServicoResponse;
import br.com.curso.aula197.service.OrdemServicoConsultaService;

import java.util.List;

public class OrdemServicoConsultaServiceApp {
    public static void main(String[] args) {
        List<OrdemServico> ordens = List.of(
                new OrdemServico("OS-001", "Ana", "ABERTA", false, 5),
                new OrdemServico("OS-002", "Carlos", "ABERTA", true, 2),
                new OrdemServico("OS-003", "Maria", "ABERTA", false, 20),
                new OrdemServico("OS-004", "João", "CONCLUIDA", true, 40)
        );

        OrdemServicoConsultaService service = new OrdemServicoConsultaService(ordens);

        System.out.println("Buscar por código:");
        System.out.println(service.buscarResponsePorCodigo("OS-001")
                .map(OrdemServicoResponse::resumo)
                .orElse("OS não encontrada."));

        System.out.println();

        System.out.println("Crítica mais antiga atendível:");
        System.out.println(service.buscarCriticaMaisAntigaAtendivel()
                .map(OrdemServicoResponse::resumo)
                .orElse("Nenhuma OS crítica atendível."));

        System.out.println();

        System.out.println("Obrigatória para atendimento:");
        System.out.println(service.buscarObrigatoriaParaAtendimento("OS-002"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula197.app.OrdemServicoConsultaServiceApp
```

---

# Parte 10 — Boas práticas com Optional e Stream

## 1. Use Optional em retorno de busca

Bom:

```java
Optional<Cliente> buscarPorEmail(String email)
Optional<Produto> buscarPorSku(String sku)
Optional<Pedido> buscarPorCodigo(String codigo)
```

---

## 2. Evite Optional em campo

Evite:

```java
private Optional<String> telefone;
```

Campo deve ser o tipo real:

```java
private String telefone;
```

A ausência pode ser representada por null internamente se necessário, mas com cuidado e encapsulamento.

---

## 3. Evite Optional em parâmetro

Evite:

```java
public void atualizar(Optional<String> nome)
```

Prefira sobrecarga, objeto de comando ou validação explícita.

---

## 4. Evite List<Optional<T>> como retorno público

Evite:

```java
List<Optional<Cliente>>
```

Prefira:

```java
List<Cliente>
```

com apenas os encontrados.

Ou use DTO específico se precisa representar item a item.

---

## 5. Não use Optional.get sem checar

Evite:

```java
optional.get()
```

Prefira:

```java
orElse;
orElseGet;
orElseThrow;
map;
flatMap;
ifPresent.
```

---

## 6. Optional não substitui Resultado

Optional representa presença ou ausência.

Para operação com sucesso, erro e mensagem, use outro tipo.

Exemplo futuro:

```java
Resultado<Pedido>
```

ou exceção controlada dependendo da arquitetura.

---

## 7. Optional não substitui regra de negócio

Isto é regra:

```java
pedido.podeFaturar()
```

Optional apenas ajuda a lidar com ausência.

---

# Parte 11 — Quando retornar Optional, lista vazia ou lançar exceção

## Retorne Optional quando

Use Optional quando a busca pode não encontrar um único item.

Exemplo:

```java
Optional<Cliente> buscarPorEmail(String email)
```

---

## Retorne lista vazia quando

Use lista vazia quando a consulta retorna vários itens e pode não haver nenhum.

Exemplo:

```java
List<ClienteResponse> listarClientesPorDominio(String dominio)
```

Se não houver clientes, retorne:

```java
List.of()
```

ou resultado de:

```java
.toList()
```

Não retorne null.

---

## Lance exceção quando

Use exceção quando a ausência impede o fluxo e representa erro.

Exemplo:

```java
Pedido pedido = buscarObrigatorio(codigo);
```

Se não existe pedido, não dá para faturar.

---

## Regra profissional

```text
Busca de um item:
Optional<T>

Consulta de muitos itens:
List<T>, possivelmente vazia

Fluxo obrigatório:
T ou exceção
```

---

# Parte 12 — Erros comuns

## 1. Optional.get direto

Ruim:

```java
Cliente cliente = buscarPorEmail(email).get();
```

Melhor:

```java
Cliente cliente = buscarPorEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
```

---

## 2. Retornar null em método que retorna Optional

Nunca faça:

```java
public Optional<Cliente> buscar() {
    return null;
}
```

Retorne:

```java
Optional.empty()
```

---

## 3. Criar Optional de valor possivelmente null com of

Errado:

```java
Optional.of(valorPossivelmenteNull)
```

Use:

```java
Optional.ofNullable(valorPossivelmenteNull)
```

---

## 4. Usar Optional em coleção

Evite:

```java
Optional<List<Cliente>>
```

Prefira:

```java
List<Cliente>
```

A lista vazia já representa ausência de vários resultados.

---

## 5. Usar Optional para esconder erro

Se a ausência é erro de regra, não esconda.

Use:

```java
orElseThrow
```

com mensagem clara.

---

## 6. Pipeline confuso demais

Evite:

```java
buscar()
        .flatMap(...)
        .map(...)
        .filter(...)
        .flatMap(...)
```

sem nomes claros.

Se ficar complexo, quebre em métodos.

---

# Parte 13 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula197.app.FindFirstOptionalBasicoApp
java -cp out br.com.curso.aula197.app.FindFirstOptionalVazioApp
java -cp out br.com.curso.aula197.app.OptionalMapDepoisFindFirstApp
java -cp out br.com.curso.aula197.app.OptionalFilterDepoisFindFirstApp
java -cp out br.com.curso.aula197.app.OptionalOrElseVsOrElseGetStreamApp
java -cp out br.com.curso.aula197.app.OptionalOrElseThrowStreamApp
java -cp out br.com.curso.aula197.app.OptionalStreamBasicoApp
java -cp out br.com.curso.aula197.app.StreamOptionalFlatMapApp
java -cp out br.com.curso.aula197.app.ClienteConsultaServiceApp
java -cp out br.com.curso.aula197.app.ProdutoConsultaServiceApp
java -cp out br.com.curso.aula197.app.PedidoFaturamentoServiceApp
java -cp out br.com.curso.aula197.app.OrdemServicoConsultaServiceApp
```

Para cada execução, responda:

```text
qual método retornou Optional?
o Optional foi transformado com map?
houve filter em Optional?
houve orElse, orElseGet ou orElseThrow?
a ausência era normal ou erro?
o retorno correto era Optional, lista vazia ou exceção?
```

---

# Parte 14 — Desafio prático

Crie entidade:

```text
src\br\com\curso\aula197\dominio\atividade\Atividade.java
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
critica() retorna urgente || obrigatoria;
resumo().
```

Crie DTO:

```text
src\br\com\curso\aula197\dto\AtividadeResponse.java
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
src\br\com\curso\aula197\dto\AtividadeMapper.java
```

Regra:

```text
prioridade = "ALTA" se critica, senão "NORMAL".
```

Crie service:

```text
src\br\com\curso\aula197\service\AtividadeConsultaService.java
```

Métodos:

```java
Optional<Atividade> buscarPorCodigo(String codigo)

Optional<AtividadeResponse> buscarResponsePorCodigo(String codigo)

AtividadeResponse buscarObrigatoriaParaExecucao(String codigo)

Optional<AtividadeResponse> buscarPrimeiraCriticaExecutavel()

List<AtividadeResponse> buscarVariosPorCodigo(List<String> codigos)
```

Critérios:

```text
buscarPorCodigo usa findFirst;
buscarResponsePorCodigo usa map;
buscarObrigatoriaParaExecucao usa filter + map + orElseThrow;
buscarPrimeiraCriticaExecutavel usa stream + filter + findFirst + map;
buscarVariosPorCodigo usa map para Optional e flatMap(Optional::stream);
não usar Optional.get.
```

Crie app:

```text
src\br\com\curso\aula197\app\AtividadeConsultaServiceApp.java
```

---

## Desafio extra

Crie método no service:

```java
List<AtividadeResponse> buscarExecutaveisOuListaVazia()
```

Regra:

```text
retornar lista vazia se nenhuma atividade for executável;
não retornar Optional<List<AtividadeResponse>>;
usar stream, filter, map e toList.
```

Depois explique em comentário no app:

```text
consulta de muitos itens retorna lista vazia, não Optional<List<T>>.
```

---

# Parte 15 — Debug recomendado

Coloque breakpoints em:

```text
FindFirstOptionalBasicoApp
OptionalMapDepoisFindFirstApp
OptionalOrElseVsOrElseGetStreamApp
StreamOptionalFlatMapApp
ClienteConsultaService
ProdutoConsultaService
PedidoFaturamentoService
OrdemServicoConsultaService
```

Pontos de atenção:

```java
.findFirst()
.map(...)
.filter(...)
.flatMap(Optional::stream)
.orElse(...)
.orElseGet(...)
.orElseThrow(...)
```

Observe:

```text
quando Optional está presente;
quando Optional está vazio;
quando map executa;
quando map não executa;
quando orElseGet executa;
quando orElseThrow lança exceção;
como Optional::stream remove vazios;
como service decide retorno.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Por que findFirst retorna Optional?
2. Qual a diferença entre Optional.map e Stream.map?
3. Para que serve Optional.stream?
4. Quando retornar Optional<T>?
5. Quando retornar lista vazia em vez de Optional<List<T>>?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar Optional retornado por findFirst;
usar Optional retornado por max/min;
usar Optional.map;
usar Optional.filter;
usar orElse;
usar orElseGet;
usar orElseThrow;
usar Optional.stream;
usar flatMap(Optional::stream);
evitar Optional.get;
evitar List<Optional<T>> como retorno público;
evitar Optional<List<T>>;
criar service de consulta seguro;
decidir entre Optional, lista vazia e exceção;
aplicar em Cliente;
aplicar em Produto;
aplicar em Pedido;
aplicar em OrdemServico;
resolver AtividadeConsultaServiceApp;
resolver buscarExecutaveisOuListaVazia;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-197-streams-optional-e-pipelines-seguros
git commit -m "Aula 197: streams optional e pipelines seguros"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Streams encontram e processam dados; Optional obriga você a tratar ausência com clareza.
```

Você estudou:

```text
findFirst retornando Optional;
map em Optional;
filter em Optional;
orElse;
orElseGet;
orElseThrow;
Optional.stream;
flatMap(Optional::stream);
services de consulta seguros;
decisão entre Optional, lista vazia e exceção.
```

Também reforçou uma regra profissional:

```text
Busca de um item retorna Optional.
Consulta de muitos itens retorna lista, possivelmente vazia.
Fluxo obrigatório retorna valor ou lança exceção clara.
```

Na próxima aula, vamos estudar boas práticas, legibilidade e performance em Streams:

```text
quando usar Stream;
quando usar for;
efeitos colaterais;
ordem do pipeline;
pipelines longos;
debug;
custos de processamento;
cuidados com parallelStream.
```

Essa aula será importante para fechar o uso profissional de Streams antes de avançarmos para exercícios integradores do módulo.
