# 173 — M6.02 — Classes e interfaces genéricas

## Objetivo da aula

Nesta aula você vai aprofundar a criação de:

```text
classes genéricas;
interfaces genéricas;
implementações genéricas;
contratos reutilizáveis com tipo seguro.
```

Na aula anterior, você viu a base de generics:

```text
por que generics existem;
problema de Object;
raw types;
classe Caixa<T>;
classe ParValores<K, V>;
ResultadoOperacao<T>;
RepositorioMemoria<T>;
método genérico simples.
```

Agora vamos dar um passo importante:

```text
criar contratos genéricos.
```

Contratos genéricos são muito usados em Java profissional.

Eles aparecem em estruturas como:

```text
Repository<T, ID>;
JpaRepository<T, ID>;
Comparator<T>;
Supplier<T>;
Function<T, R>;
ResponseEntity<T>;
Optional<T>;
Page<T>.
```

Ao final desta aula, você deve conseguir:

```text
criar classe genérica com um tipo;
criar classe genérica com dois tipos;
criar interface genérica;
implementar interface genérica com tipo fixo;
implementar interface genérica mantendo o tipo aberto;
entender T, ID, E, K, V, R;
usar generics para evitar duplicação;
criar repositório genérico com Map;
criar validador genérico;
criar conversor genérico;
usar generics com domínio de Ordem de Serviço;
entender quando generics ajudam e quando atrapalham.
```

---

## Ideia principal

Uma classe comum trabalha com tipos definidos.

Exemplo:

```java
public class CaixaString {
    private String valor;
}
```

Essa classe só serve para `String`.

Se você quiser guardar `Integer`, precisaria de outra:

```java
public class CaixaInteger {
    private Integer valor;
}
```

Isso gera duplicação.

Com generics, você cria uma única classe:

```java
public class Caixa<T> {
    private T valor;
}
```

E usa com vários tipos:

```java
Caixa<String>
Caixa<Integer>
Caixa<CodigoOs>
```

A mesma ideia vale para interfaces.

---

## Classe genérica vs interface genérica

### Classe genérica

Define estrutura e comportamento reutilizável.

Exemplo:

```java
public class Resultado<T> {
}
```

### Interface genérica

Define um contrato reutilizável.

Exemplo:

```java
public interface Repositorio<T, ID> {
}
```

Uma interface genérica não sabe qual tipo concreto será usado.

Ela diz:

```text
quem implementar este contrato deverá trabalhar com algum tipo T e algum identificador ID.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-173-classes-e-interfaces-genericas
cd labs\m6\aula-173-classes-e-interfaces-genericas
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula173
mkdir src\br\com\curso\aula173\app
mkdir src\br\com\curso\aula173\dominio
mkdir src\br\com\curso\aula173\dominio\valor
mkdir src\br\com\curso\aula173\dominio\ordemservico
mkdir src\br\com\curso\aula173\dominio\cliente
mkdir src\br\com\curso\aula173\infra
mkdir src\br\com\curso\aula173\contrato
mkdir src\br\com\curso\aula173\util
```

---

## Classe genérica simples: CaixaGenerica

Crie:

```text
src\br\com\curso\aula173\util\CaixaGenerica.java
```

Código:

```java
package br.com.curso.aula173.util;

public class CaixaGenerica<T> {
    private final T valor;

    public CaixaGenerica(T valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.valor = valor;
    }

    public T valor() {
        return valor;
    }

    public String tipoDoValor() {
        return valor.getClass().getSimpleName();
    }

    public String resumo() {
        return "Tipo: " + tipoDoValor() + " | Valor: " + valor;
    }
}
```

---

## App usando CaixaGenerica

Crie:

```text
src\br\com\curso\aula173\app\CaixaGenericaApp.java
```

Código:

```java
package br.com.curso.aula173.app;

import br.com.curso.aula173.util.CaixaGenerica;

public class CaixaGenericaApp {
    public static void main(String[] args) {
        CaixaGenerica<String> caixaNome = new CaixaGenerica<>("Ana");
        CaixaGenerica<Integer> caixaQuantidade = new CaixaGenerica<>(10);

        String nome = caixaNome.valor();
        Integer quantidade = caixaQuantidade.valor();

        System.out.println(caixaNome.resumo());
        System.out.println("Nome em maiúsculo: " + nome.toUpperCase());

        System.out.println();

        System.out.println(caixaQuantidade.resumo());
        System.out.println("Quantidade dobrada: " + (quantidade * 2));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula173.app.CaixaGenericaApp
```

