# 176 — M6.05 — Wildcards: `?`, `extends`, `super` e a regra PECS

## Objetivo da aula

Nesta aula você vai estudar um dos assuntos mais importantes e mais confundidos de Generics em Java:

```text
wildcards
```

Wildcards aparecem com o símbolo:

```java
?
```

Exemplos:

```java
List<?>
List<? extends Number>
List<? super Integer>
```

Na aula anterior, você estudou bounded types com `extends`:

```java
<T extends PossuiResumo>
<T extends Comparable<T>>
<T extends PossuiIdentificador<ID>>
```

Agora vamos entender quando, em vez de declarar um tipo `T`, usamos uma interrogação.

Ao final desta aula, você deve conseguir:

```text
entender o que é wildcard;
entender List<?>;
entender List<? extends T>;
entender List<? super T>;
entender a diferença entre T e ?;
entender por que List<Integer> não é List<Number>;
entender covariance e contravariance na prática;
aplicar a regra PECS;
saber quando uma lista é produtora;
saber quando uma lista é consumidora;
evitar casts desnecessários;
criar métodos flexíveis com wildcards;
entender wildcards em APIs Java e frameworks.
```

---

## Ideia principal

Wildcards servem para deixar um método mais flexível quando você não precisa saber exatamente o tipo concreto.

Exemplo:

```java
public static void imprimirTodos(List<?> itens)
```

Esse método aceita:

```text
List<String>;
List<Integer>;
List<OrdemServico>;
List<Cliente>.
```

Mas existe um limite:

```text
se você não sabe o tipo exato,
também não pode adicionar qualquer coisa com segurança.
```

Esse é o centro da aula.

---

## Por que `List<Integer>` não é `List<Number>`

Em Java, `Integer` herda de `Number`.

Então isso é válido:

```java
Number numero = Integer.valueOf(10);
```

Mas isto não é válido:

```java
List<Number> numeros = new ArrayList<Integer>();
```

Por quê?

Porque se fosse permitido, daria problema.

Imagine:

```java
List<Integer> inteiros = new ArrayList<>();
List<Number> numeros = inteiros;

numeros.add(10.5);
```

`10.5` é `Double`.

`Double` é `Number`.

Mas a lista real era de `Integer`.

Isso quebraria a segurança da lista.

Por isso:

```text
List<Integer> não é subtipo de List<Number>.
```

Wildcards ajudam a lidar com essa situação de forma controlada.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m6\aula-176-wildcards-interrogacao-extends-super
cd labs\m6\aula-176-wildcards-interrogacao-extends-super
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula176
mkdir src\br\com\curso\aula176\app
mkdir src\br\com\curso\aula176\dominio
mkdir src\br\com\curso\aula176\dominio\valor
mkdir src\br\com\curso\aula176\dominio\atendimento
mkdir src\br\com\curso\aula176\util
```

---

## Exemplo 1 — List<?> para imprimir qualquer lista

Crie:

```text
src\br\com\curso\aula176\util\ImpressoraWildcard.java
```

Código:

```java
package br.com.curso.aula176.util;

import java.util.List;

public final class ImpressoraWildcard {
    private ImpressoraWildcard() {
    }

    public static void imprimirTodos(List<?> itens) {
        if (itens == null) {
            throw new IllegalArgumentException("Lista é obrigatória.");
        }

        for (Object item : itens) {
            System.out.println("- " + item);
        }
    }
}
```

---

## Como ler `List<?>`

```java
List<?>
```

Significa:

```text
lista de algum tipo desconhecido.
```

Pode ser:

```text
List<String>;
List<Integer>;
List<Cliente>;
List<OrdemServico>.
```

O método não sabe qual é o tipo exato.

Por isso ele só pode tratar os itens de forma segura como:

```java
Object
```

---

## App com List<?>

Crie:

```text
src\br\com\curso\aula176\app\WildcardBasicoApp.java
```

Código:

```java
package br.com.curso.aula176.app;

import br.com.curso.aula176.util.ImpressoraWildcard;

import java.util.List;

