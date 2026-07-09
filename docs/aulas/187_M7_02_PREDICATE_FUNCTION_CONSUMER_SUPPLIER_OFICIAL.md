# 187 — M7.02 — Predicate, Function, Consumer e Supplier

## Objetivo da aula

Nesta aula você vai estudar as quatro functional interfaces mais importantes do Java moderno:

```text
Predicate<T>
Function<T, R>
Consumer<T>
Supplier<T>
```

Na aula anterior, você criou interfaces próprias:

```java
Validador<T>
Conversor<IN, OUT>
ProcessadorItem<T>
```

Agora você vai perceber que o próprio Java já fornece interfaces prontas para esses casos.

Isso é importante porque essas interfaces aparecem em:

```text
Optional;
Streams;
Collections;
Comparator;
mappers;
validações;
processamento de listas;
factories;
testes;
serviços;
APIs modernas.
```

Ao final desta aula, você deve conseguir:

```text
entender Predicate<T>;
entender Function<T, R>;
entender Consumer<T>;
entender Supplier<T>;
saber quando usar cada uma;
substituir interfaces próprias por interfaces do Java;
usar lambdas com interfaces funcionais padrão;
criar filtros com Predicate;
criar conversões com Function;
criar processamento com Consumer;
criar factories com Supplier;
usar composição simples;
aplicar em exemplos de backend;
entender como isso prepara Streams.
```

---

## Por que estudar interfaces prontas do Java

Na aula anterior, criamos:

```java
Validador<T>
Conversor<IN, OUT>
ProcessadorItem<T>
```

Essas interfaces são didáticas.

Mas o Java já possui equivalentes.

Veja a comparação:

```text
Validador<T>       -> Predicate<T>
Conversor<IN, OUT> -> Function<T, R>
ProcessadorItem<T> -> Consumer<T>
Criador<T>         -> Supplier<T>
```

Ou seja:

```text
você já entendeu a ideia;
agora vai aprender o vocabulário oficial do Java.
```

---

## Visão geral

As quatro interfaces principais são:

```java
Predicate<T>
```

Recebe `T` e retorna `boolean`.

```java
Function<T, R>
```

Recebe `T` e retorna `R`.

```java
Consumer<T>
```

Recebe `T` e não retorna nada.

```java
Supplier<T>
```

Não recebe nada e retorna `T`.

Tabela rápida:

```text
Predicate<T>    T -> boolean
Function<T, R>  T -> R
Consumer<T>     T -> void
Supplier<T>     () -> T
```

---

## Pacote das interfaces funcionais

Essas interfaces ficam no pacote:

```java
java.util.function
```

Imports comuns:

```java
import java.util.function.Predicate;
import java.util.function.Function;
import java.util.function.Consumer;
import java.util.function.Supplier;
```

Esse pacote será muito usado daqui para frente.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-187-predicate-function-consumer-supplier
cd labs\m7\aula-187-predicate-function-consumer-supplier
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula187
mkdir src\br\com\curso\aula187\app
mkdir src\br\com\curso\aula187\dominio
mkdir src\br\com\curso\aula187\dominio\valor
mkdir src\br\com\curso\aula187\dominio\cliente
mkdir src\br\com\curso\aula187\dominio\pedido
mkdir src\br\com\curso\aula187\util
```

---

# Parte 1 — Predicate<T>

## O que é Predicate<T>

`Predicate<T>` representa uma regra que recebe um valor e responde:

```text
verdadeiro ou falso.
```

Assinatura principal:

```java
boolean test(T valor);
```

Exemplos:

```java
Predicate<String> textoNaoBranco = texto -> texto != null && !texto.isBlank();

Predicate<Integer> positivo = numero -> numero != null && numero > 0;

Predicate<Cliente> clienteAtivo = cliente -> cliente.ativo();
```

Use `Predicate<T>` para:

```text
validar;
filtrar;
testar condição;
verificar regra simples.
```

---

## Primeiro exemplo com Predicate

Crie:

```text
src\br\com\curso\aula187\app\PredicateBasicoApp.java
```

Código:

```java
package br.com.curso.aula187.app;

