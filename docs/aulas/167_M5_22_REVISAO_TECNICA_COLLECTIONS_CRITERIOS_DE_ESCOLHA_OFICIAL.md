# 167 — M5.22 — Revisão técnica Collections: critérios de escolha

## Objetivo da aula

Nesta aula você vai consolidar tecnicamente o que estudou no Módulo 5 até aqui.

Você já passou por muitas estruturas:

```text
List;
ArrayList;
LinkedList;
Set;
HashSet;
LinkedHashSet;
TreeSet;
Map;
HashMap;
LinkedHashMap;
TreeMap;
Queue;
Deque;
PriorityQueue;
Collections;
Comparator.
```

Agora o foco é:

```text
como escolher a estrutura certa.
```

Um desenvolvedor iniciante costuma perguntar:

```text
qual coleção eu uso?
```

Um desenvolvedor mais maduro pergunta:

```text
qual é a intenção do meu problema?
```

Ao final da aula, você deve conseguir:

```text
escolher entre List, Set, Map, Queue e Deque;
saber quando usar ArrayList;
saber quando usar LinkedList;
saber quando usar HashSet;
saber quando usar LinkedHashSet;
saber quando usar TreeSet;
saber quando usar HashMap;
saber quando usar LinkedHashMap;
saber quando usar TreeMap;
saber quando usar Queue;
saber quando usar Deque;
saber quando usar PriorityQueue;
saber quando usar Collections;
saber quando usar Comparator;
evitar escolhas por costume;
explicar a escolha técnica de uma coleção;
aplicar critérios de escolha em cenários de backend.
```

Essa aula é uma revisão de engenharia.

Não é apenas decorar classes.

É aprender a decidir.

---

## Ideia principal

Coleções resolvem problemas diferentes.

Não existe uma coleção melhor para tudo.

Existe a coleção adequada para uma intenção.

Exemplo:

```text
preciso manter uma sequência:
List.

preciso evitar duplicidade:
Set.

preciso buscar por chave:
Map.

preciso processar em ordem de chegada:
Queue.

preciso processar por prioridade:
PriorityQueue.

preciso usar como pilha:
Deque.

preciso ordenar por critério:
Comparator.

preciso usar ferramenta pronta:
Collections.
```

A escolha deve nascer do comportamento esperado.

---

## Pergunta número 1: preciso de índice?

Se você precisa acessar por posição:

```text
item 0;
item 1;
item 2;
último item;
posição específica.
```

A estrutura mais natural é:

```text
List
```

Exemplo:

```java
List<String> nomes = new ArrayList<>();
String primeiro = nomes.get(0);
```

Use `List` quando posição importa.

---

## Pergunta número 2: preciso evitar duplicidade?

Se a regra é:

```text
não pode repetir;
cada item deve existir uma vez;
preciso validar itens únicos.
```

A estrutura natural é:

```text
Set
```

Exemplo:

```java
Set<String> codigos = new HashSet<>();
codigos.add("OS-2026-0001");
```

Use `Set` quando unicidade é importante.

---

## Pergunta número 3: preciso buscar por uma chave?

Se a pergunta é:

```text
qual objeto está associado a este código?
qual usuário está associado a este e-mail?
qual produto está associado a este SKU?
```

A estrutura natural é:

```text
Map
```

Exemplo:

```java
Map<String, String> clientePorOs = new HashMap<>();
String cliente = clientePorOs.get("OS-2026-0001");
```

Use `Map` quando há associação chave-valor.

---

## Pergunta número 4: preciso processar em ordem de chegada?

Se você precisa consumir itens um a um, na ordem em que chegaram:

```text
primeiro entra, primeiro sai.
```

A estrutura natural é:

```text
Queue
```

Exemplo:

```java
Queue<String> fila = new ArrayDeque<>();
fila.offer("OS-2026-0001");
String proxima = fila.poll();
```

Use `Queue` quando a intenção é fila FIFO.

---

## Pergunta número 5: preciso usar como pilha?

Se o último item adicionado deve ser o primeiro removido:

```text
último entra, primeiro sai.
```

A estrutura moderna é:

```text
Deque
```

Exemplo:

```java
Deque<String> pilha = new ArrayDeque<>();
pilha.push("Ação 1");
String ultima = pilha.pop();
```

Use `Deque` como pilha moderna.

---

## Pergunta número 6: preciso processar por prioridade?

Se quem sai primeiro não é quem chegou primeiro, mas quem tem maior prioridade, use:

```text
PriorityQueue
```

Exemplo:

```java
Queue<Tarefa> fila = new PriorityQueue<>(comparador);
Tarefa proxima = fila.poll();
```

Use `PriorityQueue` quando há critério de prioridade.

---

## Pergunta número 7: preciso de ordem de inserção?

Se você precisa manter a ordem em que os dados chegaram:

```text
ordem do arquivo;
ordem do payload;
ordem de cadastro;
ordem de seleção.
```