public class WildcardBasicoApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Carlos", "Mariana");
        List<Integer> numeros = List.of(10, 20, 30);
        List<Boolean> flags = List.of(true, false, true);

        System.out.println("Nomes:");
        ImpressoraWildcard.imprimirTodos(nomes);

        System.out.println();
        System.out.println("Números:");
        ImpressoraWildcard.imprimirTodos(numeros);

        System.out.println();
        System.out.println("Flags:");
        ImpressoraWildcard.imprimirTodos(flags);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula176.app.WildcardBasicoApp
```

---

## O que `List<?>` permite e não permite

Com `List<?>`, você pode:

```text
ler elementos como Object;
percorrer;
ver tamanho;
verificar se está vazia;
imprimir;
copiar.
```

Mas não pode adicionar elementos concretos com segurança.

Exemplo que não compila:

```java
public static void adicionar(List<?> itens) {
    itens.add("Ana");
}
```

Por quê?

Porque a lista pode ser:

```text
List<Integer>;
List<Cliente>;
List<LocalDate>.
```

Adicionar `"Ana"` poderia quebrar o tipo real da lista.

---

## Exemplo 2 — O problema com List<Number>

Crie:

```text
src\br\com\curso\aula176\app\ProblemaListNumberApp.java
```

Código:

```java
package br.com.curso.aula176.app;

import java.util.List;

public class ProblemaListNumberApp {
    public static void main(String[] args) {
        List<Integer> inteiros = List.of(10, 20, 30);
        List<Double> decimais = List.of(10.5, 20.5, 30.5);

        imprimirComoNumber(inteiros);
        imprimirComoNumber(decimais);
    }

