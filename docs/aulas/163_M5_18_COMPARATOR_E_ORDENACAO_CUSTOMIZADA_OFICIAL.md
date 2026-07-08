# 163 — M5.18 — Comparator e ordenação customizada

## Objetivo da aula

Nesta aula você vai estudar um assunto essencial para trabalhar bem com coleções em Java:

```text
Comparator
```

Na aula anterior, você conheceu a classe utilitária:

```text
Collections
```

E viu métodos como:

```text
sort;
reverse;
min;
max;
frequency;
disjoint;
binarySearch.
```

Agora vamos aprofundar a ordenação.

Até aqui, quando usamos:

```java
Collections.sort(lista);
```

a lista era ordenada pela ordem natural dos elementos.

Mas em sistemas reais, muitas vezes você precisa ordenar de várias formas diferentes.

Exemplo:

```text
ordenar OS por código;
ordenar OS por data;
ordenar OS por cliente;
ordenar OS por status;
ordenar OS por prioridade;
ordenar primeiro as críticas;
ordenar primeiro as mais antigas;
ordenar primeiro as mais recentes.
```

Para isso, usamos:

```text
Comparator
```

Ao final da aula, você deve conseguir:

```text
entender a diferença entre Comparable e Comparator;
usar Comparator com classe anônima;
usar Comparator com lambda;
usar Comparator.comparing;
usar comparingInt;
usar reversed;
usar thenComparing;
ordenar por String;
ordenar por número;
ordenar por LocalDate;
ordenar objetos de domínio;
criar múltiplos critérios de ordenação;
entender nullsFirst e nullsLast;
usar List.sort;
usar Collections.sort com Comparator;
evitar alterar lista original quando necessário;
aplicar ordenação em cenários de Ordem de Serviço;
entender quando ordenação pertence ao domínio e quando pertence à aplicação.
```

Essa aula é muito importante para qualquer pessoa que quer sair do básico.

---

## Ideia principal

`Comparable` define uma ordem natural dentro da própria classe.

Exemplo:

```java
public final class CodigoOs implements Comparable<CodigoOs>
```

A classe diz:

```text
eu sei minha ordem natural.
```

Já `Comparator` define uma ordem externa.

Exemplo:

```java
Comparator<OrdemServico> porData = Comparator.comparing(OrdemServico::dataAtendimento);
```

O comparador diz:

```text
para esta situação, ordene assim.
```

---

## Comparable vs Comparator

### Comparable

Use quando o objeto tem uma ordem natural clara.

Exemplo:

```text
CodigoOs por valor;
LocalDate por data;
Integer por número;
String por ordem textual.
```

A classe implementa:

```java
Comparable<T>
```

E define:

```java
compareTo
```

### Comparator

Use quando você quer ordenar de uma forma específica, externa ou variável.

Exemplo:

```text
OrdemServico por data;
OrdemServico por cliente;
OrdemServico por status;
OrdemServico por código;
OrdemServico por data e depois código.
```

Você cria:

```java
Comparator<T>
```

sem obrigar a classe a ter uma única ordem natural.

---

## Exemplo simples

Imagine uma OS.

Ela pode ser ordenada por:

```text
código;
cliente;
data;
status;
prioridade.
```

Qual dessas é a ordem natural da OS?

Nem sempre existe uma resposta única.

Por isso, em muitos casos, é melhor usar `Comparator`.

