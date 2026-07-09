# 188 — M7.03 — Method Reference e Constructor Reference

## Objetivo da aula

Nesta aula você vai estudar um recurso que deixa lambdas mais limpas quando a lambda apenas chama um método já existente:

```text
Method Reference
```

E também quando a lambda apenas cria um objeto:

```text
Constructor Reference
```

Na aula anterior, você estudou:

```text
Predicate<T>
Function<T, R>
Consumer<T>
Supplier<T>
```

Agora vamos aprender uma forma mais expressiva de escrever algumas lambdas.

Exemplo com lambda:

```java
Function<String, String> normalizar = texto -> texto.trim();
```

Exemplo com method reference:

```java
Function<String, String> normalizar = String::trim;
```

Exemplo com lambda:

```java
Consumer<String> imprimir = texto -> System.out.println(texto);
```

Exemplo com method reference:

```java
Consumer<String> imprimir = System.out::println;
```

Ao final desta aula, você deve conseguir:

```text
entender o que é method reference;
entender o operador ::;
substituir lambdas simples por method references;
usar referência para método estático;
usar referência para método de instância de um objeto específico;
usar referência para método de instância de um tipo;
usar constructor reference;
usar Classe::new;
usar method reference com Predicate;
usar method reference com Function;
usar method reference com Consumer;
usar method reference com Supplier;
entender quando method reference melhora leitura;
entender quando lambda é melhor;
aplicar em exemplos de domínio backend.
```

---

## Ideia principal

Method reference é uma forma curta de dizer:

```text
use este método como implementação da functional interface.
```

Ele usa o operador:

```java
::
```

Exemplos:

```java
System.out::println
String::trim
String::toUpperCase
Integer::valueOf
Cliente::nome
Cliente::ativo
Cliente::resumo
Email::new
ArrayList::new
```

A regra principal é:

```text
method reference só funciona quando a assinatura do método combina com a functional interface.
```

---

## Lambda vs Method Reference

Lambda:

```java
texto -> texto.toUpperCase()
```

Method reference:

```java
String::toUpperCase
```

Lambda:

```java
cliente -> cliente.nome()
```

Method reference:

```java
Cliente::nome
```

Lambda:

```java
valor -> Integer.valueOf(valor)
```

Method reference:

```java
Integer::valueOf
```

Lambda:

```java
() -> new ArrayList<String>()
```

Constructor reference:

```java
ArrayList::new
```

---

## O que method reference não é

Method reference não é um recurso mágico.

Ele não muda a lógica.

Ele apenas deixa mais curto quando a lambda está chamando diretamente um método.

Se a lambda tem regra própria, validação, cálculo, if, mais de uma chamada ou transformação composta, a lambda pode ser melhor.

Exemplo onde lambda é melhor:

```java
cliente -> cliente != null && cliente.ativo()
```

Não force method reference quando a lambda expressa melhor a regra.

---

## Tipos principais de method reference

Existem quatro formas principais:

```text
1. Método estático:
Classe::metodoEstatico

2. Método de instância de um objeto específico:
objeto::metodo

3. Método de instância de um tipo:
Classe::metodo

4. Construtor:
Classe::new
```

Vamos praticar cada uma.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-188-method-reference-e-constructor-reference
cd labs\m7\aula-188-method-reference-e-constructor-reference
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula188
mkdir src\br\com\curso\aula188\app
mkdir src\br\com\curso\aula188\dominio
mkdir src\br\com\curso\aula188\dominio\valor
mkdir src\br\com\curso\aula188\dominio\cliente
mkdir src\br\com\curso\aula188\dominio\produto
mkdir src\br\com\curso\aula188\util
```

---

# Parte 1 — Primeiro method reference

## Exemplo com Consumer

Crie:

```text
src\br\com\curso\aula188\app\PrimeiroMethodReferenceApp.java
```

Código:

```java
package br.com.curso.aula188.app;

import java.util.function.Consumer;