    private static void imprimirComoNumber(List<? extends Number> numeros) {
        for (Number numero : numeros) {
            System.out.println("- " + numero);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula176.app.ProblemaListNumberApp
```

---

## Por que usamos `? extends Number`

O método recebe:

```java
List<? extends Number>
```

Isso significa:

```text
lista de algum tipo que é Number ou filho de Number.
```

Aceita:

```text
List<Number>;
List<Integer>;
List<Double>;
List<Long>;
List<BigDecimal não entra aqui porque BigDecimal não estende Number? 
```

Observação: `BigDecimal` estende `Number`, então entra sim.

O método consegue ler cada item como:

```java
Number
```

Porque todo elemento é pelo menos um `Number`.

---

## Corrigindo a observação sobre BigDecimal

`BigDecimal` também é subtipo de `Number`.

Então isto é compatível com:

```java
List<? extends Number>
```

Exemplos válidos:

```text
List<Integer>;
List<Double>;
List<Long>;
List<BigDecimal>.
```

Essa é uma boa lembrança: quando trabalhar com hierarquia, confirme quem herda de quem.

---

## `? extends T` significa produtor

Quando você usa:

```java
List<? extends Number>
```

Você está dizendo:

```text
essa lista produz Numbers para mim.
```

Você pode ler:

```java
Number numero = numeros.get(0);
```

Mas não deve adicionar números concretos.

Exemplo que não compila:

```java
numeros.add(Integer.valueOf(10));
```

Por quê?

Porque a lista real pode ser:

```text
List<Double>
```

Adicionar `Integer` em uma lista real de `Double` quebraria a segurança.

---

## Exemplo 3 — Somando números com extends

Crie:

```text
src\br\com\curso\aula176\util\CalculadoraNumerica.java
```

Código:

```java
package br.com.curso.aula176.util;

import java.util.List;

public final class CalculadoraNumerica {
    private CalculadoraNumerica() {
    }

    public static double somar(List<? extends Number> numeros) {
        if (numeros == null) {
            throw new IllegalArgumentException("Lista é obrigatória.");
        }

        double total = 0.0;

        for (Number numero : numeros) {
            if (numero == null) {
                throw new IllegalArgumentException("Número nulo não é permitido.");
            }

            total += numero.doubleValue();
        }

        return total;
    }
}
```

Crie:

```text
src\br\com\curso\aula176\app\SomaWildcardExtendsApp.java
```

Código:

```java
package br.com.curso.aula176.app;

import br.com.curso.aula176.util.CalculadoraNumerica;

import java.math.BigDecimal;
import java.util.List;

public class SomaWildcardExtendsApp {
    public static void main(String[] args) {
        List<Integer> inteiros = List.of(10, 20, 30);
        List<Double> decimais = List.of(10.5, 20.5, 30.5);
        List<BigDecimal> valores = List.of(
                new BigDecimal("10.25"),
                new BigDecimal("20.75")
        );

        System.out.println("Soma inteiros: " + CalculadoraNumerica.somar(inteiros));
        System.out.println("Soma decimais: " + CalculadoraNumerica.somar(decimais));
        System.out.println("Soma BigDecimal: " + CalculadoraNumerica.somar(valores));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula176.app.SomaWildcardExtendsApp
```

---

## Cuidado com double e dinheiro

Neste exemplo, usamos:

```java
double
```

apenas para demonstrar wildcards com `Number`.

Para dinheiro em backend real, você já sabe:

```text
use BigDecimal.
```

Não transforme regra financeira séria em `double`.

Aqui o objetivo é Generics.

---

## Exemplo 4 — `? super T`

Agora vamos estudar o outro lado.

```java
List<? super Integer>
```

Significa:

```text
lista de algum tipo que é Integer ou pai de Integer.
```

Aceita:

```text
List<Integer>;
List<Number>;
List<Object>.
```

Essa lista é boa para consumir/adicionar `Integer`.

---

## Criando utilitário com super

Crie:

```text
src\br\com\curso\aula176\util\PreenchedorNumerico.java
```

Código:

```java
package br.com.curso.aula176.util;

import java.util.List;

public final class PreenchedorNumerico {
    private PreenchedorNumerico() {
    }

    public static void adicionarInteirosBasicos(List<? super Integer> destino) {
        if (destino == null) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        destino.add(10);
        destino.add(20);
        destino.add(30);
    }
}
```

---

## Por que `? super Integer` permite adicionar Integer

Se o destino for:

```text
List<Integer>
```

adicionar `Integer` é seguro.

Se for:

```text
List<Number>
```

adicionar `Integer` também é seguro, porque `Integer` é `Number`.

Se for:

```text
List<Object>
```

adicionar `Integer` também é seguro, porque `Integer` é `Object`.

Por isso `? super Integer` é bom para consumir valores `Integer`.

---

## App com super

Crie:

```text
src\br\com\curso\aula176\app\WildcardSuperApp.java
```

Código:

```java
package br.com.curso.aula176.app;

import br.com.curso.aula176.util.PreenchedorNumerico;

import java.util.ArrayList;
import java.util.List;

public class WildcardSuperApp {
    public static void main(String[] args) {
        List<Integer> inteiros = new ArrayList<>();
        List<Number> numeros = new ArrayList<>();
        List<Object> objetos = new ArrayList<>();

        PreenchedorNumerico.adicionarInteirosBasicos(inteiros);
        PreenchedorNumerico.adicionarInteirosBasicos(numeros);
        PreenchedorNumerico.adicionarInteirosBasicos(objetos);

        System.out.println("Inteiros: " + inteiros);
        System.out.println("Números: " + numeros);
        System.out.println("Objetos: " + objetos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula176.app.WildcardSuperApp
```

---

## O limite de leitura em `? super T`

Com:

```java
List<? super Integer>
```

você pode adicionar `Integer`.

Mas ao ler, o tipo seguro é:

```java
Object
```

Por quê?

Porque a lista pode ser:

```text
List<Integer>;
List<Number>;
List<Object>.
```

O único tipo garantido para leitura em todos esses casos é:

```java
Object
```

Exemplo:

```java
Object valor = destino.get(0);
```

Não é seguro dizer:

```java
Integer valor = destino.get(0);
```

porque o destino real pode ser `List<Number>` contendo outros tipos de `Number`.

---

## Regra PECS

A regra mais famosa de wildcards é:

```text
PECS
```

Significa:

```text
Producer Extends, Consumer Super
```

Em português:

```text
se a estrutura produz dados para você ler, use extends;
se a estrutura consome dados que você adiciona, use super.
```

### Producer Extends

Se você só lê:

```java
List<? extends Number>
```

### Consumer Super

Se você adiciona:

```java
List<? super Integer>
```

Essa regra ajuda muito.

---

## Exemplo 5 — Copiar de uma lista para outra

Vamos criar o exemplo clássico de PECS.

Crie:

```text
src\br\com\curso\aula176\util\CopiadorGenerico.java
```

Código:

```java
package br.com.curso.aula176.util;

import java.util.List;

public final class CopiadorGenerico {
    private CopiadorGenerico() {
    }

    public static <T> void copiar(
            List<? extends T> origem,
            List<? super T> destino
    ) {
        if (origem == null) {
            throw new IllegalArgumentException("Origem é obrigatória.");
        }

        if (destino == null) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        for (T item : origem) {
            if (item == null) {
                throw new IllegalArgumentException("Item nulo não é permitido.");
            }

            destino.add(item);
        }
    }
}
```

---

## Como ler copiar

```java
List<? extends T> origem
```

A origem é produtora.

Ela produz itens para leitura.

```java
List<? super T> destino
```

O destino é consumidor.

Ele consome itens adicionados.

Essa é a regra PECS na prática:

```text
Producer Extends;
Consumer Super.
```

---

## App copiando listas

Crie:

```text
src\br\com\curso\aula176\app\CopiadorGenericoApp.java
```

Código:

```java
package br.com.curso.aula176.app;

import br.com.curso.aula176.util.CopiadorGenerico;

import java.util.ArrayList;
import java.util.List;

public class CopiadorGenericoApp {
    public static void main(String[] args) {
        List<Integer> origemInteiros = List.of(10, 20, 30);

        List<Integer> destinoInteiros = new ArrayList<>();
        List<Number> destinoNumeros = new ArrayList<>();
        List<Object> destinoObjetos = new ArrayList<>();

        CopiadorGenerico.copiar(origemInteiros, destinoInteiros);
        CopiadorGenerico.copiar(origemInteiros, destinoNumeros);
        CopiadorGenerico.copiar(origemInteiros, destinoObjetos);

        System.out.println("Destino Integer: " + destinoInteiros);
        System.out.println("Destino Number: " + destinoNumeros);
        System.out.println("Destino Object: " + destinoObjetos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula176.app.CopiadorGenericoApp
```

---

## Domínio para exemplos de backend

Agora vamos criar um domínio simples de atendimento.

Crie:

```text
src\br\com\curso\aula176\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula176.dominio.valor;

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
src\br\com\curso\aula176\dominio\atendimento\Atendimento.java
```

Código:

```java
package br.com.curso.aula176.dominio.atendimento;

import br.com.curso.aula176.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class Atendimento {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataEntrada;

    public Atendimento(CodigoOs codigo, String cliente, LocalDate dataEntrada) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataEntrada == null) {
            throw new IllegalArgumentException("Data de entrada é obrigatória.");
        }

        this.codigo = codigo;
        this.cliente = cliente.trim();
        this.dataEntrada = dataEntrada;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public LocalDate dataEntrada() {
        return dataEntrada;
    }

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Entrada: " + dataEntrada;
    }

    @Override
    public String toString() {
        return resumo();
    }
}
```

Crie:

```text
src\br\com\curso\aula176\dominio\atendimento\AtendimentoCritico.java
```

Código:

```java
package br.com.curso.aula176.dominio.atendimento;

import br.com.curso.aula176.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class AtendimentoCritico extends Atendimento {
    private final String motivoCriticidade;

    public AtendimentoCritico(
            CodigoOs codigo,
            String cliente,
            LocalDate dataEntrada,
            String motivoCriticidade
    ) {
        super(codigo, cliente, dataEntrada);

        if (motivoCriticidade == null || motivoCriticidade.isBlank()) {
            throw new IllegalArgumentException("Motivo de criticidade é obrigatório.");
        }

        this.motivoCriticidade = motivoCriticidade.trim();
    }

    public String motivoCriticidade() {
        return motivoCriticidade;
    }

    @Override
    public String resumo() {
        return super.resumo() + " | Crítico: " + motivoCriticidade;
    }
}
```

---

## Utilitário de atendimento com extends

Crie:

```text
src\br\com\curso\aula176\util\RelatorioAtendimentoWildcard.java
```

Código:

```java
package br.com.curso.aula176.util;

import br.com.curso.aula176.dominio.atendimento.Atendimento;

import java.util.List;

public final class RelatorioAtendimentoWildcard {
    private RelatorioAtendimentoWildcard() {
    }

    public static void imprimir(List<? extends Atendimento> atendimentos) {
        if (atendimentos == null) {
            throw new IllegalArgumentException("Atendimentos são obrigatórios.");
        }

        for (Atendimento atendimento : atendimentos) {
            System.out.println("- " + atendimento.resumo());
        }
    }
}
```

---

## Por que `? extends Atendimento`

Esse método pode receber:

```text
List<Atendimento>;
List<AtendimentoCritico>;
List<qualquer subtipo de Atendimento>.
```

Ele só precisa ler os atendimentos e imprimir.

Então a lista é produtora.

Pela regra PECS:

```text
Producer Extends
```

---

## App de relatório com extends

Crie:

```text
src\br\com\curso\aula176\app\RelatorioAtendimentoWildcardApp.java
```

Código:

```java
package br.com.curso.aula176.app;

import br.com.curso.aula176.dominio.atendimento.Atendimento;
import br.com.curso.aula176.dominio.atendimento.AtendimentoCritico;
import br.com.curso.aula176.dominio.valor.CodigoOs;
import br.com.curso.aula176.util.RelatorioAtendimentoWildcard;

import java.time.LocalDate;
import java.util.List;

public class RelatorioAtendimentoWildcardApp {
    public static void main(String[] args) {
        List<Atendimento> atendimentos = List.of(
                new Atendimento(
                        new CodigoOs("OS-2026-0001"),
                        "Ana Silva",
                        LocalDate.of(2026, 12, 10)
                )
        );

        List<AtendimentoCritico> criticos = List.of(
                new AtendimentoCritico(
                        new CodigoOs("OS-2026-0002"),
                        "Carlos Souza",
                        LocalDate.of(2026, 12, 11),
                        "Cliente VIP sem atendimento"
                )
        );

        System.out.println("Atendimentos comuns:");
        RelatorioAtendimentoWildcard.imprimir(atendimentos);

        System.out.println();
        System.out.println("Atendimentos críticos:");
        RelatorioAtendimentoWildcard.imprimir(criticos);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula176.app.RelatorioAtendimentoWildcardApp
```

---

## Utilitário de fila com super

Agora vamos criar um método que adiciona atendimentos críticos em um destino.

Crie:

```text
src\br\com\curso\aula176\util\FilaAtendimentoWildcard.java
```

Código:

```java
package br.com.curso.aula176.util;

import br.com.curso.aula176.dominio.atendimento.AtendimentoCritico;
import br.com.curso.aula176.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.List;

public final class FilaAtendimentoWildcard {
    private FilaAtendimentoWildcard() {
    }

    public static void adicionarCriticosDemo(List<? super AtendimentoCritico> destino) {
        if (destino == null) {
            throw new IllegalArgumentException("Destino é obrigatório.");
        }

        destino.add(new AtendimentoCritico(
                new CodigoOs("OS-2026-9001"),
                "Cliente Crítico A",
                LocalDate.of(2026, 12, 10),
                "Sem atendimento há mais de 48h"
        ));

        destino.add(new AtendimentoCritico(
                new CodigoOs("OS-2026-9002"),
                "Cliente Crítico B",
                LocalDate.of(2026, 12, 11),
                "Reincidência de falha"
        ));
    }
}
```

---

## Por que `? super AtendimentoCritico`

O método adiciona `AtendimentoCritico`.

Então o destino pode ser:

```text
List<AtendimentoCritico>;
List<Atendimento>;
List<Object>.
```

Todos aceitam um `AtendimentoCritico`.

A lista é consumidora.

Pela regra PECS:

```text
Consumer Super
```

---

## App com fila usando super

Crie:

```text
src\br\com\curso\aula176\app\FilaAtendimentoWildcardApp.java
```

Código:

```java
package br.com.curso.aula176.app;

import br.com.curso.aula176.dominio.atendimento.Atendimento;
import br.com.curso.aula176.dominio.atendimento.AtendimentoCritico;
import br.com.curso.aula176.util.FilaAtendimentoWildcard;

import java.util.ArrayList;
import java.util.List;

public class FilaAtendimentoWildcardApp {
    public static void main(String[] args) {
        List<AtendimentoCritico> filaCriticos = new ArrayList<>();
        List<Atendimento> filaAtendimentos = new ArrayList<>();
        List<Object> filaObjetos = new ArrayList<>();

        FilaAtendimentoWildcard.adicionarCriticosDemo(filaCriticos);
        FilaAtendimentoWildcard.adicionarCriticosDemo(filaAtendimentos);
        FilaAtendimentoWildcard.adicionarCriticosDemo(filaObjetos);

        System.out.println("Fila de críticos: " + filaCriticos.size());
        System.out.println("Fila de atendimentos: " + filaAtendimentos.size());
        System.out.println("Fila de objetos: " + filaObjetos.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula176.app.FilaAtendimentoWildcardApp
```

---

## Diferença prática entre T e ?

### Usando T

```java
public static <T> void copiar(List<T> origem, List<T> destino)
```

Isso exige que origem e destino tenham exatamente o mesmo tipo `T`.

### Usando wildcard

```java
public static <T> void copiar(List<? extends T> origem, List<? super T> destino)
```

Isso permite mais flexibilidade.

Exemplo:

```text
origem List<Integer>;
destino List<Number>.
```

Com `T` puro, isso pode ficar rígido demais.

Com wildcard, fica correto.

---

## Quando usar `?`

Use `?` quando:

```text
você quer aceitar famílias de tipos;
o método não precisa saber o tipo exato;
você quer flexibilidade em parâmetros;
a lista é apenas produtora;
a lista é apenas consumidora.
```

Exemplos:

```java
List<?>
List<? extends Atendimento>
List<? super AtendimentoCritico>
```

---

## Quando usar `<T>`

Use `<T>` quando:

```text
você precisa relacionar tipos entre parâmetros e retorno;
o tipo precisa ser lembrado pelo método;
o retorno depende do tipo recebido;
você precisa expressar que dois parâmetros usam o mesmo tipo.
```

Exemplo:

```java
public static <T> T primeiro(List<T> itens)
```

Aqui precisamos retornar o mesmo tipo da lista.

---

## Comparação rápida

```java
void imprimir(List<?> itens)
```

Bom para:

```text
imprimir qualquer coisa;
não retornar tipo específico.
```

```java
<T> T primeiro(List<T> itens)
```

Bom para:

```text
retornar o mesmo tipo dos itens.
```

```java
void imprimirAtendimentos(List<? extends Atendimento> itens)
```

Bom para:

```text
ler atendimentos ou subtipos.
```

```java
void adicionarCritico(List<? super AtendimentoCritico> destino)
```

Bom para:

```text
adicionar AtendimentoCritico em lista compatível.
```

---

## Wildcards e retorno de métodos

Evite, como regra geral, retornar wildcard em métodos públicos sem necessidade.

Exemplo ruim na maioria dos casos:

```java
public List<? extends Atendimento> listar()
```

Isso pode dificultar o uso por quem chama.

Prefira retornar um tipo claro:

```java
public List<Atendimento> listar()
```

ou:

```java
public List<AtendimentoCritico> listarCriticos()
```

Wildcards são mais comuns em parâmetros.

---

## Ligação com backend

Wildcards aparecem muito em APIs de bibliotecas e frameworks.

Exemplos conceituais:

```java
Collection<? extends T>
Comparator<? super T>
Class<?>
List<? extends Evento>
Consumer<? super Mensagem>
```

Você verá isso em:

```text
Collections;
Streams;
Comparators;
Spring;
Jackson;
JPA;
APIs de reflection;
eventos;
mappers;
validadores.
```

Entender wildcards evita a sensação de que essas assinaturas são mágicas.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Wildcard básico

Execute:

```powershell
java -cp out br.com.curso.aula176.app.WildcardBasicoApp
java -cp out br.com.curso.aula176.app.ProblemaListNumberApp
```

### Parte 2 — Extends e super

Execute:

```powershell
java -cp out br.com.curso.aula176.app.SomaWildcardExtendsApp
java -cp out br.com.curso.aula176.app.WildcardSuperApp
```

### Parte 3 — PECS

Execute:

```powershell
java -cp out br.com.curso.aula176.app.CopiadorGenericoApp
```

### Parte 4 — Domínio

Execute:

```powershell
java -cp out br.com.curso.aula176.app.RelatorioAtendimentoWildcardApp
java -cp out br.com.curso.aula176.app.FilaAtendimentoWildcardApp
```

---

## Desafio prático

Crie uma classe:

```text
src\br\com\curso\aula176\util\RelatorioGenericoWildcard.java
```

Métodos:

```java
public static void imprimirObjetos(List<?> itens)

public static void imprimirAtendimentos(List<? extends Atendimento> atendimentos)
```

Regras:

```text
validar lista nula;
imprimir quantidade;
imprimir itens.
```

Crie o app:

```text
src\br\com\curso\aula176\app\RelatorioGenericoWildcardApp.java
```

Use com:

```text
List<String>;
List<Integer>;
List<Atendimento>;
List<AtendimentoCritico>.
```

Critério principal:

```text
usar ? quando o tipo exato não importa;
usar ? extends Atendimento quando precisa ler como Atendimento.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula176\util\TransferidorAtendimento.java
```

Método:

```java
public static <T extends Atendimento> void transferir(
        List<? extends T> origem,
        List<? super T> destino
)
```

Regras:

```text
origem não pode ser null;
destino não pode ser null;
copiar todos os itens da origem para o destino;
não permitir item nulo.
```

Crie o app:

```text
src\br\com\curso\aula176\app\TransferidorAtendimentoApp.java
```

Teste:

```text
List<AtendimentoCritico> para List<Atendimento>;
List<AtendimentoCritico> para List<Object>;
List<Atendimento> para List<Object>.
```

Critério principal:

```text
aplicar PECS corretamente.
```

---

## Erros comuns nesta aula

### 1. Achar que List<Integer> é List<Number>

Não é.

Generics em Java são invariantes.

### 2. Tentar adicionar em List<? extends T>

`extends` é bom para leitura, não para adicionar.

### 3. Tentar ler tipo específico de List<? super T>

`super` é bom para adicionar, mas leitura segura é como Object.

### 4. Usar wildcard sem necessidade

Se o tipo precisa ser retornado, talvez `<T>` seja melhor.

### 5. Retornar wildcard em API pública sem motivo

Isso pode dificultar a vida de quem usa seu método.

### 6. Esquecer PECS

```text
Producer Extends;
Consumer Super.
```

### 7. Usar cast para “resolver”

Se começou a precisar de cast, revise a assinatura genérica.

### 8. Misturar regra de negócio com truque genérico

Wildcards são ferramenta de tipo, não regra de domínio.

---

## Debug recomendado

Use debug em:

```text
CalculadoraNumerica.java
PreenchedorNumerico.java
CopiadorGenerico.java
RelatorioAtendimentoWildcard.java
FilaAtendimentoWildcard.java
```

Breakpoints recomendados:

```java
for (Number numero : numeros)

destino.add(...)

for (T item : origem)

System.out.println(atendimento.resumo())

adicionarCriticosDemo(...)
```

Observe:

```text
como extends permite leitura como supertipo;
como super permite adicionar subtipo;
como origem e destino se comportam no copiador;
como AtendimentoCritico pode ser lido como Atendimento;
como List<AtendimentoCritico> pode alimentar List<Atendimento>.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que significa List<?>?
2. O que significa List<? extends Number>?
3. O que significa List<? super Integer>?
4. O que é PECS?
5. Quando usar <T> em vez de wildcard?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar wildcard;
usar List<?>;
usar List<? extends T>;
usar List<? super T>;
explicar por que List<Integer> não é List<Number>;
explicar Producer Extends;
explicar Consumer Super;
aplicar PECS;
criar método que soma List<? extends Number>;
criar método que adiciona em List<? super Integer>;
criar método copiador com origem extends e destino super;
usar wildcards com domínio de Atendimento;
diferenciar ? de <T>;
resolver RelatorioGenericoWildcardApp;
resolver TransferidorAtendimentoApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m6/aula-176-wildcards-interrogacao-extends-super
git commit -m "Aula 176: wildcards interrogacao extends super"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
wildcards deixam generics mais flexíveis quando você quer trabalhar com famílias de tipos.
```

Você estudou:

```text
?;
? extends T;
? super T;
PECS;
produtor;
consumidor;
diferença entre ler e adicionar;
diferença entre wildcard e T.
```

A frase mais importante é:

```text
Producer Extends, Consumer Super.
```

Na próxima aula, vamos aprofundar a regra PECS com mais exemplos de backend, incluindo mappers, listas de entidades, listas de responses e utilitários genéricos mais próximos de APIs reais.
