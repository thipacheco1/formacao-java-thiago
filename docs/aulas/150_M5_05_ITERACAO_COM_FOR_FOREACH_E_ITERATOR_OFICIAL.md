# 150 — M5.05 — Iteração com for, foreach e Iterator

## Objetivo da aula

Nesta aula você vai aprofundar um ponto essencial para trabalhar com coleções:

```text
iteração.
```

Iterar significa percorrer os elementos de uma coleção.

Na aula anterior, você criou um CRUD em memória usando `ArrayList`. Para listar, buscar, contar e remover, você precisou percorrer listas.

Agora vamos estudar as principais formas de percorrer uma `List`:

```text
for tradicional;
foreach;
Iterator.
```

Ao final da aula, você deve conseguir:

```text
explicar o que é iterar;
usar for tradicional com índice;
usar foreach;
usar Iterator;
entender quando usar cada forma;
entender vantagens e riscos de cada abordagem;
evitar remoção errada durante iteração;
percorrer listas de String;
percorrer listas de objetos;
buscar objetos durante iteração;
contar objetos durante iteração;
remover com Iterator de forma segura;
aplicar iteração em cenários de backend.
```

Esta aula prepara o caminho para a próxima, onde vamos aprofundar remoção segura em listas.

---

## Ideia principal

Quando você tem uma lista:

```java
List<String> codigos = new ArrayList<>();
```

você normalmente precisa percorrer seus elementos.

Exemplos:

```text
imprimir todos;
buscar um item;
contar por status;
filtrar;
validar duplicidade;
montar relatório;
remover algum elemento;
atualizar um objeto encontrado.
```

Para isso, existem várias formas.

As três principais nesta aula são:

```text
for tradicional;
foreach;
Iterator.
```

Cada uma tem seu uso.

---

## O que é iterar

Iterar é passar elemento por elemento.

Exemplo mental:

```text
lista:
OS-2026-0001
OS-2026-0002
OS-2026-0003

iteração:
pega OS-2026-0001
depois pega OS-2026-0002
depois pega OS-2026-0003
termina
```

Em código, isso pode ser feito com:

```java
for
```

ou:

```java
for-each
```

ou:

```java
Iterator
```

---

## Criando a estrutura da aula

Crie a pasta:

```powershell
mkdir labs\m5\aula-150-iteracao-com-for-foreach-e-iterator
cd labs\m5\aula-150-iteracao-com-for-foreach-e-iterator
```

Crie a estrutura:

```powershell
mkdir src
mkdir src\br
mkdir src\br\com
mkdir src\br\com\curso
mkdir src\br\com\curso\aula150
mkdir src\br\com\curso\aula150\app
mkdir src\br\com\curso\aula150\dominio
mkdir src\br\com\curso\aula150\dominio\ordemservico
```

Nesta aula teremos exemplos simples e exemplos com objetos.

---

## Primeiro exemplo: for tradicional

Crie:

```text
src\br\com\curso\aula150\app\ForTradicionalApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import java.util.ArrayList;
import java.util.List;

public class ForTradicionalApp {
    public static void main(String[] args) {
        List<String> codigosOs = new ArrayList<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");
        codigosOs.add("OS-2026-0003");

        for (int i = 0; i < codigosOs.size(); i++) {
            String codigo = codigosOs.get(i);
            System.out.println("posição " + i + ": " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.ForTradicionalApp
```

---

## Como ler o for tradicional

Este trecho:

```java
for (int i = 0; i < codigosOs.size(); i++) {
    ...
}
```

significa:

```text
comece com i igual a 0;
continue enquanto i for menor que o tamanho da lista;
ao final de cada volta, some 1 no i.
```

Dentro do laço:

```java
String codigo = codigosOs.get(i);
```

pegamos o elemento na posição atual.

---

## Quando usar for tradicional

Use `for` tradicional quando você precisa do índice.

Exemplos:

```text
exibir posição;
comparar item atual com o próximo;
percorrer de trás para frente;
atualizar elemento por índice;
trabalhar com posição específica;
fazer lógica baseada em número da linha.
```

Exemplo:

```java
System.out.println("Item " + (i + 1) + ": " + codigo);
```

Aqui o índice é útil.

---

## Cuidado com índice