---

## O que esse exemplo reforça

A mesma classe:

```java
CaixaGenerica<T>
```

funciona para:

```java
String;
Integer;
CodigoOs;
OrdemServico;
Cliente.
```

O tipo é definido no uso.

Isso evita criar várias classes repetidas.

---

## Classe genérica com dois tipos: ParGenerico

Crie:

```text
src\br\com\curso\aula173\util\ParGenerico.java
```

Código:

```java
package br.com.curso.aula173.util;

public class ParGenerico<K, V> {
    private final K chave;
    private final V valor;

    public ParGenerico(K chave, V valor) {
        if (chave == null) {
            throw new IllegalArgumentException("Chave é obrigatória.");
        }

        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        this.chave = chave;
        this.valor = valor;
    }

    public K chave() {
        return chave;
    }

    public V valor() {
        return valor;
    }

    public String resumo() {
        return chave + " -> " + valor;
    }
}
```

---

## Como ler ParGenerico<K, V>

```java
ParGenerico<K, V>
```

Significa:

```text
K representa o tipo da chave;
V representa o tipo do valor.
```

Isso é muito parecido com:

```java
Map<K, V>
```

Exemplo:

```java
ParGenerico<String, Integer>
```

significa:

```text
chave String;
valor Integer.
```

---

## App usando ParGenerico

Crie:

```text
src\br\com\curso\aula173\app\ParGenericoApp.java
```

Código:

```java
package br.com.curso.aula173.app;

import br.com.curso.aula173.util.ParGenerico;

public class ParGenericoApp {
    public static void main(String[] args) {
        ParGenerico<String, Integer> contagem = new ParGenerico<>("CONCLUIDA", 5);
        ParGenerico<Integer, String> erroLinha = new ParGenerico<>(12, "Código inválido");

        String status = contagem.chave();
        Integer quantidade = contagem.valor();

        Integer linha = erroLinha.chave();
        String erro = erroLinha.valor();

        System.out.println(contagem.resumo());
        System.out.println("Status: " + status + " | Quantidade: " + quantidade);

        System.out.println();

        System.out.println(erroLinha.resumo());
        System.out.println("Linha: " + linha + " | Erro: " + erro);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula173.app.ParGenericoApp
```

---

## Interface genérica: Validador<T>

Agora vamos criar uma interface genérica.

Crie:

```text
src\br\com\curso\aula173\contrato\Validador.java
```

Código:

```java
package br.com.curso.aula173.contrato;

public interface Validador<T> {
    boolean valido(T valor);

    String mensagemErro();
}
```

---

## Como ler Validador<T>

```java
public interface Validador<T>
```

Significa:

```text
este contrato valida algum tipo T.
```

Exemplos possíveis:

```java
Validador<String>
Validador<CodigoOs>
Validador<OrdemServico>
Validador<Cliente>
```

A interface é genérica.

A implementação decide o tipo.

---

## Implementação com tipo fixo: ValidadorTextoNaoBranco

Crie:

```text
src\br\com\curso\aula173\infra\ValidadorTextoNaoBranco.java
```

Código:

```java
package br.com.curso.aula173.infra;

import br.com.curso.aula173.contrato.Validador;

public class ValidadorTextoNaoBranco implements Validador<String> {
    @Override
    public boolean valido(String valor) {
        return valor != null && !valor.isBlank();
    }

    @Override
    public String mensagemErro() {
        return "Texto não pode ser nulo ou branco.";
    }
}
```

---

## O que essa implementação faz

A interface é:

```java
Validador<T>
```

A implementação escolheu:

```java
Validador<String>
```

Então o método fica:

```java
boolean valido(String valor)
```

Não é `Object`.

Não precisa cast.

É seguro.

---

## App usando Validador<String>

Crie:

```text
src\br\com\curso\aula173\app\ValidadorStringApp.java
```

Código:

