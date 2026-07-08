# 164 — M5.19 — Queue, Deque e processamento em ordem

## Objetivo da aula

Nesta aula você vai estudar duas interfaces importantes do Java Collections Framework:

```text
Queue;
Deque.
```

Até agora, você trabalhou principalmente com:

```text
List;
Set;
Map;
Collections;
Comparator.
```

Agora vamos estudar estruturas voltadas para processamento em ordem.

Essas estruturas aparecem em muitos cenários de backend:

```text
fila de atendimento;
fila de processamento;
fila de mensagens;
ordem de chegada;
pilha de ações;
histórico;
desfazer/refazer;
processamento em lote;
priorização futura;
simulação de workflows.
```

Ao final da aula, você deve conseguir:

```text
entender o que é Queue;
entender o que é Deque;
explicar FIFO;
explicar LIFO;
usar ArrayDeque como fila;
usar ArrayDeque como pilha;
entender offer, poll e peek;
entender add, remove e element;
evitar LinkedList como escolha automática;
entender por que Stack antigo não é a escolha moderna;
processar itens em ordem de chegada;
processar itens do início e do fim;
simular uma fila de atendimento;
simular uma pilha de desfazer;
aplicar Queue/Deque em cenário de Ordem de Serviço.
```

Essa aula é importante porque, em backend real, nem tudo é lista.

Às vezes você não quer apenas armazenar dados.

Você quer processar em uma ordem específica.

---

## Ideia principal

Uma `List` permite acesso por índice:

```text
posição 0;
posição 1;
posição 2.
```

Um `Set` garante unicidade.

Um `Map` associa chave a valor.

Uma `Queue` representa uma fila.

A ideia principal da fila é:

```text
quem entra primeiro, sai primeiro.
```

Esse comportamento é conhecido como:

```text
FIFO
```

---

## O que é FIFO

FIFO significa:

```text
First In, First Out
```

Em português:

```text
primeiro a entrar, primeiro a sair.
```

Exemplo:

```text
1. Ana entrou na fila.
2. Carlos entrou na fila.
3. Mariana entrou na fila.

Atendimento:
1. Ana sai primeiro.
2. Carlos sai depois.
3. Mariana sai depois.
```

Isso é uma fila comum.

---

## O que é LIFO

LIFO significa:

```text
Last In, First Out
```

Em português:

```text
último a entrar, primeiro a sair.
```

Exemplo:

```text
1. abrir tela;
2. editar campo;
3. salvar rascunho.

Se desfizer:
primeiro desfaz salvar rascunho;
depois editar campo;
depois abrir tela.
```

Isso é comportamento de pilha.

Em Java moderno, podemos usar `Deque` para pilha.

---

## Queue e Deque

### Queue

`Queue` representa uma fila.

Principais operações:

```text
offer;
poll;
peek.
```

### Deque

`Deque` significa:

```text
Double Ended Queue
```

Ou seja:

```text
fila de duas pontas.
```

Ela permite inserir e remover no início ou no fim.

Com `Deque`, você consegue simular:

```text
fila;
pilha;
processamento pelas duas pontas.
```

---

## Implementação recomendada: ArrayDeque

Para muitos cenários em memória, uma boa implementação é:

```java
ArrayDeque
```

Ela pode ser usada como:

```text
Queue;
Deque;
pilha moderna.
```

Exemplo:

```java
Queue<String> fila = new ArrayDeque<>();
Deque<String> deque = new ArrayDeque<>();
```

Na maioria dos exemplos desta aula, usaremos `ArrayDeque`.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-164-queue-deque-e-processamento-em-ordem
cd labs\m5\aula-164-queue-deque-e-processamento-em-ordem
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula164
mkdir src\br\com\curso\aula164\app
mkdir src\br\com\curso\aula164\dominio
mkdir src\br\com\curso\aula164\dominio\valor
mkdir src\br\com\curso\aula164\dominio\ordemservico
mkdir src\br\com\curso\aula164\infra
```

---

## Primeira Queue com ArrayDeque

Crie:

```text
src\br\com\curso\aula164\app\PrimeiraQueueApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Queue;