No `for` tradicional, você controla o índice manualmente.

Se errar, pode causar:

```text
IndexOutOfBoundsException.
```

Exemplo errado:

```java
for (int i = 0; i <= codigosOs.size(); i++) {
    System.out.println(codigosOs.get(i));
}
```

O correto é:

```java
i < codigosOs.size()
```

e não:

```java
i <= codigosOs.size()
```

Porque a última posição é:

```text
size - 1
```

---

## Exemplo de erro com índice

Crie:

```text
src\br\com\curso\aula150\app\ForErroIndiceApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import java.util.ArrayList;
import java.util.List;

public class ForErroIndiceApp {
    public static void main(String[] args) {
        List<String> codigosOs = new ArrayList<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");

        try {
            for (int i = 0; i <= codigosOs.size(); i++) {
                System.out.println(codigosOs.get(i));
            }
        } catch (IndexOutOfBoundsException erro) {
            System.out.println("Erro de índice: " + erro.getMessage());
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.ForErroIndiceApp
```

---

## O que observar

A lista tem 2 elementos.

As posições válidas são:

```text
0;
1.
```

Mas o `for` com `<=` tenta acessar posição 2.

Isso causa erro.

Esse é um erro comum.

Regra prática:

```text
para percorrer do começo ao fim com índice:
i começa em 0;
condição é i < lista.size();
```

---

## foreach

O `foreach` é uma forma mais simples de percorrer todos os elementos.

Crie:

```text
src\br\com\curso\aula150\app\ForeachApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import java.util.ArrayList;
import java.util.List;

public class ForeachApp {
    public static void main(String[] args) {
        List<String> codigosOs = new ArrayList<>();

        codigosOs.add("OS-2026-0001");
        codigosOs.add("OS-2026-0002");
        codigosOs.add("OS-2026-0003");

        for (String codigo : codigosOs) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.ForeachApp
```

---

## Como ler o foreach

Este trecho:

```java
for (String codigo : codigosOs) {
    ...
}
```

significa:

```text
para cada String codigo dentro de codigosOs,
execute o bloco.
```

É mais simples que o `for` tradicional quando você não precisa do índice.

---

## Quando usar foreach

Use `foreach` quando:

```text
você quer percorrer todos os elementos;
não precisa do índice;
não vai remover elementos da lista durante a iteração;
quer código mais legível;
quer imprimir, contar ou validar.
```

Exemplo:

```java
for (OrdemServico os : ordens) {
    System.out.println(os.resumo());
}
```

Esse é um dos formatos mais usados em código Java.

---

## Diferença entre for e foreach

`for` tradicional:

```java
for (int i = 0; i < lista.size(); i++) {
    String item = lista.get(i);
}
```

`foreach`:

```java
for (String item : lista) {
}
```

Use `for` quando precisa da posição.

Use `foreach` quando só precisa do elemento.

---

## Domínio simples para exemplos

Agora vamos usar objetos.

Crie:

```text
src\br\com\curso\aula150\dominio\ordemservico\StatusOs.java
```

Código:

```java
package br.com.curso.aula150.dominio.ordemservico;

public enum StatusOs {
    AGENDADA,
    REAGENDADA,
    CONCLUIDA,
    CANCELADA
}
```

Crie:

```text
src\br\com\curso\aula150\dominio\ordemservico\ResumoOrdemServico.java
```

Código:

```java
package br.com.curso.aula150.dominio.ordemservico;

import java.time.LocalDate;

public class ResumoOrdemServico {
    private final String codigo;
    private final String cliente;
    private final LocalDate dataAtendimento;
    private StatusOs status;

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

    public boolean possuiCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            return false;
        }

        return this.codigo.equals(codigo);
    }

    public boolean possuiStatus(StatusOs status) {
        return this.status == status;
    }

    public void reagendar() {
        if (status == StatusOs.CONCLUIDA || status == StatusOs.CANCELADA) {
            throw new IllegalStateException("OS encerrada não pode ser reagendada.");
        }

        status = StatusOs.REAGENDADA;
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

## List com objetos e foreach

Crie:

```text
src\br\com\curso\aula150\app\ForeachComObjetosApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import br.com.curso.aula150.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula150.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ForeachComObjetosApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = criarOrdens();

        System.out.println("Ordens cadastradas:");

        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }

    private static List<ResumoOrdemServico> criarOrdens() {
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

        return ordens;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.ForeachComObjetosApp
```

---

## Contagem com foreach

Crie:

```text
src\br\com\curso\aula150\app\ForeachContagemPorStatusApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import br.com.curso.aula150.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula150.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ForeachContagemPorStatusApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = criarOrdens();

        int agendadas = contarPorStatus(ordens, StatusOs.AGENDADA);
        int concluidas = contarPorStatus(ordens, StatusOs.CONCLUIDA);
        int canceladas = contarPorStatus(ordens, StatusOs.CANCELADA);
        int reagendadas = contarPorStatus(ordens, StatusOs.REAGENDADA);

        System.out.println("Relatório:");
        System.out.println("Agendadas: " + agendadas);
        System.out.println("Reagendadas: " + reagendadas);
        System.out.println("Concluídas: " + concluidas);
        System.out.println("Canceladas: " + canceladas);
        System.out.println("Total: " + ordens.size());
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

    private static List<ResumoOrdemServico> criarOrdens() {
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
                StatusOs.CANCELADA
        ));

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0004",
                "Bruno Rocha",
                LocalDate.of(2026, 12, 13),
                StatusOs.REAGENDADA
        ));

        return ordens;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.ForeachContagemPorStatusApp