```java
package br.com.curso.aula173.app;

import br.com.curso.aula173.contrato.Validador;
import br.com.curso.aula173.infra.ValidadorTextoNaoBranco;

public class ValidadorStringApp {
    public static void main(String[] args) {
        Validador<String> validador = new ValidadorTextoNaoBranco();

        validar(validador, "Ana");
        validar(validador, "   ");
        validar(validador, null);
    }

    private static void validar(Validador<String> validador, String texto) {
        if (validador.valido(texto)) {
            System.out.println("Válido: " + texto);
        } else {
            System.out.println("Inválido: " + validador.mensagemErro());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula173.app.ValidadorStringApp
```

---

## Interface genérica com implementação genérica

Agora vamos criar um validador que mantém o tipo aberto.

Crie:

```text
src\br\com\curso\aula173\infra\ValidadorNaoNulo.java
```

Código:

```java
package br.com.curso.aula173.infra;

import br.com.curso.aula173.contrato.Validador;

public class ValidadorNaoNulo<T> implements Validador<T> {
    @Override
    public boolean valido(T valor) {
        return valor != null;
    }

    @Override
    public String mensagemErro() {
        return "Valor não pode ser nulo.";
    }
}
```

---

## Como ler ValidadorNaoNulo<T>

```java
public class ValidadorNaoNulo<T> implements Validador<T>
```

Significa:

```text
esta classe continua genérica;
ela valida qualquer tipo T;
ela implementa Validador do mesmo T.
```

Você pode usar:

```java
ValidadorNaoNulo<String>
ValidadorNaoNulo<Integer>
ValidadorNaoNulo<OrdemServico>
```

---

## App usando ValidadorNaoNulo<T>

Crie:

```text
src\br\com\curso\aula173\app\ValidadorNaoNuloGenericoApp.java
```

Código:

```java
package br.com.curso.aula173.app;

import br.com.curso.aula173.contrato.Validador;
import br.com.curso.aula173.infra.ValidadorNaoNulo;

public class ValidadorNaoNuloGenericoApp {
    public static void main(String[] args) {
        Validador<String> validadorTexto = new ValidadorNaoNulo<>();
        Validador<Integer> validadorNumero = new ValidadorNaoNulo<>();

        System.out.println("Texto válido? " + validadorTexto.valido("Ana"));
        System.out.println("Texto nulo válido? " + validadorTexto.valido(null));

        System.out.println();

        System.out.println("Número válido? " + validadorNumero.valido(10));
        System.out.println("Número nulo válido? " + validadorNumero.valido(null));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula173.app.ValidadorNaoNuloGenericoApp
```

---

## Diferença importante

### Implementação com tipo fixo

```java
public class ValidadorTextoNaoBranco implements Validador<String>
```

Essa classe só valida `String`.

### Implementação genérica

```java
public class ValidadorNaoNulo<T> implements Validador<T>
```

Essa classe valida qualquer tipo.

Ambas são úteis.

A escolha depende da intenção.

---

## Interface genérica Conversor<E, S>

Agora vamos criar uma interface com dois tipos.

Crie:

```text
src\br\com\curso\aula173\contrato\Conversor.java
```

Código:

```java
package br.com.curso.aula173.contrato;

public interface Conversor<E, S> {
    S converter(E entrada);
}
```

---

## Como ler Conversor<E, S>

```java
Conversor<E, S>
```

Significa:

```text
E é o tipo de entrada;
S é o tipo de saída.
```

Exemplos:

```java
Conversor<String, Integer>
Conversor<String, CodigoOs>
Conversor<LinhaImportacao, OrdemServico>
Conversor<Entidade, Dto>
```

Essa ideia será muito usada quando estudarmos DTOs e mappers.

---

## Implementação Conversor<String, Integer>

Crie:

```text
src\br\com\curso\aula173\infra\ConversorTextoParaInteiro.java
```

Código:

```java
package br.com.curso.aula173.infra;

import br.com.curso.aula173.contrato.Conversor;

public class ConversorTextoParaInteiro implements Conversor<String, Integer> {
    @Override
    public Integer converter(String entrada) {
        if (entrada == null || entrada.isBlank()) {
            throw new IllegalArgumentException("Texto numérico é obrigatório.");
        }

        return Integer.valueOf(entrada.trim());
    }
}
```

---

## App usando Conversor

Crie:

```text
src\br\com\curso\aula173\app\ConversorGenericoApp.java
```

Código:

