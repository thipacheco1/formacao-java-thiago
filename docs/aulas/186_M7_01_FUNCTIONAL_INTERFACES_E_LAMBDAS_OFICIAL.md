# 186 — M7.01 — Functional Interfaces e Lambdas

## Objetivo da aula

Nesta aula iniciamos o Módulo 7.

O Módulo 7 será dedicado a uma virada importante no Java moderno:

```text
programação funcional aplicada ao Java backend.
```

Isso não significa abandonar orientação a objetos.

Significa aprender recursos que permitem escrever código mais expressivo para:

```text
filtrar;
mapear;
validar;
processar listas;
criar regras reutilizáveis;
reduzir código repetitivo;
trabalhar com Streams;
trabalhar melhor com Optional;
usar APIs modernas do Java;
entender melhor frameworks.
```

O primeiro passo é entender:

```text
Functional Interfaces
```

e:

```text
Lambdas
```

Ao final desta aula, você deve conseguir:

```text
entender o que é uma functional interface;
entender o que é uma lambda;
criar sua própria interface funcional;
usar @FunctionalInterface;
substituir classe anônima por lambda;
entender assinatura da lambda;
entender parâmetros e retorno;
entender lambdas com bloco;
entender lambdas de uma linha;
usar comportamento como argumento;
criar validadores flexíveis;
criar processadores simples;
entender a ligação com Generics;
preparar a base para Predicate, Function, Consumer e Supplier.
```

---

## Por que este módulo vem depois de Generics

No módulo anterior, você estudou:

```java
Optional<T>
Resultado<T>
Repositorio<ID, T>
Mapper<IN, OUT>
Supplier<T>
Comparator<? super T>
```

Agora esses tipos começarão a aparecer de forma natural.

Functional Interfaces usam Generics o tempo todo.

Exemplos reais:

```java
Predicate<T>
Function<T, R>
Consumer<T>
Supplier<T>
Comparator<T>
```

Sem entender Generics, essas assinaturas parecem estranhas.

Com Generics, elas começam a fazer sentido.

---

## Ideia principal

Uma lambda permite passar comportamento como valor.

Antes, quando você queria variar um comportamento, muitas vezes precisava criar uma classe.

Exemplo conceitual:

```text
validar texto não vazio;
validar número positivo;
validar cliente ativo;
validar pedido aberto;
validar produto disponível.
```

Todos são comportamentos.

Com lambdas, você pode passar essas regras para métodos.

Exemplo:

```java
validar("Ana", valor -> valor != null && !valor.isBlank());
```

Esse trecho:

```java
valor -> valor != null && !valor.isBlank()
```

é uma lambda.

---

## O que é uma Functional Interface

Functional Interface é uma interface que possui apenas um método abstrato.

Exemplo:

```java
public interface ValidadorTexto {
    boolean validar(String valor);
}
```

Ela tem um único método abstrato:

```java
validar
```

Por isso pode ser implementada com lambda.

---

## @FunctionalInterface

Você pode marcar uma interface funcional com:

```java
@FunctionalInterface
```

Exemplo:

```java
@FunctionalInterface
public interface ValidadorTexto {
    boolean validar(String valor);
}
```

Essa anotação não é obrigatória, mas é uma boa prática.

Ela faz o compilador proteger sua intenção.

Se alguém adicionar outro método abstrato, o código deixa de compilar.

---

## O que é uma lambda

Lambda é uma forma curta de implementar uma functional interface.

Exemplo:

```java
ValidadorTexto validador = valor -> valor != null && !valor.isBlank();
```

Ela implementa o método:

```java
boolean validar(String valor);
```

A parte:

```java
valor -> valor != null && !valor.isBlank()
```

significa:

```text
receba valor;
retorne se valor não é null e não é branco.
```

---

## Sintaxe básica de lambda

Forma geral:

```java
parametros -> expressao
```

Exemplos:

```java
valor -> valor != null

numero -> numero > 0

cliente -> cliente.ativo()

() -> "valor gerado"

(a, b) -> a + b
```

Com bloco:

