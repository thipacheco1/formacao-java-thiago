# 152 — M5.07 — LinkedList e diferenças com ArrayList

## Objetivo da aula

Nesta aula você vai conhecer outra implementação da interface `List`:

```text
LinkedList
```

Na aula anterior, você estudou remoção segura em listas com:

```text
Iterator;
for de trás para frente;
removeIf;
nova lista filtrada.
```

Até agora, quase todos os exemplos usaram:

```java
List<String> lista = new ArrayList<>();
```

Agora vamos entender que `ArrayList` não é a única implementação de `List`.

Ao final da aula, você deve conseguir:

```text
explicar o que é LinkedList;
explicar que ArrayList e LinkedList implementam List;
entender por que o código pode declarar List e trocar a implementação;
comparar ArrayList e LinkedList em operações comuns;
entender acesso por índice;
entender inserção e remoção;
entender uso de LinkedList como lista;
entender uso de LinkedList como fila;
usar métodos addFirst, addLast, removeFirst e removeLast;
entender quando ArrayList costuma ser melhor;
entender quando LinkedList pode fazer sentido;
evitar escolher estrutura por achismo.
```

Esta aula não é para decorar performance.

É para entender o comportamento e o papel de cada estrutura.

---

## Ideia principal

Tanto `ArrayList` quanto `LinkedList` implementam a interface `List`.

Isso significa que as duas podem ser usadas assim:

```java
List<String> nomes = new ArrayList<>();
```

ou:

```java
List<String> nomes = new LinkedList<>();
```

O tipo da variável continua sendo:

```java
List<String>
```

Mas a implementação interna muda.

Essa é a vantagem de programar contra interface.

---

## O que é ArrayList

`ArrayList` é uma lista baseada internamente em um array redimensionável.

Pense assim:

```text
ArrayList parece uma sequência de posições lado a lado.
```

Exemplo mental:

```text
[ OS-001 ][ OS-002 ][ OS-003 ][ OS-004 ]
```

Ele é muito bom para:

```text
acessar por índice;
percorrer;
adicionar no final;
uso geral de lista.
```

Por isso, `ArrayList` costuma ser a primeira escolha em muitos cenários.

---

## O que é LinkedList

`LinkedList` é uma lista encadeada.

Pense assim:

```text
cada elemento conhece o próximo e o anterior.
```

Exemplo mental:

```text
OS-001 <-> OS-002 <-> OS-003 <-> OS-004
```

Ela não funciona internamente como um array contínuo.

Ela trabalha com nós encadeados.

Cada nó guarda:

```text
valor;
referência para o anterior;
referência para o próximo.
```

Essa estrutura faz diferença em algumas operações.

---

## Importante: não escolha LinkedList só porque parece avançado

Muita gente pensa:

```text
LinkedList é mais avançada, então deve ser melhor.
```

Não é assim.

Na maioria dos casos comuns de backend, `ArrayList` costuma ser suficiente e muitas vezes melhor.

`LinkedList` tem usos específicos.

Você precisa entender o cenário.

Regra prática inicial:

```text
na dúvida, use ArrayList.
use LinkedList quando tiver motivo claro.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-152-linkedlist-e-diferencas-com-arraylist
cd labs\m5\aula-152-linkedlist-e-diferencas-com-arraylist
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula152
mkdir src\br\com\curso\aula152\app
mkdir src\br\com\curso\aula152\dominio
mkdir src\br\com\curso\aula152\dominio\ordemservico
```

---

## Primeiro exemplo com LinkedList

Crie:

```text
src\br\com\curso\aula152\app\PrimeiraLinkedListApp.java
```

Código:

```java
package br.com.curso.aula152.app;

import java.util.LinkedList;
import java.util.List;

public class PrimeiraLinkedListApp {
    public static void main(String[] args) {
        List<String> codigosOs = new LinkedList<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");
        codigosOs.add("OS-2026-0003");

        System.out.println("Quantidade: " + codigosOs.size());

        System.out.println();
        System.out.println("Códigos:");

        for (String codigo : codigosOs) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula152.app.PrimeiraLinkedListApp
```

---

## O que observar

O código é muito parecido com `ArrayList`.

Isso acontece porque estamos usando a interface:

```java
List<String>
```

E a implementação:

```java
new LinkedList<>()
```