```java
package br.com.curso.aula173.app;

import br.com.curso.aula173.contrato.Conversor;
import br.com.curso.aula173.infra.ConversorTextoParaInteiro;

public class ConversorGenericoApp {
    public static void main(String[] args) {
        Conversor<String, Integer> conversor = new ConversorTextoParaInteiro();

        Integer numero = conversor.converter("123");

        System.out.println("Número convertido: " + numero);
        System.out.println("Dobro: " + (numero * 2));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula173.app.ConversorGenericoApp
```

---

## Domínio para exemplos reais

Agora vamos criar um pequeno domínio de OS e Cliente.

Crie:

```text
src\br\com\curso\aula173\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula173.dominio.valor;

import java.util.Objects;

public final class CodigoOs implements Comparable<CodigoOs> {
    private final String valor;

    public CodigoOs(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        String normalizado = valor.trim().toUpperCase();

        if (!normalizado.startsWith("OS-")) {
            throw new IllegalArgumentException("Código deve iniciar com OS-.");
        }

        this.valor = normalizado;
    }

    public String valor() {
        return valor;
    }

    public String resumo() {
        return valor;
    }

    @Override
    public int compareTo(CodigoOs outro) {
        return this.valor.compareTo(outro.valor);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof CodigoOs codigoOs)) {
            return false;
        }

        return Objects.equals(valor, codigoOs.valor);
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

Crie:

```text
src\br\com\curso\aula173\dominio\valor\CodigoCliente.java
```

Código:

```java
package br.com.curso.aula173.dominio.valor;

import java.util.Objects;

public final class CodigoCliente implements Comparable<CodigoCliente> {
    private final String valor;

    public CodigoCliente(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código do cliente é obrigatório.");
        }

        String normalizado = valor.trim().toUpperCase();

        if (!normalizado.startsWith("CLI-")) {
            throw new IllegalArgumentException("Código do cliente deve iniciar com CLI-.");
        }

        this.valor = normalizado;
    }

    public String valor() {
        return valor;
    }

    public String resumo() {
        return valor;
    }

    @Override
    public int compareTo(CodigoCliente outro) {
        return this.valor.compareTo(outro.valor);
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof CodigoCliente codigoCliente)) {
            return false;
        }

        return Objects.equals(valor, codigoCliente.valor);
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

## OrdemServicoGenerica

Crie:

```text
src\br\com\curso\aula173\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula173.dominio.ordemservico;

public enum StatusOs {
    CADASTRADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula173\dominio\ordemservico\OrdemServicoGenerica.java
```

Código:

```java
package br.com.curso.aula173.dominio.ordemservico;

import br.com.curso.aula173.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class OrdemServicoGenerica {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataEntrada;
    private final StatusOs status;

    public OrdemServicoGenerica(
            CodigoOs codigo,
            String cliente,
            LocalDate dataEntrada,
            StatusOs status
    ) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataEntrada == null) {
            throw new IllegalArgumentException("Data de entrada é obrigatória.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente.trim();
        this.dataEntrada = dataEntrada;
        this.status = status;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public StatusOs status() {
        return status;
    }

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Entrada: " + dataEntrada
                + " | Status: " + status;
    }
}
```

---

## ClienteGenerico

Crie:

```text
src\br\com\curso\aula173\dominio\cliente\ClienteGenerico.java
```

Código:

```java
package br.com.curso.aula173.dominio.cliente;

import br.com.curso.aula173.dominio.valor.CodigoCliente;

public class ClienteGenerico {
    private final CodigoCliente codigo;
    private final String nome;

    public ClienteGenerico(CodigoCliente codigo, String nome) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código do cliente é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }

        this.codigo = codigo;
        this.nome = nome.trim();
    }

    public CodigoCliente codigo() {
        return codigo;
    }

    public String nome() {
        return nome;
    }

    public String resumo() {
        return codigo.resumo() + " | Nome: " + nome;
    }
}
```

---

## Interface genérica Repositorio<ID, T>

Crie:

```text
src\br\com\curso\aula173\contrato\Repositorio.java
```

Código:

```java
package br.com.curso.aula173.contrato;

import java.util.List;

public interface Repositorio<ID, T> {
    void salvar(ID id, T entidade);

    T buscarObrigatorio(ID id);

    boolean existe(ID id);

    List<T> listar();

    int quantidade();
}
```

---

## Como ler Repositorio<ID, T>

```java
Repositorio<ID, T>
```

Significa:

