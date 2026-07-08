# 148 — M5.03 — List interface e ArrayList

## Objetivo da aula

Nesta aula você vai aprofundar a primeira coleção mais usada no dia a dia de Java Backend:

```text
List
```

E a implementação mais comum dela:

```text
ArrayList
```

Na aula anterior, você comparou arrays com coleções e viu que arrays têm tamanho fixo, exigem controle manual de quantidade e tornam remoção e crescimento mais trabalhosos.

Agora vamos entender melhor como usar `List` e `ArrayList` de forma correta.

Ao final da aula, você deve conseguir:

```text
explicar o que é a interface List;
explicar o que é a implementação ArrayList;
entender por que declaramos List e instanciamos ArrayList;
criar listas de String e de objetos;
usar add, get, set, remove, size, isEmpty e contains;
entender que List mantém ordem de inserção;
entender que List aceita elementos repetidos;
entender índice começando em zero;
evitar erros comuns com índice inválido;
passar List como parâmetro de método;
retornar List com critério;
usar List em cenários parecidos com backend.
```

Esta aula é uma base muito importante.

Muitas APIs, services, repositories, relatórios e regras de negócio usam `List`.

---

## Ideia central

Quando você escreve:

```java
List<String> nomes = new ArrayList<>();
```

você está dizendo:

```text
quero trabalhar com uma lista de Strings.
A implementação escolhida para essa lista será ArrayList.
```

O tipo da variável é:

```java
List<String>
```

A implementação criada é:

```java
new ArrayList<>()
```

Isso é comum em Java profissional.

Você usa a interface para programar e a implementação para executar.

---

## O que é List

`List` é uma interface do Java.

Ela define o comportamento esperado de uma lista.

Uma lista:

```text
mantém ordem;
permite elementos repetidos;
permite acessar por índice;
permite adicionar;
permite remover;
permite substituir;
permite consultar tamanho;
permite percorrer.
```

Exemplo:

```java
List<String> codigos = new ArrayList<>();
```

Aqui `List` diz o que a variável sabe fazer.

---

## O que é ArrayList

`ArrayList` é uma implementação da interface `List`.

Ela é baseada internamente em um array redimensionável.

Você não precisa controlar esse array interno.

O `ArrayList` faz isso para você.

Exemplo:

```java
List<String> codigos = new ArrayList<>();

codigos.add("OS-2026-0001");
codigos.add("OS-2026-0002");
```

Você adiciona elementos.

O `ArrayList` cuida da estrutura interna.

---

## Por que não declarar ArrayList direto?

Você até pode escrever:

```java
ArrayList<String> codigos = new ArrayList<>();
```

Mas o mais comum é:

```java
List<String> codigos = new ArrayList<>();
```

Por quê?

Porque o restante do código depende do comportamento de lista, não da implementação específica.

Se amanhã você quiser trocar:

```java
List<String> codigos = new LinkedList<>();
```

o código que usa `List` tende a mudar menos.

Regra prática:

```text
declare pela interface;
instancie pela implementação.
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-148-list-interface-e-arraylist
cd labs\m5\aula-148-list-interface-e-arraylist
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula148
mkdir src\br\com\curso\aula148\app
mkdir src\br\com\curso\aula148\dominio
mkdir src\br\com\curso\aula148\dominio\ordemservico
```

Nesta aula, vamos trabalhar com exemplos pequenos e objetivos.

---

## Primeiro exemplo de List e ArrayList

Crie:

```text
src\br\com\curso\aula148\app\ListArrayListBasicoApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.ArrayList;
import java.util.List;

public class ListArrayListBasicoApp {
    public static void main(String[] args) {
        List<String> clientes = new ArrayList<>();

        clientes.add("Ana Silva");
        clientes.add("Carlos Souza");
        clientes.add("Mariana Lima");

        System.out.println("Quantidade de clientes: " + clientes.size());

        System.out.println();
        System.out.println("Clientes:");

        for (String cliente : clientes) {
            System.out.println("- " + cliente);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ListArrayListBasicoApp
```