Como `LinkedList` implementa `List`, ela tem métodos como:

```text
add;
get;
remove;
size;
isEmpty;
contains.
```

---

## Trocando ArrayList por LinkedList

Crie:

```text
src\br\com\curso\aula152\app\TrocaImplementacaoListApp.java
```

Código:

```java
package br.com.curso.aula152.app;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class TrocaImplementacaoListApp {
    public static void main(String[] args) {
        List<String> comArrayList = new ArrayList<>();
        List<String> comLinkedList = new LinkedList<>();

        preencher(comArrayList);
        preencher(comLinkedList);

        System.out.println("ArrayList:");
        imprimir(comArrayList);

        System.out.println();
        System.out.println("LinkedList:");
        imprimir(comLinkedList);
    }

    private static void preencher(List<String> codigos) {
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0003");
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
java -cp out br.com.curso.aula152.app.TrocaImplementacaoListApp
```

---

## O que esse exemplo ensina

Os métodos:

```java
preencher(List<String> codigos)
imprimir(List<String> codigos)
```

recebem `List`.

Por isso aceitam tanto:

```text
ArrayList;
LinkedList.
```

Isso reforça:

```text
programar contra a interface deixa o código mais flexível.
```

O método não precisa saber qual implementação está por trás.

Ele precisa apenas de uma lista.

---

## ArrayList vs LinkedList em visão simples

Pense assim:

### ArrayList

Bom para:

```text
acesso por índice;
percorrer;
adicionar no final;
uso geral.
```

### LinkedList

Pode fazer sentido para:

```text
muitas inserções e remoções no começo;
uso como fila;
operações no começo e no fim;
cenários onde não há muito acesso por índice.
```

Mas cuidado:

```text
LinkedList não é automaticamente melhor para remoção em qualquer lugar.
```

Para remover um elemento no meio, primeiro você precisa encontrá-lo.

Buscar em lista continua exigindo percorrer.

---

## Acesso por índice

Crie:

```text
src\br\com\curso\aula152\app\AcessoPorIndiceComparacaoApp.java
```

Código:

```java
package br.com.curso.aula152.app;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class AcessoPorIndiceComparacaoApp {
    public static void main(String[] args) {
        List<String> arrayList = new ArrayList<>();
        List<String> linkedList = new LinkedList<>();

        preencher(arrayList);
        preencher(linkedList);

        System.out.println("ArrayList posição 2: " + arrayList.get(2));
        System.out.println("LinkedList posição 2: " + linkedList.get(2));
    }

    private static void preencher(List<String> codigos) {
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0003");
        codigos.add("OS-2026-0004");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula152.app.AcessoPorIndiceComparacaoApp
```

---

## O que observar no acesso por índice

As duas funcionam:

```java
get(2)
```

Mas internamente são diferentes.

No `ArrayList`, acessar por índice é natural porque ele é baseado em array.

No `LinkedList`, para chegar em uma posição, a estrutura precisa caminhar pelos nós.

Em linguagem prática:

```text
ArrayList é melhor para acesso por índice.
LinkedList não é boa escolha quando você acessa muito por posição.
```

---

## Inserção no início com List

Crie:

```text
src\br\com\curso\aula152\app\InsercaoNoInicioApp.java
```

Código:

```java
package br.com.curso.aula152.app;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class InsercaoNoInicioApp {
    public static void main(String[] args) {
        List<String> arrayList = new ArrayList<>();
        List<String> linkedList = new LinkedList<>();

        preencher(arrayList);
        preencher(linkedList);

        arrayList.add(0, "OS-2026-0000");
        linkedList.add(0, "OS-2026-0000");

        System.out.println("ArrayList:");
        imprimir(arrayList);

        System.out.println();
        System.out.println("LinkedList:");
        imprimir(linkedList);
    }

    private static void preencher(List<String> codigos) {
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0003");
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
java -cp out br.com.curso.aula152.app.InsercaoNoInicioApp
```

---

## O que acontece ao inserir no início

Quando você faz:

```java
lista.add(0, valor);
```

o elemento entra na primeira posição.

Os demais elementos são deslocados.

Em `ArrayList`, inserir no início pode exigir deslocamento de muitos elementos.

Em `LinkedList`, inserir no começo pode ser mais natural quando se usa métodos próprios como `addFirst`.