Considere:

```text
LinkedHashSet;
LinkedHashMap;
ArrayList.
```

Exemplos:

```java
Set<String> codigos = new LinkedHashSet<>();
Map<String, String> mapa = new LinkedHashMap<>();
```

Use estruturas `Linked` quando a ordem de inserção precisa ser preservada.

---

## Pergunta número 8: preciso de ordenação automática?

Se a estrutura deve manter os dados ordenados naturalmente:

```text
códigos em ordem;
nomes em ordem;
datas em ordem;
chaves ordenadas.
```

Considere:

```text
TreeSet;
TreeMap.
```

Exemplos:

```java
Set<String> codigos = new TreeSet<>();
Map<String, String> clientes = new TreeMap<>();
```

Use `TreeSet` e `TreeMap` quando a ordenação pela chave/elemento faz parte da estrutura.

---

## Pergunta número 9: preciso ordenar uma lista de várias formas?

Se a mesma lista pode ser ordenada por:

```text
nome;
data;
status;
prioridade;
código.
```

Use:

```text
Comparator
```

Exemplo:

```java
ordens.sort(
        Comparator.comparing(OrdemServico::dataAtendimento)
                .thenComparing(OrdemServico::codigo)
);
```

Use `Comparator` quando a ordenação é externa, variável ou contextual.

---

## Pergunta número 10: existe método pronto?

Antes de escrever algoritmo manual, veja se `Collections` resolve.

Exemplos:

```text
sort;
reverse;
shuffle;
min;
max;
frequency;
disjoint;
swap;
binarySearch.
```

Use `Collections` quando um utilitário pronto resolve com clareza.

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-167-revisao-tecnica-collections-criterios-de-escolha
cd labs\m5\aula-167-revisao-tecnica-collections-criterios-de-escolha
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula167
mkdir src\br\com\curso\aula167\app
mkdir src\br\com\curso\aula167\dominio
mkdir src\br\com\curso\aula167\dominio\valor
mkdir src\br\com\curso\aula167\dominio\atendimento
mkdir src\br\com\curso\aula167\infra
```

---

## Comparativo rápido das interfaces

```text
List:
sequência com índice.

Set:
conjunto sem duplicidade.

Map:
chave -> valor.

Queue:
fila de processamento.

Deque:
fila de duas pontas ou pilha.
```

Essas são interfaces.

As implementações concretas vêm depois.

---

## Comparativo rápido das implementações

```text
ArrayList:
lista geral, boa para leitura por índice e uso comum.

LinkedList:
lista encadeada, hoje menos usada como escolha padrão.

HashSet:
unicidade sem ordem garantida.

LinkedHashSet:
unicidade com ordem de inserção.

TreeSet:
unicidade com ordenação.

HashMap:
chave -> valor sem ordem garantida.

LinkedHashMap:
chave -> valor com ordem de inserção.

TreeMap:
chave -> valor ordenado pela chave.

ArrayDeque:
fila ou pilha em memória.

PriorityQueue:
fila por prioridade.
```

---

## Exemplo 1 — List para sequência

Crie:

```text
src\br\com\curso\aula167\app\EscolhaListSequenciaApp.java
```

Código:

```java
package br.com.curso.aula167.app;

import java.util.ArrayList;
import java.util.List;

