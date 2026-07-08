# 162 — M5.17 — Collections utility class

## Objetivo da aula

Nesta aula você vai estudar uma classe utilitária muito importante do Java:

```text
java.util.Collections
```

Nas aulas anteriores, você estudou estruturas como:

```text
List;
Set;
Map;
ArrayList;
LinkedList;
HashSet;
TreeSet;
HashMap;
TreeMap.
```

Agora vamos estudar métodos prontos que ajudam a manipular coleções.

Ao final da aula, você deve conseguir:

```text
diferenciar Collection de Collections;
usar Collections.sort;
usar Collections.reverse;
usar Collections.shuffle;
usar Collections.min;
usar Collections.max;
usar Collections.frequency;
usar Collections.disjoint;
usar Collections.swap;
usar Collections.fill;
usar Collections.copy;
usar Collections.binarySearch;
entender o cuidado com listas imutáveis;
entender ordenação natural;
entender a ligação com Comparable;
usar Collections com objetos de valor;
aplicar utilitários em cenários de backend;
evitar reinventar algoritmo manual sem necessidade.
```

Essa aula é importante porque muita coisa que iniciantes fazem manualmente já existe pronta no Java.

---

## Collection vs Collections

Esse ponto confunde muita gente.

### Collection

`Collection` é uma interface.

Ela representa uma coleção de elementos.

Exemplos de interfaces e classes relacionadas:

```text
Collection;
List;
Set;
Queue;
ArrayList;
HashSet.
```

Exemplo:

```java
Collection<String> nomes;
```

### Collections

`Collections` é uma classe utilitária.

Ela possui métodos estáticos para trabalhar com coleções.

Exemplo:

```java
Collections.sort(lista);
Collections.reverse(lista);
Collections.shuffle(lista);
```

Resumo:

```text
Collection:
interface.

Collections:
classe utilitária.
```

---

## Como lembrar

Pense assim:

```text
Collection sem S:
é uma abstração de coleção.

Collections com S:
é uma caixa de ferramentas para coleções.
```

Essa diferença é importante.

Você vai ver `Collections` muitas vezes em código legado, código Java puro e preparação de dados.

---

## Métodos estáticos

A classe `Collections` é usada diretamente.

Você não faz:

```java
Collections ferramentas = new Collections();
```

Você chama métodos estáticos:

```java
Collections.sort(lista);
```

Isso é parecido com:

```java
Math.max(10, 20);
```