---

## O que observar

A lista começou vazia:

```java
List<String> clientes = new ArrayList<>();
```

Depois adicionamos elementos:

```java
clientes.add("Ana Silva");
```

Consultamos a quantidade:

```java
clientes.size();
```

E percorremos:

```java
for (String cliente : clientes)
```

Essa é uma das formas mais comuns de trabalhar com listas.

---

## List mantém ordem

A `List` mantém a ordem dos elementos.

Crie:

```text
src\br\com\curso\aula148\app\ListMantemOrdemApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.ArrayList;
import java.util.List;

public class ListMantemOrdemApp {
    public static void main(String[] args) {
        List<String> codigosOs = new ArrayList<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");
        codigosOs.add("OS-2026-0003");
        codigosOs.add("OS-2026-0004");

        System.out.println("Ordem de inserção preservada:");

        for (String codigo : codigosOs) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ListMantemOrdemApp
```

---

## Comparando com Set

Na aula anterior, você viu que `HashSet` não garante ordem.

Já `List` mantém ordem por posição.

Isso faz `List` ser boa para:

```text
linhas de relatório;
itens de pedido;
atividades de uma OS;
passos de um fluxo;
resultados ordenados;
mensagens em sequência.
```

Quando a ordem importa, `List` costuma ser a primeira candidata.

---

## List aceita repetidos

Crie:

```text
src\br\com\curso\aula148\app\ListAceitaRepetidosApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.ArrayList;
import java.util.List;

public class ListAceitaRepetidosApp {
    public static void main(String[] args) {
        List<String> eventos = new ArrayList<>();

        eventos.add("OS criada");
        eventos.add("Atividade adicionada");
        eventos.add("Atividade adicionada");
        eventos.add("OS reagendada");

        System.out.println("Quantidade de eventos: " + eventos.size());

        System.out.println();
        System.out.println("Eventos:");

        for (String evento : eventos) {
            System.out.println("- " + evento);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ListAceitaRepetidosApp
```

---

## Por que List aceita repetidos

Uma lista representa sequência.

Em uma sequência, valores repetidos podem fazer sentido.

Exemplo:

```text
atividade adicionada;
atividade adicionada;
atividade adicionada.
```

Em histórico, repetições podem ser válidas.

Em itens de pedido, poderia haver o mesmo produto repetido se o domínio permitir.

Se você quer evitar duplicidade, talvez `Set` seja melhor, ou talvez a entidade precise validar antes de adicionar.

---

## Acesso por índice

`List` permite acessar por posição.

Crie:

```text
src\br\com\curso\aula148\app\ListAcessoPorIndiceApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.ArrayList;
import java.util.List;

public class ListAcessoPorIndiceApp {
    public static void main(String[] args) {
        List<String> codigosOs = new ArrayList<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");
        codigosOs.add("OS-2026-0003");

        System.out.println("Posição 0: " + codigosOs.get(0));
        System.out.println("Posição 1: " + codigosOs.get(1));
        System.out.println("Posição 2: " + codigosOs.get(2));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ListAcessoPorIndiceApp
```

---

## Índice começa em zero

Assim como array, `List` começa na posição zero.

Se a lista tem 3 elementos:

```text
posição 0;
posição 1;
posição 2.
```

Não existe posição 3.

Se você tentar:

```java
codigosOs.get(3);
```

vai dar erro.

---

## Erro de índice inválido

Crie:

```text
src\br\com\curso\aula148\app\ListIndiceInvalidoApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.ArrayList;
import java.util.List;

public class ListIndiceInvalidoApp {
    public static void main(String[] args) {
        List<String> codigosOs = new ArrayList<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");

        System.out.println("Quantidade: " + codigosOs.size());

        try {
            System.out.println(codigosOs.get(5));
        } catch (IndexOutOfBoundsException erro) {
            System.out.println("Erro ao acessar posição inválida: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ListIndiceInvalidoApp
```