Mas, se você usa apenas a interface `List`, você acessa métodos comuns de `List`.

---

## Métodos próprios da LinkedList

`LinkedList` tem métodos que não pertencem diretamente à interface `List`.

Exemplos:

```text
addFirst;
addLast;
removeFirst;
removeLast;
getFirst;
getLast.
```

Para usar esses métodos, a variável precisa ser do tipo `LinkedList` ou de uma interface que tenha esses comportamentos, como `Deque`.

Nesta aula, vamos usar diretamente `LinkedList` para enxergar esses métodos.

---

## addFirst e addLast

Crie:

```text
src\br\com\curso\aula152\app\LinkedListInicioFimApp.java
```

Código:

```java
package br.com.curso.aula152.app;

import java.util.LinkedList;

public class LinkedListInicioFimApp {
    public static void main(String[] args) {
        LinkedList<String> filaAtendimento = new LinkedList<>();

        filaAtendimento.addLast("OS-2026-0002");
        filaAtendimento.addLast("OS-2026-0003");
        filaAtendimento.addFirst("OS-2026-0001");

        System.out.println("Fila:");

        for (String codigo : filaAtendimento) {
            System.out.println("- " + codigo);
        }

        System.out.println();
        System.out.println("Primeira: " + filaAtendimento.getFirst());
        System.out.println("Última: " + filaAtendimento.getLast());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula152.app.LinkedListInicioFimApp
```

---

## O que observar

Usamos:

```java
addFirst(...)
addLast(...)
getFirst(...)
getLast(...)
```

Isso deixa claro quando estamos trabalhando com início e fim da lista.

Esse tipo de operação combina com fila, pilha ou processamento por ordem.

---

## removeFirst e removeLast

Crie:

```text
src\br\com\curso\aula152\app\LinkedListRemoverInicioFimApp.java
```

Código:

```java
package br.com.curso.aula152.app;

import java.util.LinkedList;

public class LinkedListRemoverInicioFimApp {
    public static void main(String[] args) {
        LinkedList<String> filaAtendimento = new LinkedList<>();

        filaAtendimento.addLast("OS-2026-0001");
        filaAtendimento.addLast("OS-2026-0002");
        filaAtendimento.addLast("OS-2026-0003");

        System.out.println("Antes:");
        imprimir(filaAtendimento);

        String primeira = filaAtendimento.removeFirst();
        String ultima = filaAtendimento.removeLast();

        System.out.println();
        System.out.println("Removida primeira: " + primeira);
        System.out.println("Removida última: " + ultima);

        System.out.println();
        System.out.println("Depois:");
        imprimir(filaAtendimento);
    }

    private static void imprimir(LinkedList<String> codigos) {
        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula152.app.LinkedListRemoverInicioFimApp
```

---

## Cuidado com lista vazia

Se você chamar:

```java
removeFirst()
```

em uma lista vazia, haverá erro.

Crie:

```text
src\br\com\curso\aula152\app\LinkedListVaziaErroApp.java
```

Código:

```java
package br.com.curso.aula152.app;

import java.util.LinkedList;
import java.util.NoSuchElementException;

public class LinkedListVaziaErroApp {
    public static void main(String[] args) {
        LinkedList<String> fila = new LinkedList<>();

        try {
            fila.removeFirst();
        } catch (NoSuchElementException erro) {
            System.out.println("Não é possível remover o primeiro elemento de uma lista vazia.");
        }

        if (!fila.isEmpty()) {
            System.out.println(fila.removeFirst());
        } else {
            System.out.println("Fila continua vazia.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula152.app.LinkedListVaziaErroApp
```

---

## LinkedList como fila simples

Como `LinkedList` também implementa `Deque`, ela pode ser usada como fila.

Crie:

```text
src\br\com\curso\aula152\app\LinkedListComoFilaApp.java
```

Código:

```java
package br.com.curso.aula152.app;

import java.util.LinkedList;

public class LinkedListComoFilaApp {
    public static void main(String[] args) {
        LinkedList<String> fila = new LinkedList<>();

        fila.addLast("OS-2026-0001");
        fila.addLast("OS-2026-0002");
        fila.addLast("OS-2026-0003");

        while (!fila.isEmpty()) {
            String proxima = fila.removeFirst();
            System.out.println("Processando: " + proxima);
        }

        System.out.println("Fila finalizada.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula152.app.LinkedListComoFilaApp
```

