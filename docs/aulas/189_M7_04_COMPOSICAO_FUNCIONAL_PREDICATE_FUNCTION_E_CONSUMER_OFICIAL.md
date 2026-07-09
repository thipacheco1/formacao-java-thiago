# 189 — M7.04 — Composição funcional: Predicate, Function e Consumer

## Objetivo da aula

Nesta aula você vai aprofundar um dos pontos mais importantes da programação funcional aplicada ao Java:

```text
composição de comportamentos.
```

Na aula anterior, você estudou:

```text
Predicate<T>;
Function<T, R>;
Consumer<T>;
Supplier<T>;
method reference;
constructor reference.
```

Agora vamos aprender a combinar comportamentos pequenos para formar fluxos maiores.

O foco será:

```text
Predicate.and;
Predicate.or;
Predicate.negate;
Function.andThen;
Function.compose;
Consumer.andThen;
pipelines pequenos;
validações combinadas;
transformações encadeadas;
ações em sequência;
boas práticas;
erros comuns.
```

Ao final desta aula, você deve conseguir:

```text
compor predicates com and;
compor predicates com or;
inverter predicates com negate;
compor functions com andThen;
compor functions com compose;
compor consumers com andThen;
entender ordem de execução;
evitar lambdas gigantes;
criar validações reutilizáveis;
criar transformações reutilizáveis;
criar pipelines pequenos e legíveis;
aplicar composição em domínio de backend;
preparar a base para Streams.
```

---

## Ideia principal

Composição funcional significa montar comportamentos maiores usando comportamentos menores.

Em vez de escrever uma regra grande:

```java
cliente -> cliente != null
        && cliente.ativo()
        && cliente.email().dominio().equals("empresa.com")
        && cliente.nome().length() >= 3
```

podemos separar:

```java
Predicate<Cliente> naoNulo = cliente -> cliente != null;
Predicate<Cliente> ativo = Cliente::ativo;
Predicate<Cliente> emailCorporativo = cliente -> cliente.email().dominio().equals("empresa.com");
Predicate<Cliente> nomeMinimo = cliente -> cliente.nome().length() >= 3;
```

E combinar:

```java
Predicate<Cliente> clienteValido = naoNulo
        .and(ativo)
        .and(emailCorporativo)
        .and(nomeMinimo);
```

Isso melhora:

```text
leitura;
reutilização;
teste;
debug;
manutenção.
```

---

## Por que composição importa no backend

Em backend, é comum ter regras como:

```text
cliente ativo;
produto disponível;
pedido pago;
OS aberta;
usuário autorizado;
data válida;
status permitido;
valor positivo;
categoria ativa;
contrato vigente.
```

Essas regras podem ser combinadas.

Mas a composição precisa ser usada com cuidado.

Regra importante do curso:

```text
composição funcional é ótima para regras pequenas e explícitas;
regra de domínio crítica ainda deve ter nome e lugar correto.
```

---

## Cuidado importante

Composição funcional não deve virar uma forma de esconder regra de negócio.

Exemplo ruim:

```java
Predicate<Pedido> regra = p -> p.status() != CANCELADO
        && p.valor().compareTo(BigDecimal.ZERO) > 0
        && p.cliente().ativo()
        && p.data().isBefore(LocalDate.now())
        && p.itens().size() > 0;
```

Se isso é uma regra importante, talvez mereça:

```java
pedido.podeSerFaturado()
```

ou um serviço/regra nomeada:

```java
PoliticaFaturamento.podeFaturar(pedido)
```

Composição funcional ajuda, mas não substitui modelagem.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m7\aula-189-composicao-funcional-predicate-function-e-consumer
cd labs\m7\aula-189-composicao-funcional-predicate-function-e-consumer
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula189
mkdir src\br\com\curso\aula189\app
mkdir src\br\com\curso\aula189\dominio
mkdir src\br\com\curso\aula189\dominio\valor
mkdir src\br\com\curso\aula189\dominio\cliente
mkdir src\br\com\curso\aula189\dominio\produto
mkdir src\br\com\curso\aula189\dominio\pedido
mkdir src\br\com\curso\aula189\util
```

---

# Parte 1 — Predicate.and

## O que é Predicate.and

`Predicate.and` combina duas regras com lógica de:

```text
E
```

Exemplo:

```java
Predicate<String> naoNulo = texto -> texto != null;
Predicate<String> naoBranco = texto -> !texto.isBlank();