```text
ID é o tipo do identificador;
T é o tipo da entidade.
```

Exemplos:

```java
Repositorio<CodigoOs, OrdemServicoGenerica>
Repositorio<CodigoCliente, ClienteGenerico>
Repositorio<String, String>
```

A interface é uma só.

As combinações de tipos mudam.

---

## Implementação genérica com Map

Crie:

```text
src\br\com\curso\aula173\infra\RepositorioMapMemoria.java
```

Código:

```java
package br.com.curso.aula173.infra;

import br.com.curso.aula173.contrato.Repositorio;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class RepositorioMapMemoria<ID, T> implements Repositorio<ID, T> {
    private final Map<ID, T> itensPorId;

    public RepositorioMapMemoria() {
        this.itensPorId = new LinkedHashMap<>();
    }

    @Override
    public void salvar(ID id, T entidade) {
        if (id == null) {
            throw new IllegalArgumentException("ID é obrigatório.");
        }

        if (entidade == null) {
            throw new IllegalArgumentException("Entidade é obrigatória.");
        }

        if (itensPorId.containsKey(id)) {
            throw new IllegalStateException("ID já cadastrado: " + id);
        }

        itensPorId.put(id, entidade);
    }

    @Override
    public T buscarObrigatorio(ID id) {
        T entidade = itensPorId.get(id);

        if (entidade == null) {
            throw new IllegalArgumentException("Registro não encontrado para ID: " + id);
        }

        return entidade;
    }

    @Override
    public boolean existe(ID id) {
        return itensPorId.containsKey(id);
    }

    @Override
    public List<T> listar() {
        return List.copyOf(itensPorId.values());
    }

    @Override
    public int quantidade() {
        return itensPorId.size();
    }
}
```

---

## O que essa implementação demonstra

A interface:

```java
Repositorio<ID, T>
```

continua genérica.

A implementação:

```java
RepositorioMapMemoria<ID, T>
```

também continua genérica.

Ela funciona com qualquer tipo de ID e qualquer tipo de entidade.

Internamente usa:

```java
Map<ID, T>
```

Isso é generics aplicado a estrutura real.

---

## App usando repositório genérico com OS

Crie:

```text
src\br\com\curso\aula173\app\RepositorioGenericoOsApp.java
```

Código:

```java
package br.com.curso.aula173.app;

import br.com.curso.aula173.contrato.Repositorio;
import br.com.curso.aula173.dominio.ordemservico.OrdemServicoGenerica;
import br.com.curso.aula173.dominio.ordemservico.StatusOs;
import br.com.curso.aula173.dominio.valor.CodigoOs;
import br.com.curso.aula173.infra.RepositorioMapMemoria;

import java.time.LocalDate;

public class RepositorioGenericoOsApp {
    public static void main(String[] args) {
        Repositorio<CodigoOs, OrdemServicoGenerica> repositorio = new RepositorioMapMemoria<>();

        OrdemServicoGenerica os = new OrdemServicoGenerica(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CADASTRADA
        );

        repositorio.salvar(os.codigo(), os);

        OrdemServicoGenerica encontrada = repositorio.buscarObrigatorio(new CodigoOs("os-2026-0001"));

        System.out.println("Encontrada:");
        System.out.println(encontrada.resumo());

        System.out.println();
        System.out.println("Quantidade: " + repositorio.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula173.app.RepositorioGenericoOsApp
```

---

## App usando repositório genérico com Cliente

Crie:

```text
src\br\com\curso\aula173\app\RepositorioGenericoClienteApp.java
```

Código:

```java
package br.com.curso.aula173.app;

import br.com.curso.aula173.contrato.Repositorio;
import br.com.curso.aula173.dominio.cliente.ClienteGenerico;
import br.com.curso.aula173.dominio.valor.CodigoCliente;
import br.com.curso.aula173.infra.RepositorioMapMemoria;

public class RepositorioGenericoClienteApp {
    public static void main(String[] args) {
        Repositorio<CodigoCliente, ClienteGenerico> repositorio = new RepositorioMapMemoria<>();

        ClienteGenerico cliente = new ClienteGenerico(
                new CodigoCliente("CLI-001"),
                "Empresa Modelo"
        );

        repositorio.salvar(cliente.codigo(), cliente);

        ClienteGenerico encontrado = repositorio.buscarObrigatorio(new CodigoCliente("cli-001"));

        System.out.println("Cliente encontrado:");
        System.out.println(encontrado.resumo());

        System.out.println();
        System.out.println("Quantidade: " + repositorio.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula173.app.RepositorioGenericoClienteApp
```