public class PrimeiraQueueApp {
    public static void main(String[] args) {
        Queue<String> fila = new ArrayDeque<>();

        fila.offer("Ana");
        fila.offer("Carlos");
        fila.offer("Mariana");

        System.out.println("Quantidade na fila: " + fila.size());

        System.out.println("Próximo da fila: " + fila.peek());

        System.out.println("Atendendo: " + fila.poll());
        System.out.println("Atendendo: " + fila.poll());
        System.out.println("Atendendo: " + fila.poll());

        System.out.println("Fila vazia? " + fila.isEmpty());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.PrimeiraQueueApp
```

---

## O que observar

A ordem de atendimento segue a ordem de entrada:

```text
Ana;
Carlos;
Mariana.
```

Este é o comportamento FIFO.

A fila foi criada assim:

```java
Queue<String> fila = new ArrayDeque<>();
```

A variável é do tipo interface:

```java
Queue
```

A implementação é:

```java
ArrayDeque
```

Esse padrão é comum:

```text
programar contra interface;
instanciar implementação concreta.
```

---

## offer, poll e peek

As três operações mais importantes para começar são:

```text
offer;
poll;
peek.
```

### offer

Adiciona um item na fila.

```java
fila.offer("Ana");
```

### poll

Remove e retorna o próximo item.

```java
String proximo = fila.poll();
```

Se a fila estiver vazia, retorna `null`.

### peek

Consulta o próximo item sem remover.

```java
String proximo = fila.peek();
```

Se a fila estiver vazia, retorna `null`.

---

## poll remove, peek não remove

Crie:

```text
src\br\com\curso\aula164\app\QueuePollPeekApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Queue;

public class QueuePollPeekApp {
    public static void main(String[] args) {
        Queue<String> fila = new ArrayDeque<>();

        fila.offer("OS-2026-0001");
        fila.offer("OS-2026-0002");

        System.out.println("Próximo com peek: " + fila.peek());
        System.out.println("Quantidade após peek: " + fila.size());

        System.out.println();
        System.out.println("Próximo com poll: " + fila.poll());
        System.out.println("Quantidade após poll: " + fila.size());

        System.out.println();
        System.out.println("Novo próximo com peek: " + fila.peek());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.QueuePollPeekApp
```

---

## O que observar

`peek` apenas olha:

```text
não remove.
```

`poll` processa:

```text
remove da fila.
```

Esse detalhe é essencial.

Em backend, uma diferença dessas pode mudar completamente o comportamento do processamento.

---

## poll em fila vazia

Crie:

```text
src\br\com\curso\aula164\app\QueuePollFilaVaziaApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Queue;

public class QueuePollFilaVaziaApp {
    public static void main(String[] args) {
        Queue<String> fila = new ArrayDeque<>();

        String item = fila.poll();

        if (item == null) {
            System.out.println("Não há itens para processar.");
        } else {
            System.out.println("Processando: " + item);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.QueuePollFilaVaziaApp
```

---

## Por que poll é seguro para fila vazia

`poll` retorna `null` se a fila está vazia.

Isso permite tratar:

```java
if (item == null) {
    ...
}
```

Essa abordagem é mais segura do que métodos que lançam exceção quando a fila está vazia.

---

## add, remove e element

Além de:

```text
offer;
poll;
peek.
```

também existem:

```text
add;
remove;
element.
```

Diferença principal:

```text
offer/poll/peek:
lidam melhor com ausência retornando false ou null.

add/remove/element:
podem lançar exceção em certas situações.
```

Vamos ver.

---

## remove em fila vazia

Crie:

```text
src\br\com\curso\aula164\app\QueueRemoveFilaVaziaApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Queue;

public class QueueRemoveFilaVaziaApp {
    public static void main(String[] args) {
        Queue<String> fila = new ArrayDeque<>();

        try {
            String item = fila.remove();
            System.out.println("Removido: " + item);
        } catch (RuntimeException erro) {
            System.out.println("Erro ao remover de fila vazia.");
            System.out.println("Tipo: " + erro.getClass().getSimpleName());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.QueueRemoveFilaVaziaApp
```

---

## element em fila vazia

Crie:

```text
src\br\com\curso\aula164\app\QueueElementFilaVaziaApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Queue;

public class QueueElementFilaVaziaApp {
    public static void main(String[] args) {
        Queue<String> fila = new ArrayDeque<>();

        try {
            String item = fila.element();
            System.out.println("Próximo: " + item);
        } catch (RuntimeException erro) {
            System.out.println("Erro ao consultar elemento de fila vazia.");
            System.out.println("Tipo: " + erro.getClass().getSimpleName());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.QueueElementFilaVaziaApp
```

---

## Guia prático para Queue

Na maioria dos casos, prefira:

```text
offer;
poll;
peek.
```

Porque são mais suaves para tratar fila vazia.

Use:

```text
add;
remove;
element.
```

quando faz sentido lançar exceção em caso de falha.

Resumo:

```text
Adicionar:
offer ou add.

Remover:
poll ou remove.

Consultar:
peek ou element.
```

---

## Processando fila com while

Um padrão comum é processar enquanto houver itens.

Crie:

```text
src\br\com\curso\aula164\app\QueueProcessamentoWhileApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Queue;

public class QueueProcessamentoWhileApp {
    public static void main(String[] args) {
        Queue<String> fila = new ArrayDeque<>();

        fila.offer("OS-2026-0001");
        fila.offer("OS-2026-0002");
        fila.offer("OS-2026-0003");

        while (!fila.isEmpty()) {
            String codigo = fila.poll();
            System.out.println("Processando: " + codigo);
        }

        System.out.println("Processamento finalizado.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.QueueProcessamentoWhileApp
```

---

## Padrão alternativo com poll

Também é comum usar `poll` diretamente.

Crie:

```text
src\br\com\curso\aula164\app\QueueProcessamentoPollApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Queue;

public class QueueProcessamentoPollApp {
    public static void main(String[] args) {
        Queue<String> fila = new ArrayDeque<>();

        fila.offer("OS-2026-0001");
        fila.offer("OS-2026-0002");
        fila.offer("OS-2026-0003");

        String codigo;

        while ((codigo = fila.poll()) != null) {
            System.out.println("Processando: " + codigo);
        }

        System.out.println("Processamento finalizado.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.QueueProcessamentoPollApp
```

---

## Qual padrão usar

Ambos funcionam.

Este é mais explícito para iniciantes:

```java
while (!fila.isEmpty()) {
    String item = fila.poll();
}
```

Este é mais compacto:

```java
while ((item = fila.poll()) != null) {
}
```

No começo, prefira clareza.

Com o tempo, você reconhece os dois padrões.

---

## Deque como fila

Agora vamos usar `Deque`.

Crie:

```text
src\br\com\curso\aula164\app\DequeComoFilaApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Deque;

public class DequeComoFilaApp {
    public static void main(String[] args) {
        Deque<String> fila = new ArrayDeque<>();

        fila.offerLast("Ana");
        fila.offerLast("Carlos");
        fila.offerLast("Mariana");

        System.out.println("Atendimento FIFO:");

        while (!fila.isEmpty()) {
            System.out.println("- " + fila.pollFirst());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.DequeComoFilaApp
```

---

## Como ler Deque como fila

Para comportamento FIFO:

```text
adiciona no final;
remove do início.
```

Em Java:

```java
offerLast(...)
pollFirst()
```

Isso representa:

```text
primeiro que entrou é o primeiro que sai.
```

---

## Deque como pilha

Agora vamos usar `Deque` como pilha.

Crie:

```text
src\br\com\curso\aula164\app\DequeComoPilhaApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Deque;

public class DequeComoPilhaApp {
    public static void main(String[] args) {
        Deque<String> pilha = new ArrayDeque<>();

        pilha.push("Abrir tela");
        pilha.push("Editar cliente");
        pilha.push("Salvar rascunho");

        System.out.println("Desfazendo ações:");

        while (!pilha.isEmpty()) {
            System.out.println("- " + pilha.pop());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.DequeComoPilhaApp
```

---

## Como ler pilha

A pilha segue LIFO.

Entrou nesta ordem:

```text
Abrir tela;
Editar cliente;
Salvar rascunho.
```

Sai nesta ordem:

```text
Salvar rascunho;
Editar cliente;
Abrir tela.
```

O último a entrar é o primeiro a sair.

---

## push, pop e peek

Com `Deque` como pilha, os métodos comuns são:

```text
push;
pop;
peek.
```

### push

Adiciona no topo.

```java
pilha.push("ação");
```

### pop

Remove do topo.

```java
pilha.pop();
```

### peek

Consulta o topo sem remover.

```java
pilha.peek();
```

---

## Stack antigo

Java possui uma classe antiga chamada:

```java
Stack
```

Mas em Java moderno, geralmente é melhor usar:

```java
Deque
```

com:

```java
ArrayDeque
```

Exemplo:

```java
Deque<String> pilha = new ArrayDeque<>();
```

Regra prática:

```text
para pilha moderna, prefira Deque em vez de Stack.
```

---

## Deque pelas duas pontas

Crie:

```text
src\br\com\curso\aula164\app\DequeDuasPontasApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Deque;

public class DequeDuasPontasApp {
    public static void main(String[] args) {
        Deque<String> deque = new ArrayDeque<>();

        deque.offerLast("OS normal 1");
        deque.offerLast("OS normal 2");
        deque.offerFirst("OS urgente");

        System.out.println("Processando:");

        while (!deque.isEmpty()) {
            System.out.println("- " + deque.pollFirst());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.DequeDuasPontasApp
```

---

## O que esse exemplo mostra

Com `Deque`, você pode inserir no início:

```java
offerFirst
```

ou no fim:

```java
offerLast
```

E pode remover do início:

```java
pollFirst
```

ou do fim:

```java
pollLast
```

Isso permite cenários mais flexíveis.

Mas cuidado:

```text
se você começa a inserir urgência no início sem regra clara,
pode criar injustiça na fila.
```

---

## Null em ArrayDeque

`ArrayDeque` não permite `null`.

Crie:

```text
src\br\com\curso\aula164\app\ArrayDequeNullApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Queue;

public class ArrayDequeNullApp {
    public static void main(String[] args) {
        Queue<String> fila = new ArrayDeque<>();

        try {
            fila.offer(null);
        } catch (NullPointerException erro) {
            System.out.println("ArrayDeque não aceita null.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.ArrayDequeNullApp
```

---

## Regra profissional sobre null

Mesmo se alguma estrutura aceitasse `null`, evite.

Em fila, `null` é especialmente ruim porque:

```java
poll()
```

retorna `null` quando a fila está vazia.

Se você permitisse `null` como item válido, ficaria ambíguo:

```text
poll retornou null porque estava vazia?
ou porque o item era null?
```

Por isso, `ArrayDeque` não aceitar `null` ajuda.

---

## Domínio da aula

Agora vamos criar um pequeno domínio de OS.

Crie:

```text
src\br\com\curso\aula164\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula164.dominio.valor;

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
src\br\com\curso\aula164\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula164.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula164\dominio\ordemservico\OrdemServicoFila.java
```

Código:

```java
package br.com.curso.aula164.dominio.ordemservico;

import br.com.curso.aula164.dominio.valor.CodigoOs;

import java.time.LocalDate;

public class OrdemServicoFila {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDate dataSolicitacao;
    private StatusOs status;

    public OrdemServicoFila(
            CodigoOs codigo,
            String cliente,
            LocalDate dataSolicitacao
    ) {
        if (codigo == null) {
            throw new IllegalArgumentException("Código é obrigatório.");
        }

        if (cliente == null || cliente.isBlank()) {
            throw new IllegalArgumentException("Cliente é obrigatório.");
        }

        if (dataSolicitacao == null) {
            throw new IllegalArgumentException("Data de solicitação é obrigatória.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataSolicitacao = dataSolicitacao;
        this.status = StatusOs.AGENDADA;
    }

    public CodigoOs codigo() {
        return codigo;
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
                + " | Solicitação: " + dataSolicitacao
                + " | Status: " + status;
    }
}
```

---

## Fila de atendimento de OS

Crie:

```text
src\br\com\curso\aula164\app\FilaAtendimentoOsApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import br.com.curso.aula164.dominio.ordemservico.OrdemServicoFila;
import br.com.curso.aula164.dominio.valor.CodigoOs;

import java.time.LocalDate;
import java.util.ArrayDeque;
import java.util.Queue;

public class FilaAtendimentoOsApp {
    public static void main(String[] args) {
        Queue<OrdemServicoFila> fila = new ArrayDeque<>();

        fila.offer(new OrdemServicoFila(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        fila.offer(new OrdemServicoFila(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11)
        ));

        fila.offer(new OrdemServicoFila(
                new CodigoOs("OS-2026-0003"),
                "Mariana Lima",
                LocalDate.of(2026, 12, 12)
        ));

        System.out.println("Processando fila de atendimento:");

        while (!fila.isEmpty()) {
            OrdemServicoFila os = fila.poll();

            os.iniciarAtendimento();
            System.out.println("Atendendo: " + os.resumo());

            os.concluir();
            System.out.println("Concluída: " + os.resumo());
            System.out.println();
        }

        System.out.println("Fila finalizada.");
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.FilaAtendimentoOsApp
```

---

## O que esse exemplo mostra

A fila processa OS na ordem de chegada.

Cada OS protege sua própria regra:

```text
só AGENDADA pode iniciar atendimento;
só EM_ATENDIMENTO pode concluir.
```

A fila apenas coordena a ordem.

Esse é um ponto arquitetural importante:

```text
a estrutura organiza o processamento;
o domínio protege a regra.
```

---

## Serviço de fila em memória

Agora vamos criar uma classe própria para encapsular a fila.

Crie:

```text
src\br\com\curso\aula164\infra\FilaAtendimentoMemoria.java
```

Código:

```java
package br.com.curso.aula164.infra;

import br.com.curso.aula164.dominio.ordemservico.OrdemServicoFila;

import java.util.ArrayDeque;
import java.util.Queue;

public class FilaAtendimentoMemoria {
    private final Queue<OrdemServicoFila> fila;

    public FilaAtendimentoMemoria() {
        this.fila = new ArrayDeque<>();
    }

    public void adicionar(OrdemServicoFila os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (!os.podeAtender()) {
            throw new IllegalStateException("Somente OS agendada pode entrar na fila.");
        }

        fila.offer(os);
    }

    public OrdemServicoFila proxima() {
        return fila.peek();
    }

    public OrdemServicoFila retirarProxima() {
        return fila.poll();
    }

    public int quantidade() {
        return fila.size();
    }

    public boolean vazia() {
        return fila.isEmpty();
    }
}
```

---

## App usando FilaAtendimentoMemoria

Crie:

```text
src\br\com\curso\aula164\app\FilaAtendimentoMemoriaApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import br.com.curso.aula164.dominio.ordemservico.OrdemServicoFila;
import br.com.curso.aula164.dominio.valor.CodigoOs;
import br.com.curso.aula164.infra.FilaAtendimentoMemoria;

import java.time.LocalDate;

public class FilaAtendimentoMemoriaApp {
    public static void main(String[] args) {
        FilaAtendimentoMemoria fila = new FilaAtendimentoMemoria();

        fila.adicionar(new OrdemServicoFila(
                new CodigoOs("OS-2026-0001"),
                "Ana Silva",
                LocalDate.of(2026, 12, 10)
        ));

        fila.adicionar(new OrdemServicoFila(
                new CodigoOs("OS-2026-0002"),
                "Carlos Souza",
                LocalDate.of(2026, 12, 11)
        ));

        System.out.println("Quantidade inicial: " + fila.quantidade());

        OrdemServicoFila proxima = fila.proxima();

        if (proxima != null) {
            System.out.println("Próxima sem remover: " + proxima.resumo());
        }

        while (!fila.vazia()) {
            OrdemServicoFila os = fila.retirarProxima();
            os.iniciarAtendimento();
            os.concluir();

            System.out.println("Processada: " + os.resumo());
        }

        System.out.println("Quantidade final: " + fila.quantidade());
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.FilaAtendimentoMemoriaApp
```

---

## Por que encapsular a fila

Em vez de espalhar:

```java
Queue<OrdemServicoFila>
```

pelo sistema, criamos:

```java
FilaAtendimentoMemoria
```

Isso ajuda a centralizar:

```text
entrada na fila;
regra de aceite;
consulta do próximo;
retirada do próximo;
quantidade.
```

Esse pensamento é importante para arquitetura.

A estrutura de dados fica escondida atrás de uma intenção de negócio.

---

## Deque para ações de desfazer

Agora vamos simular uma pilha de ações.

Crie:

```text
src\br\com\curso\aula164\app\PilhaDesfazerAcoesApp.java
```

Código:

```java
package br.com.curso.aula164.app;

import java.util.ArrayDeque;
import java.util.Deque;

public class PilhaDesfazerAcoesApp {
    public static void main(String[] args) {
        Deque<String> acoes = new ArrayDeque<>();

        registrar(acoes, "Criar OS");
        registrar(acoes, "Alterar cliente");
        registrar(acoes, "Reagendar atendimento");

        System.out.println();
        System.out.println("Desfazendo:");

        while (!acoes.isEmpty()) {
            System.out.println("- desfazendo: " + acoes.pop());
        }
    }

    private static void registrar(Deque<String> acoes, String acao) {
        acoes.push(acao);
        System.out.println("Registrada ação: " + acao);
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula164.app.PilhaDesfazerAcoesApp
```

---

## O que esse exemplo mostra

A última ação registrada é a primeira a ser desfeita.

Esse é o comportamento LIFO.

Usos possíveis:

```text
desfazer ação;
histórico temporário;
navegação reversa;
backtracking;
processamento de pilha.
```

---

## Queue não é mensageria real

Cuidado importante.

Uma `Queue` em memória não é a mesma coisa que uma fila real de mensageria.

Exemplos de mensageria real:

```text
RabbitMQ;
Kafka;
SQS;
ActiveMQ.
```

Uma `Queue` do Java:

```text
vive dentro da memória da aplicação;
some quando a aplicação reinicia;
não garante persistência;
não distribui entre serviços;
não substitui broker.
```

Mas estudar `Queue` ajuda a entender o conceito de fila.

---

## Queue em memória vs broker

### Queue em memória

Boa para:

```text
simulação;
processamento local;
estrutura temporária;
algoritmo;
fila dentro de uma execução;
testes;
exercícios.
```

### Broker de mensageria

Necessário quando precisa de:

```text
persistência;
consumidores distribuídos;
retentativa;
dead letter queue;
escala;
integração entre serviços;
garantia operacional.
```

Mais adiante, quando estudarmos arquitetura backend, mensageria será tratada com profundidade.

Por enquanto, o foco é a estrutura de dados.

---

## Ligação com backend

`Queue` e `Deque` ajudam a entender:

```text
fila de atendimento;
fila de processamento;
eventos pendentes;
tarefas em ordem;
buffers;
pilhas de ações;
histórico;
processamento em lote;
mensageria conceitual;
agendamento de tarefas.
```

Exemplo realista:

```text
Tenho uma lista de OS importadas.
Quero processar uma a uma na ordem recebida.
```

Uma `Queue` representa bem esse fluxo.

---

## Guia de escolha

Use `List` quando:

```text
precisa de índice;
precisa percorrer livremente;
precisa acessar posição específica;
precisa manter todos os dados para consulta.
```

Use `Queue` quando:

```text
precisa processar em ordem de chegada;
não precisa acessar índice;
vai consumir itens um a um.
```

Use `Deque` quando:

```text
precisa inserir/remover nas duas pontas;
quer usar como pilha;
quer comportamento FIFO ou LIFO.
```

Use `Map` quando:

```text
precisa buscar por chave.
```

Use `Set` quando:

```text
precisa garantir unicidade.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Queue básica

Execute:

```powershell
java -cp out br.com.curso.aula164.app.PrimeiraQueueApp
java -cp out br.com.curso.aula164.app.QueuePollPeekApp
java -cp out br.com.curso.aula164.app.QueuePollFilaVaziaApp
java -cp out br.com.curso.aula164.app.QueueRemoveFilaVaziaApp
java -cp out br.com.curso.aula164.app.QueueElementFilaVaziaApp
```

### Parte 2 — Processamento

Execute:

```powershell
java -cp out br.com.curso.aula164.app.QueueProcessamentoWhileApp
java -cp out br.com.curso.aula164.app.QueueProcessamentoPollApp
```

### Parte 3 — Deque

Execute:

```powershell
java -cp out br.com.curso.aula164.app.DequeComoFilaApp
java -cp out br.com.curso.aula164.app.DequeComoPilhaApp
java -cp out br.com.curso.aula164.app.DequeDuasPontasApp
java -cp out br.com.curso.aula164.app.ArrayDequeNullApp
```

### Parte 4 — Domínio

Execute:

```powershell
java -cp out br.com.curso.aula164.app.FilaAtendimentoOsApp
java -cp out br.com.curso.aula164.app.FilaAtendimentoMemoriaApp
java -cp out br.com.curso.aula164.app.PilhaDesfazerAcoesApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula164\app\FilaImportacaoOsApp.java
```

Ele deve:

```text
criar Queue<CodigoOs>;
adicionar pelo menos 6 códigos;
processar um por um com poll;
exibir qual código está sendo processado;
exibir a quantidade restante após cada processamento;
tratar fila vazia ao final.
```

Critério principal:

```text
usar offer, poll e peek corretamente.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula164\infra\HistoricoAcoesMemoria.java
```

Ela deve usar:

```java
Deque<String>
```

Métodos:

```text
registrar(String acao);
ultimaAcao();
desfazer();
quantidade();
vazio();
```

Depois crie:

```text
src\br\com\curso\aula164\app\HistoricoAcoesMemoriaApp.java
```

Ele deve:

```text
registrar 4 ações;
mostrar a última sem remover;
desfazer todas;
mostrar mensagem quando não houver mais ação.
```

Critério principal:

```text
usar comportamento de pilha com Deque.
```

---

## Erros comuns nesta aula

### 1. Usar List quando a intenção é fila

Se você só processa em ordem, `Queue` comunica melhor.

### 2. Confundir poll com peek

`poll` remove.

`peek` não remove.

### 3. Usar remove em fila vazia sem tratar exceção

Prefira `poll` quando fila vazia é cenário esperado.

### 4. Usar Stack antigo sem necessidade

Prefira `Deque` com `ArrayDeque`.

### 5. Colocar null em ArrayDeque

`ArrayDeque` não aceita `null`.

### 6. Achar que Queue em memória é mensageria real

Não é.

### 7. Inserir urgência no início sem regra clara

Isso pode quebrar justiça da fila.

### 8. Deixar regra de domínio dentro da estrutura

Fila organiza ordem.

A entidade protege regra.

---

## Debug recomendado

Use debug em:

```text
PrimeiraQueueApp.java
QueuePollPeekApp.java
QueueProcessamentoWhileApp.java
QueueProcessamentoPollApp.java
DequeComoFilaApp.java
DequeComoPilhaApp.java
DequeDuasPontasApp.java
FilaAtendimentoOsApp.java
FilaAtendimentoMemoria.java
PilhaDesfazerAcoesApp.java
```

Breakpoints recomendados:

```java
fila.offer(...)

fila.peek()

fila.poll()

fila.remove()

fila.element()

deque.offerFirst(...)

deque.offerLast(...)

deque.pollFirst()

deque.pollLast()

pilha.push(...)

pilha.pop()

os.iniciarAtendimento()

os.concluir()
```

Observe:

```text
qual item entra primeiro;
qual item sai primeiro;
quando peek não remove;
quando poll remove;
como Deque muda comportamento;
como pilha desfaz em ordem inversa;
como domínio protege status.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. O que significa FIFO?
2. O que significa LIFO?
3. Qual a diferença entre poll e peek?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar Queue com ArrayDeque;
usar offer;
usar poll;
usar peek;
explicar FIFO;
explicar LIFO;
tratar fila vazia;
diferenciar poll/remove;
diferenciar peek/element;
processar fila com while;
usar Deque como fila;
usar Deque como pilha;
usar offerFirst e offerLast;
usar pollFirst e pollLast;
evitar Stack antigo;
explicar que Queue em memória não é mensageria real;
criar fila de atendimento de OS;
encapsular fila em classe própria;
resolver FilaImportacaoOsApp;
resolver HistoricoAcoesMemoriaApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-164-queue-deque-e-processamento-em-ordem
git commit -m "Aula 164: queue deque e processamento em ordem"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
Queue e Deque são estruturas para processar itens em ordem, não apenas armazenar dados.
```

Você aprendeu:

```text
Queue:
fila FIFO.

Deque:
fila de duas pontas, também usada como pilha LIFO.

ArrayDeque:
implementação moderna e eficiente para muitos cenários em memória.
```

Também viu um ponto arquitetural importante:

```text
estrutura de dados organiza o fluxo;
regra de negócio pertence ao domínio.
```

Na próxima aula, vamos estudar `PriorityQueue`.

Vamos entender filas com prioridade, ordenação automática e os cuidados para não confundir fila prioritária com fila comum.