---

## Como evitar erro de índice

Antes de acessar por índice, verifique se a posição existe.

Exemplo:

```java
if (!lista.isEmpty()) {
    System.out.println(lista.get(0));
}
```

Ou:

```java
if (indice >= 0 && indice < lista.size()) {
    System.out.println(lista.get(indice));
}
```

Em muitos cenários, você nem precisa usar índice.

Pode usar:

```java
for (String item : lista)
```

Isso evita muitos erros.

---

## set — substituindo elemento

O método `set` substitui um elemento em uma posição existente.

Crie:

```text
src\br\com\curso\aula148\app\ListSetApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.ArrayList;
import java.util.List;

public class ListSetApp {
    public static void main(String[] args) {
        List<String> statusHistorico = new ArrayList<>();

        statusHistorico.add("CRIADA");
        statusHistorico.add("AGENDADA");
        statusHistorico.add("CONCLUIDA");

        System.out.println("Antes:");
        imprimir(statusHistorico);

        statusHistorico.set(1, "REAGENDADA");

        System.out.println();
        System.out.println("Depois:");
        imprimir(statusHistorico);
    }

    private static void imprimir(List<String> itens) {
        for (String item : itens) {
            System.out.println("- " + item);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ListSetApp
```

---

## Cuidado com set

`set` não adiciona uma nova posição.

Ele substitui uma posição existente.

Se a lista tem 3 elementos, você pode fazer:

```java
lista.set(0, valor);
lista.set(1, valor);
lista.set(2, valor);
```

Mas não pode fazer:

```java
lista.set(3, valor);
```

porque a posição 3 não existe.

Para adicionar, use:

```java
add(...)
```

---

## add em posição específica

Você também pode inserir em uma posição específica.

Crie:

```text
src\br\com\curso\aula148\app\ListAddComIndiceApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.ArrayList;
import java.util.List;

public class ListAddComIndiceApp {
    public static void main(String[] args) {
        List<String> etapas = new ArrayList<>();

        etapas.add("Criar OS");
        etapas.add("Concluir OS");

        System.out.println("Antes:");
        imprimir(etapas);

        etapas.add(1, "Adicionar atividade");

        System.out.println();
        System.out.println("Depois:");
        imprimir(etapas);
    }

    private static void imprimir(List<String> itens) {
        for (String item : itens) {
            System.out.println("- " + item);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ListAddComIndiceApp
```

---

## O que add com índice faz

Antes:

```text
0 - Criar OS
1 - Concluir OS
```

Depois:

```text
0 - Criar OS
1 - Adicionar atividade
2 - Concluir OS
```

O elemento antigo da posição 1 foi deslocado para frente.

Esse comportamento é útil, mas deve ser usado com cuidado em listas grandes.

---

## Remoção por índice e por objeto

Existem duas formas comuns de remover.

Por objeto:

```java
lista.remove("OS-2026-0001");
```

Por índice:

```java
lista.remove(0);
```

Crie:

```text
src\br\com\curso\aula148\app\ListRemoveIndiceEObjetoApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.ArrayList;
import java.util.List;

public class ListRemoveIndiceEObjetoApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0003");

        System.out.println("Lista inicial:");
        imprimir(codigos);

        String removidoPorIndice = codigos.remove(0);

        System.out.println();
        System.out.println("Removido por índice: " + removidoPorIndice);
        imprimir(codigos);

        boolean removidoPorObjeto = codigos.remove("OS-2026-0003");

        System.out.println();
        System.out.println("Removeu por objeto? " + removidoPorObjeto);
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
java -cp out br.com.curso.aula148.app.ListRemoveIndiceEObjetoApp
```

---

## Diferença entre remove por índice e por objeto