A entidade não precisa carregar todas as ordenações possíveis.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-163-comparator-e-ordenacao-customizada
cd labs\m5\aula-163-comparator-e-ordenacao-customizada
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula163
mkdir src\br\com\curso\aula163\app
mkdir src\br\com\curso\aula163\dominio
mkdir src\br\com\curso\aula163\dominio\valor
mkdir src\br\com\curso\aula163\dominio\ordemservico
mkdir src\br\com\curso\aula163\infra
```

---

## Primeiro Comparator com String

Crie:

```text
src\br\com\curso\aula163\app\ComparatorStringPorTamanhoApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ComparatorStringPorTamanhoApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Mariana");
        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add("Bruno");

        nomes.sort(Comparator.comparingInt(String::length));

        System.out.println("Nomes ordenados por tamanho:");

        for (String nome : nomes) {
            System.out.println("- " + nome);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.ComparatorStringPorTamanhoApp
```

---

## O que aconteceu

A ordem natural de `String` seria alfabética.

Mas nós mudamos o critério:

```java
Comparator.comparingInt(String::length)
```

Agora a ordenação é pelo tamanho do texto.

Isso mostra o poder do `Comparator`.

Você não está preso à ordem natural.

---

## List.sort

Nesta aula vamos usar bastante:

```java
lista.sort(comparator);
```

Isso é equivalente, na prática, a ordenar a lista usando o critério informado.

Exemplo:

```java
nomes.sort(Comparator.naturalOrder());
```

Ou:

```java
nomes.sort(Comparator.comparingInt(String::length));
```

Importante:

```text
List.sort altera a lista original.
```

Se quiser preservar a original, faça cópia.

---

## Collections.sort com Comparator

Também é possível usar:

```java
Collections.sort(lista, comparator);
```

Crie:

```text
src\br\com\curso\aula163\app\CollectionsSortComComparatorApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class CollectionsSortComComparatorApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Mariana");
        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add("Bruno");

        Collections.sort(nomes, Comparator.comparingInt(String::length));

        System.out.println("Nomes ordenados por tamanho:");

        for (String nome : nomes) {
            System.out.println("- " + nome);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.CollectionsSortComComparatorApp
```

---

## List.sort ou Collections.sort?

Hoje é comum usar:

```java
lista.sort(comparator);
```

É direto e legível.

Mas você verá muito código com:

```java
Collections.sort(lista, comparator);
```

Ambos são importantes de conhecer.

No curso, vamos usar os dois quando fizer sentido.

---

## Comparator com classe anônima

Antes das lambdas, era comum escrever assim:

Crie:

```text
src\br\com\curso\aula163\app\ComparatorClasseAnonimaApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ComparatorClasseAnonimaApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Mariana");
        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add("Bruno");

        nomes.sort(new Comparator<String>() {
            @Override
            public int compare(String primeiro, String segundo) {
                return Integer.compare(primeiro.length(), segundo.length());
            }
        });

        System.out.println("Nomes ordenados por tamanho:");

        for (String nome : nomes) {
            System.out.println("- " + nome);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.ComparatorClasseAnonimaApp
```

---

## Por que conhecer classe anônima

Você provavelmente usará mais lambda.

Mas código legado pode ter classe anônima.

É importante reconhecer:

```java
new Comparator<String>() {
    @Override
    public int compare(...)
}
```

Isso é apenas uma forma mais antiga de escrever o comparador.

---

## Comparator com lambda

Crie:

```text
src\br\com\curso\aula163\app\ComparatorLambdaApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import java.util.ArrayList;
import java.util.List;

public class ComparatorLambdaApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Mariana");
        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add("Bruno");

        nomes.sort((primeiro, segundo) ->
                Integer.compare(primeiro.length(), segundo.length())
        );

        System.out.println("Nomes ordenados por tamanho:");

        for (String nome : nomes) {
            System.out.println("- " + nome);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.ComparatorLambdaApp
```

---

## Como ler a lambda

Este trecho:

```java
(primeiro, segundo) -> Integer.compare(primeiro.length(), segundo.length())
```

significa:

```text
compare o primeiro e o segundo pelo tamanho.
```

Se o resultado for:

```text
negativo:
primeiro vem antes.

zero:
equivalentes para este critério.

positivo:
primeiro vem depois.
```

Você não precisa decorar números.

Precisa entender o comportamento.

---

## Comparator.comparing

Na prática moderna, você verá muito:

```java
Comparator.comparing(...)
```

Crie:

```text
src\br\com\curso\aula163\app\ComparatorComparingApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ComparatorComparingApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Mariana");
        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add("Bruno");

        nomes.sort(Comparator.comparing(nome -> nome));

        System.out.println("Nomes em ordem natural usando comparing:");

        for (String nome : nomes) {
            System.out.println("- " + nome);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.ComparatorComparingApp
```

---

## Comparator.naturalOrder

Para ordem natural, também existe:

```java
Comparator.naturalOrder()
```

Crie:

```text
src\br\com\curso\aula163\app\ComparatorNaturalOrderApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ComparatorNaturalOrderApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Mariana");
        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add("Bruno");

        nomes.sort(Comparator.naturalOrder());

        System.out.println("Nomes em ordem natural:");

        for (String nome : nomes) {
            System.out.println("- " + nome);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.ComparatorNaturalOrderApp
```

---

## Ordem reversa

Para inverter um comparador:

```java
reversed()
```

Crie:

```text
src\br\com\curso\aula163\app\ComparatorReversedApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ComparatorReversedApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Mariana");
        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add("Bruno");

        nomes.sort(Comparator.naturalOrder());

        System.out.println("Ordem natural:");
        imprimir(nomes);

        nomes.sort(Comparator.<String>naturalOrder().reversed());

        System.out.println();
        System.out.println("Ordem reversa:");
        imprimir(nomes);
    }

    private static void imprimir(List<String> nomes) {
        for (String nome : nomes) {
            System.out.println("- " + nome);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.ComparatorReversedApp
```

---

## comparingInt

Quando o critério é um `int`, use:

```java
Comparator.comparingInt(...)
```

Crie:

```text
src\br\com\curso\aula163\app\ComparatorComparingIntApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ComparatorComparingIntApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Mariana");
        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add("Bruno");

        nomes.sort(Comparator.comparingInt(String::length));

        System.out.println("Nomes por tamanho:");

        for (String nome : nomes) {
            System.out.println("- " + nome + " (" + nome.length() + ")");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.ComparatorComparingIntApp
```

---

## thenComparing

Às vezes, dois itens empatam no primeiro critério.

Exemplo:

```text
Bruno;
Caio.
```

Ambos têm 5 letras.

Então você pode usar um segundo critério.

Crie:

```text
src\br\com\curso\aula163\app\ComparatorThenComparingApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ComparatorThenComparingApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Mariana");
        nomes.add("Carlos");
        nomes.add("Bruno");
        nomes.add("Ana");
        nomes.add("Caio");

        nomes.sort(
                Comparator.comparingInt(String::length)
                        .thenComparing(Comparator.naturalOrder())
        );

        System.out.println("Nomes por tamanho e depois alfabético:");

        for (String nome : nomes) {
            System.out.println("- " + nome + " (" + nome.length() + ")");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.ComparatorThenComparingApp
```

---

## Como ler thenComparing

Este trecho:

```java
Comparator.comparingInt(String::length)
        .thenComparing(Comparator.naturalOrder())
```

significa:

```text
primeiro ordene pelo tamanho;
se empatar, ordene pela ordem natural.
```

Isso é muito usado em sistemas reais.

Exemplo:

```text
primeiro por status;
depois por data;
depois por código.
```

---

## Domínio da aula

Agora vamos usar objetos de domínio.

Crie:

```text
src\br\com\curso\aula163\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula163.dominio.valor;

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
src\br\com\curso\aula163\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula163.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula163\dominio\ordemservico\PrioridadeOs.java
```

Código:

```java
package br.com.curso.aula163.dominio.ordemservico;

public enum PrioridadeOs {
    BAIXA,
    NORMAL,
    ALTA,
    CRITICA
}
```

Crie:

```text
src\br\com\curso\aula163\dominio\ordemservico\OrdemServicoResumo.java
```

Código:

```java
package br.com.curso.aula163.dominio.ordemservico;

import br.com.curso.aula163.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class OrdemServicoResumo {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataAtendimento;
    private final StatusOs status;
    private final PrioridadeOs prioridade;

    public OrdemServicoResumo(
            CodigoOs codigo,
            String cliente,
            LocalDate dataAtendimento,
            StatusOs status,
            PrioridadeOs prioridade
    ) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataAtendimento == null) {
            throw new IllegalArgumentException("Data de atendimento é obrigatória.");
        }

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        if (prioridade == null) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataAtendimento = dataAtendimento;
        this.status = status;
        this.prioridade = prioridade;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public LocalDate dataAtendimento() {
        return dataAtendimento;
    }

    public StatusOs status() {
        return status;
    }

    public PrioridadeOs prioridade() {
        return prioridade;
    }

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Data: " + dataAtendimento
                + " | Status: " + status
                + " | Prioridade: " + prioridade;
    }
}
```

---

## Ordenar OS por código

Crie:

```text
src\br\com\curso\aula163\app\OrdenarOsPorCodigoApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import br.com.curso.aula163.dominio.ordemservico.OrdemServicoResumo;
import br.com.curso.aula163.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula163.dominio.ordemservico.StatusOs;
import br.com.curso.aula163.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class OrdenarOsPorCodigoApp {
    public static void main(String[] args) {
        List<OrdemServicoResumo> ordens = criarOrdens();

        ordens.sort(Comparator.comparing(OrdemServicoResumo::codigo));

        System.out.println("OS ordenadas por código:");

        imprimir(ordens);
    }

    private static List<OrdemServicoResumo> criarOrdens() {
        List<OrdemServicoResumo> ordens = new ArrayList<>();

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.AGENDADA,
                PrioridadeOs.NORMAL
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CONCLUIDA,
                PrioridadeOs.ALTA
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.REAGENDADA,
                PrioridadeOs.CRITICA
        ));

        return ordens;
    }

    private static void imprimir(List<OrdemServicoResumo> ordens) {
        for (OrdemServicoResumo os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.OrdenarOsPorCodigoApp
```

---

## Por que funciona por código

`OrdemServicoResumo::codigo` retorna `CodigoOs`.

E `CodigoOs` implementa `Comparable`.

Então o Java sabe comparar os códigos.

Esse é um bom exemplo de composição:

```text
OrdemServicoResumo tem CodigoOs;
CodigoOs sabe se ordenar;
Comparator usa isso.
```

---

## Ordenar OS por cliente

Crie:

```text
src\br\com\curso\aula163\app\OrdenarOsPorClienteApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import br.com.curso.aula163.dominio.ordemservico.OrdemServicoResumo;
import br.com.curso.aula163.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula163.dominio.ordemservico.StatusOs;
import br.com.curso.aula163.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class OrdenarOsPorClienteApp {
    public static void main(String[] args) {
        List<OrdemServicoResumo> ordens = criarOrdens();

        ordens.sort(Comparator.comparing(OrdemServicoResumo::cliente));

        System.out.println("OS ordenadas por cliente:");

        imprimir(ordens);
    }

    private static List<OrdemServicoResumo> criarOrdens() {
        List<OrdemServicoResumo> ordens = new ArrayList<>();

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.AGENDADA,
                PrioridadeOs.NORMAL
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CONCLUIDA,
                PrioridadeOs.ALTA
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.REAGENDADA,
                PrioridadeOs.CRITICA
        ));

        return ordens;
    }

    private static void imprimir(List<OrdemServicoResumo> ordens) {
        for (OrdemServicoResumo os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.OrdenarOsPorClienteApp
```

---

## Ordenar OS por data

Crie:

```text
src\br\com\curso\aula163\app\OrdenarOsPorDataApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import br.com.curso.aula163.dominio.ordemservico.OrdemServicoResumo;
import br.com.curso.aula163.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula163.dominio.ordemservico.StatusOs;
import br.com.curso.aula163.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class OrdenarOsPorDataApp {
    public static void main(String[] args) {
        List<OrdemServicoResumo> ordens = criarOrdens();

        ordens.sort(Comparator.comparing(OrdemServicoResumo::dataAtendimento));

        System.out.println("OS ordenadas por data:");

        imprimir(ordens);
    }

    private static List<OrdemServicoResumo> criarOrdens() {
        List<OrdemServicoResumo> ordens = new ArrayList<>();

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.AGENDADA,
                PrioridadeOs.NORMAL
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CONCLUIDA,
                PrioridadeOs.ALTA
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.REAGENDADA,
                PrioridadeOs.CRITICA
        ));

        return ordens;
    }

    private static void imprimir(List<OrdemServicoResumo> ordens) {
        for (OrdemServicoResumo os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.OrdenarOsPorDataApp
```

---

## Ordenar por data decrescente

Crie:

```text
src\br\com\curso\aula163\app\OrdenarOsPorDataDecrescenteApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import br.com.curso.aula163.dominio.ordemservico.OrdemServicoResumo;
import br.com.curso.aula163.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula163.dominio.ordemservico.StatusOs;
import br.com.curso.aula163.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class OrdenarOsPorDataDecrescenteApp {
    public static void main(String[] args) {
        List<OrdemServicoResumo> ordens = criarOrdens();

        ordens.sort(
                Comparator.comparing(OrdemServicoResumo::dataAtendimento)
                        .reversed()
        );

        System.out.println("OS ordenadas por data decrescente:");

        imprimir(ordens);
    }

    private static List<OrdemServicoResumo> criarOrdens() {
        List<OrdemServicoResumo> ordens = new ArrayList<>();

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.AGENDADA,
                PrioridadeOs.NORMAL
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CONCLUIDA,
                PrioridadeOs.ALTA
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.REAGENDADA,
                PrioridadeOs.CRITICA
        ));

        return ordens;
    }

    private static void imprimir(List<OrdemServicoResumo> ordens) {
        for (OrdemServicoResumo os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.OrdenarOsPorDataDecrescenteApp
```

---

## Ordenação com múltiplos critérios

Agora vamos ordenar por:

```text
status;
depois data;
depois código.
```

Crie:

```text
src\br\com\curso\aula163\app\OrdenarOsMultiplosCriteriosApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import br.com.curso.aula163.dominio.ordemservico.OrdemServicoResumo;
import br.com.curso.aula163.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula163.dominio.ordemservico.StatusOs;
import br.com.curso.aula163.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class OrdenarOsMultiplosCriteriosApp {
    public static void main(String[] args) {
        List<OrdemServicoResumo> ordens = criarOrdens();

        ordens.sort(
                Comparator.comparing(OrdemServicoResumo::status)
                        .thenComparing(OrdemServicoResumo::dataAtendimento)
                        .thenComparing(OrdemServicoResumo::codigo)
        );

        System.out.println("OS ordenadas por status, data e código:");

        imprimir(ordens);
    }

    private static List<OrdemServicoResumo> criarOrdens() {
        List<OrdemServicoResumo> ordens = new ArrayList<>();

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.AGENDADA,
                PrioridadeOs.NORMAL
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA,
                PrioridadeOs.ALTA
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CONCLUIDA,
                PrioridadeOs.CRITICA
        ));

        return ordens;
    }

    private static void imprimir(List<OrdemServicoResumo> ordens) {
        for (OrdemServicoResumo os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.OrdenarOsMultiplosCriteriosApp
```

---

## Cuidado com ordem de enum

Quando você ordena por enum:

```java
Comparator.comparing(OrdemServicoResumo::status)
```

a ordem usada é a ordem de declaração do enum.

No nosso caso:

```java
AGENDADA,
REAGENDADA,
CONCLUIDA,
CANCELADA
```

Se o negócio precisa de outra ordem, por exemplo:

```text
CRITICA primeiro;
ALTA depois;
NORMAL depois;
BAIXA por último.
```

você precisa criar um critério específico.

---

## Ordenando prioridade com regra customizada

Como o enum `PrioridadeOs` está declarado:

```java
BAIXA,
NORMAL,
ALTA,
CRITICA
```

a ordem natural colocaria `BAIXA` primeiro.

Mas no painel de atendimento, talvez você queira:

```text
CRITICA primeiro;
ALTA depois;
NORMAL depois;
BAIXA por último.
```

Vamos criar um peso.

Crie:

```text
src\br\com\curso\aula163\app\OrdenarOsPorPrioridadeNegocioApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import br.com.curso.aula163.dominio.ordemservico.OrdemServicoResumo;
import br.com.curso.aula163.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula163.dominio.ordemservico.StatusOs;
import br.com.curso.aula163.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class OrdenarOsPorPrioridadeNegocioApp {
    public static void main(String[] args) {
        List<OrdemServicoResumo> ordens = criarOrdens();

        ordens.sort(
                Comparator.comparingInt(os -> pesoPrioridade(os.prioridade()))
                        .thenComparing(OrdemServicoResumo::dataAtendimento)
                        .thenComparing(OrdemServicoResumo::codigo)
        );

        System.out.println("OS ordenadas por prioridade de negócio:");

        imprimir(ordens);
    }

    private static int pesoPrioridade(PrioridadeOs prioridade) {
        return switch (prioridade) {
            case CRITICA -> 1;
            case ALTA -> 2;
            case NORMAL -> 3;
            case BAIXA -> 4;
        };
    }

    private static List<OrdemServicoResumo> criarOrdens() {
        List<OrdemServicoResumo> ordens = new ArrayList<>();

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA,
                PrioridadeOs.BAIXA
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.AGENDADA,
                PrioridadeOs.CRITICA
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA,
                PrioridadeOs.ALTA
        ));

        return ordens;
    }

    private static void imprimir(List<OrdemServicoResumo> ordens) {
        for (OrdemServicoResumo os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.OrdenarOsPorPrioridadeNegocioApp
```

---

## O que esse exemplo ensina

Nem toda ordenação deve seguir a ordem natural.

Às vezes, o negócio define a ordem.

O método:

```java
pesoPrioridade
```

transforma prioridade em peso.

Quanto menor o peso, mais cedo aparece.

Isso é comum em sistemas reais.

Exemplos:

```text
prioridade;
criticidade;
etapa do fluxo;
ordem de exibição;
status de atendimento;
ranking.
```

---

## Preservando lista original

Ordenar altera a lista.

Se precisa manter a original, faça cópia.

Crie:

```text
src\br\com\curso\aula163\app\OrdenacaoComCopiaApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class OrdenacaoComCopiaApp {
    public static void main(String[] args) {
        List<String> original = List.of("Mariana", "Ana", "Carlos", "Bruno");

        List<String> ordenada = new ArrayList<>(original);
        ordenada.sort(Comparator.naturalOrder());

        System.out.println("Original:");
        imprimir(original);

        System.out.println();
        System.out.println("Ordenada:");
        imprimir(ordenada);
    }

    private static void imprimir(List<String> valores) {
        for (String valor : valores) {
            System.out.println("- " + valor);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.OrdenacaoComCopiaApp
```

---

## nullsFirst e nullsLast

Listas com `null` são perigosas, mas você verá isso em código real.

`Comparator` oferece:

```java
Comparator.nullsFirst(...)
Comparator.nullsLast(...)
```

Crie:

```text
src\br\com\curso\aula163\app\ComparatorNullsLastApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ComparatorNullsLastApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Mariana");
        nomes.add(null);
        nomes.add("Ana");
        nomes.add("Carlos");

        nomes.sort(Comparator.nullsLast(Comparator.naturalOrder()));

        System.out.println("Nomes com null por último:");

        for (String nome : nomes) {
            System.out.println("- " + nome);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.ComparatorNullsLastApp
```

---

## Regra profissional sobre null

Mesmo existindo `nullsFirst` e `nullsLast`, evite coleções com `null`.

Em código limpo, prefira:

```text
validar entrada;
ignorar valores inválidos;
usar objetos válidos;
não adicionar null na coleção.
```

Mas conhecer `nullsLast` ajuda a lidar com dados externos e legado.

---

## Comparators em métodos separados

Quando o comparador fica grande, extraia para método.

Crie:

```text
src\br\com\curso\aula163\app\ComparatorExtraidoMetodoApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import br.com.curso.aula163.dominio.ordemservico.OrdemServicoResumo;
import br.com.curso.aula163.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula163.dominio.ordemservico.StatusOs;
import br.com.curso.aula163.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ComparatorExtraidoMetodoApp {
    public static void main(String[] args) {
        List<OrdemServicoResumo> ordens = criarOrdens();

        ordens.sort(ordenacaoPainelAtendimento());

        System.out.println("Ordenação do painel:");

        for (OrdemServicoResumo os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }

    private static Comparator<OrdemServicoResumo> ordenacaoPainelAtendimento() {
        return Comparator.comparingInt((OrdemServicoResumo os) -> pesoPrioridade(os.prioridade()))
                .thenComparing(OrdemServicoResumo::dataAtendimento)
                .thenComparing(OrdemServicoResumo::codigo);
    }

    private static int pesoPrioridade(PrioridadeOs prioridade) {
        return switch (prioridade) {
            case CRITICA -> 1;
            case ALTA -> 2;
            case NORMAL -> 3;
            case BAIXA -> 4;
        };
    }

    private static List<OrdemServicoResumo> criarOrdens() {
        List<OrdemServicoResumo> ordens = new ArrayList<>();

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA,
                PrioridadeOs.BAIXA
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.AGENDADA,
                PrioridadeOs.CRITICA
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA,
                PrioridadeOs.ALTA
        ));

        return ordens;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.ComparatorExtraidoMetodoApp
```

---

## Por que extrair comparador

Este nome:

```java
ordenacaoPainelAtendimento()
```

explica o objetivo.

Fica melhor do que deixar uma cadeia grande de `Comparator` perdida no meio do código.

Em sistemas reais, nomes bons ajudam muito.

---

## Classe utilitária de ordenação

Em alguns casos, você pode centralizar comparadores.

Crie:

```text
src\br\com\curso\aula163\infra\OrdenacoesOrdemServico.java
```

Código:

```java
package br.com.curso.aula163.infra;

import br.com.curso.aula163.dominio.ordemservico.OrdemServicoResumo;
import br.com.curso.aula163.dominio.ordemservico.PrioridadeOs;

import java.util.Comparator;

public final class OrdenacoesOrdemServico {
    private OrdenacoesOrdemServico() {
    }

    public static Comparator<OrdemServicoResumo> porCodigo() {
        return Comparator.comparing(OrdemServicoResumo::codigo);
    }

    public static Comparator<OrdemServicoResumo> porDataCodigo() {
        return Comparator.comparing(OrdemServicoResumo::dataAtendimento)
                .thenComparing(OrdemServicoResumo::codigo);
    }

    public static Comparator<OrdemServicoResumo> painelAtendimento() {
        return Comparator.comparingInt((OrdemServicoResumo os) -> pesoPrioridade(os.prioridade()))
                .thenComparing(OrdemServicoResumo::dataAtendimento)
                .thenComparing(OrdemServicoResumo::codigo);
    }

    private static int pesoPrioridade(PrioridadeOs prioridade) {
        return switch (prioridade) {
            case CRITICA -> 1;
            case ALTA -> 2;
            case NORMAL -> 3;
            case BAIXA -> 4;
        };
    }
}
```

Agora crie:

```text
src\br\com\curso\aula163\app\OrdenacoesUtilitariasApp.java
```

Código:

```java
package br.com.curso.aula163.app;

import br.com.curso.aula163.dominio.ordemservico.OrdemServicoResumo;
import br.com.curso.aula163.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula163.dominio.ordemservico.StatusOs;
import br.com.curso.aula163.dominio.valor.CodigoOs;
import br.com.curso.aula163.infra.OrdenacoesOrdemServico;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class OrdenacoesUtilitariasApp {
    public static void main(String[] args) {
        List<OrdemServicoResumo> ordens = criarOrdens();

        ordens.sort(OrdenacoesOrdemServico.painelAtendimento());

        System.out.println("Ordenação usando classe utilitária:");

        for (OrdemServicoResumo os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }

    private static List<OrdemServicoResumo> criarOrdens() {
        List<OrdemServicoResumo> ordens = new ArrayList<>();

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA,
                PrioridadeOs.BAIXA
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.AGENDADA,
                PrioridadeOs.CRITICA
        ));

        ordens.add(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA,
                PrioridadeOs.ALTA
        ));

        return ordens;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula163.app.OrdenacoesUtilitariasApp
```

---

## Cuidado arquitetural

Nem toda ordenação precisa virar utilitário global.

Use classe utilitária quando:

```text
o comparador é reutilizado em vários lugares;
o nome da ordenação tem significado;
a regra é estável;
centralizar evita duplicação.
```

Evite criar utilitário para tudo.

Se o comparador é usado uma vez e é simples, pode ficar local.

---

## Ordenação pertence ao domínio ou à aplicação?

Depende.

### Pode estar no domínio quando

A ordenação representa uma regra central do negócio.

Exemplo:

```text
prioridade crítica sempre vem antes;
fila de atendimento tem uma regra oficial;
ranking segue regra da empresa.
```

### Pode estar na aplicação quando

A ordenação é apenas uma forma de exibição.

Exemplo:

```text
ordenar por nome na tela;
ordenar por código no relatório;
ordenar por data no endpoint.
```

A decisão depende do contexto.

Um engenheiro não joga tudo no mesmo lugar.

Ele entende a responsabilidade.

---

## Ligação com backend

`Comparator` aparece muito em backend:

```text
ordenar DTO antes de responder API;
ordenar entidades em memória;
organizar relatório;
priorizar atendimento;
definir ranking;
ordenar configurações;
ordenar dados importados;
aplicar critério de exibição;
criar fallback de ordenação.
```

Mas um cuidado importante:

```text
se a ordenação pode ser feita no banco com ORDER BY, normalmente é melhor fazer no banco.
```

Em Java, ordenar em memória faz sentido quando:

```text
os dados já estão carregados;
é uma lista pequena;
é uma regra de apresentação;
é uma ordenação pós-processamento;
é teste ou simulação;
a fonte não permite ordenar.
```

Em grandes volumes, ordenar em memória sem critério pode ser ruim.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Formas básicas

Execute:

```powershell
java -cp out br.com.curso.aula163.app.ComparatorStringPorTamanhoApp
java -cp out br.com.curso.aula163.app.CollectionsSortComComparatorApp
java -cp out br.com.curso.aula163.app.ComparatorClasseAnonimaApp
java -cp out br.com.curso.aula163.app.ComparatorLambdaApp
```

### Parte 2 — Métodos modernos

Execute:

```powershell
java -cp out br.com.curso.aula163.app.ComparatorComparingApp
java -cp out br.com.curso.aula163.app.ComparatorNaturalOrderApp
java -cp out br.com.curso.aula163.app.ComparatorReversedApp
java -cp out br.com.curso.aula163.app.ComparatorComparingIntApp
java -cp out br.com.curso.aula163.app.ComparatorThenComparingApp
```

### Parte 3 — Ordenar OS por campos

Execute:

```powershell
java -cp out br.com.curso.aula163.app.OrdenarOsPorCodigoApp
java -cp out br.com.curso.aula163.app.OrdenarOsPorClienteApp
java -cp out br.com.curso.aula163.app.OrdenarOsPorDataApp
java -cp out br.com.curso.aula163.app.OrdenarOsPorDataDecrescenteApp
```

### Parte 4 — Critérios avançados

Execute:

```powershell
java -cp out br.com.curso.aula163.app.OrdenarOsMultiplosCriteriosApp
java -cp out br.com.curso.aula163.app.OrdenarOsPorPrioridadeNegocioApp
java -cp out br.com.curso.aula163.app.OrdenacaoComCopiaApp
java -cp out br.com.curso.aula163.app.ComparatorNullsLastApp
```

### Parte 5 — Organização

Execute:

```powershell
java -cp out br.com.curso.aula163.app.ComparatorExtraidoMetodoApp
java -cp out br.com.curso.aula163.app.OrdenacoesUtilitariasApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula163\app\PainelOrdenacaoOsApp.java
```

Ele deve:

```text
criar uma List<OrdemServicoResumo>;
adicionar pelo menos 8 OS;
ordenar por cliente;
ordenar por data decrescente;
ordenar por prioridade de negócio;
ordenar por status, depois data, depois código;
exibir cada resultado separadamente.
```

Regra importante:

```text
não altere a lista original.
```

Critério principal:

```text
para cada ordenação, crie uma cópia mutável da lista original.
```

---

## Desafio extra

Crie uma classe utilitária:

```text
src\br\com\curso\aula163\infra\ComparadoresPainelOs.java
```

Ela deve ter métodos estáticos:

```text
porCliente();
porDataDecrescente();
porPrioridadeNegocio();
porStatusDataCodigo();
```

Depois crie:

```text
src\br\com\curso\aula163\app\PainelComComparadoresUtilitariosApp.java
```

Ele deve usar os comparadores da classe utilitária.

Critério principal:

```text
os nomes dos métodos devem explicar a intenção da ordenação.
```

---

## Erros comuns nesta aula

### 1. Achar que Comparable e Comparator são a mesma coisa

`Comparable` é ordem natural da classe.

`Comparator` é critério externo.

### 2. Ordenar a lista original sem perceber

`sort` altera a lista.

Faça cópia quando necessário.

### 3. Usar reversed no lugar errado

Cuidado com a cadeia de comparadores.

### 4. Ordenar enum achando que segue regra de negócio

Enum ordena pela ordem de declaração.

Se o negócio exige outra ordem, crie peso.

### 5. Criar lambda gigante

Extraia método quando ficar difícil de ler.

### 6. Colocar regra de exibição dentro da entidade sem necessidade

Nem toda ordenação pertence ao domínio.

### 7. Ignorar null em dados externos

Prefira validar, mas conheça `nullsFirst` e `nullsLast`.

### 8. Ordenar em memória grandes volumes sem pensar

Em backend, muitas ordenações devem ser feitas no banco.

---

## Debug recomendado

Use debug em:

```text
ComparatorLambdaApp.java
ComparatorThenComparingApp.java
OrdenarOsPorCodigoApp.java
OrdenarOsPorDataDecrescenteApp.java
OrdenarOsMultiplosCriteriosApp.java
OrdenarOsPorPrioridadeNegocioApp.java
ComparatorExtraidoMetodoApp.java
OrdenacoesOrdemServico.java
```

Breakpoints recomendados:

```java
lista.sort(...)

Comparator.comparing(...)

Comparator.comparingInt(...)

thenComparing(...)

reversed()

pesoPrioridade(...)

compareTo(...)

ordenacaoPainelAtendimento()

OrdenacoesOrdemServico.painelAtendimento()
```

Observe:

```text
qual campo está sendo usado;
quando o segundo critério entra;
como reversed muda a ordem;
como pesoPrioridade decide a ordenação;
como CodigoOs participa da ordenação;
como a cópia preserva a lista original.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre Comparable e Comparator?
2. Quando usar thenComparing?
3. Por que nem toda ordenação deve ficar dentro da entidade?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar Comparable;
explicar Comparator;
criar Comparator com classe anônima;
criar Comparator com lambda;
usar Comparator.comparing;
usar comparingInt;
usar reversed;
usar thenComparing;
ordenar por String;
ordenar por número;
ordenar por LocalDate;
ordenar objeto de domínio por vários campos;
criar peso de prioridade;
preservar lista original usando cópia;
usar nullsLast;
extrair comparador para método;
criar classe utilitária de comparadores;
resolver PainelOrdenacaoOsApp;
resolver PainelComComparadoresUtilitariosApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-163-comparator-e-ordenacao-customizada
git commit -m "Aula 163: comparator e ordenacao customizada"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Comparator permite criar critérios de ordenação externos, flexíveis e reutilizáveis.
```

Você viu que uma mesma classe pode ser ordenada de várias formas, sem obrigar o domínio a ter uma única ordem natural.

Também viu que ordenação exige critério arquitetural:

```text
algumas ordenações pertencem ao domínio;
outras pertencem à aplicação;
outras devem ser feitas no banco.
```

Na próxima aula, vamos estudar `Queue` e `Deque`.

Vamos entender filas, pilhas, processamento em ordem e estruturas úteis para fluxos de atendimento, mensageria e processamento.