Predicate<String> valido = naoNulo.and(naoBranco);
```

A regra `valido` só retorna `true` se as duas forem verdadeiras.

---

## Primeiro exemplo com and

Crie:

```text
src\br\com\curso\aula189\app\PredicateAndBasicoApp.java
```

Código:

```java
package br.com.curso.aula189.app;

import java.util.function.Predicate;

public class PredicateAndBasicoApp {
    public static void main(String[] args) {
        Predicate<String> naoNulo = texto -> texto != null;
        Predicate<String> naoBranco = texto -> !texto.isBlank();
        Predicate<String> tamanhoMinimoTres = texto -> texto.length() >= 3;

        Predicate<String> textoValido = naoNulo
                .and(naoBranco)
                .and(tamanhoMinimoTres);

        testar(textoValido, "Ana");
        testar(textoValido, "A");
        testar(textoValido, "   ");
        testar(textoValido, null);
    }

    private static void testar(Predicate<String> predicate, String valor) {
        System.out.println("Valor [" + valor + "] válido? " + predicate.test(valor));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula189.app.PredicateAndBasicoApp
```

---

## Ordem importa

Neste trecho:

```java
Predicate<String> textoValido = naoNulo
        .and(naoBranco)
        .and(tamanhoMinimoTres);
```

a ordem evita erro.

Primeiro:

```java
texto != null
```

Depois:

```java
!texto.isBlank()
```

Depois:

```java
texto.length() >= 3
```

Se `naoBranco` viesse antes de `naoNulo`, o código poderia tentar chamar `isBlank()` em `null`.

---

## Short-circuit

`Predicate.and` usa curto-circuito.

Isso significa:

```text
se a primeira regra for false, a próxima nem executa.
```

Exemplo:

```java
naoNulo.and(naoBranco)
```

Se `naoNulo` retornar `false`, `naoBranco` não executa.

Isso protege contra null quando a ordem está correta.

---

# Parte 2 — Predicate.or

## O que é Predicate.or

`Predicate.or` combina regras com lógica de:

```text
OU
```

Exemplo:

```java
Predicate<String> admin = perfil -> perfil.equals("ADMIN");
Predicate<String> gestor = perfil -> perfil.equals("GESTOR");

Predicate<String> podeAcessar = admin.or(gestor);
```

A regra retorna `true` se uma das duas for verdadeira.

---

## App com or

Crie:

```text
src\br\com\curso\aula189\app\PredicateOrBasicoApp.java
```

Código:

```java
package br.com.curso.aula189.app;

import java.util.function.Predicate;

public class PredicateOrBasicoApp {
    public static void main(String[] args) {
        Predicate<String> admin = perfil -> "ADMIN".equals(perfil);
        Predicate<String> gestor = perfil -> "GESTOR".equals(perfil);
        Predicate<String> suporte = perfil -> "SUPORTE".equals(perfil);

        Predicate<String> podeAcessarPainel = admin
                .or(gestor)
                .or(suporte);

        testar(podeAcessarPainel, "ADMIN");
        testar(podeAcessarPainel, "GESTOR");
        testar(podeAcessarPainel, "SUPORTE");
        testar(podeAcessarPainel, "CLIENTE");
        testar(podeAcessarPainel, null);
    }

    private static void testar(Predicate<String> predicate, String perfil) {
        System.out.println("Perfil [" + perfil + "] pode acessar? " + predicate.test(perfil));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula189.app.PredicateOrBasicoApp
```

---

## Por que usamos "ADMIN".equals(perfil)

Este formato:

```java
"ADMIN".equals(perfil)
```

é seguro mesmo quando `perfil` é null.

Já isto:

```java
perfil.equals("ADMIN")
```

quebra se `perfil` for null.

Esse tipo de detalhe importa em validações.

---

# Parte 3 — Predicate.negate

## O que é negate

`negate` inverte o resultado de um Predicate.

Exemplo:

```java
Predicate<String> emBranco = String::isBlank;
Predicate<String> naoEmBranco = emBranco.negate();
```

Se `emBranco` retorna `true`, `naoEmBranco` retorna `false`.

---

## App com negate

Crie:

```text
src\br\com\curso\aula189\app\PredicateNegateApp.java
```

Código:

```java
package br.com.curso.aula189.app;

import java.util.function.Predicate;

public class PredicateNegateApp {
    public static void main(String[] args) {
        Predicate<Integer> positivo = numero -> numero != null && numero > 0;
        Predicate<Integer> naoPositivo = positivo.negate();

        System.out.println("10 positivo? " + positivo.test(10));
        System.out.println("10 não positivo? " + naoPositivo.test(10));

        System.out.println("-5 positivo? " + positivo.test(-5));
        System.out.println("-5 não positivo? " + naoPositivo.test(-5));

        System.out.println("null positivo? " + positivo.test(null));
        System.out.println("null não positivo? " + naoPositivo.test(null));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula189.app.PredicateNegateApp
```

---

## Cuidado semântico

Neste exemplo:

```java
Predicate<Integer> positivo = numero -> numero != null && numero > 0;
Predicate<Integer> naoPositivo = positivo.negate();
```

Para `null`, `positivo` retorna `false`.

Logo, `naoPositivo` retorna `true`.

Isso pode ou não ser o que você quer.

Às vezes, `null` deveria ser inválido, não “não positivo”.

Então pense na regra de negócio.

---

# Parte 4 — Function.andThen

## O que é Function.andThen

`andThen` encadeia transformações.

Exemplo:

```java
Function<String, String> trim = String::trim;
Function<String, String> upper = String::toUpperCase;

Function<String, String> normalizar = trim.andThen(upper);
```

Ordem:

```text
primeiro trim;
depois upper.
```

---

## App com andThen

Crie:

```text
src\br\com\curso\aula189\app\FunctionAndThenApp.java
```

Código:

```java
package br.com.curso.aula189.app;

import java.util.function.Function;

public class FunctionAndThenApp {
    public static void main(String[] args) {
        Function<String, String> trim = String::trim;
        Function<String, String> upper = String::toUpperCase;
        Function<String, String> prefixar = texto -> "CLIENTE: " + texto;

        Function<String, String> pipeline = trim
                .andThen(upper)
                .andThen(prefixar);

        System.out.println(pipeline.apply("  ana silva  "));
        System.out.println(pipeline.apply("  carlos souza  "));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula189.app.FunctionAndThenApp
```

---

## Como ler andThen

```java
trim.andThen(upper).andThen(prefixar)
```

Significa:

```text
aplique trim;
pegue o resultado e aplique upper;
pegue o resultado e aplique prefixar.
```

Entrada:

```text
"  ana silva  "
```

Saída:

```text
"CLIENTE: ANA SILVA"
```

---

# Parte 5 — Function.compose

## O que é Function.compose

`compose` também encadeia funções, mas a ordem de leitura é diferente.

Exemplo:

```java
Function<String, String> normalizar = upper.compose(trim);
```

Significa:

```text
primeiro trim;
depois upper.
```

A função passada para `compose` executa antes.

---

## App com compose

Crie:

```text
src\br\com\curso\aula189\app\FunctionComposeApp.java
```

Código:

```java
package br.com.curso.aula189.app;

import java.util.function.Function;

public class FunctionComposeApp {
    public static void main(String[] args) {
        Function<String, String> trim = String::trim;
        Function<String, String> upper = String::toUpperCase;

        Function<String, String> comAndThen = trim.andThen(upper);
        Function<String, String> comCompose = upper.compose(trim);

        System.out.println(comAndThen.apply("  java  "));
        System.out.println(comCompose.apply("  java  "));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula189.app.FunctionComposeApp
```

---

## andThen vs compose

```java
a.andThen(b)
```

significa:

```text
a depois b.
```

```java
b.compose(a)
```

significa:

```text
a antes de b.
```

Na prática, `andThen` costuma ser mais fácil de ler.

Use `compose` quando ele deixar a intenção clara.

---

# Parte 6 — Consumer.andThen

## O que é Consumer.andThen

`Consumer.andThen` encadeia ações.

Exemplo:

```java
Consumer<String> imprimir = System.out::println;
Consumer<String> auditar = texto -> System.out.println("Auditado: " + texto);

Consumer<String> pipeline = imprimir.andThen(auditar);
```

Primeiro imprime.

Depois audita.

---

## App com Consumer.andThen

Crie:

```text
src\br\com\curso\aula189\app\ConsumerAndThenApp.java
```

Código:

```java
package br.com.curso.aula189.app;

import java.util.function.Consumer;

public class ConsumerAndThenApp {
    public static void main(String[] args) {
        Consumer<String> imprimirOriginal = texto -> System.out.println("Original: " + texto);
        Consumer<String> imprimirNormalizado = texto -> System.out.println("Normalizado: " + texto.trim().toUpperCase());
        Consumer<String> imprimirTamanho = texto -> System.out.println("Tamanho: " + texto.length());

        Consumer<String> pipeline = imprimirOriginal
                .andThen(imprimirNormalizado)
                .andThen(imprimirTamanho);

        pipeline.accept("  java backend  ");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula189.app.ConsumerAndThenApp
```

---

## Cuidado com Consumer

Consumer tem efeito colateral.

Ele executa algo.

Se uma ação falhar, as próximas podem não executar.

Se uma ação muda estado, a ordem importa.

Por isso, use `Consumer.andThen` com clareza.

---

# Parte 7 — Domínio para composição

Agora vamos aplicar em um domínio.

## Email

Crie:

```text
src\br\com\curso\aula189\dominio\valor\Email.java
```

Código:

```java
package br.com.curso.aula189.dominio.valor;

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
src\br\com\curso\aula189\dominio\cliente\Cliente.java
```

Código:

```java
package br.com.curso.aula189.dominio.cliente;

import br.com.curso.aula189.dominio.valor.Email;

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

## App com composição de Predicate no domínio

Crie:

```text
src\br\com\curso\aula189\app\ClientePredicateComposicaoApp.java
```

Código:

```java
package br.com.curso.aula189.app;

import br.com.curso.aula189.dominio.cliente.Cliente;
import br.com.curso.aula189.dominio.valor.Email;

import java.util.List;
import java.util.function.Predicate;

public class ClientePredicateComposicaoApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true, false),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", true, true),
                new Cliente(new Email("maria@gmail.com"), "Maria Oliveira", true, false),
                new Cliente(new Email("joao@empresa.com"), "João Lima", false, false)
        );

        Predicate<Cliente> ativo = Cliente::ativo;
        Predicate<Cliente> naoBloqueado = Cliente::bloqueado;
        Predicate<Cliente> desbloqueado = naoBloqueado.negate();
        Predicate<Cliente> emailCorporativo = cliente -> cliente.email().dominio().equals("empresa.com");

        Predicate<Cliente> clienteApto = ativo
                .and(desbloqueado)
                .and(emailCorporativo);

        System.out.println("Clientes aptos:");

        for (Cliente cliente : clientes) {
            if (clienteApto.test(cliente)) {
                System.out.println(cliente.resumo());
            }
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula189.app.ClientePredicateComposicaoApp
```

---

## Observação sobre nomes

Este trecho:

```java
Predicate<Cliente> naoBloqueado = Cliente::bloqueado;
Predicate<Cliente> desbloqueado = naoBloqueado.negate();
```

funciona, mas o nome `naoBloqueado` está ruim.

Na verdade, `Cliente::bloqueado` testa se está bloqueado.

Melhor seria:

```java
Predicate<Cliente> bloqueado = Cliente::bloqueado;
Predicate<Cliente> desbloqueado = bloqueado.negate();
```

Vamos corrigir mentalmente essa intenção:

```java
Predicate<Cliente> bloqueado = Cliente::bloqueado;
Predicate<Cliente> desbloqueado = bloqueado.negate();
```

Nome ruim em Predicate causa bugs de leitura.

---

# Parte 8 — Composição de Function no domínio

## App de transformação de cliente

Crie:

```text
src\br\com\curso\aula189\app\ClienteFunctionComposicaoApp.java
```

Código:

```java
package br.com.curso.aula189.app;

import br.com.curso.aula189.dominio.cliente.Cliente;
import br.com.curso.aula189.dominio.valor.Email;

import java.util.function.Function;

public class ClienteFunctionComposicaoApp {
    public static void main(String[] args) {
        Cliente cliente = new Cliente(
                new Email("ana@empresa.com"),
                "Ana Silva",
                true,
                false
        );

        Function<Cliente, String> extrairNome = Cliente::nome;
        Function<String, String> maiusculo = String::toUpperCase;
        Function<String, String> prefixar = nome -> "CLIENTE: " + nome;

        Function<Cliente, String> gerarTitulo = extrairNome
                .andThen(maiusculo)
                .andThen(prefixar);

        System.out.println(gerarTitulo.apply(cliente));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula189.app.ClienteFunctionComposicaoApp
```

---

## Como ler esse pipeline

```java
extrairNome.andThen(maiusculo).andThen(prefixar)
```

Fluxo:

```text
Cliente -> String nome
String nome -> String maiúsculo
String maiúsculo -> String com prefixo
```

Tipo completo:

```java
Function<Cliente, String>
```

Mesmo passando por várias etapas, o resultado final recebe Cliente e retorna String.

---

# Parte 9 — Pipeline utilitário com composição

Vamos criar um utilitário que aplica filtro, mapeamento e consumo.

## PipelineUtil

Crie:

```text
src\br\com\curso\aula189\util\PipelineUtil.java
```

Código:

```java
package br.com.curso.aula189.util;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

public final class PipelineUtil {
    private PipelineUtil() {
    }

    public static <T, R> List<R> filtrarEMapear(
            List<T> itens,
            Predicate<? super T> filtro,
            Function<? super T, ? extends R> mapper
    ) {
        if (itens == null) {
            throw new IllegalArgumentException("Itens são obrigatórios.");
        }

        if (filtro == null) {
            throw new IllegalArgumentException("Filtro é obrigatório.");
        }

        if (mapper == null) {
            throw new IllegalArgumentException("Mapper é obrigatório.");
        }

        List<R> resultados = new ArrayList<>();

        for (T item : itens) {
            if (filtro.test(item)) {
                R resultado = mapper.apply(item);

                if (resultado == null) {
                    throw new IllegalStateException("Mapper retornou null.");
                }

                resultados.add(resultado);
            }
        }

        return List.copyOf(resultados);
    }

    public static <T> void consumirTodos(List<T> itens, Consumer<? super T> consumer) {
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
}
```

---

## App usando PipelineUtil

Crie:

```text
src\br\com\curso\aula189\app\PipelineClienteApp.java
```

Código:

```java
package br.com.curso.aula189.app;

import br.com.curso.aula189.dominio.cliente.Cliente;
import br.com.curso.aula189.dominio.valor.Email;
import br.com.curso.aula189.util.PipelineUtil;

import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;

public class PipelineClienteApp {
    public static void main(String[] args) {
        List<Cliente> clientes = List.of(
                new Cliente(new Email("ana@empresa.com"), "Ana Silva", true, false),
                new Cliente(new Email("carlos@empresa.com"), "Carlos Souza", true, true),
                new Cliente(new Email("maria@gmail.com"), "Maria Oliveira", true, false),
                new Cliente(new Email("joao@empresa.com"), "João Lima", false, false)
        );

        Predicate<Cliente> ativo = Cliente::ativo;
        Predicate<Cliente> bloqueado = Cliente::bloqueado;
        Predicate<Cliente> desbloqueado = bloqueado.negate();
        Predicate<Cliente> corporativo = cliente -> cliente.email().dominio().equals("empresa.com");

        Predicate<Cliente> apto = ativo
                .and(desbloqueado)
                .and(corporativo);

        Function<Cliente, String> paraResumo = Cliente::resumo;
        Function<String, String> prefixar = resumo -> "APTO -> " + resumo;

        Function<Cliente, String> mapper = paraResumo.andThen(prefixar);

        Consumer<String> imprimir = System.out::println;

        List<String> resumos = PipelineUtil.filtrarEMapear(clientes, apto, mapper);

        PipelineUtil.consumirTodos(resumos, imprimir);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula189.app.PipelineClienteApp
```

---

## O que este pipeline prepara

Este código:

```java
List<String> resumos = PipelineUtil.filtrarEMapear(clientes, apto, mapper);

PipelineUtil.consumirTodos(resumos, imprimir);
```

é uma preparação para:

```java
clientes.stream()
        .filter(apto)
        .map(mapper)
        .forEach(imprimir);
```

Ainda vamos chegar em Streams.

Por enquanto, o objetivo é entender a base.

---

# Parte 10 — Produto com composição

## Produto

Crie:

```text
src\br\com\curso\aula189\dominio\produto\Produto.java
```

Código:

```java
package br.com.curso.aula189.dominio.produto;

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

## App Produto

Crie:

```text
src\br\com\curso\aula189\app\ProdutoComposicaoApp.java
```

Código:

```java
package br.com.curso.aula189.app;

import br.com.curso.aula189.dominio.produto.Produto;
import br.com.curso.aula189.util.PipelineUtil;

import java.math.BigDecimal;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;

public class ProdutoComposicaoApp {
    public static void main(String[] args) {
        List<Produto> produtos = List.of(
                new Produto("prd-001", "Notebook", new BigDecimal("3500.00"), true, 5),
                new Produto("prd-002", "Mouse", new BigDecimal("80.00"), true, 20),
                new Produto("prd-003", "Monitor", new BigDecimal("1200.00"), false, 10),
                new Produto("prd-004", "Teclado", new BigDecimal("150.00"), true, 0)
        );

        Predicate<Produto> ativo = Produto::ativo;
        Predicate<Produto> comEstoque = produto -> produto.estoque() > 0;
        Predicate<Produto> precoMaiorQueCem = produto -> produto.preco().compareTo(new BigDecimal("100.00")) > 0;

        Predicate<Produto> elegivelParaOferta = ativo
                .and(comEstoque)
                .and(precoMaiorQueCem);

        Function<Produto, String> resumo = Produto::resumo;
        Function<String, String> prefixar = texto -> "OFERTA -> " + texto;

        List<String> ofertas = PipelineUtil.filtrarEMapear(
                produtos,
                elegivelParaOferta,
                resumo.andThen(prefixar)
        );

        PipelineUtil.consumirTodos(ofertas, System.out::println);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula189.app.ProdutoComposicaoApp
```

---

## Ponto de arquitetura no Produto

Repare que `Produto` tem:

```java
public boolean disponivel() {
    return ativo && estoque > 0;
}
```

Poderíamos usar:

```java
Predicate<Produto> disponivel = Produto::disponivel;
```

Isso é melhor quando a regra é importante e pertence ao domínio.

Então poderíamos escrever:

```java
Predicate<Produto> disponivel = Produto::disponivel;
Predicate<Produto> precoMaiorQueCem = produto -> produto.preco().compareTo(new BigDecimal("100.00")) > 0;

Predicate<Produto> elegivelParaOferta = disponivel.and(precoMaiorQueCem);
```

Essa versão expressa melhor a regra.

Regra do curso:

```text
quando a regra pertence ao domínio, dê nome no domínio.
```

---

# Parte 11 — Boas práticas de composição

## 1. Nomeie predicates importantes

Evite:

```java
cliente -> cliente.ativo() && !cliente.bloqueado()
```

Se isso significa uma regra importante, prefira:

```java
Cliente::podeOperar
```

ou:

```java
Predicate<Cliente> clientePodeOperar = Cliente::podeOperar;
```

---

## 2. Mantenha funções pequenas

Bom:

```java
Function<Cliente, String> extrairNome = Cliente::nome;
Function<String, String> upper = String::toUpperCase;
Function<String, String> prefixar = nome -> "CLIENTE: " + nome;
```

Evite uma função gigante com tudo dentro.

---

## 3. Cuidado com null

Composição não resolve null automaticamente.

Se null pode existir, trate antes.

```java
Predicate<String> textoValido = texto -> texto != null && !texto.isBlank();
```

---

## 4. Não transforme pipeline em enigma

Se a composição ficar difícil de ler, quebre em variáveis.

Ruim:

```java
clientes.stream().filter(a.and(b.negate()).or(c.and(d))).map(x.andThen(y).compose(z))
```

Melhor:

```java
Predicate<Cliente> clienteApto = ativo
        .and(desbloqueado)
        .and(corporativo);

Function<Cliente, String> resumoFormatado = gerarResumo
        .andThen(prefixar);
```

---

## 5. Extraia regra de domínio quando necessário

Se uma regra é importante, coloque no domínio:

```java
cliente.podeOperar()
produto.disponivel()
pedido.podeCancelar()
ordemServico.podeConcluir()
```

Depois use method reference:

```java
Cliente::podeOperar
Produto::disponivel
```

---

# Parte 12 — Erros comuns

## 1. Ordem errada em Predicate.and

Se você chama método antes de validar null, pode quebrar.

```java
Predicate<String> ruim = String::isBlank;
ruim.test(null);
```

---

## 2. Nome invertido

Errado:

```java
Predicate<Cliente> naoBloqueado = Cliente::bloqueado;
```

Isso confunde.

Melhor:

```java
Predicate<Cliente> bloqueado = Cliente::bloqueado;
Predicate<Cliente> desbloqueado = bloqueado.negate();
```

---

## 3. compose sem clareza

`compose` pode dificultar leitura.

Se `andThen` for mais claro, prefira `andThen`.

---

## 4. Consumer com efeito colateral escondido

Evite:

```java
Consumer<Pedido> acao = pedido -> {
    pedido.cancelar("x");
    repository.salvar(pedido);
    email.enviar(pedido);
};
```

Isso merece método, service ou use case.

---

## 5. Criar pipeline funcional para tudo

Nem todo fluxo precisa ser funcional.

Às vezes um `if` bem escrito é melhor.

Código bom é código claro.

---

# Parte 13 — Atividade guiada

Execute em ordem:

```powershell
java -cp out br.com.curso.aula189.app.PredicateAndBasicoApp
java -cp out br.com.curso.aula189.app.PredicateOrBasicoApp
java -cp out br.com.curso.aula189.app.PredicateNegateApp
java -cp out br.com.curso.aula189.app.FunctionAndThenApp
java -cp out br.com.curso.aula189.app.FunctionComposeApp
java -cp out br.com.curso.aula189.app.ConsumerAndThenApp
java -cp out br.com.curso.aula189.app.ClientePredicateComposicaoApp
java -cp out br.com.curso.aula189.app.ClienteFunctionComposicaoApp
java -cp out br.com.curso.aula189.app.PipelineClienteApp
java -cp out br.com.curso.aula189.app.ProdutoComposicaoApp
```

Para cada execução, responda:

```text
qual composição foi usada?
a ordem de execução importa?
alguma regra deveria estar no domínio?
a composição melhorou ou piorou a leitura?
qual seria a versão com if?
```

---

# Parte 14 — Desafio prático

Crie uma entidade:

```text
src\br\com\curso\aula189\dominio\pedido\Pedido.java
```

Campos:

```text
String codigo;
String cliente;
BigDecimal valor;
boolean pago;
boolean cancelado;
```

Métodos:

```text
codigo();
cliente();
valor();
pago();
cancelado();
podeFaturar();
resumo();
```

Regra de `podeFaturar()`:

```text
pedido pago;
não cancelado;
valor maior que zero.
```

Crie app:

```text
src\br\com\curso\aula189\app\PedidoComposicaoApp.java
```

Use:

```text
Predicate<Pedido> podeFaturar = Pedido::podeFaturar;
Predicate<Pedido> valorAlto = pedido -> pedido.valor().compareTo(new BigDecimal("1000.00")) > 0;
Function<Pedido, String> resumo = Pedido::resumo;
Function<String, String> prefixar = texto -> "FATURAR -> " + texto;
Consumer<String> imprimir = System.out::println;
```

Fluxo:

```text
lista de pedidos;
filtrar pedidos que podem faturar;
filtrar valor alto;
mapear para resumo prefixado;
imprimir.
```

Critério principal:

```text
regra principal no domínio;
composição funcional para filtro adicional e apresentação.
```

---

## Desafio extra

Crie utilitário:

```text
src\br\com\curso\aula189\util\ValidadorComposto.java
```

Método:

```java
public static <T> Predicate<T> todos(List<Predicate<T>> regras)
```

Regras:

```text
lista não pode ser null;
lista não pode ser vazia;
nenhuma regra pode ser null;
retornar Predicate que exige todas as regras verdadeiras.
```

Crie também:

```java
public static <T> Predicate<T> qualquer(List<Predicate<T>> regras)
```

Regras:

```text
retornar Predicate que exige pelo menos uma regra verdadeira.
```

Crie app:

```text
src\br\com\curso\aula189\app\ValidadorCompostoApp.java
```

Use com `Cliente` ou `Produto`.

Critério principal:

```text
criar composição dinâmica de predicates.
```

---

# Parte 15 — Debug recomendado

Coloque breakpoints em:

```text
PredicateAndBasicoApp
PredicateOrBasicoApp
PredicateNegateApp
FunctionAndThenApp
FunctionComposeApp
ConsumerAndThenApp
PipelineUtil.filtrarEMapear
PipelineUtil.consumirTodos
ClientePredicateComposicaoApp
ProdutoComposicaoApp
```

Observe:

```text
quando cada predicate executa;
quando o curto-circuito impede a próxima regra;
qual function executa primeiro;
qual consumer executa primeiro;
como o item passa pelo filtro;
como o item é mapeado;
como a saída é consumida.
```

Pontos de atenção:

```java
predicate.test(...)
function.apply(...)
consumer.accept(...)
```

Esses pontos mostram a execução real.

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Para que serve Predicate.and?
2. Para que serve Predicate.or?
3. Para que serve Predicate.negate?
4. Qual a diferença entre Function.andThen e Function.compose?
5. Quando uma regra composta deve virar método de domínio?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
usar Predicate.and;
usar Predicate.or;
usar Predicate.negate;
entender curto-circuito;
entender ordem de predicates;
usar Function.andThen;
usar Function.compose;
usar Consumer.andThen;
criar pipelines pequenos;
aplicar composição em Cliente;
aplicar composição em Produto;
usar PipelineUtil;
entender quando composição melhora leitura;
entender quando composição piora leitura;
mover regra importante para domínio;
resolver PedidoComposicaoApp;
resolver ValidadorCompostoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m7/aula-189-composicao-funcional-predicate-function-e-consumer
git commit -m "Aula 189: composicao funcional predicate function e consumer"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
composição funcional permite montar fluxos maiores a partir de comportamentos pequenos e nomeados.
```

Você estudou:

```text
Predicate.and;
Predicate.or;
Predicate.negate;
Function.andThen;
Function.compose;
Consumer.andThen;
pipelines pequenos;
validações combinadas;
transformações encadeadas;
ações em sequência.
```

Também reforçou uma regra importante:

```text
composição não substitui domínio.
```

Quando uma regra é importante para o negócio, ela precisa ter nome e lugar correto.

Na próxima aula, vamos entrar no assunto que naturalmente nasce dessa base:

```text
Streams API
```

Vamos entender o que é `stream()`, por que ele existe e como `filter`, `map` e `forEach` usam exatamente as interfaces funcionais que você acabou de estudar.