Remover por índice:

```java
String removido = lista.remove(0);
```

Remove a posição e retorna o elemento removido.

Remover por objeto:

```java
boolean removido = lista.remove("OS-2026-0003");
```

Remove o objeto e retorna se conseguiu remover.

Cuidado especial:

```java
List<Integer> numeros = new ArrayList<>();
```

Com `Integer`, pode haver confusão entre remover índice e remover objeto.

Esse caso será estudado com mais calma depois.

---

## contains

O método `contains` verifica se a lista contém um elemento.

Crie:

```text
src\br\com\curso\aula148\app\ListContainsApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.ArrayList;
import java.util.List;

public class ListContainsApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");

        System.out.println("Contém OS-2026-0001? " + codigos.contains("OS-2026-0001"));
        System.out.println("Contém OS-2026-9999? " + codigos.contains("OS-2026-9999"));
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ListContainsApp
```

---

## contains com objetos

Com objetos, `contains` depende de `equals`.

Nesta aula, vamos apenas sinalizar.

Exemplo:

```java
lista.contains(objeto);
```

O Java precisa saber como comparar aquele objeto.

Para `String`, isso já funciona bem.

Para objetos criados por você, pode ser necessário implementar `equals` e `hashCode`.

Vamos aprofundar isso quando estudarmos `Set` e objetos.

---

## isEmpty

`isEmpty` verifica se a lista está vazia.

Crie:

```text
src\br\com\curso\aula148\app\ListIsEmptyApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.ArrayList;
import java.util.List;

public class ListIsEmptyApp {
    public static void main(String[] args) {
        List<String> mensagens = new ArrayList<>();

        if (mensagens.isEmpty()) {
            System.out.println("Nenhuma mensagem cadastrada.");
        }

        mensagens.add("OS criada com sucesso.");

        if (!mensagens.isEmpty()) {
            System.out.println("Mensagens:");
            for (String mensagem : mensagens) {
                System.out.println("- " + mensagem);
            }
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ListIsEmptyApp
```

---

## Por que usar isEmpty

Prefira:

```java
if (lista.isEmpty()) {
    ...
}
```

em vez de:

```java
if (lista.size() == 0) {
    ...
}
```

Ambos funcionam.

Mas `isEmpty()` expressa melhor a intenção.

Lembre:

```text
código bom comunica intenção.
```

---

## Criando domínio para List com objetos

Agora vamos trabalhar com objetos.

Crie:

```text
src\br\com\curso\aula148\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula148.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula148\dominio\ordemservico\ResumoOrdemServico.java
```

Código:

```java
package br.com.curso.aula148.dominio.ordemservico;

import java.time.LocalDate;

public class ResumoOrdemServico {
    private final String codigo;
    private final String cliente;
    private final LocalDate dataAtendimento;
    private final StatusOs status;

    public ResumoOrdemServico(
            String codigo,
            String cliente,
            LocalDate dataAtendimento,
            StatusOs status
    ) {
        if (codigo == null || codigo.isBlank()) {
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

    public String codigo() {
        return codigo;
    }

    public boolean possuiStatus(StatusOs status) {
        return this.status == status;
    }

    public String resumo() {
        return codigo
                + " | Cliente: " + cliente
                + " | Data: " + dataAtendimento
                + " | Status: " + status;
    }
}
```

---

## List com objetos de domínio

Crie:

```text
src\br\com\curso\aula148\app\ListObjetosDominioApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import br.com.curso.aula148.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula148.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ListObjetosDominioApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = new ArrayList<>();

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        ));

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CONCLUIDA
        ));

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0003",
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.REAGENDADA
        ));

        System.out.println("Todas as OS:");

        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }

        System.out.println();
        System.out.println("Somente agendadas:");

        for (ResumoOrdemServico os : ordens) {
            if (os.possuiStatus(StatusOs.AGENDADA)) {
                System.out.println("- " + os.resumo());
            }
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ListObjetosDominioApp
```