`Collections` é uma classe de apoio.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-162-collections-utility-class
cd labs\m5\aula-162-collections-utility-class
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula162
mkdir src\br\com\curso\aula162\app
mkdir src\br\com\curso\aula162\dominio
mkdir src\br\com\curso\aula162\dominio\valor
mkdir src\br\com\curso\aula162\dominio\ordemservico
mkdir src\br\com\curso\aula162\infra
```

---

## Primeiro exemplo com Collections.sort

Crie:

```text
src\br\com\curso\aula162\app\CollectionsSortStringApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsSortStringApp {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();

        nomes.add("Mariana");
        nomes.add("Ana");
        nomes.add("Carlos");
        nomes.add("Bruno");

        System.out.println("Antes:");
        imprimir(nomes);

        Collections.sort(nomes);

        System.out.println();
        System.out.println("Depois do sort:");
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
java -cp out br.com.curso.aula162.app.CollectionsSortStringApp
```

---

## O que sort faz

`Collections.sort` ordena a lista.

No caso de `String`, a ordenação natural é alfabética.

Antes:

```text
Mariana;
Ana;
Carlos;
Bruno.
```

Depois:

```text
Ana;
Bruno;
Carlos;
Mariana.
```

Importante:

```text
sort altera a lista original.
```

Ele não cria uma nova lista automaticamente.

---

## sort com números

Crie:

```text
src\br\com\curso\aula162\app\CollectionsSortIntegerApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsSortIntegerApp {
    public static void main(String[] args) {
        List<Integer> numeros = new ArrayList<>();

        numeros.add(30);
        numeros.add(10);
        numeros.add(40);
        numeros.add(20);

        System.out.println("Antes:");
        imprimir(numeros);

        Collections.sort(numeros);

        System.out.println();
        System.out.println("Depois do sort:");
        imprimir(numeros);
    }

    private static void imprimir(List<Integer> numeros) {
        for (Integer numero : numeros) {
            System.out.println("- " + numero);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsSortIntegerApp
```

---

## Ordenação natural

Tipos como `String` e `Integer` já sabem se ordenar.

Isso acontece porque eles implementam:

```text
Comparable
```

Ou seja, eles possuem uma ordem natural.

Exemplos:

```text
String:
ordem alfabética/lexicográfica.

Integer:
ordem numérica crescente.

LocalDate:
ordem cronológica.
```

Para objetos criados por você, a classe precisa ter uma ordem natural ou você precisa passar um comparador.

---

## sort em lista imutável

Cuidado com `List.of`.

Crie:

```text
src\br\com\curso\aula162\app\CollectionsSortListaImutavelApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.Collections;
import java.util.List;

public class CollectionsSortListaImutavelApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Mariana", "Ana", "Carlos");

        try {
            Collections.sort(nomes);
        } catch (UnsupportedOperationException erro) {
            System.out.println("Não é possível ordenar diretamente uma lista imutável criada com List.of.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsSortListaImutavelApp
```

---

## Como ordenar dados vindos de List.of

Crie uma lista mutável a partir dela.

Crie:

```text
src\br\com\curso\aula162\app\CollectionsSortCopiaMutavelApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsSortCopiaMutavelApp {
    public static void main(String[] args) {
        List<String> nomesOriginais = List.of("Mariana", "Ana", "Carlos");

        List<String> copiaMutavel = new ArrayList<>(nomesOriginais);

        Collections.sort(copiaMutavel);

        System.out.println("Original:");
        imprimir(nomesOriginais);

        System.out.println();
        System.out.println("Cópia ordenada:");
        imprimir(copiaMutavel);
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
java -cp out br.com.curso.aula162.app.CollectionsSortCopiaMutavelApp
```

---

## Regra prática sobre sort

Antes de usar `Collections.sort`, pergunte:

```text
a lista é mutável?
posso alterar a lista original?
preciso manter a lista original intacta?
os elementos possuem ordenação natural?
```

Se não pode alterar a original, faça cópia:

```java
List<String> ordenada = new ArrayList<>(original);
Collections.sort(ordenada);
```

---

## reverse

`reverse` inverte a ordem atual da lista.

Crie:

```text
src\br\com\curso\aula162\app\CollectionsReverseApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsReverseApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0003");

        System.out.println("Antes:");
        imprimir(codigos);

        Collections.reverse(codigos);

        System.out.println();
        System.out.println("Depois do reverse:");
        imprimir(codigos);
    }

    private static void imprimir(List<String> codigos) {
        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsReverseApp
```

---

## reverse não ordena

`reverse` não ordena.

Ele apenas inverte a ordem atual.

Se a lista está assim:

```text
A;
B;
C.
```

Depois de `reverse`:

```text
C;
B;
A.
```

Se você quer ordem decrescente, uma estratégia simples é:

```java
Collections.sort(lista);
Collections.reverse(lista);
```

---

## sort + reverse

Crie:

```text
src\br\com\curso\aula162\app\CollectionsSortReverseApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsSortReverseApp {
    public static void main(String[] args) {
        List<Integer> numeros = new ArrayList<>();

        numeros.add(30);
        numeros.add(10);
        numeros.add(40);
        numeros.add(20);

        Collections.sort(numeros);
        Collections.reverse(numeros);

        System.out.println("Números em ordem decrescente:");

        for (Integer numero : numeros) {
            System.out.println("- " + numero);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsSortReverseApp
```

---

## shuffle

`shuffle` embaralha a lista.

Crie:

```text
src\br\com\curso\aula162\app\CollectionsShuffleApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsShuffleApp {
    public static void main(String[] args) {
        List<String> analistas = new ArrayList<>();

        analistas.add("Ana");
        analistas.add("Carlos");
        analistas.add("Mariana");
        analistas.add("Bruno");

        System.out.println("Antes:");
        imprimir(analistas);

        Collections.shuffle(analistas);

        System.out.println();
        System.out.println("Depois do shuffle:");
        imprimir(analistas);
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
java -cp out br.com.curso.aula162.app.CollectionsShuffleApp
```

---

## Quando shuffle pode ser útil

`shuffle` pode ser útil para:

```text
embaralhar exercícios;
sortear ordem de atendimento;
testar código com ordem aleatória;
simular distribuição;
evitar dependência acidental de ordem.
```

Mas cuidado:

```text
não use aleatoriedade em regra crítica sem critério.
```

Em sistemas reais, sorteios, filas e distribuição precisam de regras auditáveis.

---

## min e max com números

Crie:

```text
src\br\com\curso\aula162\app\CollectionsMinMaxNumerosApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.Collections;
import java.util.List;

public class CollectionsMinMaxNumerosApp {
    public static void main(String[] args) {
        List<Integer> temposMinutos = List.of(45, 30, 120, 15, 60);

        Integer menor = Collections.min(temposMinutos);
        Integer maior = Collections.max(temposMinutos);

        System.out.println("Menor tempo: " + menor + " minutos");
        System.out.println("Maior tempo: " + maior + " minutos");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsMinMaxNumerosApp
```

---

## min e max com String

Crie:

```text
src\br\com\curso\aula162\app\CollectionsMinMaxStringApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.Collections;
import java.util.List;

public class CollectionsMinMaxStringApp {
    public static void main(String[] args) {
        List<String> nomes = List.of("Mariana", "Ana", "Carlos", "Bruno");

        String menor = Collections.min(nomes);
        String maior = Collections.max(nomes);

        System.out.println("Menor pela ordem natural: " + menor);
        System.out.println("Maior pela ordem natural: " + maior);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsMinMaxStringApp
```

---

## Cuidado com min e max

`min` e `max` usam a ordem natural.

Para `String`, isso não significa menor nome em tamanho.

Significa menor pela ordenação da String.

Exemplo:

```text
Ana vem antes de Bruno;
Mariana vem depois de Carlos.
```

Se quiser comparar por tamanho, você precisa de outro critério.

Isso será aprofundado com `Comparator`.

---

## frequency

`frequency` conta quantas vezes um elemento aparece em uma coleção.

Crie:

```text
src\br\com\curso\aula162\app\CollectionsFrequencyApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.Collections;
import java.util.List;

public class CollectionsFrequencyApp {
    public static void main(String[] args) {
        List<String> status = List.of(
                "AGENDADA",
                "CONCLUIDA",
                "AGENDADA",
                "CANCELADA",
                "AGENDADA"
        );

        int agendadas = Collections.frequency(status, "AGENDADA");
        int canceladas = Collections.frequency(status, "CANCELADA");
        int reagendadas = Collections.frequency(status, "REAGENDADA");

        System.out.println("AGENDADA: " + agendadas);
        System.out.println("CANCELADA: " + canceladas);
        System.out.println("REAGENDADA: " + reagendadas);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsFrequencyApp
```

---

## Quando usar frequency

`frequency` é bom para uma contagem simples de um valor específico.

Exemplo:

```text
quantas vezes AGENDADA aparece?
quantas vezes determinado código aparece?
quantas permissões repetidas existem?
```

Mas se você precisa contar todos os valores por categoria, `Map` costuma ser melhor.

Exemplo:

```text
AGENDADA -> 3
CANCELADA -> 1
CONCLUIDA -> 1
```

Isso pede `Map<Status, Integer>`.

---

## disjoint

`disjoint` verifica se duas coleções não têm elementos em comum.

Crie:

```text
src\br\com\curso\aula162\app\CollectionsDisjointApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.Collections;
import java.util.List;

public class CollectionsDisjointApp {
    public static void main(String[] args) {
        List<String> tecnicosDisponiveis = List.of("TEC-001", "TEC-002", "TEC-003");
        List<String> tecnicosBloqueados = List.of("TEC-999", "TEC-888");

        boolean semIntersecao = Collections.disjoint(tecnicosDisponiveis, tecnicosBloqueados);

        System.out.println("As listas não possuem itens em comum? " + semIntersecao);

        List<String> bloqueadosComConflito = List.of("TEC-003", "TEC-999");

        boolean semIntersecao2 = Collections.disjoint(tecnicosDisponiveis, bloqueadosComConflito);

        System.out.println("Com segunda lista, não possuem itens em comum? " + semIntersecao2);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsDisjointApp
```

---

## Como ler disjoint

`disjoint` retorna `true` quando as coleções não têm elementos em comum.

Exemplo:

```text
A = [1, 2, 3]
B = [4, 5, 6]
disjoint = true
```

Mas:

```text
A = [1, 2, 3]
B = [3, 4, 5]
disjoint = false
```

Porque o item `3` aparece nas duas.

---

## swap

`swap` troca dois elementos de posição em uma lista.

Crie:

```text
src\br\com\curso\aula162\app\CollectionsSwapApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsSwapApp {
    public static void main(String[] args) {
        List<String> prioridades = new ArrayList<>();

        prioridades.add("Baixa");
        prioridades.add("Média");
        prioridades.add("Alta");

        System.out.println("Antes:");
        imprimir(prioridades);

        Collections.swap(prioridades, 0, 2);

        System.out.println();
        System.out.println("Depois do swap:");
        imprimir(prioridades);
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
java -cp out br.com.curso.aula162.app.CollectionsSwapApp
```

---

## Quando swap pode ser útil

`swap` pode ser útil para:

```text
trocar posição em uma fila visual;
ajustar prioridade manual;
reordenar itens em uma tela;
algoritmos de ordenação;
manipulação de listas pequenas.
```

Em backend, é menos comum que `sort`, mas é bom conhecer.

---

## fill

`fill` substitui todos os elementos da lista por um valor.

Crie:

```text
src\br\com\curso\aula162\app\CollectionsFillApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsFillApp {
    public static void main(String[] args) {
        List<String> status = new ArrayList<>();

        status.add("AGENDADA");
        status.add("CONCLUIDA");
        status.add("CANCELADA");

        System.out.println("Antes:");
        imprimir(status);

        Collections.fill(status, "PENDENTE_REVISAO");

        System.out.println();
        System.out.println("Depois do fill:");
        imprimir(status);
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
java -cp out br.com.curso.aula162.app.CollectionsFillApp
```

---

## Cuidado com fill

`fill` altera todos os elementos da lista.

Use com muito cuidado.

Ele pode ser útil em exemplos ou inicialização controlada.

Mas em regra de negócio real, trocar tudo por um mesmo valor pode ser perigoso.

Sempre pergunte:

```text
faz sentido sobrescrever todos os elementos?
```

---

## copy

`copy` copia elementos de uma lista origem para uma lista destino já existente.

Esse método tem uma armadilha.

A lista destino precisa ter tamanho suficiente.

Crie:

```text
src\br\com\curso\aula162\app\CollectionsCopyApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsCopyApp {
    public static void main(String[] args) {
        List<String> origem = List.of("OS-001", "OS-002", "OS-003");

        List<String> destino = new ArrayList<>();

        destino.add("");
        destino.add("");
        destino.add("");

        Collections.copy(destino, origem);

        System.out.println("Destino após copy:");

        for (String codigo : destino) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsCopyApp
```

---

## Erro comum com copy

Crie:

```text
src\br\com\curso\aula162\app\CollectionsCopyErroApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsCopyErroApp {
    public static void main(String[] args) {
        List<String> origem = List.of("OS-001", "OS-002", "OS-003");
        List<String> destino = new ArrayList<>();

        try {
            Collections.copy(destino, origem);
        } catch (IndexOutOfBoundsException erro) {
            System.out.println("Erro: a lista destino precisa ter tamanho suficiente.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsCopyErroApp
```

---

## Melhor forma comum de copiar lista

Na maioria dos casos, para criar uma cópia mutável, prefira:

```java
new ArrayList<>(origem)
```

Exemplo:

```java
List<String> copia = new ArrayList<>(origem);
```

`Collections.copy` existe, mas não é o jeito mais comum para cópia simples.

---

## binarySearch

`binarySearch` busca um elemento em uma lista ordenada.

Crie:

```text
src\br\com\curso\aula162\app\CollectionsBinarySearchApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsBinarySearchApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0003");
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");

        Collections.sort(codigos);

        int posicaoEncontrada = Collections.binarySearch(codigos, "OS-2026-0002");
        int posicaoInexistente = Collections.binarySearch(codigos, "OS-2026-9999");

        System.out.println("Lista ordenada:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }

        System.out.println();
        System.out.println("Posição encontrada: " + posicaoEncontrada);
        System.out.println("Posição inexistente: " + posicaoInexistente);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsBinarySearchApp
```

---

## Cuidado com binarySearch

`binarySearch` exige lista ordenada conforme o mesmo critério usado na busca.

Se a lista não estiver ordenada, o resultado não é confiável.

Regra:

```text
antes de binarySearch, garanta ordenação correta.
```

Hoje, em muitos códigos de backend, você usará mais `Map` para busca por chave.

Mas `binarySearch` é importante para entender algoritmos e listas ordenadas.

---

## Objeto de valor Comparable

Agora vamos usar `Collections.sort` com objeto próprio.

Crie:

```text
src\br\com\curso\aula162\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula162.dominio.valor;

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

---

## sort com CodigoOs

Crie:

```text
src\br\com\curso\aula162\app\CollectionsSortCodigoOsApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import br.com.curso.aula162.dominio.valor.CodigoOs;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsSortCodigoOsApp {
    public static void main(String[] args) {
        List<CodigoOs> codigos = new ArrayList<>();

        codigos.add(new CodigoOs("OS-2026-0003"));
        codigos.add(new CodigoOs("OS-2026-0001"));
        codigos.add(new CodigoOs("OS-2026-0002"));

        System.out.println("Antes:");
        imprimir(codigos);

        Collections.sort(codigos);

        System.out.println();
        System.out.println("Depois do sort:");
        imprimir(codigos);
    }

    private static void imprimir(List<CodigoOs> codigos) {
        for (CodigoOs codigo : codigos) {
            System.out.println("- " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsSortCodigoOsApp
```

---

## Por que funciona

`CodigoOs` implementa:

```java
Comparable<CodigoOs>
```

E possui:

```java
compareTo(CodigoOs outro)
```

Então o Java sabe ordenar códigos de OS.

Isso permite usar:

```java
Collections.sort(codigos);
Collections.min(codigos);
Collections.max(codigos);
Collections.binarySearch(codigos, new CodigoOs("OS-2026-0002"));
```

---

## min, max e binarySearch com CodigoOs

Crie:

```text
src\br\com\curso\aula162\app\CollectionsCodigoOsUtilitariosApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import br.com.curso.aula162.dominio.valor.CodigoOs;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsCodigoOsUtilitariosApp {
    public static void main(String[] args) {
        List<CodigoOs> codigos = new ArrayList<>();

        codigos.add(new CodigoOs("OS-2026-0003"));
        codigos.add(new CodigoOs("OS-2026-0001"));
        codigos.add(new CodigoOs("OS-2026-0002"));

        CodigoOs menor = Collections.min(codigos);
        CodigoOs maior = Collections.max(codigos);

        Collections.sort(codigos);

        int posicao = Collections.binarySearch(codigos, new CodigoOs("OS-2026-0002"));

        System.out.println("Menor código: " + menor.resumo());
        System.out.println("Maior código: " + maior.resumo());
        System.out.println("Posição da OS-2026-0002 após ordenar: " + posicao);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsCodigoOsUtilitariosApp
```

---

## Domínio de OS para exemplos

Crie:

```text
src\br\com\curso\aula162\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula162.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula162\dominio\ordemservico\OrdemServicoResumo.java
```

Código:

```java
package br.com.curso.aula162.dominio.ordemservico;

import br.com.curso.aula162.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class OrdemServicoResumo {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataAtendimento;
    private final StatusOs status;

    public OrdemServicoResumo(
            CodigoOs codigo,
            String cliente,
            LocalDate dataAtendimento,
            StatusOs status
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

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataAtendimento = dataAtendimento;
        this.status = status;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public LocalDate dataAtendimento() {
        return dataAtendimento;
    }

    public StatusOs status() {
        return status;
    }

    public boolean possuiStatus(StatusOs status) {
        return this.status == status;
    }

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Data: " + dataAtendimento
                + " | Status: " + status;
    }
}
```

---

## Frequency com enum em objetos

Crie:

```text
src\br\com\curso\aula162\app\CollectionsFrequencyStatusApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import br.com.curso.aula162.dominio.ordemservico.StatusOs;

import java.util.Collections;
import java.util.List;

public class CollectionsFrequencyStatusApp {
    public static void main(String[] args) {
        List<StatusOs> status = List.of(
                StatusOs.AGENDADA,
                StatusOs.CONCLUIDA,
                StatusOs.AGENDADA,
                StatusOs.CANCELADA,
                StatusOs.AGENDADA
        );

        int agendadas = Collections.frequency(status, StatusOs.AGENDADA);
        int concluidas = Collections.frequency(status, StatusOs.CONCLUIDA);
        int canceladas = Collections.frequency(status, StatusOs.CANCELADA);

        System.out.println("Agendadas: " + agendadas);
        System.out.println("Concluídas: " + concluidas);
        System.out.println("Canceladas: " + canceladas);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsFrequencyStatusApp
```

---

## Disjoint com códigos de OS

Crie:

```text
src\br\com\curso\aula162\app\CollectionsDisjointCodigoOsApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import br.com.curso.aula162.dominio.valor.CodigoOs;

import java.util.Collections;
import java.util.List;

public class CollectionsDisjointCodigoOsApp {
    public static void main(String[] args) {
        List<CodigoOs> selecionadas = List.of(
                new CodigoOs("OS-2026-0001"),
                new CodigoOs("OS-2026-0002")
        );

        List<CodigoOs> bloqueadas = List.of(
                new CodigoOs("OS-2026-9999"),
                new CodigoOs("OS-2026-0002")
        );

        boolean semConflito = Collections.disjoint(selecionadas, bloqueadas);

        if (semConflito) {
            System.out.println("Não há conflito entre selecionadas e bloqueadas.");
        } else {
            System.out.println("Existe pelo menos uma OS selecionada que está bloqueada.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CollectionsDisjointCodigoOsApp
```

---

## Por que disjoint funciona com CodigoOs

`CodigoOs` possui:

```text
equals;
hashCode.
```

Então o Java consegue identificar que dois códigos são equivalentes.

Isso reforça novamente a importância de modelar bem objetos de valor.

---

## Collections.unmodifiableList

`Collections.unmodifiableList` cria uma visão não modificável de uma lista.

Crie:

```text
src\br\com\curso\aula162\app\CollectionsUnmodifiableListApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsUnmodifiableListApp {
    public static void main(String[] args) {
        List<String> interna = new ArrayList<>();

        interna.add("OS-2026-0001");
        interna.add("OS-2026-0002");

        List<String> externa = Collections.unmodifiableList(interna);

        System.out.println("Lista externa:");
        imprimir(externa);

        try {
            externa.add("OS-2026-0003");
        } catch (UnsupportedOperationException erro) {
            System.out.println();
            System.out.println("Não é possível alterar a lista externa.");
        }

        interna.add("OS-2026-0003");

        System.out.println();
        System.out.println("Após alterar a lista interna:");
        imprimir(externa);
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
java -cp out br.com.curso.aula162.app.CollectionsUnmodifiableListApp
```

---

## Cuidado com unmodifiableList

`unmodifiableList` não cria necessariamente uma cópia independente.

Ele cria uma visão não modificável.

Se a lista original mudar, a visão pode refletir a mudança.

Por isso, quando quiser proteger de verdade, uma opção moderna e simples é:

```java
List.copyOf(lista)
```

Vamos comparar.

---

## List.copyOf para cópia não modificável

Crie:

```text
src\br\com\curso\aula162\app\ListCopyOfProtecaoApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import java.util.ArrayList;
import java.util.List;

public class ListCopyOfProtecaoApp {
    public static void main(String[] args) {
        List<String> interna = new ArrayList<>();

        interna.add("OS-2026-0001");
        interna.add("OS-2026-0002");

        List<String> copia = List.copyOf(interna);

        interna.add("OS-2026-0003");

        System.out.println("Lista interna:");
        imprimir(interna);

        System.out.println();
        System.out.println("Cópia protegida:");
        imprimir(copia);

        try {
            copia.add("OS-2026-9999");
        } catch (UnsupportedOperationException erro) {
            System.out.println();
            System.out.println("A cópia também não pode ser alterada.");
        }
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
java -cp out br.com.curso.aula162.app.ListCopyOfProtecaoApp
```

---

## Qual usar para proteger retorno

Em código moderno, para retornar uma lista protegida, prefira:

```java
List.copyOf(lista)
```

Em código legado, você verá:

```java
Collections.unmodifiableList(lista)
```

Ambos são importantes de conhecer.

Mas entenda a diferença:

```text
unmodifiableList:
visão não modificável da lista original.

List.copyOf:
cópia não modificável.
```

---

## Classe de cadastro usando List.copyOf

Crie:

```text
src\br\com\curso\aula162\infra\CadastroResumoOsCollectionsMemoria.java
```

Código:

```java
package br.com.curso.aula162.infra;

import br.com.curso.aula162.dominio.ordemservico.OrdemServicoResumo;
import br.com.curso.aula162.dominio.ordemservico.StatusOs;
import br.com.curso.aula162.dominio.valor.CodigoOs;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CadastroResumoOsCollectionsMemoria {
    private final List<OrdemServicoResumo> ordens;

    public CadastroResumoOsCollectionsMemoria() {
        this.ordens = new ArrayList<>();
    }

    public void cadastrar(OrdemServicoResumo os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (existe(os.codigo())) {
            throw new IllegalStateException("OS já cadastrada: " + os.codigo().resumo());
        }

        ordens.add(os);
    }

    public boolean existe(CodigoOs codigo) {
        for (OrdemServicoResumo os : ordens) {
            if (os.codigo().equals(codigo)) {
                return true;
            }
        }

        return false;
    }

    public List<OrdemServicoResumo> listar() {
        return List.copyOf(ordens);
    }

    public List<CodigoOs> listarCodigosOrdenados() {
        List<CodigoOs> codigos = new ArrayList<>();

        for (OrdemServicoResumo os : ordens) {
            codigos.add(os.codigo());
        }

        Collections.sort(codigos);

        return List.copyOf(codigos);
    }

    public int contarPorStatus(StatusOs status) {
        int total = 0;

        for (OrdemServicoResumo os : ordens) {
            if (os.possuiStatus(status)) {
                total++;
            }
        }

        return total;
    }

    public int quantidade() {
        return ordens.size();
    }
}
```

---

## App usando cadastro e Collections

Crie:

```text
src\br\com\curso\aula162\app\CadastroResumoOsCollectionsApp.java
```

Código:

```java
package br.com.curso.aula162.app;

import br.com.curso.aula162.dominio.ordemservico.OrdemServicoResumo;
import br.com.curso.aula162.dominio.ordemservico.StatusOs;
import br.com.curso.aula162.dominio.valor.CodigoOs;
import br.com.curso.aula162.infra.CadastroResumoOsCollectionsMemoria;

import java.time.LocalDate;

public class CadastroResumoOsCollectionsApp {
    public static void main(String[] args) {
        CadastroResumoOsCollectionsMemoria cadastro = new CadastroResumoOsCollectionsMemoria();

        cadastro.cadastrar(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.AGENDADA
        ));

        cadastro.cadastrar(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.CONCLUIDA
        ));

        cadastro.cadastrar(new OrdemServicoResumo(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.AGENDADA
        ));

        System.out.println("OS cadastradas:");
        for (OrdemServicoResumo os : cadastro.listar()) {
            System.out.println("- " + os.resumo());
        }

        System.out.println();
        System.out.println("Códigos ordenados:");
        for (CodigoOs codigo : cadastro.listarCodigosOrdenados()) {
            System.out.println("- " + codigo.resumo());
        }

        System.out.println();
        System.out.println("Agendadas: " + cadastro.contarPorStatus(StatusOs.AGENDADA));
        System.out.println("Quantidade total: " + cadastro.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula162.app.CadastroResumoOsCollectionsApp
```

---

## O que esse cadastro demonstra

Ele demonstra uso profissional de utilitários:

```text
Collections.sort para ordenar códigos;
List.copyOf para proteger retorno;
List interna mutável controlada pela classe;
objeto de valor com Comparable;
entidade/resumo com LocalDate e enum.
```

Isso conecta Collections com modelagem.

---

## Guia rápido dos métodos estudados

```text
Collections.sort(lista)
ordena a lista.

Collections.reverse(lista)
inverte a ordem atual.

Collections.shuffle(lista)
embaralha.

Collections.min(colecao)
retorna o menor pela ordem natural.

Collections.max(colecao)
retorna o maior pela ordem natural.

Collections.frequency(colecao, valor)
conta ocorrências de um valor.

Collections.disjoint(a, b)
verifica se duas coleções não têm itens em comum.

Collections.swap(lista, i, j)
troca dois elementos de posição.

Collections.fill(lista, valor)
substitui todos os elementos por um valor.

Collections.copy(destino, origem)
copia para lista destino já dimensionada.

Collections.binarySearch(listaOrdenada, valor)
busca valor em lista ordenada.

Collections.unmodifiableList(lista)
cria visão não modificável.
```

---

## Quando usar Collections

Use `Collections` quando:

```text
precisa de operação pronta;
quer evitar algoritmo manual;
quer ordenar;
quer inverter;
quer embaralhar;
quer calcular min/max simples;
quer contar ocorrência de um item;
quer verificar interseção;
quer proteger lista.
```

Mas lembre:

```text
Collections é ferramenta.
Ela não substitui modelagem.
```

A regra de negócio deve continuar clara.

---

## Ligação com backend

`Collections` aparece em backend em situações como:

```text
ordenar listas antes de responder API;
embaralhar dados em testes;
validar interseção entre permissões;
contar ocorrência de status específico;
proteger lista retornada por domínio;
copiar lista antes de alterar;
buscar em lista ordenada;
inverter ordem de exibição.
```

Exemplo:

```text
Um endpoint retorna códigos de OS ordenados.
```

Você pode:

```java
List<CodigoOs> codigos = new ArrayList<>(...);
Collections.sort(codigos);
return List.copyOf(codigos);
```

---

## Importante para sua formação

Um engenheiro Java não precisa decorar todos os métodos.

Mas precisa saber que a biblioteca padrão existe e deve ser consultada.

Antes de criar um algoritmo manual, pergunte:

```text
o Java já tem um utilitário para isso?
```

Isso evita código duplicado, frágil e difícil de manter.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Ordenação

Execute:

```powershell
java -cp out br.com.curso.aula162.app.CollectionsSortStringApp
java -cp out br.com.curso.aula162.app.CollectionsSortIntegerApp
java -cp out br.com.curso.aula162.app.CollectionsSortListaImutavelApp
java -cp out br.com.curso.aula162.app.CollectionsSortCopiaMutavelApp
```

### Parte 2 — Ordem e aleatoriedade

Execute:

```powershell
java -cp out br.com.curso.aula162.app.CollectionsReverseApp
java -cp out br.com.curso.aula162.app.CollectionsSortReverseApp
java -cp out br.com.curso.aula162.app.CollectionsShuffleApp
```

### Parte 3 — Consultas utilitárias

Execute:

```powershell
java -cp out br.com.curso.aula162.app.CollectionsMinMaxNumerosApp
java -cp out br.com.curso.aula162.app.CollectionsMinMaxStringApp
java -cp out br.com.curso.aula162.app.CollectionsFrequencyApp
java -cp out br.com.curso.aula162.app.CollectionsDisjointApp
```

### Parte 4 — Manipulação

Execute:

```powershell
java -cp out br.com.curso.aula162.app.CollectionsSwapApp
java -cp out br.com.curso.aula162.app.CollectionsFillApp
java -cp out br.com.curso.aula162.app.CollectionsCopyApp
java -cp out br.com.curso.aula162.app.CollectionsCopyErroApp
```

### Parte 5 — Busca e objetos

Execute:

```powershell
java -cp out br.com.curso.aula162.app.CollectionsBinarySearchApp
java -cp out br.com.curso.aula162.app.CollectionsSortCodigoOsApp
java -cp out br.com.curso.aula162.app.CollectionsCodigoOsUtilitariosApp
java -cp out br.com.curso.aula162.app.CollectionsFrequencyStatusApp
java -cp out br.com.curso.aula162.app.CollectionsDisjointCodigoOsApp
```

### Parte 6 — Proteção e cadastro

Execute:

```powershell
java -cp out br.com.curso.aula162.app.CollectionsUnmodifiableListApp
java -cp out br.com.curso.aula162.app.ListCopyOfProtecaoApp
java -cp out br.com.curso.aula162.app.CadastroResumoOsCollectionsApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula162\app\PainelCodigosCollectionsApp.java
```

Ele deve:

```text
criar uma List<CodigoOs>;
adicionar códigos fora de ordem;
fazer uma cópia mutável;
ordenar a cópia;
exibir original;
exibir ordenada;
exibir menor código;
exibir maior código;
buscar um código com binarySearch após ordenar.
```

Critério principal:

```text
não alterar a lista original.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula162\app\ValidacaoConflitoTecnicosApp.java
```

Ele deve:

```text
criar uma lista de técnicos disponíveis;
criar uma lista de técnicos bloqueados;
usar Collections.disjoint para verificar conflito;
se houver conflito, exibir mensagem de bloqueio;
se não houver conflito, exibir mensagem de liberação.
```

Depois crie uma segunda execução no mesmo app com conflito.

Critério principal:

```text
usar disjoint corretamente e explicar o resultado por mensagem.
```

---

## Erros comuns nesta aula

### 1. Confundir Collection com Collections

Uma é interface.

Outra é classe utilitária.

### 2. Usar sort em lista imutável

`List.of` cria lista imutável.

Faça cópia mutável antes.

### 3. Achar que reverse ordena

`reverse` apenas inverte a ordem atual.

### 4. Usar binarySearch em lista não ordenada

A busca binária exige lista ordenada.

### 5. Usar copy com lista destino vazia

`Collections.copy` exige destino com tamanho suficiente.

### 6. Achar que unmodifiableList é cópia independente

Ela é uma visão não modificável.

A lista original ainda pode mudar.

### 7. Usar shuffle em regra crítica sem critério

Aleatoriedade precisa de cuidado.

### 8. Criar algoritmo manual sem verificar utilitários prontos

A biblioteca padrão existe para ser usada.

---

## Debug recomendado

Use debug em:

```text
CollectionsSortStringApp.java
CollectionsSortListaImutavelApp.java
CollectionsSortCopiaMutavelApp.java
CollectionsReverseApp.java
CollectionsFrequencyApp.java
CollectionsDisjointApp.java
CollectionsCopyApp.java
CollectionsBinarySearchApp.java
CollectionsSortCodigoOsApp.java
CollectionsUnmodifiableListApp.java
ListCopyOfProtecaoApp.java
CadastroResumoOsCollectionsMemoria.java
```

Breakpoints recomendados:

```java
Collections.sort(...)

Collections.reverse(...)

Collections.shuffle(...)

Collections.min(...)

Collections.max(...)

Collections.frequency(...)

Collections.disjoint(...)

Collections.copy(...)

Collections.binarySearch(...)

Collections.unmodifiableList(...)

List.copyOf(...)

compareTo(...)
```

Observe:

```text
quais métodos alteram a lista original;
quais retornam valor;
quando lista imutável falha;
como Comparable permite ordenar CodigoOs;
como unmodifiableList reflete a lista interna;
como List.copyOf cria uma cópia protegida.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre Collection e Collections?
2. Por que Collections.sort não funciona em List.of?
3. Quando usar List.copyOf em vez de retornar a lista interna?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
diferenciar Collection e Collections;
usar Collections.sort;
usar Collections.reverse;
usar Collections.shuffle;
usar Collections.min;
usar Collections.max;
usar Collections.frequency;
usar Collections.disjoint;
usar Collections.swap;
usar Collections.fill;
usar Collections.copy;
usar Collections.binarySearch;
explicar lista imutável;
fazer cópia mutável antes de ordenar;
usar objeto Comparable com Collections.sort;
usar List.copyOf para proteger retorno;
explicar unmodifiableList;
resolver PainelCodigosCollectionsApp;
resolver ValidacaoConflitoTecnicosApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-162-collections-utility-class
git commit -m "Aula 162: collections utility class"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Collections é uma classe utilitária com métodos prontos para manipular coleções.
```

Você viu que ela ajuda a ordenar, inverter, embaralhar, contar, buscar, copiar, proteger e comparar coleções.

Também viu que métodos utilitários não substituem boa modelagem.

Na próxima aula, vamos aprofundar ordenação personalizada.

Vamos estudar `Comparator`, ordenar por diferentes campos e entender como criar critérios de ordenação profissionais para objetos de domínio.