---

## O que esse exemplo mostra

A fila funciona assim:

```text
entra no fim;
sai do começo.
```

Em código:

```java
fila.addLast(...)
fila.removeFirst()
```

Isso representa bem um atendimento em ordem.

Exemplo:

```text
primeira OS que entrou é a primeira processada.
```

Essa ideia será aprofundada quando estudarmos `Queue` e `Deque`.

---

## Usando Deque como tipo

Uma forma mais adequada para fila com duas pontas é usar a interface `Deque`.

Crie:

```text
src\br\com\curso\aula152\app\DequeComLinkedListApp.java
```

Código:

```java
package br.com.curso.aula152.app;

import java.util.Deque;
import java.util.LinkedList;

public class DequeComLinkedListApp {
    public static void main(String[] args) {
        Deque<String> fila = new LinkedList<>();

        fila.addLast("OS-2026-0001");
        fila.addLast("OS-2026-0002");
        fila.addLast("OS-2026-0003");

        while (!fila.isEmpty()) {
            String proxima = fila.removeFirst();
            System.out.println("Processando: " + proxima);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula152.app.DequeComLinkedListApp
```

---

## Por que Deque

`Deque` é uma interface para fila de duas pontas.

Ela permite operações no começo e no fim.

Usar:

```java
Deque<String> fila = new LinkedList<>();
```

comunica melhor a intenção quando você quer uma fila, não apenas uma lista.

Mais adiante, vamos estudar `Queue` e `Deque` com mais detalhes.

Por enquanto, entenda:

```text
LinkedList pode ser usada como List;
LinkedList também pode ser usada como Deque.
```

---

## Domínio para exemplos com objetos

Crie:

```text
src\br\com\curso\aula152\dominio\ordemservico\PrioridadeOs.java
```

Código:

```java
package br.com.curso.aula152.dominio.ordemservico;

public enum PrioridadeOs {
    NORMAL,
    ALTA,
    CRITICA
}
```

Crie:

```text
src\br\com\curso\aula152\dominio\ordemservico\ResumoOrdemServico.java
```

Código:

```java
package br.com.curso.aula152.dominio.ordemservico;

public class ResumoOrdemServico {
    private final String codigo;
    private final String cliente;
    private final PrioridadeOs prioridade;

    public ResumoOrdemServico(String codigo, String cliente, PrioridadeOs prioridade) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (prioridade == null) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.prioridade = prioridade;
    }

    public boolean critica() {
        return prioridade == PrioridadeOs.CRITICA;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Prioridade: " + prioridade;
    }
}
```

---

## Fila de atendimento com LinkedList

Crie:

```text
src\br\com\curso\aula152\app\FilaAtendimentoLinkedListApp.java
```

Código:

```java
package br.com.curso.aula152.app;

import br.com.curso.aula152.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula152.dominio.ordemservico.ResumoOrdemServico;

import java.util.LinkedList;

public class FilaAtendimentoLinkedListApp {
    public static void main(String[] args) {
        LinkedList<ResumoOrdemServico> fila = new LinkedList<>();

        fila.addLast(new ResumoOrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                PrioridadeOs.NORMAL
        ));

        fila.addLast(new ResumoOrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                PrioridadeOs.ALTA
        ));

        fila.addFirst(new ResumoOrdemServico(
                "OS-2026-0003",
                "Mariana Lima",
                PrioridadeOs.CRITICA
        ));

        System.out.println("Fila inicial:");

        for (ResumoOrdemServico os : fila) {
            System.out.println("- " + os.resumo());
        }

        System.out.println();
        System.out.println("Processamento:");

        while (!fila.isEmpty()) {
            ResumoOrdemServico proxima = fila.removeFirst();
            System.out.println("Atendendo: " + proxima.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula152.app.FilaAtendimentoLinkedListApp
```

---

## O que esse exemplo mostra

Adicionamos duas OS no fim:

```java
fila.addLast(...)
```

E uma OS crítica no começo:

```java
fila.addFirst(...)
```

Depois processamos removendo do início:

```java
fila.removeFirst()
```

Esse é um exemplo didático de fila com prioridade manual.

Em sistemas reais, prioridade pode exigir estruturas mais adequadas, como `PriorityQueue`.