---

## O que observar

A lista guarda objetos do domínio:

```java
List<ResumoOrdemServico>
```

Isso é muito comum em backend.

Você pode percorrer, filtrar, contar e transformar dados.

Mais adiante, faremos isso também com `Stream`.

Por enquanto, o `for` já resolve.

---

## Método recebendo List

Uma prática comum é criar métodos que recebem uma `List`.

Crie:

```text
src\br\com\curso\aula148\app\MetodoRecebendoListApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import br.com.curso.aula148.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula148.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class MetodoRecebendoListApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = new ArrayList<>();

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        ));

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CONCLUIDA
        ));

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0003",
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.CONCLUIDA
        ));

        imprimirRelatorio(ordens);
    }

    private static void imprimirRelatorio(List<ResumoOrdemServico> ordens) {
        int total = ordens.size();
        int concluidas = contarPorStatus(ordens, StatusOs.CONCLUIDA);
        int agendadas = contarPorStatus(ordens, StatusOs.AGENDADA);

        System.out.println("Relatório:");
        System.out.println("Total: " + total);
        System.out.println("Agendadas: " + agendadas);
        System.out.println("Concluídas: " + concluidas);
    }

    private static int contarPorStatus(List<ResumoOrdemServico> ordens, StatusOs status) {
        int total = 0;

        for (ResumoOrdemServico os : ordens) {
            if (os.possuiStatus(status)) {
                total++;
            }
        }

        return total;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.MetodoRecebendoListApp
```

---

## Por que receber List e não ArrayList

Repare:

```java
private static void imprimirRelatorio(List<ResumoOrdemServico> ordens)
```

O método recebe `List`, não `ArrayList`.

Isso deixa o método mais flexível.

Ele aceita qualquer implementação de `List`.

Exemplo:

```text
ArrayList;
LinkedList;
lista retornada por outro método;
lista criada por framework.
```

Esse é o mesmo princípio:

```text
programar contra a interface.
```

---

## Método retornando List

Agora veja um método que retorna lista.

Crie:

```text
src\br\com\curso\aula148\app\MetodoRetornandoListApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import br.com.curso.aula148.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula148.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class MetodoRetornandoListApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = criarOrdensExemplo();

        System.out.println("OS criadas pelo método:");

        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }

    private static List<ResumoOrdemServico> criarOrdensExemplo() {
        List<ResumoOrdemServico> ordens = new ArrayList<>();

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        ));

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CANCELADA
        ));

        return ordens;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.MetodoRetornandoListApp
```

---

## Cuidado ao retornar List

Retornar lista pode ser correto.

Mas depende do contexto.

Se a lista é local de um método:

```java
return ordens;
```

sem problema.

Mas se a lista é interna de uma entidade, como no Módulo 4:

```java
private final List<AtividadeOs> atividades;
```

não retorne a lista original diretamente.

Prefira:

```java
return List.copyOf(atividades);
```

Essa diferença é importante.

```text
lista local pode ser retornada;
lista interna de domínio precisa de proteção.
```

---

## List.of

Java possui uma forma simples de criar listas pequenas:

```java
List<String> nomes = List.of("Ana", "Carlos", "Mariana");
```

Crie:

```text
src\br\com\curso\aula148\app\ListOfApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.List;

public class ListOfApp {
    public static void main(String[] args) {
        List<String> prioridades = List.of("NORMAL", "ALTA", "CRITICA");

        System.out.println("Prioridades:");

        for (String prioridade : prioridades) {
            System.out.println("- " + prioridade);
        }

        try {
            prioridades.add("URGENTE");
        } catch (UnsupportedOperationException erro) {
            System.out.println();
            System.out.println("Não é possível adicionar em lista criada com List.of.");
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ListOfApp
```

---

## Cuidado com List.of

`List.of` cria uma lista imutável.

