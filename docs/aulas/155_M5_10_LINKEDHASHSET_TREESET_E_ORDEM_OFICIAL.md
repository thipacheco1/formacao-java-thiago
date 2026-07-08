# 155 — M5.10 — LinkedHashSet, TreeSet e ordem

## Objetivo da aula

Nesta aula você vai aprofundar a família `Set`, entendendo três implementações importantes:

```text
HashSet;
LinkedHashSet;
TreeSet.
```

Na aula anterior, você estudou `equals` e `hashCode`, entendendo como `HashSet` decide se dois objetos são duplicados.

Agora vamos estudar outro ponto essencial:

```text
ordem.
```

Ao final da aula, você deve conseguir:

```text
explicar que Set não aceita duplicados;
comparar HashSet, LinkedHashSet e TreeSet;
entender que HashSet não garante ordem;
entender que LinkedHashSet preserva ordem de inserção;
entender que TreeSet mantém ordenação;
usar Set com String;
usar Set com enum;
usar Set com objetos próprios;
entender o papel de Comparable no TreeSet;
entender erro ao usar TreeSet com objeto não comparável;
entender quando usar cada implementação;
evitar escolher Set errado por falta de critério.
```

Esta aula fecha a visão inicial de `Set`.

Depois dela, você estará pronto para iniciar `Map`.

---

## Ideia principal

Todas estas implementações representam conjuntos:

```text
HashSet;
LinkedHashSet;
TreeSet.
```

Todas evitam duplicidade.

Mas elas diferem em relação à ordem.

Resumo inicial:

```text
HashSet:
não garante ordem.

LinkedHashSet:
preserva ordem de inserção.

TreeSet:
mantém os elementos ordenados.
```

A escolha depende do problema.

---

## Relembrando Set

`Set` representa um conjunto de elementos únicos.

Exemplo:

```java
Set<String> codigos = new HashSet<>();

codigos.add("OS-2026-0001");
codigos.add("OS-2026-0001");
codigos.add("OS-2026-0002");
```

Mesmo tentando adicionar repetido, o conjunto terá apenas valores únicos.

Essa regra vale para:

```text
HashSet;
LinkedHashSet;
TreeSet.
```

O que muda é a forma de organização interna.

---

## HashSet em uma frase

`HashSet` é bom quando você quer unicidade e não se importa com ordem.

Exemplo:

```text
preciso saber quais códigos únicos existem;
não preciso exibir na mesma ordem que chegaram;
não preciso ordenar.
```

Ele é muito usado para validação de duplicidade.

---

## LinkedHashSet em uma frase

`LinkedHashSet` é bom quando você quer unicidade e quer preservar a ordem de inserção.

Exemplo:

```text
recebi uma lista de códigos;
quero remover duplicados;
mas quero manter a primeira ordem em que apareceram.
```

Isso é muito útil em importações, relatórios e telas.

---

## TreeSet em uma frase

`TreeSet` é bom quando você quer unicidade e quer manter os elementos ordenados.

Exemplo:

```text
quero códigos únicos ordenados;
quero nomes únicos em ordem alfabética;
quero números únicos em ordem crescente.
```

Mas `TreeSet` precisa saber como comparar os elementos.

Para `String` e números, isso já existe.

Para objetos próprios, você precisa fornecer critério de ordenação.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-155-linkedhashset-treeset-e-ordem
cd labs\m5\aula-155-linkedhashset-treeset-e-ordem
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula155
mkdir src\br\com\curso\aula155\app
mkdir src\br\com\curso\aula155\dominio
mkdir src\br\com\curso\aula155\dominio\valor
mkdir src\br\com\curso\aula155\dominio\ordemservico
```

---

## HashSet não garante ordem

Crie:

```text
src\br\com\curso\aula155\app\HashSetOrdemApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import java.util.HashSet;
import java.util.Set;