Mas a ideia aqui é entender início e fim da `LinkedList`.

---

## ArrayList também pode adicionar no início?

Sim.

Você pode fazer:

```java
arrayList.add(0, elemento);
```

Mas em `ArrayList`, isso pode deslocar vários elementos.

Em uma lista pequena, isso nem importa.

Em uma lista grande e com operação frequente, pode pesar.

Mas cuidado com exagero:

```text
não escolha LinkedList automaticamente por causa disso.
```

Na prática, para muitos sistemas, `ArrayList` continua sendo usado.

---

## Comparação prática sem benchmark

Não vamos fazer benchmark nesta aula porque benchmark correto em Java exige cuidado.

Mas podemos fazer uma comparação conceitual.

Crie:

```text
src\br\com\curso\aula152\app\ComparacaoConceitualApp.java
```

Código:

```java
package br.com.curso.aula152.app;

public class ComparacaoConceitualApp {
    public static void main(String[] args) {
        System.out.println("ArrayList:");
        System.out.println("- Baseado em array redimensionável.");
        System.out.println("- Bom para acesso por índice.");
        System.out.println("- Bom para percorrer.");
        System.out.println("- Muito usado como lista padrão.");
        System.out.println("- Inserção/remoção no meio pode deslocar elementos.");

        System.out.println();

        System.out.println("LinkedList:");
        System.out.println("- Baseado em nós encadeados.");
        System.out.println("- Não é ideal para acesso frequente por índice.");
        System.out.println("- Tem operações úteis no início e fim.");
        System.out.println("- Pode ser usada como Deque.");
        System.out.println("- Não deve ser escolhida sem motivo claro.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula152.app.ComparacaoConceitualApp
```

---

## Cuidado com micro-otimização

Não fique tentando escolher estrutura pensando em performance sem contexto.

Antes de otimizar, pergunte:

```text
qual é o volume de dados?
qual operação acontece mais?
é mais leitura ou escrita?
precisa de acesso por índice?
precisa de busca por chave?
precisa de unicidade?
precisa de ordem?
precisa de fila?
```

Muitas vezes a melhor escolha não é `LinkedList`.

Pode ser:

```text
ArrayList;
HashSet;
HashMap;
ArrayDeque;
PriorityQueue.
```

Vamos estudar cada uma no momento certo.

---

## Onde LinkedList aparece menos em backend

No dia a dia de backend, você verá muito mais:

```text
ArrayList;
List;
HashSet;
HashMap;
Optional;
Stream.
```

`LinkedList` aparece menos.

Mas é importante conhecer porque:

```text
ela implementa List;
ela implementa Deque;
ela ajuda a entender estruturas encadeadas;
ela aparece em entrevistas e fundamentos;
ela ajuda a pensar em fila.
```

Conhecer não significa usar sempre.

---

## Guia rápido de escolha

### Use ArrayList quando

```text
quer uma lista comum;
vai percorrer bastante;
vai acessar por índice;
vai adicionar no final;
não precisa de fila;
não precisa de unicidade;
não precisa de busca por chave.
```

### Considere LinkedList quando

```text
precisa operar muito no início e no fim;
quer usar como Deque;
não depende de acesso por índice;
está modelando uma fila simples;
tem motivo claro.
```

### Use Set quando

```text
precisa evitar duplicados.
```

### Use Map quando

```text
precisa buscar por chave.
```

### Use Queue ou Deque quando