import java.util.function.Predicate;

public class PredicateBasicoApp {
    public static void main(String[] args) {
        Predicate<String> textoNaoBranco = texto -> texto != null && !texto.isBlank();
        Predicate<Integer> numeroPositivo = numero -> numero != null && numero > 0;

        System.out.println("Ana válido? " + textoNaoBranco.test("Ana"));
        System.out.println("Espaço válido? " + textoNaoBranco.test("   "));
        System.out.println("10 positivo? " + numeroPositivo.test(10));
        System.out.println("-5 positivo? " + numeroPositivo.test(-5));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula187.app.PredicateBasicoApp
```

---

## Como ler Predicate<String>

```java
Predicate<String>
```

Significa:

```text
uma regra que recebe String e retorna boolean.
```

O método a chamar é:

```java
test
```

Exemplo:

```java
textoNaoBranco.test("Ana")
```

---

## Predicate substitui Validador<T>

Na aula passada criamos:

```java
Validador<T>
```

Agora podemos usar:

```java
Predicate<T>
```

Em vez de:

```java
validador.validar(valor)
```

usamos:

```java
predicate.test(valor)
```

Essa é a interface padrão do Java para esse tipo de comportamento.

---

## Composição com Predicate

`Predicate` possui métodos úteis:

```java
and
or
negate
```

Exemplo:

```java
Predicate<String> naoNulo = texto -> texto != null;
Predicate<String> naoBranco = texto -> !texto.isBlank();

Predicate<String> valido = naoNulo.and(naoBranco);
```

Vamos testar.

---

## App com composição de Predicate

Crie:

```text
src\br\com\curso\aula187\app\PredicateComposicaoApp.java
```

Código:

```java
package br.com.curso.aula187.app;

import java.util.function.Predicate;

public class PredicateComposicaoApp {
    public static void main(String[] args) {
        Predicate<String> naoNulo = texto -> texto != null;
        Predicate<String> naoBranco = texto -> !texto.isBlank();
        Predicate<String> tamanhoMinimoTres = texto -> texto.length() >= 3;

        Predicate<String> nomeValido = naoNulo
                .and(naoBranco)
                .and(tamanhoMinimoTres);

        System.out.println("Ana válido? " + nomeValido.test("Ana"));
        System.out.println("A válido? " + nomeValido.test("A"));
        System.out.println("Espaço válido? " + nomeValido.test("   "));
        System.out.println("Null válido? " + nomeValido.test(null));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula187.app.PredicateComposicaoApp
```

---

## Atenção à ordem no Predicate

Neste trecho:

```java
Predicate<String> nomeValido = naoNulo
        .and(naoBranco)
        .and(tamanhoMinimoTres);
```

a ordem importa.

Primeiro verificamos:

```java
texto != null
```

Depois chamamos:

```java
texto.isBlank()
texto.length()
```

Se inverter e chamar `isBlank()` antes de verificar null, pode causar `NullPointerException`.

---

# Parte 2 — Function<T, R>

## O que é Function<T, R>

`Function<T, R>` representa uma transformação.

Ela recebe um valor de tipo `T` e retorna um valor de tipo `R`.

Assinatura principal:

```java
R apply(T valor);
```

Exemplos:

```java
Function<String, Integer> tamanho = texto -> texto.length();

Function<String, String> maiusculo = texto -> texto.toUpperCase();

Function<Cliente, String> extrairNome = cliente -> cliente.nome();
```

Use `Function<T, R>` para:

```text
converter;
transformar;
mapear;
extrair dado;
montar response;
criar resumo.
```

---

## Primeiro exemplo com Function

Crie:

```text
src\br\com\curso\aula187\app\FunctionBasicoApp.java
```

Código:

```java
package br.com.curso.aula187.app;

import java.util.function.Function;

public class FunctionBasicoApp {
    public static void main(String[] args) {
        Function<String, Integer> tamanho = texto -> texto.length();
        Function<String, String> maiusculo = texto -> texto.toUpperCase();
        Function<Integer, String> numeroParaTexto = numero -> "Número: " + numero;

        System.out.println("Tamanho: " + tamanho.apply("Java"));
        System.out.println("Maiúsculo: " + maiusculo.apply("backend"));
        System.out.println(numeroParaTexto.apply(10));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula187.app.FunctionBasicoApp
```

---

## Como ler Function<String, Integer>

```java
Function<String, Integer>
```

Significa:

```text
recebe String;
retorna Integer.
```

O método a chamar é:

```java
apply
```

Exemplo:

```java
tamanho.apply("Java")
```

---

## Function substitui Conversor<IN, OUT>

Na aula passada criamos:

```java
Conversor<IN, OUT>
```

Agora usamos:

```java
Function<T, R>
```

A ideia é a mesma:

```text
entrada -> saída.
```

---

## Composição com Function

`Function` também tem métodos úteis:

```java
andThen
compose
```

### andThen

Executa a primeira função e depois a próxima.

```java
primeira.andThen(segunda)
```

### compose

Executa outra função antes da atual.

```java
atual.compose(anterior)
```

Vamos focar em `andThen`, que é mais intuitivo no início.

---

## App com andThen

Crie:

```text
src\br\com\curso\aula187\app\FunctionComposicaoApp.java
```

Código:

```java
package br.com.curso.aula187.app;

import java.util.function.Function;

public class FunctionComposicaoApp {
    public static void main(String[] args) {
        Function<String, String> trim = texto -> texto.trim();
        Function<String, String> maiusculo = texto -> texto.toUpperCase();
        Function<String, String> prefixar = texto -> "CLIENTE: " + texto;

        Function<String, String> normalizar = trim
                .andThen(maiusculo)
                .andThen(prefixar);

        System.out.println(normalizar.apply("  ana silva  "));
        System.out.println(normalizar.apply("  carlos souza  "));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula187.app.FunctionComposicaoApp
```

---

## Como ler andThen

Neste código:

```java
trim.andThen(maiusculo).andThen(prefixar)
```

a ordem é:

```text
1. trim;
2. maiúsculo;
3. prefixar.
```

Entrada:

```text
"  ana silva  "
```

Fluxo:

```text
"ana silva"
"ANA SILVA"
"CLIENTE: ANA SILVA"
```

---

# Parte 3 — Consumer<T>

## O que é Consumer<T>

`Consumer<T>` representa uma ação que recebe um valor e não retorna nada.

Assinatura principal:

```java
void accept(T valor);
```

Exemplos:

```java
Consumer<String> imprimir = texto -> System.out.println(texto);

Consumer<Cliente> imprimirCliente = cliente -> System.out.println(cliente.resumo());

Consumer<Pedido> processarPedido = pedido -> pedido.cancelar("motivo");
```

Use `Consumer<T>` para:

```text
imprimir;
registrar;
executar ação;
processar item;
aplicar efeito colateral controlado.
```

Atenção:

```text
Consumer normalmente tem efeito colateral.
```

Então deve ser usado com cuidado.

---

## Primeiro exemplo com Consumer

Crie:

```text
src\br\com\curso\aula187\app\ConsumerBasicoApp.java
```

Código:

```java
package br.com.curso.aula187.app;

import java.util.function.Consumer;

public class ConsumerBasicoApp {
    public static void main(String[] args) {
        Consumer<String> imprimir = texto -> System.out.println(texto);
        Consumer<String> imprimirComPrefixo = texto -> System.out.println("Valor: " + texto);

        imprimir.accept("Java");
        imprimirComPrefixo.accept("Backend");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula187.app.ConsumerBasicoApp
```

---

## Como ler Consumer<String>

```java
Consumer<String>
```

Significa:

```text
recebe String;
não retorna nada.
```

O método a chamar é:

```java
accept
```

Exemplo:

```java
imprimir.accept("Java")
```

---

## Consumer substitui ProcessadorItem<T>

Na aula passada criamos:

```java
ProcessadorItem<T>
```

Agora usamos:

```java
Consumer<T>
```

A ideia é:

```text
receber item e executar algo.
```

---

## Composição com Consumer

`Consumer` possui:

```java
andThen
```

Exemplo:

```java
consumer1.andThen(consumer2)
```

Ele executa a primeira ação e depois a segunda.

---

## App com Consumer andThen

Crie:

```text
src\br\com\curso\aula187\app\ConsumerComposicaoApp.java
```

Código:

```java
package br.com.curso.aula187.app;

import java.util.function.Consumer;

public class ConsumerComposicaoApp {
    public static void main(String[] args) {
        Consumer<String> imprimirOriginal = texto -> System.out.println("Original: " + texto);
        Consumer<String> imprimirMaiusculo = texto -> System.out.println("Maiúsculo: " + texto.toUpperCase());
        Consumer<String> imprimirTamanho = texto -> System.out.println("Tamanho: " + texto.length());

        Consumer<String> pipeline = imprimirOriginal
                .andThen(imprimirMaiusculo)
                .andThen(imprimirTamanho);

        pipeline.accept("java");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula187.app.ConsumerComposicaoApp
```

---

## Cuidado com Consumer

Consumer executa ação.

Ação pode alterar estado, imprimir, salvar ou chamar outro método.

Exemplo perigoso:

```java
Consumer<Pedido> cancelar = pedido -> pedido.cancelar("motivo");
```

Isso altera estado.

Não é proibido.

Mas precisa ser claro.

Regra:

```text
se Consumer muda estado importante, use com cuidado e prefira nomear bem o comportamento.
```

---

# Parte 4 — Supplier<T>

## O que é Supplier<T>

`Supplier<T>` representa uma função que não recebe nada e retorna um valor.

Assinatura principal:

```java
T get();
```

Exemplos:

```java
Supplier<String> gerarTexto = () -> "Java";

Supplier<Integer> gerarNumero = () -> 10;

Supplier<Cliente> criarCliente = () -> new Cliente(...);
```

Use `Supplier<T>` para:

```text
gerar valor;
criar objeto;
adiar execução;
fornecer valor padrão;
factory simples.
```

---

## Primeiro exemplo com Supplier

Crie:

```text
src\br\com\curso\aula187\app\SupplierBasicoApp.java
```

Código:

```java
package br.com.curso.aula187.app;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.function.Supplier;

public class SupplierBasicoApp {
    public static void main(String[] args) {
        Supplier<String> textoFixo = () -> "Java Backend";
        Supplier<LocalDateTime> agora = () -> LocalDateTime.now();
        Supplier<String> protocolo = () -> UUID.randomUUID().toString();

        System.out.println(textoFixo.get());
        System.out.println(agora.get());
        System.out.println(protocolo.get());
        System.out.println(protocolo.get());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula187.app.SupplierBasicoApp
```

---

## Como ler Supplier<String>

```java
Supplier<String>
```

Significa:

```text
não recebe nada;
retorna String.
```

O método a chamar é:

```java
get
```

Exemplo:

```java
protocolo.get()
```

Cada chamada executa o Supplier novamente.

---

## Supplier e criação de objetos

`Supplier<T>` é muito usado como factory simples.

Crie:

```text
src\br\com\curso\aula187\app\SupplierFactoryApp.java
```

Código:

```java
package br.com.curso.aula187.app;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

public class SupplierFactoryApp {
    public static void main(String[] args) {
        Supplier<List<String>> criarLista = () -> new ArrayList<>();

        List<String> nomes = criarLista.get();
        nomes.add("Ana");
        nomes.add("Carlos");

        List<String> outrosNomes = criarLista.get();
        outrosNomes.add("Maria");

        System.out.println(nomes);
        System.out.println(outrosNomes);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula187.app.SupplierFactoryApp
```

---

## O que observar

Cada chamada:

```java
criarLista.get()
```

cria uma nova lista.

Supplier representa uma fonte de valores.

---

# Parte 5 — Domínio para exemplos backend

Agora vamos aplicar as quatro interfaces em um domínio.

## Email

Crie:

```text
src\br\com\curso\aula187\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula187.dominio.valor;

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
src\br\com\curso\aula187\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula187.dominio.cliente;

import br.com.curso.aula187.dominio.valor.Email;

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

## App usando as quatro interfaces com Cliente

Crie:

```text
src\br\com\curso\aula187\app\InterfacesFuncionaisClienteApp.java
```

Código:

```java
package br.com.curso.aula187.app;

import br.com.curso.aula187.dominio.cliente.Cliente;
import br.com.curso.aula187.dominio.valor.Email;

import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

public class InterfacesFuncionaisClienteApp {
    public static void main(String[] args) {
        Supplier<Cliente> criarCliente = () ->
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true);

        Predicate<Cliente> clienteAtivo = cliente -> cliente.ativo();

        Function<Cliente, String> clienteParaResumo = cliente -> cliente.resumo();

        Consumer<String> imprimir = texto -> System.out.println(texto);

        Cliente cliente = criarCliente.get();

        if (clienteAtivo.test(cliente)) {
            String resumo = clienteParaResumo.apply(cliente);
            imprimir.accept(resumo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula187.app.InterfacesFuncionaisClienteApp
```

---

## Como ler esse fluxo

```java
Supplier<Cliente>
```

cria o cliente.

```java
Predicate<Cliente>
```

testa se está ativo.

```java
Function<Cliente, String>
```

transforma cliente em resumo.

```java
Consumer<String>
```

imprime o resumo.

Fluxo:

```text
criar;
testar;
transformar;
consumir.
```

Esse raciocínio prepara você para Streams.

---

# Parte 6 — Utilitário de listas usando interfaces padrão

Na aula passada, criamos utilitários com interfaces próprias.

Agora vamos usar as interfaces do Java.

## ListaFuncionalUtil

Crie:

```text
src\br\com\curso\aula187\util\ListaFuncionalUtil.java
```

Código:

```java
package br.com.curso.aula187.util;

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

## Observação sobre PECS no utilitário

Repare nas assinaturas:

```java
Consumer<? super T>
Predicate<? super T>
Function<? super T, ? extends R>
```

Isso é PECS aplicado.

`Consumer` consome `T`, então usa `super`.

`Predicate` recebe `T` para testar, então também pode ser `super`.

`Function` recebe `T` e produz `R`.

Por isso:

```java
Function<? super T, ? extends R>
```

Essa assinatura é mais flexível e aparece em APIs do Java.

---

## App usando ListaFuncionalUtil

Crie:

```text
src\br\com\curso\aula187\app\ListaFuncionalUtilApp.java
```

Código:

```java
package br.com.curso.aula187.app;

import br.com.curso.aula187.dominio.cliente.Cliente;
import br.com.curso.aula187.dominio.valor.Email;
import br.com.curso.aula187.util.ListaFuncionalUtil;

import java.util.List;

public class ListaFuncionalUtilApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", false),
                new Cliente(new Email("maria@empresa.com"), "Maria Oliveira", true)
        );

        List<Cliente> ativos = ListaFuncionalUtil.filtrar(
                clientes,
                cliente -> cliente.ativo()
        );

        List<String> nomes = ListaFuncionalUtil.mapear(
                ativos,
                cliente -> cliente.nome()
        );

        ListaFuncionalUtil.paraCada(
                nomes,
                nome -> System.out.println("Cliente ativo: " + nome)
        );
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula187.app.ListaFuncionalUtilApp
```

---

## O que você criou

Você criou manualmente três operações que lembram muito Streams:

```text
filtrar;
mapear;
paraCada.
```

Com Streams, futuramente isso ficará assim:

```java
clientes.stream()
        .filter(cliente -> cliente.ativo())
        .map(cliente -> cliente.nome())
        .forEach(nome -> System.out.println(nome));
```

Mas agora você entende o mecanismo por baixo.

---

# Parte 7 — Pedido com Predicate, Function e Consumer

## CodigoPedido

Crie:

```text
src\br\com\curso\aula187\dominio\valor\CodigoPedido.java
```

Código:

```java
package br.com.curso.aula187.dominio.valor;

import java.util.Objects;

public final class CodigoPedido {
    private final String valor;

    public CodigoPedido(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código do pedido é obrigatório.");
        }

        String normalizado = valor.trim().toUpperCase();

        if (!normalizado.startsWith("PED-")) {
            throw new IllegalArgumentException("Código do pedido deve iniciar com PED-.");
        }

        this.valor = normalizado;
    }

    public String resumo() {
        return valor;
    }

    @Override
    public boolean equals(Object outro) {
        if (this == outro) {
            return true;
        }

        if (!(outro instanceof CodigoPedido codigoPedido)) {
            return false;
        }

        return Objects.equals(valor, codigoPedido.valor);
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

## Pedido

Crie:

```text
src\br\com\curso\aula187\dominio\pedido\Pedido.java
```

Código:

```java
package br.com.curso.aula187.dominio.pedido;

import br.com.curso.aula187.dominio.valor.CodigoPedido;
import br.com.curso.aula187.dominio.valor.Email;

import java.math.BigDecimal;

public class Pedido {
    private final CodigoPedido codigo;
    private final Email emailCliente;
    private final BigDecimal valor;
    private final boolean pago;

    public Pedido(CodigoPedido codigo, Email emailCliente, BigDecimal valor, boolean pago) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (emailCliente == null) {
            throw new IllegalArgumentException("E-mail do cliente é obrigatório.");
        }

        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        }

        this.codigo = codigo;
        this.emailCliente = emailCliente;
        this.valor = valor;
        this.pago = pago;
    }

    public CodigoPedido codigo() {
        return codigo;
    }

    public Email emailCliente() {
        return emailCliente;
    }

    public BigDecimal valor() {
        return valor;
    }

    public boolean pago() {
        return pago;
    }

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + emailCliente.resumo()
                + " | Valor: " + valor
                + " | Pago: " + pago;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

---

## App de pedidos

Crie:

```text
src\br\com\curso\aula187\app\PedidoInterfacesFuncionaisApp.java
```

Código:

```java
package br.com.curso.aula187.app;

import br.com.curso.aula187.dominio.pedido.Pedido;
import br.com.curso.aula187.dominio.valor.CodigoPedido;
import br.com.curso.aula187.dominio.valor.Email;
import br.com.curso.aula187.util.ListaFuncionalUtil;

import java.math.BigDecimal;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

public class PedidoInterfacesFuncionaisApp {
    public static void main(String[] args) {
        List<Pedido> pedidos = List.of(
                new Pedido(new CodigoPedido("PED-001"), new Email("ana@empresa.com"), new BigDecimal("500.00"), true),
                new Pedido(new CodigoPedido("PED-002"), new Email("carlos@empresa.com"), new BigDecimal("1500.00"), false),
                new Pedido(new CodigoPedido("PED-003"), new Email("maria@empresa.com"), new BigDecimal("2500.00"), true)
        );

        Predicate<Pedido> pago = pedido -> pedido.pago();
        Predicate<Pedido> valorAlto = pedido -> pedido.valor().compareTo(new BigDecimal("1000.00")) > 0;

        Function<Pedido, String> paraResumo = pedido -> pedido.resumo();

        Consumer<String> imprimir = resumo -> System.out.println(resumo);

        List<Pedido> pagosComValorAlto = ListaFuncionalUtil.filtrar(
                pedidos,
                pago.and(valorAlto)
        );

        List<String> resumos = ListaFuncionalUtil.mapear(
                pagosComValorAlto,
                paraResumo
        );

        ListaFuncionalUtil.paraCada(resumos, imprimir);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula187.app.PedidoInterfacesFuncionaisApp
```

---

# Parte 8 — Quando usar cada uma

## Use Predicate<T> quando

Você quer responder:

```text
sim ou não?
```

Exemplos:

```java
cliente -> cliente.ativo()
pedido -> pedido.pago()
produto -> produto.disponivel()
texto -> !texto.isBlank()
numero -> numero > 0
```

---

## Use Function<T, R> quando

Você quer transformar:

```text
uma coisa em outra.
```

Exemplos:

```java
cliente -> cliente.nome()
pedido -> pedido.resumo()
request -> command
entity -> response
produto -> produto.preco()
```

---

## Use Consumer<T> quando

Você quer executar uma ação:

```text
imprimir;
enviar;
salvar;
registrar;
processar;
notificar.
```

Exemplos:

```java
texto -> System.out.println(texto)
pedido -> fila.add(pedido)
evento -> publicar(evento)
cliente -> auditoria.registrar(cliente)
```

Use com cuidado quando houver efeito colateral.

---

## Use Supplier<T> quando

Você quer fornecer ou criar valor:

```text
gerar protocolo;
criar objeto;
fornecer valor padrão;
adiar cálculo;
factory simples.
```

Exemplos:

```java
() -> UUID.randomUUID().toString()
() -> LocalDateTime.now()
() -> new ArrayList<>()
() -> new Cliente(...)
```

---

# Parte 9 — Erros comuns

## 1. Usar interface própria sem necessidade

Se `Predicate<T>` resolve, não crie `Validador<T>` sem motivo.

Interfaces próprias ainda podem existir quando o nome de domínio melhora a intenção.

Mas, por padrão, conheça e use as interfaces do Java.

---

## 2. Usar Consumer para regra crítica sem clareza

Consumer pode esconder efeito colateral.

Se a regra é importante, dê nome ao método.

---

## 3. Criar lambda grande demais

Se a lambda tem muita lógica, extraia.

Exemplo melhor:

```java
Predicate<Pedido> podeSerFaturado = Pedido::podeSerFaturado;
```

Em vez de uma lambda gigante.

---

## 4. Confundir Function com Consumer

`Function` retorna valor.

`Consumer` não retorna valor.

Se você precisa transformar, use Function.

Se você precisa executar ação, use Consumer.

---

## 5. Confundir Supplier com Function

`Supplier` não recebe nada.

`Function` recebe entrada.

```java
Supplier<String> gerar = () -> "texto";
Function<String, Integer> tamanho = texto -> texto.length();
```

---

## 6. Ignorar Generics das interfaces

Não use raw type:

```java
Predicate predicate
Function function
Consumer consumer
Supplier supplier
```

Prefira:

```java
Predicate<Cliente>
Function<Cliente, String>
Consumer<String>
Supplier<Cliente>
```

---

# Parte 10 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula187.app.PredicateBasicoApp
java -cp out br.com.curso.aula187.app.PredicateComposicaoApp
java -cp out br.com.curso.aula187.app.FunctionBasicoApp
java -cp out br.com.curso.aula187.app.FunctionComposicaoApp
java -cp out br.com.curso.aula187.app.ConsumerBasicoApp
java -cp out br.com.curso.aula187.app.ConsumerComposicaoApp
java -cp out br.com.curso.aula187.app.SupplierBasicoApp
java -cp out br.com.curso.aula187.app.SupplierFactoryApp
java -cp out br.com.curso.aula187.app.InterfacesFuncionaisClienteApp
java -cp out br.com.curso.aula187.app.ListaFuncionalUtilApp
java -cp out br.com.curso.aula187.app.PedidoInterfacesFuncionaisApp
```

Para cada execução, responda:

```text
qual interface funcional aparece?
qual é o tipo de entrada?
qual é o tipo de saída?
a lambda retorna valor?
a lambda altera algo?
a interface recebe argumento?
o uso parece Predicate, Function, Consumer ou Supplier?
```

---

# Parte 11 — Desafio prático

Crie uma entidade:

```text
src\br\com\curso\aula187\dominio\produto\Produto.java
```

Campos:

```text
String sku;
String nome;
BigDecimal preco;
boolean ativo;
```

Regras:

```text
sku obrigatório;
nome obrigatório;
preço maior que zero;
ativo informado no construtor.
```

Crie app:

```text
src\br\com\curso\aula187\app\ProdutoFunctionalInterfacesApp.java
```

Crie uma lista de produtos.

Use:

```text
Predicate<Produto> produtoAtivo;
Predicate<Produto> precoMaiorQue100;
Function<Produto, String> produtoParaResumo;
Consumer<String> imprimir;
Supplier<Produto> produtoPadrao.
```

Fluxo obrigatório:

```text
criar produto padrão com Supplier;
filtrar produtos ativos;
filtrar produtos com preço maior que 100;
mapear para resumo;
imprimir com Consumer.
```

Critério principal:

```text
usar Predicate, Function, Consumer e Supplier corretamente.
```

---

## Desafio extra

Crie utilitário:

```text
src\br\com\curso\aula187\util\PipelineFuncional.java
```

Método:

```java
public static <T, R> List<R> processar(
        List<T> itens,
        Predicate<? super T> filtro,
        Function<? super T, ? extends R> mapper
)
```

Regras:

```text
itens não pode ser null;
filtro não pode ser null;
mapper não pode ser null;
filtrar;
mapear;
não permitir resultado null;
retornar List.copyOf.
```

Crie app:

```text
src\br\com\curso\aula187\app\PipelineFuncionalApp.java
```

Use com:

```text
List<Produto>;
Predicate<Produto>;
Function<Produto, String>.
```

Critério principal:

```text
usar Predicate e Function com PECS.
```

---

# Parte 12 — Debug recomendado

Coloque breakpoints em:

```text
PredicateComposicaoApp
FunctionComposicaoApp
ConsumerComposicaoApp
SupplierBasicoApp
ListaFuncionalUtil.filtrar
ListaFuncionalUtil.mapear
ListaFuncionalUtil.paraCada
PedidoInterfacesFuncionaisApp
```

Observe:

```text
quando Predicate.test é chamado;
quando Function.apply é chamado;
quando Consumer.accept é chamado;
quando Supplier.get é chamado;
como and combina predicates;
como andThen encadeia functions;
como andThen encadeia consumers;
como a lista filtrada é montada;
como a lista mapeada é montada.
```

Pontos de atenção:

```java
predicate.test(item)
function.apply(item)
consumer.accept(item)
supplier.get()
```

Esses são os métodos centrais da aula.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Para que serve Predicate<T>?
2. Para que serve Function<T, R>?
3. Para que serve Consumer<T>?
4. Para que serve Supplier<T>?
5. Qual dessas interfaces normalmente tem mais risco de efeito colateral?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar Predicate<T>;
usar Predicate.and;
usar Predicate.or;
usar Predicate.negate;
usar Function<T, R>;
usar Function.andThen;
usar Consumer<T>;
usar Consumer.andThen;
usar Supplier<T>;
explicar test, apply, accept e get;
substituir interfaces próprias por interfaces do Java;
usar as quatro interfaces com domínio Cliente;
usar as quatro interfaces com domínio Pedido;
criar ListaFuncionalUtil;
entender PECS em Predicate, Function e Consumer;
resolver ProdutoFunctionalInterfacesApp;
resolver PipelineFuncionalApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-187-predicate-function-consumer-supplier
git commit -m "Aula 187: predicate function consumer supplier"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Predicate, Function, Consumer e Supplier são o vocabulário funcional básico do Java moderno.
```

Você estudou:

```text
Predicate<T> como T -> boolean;
Function<T, R> como T -> R;
Consumer<T> como T -> void;
Supplier<T> como () -> T.
```

Também viu que essas interfaces se conectam diretamente com:

```text
Generics;
PECS;
Optional;
Streams;
mappers;
validações;
filtros;
factories;
processamento de listas.
```

Na próxima aula, vamos estudar:

```text
Method Reference e Constructor Reference
```

Você vai aprender a trocar algumas lambdas por referências mais limpas, como:

```java
Cliente::nome
System.out::println
Cliente::new
```

Esse recurso aparece constantemente em Streams, Optional e APIs modernas do Java.