public class HashSetOrdemApp {
    public static void main(String[] args) {
        Set<String> codigos = new HashSet<>();

        codigos.add("OS-2026-0003");
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0004");

        System.out.println("HashSet:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.HashSetOrdemApp
```

---

## O que observar no HashSet

Você inseriu nesta ordem:

```text
OS-2026-0003
OS-2026-0001
OS-2026-0002
OS-2026-0001
OS-2026-0004
```

Mas a saída pode aparecer em outra ordem.

Isso não é bug.

É comportamento esperado.

`HashSet` não promete ordem de iteração.

Regra prática:

```text
se ordem importa, não dependa de HashSet.
```

---

## LinkedHashSet preserva ordem de inserção

Crie:

```text
src\br\com\curso\aula155\app\LinkedHashSetOrdemInsercaoApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import java.util.LinkedHashSet;
import java.util.Set;

public class LinkedHashSetOrdemInsercaoApp {
    public static void main(String[] args) {
        Set<String> codigos = new LinkedHashSet<>();

        codigos.add("OS-2026-0003");
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0004");

        System.out.println("LinkedHashSet:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.LinkedHashSetOrdemInsercaoApp
```

---

## O que observar no LinkedHashSet

A saída preserva a primeira ordem de inserção dos valores únicos:

```text
OS-2026-0003
OS-2026-0001
OS-2026-0002
OS-2026-0004
```

O duplicado:

```text
OS-2026-0001
```

não entra novamente.

O `LinkedHashSet` mantém:

```text
unicidade;
ordem de inserção.
```

---

## TreeSet mantém ordenação

Crie:

```text
src\br\com\curso\aula155\app\TreeSetOrdenacaoApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import java.util.Set;
import java.util.TreeSet;

public class TreeSetOrdenacaoApp {
    public static void main(String[] args) {
        Set<String> codigos = new TreeSet<>();

        codigos.add("OS-2026-0003");
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0004");

        System.out.println("TreeSet:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.TreeSetOrdenacaoApp
```

---

## O que observar no TreeSet

A saída fica ordenada:

```text
OS-2026-0001
OS-2026-0002
OS-2026-0003
OS-2026-0004
```

O duplicado não entra.

O `TreeSet` mantém:

```text
unicidade;
ordenação.
```

Com `String`, a ordenação natural é alfabética/lexicográfica.

---

## Comparando os três no mesmo app

Crie:

```text
src\br\com\curso\aula155\app\ComparacaoHashLinkedTreeSetApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

public class ComparacaoHashLinkedTreeSetApp {
    public static void main(String[] args) {
        Set<String> hashSet = new HashSet<>();
        Set<String> linkedHashSet = new LinkedHashSet<>();
        Set<String> treeSet = new TreeSet<>();

        adicionar(hashSet);
        adicionar(linkedHashSet);
        adicionar(treeSet);

        imprimir("HashSet - sem garantia de ordem", hashSet);
        imprimir("LinkedHashSet - ordem de inserção", linkedHashSet);
        imprimir("TreeSet - ordenado", treeSet);
    }

    private static void adicionar(Set<String> codigos) {
        codigos.add("OS-2026-0003");
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0004");
    }

    private static void imprimir(String titulo, Set<String> codigos) {
        System.out.println();
        System.out.println(titulo);

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.ComparacaoHashLinkedTreeSetApp
```

---

## O que a comparação mostra

As três estruturas removem duplicidade.

Mas a ordem muda:

```text
HashSet:
não promete ordem.

LinkedHashSet:
mantém a primeira ordem de inserção.

TreeSet:
mantém ordenado.
```

Esse é o ponto principal da aula.

---

## Remover duplicados mantendo ordem

Este é um uso clássico de `LinkedHashSet`.

Crie:

```text
src\br\com\curso\aula155\app\RemoverDuplicadosMantendoOrdemApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class RemoverDuplicadosMantendoOrdemApp {
    public static void main(String[] args) {
        List<String> codigosRecebidos = List.of(
                "OS-2026-0003",
                "OS-2026-0001",
                "OS-2026-0003",
                "OS-2026-0002",
                "OS-2026-0001",
                "OS-2026-0004"
        );

        Set<String> unicosMantendoOrdem = new LinkedHashSet<>(codigosRecebidos);
        List<String> listaFinal = new ArrayList<>(unicosMantendoOrdem);

        System.out.println("Recebidos:");

        for (String codigo : codigosRecebidos) {
            System.out.println("- " + codigo);
        }

        System.out.println();
        System.out.println("Sem duplicidade e mantendo ordem:");

        for (String codigo : listaFinal) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.RemoverDuplicadosMantendoOrdemApp
```

---

## Por que isso é útil

Imagine uma importação.

Você recebe códigos nesta ordem:

```text
OS-0003
OS-0001
OS-0003
OS-0002
```

Você quer remover duplicados, mas manter a ordem original de chegada.

`LinkedHashSet` resolve bem:

```java
new LinkedHashSet<>(lista)
```

Depois, se precisar de `List`:

```java
new ArrayList<>(set)
```

---

## Remover duplicados e ordenar

Agora use `TreeSet`.

Crie:

```text
src\br\com\curso\aula155\app\RemoverDuplicadosOrdenandoApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

public class RemoverDuplicadosOrdenandoApp {
    public static void main(String[] args) {
        List<String> codigosRecebidos = List.of(
                "OS-2026-0003",
                "OS-2026-0001",
                "OS-2026-0003",
                "OS-2026-0002",
                "OS-2026-0001",
                "OS-2026-0004"
        );

        Set<String> unicosOrdenados = new TreeSet<>(codigosRecebidos);
        List<String> listaFinal = new ArrayList<>(unicosOrdenados);

        System.out.println("Sem duplicidade e ordenado:");

        for (String codigo : listaFinal) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.RemoverDuplicadosOrdenandoApp
```

---

## Escolha entre LinkedHashSet e TreeSet

Use `LinkedHashSet` quando:

```text
a ordem original importa;
você quer preservar a primeira aparição;
não quer ordenar.
```

Use `TreeSet` quando:

```text
a ordem natural ou definida importa;
você quer exibir ordenado;
você quer manter conjunto sempre ordenado.
```

Exemplo:

```text
Importação:
LinkedHashSet pode fazer sentido.

Relatório ordenado:
TreeSet pode fazer sentido.
```

---

## TreeSet com números

Crie:

```text
src\br\com\curso\aula155\app\TreeSetNumerosApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import java.util.Set;
import java.util.TreeSet;

public class TreeSetNumerosApp {
    public static void main(String[] args) {
        Set<Integer> numeros = new TreeSet<>();

        numeros.add(30);
        numeros.add(10);
        numeros.add(20);
        numeros.add(10);
        numeros.add(40);

        System.out.println("Números únicos ordenados:");

        for (Integer numero : numeros) {
            System.out.println("- " + numero);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.TreeSetNumerosApp
```

---

## Ordenação natural

`String` tem ordenação natural.

`Integer` também.

Outras classes comuns também.

Mas uma classe criada por você não tem ordenação natural automaticamente.

Se tentar usar `TreeSet` com objeto próprio sem critério de comparação, pode dar erro.

---

## Objeto próprio sem Comparable

Crie:

```text
src\br\com\curso\aula155\dominio\ordemservico\ResumoOsSemComparable.java
```

Código:

```java
package br.com.curso.aula155.dominio.ordemservico;

public class ResumoOsSemComparable {
    private final String codigo;
    private final String cliente;

    public ResumoOsSemComparable(String codigo, String cliente) {
        this.codigo = codigo;
        this.cliente = cliente;
    }

    public String resumo() {
        return codigo + " | Cliente: " + cliente;
    }
}
```

Agora crie:

```text
src\br\com\curso\aula155\app\TreeSetObjetoSemComparableApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import br.com.curso.aula155.dominio.ordemservico.ResumoOsSemComparable;

import java.util.Set;
import java.util.TreeSet;

public class TreeSetObjetoSemComparableApp {
    public static void main(String[] args) {
        Set<ResumoOsSemComparable> ordens = new TreeSet<>();

        try {
            ordens.add(new ResumoOsSemComparable("OS-2026-0002", "Carlos Souza"));
            ordens.add(new ResumoOsSemComparable("OS-2026-0001", "Ana Silva"));
        } catch (RuntimeException erro) {
            System.out.println("Erro ao adicionar objeto sem critério de comparação.");
            System.out.println("Tipo: " + erro.getClass().getSimpleName());
            System.out.println("Mensagem: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.TreeSetObjetoSemComparableApp
```

---

## Por que esse erro acontece

`TreeSet` precisa ordenar.

Para ordenar, ele precisa comparar:

```text
este objeto vem antes ou depois daquele?
```

Com `String`, o Java sabe.

Com `Integer`, o Java sabe.

Com `ResumoOsSemComparable`, o Java não sabe.

Então você precisa dar um critério.

Uma forma é implementar:

```text
Comparable
```

Outra forma é passar um:

```text
Comparator
```

Nesta aula vamos ver `Comparable` de forma inicial.

`Comparator` será aprofundado mais adiante.

---

## Criando CodigoOs comparável

Crie:

```text
src\br\com\curso\aula155\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula155.dominio.valor;

import java.util.Objects;

public final class CodigoOs implements Comparable<CodigoOs> {
    private final String valor;

    public CodigoOs(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (!valor.startsWith("OS-")) {
            throw new IllegalArgumentException("Código deve iniciar com OS-.");
        }

        this.valor = valor;
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

## Entendendo Comparable

Quando uma classe implementa:

```java
Comparable<CodigoOs>
```

ela diz:

```text
eu sei me comparar com outro CodigoOs.
```

O método:

```java
compareTo(CodigoOs outro)
```

define a ordem.

No nosso caso:

```java
return this.valor.compareTo(outro.valor);
```

Ordena pelo texto do código.

---

## TreeSet com CodigoOs

Crie:

```text
src\br\com\curso\aula155\app\TreeSetCodigoOsApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import br.com.curso.aula155.dominio.valor.CodigoOs;

import java.util.Set;
import java.util.TreeSet;

public class TreeSetCodigoOsApp {
    public static void main(String[] args) {
        Set<CodigoOs> codigos = new TreeSet<>();

        codigos.add(new CodigoOs("OS-2026-0003"));
        codigos.add(new CodigoOs("OS-2026-0001"));
        codigos.add(new CodigoOs("OS-2026-0002"));
        codigos.add(new CodigoOs("OS-2026-0001"));

        System.out.println("Códigos ordenados:");

        for (CodigoOs codigo : codigos) {
            System.out.println("- " + codigo.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.TreeSetCodigoOsApp
```

---

## TreeSet usa comparação para unicidade

Este ponto é importante.

Em `TreeSet`, a comparação também influencia a unicidade.

Se `compareTo` diz que dois objetos são equivalentes, o `TreeSet` entende que não deve adicionar duplicado.

Por isso, `compareTo`, `equals` e `hashCode` devem ser coerentes sempre que possível.

No nosso `CodigoOs`, todos usam o campo:

```text
valor
```

Isso mantém coerência.

---

## Resumo de regra para Comparable

Se você implementar `Comparable`, pense:

```text
qual é a ordem natural deste objeto?
```

Exemplos:

```text
CodigoOs:
ordem pelo valor do código.

CodigoCliente:
ordem pelo valor do código.

NomeCliente:
ordem alfabética.

DataAtendimento:
ordem por data.
```

Mas nem todo objeto precisa ter ordem natural.

Às vezes, é melhor usar `Comparator` externo.

---

## TreeSet com ordem natural de enum

Enum também pode ser usado em `TreeSet`.

Crie:

```text
src\br\com\curso\aula155\dominio\ordemservico\PrioridadeOs.java
```

Código:

```java
package br.com.curso.aula155.dominio.ordemservico;

public enum PrioridadeOs {
    NORMAL,
    ALTA,
    CRITICA
}
```

Crie:

```text
src\br\com\curso\aula155\app\TreeSetEnumApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import br.com.curso.aula155.dominio.ordemservico.PrioridadeOs;

import java.util.Set;
import java.util.TreeSet;

public class TreeSetEnumApp {
    public static void main(String[] args) {
        Set<PrioridadeOs> prioridades = new TreeSet<>();

        prioridades.add(PrioridadeOs.CRITICA);
        prioridades.add(PrioridadeOs.NORMAL);
        prioridades.add(PrioridadeOs.ALTA);
        prioridades.add(PrioridadeOs.CRITICA);

        System.out.println("Prioridades no TreeSet:");

        for (PrioridadeOs prioridade : prioridades) {
            System.out.println("- " + prioridade);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.TreeSetEnumApp
```

---

## Cuidado com ordem de enum

A ordem natural de enum segue a ordem declarada.

No enum:

```java
NORMAL,
ALTA,
CRITICA
```

A ordem natural é:

```text
NORMAL;
ALTA;
CRITICA.
```

Se você quiser outra ordem, como `CRITICA` primeiro, precisará de outro critério de ordenação.

Veremos isso melhor com `Comparator`.

---

## Escolha prática entre Set implementations

### HashSet

Use quando:

```text
não aceita duplicados;
ordem não importa;
quer uma estrutura geral para unicidade.
```

Exemplo:

```java
Set<String> codigos = new HashSet<>();
```

### LinkedHashSet

Use quando:

```text
não aceita duplicados;
ordem de inserção importa;
quer remover duplicados mantendo primeira aparição.
```

Exemplo:

```java
Set<String> codigos = new LinkedHashSet<>();
```

### TreeSet

Use quando:

```text
não aceita duplicados;
quer manter ordenado;
os elementos são comparáveis ou existe Comparator.
```

Exemplo:

```java
Set<String> codigos = new TreeSet<>();
```

---

## Mini-cenário: importação de OS

Crie:

```text
src\br\com\curso\aula155\app\ImportacaoSetOrdemApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

public class ImportacaoSetOrdemApp {
    public static void main(String[] args) {
        List<String> codigosImportados = List.of(
                "OS-2026-0005",
                "OS-2026-0002",
                "OS-2026-0005",
                "OS-2026-0001",
                "OS-2026-0003",
                "OS-2026-0002"
        );

        Set<String> unicosSemOrdem = new HashSet<>(codigosImportados);
        Set<String> unicosMantendoOrdem = new LinkedHashSet<>(codigosImportados);
        Set<String> unicosOrdenados = new TreeSet<>(codigosImportados);

        imprimir("Únicos sem ordem garantida", unicosSemOrdem);
        imprimir("Únicos mantendo ordem de chegada", unicosMantendoOrdem);
        imprimir("Únicos ordenados", unicosOrdenados);
    }

    private static void imprimir(String titulo, Set<String> codigos) {
        System.out.println();
        System.out.println(titulo);

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.ImportacaoSetOrdemApp
```

---

## O que esse mini-cenário mostra

A mesma lista de entrada pode gerar três visões:

```text
únicos sem ordem garantida;
únicos mantendo ordem de chegada;
únicos ordenados.
```

A escolha depende do requisito.

Exemplo:

```text
"Não pode repetir e tanto faz a ordem":
HashSet.

"Não pode repetir e precisa manter ordem do arquivo":
LinkedHashSet.

"Não pode repetir e precisa exibir ordenado":
TreeSet.
```

---

## Cuidado com null

`HashSet` e `LinkedHashSet` podem aceitar `null`.

`TreeSet` pode ter problema com `null`, porque precisa comparar.

Crie:

```text
src\br\com\curso\aula155\app\TreeSetComNullApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import java.util.Set;
import java.util.TreeSet;

public class TreeSetComNullApp {
    public static void main(String[] args) {
        Set<String> codigos = new TreeSet<>();

        codigos.add("OS-2026-0001");

        try {
            codigos.add(null);
        } catch (RuntimeException erro) {
            System.out.println("Não foi possível adicionar null no TreeSet.");
            System.out.println("Tipo: " + erro.getClass().getSimpleName());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.TreeSetComNullApp
```

---

## Regra profissional sobre null

Mesmo que algumas coleções aceitem `null`, evite colocar `null` em coleções.

Coleção com `null` costuma gerar bugs.

Prefira validar antes:

```java
if (codigo == null || codigo.isBlank()) {
    throw new IllegalArgumentException("Código inválido.");
}
```

Ou ignore valores inválidos antes de adicionar.

---

## Limpando dados antes de Set

Crie:

```text
src\br\com\curso\aula155\app\LimpezaAntesDoSetApp.java
```

Código:

```java
package br.com.curso.aula155.app;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

public class LimpezaAntesDoSetApp {
    public static void main(String[] args) {
        List<String> codigosRecebidos = List.of(
                "OS-2026-0002",
                " ",
                "OS-2026-0001",
                "OS-2026-0002",
                "OS-2026-0003"
        );

        Set<String> codigosValidos = new LinkedHashSet<>();

        for (String codigo : codigosRecebidos) {
            if (codigoValido(codigo)) {
                codigosValidos.add(codigo.trim());
            }
        }

        System.out.println("Códigos válidos únicos mantendo ordem:");

        for (String codigo : codigosValidos) {
            System.out.println("- " + codigo);
        }
    }

    private static boolean codigoValido(String codigo) {
        return codigo != null
                && !codigo.isBlank()
                && codigo.trim().startsWith("OS-");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula155.app.LimpezaAntesDoSetApp
```

---

## Ligação com backend

Essas estruturas aparecem em backend para:

```text
remover duplicidade de ids;
validar dados importados;
preservar ordem de chegada;
exibir códigos ordenados;
controlar permissões únicas;
gerar relatórios;
evitar processamento repetido;
montar filtros únicos;
normalizar listas recebidas.
```

Exemplo realista:

```text
Uma API recebe uma lista de códigos de OS.
Precisa remover duplicados.
Precisa manter a ordem enviada pelo usuário.
```

Nesse caso, `LinkedHashSet` pode ser melhor do que `HashSet`.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Rodar exemplos de ordem

Execute:

```powershell
java -cp out br.com.curso.aula155.app.HashSetOrdemApp
java -cp out br.com.curso.aula155.app.LinkedHashSetOrdemInsercaoApp
java -cp out br.com.curso.aula155.app.TreeSetOrdenacaoApp
java -cp out br.com.curso.aula155.app.ComparacaoHashLinkedTreeSetApp
```

Compare as saídas.

### Parte 2 — Converter e limpar duplicidade

Execute:

```powershell
java -cp out br.com.curso.aula155.app.RemoverDuplicadosMantendoOrdemApp
java -cp out br.com.curso.aula155.app.RemoverDuplicadosOrdenandoApp
java -cp out br.com.curso.aula155.app.ImportacaoSetOrdemApp
```

### Parte 3 — Testar TreeSet

Execute:

```powershell
java -cp out br.com.curso.aula155.app.TreeSetNumerosApp
java -cp out br.com.curso.aula155.app.TreeSetObjetoSemComparableApp
java -cp out br.com.curso.aula155.app.TreeSetCodigoOsApp
java -cp out br.com.curso.aula155.app.TreeSetEnumApp
```

### Parte 4 — Testar cuidados

Execute:

```powershell
java -cp out br.com.curso.aula155.app.TreeSetComNullApp
java -cp out br.com.curso.aula155.app.LimpezaAntesDoSetApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula155\app\ImportacaoClientesUnicosApp.java
```

Ele deve:

```text
criar uma List<String> com códigos de cliente;
incluir duplicados;
incluir códigos fora de ordem;
gerar três Sets:
HashSet;
LinkedHashSet;
TreeSet;
exibir os três resultados;
explicar em mensagem a diferença de cada saída.
```

Exemplo de códigos:

```text
CLI-003;
CLI-001;
CLI-002;
CLI-001;
CLI-004;
CLI-003.
```

Critério principal:

```text
mostrar claramente a diferença entre sem ordem garantida, ordem de inserção e ordenação.
```

---

## Desafio extra

Crie um objeto de valor:

```text
src\br\com\curso\aula155\dominio\valor\CodigoCliente.java
```

Regras:

```text
classe final;
campo final;
não aceita nulo;
não aceita branco;
deve iniciar com CLI-;
implements Comparable<CodigoCliente>;
compareTo pelo valor;
equals pelo valor;
hashCode pelo valor.
```

Depois crie:

```text
src\br\com\curso\aula155\app\TreeSetCodigoClienteApp.java
```

Ele deve:

```text
criar TreeSet<CodigoCliente>;
adicionar CLI-003;
adicionar CLI-001;
adicionar CLI-002;
adicionar CLI-001 novamente;
exibir quantidade final;
exibir os códigos ordenados.
```

Critério principal:

```text
CLI-001 deve aparecer uma vez e a saída deve estar ordenada.
```

---

## Erros comuns nesta aula

### 1. Esperar ordem em HashSet

Não dependa da ordem de `HashSet`.

### 2. Usar TreeSet com objeto sem comparação

Objeto próprio precisa de `Comparable` ou `Comparator`.

### 3. Achar que LinkedHashSet ordena

Ele não ordena.

Ele preserva a ordem de inserção.

### 4. Achar que TreeSet preserva ordem de chegada

Não preserva.

Ele ordena.

### 5. Colocar null em TreeSet

Pode gerar erro porque o TreeSet precisa comparar.

### 6. Implementar compareTo incoerente com equals

Se possível, mantenha coerência.

### 7. Usar TreeSet quando só precisa remover duplicidade

Se não precisa ordenar, `HashSet` ou `LinkedHashSet` pode ser mais simples.

### 8. Usar Set quando precisa de índice

Set não tem `get(0)`.

Se precisa de índice, use `List`.

---

## Debug recomendado

Use debug em:

```text
ComparacaoHashLinkedTreeSetApp.java
RemoverDuplicadosMantendoOrdemApp.java
RemoverDuplicadosOrdenandoApp.java
TreeSetObjetoSemComparableApp.java
TreeSetCodigoOsApp.java
ImportacaoSetOrdemApp.java
LimpezaAntesDoSetApp.java
```

Breakpoints recomendados:

```java
codigos.add(...)

new LinkedHashSet<>(codigosRecebidos)

new TreeSet<>(codigosRecebidos)

compareTo(...)

codigoValido(...)

codigosValidos.add(...)
```

Observe:

```text
quando duplicado é ignorado;
como LinkedHashSet mantém a primeira aparição;
como TreeSet ordena;
quando compareTo é chamado;
como o objeto próprio precisa saber se comparar;
como limpar dados antes de adicionar no Set.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre HashSet, LinkedHashSet e TreeSet?
2. Quando usar LinkedHashSet?
3. Por que TreeSet com objeto próprio precisa de Comparable ou Comparator?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar HashSet;
criar LinkedHashSet;
criar TreeSet;
explicar a diferença de ordem entre eles;
remover duplicados mantendo ordem;
remover duplicados ordenando;
usar TreeSet com String;
usar TreeSet com Integer;
entender erro com objeto sem Comparable;
criar objeto Comparable;
usar TreeSet com objeto de valor;
entender ordem natural de enum;
evitar null em TreeSet;
limpar dados antes de adicionar em Set;
resolver ImportacaoClientesUnicosApp;
resolver TreeSetCodigoClienteApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-155-linkedhashset-treeset-e-ordem
git commit -m "Aula 155: linkedhashset treeset e ordem"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
as implementações de Set removem duplicidade, mas cada uma trata a ordem de forma diferente.
```

Você aprendeu:

```text
HashSet:
unicidade sem ordem garantida.

LinkedHashSet:
unicidade com ordem de inserção.

TreeSet:
unicidade com ordenação.
```

Na próxima aula, vamos iniciar `Map`.

Vamos entender chave e valor, por que `HashMap` é tão importante e como ele resolve buscas por código de forma mais direta do que percorrer uma lista.