Você não consegue:

```java
add;
remove;
set.
```

Isso é bom quando você quer uma lista fixa.

Mas se você precisa alterar, use:

```java
List<String> nomes = new ArrayList<>();
```

Ou crie uma `ArrayList` a partir dela:

```java
List<String> nomes = new ArrayList<>(List.of("Ana", "Carlos"));
```

---

## Criando ArrayList a partir de List.of

Crie:

```text
src\br\com\curso\aula148\app\ArrayListAPartirDeListOfApp.java
```

Código:

```java
package br.com.curso.aula148.app;

import java.util.ArrayList;
import java.util.List;

public class ArrayListAPartirDeListOfApp {
    public static void main(String[] args) {
        List<String> prioridades = new ArrayList<>(List.of("NORMAL", "ALTA", "CRITICA"));

        prioridades.add("URGENTE");
        prioridades.remove("NORMAL");

        System.out.println("Prioridades mutáveis:");

        for (String prioridade : prioridades) {
            System.out.println("- " + prioridade);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula148.app.ArrayListAPartirDeListOfApp
```

---

## Capacidade interna não é size

`ArrayList` tem uma capacidade interna, mas normalmente você não se preocupa com isso.

O que você usa é:

```java
lista.size()
```

`size()` retorna a quantidade real de elementos.

Não tente programar pensando na capacidade interna do `ArrayList` agora.

Para o uso comum de backend, pense:

```text
ArrayList cresce conforme necessário.
size mostra a quantidade real.
```

Performance e capacidade serão discutidas mais adiante.

---

## Quando usar ArrayList

Use `ArrayList` quando:

```text
precisa de uma lista geral;
quer manter ordem;
vai percorrer elementos;
vai acessar por índice;
vai adicionar no final com frequência;
não precisa remover muitos elementos do começo da lista.
```

É a implementação padrão mais comum de `List`.

Em muitos casos, se você está em dúvida entre listas, `ArrayList` é a primeira opção.

---

## Quando ter cuidado com ArrayList

Tenha cuidado quando:

```text
você remove muitos elementos do início ou do meio;
você insere muitos elementos no início;
você precisa de fila;
você precisa garantir unicidade;
você precisa buscar por chave.
```

Nesses casos, talvez outra estrutura seja melhor:

```text
LinkedList;
Queue;
Set;
Map.
```

Vamos estudar essas estruturas aos poucos.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Rodar exemplos básicos

Execute:

```powershell
java -cp out br.com.curso.aula148.app.ListArrayListBasicoApp
java -cp out br.com.curso.aula148.app.ListMantemOrdemApp
java -cp out br.com.curso.aula148.app.ListAceitaRepetidosApp
```

### Parte 2 — Rodar exemplos de índice

Execute:

```powershell
java -cp out br.com.curso.aula148.app.ListAcessoPorIndiceApp
java -cp out br.com.curso.aula148.app.ListIndiceInvalidoApp
java -cp out br.com.curso.aula148.app.ListSetApp
java -cp out br.com.curso.aula148.app.ListAddComIndiceApp
```

### Parte 3 — Rodar exemplos de remoção e busca

Execute:

```powershell
java -cp out br.com.curso.aula148.app.ListRemoveIndiceEObjetoApp
java -cp out br.com.curso.aula148.app.ListContainsApp
java -cp out br.com.curso.aula148.app.ListIsEmptyApp
```

### Parte 4 — Rodar exemplos com objetos

Execute:

```powershell
java -cp out br.com.curso.aula148.app.ListObjetosDominioApp
java -cp out br.com.curso.aula148.app.MetodoRecebendoListApp
java -cp out br.com.curso.aula148.app.MetodoRetornandoListApp
```

### Parte 5 — Rodar List.of

Execute:

```powershell
java -cp out br.com.curso.aula148.app.ListOfApp
java -cp out br.com.curso.aula148.app.ArrayListAPartirDeListOfApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula148\app\CadastroOsComListApp.java
```