---

## Reutilização com segurança

A mesma implementação:

```java
RepositorioMapMemoria<ID, T>
```

foi usada para:

```java
Repositorio<CodigoOs, OrdemServicoGenerica>
Repositorio<CodigoCliente, ClienteGenerico>
```

Mas o compilador protege os tipos.

Você não consegue salvar `ClienteGenerico` em um repositório de `OrdemServicoGenerica`.

Isso é o valor de generics.

---

## Cuidado com generics genéricos demais

Este nome parece estranho, mas o problema é real.

Generics demais podem deixar o código difícil.

Exemplo exagerado:

```java
Processador<A, B, C, D, E, F>
```

Isso geralmente fica confuso.

Regra:

```text
use generics quando há reutilização real com segurança de tipo.
```

Não use generics apenas para parecer avançado.

---

## Interface genérica ResultadoConsulta<T>

Vamos criar outra interface genérica.

Crie:

```text
src\br\com\curso\aula173\contrato\ResultadoConsulta.java
```

Código:

```java
package br.com.curso.aula173.contrato;

public interface ResultadoConsulta<T> {
    boolean encontrado();

    String mensagem();

    T valor();
}
```

Agora crie a implementação:

```text
src\br\com\curso\aula173\infra\ResultadoConsultaSimples.java
```

Código:

```java
package br.com.curso.aula173.infra;

import br.com.curso.aula173.contrato.ResultadoConsulta;

public class ResultadoConsultaSimples<T> implements ResultadoConsulta<T> {
    private final boolean encontrado;
    private final String mensagem;
    private final T valor;

    private ResultadoConsultaSimples(boolean encontrado, String mensagem, T valor) {
        if (mensagem == null || mensagem.isBlank()) {
            throw new IllegalArgumentException("Mensagem é obrigatória.");
        }

        this.encontrado = encontrado;
        this.mensagem = mensagem;
        this.valor = valor;
    }

    public static <T> ResultadoConsultaSimples<T> encontrado(String mensagem, T valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor encontrado é obrigatório.");
        }

        return new ResultadoConsultaSimples<>(true, mensagem, valor);
    }

    public static <T> ResultadoConsultaSimples<T> naoEncontrado(String mensagem) {
        return new ResultadoConsultaSimples<>(false, mensagem, null);
    }

    @Override
    public boolean encontrado() {
        return encontrado;
    }

    @Override
    public String mensagem() {
        return mensagem;
    }

    @Override
    public T valor() {
        if (!encontrado) {
            throw new IllegalStateException("Consulta sem resultado não possui valor.");
        }

        return valor;
    }
}
```

---

## App usando ResultadoConsulta<T>

Crie:

```text
src\br\com\curso\aula173\app\ResultadoConsultaGenericoApp.java
```

Código:

```java
package br.com.curso.aula173.app;

import br.com.curso.aula173.contrato.ResultadoConsulta;
import br.com.curso.aula173.dominio.ordemservico.OrdemServicoGenerica;
import br.com.curso.aula173.dominio.ordemservico.StatusOs;
import br.com.curso.aula173.dominio.valor.CodigoOs;
import br.com.curso.aula173.infra.ResultadoConsultaSimples;

import java.time.LocalDate;

public class ResultadoConsultaGenericoApp {
    public static void main(String[] args) {
        OrdemServicoGenerica os = new OrdemServicoGenerica(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CADASTRADA
        );

        ResultadoConsulta<OrdemServicoGenerica> encontrada =
                ResultadoConsultaSimples.encontrado("OS encontrada.", os);

        ResultadoConsulta<OrdemServicoGenerica> naoEncontrada =
                ResultadoConsultaSimples.naoEncontrado("OS não encontrada.");

        imprimir(encontrada);
        imprimir(naoEncontrada);
    }

    private static void imprimir(ResultadoConsulta<OrdemServicoGenerica> resultado) {
        System.out.println(resultado.mensagem());

        if (resultado.encontrado()) {
            System.out.println(resultado.valor().resumo());
        }

        System.out.println();
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula173.app.ResultadoConsultaGenericoApp
```

