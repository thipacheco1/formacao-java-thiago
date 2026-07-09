# 191 — M7.06 — Streams: toList, collect e Collectors

## Objetivo da aula

Na aula anterior, você iniciou a Streams API com:

```text
stream();
filter;
map;
forEach;
operações intermediárias;
operação terminal;
execução preguiçosa;
uso único de Stream.
```

Agora vamos avançar para um ponto essencial em backend:

```text
transformar um pipeline de Stream em uma nova coleção.
```

No mundo real, raramente você usa Stream apenas para imprimir no console.

Em backend, normalmente você quer:

```text
filtrar uma lista;
mapear entidades para responses;
montar uma lista de DTOs;
retornar dados para controller;
montar uma lista imutável;
agrupar resultados;
coletar em Set;
coletar em Map;
preparar retorno de service.
```

Nesta aula, o foco será:

```text
toList();
collect();
Collectors.toList();
Collectors.toSet();
Collectors.toMap();
diferença entre imprimir e retornar;
listas mutáveis e imutáveis;
boas práticas em services;
cuidados com duplicidade em Map;
aplicação com domínio de backend.
```

Ao final desta aula, você deve conseguir:

```text
usar stream().toList();
usar collect(Collectors.toList());
usar collect(Collectors.toSet());
usar collect(Collectors.toMap());
entender diferença entre forEach e coleta;
entender diferença entre lista retornada por toList e collectors;
mapear entidades para respostas;
criar listas filtradas;
criar sets filtrados;
criar maps por chave;
evitar erro de chave duplicada em toMap;
aplicar em service de domínio;
decidir quando usar Stream e quando usar for.
```

---

## Ideia principal

`forEach` executa uma ação.

`toList` e `collect` produzem um resultado.

Compare:

```java
clientes.stream()
        .filter(Cliente::ativo)
        .forEach(System.out::println);
```

Esse código imprime.

Agora:

```java
List<Cliente> ativos = clientes.stream()
        .filter(Cliente::ativo)
        .toList();
```

Esse código retorna uma nova lista.

Em backend, essa segunda forma é muito mais comum.

---

## forEach não é para transformar retorno

Evite este padrão:

```java
List<String> resumos = new ArrayList<>();

clientes.stream()
        .filter(Cliente::ativo)
        .forEach(cliente -> resumos.add(cliente.resumo()));
```

Funciona, mas geralmente é pior.

Prefira:

```java
List<String> resumos = clientes.stream()
        .filter(Cliente::ativo)
        .map(Cliente::resumo)
        .toList();
```

A intenção fica mais clara:

```text
filtrar;
mapear;
coletar.
```

---

## Operação terminal de coleta

Na aula anterior, usamos `forEach` como terminal.

Agora veremos terminais que produzem coleções:

```text
toList();
collect(Collectors.toList());
collect(Collectors.toSet());
collect(Collectors.toMap());
```

Essas operações disparam o Stream e retornam um resultado.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-191-streams-tolist-collect-e-collectors
cd labs\m7\aula-191-streams-tolist-collect-e-collectors
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula191
mkdir src\br\com\curso\aula191\app
mkdir src\br\com\curso\aula191\dominio
mkdir src\br\com\curso\aula191\dominio\valor
mkdir src\br\com\curso\aula191\dominio\cliente
mkdir src\br\com\curso\aula191\dominio\produto
mkdir src\br\com\curso\aula191\dominio\pedido
mkdir src\br\com\curso\aula191\dto
mkdir src\br\com\curso\aula191\service
```

---

# Parte 1 — toList()

## O que é toList()

A partir de versões modernas do Java, `Stream` possui o método:

```java
toList()
```

Ele coleta os elementos do Stream em uma lista.

Exemplo:

```java
List<String> nomesGrandes = nomes.stream()
        .filter(nome -> nome.length() >= 5)
        .toList();
```

---

## App básico com toList

Crie:

```text
src\br\com\curso\aula191\app\StreamToListBasicoApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import java.util.List;

public class StreamToListBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Alexandre");

        List<String> nomesGrandes = nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .toList();

        System.out.println("Lista original:");
        System.out.println(nomes);

        System.out.println();

        System.out.println("Nomes grandes:");
        System.out.println(nomesGrandes);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamToListBasicoApp
```

---

## O que observar

A lista original continua igual.

O Stream gerou uma nova lista:

```java
nomesGrandes
```

Stream não altera a lista original nesse caso.

Ele processa os dados e retorna outro resultado.

---

## toList com map

Crie:

```text
src\br\com\curso\aula191\app\StreamToListMapApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import java.util.List;