Ele deve:

```text
criar uma List<String> de códigos de OS;
adicionar 5 códigos;
exibir a quantidade;
exibir todos os códigos;
substituir o segundo código usando set;
remover o último código por índice;
verificar se um código específico existe usando contains;
exibir a lista final.
```

Critério principal:

```text
usar add, set, remove, contains, size e for.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula148\app\RelatorioOsComMetodosListApp.java
```

Ele deve:

```text
criar um método criarOrdens();
esse método retorna List<ResumoOrdemServico>;
criar um método imprimirTodas(List<ResumoOrdemServico> ordens);
criar um método contarPorStatus(List<ResumoOrdemServico> ordens, StatusOs status);
no main, chamar esses métodos;
exibir total por status.
```

Critério principal:

```text
passar List como parâmetro e retornar List com clareza.
```

---

## Erros comuns nesta aula

### 1. Esquecer import

Use:

```java
import java.util.List;
import java.util.ArrayList;
```

### 2. Declarar sem generics

Evite:

```java
List lista = new ArrayList();
```

Prefira:

```java
List<String> lista = new ArrayList<>();
```

### 3. Confundir set com add

`set` substitui.

`add` adiciona.

### 4. Acessar índice inválido

Verifique:

```java
indice >= 0 && indice < lista.size()
```

### 5. Confundir remove por índice e remove por objeto

```java
remove(0)
remove("OS-2026-0001")
```

são coisas diferentes.

### 6. Tentar alterar List.of

`List.of` cria lista imutável.

### 7. Retornar lista interna do domínio sem proteção

Em entidades, use cópia defensiva quando necessário.

### 8. Declarar ArrayList em método que só precisa de List

Prefira parâmetro como:

```java
List<ResumoOrdemServico> ordens
```

---

## Debug recomendado

Use debug em:

```text
ListArrayListBasicoApp.java
ListAcessoPorIndiceApp.java
ListSetApp.java
ListAddComIndiceApp.java
ListRemoveIndiceEObjetoApp.java
MetodoRecebendoListApp.java
ListOfApp.java
```

Breakpoints recomendados:

```java
clientes.add(...)
clientes.size()

codigosOs.get(...)
statusHistorico.set(...)
etapas.add(1, ...)

codigos.remove(0)
codigos.remove("OS-2026-0003")

imprimirRelatorio(...)
contarPorStatus(...)

prioridades.add("URGENTE")
```

Observe:

```text
como a lista cresce;
como os índices mudam;
como set substitui;
como add com índice desloca;
como remove por índice retorna objeto;
como remove por objeto retorna boolean;
como List.of bloqueia alteração.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Qual a diferença entre List e ArrayList?
2. Por que normalmente declaramos List e instanciamos ArrayList?
3. Qual a diferença entre add e set?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
criar List com ArrayList;
explicar interface e implementação;
usar add;
usar get;
usar set;
usar remove por índice;
usar remove por objeto;
usar contains;
usar size;
usar isEmpty;
entender índice começando em zero;
evitar IndexOutOfBoundsException;
usar List com objetos de domínio;
passar List como parâmetro;
retornar List;
entender List.of;
criar ArrayList mutável a partir de List.of;
resolver CadastroOsComListApp;
resolver RelatorioOsComMetodosListApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-148-list-interface-e-arraylist
git commit -m "Aula 148: list interface e arraylist"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
List define o comportamento de uma lista, e ArrayList é a implementação mais comum para trabalhar com sequências de objetos em Java.
```

Você viu que `List` mantém ordem, aceita repetidos, usa índice, permite adicionar, substituir, remover e consultar elementos.

Na próxima aula, vamos aprofundar operações CRUD com `ArrayList`.

Vamos criar um cadastro em memória usando lista, com inclusão, consulta, atualização e remoção de objetos.