---

## Generics em contratos de backend

O padrão:

```java
ResultadoConsulta<T>
```

aparece muito em formas reais como:

```java
ResponseEntity<T>
Optional<T>
Page<T>
ApiResponse<T>
Resultado<T>
```

A ideia é:

```text
a estrutura da resposta é comum;
o tipo do dado muda.
```

Exemplo:

```text
ApiResponse<ClienteResponse>
ApiResponse<OrdemServicoResponse>
ApiResponse<List<ProdutoResponse>>
```

Isso será aprofundado quando chegarmos em API.

---

## Quando criar interface genérica

Crie interface genérica quando:

```text
o contrato é igual para vários tipos;
o tipo concreto varia;
você quer segurança de tipo;
você quer reduzir duplicação real;
as implementações podem trabalhar com tipos diferentes.
```

Exemplos:

```text
Repositorio<ID, T>;
Validador<T>;
Conversor<E, S>;
ResultadoConsulta<T>;
PublicadorEvento<T>;
Processador<T>;
Serializador<T>.
```

---

## Quando não criar interface genérica

Evite quando:

```text
há apenas um tipo real;
a abstração fica vaga demais;
o código fica difícil de entender;
a interface não tem comportamento claro;
a regra específica some atrás de T.
```

Generics devem melhorar clareza.

Se piorarem, revise.

---

## Comparação com Object

### Com Object

```java
Object valor = repositorio.buscar(id);
OrdemServico os = (OrdemServico) valor;
```

Problemas:

```text
cast manual;
erro em runtime;
API vaga;
menos segurança.
```

### Com generics

```java
Repositorio<CodigoOs, OrdemServico> repositorio;
OrdemServico os = repositorio.buscarObrigatorio(codigo);
```

Vantagens:

```text
sem cast;
erro em compilação;
API clara;
tipo seguro.
```

---

## Ligação com Spring e arquitetura

Você ainda não entrou em Spring Boot, mas generics estão no coração do ecossistema.

Exemplos que você verá futuramente:

```java
JpaRepository<Cliente, Long>
JpaRepository<OrdemServico, UUID>
ResponseEntity<ClienteResponse>
ResponseEntity<List<OrdemServicoResponse>>
Page<ContratoResponse>
Optional<Usuario>
```

Se generics não estiverem claros, essas APIs parecem mágicas.

Depois desta base, elas começam a fazer sentido.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Classes genéricas

Execute:

```powershell
java -cp out br.com.curso.aula173.app.CaixaGenericaApp
java -cp out br.com.curso.aula173.app.ParGenericoApp
```

### Parte 2 — Interfaces genéricas simples

Execute:

```powershell
java -cp out br.com.curso.aula173.app.ValidadorStringApp
java -cp out br.com.curso.aula173.app.ValidadorNaoNuloGenericoApp
java -cp out br.com.curso.aula173.app.ConversorGenericoApp
```

### Parte 3 — Repositório genérico

Execute:

```powershell
java -cp out br.com.curso.aula173.app.RepositorioGenericoOsApp
java -cp out br.com.curso.aula173.app.RepositorioGenericoClienteApp
```

### Parte 4 — Resultado genérico

Execute:

```powershell
java -cp out br.com.curso.aula173.app.ResultadoConsultaGenericoApp
```

---

## Desafio prático

Crie uma interface genérica:

```text
src\br\com\curso\aula173\contrato\Processador.java
```

Ela deve ser:

```java
Processador<E, S>
```

Método:

```text
S processar(E entrada);
```

Depois crie:

```text
src\br\com\curso\aula173\infra\ProcessadorTextoResumo.java
```

Implementação:

```text
entrada String;
saída String;
se entrada for nula ou branca, lançar erro;
retornar texto trimado em maiúsculo.
```

Crie o app:

```text
src\br\com\curso\aula173\app\ProcessadorGenericoApp.java
```

Critério principal:

```text
usar interface genérica com entrada e saída.
```

---

## Desafio extra

Crie uma interface:

```text
src\br\com\curso\aula173\contrato\Identificador.java
```

Ela deve ser genérica:

```java
Identificador<ID>
```

Método:

```text
ID id();
```

Depois crie uma classe:

```text
src\br\com\curso\aula173\dominio\cliente\ClienteIdentificavel.java
```