public class StreamToListMapApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        List<String> nomesMaiusculos = nomes.stream()
                .map(String::toUpperCase)
                .toList();

        System.out.println(nomesMaiusculos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamToListMapApp
```

---

## toList com mudança de tipo

Crie:

```text
src\br\com\curso\aula191\app\StreamToListMudandoTipoApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import java.util.List;

public class StreamToListMudandoTipoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João");

        List<Integer> tamanhos = nomes.stream()
                .map(String::length)
                .toList();

        System.out.println(tamanhos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamToListMudandoTipoApp
```

---

## Fluxo de tipos

Neste pipeline:

```java
List<Integer> tamanhos = nomes.stream()
        .map(String::length)
        .toList();
```

temos:

```text
nomes:
List<String>

nomes.stream():
Stream<String>

map(String::length):
Stream<Integer>

toList():
List<Integer>
```

Esse raciocínio é essencial para mappers e DTOs.

---

# Parte 2 — collect(Collectors.toList())

## O que é collect

`collect` é uma operação terminal mais flexível.

Ele recebe um coletor.

Exemplo:

```java
.collect(Collectors.toList())
```

Para usar:

```java
import java.util.stream.Collectors;
```

---

## App com Collectors.toList

Crie:

```text
src\br\com\curso\aula191\app\StreamCollectorsToListApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import java.util.List;
import java.util.stream.Collectors;

public class StreamCollectorsToListApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria", "João", "Alexandre");

        List<String> nomesGrandes = nomes.stream()
                .filter(nome -> nome.length() >= 5)
                .collect(Collectors.toList());

        System.out.println(nomesGrandes);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamCollectorsToListApp
```

---

## toList vs Collectors.toList

Você pode encontrar as duas formas:

```java
.toList()
```

e:

```java
.collect(Collectors.toList())
```

Para o dia a dia moderno, `toList()` é mais simples.

`collect(Collectors.toList())` aparece muito em projetos mais antigos ou quando você precisa trabalhar com collectors mais específicos.

Ponto importante:

```text
toList() retorna lista não modificável.
Collectors.toList() normalmente retorna uma lista mutável, mas a especificação não deve ser usada como promessa de implementação.
```

Na prática profissional, não dependa de mutabilidade sem intenção explícita.

---

## App mostrando tentativa de alteração

Crie:

```text
src\br\com\curso\aula191\app\StreamToListImutavelApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import java.util.List;

public class StreamToListImutavelApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        List<String> resultado = nomes.stream()
                .map(String::toUpperCase)
                .toList();

        System.out.println(resultado);

        System.out.println("A lista gerada por toList não deve ser alterada.");
        System.out.println("Se precisar alterar, crie uma nova ArrayList a partir dela.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamToListImutavelApp
```

---

## Criando lista mutável explicitamente

Se você precisa de uma lista mutável, seja explícito.

Crie:

```text
src\br\com\curso\aula191\app\StreamListaMutavelExplicitaApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import java.util.ArrayList;
import java.util.List;

public class StreamListaMutavelExplicitaApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        List<String> resultado = new ArrayList<>(
                nomes.stream()
                        .map(String::toUpperCase)
                        .toList()
        );

        resultado.add("JOÃO");

        System.out.println(resultado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamListaMutavelExplicitaApp
```

---

## Regra profissional

```text
Retorne listas não modificáveis quando possível.
Crie lista mutável apenas quando realmente precisar alterar.
```

Isso reduz efeitos colaterais.

Em backend, imutabilidade ajuda a evitar bugs.

---

# Parte 3 — Collectors.toSet()

## O que é Collectors.toSet

`Collectors.toSet()` coleta o resultado em um `Set`.

Set não permite duplicados.

Crie:

```text
src\br\com\curso\aula191\app\StreamCollectorsToSetApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class StreamCollectorsToSetApp {
    public static void main(String[] args) {
        List<String> dominios = List.of(
                "empresa.com",
                "gmail.com",
                "empresa.com",
                "hotmail.com",
                "gmail.com"
        );

        Set<String> dominiosUnicos = dominios.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());

        System.out.println(dominiosUnicos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamCollectorsToSetApp
```

---

## O que observar

A lista tinha duplicados.

O `Set` remove duplicados.

A ordem não deve ser a principal expectativa aqui.

Se precisar preservar ordem, você pode usar outro collector mais específico no futuro.

Por enquanto, memorize:

```text
toSet coleta sem duplicidade.
```

---

# Parte 4 — Collectors.toMap()

## O que é Collectors.toMap

`Collectors.toMap` coleta elementos em um `Map`.

Você informa:

```text
como gerar a chave;
como gerar o valor.
```

Exemplo:

```java
Map<String, Integer> tamanhos = nomes.stream()
        .collect(Collectors.toMap(
                nome -> nome,
                nome -> nome.length()
        ));
```

---

## App com toMap

Crie:

```text
src\br\com\curso\aula191\app\StreamCollectorsToMapApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StreamCollectorsToMapApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Maria");

        Map<String, Integer> tamanhoPorNome = nomes.stream()
                .collect(Collectors.toMap(
                        nome -> nome,
                        String::length
                ));

        System.out.println(tamanhoPorNome);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamCollectorsToMapApp
```

---

## Como ler toMap

```java
.collect(Collectors.toMap(
        nome -> nome,
        String::length
));
```

Primeira função:

```java
nome -> nome
```

gera a chave.

Segunda função:

```java
String::length
```

gera o valor.

Resultado:

```java
Map<String, Integer>
```

---

## Cuidado com chave duplicada

Se duas entradas gerarem a mesma chave, `toMap` pode lançar erro.

Crie:

```text
src\br\com\curso\aula191\app\StreamToMapChaveDuplicadaApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StreamToMapChaveDuplicadaApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Ana");

        System.out.println("Este exemplo possui chave duplicada.");

        Map<String, Integer> tamanhoPorNome = nomes.stream()
                .collect(Collectors.toMap(
                        nome -> nome,
                        String::length
                ));

        System.out.println(tamanhoPorNome);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamToMapChaveDuplicadaApp
```

---

## O que acontece

A chave `"Ana"` aparece duas vezes.

Sem regra de merge, `toMap` não sabe qual valor manter.

Isso gera erro.

Em backend real, isso é muito comum quando você transforma lista em mapa.

---

## toMap com regra de merge

Crie:

```text
src\br\com\curso\aula191\app\StreamToMapComMergeApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StreamToMapComMergeApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Ana");

        Map<String, Integer> tamanhoPorNome = nomes.stream()
                .collect(Collectors.toMap(
                        nome -> nome,
                        String::length,
                        (valorExistente, valorNovo) -> valorExistente
                ));

        System.out.println(tamanhoPorNome);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamToMapComMergeApp
```

---

## Como ler merge

Este trecho:

```java
(valorExistente, valorNovo) -> valorExistente
```

significa:

```text
se houver chave duplicada, mantenha o valor que já existia.
```

Você também poderia escolher:

```java
(valorExistente, valorNovo) -> valorNovo
```

para manter o novo.

Regra profissional:

```text
se existe chance de chave duplicada, defina a regra claramente.
```

---

# Parte 5 — Domínio Cliente

Agora vamos aplicar em domínio backend.

## Email

Crie:

```text
src\br\com\curso\aula191\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula191.dominio.valor;

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
src\br\com\curso\aula191\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula191.dominio.cliente;

import br.com.curso.aula191.dominio.valor.Email;

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

## ClienteResponse

Crie:

```text
src\br\com\curso\aula191\dto\ClienteResponse.java
```

Código:

```java
package br.com.curso.aula191.dto;

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

## App mapeando Cliente para Response

Crie:

```text
src\br\com\curso\aula191\app\StreamClienteResponseApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import br.com.curso.aula191.dominio.cliente.Cliente;
import br.com.curso.aula191.dominio.valor.Email;
import br.com.curso.aula191.dto.ClienteResponse;

import java.util.List;

public class StreamClienteResponseApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true, false),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", true, true),
                new Cliente(new Email("maria@gmail.com"), "Maria Oliveira", true, false),
                new Cliente(new Email("joao@empresa.com"), "João Lima", false, false)
        );

        List<ClienteResponse> responses = clientes.stream()
                .filter(Cliente::podeOperar)
                .map(cliente -> new ClienteResponse(
                        cliente.nome(),
                        cliente.email().resumo(),
                        cliente.email().dominio()
                ))
                .toList();

        responses.forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamClienteResponseApp
```

---

## Por que isso é importante

Esse padrão é muito comum em APIs:

```text
entidade -> response
```

Exemplo futuro:

```java
List<ClienteResponse> responses = clientes.stream()
        .map(clienteMapper::toResponse)
        .toList();
```

Você está vendo a base de mappers e DTOs.

---

## Criando mapper explícito

Crie:

```text
src\br\com\curso\aula191\dto\ClienteMapper.java
```

Código:

```java
package br.com.curso.aula191.dto;

import br.com.curso.aula191.dominio.cliente.Cliente;

public final class ClienteMapper {
    private ClienteMapper() {
    }

    public static ClienteResponse toResponse(Cliente cliente) {
        if (cliente == null) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        return new ClienteResponse(
                cliente.nome(),
                cliente.email().resumo(),
                cliente.email().dominio()
        );
    }
}
```

Crie:

```text
src\br\com\curso\aula191\app\StreamClienteMapperApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import br.com.curso.aula191.dominio.cliente.Cliente;
import br.com.curso.aula191.dominio.valor.Email;
import br.com.curso.aula191.dto.ClienteMapper;
import br.com.curso.aula191.dto.ClienteResponse;

import java.util.List;

public class StreamClienteMapperApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true, false),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", true, true),
                new Cliente(new Email("maria@gmail.com"), "Maria Oliveira", true, false),
                new Cliente(new Email("joao@empresa.com"), "João Lima", false, false)
        );

        List<ClienteResponse> responses = clientes.stream()
                .filter(Cliente::podeOperar)
                .map(ClienteMapper::toResponse)
                .toList();

        responses.forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamClienteMapperApp
```

---

## Por que mapper ajuda

Quando o mapeamento é pequeno, lambda inline pode ser aceitável.

Quando cresce, o mapper melhora:

```text
legibilidade;
teste;
reutilização;
separação de responsabilidade;
clareza da camada de resposta.
```

Em APIs reais, esse padrão será muito usado.

---

# Parte 6 — Service retornando lista

Agora vamos simular um service.

## ClienteConsultaService

Crie:

```text
src\br\com\curso\aula191\service\ClienteConsultaService.java
```

Código:

```java
package br.com.curso.aula191.service;

import br.com.curso.aula191.dominio.cliente.Cliente;
import br.com.curso.aula191.dto.ClienteMapper;
import br.com.curso.aula191.dto.ClienteResponse;

import java.util.List;

public class ClienteConsultaService {
    private final List<Cliente> clientes;

    public ClienteConsultaService(List<Cliente> clientes) {
        if (clientes == null) {
            throw new IllegalArgumentException("Clientes são obrigatórios.");
        }

        this.clientes = List.copyOf(clientes);
    }

    public List<ClienteResponse> listarClientesAptos() {
        return clientes.stream()
                .filter(Cliente::podeOperar)
                .map(ClienteMapper::toResponse)
                .toList();
    }

    public List<ClienteResponse> listarClientesPorDominio(String dominio) {
        if (dominio == null || dominio.isBlank()) {
            throw new IllegalArgumentException("Domínio é obrigatório.");
        }

        String dominioNormalizado = dominio.trim().toLowerCase();

        return clientes.stream()
                .filter(Cliente::podeOperar)
                .filter(cliente -> cliente.email().dominio().equals(dominioNormalizado))
                .map(ClienteMapper::toResponse)
                .toList();
    }
}
```

Crie:

```text
src\br\com\curso\aula191\app\ClienteConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import br.com.curso.aula191.dominio.cliente.Cliente;
import br.com.curso.aula191.dominio.valor.Email;
import br.com.curso.aula191.dto.ClienteResponse;
import br.com.curso.aula191.service.ClienteConsultaService;

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

        List<ClienteResponse> aptos = service.listarClientesAptos();
        List<ClienteResponse> corporativos = service.listarClientesPorDominio("empresa.com");

        System.out.println("Clientes aptos:");
        aptos.forEach(System.out::println);

        System.out.println();

        System.out.println("Clientes corporativos:");
        corporativos.forEach(System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.ClienteConsultaServiceApp
```

---

## Ponto arquitetural

O service retorna:

```java
List<ClienteResponse>
```

Ele não imprime dentro do método.

Isso é importante.

Em backend real, service normalmente retorna dados.

Quem decide como apresentar pode ser:

```text
controller;
view;
teste;
outro caso de uso;
integração.
```

Evite transformar service em console.

---

# Parte 7 — Produto com Set e Map

## Produto

Crie:

```text
src\br\com\curso\aula191\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula191.dominio.produto;

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
src\br\com\curso\aula191\dto\ProdutoResponse.java
```

Código:

```java
package br.com.curso.aula191.dto;

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
src\br\com\curso\aula191\dto\ProdutoMapper.java
```

Código:

```java
package br.com.curso.aula191.dto;

import br.com.curso.aula191.dominio.produto.Produto;

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

## App coletando categorias em Set

Crie:

```text
src\br\com\curso\aula191\app\StreamProdutoCategoriasSetApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import br.com.curso.aula191.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class StreamProdutoCategoriasSetApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-004", "Cadeira", "Móveis", new BigDecimal("450.00"), false, 0)
        );

        Set<String> categoriasDisponiveis = produtos.stream()
                .filter(Produto::disponivel)
                .map(Produto::categoria)
                .collect(Collectors.toSet());

        System.out.println(categoriasDisponiveis);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamProdutoCategoriasSetApp
```

---

## App coletando produtos por SKU em Map

Crie:

```text
src\br\com\curso\aula191\app\StreamProdutoMapPorSkuApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import br.com.curso.aula191.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StreamProdutoMapPorSkuApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2)
        );

        Map<String, Produto> produtoPorSku = produtos.stream()
                .collect(Collectors.toMap(
                        Produto::sku,
                        produto -> produto
                ));

        System.out.println(produtoPorSku.get("PRD-001"));
        System.out.println(produtoPorSku.get("PRD-003"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamProdutoMapPorSkuApp
```

---

## Function.identity()

Neste trecho:

```java
produto -> produto
```

estamos retornando o próprio produto.

O Java tem uma forma pronta:

```java
Function.identity()
```

Vamos usar.

Crie:

```text
src\br\com\curso\aula191\app\StreamProdutoMapFunctionIdentityApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import br.com.curso.aula191.dominio.produto.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class StreamProdutoMapFunctionIdentityApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2)
        );

        Map<String, Produto> produtoPorSku = produtos.stream()
                .collect(Collectors.toMap(
                        Produto::sku,
                        Function.identity()
                ));

        System.out.println(produtoPorSku);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.StreamProdutoMapFunctionIdentityApp
```

---

## ProdutoService com lista, set e map

Crie:

```text
src\br\com\curso\aula191\service\ProdutoConsultaService.java
```

Código:

```java
package br.com.curso.aula191.service;

import br.com.curso.aula191.dominio.produto.Produto;
import br.com.curso.aula191.dto.ProdutoMapper;
import br.com.curso.aula191.dto.ProdutoResponse;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

public class ProdutoConsultaService {
    private final List<Produto> produtos;

    public ProdutoConsultaService(List<Produto> produtos) {
        if (produtos == null) {
            throw new IllegalArgumentException("Produtos são obrigatórios.");
        }

        this.produtos = List.copyOf(produtos);
    }

    public List<ProdutoResponse> listarDisponiveis() {
        return produtos.stream()
                .filter(Produto::disponivel)
                .map(ProdutoMapper::toResponse)
                .toList();
    }

    public Set<String> listarCategoriasDisponiveis() {
        return produtos.stream()
                .filter(Produto::disponivel)
                .map(Produto::categoria)
                .collect(Collectors.toSet());
    }

    public Map<String, ProdutoResponse> mapearDisponiveisPorSku() {
        return produtos.stream()
                .filter(Produto::disponivel)
                .map(ProdutoMapper::toResponse)
                .collect(Collectors.toMap(
                        ProdutoResponse::sku,
                        Function.identity()
                ));
    }
}
```

Crie:

```text
src\br\com\curso\aula191\app\ProdutoConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import br.com.curso.aula191.dominio.produto.Produto;
import br.com.curso.aula191.dto.ProdutoResponse;
import br.com.curso.aula191.service.ProdutoConsultaService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class ProdutoConsultaServiceApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", "Informática", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", "Informática", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Mesa", "Móveis", new BigDecimal("600.00"), true, 2),
                new Produto("prd-004", "Cadeira", "Móveis", new BigDecimal("450.00"), false, 0)
        );

        ProdutoConsultaService service = new ProdutoConsultaService(produtos);

        List<ProdutoResponse> disponiveis = service.listarDisponiveis();
        Set<String> categorias = service.listarCategoriasDisponiveis();
        Map<String, ProdutoResponse> porSku = service.mapearDisponiveisPorSku();

        System.out.println("Disponíveis:");
        disponiveis.forEach(System.out::println);

        System.out.println();

        System.out.println("Categorias:");
        System.out.println(categorias);

        System.out.println();

        System.out.println("Produto PRD-001:");
        System.out.println(porSku.get("PRD-001"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.ProdutoConsultaServiceApp
```

---

# Parte 8 — Pedido com response

## Pedido

Crie:

```text
src\br\com\curso\aula191\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula191.dominio.pedido;

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

## PedidoResponse

Crie:

```text
src\br\com\curso\aula191\dto\PedidoResponse.java
```

Código:

```java
package br.com.curso.aula191.dto;

import java.math.BigDecimal;

public class PedidoResponse {
    private final String codigo;
    private final String cliente;
    private final BigDecimal valor;

    public PedidoResponse(String codigo, String cliente, BigDecimal valor) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.valor = valor;
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

    public String resumo() {
        return codigo + " | Cliente: " + cliente + " | Valor: " + valor;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## PedidoMapper

Crie:

```text
src\br\com\curso\aula191\dto\PedidoMapper.java
```

Código:

```java
package br.com.curso.aula191.dto;

import br.com.curso.aula191.dominio.pedido.Pedido;

public final class PedidoMapper {
    private PedidoMapper() {
    }

    public static PedidoResponse toResponse(Pedido pedido) {
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido é obrigatório.");
        }

        return new PedidoResponse(
                pedido.codigo(),
                pedido.cliente(),
                pedido.valor()
        );
    }
}
```

---

## PedidoConsultaService

Crie:

```text
src\br\com\curso\aula191\service\PedidoConsultaService.java
```

Código:

```java
package br.com.curso.aula191.service;

import br.com.curso.aula191.dominio.pedido.Pedido;
import br.com.curso.aula191.dto.PedidoMapper;
import br.com.curso.aula191.dto.PedidoResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class PedidoConsultaService {
    private final List<Pedido> pedidos;

    public PedidoConsultaService(List<Pedido> pedidos) {
        if (pedidos == null) {
            throw new IllegalArgumentException("Pedidos são obrigatórios.");
        }

        this.pedidos = List.copyOf(pedidos);
    }

    public List<PedidoResponse> listarPedidosParaFaturar() {
        return pedidos.stream()
                .filter(Pedido::podeFaturar)
                .map(PedidoMapper::toResponse)
                .toList();
    }

    public List<PedidoResponse> listarPedidosParaFaturarAcimaDe(BigDecimal valorMinimo) {
        if (valorMinimo == null) {
            throw new IllegalArgumentException("Valor mínimo é obrigatório.");
        }

        return pedidos.stream()
                .filter(Pedido::podeFaturar)
                .filter(pedido -> pedido.valor().compareTo(valorMinimo) > 0)
                .map(PedidoMapper::toResponse)
                .toList();
    }

    public Map<String, PedidoResponse> mapearParaFaturarPorCodigo() {
        return pedidos.stream()
                .filter(Pedido::podeFaturar)
                .map(PedidoMapper::toResponse)
                .collect(Collectors.toMap(
                        PedidoResponse::codigo,
                        Function.identity()
                ));
    }
}
```

Crie:

```text
src\br\com\curso\aula191\app\PedidoConsultaServiceApp.java
```

Código:

```java
package br.com.curso.aula191.app;

import br.com.curso.aula191.dominio.pedido.Pedido;
import br.com.curso.aula191.dto.PedidoResponse;
import br.com.curso.aula191.service.PedidoConsultaService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class PedidoConsultaServiceApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido("PED-001", "Ana", new BigDecimal("500.00"), true, false),
                new Pedido("PED-002", "Carlos", new BigDecimal("1500.00"), true, false),
                new Pedido("PED-003", "Maria", new BigDecimal("2500.00"), false, false),
                new Pedido("PED-004", "João", new BigDecimal("3000.00"), true, true)
        );

        PedidoConsultaService service = new PedidoConsultaService(pedidos);

        List<PedidoResponse> paraFaturar = service.listarPedidosParaFaturar();
        List<PedidoResponse> acimaDeMil = service.listarPedidosParaFaturarAcimaDe(new BigDecimal("1000.00"));
        Map<String, PedidoResponse> porCodigo = service.mapearParaFaturarPorCodigo();

        System.out.println("Para faturar:");
        paraFaturar.forEach(System.out::println);

        System.out.println();

        System.out.println("Para faturar acima de 1000:");
        acimaDeMil.forEach(System.out::println);

        System.out.println();

        System.out.println("Pedido PED-002:");
        System.out.println(porCodigo.get("PED-002"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula191.app.PedidoConsultaServiceApp
```

---

# Parte 9 — Boas práticas em Services

## Service deve retornar dados

Prefira:

```java
public List<ClienteResponse> listarClientesAptos() {
    return clientes.stream()
            .filter(Cliente::podeOperar)
            .map(ClienteMapper::toResponse)
            .toList();
}
```

Evite:

```java
public void imprimirClientesAptos() {
    clientes.stream()
            .filter(Cliente::podeOperar)
            .forEach(System.out::println);
}
```

Em backend real, service não deveria depender de console.

---

## Mapper melhora quando transformação cresce

Se o mapeamento é simples, isto pode ser aceitável:

```java
.map(cliente -> new ClienteResponse(...))
```

Mas em projetos reais, prefira:

```java
.map(ClienteMapper::toResponse)
```

quando:

```text
mapeamento cresce;
mapeamento é reutilizado;
há testes de mapper;
há response específico;
há regra de apresentação.
```

---

## Não coloque regra de negócio no mapper

Mapper converte dados.

Regra de negócio fica no domínio ou service.

Ruim:

```java
ClienteMapper.toResponse(cliente)
```

decidindo se cliente pode operar.

Melhor:

```java
clientes.stream()
        .filter(Cliente::podeOperar)
        .map(ClienteMapper::toResponse)
        .toList();
```

O filtro representa decisão.

O mapper representa conversão.

---

## Cuidado com toMap

Antes de usar:

```java
Collectors.toMap(...)
```

pergunte:

```text
a chave é realmente única?
o que acontece se duplicar?
qual valor fica?
devo lançar erro?
devo manter o primeiro?
devo manter o último?
devo agrupar em lista?
```

Se a chave não for única, talvez `groupingBy` seja melhor.

Vamos estudar groupingBy em aula futura.

---

# Parte 10 — Erros comuns

## 1. Usar forEach para montar lista

Evite:

```java
List<String> resumos = new ArrayList<>();
clientes.stream().forEach(cliente -> resumos.add(cliente.resumo()));
```

Prefira:

```java
List<String> resumos = clientes.stream()
        .map(Cliente::resumo)
        .toList();
```

---

## 2. Achar que toList altera a lista original

Não altera.

Retorna uma nova lista.

---

## 3. Tentar alterar lista de toList

A lista de `toList()` não deve ser alterada.

Se precisar alterar, crie uma nova `ArrayList`.

---

## 4. Usar toMap sem pensar em duplicidade

Chave duplicada pode gerar erro.

Defina regra de merge quando necessário.

---

## 5. Colocar regra demais dentro do map

Ruim:

```java
.map(cliente -> {
    if (...)
    ...
})
```

Se crescer, use mapper.

---

## 6. Retornar entidade quando deveria retornar response

Em service de consulta para API, normalmente você vai retornar DTO/Response, não entidade.

Ainda vamos aprofundar isso em módulos de arquitetura e Spring.

---

## 7. Fazer stream complexo demais

Se o pipeline ficou difícil, quebre em métodos, predicates, mappers ou use `for`.

---

# Parte 11 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula191.app.StreamToListBasicoApp
java -cp out br.com.curso.aula191.app.StreamToListMapApp
java -cp out br.com.curso.aula191.app.StreamToListMudandoTipoApp
java -cp out br.com.curso.aula191.app.StreamCollectorsToListApp
java -cp out br.com.curso.aula191.app.StreamToListImutavelApp
java -cp out br.com.curso.aula191.app.StreamListaMutavelExplicitaApp
java -cp out br.com.curso.aula191.app.StreamCollectorsToSetApp
java -cp out br.com.curso.aula191.app.StreamCollectorsToMapApp
java -cp out br.com.curso.aula191.app.StreamToMapComMergeApp
java -cp out br.com.curso.aula191.app.StreamClienteResponseApp
java -cp out br.com.curso.aula191.app.StreamClienteMapperApp
java -cp out br.com.curso.aula191.app.ClienteConsultaServiceApp
java -cp out br.com.curso.aula191.app.StreamProdutoCategoriasSetApp
java -cp out br.com.curso.aula191.app.StreamProdutoMapPorSkuApp
java -cp out br.com.curso.aula191.app.StreamProdutoMapFunctionIdentityApp
java -cp out br.com.curso.aula191.app.ProdutoConsultaServiceApp
java -cp out br.com.curso.aula191.app.PedidoConsultaServiceApp
```

Para cada execução, responda:

```text
qual foi a fonte do stream?
qual foi o filtro?
qual foi o mapper?
qual foi a operação terminal?
o resultado foi List, Set ou Map?
houve risco de chave duplicada?
o service retornou dados ou imprimiu?
```

---

# Parte 12 — Desafio prático

Crie entidade:

```text
src\br\com\curso\aula191\dominio\ordemservico\OrdemServico.java
```

Campos:

```text
String codigo;
String cliente;
String status;
boolean urgente;
int diasEmAberto;
```

Regras:

```text
codigo obrigatório;
cliente obrigatório;
status obrigatório;
diasEmAberto não pode ser negativo;
podeAtender() retorna status igual "ABERTA" e diasEmAberto <= 30;
critica() retorna urgente || diasEmAberto > 15;
resumo().
```

Crie DTO:

```text
src\br\com\curso\aula191\dto\OrdemServicoResponse.java
```

Campos:

```text
codigo;
cliente;
status;
prioridade;
```

Crie mapper:

```text
src\br\com\curso\aula191\dto\OrdemServicoMapper.java
```

Regra:

```text
prioridade = "ALTA" se critica, senão "NORMAL".
```

Crie service:

```text
src\br\com\curso\aula191\service\OrdemServicoConsultaService.java
```

Métodos:

```java
List<OrdemServicoResponse> listarAtendiveis()

List<OrdemServicoResponse> listarCriticas()

Map<String, OrdemServicoResponse> mapearAtendiveisPorCodigo()
```

Crie app:

```text
src\br\com\curso\aula191\app\OrdemServicoConsultaServiceApp.java
```

Critério principal:

```text
usar Stream;
usar toList;
usar Collectors.toMap;
usar mapper;
não imprimir dentro do service;
não colocar regra de domínio no mapper.
```

---

## Desafio extra

No método:

```java
mapearAtendiveisPorCodigo()
```

trate duplicidade de código.

Escolha uma regra:

```text
manter primeiro;
manter último;
ou lançar erro com mensagem clara.
```

Implemente com merge function em `Collectors.toMap`.

Critério principal:

```text
não ignorar risco de chave duplicada.
```

---

# Parte 13 — Debug recomendado

Coloque breakpoints em:

```text
StreamClienteMapperApp
ClienteMapper.toResponse
ClienteConsultaService.listarClientesAptos
ProdutoConsultaService.listarDisponiveis
ProdutoConsultaService.mapearDisponiveisPorSku
PedidoConsultaService.listarPedidosParaFaturar
PedidoMapper.toResponse
```

Observe:

```text
quando filter executa;
quando mapper executa;
quando toList dispara;
quando collect dispara;
como List vira List<Response>;
como Produto vira Map por SKU;
como Pedido vira response;
como service retorna dados.
```

Pontos de atenção:

```java
.toList()
.collect(Collectors.toList())
.collect(Collectors.toSet())
.collect(Collectors.toMap(...))
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre forEach e toList?
2. Quando usar Collectors.toSet?
3. Quando usar Collectors.toMap?
4. Qual o risco de toMap?
5. Por que service deve retornar dados em vez de imprimir?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar toList;
usar collect(Collectors.toList());
usar collect(Collectors.toSet());
usar collect(Collectors.toMap());
entender lista imutável retornada por toList;
criar lista mutável explicitamente quando necessário;
mapear entidade para response;
criar mapper simples;
usar mapper com method reference;
criar service que retorna List<Response>;
criar service que retorna Set<String>;
criar service que retorna Map<String, Response>;
tratar ou reconhecer chave duplicada em toMap;
evitar forEach para montar lista;
resolver OrdemServicoConsultaServiceApp;
resolver desafio extra de duplicidade;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-191-streams-tolist-collect-e-collectors
git commit -m "Aula 191: streams tolist collect e collectors"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Stream em backend geralmente serve para transformar dados e retornar coleções, não apenas imprimir.
```

Você estudou:

```text
toList;
collect;
Collectors.toList;
Collectors.toSet;
Collectors.toMap;
Function.identity;
mapper;
response;
service retornando lista;
cuidado com duplicidade em Map.
```

Também reforçou uma regra arquitetural:

```text
service retorna dados;
mapper converte;
domínio protege regra;
controller futuramente recebe e responde HTTP.
```

Na próxima aula, vamos continuar com Streams e estudar operações de busca e verificação:

```text
findFirst;
findAny;
anyMatch;
allMatch;
noneMatch;
count.
```

Essas operações aparecem muito em validações de regra de negócio, consultas em memória e fluxos de decisão dentro de services.
