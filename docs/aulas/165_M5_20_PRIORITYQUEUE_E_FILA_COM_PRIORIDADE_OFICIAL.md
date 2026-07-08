# 165 — M5.20 — PriorityQueue e fila com prioridade

## Objetivo da aula

Nesta aula você vai estudar uma implementação importante de fila no Java:

```text
PriorityQueue
```

Na aula anterior, você estudou:

```text
Queue;
Deque;
ArrayDeque;
FIFO;
LIFO;
fila;
pilha;
processamento em ordem.
```

Agora vamos ver um tipo especial de fila:

```text
fila com prioridade.
```

Em uma fila comum, quem entra primeiro sai primeiro.

Em uma fila com prioridade, isso muda:

```text
o item mais prioritário sai primeiro.
```

Ao final da aula, você deve conseguir:

```text
entender o que é PriorityQueue;
explicar a diferença entre Queue comum e PriorityQueue;
entender que PriorityQueue não é FIFO;
entender que poll remove o item de maior prioridade conforme o critério;
usar PriorityQueue com Integer;
usar PriorityQueue com String;
usar PriorityQueue com Comparator;
usar PriorityQueue com objetos de domínio;
entender ordenação natural;
entender critério customizado;
entender por que iterar PriorityQueue não garante ordem de prioridade;
entender risco de objeto mutável dentro da fila;
entender empate de prioridade;
simular fila de atendimento com prioridade;
aplicar PriorityQueue em cenário de Ordem de Serviço.
```

Essa aula é muito importante para entender processamento por prioridade.

---

## Ideia principal

Uma `Queue` comum com `ArrayDeque` funciona assim:

```text
primeiro a entrar, primeiro a sair.
```

Isso é FIFO.

Uma `PriorityQueue` funciona assim:

```text
o próximo a sair é definido por prioridade.
```

A prioridade pode ser:

```text
menor número primeiro;
menor data primeiro;
texto em ordem natural;
prioridade crítica primeiro;
prazo mais antigo primeiro;
peso de negócio menor primeiro.
```

O critério depende da fila.

---

## Exemplo mental

Imagine uma fila de atendimento.

Chegaram nesta ordem:

```text
OS normal;
OS crítica;
OS baixa;
OS alta.
```

Em uma fila comum, sairia:

```text
normal;
crítica;
baixa;
alta.
```

Em uma fila com prioridade, poderia sair:

```text
crítica;
alta;
normal;
baixa.
```

A ordem de chegada não manda sozinha.

A prioridade manda.

---

## PriorityQueue ainda é Queue

`PriorityQueue` implementa a interface:

```java
Queue
```

Então você usa métodos conhecidos:

```text
offer;
poll;
peek;
size;
isEmpty.
```

Mas o comportamento de saída é diferente.

Em vez de sair na ordem de chegada, sai conforme o critério de prioridade.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-165-priorityqueue-e-fila-com-prioridade
cd labs\m5\aula-165-priorityqueue-e-fila-com-prioridade
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula165
mkdir src\br\com\curso\aula165\app
mkdir src\br\com\curso\aula165\dominio
mkdir src\br\com\curso\aula165\dominio\valor
mkdir src\br\com\curso\aula165\dominio\ordemservico
mkdir src\br\com\curso\aula165\infra
```

---

## Primeira PriorityQueue com Integer

Crie:

```text
src\br\com\curso\aula165\app\PrimeiraPriorityQueueIntegerApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import java.util.PriorityQueue;
import java.util.Queue;