Ela deve implementar:

```java
Identificador<CodigoCliente>
```

Depois crie uma classe:

```text
src\br\com\curso\aula173\infra\CadastroIdentificavelMemoria.java
```

Ela deve ser genérica:

```java
CadastroIdentificavelMemoria<ID, T>
```

Por enquanto, sem usar `extends`.

Receba o ID manualmente no método cadastrar:

```text
cadastrar(ID id, T item);
```

Métodos:

```text
buscarObrigatorio(ID id);
listar();
quantidade();
```

Critério principal:

```text
praticar ID e T com clareza.
```

Em aula futura, vamos melhorar isso com bounded types.

---

## Erros comuns nesta aula

### 1. Confundir T com classe real

`T` não é uma classe do sistema.

É um parâmetro de tipo.

### 2. Usar Object dentro de classe genérica sem necessidade

Se a classe é `Caixa<T>`, use `T`.

### 3. Implementar interface genérica sem definir tipo corretamente

Exemplo:

```java
implements Validador
```

Isso vira raw type.

Prefira:

```java
implements Validador<String>
```

ou:

```java
implements Validador<T>
```

### 4. Criar generics demais

Generics devem ajudar.

Não devem esconder a intenção.

### 5. Usar nomes ruins

`T`, `K`, `V` são aceitáveis.

Mas em alguns casos `ID` comunica melhor.

### 6. Achar que repositório genérico resolve tudo

Ele é útil didaticamente.

Em arquitetura real, cuidado para não esconder regras específicas.

### 7. Retornar coleção interna em implementação genérica

Mesmo em classes genéricas, proteja retorno.

### 8. Ignorar validação

Generics cuidam de tipo.

Não cuidam de regra de negócio.

---

## Debug recomendado

Use debug em:

```text
CaixaGenerica.java
ParGenerico.java
ValidadorTextoNaoBranco.java
ValidadorNaoNulo.java
ConversorTextoParaInteiro.java
RepositorioMapMemoria.java
ResultadoConsultaSimples.java
RepositorioGenericoOsApp.java
RepositorioGenericoClienteApp.java
ResultadoConsultaGenericoApp.java
```

Breakpoints recomendados:

```java
return valor

valido(...)

converter(...)

salvar(...)

itensPorId.put(...)

buscarObrigatorio(...)

List.copyOf(...)

ResultadoConsultaSimples.encontrado(...)

ResultadoConsultaSimples.naoEncontrado(...)
```

Observe:

```text
como o tipo T muda conforme o uso;
como ID muda conforme o repositório;
como o compilador evita misturar Cliente e OS;
como a interface genérica vira contrato seguro;
como implementação genérica reutiliza Map<ID, T>.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre classe genérica e interface genérica?
2. O que significa Repositorio<ID, T>?
3. Qual a diferença entre implements Validador<String> e implements Validador<T>?
4. Por que Conversor<E, S> tem dois tipos?
5. Por que generics aparecem tanto em frameworks Java?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar classe genérica com T;
criar classe genérica com K e V;
criar interface Validador<T>;
implementar Validador<String>;
implementar Validador<T>;
criar Conversor<E, S>;
implementar Conversor<String, Integer>;
criar Repositorio<ID, T>;
implementar RepositorioMapMemoria<ID, T>;
usar repositório genérico com OS;
usar repositório genérico com Cliente;
criar ResultadoConsulta<T>;
implementar ResultadoConsultaSimples<T>;
evitar raw types;
explicar ID, T, E, S, K e V;
resolver ProcessadorGenericoApp;
resolver desafio de Identificador e CadastroIdentificavelMemoria;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-173-classes-e-interfaces-genericas
git commit -m "Aula 173: classes e interfaces genericas"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
interfaces e classes genéricas permitem criar contratos reutilizáveis com segurança de tipo.
```

Você viu que generics ajudam a criar:

```text
validadores;
conversores;
repositórios;
resultados;
pares de valores;
caixas de valor.
```

Também viu que existem duas formas importantes de implementar interface genérica:

```text
com tipo fixo;
mantendo o tipo aberto.
```

Na próxima aula, vamos aprofundar métodos genéricos.

Vamos estudar métodos com `<T>`, `<E, S>`, retorno genérico, inferência de tipo e como criar utilitários genéricos sem cair em código abstrato demais.