```java
valor -> {
    String normalizado = valor.trim();
    return normalizado.length() >= 3;
}
```

Quando há bloco, você usa `return` se o método precisa retornar valor.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-186-functional-interfaces-e-lambdas
cd labs\m7\aula-186-functional-interfaces-e-lambdas
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula186
mkdir src\br\com\curso\aula186\app
mkdir src\br\com\curso\aula186\contrato
mkdir src\br\com\curso\aula186\dominio
mkdir src\br\com\curso\aula186\dominio\valor
mkdir src\br\com\curso\aula186\dominio\cliente
mkdir src\br\com\curso\aula186\dominio\pedido
mkdir src\br\com\curso\aula186\util
```

---

# Parte 1 — Primeira functional interface

## ValidadorTexto

Crie:

```text
src\br\com\curso\aula186\contrato\ValidadorTexto.java
```

Código:

```java
package br.com.curso.aula186.contrato;

@FunctionalInterface
public interface ValidadorTexto {
    boolean validar(String valor);
}
```

---

## Primeiro app com lambda

Crie:

```text
src\br\com\curso\aula186\app\PrimeiraLambdaApp.java
```

Código:

```java
package br.com.curso.aula186.app;

import br.com.curso.aula186.contrato.ValidadorTexto;

public class PrimeiraLambdaApp {
    public static void main(String[] args) {
        ValidadorTexto naoBranco = valor -> valor != null && !valor.isBlank();

        System.out.println("Ana válido? " + naoBranco.validar("Ana"));
        System.out.println("Espaço válido? " + naoBranco.validar("   "));
        System.out.println("Null válido? " + naoBranco.validar(null));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula186.app.PrimeiraLambdaApp
```

---

## O que aconteceu

A interface:

```java
ValidadorTexto
```

possui um método:

```java
boolean validar(String valor);
```

A lambda:

```java
valor -> valor != null && !valor.isBlank()
```

implementa esse método.

O Java entende o tipo porque a variável tem tipo:

```java
ValidadorTexto
```

Isso é chamado de:

```text
inferência de tipo.
```

---

## Antes da lambda: classe anônima

Antes de lambdas, era comum escrever:

```java
ValidadorTexto validador = new ValidadorTexto() {
    @Override
    public boolean validar(String valor) {
        return valor != null && !valor.isBlank();
    }
};
```

Com lambda:

```java
ValidadorTexto validador = valor -> valor != null && !valor.isBlank();
```

O comportamento é equivalente.

A lambda reduz ruído.

---

## App comparando classe anônima e lambda

Crie:

```text
src\br\com\curso\aula186\app\ClasseAnonimaVsLambdaApp.java
```

Código:

```java
package br.com.curso.aula186.app;

import br.com.curso.aula186.contrato.ValidadorTexto;

public class ClasseAnonimaVsLambdaApp {
    public static void main(String[] args) {
        ValidadorTexto usandoClasseAnonima = new ValidadorTexto() {
            @Override
            public boolean validar(String valor) {
                return valor != null && !valor.isBlank();
            }
        };

        ValidadorTexto usandoLambda = valor -> valor != null && !valor.isBlank();

        System.out.println("Classe anônima: " + usandoClasseAnonima.validar("Ana"));
        System.out.println("Lambda: " + usandoLambda.validar("Ana"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula186.app.ClasseAnonimaVsLambdaApp
```

---

## Por que lambdas existem

Lambdas reduzem código repetitivo quando a intenção é passar comportamento.

A lambda deixa o foco na regra:

```java
valor -> valor != null && !valor.isBlank()
```

Em vez de obrigar você a escrever toda a estrutura:

```java
new Interface() {
    @Override
    public ...
}
```

Isso será essencial para Streams.

---

# Parte 2 — Lambdas com e sem retorno

## Interface para transformar texto

Crie:

```text
src\br\com\curso\aula186\contrato\TransformadorTexto.java
```

Código:

```java
package br.com.curso.aula186.contrato;

@FunctionalInterface
public interface TransformadorTexto {
    String transformar(String valor);
}
```

---

## App com lambda de retorno

Crie:

```text
src\br\com\curso\aula186\app\LambdaComRetornoApp.java
```

Código:

```java
package br.com.curso.aula186.app;

import br.com.curso.aula186.contrato.TransformadorTexto;

public class LambdaComRetornoApp {
    public static void main(String[] args) {
        TransformadorTexto maiusculo = valor -> valor.toUpperCase();
        TransformadorTexto minusculo = valor -> valor.toLowerCase();
        TransformadorTexto semEspacos = valor -> valor.trim();

        System.out.println(maiusculo.transformar("java"));
        System.out.println(minusculo.transformar("BACKEND"));
        System.out.println("[" + semEspacos.transformar("  Ana  ") + "]");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula186.app.LambdaComRetornoApp
```

---

## Lambda de uma linha

Quando a lambda tem uma expressão simples:

```java
valor -> valor.toUpperCase()
```

não precisa escrever:

```java
return
```

O retorno é implícito.

---

## Lambda com bloco

Crie:

```text
src\br\com\curso\aula186\app\LambdaComBlocoApp.java
```

Código:

```java
package br.com.curso.aula186.app;

import br.com.curso.aula186.contrato.TransformadorTexto;

public class LambdaComBlocoApp {
    public static void main(String[] args) {
        TransformadorTexto normalizarNome = valor -> {
            if (valor == null || valor.isBlank()) {
                throw new IllegalArgumentException("Nome é obrigatório.");
            }

            String semEspacos = valor.trim();
            return semEspacos.substring(0, 1).toUpperCase()
                    + semEspacos.substring(1).toLowerCase();
        };

        System.out.println(normalizarNome.transformar("  aNA  "));
        System.out.println(normalizarNome.transformar("  CARLOS  "));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula186.app.LambdaComBlocoApp
```

---

## Quando usar bloco

Use bloco quando a regra precisa de mais de uma linha:

```text
validação;
normalização;
variáveis intermediárias;
tratamento simples;
retorno calculado.
```

Mas se a lambda ficar grande demais, prefira extrair para método.

Lambdas longas dificultam leitura.

---

# Parte 3 — Functional interface genérica

Agora vamos conectar lambdas com Generics.

Em vez de criar só:

```java
ValidadorTexto
```

podemos criar:

```java
Validador<T>
```

---

## Validador<T>

Crie:

```text
src\br\com\curso\aula186\contrato\Validador.java
```

Código:

```java
package br.com.curso.aula186.contrato;

@FunctionalInterface
public interface Validador<T> {
    boolean validar(T valor);
}
```

---

## App usando Validador<T>

Crie:

```text
src\br\com\curso\aula186\app\ValidadorGenericoApp.java
```

Código:

```java
package br.com.curso.aula186.app;

import br.com.curso.aula186.contrato.Validador;

public class ValidadorGenericoApp {
    public static void main(String[] args) {
        Validador<String> textoNaoBranco = valor -> valor != null && !valor.isBlank();
        Validador<Integer> numeroPositivo = numero -> numero != null && numero > 0;
        Validador<Double> percentualValido = valor -> valor != null && valor >= 0.0 && valor <= 100.0;

        System.out.println("Texto válido? " + textoNaoBranco.validar("Ana"));
        System.out.println("Número positivo? " + numeroPositivo.validar(10));
        System.out.println("Percentual válido? " + percentualValido.validar(75.5));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula186.app.ValidadorGenericoApp
```

---

## O que mudou

Antes:

```java
ValidadorTexto
```

validava apenas `String`.

Agora:

```java
Validador<T>
```

pode validar:

```text
String;
Integer;
Double;
Cliente;
Pedido;
Produto;
OrdemServico.
```

Esse é o encontro entre:

```text
Generics + Functional Interface + Lambda.
```

---

## Quando criar interface genérica

Crie interface genérica quando:

```text
o comportamento é o mesmo;
o tipo muda;
o contrato continua claro.
```

Exemplo:

```java
Validador<T>
Conversor<IN, OUT>
Processador<T>
Gerador<T>
```

Não crie interface genérica só para parecer avançado.

---

# Parte 4 — Passando comportamento como argumento

Agora vamos criar um método que recebe uma regra.

## ValidadorUtil

Crie:

```text
src\br\com\curso\aula186\util\ValidadorUtil.java
```

Código:

```java
package br.com.curso.aula186.util;

import br.com.curso.aula186.contrato.Validador;

public final class ValidadorUtil {
    private ValidadorUtil() {
    }

    public static <T> void validarObrigatorio(T valor, Validador<T> validador, String mensagemErro) {
        if (validador == null) {
            throw new IllegalArgumentException("Validador é obrigatório.");
        }

        if (mensagemErro == null || mensagemErro.isBlank()) {
            throw new IllegalArgumentException("Mensagem de erro é obrigatória.");
        }

        if (!validador.validar(valor)) {
            throw new IllegalArgumentException(mensagemErro);
        }
    }
}
```

---

## App passando lambda para método

Crie:

```text
src\br\com\curso\aula186\app\ComportamentoComoArgumentoApp.java
```

Código:

```java
package br.com.curso.aula186.app;

import br.com.curso.aula186.util.ValidadorUtil;

public class ComportamentoComoArgumentoApp {
    public static void main(String[] args) {
        ValidadorUtil.validarObrigatorio(
                "Ana",
                valor -> valor != null && !valor.isBlank(),
                "Nome é obrigatório."
        );

        ValidadorUtil.validarObrigatorio(
                10,
                numero -> numero != null && numero > 0,
                "Número deve ser positivo."
        );

        System.out.println("Validações executadas com sucesso.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula186.app.ComportamentoComoArgumentoApp
```

---

## O que este exemplo ensina

O método:

```java
validarObrigatorio
```

não sabe a regra concreta.

Ele recebe a regra:

```java
valor -> valor != null && !valor.isBlank()
```

ou:

```java
numero -> numero != null && numero > 0
```

Isso permite reutilizar o fluxo e variar o comportamento.

Esse padrão aparece muito em Java moderno.

---

# Parte 5 — Conversor com IN e OUT

Vamos criar uma interface funcional que converte um tipo em outro.

## Conversor<IN, OUT>

Crie:

```text
src\br\com\curso\aula186\contrato\Conversor.java
```

Código:

```java
package br.com.curso.aula186.contrato;

@FunctionalInterface
public interface Conversor<IN, OUT> {
    OUT converter(IN entrada);
}
```

---

## App de conversor

Crie:

```text
src\br\com\curso\aula186\app\ConversorLambdaApp.java
```

Código:

```java
package br.com.curso.aula186.app;

import br.com.curso.aula186.contrato.Conversor;

public class ConversorLambdaApp {
    public static void main(String[] args) {
        Conversor<String, Integer> textoParaNumero = texto -> Integer.valueOf(texto.trim());
        Conversor<Integer, String> numeroParaTexto = numero -> "Número: " + numero;
        Conversor<String, String> normalizarTexto = texto -> texto.trim().toUpperCase();

        Integer numero = textoParaNumero.converter(" 123 ");
        String texto = numeroParaTexto.converter(numero);
        String normalizado = normalizarTexto.converter("  java backend  ");

        System.out.println(numero);
        System.out.println(texto);
        System.out.println(normalizado);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula186.app.ConversorLambdaApp
```

---

## Como ler Conversor<IN, OUT>

```java
Conversor<String, Integer>
```

Significa:

```text
entrada String;
saída Integer.
```

```java
Conversor<Integer, String>
```

Significa:

```text
entrada Integer;
saída String.
```

Esse padrão será equivalente ao que o Java já oferece com:

```java
Function<T, R>
```

Na próxima aula, vamos estudar as interfaces funcionais prontas do Java.

---

# Parte 6 — Domínio para exemplos de backend

Agora vamos trazer o assunto para um domínio simples.

## Email

Crie:

```text
src\br\com\curso\aula186\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula186.dominio.valor;

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
src\br\com\curso\aula186\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula186.dominio.cliente;

import br.com.curso.aula186.dominio.valor.Email;

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
}
```

---

## Validador de cliente com lambda

Crie:

```text
src\br\com\curso\aula186\app\ValidadorClienteLambdaApp.java
```

Código:

```java
package br.com.curso.aula186.app;

import br.com.curso.aula186.contrato.Validador;
import br.com.curso.aula186.dominio.cliente.Cliente;
import br.com.curso.aula186.dominio.valor.Email;

public class ValidadorClienteLambdaApp {
    public static void main(String[] args) {
        Cliente ana = new Cliente(new Email("ana@empresa.com"), "Ana Silva", true);
        Cliente carlos = new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", false);

        Validador<Cliente> clienteAtivo = cliente -> cliente != null && cliente.ativo();
        Validador<Cliente> emailCorporativo = cliente ->
                cliente != null && cliente.email().dominio().equals("empresa.com");

        System.out.println("Ana ativa? " + clienteAtivo.validar(ana));
        System.out.println("Carlos ativo? " + clienteAtivo.validar(carlos));

        System.out.println("Ana corporativa? " + emailCorporativo.validar(ana));
        System.out.println("Carlos corporativo? " + emailCorporativo.validar(carlos));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula186.app.ValidadorClienteLambdaApp
```

---

## O que este exemplo mostra

Agora a lambda não está validando apenas texto.

Ela valida um objeto de domínio:

```java
Cliente
```

Regras:

```java
cliente -> cliente != null && cliente.ativo()
```

e:

```java
cliente -> cliente != null && cliente.email().dominio().equals("empresa.com")
```

Esse padrão será muito usado em filtros e Streams.

---

# Parte 7 — Processando listas com comportamento

Ainda não vamos entrar em Streams profundamente.

Mas já podemos criar nosso próprio processador usando lambdas.

## ProcessadorItem<T>

Crie:

```text
src\br\com\curso\aula186\contrato\ProcessadorItem.java
```

Código:

```java
package br.com.curso.aula186.contrato;

@FunctionalInterface
public interface ProcessadorItem<T> {
    void processar(T item);
}
```

---

## ListaUtil

Crie:

```text
src\br\com\curso\aula186\util\ListaUtil.java
```

Código:

```java
package br.com.curso.aula186.util;

import br.com.curso.aula186.contrato.ProcessadorItem;
import br.com.curso.aula186.contrato.Validador;

import java.util.ArrayList;
import java.util.List;

public final class ListaUtil {
    private ListaUtil() {
    }

    public static <T> void paraCada(List<T> itens, ProcessadorItem<T> processador) {
        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        if (processador == null) {
            throw new IllegalArgumentException("Processador é obrigatório.");
        }

        for (T item : itens) {
            processador.processar(item);
        }
    }

    public static <T> List<T> filtrar(List<T> itens, Validador<T> validador) {
        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        if (validador == null) {
            throw new IllegalArgumentException("Validador é obrigatório.");
        }

        List<T> filtrados = new ArrayList<>();

        for (T item : itens) {
            if (validador.validar(item)) {
                filtrados.add(item);
            }
        }

        return List.copyOf(filtrados);
    }
}
```

---

## App processando lista

Crie:

```text
src\br\com\curso\aula186\app\ListaComLambdaApp.java
```

Código:

```java
package br.com.curso.aula186.app;

import br.com.curso.aula186.dominio.cliente.Cliente;
import br.com.curso.aula186.dominio.valor.Email;
import br.com.curso.aula186.util.ListaUtil;

import java.util.List;

public class ListaComLambdaApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", false),
                new Cliente(new Email("maria@empresa.com"), "Maria Oliveira", true)
        );

        System.out.println("Todos os clientes:");
        ListaUtil.paraCada(clientes, cliente -> System.out.println(cliente.resumo()));

        List<Cliente> ativos = ListaUtil.filtrar(clientes, cliente -> cliente.ativo());

        System.out.println();
        System.out.println("Clientes ativos:");
        ListaUtil.paraCada(ativos, cliente -> System.out.println(cliente.resumo()));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula186.app.ListaComLambdaApp
```

---

## O que você acabou de criar

Você criou uma versão didática de ideias que existem no Java moderno.

Seu método:

```java
paraCada
```

lembra:

```java
forEach
```

Seu método:

```java
filtrar
```

lembra:

```java
filter
```

O Java já tem isso em Streams.

Mas criar manualmente ajuda a entender a base.

---

# Parte 8 — Lambdas e responsabilidade

## Lambda não substitui regra de domínio

Cuidado.

Lambda é boa para comportamento pequeno e pontual.

Mas regra importante de domínio deve continuar no domínio.

Exemplo ruim:

```java
Validador<Pedido> podeCancelar = pedido -> pedido.status() != CANCELADO && pedido.status() != ENTREGUE;
```

Se cancelar pedido é regra importante, ela deve estar na entidade:

```java
pedido.cancelar(motivo);
```

ou:

```java
pedido.podeCancelar()
```

Lambda não deve virar depósito de regra crítica espalhada.

---

## Lambda boa

Lambda boa:

```text
filtro simples;
transformação simples;
validação pontual;
processamento curto;
critério externo;
ordenação;
callback simples.
```

Exemplo:

```java
cliente -> cliente.ativo()
```

Exemplo:

```java
cliente -> cliente.nome()
```

Exemplo:

```java
produto -> produto.preco().compareTo(BigDecimal.ZERO) > 0
```

---

## Lambda ruim

Lambda ruim:

```text
muitas linhas;
muitas condições;
muda estado importante;
tem regra de negócio crítica;
tem try/catch complexo;
faz acesso a banco;
chama várias integrações;
tem efeito colateral escondido.
```

Se ficar complexo, extraia para método, service ou entidade.

---

# Parte 9 — Erros comuns

## 1. Criar lambda sem functional interface

Lambda precisa de um tipo alvo.

Exemplo correto:

```java
Validador<String> validador = valor -> valor != null;
```

Exemplo incompleto:

```java
valor -> valor != null
```

isolado não é uma instrução válida.

---

## 2. Colocar dois métodos abstratos em @FunctionalInterface

Isso não compila:

```java
@FunctionalInterface
public interface Validador<T> {
    boolean validar(T valor);

    boolean validarOutro(T valor);
}
```

Functional interface só pode ter um método abstrato.

---

## 3. Lambda grande demais

Se passou de poucas linhas, revise.

Talvez precise de método privado, classe específica ou regra de domínio.

---

## 4. Esquecer return em lambda com bloco

Errado:

```java
valor -> {
    valor.toUpperCase();
}
```

se o método espera retorno.

Certo:

```java
valor -> {
    return valor.toUpperCase();
}
```

---

## 5. Usar lambda para esconder regra importante

Regra de negócio importante deve ter nome.

Exemplo melhor:

```java
pedido.podeSerCancelado()
```

do que uma condição anônima enorme.

---

## 6. Não validar null quando necessário

Lambda pode receber null se o fluxo permitir.

Exemplo seguro:

```java
cliente -> cliente != null && cliente.ativo()
```

---

## 7. Confundir lambda com método executado imediatamente

A lambda representa comportamento.

Ela só executa quando alguém chama o método funcional.

Exemplo:

```java
Validador<String> validador = valor -> valor != null;
```

Aqui a regra foi criada.

Ela executa quando você chama:

```java
validador.validar("Ana")
```

---

# Parte 10 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula186.app.PrimeiraLambdaApp
java -cp out br.com.curso.aula186.app.ClasseAnonimaVsLambdaApp
java -cp out br.com.curso.aula186.app.LambdaComRetornoApp
java -cp out br.com.curso.aula186.app.LambdaComBlocoApp
java -cp out br.com.curso.aula186.app.ValidadorGenericoApp
java -cp out br.com.curso.aula186.app.ComportamentoComoArgumentoApp
java -cp out br.com.curso.aula186.app.ConversorLambdaApp
java -cp out br.com.curso.aula186.app.ValidadorClienteLambdaApp
java -cp out br.com.curso.aula186.app.ListaComLambdaApp
```

Em cada execução, responda:

```text
qual functional interface foi usada?
qual lambda foi passada?
qual método abstrato a lambda implementou?
o comportamento foi executado imediatamente ou depois?
o uso de Generics ajudou onde?
```

---

# Parte 11 — Desafio prático

Crie uma entidade simples:

```text
src\br\com\curso\aula186\dominio\pedido\Pedido.java
```

Campos:

```text
String codigo;
String cliente;
double valor;
boolean pago;
```

Regras:

```text
codigo obrigatório;
cliente obrigatório;
valor maior que zero;
pedido nasce com pago informado no construtor.
```

Crie uma lista de pedidos no app:

```text
src\br\com\curso\aula186\app\PedidoLambdaApp.java
```

Usando `Validador<Pedido>` e `ListaUtil.filtrar`, crie filtros:

```text
pedidos pagos;
pedidos pendentes;
pedidos com valor acima de 1000.
```

Depois use `ListaUtil.paraCada` para imprimir os resumos.

Critério principal:

```text
usar lambdas pequenas;
não usar raw type;
não usar Object;
não usar cast.
```

---

## Desafio extra

Crie uma interface funcional:

```text
src\br\com\curso\aula186\contrato\CalculadorTaxa.java
```

Método:

```java
double calcular(double valor);
```

Crie app:

```text
src\br\com\curso\aula186\app\CalculadorTaxaLambdaApp.java
```

Crie lambdas:

```text
taxa de 5%;
taxa de 10%;
taxa fixa mínima de 20 se o percentual der menos que 20.
```

Depois imprima:

```text
valor original;
taxa calculada;
valor final.
```

Critério principal:

```text
entender lambda com cálculo e retorno.
```

---

# Parte 12 — Debug recomendado

Coloque breakpoints em:

```text
PrimeiraLambdaApp
ClasseAnonimaVsLambdaApp
LambdaComBlocoApp
ValidadorUtil.validarObrigatorio
ListaUtil.paraCada
ListaUtil.filtrar
ValidadorClienteLambdaApp
```

Observe:

```text
quando a lambda é criada;
quando a lambda é executada;
qual valor entra como parâmetro;
qual valor retorna;
como o Java infere o tipo;
como o método genérico recebe Validador<T>;
como ListaUtil.filtrar monta uma nova lista.
```

No debug, preste atenção em:

```java
validador.validar(valor)
processador.processar(item)
conversor.converter(entrada)
```

Esses pontos mostram a execução real do comportamento.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que é uma functional interface?
2. O que é uma lambda?
3. Por que @FunctionalInterface é útil?
4. Como Generics se conectam com lambdas?
5. Quando uma lambda deve virar método ou regra de domínio?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar uma functional interface;
usar @FunctionalInterface;
criar lambda simples;
criar lambda com bloco;
substituir classe anônima por lambda;
criar Validador<T>;
criar Conversor<IN, OUT>;
passar lambda como argumento;
processar lista com lambda;
filtrar lista com lambda;
usar lambda com objeto de domínio;
entender quando lambda é adequada;
entender quando lambda vira exagero;
resolver PedidoLambdaApp;
resolver CalculadorTaxaLambdaApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-186-functional-interfaces-e-lambdas
git commit -m "Aula 186: functional interfaces e lambdas"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
lambda permite passar comportamento de forma curta quando existe uma functional interface.
```

Você viu:

```text
functional interface;
@FunctionalInterface;
classe anônima;
lambda;
lambda com retorno;
lambda com bloco;
Validador<T>;
Conversor<IN, OUT>;
ProcessadorItem<T>;
ListaUtil;
filtros simples;
processamento de listas.
```

A partir daqui, você vai perceber que muitas APIs modernas do Java recebem comportamento.

Na próxima aula, vamos estudar as functional interfaces prontas do Java:

```text
Predicate<T>
Function<T, R>
Consumer<T>
Supplier<T>
```

Essas quatro interfaces serão base para Streams, Optional avançado, validações, mappers, factories e processamento moderno no backend Java.