public class PrimeiraPriorityQueueIntegerApp {
    public static void main(String[] args) {
        Queue<Integer> prioridades = new PriorityQueue<>();

        prioridades.offer(30);
        prioridades.offer(10);
        prioridades.offer(40);
        prioridades.offer(20);

        System.out.println("Processando prioridades:");

        while (!prioridades.isEmpty()) {
            System.out.println("- " + prioridades.poll());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PrimeiraPriorityQueueIntegerApp
```

---

## O que observar

Você inseriu nesta ordem:

```text
30;
10;
40;
20.
```

Mas a saída é:

```text
10;
20;
30;
40.
```

Por quê?

Porque `Integer` tem ordem natural crescente.

Na `PriorityQueue` padrão, o menor elemento segundo a ordenação natural sai primeiro.

---

## PriorityQueue não é FIFO

Esse é o ponto mais importante.

Com `ArrayDeque`, a fila seria:

```text
30;
10;
40;
20.
```

Com `PriorityQueue`, a saída é ordenada por prioridade:

```text
10;
20;
30;
40.
```

Regra:

```text
PriorityQueue não respeita necessariamente a ordem de chegada.
```

Ela respeita o critério de prioridade.

---

## PriorityQueue com String

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueueStringApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueStringApp {
    public static void main(String[] args) {
        Queue<String> nomes = new PriorityQueue<>();

        nomes.offer("Mariana");
        nomes.offer("Ana");
        nomes.offer("Carlos");
        nomes.offer("Bruno");

        System.out.println("Processando nomes:");

        while (!nomes.isEmpty()) {
            System.out.println("- " + nomes.poll());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueueStringApp
```

---

## O que acontece com String

`String` tem ordem natural.

Então a fila processa em ordem textual:

```text
Ana;
Bruno;
Carlos;
Mariana.
```

Não é ordem de chegada.

É ordem natural da `String`.

---

## peek em PriorityQueue

`peek` consulta o próximo item prioritário sem remover.

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueuePeekApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueuePeekApp {
    public static void main(String[] args) {
        Queue<Integer> prioridades = new PriorityQueue<>();

        prioridades.offer(50);
        prioridades.offer(10);
        prioridades.offer(30);

        System.out.println("Próximo prioritário: " + prioridades.peek());
        System.out.println("Quantidade após peek: " + prioridades.size());

        System.out.println("Removendo com poll: " + prioridades.poll());
        System.out.println("Quantidade após poll: " + prioridades.size());

        System.out.println("Novo próximo prioritário: " + prioridades.peek());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueuePeekApp
```

---

## Relembrando peek e poll

Em qualquer `Queue`:

```text
peek:
olha o próximo sem remover.

poll:
remove e retorna o próximo.
```

Em `PriorityQueue`, o próximo é o mais prioritário pelo critério da fila.

---

## PriorityQueue com Comparator reverso

Às vezes você quer o maior número primeiro.

Para isso, use `Comparator`.

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueueMaiorPrimeiroApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueMaiorPrimeiroApp {
    public static void main(String[] args) {
        Queue<Integer> prioridades = new PriorityQueue<>(Comparator.reverseOrder());

        prioridades.offer(30);
        prioridades.offer(10);
        prioridades.offer(40);
        prioridades.offer(20);

        System.out.println("Maior número primeiro:");

        while (!prioridades.isEmpty()) {
            System.out.println("- " + prioridades.poll());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueueMaiorPrimeiroApp
```

---

## O que Comparator muda

O construtor:

```java
new PriorityQueue<>(Comparator.reverseOrder())
```

diz:

```text
use ordem reversa.
```

Agora o maior número sai primeiro.

O critério de prioridade é definido pelo comparador.

---

## PriorityQueue por tamanho de String

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueueStringPorTamanhoApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueStringPorTamanhoApp {
    public static void main(String[] args) {
        Queue<String> nomes = new PriorityQueue<>(
                Comparator.comparingInt(String::length)
                        .thenComparing(Comparator.naturalOrder())
        );

        nomes.offer("Mariana");
        nomes.offer("Ana");
        nomes.offer("Carlos");
        nomes.offer("Bruno");
        nomes.offer("Caio");

        System.out.println("Menor nome primeiro, depois ordem alfabética:");

        while (!nomes.isEmpty()) {
            System.out.println("- " + nomes.poll());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueueStringPorTamanhoApp
```

---

## O que esse comparador faz

Este comparador:

```java
Comparator.comparingInt(String::length)
        .thenComparing(Comparator.naturalOrder())
```

significa:

```text
primeiro ordene pelo tamanho;
se empatar, ordene alfabeticamente.
```

Isso mostra que `PriorityQueue` pode usar qualquer critério de `Comparator`.

---

## Iterar PriorityQueue não garante ordem de prioridade

Este é um detalhe muito importante.

Se você fizer `foreach` em uma `PriorityQueue`, a iteração não precisa sair em ordem de prioridade.

A prioridade é garantida em:

```text
poll;
peek.
```

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueueIteracaoNaoOrdenadaApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueIteracaoNaoOrdenadaApp {
    public static void main(String[] args) {
        Queue<Integer> prioridades = new PriorityQueue<>();

        prioridades.offer(30);
        prioridades.offer(10);
        prioridades.offer(40);
        prioridades.offer(20);
        prioridades.offer(5);

        System.out.println("Iterando com foreach:");
        for (Integer prioridade : prioridades) {
            System.out.println("- " + prioridade);
        }

        System.out.println();
        System.out.println("Removendo com poll:");
        while (!prioridades.isEmpty()) {
            System.out.println("- " + prioridades.poll());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueueIteracaoNaoOrdenadaApp
```

---

## Regra sobre iteração

Guarde com força:

```text
PriorityQueue garante prioridade na remoção com poll, não na iteração com foreach.
```

Se você precisa exibir tudo ordenado, faça uma cópia e vá removendo com `poll`, ou use outra estrutura dependendo do caso.

---

## Exibir PriorityQueue em ordem sem destruir original

Se você usa `poll`, remove os itens.

Para exibir em ordem e manter a fila original, faça cópia.

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueueCopiaParaExibicaoApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueCopiaParaExibicaoApp {
    public static void main(String[] args) {
        Queue<Integer> original = new PriorityQueue<>();

        original.offer(30);
        original.offer(10);
        original.offer(40);
        original.offer(20);

        Queue<Integer> copia = new PriorityQueue<>(original);

        System.out.println("Exibindo cópia em ordem de prioridade:");

        while (!copia.isEmpty()) {
            System.out.println("- " + copia.poll());
        }

        System.out.println();
        System.out.println("Quantidade na original: " + original.size());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueueCopiaParaExibicaoApp
```

---

## Null em PriorityQueue

`PriorityQueue` não aceita `null`.

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueueNullApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueNullApp {
    public static void main(String[] args) {
        Queue<String> fila = new PriorityQueue<>();

        try {
            fila.offer(null);
        } catch (NullPointerException erro) {
            System.out.println("PriorityQueue não aceita null.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueueNullApp
```

---

## Por que null é ruim em fila

`poll` retorna `null` quando a fila está vazia.

Se `null` pudesse ser item válido, ficaria confuso:

```text
poll retornou null porque a fila acabou?
ou porque o próximo item era null?
```

Além disso, `PriorityQueue` precisa comparar elementos.

`null` não tem prioridade.

---

## PriorityQueue com objeto sem Comparable

Se a classe não tem ordem natural e você não fornece `Comparator`, dá erro.

Crie:

```text
src\br\com\curso\aula165\dominio\ordemservico\OsSemComparable.java
```

Código:

```java
package br.com.curso.aula165.dominio.ordemservico;

public class OsSemComparable {
    private final String codigo;

    public OsSemComparable(String codigo) {
        this.codigo = codigo;
    }

    public String resumo() {
        return codigo;
    }
}
```

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueueObjetoSemComparableApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import br.com.curso.aula165.dominio.ordemservico.OsSemComparable;

import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueObjetoSemComparableApp {
    public static void main(String[] args) {
        Queue<OsSemComparable> fila = new PriorityQueue<>();

        try {
            fila.offer(new OsSemComparable("OS-2026-0001"));
            fila.offer(new OsSemComparable("OS-2026-0002"));
        } catch (RuntimeException erro) {
            System.out.println("Erro ao usar PriorityQueue sem Comparable ou Comparator.");
            System.out.println("Tipo: " + erro.getClass().getSimpleName());
            System.out.println("Mensagem: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueueObjetoSemComparableApp
```

---

## Por que esse erro acontece

`PriorityQueue` precisa saber qual objeto tem prioridade.

Para isso, ela precisa comparar os objetos.

Se o objeto não implementa `Comparable` e você não informa um `Comparator`, o Java não sabe quem vem primeiro.

Solução:

```text
implementar Comparable;
ou passar Comparator.
```

Para objetos de domínio, normalmente preferimos `Comparator` quando existem vários critérios possíveis.

---

## Domínio da aula

Agora vamos criar um domínio de OS com prioridade.

Crie:

```text
src\br\com\curso\aula165\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula165.dominio.valor;

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
src\br\com\curso\aula165\dominio\ordemservico\PrioridadeOs.java
```

Código:

```java
package br.com.curso.aula165.dominio.ordemservico;

public enum PrioridadeOs {
    BAIXA,
    NORMAL,
    ALTA,
    CRITICA
}
```

Crie:

```text
src\br\com\curso\aula165\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula165.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula165\dominio\ordemservico\OrdemServicoPrioridade.java
```

Código:

```java
package br.com.curso.aula165.dominio.ordemservico;

import br.com.curso.aula165.dominio.valor.CodigoOs;

import java.time.LocalDateTime;

public class OrdemServicoPrioridade {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDateTime dataEntrada;
    private final PrioridadeOs prioridade;
    private StatusOs status;

    public OrdemServicoPrioridade(
            CodigoOs codigo,
            String cliente,
            LocalDateTime dataEntrada,
            PrioridadeOs prioridade
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

        if (prioridade == null) {
            throw new IllegalArgumentException("Prioridade é obrigatória.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataEntrada = dataEntrada;
        this.prioridade = prioridade;
        this.status = StatusOs.AGENDADA;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public LocalDateTime dataEntrada() {
        return dataEntrada;
    }

    public PrioridadeOs prioridade() {
        return prioridade;
    }

    public StatusOs status() {
        return status;
    }

    public boolean podeAtender() {
        return status == StatusOs.AGENDADA;
    }

    public void iniciarAtendimento() {
        if (!podeAtender()) {
            throw new IllegalStateException("OS não pode iniciar atendimento no status: " + status);
        }

        status = StatusOs.EM_ATENDIMENTO;
    }

    public void concluir() {
        if (status != StatusOs.EM_ATENDIMENTO) {
            throw new IllegalStateException("Somente OS em atendimento pode ser concluída.");
        }

        status = StatusOs.CONCLUIDA;
    }

    public String resumo() {
        return codigo.resumo()
                + " | Cliente: " + cliente
                + " | Entrada: " + dataEntrada
                + " | Prioridade: " + prioridade
                + " | Status: " + status;
    }
}
```

---

## PriorityQueue com OS por prioridade de negócio

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueueOsPorPrioridadeApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import br.com.curso.aula165.dominio.ordemservico.OrdemServicoPrioridade;
import br.com.curso.aula165.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula165.dominio.valor.CodigoOs;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueOsPorPrioridadeApp {
    public static void main(String[] args) {
        Queue<OrdemServicoPrioridade> fila = new PriorityQueue<>(
                Comparator.comparingInt((OrdemServicoPrioridade os) -> pesoPrioridade(os.prioridade()))
                        .thenComparing(OrdemServicoPrioridade::dataEntrada)
                        .thenComparing(OrdemServicoPrioridade::codigo)
        );

        fila.offer(new OrdemServicoPrioridade(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeOs.NORMAL
        ));

        fila.offer(new OrdemServicoPrioridade(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDateTime.of(2026, 12, 10, 9, 10),
                PrioridadeOs.CRITICA
        ));

        fila.offer(new OrdemServicoPrioridade(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDateTime.of(2026, 12, 10, 9, 5),
                PrioridadeOs.ALTA
        ));

        System.out.println("Processando por prioridade:");

        while (!fila.isEmpty()) {
            OrdemServicoPrioridade os = fila.poll();
            System.out.println("- " + os.resumo());
        }
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

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueueOsPorPrioridadeApp
```

---

## Como funciona o critério

O comparador diz:

```text
primeiro por peso de prioridade;
se empatar, por data de entrada;
se empatar, por código.
```

Isso evita comportamento confuso quando duas OS possuem a mesma prioridade.

Exemplo:

```java
.thenComparing(OrdemServicoPrioridade::dataEntrada)
.thenComparing(OrdemServicoPrioridade::codigo)
```

Critérios de desempate são importantes.

---

## Empate de prioridade

Se duas OS têm a mesma prioridade, a fila precisa de algum critério secundário.

Sem critério secundário, a ordem entre elas pode não ser a que você espera.

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueueEmpatePrioridadeApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import br.com.curso.aula165.dominio.ordemservico.OrdemServicoPrioridade;
import br.com.curso.aula165.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula165.dominio.valor.CodigoOs;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueEmpatePrioridadeApp {
    public static void main(String[] args) {
        Queue<OrdemServicoPrioridade> fila = new PriorityQueue<>(
                Comparator.comparingInt((OrdemServicoPrioridade os) -> pesoPrioridade(os.prioridade()))
                        .thenComparing(OrdemServicoPrioridade::dataEntrada)
        );

        fila.offer(new OrdemServicoPrioridade(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDateTime.of(2026, 12, 10, 9, 20),
                PrioridadeOs.ALTA
        ));

        fila.offer(new OrdemServicoPrioridade(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeOs.ALTA
        ));

        System.out.println("Mesma prioridade, mais antiga primeiro:");

        while (!fila.isEmpty()) {
            System.out.println("- " + fila.poll().resumo());
        }
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

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueueEmpatePrioridadeApp
```

---

## PriorityQueue e objeto mutável

Cuidado muito importante:

```text
não mude o campo de prioridade de um objeto enquanto ele está dentro da PriorityQueue.
```

A fila não reorganiza automaticamente o objeto se você alterar a prioridade depois de inserir.

Para mudar prioridade, normalmente você remove e adiciona novamente.

Vamos simular.

Crie:

```text
src\br\com\curso\aula165\dominio\ordemservico\TarefaMutavel.java
```

Código:

```java
package br.com.curso.aula165.dominio.ordemservico;

public class TarefaMutavel {
    private final String nome;
    private int prioridade;

    public TarefaMutavel(String nome, int prioridade) {
        this.nome = nome;
        this.prioridade = prioridade;
    }

    public int prioridade() {
        return prioridade;
    }

    public void alterarPrioridade(int novaPrioridade) {
        this.prioridade = novaPrioridade;
    }

    public String resumo() {
        return nome + " | Prioridade: " + prioridade;
    }
}
```

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueueObjetoMutavelPerigoApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import br.com.curso.aula165.dominio.ordemservico.TarefaMutavel;

import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueObjetoMutavelPerigoApp {
    public static void main(String[] args) {
        Queue<TarefaMutavel> fila = new PriorityQueue<>(
                Comparator.comparingInt(TarefaMutavel::prioridade)
        );

        TarefaMutavel tarefa1 = new TarefaMutavel("Tarefa normal", 5);
        TarefaMutavel tarefa2 = new TarefaMutavel("Tarefa baixa", 10);

        fila.offer(tarefa1);
        fila.offer(tarefa2);

        tarefa2.alterarPrioridade(1);

        System.out.println("Prioridade alterada após entrar na fila.");
        System.out.println("Processamento pode não refletir a nova prioridade corretamente:");

        while (!fila.isEmpty()) {
            System.out.println("- " + fila.poll().resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueueObjetoMutavelPerigoApp
```

---

## Como alterar prioridade corretamente

Uma forma mais segura:

```text
remove o objeto;
altera;
adiciona novamente.
```

Crie:

```text
src\br\com\curso\aula165\app\PriorityQueueAlterarPrioridadeCorretoApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import br.com.curso.aula165.dominio.ordemservico.TarefaMutavel;

import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueAlterarPrioridadeCorretoApp {
    public static void main(String[] args) {
        Queue<TarefaMutavel> fila = new PriorityQueue<>(
                Comparator.comparingInt(TarefaMutavel::prioridade)
        );

        TarefaMutavel tarefa1 = new TarefaMutavel("Tarefa normal", 5);
        TarefaMutavel tarefa2 = new TarefaMutavel("Tarefa baixa", 10);

        fila.offer(tarefa1);
        fila.offer(tarefa2);

        boolean removeu = fila.remove(tarefa2);

        if (removeu) {
            tarefa2.alterarPrioridade(1);
            fila.offer(tarefa2);
        }

        System.out.println("Processando após remover, alterar e recolocar:");

        while (!fila.isEmpty()) {
            System.out.println("- " + fila.poll().resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.PriorityQueueAlterarPrioridadeCorretoApp
```

---

## Regra sobre mutabilidade

Evite objetos com prioridade mutável dentro de `PriorityQueue`.

Se a prioridade precisa mudar:

```text
remova;
altere;
adicione novamente.
```

Ou modele o fluxo de outra forma.

Em sistemas reais, alteração de prioridade costuma exigir regra clara, auditoria e reprocessamento.

---

## Classe de fila de atendimento prioritária

Agora vamos encapsular a `PriorityQueue`.

Crie:

```text
src\br\com\curso\aula165\infra\FilaPrioritariaAtendimentoMemoria.java
```

Código:

```java
package br.com.curso.aula165.infra;

import br.com.curso.aula165.dominio.ordemservico.OrdemServicoPrioridade;
import br.com.curso.aula165.dominio.ordemservico.PrioridadeOs;

import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

public class FilaPrioritariaAtendimentoMemoria {
    private final Queue<OrdemServicoPrioridade> fila;

    public FilaPrioritariaAtendimentoMemoria() {
        this.fila = new PriorityQueue<>(
                Comparator.comparingInt((OrdemServicoPrioridade os) -> pesoPrioridade(os.prioridade()))
                        .thenComparing(OrdemServicoPrioridade::dataEntrada)
                        .thenComparing(OrdemServicoPrioridade::codigo)
        );
    }

    public void adicionar(OrdemServicoPrioridade os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (!os.podeAtender()) {
            throw new IllegalStateException("OS não pode entrar na fila no status: " + os.status());
        }

        fila.offer(os);
    }

    public OrdemServicoPrioridade proxima() {
        return fila.peek();
    }

    public OrdemServicoPrioridade retirarProxima() {
        return fila.poll();
    }

    public int quantidade() {
        return fila.size();
    }

    public boolean vazia() {
        return fila.isEmpty();
    }

    private int pesoPrioridade(PrioridadeOs prioridade) {
        return switch (prioridade) {
            case CRITICA -> 1;
            case ALTA -> 2;
            case NORMAL -> 3;
            case BAIXA -> 4;
        };
    }
}
```

---

## App usando fila prioritária

Crie:

```text
src\br\com\curso\aula165\app\FilaPrioritariaAtendimentoApp.java
```

Código:

```java
package br.com.curso.aula165.app;

import br.com.curso.aula165.dominio.ordemservico.OrdemServicoPrioridade;
import br.com.curso.aula165.dominio.ordemservico.PrioridadeOs;
import br.com.curso.aula165.dominio.valor.CodigoOs;
import br.com.curso.aula165.infra.FilaPrioritariaAtendimentoMemoria;

import java.time.LocalDateTime;

public class FilaPrioritariaAtendimentoApp {
    public static void main(String[] args) {
        FilaPrioritariaAtendimentoMemoria fila = new FilaPrioritariaAtendimentoMemoria();

        fila.adicionar(new OrdemServicoPrioridade(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDateTime.of(2026, 12, 10, 9, 0),
                PrioridadeOs.NORMAL
        ));

        fila.adicionar(new OrdemServicoPrioridade(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDateTime.of(2026, 12, 10, 9, 10),
                PrioridadeOs.CRITICA
        ));

        fila.adicionar(new OrdemServicoPrioridade(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDateTime.of(2026, 12, 10, 9, 5),
                PrioridadeOs.ALTA
        ));

        System.out.println("Quantidade inicial: " + fila.quantidade());

        OrdemServicoPrioridade proxima = fila.proxima();

        if (proxima != null) {
            System.out.println("Próxima: " + proxima.resumo());
        }

        System.out.println();
        System.out.println("Processando:");

        while (!fila.vazia()) {
            OrdemServicoPrioridade os = fila.retirarProxima();

            os.iniciarAtendimento();
            os.concluir();

            System.out.println("- " + os.resumo());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula165.app.FilaPrioritariaAtendimentoApp
```

---

## O que esse exemplo mostra

A classe:

```java
FilaPrioritariaAtendimentoMemoria
```

esconde a estrutura interna.

Quem usa a fila não precisa saber exatamente como a prioridade é calculada.

Isso melhora o desenho:

```text
regra de prioridade centralizada;
fila encapsulada;
aplicação usa intenção de negócio.
```

Esse pensamento será essencial em módulos de arquitetura.

---

## PriorityQueue não é fila distribuída

Assim como `Queue`, `PriorityQueue` é estrutura em memória.

Ela não substitui:

```text
RabbitMQ;
Kafka;
SQS;
ActiveMQ;
Redis Streams;
bancos com fila transacional.
```

Ela não resolve sozinha:

```text
persistência;
retentativa;
concorrência distribuída;
processamento entre serviços;
auditoria;
dead letter;
escala horizontal.
```

Mas ela ensina o conceito de prioridade.

---

## PriorityQueue e concorrência

`PriorityQueue` não é thread-safe.

Se várias threads forem acessar a fila ao mesmo tempo, você precisa de outra estratégia.

Existe no Java:

```text
PriorityBlockingQueue
```

Mas isso será estudado futuramente, quando entrarmos em concorrência.

Por enquanto, use `PriorityQueue` para cenários de memória simples e controlados.

---

## Quando usar PriorityQueue

Use quando:

```text
precisa sempre retirar o próximo item mais prioritário;
não precisa processar em ordem pura de chegada;
o critério de prioridade é claro;
a estrutura é local/em memória;
os itens são comparáveis ou possuem Comparator.
```

Exemplos:

```text
atendimento por criticidade;
tarefas por prazo;
eventos por data;
jobs por prioridade;
simulação de escalonamento;
processamento de alertas;
fila de suporte com severidade.
```

---

## Quando não usar PriorityQueue

Evite quando:

```text
a ordem de chegada precisa ser respeitada rigidamente;
a prioridade muda o tempo todo;
precisa de persistência;
precisa de auditoria operacional;
precisa distribuir processamento entre serviços;
precisa garantir justiça complexa;
precisa de mensageria real.
```

Nesses casos, talvez você precise de outra estrutura ou ferramenta.

---

## Guia rápido

```text
ArrayDeque como Queue:
ordem de chegada.

PriorityQueue:
ordem de prioridade.

Deque como pilha:
último a entrar, primeiro a sair.

Map:
busca por chave.

Set:
unicidade.

List:
ordem e índice.
```

Um engenheiro escolhe a estrutura pela intenção.

---

## Ligação com backend

`PriorityQueue` ajuda a pensar em:

```text
prioridade de atendimento;
criticidade de chamados;
reprocessamento por data;
fila de jobs local;
ordenação de tarefas;
escalonamento;
alertas;
deadlines;
processamento de eventos em memória.
```

Mas em arquitetura real, você precisa avaliar:

```text
volume;
persistência;
concorrência;
falha;
observabilidade;
auditoria;
escala.
```

A estrutura de dados é base.

A solução de arquitetura vem depois.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — PriorityQueue básica

Execute:

```powershell
java -cp out br.com.curso.aula165.app.PrimeiraPriorityQueueIntegerApp
java -cp out br.com.curso.aula165.app.PriorityQueueStringApp
java -cp out br.com.curso.aula165.app.PriorityQueuePeekApp
java -cp out br.com.curso.aula165.app.PriorityQueueMaiorPrimeiroApp
java -cp out br.com.curso.aula165.app.PriorityQueueStringPorTamanhoApp
```

### Parte 2 — Cuidados

Execute:

```powershell
java -cp out br.com.curso.aula165.app.PriorityQueueIteracaoNaoOrdenadaApp
java -cp out br.com.curso.aula165.app.PriorityQueueCopiaParaExibicaoApp
java -cp out br.com.curso.aula165.app.PriorityQueueNullApp
java -cp out br.com.curso.aula165.app.PriorityQueueObjetoSemComparableApp
```

### Parte 3 — Domínio

Execute:

```powershell
java -cp out br.com.curso.aula165.app.PriorityQueueOsPorPrioridadeApp
java -cp out br.com.curso.aula165.app.PriorityQueueEmpatePrioridadeApp
```

### Parte 4 — Mutabilidade

Execute:

```powershell
java -cp out br.com.curso.aula165.app.PriorityQueueObjetoMutavelPerigoApp
java -cp out br.com.curso.aula165.app.PriorityQueueAlterarPrioridadeCorretoApp
```

### Parte 5 — Encapsulamento

Execute:

```powershell
java -cp out br.com.curso.aula165.app.FilaPrioritariaAtendimentoApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula165\app\FilaAlertasPrioritariosApp.java
```

Ele deve:

```text
criar uma classe simples Alerta;
campos: String codigo, String descricao, int severidade;
severidade menor significa mais grave;
usar PriorityQueue<Alerta>;
processar alertas por severidade;
em empate, processar por código;
exibir a ordem de processamento.
```

Critério principal:

```text
usar Comparator.comparingInt e thenComparing.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula165\infra\FilaJobsPrioritariosMemoria.java
```

Ela deve controlar uma `PriorityQueue`.

Crie também uma classe de domínio:

```text
JobProcessamento
```

Campos:

```text
String id;
String descricao;
int prioridade;
LocalDateTime dataEntrada;
```

Regras:

```text
prioridade menor sai primeiro;
em empate, dataEntrada mais antiga sai primeiro;
em empate, id menor sai primeiro.
```

Métodos da fila:

```text
adicionar(JobProcessamento job);
proximo();
retirarProximo();
quantidade();
vazia();
```

Depois crie:

```text
src\br\com\curso\aula165\app\FilaJobsPrioritariosApp.java
```

Critério principal:

```text
encapsular PriorityQueue em classe própria.
```

---

## Erros comuns nesta aula

### 1. Achar que PriorityQueue é FIFO

Não é.

Ela usa prioridade.

### 2. Iterar com foreach esperando ordem prioritária

A prioridade é garantida no `poll`, não no foreach.

### 3. Esquecer Comparator em objeto sem Comparable

Vai dar erro.

### 4. Mudar prioridade de objeto dentro da fila

A fila não reorganiza automaticamente.

### 5. Não definir desempate

Itens com mesma prioridade podem sair em ordem inesperada.

### 6. Usar PriorityQueue para mensageria real

Ela é em memória.

Não substitui broker.

### 7. Usar null

`PriorityQueue` não aceita null.

### 8. Colocar regra de prioridade espalhada

Centralize em classe, método ou comparador bem nomeado.

---

## Debug recomendado

Use debug em:

```text
PrimeiraPriorityQueueIntegerApp.java
PriorityQueueMaiorPrimeiroApp.java
PriorityQueueStringPorTamanhoApp.java
PriorityQueueIteracaoNaoOrdenadaApp.java
PriorityQueueOsPorPrioridadeApp.java
PriorityQueueEmpatePrioridadeApp.java
PriorityQueueObjetoMutavelPerigoApp.java
PriorityQueueAlterarPrioridadeCorretoApp.java
FilaPrioritariaAtendimentoMemoria.java
FilaPrioritariaAtendimentoApp.java
```

Breakpoints recomendados:

```java
fila.offer(...)

fila.peek()

fila.poll()

Comparator.comparingInt(...)

thenComparing(...)

pesoPrioridade(...)

tarefa2.alterarPrioridade(...)

fila.remove(...)

fila.offer(tarefa2)

os.iniciarAtendimento()

os.concluir()
```

Observe:

```text
qual item fica no topo;
como poll muda a fila;
como Comparator define prioridade;
como desempate funciona;
como foreach não garante ordem;
como alteração de prioridade dentro da fila é perigosa;
como encapsular a PriorityQueue melhora o código.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre Queue comum e PriorityQueue?
2. Por que foreach em PriorityQueue não deve ser usado para garantir ordem?
3. Por que mudar a prioridade de um objeto dentro da fila é perigoso?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar PriorityQueue;
usar offer;
usar poll;
usar peek;
explicar que PriorityQueue não é FIFO;
usar PriorityQueue com Integer;
usar PriorityQueue com String;
usar Comparator em PriorityQueue;
criar maior primeiro;
criar critério por tamanho;
explicar que foreach não garante ordem;
exibir em ordem usando cópia e poll;
entender null em PriorityQueue;
entender objeto sem Comparable;
criar fila prioritária com objeto de domínio;
criar critério por prioridade, data e código;
entender empate;
entender mutabilidade perigosa;
encapsular PriorityQueue em classe própria;
resolver FilaAlertasPrioritariosApp;
resolver FilaJobsPrioritariosApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-165-priorityqueue-e-fila-com-prioridade
git commit -m "Aula 165: priorityqueue e fila com prioridade"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
PriorityQueue é uma fila em que o próximo item é definido por prioridade, não apenas pela ordem de chegada.
```

Você viu que ela usa ordem natural ou `Comparator`.

Também viu pontos importantes:

```text
poll respeita prioridade;
foreach não garante ordem;
objetos precisam ser comparáveis;
prioridade mutável é perigosa;
desempate deve ser explícito;
PriorityQueue é memória local, não mensageria real.
```

Na próxima aula, vamos estudar `Collections`, `List`, `Set`, `Map`, `Queue` e `Deque` em um mini-projeto prático integrando várias estruturas.

Vamos sair de exemplos isolados e montar um fluxo mais completo.