```

---

## Busca com foreach

Crie:

```text
src\br\com\curso\aula150\app\ForeachBuscaApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import br.com.curso.aula150.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula150.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ForeachBuscaApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = criarOrdens();

        buscarEImprimir(ordens, "OS-2026-0002");
        buscarEImprimir(ordens, "OS-2026-9999");
    }

    private static void buscarEImprimir(List<ResumoOrdemServico> ordens, String codigo) {
        ResumoOrdemServico encontrada = buscarPorCodigo(ordens, codigo);

        if (encontrada == null) {
            System.out.println("OS não encontrada: " + codigo);
            return;
        }

        System.out.println("OS encontrada: " + encontrada.resumo());
    }

    private static ResumoOrdemServico buscarPorCodigo(List<ResumoOrdemServico> ordens, String codigo) {
        for (ResumoOrdemServico os : ordens) {
            if (os.possuiCodigo(codigo)) {
                return os;
            }
        }

        return null;
    }

    private static List<ResumoOrdemServico> criarOrdens() {
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

        return ordens;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.ForeachBuscaApp
```

---

## O que observar na busca

Quando encontramos a OS, retornamos imediatamente:

```java
return os;
```

Se termina o laço e não encontra, retornamos:

```java
return null;
```

Essa é uma busca linear.

Para cada item, verificamos:

```java
os.possuiCodigo(codigo)
```

Isso é comum quando se usa `List`.

Mais adiante, veremos que `Map` pode ser melhor para busca por chave.

---

## Atualização com foreach

Se a lista guarda objetos mutáveis, você pode buscar um objeto e chamar um método nele.

Crie:

```text
src\br\com\curso\aula150\app\ForeachAtualizacaoApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import br.com.curso.aula150.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula150.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ForeachAtualizacaoApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = criarOrdens();

        reagendar(ordens, "OS-2026-0001");

        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }

    private static void reagendar(List<ResumoOrdemServico> ordens, String codigo) {
        for (ResumoOrdemServico os : ordens) {
            if (os.possuiCodigo(codigo)) {
                os.reagendar();
                return;
            }
        }

        throw new IllegalArgumentException("OS não encontrada: " + codigo);
    }

    private static List<ResumoOrdemServico> criarOrdens() {
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

        return ordens;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.ForeachAtualizacaoApp
```

---

## O que observar na atualização

A lista guarda referências para objetos.

Quando encontramos a OS:

```java
os.reagendar();
```

alteramos o próprio objeto dentro da lista.

Não precisamos fazer:

```java
lista.set(...)
```

nesse caso, porque não estamos substituindo o objeto.

Estamos chamando comportamento no objeto encontrado.

Isso reforça o que já estudamos:

```text
lista armazena;
objeto protege regra.
```

---

## Iterator

Agora vamos conhecer o `Iterator`.

`Iterator` é um objeto usado para percorrer uma coleção.

Com ele, você pergunta:

```text
tem próximo?
pegue o próximo.
```

Crie:

```text
src\br\com\curso\aula150\app\IteratorBasicoApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class IteratorBasicoApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0003");

        Iterator<String> iterator = codigos.iterator();

        while (iterator.hasNext()) {
            String codigo = iterator.next();
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.IteratorBasicoApp
```

---

## Como ler o Iterator

Este trecho:

```java
Iterator<String> iterator = codigos.iterator();
```

cria um iterador da lista.

Este trecho:

```java
while (iterator.hasNext()) {
    String codigo = iterator.next();
}
```

significa:

```text
enquanto existir próximo elemento,
pegue o próximo elemento.
```

`hasNext()` pergunta se há próximo.

`next()` pega o próximo.

---

## Quando usar Iterator

Use `Iterator` principalmente quando você precisa remover elementos durante a iteração de forma segura.

Exemplo:

```java
Iterator<String> iterator = codigos.iterator();

while (iterator.hasNext()) {
    String codigo = iterator.next();

    if (codigo.equals("OS-2026-0002")) {
        iterator.remove();
    }
}
```

Isso será muito importante.

---

## Remoção errada com foreach

Crie:

```text
src\br\com\curso\aula150\app\RemocaoErradaForeachApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import java.util.ArrayList;
import java.util.List;

public class RemocaoErradaForeachApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0003");

        try {
            for (String codigo : codigos) {
                if (codigo.equals("OS-2026-0002")) {
                    codigos.remove(codigo);
                }
            }
        } catch (RuntimeException erro) {
            System.out.println("Erro ao remover durante foreach: " + erro.getClass().getSimpleName());
        }

        System.out.println();
        System.out.println("Lista final:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.RemocaoErradaForeachApp
```

---

## Por que isso dá problema

O `foreach` usa um mecanismo interno de iteração.

Quando você remove diretamente da lista enquanto o `foreach` está percorrendo, a lista muda debaixo dos pés do iterador.

Isso pode causar:

```text
ConcurrentModificationException
```

Essa exceção será aprofundada na próxima aula.

Por enquanto, guarde:

```text
não remova diretamente de uma List dentro de foreach.
```

---

## Remoção correta com Iterator

Crie:

```text
src\br\com\curso\aula150\app\RemocaoComIteratorApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class RemocaoComIteratorApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");
        codigos.add("OS-2026-0002");
        codigos.add("OS-2026-0003");

        Iterator<String> iterator = codigos.iterator();

        while (iterator.hasNext()) {
            String codigo = iterator.next();

            if (codigo.equals("OS-2026-0002")) {
                iterator.remove();
            }
        }

        System.out.println("Lista final:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.RemocaoComIteratorApp
```

---

## Por que Iterator remove corretamente

Quando você usa:

```java
iterator.remove();
```

a remoção acontece pelo próprio iterador.

Ele sabe qual elemento acabou de entregar com `next()`.

Assim, a estrutura da lista e o processo de iteração continuam coerentes.

Essa é uma forma segura de remover durante a iteração.

---

## Removendo objetos por status com Iterator

Crie:

```text
src\br\com\curso\aula150\app\IteratorRemoverPorStatusApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import br.com.curso.aula150.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula150.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class IteratorRemoverPorStatusApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = criarOrdens();

        System.out.println("Antes:");
        imprimir(ordens);

        removerCanceladas(ordens);

        System.out.println();
        System.out.println("Depois de remover canceladas:");
        imprimir(ordens);
    }

    private static void removerCanceladas(List<ResumoOrdemServico> ordens) {
        Iterator<ResumoOrdemServico> iterator = ordens.iterator();

        while (iterator.hasNext()) {
            ResumoOrdemServico os = iterator.next();

            if (os.possuiStatus(StatusOs.CANCELADA)) {
                iterator.remove();
            }
        }
    }

    private static void imprimir(List<ResumoOrdemServico> ordens) {
        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }

    private static List<ResumoOrdemServico> criarOrdens() {
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

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0003",
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.CANCELADA
        ));

        ordens.add(new ResumoOrdemServico(
                "OS-2026-0004",
                "Bruno Rocha",
                LocalDate.of(2026, 12, 13),
                StatusOs.CONCLUIDA
        ));

        return ordens;
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.IteratorRemoverPorStatusApp
```

---

## Escolhendo a forma de iteração

Use este guia:

```text
Precisa do índice?
Use for tradicional.

Só precisa percorrer todos os elementos?
Use foreach.

Precisa remover durante a iteração?
Use Iterator.

Precisa transformar, filtrar ou agrupar de forma mais declarativa?
No futuro, use Stream.
```

Por enquanto, domine `for`, `foreach` e `Iterator`.

---

## for tradicional de trás para frente

Existe outra forma segura de remover com índice: percorrer de trás para frente.

Crie:

```text
src\br\com\curso\aula150\app\RemocaoDeTrasParaFrenteApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import java.util.ArrayList;
import java.util.List;

public class RemocaoDeTrasParaFrenteApp {
    public static void main(String[] args) {
        List<String> codigos = new ArrayList<>();

        codigos.add("OS-2026-0001");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0002");
        codigos.add("REMOVER");
        codigos.add("OS-2026-0003");

        for (int i = codigos.size() - 1; i >= 0; i--) {
            if (codigos.get(i).equals("REMOVER")) {
                codigos.remove(i);
            }
        }

        System.out.println("Lista final:");

        for (String codigo : codigos) {
            System.out.println("- " + codigo);
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.RemocaoDeTrasParaFrenteApp
```

---

## Por que de trás para frente funciona

Quando removemos de trás para frente, os índices dos elementos que ainda vamos percorrer não são afetados da mesma forma.

Exemplo:

```text
0 A
1 REMOVER
2 B
3 REMOVER
4 C
```

Se você começa do fim, remove a posição 3, depois continua para 2, 1, 0.

Isso evita pular elementos.

Mesmo assim, para remoção durante iteração, `Iterator` é uma opção mais explícita e segura.

---

## Não confundir atualização com remoção

Atualizar objeto durante `foreach` normalmente pode ser feito, desde que você não altere estruturalmente a lista.

Exemplo permitido:

```java
for (ResumoOrdemServico os : ordens) {
    if (os.possuiCodigo("OS-2026-0001")) {
        os.reagendar();
    }
}
```

Aqui você alterou o objeto.

Não removeu da lista.

O problema é alterar a estrutura da lista enquanto o `foreach` percorre:

```text
add;
remove;
clear.
```

Isso pode causar erro.

---

## Mini-cadastro usando iteração

Agora vamos criar um cadastro simples para praticar iteração.

Crie:

```text
src\br\com\curso\aula150\app\CadastroIteracaoOsApp.java
```

Código:

```java
package br.com.curso.aula150.app;

import br.com.curso.aula150.dominio.ordemservico.ResumoOrdemServico;
import br.com.curso.aula150.dominio.ordemservico.StatusOs;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class CadastroIteracaoOsApp {
    public static void main(String[] args) {
        List<ResumoOrdemServico> ordens = new ArrayList<>();

        cadastrar(ordens, new ResumoOrdemServico(
                "OS-2026-0001",
                "Ana Silva",
                LocalDate.of(2026, 12, 10),
                StatusOs.AGENDADA
        ));

        cadastrar(ordens, new ResumoOrdemServico(
                "OS-2026-0002",
                "Carlos Souza",
                LocalDate.of(2026, 12, 11),
                StatusOs.CANCELADA
        ));

        cadastrar(ordens, new ResumoOrdemServico(
                "OS-2026-0003",
                "Mariana Lima",
                LocalDate.of(2026, 12, 12),
                StatusOs.CONCLUIDA
        ));

        System.out.println("Listagem inicial:");
        listar(ordens);

        System.out.println();
        System.out.println("Busca:");
        ResumoOrdemServico encontrada = buscarPorCodigo(ordens, "OS-2026-0001");
        System.out.println(encontrada == null ? "Não encontrada" : encontrada.resumo());

        System.out.println();
        System.out.println("Removendo canceladas...");
        removerPorStatus(ordens, StatusOs.CANCELADA);

        System.out.println();
        System.out.println("Listagem final:");
        listar(ordens);
    }

    private static void cadastrar(List<ResumoOrdemServico> ordens, ResumoOrdemServico os) {
        if (buscarPorCodigo(ordens, os.codigo()) != null) {
            throw new IllegalStateException("OS duplicada: " + os.codigo());
        }

        ordens.add(os);
    }

    private static void listar(List<ResumoOrdemServico> ordens) {
        if (ordens.isEmpty()) {
            System.out.println("Nenhuma OS cadastrada.");
            return;
        }

        for (ResumoOrdemServico os : ordens) {
            System.out.println("- " + os.resumo());
        }
    }

    private static ResumoOrdemServico buscarPorCodigo(List<ResumoOrdemServico> ordens, String codigo) {
        for (ResumoOrdemServico os : ordens) {
            if (os.possuiCodigo(codigo)) {
                return os;
            }
        }

        return null;
    }

    private static void removerPorStatus(List<ResumoOrdemServico> ordens, StatusOs status) {
        Iterator<ResumoOrdemServico> iterator = ordens.iterator();

        while (iterator.hasNext()) {
            ResumoOrdemServico os = iterator.next();

            if (os.possuiStatus(status)) {
                iterator.remove();
            }
        }
    }
}
```

Compile e execute:

```powershell
javac -d out (Get-ChildItem -Recurse -Filter *.java).FullName
java -cp out br.com.curso.aula150.app.CadastroIteracaoOsApp
```

---

## O que este cadastro demonstra

Neste exemplo usamos:

```text
foreach para listar;
foreach para buscar;
Iterator para remover;
foreach indireto para validar duplicidade.
```

Isso é muito comum.

Cada forma de iteração tem seu papel.

---

## Ligação com backend

Em backend, você vai iterar listas para:

```text
montar resposta;
validar itens;
calcular total;
filtrar dados;
criar DTOs;
remover inválidos;
gerar relatório;
agrupar informações;
verificar duplicidade.
```

Mesmo quando você aprender `Stream`, é essencial entender `for`, `foreach` e `Iterator`.

`Stream` não substitui entendimento básico.

---

## Atividade guiada

Faça em ordem.

### Parte 1 — Rodar for tradicional

Execute:

```powershell
java -cp out br.com.curso.aula150.app.ForTradicionalApp
java -cp out br.com.curso.aula150.app.ForErroIndiceApp
```

Observe o índice.

### Parte 2 — Rodar foreach

Execute:

```powershell
java -cp out br.com.curso.aula150.app.ForeachApp
java -cp out br.com.curso.aula150.app.ForeachComObjetosApp
java -cp out br.com.curso.aula150.app.ForeachContagemPorStatusApp
java -cp out br.com.curso.aula150.app.ForeachBuscaApp
java -cp out br.com.curso.aula150.app.ForeachAtualizacaoApp
```

Observe como o código fica mais legível quando não precisa do índice.

### Parte 3 — Rodar Iterator

Execute:

```powershell
java -cp out br.com.curso.aula150.app.IteratorBasicoApp
java -cp out br.com.curso.aula150.app.RemocaoErradaForeachApp
java -cp out br.com.curso.aula150.app.RemocaoComIteratorApp
java -cp out br.com.curso.aula150.app.IteratorRemoverPorStatusApp
```

Observe a diferença entre remoção errada e remoção correta.

### Parte 4 — Rodar remoção de trás para frente

Execute:

```powershell
java -cp out br.com.curso.aula150.app.RemocaoDeTrasParaFrenteApp
```

### Parte 5 — Rodar mini-cadastro

Execute:

```powershell
java -cp out br.com.curso.aula150.app.CadastroIteracaoOsApp
```

---

## Desafio prático

Crie um app chamado:

```text
src\br\com\curso\aula150\app\RelatorioIteracaoOsApp.java
```

Ele deve:

```text
criar uma List<ResumoOrdemServico>;
adicionar pelo menos 6 OS;
usar foreach para listar todas;
usar método contarPorStatus para contar por status;
usar método buscarPorCodigo para buscar uma OS;
usar Iterator para remover todas as OS CANCELADAS;
listar novamente depois da remoção.
```

Critério principal:

```text
usar foreach para listar/buscar/contar e Iterator para remover.
```

---

## Desafio extra

Crie um app chamado:

```text
src\br\com\curso\aula150\app\ComparacaoForForeachIteratorApp.java
```

Ele deve mostrar a mesma lista de códigos sendo percorrida de três formas:

```text
for tradicional;
foreach;
Iterator.
```

A saída deve indicar qual forma está sendo usada.

Exemplo:

```text
FOR TRADICIONAL
0 - OS-2026-0001
1 - OS-2026-0002

FOREACH
OS-2026-0001
OS-2026-0002

ITERATOR
OS-2026-0001
OS-2026-0002
```

Critério principal:

```text
perceber a diferença visual e estrutural entre as três formas.
```

---

## Erros comuns nesta aula

### 1. Usar <= no for

Errado:

```java
i <= lista.size()
```

Correto:

```java
i < lista.size()
```

### 2. Remover dentro de foreach

Evite:

```java
for (String item : lista) {
    lista.remove(item);
}
```

Use `Iterator` ou outra estratégia.

### 3. Chamar next sem hasNext

Evite:

```java
iterator.next();
```

sem verificar antes.

Correto:

```java
while (iterator.hasNext()) {
    String item = iterator.next();
}
```

### 4. Usar for tradicional sem precisar do índice

Se não precisa de índice, `foreach` é mais limpo.

### 5. Usar Iterator para tudo

Iterator é útil, mas para simples listagem, `foreach` é mais legível.

### 6. Confundir alterar objeto com alterar lista

Alterar objeto durante foreach pode ser ok.

Remover/adicionar na lista durante foreach é perigoso.

### 7. Esquecer import de Iterator

Use:

```java
import java.util.Iterator;
```

### 8. Retornar null sem tratar

Se uma busca retorna `null`, trate antes de usar.

---

## Debug recomendado

Use debug em:

```text
ForTradicionalApp.java
ForErroIndiceApp.java
ForeachBuscaApp.java
ForeachAtualizacaoApp.java
IteratorBasicoApp.java
RemocaoErradaForeachApp.java
RemocaoComIteratorApp.java
IteratorRemoverPorStatusApp.java
CadastroIteracaoOsApp.java
```

Breakpoints recomendados:

```java
for (int i = 0; i < lista.size(); i++)

lista.get(i)

for (ResumoOrdemServico os : ordens)

if (os.possuiCodigo(codigo))

Iterator<String> iterator = codigos.iterator()

iterator.hasNext()

iterator.next()

iterator.remove()
```

Observe:

```text
como o índice muda;
como foreach entrega cada objeto;
como Iterator avança;
como remove do Iterator funciona;
como remover direto no foreach dá problema;
como a busca retorna antes de terminar o laço;
como o objeto atualizado continua na lista.
```

---

## Registro rápido da aula

Responda em poucas linhas:

```text
1. Quando usar for tradicional?
2. Quando usar foreach?
3. Quando usar Iterator?
```

---

## Critério de conclusão

Ao final desta aula, você deve conseguir:

```text
explicar iteração;
usar for tradicional com índice;
evitar erro de índice;
usar foreach;
usar foreach com objetos;
contar por status usando foreach;
buscar usando foreach;
atualizar objeto encontrado;
usar Iterator;
explicar hasNext e next;
remover com Iterator;
entender por que remover em foreach é perigoso;
remover de trás para frente com for tradicional;
resolver RelatorioIteracaoOsApp;
resolver ComparacaoForForeachIteratorApp;
fazer um commit limpo da prática.
```

---

## Commit recomendado

Depois de concluir a prática:

```bash
git status
git add labs/m5/aula-150-iteracao-com-for-foreach-e-iterator
git commit -m "Aula 150: iteracao com for foreach e iterator"
git status
```

Se aparecer arquivo `.class` ou pasta `out`, remova e ajuste o `.gitignore`.

---

## Fechamento

A principal ideia desta aula é:

```text
percorrer listas corretamente é uma habilidade básica e essencial para qualquer backend Java.
```

Você aprendeu:

```text
for tradicional quando precisa de índice;
foreach quando precisa apenas dos elementos;
Iterator quando precisa remover durante a iteração.
```

Na próxima aula, vamos aprofundar especificamente remoção segura em listas.

Vamos entender melhor os problemas de remover elementos enquanto percorremos uma coleção e quais estratégias usar em cada cenário.