```text
precisa de comportamento de fila.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Criar exemplos básicos

Execute:

```powershell
java -cp out br.com.curso.aula152.app.PrimeiraLinkedListApp
java -cp out br.com.curso.aula152.app.TrocaImplementacaoListApp
```

Observe que os métodos que recebem `List` aceitam as duas implementações.

### Parte 2 — Comparar acesso e inserção

Execute:

```powershell
java -cp out br.com.curso.aula152.app.AcessoPorIndiceComparacaoApp
java -cp out br.com.curso.aula152.app.InsercaoNoInicioApp
```

### Parte 3 — Usar métodos próprios da LinkedList

Execute:

```powershell
java -cp out br.com.curso.aula152.app.LinkedListInicioFimApp
java -cp out br.com.curso.aula152.app.LinkedListRemoverInicioFimApp
java -cp out br.com.curso.aula152.app.LinkedListVaziaErroApp
```

### Parte 4 — Usar como fila

Execute:

```powershell
java -cp out br.com.curso.aula152.app.LinkedListComoFilaApp
java -cp out br.com.curso.aula152.app.DequeComLinkedListApp
java -cp out br.com.curso.aula152.app.FilaAtendimentoLinkedListApp
```

### Parte 5 — Revisar comparação

Execute:

```powershell
java -cp out br.com.curso.aula152.app.ComparacaoConceitualApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula152\app\FilaReagendamentoApp.java
```

Ele deve:

```text
usar LinkedList<String>;
adicionar 5 códigos de OS no fim da fila;
adicionar 1 código urgente no começo da fila;
processar todas as OS com removeFirst;
exibir a ordem de processamento.
```

Critério principal:

```text
usar addLast, addFirst e removeFirst.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula152\app\CompararListComoParametroApp.java
```

Ele deve:

```text
criar um método preencher(List<String> lista);
criar um método imprimir(String titulo, List<String> lista);
chamar esses métodos passando ArrayList;
chamar esses métodos passando LinkedList;
mostrar que o mesmo método aceita as duas implementações.
```

Critério principal:

```text
métodos devem receber List<String>, não ArrayList<String> nem LinkedList<String>.
```

---

## Erros comuns nesta aula

### 1. Achar que LinkedList é sempre melhor

Não é.

Use com motivo.

### 2. Usar LinkedList para muito acesso por índice

Se você precisa muito de `get(i)`, `ArrayList` costuma fazer mais sentido.

### 3. Declarar LinkedList sem precisar dos métodos próprios

Se você só precisa de lista comum, use:

```java
List<String> lista = new ArrayList<>();
```

### 4. Usar removeFirst em lista vazia

Verifique:

```java
if (!fila.isEmpty()) {
    fila.removeFirst();
}
```

### 5. Confundir List com Deque

`List` é lista.

`Deque` é fila de duas pontas.

`LinkedList` pode implementar os dois papéis, mas a intenção do tipo importa.

### 6. Fazer benchmark improvisado

Medir performance em Java exige cuidado.

Não tire conclusão definitiva com teste simples de `System.currentTimeMillis`.

### 7. Escolher estrutura antes de entender o problema

Primeiro entenda o uso.

Depois escolha a estrutura.

---

## Debug recomendado

Use debug em:

```text
PrimeiraLinkedListApp.java
TrocaImplementacaoListApp.java
LinkedListInicioFimApp.java
LinkedListRemoverInicioFimApp.java
LinkedListComoFilaApp.java
FilaAtendimentoLinkedListApp.java
```

Breakpoints recomendados:

```java
new LinkedList<>()

lista.add(...)

fila.addFirst(...)

fila.addLast(...)

fila.getFirst()

fila.getLast()

fila.removeFirst()

while (!fila.isEmpty())
```

Observe:

```text
como a lista cresce;
como addFirst muda o começo;
como addLast adiciona no fim;
como removeFirst processa em ordem;
como métodos com parâmetro List aceitam implementações diferentes.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença conceitual entre ArrayList e LinkedList?
2. Quando ArrayList costuma ser a escolha mais comum?
3. Quando LinkedList pode fazer sentido?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar uma LinkedList;
usar LinkedList como List;
explicar que ArrayList e LinkedList implementam List;
trocar implementação mantendo métodos que recebem List;
usar addFirst;
usar addLast;
usar getFirst;
usar getLast;
usar removeFirst;
usar removeLast;
verificar lista vazia antes de remover;
usar LinkedList como fila simples;
usar Deque com LinkedList;
explicar por que LinkedList não é automaticamente melhor;
resolver FilaReagendamentoApp;
resolver CompararListComoParametroApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-152-linkedlist-e-diferencas-com-arraylist
git commit -m "Aula 152: linkedlist e diferencas com arraylist"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
ArrayList e LinkedList são implementações diferentes da interface List, e a escolha deve depender do uso real da coleção.
```

Você viu que `ArrayList` costuma ser a escolha padrão para listas comuns e que `LinkedList` pode fazer sentido em operações de início/fim e uso como fila.

Na próxima aula, vamos começar outra família de coleção:

```text
Set
```

Vamos estudar `Set interface` e `HashSet`, entendendo como evitar duplicidades em coleções.