public class EscolhaListSequenciaApp {
    public static void main(String[] args) {
        List<String> etapas = new ArrayList<>();

        etapas.add("Receber solicitação");
        etapas.add("Validar dados");
        etapas.add("Processar atendimento");
        etapas.add("Finalizar");

        System.out.println("Etapas em sequência:");

        for (int indice = 0; indice < etapas.size(); indice++) {
            System.out.println((indice + 1) + ". " + etapas.get(indice));
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula167.app.EscolhaListSequenciaApp
```

---

## Por que List aqui

A ordem das etapas importa.

Também usamos índice para exibir:

```text
1.
2.
3.
```

Então `List` é adequada.

Se a intenção fosse apenas evitar duplicidade, `Set` faria mais sentido.

---

## Exemplo 2 — Set para unicidade

Crie:

```text
src\br\com\curso\aula167\app\EscolhaSetUnicidadeApp.java
```

Código:

```java
package br.com.curso.aula167.app;

import java.util.HashSet;
import java.util.Set;

public class EscolhaSetUnicidadeApp {
    public static void main(String[] args) {
        Set<String> codigosImportados = new HashSet<>();

        adicionar(codigosImportados, "OS-2026-0001");
        adicionar(codigosImportados, "OS-2026-0002");
        adicionar(codigosImportados, "OS-2026-0001");

        System.out.println();
        System.out.println("Códigos únicos:");

        for (String codigo : codigosImportados) {
            System.out.println("- " + codigo);
        }
    }

    private static void adicionar(Set<String> codigos, String codigo) {
        boolean adicionou = codigos.add(codigo);

        if (adicionou) {
            System.out.println("Adicionado: " + codigo);
        } else {
            System.out.println("Duplicado ignorado: " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula167.app.EscolhaSetUnicidadeApp
```

---

## Por que Set aqui

A regra é:

```text
não repetir código.
```

`Set` comunica isso diretamente.

O retorno de `add` também ajuda:

```java
boolean adicionou = codigos.add(codigo);
```

Se `false`, já existia.

---

## Exemplo 3 — Map para busca por chave

Crie:

```text
src\br\com\curso\aula167\app\EscolhaMapBuscaPorChaveApp.java
```

Código:

```java
package br.com.curso.aula167.app;

import java.util.HashMap;
import java.util.Map;

public class EscolhaMapBuscaPorChaveApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new HashMap<>();

        clientePorOs.put("OS-2026-0001", "Ana Silva");
        clientePorOs.put("OS-2026-0002", "Carlos Souza");

        String codigoBusca = "OS-2026-0002";

        String cliente = clientePorOs.get(codigoBusca);

        if (cliente == null) {
            System.out.println("OS não encontrada.");
        } else {
            System.out.println("Cliente da " + codigoBusca + ": " + cliente);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula167.app.EscolhaMapBuscaPorChaveApp
```

---

## Por que Map aqui

A pergunta é:

```text
qual cliente está associado a este código?
```

Essa é uma pergunta de chave-valor.

Então `Map` é natural.

Com `List`, você teria que percorrer e procurar.

Com `Map`, busca por chave fica explícita.

---

## Exemplo 4 — Queue para processamento FIFO

Crie:

```text
src\br\com\curso\aula167\app\EscolhaQueueProcessamentoApp.java
```

Código:

```java
package br.com.curso.aula167.app;

import java.util.ArrayDeque;
import java.util.Queue;

public class EscolhaQueueProcessamentoApp {
    public static void main(String[] args) {
        Queue<String> fila = new ArrayDeque<>();

        fila.offer("OS-2026-0001");
        fila.offer("OS-2026-0002");
        fila.offer("OS-2026-0003");

        System.out.println("Processando em ordem de chegada:");

        while (!fila.isEmpty()) {
            System.out.println("- " + fila.poll());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula167.app.EscolhaQueueProcessamentoApp
```

---

## Por que Queue aqui

A intenção é:

```text
processar na ordem de chegada.
```

Não precisamos de índice.

Não precisamos buscar por chave.

Não precisamos manter tudo depois.

Vamos consumir item por item.

Isso é `Queue`.

---

## Exemplo 5 — PriorityQueue para prioridade

Crie:

```text
src\br\com\curso\aula167\app\EscolhaPriorityQueueApp.java
```

Código:

```java
package br.com.curso.aula167.app;

import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

public class EscolhaPriorityQueueApp {
    public static void main(String[] args) {
        Queue<String> fila = new PriorityQueue<>(
                Comparator.comparingInt(EscolhaPriorityQueueApp::peso)
        );

        fila.offer("NORMAL");
        fila.offer("CRITICA");
        fila.offer("BAIXA");
        fila.offer("ALTA");

        System.out.println("Processando por prioridade:");

        while (!fila.isEmpty()) {
            System.out.println("- " + fila.poll());
        }
    }

    private static int peso(String prioridade) {
        return switch (prioridade) {
            case "CRITICA" -> 1;
            case "ALTA" -> 2;
            case "NORMAL" -> 3;
            case "BAIXA" -> 4;
            default -> 99;
        };
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula167.app.EscolhaPriorityQueueApp
```

---

## Por que PriorityQueue aqui

A ordem não é de chegada.

A ordem é de prioridade:

```text
CRITICA;
ALTA;
NORMAL;
BAIXA.
```

Então `PriorityQueue` comunica melhor a intenção.

---

## Exemplo 6 — Deque como pilha

Crie:

```text
src\br\com\curso\aula167\app\EscolhaDequePilhaApp.java
```

Código:

```java
package br.com.curso.aula167.app;

import java.util.ArrayDeque;
import java.util.Deque;

public class EscolhaDequePilhaApp {
    public static void main(String[] args) {
        Deque<String> historico = new ArrayDeque<>();

        historico.push("Abrir cadastro");
        historico.push("Editar cliente");
        historico.push("Alterar data");

        System.out.println("Desfazendo ações:");

        while (!historico.isEmpty()) {
            System.out.println("- " + historico.pop());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula167.app.EscolhaDequePilhaApp
```

---

## Por que Deque aqui

A intenção é:

```text
última ação deve ser desfeita primeiro.
```

Isso é LIFO.

Em Java moderno, `Deque` com `ArrayDeque` é uma boa escolha.

---

## Exemplo 7 — LinkedHashSet para unicidade com ordem

Crie:

```text
src\br\com\curso\aula167\app\EscolhaLinkedHashSetApp.java
```

Código:

```java
package br.com.curso.aula167.app;

import java.util.LinkedHashSet;
import java.util.Set;

public class EscolhaLinkedHashSetApp {
    public static void main(String[] args) {
        Set<String> codigos = new LinkedHashSet<>();

        codigos.add("OS-2026-0003");
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0003");
        codigos.add("OS-2026-0002");

        System.out.println("Códigos únicos na ordem de chegada:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula167.app.EscolhaLinkedHashSetApp
```

---

## Por que LinkedHashSet aqui

A regra tem duas partes:

```text
não repetir;
preservar ordem de chegada.
```

Então `LinkedHashSet` é melhor que `HashSet`.

`HashSet` resolveria a duplicidade, mas não a ordem.

---

## Exemplo 8 — TreeSet para unicidade ordenada

Crie:

```text
src\br\com\curso\aula167\app\EscolhaTreeSetApp.java
```

Código:

```java
package br.com.curso.aula167.app;

import java.util.Set;
import java.util.TreeSet;

public class EscolhaTreeSetApp {
    public static void main(String[] args) {
        Set<String> codigos = new TreeSet<>();

        codigos.add("OS-2026-0003");
        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0003");
        codigos.add("OS-2026-0002");

        System.out.println("Códigos únicos ordenados:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula167.app.EscolhaTreeSetApp
```

---

## Por que TreeSet aqui

A regra é:

```text
não repetir;
exibir ordenado.
```

Então `TreeSet` resolve as duas coisas.

Mas cuidado:

```text
TreeSet precisa comparar elementos.
```

Com `String`, isso já funciona.

Com objeto próprio, precisa `Comparable` ou `Comparator`.

---

## Exemplo 9 — LinkedHashMap para ordem de cadastro

Crie:

```text
src\br\com\curso\aula167\app\EscolhaLinkedHashMapApp.java
```

Código:

```java
package br.com.curso.aula167.app;

import java.util.LinkedHashMap;
import java.util.Map;

public class EscolhaLinkedHashMapApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new LinkedHashMap<>();

        clientePorOs.put("OS-2026-0003", "Mariana Lima");
        clientePorOs.put("OS-2026-0001", "Ana Silva");
        clientePorOs.put("OS-2026-0002", "Carlos Souza");

        System.out.println("OS na ordem de cadastro:");

        for (Map.Entry<String, String> entrada : clientePorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula167.app.EscolhaLinkedHashMapApp
```

---

## Por que LinkedHashMap aqui

A regra é:

```text
buscar por chave;
preservar ordem de cadastro.
```

Então `LinkedHashMap` é melhor que `HashMap`.

---

## Exemplo 10 — TreeMap para chave ordenada

Crie:

```text
src\br\com\curso\aula167\app\EscolhaTreeMapApp.java
```

Código:

```java
package br.com.curso.aula167.app;

import java.util.Map;
import java.util.TreeMap;

public class EscolhaTreeMapApp {
    public static void main(String[] args) {
        Map<String, String> clientePorOs = new TreeMap<>();

        clientePorOs.put("OS-2026-0003", "Mariana Lima");
        clientePorOs.put("OS-2026-0001", "Ana Silva");
        clientePorOs.put("OS-2026-0002", "Carlos Souza");

        System.out.println("OS ordenadas por código:");

        for (Map.Entry<String, String> entrada : clientePorOs.entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula167.app.EscolhaTreeMapApp
```

---

## Por que TreeMap aqui

A regra é:

```text
buscar por chave;
exibir ordenado pela chave.
```

Então `TreeMap` é uma boa escolha.

Se a ordem não importasse, `HashMap` seria suficiente.

---

## Domínio para revisão aplicada

Agora vamos criar um pequeno domínio para um cenário mais maduro.

Crie:

```text
src\br\com\curso\aula167\dominio\valor\CodigoOs.java
```

Código:

```java
package br.com.curso.aula167.dominio.valor;

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
src\br\com\curso\aula167\dominio\atendimento\PrioridadeAtendimento.java
```

Código:

```java
package br.com.curso.aula167.dominio.atendimento;

public enum PrioridadeAtendimento {
    BAIXA,
    NORMAL,
    ALTA,
    CRITICA
}
```

Crie:

```text
src\br\com\curso\aula167\dominio\atendimento\StatusAtendimento.java
```

Código:

```java
package br.com.curso.aula167.dominio.atendimento;

public enum StatusAtendimento {
    CADASTRADA,
    ENFILEIRADA,
    EM_ATENDIMENTO,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula167\dominio\atendimento\ResumoOs.java
```

Código:

```java
package br.com.curso.aula167.dominio.atendimento;

import br.com.curso.aula167.dominio.valor.CodigoOs;

import java.time.LocalDateTime;

public class ResumoOs {
    private final CodigoOs codigo;
    private final String cliente;
    private final LocalDateTime dataEntrada;
    private final PrioridadeAtendimento prioridade;
    private final StatusAtendimento status;

    public ResumoOs(
            CodigoOs codigo,
            String cliente,
            LocalDateTime dataEntrada,
            PrioridadeAtendimento prioridade,
            StatusAtendimento status
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

        if (status == null) {
            throw new IllegalArgumentException("Status é obrigatório.");
        }

        this.codigo = codigo;
        this.cliente = cliente;
        this.dataEntrada = dataEntrada;
        this.prioridade = prioridade;
        this.status = status;
    }

    public CodigoOs codigo() {
        return codigo;
    }

    public String cliente() {
        return cliente;
    }

    public LocalDateTime dataEntrada() {
        return dataEntrada;
    }

    public PrioridadeAtendimento prioridade() {
        return prioridade;
    }

    public StatusAtendimento status() {
        return status;
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

## Classe de critérios de escolha aplicada

Crie:

```text
src\br\com\curso\aula167\infra\PainelAtendimentoMemoria.java
```

Código:

```java
package br.com.curso.aula167.infra;

import br.com.curso.aula167.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula167.dominio.atendimento.ResumoOs;
import br.com.curso.aula167.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula167.dominio.valor.CodigoOs;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Set;
import java.util.TreeSet;

public class PainelAtendimentoMemoria {
    private final Map<CodigoOs, ResumoOs> ordensPorCodigo;
    private final Set<CodigoOs> codigosProcessados;
    private final Queue<ResumoOs> filaPrioritaria;

    public PainelAtendimentoMemoria() {
        this.ordensPorCodigo = new LinkedHashMap<>();
        this.codigosProcessados = new HashSet<>();
        this.filaPrioritaria = new PriorityQueue<>(comparadorPrioridade());
    }

    public void cadastrar(ResumoOs os) {
        if (os == null) {
            throw new IllegalArgumentException("OS é obrigatória.");
        }

        if (ordensPorCodigo.containsKey(os.codigo())) {
            throw new IllegalStateException("OS duplicada: " + os.codigo().resumo());
        }

        ordensPorCodigo.put(os.codigo(), os);
    }

    public ResumoOs buscar(CodigoOs codigo) {
        return ordensPorCodigo.get(codigo);
    }

    public void enfileirar(CodigoOs codigo) {
        ResumoOs os = buscar(codigo);

        if (os == null) {
            throw new IllegalArgumentException("OS não encontrada: " + codigo.resumo());
        }

        if (codigosProcessados.contains(codigo)) {
            throw new IllegalStateException("OS já processada: " + codigo.resumo());
        }

        filaPrioritaria.offer(os);
    }

    public ResumoOs processarProxima() {
        ResumoOs os = filaPrioritaria.poll();

        if (os != null) {
            codigosProcessados.add(os.codigo());
        }

        return os;
    }

    public List<ResumoOs> listarNaOrdemDeCadastro() {
        return List.copyOf(ordensPorCodigo.values());
    }

    public List<ResumoOs> listarOrdenadoPorCliente() {
        List<ResumoOs> lista = new ArrayList<>(ordensPorCodigo.values());
        lista.sort(Comparator.comparing(ResumoOs::cliente)
                .thenComparing(ResumoOs::codigo));

        return List.copyOf(lista);
    }

    public Set<CodigoOs> codigosOrdenados() {
        return new TreeSet<>(ordensPorCodigo.keySet());
    }

    public Map<StatusAtendimento, Integer> contarPorStatus() {
        Map<StatusAtendimento, Integer> contagem = new LinkedHashMap<>();

        for (ResumoOs os : ordensPorCodigo.values()) {
            contagem.merge(os.status(), 1, Integer::sum);
        }

        return contagem;
    }

    public int quantidadeCadastrada() {
        return ordensPorCodigo.size();
    }

    public int quantidadeNaFila() {
        return filaPrioritaria.size();
    }

    public int quantidadeProcessada() {
        return codigosProcessados.size();
    }

    private Comparator<ResumoOs> comparadorPrioridade() {
        return Comparator.comparingInt((ResumoOs os) -> pesoPrioridade(os.prioridade()))
                .thenComparing(ResumoOs::dataEntrada)
                .thenComparing(ResumoOs::codigo);
    }

    private int pesoPrioridade(PrioridadeAtendimento prioridade) {
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

## O que PainelAtendimentoMemoria demonstra

Essa classe usa várias estruturas com intenção clara:

```text
LinkedHashMap:
cadastrar e listar na ordem de cadastro.

HashSet:
controlar códigos processados sem repetição.

PriorityQueue:
processar por prioridade.

TreeSet:
gerar visão ordenada de códigos.

ArrayList:
criar cópia ordenável.

Comparator:
ordenar por cliente e prioridade.

Map:
contar por status.
```

Cada estrutura tem um motivo.

---

## App de revisão aplicada

Crie:

```text
src\br\com\curso\aula167\app\RevisaoCollectionsAplicadaApp.java
```

Código:

```java
package br.com.curso.aula167.app;

import br.com.curso.aula167.dominio.atendimento.PrioridadeAtendimento;
import br.com.curso.aula167.dominio.atendimento.ResumoOs;
import br.com.curso.aula167.dominio.atendimento.StatusAtendimento;
import br.com.curso.aula167.dominio.valor.CodigoOs;
import br.com.curso.aula167.infra.PainelAtendimentoMemoria;

import java.time.LocalDateTime;
import java.util.Map;

public class RevisaoCollectionsAplicadaApp {
    public static void main(String[] args) {
        PainelAtendimentoMemoria painel = new PainelAtendimentoMemoria();

        cadastrar(painel, "OS-2026-0003", "Mariana Lima", PrioridadeAtendimento.ALTA, StatusAtendimento.CADASTRADA, 9, 5);
        cadastrar(painel, "OS-2026-0001", "Ana Silva", PrioridadeAtendimento.NORMAL, StatusAtendimento.CADASTRADA, 9, 0);
        cadastrar(painel, "OS-2026-0004", "Bruno Rocha", PrioridadeAtendimento.BAIXA, StatusAtendimento.CADASTRADA, 9, 20);
        cadastrar(painel, "OS-2026-0002", "Carlos Souza", PrioridadeAtendimento.CRITICA, StatusAtendimento.CADASTRADA, 9, 10);

        painel.enfileirar(new CodigoOs("OS-2026-0001"));
        painel.enfileirar(new CodigoOs("OS-2026-0002"));
        painel.enfileirar(new CodigoOs("OS-2026-0003"));
        painel.enfileirar(new CodigoOs("OS-2026-0004"));

        System.out.println("Listagem na ordem de cadastro:");
        painel.listarNaOrdemDeCadastro()
                .forEach(os -> System.out.println("- " + os.resumo()));

        System.out.println();
        System.out.println("Listagem ordenada por cliente:");
        painel.listarOrdenadoPorCliente()
                .forEach(os -> System.out.println("- " + os.resumo()));

        System.out.println();
        System.out.println("Códigos ordenados:");
        painel.codigosOrdenados()
                .forEach(codigo -> System.out.println("- " + codigo.resumo()));

        System.out.println();
        System.out.println("Processamento prioritário:");

        ResumoOs processada;
        while ((processada = painel.processarProxima()) != null) {
            System.out.println("- " + processada.resumo());
        }

        System.out.println();
        System.out.println("Contagem por status:");

        for (Map.Entry<StatusAtendimento, Integer> entrada : painel.contarPorStatus().entrySet()) {
            System.out.println(entrada.getKey() + " -> " + entrada.getValue());
        }

        System.out.println();
        System.out.println("Quantidade cadastrada: " + painel.quantidadeCadastrada());
        System.out.println("Quantidade na fila: " + painel.quantidadeNaFila());
        System.out.println("Quantidade processada: " + painel.quantidadeProcessada());
    }

    private static void cadastrar(
            PainelAtendimentoMemoria painel,
            String codigo,
            String cliente,
            PrioridadeAtendimento prioridade,
            StatusAtendimento status,
            int hora,
            int minuto
    ) {
        painel.cadastrar(new ResumoOs(
                new CodigoOs(codigo),
                cliente,
                LocalDateTime.of(2026, 12, 10, hora, minuto),
                prioridade,
                status
        ));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula167.app.RevisaoCollectionsAplicadaApp
```

---

## Análise do app

Veja a diferença de cada saída:

```text
ordem de cadastro:
vem do LinkedHashMap.

ordem por cliente:
vem de ArrayList + Comparator.

códigos ordenados:
vem de TreeSet.

processamento prioritário:
vem de PriorityQueue.

processados únicos:
vem de HashSet.

contagem por status:
vem de Map.
```

Esse é o ponto da aula:

```text
uma aplicação real pode usar várias coleções ao mesmo tempo,
cada uma com uma responsabilidade.
```

---

## Antipadrão: usar List para tudo

Muitos iniciantes usam `List` para tudo.

Exemplo ruim:

```text
List para buscar por código;
List para evitar duplicidade;
List para simular fila;
List para contar por status;
List para processar prioridade.
```

Dá para fazer?

Sim.

Mas fica menos expressivo e mais sujeito a erro.

Exemplo:

```text
buscar por código em List exige loop;
evitar duplicidade exige loop;
prioridade exige ordenar ou procurar manualmente;
contagem exige lógica manual.
```

Use a estrutura que comunica a intenção.

---

## Antipadrão: escolher estrutura pela moda

Outro erro é usar uma estrutura porque parece mais sofisticada.

Exemplo:

```text
usar TreeMap sem precisar de ordem;
usar LinkedList como padrão;
usar PriorityQueue quando FIFO bastava;
usar Map quando só precisava de lista;
usar Set quando duplicidade era permitida.
```

Coleção boa não é a mais avançada.

É a mais adequada.

---

## Checklist de decisão

Antes de escolher, pergunte:

```text
1. Preciso de índice?
2. Preciso de ordem de inserção?
3. Preciso de ordenação automática?
4. Preciso evitar duplicidade?
5. Preciso buscar por chave?
6. Preciso processar em fila?
7. Preciso processar por prioridade?
8. Preciso de pilha?
9. Preciso preservar a coleção original?
10. Preciso retornar uma cópia protegida?
```

A resposta aponta a estrutura.

---

## Tabela mental de escolha

```text
Sequência com índice:
ArrayList.

Sequência e acesso por posição:
List.

Unicidade simples:
HashSet.

Unicidade + ordem de chegada:
LinkedHashSet.

Unicidade + ordenação:
TreeSet.

Busca por chave:
HashMap.

Busca por chave + ordem de cadastro:
LinkedHashMap.

Busca por chave + chave ordenada:
TreeMap.

Fila FIFO:
Queue com ArrayDeque.

Pilha LIFO:
Deque com ArrayDeque.

Fila por prioridade:
PriorityQueue.

Ordenação customizada:
Comparator.

Ferramentas prontas:
Collections.
```

---

## Cuidado com retorno de coleções

Quando uma classe tem coleção interna, evite expor diretamente.

Ruim:

```java
return listaInterna;
```

Melhor:

```java
return List.copyOf(listaInterna);
```

Ou, dependendo do caso:

```java
return new ArrayList<>(listaInterna);
```

A ideia é proteger o estado interno.

Isso foi usado em várias aulas.

---

## Cuidado com mutabilidade

Coleções guardam referências.

Se você guarda um objeto mutável dentro de uma coleção, alterações no objeto aparecem na coleção.

Isso é normal.

Mas pode ser perigoso em:

```text
HashSet;
HashMap como chave;
TreeSet;
TreeMap;
PriorityQueue.
```

Especialmente se você muda campos usados para:

```text
equals;
hashCode;
compareTo;
Comparator.
```

Regra:

```text
não mude campos que definem igualdade, hash ou prioridade enquanto o objeto está na estrutura.
```

---

## Cuidado com null

Evite `null` em coleções.

Problemas:

```text
NullPointerException;
ambiguidade em poll;
comparação em TreeSet/TreeMap;
PriorityQueue não aceita null;
regras mais difíceis.
```

Prefira validar antes de adicionar.

Exemplo:

```java
if (valor == null) {
    throw new IllegalArgumentException("Valor obrigatório.");
}
```

---

## Cuidado com ordem

Nunca dependa da ordem de:

```text
HashSet;
HashMap.
```

Se ordem importa, use estrutura que garante ordem:

```text
LinkedHashSet;
LinkedHashMap;
TreeSet;
TreeMap;
List com Comparator.
```

Ordem acidental não é contrato.

---

## Cuidado com performance sem exagero

Neste ponto do curso, a prioridade é clareza.

Mas alguns conceitos importam:

```text
buscar por chave em Map é melhor que varrer List quando a chave é clara;
Set é melhor que List para validar duplicidade;
PriorityQueue evita ordenar tudo a cada retirada;
TreeSet/TreeMap mantêm ordenação, mas exigem comparação;
ArrayList é ótima escolha geral para lista.
```

Não otimize cedo.

Mas escolha com consciência.

---

## Ligação com backend

Em backend, essas decisões aparecem em:

```text
validação de importação;
agrupamento por status;
relatórios;
caches temporários;
índices em memória;
deduplicação;
processamento de fila;
priorização de atendimento;
montagem de DTO;
respostas ordenadas;
regras de negócio em memória;
testes automatizados.
```

Exemplos:

```text
Importação de OS:
LinkedHashSet para manter ordem e remover duplicados.

Consulta rápida por código:
HashMap.

Relatório ordenado por código:
TreeMap ou List + Comparator.

Atendimento por prioridade:
PriorityQueue.

Histórico:
List.

Permissões únicas:
Set.
```

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Exemplos isolados

Execute:

```powershell
java -cp out br.com.curso.aula167.app.EscolhaListSequenciaApp
java -cp out br.com.curso.aula167.app.EscolhaSetUnicidadeApp
java -cp out br.com.curso.aula167.app.EscolhaMapBuscaPorChaveApp
java -cp out br.com.curso.aula167.app.EscolhaQueueProcessamentoApp
java -cp out br.com.curso.aula167.app.EscolhaPriorityQueueApp
java -cp out br.com.curso.aula167.app.EscolhaDequePilhaApp
```

### Parte 2 — Ordem e ordenação

Execute:

```powershell
java -cp out br.com.curso.aula167.app.EscolhaLinkedHashSetApp
java -cp out br.com.curso.aula167.app.EscolhaTreeSetApp
java -cp out br.com.curso.aula167.app.EscolhaLinkedHashMapApp
java -cp out br.com.curso.aula167.app.EscolhaTreeMapApp
```

### Parte 3 — Revisão aplicada

Execute:

```powershell
java -cp out br.com.curso.aula167.app.RevisaoCollectionsAplicadaApp
```

Observe qual coleção aparece em cada parte do fluxo.

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula167\app\DiagnosticoEscolhaCollectionsApp.java
```

Ele deve imprimir perguntas e respostas técnicas.

Exemplo:

```text
Problema: preciso buscar cliente por CPF.
Escolha: Map<Cpf, Cliente>.
Motivo: busca por chave.

Problema: preciso remover duplicados mantendo ordem.
Escolha: LinkedHashSet.
Motivo: unicidade + ordem de inserção.
```

Inclua pelo menos 10 cenários.

Critério principal:

```text
cada escolha precisa ter motivo técnico.
```

---

## Desafio extra

Crie uma classe:

```text
src\br\com\curso\aula167\infra\AnalisadorImportacaoOsMemoria.java
```

Ela deve receber uma `List<CodigoOs>` e gerar:

```text
lista original;
códigos únicos mantendo ordem;
códigos únicos ordenados;
códigos duplicados;
quantidade total;
quantidade única;
quantidade duplicada.
```

Sugestões de estruturas:

```text
List:
entrada original.

LinkedHashSet:
únicos mantendo ordem.

TreeSet:
únicos ordenados.

HashSet:
controle de vistos.

ArrayList:
duplicados.
```

Depois crie:

```text
src\br\com\curso\aula167\app\AnalisadorImportacaoOsApp.java
```

Critério principal:

```text
usar a estrutura certa para cada saída.
```

---

## Erros comuns nesta aula

### 1. Usar ArrayList para tudo

Funciona em alguns casos, mas não comunica sempre a melhor intenção.

### 2. Usar HashMap esperando ordem

Não faça isso.

### 3. Usar Set quando duplicidade é permitida

Se repetição importa, `Set` pode destruir informação.

### 4. Usar TreeSet sem entender comparação

TreeSet precisa ordenar.

### 5. Usar PriorityQueue esperando FIFO

PriorityQueue é por prioridade.

### 6. Iterar PriorityQueue esperando ordem

Use `poll` para obter prioridade.

### 7. Expor coleção interna mutável

Use cópia ou visão protegida.

### 8. Alterar chave dentro de HashMap/HashSet

Pode quebrar busca.

### 9. Alterar prioridade dentro de PriorityQueue

Pode quebrar a ordem esperada.

### 10. Escolher coleção sem justificar

Em código profissional, a escolha deve ter motivo.

---

## Debug recomendado

Use debug em:

```text
EscolhaSetUnicidadeApp.java
EscolhaMapBuscaPorChaveApp.java
EscolhaPriorityQueueApp.java
EscolhaLinkedHashSetApp.java
EscolhaTreeSetApp.java
PainelAtendimentoMemoria.java
RevisaoCollectionsAplicadaApp.java
```

Breakpoints recomendados:

```java
codigos.add(...)

clientePorOs.get(...)

fila.offer(...)

fila.poll()

ordensPorCodigo.put(...)

codigosProcessados.add(...)

new TreeSet<>(...)

lista.sort(...)

contagem.merge(...)
```

Observe:

```text
quando duplicidade é bloqueada;
quando busca por chave acontece;
quando prioridade muda a ordem de saída;
quando TreeSet ordena;
quando LinkedHashMap preserva cadastro;
quando HashSet registra processados;
quando Comparator ordena a lista.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Quando usar List?
2. Quando usar Set?
3. Quando usar Map?
4. Quando usar Queue?
5. Quando usar PriorityQueue?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar critérios de escolha de coleções;
diferenciar List, Set, Map, Queue e Deque;
escolher ArrayList;
escolher HashSet;
escolher LinkedHashSet;
escolher TreeSet;
escolher HashMap;
escolher LinkedHashMap;
escolher TreeMap;
escolher Queue com ArrayDeque;
escolher Deque como pilha;
escolher PriorityQueue;
usar Comparator para ordenação contextual;
usar Collections quando houver utilitário pronto;
proteger retorno com List.copyOf;
evitar mutabilidade perigosa;
resolver DiagnosticoEscolhaCollectionsApp;
resolver AnalisadorImportacaoOsApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-167-revisao-tecnica-collections-criterios-de-escolha
git commit -m "Aula 167: revisao tecnica collections criterios de escolha"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
a coleção certa nasce da intenção do problema.
```

Você consolidou critérios para escolher entre:

```text
List;
Set;
Map;
Queue;
Deque;
PriorityQueue;
TreeSet;
TreeMap;
LinkedHashSet;
LinkedHashMap;
Comparator;
Collections.
```

Isso é uma habilidade essencial para escrever código Java limpo e profissional.

Na próxima aula, vamos iniciar uma sequência de exercícios integradores de Collections.

Vamos praticar leitura de requisitos e escolha de estruturas antes de sair codando.