public class PrimeiroMethodReferenceApp {
    public static void main(String[] args) {
        Consumer<String> imprimirComLambda = texto -> System.out.println(texto);
        Consumer<String> imprimirComReference = System.out::println;

        imprimirComLambda.accept("Imprimindo com lambda.");
        imprimirComReference.accept("Imprimindo com method reference.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula188.app.PrimeiroMethodReferenceApp
```

---

## Como ler System.out::println

```java
System.out::println
```

Significa:

```text
use o método println do objeto System.out.
```

Ele combina com:

```java
Consumer<String>
```

porque `Consumer<String>` espera:

```java
void accept(String valor)
```

e `println` pode receber uma `String` e não retornar nada.

---

## Assinatura precisa combinar

O Java verifica se a assinatura da referência combina com a functional interface.

Aqui:

```java
Consumer<String> imprimir = System.out::println;
```

combina porque:

```text
Consumer<String>:
recebe String e retorna void.

System.out.println(String):
recebe String e retorna void.
```

Se as assinaturas não combinarem, não compila.

---

# Parte 2 — Method reference com Function

## Exemplo com String::trim e String::toUpperCase

Crie:

```text
src\br\com\curso\aula188\app\FunctionMethodReferenceApp.java
```

Código:

```java
package br.com.curso.aula188.app;

import java.util.function.Function;

public class FunctionMethodReferenceApp {
    public static void main(String[] args) {
        Function<String, String> removerEspacos = String::trim;
        Function<String, String> maiusculo = String::toUpperCase;
        Function<String, Integer> tamanho = String::length;

        String texto = "  java backend  ";

        System.out.println("Original: [" + texto + "]");
        System.out.println("Trim: [" + removerEspacos.apply(texto) + "]");
        System.out.println("Maiúsculo: " + maiusculo.apply(texto));
        System.out.println("Tamanho: " + tamanho.apply(texto));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula188.app.FunctionMethodReferenceApp
```

---

## Como ler String::trim

```java
String::trim
```

Significa:

```text
para uma String recebida, chame trim nessa String.
```

Ele corresponde a:

```java
texto -> texto.trim()
```

O primeiro parâmetro da functional interface vira o objeto que recebe a chamada.

---

## Classe::metodoDeInstancia

Quando você escreve:

```java
String::trim
```

não está chamando `trim` imediatamente.

Você está dizendo:

```text
quando receber uma String, chame trim nela.
```

Equivalente:

```java
texto -> texto.trim()
```

Isso é método de instância de um tipo.

---

# Parte 3 — Method reference com Predicate

## Exemplo com String::isBlank

Crie:

```text
src\br\com\curso\aula188\app\PredicateMethodReferenceApp.java
```

Código:

```java
package br.com.curso.aula188.app;

import java.util.function.Predicate;

public class PredicateMethodReferenceApp {
    public static void main(String[] args) {
        Predicate<String> emBranco = String::isBlank;
        Predicate<String> naoEmBranco = emBranco.negate();

        System.out.println("Espaço em branco? " + emBranco.test("   "));
        System.out.println("Java em branco? " + emBranco.test("Java"));

        System.out.println("Java não em branco? " + naoEmBranco.test("Java"));
        System.out.println("Espaço não em branco? " + naoEmBranco.test("   "));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula188.app.PredicateMethodReferenceApp
```

---

## Atenção com null

Este código:

```java
Predicate<String> emBranco = String::isBlank;
```

equivale a:

```java
texto -> texto.isBlank()
```

Se você fizer:

```java
emBranco.test(null)
```

vai gerar `NullPointerException`.

Se existe chance de null, use lambda com validação:

```java
Predicate<String> textoValido = texto -> texto != null && !texto.isBlank();
```

Aqui a lambda é melhor que method reference.

---

# Parte 4 — Método estático

## Classe utilitária TextoUtil

Crie:

```text
src\br\com\curso\aula188\util\TextoUtil.java
```

Código:

```java
package br.com.curso.aula188.util;

public final class TextoUtil {
    private TextoUtil() {
    }

    public static boolean naoNuloNemBranco(String texto) {
        return texto != null && !texto.isBlank();
    }

    public static String normalizarNome(String texto) {
        if (texto == null || texto.isBlank()) {
            throw new IllegalArgumentException("Texto é obrigatório.");
        }

        String semEspacos = texto.trim();

        return semEspacos.substring(0, 1).toUpperCase()
                + semEspacos.substring(1).toLowerCase();
    }

    public static Integer tamanhoSeguro(String texto) {
        if (texto == null) {
            return 0;
        }

        return texto.length();
    }
}
```

---

## App com método estático

Crie:

```text
src\br\com\curso\aula188\app\StaticMethodReferenceApp.java
```

Código:

```java
package br.com.curso.aula188.app;

import br.com.curso.aula188.util.TextoUtil;

import java.util.function.Function;
import java.util.function.Predicate;

public class StaticMethodReferenceApp {
    public static void main(String[] args) {
        Predicate<String> textoValido = TextoUtil::naoNuloNemBranco;
        Function<String, String> normalizar = TextoUtil::normalizarNome;
        Function<String, Integer> tamanho = TextoUtil::tamanhoSeguro;

        System.out.println("Ana válido? " + textoValido.test("Ana"));
        System.out.println("Espaço válido? " + textoValido.test("   "));
        System.out.println("Normalizado: " + normalizar.apply("  aNA  "));
        System.out.println("Tamanho seguro null: " + tamanho.apply(null));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula188.app.StaticMethodReferenceApp
```

---

## Como ler TextoUtil::normalizarNome

```java
TextoUtil::normalizarNome
```

Significa:

```text
use o método estático normalizarNome da classe TextoUtil.
```

Equivalente:

```java
texto -> TextoUtil.normalizarNome(texto)
```

---

# Parte 5 — Método de instância de objeto específico

## Exemplo com objeto específico

Crie:

```text
src\br\com\curso\aula188\util\Prefixador.java
```

Código:

```java
package br.com.curso.aula188.util;

public class Prefixador {
    private final String prefixo;

    public Prefixador(String prefixo) {
        if (prefixo == null || prefixo.isBlank()) {
            throw new IllegalArgumentException("Prefixo é obrigatório.");
        }

        this.prefixo = prefixo.trim();
    }

    public String aplicar(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Valor é obrigatório.");
        }

        return prefixo + valor.trim();
    }
}
```

Crie:

```text
src\br\com\curso\aula188\app\ObjetoEspecificoMethodReferenceApp.java
```

Código:

```java
package br.com.curso.aula188.app;

import br.com.curso.aula188.util.Prefixador;

import java.util.function.Function;

public class ObjetoEspecificoMethodReferenceApp {
    public static void main(String[] args) {
        Prefixador prefixadorCliente = new Prefixador("CLIENTE: ");
        Prefixador prefixadorProduto = new Prefixador("PRODUTO: ");

        Function<String, String> prefixarCliente = prefixadorCliente::aplicar;
        Function<String, String> prefixarProduto = prefixadorProduto::aplicar;

        System.out.println(prefixarCliente.apply("Ana Silva"));
        System.out.println(prefixarProduto.apply("Notebook"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula188.app.ObjetoEspecificoMethodReferenceApp
```

---

## Como ler prefixadorCliente::aplicar

```java
prefixadorCliente::aplicar
```

Significa:

```text
use o método aplicar deste objeto específico.
```

Não é qualquer `Prefixador`.

É aquele objeto:

```java
prefixadorCliente
```

Equivalente:

```java
valor -> prefixadorCliente.aplicar(valor)
```

---

# Parte 6 — Constructor Reference

## O que é Constructor Reference

Constructor reference é uma referência para construtor.

Exemplos:

```java
ArrayList::new
Email::new
Cliente::new
Produto::new
```

Ele funciona quando a assinatura do construtor combina com a functional interface.

---

## Constructor reference com Supplier

Crie:

```text
src\br\com\curso\aula188\app\SupplierConstructorReferenceApp.java
```

Código:

```java
package br.com.curso.aula188.app;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

public class SupplierConstructorReferenceApp {
    public static void main(String[] args) {
        Supplier<List<String>> criarListaComLambda = () -> new ArrayList<>();
        Supplier<List<String>> criarListaComReference = ArrayList::new;

        List<String> nomes = criarListaComLambda.get();
        nomes.add("Ana");

        List<String> outrosNomes = criarListaComReference.get();
        outrosNomes.add("Carlos");

        System.out.println(nomes);
        System.out.println(outrosNomes);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula188.app.SupplierConstructorReferenceApp
```

---

## Como ler ArrayList::new

```java
ArrayList::new
```

Significa:

```text
use o construtor de ArrayList.
```

Como `Supplier<List<String>>` não recebe nada e retorna `List<String>`, ele combina com o construtor sem argumentos de `ArrayList`.

---

# Parte 7 — Domínio backend com constructor reference

## Email

Crie:

```text
src\br\com\curso\aula188\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula188.dominio.valor;

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
src\br\com\curso\aula188\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula188.dominio.cliente;

import br.com.curso.aula188.dominio.valor.Email;

public class Cliente {
    private final Email email;
    private final String nome;
    private final boolean ativo;

    public Cliente(Email email, String nome, boolean ativo) {
        if (email == null) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        this.email = email;
        this.nome = nome.trim();
        this.ativo = ativo;
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

    public String resumo() {
        return nome + " | " + email.resumo() + " | Ativo: " + ativo;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## ClienteFactory

Para criar cliente com três parâmetros, vamos criar uma functional interface própria.

Crie:

```text
src\br\com\curso\aula188\dominio\cliente\ClienteFactory.java
```

Código:

```java
package br.com.curso.aula188.dominio.cliente;

import br.com.curso.aula188.dominio.valor.Email;

@FunctionalInterface
public interface ClienteFactory {
    Cliente criar(Email email, String nome, boolean ativo);
}
```

---

## App com constructor reference em domínio

Crie:

```text
src\br\com\curso\aula188\app\DominioConstructorReferenceApp.java
```

Código:

```java
package br.com.curso.aula188.app;

import br.com.curso.aula188.dominio.cliente.Cliente;
import br.com.curso.aula188.dominio.cliente.ClienteFactory;
import br.com.curso.aula188.dominio.valor.Email;

import java.util.function.Function;

public class DominioConstructorReferenceApp {
    public static void main(String[] args) {
        Function<String, Email> criarEmail = Email::new;
        ClienteFactory criarCliente = Cliente::new;

        Email email = criarEmail.apply("ANA@EMPRESA.COM");

        Cliente cliente = criarCliente.criar(
                email,
                "Ana Silva",
                true
        );

        System.out.println(email.resumo());
        System.out.println(cliente.resumo());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula188.app.DominioConstructorReferenceApp
```

---

## Por que criamos ClienteFactory

O Java tem interfaces prontas para um, dois e alguns tipos primitivos.

Exemplo:

```java
Function<T, R>
BiFunction<T, U, R>
Supplier<T>
```

Mas `Cliente` tem três parâmetros no construtor:

```java
Email, String, boolean
```

Não existe uma `TriFunction` padrão no Java.

Por isso criamos uma functional interface específica:

```java
ClienteFactory
```

Isso é aceitável quando o nome melhora a intenção.

---

# Parte 8 — Method reference com domínio

## App com Cliente::nome, Cliente::ativo e Cliente::resumo

Crie:

```text
src\br\com\curso\aula188\app\ClienteMethodReferenceApp.java
```

Código:

```java
package br.com.curso.aula188.app;

import br.com.curso.aula188.dominio.cliente.Cliente;
import br.com.curso.aula188.dominio.valor.Email;

import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

public class ClienteMethodReferenceApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", false),
                new Cliente(new Email("maria@empresa.com"), "Maria Oliveira", true)
        );

        Predicate<Cliente> ativo = Cliente::ativo;
        Function<Cliente, String> extrairNome = Cliente::nome;
        Function<Cliente, String> gerarResumo = Cliente::resumo;
        Consumer<String> imprimir = System.out::println;

        for (Cliente cliente : clientes) {
            if (ativo.test(cliente)) {
                imprimir.accept(extrairNome.apply(cliente));
                imprimir.accept(gerarResumo.apply(cliente));
                imprimir.accept("");
            }
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula188.app.ClienteMethodReferenceApp
```

---

## Como ler Cliente::ativo

```java
Cliente::ativo
```

Equivale a:

```java
cliente -> cliente.ativo()
```

A functional interface é:

```java
Predicate<Cliente>
```

porque:

```text
recebe Cliente;
retorna boolean.
```

---

## Como ler Cliente::nome

```java
Cliente::nome
```

Equivale a:

```java
cliente -> cliente.nome()
```

A functional interface é:

```java
Function<Cliente, String>
```

porque:

```text
recebe Cliente;
retorna String.
```

---

## Como ler Cliente::resumo

```java
Cliente::resumo
```

Equivale a:

```java
cliente -> cliente.resumo()
```

A functional interface é:

```java
Function<Cliente, String>
```

porque:

```text
recebe Cliente;
retorna String.
```

---

# Parte 9 — Utilitário de lista com method reference

## ListaFuncionalUtil

Crie:

```text
src\br\com\curso\aula188\util\ListaFuncionalUtil.java
```

Código:

```java
package br.com.curso.aula188.util;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

public final class ListaFuncionalUtil {
    private ListaFuncionalUtil() {
    }

    public static <T> void paraCada(List<T> itens, Consumer<? super T> consumer) {
        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        if (consumer == null) {
            throw new IllegalArgumentException("Consumer é obrigatório.");
        }

        for (T item : itens) {
            consumer.accept(item);
        }
    }

    public static <T> List<T> filtrar(List<T> itens, Predicate<? super T> predicate) {
        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        if (predicate == null) {
            throw new IllegalArgumentException("Predicate é obrigatório.");
        }

        List<T> filtrados = new ArrayList<>();

        for (T item : itens) {
            if (predicate.test(item)) {
                filtrados.add(item);
            }
        }

        return List.copyOf(filtrados);
    }

    public static <T, R> List<R> mapear(List<T> itens, Function<? super T, ? extends R> function) {
        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        if (function == null) {
            throw new IllegalArgumentException("Function é obrigatória.");
        }

        List<R> resultados = new ArrayList<>();

        for (T item : itens) {
            R resultado = function.apply(item);

            if (resultado == null) {
                throw new IllegalStateException("Function retornou null.");
            }

            resultados.add(resultado);
        }

        return List.copyOf(resultados);
    }
}
```

---

## App usando utilitário

Crie:

```text
src\br\com\curso\aula188\app\ListaComMethodReferenceApp.java
```

Código:

```java
package br.com.curso.aula188.app;

import br.com.curso.aula188.dominio.cliente.Cliente;
import br.com.curso.aula188.dominio.valor.Email;
import br.com.curso.aula188.util.ListaFuncionalUtil;

import java.util.List;

public class ListaComMethodReferenceApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", false),
                new Cliente(new Email("maria@empresa.com"), "Maria Oliveira", true)
        );

        List<Cliente> ativos = ListaFuncionalUtil.filtrar(clientes, Cliente::ativo);

        List<String> resumos = ListaFuncionalUtil.mapear(ativos, Cliente::resumo);

        ListaFuncionalUtil.paraCada(resumos, System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula188.app.ListaComMethodReferenceApp
```

---

## O que este app prepara

Este código:

```java
List<Cliente> ativos = ListaFuncionalUtil.filtrar(clientes, Cliente::ativo);

List<String> resumos = ListaFuncionalUtil.mapear(ativos, Cliente::resumo);

ListaFuncionalUtil.paraCada(resumos, System.out::println);
```

é muito parecido com o que veremos em Streams:

```java
clientes.stream()
        .filter(Cliente::ativo)
        .map(Cliente::resumo)
        .forEach(System.out::println);
```

A aula está preparando o terreno.

---

# Parte 10 — Quando usar lambda e quando usar method reference

## Use method reference quando

Use quando a lambda apenas chama um método existente.

Bom:

```java
Cliente::ativo
Cliente::nome
Cliente::resumo
String::trim
String::toUpperCase
Integer::valueOf
System.out::println
Email::new
ArrayList::new
```

Exemplo:

```java
clientes.forEach(System.out::println);
```

---

## Use lambda quando

Use lambda quando a regra tem lógica própria.

Bom:

```java
cliente -> cliente != null && cliente.ativo()
```

Bom:

```java
pedido -> pedido.valor().compareTo(new BigDecimal("1000.00")) > 0
```

Bom:

```java
texto -> texto != null && !texto.isBlank()
```

Bom:

```java
produto -> produto.ativo() && produto.preco().compareTo(BigDecimal.ZERO) > 0
```

---

## Não force method reference

Nem sempre method reference é mais claro.

Compare:

```java
Predicate<String> valido = TextoUtil::naoNuloNemBranco;
```

com:

```java
Predicate<String> valido = texto -> texto != null && !texto.isBlank();
```

Os dois são bons.

Se `TextoUtil::naoNuloNemBranco` tiver nome claro, method reference melhora.

Se você precisar abrir a classe utilitária para entender uma regra simples, a lambda pode ser mais direta.

A decisão é leitura.

---

## Regra profissional

```text
Method reference é bom quando reduz ruído sem esconder intenção.
```

Se esconder regra, piorou.

Se deixar mais claro, melhorou.

---

# Parte 11 — Erros comuns

## 1. Achar que method reference executa imediatamente

Isto:

```java
Consumer<String> imprimir = System.out::println;
```

não imprime nada na hora.

A impressão acontece quando você chama:

```java
imprimir.accept("texto");
```

---

## 2. Usar method reference quando precisa de validação

Isto pode quebrar com null:

```java
Predicate<String> emBranco = String::isBlank;
```

Se null for possível:

```java
Predicate<String> valido = texto -> texto != null && !texto.isBlank();
```

---

## 3. Forçar method reference em lógica complexa

Errado:

```text
criar método artificial só para encaixar method reference.
```

Se a lambda é mais clara, use lambda.

---

## 4. Não entender a assinatura

Method reference precisa combinar com a functional interface.

Exemplo:

```java
Function<String, Integer> tamanho = String::length;
```

Combina porque:

```text
String -> Integer
```

---

## 5. Confundir método estático com método de instância

Estático:

```java
Integer::valueOf
```

Instância de tipo:

```java
String::trim
```

Instância de objeto específico:

```java
System.out::println
```

---

## 6. Criar functional interface própria sem necessidade

Use as interfaces padrão quando fizer sentido:

```text
Predicate;
Function;
Consumer;
Supplier;
BiFunction.
```

Crie própria quando o nome de domínio ou a quantidade de parâmetros justificar.

---

# Parte 12 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula188.app.PrimeiroMethodReferenceApp
java -cp out br.com.curso.aula188.app.FunctionMethodReferenceApp
java -cp out br.com.curso.aula188.app.PredicateMethodReferenceApp
java -cp out br.com.curso.aula188.app.StaticMethodReferenceApp
java -cp out br.com.curso.aula188.app.ObjetoEspecificoMethodReferenceApp
java -cp out br.com.curso.aula188.app.SupplierConstructorReferenceApp
java -cp out br.com.curso.aula188.app.DominioConstructorReferenceApp
java -cp out br.com.curso.aula188.app.ClienteMethodReferenceApp
java -cp out br.com.curso.aula188.app.ListaComMethodReferenceApp
```

Para cada execução, responda:

```text
qual functional interface foi usada?
qual method reference foi usado?
a referência aponta para método estático, instância ou construtor?
qual seria a lambda equivalente?
a assinatura combinou com qual método abstrato?
```

---

# Parte 13 — Desafio prático

Crie uma entidade:

```text
src\br\com\curso\aula188\dominio\produto\Produto.java
```

Campos:

```text
String sku;
String nome;
BigDecimal preco;
boolean ativo;
```

Métodos:

```text
sku();
nome();
preco();
ativo();
resumo();
```

Crie app:

```text
src\br\com\curso\aula188\app\ProdutoMethodReferenceApp.java
```

Use:

```text
Predicate<Produto> ativo = Produto::ativo;
Function<Produto, String> resumo = Produto::resumo;
Function<Produto, String> nome = Produto::nome;
Consumer<String> imprimir = System.out::println;
```

Fluxo:

```text
criar lista de produtos;
filtrar ativos com ListaFuncionalUtil.filtrar;
mapear para resumo com ListaFuncionalUtil.mapear;
imprimir com ListaFuncionalUtil.paraCada.
```

Critério principal:

```text
usar method reference onde a lambda seria apenas chamada direta de método.
```

---

## Desafio extra

Crie objeto de valor:

```text
src\br\com\curso\aula188\dominio\valor\Sku.java
```

Construtor:

```text
Sku(String valor)
```

Crie:

```text
src\br\com\curso\aula188\dominio\produto\ProdutoFactory.java
```

Functional interface:

```java
Produto criar(Sku sku, String nome, BigDecimal preco, boolean ativo);
```

Crie app:

```text
src\br\com\curso\aula188\app\ProdutoConstructorReferenceApp.java
```

Use:

```java
Function<String, Sku> criarSku = Sku::new;
ProdutoFactory criarProduto = Produto::new;
```

Critério principal:

```text
entender constructor reference com um parâmetro e com vários parâmetros usando interface própria.
```

---

# Parte 14 — Debug recomendado

Coloque breakpoints em:

```text
FunctionMethodReferenceApp
PredicateMethodReferenceApp
StaticMethodReferenceApp
ObjetoEspecificoMethodReferenceApp
SupplierConstructorReferenceApp
DominioConstructorReferenceApp
ListaFuncionalUtil.filtrar
ListaFuncionalUtil.mapear
ListaFuncionalUtil.paraCada
```

Observe:

```text
quando a referência é criada;
quando ela é executada;
qual método real é chamado;
qual valor entra;
qual valor sai;
como o método abstrato da functional interface se conecta com o método referenciado.
```

Pontos de atenção:

```java
consumer.accept(...)
function.apply(...)
predicate.test(...)
supplier.get(...)
```

Esses pontos disparam a execução real.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é method reference?
2. O que significa o operador ::?
3. Quando usar Classe::metodo?
4. Quando usar objeto::metodo?
5. Quando lambda é melhor que method reference?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar System.out::println;
usar String::trim;
usar String::toUpperCase;
usar String::length;
usar String::isBlank;
usar método estático com Classe::metodo;
usar método de objeto específico com objeto::metodo;
usar método de instância de tipo com Classe::metodo;
usar construtor com Classe::new;
usar Email::new;
usar ArrayList::new;
criar functional interface factory quando necessário;
usar method reference com Predicate;
usar method reference com Function;
usar method reference com Consumer;
usar method reference com Supplier;
explicar lambda equivalente;
decidir quando method reference melhora leitura;
resolver ProdutoMethodReferenceApp;
resolver ProdutoConstructorReferenceApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-188-method-reference-e-constructor-reference
git commit -m "Aula 188: method reference e constructor reference"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
method reference é uma forma mais direta de escrever lambdas que apenas chamam métodos existentes.
```

Você viu:

```text
System.out::println;
String::trim;
String::toUpperCase;
String::length;
String::isBlank;
TextoUtil::normalizarNome;
prefixador::aplicar;
ArrayList::new;
Email::new;
Cliente::new.
```

Também aprendeu que method reference não deve ser forçado.

A regra é:

```text
se melhora leitura, use;
se esconde intenção, mantenha lambda.
```

Na próxima aula, vamos aprofundar composição funcional.

Vamos trabalhar mais com:

```text
Predicate.and;
Predicate.or;
Predicate.negate;
Function.andThen;
Function.compose;
Consumer.andThen;
pipelines pequenos;
validações combinadas;
transformações encadeadas.
```

Esse assunto prepara diretamente o caminho para Streams.
